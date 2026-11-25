/*
 * "Crusher & dispatch software in 6 steps" — Outgrid Labs reel, ISO style (shared/iso.jsx), 1080x1920, VO at original speed.
 * Bright industrial vectors (props.jsx): safety-orange crusher plant, yellow-cab dumpers, stone piles, weighbridge, gate.
 * Truck numbers, party names, rates, tonnage, OTP and amounts on screen are illustrative.
 * No headline at the top: captions bottom-left from frame 0 (orange highlights); the top only carries the small "// label".
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark, BRAND, InstagramLogo} from '../../shared/kit.jsx';
import {INK, MUTE, FAINT, GRN, RED, BLUE, LAT, up, popS, vis, P, Box, Stage, at, Person, Card, Tag, Plate, Dot, Logo, Ico, IsoVideo} from '../../shared/iso.jsx';
import {OR, OR2, YEL, STEEL, TEAL, STONE10, STONE20, SANDC, Ground, Road, Pile, Dumper, Plant, Flood, Weighbridge, Cabin, Gate, Barricade, Beacon, Shed} from './props.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S} from './cues.mjs';

const TOTAL = s(TOTAL_S);
const ORT = '#E8590C'; // orange for text on paper
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const scEnd = (k) => SCENES.find((x) => x[0] === k)[2];
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontSize: size, fontWeight: wt, color, lineHeight: 1.15, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const typed = (F, t0, t1, str) => str.slice(0, Math.round(io(F, s(t0), s(t1), 0, str.length, Easing.linear)));
const ease = Easing.inOut(Easing.cubic);
const drive = (F, t0, dur, x0, x1, e = ease) => io(F, s(t0), s(t0 + dur), x0, x1, e);
const fmt = (n) => Math.round(n).toLocaleString('en-IN');
const shake = (F, t, d = 0.5) => (F >= s(t) && F < s(t + d) ? Math.sin(F * 1.7) * 7 * io(F, s(t), s(t + d), 1, 0) : 0);
const Stamp = ({F, t, children, color = RED, rot = -10, size = 56, style = {}}) => !vis(F, t) ? null : (
  <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${io(F, s(t), s(t) + 6, 1.8, 1, Easing.out(Easing.cubic))})`, opacity: io(F, s(t), s(t) + 4),
    border: `6px solid ${color}`, color, borderRadius: 14, padding: '14px 28px 6px', fontSize: size, fontWeight: 800, letterSpacing: '0.02em', background: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/* icons (24 grid) */
const I = {
  truck: <><path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h4l3 3.2v2.8h-7" /><circle cx="6.5" cy="17" r="1.8" /><circle cx="16.5" cy="17" r="1.8" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  cam: <><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  scale: <><path d="M4 19h16M6 19V9h12v10" /><path d="M9 13h6" /></>,
  qr: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  box: <><path d="M3.5 8L12 4l8.5 4v8L12 20l-8.5-4z" /><path d="M3.5 8L12 12l8.5-4M12 12v8" /></>,
  rupee: <path d="M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7" />,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" /></>,
  cursor: <path d="M5 3l14 7.5-6 1.8L10 19z" />,
};
const Sym = ({n, size = 34, color = INK, sw = 2.4}) => <Ico d={I[n]} size={size} color={color} sw={sw} />;
const Chip = ({children, color = INK, bg = '#fff', size = 30, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color, border: `3px solid ${color}`, borderRadius: 999, padding: `${size * 0.3}px ${size * 0.6}px ${size * 0.14}px`, fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>
);
const Q = ({F, t, size = 120, style = {}}) => !vis(F, t) ? null : (
  <div style={{width: size, height: size, borderRadius: size / 2, background: RED, color: '#fff', fontSize: size * 0.66, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.1, boxSizing: 'border-box',
    border: `4px solid ${INK}`, boxShadow: `5px 6px 0 ${INK}`, ...popS(F, t, 9), ...style}}>?</div>
);

// 1..6 stepper for the six steps
const Stepper = ({F, t, active = 0, y = 1250}) => (
  <Center y={y} style={up(F, t, 10, 20)}>
    <div style={{display: 'flex', alignItems: 'center', background: '#fff', border: `3px solid ${INK}`, borderRadius: 999, padding: '10px 14px', boxShadow: `5px 6px 0 ${INK}`}}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <React.Fragment key={n}>
          {n > 1 && <div style={{width: 34, borderTop: `3px ${n <= active ? 'solid' : 'dashed'} ${n <= active ? OR : FAINT}`}} />}
          <Dot n={n} size={56} color={n === active ? OR : n < active ? INK : '#fff'} style={{color: n <= active ? '#fff' : INK, border: `3px solid ${n === active ? OR : INK}`}} />
        </React.Fragment>
      ))}
    </div>
  </Center>
);

// pseudo QR code
const QR = ({size = 200, seed = 3}) => {
  const n = 21, c = size / n;
  const fin = (i, j) => [[0, 0], [0, 14], [14, 0]].some(([a, b]) => i >= a && i < a + 7 && j >= b && j < b + 7);
  const finOn = (i, j) => { for (const [a, b] of [[0, 0], [0, 14], [14, 0]]) { if (i >= a && i < a + 7 && j >= b && j < b + 7) { const u = i - a, v = j - b; return u === 0 || u === 6 || v === 0 || v === 6 || (u >= 2 && u <= 4 && v >= 2 && v <= 4); } } return false; };
  const r = (k) => { const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display: 'block'}}>
      <rect width={size} height={size} fill="#fff" />
      {Array.from({length: n * n}, (_, k) => { const i = Math.floor(k / n), j = k % n; const on = fin(i, j) ? finOn(i, j) : r(k) > 0.52; return on ? <rect key={k} x={j * c} y={i * c} width={c + 0.3} height={c + 0.3} fill={INK} /> : null; })}
    </svg>
  );
};

/* ================= scenes ================= */

