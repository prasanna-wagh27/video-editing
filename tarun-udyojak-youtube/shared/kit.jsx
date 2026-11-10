/*
 * Tarun Udyojak YouTube kit (16:9, 1920x1080, 30 fps).
 * Look: near-black bg, white + brand yellow #FFD014, soft glass cards, line icons, Anek Devanagari.
 * Time is in SECONDS of the voiceover everywhere: useT() gives the absolute VO time inside any scene.
 */
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing, staticFile, delayRender, continueRender} from 'remotion';

/* ---------- font ---------- */
const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 120000});
new FontFace('Anek', `url(${staticFile('fonts/AnekDevanagari.ttf')})`, {weight: '100 800', stretch: '75% 125%'})
  .load().then((ff) => document.fonts.add(ff)).catch(() => {}).finally(() => continueRender(fontHandle));
setTimeout(() => continueRender(fontHandle), 30000);

/* ---------- tokens ---------- */
export const FPS = 30;
export const W = 1920, H = 1080;
export const BRAND = '#FFD014';
export const WHITE = '#FFFFFF';
export const INK = '#0E0E0F';
export const MUTED = 'rgba(255,255,255,0.58)';
export const DIM = 'rgba(255,255,255,0.32)';
export const FAINT = 'rgba(255,255,255,0.10)';
export const RED = '#FF5A52';   // losses only
export const SKY = '#62B6FF';   // rain / sky / coaching
export const VIOLET = '#A78BFA'; // schools / colleges
export const F = {fontFamily: 'Anek, sans-serif', color: WHITE, lineHeight: 1, whiteSpace: 'nowrap'};
export const abs = (left, top, extra = {}) => ({position: 'absolute', left, top, ...extra});
export const fr = (t) => Math.round(t * FPS);
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/* ---------- time ---------- */
export const TCtx = createContext(0); // frame where the current scene Sequence starts
export const useT = () => (useCurrentFrame() + useContext(TCtx)) / FPS;
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const io = (t, a, b, from = 0, to = 1, easing = OUT) => interpolate(t, [a, b], [from, to], {...C, easing});
export const pop = (t, at, damping = 13) => spring({frame: (t - at) * FPS, fps: FPS, config: {damping, mass: 0.7}});
export const rise = (t, at, d = 0.45, dy = 36) => ({opacity: io(t, at, at + d), transform: `translateY(${io(t, at, at + d, dy, 0)}px)`});
export const fade = (t, at, d = 0.35) => ({opacity: io(t, at, at + d)});

