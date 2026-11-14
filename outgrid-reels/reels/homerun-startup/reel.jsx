/*
 * HomeRun startup story (Marathi), LEAN style, light theme. VO sped up 1.04x (public/vo.mp3).
 * Real assets: public/img/homerun_logo.png, public/img/homerun_team.png (user-supplied), logos/blinkit.svg.
 * App UI, route map and order rows are illustrative.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, buildChunks} from '../../shared/kit.jsx';
import {
  BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_BLUE, C_ORANGE, C_RED, LAT, up,
  Glass, Chip, Alert, Ini, Ico, Tick, Bolt, I_PIN, I_CHART, I_USERS,
  Instagram, LogoImg, TextHook, LeanOutro, LeanVideo,
} from '../../shared/lean.jsx';

/* ---------- timing (seconds, VO at 1.04x) ---------- */
const SEGS = [
  [0.00, 4.01, 'Blinkit वरून दूध, भाजी आणि किराणा मागवणं आता सामान्य झालंय.'],
  [4.27, 6.88, 'पण बांधकामाच्या साइटवर अचानक *सिमेंट संपलं,*'],
  [7.10, 8.03, '*वायर* कमी पडली'],
  [8.17, 9.41, 'किंवा *प्लायवुड* हवं असेल,'],
  [9.66, 10.25, 'तर काय करणार?'],
  [10.54, 12.90, 'बेंगळुरूमधल्या *HomeRun* या Startup ने याच समस्येत मोठी *संधी* शोधली.'],
  [13.09, 15.12, 'हे बांधकाम साहित्यासाठीचं *Quick Commerce App* आहे.'],
  [15.39, 17.01, 'यावरून *Contractors* आणि *घरमालक*'],
  [17.16, 18.24, 'सिमेंट, टाइल्स,'],
  [18.51, 20.56, 'पेंट आणि प्लायवुडसारख्या वस्तू थेट'],
  [20.72, 21.84, 'साइटवर फक्त'],
  [22.05, 23.86, '*६० मिनिटांत* मागवू शकतात.'],
  [24.01, 26.57, 'या कल्पनेला किती मोठा *प्रतिसाद* मिळालाय?'],
  [26.88, 30.19, 'त्यांनी आतापर्यंत *१ लाखांहून अधिक Orders* पूर्ण केल्या आहेत,'],
  [30.49, 32.00, 'गेल्या १२ महिन्यांत बिझनेस *८ पट* वाढवलाय'],
  [32.13, 35.20, 'आणि *१२ मिलियन डॉलर्सचं Funding* मिळवलंय.'],
  [35.59, 37.20, 'यातला मोठा *बिझनेस धडा* काय आहे?'],
  [37.54, 40.25, 'मार्केटमध्ये *दुकानं* आणि *ग्राहक* आधीपासूनच होते,'],
  [40.51, 41.47, 'पण *माल शोधणं,*'],
  [41.63, 42.62, '*किमती* समजून घेणं'],
  [42.77, 45.35, 'आणि *वेळेवर माल मिळणं* ही मोठी अडचण होती.'],
  [45.64, 48.69, 'HomeRun ने हीच प्रक्रिया एका *सोप्या System* मध्ये आणली.'],
  [48.94, 51.48, 'प्रत्येक वेळी *नवीन कल्पना* शोधण्याची गरज नसते.'],
  [51.75, 54.19, 'जुन्याच बिझनेस मधला एखादा *प्रॉब्लेम* सोडवला'],
  [54.42, 56.63, 'तरी *कोट्यवधींची कंपनी* उभी राहू शकते.'],
  [56.93, 59.80, 'तुमच्याकडेही अशीच एखादी भारी *Business Idea* असेल'],
  [59.95, 62.06, 'आणि तुम्हाला तुमचं स्वतःचं *Mobile App* किंवा'],
  [62.22, 64.57, '*Website* बनवून बिझनेस सुरू करायचा असेल,'],
  [64.74, 66.85, 'तर *Outgrid Labs* ला आताच *DM* करा.'],
];
const OUTRO_AT = 66.95;
const SCENES = [['hook', 0, 4.14], ['site', 4.14, 10.40], ['reveal', 10.40, 13.0], ['app', 13.0, 20.64], ['delivery', 20.64, 23.94], ['traction', 23.94, 35.40],
  ['market', 35.40, 48.82], ['insight', 48.82, 56.78], ['cta', 56.78, OUTRO_AT], ['outro', OUTRO_AT, OUTRO_AT + 2.4]];
const TOTAL = s(OUTRO_AT + 2.4);
const CHUNKS = buildChunks(SEGS).filter((c) => c.a >= s(SCENES[0][2])); // no subtitles over the text hook

