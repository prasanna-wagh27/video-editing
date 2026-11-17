/*
 * Country Delight startup story (Marathi), LEAN style, light theme. VO at original speed (public/vo.mp3).
 * Real assets (user-supplied): public/img/cd_logo.png, founders.jpg (badge cropped off), cow_milk.jpg, buffalo_milk.jpg.
 * App screens, prices, dates, counts and the owner dashboard are illustrative.
 * Captions: captions.js from `python3 scripts/align_whisper.py reels/country-delight/script_hi.txt reels/country-delight/public/vo.mp3`.
 * Every cue below is a REAL spoken word time from that alignment (T = word times in seconds).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark} from '../../shared/kit.jsx';
import {
  BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up,
  Glass, Chip, Ini, Ico, Tick, I_PIN, I_CAL, I_BELL, I_USERS, I_CHART,
  Instagram, LeanOutro, LeanVideo,
} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';
import {T} from './cues.js';

/* ---------- scenes: [key, fromSec, toSec], cuts in VO pauses ---------- */
const OUTRO_AT = T.end + 0.45;
const SCENES = [
  ['hook', 0, T.cut1], ['founders', T.cut1, T.cut2], ['iim', T.cut2, T.cut3], ['delhi', T.cut3, T.cut4], ['packet', T.cut4, T.cut5],
  ['farm', T.cut5, T.cut6], ['route', T.cut6, T.cut7], ['sub', T.cut7, T.cut8], ['wallet', T.cut8, T.cut9], ['morning', T.cut9, T.cut10],
  ['trip', T.cut10, T.cut11], ['pause', T.cut11, T.cut12], ['bill', T.cut12, T.cut13], ['cash', T.cut13, T.cut14], ['trust', T.cut14, T.cut15],
  ['more', T.cut15, T.cut16], ['profit', T.cut16, T.cut17], ['maha', T.cut17, T.cut18], ['yours', T.cut18, T.cut19], ['app', T.cut19, T.cut20],
  ['products', T.cut20, T.cut21], ['learn', T.cut21, T.cut22], ['dm', T.cut22, OUTRO_AT], ['outro', OUTRO_AT, OUTRO_AT + 2.4],
];
const TOTAL = s(OUTRO_AT + 2.4);
const CHUNKS = CAPS.filter((c) => c.a >= s(T.cut1) - 2); // no subtitles over the text hook

/* ---------- brand + real assets ---------- */
const CD_B = '#1C5DAA', CD_G = '#8CC63F', CD_SUN = '#F8B91C', INKC = '#1F1F1F';
const CDLogo = ({size = 160, style = {}}) => <Img src={staticFile('img/cd_logo.png')} style={{width: size, height: size, display: 'block', flexShrink: 0, ...style}} />;
const Photo = ({src, w, h, F, a = 0, b = 6, z0 = 1.0, z1 = 1.12, pos = 'center', r = 40, style = {}}) => (
  <div style={{width: w, height: h, borderRadius: r, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 70px rgba(60,45,10,0.22)', border: '8px solid #fff', boxSizing: 'border-box', ...style}}>
    <Img src={staticFile(`img/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${io(F, s(a), s(b), z0, z1, Easing.linear)})`}} />
  </div>
);
const PhoneL = ({x, y, w, h, children, style = {}}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: w * 0.13, background: '#1d1d1f', padding: 12, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.28)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: w * 0.11, overflow: 'hidden', background: '#FAF8F3', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 14), marginLeft: -56, width: 112, height: 30, borderRadius: 15, background: '#1d1d1f'}} />
    </div>
  </div>
);
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const DEV = '०१२३४५६७८९';
const dev = (n) => Math.round(n).toLocaleString('en-IN').replace(/\d/g, (d) => DEV[d]);
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
// spring drop with a small squash on landing
const drop = (F, t, h = 300) => {
  const p = pop(F, t, 9);
  const land = io(F, s(t) + 6, s(t) + 9) * io(F, s(t) + 9, s(t) + 14, 1, 0);
  return {opacity: F < s(t) ? 0 : 1, transform: `translateY(${(1 - p) * -h}px) scale(${1 + 0.06 * land}, ${1 - 0.08 * land})`, transformOrigin: '50% 100%'};
};
const popS = (F, t, d = 11) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const Marker = ({F, t, children, color = Y}) => (
  <span style={{background: `linear-gradient(transparent 62%, ${color} 62%, ${color} 92%, transparent 92%) no-repeat left / ${io(F, s(t), s(t) + 8) * 100}% 100%`, padding: '0 6px'}}>{children}</span>
);

