/*
 * Thumbnail v2 for the Turf video: light "paper" layout with a 3D turf in the middle, cost callouts around it
 * and a yellow tape banner (inspired by a reference layout, own design, Marathi copy).
 * ThumbC: charcoal turf (brand colours only). ThumbD: green turf.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import {BRAND, WHITE, RED, F, abs, Ic} from '../../shared/kit.jsx';

const INK = '#141414';
const PAPER = '#F3F0E8';
const THEMES = {
  charcoal: {s1: '#2A2B2F', s2: '#323338', side1: '#1B1B1E', side2: '#111113', line: '#FFFFFF'},
  green: {s1: '#3C9A4E', s2: '#45A857', side1: '#2B6B38', side2: '#215A2D', line: '#FFFFFF'},
};
const C = (s, w = 800, st = '80%') => ({fontFamily: 'Anek, sans-serif', fontSize: s, fontWeight: w, fontStretch: st, color: INK, lineHeight: 1, whiteSpace: 'nowrap', paddingTop: s * 0.1});

/* ---------- isometric turf ---------- */
const A = [540, 150], EX = [430, 210], EY = [-330, 161];
const P = (u, v) => [A[0] + u * EX[0] + v * EY[0], A[1] + u * EX[1] + v * EY[1]];
const pts = (...ps) => ps.map((p) => p.join(',')).join(' ');
const upp = (p, h) => [p[0], p[1] - h];
const SLAB = 40, FENCE = 78, POLE = 200;

const Fence = ({edge}) => { // edge: list of [u,v] from start to end
  const [a, b] = edge; const n = 8; const out = [];
  for (let i = 0; i < n; i++) {
    const p0 = P(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n);
    const p1 = P(a[0] + (b[0] - a[0]) * (i + 1) / n, a[1] + (b[1] - a[1]) * (i + 1) / n);
    out.push(<polygon key={'p' + i} points={pts(p0, p1, upp(p1, FENCE), upp(p0, FENCE))} fill="url(#mesh)" stroke="none" />);
    out.push(<line key={'l' + i} x1={p0[0]} y1={p0[1]} x2={p0[0]} y2={p0[1] - FENCE} stroke="#2a2a2a" strokeWidth="3" />);
  }
  const e = P(...b);
  out.push(<line key="end" x1={e[0]} y1={e[1]} x2={e[0]} y2={e[1] - FENCE} stroke="#2a2a2a" strokeWidth="3" />);
  const s = P(...a);
  out.push(<line key="rail" x1={s[0]} y1={s[1] - FENCE} x2={e[0]} y2={e[1] - FENCE} stroke="#2a2a2a" strokeWidth="3.5" />);
  return <>{out}</>;
};

const Player = ({u, v, team}) => {
  const [x, y] = P(u, v);
  const c = team ? BRAND : WHITE;
  return (
    <g>
      <ellipse cx={x} cy={y + 2} rx="9" ry="4" fill="rgba(0,0,0,0.3)" />
      <line x1={x - 4} y1={y} x2={x - 2} y2={y - 14} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <line x1={x + 4} y1={y} x2={x + 2} y2={y - 14} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <rect x={x - 7} y={y - 30} width="14" height="18" rx="5" fill={c} stroke={INK} strokeWidth="2" />
      <circle cx={x} cy={y - 36} r="6" fill="#8a5a3c" stroke={INK} strokeWidth="1.5" />
    </g>
  );
};

