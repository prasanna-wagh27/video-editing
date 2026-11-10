/*
 * Small-town grocery delivery reel (Marathi): "Blinkit's 10-minute model doesn't work in small towns".
 * Zero-inventory model, unit economics, 4 apps, Outgrid Labs CTA (Bio link -> form -> call).
 * Logos: public/logos/blinkit.svg (Blinkit app icon, outlined), WhatsApp + Instagram glyphs from the kit.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, Easing, Img, staticFile} from 'remotion';
import {
  FPS, s, io, rise, pop, abs, Y, INK, GOLD, GREY, GREEN, RED, CARD_SHADOW,
  H, Hi, Center, Check, House, Twinkle, Mark, Lockup, BRAND,
  WhatsAppLogo, InstagramLogo, Msg, ChatScreen, Phone,
  buildChunks, scenesFromCuts, ReelVideo, BrandOutro,
} from '../../shared/kit.jsx';

/* ---------- timing (seconds) ---------- */
const SEGS = [
  [0.00, 2.47, 'छोट्या शहरांमध्ये Blinkit सारखं *१० मिनिटांचं* मॉडेल'],
  [2.76, 3.29, '*चालत नाही!*'],
  [3.61, 7.50, 'मग *५० हजार ते ३ लाख* लोकसंख्या असलेल्या शहरात…'],
  [7.80, 8.09, 'किराणा'],
  [8.27, 11.45, 'डिलिव्हरीचा *बिझनेस* कसा करायचा?'],
  [11.80, 13.75, 'गणित अगदी *साधं* आहे.'],
  [14.14, 15.48, 'छोट्या शहरात'],
  [15.77, 18.66, 'ग्राहकांना १० मिनिटांत डिलिव्हरी *नकोय…*'],
  [18.92, 20.79, 'त्यांना फक्त *घरबसल्या सोय* हवीय!'],
  [21.10, 24.27, 'आजही लोकांना साध्या किराण्यासाठी *बाजारात* जावं लागतं.'],
  [24.49, 27.09, 'आणि हीच तुमची सर्वात *मोठी संधी* आहे.'],
  [27.43, 30.84, 'लाखो रुपये लावून स्वतःचं *डार्क स्टोअर* उघडण्याची गरज नाही.'],
  [31.10, 31.71, 'त्याऐवजी'],
  [31.94, 33.47, '*झिरो इन्व्हेंटरी मॉडेल* वापरा!'],
  [33.75, 36.75, 'तुमच्या शहरातील मोठ्या *किराणा दुकानांसोबत* टाय-अप करा.'],
  [37.02, 38.66, 'ग्राहकाने ॲपवर *ऑर्डर* केली…'],
  [38.95, 40.18, 'दुकानदार ती *पॅक* करेल…'],
  [40.43, 41.70, 'आणि तुमचा डिलिव्हरी बॉय'],
  [41.91, 44.25, '*३० ते ४५ मिनिटांत* घरपोच देईल!'],
  [44.52, 46.94, 'कमीत कमी रिस्क… आणि *झिरो स्टॉक टेन्शन!*'],
  [47.25, 48.74, 'आता *कमाईचं गणित* समजून घ्या:'],
  [49.01, 50.82, 'जर दिवसाला *१०० ऑर्डर्स* आल्या…'],
  [51.04, 53.03, 'आणि सरासरी बिल *५०० रुपये* असेल.'],
  [53.24, 55.72, 'तर महिन्याचा सेल *१५ लाखांवर* जातो.'],
  [55.96, 58.93, 'यावर दुकानदाराकडून *८ ते १०%* कमिशन…'],
  [59.15, 60.07, 'आणि ग्राहकाकडून'],
  [60.29, 62.09, '*२० ते ३० रुपये* डिलिव्हरी फी!'],
  [62.32, 64.68, 'डिलिव्हरी बॉय आणि इतर खर्च वजा जाता…'],
  [64.85, 69.58, 'तुम्ही महिन्याला *१ ते दीड लाख* रुपयांचा निव्वळ नफा आरामात कमवू शकता.'],
  [69.87, 70.59, 'पण लक्षात ठेवा…'],
  [70.84, 73.19, 'हा बिझनेस फक्त *WhatsApp* वर चालणार नाही.'],
  [73.40, 76.31, 'प्रोफेशनल बिझनेससाठी तुम्हाला *स्वतःचं ॲप* लागेल!'],
  [76.59, 77.22, '*Customer App,*'],
  [77.55, 78.15, '*Store App,*'],
  [78.50, 79.64, '*Delivery App*'],
  [79.74, 80.40, 'आणि *Admin Panel.*'],
  [80.65, 83.71, 'आणि हीच संपूर्ण सिस्टीम तुमच्या बजेटमध्ये बनवून'],
  [83.96, 84.86, 'देईल *Outgrid Labs!*'],
  [85.08, 86.37, 'बिझनेस आयडिया *तुमची…*'],
  [86.57, 88.01, 'आणि टेक्नॉलॉजी *आमची!*'],
  [88.30, 91.47, 'तुमच्या शहरात स्वतःचा *डिलिव्हरी बिझनेस* सुरू करायचा असेल…'],
  [91.65, 94.61, 'तर आजच *Bio मधील लिंकवर* क्लिक करून फॉर्म भरा,'],
  [94.83, 96.38, 'आमची टीम तुम्हाला *कॉल* करेल.'],
];
const OUTRO_AT = 96.83;
const KEYS = ['hook', 'town', 'simple', 'market', 'darkstore', 'tieup', 'flow', 'math', 'income', 'profit', 'whatsapp', 'apps', 'outgrid', 'cta', 'outro'];
const CUTS = [0, 3.45, 11.62, 20.95, 27.26, 33.61, 36.89, 47.10, 55.84, 62.2, 69.72, 73.30, 80.52, 88.15, OUTRO_AT, OUTRO_AT + 2.4];
const TOTAL = s(CUTS[CUTS.length - 1]);
const SC = scenesFromCuts(KEYS, CUTS);
const CHUNKS = buildChunks(SEGS);

/* ---------- helpers ---------- */
const DEV = '०१२३४५६७८९';
const dev = (n) => String(n).replace(/[0-9]/g, (d) => DEV[d]);
const inr = (n) => dev(Math.round(n).toLocaleString('en-IN'));
const BLINKIT_Y = '#FFE141';
const SOFT = '#FFF4D1';
const SW = 5; // icon stroke width (viewBox units)

