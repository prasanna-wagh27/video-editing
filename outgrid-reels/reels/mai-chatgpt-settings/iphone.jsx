/*
 * Realistic iPhone (true 19.5:9 body, thin titanium frame + black bezel, Dynamic Island, side buttons)
 * and ChatGPT iOS screens drawn in iOS points (402 x 874 pt screen), scaled into the frame.
 * UI font: Inter (close to SF Pro) with Poppins Devanagari fallback for Marathi.
 */
import React from 'react';
import {Easing, staticFile, delayRender, continueRender, Img} from 'remotion';
import {s, io, pop, abs} from '../../shared/kit.jsx';

const fh = delayRender('ui-font', {timeoutInMilliseconds: 120000});
Promise.all([['Regular', 400], ['Medium', 500], ['SemiBold', 600], ['Bold', 700]].map(([n, w]) =>
  new FontFace('MaiUI', `url(${staticFile(`fonts/mai/inter-${n}.otf`)})`, {weight: String(w), unicodeRange: 'U+0000-02FF, U+2000-206F, U+20AC, U+2122, U+2190-21FF, U+2212'}).load().then((f) => document.fonts.add(f))))
  .catch(() => {}).finally(() => continueRender(fh));
setTimeout(() => continueRender(fh), 30000);

export const UI = 'MaiUI, MaiSans, sans-serif';
export const SW = 402, SH = 874;                 // screen in points
const TXT = '#0D0D0D', SEC = '#8E8E93', SEP = 'rgba(60,60,67,0.16)', GROUPED = '#F2F2F7', GREENT = '#34C759', REDT = '#FF3B30';

/* ---------- small helpers (pt units) ---------- */
export const Tx = ({z = 17, w = 400, c = TXT, children, style = {}}) => (
  <div style={{fontFamily: UI, fontSize: z, fontWeight: w, color: c, lineHeight: 1.3, whiteSpace: 'nowrap', letterSpacing: '-0.01em', ...style}}>{children}</div>
);
export const Sf = ({d, z = 22, c = TXT, sw = 1.9, style = {}}) => (
  <svg viewBox="0 0 24 24" width={z} height={z} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block', flexShrink: 0, ...style}}>{d}</svg>
);
export const SFI = {
  menu: <path d="M4 8h16M4 16h10" />,
  compose: <><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></>,
  chev: <path d="M9 5l7 7-7 7" />, back: <path d="M15 5l-7 7 7 7" />, down: <path d="M7 10l5 5 5-5" />, x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />, mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  persSpark: <><circle cx="10" cy="8" r="3.6" /><path d="M3.5 20c1.3-3.6 3.8-5.4 6.5-5.4 1.5 0 2.9.5 4 1.4" /><path d="M18 12.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  data: <><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  wave: <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />, lock: <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>, globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.6 5.3 3.6 8.5s-1.1 6-3.6 8.5c-2.5-2.5-3.6-5.3-3.6-8.5S9.5 6 12 3.5z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10.5h18" /></>, mail: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  link: <><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" /></>,
  archive: <><rect x="3" y="4" width="18" height="5" rx="1.5" /><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4" /></>,
  trash: <><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13" /></>, export: <><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 13v6.5h14V13" /></>,
  book: <><path d="M4 5.5A2 2 0 0 1 6 3.5h13v15H6a2 2 0 0 0-2 2z" /><path d="M4 20.5a2 2 0 0 1 2-2h13v2" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  img: <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="M20.5 16l-5-5-8.5 8.5" /></>,
  bulb: <><path d="M9 17h6M10 20.5h4M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.2 1.4-1.2 2.5h-4.6c0-1.1-.4-1.9-1.2-2.5z" /></>,
};

