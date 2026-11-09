#!/usr/bin/env bash
# usage: scripts/qa_stills.sh entry.jsx CompId '<props>' f1 f2 ...   -> stills/f_<n>.png + stills/sheet.jpg
set -euo pipefail
ENTRY=$1; COMP=$2; PROPS=${3:-'{}'}; shift 3
BROWSER=$(cat .browser)
mkdir -p stills
for f in "$@"; do
  npx remotion still "$ENTRY" "$COMP" "stills/f_$f.png" --frame="$f" --props="$PROPS" --browser-executable="$BROWSER" --log=error >/dev/null
done
ins=(); for f in "$@"; do ins+=(-i "stills/f_$f.png"); done
n=$#; cols=$(( n < 4 ? n : 4 ))
ffmpeg -hide_banner -loglevel error -y "${ins[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d]scale=540:-1[v%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[v%d]' $i; done)xstack=inputs=$n:layout=$(python3 -c "
n=$n;c=$cols
print('|'.join(f'{(i%c)*540}_{(i//c)*960}' for i in range(n)))")" -frames:v 1 stills/sheet.jpg 2>/dev/null || true
echo "stills/sheet.jpg"
