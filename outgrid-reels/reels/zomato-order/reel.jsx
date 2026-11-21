/*
 * How Zomato earns from one ₹300 order — Outgrid Labs reel, LEAN light style, 1080x1920. VO at original speed.
 * Real logo: Zomato wordmark (simple-icons, zomato.js). Food, store, rider, app screens are vector illustrations;
 * the order items (Biryani ₹240 + Gulab Jamun ₹60) and restaurant names in the feed are illustrative.
 * No hook headline: captions run from frame 0 (user feedback), the hook is a pure visual (checkout -> coins -> Zomato).
 * Captions: captions.js from align_whisper.py; every cue is a real spoken word time (cues.mjs / timing.mjs via make_timing.py).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark} from '../../shared/kit.jsx';
import {BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_RED, LAT, up, Glass, Chip, Ico, I_PIN, I_PHONE, Instagram, LeanOutro, LeanVideo} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';
import {Z_D} from './zlogo.js';
import {C, K, SCENES, OUTRO_AT} from './cues.mjs';

const TOTAL = s(OUTRO_AT + 3.4);
const CHUNKS = CAPS;

/* ---------- helpers ---------- */
const ZR = '#E23744', ZR_D = '#B91E32', INK = '#1F1F1F', CREAM2 = '#EDE6D8';
const inr = (n) => Math.round(n).toLocaleString('en-IN');
const cnt = (F, a, b, v0, v1) => io(F, s(a), s(b), v0, v1, Easing.out(Easing.cubic));
const popS = (F, t, d = 11) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const shake = (F, t, amp = 14, d = 10) => {
  const k = F - s(t);
  if (k < 0 || k > d) return 'none';
  const a = amp * (1 - k / d);
  return `translate(${Math.sin(k * 2.9) * a}px, ${Math.cos(k * 3.7) * a * 0.6}px)`;
};
const Marker = ({F, t, children, color = Y}) => (
  <span style={{background: `linear-gradient(transparent 62%, ${color} 62%, ${color} 92%, transparent 92%) no-repeat left / ${io(F, s(t), s(t) + 8) * 100}% 100%`, padding: '0 6px'}}>{children}</span>
);
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const Rings = ({F, t, x, y, color = Y, r = 160}) => F < s(t) ? null : (
  <>{[0, 12].map((d) => { const p = io(F, s(t) + d, s(t) + d + 24); return <div key={d} style={{...abs(x - r, y - r), width: 2 * r, height: 2 * r, borderRadius: '50%', border: `5px solid ${color}`, opacity: 1 - p, transform: `scale(${0.5 + p})`}} />; })}</>
);

