/*
 * Construction material business (cement + steel): the real economics. Marathi, 10:43, 16:9. Tarun Udyojak.
 * Look: the channel's dark style (soft cards, line icons, white + #FFD014) with v2 touches: lighter type
 * (500 for headings, 600-700 only for key numbers), keywords only, small real photo cards + brand logos, SFX.
 * Cues are VO seconds from timing.json (scripts/align_vo2.py): S(i)/E(i) sentence start/end, WT(i, 'frag') word time.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Audio, Img, staticFile, Easing} from 'remotion';
import TIMING from './timing.json';
import {
  FPS, BRAND, WHITE, INK, MUTED, DIM, FAINT, RED, F, abs, fr, useT, io, pop, INOUT, Bg, Chrome, Scenes, Card, Hi, Count, Ic, draw,
} from '../../shared/kit.jsx';
import {Sfx} from '../../shared/vox.jsx';

const S = (i) => TIMING[i].start;
const E = (i) => TIMING[i].end;
const WT = (i, frag, n = 0) => {
  const hits = TIMING[i].words.filter(([, w]) => w.includes(frag));
  return (hits[n] || hits[0] || [TIMING[i].start])[0];
};
const cut = (i) => (i === 0 ? 0 : (E(i - 1) + S(i)) / 2);
const TOTAL = 643; // VO ends 638.9 + end card hold
const CEMENT = '#CFC9BE'; // material tint for cement bags (illustration only)
const lakh = (n, d = 2) => `₹${(n / 1e5).toFixed(d)} लाख`;

/* ---------- small helpers ---------- */
const NEVER = 1e9;
const Row = ({children, gap = 24, style}) => <div style={{display: 'flex', alignItems: 'center', gap, ...style}}>{children}</div>;
const T = ({s = 40, w = 400, c = WHITE, style, children}) => <div style={{...F, fontSize: s, fontWeight: w, color: c, paddingTop: s * 0.12, ...style}}>{children}</div>;
const pp = (t, at, d = 13) => (t < at ? 0 : pop(t, at, d));
const outF = (t, out) => io(t, out, out + 0.35, 1, 0);
// rise-in (and optional fade-out)
const ro = (t, at, out = NEVER, dy = 30) => ({opacity: Math.min(io(t, at, at + 0.45), outF(t, out)), transform: `translateY(${io(t, at, at + 0.45, dy, 0)}px)`});
// pop-in (and optional fade-out)
const po = (t, at, out = NEVER) => {
  const p = pp(t, at);
  return {opacity: Math.min(1, p * 1.6) * outF(t, out), transform: `scale(${0.72 + 0.28 * p})`};
};
const strike = (t, at, c = RED, w = '108%') => (
  <div style={abs('-4%', '46%', {width: w, height: 6, borderRadius: 3, background: c, transformOrigin: 'left', transform: `scaleX(${io(t, at, at + 0.3)}) rotate(-3deg)`})} />
);

/* ---------- extra line icons (48 viewBox), falls back to the kit set ---------- */
const LOCAL = {
  bag: <><path d="M13 7h22l4 7-2 26a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4L9 14z" /><path d="M10 14h28M18 24h12M18 31h8" /></>,
  rods: <><path d="M5 33 37 9M9 38 41 14M13 43 45 19" /><path d="M16 21l7 8M27 13l7 8" /></>,
  truck: <><path d="M3 11h26v23H3zM29 19h9l7 8v7H29z" /><circle cx="12" cy="37" r="4" /><circle cx="36" cy="37" r="4" /></>,
  factory: <path d="M4 44V24l10-6v6l10-6v6l10-6V6h8v38zM4 44h40M12 35h4M22 35h4M32 35h4" />,
  warehouse: <path d="M4 44V18L24 6l20 12v26M4 44h40M12 44V26h24v18M12 32h24M12 38h24" />,
  pin: <><path d="M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z" /><circle cx="24" cy="20" r="5" /></>,
  bank: <path d="M4 18 24 6l20 12zM9 18v17M19 18v17M29 18v17M39 18v17M4 39h40M4 44h40" />,
  coil: <><ellipse cx="24" cy="18" rx="17" ry="7" /><ellipse cx="24" cy="26" rx="17" ry="7" /><ellipse cx="24" cy="34" rx="17" ry="7" /></>,
  drop: <><path d="M24 5s14 16 14 26a14 14 0 0 1-28 0c0-10 14-26 14-26z" /><path d="M17 31a7 7 0 0 0 7 7" /></>,
  brick: <path d="M4 12h40v26H4zM4 25h40M18 12v13M32 12v13M11 25v13M25 25v13M39 25v13" />,
  pile: <><path d="M3 40c8-17 14-25 21-25s13 8 21 25z" /><path d="M16 31h3M27 27h3M23 35h3M31 34h3" /></>,
  block: <path d="M6 14h36v22H6zM6 14l6-6h36l-6 6M42 36l6-6V8M17 20h6v10h-6zM27 20h6v10h-6z" />,
  pipe: <path d="M5 15h25a10 10 0 0 1 10 10v18M5 27h21v16M2 12v18M37 43h12" />,
  scale: <path d="M24 7v30M12 43h24M9 14h30M9 14 3 28h12zM39 14l-6 14h12zM3 28a6 3 0 0 0 12 0M33 28a6 3 0 0 0 12 0" />,
  rack: <path d="M7 6v38M41 6v38M7 15h34M7 27h34M7 39h34" />,
  box: <path d="M6 14 24 6l18 8v20l-18 8-18-8zM6 14l18 8 18-8M24 22v20" />,
  loop: <><path d="M38 17A16 16 0 1 0 40 30" /><path d="M39 6v11H28" /></>,
  helmet: <path d="M8 31a16 16 0 0 1 32 0M4 31h40v6H4zM24 13v9M17 16v7M31 16v7" />,
  people: <><circle cx="12" cy="15" r="5" /><circle cx="24" cy="13" r="5" /><circle cx="36" cy="15" r="5" /><path d="M3 38c0-7 4-11 9-11s9 4 9 11M15 36c0-8 4-12 9-12s9 4 9 12M27 38c0-7 4-11 9-11s9 4 9 11" /></>,
  key: <><circle cx="15" cy="30" r="9" /><path d="M21 24 40 6M33 13l5 5M28 18l4 4" /></>,
  spark: <path d="M24 4v12M24 32v12M4 24h12M32 24h12M10 10l7 7M31 31l7 7M38 10l-7 7M17 31l-7 7" />,
};
const Ix = ({n, size = 40, color = WHITE, sw = 3.4}) => (LOCAL[n]
  ? <svg viewBox="0 0 48 48" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>
      <g fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{LOCAL[n]}</g>
    </svg>
  : <Ic n={n} size={size} color={color} sw={sw} />);

/* ---------- building blocks ---------- */
const Eyebrow = ({children, color = BRAND, icon}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px 8px', borderRadius: 100, border: `2px solid ${color}66`, background: `${color}14`}}>
    {icon && <Ix n={icon} size={28} color={color} sw={3.8} />}
    <div style={{...F, fontSize: 30, fontWeight: 500, color}}>{children}</div>
  </div>
);
const Pill = ({t, at, out, icon, children, c = WHITE, bg = 'rgba(255,255,255,0.07)', bd = 'rgba(255,255,255,0.14)', s = 36, w = 400, x, y, center, style}) => (
  <div style={x !== undefined ? abs(x, y, center ? {transform: 'translateX(-50%)'} : {}) : {display: 'inline-block'}}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: s * 0.38, padding: `${s * 0.34}px ${s * 0.62}px ${s * 0.22}px`, borderRadius: 100, background: bg, border: `2px solid ${bd}`, whiteSpace: 'nowrap', ...po(t, at, out ?? NEVER), ...style}}>
      {icon && <div style={{marginTop: -s * 0.1}}><Ix n={icon} size={s * 0.95} color={c} /></div>}
      <T s={s} w={w} c={c} style={{paddingTop: s * 0.06}}>{children}</T>
    </div>
  </div>
);
const YPill = (p) => <Pill bg="rgba(255,208,20,0.12)" bd="rgba(255,208,20,0.55)" c={BRAND} {...p} />;
const RPill = (p) => <Pill bg="rgba(255,90,82,0.12)" bd="rgba(255,90,82,0.6)" c={RED} {...p} />;

// round node; (x, y) is the circle centre
const Node = ({t, at, out, x, y, icon, label, sub, r = 84, glow, c = WHITE, ring}) => (
  <div style={abs(x - r, y - r, {width: r * 2, height: r * 2, ...po(t, at, out ?? NEVER)})}>
    <div style={{width: r * 2, height: r * 2, borderRadius: r, background: glow ? 'rgba(255,208,20,0.10)' : 'rgba(255,255,255,0.06)',
      border: `2px solid ${ring || (glow ? 'rgba(255,208,20,0.65)' : 'rgba(255,255,255,0.14)')}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: glow ? '0 0 70px rgba(255,208,20,0.22)' : '0 20px 50px rgba(0,0,0,0.35)'}}>
      <Ix n={icon} size={r * 0.95} color={glow ? BRAND : c} sw={3} />
    </div>
    {label && <T s={36} w={500} style={abs(r, r * 2 + 16, {transform: 'translateX(-50%)', textAlign: 'center'})}>{label}</T>}
    {sub && <T s={28} c={MUTED} style={abs(r, r * 2 + 62, {transform: 'translateX(-50%)', textAlign: 'center'})}>{sub}</T>}
  </div>
);

// arrow (draws on); bend > 0 curves it; dashed arrows fade in with a flowing dash
const Arrow = ({t, at, out, x1, y1, x2, y2, c = 'rgba(255,255,255,0.45)', w = 4, dash, d = 0.5, bend = 0, head = true}) => {
  if (t < at) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const p = io(t, at, at + d);
  const o = outF(t, out ?? NEVER);
  const a = Math.atan2(y2 - my, x2 - mx), L = 18;
  const hd = `M${x2 - L * Math.cos(a - 0.5)} ${y2 - L * Math.sin(a - 0.5)} L${x2} ${y2} L${x2 - L * Math.cos(a + 0.5)} ${y2 - L * Math.sin(a + 0.5)}`;
  const path = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  return (
    <svg style={abs(0, 0, {opacity: o, pointerEvents: 'none'})} width="1920" height="1080">
      {dash
        ? <path d={path} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray="4 16" strokeDashoffset={-t * 40} opacity={p} />
        : <path d={path} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" {...draw(p)} />}
      {head && <path d={hd} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={io(t, at + d * 0.8, at + d)} />}
    </svg>
  );
};

// small real-photo card (never full screen)
const Photo = ({t, at, out, src, x, y, w, h, label, pos = '50% 50%', r = 26}) => (
  <div style={abs(x, y, {width: w, height: h, ...po(t, at, out ?? NEVER)})}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: r, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.16)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', background: '#222'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${io(t, at, at + 12, 1.0, 1.08, Easing.linear)})`}} />
      {label && <>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 52%, rgba(0,0,0,0.62))'}} />
        <T s={34} w={500} style={{position: 'absolute', left: 22, bottom: 14}}>{label}</T>
      </>}
    </div>
  </div>
);

// brand logo tile (white); without src it shows the name as a clean wordmark
const Logo = ({t, at, out, src, name, sub, x, y, w = 290, h = 150}) => (
  <div style={abs(x, y, {width: w, ...po(t, at, out ?? NEVER)})}>
    <div style={{width: w, height: h, borderRadius: 22, background: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
      {src ? <Img src={staticFile(src)} style={{maxWidth: w - 56, maxHeight: h - 52, objectFit: 'contain'}} /> : <T s={50} w={600} c={INK}>{name}</T>}
    </div>
    {sub && <T s={30} c={MUTED} style={{textAlign: 'center', marginTop: 14}}>{sub}</T>}
  </div>
);

const Bag = ({w = 40, h = 46, o = 1, fill = CEMENT}) => (
  <div style={{width: w, height: h, borderRadius: `${w * 0.16}px ${w * 0.16}px ${w * 0.24}px ${w * 0.24}px`, background: fill, opacity: o, position: 'relative', boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.14)'}}>
    <div style={abs(w * 0.18, h * 0.42, {width: w * 0.64, height: Math.max(3, h * 0.09), borderRadius: 2, background: 'rgba(0,0,0,0.18)'})} />
  </div>
);

// receipt line: muted label left, value right
const Line = ({t, at, left, right, rs = 56, rc = WHITE, rw = 500, ls = 38, icon}) => (
  <Row style={{justifyContent: 'space-between', ...ro(t, at)}}>
    <Row gap={18}>{icon && <Ix n={icon} size={42} color={MUTED} />}<T s={ls} c={MUTED}>{left}</T></Row>
    <T s={rs} w={rw} c={rc}>{right}</T>
  </Row>
);
const Divider = ({t, at}) => <div style={{height: 2, background: 'rgba(255,255,255,0.12)', margin: '26px 0', transformOrigin: 'left', transform: `scaleX(${io(t, at, at + 0.5)})`}} />;
const Title = ({t, at, out, children, y = 180, s = 64, w = 500, c = WHITE, x = 960}) => (
  <T s={s} w={w} c={c} style={abs(x, y, {transform: `translateX(-50%) translateY(${io(t, at, at + 0.45, 26, 0)}px)`, opacity: Math.min(io(t, at, at + 0.45), outF(t, out ?? NEVER)), textAlign: 'center'})}>{children}</T>
);
const Brow = ({t, at, out, children, icon, color, y = 170}) => (
  <div style={abs(960, y, {translate: '-50% 0', ...ro(t, at, out ?? NEVER)})}><Eyebrow icon={icon} color={color}>{children}</Eyebrow></div>
);

/* ===================================================================== */
/* 01 Hook: a day at a cement shop                                          */
const TruckArt = ({w = 440, bags = 12}) => (
  <svg viewBox="0 0 230 120" width={w} style={{overflow: 'visible'}}>
    <rect x="6" y="22" width="138" height="70" rx="6" fill="rgba(255,255,255,0.05)" stroke={WHITE} strokeWidth="3" />
    {Array.from({length: 12}).map((_, i) => i < bags && (
      <rect key={i} x={14 + (i % 6) * 21} y={62 - Math.floor(i / 6) * 22} width="18" height="20" rx="4" fill={CEMENT} />
    ))}
    <path d="M144 42h44l26 30v20h-70z" fill="rgba(255,255,255,0.05)" stroke={WHITE} strokeWidth="3" strokeLinejoin="round" />
    <path d="M154 50h30l17 20h-47z" fill="rgba(255,208,20,0.25)" stroke={WHITE} strokeWidth="2" strokeLinejoin="round" />
    {[40, 110, 190].map((x) => <g key={x}><circle cx={x} cy="98" r="15" fill="#111" stroke={WHITE} strokeWidth="3" /><circle cx={x} cy="98" r="5" fill={WHITE} /></g>)}
  </svg>
);

const ShopArt = ({t, n = 0}) => (
  <div style={{position: 'relative', width: 520, height: 460}}>
    <svg viewBox="0 0 520 460" width="520" height="460" style={{position: 'absolute', overflow: 'visible'}}>
      <rect x="20" y="104" width="480" height="356" rx="6" fill="rgba(255,255,255,0.04)" stroke={WHITE} strokeWidth="3" />
      <rect x="70" y="190" width="380" height="270" fill="#141416" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      {Array.from({length: 8}).map((_, i) => (
        <path key={i} d={`M${20 + i * 60} 104 h60 v34 a30 22 0 0 1 -60 0z`} fill={i % 2 ? 'rgba(255,255,255,0.10)' : BRAND} stroke="none" />
      ))}
      <rect x="20" y="20" width="480" height="70" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* rods leaning in the right corner */}
      {[0, 1, 2, 3].map((i) => <line key={i} x1={360 + i * 14} y1="455" x2={400 + i * 14} y2="215" stroke="#8FA3B3" strokeWidth="5" strokeLinecap="round" />)}
    </svg>
    <T s={44} w={500} style={abs(260, 34, {transform: 'translateX(-50%)'})}>सिमेंट · स्टील</T>
    {/* bag stack fills up as bags land */}
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={abs(92 + (i % 5) * 50, 400 - Math.floor(i / 5) * 48)}><Bag w={44} h={46} /></div>
    ))}
  </div>
);