/* 1. hook: 2 AM, floodlit crusher, seven dumpers roll out one by one; counter climbs to 7 */
const HK = {x: 540, y: 730, k: 40};
const DEP = Array.from({length: 7}, (_, i) => -0.75 + i * 0.5);
const hookX = (F, i) => drive(F, DEP[i], 1.9, -9.5, 9, Easing.linear);
const Hook = ({F}) => {
  const xs = DEP.map((_, i) => hookX(F, i));
  const n = xs.filter((x) => x > 3.4).length;
  const lastPass = n > 0 ? DEP[n - 1] + 1.9 * 0.62 : -9;
  const bump = 1 + 0.18 * io(F, s(lastPass), s(lastPass) + 3) * io(F, s(lastPass) + 3, s(lastPass) + 9, 1, 0);
  const [cx, cy] = at(HK, 3.6, -3.4, 4.2);
  return (
    <AbsoluteFill>
      {/* night sky over the paper: moon + stars */}
      <svg width={1080} height={600} style={abs(0, 0)}>
        {[[120, 300], [260, 210], [900, 250], [980, 380], [700, 190], [420, 330], [820, 470]].map(([x, y], i) => {
          const tw = 0.5 + 0.5 * Math.sin(F / 9 + i * 1.7);
          return <path key={i} d={`M${x} ${y - 12}L${x + 3} ${y - 3}L${x + 12} ${y}L${x + 3} ${y + 3}L${x} ${y + 12}L${x - 3} ${y + 3}L${x - 12} ${y}L${x - 3} ${y - 3}Z`} fill={INK} opacity={0.25 + 0.5 * tw} transform={`rotate(0 ${x} ${y})`} />;
        })}
      </svg>
      <div style={{...abs(520, 150)}}><svg viewBox="0 0 24 24" width={120} height={130}><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" fill={YEL} stroke={INK} strokeWidth="1.1" /></svg></div>
      <Stage {...HK}>
        <Ground x={-7} y={-6} w={14} d={12} night />
        <Road x={-7} y={2.6} w={14} d={2.6} />
        <Plant x={-3.6} y={-4.2} run={1} F={F} night />
        <Pile x={4.6} y={-3.6} r={1.5} h={2.0} seed={2} />
        <Pile x={4.8} y={-0.4} r={1.2} h={1.5} c={STONE20} seed={5} />
        <Flood x={-6.3} y={1.6} h={5.2} />
        <Flood x={5.8} y={1.6} h={5.2} />
        {xs.map((x, i) => {
          const op = Math.min(io(x, -9.5, -7.2), io(x, 5.6, 8, 1, 0));
          return op > 0 ? <Dumper key={i} x={x} y={3.05} lights load={1} op={op} /> : null;
        })}
      </Stage>
      {vis(F, K.vajta - 0.15) && <div style={{...abs(70, 210), ...popS(F, K.vajta - 0.15)}}><Tag size={40}><Sym n="clock" size={44} />रात्री 2:00</Tag></div>}
      <div style={{...abs(cx - 40, cy - 330)}}>
        <Card x={0} y={0} w={250} h={196} r={28} style={{position: 'relative', padding: '24px 30px', transform: `scale(${bump})`, transformOrigin: '50% 50%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Sym n="truck" size={40} color={ORT} /><T size={30} w={600} color={MUTE}>डंपर गेले</T></div>
          <div style={{fontSize: 104, fontWeight: 800, lineHeight: 1, marginTop: 10, color: INK, ...LAT}}>{n}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* 2. the register: only five entries; 7 left, 5 written */
const ROWS = [['MH 12 KT 4521', '20 MM', '18.2'], ['MH 12 RQ 7710', '10 MM', '17.9'], ['MH 14 GH 2093', 'क्रश सँड', '18.6'], ['MH 12 PB 6618', '20 MM', '18.1'], ['MH 42 B 3307', '10 MM', '18.4']];
const Register = ({F}) => {
  const a = sc('register');
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 250), ...up(F, a + 0.02, 10, 30)}}>
        <Card x={0} y={0} w={860} h={900} r={20} style={{position: 'relative', background: '#FFFDF6', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 90, top: 0, bottom: 0, width: 3, background: 'rgba(229,72,77,0.45)'}} />
          <div style={{padding: '40px 40px 0 120px'}}>
            <T size={46} w={700}>डिस्पॅच रजिस्टर</T>
            <T size={26} w={500} color={MUTE} style={{marginTop: 8}}>रात्रपाळी · गेट नं. 1</T>
          </div>
          <div style={{display: 'flex', padding: '30px 40px 10px 120px', fontSize: 24, fontWeight: 700, color: MUTE, letterSpacing: '0.04em'}}>
            <div style={{width: 300}}>गाडी नं.</div><div style={{width: 200}}>माल</div><div>टन</div>
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const r = ROWS[i]; const t = K.nond - 0.1 + i * 0.16;
            return (
              <div key={i} style={{position: 'relative', height: 80, borderTop: '2px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', padding: '6px 40px 0 120px'}}>
                <div style={{...abs(40, 22), fontSize: 26, fontWeight: 600, color: MUTE}}>{i + 1}</div>
                {r && vis(F, t) && <div style={{display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 600, color: '#1D3A8A', opacity: io(F, s(t), s(t) + 4), ...LAT}}>
                  <div style={{width: 300}}>{r[0]}</div><div style={{width: 200}}>{r[1]}</div><div>{r[2]}</div>
                </div>}
                {!r && vis(F, K.paach + 0.25) && <div style={{fontSize: 30, fontWeight: 700, color: RED, opacity: io(F, s(K.paach + 0.25), s(K.paach + 0.25) + 5)}}>— नोंद नाही —</div>}
              </div>
            );
          })}
        </Card>
      </div>
      {vis(F, K.paach) && <div style={{...abs(700, 210), ...popS(F, K.paach, 9)}}>
        <div style={{width: 190, height: 190, borderRadius: 95, background: '#fff', border: `5px solid ${RED}`, boxShadow: `6px 7px 0 ${RED}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 100, fontWeight: 800, color: RED, lineHeight: 0.9, marginTop: 14}}>5</div>
          <T size={26} w={600} color={RED}>नोंदी</T>
        </div>
      </div>}
      <Center y={1200} style={up(F, K.phakt, 10, 20)}>
        <div style={{display: 'flex', gap: 24}}>
          <Chip size={34}><Sym n="truck" size={36} />गेले 7</Chip>
          <Chip size={34} color={RED}><Sym n="doc" size={36} color={RED} />लिहिले 5</Chip>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* 3. two dumpers missing -> ₹1 lakh+ of material */
const MS = {x: 560, y: 700, k: 46};
const Missing = ({F}) => {
  const a = sc('missing');
  const x1 = drive(F, a, 4.5, -2.5, 2.2, Easing.out(Easing.quad)), x2 = drive(F, a, 4.5, -7.5, -2.8, Easing.out(Easing.quad));
  const [q1x, q1y] = at(MS, x1 + 2.2, 2.6, 4.2), [q2x, q2y] = at(MS, x2 + 2.2, 2.6, 4.2);
  const money = io(F, s(K.lakh) - 2, s(K.lakh) + 22, 0, 100000, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage {...MS}>
        <Ground x={-6} y={-3} w={12} d={9} night />
        <Road x={-6} y={1.4} w={12} d={2.8} />
        <Flood x={-5.2} y={-2.2} h={5} />
        <Dumper x={x2} y={2.0} ghost op={0.85} />
        <Dumper x={x1} y={2.0} ghost op={0.85} />
      </Stage>
      <div style={{...abs(q2x - 60, q2y - 150)}}><Q F={F} t={K.don} /></div>
      <div style={{...abs(q1x - 60, q1y - 150)}}><Q F={F} t={K.don + 0.15} /></div>
      {vis(F, K.lakh - 0.1) && <Center y={1030} style={popS(F, K.lakh - 0.1, 11)}>
        <div style={{background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '24px 46px 16px', boxShadow: `9px 11px 0 ${RED}`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <T size={30} w={600} color={MUTE}>2 डंपर × 18 टन = 36 टन माल</T>
          <div style={{fontSize: 104, fontWeight: 800, color: RED, lineHeight: 1.05, marginTop: 6, ...LAT}}>₹ {fmt(money)}+</div>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

/* 4. one trip ≈ 18 tonnes: the bed fills with stone */
const TS = {x: 500, y: 820, k: 74};
const Ton = ({F}) => {
  const a = sc('ton');
  const load = io(F, s(a) + 4, s(K.ton18) + 2, 0.05, 1, Easing.out(Easing.cubic));
  const [tx, ty] = at(TS, 1.6, -0.6, 3.4);
  return (
    <AbsoluteFill>
      <Stage {...TS}>
        <Ground x={-4.5} y={-3.5} w={9} d={7} />
        <Pile x={-2.4} y={-2.2} r={1.4} h={1.8} seed={3} />
        <Dumper x={-2.0} y={-0.4} load={load} />
      </Stage>
      {/* falling stones into the bed */}
      {Array.from({length: 10}, (_, i) => {
        const t0 = a + 0.1 + i * 0.12, p = io(F, s(t0), s(t0) + 10, 0, 1, Easing.in(Easing.quad));
        const [bx, by] = at(TS, -1.2 + (i % 4) * 0.5, 0.4 + (i % 3) * 0.3, 2.3);
        return p > 0 && p < 1 ? <div key={i} style={{...abs(bx, by - 260 + p * 260), width: 22, height: 18, borderRadius: 6, background: i % 2 ? STONE20 : STONE10, border: `2px solid ${INK}`}} /> : null;
      })}
      {vis(F, K.ton18 - 0.1) && <div style={{...abs(tx - 40, ty - 300), ...popS(F, K.ton18 - 0.1)}}>
        <div style={{background: '#fff', border: `4px solid ${INK}`, borderRadius: 26, padding: '18px 34px 10px', boxShadow: `8px 9px 0 ${OR}`}}>
          <T size={28} w={600} color={MUTE}>एक ट्रिप</T>
          <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1, ...LAT}}>≈ 18 <span style={{fontSize: 52}}>टन</span></div>
        </div>
      </div>}
    </AbsoluteFill>
  );
};

/* 5. three records, three different numbers */
const Slip = ({F, t, x, y, rot, title, icon, lines, big, bad, bg = '#fff', w = 400, h = 520, children}) => !vis(F, t) ? null : (
  <div style={{...abs(x, y), transform: `rotate(${rot}deg) translateX(${shake(F, K.julat, 0.6)}px)`, ...popS(F, t, 11)}}>
    <Card x={0} y={0} w={w} h={h} r={18} style={{position: 'relative', background: bg, padding: '30px 30px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Sym n={icon} size={38} color={ORT} /><T size={34} w={700}>{title}</T></div>
      <div style={{height: 3, background: INK, width: 70, margin: '18px 0 20px'}} />
      {lines.map((l) => <T key={l} size={26} w={500} color={MUTE} style={{marginTop: 8}}>{l}</T>)}
      <div style={{marginTop: 26, display: 'inline-block', position: 'relative'}}>
        <div style={{fontSize: 74, fontWeight: 800, ...LAT, color: bad ? RED : INK, transition: 'none'}}>{big}</div>
        {bad && <svg width={w - 80} height={110} style={{...abs(-24, -14), overflow: 'visible'}}><ellipse cx={(w - 80) / 2 - 10} cy={56} rx={(w - 80) / 2 - 20} ry={50} fill="none" stroke={RED} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - io(F, s(K.julat), s(K.julat) + 10)} /></svg>}
      </div>
      {children}
    </Card>
  </div>
);
const Papers = ({F}) => {
  const bad = vis(F, K.julat);
  return (
    <AbsoluteFill>
      <Slip F={F} t={K.kata - 0.1} x={70} y={300} rot={-6} title="काटा पावती" icon="scale" lines={['MH 12 KT 4521', 'नेट वजन']} big="18.24 T" bad={bad} />
      <Slip F={F} t={K.reg9 - 0.1} x={340} y={500} rot={3} title="रजिस्टर" icon="doc" lines={['MH 12 KT 4521', 'नोंद']} big="17.5 T" bad={bad} bg="#FFFDF6" />
      <Slip F={F} t={K.diary - 0.1} x={610} y={330} rot={8} title="मुन्शी डायरी" icon="user" lines={['KT 4521', 'हाताने लिहिलं']} big="19 T" bad={bad} bg="#FFF6D6" w={390} />
      {bad && <Center y={1150} style={popS(F, K.julat, 10)}><Chip size={40} color={RED}><Sym n="x" size={40} color={RED} sw={3} />18.24 ≠ 17.5 ≠ 19</Chip></Center>}
    </AbsoluteFill>
  );
};

/* 6. royalty / transit pass says one thing, the truck carries another */
const PS = {x: 650, y: 900, k: 52};
const Pass = ({F}) => {
  const a = sc('pass');
  const [wx, wy] = at(PS, 1.2, -0.4, 3.6);
  return (
    <AbsoluteFill>
      <Stage {...PS}>
        <Ground x={-3.5} y={-3} w={8} d={6} />
        <Road x={-3.5} y={-1.1} w={8} d={2.6} />
        <Dumper x={-2.4} y={-0.6} load={1} />
      </Stage>
      <div style={{...abs(60, 260), transform: 'rotate(-4deg)', ...up(F, K.royalty - 0.1, 10, 40)}}>
        <Card x={0} y={0} w={470} h={600} r={16} style={{position: 'relative', background: '#F4FBF3', overflow: 'hidden'}}>
          <div style={{background: '#125C3B', color: '#fff', padding: '20px 28px 12px'}}>
            <T size={24} w={600} color="rgba(255,255,255,0.8)" style={{letterSpacing: '0.06em'}}>ROYALTY / TRANSIT PASS</T>
            <T size={34} w={700} color="#fff" style={{marginTop: 4}}>वाहतूक पास</T>
          </div>
          <div style={{padding: '22px 28px'}}>
            {[['पास नं.', 'TP-0458721'], ['गाडी', 'MH 12 KT 4521'], ['माल', '20 MM खडी']].map(([k, v]) => (
              <div key={k} style={{display: 'flex', justifyContent: 'space-between', borderBottom: `2px dashed ${FAINT}`, padding: '12px 0 6px'}}><T size={26} w={500} color={MUTE}>{k}</T><T size={28} w={700}>{v}</T></div>
            ))}
            <T size={26} w={500} color={MUTE} style={{marginTop: 22}}>मंजूर वजन</T>
            <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1, ...LAT, color: vis(F, K.gadit) ? RED : INK}}>15 T</div>
          </div>
        </Card>
      </div>
      {vis(F, K.gadit - 0.1) && <div style={{...abs(wx - 50, wy - 250), ...popS(F, K.gadit - 0.1)}}>
        <div style={{background: '#fff', border: `4px solid ${RED}`, borderRadius: 24, padding: '14px 28px 6px', boxShadow: `7px 8px 0 ${RED}`}}>
          <T size={26} w={600} color={MUTE}>गाडीत</T>
          <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1, color: RED, ...LAT}}>24 T</div>
        </div>
      </div>}
      {vis(F, K.gadit + 0.2) && <div style={{...abs(470, 560), ...popS(F, K.gadit + 0.2)}}><Dot n="≠" size={110} color={RED} style={{fontSize: 80, border: `4px solid ${INK}`}} /></div>}
    </AbsoluteFill>
  );
};

/* 7. checking: barricade, beacon, truck seized, fine */
const CK = {x: 540, y: 760, k: 50};
const Check = ({F}) => {
  const a = sc('check');
  const x = drive(F, a, 1.6, -7, -3.4, Easing.out(Easing.cubic));
  const [sx, sy] = at(CK, x + 2, 1.2, 3.2);
  return (
    <AbsoluteFill>
      <Stage {...CK}>
        <Ground x={-5.5} y={-4} w={11} d={8} />
        <Road x={-5.5} y={-0.8} w={11} d={2.8} />
        <Beacon x={1.8} y={-1.8} F={F} />
        <Person x={2.4} y={-1.5} c="#C9A66B" head="#6B4226" hat="#2B3A67" />
        <Person x={3.2} y={-1.9} c="#C9A66B" head="#7A4B2C" hat="#2B3A67" />
        <Dumper x={x} y={-0.4} load={1} />
        <Barricade x={1.6} y={-0.6} w={3} />
        <Barricade x={1.6} y={2.4} w={3} />
      </Stage>
      <div style={{...abs(sx - 150, sy - 120)}}><Stamp F={F} t={K.japt} size={84} rot={-12}>जप्त</Stamp></div>
      {vis(F, K.danda - 0.15) && <Center y={1000} style={popS(F, K.danda - 0.15, 10)}>
        <Card x={0} y={0} w={620} h={220} r={26} style={{position: 'relative', padding: '26px 34px', boxShadow: `9px 11px 0 ${RED}`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <T size={32} w={700}>ई-चलन</T><Chip size={26} color={RED}>ओव्हरलोड</Chip>
          </div>
          <T size={26} w={500} color={MUTE} style={{marginTop: 10}}>MH 12 KT 4521 · पास 15 T · गाडीत 24 T</T>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}><Sym n="rupee" size={46} color={RED} sw={2.8} /><T size={54} w={800} color={RED}>दंड</T></div>
        </Card>
      </Center>}
    </AbsoluteFill>
  );
};

/* 8. stock: three piles, nobody knows how much */
const SS = {x: 540, y: 820, k: 52};
const PILES = [[-3.6, -2.4, STONE10, '10 MM', 'mm10', 2.2], [1.2, -4.4, STONE20, '20 MM', 'mm20', 2.4], [2.6, 1.6, SANDC, 'क्रश सँड', 'sand', 1.8]];
const Stock = ({F}) => {
  const a = sc('stock');
  const g = (k) => io(F, s(k) - 4, s(k) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  const breathe = (i) => 1 + (vis(F, K.banle) ? 0.06 * Math.sin((F - s(K.banle)) / 6 + i * 2) : 0);
  return (
    <AbsoluteFill>
      <Stage {...SS}>
        <Ground x={-6} y={-6} w={12} d={10} />
        {PILES.map(([x, y, c, , k, h], i) => <Pile key={k} x={x} y={y} r={1.9} h={h * breathe(i)} c={c} seed={i + 3} grow={Math.max(g(K[k]), F < s(a) + 2 ? 0 : 0)} />)}
        <Person x={-1.2} y={2.6} c={OR} head="#6B4226" hat={YEL} />
      </Stage>
      {PILES.map(([x, y, , l, k, h]) => {
        const [px, py] = at(SS, x, y, h + 0.3);
        return vis(F, K[k]) ? <div key={k} style={{...abs(px - 160, py - 90), width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, ...popS(F, K[k])}}>
          <Plate size={32} color={INK}>{l}</Plate>
          {vis(F, K.dhig) && <div style={popS(F, K.dhig + 0.1)}><Chip size={30} color={RED}>? टन</Chip></div>}
        </div> : null;
      })}
      {vis(F, K.kona) && <Center y={1180} style={popS(F, K.kona)}><Chip size={36}><Sym n="box" size={38} />बनले ? · विकले ? · शिल्लक ?</Chip></Center>}
    </AbsoluteFill>
  );
};

/* 9. credit stuck with contractors */
const PARTY = [['पाटील कन्स्ट्रक्शन', '₹ 3,40,000', '62 दिवस'], ['श्री बिल्डर्स', '₹ 2,15,000', '48 दिवस'], ['ओम इन्फ्रा', '₹ 1,80,000', '35 दिवस']];
const Udhari = ({F}) => {
  const a = sc('udhari');
  const total = io(F, s(K.udhari) - 2, s(K.udhari) + 20, 0, 735000, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 280), ...up(F, a + 0.02, 10, 30)}}>
        <Card x={0} y={0} w={860} h={540} r={26} style={{position: 'relative', padding: '34px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><Sym n="user" size={40} color={ORT} /><T size={38} w={700}>कॉन्ट्रॅक्टर्सकडे उधारी</T></div>
          {PARTY.map(([n, amt, d], i) => {
            const t = K.contr + 0.1 + i * 0.22;
            return (
              <div key={n} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, ...up(F, t, 8, 20)}}>
                <div style={{width: 76, height: 76, borderRadius: 38, background: [OR, TEAL, BLUE][i], color: '#fff', fontSize: 34, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', border: `3px solid ${INK}`}}>{n[0]}</div>
                <div style={{flex: 1}}><T size={34} w={600}>{n}</T><T size={24} w={500} color={MUTE} style={{marginTop: 4}}>बाकी · {d}</T></div>
                <T size={38} w={800} color={RED}>{amt}</T>
              </div>
            );
          })}
        </Card>
      </div>
      {vis(F, K.udhari - 0.1) && <Center y={920} style={popS(F, K.udhari - 0.1, 11)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '22px 40px 14px', boxShadow: `9px 11px 0 ${RED}`}}>
          <div style={{transform: `rotate(${shake(F, K.adkleli, 0.5)}deg)`}}><Sym n="lock" size={74} color={RED} sw={2.6} /></div>
          <div><T size={28} w={600} color={MUTE}>अडकलेले पैसे</T><div style={{fontSize: 86, fontWeight: 800, color: RED, lineHeight: 1.05, ...LAT}}>₹ {fmt(total)}</div></div>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

/* 10. the software: an app window rises over the plant; six modules = six steps */
const SW = {x: 540, y: 1000, k: 34};
const MODS = [['scale', 'वजन काटा'], ['doc', 'पावती · चलन'], ['qr', 'QR गेट'], ['box', 'लाईव्ह स्टॉक'], ['pin', 'GPS · OTP'], ['rupee', 'उधारी']];
const Soft = ({F}) => {
  const a = sc('soft');
  const rise = io(F, s(K.software) - 6, s(K.software) + 12, 0, 1, Easing.out(Easing.back(1.2)));
  return (
    <AbsoluteFill>
      <Stage {...SW} style={{opacity: 0.95}}>
        <Ground x={-8} y={-5} w={16} d={10} />
        <Plant x={-4} y={-3.4} run={1} F={F} />
        <Pile x={5} y={-3} r={1.4} h={1.8} seed={6} />
        <Road x={-8} y={2.2} w={16} d={2.4} />
        <Dumper x={drive(F, a, 6, -7, 4, Easing.linear)} y={2.55} load={1} />
      </Stage>
      {vis(F, a + 0.05) && <div style={{...abs(800, 230), ...popS(F, a + 0.05)}}><svg viewBox="0 0 24 24" width={120} height={120}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill={YEL} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" /></svg></div>}
      {rise > 0 && <div style={{...abs(130, 260 + (1 - rise) * 120), opacity: Math.min(1, rise * 1.4)}}>
        <Card x={0} y={0} w={820} h={560} r={26} style={{position: 'relative', overflow: 'hidden'}}>
          <div style={{height: 78, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', background: OR}}>
            <Mark size={40} color="#fff" /><T size={34} w={700} color="#fff">क्रशर डिस्पॅच</T>
            <div style={{flex: 1}} /><Chip size={22} color={INK} bg="#fff">LIVE</Chip>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, padding: 30}}>
            {MODS.map(([ic, l], i) => {
              const t = (i < 3 ? K.crusher26 : K.dispatch) + (i % 3) * 0.12;
              return (
                <div key={l} style={{height: 180, border: `3px solid ${INK}`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: vis(F, K.steps6) ? '#FFF4EA' : '#fff', ...popS(F, t)}}>
                  <div style={{position: 'relative'}}><Sym n={ic} size={62} color={ORT} />{vis(F, K.steps6) && <Dot n={i + 1} size={38} color={INK} style={{...abs(48, -20), fontSize: 22, ...popS(F, K.steps6 + i * 0.08)}} />}</div>
                  <T size={28} w={600}>{l}</T>
                </div>
              );
            })}
          </div>
        </Card>
      </div>}
      <Stepper F={F} t={K.steps6} active={0} y={1230} />
    </AbsoluteFill>
  );
};

/* 11. step 1: dumper on the weighbridge; weight + number + photo saved */
const W1 = {x: 560, y: 640, k: 50};
const S1 = ({F}) => {
  const a = sc('s1');
  const x = drive(F, a, Math.max(0.6, K.katyavar - a + 0.4), -9, -2.4, Easing.out(Easing.cubic));
  const kg = io(F, s(K.vajan) - 3, s(K.vajan) + 14, 0, 18240, Easing.out(Easing.cubic));
  const flash = vis(F, K.photo) ? io(F, s(K.photo), s(K.photo) + 8, 1, 0) : 0;
  const [dx, dy] = at(W1, -0.4, -3.8, 2.6);
  const [cx, cy] = at(W1, 3.8, -2.2, 3.1);
  return (
    <AbsoluteFill>
      <Stage {...W1}>
        <Ground x={-5.5} y={-5} w={11} d={9} />
        <Road x={-5.5} y={-1.3} w={11} d={2.8} dash={false} />
        <Weighbridge x={-3} y={-1.2} w={6} d={2.6} />
        <Cabin x={-1.4} y={-4.2} />
        <Box x={3.75} y={-2.25} w={0.14} d={0.14} h={3} c="#4A5060" />
        <g transform={`translate(0 ${vis(F, K.katyavar) && F < s(K.katyavar) + 6 ? 0.05 : 0})`}><Dumper x={x} y={-0.75} load={1} /></g>
      </Stage>
      {/* weight display on the cabin */}
      {vis(F, K.katyavar - 0.2) && <div style={{...abs(dx - 150, dy - 170), ...popS(F, K.katyavar - 0.2)}}>
        <div style={{background: '#111', border: `4px solid ${INK}`, borderRadius: 16, padding: '12px 22px 6px', boxShadow: `6px 7px 0 ${OR}`}}>
          <div style={{fontFamily: 'monospace', fontSize: 62, fontWeight: 700, color: '#FF8A3D', letterSpacing: '0.04em'}}>{(kg / 1000).toFixed(2)} T</div>
        </div>
      </div>}
      {/* camera */}
      <div style={{...abs(cx - 48, cy - 90)}}>
        <div style={{position: 'relative', width: 96, height: 96, borderRadius: 22, background: '#fff', border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `5px 6px 0 ${INK}`}}>
          <Sym n="cam" size={58} />
          {flash > 0 && <div style={{...abs(-60, -60), width: 216, height: 216, borderRadius: 108, background: `radial-gradient(circle, rgba(255,240,170,${flash}) 0%, rgba(255,240,170,0) 70%)`}} />}
        </div>
      </div>
      {/* saved record */}
      {vis(F, K.save - 0.1) && <div style={{...abs(110, 930), ...up(F, K.save - 0.1, 9, 30)}}>
        <Card x={0} y={0} w={860} h={230} r={24} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px'}}>
          <div style={{width: 210, height: 160, borderRadius: 16, border: `3px solid ${INK}`, background: '#DCE7EF', overflow: 'hidden', position: 'relative', opacity: vis(F, K.photo) ? 1 : 0.25}}>
            <svg width={210} height={160} viewBox="-3.4 -3.2 6.8 5.2"><Dumper x={-2.6} y={-0.9} load={1} /></svg>
            {vis(F, K.photo) && <div style={{...abs(8, 8), ...popS(F, K.photo)}}><Chip size={18} color="#fff" bg={INK}>PHOTO</Chip></div>}
          </div>
          <div style={{flex: 1}}>
            <div style={{display: 'inline-block', border: `3px solid ${INK}`, borderRadius: 8, padding: '8px 14px 2px', background: '#FFE27A', opacity: vis(F, K.number) ? 1 : 0.2, ...(vis(F, K.number) ? popS(F, K.number) : {})}}><T size={34} w={700}>MH 12 KT 4521</T></div>
            <T size={54} w={800} style={{marginTop: 12}}>18.24 टन</T>
          </div>
          <div style={popS(F, K.save)}><Chip size={30} color="#fff" bg={GRN} style={{borderColor: GRN}}><Sym n="check" size={34} color="#fff" sw={3} />सेव्ह</Chip></div>
        </Card>
      </div>}
      <Stepper F={F} t={a} active={1} y={1225} />
    </AbsoluteFill>
  );
};

/* 12. step 2: one click -> weighbridge slip, challan, bill/pass */
const DOCS = [['काटा पावती', 'scale', 'pavti', -9, 90], ['चलन', 'doc', 'chalan', 0, 380], ['बिल · पास', 'rupee', 'bill', 9, 670]];
const S2 = ({F}) => {
  const a = sc('s2');
  const cur = io(F, s(a) + 2, s(K.click) - 2, 0, 1, ease);
  const press = vis(F, K.click) && F < s(K.click) + 6;
  return (
    <AbsoluteFill>
      <div style={{...abs(170, 230), ...up(F, a + 0.02, 10, 20)}}>
        <Card x={0} y={0} w={740} h={330} r={26} style={{position: 'relative', padding: '28px 34px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><T size={32} w={700}>ट्रिप #1048</T><Chip size={22} color={GRN}>वजन ✓</Chip></div>
          <T size={26} w={500} color={MUTE} style={{marginTop: 10}}>MH 12 KT 4521 · 20 MM · 18.24 टन · पाटील कन्स्ट्रक्शन</T>
          <div style={{marginTop: 34, height: 96, borderRadius: 20, background: OR, border: `3px solid ${INK}`, boxShadow: press ? 'none' : `5px 6px 0 ${INK}`, transform: press ? 'translate(5px,6px)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
            <Sym n="doc" size={42} color="#fff" /><T size={40} w={700} color="#fff">सगळे पेपर्स तयार करा</T>
          </div>
        </Card>
      </div>
      {/* cursor */}
      <div style={{...abs(860 - cur * 300, 700 - cur * 210), transform: `scale(${press ? 0.85 : 1})`}}>
        <svg viewBox="0 0 24 24" width={74} height={74}><path d={'M5 3l14 7.5-6 1.8L10 19z'} fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" /></svg>
        {vis(F, K.click) && <div style={{...abs(-40, -40), width: 90, height: 90, borderRadius: 45, border: `4px solid ${OR}`, opacity: io(F, s(K.click), s(K.click) + 12, 1, 0), transform: `scale(${io(F, s(K.click), s(K.click) + 12, 0.3, 1.4)})`}} />}
      </div>
      {DOCS.map(([l, ic, k, rot, x]) => vis(F, K[k] - 0.1) && (
        <div key={k} style={{...abs(x, 640), transform: `rotate(${rot * io(F, s(K[k]) - 3, s(K[k]) + 10)}deg) translateY(${io(F, s(K[k]) - 3, s(K[k]) + 10, -220, 0, Easing.out(Easing.back(1.3)))}px)`, opacity: io(F, s(K[k]) - 3, s(K[k]) + 3)}}>
          <Card x={0} y={0} w={300} h={400} r={16} style={{position: 'relative', padding: '26px 26px'}}>
            <Sym n={ic} size={50} color={ORT} />
            <T size={34} w={700} style={{marginTop: 14}}>{l}</T>
            {[200, 160, 210, 120].map((wd, i) => <div key={i} style={{height: 12, width: wd, borderRadius: 6, background: '#E7E3DA', marginTop: 20}} />)}
            {vis(F, K.tayar) && <div style={{...abs(170, 300), ...popS(F, K.tayar + DOCS.findIndex((d) => d[2] === k) * 0.1)}}><Dot n="✓" size={84} color={GRN} style={{fontSize: 48, border: `3px solid ${INK}`}} /></div>}
          </Card>
        </div>
      ))}
      <Stepper F={F} t={a} active={2} y={1225} />
    </AbsoluteFill>
  );
};

/* 13. step 3: QR scan at the gate; no slip, no exit */
const G3 = {x: 520, y: 780, k: 52};
const S3 = ({F}) => {
  const a = sc('s3');
  const scanned = vis(F, K.qr + 0.5);
  const open = scanned ? io(F, s(K.qr + 0.5), s(K.qr + 0.5) + 12, 0, 1, ease) * io(F, s(K.ekhi) - 7, s(K.ekhi) + 2, 1, 0) : 0;
  const x1 = F < s(K.qr + 0.6) ? drive(F, a, 1.2, -9, -3.6, Easing.out(Easing.cubic)) : drive(F, K.qr + 0.6, 1.3, -3.6, 8, Easing.in(Easing.quad));
  const x2 = drive(F, K.ekhi - 0.9, 1.0, -10, -4.2, Easing.out(Easing.cubic));
  const [gx, gy] = at(G3, 0.7, -1.9, 2.4);
  const [bx, by] = at(G3, x2 + 2.6, 0.2, 3.4);
  const scanY = (F % 24) / 24;
  return (
    <AbsoluteFill>
      <Stage {...G3}>
        <Ground x={-6} y={-4} w={12} d={8} />
        <Road x={-6} y={-1.3} w={12} d={3} />
        <Cabin x={-0.6} y={-4.2} w={1.6} d={1.4} h={1.7} />
        {x1 > -9 && x1 < 8 && <Dumper x={x1} y={-0.9} load={1} op={io(x1, 4.5, 7, 1, 0)} />}
        {vis(F, K.ekhi - 0.9) && <Dumper x={x2} y={-0.9} load={1} />}
        <Gate x={0.8} y={-1.9} open={open} len={3.5} />
      </Stage>
      {/* slip with QR + scanner */}
      {vis(F, K.gate - 0.1) && F < s(K.pavtishivay) && <div style={{...abs(700, 200), ...popS(F, K.gate - 0.1)}}>
        <Card x={0} y={0} w={280} h={360} r={20} style={{position: 'relative', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <T size={26} w={700}>पावती #1048</T>
          <div style={{position: 'relative', marginTop: 14, border: `3px solid ${INK}`, padding: 8, borderRadius: 10}}>
            <QR size={196} />
            {vis(F, K.qr) && !scanned && <div style={{...abs(0, 8 + scanY * 196), width: '100%', height: 5, background: OR, boxShadow: `0 0 14px ${OR}`}} />}
          </div>
          {scanned && <div style={{marginTop: 14, ...popS(F, K.qr + 0.5)}}><Chip size={26} color="#fff" bg={GRN} style={{borderColor: GRN}}><Sym n="check" size={28} color="#fff" sw={3} />स्कॅन OK</Chip></div>}
        </Card>
      </div>}
      {vis(F, K.ekhi) && <div style={{...abs(bx - 60, by - 280), ...popS(F, K.ekhi)}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
          <Dot n="✕" size={110} color={RED} style={{fontSize: 64, border: `4px solid ${INK}`, boxShadow: `5px 6px 0 ${INK}`}} />
          <Chip size={30} color={RED}>पावती नाही</Chip>
        </div>
      </div>}
      <Stepper F={F} t={a} active={3} y={1225} />
    </AbsoluteFill>
  );
};

/* 14. step 4: live stock on screen */
const L4 = {x: 540, y: 600, k: 40};
const STK = [['10 MM', STONE10, 428, -3.6, -2.4], ['20 MM', STONE20, 316, 0.2, -3.6], ['क्रश सँड', SANDC, 184, 1.9, 0.4]];
const S4 = ({F}) => {
  const a = sc('s4');
  const live = vis(F, K.live);
  const tick = (i) => (live ? Math.floor((F - s(K.live)) / 22) * (i === 1 ? 1 : 2) : 0);
  return (
    <AbsoluteFill>
      <Stage {...L4}>
        <Ground x={-6} y={-6} w={12} d={9} />
        {STK.map(([l, c, , x, y], i) => <Pile key={l} x={x} y={y} r={1.8} h={2 - i * 0.2} c={c} seed={i + 9} />)}
        <Dumper x={drive(F, a, 5, -6, 3, Easing.linear)} y={1.2} load={1} />
      </Stage>
      <div style={{...abs(110, 860), ...up(F, K.live - 0.1, 10, 30)}}>
        <Card x={0} y={0} w={860} h={330} r={26} style={{position: 'relative', padding: '24px 34px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <T size={32} w={700}>शिल्लक स्टॉक</T>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto'}}><div style={{width: 16, height: 16, borderRadius: 8, background: RED, opacity: 0.4 + 0.6 * Math.abs(Math.sin(F / 8))}} /><T size={24} w={700} color={RED}>LIVE</T></div>
          </div>
          {STK.map(([l, c, tons], i) => {
            const t = K.konatya + i * 0.2; const p = io(F, s(t), s(t) + 16, 0, 1, Easing.out(Easing.cubic));
            const v = Math.round(tons * p) - tick(i);
            return (
              <div key={l} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 22}}>
                <T size={28} w={600} style={{width: 150}}>{l}</T>
                <div style={{flex: 1, height: 34, borderRadius: 17, border: `3px solid ${INK}`, overflow: 'hidden', background: '#F3F0E8'}}><div style={{height: '100%', width: `${(v / 450) * 100}%`, background: [OR, OR2, '#E4B46F'][i]}} /></div>
                <T size={32} w={800} style={{width: 130, textAlign: 'right'}}>{Math.max(0, v)} T</T>
              </div>
            );
          })}
        </Card>
      </div>
      <Stepper F={F} t={a} active={4} y={1225} />
    </AbsoluteFill>
  );
};

/* 15. step 5: driver's phone -> live location -> OTP at site */
const ROUTE = [[90, 560], [90, 430], [250, 430], [250, 250], [420, 250], [420, 110]];
const along = (p) => {
  const segs = ROUTE.slice(1).map((q, i) => Math.hypot(q[0] - ROUTE[i][0], q[1] - ROUTE[i][1]));
  let d = p * segs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const t = d / segs[i]; return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * t, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * t]; } d -= segs[i]; }
  return ROUTE[ROUTE.length - 1];
};
const S5 = ({F}) => {
  const a = sc('s5');
  const p = io(F, s(K.location), s(K.otp) - 4, 0, 1, Easing.inOut(Easing.quad));
  const [tx, ty] = along(p);
  const otp = '4827';
  const nOtp = Math.round(io(F, s(K.otp), s(K.otp) + 14, 0, 4, Easing.linear));
  const ok = vis(F, K.confirm);
  return (
    <AbsoluteFill>
      <div style={{...abs(140, 220), ...up(F, a + 0.02, 10, 30)}}>
        <div style={{width: 520, height: 960, borderRadius: 64, background: INK, padding: 18, boxSizing: 'border-box', boxShadow: `12px 14px 0 rgba(20,20,20,0.18)`}}>
          <div style={{width: '100%', height: '100%', borderRadius: 48, background: '#F2EEE4', overflow: 'hidden', position: 'relative'}}>
            <div style={{padding: '40px 30px 18px', background: '#fff', borderBottom: `3px solid ${INK}`}}>
              <T size={24} w={600} color={MUTE}>ड्रायव्हर ॲप</T>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6}}><T size={32} w={700}>MH 12 KT 4521</T>{vis(F, K.location) && <div style={{width: 14, height: 14, borderRadius: 7, background: GRN, marginLeft: 8, opacity: 0.4 + 0.6 * Math.abs(Math.sin(F / 8))}} />}</div>
            </div>
            <svg width={484} height={620} style={{display: 'block'}}>
              {[[0, 160, 484, 22], [0, 400, 484, 26], [140, 0, 20, 620], [330, 0, 24, 620]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#fff" />)}
              {[[20, 20, 100, 120, '#D3E2B6'], [180, 30, 130, 110, '#E9DBB8'], [370, 190, 100, 190, '#D3E2B6'], [20, 450, 100, 140, '#E9DBB8']].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={12} fill={c} />)}
              <polyline points={ROUTE.map((q) => q.join(',')).join(' ')} fill="none" stroke={OR} strokeWidth={9} strokeDasharray="18 12" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={90} cy={560} r={16} fill={INK} />
              <g transform="translate(420 92)"><path d="M0 22s-22-18-22-34a22 22 0 0 1 44 0C22 4 0 22 0 22z" fill={RED} stroke={INK} strokeWidth="3" /><circle cx="0" cy="-12" r="8" fill="#fff" /></g>
              {vis(F, K.location) && <g transform={`translate(${tx} ${ty})`}><circle r={30} fill={BLUE} opacity={0.2 + 0.1 * Math.sin(F / 5)} /><circle r={16} fill={BLUE} stroke="#fff" strokeWidth={5} /></g>}
            </svg>
            <div style={{...abs(28, 120 + 620 - 10), right: 28}} />
          </div>
        </div>
      </div>
      {vis(F, K.site - 0.1) && <div style={{...abs(560, 470), ...popS(F, K.site - 0.1)}}><Chip size={28}><Sym n="pin" size={30} color={RED} />साईट · बाणेर</Chip></div>}
      {vis(F, K.otp - 0.2) && <div style={{...abs(520, 650), ...up(F, K.otp - 0.2, 10, 30)}}>
        <Card x={0} y={0} w={460} h={360} r={28} style={{position: 'relative', padding: '28px 30px', boxShadow: `9px 11px 0 ${ok ? GRN : INK}`}}>
          <T size={28} w={600} color={MUTE}>साईटवर OTP</T>
          <div style={{display: 'flex', gap: 14, marginTop: 18}}>
            {otp.split('').map((d, i) => <div key={i} style={{width: 84, height: 100, borderRadius: 16, border: `3px solid ${i < nOtp ? INK : FAINT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 800, paddingTop: 8, boxSizing: 'border-box'}}>{i < nOtp ? d : ''}</div>)}
          </div>
          {ok && <div style={{marginTop: 26, ...popS(F, K.confirm)}}><Chip size={30} color="#fff" bg={GRN} style={{borderColor: GRN}}><Sym n="check" size={32} color="#fff" sw={3} />डिलिव्हरी कन्फर्म</Chip></div>}
        </Card>
      </div>}
      <Stepper F={F} t={a} active={5} y={1225} />
    </AbsoluteFill>
  );
};

