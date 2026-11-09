#!/usr/bin/env bash
# usage: scripts/vo_pauses.sh voice.mp3 [noise_dB=-30] [min_pause_s=0.18]
# Prints speech segments between pauses as `[start, end],` (seconds). Map them to script phrases -> SEGS.
set -euo pipefail
IN=$1; NOISE=${2:--30}; MIN=${3:-0.18}
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
ffmpeg -hide_banner -i "$IN" -af "silencedetect=noise=${NOISE}dB:d=${MIN}" -f null - 2>&1 \
 | grep -oE "silence_(start|end): [0-9.]+" | awk -v dur="$DUR" '
   BEGIN{start=0; inSil=0}
   $1=="silence_start:"{ if($2>start+0.05) printf "[%.2f, %.2f],\n", start, $2; inSil=1 }
   $1=="silence_end:"{ start=$2; inSil=0 }
   END{ if(!inSil && dur>start+0.05) printf "[%.2f, %.2f],\n", start, dur }'
echo "# duration: $DUR s" >&2
