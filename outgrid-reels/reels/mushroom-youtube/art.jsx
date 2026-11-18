/* Vector art for the mushroom video: mushrooms, grow bags, straw, spawn, room, shops, products. All drawn here. */
import React from 'react';
import {s, io, pop} from '../../shared/kit.jsx';

const uid = (() => { let n = 0; return (p) => `${p}${n++}`; })();
// seeded random so drawings are stable across frames
const rnd = (seed) => { let x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

/* ---------- mushrooms (viewBox 200x200, base at y~190) ---------- */
const ButtonM = ({size = 200, tint = 0, style = {}}) => {
  const id = React.useMemo(() => uid('bm'), []);
  const cap = tint ? ['#F3E3C8', '#C9A274'] : ['#FFFFFF', '#E6DCCB'];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <radialGradient id={`${id}c`} cx="38%" cy="30%" r="75%"><stop offset="0" stopColor={cap[0]} /><stop offset="0.65" stopColor={cap[0]} /><stop offset="1" stopColor={cap[1]} /></radialGradient>
        <linearGradient id={`${id}s`} x1="0" x2="1"><stop offset="0" stopColor="#EFE6D6" /><stop offset="0.45" stopColor="#FFFFFF" /><stop offset="1" stopColor="#D9CCB6" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="190" rx="62" ry="8" fill="rgba(60,40,10,0.14)" />
      <path d="M72 112 Q70 160 64 186 Q100 194 136 186 Q130 160 128 112 Z" fill={`url(#${id}s)`} />
      <path d="M18 112 Q16 26 100 22 Q184 26 182 112 Q182 126 160 128 Q100 134 40 128 Q18 126 18 112 Z" fill={`url(#${id}c)`} />
      <path d="M40 128 Q100 140 160 128" stroke="rgba(120,90,50,0.22)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="58" rx="26" ry="12" fill="#fff" opacity="0.7" transform="rotate(-24 70 58)" />
    </svg>
  );
};
// oyster: a cluster of fan-shaped caps
const OysterCap = ({x, y, r, rot, c1, c2, id}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 60})`}>
    <path d="M0 0 C-18 -10 -62 -30 -58 -62 C-52 -96 52 -96 58 -62 C62 -30 18 -10 0 0 Z" fill={`url(#${id})`} stroke={c2} strokeWidth="2" />
    {[-44, -26, -10, 6, 22, 40].map((a, i) => <path key={i} d={`M0 -4 L${a} -70`} stroke={c2} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />)}
    <path d="M-50 -66 C-30 -86 30 -86 50 -66" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);
const OysterM = ({size = 200, color = 'grey', style = {}}) => {
  const id = React.useMemo(() => uid('oy'), []);
  const [c1, c2] = color === 'pink' ? ['#F6C9CF', '#C9808C'] : color === 'gold' ? ['#F7DC86', '#C99A1E'] : ['#EDE6DA', '#A99A84'];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs><radialGradient id={id} cx="50%" cy="20%" r="90%"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor={c1} /><stop offset="1" stopColor={c2} /></radialGradient></defs>
      <path d="M92 190 Q96 150 100 140 Q104 150 108 190 Z" fill={c1} />
      <OysterCap x={100} y={156} r={70} rot={-38} c1={c1} c2={c2} id={id} />
      <OysterCap x={100} y={156} r={70} rot={36} c1={c1} c2={c2} id={id} />
      <OysterCap x={100} y={160} r={84} rot={0} c1={c1} c2={c2} id={id} />
    </svg>
  );
};
const MilkyM = ({size = 200, style = {}}) => {
  const id = React.useMemo(() => uid('mk'), []);
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1"><stop offset="0" stopColor="#E9E4DA" /><stop offset="0.4" stopColor="#FFFFFF" /><stop offset="1" stopColor="#D8D0C2" /></linearGradient>
        <radialGradient id={`${id}c`} cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.7" stopColor="#F6F2EA" /><stop offset="1" stopColor="#DCD3C3" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="192" rx="44" ry="6" fill="rgba(60,40,10,0.14)" />
      <path d="M78 70 Q74 140 70 182 Q72 192 100 192 Q128 192 130 182 Q126 140 122 70 Z" fill={`url(#${id}s)`} />
      <path d="M44 74 Q44 22 100 20 Q156 22 156 74 Q156 84 140 84 L60 84 Q44 84 44 74 Z" fill={`url(#${id}c)`} />
      <ellipse cx="80" cy="42" rx="18" ry="8" fill="#fff" opacity="0.8" transform="rotate(-18 80 42)" />
    </svg>
  );
};

