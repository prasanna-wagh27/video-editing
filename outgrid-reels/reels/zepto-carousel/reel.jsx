// Zepto "10-minute delivery" Instagram carousel, 1080x1350 (4:5). One frame per slide: frame 0 = slide 1.
// v3 direction (from the user's focusedmind / yuv.mehta references): type-led editorial.
//  - Cover: the title IS the design: huge, heavy, tight line height, a marker highlight on the key words, an accent dot.
//  - Inner pages: normal-size heading + body, one small line-icon diagram (ink strokes, one yellow accent).
//  - Chrome: brand top-left, tracked caps "SAVE FOR LATER" top-right, hairline footer with topic + "SWIPE →".
// Background = the regular Outgrid light reel background (cream, grid, yellow glow).
// Render: node scripts/stills_fast.mjs reels/zepto-carousel reels/zepto-carousel/stills 2 0 1 ...
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender} from 'remotion';
import {abs, Y, Mark, BRAND} from '../../shared/kit.jsx';
import {THEMES, ThemeCtx, LeanBg} from '../../shared/lean.jsx';

// italic serif for the sub-line (Tiro Devanagari Marathi italic + Instrument Serif italic for Latin)
const fh = delayRender('serif');
Promise.all([
  new FontFace('ZSerif', `url(${staticFile('fonts/mai/tiro-devanagari-marathi-devanagari-400-italic.woff2')})`, {style: 'italic', unicodeRange: 'U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF'}),
  new FontFace('ZSerif', `url(${staticFile('fonts/mai/instrument-serif-latin-400-italic.woff2')})`, {style: 'italic'}),
].map((f) => f.load().then((x) => document.fonts.add(x)))).catch(() => {}).finally(() => continueRender(fh));

const W = 1080, H = 1350, N = 9, PAD = 80;
const INK = '#111111';
const SOFT = 'rgba(17,17,17,0.62)';
const DOT = '#F2A900'; // accent dot: deeper Outgrid yellow so it reads on cream
const HL = 'rgba(255,197,46,0.55)'; // marker highlight
const TRACK = {fontFamily: 'Anek, sans-serif', fontSize: 19, fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase', color: INK};

/* ---------- type helpers ---------- */
// marker highlight behind the lower ~half of the line, like the reference
const Hl = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate'}}>
    <span style={{position: 'absolute', left: '-0.06em', right: '-0.06em', top: '0.37em', height: '0.34em', background: HL, zIndex: -1}} />{children}
  </span>
);
const Dot = () => <span style={{color: DOT}}>.</span>;

/* ---------- chrome ---------- */
const Chrome = ({i, topic}) => (
  <>
    <div style={{...abs(PAD, 78), display: 'flex', alignItems: 'center', gap: 10}}>
      <Mark size={30} color={INK} />
      <div style={{...BRAND, fontSize: 25, fontWeight: 700, color: INK, letterSpacing: '-0.02em'}}>Outgrid Labs<span style={{color: DOT}}>.</span></div>
    </div>
    <div style={{...abs(W - PAD - 400, 86), width: 400, textAlign: 'right', ...TRACK}}>Save for later</div>
    <div style={{...abs(PAD, H - 120), width: W - PAD * 2, height: 1.5, background: 'rgba(17,17,17,0.12)'}} />
    <div style={{...abs(PAD, H - 86), ...TRACK, fontSize: 17, color: SOFT}}>{topic}</div>
    <div style={{...abs(W - PAD - 300, H - 86), width: 300, textAlign: 'right', ...TRACK, fontSize: 17}}>
      {i < N - 1 ? <>Swipe <span style={{color: DOT, letterSpacing: 0}}>→</span></> : `${i + 1} / ${N}`}
    </div>
  </>
);
const Eyebrow = ({children, top}) => <div style={{...abs(PAD, top), ...TRACK, fontSize: 21, color: SOFT}}>{children}</div>;

