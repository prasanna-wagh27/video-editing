/*
 * Outgrid Labs reel kit, shared by every reel in reels/<name>/reel.jsx.
 * Fonts load from the reel's public/fonts (a symlink to shared/fonts).
 * Editing this changes every reel the next time it renders; finished MP4s in each reel's out/ folder stay as they are.
 */
import React from 'react';
import {
  AbsoluteFill, Sequence, Audio, useCurrentFrame,
  interpolate, spring, Easing, staticFile, delayRender, continueRender,
} from 'remotion';

/* ---------- fonts ---------- */
const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 120000});
const FONTS = {baloo: ['Baloo', 'fonts/Baloo2.ttf', '400 800'], anek: ['Anek', 'fonts/AnekDevanagari.ttf', '100 800']};
Promise.all(Object.values(FONTS).map(([name, file, weight]) =>
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

const SceneCtx = React.createContext(0); // scene start frame, so Hi can use absolute cue seconds

// SEGS: [[startSec, endSec, 'caption with *highlight* words'], ...] from scripts/vo_pauses.sh
// word times spread by character length inside each pause-bounded segment; swap for Whisper word timestamps if sync drifts
const buildChunks = (SEGS) => {
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
  return CHUNKS;
};

/* ---------- icons ---------- */
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
const BRAND = {fontFamily: 'Anek, sans-serif', paddingTop: '0.12em', lineHeight: 1}; // Anek sits high; nudge Latin down to centre on the mark
const Lockup = ({size = 46, color = INK, text = 'Outgrid Labs', weight = 600}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
    <Mark size={size} color={color} />
    <div style={{width: 2, height: size * 0.82, background: color, opacity: 0.25}} />
    <div style={{...BRAND, fontSize: size * 0.62, fontWeight: weight, color, whiteSpace: 'nowrap'}}>{text}</div>
  </div>
);
const Watermark = ({f, hideAt = Infinity}) => (
  <div style={{...abs(60, 90), opacity: 0.92 * io(f, 0, 12) * io(f, hideAt, hideAt + 8, 1, 0)}}><Lockup size={48} /></div>
);

/* ---------- third-party logos (glyph paths from simple-icons, CC0; trademarks of their owners) ---------- */
const WA_D = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
const IG_D = 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077';
// WhatsApp app-icon look: white glyph on a green rounded tile (round = circle)
const WhatsAppLogo = ({size = 120, round = false, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: round ? size / 2 : size * 0.24, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}><path d={WA_D} fill="#fff" /></svg>
  </div>
);
// Instagram app-icon look: white glyph on the brand gradient
const InstagramLogo = ({size = 120, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}><path d={IG_D} fill="#fff" /></svg>
  </div>
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

// one dash per story scene; hides at the brand outro
const Dashes = ({f, SC, keys, outroAt}) => {
  const list = keys.filter((k) => k !== 'outro').map((k) => SC[k]);
  return (
    <div style={{...abs(1080 - 80 - list.length * 50 + 8, 110), display: 'flex', gap: 8, opacity: io(f, outroAt, outroAt + 8, 1, 0)}}>
      {list.map(([from, dur], i) => (
        <div key={i} style={{width: 42, height: 10, borderRadius: 5, background: '#DDD4C2', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${io(f, from, from + dur, 0, 100, Easing.linear)}%`, background: GOLD}} />
        </div>
      ))}
    </div>
  );
};

/* ---------- karaoke captions ---------- */
const Captions = ({f, chunks}) => {
  const c = chunks.find((k) => f >= k.a && f < k.b);
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
// avatar: any node (e.g. a logo circle); name/sub: header text
const ChatScreen = ({children, top = 128, name = 'Your Business', sub = 'AI Assistant · online', avatar = null}) => (
  <div style={{position: 'absolute', inset: 0, background: '#EFE7DC', color: INK}}>
    <div style={{...abs(0, 0), width: '100%', height: top, background: '#fff', display: 'flex', alignItems: 'center', gap: 16, padding: `${top - 96}px 26px 0`, boxSizing: 'border-box', borderBottom: '2px solid #e6e0d2'}}>
      {avatar}
      <div>
        <div style={{fontSize: 30, fontWeight: 700, lineHeight: 1.1}}>{name}</div>
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
    <div style={{width: 64, height: 78, borderRadius: 10, background: RED, color: '#fff', fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, boxSizing: 'border-box'}}>PDF</div>
    <div>
      <div style={{fontSize: 26, fontWeight: 700}}>Prescription.pdf</div>
      <div style={{fontSize: 19, color: '#8a8478'}}>1 page · 84 KB</div>
    </div>
  </div>
);

/* ---------- brand outro (≈2.4 s) ---------- */
// at: start second of the outro; cta: optional node under the handle
const BrandOutro = ({from, at, cta}) => {
  const F = useCurrentFrame() + from;
  const m = pop(F, at + 0.05, 10);
  const word = io(F, s(at + 0.3), s(at + 0.7));
  const bar = io(F, s(at + 0.65), s(at + 1.0), 0, 1, Easing.inOut(Easing.quad));
  const burst = io(F, s(at + 0.05), s(at + 0.7));
  return (
    <AbsoluteFill>
      <div style={{...abs(540 - 230, 420), width: 460, height: 460, borderRadius: 230, border: `6px solid ${Y}`, opacity: (1 - burst) * 0.9, transform: `scale(${0.4 + burst * 0.9})`}} />
      <div style={{...abs(540 - 140, 510), transform: `scale(${m}) rotate(${(1 - m) * -120}deg)`}}><Mark size={280} /></div>
      <Center top={870}>
        <div style={{...BRAND, fontSize: 132, fontWeight: 700, lineHeight: 1, color: INK, opacity: word, transform: `translateY(${(1 - word) * 40}px)`}}>Outgrid Labs</div>
        <div style={{width: 200 * bar, height: 16, borderRadius: 8, background: Y, marginTop: 30}} />
        <div style={{...BRAND, fontSize: 48, fontWeight: 500, color: '#555', marginTop: 36, ...rise(F, at + 0.9)}}>@outgridlabs</div>
        {cta && <div style={{marginTop: 50, ...rise(F, at + 1.2)}}>{cta}</div>}
      </Center>
    </AbsoluteFill>
  );
};

/* ---------- the whole reel ---------- */
// scene cuts in seconds (each inside a VO pause) -> {key: [fromFrame, durFrames]}
const scenesFromCuts = (keys, cuts) => Object.fromEntries(keys.map((k, i) => [k, [s(cuts[i]), s(cuts[i + 1]) - s(cuts[i])]]));

// scenes: {key: Component({from})}; keys: order; SC: {key: [fromFrame, durFrames]}; outroAt: frame where the brand outro starts
const ReelVideo = ({font = 'anek', scenes, keys, SC, chunks, outroAt = Infinity, vo = 'vo.mp3'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: `${FONTS[font][0]}, sans-serif`}}>
      <Bg f={f} />
      {vo && <Audio src={staticFile(vo)} />}
      {keys.map((k, i) => {
        const [from, dur] = SC[k];
        const Comp = scenes[k];
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <SceneCtx.Provider value={from}>
              <SceneWrap dur={dur} first={i === 0} last={i === keys.length - 1}><Comp from={from} /></SceneWrap>
            </SceneCtx.Provider>
          </Sequence>
        );
      })}
      <Watermark f={f} hideAt={outroAt} />
      <Dashes f={f} SC={SC} keys={keys} outroAt={outroAt} />
      <Captions f={f} chunks={chunks} />
    </AbsoluteFill>
  );
};

export {
  IG_D,
  InstagramLogo,
  WA_D,
  WhatsAppLogo,
  BRAND,
  Bell,
  Bg,
  BrandOutro,
  CARD_SHADOW,
  CREAM,
  Cal,
  Captions,
  Center,
  Chat,
  ChatI,
  ChatScreen,
  Check,
  Dashes,
  Divider,
  Doc,
  DocCard,
  FONTS,
  FPS,
  GOLD,
  GREEN,
  GREY,
  Gear,
  H,
  Heart,
  Hi,
  House,
  INK,
  Lockup,
  Loop,
  MARK_D,
  Mark,
  Moon,
  Msg,
  OUT,
  PersonPlus,
  Phone,
  RED,
  ReelVideo,
  SceneCtx,
  SceneWrap,
  Search,
  Send,
  Sparks,
  Star,
  Ticks,
  Twinkle,
  Typing,
  Watermark,
  Y,
  abs,
  buildChunks,
  io,
  pop,
  rise,
  s,
  scenesFromCuts,
};
