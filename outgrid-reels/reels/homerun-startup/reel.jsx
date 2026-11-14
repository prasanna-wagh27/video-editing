/*
 * HomeRun startup story (Marathi), LEAN style, light theme. VO sped up 1.04x (public/vo.mp3).
 * Real assets: public/img/homerun_logo.png, public/img/homerun_team.png (user-supplied), logos/blinkit.svg.
 * App UI, map, quotes and order rows are illustrative.
 * Captions: captions.js from `python3 scripts/word_times.py reels/homerun-startup/script_hi.txt reels/homerun-startup/public/vo.mp3`
 * (word-level timing from syllable peaks). Times below are seconds from those word times.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {FPS, s as sF, io, pop as popF, abs, Y, Mark} from '../../shared/kit.jsx';
import {
  BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up as upF,
  Glass, Chip, Alert, Ini, Ico, Tick, Bolt, I_PIN, I_CHART, I_USERS, I_PHONE, I_CAL,
  Instagram, WhatsApp, LogoImg, LeanOutro, LeanVideo,
} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';
import {REMAP} from './remap.js';

/* Scene cues below are written in "cue seconds" (the first draft's word times). REMAP pairs each script word's
 * cue time with its real spoken time (captions.js, Whisper-aligned), and R() maps any cue linearly between words,
 * so every animation lands on its word. Scene cuts (SCENES) are in real seconds. */
const R = (t) => {
  const P = REMAP;
  if (t <= P[0][0]) return t - P[0][0] + P[0][1];
  for (let i = 1; i < P.length; i++) if (t <= P[i][0]) return P[i - 1][1] + (t - P[i - 1][0]) * (P[i][1] - P[i - 1][1]) / Math.max(1e-6, P[i][0] - P[i - 1][0]);
  const L = P[P.length - 1]; return t - L[0] + L[1];
};
const s = (t) => sF(R(t));
const pop = (F, t, d) => popF(F, R(t), d);
const up = (F, t, d, y) => upF(F, R(t), d, y);

/* ---------- scenes: [key, fromSec, toSec] in REAL seconds, every cut inside a VO pause ---------- */
const OUTRO_AT = 69.75;
const SCENES = [
  ['hook', 0, 4.25], ['cement', 4.25, 7.27], ['wire', 7.27, 8.2], ['plywood', 8.2, 9.9], ['what', 9.9, 10.8],
  ['reveal', 10.8, 13.5], ['gap', 13.5, 15.85], ['app', 15.85, 19.1], ['users', 19.1, 21.25], ['products', 21.25, 25.0], ['delivery', 25.0, 27.84],
  ['orders', 27.84, 31.58], ['growth', 31.58, 34.3], ['funding', 34.3, 36.8],
  ['lesson', 36.8, 38.85], ['market', 38.85, 42.0], ['calls', 42.0, 43.1], ['quotes', 43.1, 44.25], ['late', 44.25, 47.3], ['system', 47.3, 50.75],
  ['idea', 50.75, 53.68], ['formula', 53.68, 59.05], ['yours', 59.05, 62.1], ['build', 62.1, 67.2], ['dm', 67.2, OUTRO_AT], ['outro', OUTRO_AT, OUTRO_AT + 2.4],
];
const TOTAL = sF(OUTRO_AT + 2.4);
const CHUNKS = CAPS.filter((c) => c.a >= sF(SCENES[0][2]) - 2); // no subtitles over the text hook

/* ---------- brand + real assets ---------- */
const HR_Y = '#FFDA01', HR_B = '#3B3BEB';
const HomeRunLogo = ({size = 200, style = {}}) => (
  <Img src={staticFile('img/homerun_logo.png')} style={{width: size, height: size, borderRadius: size * 0.235, display: 'block', flexShrink: 0, boxShadow: '0 20px 50px rgba(60,45,10,0.18)', ...style}} />
);
const TeamPhoto = ({w, h, zoom = 1, style = {}}) => (
  <div style={{width: w, height: h, borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 70px rgba(60,45,10,0.22)', ...style}}>
    <Img src={staticFile('img/homerun_team.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
  </div>
);
const Blinkit = ({size = 120, style = {}}) => <LogoImg src="blinkit.svg" size={size} style={{borderRadius: size * 0.21, ...style}} />;

/* ---------- material vectors (24-unit grid scaled, INK outlines) ---------- */
const INKC = '#1F1F1F';
const CementBag = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M12 10h40l-2 6 2 6v26l2 6-2 4H12l-2-4 2-6V22l-2-6z" fill="#C9C4BA" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <rect x="16" y="26" width="32" height="16" rx="2" fill="#fff" stroke={INKC} strokeWidth="2.5" />
    <text x="32" y="37.5" textAnchor="middle" fontSize="8" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">CEMENT</text>
    <path d="M16 48h32" stroke={INKC} strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);
const WireCoil = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeLinecap="round">
    <circle cx="32" cy="32" r="22" stroke={INKC} strokeWidth="9" /><circle cx="32" cy="32" r="22" stroke="#E2683C" strokeWidth="5" />
    <circle cx="32" cy="32" r="13" stroke={INKC} strokeWidth="9" /><circle cx="32" cy="32" r="13" stroke="#E2683C" strokeWidth="5" />
    <path d="M50 46c4 4 8 6 10 4" stroke={INKC} strokeWidth="3.5" /><path d="M58 50l4-1" stroke="#C9A227" strokeWidth="3" />
  </svg>
);
const Plywood = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 22 40 12l18 8-34 12z" fill="#E8C48E" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M6 22v8l18 10v-8z" fill="#C99A5B" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M24 32l34-12v8L24 40z" fill="#D9AE72" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M8 26l16 9M8 29l16 9M26 35l30-11M26 38l30-11" stroke="#A9773A" strokeWidth="1.2" />
    <path d="M20 19c6-1 10 1 14-1M28 22c5-1 9 1 13-1" stroke="#B9874A" strokeWidth="1.5" fill="none" />
  </svg>
);
const Tiles = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {[[8, 8, '#DCE7F2'], [33, 8, '#F2F6FA'], [8, 33, '#F2F6FA'], [33, 33, '#DCE7F2']].map(([x, y, c], i) => <rect key={i} x={x} y={y} width="23" height="23" rx="3" fill={c} stroke={INKC} strokeWidth="3" />)}
    <path d="M12 14l6-4M37 39l6-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const PaintBucket = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M14 20h36l-3 36a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4z" fill="#fff" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M15 30h34l-1 10c-6 3-10-2-16 1s-10 0-16-1z" fill={HR_B} />
    <ellipse cx="32" cy="20" rx="18" ry="5" fill="#EDEAE3" stroke={INKC} strokeWidth="3" /><path d="M16 18c0-12 32-12 32 0" fill="none" stroke={INKC} strokeWidth="3" />
  </svg>
);
const Pipe = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeLinejoin="round">
    <path d="M10 22h26a10 10 0 0 1 10 10v22" stroke={INKC} strokeWidth="14" /><path d="M10 22h26a10 10 0 0 1 10 10v22" stroke="#9BB7C9" strokeWidth="8" />
    <rect x="4" y="13" width="10" height="18" rx="2" fill="#7E9BAE" stroke={INKC} strokeWidth="3" /><rect x="37" y="50" width="18" height="10" rx="2" fill="#7E9BAE" stroke={INKC} strokeWidth="3" />
  </svg>
);
const Tempo = ({size = 200, spin = 0}) => (
  <svg viewBox="0 0 120 80" width={size} height={size * 2 / 3}>
    <rect x="4" y="8" width="68" height="50" rx="5" fill={HR_Y} stroke={INKC} strokeWidth="3.5" />
    <path d="M12 28l8-10M20 28l8-10" stroke={INKC} strokeWidth="3" strokeLinecap="round" />
    <path d="M72 22h20c8 0 14 8 18 18v18H72z" fill="#3DBB4A" stroke={INKC} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M80 28h10c4 0 8 4 10 10H80z" fill="#CFE6F5" stroke={INKC} strokeWidth="2.5" />
    {[22, 96].map((x) => <g key={x} transform={`rotate(${spin} ${x} 62)`}><circle cx={x} cy="62" r="11" fill={INKC} /><circle cx={x} cy="62" r="4.5" fill="#ddd" /><path d={`M${x - 8} 62h16`} stroke="#666" strokeWidth="2" /></g>)}
  </svg>
);
const Shop = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="10" y="28" width="44" height="30" fill="#fff" stroke={INKC} strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${8 + i * 12} 16h12v8a6 6 0 0 1-12 0z`} fill={i % 2 ? '#fff' : Y} stroke={INKC} strokeWidth="2.5" strokeLinejoin="round" />)}
    <rect x="8" y="8" width="48" height="8" rx="2" fill={INKC} /><rect x="36" y="38" width="12" height="20" fill={INKC} /><rect x="16" y="36" width="14" height="10" fill="#FFF4D1" stroke={INKC} strokeWidth="2" />
  </svg>
);
const Person = ({size = 100, c = INKC}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="20" r="11" fill={c} /><path d="M10 60c0-16 10-24 22-24s22 8 22 24z" fill={c} /></svg>
);
const Bulb = ({size = 120, on = 1}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {on > 0 && [0, 1, 2, 3, 4].map((i) => <path key={i} d="M32 2v6" stroke={GOLD_T} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${(i - 2) * 35} 32 28)`} opacity={on} />)}
    <path d="M32 12a16 16 0 0 0-9 29c2 2 3 4 3 7h12c0-3 1-5 3-7a16 16 0 0 0-9-29z" fill={on ? Y : '#E5E0D5'} stroke={INKC} strokeWidth="3" />
    <path d="M26 52h12M27 57h10" stroke={INKC} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);
