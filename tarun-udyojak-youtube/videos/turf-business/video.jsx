/*
 * Turf Business: the real economics (Marathi, 4:27, 16:9) — Tarun Udyojak.
 * Every cue is in VO seconds, looked up from timing.json (scripts/align_vo.py):
 *   S(i) = sentence i start, E(i) = end, WT(i, 'word', n) = time of the n-th word containing 'word' in sentence i.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Audio, staticFile, Easing} from 'remotion';
import TIMING from './timing.json';
import {
  FPS, BRAND, WHITE, INK, MUTED, DIM, FAINT, RED, SKY, VIOLET, F, abs, fr, inr,
  useT, io, pop, rise, fade, OUT, INOUT, Bg, Chrome, Scenes, Card, Eyebrow, Head, Hi, Stamp, Count, Chip, Ic, draw,
} from '../../shared/kit.jsx';

const S = (i) => TIMING[i].start;
const E = (i) => TIMING[i].end;
const WT = (i, frag, n = 0) => {
  const hits = TIMING[i].words.filter(([, w]) => w.includes(frag));
  return (hits[n] || hits[0] || [TIMING[i].start])[0];
};
const cut = (i) => (i === 0 ? 0 : (E(i - 1) + S(i)) / 2);
const TOTAL = 267; // VO ends at 263.0 + end card hold

const Row = ({children, gap = 24, style}) => <div style={{display: 'flex', alignItems: 'center', gap, ...style}}>{children}</div>;
const T = ({s = 40, w = 400, c = WHITE, style, children}) => <div style={{...F, fontSize: s, fontWeight: w, color: c, paddingTop: s * 0.12, ...style}}>{children}</div>;

/* ============ 01 Hook ============ */
const Turf = ({t, at = 0.2, w = 820}) => {
  const P = (u, v) => [120 + 80 * v + (560 - 160 * v) * u, 470 - 270 * v];
  const pts = (arr) => arr.map(([u, v]) => P(u, v).join(',')).join(' ');
  const ln = (a, b, d) => {
    const [x1, y1] = P(...a), [x2, y2] = P(...b);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WHITE} strokeWidth="3" strokeLinecap="round" {...draw(io(t, at + d, at + d + 0.7))} />;
  };
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const lamp = (i) => io(t, at + 1.1 + i * 0.15, at + 1.3 + i * 0.15);
  const [cx, cy] = P(0.5, 0.5);
  return (
    <svg viewBox="0 0 800 560" width={w} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="lg"><stop offset="0" stopColor={BRAND} stopOpacity="0.9" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BRAND} stopOpacity="0.22" /><stop offset="1" stopColor={BRAND} stopOpacity="0" /></linearGradient>
      </defs>
      <polygon points={`${P(0, 0)} ${P(1, 0)} ${P(1, 0)[0]},${P(1, 0)[1] + 34} ${P(0, 0)[0]},${P(0, 0)[1] + 34}`} fill="#1b1b1d" opacity={io(t, at, at + 0.4)} />
      {Array.from({length: 8}).map((_, i) => (
        <polygon key={i} points={pts([[0, i / 8], [1, i / 8], [1, (i + 1) / 8], [0, (i + 1) / 8]])} fill={i % 2 ? '#232326' : '#1d1d20'} opacity={io(t, at, at + 0.4)} />
      ))}
      {corners.map((c, i) => <React.Fragment key={i}>{ln(c, corners[(i + 1) % 4], 0.1 * i)}</React.Fragment>)}
      {ln([0, 0.5], [1, 0.5], 0.4)}
      {ln([0.3, 0], [0.3, 0.14], 0.5)}{ln([0.7, 0], [0.7, 0.14], 0.5)}{ln([0.3, 0.14], [0.7, 0.14], 0.55)}
      {ln([0.3, 1], [0.3, 0.86], 0.5)}{ln([0.7, 1], [0.7, 0.86], 0.5)}{ln([0.3, 0.86], [0.7, 0.86], 0.55)}
      <ellipse cx={cx} cy={cy} rx="66" ry="20" fill="none" stroke={WHITE} strokeWidth="3" {...draw(io(t, at + 0.6, at + 1.2))} />
      {/* fence posts + top rail */}
      {[0, 0.25, 0.5, 0.75, 1].flatMap((u) => [[u, 0], [u, 1]]).concat([[0, 0.33], [0, 0.66], [1, 0.33], [1, 0.66]]).map(([u, v], i) => {
        const [x, y] = P(u, v); const hgt = 70 - 20 * v;
        return <line key={i} x1={x} y1={y} x2={x} y2={y - hgt * io(t, at + 0.8, at + 1.2)} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />;
      })}
      <polyline points={corners.concat([corners[0]]).map(([u, v]) => { const [x, y] = P(u, v); return `${x},${y - (70 - 20 * v)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" opacity={io(t, at + 1.0, at + 1.3)} />
      {/* floodlights */}
      {corners.map(([u, v], i) => {
        const [x, y] = P(u, v); const top = y - (190 - 50 * v); const on = lamp(i);
        return (
          <g key={i}>
            <polygon points={`${x - 16},${top} ${x + 16},${top} ${P(0.5, 0.5)[0] + (x - cx) * 0.2},${cy + 20} ${P(0.5, 0.5)[0] + (x - cx) * 0.55},${cy + 40}`} fill="url(#beam)" opacity={on * 0.9} />
            <line x1={x} y1={y} x2={x} y2={top} stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy={top} r={46} fill="url(#lg)" opacity={on * (0.85 + 0.15 * Math.sin(t * 6 + i))} />
            <rect x={x - 18} y={top - 9} width="36" height="16" rx="4" fill={on > 0.5 ? BRAND : '#444'} />
          </g>
        );
      })}
      {/* ball */}
      <circle cx={cx + Math.sin(t * 1.6) * 90} cy={cy - 6 - Math.abs(Math.sin(t * 3.2)) * 30} r="9" fill={WHITE} opacity={io(t, at + 1.4, at + 1.7)} />
    </svg>
  );
};
const Hook = () => {
  const t = useT();
  const stop = S(1);
  const shake = t > stop && t < stop + 0.35 ? Math.sin(t * 90) * 8 * (1 - (t - stop) / 0.35) : 0;
  const dimmed = io(t, stop, stop + 0.2, 1, 0.35);
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <div style={{opacity: dimmed}}>
        <div style={abs(140, 250)}>
          <T s={60} w={500} c={MUTED} style={rise(t, 0.05)}>तुम्ही</T>
          <div style={{...F, fontSize: 190, fontWeight: 600, color: BRAND, letterSpacing: -4, marginTop: 6, ...rise(t, 0.25)}}>
            <Count t={t} a={WT(0, '२०') - 0.1} b={WT(0, '२०') + 0.9} from={0} to={20} fmt={(n) => `₹${Math.round(n)} लाख`} />
          </div>
          <T s={64} w={600} style={{marginTop: 14, ...rise(t, WT(0, 'गुंतवून') - 0.1)}}>गुंतवून स्वतःचं Turf</T>
          <T s={64} w={600} style={{marginTop: 10, ...rise(t, WT(0, 'सुरू') - 0.1)}}>सुरू करणार आहात?</T>
        </div>
        <div style={abs(980, 240, {transform: `translateY(${Math.sin(t * 1.4) * 8}px)`})}><Turf t={t} at={0.2} /></div>
      </div>
      <Stamp at={stop - 0.08} x={960} y={540} color={BRAND} rot={-6} size={150}>थांबा!</Stamp>
    </AbsoluteFill>
  );
};

/* ============ 02 Mistake ============ */
const Mistake = () => {
  const t = useT();
  const a = S(2), coins = WT(2, 'पैसे'), oops = WT(2, 'चूक') - 0.2;
  return (
    <AbsoluteFill>
      <Head at={a} eyebrow="बहुतेक लोक" icon="users" lines={[<>Turf म्हणजे</>, <Hi at={WT(2, 'Real') - 0.1}>Real Estate बिझनेस?</Hi>]} y={250} size={84} />
      <T s={40} c={MUTED} style={{...abs(144, 560), ...rise(t, coins - 0.2)}}>असं समजून त्यात पैसे टाकतात…</T>
      <Card x={1120} y={210} w={600} h={600} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', ...rise(t, a + 0.3)}}>
        <div style={{transform: `scale(${0.9 + 0.1 * pop(t, a + 0.3)})`}}><Ic n="building" size={300} color={WHITE} sw={2.6} /></div>
        <T s={34} c={MUTED} style={abs(0, 520, {width: 600, textAlign: 'center'})}>Real Estate</T>
      </Card>
      {Array.from({length: 7}).map((_, i) => {
        const st = coins + i * 0.22; const p = io(t, st, st + 0.8, 0, 1, Easing.in(Easing.quad));
        if (t < st || p >= 1) return null;
        return <div key={i} style={abs(1300 + (i % 3) * 90, 120 + p * 360, {width: 64, height: 64, borderRadius: 32, background: BRAND, ...F, color: INK, fontSize: 36, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, boxSizing: 'border-box', opacity: 1 - p * 0.6})}>₹</div>;
      })}
      {t > oops && <div style={abs(1120, 210, {width: 600, height: 600, borderRadius: 34, background: `rgba(255,90,82,${0.12 * io(t, oops, oops + 0.3)})`, border: `3px solid ${RED}`, opacity: io(t, oops, oops + 0.3)})} />}
      <Stamp at={oops} x={1420} y={510} size={70}>सर्वात मोठी चूक</Stamp>
    </AbsoluteFill>
  );
};

/* ============ 03 Internet claim ============ */
const Bubble = ({t, at, x, y, name, text}) => (
  <div style={abs(x, y, {display: 'flex', gap: 20, alignItems: 'flex-start', ...rise(t, at)})}>
    <div style={{width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic n="user" size={36} color={MUTED} /></div>
    <div style={{background: 'rgba(255,255,255,0.08)', border: `1.5px solid ${FAINT}`, borderRadius: '8px 28px 28px 28px', padding: '18px 28px 12px'}}>
      <T s={24} c={DIM} w={500}>{name}</T>
      <T s={40} w={500} style={{marginTop: 4}}>{text}</T>
    </div>
  </div>
);
const Claim = () => {
  const t = useT();
  const a = S(3), b = S(4);
  const q = io(t, b - 0.1, b + 0.4);
  const typed = 'Turf business किती दिवसांत पैसे वसूल?';
  const n = Math.floor(io(t, a + 0.1, a + 1.6, 0, typed.length, Easing.linear));
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - 0.55 * q}}>
        <Card x={140} y={170} w={900} h={100} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', boxSizing: 'border-box', ...rise(t, a - 0.1)}}>
          <Ic n="search" size={40} color={MUTED} />
          <T s={38} w={400}>{typed.slice(0, n)}<span style={{opacity: Math.floor(t * 2.5) % 2 ? 1 : 0, color: BRAND}}>|</span></T>
        </Card>
        <Bubble t={t} at={WT(3, 'सांगतील') - 0.2} x={140} y={330} name="इंटरनेटवर कोणीतरी" text="१२ महिन्यांत पैसे वसूल!" />
        <Bubble t={t} at={WT(3, '१८')} x={210} y={490} name="आणखी एक व्हिडिओ" text="१८ महिन्यांत ₹20 लाख कव्हर!" />
        <Bubble t={t} at={WT(3, 'कव्हर') - 0.3} x={140} y={650} name="कमेंट" text="Turf = पैसे छापायचं मशीन 🔥" />
      </div>
      {/* calendar */}
      <div style={abs(1200, 190, {transform: `rotate(${3 * (1 - q) - 2 * q}deg) scale(${pop(t, WT(3, '१२') - 0.15)})`})}>
        <div style={{width: 520, height: 520, borderRadius: 40, background: '#F5F3EE', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
          <div style={{height: 110, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T s={40} w={600} c={INK}>Recovery Time</T></div>
          <div style={{textAlign: 'center', marginTop: 70}}>
            <T s={150} w={700} c={INK} style={{letterSpacing: -4}}>12–18</T>
            <T s={70} w={600} c={INK} style={{marginTop: 10}}>महिने</T>
          </div>
        </div>
        {[150, 370].map((x) => <div key={x} style={abs(x, -24, {width: 22, height: 70, borderRadius: 11, background: '#2a2a2c', border: '4px solid #0E0E0F'})} />)}
        {q > 0 && <div style={abs(420, -40, {width: 140, height: 140, borderRadius: 70, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, b)})`, boxShadow: '0 12px 40px rgba(255,90,82,0.5)'})}><T s={100} w={700} c={WHITE}>?</T></div>}
      </div>
      <div style={abs(140, 830, {opacity: q})}>
        <Row gap={30}>
          <T s={64} w={600} style={rise(t, b)}>पण <Hi at={WT(4, 'प्रत्यक्षात')}>प्रत्यक्षात</Hi> असं का होत नाही?</T>
        </Row>
        <div style={{marginTop: 26, ...rise(t, WT(4, 'पुराव्यानिशी') - 0.3)}}><Eyebrow icon="search">आज पुराव्यानिशी बघूया: खरं अर्थशास्त्र</Eyebrow></div>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 04 Not real estate -> Airline ============ */
