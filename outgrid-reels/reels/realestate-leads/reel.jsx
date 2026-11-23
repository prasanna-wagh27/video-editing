/*
 * Real estate: one missed call = one lost client. Leads from 99acres / Housing / MagicBricks / Facebook ads land on one
 * dashboard, WhatsApp auto-reply, follow-up reminders, site-visit tracker, brochure on WhatsApp, AI agent calls in 5 min.
 * Outgrid Labs reel, LEAN light style, 1080x1920, VO at original speed. Thin strokes, small sharp text (user brief).
 * Real logos: 99acres (shared/logos/99acres.svg), Facebook, WhatsApp, Instagram (simple-icons glyphs in lean.jsx).
 * Housing.com and MagicBricks: brand-colour wordmarks (their logo files could not be downloaded from this sandbox).
 * Names, projects, times and numbers on the UI screens are illustrative.
 * No hook headline: captions run from frame 0, the hook is a pure visual (incoming call -> missed -> client leaves).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs, Y} from '../../shared/kit.jsx';
import {BG, TXT, MUTED, LINE, GOLD_T, C_GREEN, C_RED, C_BLUE, C_ORANGE, LAT, up, Glass, Chip, Ini, AppIcon, Ico, DoubleTick,
  I_PHONE, I_BELL, I_CAL, I_PIN, I_BLDG, I_USERS, Acres99, Facebook, WhatsApp, Instagram, LeanOutro, LeanVideo} from '../../shared/lean.jsx';
import {CAPS} from './captions.js';
import {C, K, SCENES, OUTRO_AT, OUTRO_LEN} from './cues.mjs';

const TOTAL = s(OUTRO_AT + OUTRO_LEN);
const CHUNKS = CAPS;

/* ---------- helpers ---------- */
const WA = '#25D366', WA_BUB = '#D9FDD3', WA_BG = '#EFEAE2', HS = '#6A2CE0', MB = '#D8232A';
const popS = (F, t, d = 12) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const vis = (F, t) => F >= s(t);
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const T = ({size = 34, w: wt = 500, color = TXT, style = {}, children}) => <div style={{fontSize: size, fontWeight: wt, color, lineHeight: 1.15, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const Rings = ({F, t, x, y, color = C_GREEN, r = 120, every = 24, until = Infinity}) => {
  if (F < s(t)) return null;
  return <>{[0, 1, 2].map((k) => {
    const ph = ((F - s(t) + k * (every / 3)) % every) / every;
    if (F > s(until)) return null;
    return <div key={k} style={{...abs(x - r, y - r), width: 2 * r, height: 2 * r, borderRadius: '50%', border: `2px solid ${color}`, opacity: (1 - ph) * 0.6, transform: `scale(${0.7 + ph * 0.8})`}} />;
  })}</>;
};
const clock = (min) => { const h = Math.floor(min / 60), m = Math.floor(min % 60); const hh = ((h + 11) % 12) + 1; return `${hh}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

/* ---------- logos ---------- */
const HousingWord = ({size = 44}) => ( // brand-colour wordmark (logo file not downloadable here)
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.22}}>
    <svg viewBox="0 0 24 24" width={size * 1.05} height={size * 1.05}><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill={HS} /></svg>
    <span style={{fontSize: size, fontWeight: 700, color: HS, letterSpacing: '-0.03em', lineHeight: 1, paddingTop: size * 0.14}}>housing<span style={{fontWeight: 500}}>.com</span></span>
  </div>
);
const MBWord = ({size = 44}) => (
  <span style={{fontSize: size, fontWeight: 700, color: MB, letterSpacing: '-0.035em', lineHeight: 1, paddingTop: size * 0.14}}>magic<span style={{fontWeight: 500}}>bricks</span></span>
);
const SrcIcon = ({k, size = 56}) => {
  if (k === 0) return <Acres99 size={size} />;
  if (k === 3) return <Facebook size={size} />;
  const c = k === 1 ? HS : MB;
  return (
    <div style={{width: size, height: size, borderRadius: size * 0.24, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      {k === 1 ? <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="#fff" /></svg>
        : <span style={{color: '#fff', fontSize: size * 0.5, fontWeight: 700, paddingTop: size * 0.1, letterSpacing: '-0.04em'}}>mb</span>}
    </div>
  );
};
const SrcCard = ({k, F, t, x, y}) => (
  <Glass x={x} y={y} w={430} h={130} r={26} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, ...popS(F, t)}}>
    {k === 0 && <><Acres99 size={76} /><T size={44} w={700} color="#0078DB">99acres</T></>}
    {k === 1 && <HousingWord size={44} />}
    {k === 2 && <MBWord size={50} />}
    {k === 3 && <><Facebook size={64} /><T size={40} w={600}>Facebook Ads</T></>}
  </Glass>
);

/* ---------- devices ---------- */
const Phone = ({x, y, w: W, h, bg = '#fff', children, style = {}}) => (
  <div style={{...abs(x, y), width: W, height: h, borderRadius: W * 0.13, background: '#18181A', padding: Math.max(6, W * 0.016), boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(60,45,10,0.18)', ...style}}>
    <div style={{width: '100%', height: '100%', borderRadius: W * 0.115, overflow: 'hidden', background: bg, position: 'relative'}}>
      {children}
      <div style={{...abs('50%', W * 0.025), marginLeft: -W * 0.08, width: W * 0.16, height: W * 0.045, borderRadius: W * 0.03, background: '#18181A'}} />
    </div>
  </div>
);
// WhatsApp chat chrome (light): header + wallpaper; children = bubbles
const WaChat = ({name, ini, sub = 'online', children}) => (
  <>
    <div style={{...abs(0, 0), right: 0, height: 170, background: '#fff', borderBottom: `1.5px solid ${LINE}`, display: 'flex', alignItems: 'flex-end', gap: 18, padding: '0 30px 22px', boxSizing: 'border-box'}}>
      <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke={TXT} strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
      <Ini t={ini} size={64} />
      <div style={{flex: 1}}><T size={32} w={600}>{name}</T><T size={22} color={MUTED} style={{marginTop: 4}}>{sub}</T></div>
      <WhatsApp size={44} />
    </div>
    <div style={{...abs(0, 170), right: 0, bottom: 0, background: WA_BG, padding: '30px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18}}>{children}</div>
  </>
);
const Bubble = ({F, t, out, time, ticks, children, w: W, style = {}}) => !vis(F, t) ? null : (
  <div style={{alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: W || 420, background: out ? WA_BUB : '#fff', borderRadius: 22, padding: '18px 22px 10px',
    boxShadow: '0 1px 1.5px rgba(0,0,0,0.10)', transform: `scale(${pop(F, t, 13)})`, transformOrigin: out ? '100% 0' : '0 0', ...style}}>
    <div style={{fontSize: 28, fontWeight: 500, lineHeight: 1.3, color: TXT, ...LAT}}>{children}</div>
    {time && <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 18, color: MUTED, marginTop: 4}}>{time}{ticks && <DoubleTick size={22} />}</div>}
  </div>
);
const Typing = ({F, t, until}) => (F < s(t) || F >= s(until)) ? null : (
  <div style={{alignSelf: 'flex-end', background: WA_BUB, borderRadius: 22, padding: '20px 24px', display: 'flex', gap: 8}}>
    {[0, 1, 2].map((i) => <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: '#6b8f6b', opacity: 0.35 + 0.65 * Math.abs(Math.sin((F + i * 5) / 6))}} />)}
  </div>
);
// thin-line glyphs (24 grid)
const I_X = <path d="M6 6l12 12M18 6 6 18" />;
const I_CLOCK = <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>;
const I_SPARK = <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>;
const I_HEAD = <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="7" rx="1.5" /><rect x="17" y="13" width="4" height="7" rx="1.5" /><path d="M19 20c0 1-1 2-4 2h-2" /></>;
const I_DOC = <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>;
const I_SEND = <path d="M4 12 20 4l-6 16-3-7z" />;
const I_HEART = <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />;

/* ================= scenes ================= */

/* 1. hook: incoming 99acres lead call -> missed -> the client walks away (no headline) */
const Hook = ({F}) => {
  const missed = vis(F, K.missed);
  const ring = !missed ? Math.sin(F / 1.6) * 1.4 * (F % 30 < 18 ? 1 : 0) : 0;
  const leave = io(F, s(K.client), s(K.client) + 16, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      <Phone x={250} y={210} w={580} h={1150} style={{transform: `rotate(${ring}deg)`}}>
        <div style={{...abs(0, 0), width: '100%', height: '100%', background: missed ? '#fff' : 'linear-gradient(180deg, #F3FBF6, #fff 60%)'}} />
        <Center y={130} style={{width: '100%'}}>
          <T size={28} w={500} color={missed ? C_RED : MUTED}>{missed ? 'Missed call' : 'Incoming call…'}</T>
        </Center>
        <div style={{...abs(0, 230), width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - 0.7 * leave, filter: `grayscale(${leave})`, transform: `translateX(${leave * 90}px)`}}>
          <div style={{position: 'relative', width: 180, height: 180}}>
            <Rings F={F} t={0} x={90} y={90} r={110} until={K.missed} />
            <Ini t="RP" size={180} />
          </div>
          <T size={46} w={600} style={{marginTop: 40}}>Rahul Patil</T>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}><Acres99 size={34} /><T size={26} color={MUTED}>2 BHK enquiry · 99acres</T></div>
        </div>
        {!missed ? (
          <div style={{...abs(0, 860), width: '100%', display: 'flex', justifyContent: 'center', gap: 150}}>
            {[C_RED, C_GREEN].map((c, i) => (
              <div key={c} style={{width: 110, height: 110, borderRadius: 55, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: i ? `translateY(${Math.sin(F / 4) * 4}px)` : 'none'}}>
                <div style={{transform: i ? 'none' : 'rotate(135deg)'}}><Ico d={I_PHONE} size={50} color="#fff" sw={1.8} /></div>
              </div>
            ))}
          </div>
        ) : (
          <Center y={820} style={{width: '100%', ...popS(F, K.missed)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, border: `1.5px solid ${C_RED}55`, background: '#FFF4F4', borderRadius: 999, padding: '16px 30px 10px'}}>
              <Ico d={I_PHONE} size={34} color={C_RED} sw={1.8} /><T size={30} w={600} color={C_RED}>1 missed call · 10:42 AM</T>
            </div>
          </Center>
        )}
      </Phone>
      {vis(F, K.gela) && <Center y={900} style={popS(F, K.gela, 11)}><Chip color={C_RED} size={34}>−1 client</Chip></Center>}
    </AbsoluteFill>
  );
};

/* 2. sources: four portals pop; their leads scatter to three different phones */
const SRC_POS = [[90, 230], [560, 230], [90, 390], [560, 390]];
const PH = [[80, 'Owner'], [410, 'Staff 1'], [740, 'Staff 2']];
const LEADS = [[0, 0], [3, 1], [1, 2], [2, 0], [3, 2], [0, 1], [1, 0], [3, 2], [2, 1]]; // [source, phone]
const Src = ({F}) => {
  const tk = [K.a99, K.housing, K.mb, K.fb];
  const t0 = K.leads, tilt = io(F, s(K.vegvegly), s(K.vegvegly) + 12, 0, 1, Easing.out(Easing.back(1.6)));
  const arrived = (p) => LEADS.filter(([, q], i) => q === p && F >= s(t0 + 0.35 * i) + 16).length;
  return (
    <AbsoluteFill>
      {SRC_POS.map(([x, y], k) => <SrcCard key={k} k={k} F={F} t={tk[k]} x={x} y={y} />)}
      {PH.map(([x, label], p) => (
        <div key={p} style={{...abs(x, 680), width: 260, ...up(F, t0 - 0.1, 12, 30)}}>
          <div style={{transform: `rotate(${(p - 1) * 7 * tilt}deg) translateY(${p === 1 ? 0 : 24 * tilt}px)`}}>
            <Phone x={0} y={0} w={260} h={510} style={{position: 'relative'}}>
              <div style={{padding: '56px 16px 0', display: 'flex', flexDirection: 'column', gap: 12}}>
                {LEADS.map((l, i) => [...l, i]).filter(([, q, i]) => q === p && F >= s(t0 + 0.35 * i) + 16).map(([sk, , i]) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, background: '#F4F1EA', borderRadius: 12, padding: '8px 10px', transform: `scale(${pop(F, t0 + 0.35 * i + 16 / FPS, 13)})`}}>
                    <SrcIcon k={sk} size={38} /><div style={{flex: 1, height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.10)'}} />
                  </div>
                ))}
              </div>
            </Phone>
            {arrived(p) > 0 && <div style={{...abs(224, -14), minWidth: 46, height: 46, borderRadius: 23, background: C_RED, color: '#fff', fontSize: 26, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box'}}>{arrived(p)}</div>}
          </div>
          <T size={28} color={MUTED} style={{textAlign: 'center', marginTop: 44}}>{label}</T>
        </div>
      ))}
      {LEADS.map(([sk, p], i) => {
        const a = s(t0 + 0.35 * i), k = (F - a) / 16;
        if (k < 0 || k >= 1) return null;
        const [sx, sy] = SRC_POS[sk], x0 = sx + 215, y0 = sy + 110, x1 = PH[p][0] + 130, y1 = 900;
        const e = Easing.inOut(Easing.quad)(k);
        return <div key={i} style={{...abs(x0 + (x1 - x0) * e - 26, y0 + (y1 - y0) * e - 26 - Math.sin(e * Math.PI) * 60)}}><SrcIcon k={sk} size={52} /></div>;
      })}
    </AbsoluteFill>
  );
};

/* 3. you are at a site visit, staff is busy; unread leads keep piling up */
const Busy = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'busy');
  const n = Math.min(9, 3 + Math.floor(Math.max(0, F - s(a[1] + 0.4)) / 18));
  return (
    <AbsoluteFill>
      <Glass x={90} y={260} w={430} h={620} r={32} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, ...up(F, a[1] + 0.05, 12, 30)}}>
        <div style={{position: 'relative'}}>
          <Ico d={I_BLDG} size={220} color={TXT} sw={1.1} />
          <div style={{...abs(150, -20), ...popS(F, K.site)}}><Ico d={I_PIN} size={80} color={C_RED} sw={1.6} /></div>
        </div>
        <T size={34} w={600} style={{marginTop: 34}}>तुम्ही</T>
        <div style={{marginTop: 18, ...popS(F, K.site)}}><Chip color={C_ORANGE} size={28}>Site visit</Chip></div>
      </Glass>
      <Glass x={560} y={260} w={430} h={620} r={32} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, ...up(F, a[1] + 0.2, 12, 30)}}>
        <div style={{transform: `rotate(${vis(F, K.bizi) ? Math.sin(F / 2) * 1.5 : 0}deg)`}}><Ico d={I_HEAD} size={220} color={TXT} sw={1.1} /></div>
        <T size={34} w={600} style={{marginTop: 34}}>Staff</T>
        <div style={{marginTop: 18, ...popS(F, K.bizi)}}><Chip color={C_RED} size={28}>On another call</Chip></div>
      </Glass>
      <Center y={1000} style={up(F, a[1] + 0.5, 12, 24)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', border: `1.5px solid ${LINE}`, borderRadius: 999, padding: '18px 34px 12px', boxShadow: 'var(--l-shadow)'}}>
          <div style={{transform: `rotate(${Math.sin(F / 2.2) * 10}deg)`}}><Ico d={I_BELL} size={40} color={TXT} sw={1.7} /></div>
          <T size={34} w={500}>Unread leads</T>
          <div style={{minWidth: 54, height: 54, borderRadius: 27, background: C_RED, color: '#fff', fontSize: 30, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box'}}>{n}</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* 4. 2-3 hours late reply -> buyer already fixed a visit with another agent */
const Late = ({F}) => {
  const tm = io(F, s(K.donteen), s(K.reply), 10 * 60 + 2, 12 * 60 + 47, Easing.inOut(Easing.quad));
  const spin = io(F, s(K.donteen), s(K.reply), 0, 360 * 3, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Phone x={190} y={190} w={700} h={1000} bg={WA_BG}>
        <WaChat name="Rahul Patil" ini="RP">
          <Bubble F={F} t={-1} time="10:02 AM">2BHK available आहे का?</Bubble>
          <Bubble F={F} t={K.reply} out time={clock(tm)} ticks>हो sir, available आहे</Bubble>
          <Bubble F={F} t={K.dusrya} time="12:49 PM" w={460}>Sorry, दुसऱ्या agent सोबत visit fix झाली.</Bubble>
        </WaChat>
      </Phone>
      <div style={{...abs(700, 150), display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1.5px solid ${LINE}`, borderRadius: 999, padding: '14px 26px 10px 18px', boxShadow: 'var(--l-shadow)', ...up(F, K.donteen - 0.2, 10, 20)}}>
        <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke={C_ORANGE} strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 12V7" transform={`rotate(${spin} 12 12)`} /><path d="M12 12h3.5" transform={`rotate(${spin / 12} 12 12)`} /></svg>
        <T size={32} w={600}>{clock(tm)}</T>
      </div>
      {vis(F, K.fix) && <Center y={1240} style={popS(F, K.fix, 10)}><Chip color={C_RED} size={36}>Lead lost</Chip></Center>}
    </AbsoluteFill>
  );
};

