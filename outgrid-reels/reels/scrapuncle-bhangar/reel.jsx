/*
 * Digital bhangarwala (ScrapUncle, The Kabadiwala, Scrapdeal) — Outgrid Labs reel, LEAN light style, 1080x1920. VO at original speed.
 * Real assets (user-supplied): public/img/mukul*.jpg, team.jpg, van.jpg, su_logo.jpg (cropped from the van), warehouse.jpg, c_*.jpg (scrap collage tiles).
 * App screens, the pickup example (18.6 kg x ₹15), revenue bars and the "your city" app are illustrative.
 * Captions: captions.js from align_whisper.py; every cue is a real spoken word time (cues.mjs / timing.mjs via make_timing.py).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark} from '../../shared/kit.jsx';
import {BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_RED, LAT, up, Glass, Chip, Ico, Tick, I_PIN, I_BELL, I_BLDG, Instagram, LeanOutro, LeanVideo} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';
import {w, C, K, SCENES, OUTRO_AT, HOOK_END} from './cues.mjs';

const TOTAL = s(OUTRO_AT + 2.4);
const CHUNKS = CAPS.filter((c) => c.a >= s(HOOK_END) - 2)
  .map((c) => ({...c, words: c.words.filter((x) => x.w.trim() !== '—')})).filter((c) => c.words.length);

/* ---------- helpers ---------- */
const SU = '#2E9B46', SU_D = '#1D6B33', INKC = '#1F1F1F';
const DEV = '०१२३४५६७८९';
const dv = (str) => String(str).replace(/\d/g, (d) => DEV[d]);
const dev = (n) => dv(Math.round(n).toLocaleString('en-IN'));
const cnt = (F, a, b, v0, v1) => io(F, s(a), s(b), v0, v1, Easing.out(Easing.cubic));
const popS = (F, t, d = 11) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const drop = (F, t, h = 300) => {
  const p = pop(F, t, 9);
  const land = io(F, s(t) + 6, s(t) + 9) * io(F, s(t) + 9, s(t) + 14, 1, 0);
  return {opacity: F < s(t) ? 0 : 1, transform: `translateY(${(1 - p) * -h}px) scale(${1 + 0.06 * land}, ${1 - 0.08 * land})`, transformOrigin: '50% 100%'};
};
const Marker = ({F, t, children, color = Y}) => (
  <span style={{background: `linear-gradient(transparent 62%, ${color} 62%, ${color} 92%, transparent 92%) no-repeat left / ${io(F, s(t), s(t) + 8) * 100}% 100%`, padding: '0 6px'}}>{children}</span>
);
const Big = ({children, size = 150, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const Photo = ({src, w: W, h, F, a = 0, b = 6, z0 = 1.0, z1 = 1.1, pos = 'center', r = 40, style = {}, children}) => (
  <div style={{width: W, height: h, borderRadius: r, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 70px rgba(60,45,10,0.22)', border: '8px solid #fff', boxSizing: 'border-box', ...style}}>
    <Img src={staticFile(`img/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${io(F, s(a), s(b), z0, z1, Easing.linear)})`}} />
    {children}
  </div>
);
const Thumb = ({src, size = 150, r = 28, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: r, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 14px 30px rgba(60,45,10,0.18)', flexShrink: 0, ...style}}>
    <Img src={staticFile(`img/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </div>
);
const SULogo = ({w: W = 300, style = {}}) => (
  <div style={{width: W, height: W * 0.76, borderRadius: W * 0.1, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(30,90,50,0.22)', ...style}}>
    <Img src={staticFile('img/su_logo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </div>
);
const PhoneL = ({x, y, w: W, h, children, style = {}}) => (
  <div style={{...abs(x, y), width: W, height: h, borderRadius: W * 0.13, background: '#1d1d1f', padding: 12, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.28)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: W * 0.11, overflow: 'hidden', background: '#FAF8F3', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 14), marginLeft: -50, width: 100, height: 28, borderRadius: 14, background: '#1d1d1f'}} />
    </div>
  </div>
);
const Pin = ({children, color = SU, size = 34}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: size, fontWeight: 600, color: MUTED}}><Ico d={I_PIN} size={size * 1.05} color={color} sw={2.4} /><span style={{marginTop: size * 0.18}}>{children}</span></div>
);
const TickBadge = ({size = 90, color = C_GREEN}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 30px ${color}66`}}>
    <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </div>
);
const Cross = ({size = 90}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: C_RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 30px ${C_RED}66`}}>
    <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
  </div>
);
const Rings = ({F, t, x, y, color = Y, r = 160}) => F < s(t) ? null : (
  <>{[0, 12].map((d) => { const p = io(F, s(t) + d, s(t) + d + 24); return <div key={d} style={{...abs(x - r, y - r), width: 2 * r, height: 2 * r, borderRadius: '50%', border: `5px solid ${color}`, opacity: 1 - p, transform: `scale(${0.5 + p})`}} />; })}</>
);

/* ---------- vectors ---------- */
const ScaleV = ({W = 800, kg = 0}) => ( // platform scale like the agents carry
  <svg viewBox="0 0 320 200" width={W} height={W * 0.625} style={{display: 'block', overflow: 'visible'}}>
    <ellipse cx="160" cy="192" rx="150" ry="8" fill="rgba(0,0,0,0.12)" />
    <path d="M30 40h260l14 28H16z" fill="#2B2B2B" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${48 + i * 32} 46l-4 16`} stroke="#3C3C3C" strokeWidth="5" />)}
    <rect x="16" y="68" width="288" height="118" rx="10" fill="#353535" />
    <rect x="80" y="96" width="160" height="62" rx="8" fill="#F1F3EE" stroke="#1A1A1A" strokeWidth="4" />
    <rect x="92" y="106" width="136" height="42" rx="4" fill="#BFE3B2" />
    <text x="160" y="140" textAnchor="middle" fontSize="34" fontWeight="700" fill="#173B12" fontFamily="Anek, sans-serif">{kg.toFixed(1)} kg</text>
    {[40, 270].map((x) => <circle key={x} cx={x} cy="127" r="9" fill="#555" />)}
  </svg>
);
const Sack = ({size = 320}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
    <path d="M38 12c4 6 20 6 24 0l4 10c14 8 24 28 22 50-2 20-18 26-38 26S14 92 12 72c-2-22 8-42 22-50z" fill="#F4F2EC" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M36 22c8 4 20 4 28 0" stroke={INKC} strokeWidth="3" fill="none" /><path d="M30 50c10 4 30 4 42 0M26 70c14 5 36 5 50 0" stroke="#D3CFC4" strokeWidth="3" fill="none" />
  </svg>
);
const Truck = ({W = 600, spin = 0, c = SU}) => ( // small cargo truck (Tata Ace-style mini truck)
  <svg viewBox="0 0 200 110" width={W} height={W * 0.55} style={{display: 'block'}}>
    <rect x="8" y="30" width="118" height="56" rx="4" fill={c} stroke={INKC} strokeWidth="3.5" />
    {[30, 52, 74, 96].map((x) => <path key={x} d={`M${x} 36v44`} stroke="rgba(0,0,0,0.18)" strokeWidth="3" />)}
    <rect x="16" y="14" width="104" height="18" rx="3" fill="#F2EEE3" stroke={INKC} strokeWidth="3" />
    <path d="M126 40h34l22 22v24h-56z" fill="#F7F7F2" stroke={INKC} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M136 46h20l14 14h-34z" fill="#BFE0F2" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <rect x="178" y="70" width="8" height="6" rx="2" fill={Y} />
    {[44, 158].map((x) => <g key={x} transform={`rotate(${spin} ${x} 90)`}><circle cx={x} cy="90" r="15" fill={INKC} /><circle cx={x} cy="90" r="6" fill="#ccc" /><path d={`M${x - 10} 90h20`} stroke="#666" strokeWidth="3" /></g>)}
  </svg>
);
const Bundle = ({W = 150}) => ( // tied newspaper bundle
  <svg viewBox="0 0 60 30" width={W} height={W / 2} style={{display: 'block'}}>
    <rect x="2" y="2" width="56" height="26" rx="3" fill="#EDE8DC" stroke={INKC} strokeWidth="2" />
    {[8, 13, 18, 23].map((y) => <path key={y} d={`M5 ${y}h50`} stroke="#C9C1AE" strokeWidth="1.6" />)}
    <path d="M20 2v26M40 2v26" stroke="#8B5E34" strokeWidth="2.4" />
  </svg>
);
const Skyline = ({W = 900}) => (
  <svg viewBox="0 0 900 380" width={W} height={W * 0.42} style={{display: 'block'}}>
    {[[20, 170, 110], [140, 110, 90], [240, 200, 130], [380, 80, 100], [490, 150, 120], [620, 60, 90], [720, 190, 150]].map(([x, y, bw], i) => (
      <g key={i}><rect x={x} y={y} width={bw} height={380 - y} rx="6" fill={i % 2 ? '#E2DCCD' : '#D6CFBD'} />
        {Array.from({length: Math.floor((380 - y - 30) / 40)}, (_, r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 18 + c * (bw / 2 - 8)} y={y + 22 + r * 40} width={bw / 2 - 30} height="16" rx="3" fill="#F7F3EA" />))}</g>
    ))}
    <rect y="372" width="900" height="8" fill="#C9C1AE" />
  </svg>
);
const Calc = ({size = 220}) => (
  <svg viewBox="0 0 60 76" width={size} height={size * 1.27} style={{display: 'block'}}>
    <rect x="2" y="2" width="56" height="72" rx="8" fill={INKC} /><rect x="8" y="8" width="44" height="16" rx="3" fill="#BFE3B2" />
    <text x="48" y="21" textAnchor="end" fontSize="11" fontWeight="700" fill="#173B12" fontFamily="Anek, sans-serif">₹ ?</text>
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={8 + c * 15} y={30 + r * 11} width="12" height="8" rx="2" fill={r === 3 && c === 2 ? Y : '#4A4A4A'} />))}
  </svg>
);
const Glyph = ({d, size = 120, color = SU}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const G_PERSON = <><circle cx="12" cy="7" r="3.6" /><path d="M5 21c0-4.4 3.1-7 7-7s7 2.6 7 7" /></>;
const G_HOUSE = <><path d="M3 11l9-7 9 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></>;
const G_SHOP = <><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.2 3 2.6 3s2.7-1.3 2.7-3c0 1.7 1.3 3 3 3s3-1.3 3-3" /><path d="M5.5 12v8h13v-8M10 20v-5h4v5" /></>;
const G_SOC = <><rect x="2.5" y="7" width="8" height="14" rx="1" /><rect x="13.5" y="3" width="8" height="18" rx="1" /><path d="M5 10.5h3M5 14h3M5 17.5h3M16 6.5h3M16 10h3M16 13.5h3M16 17h3M1.5 21h21" /></>;
const G_RECYCLE = <><path d="M7 19H4.5a1.5 1.5 0 0 1-1.3-2.2L5 13.6" /><path d="M11 19h8.5a1.5 1.5 0 0 0 1.3-2.2l-1.6-2.8" /><path d="M14 16l-3 3 3 3" /><path d="M8.3 9.4 10.7 5a1.5 1.5 0 0 1 2.6 0l4.1 7.1" /><path d="M4.3 9.1 8.3 9.4 9.9 5.7" /><path d="M17.5 8.2l-.1 4-4-.2" /></>;

/* ================= scenes ================= */

/* 1. hook: bhangar -> ₹15 crore (content at frame 0, no subtitles) */
const Hook = ({F}) => {
  const n = cnt(F, K.koti - 0.15, K.koti + 0.6, 0, 15);
  const p = pop(F, K.koti - 0.15, 9);
  return (
    <AbsoluteFill>
      <div style={{...abs(72, 215), fontSize: 40, fontWeight: 600, color: MUTED, ...LAT}}>Startup Story</div>
      <div style={{...abs(66, 300), display: 'flex', alignItems: 'center', gap: 30, fontSize: 136, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>
        <span>भंगार</span>
        <Thumb src="c_paper.jpg" size={140} style={{transform: `rotate(6deg) translateY(${Math.sin(F / 14) * 6}px)`}} />
        <svg viewBox="0 0 40 24" width={110} height={66} style={{opacity: io(F, s(K.koti) - 10, s(K.koti) - 2)}}><path d="M2 12h32M24 3l10 9-10 9" fill="none" stroke={GOLD_T} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{...abs(60, 480), opacity: F < s(K.koti) - 5 ? 0 : 1, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: '0% 80%'}}>
        <Big size={170}><Marker F={F} t={K.koti + 0.35}>₹{dev(n)} कोटी</Marker></Big>
      </div>
      <div style={{...abs(90, 730), transform: `rotate(-2.5deg) translateY(${io(F, 0, 16, 70, 0)}px)`}}>
        <Photo src="mukul.jpg" w={900} h={560} F={F} a={0} b={HOOK_END} z0={1.02} z1={1.14} pos="40% 40%" />
      </div>
      <div style={{...abs(600, 1240), ...popS(F, K.khari, 9)}}>
        <div style={{transform: 'rotate(-5deg)', background: Y, color: BG, borderRadius: 18, padding: '16px 32px 8px', fontSize: 46, fontWeight: 700, boxShadow: '0 16px 40px rgba(255,197,46,0.45)'}}>खरी गोष्ट</div>
      </div>
    </AbsoluteFill>
  );
};

/* 2. Mukul Chhabra puts the kabadiwala on an app */
const Founder = ({F}) => {
  const a = C(3), sl = io(F, s(K.app) - 8, s(K.app) + 8, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{...abs(80, 250), transform: 'rotate(-2deg)'}}><Photo src="mukul_face.jpg" w={540} h={680} F={F} a={a} b={C(5)} pos="50% 25%" /></div>
      <Glass x={70} y={960} w={560} h={190} r={34} style={{padding: '34px 38px 0', ...up(F, K.mukul - 0.15, 12, 30)}}>
        <div style={{fontSize: 56, fontWeight: 700, color: TXT, lineHeight: 1.1}}>मुकुल छाबरा</div>
        <div style={{marginTop: 10}}><Pin size={32}>दिल्ली · Founder</Pin></div>
      </Glass>
      <PhoneL x={640} y={330} w={380} h={780} style={{opacity: sl, transform: `translateX(${(1 - sl) * 420}px) rotate(${4 * sl}deg)`}}>
        <div style={{padding: '64px 22px 0', display: 'flex', justifyContent: 'center'}}><SULogo w={200} style={{boxShadow: 'none'}} /></div>
        <div style={{margin: '18px 18px 0', borderRadius: 22, overflow: 'hidden', height: 300}}><Img src={staticFile('img/team.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 60%'}} /></div>
        <div style={{margin: '22px 18px', height: 84, borderRadius: 20, background: SU, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, paddingTop: 6, boxSizing: 'border-box'}}>पिकअप बुक करा</div>
      </PhoneL>
    </AbsoluteFill>
  );
};

/* 3. ScrapUncle logo */
const Logo = ({F}) => (
  <AbsoluteFill>
    <Rings F={F} t={K.su} x={540} y={640} color={SU} r={300} />
    <Center y={360} style={popS(F, K.su - 0.15, 10)}><SULogo w={680} /></Center>
    <Center y={960} style={up(F, K.su + 0.2, 10, 24)}><Chip color={SU_D} size={40}>Online Kabadiwala App</Chip></Center>
  </AbsoluteFill>
);

/* 4. book a pickup in the app */
const ITEMS = [['c_paper.jpg', 'पेपर'], ['c_bottles.jpg', 'प्लास्टिक'], ['c_cans.jpg', 'कॅन'], ['c_tv.jpg', 'ई-वेस्ट']];
const Book = ({F}) => {
  const a = C(6), tb = K.book, done = F >= s(tb) + 8;
  const press = 1 - 0.06 * io(F, s(tb) - 3, s(tb)) * io(F, s(tb) + 2, s(tb) + 6, 1, 0);
  return (
    <AbsoluteFill>
      <PhoneL x={230} y={210} w={620} h={1170} style={up(F, a, 12, 60)}>
        <div style={{padding: '70px 34px 0', display: 'flex', alignItems: 'center', gap: 18}}>
          <SULogo w={130} style={{boxShadow: 'none', border: `1.5px solid ${LINE}`}} />
          <div><div style={{fontSize: 34, fontWeight: 700, color: INKC, ...LAT}}>ScrapUncle</div><div style={{fontSize: 24, color: '#777'}}>पिकअप बुक करा</div></div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, padding: '30px 30px 0'}}>
          {ITEMS.map(([src, l], i) => {
            const on = i < 2 && F >= s(a) + 6 + i * 6;
            return (
              <div key={l} style={{borderRadius: 22, background: '#fff', border: `3px solid ${on ? SU : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden', position: 'relative'}}>
                <Img src={staticFile(`img/${src}`)} style={{width: '100%', height: 190, objectFit: 'cover', display: 'block'}} />
                <div style={{padding: '12px 16px 6px', fontSize: 30, fontWeight: 600, color: INKC}}>{l}</div>
                {on && <div style={{...abs(196, 12), ...popS(F, (s(a) + 6 + i * 6) / FPS, 10)}}><TickBadge size={50} color={SU} /></div>}
              </div>
            );
          })}
        </div>
        <div style={{...abs(30, 930), width: 536, height: 120, borderRadius: 30, background: done ? '#E6F5EA' : SU, border: done ? `3px solid ${SU}` : 'none', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 38, fontWeight: 700, color: done ? SU_D : '#fff', paddingTop: 6, transform: `scale(${press})`}}>
          {done ? <><Tick size={40} color={SU} />उद्या · 11 AM</> : 'पिकअप बुक करा'}
        </div>
        {F >= s(tb) && F < s(tb) + 22 && <div style={{...abs(298 - 60, 990 - 60), width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.6)', transform: `scale(${io(F, s(tb), s(tb) + 18, 0.3, 2.4)})`, opacity: io(F, s(tb), s(tb) + 20, 0.9, 0)}} />}
      </PhoneL>
    </AbsoluteFill>
  );
};

/* 5. the agent comes home */
const Home = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(165, 230), transform: 'rotate(1.5deg)'}}><Photo src="team.jpg" w={750} h={1004} F={F} a={C(7)} b={C(8)} z0={1.0} z1={1.08} /></div>
    <Glass x={120} y={1120} w={640} h={130} r={34} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px', ...up(F, K.ghari - 0.2, 12, 30)}}>
      <div style={{width: 76, height: 76, borderRadius: 20, background: SU, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={I_BELL} size={44} color="#fff" sw={2.2} /></div>
      <div style={{fontSize: 38, fontWeight: 600, color: TXT, paddingTop: 6}}>एजंट दारात पोहोचला</div>
    </Glass>
  </AbsoluteFill>
);

/* 6. weighed on a digital scale */
const Scale = ({F}) => {
  const a = C(8), kg = cnt(F, K.kata, K.kata + 0.9, 0, 18.6);
  return (
    <AbsoluteFill>
      <div style={{...abs(310, 300), ...drop(F, a + 0.1, 500)}}><Photo src="c_paper.jpg" w={460} h={420} F={F} a={a} b={C(9)} r={30} /></div>
      <div style={{...abs(140, 700)}}><ScaleV W={800} kg={kg} /></div>
      <Center y={1250} style={popS(F, K.vajan, 11)}><Chip color={SU_D} size={38}>100% True Weight</Chip></Center>
    </AbsoluteFill>
  );
};

/* 7. paid instantly */
const Paid = ({F}) => {
  const n = cnt(F, K.paise, K.paise + 0.6, 0, 279);
  return (
    <AbsoluteFill>
      <Glass x={120} y={340} w={840} h={760} r={48} style={{...up(F, C(9), 12, 50)}}>
        <Center y={70} style={{width: 840, ...popS(F, K.paise - 0.1, 10)}}><TickBadge size={170} /></Center>
        <Center y={300} style={{width: 840}}><Big size={160}>₹{dev(n)}</Big></Center>
        <Center y={490} style={{width: 840, fontSize: 38, fontWeight: 500, color: MUTED, ...LAT}}>18.6 kg × ₹15</Center>
        <Center y={590} style={{width: 840, ...popS(F, K.khat, 11)}}><Chip color={C_GREEN} size={40}>खात्यात जमा</Chip></Center>
      </Glass>
    </AbsoluteFill>
  );
};

/* 8. Shark Tank: ₹60 lakh */
const Shark = ({F}) => {
  const r = io(F, s(K.shark), s(K.shark) + 14);
  return (
    <AbsoluteFill>
      <div style={{...abs(120, 220), transform: 'rotate(-2deg)'}}>
        <Photo src="van.jpg" w={840} h={732} F={F} a={C(10)} b={C(12)} z0={1.0} z1={1.08}>
          <svg viewBox="0 0 840 732" width={840} height={732} style={{position: 'absolute', left: -8, top: -8}}>
            <ellipse cx="573" cy="230" rx="78" ry="150" fill="none" stroke={Y} strokeWidth="9" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - r} transform="rotate(-6 573 230)" />
          </svg>
        </Photo>
      </div>
      <Glass x={330} y={850} w={640} h={330} r={40} style={{padding: '40px 46px 0', transform: `rotate(3deg) scale(${F < s(K.lakh) - 4 ? 0 : pop(F, K.lakh - 0.12, 10)})`}}>
        <div style={{fontSize: 34, fontWeight: 600, color: MUTED}}>Shark Tank India · गुंतवणूक</div>
        <Big size={130} style={{marginTop: 26}}><Marker F={F} t={K.lakh + 0.25}>₹६० लाख</Marker></Big>
      </Glass>
    </AbsoluteFill>
  );
};

/* 9. revenue ₹15.5 crore */
const BARS = [0.16, 0.27, 0.42, 0.63, 1];
const Revenue = ({F}) => {
  const a = C(12), n = cnt(F, K.ulad - 0.1, K.r155 + 0.4, 0, 15.5);
  return (
    <AbsoluteFill>
      <Glass x={100} y={260} w={880} h={1000} r={48} style={{padding: '50px 56px 0', ...up(F, a, 12, 50)}}>
        <div style={{fontSize: 38, fontWeight: 600, color: MUTED}}>वार्षिक उलाढाल</div>
        <Big size={150} style={{marginTop: 20}}>₹{dv(n.toFixed(1))} <span style={{color: SU}}>कोटी</span></Big>
        <div style={{...abs(56, 400), width: 768, height: 520, display: 'flex', alignItems: 'flex-end', gap: 28, borderBottom: `3px solid ${LINE}`}}>
          {BARS.map((v, i) => {
            const g = io(F, s(a) + 4 + i * 4, s(K.r155) + 6, 0, 1, Easing.out(Easing.cubic));
            return <div key={i} style={{flex: 1, height: 500 * v * g, borderRadius: '18px 18px 0 0', background: i === 4 ? SU : 'rgba(46,155,70,0.22)', boxShadow: i === 4 ? `0 0 30px ${SU}55` : 'none'}} />;
          })}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 10. 2026 funding ₹22 crore */
const Funding = ({F}) => {
  const n = cnt(F, K.r22 - 0.1, K.r22 + 0.6, 0, 22);
  return (
    <AbsoluteFill>
      <Center y={250} style={up(F, C(13), 12, 40)}><Thumb src="mukul.jpg" size={330} r={165} style={{border: '10px solid #fff'}} /></Center>
      <Center y={640} style={popS(F, K.y2026 - 0.1, 10)}><div style={{background: INKC, color: '#fff', borderRadius: 999, padding: '16px 40px 8px', fontSize: 50, fontWeight: 700, ...LAT}}>२०२६</div></Center>
      <Rings F={F} t={K.r22} x={540} y={850} />
      <Center y={770} style={{opacity: F < s(K.r22) - 4 ? 0 : 1, transform: `scale(${pop(F, K.r22 - 0.12, 9)})`}}><Big size={180}><Marker F={F} t={K.r22 + 0.3}>₹{dev(n)} कोटी</Marker></Big></Center>
      <Center y={1020} style={popS(F, K.fund - 0.05, 11)}><Chip color={GOLD_T} size={44}>फंडिंग</Chip></Center>
    </AbsoluteFill>
  );
};

/* 11-13. not just Delhi: Bhopal, Pune */
const CityMap = ({F}) => {
  const P = [['दिल्ली', 560, 330, C(15)], ['भोपाळ', 480, 690, K.delhi], ['पुणे', 300, 1010, K.nahi - 0.1]];
  return (
    <AbsoluteFill>
      <Glass x={90} y={220} w={900} h={1110} r={48} style={{...up(F, C(15), 12, 40), backgroundImage: 'radial-gradient(rgba(0,0,0,0.10) 2px, transparent 2.5px)', backgroundSize: '36px 36px'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {P.slice(1).map(([n, x, y, t]) => (
          <path key={n} d={`M560 330 Q ${(560 + x) / 2 + 120} ${(330 + y) / 2} ${x} ${y}`} fill="none" stroke={SU} strokeWidth="8" strokeDasharray="3 9" strokeLinecap="round"
            pathLength="100" strokeDashoffset={0} style={{opacity: io(F, s(t) - 8, s(t))}} />
        ))}
      </svg>
      {P.map(([n, x, y, t], i) => (
        <div key={n} style={{...abs(x - 60, y - 130), display: 'flex', alignItems: 'center', gap: 14, ...popS(F, t, 10), transformOrigin: '60px 130px'}}>
          <svg viewBox="0 0 24 30" width={120} height={150}><path d="M12 29s10-9.4 10-17A10 10 0 0 0 2 12c0 7.6 10 17 10 17z" fill={i ? SU : INKC} /><circle cx="12" cy="12" r="4" fill="#fff" /></svg>
          <div style={{fontSize: 52, fontWeight: 700, color: TXT, marginTop: -40}}>{n}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
const BrandCard = ({F, t, name, city, initials}) => (
  <Glass x={90} y={240} w={900} h={250} r={44} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '0 44px', ...up(F, t, 12, 40)}}>
    <div style={{width: 150, height: 150, borderRadius: 40, background: SU, color: '#fff', fontSize: 62, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 10, boxSizing: 'border-box', ...LAT}}>{initials}</div>
    <div><div style={{fontSize: 72, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>{name}</div><div style={{marginTop: 8}}><Pin size={38}>{city}</Pin></div></div>
  </Glass>
);
const Kab = ({F}) => {
  const tr = io(F, s(K.tata) - 10, s(K.tata) + 14, 0, 1, Easing.out(Easing.cubic)), n = cnt(F, K.r10 - 0.1, K.r10 + 0.5, 0, 10);
  return (
    <AbsoluteFill>
      <BrandCard F={F} t={C(16)} name="The Kabadiwala" city="भोपाळ" initials="TK" />
      <div style={{...abs(230 - (1 - tr) * 900, 560)}}><Truck W={620} spin={-(1 - tr) * 900} /></div>
      <div style={{...abs(760, 540), ...popS(F, K.tata + 0.15, 9)}}><div style={{width: 120, height: 120, borderRadius: 60, background: Y, color: BG, fontSize: 64, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box', boxShadow: '0 12px 30px rgba(255,197,46,0.5)'}}>१</div></div>
      <Center y={980} style={{opacity: F < s(K.r10) - 4 ? 0 : 1, transform: `scale(${pop(F, K.r10 - 0.12, 10)})`}}><Big size={160}><Marker F={F} t={K.r10 + 0.3}>₹{dev(n)} कोटी</Marker></Big></Center>
      <Center y={1180} style={up(F, K.r10 + 0.3, 10, 20)}><div style={{fontSize: 40, fontWeight: 600, color: MUTED}}>उलाढाल</div></Center>
    </AbsoluteFill>
  );
};
const Sdeal = ({F}) => {
  const n = cnt(F, K.r2 - 0.1, K.r2 + 0.5, 0, 2);
  const g = io(F, s(C(19)) + 6, s(K.r2) + 10, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <BrandCard F={F} t={C(19)} name="Scrapdeal" city="पुणे" initials="SD" />
      <svg viewBox="0 0 800 300" width={800} height={300} style={{...abs(140, 600)}}>
        <path d="M10 280 C 160 260 260 220 380 170 S 640 60 790 20" fill="none" stroke={SU} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - g} />
        <circle cx="790" cy="20" r={16 * g} fill={SU} />
      </svg>
      <Center y={960} style={{opacity: F < s(K.r2) - 4 ? 0 : 1, transform: `scale(${pop(F, K.r2 - 0.12, 10)})`}}><Big size={170}><Marker F={F} t={K.r2 + 0.3}>₹{dev(n)} कोटी</Marker></Big></Center>
      <Center y={1170} style={up(F, K.r2 + 0.3, 10, 20)}><div style={{fontSize: 40, fontWeight: 600, color: MUTED}}>उलाढाल</div></Center>
    </AbsoluteFill>
  );
};

/* 14. now your city's math */
const Math1 = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(90, 700), ...up(F, C(21), 14, 60)}}><Skyline W={900} /></div>
    <div style={{...abs(420, 420), ...popS(F, K.shahar - 0.1, 10), transformOrigin: '50% 100%'}}>
      <div style={{background: INKC, color: '#fff', borderRadius: 999, padding: '16px 34px 8px', fontSize: 46, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10}}><Ico d={I_PIN} size={44} color={Y} sw={2.4} />तुमचं शहर</div>
    </div>
    <div style={{...abs(700, 760), transform: `rotate(8deg) scale(${F < s(K.ganit) - 3 ? 0 : pop(F, K.ganit - 0.1, 9)})`}}><Calc size={230} /></div>
  </AbsoluteFill>
);

/* 15. 50,000 people -> 10,000 homes */
const Row = ({F, t, glyph, n, label, y, count}) => (
  <Glass x={90} y={y} w={900} h={430} r={44} style={{padding: '40px 50px 0', ...up(F, t - 0.15, 12, 40)}}>
    <div style={{display: 'flex', gap: 10}}>
      {Array.from({length: 10}, (_, i) => <div key={i} style={{opacity: io(F, s(t) + i * 1.5, s(t) + i * 1.5 + 6), transform: `translateY(${io(F, s(t) + i * 1.5, s(t) + i * 1.5 + 8, 30, 0)}px)`}}><Glyph d={glyph} size={74} color={i < 10 ? SU : MUTED} /></div>)}
    </div>
    <Big size={140} style={{marginTop: 34}}>{dev(count)}</Big>
    <div style={{...abs(560, 290), fontSize: 50, fontWeight: 600, color: MUTED}}>{label}</div>
  </Glass>
);
const People = ({F}) => (
  <AbsoluteFill>
    <Row F={F} t={K.p50} glyph={G_PERSON} y={250} count={cnt(F, K.p50 - 0.1, K.p50 + 0.7, 0, 50000)} label="लोकसंख्या" />
    {F >= s(K.h10) - 6 && <Row F={F} t={K.h10} glyph={G_HOUSE} y={760} count={cnt(F, K.h10 - 0.1, K.h10 + 0.6, 0, 10000)} label="घरं" />}
  </AbsoluteFill>
);

/* 16. 5% of homes, once a month */
const PICK = [12, 27, 45, 61, 88];
const Pct = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(100, 230), display: 'flex', alignItems: 'center', gap: 26, ...popS(F, K.pct5 - 0.1, 10), transformOrigin: '0% 50%'}}>
      <Big size={150} color={SU}>५%</Big><div style={{fontSize: 46, fontWeight: 600, color: MUTED, marginTop: 20}}>घरं</div>
    </div>
    <div style={{...abs(140, 450), width: 800, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 14}}>
      {Array.from({length: 100}, (_, i) => {
        const on = PICK.includes(i), t = K.pct5 + PICK.indexOf(i) * 0.08;
        return <div key={i} style={{height: 66, borderRadius: 14, background: on && F >= s(t) ? SU : 'rgba(0,0,0,0.07)', transform: on ? `scale(${F >= s(t) ? 0.8 + 0.2 * pop(F, t, 8) + 0.15 * (1 - io(F, s(t), s(t) + 10)) : 1})` : 'none',
          boxShadow: on && F >= s(t) ? `0 0 24px ${SU}88` : 'none', opacity: io(F, s(C(24)) + (i % 10) + Math.floor(i / 10), s(C(24)) + (i % 10) + Math.floor(i / 10) + 6)}} />;
      })}
    </div>
    <div style={{...abs(140, 1270), ...up(F, K.mahina, 12, 30)}}><Chip color={SU_D} size={40}>महिन्यातून १ पिकअप</Chip></div>
  </AbsoluteFill>
);

/* 17. = 500 pickups */
const Pickups = ({F}) => (
  <AbsoluteFill>
    <Center y={300} style={popS(F, K.pick500 - 0.12, 10)}><Big size={260}><Marker F={F} t={K.pick500 + 0.2}>{dev(cnt(F, K.pick500 - 0.1, K.pick500 + 0.5, 0, 500))}</Marker></Big></Center>
    <Center y={600} style={up(F, K.pick500, 10, 20)}><div style={{fontSize: 52, fontWeight: 600, color: MUTED}}>पिकअप / महिना</div></Center>
    <div style={{...abs(110, 780), width: 860, display: 'flex', flexWrap: 'wrap', gap: '20px 16px'}}>
      {Array.from({length: 15}, (_, i) => <div key={i} style={drop(F, C(26) + 0.1 + i * 0.05, 120)}><Truck W={160} /></div>)}
    </div>
  </AbsoluteFill>
);

/* 18. avg 20 kg a pickup */
const Kg = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(380, 330), ...drop(F, C(27) + 0.15, 500)}}><Sack size={330} /></div>
    <div style={{...abs(140, 640)}}><ScaleV W={800} kg={cnt(F, K.kg20 - 0.3, K.kg20 + 0.3, 0, 20)} /></div>
  </AbsoluteFill>
);

/* 19. = 10,000 kg a month */
const Total = ({F}) => {
  const n = cnt(F, K.kg10k - 0.1, K.kg10k + 0.8, 0, 10000);
  return (
    <AbsoluteFill>
      <Center y={240} style={up(F, C(28), 10, 24)}><div style={{fontSize: 52, fontWeight: 600, color: MUTED, ...LAT}}>५०० × २० kg</div></Center>
      <Center y={340}><Big size={170}>{dev(n)} <span style={{fontSize: 90, color: SU}}>kg</span></Big></Center>
      <div style={{...abs(165, 600), width: 750, height: 680, display: 'flex', flexWrap: 'wrap-reverse', alignContent: 'flex-start', gap: 6}}>
        {Array.from({length: 35}, (_, i) => {
          const t = K.kg10k - 0.1 + i * 0.03;
          return <div key={i} style={{opacity: F >= s(t) ? 1 : 0, transform: `translateY(${(1 - pop(F, t, 12)) * -160}px)`}}><Bundle W={145} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 20. ₹6-8 margin per kg */
const Margin = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(170, 380), transform: `rotate(-6deg) scale(${F < s(K.rs68) - 4 ? 0 : pop(F, K.rs68 - 0.12, 9)})`}}>
      <svg viewBox="0 0 240 150" width={740} height={462} style={{display: 'block', filter: 'drop-shadow(0 30px 50px rgba(30,90,50,0.25))'}}>
        <path d="M60 6h170a8 8 0 0 1 8 8v122a8 8 0 0 1-8 8H60L4 75z" fill={SU} />
        <circle cx="44" cy="75" r="11" fill="#F7F3EA" />
        <text x="148" y="94" textAnchor="middle" fontSize="58" fontWeight="800" fill="#fff" fontFamily="Anek, sans-serif" letterSpacing="-2">₹६–८</text>
        <text x="148" y="128" textAnchor="middle" fontSize="22" fontWeight="600" fill="rgba(255,255,255,0.85)" fontFamily="Anek, sans-serif">प्रति kg</text>
      </svg>
    </div>
    <Center y={970} style={popS(F, K.margin - 0.05, 10)}><Chip color={GOLD_T} size={48}>मार्जिन</Chip></Center>
  </AbsoluteFill>
);

/* 21. ₹60-80 thousand a month */
const Profit = ({F}) => {
  const a = n => dev(cnt(F, K.r6080 - 0.1, K.r6080 + 0.7, 0, n));
  return (
    <AbsoluteFill>
      <Glass x={90} y={250} w={900} h={1000} r={48} style={{...up(F, C(30), 12, 50)}}>
        <Center y={60} style={{width: 900, fontSize: 46, fontWeight: 600, color: MUTED, ...LAT}}>१०,००० kg × ₹६–८</Center>
        <div style={{...abs(80, 150), width: 740, height: 3, background: LINE}} />
        <Center y={230} style={{width: 900, ...popS(F, C(30) + 0.15, 11)}}><Chip color={SU_D} size={42}>दर महिना</Chip></Center>
        <Rings F={F} t={K.r6080} x={450} y={480} color={SU} r={260} />
        <Center y={370} style={{width: 900, opacity: F < s(K.r6080) - 4 ? 0 : 1, transform: `scale(${pop(F, K.r6080 - 0.12, 9)})`}}>
          <Big size={170}><Marker F={F} t={K.r6080 + 0.4}>₹{a(60)}–{a(80)}</Marker></Big>
          <div style={{fontSize: 76, fontWeight: 700, color: SU, marginTop: 20}}>हजार</div>
        </Center>
        <div style={{...abs(0, 760), width: 900, display: 'flex', justifyContent: 'center', gap: 22}}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={drop(F, K.r6080 + 0.2 + i * 0.08, 200)}><div style={{width: 120, height: 120, borderRadius: 60, background: '#E9C04F', border: `5px solid ${INKC}`, fontSize: 56, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box', color: INKC}}>₹</div></div>)}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 22. plus shops, offices, societies */
const Extra = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(70, 480), display: 'flex', gap: 30}}>
      {[[G_SHOP, 'दुकानं', K.shops], [I_BLDG, 'ऑफिस', K.office], [G_SOC, 'सोसायट्या', K.soc]].map(([g, l, t]) => (
        <div key={l} style={{width: 293, height: 420, borderRadius: 40, background: 'var(--l-glass)', border: `1.5px solid ${LINE}`, boxShadow: 'var(--l-shadow)', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, ...drop(F, t - 0.1, 260)}}>
          <Glyph d={g} size={160} />
          <div style={{fontSize: 46, fontWeight: 600, color: TXT}}>{l}</div>
          <div style={{...abs(222, -26), width: 90, height: 90, borderRadius: 45, background: Y, color: BG, fontSize: 64, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box'}}>+</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/* 23. the kabadiwala is already in your city */
const Already = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(100, 260), transform: 'rotate(-1.5deg)'}}><Photo src="warehouse.jpg" w={880} h={700} F={F} a={C(33)} b={C(34)} z0={1.0} z1={1.1} /></div>
    <div style={{...abs(130, 1010), ...popS(F, C(33) + 0.4, 11), transformOrigin: '0% 50%'}}><div style={{background: INKC, color: '#fff', borderRadius: 999, padding: '16px 34px 8px', fontSize: 44, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10}}><Ico d={I_PIN} size={42} color={Y} sw={2.4} />तुमचं शहर</div></div>
    <div style={{...abs(830, 930), ...popS(F, K.already - 0.05, 9)}}><TickBadge size={150} /></div>
  </AbsoluteFill>
);

/* 24. customers ✓ stock ✓ */
const Have = ({F}) => (
  <AbsoluteFill>
    {[[K.cust, 'गिऱ्हाईक', 300, <div key="h" style={{display: 'flex', gap: 8}}>{[0, 1, 2, 3].map((i) => <Glyph key={i} d={G_HOUSE} size={78} />)}</div>],
      [K.maal, 'माल', 760, <div key="m" style={{display: 'flex', gap: 14}}>{['c_paper.jpg', 'c_bottles.jpg', 'c_cans.jpg'].map((x) => <Thumb key={x} src={x} size={110} r={22} />)}</div>]].map(([t, l, y, vis]) => (
      <Glass key={l} x={90} y={y} w={900} h={380} r={44} style={{padding: '46px 50px 0', ...up(F, t - 0.2, 12, 40)}}>
        <div style={{fontSize: 70, fontWeight: 700, color: TXT}}>{l}</div>
        <div style={{marginTop: 30}}>{vis}</div>
        <div style={{...abs(740, 110), ...popS(F, t + 0.25, 9)}}><TickBadge size={120} /></div>
      </Glass>
    ))}
  </AbsoluteFill>
);

/* 25. ... only no app */
const APPS = ['#5B8DEF', '#F2A33A', '#E2554F', '#43B581', '#9B6BDF', '#2CB5C0', '#F07AA8', '#7A8794', '#E8C547', '#4F6BED', '#58C27D'];
const HomeScreen = ({F, slot}) => (
  <div style={{padding: '110px 44px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '44px 40px'}}>
    {Array.from({length: 12}, (_, i) => i === 7 ? <div key={i}>{slot}</div> : (
      <div key={i} style={{width: 132, height: 132, borderRadius: 34, background: APPS[i > 7 ? i - 1 : i], opacity: 0.85}} />
    ))}
  </div>
);
const NoApp = ({F}) => (
  <AbsoluteFill>
    <PhoneL x={250} y={220} w={580} h={1130} style={up(F, C(35), 12, 50)}>
      <HomeScreen F={F} slot={<div style={{width: 132, height: 132, borderRadius: 34, border: `5px dashed ${C_RED}`, boxSizing: 'border-box', position: 'relative'}}>
        <div style={{...abs(14, 14), ...popS(F, K.noapp - 0.05, 9)}}><Cross size={94} /></div></div>} />
    </PhoneL>
    <div style={{...abs(330, 1030), ...popS(F, K.noapp + 0.1, 10)}}><div style={{background: C_RED, color: '#fff', borderRadius: 999, padding: '16px 36px 8px', fontSize: 46, fontWeight: 700, boxShadow: `0 16px 40px ${C_RED}55`}}>भंगार ॲप नाही</div></div>
  </AbsoluteFill>
);

/* 26. be the first digital bhangarwala */
const First = ({F}) => (
  <AbsoluteFill>
    <Rings F={F} t={K.pahila} x={540} y={560} r={240} />
    <Center y={330} style={popS(F, C(36) + 0.15, 10)}>
      <div style={{width: 460, height: 460, borderRadius: 120, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 40px 90px rgba(255,197,46,0.45)'}}><Glyph d={G_RECYCLE} size={290} color={BG} /></div>
    </Center>
    <div style={{...abs(700, 260), transform: `rotate(10deg) scale(${F < s(K.pahila) - 3 ? 0 : pop(F, K.pahila - 0.1, 8)})`}}>
      <div style={{width: 180, height: 180, borderRadius: 90, background: INKC, color: Y, fontSize: 84, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 10, boxSizing: 'border-box', border: `8px solid ${Y}`}}>#१</div>
    </div>
    <Center y={880} style={up(F, K.digital - 0.1, 12, 30)}><Pin size={44} color={GOLD_T}>तुमचं शहर</Pin></Center>
  </AbsoluteFill>
);

/* 27. comment "भंगार" */
const WORD = 'भंगार';
const Cta = ({F}) => {
  const a = C(38), posted = K.bhangar + 0.25;
  const typed = Array.from(WORD).slice(0, Math.floor(io(F, s(a) + 4, s(posted) - 3, 0, Array.from(WORD).length, Easing.linear))).join('');
  return (
    <AbsoluteFill>
      <Glass x={90} y={300} w={900} h={900} r={48} style={{overflow: 'hidden', ...up(F, a, 12, 50)}}>
        <div style={{padding: '40px 44px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1.5px solid ${LINE}`}}>
          <div style={{fontSize: 44, fontWeight: 700, color: TXT}}>Comments</div><Instagram size={64} />
        </div>
        {F >= s(posted) && <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '34px 44px 0', transform: `scale(${pop(F, posted, 12)})`, transformOrigin: '0% 50%'}}>
          <div style={{width: 90, height: 90, borderRadius: 45, background: '#E7DFCC'}} />
          <div><div style={{fontSize: 28, fontWeight: 600, color: MUTED}}>you · now</div>
            <div style={{marginTop: 6, background: Y, color: BG, borderRadius: 18, padding: '12px 28px 4px', fontSize: 58, fontWeight: 700, display: 'inline-block'}}>{WORD}</div></div>
        </div>}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '40px 44px 0', opacity: 0.55}}>
            <div style={{width: 90, height: 90, borderRadius: 45, background: 'rgba(0,0,0,0.08)'}} />
            <div><div style={{width: 160, height: 22, borderRadius: 11, background: 'rgba(0,0,0,0.08)'}} /><div style={{width: [420, 340, 480][i], height: 30, borderRadius: 15, background: 'rgba(0,0,0,0.08)', marginTop: 14}} /></div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 110, borderRadius: 55, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '8px 34px 0', fontSize: 46, fontWeight: 600, color: TXT}}>
          {F < s(posted) ? <>{typed}<span style={{color: '#0095F6', opacity: Math.floor(F / 8) % 2}}>|</span></> : <span style={{color: MUTED, fontSize: 36}}>Add a comment…</span>}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 28. we send the app demo + full business plan */
