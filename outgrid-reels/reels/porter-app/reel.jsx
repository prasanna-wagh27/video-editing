/*
 * "Porter-like tempo booking app in your city" (Marathi), LEAN style, light theme. VO at original speed.
 * Real logos: shared/logos (Google Maps, Google Pay, PhonePe, Paytm, Google Play, App Store) via public/logos.
 * Porter logo + photos (user-supplied): public/img/porter_logo.png (cropped wordmark tile), porter_trucks.jpg.
 * App screens, fares, plan price and the admin dashboard are illustrative. Revenue math is the script's own example.
 * Captions: captions.js from `python3 scripts/align_whisper.py reels/porter-app/script_hi.txt reels/porter-app/public/vo.mp3`.
 * T = real spoken word times (s) from that alignment; scene cuts sit in VO pauses.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark} from '../../shared/kit.jsx';
import {
  BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up,
  Glass, Chip, Ini, Ico, Tick, I_PIN, I_USERS, I_CHART, I_GRID, I_PHONE,
  Instagram, LogoImg, LeanOutro, LeanVideo,
} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';

const PORTER_IMG = true;

/* ---------- word times (s) ---------- */
const T = {
  porter: 0.78, kay: 3.02, phakt: 4.24, n40: 4.50, sec: 4.86,
  dukan: 6.32, shetkari: 7.24, ghar: 8.16, tempo1: 9.88,
  dusri: 10.92, shahar: 12.10, tempo2: 12.58, divas: 13.40, kaam: 14.00,
  app: 15.54, jod: 16.70, cust: 17.96, min2: 18.26, book: 19.74, driver: 20.52, lagech: 21.10, kaam2: 21.54,
  teen: 23.97, gosti: 24.19, capp: 24.89, dapp: 25.81, admin: 27.63,
  n20: 30.04, n30: 30.68, eka: 32.30, kamai: 34.44, commission: 37.72, trip: 36.82,
  dusra: 38.34, monthly: 39.78, subs: 40.32, tisra: 41.30, hw: 42.04, vyapari: 43.26, apmc: 44.18, contract: 46.10,
  ex: 46.72, trips: 48.40, rs100: 50.64, lakh3: 53.20, rev: 54.48, kharch: 56.56, lakh2: 56.88, banvun: 60.22, business: 60.58, suru: 61.00, dm: 63.16,
};
const OUTRO_AT = 64.15;
const SCENES = [
  ['hook', 0, 6.3], ['customers', 6.3, 10.6], ['drivers', 10.6, 15.04], ['connect', 15.04, 17.88], ['book', 17.88, 20.08], ['job', 20.08, 22.16],
  ['three', 22.16, 24.75], ['devices', 24.75, 28.6], ['fleet', 28.6, 31.94], ['city', 31.94, 33.93], ['kamai', 33.93, 35.45],
  ['commission', 35.45, 38.28], ['subs', 38.28, 41.0], ['contracts', 41.0, 46.72], ['example', 46.72, 51.6], ['revenue', 51.6, 55.42],
  ['cost', 55.42, 58.6], ['launch', 58.6, 62.0], ['dm', 62.0, OUTRO_AT], ['outro', OUTRO_AT, OUTRO_AT + 2.4],
];
const TOTAL = s(OUTRO_AT + 2.4);
const CHUNKS = CAPS.filter((c) => c.a >= s(SCENES[0][2]) - 2); // no subtitles over the text hook

