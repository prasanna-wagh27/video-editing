#!/usr/bin/env bash
# usage: scripts/render_encode.sh entry.jsx CompId name ['<props>'] [check_secs...]
# Renders muted video in chunks (each retried, since a headless tab can stall on long renders),
# joins them, muxes public/vo.mp3, encodes H.264/AAC faststart, then verifies.
set -euo pipefail
ENTRY=$1; COMP=$2; NAME=$3; PROPS=${4:-'{}'}; shift 4 || true
BROWSER=$(cat .browser); CHUNK=${CHUNK:-500}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p out stills
# frame count and fps are read from the entry's `const TOTAL = N` and `const FPS = N`
TOTAL=$(grep -oE 'const TOTAL = [0-9]+' "$ENTRY" | grep -oE '[0-9]+$')
FPS=$(grep -oE 'const FPS = [0-9]+' "$ENTRY" | grep -oE '[0-9]+$')
echo "frames=$TOTAL fps=$FPS"
i=0
for ((a=0; a<TOTAL; a+=CHUNK)); do
  b=$(( a+CHUNK-1 < TOTAL-1 ? a+CHUNK-1 : TOTAL-1 ))
  f=$(printf "%s/part_%03d.mp4" "$TMP" $i)
  for try in 1 2 3; do
    if npx remotion render "$ENTRY" "$COMP" "$f" --frames="$a-$b" --muted --props="$PROPS" --crf=16 --browser-executable="$BROWSER" --log=error >"$TMP/log" 2>&1; then echo "frames $a-$b ok"; break; fi
    echo "frames $a-$b failed (try $try)"; tail -3 "$TMP/log"; [ $try = 3 ] && exit 1
  done
  echo "file '$f'" >> "$TMP/list.txt"; i=$((i+1))
done
DUR=$(python3 -c "print($TOTAL/$FPS)")
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -i public/vo.mp3 -map 0:v -map 1:a \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -af apad -t "$DUR" -movflags +faststart "out/${NAME}.mp4"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames:format=duration -of compact "out/${NAME}.mp4"
ffmpeg -hide_banner -i "out/${NAME}.mp4" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
if [ $# -gt 0 ]; then
  ins=(); for t in "$@"; do ins+=(-ss "$t" -i "out/${NAME}.mp4"); done
  n=$#
  ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d:v]trim=end_frame=1,scale=432:-1[v%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[v%d]' $i; done)hstack=inputs=$n" -frames:v 1 "stills/check_${NAME}.jpg"
  echo "stills/check_${NAME}.jpg"
fi