const Send = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={250} w={900} h={1030} r={48} style={{overflow: 'hidden', ...up(F, C(39), 12, 50)}}>
      <div style={{padding: '36px 40px 28px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: `1.5px solid ${LINE}`}}>
        <div style={{width: 104, height: 104, borderRadius: 52, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark size={56} color="#fff" /></div>
        <div style={{flex: 1}}><div style={{fontSize: 42, fontWeight: 700, color: TXT, ...LAT}}>outgridlabs</div><div style={{fontSize: 26, color: MUTED, ...LAT}}>Apps · Websites · Automation</div></div>
        <Instagram size={60} />
      </div>
      <div style={{padding: '40px 40px 0', display: 'flex', flexDirection: 'column', gap: 30}}>
        <div style={{width: 560, borderRadius: 30, overflow: 'hidden', background: '#fff', border: `1.5px solid ${LINE}`, transform: `scale(${F < s(K.demo) - 3 ? 0 : pop(F, K.demo - 0.1, 11)})`, transformOrigin: '0% 0%'}}>
          <div style={{height: 290, background: `linear-gradient(135deg, ${SU}, ${SU_D})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <div style={{width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 24 24" width={56} height={56}><path d="M8 5v14l11-7z" fill={SU_D} /></svg></div>
          </div>
          <div style={{padding: '18px 26px 10px', fontSize: 36, fontWeight: 700, color: INKC, ...LAT}}>App Demo</div>
        </div>
        <div style={{width: 560, borderRadius: 30, background: '#fff', border: `1.5px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 26px', boxSizing: 'border-box',
          transform: `scale(${F < s(K.plan) - 3 ? 0 : pop(F, K.plan - 0.1, 11)})`, transformOrigin: '0% 0%'}}>
          <div style={{width: 96, height: 116, borderRadius: 14, background: C_RED, color: '#fff', fontSize: 30, fontWeight: 800, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14, boxSizing: 'border-box'}}>PDF</div>
          <div><div style={{fontSize: 36, fontWeight: 700, color: INKC, ...LAT}}>Business Plan</div><div style={{fontSize: 26, color: '#888', ...LAT}}>भंगार ॲप · पूर्ण प्लॅन</div></div>
        </div>
      </div>
    </Glass>
  </AbsoluteFill>
);

const Outro = ({F}) => <LeanOutro F={F} at={OUTRO_AT} cta="Comment “भंगार”" />;

/* ---------- main ---------- */
const COMPS = {hook: Hook, founder: Founder, logo: Logo, book: Book, home: Home, scale: Scale, paid: Paid, shark: Shark, revenue: Revenue, funding: Funding,
  notonly: CityMap, kab: Kab, sdeal: Sdeal, math: Math1, people: People, pct: Pct, pickups: Pickups, kg: Kg, total: Total, margin: Margin, profit: Profit,
  extra: Extra, already: Already, have: Have, noapp: NoApp, first: First, cta: Cta, send: Send, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