const Card = ({x, y, w, h, r = 36, bg = '#fff', style = {}, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, background: bg, boxShadow: CARD_SHADOW, boxSizing: 'border-box', ...style}}>{children}</div>
);
const Pill = ({children, bg = INK, color = '#fff', size = 34, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: bg, color, fontSize: size, fontWeight: 600, borderRadius: 999,
    padding: `${size * 0.32}px ${size * 0.7}px ${size * 0.18}px`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
// slammed rubber stamp
const Stamp = ({F, t, children, color = RED, rot = -8, size = 88, style = {}}) => {
  const p = io(F, s(t), s(t) + 6, 0, 1, Easing.in(Easing.quad));
  const shake = F > s(t) + 6 && F < s(t) + 14 ? Math.sin(F * 2.2) * 3 : 0;
  return (
    <div style={{display: 'inline-block', border: `8px solid ${color}`, borderRadius: 24, color, fontSize: size, fontWeight: 700, lineHeight: 1, padding: `${size * 0.22}px ${size * 0.34}px ${size * 0.1}px`,
      background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap', opacity: p, transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * p}) translateX(${shake}px)`, ...style}}>{children}</div>
  );
};
const XBadge = ({size = 120, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <circle cx="32" cy="32" r="30" fill={RED} /><path d="M21 21l22 22M43 21L21 43" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
  </svg>
);
// draw-on strike line across a card
const Strike = ({F, t, w, style = {}}) => (
  <svg width={w} height={30} style={{position: 'absolute', ...style}}>
    <line x1="10" y1="22" x2={w - 10} y2="8" stroke={RED} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(t), s(t) + 9)} />
  </svg>
);

/* ---------- icons (one style: INK stroke 5, white / yellow fills) ---------- */
const Stopwatch = ({size = 200, ang = 0, sector = 60}) => {
  const a = (sector - 90) * Math.PI / 180;
  return (
    <svg viewBox="0 0 120 132" width={size} height={size * 1.1}>
      <rect x="48" y="2" width="24" height="12" rx="5" fill={INK} /><rect x="56" y="12" width="8" height="10" fill={INK} />
      <path d="M96 28l8-8" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="60" cy="76" r="52" fill="#fff" stroke={INK} strokeWidth="7" />
      <path d={`M60 76 L60 30 A46 46 0 0 1 ${60 + 46 * Math.cos(a)} ${76 + 46 * Math.sin(a)} Z`} fill={Y} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1="60" y1="32" x2="60" y2={i % 3 ? 37 : 41} stroke={INK} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${i * 30} 60 76)`} />)}
      <line x1="60" y1="76" x2="60" y2="40" stroke={RED} strokeWidth="5" strokeLinecap="round" transform={`rotate(${ang} 60 76)`} />
      <circle cx="60" cy="76" r="6" fill={INK} />
    </svg>
  );
};
const Shop = ({size = 160, awn = Y, label = 'किराणा'}) => (
  <svg viewBox="0 0 120 112" width={size} height={size * 112 / 120}>
    <rect x="16" y="46" width="88" height="60" fill="#fff" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="26" y="60" width="38" height="28" rx="3" fill={SOFT} stroke={INK} strokeWidth="4" />
    <path d="M26 74h38" stroke={INK} strokeWidth="3" />
    <rect x="31" y="64" width="8" height="8" fill={GREEN} /><rect x="42" y="66" width="7" height="6" fill={RED} /><rect x="52" y="63" width="8" height="9" fill={GOLD} />
    <rect x="31" y="78" width="10" height="8" fill={GOLD} /><rect x="45" y="79" width="7" height="7" fill={GREEN} />
    <rect x="72" y="62" width="22" height="44" fill={INK} /><circle cx="89" cy="85" r="2.2" fill={Y} />
    <rect x="8" y="6" width="104" height="24" rx="6" fill={INK} />
    <text x="60" y="24" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">{label}</text>
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${10 + i * 20} 30h20v12a10 10 0 0 1 -20 0z`} fill={i % 2 ? '#fff' : awn} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    ))}
    <path d="M4 106h112" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
  </svg>
);
const Warehouse = ({size = 520}) => (
  <svg viewBox="0 0 300 200" width={size} height={size * 2 / 3}>
    <path d="M14 72 150 18 286 72V194H14Z" fill="#2B2B2B" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M14 72 150 18 286 72" fill="none" stroke={INK} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="92" y="52" width="116" height="28" rx="7" fill={Y} />
    <text x="150" y="72" textAnchor="middle" fontSize="17" fontWeight="700" fill={INK} letterSpacing="2">DARK STORE</text>
    <rect x="54" y="98" width="192" height="96" fill="#454545" />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x="60" y={128 + r * 22} width="180" height="4" fill="#777" />
        {Array.from({length: 7}, (_, i) => <rect key={i} x={66 + i * 25} y={110 + r * 22} width={18 - (i % 3) * 2} height={18 - (i % 2) * 4 + (i % 2) * 4} rx="2" fill={[Y, '#E8D7B0', '#fff'][(i + r) % 3]} />)}
      </g>
    ))}
    <rect x="54" y="92" width="192" height="22" fill="#5a5a5a" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1="54" x2="246" y1={96 + i * 5} y2={96 + i * 5} stroke="#3c3c3c" strokeWidth="1.5" />)}
    <path d="M2 194h296" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
  </svg>
);
const Scooter = ({size = 200, box = Y, spin = 0}) => (
  <svg viewBox="0 0 160 120" width={size} height={size * 0.75}>
    <rect x="10" y="22" width="48" height="40" rx="7" fill={box} stroke={INK} strokeWidth={SW} />
    <path d="M22 36h24" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <path d="M18 92Q18 66 48 66H84L90 86H58Q50 94 18 92Z" fill={INK} />
    <path d="M58 86H114" stroke={INK} strokeWidth="9" strokeLinecap="round" />
    <path d="M114 38L126 94" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    <path d="M104 36H122" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <path d="M70 64 82 34" stroke={INK} strokeWidth="13" strokeLinecap="round" />
    <path d="M82 36 108 40" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <path d="M72 62 92 70 90 86" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="86" cy="18" r="13" fill={Y} stroke={INK} strokeWidth="4" />
    <path d="M86 18h13" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    {[[36, 96], [126, 96]].map(([cx, cy], i) => (
      <g key={i} transform={`rotate(${spin} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r="17" fill={INK} /><circle cx={cx} cy={cy} r="7" fill="#fff" /><rect x={cx - 1.5} y={cy - 15} width="3" height="8" fill="#fff" />
      </g>
    ))}
  </svg>
);
const Bag = ({size = 140}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="24" cy="18" r="8" fill={GREEN} stroke={INK} strokeWidth="3" />
    <rect x="31" y="6" width="9" height="22" rx="4" fill="#E9B872" stroke={INK} strokeWidth="3" transform="rotate(14 35 17)" />
    <path d="M40 22c3-8 9-10 12-9-1 4-5 9-12 9z" fill={GREEN} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M12 24H52L48 60H16Z" fill="#F1CF94" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M12 24h40v6H12z" fill="#E2B76A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <rect x="25" y="38" width="14" height="12" rx="3" fill={Y} stroke={INK} strokeWidth="3" />
  </svg>
);
const PhoneCart = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="16" y="4" width="32" height="56" rx="7" fill="#fff" stroke={INK} strokeWidth="4" />
    <rect x="27" y="8" width="10" height="3" rx="1.5" fill={INK} />
    <path d="M21 24h4l3 12h12l3-9H27" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="30" cy="41" r="2.6" fill={INK} /><circle cx="39" cy="41" r="2.6" fill={INK} />
    <rect x="21" y="48" width="22" height="6" rx="3" fill={GREEN} />
  </svg>
);
const Coin = ({size = 60, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <circle cx="32" cy="32" r="29" fill={Y} stroke={GOLD} strokeWidth="5" />
    <text x="32" y="45" textAnchor="middle" fontSize="36" fontWeight="700" fill={INK}>₹</text>
  </svg>
);
const Person = ({size = 120, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="18" r="11" fill={color} /><path d="M10 60c0-15 9-24 22-24s22 9 22 24z" fill={color} />
  </svg>
);
const Shield = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M32 4 56 13V30C56 45 46 55 32 60 18 55 8 45 8 30V13Z" fill={GREEN} />
    <path d="M21 32l8 8 15-16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BoxZero = ({size = 90, color = INK, fill = '#fff'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M8 20 32 8l24 12v26L32 58 8 46Z" fill={fill} stroke={color} strokeWidth="4" strokeLinejoin="round" />
    <path d="M8 20l24 12 24-12M32 32v26" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    <text x="20" y="49" textAnchor="middle" fontSize="18" fontWeight="800" fill={color} transform="skewY(14) translate(0 -6)">0</text>
  </svg>
);
const Bulb = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M32 6C20 6 12 15 12 26c0 8 4 12 8 16 2 2 3 4 3 7h18c0-3 1-5 3-7 4-4 8-8 8-16C52 15 44 6 32 6Z" fill={Y} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M24 54h16M27 60h10" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <path d="M26 30l6 6 6-6M32 36v12" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Code = ({size = 90, color = Y}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 18 6 32l14 14M44 18l14 14-14 14M37 12 27 52" />
  </svg>
);
const Calc = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="12" y="4" width="40" height="56" rx="8" fill={INK} />
    <rect x="18" y="10" width="28" height="12" rx="3" fill={Y} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={18 + c * 10} y={28 + r * 10} width="7" height="7" rx="2" fill={r === 2 && c === 2 ? Y : '#fff'} />))}
  </svg>
);
const Wallet = ({size = 220}) => (
  <svg viewBox="0 0 120 100" width={size} height={size * 100 / 120}>
    <path d="M14 26 78 8l8 18" fill={GREEN} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="8" y="26" width="104" height="68" rx="12" fill={INK} />
    <rect x="76" y="46" width="40" height="28" rx="8" fill={Y} />
    <circle cx="90" cy="60" r="5" fill={INK} />
  </svg>
);
const LinkI = ({size = 40, color = '#00376B'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round">
    <path d="M27 37a10 10 0 0 0 14 0l10-10a10 10 0 0 0-14-14l-4 4" /><path d="M37 27a10 10 0 0 0-14 0L13 37a10 10 0 0 0 14 14l4-4" />
  </svg>
);
const PhoneCall = ({size = 90, color = '#fff'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M20 6c2 0 4 1 5 3l5 10c1 2 0 4-1 6l-4 4c3 7 8 12 15 15l4-4c2-1 4-2 6-1l10 5c2 1 3 3 3 5v6c0 4-3 7-7 7C29 62 2 35 2 13c0-4 3-7 7-7z" fill={color} transform="scale(0.92) translate(3 2)" />
  </svg>
);
const Hand = ({size = 110}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M24 30V10a5 5 0 0 1 10 0v16l13 3c5 1 8 6 7 11l-3 14c-1 4-4 6-8 6H31c-3 0-5-1-7-4L13 41c-2-3-1-6 1-7 2-2 5-2 7 0l3 3z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);
const BlinkitLogo = ({size = 260, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.25, overflow: 'hidden', boxShadow: '0 20px 50px rgba(120,90,0,0.22)', flexShrink: 0, ...style}}>
    <Img src={staticFile('logos/blinkit.svg')} style={{width: size, height: size, display: 'block'}} />
  </div>
);

/* ---------- small-town skyline ---------- */
const SKY = [
  {k: 'tree', x: 20, w: 70, h: 110},
  {k: 'house', x: 90, w: 120, h: 150},
  {k: 'tank', x: 222, w: 90, h: 250},
  {k: 'shop', x: 320, w: 150, h: 130},
  {k: 'temple', x: 480, w: 130, h: 270},
  {k: 'house', x: 620, w: 130, h: 190},
  {k: 'tree', x: 758, w: 74, h: 130},
  {k: 'house', x: 834, w: 106, h: 140},
];
const SkyItem = ({k, x, w, h, g}) => {
  const B = 380, top = B - h;
  const tf = {transform: `scaleY(${g})`, transformOrigin: `${x + w / 2}px ${B}px`, transformBox: 'view-box'};
  if (k === 'tree') return (
    <g style={tf}><rect x={x + w / 2 - 5} y={B - 50} width="10" height="50" fill={INK} /><circle cx={x + w / 2} cy={top + w / 2} r={w / 2} fill="#9ED3A2" stroke={INK} strokeWidth={SW} /></g>
  );
  if (k === 'house') return (
    <g style={tf}>
      <rect x={x} y={top + 40} width={w} height={h - 40} fill="#fff" stroke={INK} strokeWidth={SW} />
      <path d={`M${x - 10} ${top + 44} L${x + w / 2} ${top} L${x + w + 10} ${top + 44}Z`} fill={Y} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {Array.from({length: Math.floor((h - 60) / 50)}, (_, r) => [0, 1].map((c) => (
        <rect key={`${r}${c}`} x={x + 18 + c * (w - 60)} y={top + 60 + r * 50} width="24" height="28" rx="3" fill={SOFT} stroke={INK} strokeWidth="3.5" />
      )))}
    </g>
  );
  if (k === 'tank') return (
    <g style={tf}>
      <path d={`M${x + 18} ${B} L${x + 30} ${top + 70} M${x + w - 18} ${B} L${x + w - 30} ${top + 70} M${x + 24} ${B - 60} L${x + w - 24} ${B - 100} M${x + w - 24} ${B - 60} L${x + 24} ${B - 100}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x={x} y={top + 14} width={w} height="60" rx="10" fill="#fff" stroke={INK} strokeWidth={SW} />
      <path d={`M${x + 8} ${top + 16} Q${x + w / 2} ${top - 12} ${x + w - 8} ${top + 16}`} fill={Y} stroke={INK} strokeWidth={SW} />
    </g>
  );
  if (k === 'shop') return (
    <g style={tf}>
      <rect x={x} y={top + 40} width={w} height={h - 40} fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x={x - 6} y={top} width={w + 12} height="26" rx="5" fill={INK} />
      <text x={x + w / 2} y={top + 20} textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">किराणा</text>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${x - 6 + i * (w + 12) / 5} ${top + 26}h${(w + 12) / 5}v10a${(w + 12) / 10} 8 0 0 1 -${(w + 12) / 5} 0z`} fill={i % 2 ? '#fff' : Y} stroke={INK} strokeWidth="3.5" />)}
      <rect x={x + w - 50} y={top + 70} width="34" height={h - 70} fill={INK} />
      <rect x={x + 16} y={top + 66} width="56" height="34" rx="3" fill={SOFT} stroke={INK} strokeWidth="3.5" />
    </g>
  );
  // temple: base + curved shikhara + flag
  return (
    <g style={tf}>
      <rect x={x} y={B - 90} width={w} height="90" fill="#fff" stroke={INK} strokeWidth={SW} />
      <path d={`M${x + w / 2 - 15} ${B} v-50 a15 15 0 0 1 30 0 v50`} fill={INK} />
      <path d={`M${x + 12} ${B - 90} Q${x + 18} ${top + 70} ${x + w / 2} ${top + 30} Q${x + w - 18} ${top + 70} ${x + w - 12} ${B - 90}Z`} fill={Y} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${x + 20 + i * 6} ${B - 120 - i * 34} H${x + w - 20 - i * 6}`} stroke={INK} strokeWidth="3.5" />)}
      <path d={`M${x + w / 2} ${top + 30} V${top}`} stroke={INK} strokeWidth="4" />
      <path d={`M${x + w / 2} ${top} l26 8 -26 8z`} fill="#F28C28" />
    </g>
  );
};

/* ---------- scenes ---------- */
// 1. Hook: Blinkit 10-min model doesn't work in small towns
const Hook = ({from}) => {
  const F = useCurrentFrame() + from;
  const ride = io(F, s(0.15), s(2.5), 0, 1, Easing.inOut(Easing.cubic));
  const dead = io(F, s(2.7), s(2.95));
  const card = pop(F, -0.25, 13);
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={74} color={GREY} style={rise(F, -0.35)}>छोट्या शहरात</H>
        <H size={108} style={{...rise(F, -0.2), marginTop: 4}}><Hi t={0.9}>१० मिनिट डिलिव्हरी?</Hi></H>
      </Center>
      <Card x={90} y={560} w={900} h={580} r={48} style={{transform: `rotate(-2deg) scale(${card})`, overflow: 'hidden'}}>
        <div style={{filter: `grayscale(${dead * 0.85})`, opacity: 1 - dead * 0.35, position: 'absolute', inset: 0}}>
          <BlinkitLogo size={230} style={{...abs(50, 70)}} />
          <div style={{...abs(310, 80)}}><Stopwatch size={180} ang={io(F, s(0.1), s(2.6), 0, 300, Easing.linear)} sector={io(F, 0, s(2.6), 0, 60, Easing.linear)} /></div>
          <div style={{...abs(520, 110)}}>
            <H size={88} style={{lineHeight: 1}}>१० मिनिट</H>
            <H size={46} color={GREY} style={{marginTop: 8}}>मेट्रो मॉडेल</H>
          </div>
          {/* road: dark store -> home, scooter races */}
          <svg width="900" height="260" style={{...abs(0, 310)}}>
            <path d="M120 170H780" stroke="#E6DFCF" strokeWidth="26" strokeLinecap="round" />
            <path d="M120 170H780" stroke="#fff" strokeWidth="4" strokeDasharray="22 18" strokeDashoffset={-F * 6} />
          </svg>
          <div style={{...abs(30, 380)}}><BoxZero size={120} fill={BLINKIT_Y} /></div>
          <div style={{...abs(760, 350)}}><House size={140} /></div>
          <div style={{...abs(130 + ride * 470, 370 + Math.abs(Math.sin(F / 2.2)) * 3)}}>
            <Scooter size={170} box={BLINKIT_Y} spin={F * 30} />
            {[0, 1, 2].map((i) => <div key={i} style={{...abs(-70 - i * 14, 30 + i * 30), width: 60 + i * 10, height: 7, borderRadius: 4, background: GOLD, opacity: ride < 0.98 ? 0.7 : 0}} />)}
          </div>
        </div>
      </Card>
      <div style={{...abs(800, 470), transform: `scale(${pop(F, 2.7, 9)})`}}><XBadge size={170} /></div>
      <Center top={740}><Stamp F={F} t={2.65} size={112}>चालत नाही!</Stamp></Center>
    </AbsoluteFill>
  );
};

// 2. Town: 50k - 3 lakh population, how to do grocery delivery?
const Town = ({from}) => {
  const F = useCurrentFrame() + from;
  const pop0 = io(F, s(4.2), s(6.9), 50000, 300000, Easing.inOut(Easing.cubic));
  const q = pop(F, 7.7, 13);
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={76} style={rise(F, 3.6)}><Hi t={4.0}>५० हजार ते ३ लाख</Hi></H>
        <H size={64} color={GREY} style={{...rise(F, 5.8), marginTop: 6}}>लोकसंख्येचं शहर</H>
      </Center>
      <svg viewBox="0 0 960 400" width="960" height="400" style={{...abs(60, 420), overflow: 'visible'}}>
        <rect x="-20" y="378" width="1000" height="24" fill="#EDE5D3" />
        {SKY.map((b, i) => <SkyItem key={i} {...b} g={pop(F, 3.7 + i * 0.16, 14)} />)}
        <path d="M-20 380H980" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </svg>
      <Center top={850}>
        <div style={{...rise(F, 4.1), display: 'flex', alignItems: 'center', gap: 22, background: INK, borderRadius: 999, padding: '16px 44px 10px 26px'}}>
          <Person size={58} color={Y} />
          <span style={{fontSize: 58, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', minWidth: 270}}>{inr(Math.round(pop0 / 1000) * 1000)}</span>
          <span style={{fontSize: 38, fontWeight: 500, color: '#bdb6a6'}}>लोकसंख्या</span>
        </div>
      </Center>
      <Card x={90} y={1040} w={900} h={300} r={44} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '0 50px', transform: `scale(${q})`}}>
        <Bag size={190} />
        <div>
          <H size={62} color={GREY}>किराणा डिलिव्हरीचा</H>
          <H size={76}><Hi t={8.9}>बिझनेस</Hi> कसा करायचा?</H>
        </div>
      </Card>
      <div style={{...abs(880, 990), width: 130, height: 130, borderRadius: 65, background: Y, border: `6px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 96, fontWeight: 700, paddingTop: 14, boxSizing: 'border-box', transform: `scale(${pop(F, 8.3, 9)}) rotate(${12 + Math.sin(F / 9) * 6}deg)`}}>?</div>
    </AbsoluteFill>
  );
};

// 3. Simple: customers don't want 10-min, they want convenience at home
const Simple = ({from}) => {
  const F = useCurrentFrame() + from;
  const dim = io(F, s(17.5), s(18.1));
  const b = pop(F, 18.8, 12);
  return (
    <AbsoluteFill>
      <Center top={200}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, ...rise(F, 11.7)}}><Calc size={96} /><H size={84}>गणित अगदी <Hi t={12.5}>साधं</Hi></H></div>
        <H size={58} color={GREY} style={{...rise(F, 14.1), marginTop: 18}}>छोट्या शहरात ग्राहकांना…</H>
      </Center>
      <Card x={110} y={500} w={860} h={290} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '0 50px', opacity: io(F, s(15.6), s(15.9)) * (1 - dim * 0.45),
        transform: `translateY(${io(F, s(15.6), s(16.1), 40, 0)}px) scale(${1 - dim * 0.05})`}}>
        <Stopwatch size={170} ang={io(F, s(15.6), s(17.5), 0, 300, Easing.linear)} />
        <div><H size={58} color={GREY}>१० मिनिटांत</H><H size={74}>डिलिव्हरी</H></div>
        <Strike F={F} t={17.5} w={760} style={{left: 50, top: 130}} />
        <div style={{...abs(640, 34), transform: `rotate(-6deg) scale(${pop(F, 17.7, 10)})`}}><Pill bg={RED} size={52}>नकोय</Pill></div>
      </Card>
      <Card x={90} y={850} w={900} h={470} r={48} bg={Y} style={{transform: `scale(${b}) rotate(1.5deg)`, overflow: 'hidden'}}>
        <div style={{...abs(50, 70)}}><House size={330} /></div>
        <div style={{...abs(250, 300), transform: `scale(${pop(F, 19.3, 10)})`}}><Bag size={120} /></div>
        <div style={{...abs(410, 110)}}>
          <H size={60} color="#5a4600">फक्त</H>
          <H size={104} style={{lineHeight: 1.05}}>घरबसल्या</H>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 6}}><H size={104} style={{lineHeight: 1.05}}>सोय</H><div style={{transform: `scale(${pop(F, 19.6, 9)})`}}><Check size={100} /></div></div>
        </div>
      </Card>
      <Twinkle x={940} y={810} size={70} o={io(F, s(19.2), s(19.5))} />
      <Twinkle x={60} y={1260} size={50} o={io(F, s(19.4), s(19.7))} />
    </AbsoluteFill>
  );
};