/* ---------- helpers ---------- */
const INKC = '#1F1F1F', APP_C = '#2F6BFF';
const DEV = '०१२३४५६७८९';
const dev = (n) => String(n).replace(/\d/g, (d) => DEV[d]);
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const drop = (F, t, h = 300) => {
  const p = pop(F, t, 9);
  const land = io(F, s(t) + 6, s(t) + 9) * io(F, s(t) + 9, s(t) + 14, 1, 0);
  return {opacity: F < s(t) ? 0 : 1, transform: `translateY(${(1 - p) * -h}px) scale(${1 + 0.06 * land}, ${1 - 0.08 * land})`, transformOrigin: '50% 100%'};
};
const popS = (F, t, d = 11) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const Marker = ({F, t, children}) => (
  <span style={{background: `linear-gradient(transparent 52%, ${Y} 52%, ${Y} 78%, transparent 78%) no-repeat left / ${io(F, s(t), s(t) + 8) * 100}% 100%`, padding: '0 6px'}}>{children}</span>
);
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Pill = ({children, size = 40, bg = '#fff', color = TXT, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.3, background: bg, color, borderRadius: 999, padding: `${size * 0.36}px ${size * 0.7}px ${size * 0.22}px`, fontSize: size, fontWeight: 700,
    boxShadow: '0 14px 34px rgba(60,45,10,0.13)', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>
);
const StepTag = ({n, children}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>
    <div style={{width: 64, height: 64, borderRadius: 20, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', fontSize: 38, fontWeight: 800, color: BG}}>{n}</div>{children}
  </div>
);

/* ---------- real logos ---------- */
const PorterLogo = ({h = 110}) => PORTER_IMG
  ? <Img src={staticFile('img/porter_logo.png')} style={{height: h, width: h * 430 / 140, display: 'block', borderRadius: h * 0.22, boxShadow: '0 14px 30px rgba(0,58,220,0.25)'}} />
  : <div style={{height: h, display: 'flex', alignItems: 'center', background: '#fff', border: `3px solid ${LINE}`, borderRadius: h * 0.28, padding: `${h * 0.12}px ${h * 0.3}px 0`, fontSize: h * 0.6, fontWeight: 700, color: TXT, ...LAT, boxSizing: 'border-box'}}>Porter</div>;
const MapsPin = ({size = 80}) => <LogoImg src="google-maps.svg" size={size} />;
const PayRow = ({F, t}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
    {[['google-pay.svg', 150, 60], ['phonepe.svg', 60, 60], ['paytm.svg', 110, 60]].map(([f, w, h], i) => (
      <div key={f} style={{height: 84, padding: '0 22px', borderRadius: 22, background: '#fff', border: '2px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', ...popS(F, t + i * 0.12)}}>
        <Img src={staticFile(`logos/${f}`)} style={{width: w, height: h, objectFit: 'contain'}} />
      </div>
    ))}
  </div>
);
const StoreBadge = ({kind, size = 46}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#111', borderRadius: 16, padding: '10px 18px 8px 12px', color: '#fff'}}>
    <LogoImg src={kind === 'play' ? 'google-play.svg' : 'app-store.svg'} size={size} style={kind === 'play' ? {} : {borderRadius: size * 0.22}} />
    <div style={{lineHeight: 1.05, ...LAT}}><div style={{fontSize: size * 0.32, opacity: 0.75}}>{kind === 'play' ? 'GET IT ON' : 'Download on the'}</div><div style={{fontSize: size * 0.5, fontWeight: 700}}>{kind === 'play' ? 'Google Play' : 'App Store'}</div></div>
  </div>
);

/* ---------- vectors ---------- */
const Tempo = ({size = 260, spin = 0, body = Y, cab = APP_C, load}) => (
  <svg viewBox="0 0 120 80" width={size} height={size * 2 / 3} style={{overflow: 'visible'}}>
    {load && <g>{load}</g>}
    <rect x="4" y="14" width="68" height="44" rx="5" fill={body} stroke={INKC} strokeWidth="3.5" />
    <path d="M72 24h18c8 0 14 8 18 18v16H72z" fill={cab} stroke={INKC} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M80 30h9c4 0 8 4 10 10H80z" fill="#CFE6F5" stroke={INKC} strokeWidth="2.5" />
    {[24, 94].map((x) => <g key={x} transform={`rotate(${spin} ${x} 62)`}><circle cx={x} cy="62" r="11" fill={INKC} /><circle cx={x} cy="62" r="4.5" fill="#ddd" /><path d={`M${x - 8} 62h16`} stroke="#666" strokeWidth="2" /></g>)}
  </svg>
);
const Shop = ({size = 150}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="10" y="28" width="44" height="30" fill="#fff" stroke={INKC} strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${8 + i * 12} 16h12v8a6 6 0 0 1-12 0z`} fill={i % 2 ? '#fff' : C_RED} stroke={INKC} strokeWidth="2.5" strokeLinejoin="round" />)}
    <rect x="8" y="8" width="48" height="8" rx="2" fill={INKC} /><rect x="36" y="38" width="12" height="20" fill={INKC} /><rect x="16" y="36" width="14" height="10" fill="#FFF4D1" stroke={INKC} strokeWidth="2" />
  </svg>
);
const Sacks = ({size = 150}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {[[6, 26], [34, 26], [20, 6]].map(([x, y], i) => <g key={i}><path d={`M${x + 4} ${y + 6}h20l3 28H${x + 1}z`} fill={['#E8D3A8', '#DCC495', '#F0DFB8'][i]} stroke={INKC} strokeWidth="2.6" strokeLinejoin="round" /><path d={`M${x + 6} ${y + 6}l2-5h12l2 5`} fill="none" stroke={INKC} strokeWidth="2.6" /><path d={`M${x + 8} ${y + 20}h12`} stroke="#8DB33C" strokeWidth="3" strokeLinecap="round" /></g>)}
  </svg>
);
const Boxes = ({size = 150}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {[[6, 30, 26], [32, 30, 26], [18, 6, 26]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height="24" rx="2" fill="#D9A866" stroke={INKC} strokeWidth="2.6" /><path d={`M${x + w / 2 - 4} ${y}v9h8v-9`} fill="#F3E3C3" stroke={INKC} strokeWidth="2" /></g>)}
  </svg>
);
const Person = ({size = 110, c = INKC, cap}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="20" r="11" fill={c} /><path d="M10 62c0-16 10-24 22-24s22 8 22 24z" fill={c} />{cap && <path d="M20 14c2-8 22-8 24 0z" fill={cap} />}</svg>
);
const Clock = ({size = 150, t = 0}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="28" fill="#fff" stroke={INKC} strokeWidth="3.5" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d="M32 8v5" stroke={INKC} strokeWidth="2.5" transform={`rotate(${i * 30} 32 32)`} />)}
    <path d="M32 32V18" stroke={INKC} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${t * 30} 32 32)`} />
    <path d="M32 32V12" stroke={C_RED} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${t * 360} 32 32)`} /><circle cx="32" cy="32" r="3" fill={INKC} />
  </svg>
);
const Ring = ({size = 160, p = 0, color = Y, children}) => (
  <div style={{width: size, height: size, position: 'relative'}}>
    <svg viewBox="0 0 100 100" width={size} height={size} style={{...abs(0, 0), transform: 'rotate(-90deg)'}}>
      <circle cx="50" cy="50" r="42" fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
    </svg>
    <div style={{...abs(0, 0), width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.06, boxSizing: 'border-box'}}>{children}</div>
  </div>
);
// stylized city map (roads, river, blocks); route along ROUTE with progress p
const ROUTE = 'M220 760 L220 560 L430 560 L430 330 L680 330 L680 180';
const CityMap = ({w = 900, h = 900, p = 0, dots = [], F = 0}) => (
  <svg viewBox="0 0 900 900" width={w} height={h} preserveAspectRatio="xMidYMid slice" style={{display: 'block'}}>
    <rect width="900" height="900" fill="#EEF0EC" />
    <path d="M-20 820 C200 700 320 880 520 760 S800 640 920 700 L920 920 L-20 920z" fill="#BFDDF5" />
    {[[60, 60, 300, 200], [470, 60, 380, 200], [60, 380, 300, 120], [470, 380, 200, 120], [710, 380, 160, 300], [200, 600, 180, 100]].map(([x, y, bw, bh], i) => <rect key={i} x={x} y={y} width={bw} height={bh} rx="18" fill={i % 2 ? '#E2E6DF' : '#DDE8D3'} />)}
    {[[0, 330, 900, 330], [0, 560, 900, 560], [150, 0, 150, 900], [430, 0, 430, 900], [720, 0, 720, 900]].map(([x1, y1, x2, y2], i) => <g key={i}><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#fff" strokeWidth="44" /><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#E9DFC3" strokeWidth="4" strokeDasharray="20 20" /></g>)}
    <path d={ROUTE} fill="none" stroke={APP_C} strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
    {dots.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={26 + 12 * ((F + i * 9) % 30) / 30} fill={APP_C} opacity={0.25 * (1 - ((F + i * 9) % 30) / 30)} /><circle cx={x} cy={y} r="16" fill={APP_C} stroke="#fff" strokeWidth="5" /></g>)}
  </svg>
);
// point along ROUTE (piecewise linear, equal-length param)
const routeAt = (q) => {
  const P = [[220, 760], [220, 560], [430, 560], [430, 330], [680, 330], [680, 180]];
  const L = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1])); const tot = L.reduce((a, b) => a + b, 0);
  let d = q * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const k = d / L[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k, i]; } d -= L[i]; }
  return [680, 180, 4];
};
const PhoneL = ({x, y, w, h, children, style = {}, dark}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: w * 0.13, background: '#1d1d1f', padding: 12, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.28)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: w * 0.11, overflow: 'hidden', background: dark ? '#15171C' : '#FAF8F3', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 14), marginLeft: -50, width: 100, height: 28, borderRadius: 14, background: '#1d1d1f'}} />
    </div>
  </div>
);
const AppGlyph = ({size = 80}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg viewBox="0 0 24 24" width={size * 0.64} height={size * 0.64} fill="none" stroke={BG} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z" /><circle cx="6" cy="17.5" r="1.8" fill={Y} /><circle cx="17" cy="17.5" r="1.8" fill={Y} /></svg>
  </div>
);
const Tap = ({F, t, x, y}) => {
  const a = s(t); if (F < a || F > a + 14) return null; const k = io(F, a, a + 14);
  return <div style={{...abs(x - 70 * k, y - 70 * k), width: 140 * k, height: 140 * k, borderRadius: '50%', border: `5px solid ${APP_C}`, opacity: 1 - k}} />;
};

/* ---------- 1. Hook: real Porter photo, then "your" app slides in ---------- */
const Hook = ({F}) => {
  const q = pop(F, T.kay - 0.05, 9);
  const left = Math.max(0, 40 - Math.floor(io(F, s(T.sec), s(6.3), 0, 6, Easing.linear)));
  const ph = pop(F, T.kay - 0.25, 13);
  const p = io(F, s(T.kay), s(6.3), 0.05, 1, Easing.inOut(Easing.quad));
  const [tx, ty] = routeAt(p);
  const K = 0.751, OX = -110; // CityMap (900 units) inside the 456x676 phone screen
  return (
    <AbsoluteFill>
      <div style={{...abs(72, 200), fontSize: 42, fontWeight: 600, color: MUTED, ...LAT}}>तुमच्या शहरात</div>
      <div style={{...abs(66, 262), display: 'flex', alignItems: 'center', gap: 26, fontSize: 128, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>
        <PorterLogo h={118} /><span>सारखं App</span>
      </div>
      <div style={{...abs(66, 420), fontSize: 140, fontWeight: 800, color: TXT, lineHeight: 1.05, ...LAT, transform: `scale(${0.6 + 0.4 * q})`, transformOrigin: '0% 70%', opacity: Math.min(1, q * 2)}}>
        <Marker F={F} t={T.kay + 0.3}>काय लागेल?</Marker>
      </div>
      <div style={{...abs(70, 640), width: 900, height: 600, borderRadius: 40, overflow: 'hidden', border: '8px solid #fff', boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(60,45,10,0.22)',
        transform: `rotate(-2.5deg) translateY(${io(F, 0, 14, 50, 0)}px)`}}>
        <Img src={staticFile('img/porter_trucks.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '40% 50%', transform: `scale(${io(F, 0, s(6.3), 1.04, 1.16, Easing.linear)})`}} />
      </div>
      <PhoneL x={540} y={860} w={480} h={700} style={{opacity: F < s(T.kay - 0.25) ? 0 : 1, transform: `translateY(${(1 - ph) * 1100}px) rotate(5deg)`}}>
        <div style={{...abs(0, 0), width: 456, height: 676}}>
          <CityMap w={456} h={676} p={p} />
          <div style={{...abs(680 * K + OX - 34, 180 * K - 70)}}><MapsPin size={68} /></div>
          <div style={{...abs(tx * K + OX - 60, ty * K - 70)}}><Tempo size={120} spin={F * 14} /></div>
        </div>
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 22, background: '#fff', borderRadius: 22, padding: '16px 18px 10px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.12)'}}>
          <AppGlyph size={52} /><div style={{flex: 1}}><div style={{fontSize: 24, fontWeight: 800, color: INKC, ...LAT}}>Tempo on the way</div><div style={{fontSize: 18, color: '#8a8478', ...LAT}}>Your App</div></div>
          <div style={{fontSize: 26, fontWeight: 800, color: C_GREEN, ...LAT}}>₹450</div>
        </div>
      </PhoneL>
      <div style={{...abs(80, 1200), ...popS(F, T.phakt, 9)}}>
        <div style={{transform: 'rotate(-5deg)', background: '#fff', borderRadius: 40, padding: 16, boxShadow: '0 24px 50px rgba(60,45,10,0.2)'}}>
          <Ring size={220} p={F < s(T.sec) ? io(F, s(T.phakt), s(T.n40) + 4) : left / 40}>
            <div style={{textAlign: 'center'}}><div style={{fontSize: 88, fontWeight: 800, color: TXT, lineHeight: 1, ...LAT}}>{dev(F < s(T.sec) ? 40 : left)}</div><div style={{fontSize: 28, fontWeight: 700, color: MUTED}}>सेकंद</div></div>
          </Ring>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Who needs a tempo ---------- */
const Customers = ({F}) => {
  const C = [['दुकानदार', <Shop />, T.dukan - 0.1], ['शेतकरी', <Sacks />, T.shetkari - 0.1], ['घर शिफ्ट', <Boxes />, T.ghar - 0.1]];
  const drive = io(F, s(T.tempo1) - 14, s(T.tempo1) + 4, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      {C.map(([n, ico, t], i) => (
        <div key={n} style={{...abs(70 + i * 320, 300), ...drop(F, t, 260)}}>
          <Glass x={0} y={0} w={300} h={380} r={36} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
            {ico}<div style={{fontSize: 44, fontWeight: 700, color: TXT}}>{n}</div>
          </Glass>
        </div>
      ))}
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{...abs(0, 0)}}>
        {[220, 540, 860].map((x, i) => <path key={x} d={`M${x} 700 Q${(x + 540) / 2} 820 540 930`} fill="none" stroke={GOLD_T} strokeWidth="5" strokeDasharray="12 14" strokeDashoffset={-F} opacity={io(F, s(T.tempo1) - 4 + i * 2, s(T.tempo1) + 4 + i * 2)} />)}
      </svg>
      <div style={{...abs(290 - 700 * (1 - drive), 900)}}><Tempo size={500} spin={F * 16 * (1 - drive) + 40} /></div>
      <div style={{...abs(640, 900), ...popS(F, T.tempo1 + 0.1)}}><Chip color={C_ORANGE} size={40} style={{background: '#fff'}}>Tempo हवा!</Chip></div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Tempo drivers wait all day ---------- */
const Drivers = ({F}) => {
  const hrs = io(F, s(T.divas) - 6, s(15.0), 9, 18, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Glass x={90} y={300} w={900} h={960} r={44} style={{padding: 0, overflow: 'hidden'}}>
        <div style={{height: 960, background: 'linear-gradient(#F4F1EA, #E9E4D8)', position: 'relative'}}>
          <div style={{...abs(0, 700), width: 900, height: 260, background: '#CFC8B8'}} />
          {[0, 1, 2].map((i) => <div key={i} style={{...abs(0 + i * 300, 702), width: 8, height: 120, background: '#fff', marginLeft: 296}} />)}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{...abs(30 + i * 290, 520), ...up(F, 10.6 + i * 0.12, 12, 40)}}>
              <Tempo size={250} body={['#FFD54A', '#9AD0F5', '#B9E4A8'][i]} cab={['#2F6BFF', '#E2683C', '#3DBB4A'][i]} />
            </div>
          ))}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{...abs(110 + i * 290, 330), ...up(F, T.tempo2 + i * 0.12, 12, 30)}}>
              <Person size={110} cap={['#2F6BFF', '#E2683C', '#3DBB4A'][i]} />
              <div style={{...abs(70, -70), ...popS(F, T.kaam - 0.15 + i * 0.15, 10)}}><div style={{background: '#fff', borderRadius: '24px 24px 24px 6px', padding: '10px 20px 4px', fontSize: 34, fontWeight: 700, color: TXT, boxShadow: '0 10px 24px rgba(0,0,0,0.12)', whiteSpace: 'nowrap'}}>काम?</div></div>
            </div>
          ))}
          <div style={{...abs(40, 40), ...popS(F, T.shahar - 0.1)}}><Pill size={38}><Ico d={I_PIN} size={38} color={C_RED} sw={2.4} />तुमचं शहर</Pill></div>
          <div style={{...abs(660, 30), ...popS(F, T.divas - 0.15)}}><div style={{background: '#fff', borderRadius: 40, padding: 14, boxShadow: '0 14px 30px rgba(0,0,0,0.12)'}}><Clock size={170} t={hrs} /></div></div>
        </div>
      </Glass>
      <div style={{...abs(290, 1180), ...popS(F, T.kaam + 0.3, 10)}}><Chip color={C_RED} size={40} style={{background: '#fff'}}>0 bookings today</Chip></div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Your app connects both ---------- */
const Connect = ({F}) => {
  const L = io(F, s(T.jod) - 6, s(T.jod) + 14, 0, 1, Easing.inOut(Easing.cubic));
  const left = [[<Shop size={110} />, 360], [<Sacks size={110} />, 640], [<Boxes size={110} />, 920]];
  return (
    <AbsoluteFill>
      <div style={{...abs(80, 270), ...up(F, 15.04, 10, 20)}}><Chip color="#6b665c" size={30}>CUSTOMERS</Chip></div>
      <div style={{...abs(790, 270), ...up(F, 15.04, 10, 20)}}><Chip color="#6b665c" size={30}>DRIVERS</Chip></div>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{...abs(0, 0)}}>
        {left.map(([, y], i) => <path key={i} d={`M240 ${y + 60} C380 ${y + 60} 400 700 540 700`} fill="none" stroke={APP_C} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - L} />)}
        {left.map(([, y], i) => <path key={i} d={`M540 700 C680 700 700 ${y + 60} 840 ${y + 60}`} fill="none" stroke={GOLD_T} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - L} />)}
        {L >= 1 && left.map(([, y], i) => { const k = ((F + i * 10) % 30) / 30; return <circle key={i} cx={240 + 600 * k} cy={y + 60 + (700 - y - 60) * Math.sin(Math.PI * k)} r="10" fill={APP_C} />; })}
      </svg>
      {left.map(([ico, y], i) => <div key={i} style={{...abs(80, y), ...popS(F, 15.04 + i * 0.1)}}><div style={{width: 160, height: 140, borderRadius: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(60,45,10,0.12)'}}>{ico}</div></div>)}
      {left.map(([, y], i) => <div key={i} style={{...abs(840, y + 10), ...popS(F, 15.2 + i * 0.1)}}><div style={{width: 170, height: 130, borderRadius: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(60,45,10,0.12)'}}><Tempo size={130} body={['#FFD54A', '#9AD0F5', '#B9E4A8'][i]} /></div></div>)}
      <div style={{...abs(410, 570), ...popS(F, T.app - 0.1, 9)}}>
        <div style={{width: 260, height: 260, borderRadius: 70, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${16 + 10 * Math.sin(F / 6)}px rgba(255,197,46,0.25), 0 30px 60px rgba(183,127,0,0.3)`}}>
          <AppGlyph size={200} />
        </div>
        <div style={{marginTop: 22, textAlign: 'center', fontSize: 42, fontWeight: 800, color: TXT}}>तुमचं App</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Customer books a tempo in 2 minutes ---------- */
