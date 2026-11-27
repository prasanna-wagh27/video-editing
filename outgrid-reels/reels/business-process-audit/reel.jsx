/*
 * "3 things that leak money every month" — Outgrid Labs reel, ISO style (shared/iso.jsx), 1080x1920, VO at original speed.
 * Bright office vectors (props.jsx): shop front, गल्ला with coins, desks + staff, ledgers, parcels, iso keycaps.
 * Names, groups, files, amounts and counts on screen are illustrative.
 * No headline at the top: captions bottom-left from frame 0 (orange highlights); the top only carries the small "// label".
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Mark, BRAND, InstagramLogo} from '../../shared/kit.jsx';
import {INK, MUTE, FAINT, GRN, RED, BLUE, LAT, up, popS, vis, P, Box, FaceT, Stage, at, Person, Tree, Card, Tag, Plate, Dot, Logo, Ico, IsoVideo} from '../../shared/iso.jsx';
import {OR, TEAL, TEAL_D, YEL, PINK, VIO, GOLD, WA, WA_D, XL, Floor, Desk, Shop, CashBox, CoinStack, Book, Parcel, Post, Pad, Key} from './props.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S} from './cues.mjs';

const TOTAL = s(TOTAL_S);
const ORT = '#E8590C'; // orange for text on paper
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontSize: size, fontWeight: wt, color, lineHeight: 1.15, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const ease = Easing.inOut(Easing.cubic);
const fmt = (n) => Math.round(n).toLocaleString('en-IN');
const shake = (F, t, d = 0.5, amp = 7) => (F >= s(t) && F < s(t + d) ? Math.sin(F * 1.7) * amp * io(F, s(t), s(t + d), 1, 0) : 0);
const Stamp = ({F, t, children, color = RED, rot = -10, size = 56, style = {}}) => !vis(F, t) ? null : (
  <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${io(F, s(t), s(t) + 6, 1.8, 1, Easing.out(Easing.cubic))})`, opacity: io(F, s(t), s(t) + 4),
    border: `6px solid ${color}`, color, borderRadius: 14, padding: '14px 28px 6px', fontSize: size, fontWeight: 800, letterSpacing: '0.02em', background: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', ...style}}>{children}</div>
);
// iso group that drops in from above with a little bounce
const drop = (F, t, d = 12, hgt = 3) => `translate(0 ${-hgt * (1 - io(F, s(t), s(t) + d, 0, 1, Easing.out(Easing.back(1.6))))})`;
const fade = (F, t, d = 6) => io(F, s(t), s(t) + d);

/* icons (24 grid) */
const I = {
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  rupee: <path d="M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7" />,
  box: <><path d="M3.5 8L12 4l8.5 4v8L12 20l-8.5-4z" /><path d="M3.5 8L12 12l8.5-4M12 12v8" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19c0-3.6 2.7-5.8 6-5.8s6 2.2 6 5.8" /><circle cx="16.5" cy="7.5" r="2.6" /><path d="M16 12.6c2.9 0 5 1.9 5 5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  book: <><path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z" /><path d="M5 18a2 2 0 0 1 2-2h11M9 8.5h5" /></>,
  hour: <><path d="M7 3.5h10M7 20.5h10" /><path d="M8 3.5c0 5 8 5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 5-8 8.5s8 3.5 8 8.5" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  cal: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  down: <path d="M12 4v15M6 13l6 6 6-6" />,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></>,
  flow: <><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="4" width="6" height="5" rx="1.2" /><rect x="9" y="15" width="6" height="5" rx="1.2" /><path d="M9 6.5h6M18 9v3.5h-6V15" /></>,
  cursor: <path d="M5 3l14 7.5-6 1.8L10 19z" />,
};
const Sym = ({n, size = 34, color = INK, sw = 2.4}) => <Ico d={I[n]} size={size} color={color} sw={sw} />;
const Chip = ({children, color = INK, bg = '#fff', size = 30, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color, border: `3px solid ${color === '#fff' ? INK : color}`, borderRadius: 999, padding: `${size * 0.3}px ${size * 0.6}px ${size * 0.14}px`, fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>
);
const Q = ({F, t, size = 110, ch = '?', style = {}}) => !vis(F, t) ? null : (
  <div style={{width: size, height: size, borderRadius: size / 2, background: RED, color: '#fff', fontSize: size * 0.66, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.1, boxSizing: 'border-box',
    border: `4px solid ${INK}`, boxShadow: `5px 6px 0 ${INK}`, ...popS(F, t, 9), ...style}}>{ch}</div>
);
const Badge = ({n, size = 44, color = WA}) => (
  <div style={{minWidth: size, height: size, borderRadius: size / 2, background: color, color: '#fff', fontSize: size * 0.52, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${size * 0.1}px ${size * 0.25}px 0`, boxSizing: 'border-box', ...LAT}}>{n}</div>
);
const LogoTile = ({src, sym, size = 92, bg = '#fff', color = INK}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: bg, border: `3px solid ${INK}`, boxShadow: `5px 6px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {src ? <Logo src={src} size={size * 0.64} /> : <Sym n={sym} size={size * 0.6} color={color} sw={2.4} />}
  </div>
);

// 1-2-3 stepper for the three leaks
const Stepper = ({F, t, active = 1, y = 168}) => (
  <Center y={y} style={up(F, t, 10, 20)}>
    <div style={{display: 'flex', alignItems: 'center', background: '#fff', border: `3px solid ${INK}`, borderRadius: 999, padding: '10px 14px', boxShadow: `5px 6px 0 ${INK}`}}>
      {[1, 2, 3].map((n) => (
        <React.Fragment key={n}>
          {n > 1 && <div style={{width: 54, borderTop: `3px ${n <= active ? 'solid' : 'dashed'} ${n <= active ? OR : FAINT}`}} />}
          <Dot n={n} size={60} color={n === active ? OR : n < active ? INK : '#fff'} style={{color: n <= active ? '#fff' : INK, border: `3px solid ${n === active ? OR : INK}`, transform: n === active ? `scale(${pop(F, t + 0.1, 10)})` : 'none'}} />
        </React.Fragment>
      ))}
    </div>
  </Center>
);

/* ================= scenes ================= */

/* 1. hook: your business (shop front), three warning tiles pop above it */
const HK = {x: 540, y: 960, k: 52};
const THREE = [['whatsapp.svg', null, 'ग्रुप्स', 150, 300], ['excel.svg', null, 'शीट्स', 435, 250], [null, 'bell', 'फॉलोअप', 720, 300]];
const Hook = ({F}) => {
  const rise = io(F, 0, 14, 0, 1, Easing.out(Easing.back(1.3)));
  const roof = at(HK, 0, 0, 3.6);
  return (
    <AbsoluteFill>
      <Stage {...HK}>
        <Floor x={-6} y={-5} w={12} d={10} top="#EFE7D6" />
        <FaceT x={-6} y={2.2} z={0.003} w={12} d={2.4} fill="#4A4F57" />
        <FaceT x={-6} y={3.36} z={0.004} w={12} d={0.08} fill="none" stroke="rgba(255,255,255,0.85)" dash="10 12" />
        <Tree x={-4.8} y={-3.6} s={1.3} /><Tree x={4.4} y={-4.2} s={1.1} />
        <g transform={`translate(0 ${(1 - rise) * 3})`} opacity={io(F, 0, 6)}>
          <Shop x={-2.6} y={-2.6} w={5.2} d={3.6} h={3.2} />
          <g transform={`translate(${P(0, 1.0, 2.9).join(' ')}) matrix(${Math.cos(Math.PI / 6)} 0.5 0 1 0 0)`}>
            <text x={0} y={0.2} textAnchor="middle" fontSize={0.42} fontWeight={700} fill="#fff" fontFamily="Anek, sans-serif">तुमचा बिझनेस</text>
          </g>
        </g>
        <Person x={3.2} y={1.6} c={TEAL} /><Person x={-3.6} y={1.2} c={PINK} head="#6E4630" />
      </Stage>
      {THREE.map(([src, sym, l, x, y], i) => {
        const t = K.teen + i * 0.15;
        if (!vis(F, t)) return null;
        const bob = Math.sin((F - s(t)) / 9 + i) * 6;
        return (
          <React.Fragment key={l}>
            <svg width={1080} height={1920} style={abs(0, 0)}>
              <line x1={x + 105} y1={y + 150} x2={roof[0]} y2={roof[1]} stroke={INK} strokeWidth={3} strokeDasharray="8 9" opacity={fade(F, t, 8)} />
            </svg>
            <div style={{...abs(x, y + bob), width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...popS(F, t, 10)}}>
              <div style={{position: 'relative'}}>
                <LogoTile src={src} sym={sym} size={112} />
                <div style={{position: 'absolute', right: -18, top: -18}}><Q F={F} t={t + 0.2} size={50} ch="!" style={{boxShadow: 'none', border: `3px solid ${INK}`}} /></div>
              </div>
              <Chip size={28}>{l}</Chip>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* 2. every month: गल्ला leaks coins, calendar flips, loss counter climbs */
const LK = {x: 560, y: 1000, k: 54};
const MONTHS = ['जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑग'];
const COINS = Array.from({length: 26}, (_, i) => ({t: i * 0.11, vx: (((i * 37) % 11) - 5) * 55, vy: -520 - ((i * 53) % 7) * 60}));
const Leak = ({F}) => {
  const a = sc('leak');
  const mi = Math.max(0, Math.min(MONTHS.length - 1, Math.floor((F - s(K.mahinyala - 0.1)) / 9)));
  const flip = vis(F, K.mahinyala - 0.1) ? io((F - s(K.mahinyala - 0.1)) % 9, 0, 4, 0.6, 1) : 1;
  const loss = io(F, s(K.paise - 0.1), s(K.paise) + 40, 0, 48500, Easing.out(Easing.cubic));
  const [ox, oy] = at(LK, 0, 1.75, 0.5);
  return (
    <AbsoluteFill>
      <Stage {...LK}>
        <Floor x={-4.2} y={-3.6} w={8.4} d={7.2} top="#F1E9D8" />
        <g transform={drop(F, a, 12, 2)}><CashBox x={-1.6} y={-1.6} w={3.2} d={2.4} h={1.7} open={io(F, s(a) + 8, s(a) + 16)} /></g>
      </Stage>
      {/* coins spilling out of the drawer */}
      <svg width={1080} height={1920} style={abs(0, 0)}>
        {vis(F, K.paise - 0.35) && COINS.map((c, i) => {
          const tt = (F - s(K.paise - 0.35)) / 30 - c.t;
          if (tt < 0 || tt > 1.1) return null;
          const x = ox + c.vx * tt, y = oy + c.vy * tt + 0.5 * 2400 * tt * tt;
          const op = Math.min(1, io(y, 1260, 1360, 1, 0));
          return op > 0 ? <g key={i} opacity={op} transform={`translate(${x} ${y}) rotate(${tt * 360 * (i % 2 ? 1 : -1)})`}>
            <ellipse rx={26} ry={26} fill={GOLD} stroke={INK} strokeWidth={3} /><text y={10} textAnchor="middle" fontSize={28} fontWeight={800} fill={INK}>₹</text>
          </g> : null;
        })}
      </svg>
      {/* calendar */}
      <div style={{...abs(96, 240), ...up(F, a + 0.05, 10, 30)}}>
        <Card x={0} y={0} w={300} h={300} r={30} style={{position: 'relative', overflow: 'hidden'}}>
          <div style={{height: 92, background: OR, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <Sym n="cal" size={40} color="#fff" /><div style={{transform: `scaleY(${flip})`}}><T size={40} w={700} color="#fff">{MONTHS[mi]}</T></div>
          </div>
          <div style={{textAlign: 'center', fontSize: 130, fontWeight: 800, lineHeight: 1, marginTop: 30, ...LAT, transform: `scaleY(${flip})`}}>३०</div>
        </Card>
      </div>
      {/* loss counter */}
      {vis(F, K.paise - 0.1) && <div style={{...abs(450, 270), ...popS(F, K.paise - 0.1, 10)}}>
        <div style={{background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '24px 34px 14px', boxShadow: `9px 11px 0 ${RED}`, transform: `rotate(${shake(F, K.gamav, 0.5, 2)}deg)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Sym n="down" size={36} color={RED} sw={3} /><T size={30} w={600} color={MUTE}>दर महिन्याला गमावले</T></div>
          <div style={{fontSize: 92, fontWeight: 800, color: RED, lineHeight: 1.05, marginTop: 6, ...LAT}}>−₹ {fmt(loss)}</div>
        </div>
      </div>}
    </AbsoluteFill>
  );
};

/* 3. leak #1: attendance + orders arrive on WhatsApp groups */
const OF = {x: 540, y: 520, k: 44};
const STAFF = [['रवी', OR, -4.4, -2.9], ['सुनील', TEAL, 0.6, -2.9], ['अमित', VIO, -4.4, 0.7], ['प्रिया', PINK, 0.6, 0.7]];
const MSGS = (h, o) => [
  [0, 'हजर', h - 0.3], [1, 'हजर', h - 0.05], [2, 'आज 1 तास उशीर होईल', h + 0.2], [3, 'हजर', h + 0.45],
  [1, 'ऑर्डर: 20 बॉक्स — सावंत ट्रेडर्स', o - 0.1], [0, 'ऑर्डर: 50 kg — पाटील स्टोअर्स', o + 0.2], [2, 'कालची ऑर्डर गेली का?', o + 0.5],
  [3, 'ऑर्डर: 12 पीस — जोशी', o + 0.8], [0, 'कोणी पाहिलं का?', o + 1.1], [1, 'बिल पाठवा प्लीज', o + 1.35], [2, 'हजर', o + 1.6], [3, 'ऑर्डर बदलली आहे', o + 1.85],
];
const GROUPS = [['स्टाफ ग्रुप', 128], ['ऑर्डर्स', 342], ['डिलिव्हरी', 96]];
const S1 = ({F}) => {
  const a = sc('s1');
  const msgs = MSGS(K.hajeri, K.orders6);
  const n = msgs.reduce((acc, m) => acc + io(F, s(m[2]), s(m[2]) + 6, 0, 1, Easing.out(Easing.cubic)), 0);
  const ROW = 92, SHOW = 4.6;
  return (
    <AbsoluteFill>
      <Stepper F={F} t={a + 0.05} active={1} />
      <Stage {...OF}>
        <Floor x={-6} y={-4.2} w={12} d={8.4} top="#F4EEE2" />
        {STAFF.map(([nm, c, x, y]) => <React.Fragment key={nm}><Person x={x + 1.1} y={y - 0.35} c={c} sc={1.6} /><Desk x={x} y={y} w={2.6} d={1.2} screen={WA_D} /></React.Fragment>)}
      </Stage>
      {/* chat bubbles hopping off each person */}
      {msgs.map(([si, , t], i) => {
        const [px, py] = at(OF, STAFF[si][2] + 1.1, STAFF[si][3] - 0.35, 2.4);
        const p = io(F, s(t) - 9, s(t), 0, 1);
        if (p <= 0 || p >= 1) return null;
        return <div key={i} style={{...abs(px - 26, py - 30 - p * 60), opacity: Math.min(1, p * 4) * (1 - p * 0.6)}}>
          <div style={{width: 52, height: 40, borderRadius: 14, background: WA, border: `3px solid ${INK}`, position: 'relative'}}><div style={{...abs(8, 34), width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `10px solid ${INK}`}} /></div>
        </div>;
      })}
      {/* group chips */}
      {GROUPS.map(([g, u], i) => vis(F, K.whatsapp + i * 0.15) && <div key={g} style={{...abs(96 + i * 300, 752), ...popS(F, K.whatsapp + i * 0.15, 10)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${INK}`, borderRadius: 999, padding: '8px 12px 8px 10px', boxShadow: `4px 5px 0 ${INK}`}}>
          <Logo src="whatsapp.svg" size={44} /><T size={26} w={700}>{g}</T><Badge n={u} size={42} />
        </div>
      </div>)}
      {/* group chat */}
      <div style={{...abs(110, 840), ...up(F, a + 0.1, 10, 30)}}>
        <Card x={0} y={0} w={860} h={520} r={30} style={{position: 'relative', overflow: 'hidden'}}>
          <div style={{height: 104, background: WA_D, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px'}}>
            <div style={{width: 66, height: 66, borderRadius: 33, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="users" size={40} color={WA_D} /></div>
            <div><T size={36} w={700} color="#fff">स्टाफ ग्रुप</T><T size={22} w={500} color="rgba(255,255,255,0.8)" style={{marginTop: 2}}>रवी, सुनील, अमित, प्रिया +14</T></div>
            <div style={{marginLeft: 'auto'}}><Badge n={Math.round(40 + n * 8)} size={50} color={WA} /></div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 107, bottom: 0, background: '#EFE7DD', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 24, right: 24, top: 18, transform: `translateY(${-Math.max(0, n - SHOW) * ROW}px)`}}>
              {msgs.map(([si, txt, t], i) => vis(F, t) && (
                <div key={i} style={{height: ROW - 12, marginBottom: 12, display: 'flex', ...popS(F, t, 6), transformOrigin: '0 50%'}}>
                  <div style={{background: '#fff', borderRadius: 18, padding: '8px 20px 4px', boxShadow: '0 2px 0 rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <T size={22} w={700} color={STAFF[si][1]}>{STAFF[si][0]}</T>
                    <T size={30} w={500} style={{marginTop: 2}}>{txt}</T>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* 4. leak #2: four-five spreadsheets + registers for stock, payments, accounts */
const DK = {x: 540, y: 1110, k: 62};
const WINS = [['स्टॉक.xlsx', 'stock'], ['पेमेंट्स.xlsx', 'payments'], ['हिशोब_2025.xlsx', 'hishob'], ['ऑर्डर्स.xlsx', 'vegla'], ['उधारी_वही.xlsx', 'excel']];
const Sheet = ({name, front}) => (
  <Card x={0} y={0} w={500} h={300} r={18} sh={front ? 9 : 6} style={{position: 'relative', overflow: 'hidden'}}>
    <div style={{height: 58, background: XL, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderBottom: `3px solid ${INK}`}}>
      <div style={{width: 38, height: 38, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo src="excel.svg" size={30} /></div>
      <T size={26} w={700} color="#fff">{name}</T>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 8}}>{['#FFC52E', '#fff', '#FF6B6B'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}</div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gridAutoRows: 46}}>
      {Array.from({length: 20}, (_, k) => {
        const r = Math.floor(k / 4), c = k % 4;
        return <div key={k} style={{borderRight: '1.5px solid #D9DED9', borderBottom: '1.5px solid #D9DED9', background: r === 0 || c === 0 ? '#EEF5EF' : '#fff', display: 'flex', alignItems: 'center', padding: '0 10px'}}>
          {c === 0 ? <T size={18} w={600} color={MUTE}>{r + 1}</T> : <div style={{height: 10, width: `${40 + ((k * 29) % 50)}%`, borderRadius: 5, background: r === 0 ? '#9CC7A8' : '#DADDE1'}} />}
        </div>;
      })}
    </div>
  </Card>
);
const S2 = ({F}) => {
  const a = sc('s2');
  const shown = WINS.filter(([, k]) => vis(F, K[k] - 0.1)).length;
  const shuffle = vis(F, K.ughda) ? Math.floor((F - s(K.ughda)) / 7) : -1;
  const frontI = shuffle < 0 ? shown - 1 : [1, 3, 0, 4, 2, 1, 3, 0][shuffle % 8];
  const order = WINS.map((_, i) => i).filter((i) => i !== frontI).concat(frontI >= 0 && frontI < shown ? [frontI] : []);
  return (
    <AbsoluteFill>
      <Stepper F={F} t={a + 0.05} active={2} />
      {order.map((i) => {
        const [nm, k] = WINS[i];
        if (!vis(F, K[k] - 0.1)) return null;
        const jig = shuffle >= 0 && i === frontI ? io((F - s(K.ughda)) % 7, 0, 4, -14, 0) : 0;
        return <div key={nm} style={{...abs(80 + i * 100, 262 + i * 88 + jig), transform: `rotate(${[-3, 2, -1.5, 2.5, -2][i]}deg)`, ...up(F, K[k] - 0.1, 8, 40)}}><Sheet name={nm} front={i === frontI} /></div>;
      })}
      {vis(F, K.char) && <div style={{...abs(770, 250), ...popS(F, K.char, 10)}}>
        <div style={{width: 210, height: 210, borderRadius: 105, background: '#fff', border: `5px solid ${RED}`, boxShadow: `6px 7px 0 ${RED}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 96, fontWeight: 800, color: RED, lineHeight: 0.9, marginTop: 14, ...LAT}}>४-५</div>
          <T size={28} w={600} color={RED}>फाईल्स</T>
        </div>
      </div>}
      <Stage {...DK}>
        <Floor x={-4.2} y={-2.6} w={8.4} d={5.2} top="#F4EEE2" />
        <Person x={0.2} y={-1.5} c={TEAL} head="#6E4630" />
        <Desk x={-1.7} y={-0.9} w={3.4} d={1.5} screen={XL} paper={3} />
        {vis(F, K.register - 0.1) && <g transform={drop(F, K.register - 0.1, 10, 2.5)}>
          <Book x={0.55} y={-0.75} z={0.82} w={1.0} d={0.75} h={0.18} c="#C2410C" />
          <Book x={0.6} y={-0.7} z={1.0} w={0.95} d={0.7} h={0.18} c={TEAL_D} />
          <Book x={0.5} y={-0.8} z={1.18} w={1.0} d={0.75} h={0.18} c={VIO} />
        </g>}
      </Stage>
      {vis(F, K.register) && (() => { const [bx, by] = at(DK, 1.0, -0.4, 1.9); return <div style={{...abs(bx + 10, by - 130), ...popS(F, K.register, 10)}}><Chip size={28} color={ORT}><Sym n="book" size={30} color={ORT} />रजिस्टर</Chip></div>; })()}
    </AbsoluteFill>
  );
};

/* 5. leak #3: staff forget follow-ups */
const FG = {x: 540, y: 1130, k: 62};
const TASKS = [['देशमुख', 'कोटेशन पाठवायचं', 'आज'], ['जोशी', 'परत कॉल करायचा', 'काल'], ['शिंदे', 'पेमेंट रिमाइंडर', '3 दिवस']];
const Forget = ({F}) => {
  const a = sc('forget');
  const [hx, hy] = at(FG, 0.6, -1.1, 2.2);
  return (
    <AbsoluteFill>
      <Stepper F={F} t={a + 0.05} active={3} />
      <div style={{...abs(110, 270), ...up(F, a + 0.1, 10, 30)}}>
        <Card x={0} y={0} w={860} h={560} r={30} style={{position: 'relative', padding: '30px 36px', transform: `translateX(${shake(F, K.visarto, 0.5, 8)}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><Sym n="bell" size={42} color={ORT} /><T size={40} w={700}>फॉलोअप लिस्ट</T><Chip size={24} style={{marginLeft: 'auto'}}>आज · 3</Chip></div>
          {TASKS.map(([nm, task, due], i) => {
            const t = Math.min(a + 0.3, K.followup - 0.2) + i * 0.15, miss = vis(F, K.visarto + i * 0.12);
            return (
              <div key={nm} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, ...up(F, t, 8, 20)}}>
                <div style={{width: 54, height: 54, borderRadius: 12, border: `3px solid ${miss ? RED : INK}`, background: miss ? '#FFECEC' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{miss && <div style={popS(F, K.visarto + i * 0.12, 6)}><Sym n="x" size={36} color={RED} sw={3.2} /></div>}</div>
                <div style={{width: 76, height: 76, borderRadius: 38, background: [OR, TEAL, VIO][i], color: '#fff', fontSize: 34, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', border: `3px solid ${INK}`}}>{nm[0]}</div>
                <div style={{flex: 1}}><T size={34} w={700}>{nm}</T><T size={26} w={500} color={MUTE} style={{marginTop: 4, textDecoration: miss ? 'line-through' : 'none'}}>{task}</T></div>
                <Chip size={24} color={miss ? RED : MUTE}>{miss ? 'राहिलं' : due}</Chip>
              </div>
            );
          })}
        </Card>
      </div>
      <Stage {...FG}>
        <Floor x={-3.6} y={-2.6} w={7.2} d={5.2} top="#F4EEE2" />
        <Person x={0.6} y={-1.1} c={OR} />
        <Desk x={-1.3} y={-0.5} w={3.2} d={1.4} screen={BLUE} paper={2} />
      </Stage>
      <div style={{...abs(hx + 20, hy - 150)}}><Q F={F} t={K.visarto} size={100} /></div>
      {vis(F, K.visarto + 0.2) && <div style={{...abs(hx - 190, hy - 110), ...popS(F, K.visarto + 0.2, 8)}}><Q F={F} t={K.visarto + 0.2} size={70} /></div>}
    </AbsoluteFill>
  );
};

/* 6. clients left waiting + udhari money locked in a cage */
const ST = {x: 540, y: 830, k: 50};
const CAGE = {x: 1.4, y: -2.6, w: 3.4, d: 3.6};
const Stuck = ({F}) => {
  const a = sc('stuck');
  const cg = io(F, s(K.adkun) - 6, s(K.adkun) + 4, 0, 1, Easing.out(Easing.bounce));
  const cz = 4 * (1 - cg);
  const amt = io(F, s(K.udhari - 0.1), s(K.udhari) + 24, 0, 340000, Easing.out(Easing.cubic));
  const grey = io(F, s(K.adkun), s(K.adkun) + 10, 1, 0.35);
  const posts = [];
  for (let i = 0; i <= 5; i++) posts.push([CAGE.x + (i / 5) * CAGE.w, CAGE.y + CAGE.d], [CAGE.x + CAGE.w, CAGE.y + (i / 5) * CAGE.d]);
  const [lx, ly] = at(ST, CAGE.x + CAGE.w * 0.5, CAGE.y + CAGE.d, 1.1 + cz);
  const [sx, sy] = at(ST, -3.4, -2.2, 3.4);
  return (
    <AbsoluteFill>
      <Stage {...ST}>
        <Floor x={-6} y={-4.6} w={12} d={9.2} top="#EFE7D6" />
        <Shop x={-5.4} y={-4.2} w={3.6} d={2.6} h={2.6} awn={TEAL} />
        {[[-2.9, -0.6], [-2.5, 0.6], [-2.1, 1.8]].map(([x, y], i) => vis(F, K.clients - 0.2 + i * 0.12) && <g key={i} opacity={grey} transform={drop(F, K.clients - 0.2 + i * 0.12, 8, 1.5)}><Person x={x} y={y} c={[BLUE, YEL, PINK][i]} head="#7A4C33" sc={1.5} /></g>)}
        {/* back cage posts behind the coins */}
        {cg > 0 && [0, 1, 2, 3, 4].map((i) => <Post key={'b' + i} x={CAGE.x + (i / 5) * CAGE.w} y={CAGE.y} z={cz} h={2.4} />)}
        {cg > 0 && [1, 2, 3, 4].map((i) => <Post key={'l' + i} x={CAGE.x} y={CAGE.y + (i / 5) * CAGE.d} z={cz} h={2.4} />)}
        {[[2.0, -1.9, 7], [3.2, -1.9, 9], [4.2, -1.6, 5], [2.0, -0.6, 10], [3.2, -0.5, 8], [2.6, 0.5, 6]].map(([x, y, nn], i) => <CoinStack key={i} x={x} y={y} n={nn} grow={io(F, s(K.udhari - 0.2) + i * 2, s(K.udhari - 0.2) + i * 2 + 8)} />)}
        {cg > 0 && posts.map(([x, y], i) => <Post key={i} x={x} y={y} z={cz} h={2.4} />)}
        {cg > 0 && <g>
          <Box x={CAGE.x} y={CAGE.y + CAGE.d - 0.05} z={cz + 2.4} w={CAGE.w} d={0.1} h={0.1} c="#4A5060" />
          <Box x={CAGE.x + CAGE.w - 0.05} y={CAGE.y} z={cz + 2.4} w={0.1} d={CAGE.d} h={0.1} c="#4A5060" />
          <Box x={CAGE.x} y={CAGE.y} z={cz + 2.4} w={CAGE.w} d={0.1} h={0.1} c="#4A5060" />
          <Box x={CAGE.x} y={CAGE.y} z={cz + 2.4} w={0.1} d={CAGE.d} h={0.1} c="#4A5060" />
        </g>}
      </Stage>
      {vis(F, K.aalele - 0.1) && <div style={{...abs(sx - 150, sy - 110), ...popS(F, K.aalele - 0.1, 10)}}><Plate size={30} color={INK}><Sym n="users" size={34} color="#fff" />आलेले क्लायंट्स</Plate></div>}
      {[[-2.9, -0.6], [-2.5, 0.6], [-2.1, 1.8]].map(([x, y], i) => {
        const t = K.clients + 0.1 + i * 0.12; if (!vis(F, t)) return null;
        const [px, py] = at(ST, x, y, 2.3);
        return <div key={i} style={{...abs(px - 30, py - 70), opacity: grey, ...popS(F, t, 8)}}><div style={{width: 60, height: 60, borderRadius: 30, background: '#fff', border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="hour" size={36} color={ORT} /></div></div>;
      })}
      {vis(F, K.udhari - 0.1) && <div style={{...abs(560, 250), ...popS(F, K.udhari - 0.1, 10)}}>
        <div style={{background: '#fff', border: `4px solid ${INK}`, borderRadius: 28, padding: '20px 30px 12px', boxShadow: `8px 10px 0 ${RED}`}}>
          <T size={28} w={600} color={MUTE}>उधारी बाकी</T>
          <div style={{fontSize: 76, fontWeight: 800, color: RED, lineHeight: 1.05, ...LAT}}>₹ {fmt(amt)}</div>
        </div>
      </div>}
      {cg > 0.3 && <div style={{...abs(lx - 50, ly - 40), transform: `rotate(${shake(F, K.adkun + 0.15, 0.6, 12)}deg)`}}>
        <div style={{width: 100, height: 100, borderRadius: 24, background: YEL, border: `4px solid ${INK}`, boxShadow: `5px 6px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="lock" size={64} color={INK} sw={2.6} /></div>
      </div>}
      <Center y={1190}><Stamp F={F} t={K.adkun + 0.25}>अडकले!</Stamp></Center>
    </AbsoluteFill>
  );
};

/* 7. small problems -> month end: profit and time columns drain */
const LS = {x: 540, y: 1150, k: 46};
const Loss = ({F}) => {
  const a = sc('loss');
  const h1 = io(F, s(K.nafa), s(K.vaya) + 18, 6, 2.0, ease), h2 = io(F, s(K.vel), s(K.vaya) + 18, 6, 2.4, ease);
  const r1 = io(F, s(K.nafa), s(K.vaya) + 18), r2 = io(F, s(K.vel), s(K.vaya) + 18);
  const col = (x, y, h, c, r) => <g>
    <Box x={x} y={y} w={2.4} d={2.4} h={6} c="#FFFFFF" op={0.0} />
    <Box x={x} y={y} w={2.4} d={2.4} h={h} c={r > 0.6 ? RED : c} />
    <FaceT x={x} y={y} z={6} w={2.4} d={2.4} fill="none" stroke="rgba(20,20,20,0.35)" dash="6 6" />
  </g>;
  const [l1x, l1y] = at(LS, -3.0, -0.2, h1 + 0.3), [l2x, l2y] = at(LS, 2.4, -0.2, h2 + 0.3);
  return (
    <AbsoluteFill>
      <Center y={232} style={up(F, Math.min(a + 0.1, K.lahan - 0.15), 8, 20)}>
        <div style={{display: 'flex', gap: 22}}>
          {[['whatsapp.svg', null], ['excel.svg', null], [null, 'bell']].map(([src, sym], i) => <LogoTile key={i} src={src} sym={sym} size={74} />)}
        </div>
      </Center>
      {vis(F, K.shevti - 0.1) && <Center y={360} style={popS(F, K.shevti - 0.1, 10)}>
        <Tag size={36}><Sym n="cal" size={40} color={ORT} />महिन्याचा शेवट · ३१</Tag>
      </Center>}
      <Stage {...LS}>
        <Floor x={-5.6} y={-2.4} w={11.2} d={5} top="#F4EEE2" seams={0} />
        {col(-4.2, -1.4, h1, GRN, r1)}
        {col(1.2, -1.4, h2, BLUE, r2)}
      </Stage>
      {vis(F, K.nafa - 0.1) && <div style={{...abs(l1x - 110, l1y - 90), ...popS(F, K.nafa - 0.1, 10)}}><Tag size={36}><Sym n="rupee" size={38} color={r1 > 0.6 ? RED : GRN} />नफा</Tag></div>}
      {vis(F, K.vel - 0.1) && <div style={{...abs(l2x - 110, l2y - 90), ...popS(F, K.vel - 0.1, 10)}}><Tag size={36}><Sym n="clock" size={38} color={r2 > 0.6 ? RED : BLUE} />वेळ</Tag></div>}
      {vis(F, K.vaya) && [l1x, l2x].map((x, i) => <div key={i} style={{...abs(x - 40, 540 + ((F - s(K.vaya)) % 20) * 2), opacity: io((F - s(K.vaya)) % 20, 0, 4) * io((F - s(K.vaya)) % 20, 14, 20, 1, 0)}}><Sym n="down" size={80} color={RED} sw={3.2} /></div>)}
      <Center y={1250}><Stamp F={F} t={K.vaya + 0.1} rot={-6}>वाया!</Stamp></Center>
    </AbsoluteFill>
  );
};

/* 8. is this you? 10+ staff, daily orders */
const FT = {x: 560, y: 860, k: 52};
const SEATS = Array.from({length: 12}, (_, i) => [-5.4 + (i % 4) * 1.35, -3.2 + Math.floor(i / 4) * 1.7]);
const BOXES = []; for (let zz = 0; zz < 3; zz++) for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < 2; xx++) BOXES.push([1.6 + xx * 1.05, -2.6 + yy * 1.05 + 0.5, zz * 0.8]);
const PCOL = [OR, TEAL, VIO, PINK, BLUE, YEL];
const Fit = ({F}) => {
  const a = sc('fit');
  const t0 = Math.min(K.das - 0.1, a + 0.4);
  const n = SEATS.filter((_, i) => vis(F, t0 + i * 0.07)).length;
  const nb = BOXES.filter((_, i) => vis(F, K.orders25 - 0.3 + i * 0.04)).length;
  const ord = io(F, s(K.orders25 - 0.3), s(K.orders25) + 22, 0, 80, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage {...FT}>
        <Floor x={-6.4} y={-4.4} w={12.4} d={8.8} top="#F4EEE2" />
        {SEATS.map(([x, y], i) => vis(F, t0 + i * 0.07) && <g key={i} transform={drop(F, t0 + i * 0.07, 8, 1.2)}><Person x={x} y={y} c={PCOL[i % 6]} head={i % 3 ? '#8D5A3B' : '#6E4630'} sc={1.7} /></g>)}
        {[...BOXES].sort((p, q) => p[2] - q[2] || (p[0] + p[1]) - (q[0] + q[1])).map((b) => { const i = BOXES.indexOf(b); return vis(F, K.orders25 - 0.3 + i * 0.04) && <g key={i} transform={drop(F, K.orders25 - 0.3 + i * 0.04, 8, 2)}><Parcel x={b[0]} y={b[1]} z={b[2]} s={0.95} /></g>; })}
      </Stage>
      <div style={{...abs(90, 250), ...up(F, a + 0.05, 10, 30)}}>
        <Card x={0} y={0} w={420} h={200} r={28} style={{position: 'relative', padding: '24px 30px', transform: `scale(${1 + 0.08 * io(F, s(K.jast), s(K.jast) + 4) * io(F, s(K.jast) + 4, s(K.jast) + 10, 1, 0)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Sym n="users" size={40} color={ORT} /><T size={30} w={600} color={MUTE}>स्टाफ</T></div>
          <div style={{fontSize: 100, fontWeight: 800, lineHeight: 1, marginTop: 8, ...LAT}}>{vis(F, K.jast) ? '10+' : n}</div>
        </Card>
      </div>
      {vis(F, K.orders25 - 0.3) && <div style={{...abs(570, 250), ...popS(F, K.orders25 - 0.3, 10)}}>
        <Card x={0} y={0} w={420} h={200} r={28} style={{position: 'relative', padding: '24px 30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Sym n="box" size={40} color={ORT} /><T size={30} w={600} color={MUTE}>ऑर्डर्स / दिवस</T></div>
          <div style={{fontSize: 100, fontWeight: 800, lineHeight: 1, marginTop: 8, ...LAT}}>{Math.round(ord)}{ord > 79.5 ? '+' : ''}</div>
        </Card>
      </div>}
    </AbsoluteFill>
  );
};

/* 9. chaos -> one system */
const SY = {x: 540, y: 880, k: 54};
const SRC = [['whatsapp.svg', null, -4.8, 2.2], ['excel.svg', null, -4.8, -4.8], [null, 'book', 2.2, -4.8], [null, 'bell', 2.2, 2.2]];
const System = ({F}) => {
  const a = sc('system');
  const tg = Math.min(io(F, s(a) + 2, s(a) + 10), io(F, s(K.system) - 2, s(K.system) + 6, 1, 0));
  const rise = io(F, s(K.system) - 2, s(K.system) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  const lines = io(F, s(K.system) + 4, s(K.system) + 16);
  const pts2 = SRC.map(([, , x, y]) => at(SY, x + 1.3, y + 1.3, 0.4));
  const ctr = at(SY, 0, 0, 0.4);
  const jit = (i) => Math.sin(F / 3 + i * 2) * 10 * tg;
  return (
    <AbsoluteFill>
      <Stage {...SY}>
        <FaceT x={-5.1} y={-5.1} z={-0.002} w={10.2} d={10.2} fill="rgba(255,255,255,0.55)" stroke="rgba(20,20,20,0.25)" dash="8 8" />
        {/* clean links (along the iso axes) */}
        {lines > 0 && SRC.map(([, , x, y], i) => {
          const cx = x + 1.3, cy = y + 1.3;
          return <g key={i} opacity={lines}>
            <FaceT x={Math.min(cx, 0)} y={cy - 0.12} z={0.01} w={Math.abs(cx) * lines} d={0.24} fill={GRN} />
            <FaceT x={-0.12} y={Math.min(cy, 0)} z={0.01} w={0.24} d={Math.abs(cy) * lines} fill={GRN} />
          </g>;
        })}
        {SRC.map(([, , x, y], i) => <Pad key={i} x={x} y={y} s={2.6} c="#FFFFFF" lift={0.15 * Math.sin(F / 10 + i)} />)}
        <Pad x={-1.6} y={-1.6} s={3.2} c={TEAL} />
        <g opacity={rise > 0.02 ? 1 : 0}>
          <Box x={-1.1} y={-1.1} z={0.35} w={2.2} d={2.2} h={2.8 * rise} c="#FFFFFF" top="#FFFFFF" left="#F2EEE6" right="#D3CCBE" />
          <polygon points={[[-0.9, 1.101, 0.6], [0.9, 1.101, 0.6], [0.9, 1.101, 0.35 + 2.5 * rise], [-0.9, 1.101, 0.35 + 2.5 * rise]].map(([x, y, z]) => P(x, y, z).join(',')).join(' ')} fill={INK} />
          {rise > 0.6 && [0, 1, 2].map((r) => <polygon key={r} points={[[-0.7, 1.102, 2.4 - r * 0.6], [0.2 + r * 0.2, 1.102, 2.4 - r * 0.6], [0.2 + r * 0.2, 1.102, 2.1 - r * 0.6], [-0.7, 1.102, 2.1 - r * 0.6]].map(([x, y, z]) => P(x, y, z).join(',')).join(' ')} fill={[OR, GRN, YEL][r]} />)}
        </g>
        {/* moving packets along the clean links */}
        {lines >= 1 && SRC.map(([, , x, y], i) => {
          const p = ((F - s(K.system) - 16) / 26 + i * 0.25) % 1;
          const cx = x + 1.3, cy = y + 1.3;
          const [px, py] = p < 0.5 ? P(cx * (1 - p * 2), cy, 0.25) : P(0, cy * (1 - (p - 0.5) * 2), 0.25);
          return <circle key={'p' + i} cx={px} cy={py} r={0.22} fill={YEL} stroke={INK} strokeWidth={0.06} />;
        })}
      </Stage>
      {/* tangled red mess */}
      {tg > 0 && <svg width={1080} height={1920} style={{...abs(0, 0), opacity: tg}}>
        {[[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 2], [1, 3]].map(([p, q], i) => {
          const [x1, y1] = pts2[p], [x2, y2] = pts2[q];
          const mx = (x1 + x2) / 2 + (i % 2 ? 160 : -160) + jit(i), my = (y1 + y2) / 2 + (i % 3 ? -140 : 120) + jit(i + 3);
          const len = 1400;
          return <path key={i} d={`M${x1} ${y1} C ${mx + 120} ${my - 160}, ${mx - 180} ${my + 150}, ${x2} ${y2}`} fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - io(F, s(a) + 2 + i, s(a) + 12 + i))} />;
        })}
      </svg>}
      {SRC.map(([src, sym, x, y], i) => {
        const [px, py] = at(SY, x + 1.3, y + 1.3, 1.1);
        return <div key={i} style={{...abs(px - 46, py - 90 + Math.sin(F / 10 + i) * 4), transform: `rotate(${tg * Math.sin(F / 2 + i) * 6}deg)`, ...up(F, a + 0.05 + i * 0.06, 8, 20)}}><LogoTile src={src} sym={sym} size={92} color={sym === 'book' ? '#C2410C' : ORT} /></div>;
      })}
      {tg > 0.5 && <div style={{...abs(ctr[0] - 55, ctr[1] - 160)}}><Q F={F} t={a + 0.3} size={110} /></div>}
      {vis(F, K.aanaycha - 0.1) && <Center y={300} style={popS(F, K.aanaycha - 0.1, 10)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: OR, border: `4px solid ${INK}`, borderRadius: 24, padding: '18px 34px 10px', boxShadow: `7px 8px 0 ${INK}`}}>
          <Mark size={46} color="#fff" /><T size={42} w={700} color="#fff">एकच सिस्टीम</T>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

/* 10. comment AUDIT: Instagram comment box + iso keycaps typing it */
const KB = {x: 560, y: 1130, k: 52};
const WORD = 'AUDIT';
const Cta = ({F}) => {
  const a = sc('cta');
  const t0 = K.audit - 0.2, gap = 0.12;
  const typedN = WORD.split('').filter((_, i) => vis(F, t0 + i * gap)).length;
  const posted = vis(F, K.liha + 0.3);
  const caret = Math.floor(F / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 250), ...up(F, a + 0.05, 10, 30)}}>
        <Card x={0} y={0} w={860} h={560} r={34} style={{position: 'relative', padding: '28px 36px'}}>
          <div style={{width: 90, height: 8, borderRadius: 4, background: FAINT, margin: '0 auto 22px'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><InstagramLogo size={46} /><T size={36} w={700}>Comments</T></div>
          <div style={{height: 2, background: FAINT, margin: '22px 0'}} />
          <div style={{height: 190, display: 'flex', alignItems: 'center'}}>
            {posted ? <div style={{display: 'flex', alignItems: 'center', gap: 20, ...up(F, K.liha + 0.3, 8, 20)}}>
              <div style={{width: 76, height: 76, borderRadius: 38, background: YEL, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="user" size={44} /></div>
              <div><T size={26} w={600} color={MUTE}>तुम्ही · आत्ता</T><div style={{fontSize: 62, fontWeight: 800, color: INK, ...LAT, ...BRAND}}>AUDIT</div></div>
              <div style={{marginLeft: 120, ...popS(F, K.liha + 0.5, 8)}}><svg viewBox="0 0 24 24" width={56} height={56}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={RED} stroke={INK} strokeWidth="1.5" /></svg></div>
            </div> : <T size={30} w={500} color={MUTE}>पहिली कमेंट तुमची…</T>}
          </div>
          <div style={{position: 'absolute', left: 36, right: 36, bottom: 30, display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 70, height: 70, borderRadius: 35, background: YEL, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="user" size={40} /></div>
            <div style={{flex: 1, height: 84, borderRadius: 42, border: `3px solid ${vis(F, K.comment) ? OR : INK}`, display: 'flex', alignItems: 'center', padding: '6px 30px 0', boxShadow: vis(F, K.comment) ? `0 0 0 6px rgba(255,107,26,0.18)` : 'none'}}>
              {posted || typedN === 0 ? <T size={32} w={500} color={MUTE}>Add a comment…</T>
                : <div style={{fontSize: 44, fontWeight: 800, ...BRAND, letterSpacing: '0.04em'}}>{WORD.slice(0, typedN)}<span style={{opacity: caret ? 1 : 0, color: OR}}>|</span></div>}
            </div>
            <T size={34} w={700} color={typedN === 5 && !posted ? '#0095F6' : 'rgba(0,149,246,0.35)'}>Post</T>
          </div>
        </Card>
      </div>
      <Stage {...KB}>
        <FaceT x={-5.2} y={-1.6} z={-0.01} w={10.4} d={3.2} fill="#FFFFFF" stroke={INK} />
        {WORD.split('').map((ch, i) => {
          const t = t0 + i * gap;
          const press = vis(F, t) ? io(F, s(t), s(t) + 2) * io(F, s(t) + 2, s(t) + 6, 1, 0) : 0;
          return <Key key={i} x={-4.8 + i * 1.95} y={-0.85} sz={1.7} press={press} hot={vis(F, t)} label={ch} />;
        })}
      </Stage>
      {vis(F, K.liha + 0.3) && <div style={{...abs(680, 860), ...popS(F, K.liha + 0.3, 10)}}><Chip size={30} color="#fff" bg={GRN}><Sym n="check" size={34} color="#fff" sw={3} />Posted</Chip></div>}
      {vis(F, K.min15 - 0.1) && <div style={{...abs(110, 860), ...popS(F, K.min15 - 0.1, 10)}}><Chip size={34} color={ORT}><Sym n="clock" size={38} color={ORT} />१५ मिनिटं</Chip></div>}
    </AbsoluteFill>
  );
};

/* 11. 15 minutes: look at your business flow, find the exact fix */
const FL = {x: 540, y: 970, k: 56};
const NODES = [['ऑर्डर', 'box', -4, -4], ['स्टॉक', 'book', 2, -4], ['पेमेंट', 'rupee', 2, 2], ['फॉलोअप', 'bell', -4, 2]];
const Call = ({F}) => {
  const a = sc('call');
  const ring = io(F, s(K.min15) - 4, s(K.min15) + 20, 0, 1, Easing.out(Easing.cubic));
  const draw = io(F, s(K.flow) - 4, s(K.flow) + 14);
  const tok = vis(F, K.flow + 0.3) ? ((F - s(K.flow + 0.3)) / 36) % 4 : -1;
  const found = vis(F, K.upay);
  const C = (i) => [NODES[i][2] + 1.1, NODES[i][3] + 1.1];
  const lp = (p) => { const i = Math.floor(p), f = p - i, [x1, y1] = C(i % 4), [x2, y2] = C((i + 1) % 4); return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f]; };
  const [mx, my] = at(FL, C(2)[0], C(2)[1], 0.9);
  const lens = io(F, s(K.nemka) - 6, s(K.nemka) + 6, 0, 1, ease);
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 240), ...up(F, a + 0.05, 10, 30)}}>
        <Card x={0} y={0} w={420} h={210} r={30} style={{position: 'relative', padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 22}}>
          <svg width={150} height={150} viewBox="0 0 150 150">
            <circle cx={75} cy={75} r={60} fill="none" stroke="#EEE" strokeWidth={16} />
            <circle cx={75} cy={75} r={60} fill="none" stroke={OR} strokeWidth={16} strokeDasharray={377} strokeDashoffset={377 * (1 - ring)} transform="rotate(-90 75 75)" strokeLinecap="round" />
            <text x={75} y={92} textAnchor="middle" fontSize={50} fontWeight={800} fill={INK} fontFamily="Anek, sans-serif">१५</text>
          </svg>
          <div><T size={44} w={800}>मिनिटं</T><T size={26} w={500} color={MUTE} style={{marginTop: 4}}>ऑडिट कॉल</T></div>
        </Card>
      </div>
      {vis(F, K.flow - 0.1) && <div style={{...abs(560, 280), ...popS(F, K.flow - 0.1, 10)}}><Tag size={34}><Sym n="flow" size={38} color={ORT} />बिझनेस फ्लो</Tag></div>}
      <Stage {...FL}>
        <FaceT x={-5} y={-5} z={-0.002} w={10} d={10} fill="rgba(255,255,255,0.5)" stroke="rgba(20,20,20,0.25)" dash="8 8" />
        {[0, 1, 2, 3].map((i) => {
          const [x1, y1] = C(i), [x2, y2] = C((i + 1) % 4);
          const f = Math.max(0, Math.min(1, draw * 4 - i));
          if (f <= 0) return null;
          const ex = x1 + (x2 - x1) * f, ey = y1 + (y2 - y1) * f;
          return <FaceT key={i} x={Math.min(x1, ex) - 0.12} y={Math.min(y1, ey) - 0.12} z={0.01} w={Math.abs(ex - x1) + 0.24} d={Math.abs(ey - y1) + 0.24} fill={INK} />;
        })}
        {NODES.map(([, , x, y], i) => <Pad key={i} x={x} y={y} s={2.2} c={i === 2 && found ? GRN : i === 2 && vis(F, K.nemka) ? '#FFD9D9' : '#FFFFFF'} lift={tok >= 0 && Math.floor(tok) === i ? 0.25 : 0} />)}
        {tok >= 0 && (() => { const [px, py] = P(...lp(tok), 0.6); return <circle cx={px} cy={py} r={0.36} fill={OR} stroke={INK} strokeWidth={0.08} />; })()}
      </Stage>
      {NODES.map(([l, sym, x, y], i) => {
        const [px, py] = at(FL, x + 1.1, y + 1.1, 1.2);
        return <div key={l} style={{...abs(px - 120, py - 92), width: 240, display: 'flex', justifyContent: 'center', ...up(F, a + 0.15 + i * 0.1, 8, 20)}}>
          <Plate size={28} color={i === 2 && found ? GRN : INK}><Sym n={sym} size={30} color="#fff" />{l}</Plate>
        </div>;
      })}
      {lens > 0 && <div style={{...abs(mx - 95 + (1 - lens) * 260, my - 115 - (1 - lens) * 200), opacity: Math.min(1, lens * 2)}}>
        <svg width={230} height={230} viewBox="0 0 230 230"><circle cx={95} cy={95} r={78} fill="rgba(255,255,255,0.25)" stroke={INK} strokeWidth={10} /><path d="M152 152l62 62" stroke={INK} strokeWidth={20} strokeLinecap="round" /></svg>
      </div>}
      {found && <Center y={1285} style={popS(F, K.upay, 10)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: GRN, border: `4px solid ${INK}`, borderRadius: 24, padding: '18px 34px 10px', boxShadow: `7px 8px 0 ${INK}`}}>
          <Sym n="check" size={46} color="#fff" sw={3.2} /><T size={42} w={700} color="#fff">नेमका उपाय</T>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

const Outro = ({F}) => {
  const m = pop(F, OUTRO_AT + 0.05, 11);
  return (
    <AbsoluteFill>
      <Center y={420}><div style={{transform: `scale(${m})`}}><Mark size={220} color={INK} /></div></Center>
      <Center y={720} style={up(F, OUTRO_AT + 0.3, 12, 30)}>
        <div style={{...BRAND, fontSize: 112, fontWeight: 700, color: INK, letterSpacing: '-0.02em'}}>Outgrid Labs</div>
        <div style={{width: 180, height: 12, background: OR, marginTop: 26, borderRadius: 6}} />
        <div style={{fontSize: 40, fontWeight: 500, color: MUTE, marginTop: 28}}>@outgridlabs</div>
      </Center>
      <Center y={1040} style={up(F, OUTRO_AT + 0.6, 12, 30)}><Chip size={40} color="#fff" bg={OR}>कमेंट करा: AUDIT</Chip></Center>
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */
const COMPS = {hook: Hook, leak: Leak, s1: S1, s2: S2, forget: Forget, stuck: Stuck, loss: Loss, fit: Fit, system: System, cta: Cta, call: Call, outro: Outro};
const LABELS = {hook: '// your business', leak: '// every month', s1: '// 01 — whatsapp groups', s2: '// 02 — excel + registers', forget: '// 03 — follow-ups', stuck: '// stuck money',
  loss: '// month end', fit: '// is this you?', system: '// chaos → system', cta: '// comment audit', call: '// 15-min audit'};
const Video = () => <IsoVideo scenes={SCENES} comps={COMPS} labels={LABELS} chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} hi={ORT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
