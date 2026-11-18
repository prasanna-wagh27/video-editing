/*
 * "Mushroom farming business breakdown" (Marathi) — YouTube 16:9, LEAN light theme, VO at original speed.
 * Timing: captions.js (scripts/align_whisper.py on script_hi.txt) -> timing.mjs (make_timing.py) -> cues.mjs (scenes, cue times K, SFX).
 * Sound effects: synthesized by scripts/sfx_mix.py from cues.mjs SFX -> public/mix.wav (render with AUDIO=mix.wav).
 * Art: art.jsx (all vector, drawn here). Real logos: Google Maps pin, YouTube (shared/logos).
 * Illustrative values not in the script: temperature/humidity ranges, the lower "distress" price ₹१२०, setup labels.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing, useCurrentFrame} from 'remotion';
import {FPS, s, io, pop, abs, Y} from '../../shared/kit.jsx';
import {BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up, Glass, Chip, Tick, LogoImg} from '../../shared/lean.jsx';
import {WideVideo, WideOutro} from '../../shared/wide.jsx';
import {ButtonM, OysterM, MilkyM, Straw, SpawnPack, GrowBag, G, I, rnd} from './art.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, HOOK_END, CHAPTERS, L, w} from './cues.mjs';

const TOTAL = s(OUTRO_AT + 3);
const CHUNKS = CAPS.filter((c) => c.a >= s(HOOK_END) - 2);

/* ---------- helpers ---------- */
const DEV = '०१२३४५६७८९';
const dev = (n) => String(n).replace(/\d/g, (d) => DEV[d]);
const num = (n) => dev(Math.round(n).toLocaleString('en-IN'));
const inr = (n) => '₹' + num(n);
const BROWN = '#7A5A2E', CREAMC = '#FFF8EA';
const vis = (F, t) => (F < s(t) ? 0 : 1);
const drop = (F, t, h = 260) => {
  const p = pop(F, t, 9);
  const land = io(F, s(t) + 6, s(t) + 9) * io(F, s(t) + 9, s(t) + 14, 1, 0);
  return {opacity: vis(F, t), transform: `translateY(${(1 - p) * -h}px) scale(${1 + 0.06 * land}, ${1 - 0.08 * land})`, transformOrigin: '50% 100%'};
};
const popS = (F, t, d = 11) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const fadeUp = (F, t) => (F < s(t) - 1 ? {opacity: 0} : up(F, t, 12, 30));
const Marker = ({F, t, children}) => (
  <span style={{background: `linear-gradient(transparent 56%, ${Y} 56%, ${Y} 84%, transparent 84%) no-repeat left / ${io(F, s(t), s(t) + 8) * 100}% 100%`, padding: '0 8px'}}>{children}</span>
);
const Lbl = ({children, size = 36, color = TXT, weight = 600, style = {}}) => <div style={{fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap', lineHeight: 1.15, ...LAT, ...style}}>{children}</div>;
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 700, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Row = ({y, gap = 40, children, style = {}}) => <div style={{...abs(0, y), width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap, ...style}}>{children}</div>;
const Card = ({children, w, h, pad = 30, style = {}}) => (
  <div style={{width: w, height: h, borderRadius: 34, background: 'var(--l-glass)', border: `1.5px solid ${LINE}`, boxShadow: 'var(--l-shadow)', boxSizing: 'border-box', padding: pad,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative', ...style}}>{children}</div>
);
const Tile = ({ic, size = 110, bg = '#FFF4D6', color = TXT, sw = 3.4}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><G size={size * 0.56} color={color} sw={sw}>{I[ic]}</G></div>
);
// icon card with a label, popping in at t
const IconCard = ({F, t, ic, label, w = 270, h = 270, bg, color, sub}) => (
  <div style={popS(F, t)}><Card w={w} h={h}><Tile ic={ic} bg={bg} color={color} /><Lbl size={34}>{label}</Lbl>{sub}</Card></div>
);
const Count = ({F, t, to, from = 0, d = 1.0, fmt = num}) => <>{fmt(io(F, s(t), s(t + d), from, to, Easing.out(Easing.cubic)))}</>;
const Stamp = ({F, t, children, color = C_RED, rot = -8, size = 54, style = {}}) => {
  if (F < s(t)) return null;
  const p = pop(F, t, 12);
  return (
    <div style={{display: 'inline-block', border: `6px solid ${color}`, color, borderRadius: 18, padding: '14px 26px 6px', fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.9)',
      transform: `rotate(${rot}deg) scale(${1.8 - 0.8 * p})`, opacity: Math.min(1, p * 1.4), ...LAT, ...style}}>{children}</div>
  );
};
const Cross = ({F, t, size = 320, color = C_RED, style = {}}) => {
  const a = io(F, s(t), s(t) + 6), b = io(F, s(t) + 4, s(t) + 10);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <path d="M12 12 L88 88" stroke={color} strokeWidth="11" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - a} />
      <path d="M88 12 L12 88" stroke={color} strokeWidth="11" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - b} />
    </svg>
  );
};
const ArrowR = ({F, t, w = 140, color = MUTED}) => {
  const p = io(F, s(t), s(t) + 10, 0, 1, Easing.out(Easing.cubic));
  return (
    <svg viewBox="0 0 140 40" width={w} height={w * 40 / 140} style={{overflow: 'visible', flexShrink: 0, alignSelf: 'center'}}>
      <path d="M6 20 H124" stroke={color} strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <path d="M108 6 L128 20 L108 34" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={io(F, s(t) + 6, s(t) + 10)} />
    </svg>
  );
};
const Bob = ({F, amp = 8, speed = 18, ph = 0, children, style = {}}) => <div style={{transform: `translateY(${Math.sin(F / speed + ph) * amp}px)`, ...style}}>{children}</div>;
// sprouting: grow 0->1 between t and t+d
const grow = (F, t, d = 1.6) => io(F, s(t), s(t + d), 0, 1, Easing.out(Easing.back(1.4)));
const Glow = ({x, y, r = 300, color = Y, o = 0.35}) => <div style={{...abs(x - r, y - r), width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(closest-side, ${color}${Math.round(o * 255).toString(16).padStart(2, '0')}, transparent)`}} />;
const Coin = ({size = 60}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFE58A, ${Y} 55%, #D99A00)`, border: '3px solid #C98A00', boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 700, color: '#8A5A00', paddingTop: size * 0.08}}>₹</div>
);

