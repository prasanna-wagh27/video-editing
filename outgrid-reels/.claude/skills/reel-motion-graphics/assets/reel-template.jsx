import React from 'react';
import {
  registerRoot, Composition, AbsoluteFill, Sequence, Audio, Img, useCurrentFrame,
  interpolate, spring, Easing, staticFile, delayRender, continueRender,
} from 'remotion';

/* ---------- fonts ---------- */
const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 120000});
const FONTS = {baloo: ['Baloo', 'fonts/Baloo2.ttf', '400 800'], anek: ['Anek', 'fonts/AnekDevanagari.ttf', '100 800']};
Promise.all(Object.values(FONTS).map(([name, file, weight]) =>
  new FontFace(name, `url(${staticFile(file)})`, {weight}).load().then((ff) => document.fonts.add(ff))))
  .catch(() => {}).finally(() => continueRender(fontHandle));

/* ---------- helpers ---------- */
const FPS = 30;
const s = (t) => Math.round(t * FPS); // seconds -> frames
const Y = '#FFC52E';
const INK = '#121212';
const CREAM = '#FFFFFF';
const GOLD = '#D99A00'; // yellow is too faint as text/stroke on the light bg
const CARD_SHADOW = '0 18px 50px rgba(60,45,10,0.12), 0 2px 0 rgba(0,0,0,0.04)';
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const io = (f, a, b, from = 0, to = 1, easing = OUT) => interpolate(f, [a, b], [from, to], {...C, easing});
const abs = (left, top, extra = {}) => ({position: 'absolute', left, top, ...extra});
const rise = (F, t, d = 14) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, 40, 0)}px)`});
const pop = (F, t, damping = 12) => spring({frame: F - s(t), fps: FPS, config: {damping, mass: 0.7}});

const TOTAL = 1530; // 51 s, VO is 50.56 s
// scene: [from, duration] in frames, cut on VO pauses
const SC = {hook: [0, 138], cities: [138, 252], app: [390, 215], benefits: [605, 235],
  objection: [840, 177], mvp: [1017, 321], cta: [1338, 192]};

/* ---------- VO segments (seconds, from ffmpeg silencedetect) ---------- */
const SEGS = [
  [0.0, 4.3, 'Zomato सारखा App तुमच्या शहरात सुरू करायला, आता करोडो रुपयांची *गरज नाही!*'],
  [4.63, 5.5, 'तुम्ही पाहिलं असेल,'],
  [5.8, 9.53, 'Zomato आणि Swiggy मोठ्या शहरांमध्ये *करोडोंचा* बिझनेस करत आहेत.'],
  [9.83, 12.64, 'पण आपल्या *छोट्या शहरांमध्ये* अजून तसा प्लॅटफॉर्म नाही.'],
  [12.98, 13.58, 'विचार करा...'],
  [13.95, 17.29, 'तुमच्या शहरातील सगळे हॉटेल्स आणि कॅफे *एकाच App* वर आले,'],
  [17.62, 19.92, 'आणि लोकांनी घरबसल्या *Food Order* केलं तर?'],
  [20.34, 21.67, 'Restaurants चा सेल *वाढेल,*'],
  [22.02, 25.04, 'लोकांना *घरपोच* सर्व्हिस मिळेल, आणि सर्वात महत्त्वाचं...'],
  [25.29, 27.73, 'प्रत्येक Order मागे तुमचं *Commission* फिक्स होईल!'],
  [28.11, 32.41, 'आता तुम्हाला वाटेल की यासाठी खूप मोठी IT Team आणि *करोडो रुपये* लागतील.'],
  [32.77, 33.57, 'पण *तसं नाहीये!*'],
  [33.89, 36.27, 'सुरुवातीलाच मोठा खर्च करण्याची *गरज नाही.*'],
  [36.63, 39.84, 'तुम्ही एका छोट्या *MVP* App पासून तुमची सुरुवात करू शकता.'],
  [40.22, 41.17, '*मार्केट टेस्ट* करा,'],
  [41.43, 44.39, 'आणि जसा बिझनेस वाढेल, तसा प्लॅटफॉर्म *मोठा* करा.'],
  [44.76, 46.34, 'तुमच्या शहराचं नाव *Comment* करा.'],
  [46.71, 50.4, 'आणि तुम्हाला अशा प्रकारचा App बनवायचा असेल तर आम्हाला *DM* करा.'],
];

// ponytail: word times spread by character length inside each pause-bounded segment; swap for Whisper word timestamps if sync drifts
const CHUNKS = [];
SEGS.forEach(([a, b, txt]) => {
  let inHi = false;
  const ws = txt.split(' ').map((raw) => {
    if (raw.startsWith('*')) inHi = true;
    const hi = inHi;
    if (raw.replace(/[.,!?…]+$/, '').endsWith('*')) inHi = false;
    const w = raw.replace(/\*/g, '');
    return {w, hi, n: w.length + 2};
  });
  const tot = ws.reduce((x, o) => x + o.n, 0);
  let acc = 0;
  ws.forEach((o) => { o.t = s(a + ((b - a) * acc) / tot); acc += o.n; });
  const n = Math.ceil(ws.length / 4), size = Math.ceil(ws.length / n);
  for (let i = 0; i < ws.length; i += size) {
    const words = ws.slice(i, i + size);
    const next = ws[i + size];
    CHUNKS.push({a: words[0].t, b: next ? next.t : s(b) + 6, words});
  }
});

/* ---------- icons ---------- */
const Scooter = ({size = 120, color = '#fff'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15" cy="46" r="7" /><circle cx="49" cy="46" r="7" />
    <path d="M22 46h15l7-20h7" /><path d="M37 46 31 32H12" />
    <rect x="7" y="14" width="20" height="15" rx="3" fill={color} stroke="none" />
  </svg>
);
const Pin = ({w = 60, color = Y, hole = INK, children}) => (
  <svg viewBox="0 0 48 64" width={w} height={(w * 64) / 48}>
    <path d="M24 2C12 2 3 11 3 23c0 16 21 39 21 39s21-23 21-39C45 11 36 2 24 2z" fill={color} stroke={INK} strokeWidth="2.5" />
    {children || <circle cx="24" cy="23" r="8" fill={hole} />}
  </svg>
);
const Bars = ({size = 70, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill={color}>
    <rect x="6" y="38" width="13" height="20" rx="3" /><rect x="25" y="24" width="13" height="34" rx="3" /><rect x="44" y="8" width="13" height="50" rx="3" />
  </svg>
);
const Flask = ({size = 70, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
    <path d="M24 6h16M27 6v18L10 54a3 3 0 0 0 3 4h38a3 3 0 0 0 3-4L37 24V6" />
    <path d="M18 42h28" />
  </svg>
);
const Chat = ({size = 110}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M32 6C17 6 6 15 6 28c0 7 3 12 8 16l-3 12 13-7c2 .5 5 1 8 1 15 0 26-9 26-22S47 6 32 6z" fill={INK} />
    <rect x="19" y="22" width="26" height="5" rx="2.5" fill={Y} /><rect x="19" y="32" width="18" height="5" rx="2.5" fill={Y} />
  </svg>
);
const Send = ({size = 90}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 30 58 6 44 58 32 36z" fill={Y} /><path d="M32 36 58 6" stroke={INK} strokeWidth="4" />
  </svg>
);
const Person = ({size = 60, color = INK, style = {}}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 48 62" style={style}>
    <circle cx="24" cy="14" r="12" fill={color} /><path d="M3 62 Q3 30 24 30 Q45 30 45 62 Z" fill={color} />
  </svg>
);
const Sparks = ({x, y, rot = 0, o = 1}) => (
  <svg width="120" height="120" viewBox="0 0 120 120" style={{...abs(x, y), opacity: o, transform: `rotate(${rot}deg)`}}>
    <g stroke={GOLD} strokeWidth="9" strokeLinecap="round"><line x1="20" y1="70" x2="10" y2="30" /><line x1="45" y1="60" x2="70" y2="22" /><line x1="58" y1="88" x2="100" y2="72" /></g>
  </svg>
);

/* ---------- shared text ---------- */
const H = ({children, size = 88, color = INK, style = {}}) => (
  <div style={{fontSize: size, fontWeight: 600, color, lineHeight: 1.2, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Hi = ({children, rot = -2}) => (
  <span style={{background: Y, color: INK, padding: '0.04em 0.24em 0', borderRadius: 16, display: 'inline-block', transform: `rotate(${rot}deg)`}}>{children}</span>
);
const Center = ({top, children, style = {}}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

/* ---------- background + HUD ---------- */
const Bg = () => (
  <AbsoluteFill style={{background: '#F7F3EA'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.04) 2px, transparent 2px)', backgroundSize: '72px 72px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 0% 100%, rgba(255,197,46,0.30), transparent 45%), radial-gradient(circle at 100% 0%, rgba(255,197,46,0.22), transparent 40%)'}} />
  </AbsoluteFill>
);

const Dashes = ({f}) => {
  const list = Object.values(SC);
  return (
    <div style={{...abs(1080 - 80 - list.length * 66 + 10, 112), display: 'flex', gap: 10}}>
      {list.map(([from, dur], i) => (
        <div key={i} style={{width: 56, height: 10, borderRadius: 5, background: '#DDD4C2', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${io(f, from, from + dur, 0, 100, Easing.linear)}%`, background: GOLD}} />
        </div>
      ))}
    </div>
  );
};

