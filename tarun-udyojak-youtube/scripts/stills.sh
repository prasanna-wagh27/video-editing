#!/usr/bin/env bash
# usage (from tarun-udyojak-youtube/): [COMP=Id] scripts/stills.sh videos/<name> <seconds...>  -> videos/<name>/stills/sheet.jpg (3 per row)
set -euo pipefail
DIR=${1%/}; shift
B=$(bash ../outgrid-reels/scripts/find_browser.sh)
mkdir -p "$DIR/stills"; ins=(); n=0
for s in "$@"; do
  f=$(python3 -c "print(round($s*30))")
  npx remotion still "$DIR/video.jsx" "${COMP:-Turf}" "$DIR/stills/s_$s.png" --frame="$f" --public-dir="$DIR/public" --browser-executable="$B" --log=error --props='{"withAudio":false}' >/dev/null
  ins+=(-i "$DIR/stills/s_$s.png"); n=$((n+1))
done
c=$(( n < 3 ? n : 3 ))
layout=$(python3 -c "print('|'.join(f'{(i%$c)*640}_{(i//$c)*360}' for i in range($n)))")
ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d]scale=640:-1[v%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[v%d]' $i; done)xstack=inputs=$n:layout=$layout:fill=white" -frames:v 1 "$DIR/stills/sheet.jpg"
echo "$DIR/stills/sheet.jpg"
