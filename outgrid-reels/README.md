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
| `shared/logos/` | Real logo SVGs (99acres, Excel); lean reels link it as `public/logos` |
| `shared/kit.jsx` | Brand (mark, lockup, watermark, outro), fonts, helpers, captions, HUD, transitions, chat mockups, icons |
| `shared/fonts/` | Anek Devanagari (default), Baloo 2 |
| `shared/brand/` | Outgrid Labs brand sheet |
| `shared/templates/` | `lean-reel.jsx` (lean style starter), `starter-reel.jsx` (light style), `food-app-reel.jsx` (original reference) |
| `scripts/` | `new_reel.sh`, `vo_pauses.sh`, `qa_stills.sh`, `render_encode.sh`, `find_browser.sh` |
| `reels/<name>/` | `reel.jsx`, `script.txt`, `public/vo.mp3`, `out/*.mp4` |

## Reels

| Reel | Length | Final file |
|---|---|---|
| `clinic-whatsapp-ai`: clinic patient journey with a WhatsApp AI assistant (Marathi) | 70 s | `out/clinic_reel_outgrid.mp4` (earlier: `_v1`, `_v2_inter`) |
| `blinkit-small-town-delivery`: small-town grocery delivery, zero-inventory model, unit economics, 4 apps (Marathi) | 99 s | `out/blinkit_small_town_v2.mp4` (earlier: `_v1`) |
| `distributor-order-app`: distributor/wholesaler retailer ordering app + dashboard, "ORDER" comment CTA (Marathi) | 67 s | `out/distributor_order_app_v2.mp4` (earlier: `_v1`) |
| `realestate-crm`: Real Estate CRM, leads from 99acres / Facebook / walk-ins, WhatsApp automation, reports (Marathi, dark style) | 61.5 s | `out/realestate_crm_v2.mp4` (earlier: `_v1`) |