const Book = ({F}) => {
  const p = io(F, s(T.cust) - 2, s(T.book), 0, 1, Easing.inOut(Easing.cubic));
  const booked = F >= s(T.book) + 3;
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120}>
        <div style={{...abs(0, 0), width: 716, height: 1096}}><CityMap w={716} h={720} p={p} /></div>
        <div style={{...abs(716 * 220 / 900 - 30, 720 * 760 / 900 - 30)}}><div style={{width: 60, height: 60, borderRadius: 30, background: '#fff', border: `10px solid ${C_GREEN}`, boxSizing: 'border-box'}} /></div>
        <div style={{...abs(716 * 680 / 900 - 50, 720 * 180 / 900 - 100), ...drop(F, T.cust + 0.2, 200)}}><MapsPin size={100} /></div>
        <div style={{...abs(0, 660), width: 716, height: 440, background: '#fff', borderRadius: '40px 40px 0 0', boxShadow: '0 -10px 30px rgba(0,0,0,0.08)', padding: '30px 34px', boxSizing: 'border-box'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderRadius: 26, border: `3px solid ${APP_C}`, background: '#EEF3FF'}}>
            <Tempo size={130} /><div style={{flex: 1}}><div style={{fontSize: 36, fontWeight: 800, color: INKC, ...LAT}}>Tempo · 750 kg</div><div style={{fontSize: 24, color: '#8a8478', ...LAT}}>Arrives in 8 min</div></div>
            <div style={{fontSize: 40, fontWeight: 800, color: INKC, ...LAT}}>₹450</div>
          </div>
          <div style={{marginTop: 30, height: 120, borderRadius: 30, background: booked ? C_GREEN : Y, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 6, fontSize: 44, fontWeight: 800, color: booked ? '#fff' : BG, ...LAT,
            transform: `scale(${1 - 0.05 * io(F, s(T.book) - 4, s(T.book)) * io(F, s(T.book), s(T.book) + 4, 1, 0)})`}}>{booked ? <><Tick size={52} color="#15803D" />Tempo booked</> : 'Book Tempo'}</div>
        </div>
        <Tap F={F} t={T.book} x={358} y={895} />
      </PhoneL>
      <div style={{...abs(60, 330), ...popS(F, T.min2 - 0.1, 9)}}>
        <div style={{transform: 'rotate(-5deg)', background: '#fff', borderRadius: 36, padding: 14, boxShadow: '0 24px 50px rgba(60,45,10,0.2)'}}>
          <Ring size={190} p={io(F, s(T.min2), s(T.book) + 4)} color={APP_C}><div style={{textAlign: 'center'}}><div style={{fontSize: 70, fontWeight: 800, color: TXT, lineHeight: 1}}>२</div><div style={{fontSize: 26, fontWeight: 700, color: MUTED}}>मिनिटं</div></div></Ring>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. Driver gets the trip instantly ---------- */