const Wrench = ({size = 110}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M44 6a14 14 0 0 0-13 19L8 48a6 6 0 0 0 8 8l23-23A14 14 0 0 0 58 20l-8 8-9-2-2-9 8-8a14 14 0 0 0-3-3z" fill="#D7DCE2" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
const Rocket = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M40 6c10 2 16 8 18 18L36 46l-18-18z" fill="#fff" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="42" cy="22" r="5" fill={HR_B} stroke={INKC} strokeWidth="2.5" />
    <path d="M18 28l-10 2 8-12 12-2zM36 46l-2 10 12-8 2-12z" fill={C_RED} stroke={INKC} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M18 46c-6 0-10 6-10 10 4 0 10-4 10-10z" fill={Y} stroke={INKC} strokeWidth="2.5" />
  </svg>
);
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Row = ({icon, title, sub, right, style = {}}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26, ...style}}>
    <div style={{width: 130, height: 130, borderRadius: 32, background: '#F6F1E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
    <div style={{flex: 1}}>
      <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>{title}</div>
      {sub && <div style={{fontSize: 26, fontWeight: 500, color: MUTED, ...LAT}}>{sub}</div>}
    </div>
    {right}
  </div>
);

/* ---------- shared screen bits ---------- */
// light phone: dark bezel, cream screen
const PhoneL = ({x, y, w, h, children, style = {}}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: w * 0.13, background: '#1d1d1f', padding: 12, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.28)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: w * 0.11, overflow: 'hidden', background: '#FAF8F3', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 14), marginLeft: -56, width: 112, height: 30, borderRadius: 15, background: '#1d1d1f'}} />
    </div>
  </div>
);
const Label = ({children, style = {}}) => <div style={{fontSize: 26, fontWeight: 700, color: MUTED, letterSpacing: '0.12em', ...style}}>{children}</div>;
// spring "drop": falls from -h with a small squash on landing
const drop = (F, t, h = 500) => {
  const p = pop(F, t, 9);
  const land = io(F, s(t) + 6, s(t) + 9) * io(F, s(t) + 9, s(t) + 14, 1, 0);
  return {transform: `translateY(${(1 - Math.min(p, 1)) * -h}px) scale(${1 + land * 0.08}, ${1 - land * 0.08})`, opacity: io(F, s(t), s(t) + 3)};
};
const XCircle = ({size = 60}) => <svg viewBox="0 0 24 24" width={size} height={size}><circle cx="12" cy="12" r="11" fill={C_RED} /><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>;

