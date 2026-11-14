/*
 * Outgrid "lean" reel style: dark, premium, one hero visual per scene.
 * First used by reels/realestate-crm. Builds on kit.jsx (fonts, timing helpers, Mark, buildChunks).
 *
 * Rules of the style (also in the skill, section "Lean style"):
 *  - Hook = text hook (eyebrow + 2-3 big lines, a real logo inline) over ONE hero visual + one alert chip.
 *    Content is on screen from frame 0. No subtitles during the hook.
 *  - After the hook: no sentence headings (subtitles carry the words). Text on screen only for
 *    numbers, labels inside UI, keywords, chips.
 *  - Glass cards on near-black, Outgrid yellow as the single accent, status colors only for meaning.
 *  - Real logos (simple-icons glyphs or SVGs in shared/logos), never emoji.
 *  - theme='light' on LeanVideo = cream background of the earlier reels; use GOLD_T (not Y) for yellow text/chips there.
 */
import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, Easing} from 'remotion';
import {s, io, pop, abs, Y, Mark, BRAND, WA_D, IG_D} from './kit.jsx';

/* ---------- tokens ---------- */
// Two themes share every component: tokens are CSS variables that LeanVideo sets on the root.
// dark = original lean look; light = the cream background of the earlier reels with white cards.
const THEMES = {
  dark: {bg: '#0A0A0B', txt: '#F5F5F2', muted: 'rgba(245,245,242,0.52)', line: 'rgba(255,255,255,0.09)', faint: 'rgba(245,245,242,0.28)',
    glass: 'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03))', shadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
    avatar: 'linear-gradient(135deg, #2A2A2F, #1A1A1D)', alertbg: '#1A0F10', alerttxt: '#FCA5A5', ink: '#FFFFFF', grid: 'rgba(255,255,255,0.035)',
    glowA: 'rgba(255,197,46,0.16)', glowB: 'rgba(59,130,246,0.10)'},
  light: {bg: '#F7F3EA', txt: '#121212', muted: 'rgba(18,18,18,0.56)', line: 'rgba(18,18,18,0.08)', faint: 'rgba(18,18,18,0.26)',
    glass: 'linear-gradient(180deg, #FFFFFF, #FCFAF5)', shadow: '0 24px 60px rgba(60,45,10,0.10), 0 2px 0 rgba(0,0,0,0.03)',
    avatar: 'linear-gradient(135deg, #F1ECE1, #E4DCCB)', alertbg: '#FFF1F1', alerttxt: '#C81E1E', ink: '#121212', grid: 'rgba(0,0,0,0.045)',
    glowA: 'rgba(255,197,46,0.30)', glowB: 'rgba(255,197,46,0.20)'},
};
const ThemeCtx = React.createContext(THEMES.dark);
const useTheme = () => React.useContext(ThemeCtx);
const themeVars = (t) => Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]));
const BG = '#0A0A0B'; // ink on yellow (glyphs, CTA text): same in both themes
const TXT = 'var(--l-txt)';
const MUTED = 'var(--l-muted)';
const LINE = 'var(--l-line)';
const GLASS = 'var(--l-glass)';
const GOLD_T = '#B77F00'; // yellow as text/stroke on the light theme (Y is invisible on cream)
const C_GREEN = '#22C55E', C_BLUE = '#3B82F6', C_ORANGE = '#F59E0B', C_RED = '#EF4444';
const LAT = {letterSpacing: '-0.02em'}; // tighter Latin, Anek runs loose at display sizes
// fade + slide up at second t (d frames, y px)
const up = (F, t, d = 16, y = 36) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, y, 0)}px)`});

/* ---------- surfaces ---------- */
const Glass = ({x, y, w, h, r = 36, style = {}, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, background: GLASS, border: `1.5px solid ${LINE}`, boxSizing: 'border-box',
    boxShadow: 'var(--l-shadow)', backdropFilter: 'blur(20px)', ...style}}>{children}</div>
);
// status chip: tinted pill with a dot
const Chip = ({children, color = C_GREEN, size = 24, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: size, fontWeight: 600, color, background: `${color}1F`, border: `1.5px solid ${color}40`,
    borderRadius: 999, padding: `${size * 0.32}px ${size * 0.62}px ${size * 0.18}px`, whiteSpace: 'nowrap', ...style}}>
    <span style={{width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: color, marginTop: -size * 0.12}} />{children}
  </div>
);
// glowing red alert pill (hook / pain points)
const Alert = ({children, size = 32, style = {}}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'var(--l-alertbg)', border: `1.5px solid ${C_RED}66`, borderRadius: 999, padding: '16px 28px 10px 18px',
    boxShadow: '0 20px 50px rgba(239,68,68,0.25)', ...style}}>
    <div style={{width: size * 0.56, height: size * 0.56, borderRadius: '50%', background: C_RED, boxShadow: `0 0 14px ${C_RED}`, marginTop: -6}} />
    <div style={{fontSize: size, fontWeight: 600, color: 'var(--l-alerttxt)', whiteSpace: 'nowrap', ...LAT}}>{children}</div>
  </div>
);
// initials avatar
const Ini = ({t, size = 48, bg = 'var(--l-avatar)', color = TXT}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: bg, border: `1.5px solid ${LINE}`, color, fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.06, boxSizing: 'border-box', ...LAT}}>{t}</div>
);
// the client's app icon: yellow tile + any 24x24 stroke glyph (default: house)
const AppIcon = ({size = 64, glyph, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" stroke={BG} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
      {glyph || <><path d="M3 11l9-7 9 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></>}
    </svg>
  </div>
);

/* ---------- icons: 24x24 stroke glyphs, <Ico d={I_BELL} /> ---------- */
const Ico = ({d, size = 30, color = MUTED, sw = 2}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I_LOCK = <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>;
const I_BELL = <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>;
const I_CAL = <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>;
const I_PHONE = <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />;
const I_DL = <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 19h14" /></>;
const I_GRID = <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>;
const I_USERS = <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-4 3-6 6-6s6 2 6 6" /><path d="M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.5 3 6" /></>;
const I_PIN = <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>;
const I_CHART = <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>;
const I_KEY = <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l2 2" /></>;
const I_BLDG = <><path d="M4 21V5l8-2v18M12 8l8 2v11M3 21h18" /><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" /></>;
const Tick = ({size = 28, color = C_GREEN}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><circle cx="12" cy="12" r="11" fill={color} /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Bolt = ({size = 30, color = BG}) => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={color} /></svg>;
const DoubleTick = ({size = 26}) => (
  <svg viewBox="0 0 28 18" width={size} height={size * 0.64} fill="none" stroke="#53BDEB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 9.5l4.5 4.5L15 4.5" /><path d="M11 13l1 1L21.5 4.5" /></svg>
);

/* ---------- real logos (trademarks of their owners) ---------- */
// file logos: shared/logos/*.svg, reachable as staticFile('logos/x.svg') via the reel's public/logos symlink
const LogoImg = ({src, size, style = {}}) => <Img src={staticFile(`logos/${src}`)} style={{width: size, height: size, display: 'block', objectFit: 'contain', ...style}} />;
const FB_D = 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z';
const WhatsApp = ({size = 120, round = false, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: round ? '50%' : size * 0.24, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}><path d={WA_D} fill="#fff" /></svg>
  </div>
);
const Facebook = ({size = 120, style = {}}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{flexShrink: 0, ...style}}><circle cx="12" cy="12" r="10.5" fill="#fff" /><path d={FB_D} fill="#0866FF" /></svg>
);
const Instagram = ({size = 120, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}><path d={IG_D} fill="#fff" /></svg>
  </div>
);
const Excel = ({size = 120, style = {}}) => <LogoImg src="excel.svg" size={size} style={style} />;
const Acres99 = ({size = 120, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <LogoImg src="99acres.svg" size={size * 0.9} />
  </div>
);

/* ---------- hook (text hook over one hero visual) ---------- */
// eyebrow: small muted line; lines: [{t, node}] big lines revealed at second t (use t <= 0 for frame-0 content)
// visual: the hero visual node (placed by the caller); alert: optional {t, text, x, y}
const TextHook = ({F, eyebrow, lines, visual, alert, size = 136, top = 290}) => (
  <AbsoluteFill>
    {eyebrow && <div style={{...abs(72, top - 75), fontSize: 40, fontWeight: 600, color: MUTED, ...LAT, ...up(F, -0.4)}}>{eyebrow}</div>}
    <div style={{...abs(66, top)}}>
      {lines.map(({t, node}, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: size * 0.19, fontSize: size, fontWeight: 700, color: TXT, lineHeight: 1.08, whiteSpace: 'nowrap', ...LAT, ...up(F, t)}}>{node}</div>
      ))}
    </div>
    {visual}
    {alert && <div style={{...abs(alert.x, alert.y), transform: `scale(${pop(F, alert.t, 10)}) rotate(-3deg)`, transformOrigin: '0% 100%'}}><Alert>{alert.text}</Alert></div>}
  </AbsoluteFill>
);

/* ---------- chrome ---------- */
const LeanBg = ({f}) => {
  const t = useTheme();
  return (
    <AbsoluteFill style={{background: t.bg}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 700px at ${20 + Math.sin(f / 90) * 6}% 8%, ${t.glowA}, transparent 60%), radial-gradient(800px 800px at 95% 85%, ${t.glowB}, transparent 60%)`}} />
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)'}} />
    </AbsoluteFill>
  );
};
const LeanWatermark = () => {
  const t = useTheme();
  return (
    <div style={{...abs(60, 92), display: 'flex', alignItems: 'center', gap: 14, opacity: 0.9}}>
      <Mark size={44} color={t.ink} />
      <div style={{...BRAND, fontSize: 28, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em'}}>Outgrid Labs</div>
    </div>
  );
};
const Progress = ({f, total}) => (
  <div style={{...abs(0, 0), width: 1080, height: 6, background: 'var(--l-line)'}}>
    <div style={{height: '100%', width: `${(f / total) * 100}%`, background: Y, boxShadow: `0 0 16px ${Y}`}} />
  </div>
);
// karaoke subtitles: *highlight* words glow yellow (dark) or get a yellow marker stroke (light); no pills
const LeanCaptions = ({f, chunks}) => {
  const light = useTheme() === THEMES.light;
  const c = chunks.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const op = Math.min(io(f, c.a, c.a + 4), io(f, c.b - 4, c.b, 1, 0));
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1420, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', opacity: op}}>
      {c.words.map((w, i) => {
        const on = f >= w.t, p = io(f, w.t, w.t + 5);
        return (
          <span key={i} style={{fontSize: 64, fontWeight: 600, lineHeight: 1.3, ...LAT, color: !on ? 'var(--l-faint)' : w.hi && !light ? Y : TXT,
            textShadow: on && w.hi && !light ? '0 0 24px rgba(255,197,46,0.45)' : 'none', transform: `translateY(${(1 - p) * 8}px)`,
            ...(light && w.hi ? {background: `linear-gradient(transparent 58%, ${Y} 58%, ${Y} 90%, transparent 90%) no-repeat left / ${io(f, w.t, w.t + 6) * 100}% 100%`, padding: '0 4px'} : {})}}>{w.w}</span>
        );
      })}
    </div>
  );
};
// first scene starts fully visible (frame 0 is the thumbnail); others fade in over 8 frames
const SceneFade = ({dur, first, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: Math.min(first ? 1 : io(f, 0, 8), io(f, dur - 6, dur, 1, 0))}}>{children}</AbsoluteFill>;
};