const Swap = () => {
  const t = useT();
  const a = S(5), strike = WT(5, 'इस्टेट'), air = WT(6, 'Airline') - 0.2, how = S(7);
  const out = io(t, air - 0.4, air + 0.1);
  const inn = pop(t, air);
  const fly = io(t, air, air + 3.5, 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <T s={44} c={MUTED} w={500} style={{...abs(140, 170), ...rise(t, a)}}>सगळ्यात आधी हे डोक्यातून काढून टाका</T>
      <T s={150} w={600} style={{...abs(140, 400), ...rise(t, a + 0.2)}}>Turf =</T>
      {/* real estate card */}
      <Card x={760} y={300} w={1000} h={360} style={{display: 'flex', alignItems: 'center', gap: 50, padding: '0 70px', boxSizing: 'border-box', opacity: 1 - out, transform: `translateY(${out * 120}px) rotate(${out * -4}deg)`, ...{}}}>
        <Chip n="building" size={180} r={44} />
        <div>
          <T s={30} c={MUTED}>बहुतेकांना वाटतं</T>
          <T s={96} w={600} style={{marginTop: 10}}>Real Estate</T>
        </div>
        <svg width="900" height="20" style={abs(50, 170)}><line x1="0" y1="10" x2="900" y2="10" stroke={RED} strokeWidth="10" strokeLinecap="round" {...draw(io(t, strike, strike + 0.4))} /></svg>
      </Card>
      {/* airline card */}
      {t > air - 0.1 && (
        <Card glow x={760} y={300} w={1000} h={360} style={{display: 'flex', alignItems: 'center', gap: 50, padding: '0 70px', boxSizing: 'border-box', opacity: Math.min(1, inn * 1.4), transform: `translateY(${(1 - inn) * -80}px) scale(${0.9 + 0.1 * inn})`}}>
          <Chip n="plane" size={180} r={44} color={INK} bg={BRAND} />
          <div>
            <T s={30} c={BRAND} w={500}>खऱ्या अर्थाने</T>
            <T s={110} w={600} style={{marginTop: 10}}>Airline</T>
            <T s={36} c={MUTED} style={{marginTop: 14, ...fade(t, WT(6, 'विमानाच्या'))}}>म्हणजे विमानाचा बिझनेस</T>
          </div>
        </Card>
      )}
      {/* plane crossing */}
      {t > air && t < air + 3.6 && (
        <div style={abs(-200 + fly * 2400, 860 - fly * 140 - Math.sin(fly * Math.PI) * 60, {transform: 'rotate(-4deg)', opacity: 0.9})}>
          <svg width="2400" height="10" style={abs(-2400, 30, {})}><line x1="0" y1="5" x2="2380" y2="5" stroke="rgba(255,208,20,0.5)" strokeWidth="4" strokeDasharray="14 14" /></svg>
          <div style={{transform: 'rotate(45deg)'}}><Ic n="plane" size={80} color={BRAND} /></div>
        </div>
      )}
      <div style={abs(760, 740, rise(t, how))}><Eyebrow icon="search">कसं? ते नीट समजून घ्या</Eyebrow></div>
    </AbsoluteFill>
  );
};