/* ---------- vectors ---------- */
const MilkCan = ({size = 120, c = '#DDE5EC'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M24 6h16v6l6 8v34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V20l6-8z" fill={c} stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <rect x="22" y="3" width="20" height="6" rx="2" fill="#B9C6D1" stroke={INKC} strokeWidth="3" />
    <path d="M18 30h28M18 46h28" stroke={INKC} strokeWidth="2.5" /><path d="M23 34v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const Pouch = ({size = 200, label = 'MILK'}) => ( // generic city milk packet (no brand)
  <svg viewBox="0 0 80 96" width={size} height={size * 1.2}>
    <path d="M10 10c10-6 50-6 60 0l4 76c-12 6-56 6-68 0z" fill="#F2F2EE" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M10 10l-4 4M70 10l4 4" stroke={INKC} strokeWidth="3" />
    <rect x="16" y="32" width="48" height="30" rx="4" fill="#B8BEC6" />
    <text x="40" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="Anek, sans-serif">{label}</text>
    <path d="M18 72h44M22 78h36" stroke="#C9CDD2" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const Hills = ({w = 900, h = 520, sun = 1}) => { // land drawn at the bottom of any aspect (no stretching)
  const H = (900 * h) / w, d = H - 520;
  return (
    <svg viewBox={`0 0 900 ${H}`} width={w} height={h} style={{display: 'block'}}>
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6FB6EA" /><stop offset="1" stopColor="#DDF0FB" /></linearGradient></defs>
      <rect width="900" height={H} fill="url(#sky)" />
      <circle cx="640" cy={d + 380 - 140 * sun} r="90" fill={CD_SUN} />
      <g transform={`translate(0 ${d})`}>
        <path d="M0 360C200 280 380 300 560 350S820 330 900 300V520H0z" fill={CD_G} />
        <path d="M0 420C220 380 420 400 620 440S860 430 900 420V520H0z" fill="#5FA83A" />
        <path d="M0 470C260 440 520 470 900 450V520H0z" fill={CD_B} />
        {[[120, 300], [170, 290]].map(([x, y], i) => <g key={i}><rect x={x - 3} y={y} width="6" height="40" fill="#3E7A2A" /><ellipse cx={x} cy={y - 12} rx="18" ry="28" fill="#4E9A30" /></g>)}
      </g>
    </svg>
  );
};
const House = ({size = 220, door = 0}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path d="M10 46 50 12l40 34" fill="none" stroke={INKC} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M18 40v52h64V40" fill="#fff" stroke={INKC} strokeWidth="4" strokeLinejoin="round" />
    <rect x="38" y="58" width="24" height="34" fill={door ? '#FFE9A8' : '#C98A4B'} stroke={INKC} strokeWidth="3.5" />
    <rect x="24" y="52" width="10" height="10" fill="#CFE6F5" stroke={INKC} strokeWidth="2.5" /><rect x="66" y="52" width="10" height="10" fill="#CFE6F5" stroke={INKC} strokeWidth="2.5" />
  </svg>
);
const Scooter = ({size = 150, spin = 0}) => (
  <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
    <rect x="52" y="10" width="26" height="22" rx="4" fill={Y} stroke={INKC} strokeWidth="3" />
    <path d="M20 50h50l8-18H62l-6 10H30z" fill={CD_B} stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M20 50l-4-26h10" fill="none" stroke={INKC} strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="40" cy="20" r="7" fill={INKC} /><path d="M36 28l4 14h10" stroke={INKC} strokeWidth="5" strokeLinecap="round" fill="none" />
    {[22, 76].map((x) => <g key={x} transform={`rotate(${spin} ${x} 56)`}><circle cx={x} cy="56" r="10" fill={INKC} /><circle cx={x} cy="56" r="4" fill="#ddd" /><path d={`M${x - 7} 56h14`} stroke="#666" strokeWidth="2" /></g>)}
  </svg>
);
const Suitcase = ({size = 200}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="24" y="6" width="16" height="10" rx="3" fill="none" stroke={INKC} strokeWidth="3.5" />
    <rect x="8" y="16" width="48" height="38" rx="6" fill={C_ORANGE} stroke={INKC} strokeWidth="3.5" />
    <path d="M20 16v38M44 16v38" stroke={INKC} strokeWidth="3" /><circle cx="16" cy="58" r="3.5" fill={INKC} /><circle cx="48" cy="58" r="3.5" fill={INKC} />
  </svg>
);
const Coin = ({size = 110, v = '10', c = '#D9B44A'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="28" fill={c} stroke={INKC} strokeWidth="3" /><circle cx="32" cy="32" r="21" fill="none" stroke="#8C6D16" strokeWidth="2" strokeDasharray="3 3" />
    <text x="32" y="41" textAnchor="middle" fontSize="22" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">₹{v}</text>
  </svg>
);
const Note = ({w = 230, v = '20', c = '#E9B9A0'}) => (
  <svg viewBox="0 0 120 60" width={w} height={w / 2}>
    <rect x="3" y="3" width="114" height="54" rx="6" fill={c} stroke={INKC} strokeWidth="3" /><circle cx="60" cy="30" r="13" fill="none" stroke={INKC} strokeWidth="2.5" />
    <text x="16" y="24" fontSize="14" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">₹{v}</text><text x="104" y="50" textAnchor="end" fontSize="14" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">₹{v}</text>
  </svg>
);
const Cap = ({size = 200}) => (
  <svg viewBox="0 0 64 48" width={size} height={size * 0.75}>
    <path d="M32 4 2 18l30 14 30-14z" fill={INKC} /><path d="M14 24v12c0 4 8 8 18 8s18-4 18-8V24l-18 8z" fill="#2E2E2E" />
    <path d="M56 21v15" stroke={CD_SUN} strokeWidth="3" /><circle cx="56" cy="38" r="3.5" fill={CD_SUN} />
  </svg>
);
const Skyline = () => (
  <svg viewBox="0 0 900 420" width="900" height="420" style={{display: 'block'}}>
    <rect width="900" height="420" fill="#EEF1F4" />
    {[[30, 180, 110], [150, 120, 90], [250, 220, 130], [390, 90, 100], [500, 160, 120], [630, 60, 90], [730, 200, 140]].map(([x, y, w], i) => (
      <g key={i}><rect x={x} y={y} width={w} height={420 - y} fill={['#C9D1DA', '#B7C1CC', '#D3DAE1'][i % 3]} stroke="#9AA6B2" strokeWidth="2" />
        {Array.from({length: Math.floor((400 - y) / 40)}).map((_, r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 18 + c * (w / 2 - 6)} y={y + 20 + r * 40} width={w / 2 - 36} height="16" fill="#F7F9FB" />))}</g>
    ))}
    <rect y="390" width="900" height="30" fill="#A9B3BD" />
  </svg>
);
const Drop = ({size = 40, c = CD_B}) => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" fill={c} /></svg>;

/* ---------- 1. Hook: two founders, milk, ₹1,380 crore ---------- */
const Hook = ({F}) => {
  const n = io(F, s(T.num), s(T.koti), 0, 1380, Easing.out(Easing.cubic));
  const two = pop(F, T.num - 0.15, 9);
  return (
    <AbsoluteFill>
      <div style={{...abs(72, 200), fontSize: 40, fontWeight: 600, color: MUTED, ...LAT}}>Startup Story</div>
      <div style={{...abs(66, 262), display: 'flex', alignItems: 'center', gap: 26, fontSize: 132, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>
        <CDLogo size={132} /><span>दूध विकून</span>
      </div>
      <div style={{...abs(66, 418), fontSize: 150, fontWeight: 800, color: TXT, lineHeight: 1.05, ...LAT, transform: `scale(${0.6 + 0.4 * two})`, transformOrigin: '0% 70%', opacity: Math.min(1, two * 2)}}>
        <Marker F={F} t={T.koti}>₹{dev(n)}</Marker> <span style={{color: CD_B}}>कोटी</span>
      </div>
      <div style={{...abs(90, 660), transform: `rotate(-2.5deg) translateY(${io(F, 0, 14, 60, 0)}px)`}}>
        <Photo src="founders.jpg" w={900} h={560} F={F} a={0} b={T.cut1} z0={1.04} z1={1.14} pos="50% 40%" />
      </div>
      <div style={{...abs(700, 1060), ...popS(F, T.dudh, 10)}}>
        <div style={{transform: 'rotate(7deg)'}}><Photo src="cow_milk.jpg" w={300} h={300} F={F} a={T.dudh} b={T.cut1} z0={1.35} z1={1.5} pos="50% 55%" r={34} /></div>
      </div>
      <div style={{...abs(110, 1265), ...popS(F, T.biz, 10)}}><div style={{transform: 'rotate(-3deg)'}}><Chip color={C_GREEN} size={40}>Revenue FY24 · ₹1,380 Cr</Chip></div></div>
    </AbsoluteFill>
  );
};

/* ---------- 2. The founders ---------- */
const Founders = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(90, 250)}}><Photo src="founders.jpg" w={900} h={600} F={F} a={T.cut1} b={T.cut2} z0={1.0} z1={1.1} /></div>
    <Glass x={130} y={900} w={820} h={330} r={40} style={{padding: '34px 44px'}}>
      <div style={{fontSize: 26, fontWeight: 700, color: MUTED, letterSpacing: '0.12em'}}>CO-FOUNDERS</div>
      {[[T.chakra, 'CG', 'चक्रधर गाडे'], [T.nitin, 'NK', 'नितीन कौशल']].map(([t, i, n]) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 26, ...up(F, t - 0.1, 12, 30)}}>
          <Ini t={i} size={92} bg={Y} color={BG} /><div style={{fontSize: 56, fontWeight: 700, color: TXT}}>{n}</div>
        </div>
      ))}
    </Glass>
  </AbsoluteFill>
);