/* ---------- Zomato (real wordmark) ---------- */
const ZWord = ({w: W = 300, color = ZR}) => <svg viewBox="0 9.7 24 4.8" width={W} height={W * 0.2} style={{display: 'block', overflow: 'visible'}}><path d={Z_D} fill={color} /></svg>;
const ZIcon = ({size = 160, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: ZR, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 ${size * 0.12}px ${size * 0.3}px ${ZR}55`, ...style}}>
    <ZWord w={size * 0.8} color="#fff" />
  </div>
);
const Num = ({F, t, n, label, x = 80, y = 230}) => (
  <div style={{...abs(x, y), display: 'flex', alignItems: 'center', gap: 26}}>
    <div style={{width: 124, height: 124, borderRadius: 62, background: ZR, color: '#fff', fontSize: 84, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 12, boxSizing: 'border-box', boxShadow: `0 16px 40px ${ZR}55`, ...popS(F, t, 10)}}>{n}</div>
    {label && <div style={{fontSize: 46, fontWeight: 700, color: TXT, ...up(F, t + 0.1, 10, 16)}}>{label}</div>}
  </div>
);

/* ---------- vectors ---------- */
const Coin = ({size = 70}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{display: 'block'}}>
    <circle cx="20" cy="20" r="18" fill="#F5B301" stroke="#B77F00" strokeWidth="2.6" /><circle cx="20" cy="20" r="12.5" fill="none" stroke="#FFD95A" strokeWidth="2" />
    <text x="20" y="27.5" textAnchor="middle" fontSize="18" fontWeight="800" fill="#8A5A00" fontFamily="Anek, sans-serif">₹</text>
  </svg>
);
const Biryani = ({size = 120}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <path d="M16 54c2-20 18-32 34-32s32 12 34 32z" fill="#F4C35A" />
    {[[30, 44], [42, 34], [56, 36], [66, 46], [48, 48], [38, 50], [60, 52], [52, 28]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3.2" ry="1.6" fill={i % 3 ? '#FFF6DD' : '#D9822B'} transform={`rotate(${i * 40} ${x} ${y})`} />)}
    <path d="M58 30c6-8 14-8 16-4-6 0-10 2-16 4z" fill="#3FA34D" />
    <path d="M10 54h80c0 20-18 32-40 32S10 74 10 54z" fill="#A0522D" /><path d="M10 54h80" stroke="#7A3B1E" strokeWidth="5" strokeLinecap="round" />
    <path d="M24 66c10 6 42 6 52 0" stroke="#C2703F" strokeWidth="3" fill="none" />
  </svg>
);
const Jamun = ({size = 120}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <path d="M12 52h76c0 18-16 32-38 32S12 70 12 52z" fill="#F2F2F2" stroke="#D0CCC2" strokeWidth="3" />
    <ellipse cx="50" cy="52" rx="38" ry="9" fill="#E9A23B" />
    {[[36, 46], [52, 42], [64, 48]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill="#7B2D12" /><circle cx={x - 4} cy={y - 4} r="3" fill="#B45A2E" /></g>)}
  </svg>
);
const Burger = ({size = 120}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <path d="M18 46c0-16 14-24 32-24s32 8 32 24z" fill="#E7A33E" />{[[36, 32], [50, 28], [62, 34]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.4" fill="#FFF3D6" />)}
    <path d="M14 50h72l-6 8H20z" fill="#5CB85C" /><rect x="16" y="56" width="68" height="10" rx="4" fill="#6B3A22" /><path d="M16 66h68l-4 6H20z" fill="#F2C230" />
    <path d="M18 72h64c0 8-6 12-14 12H32c-8 0-14-4-14-12z" fill="#E7A33E" />
  </svg>
);
const Pizza = ({size = 120}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <path d="M50 88 14 24c22-12 50-12 72 0z" fill="#F6C65B" /><path d="M14 24c22-12 50-12 72 0l-4 8c-20-10-44-10-64 0z" fill="#C9822F" />
    {[[40, 40], [58, 44], [48, 58], [52, 72]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill="#D9442E" />)}
  </svg>
);
const Thali = ({size = 120}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <circle cx="50" cy="52" r="38" fill="#D8D8D8" /><circle cx="50" cy="52" r="32" fill="#EFEFEF" />
    {[[36, 40, '#F2B233'], [62, 38, '#7FB24A'], [66, 62, '#C0532B']].map(([x, y, c], i) => <circle key={i} cx={x} cy={y} r="10" fill={c} stroke="#CFCFCF" strokeWidth="2" />)}
    <ellipse cx="40" cy="64" rx="13" ry="8" fill="#FFF8E8" />
  </svg>
);
const FoodTile = ({Food, size = 130, bg = '#FFF1DC'}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.22, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Food size={size * 0.86} /></div>
);
const Store = ({W = 700, F}) => ( // restaurant front, Zomato sticker on the window
  <svg viewBox="0 0 200 172" width={W} height={W * 0.86} style={{display: 'block', overflow: 'visible'}}>
    <ellipse cx="100" cy="168" rx="96" ry="5" fill="rgba(0,0,0,0.10)" />
    <rect x="16" y="44" width="168" height="122" fill="#FFFDF8" stroke={INK} strokeWidth="3.5" />
    <rect x="8" y="6" width="184" height="22" rx="4" fill={INK} />
    <text x="100" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Anek, sans-serif" letterSpacing="2">RESTAURANT</text>
    {Array.from({length: 9}, (_, i) => <g key={i}><rect x={10 + i * 20} y="28" width="20" height="16" fill={i % 2 ? '#fff' : ZR} /><circle cx={20 + i * 20} cy="44" r="10" fill={i % 2 ? '#fff' : ZR} /></g>)}
    <path d="M10 28h180" stroke={INK} strokeWidth="3" />
    <rect x="28" y="76" width="86" height="62" rx="4" fill="#CFE8F5" stroke={INK} strokeWidth="3" />
    <path d="M40 86l14-6M40 98l26-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <rect x="128" y="76" width="44" height="90" rx="3" fill="#F3E2C4" stroke={INK} strokeWidth="3" /><circle cx="162" cy="122" r="3" fill={INK} />
    <g transform={`translate(64 112) scale(${F === undefined ? 1 : 1})`}><rect x="0" y="0" width="44" height="20" rx="4" fill={ZR} /><g transform="translate(4 4.4) scale(1.5)"><path d={Z_D} fill="#fff" transform="translate(0 -9.7)" /></g></g>
  </svg>
);
const Scooter = ({W = 260}) => (
  <svg viewBox="0 0 130 100" width={W} height={W * 0.77} style={{display: 'block', overflow: 'visible'}}>
    <rect x="6" y="20" width="40" height="36" rx="5" fill={ZR} stroke={INK} strokeWidth="3" /><path d="M14 30h24" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 60h56l12-22h10" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 62c0-8 8-10 20-10h40c8 0 14 4 16 10z" fill="#F2F2F2" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="70" cy="22" r="10" fill={ZR} stroke={INK} strokeWidth="3" /><path d="M64 34c-6 4-8 12-6 20h18l8-12" fill="#3B3B3B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    {[30, 104].map((x) => <g key={x}><circle cx={x} cy="76" r="14" fill={INK} /><circle cx={x} cy="76" r="5" fill="#ccc" /></g>)}
  </svg>
);
const Glyph = ({d, size = 120, color = ZR, sw = 1.9}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block'}}>{d}</svg>
);
const G_PERSON = <><circle cx="12" cy="7" r="3.6" /><path d="M5 21c0-4.4 3.1-7 7-7s7 2.6 7 7" /></>;
const G_TAG = <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.4" /><path d="M10 16l6-6" /></>;
const G_SERVER = <><rect x="4" y="4" width="16" height="6" rx="1.5" /><rect x="4" y="14" width="16" height="6" rx="1.5" /><path d="M8 7h.01M8 17h.01M12 10v4" /></>;
const G_MEGA = <><path d="M3 10v4h3l7 4V6L6 10z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>;
const G_CASH = <><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.8" /><path d="M6 9.5v5M18 9.5v5" /></>;
const G_UPI = <><path d="M7 4l-3 16M13 4l-3 16" /><path d="M16 8l4 4-4 4" /></>;
const G_CARD = <><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19M6 15h4" /></>;
const G_BAG = <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>;

/* flying coins: from [x0,y0] to [x1,y1] on an arc, staggered */
const Fly = ({F, t, from: [x0, y0], to: [x1, y1], n = 6, size = 64, gap = 3, dur = 15, arc = 180}) => (
  <>{Array.from({length: n}, (_, i) => {
    const a = s(t) + i * gap;
    if (F < a) return null;
    const p = io(F, a, a + dur, 0, 1, Easing.inOut(Easing.quad));
    if (p >= 1) return null;
    const x = x0 + (x1 - x0) * p + (i % 2 ? 1 : -1) * 30 * Math.sin(p * Math.PI), y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * arc;
    return <div key={i} style={{...abs(x - size / 2, y - size / 2), transform: `scale(${1 - 0.35 * p}) rotate(${p * 300}deg)`}}><Coin size={size} /></div>;
  })}</>
);
const PhoneL = ({x, y, w: W, h, children, style = {}}) => (
  <div style={{...abs(x, y), width: W, height: h, borderRadius: W * 0.12, background: '#1d1d1f', padding: 12, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.26)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: W * 0.1, overflow: 'hidden', background: '#fff', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 14), marginLeft: -50, width: 100, height: 28, borderRadius: 14, background: '#1d1d1f'}} />
    </div>
  </div>
);
const Bar = ({w: W, h = 22, c = 'rgba(0,0,0,0.08)'}) => <div style={{width: W, height: h, borderRadius: h / 2, background: c}} />;

/* ================= scenes ================= */

/* 1. hook: a real-looking ₹300 checkout, tap Place Order, the money flies to Zomato (no headline) */
const Hook = ({F}) => {
  const press = F >= s(K.order) - 3 && F < s(K.order) + 4 ? 0.94 : 1;
  const placed = F >= s(K.order) + 4;
  const ph = io(F, s(K.kiti) - 4, s(K.kiti) + 10, 0, 1, Easing.inOut(Easing.cubic)); // phone eases down-left to make room
  const scr = Math.floor(F / 3);
  return (
    <AbsoluteFill style={{transform: shake(F, K.dhakka, 18, 12)}}>
      <PhoneL x={250 - 90 * ph} y={200 + 40 * ph} w={580} h={1150} style={{transform: `scale(${1 - 0.08 * ph}) rotate(${-3 * ph}deg)`, transformOrigin: '50% 100%'}}>
        <div style={{padding: '78px 40px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><ZWord w={210} /><div style={{fontSize: 28, fontWeight: 600, color: '#888', ...LAT}}>Checkout</div></div>
          {[[Biryani, 'Chicken Biryani', 240, '#FFF1DC'], [Jamun, 'Gulab Jamun', 60, '#FCE9E2']].map(([Fd, name, p, bg], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: i ? 30 : 56}}>
              <FoodTile Food={Fd} size={130} bg={bg} />
              <div style={{flex: 1}}><div style={{fontSize: 34, fontWeight: 700, color: INK, ...LAT}}>{name}</div><div style={{fontSize: 26, color: '#888', marginTop: 4, ...LAT}}>× 1</div></div>
              <div style={{fontSize: 36, fontWeight: 700, color: INK, ...LAT}}>₹{p}</div>
            </div>
          ))}
          <div style={{height: 2, background: '#eee', margin: '44px 0 30px'}} />
          {[0, 1].map((i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginTop: i ? 20 : 0}}><Bar w={[220, 170][i]} /><Bar w={70} /></div>)}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 40}}>
            <div style={{fontSize: 36, fontWeight: 700, color: INK, ...LAT}}>To pay</div>
            <div style={{fontSize: 64, fontWeight: 800, color: INK, ...LAT}}>₹300</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 50, height: 120, borderRadius: 26, background: placed ? C_GREEN : ZR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          fontSize: 40, fontWeight: 700, paddingTop: 8, boxSizing: 'border-box', transform: `scale(${press})`, boxShadow: `0 16px 34px ${placed ? C_GREEN : ZR}55`, ...LAT}}>
          {placed ? <>Order placed <svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: -8}}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></> : 'Place Order · ₹300'}
        </div>
        {F >= s(K.order) - 3 && F < s(K.order) + 10 && <div style={{position: 'absolute', left: 250, bottom: 90, width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.6)', transform: `scale(${io(F, s(K.order) - 3, s(K.order) + 10, 0.4, 2.2)})`, opacity: io(F, s(K.order) - 3, s(K.order) + 10, 1, 0)}} />}
      </PhoneL>
      {/* Zomato collects: the coins leave the order */}
      <div style={{...abs(760, 250), ...popS(F, K.kiti - 0.1, 10)}}><ZIcon size={210} /></div>
      <Fly F={F} t={K.kiti + 0.05} from={[420, 1000]} to={[865, 355]} n={8} gap={3} size={72} />
      <div style={{...abs(720, 500), ...popS(F, K.paise1, 10)}}>
        <div style={{background: '#fff', borderRadius: 24, padding: '20px 30px 10px', fontSize: 64, fontWeight: 800, color: ZR, boxShadow: '0 20px 50px rgba(60,45,10,0.18)', minWidth: 230, textAlign: 'center', ...LAT}}>
          ₹{F < s(K.dhakka) ? String(10 + ((scr * 37) % 89)) : '??'}
        </div>
      </div>
      <Rings F={F} t={K.dhakka} x={865} y={355} color={ZR} r={150} />
    </AbsoluteFill>
  );
};

/* 2. money #1: the restaurant */
const First = ({F}) => (
  <AbsoluteFill>
    <Num F={F} t={K.pahila - 0.05} n="1" label="Restaurant" />
    <div style={{...abs(170, 460), ...up(F, K.rest - 0.15, 14, 80)}}><Store W={740} /></div>
    <Rings F={F} t={K.rest + 0.2} x={540} y={940} color={ZR} r={120} />
  </AbsoluteFill>
);

/* 3. 20-30% commission on every order */
const Donut = ({r = 240, sw = 96, a = 0, b = 0}) => {
  const Cc = 2 * Math.PI * r, S = 2 * r + sw;
  const ring = (frac, color) => <circle cx={S / 2} cy={S / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${frac * Cc} ${Cc}`} transform={`rotate(-90 ${S / 2} ${S / 2})`} />;
  return <svg width={S} height={S} style={{display: 'block'}}>{ring(1, CREAM2)}{ring(b, '#F49AA6')}{ring(a, ZR)}</svg>;
};
const Comm = ({F}) => {
  const a = C(4), da = cnt(F, K.p20 - 0.1, K.p20 + 0.4, 0, 0.2), db = Math.max(da, cnt(F, K.p30 - 0.1, K.p30 + 0.4, 0.2, 0.3) * (F >= s(K.p30) - 3 ? 1 : 0));
  const dash = io(F, s(K.rest2) - 4, s(K.rest2) + 10);
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 240), display: 'flex', alignItems: 'center', gap: 26, ...up(F, a, 12, 30)}}>
        <div style={{width: 170, height: 170, borderRadius: 40, background: '#fff', boxShadow: '0 20px 50px rgba(60,45,10,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Store W={130} /></div>
        <svg width={420} height={40}><path d="M10 20h390" stroke={ZR} strokeWidth="6" strokeDasharray="18 14" strokeDashoffset={-F * 2} strokeLinecap="round" style={{clipPath: `inset(0 ${(1 - dash) * 100}% 0 0)`}} /><path d="M396 8l16 12-16 12" fill="none" stroke={ZR} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={dash} /></svg>
        <ZIcon size={170} />
      </div>
      <div style={{...abs(540 - 288, 540)}}><Donut a={da} b={db} /></div>
      <Center y={790}>
        <Big size={120}>{F < s(K.p30) - 3 ? `${Math.round(da * 100)}%` : <Marker F={F} t={K.p30 + 0.2}>20–30%</Marker>}</Big>
      </Center>
      <Center y={1240} style={popS(F, K.comm, 10)}><Chip color={ZR} size={40}>Commission</Chip></Center>
    </AbsoluteFill>
  );
};

