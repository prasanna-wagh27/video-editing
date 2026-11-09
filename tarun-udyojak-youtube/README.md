# Tarun Udyojak: YouTube videos

Long-form YouTube explainers for the **तरुण उद्योजक** channel, built in code with Remotion + React + FFmpeg. This is a separate workspace from `../outgrid-reels/`, though it borrows that folder's browser finder.

## Brand rules

| | |
|---|---|
| Format | 16:9, 1920×1080, 30 fps |
| Font | Anek Devanagari for all text (`shared/fonts/AnekDevanagari.ttf`) |
| Background | near-black `#0E0E0F` with a faint dot grid and slow yellow glow, not pure black |
| Main colours | white `#FFFFFF` + brand yellow `#FFD014` |
| Accents (sparing) | red `#FF5A52` = loss/cost, sky `#62B6FF` = rain/coaching, violet `#A78BFA` = schools. No green. |
| Style | Direction B "soft UI cards" + C-style bars/timelines for numbers (see `videos/turf-business/frames/`) |
| Chrome | `तरुण उद्योजक` mark top-left, chapter chip top-right, thin progress bar with chapter ticks at the bottom |

## Layout

| Path | What |
|---|---|
| `shared/kit.jsx` | Tokens, `useT()` (VO seconds), motion helpers, Bg/Chrome/Scenes, Card, Head, Hi (highlighter), Stamp, Count, Chip, line icons |
| `scripts/align_vo.py` | Script + VO → `timing.json` (sentence and word times from silence gaps, no ASR needed) |
| `scripts/make_music.py` | Original background music, synthesised from scratch (no samples → no copyright issues) |
| `scripts/make_srt.py` | `timing.json` → `.srt` captions for YouTube |
| `scripts/stills.sh` | QA frames at given seconds → `stills/sheet.jpg` |
| `scripts/render.sh` | Chunked render → VO + ducked music → loudnorm −14 LUFS → H.264/AAC MP4 |
| `videos/<name>/` | `video.jsx`, `script.txt`, `timing.json`, `public/{vo.mp3,music.wav,fonts}`, `out/` |

## Make / re-render a video

```bash
cd tarun-udyojak-youtube && npm i --no-audit --no-fund                 # first time
D=videos/turf-business
python3 scripts/align_vo.py $D/public/vo.mp3 $D/script.txt $D/timing.json  # only when VO/script change
python3 scripts/make_music.py $D/public/music.wav 267                      # only to regenerate music
scripts/stills.sh $D 10 50 90                                              # check frames
scripts/render.sh $D turf_business_v1                                      # ~25 min on 4 cores
```

Cues in `video.jsx` are tied to words: `WT(18, 'लाईटचे')` = when sentence 18 says that word. If something lands early or late, add or subtract seconds there.

## Videos

| Folder | Length | Output |
|---|---|---|
| `videos/turf-business/` | 4:27 | `out/turf_business_v1.mp4`, captions `out/turf_business.mr.srt` |

### Turf business: scene timeline

| # | Scene | Starts | What happens |
|---|---|---|---|
| 1 | hook | 0:00 | ₹20 लाख counts up, line-art turf draws and its floodlights switch on, "थांबा!" stamp + shake |
| 2 | mistake | 0:05 | "Real Estate बिझनेस?" highlight, coins fall into a building, "सर्वात मोठी चूक" stamp |
| 3 | claim | 0:11 | Search bar typing, internet comments, 12–18 महिने calendar, red "?" + "पण प्रत्यक्षात" |
| 4 | airline | 0:25 | "Turf =" Real Estate card struck out → Airline card flips in, plane crosses |
| 5 | plane | 0:39 | Mumbai → Delhi flight path, 120-seat map, 50 empty seats turn red, "नुकसान कायमचं" |
| 6 | hour | 0:51 | Evening slots, time cursor, 7–8 PM empty → ₹1,200 becomes ₹0, cost meters keep running |
| 7 | math | 1:09 | "खरं गणित" chapter card with orbiting maths symbols |
| 8 | breakdown | 1:12 | ₹1,200 ticks down to ₹1,000 as light/app/grass rows slide in |
| 9 | fixed | 1:37 | Rent ₹50k + staff ₹30k = ₹80k → 80-hour calendar → ≈ 3 hours a day |
| 10 | breakeven | 1:58 | 6 PM–12 AM bar: 3 red cost hours, 3 yellow profit hours, break-even marker at 9 PM |
| 11 | problem | 2:15 | "पण खरी अडचण इथेच", 6 AM–12 AM strip: busy evenings, empty days, empty plane |
| 12 | monsoon | 2:28 | Rain, bookings cancelled, revenue bar halves, landlord "नाही!", money from your pocket |
| 13 | reality | 2:43 | 18-month promise crossed out, bar grows to 3–4 years, shops shutter |
| 14 | ten | 2:56 | 100-dot grid, 10 light up, 3 strategy cards |
| 15 | s1 | 3:05 | Dead time: morning coaching (sky) + afternoon schools (violet) fill the day, hours counter |
| 16 | s2 | 3:24 | Fixed rent struck → revenue-share donut, profit/loss shared, "टेन्शन नाही" |
| 17 | s3 | 3:42 | Small bookings struck → 8-team bracket → trophy, coin stacks, sponsors |
| 18 | takeaway | 3:58 | Hourglass, "जागा नाही, वेळ विकत आहात", 18 slots fill 6 AM–12 AM |
| 19 | cta | 4:12 | Save + share, then subscribe card: cursor click, bell ring, end card to 4:27 |