/* ---------- 3. IIM Indore students ---------- */
const Iim = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 420), width: 1080, display: 'flex', justifyContent: 'center'}}><Big size={330} style={{...up(F, T.iim - 0.15, 10, 40)}}>IIM</Big></div>
    <div style={{...abs(250, 250), ...drop(F, T.iim + 0.05, 400)}}><div style={{transform: 'rotate(-14deg)'}}><Cap size={240} /></div></div>
    <div style={{...abs(0, 790), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, T.indore - 0.05)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '20px 38px 12px', boxShadow: '0 16px 40px rgba(60,45,10,0.12)', fontSize: 56, fontWeight: 700, color: TXT, ...LAT}}>
        <Ico d={I_PIN} size={52} color={C_RED} sw={2.4} />Indore
      </div>
    </div>
    <div style={{...abs(0, 1010), width: 1080, display: 'flex', justifyContent: 'center', gap: 40}}>
      {['CG', 'NK'].map((i, k) => <div key={i} style={{...popS(F, T.vid - 0.1 + k * 0.12)}}><Ini t={i} size={150} bg={k ? CD_B : Y} color={k ? '#fff' : BG} /></div>)}
    </div>
    <div style={{...abs(0, 1190), width: 1080, display: 'flex', justifyContent: 'center', ...up(F, T.vid + 0.15)}}><Chip color={C_BLUE} size={36}>Batchmates</Chip></div>
  </AbsoluteFill>
);

/* ---------- 4. Delhi: something felt off ---------- */
const Delhi = ({F}) => {
  const shake = F >= s(T.khat) && F < s(T.khat) + 10 ? Math.sin((F - s(T.khat)) * 1.8) * 5 : 0;
  return (
    <AbsoluteFill>
      <Glass x={90} y={300} w={900} h={760} r={44} style={{overflow: 'hidden', padding: 0}}>
        <div style={{transform: `scale(${io(F, s(T.cut3), s(T.cut4), 1, 1.08, Easing.linear)})`, transformOrigin: '50% 100%'}}><Skyline /></div>
        <div style={{...abs(380, 130), ...drop(F, T.delhi - 0.1, 200)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 999, padding: '14px 28px 8px', boxShadow: '0 14px 30px rgba(0,0,0,0.15)', fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}><Ico d={I_PIN} size={44} color={C_RED} sw={2.4} />Delhi</div>
        </div>
        <div style={{padding: '40px 50px', display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 130, height: 130, borderRadius: 65, background: C_RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, fontWeight: 800, color: '#fff', paddingTop: 12, boxSizing: 'border-box',
            ...popS(F, T.khat - 0.15, 8), translate: `${shake}px 0`}}>!</div>
          <div style={{...up(F, T.goshta - 0.1)}}>
            <div style={{fontSize: 30, fontWeight: 700, color: MUTED, letterSpacing: '0.1em'}}>PACKET MILK</div>
            <div style={{display: 'flex', gap: 14, marginTop: 14}}><Pouch size={70} /><Pouch size={70} /><Pouch size={70} /></div>
          </div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 5. City packet milk vs village milk ---------- */
const Packet = ({F}) => {
  const Row = ({t, label, ok}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, ...popS(F, t, 12)}}>
      {ok ? <Tick size={46} /> : <svg viewBox="0 0 24 24" width="46" height="46"><circle cx="12" cy="12" r="11" fill={C_RED} /><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>}
      <span style={{fontSize: 44, fontWeight: 700, color: TXT}}>{label}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Glass x={70} y={300} w={450} h={980} r={40} style={{padding: 34, ...up(F, T.cut4, 12, 60)}}>
        <Chip color="#7A7A7A" size={34}>शहर</Chip>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40, ...drop(F, T.packet - 0.2, 260)}}><Pouch size={240} /></div>
        <div style={{marginTop: 60}}><Row t={T.taja} label="ताजं" ok={0} /><Row t={T.shuddh} label="शुद्ध" ok={0} /></div>
      </Glass>
      <Glass x={560} y={300} w={450} h={980} r={40} style={{padding: 0, overflow: 'hidden', ...up(F, T.gav - 0.15, 12, 60)}}>
        <div style={{height: 380, position: 'relative'}}><Hills w={450} h={380} sun={io(F, s(T.gav), s(T.gav) + 30)} />
          <div style={{...abs(150, 220), ...drop(F, T.gav + 0.2, 200)}}><MilkCan size={150} /></div></div>
        <div style={{...abs(34, 30)}}><Chip color="#2F7D1E" size={34} style={{background: '#fff'}}>गाव</Chip></div>
        <div style={{padding: '30px 34px'}}><Row t={T.taja + 0.15} label="ताजं" ok={1} /><Row t={T.shuddh + 0.15} label="शुद्ध" ok={1} /></div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 6. Fresh milk from farmers ---------- */
const Farm = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={290} w={900} h={1000} r={44} style={{padding: 0, overflow: 'hidden'}}>
      <div style={{transform: `scale(${io(F, s(T.cut5), s(T.cut6), 1.05, 1.15, Easing.linear)})`}}><Hills w={900} h={1000} sun={io(F, s(T.cut5), s(T.cut5) + 40)} /></div>
      {[[110, T.farmers], [340, T.farmers + 0.2], [570, T.farmers + 0.4]].map(([x, t], i) => <div key={i} style={{...abs(x, 700), ...drop(F, t, 400)}}><MilkCan size={220} /></div>)}
      <div style={{...abs(40, 40), ...popS(F, T.taja2 - 0.1)}}><Chip color="#2F7D1E" size={40} style={{background: '#fff'}}>Farm fresh</Chip></div>
      <div style={{...abs(40, 120), ...popS(F, T.farmers - 0.15)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '12px 26px 6px', fontSize: 40, fontWeight: 700, color: TXT, boxShadow: '0 10px 24px rgba(0,0,0,0.12)'}}><Ico d={I_USERS} size={40} color={CD_B} sw={2.4} />शेतकरी</div>
      </div>
    </Glass>
  </AbsoluteFill>
);

