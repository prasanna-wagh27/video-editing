# Outgrid Reels

Code-driven motion-graphics reels (Remotion + React + FFmpeg) for Outgrid Labs projects.

## Make a new reel

```bash
cd outgrid-reels
npm i --no-audit --no-fund                     # first time only
STYLE=lean scripts/new_reel.sh <project-name> voice.mp3 script.txt   # lean (dark) style; drop STYLE=lean for the light cream style
# edit reels/<project-name>/reel.jsx: SEGS from the printed pauses, CUTS, scenes
scripts/qa_stills.sh reels/<project-name> '{}' 100 300 500    # check stills/sheet.jpg
scripts/render_encode.sh reels/<project-name> <project-name>_v1
```

With Claude Code, open `outgrid-reels/` and ask for a reel. The skill in `.claude/skills/reel-motion-graphics/SKILL.md` has the full workflow and design rules.

## Layout

| Path | What |
|---|---|
| `.claude/skills/reel-motion-graphics/` | Claude skill: SKILL.md, scripts, example assets |
| `shared/lean.jsx` | **Lean style** (dark, premium, one hero visual per scene, text hook): tokens, glass cards, chips, icons, real logos, `TextHook`, `LeanVideo`, `LeanOutro` |
| `shared/wide.jsx` | **16:9 YouTube layout** (1920×1080) on the lean kit: `WideVideo` (chapter chip, watermark, progress, one-line subtitles), `WideOutro` |
| `shared/logos/` | Real logo SVGs (99acres, Excel, Google Maps/Pay/Play, App Store, PhonePe, Paytm, YouTube); lean reels link it as `public/logos` |
| `shared/kit.jsx` | Brand (mark, lockup, watermark, outro), fonts, helpers, captions, HUD, transitions, chat mockups, icons |
| `shared/fonts/` | Anek Devanagari (default), Baloo 2 |
| `shared/brand/` | Outgrid Labs brand sheet |
| `shared/templates/` | `lean-reel.jsx` (lean style starter), `starter-reel.jsx` (light style), `food-app-reel.jsx` (original reference) |
| `scripts/` | `new_reel.sh`, `vo_pauses.sh`, `qa_stills.sh`, `stills_fast.mjs` (many stills, one bundle), `render_encode.sh` (`AUDIO=mix.wav` for a mix), `sfx_mix.py` (synthesized sound effects under the VO), `align_whisper.py` (`ALIGN_BAND=20` for long VOs), `find_browser.sh` |
| `reels/<name>/` | `reel.jsx`, `script.txt`, `public/vo.mp3`, `out/*.mp4` |

## Reels

| Reel | Length | Final file |
|---|---|---|
| `clinic-whatsapp-ai`: clinic patient journey with a WhatsApp AI assistant (Marathi) | 70 s | `out/clinic_reel_outgrid.mp4` (earlier: `_v1`, `_v2_inter`) |
| `blinkit-small-town-delivery`: small-town grocery delivery, zero-inventory model, unit economics, 4 apps (Marathi) | 99 s | `out/blinkit_small_town_v2.mp4` (earlier: `_v1`) |
| `distributor-order-app`: distributor/wholesaler retailer ordering app + dashboard, "ORDER" comment CTA (Marathi) | 67 s | `out/distributor_order_app_v2.mp4` (earlier: `_v1`) |
| `realestate-crm`: Real Estate CRM, leads from 99acres / Facebook / walk-ins, WhatsApp automation, reports (Marathi, dark style) | 61.5 s | `out/realestate_crm_v2.mp4` (earlier: `_v1`) |
| `homerun-startup`: HomeRun startup story (construction-material quick commerce), lean light style, real team photo + logo (Marathi) | 72 s | `out/homerun_startup_v3.mp4` (Whisper-aligned captions; earlier `_v1`, `_v2`) |
| `country-delight`: Country Delight startup story (dairy subscription app), lean light style, real founders + product photos + logo (Marathi) | 73 s | `out/country_delight_v2.mp4` (Whisper-aligned captions; earlier `_v1`) |
| `mushroom-youtube`: **Tarun Udyojak** YouTube channel (not Outgrid branded), 16:9 (5.5 min) mushroom-farming business breakdown: how it's grown, 3 types, demand, investment, the math, the sales problem, value-added products, scaling, 3 rules; vector art, chapters, synthesized sound effects, thumbnail (Marathi) | 5 min 28 s | `out/mushroom_youtube_v2.mp4` (Tarun Udyojak branding; `_v1` had Outgrid branding by mistake), `out/mushroom_youtube_thumbnail.jpg` |
| `scrapuncle-bhangar`: digital bhangarwala reel: ScrapUncle (Mukul Chhabra, Shark Tank, ₹15.5 Cr), The Kabadiwala, Scrapdeal, your-city math (₹60–80k/month), comment "भंगार" CTA; real photos, synthesized SFX (Marathi) | 75 s | `out/bhangar_v1.mp4` |
| `zomato-order`: how Zomato earns from one ₹300 order (commission 20–30%, platform fee ₹2→₹15, ads, COD fee, ₹75–100+/order, costs, lakhs of orders), DM Outgrid Labs CTA; real Zomato wordmark, no hook headline, synthesized SFX (Marathi) | 66 s | `out/zomato_v2.mp4` (v2: contact number in outro) |
| `porter-app`: Porter-like tempo booking app for your city (how it works, 3 apps, 3 revenue streams, ₹3 lakh example, ₹2 lakh cost), lean light style, real Google Maps / GPay / PhonePe / Paytm / Play / App Store logos (Marathi) | 67 s | `out/porter_app_v2.mp4` (real Porter logo + photo in hook; earlier `_v1`) |
| `kulhad-app-demo`: **KulhadKart** concept app (kulhad ordering + unit setup + buyer connect), scripted HTML app screen-recorded with Playwright (`record.mjs`), plus Marathi concept-note PDF (`pdf.mjs`) | 60 s | `out/kulhadkart_screen_recording.mp4` (raw phone), `out/kulhadkart_demo_reel.mp4` (1080×1920 framed), `out/KulhadKart_Concept_Note.pdf` |
