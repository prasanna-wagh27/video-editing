/*
 * Distributor / wholesaler order app reel (Marathi): "100-200 orders a day, still on WhatsApp?"
 * Retailer ordering app + distributor dashboard, CTA: comment "ORDER" for a live demo.
 * Price (₹2 lakh+) appears once, in the `who` scene only.
 * Logos: WhatsApp + Instagram glyphs from the kit (simple-icons, CC0).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, Easing} from 'remotion';
import {
  FPS, s, io, rise, pop, abs, Y, INK, GOLD, GREY, GREEN, RED, CARD_SHADOW,
  H, Hi, Center, Check, Mark, Twinkle, Search,
  WhatsAppLogo, InstagramLogo, Phone,
  buildChunks, scenesFromCuts, ReelVideo, BrandOutro,
} from '../../shared/kit.jsx';

/* ---------- timing (seconds) ---------- */
const SEGS = [
  [0.00, 2.21, 'रोज *१००-२०० ऑर्डर्स* येतात…'],
  [2.62, 4.54, 'पण त्या अजूनही *WhatsApp* वरच घेताय?'],
  [4.88, 6.17, 'तुमचा बिझनेस *वाढतोय,*'],
  [6.38, 8.77, 'पण ऑर्डर्स घेण्याची पद्धत अजूनही *तीच* आहे?'],
  [9.10, 11.95, 'कोणी *WhatsApp* वर ऑर्डर पाठवतं, कोणी *फोन* करतं.'],
  [12.19, 15.12, 'कोणाला किती *रेट* द्यायचा, कोणाकडे किती *स्टॉक* आहे,'],
  [15.31, 16.66, 'कोणाचं *पेमेंट* बाकी आहे…'],
  [16.93, 19.96, 'या सगळ्याचा हिशोब ठेवण्यातच तुमचा *अर्धा दिवस* जातो.'],
  [20.29, 24.08, 'आणि एवढं करूनही एखादी *ऑर्डर राहिली* किंवा *चुकीचा रेट* गेला,'],
  [24.29, 25.36, 'तर *नुकसान* तुमचंच!'],
  [25.71, 28.47, 'पण आता हे सगळं मॅन्युअली करण्याची *गरज नाही.*'],
  [28.74, 32.47, 'तुमच्या प्रत्येक रिटेलरला द्या तुमच्या बिझनेसचं *स्वतःचं ॲप!*'],
  [32.89, 34.15, 'रिटेलर *ॲप उघडेल,*'],
  [34.45, 35.15, '*प्रॉडक्ट निवडेल,*'],
  [35.38, 38.82, 'त्याला लागू असलेला *रेट पाहील* आणि स्वतः *ऑर्डर प्लेस* करेल.'],
  [39.14, 42.19, 'आणि तुम्हाला एका *डॅशबोर्डवर* दिसतील सर्व ऑर्डर्स,'],
  [42.42, 43.07, '*लाईव्ह स्टॉक,*'],
  [43.29, 45.84, '*रिटेलरनुसार प्राइसिंग* आणि *पेंडिंग पेमेंट्स.*'],
  [46.15, 47.81, 'ना WhatsApp मेसेजेसचा *गोंधळ,*'],
  [47.99, 49.80, 'ना ऑर्डर्स लिहून ठेवण्याची *कटकट!*'],
  [50.06, 51.07, 'तुमचा *वेळ वाचेल,*'],
  [51.29, 55.50, 'ऑर्डर मॅनेजमेंट *सोपं* होईल आणि तुम्ही *बिझनेस वाढवण्यावर* लक्ष देऊ शकाल.'],
  [55.81, 57.91, 'तुम्ही *डिस्ट्रिब्युटर* किंवा *होलसेलर* असाल आणि'],
  [58.10, 60.77, 'तुमच्या बिझनेससाठी *असंच ॲप* बनवायचं असेल,'],
  [60.95, 61.80, 'तर कमेंटमध्ये'],
  [62.01, 62.58, '*‘ORDER’* लिहा.'],
  [62.82, 64.78, 'आम्ही तुम्हाला याचा *लाईव्ह डेमो* दाखवू!'],
];
const OUTRO_AT = 65.0;
const KEYS = ['hook', 'growth', 'channels', 'questions', 'halfday', 'loss', 'turn', 'ownapp', 'flow', 'dashboard', 'nomore', 'benefits', 'who', 'comment', 'outro'];
const CUTS = [0, 4.71, 8.94, 12.07, 16.80, 20.12, 25.53, 28.60, 32.68, 38.98, 46.0, 49.93, 55.65, 60.86, OUTRO_AT, OUTRO_AT + 2.4];
const TOTAL = s(CUTS[CUTS.length - 1]);
const SC = scenesFromCuts(KEYS, CUTS);
const CHUNKS = buildChunks(SEGS);

/* ---------- helpers ---------- */
const DEV = '०१२३४५६७८९';
const dev = (n) => String(n).replace(/[0-9]/g, (d) => DEV[d]);
const inr = (n) => dev(Math.round(n).toLocaleString('en-IN'));
const SOFT = '#FFF4D1';
const LINE = '#ECE6D8';
const WA_BG = '#EFE7DC';
const SW = 5; // icon stroke width (viewBox units)