/* 4. ₹300 order -> ₹60 to ₹90 */
const Amt = ({F}) => {
  const a = C(6), W = 900;
  const seg = F < s(K.r60) - 3 ? 0 : F < s(K.r90) - 3 ? cnt(F, K.r60 - 0.1, K.r60 + 0.35, 0, 60) : cnt(F, K.r90 - 0.1, K.r90 + 0.35, 60, 90);
  return (
    <AbsoluteFill>
      <div style={{...abs(435, 230), ...popS(F, a, 11)}}><ZIcon size={210} /></div>
      <Fly F={F} t={K.r60} from={[900, 820]} to={[540, 335]} n={5} gap={3} size={66} arc={120} />
      <Fly F={F} t={K.r90} from={[860, 820]} to={[540, 335]} n={5} gap={3} size={66} arc={120} />
      <div style={{...abs(90, 640), ...up(F, K.r300b - 0.15, 12, 30)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20}}>
          <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>Order</div><div style={{fontSize: 64, fontWeight: 800, color: TXT, ...LAT}}>₹300</div>
        </div>
        <div style={{width: W, height: 130, borderRadius: 30, background: CREAM2, overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'}}>
          <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: (seg / 300) * W, background: `repeating-linear-gradient(-45deg, ${ZR}, ${ZR} 22px, ${ZR_D} 22px, ${ZR_D} 44px)`}} />
          <div style={{position: 'absolute', left: 36, top: 44, fontSize: 40, fontWeight: 600, color: MUTED, ...LAT}}>Restaurant</div>
        </div>
      </div>
      <Center y={980} style={{opacity: F < s(K.r60) - 3 ? 0 : 1}}>
        <Big size={130} color={ZR}>{F < s(K.r90) - 3 ? `₹${inr(seg)}` : <Marker F={F} t={K.r90 + 0.25}>₹60–90</Marker>}</Big>
        <div style={{marginTop: 22, fontSize: 40, fontWeight: 600, color: MUTED, ...LAT, ...up(F, K.r60 + 0.2, 10, 14)}}>Zomato कडे</div>
      </Center>
    </AbsoluteFill>
  );
};