/* ---------- 1. Hook: Blinkit cart fills fast, then a cement bag lands: not available ---------- */
const CART = [[-0.4, 'दूध', 'Milk · 1 L', '#FFFFFF'], [0.84, 'भाजी', 'Vegetables · 1 kg', '#DFF3D8'], [1.6, 'किराणा', 'Atta, dal, oil', '#FFF1C9']];
const Hook = ({F}) => {
  const n = CART.filter(([t]) => F >= s(t)).length;
  const jolt = F >= s(2.95) && F < s(3.25) ? Math.sin((F - s(2.95)) * 1.6) * 6 * io(F, s(2.95), s(3.25), 1, 0) : 0;
  const twist = pop(F, 2.4, 9);
  return (
    <AbsoluteFill>
      <div style={{...abs(72, 200), fontSize: 40, fontWeight: 600, color: MUTED, ...LAT}}>Quick Commerce</div>
      <div style={{...abs(66, 262), display: 'flex', alignItems: 'center', gap: 24, fontSize: 132, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>
        <Blinkit size={122} /><span>दूध, भाजी</span>
        <div style={{transform: `scale(${F < s(1.9) ? 0 : pop(F, 1.9, 8)})`}}><Tick size={92} /></div>
      </div>
      <div style={{...abs(66, 420), fontSize: 150, fontWeight: 800, color: TXT, lineHeight: 1.05, ...LAT, transform: `scale(${0.6 + 0.4 * twist})`, transformOrigin: '0% 70%', opacity: Math.min(1, twist * 2)}}>
        पण <span style={{color: C_RED}}>सिमेंट?</span>
      </div>
      <PhoneL x={170} y={640} w={740} h={1000} style={{transform: `translateX(${jolt}px) rotate(${-2 + jolt * 0.1}deg)`}}>
        <div style={{padding: '70px 30px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Blinkit size={70} />
            <div><div style={{fontSize: 34, fontWeight: 800, color: '#1F1F1F', ...LAT}}>Delivery in 8 minutes</div><div style={{fontSize: 22, color: '#8a8478', ...LAT}}>Home · Kothrud</div></div>
            <div style={{flex: 1}} />
            <div style={{position: 'relative'}}>
              <div style={{width: 70, height: 70, borderRadius: 20, background: '#0C831F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2l2.5 11h11L21 7H7" /><circle cx="9" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>
              </div>
              <div key={n} style={{...abs(48, -12), minWidth: 36, height: 36, borderRadius: 18, background: C_RED, color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 3, boxSizing: 'border-box',
                transform: `scale(${n ? 1 + 0.3 * io(F, s(CART[n - 1][0]), s(CART[n - 1][0]) + 4) * io(F, s(CART[n - 1][0]) + 4, s(CART[n - 1][0]) + 9, 1, 0) : 0})`}}>{n}</div>
            </div>
          </div>
          <div style={{height: 2, background: 'rgba(0,0,0,0.06)', margin: '24px -30px 10px'}} />
          {CART.map(([t, n1, sub, c], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', borderBottom: '2px solid rgba(0,0,0,0.05)', ...(F < s(t) - 3 ? {opacity: 0} : drop(F, t - 0.1, 120))}}>
              <div style={{width: 92, height: 92, borderRadius: 22, background: c, border: '2px solid rgba(0,0,0,0.06)'}} />
              <div style={{flex: 1}}><div style={{fontSize: 38, fontWeight: 700, color: '#1F1F1F'}}>{n1}</div><div style={{fontSize: 22, color: '#8a8478', ...LAT}}>{sub}</div></div>
              <Tick size={52} />
            </div>
          ))}
          <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', ...(F < s(2.75) ? {opacity: 0} : drop(F, 2.75, 700))}}>
            <div style={{width: 92, height: 92, borderRadius: 22, background: '#EEE9DF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CementBag size={80} /></div>
            <div style={{flex: 1}}><div style={{fontSize: 38, fontWeight: 700, color: '#1F1F1F'}}>सिमेंट</div><div style={{fontSize: 22, color: '#8a8478', ...LAT}}>OPC 53 · 50 kg</div></div>
            <div style={{transform: `scale(${pop(F, 3.1, 9)})`}}><Chip color={C_RED} size={28}>Not available</Chip></div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 34, height: 110, borderRadius: 28, background: '#0C831F', display: 'flex', alignItems: 'center', padding: '6px 34px 0', color: '#fff', fontSize: 34, fontWeight: 700, ...LAT}}>
          <span>{n} items · ₹{[0, 68, 148, 412][n]}</span><div style={{flex: 1}} /><span>Place order ›</span>
        </div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* ---------- 2. Cement runs out on site ---------- */
const Cement = ({F}) => {
  const gone = (i) => io(F, s(5.6 + i * 0.12), s(5.6 + i * 0.12) + 6); // bags vanish one by one, last at ~6.5 "संपलं"
  const BAGS = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1], [1, 2]];
  return (
    <AbsoluteFill>
      <Glass x={90} y={250} w={900} h={830} r={44} style={{overflow: 'hidden', padding: 0}}>
        <div style={{height: 470, background: 'linear-gradient(#EAF2F8, #F6F1E6)', position: 'relative'}}>
          <svg viewBox="0 0 900 470" width="900" height="470" style={{...abs(0, 0)}}>
            {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={380 + c * 110} y={330 - r * 90} width="110" height="90" fill={r < 2 ? '#EFE7D6' : 'none'} stroke="#9A8F7B" strokeWidth="3" />))}
            {[0, 1, 2, 3, 4].map((c) => <rect key={c} x={376 + c * 110} y="40" width="9" height="380" fill="#E2683C" />)}
            <path d="M170 420V40M170 40h360M170 75l360-35" stroke={INKC} strokeWidth="6" fill="none" /><rect x="110" y="40" width="40" height="28" fill={INKC} />
            <path d={`M${470 + Math.sin(F / 18) * 14} 40v90`} stroke={INKC} strokeWidth="3" />
            <path d="M0 420H900" stroke={INKC} strokeWidth="5" />
          </svg>
          {/* cement pallet */}
          <div style={{...abs(70, 250), width: 280, height: 170}}>
            {BAGS.map(([c, r], i) => (
              <div key={i} style={{...abs(c * 90, 100 - r * 52), opacity: 1 - gone(BAGS.length - 1 - i), transform: `translateY(${-gone(BAGS.length - 1 - i) * 40}px)`}}><CementBag size={92} /></div>
            ))}
            <div style={{...abs(-10, 160), width: 300, height: 14, borderRadius: 4, background: '#B58A55'}} />
          </div>
        </div>
        <div style={{padding: '40px 50px'}}>
          <Label>CEMENT STOCK</Label>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14}}>
            <Big size={170} color={F >= s(6.45) ? C_RED : TXT} style={{fontVariantNumeric: 'tabular-nums'}}>{Math.max(0, 6 - Math.floor(io(F, s(5.6), s(6.45), 0, 6, Easing.linear)))}</Big>
            <div style={{fontSize: 48, fontWeight: 600, color: MUTED}}>bags</div>
          </div>
          <div style={{height: 22, borderRadius: 11, background: '#EEE8DA', marginTop: 20, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${100 - io(F, s(5.6), s(6.45), 0, 100, Easing.linear)}%`, background: F >= s(6.2) ? C_RED : C_ORANGE, borderRadius: 11}} />
          </div>
        </div>
      </Glass>
      <div style={{...abs(560, 1040), transform: `scale(${pop(F, 6.5, 9)}) rotate(-4deg)`}}><Alert size={42}>संपलं!</Alert></div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Wire falls short of the socket ---------- */
const Wire = ({F}) => {
  const reach = io(F, s(7.0), s(7.6), 0, 1, Easing.out(Easing.cubic));
  const end = 140 + 470 * reach;
  return (
    <AbsoluteFill>
      <Glass x={90} y={330} w={900} h={760} r={44} style={{overflow: 'hidden', padding: 0, background: '#F3EEE3'}}>
        <svg width="900" height="760" style={{...abs(0, 0)}}>
          {Array.from({length: 9}, (_, r) => Array.from({length: 7}, (_, c) => <rect key={`${r}${c}`} x={(r % 2 ? -60 : 0) + c * 140} y={r * 86} width="134" height="80" rx="4" fill="#E9DFCC" />))}
          <path d={`M60 380 C 100 380, 120 ${380 + Math.sin(F / 6) * 4}, ${end} 380`} fill="none" stroke={INKC} strokeWidth="18" strokeLinecap="round" />
          <path d={`M60 380 C 100 380, 120 ${380 + Math.sin(F / 6) * 4}, ${end} 380`} fill="none" stroke="#E2683C" strokeWidth="10" strokeLinecap="round" />
          <rect x={end - 6} y="368" width="34" height="24" rx="4" fill="#C9A227" stroke={INKC} strokeWidth="3" />
          {/* socket */}
          <rect x="740" y="300" width="120" height="160" rx="16" fill="#fff" stroke={INKC} strokeWidth="4" />
          <circle cx="785" cy="380" r="9" fill={INKC} /><circle cx="815" cy="380" r="9" fill={INKC} />
          {/* gap */}
          <g opacity={io(F, s(7.55), s(7.75))}>
            <path d={`M${end + 40} 470H730`} stroke={C_RED} strokeWidth="5" strokeDasharray="10 10" />
            <path d={`M${end + 40} 455v30M730 455v30`} stroke={C_RED} strokeWidth="5" />
          </g>
        </svg>
        <div style={{...abs(330, 500), opacity: io(F, s(7.6), s(7.8)), transform: `scale(${pop(F, 7.6, 10)})`}}><Chip color={C_RED} size={40}>2 m कमी</Chip></div>
        <div style={{...abs(50, 50), display: 'flex', alignItems: 'center', gap: 20}}><WireCoil size={110} /><div style={{fontSize: 56, fontWeight: 700, color: TXT}}>वायर</div></div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 4. Carpenter needs plywood (WhatsApp) ---------- */
const PlywoodSc = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={260} w={900} h={900} r={44} style={{overflow: 'hidden', padding: 0, background: '#EFE7DC'}}>
      <div style={{height: 120, background: '#fff', display: 'flex', alignItems: 'center', gap: 18, padding: '0 34px', borderBottom: `1.5px solid ${LINE}`}}>
        <Ini t="R" size={70} bg="linear-gradient(135deg, #FDE68A, #F59E0B)" />
        <div style={{flex: 1}}><div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>Ramesh (Carpenter)</div><div style={{fontSize: 22, color: C_GREEN, fontWeight: 600}}>online</div></div>
        <WhatsApp size={64} round />
      </div>
      <div style={{padding: '34px 30px', display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{alignSelf: 'flex-start', background: '#fff', borderRadius: '26px 26px 26px 8px', padding: '20px 26px 12px', fontSize: 38, fontWeight: 500, color: '#1F1F1F', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transform: `scale(${pop(F, 8.2, 12)})`, transformOrigin: '0 100%'}}>
          साहेब, <b>प्लायवुड ३ शीट</b> लागतील
        </div>
        <div style={{alignSelf: 'flex-start', background: '#fff', borderRadius: '26px 26px 26px 8px', padding: '20px 26px 12px', fontSize: 38, fontWeight: 500, color: '#1F1F1F', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transform: `scale(${pop(F, 8.85, 12)})`, transformOrigin: '0 100%'}}>
          आज नाही आलं तर काम उद्यावर
        </div>
        <div style={{alignSelf: 'center', marginTop: 10, transform: `scale(${pop(F, 8.35, 12)}) rotate(-6deg)`}}><Plywood size={420} /></div>
      </div>
    </Glass>
  </AbsoluteFill>
);

/* ---------- 5. "तर काय करणार?" : searching gives nothing useful ---------- */
const RESULTS = [['Sai Hardware', 'Closed', C_RED], ['City Cement Depot', 'Out of stock', C_RED], ['BuildMart', 'Delivery 2-3 days', C_ORANGE]];
const What = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={330} w={900} h={160} r={80} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 40px', ...up(F, 9.6, 8, 20)}}>
      <Ico d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>} size={56} color={TXT} sw={2.2} />
      <div style={{fontSize: 44, fontWeight: 600, color: TXT, ...LAT}}>{'cement delivery near me'.slice(0, Math.floor(io(F, s(9.6), s(9.95), 0, 23, Easing.linear)))}<span style={{color: C_BLUE}}>|</span></div>
    </Glass>
    <div style={{...abs(90, 540), width: 900, display: 'flex', flexDirection: 'column', gap: 18}}>
      {RESULTS.map(([n, st, c], i) => (
        <Glass key={i} x={0} y={0} w={900} h={170} r={34} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', ...up(F, 9.85 + i * 0.12, 8, 30)}}>
          <Shop size={100} />
          <div style={{flex: 1, fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>{n}</div>
          <Chip color={c} size={30}>{st}</Chip>
        </Glass>
      ))}
    </div>
  </AbsoluteFill>
);

/* ---------- 6. Reveal: HomeRun, Bengaluru (real photo) ---------- */
const Reveal = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(70, 330), transform: `rotate(-2deg) scale(${0.94 + 0.06 * pop(F, 10.45, 16)})`}}>
      <TeamPhoto w={940} h={705} zoom={1.14 - 0.1 * io(F, s(10.4), s(13.0), 0, 1, Easing.linear)} />
    </div>
    <div style={{...abs(760, 210), transform: `scale(${pop(F, 11.0, 10)}) rotate(6deg)`}}><HomeRunLogo size={250} /></div>
    <div style={{...abs(90, 1090), display: 'flex', gap: 18}}>
      <div style={{transform: `scale(${pop(F, 10.6, 12)})`}}><Chip color={C_BLUE} size={38}>Bengaluru</Chip></div>
      <div style={{transform: `scale(${pop(F, 11.5, 12)})`}}><Chip color={C_GREEN} size={38}>Startup</Chip></div>
    </div>
    <div style={{...abs(90, 1190), fontSize: 26, fontWeight: 500, color: MUTED, ...LAT, opacity: io(F, s(11.0), s(11.4))}}>Team HomeRun</div>
  </AbsoluteFill>
);

/* ---------- 6b. Problem -> opportunity (real seconds) ---------- */
const Gap = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={250} w={900} h={360} r={44} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '0 46px', transform: `scale(${popF(F, 13.75, 13)})`}}>
      <div style={{width: 200, height: 200, borderRadius: 48, background: 'var(--l-alertbg)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CementBag size={150} /></div>
      <div><Label>समस्या</Label><div style={{fontSize: 52, fontWeight: 700, color: TXT, marginTop: 8, ...LAT}}>माल वेळेवर मिळत नाही</div></div>
    </Glass>
    <svg width="120" height="200" style={{...abs(480, 630)}}>
      <path d="M60 0V150" stroke={GOLD_T} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, sF(14.3), sF(14.7))} />
      <path d="M25 120l35 40 35-40" fill="none" stroke={GOLD_T} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={io(F, sF(14.6), sF(14.75))} />
    </svg>
    <div style={{...abs(90, 850), transform: `scale(${popF(F, 14.95, 11)})`}}>
      <div style={{width: 900, height: 380, borderRadius: 44, background: Y, boxShadow: `0 30px 80px ${Y}77`, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', boxSizing: 'border-box'}}>
        <HomeRunLogo size={240} />
        <div><div style={{fontSize: 30, fontWeight: 800, color: BG, letterSpacing: '0.12em', opacity: 0.6}}>OPPORTUNITY</div><div style={{fontSize: 110, fontWeight: 800, color: BG, lineHeight: 1.05, ...LAT}}>मोठी संधी</div></div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------- 7. App home (quick commerce for construction) ---------- */
const CATS = [['Cement', CementBag], ['Tiles', Tiles], ['Paint', PaintBucket], ['Plywood', Plywood], ['Wires', WireCoil], ['Plumbing', Pipe]];
const HRHeader = () => (
  <div style={{background: HR_Y, padding: '74px 28px 26px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <HomeRunLogo size={62} style={{boxShadow: 'none'}} />
      <div style={{fontSize: 34, fontWeight: 800, color: HR_B, fontStyle: 'italic', ...LAT}}>HomeRun</div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 6, background: HR_B, color: '#fff', borderRadius: 999, padding: '8px 16px 4px 10px', fontSize: 22, fontWeight: 700}}><Bolt size={22} color={HR_Y} />60 min</div>
    </div>
    <div style={{marginTop: 20, height: 64, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', padding: '4px 20px 0', fontSize: 24, color: '#9a958a', ...LAT}}>Search cement, tiles, paint…</div>
  </div>
);
const App = ({F}) => (
  <AbsoluteFill>
    <PhoneL x={210} y={240} w={660} h={1150} style={{transform: `translateY(${(1 - pop(F, 13.05, 15)) * 500}px) rotate(${-3 + 3 * io(F, s(13), s(15.2))}deg)`}}>
      <HRHeader />
      <div style={{margin: '20px 22px 0', height: 150, borderRadius: 24, background: HR_B, padding: '24px 28px', boxSizing: 'border-box', color: '#fff', position: 'relative', overflow: 'hidden', ...up(F, 13.4, 10, 20)}}>
        <div style={{fontSize: 22, fontWeight: 700, color: HR_Y, letterSpacing: '0.1em'}}>CONSTRUCTION MATERIALS</div>
        <div style={{fontSize: 40, fontWeight: 800, marginTop: 8, ...LAT}}>Delivered to site in 60 min</div>
        <div style={{...abs(520, 40), transform: 'rotate(-10deg)'}}><Tempo size={110} spin={F * 20} /></div>
      </div>
      <div style={{padding: '20px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14}}>
        {CATS.map(([n, Icon], i) => (
          <div key={i} style={{height: 190, borderRadius: 24, background: '#fff', border: '2px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, ...up(F, 13.6 + i * 0.08, 10, 16)}}>
            <Icon size={96} /><div style={{fontSize: 24, fontWeight: 700, color: '#1F1F1F', ...LAT}}>{n}</div>
          </div>
        ))}
      </div>
    </PhoneL>
    <div style={{...abs(40, 1120), transform: `scale(${pop(F, 14.45, 10)}) rotate(-4deg)`}}>
      <div style={{background: Y, borderRadius: 999, padding: '18px 34px 12px', fontSize: 40, fontWeight: 800, color: BG, ...LAT, boxShadow: `0 20px 50px ${Y}77`}}>Quick Commerce App</div>
    </div>
  </AbsoluteFill>
);

/* ---------- 8. Who orders: contractors and home owners ---------- */
const Hardhat = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><path d="M10 42a22 22 0 0 1 44 0z" fill={HR_Y} stroke={INKC} strokeWidth="3" /><path d="M28 20h8v14h-8z" fill="#fff" stroke={INKC} strokeWidth="2.5" /><rect x="6" y="42" width="52" height="8" rx="3" fill={HR_Y} stroke={INKC} strokeWidth="3" /></svg>
);
const HouseI = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><path d="M8 30 32 10l24 20" fill="none" stroke={INKC} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 26v30h36V26" fill="#fff" stroke={INKC} strokeWidth="3.5" /><rect x="27" y="38" width="10" height="18" fill={HR_B} /></svg>
);
const Users = ({F}) => (
  <AbsoluteFill>
    {[[15.95, <Hardhat key="h" size={170} />, 'Contractors', 'Bulk · 200 bags cement', 260, -3], [16.45, <HouseI key="o" size={170} />, 'घरमालक', 'Repair · 2 buckets paint', 800, 3]].map(([t, ic, n, sub, y, r], i) => (
      <Glass key={i} x={90} y={y} w={900} h={460} r={44} style={{display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', transform: `translateX(${(1 - pop(F, t, 13)) * (i ? 900 : -900)}px) rotate(${r}deg)`}}>
        <div style={{width: 260, height: 260, borderRadius: 60, background: i ? '#E8E8FD' : '#FFF6C7', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic}</div>
        <div><div style={{fontSize: 66, fontWeight: 700, color: TXT, ...LAT}}>{n}</div><div style={{fontSize: 32, fontWeight: 500, color: MUTED, marginTop: 8, ...LAT}}>{sub}</div></div>
      </Glass>
    ))}
  </AbsoluteFill>
);

/* ---------- 9. Products fly into the cart ---------- */
const PRODS = [[17.16, CementBag, 'Cement', 'OPC 53 · 50 kg', 385], [17.43, Tiles, 'Tiles', '2×2 ft · box', 640], [18.51, PaintBucket, 'Paint', '20 L emulsion', 3150], [19.05, Plywood, 'Plywood', '18 mm · 8×4', 2280]];
const Products = ({F}) => {
  const inCart = io(F, s(19.9), s(20.4), 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 250), width: 900, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        {PRODS.map(([t, Icon, n, sub, p], i) => (
          <div key={i} style={{transform: `scale(${pop(F, t, 11) * (1 - inCart * 0.75)}) translate(${inCart * (i % 2 ? -120 : 200)}px, ${inCart * (760 - Math.floor(i / 2) * 470)}px)`, opacity: 1 - inCart * 0.9}}>
            <Glass x={0} y={0} w={438} h={440} r={40} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
              <Icon size={200} />
              <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>{n}</div>
              <div style={{fontSize: 24, color: MUTED, ...LAT}}>{sub}</div>
              <div style={{fontSize: 34, fontWeight: 700, color: HR_B, ...LAT}}>₹{p.toLocaleString('en-IN')}</div>
            </Glass>
          </div>
        ))}
      </div>
      <div style={{...abs(340, 1180), width: 400, height: 150, borderRadius: 40, background: HR_B, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, color: '#fff', fontSize: 40, fontWeight: 800,
        transform: `scale(${pop(F, 19.6, 11) * (1 + 0.1 * io(F, s(20.3), s(20.45)) * io(F, s(20.45), s(20.6), 1, 0))})`, boxShadow: `0 20px 50px ${HR_B}55`, ...LAT}}>
        <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2l2.5 11h11L21 7H7" /><circle cx="9" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>
        Cart · {F >= s(20.4) ? 4 : 0}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 10. Straight to site in 60 minutes ---------- */
const Delivery = ({F}) => {
  const p = io(F, s(20.9), s(23.6), 0, 1, Easing.inOut(Easing.cubic));
  const R = 230, C = 2 * Math.PI * R;
  const route = 'M120 250 C 260 250, 300 90, 470 120 S 690 230, 760 110';
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 280, 230), width: 560, height: 560, transform: `scale(${pop(F, 20.7, 14)})`}}>
        <svg width="560" height="560" style={{...abs(0, 0)}}>
          <circle cx="280" cy="280" r={R} fill="#fff" stroke="rgba(0,0,0,0.06)" strokeWidth="34" />
          <circle cx="280" cy="280" r={R} fill="none" stroke={HR_Y} strokeWidth="34" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 280 280)" />
          {Array.from({length: 12}, (_, i) => <line key={i} x1="280" y1="70" x2="280" y2={i % 3 ? 84 : 92} stroke="rgba(0,0,0,0.25)" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 30} 280 280)`} />)}
        </svg>
        <div style={{...abs(0, 160), width: 560, textAlign: 'center'}}>
          <Big size={220} color={HR_B}>{Math.round(60 * io(F, s(21.6), s(22.2), 0, 1))}</Big>
          <div style={{fontSize: 50, fontWeight: 700, color: TXT, marginTop: 4}}>मिनिट</div>
        </div>
      </div>
      <Glass x={90} y={860} w={900} h={460} r={44} style={{padding: 30, ...up(F, 20.8, 14, 40)}}>
        <svg viewBox="0 0 840 400" width="840" height="400" style={{...abs(30, 30)}}>
          {[60, 140, 220, 300].map((y) => <path key={y} d={`M0 ${y}H840`} stroke="rgba(0,0,0,0.05)" strokeWidth="18" />)}
          {[150, 380, 610].map((x) => <path key={x} d={`M${x} 0V400`} stroke="rgba(0,0,0,0.05)" strokeWidth="18" />)}
          <path d={route} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="12" strokeLinecap="round" />
          <path d={route} fill="none" stroke={HR_B} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
        <div style={{...abs(60, 210), display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Shop size={90} /><div style={{fontSize: 24, fontWeight: 700, color: TXT}}>Store</div></div>
        <div style={{...abs(750, 40), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{width: 84, height: 84, borderRadius: 42, background: C_RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${10 + 6 * Math.sin(F / 5)}px ${C_RED}22`}}><Ico d={I_PIN} size={50} color="#fff" sw={2.4} /></div>
          <div style={{fontSize: 24, fontWeight: 700, color: TXT, marginTop: 6}}>Site</div>
        </div>
        <div style={{position: 'absolute', left: 30, top: 30, width: 840, height: 400}}>
          <div style={{position: 'absolute', offsetPath: `path('${route}')`, offsetDistance: `${p * 100}%`, offsetRotate: '0deg', transform: 'translate(-50%, -70%)'}}><Tempo size={150} spin={F * 30} /></div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 11. Response: orders pinging in ---------- */
const PINGS = [['Whitefield', '40 bags cement'], ['HSR Layout', 'Tiles · 12 boxes'], ['Sarjapur', 'Paint · 20 L ×3'], ['Hebbal', 'Plywood · 6 sheets'], ['Electronic City', 'Wires · 4 coils'], ['Yelahanka', 'Cement · 25 bags'], ['Koramangala', 'Pipes · 18 pcs']];
const Pings = ({F}) => {
  const n = PINGS.filter((_, i) => F >= s(24.05 + i * 0.36)).length;
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 240), width: 900, height: 1100, overflow: 'hidden'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {PINGS.slice(0, n).reverse().map(([loc, item], k) => {
            const i = n - 1 - k, t = 24.05 + i * 0.36;
            const g = io(F, s(t), s(t) + 6);
            return (
              <div key={i} style={{height: 150 * g, opacity: g, flexShrink: 0}}>
                <Glass x={0} y={0} w={900} h={140} r={34} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, padding: '0 30px', transform: `scale(${0.9 + 0.1 * g})`}}>
                  <HomeRunLogo size={78} style={{boxShadow: 'none'}} />
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, color: MUTED, ...LAT}}><span>NEW ORDER</span><span>now</span></div>
                    <div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>{item} · {loc}</div>
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 12. 1,00,000+ orders ---------- */
const Orders = ({F}) => {
  const v = Math.round(io(F, s(27.4), s(29.2), 0, 100000, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 330), width: 1080, textAlign: 'center'}}>
        <Label>ORDERS DELIVERED</Label>
        <Big size={190} style={{marginTop: 20, fontVariantNumeric: 'tabular-nums'}}>{v.toLocaleString('en-IN')}<span style={{color: GOLD_T}}>+</span></Big>
      </div>
      {/* receipt stack */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{...abs(250 + (i % 2 ? 30 : -30) + i * 4, 980 - i * 60), transform: `rotate(${(i - 2) * 4}deg) translateY(${(1 - pop(F, 27.2 + i * 0.25, 12)) * 600}px)`}}>
          <Glass x={0} y={0} w={580} h={200} r={28} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px'}}>
            <Tick size={60} />
            <div style={{flex: 1}}><div style={{fontSize: 30, fontWeight: 700, color: TXT, ...LAT}}>Order #{(98420 + i * 377).toLocaleString('en-IN')}</div><div style={{fontSize: 22, color: MUTED, ...LAT}}>Delivered · 52 min</div></div>
            <HomeRunLogo size={70} style={{boxShadow: 'none'}} />
          </Glass>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 13. 8x growth in 12 months ---------- */
const GROW = [1, 1.25, 1.5, 1.9, 2.3, 2.9, 3.6, 4.4, 5.3, 6.2, 7.1, 8];
const Growth = ({F}) => {
  const p = io(F, s(30.45), s(31.6), 0, 1, Easing.inOut(Easing.cubic));
  const pts = GROW.map((g, i) => [60 + i * 70, 560 - g * 62]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <AbsoluteFill>
      <Glass x={90} y={260} w={900} h={930} r={44} style={{padding: '40px 44px'}}>
        <Label>BUSINESS · LAST 12 MONTHS</Label>
        <Big size={200} color={C_GREEN} style={{marginTop: 18}}>{Math.max(1, Math.round(8 * io(F, s(30.8), s(31.4))))}×</Big>
        <svg viewBox="0 0 900 600" width="812" height="560" style={{marginTop: 20, overflow: 'visible'}}>
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M40 ${560 - k * 160}H860`} stroke="rgba(0,0,0,0.06)" strokeWidth="2" />)}
          <path d={`${d} L${pts[11][0]} 560 L60 560Z`} fill={`${C_GREEN}22`} style={{clipPath: `inset(0 ${100 - p * 100}% 0 0)`}} />
          <path d={d} fill="none" stroke={C_GREEN} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
          <circle cx={pts[11][0]} cy={pts[11][1]} r="16" fill={C_GREEN} opacity={io(F, s(31.5), s(31.7))} />
        </svg>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 14. $12M funding (real photo) ---------- */
const Funding = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(70, 250), transform: `scale(${0.95 + 0.05 * pop(F, 32.1, 16)})`}}>
      <TeamPhoto w={940} h={1060} zoom={1.25 - 0.1 * io(F, s(32), s(35.4), 0, 1, Easing.linear)} />
      <div style={{...abs(0, 0), width: 940, height: 1060, borderRadius: 40, background: 'linear-gradient(180deg, rgba(10,10,11,0) 35%, rgba(10,10,11,0.88) 100%)'}} />
      <div style={{...abs(50, 650)}}>
        <div style={{...up(F, 32.4, 12, 20), fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em'}}>FUNDING RAISED</div>
        <Big size={220} color={Y} style={{marginTop: 10, transform: `scale(${pop(F, 32.45, 10)})`, transformOrigin: '0 100%'}}>$12M</Big>
        <div style={{...up(F, 34.0, 12, 20), fontSize: 34, fontWeight: 600, color: '#fff', marginTop: 12, ...LAT}}>≈ ₹100 कोटी</div>
      </div>
      <div style={{...abs(700, 40), transform: `scale(${pop(F, 32.8, 10)}) rotate(6deg)`}}><HomeRunLogo size={190} /></div>
    </div>
  </AbsoluteFill>
);

/* ---------- 15. Business lesson ---------- */
const Lesson = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(140, 380), width: 800, height: 760, borderRadius: 30, background: '#FFFDF6', boxShadow: '0 40px 80px rgba(60,45,10,0.18)', transform: `rotate(-3deg) scale(${pop(F, 35.45, 13)})`,
      backgroundImage: 'linear-gradient(rgba(59,130,246,0.18) 2px, transparent 2px)', backgroundSize: '100% 70px', backgroundPosition: '0 150px', overflow: 'hidden'}}>
      <div style={{...abs(90, 0), width: 3, height: '100%', background: 'rgba(239,68,68,0.4)'}} />
      <div style={{...abs(130, 90), display: 'flex', alignItems: 'center', gap: 20}}><Bulb size={120} /><div style={{fontSize: 34, fontWeight: 800, color: GOLD_T, letterSpacing: '0.12em'}}>BUSINESS LESSON</div></div>
      <div style={{...abs(130, 290), fontSize: 120, fontWeight: 800, color: TXT, lineHeight: 1.05, ...LAT}}>
        <div style={up(F, 35.9, 10, 20)}>धडा</div>
        <div style={{...up(F, 36.6, 10, 20), color: GOLD_T}}>काय आहे?</div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------- 16. Market already had shops and customers ---------- */
const SHOP_PINS = [[180, 360], [420, 520], [700, 330], [300, 780], [820, 640], [560, 900]];
const CUST_PINS = [[120, 600], [350, 300], [620, 610], [860, 420], [200, 980], [760, 960], [480, 1040], [920, 820]];
const Market = ({F}) => (
  <AbsoluteFill>
    <Glass x={60} y={230} w={960} h={1120} r={44} style={{overflow: 'hidden', padding: 0, background: '#F2EEE4'}}>
      <svg width="960" height="1120" style={{...abs(0, 0)}}>
        {[180, 420, 660, 900].map((y) => <path key={y} d={`M0 ${y}H960`} stroke="#fff" strokeWidth="26" />)}
        {[150, 400, 650, 880].map((x) => <path key={x} d={`M${x} 0V1120`} stroke="#fff" strokeWidth="26" />)}
        <path d="M0 760 C 300 700, 600 840, 960 720" stroke="#BFD8EA" strokeWidth="40" fill="none" />
      </svg>
      {SHOP_PINS.map(([x, y], i) => (
        <div key={`s${i}`} style={{...abs(x - 50, y - 50), transform: `scale(${pop(F, 37.9 + i * 0.09, 11)})`}}>
          <div style={{width: 100, height: 100, borderRadius: 30, background: '#fff', boxShadow: '0 12px 24px rgba(60,45,10,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Shop size={76} /></div>
        </div>
      ))}
      {CUST_PINS.map(([x, y], i) => (
        <div key={`c${i}`} style={{...abs(x - 34, y - 34), transform: `scale(${pop(F, 38.8 + i * 0.07, 11)})`}}>
          <div style={{width: 68, height: 68, borderRadius: 34, background: HR_B, border: '5px solid #fff', boxShadow: '0 8px 18px rgba(60,45,10,0.2)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}><Person size={52} c="#fff" /></div>
        </div>
      ))}
      <div style={{...abs(30, 1020), display: 'flex', gap: 14}}>
        <div style={{transform: `scale(${pop(F, 38.2, 12)})`}}><Chip color={C_ORANGE} size={30}>दुकानं</Chip></div>
        <div style={{transform: `scale(${pop(F, 38.97, 12)})`}}><Chip color={C_BLUE} size={30}>ग्राहक</Chip></div>
      </div>
    </Glass>
  </AbsoluteFill>
);

/* ---------- 17-19. The three frictions ---------- */
const CALLS = [['Sai Hardware', 'नाही', C_RED], ['Om Cement Depot', 'उद्या बघू', C_ORANGE], ['Patil Traders', 'No answer', C_RED]];
const Calls = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(90, 260), display: 'flex', alignItems: 'center', gap: 20, ...up(F, 40.45, 8, 20)}}>
      <Ico d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>} size={70} color={TXT} sw={2.4} /><Big size={84}>माल शोधणं</Big>
    </div>
    <div style={{...abs(90, 420), width: 900, display: 'flex', flexDirection: 'column', gap: 20}}>
      {CALLS.map(([n, r, c], i) => (
        <Glass key={i} x={0} y={0} w={900} h={190} r={36} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', ...up(F, 40.55 + i * 0.22, 8, 30)}}>
          <div style={{width: 100, height: 100, borderRadius: 50, background: `${C_GREEN}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={I_PHONE} size={52} color={C_GREEN} sw={2.2} /></div>
          <div style={{flex: 1}}><div style={{fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>{n}</div><div style={{fontSize: 24, color: MUTED, ...LAT}}>सिमेंट आहे का?</div></div>
          <div style={{transform: `scale(${pop(F, 40.75 + i * 0.22, 10)})`}}><Chip color={c} size={32}>{r}</Chip></div>
        </Glass>
      ))}
    </div>
  </AbsoluteFill>
);
const QUOTES = [['Shop A', 380], ['Shop B', 415], ['Shop C', 395]];
const Quotes = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(90, 260), display: 'flex', alignItems: 'center', gap: 20, ...up(F, 41.6, 8, 20)}}>
      <div style={{fontSize: 80, fontWeight: 800, color: TXT}}>₹</div><Big size={84}>किमती?</Big>
    </div>
    <div style={{...abs(90, 450), width: 900, display: 'flex', gap: 20}}>
      {QUOTES.map(([n, p], i) => (
        <Glass key={i} x={0} y={0} w={286} h={520} r={36} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${pop(F, 41.7 + i * 0.15, 11)}) rotate(${(i - 1) * 3}deg)`}}>
          <Shop size={110} />
          <div style={{fontSize: 30, fontWeight: 600, color: MUTED, ...LAT}}>{n}</div>
          <div style={{fontSize: 70, fontWeight: 800, color: TXT, ...LAT}}>₹{p}</div>
          <div style={{fontSize: 22, color: MUTED, ...LAT}}>per bag</div>
        </Glass>
      ))}
    </div>
    <div style={{...abs(380, 1030), transform: `scale(${pop(F, 42.2, 9)})`}}><div style={{width: 320, height: 160, borderRadius: 80, background: 'var(--l-alertbg)', border: `2px solid ${C_RED}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, fontWeight: 800, color: C_RED}}>???</div></div>
  </AbsoluteFill>
);
const Late = ({F}) => {
  const days = Math.min(3, Math.floor(io(F, s(43.4), s(44.4), 0, 3.99, Easing.linear)));
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 260), display: 'flex', alignItems: 'center', gap: 20, ...up(F, 42.75, 8, 20)}}>
        <Ico d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} size={70} color={TXT} sw={2.4} /><Big size={84}>वेळेवर माल?</Big>
      </div>
      <Glass x={90} y={430} w={900} h={640} r={44} style={{padding: '36px 40px', ...up(F, 42.8, 10, 40)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ico d={I_CAL} size={46} color={TXT} /><div style={{fontSize: 36, fontWeight: 700, color: TXT, ...LAT}}>Delivery</div><div style={{flex: 1}} /><Chip color={C_RED} size={28}>{days || 1} दिवस</Chip></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginTop: 30}}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} style={{textAlign: 'center', fontSize: 24, fontWeight: 700, color: MUTED}}>{d}</div>)}
          {Array.from({length: 14}, (_, i) => {
            const waiting = i >= 2 && i < 2 + days;
            return (
              <div key={i} style={{height: 96, borderRadius: 18, background: i === 1 ? `${HR_B}22` : waiting ? `${C_RED}1C` : 'rgba(0,0,0,0.035)', border: i === 1 ? `3px solid ${HR_B}` : waiting ? `2px solid ${C_RED}55` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: waiting ? C_RED : TXT}}>{waiting ? '✕' : i + 10}</div>
            );
          })}
        </div>
        <div style={{display: 'flex', gap: 30, marginTop: 30, fontSize: 24, color: MUTED, ...LAT}}><span><b style={{color: HR_B}}>■</b> ordered</span><span><b style={{color: C_RED}}>■</b> site waiting</span></div>
      </Glass>
      <div style={{...abs(0, 1140), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 44.4, 9)}) rotate(-2deg)`}}><Alert size={42}>मोठी अडचण</Alert></div>
    </AbsoluteFill>
  );
};

/* ---------- 20. One simple system: search -> price -> 60 min ---------- */
const MiniScreen = ({t, title, children, F}) => (
  <div style={{width: 290, transform: `translateY(${(1 - pop(F, t, 13)) * 500}px)`}}>
    <div style={{width: 290, height: 560, borderRadius: 44, background: '#1d1d1f', padding: 8, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(60,45,10,0.25)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 38, background: '#FAF8F3', overflow: 'hidden'}}>
        <div style={{height: 70, background: HR_Y, display: 'flex', alignItems: 'flex-end', padding: '0 16px 10px', fontSize: 22, fontWeight: 800, color: HR_B, fontStyle: 'italic'}}>HomeRun</div>
        <div style={{padding: 16}}>{children}</div>
      </div>
    </div>
    <div style={{textAlign: 'center', fontSize: 34, fontWeight: 700, color: TXT, marginTop: 18, ...LAT}}>{title}</div>
  </div>
);
const System = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 230), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 45.6, 11)})`}}><HomeRunLogo size={200} /></div>
    <div style={{...abs(60, 500), width: 960, display: 'flex', justifyContent: 'space-between'}}>
      <MiniScreen F={F} t={45.9} title="Search">
        <div style={{height: 46, borderRadius: 12, background: '#fff', border: '2px solid rgba(0,0,0,0.08)', fontSize: 20, padding: '12px 12px 0', color: '#1F1F1F'}}>cement</div>
        {[0, 1, 2].map((i) => <div key={i} style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 14}}><CementBag size={60} /><div style={{flex: 1}}><div style={{height: 12, borderRadius: 6, background: '#DDD4C2', width: '90%'}} /><div style={{height: 10, borderRadius: 5, background: '#ECE6D8', width: '60%', marginTop: 8}} /></div></div>)}
      </MiniScreen>
      <MiniScreen F={F} t={46.6} title="Clear price">
        <div style={{display: 'flex', justifyContent: 'center'}}><CementBag size={150} /></div>
        <div style={{fontSize: 22, color: '#8a8478', textAlign: 'center'}}>OPC 53 · 50 kg</div>
        <div style={{fontSize: 56, fontWeight: 800, color: HR_B, textAlign: 'center', ...LAT}}>₹385</div>
        <div style={{height: 54, borderRadius: 14, background: HR_B, marginTop: 14, color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4}}>Add to cart</div>
      </MiniScreen>
      <MiniScreen F={F} t={47.3} title="60 min">
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}><Tempo size={200} spin={F * 30} /></div>
        <div style={{fontSize: 24, fontWeight: 700, color: '#1F1F1F', textAlign: 'center', marginTop: 20}}>Arriving in</div>
        <div style={{fontSize: 60, fontWeight: 800, color: C_GREEN, textAlign: 'center', ...LAT}}>{Math.max(12, 60 - Math.floor(io(F, s(47.5), s(48.8), 0, 48)))} min</div>
      </MiniScreen>
    </div>
    <div style={{...abs(0, 1190), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 47.6, 10)})`}}><Chip color={C_GREEN} size={40}>Simple System</Chip></div>
  </AbsoluteFill>
);