const Card = ({x, y, w, h, r = 36, bg = '#fff', style = {}, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, background: bg, boxShadow: CARD_SHADOW, boxSizing: 'border-box', ...style}}>{children}</div>
);
const Pill = ({children, bg = INK, color = '#fff', size = 34, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: bg, color, fontSize: size, fontWeight: 600, borderRadius: 999,
    padding: `${size * 0.32}px ${size * 0.7}px ${size * 0.18}px`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Stamp = ({F, t, children, color = RED, rot = -8, size = 88, style = {}}) => {
  const p = io(F, s(t), s(t) + 6, 0, 1, Easing.in(Easing.quad));
  const shake = F > s(t) + 6 && F < s(t) + 14 ? Math.sin(F * 2.2) * 3 : 0;
  return (
    <div style={{display: 'inline-block', border: `8px solid ${color}`, borderRadius: 24, color, fontSize: size, fontWeight: 700, lineHeight: 1, padding: `${size * 0.22}px ${size * 0.34}px ${size * 0.1}px`,
      background: 'rgba(255,255,255,0.94)', whiteSpace: 'nowrap', opacity: p, transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * p}) translateX(${shake}px)`, ...style}}>{children}</div>
  );
};
const XBadge = ({size = 120, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <circle cx="32" cy="32" r="30" fill={RED} /><path d="M21 21l22 22M43 21L21 43" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
  </svg>
);
const Strike = ({F, t, w, style = {}}) => (
  <svg width={w} height={30} style={{position: 'absolute', overflow: 'visible', ...style}}>
    <line x1="10" y1="22" x2={w - 10} y2="8" stroke={RED} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(t), s(t) + 9)} />
  </svg>
);
// red count badge (WhatsApp-style unread)
const Badge = ({n, size = 64, bg = RED, style = {}}) => (
  <div style={{minWidth: size, height: size, borderRadius: size / 2, background: bg, color: '#fff', fontSize: size * 0.5, fontWeight: 700, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: `${size * 0.1}px ${size * 0.22}px 0`, boxSizing: 'border-box', border: '5px solid #fff', fontVariantNumeric: 'tabular-nums', ...style}}>{n}</div>
);
const Avatar = ({name, size = 76, bg = '#DCD3C1'}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: bg, color: INK, fontSize: size * 0.42, fontWeight: 700, display: 'flex', alignItems: 'center',
    justifyContent: 'center', paddingTop: size * 0.08, boxSizing: 'border-box', flexShrink: 0}}>{name[0]}</div>
);

// green tick on a white disc (for green buttons)
const CheckW = ({size = 80}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="32" r="30" fill="#fff" /><path d="M18 33l9 9 19-20" fill="none" stroke={GREEN} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ---------- icons (one style: INK stroke 5, white / yellow fills) ---------- */
const Ledger = ({size = 200, scribble = 1}) => (
  <svg viewBox="0 0 120 140" width={size} height={size * 140 / 120}>
    <rect x="14" y="8" width="96" height="124" rx="8" fill="#fff" stroke={INK} strokeWidth={SW} />
    <rect x="14" y="8" width="20" height="124" rx="6" fill={Y} stroke={INK} strokeWidth={SW} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M44 ${30 + i * 14}h52`} stroke={LINE} strokeWidth="3" />)}
    {[0, 1, 2, 3, 4].map((i) => {
      const p = Math.max(0, Math.min(1, scribble * 5 - i));
      return <path key={i} d={`M46 ${27 + i * 14}c6-5 10 3 16-1s10 3 16-1 8 2 12 0`} fill="none" stroke={i === 3 ? RED : INK} strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />;
    })}
  </svg>
);
const Pen = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M44 6l14 14L24 54 8 58l4-16z" fill={Y} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M38 12l14 14M12 42l10 10" stroke={INK} strokeWidth="4" />
  </svg>
);
const Clock = ({size = 300, frac = 0.5, hand = 0}) => {
  const a = (frac * 360 - 90) * Math.PI / 180;
  const large = frac > 0.5 ? 1 : 0;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx="60" cy="60" r="54" fill="#fff" stroke={INK} strokeWidth="6" />
      {frac > 0.001 && <path d={`M60 60 L60 14 A46 46 0 ${large} 1 ${60 + 46 * Math.cos(a)} ${60 + 46 * Math.sin(a)} Z`} fill={Y} />}
      {Array.from({length: 12}, (_, i) => <line key={i} x1="60" y1="10" x2="60" y2={i % 3 ? 15 : 19} stroke={INK} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${i * 30} 60 60)`} />)}
      <line x1="60" y1="60" x2="60" y2="32" stroke={INK} strokeWidth="6" strokeLinecap="round" transform={`rotate(${hand / 12} 60 60)`} />
      <line x1="60" y1="60" x2="60" y2="20" stroke={RED} strokeWidth="4" strokeLinecap="round" transform={`rotate(${hand} 60 60)`} />
      <circle cx="60" cy="60" r="6" fill={INK} />
    </svg>
  );
};
const Bottle = ({size = 70}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="25" y="4" width="14" height="8" rx="2" fill={INK} />
    <path d="M26 12h12v6l6 8v32a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V26l6-8z" fill={Y} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <rect x="22" y="32" width="20" height="16" rx="2" fill="#fff" stroke={INK} strokeWidth="3" />
  </svg>
);
const Sack = ({size = 70}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M20 8h24l-4 10c10 6 14 16 14 26 0 8-6 14-14 14H24c-8 0-14-6-14-14 0-10 4-20 14-26z" fill="#F2E3C2" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M22 18h20" stroke={INK} strokeWidth="4" strokeLinecap="round" /><rect x="20" y="34" width="24" height="12" rx="2" fill="#fff" stroke={INK} strokeWidth="3" />
  </svg>
);
const Carton = ({size = 70, fill = '#E9C98D'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 20 32 8l26 12v28L32 60 6 48z" fill={fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M6 20l26 12 26-12M32 32v28" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M19 14l26 12v8" fill="none" stroke={INK} strokeWidth="3" />
  </svg>
);
const Tag = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 30V8a2 2 0 0 1 2-2h22l28 28-24 24z" fill={Y} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><circle cx="18" cy="18" r="5" fill="#fff" stroke={INK} strokeWidth="3" />
    <text x="38" y="43" textAnchor="middle" fontSize="20" fontWeight="800" fill={INK}>₹</text>
  </svg>
);
const Wallet = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M8 18h44a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill={INK} /><path d="M8 18l34-10 4 10" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <rect x="38" y="30" width="22" height="14" rx="4" fill={Y} /><circle cx="46" cy="37" r="3" fill={INK} />
  </svg>
);
const Boxes = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {[[4, 34], [32, 34], [18, 8]].map(([x, y], i) => (
      <g key={i}><rect x={x} y={y} width="28" height="24" rx="3" fill={i === 2 ? Y : '#E9C98D'} stroke={INK} strokeWidth="4" /><path d={`M${x + 10} ${y}v8h8v-8`} fill="none" stroke={INK} strokeWidth="3" /></g>
    ))}
  </svg>
);
const Person = ({size = 120, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="18" r="12" fill={color} /><path d="M8 60c0-18 11-27 24-27s24 9 24 27z" fill={color} /></svg>
);
const Calc = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="12" y="4" width="40" height="56" rx="6" fill="#fff" stroke={INK} strokeWidth="4" /><rect x="18" y="10" width="28" height="12" rx="2" fill={Y} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={19 + c * 10} y={28 + r * 10} width="6" height="6" rx="1.5" fill={INK} />))}
  </svg>
);
const CallI = ({size = 90, color = '#fff'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M20 6c2 0 4 1 5 3l5 10c1 2 0 4-1 5l-5 4c3 7 8 12 15 15l4-5c1-1 3-2 5-1l10 5c2 1 3 3 3 5v6c0 5-4 8-9 8C28 61 3 36 3 12c0-5 3-6 8-6z" fill={color} />
  </svg>
);
const Truck = ({size = 160}) => (
  <svg viewBox="0 0 120 80" width={size} height={size * 2 / 3}>
    <rect x="4" y="10" width="70" height="46" rx="5" fill={Y} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M74 26h22l16 16v14H74z" fill="#fff" stroke={INK} strokeWidth={SW} strokeLinejoin="round" /><path d="M82 32h12l9 10H82z" fill="#CFE6F5" stroke={INK} strokeWidth="3" />
    {[24, 92].map((x) => <g key={x}><circle cx={x} cy="60" r="11" fill={INK} /><circle cx={x} cy="60" r="4" fill="#fff" /></g>)}
  </svg>
);
const Growth = ({size = 120, color = GREEN}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 50l18-18 10 10 22-24" /><path d="M42 16h14v14" />
  </svg>
);
const ListCheck = ({size = 100}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="8" y="4" width="48" height="56" rx="6" fill="#fff" stroke={INK} strokeWidth="4" />
    {[0, 1, 2].map((i) => (
      <g key={i}><path d={`M16 ${20 + i * 14}l4 4 7-8`} fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d={`M32 ${21 + i * 14}h16`} stroke={INK} strokeWidth="4" strokeLinecap="round" /></g>
    ))}
  </svg>
);
const Play = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="32" r="30" fill={INK} /><path d="M26 20l18 12-18 12z" fill={Y} /></svg>
);
const Heart = ({size = 34, on = 0}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" fill={on ? RED : 'none'} stroke={on ? RED : INK} strokeWidth="2" /></svg>
);
// retailer shop front (awning + label)
const Shop = ({size = 160, awn = Y, label = ''}) => (
  <svg viewBox="0 0 120 112" width={size} height={size * 112 / 120}>
    <rect x="16" y="46" width="88" height="60" fill="#fff" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="26" y="60" width="38" height="28" rx="3" fill={SOFT} stroke={INK} strokeWidth="4" />
    <rect x="31" y="64" width="8" height="8" fill={GREEN} /><rect x="42" y="66" width="7" height="6" fill={RED} /><rect x="52" y="63" width="8" height="9" fill={GOLD} />
    <path d="M26 74h38" stroke={INK} strokeWidth="3" />
    <rect x="31" y="78" width="10" height="8" fill={GOLD} /><rect x="45" y="79" width="7" height="7" fill={GREEN} />
    <rect x="72" y="62" width="22" height="44" fill={INK} /><circle cx="89" cy="85" r="2.2" fill={Y} />
    <rect x="8" y="6" width="104" height="24" rx="6" fill={INK} />
    {label && <text x="60" y="24" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">{label}</text>}
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${10 + i * 20} 30h20v12a10 10 0 0 1 -20 0z`} fill={i % 2 ? '#fff' : awn} stroke={INK} strokeWidth="4" strokeLinejoin="round" />)}
    <path d="M4 106h112" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
  </svg>
);
// the distributor's own branded app icon (sample brand)
const BRAND_NAME = 'Shree Traders';
const AppIcon = ({size = 200, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.22)', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 64 64" width={size * 0.56} height={size * 0.56}>
      <path d="M6 20 32 8l26 12v28L32 60 6 48z" fill={Y} /><path d="M6 20l26 12 26-12M32 32v28" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </svg>
    <div style={{fontSize: size * 0.13, fontWeight: 700, color: '#fff', marginTop: size * 0.03, letterSpacing: 1, fontFamily: 'Anek, sans-serif'}}>ORDER</div>
  </div>
);