const Turf3D = ({theme, w = 1000}) => {
  const T = THEMES[theme];
  const [pA, pB, pC, pD] = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  const dn = (p) => [p[0], p[1] + SLAB];
  const circle = Array.from({length: 40}, (_, i) => { const a = (i / 40) * Math.PI * 2; return P(0.5 + 0.085 * Math.cos(a), 0.5 + 0.14 * Math.sin(a)); });
  const ln = (a, b, sw = 4) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.line} strokeWidth={sw} strokeLinecap="round" opacity="0.92" />; };
  const box = (u0, u1, v0, v1) => <polygon points={pts(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1))} fill="none" stroke={T.line} strokeWidth="4" opacity="0.92" />;
  const goal = (u, dir) => {
    const a = P(u, 0.42), b = P(u, 0.58), a2 = P(u - 0.025 * dir, 0.42), b2 = P(u - 0.025 * dir, 0.58);
    return (
      <g stroke={WHITE} strokeWidth="4" strokeLinecap="round" fill="none">
        <polygon points={pts(a2, b2, upp(b, 34), upp(a, 34))} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <line x1={a[0]} y1={a[1]} x2={a[0]} y2={a[1] - 34} /><line x1={b[0]} y1={b[1]} x2={b[0]} y2={b[1] - 34} />
        <line x1={a[0]} y1={a[1] - 34} x2={b[0]} y2={b[1] - 34} />
      </g>
    );
  };
  const lamp = (p, k) => {
    const top = upp(p, POLE);
    const [cx, cy] = P(0.5, 0.5);
    return (
      <g key={k}>
        <polygon points={pts([top[0] - 14, top[1] + 8], [top[0] + 14, top[1] + 8], [cx + (top[0] - cx) * 0.15 + 60, cy], [cx + (top[0] - cx) * 0.15 - 60, cy])} fill="url(#beam)" />
        <line x1={p[0]} y1={p[1]} x2={top[0]} y2={top[1]} stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round" />
        <circle cx={top[0]} cy={top[1]} r="60" fill="url(#glow)" />
        <rect x={top[0] - 26} y={top[1] - 14} width="52" height="26" rx="6" fill="#222" />
        <rect x={top[0] - 21} y={top[1] - 9} width="42" height="16" rx="4" fill={BRAND} />
      </g>
    );
  };
  return (
    <svg viewBox="0 -130 1080 830" width={w} style={{overflow: 'visible'}}>
      <defs>
        <pattern id="mesh" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="rgba(40,40,40,0.06)" /><line x1="0" y1="0" x2="0" y2="10" stroke="rgba(30,30,30,0.35)" strokeWidth="1.2" /><line x1="0" y1="0" x2="10" y2="0" stroke="rgba(30,30,30,0.35)" strokeWidth="1.2" />
        </pattern>
        <radialGradient id="glow"><stop offset="0" stopColor={BRAND} stopOpacity="0.85" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BRAND} stopOpacity="0.35" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="22" /></filter>
      </defs>
      <ellipse cx="590" cy="585" rx="520" ry="90" fill="rgba(0,0,0,0.28)" filter="url(#blur)" />
      {/* back fences */}
      <Fence edge={[[0, 0], [1, 0]]} />
      <Fence edge={[[0, 0], [0, 1]]} />
      {/* slab */}
      <polygon points={pts(pD, pC, dn(pC), dn(pD))} fill={T.side1} />
      <polygon points={pts(pC, pB, dn(pB), dn(pC))} fill={T.side2} />
      {Array.from({length: 10}).map((_, i) => <polygon key={i} points={pts(P(i / 10, 0), P((i + 1) / 10, 0), P((i + 1) / 10, 1), P(i / 10, 1))} fill={i % 2 ? T.s2 : T.s1} />)}
      {/* markings */}
      {box(0.03, 0.97, 0.05, 0.95)}
      {ln([0.5, 0.05], [0.5, 0.95])}
      <polygon points={pts(...circle)} fill="none" stroke={T.line} strokeWidth="4" opacity="0.92" />
      {box(0.03, 0.15, 0.27, 0.73)}{box(0.85, 0.97, 0.27, 0.73)}
      {goal(0.03, 1)}{goal(0.97, -1)}
      {/* players + ball */}
      {[[0.3, 0.35, 1], [0.42, 0.62, 1], [0.22, 0.55, 1], [0.6, 0.4, 0], [0.68, 0.7, 0], [0.8, 0.5, 0]].map(([u, v, tm], i) => <Player key={i} u={u} v={v} team={tm} />)}
      {(() => { const [x, y] = P(0.5, 0.52); return <><ellipse cx={x} cy={y + 3} rx="8" ry="3" fill="rgba(0,0,0,0.3)" /><circle cx={x + 2} cy={y - 14} r="8" fill={WHITE} stroke={INK} strokeWidth="2" /></>; })()}
      {/* front fences + lights */}
      <Fence edge={[[0, 1], [1, 1]]} />
      <Fence edge={[[1, 0], [1, 1]]} />
      {[pA, pB, pD].map((p, i) => lamp(p, i))}
    </svg>
  );
};