/* ---------- small drawings ---------- */
const Crate = ({w = 200, kind = 'button', fill = 1, brown = 0, label}) => (
  <div style={{position: 'relative', width: w, height: w * 0.62}}>
    <div style={{...abs(w * 0.0, -w * 0.3), display: 'flex', filter: `sepia(${brown}) saturate(${1 + brown * 1.5}) brightness(${1 - brown * 0.35})`, opacity: fill}}>
      {[0, 1, 2].map((i) => <div key={i} style={{marginLeft: i ? -w * 0.08 : 0, marginTop: i === 1 ? -w * 0.05 : 0}}>{kind === 'button' ? <ButtonM size={w * 0.4} /> : <OysterM size={w * 0.4} />}</div>)}
    </div>
    <div style={{...abs(0, w * 0.16), width: w, height: w * 0.46, borderRadius: 14, background: 'linear-gradient(180deg, #2F6BFF, #1F4FD1)', boxShadow: '0 12px 24px rgba(31,79,209,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 14, right: 14, top: 14, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.25)'}} />
      {label && <Lbl size={w * 0.16} color="#fff" style={{paddingTop: 8}}>{label}</Lbl>}
    </div>
  </div>
);
const Pot = ({F, size = 220}) => (
  <svg viewBox="0 0 220 220" width={size} height={size} style={{overflow: 'visible'}}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${70 + i * 40} ${70 - ((F / 2 + i * 9) % 30)} q-10 -14 0 -28 q10 -14 0 -28`} stroke="#C9C2B5" strokeWidth="6" fill="none" strokeLinecap="round" opacity={0.3 + 0.5 * Math.sin((F + i * 10) / 10) ** 2} />)}
    <rect x="30" y="86" width="160" height="110" rx="22" fill="#5B6472" />
    <rect x="20" y="78" width="180" height="22" rx="11" fill="#3E4652" />
    <rect x="0" y="110" width="30" height="14" rx="7" fill="#3E4652" /><rect x="190" y="110" width="30" height="14" rx="7" fill="#3E4652" />
    <path d="M40 92 Q110 70 180 92" stroke="#E9C46A" strokeWidth="14" fill="none" />
    <rect x="50" y="200" width="120" height="12" rx="6" fill="#E5484D" opacity={0.6 + 0.4 * Math.sin(F / 4)} />
  </svg>
);
const RackRoom = ({F, w = 900, h = 520, sprout = 0, bagsAt, clean}) => {
  // a clean grow room: back wall, 3-tier rack, bags sliding in at bagsAt (s), mist
  const slots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) slots.push([r, c]);
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(180deg, #F3F7F4, #E4ECE6)', border: `1.5px solid ${LINE}`, boxShadow: 'var(--l-shadow)'}}>
      <div style={{...abs(0, h - 70), width: w, height: 70, background: '#D5DED7'}} />
      {[0, 1, 2].map((r) => <div key={r} style={{...abs(60, 150 + r * 130), width: w - 120, height: 12, borderRadius: 6, background: '#9AA5A0'}} />)}
      <div style={{...abs(60, 40), width: 12, height: h - 90, background: '#9AA5A0', borderRadius: 6}} /><div style={{...abs(w - 72, 40), width: 12, height: h - 90, background: '#9AA5A0', borderRadius: 6}} />
      {slots.map(([r, c], i) => {
        const t0 = bagsAt != null ? bagsAt + i * 0.09 : -10;
        const p = bagsAt != null ? pop(F, t0, 12) : 1;
        if (bagsAt != null && F < s(t0)) return null;
        return (
          <div key={i} style={{...abs(120 + c * ((w - 260) / 3) - 10, 150 + r * 130 - 116), transform: `translateY(${(1 - p) * -60}px) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2), transformOrigin: '50% 100%'}}>
            <GrowBag w={74} grow={sprout} seed={i + 2} />
          </div>
        );
      })}
      {clean && [0, 1, 2, 3, 4, 5].map((i) => {
        const tt = (F - s(clean)) / 30 - i * 0.15;
        if (tt < 0 || tt > 1.2) return null;
        return <div key={i} style={{...abs(80 + rnd(i) * (w - 160), 40 + rnd(i * 3) * (h - 160)), transform: `scale(${Math.sin(Math.min(1, tt) * Math.PI)}) rotate(${tt * 90}deg)`}}><G size={50} color={Y} sw={4}>{I.sparkle}</G></div>;
      })}
    </div>
  );
};
const Field = ({w = 900, h = 460}) => (
  <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{borderRadius: 34, display: 'block'}}>
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DCEFFC" /><stop offset="1" stopColor="#F7F3EA" /></linearGradient></defs>
    <rect width={w} height={h} fill="url(#sky)" />
    <circle cx={w - 140} cy="90" r="46" fill={Y} opacity="0.9" />
    <path d={`M0 ${h * 0.42} Q${w * 0.3} ${h * 0.32} ${w * 0.55} ${h * 0.42} T${w} ${h * 0.38} V${h} H0 Z`} fill="#9BCB6C" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d={`M${-200 + i * 110} ${h} L${w * 0.5 + (i - 6) * 26} ${h * 0.44}`} stroke="#6FA545" strokeWidth="10" opacity="0.6" />)}
    <path d={`M0 ${h * 0.42} Q${w * 0.3} ${h * 0.32} ${w * 0.55} ${h * 0.42} T${w} ${h * 0.38}`} stroke="#6FA545" strokeWidth="4" fill="none" />
  </svg>
);
const MapCard = ({F, w = 900, h = 560, pinAt}) => {
  const p = pinAt ? pop(F, pinAt, 9) : 1;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 34, overflow: 'hidden', background: '#EEF1EC', border: `1.5px solid ${LINE}`, boxShadow: 'var(--l-shadow)'}}>
      <svg viewBox="0 0 900 560" width={w} height={h} style={{position: 'absolute'}}>
        <path d="M-20 380 Q200 300 420 360 T920 300" stroke="#AFD3F0" strokeWidth="38" fill="none" />
        {[['M0 120 L900 200', 22], ['M150 0 L260 560', 22], ['M600 0 L520 560', 22], ['M0 470 L900 430', 16], ['M380 0 L430 560', 14], ['M0 260 L900 300', 14], ['M760 0 L840 560', 12]].map(([d, sw], i) => (
          <g key={i}><path d={d} stroke="#fff" strokeWidth={sw + 8} /><path d={d} stroke="#FFFFFF" strokeWidth={sw} /></g>
        ))}
        {[[60, 160, 70, 60], [300, 60, 90, 50], [680, 80, 60, 70], [460, 200, 80, 40], [90, 520, 60, 30], [640, 470, 90, 50]].map(([x, y, a, b], i) => <rect key={i} x={x} y={y} width={a} height={b} rx="8" fill="#DCE7D6" />)}
      </svg>
      <div style={{...abs(w / 2 - 50, h / 2 - 120), transform: `translateY(${(1 - p) * -200}px)`, opacity: pinAt && F < s(pinAt) ? 0 : 1}}><LogoImg src="google-maps.svg" size={100} /></div>
      <div style={{...abs(w / 2 - 70, h / 2 + 4), width: 140, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.12)', transform: `scale(${p})`}} />
      {pinAt && <div style={{...abs(w / 2 + 70, h / 2 - 110), ...popS(F, pinAt + 0.25)}}><Chip color={C_RED} size={40}>पुणे</Chip></div>}
    </div>
  );
};
const Pizza = ({size = 180}) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <circle cx="100" cy="100" r="92" fill="#E9A23B" /><circle cx="100" cy="100" r="78" fill="#F4D06F" />
    {[[70, 70], [130, 80], [100, 125], [60, 125], [140, 130], [100, 55]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}><path d="M-16 4 Q-16 -14 0 -14 Q16 -14 16 4 Z" fill="#F7EFE2" stroke="#BFA88A" strokeWidth="2" /><rect x="-5" y="2" width="10" height="10" fill="#EDE2CE" /></g>
    ))}
    {[[85, 95], [118, 108], [72, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#D9473A" />)}
    {[0, 60, 120].map((a) => <line key={a} x1="100" y1="100" x2={100 + 92 * Math.cos(a * Math.PI / 180)} y2={100 + 92 * Math.sin(a * Math.PI / 180)} stroke="#D08A2E" strokeWidth="3" />)}
    {[0, 60, 120].map((a) => <line key={`b${a}`} x1="100" y1="100" x2={100 - 92 * Math.cos(a * Math.PI / 180)} y2={100 - 92 * Math.sin(a * Math.PI / 180)} stroke="#D08A2E" strokeWidth="3" />)}
  </svg>
);
const Punnet = ({w = 300}) => (
  <div style={{position: 'relative', width: w, height: w * 0.75}}>
    <div style={{...abs(w * 0.06, 0), display: 'flex'}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{marginLeft: i ? -w * 0.1 : 0, marginTop: i % 2 ? 10 : 0}}><ButtonM size={w * 0.3} /></div>)}</div>
    <div style={{...abs(0, w * 0.26), width: w, height: w * 0.42, borderRadius: '10px 10px 26px 26px', background: 'linear-gradient(180deg, #2F6BFF, #2353D8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', borderRadius: 10, padding: '8px 18px 2px', fontSize: w * 0.09, fontWeight: 700, color: '#2353D8'}}>{dev(200)} ग्रॅम</div>
    </div>
  </div>
);
const Pouch = ({w = 180, label = 'DRY', color = '#7A5A2E', brand}) => (
  <div style={{position: 'relative', width: w, height: w * 1.3, borderRadius: `${w * 0.1}px ${w * 0.1}px ${w * 0.16}px ${w * 0.16}px`, background: `linear-gradient(160deg, ${color}, ${color}DD)`, boxShadow: '0 18px 30px rgba(60,40,10,0.18)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: w * 0.16, boxSizing: 'border-box'}}>
    <div style={{...abs(0, w * 0.08), width: w, height: 4, background: 'rgba(255,255,255,0.35)'}} />
    <div style={{width: w * 0.62, height: w * 0.5, borderRadius: w * 0.08, background: 'rgba(255,255,255,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><ButtonM size={w * 0.42} tint={1} /></div>
    <div style={{fontSize: w * 0.13, fontWeight: 700, color: '#fff', marginTop: w * 0.06, ...LAT}}>{label}</div>
    {brand && <div style={{fontSize: w * 0.09, fontWeight: 600, color: Y, ...LAT}}>{brand}</div>}
  </div>
);
const Jar = ({w = 170, fill = '#D8C3A0', label = 'POWDER', lid = '#2F6BFF', bits}) => (
  <div style={{position: 'relative', width: w, height: w * 1.3}}>
    <div style={{...abs(w * 0.12, 0), width: w * 0.76, height: w * 0.2, borderRadius: 12, background: lid}} />
    <div style={{...abs(0, w * 0.16), width: w, height: w * 1.12, borderRadius: w * 0.16, background: 'rgba(255,255,255,0.7)', border: '3px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxSizing: 'border-box'}}>
      <div style={{...abs(0, w * 0.22), width: w, height: w * 0.9, background: fill}} />
      {bits && Array.from({length: 14}).map((_, i) => <div key={i} style={{...abs(rnd(i) * w * 0.8, w * 0.3 + rnd(i * 3) * w * 0.7), width: w * 0.16, height: w * 0.1, borderRadius: '50% 50% 30% 30%', background: '#F2E6D2', border: '2px solid #A9845A'}} />)}
      <div style={{...abs(w * 0.1, w * 0.42), width: w * 0.8, padding: '8px 0 2px', borderRadius: 10, background: '#fff', textAlign: 'center', fontSize: w * 0.11, fontWeight: 700, color: TXT, ...LAT}}>{label}</div>
    </div>
  </div>
);
const Bar = ({F, t, w = 600, pct, color = C_GREEN, h = 30}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: 'rgba(0,0,0,0.06)', overflow: 'hidden'}}>
    <div style={{width: `${io(F, s(t), s(t) + 18, 0, pct, Easing.out(Easing.cubic))}%`, height: '100%', borderRadius: h / 2, background: color}} />
  </div>
);
const Avatar = ({ic = 'users', size = 120, bg = '#E9F2FF', color = C_BLUE}) => <Tile ic={ic} size={size} bg={bg} color={color} />;

/* ================= scenes ================= */
const Hook = ({F}) => {
  const g = io(F, 0, s(2.4), 0.25, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Glow x={1350} y={560} r={480} o={0.4} />
      <div style={{...abs(130, 230)}}>
        <Lbl size={48} color={MUTED}>मशरूम शेतीतून</Lbl>
        <Big size={150} style={{marginTop: 18}}>महिन्याला</Big>
        <Big size={150} style={{marginTop: 14, ...up(F, K.lakh - 0.25)}}><Marker F={F} t={K.lakh}>लाखो रुपये?</Marker></Big>
        <div style={{marginTop: 54, marginLeft: 6}}><Stamp F={F} t={K.hoy} color={C_GREEN} rot={-6} size={84}>होय!</Stamp></div>
      </div>
      <div style={{...abs(1010, 200), display: 'flex', alignItems: 'flex-end', gap: 70}}>
        {[0, 1, 2].map((i) => <Bob key={i} F={F} amp={5} ph={i * 1.3}><GrowBag w={i === 1 ? 250 : 210} grow={Math.min(1, g * (1.1 - i * 0.12))} seed={i * 5 + 1} /></Bob>)}
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const t0 = K.lakh - 0.1 + i * 0.12, tt = (F - s(t0)) / 40;
        if (tt < 0 || tt > 1) return null;
        return <div key={i} style={{...abs(1120 + i * 120, 520 - tt * 380), opacity: 1 - tt ** 2, transform: `scale(${0.6 + tt * 0.5}) rotate(${(i - 2) * 12}deg)`}}><Coin size={70} /></div>;
      })}
    </AbsoluteFill>
  );
};
const Ask = ({F}) => (
  <AbsoluteFill>
    <Row y={200} gap={70}>
      <div style={popS(F, K.invest - 0.15)}>
        <Card w={620} h={560}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Coin size={120} /><Big size={150} color={GOLD_T}>?</Big></div>
          <Lbl size={52}>गुंतवणूक किती?</Lbl>
        </Card>
      </div>
      <div style={popS(F, K.how - 0.15)}>
        <Card w={620} h={560}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <GrowBag w={90} grow={1} /><ArrowR F={F} t={K.how} w={90} /><Tile ic="truck" size={110} bg="#E9F2FF" color={C_BLUE} /><ArrowR F={F} t={K.how + 0.2} w={90} /><Coin size={90} />
          </div>
          <Lbl size={52}>व्यवसाय कसा चालतो?</Lbl>
        </Card>
      </div>
    </Row>
  </AbsoluteFill>
);
const Land = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(410, 170), ...fadeUp(F, L(6) - 0.4)}}>
      <div style={{borderRadius: 34, overflow: 'hidden', boxShadow: 'var(--l-shadow)'}}><Field w={1100} h={620} /></div>
      <div style={{...abs(40, 40), ...popS(F, K.acre)}}><Chip color={C_GREEN} size={46}>{'१ एकर जमीन'}</Chip></div>
      <div style={{...abs(390, 150)}}>{F >= s(K.no - 0.45) && <Cross F={F} t={K.no - 0.45} size={320} />}</div>
    </div>
  </AbsoluteFill>
);
const Room = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(460, 170)}}><RackRoom F={F} w={1000} h={600} sprout={io(F, s(K.smallRoom), s(K.smallRoom + 2), 0.2, 1)} /></div>
    <div style={{...abs(1290, 120), ...popS(F, K.smallRoom)}}><Chip color={C_GREEN} size={46}>छोटी खोली ✓</Chip></div>
  </AbsoluteFill>
);
const Title = ({F}) => (
  <AbsoluteFill>
    <Glow x={1420} y={520} r={420} o={0.45} />
    <div style={{...abs(140, 300)}}>
      <div style={popS(F, K.title - 0.1, 12)}><Chip color={GOLD_T} size={40}>बिझनेस ब्रेकडाउन</Chip></div>
      <Big size={170} style={{marginTop: 30, ...up(F, K.title - 0.1)}}><Marker F={F} t={K.title + 0.2}>मशरूम</Marker></Big>
      <Big size={170} style={{marginTop: 10, ...up(F, K.titleB - 0.1)}}>फार्मिंग</Big>
    </div>
    <div style={{...abs(1120, 270), display: 'flex', alignItems: 'flex-end'}}>
      <div style={drop(F, K.title)}><ButtonM size={300} /></div>
      <div style={{marginLeft: -60, ...drop(F, K.title + 0.15)}}><OysterM size={260} /></div>
      <div style={{marginLeft: -40, ...drop(F, K.title + 0.3)}}><MilkyM size={240} /></div>
    </div>
  </AbsoluteFill>
);

