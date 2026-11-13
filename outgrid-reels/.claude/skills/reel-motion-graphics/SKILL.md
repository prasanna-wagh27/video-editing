---
name: reel-motion-graphics
description: Build code-driven motion-graphics videos (Instagram Reels, YouTube Shorts, 9:16 or 16:9 explainers) with Remotion + React + FFmpeg, timed to a voiceover, with karaoke captions, highlight pills, app/phone mockups, animated scene cards and Outgrid Labs branding. Use this whenever the user wants to turn a script and/or voiceover (MP3/WAV) into an animated reel or explainer video, recreate a motion-graphics style from reference images or a reference video, make a Hindi/Marathi/Hinglish/Devanagari captioned reel, or mentions Remotion, HyperFrames, "AI video editing workflow", karaoke captions, Outgrid reels, or rendering a video from code, even if they never say "Remotion".
---

# Reel Motion Graphics (Remotion + FFmpeg) — Outgrid Labs

This skill makes a finished MP4 from a **script + voiceover + style references**. Every frame is code: each scene is a function of the frame number.

```
inputs → new reel folder → VO timing → storyboard → scenes → QA stills → fix → render → encode → spot-check → deliver
```

## 0. Where things live (the `outgrid-reels/` workspace)

```
outgrid-reels/
  .claude/skills/reel-motion-graphics/   this skill (scripts/ and assets/ are copies of the workspace files)
  package.json                           remotion@4.0.300, @remotion/cli@4.0.300, react@18.3.1, react-dom@18.3.1 (pinned)
  shared/kit.jsx                         brand, fonts, helpers, captions, HUD, transitions, chat mockups, icons, ReelVideo, BrandOutro
  shared/fonts/                          AnekDevanagari.ttf (default), Baloo2.ttf
  shared/brand/outgrid-brand-sheet.png   logo reference (mark + lockups, @outgridlabs)
  shared/templates/starter-reel.jsx      start every new reel from this (uses the kit), light cream style
  shared/lean.jsx                        LEAN style kit (dark, premium): tokens, Glass, Chip, Alert, icons, real logos, TextHook, LeanVideo, LeanOutro
  shared/templates/lean-reel.jsx         starter for the lean style (STYLE=lean scripts/new_reel.sh …)
  shared/logos/                          real logo SVGs (99acres, Excel); reels link it as public/logos
  shared/templates/food-app-reel.jsx     original single-file reel (7 scenes) — scene ideas
  scripts/                               new_reel.sh, vo_pauses.sh, qa_stills.sh, render_encode.sh, find_browser.sh
  reels/<name>/                          reel.jsx, script.txt, public/vo.mp3, public/fonts -> ../../../shared/fonts, out/*.mp4
```

Run every script **from `outgrid-reels/`**. Finished example: `reels/clinic-whatsapp-ai/` (68 s Marathi reel, 10 scenes + brand outro). Read it and the kit before writing scenes.

| Script | What it does |
|---|---|
| `[STYLE=lean] scripts/new_reel.sh <name> voice.mp3 [script.txt]` | Creates `reels/<name>/` from the starter (lean: dark template + logos link), copies the VO, links fonts, prints VO pauses |
| `scripts/vo_pauses.sh voice.mp3 [noise_dB=-30] [min_pause_s=0.18]` | Speech segments between pauses as `[start, end],` lines |
| `scripts/qa_stills.sh reels/<name> '<props>' f1 f2 …` | Renders frames → `reels/<name>/stills/sheet.jpg` |
| `scripts/render_encode.sh reels/<name> <out_name> ['<props>'] [secs…]` | Chunked render (with retries) → VO mux → H.264/AAC faststart → ffprobe + volumedetect → check sheet |
| `scripts/find_browser.sh` | Finds headless Chrome, caches it in `./.browser` (other scripts call it automatically) |

First time on a machine: `cd outgrid-reels && npm i --no-audit --no-fund`.

---

## 1. Collect inputs (ask once, then default)

