#!/usr/bin/env bash
# Fetches OpenAI Whisper "small" (CTranslate2 int8, MIT) from npm (the only model host this sandbox reaches)
# into .cache/whisper-small-ct2/ (gitignored) and checks its sha256. Needs: pip install faster-whisper
set -euo pipefail
D=.cache/whisper-small-ct2; [ -f "$D/model.bin" ] && { echo "$D ready"; exit 0; }
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT; mkdir -p "$D"
for i in 0 1 2 3; do
  mkdir -p "$T/p$i"; curl -sSf --retry 3 "https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p$i/-/shortmovie-telop-model-p$i-1.0.0.tgz" | tar xz -C "$T/p$i"
done
cp "$T"/p0/package/{tokenizer.json,vocabulary.json,config.json,preprocessor_config.json} "$D/"
cat "$T"/p0/package/model.bin.part0 "$T"/p1/package/model.bin.part1 "$T"/p2/package/model.bin.part2 "$T"/p3/package/model.bin.part3 > "$D/model.bin"
[ "$(sha256sum "$D/model.bin" | cut -d' ' -f1)" = "$(cat "$T"/p0/package/model.sha256)" ] || { echo "checksum mismatch" >&2; rm -f "$D/model.bin"; exit 1; }
echo "$D ready"