/* ============ 05 Plane + seat map ============ */
const SEATS = (() => { // 20 x 6, 50 empty, deterministic
  const out = []; let r = 7;
  for (let i = 0; i < 120; i++) out.push(false);
  let c = 0;
  while (c < 50) { r = (r * 9301 + 49297) % 233280; const k = Math.floor((r / 233280) * 120); if (!out[k]) { out[k] = true; c++; } }
  return out;
})();
const Plane = () => {
  const t = useT();
  const a = S(8), go = WT(8, 'निघालं'), fifty = WT(8, '५०') - 0.1, loss = WT(8, 'नुकसान') - 0.1, up = S(9), same = S(10);
  const P0 = [300, 330], P1 = [1640, 230], Cp = [970, 40];
  const k = io(t, go - 0.3, up + 2.6, 0, 1, Easing.inOut(Easing.cubic));
  const bx = (1 - k) ** 2 * P0[0] + 2 * (1 - k) * k * Cp[0] + k * k * P1[0];
  const by = (1 - k) ** 2 * P0[1] + 2 * (1 - k) * k * Cp[1] + k * k * P1[1];
  const dx = 2 * (1 - k) * (Cp[0] - P0[0]) + 2 * k * (P1[0] - Cp[0]);
  const dy = 2 * (1 - k) * (Cp[1] - P0[1]) + 2 * k * (P1[1] - Cp[1]);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const lost = io(t, loss, loss + 0.5);
  return (
    <AbsoluteFill>
      <svg width="1920" height="460" style={abs(0, 0)}>
        <path d={`M${P0} Q${Cp} ${P1}`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeDasharray="4 16" strokeLinecap="round" opacity={io(t, a, a + 0.5)} />
        <path d={`M${P0} Q${Cp} ${P1}`} fill="none" stroke={BRAND} strokeWidth="5" strokeLinecap="round" {...draw(k)} />
      </svg>
      {[[P0, 'मुंबई', WT(8, 'मुंबईहून')], [P1, 'दिल्ली', WT(8, 'दिल्लीला')]].map(([[x, y], name, at]) => (
        <div key={name} style={abs(x - 22, y - 22, {transform: `scale(${pop(t, at - 0.2)})`})}>
          <div style={{width: 44, height: 44, borderRadius: 22, background: BRAND, border: '8px solid rgba(255,208,20,0.25)', boxSizing: 'border-box'}} />
          <T s={40} w={600} style={abs(-10, 56)}>{name}</T>
        </div>
      ))}
      <div style={abs(bx - 45, by - 45, {transform: `rotate(${ang + 45}deg)`, opacity: io(t, a, a + 0.4)})}><Ic n="plane" size={90} color={WHITE} sw={3} /></div>
      {/* seat map */}
      <Card x={140} y={470} w={1640} h={430} style={rise(t, a + 0.3)}>
        <div style={abs(50, 36, {display: 'flex', alignItems: 'center', gap: 22})}>
          <T s={36} w={600}>सीट्स</T>
          <div style={{opacity: io(t, fifty, fifty + 0.3), display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 26, height: 26, borderRadius: 7, border: `3px dashed ${lost > 0.5 ? RED : WHITE}`}} />
            <T s={34} w={500} c={lost > 0.5 ? RED : WHITE}>५० रिकाम्या</T>
          </div>
        </div>
        {SEATS.map((empty, i) => {
          const col = i % 20, row = Math.floor(i / 20);
          const x = 60 + col * 77, y = 110 + row * 46 + (row >= 3 ? 34 : 0);
          const shown = io(t, a + 0.4 + col * 0.03, a + 0.7 + col * 0.03);
          const e = empty ? io(t, fifty + col * 0.02, fifty + 0.3 + col * 0.02) : 0;
          const red = empty ? lost : 0;
          return (
            <div key={i} style={abs(x, y, {
              width: 60, height: 36, borderRadius: '10px 10px 6px 6px', opacity: shown,
              background: e > 0.5 ? (red > 0.5 ? 'rgba(255,90,82,0.18)' : 'transparent') : 'rgba(255,255,255,0.85)',
              border: e > 0.5 ? `3px dashed ${red > 0.5 ? RED : 'rgba(255,255,255,0.6)'}` : '3px solid transparent', boxSizing: 'border-box',
            })} />
          );
        })}
      </Card>
      <Stamp at={loss + 0.4} x={1440} y={520} size={52}>नुकसान कायमचं</Stamp>
      {t > up && (
        <div style={abs(160, 930, {display: 'flex', gap: 40, alignItems: 'center', ...rise(t, up)})}>
          <Row gap={16}><Ic n="lock" size={40} color={RED} /><T s={40} w={500}>विमान उडालं की त्या सीट्स <span style={{color: RED}}>परत विकता येत नाहीत</span></T></Row>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============ 06 The lost hour ============ */
const SLOTS = [['6–7', 1], ['7–8', 0], ['8–9', 1], ['9–10', 1], ['10–11', 1], ['11–12', 0]];
const Hour = () => {
  const t = useT();
  const a = S(11), passA = WT(11, 'वेळ'), passB = WT(11, 'नाही'), zero = WT(11, 'झिरो') - 0.15, back = S(12), costs = S(13);
  const cx = 160 + 15 + io(t, a + 0.3, passB + 0.2, 0, 1, Easing.linear) * 1590; // cursor
  const hit = io(t, passB - 0.6, passB);
  const items = [['home', 'जागेचं भाडं', WT(13, 'भाडं')], ['bolt', 'लाईट बिल', WT(13, 'लाईट')], ['grass', 'ग्रास मेंटेनन्स', WT(13, 'ग्रासचा')], ['users', 'कामगारांचा पगार', WT(13, 'कामगारांचा')]];
  return (
    <AbsoluteFill>
      <Head at={a - 0.1} eyebrow="Turf = विमान, स्लॉट = सीट" icon="plane" lines={[<>रिकामा स्लॉट = <span style={{color: RED}}>शून्य उत्पन्न</span></>]} y={130} size={64} />
      <div style={abs(160, 330, {display: 'flex', gap: 22})}>
        {SLOTS.map(([lab, booked], i) => {
          const isTarget = i === 1;
          const dead = isTarget ? hit : 0;
          return (
            <div key={lab} style={{width: 250, height: 150, borderRadius: 26, boxSizing: 'border-box', position: 'relative', ...rise(t, a + 0.1 + i * 0.07),
              background: booked ? BRAND : dead > 0.5 ? 'rgba(255,90,82,0.16)' : 'rgba(255,255,255,0.04)',
              border: booked ? 'none' : `3px dashed ${dead > 0.5 ? RED : 'rgba(255,255,255,0.3)'}`}}>
              <T s={44} w={600} c={booked ? INK : WHITE} style={abs(26, 24)}>{lab} PM</T>
              <T s={30} w={500} c={booked ? INK : dead > 0.5 ? RED : MUTED} style={abs(26, 90)}>{booked ? 'बुक्ड ✓' : dead > 0.5 ? 'कोणीच नाही' : 'रिकामा'}</T>
            </div>
          );
        })}
      </div>
      {/* time cursor */}
      <div style={abs(cx, 300, {width: 4, height: 210, background: WHITE, borderRadius: 2, opacity: io(t, a + 0.2, a + 0.5) * io(t, back + 0.5, back + 1, 1, 0)})}>
        <div style={abs(-26, -50, {width: 56, height: 56, borderRadius: 28, background: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Ic n="clock" size={36} color={INK} /></div>
      </div>
      {/* income card */}
      <Card x={160} y={560} w={560} h={300} style={rise(t, passB - 0.3)}>
        <T s={32} c={MUTED} style={abs(40, 40)}>7–8 PM ची इन्कम</T>
        <div style={abs(40, 110, {...F, fontSize: 130, fontWeight: 700, color: t > zero ? RED : WHITE, letterSpacing: -3})}>
          {t < zero ? '₹1,200' : '₹0'}
        </div>
        {t > zero && <T s={34} w={600} c={RED} style={abs(330, 150)}>कायमची झिरो</T>}
      </Card>
      {t > back - 0.2 && (
        <div style={abs(160, 900, {...rise(t, back - 0.2)})}>
          <Row gap={18}>
            <div style={{position: 'relative'}}><Ic n="rewind" size={46} color={MUTED} /><div style={abs(-6, 20, {width: 60, height: 5, background: RED, transform: 'rotate(-30deg)', borderRadius: 3})} /></div>
            <T s={38} w={500}>गेलेला तास परत आणता येत नाही</T>
          </Row>
        </div>
      )}
      {/* costs keep running */}
      <div style={abs(800, 560, {opacity: io(t, costs - 0.2, costs + 0.3)})}>
        <T s={34} w={500} c={MUTED}>पण हे खर्च मात्र <span style={{color: BRAND}}>सुरूच</span> राहतात</T>
        <div style={{display: 'grid', gridTemplateColumns: '470px 470px', gap: 20, marginTop: 24}}>
          {items.map(([ic, lab, at], i) => (
            <div key={lab} style={{height: 120, borderRadius: 26, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${FAINT}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', ...rise(t, at - 0.15)}}>
              <Chip n={ic} size={70} />
              <div style={{flex: 1}}>
                <T s={34} w={500}>{lab}</T>
                <Row gap={10} style={{marginTop: 8}}>
                  <div style={{width: 12, height: 12, borderRadius: 6, background: RED, opacity: 0.5 + 0.5 * Math.sin(t * 8 + i)}} />
                  <T s={24} c={MUTED}>मीटर चालू</T>
                </Row>
              </div>
              <div style={abs(0, 116, {height: 4, width: `${((t * 30 + i * 25) % 100)}%`, background: RED, opacity: 0.7})} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 07 Chapter: the real math ============ */
const MathTitle = () => {
  const t = useT();
  const a = S(14);
  const sym = ['₹', '+', '−', '÷', '=', '%', '₹', '×'];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {sym.map((c, i) => {
        const ang = (i / sym.length) * Math.PI * 2 + t * 0.25;
        const r = 520 + 40 * Math.sin(t + i);
        return <div key={i} style={abs(960 + Math.cos(ang) * r - 30, 520 + Math.sin(ang) * r * 0.55 - 40, {...F, fontSize: 80, fontWeight: 600, color: i % 3 ? 'rgba(255,255,255,0.14)' : 'rgba(255,208,20,0.4)', opacity: io(t, a + i * 0.05, a + 0.4 + i * 0.05)})}>{c}</div>;
      })}
      <div style={{textAlign: 'center'}}>
        <div style={{display: 'inline-flex', transform: `scale(${pop(t, a)})`}}><Chip n="calc" size={150} r={44} color={INK} bg={BRAND} /></div>
        <T s={170} w={600} style={{marginTop: 30, ...rise(t, a + 0.15)}}>खरं गणित</T>
        <T s={44} c={MUTED} style={{marginTop: 22, ...rise(t, WT(14, 'शांतपणे') - 0.2)}}>शांतपणे समजून घ्या</T>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 08 ₹1,200 breakdown ============ */
const Breakdown = () => {
  const t = useT();
  const a = S(15), pocket = S(16), no = S(17), keep = WT(19, 'हातात') - 0.2;
  const rows = [['bolt', 'लाईट बिल', 100, WT(18, 'लाईटचे') - 0.2], ['phone', 'बुकिंग ॲप कमिशन', 50, WT(18, 'बुकिंग') - 0.2], ['grass', 'ग्रास मेंटेनन्स', 50, WT(18, 'ग्रास') - 0.2]];
  let val = io(t, WT(15, '१२००') - 0.3, WT(15, '१२००') + 0.6, 0, 1200);
  rows.forEach(([, , v, at]) => { val -= io(t, at + 0.2, at + 0.7, 0, v); });
  const final = t > keep;
  const fly = io(t, pocket + 0.2, pocket + 1.6, 0, 1, Easing.inOut(Easing.quad));
  const blocked = io(t, no - 0.1, no + 0.2);
  return (
    <AbsoluteFill>
      <div style={abs(150, 220)}>
        <div style={rise(t, a - 0.1)}><Eyebrow icon="clock">१ तासाचं बुकिंग</Eyebrow></div>
        <div style={{...F, fontSize: 210, fontWeight: 600, letterSpacing: -5, marginTop: 40, color: final ? BRAND : WHITE, ...fade(t, a)}}>{inr(val)}</div>
        <div style={{marginTop: 40, ...rise(t, pocket)}}>
          <Row gap={22}>
            <Chip n="wallet" size={86} color={blocked > 0.5 ? RED : BRAND} bg={blocked > 0.5 ? 'rgba(255,90,82,0.12)' : 'rgba(255,208,20,0.12)'} />
            <T s={46} w={500} c={MUTED}>थेट मालकाच्या खिशात?</T>
          </Row>
          {blocked > 0 && <T s={50} w={600} c={RED} style={{marginTop: 26, opacity: blocked}}>पण असं नसतं.</T>}
        </div>
      </div>
      {/* coins flying to the wallet (before "पण असं नसतं") */}
      {t > pocket && t < no + 0.3 && [0, 1, 2].map((i) => {
        const p = Math.max(0, Math.min(1, fly * 1.3 - i * 0.15));
        return <div key={i} style={abs(300 + i * 120 - p * (220 + i * 120), 470 + p * 140 - Math.sin(p * Math.PI) * 120, {width: 50, height: 50, borderRadius: 25, background: BRAND, opacity: (p > 0 && p < 1 ? 1 : 0) * (1 - blocked), ...F, color: INK, fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, boxSizing: 'border-box'})}>₹</div>;
      })}
      <svg width="90" height="40" style={abs(905, 520, {opacity: io(t, rows[0][3] - 0.3, rows[0][3])})}><path d="M4 20h70M60 6l14 14-14 14" fill="none" stroke={MUTED} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <Card x={1030} y={230} w={740} h={560} style={{padding: '24px 30px', boxSizing: 'border-box', opacity: io(t, rows[0][3] - 0.4, rows[0][3])}}>
        {rows.map(([ic, lab, v, at], i) => (
          <div key={lab} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '20px 14px', borderBottom: i < 2 ? `1.5px solid ${FAINT}` : 'none', ...rise(t, at, 0.4, 30)}}>
            <Chip n={ic} size={76} />
            <T s={40} style={{flex: 1}}>{lab}</T>
            <T s={44} w={500} c={RED}>− ₹{v}</T>
          </div>
        ))}
        <div style={{marginTop: 22, borderRadius: 26, background: BRAND, padding: '28px 36px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: `scale(${0.85 + 0.15 * pop(t, keep)})`, opacity: io(t, keep, keep + 0.2)}}>
          <T s={42} w={600} c={INK}>तुमच्या हातात</T>
          <T s={84} w={700} c={INK} style={{letterSpacing: -2}}>₹1,000</T>
        </div>
      </Card>
      <T s={26} c={DIM} style={{...abs(1030, 820), opacity: io(t, keep + 0.5, keep + 1)}}>* अंदाजे आकडे, साधारण</T>
    </AbsoluteFill>
  );
};

/* ============ 09 Fixed costs -> 80 hours -> 3 hours/day ============ */
const Fixed = () => {
  const t = useT();
  const a = S(20), tot = WT(21, '८०') - 0.2, eq = S(22), hrs = WT(22, '८०', 1) - 0.2, day = S(23);
  const rows = [['home', 'जागेचं भाडं', '₹50,000', WT(20, 'भाडं') - 0.2], ['users', '२ कामगार + इतर खर्च', '₹30,000', WT(20, 'कामगारांचा') - 0.2]];
  return (
    <AbsoluteFill>
      <div style={abs(140, 140, rise(t, a - 0.1))}><Eyebrow icon="cal">दर महिन्याचा फिक्स खर्च</Eyebrow></div>
      <Card x={140} y={240} w={760} h={560} style={{padding: '24px 30px', boxSizing: 'border-box', ...rise(t, a + 0.1)}}>
        {rows.map(([ic, lab, v, at], i) => (
          <div key={lab} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '26px 10px', borderBottom: `1.5px solid ${FAINT}`, ...rise(t, at, 0.4, 30)}}>
            <Chip n={ic} size={76} />
            <T s={38} style={{flex: 1}}>{lab}</T>
            <T s={46} w={600}>{v}</T>
          </div>
        ))}
        <div style={{marginTop: 34, borderRadius: 26, background: BRAND, padding: '30px 32px 22px', ...rise(t, tot, 0.4, 20)}}>
          <T s={34} w={500} c={INK}>एकूण फिक्स खर्च</T>
          <T s={96} w={700} c={INK} style={{marginTop: 10, letterSpacing: -2}}><Count t={t} a={tot} b={tot + 0.8} from={50000} to={80000} /></T>
        </div>
      </Card>
      {/* equation */}
      <div style={abs(980, 240)}>
        <Row gap={20} style={rise(t, eq)}>
          <T s={52} w={600}>₹80,000</T><T s={52} c={BRAND} w={600}>÷</T><T s={52} w={600}>₹1,000</T><T s={36} c={MUTED}>/ तास</T>
        </Row>
        <div style={abs(0, 110, {display: 'flex', gap: 40, alignItems: 'center'})}>
          <div style={{transform: `scale(${pop(t, hrs)})`, position: 'relative'}}>
            <div style={{width: 330, height: 330, borderRadius: 36, background: '#F5F3EE', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
              <div style={{height: 70, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T s={32} w={600} c={INK}>महिन्याला</T></div>
              <div style={{textAlign: 'center', marginTop: 34}}>
                <T s={150} w={700} c={INK} style={{letterSpacing: -4}}><Count t={t} a={hrs} b={hrs + 0.7} from={0} to={80} fmt={(n) => Math.round(n)} /></T>
                <T s={40} w={600} c={INK} style={{marginTop: 4}}>तास बुकिंग</T>
              </div>
            </div>
          </div>
          <div style={{...rise(t, day - 0.1)}}>
            <Row gap={16}><T s={46} c={BRAND} w={600}>÷ 30</T><T s={36} c={MUTED}>दिवस</T></Row>
            <div style={{marginTop: 22, borderRadius: 28, border: `2px solid rgba(255,208,20,0.5)`, background: 'rgba(255,208,20,0.08)', padding: '26px 30px 18px', transform: `scale(${pop(t, WT(23, '३') - 0.1)})`}}>
              <T s={96} w={700} c={BRAND} style={{letterSpacing: -2}}>≈ 3 तास</T>
              <T s={32} c={WHITE} style={{marginTop: 10}}>दररोज, फक्त खर्च भरायला</T>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 10 Break-even timeline ============ */
const BreakEven = () => {
  const t = useT();
  const a = S(24), first = WT(24, 'पहिले') - 0.2, profit = S(25), be = WT(26, 'ब्रेक') - 0.3;
  const labels = ['6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  const X0 = 170, CW = 262, G = 10, Y0 = 470;
  return (
    <AbsoluteFill>
      <Head at={a - 0.1} eyebrow="रोज संध्याकाळी" icon="moon" lines={[<>पहिले ३ तास = <span style={{color: RED}}>फक्त खर्च</span>, नफा नंतर</>]} y={140} size={68} />
      {labels.map((l, i) => (
        <div key={l} style={abs(X0 + i * (CW + G) - 5, Y0 - 70, {...fade(t, a + 0.2 + i * 0.05)})}>
          <T s={30} w={500} c={i === 3 && t > be ? BRAND : MUTED} style={{transform: 'translateX(-40%)'}}>{l}</T>
          <div style={abs(4, 44, {width: 2, height: 16, background: DIM})} />
        </div>
      ))}
      {Array.from({length: 6}).map((_, i) => {
        const red = i < 3;
        const at = red ? first + i * 0.35 : WT(25, 'चौथ्या') - 0.3 + (i - 3) * 0.35;
        const p = io(t, at, at + 0.45);
        return (
          <div key={i} style={abs(X0 + i * (CW + G), Y0, {width: CW, height: 120, borderRadius: i === 0 ? '30px 10px 10px 30px' : i === 5 ? '10px 30px 30px 10px' : 10, background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${FAINT}`, overflow: 'hidden', boxSizing: 'border-box', ...fade(t, a + 0.2)})}>
            <div style={{width: `${p * 100}%`, height: '100%', background: red ? RED : BRAND}} />
            {p > 0.6 && <div style={abs(0, 0, {width: CW, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Ic n={red ? 'down' : 'up'} size={50} color={red ? WHITE : INK} sw={4} /></div>}
          </div>
        );
      })}
      {/* brackets */}
      {[[0, 3, RED, 'खर्च + भाडं कव्हर', first + 0.8], [3, 6, BRAND, 'खरा नफा (9 PM नंतर)', WT(25, 'नफा')]].map(([s0, s1, col, lab, at]) => {
        const x = X0 + s0 * (CW + G), w = (s1 - s0) * (CW + G) - G;
        return (
          <div key={lab} style={abs(x, Y0 + 150, {width: w, ...rise(t, at)})}>
            <div style={{height: 24, borderLeft: `4px solid ${col}`, borderRight: `4px solid ${col}`, borderBottom: `4px solid ${col}`, borderRadius: '0 0 14px 14px'}} />
            <T s={42} w={600} c={col} style={{textAlign: 'center', marginTop: 24}}>{lab}</T>
          </div>
        );
      })}
      {/* break-even marker */}
      {t > be && (
        <div style={abs(X0 + 3 * (CW + G) - 7, Y0 - 30, {opacity: io(t, be, be + 0.3)})}>
          <div style={{width: 4, height: 360, background: `repeating-linear-gradient(${WHITE} 0 12px, transparent 12px 22px)`}} />
          <div style={abs(-150, 370, {width: 300, textAlign: 'center', transform: `scale(${pop(t, be)})`})}>
            <div style={{display: 'inline-block', background: WHITE, borderRadius: 18, padding: '14px 26px 8px'}}><T s={40} w={700} c={INK}>ब्रेक-इव्हन</T></div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============ 11 The real problem: empty daytime ============ */
const HOURS = Array.from({length: 18}, (_, i) => i + 6); // 6..23
const hl = (h) => (h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`);
const DayStrip = ({t, y = 470, cell, labelEvery = 3, x0 = 130, cw = 86, g = 8}) => (
  <>
    {HOURS.map((h, i) => {
      const c = cell(h, i);
      return (
        <div key={h} style={abs(x0 + i * (cw + g), y, {width: cw, height: 150, borderRadius: 14, boxSizing: 'border-box', background: c.bg, border: c.border, opacity: c.o ?? 1, transform: `scaleY(${c.s ?? 1})`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14})}>
          {c.icon && <Ic n={c.icon} size={36} color={c.ic || INK} />}
        </div>
      );
    })}
    {HOURS.filter((h, i) => i % labelEvery === 0).concat([24]).map((h) => {
      const i = h - 6;
      return <T key={h} s={26} c={MUTED} w={500} style={abs(x0 + i * (cw + g) - 4, y - 50, {transform: 'translateX(-30%)'})}>{h === 24 ? '12 AM' : hl(h)}</T>;
    })}
  </>
);
const Problem = () => {
  const t = useT();
  const a = S(27), eve = S(28), morn = S(29), plane = S(30);
  const up = io(t, eve - 0.4, eve + 0.2, 0, 1, INOUT);
  return (
    <AbsoluteFill>
      <div style={abs(0, 0, {width: 1920, transform: `translateY(${-up * 300}px)`, textAlign: 'center', opacity: 1})}>
        <div style={{marginTop: 360, transform: `scale(${1 - 0.45 * up})`}}>
          <div style={{display: 'inline-flex', ...rise(t, a - 0.1)}}><Chip n="x" size={110} r={55} color={WHITE} bg={RED} /></div>
          <T s={130} w={600} style={{marginTop: 30, ...rise(t, a + 0.1)}}>पण खरी अडचण इथेच</T>
        </div>
      </div>
      <div style={{opacity: up}}>
        <DayStrip t={t} y={470} cell={(h, i) => {
          const evening = h >= 17;
          const pe = io(t, eve + 0.3 + (h - 17) * 0.1, eve + 0.6 + (h - 17) * 0.1);
          const pm = io(t, morn + 0.1 + i * 0.05, morn + 0.4 + i * 0.05);
          if (evening) return {bg: pe > 0.5 ? BRAND : 'rgba(255,255,255,0.05)', border: 'none', s: 0.4 + 0.6 * pe, icon: pe > 0.5 ? 'users' : null};
          return {bg: 'rgba(255,255,255,0.03)', border: `2.5px dashed ${pm > 0.5 ? 'rgba(255,90,82,0.8)' : 'rgba(255,255,255,0.18)'}`, icon: null};
        }} />
        <div style={abs(130 + 11 * 94, 670, {...rise(t, eve + 0.4)})}>
          <Row gap={14}><Ic n="moon" size={40} color={BRAND} /><T s={38} w={600} c={BRAND}>बुकिंग्स फक्त संध्याकाळी / रात्री</T></Row>
        </div>
        <div style={abs(130, 670, {...rise(t, morn)})}>
          <Row gap={14}><Ic n="sun" size={40} color={MUTED} /><T s={38} w={500} c={MUTED}>सकाळ आणि दुपार: Turf पूर्ण रिकामा</T></Row>
        </div>
        {/* bracket + empty plane */}
        <div style={abs(130, 760, {width: 11 * 94 - 8, ...rise(t, plane - 0.1)})}>
          <div style={{height: 22, borderLeft: `4px solid ${RED}`, borderRight: `4px solid ${RED}`, borderBottom: `4px solid ${RED}`, borderRadius: '0 0 14px 14px'}} />
          <T s={56} w={600} c={RED} style={{textAlign: 'center', marginTop: 24}}>दिवसाचे १०–१२ तास रिकामे</T>
        </div>
        {t > plane && (() => {
          const p = io(t, plane, plane + 4, 0, 1, Easing.linear);
          return (
            <div style={abs(120 + p * 920, 380 - Math.sin(p * Math.PI * 2) * 14, {display: 'flex', alignItems: 'center', gap: 14, opacity: io(t, plane, plane + 0.3) * io(t, plane + 3.4, plane + 4, 1, 0)})}>
              <div style={{transform: 'rotate(45deg)'}}><Ic n="plane" size={54} color={WHITE} /></div>
              <T s={28} c={MUTED} w={500}>रिकामं विमान उडतंय</T>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 12 Monsoon ============ */
const Rain = ({t, w = 420, h = 260}) => (
  <svg width={w} height={h} style={{overflow: 'visible'}}>
    {Array.from({length: 22}).map((_, i) => {
      const x = 40 + ((i * 53) % (w - 60)); const sp = 300 + (i % 5) * 40;
      const y = ((t * sp + i * 97) % h);
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 26} stroke={SKY} strokeWidth="4" strokeLinecap="round" opacity="0.8" />;
    })}
  </svg>
);
const Monsoon = () => {
  const t = useT();
  const a = S(31), cancel = WT(31, 'कॅन्सल') - 0.3, half = S(32), ask = S(33), no = S(34) - 0.05, pocket = S(35);
  const bookings = ['6 PM', '8 PM', '9 PM', '10 PM'];
  const bar = io(t, half + 0.1, half + 0.9, 1, 0.5, INOUT);
  return (
    <AbsoluteFill>
      {/* column 1: rain + cancellations */}
      <div style={abs(140, 150, rise(t, a - 0.1))}>
        <Eyebrow icon="cloud" color={SKY}>पावसाळा · ३ महिने</Eyebrow>
        <div style={{position: 'relative', marginTop: 20, height: 260}}>
          <div style={abs(40, 0, {transform: `translateX(${Math.sin(t * 0.8) * 10}px)`})}><Ic n="cloud" size={240} color={SKY} sw={2.4} /></div>
          <div style={abs(30, 150)}><Rain t={t} w={300} h={140} /></div>
        </div>
        <div style={{marginTop: 50}}>
          {bookings.map((b, i) => {
            const c = io(t, cancel + i * 0.18, cancel + 0.3 + i * 0.18);
            return (
              <div key={b} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, position: 'relative', width: 440, opacity: 1 - 0.4 * c, ...rise(t, a + 0.4 + i * 0.1)}}>
                <div style={{flex: 1, borderRadius: 18, background: 'rgba(255,255,255,0.07)', padding: '14px 22px 8px', display: 'flex', justifyContent: 'space-between'}}>
                  <T s={30} w={500}>{b} बुकिंग</T>
                  <T s={28} w={600} c={c > 0.5 ? RED : BRAND}>{c > 0.5 ? 'कॅन्सल' : '✓'}</T>
                </div>
                <div style={abs(10, 30, {height: 4, width: `${c * 92}%`, background: RED, borderRadius: 2})} />
              </div>
            );
          })}
        </div>
      </div>
      {/* column 2: revenue halves */}
      <Card x={700} y={150} w={520} h={760} style={{...rise(t, half - 0.4)}}>
        <T s={34} c={MUTED} style={abs(40, 40)}>महिन्याचं उत्पन्न</T>
        <div style={abs(110, 140, {width: 300, height: 480, borderRadius: 24, background: 'rgba(255,255,255,0.05)', border: `2px dashed rgba(255,255,255,0.18)`, boxSizing: 'border-box'})} />
        <div style={abs(110, 140 + 480 * (1 - bar), {width: 300, height: 480 * bar, borderRadius: 24, background: bar < 0.75 ? `linear-gradient(180deg, ${RED}, #c43d37)` : BRAND})} />
        <T s={60} w={700} c={bar < 0.75 ? RED : INK} style={abs(110, 140 + 480 * (1 - bar) + 30, {width: 300, textAlign: 'center', color: INK})}>{Math.round(bar * 100)}%</T>
        <Row gap={14} style={{...abs(40, 660), opacity: io(t, half + 0.6, half + 1)}}><Ic n="down" size={44} color={RED} /><T s={42} w={600} c={RED}>थेट अर्ध्यावर</T></Row>
      </Card>
      {/* column 3: landlord */}
      <Card x={1280} y={150} w={500} h={760} style={{...rise(t, ask - 0.3)}}>
        <div style={abs(40, 40)}><Chip n="home" size={110} r={30} /></div>
        <T s={34} c={MUTED} style={abs(40, 180)}>जागेचा मालक</T>
        <T s={56} w={600} style={abs(40, 230)}>भाडं कमी करतो?</T>
        {t > pocket - 0.2 && (
          <div style={abs(40, 560, rise(t, pocket - 0.2))}>
            <Row gap={18}>
              <Chip n="wallet" size={90} color={RED} bg="rgba(255,90,82,0.12)" />
              <T s={36} w={500} style={{lineHeight: 1.3}}>पैसे स्वतःच्या<br />खिशातून</T>
            </Row>
            {[0, 1].map((i) => {
              const p = ((t - pocket) * 0.8 + i * 0.5) % 1;
              return <div key={i} style={abs(30 + p * 40, 30 - p * 120, {width: 40, height: 40, borderRadius: 20, background: BRAND, opacity: 1 - p, ...F, color: INK, fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 3, boxSizing: 'border-box'})}>₹</div>;
            })}
          </div>
        )}
      </Card>
      <Stamp at={no} x={1530} y={600} size={96} rot={-10}>नाही!</Stamp>
    </AbsoluteFill>
  );
};

/* ============ 13 Reality: 3-4 years ============ */
const Reality = () => {
  const t = useT();
  const a = S(36), x18 = WT(36, 'निघत') - 0.2, yrs = WT(37, '३') - 0.3, close = S(38);
  const X0 = 160, X1 = 1760, m2x = (m) => X0 + ((X1 - X0) * m) / 48, Y = 500;
  const grow = io(t, yrs, yrs + 1.4, 0, 1, INOUT);
  return (
    <AbsoluteFill>
      <Head at={a - 0.1} eyebrow="₹20 लाख Investment वसूल व्हायला" icon="rupee" lines={[<>१८ महिने? <span style={{color: RED, opacity: io(t, x18, x18 + 0.3)}}>कधीच नाही.</span></>]} y={130} size={76} />
      {/* axis */}
      <div style={abs(X0, Y + 60, {width: X1 - X0, height: 4, background: 'rgba(255,255,255,0.2)', ...fade(t, a + 0.2)})} />
      {[0, 12, 24, 36, 48].map((m) => (
        <div key={m} style={abs(m2x(m), Y + 50, fade(t, a + 0.3))}>
          <div style={{width: 4, height: 24, background: 'rgba(255,255,255,0.35)', marginLeft: -2}} />
          <T s={30} c={MUTED} w={500} style={{marginTop: 14, transform: 'translateX(-50%)'}}>{m === 0 ? 'सुरुवात' : `${m / 12} वर्ष${m > 12 ? 'ं' : ''}`}</T>
        </div>
      ))}
      {/* internet promise */}
      <div style={abs(X0, Y - 80, {width: m2x(18) - X0, height: 60, borderRadius: 14, background: 'rgba(255,255,255,0.10)', border: '2px dashed rgba(255,255,255,0.35)', boxSizing: 'border-box', ...fade(t, WT(36, 'इंटरनेटवर'))})}>
        <T s={30} w={500} style={abs(20, 12)}>इंटरनेट: १८ महिने</T>
      </div>
      {t > x18 && <div style={abs(m2x(18) - 40, Y - 100, {transform: `scale(${pop(t, x18)})`})}><Chip n="x" size={80} r={40} bg={RED} /></div>}
      {/* reality */}
      <div style={abs(X0, Y - 10, {width: (m2x(36) - X0) * grow, height: 60, borderRadius: 14, background: BRAND})} />
      <div style={abs(m2x(36), Y - 10, {width: (m2x(48) - m2x(36)) * io(t, yrs + 1.2, yrs + 1.8), height: 60, borderRadius: '0 14px 14px 0', background: 'repeating-linear-gradient(135deg, rgba(255,208,20,0.75) 0 10px, rgba(255,208,20,0.25) 10px 20px)'})} />
      <T s={38} w={600} c={INK} style={abs(X0 + 24, Y + 4, {opacity: io(t, yrs + 0.6, yrs + 1)})}>प्रत्यक्षात: ३ ते ४ वर्षं</T>
      {/* shops closing */}
      <div style={abs(X0, 720, {display: 'flex', gap: 34, alignItems: 'flex-end'})}>
        {Array.from({length: 10}).map((_, i) => {
          const closes = [1, 3, 4, 6, 8, 9].includes(i);
          const c = closes ? io(t, close + 0.3 + i * 0.12, close + 0.6 + i * 0.12) : 0;
          return (
            <div key={i} style={{position: 'relative', ...rise(t, close - 0.2 + i * 0.04)}}>
              <Ic n="shop" size={120} color={c > 0.5 ? 'rgba(255,255,255,0.25)' : WHITE} sw={2.8} />
              <div style={abs(10, 60, {width: 100, height: 60 * c, background: `repeating-linear-gradient(${RED} 0 6px, #b8332d 6px 12px)`, borderRadius: 4, opacity: 0.85})} />
            </div>
          );
        })}
      </div>
      <T s={40} w={500} style={{...abs(X0, 880), ...rise(t, close + 0.8)}}>अनेक जण तोपर्यंत <span style={{color: RED}}>बिझनेस बंद</span> करतात</T>
    </AbsoluteFill>
  );
};

/* ============ 14 The 10% ============ */
const WIN = [3, 17, 22, 38, 45, 51, 66, 74, 89, 92];
const Ten = () => {
  const t = useT();
  const a = S(39), ten = WT(39, '१०') - 0.2, three = S(40);
  const strat = [['clock', 'डेड टाईम विका'], ['hand', 'रेव्हेन्यू शेअरिंग'], ['trophy', 'कॉर्पोरेट टूर्नामेंट्स']];
  return (
    <AbsoluteFill>
      <div style={abs(150, 210)}>
        {Array.from({length: 100}).map((_, i) => {
          const win = WIN.includes(i);
          const p = win ? pop(t, ten + WIN.indexOf(i) * 0.06) : 0;
          return (
            <div key={i} style={abs((i % 10) * 54, Math.floor(i / 10) * 54, {width: 40, height: 40, borderRadius: 20, opacity: io(t, a + (i % 10) * 0.02, a + 0.3 + (i % 10) * 0.02),
              background: p > 0.3 ? BRAND : 'rgba(255,255,255,0.14)', transform: `scale(${1 + 0.25 * p})`, boxShadow: p > 0.3 ? '0 0 20px rgba(255,208,20,0.5)' : 'none'})} />
          );
        })}
        <T s={40} w={600} c={BRAND} style={{...abs(0, 570), ...rise(t, ten + 0.4)}}>फक्त १०% यशस्वी</T>
      </div>
      <Head at={a + 0.2} eyebrow="१०% यशस्वी Turf मालक" icon="star" lines={['नफा कसा कमवतात?']} x={800} y={200} size={84} />
      <div style={abs(800, 480, {display: 'flex', gap: 24})}>
        {strat.map(([ic, lab], i) => (
          <Card key={lab} x={0} y={0} w={300} h={300} style={{position: 'relative', left: 0, top: 0, padding: 30, boxSizing: 'border-box', ...rise(t, three + 0.2 + i * 0.25)}}>
            <Row gap={14}><div style={{...F, fontSize: 30, fontWeight: 700, color: INK, background: BRAND, borderRadius: 12, padding: '10px 12px 4px'}}>0{i + 1}</div></Row>
            <div style={{marginTop: 40}}><Ic n={ic} size={70} color={WHITE} /></div>
            <T s={34} w={600} style={{marginTop: 26, whiteSpace: 'normal', lineHeight: 1.2}}>{lab}</T>
          </Card>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 15 Strategy 1: sell dead time ============ */
const StratHead = ({at, n, title, icon}) => {
  const t = useT();
  return (
    <div style={abs(140, 130)}>
      <Row gap={22} style={rise(t, at - 0.1)}>
        <div style={{...F, fontSize: 40, fontWeight: 700, color: INK, background: BRAND, borderRadius: 16, padding: '14px 18px 6px'}}>{n}</div>
        <T s={34} w={500} c={MUTED}>स्ट्रॅटेजी</T>
      </Row>
      <Row gap={22} style={{marginTop: 26, ...rise(t, at + 0.1)}}>
        <Ic n={icon} size={70} color={BRAND} />
        <T s={84} w={600}>{title}</T>
      </Row>
    </div>
  );
};
const Strat1 = () => {
  const t = useT();
  const a = S(41), coach = WT(42, 'सकाळी') - 0.2, school = S(43) - 0.1, money = S(44);
  const filled = 7 + Math.round(io(t, coach, coach + 1.2) * 3) + Math.round(io(t, school + 0.6, school + 2) * 4);
  return (
    <AbsoluteFill>
      <StratHead at={a} n="01" title="डेड टाईम विका" icon="clock" />
      <div style={{...fade(t, a + 0.3)}}>
        <DayStrip t={t} y={470} cell={(h, i) => {
          if (h >= 17) return {bg: BRAND, border: 'none', icon: 'users'};
          if (h < 9) { const p = io(t, coach + i * 0.3, coach + 0.4 + i * 0.3); return p > 0.5 ? {bg: SKY, border: 'none', icon: 'ball', s: 0.7 + 0.3 * p} : {bg: 'rgba(255,255,255,0.03)', border: '2.5px dashed rgba(255,255,255,0.2)'}; }
          if (h >= 12 && h < 16) { const p = io(t, school + 0.6 + (h - 12) * 0.3, school + 1 + (h - 12) * 0.3); return p > 0.5 ? {bg: VIOLET, border: 'none', icon: 'school', s: 0.7 + 0.3 * p} : {bg: 'rgba(255,255,255,0.03)', border: '2.5px dashed rgba(255,255,255,0.2)'}; }
          return {bg: 'rgba(255,255,255,0.03)', border: '2.5px dashed rgba(255,255,255,0.2)'};
        }} />
      </div>
      {/* callouts */}
      <div style={abs(130, 680, rise(t, coach + 0.4))}>
        <div style={{width: 3 * 94 - 8, height: 6, background: SKY, borderRadius: 3}} />
        <Row gap={14} style={{marginTop: 20}}><Ic n="whistle" size={44} color={SKY} /><T s={36} w={600} c={SKY}>सकाळी ६–९</T></Row>
        <T s={32} c={WHITE} style={{marginTop: 10}}>मुलांसाठी क्रिकेट / फुटबॉल कोचिंग</T>
      </div>
      <div style={abs(130 + 6 * 94, 680, rise(t, school + 0.4))}>
        <div style={{width: 4 * 94 - 8, height: 6, background: VIOLET, borderRadius: 3}} />
        <Row gap={14} style={{marginTop: 20}}><Ic n="school" size={44} color={VIOLET} /><T s={36} w={600} c={VIOLET}>दुपारी</T></Row>
        <T s={32} c={WHITE} style={{marginTop: 10}}>शाळा / कॉलेजसोबत टाय-अप</T>
      </div>
      <div style={abs(130 + 11 * 94, 680, fade(t, a + 0.5))}>
        <div style={{width: 7 * 94 - 8, height: 6, background: BRAND, borderRadius: 3}} />
        <Row gap={14} style={{marginTop: 20}}><Ic n="moon" size={44} color={BRAND} /><T s={36} w={600} c={BRAND}>संध्याकाळ</T></Row>
        <T s={32} c={WHITE} style={{marginTop: 10}}>नेहमीची बुकिंग्स</T>
      </div>
      {/* counter */}
      <Card x={1290} y={130} w={490} h={250} glow={t > money} style={{padding: '30px 36px', boxSizing: 'border-box', ...rise(t, coach)}}>
        <T s={30} c={MUTED}>रोज कामाचे तास</T>
        <Row gap={14} style={{marginTop: 18}}>
          <T s={96} w={700} c={BRAND} style={{letterSpacing: -2}}>{filled}</T><T s={44} c={MUTED} w={500}>/ 18</T>
        </Row>
        <T s={34} w={600} c={WHITE} style={{marginTop: 14, opacity: io(t, money, money + 0.4)}}>रिकामा वेळ → पैसे</T>
      </Card>
    </AbsoluteFill>
  );
};

/* ============ 16 Strategy 2: revenue sharing ============ */
const Donut = ({p, size = 240}) => {
  const r = 90, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
      <circle cx="120" cy="120" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="44" />
      <circle cx="120" cy="120" r={r} fill="none" stroke={BRAND} strokeWidth="44" strokeDasharray={`${c * 0.5 * p - 4} ${c}`} />
      <circle cx="120" cy="120" r={r} fill="none" stroke={WHITE} strokeWidth="44" strokeDasharray={`${c * 0.5 * p - 4} ${c}`} strokeDashoffset={-c * 0.5} />
    </svg>
  );
};
const Strat2 = () => {
  const t = useT();
  const a = S(45), strike = WT(45, 'ऐवजी') - 0.1, share = WT(45, 'रेव्हेन्यू') - 0.2, prof = WT(46, 'प्रॉफिट') - 0.2, rain = WT(46, 'पावसाळ्यात') - 0.2, calm = S(47);
  const dimFixed = io(t, strike, strike + 0.4);
  return (
    <AbsoluteFill>
      <StratHead at={a} n="02" title="रेव्हेन्यू शेअरिंग" icon="hand" />
      <Card x={140} y={400} w={620} h={520} style={{padding: 44, boxSizing: 'border-box', opacity: 1 - 0.55 * dimFixed, ...rise(t, a + 0.4)}}>
        <Chip n="home" size={100} r={28} />
        <T s={56} w={600} style={{marginTop: 36}}>फिक्स रेंट</T>
        <T s={34} c={MUTED} style={{marginTop: 20}}>दर महिना ठराविक भाडं</T>
        <T s={34} c={MUTED} style={{marginTop: 12}}>पाऊस असो वा नसो</T>
        <svg width="560" height="20" style={abs(30, 180)}><line x1="0" y1="10" x2="540" y2="10" stroke={RED} strokeWidth="10" strokeLinecap="round" {...draw(dimFixed)} /></svg>
      </Card>
      <div style={abs(790, 610, {...fade(t, share)})}><svg width="90" height="40"><path d="M4 20h70M60 6l14 14-14 14" fill="none" stroke={BRAND} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <Card glow x={910} y={300} w={870} h={620} style={{padding: 44, boxSizing: 'border-box', ...rise(t, share)}}>
        <Row gap={50}>
          <div style={{position: 'relative'}}>
            <Donut p={io(t, share + 0.2, share + 1.2)} />
            <div style={abs(0, 0, {width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Ic n="hand" size={86} color={WHITE} sw={3} /></div>
          </div>
          <div>
            <T s={56} w={600}>रेव्हेन्यू शेअर</T>
            <Row gap={14} style={{marginTop: 30}}><div style={{width: 26, height: 26, borderRadius: 8, background: BRAND}} /><T s={34}>तुम्ही</T></Row>
            <Row gap={14} style={{marginTop: 16}}><div style={{width: 26, height: 26, borderRadius: 8, background: WHITE}} /><T s={34}>जागेचा मालक</T></Row>
          </div>
        </Row>
        <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18}}>
          <Row gap={20} style={rise(t, prof)}><Chip n="up" size={70} color={INK} bg={BRAND} /><T s={40} w={500}>प्रॉफिट झाला → <span style={{color: BRAND}}>दोघांचा</span></T></Row>
          <Row gap={20} style={rise(t, rain)}><Chip n="cloud" size={70} color={INK} bg={SKY} /><T s={40} w={500}>पावसाळ्यात तोटा → <span style={{color: SKY}}>दोघांत विभागला</span></T></Row>
        </div>
      </Card>
      {t > calm && (
        <div style={abs(910, 940, rise(t, calm))}>
          <Row gap={16}><Ic n="check" size={44} color={BRAND} sw={5} /><T s={40} w={600}>दर महिन्याच्या फिक्स भाड्याचं टेन्शन नाही</T></Row>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============ 17 Strategy 3: corporate tournaments ============ */
const Strat3 = () => {
  const t = useT();
  const a = S(48), chill = WT(48, 'चिल्लर') - 0.3, corp = WT(48, 'कॉर्पोरेट') - 0.2, teams = WT(49, '८') - 0.2, galla = WT(49, 'गल्ला') - 0.3, spons = S(50);
  const gone = io(t, corp, corp + 0.5);
  const X = 760, TOP = 360, ROW = 70;
  const team = (i) => [X, TOP + i * ROW];
  const lvl2 = (i) => [X + 300, TOP + ROW * (i * 2 + 0.5)];
  const lvl3 = (i) => [X + 540, TOP + ROW * (i * 4 + 1.5)];
  const fin = [X + 760, TOP + ROW * 3.5];
  const dl = (p0, p1, at) => <path d={`M${p0[0] + 200},${p0[1] + 26} H${(p0[0] + 200 + p1[0]) / 2} V${p1[1] + 26} H${p1[0]}`} fill="none" stroke={BRAND} strokeWidth="4" strokeLinejoin="round" opacity="0.8" {...draw(io(t, at, at + 0.5))} />;
  return (
    <AbsoluteFill>
      <StratHead at={a} n="03" title="कॉर्पोरेट टूर्नामेंट्स" icon="trophy" />
      {/* chillar bookings */}
      <div style={abs(140, 400, {opacity: 1 - 0.85 * gone})}>
        <T s={34} c={MUTED} style={rise(t, chill - 0.2)}>वीकेंडची चिल्लर बुकिंग</T>
        <div style={{display: 'grid', gridTemplateColumns: '160px 160px 160px', gap: 14, marginTop: 24}}>
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} style={{borderRadius: 18, border: `2px solid ${FAINT}`, background: 'rgba(255,255,255,0.05)', padding: '16px 20px 10px', transform: `translateY(${Math.sin(t * 2 + i) * 3}px)`, ...rise(t, chill + i * 0.08)}}>
              <T s={30} w={500}>१ तास</T><T s={26} c={MUTED} style={{marginTop: 6}}>₹1,200</T>
            </div>
          ))}
        </div>
        <svg width="510" height="20" style={abs(0, 160)}><line x1="0" y1="10" x2="496" y2="10" stroke={RED} strokeWidth="8" strokeLinecap="round" {...draw(gone)} /></svg>
      </div>
      {/* bracket */}
      <svg width="1920" height="1080" style={abs(0, 0)}>
        {Array.from({length: 8}).map((_, i) => <React.Fragment key={i}>{dl(team(i), lvl2(Math.floor(i / 2)), teams + 0.6 + i * 0.05)}</React.Fragment>)}
        {Array.from({length: 4}).map((_, i) => <React.Fragment key={i}>{dl([lvl2(i)[0] - 60, lvl2(i)[1]], lvl3(Math.floor(i / 2)), teams + 1.0)}</React.Fragment>)}
        {Array.from({length: 2}).map((_, i) => <React.Fragment key={i}>{dl([lvl3(i)[0] - 60, lvl3(i)[1]], [fin[0], fin[1] - 26 + 26], teams + 1.4)}</React.Fragment>)}
      </svg>
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} style={abs(team(i)[0], team(i)[1], {width: 200, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: `1.5px solid ${FAINT}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', boxSizing: 'border-box', ...rise(t, teams + i * 0.07, 0.3, 20)})}>
          <Ic n="users" size={28} color={BRAND} /><T s={28} w={500}>टीम {i + 1}</T>
        </div>
      ))}
      {Array.from({length: 4}).map((_, i) => <div key={i} style={abs(lvl2(i)[0], lvl2(i)[1] + 12, {width: 140, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.12)', opacity: io(t, teams + 1, teams + 1.3)})} />)}
      {Array.from({length: 2}).map((_, i) => <div key={i} style={abs(lvl3(i)[0], lvl3(i)[1] + 12, {width: 140, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.16)', opacity: io(t, teams + 1.4, teams + 1.7)})} />)}
      <div style={abs(fin[0], fin[1] - 60, {transform: `scale(${pop(t, teams + 1.8)})`})}>
        <div style={{width: 170, height: 170, borderRadius: 85, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${50 + 20 * Math.sin(t * 4)}px rgba(255,208,20,0.55)`}}><Ic n="trophy" size={100} color={INK} sw={3.4} /></div>
      </div>
      <T s={34} w={600} c={BRAND} style={{...abs(X, TOP - 60), ...rise(t, teams)}}>एकाच वेळी ८–१० टीम्स</T>
      {/* galla */}
      <div style={abs(140, 790, rise(t, galla))}>
        <Row gap={20} style={{alignItems: 'flex-end'}}>
          <div style={{display: 'flex', gap: 8, alignItems: 'flex-end'}}>
            {[3, 5, 7, 9].map((n, i) => (
              <div key={i} style={{display: 'flex', flexDirection: 'column-reverse'}}>
                {Array.from({length: Math.round(n * io(t, galla + i * 0.15, galla + 0.8 + i * 0.15))}).map((_, k) => <div key={k} style={{width: 56, height: 14, borderRadius: 7, background: BRAND, marginTop: 3, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2)'}} />)}
              </div>
            ))}
          </div>
          <div><T s={44} w={600}>मोठा गल्ला</T><T s={30} c={MUTED} style={{marginTop: 8}}>एकाच झटक्यात, दिवसभराचा</T></div>
        </Row>
      </div>
      {/* sponsors */}
      {['स्पॉन्सर', 'स्पॉन्सर', 'स्पॉन्सर'].map((s, i) => (
        <div key={i} style={abs(1360 + i * 150 - 150, 880, {transform: `scale(${pop(t, spons + 0.2 + i * 0.2)})`})}>
          <div style={{borderRadius: 18, background: WHITE, padding: '12px 18px 6px', display: 'flex', gap: 10, alignItems: 'center'}}><Ic n="star" size={26} color={INK} sw={3.4} /><T s={26} w={600} c={INK}>{s}</T></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ============ 18 Takeaway ============ */
const Hourglass = ({t, p}) => {
  const top = 1 - p, bot = p;
  return (
    <svg viewBox="0 0 300 480" width={300} height={480}>
      <rect x="20" y="10" width="260" height="26" rx="13" fill={WHITE} />
      <rect x="20" y="444" width="260" height="26" rx="13" fill={WHITE} />
      <path d="M50 36 C50 150 140 190 140 240 C140 290 50 330 50 444 M250 36 C250 150 160 190 160 240 C160 290 250 330 250 444" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="6" />
      <clipPath id="topc"><rect x="0" y={36 + 190 * (1 - top)} width="300" height={190 * top} /></clipPath>
      <path d="M56 40 C56 150 146 190 146 236 L154 236 C154 190 244 150 244 40 Z" fill={BRAND} clipPath="url(#topc)" />
      <clipPath id="botc"><rect x="0" y={440 - 170 * bot} width="300" height={170 * bot} /></clipPath>
      <path d="M56 440 C56 330 146 290 146 246 L154 246 C154 290 244 330 244 440 Z" fill={BRAND} clipPath="url(#botc)" />
      {p < 0.98 && <line x1="150" y1="236" x2="150" y2={440 - 170 * bot} stroke={BRAND} strokeWidth="4" strokeDasharray="6 6" strokeDashoffset={-t * 60} />}
    </svg>
  );
};
const Takeaway = () => {
  const t = useT();
  const a = S(51), place = WT(51, 'जागा') - 0.1, time = WT(51, 'वेळ') - 0.2, fill0 = WT(52, 'सकाळी'), fill1 = WT(52, 'स्लॉट्स') + 0.2, win = WT(52, 'खरा') - 0.2;
  const k = io(t, fill0, fill1, 0, 18, Easing.linear);
  return (
    <AbsoluteFill>
      <div style={abs(170, 200, {transform: `rotate(${Math.sin(t * 0.7) * 2}deg)`, ...rise(t, a)})}><Hourglass t={t} p={io(t, a, a + 13, 0.05, 0.95, Easing.linear)} /></div>
      <div style={abs(620, 200)}>
        <T s={44} c={MUTED} w={500} style={rise(t, a)}>लक्षात ठेवा, Turf बिझनेसमध्ये तुम्ही</T>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 30, ...rise(t, place)}}>
          <T s={110} w={600} c={io(t, time - 0.4, time) > 0.5 ? DIM : WHITE}>जागा नाही,</T>
          <svg width="520" height="20" style={abs(-10, 60)}><line x1="0" y1="10" x2="500" y2="10" stroke={RED} strokeWidth="9" strokeLinecap="round" {...draw(io(t, time - 0.4, time))} /></svg>
        </div>
        <T s={110} w={600} style={{marginTop: 20, ...rise(t, time)}}><Hi at={time + 0.1}>वेळ</Hi> विकत आहात.</T>
      </div>
      {/* 6AM-12AM slots */}
      <div style={abs(620, 760, {...fade(t, fill0 - 0.4)})}>
        <Row gap={8}>
          {HOURS.map((h, i) => (
            <div key={h} style={{width: 56, height: 90, borderRadius: 12, background: i < k ? BRAND : 'rgba(255,255,255,0.06)', border: i < k ? 'none' : `2px dashed rgba(255,255,255,0.2)`, boxSizing: 'border-box', transform: `scaleY(${i < k ? 1 : 0.85})`}} />
          ))}
        </Row>
        <Row gap={0} style={{marginTop: 16, justifyContent: 'space-between', width: 18 * 64 - 8}}>
          <T s={28} c={MUTED} w={500}>सकाळी ६</T><T s={28} c={MUTED} w={500}>रात्री १२</T>
        </Row>
        {t > win && <T s={44} w={600} style={{marginTop: 24, ...rise(t, win)}}>जास्तीत जास्त स्लॉट्स विका = <span style={{color: BRAND}}>खरा नफा</span></T>}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 19 CTA + end card ============ */
const Cta = () => {
  const t = useT();
  const a = S(53), save = WT(53, 'सेव्ह') - 0.3, share = WT(53, 'शेअर') - 0.3, friends = WT(53, 'मित्राला') - 0.3, sub = S(54), click = WT(54, 'सबस्क्राईब') + 0.1;
  const up = io(t, sub - 0.3, sub + 0.3, 0, 1, INOUT);
  const clicked = t > click;
  const cur = io(t, sub + 0.6, click, 0, 1, INOUT);
  const press = clicked ? 1 - 0.08 * Math.max(0, 1 - (t - click) * 5) : 1;
  const ring = clicked ? Math.sin((t - click) * 30) * 18 * Math.max(0, 1 - (t - click) * 1.2) : 0;
  return (
    <AbsoluteFill>
      <div style={abs(0, 0, {width: 1920, transform: `translateY(${-up * 150}px) scale(${1 - up * 0.25})`, transformOrigin: '50% 30%', opacity: 1 - up})}>
        <div style={abs(0, 220, {width: 1920, display: 'flex', justifyContent: 'center', gap: 60})}>
          {[['bookmark', 'सेव्ह करा', save], ['share', 'शेअर करा', share]].map(([ic, lab, at]) => (
            <div key={lab} style={{textAlign: 'center', transform: `scale(${pop(t, at)})`}}>
              <div style={{width: 220, height: 220, borderRadius: 60, background: 'rgba(255,255,255,0.07)', border: `2px solid ${t > at + 0.3 ? BRAND : FAINT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Ic n={ic} size={110} color={t > at + 0.3 ? BRAND : WHITE} sw={3.2} />
              </div>
              <T s={44} w={600} style={{marginTop: 26}}>{lab}</T>
            </div>
          ))}
        </div>
        <div style={abs(0, 640, {width: 1920, display: 'flex', justifyContent: 'center', gap: 30})}>
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} style={{transform: `scale(${pop(t, friends + i * 0.1)})`, width: 90, height: 90, borderRadius: 45, background: i % 2 ? 'rgba(255,208,20,0.18)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic n="user" size={50} color={i % 2 ? BRAND : WHITE} /></div>
          ))}
        </div>
        <T s={36} c={MUTED} style={{...abs(0, 760, {width: 1920, textAlign: 'center'}), ...rise(t, friends + 0.4)}}>Turf सुरू करणाऱ्या प्रत्येक मित्राला</T>
      </div>
      {/* subscribe end card */}
      {t > sub - 0.3 && (
        <div style={abs(0, 0, {width: 1920, height: 1080, opacity: up})}>
          <div style={abs(960, 600, {transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * up})`})}>
            <div style={{display: 'flex', alignItems: 'center', gap: 36, background: WHITE, borderRadius: 120, padding: '28px 30px 28px 34px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)'}}>
              <div style={{width: 120, height: 120, borderRadius: 60, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 26, height: 26, borderRadius: 7, background: BRAND, boxShadow: '0 0 20px rgba(255,208,20,0.7)'}} />
              </div>
              <div>
                <T s={64} w={600} c={INK}>तरुण उद्योजक</T>
                <T s={30} c="rgba(0,0,0,0.55)" style={{marginTop: 6}}>बिझनेसचं खरं गणित, मराठीत</T>
              </div>
              <div style={{transform: `scale(${press})`, marginLeft: 20, borderRadius: 80, background: clicked ? '#E9E7E2' : BRAND, padding: '30px 44px 22px', display: 'flex', alignItems: 'center', gap: 14}}>
                <T s={44} w={700} c={INK}>{clicked ? 'Subscribed ✓' : 'Subscribe'}</T>
              </div>
              <div style={{transform: `rotate(${ring}deg)`, transformOrigin: '50% 10%', marginRight: 10}}><Ic n="bell" size={64} color={INK} sw={3.6} /></div>
            </div>
          </div>
          {/* cursor */}
          <svg width="60" height="70" viewBox="0 0 24 28" style={abs(1500 - cur * 210, 900 - cur * 280, {opacity: io(t, sub + 0.4, sub + 0.7) * io(t, click + 1.2, click + 1.6, 1, 0), filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'})}>
            <path d="M2 2l0 20 6-5 4 9 4-2-4-9 8 0z" fill={WHITE} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {clicked && <div style={abs(1290 - 60, 620 - 60, {width: 120, height: 120, borderRadius: 60, border: `4px solid ${BRAND}`, transform: `scale(${io(t, click, click + 0.6, 0.3, 1.6)})`, opacity: io(t, click, click + 0.6, 1, 0)})} />}
          <T s={40} w={500} c={MUTED} style={{...abs(0, 820, {width: 1920, textAlign: 'center'}), ...rise(t, sub + 0.4)}}>अशाच व्हिडिओसाठी चॅनलला सबस्क्राईब करा</T>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============ timeline ============ */
const SCENES = [
  {key: 'hook', i: 0, C: Hook}, {key: 'mistake', i: 2, C: Mistake}, {key: 'claim', i: 3, C: Claim},
  {key: 'airline', i: 5, C: Swap}, {key: 'plane', i: 8, C: Plane}, {key: 'hour', i: 11, C: Hour},
  {key: 'math', i: 14, C: MathTitle}, {key: 'breakdown', i: 15, C: Breakdown}, {key: 'fixed', i: 20, C: Fixed},
  {key: 'breakeven', i: 24, C: BreakEven}, {key: 'problem', i: 27, C: Problem}, {key: 'monsoon', i: 31, C: Monsoon},
  {key: 'reality', i: 36, C: Reality}, {key: 'ten', i: 39, C: Ten}, {key: 's1', i: 41, C: Strat1},
  {key: 's2', i: 45, C: Strat2}, {key: 's3', i: 48, C: Strat3}, {key: 'takeaway', i: 51, C: Takeaway}, {key: 'cta', i: 53, C: Cta},
].map((s) => ({...s, at: cut(s.i)}));
const CHAPTERS = [
  {at: 0, label: 'Turf चं सत्य'}, {at: cut(5), label: 'Airline चं गणित'}, {at: cut(14), label: 'खरं गणित'},
  {at: cut(27), label: 'खरी अडचण'}, {at: cut(39), label: '३ स्ट्रॅटेजीज'}, {at: cut(51), label: 'लक्षात ठेवा'},
];
export const SCENE_TABLE = SCENES.map((s) => [s.key, s.at]);

const Video = ({withAudio = true}) => (
  <AbsoluteFill style={{background: '#0E0E0F'}}>
    <Bg />
    <Scenes scenes={SCENES} total={TOTAL} />
    <Chrome chapters={CHAPTERS} total={TOTAL} />
    {withAudio && <Audio src={staticFile('vo.mp3')} />}
  </AbsoluteFill>
);

const Root = () => <Composition id="Turf" component={Video} durationInFrames={fr(TOTAL)} fps={FPS} width={1920} height={1080} defaultProps={{withAudio: true}} />;
registerRoot(Root);
