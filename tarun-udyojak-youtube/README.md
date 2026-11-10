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

## Editing rules v2 (from feedback on the Turf video)

1. **Less text.** The voiceover tells the sentence; the screen shows a picture, a number, or 1–5 keywords. No full sentences on screen (we don't burn in subtitles). If a line would need more than ~5 words, show a photo, logo, icon or diagram instead.
2. **More colour, not more colours.** Colour comes from *colour-blocked backdrops*: rotate scenes between dark, **paper** `#F2ECDF`, full **brand yellow**, and full-bleed **photo**. Each scene uses at most one accent besides yellow (coral `#FF6B57` = loss, sky `#4DA8FF` = info, pink `#FF7A9A` = people/brands, violet for schools). Still no green in our own UI. Real photos and brand logos keep their real colours.
3. **Real images and logos wherever possible.** Photos of the actual thing (place, product, company, person) beat drawn icons. Logos for every company named. Fetch with `scripts/fetch_media.py`; every file is logged in `videos/<v>/credits.md` (paste into the description). Logos only refer to the company, never imply endorsement.
4. **Explainer-style editing (Vox-inspired, not copied):** photo prints with tape and slow Ken Burns push, torn paper clippings with a marker highlight, pointer callouts on photos, camera push-ins (`Cam`) into the detail being discussed, colour wipes between chapters, film grain over everything, one big word/number at a time.
5. **Sound effects on every visual event.** Pop when something appears, swish/whoosh on moves and cuts, shutter on photos, paper on clippings, stamp/thud on big claims, tick/coin/cash on numbers and money, ding/chime on answers, buzz on losses, riser into reveals. Keep them under the voice (v 0.3–0.6). All SFX are synthesised by `scripts/make_sfx.py` (no copyright).
6. Keep what worked: diagrams, counters, timelines, motion on every beat.

## Layout

| Path | What |
|---|---|
| `shared/kit.jsx` | Tokens, `useT()` (VO seconds), motion helpers, Bg/Chrome/Scenes, Card, Head, Hi (highlighter), Stamp, Count, Chip, line icons |
| `shared/vox.jsx` | v2 pieces: `Sfx`, `Backdrop` (paper/yellow), `PhotoBg`, `Photo`, `Sticker`, `Logo`, `Pointer`, `Word`, `Clip`, `Cam`, `Wipe`, `Grain` |
| `shared/sfx/` | 20 synthesised sound effects (`scripts/make_sfx.py`); each video links `public/sfx -> ../../../shared/sfx` |
| `scripts/fetch_media.py` | Search Wikimedia Commons (numbered contact sheet), download photos/logos, simple-icons brand logos, auto-credits |
| `scripts/make_sfx.py` | Regenerates the SFX library |
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

# real media
python3 scripts/fetch_media.py search "pune street food stall"            # prints names + /tmp/tu-media/sheet.jpg
python3 scripts/fetch_media.py get $D stall "File:<name from the list>"   # -> $D/public/img/stall.jpg + credits.md
python3 scripts/fetch_media.py icon $D zomato zomato                      # simple-icons logo in brand colour
```

New video folder: `mkdir -p videos/<v>/public && ln -s ../../../shared/fonts videos/<v>/public/fonts && ln -s ../../../shared/sfx videos/<v>/public/sfx`.
Photo-heavy videos run ~10 Mbps at CRF 18. GitHub refuses files over 100 MB, so for long videos upload the CRF 18 master to YouTube and commit a lighter copy (`CRF=23`) if it must live in git.
`render.sh` renders the picture muted, then an audio-only pass of the same composition to collect every `<Sfx>` cue, and mixes VO + ducked music + SFX. Network note: the cloud environment `video-editing` allows `commons.wikimedia.org`, `upload.wikimedia.org`, `thumb.wikimedia.org`.

Cues in `video.jsx` are tied to words: `WT(18, 'लाईटचे')` = when sentence 18 says that word. If something lands early or late, add or subtract seconds there.

## Videos

| Folder | Length | Output |
|---|---|---|
| `videos/turf-business/` | 4:27 | `out/turf_business_v1.mp4`, captions `out/turf_business.mr.srt` |
| `videos/_style-demo/` | 0:13 | `out/style_demo.mp4`: v2 look test (photo, paper, yellow scenes, logos, SFX) |

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
