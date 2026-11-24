// Zepto "10-minute delivery" Instagram carousel, 1080x1350 (4:5). One frame per slide: frame 0 = slide 1.
// v3 direction (from the user's focusedmind / yuv.mehta references): type-led editorial.
//  - Cover: the title IS the design: huge, heavy, tight line height, a marker highlight on the key words, an accent dot.
//  - Inner pages: normal-size heading + body, one small line-icon diagram (ink strokes, one yellow accent).
//  - Chrome: brand top-left, tracked caps "SAVE FOR LATER" top-right, hairline footer with topic + "SWIPE →".
// Background = the regular Outgrid light reel background (cream, grid, yellow glow).
// Render: node scripts/stills_fast.mjs reels/zepto-carousel reels/zepto-carousel/stills 2 0 1 ...
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender, Img} from 'remotion';
import {abs, Y, Mark, BRAND} from '../../shared/kit.jsx';
import {THEMES, ThemeCtx, LeanBg} from '../../shared/lean.jsx';

// italic serif for the sub-line (Tiro Devanagari Marathi italic + Instrument Serif italic for Latin)
const fh = delayRender('serif');
Promise.all([
  new FontFace('ZSerif', `url(${staticFile('fonts/mai/tiro-devanagari-marathi-devanagari-400-italic.woff2')})`, {style: 'italic', unicodeRange: 'U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF'}),
  new FontFace('ZSerif', `url(${staticFile('fonts/mai/instrument-serif-latin-400-italic.woff2')})`, {style: 'italic'}),
].map((f) => f.load().then((x) => document.fonts.add(x)))).catch(() => {}).finally(() => continueRender(fh));

const W = 1080, H = 1350, N = 9, PAD = 80;
const INK = '#111111';
const SOFT = 'rgba(17,17,17,0.62)';
const DOT = '#F2A900'; // accent dot: deeper Outgrid yellow so it reads on cream
const HL = 'rgba(255,197,46,0.55)'; // marker highlight
const TRACK = {fontFamily: 'Anek, sans-serif', fontSize: 19, fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase', color: INK};

/* ---------- type helpers ---------- */
// marker highlight behind the lower ~half of the line, like the reference
const Hl = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate'}}>
    <span style={{position: 'absolute', left: '-0.06em', right: '-0.06em', top: '0.37em', height: '0.34em', background: HL, zIndex: -1}} />{children}
  </span>
);
const Dot = () => <span style={{color: DOT}}>.</span>;

/* ---------- chrome ---------- */
const Chrome = ({i, topic}) => (
  <>
    <div style={{...abs(PAD, 78), display: 'flex', alignItems: 'center', gap: 10}}>
      <Mark size={30} color={INK} />
      <div style={{...BRAND, fontSize: 25, fontWeight: 700, color: INK, letterSpacing: '-0.02em'}}>Outgrid Labs<span style={{color: DOT}}>.</span></div>
    </div>
    <div style={{...abs(W - PAD - 400, 86), width: 400, textAlign: 'right', ...TRACK}}>Save for later</div>
    <div style={{...abs(PAD, H - 120), width: W - PAD * 2, height: 1.5, background: 'rgba(17,17,17,0.12)'}} />
    <div style={{...abs(PAD, H - 86), ...TRACK, fontSize: 17, color: SOFT}}>{topic}</div>
    <div style={{...abs(W - PAD - 300, H - 86), width: 300, textAlign: 'right', ...TRACK, fontSize: 17}}>
      {i < N - 1 ? <>Swipe <span style={{color: DOT, letterSpacing: 0}}>→</span></> : `${i + 1} / ${N}`}
    </div>
  </>
);
const Eyebrow = ({children, top}) => <div style={{...abs(PAD, top), ...TRACK, fontSize: 21, color: SOFT}}>{children}</div>;

