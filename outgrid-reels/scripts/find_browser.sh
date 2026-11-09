#!/usr/bin/env bash
# Finds a headless Chrome for Remotion and caches its path in ./.browser
set -euo pipefail
for c in /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell \
         "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac*/chrome-headless-shell \
         "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell \
         "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/google-chrome /usr/bin/chromium; do
  if [ -x "$c" ]; then echo "$c" > .browser; echo "$c"; exit 0; fi
done
echo "No browser found. Install Chrome or run: npx playwright install chromium-headless-shell" >&2; exit 1