/* ---------- karaoke captions ---------- */
const Captions = ({f}) => {
  const c = CHUNKS.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const op = Math.min(io(f, c.a, c.a + 4), io(f, c.b - 4, c.b, 1, 0));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1430, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 20px', opacity: op}}>
      {c.words.reduce((runs, w) => {
        // consecutive highlight words share one yellow pill
        const last = runs[runs.length - 1];
        if (w.hi && last && last[0].hi) last.push(w); else runs.push([w]);
        return runs;
      }, []).map((run, r) => (
        <span key={r} style={{display: 'flex', gap: 20, borderRadius: 14, padding: run[0].hi ? '0 14px' : 0,
          background: run[0].hi && f >= run[0].t ? Y : 'transparent'}}>
          {run.map((w, i) => {
            const p = io(f, w.t, w.t + 5);
            return (
              <span key={i} style={{fontSize: 70, fontWeight: 600, lineHeight: 1.25, color: f >= w.t ? INK : 'rgba(18,18,18,0.28)',
                transform: `translateY(${(1 - p) * 8}px) scale(${1 + 0.06 * Math.sin(Math.PI * p)})`}}>{w.w}</span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

/* ---------- scene wrapper ---------- */
const SceneWrap = ({dur, first, last, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(first ? 1 : io(f, 0, 8), last ? 1 : io(f, dur - 8, dur, 1, 0));
  return <AbsoluteFill style={{opacity: o, transform: `scale(${first ? 1 : io(f, 0, 12, 1.04, 1)})`}}>{children}</AbsoluteFill>;
};

const Tile = ({x, y, size, logo, rot, p, bob = 0}) => (
  <div style={{...abs(x, y), width: size, height: size, borderRadius: size * 0.22, overflow: 'hidden',
    boxShadow: `0 ${size * 0.05}px 0 rgba(0,0,0,0.18), 0 30px 60px rgba(0,0,0,0.22)`,
    transform: `translateY(${bob}px) rotate(${rot}deg) scale(${p})`}}>
    <Img src={staticFile(logo)} style={{width: '100%', height: '100%', display: 'block'}} />
  </div>
);
const ZOMATO = 'logos/zomato.png';
const SWIGGY = 'logos/swiggy_icon.png';

/* ---------- 1. Hook ---------- */
const Hook = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Tile x={170} y={300} size={300} logo={ZOMATO} rot={-8} p={pop(F, 0.1)} bob={Math.sin(F / 14) * 8} />
      <Tile x={560} y={350} size={280} logo={SWIGGY} rot={8} p={pop(F, 0.35)} bob={Math.sin(F / 14 + 1.5) * 8} />
      <Sparks x={820} y={220} o={io(F, s(0.7), s(0.9))} />
      <Center top={720}>
        <H style={rise(F, 0.4)}>Zomato सारखा App</H>
        <H style={{...rise(F, 1.2), marginTop: 10}}><Hi>तुमच्या शहरात?</Hi></H>
      </Center>
      <div style={{...abs(110, 1060), width: 860, padding: '36px 50px 30px', boxSizing: 'border-box', borderRadius: 40, background: CREAM,
        boxShadow: CARD_SHADOW, transform: `rotate(-3deg) scale(${pop(F, 2.4)})`}}>
        <H size={64} color={INK}>आता करोडो रुपयांची</H>
        <H size={96} color={INK} style={{marginTop: 6}}><Hi rot={-1}>गरज नाही!</Hi></H>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Big city vs small town ---------- */
const BUILDINGS = [[40, 110, 170], [160, 90, 230], [260, 130, 150], [400, 80, 260], [490, 120, 190], [620, 100, 240], [730, 140, 160], [880, 90, 210], [980, 90, 140]];
const Skyline = () => (
  <>
    {BUILDINGS.map(([x, w, h], k) => {
      const wins = [];
      for (let r = 0; r < Math.floor(h / 40); r++) for (let c = 0; c < Math.floor(w / 30); c++) {
        if ((r * 7 + c * 13 + k * 5) % 4 === 0) wins.push(<div key={`${r}-${c}`} style={{...abs(12 + c * 30, 16 + r * 40), width: 12, height: 18, background: '#ffcf5a', opacity: 0.8}} />);
      }
      return <div key={k} style={{...abs(x, 690 - h), width: w, height: h, background: '#1b1b1b', borderTop: '2px solid #2a2a2a'}}>{wins}</div>;
    })}
    <div style={{...abs(0, 690), width: 1080, height: 3, background: '#3a3a3a'}} />
  </>
);
const Shop = ({x, y, label, p}) => (
  <div style={{...abs(x, y), width: 250, transform: `scale(${p})`, transformOrigin: '50% 100%'}}>
    <div style={{margin: '0 auto', width: 190, height: 60, borderRadius: 12, background: '#1f1f1f', border: '3px solid #444', color: '#fff',
      fontSize: 36, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box'}}>{label}</div>
    <div style={{height: 46, marginTop: 10, borderRadius: '12px 12px 4px 4px', background: `repeating-linear-gradient(90deg, ${Y} 0 31px, #fff3d6 31px 62px)`}} />
    <div style={{height: 120, margin: '0 14px', background: '#2a2a2a', display: 'flex', gap: 14, padding: 16, boxSizing: 'border-box'}}>
      <div style={{flex: 1, background: '#ffb627', borderRadius: 4, boxShadow: '0 0 30px rgba(255,182,39,0.6)'}} />
      <div style={{width: 60, background: '#141414', borderRadius: 4}} />
    </div>
  </div>
);
const Cities = ({from}) => {
  const F = useCurrentFrame() + from;
  const dim = io(F, s(9.8), s(10.3), 1, 0.35);
  const pin = pop(F, 12.0, 9);
  return (
    <AbsoluteFill>
      <div style={{opacity: dim}}>
        <Center top={210}>
          <H size={80} color="#6b665c" style={rise(F, 4.7)}>मोठ्या शहरात</H>
          <H size={80} color="#6b665c" style={rise(F, 5.9)}>प्लॅटफॉर्म आहेत...</H>
        </Center>
        <Skyline />
        {[[300, ZOMATO, 6.2], [650, SWIGGY, 6.6]].map(([x, logo, t], i) => (
          <div key={i} style={{...abs(x, 440), width: 140, height: 250, transform: `scale(${pop(F, t)})`, transformOrigin: '50% 100%'}}>
            <div style={{...abs(68, 120), width: 5, height: 130, background: '#555'}} />
            <Tile x={0} y={0} size={140} logo={logo} rot={i ? 6 : -6} p={1} bob={Math.sin(F / 12 + i) * 5} />
          </div>
        ))}
      </div>
      <Center top={730}>
        <H size={70} style={rise(F, 9.9)}>पण आपल्या</H>
        <H size={80} style={{...rise(F, 10.4), margin: '6px 0'}}><Hi>छोट्या शहरांमध्ये</Hi></H>
        <H size={70} style={rise(F, 11.2)}>अजून प्लॅटफॉर्म नाही!</H>
      </Center>
      <div style={{...abs(0, 1060), width: 1080, height: 140, overflow: 'hidden', clipPath: `inset(0 ${(1 - io(F, s(11.6), s(12.3))) * 100}% 0 0)`}}>
        <svg width="1080" height="140"><path d="M250 125 Q540 25 830 125" fill="none" stroke={GOLD} strokeWidth="5" strokeDasharray="16 14" strokeDashoffset={-F} /></svg>
      </div>
      <div style={{...abs(540 - 32, 1050), transform: `translateY(${(1 - pin) * -80}px) scale(${pin})`, opacity: Math.min(1, pin * 2)}}>
        <Pin w={64}><text x="24" y="31" textAnchor="middle" fontSize="24" fontWeight="800" fill={INK} fontFamily="Baloo">?</text></Pin>
      </div>
      {['हॉटेल', 'कॅफे', 'रेस्टॉरंट'].map((l, i) => <Shop key={l} x={125 + i * 290} y={1170} label={l} p={pop(F, 10.8 + i * 0.3)} />)}
    </AbsoluteFill>
  );
};

/* ---------- 3. One app ---------- */
const CATS = [['🍛', 'Biryani'], ['🍕', 'Pizza'], ['🍔', 'Burger'], ['☕', 'Cafe']];
const SHOPS = [['🍛', 'Spice Kitchen', '4.5', '20–30 min'], ['🍔', 'Cafe Corner', '4.4', '15–25 min']];
const AppScene = ({from}) => {
  const F = useCurrentFrame() + from;
  const phone = pop(F, 13.3, 14);
  const tap = io(F, s(18.3), s(18.9));
  const toast = pop(F, 18.8, 13);
  return (
    <AbsoluteFill>
      <Center top={210}>
        <H size={84} style={rise(F, 13.0)}>एक App,</H>
        <H size={84} style={{...rise(F, 14.0), marginTop: 8}}>सर्व <Hi>Restaurants</Hi> साठी.</H>
      </Center>
      <div style={{...abs(300, 490), width: 480, height: 860, borderRadius: 72, background: '#1d1d1d', border: '4px solid #3a3a3a', padding: 14, boxSizing: 'border-box',
        boxShadow: '0 50px 100px rgba(0,0,0,0.25)', transform: `translateY(${(1 - phone) * 800}px) rotate(-3deg)`}}>
        <div style={{width: '100%', height: '100%', borderRadius: 58, background: '#fbfaf6', overflow: 'hidden', position: 'relative', padding: '58px 26px 0', boxSizing: 'border-box', color: INK}}>
          <div style={{...abs(176, 18), width: 96, height: 24, borderRadius: 12, background: '#1d1d1d'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 30, fontWeight: 800}}>
            <Pin w={24} color={INK} hole="#fbfaf6" /> Your City ▾
            <div style={{marginLeft: 'auto', width: 40, height: 40, borderRadius: 20, border: '3px solid #222'}} />
          </div>
          <div style={{marginTop: 20, height: 58, borderRadius: 29, background: '#fff', border: '2px solid #e6e2d8', display: 'flex', alignItems: 'center', padding: '4px 22px 0', fontSize: 24, color: '#9a978f'}}>Search for food...</div>
          <div style={{display: 'flex', gap: 12, marginTop: 24}}>
            {CATS.map(([e, l], i) => (
              <div key={l} style={{flex: 1, height: 104, borderRadius: 20, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${pop(F, 14.9 + i * 0.25)})`}}>
                <div style={{fontSize: 44, lineHeight: 1}}>{e}</div>
                <div style={{fontSize: 18, fontWeight: 700, marginTop: 6}}>{l}</div>
              </div>
            ))}
          </div>
          {SHOPS.map(([e, name, r, time], i) => (
            <div key={name} style={{marginTop: 22, height: 168, borderRadius: 24, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 18, padding: 18, boxSizing: 'border-box',
              ...rise(F, 15.9 + i * 0.5)}}>
              <div style={{width: 128, height: 128, borderRadius: 18, background: i ? '#ffe9c2' : '#ffd8a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 74}}>{e}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 28, fontWeight: 800}}>{name}</div>
                <div style={{fontSize: 20, fontWeight: 600, color: '#777'}}><span style={{color: '#f0a500'}}>★</span> {r} · {time}</div>
                <div style={{marginTop: 8, display: 'inline-block', padding: '6px 20px 2px', borderRadius: 16, fontSize: 20, fontWeight: 800,
                  background: i === 0 && tap > 0.5 ? INK : Y, color: i === 0 && tap > 0.5 ? Y : INK,
                  transform: `scale(${i === 0 ? 1 - 0.12 * Math.sin(Math.PI * tap) : 1})`}}>{i === 0 && tap > 0.5 ? 'Ordered ✓' : 'Order'}</div>
              </div>
            </div>
          ))}
          <div style={{...abs(0, 742), width: '100%', height: 90, borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 18, fontWeight: 700, color: '#666'}}>
            <span style={{background: Y, color: INK, padding: '6px 14px 2px', borderRadius: 12}}>Home</span><span>Orders</span><span>Account</span>
          </div>
          <div style={{...abs(26, 62), width: 400, height: 80, borderRadius: 22, background: INK, color: '#fff', display: 'flex', alignItems: 'center', gap: 14, padding: '4px 22px 0', boxSizing: 'border-box',
            fontSize: 28, fontWeight: 800, transform: `translateY(${(1 - toast) * -160}px)`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
            <span style={{color: Y}}>✓</span> Order Placed! <span style={{marginLeft: 'auto', fontSize: 34}}>🛵</span>
          </div>
        </div>
      </div>
      <div style={{...abs(410, 935), width: 90, height: 90, borderRadius: 45, border: `6px solid ${Y}`, opacity: tap > 0 && tap < 1 ? 1 - tap : 0, transform: `scale(${0.4 + tap})`}} />
    </AbsoluteFill>
  );
};

/* ---------- 4. Benefits ---------- */
const Coin = ({y, p}) => (
  <svg width="170" height="70" viewBox="0 0 170 70" style={{...abs(0, y), transform: `translateY(${(1 - p) * -260}px)`, opacity: Math.min(1, p * 3)}}>
    <ellipse cx="85" cy="44" rx="80" ry="24" fill="#c98a00" /><rect x="5" y="26" width="160" height="18" fill="#c98a00" />
    <ellipse cx="85" cy="26" rx="80" ry="24" fill={Y} /><ellipse cx="85" cy="26" rx="52" ry="14" fill="none" stroke="#c98a00" strokeWidth="4" />
  </svg>
);
const Benefit = ({y, p, icon, l1, l2, dim}) => (
  <div style={{...abs(80, y), width: 920, height: 190, borderRadius: 36, background: CREAM, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box', boxShadow: CARD_SHADOW,
    opacity: Math.min(p, dim), transform: `translateX(${(1 - p) * -120}px)`}}>
    <div style={{width: 122, height: 122, borderRadius: 28, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
    <div>
      <H size={46} color="#555">{l1}</H>
      <H size={66} color={INK}>{l2}</H>
    </div>
  </div>
);
const Benefits = ({from}) => {
  const F = useCurrentFrame() + from;
  const dim = io(F, s(24.0), s(24.6), 1, 0.4);
  const big = pop(F, 25.3, 13);
  return (
    <AbsoluteFill>
      <Benefit y={290} p={io(F, s(20.3), s(20.8))} dim={dim} icon={<Bars size={74} />} l1="Restaurants चा" l2="सेल वाढेल ↑" />
      <Benefit y={510} p={io(F, s(22.0), s(22.5))} dim={dim} icon={<Scooter size={84} color={INK} />} l1="लोकांना" l2="घरपोच सर्व्हिस" />
      <div style={{...abs(80, 740), ...rise(F, 24.0)}}><H size={44} color={GOLD}>आणि सर्वात महत्त्वाचं...</H></div>
      <div style={{...abs(80, 820), width: 920, height: 420, borderRadius: 40, border: `5px solid ${Y}`, background: 'rgba(255,197,46,0.16)', boxSizing: 'border-box',
        transform: `scale(${big})`, boxShadow: '0 0 80px rgba(255,197,46,0.15)'}}>
        <div style={{...abs(50, 90), width: 170, height: 260}}>
          {[0, 1, 2, 3, 4].map((i) => <Coin key={i} y={190 - i * 34} p={io(F, s(25.7 + i * 0.25), s(25.7 + i * 0.25) + 8, 0, 1, Easing.in(Easing.quad))} />)}
        </div>
        {[0, 1, 2].map((i) => {
          const t = (F - s(26.6) - i * 14) % 42;
          return F > s(26.6) + i * 14 && <div key={i} style={{...abs(70 + i * 50, 110 - t * 2), fontSize: 40, fontWeight: 800, color: GOLD, opacity: 1 - t / 42}}>+₹</div>;
        })}
        <div style={{...abs(270, 70)}}>
          <H size={56}>प्रत्येक Order वर</H>
          <H size={76} style={{margin: '8px 0'}}>तुमचं <Hi>Commission</Hi></H>
          <H size={76}>फिक्स!</H>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Objection ---------- */
const Objection = ({from}) => {
  const F = useCurrentFrame() + from;
  const no = io(F, s(32.75), s(33.05));
  const stamp = pop(F, 32.8, 9);
  const Strike = () => <div style={{...abs(30, 140), width: 860, height: 14, borderRadius: 7, background: '#ff4d4d', transform: `rotate(-8deg) scaleX(${no})`, transformOrigin: 'left'}} />;
  const card = (top, t) => ({...abs(80, top), width: 920, height: 300, borderRadius: 40, background: CREAM, boxSizing: 'border-box', padding: '34px 50px', boxShadow: CARD_SHADOW,
    opacity: io(F, s(t), s(t) + 10) * (1 - 0.45 * no), transform: `translateY(${io(F, s(t), s(t) + 10, 60, 0)}px)`, filter: `grayscale(${no})`});
  return (
    <AbsoluteFill>
      <Center top={230}><H size={72} color="#6b665c" style={rise(F, 28.1)}>तुम्हाला वाटेल...</H></Center>
      <div style={card(380, 29.7)}>
        <H size={66} color={INK}>मोठी IT Team?</H>
        <div style={{display: 'flex', gap: 14, marginTop: 20}}>
          {Array.from({length: 10}).map((_, i) => <Person key={i} size={60} style={{transform: `scale(${pop(F, 30.2 + i * 0.07)})`}} />)}
        </div>
        <Strike />
      </div>
      <div style={card(720, 31.0)}>
        <H size={66} color={INK}>करोडो रुपये?</H>
        <div style={{display: 'flex', gap: 14, marginTop: 24}}>
          {Array.from({length: 7}).map((_, i) => (
            <div key={i} style={{width: 100, height: 64, borderRadius: 10, background: '#cfe3b4', border: '3px solid #6d8b4a', color: '#3b5222', fontSize: 34, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box', transform: `scale(${pop(F, 31.4 + i * 0.1)})`}}>₹</div>
          ))}
        </div>
        <Strike />
      </div>
      <div style={{...abs(170, 1060), width: 740, height: 200, borderRadius: 34, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(-6deg) scale(${stamp * 1})`, opacity: Math.min(1, stamp * 2), boxShadow: '0 30px 80px rgba(0,0,0,0.25)'}}>
        <H size={112} color={INK} style={{paddingTop: 14}}>तसं नाहीये!</H>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. MVP ---------- */
const Step = ({x, t, F, icon, l1, l2, gold}) => (
  <div style={{...abs(x, 520), width: 280, height: 300, borderRadius: 34, background: gold ? Y : CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    transform: `scale(${pop(F, t)})`, boxShadow: gold ? '0 0 60px rgba(255,197,46,0.35)' : CARD_SHADOW}}>
    {icon}
    <H size={50} color={INK} style={{marginTop: 18, lineHeight: 1.05}}>{l1}</H>
    <H size={50} color={INK} style={{lineHeight: 1.05}}>{l2}</H>
  </div>
);
const GROW = [70, 120, 190, 270, 370];
const Mvp = ({from}) => {
  const F = useCurrentFrame() + from;
  const line = io(F, s(42.0), s(44.2), 0, 1, Easing.inOut(Easing.quad));
  const tops = GROW.map((h, i) => [175 + i * 170, 1290 - h]);
  return (
    <AbsoluteFill>
      <Center top={210}>
        <H size={80} style={rise(F, 33.9)}>सुरुवातीला मोठा खर्च?</H>
        <H size={92} style={{...rise(F, 35.4), marginTop: 10}}><Hi>गरज नाही.</Hi></H>
      </Center>
      <Step x={70} t={37.5} F={F} l1="MVP" l2="बनवा" icon={<div style={{width: 100, height: 100, borderRadius: 50, background: INK, color: Y, fontSize: 40, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box'}}>{'</>'}</div>} />
      <Step x={400} t={40.2} F={F} l1="मार्केट" l2="टेस्ट करा" icon={<Flask size={96} />} />
      <Step x={730} t={41.4} F={F} l1="बिझनेस" l2="वाढवा" gold icon={<Bars size={96} />} />
      {[355, 685].map((x, i) => <div key={x} style={{...abs(x, 630), fontSize: 60, fontWeight: 800, color: GOLD, opacity: io(F, s(i ? 41.2 : 40.0), s(i ? 41.2 : 40.0) + 8)}}>→</div>)}
      {GROW.map((h, i) => {
        const g = io(F, s(41.8 + i * 0.45), s(41.8 + i * 0.45) + 14);
        return <div key={i} style={{...abs(115 + i * 170, 1290 - h * g), width: 120, height: h * g, borderRadius: '16px 16px 4px 4px', background: i < 2 ? '#3a3a3a' : Y, opacity: i < 2 ? 1 : 0.55 + i * 0.1}} />;
      })}
      <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
        <polyline points={tops.map((p) => p.join(',')).join(' ')} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} transform="translate(0,-40)" />
      </svg>
      <div style={{...abs(115, 1300), width: 120, textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#8a8478', opacity: io(F, s(41.8), s(42.2))}}>MVP</div>
      <div style={{...abs(795, 1300), width: 120, textAlign: 'center', fontSize: 30, fontWeight: 800, color: GOLD, opacity: io(F, s(43.6), s(44.0)), whiteSpace: 'nowrap'}}>Full App</div>
    </AbsoluteFill>
  );
};

/* ---------- 7. CTA ---------- */
const Cta = ({from}) => {
  const F = useCurrentFrame() + from;
  const p1 = pop(F, 44.8, 11), p2 = pop(F, 46.9, 11);
  const dm = io(F, s(49.7), s(50.2));
  const ring = ((F % 45) / 45);
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 150, 480), width: 300, height: 80, borderRadius: '50%', border: `4px solid ${GOLD}`, opacity: 1 - ring, transform: `scale(${0.5 + ring})`}} />
      <div style={{...abs(540 - 70, 300 + Math.sin(F / 8) * 10), transform: `scale(${pop(F, 44.6)})`}}><Pin w={140} /></div>
      <div style={{...abs(540 - 70, 560), width: 140, height: 40}} />
      <Center top={565}>
        <div style={{padding: '10px 36px 4px', borderRadius: 26, border: '3px solid #444', background: '#1a1a1a', fontSize: 44, fontWeight: 700, color: '#fff', ...rise(F, 45.0)}}>तुमचे शहर</div>
      </Center>
      <Sparks x={880} y={630} rot={10} o={p1} />
      <div style={{...abs(70, 720), width: 940, height: 250, borderRadius: 125, background: Y, display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p1}) rotate(-2deg)`, boxShadow: '0 30px 80px rgba(255,197,46,0.25)'}}>
        <Chat size={130} />
        <div>
          <H size={50} color={INK}>तुमच्या शहराचं नाव</H>
          <H size={84} color={INK} style={{lineHeight: 1.05}}>Comment करा!</H>
        </div>
      </div>
      <div style={{...abs(70, 1030), width: 940, height: 220, borderRadius: 110, border: `5px solid ${Y}`, background: '#141414', display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p2 * (1 + 0.05 * Math.sin(Math.PI * dm))})`}}>
        <Send size={100} />
        <div>
          <H size={46} color="#cfcfcf">असा App बनवायचा आहे?</H>
          <H size={78} color="#fff" style={{lineHeight: 1.05}}>आम्हाला <span style={{color: Y}}>DM करा</span></H>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */
const SCENES = {hook: Hook, cities: Cities, app: AppScene, benefits: Benefits, objection: Objection, mvp: Mvp, cta: Cta};
const Video = ({font}) => {
  const f = useCurrentFrame();
  const keys = Object.keys(SC);
  return (
    <AbsoluteFill style={{fontFamily: `${FONTS[font][0]}, sans-serif`}}>
      <Bg />
      <Audio src={staticFile('vo.mp3')} />
      {keys.map((k, i) => {
        const [from, dur] = SC[k];
        const Comp = SCENES[k];
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <SceneWrap dur={dur} first={i === 0} last={i === keys.length - 1}><Comp from={from} /></SceneWrap>
          </Sequence>
        );
      })}
      <Dashes f={f} />
      <Captions f={f} />
    </AbsoluteFill>
  );
};

const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{font: 'anek'}} />;
registerRoot(Root);