/* 16. step 6: rate, credit limit, automatic WhatsApp reminder */
const S6 = ({F}) => {
  const a = sc('s6');
  const used = io(F, s(K.limit), s(K.limit) + 18, 0, 0.84, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 230), ...up(F, a + 0.02, 10, 30)}}>
        <Card x={0} y={0} w={860} h={470} r={26} style={{position: 'relative', padding: '30px 36px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: 84, height: 84, borderRadius: 42, background: OR, color: '#fff', fontSize: 40, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', border: `3px solid ${INK}`}}>पा</div>
            <div><T size={38} w={700}>पाटील कन्स्ट्रक्शन</T><T size={24} w={500} color={MUTE} style={{marginTop: 4}}>पार्टी · कोथरूड साईट</T></div>
          </div>
          <div style={{display: 'flex', gap: 20, marginTop: 30, ...up(F, K.rate - 0.1, 8, 20)}}>
            {[['20 MM', '₹ 950/टन'], ['10 MM', '₹ 1,020/टन'], ['क्रश सँड', '₹ 1,150/टन']].map(([k, v]) => (
              <div key={k} style={{flex: 1, border: `3px solid ${INK}`, borderRadius: 18, padding: '16px 18px 10px'}}><T size={24} w={600} color={MUTE}>{k}</T><T size={32} w={800} style={{marginTop: 4}}>{v}</T></div>
            ))}
          </div>
          <div style={{marginTop: 30, ...up(F, K.limit - 0.1, 8, 20)}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}><T size={28} w={600}>उधारी लिमिट</T><T size={28} w={800} color={used > 0.8 ? RED : INK}>₹ {fmt(500000 * used)} / ₹ 5,00,000</T></div>
            <div style={{height: 36, borderRadius: 18, border: `3px solid ${INK}`, marginTop: 12, overflow: 'hidden', background: '#F3F0E8'}}><div style={{height: '100%', width: `${used * 100}%`, background: used > 0.8 ? RED : OR}} /></div>
          </div>
        </Card>
      </div>
      {vis(F, K.whatsapp - 0.1) && <div style={{...abs(110, 770), ...up(F, K.whatsapp - 0.1, 10, 30)}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 20}}>
          <Card x={0} y={0} w={120} h={120} r={30} style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo src="whatsapp.svg" size={80} /></Card>
          <div style={{position: 'relative', width: 720, background: '#D9FDD3', border: `3px solid ${INK}`, borderRadius: 24, padding: '22px 28px 16px', boxShadow: `7px 8px 0 ${INK}`, opacity: vis(F, K.reminder) ? 1 : 0.0, ...(vis(F, K.reminder) ? popS(F, K.reminder - 0.05) : {})}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Sym n="bell" size={30} color={ORT} /><T size={26} w={700} color={ORT}>ऑटो रिमाइंडर</T></div>
            <T size={30} w={500} style={{marginTop: 10, whiteSpace: 'normal', lineHeight: 1.3}}>नमस्कार, तुमचे ₹ 4,20,000 बाकी आहेत. कृपया पेमेंट करा.</T>
            <T size={22} w={500} color={MUTE} style={{textAlign: 'right', marginTop: 6}}>10:00 AM ✓✓</T>
          </div>
        </div>
      </div>}
      <Stepper F={F} t={a} active={6} y={1225} />
    </AbsoluteFill>
  );
};