/* ---------- line icons: ink strokes + one yellow accent ---------- */
const SW = 7;
const Stopwatch = ({size = 170}) => (
  <svg viewBox="0 0 120 120" width={size} height={size} fill="none" stroke={INK} strokeWidth={SW * 0.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 8h20M60 8v12" />
    <circle cx="60" cy="68" r="46" />
    <path d="M60 22 A46 46 0 0 1 99.8 45" stroke={DOT} strokeWidth={SW * 0.9} />
    <path d="M60 68V38" /><path d="M60 68l17 10" />
    <circle cx="60" cy="68" r="3.5" fill={INK} />
  </svg>
);

/* ---------- slide 1: cover ---------- */
const S1 = () => (
  <>
    <Eyebrow top={286}>Case study · Zepto · 10-min delivery</Eyebrow>
    <div style={{...abs(PAD - 6, 372), fontSize: 140, fontWeight: 800, color: INK, lineHeight: 0.98, letterSpacing: '-0.035em'}}>
      <div>झेप्टो</div>
      <div><Hl>१० मिनिटांत</Hl></div>
      <div>डिलिव्हरी</div>
      <div>कशी करतं?</div>
    </div>
    <div style={{...abs(PAD, 990), fontFamily: 'ZSerif, serif', fontStyle: 'italic', fontSize: 50, color: INK, lineHeight: 1.2}}>
      रायडर फास्ट नाही —<br />सिस्टीम स्मार्ट आहे<Dot />
    </div>
    <div style={{...abs(W - PAD - 160, 985)}}><Stopwatch size={150} /></div>
  </>
);

/* ---------- slide 2: location = dark store ---------- */
// distance ruler: you -> stores at 0.8 / 2.4 / 3.1 km, the nearest one picked
const Ruler = ({x, y, w = 920}) => {
  const k = (km) => 40 + (km / 3.4) * (w - 80);
  const Store = ({cx, on}) => (
    <g transform={`translate(${cx - 34} ${-104})`} strokeWidth="4.5">
      <path d="M6 26 L12 4 H56 L62 26" fill={on ? Y : 'none'} />
      <path d="M6 26 V66 H62 V26" fill={on ? '#fff' : 'none'} />
      <path d="M6 26 H62" />
      <path d="M26 66 V46 H42 V66" />
    </g>
  );
  return (
    <svg width={w} height={260} viewBox={`0 -150 ${w} 260`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      <line x1="40" y1="0" x2={w - 40} y2="0" strokeWidth="3" />
      {Array.from({length: 18}, (_, j) => <line key={j} x1={40 + (j * (w - 80)) / 17} y1="-8" x2={40 + (j * (w - 80)) / 17} y2="8" strokeWidth="2" stroke="rgba(17,17,17,0.35)" />)}
      {/* you */}
      <path d="M40 -26 c-14 0 -24 10 -24 23 c0 16 24 33 24 33 s24 -17 24 -33 c0 -13 -10 -23 -24 -23 z" transform="translate(0 -40)" fill={INK} strokeWidth="0" />
      <circle cx="40" cy="-43" r="7" fill="#fff" strokeWidth="0" />
      <Store cx={k(0.8)} on /><Store cx={k(2.4)} /><Store cx={k(3.1)} />
      <path d={`M40 0 H${k(0.8)}`} stroke={DOT} strokeWidth="9" />
      {[0.8, 2.4, 3.1].map((km) => <circle key={km} cx={k(km)} cy="0" r="9" fill={km === 0.8 ? INK : '#fff'} strokeWidth="3" />)}
    </svg>
  );
};
const RulerLabels = ({x, y, w = 920}) => {
  const k = (km) => 40 + (km / 3.4) * (w - 80);
  const L = ({km, on, t}) => (
    <div style={{...abs(x + k(km) - 100, y + 172), width: 200, textAlign: 'center'}}>
      <div style={{fontSize: 34, fontWeight: 700, color: on ? INK : 'rgba(17,17,17,0.4)', letterSpacing: '-0.02em'}}>{km} km</div>
      {t && <div style={{fontSize: 26, fontWeight: 500, color: SOFT, marginTop: 2}}>{t}</div>}
    </div>
  );
  return (
    <>
      <div style={{...abs(x - 40, y + 172), width: 160, textAlign: 'center', fontSize: 26, fontWeight: 600, color: INK}}>तुम्ही</div>
      <L km={0.8} on t="तुमचं स्टोअर" /><L km={2.4} /><L km={3.1} />
    </>
  );
};
const S2 = () => (
  <>
    <Eyebrow top={286}>01 · Location</Eyebrow>
    <div style={{...abs(PAD - 3, 350), fontSize: 92, fontWeight: 800, color: INK, lineHeight: 1.04, letterSpacing: '-0.03em'}}>
      <div>लोकेशन =</div>
      <div><Hl>डार्क स्टोअर</Hl><Dot /></div>
    </div>
    <div style={{...abs(PAD, 580), width: 820, fontSize: 42, fontWeight: 400, color: SOFT, lineHeight: 1.38}}>
      ॲप उघडताच तुमचं <span style={{color: INK, fontWeight: 600}}>सर्वात जवळचं स्टोअर</span> ठरतं.
    </div>
    <Ruler x={PAD} y={820} />
    <RulerLabels x={PAD} y={820} />
  </>
);

const SLIDES = [S1, S2];

const Carousel = () => {
  const f = useCurrentFrame();
  const t = THEMES.light;
  const Slide = SLIDES[Math.min(f, SLIDES.length - 1)];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: INK, ...Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]))}}>
        <LeanBg f={0} />
        <Chrome i={f} topic="Zepto · 10-min delivery" />
        <Slide />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

const Root = () => <Composition id="Reel" component={Carousel} durationInFrames={SLIDES.length} fps={30} width={W} height={H} />;
registerRoot(Root);
