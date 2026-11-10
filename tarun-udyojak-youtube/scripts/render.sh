#!/usr/bin/env bash
# usage (from tarun-udyojak-youtube/): scripts/render.sh videos/<name> <out_name> [composition=Turf]
# Chunked muted render -> concat -> audio-only pass for <Sfx> cues -> mix VO + music (ducked under VO) + SFX
# -> loudnorm -14 LUFS -> H.264/AAC faststart. public/vo.mp3 and public/music.wav are optional.
# env: SKIP_VIDEO=1 (reuse stills/chunks/video.mp4, redo audio only), CHUNK (frames per chunk, 1000), MUSIC_VOL (0.25), SFX_VOL (1.0), CRF (18; raise to 20-21 if the MP4 must stay under GitHub's 100 MB)
set -euo pipefail
DIR=${1%/}; NAME=$2; COMP=${3:-Turf}; CHUNK=${CHUNK:-1000}; MUSIC_VOL=${MUSIC_VOL:-0.25}; SFX_VOL=${SFX_VOL:-1.0}
B=$(bash ../outgrid-reels/scripts/find_browser.sh)
TMP="$DIR/stills/chunks"; mkdir -p "$TMP" "$DIR/out"; rm -f "$TMP"/sfx.wav
[ "${SKIP_VIDEO:-0}" = 1 ] && [ -f "$TMP/video.mp4" ] || { rm -f "$TMP"/*.mp4 "$TMP"/list.txt; SKIP_VIDEO=0; }
R=(--public-dir="$DIR/public" --browser-executable="$B" --log=error --props='{"withAudio":false}')
TOTAL=$(npx remotion compositions "$DIR/video.jsx" --public-dir="$DIR/public" --browser-executable="$B" 2>/dev/null | awk -v c="$COMP" '$1==c{print $4}')
echo "frames: $TOTAL"
if [ "${SKIP_VIDEO:-0}" != 1 ]; then
for ((a=0; a<TOTAL; a+=CHUNK)); do
  b=$(( a+CHUNK-1 < TOTAL-1 ? a+CHUNK-1 : TOTAL-1 )); f="$TMP/c_$(printf %05d $a).mp4"
  for try in 1 2 3; do
    npx remotion render "$DIR/video.jsx" "$COMP" "$f" --frames="$a-$b" --muted "${R[@]}" --concurrency=4 --crf=14 && break
    echo "retry $a-$b ($try)"
  done
  echo "file '$(basename "$f")'" >> "$TMP/list.txt"; echo "rendered $a-$b"
done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
fi

# sound effects: audio-only render of the same composition (VO/music off via withAudio=false, only <Sfx> cues remain)
for try in 1 2 3; do
  npx remotion render "$DIR/video.jsx" "$COMP" "$TMP/sfx.wav" --codec=wav "${R[@]}" --timeout=300000 --concurrency=2 && break
  echo "retry sfx ($try)"
done
[ -f "$TMP/sfx.wav" ] || { echo "sfx pass failed"; exit 1; }
echo "sfx track done"

DUR=$(python3 -c "print($TOTAL/30)"); FO=$(python3 -c "print(max(0, $TOTAL/30-2.5))")
VO="$DIR/public/vo.mp3"; MU="$DIR/public/music.wav"
IN=(-i "$TMP/video.mp4"); k=1; FC=""; MIX=""
if [ -f "$VO" ]; then IN+=(-i "$VO"); FC+="[$k:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:$DUR,asplit=2[vo][sc];"; MIX+="[vo]"; VOK=1; k=$((k+1)); else VOK=0; fi
if [ -f "$MU" ]; then
  IN+=(-i "$MU"); FC+="[$k:a]aresample=48000,aformat=channel_layouts=stereo,volume=$MUSIC_VOL,apad,atrim=0:$DUR,afade=t=out:st=$FO:d=2.5[mu];"; k=$((k+1))
  if [ $VOK = 1 ]; then FC+="[mu][sc]sidechaincompress=threshold=0.025:ratio=4:attack=40:release=700[duck];"; MIX+="[duck]"; else MIX+="[mu]"; fi
fi
IN+=(-i "$TMP/sfx.wav"); FC+="[$k:a]aresample=48000,aformat=channel_layouts=stereo,volume=$SFX_VOL,apad,atrim=0:$DUR[fx];"; MIX+="[fx]"
N=$(grep -o '\[[a-z]*\]' <<< "$MIX" | wc -l)
FC+="${MIX}amix=inputs=$N:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]"
ffmpeg -hide_banner -loglevel error -y "${IN[@]}" -filter_complex "$FC" \
 -map 0:v -map "[a]" -c:v libx264 -crf ${CRF:-18} -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -t "$DUR" "$DIR/out/$NAME.mp4"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact "$DIR/out/$NAME.mp4"
ffmpeg -hide_banner -i "$DIR/out/$NAME.mp4" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
echo "$DIR/out/$NAME.mp4"
