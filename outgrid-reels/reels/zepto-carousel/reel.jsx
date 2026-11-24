// Zepto "10-minute delivery" Instagram carousel, 1080x1350 (4:5). One frame per slide: frame 0 = slide 1.
// Outgrid lean light background. v2 direction: one precise hero graphic per slide on a white "lens" disc,
// hairline geometry, one yellow accent, Zepto purple only for Zepto things, big quiet whitespace, no extra chrome.
// Render: node scripts/stills_fast.mjs reels/zepto-carousel reels/zepto-carousel/stills 2 0 1 ...
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame} from 'remotion';
import {abs, Y, Mark, BRAND} from '../../shared/kit.jsx';
import {THEMES, ThemeCtx, LeanBg, LAT, Ico} from '../../shared/lean.jsx';

const W = 1080, H = 1350, N = 9, PAD = 80;
const INK = '#111111';
const SOFT = 'rgba(17,17,17,0.55)';
const HAIR = 'rgba(17,17,17,0.10)';
const ZP = '#4B1A8C'; // Zepto purple (placeholder wordmark until the official logo file is added)
const CX = 540, CY = 480, R = 300; // hero disc

/* ---------- primitives ---------- */
const P = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
const sector = (cx, cy, r, a0, a1) => {
  const [x0, y0] = P(cx, cy, r, a0), [x1, y1] = P(cx, cy, r, a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
};
const ZeptoWord = ({size = 30}) => (
  <div style={{display: 'inline-flex', background: ZP, color: '#fff', borderRadius: size * 0.34, padding: `${size * 0.22}px ${size * 0.44}px ${size * 0.06}px`,
    fontWeight: 800, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1}}>zepto</div>
);
// the white lens every hero graphic sits on
const Disc = ({children}) => (
  <svg width={W} height={980} viewBox={`0 0 ${W} 980`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <defs>
      <radialGradient id="face" cx="50%" cy="38%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F7F5F0" /></radialGradient>
      <linearGradient id="wedge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD75E" /><stop offset="1" stopColor="#FFB800" /></linearGradient>
      <filter id="lift" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="40" stdDeviation="40" floodColor="#5A430A" floodOpacity="0.12" />
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.05" />
      </filter>
    </defs>
    <circle cx={CX} cy={CY} r={R} fill="url(#face)" filter="url(#lift)" />
    <circle cx={CX} cy={CY} r={R - 0.75} fill="none" stroke="rgba(17,17,17,0.06)" strokeWidth="1.5" />
    {children}
  </svg>
);
const Mono = ({children, style = {}}) => <div style={{fontSize: 24, fontWeight: 500, color: SOFT, letterSpacing: '0.03em', ...style}}>{children}</div>;

/* ---------- chrome: only the brand and the page number ---------- */
const Header = ({i}) => (
  <>
    <div style={{...abs(PAD, 66), display: 'flex', alignItems: 'center', gap: 12}}>
      <Mark size={34} color={INK} />
      <div style={{...BRAND, fontSize: 24, fontWeight: 600, color: INK, letterSpacing: '-0.01em'}}>Outgrid Labs</div>
    </div>
    <div style={{...abs(W - PAD - 120, 72), width: 120, textAlign: 'right', ...BRAND, fontSize: 22, fontWeight: 500, color: SOFT, letterSpacing: '0.06em'}}>
      {String(i + 1).padStart(2, '0')} — {String(N).padStart(2, '0')}
    </div>
  </>
);
const Swipe = () => (
  <div style={{...abs(W - PAD - 64, H - PAD - 64), width: 64, height: 64, borderRadius: 32, border: `2px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </div>
);
// text block anchored to the bottom: eyebrow, title, one quiet line
const Copy = ({eyebrow, title, body}) => (
  <div style={{position: 'absolute', left: PAD, bottom: 130, width: W - PAD * 2}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 40}}>{eyebrow}</div>
    <div style={{marginTop: 26, fontSize: 78, fontWeight: 600, color: INK, lineHeight: 1.12, letterSpacing: '-0.025em'}}>{title}</div>
    {body && <div style={{marginTop: 26, fontSize: 36, fontWeight: 400, color: SOFT, lineHeight: 1.4, letterSpacing: '-0.01em', maxWidth: 820}}>{body}</div>}
  </div>
);
const Step = ({n, label}) => (
  <>
    <Mono style={{color: INK, fontWeight: 600, fontSize: 24}}>{n}</Mono>
    <div style={{width: 48, height: 2, background: Y}} />
    <div style={{fontSize: 28, fontWeight: 500, color: SOFT, marginTop: 4}}>{label}</div>
  </>
);

/* ---------- slide 1: a 60-minute dial, the first 10 minutes cut out in yellow ---------- */
const S1 = () => {
  const ticks = Array.from({length: 60}, (_, k) => k);
  const [hx, hy] = P(CX, CY, R - 92, 60);
  return (
    <>
      <Disc>
        {ticks.map((k) => {
          const major = k % 5 === 0;
          const [x0, y0] = P(CX, CY, R - (major ? 50 : 38), k * 6), [x1, y1] = P(CX, CY, R - 24, k * 6);
          return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={k <= 10 ? INK : major ? 'rgba(17,17,17,0.45)' : 'rgba(17,17,17,0.16)'} strokeWidth={major ? 3 : 2} strokeLinecap="round" />;
        })}
        <path d={sector(CX, CY, R - 64, 0, 60)} fill="url(#wedge)" />
        <circle cx={CX} cy={CY} r={R - 160} fill="none" stroke={HAIR} strokeWidth="1.5" />
        <line x1={CX} y1={CY} x2={CX} y2={CY - (R - 92)} stroke={INK} strokeWidth="2" strokeOpacity="0.25" />
        <line x1={CX} y1={CY} x2={hx} y2={hy} stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="13" fill={INK} /><circle cx={CX} cy={CY} r="4.5" fill={Y} />
      </Disc>
      {/* readout in the lower half of the dial */}
      <div style={{...abs(CX - 150, CY + 120), width: 300, textAlign: 'center', fontSize: 64, fontWeight: 600, color: INK, lineHeight: 1, ...LAT}}>
        10<span style={{fontSize: 28, fontWeight: 500, color: SOFT, marginLeft: 8}}>min</span>
      </div>
      <Copy
        eyebrow={<><ZeptoWord size={28} /><div style={{fontSize: 26, fontWeight: 500, color: SOFT, marginTop: 4}}>केस स्टडी</div></>}
        title={<>झेप्टो १० मिनिटांत<br />डिलिव्हरी कशी करतं?</>}
        body={<>रायडर फास्ट नाही — <span style={{color: INK, fontWeight: 600}}>सिस्टीम स्मार्ट आहे.</span></>} />
      <Swipe />
    </>
  );
};

/* ---------- slide 2: radar from your location, nearest dark store locks on ---------- */
const S2 = () => {
  const near = P(CX, CY, 132, 52), far1 = P(CX, CY, 232, 205), far2 = P(CX, CY, 250, 122);
  const Sq = ({p, s, on}) => on
    ? <g><rect x={p[0] - s / 2} y={p[1] - s / 2} width={s} height={s} rx={s * 0.28} fill={ZP} /></g>
    : <rect x={p[0] - s / 2} y={p[1] - s / 2} width={s} height={s} rx={s * 0.28} fill="#fff" stroke="rgba(17,17,17,0.28)" strokeWidth="2" />;
  return (
    <>
      <Disc>
        <defs>
          <radialGradient id="sweep" cx={CX} cy={CY} r={R - 20} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={Y} stopOpacity="0.55" /><stop offset="1" stopColor={Y} stopOpacity="0.05" /></radialGradient>
        </defs>
        {[90, 180, 270].map((r) => <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={HAIR} strokeWidth="1.5" />)}
        <line x1={CX - R + 20} y1={CY} x2={CX + R - 20} y2={CY} stroke={HAIR} strokeWidth="1.5" />
        <line x1={CX} y1={CY - R + 20} x2={CX} y2={CY + R - 20} stroke={HAIR} strokeWidth="1.5" />
        <path d={sector(CX, CY, R - 20, 22, 62)} fill="url(#sweep)" />
        <line x1={CX} y1={CY} x2={near[0]} y2={near[1]} stroke={INK} strokeWidth="2.5" />
        <Sq p={far1} s={34} /><Sq p={far2} s={34} />
        <Sq p={near} s={58} on />
        <circle cx={CX} cy={CY} r="30" fill={INK} fillOpacity="0.07" />
        <circle cx={CX} cy={CY} r="12" fill={INK} stroke="#fff" strokeWidth="5" />
      </Disc>
      <div style={{...abs(near[0] - 15, near[1] - 15)}}><Ico d={<><path d="M4.5 10.5V20h15v-9.5" /><path d="M3 10l2-6h14l2 6" /><path d="M10 20v-5h4v5" /></>} size={30} color="#fff" sw={2.2} /></div>
      <div style={{...abs(near[0] + 46, near[1] - 30)}}>
        <div style={{fontSize: 34, fontWeight: 600, color: INK, lineHeight: 1, ...LAT}}>0.8 km</div>
        <div style={{fontSize: 24, fontWeight: 500, color: SOFT, marginTop: 8}}>सर्वात जवळचं स्टोअर</div>
      </div>
      <Mono style={{...abs(far1[0] - 120, far1[1] - 12), color: 'rgba(17,17,17,0.35)'}}>2.4 km</Mono>
      <Mono style={{...abs(far2[0] + 30, far2[1] - 12), color: 'rgba(17,17,17,0.35)'}}>3.1 km</Mono>
      <Mono style={{...abs(CX - 60, CY + 34), width: 120, textAlign: 'center', color: INK}}>तुम्ही</Mono>
      <Copy
        eyebrow={<Step n="01" label="१० मिनिटांचं गुपित" />}
        title={<>लोकेशन = डार्क स्टोअर</>}
        body="ॲप उघडताच तुमचं सर्वात जवळचं स्टोअर ठरतं." />
    </>
  );
};

const SLIDES = [S1, S2];

const Carousel = () => {
  const f = useCurrentFrame();
  const t = {...THEMES.light, grid: 'rgba(0,0,0,0.035)'};
  const Slide = SLIDES[Math.min(f, SLIDES.length - 1)];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: INK, ...Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]))}}>
        <LeanBg f={0} />
        <Header i={f} />
        <Slide />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

const Root = () => <Composition id="Reel" component={Carousel} durationInFrames={SLIDES.length} fps={30} width={W} height={H} />;
registerRoot(Root);
