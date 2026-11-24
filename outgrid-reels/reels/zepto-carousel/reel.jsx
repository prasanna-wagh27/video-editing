// Zepto "10-minute delivery" Instagram carousel, 1080x1350 (4:5). One frame per slide: frame 0 = slide 1.
// Outgrid lean style, light theme (same cream + grid + yellow glow background as the regular reels).
// Render: node scripts/stills_fast.mjs reels/zepto-carousel reels/zepto-carousel/out 1 0 1 ...
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame} from 'remotion';
import {abs, Y, Mark, BRAND} from '../../shared/kit.jsx';
import {THEMES, ThemeCtx, LeanBg, TXT, MUTED, LINE, GLASS, C_GREEN, LAT, Ico, WhatsApp} from '../../shared/lean.jsx';

const W = 1080, H = 1350, N = 9;
const INK = '#121212';
const ZP = '#4B1A8C'; // Zepto purple (placeholder wordmark until the official logo file is added)
const ZP_L = '#EFE8FA';
const PAD = 72;

/* ---------- pieces ---------- */
const Mk = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate'}}>
    <span style={{position: 'absolute', left: '-0.08em', right: '-0.08em', top: '0.5em', height: '0.3em', background: Y, borderRadius: '0.06em', zIndex: -1}} />{children}
  </span>
);
const ZeptoWord = ({size = 40, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', background: ZP, color: '#fff', borderRadius: size * 0.36, padding: `${size * 0.2}px ${size * 0.42}px ${size * 0.08}px`,
    fontFamily: 'Anek, sans-serif', fontWeight: 800, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1, ...style}}>zepto</div>
);
const Card = ({x, y, w, h, r = 40, style = {}, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, background: GLASS, border: `1.5px solid ${LINE}`, boxSizing: 'border-box', boxShadow: 'var(--l-shadow)', overflow: 'hidden', ...style}}>{children}</div>
);
const Pill = ({children, bg = '#fff', color = INK, size = 26, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color, fontSize: size, fontWeight: 600, borderRadius: 999,
    padding: `${size * 0.42}px ${size * 0.7}px ${size * 0.26}px`, border: `1.5px solid ${LINE}`, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(60,45,10,0.10)', ...LAT, ...style}}>{children}</div>
);
const I_STORE = <><path d="M4.5 10.5V20h15v-9.5" /><path d="M3 10l2-6h14l2 6" /><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M10 20v-5h4v5" /></>;
const I_HOME = <><path d="M3 11l9-7 9 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></>;
const I_PIN = <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>;
const I_SCOOT = <><circle cx="6" cy="17" r="2.6" /><circle cx="18" cy="17" r="2.6" /><path d="M8.6 17h6.8l2-6h-4" /><path d="M13 7h3l1.4 4" /><path d="M4 13h5l1.5 4" /></>;
const I_SEARCH = <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>;

// map pin with a glyph inside (store / home)
const StorePin = ({x, y, size = 92, color = ZP, glyph = I_STORE, dim = false}) => (
  <div style={{...abs(x - size / 2, y - size / 2), width: size, height: size, borderRadius: size * 0.3, background: dim ? '#fff' : color, border: dim ? `2px solid ${LINE}` : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: dim ? '0 6px 16px rgba(0,0,0,0.06)' : `0 14px 34px ${color}55`, opacity: dim ? 0.85 : 1}}>
    <Ico d={glyph} size={size * 0.56} color={dim ? 'rgba(18,18,18,0.4)' : '#fff'} sw={2.1} />
  </div>
);

/* ---------- chrome ---------- */
const Header = ({i}) => (
  <>
    <div style={{...abs(PAD, 58), display: 'flex', alignItems: 'center', gap: 14}}>
      <Mark size={42} color={INK} />
      <div style={{...BRAND, fontSize: 27, fontWeight: 600, color: INK, letterSpacing: '-0.01em'}}>Outgrid Labs</div>
    </div>
    <div style={{...abs(W - PAD - 160, 64), width: 160, textAlign: 'right', fontSize: 26, fontWeight: 600, color: MUTED, letterSpacing: '0.04em', ...BRAND}}>
      <span style={{color: INK}}>{String(i + 1).padStart(2, '0')}</span> / {String(N).padStart(2, '0')}
    </div>
  </>
);
const Footer = ({i, swipe = true}) => (
  <>
    <div style={{...abs(PAD, H - 92), display: 'flex', gap: 10, alignItems: 'center'}}>
      {Array.from({length: N}, (_, k) => (
        <div key={k} style={{width: k === i ? 44 : 12, height: 12, borderRadius: 6, background: k === i ? Y : 'rgba(18,18,18,0.14)'}} />
      ))}
    </div>
    {swipe && (
      <div style={{...abs(W - PAD - 250, H - 118), width: 250, display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 600, color: INK, ...LAT}}>
          पुढे पाहा
          <div style={{width: 60, height: 60, borderRadius: 30, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -6}}>
            <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={Y} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
        </div>
      </div>
    )}
  </>
);

/* ---------- slide 1: cover ---------- */
const MapCover = () => {
  const cw = 936, ch = 520;
  const roads = [[0, 120, cw, 120], [0, 300, cw, 300], [0, 450, cw, 450], [150, 0, 150, ch], [400, 0, 400, ch], [650, 0, 650, ch], [840, 0, 840, ch]];
  const route = 'M150 450 H400 V300 H650 V120';
  return (
    <>
      <Card x={PAD} y={150} w={cw} h={ch}>
        <svg width={cw} height={ch} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x="430" y="150" width="190" height="120" rx="18" fill="#E4F2E2" />
          <rect x="180" y="330" width="190" height="90" rx="16" fill="#F3EFE6" />
          <rect x="680" y="330" width="130" height="90" rx="16" fill="#F3EFE6" />
          <rect x="180" y="150" width="190" height="120" rx="16" fill="#F3EFE6" />
          {roads.map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} stroke="#EEEAE1" strokeWidth="26" strokeLinecap="round" />)}
          <path d={route} fill="none" stroke={ZP} strokeOpacity="0.16" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
          <path d={route} fill="none" stroke={ZP} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d={route} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* rider on the route */}
        <div style={{...abs(400 - 38, 360 - 38), width: 76, height: 76, borderRadius: 38, background: Y, border: '5px solid #fff', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px rgba(183,127,0,0.35)'}}>
          <Ico d={I_SCOOT} size={40} color={INK} sw={2.2} />
        </div>
        <StorePin x={150} y={450} />
        <div style={{...abs(150 - 48, 450 - 106), width: 0}}><Pill size={22} style={{transform: 'translateX(-30%)'}}>डार्क स्टोअर</Pill></div>
        <StorePin x={650} y={120} color={INK} glyph={I_HOME} size={84} />
        <div style={{...abs(650 + 56, 120 - 24)}}><Pill size={22}>तुमचं घर</Pill></div>
      </Card>
      {/* stopwatch badge, overlapping the card edge */}
      <div style={{...abs(W - PAD - 210 + 24, 150 + ch - 210 + 40), width: 210, height: 210}}>
        <svg width="210" height="210" viewBox="0 0 210 210" style={{position: 'absolute', filter: 'drop-shadow(0 18px 30px rgba(60,45,10,0.18))'}}>
          <rect x="91" y="2" width="28" height="16" rx="6" fill={INK} />
          <circle cx="105" cy="115" r="92" fill="#fff" />
          <circle cx="105" cy="115" r="76" fill="none" stroke="rgba(18,18,18,0.08)" strokeWidth="14" />
          <circle cx="105" cy="115" r="76" fill="none" stroke={Y} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 76 * 0.84} 999`} transform="rotate(-90 105 115)" />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 58, width: 210, textAlign: 'center', fontSize: 80, fontWeight: 700, color: INK, lineHeight: 1, ...LAT}}>10</div>
        <div style={{position: 'absolute', left: 0, top: 134, width: 210, textAlign: 'center', fontSize: 26, fontWeight: 600, color: MUTED}}>मिनिटं</div>
      </div>
    </>
  );
};
const S1 = () => (
  <>
    <MapCover />
    <div style={{...abs(PAD, 724), display: 'flex', alignItems: 'center', gap: 18}}>
      <ZeptoWord size={38} />
      <div style={{fontSize: 30, fontWeight: 600, color: MUTED, ...LAT, marginTop: 4}}>बिझनेस ब्रेकडाऊन</div>
    </div>
    <div style={{...abs(PAD - 4, 800), fontSize: 100, fontWeight: 700, color: TXT, lineHeight: 1.08, ...LAT}}>
      <div>झेप्टो १० मिनिटांत</div>
      <div>डिलिव्हरी कशी करतं?</div>
    </div>
    <div style={{...abs(PAD, 1050), fontSize: 46, fontWeight: 500, color: MUTED, lineHeight: 1.3, ...LAT}}>
      <div>रायडर फास्ट नाही —</div>
      <div style={{color: TXT, fontWeight: 700}}><Mk>सिस्टीम स्मार्ट</Mk> आहे.</div>
    </div>
  </>
);

/* ---------- slide 2: location = dark store ---------- */
const StepHead = ({n, lines, body}) => (
  <>
    <div style={{...abs(PAD, 168), display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 64, height: 64, borderRadius: 18, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 700, color: INK, paddingTop: 6, boxSizing: 'border-box'}}>{n}</div>
      <div style={{fontSize: 28, fontWeight: 600, color: MUTED, letterSpacing: '0.02em', marginTop: 4}}>१० मिनिटांचं गुपित</div>
    </div>
    <div style={{...abs(PAD - 3, 266), fontSize: 86, fontWeight: 700, color: TXT, lineHeight: 1.1, ...LAT}}>{lines}</div>
    <div style={{...abs(PAD, 500), width: 900, fontSize: 42, fontWeight: 500, color: 'rgba(18,18,18,0.68)', lineHeight: 1.35, ...LAT}}>{body}</div>
  </>
);
const Phone = ({x, y, w = 300, h = 560}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: 46, background: INK, padding: 10, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(30,20,0,0.22)'}}>
    <div style={{width: '100%', height: '100%', borderRadius: 37, background: '#fff', overflow: 'hidden', position: 'relative'}}>
      <div style={{background: ZP, padding: '44px 22px 22px', color: '#fff'}}>
        <div style={{fontSize: 17, fontWeight: 500, opacity: 0.75, fontFamily: 'Anek, sans-serif'}}>Delivery in</div>
        <div style={{fontSize: 36, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em'}}>10 minutes</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 18, fontWeight: 600}}>
          <Ico d={I_PIN} size={20} color="#fff" sw={2.4} /> <span style={{marginTop: 3}}>घर · कोथरूड, पुणे</span>
        </div>
      </div>
      <div style={{margin: '16px 16px 0', height: 46, borderRadius: 14, background: '#F3F1EC', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>
        <Ico d={I_SEARCH} size={20} color="rgba(18,18,18,0.4)" sw={2.4} />
        <div style={{height: 9, width: 110, borderRadius: 5, background: 'rgba(18,18,18,0.12)'}} />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '16px 16px'}}>
        {['#FFE7A3', '#DDEBFF', '#E4F2E2', '#FDE1E1', '#EFE8FA', '#FFEBD6', '#E4F2E2', '#FFE7A3', '#DDEBFF'].map((c, k) => (
          <div key={k} style={{height: 74, borderRadius: 14, background: c, display: 'flex', alignItems: 'flex-end', padding: 8, boxSizing: 'border-box'}}>
            <div style={{height: 7, width: '70%', borderRadius: 4, background: 'rgba(18,18,18,0.16)'}} />
          </div>
        ))}
      </div>
      <div style={{...abs(w / 2 - 10 - 40, 14), width: 80, height: 18, borderRadius: 9, background: INK}} />
    </div>
  </div>
);
const NearMap = ({x, y, w, h}) => {
  const ux = 290, uy = 270;
  const stores = [
    {x: 400, y: 170, d: '0.8 km', near: true},
    {x: 90, y: 110, d: '2.4 km'},
    {x: 470, y: 450, d: '3.1 km'},
  ];
  return (
    <Card x={x} y={y} w={w} h={h}>
      <svg width={w} height={h} style={{position: 'absolute'}}>
        {[[0, 90, w, 90], [0, 360, w, 360], [190, 0, 190, h], [520, 0, 520, h]].map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} stroke="#F0ECE3" strokeWidth="22" />)}
        <circle cx={ux} cy={uy} r="185" fill={`${ZP}0D`} stroke={ZP} strokeOpacity="0.35" strokeWidth="2.5" strokeDasharray="8 10" />
        <line x1={ux} y1={uy} x2={stores[0].x} y2={stores[0].y} stroke={ZP} strokeWidth="5" strokeLinecap="round" strokeDasharray="3 12" />
        <circle cx={ux} cy={uy} r="46" fill="#3B82F6" fillOpacity="0.14" />
        <circle cx={ux} cy={uy} r="17" fill="#3B82F6" stroke="#fff" strokeWidth="6" />
      </svg>
      {stores.map((st, k) => (
        <React.Fragment key={k}>
          <StorePin x={st.x} y={st.y} size={st.near ? 84 : 62} dim={!st.near} />
          <div style={{...abs(st.x + (st.near ? 50 : 38), st.y - 18)}}>
            <div style={{fontSize: st.near ? 26 : 22, fontWeight: 700, color: st.near ? ZP : 'rgba(18,18,18,0.38)', ...LAT}}>{st.d}</div>
          </div>
        </React.Fragment>
      ))}
      <div style={{...abs(stores[0].x - 80, stores[0].y - 104)}}><Pill size={22} bg={ZP} color="#fff" style={{border: 'none'}}>
        <svg viewBox="0 0 24 24" width={20} height={20} style={{marginTop: -4}}><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        तुमचं स्टोअर</Pill></div>
      <div style={{...abs(ux - 50, uy + 34)}}><Pill size={20}>तुम्ही</Pill></div>
    </Card>
  );
};
const S2 = () => (
  <>
    <StepHead n="१" lines={<><div>लोकेशन =</div><div><Mk>डार्क स्टोअर</Mk></div></>}
      body="ॲप उघडताच तुमचं सर्वात जवळचं स्टोअर ठरतं." />
    <NearMap x={340} y={656} w={676} h={520} />
    <Phone x={PAD} y={636} w={300} h={560} />
  </>
);

const SLIDES = [S1, S2];

const Carousel = () => {
  const f = useCurrentFrame();
  const t = THEMES.light;
  const Slide = SLIDES[Math.min(f, SLIDES.length - 1)];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: TXT, ...Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]))}}>
        <LeanBg f={0} />
        <Header i={f} />
        <Slide />
        <Footer i={f} swipe={f < N - 1} />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

const Root = () => <Composition id="Reel" component={Carousel} durationInFrames={SLIDES.length} fps={30} width={W} height={H} />;
registerRoot(Root);