const Job = ({F}) => {
  const acc = F >= s(T.kaam2);
  const hold = io(F, s(T.lagech) - 2, s(T.kaam2), 0, 1, Easing.linear);
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120} dark>
        <div style={{padding: '70px 34px 0', display: 'flex', alignItems: 'center', gap: 16}}>
          <AppGlyph size={70} /><div style={{flex: 1, fontSize: 34, fontWeight: 800, color: '#fff', ...LAT}}>Driver App</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.18)', borderRadius: 999, padding: '10px 20px 6px', fontSize: 26, fontWeight: 700, color: C_GREEN}}><span style={{width: 12, height: 12, borderRadius: 6, background: C_GREEN}} />Online</div>
        </div>
        <div style={{margin: '40px 34px 0', borderRadius: 34, background: '#fff', padding: '34px 34px 30px', ...up(F, T.driver - 0.2, 10, 120)}}>
          <div style={{display: 'flex', alignItems: 'center'}}><div style={{fontSize: 28, fontWeight: 700, color: '#8a8478', letterSpacing: '0.08em', ...LAT}}>NEW TRIP REQUEST</div><div style={{flex: 1}} /><div style={{fontSize: 56, fontWeight: 800, color: INKC, ...LAT}}>₹450</div></div>
          {[[C_GREEN, 'Pickup', 'Shivaji Nagar · 2.1 km'], [C_RED, 'Drop', 'Market Yard · 9 km']].map(([c, a, b]) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26}}>
              <div style={{width: 26, height: 26, borderRadius: 13, border: `7px solid ${c}`, boxSizing: 'border-box'}} />
              <div><div style={{fontSize: 22, color: '#8a8478', ...LAT}}>{a}</div><div style={{fontSize: 34, fontWeight: 700, color: INKC, ...LAT}}>{b}</div></div>
            </div>
          ))}
          <div style={{marginTop: 34, height: 120, borderRadius: 30, background: acc ? C_GREEN : '#E8F7EE', position: 'relative', overflow: 'hidden'}}>
            {!acc && <div style={{...abs(0, 0), height: 120, width: `${hold * 100}%`, background: C_GREEN}} />}
            <div style={{position: 'relative', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 6, fontSize: 44, fontWeight: 800, color: hold > 0.5 || acc ? '#fff' : '#15803D', ...LAT}}>{acc ? <><Tick size={52} color="#15803D" />Trip accepted</> : 'Accept'}</div>
          </div>
        </div>
      </PhoneL>
      <div style={{...abs(650, 1180), ...popS(F, T.kaam2 + 0.15, 9)}}><div style={{transform: 'rotate(-4deg)'}}><Pill size={42} bg={Y} color={BG}>+ ₹450 earned</Pill></div></div>
    </AbsoluteFill>
  );
};