/* 5. money #2: you — the platform fee on your bill */
const BillPhone = ({F}) => {
  const hi = io(F, s(K.pfee) - 4, s(K.pfee) + 6);
  return (
    <Glass x={130} y={430} w={820} h={880} r={44} style={{padding: '46px 50px 0', boxSizing: 'border-box', ...up(F, K.bill - 0.2, 12, 50)}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>Bill details</div><ZWord w={170} /></div>
      <div style={{height: 2, background: LINE, margin: '30px 0 16px'}} />
      {[['Item total', '₹300'], ['Delivery fee', null], ['Taxes', null], ['Platform fee', 'fee']].map(([k, v], i) => {
        const isFee = v === 'fee';
        return (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 22px 16px', margin: '0 -22px', borderRadius: 22,
            background: isFee ? `rgba(255,197,46,${0.32 * hi})` : 'transparent', transform: isFee ? `scale(${1 + 0.04 * hi})` : 'none'}}>
            <div style={{fontSize: 40, fontWeight: isFee ? 700 : 500, color: isFee ? TXT : MUTED, ...LAT}}>{k}</div>
            {isFee ? <div style={{fontSize: 48, fontWeight: 800, color: ZR, ...LAT, ...popS(F, K.r15 - 0.05, 10)}}>₹15</div>
              : v ? <div style={{fontSize: 40, fontWeight: 600, color: TXT, ...LAT}}>{v}</div> : <Bar w={90} h={20} />}
          </div>
        );
      })}
      <div style={{height: 2, background: LINE, margin: '22px 0 26px'}} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}><div style={{fontSize: 42, fontWeight: 700, color: TXT, ...LAT}}>To pay</div><Bar w={140} h={28} /></div>
    </Glass>
  );
};
const Bill = ({F}) => (
  <AbsoluteFill>
    <Num F={F} t={K.dusra - 0.05} n="2" label="तुमच्याकडून" />
    <BillPhone F={F} />
    <Rings F={F} t={K.r15} x={810} y={937} color={ZR} r={110} />
  </AbsoluteFill>
);

