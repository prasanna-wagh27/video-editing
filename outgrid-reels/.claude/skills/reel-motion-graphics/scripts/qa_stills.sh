#!/usr/bin/env bash
# usage (from outgrid-reels/): scripts/qa_stills.sh reels/<name> '<props>' f1 f2 ...
# -> reels/<name>/stills/f_<n>.png + stills/sheet.jpg (4 per row). Look at the sheet.
set -euo pipefail
DIR=${1%/}; PROPS=${2:-'{}'}; shift 2
[ -f .browser ] || scripts/find_browser.sh >/dev/null
BROWSER=$(cat .browser); OUT="$DIR/stills"; mkdir -p "$OUT"
for f in "$@"; do
  npx remotion still "$DIR/reel.jsx" "${COMP:-Reel}" "$OUT/f_$f.png" --frame="$f" --public-dir="$DIR/public" --props="$PROPS" --browser-executable="$BROWSER" --log=error >/dev/null
done
n=$#; c=$(( n < 4 ? n : 4 )); ins=(); for f in "$@"; do ins+=(-i "$OUT/f_$f.png"); done
layout=$(python3 -c "print('|'.join(f'{(i%$c)*540}_{(i//$c)*960}' for i in range($n)))")
if [ "$n" -gt 1 ]; then
  ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d]scale=540:-1[v%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[v%d]' $i; done)xstack=inputs=$n:layout=$layout:fill=white" -frames:v 1 "$OUT/sheet.jpg"
else
  ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -vf scale=540:-1 "$OUT/sheet.jpg"
fi
echo "$OUT/sheet.jpg"
