/*
 * Thumbnails for the construction material video (16:9, rendered 1920x1080, exported 1280x720 JPG).
 * ThumbA: channel dark style.  ThumbB: light paper layout with callouts (same family as the Turf paper thumbnail).
 * Centrepiece: drawn pile of cement bags + a bundle of TMT bars. Bottom-right stays clear for YouTube's time badge.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import {BRAND, WHITE, RED, abs, Ic} from '../../shared/kit.jsx';

const INK = '#141414';
const PAPER = '#F3F0E8';
const C = (s, w = 800, st = '80%', c = INK) => ({fontFamily: 'Anek, sans-serif', fontSize: s, fontWeight: w, fontStretch: st, color: c, lineHeight: 1, whiteSpace: 'nowrap', paddingTop: s * 0.1});

/* ---------- cement bag pile + TMT bundle ---------- */
const BW = 230, BH = 128;
const Bag = ({x, y, k, ink, big}) => (
  <g transform={`translate(${x} ${y}) rotate(${((k * 37) % 7) - 3} ${BW / 2} ${BH / 2})`}>
    <path d={`M14 10 Q${BW / 2} -6 ${BW - 14} 10 Q${BW + 6} ${BH / 2} ${BW - 14} ${BH - 8} Q${BW / 2} ${BH + 8} 14 ${BH - 8} Q-6 ${BH / 2} 14 10 Z`}
      fill="url(#bagG)" stroke={ink ? INK : 'rgba(0,0,0,0.35)'} strokeWidth={ink ? 4 : 2} />
    {big ? <>
      <rect x="26" y={BH / 2 - 30} width={BW - 52} height="60" rx="8" fill={BRAND} stroke={INK} strokeWidth="3" />
      <text x={BW / 2} y={BH / 2 + 18} textAnchor="middle" style={{fontFamily: 'Anek, sans-serif', fontWeight: 800, fontSize: 50, fontStretch: '80%'}} fill={INK}>सिमेंट</text>
    </> : <>
      <rect x="34" y={BH / 2 - 18} width={BW - 68} height="36" rx="6" fill={BRAND} stroke={ink ? INK : 'none'} strokeWidth="2.5" />
      <text x={BW / 2} y={BH / 2 + 10} textAnchor="middle" style={{fontFamily: 'Anek, sans-serif', fontWeight: 700, fontSize: 26, fontStretch: '85%', letterSpacing: 3}} fill={INK}>सिमेंट · 50 KG</text>
    </>}
    <path d={`M22 22 Q${BW / 2} 12 ${BW - 22} 22`} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
  </g>
);
const Pile = ({w = 900, ink, rods = true, big}) => {
  const rows = [4, 3, 2, 1];
  const bags = [];
  rows.forEach((n, r) => {
    for (let i = 0; i < n; i++) bags.push([60 + r * (BW / 2) + i * (BW - 8), 470 - r * (BH - 22), bags.length]);
  });
  const rodsY = [586, 610, 634, 658, 682];
  return (
    <svg viewBox="0 0 1060 720" width={w} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="bagG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9E5DC" /><stop offset="0.6" stopColor="#CFC9BD" /><stop offset="1" stopColor="#ADA699" /></linearGradient>
        <linearGradient id="rodG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D5DCE2" /><stop offset="0.45" stopColor="#97A3AE" /><stop offset="1" stopColor="#5E6973" /></linearGradient>
      </defs>
      <ellipse cx="530" cy={rods ? 700 : 606} rx={rods ? 540 : 500} ry={rods ? 46 : 34} fill={rods ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.16)'} />
      {bags.map(([x, y, k]) => <Bag key={k} x={x} y={y} k={k} ink={ink} big={big} />)}
      {rods && <g transform="rotate(-4 530 600)">
        {rodsY.map((y, i) => (
          <g key={i}>
            <line x1={-20 + (i % 2) * 18} y1={y} x2={1060 - (i % 3) * 14} y2={y} stroke={ink ? INK : '#3A4047'} strokeWidth="19" strokeLinecap="round" />
            <line x1={-20 + (i % 2) * 18} y1={y} x2={1060 - (i % 3) * 14} y2={y} stroke="url(#rodG)" strokeWidth="13" strokeLinecap="round" />
            <line x1={-14 + (i % 2) * 18} y1={y} x2={1054 - (i % 3) * 14} y2={y} stroke="rgba(0,0,0,0.18)" strokeWidth="13" strokeDasharray="2 10" />
          </g>
        ))}
        {[230, 820].map((x) => <rect key={x} x={x} y="570" width="16" height="128" rx="5" fill={BRAND} stroke={INK} strokeWidth="3" />)}
      </g>}
    </svg>
  );
};