/* ---------- background + chrome ---------- */
export const Bg = () => {
  const t = useT();
  const gx = 420 + Math.sin(t / 9) * 160, gy = 380 + Math.cos(t / 11) * 90;
  const hx = 1500 + Math.cos(t / 10) * 140, hy = 760 + Math.sin(t / 8) * 80;
  return (
    <AbsoluteFill style={{background: '#0E0E0F'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 700px at ${gx}px ${gy}px, rgba(255,208,20,0.07), transparent 70%), radial-gradient(800px 600px at ${hx}px ${hy}px, rgba(255,255,255,0.045), transparent 70%)`}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1.6px, transparent 1.6px)', backgroundSize: '48px 48px', backgroundPosition: `${(t * 6) % 48}px 0px`}} />
      <AbsoluteFill style={{background: 'radial-gradient(1400px 900px at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Mark = ({x = 80, y = 56}) => (
  <div style={abs(x, y, {display: 'flex', alignItems: 'center', gap: 14})}>
    <div style={{width: 14, height: 14, borderRadius: 4, background: BRAND, boxShadow: '0 0 16px rgba(255,208,20,0.6)'}} />
    <div style={{...F, fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.8)', paddingTop: 5}}>तरुण उद्योजक</div>
  </div>
);

// chapters: [{at, label}] ; top-right chip + bottom progress with chapter ticks
export const Chrome = ({chapters, total}) => {
  const t = useT();
  let ci = 0;
  chapters.forEach((c, i) => { if (t >= c.at - 0.3) ci = i; });
  const ch = chapters[ci];
  const sw = io(t, ch.at - 0.3, ch.at + 0.3);
  return (
    <>
      <Mark />
      <div style={abs(1840, 50, {transform: 'translateX(-100%)', display: 'flex', alignItems: 'center', gap: 14, opacity: sw})}>
        <div style={{...F, fontSize: 24, fontWeight: 600, color: INK, background: BRAND, borderRadius: 10, padding: '9px 12px 5px'}}>{String(ci + 1).padStart(2, '0')}</div>
        <div style={{...F, fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.8)', paddingTop: 5}}>{ch.label}</div>
      </div>
      <div style={abs(80, 1046, {width: 1760, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)'})}>
        <div style={{width: `${(t / total) * 100}%`, height: '100%', borderRadius: 4, background: BRAND, opacity: 0.85}} />
        {chapters.slice(1).map((c) => (
          <div key={c.at} style={abs((c.at / total) * 1760 - 2, -3, {width: 4, height: 10, borderRadius: 2, background: t >= c.at ? BRAND : 'rgba(255,255,255,0.25)'})} />
        ))}
      </div>
    </>
  );
};

/* ---------- scenes ---------- */
// scenes: [{key, at (sec), C}], next scene's `at` ends the current one; `total` ends the last
export const Scenes = ({scenes, total}) => scenes.map((sc, i) => {
  const a = sc.at, b = i + 1 < scenes.length ? scenes[i + 1].at : total;
  const from = Math.max(0, fr(a) - 8);
  const dur = Math.min(fr(total), fr(b) + 8) - from;
  return (
    <Sequence key={sc.key} from={from} durationInFrames={dur} name={sc.key}>
      <TCtx.Provider value={from}>
        <SceneWrap a={a} b={b} last={i === scenes.length - 1}><sc.C /></SceneWrap>
      </TCtx.Provider>
    </Sequence>
  );
});
const SceneWrap = ({a, b, last, children}) => {
  const t = useT();
  const inn = io(t, a - 0.27, a + 0.35);
  const out = last ? 1 : io(t, b - 0.05, b + 0.27, 1, 0, INOUT);
  const drift = 1 + 0.018 * io(t, a, b, 0, 1, Easing.linear);
  const y = io(t, a - 0.27, a + 0.45, 50, 0) + io(t, b - 0.05, b + 0.27, 0, -40, INOUT) * (last ? 0 : 1);
  return (
    <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `translateY(${y}px) scale(${drift * (0.97 + 0.03 * inn)})`}}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- building blocks ---------- */
export const Card = ({x, y, w, h, children, style = {}, glow = false}) => (
  <div style={abs(x, y, {
    width: w, height: h, borderRadius: 34,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03))',
    border: `1.5px solid ${glow ? 'rgba(255,208,20,0.55)' : 'rgba(255,255,255,0.10)'}`,
    boxShadow: `0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)${glow ? ', 0 0 60px rgba(255,208,20,0.18)' : ''}`,
    ...style,
  })}>{children}</div>
);

export const Eyebrow = ({children, color = BRAND, icon}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px 8px', borderRadius: 100, border: `2px solid ${color}66`, background: `${color}14`}}>
    {icon && <Ic n={icon} size={28} color={color} sw={3.8} />}
    <div style={{...F, fontSize: 30, fontWeight: 500, color}}>{children}</div>
  </div>
);

// headline block at top-left; lines = array of strings or nodes
export const Head = ({at, eyebrow, icon, lines, x = 140, y = 140, size = 68, color}) => {
  const t = useT();
  return (
    <div style={abs(x, y)}>
      {eyebrow && <div style={rise(t, at - 0.1)}><Eyebrow icon={icon} color={color}>{eyebrow}</Eyebrow></div>}
      {lines.map((l, i) => (
        <div key={i} style={{...F, fontSize: size, fontWeight: 600, marginTop: i === 0 ? (eyebrow ? 30 : 0) : 14, lineHeight: 1.12, ...rise(t, at + 0.08 * (i + 1))}}>{l}</div>
      ))}
    </div>
  );
};

// yellow highlighter sweep behind words
export const Hi = ({at, children, color = BRAND, ink = INK}) => {
  const t = useT();
  const p = at === undefined ? 1 : io(t, at, at + 0.4);
  return (
    <span style={{position: 'relative', display: 'inline-block', padding: '0 14px', margin: '0 2px'}}>
      <span style={{position: 'absolute', left: 0, top: '-0.14em', bottom: '-0.04em', width: `${p * 100}%`, background: color, borderRadius: 12, transform: 'rotate(-1.5deg)'}} />
      <span style={{position: 'relative', color: p > 0.45 ? ink : WHITE, paddingTop: '0.1em', display: 'inline-block'}}>{children}</span>
    </span>
  );
};

export const Stamp = ({at, x, y, children, color = RED, rot = -8, size = 56}) => {
  const t = useT();
  const p = pop(t, at, 11);
  if (t < at) return null;
  return (
    <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1.8 - 0.8 * p})`, opacity: Math.min(1, p * 1.5)})}>
      <div style={{...F, fontSize: size, fontWeight: 700, color, border: `5px solid ${color}`, borderRadius: 18, padding: '18px 30px 8px', background: 'rgba(14,14,15,0.85)', letterSpacing: 1}}>{children}</div>
    </div>
  );
};

