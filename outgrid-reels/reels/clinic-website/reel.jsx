/*
 * "If I built your clinic's website" — Outgrid Labs reel, ISO style (shared/iso.jsx), 1080x1920, VO at original speed.
 * Real logos: Google, Google Maps, ChatGPT (OpenAI), WhatsApp (iconify "logos" set -> shared/logos/*.svg).
 * Clinic names, numbers, reviews, slots and chats on screen are illustrative.
 * No headline at the top: captions bottom-left from frame 0; the top only carries the small "// 01 — google" label.
 * WhatsApp number 80109 50380 on screen for the last ~6.8 s (NUM_AT in cues.mjs).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {FPS, s, io, pop, abs, Y, Mark, BRAND} from '../../shared/kit.jsx';
import {INK, MUTE, FAINT, GRN, GRN_D, RED, BLUE, LAT, up, popS, vis, P, Box, FaceL, FaceT, Shadow, Stage, at, Tile, Tree, Person,
  Card, Tag, Plate, Dot, Logo, Ico, IsoVideo} from '../../shared/iso.jsx';
import {Clinic, Bldg, Browser} from './props.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S, NUM_AT} from './cues.mjs';

const TOTAL = s(TOTAL_S);
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const Center = ({y, children, style = {}}) => <div style={{...abs(0, y), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>;
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontSize: size, fontWeight: wt, color, lineHeight: 1.15, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>;
const typed = (F, t0, t1, str) => str.slice(0, Math.round(io(F, s(t0), s(t1), 0, str.length, Easing.linear)));
const Caret = ({F}) => <span style={{color: GRN, opacity: Math.floor(F / 8) % 2}}>|</span>;
const bounce = (F, t) => (F < s(t) ? 0 : pop(F, t, 9));

/* icons (24 grid) */
const I_USER = <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" /></>;
const I_CLOCK = <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>;
const I_PIN = <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>;
const I_DOC = <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>;
const I_BELL = <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>;
const I_CHECK = <path d="M5 12.5l4.5 4.5L19 7.5" />;
const I_CAL = <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>;
const I_PHONE = <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />;
const I_SEARCH = <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>;
const I_STAR = <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z" />;
const Stars = ({n = 5, size = 26}) => <div style={{display: 'flex', gap: 3}}>{Array.from({length: n}, (_, i) => <svg key={i} viewBox="0 0 24 24" width={size} height={size}><path d={'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z'} fill="#F5B301" /></svg>)}</div>;

// 1-2-3 stepper pill (the three upgrades)
const Stepper = ({F, t, active = 0, y = 1210}) => (
  <Center y={y} style={up(F, t, 12, 24)}>
    <div style={{display: 'flex', alignItems: 'center', background: '#fff', border: `3px solid ${INK}`, borderRadius: 999, padding: '12px 18px', boxShadow: `5px 6px 0 ${INK}`}}>
      {[1, 2, 3].map((n) => (
        <React.Fragment key={n}>
          {n > 1 && <div style={{width: 70, borderTop: `3px dashed ${FAINT}`}} />}
          <Dot n={n} size={62} color={n === active ? GRN : '#fff'} style={{color: n === active ? '#fff' : INK, border: `3px solid ${n === active ? GRN : INK}`}} />
        </React.Fragment>
      ))}
    </div>
  </Center>
);

/* ================= scenes ================= */

/* 1. hook: your clinic + its website rising beside it; "just info" gets struck, 3 upgrades teased */
const HK = {x: 520, y: 800, k: 46};
const Hook = ({F}) => {
  const rise = io(F, s(K.web) - 4, s(K.web) + 12, 0, 1, Easing.out(Easing.back(1.3)));
  const lines = io(F, s(K.mahiti), s(K.mahiti) + 10);
  const strike = io(F, s(K.nasti), s(K.nasti) + 8);
  const [tx, ty] = at(HK, 3.2, 0.8, 4.6);
  return (
    <AbsoluteFill>
      <Stage {...HK}>
        <Tile x={-6} y={-6} w={12} d={12} />
        <Clinic x={-4.6} y={-3.2} />
        <Tree x={-5} y={4} /><Tree x={4.8} y={-4.6} /><Tree x={4.6} y={4.4} s={0.8} />
        <Person x={-1.6} y={1.6} c={BLUE} /><Person x={-0.8} y={2.2} c="#F08A3C" head="#5B3A26" />
        <g transform={`translate(0 ${(1 - rise) * 4})`} opacity={rise}>
          <Shadow x={0.6} y={0.6} w={4.6} d={0.3} off={1.2} />
          <Browser x={0.6} y={0.9} w={4.6} h={3.8}>
            {lines > 0 && [0, 1, 2].map((i) => <FaceL key={i} x={1.0} y={0.901} z={2.6 - i * 0.6} w={(i === 0 ? 3.4 : 2.6 - i * 0.4) * lines} h={0.28} fill={i === 0 ? INK : '#D6D1C6'} />)}
          </Browser>
        </g>
      </Stage>
      {vis(F, K.mahiti) && <div style={{...abs(tx - 100, ty - 150), ...popS(F, K.mahiti)}}>
        <div style={{position: 'relative'}}>
          <Tag size={34}><Ico d={I_DOC} size={36} sw={2.2} />फक्त माहिती</Tag>
          <div style={{...abs(14, 34), height: 5, borderRadius: 3, background: RED, width: `${strike * 92}%`}} />
        </div>
      </div>}
      <Stepper F={F} t={K.nasti + 0.3} y={1180} />
    </AbsoluteFill>
  );
};