/* 6. 2023: ₹2  ->  now: ₹15 */
const Y2023 = ({F}) => {
  const a = C(11), H = 640;
  const hNow = cnt(F, a, a + 0.5, 0, H), hOld = cnt(F, K.r2 - 0.1, K.r2 + 0.3, 0, (2 / 15) * H);
  const col = (h, c, top, label, show) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 280}}>
      <div style={{fontSize: 80, fontWeight: 800, color: c === ZR ? ZR : TXT, marginBottom: 18, opacity: show ? 1 : 0, ...LAT}}>{top}</div>
      <div style={{width: 220, height: h, borderRadius: '28px 28px 8px 8px', background: c}} />
      <div style={{marginTop: 22, fontSize: 46, fontWeight: 700, color: MUTED, ...LAT}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{...abs(170, 1260 - H - 120 - 100), width: 740, height: H + 220, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <div style={{opacity: io(F, s(K.y2023) - 4, s(K.y2023) + 4)}}>{col(hOld, '#BDB6A6', '₹2', '2023', F >= s(K.r2) - 2)}</div>
        {col(hNow, ZR, '₹15', 'आता', true)}
      </div>
      <div style={{...abs(400, 520), ...popS(F, K.r2 + 0.45, 10)}}>
        <div style={{transform: 'rotate(-6deg)', background: Y, color: BG, borderRadius: 20, padding: '16px 30px 8px', fontSize: 60, fontWeight: 800, boxShadow: '0 16px 40px rgba(255,197,46,0.45)', ...LAT}}>7.5×</div>
      </div>
    </AbsoluteFill>
  );
};