export const Count = ({t, a, b, from, to, fmt = inr, style}) => (
  <span style={style}>{fmt(io(t, a, b, from, to, Easing.bezier(0.3, 0, 0.2, 1)))}</span>
);

// round icon chip
export const Chip = ({n, size = 76, color = WHITE, bg = 'rgba(255,255,255,0.07)', r = 22}) => (
  <div style={{width: size, height: size, borderRadius: r, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <Ic n={n} size={size * 0.5} color={color} />
  </div>
);

// draw-on helper for SVG paths: <path {...draw(p)} />
export const draw = (p) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});

/* ---------- icons (48 viewBox, line style) ---------- */
export const Ic = ({n, size = 40, color = WHITE, sw = 3.4, fill = 'none'}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const f = {fill: color, stroke: 'none'};
  const I = {
    bolt: <path d="M27 4 11 27h12l-2 17 16-23H25z" {...p} />,
    phone: <><rect x="13" y="4" width="22" height="40" rx="5" {...p} /><path d="M21 37h6" {...p} /></>,
    grass: <path d="M6 42h36M12 42c0-9-3-15-6-19M20 42c0-12 1-21 5-29M28 42c0-8 3-14 8-18M36 42c0-5 1-9 4-12" {...p} />,
    clock: <><circle cx="24" cy="24" r="18" {...p} /><path d="M24 14v10l7 5" {...p} /></>,
    building: <><path d="M8 44V12l16-7 16 7v32M4 44h40" {...p} /><path d="M15 18h4M29 18h4M15 26h4M29 26h4M15 34h4M29 34h4M21 44v-8h6v8" {...p} /></>,
    plane: <path d="M44 6c-2-2-6-1-8 1L28 15 10 10l-4 4 14 8-7 8-6-1-3 3 8 4 4 8 3-3-1-6 8-7 8 14 4-4-5-18 8-8c2-2 3-6 1-8z" {...p} />,
    x: <path d="M12 12l24 24M36 12 12 36" {...p} />,
    check: <path d="M9 25l10 10 20-22" {...p} />,
    cal: <><rect x="6" y="10" width="36" height="32" rx="6" {...p} /><path d="M6 20h36M16 5v9M32 5v9" {...p} /></>,
    wallet: <><path d="M40 16V11a3 3 0 0 0-3-3H10a5 5 0 0 0 0 10h30v22a3 3 0 0 1-3 3H10a5 5 0 0 1-5-5V13" {...p} /><path d="M42 26h-8a4 4 0 0 0 0 8h8z" {...p} /></>,
    cloud: <path d="M14 34h22a9 9 0 0 0 1-18 13 13 0 0 0-25 3 8 8 0 0 0 2 15z" {...p} />,
    user: <><circle cx="24" cy="16" r="8" {...p} /><path d="M8 43c1-9 8-14 16-14s15 5 16 14" {...p} /></>,
    users: <><circle cx="17" cy="17" r="7" {...p} /><path d="M3 41c1-8 7-12 14-12s13 4 14 12" {...p} /><circle cx="33" cy="15" r="6" {...p} /><path d="M33 27c6 0 11 4 12 11" {...p} /></>,
    trophy: <><path d="M15 6h18v12a9 9 0 0 1-18 0zM15 10H7v3a7 7 0 0 0 8 7M33 10h8v3a7 7 0 0 1-8 7M24 27v8M15 42h18M18 42l2-7h8l2 7" {...p} /></>,
    hand: <path d="M3 21l8-8 7 3 5-3h6l7 5 9-2M11 13l-6 14 13 13a3 3 0 0 0 4-4M18 33l5 5a3 3 0 0 0 4-4M23 29l6 6a3 3 0 0 0 4-4l-8-8M29 26l5 5a3 3 0 0 0 4-4l-9-9-6 4a3 3 0 0 1-4-4l3-3" {...p} />,
    ball: <><circle cx="24" cy="24" r="19" {...p} /><path d="M24 15l8 6-3 9H19l-3-9z" {...p} /><path d="M24 15V5M32 21l9-3M29 30l5 8M19 30l-5 8M16 21l-9-3" {...p} /></>,
    school: <><path d="M4 18 24 8l20 10-20 10z" {...p} /><path d="M12 22v11c4 4 20 4 24 0V22M44 18v12" {...p} /></>,
    bell: <><path d="M24 6c-8 0-13 6-13 14v9l-4 7h34l-4-7v-9c0-8-5-14-13-14z" {...p} /><path d="M19 40a5 5 0 0 0 10 0" {...p} /></>,
    bookmark: <path d="M12 5h24v38l-12-9-12 9z" {...p} />,
    share: <><circle cx="36" cy="10" r="5" {...p} /><circle cx="12" cy="24" r="5" {...p} /><circle cx="36" cy="38" r="5" {...p} /><path d="M16 22l15-9M16 26l15 9" {...p} /></>,
    rewind: <path d="M22 12 6 24l16 12zM42 12 26 24l16 12z" {...p} />,
    search: <><circle cx="20" cy="20" r="13" {...p} /><path d="M30 30l13 13" {...p} /></>,
    home: <path d="M5 22 24 6l19 16M10 18v24h28V18M20 42V30h8v12" {...p} />,
    sun: <><circle cx="24" cy="24" r="8" {...p} /><path d="M24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5 38 38M38 10l-3.5 3.5M13.5 34.5 10 38" {...p} /></>,
    moon: <path d="M38 30A16 16 0 0 1 18 10a16 16 0 1 0 20 20z" {...p} />,
    star: <path d="M24 5l5.6 12 13 1.4-9.8 8.8 2.8 12.8L24 33.4 12.4 40l2.8-12.8L5.4 18.4l13-1.4z" {...p} />,
    up: <path d="M6 36l12-12 8 8 16-16M32 16h10v10" {...p} />,
    down: <path d="M6 14l12 12 8-8 16 16M32 34h10V24" {...p} />,
    lock: <><rect x="9" y="21" width="30" height="22" rx="5" {...p} /><path d="M15 21v-6a9 9 0 0 1 18 0v6" {...p} /></>,
    whistle: <><circle cx="17" cy="29" r="11" {...p} /><path d="M24 20l16-6 4 8-14 6M8 10l5 5" {...p} /></>,
    calc: <><rect x="9" y="4" width="30" height="40" rx="5" {...p} /><path d="M15 12h18v7H15zM16 27h2M23 27h2M30 27h2M16 35h2M23 35h2M30 35h2" {...p} /></>,
    rupee: <path d="M13 8h22M13 16h22M17 8c13 0 13 16 0 16h-4l18 18" {...p} />,
    play: <path d="M17 12v24l20-12z" {...f} />,
    shop: <><path d="M6 18 9 7h30l3 11M6 18h36v24H6zM6 18c0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0" {...p} /></>,
  };
  return <svg viewBox="0 0 48 48" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>{I[n]}</svg>;
};