/* ---------- A: dark ---------- */
const ThumbA = () => (
  <AbsoluteFill style={{background: '#0E0E0F'}}>
    <AbsoluteFill style={{background: 'radial-gradient(1000px 760px at 1380px 560px, rgba(255,208,20,0.28), rgba(255,208,20,0.06) 55%, transparent 75%)'}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)', backgroundSize: '52px 52px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(1500px 1000px at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
    <div style={abs(820, 250)}><Pile w={1100} /></div>
    <div style={abs(90, 80)}>
      <div style={{display: 'inline-flex', borderRadius: 100, background: BRAND, padding: '14px 34px 4px'}}><div style={C(50, 700, '85%')}>सिमेंट + स्टील बिझनेस</div></div>
      <div style={{...C(96, 600, '85%', WHITE), marginTop: 40}}>एका गोणीमागे फक्त</div>
      <div style={{...C(300, 800, '78%', BRAND), letterSpacing: -6, marginTop: -6, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>₹8</div>
      <div style={{...C(118, 800, '78%', WHITE), marginTop: 6}}>मग करोडोंचा</div>
      <div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
        <svg width="660" height="60" viewBox="0 0 1060 70" preserveAspectRatio="none" style={abs(-10, 96)}>
          <path d="M10 40 C 220 18, 520 28, 760 22 S 1000 30, 1050 26 L 1046 52 C 820 56, 520 50, 260 58 S 40 62, 14 60 Z" fill={BRAND} />
        </svg>
        <div style={{...C(118, 800, '78%', WHITE), position: 'relative'}}>बिझनेस कसा?</div>
      </div>
    </div>
    <div style={abs(90, 990, {display: 'flex', alignItems: 'center', gap: 14})}>
      <div style={{width: 18, height: 18, borderRadius: 5, background: BRAND}} />
      <div style={C(36, 600, '90%', 'rgba(255,255,255,0.85)')}>तरुण उद्योजक</div>
    </div>
  </AbsoluteFill>
);

/* ---------- B: paper with callouts ---------- */
const Callout = ({x, y, icon, glyph, lines, align = 'left', hot}) => (
  <div style={abs(x, y, {display: 'flex', alignItems: 'center', gap: 20, flexDirection: align === 'left' ? 'row' : 'row-reverse', transform: align === 'left' ? 'none' : 'translateX(-100%)',
    background: WHITE, borderRadius: 26, padding: align === 'left' ? '16px 28px 14px 18px' : '16px 18px 14px 28px', border: `3px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`})}>
    <div style={{width: 84, height: 84, borderRadius: 22, background: hot ? RED : BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `3px solid ${INK}`}}>
      {glyph ? <div style={C(56, 800, '85%', hot ? WHITE : INK)}>{glyph}</div> : <Ic n={icon} size={50} color={hot ? WHITE : INK} sw={4} />}
    </div>
    <div style={{textAlign: align}}>{lines.map((l, i) => <div key={i} style={{...C(50, 800, '82%'), marginTop: i ? 4 : 0}}>{l}</div>)}</div>
  </div>
);
const Arrow = ({d}) => <path d={d} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" markerEnd="url(#head)" />;

const ThumbB = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.045) 2px, transparent 2px)', backgroundSize: '64px 64px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(1300px 800px at 50% 58%, rgba(255,208,20,0.18), transparent 60%), radial-gradient(1600px 1000px at 50% 50%, transparent 60%, rgba(0,0,0,0.10) 100%)'}} />
    <div style={abs(1490, 44, {transform: 'rotate(4deg)', opacity: 0.38})}>
      <div style={{...C(40, 400, '90%'), fontStyle: 'italic'}}>300 × ₹8 = ₹2,400</div>
      <div style={{...C(40, 400, '90%'), fontStyle: 'italic', marginTop: 8}}>× 26 दिवस = ₹62,400</div>
    </div>
    <div style={abs(60, 56, {display: 'flex', alignItems: 'center', gap: 12})}>
      <div style={{width: 18, height: 18, borderRadius: 5, background: BRAND, border: `2px solid ${INK}`}} />
      <div style={C(36, 700, '90%')}>तरुण उद्योजक</div>
    </div>
    <div style={abs(0, 40, {width: 1920, textAlign: 'center'})}>
      <div style={C(72, 700, '85%')}>सिमेंट + लोखंडी सळ्यांचा बिझनेस</div>
      <div style={{position: 'relative', display: 'inline-block', marginTop: 26}}>
        <svg width="900" height="60" viewBox="0 0 1060 70" preserveAspectRatio="none" style={abs(-10, 140)}>
          <path d="M10 40 C 220 18, 520 28, 760 22 S 1000 30, 1050 26 L 1046 52 C 820 56, 520 50, 260 58 S 40 62, 14 60 Z" fill={BRAND} />
        </svg>
        <div style={{...C(176, 800, '75%'), position: 'relative', letterSpacing: -2}}>खरं गणित काय?</div>
      </div>
    </div>
    <div style={abs(520, 300)}><Pile w={880} ink /></div>
    {/* price tag on the top bag */}
    <div style={abs(1040, 330, {transform: 'rotate(9deg)', transformOrigin: '0 0'})}>
      <svg width="40" height="60" style={abs(4, -50)}><path d="M20 0 C 10 22, 30 36, 20 58" fill="none" stroke={INK} strokeWidth="3" /></svg>
      <div style={{background: BRAND, border: `4px solid ${INK}`, borderRadius: '14px 40px 40px 14px', padding: '14px 40px 6px 30px', position: 'relative', boxShadow: `6px 6px 0 ${INK}`}}>
        <div style={abs(14, 34, {width: 16, height: 16, borderRadius: 8, background: PAPER, border: `3px solid ${INK}`})} />
        <div style={{...C(70, 800, '80%'), marginLeft: 26}}>₹8 / गोणी</div>
      </div>
    </div>
    <Callout x={56} y={370} glyph="₹" lines={['₹62,400', '/ महिना']} />
    <Callout x={56} y={600} icon="calc" lines={['20 टन =', '₹13.2 लाख']} />
    <Callout x={1864} y={520} icon="lock" lines={['उधारीत', 'पैसे अडकले']} align="right" hot />
    <Callout x={1864} y={735} icon="down" lines={['बाजारभाव', 'घसरला']} align="right" hot />
    <svg width="1920" height="1080" style={abs(0, 0)}>
      <defs><marker id="head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={INK} /></marker></defs>
      <Arrow d="M470 430 C 560 420, 620 460, 680 520" />
      <Arrow d="M470 670 C 560 700, 600 740, 640 800" />
      <Arrow d="M1500 600 C 1440 600, 1400 630, 1370 670" />
      <Arrow d="M1500 800 C 1460 840, 1420 850, 1380 830" />
    </svg>
    <div style={abs(900, 975, {transform: 'translate(-50%,-50%) rotate(-1.6deg)'})}>
      <div style={{background: BRAND, padding: '22px 70px 8px', clipPath: 'polygon(0% 8%, 2% 0%, 5% 6%, 9% 1%, 14% 5%, 20% 0%, 27% 4%, 35% 0%, 44% 5%, 52% 1%, 61% 6%, 70% 0%, 78% 5%, 86% 1%, 93% 6%, 97% 0%, 100% 7%, 99% 50%, 100% 93%, 96% 100%, 90% 95%, 83% 100%, 75% 94%, 66% 100%, 57% 95%, 48% 100%, 39% 94%, 30% 100%, 21% 95%, 13% 100%, 6% 94%, 1% 100%, 0% 92%, 1% 50%)'}}>
        <div style={C(96, 800, '78%')}>₹8 च्या गोणीतून <span style={{color: '#D32A22'}}>करोडोंचा बिझनेस?</span></div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------- C: white, minimal: cement bags (₹8 each) -> pile of cash (₹ crore?) ---------- */
const Money = ({w = 560}) => {
  const rows = [4, 3, 2];
  const out = [];
  rows.forEach((n, r) => { for (let i = 0; i < n; i++) out.push([20 + r * 62 + i * 124, 300 - r * 64]); });
  return (
    <svg viewBox="0 0 540 420" width={w} style={{overflow: 'visible'}}>
      <ellipse cx="270" cy="392" rx="270" ry="26" fill="rgba(0,0,0,0.18)" />
      {out.map(([x, y], k) => (
        <g key={k} transform={`translate(${x} ${y})`}>
          {[12, 6, 0].map((d) => <rect key={d} x={0} y={d + 18} width="120" height="62" rx="6" fill="#E6DFCB" stroke={INK} strokeWidth="3" />)}
          <rect x="6" y="24" width="108" height="50" rx="4" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          <rect x="48" y="18" width="24" height="62" fill={BRAND} stroke={INK} strokeWidth="3" />
          <text x="26" y="58" textAnchor="middle" style={{fontFamily: 'Anek, sans-serif', fontWeight: 800, fontSize: 24}} fill={INK}>₹</text>
          <text x="94" y="58" textAnchor="middle" style={{fontFamily: 'Anek, sans-serif', fontWeight: 800, fontSize: 24}} fill={INK}>₹</text>
        </g>
      ))}
    </svg>
  );
};

const ThumbC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.04) 2px, transparent 2px)', backgroundSize: '64px 64px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(1200px 760px at 50% 62%, rgba(255,208,20,0.20), transparent 62%), radial-gradient(1600px 1000px at 50% 50%, transparent 60%, rgba(0,0,0,0.10) 100%)'}} />
    <div style={abs(60, 56, {display: 'flex', alignItems: 'center', gap: 12})}>
      <div style={{width: 18, height: 18, borderRadius: 5, background: BRAND, border: `2px solid ${INK}`}} />
      <div style={C(36, 700, '90%')}>तरुण उद्योजक</div>
    </div>
    {/* title */}
    <div style={abs(0, 50, {width: 1920, textAlign: 'center'})}>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <svg width="1180" height="80" viewBox="0 0 1060 70" preserveAspectRatio="none" style={abs(-20, 196)}>
          <path d="M10 40 C 220 18, 520 28, 760 22 S 1000 30, 1050 26 L 1046 52 C 820 56, 520 50, 260 58 S 40 62, 14 60 Z" fill={BRAND} />
        </svg>
        <div style={{...C(250, 800, '74%'), position: 'relative', letterSpacing: -3}}>सिमेंट बिझनेस</div>
      </div>
    </div>
    {/* cement bags */}
    <div style={abs(70, 390)}><Pile w={900} ink rods={false} big /></div>
    <div style={abs(700, 400, {transform: 'rotate(8deg)', transformOrigin: '0 0'})}>
      <svg width="40" height="60" style={abs(4, -50)}><path d="M20 0 C 10 22, 30 36, 20 58" fill="none" stroke={INK} strokeWidth="3" /></svg>
      <div style={{background: BRAND, border: `4px solid ${INK}`, borderRadius: '14px 44px 44px 14px', padding: '16px 46px 6px 34px', position: 'relative', boxShadow: `7px 7px 0 ${INK}`}}>
        <div style={abs(14, 40, {width: 18, height: 18, borderRadius: 9, background: PAPER, border: `3px solid ${INK}`})} />
        <div style={{...C(96, 800, '78%'), marginLeft: 28}}>₹8 / गोणी</div>
      </div>
    </div>
    {/* arrow to the cash */}
    <svg width="1920" height="1080" style={abs(0, 0)}>
      <defs><marker id="headC" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={INK} /></marker></defs>
      <path d="M960 720 C 1030 620, 1090 610, 1160 650" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" markerEnd="url(#headC)" />
    </svg>
    {/* cash pile + question */}
    <div style={abs(1160, 450)}><Money w={640} /></div>
    <div style={abs(1480, 360, {transform: 'translateX(-50%) rotate(-4deg)'})}>
      <div style={C(150, 800, '76%', '#D32A22')}>₹ करोड?</div>
    </div>
  </AbsoluteFill>
);

const Root = () => (
  <>
    <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbC" component={ThumbC} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