/* ---------- 7. Just 3 things ---------- */
const Three = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 280), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, T.teen - 0.15, 9)}}><Big size={460} color={TXT}>३</Big></div>
    <div style={{...abs(0, 860), width: 1080, display: 'flex', justifyContent: 'center', gap: 34}}>
      {[<Ico d={I_PHONE} size={90} color={APP_C} sw={2} />, <Ico d={I_USERS} size={90} color={GOLD_T} sw={2} />, <Ico d={I_GRID} size={90} color={C_GREEN} sw={2} />].map((ic, i) => (
        <div key={i} style={{width: 260, height: 260, borderRadius: 50, background: '#fff', border: `3px dashed ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(60,45,10,0.10)', ...drop(F, T.gosti - 0.1 + i * 0.12, 240)}}>{ic}</div>
      ))}
    </div>
  </AbsoluteFill>
);

/* ---------- 8. Customer App, Driver App, Admin Panel ---------- */
const MiniList = ({dark}) => [0, 1, 2].map((i) => <div key={i} style={{display: 'flex', gap: 12, margin: '16px 20px 0', alignItems: 'center'}}><div style={{width: 54, height: 54, borderRadius: 14, background: dark ? '#2A2E36' : ['#EEF3FF', '#FFF4D6', '#E8F7EE'][i]}} /><div style={{flex: 1}}><div style={{height: 12, borderRadius: 6, background: dark ? '#3A3F48' : '#2A2A2A', width: '80%'}} /><div style={{height: 9, borderRadius: 5, background: dark ? '#2A2E36' : 'rgba(0,0,0,0.1)', width: '50%', marginTop: 8}} /></div></div>);
const Devices = ({F}) => {
  const bars = [40, 55, 48, 70, 62, 85, 100];
  return (
    <AbsoluteFill>
      <div style={{...abs(70, 250), ...popS(F, T.capp - 0.15, 12)}}>
        <PhoneL x={0} y={0} w={330} h={600} style={{position: 'relative', transform: 'rotate(-4deg)'}}>
          <div style={{height: 260}}><CityMap w={306} h={260} p={0.7} /></div><MiniList />
        </PhoneL>
        <div style={{marginTop: 26}}><Pill size={36}><AppGlyph size={44} />Customer App</Pill></div>
      </div>
      <div style={{...abs(650, 250), ...popS(F, T.dapp - 0.15, 12)}}>
        <PhoneL x={0} y={0} w={330} h={600} dark style={{position: 'relative', transform: 'rotate(4deg)'}}>
          <div style={{margin: '70px 20px 0', borderRadius: 20, background: '#fff', height: 150, padding: 18, boxSizing: 'border-box'}}><div style={{height: 14, width: '60%', borderRadius: 7, background: '#2A2A2A'}} /><div style={{height: 50, borderRadius: 14, background: C_GREEN, marginTop: 40}} /></div><MiniList dark />
        </PhoneL>
        <div style={{marginTop: 26}}><Pill size={36}><AppGlyph size={44} />Driver App</Pill></div>
      </div>
      <div style={{...abs(400, 560), display: 'flex', flexDirection: 'column', gap: 14, ...up(F, T.dapp + 0.4, 12, 30)}}><StoreBadge kind="play" size={52} /><StoreBadge kind="app" size={52} /></div>
      <div style={{...abs(150, 1000), ...up(F, T.admin - 0.25, 12, 80)}}>
        <div style={{width: 780, height: 340, borderRadius: '24px 24px 0 0', background: '#1d1d1f', padding: 12, boxSizing: 'border-box'}}>
          <div style={{width: '100%', height: '100%', borderRadius: 14, background: '#fff', display: 'flex', overflow: 'hidden'}}>
            <div style={{width: 150, background: '#F3F1EC', padding: 16, boxSizing: 'border-box'}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{height: 18, borderRadius: 9, background: i === 0 ? Y : 'rgba(0,0,0,0.1)', marginTop: 16}} />)}</div>
            <div style={{flex: 1, padding: 18}}>
              <div style={{display: 'flex', gap: 12}}>{[['Trips', '128'], ['Drivers', '26'], ['Revenue', '₹12.8k']].map(([a, b]) => <div key={a} style={{flex: 1, borderRadius: 12, border: '2px solid rgba(0,0,0,0.07)', padding: '10px 12px 6px'}}><div style={{fontSize: 16, color: '#8a8478', ...LAT}}>{a}</div><div style={{fontSize: 30, fontWeight: 800, color: INKC, ...LAT}}>{b}</div></div>)}</div>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, marginTop: 16}}>{bars.map((h, i) => <div key={i} style={{flex: 1, height: `${h * io(F, s(T.admin) + i * 2, s(T.admin) + 12 + i * 2)}%`, borderRadius: '8px 8px 0 0', background: i === 6 ? Y : '#DCE6FF'}} />)}</div>
            </div>
          </div>
        </div>
        <div style={{width: 880, height: 26, marginLeft: -50, borderRadius: '0 0 20px 20px', background: '#C9C6BF'}} />
        <div style={{...abs(560, -40), ...popS(F, T.admin, 10)}}><Pill size={36} bg={BG} color="#fff">Admin Panel</Pill></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. Start with 20-30 drivers ---------- */
const Fleet = ({F}) => {
  const n = F < s(T.n20) ? 0 : F < s(T.n30) ? Math.round(io(F, s(T.n20) - 4, s(T.n20) + 8, 0, 20)) : Math.round(io(F, s(T.n30) - 2, s(T.n30) + 8, 20, 30));
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 250), width: 1080, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 24}}>
        <Big size={260}>{dev(n)}</Big><div style={{fontSize: 56, fontWeight: 700, color: MUTED}}>ड्रायव्हर्स</div>
      </div>
      <div style={{...abs(90, 600), width: 900, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14}}>
        {Array.from({length: 30}).map((_, i) => (
          <div key={i} style={{height: 120, borderRadius: 24, background: i < n ? '#fff' : 'rgba(0,0,0,0.035)', border: i < n ? `2px solid ${LINE}` : '2px dashed rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: i < n ? '0 8px 20px rgba(60,45,10,0.08)' : 'none'}}>
            {i < n && <div style={{transform: `scale(${io(F, s(i < 20 ? T.n20 : T.n30) + (i % 20) * 0.3, s(i < 20 ? T.n20 : T.n30) + (i % 20) * 0.3 + 5, 0.4, 1)})`}}><Tempo size={110} body={['#FFD54A', '#9AD0F5', '#B9E4A8'][i % 3]} cab={['#2F6BFF', '#E2683C', '#3DBB4A'][i % 3]} /></div>}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 10. One city ---------- */
const City = ({F}) => {
  const D = [[150, 450], [430, 200], [600, 560], [300, 330], [720, 470], [430, 700], [150, 220], [720, 250]];
  return (
    <AbsoluteFill>
      <Glass x={90} y={290} w={900} h={1000} r={44} style={{padding: 0, overflow: 'hidden'}}>
        <div style={{transform: `scale(${io(F, s(31.94), s(33.93), 1.12, 1.0)})`}}><CityMap w={900} h={1000} dots={D.slice(0, Math.floor(io(F, s(31.94), s(T.eka) + 10, 0, 8, Easing.linear)))} F={F} /></div>
        <div style={{...abs(400, 360), ...drop(F, T.eka - 0.25, 300)}}><MapsPin size={130} /></div>
        <div style={{...abs(40, 40), ...popS(F, T.eka)}}><Pill size={44}><Ico d={I_PIN} size={44} color={C_RED} sw={2.4} />१ शहर</Pill></div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 11. How will it earn? ---------- */
const Kamai = ({F}) => {
  const flip = io(F, s(T.kamai) - 6, s(T.kamai) + 12);
  return (
    <AbsoluteFill>
      <div style={{...abs(340, 300), transform: `scale(${pop(F, 33.95, 10)}) rotateY(${flip * 360}deg)`}}>
        <div style={{width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFE38A, ${Y} 55%, #E0A800)`, border: `10px solid ${GOLD_T}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 70px rgba(183,127,0,0.35)', fontSize: 240, fontWeight: 800, color: BG, paddingTop: 20, boxSizing: 'border-box'}}>₹</div>
      </div>
      <div style={{...abs(170, 800), display: 'flex', flexDirection: 'column', gap: 22}}>
        {[1, 2, 3].map((n, i) => (
          <div key={n} style={{width: 740, height: 120, borderRadius: 30, background: '#fff', boxShadow: '0 14px 34px rgba(60,45,10,0.10)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 22, ...up(F, T.kamai + 0.1 + i * 0.12, 10, 30)}}>
            <div style={{width: 70, height: 70, borderRadius: 22, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', fontSize: 40, fontWeight: 800, color: BG}}>{n}</div>
            <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(0,0,0,0.07)'}} /><div style={{fontSize: 50, fontWeight: 800, color: MUTED}}>?</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 12. 1: commission per trip ---------- */
const Commission = ({F}) => {
  const sp = io(F, s(T.commission) - 8, s(T.commission) + 6, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 270), ...up(F, 35.45, 10, 20)}}><StepTag n="1">Commission</StepTag></div>
      <Glass x={110} y={380} w={860} h={420} r={44} style={{padding: '40px 46px', ...up(F, T.trip - 0.6, 12, 50)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}><Tempo size={150} /><div style={{flex: 1}}><div style={{fontSize: 30, color: MUTED, fontWeight: 600, ...LAT}}>Trip fare</div><div style={{fontSize: 110, fontWeight: 800, color: TXT, ...LAT, lineHeight: 1.05}}>₹500</div></div></div>
        <div style={{display: 'flex', height: 70, borderRadius: 20, overflow: 'hidden', marginTop: 30, gap: 6 * sp}}>
          <div style={{flex: `${90 + 10 * (1 - sp)} 0 0`, background: '#DCE6FF'}} /><div style={{flex: `${10 * sp} 0 0`, background: Y}} />
        </div>
      </Glass>
      <div style={{...abs(110, 860), display: 'flex', gap: 30}}>
        <div style={{...up(F, T.commission - 0.1, 12, 30)}}><Glass x={0} y={0} w={420} h={260} r={36} style={{position: 'relative', padding: 34}}><div style={{fontSize: 30, color: MUTED, fontWeight: 600}}>ड्रायव्हर</div><div style={{fontSize: 96, fontWeight: 800, color: TXT, ...LAT}}>₹450</div></Glass></div>
        <div style={{...popS(F, T.commission + 0.05, 9)}}><div style={{width: 410, height: 260, borderRadius: 36, background: Y, padding: 34, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(183,127,0,0.3)'}}><div style={{fontSize: 30, color: BG, fontWeight: 700}}>तुमचं कमिशन</div><div style={{fontSize: 96, fontWeight: 800, color: BG, ...LAT}}>₹50</div></div></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 13. 2: monthly subscription from drivers ---------- */
const Subs = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(110, 270), ...up(F, 38.28, 10, 20)}}><StepTag n="2">Driver Subscription</StepTag></div>
    <PhoneL x={190} y={380} w={700} h={960} dark style={{...up(F, T.dusra, 12, 60)}}>
      <div style={{padding: '70px 30px 0', display: 'flex', alignItems: 'center', gap: 16}}><AppGlyph size={64} /><div style={{fontSize: 32, fontWeight: 800, color: '#fff', ...LAT}}>Driver Plans</div></div>
      <div style={{margin: '36px 30px 0', borderRadius: 34, background: `linear-gradient(135deg, ${Y}, #FFE38A)`, padding: '34px 34px 30px', ...popS(F, T.monthly - 0.2, 12)}}>
        <div style={{display: 'flex', alignItems: 'center'}}><div style={{fontSize: 34, fontWeight: 800, color: BG, ...LAT}}>Driver Pro</div><div style={{flex: 1}} /><div style={{background: BG, color: '#fff', borderRadius: 999, padding: '8px 18px 4px', fontSize: 22, fontWeight: 700, ...LAT}}>MONTHLY</div></div>
        <div style={{fontSize: 100, fontWeight: 800, color: BG, ...LAT, lineHeight: 1.1, marginTop: 10}}>₹999<span style={{fontSize: 36}}>/month</span></div>
        {['Unlimited trip requests', 'Priority bookings'].map((t) => <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 28, fontWeight: 600, color: BG, ...LAT}}><Tick size={34} color="#15803D" />{t}</div>)}
      </div>
      <div style={{margin: '34px 30px 0', fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', ...LAT}}>PAY WITH UPI</div>
      <div style={{margin: '18px 30px 0'}}><PayRow F={F} t={T.subs - 0.3} /></div>
      <div style={{margin: '30px 30px 0', height: 110, borderRadius: 28, background: F >= s(T.subs + 0.4) ? C_GREEN : APP_C, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 6, fontSize: 40, fontWeight: 800, color: '#fff', ...LAT}}>
        {F >= s(T.subs + 0.4) ? <><Tick size={46} color="#15803D" />Subscribed</> : 'Subscribe'}
      </div>
    </PhoneL>
  </AbsoluteFill>
);

/* ---------- 14. 3: monthly contracts ---------- */
const Contracts = ({F}) => {
  const CL = [['हार्डवेअर दुकानं', <Shop size={90} />, T.hw, 90, 980], ['व्यापारी', <Sacks size={90} />, T.vyapari, 400, 1080], ['APMC मार्केट', <Ico d={I_CHART} size={70} color={C_GREEN} sw={2.4} />, T.apmc, 690, 980]];
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 270), ...up(F, 41.0, 10, 20)}}><StepTag n="3">Monthly Contracts</StepTag></div>
      <Glass x={220} y={380} w={640} h={560} r={36} style={{padding: '44px 50px', transform: `rotate(-2deg)`, ...up(F, T.tisra, 12, 60)}}>
        <div style={{fontSize: 44, fontWeight: 800, color: TXT, ...LAT}}>Monthly Contract</div>
        <div style={{fontSize: 26, color: MUTED, ...LAT, marginTop: 6}}>Transport services · 12 months</div>
        {[90, 70, 84, 60, 76].map((w, i) => <div key={i} style={{height: 16, borderRadius: 8, background: 'rgba(0,0,0,0.08)', width: `${w}%`, marginTop: 24}} />)}
        <svg viewBox="0 0 300 80" width="260" height="70" style={{marginTop: 30}}><path d="M10 60 C40 10 60 70 90 40 S140 20 160 50 S220 30 290 40" fill="none" stroke={APP_C} strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(T.contract) - 14, s(T.contract))} /></svg>
      </Glass>
      <div style={{...abs(560, 760), ...popS(F, T.contract, 8)}}>
        <div style={{transform: 'rotate(-12deg)', border: `8px solid ${C_GREEN}`, borderRadius: 24, padding: '14px 30px 6px', fontSize: 64, fontWeight: 800, color: C_GREEN, background: 'rgba(255,255,255,0.85)', ...LAT}}>SIGNED</div>
      </div>
      {CL.map(([n, ico, t, x, y]) => (
        <div key={n} style={{...abs(x, y), ...popS(F, t - 0.15, 10)}}>
          <div style={{width: 300, borderRadius: 32, background: '#fff', boxShadow: '0 16px 40px rgba(60,45,10,0.13)', padding: '22px 10px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <div style={{height: 100, display: 'flex', alignItems: 'center'}}>{ico}</div><div style={{fontSize: 36, fontWeight: 700, color: TXT, whiteSpace: 'nowrap', ...LAT}}>{n}</div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 15. Example: 100 trips x Rs 100 ---------- */
const Example = ({F}) => {
  const trips = Math.round(io(F, s(T.trips) - 14, s(T.trips) + 4, 0, 100));
  const rs = Math.round(io(F, s(T.rs100) - 12, s(T.rs100) + 4, 0, 100));
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 270), ...up(F, T.ex, 10, 20)}}><Chip color={C_BLUE} size={36}>उदाहरण</Chip></div>
      <Glass x={110} y={380} w={860} h={380} r={44} style={{padding: '40px 46px', ...up(F, T.ex + 0.4, 12, 50)}}>
        <div style={{fontSize: 34, fontWeight: 600, color: MUTED}}>रोजच्या ट्रिप्स</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}><Big size={170}>{trips}</Big><div style={{display: 'flex', gap: 6, flexWrap: 'wrap', width: 420}}>{Array.from({length: 20}).map((_, i) => <div key={i} style={{width: 34, height: 34, borderRadius: 10, background: i < trips / 5 ? APP_C : 'rgba(0,0,0,0.06)'}} />)}</div></div>
      </Glass>
      <div style={{...abs(0, 790), width: 1080, textAlign: 'center', fontSize: 110, fontWeight: 800, color: GOLD_T, ...popS(F, T.rs100 - 0.6)}}>×</div>
      <Glass x={110} y={930} w={860} h={330} r={44} style={{padding: '40px 46px', ...up(F, 49.6, 12, 50)}}>
        <div style={{fontSize: 34, fontWeight: 600, color: MUTED}}>एका ट्रिपमागे</div>
        <Big size={170}>₹{rs}</Big>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 16. ~Rs 3 lakh revenue a month ---------- */
const Revenue = ({F}) => {
  const v = io(F, s(T.lakh3) - 10, s(T.rev), 0, 300000, Easing.out(Easing.cubic));
  const bars = Array.from({length: 30}).map((_, i) => 0.35 + 0.65 * ((i * 37) % 11) / 10);
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 280), display: 'flex', alignItems: 'center', gap: 16, fontSize: 52, fontWeight: 700, color: TXT, ...LAT, ...up(F, 51.6, 10, 20)}}>
        <span>₹100 × 100 × </span><span style={{color: GOLD_T}}>30 दिवस</span>
      </div>
      <Glass x={90} y={400} w={900} h={860} r={44} style={{padding: '46px 50px'}}>
        <div style={{fontSize: 30, fontWeight: 700, color: MUTED, letterSpacing: '0.1em'}}>MONTHLY REVENUE</div>
        <div style={{fontSize: 150, fontWeight: 800, color: TXT, ...LAT, lineHeight: 1.15, marginTop: 10}}><Marker F={F} t={T.rev}>{inr(v)}</Marker></div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 8, height: 340, marginTop: 50, borderBottom: `2px solid ${LINE}`}}>
          {bars.map((h, i) => <div key={i} style={{flex: 1, height: `${h * 100 * io(F, s(52.0) + i, s(52.0) + i + 8)}%`, borderRadius: '8px 8px 0 0', background: i % 7 === 6 ? Y : '#DCE6FF'}} />)}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 24, color: MUTED, ...LAT}}><span>Day 1</span><span>Day 30</span></div>
      </Glass>
      <div style={{...abs(600, 1200), ...popS(F, T.rev + 0.2, 9)}}><div style={{transform: 'rotate(-3deg)'}}><Chip color={C_GREEN} size={40} style={{background: '#fff'}}>≈ ३ लाख / महिना</Chip></div></div>
    </AbsoluteFill>
  );
};