/* 2. the typical clinic website: name, timing, address... and it just lies there */
const Typical = ({F}) => {
  const a = sc('typical');
  const fall = io(F, s(K.padun) - 2, s(K.padun) + 14, 0, 1, Easing.in(Easing.quad));
  const rows = [[I_USER, 'Dr. S. Patil, BDS', K.doc], [I_CLOCK, '10 AM – 8 PM', K.time], [I_PIN, 'Baner, Pune', K.addr]];
  return (
    <AbsoluteFill>
      <div style={{...abs(150, 240), width: 780, height: 860, perspective: 1400}}>
        <div style={{width: '100%', height: '100%', transformOrigin: '50% 100%', transform: `rotateX(${fall * 72}deg)`, filter: `grayscale(${fall})`, ...up(F, a + 0.05, 12, 30)}}>
          <Card x={0} y={0} w={780} h={860}>
            <div style={{height: 70, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px'}}>
              {['#FF6159', '#FFBD2E', '#28C941'].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />)}
              <div style={{flex: 1, marginLeft: 16, height: 40, borderRadius: 20, background: '#F1EFEA', display: 'flex', alignItems: 'center', padding: '4px 20px 0', fontSize: 24, fontWeight: 500, color: MUTE}}>drpatilclinic.com</div>
            </div>
            <div style={{padding: '40px 46px'}}>
              <T size={50} w={700}>Dr. Patil Dental Clinic</T>
              <div style={{height: 3, background: INK, width: 120, marginTop: 18}} />
              {rows.map(([ic, txt, t]) => (
                <div key={txt} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 40, ...up(F, t, 10, 20)}}>
                  <div style={{width: 76, height: 76, borderRadius: 18, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={ic} size={40} /></div>
                  <T size={38} w={500}>{txt}</T>
                </div>
              ))}
              <div style={{marginTop: 40, height: 150, borderRadius: 18, border: `3px dashed ${FAINT}`, opacity: io(F, s(K.bas), s(K.bas) + 8)}} />
            </div>
          </Card>
        </div>
      </div>
      {fall > 0.6 && [0, 1, 2].map((i) => {
        const t = K.padun + 0.4 + i * 0.25; const p = io(F, s(t), s(t) + 30);
        return vis(F, t) ? <div key={i} style={{...abs(700 + i * 50, 880 - p * 160 - i * 30), fontSize: 44 + i * 10, fontWeight: 700, color: MUTE, opacity: 1 - p}}>z</div> : null;
      })}
      <div style={{...abs(0, 1150), width: 1080, display: 'flex', justifyContent: 'center', gap: 30}}>
        {[['Calls', K.kaam], ['Bookings', K.nahi8]].map(([l, t]) => vis(F, t) && <div key={l} style={popS(F, t)}><Tag size={36} style={{color: RED, borderColor: RED, boxShadow: `5px 6px 0 ${RED}`}}>{l} · 0</Tag></div>)}
      </div>
    </AbsoluteFill>
  );
};

/* 3. Google: a block of four clinics; search, and yours climbs to #1 */
const GS = {x: 540, y: 860, k: 36};
const LOTS = [[-6.4, -6.4, 3.6, '#D8C6A8'], [1.2, -6.2, 2.6, '#C6D0DA'], [-6.2, 1.2, 3.0, '#E2D0BE']];
const Google = ({F}) => {
  const q1 = 'dentist near me', q2 = 'best skin clinic in pune';
  const txt = F < s(K.best) ? typed(F, K.dentist, K.kinva, q1) : typed(F, K.best, K.pune + 0.3, q2);
  const won = vis(F, K.top);
  const lift = bounce(F, K.top);
  const ranks = won ? [2, 3, 4] : [1, 2, 3];
  return (
    <AbsoluteFill>
      <Stage {...GS}>
        <Tile x={-7.5} y={-7.5} w={15} d={15} pad={false} />
        <FaceT x={-7.5} y={-0.9} z={0.002} w={15} d={1.8} fill="#57585C" />
        <FaceT x={-0.9} y={-7.5} z={0.003} w={1.8} d={15} fill="#57585C" />
        <FaceT x={-7.5} y={-0.04} z={0.004} w={15} d={0.08} fill="none" stroke="rgba(255,255,255,0.8)" dash="8 10" />
        {[[-7, -7], [1.2, -7], [-7, 1.2], [1.2, 1.2]].map(([x, y], i) => <FaceT key={i} x={x + 0.3} y={y + 0.3} z={0.002} w={5.2} d={5.2} fill="#E9DBB8" stroke="rgba(120,90,50,0.4)" dash="5 6" />)}
        {LOTS.map(([x, y, h, c], i) => <Bldg key={i} x={x + 0.5} y={y + 0.5} w={3} d={3} h={h} c={c} />)}
        <Clinic x={1.8} y={1.8} w={3.6} d={3} H={3.2} />
        <Tree x={-1.6} y={-6.6} /><Tree x={6.5} y={-1.6} s={0.8} /><Tree x={-6.6} y={-1.6} s={0.9} /><Tree x={1.6} y={6.4} s={0.8} />
      </Stage>
      {LOTS.map(([x, y, h], i) => {
        const [px, py] = at(GS, x + 2, y + 2, h + 1.4);
        return <div key={i} style={{...abs(px - 50, py - 40), opacity: won ? 0.55 : 1, transition: 'none'}}><Tag size={30}>#{ranks[i]}</Tag></div>;
      })}
      {(() => {
        const [px, py] = at(GS, 3.6, 3.3, 3.2 + 1.7);
        return (
          <div style={{...abs(px - 110, py - 60 - lift * 40)}}>
            {won ? <div style={{transform: `scale(${0.6 + 0.4 * lift})`}}><Plate size={38} color={GRN}><Logo src="google-g.svg" size={38} style={{background: '#fff', borderRadius: 19, padding: 4}} />#1 · तुमचं</Plate></div>
              : <Tag size={30} style={{color: RED, borderColor: RED, boxShadow: `5px 6px 0 ${RED}`}}>#9</Tag>}
          </div>
        );
      })()}
      <Center y={250} style={up(F, sc('google') + 0.05, 12, 24)}>
        <div style={{width: 820, height: 104, background: '#fff', border: `3px solid ${INK}`, borderRadius: 52, boxShadow: `6px 8px 0 ${INK}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', boxSizing: 'border-box'}}>
          <Logo src="google-g.svg" size={50} />
          <T size={38} w={500} style={{flex: 1, paddingTop: 6}}>{txt || <span style={{color: FAINT}}>Search</span>}{F >= s(K.dentist) && F < s(K.search) && <Caret F={F} />}</T>
          <div style={{transform: F >= s(K.search) && F < s(K.search) + 5 ? 'scale(0.85)' : 'none'}}><Ico d={I_SEARCH} size={44} color={BLUE} sw={2.6} /></div>
        </div>
      </Center>
      <Stepper F={F} t={sc('google')} active={1} y={1210} />
    </AbsoluteFill>
  );
};

/* 4. Google build: a page per treatment, fast load, Google Business Profile */
const BS = {x: 540, y: 820, k: 40};
const Build = ({F}) => {
  const pages = [['Root canal', K.pratyek], ['Braces', K.treat], ['Teeth whitening', K.page]];
  const needle = io(F, s(K.fast) - 4, s(K.load) + 6, -80, 62, Easing.out(Easing.back(1.4)));
  const con = io(F, s(K.connect), s(K.connect) + 12);
  const [cx, cy] = at(BS, -0.3, 0.5, 3);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{...abs(0, 0)}}>
        {[[290, 560], [790, 560], [540, 1040]].map(([x, y], i) => <path key={i} d={`M${x} ${y} L${cx} ${cy}`} stroke={INK} strokeWidth="3" strokeDasharray="8 10" opacity={i === 2 ? con : io(F, s(i ? K.fast : K.pratyek), s(i ? K.fast : K.pratyek) + 10)} />)}
      </svg>
      <Stage {...BS}>
        <Tile x={-4} y={-4} w={8} d={8} />
        <Clinic x={-2.1} y={-1.6} />
        <Tree x={3} y={-3} s={0.8} /><Tree x={-3.2} y={3} s={0.8} />
      </Stage>
      <Card x={60} y={230} w={460} h={330} style={up(F, K.pratyek - 0.2, 10, 24)}>
        <div style={{padding: '24px 28px'}}>
          <T size={26} w={500} color={MUTE} style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>Treatment pages</T>
          {pages.map(([p, t]) => (
            <div key={p} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, ...up(F, t, 8, 16)}}>
              <Ico d={I_DOC} size={36} color={GRN} /><T size={32}>{p}</T>
            </div>
          ))}
        </div>
      </Card>
      <Card x={560} y={230} w={460} h={330} style={up(F, K.fast - 0.2, 10, 24)}>
        <div style={{padding: '24px 28px'}}>
          <T size={26} w={500} color={MUTE} style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>Page speed</T>
          <svg width={400} height={200} viewBox="0 0 400 200" style={{marginTop: 4}}>
            <path d="M60 180a140 140 0 0 1 280 0" fill="none" stroke="#EAE6DC" strokeWidth="22" />
            <path d="M60 180a140 140 0 0 1 280 0" fill="none" stroke={GRN} strokeWidth="22" strokeDasharray={`${440 * io(needle, -80, 62)} 440`} />
            <g transform={`rotate(${needle} 200 180)`}><path d="M200 180V64" stroke={INK} strokeWidth="6" strokeLinecap="round" /></g>
            <circle cx="200" cy="180" r="12" fill={INK} />
          </svg>
          {vis(F, K.load) && <div style={{...abs(330, 220), ...popS(F, K.load)}}><Plate size={30} color={GRN}>0.8 s</Plate></div>}
        </div>
      </Card>
      <Card x={160} y={1040} w={760} h={150} style={up(F, K.gbp - 0.2, 10, 24)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, height: '100%', padding: '0 30px'}}>
          <Logo src="google-maps-pin.svg" size={70} />
          <div style={{flex: 1}}><T size={34}>Smile Dental Clinic</T><div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6}}><T size={26} w={500} color={MUTE}>4.8</T><Stars size={24} /><T size={24} w={500} color={MUTE}>· Google Business</T></div></div>
          {vis(F, K.connect) && <div style={popS(F, K.connect)}><Plate size={26} color={GRN}><Ico d={I_CHECK} size={26} color="#fff" sw={3} />Linked</Plate></div>}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* 5. ChatGPT: people move from Google to ChatGPT */
const GP = {x: 540, y: 900, k: 40};
const PEOPLE = [[-4.6, 3.0, BLUE], [-3.2, 4.4, '#F08A3C'], [-2.6, 2.8, '#9B5DE5'], [-4.2, 5.0, GRN], [-1.9, 4.6, '#E5484D'], [-3.4, 2.0, '#2A9D8F']];
const Gpt = ({F}) => {
  const [gx, gy] = at(GP, -3.5, 3.5, 2.6), [ox, oy] = at(GP, 3.5, -3.5, 2.6);
  const off = io(F, s(K.gugalvar), s(K.gugalvar) + 10);
  return (
    <AbsoluteFill>
      <Stage {...GP}>
        <Tile x={-6} y={1} w={5} d={5} pad={false} top="#E3E0D8" />
        <Tile x={1} y={-6} w={5} d={5} />
        {PEOPLE.map(([x, y, c], i) => {
          const t = K.gugalvar + 0.1 + i * 0.22, p = io(F, s(t), s(t) + 16, 0, 1, Easing.inOut(Easing.quad));
          const X = x + 7 * p, Yy = y - 7 * p, z = Math.sin(p * Math.PI) * 2.2;
          return <Person key={i} x={X} y={Yy} z={z} c={c} />;
        })}
      </Stage>
      <div style={{...abs(gx - 80, gy - 120), opacity: 1 - 0.5 * off}}>
        <Card x={0} y={0} w={160} h={160} r={36} style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `grayscale(${off})`}}><Logo src="google-g.svg" size={90} /></Card>
        {off > 0 && <div style={{...abs(118, -24), transform: `scale(${off})`}}><Dot n="✕" size={56} color={RED} /></div>}
      </div>
      <div style={{...abs(ox - 90, oy - 140), ...popS(F, K.gpt)}}>
        <Card x={0} y={0} w={180} h={180} r={40} style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `9px 11px 0 ${GRN}`}}><Logo src="openai.svg" size={104} /></Card>
      </div>
      {vis(F, K.gpt) && <Center y={1060} style={up(F, K.gpt + 0.1, 10, 20)}><Plate size={36} color={INK}>ChatGPT</Plate></Center>}
      <Stepper F={F} t={sc('gpt')} active={2} y={250} />
    </AbsoluteFill>
  );
};

/* 6. the question people ask ChatGPT */
const Ask = ({F}) => {
  const a = sc('ask');
  const m1 = 'माझ्या एरियामध्ये चांगला डॉक्टर कोणता?', m2 = 'तुम्ही कोणाला सजेस्ट कराल?';
  const t1 = typed(F, K.q1, K.q1e + 0.4, m1), t2 = typed(F, K.q2, K.q2 + 1.2, m2);
  const think = vis(F, K.ai);
  return (
    <AbsoluteFill>
      <Card x={90} y={230} w={900} h={1020} style={up(F, a + 0.05, 12, 30)}>
        <div style={{height: 100, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 34px'}}>
          <Logo src="openai.svg" size={50} /><T size={36}>ChatGPT</T>
        </div>
        <div style={{padding: '40px 34px', display: 'flex', flexDirection: 'column', gap: 26}}>
          {t1 && <div style={{alignSelf: 'flex-end', maxWidth: 640, background: '#F1EFEA', borderRadius: 30, padding: '24px 30px 16px', fontSize: 38, fontWeight: 500, lineHeight: 1.3, ...LAT}}>{t1}{F < s(K.q1e + 0.4) && <Caret F={F} />}</div>}
          {t2 && <div style={{alignSelf: 'flex-end', maxWidth: 640, background: '#F1EFEA', borderRadius: 30, padding: '24px 30px 16px', fontSize: 38, fontWeight: 500, lineHeight: 1.3, ...LAT}}>{t2}</div>}
          {think && <div style={{display: 'flex', gap: 20, marginTop: 10, ...up(F, K.ai, 8, 14)}}>
            <div style={{width: 64, height: 64, borderRadius: 32, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Logo src="openai.svg" size={36} /></div>
            <div style={{flex: 1, paddingTop: 12}}>
              {F < s(K.opinion) ? <div style={{display: 'flex', gap: 10, paddingTop: 10}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: INK, opacity: 0.25 + 0.75 * Math.abs(Math.sin((F + i * 6) / 7))}} />)}</div>
                : [520, 600, 420].map((wd, i) => <div key={i} style={{width: wd * io(F, s(K.opinion) + i * 3, s(K.opinion) + i * 3 + 10), height: 20, borderRadius: 10, background: '#E3DFD6', marginBottom: 18}} />)}
            </div>
          </div>}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* 7. website structure (FAQ, treatment details, reviews) -> ChatGPT recommends you */
const SS = {x: 580, y: 1130, k: 44};
const SLABS = [['FAQ', '#FFC52E', 'faq'], ['Treatment details', '#F5F2EA', 'treat2'], ['Patient reviews', '#5BBF7A', 'review']];
const Struct = ({F}) => (
  <AbsoluteFill>
    <Stage {...SS}>
      <Shadow x={-2.6} y={-2.6} w={5.2} d={5.2} off={1.2} op={io(F, s(K.faq), s(K.faq) + 8)} />
      {SLABS.map(([, c, k], i) => {
        const t = K[k]; if (!vis(F, t)) return null;
        const drop = io(F, s(t), s(t) + 9, 5, 0, Easing.in(Easing.quad));
        return <Box key={i} x={-2.6} y={-2.6} z={i * 1.6 + drop} w={5.2} d={5.2} h={1.45} c={c} top={i === 2 ? '#7CD596' : undefined} />;
      })}
    </Stage>
    {SLABS.map(([l, , k], i) => {
      const t = K[k]; const [px, py] = at(SS, -2.6, 2.6, i * 1.6 + 0.75);
      return vis(F, t + 0.2) && <div key={l} style={{...abs(px - 400, py - 34), width: 380, display: 'flex', justifyContent: 'flex-end', ...popS(F, t + 0.2)}}><Tag size={30}>{i === 2 && <Stars n={1} size={28} />}{l}</Tag></div>;
    })}
    {vis(F, K.recommend - 0.1) && (
      <Card x={90} y={250} w={900} h={290} style={{boxShadow: `9px 11px 0 ${GRN}`, ...up(F, K.recommend - 0.1, 10, 30)}}>
        <div style={{padding: '30px 34px', display: 'flex', gap: 22}}>
          <div style={{width: 70, height: 70, borderRadius: 35, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Logo src="openai.svg" size={40} /></div>
          <div>
            <T size={32} w={500} style={{whiteSpace: 'normal', lineHeight: 1.35}}>I'd recommend <b style={{fontWeight: 700}}>Smile Dental Clinic</b>, Baner.</T>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}><Stars size={28} /><T size={28} w={500} color={MUTE}>4.8 · 126 reviews</T></div>
            <div style={{marginTop: 16}}><Plate size={26} color={GRN}><Ico d={I_CHECK} size={26} color="#fff" sw={3} />Recommended</Plate></div>
          </div>
        </div>
      </Card>
    )}
  </AbsoluteFill>
);

/* 8. appointment booking on the website */
const SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '4:00', '4:30', '5:00', '6:00'];
const Book = ({F}) => {
  const pick = vis(F, K.slot), booked = vis(F, K.book);
  const cur = io(F, s(K.slot) - 10, s(K.slot), 0, 1, Easing.inOut(Easing.quad)), cur2 = io(F, s(K.book) - 8, s(K.book), 0, 1, Easing.inOut(Easing.quad));
  const hx = 820 - 200 * cur, hy = 1120 - 330 * cur + 330 * cur2;
  return (
    <AbsoluteFill>
      <Stepper F={F} t={sc('book')} active={3} y={240} />
      <Card x={110} y={400} w={860} h={830} style={up(F, K.appt - 0.15, 12, 30)}>
        <div style={{padding: '34px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ico d={I_CAL} size={44} /><T size={40}>Book appointment</T></div>
          <div style={{display: 'flex', gap: 14, marginTop: 30}}>
            {[['Mon', 24], ['Tue', 25], ['Wed', 26], ['Thu', 27], ['Fri', 28]].map(([d, n], i) => (
              <div key={d} style={{flex: 1, height: 110, borderRadius: 18, border: `3px solid ${INK}`, background: i === 1 ? INK : '#fff', color: i === 1 ? '#fff' : INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: 24, fontWeight: 500}}>{d}</div><div style={{fontSize: 38, fontWeight: 700}}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 30}}>
            {SLOTS.map((t, i) => {
              const sel = i === 3 && pick, off = i === 1 || i === 6;
              return <div key={t} style={{height: 84, borderRadius: 16, border: `3px solid ${off ? FAINT : INK}`, background: sel ? Y : '#fff', color: off ? FAINT : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 600, paddingTop: 6, boxSizing: 'border-box',
                transform: sel ? `scale(${0.92 + 0.08 * pop(F, K.slot, 10)})` : 'none', textDecoration: off ? 'line-through' : 'none'}}>{t}</div>;
            })}
          </div>
          <div style={{marginTop: 34, height: 96, borderRadius: 48, background: booked ? GRN : INK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 36, fontWeight: 700, paddingTop: 6, boxSizing: 'border-box',
            transform: F >= s(K.book) - 3 && F < s(K.book) + 3 ? 'scale(0.96)' : 'none'}}>
            {booked ? <><Ico d={I_CHECK} size={40} color="#fff" sw={3} />Booked · Tue 11:30</> : 'Book slot'}
          </div>
        </div>
      </Card>
      {F >= s(K.slot) - 12 && F < s(K.book) + 20 && (
        <svg viewBox="0 0 24 24" width={70} height={70} style={{...abs(hx, hy)}}><path d="M8 3v11l-3-2-1.5 1.5L9 20h9l1.5-7.5-6.5-1.5V3a2.5 2.5 0 0 0-5 0z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /></svg>
      )}
    </AbsoluteFill>
  );
};

/* 9. WhatsApp confirmation + reminder */
const WaBub = ({F, t, children, time}) => !vis(F, t) ? null : (
  <div style={{alignSelf: 'flex-start', maxWidth: 520, background: '#fff', borderRadius: 24, padding: '20px 24px 10px', border: `2.5px solid ${INK}`, transform: `scale(${pop(F, t, 12)})`, transformOrigin: '0 0'}}>
    {children}
    <div style={{fontSize: 20, color: MUTE, textAlign: 'right', marginTop: 6}}>{time}</div>
  </div>
);
const Wa = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(230, 210), width: 620, height: 1080, borderRadius: 70, background: '#fff', border: `4px solid ${INK}`, boxShadow: `10px 12px 0 ${INK}`, overflow: 'hidden', ...up(F, sc('wa') + 0.05, 12, 30)}}>
      <div style={{height: 160, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'flex-end', gap: 16, padding: '0 30px 24px', boxSizing: 'border-box'}}>
        <div style={{width: 64, height: 64, borderRadius: 32, background: GRN, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={<path d="M12 5v14M5 12h14" />} size={36} color="#fff" sw={4} /></div>
        <div style={{flex: 1}}><T size={30}>Smile Dental Clinic</T><T size={22} w={500} color={MUTE} style={{marginTop: 4}}>Business account</T></div>
        <Logo src="whatsapp.svg" size={52} />
      </div>
      <div style={{height: '100%', background: '#EFEAE2', padding: '34px 26px', display: 'flex', flexDirection: 'column', gap: 24}}>
        <WaBub F={F} t={K.wa} time="10:02 AM">
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Ico d={I_CHECK} size={34} color={GRN} sw={3} /><T size={30} color={GRN}>Appointment confirmed</T></div>
          <T size={28} w={500} style={{marginTop: 10, whiteSpace: 'normal', lineHeight: 1.35}}>Tue, 25 Nov · 11:30 AM<br />Smile Dental Clinic, Baner</T>
        </WaBub>
        <WaBub F={F} t={K.reminder} time="Mon 6:00 PM">
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Ico d={I_BELL} size={34} color="#C98B00" sw={2.4} /><T size={30} color="#B77F00">Reminder</T></div>
          <T size={28} w={500} style={{marginTop: 10, whiteSpace: 'normal', lineHeight: 1.35}}>उद्या 11:30 AM ला तुमची appointment आहे.</T>
        </WaBub>
      </div>
    </div>
  </AbsoluteFill>
);

/* 10. fewer no-shows, lighter reception phone */
const RS = {x: 560, y: 1000, k: 44};
const BARS = [18, 17, 19, 18, 8, 5];
const Noshow = ({F}) => {
  const dn = io(F, s(K.kami36), s(K.kami36) + 14, 0, 1, Easing.out(Easing.cubic));
  const calm = vis(F, K.kami38);
  const ring = vis(F, K.recep) && !calm;
  const [phx, phy] = at(RS, 0.6, -0.2, 1.4);
  return (
    <AbsoluteFill>
      <Card x={90} y={230} w={900} h={430} style={up(F, sc('noshow') + 0.05, 12, 30)}>
        <div style={{padding: '28px 36px'}}>
          <T size={26} w={500} color={MUTE} style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>No-shows / month</T>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, height: 260, marginTop: 30}}>
            {BARS.map((v, i) => {
              const hv = i < 4 ? v : 18 + (v - 18) * dn;
              return <div key={i} style={{flex: 1, height: hv * 13, borderRadius: 10, border: `3px solid ${INK}`, background: i < 4 ? '#F1B5B7' : dn > 0.3 ? '#8FD4A4' : '#F1B5B7'}} />;
            })}
          </div>
        </div>
      </Card>
      <Stage {...RS}>
        <Tile x={-3.6} y={-3.6} w={7.2} d={7.2} />
        <Person x={-0.4} y={-1.6} c="#9B5DE5" head="#6B4430" />
        <Box x={-2} y={-0.6} w={4} d={1.4} h={1.3} c="#C9A87C" />
        <Box x={0.3} y={-0.4} w={0.8} d={0.6} h={0.14} z={1.3} c="#3A3A3E" />
        <Box x={-1.4} y={-0.4} w={1.2} d={0.8} h={0.05} z={1.3} c="#FFFFFF" />
      </Stage>
      {ring && [0, 1].map((i) => <div key={i} style={{...abs(phx - 40 - i * 26, phy - 70 - i * 26), width: 80 + i * 52, height: 80 + i * 52, borderRadius: '50%', border: `3px solid ${RED}`, opacity: 0.4 + 0.6 * Math.abs(Math.sin(F / 4 + i))}} />)}
      {vis(F, K.bhar) && <div style={{...abs(phx + 70, phy - 160), ...popS(F, calm ? K.kami38 : K.bhar)}}>
        <Tag size={32} style={calm ? {color: GRN, borderColor: GRN, boxShadow: `5px 6px 0 ${GRN}`} : {color: RED, borderColor: RED, boxShadow: `5px 6px 0 ${RED}`}}><Ico d={I_PHONE} size={32} color={calm ? GRN : RED} />{calm ? '12 calls / day' : '40 calls / day'}</Tag>
      </div>}
    </AbsoluteFill>
  );
};

/* 11. not a visiting card: a 24-hour sales machine */
const MS = {x: 520, y: 930, k: 44};
const Machine = ({F}) => {
  const flip = io(F, s(K.nahi39), s(K.nahi39) + 10, 0, 1, Easing.in(Easing.cubic));
  const mach = io(F, s(K.nahi39) + 6, s(K.nahi39) + 20, 0, 1, Easing.out(Easing.back(1.3)));
  const run = vis(F, K.barobar);
  const [hx, hy] = at(MS, 0, 0, 4.4);
  return (
    <AbsoluteFill>
      {flip < 1 && <div style={{...abs(240, 520), width: 600, height: 340, perspective: 1200, ...up(F, sc('machine') + 0.05, 12, 30)}}>
        <div style={{width: '100%', height: '100%', transform: `rotateY(${flip * 90}deg) scale(${1 - 0.3 * flip})`}}>
          <Card x={0} y={0} w={600} h={340}>
            <div style={{padding: '40px 44px'}}>
              <T size={46} w={700}>Dr. S. Patil</T><T size={30} w={500} color={MUTE} style={{marginTop: 8}}>Dentist · BDS</T>
              <div style={{height: 3, background: INK, width: 90, margin: '26px 0'}} />
              <T size={28} w={500}>Baner, Pune · 10 AM – 8 PM</T>
            </div>
          </Card>
        </div>
      </div>}
      {mach > 0 && <Stage {...MS} style={{opacity: Math.min(1, mach * 1.5)}}>
        <g transform={`translate(0 ${(1 - mach) * 3})`}>
          <Tile x={-5} y={-4} w={11} d={8} />
          <Box x={3.2} y={-1} w={4.6} d={1.4} h={0.5} c="#4A4B50" />
          {run && Array.from({length: 4}, (_, i) => {
            const p = ((F - s(K.barobar)) / 40 + i / 4) % 1;
            return <Box key={i} x={1.8 + p * 5.4} y={-0.8} z={0.5} w={0.9} d={0.9} h={0.5} c="#FFFFFF" top="#8FD4A4" />;
          })}
          <Shadow x={-2.4} y={-2} w={4.4} d={3.6} off={1.6} />
          <Box x={-2.4} y={-2} w={4.4} d={3.6} h={3.4} c="#FFC52E" />
          <Box x={-1.3} y={-1.2} z={3.4} w={2.2} d={1.8} h={0.9} c="#2F3034" />
          <FaceL x={-1.6} y={1.6} z={0.8} w={2.6} h={1.8} fill="#2F3034" />
          {[0, 1, 2].map((i) => <FaceL key={i} x={-1.3 + i * 0.75} y={1.601} z={1.25} w={0.5} h={0.9} fill={run && Math.floor(F / 6 + i) % 3 === 0 ? '#5BBF7A' : '#4A4B50'} />)}
        </g>
      </Stage>}
      {vis(F, K.h24) && <div style={{...abs(hx - 140, hy - 170), ...popS(F, K.h24)}}><Tag size={36}><Ico d={I_CLOCK} size={38} />24 × 7</Tag></div>}
      {vis(F, K.sales) && <Center y={1180} style={popS(F, K.sales, 10)}><Plate size={40} color={GRN_D}>Sales machine</Plate></Center>}
    </AbsoluteFill>
  );
};

/* 12. CTA */
const CS = {x: 540, y: 820, k: 44};
const Cta = ({F}) => {
  const [px, py] = at(CS, -0.2, -0.2, 4.2);
  return (
    <AbsoluteFill>
      <Stage {...CS}>
        <Tile x={-5} y={-5} w={10} d={10} />
        <Clinic x={-2.1} y={-1.6} />
        <Tree x={3.6} y={-3.6} s={0.8} /><Tree x={-3.8} y={3.6} s={0.8} />
        <Person x={2.2} y={2.6} c={BLUE} />
      </Stage>
      <div style={{...abs(px + 40, py - 190), ...popS(F, K.system)}}>
        <Card x={0} y={0} w={150} h={150} r={34} style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo src="whatsapp.svg" size={92} /></Card>
      </div>
    </AbsoluteFill>
  );
};

const Outro = ({F}) => {
  const m = pop(F, OUTRO_AT + 0.05, 11);
  return (
    <AbsoluteFill>
      <Center y={300}><div style={{transform: `scale(${m})`}}><Mark size={220} color={INK} /></div></Center>
      <Center y={600} style={up(F, OUTRO_AT + 0.3, 12, 30)}>
        <div style={{...BRAND, fontSize: 112, fontWeight: 700, color: INK, letterSpacing: '-0.02em'}}>Outgrid Labs</div>
        <div style={{width: 180, height: 12, background: Y, marginTop: 26, borderRadius: 6}} />
        <div style={{fontSize: 40, fontWeight: 500, color: MUTE, marginTop: 28}}>@outgridlabs</div>
      </Center>
    </AbsoluteFill>
  );
};

// WhatsApp number: overlay outside scene transitions so it stays put across the CTA -> outro cut
const NumberCard = ({F}) => !vis(F, NUM_AT) ? null : (
  <div style={{...abs(0, F >= s(OUTRO_AT) ? 1060 : 1120), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, NUM_AT, 11)}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 26, background: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '24px 46px 20px 30px', boxShadow: `9px 11px 0 ${GRN}`}}>
      <Logo src="whatsapp.svg" size={96} />
      <div>
        <div style={{fontSize: 30, fontWeight: 500, color: MUTE, ...LAT}}>WhatsApp करा</div>
        <div style={{fontSize: 84, fontWeight: 700, color: INK, letterSpacing: '0.01em', lineHeight: 1.05}}>80109 50380</div>
      </div>
    </div>
  </div>
);

/* ---------- main ---------- */
const COMPS = {hook: Hook, typical: Typical, google: Google, build: Build, gpt: Gpt, ask: Ask, struct: Struct, book: Book, wa: Wa, noshow: Noshow, machine: Machine, cta: Cta, outro: Outro};
const LABELS = {hook: '// clinic website', typical: '// typical website', google: '// 01 — google', build: '// 01 — google', gpt: '// 02 — chatgpt', ask: '// 02 — chatgpt', struct: '// 02 — chatgpt',
  book: '// 03 — booking', wa: '// 03 — booking', noshow: '// 03 — booking', machine: '// 24 × 7', cta: '// outgrid labs'};
const NumWrap = () => <NumberCard F={useCurrentFrame()} />;
const Video = () => <IsoVideo scenes={SCENES} comps={COMPS} labels={LABELS} chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} overlay={<NumWrap />} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