/* ---------- scenes ---------- */
// 1. Hook: unread orders flood the WhatsApp chat list
const CHATS = [
  ['गणेश किराणा', '१० बॉक्स तेल पाठवा', 4],
  ['साई ट्रेडर्स', 'आजचा रेट काय?', 2],
  ['माऊली स्टोअर्स', 'साखर ५ पोती', 7],
  ['ओम प्रोव्हिजन', 'कालची ऑर्डर आली नाही', 3],
  ['लक्ष्मी मार्ट', 'पेमेंट उद्या करतो', 1],
  ['जय भवानी स्टोअर', 'बिस्किट २० बॉक्स', 5],
  ['समर्थ किराणा', 'स्टॉक आहे का?', 2],
  ['श्री जनरल', 'तेच रेट लावा', 6],
  ['आई एकवीरा', 'डिलिव्हरी कधी?', 3],
  ['विठ्ठल ट्रेडिंग', 'साबण ३ केस', 4],
];
const CHAT_T = (i) => 0.05 + i * 0.24;
const Hook = ({from}) => {
  const F = useCurrentFrame() + from;
  const n = Math.round(io(F, 0, s(2.3), 0, 200, Easing.out(Easing.quad)));
  const buzz = F < s(2.4) ? Math.sin(F * 2.6) * 4 : 0;
  const tilt = io(F, s(2.6), s(3.2), 0, 1);
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={70} color={GREY} style={rise(F, -0.3)}>रोज</H>
        <H size={112} style={{...rise(F, -0.2), marginTop: -6}}><Hi t={0.1}>{dev('100')}–{dev('200')} ऑर्डर्स</Hi></H>
      </Center>
      <div style={{...abs(0, 500), width: 1080, height: 920, transform: `translateX(${buzz}px)`}}>
        <Phone x={210} y={0} w={560} h={900} rot={-3 * (1 - tilt) - 2 * tilt}>
          <div style={{position: 'absolute', inset: 0, background: '#fff', color: INK}}>
            <div style={{height: 150, background: '#fff', padding: '64px 30px 0', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `2px solid ${LINE}`}}>
              <div style={{fontSize: 40, fontWeight: 700, color: '#1F7A4D', fontFamily: 'Anek, sans-serif'}}>WhatsApp</div>
              <div style={{flex: 1}} />
              <Search size={36} color={INK} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {CHATS.map((_, k) => CHATS.length - 1 - k).map((i) => {
                const [name, msg, u] = CHATS[i];
                const g = io(F, s(CHAT_T(i)), s(CHAT_T(i)) + 5);
                return (
                  <div key={i} style={{height: 112 * g, overflow: 'hidden', opacity: g, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', background: g < 1 ? '#F1FBF4' : '#fff'}}>
                    <Avatar name={name} size={72} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: 28, fontWeight: 700, lineHeight: 1.2}}>{name}</div>
                      <div style={{fontSize: 24, fontWeight: 500, color: GREY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{msg}</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6}}>
                      <div style={{fontSize: 19, fontWeight: 600, color: '#25D366'}}>{`9:${String(10 + i * 3).padStart(2, '0')}`}</div>
                      <div style={{minWidth: 38, height: 38, borderRadius: 19, background: '#25D366', color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 3, boxSizing: 'border-box'}}>{u}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Phone>
        <div style={{...abs(640, -60), transform: `scale(${pop(F, -0.1, 10)}) rotate(8deg)`}}>
          <WhatsAppLogo size={190} style={{boxShadow: '0 20px 40px rgba(37,211,102,0.35)'}} />
          <Badge n={dev(n)} size={84} style={{...abs(130, -30)}} />
        </div>
      </div>
      {/* text hook part 2 */}
      <div style={{...abs(0, 1010), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 2.62, 11)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, background: INK, borderRadius: 36, padding: '22px 44px 14px 30px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', transform: 'rotate(-2deg)'}}>
          <WhatsAppLogo size={96} />
          <div style={{fontSize: 70, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap'}}>अजूनही <span style={{color: Y}}>WhatsApp</span> वरच?</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2. Growth: business grows, method stays the same
const BARS = [0.28, 0.42, 0.55, 0.72, 0.95];
const GrowthSc = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={70} style={rise(F, 4.8)}>बिझनेस <span style={{color: GREEN}}>वाढतोय</span></H>
        <H size={70} style={{...rise(F, 6.4), marginTop: 6}}>पद्धत अजूनही <Hi t={7.6}>तीच?</Hi></H>
      </Center>
      <Card x={70} y={480} w={450} h={700} r={44} style={{padding: 36, ...rise(F, 4.85)}}>
        <div style={{fontSize: 40, fontWeight: 700}}>ऑर्डर्स / दिवस</div>
        <svg viewBox="0 0 380 460" width="378" height="460" style={{marginTop: 30, overflow: 'visible'}}>
          <path d="M10 440H370" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          {BARS.map((b, i) => {
            const h = 380 * b * io(F, s(5.0 + i * 0.18), s(5.0 + i * 0.18) + 14);
            return <rect key={i} x={22 + i * 70} y={440 - h} width="50" height={h} rx="8" fill={i === 4 ? Y : '#E6DCC6'} stroke={INK} strokeWidth="4" />;
          })}
          <path d="M40 330 L120 270 L190 230 L260 160 L340 50" fill="none" stroke={GREEN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(5.4), s(6.3))} />
          <path d="M310 46 L345 44 L342 80" fill="none" stroke={GREEN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={io(F, s(6.2), s(6.4))} />
        </svg>
      </Card>
      <Card x={560} y={480} w={450} h={700} r={44} style={{padding: 36, ...rise(F, 6.4)}}>
        <div style={{fontSize: 40, fontWeight: 700}}>ऑर्डर घेण्याची पद्धत</div>
        <div style={{...abs(60, 170), transform: 'rotate(-6deg)'}}><Ledger size={210} scribble={io(F, s(6.6), s(8.4))} /></div>
        <div style={{...abs(250, 380), transform: `rotate(${Math.sin(F / 3) * 6}deg)`}}><Pen size={110} /></div>
        <div style={{...abs(260, 170)}}><WhatsAppLogo size={120} round /></div>
        <div style={{...abs(0, 560), width: 450, display: 'flex', justifyContent: 'center'}}><Pill bg="#EDE6D6" color={GREY} size={38}>वर्षानुवर्षं तीच</Pill></div>
      </Card>
    </AbsoluteFill>
  );
};

// 3. Channels: orders come via WhatsApp and phone calls
const Channels = ({from}) => {
  const F = useCurrentFrame() + from;
  const ring = F > s(10.9) ? Math.sin(F * 1.8) * 5 * io(F, s(10.9), s(11.1)) : 0;
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={72} style={rise(F, 9.0)}>ऑर्डर्स येतात <Hi t={9.3}>कुठूनही</Hi></H>
      </Center>
      {/* WhatsApp order */}
      <Card x={70} y={400} w={760} h={330} r={40} bg={WA_BG} style={{transform: `scale(${pop(F, 9.15)})`, transformOrigin: '0% 50%', padding: 30}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <WhatsAppLogo size={84} />
          <div><div style={{fontSize: 34, fontWeight: 700}}>गणेश किराणा</div><div style={{fontSize: 24, fontWeight: 600, color: GREEN}}>● online</div></div>
        </div>
        <div style={{marginTop: 26, display: 'inline-block', background: '#fff', borderRadius: '26px 26px 26px 8px', padding: '18px 26px 10px', fontSize: 40, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transform: `scale(${pop(F, 9.5)})`, transformOrigin: '0% 100%'}}>
          भाऊ, १० बॉक्स तेल पाठवा <span style={{fontSize: 22, color: '#8a8478'}}>9:42</span>
        </div>
      </Card>
      {/* incoming call */}
      <Card x={250} y={790} w={760} h={330} r={40} bg="#1d1d1d" style={{transform: `scale(${pop(F, 10.6)}) translateX(${ring}px)`, transformOrigin: '100% 50%', padding: 34, color: '#fff'}}>
        <div style={{fontSize: 26, fontWeight: 600, color: '#9a968c'}}>Incoming call…</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 14}}>
          <Avatar name="साई" size={96} bg={Y} />
          <div><div style={{fontSize: 44, fontWeight: 700}}>साई ट्रेडर्स</div><div style={{fontSize: 26, color: '#9a968c'}}>+91 98xxx xxx21</div></div>
        </div>
        <div style={{display: 'flex', gap: 40, marginTop: 26, justifyContent: 'flex-end'}}>
          <div style={{width: 86, height: 86, borderRadius: 43, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(135deg)'}}><CallI size={46} /></div>
          <div style={{width: 86, height: 86, borderRadius: 43, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.08 * Math.sin(F / 3)})`}}><CallI size={46} /></div>
        </div>
      </Card>
      {/* distributor in the middle, overwhelmed */}
      <div style={{...abs(455, 1150), transform: `scale(${pop(F, 9.4)})`}}>
        <div style={{width: 170, height: 170, borderRadius: 85, background: Y, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', border: `6px solid ${INK}`}}><Person size={140} /></div>
        <div style={{textAlign: 'center', fontSize: 30, fontWeight: 700, marginTop: 8}}>तुम्ही</div>
      </div>
    </AbsoluteFill>
  );
};

// 4. Questions: rate? stock? payment pending?
const QS = [
  [12.25, <Tag key="t" size={110} />, 'कोणाला किती', 'रेट?'],
  [13.7, <Boxes key="b" size={110} />, 'कोणाकडे किती', 'स्टॉक?'],
  [15.3, <Wallet key="w" size={110} />, 'कोणाचं', 'पेमेंट बाकी?'],
];
const Questions = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Center top={200}><H size={66} color={GREY} style={rise(F, 12.1)}>आणि डोक्यात सतत…</H></Center>
      {QS.map(([t, icon, a, b], i) => (
        <Card key={i} x={90 + (i % 2) * 40} y={360 + i * 330} w={860} h={280} r={40} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '0 50px', ...rise(F, t - 0.1), transform: `${rise(F, t - 0.1).transform} rotate(${i % 2 ? 1.5 : -1.5}deg)`}}>
          <div style={{width: 160, height: 160, borderRadius: 40, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 44, fontWeight: 500, color: GREY}}>{a}</div>
            <div style={{fontSize: 76, fontWeight: 700, lineHeight: 1.1}}>{b}</div>
          </div>
          <div style={{width: 100, height: 100, borderRadius: 50, background: RED, color: '#fff', fontSize: 70, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box', transform: `scale(${pop(F, t + 0.3, 9)})`}}>?</div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

// 5. Half day lost in bookkeeping
const HalfDay = ({from}) => {
  const F = useCurrentFrame() + from;
  const frac = io(F, s(17.2), s(19.4), 0, 0.5, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={64} color={GREY} style={rise(F, 16.9)}>हिशोब ठेवण्यातच</H>
        <H size={100} style={{...rise(F, 17.1), marginTop: 4}}><Hi t={18.6}>अर्धा दिवस</Hi> जातो</H>
      </Center>
      <div style={{...abs(170, 470), transform: `scale(${pop(F, 16.95)})`}}><Clock size={560} frac={frac} hand={frac * 720 * 12} /></div>
      <div style={{...abs(250, 1080), width: 400, display: 'flex', justifyContent: 'center', opacity: io(F, s(19.0), s(19.4))}}>
        <Pill bg={INK} size={44}><span style={{color: Y}}>{dev(Math.round(frac * 2 * 6))} तास</span> हिशोबात</Pill>
      </div>
      <div style={{...abs(700, 850), transform: `rotate(8deg) scale(${pop(F, 17.6)})`}}><Ledger size={230} scribble={io(F, s(17.6), s(19.8))} /></div>
      <div style={{...abs(860, 1080), transform: `rotate(${Math.sin(F / 2.5) * 10}deg) scale(${pop(F, 17.8)})`}}><Pen size={110} /></div>
      <div style={{...abs(50, 900), transform: `rotate(-10deg) scale(${pop(F, 18.0)})`}}><Calc size={150} /></div>
    </AbsoluteFill>
  );
};

// 6. Loss: missed order, wrong rate
const Loss = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Card x={80} y={200} w={920} h={330} r={40} style={{padding: '36px 44px', ...rise(F, 20.3)}}>
        <div style={{fontSize: 30, fontWeight: 700, color: GREY, letterSpacing: 1}}>ऑर्डर #{dev(214)}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 18}}>
          <Carton size={130} />
          <div><div style={{fontSize: 52, fontWeight: 700}}>गणेश किराणा</div><div style={{fontSize: 36, color: GREY}}>तेल · {dev(10)} बॉक्स</div></div>
        </div>
        <div style={{...abs(560, 60)}}><Stamp F={F} t={21.9} size={64} rot={-10}>राहिली!</Stamp></div>
      </Card>
      <Card x={80} y={580} w={920} h={330} r={40} style={{padding: '36px 44px', ...rise(F, 22.6)}}>
        <div style={{fontSize: 30, fontWeight: 700, color: GREY, letterSpacing: 1}}>साई ट्रेडर्स · रेट</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 18}}>
          <Bottle size={130} />
          <div style={{position: 'relative'}}>
            <div style={{fontSize: 40, color: GREY}}>ठरलेला: ₹{inr(1840)}</div>
            <div style={{fontSize: 70, fontWeight: 700, color: RED, opacity: io(F, s(23.4), s(23.7))}}>गेला: ₹{inr(1720)}</div>
          </div>
        </div>
        <div style={{...abs(700, 70), transform: `scale(${pop(F, 23.5, 9)})`}}><XBadge size={140} /></div>
      </Card>
      <div style={{...abs(80, 960), width: 920, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <svg viewBox="0 0 300 200" width="330" height="220" style={{opacity: io(F, s(24.1), s(24.4))}}>
          <path d="M10 30 L90 60 L150 50 L210 120 L280 170" fill="none" stroke={RED} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(24.2), s(25.0))} />
          <path d="M250 172h34v-34" fill="none" stroke={RED} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={io(F, s(24.9), s(25.1))} />
        </svg>
        <Stamp F={F} t={24.45} size={90} rot={-6}>नुकसान!</Stamp>
      </div>
    </AbsoluteFill>
  );
};

// 7. Turn: no need to do it manually
const MANUAL = [<Ledger key="l" size={120} />, <Calc key="c" size={130} />, <WhatsAppLogo key="w" size={120} />, <div key="p" style={{width: 120, height: 120, borderRadius: 30, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CallI size={70} /></div>];
const Turn = ({from}) => {
  const F = useCurrentFrame() + from;
  const dim = io(F, s(27.0), s(27.4));
  return (
    <AbsoluteFill>
      <Center top={230}>
        <H size={66} color={GREY} style={rise(F, 25.7)}>हे सगळं</H>
        <H size={110} style={{...rise(F, 25.9), marginTop: 4}}>मॅन्युअली?</H>
      </Center>
      <div style={{...abs(90, 600), width: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {MANUAL.map((m, i) => (
          <div key={i} style={{width: 200, height: 200, borderRadius: 40, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${pop(F, 26.0 + i * 0.15)}) translateY(${dim * 30}px)`, filter: `grayscale(${dim})`, opacity: 1 - dim * 0.45}}>{m}</div>
        ))}
        <Strike F={F} t={27.0} w={920} style={{left: -10, top: 86}} />
      </div>
      <Center top={960}>
        <div style={{transform: `scale(${pop(F, 27.5, 10)})`, display: 'flex', alignItems: 'center', gap: 24, background: GREEN, borderRadius: 999, padding: '20px 56px 12px 26px', boxShadow: '0 20px 50px rgba(31,168,85,0.35)'}}>
          <CheckW size={96} />
          <div style={{fontSize: 84, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap'}}>गरज नाही!</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 8. Own app for every retailer
const SHOPS = [['गणेश', 80, 520], ['साई', 760, 520], ['माऊली', 80, 1050], ['लक्ष्मी', 760, 1050]];
const OwnApp = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={60} color={GREY} style={rise(F, 28.75)}>प्रत्येक रिटेलरला</H>
        <H size={96} style={{...rise(F, 30.3), marginTop: 4}}><Hi t={31.3}>स्वतःचं ॲप!</Hi></H>
      </Center>
      <svg width="1080" height="1400" style={{...abs(0, 0)}}>
        {SHOPS.map(([, x, y], i) => {
          const p = io(F, s(30.0 + i * 0.2), s(30.0 + i * 0.2) + 12);
          const x2 = x + 120, y2 = y + 90;
          return <path key={i} d={`M540 870 L${540 + (x2 - 540) * p} ${870 + (y2 - 870) * p}`} stroke={INK} strokeWidth="6" strokeDasharray="4 18" strokeLinecap="round" strokeDashoffset={-F * 2} />;
        })}
      </svg>
      <div style={{...abs(540 - 140, 870 - 150), transform: `scale(${pop(F, 29.0, 10)})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <AppIcon size={280} />
        <div style={{marginTop: 16, fontSize: 38, fontWeight: 700, fontFamily: 'Anek, sans-serif', whiteSpace: 'nowrap'}}>{BRAND_NAME}</div>
      </div>
      {SHOPS.map(([n, x, y], i) => {
        const t = 29.8 + i * 0.2;
        return (
          <div key={i} style={{...abs(x, y), transform: `scale(${pop(F, t)})`}}>
            <Shop size={240} label={`${n} स्टोअर`} />
            <div style={{...abs(170, 120), transform: `scale(${pop(F, t + 1.0, 9)})`}}><AppIcon size={90} style={{boxShadow: '0 8px 16px rgba(0,0,0,0.25)', border: '4px solid #fff'}} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 9. Retailer flow inside the app
const PRODUCTS = [
  [<Bottle key="b" size={64} />, 'सनफ्लॉवर तेल 1L', '१२ नग / बॉक्स', 1840],
  [<Sack key="s" size={64} />, 'साखर 50kg', '१ पोतं', 2150],
  [<Carton key="c" size={64} />, 'बिस्किट बॉक्स', '४८ पुडे', 960],
  [<Carton key="d" size={64} fill="#CFE6F5" />, 'साबण केस', '७२ नग', 1380],
];
const STEPS = [[32.9, 'ॲप उघडा'], [34.45, 'प्रॉडक्ट निवडा'], [35.9, 'तुमचा रेट पहा'], [37.4, 'ऑर्डर प्लेस करा']];
const Flow = ({from}) => {
  const F = useCurrentFrame() + from;
  const splash = io(F, s(33.5), s(33.9), 1, 0);
  const detail = io(F, s(35.2), s(35.6), 0, 1, Easing.inOut(Easing.cubic));
  const qty = Math.min(5, 1 + Math.floor(Math.max(0, F - s(36.5)) / 6));
  const press = F > s(37.7) && F < s(37.95) ? 0.94 : 1;
  const done = io(F, s(38.0), s(38.3));
  const tapA = io(F, s(34.5), s(34.9)); // tap on first product
  return (
    <AbsoluteFill>
      <Phone x={70} y={210} w={560} h={1150} rot={-2}>
        <div style={{position: 'absolute', inset: 0, background: '#FAF7F0', color: INK}}>
          {/* list screen */}
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-detail * 100}%)`}}>
            <div style={{height: 170, background: INK, padding: '70px 30px 0', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16}}>
              <AppIcon size={64} style={{boxShadow: 'none', border: `2px solid ${Y}`}} />
              <div style={{color: '#fff'}}><div style={{fontSize: 30, fontWeight: 700, fontFamily: 'Anek, sans-serif'}}>{BRAND_NAME}</div><div style={{fontSize: 20, color: Y}}>नमस्कार, गणेश किराणा</div></div>
            </div>
            <div style={{margin: '22px 24px', height: 66, borderRadius: 33, background: '#fff', border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', fontSize: 24, color: '#a19d93'}}>
              <Search size={30} /> प्रॉडक्ट शोधा
            </div>
            {PRODUCTS.map(([ic, name, unit, rate], i) => (
              <div key={i} style={{margin: '0 24px 16px', height: 140, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px',
                boxShadow: i === 0 && tapA > 0 ? `0 0 0 ${5 * tapA}px ${Y}` : '0 2px 6px rgba(0,0,0,0.05)', ...rise(F, 33.6 + i * 0.1, 10)}}>
                <div style={{width: 96, height: 96, borderRadius: 20, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic}</div>
                <div style={{flex: 1}}><div style={{fontSize: 28, fontWeight: 700}}>{name}</div><div style={{fontSize: 22, color: GREY}}>{unit}</div></div>
                <div style={{fontSize: 28, fontWeight: 700}}>₹{inr(rate)}</div>
              </div>
            ))}
            {/* splash */}
            <div style={{position: 'absolute', inset: 0, background: INK, opacity: splash, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{transform: `scale(${pop(F, 32.95, 10)})`}}><AppIcon size={200} style={{boxShadow: 'none'}} /></div>
              <div style={{color: '#fff', fontSize: 40, fontWeight: 700, marginTop: 24, fontFamily: 'Anek, sans-serif'}}>{BRAND_NAME}</div>
            </div>
          </div>
          {/* detail screen */}
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - detail) * 100}%)`, background: '#FAF7F0'}}>
            <div style={{height: 380, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Bottle size={220} /></div>
            <div style={{padding: '28px 34px'}}>
              <div style={{fontSize: 40, fontWeight: 700}}>सनफ्लॉवर तेल 1L</div>
              <div style={{fontSize: 24, color: GREY}}>१२ नग / बॉक्स · स्टॉक: उपलब्ध</div>
              <div style={{marginTop: 26, borderRadius: 24, background: '#fff', border: `3px solid ${Y}`, padding: '20px 24px 14px', transform: `scale(${pop(F, 35.9, 11)})`}}>
                <div style={{fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: 1}}>तुमचा रेट (गणेश किराणा)</div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
                  <div style={{fontSize: 64, fontWeight: 700}}>₹{inr(1840)}</div>
                  <div style={{fontSize: 28, color: GREY, textDecoration: 'line-through'}}>₹{inr(1960)}</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28}}>
                <div style={{fontSize: 30, fontWeight: 600}}>बॉक्स</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 22, background: '#fff', borderRadius: 999, border: `2px solid ${LINE}`, padding: '8px 14px'}}>
                  <div style={{width: 52, height: 52, borderRadius: 26, background: '#EEE8DA', fontSize: 40, fontWeight: 700, textAlign: 'center', lineHeight: '58px'}}>−</div>
                  <div style={{fontSize: 40, fontWeight: 700, minWidth: 40, textAlign: 'center', paddingTop: 6}}>{dev(qty)}</div>
                  <div style={{width: 52, height: 52, borderRadius: 26, background: Y, fontSize: 40, fontWeight: 700, textAlign: 'center', lineHeight: '58px'}}>+</div>
                </div>
              </div>
              <div style={{marginTop: 22, display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 600}}><span style={{color: GREY}}>एकूण</span><span>₹{inr(1840 * qty)}</span></div>
            </div>
            <div style={{position: 'absolute', left: 30, right: 30, bottom: 40, height: 104, borderRadius: 30, background: done > 0 ? GREEN : INK, color: '#fff', fontSize: 38, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 6, boxSizing: 'border-box', transform: `scale(${press})`}}>
              {done > 0 ? <><CheckW size={56} /> ऑर्डर प्लेस झाली</> : 'ऑर्डर प्लेस करा'}
            </div>
          </div>
        </div>
      </Phone>
      {/* tap finger dot */}
      {[[34.55, 340, 520 + 0], [37.6, 340, 1250]].map(([t, x, y], i) => (
        <div key={i} style={{...abs(x - 40, y - 40), width: 80, height: 80, borderRadius: 40, background: 'rgba(18,18,18,0.25)', border: '4px solid rgba(255,255,255,0.9)',
          opacity: io(F, s(t) - 4, s(t)) * io(F, s(t) + 6, s(t) + 12, 1, 0), transform: `scale(${io(F, s(t), s(t) + 6, 1, 0.8)})`}} />
      ))}
      {/* steps */}
      <div style={{...abs(670, 330), display: 'flex', flexDirection: 'column', gap: 34}}>
        {STEPS.map(([t, label], i) => {
          const on = F >= s(t);
          return (
            <div key={i} style={{...rise(F, t - 0.15), display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{width: 84, height: 84, borderRadius: 42, background: on ? Y : '#E8E1D1', border: `5px solid ${INK}`, fontSize: 40, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', flexShrink: 0}}>{dev(i + 1)}</div>
              <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.15, width: 270, whiteSpace: 'normal'}}>{label}</div>
            </div>
          );
        })}
        <div style={{marginTop: 40, transform: `scale(${pop(F, 38.1, 10)})`, transformOrigin: '0% 50%'}}><Pill bg={GREEN} size={36}>स्वतः · २४×७</Pill></div>
      </div>
    </AbsoluteFill>
  );
};

// 10. Dashboard: all orders, live stock, retailer pricing, pending payments
const TileHead = ({label, dot = GREEN}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 700}}><div style={{width: 14, height: 14, borderRadius: 7, background: dot}} />{label}</div>
);
const STOCK = [['तेल', 0.78], ['साखर', 0.52], ['बिस्किट', 0.16], ['साबण', 0.64]];
const PRICES = [['गणेश किराणा', 1840], ['साई ट्रेडर्स', 1820], ['माऊली स्टोअर्स', 1860]];
const DUES = [['ओम प्रोव्हिजन', 48500, '१२ दिवस'], ['लक्ष्मी मार्ट', 32000, '५ दिवस'], ['समर्थ किराणा', 21500, '३ दिवस']];
const Dashboard = ({from}) => {
  const F = useCurrentFrame() + from;
  const tile = (t) => ({transform: `scale(${pop(F, t, 13)})`});
  const orders = Math.round(io(F, s(40.5), s(42.0), 0, 186, Easing.out(Easing.cubic)));
  const due = io(F, s(44.9), s(45.8), 0, 342500, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Center top={180}><H size={70} style={rise(F, 39.1)}>एका <Hi t={39.8}>डॅशबोर्डवर</Hi> सगळं</H></Center>
      <div style={{...abs(50, 330), width: 980, height: 1060, borderRadius: 40, background: '#1d1d1d', padding: 16, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,0.25)', ...rise(F, 39.15)}}>
        <div style={{width: '100%', height: '100%', borderRadius: 28, background: '#F4F1EA', overflow: 'hidden', position: 'relative'}}>
          <div style={{height: 84, background: '#fff', display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px', borderBottom: `2px solid ${LINE}`}}>
            <AppIcon size={52} style={{boxShadow: 'none'}} />
            <div style={{fontSize: 30, fontWeight: 700, fontFamily: 'Anek, sans-serif'}}>{BRAND_NAME} · Admin</div>
            <div style={{flex: 1}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 700, color: RED}}><div style={{width: 12, height: 12, borderRadius: 6, background: RED, opacity: 0.5 + 0.5 * Math.sin(F / 4)}} />LIVE</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20}}>
            {/* orders */}
            <div style={{background: '#fff', borderRadius: 24, padding: 24, height: 430, boxSizing: 'border-box', ...tile(40.4)}}>
              <TileHead label="आजच्या ऑर्डर्स" />
              <div style={{fontSize: 110, fontWeight: 700, lineHeight: 1.1, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>{dev(orders)}</div>
              {['गणेश किराणा · ₹९,२००', 'साई ट्रेडर्स · ₹४,६५०', 'माऊली · ₹१२,४००'].map((r, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 500, marginTop: 12, ...rise(F, 41.0 + i * 0.25, 8)}}>
                  <Check size={30} />{r}
                </div>
              ))}
            </div>
            {/* stock */}
            <div style={{background: '#fff', borderRadius: 24, padding: 24, height: 430, boxSizing: 'border-box', ...tile(42.4)}}>
              <TileHead label="लाईव्ह स्टॉक" dot={RED} />
              {STOCK.map(([n, v], i) => {
                const w = v * io(F, s(42.5 + i * 0.1), s(43.2 + i * 0.1)) + (i === 0 ? -0.04 * io(F, s(44), s(45)) : 0);
                const low = v < 0.25;
                return (
                  <div key={i} style={{marginTop: 22}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 600}}><span>{n}</span><span style={{color: low ? RED : GREY}}>{low ? 'कमी!' : `${dev(Math.round(w * 100))}%`}</span></div>
                    <div style={{height: 18, borderRadius: 9, background: '#EEE8DA', marginTop: 6, overflow: 'hidden'}}><div style={{height: '100%', width: `${w * 100}%`, borderRadius: 9, background: low ? RED : GREEN}} /></div>
                  </div>
                );
              })}
            </div>
            {/* pricing */}
            <div style={{background: '#fff', borderRadius: 24, padding: 24, height: 430, boxSizing: 'border-box', ...tile(43.3)}}>
              <TileHead label="रिटेलरनुसार रेट" dot={GOLD} />
              <div style={{fontSize: 22, color: GREY, marginTop: 6}}>सनफ्लॉवर तेल · बॉक्स</div>
              {PRICES.map(([n, p], i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 27, fontWeight: 600, padding: '16px 0 10px', borderBottom: i < 2 ? `2px solid ${LINE}` : 'none', ...rise(F, 43.6 + i * 0.2, 8)}}>
                  <span>{n}</span><span style={{background: SOFT, borderRadius: 12, padding: '4px 12px 0'}}>₹{inr(p)}</span>
                </div>
              ))}
            </div>
            {/* payments */}
            <div style={{background: '#fff', borderRadius: 24, padding: 24, height: 430, boxSizing: 'border-box', ...tile(44.75)}}>
              <TileHead label="पेंडिंग पेमेंट्स" dot={RED} />
              <div style={{fontSize: 64, fontWeight: 700, color: RED, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>₹{inr(Math.round(due / 100) * 100)}</div>
              {DUES.map(([n, a, d], i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 23, fontWeight: 500, marginTop: 14, ...rise(F, 45.0 + i * 0.15, 8)}}>
                  <span>{n}</span><span style={{color: GREY}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 11. No more WhatsApp mess, no more writing orders down
const NoMore = ({from}) => {
  const F = useCurrentFrame() + from;
  const Row = ({y, t, x, icon, a, b}) => (
    <Card x={80} y={y} w={920} h={380} r={44} style={{...rise(F, t - 0.15), padding: '40px 48px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, filter: `grayscale(${io(F, s(x), s(x) + 8) * 0.9})`}}>
        {icon}
        <div><div style={{fontSize: 44, fontWeight: 500, color: GREY}}>{a}</div><div style={{fontSize: 92, fontWeight: 700, lineHeight: 1.1}}>{b}</div></div>
      </div>
      <Strike F={F} t={x} w={820} style={{left: 50, top: 170}} />
      <div style={{...abs(760, -40), transform: `scale(${pop(F, x + 0.1, 9)})`}}><XBadge size={140} /></div>
    </Card>
  );
  return (
    <AbsoluteFill>
      <Row y={260} t={46.2} x={47.2} a="WhatsApp मेसेजेसचा" b="गोंधळ" icon={
        <div style={{position: 'relative', width: 230, height: 230}}>
          <WhatsAppLogo size={160} style={{...abs(0, 30)}} />
          {[0, 1, 2].map((i) => <div key={i} style={{...abs(110 + i * 10, 10 + i * 64), width: 100 - i * 14, height: 44, borderRadius: '18px 18px 18px 4px', background: '#fff', border: `4px solid ${INK}`,
            transform: `rotate(${(i - 1) * 10}deg) scale(${pop(F, 46.4 + i * 0.15)})`}} />)}
          <Badge n="९९+" size={70} style={{...abs(100, 0)}} />
        </div>} />
      <Row y={720} t={47.95} x={49.1} a="ऑर्डर्स लिहून ठेवण्याची" b="कटकट" icon={
        <div style={{position: 'relative', width: 230, height: 230}}>
          <div style={{...abs(20, 0)}}><Ledger size={170} scribble={io(F, s(48.0), s(49.0))} /></div>
          <div style={{...abs(130, 110), transform: `rotate(${Math.sin(F / 2.5) * 10}deg)`}}><Pen size={100} /></div>
        </div>} />
      <Center top={1180}><H size={60} color={GREY} style={rise(F, 49.3)}>आता सगळं <span style={{color: INK}}>एका ॲपमध्ये</span></H></Center>
    </AbsoluteFill>
  );
};

// 12. Benefits
const BENEFITS = [
  [50.1, <Clock key="c" size={120} frac={0.25} hand={60} />, 'तुमचा', 'वेळ वाचेल'],
  [51.4, <ListCheck key="l" size={120} />, 'ऑर्डर मॅनेजमेंट', 'सोपं होईल'],
  [53.2, <Growth key="g" size={120} />, 'लक्ष फक्त', 'बिझनेस वाढवण्यावर'],
];
const Benefits = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      {BENEFITS.map(([t, icon, a, b], i) => (
        <Card key={i} x={80} y={250 + i * 360} w={920} h={310} r={44} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '0 48px', ...rise(F, t - 0.1)}}>
          <div style={{width: 180, height: 180, borderRadius: 44, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 40, fontWeight: 500, color: GREY}}>{a}</div>
            <div style={{fontSize: i === 2 ? 62 : 78, fontWeight: 700, lineHeight: 1.12}}>{b}</div>
          </div>
          <div style={{transform: `scale(${pop(F, t + 0.4, 9)})`}}><Check size={90} /></div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

// 13. Who: distributor / wholesaler, + the only price mention
const Who = ({from}) => {
  const F = useCurrentFrame() + from;
  const price = io(F, s(58.3), s(58.6));
  return (
    <AbsoluteFill>
      <Center top={190}><H size={64} color={GREY} style={rise(F, 55.8)}>तुम्ही आहात…</H></Center>
      <div style={{...abs(80, 320), width: 920, display: 'flex', justifyContent: 'space-between'}}>
        {[[55.95, <Truck key="t" size={230} />, 'डिस्ट्रिब्युटर'], [57.0, <Boxes key="b" size={170} />, 'होलसेलर']].map(([t, ic, l], i) => (
          <div key={i} style={{width: 440, height: 380, borderRadius: 44, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
            transform: `scale(${pop(F, t)}) rotate(${i ? 2 : -2}deg)`}}>
            <div style={{height: 180, display: 'flex', alignItems: 'center'}}>{ic}</div>
            <div style={{fontSize: 56, fontWeight: 700}}>{l}</div>
          </div>
        ))}
      </div>
      {/* app + price (shown once) */}
      <div style={{...abs(80, 780), width: 920, height: 520, borderRadius: 48, background: INK, boxShadow: '0 40px 90px rgba(0,0,0,0.3)', overflow: 'hidden', transform: `scale(${pop(F, 58.15, 12)})`}}>
        <div style={{...abs(50, 60), display: 'flex', alignItems: 'center', gap: 30}}>
          <AppIcon size={150} style={{boxShadow: 'none', border: `4px solid ${Y}`}} />
          <div style={{color: '#fff'}}>
            <div style={{fontSize: 36, color: '#bdb6a6'}}>तुमच्या बिझनेससाठी</div>
            <div style={{fontSize: 66, fontWeight: 700, lineHeight: 1.1}}>असंच <span style={{color: Y}}>ॲप</span></div>
          </div>
        </div>
        <div style={{...abs(50, 280), width: 820, height: 2, background: '#333'}} />
        <div style={{...abs(50, 310), opacity: price, transform: `translateY(${(1 - price) * 30}px)`}}>
          <div style={{fontSize: 32, fontWeight: 600, color: '#bdb6a6'}}>प्रोजेक्ट खर्च</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
            <div style={{fontSize: 110, fontWeight: 700, color: Y, lineHeight: 1.1}}>₹{dev(2)} लाख</div>
            <div style={{fontSize: 44, fontWeight: 600, color: '#fff'}}>पासून सुरू</div>
          </div>
        </div>
        <Twinkle x={830} y={330} size={60} o={price} color={Y} />
      </div>
    </AbsoluteFill>
  );
};

// 14. Comment ORDER -> live demo
const WORD = 'ORDER';
const Comment = ({from}) => {
  const F = useCurrentFrame() + from;
  const typed = Math.min(WORD.length, Math.max(0, Math.floor((F - s(61.9)) / 3)));
  const sent = io(F, s(62.6), s(62.9));
  const caret = Math.floor(F / 8) % 2 && sent < 0.5;
  return (
    <AbsoluteFill>
      <Center top={180}>
        <H size={64} color={GREY} style={rise(F, 60.9)}>कमेंटमध्ये लिहा</H>
        <div style={{marginTop: 10, transform: `scale(${pop(F, 61.95, 9)}) rotate(-3deg)`, background: Y, borderRadius: 30, padding: '18px 60px 4px', boxShadow: '0 10px 0 rgba(217,154,0,0.3)'}}>
          <div style={{fontSize: 150, fontWeight: 800, letterSpacing: 8, lineHeight: 1, fontFamily: 'Anek, sans-serif'}}>“ORDER”</div>
        </div>
      </Center>
      {/* Instagram comment sheet */}
      <Card x={90} y={560} w={900} h={430} r={44} style={{...rise(F, 61.0), padding: 34, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <InstagramLogo size={64} />
          <div style={{fontSize: 32, fontWeight: 700}}>Comments</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 28, opacity: sent, transform: `translateY(${(1 - sent) * 30}px)`}}>
          <Avatar name="R" size={70} bg={SOFT} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 24, fontWeight: 700, color: GREY}}>you · आत्ता</div>
            <div style={{fontSize: 46, fontWeight: 700, letterSpacing: 2, fontFamily: 'Anek, sans-serif'}}>ORDER</div>
          </div>
          <div style={{transform: `scale(${pop(F, 63.0, 8)})`}}><Heart size={44} on={F > s(63.0)} /></div>
        </div>
        <div style={{position: 'absolute', left: 34, right: 34, bottom: 30, height: 92, borderRadius: 46, border: `3px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '6px 16px 0 30px', boxSizing: 'border-box', gap: 10}}>
          <div style={{flex: 1, fontSize: 40, fontWeight: 700, letterSpacing: 2, fontFamily: 'Anek, sans-serif', color: sent > 0.5 ? '#bbb' : INK}}>
            {sent > 0.5 ? <span style={{fontSize: 28, fontWeight: 500, letterSpacing: 0, color: '#aaa'}}>Add a comment…</span> : <>{WORD.slice(0, typed)}<span style={{opacity: caret ? 1 : 0, color: '#0095F6'}}>|</span></>}
          </div>
          <div style={{fontSize: 30, fontWeight: 700, color: '#0095F6', opacity: typed === WORD.length ? 1 : 0.35}}>Post</div>
        </div>
      </Card>
      {/* live demo */}
      <div style={{...abs(90, 1050), width: 900, height: 290, borderRadius: 44, background: INK, display: 'flex', alignItems: 'center', gap: 34, padding: '0 50px', boxSizing: 'border-box',
        boxShadow: '0 30px 70px rgba(0,0,0,0.28)', transform: `scale(${pop(F, 63.0, 11)})`}}>
        <div style={{width: 170, height: 170, borderRadius: 40, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Play size={120} /></div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 700, color: RED}}><div style={{width: 16, height: 16, borderRadius: 8, background: RED, opacity: 0.5 + 0.5 * Math.sin(F / 4)}} />LIVE</div>
          <div style={{fontSize: 74, fontWeight: 700, color: '#fff', lineHeight: 1.1}}>लाईव्ह <span style={{color: Y}}>डेमो</span></div>
          <div style={{fontSize: 32, color: '#bdb6a6'}}>आम्ही दाखवू!</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- brand outro ---------- */
const Outro = ({from}) => (
  <BrandOutro from={from} at={OUTRO_AT} cta={
    <div style={{padding: '14px 36px 6px', borderRadius: 40, background: INK}}>
      <H size={46} color="#fff"><span style={{color: Y}}>"ORDER"</span> कमेंट करा</H>
    </div>
  } />
);

/* ---------- main ---------- */
const SCENES = {hook: Hook, growth: GrowthSc, channels: Channels, questions: Questions, halfday: HalfDay, loss: Loss, turn: Turn, ownapp: OwnApp, flow: Flow,
  dashboard: Dashboard, nomore: NoMore, benefits: Benefits, who: Who, comment: Comment, outro: Outro};
const Video = ({font}) => <ReelVideo font={font} scenes={SCENES} keys={KEYS} SC={SC} chunks={CHUNKS} outroAt={s(OUTRO_AT)} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{font: 'anek'}} />;
registerRoot(Root);
