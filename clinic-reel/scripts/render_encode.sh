#!/usr/bin/env bash
# usage: scripts/render_encode.sh entry.jsx CompId name ['<props>'] [check_secs...]
set -euo pipefail
ENTRY=$1; COMP=$2; NAME=$3; PROPS=${4:-'{}'}; shift 4 || true
BROWSER=$(cat .browser)
mkdir -p out stills
npx remotion render "$ENTRY" "$COMP" "out/${NAME}_raw.mp4" --props="$PROPS" --crf=18 --browser-executable="$BROWSER" --log=error
ffmpeg -hide_banner -loglevel error -y -i "out/${NAME}_raw.mp4" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "out/${NAME}.mp4"
rm -f "out/${NAME}_raw.mp4"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact "out/${NAME}.mp4"
ffmpeg -hide_banner -i "out/${NAME}.mp4" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
if [ $# -gt 0 ]; then
  ins=(); for t in "$@"; do ins+=(-ss "$t" -i "out/${NAME}.mp4"); done
  n=$#
  ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d:v]trim=end_frame=1,scale=432:-1[v%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[v%d]' $i; done)hstack=inputs=$n" -frames:v 1 "stills/check_${NAME}.jpg"
  echo "stills/check_${NAME}.jpg"
fi