/* 7. money #3: ads — the top restaurants in the feed paid to be there */
const FEED = [[Biryani, 'Biryani House', '#FFF1DC'], [Burger, 'Burger Point', '#FFF4D6'], [Pizza, 'Pizza Corner', '#FDE8E2'], [Thali, 'Thali Express', '#EAF4E2']];
const Ads = ({F}) => {
  const a = C(12), ring = io(F, s(K.var) - 3, s(K.var) + 8);
  return (
    <AbsoluteFill>
      <Num F={F} t={K.tisra - 0.05} n="3" label="जाहिरात" />
      <PhoneL x={90} y={420} w={600} h={960} style={up(F, a + 0.3, 14, 70)}>
        <div style={{padding: '70px 32px 0'}}>
          <ZWord w={180} />
          <div style={{marginTop: 24, height: 70, borderRadius: 20, background: '#F3F3F3', display: 'flex', alignItems: 'center', padding: '0 24px'}}><Bar w={220} h={18} /></div>
          {FEED.map(([Fd, name, bg], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 24, padding: 12, margin: '22px -12px 0', borderRadius: 24,
              boxShadow: i < 2 ? `0 0 0 ${5 * ring}px ${Y}` : 'none', background: i < 2 ? `rgba(255,197,46,${0.14 * ring})` : 'transparent'}}>
              <FoodTile Food={Fd} size={130} bg={bg} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 32, fontWeight: 700, color: INK, ...LAT}}>{name}</div>
                <div style={{display: 'flex', gap: 10, marginTop: 10, alignItems: 'center'}}>
                  <div style={{background: '#24963F', color: '#fff', borderRadius: 8, padding: '4px 10px 0', fontSize: 22, fontWeight: 700}}>{['4.2', '4.0', '4.3', '4.1'][i]} ★</div><Bar w={110} h={16} />
                </div>
              </div>
              {i < 2 && <div style={{alignSelf: 'flex-start', background: Y, color: BG, borderRadius: 10, padding: '6px 14px 2px', fontSize: 24, fontWeight: 800, ...popS(F, K.var + i * 0.12, 10)}}>Ad</div>}
            </div>
          ))}
        </div>
      </PhoneL>
      <div style={{...abs(770, 520), ...popS(F, K.restos, 10)}}><ZIcon size={200} /></div>
      <Fly F={F} t={K.paise3} from={[560, 760]} to={[870, 620]} n={5} gap={3} size={62} arc={140} />
      <Fly F={F} t={K.paise3 + 0.25} from={[560, 940]} to={[870, 620]} n={5} gap={3} size={62} arc={140} />
    </AbsoluteFill>
  );
};

/* 8. cash on delivery -> a separate fee */
const Cod = ({F}) => {
  const a = C(15), sel = F >= s(K.cash) ? 2 : 0;
  return (
    <AbsoluteFill>
      <Glass x={110} y={300} w={860} h={760} r={44} style={{padding: '46px 46px 0', boxSizing: 'border-box', ...up(F, a, 12, 50)}}>
        <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>Payment</div>
        {[[G_UPI, 'UPI'], [G_CARD, 'Card'], [G_CASH, 'Cash on Delivery']].map(([g, k], i) => {
          const on = sel === i, p = i === 2 ? io(F, s(K.cash) - 2, s(K.cash) + 6) : 0;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 30, padding: '26px 28px', borderRadius: 28, border: `3px solid ${on ? ZR : LINE}`, background: i === 2 ? `rgba(226,55,68,${0.06 * p})` : 'transparent'}}>
              <Glyph d={g} size={64} color={on ? ZR : '#999'} />
              <div style={{flex: 1, fontSize: 42, fontWeight: 600, color: TXT, paddingTop: 6, ...LAT}}>{k}</div>
              <div style={{width: 46, height: 46, borderRadius: 23, border: `4px solid ${on ? ZR : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{on && <div style={{width: 24, height: 24, borderRadius: 12, background: ZR}} />}</div>
            </div>
          );
        })}
      </Glass>
      <Center y={1130} style={{...popS(F, K.fee2 - 0.05, 9)}}>
        <div style={{transform: shake(F, K.fee2, 10, 10), display: 'flex', alignItems: 'center', gap: 16, background: '#FFF1F1', border: `3px solid ${C_RED}`, color: '#C81E1E', borderRadius: 999, padding: '20px 40px 12px', fontSize: 48, fontWeight: 800, ...LAT}}>
          + COD fee
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* 9. total per order: ₹75 – ₹100+ */
const Total = ({F}) => {
  const a = C(17);
  const n = cnt(F, K.r75 - 0.15, K.r75 + 0.4, 0, 75);
  const src = [['Commission', '₹60–90', 70], ['Platform fee', '₹15', 395], ['Ads + COD', '+ ₹', 720]];
  return (
    <AbsoluteFill>
      <div style={{...abs(430, 250), ...popS(F, K.zk - 0.1, 10)}}><ZIcon size={220} /></div>
      {src.map(([k, v, x], i) => {
        const t0 = a + 0.1 + i * 0.12, fly = io(F, s(K.zk) + 2 + i * 3, s(K.zk) + 14 + i * 3, 0, 1, Easing.in(Easing.cubic));
        return (
          <div key={i} style={{...abs(x, 600), width: 290, opacity: (F < s(t0) ? 0 : 1) * (1 - fly), transform: `translate(${(540 - 145 - x) * fly}px, ${-260 * fly}px) scale(${1 - 0.6 * fly})`}}>
            <div style={{...popS(F, t0, 11), background: '#fff', borderRadius: 26, padding: '22px 10px 14px', textAlign: 'center', boxShadow: '0 16px 40px rgba(60,45,10,0.14)'}}>
              <div style={{fontSize: 58, fontWeight: 800, color: ZR, ...LAT}}>{v}</div><div style={{fontSize: 34, fontWeight: 600, color: MUTED, marginTop: 6, ...LAT}}>{k}</div>
            </div>
          </div>
        );
      })}
      <Center y={860} style={{opacity: F < s(K.r75) - 4 ? 0 : 1, transform: `scale(${0.7 + 0.3 * pop(F, K.r75 - 0.15, 10)})`}}>
        <Big size={140}>{F < s(K.r100) - 3 ? `₹${inr(n)}` : <Marker F={F} t={K.r100 + 0.2}>₹75–100+</Marker>}</Big>
        <div style={{marginTop: 24, fontSize: 42, fontWeight: 600, color: MUTED, ...LAT}}>एका order मागे</div>
      </Center>
    </AbsoluteFill>
  );
};

/* 10. but out of it: rider, offers, app costs -> a thin profit */
const Cost = ({F}) => {
  const a = C(19), W = 900;
  const cuts = [[K.rider, 0.45, Scooter, 'Rider'], [K.offers, 0.22, null, 'Offers'], [K.appc, 0.2, null, 'App']];
  let left = 1;
  const parts = cuts.map(([t, fr]) => { const p = io(F, s(t), s(t) + 10, 0, 1, Easing.inOut(Easing.cubic)); left -= fr * p; return p; });
  const prof = io(F, s(K.kharch) + 4, s(K.kharch) + 14);
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 360), ...up(F, a, 12, 30)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, width: W}}>
          <ZWord w={200} /><div style={{fontSize: 60, fontWeight: 800, color: TXT, ...LAT}}>₹100</div>
        </div>
        <div style={{width: W, height: 120, borderRadius: 30, background: CREAM2, overflow: 'hidden'}}>
          <div style={{width: left * W, height: '100%', background: prof > 0 ? C_GREEN : ZR, borderRadius: 30, transition: 'none'}} />
        </div>
      </div>
      <div style={{...abs(90, 680), width: W, display: 'flex', justifyContent: 'space-between'}}>
        {cuts.map(([t, fr, Vec, k], i) => (
          <div key={i} style={{width: 280, height: 360, borderRadius: 36, background: '#fff', boxShadow: '0 20px 50px rgba(60,45,10,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, ...popS(F, t - 0.1, 11)}}>
            {Vec ? <Vec W={210} /> : <Glyph d={i === 1 ? G_TAG : G_SERVER} size={150} color={i === 1 ? GOLD_T : '#3B82F6'} />}
            <div style={{fontSize: 42, fontWeight: 700, color: TXT, ...LAT}}>{k}</div>
            <div style={{fontSize: 64, fontWeight: 800, color: C_RED, lineHeight: 0.6, opacity: parts[i], ...LAT}}>−</div>
          </div>
        ))}
      </div>
      <Center y={1150} style={popS(F, K.kharch + 0.15, 10)}><Chip color={C_GREEN} size={44}>छोटा नफा</Chip></Center>
    </AbsoluteFill>
  );
};

/* 11. every day: lakhs of orders */
const Lakh = ({F}) => {
  const a = C(21), COLS = 9, ROWS = 9, N = COLS * ROWS;
  const shown = Math.floor(N * io(F, s(K.roj) - 4, s(K.lakho) + 14, 0, 1, Easing.in(Easing.quad)));
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 230), display: 'flex', alignItems: 'center', gap: 22, ...up(F, a, 12, 20)}}><ZIcon size={110} /><Chip color={ZR} size={38}>रोज</Chip></div>
      <div style={{...abs(105, 420), width: 870, display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 14}}>
        {Array.from({length: N}, (_, i) => {
          const on = i < shown;
          return <div key={i} style={{height: 84, borderRadius: 20, background: on ? ZR : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.7})`}}>{on && <Glyph d={G_BAG} size={48} color="#fff" sw={2.2} />}</div>;
        })}
      </div>
      <Center y={1290} style={popS(F, K.lakho + 0.2, 10)}><Big size={64}>लाखो orders</Big></Center>
    </AbsoluteFill>
  );
};