/* ---------- outro ---------- */
const LeanOutro = ({F, at, cta}) => {
  const t = useTheme();
  const m = pop(F, at + 0.05, 11);
  const w = io(F, s(at + 0.3), s(at + 0.7));
  const bar = io(F, s(at + 0.6), s(at + 1.0), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <div style={{...abs(240, 300), width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(closest-side, ${Y}40, transparent)`, filter: 'blur(30px)', opacity: m}} />
      <div style={{...abs(540 - 140, 460), transform: `scale(${m}) rotate(${(1 - m) * -90}deg)`, filter: `drop-shadow(0 0 40px ${Y}66)`}}><Mark size={280} color={t.ink} /></div>
      <div style={{...abs(0, 820), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...BRAND, fontSize: 128, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', opacity: w, transform: `translateY(${(1 - w) * 40}px)`}}>Outgrid Labs</div>
        <div style={{width: 200 * bar, height: 12, borderRadius: 6, background: Y, marginTop: 30, boxShadow: `0 0 20px ${Y}`}} />
        <div style={{...BRAND, fontSize: 44, fontWeight: 500, color: MUTED, marginTop: 34, ...up(F, at + 0.9, 12, 20)}}>@outgridlabs</div>
        {cta && <div style={{marginTop: 50, ...up(F, at + 1.2, 12, 20), background: Y, borderRadius: 999, padding: '18px 40px 12px', fontSize: 44, fontWeight: 700, color: BG, ...LAT}}>{cta}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- the whole reel ---------- */
// scenes: [[key, fromSec, toSec], ...] (cuts inside VO pauses); comps: {key: Component({F})} where F = absolute frame
// chunks: buildChunks(SEGS) filtered to skip the hook; outroAt: second the outro starts (watermark hides)
// theme: 'dark' | 'light'
const LeanVideo = ({scenes, comps, chunks, total, outroAt = Infinity, vo = 'vo.mp3', theme = 'dark'}) => {
  const f = useCurrentFrame();
  const t = THEMES[theme];
  return (
    <ThemeCtx.Provider value={t}>
    <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: TXT, ...themeVars(t)}}>
      <LeanBg f={f} />
      {vo && <Audio src={staticFile(vo)} />}
      {scenes.map(([k, a, b]) => {
        const Comp = comps[k];
        return (
          <Sequence key={k} from={s(a)} durationInFrames={s(b) - s(a)}>
            <SceneFade dur={s(b) - s(a)} first={a === 0}><Comp F={f} /></SceneFade>
          </Sequence>
        );
      })}
      {f < s(outroAt) && <LeanWatermark />}
      <Progress f={f} total={total} />
      <LeanCaptions f={f} chunks={chunks} />
    </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

export {
  THEMES, ThemeCtx, useTheme, BG, TXT, MUTED, LINE, GLASS, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up,
  Glass, Chip, Alert, Ini, AppIcon, Ico, Tick, Bolt, DoubleTick,
  I_LOCK, I_BELL, I_CAL, I_PHONE, I_DL, I_GRID, I_USERS, I_PIN, I_CHART, I_KEY, I_BLDG,
  LogoImg, FB_D, WhatsApp, Facebook, Instagram, Excel, Acres99,
  TextHook, LeanBg, LeanWatermark, Progress, LeanCaptions, SceneFade, LeanOutro, LeanVideo,
};