const Hook = () => {
  const t = useT();
  const arrive = S(1), unload = S(2), builder = S(3), noon = S(4), eve = S(6);
  const tx = io(t, arrive - 0.3, arrive + 1.1, -700, 120, Easing.out(Easing.cubic));
  const NB = 10;
  const landed = Array.from({length: NB}).filter((_, k) => t > unload + 0.25 * k + 0.5).length;
  const sun = io(t, arrive, eve + 1.5, 0, 1, Easing.linear);
  const phase = t < noon ? ['sun', 'सकाळ'] : t < eve ? ['sun', 'दुपार'] : ['moon', 'संध्याकाळ'];
  const ph = t < noon ? arrive : t < eve ? noon : eve;
  return (
    <AbsoluteFill>
      {/* time-of-day chip + sun arc */}
      <div style={abs(960, 168, {transform: 'translateX(-50%)', opacity: io(t, arrive - 0.2, arrive + 0.3)})}>
        <div key={phase[1]} style={po(t, ph)}>
          <Pill t={t} at={0} icon={phase[0]} c={BRAND} bg="rgba(255,208,20,0.10)" bd="rgba(255,208,20,0.45)">{phase[1]}</Pill>
        </div>
      </div>
      <div style={abs(780 + sun * 420, 330 - Math.sin(sun * Math.PI) * 110, {width: 54, height: 54, borderRadius: 27, background: BRAND, opacity: io(t, arrive, arrive + 0.5) * (1 - 0.5 * sun), boxShadow: '0 0 50px rgba(255,208,20,0.6)'})} />
      {/* ground */}
      <div style={abs(120, 862, {width: 1680, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)', transformOrigin: 'left', transform: `scaleX(${io(t, 0, 0.8)})`})} />
      <div style={abs(700, 402, ro(t, 0.1))}><ShopArt t={t} n={landed} /></div>
      <div style={abs(tx, 640)}><TruckArt bags={NB + 2 - landed} /></div>
      {/* bags hopping from truck to shop */}
      {Array.from({length: NB}).map((_, k) => {
        const s0 = unload + 0.25 * k, p = io(t, s0, s0 + 0.5, 0, 1, Easing.inOut(Easing.quad));
        if (t < s0 || p >= 1) return null;
        const x = 480 + (790 + (k % 5) * 50 - 480) * p, y = 700 + (800 - Math.floor(k / 5) * 48 - 700) * p - Math.sin(p * Math.PI) * 160;
        return <div key={k} style={abs(x, y, {transform: `rotate(${p * 360}deg)`})}><Bag w={44} h={46} /></div>;
      })}
      {/* events on the right */}
      <div style={abs(1330, 330, {display: 'flex', flexDirection: 'column', gap: 26})}>
        <div style={ro(t, builder)}><Card x={0} y={0} w={480} h={130} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
          <Ix n="helmet" size={64} color={WHITE} sw={3} />
          <div><T s={30} c={MUTED}>बिल्डर</T><T s={52} w={500}>{t > WT(3, '200') - 0.1 ? <><span style={{color: BRAND, fontWeight: 600}}>200</span> गोण्या</> : '…'}</T></div>
        </Card></div>
        <div style={ro(t, noon)}><Card x={0} y={0} w={480} h={130} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
          <Ix n="user" size={64} color={WHITE} sw={3} />
          <div><T s={30} c={MUTED}>ग्राहक</T><T s={52} w={500}><span style={{color: BRAND, fontWeight: 600}}>2 टन</span> सळ्या</T></div>
        </Card></div>
        <div style={ro(t, eve)}><Card x={0} y={0} w={480} h={130} glow style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px'}}>
          <Ix n="up" size={64} color={BRAND} sw={3} />
          <div><T s={30} c={MUTED}>आजची विक्री</T><T s={52} w={500} c={BRAND}>₹ लाखोंमध्ये</T></div>
        </Card></div>
      </div>
      <Sfx at={arrive - 0.3} n="whoosh" v={0.35} />
      {[0, 3, 6, 9].map((k) => <Sfx key={k} at={unload + 0.25 * k + 0.5} n="pop" v={0.18} rate={1 + k * 0.03} />)}
      <Sfx at={builder} n="notify" v={0.28} />
      <Sfx at={noon} n="notify" v={0.28} />
      <Sfx at={eve} n="cash" v={0.3} />
    </AbsoluteFill>
  );
};

/* 02 Margin per bag */
const Margin = () => {
  const t = useT();
  const a = S(7), tag = WT(8, '₹8'), grid = WT(9, '100'), res = WT(9, '₹800');
  return (
    <AbsoluteFill>
      <Title t={t} at={a} y={170} s={56} c={MUTED}>पण तुम्हाला माहितीये का?</Title>
      <Card x={140} y={300} w={480} h={560} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', ...ro(t, S(8) - 0.2)}}>
        <div style={{transform: `scale(${0.9 + 0.1 * pp(t, S(8) - 0.2)})`}}><Bag w={250} h={290} /></div>
        <T s={34} c={MUTED} style={abs(0, 470, {width: 480, textAlign: 'center'})}>एका गोणीमागे</T>
      </Card>
      <div style={abs(420, 300, {transformOrigin: '30px 0', transform: `rotate(${-10 + Math.sin(t * 2) * 2}deg)`, ...po(t, tag)})}>
        <svg width="40" height="70" style={{display: 'block', marginLeft: 12}}><path d="M20 0v70" stroke="rgba(255,255,255,0.5)" strokeWidth="3" /></svg>
        <div style={{background: BRAND, borderRadius: 18, padding: '18px 34px 6px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
          <T s={104} w={600} c={INK}>₹8–10</T>
        </div>
      </div>
      {/* 100 bags */}
      <div style={abs(780, 300, {display: 'grid', gridTemplateColumns: 'repeat(10, 46px)', gap: 8, opacity: io(t, grid - 0.3, grid)})}>
        {Array.from({length: 100}).map((_, i) => <Bag key={i} w={46} h={44} o={t > grid + i * 0.016 ? 1 : 0.1} />)}
      </div>
      <T s={36} c={MUTED} style={abs(780, 850, fade2(t, grid))}>100 गोण्या</T>
      <div style={abs(1370, 470, ro(t, res))}>
        <T s={40} c={MUTED}>फक्त</T>
        <T s={88} w={600} c={BRAND} style={{marginTop: 6}}>₹800–1,000</T>
      </div>
      <Sfx at={tag} n="pop" v={0.35} />
      <Sfx at={tag + 0.1} n="coin" v={0.22} />
      {[0, 0.4, 0.8, 1.2].map((d) => <Sfx key={d} at={grid + d} n="tick" v={0.25} />)}
      <Sfx at={res} n="ding" v={0.25} />
    </AbsoluteFill>
  );
};
const fade2 = (t, at) => ({opacity: io(t, at, at + 0.4)});

/* 03 The paradox + what this video covers */
const Paradox = () => {
  const t = useT();
  const a = S(10), mats = S(11), title = S(12);
  const out1 = mats - 0.4;
  const items = [
    ['img/cement-bags.jpg', 'सिमेंट', WT(11, 'सिमेंटसोबत')], ['img/rebar.jpg', 'लोखंडी सळ्या', WT(11, 'सळ्या')], ['img/sand.jpg', 'वाळू', WT(11, 'वाळू')],
    ['img/gravel.jpg', 'खडी', WT(11, 'खडी')], ['img/bricks.jpg', 'विटा', WT(11, 'विटा')],
  ];
  const up = io(t, title - 0.2, title + 0.5);
  return (
    <AbsoluteFill>
      <div style={{opacity: outF(t, out1)}}>
        <Card x={140} y={330} w={440} h={400} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, ...ro(t, a)}}>
          <Bag w={90} h={104} />
          <T s={110} w={600} style={{marginTop: 18}}>₹8</T>
          <T s={34} c={MUTED}>प्रति गोणी</T>
        </Card>
        <Arrow t={t} at={WT(10, 'व्यापारी') - 0.2} x1={620} y1={530} x2={820} y2={530} c={DIM} />
        {[['truck', 'मोठमोठे ट्रक', WT(10, 'ट्रक')], ['warehouse', 'मोठं गोदाम', WT(10, 'गोदाम')], ['rupee', 'करोडोंचा व्यवसाय', WT(10, 'करोडों')]].map(([ic, txt, at], k) => (
          <Row key={k} gap={28} style={{...abs(880, 290 + k * 170), ...ro(t, at)}}>
            <div style={{width: 120, height: 120, borderRadius: 30, background: k === 2 ? 'rgba(255,208,20,0.12)' : 'rgba(255,255,255,0.06)', border: `2px solid ${k === 2 ? 'rgba(255,208,20,0.5)' : FAINT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Ix n={ic} size={66} color={k === 2 ? BRAND : WHITE} sw={3} />
            </div>
            <T s={56} w={k === 2 ? 500 : 400} c={k === 2 ? BRAND : WHITE}>{txt}</T>
          </Row>
        ))}
        <T s={300} w={500} c={BRAND} style={abs(1560, 230, {...po(t, WT(10, 'कसं') - 0.1), textShadow: '0 0 60px rgba(255,208,20,0.35)'})}>?</T>
      </div>
      {/* materials */}
      <div style={{transform: `translateY(${-70 * up}px)`, opacity: 1 - 0.35 * up}}>
        {items.map(([src, label, at], k) => (
          <Photo key={k} t={t} at={at} src={src} label={label} x={150 + k * 330} y={300} w={300} h={240} />
        ))}
        <Title t={t} at={WT(11, 'किती') - 0.1} out={title - 0.3} y={640} s={72}>किती <Hi at={WT(11, 'कमावता') - 0.2}>कमाई</Hi> होते?</Title>
      </div>
      <div style={abs(960, 590, {translate: '-50% 0', textAlign: 'center', ...ro(t, title)})}>
        <Eyebrow icon="calc">आजचा विषय</Eyebrow>
        <T s={76} w={500} style={{marginTop: 30}}>बांधकाम साहित्याच्या व्यवसायाचं</T>
        <T s={92} w={600} style={{marginTop: 12}}><Hi at={title + 0.6}>संपूर्ण गणित</Hi></T>
      </div>
      <Sfx at={a} n="pop" v={0.25} />
      {[WT(10, 'ट्रक'), WT(10, 'गोदाम'), WT(10, 'करोडों')].map((x, k) => <Sfx key={k} at={x} n="swish" v={0.22} />)}
      <Sfx at={WT(10, 'कसं') - 0.1} n="thud" v={0.35} />
      {items.map(([, , at], k) => <Sfx key={k} at={at} n="shutter" v={0.18} />)}
      <Sfx at={title - 0.6} n="riser" v={0.18} />
      <Sfx at={title} n="boom" v={0.25} />
    </AbsoluteFill>
  );
};

/* 04 Where the stock comes from */
const Supply = () => {
  const t = useT();
  const a = S(13), shop = S(14), dl = WT(15, 'डीलरशिप'), ok = S(16), cust = WT(17, 'ग्राहकांना'), small = WT(17, 'दुकानदारांनाही');
  const flow = (t - ok) % 1.6 / 1.6;
  return (
    <AbsoluteFill>
      <Title t={t} at={a} y={160} s={60}>माल मिळणार <span style={{color: BRAND}}>कुठून?</span></Title>
      <T s={32} c={MUTED} style={abs(150, 330, ro(t, WT(15, 'UltraTech') - 0.3))}>सिमेंट कंपन्या</T>
      <Logo t={t} at={WT(15, 'UltraTech')} src="img/ultratech.jpg" x={150} y={390} />
      <Logo t={t} at={WT(15, 'ACC')} src="img/acc.png" x={470} y={390} />
      <Logo t={t} at={WT(15, 'Ambuja')} name="Ambuja" x={150} y={570} />
      <Logo t={t} at={WT(15, 'Birla')} name="Birla" x={470} y={570} />
      <Node t={t} at={shop} x={1030} y={570} icon="shop" label="तुमचं दुकान" glow r={100} />
      <Arrow t={t} at={dl - 0.2} x1={790} y1={570} x2={905} y2={570} c={BRAND} w={5} />
      <YPill t={t} at={dl} x={848} y={440} center s={30}>डीलरशिप</YPill>
      <Pill t={t} at={ok} x={848} y={640} center s={28} icon="check" c={WHITE}>अटी पूर्ण</Pill>
      {t > ok + 0.4 && <div style={abs(790 + flow * 100, 550, {opacity: Math.sin(flow * Math.PI)})}><Bag w={30} h={34} /></div>}
      <Arrow t={t} at={cust - 0.2} x1={1150} y1={520} x2={1440} y2={400} c={DIM} />
      <Node t={t} at={cust} x={1540} y={380} icon="users" label="ग्राहक" r={80} />
      <Arrow t={t} at={small - 0.2} x1={1150} y1={620} x2={1440} y2={740} c={DIM} />
      <Node t={t} at={small} x={1540} y={760} icon="shop" label="छोटे दुकानदार" r={80} />
      <Sfx at={shop} n="pop" v={0.3} />
      {['UltraTech', 'ACC', 'Ambuja', 'Birla'].map((b, k) => <Sfx key={b} at={WT(15, b)} n="pop" v={0.2} rate={1 + k * 0.06} />)}
      <Sfx at={dl} n="swish" v={0.25} />
      <Sfx at={ok} n="chime" v={0.2} />
      <Sfx at={cust} n="swish" v={0.2} />
      <Sfx at={small} n="swish" v={0.2} />
    </AbsoluteFill>
  );
};

/* 05 Steel brands */
const Steel = () => {
  const t = useT();
  const a = S(18);
  return (
    <AbsoluteFill>
      <Photo t={t} at={a} src="img/rebar.jpg" x={140} y={230} w={700} h={600} label={t > WT(19, 'TMT') ? 'TMT Bars' : ''} />
      <div style={abs(940, 230, ro(t, a + 0.1))}>
        <Eyebrow icon="rods">लोखंडी सळ्या</Eyebrow>
        <T s={60} w={500} style={{marginTop: 26}}>इथेही हेच मॉडेल</T>
      </div>
      <Logo t={t} at={WT(19, 'Tata')} src="img/tata-steel.png" sub="Tata Tiscon" x={940} y={480} w={280} h={140} />
      <Logo t={t} at={WT(19, 'JSW')} src="img/jsw.png" sub="JSW Neosteel" x={1250} y={480} w={280} h={140} />
      <Logo t={t} at={WT(19, 'SAIL')} src="img/sail.png" sub="SAIL" x={1560} y={480} w={240} h={140} />
      <Pill t={t} at={WT(19, 'इतर')} x={940} y={760} icon="star" c={MUTED}>+ इतर ब्रँड</Pill>
      <Sfx at={a} n="shutter" v={0.25} />
      {['Tata', 'JSW', 'SAIL'].map((b, k) => <Sfx key={b} at={WT(19, b)} n="pop" v={0.2} rate={1 + k * 0.06} />)}
    </AbsoluteFill>
  );
};

/* 06 One-stop shop */
const OneStop = () => {
  const t = useT();
  const only = WT(21, 'मर्यादित'), house = S(22), merge = WT(23, 'एकाच'), again = WT(23, 'पुन्हा'), sup = WT(24, 'Construction');
  const C = [960, 580];
  const items = [
    ['bag', 'सिमेंट', WT(22, 'सिमेंट,'), 430, 340], ['rods', 'सळ्या', WT(22, 'सळ्या'), 960, 250], ['pile', 'वाळू', WT(22, 'वाळू'), 1490, 340],
    ['pile', 'खडी', WT(22, 'खडी'), 1600, 590], ['brick', 'विटा', WT(22, 'विटा'), 1470, 840], ['coil', 'Binding Wire', WT(22, 'Binding'), 450, 840],
    ['drop', 'Waterproofing', WT(22, 'Waterproofing'), 330, 590],
  ];
  const m = io(t, merge, merge + 0.8, 0, 1, INOUT);
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(20)} out={house - 0.3} icon="star">महत्त्वाची गोष्ट</Brow>
      <div style={abs(960, 420, {transform: 'translateX(-50%)', display: 'flex', gap: 40, opacity: outF(t, house - 0.3)})}>
        {['फक्त सिमेंट', 'फक्त लोखंड'].map((x, k) => (
          <div key={x} style={{position: 'relative', ...po(t, S(21) + k * 0.4)}}>
            <T s={64} w={500} style={{padding: '18px 40px 6px', borderRadius: 24, background: 'rgba(255,255,255,0.06)', border: `2px solid ${FAINT}`}}>{x}</T>
            {strike(t, only + k * 0.15)}
          </div>
        ))}
      </div>
      {/* house + items */}
      <div style={abs(C[0] - 130, C[1] - 150, {opacity: io(t, house, house + 0.4) * (1 - m)})}>
        <svg width="260" height="260" viewBox="0 0 48 48" style={{overflow: 'visible'}}>
          <path d="M5 22 24 6l19 16M10 18v24h28V18M20 42V30h8v12" fill="none" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...draw(io(t, house, house + 1.2))} />
        </svg>
        <T s={36} c={MUTED} style={{textAlign: 'center', marginTop: 6}}>नवीन घर</T>
      </div>
      {items.map(([ic, label, at, x, y], k) => {
        const px = x + (C[0] - x) * m, py = y + (C[1] - y) * m;
        return (
          <div key={k} style={abs(px, py, {transform: `translate(-50%,-50%) scale(${1 - 0.6 * m})`, opacity: 1 - m * 0.9})}>
            <Pill t={t} at={at} icon={ic} s={36}>{label}</Pill>
          </div>
        );
      })}
      <Node t={t} at={merge + 0.5} x={C[0]} y={C[1]} icon="shop" label="एकाच दुकानात" glow r={110} />
      {t > again && <svg style={abs(0, 0)} width="1920" height="1080">
        <ellipse cx={C[0]} cy={C[1]} rx="250" ry="200" fill="none" stroke="rgba(255,208,20,0.45)" strokeWidth="3" strokeDasharray="10 14" strokeDashoffset={-t * 30} opacity={io(t, again, again + 0.4)} />
      </svg>}
      {t > again && <div style={abs(C[0] + 250 * Math.cos((t - again) * 2.2), C[1] + 200 * Math.sin((t - again) * 2.2) - 30, {transform: 'translate(-50%,-50%)', opacity: io(t, again, again + 0.4)})}>
        <div style={{width: 64, height: 64, borderRadius: 32, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ix n="user" size={40} color={INK} sw={3.4} /></div>
      </div>}
      <YPill t={t} at={again + 0.3} x={1330} y={330} icon="loop" s={34}>पुन्हा पुन्हा</YPill>
      <div style={abs(960, 880, {translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 30, ...ro(t, S(24))})}>
        <div style={{position: 'relative'}}><T s={52} c={MUTED}>दुकान</T>{strike(t, sup - 0.3, RED)}</div>
        <Ix n="up" size={50} color={DIM} />
        <T s={60} w={500}><Hi at={sup}>Construction Material Supplier</Hi></T>
      </div>
      {items.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.18} rate={0.95 + k * 0.05} />)}
      <Sfx at={only} n="buzz" v={0.15} />
      <Sfx at={merge} n="whoosh" v={0.3} />
      <Sfx at={merge + 0.6} n="thud" v={0.25} />
      <Sfx at={sup} n="chime" v={0.22} />
    </AbsoluteFill>
  );
};

/* 07 Cement maths */
const CementMath = () => {
  const t = useT();
  const q = S(25), calc = S(28), out = calc - 0.3;
  const day = WT(31, '₹2,400'), mon = WT(32, '₹62,400');
  return (
    <AbsoluteFill>
      <div style={{opacity: outF(t, out)}}>
        <Title t={t} at={q} y={300} s={56} c={MUTED}>पण खरा प्रश्न…</Title>
        <Title t={t} at={S(26)} y={400} s={80}>प्रत्येक वस्तूमागे <span style={{color: BRAND}}>किती पैसे?</span></Title>
        <div style={abs(960, 600, {transform: 'translateX(-50%)'})}><YPill t={t} at={S(27)} icon="calc" s={40}>चला, हिशेब करूया</YPill></div>
      </div>
      <Card x={460} y={200} w={1000} h={730} style={{padding: '44px 60px', boxSizing: 'border-box', ...ro(t, calc - 0.2)}}>
        <Row gap={18} style={{marginBottom: 26}}><Bag w={34} h={38} /><T s={34} c={MUTED}>सिमेंट · रोजचा हिशेब</T></Row>
        <Line t={t} at={calc} left="एका गोणीवर" right="₹8" rc={BRAND} rw={600} />
        <div style={{height: 22}} />
        <Line t={t} at={WT(29, '300')} left={<>रोज विक्री <span style={{fontSize: 28, color: DIM, marginLeft: 10}}>· तालुका</span></>} right="× 300 गोण्या" />
        <Divider t={t} at={day - 0.3} />
        <Line t={t} at={day - 0.1} left="दिवसाला" right={<Count t={t} a={day} b={day + 0.8} from={0} to={2400} />} rs={72} rw={600} />
        <div style={{height: 22}} />
        <Line t={t} at={S(32)} left="महिन्यात" right="× 26 दिवस" />
        <Divider t={t} at={mon - 0.3} />
        <Line t={t} at={mon - 0.1} left="महिन्याला" right={<Count t={t} a={mon} b={mon + 1.1} from={0} to={62400} />} rs={110} rc={BRAND} rw={600} />
      </Card>
      <div style={abs(960, 950, {transform: 'translateX(-50%)'})}><YPill t={t} at={S(33)} s={34}>फक्त सिमेंटमधून!</YPill></div>
      <Sfx at={S(27)} n="click" v={0.3} />
      {[calc, WT(29, '300'), day - 0.1, S(32)].map((x, k) => <Sfx key={k} at={x} n="tick" v={0.3} />)}
      <Sfx at={day + 0.8} n="coin" v={0.22} />
      <Sfx at={mon + 1.1} n="cash" v={0.3} />
    </AbsoluteFill>
  );
};

/* 08 Twist: can you sell 300 a day? -> volume */
const Volume = () => {
  const t = useT();
  const q = S(35), map = S(36), cmp = S(37), mapOut = cmp - 0.3;
  const site = WT(36, 'साइटजवळ'), con = WT(36, 'कॉन्ट्रॅक्टर्स'), del = WT(36, 'Delivery'), up = WT(36, 'वाढवण्याची');
  const b500 = WT(37, '500'), d4 = WT(38, '₹4,000'), month = S(39), vol = WT(40, 'Volume');
  const tr = ((t - del) % 3) / 3, trx = 1000 + (560 - 1000) * Math.sin(tr * Math.PI);
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(34)} out={map - 0.3} icon="bolt">ट्विस्ट</Brow>
      <Title t={t} at={q} out={map - 0.3} y={400} s={96}>दिवसाला 300 गोण्या<span style={{color: BRAND}}> ?</span></Title>
      <div style={{opacity: outF(t, mapOut)}}>
        <Title t={t} at={map} y={170} s={48} c={MUTED}>विक्री कधी वाढते?</Title>
        <Node t={t} at={map + 0.1} x={1000} y={600} icon="shop" label="तुमचं दुकान" glow r={96} />
        <Arrow t={t} at={site - 0.1} x1={600} y1={560} x2={890} y2={590} dash c="rgba(255,255,255,0.35)" head={false} />
        <Node t={t} at={site} x={480} y={520} icon="building" label="बांधकाम साइट" r={84} />
        <Arrow t={t} at={con - 0.1} x1={1400} y1={450} x2={1110} y2={560} dash c="rgba(255,255,255,0.35)" head={false} />
        <Node t={t} at={con} x={1500} y={420} icon="helmet" label="कॉन्ट्रॅक्टर्स" r={84} />
        {t > del && <div style={abs(trx - 50, 700, {opacity: io(t, del, del + 0.3), transform: `scaleX(${Math.cos(tr * Math.PI) > 0 ? -1 : 1})`})}><Ix n="truck" size={100} color={BRAND} sw={3} /></div>}
        <Pill t={t} at={del} x={760} y={820} icon="truck">चांगली Delivery</Pill>
        <div style={abs(1500, 760)}><YPill t={t} at={up} icon="up" s={40}>विक्री ↑</YPill></div>
      </div>
      {/* 300 vs 500 */}
      <div style={abs(220, 300, {opacity: io(t, cmp, cmp + 0.4)})}>
        {[[300, '₹2,400', cmp, 'rgba(255,255,255,0.55)'], [500, '₹4,000', b500, BRAND]].map(([n, v, at, c], k) => (
          <div key={n} style={{marginBottom: 60, ...ro(t, at)}}>
            <Row gap={20}><T s={40} w={500} c={k ? BRAND : WHITE}>{n} गोण्या</T><T s={30} c={MUTED}>/ दिवस</T></Row>
            <Row gap={30} style={{marginTop: 18}}>
              <div style={{height: 56, borderRadius: 14, background: c, width: (n / 500) * 1000 * io(t, at + 0.1, at + 0.9)}} />
              <T s={48} w={k ? 600 : 400} c={k ? BRAND : WHITE} style={{opacity: io(t, k ? d4 : at + 0.6, (k ? d4 : at + 0.6) + 0.3)}}>{v}</T>
            </Row>
          </div>
        ))}
      </div>
      <div style={abs(220, 700, ro(t, month))}>
        <Row gap={30}><T s={44} c={MUTED}>महिन्याला</T><T s={96} w={600} c={BRAND}>₹1 लाख+</T><T s={36} c={MUTED} style={{marginTop: 20}}>Gross Margin</T></Row>
      </div>
      <div style={abs(1400, 700, ro(t, vol - 0.2))}><T s={110} w={600}><Hi at={vol}>Volume</Hi></T></div>
      <Sfx at={q} n="pop" v={0.25} />
      {[site, con].map((x, k) => <Sfx key={k} at={x} n="pop" v={0.2} />)}
      <Sfx at={del} n="swish" v={0.25} />
      <Sfx at={up} n="chime" v={0.2} />
      <Sfx at={b500} n="swish" v={0.25} />
      <Sfx at={month} n="cash" v={0.3} />
      <Sfx at={vol} n="thud" v={0.3} />
    </AbsoluteFill>
  );
};

/* 09 More volume = more stock = locked cash */
const Stock = () => {
  const t = useT();
  const a = S(41), grow = S(42), cash = S(43);
  const n = Math.round(io(t, grow, grow + 3, 6, 36, Easing.linear));
  const lvl = io(t, cash, cash + 2, 1, 0.22);
  return (
    <AbsoluteFill>
      <div style={abs(140, 170, ro(t, a))}>
        <Eyebrow icon="x" color={RED}>अडचण</Eyebrow>
        <T s={60} w={500} style={{marginTop: 26}}>जास्त विक्री = <span style={{color: BRAND}}>जास्त स्टॉक</span></T>
      </div>
      <div style={abs(180, 420, {width: 560, height: 470, ...ro(t, a + 0.3)})}>
        {Array.from({length: n}).map((_, i) => (
          <div key={i} style={abs((i % 6) * 84 + (Math.floor(i / 6) % 2) * 20, 400 - Math.floor(i / 6) * 66)}><Bag w={74} h={60} /></div>
        ))}
        <T s={34} c={MUTED} style={abs(0, 490)}>गोदामातला स्टॉक</T>
      </div>
      {/* money flowing from wallet into stock */}
      {t > cash && Array.from({length: 5}).map((_, k) => {
        const p = ((t - cash - k * 0.35) % 1.75) / 1.75;
        if (t - cash - k * 0.35 < 0) return null;
        return <div key={k} style={abs(1180 - p * 360, 600 - Math.sin(p * Math.PI) * 80, {width: 46, height: 46, borderRadius: 23, background: BRAND, ...F, color: INK, fontSize: 28, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box', opacity: Math.sin(p * Math.PI)})}>₹</div>;
      })}
      <Card x={1240} y={360} w={520} h={480} style={{padding: 44, boxSizing: 'border-box', ...ro(t, cash - 0.3)}}>
        <Row gap={20}><Ic n="wallet" size={56} color={WHITE} sw={3} /><T s={40} w={500}>तुमचे पैसे</T></Row>
        <div style={{marginTop: 40, height: 230, width: 120, borderRadius: 18, border: `2px solid ${FAINT}`, position: 'relative', overflow: 'hidden'}}>
          <div style={abs(0, 230 * (1 - lvl), {width: 120, height: 230 * lvl, background: lvl < 0.4 ? RED : BRAND, opacity: 0.85})} />
        </div>
        <div style={abs(200, 250, po(t, cash + 1.6))}><Row gap={14}><Ic n="lock" size={44} color={RED} sw={3} /><T s={38} c={RED}>स्टॉकमध्ये अडकले</T></Row></div>
      </Card>
      <Sfx at={a} n="pop" v={0.25} />
      {[0, 1, 2].map((k) => <Sfx key={k} at={grow + k} n="pop" v={0.12} rate={0.8 + k * 0.1} />)}
      {[0, 0.6, 1.2].map((d) => <Sfx key={d} at={cash + d} n="coin" v={0.14} />)}
      <Sfx at={cash + 1.6} n="buzz" v={0.2} />
    </AbsoluteFill>
  );
};

/* 10 Second product: steel */
const SteelIntro = () => {
  const t = useT();
  const a = S(44), rev = S(45);
  return (
    <AbsoluteFill>
      <div style={abs(140, 180, ro(t, a))}>
        <Eyebrow icon="box">आणखी एक प्रॉडक्ट</Eyebrow>
        <T s={60} w={500} style={{marginTop: 26}}>प्रत्येक ऑर्डर <span style={{color: BRAND}}>₹ लाखोंमध्ये</span></T>
      </div>
      <Photo t={t} at={rev - 0.1} src="img/rods.jpg" x={420} y={400} w={1080} h={480} pos="50% 50%" />
      <div style={abs(960, 820, {translate: '-50% 0', ...po(t, rev + 0.2)})}>
        <div style={{background: BRAND, borderRadius: 22, padding: '20px 44px 8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}><T s={72} w={600} c={INK}>लोखंडी सळ्या!</T></div>
      </div>
      <Sfx at={rev - 0.1} n="whoosh" v={0.25} />
      <Sfx at={rev + 0.2} n="thud" v={0.35} />
    </AbsoluteFill>
  );
};

/* 11 Steel maths */
const SteelMath = () => {
  const t = useT();
  const ord = S(46), buy = S(47), tot = WT(48, '₹13'), mg = S(49), mg20 = S(50), mtot = WT(51, '₹20,000'), five = WT(52, '5'), lk = WT(52, '₹1');
  const box = {padding: '40px 52px', boxSizing: 'border-box'};
  return (
    <AbsoluteFill>
      <div style={abs(140, 170, ro(t, ord))}>
        <Row gap={22}><Ix n="helmet" size={56} color={MUTED} sw={3} /><T s={40} c={MUTED}>बिल्डरची ऑर्डर</T><T s={64} w={600} c={BRAND}>20 टन</T><T s={40} c={MUTED}>सळ्या</T></Row>
      </div>
      <Card x={140} y={320} w={800} h={500} style={{...box, ...ro(t, buy - 0.2)}}>
        <T s={34} c={DIM}>खरेदी</T>
        <div style={{height: 26}} />
        <Line t={t} at={buy} left="एका टनाचा भाव" right="₹66,000" />
        <div style={{height: 18}} />
        <Line t={t} at={S(48)} left="20 टनसाठी" right="× 20" />
        <Divider t={t} at={tot - 0.3} />
        <Line t={t} at={tot - 0.1} left="लागतील" right={<Count t={t} a={tot} b={tot + 1.2} from={0} to={1320000} />} rs={80} rw={600} />
      </Card>
      <Card x={980} y={320} w={800} h={500} glow style={{...box, ...ro(t, mg - 0.2)}}>
        <T s={34} c={DIM}>तुमचा फरक</T>
        <div style={{height: 26}} />
        <Line t={t} at={mg} left="प्रति टन" right="₹1,000" rc={BRAND} />
        <div style={{height: 18}} />
        <Line t={t} at={mg20} left="20 टन" right="× 20" />
        <Divider t={t} at={mtot - 0.3} />
        <Line t={t} at={mtot - 0.1} left="एका ऑर्डरमधून" right={<Count t={t} a={mtot} b={mtot + 0.9} from={0} to={20000} />} rs={80} rc={BRAND} rw={600} />
        <T s={28} c={MUTED} style={{textAlign: 'right', marginTop: 6, opacity: io(t, mtot + 0.5, mtot + 0.9)}}>Gross Trading Margin</T>
      </Card>
      <Row gap={18} style={abs(140, 880)}>
        <T s={36} c={MUTED} style={ro(t, five - 0.3)}>महिन्यात</T>
        {[0, 1, 2, 3, 4].map((k) => (
          <div key={k} style={{width: 92, height: 72, borderRadius: 16, background: 'rgba(255,208,20,0.12)', border: '2px solid rgba(255,208,20,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...po(t, five + k * 0.18)}}>
            <Ix n="rods" size={44} color={BRAND} sw={3} />
          </div>
        ))}
        <T s={36} c={MUTED} style={ro(t, five + 0.6)}>5 ऑर्डर्स =</T>
        <T s={72} w={600} c={BRAND} style={ro(t, lk)}>₹1 लाख</T>
      </Row>
      <Sfx at={ord} n="notify" v={0.25} />
      {[buy, S(48), mg, mg20].map((x, k) => <Sfx key={k} at={x} n="tick" v={0.28} />)}
      <Sfx at={tot + 1.2} n="coin" v={0.2} />
      <Sfx at={mtot + 0.9} n="ding" v={0.25} />
      {[0, 1, 2, 3, 4].map((k) => <Sfx key={k} at={five + k * 0.18} n="pop" v={0.15} rate={1 + k * 0.05} />)}
      <Sfx at={lk} n="cash" v={0.3} />
    </AbsoluteFill>
  );
};

/* 12 Total gross margin, but it is not profit */
const Gross = () => {
  const t = useT();
  const a = S(53), c62 = WT(54, '₹62'), s1 = WT(54, '₹1'), tot = S(55), stop = S(56), notp = S(57), cost1 = WT(58, 'खरेदी'), cost2 = WT(58, 'पोहोचवण्यासाठीसुद्धा');
  const X = 200, W = 1400, w1 = W * 62 / 162, w2 = W * 100 / 162;
  const stopO = io(t, stop, stop + 0.2) * outF(t, notp - 0.2);
  return (
    <AbsoluteFill>
      <Brow t={t} at={a} icon="calc">आता विचार करा</Brow>
      <div style={abs(X, 420, {width: W, height: 120, borderRadius: 24, background: 'rgba(255,255,255,0.05)', border: `2px solid ${FAINT}`, overflow: 'hidden', opacity: io(t, a, a + 0.4)})}>
        <div style={abs(0, 0, {width: w1 * io(t, c62, c62 + 0.8), height: 120, background: 'rgba(255,255,255,0.8)'})} />
        <div style={abs(w1, 0, {width: w2 * io(t, s1, s1 + 0.9), height: 120, background: BRAND})} />
        {/* costs eating the margin */}
        <div style={abs(W - 340 * io(t, cost1, cost1 + 0.6), 0, {width: 340, height: 120, background: `repeating-linear-gradient(135deg, ${RED} 0 14px, rgba(255,90,82,0.6) 14px 28px)`})} />
        <div style={abs(W - 340 - 260 * io(t, cost2, cost2 + 0.6), 0, {width: 260 * io(t, cost2, cost2 + 0.01), height: 120, background: `repeating-linear-gradient(135deg, rgba(255,90,82,0.85) 0 14px, rgba(255,90,82,0.45) 14px 28px)`})} />
      </div>
      <div style={abs(X, 570, ro(t, c62))}><T s={34} c={MUTED}>सिमेंट</T><T s={52} w={500}>₹62 हजार</T></div>
      <div style={abs(X + w1 + 30, 570, ro(t, s1))}><T s={34} c={MUTED}>सळ्या</T><T s={52} w={500} c={BRAND}>₹1 लाख</T></div>
      <div style={abs(X + W, 250, {translate: '-100% 0', textAlign: 'right', ...ro(t, tot)})}>
        <T s={34} c={MUTED}>Gross Margin / महिना</T>
        <T s={100} w={600} c={BRAND}>₹1.62 लाख</T>
      </div>
      <div style={abs(X + W - 600, 570, {display: 'flex', gap: 20})}>
        <RPill t={t} at={cost1} icon="bag" s={32}>खरेदी खर्च</RPill>
        <RPill t={t} at={cost2} icon="truck" s={32}>Delivery</RPill>
      </div>
      <div style={abs(960, 800, {transform: `translate(-50%,-50%) rotate(-5deg) scale(${1.6 - 0.6 * pp(t, stop, 11)})`, opacity: stopO})}>
        <T s={110} w={600} c={BRAND} style={{border: `5px solid ${BRAND}`, borderRadius: 22, padding: '18px 40px 6px', background: 'rgba(14,14,15,0.9)'}}>पण थांबा…</T>
      </div>
      <Row gap={26} style={abs(960, 760, {translate: '-50% 0', ...ro(t, notp)})}>
        <T s={60} w={500}>Gross Margin</T><T s={60} c={RED}>≠</T><T s={60} w={500}>अंतिम नफा</T>
      </Row>
      <Sfx at={c62} n="swish" v={0.2} />
      <Sfx at={s1} n="swish" v={0.2} />
      <Sfx at={tot} n="cash" v={0.3} />
      <Sfx at={stop} n="stamp" v={0.4} />
      <Sfx at={notp} n="pop" v={0.2} />
      <Sfx at={cost1} n="buzz" v={0.15} />
      <Sfx at={cost2} n="buzz" v={0.15} />
    </AbsoluteFill>
  );
};

/* 13 Selling is easy, collecting is the skill */
const Skill = () => {
  const t = useT();
  const sk = WT(61, 'कौशल्य');
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(59)} icon="key" y={200}>सर्वात महत्त्वाची गोष्ट</Brow>
      <Card x={360} y={360} w={1200} h={170} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '0 50px', boxSizing: 'border-box', ...ro(t, S(60))}}>
        <Ix n="truck" size={70} color={WHITE} sw={3} />
        <T s={60} w={500} style={{flex: 1}}>माल विकणं</T>
        <Row gap={14}><Ic n="check" size={48} color={MUTED} sw={4} /><T s={56} c={MUTED}>सोपं</T></Row>
      </Card>
      <Card x={360} y={580} w={1200} h={170} glow style={{display: 'flex', alignItems: 'center', gap: 34, padding: '0 50px', boxSizing: 'border-box', ...ro(t, S(61))}}>
        <Ic n="rupee" size={70} color={BRAND} sw={3} />
        <T s={60} w={500} style={{flex: 1}}>पैसे परत मिळवणं</T>
        <T s={60} w={500}><Hi at={sk - 0.2}>खरं कौशल्य</Hi></T>
      </Card>
      <Sfx at={S(60)} n="pop" v={0.2} />
      <Sfx at={S(61)} n="pop" v={0.2} />
      <Sfx at={sk - 0.2} n="ding" v={0.25} />
    </AbsoluteFill>
  );
};

/* 14 The credit story */
const Credit = () => {
  const t = useT();
  const a = S(62), goods = WT(62, '₹10'), says = S(63), d30 = S(64), know = S(65), c2 = S(66), five = WT(67, '₹5'), none = WT(68, 'नाहीत'), stuck = WT(69, 'अडकले');
  const lvl = io(t, know, know + 1.4, 1, 0.12);
  return (
    <AbsoluteFill>
      <Node t={t} at={a} x={420} y={430} icon="shop" label="तुम्ही" glow r={96} />
      <Node t={t} at={a + 0.2} x={1500} y={430} icon="helmet" label="बिल्डर" r={96} />
      <Arrow t={t} at={goods - 0.3} x1={560} y1={380} x2={1360} y2={380} c={WHITE} w={4} bend={-0.08} />
      <div style={abs(960, 270, {transform: 'translateX(-50%)'})}><Pill t={t} at={goods} icon="box" s={38}>₹10 लाखांचा माल</Pill></div>
      <Arrow t={t} at={d30 - 0.2} x1={1360} y1={490} x2={560} y2={490} c="rgba(255,255,255,0.4)" dash />
      <div style={abs(960, 520, {transform: 'translateX(-50%)'})}><Pill t={t} at={d30} icon="cal" c={MUTED} s={34}>पैसे 30 दिवसांनी</Pill></div>
      {/* builder speech */}
      <div style={abs(1600, 170, {translate: '-50% 0', ...po(t, says)})}>
        <div style={{background: WHITE, borderRadius: '28px 28px 28px 6px', padding: '18px 30px 8px'}}><T s={40} w={500} c={INK}>“आता नाही… 30 दिवसांनी”</T></div>
      </div>
      <T s={30} c={MUTED} style={abs(420, 620, {translate: '-50% 0', ...ro(t, know)})}>ओळखीचा आहे म्हणून</T>
      {/* your cash */}
      <Card x={140} y={720} w={760} h={200} style={{padding: '34px 44px', boxSizing: 'border-box', ...ro(t, know)}}>
        <Row gap={18}><Ic n="wallet" size={46} color={WHITE} sw={3} /><T s={36} w={500}>तुमच्याकडील पैसे</T>
          <T s={34} c={RED} style={{marginLeft: 'auto', opacity: io(t, none, none + 0.3)}}>पैसे नाहीत!</T></Row>
        <div style={{marginTop: 26, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${lvl * 100}%`, borderRadius: 12, background: lvl < 0.3 ? RED : BRAND}} />
        </div>
      </Card>
      {/* second customer */}
      <Node t={t} at={c2} x={1500} y={810} icon="user" label="दुसरा ग्राहक" r={78} />
      <div style={abs(1250, 700)}><Pill t={t} at={five} s={34} icon="box">₹5 लाख माल</Pill></div>
      {t > none && <div style={abs(1100, 810, {translate: '-50% -50%', ...po(t, none)})}>
        <div style={{width: 92, height: 92, borderRadius: 46, background: 'rgba(255,90,82,0.15)', border: `3px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic n="x" size={52} color={RED} sw={5} /></div>
      </div>}
      {/* stuck */}
      {t > stuck && <div style={abs(960, 640, {translate: '-50% 0', ...po(t, stuck)})}>
        <Row gap={14} style={{background: 'rgba(255,90,82,0.14)', border: `2px solid ${RED}`, borderRadius: 18, padding: '12px 26px 4px'}}>
          <Ic n="lock" size={46} color={RED} sw={3.4} /><T s={44} w={500} c={RED}>₹10 लाख अडकले</T>
        </Row>
      </div>}
      <Sfx at={a} n="pop" v={0.2} />
      <Sfx at={goods - 0.3} n="whoosh" v={0.25} />
      <Sfx at={says} n="notify" v={0.25} />
      <Sfx at={d30} n="tick" v={0.25} />
      <Sfx at={c2} n="pop" v={0.2} />
      <Sfx at={none} n="buzz" v={0.3} />
      <Sfx at={stuck} n="stamp" v={0.35} />
    </AbsoluteFill>
  );
};

/* 15 What now? + credit ledger */
const Options = () => {
  const t = useT();
  const a = S(70), led = S(75), out = led - 0.3;
  const opts = [['hand', 'Supplier कडून उधारी?', S(71)], ['bank', 'बँकेतून पैसे?', S(72)], ['x', 'माल नाकारायचा?', S(73)]];
  const rows = [
    ['बिल्डर A', <><Ic n="check" size={36} color={BRAND} sw={4} /><T s={36} c={BRAND}>वेळेवर पैसे</T></>, 0.85, BRAND, WT(76, 'वेळेवर')],
    ['कॉन्ट्रॅक्टर B', <><Ic n="x" size={36} color={RED} sw={4} /><T s={36} c={RED}>पैसे अडकवतो</T></>, 0.2, RED, WT(76, 'अडकवतो')],
    ['ग्राहक C', <><Ic n="clock" size={36} color={MUTED} sw={3.4} /><T s={36} c={MUTED}>नवीन</T></>, 0.45, 'rgba(255,255,255,0.6)', WT(76, 'Credit')],
  ];
  return (
    <AbsoluteFill>
      <Title t={t} at={a} out={out} y={190} s={72}>आता काय करणार?</Title>
      {opts.map(([ic, txt, at], k) => (
        <Card key={k} x={160 + k * 550} y={380} w={500} h={300} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, ...ro(t, at, out)}}>
          <Ix n={ic} size={90} color={k === 2 ? RED : WHITE} sw={2.8} />
          <T s={44} w={500}>{txt}</T>
        </Card>
      ))}
      <div style={abs(960, 760, {transform: 'translateX(-50%)'})}><RPill t={t} at={S(74)} out={out} icon="rewind" s={36}>हे खूप वेळा घडतं</RPill></div>
      {/* ledger */}
      <div style={abs(360, 170, ro(t, led))}>
        <Eyebrow icon="star">अनुभवी व्यापारी</Eyebrow>
        <T s={56} w={500} style={{marginTop: 22}}>प्रत्येकाला उधारी <span style={{color: RED}}>नाही</span></T>
      </div>
      <Card x={360} y={390} w={1200} h={500} style={{padding: '36px 56px', boxSizing: 'border-box', ...ro(t, S(76) - 0.2)}}>
        <Row style={{justifyContent: 'space-between', paddingBottom: 18, borderBottom: '2px solid rgba(255,255,255,0.1)'}}>
          <T s={30} c={DIM} style={{width: 330}}>ग्राहक</T><T s={30} c={DIM} style={{width: 360}}>इतिहास</T><T s={30} c={DIM} style={{width: 320}}>Credit Limit</T>
        </Row>
        {rows.map(([name, hist, lim, c, at], k) => (
          <Row key={k} style={{justifyContent: 'space-between', padding: '30px 0 18px', borderBottom: k < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', ...ro(t, at)}}>
            <T s={42} w={500} style={{width: 330}}>{name}</T>
            <Row gap={14} style={{width: 360}}>{hist}</Row>
            <div style={{width: 320, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.08)'}}><div style={{height: '100%', borderRadius: 11, background: c, width: `${lim * 100 * io(t, at + 0.2, at + 0.9)}%`}} /></div>
          </Row>
        ))}
      </Card>
      <div style={abs(960, 930, {transform: 'translateX(-50%)'})}><YPill t={t} at={WT(76, 'आधीच')} icon="calc" s={34}>आधीच ठरवतात</YPill></div>
      {opts.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.2} rate={1 + k * 0.06} />)}
      <Sfx at={led} n="paper" v={0.3} />
      {rows.map(([, , , , at], k) => <Sfx key={k} at={at} n="tick" v={0.25} />)}
    </AbsoluteFill>
  );
};

/* 16 Price risk */
const PriceRisk = () => {
  const t = useT();
  const a = S(77), buy = WT(78, '₹66,000'), drop = S(79), sell = S(80), turn = WT(81, 'उलाढालही'), loss = WT(81, 'नुकसान');
  const X0 = 220, X1 = 1180, Yb = 470, Ys = 700;
  const xb = X0 + 200, xd = X0 + 520, xs = X0 + 760;
  const p1 = io(t, buy - 0.6, buy + 0.4), p2 = io(t, drop, drop + 1.2);
  const path = `M${X0} ${Yb} L${xd} ${Yb} C${xd + 80} ${Yb} ${xd + 90} ${Ys} ${xd + 200} ${Ys} L${X1} ${Ys}`;
  return (
    <AbsoluteFill>
      <div style={abs(140, 170, ro(t, a))}>
        <Eyebrow icon="down" color={RED}>आणखी एक धोका</Eyebrow>
        <T s={56} w={500} style={{marginTop: 22}}>लोखंडाचा बाजारभाव</T>
      </div>
      <Card x={140} y={330} w={1120} h={560} style={ro(t, a + 0.3)} />
      <svg style={abs(0, 0)} width="1920" height="1080">
        <line x1={X0} y1={820} x2={X1} y2={820} stroke="rgba(255,255,255,0.15)" strokeWidth="2" opacity={io(t, a + 0.3, a + 0.6)} />
        <line x1={X0} y1={Yb} x2={X1} y2={Yb} stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="6 10" opacity={io(t, buy, buy + 0.4)} />
        {t > sell && <rect x={xs} y={Yb} width={X1 - xs} height={Ys - Yb} fill="rgba(255,90,82,0.16)" opacity={io(t, loss, loss + 0.4)} />}
        <path d={path} fill="none" stroke={p2 > 0 ? WHITE : WHITE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" {...draw(0.42 * p1 + 0.58 * p2)} />
        <circle cx={xb} cy={Yb} r={12 * pp(t, buy)} fill={BRAND} />
        <circle cx={xs} cy={Ys} r={12 * pp(t, sell)} fill={RED} />
      </svg>
      <div style={abs(xb - 20, Yb - 110, ro(t, buy))}><T s={28} c={MUTED}>खरेदी</T><T s={44} w={600} c={BRAND}>₹66,000 / टन</T></div>
      <div style={abs(xd + 30, Yb - 80, ro(t, drop + 0.6))}><Row gap={10}><Ic n="down" size={40} color={RED} sw={3.4} /><T s={36} c={RED}>बाजारभाव कमी</T></Row></div>
      <div style={abs(xs - 30, Ys + 30, ro(t, sell))}><T s={28} c={MUTED}>विक्री</T><T s={40} w={500} c={RED}>कमी दरात</T></div>
      <T s={36} w={500} c={RED} style={abs(xs + 120, (Yb + Ys) / 2 - 22, ro(t, loss))}>नुकसान</T>
      {/* turnover vs profit */}
      <Card x={1320} y={330} w={460} h={260} style={{padding: 40, boxSizing: 'border-box', ...ro(t, turn)}}>
        <T s={34} c={MUTED}>उलाढाल</T>
        <Row gap={20} style={{marginTop: 20}}><Ic n="up" size={80} color={WHITE} sw={3} /><T s={56} w={500}>चालू</T></Row>
      </Card>
      <Card x={1320} y={630} w={460} h={260} style={{padding: 40, boxSizing: 'border-box', border: `2px solid ${RED}`, ...ro(t, loss)}}>
        <T s={34} c={MUTED}>नफा</T>
        <Row gap={20} style={{marginTop: 20}}><Ic n="down" size={80} color={RED} sw={3} /><T s={56} w={500} c={RED}>नुकसान</T></Row>
      </Card>
      <Sfx at={buy} n="pop" v={0.25} />
      <Sfx at={drop} n="whoosh" v={0.25} rate={0.8} />
      <Sfx at={sell} n="pop" v={0.2} rate={0.8} />
      <Sfx at={turn} n="swish" v={0.2} />
      <Sfx at={loss} n="buzz" v={0.3} />
    </AbsoluteFill>
  );
};

/* 17 What matters: the cash cycle */
const Cycle = () => {
  const t = useT();
  const a = S(82), b = S(83), g1 = WT(83, 'गोदामात'), g2 = WT(83, 'ग्राहकांकडे'), g3 = WT(83, 'लवकर');
  const C = [960, 640], R = 250;
  const nodes = [['rupee', 'पैसे', -90], ['bag', 'माल', 0], ['shop', 'विक्री', 90], ['hand', 'उधारी', 180]];
  const hl = [null, g1, g3, g2];
  const ang = ((t - a) * 50) % 360;
  return (
    <AbsoluteFill>
      <Title t={t} at={a} y={160} s={52}><span style={{color: MUTED}}>फक्त किती माल विकला</span> — हे पुरेसं नाही</Title>
      <svg style={abs(0, 0)} width="1920" height="1080">
        <circle cx={C[0]} cy={C[1]} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeDasharray="10 12" opacity={io(t, a + 0.3, a + 0.8)} />
        <circle cx={C[0] + R * Math.cos(ang * Math.PI / 180)} cy={C[1] + R * Math.sin(ang * Math.PI / 180)} r="12" fill={BRAND} opacity={io(t, a + 0.6, a + 1)} />
      </svg>
      <T s={34} c={DIM} style={abs(C[0], C[1] - 20, {translate: '-50% 0', ...ro(t, a + 0.5)})}>चक्र</T>
      {nodes.map(([ic, label, deg], k) => {
        const x = C[0] + R * Math.cos(deg * Math.PI / 180), y = C[1] + R * Math.sin(deg * Math.PI / 180);
        const on = hl[k] !== null && t > hl[k];
        return <Node key={k} t={t} at={a + 0.3 + k * 0.15} x={x} y={y} icon={ic} r={70} glow={on || k === 0} label={k === 2 ? null : null} />;
      })}
      {nodes.map(([, label, deg], k) => {
        const x = C[0] + (R + 0) * Math.cos(deg * Math.PI / 180), y = C[1] + R * Math.sin(deg * Math.PI / 180);
        const pos = {0: [x, y - 150, '-50% 0'], 1: [x + 100, y - 24, '0 0'], 2: [x, y + 84, '-50% 0'], 3: [x - 100, y - 24, '-100% 0']}[k];
        return <T key={k} s={36} w={500} style={abs(pos[0], pos[1], {translate: pos[2], ...ro(t, a + 0.4 + k * 0.15)})}>{label}</T>;
      })}
      <div style={abs(1420, 560)}><YPill t={t} at={g1} icon="clock" s={34}>गोदामात किती दिवस?</YPill></div>
      <div style={abs(500, 560, {transform: 'translateX(-100%)'})}><YPill t={t} at={g2} icon="clock" s={34}>उधारी किती दिवस?</YPill></div>
      <div style={abs(1180, 930)}><YPill t={t} at={g3} icon="bolt" s={34}>विक्रीचा वेग</YPill></div>
      <Sfx at={a + 0.3} n="swish" v={0.2} />
      {[g1, g2, g3].map((x, k) => <Sfx key={k} at={x} n="pop" v={0.22} rate={1 + k * 0.08} />)}
    </AbsoluteFill>
  );
};

/* 18 Three things to start */
const Needs = () => {
  const t = useT();
  const cards = [['warehouse', 'जागा', 'दुकान + गोदाम', S(86)], ['wallet', 'भांडवल', 'माल खरेदीसाठी', S(87)], ['truck', 'Delivery', 'माल पोहोचवणं', S(88)]];
  return (
    <AbsoluteFill>
      <div style={abs(140, 170, ro(t, S(84)))}>
        <T s={60} w={500}>स्वतःचं दुकान सुरू करायचंय?</T>
        <div style={{marginTop: 26}}><YPill t={t} at={S(85)} s={36}>सुरुवातीला 3 गोष्टी</YPill></div>
      </div>
      {cards.map(([ic, h, sub, at], k) => (
        <Card key={k} x={140 + k * 560} y={430} w={520} h={440} style={{padding: 44, boxSizing: 'border-box', ...ro(t, at)}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T s={38} w={600} c={INK} style={{paddingTop: 6}}>{k + 1}</T></div>
          <div style={{marginTop: 40}}><Ix n={ic} size={100} color={WHITE} sw={2.6} /></div>
          <T s={60} w={500} style={{marginTop: 34}}>{h}</T>
          <T s={34} c={MUTED} style={{marginTop: 10}}>{sub}</T>
        </Card>
      ))}
      {cards.map(([, , , at], k) => <Sfx key={k} at={at} n="pop" v={0.22} rate={1 + k * 0.06} />)}
    </AbsoluteFill>
  );
};

/* 19 Floor plan */
const Space = () => {
  const t = useT();
  const a = S(89), sq = WT(89, '1,500'), z = S(90);
  const zc = WT(90, 'गोण्या'), zs = WT(90, 'सळ्या'), zo = WT(90, 'इतर');
  const X = 200, Y = 280, W = 1080, H = 600;
  return (
    <AbsoluteFill>
      <svg style={abs(0, 0)} width="1920" height="1080">
        <rect x={X} y={Y} width={W} height={H} rx="10" fill="rgba(255,255,255,0.03)" stroke={WHITE} strokeWidth="3" {...draw(io(t, a, a + 1.2))} />
        <path d={`M${X} ${Y - 40} H${X + W} M${X} ${Y - 52} v24 M${X + W} ${Y - 52} v24`} stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" opacity={io(t, sq - 0.3, sq)} />
        {[[X + 30, 380, zc], [X + 440, 330, zs], [X + 800, 250, zo]].map(([x, w, at], k) => (
          <rect key={k} x={x} y={Y + 30} width={w} height={H - 60} rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeDasharray="8 8" opacity={io(t, at - 0.2, at + 0.2)} />
        ))}
      </svg>
      <div style={abs(X + W / 2, Y - 110, {transform: 'translateX(-50%)'})}><YPill t={t} at={sq} s={36}>1,500–2,000 sq ft</YPill></div>
      {/* zones */}
      <div style={abs(X + 60, Y + 60, {display: 'grid', gridTemplateColumns: 'repeat(6, 50px)', gap: 8})}>
        {Array.from({length: 48}).map((_, i) => <Bag key={i} w={50} h={50} o={t > zc + i * 0.02 ? 1 : 0} />)}
      </div>
      <T s={36} w={500} style={abs(X + 60, Y + H - 90, ro(t, zc))}>सिमेंट</T>
      {Array.from({length: 9}).map((_, i) => (
        <div key={i} style={abs(X + 470, Y + 70 + i * 44, {width: 270 * io(t, zs + i * 0.05, zs + i * 0.05 + 0.4), height: 9, borderRadius: 5, background: '#8FA3B3'})} />
      ))}
      <T s={36} w={500} style={abs(X + 470, Y + H - 90, ro(t, zs))}>सळ्या</T>
      {[[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]].map(([c, r], i) => (
        <div key={i} style={abs(X + 830 + c * 100, Y + 70 + r * 100, {...po(t, zo + i * 0.1)})}><Ix n="box" size={80} color="rgba(255,255,255,0.6)" sw={2.6} /></div>
      ))}
      <T s={36} w={500} style={abs(X + 830, Y + H - 90, ro(t, zo))}>इतर</T>
      <div style={abs(1380, 330, {display: 'flex', flexDirection: 'column', gap: 26})}>
        <Pill t={t} at={WT(89, 'तालुक्याच्या')} icon="pin" s={36}>तालुक्याचं ठिकाण</Pill>
        <Pill t={t} at={WT(89, 'भाड्याने')} icon="key" s={36}>भाड्याने जागा</Pill>
      </div>
      <Sfx at={a} n="paper" v={0.25} />
      <Sfx at={sq} n="pop" v={0.25} />
      <Sfx at={zc} n="swish" v={0.2} />
      <Sfx at={zs} n="swish" v={0.2} />
      <Sfx at={zo} n="swish" v={0.2} />
    </AbsoluteFill>
  );
};

/* 20 Capital maths */
const Capital = () => {
  const t = useT();
  const a = S(91), l1 = S(92), v1 = WT(93, '₹1.65'), l2 = S(94), v2 = WT(94, '₹13.2'), tot = WT(95, '₹15');
  return (
    <AbsoluteFill>
      <Brow t={t} at={a} icon="calc" y={150}>उदाहरण</Brow>
      <Card x={400} y={250} w={1120} h={680} style={{padding: '50px 64px', boxSizing: 'border-box', ...ro(t, l1 - 0.3)}}>
        <T s={34} c={DIM}>स्टॉकसाठी भांडवल</T>
        <div style={{height: 30}} />
        <Row style={{justifyContent: 'space-between', ...ro(t, l1)}}>
          <Row gap={20}><Bag w={40} h={46} /><T s={44} c={MUTED}>500 गोण्या × ₹330</T></Row>
          <T s={64} w={500} style={fade2(t, v1)}>₹1.65 लाख</T>
        </Row>
        <div style={{height: 34}} />
        <Row style={{justifyContent: 'space-between', ...ro(t, l2)}}>
          <Row gap={20}><Ix n="rods" size={46} color="#8FA3B3" sw={3.4} /><T s={44} c={MUTED}>20 टन × ₹66,000</T></Row>
          <T s={64} w={500} style={fade2(t, v2)}>₹13.2 लाख</T>
        </Row>
        <Divider t={t} at={tot - 0.4} />
        <Row style={{justifyContent: 'space-between', ...ro(t, tot - 0.2)}}>
          <T s={44} c={MUTED}>फक्त दोन उत्पादनांसाठी</T>
          <T s={110} w={600} c={BRAND}>≈ ₹15 लाख</T>
        </Row>
        <div style={{marginTop: 36, height: 30, borderRadius: 10, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)'}}>
          <div style={{width: `${11 * io(t, v1, v1 + 0.6)}%`, background: CEMENT}} />
          <div style={{width: `${89 * io(t, v2, v2 + 0.9)}%`, background: '#8FA3B3'}} />
        </div>
      </Card>
      <Sfx at={l1} n="tick" v={0.28} />
      <Sfx at={v1} n="coin" v={0.2} />
      <Sfx at={l2} n="tick" v={0.28} />
      <Sfx at={v2} n="coin" v={0.2} />
      <Sfx at={tot} n="cash" v={0.3} />
    </AbsoluteFill>
  );
};

/* 21 Other costs + working capital */
const Extras = () => {
  const t = useT();
  const wc = WT(97, 'Working');
  const chips = [['key', 'डिपॉझिट', 'डिपॉझिट'], ['rack', 'रॅक', 'रॅक'], ['scale', 'वजनकाटा', 'वजनकाटा'], ['users', 'कर्मचारी', 'कर्मचारी'], ['truck', 'वाहतूक', 'वाहतूक'], ['cal', 'रोजचा खर्च', 'रोजच्या']];
  const pos = [[330, 330], [330, 560], [330, 790], [1590, 330], [1590, 560], [1590, 790]];
  const dim = io(t, wc, wc + 0.4, 1, 0.45);
  return (
    <AbsoluteFill>
      <Card x={760} y={300} w={400} h={260} glow style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...ro(t, S(96) - 0.2)}}>
        <T s={34} c={MUTED}>माल</T><T s={84} w={600} c={BRAND}>₹15 लाख</T>
      </Card>
      {chips.map(([ic, label, frag], k) => (
        <div key={k} style={abs(pos[k][0], pos[k][1], {transform: 'translate(-50%,-50%)', opacity: dim})}>
          <Pill t={t} at={WT(96, frag)} icon={ic} s={38}>+ {label}</Pill>
        </div>
      ))}
      <div style={abs(960, 640, {translate: '-50% 0', textAlign: 'center', ...po(t, wc)})}>
        <div style={{display: 'inline-block', borderRadius: 28, border: `3px solid ${BRAND}`, background: 'rgba(255,208,20,0.10)', padding: '22px 50px 12px'}}>
          <T s={64} w={500} c={BRAND}>+ Working Capital</T>
          <T s={32} c={MUTED} style={{marginTop: 6}}>उधारी दिली तर</T>
        </div>
      </div>
      {chips.map(([, , frag], k) => <Sfx key={k} at={WT(96, frag)} n="pop" v={0.18} rate={1 + k * 0.05} />)}
      <Sfx at={wc} n="thud" v={0.3} />
    </AbsoluteFill>
  );
};

/* 22 Start small, grow later */
const Small = () => {
  const t = useT();
  const later = S(101);
  const rowsL = [['check', 'कमी स्टॉक', WT(98, 'कमी')], ['check', 'ऑर्डरनुसार माल', WT(98, 'ऑर्डरनुसार')]];
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(98) - 0.2} icon="up" y={160}>छोटी सुरुवात</Brow>
      <Card x={160} y={290} w={760} h={600} style={{padding: '44px 54px', boxSizing: 'border-box', ...ro(t, S(98))}}>
        <T s={34} c={DIM}>सुरुवातीला</T>
        {rowsL.map(([ic, txt, at], k) => (
          <Row key={k} gap={22} style={{marginTop: 34, ...ro(t, at)}}><Ic n={ic} size={46} color={BRAND} sw={4} /><T s={52} w={500}>{txt}</T></Row>
        ))}
        <Row gap={22} style={{marginTop: 34, ...ro(t, S(99))}}>
          <Ic n="x" size={46} color={RED} sw={4} />
          <div style={{position: 'relative'}}><T s={52} c={MUTED}>स्वतःचा ट्रक</T>{strike(t, S(99) + 0.6)}</div>
        </Row>
        <Row gap={22} style={{marginTop: 34, ...ro(t, WT(100, 'ट्रान्सपोर्ट'))}}><Ic n="check" size={46} color={BRAND} sw={4} /><T s={52} w={500}>बाहेरचा ट्रान्सपोर्ट</T></Row>
      </Card>
      <Arrow t={t} at={later - 0.3} x1={950} y1={590} x2={1060} y2={590} c={DIM} />
      <Card x={1090} y={290} w={670} h={600} glow style={{padding: '44px 54px', boxSizing: 'border-box', ...ro(t, later)}}>
        <T s={34} c={DIM}>व्यवसाय वाढल्यावर</T>
        <div style={{marginTop: 60}}><Ix n="truck" size={170} color={BRAND} sw={2.4} /></div>
        <T s={56} w={500} style={{marginTop: 40}}>स्वतःची Delivery</T>
      </Card>
      {rowsL.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.2} />)}
      <Sfx at={S(99) + 0.6} n="buzz" v={0.15} />
      <Sfx at={WT(100, 'ट्रान्सपोर्ट')} n="pop" v={0.2} />
      <Sfx at={later} n="whoosh" v={0.25} />
    </AbsoluteFill>
  );
};

/* 23 Contractor network */
const Network = () => {
  const t = useT();
  const a = S(102), con = S(103), ord = S(104), stop = S(105), opp = S(106);
  const C = [960, 610];
  const pts = Array.from({length: 26}).map((_, i) => {
    const ang = (i / 26) * Math.PI * 2 + 0.2, rr = 1 + ((i * 37) % 7) / 30;
    return [C[0] + Math.cos(ang) * 600 * rr, C[1] + Math.sin(ang) * 300 * rr];
  });
  const dim = io(t, stop, stop + 0.4, 1, 0.12);
  return (
    <AbsoluteFill>
      <div style={{opacity: dim}}>
        <svg style={abs(0, 0)} width="1920" height="1080">
          {pts.map(([x, y], i) => <line key={i} x1={C[0]} y1={C[1]} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" opacity={io(t, con + i * 0.05, con + i * 0.05 + 0.3)} />)}
        </svg>
        {pts.map(([x, y], i) => (
          <div key={i} style={abs(x - 22, y - 22, {width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...po(t, con + i * 0.05)})}>
            <Ix n="helmet" size={26} color={WHITE} sw={3.4} />
          </div>
        ))}
        {/* orders flowing in */}
        {t > ord && Array.from({length: 8}).map((_, k) => {
          const st = ord + k * 0.45, p = ((t - st) % 3.6) / 1.2;
          if (t < st || p > 1) return null;
          const [x, y] = pts[(k * 7) % 26];
          return <div key={k} style={abs(x + (C[0] - x) * p - 16, y + (C[1] - y) * p - 18, {opacity: Math.sin(p * Math.PI)})}>{k % 2 ? <Bag w={32} h={36} /> : <Ix n="rods" size={36} color="#8FA3B3" sw={4} />}</div>;
        })}
        <Node t={t} at={a} x={C[0]} y={C[1]} icon="shop" r={100} glow />
        <div style={abs(140, 170, ro(t, con))}><T s={36} c={MUTED}>नियमित ग्राहक</T><T s={64} w={500}><span style={{color: BRAND, fontWeight: 600}}>20–30</span> कॉन्ट्रॅक्टर्स</T></div>
        <div style={abs(1780, 190, {transform: 'translateX(-100%)'})}><Pill t={t} at={ord} icon="cal" s={34}>दर महिन्याला ऑर्डर्स</Pill></div>
      </div>
      <Title t={t} at={stop} y={430} s={80}>पण इथेच थांबायचं नाही</Title>
      <div style={abs(960, 600, {transform: 'translateX(-50%)'})}><YPill t={t} at={opp} icon="spark" s={48}>नवीन संधी</YPill></div>
      <Sfx at={a} n="pop" v={0.25} />
      {[0, 6, 12, 18, 24].map((i) => <Sfx key={i} at={con + i * 0.05} n="pop" v={0.12} rate={1 + i * 0.01} />)}
      <Sfx at={stop} n="whoosh" v={0.25} />
      <Sfx at={opp} n="chime" v={0.25} />
    </AbsoluteFill>
  );
};

/* 24 A house needs more than cement and steel */
const Needs2 = () => {
  const t = useT();
  const a = S(107), q = S(109);
  const items = [['pile', 'वाळू', 'वाळू'], ['pile', 'खडी', 'खडी'], ['brick', 'विटा', 'विटा'], ['block', 'ब्लॉक्स', 'ब्लॉक्स'], ['pipe', 'पाइप्स', 'पाइप्स'], ['drop', 'Waterproofing', 'Waterproofing']];
  return (
    <AbsoluteFill>
      <Card x={140} y={240} w={560} h={560} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, ...ro(t, a)}}>
        <Ic n="home" size={180} color={WHITE} sw={2.4} />
        <T s={44} w={500}>घर बांधणारा ग्राहक</T>
        <Row gap={16}><Bag w={34} h={38} /><Ix n="rods" size={40} color="#8FA3B3" sw={3.4} /><T s={32} c={MUTED}>फक्त एवढंच नाही</T></Row>
      </Card>
      <div style={abs(800, 260, {display: 'grid', gridTemplateColumns: '460px 460px', rowGap: 34, columnGap: 30})}>
        {items.map(([ic, label, frag], k) => (
          <div key={k}><Pill t={t} at={WT(108, frag)} icon={ic} s={44}>{label}</Pill></div>
        ))}
      </div>
      <Title t={t} at={q} y={850} s={64}>सगळं <Hi at={WT(109, 'एकाच') - 0.1}>एकाच ठिकाणी</Hi> मिळालं तर?</Title>
      {items.map(([, , frag], k) => <Sfx key={k} at={WT(108, frag)} n="pop" v={0.18} rate={1 + k * 0.05} />)}
      <Sfx at={q} n="swish" v={0.2} />
    </AbsoluteFill>
  );
};

/* 25 One customer, many products */
const Expansion = () => {
  const t = useT();
  const wk = [[S(110), 'पहिल्यांदा', [['bag', 'सिमेंट'], ['rods', 'लोखंड']]], [S(111), 'मग', [['pile', 'वाळू'], ['pile', 'खडी']]], [S(112), 'पुढच्या आठवड्यात', [['brick', 'विटा']]]];
  const ns = S(114), bar = S(115), pe = WT(116, 'Product');
  return (
    <AbsoluteFill>
      <div style={abs(960, 160, {transform: 'translateX(-50%)'})}><Pill t={t} at={S(110) - 0.3} icon="shop" c={BRAND} bg="rgba(255,208,20,0.10)" bd="rgba(255,208,20,0.5)" s={36}>तुमचं दुकान</Pill></div>
      {wk.map(([at, label, its], k) => (
        <React.Fragment key={k}>
          <Arrow t={t} at={at - 0.2} x1={960} y1={240} x2={390 + k * 570} y2={320} c="rgba(255,255,255,0.25)" bend={k === 1 ? 0 : (k ? 0.1 : -0.1)} />
          <Card x={160 + k * 570} y={330} w={500} h={300} style={{padding: 38, boxSizing: 'border-box', ...ro(t, at)}}>
            <T s={32} c={DIM}>{label}</T>
            <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 22}}>
              {its.map(([ic, n]) => <Row key={n} gap={20}><Ix n={ic} size={50} color={WHITE} sw={3} /><T s={48} w={500}>{n}</T></Row>)}
            </div>
          </Card>
        </React.Fragment>
      ))}
      {/* no running around */}
      <div style={abs(160, 700, ro(t, ns))}>
        <Row gap={20}>
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{position: 'relative'}}><Ix n="shop" size={60} color={DIM} sw={3} />{t > ns + 0.5 && <div style={abs(-6, 26, {width: 74, height: 5, background: RED, transform: 'rotate(-30deg)', borderRadius: 3, opacity: io(t, ns + 0.5 + k * 0.1, ns + 0.7 + k * 0.1)})} />}</div>
          ))}
          <T s={36} c={MUTED} style={{marginLeft: 10}}>वेगवेगळ्या दुकानांत जायची गरज नाही</T>
        </Row>
      </div>
      <div style={abs(160, 800, ro(t, bar))}>
        <T s={32} c={MUTED}>एका ग्राहकाकडून विक्री</T>
        <div style={{marginTop: 14, height: 30, width: 1100, display: 'flex', gap: 6}}>
          {[[CEMENT, 0.3], ['#8FA3B3', 0.32], ['#E3C690', 0.18], ['#D99A7A', 0.14]].map(([c, w], k) => (
            <div key={k} style={{height: '100%', borderRadius: 8, background: c, width: `${w * 100 * io(t, bar + k * 0.3, bar + k * 0.3 + 0.5)}%`}} />
          ))}
        </div>
      </div>
      <div style={abs(1780, 770, {translate: '-100% 0', ...ro(t, pe - 0.2)})}><T s={64} w={600}><Hi at={pe}>Product Expansion</Hi></T></div>
      {wk.map(([at], k) => <Sfx key={k} at={at} n="pop" v={0.2} rate={1 + k * 0.06} />)}
      <Sfx at={ns + 0.5} n="buzz" v={0.12} />
      <Sfx at={bar} n="swish" v={0.2} />
      <Sfx at={pe} n="chime" v={0.25} />
    </AbsoluteFill>
  );
};

/* 26 Growth ladder */
const Ladder = () => {
  const t = useT();
  const steps = [['helmet', 'बिल्डर्सना थेट Supply', S(117)], ['shop', 'छोट्या दुकानदारांना', S(118)], ['warehouse', 'मोठं गोदाम', S(119)], ['pin', 'आसपासची गावं', S(120)]];
  const top = WT(121, 'Distribution');
  const lvl = steps.filter(([, , at]) => t > at).length;
  return (
    <AbsoluteFill>
      {steps.map(([ic, label, at], k) => {
        const x = 160 + k * 370, y = 820 - k * 140;
        return (
          <React.Fragment key={k}>
            <div style={abs(x, y, {width: 350, height: 1000 - y, borderRadius: '20px 20px 0 0', background: k === lvl - 1 ? 'rgba(255,208,20,0.10)' : 'rgba(255,255,255,0.05)', border: `2px solid ${k === lvl - 1 ? 'rgba(255,208,20,0.5)' : FAINT}`, borderBottom: 'none', transformOrigin: 'bottom', transform: `scaleY(${io(t, at - 0.3, at + 0.3)})`})} />
            <div style={abs(x + 30, y + 30, ro(t, at))}><Ix n={ic} size={60} color={k === lvl - 1 ? BRAND : WHITE} sw={3} /><T s={38} w={500} style={{marginTop: 14, whiteSpace: 'normal', width: 300, lineHeight: 1.15}}>{label}</T></div>
          </React.Fragment>
        );
      })}
      <Card x={160} y={200} w={600} h={240} glow style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 44px', boxSizing: 'border-box', ...ro(t, top - 0.3)}}>
        <T s={32} c={MUTED}>छोटं दुकान →</T>
        <T s={60} w={500} style={{marginTop: 10}}><Hi at={top}>Distribution Business</Hi></T>
      </Card>
      {steps.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.2} rate={0.9 + k * 0.1} />)}
      <Sfx at={top} n="chime" v={0.28} />
    </AbsoluteFill>
  );
};

/* 27 The answer: volume, network, cash flow */
const Answer = () => {
  const t = useT();
  const pil = [['bag', 'Volume', WT(124, 'Volume')], ['people', 'Network', WT(124, 'Network')], ['loop', 'Cash Flow', WT(124, 'Cash')]];
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(122)} icon="rewind" y={170}>सुरुवातीचा प्रश्न</Brow>
      <Title t={t} at={S(123)} y={290} s={60}>मार्जिन कमी, तरी व्यापारी <span style={{color: BRAND}}>मोठे कसे?</span></Title>
      {pil.map(([ic, label, at], k) => (
        <Card key={k} x={200 + k * 540} y={470} w={440} h={400} glow style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, ...ro(t, at)}}>
          <Ix n={ic} size={130} color={BRAND} sw={2.6} />
          <T s={68} w={500}>{label}</T>
        </Card>
      ))}
      <Sfx at={S(123)} n="pop" v={0.2} />
      {pil.map(([, , at], k) => <Sfx key={k} at={at} n="thud" v={0.22} rate={1 + k * 0.08} />)}
    </AbsoluteFill>
  );
};

/* 28 One trader's growth on a map */
const Growth = () => {
  const t = useT();
  const s1 = S(125), s2 = S(126), vil = S(127), tw = S(128), old = S(129), sup = WT(130, 'Construction'), trucks = S(131), many = S(132);
  const shops = [[960, 600, s1], [640, 430, s2], [1260, 760, s2 + 0.4]];
  const vills = [[380, 300], [420, 700], [700, 860], [1000, 330], [1350, 380], [1600, 560], [1560, 880], [260, 520], [1180, 940], [820, 240]];
  const near = (x, y) => shops.reduce((b, s) => (Math.hypot(s[0] - x, s[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? s : b));
  return (
    <AbsoluteFill>
      {/* faint map dots */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 2px, transparent 2px)', backgroundSize: '36px 36px', opacity: 0.6 * io(t, s1, s1 + 0.6),
        WebkitMaskImage: 'radial-gradient(800px 420px at 50% 56%, #000 50%, transparent 100%)', maskImage: 'radial-gradient(800px 420px at 50% 56%, #000 50%, transparent 100%)'}} />
      <svg style={abs(0, 0)} width="1920" height="1080">
        {vills.map(([x, y], i) => { const [sx, sy] = near(x, y); return <line key={i} x1={sx} y1={sy} x2={x} y2={y} stroke="rgba(255,208,20,0.35)" strokeWidth="2.5" {...draw(io(t, vil + i * 0.12, vil + i * 0.12 + 0.6))} />; })}
        {shops.slice(1).map(([x, y, at], i) => <line key={i} x1={960} y1={600} x2={x} y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="3" {...draw(io(t, at, at + 0.5))} />)}
      </svg>
      {vills.map(([x, y], i) => <div key={i} style={abs(x - 14, y - 14, {width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)', ...po(t, vil + i * 0.12)})} />)}
      {/* customers */}
      {t > many && Array.from({length: 60}).map((_, i) => {
        const ang = i * 2.4, rr = 120 + ((i * 53) % 330);
        return <div key={i} style={abs(960 + Math.cos(ang) * rr * 1.6, 600 + Math.sin(ang) * rr * 0.75, {width: 10, height: 10, borderRadius: 5, background: BRAND, opacity: 0.7 * io(t, many + i * 0.03, many + i * 0.03 + 0.2)})} />;
      })}
      {/* trucks moving along routes */}
      {t > trucks && vills.slice(0, 6).map(([x, y], i) => {
        const [sx, sy] = near(x, y); const p = (((t - trucks) * 0.35 + i * 0.17) % 1); const q = p < 0.5 ? p * 2 : 2 - p * 2;
        return <div key={i} style={abs(sx + (x - sx) * q - 22, sy + (y - sy) * q - 22, {opacity: io(t, trucks, trucks + 0.4)})}><Ix n="truck" size={44} color={BRAND} sw={3.6} /></div>;
      })}
      {shops.map(([x, y, at], i) => (
        <Node key={i} t={t} at={at} x={x} y={y} icon={i === 0 && t > tw ? 'warehouse' : 'shop'} r={i ? 52 : 70} glow={i === 0} />
      ))}
      <div style={abs(960, 160, {translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 30, ...ro(t, old)})}>
        <div style={{position: 'relative'}}><T s={48} c={MUTED}>सिमेंट दुकानदार</T>{strike(t, sup - 0.4)}</div>
        <T s={58} w={500} style={{opacity: io(t, sup - 0.2, sup + 0.2)}}><Hi at={sup}>Construction Material Supplier</Hi></T>
      </div>
      <div style={abs(140, 930)}><Pill t={t} at={trucks} icon="truck" s={34}>रोज ट्रक्सची आवक-जावक</Pill></div>
      <div style={abs(1780, 930, {transform: 'translateX(-100%)'})}><YPill t={t} at={many} icon="users" s={34}>शेकडो ग्राहक</YPill></div>
      <Pill t={t} at={tw} x={1060} y={690} icon="truck" s={30}>+ ट्रक, गोदाम</Pill>
      <Sfx at={s1} n="pop" v={0.25} />
      <Sfx at={s2} n="pop" v={0.22} />
      <Sfx at={s2 + 0.4} n="pop" v={0.22} rate={1.1} />
      <Sfx at={vil} n="swish" v={0.2} />
      <Sfx at={tw} n="thud" v={0.25} />
      <Sfx at={sup} n="chime" v={0.25} />
      <Sfx at={trucks} n="whoosh" v={0.2} />
      <Sfx at={many} n="coin" v={0.2} />
    </AbsoluteFill>
  );
};

/* 29 Income sources + reinvestment flywheel */
const Flywheel = () => {
  const t = useT();
  const a = S(133), st = WT(133, 'अवलंबून'), src = [['box', 'वेगवेगळी उत्पादनं', WT(134, 'उत्पादनांमधून')], ['rods', 'मोठ्या ऑर्डर्स', WT(134, 'ऑर्डर्समधून')], ['people', 'Distribution Network', WT(134, 'Distribution')]];
  const re = S(135), grow = S(136);
  const C = [700, 720], R = 190;
  const loop = [['rupee', 'नफा', -90, re], ['warehouse', 'गोदाम', 0, WT(135, 'गोदाम')], ['truck', 'ट्रक', 90, WT(135, 'ट्रक')], ['shop', 'नवीन दुकानं', 180, WT(135, 'नवीन')]];
  const ang = ((t - re) * 60) % 360;
  return (
    <AbsoluteFill>
      <Row gap={30} style={abs(140, 170, ro(t, a))}>
        <div style={{position: 'relative'}}><T s={48} c={MUTED}>₹8 / गोणी</T>{strike(t, st)}</div>
        <T s={44} c={DIM}>वर अवलंबून नाही</T>
      </Row>
      <Row gap={24} style={abs(140, 290)}>
        {src.map(([ic, label, at], k) => <Pill key={k} t={t} at={at} icon={ic} s={36}>{label}</Pill>)}
      </Row>
      <svg style={abs(0, 0)} width="1920" height="1080">
        <circle cx={C[0]} cy={C[1]} r={R} fill="none" stroke="rgba(255,208,20,0.35)" strokeWidth="3" strokeDasharray="10 12" opacity={io(t, re, re + 0.5)} />
        {t > re && <circle cx={C[0] + R * Math.cos(ang * Math.PI / 180)} cy={C[1] + R * Math.sin(ang * Math.PI / 180)} r="11" fill={BRAND} />}
      </svg>
      {loop.map(([ic, label, deg, at], k) => {
        const x = C[0] + R * Math.cos(deg * Math.PI / 180), y = C[1] + R * Math.sin(deg * Math.PI / 180);
        const lp = {0: [x, y - 130, '-50% 0'], 1: [x + 80, y - 22, '0 0'], 2: [x, y + 72, '-50% 0'], 3: [x - 80, y - 22, '-100% 0']}[k];
        return (
          <React.Fragment key={k}>
            <Node t={t} at={at} x={x} y={y} icon={ic} r={58} glow={k === 0} />
            <T s={34} w={500} style={abs(lp[0], lp[1], {translate: lp[2], ...ro(t, at)})}>{label}</T>
          </React.Fragment>
        );
      })}
      <T s={30} c={MUTED} style={abs(C[0], C[1] - 18, {translate: '-50% 0', ...ro(t, re + 0.3)})}>पुन्हा गुंतवणूक</T>
      {/* growth */}
      <Card x={1200} y={440} w={580} h={480} style={{padding: 40, boxSizing: 'border-box', ...ro(t, grow)}}>
        <T s={32} c={MUTED}>वर्षानुवर्षे</T>
        <svg width="500" height="260" style={{marginTop: 20, overflow: 'visible'}}>
          <path d="M10 250 C 150 240, 260 200, 330 140 S 450 30, 490 10" fill="none" stroke={BRAND} strokeWidth="6" strokeLinecap="round" {...draw(io(t, grow + 0.2, grow + 2))} />
          <line x1="10" y1="250" x2="490" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        </svg>
        <Row gap={30} style={{marginTop: 10}}><T s={38} w={500}>आकार ↑</T><T s={38} w={500} c={BRAND}>मालमत्ता ↑</T></Row>
      </Card>
      <Sfx at={st} n="buzz" v={0.15} />
      {src.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.2} rate={1 + k * 0.06} />)}
      {loop.map(([, , , at], k) => <Sfx key={k} at={at} n="tick" v={0.22} />)}
      <Sfx at={grow} n="swish" v={0.2} />
    </AbsoluteFill>
  );
};

/* 30 Caution */
const Caution = () => {
  const t = useT();
  const items = [['clock', 'पैसे वेळेवर', WT(138, 'वेळेवर')], ['rupee', 'योग्य दरात खरेदी', WT(138, 'योग्य')], ['wallet', 'खर्च नियंत्रणात', WT(138, 'खर्च')]];
  return (
    <AbsoluteFill>
      <div style={abs(140, 170, ro(t, S(137)))}>
        <Eyebrow icon="bell">लक्षात ठेवा</Eyebrow>
        <T s={60} w={500} style={{marginTop: 26}}>फक्त मोठी विक्री <span style={{color: MUTED}}>पुरेशी नाही</span></T>
      </div>
      {items.map(([ic, label, at], k) => (
        <Card key={k} x={140 + k * 560} y={450} w={520} h={340} style={{padding: 44, boxSizing: 'border-box', ...ro(t, at)}}>
          <Row style={{justifyContent: 'space-between'}}><Ic n={ic} size={90} color={WHITE} sw={2.6} /><Ic n="check" size={56} color={BRAND} sw={4.4} /></Row>
          <T s={52} w={500} style={{marginTop: 60}}>{label}</T>
        </Card>
      ))}
      {items.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.22} rate={1 + k * 0.06} />)}
    </AbsoluteFill>
  );
};

/* 31 Is there an opportunity in your town? */
const Opportunity = () => {
  const t = useT();
  const rows = [['home', 'नवीन घरं बांधली जातायत', WT(140, 'घरे')], ['helmet', 'बिल्डर्स + कॉन्ट्रॅक्टर्स', WT(140, 'बिल्डर्स')], ['cal', 'नियमित मागणी', WT(140, 'नियमित')]];
  const yes = WT(140, 'संधी');
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(139)} icon="pin" y={170}>तुमच्या शहरात</Brow>
      <Card x={420} y={290} w={1080} h={430} style={{padding: '50px 64px', boxSizing: 'border-box', ...ro(t, S(140))}}>
        {rows.map(([ic, label, at], k) => (
          <Row key={k} gap={30} style={{marginBottom: 44, ...ro(t, at)}}>
            <Ix n={ic} size={60} color={WHITE} sw={3} />
            <T s={54} w={500} style={{flex: 1}}>{label}</T>
            <Ic n="check" size={54} color={BRAND} sw={4.4} />
          </Row>
        ))}
      </Card>
      <div style={abs(960, 790, {transform: 'translateX(-50%)'})}><YPill t={t} at={yes} icon="star" s={48} w={500}>संधी नक्कीच आहे</YPill></div>
      {rows.map(([, , at], k) => <Sfx key={k} at={at} n="tick" v={0.25} />)}
      <Sfx at={yes} n="chime" v={0.28} />
    </AbsoluteFill>
  );
};

/* 32 Homework before starting */
const Homework = () => {
  const t = useT();
  const rows = [
    ['users', <><span style={{color: BRAND, fontWeight: 600}}>10–15</span> व्यापाऱ्यांना भेटा</>, S(141)],
    ['rupee', 'मालाचे दर समजून घ्या', S(142)],
    ['star', 'कोणत्या ब्रँडला मागणी?', S(143)],
    ['truck', 'ट्रान्सपोर्टचा खर्च तपासा', S(144)],
    ['hand', 'बिल्डर्स-कॉन्ट्रॅक्टर्सशी संबंध', S(145)],
  ];
  const key = S(145), big = S(146);
  return (
    <AbsoluteFill>
      <Brow t={t} at={S(141) - 0.3} icon="check" y={150}>दुकान सुरू करण्याआधी</Brow>
      <Card x={300} y={250} w={1320} h={700} style={{padding: '40px 60px', boxSizing: 'border-box', ...ro(t, S(141))}}>
        {rows.map(([ic, label, at], k) => {
          const hot = k === 4;
          return (
            <Row key={k} gap={28} style={{padding: '24px 0 14px', borderBottom: k < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none', opacity: hot ? 1 : io(t, key + 0.4, key + 0.9, 1, 0.45), ...ro(t, at)}}>
              <T s={34} w={500} c={DIM} style={{width: 40}}>{k + 1}</T>
              <Ix n={ic} size={50} color={hot ? BRAND : WHITE} sw={3} />
              <T s={50} w={hot ? 500 : 400} style={{flex: 1}}>{hot ? <Hi at={key + 0.3}>{label}</Hi> : label}</T>
              {hot && <YPill t={t} at={big} icon="star" s={30}>सर्वात महत्त्वाचं</YPill>}
            </Row>
          );
        })}
      </Card>
      {rows.map(([, , at], k) => <Sfx key={k} at={at} n="tick" v={0.25} />)}
      <Sfx at={key + 0.3} n="ding" v={0.25} />
    </AbsoluteFill>
  );
};

/* 33 Finale */
const Finale = () => {
  const t = useT();
  const a = S(147), big = WT(147, 'मोठा'), sell = S(148), nodes = [['people', 'नेटवर्क', WT(149, 'नेटवर्क')], ['truck', 'Supply', WT(149, 'Supply')], ['loop', 'पैशांचा प्रवाह', WT(149, 'प्रवाह')]];
  const game = WT(150, 'खरा');
  return (
    <AbsoluteFill>
      <Row gap={40} style={abs(960, 190, {translate: '-50% 0', ...ro(t, a)})}>
        <Pill t={t} at={a} s={44} icon="bag">₹8 / गोणी</Pill>
        <svg width="120" height="40" style={{opacity: io(t, big - 0.3, big)}}><path d="M4 20h100M88 6l16 14-16 14" fill="none" stroke={BRAND} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <T s={72} w={500} c={BRAND} style={ro(t, big)}>मोठा व्यवसाय</T>
      </Row>
      <Title t={t} at={sell} y={350} s={50} c={MUTED}>तो फक्त गोण्या विकत नाही</Title>
      <svg style={abs(0, 0)} width="1920" height="1080">
        <line x1={480} y1={600} x2={1440} y2={600} stroke="rgba(255,255,255,0.15)" strokeWidth="3" {...draw(io(t, nodes[0][2], nodes[2][2] + 0.4))} />
      </svg>
      {nodes.map(([ic, label, at], k) => <Node key={k} t={t} at={at} x={480 + k * 480} y={600} icon={ic} r={92} glow label={label} />)}
      <Title t={t} at={game - 0.3} y={870} s={76}>हाच <Hi at={game}>खरा खेळ</Hi></Title>
      {nodes.map(([, , at], k) => <Sfx key={k} at={at} n="pop" v={0.22} rate={1 + k * 0.06} />)}
      <Sfx at={game} n="boom" v={0.22} />
    </AbsoluteFill>
  );
};

/* 34 CTA */
const Cta = () => {
  const t = useT();
  const sub = WT(151, 'Subscribe') - 0.6, click = sub + 1.4, clicked = t > click;
  const up = io(t, sub - 0.3, sub + 0.3);
  const press = clicked ? 1 - 0.08 * Math.sin(Math.min(1, (t - click) / 0.25) * Math.PI) : 1;
  const ring = clicked ? Math.sin((t - click) * 22) * 18 * Math.max(0, 1 - (t - click) / 1.2) : 0;
  const cur = io(t, sub + 0.4, click, 0, 1, INOUT);
  return (
    <AbsoluteFill>
      <Title t={t} at={S(151)} y={300} s={56} c={MUTED}>असंच वेगवेगळ्या व्यवसायांचं गणित</Title>
      <div style={abs(960, 560, {transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * up})`, opacity: up})}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36, background: WHITE, borderRadius: 120, padding: '28px 30px 28px 34px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)'}}>
          <div style={{width: 120, height: 120, borderRadius: 60, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 26, height: 26, borderRadius: 7, background: BRAND, boxShadow: '0 0 20px rgba(255,208,20,0.7)'}} />
          </div>
          <T s={64} w={500} c={INK}>तरुण उद्योजक</T>
          <div style={{transform: `scale(${press})`, marginLeft: 20, borderRadius: 80, background: clicked ? '#E9E7E2' : BRAND, padding: '30px 44px 22px'}}>
            <T s={44} w={600} c={INK}>{clicked ? 'Subscribed ✓' : 'Subscribe'}</T>
          </div>
          <div style={{transform: `rotate(${ring}deg)`, transformOrigin: '50% 10%', marginRight: 10}}><Ic n="bell" size={64} color={INK} sw={3.6} /></div>
        </div>
      </div>
      <svg width="60" height="70" viewBox="0 0 24 28" style={abs(1500 - cur * 210, 880 - cur * 280, {opacity: io(t, sub + 0.4, sub + 0.7) * io(t, click + 1.2, click + 1.6, 1, 0), filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'})}>
        <path d="M2 2l0 20 6-5 4 9 4-2-4-9 8 0z" fill={WHITE} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {clicked && <div style={abs(1290 - 60, 580 - 60, {width: 120, height: 120, borderRadius: 60, border: `4px solid ${BRAND}`, transform: `scale(${io(t, click, click + 0.6, 0.3, 1.6)})`, opacity: io(t, click, click + 0.6, 1, 0)})} />}
      <Title t={t} at={S(152)} y={800} s={60}>भेटूया पुढच्या व्हिडिओमध्ये!</Title>
      <Sfx at={click} n="click" v={0.4} />
      <Sfx at={click + 0.1} n="ding" v={0.25} />
    </AbsoluteFill>
  );
};

/* ============ timeline ============ */
const SCENES = [
  {key: 'hook', i: 0, C: Hook}, {key: 'margin', i: 7, C: Margin}, {key: 'paradox', i: 10, C: Paradox},
  {key: 'supply', i: 13, C: Supply}, {key: 'steel', i: 18, C: Steel}, {key: 'onestop', i: 20, C: OneStop},
  {key: 'cement', i: 25, C: CementMath}, {key: 'volume', i: 34, C: Volume}, {key: 'stock', i: 41, C: Stock},
  {key: 'steelintro', i: 44, C: SteelIntro}, {key: 'steelmath', i: 46, C: SteelMath}, {key: 'gross', i: 53, C: Gross},
  {key: 'skill', i: 59, C: Skill}, {key: 'credit', i: 62, C: Credit}, {key: 'options', i: 70, C: Options},
  {key: 'price', i: 77, C: PriceRisk}, {key: 'cycle', i: 82, C: Cycle}, {key: 'needs', i: 84, C: Needs},
  {key: 'space', i: 89, C: Space}, {key: 'capital', i: 91, C: Capital}, {key: 'extras', i: 96, C: Extras},
  {key: 'small', i: 98, C: Small}, {key: 'network', i: 102, C: Network}, {key: 'needs2', i: 107, C: Needs2},
  {key: 'expansion', i: 110, C: Expansion}, {key: 'ladder', i: 117, C: Ladder}, {key: 'answer', i: 122, C: Answer},
  {key: 'growth', i: 125, C: Growth}, {key: 'flywheel', i: 133, C: Flywheel}, {key: 'caution', i: 137, C: Caution},
  {key: 'opportunity', i: 139, C: Opportunity}, {key: 'homework', i: 141, C: Homework}, {key: 'finale', i: 147, C: Finale},
  {key: 'cta', i: 151, C: Cta},
].map((s) => ({...s, at: cut(s.i)}));
export const CHAPTERS = [
  {at: 0, label: 'एका गोणीमागे ₹8'}, {at: cut(13), label: 'माल कुठून?'}, {at: cut(25), label: 'सिमेंटचा हिशेब'},
  {at: cut(44), label: 'सळ्यांचा हिशेब'}, {at: cut(59), label: 'उधारीचा खेळ'}, {at: cut(77), label: 'बाजारभावाचा धोका'},
  {at: cut(84), label: 'भांडवल किती?'}, {at: cut(102), label: 'Product Expansion'}, {at: cut(122), label: 'मोठे कसे होतात?'},
  {at: cut(139), label: 'सुरू करण्याआधी'},
];

const Video = ({withAudio = true}) => (
  <AbsoluteFill style={{background: '#0E0E0F'}}>
    <Bg />
    <Scenes scenes={SCENES} total={TOTAL} />
    <Chrome chapters={CHAPTERS} total={TOTAL} />
    {SCENES.slice(1).map((s) => <Sfx key={s.key} at={s.at - 0.25} n="swish" v={0.12} />)}
    {withAudio && <Audio src={staticFile('vo.mp3')} />}
  </AbsoluteFill>
);

const Root = () => <Composition id="Construction" component={Video} durationInFrames={fr(TOTAL)} fps={FPS} width={1920} height={1080} defaultProps={{withAudio: true}} />;
registerRoot(Root);
