#!/usr/bin/env bash
# usage (from tarun-udyojak-youtube/): scripts/render.sh videos/<name> <out_name> [composition=Turf]
# Chunked muted render -> concat -> mix VO + music (music ducked under VO) -> loudnorm -14 LUFS -> H.264/AAC faststart.
set -euo pipefail
DIR=${1%/}; NAME=$2; COMP=${3:-Turf}; CHUNK=${CHUNK:-1000}
B=$(bash ../outgrid-reels/scripts/find_browser.sh)
TMP="$DIR/stills/chunks"; mkdir -p "$TMP" "$DIR/out"; rm -f "$TMP"/*.mp4 "$TMP"/list.txt
TOTAL=$(npx remotion compositions "$DIR/video.jsx" --public-dir="$DIR/public" --browser-executable="$B" 2>/dev/null | awk -v c="$COMP" '$1==c{print $4}')
echo "frames: $TOTAL"
for ((a=0; a<TOTAL; a+=CHUNK)); do
  b=$(( a+CHUNK-1 < TOTAL-1 ? a+CHUNK-1 : TOTAL-1 )); f="$TMP/c_$(printf %05d $a).mp4"
  for try in 1 2 3; do
    npx remotion render "$DIR/video.jsx" "$COMP" "$f" --frames="$a-$b" --muted --props='{"withAudio":false}' --public-dir="$DIR/public" \
      --browser-executable="$B" --concurrency=4 --crf=14 --log=error && break
    echo "retry $a-$b ($try)"
  done
  echo "file '$(basename "$f")'" >> "$TMP/list.txt"; echo "rendered $a-$b"
done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
DUR=$(python3 -c "print($TOTAL/30)")
ffmpeg -hide_banner -loglevel error -y -i "$TMP/video.mp4" -i "$DIR/public/vo.mp3" -i "$DIR/public/music.wav" -filter_complex "
 [1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:$DUR,asplit=2[vo][sc];
 [2:a]aresample=48000,volume=0.25,atrim=0:$DUR,afade=t=out:st=$(python3 -c "print($TOTAL/30-2.5)"):d=2.5[mu];
 [mu][sc]sidechaincompress=threshold=0.025:ratio=4:attack=40:release=700[duck];
 [vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
 -map 0:v -map "[a]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -t "$DUR" "$DIR/out/$NAME.mp4"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact "$DIR/out/$NAME.mp4"
ffmpeg -hide_banner -i "$DIR/out/$NAME.mp4" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
echo "$DIR/out/$NAME.mp4"
