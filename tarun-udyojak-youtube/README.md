# Tarun Udyojak: YouTube videos

Long-form YouTube videos for the **तरुण उद्योजक** channel. Built with Remotion + React + FFmpeg, like `../outgrid-reels/`, but kept separate.

## Brand rules

| | |
|---|---|
| Format | 16:9, 1920×1080, 30 fps |
| Font | Anek Devanagari for all text (`shared/fonts/AnekDevanagari.ttf`) |
| Background | near-black (#0B0B0B to #121213), not pure black |
| Colours | white `#FFFFFF` + brand yellow `#FFD014`; no green |
| Feel | clean, lots of space, one idea per frame |

## Videos

| Folder | Status |
|---|---|
| `videos/turf-business/` | Style frames A / B / C for review (`frames/compare.jpg`), all for the "₹1,200 चं गणित" beat |

## Render the style frames

```bash
cd tarun-udyojak-youtube && npm i --no-audit --no-fund
D=videos/turf-business
npx remotion still $D/style-frames.jsx StyleA $D/frames/style-A.png --public-dir=$D/public --browser-executable="$(bash ../outgrid-reels/scripts/find_browser.sh)"
```