/* ---------- 17. App cost from Rs 2 lakh ---------- */
const Cost = ({F}) => {
  const sw = Math.sin((F - s(55.42)) / 7) * 6 * io(F, s(55.42), s(58.6), 1, 0.3);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{...abs(0, 0)}}><path d="M540 250 L540 420" stroke={INKC} strokeWidth="5" /><circle cx="540" cy="250" r="12" fill={INKC} /></svg>
      <div style={{...abs(170, 400), transformOrigin: '50% 0%', transform: `rotate(${sw}deg)`, ...up(F, 55.45, 12, -60)}}>
        <div style={{width: 740, height: 760, borderRadius: 60, background: '#fff', boxShadow: '0 40px 80px rgba(60,45,10,0.2)', border: `4px solid ${LINE}`, position: 'relative', padding: '120px 60px 40px', boxSizing: 'border-box', textAlign: 'center'}}>
          <div style={{...abs(340, 30), width: 60, height: 60, borderRadius: 30, background: '#F7F3EA', border: `5px solid ${LINE}`}} />
          <div style={{display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center'}}><AppGlyph size={90} /><div style={{fontSize: 46, fontWeight: 800, color: TXT}}>तुमचं Tempo App</div></div>
          <div style={{fontSize: 40, fontWeight: 600, color: MUTED, marginTop: 50}}>App बनवण्याचा खर्च</div>
          <div style={{fontSize: 170, fontWeight: 800, color: TXT, ...LAT, lineHeight: 1.1, marginTop: 10, ...popS(F, T.lakh2 - 0.1, 10)}}><Marker F={F} t={T.lakh2 + 0.3}>₹२ लाख</Marker></div>
          <div style={{fontSize: 56, fontWeight: 700, color: GOLD_T, marginTop: 34, ...up(F, 57.6, 10, 20)}}>पासून सुरू</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 18. Your app goes live ---------- */
const Launch = ({F}) => {
  const inst = io(F, s(T.banvun) - 6, s(T.business) + 6, 0, 1, Easing.inOut(Easing.cubic));
  const live = F >= s(T.suru);
  return (
    <AbsoluteFill>
      <PhoneL x={190} y={260} w={700} h={1040}>
        <div style={{padding: '90px 40px 0', display: 'flex', gap: 28, alignItems: 'center'}}>
          <AppGlyph size={180} /><div><div style={{fontSize: 46, fontWeight: 800, color: INKC}}>तुमचं Tempo App</div><div style={{fontSize: 26, color: '#8a8478', ...LAT}}>Tempo booking · Your city</div>
            <div style={{display: 'flex', gap: 4, marginTop: 10}}>{[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="0 0 24 24" width="30" height="30"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill={Y} /></svg>)}</div></div>
        </div>
        <div style={{margin: '50px 40px 0', height: 110, borderRadius: 28, background: live ? C_GREEN : '#E9EEF9', position: 'relative', overflow: 'hidden'}}>
          {!live && <div style={{...abs(0, 0), height: 110, width: `${inst * 100}%`, background: APP_C}} />}
          <div style={{position: 'relative', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 6, fontSize: 40, fontWeight: 800, color: live || inst > 0.5 ? '#fff' : APP_C, ...LAT}}>{live ? <><Tick size={46} color="#15803D" />Live</> : inst > 0 ? `Installing ${Math.round(inst * 100)}%` : 'Install'}</div>
        </div>
        <div style={{display: 'flex', gap: 16, margin: '50px 40px 0'}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 380, borderRadius: 26, background: ['#EEF3FF', '#FFF4D6', '#E8F7EE'][i], overflow: 'hidden'}}>{i === 0 && <CityMap w={190} h={380} p={0.8} />}</div>)}</div>
      </PhoneL>
      <div style={{...abs(60, 1090), ...popS(F, 58.7, 11)}}><div style={{transform: 'rotate(-4deg)'}}><StoreBadge kind="play" size={60} /></div></div>
      <div style={{...abs(640, 1110), ...popS(F, 58.9, 11)}}><div style={{transform: 'rotate(4deg)'}}><StoreBadge kind="app" size={60} /></div></div>
    </AbsoluteFill>
  );
};

