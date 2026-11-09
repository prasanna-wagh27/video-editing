import React from 'react';
import {
  registerRoot, Composition, AbsoluteFill, Sequence, Audio, useCurrentFrame,
  interpolate, spring, Easing, staticFile, delayRender, continueRender,
} from 'remotion';

/* ---------- fonts ---------- */
const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 120000});
const FONTS = {baloo: ['Baloo', 'fonts/Baloo2.ttf', '400 800'], anek: ['Anek', 'fonts/AnekDevanagari.ttf', '100 800']};
const BRAND_FONT = ['Inter', 'fonts/Inter.ttf', '100 900'];
Promise.all([...Object.values(FONTS), BRAND_FONT].map(([name, file, weight]) =>
  new FontFace(name, `url(${staticFile(file)})`, {weight}).load().then((ff) => document.fonts.add(ff))))
  .catch(() => {}).finally(() => continueRender(fontHandle));
// never let a stalled font fetch hang a render tab
setTimeout(() => continueRender(fontHandle), 30000);

/* ---------- helpers ---------- */
const FPS = 30;
const s = (t) => Math.round(t * FPS); // seconds -> frames
const Y = '#FFC52E';
const INK = '#121212';
const CREAM = '#FFFFFF';
const GOLD = '#D99A00'; // yellow is too faint as text/stroke on the light bg
const GREY = '#6b665c';
const GREEN = '#1FA855';
const RED = '#E5484D';
const CARD_SHADOW = '0 18px 50px rgba(60,45,10,0.12), 0 2px 0 rgba(0,0,0,0.04)';
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const io = (f, a, b, from = 0, to = 1, easing = OUT) => interpolate(f, [a, b], [from, to], {...C, easing});
const abs = (left, top, extra = {}) => ({position: 'absolute', left, top, ...extra});
const rise = (F, t, d = 14) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, 40, 0)}px)`});
const pop = (F, t, damping = 12) => spring({frame: F - s(t), fps: FPS, config: {damping, mass: 0.7}});

const TOTAL = 2100; // 70 s: VO is 67.4 s + brand outro
// scene cuts in seconds, each one sits inside a VO pause
const CUTS = [0, 7.9, 14.95, 24.55, 29.42, 33.93, 38.47, 43.19, 50.5, 58.74, 67.6, 70];
const KEYS = ['hook', 'night', 'chat', 'reminder', 'rx', 'followup', 'review', 'recall', 'lesson', 'cta', 'outro'];
const OUTRO = s(67.6);
const SceneCtx = React.createContext(0); // scene start frame, so Hi can use absolute cue seconds
const SC = Object.fromEntries(KEYS.map((k, i) => [k, [s(CUTS[i]), s(CUTS[i + 1]) - s(CUTS[i])]]));

/* ---------- VO segments (seconds, from ffmpeg silencedetect -30dB / 0.18 s) ---------- */
const SEGS = [
  [0.0, 1.25, 'तुमच्या क्लिनिकची *ग्रोथ…*'],
  [1.35, 3.9, 'फक्त Instagram वर Health Tips देऊन *होणार नाही!*'],
  [4.22, 6.77, "त्यासाठी पेशंटचा *'एक्सपिरियन्स'* बदलावा लागेल."],
  [7.13, 7.63, 'बघा कसं...'],
  [8.14, 11.34, 'रात्री ११ वाजता नेहाला अचानक *दातदुखी* सुरू झाली.'],
  [11.65, 14.73, 'तिने गुगल केलं आणि तुमच्या क्लिनिकला *WhatsApp मेसेज* केला.'],
  [15.14, 15.95, 'तुम्ही झोपला होतात…'],
  [16.35, 18.58, 'पण तुमच्या *AI* ने लगेच रिप्लाय दिला!'],
  [18.91, 20.14, 'समस्या समजून घेतली…'],
  [20.35, 24.38, 'आणि दुसऱ्या दिवशी सकाळी *१०:३०* ची अपॉइंटमेंट फिक्स केली.'],
  [24.71, 27.54, "अपॉइंटमेंटच्या २ तास आधी नेहाला *'रिमाइंडर'* गेला."],
  [27.83, 29.26, 'त्यामुळे ती *वेळेवर* पोहोचली.'],
  [29.58, 30.28, 'ट्रीटमेंट झाली.'],
  [30.54, 33.74, 'औषधं आणि प्रिस्क्रिप्शन थेट तिच्या *WhatsApp* वर पोहोचलं.'],
  [34.12, 36.23, '३ दिवसांनी AI ने *पुन्हा मेसेज* केला'],
  [36.62, 38.26, '"नेहा, आता दातदुखी कशी आहे?"'],
  [38.69, 39.65, 'नेहा *खुश!*'],
  [39.9, 43.04, 'तिने समाधानी होऊन क्लिनिकला थेट *५-स्टार रिव्ह्यू* दिला.'],
  [43.34, 45.01, 'आणि बरोबर *६ महिन्यांनी…*'],
  [45.2, 48.02, "डेंटल क्लिनिंगसाठी तिला *'ऑटोमॅटिक रिमाइंडर'* गेला."],
  [48.33, 50.35, 'नेहा *पुन्हा* तुमच्याच क्लिनिकमध्ये आली!'],
  [50.66, 51.53, 'कारण लक्षात ठेवा'],
  [51.8, 54.76, 'क्लिनिकची खरी ग्रोथ फक्त नवीन पेशंट्स आणण्यात *नाही…*'],
  [54.99, 58.54, 'तर जुन्या पेशंट्सचा *विश्वास जिंकून,* त्यांना पुन्हा बोलावण्यात आहे!'],
  [58.94, 61.95, "तुमच्या क्लिनिकमध्येही अशी *'ॲटोमॅटिक सिस्टीम'* सुरू करायचीये?"],
  [62.19, 64.15, 'तर आत्ताच *"WHATSAPP"* कमेंट करा…'],
  [64.43, 67.14, 'आम्ही संपूर्ण माहिती तुम्हाला थेट *DM* करू!'],
];

// word times spread by character length inside each pause-bounded segment; swap for Whisper word timestamps if sync drifts
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
const TOOTH_D = 'M20 6C10 6 6 13 6 21c0 9 5 13 7 22 2 9 3 17 8 17s5-13 11-13 6 13 11 13 6-8 8-17c2-9 7-13 7-22 0-8-4-15-14-15-5 0-8 3-12 3s-7-3-12-3z';
const Tooth = ({size = 120, mood = 'none', fill = '#fff', stroke = INK, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <path d={TOOTH_D} fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    {mood !== 'none' && <>
      <circle cx="24" cy="25" r="2.6" fill={INK} /><circle cx="40" cy="25" r="2.6" fill={INK} />
      <circle cx="19" cy="31" r="3" fill="#FF9DAA" opacity="0.7" /><circle cx="45" cy="31" r="3" fill="#FF9DAA" opacity="0.7" />
      <path d={mood === 'happy' ? 'M25 32 Q32 39 39 32' : 'M25 37 Q32 31 39 37'} fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    </>}
  </svg>
);
const Neha = ({size = 120, mood = 'neutral', style = {}}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', ...style}}>
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block'}}>
      <rect width="100" height="100" fill="#FFE1D3" />
      <path d="M25 50C22 24 36 14 50 14s28 10 25 36l3 26H22z" fill="#2b1d16" />
      <path d="M14 104c0-24 16-34 36-34s36 10 36 34z" fill="#E4577A" />
      <rect x="44" y="58" width="12" height="14" fill="#E2A982" />
      <ellipse cx="50" cy="44" rx="19" ry="22" fill="#E9B48F" />
      <path d="M31 41c2-15 15-20 27-16 8 3 11 9 11 15-8-6-20-10-38 1z" fill="#2b1d16" />
      <circle cx="50" cy="34" r="1.6" fill={RED} />
      {mood === 'happy'
        ? <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"><path d="M39 46q3-3 6 0" /><path d="M55 46q3-3 6 0" /><path d="M42 54q8 7 16 0" /></g>
        : <g><circle cx="42" cy="46" r="2.2" fill={INK} /><circle cx="58" cy="46" r="2.2" fill={INK} />
          <path d={mood === 'sad' ? 'M43 58q7-5 14 0' : 'M43 55q7 4 14 0'} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" /></g>}
    </svg>
  </div>
);
const Moon = ({size = 120, color = '#FFD66B'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><path d="M40 6a26 26 0 1 0 18 40A21 21 0 0 1 40 6z" fill={color} /></svg>
);
const Bell = ({size = 60, color = INK, rot = 0}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{transform: `rotate(${rot}deg)`, transformOrigin: '50% 10%'}}>
    <path d="M32 6c-10 0-17 8-17 18v12l-6 9h46l-6-9V24C49 14 42 6 32 6z" fill={color} /><circle cx="32" cy="52" r="6" fill={color} />
  </svg>
);
const Cal = ({size = 50, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
    <rect x="8" y="12" width="48" height="44" rx="7" /><path d="M8 26h48M21 6v12M43 6v12" /><rect x="18" y="34" width="9" height="9" rx="2" fill={color} stroke="none" />
  </svg>
);
const Star = ({size = 100, on = 1}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <polygon points="32,4 40,23 60,24 45,37 50,58 32,47 14,58 19,37 4,24 24,23" fill={on ? Y : '#ECE6D8'} stroke={on ? GOLD : '#ddd5c4'} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
const Heart = ({size = 60, color = RED, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <path d="M32 56C10 40 4 30 4 20 4 11 11 5 19 5c6 0 10 3 13 8 3-5 7-8 13-8 8 0 15 6 15 15 0 10-6 20-28 36z" fill={color} />
  </svg>
);
const Gear = ({size = 100, color = INK, hole = Y, rot = 0}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{transform: `rotate(${rot}deg)`}}>
    <g fill={color}>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="27" y="1" width="10" height="14" rx="2.5" transform={`rotate(${a} 32 32)`} />)}<circle cx="32" cy="32" r="21" /></g>
    <circle cx="32" cy="32" r="9" fill={hole} />
  </svg>
);
const Loop = ({size = 60, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M52 30a20 20 0 0 0-36-10" /><path d="M12 34a20 20 0 0 0 36 10" /><path d="M16 8v12h12" /><path d="M48 56V44H36" />
  </svg>
);
const Doc = ({size = 60, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
    <path d="M14 6h24l12 12v40H14z" /><path d="M38 6v12h12" /><path d="M22 32h20M22 42h20M22 52h12" />
  </svg>
);
const ChatI = ({size = 60, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M32 6C17 6 6 15 6 28c0 7 3 12 8 16l-3 12 13-7c2 .5 5 1 8 1 15 0 26-9 26-22S47 6 32 6z" fill={color} />
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
const Search = ({size = 46, color = '#777'}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round">
    <circle cx="27" cy="27" r="17" /><path d="M40 40l16 16" />
  </svg>
);
const Ticks = ({size = 30, color = '#34B7F1'}) => (
  <svg viewBox="0 0 64 40" width={size} height={size * 0.62} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22l12 12L38 8" /><path d="M28 30l4 4L58 8" />
  </svg>
);
const Check = ({size = 80, bg = GREEN}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="30" fill={bg} /><path d="M18 33l9 9 19-20" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PersonPlus = ({size = 80, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="26" cy="18" r="11" fill={color} /><path d="M4 58c0-17 10-25 22-25s22 8 22 25z" fill={color} />
    <path d="M52 20v18M43 29h18" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
const House = ({size = 150}) => (
  <svg viewBox="0 0 140 140" width={size} height={size}>
    <path d="M14 66 70 18l56 48" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 60v66h84V60L70 24z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="58" y="88" width="24" height="38" rx="4" fill={INK} /><rect x="38" y="72" width="16" height="16" rx="3" fill="#FFE7A0" stroke={INK} strokeWidth="3" />
  </svg>
);
const Clinic = ({w = 220}) => (
  <svg viewBox="0 0 220 260" width={w} height={(w * 260) / 220}>
    <rect x="12" y="72" width="196" height="184" rx="8" fill="#fff" stroke={INK} strokeWidth="6" />
    <path d="M2 80 110 12l108 68z" fill={Y} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="56" y="92" width="108" height="50" rx="12" fill={INK} />
    <g transform="translate(92 95) scale(0.6)"><path d={TOOTH_D} fill="#fff" /></g>
    <rect x="30" y="160" width="40" height="40" rx="5" fill="#FFE7A0" stroke={INK} strokeWidth="4" />
    <rect x="150" y="160" width="40" height="40" rx="5" fill="#FFE7A0" stroke={INK} strokeWidth="4" />
    <rect x="86" y="168" width="48" height="88" rx="6" fill={INK} />
  </svg>
);
const Sparks = ({x, y, rot = 0, o = 1}) => (
  <svg width="120" height="120" viewBox="0 0 120 120" style={{...abs(x, y), opacity: o, transform: `rotate(${rot}deg)`}}>
    <g stroke={GOLD} strokeWidth="9" strokeLinecap="round"><line x1="20" y1="70" x2="10" y2="30" /><line x1="45" y1="60" x2="70" y2="22" /><line x1="58" y1="88" x2="100" y2="72" /></g>
  </svg>
);
const Twinkle = ({x, y, size = 50, o = 1, color = GOLD}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{...abs(x, y), opacity: o}}>
    <path d="M32 2C34 22 42 30 62 32 42 34 34 42 32 62 30 42 22 34 2 32 22 30 30 22 32 2z" fill={color} />
  </svg>
);

/* ---------- brand: Outgrid Labs ---------- */
const MARK_D = 'M23 3H55Q62 3 62 10V38L44 61H9Q2 61 2 54V24Z M22.5 18H42.5Q47 18 47 22.5V42.5Q47 47 42.5 47H22.5Q18 47 18 42.5V22.5Q18 18 22.5 18Z';
const Mark = ({size = 60, color = INK, style = {}}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style}>
    <path d={MARK_D} fill={color} fillRule="evenodd" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const BRAND = {fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'};
const Lockup = ({size = 46, color = INK, text = 'Outgrid Labs', weight = 600}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
    <Mark size={size} color={color} />
    <div style={{width: 2, height: size * 0.82, background: color, opacity: 0.25}} />
    <div style={{...BRAND, fontSize: size * 0.62, fontWeight: weight, color, whiteSpace: 'nowrap'}}>{text}</div>
  </div>
);
const Watermark = ({f}) => (
  <div style={{...abs(60, 90), opacity: 0.92 * io(f, 0, 12) * io(f, OUTRO, OUTRO + 8, 1, 0)}}><Lockup size={48} /></div>
);

/* ---------- shared text ---------- */
const H = ({children, size = 88, color = INK, style = {}}) => (
  <div style={{fontSize: size, fontWeight: 600, color, lineHeight: 1.2, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Hi = ({children, rot = -2, t}) => {
  const from = React.useContext(SceneCtx);
  const F = useCurrentFrame() + from;
  const w = t === undefined ? 1 : io(F, s(t) + 3, s(t) + 14, 0, 1, Easing.inOut(Easing.quad));
  return (
    <span style={{background: `linear-gradient(${Y}, ${Y}) no-repeat left / ${w * 100}% 100%`, color: INK, padding: '0.04em 0.24em 0', borderRadius: 16, display: 'inline-block',
      transform: `rotate(${rot}deg)`, boxShadow: w > 0.98 ? '0 6px 0 rgba(217,154,0,0.25)' : 'none'}}>{children}</span>
  );
};
const Center = ({top, children, style = {}}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

/* ---------- background + HUD ---------- */
const Bg = ({f}) => {
  const ax = 10 + Math.sin(f / 110) * 12, ay = 90 + Math.cos(f / 130) * 8;
  const bx = 90 + Math.cos(f / 120) * 10, by = 8 + Math.sin(f / 100) * 8;
  return (
    <AbsoluteFill style={{background: '#F7F3EA'}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.04) 2px, transparent 2px)', backgroundSize: '72px 72px', backgroundPosition: `0 ${-f * 0.3}px`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at ${ax}% ${ay}%, rgba(255,197,46,0.32), transparent 45%), radial-gradient(circle at ${bx}% ${by}%, rgba(255,197,46,0.24), transparent 40%)`}} />
      <Mark size={760} color={INK} style={{...abs(560, 1180), opacity: 0.035, transform: `rotate(${-12 + Math.sin(f / 150) * 4}deg)`}} />
    </AbsoluteFill>
  );
};