/* 12. small profit × lakhs of orders = crores */
const Eq = ({F}) => {
  const it = (t, node, label) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: 290, ...popS(F, t, 11)}}>
      <div style={{height: 280, display: 'flex', alignItems: 'center'}}>{node}</div>
      <div style={{fontSize: 46, fontWeight: 700, color: TXT, ...LAT}}>{label}</div>
    </div>
  );
  const op = (t, c) => <div style={{fontSize: 90, fontWeight: 800, color: MUTED, marginTop: -60, ...popS(F, t, 12)}}>{c}</div>;
  const grid = <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 54px)', gap: 9}}>{Array.from({length: 16}, (_, i) => <div key={i} style={{height: 54, borderRadius: 13, background: ZR}} />)}</div>;
  const pile = <div style={{position: 'relative', width: 240, height: 230}}>{[[0, 150], [60, 150], [120, 150], [30, 95], [90, 95], [60, 40]].map(([x, y], i) => <div key={i} style={{...abs(x, y)}}><Coin size={96} /></div>)}</div>;
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 640), width: 1080, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0}}>
        {it(K.chhota - 0.05, <Coin size={150} />, 'छोटा नफा')}
        {op(K.lakho2 - 0.25, '×')}
        {it(K.lakho2 - 0.05, grid, 'लाखो orders')}
        {op(K.karodo - 0.25, '=')}
        {it(K.karodo - 0.05, pile, <Marker F={F} t={K.karodo + 0.3}>करोडो</Marker>)}
      </div>
      <Fly F={F} t={K.karodo + 0.1} from={[540, 200]} to={[930, 700]} n={6} gap={2} size={56} arc={-60} />
    </AbsoluteFill>
  );
};

