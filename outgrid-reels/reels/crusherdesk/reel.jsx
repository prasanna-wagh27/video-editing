/*
 * "CrusherDesk" — Outgrid Labs product reel, ISO style (shared/iso.jsx), 1080x1920, VO at original speed.
 * Crusher props from props.jsx (copy of crusher-dispatch), office props from ../business-process-audit/props.jsx,
 * realistic iPhone frame from ../mai-chatgpt-settings/iphone.jsx for the owner's dashboard.
 * Truck numbers, names, trip counts, rates and amounts are illustrative. PHONE is a placeholder until the real number is given.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Mark, BRAND, InstagramLogo} from '../../shared/kit.jsx';
import {INK, MUTE, FAINT, GRN, RED, BLUE, LAT, up, popS, vis, P, Box, FaceT, Stage, at, Person, Card, Tag, Plate, Dot, Logo, Ico, IsoVideo} from '../../shared/iso.jsx';
import {OR, OR2, YEL, TEAL, STONE10, STONE20, Ground, Road, Pile, Dumper, Plant, Cabin, Gate, Shed} from './props.jsx';
import {Floor, Desk, Book} from '../business-process-audit/props.jsx';
import {IPhone, StatusBar, SW} from '../mai-chatgpt-settings/iphone.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S} from './cues.mjs';

const PHONE = '+91 XXXXX XXXXX'; // placeholder: replace with the real WhatsApp number
const TOTAL = s(TOTAL_S);
const ORT = '#E8590C';
const WA_D = '#008069';
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontSize: size, fontWeight: wt, color, lineHeight: 1.15, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const ease = Easing.inOut(Easing.cubic);
const drive = (F, t0, dur, x0, x1, e = ease) => io(F, s(t0), s(t0 + dur), x0, x1, e);
const typed = (F, t0, dur, str) => { const g = [...new Intl.Segmenter('mr', {granularity: 'grapheme'}).segment(str)].map((x) => x.segment); return g.slice(0, Math.round(io(F, s(t0), s(t0 + dur), 0, g.length, Easing.linear))).join(''); };
const fmt = (n) => Math.round(n).toLocaleString('en-IN');
const shake = (F, t, d = 0.5, amp = 7) => (F >= s(t) && F < s(t + d) ? Math.sin(F * 1.7) * amp * io(F, s(t), s(t + d), 1, 0) : 0);
const drop = (F, t, d = 10, hgt = 3) => `translate(0 ${-hgt * (1 - io(F, s(t), s(t) + d, 0, 1, Easing.out(Easing.back(1.6))))})`;
const Stamp = ({F, t, children, color = RED, rot = -10, size = 60, style = {}}) => !vis(F, t) ? null : (
  <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${io(F, s(t), s(t) + 6, 1.8, 1, Easing.out(Easing.cubic))})`, opacity: io(F, s(t), s(t) + 4),
    border: `6px solid ${color}`, color, borderRadius: 14, padding: '14px 28px 6px', fontSize: size, fontWeight: 800, letterSpacing: '0.02em', background: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/* icons (24 grid) */