/* --- chapter 1: how it's grown --- */
const STEPS = [['भुसा', 'straw'], ['स्पॉन', 'spawn'], ['खोली', 'room'], ['मशरूम', 'mush']];
const StepIcon = ({k, size = 150}) => k === 'straw' ? <Straw w={size} h={size * 0.55} n={50} /> : k === 'spawn' ? <SpawnPack size={size * 0.6} /> : k === 'room' ? <Tile ic="room" size={size * 0.7} bg="#E8F5EC" color={C_GREEN} /> : <ButtonM size={size * 0.75} />;
const How = ({F}) => (
  <AbsoluteFill>
    <Row y={300} gap={26} style={{alignItems: 'center'}}>
      {STEPS.map(([l, k], i) => (
        <React.Fragment key={k}>
          {i > 0 && <ArrowR F={F} t={L(13) + i * 0.22} w={80} />}
          <div style={popS(F, L(13) + i * 0.22)}>
            <Card w={300} h={330}>
              <div style={{...abs(20, 20), width: 50, height: 50, borderRadius: 25, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, paddingTop: 5, boxSizing: 'border-box'}}>{dev(i + 1)}</div>
              <div style={{height: 170, display: 'flex', alignItems: 'flex-end'}}><StepIcon k={k} size={210} /></div><Lbl size={40}>{l}</Lbl>
            </Card>
          </div>
        </React.Fragment>
      ))}
    </Row>
  </AbsoluteFill>
);
const StrawSc = ({F}) => (
  <AbsoluteFill>
    <Row y={230} gap={90}>
      <div style={drop(F, K.straw1 - 0.1)}><Card w={640} h={560}><Straw w={480} h={250} n={160} seed={2} /><Lbl size={48}>धान्याचा भुसा</Lbl></Card></div>
      <div style={drop(F, K.straw2 - 0.1)}><Card w={640} h={560}><Straw w={480} h={250} n={160} seed={9} /><Lbl size={48}>गव्हाचा भुसा</Lbl></Card></div>
    </Row>
  </AbsoluteFill>
);
const Spawn = ({F}) => {
  const pour = io(F, s(K.spawn), s(K.spawn + 1.4));
  return (
    <AbsoluteFill>
      <Row y={210} gap={60} style={{alignItems: 'center'}}>
        <div style={popS(F, K.process - 0.15)}><Card w={460} h={560}><Pot F={F} size={240} /><Lbl size={46}>प्रक्रिया</Lbl></Card></div>
        <ArrowR F={F} t={K.spawn - 0.4} w={120} />
        <div style={popS(F, K.spawn - 0.2)}>
          <Card w={760} h={560} style={{flexDirection: 'row', gap: 80}}>
            <div style={{transform: `rotate(${io(F, s(K.spawn), s(K.spawn) + 10, 0, -38)}deg) translate(${pour * 30}px, ${-pour * 10}px)`, transformOrigin: '80% 20%'}}><SpawnPack size={210} /></div>
            <div style={{position: 'relative'}}>
              <GrowBag w={200} grow={0} />
              {pour > 0 && pour < 1 && Array.from({length: 12}).map((_, i) => {
                const tt = ((F / 8 + i / 12) % 1);
                return <div key={i} style={{...abs(30 + rnd(i) * 80 - 120 + tt * 120, -40 + tt * 120), width: 14, height: 9, borderRadius: '50%', background: '#fff', border: '2px solid #C9A877', opacity: 1 - tt}} />;
              })}
            </div>
          </Card>
        </div>
      </Row>
      <div style={{...abs(1200, 190), ...popS(F, K.spawn + 0.3)}}><Chip color={GOLD_T} size={40}>मशरूम स्पॉन</Chip></div>
    </AbsoluteFill>
  );
};
const Bags = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(410, 160)}}><RackRoom F={F} w={1100} h={640} sprout={0} bagsAt={K.bags - 0.2} clean={K.clean} /></div>
    <div style={{...abs(1300, 120), ...popS(F, K.clean)}}><Chip color={C_GREEN} size={44}>स्वच्छ खोली ✓</Chip></div>
  </AbsoluteFill>
);
const Gauge = ({F, t, ic, color, label, val, bg}) => (
  <div style={popS(F, t)}>
    <Card w={420} h={260} style={{flexDirection: 'row', gap: 26, justifyContent: 'flex-start', padding: '0 36px'}}>
      <Tile ic={ic} size={130} bg={bg} color={color} />
      <div><Lbl size={36} color={MUTED}>{label}</Lbl><Big size={66} color={color} style={{marginTop: 8}}>{val}</Big></div>
    </Card>
  </div>
);
const Climate = ({F}) => {
  const g = io(F, s(K.weeks - 0.3), s(K.ready + 0.2), 0, 1);
  const wk = Math.min(3, 1 + Math.floor(g * 3));
  return (
    <AbsoluteFill>
      <div style={{...abs(150, 210), display: 'flex', flexDirection: 'column', gap: 40}}>
        <Gauge F={F} t={K.temp - 0.1} ic="thermo" color={C_ORANGE} bg="#FFF1DC" label="तापमान" val={'२२–२८°C'} />
        <Gauge F={F} t={K.moist - 0.1} ic="drop" color={C_BLUE} bg="#E6F0FF" label="ओलावा" val={'८०–९०%'} />
      </div>
      <div style={{...abs(800, 150), ...fadeUp(F, L(20))}}>
        <Card w={960} h={680} style={{justifyContent: 'flex-end', paddingBottom: 40}}>
          <div style={{display: 'flex', gap: 60, alignItems: 'flex-end'}}>{[0, 1, 2].map((i) => <GrowBag key={i} w={190} grow={g * (1 - i * 0.08)} seed={i * 3 + 4} />)}</div>
          <div style={{display: 'flex', gap: 18, marginTop: 20}}>
            {[1, 2, 3].map((n) => <div key={n} style={{padding: '12px 26px 6px', borderRadius: 999, fontSize: 32, fontWeight: 600, background: n <= wk && F >= s(K.weeks - 0.3) ? Y : 'rgba(0,0,0,0.05)', color: TXT}}>आठवडा {dev(n)}</div>)}
          </div>
        </Card>
      </div>
      <div style={{...abs(1560, 120), ...popS(F, K.ready)}}><Chip color={C_GREEN} size={44}>तयार ✓</Chip></div>
    </AbsoluteFill>
  );
};
const NoLand = ({F}) => (
  <AbsoluteFill>
    <Row y={220} gap={80} style={{alignItems: 'center'}}>
      <div style={{position: 'relative', opacity: 0.55, ...fadeUp(F, L(22) - 0.3)}}>
        <div style={{borderRadius: 34, overflow: 'hidden'}}><Field w={600} h={440} /></div>
        <div style={{...abs(170, 80)}}><Cross F={F} t={K.noLand} size={260} /></div>
      </div>
      <ArrowR F={F} t={K.prod - 0.3} w={140} />
      <div style={popS(F, K.prod - 0.15)}>
        <Card w={640} h={520}><div style={{display: 'flex', gap: 10}}><Crate w={260} /><Crate w={260} kind="oyster" /></div><Chip color={C_GREEN} size={44}>उत्पादन सुरू ✓</Chip></Card>
      </div>
    </Row>
  </AbsoluteFill>
);

/* --- chapter 2: types --- */
const TYPES = [['बटन', ButtonM], ['ऑयस्टर', OysterM], ['मिल्की', MilkyM]];
const Types = ({F}) => (
  <AbsoluteFill>
    <Row y={230} gap={70}>
      {TYPES.map(([n, M], i) => (
        <div key={n} style={drop(F, K.three - 0.1 + i * 0.15)}>
          <Card w={440} h={560} style={{justifyContent: 'flex-end', paddingBottom: 50}}>
            <div style={{...abs(30, 30), width: 70, height: 70, borderRadius: 35, background: Y, fontSize: 42, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 7, boxSizing: 'border-box'}}>{dev(i + 1)}</div>
            <div style={{filter: 'brightness(0.25) sepia(0.3)', opacity: 0.85}}><M size={280} /></div>
            <Lbl size={44} color={MUTED}>?</Lbl>
          </Card>
        </div>
      ))}
    </Row>
  </AbsoluteFill>
);
const TypeHero = ({F, t, M, name, n, children}) => (
  <AbsoluteFill>
    <Glow x={520} y={500} r={380} o={0.35} />
    <div style={{...abs(220, 170), ...popS(F, t - 0.15, 10)}}><Bob F={F} amp={8}><M size={560} /></Bob></div>
    <div style={{...abs(250, 760), display: 'flex', alignItems: 'center', gap: 18, ...up(F, t)}}>
      <div style={{width: 70, height: 70, borderRadius: 35, background: Y, fontSize: 42, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 7, boxSizing: 'border-box'}}>{dev(n)}</div>
      <Big size={78}>{name}</Big>
    </div>
    {children}
  </AbsoluteFill>
);
const Button = ({F}) => (
  <TypeHero F={F} t={K.button} M={ButtonM} name="बटन मशरूम" n={1}>
    <div style={{...abs(1000, 210), ...popS(F, K.superm - 0.1)}}>
      <Card w={720} h={560}>
        <div style={{...abs(30, 30)}}><Tile ic="store" size={90} bg="#E9F2FF" color={C_BLUE} /></div>
        <Punnet w={380} /><Lbl size={42}>सुपरमार्केट · बाजार</Lbl>
      </Card>
    </div>
  </TypeHero>
);
const ButtonUse = ({F}) => (
  <AbsoluteFill>
    <Row y={210} gap={50}>
      <IconCard F={F} t={K.hotel - 0.1} ic="hotel" label="हॉटेल्स" w={420} h={460} bg="#E9F2FF" color={C_BLUE} />
      <div style={popS(F, K.pizza - 0.1)}><Card w={420} h={460}><Pizza size={230} /><Lbl size={34}>पिझ्झा शॉप्स</Lbl></Card></div>
      <IconCard F={F} t={K.resto - 0.1} ic="restaurant" label="रेस्टॉरंट्स" w={420} h={460} bg="#FFF1DC" color={C_ORANGE} />
    </Row>
    <div style={{...abs(560, 740), display: 'flex', alignItems: 'center', gap: 24, ...fadeUp(F, K.bigUse - 0.1)}}>
      <Lbl size={38} color={MUTED}>मागणी</Lbl><Bar F={F} t={K.bigUse} w={620} pct={92} color={C_GREEN} h={34} /><G size={50} color={C_GREEN} sw={5}>{I.arrowUp}</G>
    </div>
  </AbsoluteFill>
);
const Oyster = ({F}) => (
  <TypeHero F={F} t={K.oyster} M={OysterM} name="ऑयस्टर मशरूम" n={2}>
    <div style={{...abs(1040, 220), display: 'flex', flexDirection: 'column', gap: 36}}>
      <div style={popS(F, K.smallStart)}><Card w={640} h={220} style={{flexDirection: 'row', gap: 30, justifyContent: 'flex-start', padding: '0 40px'}}><Tile ic="room" bg="#E8F5EC" color={C_GREEN} /><Lbl size={46}>छोटी सुरुवात</Lbl><Tick size={56} /></Card></div>
      <div style={popS(F, K.oyStraw - 0.1)}><Card w={640} h={220} style={{flexDirection: 'row', gap: 30, justifyContent: 'flex-start', padding: '0 40px'}}><Straw w={140} h={80} n={40} /><Lbl size={46}>धान्याचा भुसा</Lbl><Tick size={56} /></Card></div>
    </div>
  </TypeHero>
);
const Milky = ({F}) => (
  <TypeHero F={F} t={K.milky} M={MilkyM} name="मिल्की मशरूम" n={3}>
    <div style={{...abs(1050, 210), ...popS(F, K.hot - 0.15)}}>
      <Card w={620} h={500}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{transform: `rotate(${F * 0.8}deg)`}}><G size={170} color={C_ORANGE} sw={3.6}>{I.sun}</G></div>
          <Tile ic="thermo" size={150} bg="#FFE8E0" color={C_RED} />
        </div>
        <Lbl size={48}>उष्ण हवामान ✓</Lbl>
      </Card>
    </div>
  </TypeHero>
);
const Choose = ({F}) => {
  const sel = io(F, s(K.decide - 0.2), s(K.decide + 0.4), 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Row y={160} gap={50}>
        {TYPES.map(([n, M], i) => (
          <div key={n} style={{...popS(F, L(36) + i * 0.12), position: 'relative'}}>
            <Card w={400} h={430} style={{border: i === 1 && sel > 0.5 ? `5px solid ${Y}` : `1.5px solid ${LINE}`, transform: `scale(${i === 1 ? 1 + 0.06 * sel : 1 - 0.04 * sel})`, opacity: i === 1 ? 1 : 1 - 0.4 * sel}}>
              <M size={240} /><Lbl size={42}>{n}</Lbl>
            </Card>
            {i === 1 && <div style={{...abs(330, -20), ...popS(F, K.decide + 0.2)}}><Tick size={80} /></div>}
          </div>
        ))}
      </Row>
      <Row y={720} gap={40}>
        <div style={popS(F, K.demand - 0.1)}><Chip color={C_BLUE} size={44}>तुमच्या भागातील मागणी</Chip></div>
        <div style={popS(F, K.facility - 0.1)}><Chip color={C_GREEN} size={44}>उपलब्ध सुविधा</Chip></div>
      </Row>
    </AbsoluteFill>
  );
};

