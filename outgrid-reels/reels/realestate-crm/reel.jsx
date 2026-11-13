/*
 * Real Estate CRM reel (Marathi + English), 9:16, dark premium style.
 * Logos: public/logos/99acres.svg (app icon), public/logos/excel.svg (Microsoft Excel icon),
 * Facebook + WhatsApp glyphs from simple-icons (CC0). Trademarks of their owners.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark, BRAND, WA_D, InstagramLogo, buildChunks} from '../../shared/kit.jsx';

/* ---------- timing (seconds) ---------- */
const SEGS = [
  [0.00, 3.86, 'Real Estate चा Business अजूनही *डायरी* आणि *Excel Sheet* वर Manage करताय?'],
  [4.16, 9.83, '*99acres,* *Facebook* किंवा *Walk-ins* मधून येणारे Leads एका ठिकाणी Track करणं कठीण जातंय?'],
  [10.12, 11.44, 'कधी *Follow-up* राहून जातो,'],
  [11.67, 14.88, 'तर कधी *Site Visit* नंतर Customer शी संपर्क करायला विसरता?'],
  [15.19, 17.08, 'आणि Sales Person ने *Job सोडला* तर'],
  [17.27, 21.39, 'त्याच्याकडचे Customer Details आणि *Lead History* मिळवणंही कठीण होऊ शकतं.'],
  [21.69, 24.54, 'यासाठी आम्ही तयार करतो तुमच्या बिझनेससाठी'],
  [24.73, 26.61, '*Customised Real Estate CRM.*'],
  [26.94, 29.59, 'यामध्ये वेगवेगळ्या Sources मधून आलेले Leads *एकाच*'],
  [29.78, 31.69, '*Dashboard* वर Manage करता येतात.'],
  [32.03, 35.53, 'Site Visit नंतर Customer ला *Automatic WhatsApp Message* जातो.'],
  [35.81, 38.60, 'Sales Team साठी *Follow-up Reminders* सेट करता येतात.'],
  [38.94, 39.32, 'तसंच'],
  [39.50, 41.51, 'प्रत्येक Project साठी किती *Leads* आले,'],
  [41.69, 44.20, 'किती *Site Visits* झाल्या आणि किती *Bookings* झाल्या,'],
  [44.40, 46.46, 'याचा *Report* एकाच ठिकाणी पाहता येतो.'],
  [46.79, 48.12, 'हे Readymade Software *नाही.*'],
  [48.37, 52.50, 'तुमच्या Projects आणि Sales Process नुसार तयार केलेलं *Custom CRM* आहे.'],
  [52.82, 56.97, 'तुम्ही Builder किंवा Real Estate Agent असाल, तर Comment मध्ये *‘CRM’* लिहा.'],
  [57.22, 58.88, 'आम्ही तुम्हाला याचा *Demo* पाठवू.'],
];
const TOTAL = s(61.5);
// hook captions hidden: the on-screen text hook carries that line
const CHUNKS = buildChunks(SEGS).filter((c) => c.a >= s(4.0));
// [key, fromSec, toSec]; each cut sits inside a VO pause
const SCENES_T = [['hook', 0, 4.0], ['sources', 4.0, 9.98], ['missed', 9.98, 15.03], ['left', 15.03, 21.54], ['reveal', 21.54, 26.8], ['leads', 26.8, 31.85],
  ['wa', 31.85, 35.67], ['remind', 35.67, 38.77], ['report', 38.77, 46.62], ['custom', 46.62, 52.66], ['cta', 52.66, 59.1], ['outro', 59.1, 61.5]];

/* ---------- dark system ---------- */
const BG = '#0A0A0B';
const TXT = '#F5F5F2';
const MUTED = 'rgba(245,245,242,0.52)';
const LINE = 'rgba(255,255,255,0.09)';
const GLASS = 'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03))';
const C_GREEN = '#22C55E', C_BLUE = '#3B82F6', C_ORANGE = '#F59E0B', C_RED = '#EF4444';
const LAT = {letterSpacing: '-0.02em'};
const up = (F, t, d = 16, y = 36) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, y, 0)}px)`});

const Glass = ({x, y, w, h, r = 36, style = {}, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, background: GLASS, border: `1.5px solid ${LINE}`, boxSizing: 'border-box',
    boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', ...style}}>{children}</div>
);
const Chip = ({children, color = C_GREEN, size = 24, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: size, fontWeight: 600, color, background: `${color}1F`, border: `1.5px solid ${color}40`,
    borderRadius: 999, padding: `${size * 0.32}px ${size * 0.62}px ${size * 0.18}px`, whiteSpace: 'nowrap', ...style}}>
    <span style={{width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: color, marginTop: -size * 0.12}} />{children}
  </div>
);

/* ---------- real logos ---------- */
const FB_D = 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z';
const LogoImg = ({src, size, style = {}}) => <Img src={staticFile(`logos/${src}`)} style={{width: size, height: size, display: 'block', ...style}} />;
const Acres99 = ({size = 120, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <LogoImg src="99acres.svg" size={size * 0.9} />
  </div>
);
const Excel = ({size = 120, style = {}}) => <LogoImg src="excel.svg" size={size} style={{objectFit: 'contain', ...style}} />;
const Facebook = ({size = 120, style = {}}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{flexShrink: 0, ...style}}><circle cx="12" cy="12" r="10.5" fill="#fff" /><path d={FB_D} fill="#0866FF" /></svg>
);
const WhatsApp = ({size = 120, round = false, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: round ? '50%' : size * 0.24, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}><path d={WA_D} fill="#fff" /></svg>
  </div>
);
const WalkIn = ({size = 120, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: '#1C1C1F', border: `1.5px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box', ...style}}>
    <svg viewBox="0 0 64 64" width={size * 0.6} height={size * 0.6} fill="none" stroke={Y} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="35" cy="10" r="6" fill={Y} stroke="none" /><path d="M33 20l-5 18 9 8 3 14M28 38l-8 20M31 24l-10 6v8M33 22l9 9 8 1" />
    </svg>
  </div>
);

