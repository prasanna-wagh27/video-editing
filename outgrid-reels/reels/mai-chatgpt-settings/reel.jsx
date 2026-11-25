/*
 * "Change these 3 ChatGPT settings" — Marathi AI Institute reel, MAI style (shared/mai.jsx), 1080x1920, VO at original speed.
 * Phone = realistic iPhone (true proportions, thin titanium frame, Dynamic Island) with ChatGPT iOS settings screens (./iphone.jsx).
 * The camera pushes in on the row being tapped so the real-size UI stays readable.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs} from '../../shared/kit.jsx';
import {INK, RED, BLUE, SKY, MUTE, FAINT, YEL, GREEN, SANS, SERIF, MONO, LW, up, popS, vis,
  HShadow, Panel, Pill, StepBadge, Cursor, Logo, Ico, MaiMark, MaiVideo} from '../../shared/mai.jsx';
import {IPhone, phoneH, phonePt, phoneInset, SW, SH, UI, Tx, Sf, SFI, Tap, hlAt, Nav, Toggle,
  ChatHome, Composer, UserMsg, BotMsg, Sidebar, SettingsScreen, PersScreen, CIScreen, MemoryScreen, DataScreen, ImproveScreen} from './iphone.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S} from './cues.mjs';

const TOTAL = s(TOTAL_S);
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontFamily: SANS, fontSize: size, fontWeight: wt, color, lineHeight: 1.2, whiteSpace: 'nowrap', letterSpacing: '-0.015em', ...style}}>{children}</div>;
const Serif = ({size = 40, color = RED, children, style = {}}) => <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.1, ...style}}>{children}</span>;
const swing = (F, t, amp = 8) => (F < s(t) ? 0 : amp * Math.exp(-(F - s(t)) / 22) * Math.sin((F - s(t)) / 4));
const SEG = new Intl.Segmenter('mr', {granularity: 'grapheme'});
const typed = (F, t0, t1, str) => { const g = [...SEG.segment(str)].map((x) => x.segment); return g.slice(0, Math.round(io(F, s(t0), s(t1), 0, g.length, Easing.linear))).join(''); };
const ramp = (F, t, d = 6, a = 0, b = 1) => io(F, s(t), s(t) + d, a, b, Easing.inOut(Easing.quad));

/* ---------- phone placement + camera ---------- */
const PW = 600, PH = phoneH(PW), PX = 240, PY = 520, KP = phonePt(PW), PI = phoneInset(PW);
const C2 = (x, y) => [PX + PI + x * KP, PY + PI + y * KP];   // screen pt -> canvas px
const FY = 1010;
const Cam = ({F, keys = [], children}) => {
  let k = 1, cx = 540, cy = FY;
  keys.forEach(([t, z, [x, y]]) => { const p = io(F, s(t), s(t) + 16, 0, 1, Easing.inOut(Easing.cubic)); k += (z - k) * p; cx += (x - cx) * p; cy += (y - cy) * p; });
  return (
    <AbsoluteFill style={{maskImage: 'linear-gradient(to bottom, transparent 420px, #000 520px)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 420px, #000 520px)'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${540 - cx * k}px, ${FY - cy * k}px) scale(${k})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const HOME = [1, [540, FY]];
const Phone = ({F, t0, children}) => {
  const rise = t0 === undefined ? 0 : io(F, s(t0), s(t0) + 16, 120, 0, Easing.out(Easing.cubic));
  return (
    <div style={{...abs(PX, PY + rise)}}>
      <HShadow x={46} y={70} w={PW} h={PH} r={90} op={0.5} />
      <IPhone w={PW}>{children}</IPhone>
    </div>
  );
};

/* ---------- outline vectors ---------- */
const Face = ({size = 200, skin = '#F2C29A', hair = INK, smile = 1}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>
    <path d="M18 52c0-22 14-36 32-36s32 14 32 36-14 38-32 38-32-16-32-38z" fill={skin} stroke={INK} strokeWidth="4" />
    <path d="M18 48c0-20 12-34 32-34s32 12 32 30c-8-6-20-8-30-14-6 8-20 14-34 18z" fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="38" cy="56" r="4.5" fill={INK} /><circle cx="62" cy="56" r="4.5" fill={INK} />
    <path d={`M38 ${smile >= 0 ? 70 : 76}c6 ${6 * smile} 18 ${6 * smile} 24 0`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="66" r="4" fill={RED} opacity="0.35" /><circle cx="70" cy="66" r="4" fill={RED} opacity="0.35" />
  </svg>
);
const Bust = ({skin, shirt, hair, sad = 0, size = 150}) => (
  <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{display: 'block', overflow: 'visible'}}>
    <path d="M8 118c2-26 18-40 42-40s40 14 42 40z" fill={shirt} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M40 80l10 12 10-12" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <circle cx="50" cy="46" r="27" fill={skin} stroke={INK} strokeWidth="4" />
    <path d="M23 44c0-17 12-27 27-27s27 10 27 25c-10-2-22-6-30-12-4 6-12 12-24 14z" fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="41" cy="51" r="3.2" fill={INK} /><circle cx="59" cy="51" r="3.2" fill={INK} />
    <path d={sad > 0.5 ? 'M42 66c5-5 11-5 16 0' : 'M42 61c5 5 11 5 16 0'} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);
const Badge = ({ok, size = 64}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: ok ? GREEN : RED, border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
    {ok ? <Ico d={<path d="M5 12.5l4.5 4.5L19 7.5" />} size={size * 0.55} color="#fff" sw={3.4} />
      : <span style={{fontFamily: SANS, fontWeight: 700, color: '#fff', fontSize: size * 0.62, lineHeight: 1, marginTop: size * 0.12}}>?</span>}
  </div>
);
const Cross = ({F, t, size = 300, style = {}}) => !vis(F, t) ? null : (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{...abs(0, 0), overflow: 'visible', ...style}}>
    {[['M14 14 L86 86', 0], ['M86 14 L14 86', 4]].map(([d, o]) => <path key={d} d={d} stroke={RED} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(t) + o, s(t) + o + 6)} fill="none" />)}
  </svg>
);
const Gear = ({size = 300, rot = 0}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block', transform: `rotate(${rot}deg)`}}>
    <path d={Array.from({length: 8}, (_, i) => { const a = (i / 8) * Math.PI * 2, b = a + 0.22, c = a + Math.PI / 8; const p = (r, t) => `${50 + r * Math.cos(t)} ${50 + r * Math.sin(t)}`; return `${i ? 'L' : 'M'}${p(44, a - 0.2)} L${p(44, b)} L${p(34, c - 0.05)} L${p(34, c + 0.2)}`; }).join(' ') + 'Z'} fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="13" fill={SKY} stroke={INK} strokeWidth="4" />
  </svg>
);
const PEOPLE = [['#F2C29A', BLUE, INK], ['#E0AD84', YEL, '#3B2A20'], ['#D49A72', '#5BB85B', INK], ['#F2C29A', '#E5712F', '#6b4b33'], ['#E0AD84', SKY, INK],
  ['#D49A72', '#fff', '#3B2A20'], ['#F2C29A', RED, INK], ['#E0AD84', BLUE, '#9A9A9A'], ['#D49A72', YEL, INK], ['#F2C29A', '#5BB85B', '#3B2A20']];