/* --- chapter 3: find demand --- */
const Pune = ({F}) => <AbsoluteFill><div style={{...abs(460, 150), ...fadeUp(F, L(39) - 0.3)}}><MapCard F={F} w={1000} h={640} pinAt={K.pune - 0.15} /></div></AbsoluteFill>;
const BUYERS = [['restaurant', 'रेस्टॉरंट्स', '#FFF1DC', C_ORANGE], ['hotel', 'हॉटेल्स', '#E9F2FF', C_BLUE], ['cafe', 'कॅफे', '#F3E9FF', '#8B5CF6'], ['veg', 'भाजी विक्रेते', '#E8F5EC', C_GREEN]];
const Contacts = ({F}) => {
  const ts = [K.cResto, K.cHotel, K.cCafe, K.cVeg];
  return (
    <AbsoluteFill>
      <Row y={200} gap={40}>
        {BUYERS.map(([ic, l, bg, c], i) => <IconCard key={ic} F={F} t={ts[i] - 0.1} ic={ic} label={l} w={360} h={400} bg={bg} color={c} />)}
      </Row>
      <div style={{...abs(860, 660), ...popS(F, K.contact - 0.1)}}>
        <div style={{width: 200, height: 120, borderRadius: 60, background: C_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(34,197,94,0.35)'}}>
          <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{transform: `rotate(${Math.sin(F / 2) * 8}deg)`}}><path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const QROWS = [['आठवड्याला किती किलो?', 'cal'], ['सध्याचा दर किती? (₹/किलो)', 'bag'], ['कोणता प्रकार हवा?', 'sparkle']];
const Questions = ({F}) => {
  const ts = [K.q1, K.q2, K.q3];
  return (
    <AbsoluteFill>
      <div style={{...abs(420, 150), ...fadeUp(F, L(44) - 0.4)}}>
        <Card w={1080} h={660} style={{alignItems: 'stretch', justifyContent: 'flex-start', padding: '50px 60px', gap: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Tile ic="restaurant" size={80} bg="#FFF1DC" color={C_ORANGE} /><Lbl size={40} color={MUTED}>ग्राहकांना विचारा</Lbl></div>
          {QROWS.map(([q, ic], i) => {
            const t = ts[i], n = Math.floor(io(F, s(t - 0.1), s(t + 1.0), 0, q.length));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, height: 120, borderRadius: 24, background: F >= s(t - 0.1) ? '#FFFBEF' : 'rgba(0,0,0,0.03)', padding: '0 30px', border: `1.5px solid ${LINE}`}}>
                <div style={{width: 56, height: 56, borderRadius: 28, background: F >= s(t - 0.1) ? Y : 'rgba(0,0,0,0.06)', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5, boxSizing: 'border-box'}}>{dev(i + 1)}</div>
                <Lbl size={50} style={{flex: 1}}>{q.slice(0, n)}{F >= s(t - 0.1) && n < q.length && <span style={{opacity: Math.floor(F / 6) % 2}}>|</span>}</Lbl>
                {F >= s(t + 1.1) && <div style={popS(F, t + 1.1)}><Tick size={54} /></div>}
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};
const Five = ({F}) => (
  <AbsoluteFill>
    <Row y={260} gap={34}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={drop(F, K.five - 0.15 + i * 0.1)}>
          <Card w={300} h={400}>
            <Tile ic="restaurant" size={120} bg="#FFF1DC" color={C_ORANGE} />
            <Lbl size={34} color={MUTED}>रेस्टॉरंट {dev(i + 1)}</Lbl>
            <div style={popS(F, K.ten + i * 0.08)}><div style={{background: Y, borderRadius: 999, padding: '12px 28px 4px', fontSize: 44, fontWeight: 700}}>{dev(10)} किलो</div></div>
          </Card>
        </div>
      ))}
    </Row>
    <div style={{...abs(760, 700), ...fadeUp(F, K.ten + 0.4)}}><Lbl size={40} color={MUTED}>दर आठवड्याला, प्रत्येकी</Lbl></div>
  </AbsoluteFill>
);
const Fifty = ({F}) => (
  <AbsoluteFill>
    <Glow x={960} y={450} r={420} o={0.4} />
    <Row y={250} gap={40} style={{alignItems: 'center'}}>
      <Big size={130} color={MUTED} style={up(F, L(51) - 0.3)}>{dev(5)} × {dev(10)}</Big>
      <Big size={130} color={MUTED} style={up(F, L(51) - 0.2)}>=</Big>
      <div style={popS(F, K.fifty - 0.1, 10)}><Big size={200}><Marker F={F} t={K.fifty + 0.1}><Count F={F} t={K.fifty - 0.1} to={50} d={0.6} /> किलो</Marker></Big></div>
    </Row>
    <Row y={560} gap={30}>
      <div style={fadeUp(F, K.fifty + 0.4)}><Lbl size={50} color={MUTED}>दर आठवड्याला</Lbl></div>
      <div style={popS(F, K.potential)}><Chip color={C_GREEN} size={46}>संभाव्य मागणी</Chip></div>
    </Row>
  </AbsoluteFill>
);
const Produce = ({F}) => (
  <AbsoluteFill>
    <Row y={200} gap={60} style={{alignItems: 'center'}}>
      <div style={popS(F, L(53) - 0.2)}><Card w={520} h={460}><Tile ic="users" size={130} bg="#E9F2FF" color={C_BLUE} /><Lbl size={40} color={MUTED}>मागणी</Lbl><Big size={90}>{dev(50)} किलो</Big></Card></div>
      <ArrowR F={F} t={K.byDemand} w={160} color={GOLD_T} />
      <div style={popS(F, K.startProd - 0.2)}><RackRoom F={F} w={720} h={460} sprout={io(F, s(K.startProd), s(K.startProd + 1.5), 0.2, 1)} /></div>
    </Row>
  </AbsoluteFill>
);

/* --- chapter 4: investment --- */
const Calc = ({F}) => (
  <AbsoluteFill>
    <Glow x={960} y={460} r={420} o={0.35} />
    <div style={{...abs(760, 140), ...popS(F, L(55) - 0.2, 10)}}>
      <div style={{width: 400, height: 640, borderRadius: 50, background: '#1F1F22', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', padding: 36, boxSizing: 'border-box'}}>
        <div style={{height: 150, borderRadius: 24, background: '#DDE8D2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 26px 0', fontSize: 58, fontWeight: 700, color: '#1F1F22', boxSizing: 'border-box'}}>
          ₹<Count F={F} t={K.calc - 0.2} to={150000} d={1.6} />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 30}}>
          {['७', '८', '९', '÷', '४', '५', '६', '×', '१', '२', '३', '−', '०', '.', '=', '+'].map((k, i) => {
            const hot = Math.floor((F - s(K.calc - 0.2)) / 4) % 16 === i && F < s(K.calc + 1.4) && F > s(K.calc - 0.2);
            return <div key={i} style={{height: 80, borderRadius: 20, background: i % 4 === 3 ? Y : hot ? '#555' : '#35353A', color: i % 4 === 3 ? BG : '#fff', fontSize: 36, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6}}>{k}</div>;
          })}
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
const RoomCost = ({F}) => {
  const p = io(F, s(K.less - 0.1), s(K.less + 1), 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Row y={210} gap={70} style={{alignItems: 'center'}}>
        <div style={popS(F, K.haveRoom - 0.2)}><Card w={520} h={520}><Tile ic="room" size={200} bg="#E8F5EC" color={C_GREEN} /><div style={{display: 'flex', alignItems: 'center', gap: 16}}><Lbl size={46}>खोली आधीच आहे</Lbl><Tick size={50} /></div></Card></div>
        <ArrowR F={F} t={K.less - 0.3} w={140} />
        <div style={fadeUp(F, K.less - 0.2)}>
          <Card w={620} h={520} style={{alignItems: 'stretch', padding: '50px 60px', gap: 26}}>
            <Lbl size={40} color={MUTED}>सुरुवातीचा खर्च</Lbl>
            <div style={{height: 260, display: 'flex', alignItems: 'flex-end', gap: 50, justifyContent: 'center'}}>
              <div style={{width: 160, height: 240, borderRadius: 20, background: 'rgba(0,0,0,0.12)'}} />
              <div style={{width: 160, height: 240 - 130 * p, borderRadius: 20, background: C_GREEN}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center'}}><G size={56} color={C_GREEN} sw={5}><g transform="rotate(180 32 32)">{I.arrowUp}</g></G><Lbl size={46} color={C_GREEN}>कमी</Lbl></div>
          </Card>
        </div>
      </Row>
    </AbsoluteFill>
  );
};
const EQUIP = [['rack', 'रॅक्स', 'rack'], ['humid', 'ह्युमिडिटी मशीन', 'humid'], ['spray', 'स्प्रे पंप', 'spray'], ['spawn', 'स्पॉन', 'eSpawn'], ['straw', 'भुसा', 'eStraw'], ['bag', 'बॅग्स', 'eBags'], ['box', 'इतर साहित्य', 'eOther']];
const Equip = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(150, 170), width: 1620, display: 'flex', flexWrap: 'wrap', gap: 34, justifyContent: 'center'}}>
      {EQUIP.map(([ic, l, k]) => (
        <div key={l} style={popS(F, K[k] - 0.1)}>
          <Card w={360} h={300}>
            {ic === 'spawn' ? <SpawnPack size={100} /> : ic === 'straw' ? <Straw w={180} h={100} n={50} /> : <Tile ic={ic} size={130} />}
            <Lbl size={38}>{l}</Lbl>
          </Card>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
const Range = ({F, t, title, lo, hi, pct, color, icons}) => (
  <Card w={1240} h={560} style={{alignItems: 'stretch', padding: '50px 70px', gap: 34}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 24}}>{icons}<Lbl size={52}>{title}</Lbl></div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
      <Big size={110} color={color}>{lo}</Big><Big size={70} color={MUTED}>ते</Big><Big size={110} color={color} style={{opacity: io(F, s(t), s(t) + 8)}}>{hi}</Big>
    </div>
    <Bar F={F} t={t - 0.6} w={1100} pct={pct} color={color} h={40} />
  </Card>
);
const Small = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(340, 170), ...fadeUp(F, L(64) - 0.4)}}>
      <Range F={F} t={K.s150} title="छोटा सेटअप" lo={inr(50000)} hi={'₹१.५ लाख'} pct={30} color={C_GREEN} icons={<><Tile ic="rack" size={90} /><Tile ic="humid" size={90} /></>} />
    </div>
  </AbsoluteFill>
);
const BigSetup = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(340, 170), ...fadeUp(F, L(66) - 0.4)}}>
      <Range F={F} t={K.b8} title="मोठा सेटअप + तापमान नियंत्रण" lo={'₹३ लाख'} hi={'₹८ लाख'} pct={90} color={C_ORANGE}
        icons={<><div style={popS(F, K.bigSetup)}><Tile ic="rack" size={90} bg="#FFF1DC" color={C_ORANGE} /></div><div style={popS(F, K.tempCtl)}><Tile ic="ac" size={90} bg="#E6F0FF" color={C_BLUE} /></div><div style={popS(F, K.tempCtl + 0.15)}><Tile ic="thermo" size={90} bg="#FFE8E0" color={C_RED} /></div></>} />
    </div>
  </AbsoluteFill>
);
const CYC = [['spawn', 'स्पॉन', 'cSpawn'], ['straw', 'भुसा', 'cStraw'], ['bolt', 'वीज', 'cPower'], ['box', 'पॅकिंग', 'cPack'], ['worker', 'मजुरी', 'cLabour']];
const Cycle = ({F}) => {
  const R = 300, cx = 960, cy = 500;
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={Y} strokeWidth="10" strokeDasharray="30 22" strokeDashoffset={-F * 2} opacity={io(F, s(L(69) - 0.3), s(L(69)))} />
      </svg>
      <div style={{...abs(cx - 170, cy - 110), width: 340, textAlign: 'center', ...popS(F, K.cycle - 0.1)}}>
        <div style={{display: 'flex', justifyContent: 'center', transform: `rotate(${F * 2}deg)`}}><G size={110} color={GOLD_T} sw={4}><path d="M50 22a22 22 0 1 0 4 16M50 8v14H36" /></G></div>
        <Lbl size={42} style={{marginTop: 10}}>प्रत्येक चक्र</Lbl>
      </div>
      {CYC.map(([ic, l, k], i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return (
          <div key={l} style={{...abs(cx + R * Math.cos(a) - 110, cy + R * Math.sin(a) - 100), ...popS(F, K[k] - 0.1)}}>
            <Card w={220} h={200} pad={10}>{ic === 'spawn' ? <SpawnPack size={70} /> : ic === 'straw' ? <Straw w={120} h={64} n={34} /> : <Tile ic={ic} size={90} />}<Lbl size={34}>{l}</Lbl></Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const JarBox = ({F, t, label, color, coins}) => (
  <div style={popS(F, t)}>
    <Card w={560} h={600}>
      <div style={{position: 'relative', width: 260, height: 300, borderRadius: '30px 30px 60px 60px', border: `6px solid ${color}`, background: `${color}14`, overflow: 'hidden'}}>
        {Array.from({length: 10}).map((_, i) => {
          const tt = io(F, s(coins + i * 0.12), s(coins + i * 0.12) + 10, 0, 1, Easing.in(Easing.quad));
          return <div key={i} style={{...abs(30 + (i % 3) * 66, -80 + tt * (230 - Math.floor(i / 3) * 52)), opacity: F < s(coins + i * 0.12) ? 0 : 1}}><Coin size={64} /></div>;
        })}
      </div>
      <Lbl size={44}>{label}</Lbl>
    </Card>
  </div>
);
const Separate = ({F}) => {
  const d = io(F, s(K.apart - 0.1), s(K.apart + 0.4));
  return (
    <AbsoluteFill>
      <Row y={180} gap={140 + d * 80}>
        <JarBox F={F} t={K.startInv - 0.15} label="सुरुवातीची गुंतवणूक" color={C_BLUE} coins={K.startInv} />
        <JarBox F={F} t={K.daily - 0.15} label="रोजचा खर्च" color={C_ORANGE} coins={K.daily} />
      </Row>
      <div style={{...abs(956, 180 + (1 - d) * 300), width: 8, height: 600 * d, borderRadius: 4, background: Y}} />
    </AbsoluteFill>
  );
};

/* --- chapter 5: the math --- */
const Bags3100 = ({F}) => {
  const n = Math.round(io(F, s(K.n3100 - 0.5), s(K.n3100 + 0.6), 0, 50));
  return (
    <AbsoluteFill>
      <div style={{...abs(160, 160), width: 900, display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {Array.from({length: 50}).map((_, i) => <div key={i} style={{opacity: i < n ? 1 : 0.12, transform: `scale(${i < n ? 1 : 0.8})`}}><GrowBag w={72} grow={0} seed={i} /></div>)}
      </div>
      <div style={{...abs(1140, 290)}}>
        <div style={fadeUp(F, K.year - 0.2)}><Chip color={GOLD_T} size={42}>वर्षभरात</Chip></div>
        <Big size={190} style={{marginTop: 30, ...popS(F, K.n3100 - 0.2, 12)}}><Count F={F} t={K.n3100 - 0.4} to={3100} d={0.9} /></Big>
        <Lbl size={56} color={MUTED} style={{marginTop: 20, ...fadeUp(F, K.n3100 + 0.3)}}>मशरूम बॅग्स</Lbl>
      </div>
    </AbsoluteFill>
  );
};
// one ledger used by sales / cost / diff scenes
const LRow = ({F, t, label, calc, val, color = TXT, size = 92, dim}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 30, height: 150, borderBottom: `2px dashed ${LINE}`, opacity: dim ? 0.45 : 1, ...fadeUp(F, t)}}>
    <Lbl size={44} color={MUTED} style={{width: 240}}>{label}</Lbl>
    <Lbl size={44} color={MUTED} style={{flex: 1}}>{calc}</Lbl>
    <Big size={size} color={color}>{val}</Big>
  </div>
);
const Yield = ({F}) => (
  <AbsoluteFill>
    <Row y={190} gap={50} style={{alignItems: 'center'}}>
      <div style={popS(F, L(77) - 0.2)}><Card w={360} h={480}><GrowBag w={150} grow={1} /><Lbl size={36} color={MUTED}>एक बॅग</Lbl></Card></div>
      <ArrowR F={F} t={K.g950 - 0.3} w={110} />
      <div style={popS(F, K.g950 - 0.15)}><Card w={420} h={480}><Crate w={260} kind="oyster" /><Big size={96}>~{dev(950)} ग्रॅम</Big></Card></div>
      <Big size={110} color={MUTED} style={fadeUp(F, K.kg2950 - 0.5)}>→</Big>
      <div style={popS(F, K.kg2950 - 0.2, 10)}>
        <Card w={560} h={480} style={{background: '#FFFBEF', border: `4px solid ${Y}`}}>
          <Lbl size={40} color={MUTED}>एकूण उत्पादन</Lbl>
          <Big size={124}>~<Count F={F} t={K.kg2950 - 0.2} to={2950} d={0.9} /></Big>
          <Lbl size={50}>किलो</Lbl>
        </Card>
      </div>
    </Row>
  </AbsoluteFill>
);
const Ledger = ({F, step}) => (
  <div style={{...abs(260, 150)}}>
    <Card w={1400} h={[220, 370, 590][step]} style={{alignItems: 'stretch', justifyContent: 'flex-start', padding: '30px 70px'}}>
      {step >= 0 && <LRow F={F} t={step === 0 ? K.price180 - 0.3 : -10} label="विक्री" calc={<>{dev('2,950')} किलो × ₹{dev(180)}</>}
        val={step === 0 ? <>₹<Count F={F} t={K.r531 - 0.3} to={531000} d={1.0} /></> : inr(531000)} color={C_GREEN} />}
      {step >= 1 && <LRow F={F} t={step === 1 ? K.r40 - 0.3 : -10} label="खर्च" calc={<>{dev('3,100')} बॅग्स × ₹{dev(40)}</>}
        val={step === 1 ? <>₹<Count F={F} t={K.r124 - 0.3} to={124000} d={1.0} /></> : inr(124000)} color={C_RED} />}
      {step >= 2 && (
        <div style={{display: 'flex', alignItems: 'center', gap: 30, height: 200, ...fadeUp(F, K.diff - 0.2)}}>
          <Lbl size={48} style={{width: 240}}>फरक</Lbl>
          <Lbl size={44} color={MUTED} style={{flex: 1}}>{inr(531000)} − {inr(124000)}</Lbl>
          <div style={popS(F, K.r407 - 0.2, 10)}><Big size={130}><Marker F={F} t={K.r407 + 0.4}>₹<Count F={F} t={K.r407 - 0.2} to={407000} d={1.0} /></Marker></Big></div>
        </div>
      )}
    </Card>
  </div>
);
const Sales = ({F}) => (
  <AbsoluteFill>
    <Ledger F={F} step={0} />
    <div style={{...abs(1440, 120), ...popS(F, K.price180 - 0.1)}}><Chip color={GOLD_T} size={40}>₹{dev(180)} / किलो</Chip></div>
    <div style={{...abs(1240, 330)}}><Stamp F={F} t={K.r531 + 0.2} color={C_GREEN} rot={-6} size={44}>एकूण विक्री</Stamp></div>
  </AbsoluteFill>
);
const Cost = ({F}) => <AbsoluteFill><Ledger F={F} step={1} /><div style={{...abs(1440, 120), ...popS(F, K.r40 - 0.1)}}><Chip color={C_RED} size={40}>₹{dev(40)} / बॅग</Chip></div></AbsoluteFill>;
const Diff = ({F}) => <AbsoluteFill><Ledger F={F} step={2} /></AbsoluteFill>;
const MINUS = [['worker', 'मजुरी', 'mLabour'], ['bolt', 'वीज', 'mPower'], ['box', 'पॅकिंग', 'mPack'], ['truck', 'वाहतूक', 'mTrans'], ['ledger', 'इतर खर्च', 'mOther']];
const NotProfit = ({F}) => {
  const k = MINUS.filter(([, , c]) => F >= s(K[c])).length;
  return (
    <AbsoluteFill>
      <div style={{...abs(560, 140), ...fadeUp(F, L(88) - 0.4)}}>
        <Card w={800} h={300}>
          <Big size={150} style={{opacity: 1 - k * 0.1}}>{inr(407000)}</Big>
          <div style={{...abs(470, 210)}}><Stamp F={F} t={K.notFinal} rot={-8} size={52}>अंतिम नफा नाही</Stamp></div>
        </Card>
      </div>
      <Row y={540} gap={30}>
        {MINUS.map(([ic, l, c]) => (
          <div key={l} style={drop(F, K[c] - 0.1, 160)}>
            <Card w={290} h={250} pad={14}><Tile ic={ic} size={100} bg="#FFE8E8" color={C_RED} /><Lbl size={38} color={C_RED}>− {l}</Lbl></Card>
          </div>
        ))}
      </Row>
    </AbsoluteFill>
  );
};
const Slider = ({F, label, v, color}) => (
  <div style={{width: 640}}>
    <Lbl size={40} color={MUTED}>{label}</Lbl>
    <div style={{position: 'relative', height: 60, marginTop: 14}}>
      <div style={{...abs(0, 24), width: 640, height: 12, borderRadius: 6, background: 'rgba(0,0,0,0.08)'}} />
      <div style={{...abs(0, 24), width: 640 * v, height: 12, borderRadius: 6, background: color}} />
      <div style={{...abs(640 * v - 30, 0), width: 60, height: 60, borderRadius: 30, background: '#fff', border: `6px solid ${color}`, boxSizing: 'border-box', boxShadow: '0 8px 16px rgba(0,0,0,0.15)'}} />
    </div>
  </div>
);
const Depends = ({F}) => {
  const a = 0.5 + 0.3 * Math.sin((F - s(K.costDep)) / 22) * io(F, s(K.costDep - 0.2), s(K.costDep));
  const b = 0.5 + 0.3 * Math.sin((F - s(K.rateDep)) / 26 + 1) * io(F, s(K.rateDep - 0.2), s(K.rateDep));
  const p = Math.max(0.08, Math.min(1, 0.55 + (b - a) * 1.2));
  return (
    <AbsoluteFill>
      <div style={{...abs(220, 200), display: 'flex', flexDirection: 'column', gap: 70, ...fadeUp(F, L(93) - 0.3)}}>
        <div style={popS(F, K.costDep - 0.2)}><Slider F={F} label="उत्पादन खर्च" v={a} color={C_RED} /></div>
        <div style={popS(F, K.rateDep - 0.2)}><Slider F={F} label="विक्रीचा दर" v={b} color={C_GREEN} /></div>
      </div>
      <div style={{...abs(1120, 170), ...popS(F, K.realProfit - 0.2)}}>
        <Card w={560} h={580} style={{justifyContent: 'flex-end', paddingBottom: 40}}>
          <div style={{width: 200, height: 380 * p, borderRadius: 24, background: `linear-gradient(180deg, ${Y}, ${GOLD_T})`}} />
          <Lbl size={48}>प्रत्यक्ष नफा</Lbl>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* --- chapter 6: the real problem --- */
const Problem = ({F}) => (
  <AbsoluteFill>
    <Row y={200} gap={90} style={{alignItems: 'center'}}>
      <div style={{position: 'relative', ...popS(F, K.notProd - 0.2)}}>
        <Card w={560} h={520} style={{opacity: 0.6}}><Crate w={300} /><Lbl size={54}>उत्पादन</Lbl></Card>
        <div style={{...abs(380, -30)}}><div style={{width: 90, height: 90, borderRadius: 45, background: C_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Tick size={90} /></div></div>
      </div>
      <div style={{position: 'relative', ...popS(F, K.sales - 0.15, 9)}}>
        <Card w={620} h={580} style={{border: `5px solid ${C_RED}`, boxShadow: '0 30px 70px rgba(239,68,68,0.25)', transform: `translateX(${F < s(K.sales + 0.6) && F > s(K.sales) ? Math.sin(F * 1.4) * 6 : 0}px)`}}>
          <Tile ic="cart" size={200} bg="#FFE8E8" color={C_RED} /><Lbl size={64} color={C_RED}>विक्री</Lbl>
        </Card>
        <div style={{...abs(430, -40), ...popS(F, K.sales + 0.2)}}><Chip color={C_RED} size={42}>सर्वात मोठी अडचण</Chip></div>
      </div>
    </Row>
  </AbsoluteFill>
);
// 6 crates of 50 kg: k = how many have moved to buyers
const CrateFarm = ({F, shown, moved = 0, movedAt, shake, brown = 0}) => (
  <AbsoluteFill>
    {Array.from({length: 6}).map((_, i) => {
      const m = i < moved ? io(F, s(movedAt + i * 0.12), s(movedAt + i * 0.12) + 16, 0, 1, Easing.inOut(Easing.cubic)) : 0;
      const x0 = 150 + (i % 3) * 280, y0 = 300 + Math.floor(i / 3) * 250, x1 = 1170 + i * 230, y1 = 560;
      const t0 = shown + i * 0.12;
      return (
        <div key={i} style={{...abs(x0 + (x1 - x0) * m + (shake && i >= moved ? Math.sin(F * 1.3 + i) * 4 : 0), y0 + (y1 - y0) * m - Math.sin(m * Math.PI) * 120), opacity: F < s(t0) ? 0 : 1,
          transform: `scale(${1 - 0.15 * m})`, transformOrigin: '0 0'}}>
          <div style={drop(F, t0, 200)}><Crate w={250} label={`${dev(50)} किलो`} brown={i >= moved ? brown : 0} /></div>
        </div>
      );
    })}
  </AbsoluteFill>
);
const Made300 = ({F}) => (
  <AbsoluteFill>
    <CrateFarm F={F} shown={L(99) + 0.1} />
    <div style={{...abs(1080, 300)}}>
      <Lbl size={44} color={MUTED} style={fadeUp(F, L(99))}>एका आठवड्यात तयार</Lbl>
      <Big size={150} style={{marginTop: 20, ...popS(F, K.k300 - 0.2, 12)}}><Count F={F} t={K.k300 - 0.4} to={300} d={0.8} /> किलो</Big>
    </div>
  </AbsoluteFill>
);
const Buy150 = ({F}) => (
  <AbsoluteFill>
    <CrateFarm F={F} shown={-10} moved={3} movedAt={K.buyers} />
    <div style={{...abs(1240, 150), ...popS(F, K.buyers - 0.2)}}>
      <Card w={620} h={300}><Tile ic="users" size={130} bg="#E9F2FF" color={C_BLUE} /><Lbl size={42}>तुमचे ग्राहक</Lbl></Card>
    </div>
    <div style={{...abs(1240, 770), ...popS(F, K.k150 - 0.1)}}><Big size={84} color={C_BLUE}>फक्त {dev(150)} किलो</Big></div>
  </AbsoluteFill>
);
const Leftover = ({F}) => (
  <AbsoluteFill>
    <div style={{opacity: 0.35}}><CrateFarm F={F} shown={-10} moved={3} movedAt={-10} /></div>
    <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)'}}><CrateFarm F={F} shown={-10} moved={3} movedAt={-10} shake /></div>
    <div style={{...abs(150, 170)}}><Chip color={C_RED} size={44}>उरले: {dev(150)} किलो</Chip></div>
    <div style={{...abs(1000, 200), ...popS(F, K.what - 0.2, 8)}}><Big size={380} color={C_RED} style={{transform: `rotate(${Math.sin(F / 6) * 6}deg)`}}>?</Big></div>
  </AbsoluteFill>
);
const Fresh = ({F}) => {
  const b = io(F, s(K.fresh), s(K.soon + 1.2), 0, 0.9);
  const day = 1 + Math.floor(b / 0.9 * 3.99);
  return (
    <AbsoluteFill>
      <div style={{...abs(250, 230), filter: `sepia(${b}) saturate(${1 + b}) brightness(${1 - b * 0.35})`, transform: `scale(${1 - b * 0.08}) rotate(${b * 4}deg)`, transformOrigin: '50% 100%', display: 'flex', alignItems: 'flex-end'}}>
        <ButtonM size={360} /><div style={{marginLeft: -100}}><OysterM size={320} /></div>
      </div>
      <div style={{...abs(1090, 220), ...fadeUp(F, K.fresh - 0.2)}}>
        <Card w={560} h={420}>
          <Tile ic="cal" size={130} bg="#FFF1DC" color={C_ORANGE} />
          <Big size={110}>दिवस {dev(Math.min(4, day))}</Big>
          <div style={{width: 400}}><div style={{height: 24, borderRadius: 12, background: `linear-gradient(90deg, ${C_GREEN}, ${C_ORANGE}, ${C_RED})`, clipPath: `inset(0 ${100 - (b / 0.9) * 100}% 0 0)`}} /></div>
        </Card>
      </div>
      <div style={{...abs(1180, 690), ...popS(F, K.soon - 0.1)}}><Chip color={C_RED} size={44}>लवकर विकावे लागतील</Chip></div>
    </AbsoluteFill>
  );
};
const Cheap = ({F}) => {
  const d = io(F, s(K.lessProfit - 0.2), s(K.lessProfit + 0.8), 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(230, 220), ...popS(F, K.cheap - 0.2)}}>
        <Card w={640} h={500}>
          <div style={{position: 'relative'}}><Big size={130} color={MUTED}>₹{dev(180)}</Big><div style={{...abs(-10, 62), height: 10, borderRadius: 5, background: C_RED, width: `${io(F, s(K.cheap), s(K.cheap) + 8) * 108}%`}} /></div>
          <Big size={150} color={C_RED} style={popS(F, K.cheap + 0.3)}>₹{dev(120)}</Big>
          <Lbl size={40} color={MUTED}>प्रति किलो</Lbl>
        </Card>
      </div>
      <div style={{...abs(1050, 170), ...fadeUp(F, K.lessProfit - 0.4)}}>
        <Card w={620} h={600} style={{justifyContent: 'flex-end', paddingBottom: 40}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 60}}>
            <div style={{width: 160, height: 360, borderRadius: 22, background: 'rgba(0,0,0,0.1)'}} />
            <div style={{width: 160, height: 360 - 250 * d, borderRadius: 22, background: C_RED}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><G size={54} color={C_RED} sw={5}><g transform="rotate(180 32 32)">{I.arrowUp}</g></G><Lbl size={50} color={C_RED}>नफा</Lbl></div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
const CustFirst = ({F}) => (
  <AbsoluteFill>
    <Row y={230} gap={60} style={{alignItems: 'center'}}>
      <div style={popS(F, K.custUp - 0.2)}>
        <Card w={600} h={480} style={{border: `5px solid ${Y}`}}>
          <div style={{...abs(30, 30), width: 70, height: 70, borderRadius: 35, background: Y, fontSize: 42, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 7, boxSizing: 'border-box'}}>{dev(1)}</div>
          <Tile ic="users" size={170} bg="#E9F2FF" color={C_BLUE} /><Lbl size={54}>ग्राहक वाढवा</Lbl>
        </Card>
      </div>
      <ArrowR F={F} t={K.custUp + 0.3} w={150} color={GOLD_T} />
      <div style={popS(F, K.prodUp - 0.4)}>
        <Card w={600} h={480} style={{opacity: 0.8}}>
          <div style={{...abs(30, 30), width: 70, height: 70, borderRadius: 35, background: 'rgba(0,0,0,0.08)', fontSize: 42, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 7, boxSizing: 'border-box'}}>{dev(2)}</div>
          <Crate w={300} /><Lbl size={54}>मग उत्पादन</Lbl>
        </Card>
      </div>
    </Row>
  </AbsoluteFill>
);

/* --- chapter 7: more money --- */
const More = ({F}) => (
  <AbsoluteFill>
    <Glow x={960} y={480} r={420} o={0.4} />
    <div style={{...abs(760, 160), width: 400, height: 640, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
      {Array.from({length: 9}).map((_, i) => {
        const t0 = L(109) + i * 0.14;
        const p = io(F, s(t0), s(t0) + 8, 0, 1, Easing.out(Easing.back(2)));
        return <div key={i} style={{width: 260, height: 54, marginTop: -8, borderRadius: '50%', background: `linear-gradient(180deg, #FFE58A, ${Y} 50%, #C98A00)`, border: '3px solid #B07800', opacity: F < s(t0) ? 0 : 1, transform: `translateY(${(1 - p) * -200}px)`}} />;
      })}
    </div>
    <div style={{...abs(1180, 230), ...popS(F, K.more - 0.1)}}><Big size={180} color={C_GREEN}>+₹</Big></div>
  </AbsoluteFill>
);
const Products = ({F}) => (
  <AbsoluteFill>
    <Row y={180} gap={60}>
      <div style={popS(F, K.dry - 0.15)}><Card w={460} h={600}><Pouch w={230} label="DRY" /><Lbl size={44}>ड्राय मशरूम</Lbl></Card></div>
      <div style={popS(F, K.powder - 0.15)}><Card w={460} h={600}><Jar w={220} label="POWDER" /><Lbl size={44}>मशरूम पावडर</Lbl></Card></div>
      <div style={popS(F, K.pickle - 0.15)}><Card w={460} h={600}><Jar w={220} fill="#D9822B" label="PICKLE" lid={C_RED} bits /><Lbl size={44}>मशरूम पिकल</Lbl></Card></div>
    </Row>
  </AbsoluteFill>
);
const Dry = ({F}) => {
  const dry = io(F, s(K.sun), s(K.sun + 1.2), 0, 1);
  return (
    <AbsoluteFill>
      <Row y={210} gap={40} style={{alignItems: 'center'}}>
        <div style={popS(F, K.dryFresh - 0.2)}><Card w={400} h={460}><ButtonM size={230} /><Lbl size={42}>ताजे</Lbl></Card></div>
        <ArrowR F={F} t={K.sun - 0.3} w={100} />
        <div style={popS(F, K.sun - 0.15)}>
          <Card w={400} h={460}>
            <div style={{transform: `rotate(${F}deg)`}}><G size={120} color={C_ORANGE} sw={3.6}>{I.sun}</G></div>
            <div style={{display: 'flex', gap: 10}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 70, height: 40, borderRadius: '50% 50% 20% 20%', background: dry > 0.5 ? '#B8875A' : '#F4EBDC', border: '3px solid #8C6239', transform: `scale(${1 - dry * 0.3})`}} />)}</div>
            <Lbl size={42}>सुकवणे</Lbl>
          </Card>
        </div>
        <ArrowR F={F} t={K.pack - 0.3} w={100} />
        <div style={popS(F, K.pack - 0.15)}><Card w={400} h={460}><Pouch w={190} label="DRY" /><Lbl size={42}>पॅकिंग</Lbl></Card></div>
      </Row>
      <Row y={720} gap={30}>
        <div style={popS(F, K.store)}><Chip color={C_BLUE} size={42}>जास्त दिवस साठवण</Chip></div>
        <div style={popS(F, K.sell)}><Chip color={C_GREEN} size={42}>नवी विक्री</Chip></div>
      </Row>
    </AbsoluteFill>
  );
};
const Powder = ({F}) => (
  <AbsoluteFill>
    <Row y={200} gap={60} style={{alignItems: 'center'}}>
      <div style={popS(F, L(118) - 0.2)}><Card w={460} h={540}><Jar w={220} label="POWDER" /><Lbl size={42}>मशरूम पावडर</Lbl></Card></div>
      <ArrowR F={F} t={K.powderUse - 0.4} w={130} />
      {[['सूप', '#E9A23B'], ['सॉस', '#D9473A'], ['मसाले', '#B7832A']].map(([l, c], i) => (
        <div key={l} style={popS(F, K.powderUse - 0.1 + i * 0.15)}>
          <Card w={300} h={380}>
            <svg viewBox="0 0 120 80" width="190" height="130"><path d="M8 30 H112 Q108 74 60 76 Q12 74 8 30 Z" fill="#fff" stroke="#DCCFB8" strokeWidth="3" /><ellipse cx="60" cy="30" rx="52" ry="10" fill={c} /></svg>
            <Lbl size={40}>{l}</Lbl>
          </Card>
        </div>
      ))}
    </Row>
  </AbsoluteFill>
);
const Brand = ({F}) => (
  <AbsoluteFill>
    <Glow x={960} y={460} r={460} o={0.4} />
    <Row y={170} gap={50}>
      <div style={drop(F, L(119))}><Pouch w={260} label="DRY" color="#1F1F22" brand="तुमचा ब्रँड" /></div>
      <div style={drop(F, L(119) + 0.15)}><Jar w={250} label="तुमचा ब्रँड" lid="#1F1F22" /></div>
      <div style={drop(F, L(119) + 0.3)}><Jar w={250} fill="#D9822B" label="तुमचा ब्रँड" lid="#1F1F22" bits /></div>
    </Row>
    <div style={{...abs(760, 640), ...popS(F, K.brand - 0.1)}}><Chip color={GOLD_T} size={50}>स्वतःचा फूड ब्रँड</Chip></div>
  </AbsoluteFill>
);
const License = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(380, 160), ...fadeUp(F, L(121) - 0.4)}}>
      <Card w={1160} h={640} style={{alignItems: 'stretch', padding: '50px 70px', gap: 28}}>
        {[['process', 'योग्य प्रक्रिया', K.lic1], ['box', 'पॅकेजिंग', K.lic2], ['license', 'फूड लायसन्स', K.lic3]].map(([ic, l, t]) => (
          <div key={l} style={{display: 'flex', alignItems: 'center', gap: 34, height: 150, padding: '0 34px', borderRadius: 26, background: F >= s(t) ? '#F2FBF5' : 'rgba(0,0,0,0.03)', border: `1.5px solid ${LINE}`}}>
            <Tile ic={ic} size={100} bg="#E8F5EC" color={C_GREEN} /><Lbl size={56} style={{flex: 1}}>{l}</Lbl>
            {F >= s(t) && <div style={popS(F, t)}><Tick size={70} /></div>}
          </div>
        ))}
      </Card>
    </div>
  </AbsoluteFill>
);

/* --- chapter 8: scale up --- */
const Running = ({F}) => (
  <AbsoluteFill>
    <Row y={180} gap={60}>
      <div style={popS(F, K.regular - 0.2)}>
        <Card w={720} h={620} style={{alignItems: 'stretch', justifyContent: 'flex-start', padding: '40px 50px', gap: 22}}>
          <Lbl size={44} color={MUTED}>नियमित ग्राहक</Lbl>
          {['रेस्टॉरंट', 'हॉटेल', 'कॅफे', 'भाजी विक्रेते'].map((n, i) => (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 22, height: 90, ...fadeUp(F, K.regular + i * 0.15)}}>
              <Tile ic={['restaurant', 'hotel', 'cafe', 'veg'][i]} size={76} /><Lbl size={42} style={{flex: 1}}>{n}</Lbl><Chip color={C_GREEN} size={30}>दर आठवड्याला</Chip>
            </div>
          ))}
        </Card>
      </div>
      <div style={popS(F, K.steady - 0.2)}>
        <Card w={720} h={620} style={{alignItems: 'stretch', justifyContent: 'flex-start', padding: '40px 50px'}}>
          <Lbl size={44} color={MUTED}>उत्पादन (किलो / आठवडा)</Lbl>
          <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 26, paddingTop: 30}}>
            {[0.62, 0.66, 0.64, 0.68, 0.66, 0.7].map((v, i) => <div key={i} style={{flex: 1, borderRadius: 14, background: C_GREEN, height: `${io(F, s(K.steady + i * 0.08), s(K.steady + i * 0.08) + 12) * v * 100}%`}} />)}
          </div>
        </Card>
      </div>
    </Row>
  </AbsoluteFill>
);
const Growth = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(360, 150), ...fadeUp(F, L(127) - 0.3)}}>
      <Card w={1200} h={660} style={{justifyContent: 'flex-end', padding: '40px 70px'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 30, width: '100%', height: 520}}>
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{flex: 1, borderRadius: 14, background: i > 6 ? Y : C_GREEN, height: `${io(F, s(K.grow - 0.3 + i * 0.1), s(K.grow - 0.3 + i * 0.1) + 12) * (22 + i * i * 0.85 + i * 2)}%`}} />)}
        </div>
        <div style={{...abs(60, 40)}}><Chip color={C_GREEN} size={40}>हळूहळू वाढ</Chip></div>
      </Card>
    </div>
  </AbsoluteFill>
);
const Hub = ({F, t, children, color = Y, w = 300}) => (
  <div style={popS(F, t)}><div style={{width: w, height: w, borderRadius: '50%', background: '#fff', border: `8px solid ${color}`, boxShadow: '0 20px 50px rgba(60,45,10,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>{children}</div></div>
);
const Link = ({F, t, x1, y1, x2, y2, color = GOLD_T}) => {
  const p = io(F, s(t), s(t) + 12);
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth="6" strokeDasharray="14 12" strokeDashoffset={-F} strokeLinecap="round" />;
};
const Expand = ({F}) => {
  const outs = [['restaurant', 'अधिक रेस्टॉरंट्स', K.moreResto, 240], ['store', 'सुपरमार्केट', K.superm2, 480], ['sparkle', 'स्वतःचा ब्रँड', K.ownBrand, 720]];
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{position: 'absolute'}}>{outs.map(([, , t, y]) => <Link key={y} F={F} t={t - 0.3} x1={700} y1={480} x2={1180} y2={y} />)}</svg>
      <div style={{...abs(400, 330)}}><Hub F={F} t={L(128) - 0.3}><GrowBag w={80} grow={1} /><Lbl size={34}>तुमचा फार्म</Lbl></Hub></div>
      {outs.map(([ic, l, t, y]) => (
        <div key={l} style={{...abs(1180, y - 85), ...popS(F, t - 0.1)}}>
          <Card w={520} h={170} style={{flexDirection: 'row', justifyContent: 'flex-start', padding: '0 30px', gap: 26}}><Tile ic={ic} size={100} /><Lbl size={44}>{l}</Lbl></Card>
        </div>
      ))}
    </AbsoluteFill>
  );
};
const Aggregate = ({F}) => (
  <AbsoluteFill>
    <svg width="1920" height="1080" style={{position: 'absolute'}}>
      {[260, 480, 700].map((y, i) => <Link key={y} F={F} t={K.farmers + i * 0.1} x1={470} y1={y} x2={820} y2={480} color={C_GREEN} />)}
      {[300, 660].map((y, i) => <Link key={y} F={F} t={K.underBrand + 0.2 + i * 0.1} x1={1100} y1={480} x2={1430} y2={y} />)}
    </svg>
    {[260, 480, 700].map((y, i) => (
      <div key={y} style={{...abs(170, y - 90), ...popS(F, K.farmers - 0.2 + i * 0.12)}}>
        <Card w={300} h={180} style={{flexDirection: 'row', gap: 18, padding: 10}}><Tile ic="farmer" size={90} bg="#E8F5EC" color={C_GREEN} /><Lbl size={34}>शेतकरी {dev(i + 1)}</Lbl></Card>
      </div>
    ))}
    <div style={{...abs(810, 330)}}><Hub F={F} t={K.underBrand - 0.2} w={300}><Pouch w={100} label="" color="#1F1F22" /><Lbl size={30}>तुमचा ब्रँड</Lbl></Hub></div>
    {[['store', 'सुपरमार्केट', 300], ['restaurant', 'रेस्टॉरंट्स', 660]].map(([ic, l, y]) => (
      <div key={l} style={{...abs(1430, y - 90), ...popS(F, K.underBrand + 0.4)}}><Card w={360} h={180} style={{flexDirection: 'row', gap: 18, padding: 10}}><Tile ic={ic} size={90} /><Lbl size={36}>{l}</Lbl></Card></div>
    ))}
  </AbsoluteFill>
);
const Supply = ({F}) => {
  const tx = ((F - s(K.company)) % 90) / 90;
  return (
    <AbsoluteFill>
      <Row y={210} gap={60} style={{alignItems: 'center'}}>
        <div style={popS(F, K.smallFarm - 0.2)}><Card w={380} h={420}><GrowBag w={110} grow={1} /><Lbl size={40}>छोटा फार्म</Lbl></Card></div>
        <ArrowR F={F} t={K.company - 0.5} w={150} color={GOLD_T} />
        <div style={{...popS(F, K.company - 0.2, 10), position: 'relative'}}>
          <Card w={820} h={520} style={{background: '#FFFBEF', border: `4px solid ${Y}`, overflow: 'hidden'}}>
            <svg viewBox="0 0 400 180" width="560" height="250">
              <rect x="40" y="40" width="200" height="130" rx="10" fill="#2F2A22" /><rect x="40" y="20" width="200" height="34" rx="10" fill={Y} />
              {[0, 1, 2, 3].map((i) => <rect key={i} x={60 + i * 45} y="74" width="30" height="30" rx="5" fill="#FFE58A" opacity="0.85" />)}
              <rect x="120" y="120" width="40" height="50" rx="5" fill="#FFE58A" />
              <rect x="250" y="90" width="120" height="80" rx="8" fill="#E9E4DA" />
            </svg>
            <div style={{...abs(F >= s(K.company) ? -200 + tx * 1100 : -300, 222)}}><G size={110} color={C_BLUE} sw={4}>{I.truck}</G></div>
            <Big size={76}>मशरूम सप्लाय कंपनी</Big>
          </Card>
        </div>
      </Row>
    </AbsoluteFill>
  );
};