// 4. Market: people still go to the market -> your biggest opportunity
const Market = ({from}) => {
  const F = useCurrentFrame() + from;
  const walk = io(F, s(21.4), s(24.2), 0, 1, Easing.inOut(Easing.sin));
  const px = 210 + walk * 470;
  const hop = Math.abs(Math.sin(walk * Math.PI * 7)) * 12;
  const leg = Math.sin(walk * Math.PI * 14) * 16;
  const card = pop(F, 24.4, 13);
  const line = io(F, s(24.8), s(26.3), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={62} color={GREY} style={rise(F, 21.0)}>आजही साध्या किराण्यासाठी</H>
        <H size={88} style={{...rise(F, 21.5), marginTop: 6}}><Hi t={22.6}>बाजारात</Hi> जावं लागतं</H>
      </Center>
      <svg width="1080" height="420" style={{...abs(0, 450)}}>
        <path d="M150 360 C 330 300, 520 400, 760 340" fill="none" stroke="#E2D9C5" strokeWidth="34" strokeLinecap="round" />
        <path d="M150 360 C 330 300, 520 400, 760 340" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="18 16" />
        <circle cx="900" cy="60" r="44" fill={Y} />
        {Array.from({length: 8}, (_, i) => <line key={i} x1="900" y1="-6" x2="900" y2="6" stroke={GOLD} strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 45 + F} 900 60) translate(0 -64)`} />)}
      </svg>
      <div style={{...abs(40, 560), ...rise(F, 21.1)}}><House size={240} /></div>
      <div style={{...abs(720, 580), ...rise(F, 21.3)}}><Shop size={250} label="बाजार" /></div>
      {/* walker with shopping bag */}
      <svg viewBox="0 0 80 140" width="110" height="190" style={{...abs(px, 620 - hop), opacity: io(F, s(21.3), s(21.6)) * io(F, s(24.3), s(24.6), 1, 0.25)}}>
        <circle cx="40" cy="16" r="13" fill={INK} />
        <path d="M40 32V80" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d={`M40 80 L${40 + leg} 128 M40 80 L${40 - leg} 128`} stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <path d={`M40 44 L${58} ${72}`} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M50 74h22l-3 26H53z" fill="#F1CF94" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M40 44 L28 70" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      </svg>
      <Card x={90} y={960} w={900} h={380} r={48} bg={INK} style={{transform: `scale(${card})`, overflow: 'hidden'}}>
        <svg width="900" height="380" style={{...abs(0, 0)}}>
          {[0, 1, 2, 3].map((i) => <line key={i} x1="430" x2="860" y1={90 + i * 70} y2={90 + i * 70} stroke="#2c2c2c" strokeWidth="2" />)}
          <path d="M440 320 L540 270 L620 290 L720 180 L840 80" fill="none" stroke={Y} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} />
          <path d="M808 70 L846 76 L838 114" fill="none" stroke={Y} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={io(F, s(26.1), s(26.3))} />
        </svg>
        <div style={{...abs(60, 80)}}>
          <H size={60} color="#cfc8b8">हीच तुमची</H>
          <H size={84} style={{marginTop: 10}}><Hi t={25.4}>सर्वात मोठी</Hi></H>
          <H size={84} color={Y} style={{marginTop: 30}}>संधी!</H>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// 5. Dark store not needed -> zero inventory model
const COSTS = [['भाडं', 40, 470], ['स्टॉक', 830, 440], ['स्टाफ', 30, 760], ['फ्रीज', 840, 760]];
const DarkStore = ({from}) => {
  const F = useCurrentFrame() + from;
  const no = io(F, s(29.8), s(30.2));
  const z = pop(F, 31.05, 13);
  return (
    <AbsoluteFill>
      <Center top={200}>
        <H size={62} color={GREY} style={rise(F, 27.4)}>लाखो रुपये लावून</H>
        <H size={88} style={{...rise(F, 27.8), marginTop: 6}}>स्वतःचं <Hi t={28.7}>डार्क स्टोअर</Hi>?</H>
      </Center>
      <div style={{opacity: 1 - no * 0.55, transform: `scale(${1 - no * 0.08})`, transformOrigin: '540px 640px', position: 'absolute', inset: 0, filter: `grayscale(${no})`}}>
        <div style={{...abs(250, 450), ...rise(F, 27.6)}}><Warehouse size={580} /></div>
        {COSTS.map(([t, x, y], i) => (
          <div key={t} style={{...abs(x, y), transform: `scale(${pop(F, 28.2 + i * 0.25, 10)}) rotate(${i % 2 ? 5 : -5}deg)`}}>
            <Pill bg="#fff" color={INK} size={40} style={{boxShadow: CARD_SHADOW, border: `4px solid ${RED}`}}><span style={{color: RED}}>₹</span>{t}</Pill>
          </div>
        ))}
      </div>
      <div style={{...abs(720, 430), transform: `scale(${pop(F, 29.85, 9)})`}}><XBadge size={150} /></div>
      <Center top={600}><div style={{opacity: no * (1 - io(F, s(31.0), s(31.3)))}}><Stamp F={F} t={29.85} size={76} rot={6}>गरज नाही!</Stamp></div></Center>
      <Card x={90} y={930} w={900} h={400} r={48} bg={Y} style={{transform: `scale(${z}) rotate(-1.5deg)`, display: 'flex', alignItems: 'center', gap: 40, padding: '0 60px'}}>
        <div style={{width: 210, height: 210, borderRadius: 40, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><BoxZero size={160} color={Y} fill={INK} /></div>
        <div>
          <H size={52} color="#5a4600">त्याऐवजी</H>
          <H size={84} style={{lineHeight: 1.1}}>झिरो इन्व्हेंटरी</H>
          <H size={84} style={{lineHeight: 1.1}}>मॉडेल</H>
        </div>
      </Card>
      <div style={{...abs(700, 1250)}}><Stamp F={F} t={32.9} color={GREEN} size={58} rot={-6}>वापरा!</Stamp></div>
    </AbsoluteFill>
  );
};

// 6. Tie up with big kirana stores (hub diagram)
const STORES = [['सुपर मार्ट', 90, 470], ['किराणा भांडार', 660, 470], ['जनरल स्टोअर', 90, 1010], ['डेअरी & फ्रेश', 660, 1010]];
const Tieup = ({from}) => {
  const F = useCurrentFrame() + from;
  const hub = pop(F, 33.75, 12);
  const ring = (F % 40) / 40;
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={62} color={GREY} style={rise(F, 33.7)}>शहरातील मोठ्या</H>
        <H size={84} style={{...rise(F, 34.1), marginTop: 4}}><Hi t={34.7}>किराणा दुकानांसोबत</Hi></H>
      </Center>
      <svg width="1080" height="1000" style={{...abs(0, 400)}}>
        {STORES.map(([, x, y], i) => {
          const d = io(F, s(34.3 + i * 0.25), s(34.3 + i * 0.25) + 10);
          const sx = x + 165, sy = y - 400 + 110;
          return (
            <g key={i}>
              <line x1="540" y1="455" x2={540 + (sx - 540) * d} y2={455 + (sy - 455) * d} stroke={INK} strokeWidth="6" strokeDasharray="14 12" strokeDashoffset={-F * 2} strokeLinecap="round" />
              <circle cx={540 + (sx - 540) * ((F / 30 + i * 0.25) % 1)} cy={455 + (sy - 455) * ((F / 30 + i * 0.25) % 1)} r="9" fill={GOLD} opacity={d > 0.99 ? 1 : 0} />
            </g>
          );
        })}
        <circle cx="540" cy="455" r={130 + ring * 90} fill="none" stroke={Y} strokeWidth="6" opacity={(1 - ring) * hub} />
      </svg>
      <div style={{...abs(540 - 140, 855 - 140), width: 280, height: 280, borderRadius: 140, background: Y, border: `8px solid ${INK}`, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${hub})`}}>
        <PhoneCart size={120} />
        <H size={40} style={{marginTop: 2}}>तुमचं ॲप</H>
      </div>
      {STORES.map(([t, x, y], i) => (
        <Card key={t} x={x} y={y} w={330} h={250} r={36} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(F, 34.4 + i * 0.25, 12)})`}}>
          <Shop size={150} awn={[Y, GREEN, '#F28C28', '#4BA3E3'][i]} label="" />
          <H size={36} style={{marginTop: 4}}>{t}</H>
        </Card>
      ))}
      <Center top={1210}><div style={{transform: `scale(${pop(F, 35.6, 11)})`}}><Pill bg={INK} size={50}><Check size={48} bg={GREEN} /> टाय-अप करा</Pill></div></Center>
    </AbsoluteFill>
  );
};

// 7. Flow: order -> shop packs -> delivery in 30-45 min; low risk, zero stock
const STEPS = [
  {t: 37.0, icon: <PhoneCart size={130} />, a: 'ग्राहक', b: 'ॲपवर ऑर्डर करतो'},
  {t: 38.9, icon: <Bag size={130} />, a: 'दुकानदार', b: 'पॅक करतो'},
  {t: 40.35, icon: <Scooter size={150} />, a: 'डिलिव्हरी बॉय', b: 'घरपोच देतो'},
];
const Flow = ({from}) => {
  const F = useCurrentFrame() + from;
  const ride = io(F, s(41.6), s(44.0), 0, 1, Easing.inOut(Easing.cubic));
  const swap = io(F, s(44.3), s(44.6));
  return (
    <AbsoluteFill>
      <Center top={190}><H size={64} color={GREY} style={rise(F, 36.9)}>असं चालेल मॉडेल</H></Center>
      <svg width="200" height="700" style={{...abs(110, 380)}}>
        <line x1="70" y1="80" x2="70" y2={80 + io(F, s(37.2), s(40.6)) * 500} stroke={INK} strokeWidth="6" strokeDasharray="4 14" strokeLinecap="round" />
      </svg>
      {STEPS.map((st, i) => {
        const p = pop(F, st.t, 13);
        return (
          <div key={i} style={{...abs(80, 330 + i * 250), display: 'flex', alignItems: 'center', gap: 26, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -80}px)`}}>
            <div style={{width: 200, height: 200, borderRadius: 100, background: i === 2 ? Y : '#fff', border: `6px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              {st.icon}
              <div style={{...abs(-8, -8), width: 62, height: 62, borderRadius: 31, background: INK, color: Y, fontSize: 38, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box'}}>{dev(i + 1)}</div>
            </div>
            <div>
              <H size={50} color={GREY}>{st.a}</H>
              <H size={70}>{st.b}</H>
            </div>
          </div>
        );
      })}
      {/* route strip */}
      <div style={{position: 'absolute', inset: 0, opacity: io(F, s(41.5), s(41.8)) * (1 - swap)}}>
        <Card x={80} y={1090} w={920} h={240} r={40}>
          <svg width="920" height="240" style={{...abs(0, 0)}}>
            <path d="M150 180H770" stroke="#EDE5D3" strokeWidth="22" strokeLinecap="round" />
            <path d="M150 180H770" stroke={GREEN} strokeWidth="22" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ride} />
          </svg>
          <div style={{...abs(30, 70)}}><Shop size={130} label="" /></div>
          <div style={{...abs(770, 50)}}><House size={130} /></div>
          <div style={{...abs(130 + ride * 520, 74 + Math.abs(Math.sin(F / 2.5)) * 3)}}><Scooter size={130} spin={F * 25} /></div>
          <div style={{...abs(330, 18), transform: `scale(${pop(F, 41.85, 11)})`}}><Pill bg={INK} color={Y} size={44}><Stopwatch size={40} ang={F * 12} /> ३०–४५ मिनिट</Pill></div>
        </Card>
      </div>
      {/* payoff badges */}
      {[[<Shield key="s" size={110} />, 'कमीत कमी', 'रिस्क', 44.45], [<BoxZero key="b" size={110} />, 'झिरो स्टॉक', 'टेन्शन', 45.6]].map(([ic, a, b, t], i) => (
        <Card key={i} x={80 + i * 470} y={1090} w={450} h={240} r={40} bg={i ? Y : '#fff'} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', transform: `scale(${pop(F, t, 12)})`}}>
          {ic}
          <div><H size={46} color={i ? '#5a4600' : GREY}>{a}</H><H size={62}>{b}</H></div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

// 8. Math: 100 orders x 500 x 30 days = 15 lakh / month
const ROWS = [
  {t: 49.0, label: 'दिवसाला ऑर्डर्स', val: '१००', op: ''},
  {t: 51.0, label: 'सरासरी बिल', val: '₹५००', op: '×'},
  {t: 53.1, label: 'महिन्याचे दिवस', val: '३०', op: '×'},
];
const MathSc = ({from}) => {
  const F = useCurrentFrame() + from;
  const sale = io(F, s(53.6), s(55.0), 0, 1500000, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Center top={190}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, ...rise(F, 47.2)}}><Calc size={110} /><H size={92}><Hi t={47.7}>कमाईचं गणित</Hi></H></div>
      </Center>
      <Card x={110} y={400} w={860} h={560} r={40} style={{padding: '30px 56px', ...rise(F, 47.6)}}>
        {ROWS.map((r, i) => {
          const p = io(F, s(r.t), s(r.t) + 10);
          return (
            <div key={i} style={{height: 160, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 2 ? '4px dashed #E6DFCF' : 'none', opacity: 0.25 + p * 0.75}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                <span style={{width: 60, fontSize: 64, fontWeight: 600, color: GOLD}}>{r.op}</span>
                <H size={50} color={GREY}>{r.label}</H>
              </div>
              <H size={92} style={{transform: `scale(${0.6 + 0.4 * pop(F, r.t, 10)})`, transformOrigin: '100% 50%'}}>{p > 0 ? r.val : '—'}</H>
            </div>
          );
        })}
      </Card>
      <Card x={90} y={1000} w={900} h={330} r={48} bg={INK} style={{transform: `scale(${pop(F, 53.3, 13)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <H size={50} color="#cfc8b8">= महिन्याचा सेल</H>
        <H size={130} color={Y} style={{lineHeight: 1.1, fontVariantNumeric: 'tabular-nums'}}>₹{inr(Math.round(sale / 1000) * 1000)}</H>
      </Card>
    </AbsoluteFill>
  );
};

// 9. Income: commission from shops + delivery fee from customers
const Income = ({from}) => {
  const F = useCurrentFrame() + from;
  const srcA = pop(F, 56.0, 12), srcB = pop(F, 59.1, 12);
  const coin = (start, i, sx, sy) => {
    const k = ((F - s(start)) / 26 + i / 3) % 1;
    if (F < s(start)) return null;
    const ex = 540, ey = 1080;
    const x = sx + (ex - sx) * k, y = sy + (ey - sy) * k - Math.sin(k * Math.PI) * 120;
    return <Coin key={`${start}${i}`} size={64} style={{...abs(x - 32, y - 32), opacity: Math.min(1, k * 6) * (1 - Math.max(0, k - 0.85) / 0.15)}} />;
  };
  return (
    <AbsoluteFill>
      <Center top={190}><H size={80} style={rise(F, 55.9)}>कमाई <Hi t={56.4}>२ मार्गांनी</Hi></H></Center>
      <Card x={70} y={360} w={450} h={440} r={40} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30, transform: `scale(${srcA})`}}>
        <Shop size={170} label="" />
        <H size={44} color={GREY} style={{marginTop: 4}}>दुकानदाराकडून</H>
        <H size={72}><Hi t={57.4}>८–१०%</Hi></H>
        <H size={46}>कमिशन</H>
      </Card>
      <Card x={560} y={360} w={450} h={440} r={40} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30, transform: `scale(${srcB})`}}>
        <div style={{height: 160, display: 'flex', alignItems: 'center'}}><Person size={130} /></div>
        <H size={44} color={GREY} style={{marginTop: 4}}>ग्राहकाकडून</H>
        <H size={72}><Hi t={60.2}>₹२०–३०</Hi></H>
        <H size={46}>डिलिव्हरी फी</H>
      </Card>
      {[0, 1, 2].map((i) => coin(57.0, i, 295, 800))}
      {[0, 1, 2].map((i) => coin(60.3, i, 785, 800))}
      <div style={{...abs(540 - 150, 990), transform: `scale(${pop(F, 56.6, 12) * (1 + 0.04 * Math.sin(F / 4) * (F > s(57.3) ? 1 : 0))})`}}><Wallet size={300} /></div>
      <Center top={1260}><H size={46} color={GREY} style={rise(F, 56.8)}>तुमची कमाई</H></Center>
    </AbsoluteFill>
  );
};