/* ---------- straw (भुसा), spawn, grow bag ---------- */
const Straw = ({w = 360, h = 160, n = 120, seed = 1, style = {}}) => (
  <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{overflow: 'visible', ...style}}>
    <path d={`M0 ${h} Q${w * 0.1} ${h * 0.2} ${w / 2} ${h * 0.08} Q${w * 0.9} ${h * 0.2} ${w} ${h} Z`} fill="#E9C46A" />
    {Array.from({length: n}).map((_, i) => {
      const x = rnd(seed + i) * w, yy = h * (0.2 + 0.8 * rnd(seed + i * 3)), a = (rnd(seed + i * 7) - 0.5) * 2.6, l = 24 + rnd(i + seed * 11) * 30;
      const top = h - (h * 0.92) * Math.sin(Math.PI * x / w);
      if (yy < top) return null;
      return <line key={i} x1={x} y1={yy} x2={x + Math.cos(a) * l} y2={yy + Math.sin(a) * l * 0.4} stroke={['#C9962B', '#F4D58D', '#B7832A', '#E0B455'][i % 4]} strokeWidth="3" strokeLinecap="round" />;
    })}
  </svg>
);
const SpawnPack = ({size = 220, style = {}}) => (
  <svg viewBox="0 0 220 260" width={size} height={size * 260 / 220} style={{overflow: 'visible', ...style}}>
    <path d="M30 40 Q30 20 50 20 L170 20 Q190 20 190 40 L196 236 Q196 250 182 250 L38 250 Q24 250 24 236 Z" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
    <path d="M32 110 L188 110 L194 236 Q194 248 182 248 L38 248 Q26 248 26 236 Z" fill="#E4D2B0" />
    {Array.from({length: 70}).map((_, i) => <ellipse key={i} cx={40 + rnd(i) * 140} cy={122 + rnd(i * 5) * 118} rx="7" ry="4.5" transform={`rotate(${rnd(i * 3) * 180} ${40 + rnd(i) * 140} ${122 + rnd(i * 5) * 118})`} fill={i % 3 ? '#FFFFFF' : '#C9A877'} stroke="rgba(120,90,40,0.25)" />)}
    <rect x="50" y="44" width="120" height="44" rx="10" fill="#2F2A22" />
    <text x="110" y="76" textAnchor="middle" fontSize="26" fontWeight="700" fill="#FFC52E" fontFamily="Anek, sans-serif" letterSpacing="1">SPAWN</text>
    <path d="M30 40 Q30 20 50 20 L60 20 L56 240" stroke="#fff" strokeOpacity="0.8" strokeWidth="6" fill="none" />
  </svg>
);
// grow bag: translucent bag of straw; holes where oyster clusters sprout (grow 0..1)
const GrowBag = ({w = 180, grow = 0, kind = 'oyster', seed = 3, style = {}}) => {
  const id = React.useMemo(() => uid('gb'), []);
  const h = w * 1.6;
  const holes = [[0.28, 0.32], [0.72, 0.5], [0.3, 0.7], [0.68, 0.86]];
  return (
    <div style={{position: 'relative', width: w, height: h, ...style}}>
      <svg viewBox="0 0 180 288" width={w} height={h} style={{overflow: 'visible', position: 'absolute', left: 0, top: 0}}>
        <defs>
          <clipPath id={`${id}k`}><path d="M24 40 Q20 34 30 30 L150 30 Q160 34 156 40 L164 262 Q164 280 146 280 L34 280 Q16 280 16 262 Z" /></clipPath>
          <linearGradient id={`${id}g`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="0.35" stopColor="#fff" stopOpacity="0.1" /><stop offset="1" stopColor="#fff" stopOpacity="0.4" /></linearGradient>
        </defs>
        <ellipse cx="90" cy="282" rx="76" ry="9" fill="rgba(60,40,10,0.16)" />
        <g clipPath={`url(#${id}k)`}>
          <rect x="0" y="30" width="180" height="260" fill="#E8C877" />
          {Array.from({length: 90}).map((_, i) => {
            const x = rnd(seed + i) * 180, y = 34 + rnd(seed + i * 3) * 250, a = (rnd(seed + i * 7) - 0.5) * 3, l = 16 + rnd(i) * 22;
            return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l * 0.5} stroke={['#C9962B', '#F6DE9E', '#B7832A', '#FFF1C4'][i % 4]} strokeWidth="3" strokeLinecap="round" />;
          })}
          {Array.from({length: 26}).map((_, i) => <circle key={`m${i}`} cx={rnd(i * 13 + seed) * 180} cy={40 + rnd(i * 17 + seed) * 240} r={3 + rnd(i) * 3} fill="#fff" opacity="0.75" />)}
          <rect x="0" y="30" width="180" height="260" fill={`url(#${id}g)`} />
        </g>
        <path d="M24 40 Q20 34 30 30 L150 30 Q160 34 156 40 L164 262 Q164 280 146 280 L34 280 Q16 280 16 262 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
        <path d="M70 30 Q90 4 110 30 Z" fill="#E8DCC4" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
        <rect x="76" y="20" width="28" height="10" rx="5" fill="#C7432F" />
        <path d="M36 50 L32 250" stroke="#fff" strokeOpacity="0.85" strokeWidth="7" strokeLinecap="round" />
      </svg>
      {holes.map(([hx, hy], i) => {
        const g = Math.max(0, Math.min(1, grow * 1.6 - i * 0.2));
        if (g <= 0) return null;
        const sz = w * 0.62 * g, left = hx > 0.5;
        return (
          <div key={i} style={{position: 'absolute', left: hx * w - sz / 2 + (left ? sz * 0.18 : -sz * 0.18), top: hy * h - sz * 0.78, width: sz, height: sz, transform: `rotate(${left ? 24 : -24}deg)`}}>
            {kind === 'button' ? <ButtonM size={sz} /> : <OysterM size={sz} />}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- small icons (64x64 stroke drawings) ---------- */
const G = ({children, size = 64, color = '#121212', sw = 3.2}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const I = {
  restaurant: <><path d="M18 8v18a6 6 0 0 0 12 0V8M24 8v48" /><path d="M44 56V8c-6 4-8 12-8 22h8" /></>,
  hotel: <><path d="M8 56V20l24-12 24 12v36" /><path d="M8 56h48" /><path d="M20 28h6M38 28h6M20 40h6M38 40h6" /><path d="M28 56V46h8v10" /></>,
  cafe: <><path d="M10 26h36v12a14 14 0 0 1-14 14h-8a14 14 0 0 1-14-14z" /><path d="M46 30h4a7 7 0 0 1 0 14h-5" /><path d="M22 8c-3 4 3 6 0 10M32 8c-3 4 3 6 0 10" /></>,
  veg: <><path d="M6 14h8l6 28h28l6-20H18" /><circle cx="24" cy="52" r="4" /><circle cx="44" cy="52" r="4" /></>,
  rack: <><path d="M10 6v54M54 6v54M10 18h44M10 34h44M10 50h44" /></>,
  humid: <><rect x="16" y="22" width="32" height="36" rx="8" /><path d="M24 14c0-4 4-4 4-8M36 14c0-4 4-4 4-8" /><circle cx="32" cy="40" r="6" /></>,
  spray: <><path d="M20 26h16v32H20z" /><path d="M24 26v-8h10l8 4M42 22h8M44 14l6-4M44 30l6 4" /></>,
  bag: <><path d="M14 18h36l4 40H10z" /><path d="M24 18v-4a8 8 0 0 1 16 0v4" /></>,
  bolt: <path d="M36 4 14 36h16l-4 24 24-34H34z" />,
  box: <><path d="M8 20 32 8l24 12v26L32 58 8 46z" /><path d="M8 20l24 12 24-12M32 32v26" /></>,
  worker: <><circle cx="32" cy="16" r="9" /><path d="M14 58c0-12 8-20 18-20s18 8 18 20" /><path d="M22 12h20" /></>,
  truck: <><path d="M4 16h34v30H4zM38 26h12l10 10v10H38z" /><circle cx="16" cy="50" r="6" /><circle cx="48" cy="50" r="6" /></>,
  thermo: <><path d="M26 38V10a6 6 0 0 1 12 0v28a11 11 0 1 1-12 0z" /><path d="M32 22v24" /></>,
  drop: <path d="M32 6C22 22 14 30 14 40a18 18 0 0 0 36 0c0-10-8-18-18-34z" />,
  cal: <><rect x="8" y="12" width="48" height="44" rx="6" /><path d="M8 26h48M20 6v12M44 6v12" /></>,
  sun: <><circle cx="32" cy="32" r="11" /><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6" /></>,
  sparkle: <path d="M32 6l6 20 20 6-20 6-6 20-6-20-20-6 20-6z" />,
  users: <><circle cx="24" cy="20" r="9" /><path d="M8 54c0-10 7-17 16-17s16 7 16 17" /><path d="M42 12a8 8 0 0 1 0 16M46 38c6 2 10 8 10 16" /></>,
  ledger: <><rect x="12" y="6" width="40" height="52" rx="5" /><path d="M20 18h24M20 28h24M20 38h14" /><path d="M38 46l4 4 8-8" /></>,
  cart: <><path d="M6 10h8l7 32h31l6-22H17" /><circle cx="24" cy="52" r="4" /><circle cx="48" cy="52" r="4" /></>,
  store: <><path d="M8 26 12 8h40l4 18" /><path d="M8 26a8 8 0 0 0 16 0 8 8 0 0 0 16 0 8 8 0 0 0 16 0" /><path d="M12 32v24h40V32" /><path d="M26 56V42h12v14" /></>,
  farmer: <><circle cx="32" cy="22" r="9" /><path d="M16 18h32M20 18c2-8 22-8 24 0" /><path d="M14 58c0-11 8-19 18-19s18 8 18 19" /></>,
  shield: <><path d="M32 6 10 14v16c0 14 10 24 22 28 12-4 22-14 22-28V14z" /><path d="M22 32l7 7 13-14" /></>,
  comment: <><path d="M8 12h48v32H28l-12 10V44H8z" /><path d="M18 24h28M18 32h18" /></>,
  bell: <><path d="M16 44V30a16 16 0 0 1 32 0v14l4 6H12z" /><path d="M26 54a6 6 0 0 0 12 0" /></>,
  license: <><rect x="8" y="10" width="48" height="40" rx="5" /><path d="M16 22h20M16 30h14" /><circle cx="44" cy="30" r="6" /><path d="M40 36l-2 14 6-4 6 4-2-14" /></>,
  process: <><circle cx="32" cy="32" r="8" /><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6" /></>,
  ac: <><rect x="6" y="12" width="52" height="20" rx="5" /><path d="M14 26h36" /><path d="M18 40c0 6-4 6-4 12M32 40c0 6-4 6-4 12M46 40c0 6-4 6-4 12" /></>,
  room: <><path d="M8 56V18L32 6l24 12v38z" /><path d="M24 56V36h16v20" /></>,
  field: <><path d="M4 44h56M4 52h56M10 36l6-8 6 8M28 36l6-8 6 8M46 36l6-8 6 8" /></>,
  arrowUp: <path d="M32 54V12M14 28l18-18 18 18" />,
};

export {rnd, ButtonM, OysterM, MilkyM, Straw, SpawnPack, GrowBag, G, I};