/* 13. your own Zomato-like app for your city */
const Skyline = ({W = 1000}) => (
  <svg viewBox="0 0 900 380" width={W} height={W * 0.42} style={{display: 'block'}}>
    {[[20, 170, 110], [140, 110, 90], [240, 200, 130], [380, 80, 100], [490, 150, 120], [620, 60, 90], [720, 190, 150]].map(([x, y, bw], i) => (
      <g key={i}><rect x={x} y={y} width={bw} height={380 - y} rx="6" fill={i % 2 ? '#E2DCCD' : '#D6CFBD'} />
        {Array.from({length: Math.floor((380 - y - 30) / 40)}, (_, r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 18 + c * (bw / 2 - 8)} y={y + 22 + r * 40} width={bw / 2 - 30} height="16" rx="3" fill="#F7F3EA" />))}</g>
    ))}
    <rect y="372" width="900" height="8" fill="#C9C1AE" />
  </svg>
);
const City = ({F}) => {
  const a = C(23), rise = io(F, s(K.swata) - 6, s(K.swata) + 10, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <div style={{...abs(40, 960), ...up(F, a, 14, 40)}}><Skyline W={1000} /></div>
      <div style={{...abs(330, 300), ...popS(F, K.shahar - 0.05, 10)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '18px 34px 12px', boxShadow: '0 16px 40px rgba(60,45,10,0.16)', fontSize: 46, fontWeight: 700, color: TXT}}>
          <Ico d={I_PIN} size={50} color={ZR} sw={2.4} /><span>तुमचं शहर</span>
        </div>
      </div>
      <PhoneL x={290} y={470} w={500} h={880} style={{opacity: rise > 0 ? 1 : 0, transform: `translateY(${(1 - rise) * 700}px)`}}>
        <div style={{height: '100%', background: `linear-gradient(180deg, ${Y}, #FFB800)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 140, boxSizing: 'border-box'}}>
          <div style={{width: 200, height: 200, borderRadius: 52, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)'}}><Biryani size={160} /></div>
          <div style={{marginTop: 40, fontSize: 52, fontWeight: 800, color: BG, ...LAT}}>तुमचं App</div>
          <div style={{marginTop: 50, display: 'grid', gridTemplateColumns: 'repeat(2, 170px)', gap: 20}}>
            {[Burger, Pizza, Thali, Jamun].map((Fd, i) => <div key={i} style={{height: 150, borderRadius: 30, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${F < s(K.swata) + 4 + i * 3 ? 0 : pop(F, K.swata + (4 + i * 3) / FPS, 11)})`}}><Fd size={120} /></div>)}
          </div>
        </div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* 14. DM Outgrid Labs */
const MSG = 'मला पण असं app हवं आहे';
const Dm = ({F}) => {
  const a = C(25), sent = K.dm + 0.2;
  const typed = Array.from(MSG).slice(0, Math.floor(io(F, s(a) + 4, s(sent) - 3, 0, Array.from(MSG).length, Easing.linear))).join('');
  return (
    <AbsoluteFill>
      <Glass x={90} y={300} w={900} h={980} r={48} style={{overflow: 'hidden', ...up(F, a, 12, 50)}}>
        <div style={{padding: '36px 40px 28px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: `1.5px solid ${LINE}`}}>
          <div style={{width: 104, height: 104, borderRadius: 52, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark size={56} color="#fff" /></div>
          <div style={{flex: 1}}><div style={{fontSize: 42, fontWeight: 700, color: TXT, ...LAT}}>outgridlabs</div><div style={{fontSize: 26, color: MUTED, ...LAT}}>Apps · Websites · Automation</div></div>
          <Instagram size={60} />
        </div>
        {F >= s(sent) && <div style={{display: 'flex', justifyContent: 'flex-end', padding: '50px 40px 0', transform: `scale(${pop(F, sent, 12)})`, transformOrigin: '100% 50%'}}>
          <div style={{background: '#3797F0', color: '#fff', borderRadius: 40, padding: '24px 36px 16px', fontSize: 46, fontWeight: 600, maxWidth: 680}}>{MSG}</div>
        </div>}
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 110, borderRadius: 55, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '8px 34px 0', fontSize: 42, fontWeight: 500, color: TXT}}>
          {F < s(sent) ? <>{typed}<span style={{color: '#0095F6', opacity: Math.floor(F / 8) % 2}}>|</span></> : <span style={{color: MUTED, fontSize: 36}}>Message…</span>}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => (
  <AbsoluteFill>
    <LeanOutro F={F} at={OUTRO_AT} cta="DM करा" />
    <Center y={1330} style={up(F, OUTRO_AT + 1.4, 12, 20)}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#fff', borderRadius: 999, padding: '22px 46px 16px', boxShadow: '0 16px 40px rgba(60,45,10,0.14)'}}>
        <Ico d={I_PHONE} size={54} color={C_GREEN} sw={2.4} />
        <span style={{fontSize: 60, fontWeight: 800, color: TXT, letterSpacing: '0.02em'}}>80109 50380</span>
      </div>
    </Center>
  </AbsoluteFill>
);

/* ---------- main ---------- */
const COMPS = {hook: Hook, first: First, comm: Comm, amt: Amt, bill: Bill, y2023: Y2023, ads: Ads, cod: Cod, total: Total, cost: Cost, lakh: Lakh, eq: Eq, city: City, dm: Dm, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