/* ---------- brand + real assets ---------- */
const HR_Y = '#FFDA01', HR_B = '#3B3BEB';
const HomeRunLogo = ({size = 200, style = {}}) => (
  <Img src={staticFile('img/homerun_logo.png')} style={{width: size, height: size, borderRadius: size * 0.235, display: 'block', flexShrink: 0, boxShadow: '0 20px 50px rgba(60,45,10,0.18)', ...style}} />
);
const TeamPhoto = ({w, h, zoom = 1, style = {}}) => (
  <div style={{width: w, height: h, borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 70px rgba(60,45,10,0.22)', ...style}}>
    <Img src={staticFile('img/homerun_team.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
  </div>
);
const Blinkit = ({size = 120, style = {}}) => <LogoImg src="blinkit.svg" size={size} style={{borderRadius: size * 0.21, ...style}} />;

/* ---------- material vectors (24-unit grid scaled, INK outlines) ---------- */
const INKC = '#1F1F1F';
const CementBag = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M12 10h40l-2 6 2 6v26l2 6-2 4H12l-2-4 2-6V22l-2-6z" fill="#C9C4BA" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <rect x="16" y="26" width="32" height="16" rx="2" fill="#fff" stroke={INKC} strokeWidth="2.5" />
    <text x="32" y="37.5" textAnchor="middle" fontSize="8" fontWeight="800" fill={INKC} fontFamily="Anek, sans-serif">CEMENT</text>
    <path d="M16 48h32" stroke={INKC} strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);
const WireCoil = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeLinecap="round">
    <circle cx="32" cy="32" r="22" stroke={INKC} strokeWidth="9" /><circle cx="32" cy="32" r="22" stroke="#E2683C" strokeWidth="5" />
    <circle cx="32" cy="32" r="13" stroke={INKC} strokeWidth="9" /><circle cx="32" cy="32" r="13" stroke="#E2683C" strokeWidth="5" />
    <path d="M50 46c4 4 8 6 10 4" stroke={INKC} strokeWidth="3.5" /><path d="M58 50l4-1" stroke="#C9A227" strokeWidth="3" />
  </svg>
);
const Plywood = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 22 40 12l18 8-34 12z" fill="#E8C48E" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M6 22v8l18 10v-8z" fill="#C99A5B" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M24 32l34-12v8L24 40z" fill="#D9AE72" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M8 26l16 9M8 29l16 9M26 35l30-11M26 38l30-11" stroke="#A9773A" strokeWidth="1.2" />
    <path d="M20 19c6-1 10 1 14-1M28 22c5-1 9 1 13-1" stroke="#B9874A" strokeWidth="1.5" fill="none" />
  </svg>
);
const Tiles = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {[[8, 8, '#DCE7F2'], [33, 8, '#F2F6FA'], [8, 33, '#F2F6FA'], [33, 33, '#DCE7F2']].map(([x, y, c], i) => <rect key={i} x={x} y={y} width="23" height="23" rx="3" fill={c} stroke={INKC} strokeWidth="3" />)}
    <path d="M12 14l6-4M37 39l6-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const PaintBucket = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M14 20h36l-3 36a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4z" fill="#fff" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <path d="M15 30h34l-1 10c-6 3-10-2-16 1s-10 0-16-1z" fill={HR_B} />
    <ellipse cx="32" cy="20" rx="18" ry="5" fill="#EDEAE3" stroke={INKC} strokeWidth="3" /><path d="M16 18c0-12 32-12 32 0" fill="none" stroke={INKC} strokeWidth="3" />
  </svg>
);
const Pipe = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeLinejoin="round">
    <path d="M10 22h26a10 10 0 0 1 10 10v22" stroke={INKC} strokeWidth="14" /><path d="M10 22h26a10 10 0 0 1 10 10v22" stroke="#9BB7C9" strokeWidth="8" />
    <rect x="4" y="13" width="10" height="18" rx="2" fill="#7E9BAE" stroke={INKC} strokeWidth="3" /><rect x="37" y="50" width="18" height="10" rx="2" fill="#7E9BAE" stroke={INKC} strokeWidth="3" />
  </svg>
);
const Tempo = ({size = 200, spin = 0}) => (
  <svg viewBox="0 0 120 80" width={size} height={size * 2 / 3}>
    <rect x="4" y="8" width="68" height="50" rx="5" fill={HR_Y} stroke={INKC} strokeWidth="3.5" />
    <path d="M12 28l8-10M20 28l8-10" stroke={INKC} strokeWidth="3" strokeLinecap="round" />
    <path d="M72 22h20c8 0 14 8 18 18v18H72z" fill="#3DBB4A" stroke={INKC} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M80 28h10c4 0 8 4 10 10H80z" fill="#CFE6F5" stroke={INKC} strokeWidth="2.5" />
    {[22, 96].map((x) => <g key={x} transform={`rotate(${spin} ${x} 62)`}><circle cx={x} cy="62" r="11" fill={INKC} /><circle cx={x} cy="62" r="4.5" fill="#ddd" /><path d={`M${x - 8} 62h16`} stroke="#666" strokeWidth="2" /></g>)}
  </svg>
);
const Shop = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="10" y="28" width="44" height="30" fill="#fff" stroke={INKC} strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${8 + i * 12} 16h12v8a6 6 0 0 1-12 0z`} fill={i % 2 ? '#fff' : Y} stroke={INKC} strokeWidth="2.5" strokeLinejoin="round" />)}
    <rect x="8" y="8" width="48" height="8" rx="2" fill={INKC} /><rect x="36" y="38" width="12" height="20" fill={INKC} /><rect x="16" y="36" width="14" height="10" fill="#FFF4D1" stroke={INKC} strokeWidth="2" />
  </svg>
);
const Person = ({size = 100, c = INKC}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><circle cx="32" cy="20" r="11" fill={c} /><path d="M10 60c0-16 10-24 22-24s22 8 22 24z" fill={c} /></svg>
);
const Bulb = ({size = 120, on = 1}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {on > 0 && [0, 1, 2, 3, 4].map((i) => <path key={i} d="M32 2v6" stroke={GOLD_T} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${(i - 2) * 35} 32 28)`} opacity={on} />)}
    <path d="M32 12a16 16 0 0 0-9 29c2 2 3 4 3 7h12c0-3 1-5 3-7a16 16 0 0 0-9-29z" fill={on ? Y : '#E5E0D5'} stroke={INKC} strokeWidth="3" />
    <path d="M26 52h12M27 57h10" stroke={INKC} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);