/* 17. dashboard: trips, tonnes, money in the market */
const HOURS = [3, 5, 8, 6, 9, 7, 4, 6, 8, 5, 7, 9];
const Dash = ({F}) => {
  const a = sc('dash');
  const kp = [['आजच्या ट्रिप्स', 46, '', 'trips', 'truck'], ['माल गेला', 838, ' टन', 'ton55', 'box'], ['मार्केटमध्ये', 12.6, ' लाख', 'paisa', 'rupee']];
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 230), ...up(F, a + 0.02, 10, 30)}}>
        <Card x={0} y={0} w={900} h={920} r={30} style={{position: 'relative', overflow: 'hidden'}}>
          <div style={{height: 84, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px', background: OR}}>
            <Mark size={40} color="#fff" /><T size={34} w={700} color="#fff">डॅशबोर्ड · आज</T>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, padding: 30}}>
            {kp.map(([l, v, u, k, ic], i) => {
              const val = io(F, s(K[k]) - 3, s(K[k]) + 16, 0, v, Easing.out(Easing.cubic));
              const on = vis(F, K[k] - 0.1);
              return (
                <div key={k} style={{display: 'flex', alignItems: 'center', gap: 24, border: `3px solid ${on ? INK : FAINT}`, borderRadius: 22, padding: '18px 26px', background: on && i === 2 ? '#FFF1F0' : '#fff', boxShadow: on ? `6px 7px 0 ${i === 2 ? RED : INK}` : 'none'}}>
                  <div style={{width: 84, height: 84, borderRadius: 20, background: on ? (i === 2 ? RED : OR) : '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n={ic} size={50} color="#fff" /></div>
                  <T size={32} w={600} color={MUTE}>{l}</T>
                  <div style={{marginLeft: 'auto', fontSize: 70, fontWeight: 800, color: i === 2 ? RED : INK, ...LAT, opacity: on ? 1 : 0.2}}>{i === 2 ? '₹ ' + val.toFixed(1) : Math.round(val)}<span style={{fontSize: 34}}>{u}</span></div>
                </div>
              );
            })}
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 170, padding: '10px 10px 0', borderTop: `2px dashed ${FAINT}`}}>
              {HOURS.map((h, i) => <div key={i} style={{flex: 1, height: `${h * 10 * io(F, s(a) + 6 + i * 1.5, s(a) + 20 + i * 1.5, 0, 1, Easing.out(Easing.cubic))}%`, background: i === HOURS.length - 1 ? OR : '#FFC9A6', border: `3px solid ${INK}`, borderRadius: 8}} />)}
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* 18. any plant where material leaves by dumper */
const PL = {x: 540, y: 700, k: 30};
const Plants = ({F}) => {
  const a = sc('plants');
  const sites = [['क्रशर', 'crusher57', -9, -9], ['एम-सँड', 'msand', 1.5, -8.5], ['स्क्रीनिंग प्लांट', 'screening', -3, 3]];
  return (
    <AbsoluteFill>
      <Stage {...PL}>
        <Ground x={-12} y={-12} w={22} d={20} />
        <Road x={-12} y={-0.8} w={22} d={2.4} />
        <Road x={-1.2} y={-12} w={2.4} d={20} alongX={false} />
        {/* crusher */}
        <g opacity={io(F, s(K.crusher57) - 4, s(K.crusher57) + 6, 0.35, 1)}><Plant x={-8} y={-9.5} run={1} F={F} /></g>
        {/* M-sand: shed + sand piles */}
        <g opacity={io(F, s(K.msand) - 4, s(K.msand) + 6, 0.35, 1)}>
          <Shed x={2.5} y={-10} w={3.2} d={2.6} h={2} roof={OR} />
          <Pile x={7.6} y={-8.2} r={1.5} h={1.7} c={SANDC} seed={21} />
          <Pile x={7.2} y={-4.6} r={1.2} h={1.3} c={SANDC} seed={22} />
        </g>
        {/* screening plant */}
        <g opacity={io(F, s(K.screening) - 4, s(K.screening) + 6, 0.35, 1)}>
          <Shed x={-9} y={2.5} w={2.6} d={2.2} h={1.6} roof={TEAL} />
          <Pile x={-3.6} y={4.2} r={1.4} h={1.7} c={STONE10} seed={23} />
          <Pile x={-5.8} y={6.6} r={1.2} h={1.4} c={STONE20} seed={24} />
        </g>
        <Dumper x={drive(F, a, 5, -12, 8, Easing.linear)} y={-0.45} load={1} />
        <Dumper x={drive(F, a + 1.8, 5, -12, 8, Easing.linear)} y={-0.45} load={1} body={OR2} />
      </Stage>
      {sites.map(([l, k, x, y], i) => {
        const [px, py] = at(PL, x, y, 4.2);
        return vis(F, K[k]) ? <div key={k} style={{...abs(px - 140, py - 70), width: 280, display: 'flex', justifyContent: 'center', ...popS(F, K[k])}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <Plate size={30} color={INK}>{l}</Plate>
            {vis(F, K.system) && <div style={popS(F, K.system + i * 0.12)}><Dot n="✓" size={56} color={GRN} style={{fontSize: 32, border: `3px solid ${INK}`}} /></div>}
          </div>
        </div> : null;
      })}
      {vis(F, K.system) && <Center y={1180} style={popS(F, K.system, 10)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: OR, border: `4px solid ${INK}`, borderRadius: 24, padding: '18px 34px 10px', boxShadow: `7px 8px 0 ${INK}`}}>
          <Mark size={46} color="#fff" /><T size={40} w={700} color="#fff">एकच सिस्टीम</T>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

/* 19. CTA: Instagram profile, DM + follow */
const Cta = ({F}) => {
  const a = sc('cta');
  const cur = io(F, s(K.dm) - 10, s(K.dm) - 1, 0, 1, ease);
  const cur2 = io(F, s(K.follow) - 10, s(K.follow) - 1, 0, 1, ease);
  const followed = vis(F, K.follow);
  const cx = vis(F, K.dm + 0.4) ? 720 - cur2 * 330 : 900 - cur * 180, cy = vis(F, K.dm + 0.4) ? 1000 : 1150 - cur * 150;
  return (
    <AbsoluteFill>
      <div style={{...abs(110, 260), ...up(F, a + 0.02, 10, 30)}}>
        <Card x={0} y={0} w={860} h={640} r={34} style={{position: 'relative', padding: '40px 44px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{width: 170, height: 170, borderRadius: 85, background: Y, border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark size={96} color={INK} /></div>
            <div style={{display: 'flex', gap: 36}}>
              {[['120', 'posts'], ['18.4K', 'followers'], ['32', 'following']].map(([n, l]) => <div key={l} style={{textAlign: 'center'}}><T size={40} w={800}>{n}</T><T size={24} w={500} color={MUTE}>{l}</T></div>)}
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 30}}><InstagramLogo size={56} /><div style={{...BRAND, fontSize: 44, fontWeight: 700}}>outgridlabs</div></div>
          <T size={30} w={500} color={MUTE} style={{marginTop: 12}}>बिझनेससाठी कस्टम सॉफ्टवेअर · क्रशर · डिस्पॅच · ERP</T>
          <div style={{display: 'flex', gap: 22, marginTop: 40}}>
            <div style={{flex: 1, height: 96, borderRadius: 20, background: followed ? '#EFEFEF' : '#0095F6', border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(followed ? popS(F, K.follow, 10) : {})}}><T size={38} w={700} color={followed ? INK : '#fff'}>{followed ? 'Following ✓' : 'Follow'}</T></div>
            <div style={{flex: 1, height: 96, borderRadius: 20, background: vis(F, K.dm) ? OR : '#EFEFEF', border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: vis(F, K.dm) ? 'none' : `5px 6px 0 ${INK}`}}><T size={38} w={700} color={vis(F, K.dm) ? '#fff' : INK}>Message</T></div>
          </div>
          {vis(F, K.custom - 0.1) && <div style={{marginTop: 40, display: 'flex', gap: 16, ...up(F, K.custom - 0.1, 8, 20)}}>
            {['काटा', 'पावती', 'QR गेट', 'GPS', 'उधारी'].map((l) => <Chip key={l} size={26} color={ORT}>{l}</Chip>)}
          </div>}
        </Card>
      </div>
      {vis(F, K.dm + 0.3) && <div style={{...abs(560, 1010), ...popS(F, K.dm + 0.3)}}><Chip size={34} color="#fff" bg={INK}>DM करा</Chip></div>}
      <div style={{...abs(cx, cy), opacity: io(F, s(K.dm) - 12, s(K.dm) - 4)}}>
        <svg viewBox="0 0 24 24" width={74} height={74}><path d={'M5 3l14 7.5-6 1.8L10 19z'} fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" /></svg>
      </div>
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
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */
const COMPS = {hook: Hook, register: Register, missing: Missing, ton: Ton, papers: Papers, pass: Pass, check: Check, stock: Stock, udhari: Udhari,
  soft: Soft, s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, dash: Dash, plants: Plants, cta: Cta, outro: Outro};
const LABELS = {hook: '// 2:00 am · crusher', register: '// dispatch register', missing: '// 2 dumpers missing', ton: '// one trip', papers: '// three records', pass: '// transit pass',
  check: '// checking', stock: '// stock yard', udhari: '// udhari', soft: '// the system', s1: '// 01 — weighbridge', s2: '// 02 — one click', s3: '// 03 — gate',
  s4: '// 04 — live stock', s5: '// 05 — delivery', s6: '// 06 — payments', dash: '// dashboard', plants: '// any plant', cta: '// outgrid labs'};
const Video = () => <IsoVideo scenes={SCENES} comps={COMPS} labels={LABELS} chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} hi={ORT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
