/*
 * Real Estate CRM reel (Marathi + English), 9:16, dark premium style.
 * STYLE TEST: only hook, leads and WhatsApp scenes are designed so far.
 * Logos: public/logos/99acres.svg (app icon), public/logos/excel.svg (Microsoft Excel icon),
 * Facebook + WhatsApp glyphs from simple-icons (CC0). Trademarks of their owners.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark, BRAND, WA_D, buildChunks} from '../../shared/kit.jsx';

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
// [key, fromSec, toSec]: only the designed scenes for now
const SCENES_T = [['hook', 0, 4.0], ['leads', 26.8, 31.85], ['wa', 31.85, 35.7]];

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

/* ---------- main ---------- */
const COMPS = {hook: Hook, leads: Leads, wa: WaSc};
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
      <Watermark />
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