/* ---------- 7. Home delivery route ---------- */
const Route = ({F}) => {
  const p = io(F, s(T.cut6) + 4, s(T.home + 0.4), 0, 1, Easing.inOut(Easing.cubic));
  const P = (q) => { const x0 = 230, y0 = 860, cx = 640, cy = 300, x1 = 820, y1 = 760; const u = 1 - q; return [u * u * x0 + 2 * u * q * cx + q * q * x1, u * u * y0 + 2 * u * q * cy + q * q * y1]; };
  const [sx, sy] = P(p);
  return (
    <AbsoluteFill>
      <Glass x={90} y={290} w={900} h={1000} r={44} style={{overflow: 'hidden'}}>
        <svg viewBox="0 0 900 1000" width="900" height="1000" style={{...abs(0, 0)}}>
          {Array.from({length: 10}).map((_, i) => <path key={i} d={`M0 ${i * 110}h900M${i * 110} 0v1000`} stroke="rgba(0,0,0,0.04)" strokeWidth="2" />)}
          <path d="M140 570 Q550 10 730 470" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="14" strokeLinecap="round" />
          <path d="M140 570 Q550 10 730 470" fill="none" stroke={CD_B} strokeWidth="14" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
        <div style={{...abs(40, 560)}}><div style={{width: 200, height: 200, borderRadius: 40, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,0.15)'}}><Hills w={200} h={200} /></div></div>
        <div style={{...abs(600, 440), ...popS(F, T.cut6 + 0.1)}}><House size={240} door={F >= s(T.home + 0.4)} /></div>
        <div style={{...abs(sx - 75 - 90, sy - 110 - 290), transform: `rotate(${io(p, 0, 0.5, -16, 0) + io(p, 0.5, 1, 0, 14)}deg)`}}><Scooter size={150} spin={F * 12} /></div>
        <div style={{...abs(560, 720), ...popS(F, T.home)}}><Chip color={C_GREEN} size={44} style={{background: '#fff'}}>Home Delivery</Chip></div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 8. Subscription: every day ticks itself ---------- */
const Sub = ({F}) => {
  const done = io(F, s(T.cut7) + 6, s(T.sub + 0.4), 0, 30, Easing.linear);
  return (
    <AbsoluteFill>
      <Glass x={100} y={290} w={880} h={900} r={44} style={{padding: 44}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}><Ico d={I_CAL} size={54} color={TXT} sw={2.2} /><div style={{fontSize: 52, fontWeight: 700, color: TXT, ...LAT}}>November</div><div style={{flex: 1}} />
          <div style={{...popS(F, T.sub)}}><Chip color={CD_B} size={34}>Subscription</Chip></div></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14, marginTop: 40}}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} style={{textAlign: 'center', fontSize: 26, fontWeight: 700, color: MUTED}}>{d}</div>)}
          {Array.from({length: 30}).map((_, i) => {
            const on = done > i;
            return (
              <div key={i} style={{height: 96, borderRadius: 20, background: on ? '#E7F0FA' : 'rgba(0,0,0,0.035)', border: `2px solid ${on ? CD_B + '55' : 'transparent'}`, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box'}}>
                <span style={{fontSize: 24, fontWeight: 600, color: TXT}}>{i + 1}</span>
                {on && <div style={{...abs(28, 42), transform: `scale(${io(done - i, 0, 0.8)})`}}><Drop size={40} /></div>}
              </div>
            );
          })}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 9. Recharge the wallet once ---------- */
const AppHead = ({title}) => (
  <div style={{padding: '70px 34px 0', display: 'flex', alignItems: 'center', gap: 16}}>
    <CDLogo size={80} /><div style={{fontSize: 36, fontWeight: 800, color: INKC, ...LAT}}>{title}</div>
  </div>
);
const Wallet = ({F}) => {
  const tap = s(T.wallet + 0.25);
  const bal = io(F, s(T.recharge), s(T.recharge) + 14, 0, 2000);
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120}>
        <AppHead title="Wallet" />
        <div style={{margin: '40px 34px 0', borderRadius: 36, background: `linear-gradient(135deg, ${CD_B}, #2F7FD0)`, padding: '40px 40px 34px', color: '#fff'}}>
          <div style={{fontSize: 28, opacity: 0.8, ...LAT}}>Wallet balance</div>
          <div style={{fontSize: 110, fontWeight: 800, ...LAT, marginTop: 6}}>{inr(bal)}</div>
        </div>
        <div style={{display: 'flex', gap: 18, margin: '34px 34px 0'}}>
          {[500, 1000, 2000].map((v) => {
            const sel = v === 2000 && F >= tap;
            return <div key={v} style={{flex: 1, height: 100, borderRadius: 24, border: `3px solid ${sel ? CD_B : 'rgba(0,0,0,0.1)'}`, background: sel ? '#E7F0FA' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, fontSize: 40, fontWeight: 800, color: INKC, ...LAT}}>{inr(v)}</div>;
          })}
        </div>
        {F >= tap && F < tap + 14 && <div style={{...abs(560 - 70 * io(F, tap, tap + 14), 450 - 70 * io(F, tap, tap + 14)), width: 140 * io(F, tap, tap + 14), height: 140 * io(F, tap, tap + 14), borderRadius: '50%', border: `4px solid ${CD_B}`, opacity: io(F, tap, tap + 14, 1, 0)}} />}
        <div style={{margin: '34px 34px 0', height: 110, borderRadius: 30, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, fontSize: 42, fontWeight: 800, color: BG, ...LAT,
          transform: `scale(${1 - 0.05 * io(F, s(T.recharge) - 4, s(T.recharge)) * io(F, s(T.recharge), s(T.recharge) + 4, 1, 0)})`}}>Recharge</div>
        <div style={{margin: '40px 34px 0', borderRadius: 28, background: '#fff', padding: '28px 30px 22px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', ...up(F, T.recharge + 0.3, 12, 30)}}>
          <Tick size={56} /><div><div style={{fontSize: 34, fontWeight: 700, color: INKC, ...LAT}}>Recharge successful</div><div style={{fontSize: 24, color: '#8a8478', ...LAT}}>Daily milk is on auto</div></div>
        </div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* ---------- 10. Every morning, milk at the door ---------- */
const Morning = ({F}) => {
  const sun = io(F, s(T.cut9), s(T.roj + 0.6));
  return (
    <AbsoluteFill>
      <Glass x={90} y={290} w={900} h={1000} r={44} style={{padding: 0, overflow: 'hidden'}}>
        <div style={{height: 1000, background: `linear-gradient(${sun > 0.5 ? '#FFE9B8' : '#E6D5F0'}, #FFF8EA)`, position: 'relative'}}>
          <div style={{...abs(620, 260 - 160 * sun), width: 170, height: 170, borderRadius: '50%', background: CD_SUN, boxShadow: `0 0 80px ${CD_SUN}`}} />
          <div style={{...abs(60, 50), display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '14px 28px 8px', fontSize: 44, fontWeight: 800, color: TXT, ...LAT, ...up(F, T.roj - 0.1)}}>6:30 AM</div>
          <div style={{...abs(250, 330), width: 400, height: 600, background: '#C98A4B', border: `8px solid ${INKC}`, borderBottom: 'none', borderRadius: '12px 12px 0 0', boxSizing: 'border-box'}}>
            <div style={{...abs(310, 300), width: 30, height: 30, borderRadius: 15, background: CD_SUN, border: `4px solid ${INKC}`}} />
            {[0, 1].map((r) => <div key={r} style={{...abs(40, 40 + r * 260), width: 304, height: 220, border: '6px solid rgba(0,0,0,0.18)', borderRadius: 10}} />)}
          </div>
          <div style={{...abs(150, 900), width: 600, height: 100, background: '#B7A07A'}} />
          <div style={{...abs(330, 690), ...drop(F, T.darat - 0.15, 500)}}>
            <Photo src="cow_milk.jpg" w={240} h={240} F={F} a={T.darat} b={T.cut10} z0={1.5} z1={1.6} pos="50% 56%" r={30} />
          </div>
        </div>
        <div style={{...abs(60, 140), right: 60, background: '#fff', borderRadius: 30, padding: '24px 28px 18px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 16px 40px rgba(0,0,0,0.14)', ...up(F, T.hajar - 0.15, 10, -40)}}>
          <CDLogo size={70} /><div style={{flex: 1}}><div style={{fontSize: 32, fontWeight: 700, color: INKC, ...LAT}}>Milk delivered at your door</div><div style={{fontSize: 24, color: '#8a8478', ...LAT}}>Cow Milk · 450 ml × 2</div></div><Tick size={50} />
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 11. Going to the village for holidays ---------- */
const Trip = ({F}) => {
  const bob = Math.sin(F / 4) * 6;
  return (
    <AbsoluteFill>
      <Glass x={90} y={290} w={900} h={1000} r={44} style={{padding: 0, overflow: 'hidden'}}>
        <div style={{transform: `scale(${io(F, s(T.cut10), s(T.cut11), 1.0, 1.08, Easing.linear)})`}}><Hills w={900} h={1000} /></div>
        <div style={{...abs(330, 470), transform: `translateY(${bob}px) rotate(${-6 + bob * 0.4}deg)`, ...up(F, T.cut10, 10, 80)}}><Suitcase size={260} /></div>
        <div style={{...abs(50, 50), ...popS(F, T.gavi - 0.1)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 999, padding: '14px 28px 8px', fontSize: 44, fontWeight: 700, color: TXT, boxShadow: '0 10px 24px rgba(0,0,0,0.12)'}}><Ico d={I_PIN} size={44} color={C_RED} sw={2.4} />गाव</div>
        </div>
        <div style={{...abs(560, 60), ...popS(F, T.gavi + 0.25)}}><Chip color={C_ORANGE} size={38} style={{background: '#fff'}}>15–20 Nov</Chip></div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 12. Pause delivery from the app ---------- */
const Pause = ({F}) => {
  const on = io(F, s(T.pause) - 4, s(T.pause) + 4);
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120}>
        <AppHead title="Delivery schedule" />
        <div style={{margin: '40px 34px 0', borderRadius: 30, background: '#fff', padding: '30px 32px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.07)'}}>
          <div style={{flex: 1}}><div style={{fontSize: 38, fontWeight: 800, color: INKC, ...LAT}}>Pause delivery</div><div style={{fontSize: 26, color: '#8a8478', ...LAT}}>15 – 20 Nov</div></div>
          <div style={{width: 130, height: 74, borderRadius: 37, background: on > 0.5 ? CD_B : '#D5D0C6', position: 'relative'}}><div style={{...abs(6 + 56 * on, 6), width: 62, height: 62, borderRadius: 31, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} /></div>
        </div>
        <div style={{margin: '24px 34px 0'}}>
          {[15, 16, 17, 18, 19, 20].map((d, i) => {
            const p = io(F, s(T.pause) + i * 2, s(T.pause) + i * 2 + 6);
            return (
              <div key={d} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 6px', borderBottom: '2px solid rgba(0,0,0,0.05)'}}>
                <div style={{fontSize: 34, fontWeight: 700, color: INKC, width: 120, ...LAT}}>{d} Nov</div>
                <div style={{flex: 1, fontSize: 28, color: '#8a8478', textDecoration: p > 0.5 ? 'line-through' : 'none', ...LAT}}>Cow Milk · 450 ml × 2</div>
                <div style={{opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}><Chip color={C_ORANGE} size={26}>Paused</Chip></div>
              </div>
            );
          })}
        </div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* ---------- 13. Monthly bill, auto-deducted ---------- */
const Bill = ({F}) => {
  const ROWS = [['Cow Milk 450 ml × 2', '24 days', 1296], ['Curd 400 g', '4 days', 200], ['Paneer 200 g', '2 days', 180]];
  return (
    <AbsoluteFill>
      <Glass x={110} y={300} w={860} h={940} r={44} style={{padding: '48px 50px', ...up(F, T.cut12, 12, 60)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}><CDLogo size={90} /><div><div style={{fontSize: 48, fontWeight: 800, color: TXT, ...LAT}}>November bill</div><div style={{fontSize: 28, color: MUTED, ...LAT}}>1 – 30 Nov</div></div></div>
        <div style={{height: 2, background: LINE, margin: '36px 0 10px'}} />
        {ROWS.map(([n, d, v], i) => (
          <div key={n} style={{display: 'flex', alignItems: 'center', padding: '22px 0', borderBottom: `2px solid ${LINE}`, ...up(F, T.bill - 0.2 + i * 0.12, 10, 24)}}>
            <div style={{flex: 1}}><div style={{fontSize: 36, fontWeight: 700, color: TXT, ...LAT}}>{n}</div><div style={{fontSize: 24, color: MUTED, ...LAT}}>{d}</div></div>
            <div style={{fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>{inr(v)}</div>
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', padding: '30px 0 0'}}><div style={{flex: 1, fontSize: 40, fontWeight: 700, color: MUTED}}>Total</div><div style={{fontSize: 72, fontWeight: 800, color: TXT, ...LAT}}>{inr(1676)}</div></div>
      </Glass>
      <div style={{...abs(330, 1150), ...popS(F, T.apoap - 0.1, 9)}}>
        <div style={{transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', gap: 16, background: C_GREEN, borderRadius: 999, padding: '18px 36px 12px', boxShadow: '0 20px 40px rgba(34,197,94,0.35)', fontSize: 42, fontWeight: 800, color: '#fff', ...LAT}}>
          <Tick size={46} color="#15803D" />Paid from wallet
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 14. No more loose-change hassle ---------- */
const Cash = ({F}) => {
  const ITEMS = [[180, 420, 'c', '10', -10], [420, 380, 'n', '20', 8], [700, 450, 'c', '5', 12], [260, 640, 'n', '10', -6], [560, 660, 'c', '2', -14], [760, 700, 'c', '1', 6], [380, 860, 'n', '50', -4]];
  const strike = io(F, s(T.katkat) - 4, s(T.katkat) + 8, 0, 1, Easing.inOut(Easing.cubic));
  const fade = io(F, s(T.katkat) + 8, s(T.katkat) + 18, 1, 0.25);
  return (
    <AbsoluteFill>
      <div style={{opacity: fade}}>
        {ITEMS.map(([x, y, k, v, r], i) => {
          const jig = F < s(T.katkat) ? Math.sin(F * 0.8 + i) * 4 : 0;
          return <div key={i} style={{...abs(x - 90, y), ...drop(F, T.cut13 + 0.08 * i + 0.1, 600)}}><div style={{transform: `rotate(${r + jig}deg)`}}>{k === 'c' ? <Coin size={170} v={v} c={['#D9B44A', '#C9CDD2'][i % 2]} /> : <Note w={300} v={v} c={['#E9B9A0', '#B9D9C0', '#C7B9E9'][i % 3]} />}</div></div>;
        })}
      </div>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{...abs(0, 0)}}>
        <path d="M160 1080 L920 420" stroke={C_RED} strokeWidth="26" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - strike} />
      </svg>
      <div style={{...abs(0, 1160), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, T.katkat + 0.35, 9)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 999, padding: '20px 40px 14px', boxShadow: '0 16px 40px rgba(60,45,10,0.14)', fontSize: 48, fontWeight: 800, color: TXT, ...LAT}}><Tick size={54} />No loose change</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 15. Customers' trust ---------- */
const Star = ({size = 70, fill = 1}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><defs><clipPath id={`st${size}`}><rect width={24 * fill} height="24" /></clipPath></defs>
    <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#E6E0D4" />
    <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill={CD_SUN} clipPath={`url(#st${size})`} /></svg>
);
const Trust = ({F}) => {
  const REV = [['PS', 'रोज वेळेवर दूध', 0], ['AK', 'दूध खरंच ताजं आहे', 0.3], ['MJ', 'Pause करणं खूप सोपं', 0.6]];
  return (
    <AbsoluteFill>
      <Glass x={110} y={300} w={860} h={330} r={44} style={{padding: '40px 46px', ...up(F, T.cut14, 12, 60)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}><CDLogo size={96} /><div style={{fontSize: 48, fontWeight: 800, color: TXT, ...LAT}}>Country Delight</div></div>
        <div style={{display: 'flex', gap: 14, marginTop: 34}}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={96} fill={io(F, s(T.vishwas) - 8 + i * 3, s(T.vishwas) - 2 + i * 3)} />)}</div>
      </Glass>
      {REV.map(([i, t, d], k) => (
        <div key={i} style={{...abs(k % 2 ? 230 : 130, 700 + k * 190), ...up(F, T.vishwas + d, 12, 40)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#fff', borderRadius: 999, padding: '18px 34px 18px 18px', boxShadow: '0 16px 40px rgba(60,45,10,0.12)'}}>
            <Ini t={i} size={84} bg={[Y, '#E7F0FA', '#EEF6E6'][k]} color={BG} /><span style={{fontSize: 42, fontWeight: 600, color: TXT, whiteSpace: 'nowrap'}}>{t}</span><Tick size={44} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 16. Beyond milk: veggies, ghee, daily essentials ---------- */
const Veg = () => (<svg viewBox="0 0 64 64" width="96" height="96"><circle cx="30" cy="38" r="20" fill="#E5484D" stroke={INKC} strokeWidth="3" /><path d="M30 18c-4-6-10-6-14-4 4 2 8 4 14 4zM30 18c4-7 11-7 15-4-4 3-9 4-15 4z" fill="#4E9A30" stroke={INKC} strokeWidth="2.5" /><path d="M22 32a8 8 0 0 1 6-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>);
const Ghee = () => (<svg viewBox="0 0 64 64" width="96" height="96"><rect x="18" y="8" width="28" height="10" rx="3" fill={CD_B} stroke={INKC} strokeWidth="3" /><path d="M16 20h32l2 34a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#F6C945" stroke={INKC} strokeWidth="3" strokeLinejoin="round" /><rect x="20" y="30" width="24" height="14" rx="2" fill="#fff" /><text x="32" y="41" textAnchor="middle" fontSize="9" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">GHEE</text></svg>);
const Bread = () => (<svg viewBox="0 0 64 64" width="96" height="96"><path d="M10 28c0-10 10-14 22-14s22 4 22 14c0 3-3 4-5 4v20H15V32c-2 0-5-1-5-4z" fill="#E8B46E" stroke={INKC} strokeWidth="3" strokeLinejoin="round" /><path d="M22 36v10M32 36v10M42 36v10" stroke="#B9874A" strokeWidth="3" strokeLinecap="round" /></svg>);
const Eggs = () => (<svg viewBox="0 0 64 64" width="96" height="96"><ellipse cx="22" cy="36" rx="12" ry="16" fill="#FFF8EE" stroke={INKC} strokeWidth="3" /><ellipse cx="42" cy="38" rx="12" ry="16" fill="#F3E2CB" stroke={INKC} strokeWidth="3" /></svg>);
const Fruit = () => (<svg viewBox="0 0 64 64" width="96" height="96"><path d="M32 20c-12-6-22 2-22 16 0 12 10 22 22 18 12 4 22-6 22-18 0-14-10-22-22-16z" fill="#8CC63F" stroke={INKC} strokeWidth="3" /><path d="M32 20c0-6 2-10 6-12" stroke={INKC} strokeWidth="3" fill="none" strokeLinecap="round" /></svg>);
const More = ({F}) => {
  const CAT = [['दूध', <MilkCan size={96} />, T.cut15 + 0.05, '#E7F0FA'], ['भाजी', <Veg />, T.bhaji - 0.15, '#FDECEC'], ['तूप', <Ghee />, T.tup - 0.15, '#FFF4D6'],
    ['ब्रेड', <Bread />, T.itar - 0.1, '#F6E9E2'], ['अंडी', <Eggs />, T.itar + 0.15, '#F1EEE8'], ['फळं', <Fruit />, T.itar + 0.4, '#EEF6E6']];
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120}>
        <AppHead title="Country Delight" />
        <div style={{margin: '36px 34px 0', fontSize: 30, fontWeight: 700, color: '#8a8478', letterSpacing: '0.1em', ...LAT}}>SHOP BY CATEGORY</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22, margin: '24px 34px 0'}}>
          {CAT.map(([n, ico, t, bg]) => (
            <div key={n} style={{height: 250, borderRadius: 30, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, ...drop(F, t, 260)}}>
              {ico}<div style={{fontSize: 40, fontWeight: 700, color: INKC}}>{n}</div>
            </div>
          ))}
        </div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* ---------- 17. One app grew business and profit ---------- */
const Profit = ({F}) => {
  const d1 = io(F, s(T.biz2) - 6, s(T.biz2) + 14, 0, 1, Easing.inOut(Easing.cubic)), d2 = io(F, s(T.profit) - 4, s(T.profit) + 16, 0, 1, Easing.inOut(Easing.cubic));
  const Card = ({y, t, label, d, color, path}) => (
    <Glass x={110} y={y} w={860} h={440} r={44} style={{padding: '36px 44px', ...up(F, t, 12, 50)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}><div style={{fontSize: 50, fontWeight: 800, color: TXT, ...LAT}}>{label}</div><div style={{flex: 1}} />
        <div style={{opacity: d, transform: `scale(${0.6 + 0.4 * d})`}}><Chip color={C_GREEN} size={36}>↑ वाढ</Chip></div></div>
      <svg viewBox="0 0 770 250" width="770" height="250" style={{marginTop: 20, overflow: 'visible'}}>
        {[0, 1, 2].map((i) => <path key={i} d={`M0 ${40 + i * 90}h770`} stroke="rgba(0,0,0,0.06)" strokeWidth="2" />)}
        <path d={path} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - d} />
      </svg>
    </Glass>
  );
  return (
    <AbsoluteFill>
      <Card y={290} t={T.cut16} label="Business" d={d1} color={CD_B} path="M0 220 C120 210 180 190 260 170 S420 130 500 100 S680 40 770 10" />
      <Card y={790} t={T.profit - 0.4} label="Profit" d={d2} color={C_GREEN} path="M0 230 L130 215 L260 200 L390 160 L520 130 L650 70 L770 20" />
    </AbsoluteFill>
  );
};

/* ---------- 15. Maharashtra has dairies and pure milk ---------- */
const Maha = ({F}) => {
  const PINS = [['कोल्हापूर', 120, 760], ['पुणे', 560, 700], ['नाशिक', 640, 360], ['अहिल्यानगर', 140, 420], ['सांगली', 380, 860]];
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 280)}}><Photo src="buffalo_milk.jpg" w={900} h={900} F={F} a={T.cut14} b={T.cut15} z0={1.0} z1={1.12} /></div>
      <div style={{...abs(130, 320), ...up(F, T.maha - 0.15, 10, 20)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: BG, borderRadius: 999, padding: '16px 32px 10px', fontSize: 48, fontWeight: 800, color: '#fff', ...LAT}}>महाराष्ट्र</div>
      </div>
      {PINS.map(([n, x, y], i) => (
        <div key={n} style={{...abs(x + 90, y + 280 - 400 + 300), ...popS(F, T.dairy - 0.3 + i * 0.13, 10)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 999, padding: '12px 24px 6px', fontSize: 36, fontWeight: 700, color: TXT, boxShadow: '0 12px 28px rgba(0,0,0,0.18)'}}><Ico d={I_PIN} size={36} color={C_RED} sw={2.4} />{n}</div>
        </div>
      ))}
      <div style={{...abs(600, 1200), ...popS(F, T.shuddh2 - 0.1, 9)}}><div style={{transform: 'rotate(-3deg)', display: 'flex', alignItems: 'center', gap: 12, background: Y, borderRadius: 999, padding: '18px 34px 12px', fontSize: 44, fontWeight: 800, color: BG, ...LAT}}><Drop size={40} c={BG} />Pure milk</div></div>
    </AbsoluteFill>
  );
};

/* ---------- 16. Your dairy ---------- */
const Yours = ({F}) => (
  <AbsoluteFill>
    <Glass x={110} y={300} w={860} h={900} r={44} style={{padding: 0, overflow: 'hidden', ...up(F, T.cut18, 12, 60)}}>
      <div style={{display: 'flex'}}>{Array.from({length: 8}).map((_, i) => <div key={i} style={{flex: 1, height: 120, background: i % 2 ? '#fff' : CD_B, borderRadius: '0 0 50px 50px'}} />)}</div>
      <div style={{...abs(0, 150), width: 860, display: 'flex', justifyContent: 'center', ...popS(F, T.tumcha - 0.1)}}>
        <div style={{background: BG, borderRadius: 24, padding: '22px 48px 14px', fontSize: 64, fontWeight: 800, color: '#fff'}}>तुमची डेअरी</div>
      </div>
      <div style={{...abs(60, 420), right: 60, display: 'flex', justifyContent: 'space-around'}}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{...drop(F, T.dairy2 - 0.2 + i * 0.12, 300)}}><MilkCan size={150} c={['#DDE5EC', '#E9F1E1', '#DDE5EC', '#FFF1CF'][i]} /></div>)}
      </div>
      <div style={{...abs(0, 660), width: 860, display: 'flex', justifyContent: 'center', gap: 20}}>
        {[['डेअरी', T.dairy2], ['दूध व्यवसाय', T.vyav]].map(([n, t]) => <div key={n} style={{...popS(F, t - 0.1)}}><Chip color={CD_B} size={40}>{n}</Chip></div>)}
      </div>
    </Glass>
  </AbsoluteFill>
);

/* ---------- 17. Your own app ---------- */
const MilkIco = ({c}) => <div style={{width: 96, height: 96, borderRadius: 24, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><MilkCan size={70} /></div>;
const App = ({F}) => {
  const PR = [['गाईचं दूध', '1 L · ₹64', '#E7F0FA'], ['म्हशीचं दूध', '1 L · ₹78', '#EEF6E6'], ['दही', '400 g · ₹50', '#FFF4D6'], ['पनीर', '200 g · ₹90', '#F6E9E2']];
  return (
    <AbsoluteFill>
      <PhoneL x={170} y={250} w={740} h={1120} style={{transform: `scale(${pop(F, T.cut19, 13)})`}}>
        <div style={{padding: '70px 34px 0', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 80, height: 80, borderRadius: 22, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Drop size={46} c={BG} /></div>
          <div><div style={{fontSize: 36, fontWeight: 800, color: INKC}}>तुमची डेअरी</div><div style={{fontSize: 22, color: '#8a8478', ...LAT}}>Fresh milk · Every morning</div></div>
        </div>
        <div style={{margin: '30px 34px 0', height: 200, borderRadius: 30, background: `linear-gradient(135deg, ${Y}, #FFE38A)`, padding: '30px 34px', boxSizing: 'border-box', ...up(F, T.app - 0.5, 10, 30)}}>
          <div style={{fontSize: 44, fontWeight: 800, color: BG}}>रोज सकाळी ताजं दूध</div>
          <div style={{marginTop: 16, display: 'inline-block', background: BG, color: '#fff', borderRadius: 999, padding: '12px 26px 6px', fontSize: 28, fontWeight: 700, ...LAT}}>Subscribe</div>
        </div>
        {PR.map(([n, sub, c], i) => (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 20, margin: '0 34px', padding: '20px 0', borderBottom: '2px solid rgba(0,0,0,0.05)', ...up(F, T.app - 0.3 + i * 0.15, 10, 30)}}>
            <MilkIco c={c} /><div style={{flex: 1}}><div style={{fontSize: 36, fontWeight: 700, color: INKC}}>{n}</div><div style={{fontSize: 24, color: '#8a8478', ...LAT}}>{sub}</div></div>
            <div style={{border: `3px solid ${CD_B}`, color: CD_B, borderRadius: 999, padding: '10px 22px 4px', fontSize: 26, fontWeight: 800, ...LAT}}>+ Add</div>
          </div>
        ))}
      </PhoneL>
    </AbsoluteFill>
  );
};

/* ---------- 20. Sell more than milk from your app ---------- */
const Products = ({F}) => {
  const IT = [['दही', 240, 330], ['पनीर', 700, 360], ['तूप', 160, 820], ['भाजी', 740, 860], ['ब्रेड', 430, 1060]];
  return (
    <AbsoluteFill>
      <div style={{...abs(390, 520), ...popS(F, T.cut20, 12)}}>
        <div style={{width: 300, height: 300, borderRadius: 80, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 70px rgba(183,127,0,0.35)'}}><Drop size={170} c={BG} /></div>
        <div style={{marginTop: 24, textAlign: 'center', fontSize: 44, fontWeight: 800, color: TXT}}>तुमची डेअरी</div>
      </div>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{...abs(0, 0)}}>
        {IT.map(([n, x, y], i) => <path key={n} d={`M540 670 L${x + 80} ${y + 40}`} stroke={GOLD_T} strokeWidth="4" strokeDasharray="10 12" strokeDashoffset={-F} opacity={io(F, s(T.prod) - 6 + i * 3, s(T.prod) + i * 3)} />)}
      </svg>
      {IT.map(([n, x, y], i) => (
        <div key={n} style={{...abs(x, y), ...popS(F, T.prod - 0.2 + i * 0.1, 10)}}>
          <div style={{background: '#fff', borderRadius: 999, padding: '18px 34px 12px', boxShadow: '0 16px 40px rgba(60,45,10,0.14)', fontSize: 44, fontWeight: 700, color: TXT, whiteSpace: 'nowrap'}}>{n}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 19. Want to know more about building this app? ---------- */
const Learn = ({F}) => {
  const a = io(F, s(T.custom), s(T.custom) + 18);
  const QS = [['किती खर्च?', 620, 360, T.jaanun - 0.2], ['किती वेळ?', 640, 560, T.jaanun + 0.1], ['कोणते features?', 560, 760, T.jaanun + 0.4]];
  return (
    <AbsoluteFill>
      <PhoneL x={90} y={300} w={460} h={940} style={{transform: `scale(${pop(F, T.cut21, 13)}) rotate(-4deg)`}}>
        <div style={{padding: '70px 24px 20px'}}>
          <div style={{height: 150, borderRadius: 24, background: a ? Y : 'transparent', border: `3px dashed rgba(0,0,0,${0.25 * (1 - a)})`, opacity: 0.4 + 0.6 * a}} />
          {[0, 1, 2, 3].map((i) => <div key={i} style={{display: 'flex', gap: 14, marginTop: 22, alignItems: 'center'}}><div style={{width: 84, height: 84, borderRadius: 18, background: a ? ['#E7F0FA', '#EEF6E6', '#FFF4D6', '#F6E9E2'][i] : 'transparent', border: `2px dashed rgba(0,0,0,${0.2 * (1 - a)})`}} /><div style={{flex: 1}}><div style={{height: 16, borderRadius: 8, background: a ? '#2A2A2A' : 'rgba(0,0,0,0.1)', width: '80%'}} /><div style={{height: 12, borderRadius: 6, background: 'rgba(0,0,0,0.1)', width: '50%', marginTop: 10}} /></div></div>)}
          <div style={{height: 84, borderRadius: 24, background: a ? BG : 'rgba(0,0,0,0.08)', marginTop: 34}} />
        </div>
      </PhoneL>
      {QS.map(([q, x, y, t]) => (
        <div key={q} style={{...abs(x, y), ...popS(F, t, 11), transformOrigin: '0% 100%'}}>
          <div style={{background: '#fff', borderRadius: '30px 30px 30px 8px', padding: '20px 30px 14px', boxShadow: '0 16px 40px rgba(60,45,10,0.14)', fontSize: 40, fontWeight: 700, color: TXT, whiteSpace: 'nowrap', ...LAT}}>{q}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 20. DM Outgrid Labs ---------- */
const MSG = 'Hi, मला डेअरी ॲप बनवायचंय';
const Dm = ({F}) => {
  const sent = T.dm + 0.2;
  const typed = MSG.slice(0, Math.floor(io(F, s(T.cut22) + 4, s(sent) - 2, 0, MSG.length, Easing.linear)));
  return (
    <AbsoluteFill>
      <Glass x={90} y={260} w={900} h={1020} r={44} style={{padding: 0, overflow: 'hidden', ...up(F, T.cut22, 12, 60)}}>
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
const COMPS = {hook: Hook, founders: Founders, iim: Iim, delhi: Delhi, packet: Packet, farm: Farm, route: Route, sub: Sub, wallet: Wallet, morning: Morning,
  trip: Trip, pause: Pause, bill: Bill, cash: Cash, trust: Trust, more: More, profit: Profit, maha: Maha, yours: Yours, app: App, products: Products, learn: Learn, dm: Dm, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