/* ---------- callouts + arrows ---------- */
const Callout = ({x, y, icon, glyph, lines, align = 'left', hot}) => (
  <div style={abs(x, y, {display: 'flex', alignItems: 'center', gap: 20, flexDirection: align === 'left' ? 'row' : 'row-reverse', transform: align === 'left' ? 'none' : 'translateX(-100%)',
    background: WHITE, borderRadius: 26, padding: align === 'left' ? '16px 28px 14px 18px' : '16px 18px 14px 28px', border: `3px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`})}>
    <div style={{width: 84, height: 84, borderRadius: 22, background: hot ? RED : BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `3px solid ${INK}`}}>
      {glyph ? <div style={{...C(64, 800, '90%'), color: hot ? WHITE : INK}}>{glyph}</div> : <Ic n={icon} size={50} color={hot ? WHITE : INK} sw={4} />}
    </div>
    <div style={{textAlign: align}}>
      {lines.map((l, i) => <div key={i} style={{...C(50, 800, '82%'), marginTop: i ? 4 : 0}}>{l}</div>)}
    </div>
  </div>
);
const Arrow = ({d}) => <path d={d} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" markerEnd="url(#head)" />;

const Thumb = ({theme}) => (
  <AbsoluteFill style={{background: PAPER}}>
    {/* paper grid + vignette */}
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.045) 2px, transparent 2px)', backgroundSize: '64px 64px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(1300px 800px at 50% 55%, rgba(255,208,20,0.16), transparent 60%), radial-gradient(1600px 1000px at 50% 50%, transparent 60%, rgba(0,0,0,0.10) 100%)'}} />

    {/* pencil maths in the corner */}
    <div style={abs(1500, 44, {transform: 'rotate(4deg)', opacity: 0.38})}>
      <div style={{...C(40, 400, '90%'), fontStyle: 'italic'}}>1200 − 200 = 1000</div>
      <div style={{...C(40, 400, '90%'), fontStyle: 'italic', marginTop: 8}}>80,000 ÷ 1000 = 80 तास</div>
    </div>
    <div style={abs(60, 56, {display: 'flex', alignItems: 'center', gap: 12})}>
      <div style={{width: 18, height: 18, borderRadius: 5, background: BRAND, border: `2px solid ${INK}`}} />
      <div style={C(36, 700, '90%')}>तरुण उद्योजक</div>
    </div>

    {/* headline */}
    <div style={abs(0, 30, {width: 1920, textAlign: 'center'})}>
      <div style={C(76, 700, '85%')}>स्वतःचा Turf सुरू करायचाय?</div>
      <div style={{position: 'relative', display: 'inline-block', marginTop: 34}}>
        <svg width="1000" height="60" viewBox="0 0 1060 70" preserveAspectRatio="none" style={abs(-10, 150)}>
          <path d="M10 40 C 220 18, 520 28, 760 22 S 1000 30, 1050 26 L 1046 52 C 820 56, 520 50, 260 58 S 40 62, 14 60 Z" fill={BRAND} />
        </svg>
        <div style={{...C(186, 800, '75%'), position: 'relative', letterSpacing: -2}}>TURF बिझनेसचं गणित</div>
      </div>
    </div>

    {/* turf */}
    <div style={abs(420, 262)}><Turf3D theme={theme} w={1080} /></div>

    {/* price tag on the right floodlight */}
    <div style={abs(1250, 300, {transform: 'rotate(10deg)', transformOrigin: '0 0'})}>
      <svg width="40" height="70" style={abs(4, -60)}><path d="M20 0 C 10 25, 30 40, 20 66" fill="none" stroke={INK} strokeWidth="3" /></svg>
      <div style={{background: BRAND, border: `4px solid ${INK}`, borderRadius: '14px 40px 40px 14px', padding: '14px 40px 6px 30px', position: 'relative', boxShadow: `6px 6px 0 ${INK}`}}>
        <div style={abs(14, 34, {width: 16, height: 16, borderRadius: 8, background: PAPER, border: `3px solid ${INK}`})} />
        <div style={{...C(66, 800, '80%'), marginLeft: 26}}>₹20 लाख</div>
      </div>
    </div>

    {/* callouts */}
    <Callout x={56} y={360} icon="rupee" lines={['₹1,200 / तास']} />
    <Callout x={56} y={555} icon="building" lines={['भाडं + पगार']} />
    <Callout x={56} y={740} icon="cloud" lines={['पावसाळ्यात', 'बुकिंग कॅन्सल']} hot />
    <Callout x={1864} y={455} icon="bolt" lines={['लाईट +', 'मेंटेनन्स']} align="right" />
    <Callout x={1864} y={655} icon="sun" lines={['दिवसा', 'स्लॉट्स रिकामे']} align="right" hot />
    <svg width="1920" height="1080" style={abs(0, 0)}>
      <defs><marker id="head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={INK} /></marker></defs>
      <Arrow d="M470 405 C 560 380, 640 420, 700 470" />
      <Arrow d="M430 600 C 520 620, 580 600, 660 590" />
      <Arrow d="M520 800 C 610 820, 680 790, 760 740" />
      <Arrow d="M1480 500 C 1420 470, 1380 500, 1350 540" />
      <Arrow d="M1440 720 C 1380 760, 1320 740, 1270 700" />
    </svg>

    {/* tape banner */}
    <div style={abs(960, 965, {transform: 'translate(-50%,-50%) rotate(-1.6deg)'})}>
      <div style={{background: BRAND, padding: '22px 70px 8px', clipPath: 'polygon(0% 8%, 2% 0%, 5% 6%, 9% 1%, 14% 5%, 20% 0%, 27% 4%, 35% 0%, 44% 5%, 52% 1%, 61% 6%, 70% 0%, 78% 5%, 86% 1%, 93% 6%, 97% 0%, 100% 7%, 99% 50%, 100% 93%, 96% 100%, 90% 95%, 83% 100%, 75% 94%, 66% 100%, 57% 95%, 48% 100%, 39% 94%, 30% 100%, 21% 95%, 13% 100%, 6% 94%, 1% 100%, 0% 92%, 1% 50%)'}}>
        <div style={C(104, 800, '78%')}>संध्याकाळ फुल, <span style={{color: '#D32A22'}}>तरी नफा कुठे?</span></div>
      </div>
    </div>
  </AbsoluteFill>
);

const Root = () => (
  <>
    <Composition id="ThumbC" component={() => <Thumb theme="charcoal" />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbD" component={() => <Thumb theme="green" />} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