// 10. Profit waterfall: commission + fee - costs = 1-1.5 lakh net (bars illustrative)
const BARS = [
  {label: 'कमिशन', from: 0, to: 0.64, color: Y, t: 62.25},
  {label: 'डिलिव्हरी फी', from: 0.64, to: 1.0, color: '#FFE08A', t: 62.45},
  {label: 'खर्च', from: 1.0, to: 0.6, color: RED, t: 62.9},
  {label: 'नफा', from: 0, to: 0.6, color: GREEN, t: 65.0},
];
const Profit = ({from}) => {
  const F = useCurrentFrame() + from;
  const base = 560, H0 = 420;
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={60} color={GREY} style={rise(F, 62.3)}>डिलिव्हरी बॉय + इतर खर्च वजा</H>
        <H size={88} style={{...rise(F, 64.8), marginTop: 6}}>निव्वळ <Hi t={66.9}>नफा</Hi></H>
      </Center>
      <Card x={80} y={410} w={920} h={630} r={40} style={rise(F, 62.2)}>
        <svg width="920" height="630" style={{...abs(0, 0)}}>
          <line x1="60" x2="860" y1={base} y2={base} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          {BARS.map((b, i) => {
            const g = io(F, s(b.t), s(b.t) + 14);
            const cur = b.from + (b.to - b.from) * g;
            const y1 = base - Math.max(b.from, cur) * H0, y2 = base - Math.min(b.from, cur) * H0;
            const x = 90 + i * 200;
            return (
              <g key={i} opacity={g > 0 ? 1 : 0}>
                {i > 0 && <line x1={x - 60} x2={x} y1={base - b.from * H0} y2={base - b.from * H0} stroke="#bbb" strokeWidth="3" strokeDasharray="8 8" />}
                <rect x={x} y={y1} width="140" height={Math.max(0, y2 - y1)} rx="12" fill={b.color} stroke={INK} strokeWidth="4" />
                {i === 2 && g > 0.5 && <text x={x + 70} y={y1 + (y2 - y1) / 2 + 16} textAnchor="middle" fontSize="48" fontWeight="700" fill="#fff">−</text>}
                <text x={x + 70} y={base + 50} textAnchor="middle" fontSize="34" fontWeight="600" fill={INK}>{b.label}</text>
              </g>
            );
          })}
        </svg>
      </Card>
      <Card x={90} y={1080} w={900} h={260} r={44} bg={INK} style={{transform: `scale(${pop(F, 65.8, 12)})`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px'}}>
        <div>
          <H size={110} color={Y} style={{lineHeight: 1.05}}>₹१–१.५ लाख</H>
          <H size={44} color="#cfc8b8">दर महिन्याला निव्वळ नफा</H>
        </div>
        <div style={{transform: `scale(${pop(F, 68.0, 9)})`}}><Check size={120} /></div>
      </Card>
    </AbsoluteFill>
  );
};

// 11. WhatsApp alone won't work: chaos of order messages
const WA_MSGS = [
  ['भाऊ, २ किलो साखर पाठवा', 70.7],
  ['१ लिटर दूध + ब्रेड', 71.05],
  ['माझी ऑर्डर कुठे आहे??', 71.4],
  ['पेमेंट केलंय, चेक करा', 71.7],
  ['ऑर्डर कॅन्सल करा प्लीज', 72.0],
  ['रेट लिस्ट पाठवा', 72.25],
];
const WhatsAppSc = ({from}) => {
  const F = useCurrentFrame() + from;
  const unread = Math.round(io(F, s(70.6), s(72.4), 3, 48, Easing.linear));
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={60} color={GREY} style={rise(F, 69.8)}>पण लक्षात ठेवा…</H>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8, ...rise(F, 70.6)}}>
          <H size={84}>फक्त</H><WhatsAppLogo size={86} /><H size={84}>WhatsApp?</H>
        </div>
      </Center>
      <Phone x={250} y={430} w={580} h={900} rot={-3} ty={io(F, s(69.75), s(70.3), 80, 0)}>
        <ChatScreen name="किराणा ऑर्डर्स" sub={`${dev(unread)} नवीन मेसेज`} avatar={<WhatsAppLogo size={64} round />}>
          {WA_MSGS.map(([m, t], i) => (
            <Msg key={i} F={F} t={t} h={88} time={`10:4${i}`}>
              <span style={{fontSize: 30}}>{m}</span>
            </Msg>
          ))}
        </ChatScreen>
      </Phone>
      <div style={{...abs(760, 400), width: 120, height: 120, borderRadius: 60, background: RED, color: '#fff', fontSize: 52, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box',
        transform: `scale(${pop(F, 70.7, 9) * (1 + 0.08 * Math.sin(F / 2))})`, border: '6px solid #F7F3EA'}}>{dev(unread)}</div>
      <div style={{...abs(560 - 300, 820), width: 600, display: 'flex', justifyContent: 'center'}}><Stamp F={F} t={72.35} size={92} rot={-10}>चालणार नाही!</Stamp></div>
    </AbsoluteFill>
  );
};