const Dashes = ({f}) => {
  const list = KEYS.filter((k) => k !== 'outro').map((k) => SC[k]);
  return (
    <div style={{...abs(1080 - 80 - list.length * 50 + 8, 110), display: 'flex', gap: 8, opacity: io(f, OUTRO, OUTRO + 8, 1, 0)}}>
      {list.map(([from, dur], i) => (
        <div key={i} style={{width: 42, height: 10, borderRadius: 5, background: '#DDD4C2', overflow: 'hidden'}}>
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
  const inY = first ? 0 : io(f, 0, 14, 60, 0);
  const outY = last ? 0 : io(f, dur - 8, dur, 0, -50, Easing.in(Easing.quad));
  const sc = (first ? 1 : io(f, 0, 14, 1.05, 1)) * (last ? 1 : io(f, dur - 8, dur, 1, 0.96, Easing.in(Easing.quad))) * (1 + 0.015 * (f / dur));
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${inY + outY}px) scale(${sc})`}}>{children}</AbsoluteFill>;
};

/* ---------- chat mockup ---------- */
const Phone = ({x, y, w, h, rot = 0, ty = 0, children}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: 72, background: '#1d1d1d', border: '4px solid #3a3a3a', padding: 14, boxSizing: 'border-box',
    boxShadow: '0 50px 100px rgba(0,0,0,0.25)', transform: `translateY(${ty}px) rotate(${rot}deg)`}}>
    <div style={{width: '100%', height: '100%', borderRadius: 58, overflow: 'hidden', position: 'relative'}}>
      {children}
      <div style={{...abs('50%', 16), marginLeft: -48, width: 96, height: 24, borderRadius: 12, background: '#1d1d1d'}} />
    </div>
  </div>
);
const ClinicAvatar = ({size = 64}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <Tooth size={size * 0.66} />
  </div>
);
const ChatScreen = ({children, top = 128, sub = 'AI Assistant · online'}) => (
  <div style={{position: 'absolute', inset: 0, background: '#EFE7DC', color: INK}}>
    <div style={{...abs(0, 0), width: '100%', height: top, background: '#fff', display: 'flex', alignItems: 'center', gap: 16, padding: `${top - 96}px 26px 0`, boxSizing: 'border-box', borderBottom: '2px solid #e6e0d2'}}>
      <ClinicAvatar />
      <div>
        <div style={{fontSize: 30, fontWeight: 700, lineHeight: 1.1}}>Your Clinic</div>
        <div style={{fontSize: 20, fontWeight: 600, color: GREEN}}>● {sub}</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 92, padding: '0 22px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden'}}>
      {children}
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: '#F6F2EA', display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', boxSizing: 'border-box'}}>
      <div style={{flex: 1, height: 58, borderRadius: 29, background: '#fff', fontSize: 22, color: '#a19d93', display: 'flex', alignItems: 'center', padding: '4px 24px 0', boxSizing: 'border-box'}}>Message</div>
      <div style={{width: 58, height: 58, borderRadius: 29, background: GREEN}} />
    </div>
  </div>
);
// a chat message whose row grows from 0 to h, so older messages scroll up
const Msg = ({F, t, until, side = 'in', h, ai, time, children, raw}) => {
  const g = Math.min(io(F, s(t), s(t) + 8), until ? io(F, s(until), s(until) + 5, 1, 0) : 1);
  const p = until ? g : pop(F, t, 14);
  const out = side === 'out';
  return (
    <div style={{height: h * g, marginTop: 14 * g, flexShrink: 0, display: 'flex', justifyContent: out ? 'flex-end' : side === 'mid' ? 'center' : 'flex-start', alignItems: 'flex-end'}}>
      <div style={{transform: `scale(${p})`, transformOrigin: out ? '100% 100%' : '0% 100%', opacity: Math.min(1, p * 2),
        ...(raw ? {} : {background: out ? '#D9FDD3' : '#fff', borderRadius: out ? '24px 24px 6px 24px' : '24px 24px 24px 6px', padding: '14px 20px 8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)', fontSize: 28, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap'})}}>
        {ai && <div style={{fontSize: 18, fontWeight: 800, color: GOLD, letterSpacing: 1, marginBottom: 2}}>AI ASSISTANT</div>}
        {children}
        {time && <div style={{fontSize: 17, fontWeight: 600, color: '#8a8478', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 2}}>{time}{out && <Ticks size={24} />}</div>}
      </div>
    </div>
  );
};
const Typing = ({F, a, b}) => (
  <Msg F={F} t={a} until={b} h={64}>
    <div style={{display: 'flex', gap: 8, padding: '6px 4px 10px'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: '#9b968a', transform: `translateY(${Math.sin(F / 3 - i) * 4}px)`}} />)}
    </div>
  </Msg>
);
const Divider = ({F, t, label}) => (
  <Msg F={F} t={t} side="mid" h={44} raw>
    <div style={{background: '#fff8e1', borderRadius: 12, padding: '6px 18px 2px', fontSize: 20, fontWeight: 700, color: '#8a7a4a'}}>{label}</div>
  </Msg>
);
const DocCard = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#F5F3EE', borderRadius: 16, padding: 14, width: 420, boxSizing: 'border-box'}}>
    <div style={{width: 64, height: 78, borderRadius: 10, background: RED, color: '#fff', fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, boxSizing: 'border-box', fontFamily: 'sans-serif'}}>PDF</div>
    <div>
      <div style={{fontSize: 26, fontWeight: 700}}>Prescription.pdf</div>
      <div style={{fontSize: 19, color: '#8a8478'}}>1 page · 84 KB</div>
    </div>
  </div>
);

/* ---------- 1. Hook ---------- */
const Hook = ({from}) => {
  const F = useCurrentFrame() + from;
  const no = io(F, s(2.85), s(3.15));
  const stamp = pop(F, 2.9, 9);
  const chip = pop(F, 6.95, 12);
  return (
    <AbsoluteFill>
      <Center top={195}>
        <H size={80} style={rise(F, 0.05)}>तुमच्या क्लिनिकची</H>
        <H size={104} style={{...rise(F, 0.55), marginTop: 4}}><Hi t={0.55}>ग्रोथ…</Hi></H>
      </Center>
      <Sparks x={720} y={270} o={io(F, s(0.8), s(1.0))} />
      {/* social post card */}
      <div style={{...abs(200, 480), width: 680, height: 370, borderRadius: 36, background: CREAM, boxShadow: CARD_SHADOW, padding: 24, boxSizing: 'border-box',
        transform: `rotate(-3deg) scale(${pop(F, 1.3)})`, filter: `grayscale(${no})`, opacity: 1 - 0.35 * no}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <ClinicAvatar size={56} />
          <div style={{fontSize: 26, fontWeight: 700}}>your.clinic</div>
          <div style={{marginLeft: 'auto', fontSize: 30, fontWeight: 800, color: '#999', letterSpacing: 2}}>•••</div>
        </div>
        <div style={{marginTop: 16, height: 196, borderRadius: 22, background: 'linear-gradient(135deg,#FFE8A3,#FFC52E)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', boxSizing: 'border-box'}}>
          <Tooth size={130} mood="happy" />
          <div>
            <div style={{fontSize: 56, fontWeight: 700, lineHeight: 1.05}}>Health Tips</div>
            <div style={{fontSize: 28, fontWeight: 600, color: '#5b4a10'}}>दात निरोगी ठेवण्यासाठी…</div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 16}}>
          <Heart size={38} color={no > 0.5 ? '#aaa' : RED} style={{transform: `scale(${1 + 0.2 * Math.sin(Math.PI * io(F, s(2.0), s(2.4)))})`}} />
          <ChatI size={36} color="#333" />
          <div style={{marginLeft: 'auto', fontSize: 24, fontWeight: 700, color: '#555'}}>{12 + Math.floor(io(F, s(1.6), s(2.8), 0, 11, Easing.linear))} likes</div>
        </div>
      </div>
      <div style={{...abs(820, 440), width: 110, height: 110, borderRadius: 55, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 14px 30px rgba(229,72,77,0.35)', transform: `scale(${pop(F, 2.85, 9)}) rotate(${(1 - no) * -90}deg)`}}>
        <svg viewBox="0 0 64 64" width="56" height="56"><path d="M16 16l32 32M48 16 16 48" stroke="#fff" strokeWidth="10" strokeLinecap="round" /></svg>
      </div>
      <div style={{...abs(440, 770), width: 520, height: 140, borderRadius: 30, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(-6deg) scale(${stamp})`, opacity: Math.min(1, stamp * 2), boxShadow: '0 30px 80px rgba(0,0,0,0.25)'}}>
        <H size={78} color={Y} style={{paddingTop: 10}}>होणार नाही!</H>
      </div>
      {/* experience card */}
      <div style={{...abs(110, 960), width: 860, padding: '32px 46px 26px', boxSizing: 'border-box', borderRadius: 40, background: CREAM,
        boxShadow: CARD_SHADOW, transform: `rotate(-2deg) scale(${pop(F, 4.15)})`}}>
        <H size={56} color={GREY}>त्यासाठी पेशंटचा</H>
        <H size={96} style={{marginTop: 4}}><Hi rot={-1} t={4.6}>'एक्सपिरियन्स'</Hi></H>
        <H size={60} style={{...rise(F, 5.6), marginTop: 4}}>बदलावा लागेल!</H>
      </div>
      <div style={{...abs(540 - 160, 1300), width: 320, height: 86, borderRadius: 43, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        transform: `scale(${chip})`, opacity: Math.min(1, chip * 2)}}>
        <H size={44} color="#fff" style={{paddingTop: 6}}>बघा कसं</H>
        <svg viewBox="0 0 40 40" width="40" height="40" style={{transform: `translateY(${Math.sin(F / 4) * 4}px)`}}><path d="M10 14l10 12 10-12" fill="none" stroke={Y} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Night: toothache, search, message ---------- */
const STARS = [[90, 40], [300, 70], [470, 30], [610, 120], [880, 210], [420, 180], [560, 250], [200, 250], [840, 40], [660, 20]];
const Night = ({from}) => {
  const F = useCurrentFrame() + from;
  const panel = pop(F, 7.95, 14);
  const pain = F > s(10.1);
  const query = 'dentist near me';
  const typed = query.slice(0, Math.floor(io(F, s(11.85), s(12.7), 0, query.length, Easing.linear)));
  const tap = io(F, s(13.55), s(14.05));
  const fly = io(F, s(13.9), s(14.35));
  return (
    <AbsoluteFill>
      <div style={{...abs(80, 200), width: 920, height: 540, borderRadius: 44, overflow: 'hidden', background: 'linear-gradient(160deg,#151b36,#2a3363)',
        boxShadow: '0 30px 70px rgba(20,25,60,0.3)', transform: `scale(${panel})`}}>
        {STARS.map(([x, y], i) => <div key={i} style={{...abs(x, y), width: 8, height: 8, borderRadius: 4, background: '#fff', opacity: 0.35 + 0.5 * Math.abs(Math.sin(F / 10 + i))}} />)}
        <div style={{...abs(700, 40), filter: 'drop-shadow(0 0 30px rgba(255,214,107,0.5))'}}><Moon size={160} /></div>
        <div style={{...abs(60, 40), ...rise(F, 8.15)}}>
          <H size={44} color="#b9c0e0">रात्री</H>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
            <H size={150} color="#fff" style={{lineHeight: 1}}>११:००</H>
            <H size={52} color="#b9c0e0">PM</H>
          </div>
        </div>
        <div style={{...abs(60, 330), transform: `scale(${pop(F, 9.35)})`}}><Neha size={160} mood={pain ? 'sad' : 'neutral'} /></div>
        <div style={{...abs(250, 336)}}>
          <H size={46} color="#b9c0e0" style={rise(F, 9.5)}>नेहाला अचानक</H>
          <H size={80} style={{...rise(F, 10.05), marginTop: 4}}><Hi t={10.05}>दातदुखी!</Hi></H>
        </div>
        <div style={{...abs(700, 300), transform: `scale(${pop(F, 10.0)}) rotate(${pain ? Math.sin(F * 0.9) * 6 : 0}deg)`}}>
          <Tooth size={170} mood="sad" />
          {[[-30, 20, -30], [150, 10, 30], [160, 110, 70]].map(([x, y, r], i) => (
            <svg key={i} viewBox="0 0 40 40" width="50" height="50" style={{...abs(x, y), transform: `rotate(${r}deg)`, opacity: pain && (F + i * 3) % 12 < 8 ? 1 : 0}}>
              <path d="M8 4l14 14-8 4 14 14" fill="none" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>
      {/* search */}
      <div style={{...abs(80, 790), width: 920, height: 104, borderRadius: 52, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', gap: 20, padding: '0 36px', boxSizing: 'border-box', ...rise(F, 11.6)}}>
        <Search size={46} />
        <div style={{fontSize: 40, fontWeight: 500, color: INK, paddingTop: 4}}>{typed}<span style={{opacity: F % 16 < 8 && F < s(12.9) ? 1 : 0, color: GOLD}}>|</span></div>
      </div>
      {/* result */}
      <div style={{...abs(80, 925), width: 920, height: 200, borderRadius: 34, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', boxSizing: 'border-box', ...rise(F, 12.75)}}>
        <div style={{width: 136, height: 136, borderRadius: 30, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Tooth size={92} /></div>
        <div>
          <div style={{fontSize: 42, fontWeight: 700, lineHeight: 1.1}}>Your Clinic</div>
          <div style={{fontSize: 26, fontWeight: 600, color: '#777'}}><span style={{color: '#f0a500'}}>★</span> 4.8 · Dental Clinic</div>
          <div style={{fontSize: 24, fontWeight: 700, color: GREEN}}>Open now</div>
        </div>
        <div style={{marginLeft: 'auto', height: 78, padding: '4px 30px 0', borderRadius: 39, background: '#25D366', color: '#fff', fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
          transform: `scale(${1 - 0.1 * Math.sin(Math.PI * tap)})`}}>
          <ChatI size={32} color="#fff" /> WhatsApp
        </div>
      </div>
      <div style={{...abs(830 - 45, 1025 - 45), width: 90, height: 90, borderRadius: 45, border: `6px solid ${GOLD}`, opacity: tap > 0 && tap < 1 ? 1 - tap : 0, transform: `scale(${0.4 + tap})`}} />
      {/* sent message */}
      <div style={{...abs(380, 1165), width: 620, display: 'flex', justifyContent: 'flex-end', opacity: fly, transform: `translateY(${(1 - fly) * -110}px) scale(${0.6 + 0.4 * fly})`, transformOrigin: '80% 0%'}}>
        <div style={{background: '#D9FDD3', borderRadius: '28px 28px 6px 28px', padding: '18px 26px 10px', boxShadow: CARD_SHADOW, fontSize: 36, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap'}}>
          दात खूप दुखतोय 😣<br />उद्या भेटता येईल का?
          <div style={{fontSize: 20, fontWeight: 600, color: '#8a8478', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6}}>11:02 PM <Ticks size={28} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. AI replies and books ---------- */
const ApptCard = ({F, ok}) => {
  const done = F >= s(ok);
  const p = pop(F, ok, 9);
  return (
    <div style={{width: 430, background: '#FFF8E1', border: `3px solid ${Y}`, borderRadius: 20, padding: '16px 22px 14px', boxSizing: 'border-box', marginTop: 4}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 800, color: GOLD}}><Cal size={30} color={GOLD} /> APPOINTMENT</div>
      <div style={{fontSize: 26, fontWeight: 600, color: '#6b665c', marginTop: 6}}>उद्या, सकाळी</div>
      <div style={{fontSize: 58, fontWeight: 700, lineHeight: 1}}>10:30 AM</div>
      <div style={{marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px 2px', borderRadius: 14, fontSize: 22, fontWeight: 800,
        background: done ? GREEN : '#e6e0d2', color: done ? '#fff' : '#777', transform: `scale(${done ? 0.8 + 0.2 * p : 1})`}}>{done ? 'Confirmed ✓' : 'Booking…'}</div>
    </div>
  );
};
const Ticket = ({F, t}) => {
  const p = pop(F, t, 11);
  return (
    <div style={{...abs(580, 1070), width: 440, borderRadius: 30, background: '#fff', boxShadow: '0 30px 70px rgba(0,0,0,0.25)', overflow: 'hidden',
      transform: `rotate(5deg) scale(${p}) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 2), transformOrigin: '20% 50%'}}>
      <div style={{background: Y, padding: '14px 26px 8px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800}}><Cal size={30} /> APPOINTMENT</div>
      <div style={{padding: '14px 26px 22px', display: 'flex', alignItems: 'center', gap: 20}}>
        <div>
          <div style={{fontSize: 28, fontWeight: 600, color: GREY}}>उद्या, सकाळी</div>
          <div style={{fontSize: 70, fontWeight: 700, lineHeight: 1}}>10:30 AM</div>
        </div>
        <div style={{marginLeft: 'auto'}}><Check size={78} /></div>
      </div>
    </div>
  );
};
const ChatSc = ({from}) => {
  const F = useCurrentFrame() + from;
  const ph = pop(F, 14.95, 14);
  return (
    <AbsoluteFill>
      <Center top={190}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, ...rise(F, 15.05)}}>
          <Moon size={62} color={GOLD} />
          <H size={66} color={GREY}>तुम्ही झोपला होतात…</H>
        </div>
        <H size={80} style={{...rise(F, 16.25), marginTop: 10}}>पण <Hi t={16.25}>AI</Hi> ने लगेच रिप्लाय दिला!</H>
      </Center>
      {['z', 'z', 'Z'].map((z, i) => {
        const t = ((F + i * 12) % 36) / 36;
        return <div key={i} style={{...abs(900 + i * 26, 230 - t * 70), fontSize: 34 + i * 8, fontWeight: 800, color: GOLD, opacity: Math.sin(Math.PI * t) * io(F, s(15.2), s(15.6)) * io(F, s(16.2), s(16.6), 1, 0)}}>{z}</div>;
      })}
      <Phone x={210} y={420} w={660} h={970} rot={-2} ty={(1 - ph) * 900}>
        <ChatScreen>
          <Msg F={F} t={14} side="out" h={124} time="11:02 PM">दात खूप दुखतोय 😣<br />उद्या भेटता येईल का?</Msg>
          <Typing F={F} a={16.4} b={17.2} />
          <Msg F={F} t={17.2} ai h={150} time="11:02 PM">नमस्कार नेहा! 🙏 काळजी करू नका.<br />नक्की कुठे दुखतंय?</Msg>
          <Msg F={F} t={18.75} side="out" h={86} time="11:03 PM">डावीकडची दाढ, खूप ठणकतेय 😖</Msg>
          <Msg F={F} t={19.55} ai h={150} time="11:03 PM">समजलं 👍 तपासणी करून<br />लगेच आराम देऊ.</Msg>
          <Typing F={F} a={20.4} b={21.05} />
          <Msg F={F} t={21.05} ai h={286} time="11:03 PM"><ApptCard F={F} ok={23.55} /></Msg>
        </ChatScreen>
      </Phone>
      <Ticket F={F} t={23.6} />
    </AbsoluteFill>
  );
};

/* ---------- 4. Reminder → on time ---------- */
const Reminder = ({from}) => {
  const F = useCurrentFrame() + from;
  const m = io(F, s(24.9), s(25.9), 0, 30, Easing.inOut(Easing.quad));
  const notif = pop(F, 26.1, 13);
  const ring = F > s(26.2) && F < s(27.6) ? Math.sin(F * 1.1) * 16 : 0;
  const walk = io(F, s(27.85), s(28.9), 0, 1, Easing.inOut(Easing.quad));
  const ok = pop(F, 28.8, 10);
  const P = [[150, 330], [420, 170], [640, 320]];
  const bz = (k) => (1 - walk) ** 2 * P[0][k] + 2 * (1 - walk) * walk * P[1][k] + walk ** 2 * P[2][k];
  return (
    <AbsoluteFill>
      <Center top={190}>
        <H size={72} style={rise(F, 24.6)}>अपॉइंटमेंटच्या</H>
        <H size={96} style={{...rise(F, 25.15), marginTop: 6}}><Hi t={25.15}>२ तास</Hi> आधी</H>
      </Center>
      <div style={{...abs(80, 500), width: 220, transform: `scale(${pop(F, 24.8)})`}}>
        <svg viewBox="0 0 200 200" width="220" height="220">
          <circle cx="100" cy="100" r="92" fill="#fff" stroke={INK} strokeWidth="8" />
          {Array.from({length: 12}).map((_, i) => <rect key={i} x="97" y="16" width="6" height={i % 3 ? 10 : 18} rx="3" fill={INK} transform={`rotate(${i * 30} 100 100)`} />)}
          <rect x="95" y="52" width="10" height="52" rx="5" fill={INK} transform={`rotate(${(8 + m / 60) * 30} 100 100)`} />
          <rect x="97" y="30" width="6" height="74" rx="3" fill={GOLD} transform={`rotate(${m * 6} 100 100)`} />
          <circle cx="100" cy="100" r="9" fill={INK} />
        </svg>
        <div style={{textAlign: 'center', fontSize: 36, fontWeight: 700, marginTop: 6}}>{`8:${String(Math.round(m)).padStart(2, '0')} AM`}</div>
      </div>
      <div style={{...abs(330, 510), width: 670, height: 210, borderRadius: 34, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', boxSizing: 'border-box',
        opacity: Math.min(1, notif * 2), transform: `translateX(${(1 - notif) * 300}px)`}}>
        <div style={{width: 100, height: 100, borderRadius: 26, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Bell size={60} rot={ring} /></div>
        <div>
          <div style={{fontSize: 20, fontWeight: 700, color: '#8a8478', letterSpacing: 1}}>YOUR CLINIC · आत्ता</div>
          <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.2}}>⏰ आज सकाळी 10:30 ला</div>
          <div style={{fontSize: 28, fontWeight: 500, color: '#444'}}>तुमची अपॉइंटमेंट आहे</div>
        </div>
      </div>
      <div style={{...abs(80, 820), width: 920, height: 510, borderRadius: 40, background: '#fff', boxShadow: CARD_SHADOW, ...rise(F, 27.6)}}>
        <div style={{...abs(50, 40)}}>
          <H size={48} color={GREY}>त्यामुळे ती</H>
          <H size={76}><Hi t={27.9}>वेळेवर</Hi> पोहोचली!</H>
        </div>
        <div style={{...abs(40, 300)}}><House size={150} /></div>
        <div style={{...abs(640, 160)}}><Clinic w={230} /></div>
        <svg width="920" height="510" style={{...abs(0, 0), clipPath: `inset(0 ${(1 - walk) * 100}% 0 0)`}}>
          <path d={`M${P[0][0] + 60} ${P[0][1] + 60} Q${P[1][0] + 60} ${P[1][1] + 60} ${P[2][0] + 60} ${P[2][1] + 60}`} fill="none" stroke={GOLD} strokeWidth="6" strokeDasharray="16 14" strokeDashoffset={-F} />
        </svg>
        <div style={{...abs(bz(0) + 10, bz(1) + 10 - Math.abs(Math.sin(walk * Math.PI * 5)) * 14), opacity: io(F, s(27.7), s(27.9))}}><Neha size={100} mood="happy" /></div>
        <div style={{...abs(820, 140), transform: `scale(${ok})`}}><Check size={96} /></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Treatment + prescription ---------- */
const MEDS = [['Antibiotic', '1-0-1 · ५ दिवस'], ['Pain relief', 'गरज असल्यास'], ['Mouthwash', 'दिवसातून २ वेळा']];
const Rx = ({from}) => {
  const F = useCurrentFrame() + from;
  const tooth = pop(F, 29.45, 11);
  const dl = pop(F, 32.9, 11);
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 115, 185), transform: `scale(${tooth}) translateY(${Math.sin(F / 12) * 6}px)`}}><Tooth size={230} mood="happy" /></div>
      {[[330, 200, 60, 0], [700, 190, 46, 1], [720, 360, 54, 2], [320, 380, 40, 3]].map(([x, y, sz, i]) => (
        <Twinkle key={i} x={x} y={y} size={sz} o={tooth * (0.5 + 0.5 * Math.sin(F / 5 + i * 1.7))} />
      ))}
      <div style={{...abs(700, 200), transform: `scale(${pop(F, 29.8, 10)})`}}><Check size={80} /></div>
      <Center top={460}><H size={80} style={rise(F, 29.55)}><Hi t={29.55}>ट्रीटमेंट झाली!</Hi></H></Center>
      <div style={{...abs(130, 620), width: 820, height: 720, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,0.18)', ...rise(F, 30.3)}}>
        <ChatScreen top={112} sub="AI Assistant">
          <Msg F={F} t={30.55} ai h={176} time="12:15 PM"><DocCard /></Msg>
          <Msg F={F} t={31.3} ai h={292} time="12:15 PM">
            <div style={{fontSize: 26, fontWeight: 800, marginBottom: 6}}>💊 तुमची औषधं</div>
            {MEDS.map(([n, d], i) => (
              <div key={n} style={{display: 'flex', alignItems: 'center', gap: 14, width: 470, padding: '8px 0 4px', borderTop: i ? '2px solid #f0ece2' : 'none', ...rise(F, 31.6 + i * 0.45, 10)}}>
                <div style={{width: 14, height: 14, borderRadius: 7, background: Y, border: `2px solid ${GOLD}`}} />
                <div style={{fontSize: 26, fontWeight: 700}}>{n}</div>
                <div style={{marginLeft: 'auto', fontSize: 22, fontWeight: 600, color: '#777'}}>{d}</div>
              </div>
            ))}
          </Msg>
        </ChatScreen>
      </div>
      <div style={{...abs(560, 590), height: 70, padding: '6px 26px 0', borderRadius: 35, background: GREEN, color: '#fff', fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12,
        transform: `rotate(4deg) scale(${dl})`, opacity: Math.min(1, dl * 2), boxShadow: '0 14px 30px rgba(31,168,85,0.35)'}}>
        थेट WhatsApp वर <Ticks size={34} color="#fff" />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. Follow-up after 3 days ---------- */
const DAYS = ['१', '२', '३'];
const Followup = ({from}) => {
  const F = useCurrentFrame() + from;
  const flips = [34.15, 34.6, 35.05];
  const d = flips.filter((t) => F >= s(t)).length - 1;
  const flip = d >= 0 ? io(F, s(flips[d]), s(flips[d]) + 6) : 0;
  const ph = pop(F, 35.3, 14);
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 150, 180), width: 300, height: 320, borderRadius: 36, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden', transform: `scale(${pop(F, 33.95)})`}}>
        <div style={{height: 84, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><H size={40} color={Y} style={{paddingTop: 6}}>दिवस</H></div>
        <div style={{height: 236, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <H size={180} style={{lineHeight: 1, paddingTop: 20, transform: `scaleY(${0.3 + 0.7 * flip})`}}>{DAYS[Math.max(0, d)]}</H>
        </div>
      </div>
      <div style={{...abs(730, 220), padding: '8px 26px 0', borderRadius: 24, background: Y, transform: `rotate(8deg) scale(${pop(F, 35.15, 10)})`}}><H size={52}>+३ दिवस</H></div>
      <Center top={530}><H size={66} style={rise(F, 35.0)}>AI ने <Hi t={35.0}>पुन्हा मेसेज</Hi> केला</H></Center>
      <Phone x={210} y={650} w={660} h={740} rot={2} ty={(1 - ph) * 800}>
        <ChatScreen>
          <Msg F={F} t={0} ai h={148} time="Mon"><DocCard /></Msg>
          <Msg F={F} t={0} side="out" h={86} time="Mon">Thank you डॉक्टर 🙏</Msg>
          <Divider F={F} t={35.5} label="आज · ३ दिवसांनी" />
          <Typing F={F} a={35.75} b={36.45} />
          <Msg F={F} t={36.45} ai h={116} time="10:00 AM">नेहा, आता दातदुखी कशी आहे? 🙂</Msg>
        </ChatScreen>
      </Phone>
    </AbsoluteFill>
  );
};

/* ---------- 7. Happy → 5-star review ---------- */
const Review = ({from}) => {
  const F = useCurrentFrame() + from;
  const face = pop(F, 38.5, 11);
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 120, 185), transform: `scale(${face})`}}><Neha size={240} mood="happy" /></div>
      {[0, 1, 2, 3].map((i) => {
        const t = ((F - s(38.7) + i * 11) % 44) / 44;
        return F > s(38.7) && <div key={i} style={{...abs([330, 700, 290, 740][i], 380 - t * 170), opacity: Math.sin(Math.PI * t)}}><Heart size={[54, 44, 38, 58][i]} /></div>;
      })}
      <Center top={450}><H size={104} style={{transform: `scale(${pop(F, 38.7, 9)}) rotate(-2deg)`}}><Hi>नेहा खुश!</Hi></H></Center>
      <div style={{...abs(80, 680), width: 920, height: 470, borderRadius: 40, background: '#fff', boxShadow: CARD_SHADOW, padding: '40px 50px', boxSizing: 'border-box', ...rise(F, 39.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Neha size={90} mood="happy" />
          <div>
            <div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.1}}>नेहा</div>
            <div style={{fontSize: 24, fontWeight: 600, color: '#8a8478'}}>Your Clinic ला रिव्ह्यू दिला · आत्ता</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginTop: 34}}>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = pop(F, 40.85 + i * 0.17, 9);
            return <div key={i} style={{position: 'relative', width: 120, height: 120}}>
              <div style={{position: 'absolute', inset: 0}}><Star size={120} on={0} /></div>
              <div style={{position: 'absolute', inset: 0, transform: `scale(${p}) rotate(${(1 - p) * -60}deg)`}}><Star size={120} /></div>
            </div>;
          })}
        </div>
        <div style={{fontSize: 34, fontWeight: 500, lineHeight: 1.4, marginTop: 30, color: '#333', whiteSpace: 'nowrap', ...rise(F, 41.9)}}>
          “रात्रीसुद्धा लगेच रिप्लाय, वेळेवर रिमाइंडर…<br />खूप छान अनुभव! 🙏”
        </div>
      </div>
      <Sparks x={880} y={600} rot={10} o={io(F, s(41.7), s(41.9))} />
    </AbsoluteFill>
  );
};

/* ---------- 8. 6-month recall → returns ---------- */
const MONTHS = ['१', '२', '३', '४', '५', '६'];
const Recall = ({from}) => {
  const F = useCurrentFrame() + from;
  const notif = pop(F, 45.2, 13);
  const ring = F > s(45.3) && F < s(46.6) ? Math.sin(F * 1.1) * 16 : 0;
  const walk = io(F, s(48.4), s(49.4), 0, 1, Easing.inOut(Easing.quad));
  const again = pop(F, 49.4, 10);
  return (
    <AbsoluteFill>
      <Center top={185}>
        <H size={66} color={GREY} style={rise(F, 43.3)}>आणि बरोबर</H>
        <H size={100} style={{...rise(F, 43.75), marginTop: 2}}><Hi t={43.75}>६ महिन्यांनी…</Hi></H>
      </Center>
      <div style={{...abs(80, 470), display: 'flex', gap: 16}}>
        {MONTHS.map((l, i) => {
          const on = io(F, s(43.9 + i * 0.17), s(43.9 + i * 0.17) + 6);
          return (
            <div key={i} style={{width: 140, height: 112, borderRadius: 24, background: on > 0.5 ? Y : '#fff', boxShadow: CARD_SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${0.9 + 0.1 * on})`}}>
              <div style={{fontSize: 50, fontWeight: 700, lineHeight: 1, paddingTop: 6}}>{l}</div>
              <div style={{fontSize: 20, fontWeight: 600, color: on > 0.5 ? INK : '#999'}}>महिना</div>
            </div>
          );
        })}
      </div>
      <div style={{...abs(80, 650), width: 920, height: 210, borderRadius: 34, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', gap: 26, padding: '0 32px', boxSizing: 'border-box',
        opacity: Math.min(1, notif * 2), transform: `translateY(${(1 - notif) * -120}px)`}}>
        <div style={{width: 110, height: 110, borderRadius: 28, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Bell size={64} rot={ring} /></div>
        <div>
          <div style={{fontSize: 20, fontWeight: 700, color: '#8a8478', letterSpacing: 1}}>YOUR CLINIC · आत्ता</div>
          <div style={{fontSize: 38, fontWeight: 700, lineHeight: 1.2}}>🦷 डेंटल क्लिनिंगची वेळ झाली!</div>
          <div style={{fontSize: 28, fontWeight: 500, color: '#444'}}>पुढची अपॉइंटमेंट बुक करूया?</div>
        </div>
      </div>
      <div style={{...abs(660, 618), height: 66, padding: '4px 22px 0 14px', borderRadius: 33, background: INK, display: 'flex', alignItems: 'center', gap: 10,
        transform: `rotate(4deg) scale(${pop(F, 46.7, 10)})`}}>
        <Gear size={42} color={Y} hole={INK} rot={F * 4} /><H size={32} color={Y}>ऑटोमॅटिक</H>
      </div>
      <div style={{...abs(80, 910), width: 920, height: 430, borderRadius: 40, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden', ...rise(F, 48.2)}}>
        <div style={{...abs(50, 40)}}>
          <H size={76}>नेहा <Hi t={48.5}>पुन्हा</Hi> आली!</H>
          <H size={44} color={GREY} style={{marginTop: 4}}>तुमच्याच क्लिनिकमध्ये</H>
        </div>
        <div style={{...abs(0, 400), width: 920, height: 6, background: '#eee6d4'}} />
        <div style={{...abs(650, 130)}}><Clinic w={230} /></div>
        <div style={{...abs(60 + walk * 440, 270 - Math.abs(Math.sin(walk * Math.PI * 5)) * 14)}}><Neha size={120} mood="happy" /></div>
        <div style={{...abs(50, 230), height: 60, padding: '4px 20px 0 12px', borderRadius: 30, background: Y, display: 'flex', alignItems: 'center', gap: 8,
          transform: `scale(${again})`, opacity: Math.min(1, again * 2)}}>
          <Loop size={40} /><span style={{fontSize: 28, fontWeight: 700}}>Repeat Patient</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. Lesson ---------- */
const StarI = ({size = 46, color = INK}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><polygon points="32,4 40,23 60,24 45,37 50,58 32,47 14,58 19,37 4,24 24,23" fill={color} strokeLinejoin="round" /></svg>
);
const RING = [ChatI, Cal, Bell, Doc, StarI, Loop];
const Lesson = ({from}) => {
  const F = useCurrentFrame() + from;
  const dim = io(F, s(54.85), s(55.3), 1, 0.45);
  const a = io(F, s(51.75), s(52.25));
  const big = pop(F, 54.95, 13);
  return (
    <AbsoluteFill>
      <Center top={190}><H size={66} color={GREY} style={rise(F, 50.6)}>कारण लक्षात ठेवा…</H></Center>
      <div style={{...abs(80, 310), width: 920, height: 250, borderRadius: 36, background: CREAM, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box', boxShadow: CARD_SHADOW,
        opacity: Math.min(a, dim), filter: `grayscale(${1 - dim})`, transform: `translateX(${(1 - a) * -120}px)`}}>
        <div style={{width: 122, height: 122, borderRadius: 28, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><PersonPlus size={78} /></div>
        <div>
          <H size={46} color="#555">खरी ग्रोथ फक्त नवीन पेशंट्स</H>
          <H size={66}>आणण्यात <span style={{color: RED}}>नाही…</span></H>
        </div>
      </div>
      <div style={{...abs(80, 610), width: 920, height: 730, borderRadius: 40, border: `5px solid ${Y}`, background: 'rgba(255,197,46,0.16)', boxSizing: 'border-box',
        transform: `scale(${big})`, boxShadow: '0 0 80px rgba(255,197,46,0.15)'}}>
        <svg width="920" height="420" style={{...abs(0, 0)}}>
          <circle cx="455" cy="185" r="140" fill="none" stroke={GOLD} strokeWidth="5" strokeDasharray="14 12" strokeDashoffset={-F} />
        </svg>
        <div style={{...abs(455 - 60, 185 - 60), transform: `scale(${1 + 0.07 * Math.sin(F / 5)})`}}><Heart size={120} /></div>
        {RING.map((Ic, i) => {
          const ang = (-90 + i * 60) * (Math.PI / 180);
          const p = pop(F, 55.3 + i * 0.28, 11);
          return (
            <div key={i} style={{...abs(455 + Math.cos(ang) * 140 - 44, 185 + Math.sin(ang) * 140 - 44), width: 88, height: 88, borderRadius: 44, background: p > 0.5 ? Y : '#fff',
              border: `4px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * p})`}}>
              <Ic size={46} />
            </div>
          );
        })}
        <Center top={420}>
          <H size={52}>तर जुन्या पेशंट्सचा</H>
          <H size={92} style={{margin: '4px 0'}}><Hi t={55.6}>विश्वास</Hi> जिंकून,</H>
          <H size={58} style={rise(F, 57.0)}>त्यांना पुन्हा बोलावण्यात आहे!</H>
        </Center>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 10. CTA ---------- */
const Cta = ({from}) => {
  const F = useCurrentFrame() + from;
  const p1 = pop(F, 62.1, 11), p2 = pop(F, 64.35, 11);
  const dm = io(F, s(66.4), s(66.9));
  const pulse = (F % 45) / 45;
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 110, 185), width: 220, height: 220, borderRadius: 110, border: `4px solid ${GOLD}`, opacity: (1 - pulse) * 0.8, transform: `scale(${0.6 + pulse * 0.6})`}} />
      <div style={{...abs(540 - 80, 215), transform: `scale(${pop(F, 58.8)})`}}><Gear size={160} rot={F * 2} /></div>
      <Center top={400}>
        <H size={62} style={rise(F, 58.95)}>तुमच्या क्लिनिकमध्येही अशी</H>
        <H size={92} style={{...rise(F, 60.2), marginTop: 6}}><Hi t={60.2}>'ॲटोमॅटिक सिस्टीम'?</Hi></H>
      </Center>
      <Sparks x={890} y={600} rot={10} o={p1} />
      <div style={{...abs(70, 690), width: 940, height: 250, borderRadius: 125, background: Y, display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p1}) rotate(-2deg)`, boxShadow: '0 30px 80px rgba(255,197,46,0.25)'}}>
        <Chat size={130} />
        <div>
          <H size={50}>आत्ताच कमेंट करा</H>
          <H size={96} style={{lineHeight: 1.05}}>"WHATSAPP"</H>
        </div>
      </div>
      <div style={{...abs(70, 1000), width: 940, height: 220, borderRadius: 110, border: `5px solid ${Y}`, background: '#141414', display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p2 * (1 + 0.05 * Math.sin(Math.PI * dm))})`}}>
        <Send size={100} />
        <div>
          <H size={46} color="#cfcfcf">संपूर्ण माहिती थेट</H>
          <H size={80} color="#fff" style={{lineHeight: 1.05}}>आम्ही <span style={{color: Y}}>DM करू!</span></H>
        </div>
      </div>
      <Center top={1262}>
        <div style={{padding: '12px 34px 12px 22px', borderRadius: 50, border: `3px solid ${INK}`, background: '#fff', transform: `scale(${pop(F, 65.3, 11)})`}}>
          <Lockup size={52} text="@outgridlabs" weight={500} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ---------- 11. Brand outro ---------- */
const Outro = ({from}) => {
  const F = useCurrentFrame() + from;
  const m = pop(F, 67.65, 10);
  const word = io(F, s(67.9), s(68.3));
  const bar = io(F, s(68.25), s(68.6), 0, 1, Easing.inOut(Easing.quad));
  const burst = io(F, s(67.65), s(68.3));
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 230, 420), width: 460, height: 460, borderRadius: 230, border: `6px solid ${Y}`, opacity: (1 - burst) * 0.9, transform: `scale(${0.4 + burst * 0.9})`}} />
      <div style={{...abs(540 - 140, 510), transform: `scale(${m}) rotate(${(1 - m) * -120}deg)`}}><Mark size={280} /></div>
      <Center top={870}>
        <div style={{...BRAND, fontSize: 132, fontWeight: 700, lineHeight: 1, color: INK, opacity: word, transform: `translateY(${(1 - word) * 40}px)`}}>Outgrid Labs</div>
        <div style={{width: 200 * bar, height: 16, borderRadius: 8, background: Y, marginTop: 30}} />
        <div style={{...BRAND, fontSize: 48, fontWeight: 500, color: '#555', marginTop: 36, ...rise(F, 68.5)}}>@outgridlabs</div>
        <div style={{marginTop: 50, padding: '14px 36px 6px', borderRadius: 40, background: INK, ...rise(F, 68.8)}}>
          <H size={46} color="#fff"><span style={{color: Y}}>"WHATSAPP"</span> कमेंट करा</H>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */
const SCENES = {outro: Outro, hook: Hook, night: Night, chat: ChatSc, reminder: Reminder, rx: Rx, followup: Followup, review: Review, recall: Recall, lesson: Lesson, cta: Cta};
const Video = ({font}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: `${FONTS[font][0]}, sans-serif`}}>
      <Bg f={f} />
      <Audio src={staticFile('vo.mp3')} />
      {KEYS.map((k, i) => {
        const [from, dur] = SC[k];
        const Comp = SCENES[k];
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <SceneCtx.Provider value={from}>
              <SceneWrap dur={dur} first={i === 0} last={i === KEYS.length - 1}><Comp from={from} /></SceneWrap>
            </SceneCtx.Provider>
          </Sequence>
        );
      })}
      <Watermark f={f} />
      <Dashes f={f} />
      <Captions f={f} />
    </AbsoluteFill>
  );
};

const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{font: 'anek'}} />;
registerRoot(Root);