/* ---------- iPhone frame ---------- */
// w = body width in px; screen content is drawn in pt (SW x SH) and scaled to fit.
export const IPhone = ({w = 600, children, dark = false, style = {}}) => {
  const h = Math.round(w / 0.4784), R = w * 0.152, rim = w * 0.012, bez = w * 0.022;
  const sw = w - 2 * (rim + bez), k = sw / SW;
  const btn = (side, top, len) => <div style={{...abs(side === 'L' ? -w * 0.0085 : w - w * 0.0015, h * top), width: w * 0.01, height: h * len, borderRadius: w * 0.006,
    background: 'linear-gradient(90deg, #6d6d72, #b9b9bf 45%, #5d5d62)'}} />;
  return (
    <div style={{position: 'relative', width: w, height: h, ...style}}>
      {btn('L', 0.165, 0.045)}{btn('L', 0.235, 0.075)}{btn('L', 0.325, 0.075)}{btn('R', 0.27, 0.115)}
      {/* titanium rim */}
      <div style={{position: 'absolute', inset: 0, borderRadius: R, background: 'linear-gradient(135deg, #c9c9ce 0%, #7d7d83 18%, #4b4b50 50%, #8e8e94 80%, #d4d4d8 100%)',
        boxShadow: '0 50px 90px rgba(20,20,20,0.28), 0 18px 30px rgba(20,20,20,0.18)'}} />
      <div style={{position: 'absolute', inset: rim * 0.45, borderRadius: R - rim * 0.45, background: 'linear-gradient(135deg, #3c3c40, #1b1b1d 40%, #2c2c30)'}} />
      {/* black glass + screen */}
      <div style={{position: 'absolute', inset: rim, borderRadius: R - rim, background: '#050505'}}>
        <div style={{position: 'absolute', inset: bez, borderRadius: R - rim - bez, overflow: 'hidden', background: dark ? '#000' : '#fff'}}>
          <div style={{width: SW, height: SH, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative', overflow: 'hidden'}}>
            {children}
            {/* Dynamic Island */}
            <div style={{...abs(SW / 2 - 63, 11), width: 126, height: 37, borderRadius: 19, background: '#000', zIndex: 50}}>
              <div style={{...abs(94, 11), width: 15, height: 15, borderRadius: 8, background: 'radial-gradient(circle at 40% 40%, #2a3550, #07080c 70%)'}} />
            </div>
            <div style={{...abs(SW / 2 - 67, SH - 13), width: 134, height: 5, borderRadius: 3, background: dark ? '#fff' : '#000', zIndex: 50}} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 30%, transparent 46%)', pointerEvents: 'none'}} />
        </div>
      </div>
    </div>
  );
};
export const phoneH = (w) => Math.round(w / 0.4784);
export const phonePt = (w) => (w - 2 * (w * 0.012 + w * 0.022)) / SW;   // px per pt
export const phoneInset = (w) => w * 0.034;                              // px from body edge to screen

/* ---------- iOS chrome ---------- */
export const StatusBar = ({c = TXT, bg = 'transparent'}) => (
  <div style={{...abs(0, 0), width: SW, height: 54, background: bg, zIndex: 40}}>
    <Tx z={17} w={600} c={c} style={{...abs(52, 17)}}>9:41</Tx>
    <svg viewBox="0 0 80 14" width={80} height={14} style={{...abs(298, 21)}}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={10 - i * 3} width="3.2" height={4 + i * 3} rx="1" fill={c} />)}
      <path d="M31 5.2a9 9 0 0 1 12 0M33.2 7.6a5.6 5.6 0 0 1 7.6 0M35.4 10a2.3 2.3 0 0 1 3.2 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <rect x="51" y="1.5" width="24" height="11.5" rx="3.6" stroke={c} strokeOpacity="0.4" strokeWidth="1.1" fill="none" /><rect x="53" y="3.5" width="17" height="7.5" rx="2" fill={c} /><rect x="76.2" y="5" width="1.6" height="4.5" rx="0.8" fill={c} fillOpacity="0.4" />
    </svg>
  </div>
);
export const NavBar = ({title, back, right, rightBold = true, bg = GROUPED, large}) => (
  <div style={{...abs(0, 54), width: SW, height: 52, background: bg, zIndex: 30}}>
    {back && <div style={{...abs(10, 13), display: 'flex', alignItems: 'center', gap: 2}}><Sf d={SFI.back} z={26} sw={2.2} /><Tx z={17} w={400}>{back}</Tx></div>}
    {title && <Tx z={17} w={600} style={{...abs(0, 14), width: SW, textAlign: 'center'}}>{title}</Tx>}
    {right === 'x' ? <div style={{...abs(SW - 50, 9), width: 34, height: 34, borderRadius: 17, background: 'rgba(118,118,128,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sf d={SFI.x} z={16} sw={2.4} c="#3C3C43" /></div>
      : right && <Tx z={17} w={rightBold ? 600 : 400} style={{...abs(0, 14), right: 18, left: 'auto'}}>{right}</Tx>}
  </div>
);
export const Toggle = ({on = 0}) => (
  <div style={{width: 51, height: 31, borderRadius: 16, background: '#E9E9EB', position: 'relative', flexShrink: 0}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 16, background: GREENT, opacity: on}} />
    <div style={{...abs(2 + on * 20, 2), width: 27, height: 27, borderRadius: 14, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16)'}} />
  </div>
);
// grouped inset list
export const Group = ({x = 16, y, w = SW - 32, header, footer, children}) => (
  <div style={{...abs(x, y), width: w}}>
    {header && <Tx z={13} w={400} c={SEC} style={{margin: '0 0 7px 16px', textTransform: 'uppercase', letterSpacing: '0.02em'}}>{header}</Tx>}
    <div style={{background: '#fff', borderRadius: 22, overflow: 'hidden'}}>{React.Children.toArray(children).filter(Boolean).map((c, i) => (
      <div key={i} style={{position: 'relative'}}>{i > 0 && <div style={{...abs(52, 0), right: 0, height: 0.7, background: SEP}} />}{c}</div>))}</div>
    {footer && <Tx z={13} w={400} c={SEC} style={{margin: '7px 16px 0', whiteSpace: 'normal', lineHeight: 1.35}}>{footer}</Tx>}
  </div>
);
export const Row = ({icon, label, value, chev = true, toggle, hl = 0, red, h = 52, lz = 17}) => (
  <div style={{height: h, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, background: hl ? `rgba(0,0,0,${0.08 * hl})` : 'transparent'}}>
    {icon && <Sf d={icon} z={23} c={red ? REDT : TXT} sw={1.8} />}
    <Tx z={lz} w={400} c={red ? REDT : TXT} style={{flex: 1, paddingLeft: icon ? 0 : 0}}>{label}</Tx>
    {value && <Tx z={17} w={400} c={SEC}>{value}</Tx>}
    {toggle !== undefined ? <Toggle on={toggle} /> : chev && <Sf d={SFI.chev} z={15} c="#C4C4C7" sw={2.6} />}
  </div>
);
// finger tap (screen-recording style touch dot), pt coords
export const Tap = ({F, t, x, y}) => {
  const k = F - s(t);
  if (k < -8 || k > 14) return null;
  const inP = io(k, -8, -2, 0, 1), outP = io(k, 4, 14, 1, 0), ring = io(k, 0, 14, 0, 1);
  return (
    <div style={{...abs(x - 22, y - 22), width: 44, height: 44, zIndex: 60, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: 'rgba(40,40,40,0.32)', border: '2px solid rgba(255,255,255,0.9)', opacity: Math.min(inP, outP), transform: `scale(${k < 0 ? 1.1 - 0.1 * inP : 0.92})`}} />
      {k >= 0 && <div style={{position: 'absolute', inset: 0, borderRadius: 22, border: '2.5px solid rgba(40,40,40,0.5)', opacity: 1 - ring, transform: `scale(${1 + ring * 0.9})`}} />}
    </div>
  );
};
// tapped-row highlight around time t
export const hlAt = (F, t) => io(F, s(t) - 3, s(t), 0, 1) * io(F, s(t) + 6, s(t) + 14, 1, 0);

/* navigation stack: items [{t, kind:'push'|'sheet'|'base'|'dismiss', el}] — the latest started item is on top */
export const Nav = ({F, items, dur = 13}) => {
  let i = 0;
  items.forEach((it, j) => { if (F >= s(it.t)) i = j; });
  const cur = items[i], prev = items[i - 1];
  const p = i === 0 ? 1 : io(F, s(cur.t), s(cur.t) + dur, 0, 1, Easing.out(Easing.cubic));
  const layer = (el, style, key) => <div key={key} style={{...abs(0, 0), width: SW, height: SH, overflow: 'hidden', ...style}}>{el}</div>;
  if (!prev || p >= 1) return layer(cur.el, {}, i);
  if (cur.kind === 'push') return <>{layer(prev.el, {transform: `translateX(${-p * SW * 0.3}px)`}, i - 1)}<div style={{...abs(0, 0), width: SW, height: SH, background: `rgba(0,0,0,${0.1 * p})`}} />{layer(cur.el, {transform: `translateX(${(1 - p) * SW}px)`, boxShadow: '-8px 0 24px rgba(0,0,0,0.12)'}, i)}</>;
  if (cur.kind === 'back') return <>{layer(cur.el, {transform: `translateX(${-(1 - p) * SW * 0.3}px)`}, i)}{layer(prev.el, {transform: `translateX(${p * SW}px)`, boxShadow: '-8px 0 24px rgba(0,0,0,0.12)'}, i - 1)}</>;
  if (cur.kind === 'sheet') return <>{layer(prev.el, {transform: `scale(${1 - 0.06 * p}) translateY(${p * 10}px)`, borderRadius: 40 * p, filter: `brightness(${1 - 0.25 * p})`}, i - 1)}{layer(cur.el, {transform: `translateY(${(1 - p) * SH}px)`, top: 0}, i)}</>;
  if (cur.kind === 'dismiss') return <>{layer(cur.el, {transform: `scale(${0.94 + 0.06 * p})`, borderRadius: 40 * (1 - p), filter: `brightness(${0.75 + 0.25 * p})`}, i)}{layer(prev.el, {transform: `translateY(${p * SH}px)`}, i - 1)}</>;
  return <>{layer(prev.el, {opacity: 1 - p}, i - 1)}{layer(cur.el, {opacity: p}, i)}</>;
};

/* ---------- ChatGPT screens ---------- */
const GptMark = ({z = 22}) => <Img src={staticFile('logos/openai.svg')} style={{width: z, height: z, display: 'block'}} />;
export const ChatTop = ({title = 'ChatGPT'}) => (
  <div style={{...abs(0, 54), width: SW, height: 52, zIndex: 30, background: '#fff'}}>
    <div style={{...abs(16, 10), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sf d={SFI.menu} z={24} sw={2.1} /></div>
    <div style={{...abs(0, 13), width: SW, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4}}><Tx z={18} w={600}>{title}</Tx><Sf d={SFI.chev} z={13} c={SEC} sw={2.8} /></div>
    <div style={{...abs(SW - 50, 12)}}><Sf d={SFI.compose} z={23} sw={1.9} /></div>
  </div>
);
export const Composer = ({text, caret}) => (
  <div style={{...abs(12, SH - 100), width: SW - 24, height: 54, borderRadius: 27, background: '#fff', boxShadow: '0 0 0 0.8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 8px 0 14px', gap: 10}}>
    <Sf d={SFI.plus} z={24} sw={1.9} />
    <Tx z={17} c={text ? TXT : SEC} style={{flex: 1, overflow: 'hidden'}}>{text || 'Ask anything'}{caret && <span style={{color: '#0A84FF'}}>|</span>}</Tx>
    <Sf d={SFI.mic} z={22} sw={1.9} />
    <div style={{width: 38, height: 38, borderRadius: 19, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sf d={SFI.wave} z={19} c="#fff" sw={2.4} /></div>
  </div>
);
export const UserMsg = ({children, y, op = 1, style = {}}) => (
  <div style={{...abs(0, y), right: 16, left: 'auto', maxWidth: 290, background: '#F1F1F1', borderRadius: 22, padding: '10px 16px 9px', opacity: op, ...style}}>
    <Tx z={17} style={{whiteSpace: 'normal', lineHeight: 1.4}}>{children}</Tx>
  </div>
);
export const BotMsg = ({lines, y, n = 99, z = 17, c = TXT, style = {}}) => (
  <div style={{...abs(18, y), width: SW - 40, ...style}}>
    {lines.slice(0, Math.ceil(n)).map((l, i) => <Tx key={i} z={z} w={l.b ? 600 : 400} c={c} style={{whiteSpace: 'normal', lineHeight: 1.45, marginBottom: l.gap || 4, opacity: Math.min(1, n - i)}}>{l.t ?? l}</Tx>)}
  </div>
);
export const ChatHome = ({children, composer, empty = true}) => (
  <div style={{position: 'absolute', inset: 0, background: '#fff'}}>
    <StatusBar bg="#fff" />
    <ChatTop />
    {empty && <Tx z={26} w={500} style={{...abs(0, SH / 2 - 60), width: SW, textAlign: 'center'}}>What can I help with?</Tx>}
    {children}
    {composer || <Composer />}
  </div>
);
export const Sidebar = ({hl = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: '#fff'}}>
    <StatusBar bg="#fff" />
    <div style={{...abs(16, 62), width: SW - 32, height: 42, borderRadius: 21, background: '#F1F1F1', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}><Sf d={SFI.search} z={19} c={SEC} /><Tx z={17} c={SEC}>Search</Tx></div>
    {[[SFI.compose, 'New chat'], [SFI.img, 'Library'], [SFI.grid, 'GPTs'], [SFI.book, 'Projects']].map(([d, l], i) => (
      <div key={l} style={{...abs(20, 128 + i * 48), display: 'flex', alignItems: 'center', gap: 14}}><Sf d={d} z={22} /><Tx z={17} w={500}>{l}</Tx></div>
    ))}
    <Tx z={14} w={600} c={SEC} style={{...abs(20, 336)}}>Chats</Tx>
    {['दिवाळी ऑफर पोस्ट', 'GST बिल फॉरमॅट', 'Instagram caption ideas', 'स्टॉक यादी Excel', 'ग्राहकांना WhatsApp मेसेज'].map((l, i) => (
      <Tx key={l} z={17} style={{...abs(20, 370 + i * 44)}}>{l}</Tx>
    ))}
    <div style={{...abs(0, SH - 96), width: SW, height: 62, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: hl ? `rgba(0,0,0,${0.07 * hl})` : 'transparent'}}>
      <div style={{width: 36, height: 36, borderRadius: 18, background: '#E5712F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Tx z={16} w={600} c="#fff">GP</Tx></div>
      <Tx z={17} w={500}>Ganesh Patil</Tx>
    </div>
  </div>
);
export const SettingsScreen = ({F, hlPers = 0, hlData = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Settings" right="x" />
    <Group y={120} header="Account">
      <Row icon={SFI.mail} label="Email" value="ganesh@…" chev={false} />
      <Row icon={SFI.card} label="Subscription" value="Free" chev={false} />
    </Group>
    <Group y={262} header="App">
      <Row icon={SFI.globe} label="App Language" value="English" />
      <Row icon={SFI.sun} label="Appearance" value="System" />
    </Group>
    <Group y={392}>
      <Row icon={SFI.persSpark} label="Personalization" hl={hlPers} />
      <Row icon={SFI.bell} label="Notifications" />
      <Row icon={SFI.data} label="Data Controls" hl={hlData} />
      <Row icon={SFI.wave} label="Voice" />
      <Row icon={SFI.lock} label="Security" />
    </Group>
    <Group y={672}><Row icon={SFI.info} label="About" /></Group>
  </div>
);
export const PersScreen = ({ci = 'Off', mem = 0, hlCI = 0, hlMem = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Personalization" back="Settings" />
    <Group y={130}><Row label="Custom Instructions" value={ci} hl={hlCI} /></Group>
    <Group y={232} header="Memory" footer="ChatGPT will become more helpful as it remembers details and preferences about you.">
      <div style={{background: hlMem ? `rgba(0,0,0,${0.06 * hlMem})` : 'transparent'}}><Row label="Memory" toggle={mem} /></div>
      <Row label="Manage Memory" />
    </Group>
  </div>
);
const Field = ({label, text = '', ph, caret, h = 92, y}) => (
  <div style={{...abs(16, y), width: SW - 32}}>
    <Tx z={15} w={500} c="#3C3C43" style={{margin: '0 0 8px 4px'}}>{label}</Tx>
    <div style={{height: h, background: '#fff', borderRadius: 16, padding: '12px 14px', boxSizing: 'border-box', boxShadow: caret ? '0 0 0 2px #0A84FF' : 'none'}}>
      <Tx z={17} c={text ? TXT : '#C4C4C7'} style={{whiteSpace: 'pre-wrap', lineHeight: 1.4}}>{text || ph}{caret && <span style={{color: '#0A84FF', fontWeight: 300}}>|</span>}</Tx>
    </div>
  </div>
);
export const CIScreen = ({work = '', traits = '', focus = -1, enable = 0, hlSave = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Custom Instructions" back="" right="Save" />
    {hlSave > 0 && <div style={{...abs(SW - 70, 58), width: 60, height: 44, borderRadius: 22, background: `rgba(0,0,0,${0.08 * hlSave})`, zIndex: 31}} />}
    <Field y={122} label="What should ChatGPT call you?" text="गणेश" h={50} />
    <Field y={214} label="What do you do?" text={work} ph="Shop owner, teacher…" caret={focus === 0} h={82} />
    <Field y={340} label="What traits should ChatGPT have?" text={traits} ph="Chatty, witty, straight shooting…" caret={focus === 1} h={110} />
    <Field y={494} label="Anything else ChatGPT should know about you?" text="" ph="Interests, values, or preferences…" h={82} />
    <Group y={640}><Row label="Enable for new chats" toggle={enable} /></Group>
  </div>
);
export const MemoryScreen = ({F, items}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Saved memories" back="" />
    <Tx z={13} w={400} c={SEC} style={{...abs(32, 124), textTransform: 'uppercase'}}>{`${items.filter((m) => F >= s(m.t)).length} memories`}</Tx>
    {items.map((m, i) => {
      const on = F >= s(m.t), p = on ? io(F, s(m.t), s(m.t) + 10, 0, 1, Easing.out(Easing.cubic)) : 0;
      return on && (
        <div key={i} style={{...abs(16, 150 + i * 96), width: SW - 32, height: 84, borderRadius: 18, background: '#fff', padding: '14px 16px', boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, display: 'flex', gap: 12}}>
          <div style={{width: 34, height: 34, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Sf d={m.icon} z={20} c="#fff" sw={2} /></div>
          <div><Tx z={13} w={600} c={SEC}>{m.k}</Tx><Tx z={16} style={{whiteSpace: 'normal', lineHeight: 1.35, marginTop: 2}}>{m.v}</Tx></div>
        </div>
      );
    })}
  </div>
);
export const DataScreen = ({imp = 'On', hlImp = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Data Controls" back="Settings" />
    <Group y={130}><Row label="Improve the model for everyone" value={imp} hl={hlImp} lz={16.5} /></Group>
    <Group y={232}>
      <Row label="Shared Links" />
      <Row label="Archived Chats" />
      <Row label="Archive All Chats" chev={false} />
      <Row label="Delete All Chats" chev={false} red />
    </Group>
    <Group y={464}><Row label="Export Data" chev={false} /></Group>
  </div>
);
export const ImproveScreen = ({on = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: GROUPED}}>
    <StatusBar />
    <NavBar title="Model improvement" back="" />
    <Group y={130} footer="Allow your content to be used to train our models, which makes ChatGPT better for you and everyone who uses it. We take steps to protect your privacy.">
      <Row label="Improve the model for everyone" toggle={on} lz={16.5} />
    </Group>
  </div>
);
export {GptMark, TXT, SEC, GROUPED, GREENT, REDT};