// 12. Apps: Customer App, Store App, Delivery App, Admin Panel
const MiniPhone = ({children, bg = '#fff'}) => (
  <div style={{width: 196, height: 350, borderRadius: 34, background: '#1d1d1d', padding: 8, boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'}}>
    <div style={{width: '100%', height: '100%', borderRadius: 27, overflow: 'hidden', position: 'relative', background: bg}}>{children}</div>
  </div>
);
const Bar = ({w, h = 10, c = '#E6E1D6', style = {}}) => <div style={{width: w, height: h, borderRadius: h / 2, background: c, ...style}} />;
const CustomerUI = () => (
  <MiniPhone>
    <div style={{background: Y, padding: '22px 12px 12px'}}>
      <div style={{fontSize: 15, fontWeight: 700, color: INK, lineHeight: 1}}>३० मिनिटांत डिलिव्हरी</div>
      <div style={{marginTop: 8, height: 26, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: '#999'}}>शोधा…</div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 10}}>
      {[[GREEN, 'भाजी'], ['#F28C28', 'फळं'], ['#E9B872', 'आटा'], ['#4BA3E3', 'दूध']].map(([c, n], i) => (
        <div key={i} style={{height: 92, borderRadius: 12, background: '#F6F2EA', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10}}>
          <div style={{width: 40, height: 40, borderRadius: 20, background: c}} />
          <div style={{fontSize: 13, fontWeight: 700, marginTop: 4}}>{n}</div>
          <div style={{...abs(56, 64), fontSize: 11, fontWeight: 800, color: GREEN, border: `2px solid ${GREEN}`, borderRadius: 6, padding: '1px 4px', background: '#fff'}}>ADD</div>
        </div>
      ))}
    </div>
    <div style={{...abs(10, 290), width: 160, height: 36, borderRadius: 10, background: GREEN, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>कार्ट पहा · ₹४२०</div>
  </MiniPhone>
);
const StoreUI = () => (
  <MiniPhone bg="#F6F2EA">
    <div style={{background: INK, color: '#fff', padding: '22px 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <span style={{fontSize: 15, fontWeight: 700}}>स्टोअर</span>
      <div style={{width: 34, height: 18, borderRadius: 9, background: GREEN, position: 'relative'}}><div style={{...abs(18, 2), width: 14, height: 14, borderRadius: 7, background: '#fff'}} /></div>
    </div>
    <div style={{margin: 10, padding: 10, borderRadius: 12, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'}}>
      <div style={{fontSize: 14, fontWeight: 800}}>नवी ऑर्डर #१०२४</div>
      {[90, 120, 70].map((w, i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}><Bar w={w} /><Bar w={24} c="#d6d0c2" /></div>)}
      <div style={{display: 'flex', gap: 6, marginTop: 12}}>
        <div style={{flex: 1, height: 28, borderRadius: 8, background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>स्वीकारा</div>
        <div style={{width: 40, height: 28, borderRadius: 8, border: '2px solid #ccc', boxSizing: 'border-box'}} />
      </div>
    </div>
    <div style={{margin: '0 10px', padding: 10, borderRadius: 12, background: '#fff', opacity: 0.7}}>
      <div style={{fontSize: 13, fontWeight: 700, color: GOLD}}>पॅकिंग · #१०२३</div>
      <Bar w={110} style={{marginTop: 8}} /><Bar w={80} style={{marginTop: 6}} />
    </div>
  </MiniPhone>
);
const DeliveryUI = ({F}) => {
  const k = (F % 90) / 90;
  const px = 40 + k * 100, py = 230 - k * 150;
  return (
    <MiniPhone bg="#E6EFDD">
      <svg width="180" height="334" style={{...abs(0, 0)}}>
        {[60, 130, 200, 270].map((y) => <line key={y} x1="0" x2="180" y1={y} y2={y - 20} stroke="#fff" strokeWidth="9" />)}
        {[40, 110].map((x) => <line key={x} x1={x} x2={x + 20} y1="0" y2="334" stroke="#fff" strokeWidth="9" />)}
        <path d="M40 230 L60 160 L120 130 L140 80" fill="none" stroke={GREEN} strokeWidth="6" strokeDasharray="10 6" strokeLinecap="round" />
        <path d="M140 52c-10 0-16 7-16 15 0 11 16 25 16 25s16-14 16-25c0-8-6-15-16-15z" fill={RED} /><circle cx="140" cy="67" r="5" fill="#fff" />
        <circle cx={px} cy={py} r="10" fill={INK} stroke="#fff" strokeWidth="3" />
      </svg>
      <div style={{...abs(0, 250), width: '100%', height: 100, background: '#fff', borderRadius: '16px 16px 0 0', padding: '10px 12px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 13, fontWeight: 800}}>ड्रॉप · १.२ किमी</div>
        <div style={{marginTop: 8, height: 30, borderRadius: 8, background: Y, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>पिक-अप केलं ✓</div>
      </div>
    </MiniPhone>
  );
};
const AdminUI = ({F, t}) => {
  const g = io(F, s(t), s(t) + 20);
  return (
    <div>
      <div style={{width: 380, height: 236, borderRadius: '16px 16px 0 0', background: '#1d1d1d', padding: 8, boxSizing: 'border-box'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 8, background: '#F6F2EA', display: 'flex', overflow: 'hidden'}}>
          <div style={{width: 60, background: INK, padding: '10px 8px', boxSizing: 'border-box'}}>
            <Mark size={26} color={Y} />
            {[0, 1, 2, 3].map((i) => <Bar key={i} w={40} h={7} c={i === 0 ? Y : '#444'} style={{marginTop: 12}} />)}
          </div>
          <div style={{flex: 1, padding: 10}}>
            <div style={{display: 'flex', gap: 6}}>
              {[['₹१५L', 'सेल'], ['१००', 'ऑर्डर'], ['४', 'स्टोअर']].map(([v, l], i) => (
                <div key={i} style={{flex: 1, background: '#fff', borderRadius: 8, padding: '5px 7px'}}>
                  <div style={{fontSize: 16, fontWeight: 800, lineHeight: 1.1}}>{v}</div><div style={{fontSize: 10, color: '#888', fontWeight: 600}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 8, height: 120, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 10px', boxSizing: 'border-box'}}>
              {[0.35, 0.5, 0.45, 0.7, 0.62, 0.9].map((h, i) => <div key={i} style={{flex: 1, height: `${h * 100 * g}%`, borderRadius: 4, background: i === 5 ? Y : '#E5DCC7'}} />)}
            </div>
          </div>
        </div>
      </div>
      <div style={{width: 430, height: 18, marginLeft: -25, borderRadius: '0 0 12px 12px', background: '#bdb7aa'}} />
    </div>
  );
};
const Apps = ({from}) => {
  const F = useCurrentFrame() + from;
  const CELLS = [
    {t: 76.5, n: 'Customer App', ui: <CustomerUI />},
    {t: 77.45, n: 'Store App', ui: <StoreUI />},
    {t: 78.4, n: 'Delivery App', ui: <DeliveryUI F={F} />},
    {t: 79.65, n: 'Admin Panel', ui: <AdminUI F={F} t={79.8} />},
  ];
  return (
    <AbsoluteFill>
      <Center top={180}>
        <H size={60} color={GREY} style={rise(F, 73.4)}>प्रोफेशनल बिझनेससाठी</H>
        <H size={88} style={{...rise(F, 74.0), marginTop: 4}}><Hi t={75.0}>स्वतःचं ॲप</Hi> लागेल!</H>
      </Center>
      {CELLS.map((c, i) => {
        const p = pop(F, c.t, 13);
        const x = 70 + (i % 2) * 480, y = 410 + Math.floor(i / 2) * 470;
        return (
          <Card key={i} x={x} y={y} w={460} h={450} r={40} bg={i === 3 ? INK : '#fff'} style={{opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 18}}>
            <div style={{height: 360, display: 'flex', alignItems: 'center'}}>{c.ui}</div>
            <div style={{...BRAND, fontSize: 40, fontWeight: 600, color: i === 3 ? '#fff' : INK, display: 'flex', alignItems: 'center', gap: 10}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: Y, marginTop: -6}} />{c.n}
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

// 13. Outgrid Labs builds it: idea yours, tech ours
const TILE_ICONS = [<PhoneCart key="a" size={84} />, <Shop key="b" size={84} label="" />, <Scooter key="c" size={92} />, <Calc key="d" size={80} />];
const Outgrid = ({from}) => {
  const F = useCurrentFrame() + from;
  const merge = io(F, s(83.3), s(83.9), 0, 1, Easing.in(Easing.cubic));
  const m = pop(F, 83.85, 10);
  const burst = io(F, s(83.85), s(84.5));
  return (
    <AbsoluteFill>
      <Center top={180}>
        <H size={60} color={GREY} style={rise(F, 80.65)}>ही संपूर्ण सिस्टीम</H>
        <H size={84} style={{...rise(F, 81.3), marginTop: 4}}>तुमच्या <Hi t={82.4}>बजेटमध्ये</Hi></H>
      </Center>
      {TILE_ICONS.map((ic, i) => {
        const x0 = 120 + i * 220, y0 = 440, tx = 540 - 70, ty = 560;
        const p = pop(F, 80.9 + i * 0.2, 12);
        return (
          <div key={i} style={{...abs(x0 + (tx - x0) * merge, y0 + (ty - y0) * merge), width: 140, height: 140, borderRadius: 34, background: '#fff', boxShadow: CARD_SHADOW,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p * (1 - merge * 0.7)})`, opacity: 1 - io(F, s(83.75), s(83.9))}}>{ic}</div>
        );
      })}
      <div style={{...abs(540 - 210, 420), width: 420, height: 420, borderRadius: 210, border: `8px solid ${Y}`, opacity: (1 - burst) * (F > s(83.85) ? 1 : 0), transform: `scale(${0.4 + burst})`}} />
      <div style={{...abs(540 - 120, 510), transform: `scale(${m}) rotate(${(1 - m) * -90}deg)`}}><Mark size={240} /></div>
      <Center top={790}><div style={{...BRAND, fontSize: 112, fontWeight: 700, color: INK, ...rise(F, 84.0)}}>Outgrid Labs</div></Center>
      <Card x={70} y={990} w={450} h={340} r={40} bg={Y} style={{transform: `scale(${pop(F, 85.05, 12)}) rotate(-2deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Bulb size={110} />
        <H size={46} color="#5a4600" style={{marginTop: 6}}>बिझनेस आयडिया</H>
        <H size={84} style={{lineHeight: 1.05}}>तुमची</H>
      </Card>
      <Card x={560} y={990} w={450} h={340} r={40} bg={INK} style={{transform: `scale(${pop(F, 86.55, 12)}) rotate(2deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Code size={110} />
        <H size={46} color="#cfc8b8" style={{marginTop: 6}}>टेक्नॉलॉजी</H>
        <H size={84} color={Y} style={{lineHeight: 1.05}}>आमची</H>
      </Card>
      <div style={{...abs(540 - 50, 1110), width: 100, height: 100, borderRadius: 50, background: '#fff', border: `6px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 70, fontWeight: 700, paddingTop: 8, transform: `scale(${pop(F, 86.7, 9)})`}}>+</div>
    </AbsoluteFill>
  );
};

// 14. CTA: Instagram bio link -> form -> team calls you
const Cta = ({from}) => {
  const F = useCurrentFrame() + from;
  const prof = pop(F, 88.3, 13);
  const tap = s(92.4);
  const ripple = io(F, tap, tap + 14);
  const form = io(F, s(92.8), s(93.2));
  const call = io(F, s(94.75), s(95.1));
  const fill = (i) => io(F, s(93.2 + i * 0.35), s(93.2 + i * 0.35) + 9);
  const ring = (F % 30) / 30;
  return (
    <AbsoluteFill>
      <Center top={180}>
        <H size={58} color={GREY} style={rise(F, 88.3)}>तुमच्या शहरात सुरू करायचा आहे?</H>
        <H size={86} style={{...rise(F, 88.9), marginTop: 4}}><Hi t={89.9}>डिलिव्हरी बिझनेस</Hi></H>
      </Center>
      <Card x={90} y={400} w={900} h={520} r={44} style={{transform: `scale(${prof})`, padding: '36px 44px', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{...BRAND, fontSize: 38, fontWeight: 700}}>outgridlabs</div>
          <InstagramLogo size={64} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 26}}>
          <div style={{width: 170, height: 170, borderRadius: 85, padding: 7, boxSizing: 'border-box', background: 'linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF)'}}>
            <div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#fff', padding: 6, boxSizing: 'border-box'}}>
              <div style={{width: '100%', height: '100%', borderRadius: '50%', background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark size={80} /></div>
            </div>
          </div>
          <div>
            <div style={{...BRAND, fontSize: 48, fontWeight: 700}}>Outgrid Labs</div>
            <div style={{fontSize: 34, fontWeight: 500, color: GREY, marginTop: 6}}>बिझनेससाठी ॲप्स आणि सिस्टीम</div>
          </div>
        </div>
        <div style={{position: 'relative', marginTop: 34, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 26px 10px', borderRadius: 20,
          background: F >= tap ? '#E7F0FF' : '#F2F5F9', border: `4px solid ${io(F, s(91.6), s(91.9)) > 0.5 ? Y : 'transparent'}`}}>
          <LinkI size={44} />
          <span style={{fontSize: 40, fontWeight: 600, color: '#00376B'}}>डिलिव्हरी ॲप – फॉर्म भरा</span>
          <div style={{...abs('50%', '50%'), width: 200, height: 200, marginLeft: -100, marginTop: -100, borderRadius: 100, background: 'rgba(0,55,107,0.18)', transform: `scale(${ripple})`, opacity: F >= tap ? 1 - ripple : 0}} />
        </div>
        <div style={{...abs(560 + (1 - io(F, s(91.7), s(92.3))) * 300, 380 + (F >= tap && F < tap + 6 ? 10 : 0)), opacity: io(F, s(91.7), s(92.0)) * (1 - form)}}><Hand size={120} /></div>
      </Card>
      {/* form */}
      <Card x={90} y={960} w={900} h={370} r={44} style={{opacity: form * (1 - call), transform: `translateY(${(1 - form) * 80 - call * 40}px)`, padding: '30px 44px'}}>
        <H size={52}>फॉर्म भरा</H>
        {[['नाव', 'राहुल पाटील'], ['शहर', 'सातारा'], ['मोबाईल', '९८XXXXXX१०']].map(([l, v], i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 14}}>
            <span style={{width: 160, fontSize: 34, fontWeight: 600, color: GREY}}>{l}</span>
            <div style={{flex: 1, height: 58, borderRadius: 14, border: '3px solid #E6DFCF', display: 'flex', alignItems: 'center', padding: '6px 18px 0', fontSize: 34, fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap'}}>
              <span style={{clipPath: `inset(0 ${100 - fill(i) * 100}% 0 0)`}}>{v}</span>
            </div>
          </div>
        ))}
      </Card>
      {/* incoming call */}
      <Card x={90} y={960} w={900} h={370} r={44} bg={INK} style={{opacity: call, transform: `translateY(${(1 - call) * 80}px)`, display: 'flex', alignItems: 'center', gap: 40, padding: '0 56px'}}>
        <div style={{position: 'relative', width: 180, height: 180, flexShrink: 0}}>
          <div style={{...abs(0, 0), width: 180, height: 180, borderRadius: 90, border: `6px solid ${GREEN}`, transform: `scale(${1 + ring * 0.5})`, opacity: 1 - ring}} />
          <div style={{...abs(0, 0), width: 180, height: 180, borderRadius: 90, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${Math.sin(F * 1.3) * 10}deg)`}}><PhoneCall size={96} /></div>
        </div>
        <div>
          <H size={44} color="#cfc8b8">इनकमिंग कॉल…</H>
          <div style={{marginTop: 6}}><Lockup size={66} color="#fff" /></div>
          <H size={46} color={Y} style={{marginTop: 10}}>आमची टीम <Hi t={95.6}>कॉल</Hi> करेल</H>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Outro = ({from}) => (
  <BrandOutro from={from} at={OUTRO_AT} cta={
    <Pill bg={Y} color={INK} size={44}><LinkI size={40} color={INK} /> Bio मधील लिंकवर क्लिक करा</Pill>
  } />
);

/* ---------- main ---------- */
const SCENES = {hook: Hook, town: Town, simple: Simple, market: Market, darkstore: DarkStore, tieup: Tieup, flow: Flow, math: MathSc, income: Income,
  profit: Profit, whatsapp: WhatsAppSc, apps: Apps, outgrid: Outgrid, cta: Cta, outro: Outro};
const Video = ({font}) => <ReelVideo font={font} scenes={SCENES} keys={KEYS} SC={SC} chunks={CHUNKS} outroAt={s(OUTRO_AT)} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{font: 'anek'}} />;
registerRoot(Root);