const GOOD = 7;

/* ================= scenes ================= */

/* 1. 90% of people use ChatGPT the wrong way */
const Hook = ({F}) => {
  const n = Math.round(io(F, 0, 22, 12, 90, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      {PEOPLE.map(([skin, shirt, hair], i) => {
        const x = 100 + (i % 5) * 180, y = 560 + Math.floor(i / 5) * 250, t = K.chuk - 0.1 + ((i * 7) % 10) * 0.045, on = vis(F, t), good = i === GOOD;
        const drop = io(F, i * 1.2, i * 1.2 + 10, -40, 0, Easing.out(Easing.back(1.6)));
        return (
          <div key={i} style={{...abs(x, y + drop), opacity: io(F, i * 1.2, i * 1.2 + 6)}}>
            <div style={{opacity: on && !good ? 0.55 : 1}}><Bust skin={skin} shirt={shirt} hair={hair} sad={on && !good ? 1 : 0} size={140} /></div>
            {on && <div style={{...abs(92, -12), ...popS(F, t, 10)}}><Badge ok={good} size={58} /></div>}
          </div>
        );
      })}
      <div style={{...abs(0, 1060), width: 1080, display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
        <Serif size={250} style={{lineHeight: 1}}>{n}%</Serif>
      </div>
      {vis(F, K.gpt0 - 0.1) && <div style={{...abs(0, 1330), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, K.gpt0 - 0.1, 11)}}>
        <Pill bg="#fff" color={INK} size={40} style={{border: `${LW}px solid ${INK}`}}><Logo src="openai.svg" size={46} />ChatGPT</Pill>
      </div>}
    </AbsoluteFill>
  );
};

/* 2. that's why they never get the answer they want */
const BAD = ['Sure! Here is a general post you can use for your business:', {t: 'BIG SALE!', b: true}, 'Visit our store today and enjoy amazing discounts on all products. Don\'t miss out!', '#Sale #Shopping #Offers'];
const Bad = ({F}) => {
  const a = sc('bad');
  const n = io(F, s(K.mhanun + 0.2), s(K.mhanun + 1.6), 0, BAD.length, Easing.linear);
  return (
    <AbsoluteFill>
      <Cam F={F} keys={[[K.uttar3 - 0.4, 1.22, C2(200, 330)]]}>
        <Phone F={F} t0={a}>
          <ChatHome empty={false}>
            <UserMsg y={128}>दुकानासाठी एक पोस्ट लिहून दे</UserMsg>
            <BotMsg y={208} lines={BAD} n={n} />
          </ChatHome>
        </Phone>
      </Cam>
      {vis(F, K.uttar3) && <div style={{...abs(70, 1080), transform: `rotate(-5deg) scale(${pop(F, K.uttar3, 11)})`}}><Pill bg={RED} size={42} style={{border: `${LW}px solid ${INK}`}}>✕ English</Pill></div>}
      {vis(F, K.nahi3 - 0.15) && <div style={{...abs(690, 1250), transform: `rotate(4deg) scale(${pop(F, K.nahi3 - 0.15, 11)})`}}><Pill bg={RED} size={42} style={{border: `${LW}px solid ${INK}`}}>✕ Generic</Pill></div>}
    </AbsoluteFill>
  );
};

/* 3. change these three settings today */
const THREE = [['Custom Instructions', 'Settings › Personalization'], ['Memory', 'Settings › Personalization'], ['Improve the model', 'Settings › Data Controls']];
const Three = ({F}) => {
  const a = sc('three');
  const g = io(F, s(K.teen) - 8, s(K.teen) + 4, 1, 0);
  return (
    <AbsoluteFill>
      {g > 0 && <div style={{...abs(340, 640), opacity: g, transform: `scale(${0.6 + 0.4 * g}) translateY(${(1 - io(F, s(a), s(a) + 10)) * 40}px)`}}>
        <Gear size={400} rot={F * 1.6} />
        <div style={{...abs(250, 250)}}><Gear size={170} rot={-F * 3 + 12} /></div>
      </div>}
      {THREE.map(([l, sub], i) => {
        const t = K.teen - 0.1 + i * 0.16;
        return vis(F, t) && (
          <div key={l} style={{...abs(90, 590 + i * 260), ...popS(F, t, 12)}}>
            <Panel x={0} y={0} w={900} h={210} r={30} style={{position: 'relative'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 34}}>
                <StepBadge n={i + 1} of={3} size={120} />
                <div style={{flex: 1}}>
                  <div style={{fontFamily: UI, fontSize: 50, fontWeight: 600, letterSpacing: '-0.02em', color: INK, whiteSpace: 'nowrap', lineHeight: 1.15}}>{l}</div>
                  <div style={{fontFamily: MONO, fontSize: 26, color: MUTE, marginTop: 8}}>{sub}</div>
                </div>
              </div>
            </Panel>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 4. step 1: Personalization -> Custom Instructions */
const WORK = 'मी पुण्यात कपड्यांचं दुकान चालवतो.';
const TR1 = 'नेहमी मराठीत उत्तर द्या.', TR2 = '\nथोडक्यात, मुद्देसूद आणि उदाहरणांसह.';
const Step1 = ({F}) => {
  const a = sc('s1');
  const work = typed(F, K.kaam - 0.15, K.kaam + 1.3, WORK);
  const traits = typed(F, K.marathi - 0.2, K.marathi + 0.9, TR1) + typed(F, K.kasa - 0.15, K.kasa + 1.2, TR2);
  const PT = Math.max(K.pers + 0.1, a + 0.9);
  const focus = F < s(K.marathi - 0.3) ? 0 : F < s(K.set - 0.5) ? 1 : -1;
  const items = [
    {t: 0, el: <Sidebar hl={hlAt(F, a + 0.15)} />},
    {t: a + 0.25, kind: 'sheet', el: <SettingsScreen F={F} hlPers={hlAt(F, PT)} />},
    {t: PT + 0.12, kind: 'push', el: <PersScreen hlCI={hlAt(F, K.custom)} />},
    {t: K.custom + 0.12, kind: 'push', el: <CIScreen work={work} traits={traits} focus={focus} enable={ramp(F, K.set - 0.45)} hlSave={hlAt(F, K.set + 0.05)} />},
  ];
  return (
    <AbsoluteFill>
      <Cam F={F} keys={[[a + 0.35, 1.3, C2(201, 420)], [PT + 0.1, 1.3, C2(201, 230)], [K.kaam - 0.4, 1.42, C2(201, 300)], [K.marathi - 0.4, 1.42, C2(201, 420)], [K.set - 0.7, 1.0, HOME[1]]]}>
        <Phone F={F} t0={a}>
          <Nav F={F} items={items} />
          <Tap F={F} t={a + 0.15} x={80} y={SH - 65} />
          <Tap F={F} t={PT} x={140} y={418} />
          <Tap F={F} t={K.custom} x={150} y={156} />
          <Tap F={F} t={K.set - 0.45} x={346} y={666} />
          <Tap F={F} t={K.set + 0.05} x={362} y={80} />
        </Phone>
      </Cam>
      <div style={{...abs(880, 540), ...popS(F, a + 0.1)}}><StepBadge n={1} of={3} /></div>
      {vis(F, K.set + 0.1) && <div style={{...abs(560, 1370), transform: `rotate(-3deg) scale(${pop(F, K.set + 0.1, 11)})`}}><Pill bg={GREEN} size={40} style={{border: `${LW}px solid ${INK}`}}><Ico d={<path d="M5 12.5l4.5 4.5L19 7.5" />} size={40} color="#fff" sw={3} />Saved</Pill></div>}
    </AbsoluteFill>
  );
};

/* 5. not a new intern, a smart personal assistant */
const Headset = () => (
  <svg viewBox="0 0 100 100" width={230} height={230} style={{...abs(0, 0), overflow: 'visible'}}>
    <path d="M16 54c0-26 15-42 34-42s34 16 34 42" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <rect x="8" y="48" width="14" height="24" rx="6" fill={BLUE} stroke={INK} strokeWidth="4" /><rect x="78" y="48" width="14" height="24" rx="6" fill={BLUE} stroke={INK} strokeWidth="4" />
    <path d="M15 72c0 12 12 18 26 18" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" /><circle cx="44" cy="90" r="5" fill={INK} />
  </svg>
);
const CHECKS = ['मराठीत उत्तर', 'तुमचा व्यवसाय', 'तुमची पद्धत'];
const Intern = ({F}) => {
  const a = sc('intern');
  const dim = io(F, s(K.nahi14), s(K.nahi14) + 8, 1, 0.45);
  return (
    <AbsoluteFill>
      <div style={{...abs(70, 640), ...up(F, a + 0.05, 10, 24), opacity: Math.min(io(F, s(a), s(a) + 10), dim)}}>
        <Panel x={0} y={0} w={420} h={560} r={30} style={{position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 70}}>
            <Face size={220} smile={-0.6} />
            <div style={{marginTop: 34}}><Pill bg={INK} size={38}>नवीन इंटर्न</Pill></div>
          </div>
        </Panel>
        {vis(F, K.intern) && <div style={{...abs(290, 40), transform: `rotate(${10 + swing(F, K.intern, 10)}deg) scale(${pop(F, K.intern, 10)})`}}><Badge size={96} /></div>}
      </div>
      <div style={{...abs(110, 690)}}><Cross F={F} t={K.nahi14} size={340} /></div>
      {vis(F, K.smart - 0.15) && <div style={{...abs(540, 560), ...popS(F, K.smart - 0.15, 12)}}>
        <Panel x={0} y={0} w={470} h={720} r={30} style={{position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 54}}>
            <div style={{position: 'relative', width: 230, height: 230}}><div style={{...abs(5, 10)}}><Face size={220} /></div><Headset /></div>
            <div style={{marginTop: 24}}><Pill size={38}>पर्सनल असिस्टंट</Pill></div>
            <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18}}>
              {CHECKS.map((c, i) => vis(F, K.asst + i * 0.2) && (
                <div key={c} style={{display: 'flex', alignItems: 'center', gap: 16, ...up(F, K.asst + i * 0.2, 8, 14)}}><Badge ok size={46} /><T size={36} w={500}>{c}</T></div>
              ))}
            </div>
          </div>
        </Panel>
        <div style={{...abs(380, -30), width: 110, height: 110, borderRadius: 28, background: '#fff', border: `${LW}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${8 + swing(F, K.smart, 8)}deg)`}}><Logo src="openai.svg" size={66} /></div>
      </div>}
    </AbsoluteFill>
  );
};

/* 6. but tomorrow it forgets everything */
const Forget = ({F}) => {
  const a = sc('forget');
  const fl = io(F, s(K.udya) - 2, s(K.udya) + 8, 0, 1, Easing.inOut(Easing.quad));
  const fade = io(F, s(K.udya), s(K.udya) + 14, 1, 0);
  const day = fl < 0.5 ? 'आज' : 'उद्या';
  return (
    <AbsoluteFill>
      <Panel x={90} y={640} w={900} h={600} r={34} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '30px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Logo src="openai.svg" size={54} /><T size={38}>ChatGPT</T>
            <div style={{marginLeft: 'auto', width: 150, height: 120, borderRadius: 18, border: `${LW}px solid ${INK}`, overflow: 'hidden', background: '#fff', transform: `rotateX(${Math.sin(fl * Math.PI) * 80}deg)`}}>
              <div style={{height: 34, background: RED, borderBottom: `${LW - 1}px solid ${INK}`}} />
              <T size={36} style={{textAlign: 'center', marginTop: 16}}>{day}</T>
            </div>
          </div>
          <div style={{height: LW, background: INK, margin: '24px 0 34px', borderRadius: 3}} />
          <div style={{opacity: fade, filter: `blur(${(1 - fade) * 6}px)`}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', ...up(F, a + 0.2, 8, 14)}}><div style={{background: '#EFEFEF', borderRadius: 30, padding: '18px 28px 12px'}}><T size={36} w={500}>मी कपड्यांचं दुकान चालवतो.</T></div></div>
            {vis(F, K.sangitla - 0.3) && <div style={{marginTop: 30, ...up(F, K.sangitla - 0.3, 8, 14)}}><T size={36} w={500}>समजलं! आता मराठीत, थोडक्यात सांगेन.</T></div>}
          </div>
          {vis(F, K.udya + 0.5) && <div style={{...abs(40, 190), ...up(F, K.udya + 0.5, 8, 14)}}>
            <div style={{display: 'flex', gap: 14, opacity: 0.35}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: INK}} />)}</div>
          </div>}
          {vis(F, K.visrun - 0.2) && <div style={{...abs(40, 300), ...up(F, K.visrun - 0.2, 8, 14)}}><T size={40} w={600}>नमस्कार! तुम्ही काय काम करता?</T></div>}
        </div>
      </Panel>
      {vis(F, K.visrun) && <div style={{...abs(820, 520), transform: `rotate(${12 + swing(F, K.visrun, 12)}deg) scale(${pop(F, K.visrun, 10)})`}}><Badge size={130} /></div>}
    </AbsoluteFill>
  );
};

/* 7. step 2: Memory on -> it remembers -> new chat already knows you */
const MEMS = [
  {k: 'आवड', v: 'छोटी, मुद्देसूद उत्तरं आवडतात', icon: SFI.bulb, bg: '#FF2D55', key: 'aavad'},
  {k: 'कामाची पद्धत', v: 'रोज सकाळी स्टॉक आणि ऑर्डर तपासतो', icon: SFI.archive, bg: '#0A84FF', key: 'paddhat'},
  {k: 'महत्त्वाचं', v: 'दिवाळीत दुकानाचा मोठा सेल असतो', icon: SFI.info, bg: '#FF9500', key: 'goshti'},
];
const FRESH = [{t: 'नक्की गणेश! तुमच्या कपड्यांच्या दुकानासाठी:', gap: 12}, {t: 'दिवाळी धमाका सेल!', b: true}, 'नवीन कलेक्शन, खास सवलत.', 'फक्त या आठवड्यात. आजच भेट द्या!'];
const Step2 = ({F}) => {
  const a = sc('s2');
  const mem = ramp(F, K.on);
  const n = io(F, s(K.navin + 0.9), s(K.nahi28), 0, FRESH.length, Easing.linear);
  const items = [
    {t: 0, el: <SettingsScreen F={F} hlPers={hlAt(F, a + 0.35)} />},
    {t: a + 0.48, kind: 'push', el: <PersScreen ci="On" mem={mem} />},
    {t: K.yamule + 0.1, kind: 'push', el: <MemoryScreen F={F} items={MEMS.map((m) => ({...m, t: K[m.key] - 0.1}))} />},
    {t: K.navin, kind: 'dismiss', el: (
      <ChatHome empty={false}>
        {vis(F, K.navin + 0.4) && <UserMsg y={128} op={io(F, s(K.navin + 0.4), s(K.navin + 0.4) + 6)}>दिवाळीसाठी पोस्ट लिहून दे</UserMsg>}
        <BotMsg y={212} lines={FRESH} n={n} />
      </ChatHome>)},
  ];
  return (
    <AbsoluteFill>
      <Cam F={F} keys={[[K.memory - 0.6, 1.5, C2(250, 290)], [K.yamule, 1.22, C2(201, 300)], [K.navin - 0.1, 1.15, C2(201, 300)]]}>
        <Phone F={F} t0={a}>
          <Nav F={F} items={items} />
          <Tap F={F} t={a + 0.35} x={140} y={418} />
          <Tap F={F} t={K.on} x={346} y={282} />
          <Tap F={F} t={K.yamule} x={150} y={334} />
        </Phone>
      </Cam>
      <div style={{...abs(880, 540), ...popS(F, a + 0.1)}}><StepBadge n={2} of={3} /></div>
      {vis(F, K.lakshat) && F < s(K.navin) && <div style={{...abs(90, 1400), transform: `rotate(-3deg) scale(${pop(F, K.lakshat, 11)})`}}><Pill bg={INK} size={40}><Ico d={<path d="M5 12.5l4.5 4.5L19 7.5" />} size={38} color="#fff" sw={3} />Memory updated</Pill></div>}
      {vis(F, K.pahilya - 0.1) && <div style={{...abs(800, 1260), transform: `rotate(${-8 + swing(F, K.pahilya - 0.1, 8)}deg) scale(${pop(F, K.pahilya - 0.1, 10)})`}}>
        <div style={{position: 'relative', width: 170, height: 170, borderRadius: '50%', background: '#fff', border: `${LW}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Ico d={<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></>} size={100} sw={2.4} />
          <svg width="170" height="170" style={{...abs(-LW, -LW)}}><path d="M35 35 L135 135" stroke={RED} strokeWidth="12" strokeLinecap="round" /></svg>
        </div>
      </div>}
    </AbsoluteFill>
  );
};

/* 8. you share work / personal things with ChatGPT */
const DOCS = [
  {l: 'हिशोब.xlsx', logo: 'excel.svg', from: [-420, -120], t: 'kamachya', d: 0},
  {l: 'ग्राहक यादी.pdf', from: [520, -200], t: 'kamachya', d: 0.18},
  {l: 'मेडिकल रिपोर्ट.pdf', from: [-420, 260], t: 'personal', d: 0},
  {l: 'बँक स्टेटमेंट.pdf', from: [520, 300], t: 'personal', d: 0.18},
];
const Priv = ({F}) => {
  const a = sc('priv');
  return (
    <AbsoluteFill>
      <Panel x={150} y={680} w={780} h={660} r={34} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '30px 36px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Logo src="openai.svg" size={54} /><T size={38}>ChatGPT</T></div>
          <div style={{height: LW, background: INK, margin: '24px 0 0', borderRadius: 3}} />
        </div>
        <div style={{...abs(36, 540), width: 708, height: 90, borderRadius: 45, border: `${LW - 1}px solid ${INK}`, display: 'flex', alignItems: 'center', padding: '0 30px'}}><T size={32} w={500} color={MUTE}>Ask anything</T></div>
      </Panel>
      {DOCS.map((d, i) => {
        const t = K[d.t] + d.d, p = io(F, s(t), s(t) + 16, 0, 1, Easing.out(Easing.cubic));
        if (!vis(F, t)) return null;
        const x = 200 + (i % 2) * 360, y = 860 + Math.floor(i / 2) * 150;
        return (
          <div key={d.l} style={{...abs(x + d.from[0] * (1 - p), y + d.from[1] * (1 - p)), transform: `rotate(${(1 - p) * (i % 2 ? 14 : -14)}deg)`}}>
            <div style={{width: 330, height: 116, borderRadius: 20, background: '#fff', border: `${LW - 1}px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px', boxSizing: 'border-box', boxShadow: '8px 10px 0 rgba(17,17,17,0.12)'}}>
              {d.logo ? <Logo src={d.logo} size={60} /> : <div style={{width: 56, height: 68, borderRadius: 8, background: RED, border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{fontFamily: SANS, fontWeight: 700, color: '#fff', fontSize: 18, marginTop: 4}}>PDF</span></div>}
              <T size={28} w={600}>{d.l}</T>
            </div>
          </div>
        );
      })}
      {vis(F, K.mahatva - 0.1) && <div style={{...abs(800, 520), transform: `rotate(${10 + swing(F, K.mahatva - 0.1, 12)}deg) scale(${pop(F, K.mahatva - 0.1, 9)})`}}>
        <div style={{width: 150, height: 150, borderRadius: '50%', background: RED, border: `${LW}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 130, color: '#fff', lineHeight: 1, marginTop: 18}}>!</span></div>
      </div>}
      {vis(F, K.barobar - 0.1) && <div style={{...abs(150, 1390), ...popS(F, K.barobar - 0.1, 11)}}><Pill bg={BLUE} size={40}>बरोबर?</Pill></div>}
    </AbsoluteFill>
  );
};

/* 9. step 3: Data Controls -> Improve the model for everyone -> OFF */
const Step3 = ({F}) => {
  const a = sc('s3');
  const off = ramp(F, K.band, 6, 1, 0);
  const items = [
    {t: 0, el: <SettingsScreen F={F} hlData={hlAt(F, K.data)} />},
    {t: K.data + 0.12, kind: 'push', el: <DataScreen hlImp={hlAt(F, K.improve)} />},
    {t: K.improve + 0.12, kind: 'push', el: <ImproveScreen on={off} />},
  ];
  return (
    <AbsoluteFill>
      <Cam F={F} keys={[[K.data - 0.5, 1.3, C2(201, 520)], [K.data + 0.15, 1.3, C2(201, 260)], [K.improve - 0.4, 1.4, C2(201, 170)], [K.band - 0.6, 1.6, C2(201, 190)]]}>
        <Phone F={F} t0={a}>
          <Nav F={F} items={items} />
          <Tap F={F} t={K.data} x={140} y={522} />
          <Tap F={F} t={K.improve} x={160} y={156} />
          <Tap F={F} t={K.band} x={346} y={156} />
        </Phone>
      </Cam>
      <div style={{...abs(880, 540), ...popS(F, a + 0.1)}}><StepBadge n={3} of={3} /></div>
      {vis(F, K.band + 0.2) && <div style={{...abs(380, 1380), transform: `rotate(-3deg) scale(${pop(F, K.band + 0.2, 11)})`}}><Pill bg={INK} size={44}>OFF</Pill></div>}
    </AbsoluteFill>
  );
};

/* 10. new chats not used for training; history stays safe */
const HIST = ['दिवाळी ऑफर पोस्ट', 'GST बिल फॉरमॅट', 'ग्राहकांना WhatsApp मेसेज'];
const Shield = ({ok, size = 150}) => (
  <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={{display: 'block', overflow: 'visible'}}>
    <path d="M50 6 90 20v32c0 26-18 44-40 52C28 96 10 78 10 52V20z" fill={ok ? GREEN : RED} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    {ok ? <path d="M32 54l12 12 24-26" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M35 38l30 30M65 38 35 68" stroke="#fff" strokeWidth="9" strokeLinecap="round" />}
  </svg>
);
const Safe = ({F}) => {
  const a = sc('safe');
  const go = io(F, s(K.chats), s(K.nahit), 0, 1, Easing.inOut(Easing.quad));
  const block = vis(F, K.nahit - 0.15);
  return (
    <AbsoluteFill>
      {/* server */}
      <div style={{...abs(700, 560), ...up(F, a + 0.05, 10, 24)}}>
        <Panel x={0} y={0} w={290} h={330} r={26} style={{position: 'relative'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 26, gap: 12}}>
            <Logo src="openai.svg" size={86} />
            {[0, 1].map((i) => <div key={i} style={{width: 210, height: 46, borderRadius: 10, border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box'}}><div style={{width: 12, height: 12, borderRadius: 6, background: (F + i * 7) % 30 < 15 ? GREEN : '#cfcfcf'}} /><div style={{flex: 1, height: 7, borderRadius: 4, background: FAINT}} /></div>)}
            <div style={{fontFamily: MONO, fontSize: 26, color: MUTE}}>training</div>
          </div>
        </Panel>
      </div>
      {/* chats flying right, bounced by the shield */}
      {[0, 1, 2].map((i) => {
        const p = block ? Math.min(go, 0.62) - io(F, s(K.nahit), s(K.nahit) + 14, 0, 0.5, Easing.out(Easing.cubic)) * (1 - i * 0.2) : go;
        return (
          <div key={i} style={{...abs(90 + p * 520 - i * 18, 590 + i * 100), ...up(F, a + 0.15 + i * 0.12, 8, 14)}}>
            <div style={{width: 230, height: 76, borderRadius: 38, background: i === 1 ? '#fff' : '#EFEFEF', border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', boxSizing: 'border-box'}}>
              {[0, 1, 2].map((j) => <div key={j} style={{flex: j === 2 ? 0.5 : 1, height: 9, borderRadius: 5, background: FAINT}} />)}
            </div>
          </div>
        );
      })}
      {block && <div style={{...abs(520, 600), transform: `rotate(${-6 + swing(F, K.nahit - 0.15, 10)}deg) scale(${pop(F, K.nahit - 0.15, 9)})`}}><Shield size={150} /></div>}
      {/* chat history stays */}
      {vis(F, K.history - 0.2) && <div style={{...abs(90, 980), ...up(F, K.history - 0.2, 10, 24)}}>
        <Panel x={0} y={0} w={900} h={420} r={30} style={{position: 'relative'}}>
          <div style={{padding: '28px 40px'}}>
            <div style={{fontFamily: MONO, fontSize: 28, color: MUTE}}>chat history</div>
            {HIST.map((h, i) => (
              <div key={h} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26, ...up(F, K.history + i * 0.12, 8, 12)}}>
                <Ico d={<path d="M4 5h16v11H9l-5 4z" />} size={40} sw={2.2} /><T size={38} w={500}>{h}</T>
              </div>
            ))}
          </div>
        </Panel>
        {vis(F, K.safe - 0.1) && <div style={{...abs(720, -60), transform: `rotate(${8 + swing(F, K.safe - 0.1, 8)}deg) scale(${pop(F, K.safe - 0.1, 10)})`}}><Shield ok size={150} /></div>}
      </div>}
    </AbsoluteFill>
  );
};

/* 11. just three settings -> half your time saved */
const Recap = ({F}) => {
  const a = sc('recap');
  const wedge = io(F, s(K.nimma), s(K.nimma) + 22, 0, 180, Easing.out(Easing.cubic));
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const R = 150, cx = 170, cy = 170;
  const rows = [['Custom Instructions', <Tx z={36} c="#8E8E93">On</Tx>], ['Memory', <div style={{transform: 'scale(1.5)', transformOrigin: 'right center'}}><Toggle on={1} /></div>], ['Improve the model', <div style={{transform: 'scale(1.5)', transformOrigin: 'right center'}}><Toggle on={0} /></div>]];
  return (
    <AbsoluteFill>
      <Panel x={90} y={560} w={900} h={430} r={30} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '24px 40px'}}>
          {rows.map(([l, ctl], i) => (
            <div key={l} style={{display: 'flex', alignItems: 'center', height: 126, borderTop: i ? `3px solid ${FAINT}` : 'none', gap: 22}}>
              <div style={{width: 60}}>{vis(F, K.teen2 + i * 0.2) ? <div style={popS(F, K.teen2 + i * 0.2, 10)}><Badge ok size={56} /></div> : <StepBadge n={i + 1} of={3} size={60} />}</div>
              <div style={{flex: 1, fontFamily: UI, fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>{l}</div>
              {ctl}
            </div>
          ))}
        </div>
      </Panel>
      {vis(F, K.bagha - 0.2) && <div style={{...abs(220, 1040), ...popS(F, K.bagha - 0.2, 12)}}>
        <svg width="340" height="340" style={{display: 'block', overflow: 'visible'}}>
          <circle cx={cx + 12} cy={cy + 16} r={R} fill={INK} opacity="0.15" />
          <circle cx={cx} cy={cy} r={R} fill="#fff" stroke={INK} strokeWidth={LW + 1} />
          {wedge > 0.5 && <path d={`M${cx} ${cy} L${cx} ${cy - R + 10} A${R - 10} ${R - 10} 0 ${wedge > 180 ? 1 : 0} 1 ${cx + (R - 10) * Math.cos(rad(wedge))} ${cy + (R - 10) * Math.sin(rad(wedge))} Z`} fill={RED} opacity="0.9" />}
          {Array.from({length: 12}, (_, i) => <path key={i} d={`M${cx + (R - 14) * Math.cos(rad(i * 30))} ${cy + (R - 14) * Math.sin(rad(i * 30))} L${cx + (R - 30) * Math.cos(rad(i * 30))} ${cy + (R - 30) * Math.sin(rad(i * 30))}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />)}
          <path d={`M${cx} ${cy} L${cx + 90 * Math.cos(rad(wedge))} ${cy + 90 * Math.sin(rad(wedge))}`} stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="12" fill={INK} />
        </svg>
      </div>}
      {vis(F, K.nimma + 0.2) && <div style={{...abs(600, 1120), transform: `rotate(-6deg) scale(${pop(F, K.nimma + 0.2, 10)})`}}>
        <Serif size={200} style={{lineHeight: 1}}>½</Serif>
        <div style={{marginTop: 4}}><Pill bg={INK} size={38}>वेळ वाचला</Pill></div>
      </div>}
    </AbsoluteFill>
  );
};

/* 12. follow Marathi AI Institute */
const Follow = ({F}) => {
  const a = sc('follow');
  const done = vis(F, K.follow);
  const cx = io(F, s(a) + 6, s(K.follow), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Panel x={90} y={600} w={900} h={620} r={34} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '44px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={popS(F, K.mai - 0.1, 11)}><MaiMark size={190} /></div>
          <T size={52} w={700} style={{marginTop: 30}}>Marathi AI Institute</T>
          <div style={{marginTop: 8}}><Serif size={48}>कामाच्या AI टिप्स</Serif></div>
          <div style={{marginTop: 40, width: 520, height: 100, borderRadius: 18, border: `${LW}px solid ${INK}`, background: done ? '#fff' : BLUE, color: done ? INK : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 42,
            transform: F >= s(K.follow) - 2 && F < s(K.follow) + 4 ? 'scale(0.95)' : 'none'}}>
            {done ? <><Ico d={<path d="M5 12.5l4.5 4.5L19 7.5" />} size={42} sw={3} />Following</> : 'Follow'}
          </div>
        </div>
      </Panel>
      {done && [0, 1, 2, 3].map((i) => { const t = K.follow + i * 0.12, p = io(F, s(t), s(t) + 30); return <div key={i} style={{...abs(700 + i * 40, 1050 - p * 360), opacity: 1 - p, transform: `scale(${0.8 + i * 0.1})`}}><svg viewBox="0 0 24 24" width={60} height={60}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={RED} stroke={INK} strokeWidth="1.6" /></svg></div>; })}
      <Cursor F={F} x={830 - 240 * cx} y={1500 - 340 * cx} t={K.follow} size={90} />
    </AbsoluteFill>
  );
};

const Outro = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 470), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, OUTRO_AT + 0.05, 11)}}><MaiMark size={260} /></div>
    <div style={{...abs(0, 820), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...up(F, OUTRO_AT + 0.3, 12, 30)}}>
      <T size={84} w={700}>Marathi AI Institute</T>
      <div style={{marginTop: 10}}><Serif size={70}>रोज कामाच्या AI टिप्स</Serif></div>
      <div style={{marginTop: 50, ...up(F, OUTRO_AT + 0.8, 10, 20)}}><Pill size={44}>Follow करा</Pill></div>
    </div>
  </AbsoluteFill>
);

/* ---------- main ---------- */
const COMPS = {hook: Hook, bad: Bad, three: Three, s1: Step1, intern: Intern, forget: Forget, s2: Step2, priv: Priv, s3: Step3, safe: Safe, recap: Recap, follow: Follow, outro: Outro};
const LABELS = {hook: '// 01 · the mistake', bad: '// 02 · wrong answers', three: '// 03 · 3 settings', s1: '// 04 · custom instructions', intern: '// 05 · your assistant', forget: '// 06 · it forgets',
  s2: '// 07 · memory', priv: '// 08 · your data', s3: '// 09 · data controls', safe: '// 10 · stays private', recap: '// 11 · recap', follow: '// 12 · follow'};
const Video = () => <MaiVideo scenes={SCENES} comps={COMPS} labels={LABELS} right="MARATHI AI" chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