/* ---------- 21. No new idea needed ---------- */
const Idea = ({F}) => {
  const x = io(F, s(50.85), s(51.2));
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 220, 300), transform: `scale(${pop(F, 48.95, 12)})`, filter: `grayscale(${x})`, opacity: 1 - x * 0.5}}><Bulb size={440} on={1 - x} /></div>
      <div style={{...abs(0, 820), width: 1080, textAlign: 'center', ...up(F, 49.75, 10, 20)}}><Big size={120} style={{display: 'inline-block'}}>नवीन कल्पना?</Big></div>
      <svg width="900" height="200" style={{...abs(90, 780), overflow: 'visible'}}><path d="M60 140 L840 40" stroke={C_RED} strokeWidth="14" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - x} /></svg>
      <div style={{...abs(0, 1060), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 51.0, 10)})`}}><Chip color={C_GREEN} size={40}>गरज नाही</Chip></div>
    </AbsoluteFill>
  );
};

/* ---------- 22. Old business + 1 problem solved = crore company ---------- */
const Formula = ({F}) => {
  const eq = [[51.8, <Shop key="s" size={110} />, 'जुना बिझनेस', null], [53.1, <Wrench key="w" size={100} />, '1 प्रॉब्लेम सोडवला', '+'], [54.6, <Rocket key="r" size={110} />, 'कोट्यवधींची कंपनी', '=']];
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 280), width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
        {eq.map(([t, ic, label, op], i) => (
          <React.Fragment key={i}>
            {op && <div style={{fontSize: 90, fontWeight: 800, color: GOLD_T, lineHeight: 1, transform: `scale(${pop(F, t - 0.15, 10)})`}}>{op}</div>}
            <Glass x={0} y={0} w={900} h={230} r={40} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', transform: `scale(${pop(F, t, 13)})`,
              ...(i === 2 ? {background: Y, borderColor: 'transparent', boxShadow: `0 30px 70px ${Y}66`} : {})}}>
              <div style={{width: 150, height: 150, borderRadius: 36, background: i === 2 ? '#fff' : '#F6F1E6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic}</div>
              <div style={{fontSize: 56, fontWeight: 700, color: i === 2 ? BG : TXT, ...LAT}}>{label}</div>
            </Glass>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 23. Your idea ---------- */
const Yours = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(540 - 300, 280), width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(closest-side, ${Y}88, transparent)`, opacity: io(F, s(57.2), s(58.4)), transform: `scale(${0.8 + 0.2 * Math.sin(F / 10)})`}} />
    <div style={{...abs(540 - 200, 340), transform: `scale(${pop(F, 56.95, 11)}) rotate(${Math.sin(F / 12) * 4}deg)`}}><Bulb size={400} /></div>
    <div style={{...abs(0, 820), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 58.85, 10)})`}}>
      <div style={{background: TXT, color: 'var(--l-bg)', borderRadius: 30, padding: '24px 44px 16px', fontSize: 80, fontWeight: 800, ...LAT}}>तुमची <span style={{color: Y}}>Business Idea</span></div>
    </div>
  </AbsoluteFill>
);

/* ---------- 24. Build it: mobile app + website (wireframe -> designed) ---------- */
const Build = ({F}) => {
  const a = io(F, s(61.3), s(61.9)), w = io(F, s(62.25), s(62.85));
  return (
    <AbsoluteFill>
      <PhoneL x={90} y={300} w={380} h={780} style={{transform: `scale(${pop(F, 60.0, 13)}) rotate(-4deg)`}}>
        <div style={{padding: '60px 20px 20px'}}>
          <div style={{height: 120, borderRadius: 22, background: a ? Y : 'transparent', border: `3px dashed rgba(0,0,0,${0.25 * (1 - a)})`, opacity: 0.4 + 0.6 * a}} />
          {[0, 1, 2, 3].map((i) => <div key={i} style={{display: 'flex', gap: 12, marginTop: 18, alignItems: 'center'}}><div style={{width: 70, height: 70, borderRadius: 16, background: a ? ['#FFE7A3', '#DCE7F2', '#DFF3D8', '#F3DCE7'][i] : 'transparent', border: `2px dashed rgba(0,0,0,${0.2 * (1 - a)})`}} /><div style={{flex: 1}}><div style={{height: 14, borderRadius: 7, background: a ? '#2A2A2A' : 'rgba(0,0,0,0.1)', width: '80%'}} /><div style={{height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.1)', width: '50%', marginTop: 8}} /></div></div>)}
          <div style={{height: 70, borderRadius: 20, background: a ? BG : 'rgba(0,0,0,0.08)', marginTop: 26}} />
        </div>
      </PhoneL>
      <div style={{...abs(500, 470), width: 500, height: 420, borderRadius: 28, background: '#fff', boxShadow: '0 30px 60px rgba(60,45,10,0.18)', overflow: 'hidden', transform: `scale(${pop(F, 60.5, 13)}) rotate(3deg)`}}>
        <div style={{height: 46, background: '#F1ECE1', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px'}}>{[C_RED, Y, C_GREEN].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}<div style={{flex: 1, height: 24, borderRadius: 12, background: '#fff', marginLeft: 12}} /></div>
        <div style={{padding: 26}}>
          <div style={{height: 34, width: '70%', borderRadius: 8, background: w ? '#2A2A2A' : 'rgba(0,0,0,0.1)'}} /><div style={{height: 16, width: '90%', borderRadius: 8, background: 'rgba(0,0,0,0.1)', marginTop: 16}} />
          <div style={{display: 'flex', gap: 14, marginTop: 26}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 150, borderRadius: 16, background: w ? [Y, '#DCE7F2', '#DFF3D8'][i] : 'transparent', border: `2px dashed rgba(0,0,0,${0.2 * (1 - w)})`}} />)}</div>
        </div>
      </div>
      <div style={{...abs(110, 1110), transform: `scale(${pop(F, 61.3, 11)})`}}><Chip color={C_BLUE} size={40}>Mobile App</Chip></div>
      <div style={{...abs(640, 930), transform: `scale(${pop(F, 62.25, 11)})`}}><Chip color={C_GREEN} size={40}>Website</Chip></div>
      <div style={{...abs(560, 1060), transform: `scale(${pop(F, 63.1, 11)})`, display: 'flex', alignItems: 'center', gap: 14, background: Y, borderRadius: 999, padding: '16px 30px 10px', fontSize: 36, fontWeight: 800, color: BG, ...LAT}}>बिझनेस सुरू</div>
    </AbsoluteFill>
  );
};

/* ---------- 25. DM Outgrid Labs ---------- */
const Dm = ({F}) => {
  const typed = 'Hi, माझी एक Business Idea आहे'.slice(0, Math.floor(io(F, s(64.95), s(65.85), 0, 29, Easing.linear)));
  return (
    <AbsoluteFill>
      <Glass x={90} y={260} w={900} h={1020} r={44} style={{padding: 0, overflow: 'hidden', ...up(F, 64.7, 12, 60)}}>
        <div style={{padding: '40px 40px 30px', display: 'flex', alignItems: 'center', gap: 26, borderBottom: `1.5px solid ${LINE}`}}>
          <div style={{width: 150, height: 150, borderRadius: 75, padding: 6, background: 'linear-gradient(45deg, #fdf497, #fd5949, #d6249f, #285AEB)'}}>
            <div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #fff', boxSizing: 'border-box'}}>
              <Mark size={74} color="#fff" />
            </div>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>outgridlabs</div>
            <div style={{fontSize: 26, color: MUTED, ...LAT}}>Apps · Websites · Automation</div>
          </div>
          <Instagram size={70} />
        </div>
        <div style={{padding: '30px 40px', display: 'flex', gap: 18}}>
          <div style={{flex: 1, height: 80, borderRadius: 18, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: TXT}}>Following</div>
          <div style={{flex: 1, height: 80, borderRadius: 18, background: '#0095F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: '#fff',
            transform: `scale(${1 - 0.06 * io(F, s(65.0), s(65.1)) * io(F, s(65.1), s(65.25), 1, 0)})`}}>Message</div>
        </div>
        <div style={{...abs(40, 640), right: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16}}>
          {F >= s(66.0) && <div style={{background: '#3797F0', color: '#fff', borderRadius: '28px 28px 8px 28px', padding: '18px 26px 12px', fontSize: 34, fontWeight: 500, transform: `scale(${pop(F, 66.0, 12)})`, transformOrigin: '100% 100%'}}>Hi, माझी एक Business Idea आहे</div>}
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 100, borderRadius: 50, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '6px 30px 0', fontSize: 32, fontWeight: 500, color: TXT, ...LAT}}>
          {F < s(66.0) ? <>{typed}<span style={{color: '#0095F6', opacity: Math.floor(F / 8) % 2}}>|</span></> : <span style={{color: MUTED}}>Message…</span>}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => <LeanOutro F={F} at={OUTRO_AT} cta="DM करा" />;

/* ---------- main ---------- */
const COMPS = {hook: Hook, cement: Cement, wire: Wire, plywood: PlywoodSc, what: What, reveal: Reveal, gap: Gap, app: App, users: Users, products: Products, delivery: Delivery,
  pings: Pings, orders: Orders, growth: Growth, funding: Funding, lesson: Lesson, market: Market, calls: Calls, quotes: Quotes, late: Late, system: System,
  idea: Idea, formula: Formula, yours: Yours, build: Build, dm: Dm, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