/* ---------- line icons: ink strokes + one yellow accent ---------- */
const SW = 7;
const Stopwatch = ({size = 170}) => (
  <svg viewBox="0 0 120 120" width={size} height={size} fill="none" stroke={INK} strokeWidth={SW * 0.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 8h20M60 8v12" />
    <circle cx="60" cy="68" r="46" />
    <path d="M60 22 A46 46 0 0 1 99.8 45" stroke={DOT} strokeWidth={SW * 0.9} />
    <path d="M60 68V38" /><path d="M60 68l17 10" />
    <circle cx="60" cy="68" r="3.5" fill={INK} />
  </svg>
);

/* ---------- slide 1: cover ---------- */
const S1 = () => (
  <>
    <Eyebrow top={286}>Case study · Zepto · 10-min delivery</Eyebrow>
    <div style={{...abs(PAD - 6, 372), fontSize: 140, fontWeight: 800, color: INK, lineHeight: 0.98, letterSpacing: '-0.035em'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 34}}>झेप्टो<Img src={staticFile('logos/zepto-app.png')} style={{width: 124, height: 124, marginTop: -14, filter: 'drop-shadow(0 16px 28px rgba(110,30,160,0.28))'}} /></div>
      <div><Hl>१० मिनिटांत</Hl></div>
      <div>डिलिव्हरी</div>
      <div>कशी करतं?</div>
    </div>
    <div style={{...abs(PAD, 990), fontFamily: 'ZSerif, serif', fontStyle: 'italic', fontSize: 50, color: INK, lineHeight: 1.2}}>
      रायडर फास्ट नाही —<br />सिस्टीम स्मार्ट आहे<Dot />
    </div>
    <div style={{...abs(W - PAD - 160, 985)}}><Stopwatch size={150} /></div>
  </>
);

/* ---------- slide 2: location = dark store ---------- */
// distance ruler: you -> stores at 0.8 / 2.4 / 3.1 km, the nearest one picked
const Ruler = ({x, y, w = 920}) => {
  const k = (km) => 40 + (km / 3.4) * (w - 80);
  const Store = ({cx, on}) => (
    <g transform={`translate(${cx - 34} ${-104})`} strokeWidth="4.5">
      <path d="M6 26 L12 4 H56 L62 26" fill={on ? Y : 'none'} />
      <path d="M6 26 V66 H62 V26" fill={on ? '#fff' : 'none'} />
      <path d="M6 26 H62" />
      <path d="M26 66 V46 H42 V66" />
    </g>
  );
  return (
    <svg width={w} height={260} viewBox={`0 -150 ${w} 260`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      <line x1="40" y1="0" x2={w - 40} y2="0" strokeWidth="3" />
      {Array.from({length: 18}, (_, j) => <line key={j} x1={40 + (j * (w - 80)) / 17} y1="-8" x2={40 + (j * (w - 80)) / 17} y2="8" strokeWidth="2" stroke="rgba(17,17,17,0.35)" />)}
      {/* you */}
      <path d="M40 -26 c-14 0 -24 10 -24 23 c0 16 24 33 24 33 s24 -17 24 -33 c0 -13 -10 -23 -24 -23 z" transform="translate(0 -40)" fill={INK} strokeWidth="0" />
      <circle cx="40" cy="-43" r="7" fill="#fff" strokeWidth="0" />
      <Store cx={k(0.8)} on /><Store cx={k(2.4)} /><Store cx={k(3.1)} />
      <path d={`M40 0 H${k(0.8)}`} stroke={DOT} strokeWidth="9" />
      {[0.8, 2.4, 3.1].map((km) => <circle key={km} cx={k(km)} cy="0" r="9" fill={km === 0.8 ? INK : '#fff'} strokeWidth="3" />)}
    </svg>
  );
};
const RulerLabels = ({x, y, w = 920}) => {
  const k = (km) => 40 + (km / 3.4) * (w - 80);
  const L = ({km, on, t}) => (
    <div style={{...abs(x + k(km) - 100, y + 172), width: 200, textAlign: 'center'}}>
      <div style={{fontSize: 34, fontWeight: 700, color: on ? INK : 'rgba(17,17,17,0.4)', letterSpacing: '-0.02em'}}>{km} km</div>
      {t && <div style={{fontSize: 26, fontWeight: 500, color: SOFT, marginTop: 2}}>{t}</div>}
    </div>
  );
  return (
    <>
      <div style={{...abs(x - 40, y + 172), width: 160, textAlign: 'center', fontSize: 26, fontWeight: 600, color: INK}}>तुम्ही</div>
      <L km={0.8} on t="तुमचं स्टोअर" /><L km={2.4} /><L km={3.1} />
    </>
  );
};
const S2 = () => (
  <>
    <Eyebrow top={286}>01 · Location</Eyebrow>
    <div style={{...abs(PAD - 3, 350), fontSize: 92, fontWeight: 800, color: INK, lineHeight: 1.04, letterSpacing: '-0.03em'}}>
      <div>लोकेशन =</div>
      <div><Hl>डार्क स्टोअर</Hl><Dot /></div>
    </div>
    <div style={{...abs(PAD, 580), width: 820, fontSize: 42, fontWeight: 400, color: SOFT, lineHeight: 1.38}}>
      ॲप उघडताच तुमचं <span style={{color: INK, fontWeight: 600}}>सर्वात जवळचं स्टोअर</span> ठरतं.
    </div>
    <Ruler x={PAD} y={820} />
    <RulerLabels x={PAD} y={820} />
  </>
);

/* ---------- inner-page scaffold: eyebrow, heading (normal size), body ---------- */
const Inner = ({eyebrow, lines, body, size = 92}) => (
  <>
    <Eyebrow top={286}>{eyebrow}</Eyebrow>
    <div style={{...abs(PAD - 3, 350), fontSize: size, fontWeight: 800, color: INK, lineHeight: 1.04, letterSpacing: '-0.03em'}}>
      {lines.map((l, k) => <div key={k}>{l}</div>)}
    </div>
    {body && <div style={{...abs(PAD, 350 + lines.length * size * 1.04 + 40), width: 860, fontSize: 42, fontWeight: 400, color: SOFT, lineHeight: 1.38}}>{body}</div>}
  </>
);
const B = ({children}) => <span style={{color: INK, fontWeight: 600}}>{children}</span>;
const Lbl = ({x, y, w = 240, children, size = 28, color = INK, weight = 600, align = 'center'}) => (
  <div style={{...abs(x - (align === 'center' ? w / 2 : 0), y), width: w, textAlign: align, fontSize: size, fontWeight: weight, color, lineHeight: 1.2}}>{children}</div>
);
// full-slide svg layer for line drawings
const Art = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const GREY = 'rgba(17,17,17,0.38)';

/* slide 3: same product, two areas, two stores */
const Carton = ({x, y, s = 1, fill = '#fff'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -22 L-20 -44 H20 L30 -22 V48 H-30 Z" fill={fill} />
    <path d="M-30 -22 H30" /><path d="M-20 -44 V-54 H20 V-44" />
    <path d="M-16 4 H16" strokeWidth="3.5" /><path d="M-16 18 H6" strokeWidth="3.5" />
  </g>
);
const S3 = () => {
  const card = (x, who, ok, store) => (
    <g key={x}>
      <rect x={x} y={770} width={420} height={330} rx={30} fill="#fff" />
      <Carton x={x + 210} y={890} s={1.15} />
      {ok
        ? <rect x={x + 120} y={1010} width={180} height={58} rx={29} fill={Y} />
        : <rect x={x + 90} y={1010} width={240} height={58} rx={29} stroke={GREY} strokeWidth="3" strokeDasharray="2 9" />}
    </g>
  );
  return (
    <>
      <Inner eyebrow="02 · Stock" lines={['वेगळा एरिया,', <Hl>वेगळा स्टॉक</Hl>]}
        body={<>तुम्हाला 'आउट ऑफ स्टॉक', मित्राला उपलब्ध — <B>कारण स्टोअर्स वेगळे!</B></>} />
      <Art>{card(PAD, 'तुम्ही', false)}{card(W - PAD - 420, 'मित्र', true)}</Art>
      <Lbl x={PAD + 30} y={792} align="left" size={28}>तुम्ही</Lbl>
      <Lbl x={W - PAD - 390} y={792} align="left" size={28}>मित्र</Lbl>
      <Lbl x={PAD + 210} y={1026} w={240} size={24} color={GREY}>Out of stock</Lbl>
      <Lbl x={W - PAD - 210} y={1026} w={180} size={26}>Add +</Lbl>
      <Lbl x={PAD + 210} y={1126} w={420} size={26} color={SOFT} weight={500}>स्टोअर A · कोथरूड</Lbl>
      <Lbl x={W - PAD - 210} y={1126} w={420} size={26} color={SOFT} weight={500}>स्टोअर B · बाणेर</Lbl>
    </>
  );
};

/* slide 4: dark store = mini warehouse; orders in, customers out */
const Phone = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}><rect x="-30" y="-50" width="60" height="100" rx="12" fill="#fff" /><path d="M-8 -38 H8" /><circle cx="0" cy="36" r="3" fill={INK} stroke="none" /></g>
);
const Person = ({x, y, c = INK}) => (
  <g transform={`translate(${x} ${y})`} stroke={c}><circle cx="0" cy="-34" r="16" fill="#fff" /><path d="M-30 46 C-30 4 30 4 30 46" fill="#fff" /></g>
);
const S4 = () => {
  const bx = 600, by = 800, bw = 400, bh = 360;
  return (
    <>
      <Inner eyebrow="03 · Dark store" lines={['डार्क स्टोअर', <>म्हणजे काय?</>]}
        body={<>फक्त ऑनलाइन ऑर्डर्ससाठीचं <B>मिनी वेअरहाऊस.</B> ग्राहक आत जाऊ शकत नाहीत.</>} />
      <Art>
        {/* building */}
        <path d={`M${bx - 20} ${by + 90} L${bx + bw / 2} ${by} L${bx + bw + 20} ${by + 90}`} />
        <rect x={bx} y={by + 90} width={bw} height={bh - 90} fill="#fff" />
        <rect x={bx + 110} y={by + 120} width={180} height={44} rx={6} fill={Y} />
        <rect x={bx + 100} y={by + 200} width={200} height={bh - 200} fill="#fff" />
        {Array.from({length: 7}, (_, k) => <path key={k} d={`M${bx + 100} ${by + 220 + k * 20} H${bx + 300}`} strokeWidth="2.5" stroke={GREY} />)}
        {/* online orders: allowed */}
        <Phone x={150} y={880} />
        <path d={`M210 880 H${bx - 40}`} stroke={Y} strokeWidth="8" />
        <path d={`M${bx - 58} 862 L${bx - 36} 880 L${bx - 58} 898`} stroke={INK} />
        {/* customers: blocked */}
        <Person x={150} y={1090} c={GREY} />
        <path d={`M210 1100 H${bx - 70}`} stroke={GREY} strokeDasharray="4 12" />
        <circle cx={bx - 50} cy={1100} r={22} stroke={INK} fill="#fff" /><path d={`M${bx - 65} 1085 L${bx - 35} 1115`} />
      </Art>
      <Lbl x={bx + 200} y={by + 128} w={180} size={20} weight={700}><span style={{letterSpacing: '0.18em'}}>DARK STORE</span></Lbl>
      <Lbl x={400} y={826} w={300} size={28}>ऑनलाइन ऑर्डर्स</Lbl>
      <Lbl x={400} y={1040} w={300} size={28} color={GREY}>ग्राहक — प्रवेश नाही</Lbl>
    </>
  );
};

/* slide 5: floor plan, fast movers next to the packing table */
const S5 = () => {
  const fx = PAD, fy = 770, fw = W - PAD * 2, fh = 330;
  const cols = [0, 1, 2, 3, 4], ox = 250, cw = 96, gap = 34;
  const op = [1, 0.62, 0.32, 0.12, 0];
  return (
    <>
      <Inner eyebrow="04 · Layout" lines={[<Hl>स्मार्ट लेआउट</Hl>]}
        body={<><B>जास्त विकणारा माल पॅकिंग टेबलजवळ,</B> कमी विकणारा आत.</>} />
      <Art>
        <rect x={fx} y={fy} width={fw} height={fh} rx={24} fill="#fff" />
        <rect x={fx + 40} y={fy + 40} width={110} height={fh - 80} rx={12} fill={Y} />
        {cols.map((c) => Array.from({length: 4}, (_, r) => (
          <rect key={`${c}${r}`} x={fx + ox + c * (cw + gap)} y={fy + 40 + r * 66} width={cw} height={50} rx={8}
            fill={op[c] ? `rgba(255,197,46,${op[c]})` : '#fff'} stroke={c < 3 ? INK : GREY} strokeWidth="3.5" />
        )))}
        <path d={`M${fx + 30} ${fy + fh + 50} H${fx + fw - 30}`} strokeWidth="3" />
        <path d={`M${fx + fw - 48} ${fy + fh + 36} L${fx + fw - 30} ${fy + fh + 50} L${fx + fw - 48} ${fy + fh + 64}`} strokeWidth="3" />
      </Art>
      <div style={{...abs(fx + 40, fy + 40), width: 110, height: fh - 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 28, fontWeight: 700, color: INK}}>पॅकिंग टेबल</div>
      </div>
      <Lbl x={fx} y={fy + fh + 70} align="left" w={400} size={28}>जास्त विकणारा</Lbl>
      <Lbl x={fx + fw - 400} y={fy + fh + 70} align="right" w={400} size={28} color={GREY}>कमी विकणारा</Lbl>
    </>
  );
};

/* slide 6: order -> list -> scan -> packet, 76 s */
const I6 = {
  order: <><path d="M-22 -30 H22 V30 L14 24 L6 30 L-2 24 L-10 30 L-22 24 Z" fill="#fff" /><path d="M-12 -14 H12 M-12 0 H12 M-12 12 H2" strokeWidth="3.5" /></>,
  list: <><rect x="-30" y="-24" width="60" height="42" rx="6" fill="#fff" /><path d="M-10 30 H10 M0 18 V30" /><path d="M-18 -12 H-12 M-4 -12 H18 M-18 0 H-12 M-4 0 H18 M-18 9 H-12 M-4 9 H10" strokeWidth="3" /></>,
  scan: <><path d="M-30 -18 V-28 H-20 M20 -28 H30 V-18 M30 18 V28 H20 M-20 28 H-30 V18" /><path d="M-16 -16 V16 M-8 -16 V16 M0 -16 V16 M10 -16 V16 M16 -16 V16" strokeWidth="3" /><path d="M-34 0 H34" stroke={Y} strokeWidth="5" /></>,
  bag: <><path d="M-26 -14 H26 L22 32 H-22 Z" fill={Y} /><path d="M-12 -14 V-22 A12 12 0 0 1 12 -22 V-14" /></>,
};
const S6 = () => {
  const xs = [170, 410, 650, 890], cy = 820;
  const steps = [['order', 'ऑर्डर'], ['list', 'स्क्रीनवर लिस्ट'], ['scan', 'स्कॅन'], ['bag', 'पॅकेट तयार']];
  return (
    <>
      <Inner eyebrow="05 · Packing" lines={['अवघ्या', <><Hl>७६ सेकंदांत</Hl> पॅकिंग!</>]} />
      <Art>
        {xs.slice(0, 3).map((x, k) => <g key={k}><path d={`M${x + 78} ${cy} H${xs[k + 1] - 86}`} strokeWidth="3" /><path d={`M${xs[k + 1] - 96} ${cy - 9} L${xs[k + 1] - 86} ${cy} L${xs[k + 1] - 96} ${cy + 9}`} strokeWidth="3" /></g>)}
        {steps.map(([ic], k) => <g key={ic}><circle cx={xs[k]} cy={cy} r={70} fill="#fff" /><g transform={`translate(${xs[k]} ${cy})`}>{I6[ic]}</g></g>)}
        {/* time bar */}
        <path d={`M${PAD} 1060 H${W - PAD}`} strokeWidth="3" stroke={GREY} />
        <path d={`M${PAD} 1060 H${W - PAD}`} stroke={Y} strokeWidth="12" />
        <path d={`M${PAD} 1044 V1076 M${W - PAD} 1044 V1076`} strokeWidth="3" />
      </Art>
      {steps.map(([, t], k) => <Lbl key={k} x={xs[k]} y={cy + 92} w={230} size={28}>{t}</Lbl>)}
      {steps.map((_, k) => <Lbl key={`n${k}`} x={xs[k]} y={cy - 116} w={100} size={19} color={SOFT}><span style={{letterSpacing: '0.2em'}}>0{k + 1}</span></Lbl>)}
      <Lbl x={PAD} y={1090} align="left" w={200} size={28} color={SOFT} weight={500}>0 s</Lbl>
      <Lbl x={W - PAD - 300} y={1090} align="right" w={300} size={30} weight={700}>76 s</Lbl>
    </>
  );
};

/* slide 7: riders already waiting outside the store */
const Scooter = ({x, y, box = '#fff', c = INK}) => (
  <g transform={`translate(${x} ${y}) scale(1.15)`} stroke={c} strokeWidth="4">
    <circle cx="30" cy="-22" r="22" fill="#fff" /><circle cx="146" cy="-22" r="22" fill="#fff" />
    <path d="M30 -22 H76 L96 -58 H134 L146 -22" fill="#fff" />
    <path d="M146 -22 L124 -96 H106" />
    <rect x="14" y="-118" width="58" height="52" rx="8" fill={box} />
    <circle cx="98" cy="-150" r="15" fill={c === INK ? INK : '#fff'} />
    <path d="M96 -134 L88 -84 L118 -76 L124 -46" fill="none" /><path d="M94 -118 L120 -98" />
  </g>
);
const S7 = () => {
  const gy = 1110;
  return (
    <>
      <Inner eyebrow="06 · Riders" lines={[<><Hl>रायडर</Hl> आधीच तयार!</>]}
        body={<>रायडर शोधण्यात वेळ नाही — ते <B>स्टोअरबाहेरच थांबलेले</B> असतात.</>} />
      <Art>
        <path d={`M${PAD} ${gy} H${W - PAD}`} strokeWidth="3" />
        {/* store */}
        <path d={`M${PAD + 10} 880 L${PAD + 30} 820 H${PAD + 250} L${PAD + 270} 880 Z`} fill={Y} />
        <rect x={PAD + 22} y={880} width={236} height={gy - 880} fill="#fff" />
        <rect x={PAD + 100} y={980} width={80} height={gy - 980} fill="#fff" />
        <Scooter x={372} y={gy} box={Y} />
        <Scooter x={578} y={gy} c={GREY} />
        <Scooter x={784} y={gy} c={GREY} />
      </Art>
      <Lbl x={PAD + 140} y={gy + 22} w={280} size={26} color={SOFT} weight={500}>डार्क स्टोअर</Lbl>
      <Lbl x={470} y={gy + 22} w={260} size={26}>पुढची ऑर्डर →</Lbl>
      <Lbl x={780} y={gy + 22} w={300} size={26} color={GREY} weight={500}>रांगेत तयार</Lbl>
    </>
  );
};

/* slide 8: the four-part secret */
const I8 = {
  pin: <><path d="M0 26 C0 26 -20 8 -20 -6 A20 20 0 0 1 20 -6 C20 8 0 26 0 26 Z" /><circle cx="0" cy="-6" r="7" /></>,
  box: <><path d="M-22 -10 L0 -22 L22 -10 V14 L0 26 L-22 14 Z" /><path d="M-22 -10 L0 2 L22 -10 M0 2 V26" /></>,
  bag: <><path d="M-20 -8 H20 L17 26 H-17 Z" /><path d="M-9 -8 V-14 A9 9 0 0 1 9 -14 V-8" /></>,
  scoot: <><circle cx="-16" cy="16" r="9" /><circle cx="18" cy="16" r="9" /><path d="M-16 16 H2 L10 0 H18 L18 16 M18 16 L12 -16 H4" /></>,
};
const S8 = () => {
  const rows = [['pin', 'अचूक लोकेशन'], ['box', 'जवळचा स्टॉक'], ['bag', 'स्मार्ट पॅकिंग'], ['scoot', 'तयार रायडर']];
  const y0 = 600, rh = 136;
  return (
    <>
      <Inner eyebrow="The secret" lines={['१० मिनिटांचं', <><Hl>गुपित</Hl><Dot /></>]} />
      <Art>
        {rows.map((_, k) => <path key={k} d={`M${PAD} ${y0 + k * rh} H${W - PAD}`} strokeWidth="1.5" stroke="rgba(17,17,17,0.18)" />)}
        <path d={`M${PAD} ${y0 + 4 * rh} H${W - PAD}`} strokeWidth="1.5" stroke="rgba(17,17,17,0.18)" />
        {rows.map(([ic], k) => <g key={ic} transform={`translate(${W - PAD - 40} ${y0 + k * rh + rh / 2}) scale(1.25)`} strokeWidth="3.5">{I8[ic]}</g>)}
      </Art>
      {rows.map(([, t], k) => (
        <div key={k} style={{...abs(PAD, y0 + k * rh + 34), display: 'flex', alignItems: 'baseline', gap: 40}}>
          <div style={{...TRACK, fontSize: 21, color: SOFT, width: 40}}>0{k + 1}</div>
          <div style={{fontSize: 62, fontWeight: 700, color: INK, letterSpacing: '-0.025em'}}>{t}</div>
        </div>
      ))}
    </>
  );
};

/* slide 9: CTA */
const S9 = () => (
  <>
    <Eyebrow top={286}>For your business</Eyebrow>
    <div style={{...abs(PAD - 5, 360), fontSize: 100, fontWeight: 800, color: INK, lineHeight: 1.14, letterSpacing: '-0.035em'}}>
      <div>तुमच्या व्यवसायासाठी</div>
      <div><Hl>अशी सिस्टीम</Hl></div>
      <div>हवी का?</div>
    </div>
    <div style={{...abs(PAD, 760), fontFamily: 'ZSerif, serif', fontStyle: 'italic', fontSize: 50, color: INK}}>मग या नंबरवर WhatsApp करा<Dot /></div>
    <div style={{...abs(PAD, 880), display: 'flex', alignItems: 'center', gap: 28}}>
      <Img src={staticFile('logos/whatsapp.svg')} style={{width: 104, height: 104}} />
      <div style={{fontSize: 104, fontWeight: 800, color: INK, letterSpacing: '-0.02em', marginTop: 10}}>80109 50380</div>
    </div>
    <div style={{...abs(PAD, 1040), width: 640, height: 2, background: INK}} />
    <div style={{...abs(PAD, 1066), fontSize: 30, fontWeight: 500, color: SOFT}}>Outgrid Labs — बिझनेससाठी स्मार्ट सिस्टीम्स</div>
  </>
);

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

const Carousel = () => {
  const f = useCurrentFrame();
  const t = THEMES.light;
  const Slide = SLIDES[Math.min(f, SLIDES.length - 1)];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: INK, ...Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]))}}>
        <LeanBg f={0} />
        <Chrome i={f} topic="Zepto · 10-min delivery" />
        <Slide />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

const Root = () => <Composition id="Reel" component={Carousel} durationInFrames={SLIDES.length} fps={30} width={W} height={H} />;
registerRoot(Root);