/* ---------- small icons ---------- */
const Tick = ({size = 28, color = C_GREEN}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><circle cx="12" cy="12" r="11" fill={color} /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Pin = ({size = 40, color = Y}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M12 22s7-6.6 7-12.2A7 7 0 0 0 5 9.8C5 15.4 12 22 12 22z" fill={color} /><circle cx="12" cy="9.8" r="2.6" fill={BG} /></svg>
);
const Bolt = ({size = 30, color = BG}) => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={color} /></svg>;
const DoubleTick = ({size = 26}) => (
  <svg viewBox="0 0 28 18" width={size} height={size * 0.64} fill="none" stroke="#53BDEB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 9.5l4.5 4.5L15 4.5" /><path d="M11 13l1 1L21.5 4.5" /></svg>
);

/* ---------- background + chrome ---------- */
const Bg = ({f}) => (
  <AbsoluteFill style={{background: BG}}>
    <AbsoluteFill style={{background: `radial-gradient(900px 700px at ${20 + Math.sin(f / 90) * 6}% 8%, rgba(255,197,46,0.16), transparent 60%), radial-gradient(800px 800px at 95% 85%, rgba(59,130,246,0.10), transparent 60%)`}} />
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)'}} />
  </AbsoluteFill>
);
const Watermark = () => (
  <div style={{...abs(60, 92), display: 'flex', alignItems: 'center', gap: 14, opacity: 0.9}}>
    <Mark size={44} color="#fff" />
    <div style={{...BRAND, fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em'}}>Outgrid Labs</div>
  </div>
);
const Progress = ({f}) => (
  <div style={{...abs(0, 0), width: 1080, height: 6, background: 'rgba(255,255,255,0.06)'}}>
    <div style={{height: '100%', width: `${(f / TOTAL) * 100}%`, background: Y, boxShadow: `0 0 16px ${Y}`}} />
  </div>
);
const Captions = ({f}) => {
  const c = CHUNKS.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const op = Math.min(io(f, c.a, c.a + 4), io(f, c.b - 4, c.b, 1, 0));
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1420, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', opacity: op}}>
      {c.words.map((w, i) => {
        const on = f >= w.t, p = io(f, w.t, w.t + 5);
        return (
          <span key={i} style={{fontSize: 64, fontWeight: 600, lineHeight: 1.3, ...LAT, color: !on ? 'rgba(245,245,242,0.28)' : w.hi ? Y : TXT,
            textShadow: on && w.hi ? '0 0 24px rgba(255,197,46,0.45)' : 'none', transform: `translateY(${(1 - p) * 8}px)`}}>{w.w}</span>
        );
      })}
    </div>
  );
};

/* ---------- 1. Hook: diary + Excel ---------- */
const LEAD_ROWS = [['Patil', '99acres', 'Call?'], ['Shinde', 'Facebook', '—'], ['Kulkarni', 'Walk-in', 'Visit?'], ['Deshmukh', '99acres', '??'], ['Joshi', 'Facebook', 'Call?']];
const Diary = () => (
  <div style={{width: 400, height: 520, borderRadius: '18px 30px 30px 18px', position: 'relative',
    background: 'linear-gradient(135deg, #4A3426, #2A1D15)', boxShadow: '0 50px 90px rgba(0,0,0,0.6), inset -10px 0 0 #E9E2D2, inset -12px 0 0 #CFC6B2, inset 2px 2px 0 rgba(255,255,255,0.08)'}}>
    <div style={{...abs(22, 0), width: 4, height: '100%', background: 'rgba(0,0,0,0.35)'}} />
    <div style={{...abs(300, -6), width: 26, height: 532, background: Y, borderRadius: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}} />
    <div style={{...abs(70, 70), fontSize: 34, fontWeight: 600, color: 'rgba(233,226,210,0.55)', letterSpacing: 6}}>2026</div>
    <div style={{...abs(70, 112), fontSize: 26, fontWeight: 500, color: 'rgba(233,226,210,0.35)', letterSpacing: 3}}>CLIENTS</div>
    {/* sticky note */}
    <div style={{...abs(46, 300), width: 230, padding: '22px 22px 16px', background: '#FDE68A', transform: 'rotate(7deg)', boxShadow: '0 16px 30px rgba(0,0,0,0.35)', color: '#3b2f12', fontSize: 30, fontWeight: 600, lineHeight: 1.25}}>
      Patil · 2BHK<br /><span style={{color: '#B91C1C'}}>call back??</span>
    </div>
  </div>
);
const Sheet = () => (
  <div style={{width: 600, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 100px rgba(0,0,0,0.6)'}}>
    <div style={{height: 76, background: '#107C41', display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px'}}>
      <Excel size={44} />
      <div style={{fontSize: 26, fontWeight: 600, color: '#fff', ...LAT}}>Leads_final_v3 (2).xlsx</div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '54px 1.2fr 1.1fr 0.9fr', fontSize: 24, color: '#222', ...LAT}}>
      {['', 'A  Name', 'B  Source', 'C  Status'].map((h, i) => <div key={i} style={{background: '#F3F3F3', padding: '12px 12px 6px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd', color: '#666', fontWeight: 600}}>{h}</div>)}
      {LEAD_ROWS.map((r, k) => [String(k + 2), ...r].map((c, i) => (
        <div key={`${k}${i}`} style={{padding: '12px 12px 6px', borderRight: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', fontWeight: i === 0 ? 600 : 500,
          color: i === 0 ? '#888' : i === 3 && c !== '—' ? '#B91C1C' : '#222', background: i === 0 ? '#F3F3F3' : k === 2 ? '#FEF2F2' : '#fff', whiteSpace: 'nowrap'}}>{c}</div>
      )))}
    </div>
  </div>
);
const Hook = ({F}) => {
  const ex = pop(F, 0.25, 13);
  return (
    <AbsoluteFill>
      <div style={{...abs(72, 215), ...up(F, -0.4)}}>
        <div style={{fontSize: 40, fontWeight: 600, color: MUTED, ...LAT}}>Real Estate Business</div>
      </div>
      <div style={{...abs(66, 290)}}>
        <div style={{fontSize: 136, fontWeight: 700, color: TXT, lineHeight: 1.08, ...LAT, ...up(F, -0.3)}}>अजूनही <span style={{color: '#E9C9A6'}}>डायरी</span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, fontSize: 136, fontWeight: 700, color: TXT, lineHeight: 1.08, ...LAT, ...up(F, 1.4)}}>
          <span>आणि</span>
          <Excel size={128} style={{transform: `scale(${pop(F, 1.6, 10)}) rotate(-6deg)`}} />
          <span style={{color: '#33C481'}}>Excel</span>
        </div>
        <div style={{fontSize: 136, fontWeight: 700, color: TXT, lineHeight: 1.08, ...LAT, ...up(F, 2.4)}}>वर?</div>
      </div>
      {/* visual */}
      <div style={{...abs(90, 900), transform: `rotate(-9deg) translateY(${io(F, 0, s(1), 80, 0)}px)`, opacity: io(F, 0, 10)}}><Diary /></div>
      <div style={{...abs(410, 960), transform: `rotate(5deg) translateY(${(1 - ex) * 120}px)`, opacity: Math.min(1, ex * 2)}}><Sheet /></div>
      <div style={{...abs(560, 870), transform: `scale(${pop(F, 2.9, 10)}) rotate(-3deg)`, transformOrigin: '0% 100%'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: '#1A0F10', border: `1.5px solid ${C_RED}66`, borderRadius: 999, padding: '16px 28px 10px 18px', boxShadow: `0 20px 50px rgba(239,68,68,0.25)`}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C_RED, boxShadow: `0 0 14px ${C_RED}`, marginTop: -6}} />
          <div style={{fontSize: 32, fontWeight: 600, color: '#FCA5A5', ...LAT}}>Follow-up missed</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Leads from every source -> one dashboard ---------- */
const SOURCES = [['99acres', (p) => <Acres99 {...p} />, 200], ['Facebook', (p) => <Facebook {...p} />, 540], ['Walk-in', (p) => <WalkIn {...p} />, 880]];
const LEADS = [
  ['RP', 'Rahul Patil', '2BHK · Baner', 0, ['New', C_BLUE]],
  ['SK', 'Sneha Kulkarni', '3BHK · Wakad', 1, ['Site Visit', Y]],
  ['AS', 'Amit Shinde', 'Plot · Hinjewadi', 2, ['Follow-up', C_ORANGE]],
  ['PD', 'Priya Deshmukh', '2BHK · Kharadi', 0, ['Booked', C_GREEN]],
];
const SrcBadge = ({k, size = 40}) => [<Acres99 key="a" size={size} />, <Facebook key="f" size={size} />, <WalkIn key="w" size={size} />][k];
const Leads = ({F}) => {
  const HUB = [540, 660];
  return (
    <AbsoluteFill>
      {/* connectors */}
      <svg width="1080" height="1920" style={{...abs(0, 0)}}>
        <defs>
          <linearGradient id="lg" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="660"><stop offset="0" stopColor={Y} stopOpacity="0.1" /><stop offset="1" stopColor={Y} stopOpacity="0.9" /></linearGradient>
        </defs>
        {SOURCES.map(([, , x], i) => {
          const d = `M${x} 430 C ${x} 560, ${HUB[0]} 540, ${HUB[0]} ${HUB[1]}`;
          const p = io(F, s(27.2 + i * 0.25), s(27.2 + i * 0.25) + 18);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="url(#lg)" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
              <circle r="7" fill={Y} style={{offsetPath: `path('${d}')`, offsetDistance: `${((F * 2.2 + i * 33) % 100)}%`, opacity: p, filter: `drop-shadow(0 0 8px ${Y})`}} />
            </g>
          );
        })}
      </svg>
      {SOURCES.map(([label, L, x], i) => (
        <div key={i} style={{...abs(x - 80, 250), width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${pop(F, 27.0 + i * 0.2, 13)})`}}>
          {L({size: 130, style: {boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}})}
          <div style={{fontSize: 26, fontWeight: 600, color: MUTED, ...LAT}}>{label}</div>
        </div>
      ))}
      {/* CRM card */}
      <Glass x={70} y={HUB[1]} w={940} h={660} r={40} style={{padding: '34px 36px', ...up(F, 28.6, 18, 60)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>All Leads</div>
          <Chip color={Y} size={22}>{Math.round(io(F, s(29.0), s(30.6), 0, 128, Easing.out(Easing.cubic)))} new</Chip>
          <div style={{flex: 1}} />
          <div style={{display: 'flex', gap: 10}}>{[0, 1, 2].map((k) => <SrcBadge key={k} k={k} size={40} />)}</div>
        </div>
        <div style={{height: 1.5, background: LINE, margin: '26px -36px 6px'}} />
        {LEADS.map(([ini, name, sub, src, [st, col]], i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 0', borderBottom: i < 3 ? `1.5px solid ${LINE}` : 'none', ...up(F, 29.4 + i * 0.22, 12, 24)}}>
            <div style={{position: 'relative', flexShrink: 0}}>
              <div style={{width: 76, height: 76, borderRadius: 38, background: 'linear-gradient(135deg, #2A2A2F, #1A1A1D)', border: `1.5px solid ${LINE}`, color: TXT, fontSize: 28, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box', ...LAT}}>{ini}</div>
              <div style={{...abs(48, 46), borderRadius: 10, boxShadow: `0 0 0 4px #141416`}}><SrcBadge k={src} size={34} /></div>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 32, fontWeight: 600, color: TXT, ...LAT}}>{name}</div>
              <div style={{fontSize: 24, fontWeight: 500, color: MUTED, ...LAT}}>{sub}</div>
            </div>
            <Chip color={col} size={24}>{st}</Chip>
          </div>
        ))}
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 3. Site visit -> automatic WhatsApp ---------- */
const Node = ({F, t, icon, k, title, sub, style = {}}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 22, width: 640, padding: '22px 26px', borderRadius: 30, background: GLASS, border: `1.5px solid ${LINE}`, boxSizing: 'border-box',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: `scale(${pop(F, t, 14)})`, ...style}}>
    {icon}
    <div style={{flex: 1}}>
      <div style={{fontSize: 22, fontWeight: 700, color: MUTED, letterSpacing: '0.12em'}}>{k}</div>
      <div style={{fontSize: 36, fontWeight: 600, color: TXT, ...LAT}}>{title}</div>
    </div>
    {sub}
  </div>
);
const WaSc = ({F}) => {
  const flow = io(F, s(32.6), s(33.2));
  const typing = F >= s(33.1) && F < s(33.7);
  const sent = pop(F, 33.7, 14);
  return (
    <AbsoluteFill>
      <div style={{...abs(220, 240)}}>
        <Node F={F} t={32.05} k="TRIGGER" title="Site Visit Completed"
          icon={<div style={{width: 76, height: 76, borderRadius: 22, background: `${Y}1F`, border: `1.5px solid ${Y}55`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Pin size={42} /></div>}
          sub={<Tick size={44} />} />
      </div>
      <svg width="200" height="130" style={{...abs(440, 368)}}>
        <path d="M100 0V130" stroke={Y} strokeWidth="3" strokeDasharray="1" pathLength="1" strokeDashoffset={1 - flow} />
        <circle cx="100" cy={130 * flow} r="8" fill={Y} opacity={flow > 0 && flow < 1 ? 1 : 0} style={{filter: `drop-shadow(0 0 8px ${Y})`}} />
      </svg>
      <div style={{...abs(514, 404), width: 52, height: 52, borderRadius: 26, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(F, 32.7, 10)})`, boxShadow: `0 0 30px ${Y}88`}}><Bolt size={28} /></div>
      <div style={{...abs(220, 498)}}>
        <Node F={F} t={33.0} k="AUTO ACTION" title="Send WhatsApp" icon={<WhatsApp size={76} />}
          sub={<div style={{fontSize: 24, fontWeight: 600, color: C_GREEN, ...LAT}}>0 sec</div>} />
      </div>
      {/* WhatsApp chat (dark mode) */}
      <div style={{...abs(70, 690), width: 940, height: 580, borderRadius: 40, overflow: 'hidden', background: '#0B141A', border: `1.5px solid ${LINE}`, boxShadow: '0 50px 100px rgba(0,0,0,0.55)', ...up(F, 32.3, 18, 60)}}>
        <div style={{height: 112, background: '#202C33', display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px'}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: 'linear-gradient(135deg, #3B3B40, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TXT, fontSize: 24, fontWeight: 600, paddingTop: 3, boxSizing: 'border-box'}}>RP</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 32, fontWeight: 600, color: '#E9EDEF', ...LAT}}>Rahul Patil</div>
            <div style={{fontSize: 22, color: '#8696A0', ...LAT}}>{typing ? 'typing…' : 'online'}</div>
          </div>
          <WhatsApp size={52} round />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 112, bottom: 0, padding: '28px 30px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1.5px, transparent 1.5px)', backgroundSize: '26px 26px'}}>
          <div style={{alignSelf: 'center', fontSize: 20, fontWeight: 600, color: '#8696A0', background: '#182229', borderRadius: 10, padding: '8px 16px 4px', ...LAT}}>TODAY</div>
          <div style={{maxWidth: 700, background: '#005C4B', borderRadius: '24px 6px 24px 24px', padding: '20px 24px 12px', color: '#E9EDEF', fontSize: 30, lineHeight: 1.38, fontWeight: 500,
            transform: `scale(${sent})`, transformOrigin: '100% 0%', opacity: Math.min(1, sent * 2), ...LAT}}>
            नमस्कार राहुलजी, आज <b>Skyline Residency</b> च्या Site Visit साठी आल्याबद्दल धन्यवाद!
            Brochure आणि Price Sheet पाठवत आहोत.
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, fontSize: 20, color: 'rgba(233,237,239,0.6)', marginTop: 4}}>4:32 PM <DoubleTick /></div>
          </div>
          <div style={{width: 520, background: '#005C4B', borderRadius: 20, padding: 10, transform: `scale(${pop(F, 34.2, 14)})`, transformOrigin: '100% 0%'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(0,0,0,0.18)', borderRadius: 14, padding: '16px 18px 12px'}}>
              <div style={{width: 54, height: 66, borderRadius: 8, background: C_RED, color: '#fff', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box'}}>PDF</div>
              <div><div style={{fontSize: 26, fontWeight: 600, color: '#E9EDEF', ...LAT}}>Skyline_Brochure.pdf</div><div style={{fontSize: 20, color: 'rgba(233,237,239,0.6)'}}>12 pages · 4.2 MB</div></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{...abs(700, 668), transform: `scale(${pop(F, 34.0, 11)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, background: Y, color: BG, borderRadius: 999, padding: '12px 24px 6px 16px', fontSize: 26, fontWeight: 700, boxShadow: `0 12px 40px ${Y}66`, ...LAT}}><Bolt size={26} /> Automatic</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- shared bits for the remaining scenes ---------- */
const Ini = ({t, size = 48, bg = 'linear-gradient(135deg, #2A2A2F, #1A1A1D)', color = TXT}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: bg, border: `1.5px solid ${LINE}`, color, fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.06, boxSizing: 'border-box', ...LAT}}>{t}</div>
);
const CrmIcon = ({size = 64, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 0 1px rgba(0,0,0,0.2)`, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" stroke={BG} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"><path d="M3 11l9-7 9 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></svg>
  </div>
);
const CRM_NAME = 'Skyline CRM';
const Ico = ({d, size = 30, color = MUTED, sw = 2}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I_LOCK = <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>;
const I_BELL = <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>;
const I_CAL = <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>;
const I_PHONE = <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />;
const I_DL = <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 19h14" /></>;
const I_GRID = <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>;
const I_USERS = <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-4 3-6 6-6s6 2 6 6" /><path d="M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.5 3 6" /></>;
const I_PIN = <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>;
const I_CHART = <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>;
const I_KEY = <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l2 2" /></>;
const I_BLDG = <><path d="M4 21V5l8-2v18M12 8l8 2v11M3 21h18" /><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" /></>;

/* ---------- 2. Sources: leads scattered in 3 silos ---------- */
const SILOS = [
  ['99acres', (p) => <Acres99 {...p} />, 200, 4.25, [['RP', 'Rahul Patil', '2BHK · Baner'], ['NS', 'Neha Sawant', '3BHK · Aundh'], ['VJ', 'Vikas Joshi', 'Plot · Wagholi'], ['AK', 'Anita Kale', '2BHK · Baner']]],
  ['Facebook', (p) => <Facebook {...p} />, 540, 5.35, [['SK', 'Sneha K.', 'Lead form'], ['RM', 'Rohan More', 'Lead form'], ['PD', 'Pooja D.', 'Messenger'], ['KT', 'Kiran T.', 'Lead form']]],
  ['Walk-in', (p) => <WalkIn {...p} />, 880, 6.35, [['AS', 'Amit Shinde', 'Register p.12'], ['MG', 'Meera G.', 'Register p.12'], ['SP', 'Suresh P.', 'Visiting card']]],
];
const Sources = ({F}) => {
  const broke = io(F, s(8.5), s(8.9));
  return (
    <AbsoluteFill>
      {SILOS.map(([label, L, x, t, rows], c) => (
        <div key={c}>
          <div style={{...abs(x - 75, 240), width: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${pop(F, t, 13)})`}}>
            {L({size: 120, style: {boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}})}
            <div style={{fontSize: 26, fontWeight: 600, color: MUTED, ...LAT}}>{label}</div>
          </div>
          <div style={{...abs(x - 156, 480), width: 312, display: 'flex', flexDirection: 'column', gap: 18}}>
            {rows.map(([ini, n, sub], i) => {
              const tt = t + 0.35 + i * 0.32;
              const paper = c === 2;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '22px 18px 16px', borderRadius: paper ? 8 : 22,
                  background: paper ? '#EDE6D4' : GLASS, border: paper ? 'none' : `1.5px solid ${LINE}`, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  transform: `rotate(${[-2.5, 2, -1, 3][(i + c) % 4]}deg) translateY(${(1 - pop(F, tt, 13)) * -60}px)`, opacity: io(F, s(tt), s(tt) + 6)}}>
                  {paper ? <Ico d={I_USERS} size={40} color="#6b5d3e" /> : <Ini t={ini} size={50} />}
                  <div style={{minWidth: 0}}>
                    <div style={{fontSize: 25, fontWeight: 600, color: paper ? '#2b2416' : TXT, whiteSpace: 'nowrap', ...LAT, fontFamily: paper ? 'Baloo, Anek, sans-serif' : undefined}}>{n}</div>
                    <div style={{fontSize: 19, fontWeight: 500, color: paper ? '#7a6c4c' : MUTED, whiteSpace: 'nowrap', ...LAT}}>{sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* broken links between silos */}
      {[370, 710].map((x, i) => (
        <div key={i} style={{...abs(x - 34, 286), width: 68, height: 68, borderRadius: 34, background: '#1A0F10', border: `1.5px solid ${C_RED}66`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${pop(F, 8.5 + i * 0.12, 10)})`, boxShadow: `0 0 30px ${C_RED}44`}}>
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke={C_RED} strokeWidth="2.4" strokeLinecap="round"><path d="M9 7l-2.5 2.5a3.5 3.5 0 0 0 5 5M15 17l2.5-2.5a3.5 3.5 0 0 0-5-5M4 4l3 3M20 20l-3-3" /></svg>
        </div>
      ))}
      <div style={{...abs(0, 1190), width: 1080, display: 'flex', justifyContent: 'center', opacity: broke, transform: `translateY(${(1 - broke) * 20}px)`}}>
        <Chip color={C_RED} size={34}>No single view</Chip>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Missed follow-up + forgotten site visit ---------- */
const TL = [
  [12.0, 'SAT', 'Site Visit · Sneha Kulkarni', C_GREEN, true],
  [12.7, 'MON', 'No call', null, false],
  [13.3, 'THU', 'No message', null, false],
  [14.1, 'SAT', 'Lead lost · booked elsewhere', C_RED, true],
];
const Missed = ({F}) => {
  const miss = io(F, s(10.95), s(11.25));
  return (
    <AbsoluteFill>
      <Glass x={90} y={240} w={900} h={170} r={34} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px', transform: `scale(${pop(F, 10.15, 14)})`, opacity: 1 - miss * 0.35}}>
        <CrmIcon size={78} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 22, fontWeight: 600, color: MUTED, letterSpacing: '0.1em'}}>REMINDER · 11:00 AM</div>
          <div style={{fontSize: 36, fontWeight: 600, color: TXT, ...LAT, textDecoration: miss > 0.5 ? `line-through ${C_RED} 3px` : 'none'}}>Follow-up call · Rahul Patil</div>
        </div>
      </Glass>
      <div style={{...abs(760, 214), transform: `scale(${pop(F, 11.0, 10)}) rotate(4deg)`}}><Chip color={C_RED} size={30}>Missed</Chip></div>
      <Glass x={90} y={480} w={900} h={820} r={40} style={{padding: '40px 44px', ...up(F, 11.7, 16, 50)}}>
        <div style={{fontSize: 24, fontWeight: 600, color: MUTED, letterSpacing: '0.12em'}}>AFTER THE SITE VISIT</div>
        <div style={{position: 'relative', marginTop: 40}}>
          <div style={{...abs(31, 30), width: 3, height: 520, background: `linear-gradient(${C_GREEN}, ${LINE} 25%, ${LINE} 75%, ${C_RED})`, opacity: io(F, s(12.0), s(12.6))}} />
          {TL.map(([t, day, txt, col, solid], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, height: 180, ...up(F, t, 12, 20)}}>
              <div style={{width: 64, height: 64, borderRadius: 32, flexShrink: 0, background: solid ? `${col}22` : BG, border: solid ? `2px solid ${col}` : `2px dashed rgba(255,255,255,0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                {solid && col === C_GREEN && <Tick size={36} />}
                {solid && col === C_RED && <svg viewBox="0 0 24 24" width="30" height="30"><path d="M6 6l12 12M18 6L6 18" stroke={C_RED} strokeWidth="3" strokeLinecap="round" /></svg>}
              </div>
              <div>
                <div style={{fontSize: 22, fontWeight: 700, color: MUTED, letterSpacing: '0.12em'}}>{day}</div>
                <div style={{fontSize: solid ? 40 : 36, fontWeight: 600, color: solid ? (col === C_RED ? '#FCA5A5' : TXT) : 'rgba(245,245,242,0.32)', ...LAT, fontStyle: solid ? 'normal' : 'italic'}}>{txt}</div>
              </div>
            </div>
          ))}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 4. Salesperson leaves: lead history goes with them ---------- */
const ROHIT_LEADS = [['RP', 'Rahul Patil', '+91 98220 •••••', 'Site visit done'], ['SK', 'Sneha Kulkarni', '+91 97665 •••••', 'Negotiation'], ['AS', 'Amit Shinde', '+91 90110 •••••', 'Token pending'],
  ['PD', 'Priya Deshmukh', '+91 88880 •••••', 'Loan in process'], ['VJ', 'Vikas Joshi', '+91 70202 •••••', 'Call back Fri']];
const Left = ({F}) => {
  const gone = io(F, s(16.3), s(16.8));
  const lock = pop(F, 19.4, 12);
  return (
    <AbsoluteFill>
      <Glass x={90} y={240} w={900} h={210} r={38} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px', transform: `scale(${pop(F, 15.25, 14)})`}}>
        <div style={{position: 'relative', filter: `grayscale(${gone})`, opacity: 1 - gone * 0.4}}>
          <Ini t="RK" size={120} bg={`linear-gradient(135deg, ${Y}, #E0A800)`} color={BG} />
        </div>
        <div style={{flex: 1, opacity: 1 - gone * 0.4}}>
          <div style={{fontSize: 44, fontWeight: 700, color: TXT, ...LAT}}>Rohit Kale</div>
          <div style={{fontSize: 28, fontWeight: 500, color: MUTED, ...LAT}}>Sales Executive · 3 yrs</div>
        </div>
        <div style={{position: 'relative', width: 230, height: 60}}>
          <div style={{...abs(0, 0), opacity: 1 - gone}}><Chip color={C_GREEN} size={28}>Active</Chip></div>
          <div style={{...abs(0, 0), opacity: gone, transform: `scale(${0.6 + 0.4 * gone})`}}><Chip color={C_RED} size={28}>Left company</Chip></div>
        </div>
      </Glass>
      <Glass x={90} y={510} w={900} h={790} r={40} style={{padding: '34px 40px', overflow: 'hidden', ...up(F, 16.9, 16, 50)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{fontSize: 36, fontWeight: 700, color: TXT, ...LAT}}>Rohit's leads</div>
          <Chip color={Y} size={22}>142</Chip>
          <div style={{flex: 1}} />
          <Ico d={I_PHONE} size={34} />
        </div>
        <div style={{height: 1.5, background: LINE, margin: '24px -40px 4px'}} />
        {ROHIT_LEADS.map(([ini, n, ph, st], i) => {
          const b = io(F, s(18.0 + i * 0.25), s(18.6 + i * 0.25));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: i < 4 ? `1.5px solid ${LINE}` : 'none', filter: `blur(${b * 9}px)`, opacity: 1 - b * 0.5, ...up(F, 17.1 + i * 0.15, 10, 20)}}>
              <Ini t={ini} size={64} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 30, fontWeight: 600, color: TXT, ...LAT}}>{n}</div>
                <div style={{fontSize: 22, color: MUTED, ...LAT}}>{ph}</div>
              </div>
              <div style={{fontSize: 22, fontWeight: 600, color: MUTED, ...LAT}}>{st}</div>
            </div>
          );
        })}
        <div style={{...abs(0, 0), width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: Math.min(1, lock * 1.5)}}>
          <div style={{width: 150, height: 150, borderRadius: 44, background: '#1A0F10', border: `2px solid ${C_RED}77`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lock})`, boxShadow: `0 0 60px ${C_RED}44`}}>
            <Ico d={I_LOCK} size={80} color={C_RED} sw={2.2} />
          </div>
          <div style={{fontSize: 40, fontWeight: 700, color: '#FCA5A5', ...LAT}}>Lead history not found</div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 5. Reveal: customised real estate CRM (product shot) ---------- */
const NAV = [[I_GRID, 'Dashboard'], [I_USERS, 'Leads'], [I_PIN, 'Site Visits'], [I_BELL, 'Follow-ups'], [I_KEY, 'Bookings'], [I_CHART, 'Reports']];
const CrmShot = ({F, t0, active = 0}) => (
  <div style={{width: 900, height: 780, borderRadius: 36, overflow: 'hidden', background: '#111113', border: `1.5px solid ${LINE}`, display: 'flex', boxShadow: '0 60px 140px rgba(0,0,0,0.7)'}}>
    <div style={{width: 250, background: '#0D0D0F', borderRight: `1.5px solid ${LINE}`, padding: '30px 20px', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 34}}><CrmIcon size={46} /><div style={{fontSize: 24, fontWeight: 700, color: TXT, ...LAT}}>{CRM_NAME}</div></div>
      {NAV.map(([d, l], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 14px 10px', borderRadius: 14, marginBottom: 6, background: i === active ? `${Y}1A` : 'transparent',
          color: i === active ? Y : MUTED, fontSize: 22, fontWeight: 600, ...LAT, ...up(F, t0 + 0.2 + i * 0.08, 10, 10)}}>
          <Ico d={d} size={26} color={i === active ? Y : MUTED} />{l}
        </div>
      ))}
    </div>
    <div style={{flex: 1, padding: 30, boxSizing: 'border-box'}}>
      <div style={{fontSize: 30, fontWeight: 700, color: TXT, ...LAT}}>Good morning, Team</div>
      <div style={{display: 'flex', gap: 16, marginTop: 24}}>
        {[['Leads', '1,240', C_BLUE], ['Visits', '318', Y], ['Bookings', '46', C_GREEN]].map(([l, v, c], i) => (
          <div key={i} style={{flex: 1, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${LINE}`, padding: '18px 18px 12px', ...up(F, t0 + 0.4 + i * 0.12, 12, 16)}}>
            <div style={{fontSize: 18, fontWeight: 600, color: MUTED, ...LAT}}>{l}</div>
            <div style={{fontSize: 44, fontWeight: 700, color: c, ...LAT}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop: 20, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${LINE}`, height: 260, padding: 20, boxSizing: 'border-box'}}>
        <div style={{fontSize: 18, fontWeight: 600, color: MUTED, ...LAT}}>Leads this month</div>
        <svg viewBox="0 0 560 180" width="100%" height="190">
          <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={Y} stopOpacity="0.35" /><stop offset="1" stopColor={Y} stopOpacity="0" /></linearGradient></defs>
          <path d="M0 150 C60 140 90 110 140 115 S230 70 280 80 S380 30 430 45 S520 15 560 10 V180 H0Z" fill="url(#ar)" opacity={io(F, s(t0 + 0.8), s(t0 + 1.4))} />
          <path d="M0 150 C60 140 90 110 140 115 S230 70 280 80 S380 30 430 45 S520 15 560 10" fill="none" stroke={Y} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(t0 + 0.6), s(t0 + 1.6))} />
        </svg>
      </div>
      {[['RP', 'Rahul Patil', 'Site Visit', Y], ['SK', 'Sneha Kulkarni', 'Booked', C_GREEN]].map(([a, n, st, c], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, ...up(F, t0 + 1.0 + i * 0.15, 10, 14)}}>
          <Ini t={a} size={46} /><div style={{flex: 1, fontSize: 22, fontWeight: 600, color: TXT, ...LAT}}>{n}</div><Chip color={c} size={18}>{st}</Chip>
        </div>
      ))}
    </div>
  </div>
);
const Reveal = ({F}) => {
  const tilt = io(F, s(21.6), s(26.8), 1, 0, Easing.inOut(Easing.cubic));
  const badge = pop(F, 24.75, 12);
  return (
    <AbsoluteFill>
      <div style={{...abs(140, 520), width: 800, height: 600, borderRadius: '50%', background: `radial-gradient(closest-side, ${Y}33, transparent)`, filter: 'blur(40px)', opacity: io(F, s(22), s(23))}} />
      <div style={{...abs(90, 420), perspective: 1800}}>
        <div style={{transform: `rotateX(${12 + tilt * 14}deg) rotateY(${-10 * tilt}deg) translateY(${(1 - io(F, s(21.6), s(22.4))) * 200}px) scale(${0.96 + 0.04 * (1 - tilt)})`, transformOrigin: '50% 100%', opacity: io(F, s(21.6), s(22.1))}}>
          <CrmShot F={F} t0={21.9} />
        </div>
      </div>
      <div style={{...abs(0, 250), width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${badge})`, opacity: Math.min(1, badge * 1.5)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${Y}55`, borderRadius: 999, padding: '14px 32px 10px 18px', boxShadow: `0 0 50px ${Y}33`}}>
          <Mark size={46} color={Y} />
          <div style={{fontSize: 34, fontWeight: 600, color: TXT, ...LAT}}>Custom-built by <span style={{color: Y}}>Outgrid Labs</span></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 8. Follow-up reminders for the sales team ---------- */
const NOTIFS = [
  [35.95, 'Follow-up call · Rahul Patil', 'Assigned to Rohit · 11:00 AM', 'RK'],
  [36.55, 'Site visit tomorrow · Sneha K.', 'Assigned to Neha · 10:30 AM', 'NJ'],
  [37.15, 'Send price sheet · Amit Shinde', 'Assigned to Sagar · Today', 'SM'],
];
const Reminders = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 250), width: 1080, textAlign: 'center', ...up(F, 35.7, 14, 20)}}>
      <div style={{fontSize: 30, fontWeight: 600, color: MUTED, ...LAT}}>Monday, 16 November</div>
      <div style={{fontSize: 210, fontWeight: 300, color: TXT, lineHeight: 1, letterSpacing: '-0.04em', marginTop: 8}}>10:58</div>
    </div>
    <div style={{...abs(90, 620), width: 900, display: 'flex', flexDirection: 'column', gap: 20}}>
      {NOTIFS.map(([t, a, b, who], i) => {
        const p = pop(F, t, 14);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 28px', borderRadius: 34, background: 'rgba(40,40,44,0.72)', border: `1.5px solid ${LINE}`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.45)', backdropFilter: 'blur(24px)', transform: `translateY(${(1 - p) * -80}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 1.6)}}>
            <CrmIcon size={74} />
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, color: MUTED, ...LAT}}><span>{CRM_NAME.toUpperCase()}</span><span>now</span></div>
              <div style={{fontSize: 32, fontWeight: 700, color: TXT, ...LAT, marginTop: 2}}>{a}</div>
              <div style={{fontSize: 24, fontWeight: 500, color: MUTED, ...LAT}}>{b}</div>
            </div>
            <Ini t={who} size={58} />
          </div>
        );
      })}
    </div>
    <div style={{...abs(486, 1240), transform: `rotate(${Math.sin(F / 2) * 14 * io(F, s(36), s(36.3)) * io(F, s(38), s(38.4), 1, 0)}deg)`, transformOrigin: '50% 10%'}}>
      <div style={{width: 108, height: 108, borderRadius: 54, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${Y}77`}}><Ico d={I_BELL} size={58} color={BG} sw={2.4} /></div>
    </div>
  </AbsoluteFill>
);

/* ---------- 9. Project report: leads -> visits -> bookings ---------- */
const FUNNEL = [[40.55, 'Leads', 1240, null, C_BLUE, 1], [42.0, 'Site Visits', 318, '25.6%', Y, 0.62], [43.3, 'Bookings', 46, '14.5%', C_GREEN, 0.34]];
const Report = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(90, 250), display: 'flex', gap: 14}}>
      {['Skyline Residency', 'Green Valley', 'Riverside'].map((p, i) => (
        <div key={i} style={{fontSize: 26, fontWeight: 600, ...LAT, padding: '14px 24px 10px', borderRadius: 999, whiteSpace: 'nowrap',
          background: i === 0 ? Y : 'rgba(255,255,255,0.05)', color: i === 0 ? BG : MUTED, border: i === 0 ? 'none' : `1.5px solid ${LINE}`, transform: `scale(${pop(F, 39.5 + i * 0.12, 13)})`}}>{p}</div>
      ))}
    </div>
    <Glass x={90} y={360} w={900} h={940} r={40} style={{padding: '40px 44px', ...up(F, 39.0, 16, 50)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Ico d={I_CHART} size={36} color={Y} /><div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>Project Report</div>
        <div style={{flex: 1}} /><div style={{fontSize: 24, fontWeight: 600, color: MUTED, ...LAT}}>Last 90 days</div>
      </div>
      <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        {FUNNEL.map(([t, l, v, pct, c, w], i) => {
          const g = io(F, s(t), s(t) + 18);
          return (
            <div key={i} style={{width: `${w * 100}%`, height: 150, borderRadius: 26, background: `linear-gradient(90deg, ${c}33, ${c}12)`, border: `1.5px solid ${c}55`, boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', opacity: io(F, s(t) - 4, s(t) + 4), transform: `scaleX(${0.6 + 0.4 * g})`}}>
              <div>
                <div style={{fontSize: 24, fontWeight: 600, color: MUTED, ...LAT}}>{l}</div>
                <div style={{fontSize: 66, fontWeight: 700, color: c, lineHeight: 1.05, ...LAT, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * g).toLocaleString('en-IN')}</div>
              </div>
              {pct && <div style={{fontSize: 24, fontWeight: 700, color: c, ...LAT, opacity: g}}>{pct}</div>}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, bottom: 40, display: 'flex', alignItems: 'center', gap: 18, ...up(F, 44.5, 12, 20)}}>
        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, height: 90}}>
          {[0.35, 0.5, 0.42, 0.66, 0.58, 0.8, 0.72, 0.95].map((h, i) => <div key={i} style={{flex: 1, height: `${h * 100 * io(F, s(44.6 + i * 0.05), s(45.1 + i * 0.05))}%`, borderRadius: 6, background: i === 7 ? Y : 'rgba(255,255,255,0.14)'}} />)}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: Y, color: BG, borderRadius: 18, padding: '18px 26px 12px', fontSize: 26, fontWeight: 700, ...LAT, transform: `scale(${pop(F, 45.3, 10)})`}}>
          <Ico d={I_DL} size={30} color={BG} sw={2.6} />Report.pdf
        </div>
      </div>
    </Glass>
  </AbsoluteFill>
);

/* ---------- 10. Not readymade: your pipeline, your fields ---------- */
const STAGES = ['Enquiry', 'Site Visit', 'Negotiation', 'Token', 'Agreement', 'Booking'];
const FIELDS = ['Budget', '2 / 3 BHK', 'Loan status', 'Preferred floor', 'Channel partner'];
const Custom = ({F}) => {
  const x = io(F, s(47.55), s(47.8));
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 240), width: 900, height: 280, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box', borderRadius: 36,
        background: 'rgba(255,255,255,0.03)', border: `1.5px dashed rgba(255,255,255,0.18)`, transform: `scale(${pop(F, 46.8, 14)})`, filter: `grayscale(${x})`, opacity: 1 - x * 0.45}}>
        <svg viewBox="0 0 64 64" width="170" height="170">
          <path d="M8 20 32 8l24 12v26L32 58 8 46z" fill="#2A2A2F" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 20l24 12 24-12M32 32v26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 34l12 6v6l-12-6z" fill="rgba(255,255,255,0.25)" />
        </svg>
        <div>
          <div style={{fontSize: 24, fontWeight: 700, color: MUTED, letterSpacing: '0.14em'}}>READYMADE</div>
          <div style={{fontSize: 48, fontWeight: 700, color: TXT, ...LAT}}>One-size-fits-all</div>
        </div>
      </div>
      <svg width="900" height="280" style={{...abs(90, 240), overflow: 'visible'}}><path d="M40 240 L860 40" stroke={C_RED} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - x} /></svg>
      <Glass x={90} y={590} w={900} h={710} r={40} style={{padding: '38px 42px', ...up(F, 48.4, 16, 50), borderColor: `${Y}44`, boxShadow: `0 40px 80px rgba(0,0,0,0.45), 0 0 80px ${Y}14`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{fontSize: 36, fontWeight: 700, color: TXT, ...LAT}}>Your sales pipeline</div>
          <div style={{flex: 1}} /><Chip color={Y} size={24}>Custom</Chip>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px 12px', marginTop: 34}}>
          {STAGES.map((st, i) => {
            const t = 48.9 + i * 0.42;
            const drag = st === 'Token' ? io(F, s(t), s(t) + 14) : 1;
            return (
              <React.Fragment key={i}>
                <div style={{fontSize: 30, fontWeight: 600, ...LAT, padding: '18px 24px 12px', borderRadius: 18, whiteSpace: 'nowrap',
                  background: i === STAGES.length - 1 ? `${C_GREEN}22` : 'rgba(255,255,255,0.06)', color: i === STAGES.length - 1 ? C_GREEN : TXT,
                  border: `1.5px solid ${st === 'Token' ? Y : i === STAGES.length - 1 ? `${C_GREEN}66` : LINE}`, opacity: io(F, s(t), s(t) + 6),
                  transform: `translate(${(1 - drag) * 120}px, ${(1 - drag) * -90}px) scale(${pop(F, t, 13)})`, boxShadow: st === 'Token' && drag < 1 ? `0 20px 40px rgba(0,0,0,0.5)` : 'none'}}>{st}</div>
                {i < STAGES.length - 1 && <svg viewBox="0 0 24 24" width="28" height="28" style={{opacity: io(F, s(t + 0.2), s(t + 0.4))}}><path d="M5 12h13M13 7l5 5-5 5" fill="none" stroke={MUTED} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{height: 1.5, background: LINE, margin: '40px -42px 30px'}} />
        <div style={{fontSize: 22, fontWeight: 700, color: MUTED, letterSpacing: '0.12em'}}>YOUR FIELDS</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 20}}>
          {FIELDS.map((fl, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 600, color: TXT, ...LAT, padding: '14px 20px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${LINE}`, transform: `scale(${pop(F, 50.9 + i * 0.22, 13)})`}}>
              <span style={{color: Y, fontWeight: 700}}>+</span>{fl}
            </div>
          ))}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* ---------- 11. CTA: comment CRM -> demo ---------- */