/* 5. intelligent system: every source flows into one dashboard */
const ROWS = [['Rahul Patil', 0, 'Baner · 2BHK', ['Replied', C_GREEN]], ['Sneha Kulkarni', 3, 'Wakad · 3BHK', ['Visit 4 PM', C_ORANGE]], ['Amit Shinde', 1, 'Hinjewadi · 1BHK', ['New', C_BLUE]],
  ['Priya Shah', 2, 'Kharadi · 2BHK', ['Follow-up', GOLD_T]], ['Rohan Joshi', 0, 'Baner · 3BHK', ['New', C_BLUE]]];
const Dash = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'dash')[1];
  const hub = io(F, s(K.intel), s(K.intel) + 12, 0, 1, Easing.out(Easing.back(1.5)));
  const db = io(F, s(K.dash) - 4, s(K.dash) + 10, 0, 1, Easing.out(Easing.cubic));
  const XS = [190, 410, 670, 890];
  return (
    <AbsoluteFill>
      <svg width={1080} height={700} style={{...abs(0, 0)}}>
        {XS.map((x, k) => {
          const d = `M${x} 300 C ${x} 400, 540 380, 540 470`;
          return <g key={k} opacity={io(F, s(a + 0.2 + k * 0.08), s(a + 0.5 + k * 0.08))}>
            <path d={d} fill="none" stroke="rgba(18,18,18,0.18)" strokeWidth="2" strokeDasharray="6 8" strokeDashoffset={-F * 1.2} />
            {hub > 0 && [0, 0.5].map((o) => { const p = ((F / 30 + o + k * 0.13) % 1); const bx = (1 - p) ** 3 * x + 3 * (1 - p) ** 2 * p * x + 3 * (1 - p) * p * p * 540 + p ** 3 * 540; const by = (1 - p) ** 3 * 300 + 3 * (1 - p) ** 2 * p * 400 + 3 * (1 - p) * p * p * 380 + p ** 3 * 470; return <circle key={o} cx={bx} cy={by} r="7" fill={Y} />; })}
          </g>;
        })}
      </svg>
      {XS.map((x, k) => <div key={k} style={{...abs(x - 50, 200), ...popS(F, a + 0.1 + k * 0.08)}}><SrcIcon k={k} size={100} /></div>)}
      <div style={{...abs(540 - 80, 440), transform: `scale(${hub})`}}>
        <Rings F={F} t={K.intel} x={80} y={80} color={GOLD_T} r={110} every={36} until={K.dash + 1} />
        <div style={{width: 160, height: 160, borderRadius: 44, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 20px 50px ${Y}66`}}><Ico d={I_SPARK} size={92} color={BG} sw={1.6} /></div>
      </div>
      <Glass x={90} y={680} w={900} h={640} r={32} style={{opacity: db, transform: `translateY(${(1 - db) * 60}px)`, padding: '34px 40px', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <T size={36} w={600}>All leads</T>
          <T size={26} color={MUTED}>Today · 24</T>
        </div>
        <div style={{height: 1.5, background: LINE, margin: '24px 0 6px'}} />
        {ROWS.map(([nm, sk, sub, [st, sc]], i) => {
          const t = K.dash + 0.15 + i * 0.16;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', borderBottom: i < 4 ? `1.5px solid ${LINE}` : 'none', ...up(F, t, 10, 20)}}>
              <SrcIcon k={sk} size={56} />
              <div style={{flex: 1}}><T size={32} w={600}>{nm}</T><T size={24} color={MUTED} style={{marginTop: 4}}>{sub}</T></div>
              <Chip color={sc} size={24}>{st}</Chip>
            </div>
          );
        })}
      </Glass>
    </AbsoluteFill>
  );
};

/* 6. instant WhatsApp auto-reply */
const Wa = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'wa')[1];
  return (
    <AbsoluteFill>
      <Phone x={220} y={190} w={640} h={1140} bg={WA_BG}>
        <WaChat name="Rahul Patil" ini="RP">
          <Bubble F={F} t={a + 0.15} time="10:02 AM">Hi, Baner मध्ये 2BHK आहे का?</Bubble>
          <Typing F={F} t={K.lagech} until={K.auto} />
          {vis(F, K.auto) && <div style={{alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 8, marginBottom: -8, ...up(F, K.auto, 8, 10)}}>
            <svg viewBox="0 0 24 24" width={24} height={24}><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={GOLD_T} /></svg><T size={22} w={600} color={GOLD_T}>Auto-reply</T>
          </div>}
          <Bubble F={F} t={K.auto} out time="10:02 AM" ticks w={470}>नमस्कार Rahul ji! Sai Realty कडून धन्यवाद. तुमचं budget आणि visit ची वेळ सांगा.</Bubble>
        </WaChat>
      </Phone>
      {vis(F, K.jato) && <div style={{...abs(740, 300), ...popS(F, K.jato)}}><Chip color={C_GREEN} size={30}>Instant</Chip></div>}
    </AbsoluteFill>
  );
};

/* 7. follow-up reminders on the staff phone (lock screen) */
const Notif = ({F, t, icon, color, title, line1, line2}) => !vis(F, t) ? null : (
  <div style={{background: 'rgba(255,255,255,0.92)', borderRadius: 30, padding: '24px 26px', display: 'flex', gap: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
    opacity: io(F, s(t), s(t) + 8), transform: `translateY(${io(F, s(t), s(t) + 12, -50, 0, Easing.out(Easing.back(1.4)))}px)`}}>
    <div style={{width: 70, height: 70, borderRadius: 18, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Ico d={icon} size={40} color={color === Y ? BG : '#fff'} sw={1.8} /></div>
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}><T size={24} w={600} color={MUTED}>{title}</T><T size={22} color={MUTED}>now</T></div>
      <T size={30} w={600} style={{marginTop: 8}}>{line1}</T>
      <T size={26} color={MUTED} style={{marginTop: 6}}>{line2}</T>
    </div>
  </div>
);
const Remind = ({F}) => (
  <AbsoluteFill>
    <Phone x={220} y={190} w={640} h={1140} bg="linear-gradient(180deg, #E9E3F5, #F6EFE2)">
      <Center y={120} style={{width: '100%'}}>
        <T size={26} color={MUTED}>सोमवार, 24 नोव्हेंबर</T>
        <div style={{fontSize: 150, fontWeight: 300, color: TXT, lineHeight: 1, marginTop: 10, letterSpacing: '-0.04em'}}>11:28</div>
      </Center>
      <div style={{...abs(26, 430), right: 26, display: 'flex', flexDirection: 'column', gap: 16}}>
        <Notif F={F} t={K.follow} icon={I_BELL} color={Y} title="FOLLOW-UP" line1="Rahul Patil ला call करा" line2="11:30 AM · Baner 2BHK" />
        <Notif F={F} t={K.reminder} icon={I_CAL} color={C_BLUE} title="SITE VISIT" line1="Sneha Kulkarni · Wakad" line2="आज 4:00 PM" />
      </div>
    </Phone>
  </AbsoluteFill>
);

/* 8. site visits: done / pending, all on one screen */
const VISITS = [['Rahul Patil', 'Sai Heights', '10:30 AM', 1], ['Sneha Kulkarni', 'Green Park', '12:00 PM', 1], ['Amit Shinde', 'Sai Heights', '2:00 PM', 1],
  ['Priya Shah', 'Lake View', '4:00 PM', 0], ['Rohan Joshi', 'Green Park', '5:30 PM', 0]];
const Visits = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'visits')[1];
  const sum = io(F, s(K.screen) - 3, s(K.screen) + 10, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Glass x={70} y={200} w={940} h={1130} r={34} style={{padding: '36px 40px', ...up(F, a + 0.05, 12, 30)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ico d={I_CAL} size={40} color={TXT} sw={1.7} /><T size={36} w={600}>Site visits · आज</T></div>
        <div style={{display: 'flex', gap: 18, marginTop: 28, height: 150 * sum, opacity: sum, overflow: 'hidden'}}>
          {[['Leads', '24', TXT], ['झाली', '3', C_GREEN], ['बाकी', '2', C_ORANGE]].map(([l, v, c]) => (
            <div key={l} style={{flex: 1, borderRadius: 22, border: `1.5px solid ${LINE}`, background: '#FBF8F1', padding: '22px 26px'}}>
              <T size={24} color={MUTED}>{l}</T><T size={56} w={600} color={c} style={{marginTop: 10}}>{v}</T>
            </div>
          ))}
        </div>
        <div style={{height: 1.5, background: LINE, margin: '28px 0 4px'}} />
        {VISITS.map(([nm, pr, tm, done], i) => {
          const t = done ? K.zali + i * 0.14 : K.baki + (i - 3) * 0.14;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 0', borderBottom: i < 4 ? `1.5px solid ${LINE}` : 'none', ...up(F, a + 0.2 + i * 0.08, 10, 16)}}>
              <Ini t={nm.split(' ').map((x) => x[0]).join('')} size={66} />
              <div style={{flex: 1}}><T size={32} w={600}>{nm}</T><T size={24} color={MUTED} style={{marginTop: 4}}>{pr} · {tm}</T></div>
              {vis(F, t) && <div style={popS(F, t)}><Chip color={done ? C_GREEN : C_ORANGE} size={26}>{done ? 'झाली' : 'बाकी'}</Chip></div>}
            </div>
          );
        })}
      </Glass>
    </AbsoluteFill>
  );
};

/* 9. brochure sent on WhatsApp */
const Bldg = ({W = 120}) => (
  <svg viewBox="0 0 60 60" width={W} height={W} fill="none" stroke="#2F6FD0" strokeWidth="1.4" strokeLinejoin="round">
    <path d="M10 54V18l16-8v44M26 22l22 6v26M6 54h48" />{[22, 30, 38, 46].map((y) => <path key={y} d={`M15 ${y}h6M32 ${y + 2}h4M40 ${y + 2}h4`} />)}
  </svg>
);
const Broch = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'broch')[1];
  const prog = io(F, s(K.pathavla), s(K.pathavla) + 14);
  return (
    <AbsoluteFill>
      <Phone x={220} y={190} w={640} h={1140} bg={WA_BG}>
        <WaChat name="Sneha Kulkarni" ini="SK">
          <Bubble F={F} t={a + 0.1} time="4:40 PM">Project चा brochure मिळेल का?</Bubble>
          {vis(F, K.broch) && (
            <div style={{alignSelf: 'flex-end', width: 440, background: WA_BUB, borderRadius: 22, padding: 10, boxShadow: '0 1px 1.5px rgba(0,0,0,0.10)', transform: `scale(${pop(F, K.broch, 13)})`, transformOrigin: '100% 0'}}>
              <div style={{height: 230, borderRadius: 16, background: 'linear-gradient(180deg, #EAF2FF, #F8FBFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <Bldg W={170} />
                <div style={{...abs(18, 18)}}><T size={22} w={600} color="#2F6FD0">SAI HEIGHTS</T></div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: '16px 16px 10px', marginTop: 8}}>
                <div style={{width: 50, height: 60, borderRadius: 8, background: '#E5383B', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box'}}>PDF</div>
                <div style={{flex: 1}}><T size={26} w={600}>Sai Heights Brochure.pdf</T><T size={20} color={MUTED} style={{marginTop: 4}}>12 pages · 4.2 MB</T></div>
                {prog < 1 && vis(F, K.pathavla) && <svg width={44} height={44} viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="3" /><circle cx="22" cy="22" r="18" fill="none" stroke={WA} strokeWidth="3" strokeDasharray={`${113 * prog} 113`} transform="rotate(-90 22 22)" /></svg>}
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 18, color: MUTED, padding: '8px 10px 2px'}}>4:40 PM{prog >= 1 && <DoubleTick size={22} />}</div>
            </div>
          )}
        </WaChat>
      </Phone>
    </AbsoluteFill>
  );
};

/* 10. AI agent calls every new lead within 5 minutes and captures the requirement */
const REQ = [['Budget', '₹60–70 L'], ['Type', '2 BHK'], ['Area', 'Baner'], ['Site visit', 'रविवार, 11 AM']];
const Ai = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'ai')[1];
  const el = io(F, s(K.five), s(K.call), 0, 252, Easing.out(Easing.quad)); // seconds elapsed, ends at 4:12
  const calling = vis(F, K.call);
  return (
    <AbsoluteFill>
      <Glass x={90} y={200} w={900} h={150} r={30} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', ...up(F, K.navin - 0.25, 10, 24)}}>
        <Facebook size={70} />
        <div style={{flex: 1}}><T size={24} color={MUTED}>New lead · 10:15 AM</T><T size={34} w={600} style={{marginTop: 6}}>Priya Shah</T></div>
        <Chip color={C_BLUE} size={26}>New</Chip>
      </Glass>
      <div style={{...abs(90, 400), width: 300, height: 300, ...up(F, K.five - 0.2, 10, 20)}}>
        <svg width={300} height={300} viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="130" fill="#fff" stroke={LINE} strokeWidth="2" />
          <circle cx="150" cy="150" r="130" fill="none" stroke={C_GREEN} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${817 * el / 300} 817`} transform="rotate(-90 150 150)" />
        </svg>
        <div style={{...abs(0, 0), width: 300, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <T size={64} w={500} style={{paddingTop: 10}}>{`${Math.floor(el / 60)}:${String(Math.floor(el % 60)).padStart(2, '0')}`}</T>
          <T size={24} color={MUTED} style={{marginTop: 6}}>5 min च्या आत</T>
        </div>
      </div>
      <Glass x={420} y={400} w={570} h={300} r={30} style={{padding: '34px 36px', ...up(F, a + 0.1, 10, 24)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 76, height: 76, borderRadius: 22, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={I_SPARK} size={46} color={BG} sw={1.6} /></div>
          <div><T size={32} w={600}>AI Agent</T><T size={24} color={calling ? C_GREEN : MUTED} style={{marginTop: 4}}>{calling ? 'Calling Priya…' : 'Ready'}</T></div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 7, height: 90, marginTop: 30}}>
          {Array.from({length: 30}, (_, i) => <div key={i} style={{width: 6, borderRadius: 3, background: calling ? C_GREEN : LINE, height: calling ? 12 + Math.abs(Math.sin(F / 3.1 + i * 0.7) * Math.cos(F / 5 + i * 0.3)) * 74 : 10}} />)}
        </div>
      </Glass>
      <Glass x={90} y={740} w={900} h={590} r={32} style={{padding: '34px 40px', ...up(F, K.req - 0.2, 12, 30)}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <T size={34} w={600}>Requirement</T>
          {vis(F, K.details + 0.6) && <div style={popS(F, K.details + 0.6)}><Chip color={C_GREEN} size={24}>Saved</Chip></div>}
        </div>
        <div style={{height: 1.5, background: LINE, margin: '22px 0 0'}} />
        {REQ.map(([l, v], i) => {
          const t = K.req + 0.1 + i * 0.32, n = Math.round(io(F, s(t), s(t) + 10, 0, v.length, Easing.linear));
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 0', borderBottom: i < 3 ? `1.5px solid ${LINE}` : 'none'}}>
              <T size={30} color={MUTED}>{l}</T>
              <T size={34} w={600}>{F >= s(t) ? v.slice(0, n) : ''}{F >= s(t) && n < v.length && <span style={{color: GOLD_T}}>|</span>}</T>
            </div>
          );
        })}
      </Glass>
    </AbsoluteFill>
  );
};

/* 11. CTA: your office system, then comment LEAD */
const Cta = ({F}) => {
  const a = SCENES.find((x) => x[0] === 'cta')[1];
  const sheet = io(F, s(K.khali) - 6, s(K.khali) + 10, 0, 1, Easing.out(Easing.cubic));
  const typed = 'LEAD'.slice(0, Math.round(io(F, s(K.LEAD), s(K.LEAD) + 10, 0, 4, Easing.linear)));
  const posted = vis(F, K.comment + 0.25);
  return (
    <AbsoluteFill>
      <Center y={230} style={up(F, a + 0.05, 12, 24)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <AppIcon size={110} />
          <div><T size={40} w={600}>तुमचं real estate office</T><T size={26} color={MUTED} style={{marginTop: 6}}>Leads · WhatsApp · Visits · AI calls</T></div>
        </div>
      </Center>
      <div style={{...abs(90, 420), display: 'flex', gap: 18, ...up(F, K.system - 0.1, 12, 24)}}>
        {[[<WhatsApp key="w" size={64} />, 'Auto-reply'], [<Ico key="b" d={I_BELL} size={56} color={TXT} sw={1.6} />, 'Reminders'], [<Ico key="s" d={I_SPARK} size={56} color={TXT} sw={1.6} />, 'AI calls']].map(([ic, l], i) => (
          <div key={i} style={{width: 288, height: 170, borderRadius: 26, background: '#fff', border: `1.5px solid ${LINE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>{ic}<T size={28} w={500}>{l}</T></div>
        ))}
      </div>
      <Glass x={90} y={660} w={900} h={670} r={34} style={{opacity: sheet, transform: `translateY(${(1 - sheet) * 200}px)`, padding: '30px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}><Instagram size={44} /><T size={32} w={600}>Comments</T></div>
        <div style={{height: 1.5, background: LINE, margin: '24px 0 10px'}} />
        {[0, 1].map((i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 0'}}>
            <div style={{width: 60, height: 60, borderRadius: 30, background: 'var(--l-avatar)'}} />
            <div style={{flex: 1}}><div style={{width: 160, height: 14, borderRadius: 7, background: 'rgba(0,0,0,0.10)'}} /><div style={{width: 300 - i * 80, height: 14, borderRadius: 7, background: 'rgba(0,0,0,0.06)', marginTop: 12}} /></div>
            <Ico d={I_HEART} size={34} color={MUTED} sw={1.6} />
          </div>
        ))}
        {posted && (
          <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 0', ...up(F, K.comment + 0.25, 8, 16)}}>
            <Ini t="You" size={60} />
            <div style={{flex: 1}}><T size={22} color={MUTED}>you · now</T><T size={40} w={700} style={{marginTop: 4}}>LEAD</T></div>
            <Ico d={I_HEART} size={34} color={C_RED} sw={1.6} />
          </div>
        )}
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 34, height: 96, borderRadius: 48, border: `1.5px solid ${vis(F, K.LEAD) && !posted ? GOLD_T : LINE}`, display: 'flex', alignItems: 'center', padding: '6px 16px 0 34px', boxSizing: 'border-box'}}>
          <div style={{flex: 1}}>{!posted && typed ? <T size={36} w={700}>{typed}<span style={{color: GOLD_T, opacity: Math.floor(F / 8) % 2}}>|</span></T> : <T size={30} color={MUTED}>Add a comment…</T>}</div>
          <div style={{width: 66, height: 66, borderRadius: 33, background: typed && !posted ? '#0095F6' : 'rgba(0,149,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -6, transform: F >= s(K.comment) && F < s(K.comment) + 5 ? 'scale(0.9)' : 'none'}}><Ico d={I_SEND} size={34} color="#fff" sw={1.8} /></div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => (
  <AbsoluteFill>
    <LeanOutro F={F} at={OUTRO_AT} cta={'Comment "LEAD"'} />
    <Center y={1330} style={up(F, OUTRO_AT + 1.4, 12, 20)}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 999, padding: '20px 42px 14px', border: `1.5px solid ${LINE}`}}>
        <Ico d={I_PHONE} size={46} color={C_GREEN} sw={1.8} />
        <span style={{fontSize: 52, fontWeight: 600, color: TXT, letterSpacing: '0.02em'}}>80109 50380</span>
      </div>
    </Center>
  </AbsoluteFill>
);

/* ---------- main ---------- */
const COMPS = {hook: Hook, src: Src, busy: Busy, late: Late, dash: Dash, wa: Wa, remind: Remind, visits: Visits, broch: Broch, ai: Ai, cta: Cta, outro: Outro};
const Video = () => <LeanVideo theme="light" scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