/* --- chapter 9: three things + close --- */
const Three = ({F}) => {
  const items = [['shield', 'गुणवत्ता + स्वच्छता', K.first, '#E8F5EC', C_GREEN], ['users', 'नियमित ग्राहक + विक्री', K.second, '#E9F2FF', C_BLUE], ['ledger', 'प्रत्येक चक्राचा हिशोब', K.third, '#FFF1DC', C_ORANGE]];
  return (
    <AbsoluteFill>
      <Row y={200} gap={50}>
        {items.map(([ic, l, t, bg, c], i) => (
          <div key={l} style={{...popS(F, t - 0.15), position: 'relative'}}>
            <Card w={520} h={560}>
              <div style={{...abs(30, 30), width: 80, height: 80, borderRadius: 40, background: Y, fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box'}}>{dev(i + 1)}</div>
              <Tile ic={ic} size={200} bg={bg} color={c} /><Lbl size={44}>{l}</Lbl>
            </Card>
          </div>
        ))}
      </Row>
      <Row y={130}><div style={{...popS(F, K.things - 0.1), opacity: F < s(K.first) ? 1 : 0}}><Big size={110}>{dev(3)} गोष्टी</Big></div></Row>
    </AbsoluteFill>
  );
};
const Sold = ({F}) => (
  <AbsoluteFill>
    <Row y={220} gap={46} style={{alignItems: 'center'}}>
      <div style={popS(F, K.readyM - 0.2)}><Card w={420} h={460}><Crate w={260} /><Lbl size={44}>तयार झाले</Lbl></Card></div>
      <Big size={140} color={C_RED} style={popS(F, K.notSuccess - 0.1)}>≠</Big>
      <div style={{...popS(F, K.notSuccess), opacity: F < s(K.rightPrice - 0.2) ? 1 : 0.3}}><Card w={360} h={460}><G size={150} color={MUTED} sw={3.6}>{I.sparkle}</G><Lbl size={44} color={MUTED}>यश</Lbl></Card></div>
      <div style={{...popS(F, K.rightPrice - 0.2), position: 'relative'}}>
        <Card w={560} h={460} style={{border: `5px solid ${C_GREEN}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Tile ic="bag" size={120} bg="#E8F5EC" color={C_GREEN} /><Big size={70} color={C_GREEN}>₹ ✓</Big></div>
          <Lbl size={44}>योग्य किमतीत विक्री</Lbl>
          <div style={popS(F, K.profit - 0.1)}><Chip color={C_GREEN} size={44}>= नफा</Chip></div>
        </Card>
      </div>
    </Row>
  </AbsoluteFill>
);
const StartSmall = ({F}) => {
  const steps = [['छोटी सुरुवात', K.startS], ['१ चक्र पूर्ण', K.oneCycle], ['मग गुंतवणूक वाढवा', K.thenInv]];
  const k = steps.filter(([, t]) => F >= s(t)).length;
  return (
    <AbsoluteFill>
      {steps.map(([l, t], i) => (
        <div key={l} style={{...abs(220 + i * 520, 640 - i * 170), ...popS(F, t - 0.15)}}>
          <div style={{width: 480, height: 150 + i * 170, borderRadius: '28px 28px 0 0', background: i === 2 ? Y : i === 1 ? '#FFE58A' : '#FFF1C4', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 40, boxSizing: 'border-box'}}>
            <Lbl size={46} color={BG}>{l}</Lbl>
          </div>
        </div>
      ))}
      {k > 0 && <div style={{...abs(400 + (k - 1) * 520, 470 - (k - 1) * 170), transition: 'none'}}><Bob F={F} amp={10} speed={6}><ButtonM size={150} /></Bob></div>}
    </AbsoluteFill>
  );
};
const Question = ({F}) => (
  <AbsoluteFill>
    <Row y={150}><div style={popS(F, K.twoLakh - 0.2, 10)}><div style={{display: 'flex', alignItems: 'center', gap: 22}}><Coin size={110} /><Big size={120}>₹२ लाख</Big></div></div></Row>
    <Row y={360} gap={60} style={{alignItems: 'center'}}>
      <div style={popS(F, K.optA - 0.2)}><Card w={620} h={420} style={{border: `4px solid ${C_GREEN}`}}><div style={{...abs(30, 30)}}><Chip color={C_GREEN} size={40}>A</Chip></div><div style={{display: 'flex', gap: 14}}><GrowBag w={110} grow={1} /><GrowBag w={110} grow={1} seed={8} /></div><Lbl size={48}>स्वतःचा मशरूम फार्म</Lbl></Card></div>
      <div style={popS(F, K.optB - 0.3)}><div style={{width: 120, height: 120, borderRadius: 60, background: '#1F1F22', color: '#fff', fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box'}}>की</div></div>
      <div style={popS(F, K.optB - 0.1)}><Card w={620} h={420} style={{border: `4px solid ${C_BLUE}`}}><div style={{...abs(30, 30)}}><Chip color={C_BLUE} size={40}>B</Chip></div><div style={{display: 'flex', gap: 20, alignItems: 'center'}}><Tile ic="farmer" size={110} bg="#E8F5EC" color={C_GREEN} /><ArrowR F={F} t={K.optB2 - 0.3} w={70} /><Pouch w={110} label="" color="#1F1F22" /></div><Lbl size={44}>खरेदी करून स्वतःचा ब्रँड</Lbl></Card></div>
    </Row>
  </AbsoluteFill>
);
const Comment = ({F}) => {
  const txt = 'A — स्वतःचा फार्म सुरू करेन!';
  const n = Math.floor(io(F, s(K.comment), s(K.comment + 1.2), 0, txt.length));
  return (
    <AbsoluteFill>
      <div style={{...abs(460, 260), ...popS(F, L(154) - 0.3)}}>
        <Card w={1000} h={360} style={{alignItems: 'stretch', padding: '40px 50px', gap: 26}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Tile ic="comment" size={80} bg="#FFF4D6" /><Lbl size={42} color={MUTED}>कमेंट करा…</Lbl></div>
          <div style={{height: 110, borderRadius: 20, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '6px 30px 0', fontSize: 50, fontWeight: 500}}>{txt.slice(0, n)}<span style={{opacity: Math.floor(F / 7) % 2, color: C_BLUE}}>|</span></div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
const Subscribe = ({F}) => {
  const clicked = F >= s(K.subscribe + 0.4);
  const cx = io(F, s(K.subscribe - 0.4), s(K.subscribe + 0.3), 1500, 1170, Easing.inOut(Easing.cubic)), cy = io(F, s(K.subscribe - 0.4), s(K.subscribe + 0.3), 900, 560, Easing.inOut(Easing.cubic));
  const press = F >= s(K.subscribe + 0.3) && F < s(K.subscribe + 0.5) ? 0.92 : 1;
  return (
    <AbsoluteFill>
      <div style={{...abs(420, 300), ...popS(F, L(155) - 0.3)}}>
        <Card w={1080} h={360} style={{flexDirection: 'row', gap: 40, padding: '0 50px'}}>
          <div style={{width: 170, height: 170, borderRadius: 40, background: '#fff', border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LogoImg src="youtube.svg" size={130} /></div>
          <div style={{flex: 1}}><Lbl size={50}>बिझनेस ब्रेकडाउन</Lbl><Lbl size={34} color={MUTED} style={{marginTop: 8}}>खरी आर्थिक बाजू</Lbl></div>
          <div style={{transform: `scale(${press})`, background: clicked ? 'rgba(0,0,0,0.08)' : '#FF0000', color: clicked ? TXT : '#fff', borderRadius: 999, padding: '24px 40px 16px', fontSize: 40, fontWeight: 700, whiteSpace: 'nowrap'}}>{clicked ? 'Subscribed' : 'Subscribe'}</div>
          {clicked && <div style={{transform: `rotate(${Math.sin(F / 2) * 18 * (1 - io(F, s(K.subscribe + 0.5), s(K.subscribe + 1.6)))}deg)`, transformOrigin: '50% 0%'}}><G size={70} color={TXT}>{I.bell}</G></div>}
        </Card>
      </div>
      <div style={{...abs(cx, cy), opacity: io(F, s(K.subscribe - 0.4), s(K.subscribe - 0.3))}}>
        <svg viewBox="0 0 24 24" width="70" height="70"><path d="M5 3l14 8-6 1.5L10 19z" fill="#121212" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
};
const Next = ({F}) => (
  <AbsoluteFill>
    <Row y={260} gap={50}>
      {[['?', '#FFF4D6'], ['?', '#E9F2FF'], ['?', '#E8F5EC']].map(([q, bg], i) => (
        <div key={i} style={popS(F, L(157) - 0.2 + i * 0.15)}>
          <Card w={480} h={300} style={{background: bg}}><Big size={130} color={MUTED}>{q}</Big></Card>
        </div>
      ))}
    </Row>
    <Row y={640}><div style={fadeUp(F, K.next)}><Chip color={GOLD_T} size={48}>पुढचा बिझनेस ब्रेकडाउन</Chip></div></Row>
  </AbsoluteFill>
);
const Outro = ({F}) => <WideOutro F={F} at={OUTRO_AT} cta={<Chip color={GOLD_T} size={40}>सबस्क्राइब करा</Chip>} />;

/* ---------- main ---------- */
const COMPS = {
  hook: Hook, ask: Ask, land: Land, room: Room, title: Title,
  how: How, straw: StrawSc, spawn: Spawn, bags: Bags, climate: Climate, noland: NoLand,
  types: Types, button: Button, buttonUse: ButtonUse, oyster: Oyster, milky: Milky, choose: Choose,
  pune: Pune, contacts: Contacts, questions: Questions, five: Five, fifty: Fifty, produce: Produce,
  calc: Calc, roomCost: RoomCost, equip: Equip, small: Small, big: BigSetup, cycle: Cycle, separate: Separate,
  bags3100: Bags3100, yield: Yield, sales: Sales, cost: Cost, diff: Diff, notProfit: NotProfit, depends: Depends,
  problem: Problem, made300: Made300, buy150: Buy150, leftover: Leftover, fresh: Fresh, cheap: Cheap, custFirst: CustFirst,
  more: More, products: Products, dry: Dry, powder: Powder, brand: Brand, license: License,
  running: Running, growth: Growth, expand: Expand, aggregate: Aggregate, supply: Supply,
  three: Three, sold: Sold, startSmall: StartSmall, question: Question, comment: Comment, subscribe: Subscribe, next: Next, outro: Outro,
};
// ambient spores drifting up behind every scene
const Spores = ({f}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {Array.from({length: 26}).map((_, i) => {
      const sp = 0.25 + rnd(i * 7) * 0.5, y = 1100 - ((f * sp + rnd(i) * 1200) % 1200), x = rnd(i * 3) * 1920 + Math.sin(f / 50 + i) * 30, r = 4 + rnd(i * 11) * 8;
      return <div key={i} style={{...abs(x, y), width: r, height: r, borderRadius: '50%', background: i % 3 ? 'rgba(217,154,0,0.22)' : 'rgba(122,90,46,0.15)'}} />;
    })}
  </AbsoluteFill>
);
const SporesNow = () => { const f = useCurrentFrame(); return <Spores f={f} />; };
const Video = () => <WideVideo bgExtra={<SporesNow />} theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} chapters={CHAPTERS} outroAt={OUTRO_AT} />;
// YouTube thumbnail (1920x1080 still; export with: npx remotion still ... Thumb)
const Thumb = () => (
  <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', background: '#F7F3EA'}}>
    <AbsoluteFill style={{background: `radial-gradient(900px 700px at 78% 50%, rgba(255,197,46,0.55), transparent 65%)`}} />
    <div style={{...abs(90, 190)}}>
      <div style={{display: 'inline-block', background: '#121212', color: '#fff', borderRadius: 18, padding: '18px 34px 8px', fontSize: 64, fontWeight: 700}}>मशरूम शेती</div>
      <div style={{fontSize: 210, fontWeight: 800, color: '#121212', lineHeight: 1, marginTop: 40, letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>खरा हिशोब</div>
      <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{background: Y, borderRadius: 22, padding: '6px 40px 0px', fontSize: 120, fontWeight: 800, color: '#121212', whiteSpace: 'nowrap'}}>₹ किती?</div>
        <div style={{fontSize: 56, fontWeight: 600, color: 'rgba(18,18,18,0.6)', lineHeight: 1.1}}>गुंतवणूक<br />+ कमाई</div>
      </div>
    </div>
    <div style={{...abs(1130, 170), display: 'flex', alignItems: 'flex-end'}}>
      <GrowBag w={330} grow={1} seed={4} />
      <div style={{marginLeft: -40}}><ButtonM size={330} /></div>
    </div>
  </AbsoluteFill>
);
const Root = () => (
  <>
    <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1920} height={1080} />
  </>
);
registerRoot(Root);
