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
