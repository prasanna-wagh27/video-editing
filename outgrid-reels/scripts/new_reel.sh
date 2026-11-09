#!/usr/bin/env bash
# usage (from outgrid-reels/): scripts/new_reel.sh <reel-name> path/to/voiceover.mp3 [path/to/script.txt]
# Creates reels/<reel-name>/ from shared/templates/starter-reel.jsx with the VO, fonts symlink and folders.
set -euo pipefail
NAME=$1; VO=$2; SCRIPT=${3:-}
D="reels/$NAME"; [ -e "$D" ] && { echo "$D already exists" >&2; exit 1; }
mkdir -p "$D/public" "$D/out"
cp shared/templates/starter-reel.jsx "$D/reel.jsx"
cp "$VO" "$D/public/vo.mp3"
ln -s ../../../shared/fonts "$D/public/fonts"
[ -n "$SCRIPT" ] && cp "$SCRIPT" "$D/script.txt"
echo "Created $D. VO pauses (map these to script phrases for SEGS):"
scripts/vo_pauses.sh "$D/public/vo.mp3"