| Input | Default | Notes |
|---|---|---|
| Script text | — (required) | Save as `reels/<name>/script.txt`. Split into spoken phrases → caption segments. |
| Voiceover audio | none → silent with captions | No VO: time captions at ~2.5 words/s. |
| Style | **lean** (dark, `shared/lean.jsx`) for new reels unless the user asks for the light cream style | Lean = §6.7. |
| Style references | the user's images/video if given | Images: palette, type, card shapes. Video: `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',scale=540:-1" -vsync vfr stills/ref_%02d.jpg` |
| Aspect | 9:16, 1080×1920, 30 fps | All layout numbers assume 1080×1920. |
| Font | **Anek Devanagari for everything** (user's choice), including Latin and the brand lockup | Baloo 2 available via `--props='{"font":"baloo"}'` |
| Branding | **Outgrid Labs** watermark + `@outgridlabs` + brand outro (already in the kit) | Don't invent other brands; client names in mockups are generic ("Your Clinic") unless the user gives one. |
| Third-party brand logos (WhatsApp, 99acres, Excel, Facebook…) | **real logos** (the user asks for them every time) | Sources in §6.4. Never emoji. |

Script hygiene: keep the user's wording. Only change what they ask for; fix obvious typos only.

---

## 2. New reel

```bash
cd outgrid-reels
scripts/new_reel.sh <project-name> /path/to/voice.mp3 /path/to/script.txt
```

Then edit `reels/<project-name>/reel.jsx`. It imports everything shared from `../../shared/kit.jsx`; the reel file holds only SEGS, CUTS/KEYS, project-specific drawings and scenes. Don't fork the kit per reel. If a kit change is needed, make it backward compatible (props with defaults) because every reel imports it.

---

## 3. Fonts

The kit loads fonts with the `FontFace` API inside `delayRender` from the reel's `public/fonts` (symlink to `shared/fonts`), plus a 30 s safety `continueRender` so a stalled fetch can't hang a tab.

| Need | Font | Download (Google Fonts repo, raw GitHub) |
|---|---|---|
| Everything (default) | Anek Devanagari (variable 100–800) | `https://raw.githubusercontent.com/google/fonts/main/ofl/anekdevanagari/AnekDevanagari%5Bwdth%2Cwght%5D.ttf` |
| Round/friendly alt | Baloo 2 (variable 400–800) | `https://raw.githubusercontent.com/google/fonts/main/ofl/baloo2/Baloo2%5Bwght%5D.ttf` |

- Montserrat/Inter have **no Devanagari** (tofu). The user asked for Anek even for the brand wordmark — don't reintroduce Inter.
- Weight **600** for headlines and captions (800 was "too bold"). 700–800 only for small UI labels inside mockups.
- Anek sits high: Latin brand text gets `paddingTop: '0.12em'` (the kit's `BRAND` style); pills/stamps get 4–14 px top padding.
- To offer font choices, render the same frame in each and stitch them.

---

## 4. Voiceover timing (no Whisper needed)

```bash
scripts/vo_pauses.sh reels/<name>/public/vo.mp3
```

1. Split the script at punctuation (`. , ? ! … —`) into clauses.
2. Map segments to clauses by duration vs word count (~2.5–3.5 words/s; a 0.5–0.9 s segment is 2–3 words).
3. More clauses than segments → merge neighbours spoken without a pause. More segments → the narrator paused mid-sentence; split.
4. Counts far off → retune noise (`-35`, `-28`) and min pause (`0.15`–`0.3`). Clinic reel mapped 27/27 at `-30 0.18`.
5. A long first segment holding two clauses: rerun on just that span with `-24 0.06` to find the dip.

Write `SEGS = [[start, end, 'caption with *highlight* words'], …]`. `buildChunks(SEGS)` estimates word times by character length (fine for clean narration; Whisper word timestamps if drift is reported, needs approval for the download). Drop standalone `—` from caption text (it becomes its own "word").

Caption text may differ from audio (e.g. hidden brand names) — tell the user the audio still says it.

---

## 5. Storyboard

Scene table first. **Cut scenes inside VO pauses** (midpoint of the gap between two SEGS):

```js
const KEYS = ['hook', …, 'cta', 'outro'];
const CUTS = [0, 7.9, 14.95, …, OUTRO_AT, OUTRO_AT + 2.4];   // seconds
const SC = scenesFromCuts(KEYS, CUTS);                        // {key: [fromFrame, durFrames]}
```

Inside a scene `F = useCurrentFrame() + from` is the absolute frame, so every cue is in VO seconds: `pop(F, 12.0)`, `rise(F, 9.9)`, `<Hi t={10.05}>`. Re-timing = editing seconds. Animate each beat 0.1–0.3 s **before** its word.

`TOTAL` = last cut in frames. The brand outro starts ~0.45 s after the last spoken word and lasts 2.4 s.

### Scene archetypes (copy from the example reels)

| Archetype | Where | Use for |
|---|---|---|
| Hook: headline + rotated card with highlight + stamp/✕ badge | clinic `Hook`, food `Hook` | Opening claim / "not enough!" |
| Night panel (dark card, clock, moon, stars) + search bar typing + result card + tap ripple | clinic `Night` | "Customer has a problem at 11 PM" |
| Phone chat: messages that grow and scroll, typing dots, AI tag, appointment card + popped-out ticket callout | clinic `ChatSc`, kit `Phone/ChatScreen/Msg/Typing/Divider` | Showing an AI assistant / WhatsApp flow |
| Analog clock + notification banner + walk along a path to a building | clinic `Reminder` | Reminders, "arrived on time" |
| Document + list inside chat | clinic `Rx`, kit `DocCard` | Prescriptions, invoices, reports |
| Calendar flip + "+N days" chip | clinic `Followup` | Time passing |
| Avatar + hearts + 5-star review card | clinic `Review` | Happy customer, reviews |
| Month chips + notification + returning customer | clinic `Recall` | Repeat business, retention |
| Dimmed card vs big highlighted card with icon ring | clinic `Lesson` | "Not X, but Y" insight |
| Contrast skyline vs shops | food `Cities` | "They have it, we don't" |
| Benefit rows → big card with coins | food `Benefits` | Payoffs |
| Objection cards → strike + stamp | food `Objection` | "You'd think it needs X… no!" |
| 3 steps + growth bars + trend line | food `Mvp` | Process / roadmap |
| CTA: yellow comment pill + dark DM pill + `@outgridlabs` pill | clinic `Cta` | Ending ask |
| Brand outro: mark spin-in, "Outgrid Labs", underline, handle, optional CTA chip | kit `BrandOutro` | Always last |

Global overlays (from `ReelVideo`): `Bg` (grid + drifting glows + faint rotating Outgrid mark), `Watermark` (top-left lockup), `Dashes` (one per story scene), `Captions`. `SceneWrap`: push-in (slide up 60 px, 1.05→1) / lift-out (−50 px, →0.96) + slow 1.5% camera drift.

---

## 6. Design rules

### 6.1 Layout (1080×1920)
- Watermark top-left at y≈90 (lockup 48 px); dashes top-right at y≈110 (42 px wide each).
- Scene content in **y 180–1400**. Captions at **y 1430**, 70 px, ≤4 words per chunk.
- Bottom ~400 px and right ~150 px get covered by Reels/Shorts UI — no key content there.
- One `<H>` per line, `whiteSpace: nowrap`; never let Devanagari wrap on its own. Phone chat bubbles also use explicit `<br/>` lines and an explicit row height `h` (≈ 52 + 36 × lines, +26 with the AI tag).

### 6.2 Palette (kit tokens)

| Token | Value | Use |
|---|---|---|
| Background | `#F7F3EA` + `rgba(0,0,0,0.04)` grid + yellow corner glows | always (light theme) |
| `INK` | `#121212` | text |
| `GREY` | `#6b665c` | secondary headlines |
| `CREAM` | `#FFFFFF` + `CARD_SHADOW` | cards |
| `Y` | `#FFC52E` | fills: pills, CTA, highlights |
| `GOLD` | `#D99A00` | yellow as **text or thin strokes** (Y is invisible on cream) |
| `GREEN` `#1FA855`, `RED` `#E5484D` | confirmations, ✕ badges, pain bolts |
| chat bg `#EFE7DC`, outgoing bubble `#D9FDD3` | chat mockups |

Keep a few dark elements for contrast (phone bezel, night panel, dark CTA pill, stamps). Any `H` on them needs an explicit light `color`. Dark theme: swap Bg to `#0c0c0c` and sweep every hard-coded color.

### 6.3 Highlight pills
`<Hi t={sec}>` = yellow pill rotated −2° that **sweeps in like a highlighter** at second `t` (no `t` = static). In captions, consecutive `*highlight*` words share one pill (grouped with `reduce`).

### 6.4 Third-party brands and logos
- Use **real logos**. Glyphs: `npm pack simple-icons@13.21.0` (CC0 paths; WhatsApp, Instagram, Facebook are in `kit.jsx` / `lean.jsx`). Brands missing there (Microsoft apps, Indian brands like 99acres, Blinkit): `gh api -X GET search/code -f q='filename:<brand> extension:svg'`, fetch from raw.githubusercontent.com (jsdelivr / wikimedia are blocked by the proxy), preview on grey with Playwright, prefer the **current** logo version (ask if several exist).
- Save reusable SVGs in `shared/logos/` (lean reels see them as `staticFile('logos/x.svg')`); render white-glyph logos on their brand tile, transparent ones on a white tile.
- Logos are trademarks of their owners: fine to show the tool, never imply endorsement.

### 6.5 Motion vocabulary (kit)
- `io(f, a, b, from, to, easing)` clamped interpolate (expo-out). `rise(F, t)` fade + 40 px slide up. `pop(F, t, damping)` spring 0→1.
- Idle life: bob `Math.sin(F/14)*8`, marching dashes `strokeDashoffset={-F}`, pulse rings `(F % 45)/45`, twinkles, shake `Math.sin(F*0.9)*6`.
- Draw-on lines `pathLength="1" strokeDasharray="1" strokeDashoffset={1-t}`; reveal with `clipPath: inset(0 X% 0 0)`.
- Walk along a quadratic bezier with a small hop `Math.abs(Math.sin(walk*π*5))*14`.
- Typing text: `query.slice(0, Math.floor(io(F, a, b, 0, len, Easing.linear)))` + blinking caret.

### 6.6 Outgrid Labs brand (from `shared/brand/outgrid-brand-sheet.png`)
- Mark = vector `Mark` (chamfered top-left and bottom-right, rounded other corners, rounded-square hole). `Lockup` = mark + thin divider + "Outgrid Labs".
- Every reel: `Watermark` (automatic via `ReelVideo`), `@outgridlabs` pill in the CTA scene, and `BrandOutro` as the last scene (`cta` prop = small reminder chip, e.g. `"WHATSAPP" कमेंट करा`).
- If the user supplies an official SVG/font, replace `MARK_D` / the `BRAND` style in the kit.

---

### 6.7 Lean style (default for new reels): `shared/lean.jsx` + `shared/templates/lean-reel.jsx`
Reference: `reels/realestate-crm` (v1 = the approved hook style). The user called the earlier light reels "too bulky"; lean fixes that.
- **Look**: near-black `#0A0A0B` + yellow/blue corner glows + masked 60 px grid; glass cards (`Glass`), status `Chip`s (green/blue/orange/red only for meaning), Outgrid yellow as the single accent. Latin text gets `LAT` (−0.02em). White watermark, thin yellow progress bar on top, dark `LeanOutro` with a `Comment “X”` chip.
- **One hero visual per scene**: a product UI (dashboard, chat, notifications, report), drawn crisp. Few elements, big type, generous margins.
- **Hook (first scene) = text hook**, via `TextHook`: muted eyebrow + 2–3 huge lines (136 px) revealed on the VO beats, a **real logo inline** in one line, ONE hero visual below (tilted, slides up from frame 0) and ONE red `Alert` chip. **Content on screen at frame 0** (first scene has no fade-in) and **no subtitles during the hook** (`chunks.filter(c => c.a >= s(HOOK_END))`). Do NOT use the fast beat-cut/flash/shake hook unless asked (the user preferred the text hook).
- **No sentence headings after the hook**: subtitles carry the spoken words. On-screen text only for numbers, labels inside UI, keywords, chips, stamps. Never repeat the subtitle line as a heading.
- **Subtitles**: `LeanCaptions`, 64 px white at y 1420, `*word*` glows yellow (no pills).
- Every scene component gets `F` = absolute frame; times in seconds from the VO (`up(F, t)`, `pop(F, t)`).
- Invented UI data (names, localities, counts, prices) must look plausible and be listed for the user to confirm.

## 7. QA stills before the full render

```bash
scripts/qa_stills.sh reels/<name> '{}' 228 440 728 874 1008 1144 1286 1505 1752 2020
```

Pick the **busiest frame of each scene** (0.3–0.5 s before it ends) and open `reels/<name>/stills/sheet.jpg`. Check: text collisions (pins/stamps/icons over headlines), content in the caption zone (y > 1400), yellow text on cream, Devanagari shaping, caption highlight grouping and wrapping, emoji and ✓/★ glyphs (render on macOS and Linux with Noto Color Emoji / DejaVu), chat bubbles fitting their row `h`. Also check a few mid-scene frames (highlighter sweep half done, chat mid-scroll). Fix → re-render only those frames.

---

## 8. Render, encode, verify

```bash
scripts/render_encode.sh reels/<name> <name>_v1 '{"font":"anek"}' 3 16 26 45
```

1. Renders muted video in 500-frame chunks (`CHUNK=` to change), each retried 3×. A single long render once stalled a headless tab ("delayRender 'fonts' not cleared after 118000 ms") at ~frame 1750 while the same range rendered fine alone — chunking avoids it.
2. Joins chunks, muxes `public/vo.mp3`, encodes `libx264 -crf 18 -preset medium -pix_fmt yuv420p`, `aac 160k`, `+faststart`, padded to the composition length.
3. `ffprobe` (1080×1920, 30 fps, h264 + aac, duration, frame count), `volumedetect` (not silent, max < 0 dB).
4. Check sheet from the **encoded file**: `reels/<name>/stills/check_<out_name>.jpg` — look at it.

~3 min for 70 s on 4 cores. Variants (font/theme) go behind composition props; render each to its own name and **keep earlier versions** in `out/` (e.g. `_v1`, `_v2_inter`).

---

## 9. Gotchas

| Symptom | Cause / fix |
|---|---|
| `No browser found` | `scripts/find_browser.sh`; scripts pass `--browser-executable` |
| `delayRender "fonts"` timeout mid-render | Use the chunked `render_encode.sh` (don't run one long `remotion render`) |
| Devanagari boxes | Wrong font; use Anek / Baloo |
| `Expected ";" but found …` in kit.jsx | A `*/` inside a block comment (e.g. `reels/*/out`) closed it early |
| `X is not defined` after moving code | Missing named import from `remotion` or the kit in `reel.jsx` |
| Multi-word highlight colours one word | `inHi` tracking; strip trailing punctuation before checking closing `*` |
| Separate pills per highlighted word | Group consecutive highlight words (kit `Captions`) |
| Text sits high in pills | Anek/Baloo ride high: add top padding |
| Yellow star/icon disappears | Yellow on yellow; use an `INK` glyph on yellow backgrounds |
| Visual lands late | Move the cue 0.1–0.3 s earlier |
| Scene cut mid-word | Snap the cut into the gap between two SEGS |
| A safety hook blocks `rm` | Don't delete; list leftovers for the user |

---

## 10. Deliver

- Send the MP4 (file-sending tool if available; otherwise the path). Commit + push `reels/<name>/` (reel.jsx, script.txt, public/vo.mp3, out/*.mp4).
- Report duration, resolution, audio present (volumedetect), what you checked (frames from the encoded file) and what you didn't (playback with sound, sync by ear).
- Scene timeline (scene → time range → what happens) so changes can be requested by scene name.
- Point out invented mockup details (names, times, ratings, review text) and audio/text mismatches.
- Give the one-line re-render command.

### Change requests: quick map

| Request | Where |
|---|---|
| "Text too bold" | `H` / caption `fontWeight` in the kit |
| "Different font" | `FONTS` in the kit + `--props` |
| "Use real logos / remove names" | §6.4, SEGS caption text, headline strings |
| "This appears too early/late" | the seconds in that `pop`/`rise`/`io`/`Hi t=` |
| "New voiceover" | replace `public/vo.mp3`, rerun `vo_pauses.sh`, update SEGS, CUTS, cues |
| "Change the brand look" | `Mark`, `Lockup`, `Watermark`, `BrandOutro` in the kit (affects all reels) |
| "Make a new video" | `scripts/new_reel.sh`, then §4–§8 |