/* ---------- 19. DM Outgrid Labs ---------- */
const MSG = 'Hi, मला Tempo App बनवायचंय';
const Dm = ({F}) => {
  const sent = T.dm + 0.15;
  const typed = MSG.slice(0, Math.floor(io(F, s(62.0) + 4, s(sent) - 2, 0, MSG.length, Easing.linear)));
  return (
    <AbsoluteFill>
      <Glass x={90} y={260} w={900} h={1020} r={44} style={{padding: 0, overflow: 'hidden', ...up(F, 62.0, 10, 60)}}>
        <div style={{padding: '40px 40px 30px', display: 'flex', alignItems: 'center', gap: 26, borderBottom: `1.5px solid ${LINE}`}}>
          <div style={{width: 150, height: 150, borderRadius: 75, padding: 6, background: 'linear-gradient(45deg, #fdf497, #fd5949, #d6249f, #285AEB)'}}>
            <div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #fff', boxSizing: 'border-box'}}><Mark size={74} color="#fff" /></div>
          </div>
          <div style={{flex: 1}}><div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>outgridlabs</div><div style={{fontSize: 26, color: MUTED, ...LAT}}>Apps · Websites · Automation</div></div>
          <Instagram size={70} />
        </div>
        <div style={{padding: '30px 40px', display: 'flex', gap: 18}}>
          <div style={{flex: 1, height: 80, borderRadius: 18, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: TXT}}>Following</div>
          <div style={{flex: 1, height: 80, borderRadius: 18, background: '#0095F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: '#fff'}}>Message</div>
        </div>
        <div style={{...abs(40, 640), right: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
          {F >= s(sent) && <div style={{background: '#3797F0', color: '#fff', borderRadius: '28px 28px 8px 28px', padding: '18px 26px 12px', fontSize: 36, fontWeight: 500, transform: `scale(${pop(F, sent, 12)})`, transformOrigin: '100% 100%'}}>{MSG}</div>}
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 100, borderRadius: 50, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '6px 30px 0', fontSize: 32, fontWeight: 500, color: TXT, ...LAT}}>
          {F < s(sent) ? <>{typed}<span style={{color: '#0095F6', opacity: Math.floor(F / 8) % 2}}>|</span></> : <span style={{color: MUTED}}>Message…</span>}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => <LeanOutro F={F} at={OUTRO_AT} cta="DM करा" />;

/* ---------- main ---------- */
const COMPS = {hook: Hook, customers: Customers, drivers: Drivers, connect: Connect, book: Book, job: Job, three: Three, devices: Devices, fleet: Fleet, city: City,
  kamai: Kamai, commission: Commission, subs: Subs, contracts: Contracts, example: Example, revenue: Revenue, cost: Cost, launch: Launch, dm: Dm, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
