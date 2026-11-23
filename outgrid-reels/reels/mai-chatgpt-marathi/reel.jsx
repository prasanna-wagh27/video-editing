/*
 * "Talk to ChatGPT in Marathi" — Marathi AI Institute reel, MAI style (shared/mai.jsx), 1080x1920, VO at original speed.
 * Real logos: ChatGPT (OpenAI), WhatsApp, Instagram-style follow UI. Brand mark is a placeholder (MaiMark) until the real logo arrives.
 * The spoken line is the top headline (reference style); words appear as they are spoken.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Easing} from 'remotion';
import {FPS, s, io, pop, abs} from '../../shared/kit.jsx';
import {INK, RED, BLUE, SKY, SKY_D, MUTE, FAINT, YEL, GREEN, SANS, SERIF, MONO, LW, up, popS, vis,
  HShadow, Panel, Pill, StepBadge, Cursor, Logo, Ico, MaiMark, MaiVideo} from '../../shared/mai.jsx';
import {CAPS} from './captions.js';
import {K, SCENES, OUTRO_AT, TOTAL_S} from './cues.mjs';

const TOTAL = s(TOTAL_S);
const sc = (k) => SCENES.find((x) => x[0] === k)[1];
const T = ({size = 34, w: wt = 600, color = INK, style = {}, children}) => <div style={{fontFamily: SANS, fontSize: size, fontWeight: wt, color, lineHeight: 1.2, whiteSpace: 'nowrap', letterSpacing: '-0.015em', ...style}}>{children}</div>;
const Serif = ({size = 40, color = RED, children, style = {}}) => <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.1, ...style}}>{children}</span>;
const typed = (F, t0, t1, str) => str.slice(0, Math.round(io(F, s(t0), s(t1), 0, str.length, Easing.linear)));
const swing = (F, t, amp = 8) => (F < s(t) ? 0 : amp * Math.exp(-(F - s(t)) / 22) * Math.sin((F - s(t)) / 4));

/* ---------- outline vectors ---------- */
const Face = ({size = 200, skin = '#F2C29A', hair = INK, smile = 1}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block', overflow: 'visible'}}>
    <path d="M18 52c0-22 14-36 32-36s32 14 32 36-14 38-32 38-32-16-32-38z" fill={skin} stroke={INK} strokeWidth="4" />
    <path d="M18 48c0-20 12-34 32-34s32 12 32 30c-8-6-20-8-30-14-6 8-20 14-34 18z" fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="38" cy="56" r="4.5" fill={INK} /><circle cx="62" cy="56" r="4.5" fill={INK} />
    <path d={`M38 70c6 ${6 * smile} 18 ${6 * smile} 24 0`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="66" r="4" fill={RED} opacity="0.35" /><circle cx="70" cy="66" r="4" fill={RED} opacity="0.35" />
  </svg>
);
const Phone = ({x, y, w: W, h, rot = 0, children, style = {}, screen = '#fff'}) => (
  <div style={{...abs(x, y), width: W, height: h, transform: `rotate(${rot}deg)`, ...style}}>
    <HShadow x={30} y={40} w={W} h={h} r={W * 0.14} op={0.8} />
    <div style={{position: 'absolute', inset: 0, borderRadius: W * 0.14, background: INK, padding: W * 0.03, boxSizing: 'border-box'}}>
      <div style={{width: '100%', height: '100%', borderRadius: W * 0.11, background: screen, overflow: 'hidden', position: 'relative'}}>
        {children}
        <div style={{...abs('50%', W * 0.035), marginLeft: -W * 0.13, width: W * 0.26, height: W * 0.06, borderRadius: W * 0.03, background: INK}} />
      </div>
    </div>
  </div>
);
const Bubble = ({children, tail = 'left', style = {}, bg = '#fff'}) => (
  <div style={{position: 'relative', display: 'inline-block', background: bg, border: `${LW}px solid ${INK}`, borderRadius: 30, padding: '18px 28px 12px', ...style}}>
    {children}
    <svg width="40" height="34" viewBox="0 0 40 34" style={{...abs(tail === 'left' ? 30 : 'auto', '100%'), right: tail === 'right' ? 30 : 'auto', marginTop: -LW}}><path d={tail === 'left' ? 'M2 0 L12 30 L30 0' : 'M38 0 L28 30 L10 0'} fill={bg} stroke={INK} strokeWidth={LW} strokeLinejoin="round" /><path d="M0 2.5h40" stroke={bg} strokeWidth="6" /></svg>
  </div>
);
// hanging tag on a string (like the "0 hours filmed" tag in the references)
const HangTag = ({F, t, x, y, rot = -6, children}) => !vis(F, t) ? null : (
  <div style={{...abs(x, y), transformOrigin: '50% 0', transform: `rotate(${rot + swing(F, t, 12)}deg) scale(${pop(F, t, 12)})`}}>
    <div style={{...abs(-4, -70), width: 8, height: 8, borderRadius: 4, background: INK}} />
    <div style={{...abs(-1.5, -66), width: 3, height: 66, background: INK}} />
    <div style={{transform: 'translateX(-50%)', position: 'relative'}}>
      <div style={{...abs('50%', 10), marginLeft: -11, width: 22, height: 22, borderRadius: 11, border: `4px solid ${INK}`, background: '#fff', zIndex: 2}} />
      <Panel x={0} y={0} w={300} h={170} r={10} style={{position: 'relative'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 20, boxSizing: 'border-box'}}>{children}</div>
      </Panel>
    </div>
  </div>
);
const AppGlyph = ({d, bg = '#fff'}) => (
  <div style={{width: 118, height: 118, borderRadius: 30, border: `${LW - 1}px solid ${INK}`, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}><Ico d={d} size={58} sw={2.2} /></div>
);
const G = {
  cam: <><rect x="3" y="7" width="18" height="13" rx="3" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
  msg: <path d="M4 5h16v11H9l-5 4z" />, map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  cal: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>, set: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  photo: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  key: <><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>,
  plane: <path d="M3 11 21 3l-7 18-3-7z" />, check: <path d="M5 12.5l4.5 4.5L19 7.5" />, bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  dl: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 19h14" /></>, heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
};
const Waves = ({F, n = 7, h = 70, color = INK, on = true, gap = 9, wd = 9}) => (
  <div style={{display: 'flex', alignItems: 'center', gap, height: h}}>
    {Array.from({length: n}, (_, i) => <div key={i} style={{width: wd, borderRadius: wd, background: color, height: on ? h * (0.25 + 0.75 * Math.abs(Math.sin(F / 3.3 + i * 0.9) * Math.cos(F / 5.1 + i * 0.4))) : h * 0.2}} />)}
  </div>
);

/* ================= scenes ================= */

/* 1. a man in your pocket who talks Marathi 24h and charges ₹0 */
const Pocket = ({F}) => {
  const rise = io(F, 0, 14, 60, 0, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <HShadow x={210} y={1290} w={720} h={90} r={45} />
      <Phone x={330} y={560 + rise} w={420} h={760} rot={-7}>
        <div style={{...abs(0, 120), width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={popS(F, K.manus - 0.3, 11)}><Face size={230} /></div>
        </div>
      </Phone>
      {/* jeans pocket in front of the phone */}
      <svg width={1080} height={1920} style={{...abs(0, 0)}}>
        <path d="M170 900 L910 900 L890 1250 Q540 1380 190 1250 Z" fill="#5B87C9" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M200 935 L880 935 L862 1225 Q540 1340 218 1225 Z" fill="none" stroke="#fff" strokeWidth="3.5" strokeDasharray="14 10" opacity="0.85" />
        <path d="M170 900 Q540 1010 910 900" fill="none" stroke={INK} strokeWidth={LW} />
        <path d="M196 916 Q540 1024 884 916" fill="none" stroke="#fff" strokeWidth="3.5" strokeDasharray="14 10" opacity="0.85" />
        <rect x="806" y="880" width="40" height="40" rx="6" fill="#C9A24A" stroke={INK} strokeWidth="4" />
      </svg>
      {vis(F, K.manus) && <div style={{...abs(600, 520), ...popS(F, K.manus)}}><Bubble tail="left"><T size={40}>नमस्कार!</T></Bubble></div>}
      {vis(F, K.marathi1) && <div style={{...abs(640, 660), ...popS(F, K.marathi1)}}><Pill size={38}>मराठीत बोलतो</Pill></div>}
      {vis(F, K.chovis) && <div style={{...abs(90, 700), ...popS(F, K.chovis)}}>
        <Pill bg={INK} size={34}><span style={{width: 14, height: 14, borderRadius: 7, background: GREEN, display: 'inline-block', marginTop: -4}} />24 तास online</Pill>
      </div>}
      <HangTag F={F} t={K.rupaya} x={250} y={1010} rot={-8}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}><Serif size={110}>₹0</Serif></div>
        <div style={{fontFamily: MONO, fontSize: 26, color: MUTE, marginTop: -6}}>fees</div>
      </HangTag>
    </AbsoluteFill>
  );
};

/* 2. ChatGPT now speaks Marathi */
const Gpt = ({F}) => (
  <AbsoluteFill>
    <Phone x={290} y={560} w={500} h={860}>
      <div style={{...abs(0, 210), width: '100%', display: 'flex', justifyContent: 'center', ...popS(F, K.gpt - 0.15)}}><Logo src="openai.svg" size={210} /></div>
      <div style={{...abs(0, 470), width: '100%', display: 'flex', justifyContent: 'center', ...up(F, K.gpt, 10, 16)}}><T size={46} w={700}>ChatGPT</T></div>
      <div style={{...abs(0, 600), width: '100%', display: 'flex', justifyContent: 'center'}}><Waves F={F} n={9} h={80} on={vis(F, K.marathi4)} /></div>
    </Phone>
    {vis(F, K.marathi4) && <div style={{...abs(90, 720), ...popS(F, K.marathi4)}}><Bubble tail="right"><T size={38}>नमस्कार!</T></Bubble></div>}
    {vis(F, K.marathi4 + 0.35) && <div style={{...abs(640, 980), ...popS(F, K.marathi4 + 0.35)}}><Bubble tail="left"><T size={36}>बोला, काय मदत करू?</T></Bubble></div>}
    {vis(F, K.marathi4) && <div style={{...abs(380, 1450), ...popS(F, K.marathi4 + 0.1)}}><Pill size={38}>मराठी ✓</Pill></div>}
  </AbsoluteFill>
);

/* 3. step 1: open the ChatGPT app */
const APPS = [G.cam, G.msg, G.map, 'gpt', G.music, G.cal, G.photo, G.set];
const Step1 = ({F}) => {
  const a = sc('step1');
  const cx = io(F, s(K.gptapp) - 10, s(K.ughda), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Phone x={250} y={540} w={580} h={900} screen="#F7F6F2">
        <div style={{...abs(40, 140), display: 'grid', gridTemplateColumns: 'repeat(3, 118px)', gap: '46px 44px'}}>
          {APPS.map((g, i) => g === 'gpt' ? (
            <div key={i} style={{position: 'relative', transform: `scale(${vis(F, K.gptapp) ? 1 + 0.12 * pop(F, K.gptapp, 8) : 1})`}}>
              <div style={{width: 118, height: 118, borderRadius: 30, border: `${LW - 1}px solid ${INK}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}><Logo src="openai.svg" size={70} /></div>
            </div>
          ) : <div key={i} style={{opacity: vis(F, K.gptapp) ? 0.35 : 1}}><AppGlyph d={g} /></div>)}
        </div>
        {vis(F, K.gptapp) && <div style={{...abs(22, 430), ...popS(F, K.gptapp + 0.1)}}><Pill size={30}>ChatGPT</Pill></div>}
      </Phone>
      <div style={{...abs(860, 520), ...popS(F, a + 0.1)}}><StepBadge n={1} of={3} /></div>
      {F >= s(K.gptapp) - 10 && <Cursor F={F} x={760 - 394 * cx} y={1300 - 380 * cx} t={K.ughda} size={90} />}
    </AbsoluteFill>
  );
};

/* 4. step 2: tap the voice button at the bottom right */
const Step2 = ({F}) => {
  const a = sc('step2');
  const cx = io(F, s(K.ujvi), s(K.click), 0, 1, Easing.inOut(Easing.quad));
  const on = vis(F, K.click);
  return (
    <AbsoluteFill>
      <Phone x={250} y={540} w={580} h={900}>
        <div style={{...abs(0, 90), width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}><T size={34}>ChatGPT</T><Ico d={<path d="M6 9l6 6 6-6" />} size={30} /></div>
        <div style={{...abs(0, 330), width: '100%', display: 'flex', justifyContent: 'center', opacity: 0.18}}><Logo src="openai.svg" size={150} /></div>
        <div style={{...abs(28, 740), right: 28, height: 100, borderRadius: 50, border: `${LW - 1}px solid ${INK}`, display: 'flex', alignItems: 'center', padding: '0 12px 0 30px', gap: 14, background: '#fff'}}>
          <T size={30} w={500} color={MUTE} style={{flex: 1, paddingTop: 4}}>Ask anything</T>
          <Ico d={G.mic} size={40} />
          <div style={{width: 76, height: 76, borderRadius: 38, background: on ? RED : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: on ? `scale(${0.9 + 0.1 * pop(F, K.click, 8)})` : 'none'}}><Waves F={F} n={4} h={34} color="#fff" gap={5} wd={6} on={on} /></div>
        </div>
      </Phone>
      <div style={{...abs(860, 520), ...popS(F, a + 0.1)}}><StepBadge n={2} of={3} /></div>
      {vis(F, K.ujvi) && <div style={{...abs(650, 1235), width: 170, height: 170, borderRadius: '50%', border: `5px dashed ${RED}`, ...popS(F, K.ujvi)}} />}
      {vis(F, K.voice) && <div style={{...abs(560, 1450), ...popS(F, K.voice)}}><Pill size={36}>Voice बटन</Pill></div>}
      <Cursor F={F} x={940 - 165 * cx} y={1500 - 180 * cx} t={K.click} size={90} />
    </AbsoluteFill>
  );
};

/* 5. step 3: speak your question */
const Q = '"माझ्या दुकानासाठी दिवाळी ऑफरची कल्पना सांगा."';
const Diya = ({size = 160}) => (
  <svg viewBox="0 0 100 80" width={size} height={size * 0.8} style={{display: 'block', overflow: 'visible'}}>
    <path d="M50 8c8 10 10 18 0 26-10-8-8-16 0-26z" fill={YEL} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" /><path d="M50 18c3 5 3 9 0 12-3-3-3-7 0-12z" fill={RED} />
    <path d="M8 44h84c-4 18-22 28-42 28S12 62 8 44z" fill="#D9682B" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M22 52c8 6 48 6 56 0" fill="none" stroke={INK} strokeWidth="3" strokeDasharray="4 6" />
  </svg>
);
const Step3 = ({F}) => {
  const a = sc('step3');
  const txt = typed(F, K.q0, K.sanga + 0.5, Q);
  const breathe = 1 + 0.05 * Math.sin(F / 5);
  return (
    <AbsoluteFill>
      <div style={{...abs(0, 0), width: 1080, height: 1920, transform: 'scale(0.78)', transformOrigin: '540px 520px'}}>
      <Phone x={250} y={540} w={580} h={900} screen="#fff">
        <div style={{...abs(140, 170), width: 300, height: 300, borderRadius: '50%', border: `${LW}px solid ${INK}`, background: `radial-gradient(circle at 35% 30%, #fff, ${SKY} 55%, ${SKY_D})`, transform: `scale(${vis(F, K.bola) ? breathe : 1})`}} />
        <div style={{...abs(0, 540), width: '100%', display: 'flex', justifyContent: 'center'}}><Waves F={F} n={11} h={90} on={vis(F, K.bola)} /></div>
        <div style={{...abs(0, 720), width: '100%', display: 'flex', justifyContent: 'center', gap: 60}}>
          <div style={{width: 90, height: 90, borderRadius: 45, border: `${LW - 1}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={G.mic} size={44} /></div>
          <div style={{width: 90, height: 90, borderRadius: 45, border: `${LW - 1}px solid ${INK}`, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico d={<path d="M6 6l12 12M18 6 6 18" />} size={40} color="#fff" sw={3} /></div>
        </div>
      </Phone>
      </div>
      <div style={{...abs(800, 520), ...popS(F, a + 0.1)}}><StepBadge n={3} of={3} /></div>
      {txt && <div style={{...abs(90, 1270), width: 860}}><Bubble tail="right" style={{background: '#fff'}}><T size={38} w={500} style={{whiteSpace: 'normal', lineHeight: 1.35}}>{txt}</T></Bubble></div>}
      {vis(F, K.diwali) && <div style={{...abs(90, 900), ...popS(F, K.diwali)}}><Diya size={170} /></div>}
    </AbsoluteFill>
  );
};

/* 6. instant answer in Marathi */
const ANS = ['१. ₹999 च्या खरेदीवर दिवाळी गिफ्ट', '२. "दिवाळी कॉम्बो" वर 10% सूट', '३. WhatsApp वर ऑफर पोस्टर पाठवा'];
const Answer = ({F}) => {
  const a = sc('answer');
  return (
    <AbsoluteFill>
      <Panel x={90} y={560} w={880} h={720} r={30}>
        <div style={{padding: '36px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}><Logo src="openai.svg" size={60} /><T size={38}>ChatGPT</T>
            {vis(F, K.kshanat) && <div style={{marginLeft: 'auto', ...popS(F, K.kshanat)}}><Pill bg={RED} size={30}><Ico d={G.bolt} size={30} color="#fff" sw={2.4} />क्षणात</Pill></div>}
          </div>
          <div style={{height: LW, background: INK, margin: '28px 0 30px', borderRadius: 3}} />
          <T size={40} w={700} style={up(F, a + 0.2, 8, 14)}>दिवाळी ऑफर कल्पना:</T>
          {ANS.map((l, i) => <T key={i} size={36} w={500} style={{marginTop: 30, whiteSpace: 'normal', ...up(F, K.kshanat + 0.15 + i * 0.2, 8, 14)}}>{l}</T>)}
        </div>
      </Panel>
      {vis(F, K.uttar) && <div style={{...abs(640, 1330), ...popS(F, K.uttar)}}><Pill size={36}>मराठीत ✓</Pill></div>}
    </AbsoluteFill>
  );
};

/* 7. no typing, no fear of English */
const Cross = ({F, t, size = 300}) => !vis(F, t) ? null : (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{...abs(0, 0), overflow: 'visible'}}>
    {[['M12 12 L88 88', 0], ['M88 12 L12 88', 4]].map(([d, o]) => <path key={d} d={d} stroke={RED} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - io(F, s(t) + o, s(t) + o + 6)} fill="none" />)}
  </svg>
);
const Nofear = ({F}) => {
  const a = sc('nofear');
  return (
    <AbsoluteFill>
      <div style={{...abs(90, 620), width: 420, ...up(F, a + 0.05, 10, 24)}}>
        <Panel x={0} y={0} w={420} h={360} r={26}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}><Ico d={G.key} size={220} sw={1.4} /><div style={{fontFamily: MONO, fontSize: 28, color: MUTE}}>typing</div></div>
        </Panel>
        <div style={{...abs(60, 30)}}><Cross F={F} t={K.typing} /></div>
      </div>
      <div style={{...abs(570, 620), width: 420, ...up(F, a + 0.2, 10, 24)}}>
        <Panel x={0} y={0} w={420} h={360} r={26}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1}}>ABC</div><div style={{fontFamily: MONO, fontSize: 28, color: MUTE, marginTop: 10}}>english</div>
          </div>
        </Panel>
        <div style={{...abs(60, 30)}}><Cross F={F} t={K.english} /></div>
      </div>
      {vis(F, K.nahi13) && <div style={{...abs(0, 1120), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, K.nahi13)}}>
        <Bubble tail="left"><div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ico d={G.mic} size={46} /><T size={42}>फक्त मराठीत बोला</T></div></Bubble>
      </div>}
    </AbsoluteFill>
  );
};

/* 8. farming, health, business, kids' study — ask anything */
const Sprout = () => (<svg viewBox="0 0 100 100" width={150} height={150}><path d="M28 62h44l-6 28H34z" fill="#D9682B" stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M50 62V36" stroke={INK} strokeWidth="4" /><path d="M50 44c-4-12-16-16-26-12 2 12 14 16 26 12z" fill="#5BB85B" stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M50 38c4-14 18-18 28-14-2 14-16 18-28 14z" fill="#5BB85B" stroke={INK} strokeWidth="4" strokeLinejoin="round" /></svg>);
const Health = () => (<svg viewBox="0 0 100 100" width={150} height={150}><path d="M50 84S16 64 16 38a17 17 0 0 1 34-6 17 17 0 0 1 34 6c0 26-34 46-34 46z" fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M22 50h16l6-10 8 20 6-10h18" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Shop = () => (<svg viewBox="0 0 100 100" width={150} height={150}><rect x="18" y="44" width="64" height="42" fill="#fff" stroke={INK} strokeWidth="4" /><path d="M12 22h76l-4 22H16z" fill={BLUE} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M31 22l-3 22M50 22v22M69 22l3 22" stroke="#fff" strokeWidth="4" /><rect x="40" y="58" width="20" height="28" fill={YEL} stroke={INK} strokeWidth="4" /></svg>);
const Book = () => (<svg viewBox="0 0 100 100" width={150} height={150}><path d="M50 30c-10-8-24-8-36-4v54c12-4 26-4 36 4z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M50 30c10-8 24-8 36-4v54c-12-4-26-4-36 4z" fill={SKY} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M50 30v54" stroke={INK} strokeWidth="4" /><path d="M22 42c8-2 16-2 22 1M22 54c8-2 16-2 22 1" stroke={INK} strokeWidth="3" strokeLinecap="round" /></svg>);
const TOPICS = [['शेती', Sprout, 'sheti'], ['आरोग्य', Health, 'arogya'], ['व्यवसाय', Shop, 'vyavsay'], ['अभ्यास', Book, 'abhyas']];
const Topics = ({F}) => (
  <AbsoluteFill>
    {TOPICS.map(([l, Vec, k], i) => {
      const x = 90 + (i % 2) * 470, y = 560 + Math.floor(i / 2) * 420;
      return vis(F, K[k] - 0.1) && (
        <div key={l} style={{...abs(x, y), ...popS(F, K[k] - 0.1)}}>
          <Panel x={0} y={0} w={430} h={360} r={26} style={{position: 'relative'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16}}><Vec /><Pill size={36} bg={i % 2 ? INK : BLUE}>{l}</Pill></div>
          </Panel>
        </div>
      );
    })}
    {vis(F, K.kahihi) && <div style={{...abs(430, 860), width: 220, height: 220, borderRadius: '50%', background: RED, border: `${LW}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(F, K.kahihi, 9)}) rotate(${-10 + swing(F, K.kahihi, 10)}deg)`}}>
      <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 170, color: '#fff', lineHeight: 1, marginTop: 20}}>?</span>
    </div>}
  </AbsoluteFill>
);

/* 9. send this video to parents and friends */
const PEOPLE = [['आई', '#F2C29A', '#3B2A20', 'aaibaba'], ['बाबा', '#E0AD84', '#9A9A9A', 'aaibaba'], ['मित्र', '#D49A72', INK, 'mitra']];
const Share = ({F}) => {
  const a = sc('share');
  const fly = io(F, s(K.pathva), s(K.pathva) + 18, 0, 1, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Panel x={90} y={580} w={900} h={640} r={34} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '34px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Logo src="whatsapp.svg" size={64} /><T size={40}>Share</T></div>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 50}}>
            {PEOPLE.map(([n, skin, hair, k], i) => {
              const on = vis(F, K[k] + (i === 1 ? 0.2 : 0));
              return (
                <div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
                  <div style={{position: 'relative', width: 190, height: 190, borderRadius: '50%', border: `${LW}px solid ${INK}`, background: on ? '#FFF1E0' : '#F4F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible'}}>
                    <Face size={150} skin={skin} hair={hair} />
                    {on && <div style={{...abs(128, -8), width: 64, height: 64, borderRadius: 32, background: GREEN, border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...popS(F, K[k] + (i === 1 ? 0.2 : 0), 10)}}><Ico d={G.check} size={36} color="#fff" sw={3.2} /></div>}
                  </div>
                  <Pill size={34} bg={on ? BLUE : INK}>{n}</Pill>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 54, height: 96, borderRadius: 48, background: '#25D366', border: `${LW}px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, transform: F >= s(K.pathva) - 2 && F < s(K.pathva) + 4 ? 'scale(0.96)' : 'none'}}>
            <Ico d={G.plane} size={42} color={INK} sw={2.6} /><T size={38} w={700}>पाठवा</T>
          </div>
        </div>
      </Panel>
      {fly > 0 && fly < 1 && <div style={{...abs(540 + fly * 520, 1150 - fly * 700), transform: `rotate(${-20 + fly * 10}deg)`}}><Ico d={G.plane} size={110} color={INK} sw={2} /></div>}
    </AbsoluteFill>
  );
};

/* 10. follow for daily AI tricks */
const Follow = ({F}) => {
  const a = sc('follow');
  const done = vis(F, K.follow);
  const cx = io(F, s(a) + 4, s(K.follow), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Panel x={90} y={600} w={900} h={600} r={34} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '44px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <MaiMark size={190} />
          <T size={50} w={700} style={{marginTop: 30}}>Marathi AI Institute</T>
          <div style={{marginTop: 8}}><Serif size={46}>रोजच्या सोप्या AI ट्रिक्स</Serif></div>
          <div style={{marginTop: 40, width: 520, height: 100, borderRadius: 18, border: `${LW}px solid ${INK}`, background: done ? '#fff' : BLUE, color: done ? INK : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 42,
            transform: F >= s(K.follow) - 2 && F < s(K.follow) + 4 ? 'scale(0.95)' : 'none'}}>
            {done ? <><Ico d={G.check} size={42} sw={3} />Following</> : 'Follow'}
          </div>
        </div>
      </Panel>
      {done && [0, 1, 2, 3].map((i) => { const t = K.follow + i * 0.12, p = io(F, s(t), s(t) + 30); return <div key={i} style={{...abs(700 + i * 40, 1050 - p * 360), opacity: 1 - p, transform: `scale(${0.8 + i * 0.1})`}}><svg viewBox="0 0 24 24" width={60} height={60}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={RED} stroke={INK} strokeWidth="1.6" /></svg></div>; })}
      <Cursor F={F} x={830 - 240 * cx} y={1500 - 380 * cx} t={K.follow} size={90} />
    </AbsoluteFill>
  );
};

/* 11. comment "AI" -> free prompt PDF */
const Comment = ({F}) => {
  const a = sc('comment');
  const txt = typed(F, K.AI, K.AI + 0.35, 'AI');
  const posted = vis(F, K.liha + 0.15);
  return (
    <AbsoluteFill>
      <Panel x={90} y={560} w={900} h={360} r={30} style={up(F, a + 0.05, 10, 24)}>
        <div style={{padding: '30px 36px'}}>
          <T size={30} w={500} color={MUTE} style={{fontFamily: MONO}}>comments</T>
          {posted ? <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26, ...up(F, K.liha + 0.15, 8, 14)}}>
            <div style={{width: 76, height: 76, borderRadius: 38, border: `4px solid ${INK}`, overflow: 'hidden', background: '#FFF1E0'}}><Face size={70} /></div>
            <div style={{flex: 1}}><T size={26} w={500} color={MUTE}>you · now</T><T size={48} w={700}>AI</T></div>
            <Ico d={G.heart} size={44} color={RED} sw={2.6} />
          </div> : <div style={{height: 110}} />}
          <div style={{marginTop: 26, height: 96, borderRadius: 48, border: `${LW - 1}px solid ${vis(F, K.AI) && !posted ? RED : INK}`, display: 'flex', alignItems: 'center', padding: '4px 14px 0 32px'}}>
            <div style={{flex: 1}}>{!posted && txt ? <T size={40} w={700}>{txt}<span style={{color: RED, opacity: Math.floor(F / 8) % 2}}>|</span></T> : <T size={32} w={500} color={MUTE}>Add a comment…</T>}</div>
            <div style={{width: 68, height: 68, borderRadius: 34, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -4}}><Ico d={G.plane} size={34} color="#fff" sw={2.4} /></div>
          </div>
        </div>
      </Panel>
      {vis(F, K.free - 0.1) && <div style={{...abs(250, 1000), transform: `rotate(${-4 + swing(F, K.free - 0.1, 6)}deg) scale(${pop(F, K.free - 0.1, 11)})`}}>
        <Panel x={0} y={0} w={580} h={300} r={20} style={{position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, height: '100%', padding: '0 34px'}}>
            <div style={{width: 130, height: 170, borderRadius: 12, border: `${LW}px solid ${INK}`, background: '#fff', position: 'relative', flexShrink: 0}}>
              <div style={{...abs(-14, 90), background: RED, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 30, padding: '6px 14px 2px', borderRadius: 8, border: `3px solid ${INK}`}}>PDF</div>
              {[30, 50, 70].map((y) => <div key={y} style={{...abs(20, y), width: 80, height: 7, borderRadius: 4, background: FAINT}} />)}
            </div>
            <div>
              <Serif size={54}>Free</Serif>
              <T size={40} w={700}>Prompt PDF</T>
              {vis(F, K.lagech) && <div style={{marginTop: 16, ...popS(F, K.lagech)}}><Pill bg={GREEN} size={30}><Ico d={G.dl} size={30} color="#fff" sw={2.6} />DM मध्ये</Pill></div>}
            </div>
          </div>
        </Panel>
      </div>}
    </AbsoluteFill>
  );
};

const Outro = ({F}) => (
  <AbsoluteFill>
    <div style={{...abs(0, 470), width: 1080, display: 'flex', justifyContent: 'center', ...popS(F, OUTRO_AT + 0.05, 11)}}><MaiMark size={260} /></div>
    <div style={{...abs(0, 820), width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', ...up(F, OUTRO_AT + 0.3, 12, 30)}}>
      <T size={84} w={700}>Marathi AI Institute</T>
      <div style={{marginTop: 10}}><Serif size={70}>रोज एक AI ट्रिक</Serif></div>
      <div style={{display: 'flex', gap: 24, marginTop: 50, ...up(F, OUTRO_AT + 0.8, 10, 20)}}><Pill size={40}>Follow करा</Pill><Pill size={40} bg={INK}>Comment “AI”</Pill></div>
    </div>
  </AbsoluteFill>
);

/* ---------- main ---------- */
const COMPS = {pocket: Pocket, gpt: Gpt, step1: Step1, step2: Step2, step3: Step3, answer: Answer, nofear: Nofear, topics: Topics, share: Share, follow: Follow, comment: Comment, outro: Outro};
const LABELS = {pocket: '// 01 · in your pocket', gpt: '// 02 · chatgpt marathi', step1: '// 03 · step one', step2: '// 03 · step two', step3: '// 03 · step three', answer: '// 04 · instant answer',
  nofear: '// 05 · no typing', topics: '// 06 · ask anything', share: '// 07 · share', follow: '// 08 · follow', comment: '// 09 · comment AI'};
const Video = () => <MaiVideo scenes={SCENES} comps={COMPS} labels={LABELS} right="MARATHI AI" chunks={CAPS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