const Wrench = ({size = 110}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M44 6a14 14 0 0 0-13 19L8 48a6 6 0 0 0 8 8l23-23A14 14 0 0 0 58 20l-8 8-9-2-2-9 8-8a14 14 0 0 0-3-3z" fill="#D7DCE2" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
const Rocket = ({size = 120}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M40 6c10 2 16 8 18 18L36 46l-18-18z" fill="#fff" stroke={INKC} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="42" cy="22" r="5" fill={HR_B} stroke={INKC} strokeWidth="2.5" />
    <path d="M18 28l-10 2 8-12 12-2zM36 46l-2 10 12-8 2-12z" fill={C_RED} stroke={INKC} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M18 46c-6 0-10 6-10 10 4 0 10-4 10-10z" fill={Y} stroke={INKC} strokeWidth="2.5" />
  </svg>
);
const Big = ({children, size = 120, color = TXT, style = {}}) => <div style={{fontSize: size, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Row = ({icon, title, sub, right, style = {}}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26, ...style}}>
    <div style={{width: 130, height: 130, borderRadius: 32, background: '#F6F1E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
    <div style={{flex: 1}}>
      <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>{title}</div>
      {sub && <div style={{fontSize: 26, fontWeight: 500, color: MUTED, ...LAT}}>{sub}</div>}
    </div>
    {right}
  </div>
);

/* ---------- 1. Hook: Blinkit groceries yes, cement? ---------- */
const GROC = [['दूध', '1 L', '#FFFFFF'], ['भाजी', '1 kg', '#DFF3D8'], ['किराणा', '5 items', '#FFF1C9']];
const Hook = ({F}) => (
  <TextHook F={F}
    eyebrow="Quick Commerce"
    lines={[
      {t: -0.3, node: <><Blinkit size={124} /><span>दूध, भाजी</span><Tick size={90} /></>},
      {t: 2.2, node: <span>पण <span style={{color: C_RED}}>सिमेंट?</span></span>},
    ]}
    visual={
      <Glass x={90} y={660} w={900} h={640} r={44} style={{padding: '34px 40px', transform: `rotate(-2deg) translateY(${io(F, 0, s(0.9), 50, 0)}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Blinkit size={64} />
          <div style={{fontSize: 36, fontWeight: 700, color: TXT, ...LAT}}>Your order</div>
          <div style={{flex: 1}} /><Chip color={C_GREEN} size={24}>Delivered</Chip>
        </div>
        <div style={{height: 1.5, background: LINE, margin: '24px -40px 4px'}} />
        {GROC.map(([n, q, c], i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', borderBottom: `1.5px solid ${LINE}`, ...up(F, -0.6 + i * 0.3, 10, 16)}}>
            <div style={{width: 70, height: 70, borderRadius: 18, background: c, border: `1.5px solid ${LINE}`}} />
            <div style={{flex: 1, fontSize: 36, fontWeight: 600, color: TXT, ...LAT}}>{n}</div>
            <div style={{fontSize: 26, color: MUTED, ...LAT}}>{q}</div><Tick size={44} />
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', ...up(F, 2.5, 10, 16)}}>
          <div style={{width: 70, height: 70, borderRadius: 18, background: '#EEE9DF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CementBag size={60} /></div>
          <div style={{flex: 1, fontSize: 36, fontWeight: 600, color: TXT, ...LAT}}>सिमेंट · 50 kg</div>
          <div style={{transform: `scale(${pop(F, 2.8, 9)})`}}><Chip color={C_RED} size={26}>Not available</Chip></div>
        </div>
      </Glass>
    }
  />
);

/* ---------- 2. Site: cement over, wire short, plywood needed ---------- */
const MATS = [[5.9, <CementBag key="c" size={104} />, 'सिमेंट', 'संपलं', C_RED], [7.15, <WireCoil key="w" size={100} />, 'वायर', 'कमी', C_ORANGE], [8.3, <Plywood key="p" size={104} />, 'प्लायवुड', 'हवं', C_BLUE]];
const SiteSkyline = ({F}) => (
  <svg viewBox="0 0 820 300" width="820" height="300">
    <path d="M0 290H820" stroke={INKC} strokeWidth="4" />
    {/* building frame */}
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={300 + c * 90} y={210 - r * 70} width="90" height="70" fill={r < 2 ? '#EFE7D6' : 'none'} stroke="#9A8F7B" strokeWidth="3" />))}
    {[0, 1, 2, 3].map((c) => <rect key={c} x={296 + c * 90} y="0" width="8" height="290" fill="#E2683C" opacity={0.85} />)}
    {/* crane */}
    <path d="M120 290V30M120 30h300M120 30l60 0M120 60l300-30" stroke={INKC} strokeWidth="5" fill="none" />
    <path d="M120 30l-40 0" stroke={INKC} strokeWidth="5" /><rect x="70" y="30" width="30" height="24" fill={INKC} />
    <path d={`M${330 + Math.sin(F / 20) * 10} 30v${60 + Math.sin(F / 15) * 6}`} stroke={INKC} strokeWidth="2.5" />
    <rect x={318 + Math.sin(F / 20) * 10} y={88 + Math.sin(F / 15) * 6} width="26" height="16" fill={Y} stroke={INKC} strokeWidth="2.5" />
    {/* sand heap + mixer */}
    <path d="M560 290c20-50 60-60 90-60s60 20 80 60z" fill="#E8D3A8" stroke={INKC} strokeWidth="3" />
  </svg>
);
const Site = ({F}) => {
  const hold = pop(F, 9.7, 10);
  return (
    <AbsoluteFill>
      <Glass x={90} y={230} w={900} h={930} r={44} style={{padding: '30px 40px', ...up(F, 4.25, 16, 50)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Ico d={I_PIN} size={34} color={GOLD_T} sw={2.4} /><div style={{fontSize: 32, fontWeight: 700, color: TXT, ...LAT}}>Construction site</div>
          <div style={{flex: 1}} /><div style={{fontSize: 26, fontWeight: 600, color: MUTED, ...LAT}}>Day 42</div>
        </div>
        <div style={{marginTop: 20, borderRadius: 28, background: '#F6F1E6', padding: '20px 0 0', display: 'flex', justifyContent: 'center', overflow: 'hidden'}}><SiteSkyline F={F} /></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 30}}>
          {MATS.map(([t, ic, n, st, c], i) => (
            <Row key={i} icon={ic} title={n} style={up(F, t - 0.2, 12, 24)} right={<div style={{transform: `scale(${pop(F, t + 0.25, 9)})`}}><Chip color={c} size={32}>{st}</Chip></div>} />
          ))}
        </div>
      </Glass>
      <div style={{...abs(0, 1210), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${hold}) rotate(-2deg)`}}><Alert size={40}>काम थांबलं</Alert></div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Reveal: HomeRun, Bengaluru (real photo) ---------- */
const Reveal = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(70, 330), transform: `rotate(-2deg) scale(${0.94 + 0.06 * pop(F, 10.45, 16)})`, opacity: io(F, s(10.4), s(10.4) + 8)}}>
      <TeamPhoto w={940} h={705} zoom={1.12 - 0.08 * io(F, s(10.4), s(13.0), 0, 1, Easing.linear)} />
    </div>
    <div style={{...abs(760, 220), transform: `scale(${pop(F, 10.95, 11)}) rotate(6deg)`}}><HomeRunLogo size={250} /></div>
    <div style={{...abs(90, 1090), display: 'flex', gap: 18}}>
      <div style={{transform: `scale(${pop(F, 10.6, 12)})`}}><Chip color={C_BLUE} size={36}>Bengaluru</Chip></div>
      <div style={{transform: `scale(${pop(F, 11.6, 12)})`}}><Chip color={C_GREEN} size={36}>Startup</Chip></div>
    </div>
    <div style={{...abs(90, 1180), fontSize: 26, fontWeight: 500, color: MUTED, ...LAT, opacity: io(F, s(11.0), s(11.4))}}>Team HomeRun</div>
  </AbsoluteFill>
);

/* ---------- 4. App: quick commerce for construction material ---------- */
const CATS = [['Cement', CementBag, 17.15], ['Tiles', Tiles, 17.55], ['Paint', PaintBucket, 18.55], ['Plywood', Plywood, 19.2], ['Wires', WireCoil, null], ['Plumbing', Pipe, null]];
const App = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(410, 230), width: 620, height: 1150, borderRadius: 84, background: '#1d1d1f', padding: 14, boxSizing: 'border-box', boxShadow: '0 50px 100px rgba(60,45,10,0.28)',
      transform: `translateY(${(1 - pop(F, 13.05, 15)) * 400}px)`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 72, overflow: 'hidden', background: '#FAF8F3', position: 'relative'}}>
        <div style={{background: HR_Y, padding: '74px 28px 26px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <HomeRunLogo size={62} style={{boxShadow: 'none', border: `2px solid ${HR_B}22`}} />
            <div style={{fontSize: 34, fontWeight: 800, color: HR_B, fontStyle: 'italic', ...LAT}}>HomeRun</div>
            <div style={{flex: 1}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 6, background: HR_B, color: '#fff', borderRadius: 999, padding: '8px 16px 4px 10px', fontSize: 22, fontWeight: 700}}><Bolt size={22} color={HR_Y} />60 min</div>
          </div>
          <div style={{marginTop: 20, height: 64, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', padding: '4px 20px 0', fontSize: 24, color: '#9a958a', ...LAT}}>Search cement, tiles, paint…</div>
        </div>
        <div style={{padding: '22px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
          {CATS.map(([n, Icon, t], i) => {
            const on = t && F >= s(t);
            return (
              <div key={i} style={{height: 210, borderRadius: 26, background: '#fff', border: `3px solid ${on ? HR_B : 'rgba(0,0,0,0.06)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                transform: `scale(${t ? 1 + 0.06 * io(F, s(t), s(t) + 5) * io(F, s(t) + 8, s(t) + 16, 1, 0) : 1})`, boxShadow: on ? `0 12px 30px ${HR_B}30` : 'none', ...up(F, 13.5 + i * 0.1, 10, 16)}}>
                <Icon size={110} />
                <div style={{fontSize: 28, fontWeight: 700, color: '#1F1F1F', ...LAT}}>{n}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <div style={{...abs(40, 560), transform: `scale(${pop(F, 15.5, 11)}) rotate(-5deg)`}}>
      <Glass x={0} y={0} w={330} h={120} r={60} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px'}}><Ico d={I_USERS} size={50} color={HR_B} /><div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>Contractors</div></Glass>
    </div>
    <div style={{...abs(60, 760), transform: `scale(${pop(F, 16.4, 11)}) rotate(4deg)`}}>
      <Glass x={0} y={0} w={300} h={120} r={60} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px'}}><Person size={50} c={HR_B} /><div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>घरमालक</div></Glass>
    </div>
  </AbsoluteFill>
);

/* ---------- 5. 60-minute delivery to site ---------- */
const Delivery = ({F}) => {
  const p = io(F, s(20.9), s(23.6), 0, 1, Easing.inOut(Easing.cubic));
  const R = 230, C = 2 * Math.PI * R;
  const route = 'M120 250 C 260 250, 300 90, 470 120 S 690 230, 760 110';
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 280, 230), width: 560, height: 560, transform: `scale(${pop(F, 20.7, 14)})`}}>
        <svg width="560" height="560" style={{...abs(0, 0)}}>
          <circle cx="280" cy="280" r={R} fill="#fff" stroke="rgba(0,0,0,0.06)" strokeWidth="34" />
          <circle cx="280" cy="280" r={R} fill="none" stroke={HR_Y} strokeWidth="34" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 280 280)" />
          {Array.from({length: 12}, (_, i) => <line key={i} x1="280" y1="70" x2="280" y2={i % 3 ? 84 : 92} stroke="rgba(0,0,0,0.25)" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 30} 280 280)`} />)}
        </svg>
        <div style={{...abs(0, 160), width: 560, textAlign: 'center'}}>
          <Big size={220} color={HR_B}>{Math.round(60 * io(F, s(21.9), s(22.6), 0, 1))}</Big>
          <div style={{fontSize: 50, fontWeight: 700, color: TXT, marginTop: 4}}>मिनिट</div>
        </div>
      </div>
      <Glass x={90} y={860} w={900} h={460} r={44} style={{padding: 30, ...up(F, 20.8, 14, 40)}}>
        <svg viewBox="0 0 840 400" width="840" height="400" style={{...abs(30, 30)}}>
          {[60, 140, 220, 300].map((y) => <path key={y} d={`M0 ${y}H840`} stroke="rgba(0,0,0,0.05)" strokeWidth="18" />)}
          {[150, 380, 610].map((x) => <path key={x} d={`M${x} 0V400`} stroke="rgba(0,0,0,0.05)" strokeWidth="18" />)}
          <path d={route} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="12" strokeLinecap="round" />
          <path d={route} fill="none" stroke={HR_B} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
        <div style={{...abs(60, 210), display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Shop size={90} /><div style={{fontSize: 24, fontWeight: 700, color: TXT}}>Store</div></div>
        <div style={{...abs(750, 40), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{width: 84, height: 84, borderRadius: 42, background: C_RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${10 + 6 * Math.sin(F / 5)}px ${C_RED}22`}}><Ico d={I_PIN} size={50} color="#fff" sw={2.4} /></div>
          <div style={{fontSize: 24, fontWeight: 700, color: TXT, marginTop: 6}}>Site</div>
        </div>
        <div style={{position: 'absolute', left: 30, top: 30, width: 840, height: 400}}>
          <div style={{position: 'absolute', offsetPath: `path('${route}')`, offsetDistance: `${p * 100}%`, offsetRotate: '0deg', transform: 'translate(-50%, -70%)'}}><Tempo size={150} spin={F * 30} /></div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 6. Traction: 1 lakh+ orders, 8x growth, $12M funding ---------- */
const GROW = [1, 1.3, 1.6, 2.1, 2.6, 3.3, 4.1, 5, 5.8, 6.7, 7.4, 8];
const Traction = ({F}) => {
  const q = io(F, s(26.6), s(26.95), 1, 0);
  const orders = Math.round(io(F, s(27.1), s(28.8), 0, 100000, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 520), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: q, transform: `scale(${pop(F, 24.05, 13)})`}}>
        <HomeRunLogo size={260} />
        <Big size={200} color={GOLD_T}>?</Big>
      </div>
      <Glass x={90} y={230} w={900} h={300} r={40} style={{padding: '36px 44px', ...up(F, 26.95, 16, 50)}}>
        <div style={{fontSize: 28, fontWeight: 700, color: MUTED, letterSpacing: '0.1em'}}>ORDERS DELIVERED</div>
        <Big size={140} style={{marginTop: 18, fontVariantNumeric: 'tabular-nums'}}>{orders.toLocaleString('en-IN')}<span style={{color: GOLD_T}}>+</span></Big>
      </Glass>
      <Glass x={90} y={570} w={900} h={340} r={40} style={{padding: '30px 44px', display: 'flex', alignItems: 'center', gap: 40, ...up(F, 30.4, 16, 50)}}>
        <div>
          <div style={{fontSize: 28, fontWeight: 700, color: MUTED, letterSpacing: '0.1em'}}>GROWTH · 12 MONTHS</div>
          <Big size={150} color={C_GREEN} style={{marginTop: 14}}>{Math.max(1, Math.round(8 * io(F, s(30.7), s(31.8))))}×</Big>
        </div>
        <div style={{flex: 1, height: 230, display: 'flex', alignItems: 'flex-end', gap: 8}}>
          {GROW.map((g, i) => <div key={i} style={{flex: 1, borderRadius: 6, height: `${(g / 8) * 100 * io(F, s(30.6 + i * 0.07), s(31.0 + i * 0.07))}%`, background: i === 11 ? C_GREEN : `${C_GREEN}44`}} />)}
        </div>
      </Glass>
      <div style={{...abs(90, 950), transform: `translateY(${(1 - pop(F, 32.2, 15)) * 120}px)`, opacity: io(F, s(32.1), s(32.4))}}>
        <TeamPhoto w={900} h={400} zoom={1.15 - 0.06 * io(F, s(32.1), s(35.4), 0, 1, Easing.linear)} style={{objectPosition: 'center 30%'}} />
        <div style={{...abs(0, 0), width: 900, height: 400, borderRadius: 40, background: 'linear-gradient(90deg, rgba(10,10,11,0.82) 0%, rgba(10,10,11,0.55) 45%, rgba(10,10,11,0) 75%)'}} />
        <div style={{...abs(44, 70)}}>
          <div style={{fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.1em'}}>FUNDING RAISED</div>
          <Big size={150} color={Y} style={{marginTop: 18}}>$12M</Big>
          <div style={{fontSize: 30, fontWeight: 600, color: '#fff', marginTop: 10, ...LAT}}>≈ ₹100 कोटी</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7. Market: shops + customers existed; friction -> one simple system ---------- */
const PAINS = [[40.55, <Ico key="s" d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>} size={70} color={INKC} sw={2.2} />, 'माल शोधणं', 'Search'],
  [41.7, <div key="r" style={{fontSize: 72, fontWeight: 800, color: INKC}}>₹</div>, 'किमती', 'Clear prices'],
  [42.85, <Ico key="c" d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} size={70} color={INKC} sw={2.2} />, 'वेळेवर माल', '60-min delivery']];
const Market = ({F}) => {
  const fix = io(F, s(45.75), s(46.2));
  const flow = io(F, s(46.2), s(47.2));
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 230), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${pop(F, 35.6, 12)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: Y, borderRadius: 999, padding: '14px 32px 8px 18px'}}><Bulb size={50} /><div style={{fontSize: 32, fontWeight: 800, color: BG, letterSpacing: '0.08em'}}>BUSINESS LESSON</div></div>
      </div>
      {/* shops  <->  customers */}
      <Glass x={90} y={350} w={300} h={300} r={40} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, transform: `scale(${pop(F, 37.9, 13)})`}}>
        <div style={{display: 'flex', gap: 4}}><Shop size={84} /><Shop size={84} /></div>
        <div style={{fontSize: 40, fontWeight: 700, color: TXT}}>दुकानं</div>
      </Glass>
      <Glass x={690} y={350} w={300} h={300} r={40} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, transform: `scale(${pop(F, 38.9, 13)})`}}>
        <div style={{display: 'flex', gap: 0}}><Person size={78} /><Person size={78} c={HR_B} /><Person size={78} /></div>
        <div style={{fontSize: 40, fontWeight: 700, color: TXT}}>ग्राहक</div>
      </Glass>
      <svg width="300" height="60" style={{...abs(390, 470)}}>
        <path d="M10 30H290" stroke={fix > 0.5 ? C_GREEN : 'rgba(0,0,0,0.25)'} strokeWidth="6" strokeDasharray={fix > 0.5 ? '1 0' : '10 12'} strokeLinecap="round" opacity={io(F, s(39.3), s(39.7))} />
        {fix > 0.5 && <circle cx={10 + 280 * ((flow * 3) % 1)} cy="30" r="9" fill={C_GREEN} />}
      </svg>
      <div style={{...abs(540 - 70, 430), transform: `scale(${pop(F, 45.7, 10)})`}}><HomeRunLogo size={140} /></div>
      {!(fix > 0) && <div style={{...abs(540 - 34, 466), width: 68, height: 68, borderRadius: 34, background: 'var(--l-alertbg)', border: `2px solid ${C_RED}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(F, 40.4, 10)})`}}>
        <svg viewBox="0 0 24 24" width="30" height="30"><path d="M6 6l12 12M18 6L6 18" stroke={C_RED} strokeWidth="3" strokeLinecap="round" /></svg></div>}
      {/* the three frictions -> fixed */}
      <div style={{...abs(90, 720), width: 900, display: 'flex', flexDirection: 'column', gap: 22}}>
        {PAINS.map(([t, icon, pain, sol], i) => (
          <Glass key={i} x={0} y={0} w={900} h={180} r={36} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px', ...up(F, t - 0.15, 12, 30),
            borderColor: fix > 0.5 ? `${C_GREEN}55` : LINE}}>
            <div style={{width: 120, height: 120, borderRadius: 30, background: '#F6F1E6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
            <div style={{flex: 1, position: 'relative', height: 60}}>
              <div style={{...abs(0, 0), fontSize: 48, fontWeight: 700, color: TXT, ...LAT, opacity: 1 - fix}}>{pain}</div>
              <div style={{...abs(0, 0), fontSize: 48, fontWeight: 700, color: TXT, ...LAT, opacity: fix}}>{sol}</div>
            </div>
            <div style={{position: 'relative', width: 70, height: 70}}>
              <div style={{...abs(0, 0), opacity: 1 - fix, transform: `scale(${pop(F, t + 0.3, 9)})`}}><svg viewBox="0 0 24 24" width="70" height="70"><circle cx="12" cy="12" r="11" fill={C_RED} /><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg></div>
              <div style={{...abs(0, 0), opacity: fix, transform: `scale(${pop(F, 45.9 + i * 0.15, 9)})`}}><Tick size={70} /></div>
            </div>
          </Glass>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 8. Insight: no new idea needed; old business + 1 problem solved = big company ---------- */
const Insight = ({F}) => {
  const x = io(F, s(50.6), s(51.0));
  const eq = [[51.9, <Shop key="s" size={110} />, 'जुना बिझनेस', null], [53.0, <Wrench key="w" size={100} />, '1 प्रॉब्लेम सोडवला', '+'], [54.6, <Rocket key="r" size={110} />, 'कोट्यवधींची कंपनी', '=']];
  return (
    <AbsoluteFill>
      <Glass x={90} y={230} w={900} h={250} r={40} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', transform: `scale(${pop(F, 49.0, 13)})`, opacity: 1 - x * 0.4}}>
        <div style={{filter: `grayscale(${x})`}}><Bulb size={140} on={1 - x} /></div>
        <div style={{fontSize: 58, fontWeight: 700, color: TXT, ...LAT}}>नवीन कल्पना?</div>
      </Glass>
      <svg width="900" height="250" style={{...abs(90, 230), overflow: 'visible'}}><path d="M60 160 L840 90" stroke={C_RED} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - x} /></svg>
      <div style={{...abs(90, 540), width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        {eq.map(([t, ic, label, op], i) => (
          <React.Fragment key={i}>
            {op && <div style={{fontSize: 80, fontWeight: 800, color: GOLD_T, lineHeight: 1, opacity: io(F, s(t - 0.1), s(t + 0.1))}}>{op}</div>}
            <Glass x={0} y={0} w={900} h={190} r={36} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', transform: `scale(${pop(F, t, 13)})`,
              ...(i === 2 ? {background: Y, borderColor: 'transparent', boxShadow: `0 30px 70px ${Y}66`} : {})}}>
              <div style={{width: 130, height: 130, borderRadius: 32, background: i === 2 ? '#fff' : '#F6F1E6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic}</div>
              <div style={{fontSize: 52, fontWeight: 700, color: i === 2 ? BG : TXT, ...LAT}}>{label}</div>
            </Glass>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. CTA: your idea -> app / website -> DM Outgrid Labs ---------- */
const Cta = ({F}) => {
  const dm = pop(F, 64.8, 13);
  const typed = 'Hi, माझी एक Business Idea आहे'.slice(0, Math.floor(io(F, s(65.3), s(66.6), 0, 29, Easing.linear)));
  return (
    <AbsoluteFill>
      <Glass x={90} y={230} w={900} h={220} r={40} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', transform: `scale(${pop(F, 57.0, 13)})`, borderColor: `${Y}`, boxShadow: `0 24px 70px ${Y}55`}}>
        <Bulb size={130} /><div style={{fontSize: 58, fontWeight: 700, color: TXT, ...LAT}}>तुमची Business Idea</div>
      </Glass>
      {/* mobile app */}
      <div style={{...abs(110, 520), width: 300, height: 520, borderRadius: 48, background: '#1d1d1f', padding: 10, boxSizing: 'border-box', transform: `scale(${pop(F, 60.4, 13)}) rotate(-4deg)`, boxShadow: '0 30px 60px rgba(60,45,10,0.25)'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 40, background: '#FAF8F3', overflow: 'hidden', padding: '50px 18px 18px', boxSizing: 'border-box'}}>
          <div style={{height: 90, borderRadius: 20, background: Y}} />
          {[0, 1, 2].map((i) => <div key={i} style={{display: 'flex', gap: 10, marginTop: 16, alignItems: 'center'}}><div style={{width: 60, height: 60, borderRadius: 14, background: '#EEE8DA'}} /><div style={{flex: 1}}><div style={{height: 14, width: '80%', borderRadius: 7, background: '#DDD4C2'}} /><div style={{height: 10, width: '50%', borderRadius: 5, background: '#ECE6D8', marginTop: 8}} /></div></div>)}
          <div style={{height: 64, borderRadius: 18, background: BG, marginTop: 22}} />
        </div>
      </div>
      <div style={{...abs(110, 1060), width: 300, textAlign: 'center', fontSize: 36, fontWeight: 700, color: TXT, ...LAT, opacity: io(F, s(60.6), s(61))}}>Mobile App</div>
      {/* website */}
      <div style={{...abs(450, 600), width: 540, height: 400, borderRadius: 28, background: '#fff', border: `1.5px solid ${LINE}`, overflow: 'hidden', transform: `scale(${pop(F, 62.25, 13)}) rotate(3deg)`, boxShadow: '0 30px 60px rgba(60,45,10,0.18)'}}>
        <div style={{height: 46, background: '#F1ECE1', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px'}}>{[C_RED, Y, C_GREEN].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}<div style={{flex: 1, height: 24, borderRadius: 12, background: '#fff', marginLeft: 12}} /></div>
        <div style={{padding: 26}}>
          <div style={{height: 30, width: '70%', borderRadius: 8, background: '#2A2A2A'}} /><div style={{height: 16, width: '90%', borderRadius: 8, background: '#E2DCCF', marginTop: 16}} /><div style={{height: 16, width: '60%', borderRadius: 8, background: '#E2DCCF', marginTop: 10}} />
          <div style={{display: 'flex', gap: 14, marginTop: 26}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 120, borderRadius: 16, background: i === 1 ? Y : '#F1ECE1'}} />)}</div>
        </div>
      </div>
      <div style={{...abs(450, 1060), width: 540, textAlign: 'center', fontSize: 36, fontWeight: 700, color: TXT, ...LAT, opacity: io(F, s(62.4), s(62.8))}}>Website</div>
      {/* DM */}
      <div style={{...abs(90, 1130), width: 900, transform: `translateY(${(1 - dm) * 200}px)`, opacity: Math.min(1, dm * 2)}}>
        <Glass x={0} y={0} w={900} h={230} r={40} style={{position: 'relative', padding: '28px 34px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Instagram size={60} />
            <div style={{flex: 1}}><div style={{fontSize: 32, fontWeight: 700, color: TXT, ...LAT}}>outgridlabs</div><div style={{fontSize: 22, color: MUTED, ...LAT}}>Message</div></div>
            <div style={{background: '#0095F6', color: '#fff', borderRadius: 14, padding: '12px 26px 8px', fontSize: 28, fontWeight: 700, ...LAT}}>DM</div>
          </div>
          <div style={{marginTop: 18, height: 70, borderRadius: 35, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '6px 26px 0', fontSize: 30, fontWeight: 600, color: TXT, ...LAT}}>
            {typed}<span style={{color: '#0095F6', opacity: Math.floor(F / 8) % 2}}>|</span>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => <LeanOutro F={F} at={OUTRO_AT} cta="DM करा" />;

/* ---------- main ---------- */
const COMPS = {hook: Hook, site: Site, reveal: Reveal, app: App, delivery: Delivery, traction: Traction, market: Market, insight: Insight, cta: Cta, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