/* ---------- line-art turf with floodlights (draws on from `at`; pass a large t for a finished still) ---------- */
export const Turf = ({t, at = 0.2, w = 820, id = 't'}) => {
  const P = (u, v) => [120 + 80 * v + (560 - 160 * v) * u, 470 - 270 * v];
  const pts = (arr) => arr.map(([u, v]) => P(u, v).join(',')).join(' ');
  const ln = (a, b, d) => {
    const [x1, y1] = P(...a), [x2, y2] = P(...b);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WHITE} strokeWidth="3" strokeLinecap="round" {...draw(io(t, at + d, at + d + 0.7))} />;
  };
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const lamp = (i) => io(t, at + 1.1 + i * 0.15, at + 1.3 + i * 0.15);
  const [cx, cy] = P(0.5, 0.5);
  return (
    <svg viewBox="0 0 800 560" width={w} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id={`lg${id}`}><stop offset="0" stopColor={BRAND} stopOpacity="0.9" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></radialGradient>
        <linearGradient id={`beam${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BRAND} stopOpacity="0.22" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></linearGradient>
      </defs>
      <polygon points={`${P(0, 0)} ${P(1, 0)} ${P(1, 0)[0]},${P(1, 0)[1] + 34} ${P(0, 0)[0]},${P(0, 0)[1] + 34}`} fill="#1b1b1d" opacity={io(t, at, at + 0.4)} />
      {Array.from({length: 8}).map((_, i) => (
        <polygon key={i} points={pts([[0, i / 8], [1, i / 8], [1, (i + 1) / 8], [0, (i + 1) / 8]])} fill={i % 2 ? '#232326' : '#1d1d20'} opacity={io(t, at, at + 0.4)} />
      ))}
      {corners.map((c, i) => <React.Fragment key={i}>{ln(c, corners[(i + 1) % 4], 0.1 * i)}</React.Fragment>)}
      {ln([0, 0.5], [1, 0.5], 0.4)}
      {ln([0.3, 0], [0.3, 0.14], 0.5)}{ln([0.7, 0], [0.7, 0.14], 0.5)}{ln([0.3, 0.14], [0.7, 0.14], 0.55)}
      {ln([0.3, 1], [0.3, 0.86], 0.5)}{ln([0.7, 1], [0.7, 0.86], 0.5)}{ln([0.3, 0.86], [0.7, 0.86], 0.55)}
      <ellipse cx={cx} cy={cy} rx="66" ry="20" fill="none" stroke={WHITE} strokeWidth="3" {...draw(io(t, at + 0.6, at + 1.2))} />
      {/* fence posts + top rail */}
      {[0, 0.25, 0.5, 0.75, 1].flatMap((u) => [[u, 0], [u, 1]]).concat([[0, 0.33], [0, 0.66], [1, 0.33], [1, 0.66]]).map(([u, v], i) => {
        const [x, y] = P(u, v); const hgt = 70 - 20 * v;
        return <line key={i} x1={x} y1={y} x2={x} y2={y - hgt * io(t, at + 0.8, at + 1.2)} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />;
      })}
      <polyline points={corners.concat([corners[0]]).map(([u, v]) => { const [x, y] = P(u, v); return `${x},${y - (70 - 20 * v)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" opacity={io(t, at + 1.0, at + 1.3)} />
      {/* floodlights */}
      {corners.map(([u, v], i) => {
        const [x, y] = P(u, v); const top = y - (190 - 50 * v); const on = lamp(i);
        return (
          <g key={i}>
            <polygon points={`${x - 16},${top} ${x + 16},${top} ${P(0.5, 0.5)[0] + (x - cx) * 0.2},${cy + 20} ${P(0.5, 0.5)[0] + (x - cx) * 0.55},${cy + 40}`} fill={`url(#beam${id})`} opacity={on * 0.9} />
            <line x1={x} y1={y} x2={x} y2={top} stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy={top} r={46} fill={`url(#lg${id})`} opacity={on * (0.85 + 0.15 * Math.sin(t * 6 + i))} />
            <rect x={x - 18} y={top - 9} width="36" height="16" rx="4" fill={on > 0.5 ? BRAND : '#444'} />
          </g>
        );
      })}
      {/* ball */}
      <circle cx={cx + Math.sin(t * 1.6) * 90} cy={cy - 6 - Math.abs(Math.sin(t * 3.2)) * 30} r="9" fill={WHITE} opacity={io(t, at + 1.4, at + 1.7)} />
    </svg>
  );
};
