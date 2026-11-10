/*
 * YouTube thumbnails for the Turf video (16:9). Rendered at 1920x1080, exported as 1280x720 JPG.
 * ThumbA: myth vs reality ("18 महिने" struck -> "3–4 वर्षं").  ThumbB: hook ("₹20 लाख?" + "थांबा!").
 * Keep the bottom-right corner clear: YouTube puts the duration badge there.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import {BRAND, WHITE, INK, RED, F, abs, Turf, Ic} from '../../shared/kit.jsx';

const DONE = 30; // a time well after every draw-on animation, so the turf is complete

const Back = ({gx = 1380, gy = 520}) => (
  <>
    <AbsoluteFill style={{background: '#0E0E0F'}} />
    <AbsoluteFill style={{background: `radial-gradient(900px 640px at ${gx}px ${gy}px, rgba(255,208,20,0.26), rgba(255,208,20,0.06) 55%, transparent 75%)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)', backgroundSize: '52px 52px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(1500px 1000px at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)'}} />
  </>
);

const Big = ({s, w = 700, c = WHITE, style, children}) => (
  <div style={{...F, fontSize: s, fontWeight: w, color: c, letterSpacing: -s * 0.02, paddingTop: s * 0.1, textShadow: '0 8px 30px rgba(0,0,0,0.6)', ...style}}>{children}</div>
);

const Chip = ({children}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, borderRadius: 100, background: BRAND, padding: '16px 34px 8px'}}>
    <Big s={52} w={700} c={INK} style={{textShadow: 'none'}}>{children}</Big>
  </div>
);

const Mark = () => (
  <div style={abs(90, 980, {display: 'flex', alignItems: 'center', gap: 14})}>
    <div style={{width: 18, height: 18, borderRadius: 5, background: BRAND}} />
    <div style={{...F, fontSize: 36, fontWeight: 600, color: 'rgba(255,255,255,0.85)', paddingTop: 6}}>तरुण उद्योजक</div>
  </div>
);

/* A: myth vs reality */
const ThumbA = () => (
  <AbsoluteFill>
    <Back gx={1400} gy={560} />
    <div style={abs(900, 250, {transform: 'rotate(-4deg)'})}><Turf t={DONE} at={0} w={1080} id="a" /></div>
    <div style={abs(90, 90)}>
      <Chip>Turf बिझनेस</Chip>
      <Big s={250} w={700} c={BRAND} style={{marginTop: 36}}>₹20 लाख</Big>
      <Big s={140} w={700} style={{marginTop: 4}}>वसूल कधी?</Big>
    </div>
    <div style={abs(90, 720, {display: 'flex', alignItems: 'center', gap: 44})}>
      <div style={{position: 'relative'}}>
        <Big s={100} w={600} c="rgba(255,255,255,0.85)">18 महिने</Big>
        <div style={abs(-6, 62, {width: 350, height: 14, background: RED, borderRadius: 7, transform: 'rotate(-6deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)'})} />
      </div>
      <svg width="90" height="60" viewBox="0 0 90 60"><path d="M6 30h66M54 10l20 20-20 20" fill="none" stroke={WHITE} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{background: RED, borderRadius: 26, padding: '6px 30px 0', transform: 'rotate(-3deg)', boxShadow: '0 16px 40px rgba(255,90,82,0.35)'}}>
        <Big s={110} w={700} style={{textShadow: 'none'}}>3–4 वर्षं!</Big>
      </div>
    </div>
    <Mark />
  </AbsoluteFill>
);

/* B: hook */
const ThumbB = () => (
  <AbsoluteFill>
    <Back gx={1300} gy={460} />
    <div style={abs(930, 300, {transform: 'rotate(-3deg)'})}><Turf t={DONE} at={0} w={980} id="b" /></div>
    <div style={abs(90, 150)}>
      <Big s={130} w={700}>Turf साठी</Big>
      <Big s={270} w={700} c={BRAND} style={{marginTop: 0}}>₹20 लाख?</Big>
    </div>
    <div style={abs(1380, 800, {transform: 'translate(-50%,-50%) rotate(-7deg)'})}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, background: BRAND, border: `10px solid ${INK}`, outline: `6px solid ${BRAND}`, borderRadius: 34, padding: '14px 46px 0', boxShadow: '0 30px 80px rgba(0,0,0,0.7)'}}>
        <Ic n="x" size={100} color={INK} sw={7} />
        <Big s={170} w={800} c={INK} style={{textShadow: 'none'}}>थांबा!</Big>
      </div>
    </div>
    <div style={abs(90, 640)}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 20, borderRadius: 24, border: `4px solid ${RED}`, background: 'rgba(255,90,82,0.14)', padding: '18px 30px 8px'}}>
        <Big s={72} w={600}>आधी हे गणित बघा</Big>
      </div>
    </div>
    <Mark />
  </AbsoluteFill>
);

const Root = () => (
  <>
    <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