const CWORD = 'CRM';
const Cta = ({F}) => {
  const typed = Math.min(CWORD.length, Math.max(0, Math.floor((F - s(55.75)) / 4)));
  const sent = io(F, s(56.4), s(56.7));
  const caret = Math.floor(F / 8) % 2 && sent < 0.5;
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 240), width: 900, display: 'flex', gap: 20}}>
        {[[53.15, I_BLDG, 'Builder'], [54.3, I_KEY, 'Real Estate Agent']].map(([t, d, l], i) => (
          <div key={i} style={{flex: 1, height: 200, borderRadius: 34, background: GLASS, border: `1.5px solid ${LINE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            transform: `scale(${pop(F, t, 13)})`}}>
            <Ico d={d} size={70} color={Y} sw={1.8} />
            <div style={{fontSize: 34, fontWeight: 600, color: TXT, ...LAT}}>{l}</div>
          </div>
        ))}
      </div>
      <Glass x={90} y={500} w={900} h={430} r={40} style={{padding: '34px 38px', ...up(F, 55.3, 16, 40)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <InstagramLogo size={64} />
          <div style={{fontSize: 34, fontWeight: 700, color: TXT, ...LAT}}>Comments</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, opacity: sent, transform: `translateY(${(1 - sent) * 24}px)`}}>
          <Ini t="Y" size={72} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 22, fontWeight: 600, color: MUTED, ...LAT}}>you · now</div>
            <div style={{fontSize: 60, fontWeight: 800, color: Y, letterSpacing: '0.04em', lineHeight: 1.1, textShadow: `0 0 30px ${Y}66`}}>CRM</div>
          </div>
          <svg viewBox="0 0 24 24" width="44" height="44" style={{transform: `scale(${pop(F, 56.9, 8)})`}}><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" fill={C_RED} /></svg>
        </div>
        <div style={{position: 'absolute', left: 38, right: 38, bottom: 34, height: 100, borderRadius: 50, border: `2px solid ${typed && sent < 0.5 ? '#0095F6' : LINE}`, display: 'flex', alignItems: 'center', padding: '6px 20px 0 34px', boxSizing: 'border-box'}}>
          <div style={{flex: 1, fontSize: 50, fontWeight: 800, color: TXT, letterSpacing: '0.04em'}}>
            {sent > 0.5 ? <span style={{fontSize: 28, fontWeight: 500, letterSpacing: 0, color: MUTED}}>Add a comment…</span> : <>{CWORD.slice(0, typed)}<span style={{opacity: caret ? 1 : 0, color: '#0095F6'}}>|</span></>}
          </div>
          <div style={{fontSize: 30, fontWeight: 700, color: '#0095F6', opacity: typed === CWORD.length ? 1 : 0.35}}>Post</div>
        </div>
      </Glass>
      {/* demo arrives in DMs */}
      <div style={{...abs(90, 980), width: 900, transform: `scale(${pop(F, 57.5, 13)})`, transformOrigin: '0% 0%'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 16}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Mark size={38} color={BG} /></div>
          <div style={{width: 640, borderRadius: '30px 30px 30px 8px', background: '#262629', overflow: 'hidden', border: `1.5px solid ${LINE}`}}>
            <div style={{height: 200, position: 'relative', background: 'linear-gradient(135deg, #1b1b1f, #0f0f11)', overflow: 'hidden'}}>
              <div style={{...abs(30, 26), transform: 'scale(0.42)', transformOrigin: '0 0', opacity: 0.55}}><CrmShot F={F} t0={0} /></div>
              <div style={{...abs(270, 50), width: 100, height: 100, borderRadius: 50, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg viewBox="0 0 24 24" width="44" height="44"><path d="M8 5v14l11-7z" fill={BG} /></svg>
              </div>
              <div style={{...abs(520, 152), fontSize: 20, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '6px 10px 2px', ...LAT}}>3:24</div>
            </div>
            <div style={{padding: '18px 24px 14px'}}>
              <div style={{fontSize: 22, fontWeight: 600, color: MUTED, ...LAT}}>outgridlabs</div>
              <div style={{fontSize: 30, fontWeight: 600, color: TXT, ...LAT}}>Your Real Estate CRM demo</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 12. Outro (dark brand) ---------- */
const OUTRO = 59.1;
const OutroD = ({F}) => {
  const m = pop(F, OUTRO + 0.05, 11);
  const w = io(F, s(OUTRO + 0.3), s(OUTRO + 0.7));
  const bar = io(F, s(OUTRO + 0.6), s(OUTRO + 1.0), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <div style={{...abs(240, 300), width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(closest-side, ${Y}40, transparent)`, filter: 'blur(30px)', opacity: m}} />
      <div style={{...abs(540 - 140, 460), transform: `scale(${m}) rotate(${(1 - m) * -90}deg)`, filter: `drop-shadow(0 0 40px ${Y}66)`}}><Mark size={280} color="#fff" /></div>
      <div style={{...abs(0, 820), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...BRAND, fontSize: 128, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', opacity: w, transform: `translateY(${(1 - w) * 40}px)`}}>Outgrid Labs</div>
        <div style={{width: 200 * bar, height: 12, borderRadius: 6, background: Y, marginTop: 30, boxShadow: `0 0 20px ${Y}`}} />
        <div style={{...BRAND, fontSize: 44, fontWeight: 500, color: MUTED, marginTop: 34, ...up(F, OUTRO + 0.9, 12, 20)}}>@outgridlabs</div>
        <div style={{marginTop: 50, ...up(F, OUTRO + 1.2, 12, 20), display: 'flex', alignItems: 'center', gap: 14, background: Y, borderRadius: 999, padding: '18px 40px 12px'}}>
          <div style={{fontSize: 44, fontWeight: 700, color: BG, ...LAT}}>Comment “CRM”</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */
const COMPS = {hook: Hook, sources: Sources, missed: Missed, left: Left, reveal: Reveal, leads: Leads, wa: WaSc, remind: Reminders, report: Report, custom: Custom, cta: Cta, outro: OutroD};
const Video = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: TXT}}>
      <Bg f={f} />
      <Audio src={staticFile('vo.mp3')} />
      {SCENES_T.map(([k, a, b]) => {
        const Comp = COMPS[k];
        return (
          <Sequence key={k} from={s(a)} durationInFrames={s(b) - s(a)}>
            <SceneFade dur={s(b) - s(a)}><Comp F={f} /></SceneFade>
          </Sequence>
        );
      })}
      {f < s(59.1) && <Watermark />}
      <Progress f={f} />
      <Captions f={f} />
    </AbsoluteFill>
  );
};
const SceneFade = ({dur, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: Math.min(io(f, 0, 8), io(f, dur - 6, dur, 1, 0))}}>{children}</AbsoluteFill>;
};
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