const I = {
  truck: <><path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h4l3 3.2v2.8h-7" /><circle cx="6.5" cy="17" r="1.8" /><circle cx="16.5" cy="17" r="1.8" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  sun: <><circle cx="12" cy="14" r="4" /><path d="M3 18h18M12 5v2.5M5.5 8l1.6 1.6M18.5 8l-1.6 1.6M2.5 14H5M19 14h2.5" /></>,
  book: <><path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z" /><path d="M5 18a2 2 0 0 1 2-2h11M9 8.5h5" /></>,
  wifiOff: <><path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0" /><circle cx="12" cy="19.2" r="0.8" /><path d="M3.5 3.5l17 17" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  home: <><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V20h12V9.5M10 20v-5h4v5" /></>,
  office: <><rect x="5" y="3.5" width="14" height="17" rx="1.5" /><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M11 20.5v-2.5h2v2.5" /></>,
  car: <><path d="M4 15.5V12l2-4.5h12l2 4.5v3.5z" /><circle cx="8" cy="16.5" r="1.6" /><circle cx="16" cy="16.5" r="1.6" /><path d="M4 12h16" /></>,
  cal: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  rupee: <path d="M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7" />,
  gate: <><path d="M4 20V8M4 10h16" /><path d="M7 10l3 0M12 10h3" /><rect x="2.5" y="6" width="3" height="3" rx="0.6" /></>,
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
// CrusherDesk mark: orange tile with a white dumper glyph
const DeskIcon = ({size = 120}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: OR, border: `${Math.max(3, size * 0.03)}px solid ${INK}`, boxShadow: `${size * 0.05}px ${size * 0.06}px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg viewBox="0 0 24 24" width={size * 0.66} height={size * 0.66} fill="none" stroke="#fff" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 13.5l1.5-6h9l-1 6z" fill="rgba(255,255,255,0.25)" /><path d="M13 9.5h4l3.5 3.5v3h-8" /><path d="M2.5 13.5v2.5h10" /><circle cx="6.5" cy="17" r="1.9" fill={OR} /><circle cx="16.5" cy="17" r="1.9" fill={OR} />
      <path d="M5.5 7.5l1-2.5h4l1 2.5" />
    </svg>
  </div>
);
const Wordmark = ({size = 96}) => <div style={{...BRAND, fontSize: size, fontWeight: 800, letterSpacing: '-0.03em', color: INK}}>Crusher<span style={{color: OR}}>Desk</span></div>;
// a pile of paper notes (cash bundle) in iso units
const Bundle = ({x, y, z = 0}) => (
  <g>
    <Box x={x} y={y} z={z} w={1.3} d={0.62} h={0.24} c="#7CC48A" top="#A6DDB0" left="#86CC93" right="#5DA86B" />
    <FaceT x={x + 0.52} y={y} z={z + 0.241} w={0.26} d={0.62} fill="#F1E3B8" />
  </g>
);

/* ================= scenes ================= */

/* 1. hook: driver says 12, supervisor 11, customer 10 */
const HK = {x: 540, y: 960, k: 44};
const VOICES = [['ड्रायव्हर', '12', 'driver', 'n12', OR, -3.8, 3.8, OR], ['सुपरवायझर', '11', 'sup', 'n11', TEAL, 0, 0, YEL], ['कस्टमर', '10', 'cust', 'n10', BLUE, 3.8, -3.8, null]];
const Hook = ({F}) => {
  const dx = drive(F, -0.2, 1.6, -11, -6.6, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage {...HK}>
        <Ground x={-6.5} y={-6.5} w={13} d={13} />
        <Road x={-6.5} y={1.0} w={13} d={2.6} />
        <Plant x={-4.4} y={-6.2} run={1} F={F} />
        <Pile x={3.6} y={-0.6} r={1.2} h={1.5} seed={3} />
        <Cabin x={4.2} y={-6.2} w={1.8} d={1.6} h={1.9} />
        <Dumper x={dx} y={1.3} load={1} op={io(dx, -11, -9.5)} />
        {VOICES.map(([, , , , c, x, y, hat]) => <Person key={x} x={x} y={y} c={c} hat={hat} sc={1.9} head="#7A4C33" />)}
      </Stage>
      {VOICES.map(([role, n, kr, kn, c, x, y], i) => {
        const [px, py] = at(HK, x, y, 3.0);
        return (
          <React.Fragment key={role}>
            {vis(F, K[kr] - 0.1) && <div style={{...abs(px - 130, py + 150), width: 260, display: 'flex', justifyContent: 'center', ...popS(F, K[kr] - 0.1, 8)}}><Plate size={28} color={INK}>{role}</Plate></div>}
            {vis(F, K[kn] - 0.15) && <div style={{...abs(px - 120, py - 170), width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', ...popS(F, K[kn] - 0.15, 9), transformOrigin: '50% 100%'}}>
              <div style={{background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '16px 26px 8px', boxShadow: `6px 7px 0 ${c}`, textAlign: 'center'}}>
                <div style={{fontSize: 96, fontWeight: 800, color: c, lineHeight: 0.95, ...LAT}}>{n}</div>
                <T size={28} w={600} color={MUTE}>ट्रिप्स</T>
              </div>
              <div style={{width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `20px solid ${INK}`, marginTop: -1}} />
            </div>}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* 2. whose word decides the money? owner + cash bundles + three numbers */
const WH = {x: 540, y: 1010, k: 58};
const Who = ({F}) => {
  const a = sc('who');
  const bund = [[0.4, -1.6, 0], [0.4, -0.9, 0], [0.4, -1.6, 0.24], [0.4, -0.9, 0.24], [1.8, -1.6, 0], [1.8, -0.9, 0], [0.4, -1.25, 0.48]];
  const [ox, oy] = at(WH, -1.2, 0.6, 2.6);
  return (
    <AbsoluteFill>
      <Center y={250} style={up(F, a + 0.05, 8, 20)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {VOICES.map(([role, n, , , c], i) => (
            <React.Fragment key={role}>
              {i > 0 && <div style={{fontSize: 74, fontWeight: 800, color: RED, transform: `scale(${vis(F, K.aikun) ? pop(F, K.aikun + i * 0.1, 8) : 0.0001})`}}>≠</div>}
              <div style={{width: 210, background: '#fff', border: `4px solid ${INK}`, borderRadius: 26, padding: '14px 10px 6px', boxShadow: `6px 7px 0 ${c}`, textAlign: 'center', transform: `rotate(${shake(F, K.ghenar, 0.5, 4) * (i - 1)}deg)`}}>
                <div style={{fontSize: 86, fontWeight: 800, color: c, lineHeight: 0.95, ...LAT}}>{n}</div><T size={26} w={600} color={MUTE}>{role}</T>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Center>
      <Stage {...WH}>
        <Floor x={-4} y={-3.2} w={8} d={6.4} top="#F4EEE2" />
        <Person x={-1.2} y={0.6} c={'#5B6470'} head="#7A4C33" sc={2.2} />
        {bund.map(([x, y, z], i) => vis(F, K.paise - 0.2 + i * 0.05) && <g key={i} transform={drop(F, K.paise - 0.2 + i * 0.05, 8, 1.5)}><Bundle x={x} y={y} z={z} /></g>)}
      </Stage>
      {vis(F, K.paise) && (() => { const [bx, by] = at(WH, 1.4, -0.9, 1.2); return <div style={{...abs(bx + 30, by - 120), ...popS(F, K.paise, 9)}}><Chip size={34} color={GRN}><Sym n="rupee" size={36} color={GRN} />पैसे</Chip></div>; })()}
      <div style={{...abs(ox - 60, oy - 190)}}><Q F={F} t={K.ghenar - 0.1} size={120} /></div>
    </AbsoluteFill>
  );
};

/* 3. every evening: register, WhatsApp scroll, phone calls */
const EV = {x: 540, y: 1220, k: 50};
const REG = [['MH 12 KT 4521', '3'], ['MH 14 GH 2093', '2'], ['MH 12 RQ 7710', '4'], ['MH 42 B 3307', '2 ?'], ['MH 12 PB 6618', '1']];
const WAM = [['रवी', '2 ट्रिप झाल्या'], ['सुनील', 'MH 12 4521 — 20 MM'], ['रवी', 'फोटो'], ['अमित', '3 री ट्रिप निघाली'], ['सुनील', 'पाटील साईटवर 1'], ['रवी', 'फोटो'], ['अमित', 'उद्या सांगतो'], ['सुनील', '?']];
const Evening = ({F}) => {
  const a = sc('evening');
  const scr = io(F, s(K.scroll), s(K.phone) + 6, 0, 330, Easing.inOut(Easing.quad));
  const ring = (F % 24) / 24;
  return (
    <AbsoluteFill>
      <Stage {...EV}>
        <Floor x={-3.6} y={-2.2} w={7.2} d={4.4} top="#F4EEE2" />
        <Person x={0.2} y={-1.4} c={'#5B6470'} head="#7A4C33" sc={1.6} />
        <Desk x={-1.6} y={-0.8} w={3.2} d={1.4} laptop={false} paper={2} />
        <Book x={0.5} y={-0.6} z={0.82} w={1.1} d={0.8} h={0.2} c="#C2410C" />
      </Stage>
      {vis(F, Math.min(K.sandhya - 0.1, a + 0.15)) && <div style={{...abs(90, 175), ...popS(F, Math.min(K.sandhya - 0.1, a + 0.15), 9)}}><Tag size={32}><Sym n="sun" size={36} color={ORT} />रोज संध्याकाळी · 7:00</Tag></div>}
      {/* register */}
      {vis(F, K.register - 0.15) && <div style={{...abs(80, 290), transform: 'rotate(-2.5deg)', ...up(F, K.register - 0.15, 8, 40)}}>
        <Card x={0} y={0} w={600} h={430} r={18} style={{position: 'relative', background: '#FFFDF6', overflow: 'hidden', padding: '24px 30px 0 80px'}}>
          <div style={{position: 'absolute', left: 58, top: 0, bottom: 0, width: 3, background: 'rgba(229,72,77,0.45)'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Sym n="book" size={34} color="#C2410C" /><T size={32} w={700}>ट्रिप रजिस्टर</T></div>
          {REG.map(([v, n], i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', height: 62, alignItems: 'center', borderBottom: '2px solid rgba(59,130,246,0.25)', fontSize: 30, fontWeight: 600, color: '#1D3A8A', transform: `rotate(${(i % 2 ? 0.6 : -0.5)}deg)`, ...LAT}}><span>{v}</span><span style={{textDecoration: i === 3 ? 'line-through' : 'none'}}>{n}</span></div>)}
        </Card>
      </div>}
      {/* WhatsApp group */}
      {vis(F, K.whatsapp - 0.15) && <div style={{...abs(420, 400), transform: 'rotate(2deg)', ...up(F, K.whatsapp - 0.15, 8, 40)}}>
        <Card x={0} y={0} w={580} h={470} r={24} style={{position: 'relative', overflow: 'hidden'}}>
          <div style={{height: 84, background: WA_D, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', borderBottom: `3px solid ${INK}`}}>
            <div style={{width: 52, height: 52, borderRadius: 26, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo src="whatsapp.svg" size={38} /></div>
            <T size={30} w={700} color="#fff">ड्रायव्हर ग्रुप</T>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 87, bottom: 0, background: '#EFE7DD', overflow: 'hidden'}}>
            <div style={{padding: '14px 18px', transform: `translateY(${-scr}px)`}}>
              {WAM.map(([nm, m], i) => <div key={i} style={{marginBottom: 12, display: 'flex', justifyContent: i % 3 === 2 ? 'flex-end' : 'flex-start'}}>
                <div style={{background: '#fff', borderRadius: 16, padding: '8px 16px 4px', boxShadow: '0 2px 0 rgba(0,0,0,0.12)'}}>
                  <T size={20} w={700} color={[OR, TEAL, '#7C5CFF'][i % 3]}>{nm}</T>
                  {m === 'फोटो' ? <div style={{width: 200, height: 110, borderRadius: 10, marginTop: 4, background: 'linear-gradient(135deg, #B9C0C8, #8C949E)'}} /> : <T size={26} w={500}>{m}</T>}
                </div>
              </div>)}
            </div>
          </div>
        </Card>
      </div>}
      {/* phone call */}
      {vis(F, K.phone - 0.15) && <div style={{...abs(150, 720), transform: 'rotate(-1.5deg)', ...up(F, K.phone - 0.15, 8, 40)}}>
        <Card x={0} y={0} w={560} h={230} r={30} style={{position: 'relative', background: '#1E2229', padding: '28px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{position: 'relative', width: 110, height: 110}}>
            <div style={{...abs(55 - 55 * (1 + ring * 0.5), 55 - 55 * (1 + ring * 0.5)), width: 110 * (1 + ring * 0.5), height: 110 * (1 + ring * 0.5), borderRadius: '50%', border: `3px solid ${TEAL}`, opacity: 1 - ring}} />
            <div style={{width: 110, height: 110, borderRadius: 55, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="user" size={64} color="#fff" /></div>
          </div>
          <div><T size={36} w={700} color="#fff">सुपरवायझर</T><T size={26} w={500} color="rgba(255,255,255,0.6)" style={{marginTop: 4}}>कॉल करत आहे…</T></div>
          <div style={{marginLeft: 'auto', width: 84, height: 84, borderRadius: 42, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(135deg)'}}><Sym n="phone" size={44} color="#fff" /></div>
        </Card>
      </div>}
      {vis(F, K.vichara - 0.1) && <div style={{...abs(560, 930), ...popS(F, K.vichara - 0.1, 8)}}><Chip size={30}>किती ट्रिप्स झाल्या?</Chip></div>}
    </AbsoluteFill>
  );
};

/* 4. the numbers never match: three columns of trip slabs, 12 / 11 / 10 */
const MM = {x: 540, y: 1150, k: 48};
const Mismatch = ({F}) => {
  const a = sc('mismatch');
  const cols = VOICES.map(([role, n, , , c, x, y]) => ({role, n: +n, c, x: x * 0.85 - 0.8, y: y * 0.85 - 0.8}));
  return (
    <AbsoluteFill>
      <Center y={250} style={up(F, a + 0.05, 8, 20)}><Tag size={36}><Sym n="cal" size={40} color={ORT} />आजचा हिशोब · ट्रिप्स</Tag></Center>
      <Stage {...MM}>
        <Floor x={-5.4} y={-5.4} w={10.8} d={10.8} top="#F4EEE2" seams={0} />
        {cols.map(({n, c, x, y}, ci) => <g key={ci}>
          {Array.from({length: n}, (_, j) => vis(F, a + 0.1 + j * 0.07 + ci * 0.05) && <g key={j} transform={drop(F, a + 0.1 + j * 0.07 + ci * 0.05, 6, 1)}><Box x={x} y={y} z={j * 0.32} w={1.6} d={1.6} h={0.28} c={vis(F, K.julat) ? (ci === 0 ? c : RED) : c} /></g>)}
          <FaceT x={x} y={y} z={12 * 0.32} w={1.6} d={1.6} fill="none" stroke="rgba(20,20,20,0.45)" dash="6 6" />
        </g>)}
      </Stage>
      {cols.map(({role, n, c, x, y}) => {
        const [px, py] = at(MM, x + 0.8, y + 0.8, n * 0.32 + 0.4);
        return <div key={role} style={{...abs(px - 110, py - 120), width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', ...up(F, a + 0.6, 8, 20)}}>
          <div style={{fontSize: 70, fontWeight: 800, color: c, lineHeight: 1, ...LAT}}>{n}</div><Plate size={24} color={INK}>{role}</Plate>
        </div>;
      })}
      <Center y={400}><Stamp F={F} t={K.julat} rot={-6}>जुळत नाही!</Stamp></Center>
    </AbsoluteFill>
  );
};

/* 5. just one missed trip a day -> a month of money */
const LSS = {x: 540, y: 470, k: 36};
const Loss = ({F}) => {
  const a = sc('loss');
  const gx = drive(F, a, 2.2, -10, -2.2, Easing.out(Easing.cubic));
  const ghost = io(F, s(K.chukli), s(K.chukli) + 10, 1, 0.35);
  const marked = Math.floor(io(F, s(K.shevti12 - 0.2), s(K.kiti), 0, 30, Easing.linear));
  const money = io(F, s(K.kiti - 0.1), s(K.kiti) + 24, 0, 240000, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage {...LSS}>
        <Ground x={-7} y={-2.4} w={14} d={4.8} />
        <Road x={-7} y={-1.3} w={14} d={2.6} />
        <Dumper x={gx} y={-0.85} ghost op={ghost} />
      </Stage>
      {vis(F, K.chukli) && <div style={{...abs(640, 230), ...popS(F, K.chukli, 9)}}><Chip size={32} color={RED}><Sym n="x" size={34} color={RED} sw={3} />1 ट्रिप चुकली</Chip></div>}
      <div style={{...abs(110, 650), ...up(F, Math.min(a + 0.3, K.mahina - 0.2), 10, 30)}}>
        <Card x={0} y={0} w={860} h={430} r={28} style={{position: 'relative', padding: '22px 30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Sym n="cal" size={38} color={ORT} /><T size={34} w={700}>महिना · 30 दिवस</T><Chip size={26} color={RED} style={{marginLeft: 'auto'}}>−{marked} ट्रिप्स</Chip></div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, marginTop: 22}}>
            {Array.from({length: 30}, (_, i) => <div key={i} style={{height: 86, borderRadius: 12, border: `2.5px solid ${i < marked ? RED : FAINT}`, background: i < marked ? '#FFECEC' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <T size={20} w={600} color={MUTE}>{i + 1}</T>{i < marked && <Sym n="truck" size={30} color={RED} sw={2.2} />}
            </div>)}
          </div>
        </Card>
      </div>
      {vis(F, K.kiti - 0.1) && <Center y={1130} style={popS(F, K.kiti - 0.1, 10)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '20px 36px 12px', boxShadow: `9px 11px 0 ${RED}`, transform: `rotate(${shake(F, K.ka, 0.5, 2)}deg)`}}>
          <div><T size={26} w={600} color={MUTE}>30 ट्रिप्स × ₹8,000 (उदा.)</T><div style={{fontSize: 84, fontWeight: 800, color: RED, lineHeight: 1.05, ...LAT}}>−₹ {fmt(money)}</div></div>
          <Q F={F} t={K.ka} size={90} />
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

/* 6. CrusherDesk reveal over a working plant */
const INX = {x: 540, y: 1080, k: 36};
const Intro = ({F}) => {
  const a = sc('intro');
  const t = Math.min(K.desk - 0.15, a + 0.6);
  return (
    <AbsoluteFill>
      <Stage {...INX} style={{opacity: 0.9}}>
        <Ground x={-7} y={-4} w={14} d={8} />
        <Road x={-7} y={1.2} w={14} d={2.4} />
        <Plant x={-4.6} y={-3.6} run={1} F={F} />
        <Pile x={3.4} y={-2.2} r={1.4} h={1.8} seed={7} /><Pile x={5.4} y={-0.4} r={1.1} h={1.3} c={STONE20} seed={8} />
        <Dumper x={drive(F, a, 3.5, -10, 6, Easing.linear)} y={1.6} load={1} />
      </Stage>
      <Center y={260}><div style={{transform: `scale(${vis(F, t) ? pop(F, t, 12) : 0}) rotate(${io(F, s(t), s(t) + 10, -12, 0)}deg)`}}><DeskIcon size={230} /></div></Center>
      <Center y={540} style={up(F, t + 0.15, 10, 30)}><Wordmark size={118} /></Center>
      <Center y={690} style={up(F, t + 0.4, 10, 20)}><T size={34} w={500} color={MUTE}>by Outgrid Labs</T></Center>
    </AbsoluteFill>
  );
};

/* 7. one entry at the gate: number, material, brass, customer */
const GT = {x: 540, y: 580, k: 40};
const FIELDS = [['गाडी नंबर', 'MH 12 KT 4521', 'gadi'], ['माल', '20 MM खडी', 'maal'], ['ब्रास', '6', 'bras'], ['कस्टमर', 'पाटील कन्स्ट्रक्शन', 'customer']];
const GateScene = ({F, offline}) => {
  const a = sc(offline ? 'offline' : 'gate');
  const saveT = K.customer + 0.3;
  const open = offline ? 1 : io(F, s(saveT), s(saveT) + 8, 0, 1, ease);
  const x1 = offline ? -3 + ((F - s(a)) / 30) * 6 : F < s(saveT + 0.2) ? drive(F, a, 1.3, -10, -3.8, Easing.out(Easing.cubic)) : drive(F, saveT + 0.15, 1.4, -3.8, 8, Easing.in(Easing.quad));
  const x2 = offline ? drive(F, a + 0.6, 1.6, -11, -3.8, Easing.out(Easing.cubic)) : -20;
  const [cx, cy] = at(GT, -0.2, -3.6, 2.6);
  return (
    <Stage {...GT}>
      <Ground x={-6} y={-4.4} w={12} d={8.4} />
      <Road x={-6} y={-1.3} w={12} d={3} />
      <Cabin x={-1.0} y={-4.3} w={1.8} d={1.6} h={1.9} />
      {x1 > -10 && x1 < 8 && <Dumper x={x1} y={-0.9} load={1} op={Math.min(io(x1, -10, -8.5), io(x1, 5, 7.5, 1, 0))} />}
      {offline && x2 > -11 && <Dumper x={x2} y={-0.9} load={1} body={OR2} op={io(x2, -11, -9.5)} />}
      <Gate x={0.8} y={-1.9} open={open} len={3.5} />
    </Stage>
  );
};
const EntryCard = ({F, children, head, y = 850, h = 510}) => (
  <div style={{...abs(110, y)}}>
    <Card x={0} y={0} w={860} h={h} r={30} style={{position: 'relative', overflow: 'hidden'}}>
      <div style={{height: 92, background: INK, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px'}}>
        <DeskIcon size={58} /><T size={34} w={700} color="#fff">गेट एन्ट्री</T>{head}
      </div>
      {children}
    </Card>
  </div>
);
const Gate1 = ({F}) => {
  const a = sc('gate');
  const saveT = K.customer + 0.3;
  const [cx, cy] = at(GT, -0.1, -3.5, 2.5);
  return (
    <AbsoluteFill>
      <GateScene F={F} />
      {vis(F, K.gate - 0.1) && <div style={{...abs(cx - 70, cy - 120), ...popS(F, K.gate - 0.1, 9)}}><Plate size={28} color={INK}><Sym n="pin" size={30} color="#fff" />गेट</Plate></div>}
      {vis(F, K.ekdach - 0.1) && <div style={{...abs(720, 220), ...popS(F, K.ekdach - 0.1, 9)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: OR, border: `4px solid ${INK}`, borderRadius: 24, padding: '14px 26px 6px', boxShadow: `6px 7px 0 ${INK}`}}><div style={{fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1}}>1×</div><T size={30} w={700} color="#fff">एन्ट्री</T></div>
      </div>}
      <div style={up(F, a + 0.15, 10, 40)}>
        <EntryCard F={F} head={<Chip size={24} color="#fff" bg="transparent" style={{marginLeft: 'auto', border: '3px solid #fff'}}>#1049</Chip>}>
          <div style={{padding: '18px 30px 0'}}>
            {FIELDS.map(([l, v, k]) => {
              const on = vis(F, K[k] - 0.1), done = vis(F, K[k] + 0.28);
              return <div key={k} style={{display: 'flex', alignItems: 'center', gap: 20, height: 76, borderBottom: `2px solid ${FAINT}`}}>
                <T size={28} w={600} color={MUTE} style={{width: 190}}>{l}</T>
                <div style={{flex: 1, height: 58, borderRadius: 14, border: `3px solid ${on && !done ? OR : on ? INK : FAINT}`, display: 'flex', alignItems: 'center', padding: '4px 18px 0', background: on && !done ? '#FFF4EC' : '#fff'}}>
                  <T size={32} w={700}>{on ? typed(F, K[k] - 0.1, 0.35, v) : ''}</T>
                </div>
                <div style={{width: 40}}>{done && <div style={popS(F, K[k] + 0.28, 6)}><Dot n="✓" size={40} color={GRN} style={{fontSize: 22}} /></div>}</div>
              </div>;
            })}
          </div>
          <div style={{position: 'absolute', right: 30, bottom: 22, display: 'flex', alignItems: 'center', gap: 16}}>
            {vis(F, saveT + 0.1) && <div style={popS(F, saveT + 0.1, 8)}><Chip size={26} color={GRN}><Sym n="check" size={28} color={GRN} sw={3} />सेव्ह झाली · गेट उघडलं</Chip></div>}
            <div style={{height: 62, padding: '6px 40px 0', borderRadius: 16, background: vis(F, saveT) ? GRN : OR, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', transform: `scale(${vis(F, saveT) ? 1 + 0.08 * io(F, s(saveT), s(saveT) + 3, 1, 0) : 1})`}}><T size={30} w={700} color="#fff">सेव्ह</T></div>
          </div>
        </EntryCard>
      </div>
    </AbsoluteFill>
  );
};

/* 8. no internet: entries keep saving */
const LIST = [['MH 12 KT 4521', '20 MM', '6'], ['MH 14 GH 2093', 'क्रश सँड', '5'], ['MH 12 RQ 7710', '10 MM', '6'], ['MH 42 B 3307', '20 MM', '7']];
const Offline = ({F}) => {
  const a = sc('offline');
  const n = 2 + LIST.slice(2).filter((_, i) => vis(F, K.chalu - 0.3 + i * 0.35)).length;
  const [tx, ty] = at(GT, 0.3, -3.2, 3.2);
  return (
    <AbsoluteFill>
      <GateScene F={F} offline />
      {vis(F, Math.min(K.net - 0.1, a + 0.2)) && <div style={{...abs(tx - 120, ty - 150), ...popS(F, Math.min(K.net - 0.1, a + 0.2), 9)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `4px solid ${RED}`, borderRadius: 999, padding: '10px 26px 4px', boxShadow: `5px 6px 0 ${RED}`}}><Sym n="wifiOff" size={46} color={RED} sw={2.6} /><T size={34} w={700} color={RED}>नेट नाही</T></div>
      </div>}
      <EntryCard F={F} head={<Chip size={24} color="#fff" bg={RED} style={{marginLeft: 'auto', borderColor: RED}}>ऑफलाइन</Chip>}>
        <div style={{padding: '14px 30px 0'}}>
          {LIST.slice(0, n).map(([v, m, b], i) => <div key={v} style={{display: 'flex', alignItems: 'center', gap: 18, height: 84, borderBottom: `2px solid ${FAINT}`, ...(i >= 2 ? up(F, K.chalu - 0.3 + (i - 2) * 0.35, 6, 20) : {})}}>
            <div style={{width: 56, height: 56, borderRadius: 14, background: '#FFF1E6', border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="truck" size={34} color={ORT} /></div>
            <T size={30} w={700} style={{width: 280}}>{v}</T><T size={28} w={500} color={MUTE} style={{width: 160}}>{m}</T><T size={28} w={600}>{b} ब्रास</T>
            <div style={{marginLeft: 'auto'}}><Dot n="✓" size={44} color={GRN} style={{fontSize: 24}} /></div>
          </div>)}
        </div>
        {vis(F, K.chalu) && <div style={{position: 'absolute', left: 30, bottom: 22, ...popS(F, K.chalu, 8)}}><Chip size={28} color={GRN}><Sym n="check" size={30} color={GRN} sw={3} />नेटशिवायही एन्ट्री चालू</Chip></div>}
      </EntryCard>
    </AbsoluteFill>
  );
};

/* 9. owner's phone: today's trips, brass, cash, pending — from anywhere */
const PW = 500, PX = 520, PY = 250;
const TILES = [['ट्रिप्स', 48, '', 'trips', OR], ['ब्रास', 286, '', 'bras26', TEAL], ['रोख', 184500, '₹', 'rokh', GRN], ['बाकी', 62000, '₹', 'baki', RED]];
const UIF = 'MaiUI, Anek, sans-serif';
const Ux = ({z = 16, w = 500, c = INK, children, style = {}}) => <div style={{fontFamily: UIF, fontSize: z, fontWeight: w, color: c, lineHeight: 1.25, whiteSpace: 'nowrap', ...style}}>{children}</div>;
const Mobile = ({F}) => {
  const a = sc('mobile');
  const slide = io(F, s(a), s(a) + 14, 1, 0, Easing.out(Easing.cubic));
  const places = [['home', 'घरी'], ['office', 'ऑफिसमध्ये'], ['car', 'प्रवासात']];
  return (
    <AbsoluteFill>
      {places.map(([ic, l], i) => vis(F, K.kuthehi - 0.2 + i * 0.15) && <div key={l} style={{...abs(70, 420 + i * 200), ...popS(F, K.kuthehi - 0.2 + i * 0.15, 9)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `3px solid ${INK}`, borderRadius: 26, padding: '14px 22px 10px', boxShadow: `5px 6px 0 ${INK}`}}>
          <div style={{width: 70, height: 70, borderRadius: 18, background: [OR, TEAL, BLUE][i], display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n={ic} size={44} color="#fff" /></div>
          <T size={32} w={700}>{l}</T>
        </div>
      </div>)}
      {vis(F, K.kuthehi - 0.2) && <svg width={1080} height={1920} style={abs(0, 0)}>{[0, 1, 2].map((i) => <path key={i} d={`M ${360} ${470 + i * 200} C 440 ${470 + i * 200}, 440 ${700}, ${PX - 10} 760`} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="8 9" opacity={io(F, s(K.kuthehi + i * 0.15), s(K.kuthehi + i * 0.15) + 8)} />)}</svg>}
      <div style={{...abs(PX, PY + slide * 900), transform: `rotate(${3 * slide}deg)`}}>
        <IPhone w={PW}>
          <div style={{position: 'absolute', inset: 0, background: '#F4F2EE'}}>
            <StatusBar />
            <div style={{...abs(20, 66), display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{transform: 'scale(0.42)', transformOrigin: '0 0', width: 48, height: 48}}><DeskIcon size={110} /></div>
              <Ux z={22} w={700}>CrusherDesk</Ux>
            </div>
            <Ux z={30} w={700} style={{...abs(20, 128)}}>आज</Ux>
            <Ux z={15} w={500} c={MUTE} style={{...abs(84, 140)}}>28 नोव्हेंबर · लाईव्ह</Ux>
            {TILES.map(([l, v, pre, k, c], i) => {
              const hl = io(F, s(K[k]) - 3, s(K[k]) + 2) * io(F, s(K[k]) + 14, s(K[k]) + 24, 1, 0.0);
              const val = io(F, s(K[k]) - 4, s(K[k]) + 12, 0, v, Easing.out(Easing.cubic));
              return <div key={k} style={{...abs(16 + (i % 2) * 189, 182 + Math.floor(i / 2) * 142), width: 181, height: 130, borderRadius: 20, background: '#fff', border: `2px solid ${hl > 0.05 ? c : 'rgba(20,20,20,0.08)'}`,
                boxShadow: hl > 0.05 ? `0 0 0 ${4 * hl}px ${c}33` : '0 1px 2px rgba(0,0,0,0.06)', padding: '14px 16px', boxSizing: 'border-box', transform: `scale(${1 + 0.05 * hl})`}}>
                <Ux z={16} w={600} c={MUTE}>{l}</Ux>
                <Ux z={v > 9999 ? 28 : 40} w={700} c={c} style={{marginTop: 10}}>{pre}{pre ? fmt(val) : Math.round(val)}</Ux>
              </div>;
            })}
            <Ux z={17} w={700} style={{...abs(20, 480)}}>ताज्या एन्ट्री</Ux>
            {LIST.map(([v, m, b], i) => <div key={v} style={{...abs(16, 512 + i * 70), width: SW - 32, height: 62, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', boxSizing: 'border-box'}}>
              <div style={{width: 36, height: 36, borderRadius: 10, background: '#FFF1E6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sym n="truck" size={22} color={ORT} sw={2} /></div>
              <div><Ux z={15} w={700}>{v}</Ux><Ux z={13} w={500} c={MUTE}>{m} · {b} ब्रास</Ux></div>
              <Ux z={13} w={500} c={MUTE} style={{marginLeft: 'auto'}}>{['2:41', '2:18', '1:52', '1:30'][i]} PM</Ux>
            </div>)}
          </div>
        </IPhone>
      </div>
    </AbsoluteFill>
  );
};

/* 10. CTA: DM or WhatsApp the number on screen */
const CT = {x: 540, y: 1260, k: 28};
const Cta = ({F}) => {
  const a = sc('cta');
  const btn = (on, color) => ({background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, boxShadow: `9px 11px 0 ${on ? color : INK}`, padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 24});
  return (
    <AbsoluteFill>
      <Stage {...CT} style={{opacity: 0.9}}>
        <Ground x={-9} y={-2} w={18} d={4} />
        <Road x={-9} y={-1.3} w={18} d={2.6} />
        <Dumper x={drive(F, a, 4, -12, 8, Easing.linear)} y={-0.85} load={1} />
      </Stage>
      <Center y={230} style={up(F, a + 0.05, 10, 30)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}><DeskIcon size={110} /><Wordmark size={84} /></div>
        <Chip size={38} color="#fff" bg={OR} style={{marginTop: 30}}>डेमो हवा असेल तर</Chip>
      </Center>
      {vis(F, K.dm - 0.2) && <div style={{...abs(110, 560), width: 860, ...popS(F, K.dm - 0.2, 10)}}>
        <div style={btn(vis(F, K.dm), '#DD2A7B')}>
          <InstagramLogo size={96} />
          <div><T size={52} w={800}>DM करा</T><div style={{...BRAND, fontSize: 34, fontWeight: 600, color: MUTE, marginTop: 6}}>@outgridlabs</div></div>
        </div>
      </div>}
      {vis(F, K.number - 0.2) && <div style={{...abs(110, 820), width: 860, ...popS(F, K.number - 0.2, 10)}}>
        <div style={btn(vis(F, K.wa), '#25D366')}>
          <div style={{width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo src="whatsapp.svg" size={92} /></div>
          <div><T size={30} w={600} color={MUTE}>WhatsApp करा</T><div style={{...BRAND, fontSize: 64, fontWeight: 800, color: INK, marginTop: 6, letterSpacing: '0.01em'}}>{PHONE}</div></div>
        </div>
      </div>}
    </AbsoluteFill>
  );
};

const Outro = ({F}) => (
  <AbsoluteFill>
    <Center y={360}><div style={{transform: `scale(${pop(F, OUTRO_AT + 0.05, 11)})`}}><DeskIcon size={220} /></div></Center>
    <Center y={640} style={up(F, OUTRO_AT + 0.25, 12, 30)}><Wordmark size={120} /></Center>
    <Center y={800} style={up(F, OUTRO_AT + 0.45, 12, 30)}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}><Mark size={44} color={INK} /><div style={{...BRAND, fontSize: 40, fontWeight: 600, color: MUTE}}>by Outgrid Labs</div></div>
    </Center>
    <Center y={960} style={up(F, OUTRO_AT + 0.65, 12, 30)}><Chip size={40}><Logo src="whatsapp.svg" size={46} />{PHONE}</Chip></Center>
  </AbsoluteFill>
);

/* ---------- main ---------- */
const COMPS = {hook: Hook, who: Who, evening: Evening, mismatch: Mismatch, loss: Loss, intro: Intro, gate: Gate1, offline: Offline, mobile: Mobile, cta: Cta, outro: Outro};
const LABELS = {hook: '// 3 people, 3 numbers', who: '// whose number?', evening: '// every evening', mismatch: '// hisheb', loss: '// one trip a day', intro: '// crusherdesk',
  gate: '// gate entry', offline: '// no internet', mobile: '// live on mobile', cta: '// book a demo'};
const Video = () => <IsoVideo scenes={SCENES} comps={COMPS} labels={LABELS} chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} hi={ORT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
