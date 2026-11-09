/*
 * Tarun Udyojak: three style directions for one beat of the Turf video (1920x1080, 16:9).
 * Beat: "समजा तुम्ही एका तासाचे १२०० रुपये घेता … हातात उरतात साधारण १००० रुपये"
 * Render: npx remotion still videos/turf-business/style-frames.jsx StyleA frames/A.png --public-dir=videos/turf-business/public
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, staticFile, delayRender, continueRender} from 'remotion';

const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 60000});
new FontFace('Anek', `url(${staticFile('fonts/AnekDevanagari.ttf')})`, {weight: '100 800', stretch: '75% 125%'})
  .load().then((ff) => document.fonts.add(ff)).catch(() => {}).finally(() => continueRender(fontHandle));

/* ---------- brand tokens ---------- */
const BRAND = '#FFD014';
const WHITE = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.55)';
const FAINT = 'rgba(255,255,255,0.10)';
const F = {fontFamily: 'Anek, sans-serif', color: WHITE, lineHeight: 1};
const abs = (left, top, extra = {}) => ({position: 'absolute', left, top, ...extra});

const ROWS = [
  {k: 'light', label: 'लाईट बिल', v: '₹100'},
  {k: 'app', label: 'बुकिंग ॲप कमिशन', v: '₹50'},
  {k: 'grass', label: 'ग्रास मेंटेनन्स', v: '₹50'},
];

/* ---------- line icons ---------- */
const Icon = ({k, size = 40, color = WHITE, sw = 3.2}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round'};
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      {k === 'light' && <path d="M27 4 11 27h12l-2 17 16-23H25z" {...p} />}
      {k === 'app' && <><rect x="13" y="4" width="22" height="40" rx="5" {...p} /><path d="M21 37h6" {...p} /></>}
      {k === 'grass' && <path d="M6 42h36M12 42c0-9-3-15-6-19M20 42c0-12 1-21 5-29M28 42c0-8 3-14 8-18M36 42c0-5 1-9 4-12" {...p} />}
      {k === 'clock' && <><circle cx="24" cy="24" r="18" {...p} /><path d="M24 14v10l7 5" {...p} /></>}
    </svg>
  );
};

/* small channel mark, same in every direction */
const Mark = ({x = 96, y = 70, dim = 0.7}) => (
  <div style={abs(x, y, {display: 'flex', alignItems: 'center', gap: 14, opacity: dim})}>
    <div style={{width: 12, height: 12, borderRadius: 3, background: BRAND}} />
    <div style={{...F, fontSize: 26, fontWeight: 500, letterSpacing: 0.5, paddingTop: 4}}>तरुण उद्योजक</div>
  </div>
);

/* ============ A. EDITORIAL: type-led, hairlines, no boxes ============ */
const StyleA = () => (
  <AbsoluteFill style={{background: '#0E0E0E'}}>
    <Mark />
    <div style={abs(1824, 70, {...F, fontSize: 26, fontWeight: 400, color: MUTED, textAlign: 'right', transform: 'translateX(-100%)', paddingTop: 4})}>
      ०४ / ०९
    </div>

    {/* left: the claim */}
    <div style={abs(160, 230)}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 48, height: 3, background: BRAND}} />
        <div style={{...F, fontSize: 34, fontWeight: 500, color: BRAND, paddingTop: 6}}>एका तासाचं गणित</div>
      </div>
      <div style={{...F, fontSize: 64, fontWeight: 400, color: MUTED, marginTop: 70}}>बुकिंग</div>
      <div style={{...F, fontSize: 250, fontWeight: 600, letterSpacing: -6, marginTop: 40}}>₹1,200</div>
      <div style={{...F, fontSize: 40, fontWeight: 400, color: MUTED, marginTop: 40, lineHeight: 1.35}}>
        पण हे सगळे पैसे<br />तुमच्या खिशात जात नाहीत.
      </div>
    </div>

    {/* right: ledger */}
    <div style={abs(1080, 300, {width: 680})}>
      {ROWS.map((r) => (
        <div key={r.k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '30px 0 24px', borderBottom: `2px solid ${FAINT}`}}>
          <div style={{...F, fontSize: 44, fontWeight: 400}}>{r.label}</div>
          <div style={{...F, fontSize: 44, fontWeight: 400, color: MUTED}}>− {r.v}</div>
        </div>
      ))}
      <div style={{height: 3, background: WHITE, marginTop: 34}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 36}}>
        <div style={{...F, fontSize: 44, fontWeight: 500, paddingBottom: 18}}>तुमच्या हातात</div>
        <div style={{...F, fontSize: 150, fontWeight: 600, color: BRAND, letterSpacing: -3}}>₹1,000</div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ============ B. SOFT UI: cards, icon chips, brand pill ============ */
const StyleB = () => (
  <AbsoluteFill style={{background: 'radial-gradient(1200px 800px at 30% 45%, #1C1C1E 0%, #121213 55%, #0D0D0E 100%)'}}>
    {/* faint dot grid */}
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '44px 44px'}} />
    <Mark />

    {/* left */}
    <div style={abs(170, 330)}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 26px 10px', borderRadius: 100, border: `2px solid rgba(255,208,20,0.45)`, background: 'rgba(255,208,20,0.08)'}}>
        <Icon k="clock" size={30} color={BRAND} sw={3.6} />
        <div style={{...F, fontSize: 32, fontWeight: 500, color: BRAND}}>१ तासाचं बुकिंग</div>
      </div>
      <div style={{...F, fontSize: 210, fontWeight: 600, letterSpacing: -5, marginTop: 50}}>₹1,200</div>
      <div style={{...F, fontSize: 40, fontWeight: 400, color: MUTED, marginTop: 34}}>मालकाच्या खिशात किती जातात?</div>
    </div>

    {/* arrow */}
    <svg width="110" height="40" viewBox="0 0 110 40" style={abs(870, 520)}>
      <path d="M4 20h92M80 6l16 14-16 14" fill="none" stroke={MUTED} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    {/* card */}
    <div style={abs(1020, 230, {
      width: 740, padding: '26px 30px 30px', borderRadius: 40,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))',
      border: '1.5px solid rgba(255,255,255,0.10)',
      boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
    })}>
      {ROWS.map((r, i) => (
        <div key={r.k} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 14px', borderBottom: i < ROWS.length - 1 ? `1.5px solid ${FAINT}` : 'none'}}>
          <div style={{width: 76, height: 76, borderRadius: 22, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon k={r.k} size={38} />
          </div>
          <div style={{...F, fontSize: 40, fontWeight: 400, flex: 1, paddingTop: 6}}>{r.label}</div>
          <div style={{...F, fontSize: 42, fontWeight: 500, color: MUTED, paddingTop: 6}}>− {r.v}</div>
        </div>
      ))}
      <div style={{marginTop: 22, borderRadius: 26, background: BRAND, padding: '30px 36px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{...F, fontSize: 42, fontWeight: 600, color: '#111'}}>तुमच्या हातात</div>
        <div style={{...F, fontSize: 84, fontWeight: 700, color: '#111', letterSpacing: -2}}>₹1,000</div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ============ C. INFOGRAPHIC: one bar, sliced; giant numbers ============ */
const BAR_X = 160, BAR_W = 1600, BAR_Y = 600, BAR_H = 150;
const SEGS = [ // share of 1200
  {k: 'keep', v: 1000}, {k: 'light', v: 100}, {k: 'app', v: 50}, {k: 'grass', v: 50},
];
const StyleC = () => {
  let x = BAR_X;
  const parts = SEGS.map((sg) => { const w = (BAR_W * sg.v) / 1200; const o = {...sg, x, w}; x += w; return o; });
  const keep = parts[0];
  const cut = parts.slice(1);
  return (
    <AbsoluteFill style={{background: '#0B0B0B'}}>
      <Mark />

      {/* headline row */}
      <div style={abs(160, 210, {display: 'flex', alignItems: 'flex-end', gap: 40})}>
        <div style={{...F, fontSize: 92, fontWeight: 600, letterSpacing: -1}}>₹1,200 पैकी</div>
        <div style={{...F, fontSize: 92, fontWeight: 600, color: BRAND, letterSpacing: -1}}>हातात किती?</div>
      </div>
      <div style={abs(162, 340, {...F, fontSize: 38, fontWeight: 400, color: MUTED})}>एका तासाच्या बुकिंगचं खरं गणित</div>

      {/* scale ticks */}
      <div style={abs(BAR_X, BAR_Y - 54, {...F, fontSize: 28, fontWeight: 400, color: MUTED})}>₹0</div>
      <div style={abs(BAR_X + BAR_W, BAR_Y - 54, {...F, fontSize: 28, fontWeight: 400, color: MUTED, transform: 'translateX(-100%)'})}>₹1,200</div>

      {/* the bar */}
      <div style={abs(keep.x, BAR_Y, {width: keep.w - 8, height: BAR_H, background: BRAND, borderRadius: '28px 8px 8px 28px'})} />
      <div style={abs(keep.x + 44, BAR_Y + 34, {...F, fontSize: 96, fontWeight: 700, color: '#0B0B0B', letterSpacing: -2})}>₹1,000</div>
      {cut.map((p, i) => (
        <div key={p.k} style={abs(p.x, BAR_Y, {
          width: p.w - (i < cut.length - 1 ? 8 : 0), height: BAR_H,
          borderRadius: i === cut.length - 1 ? '8px 28px 28px 8px' : 8,
          background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 6px, rgba(255,255,255,0.05) 6px 14px)',
        })} />
      ))}

      {/* labels under the bar */}
      <div style={abs(keep.x, BAR_Y + BAR_H + 40, {...F, fontSize: 40, fontWeight: 500, color: BRAND})}>तुमचा प्रॉफिट</div>
      <div style={abs(cut[0].x - 40, BAR_Y + BAR_H + 34, {width: 2, height: 170, background: FAINT})} />
      <div style={abs(cut[0].x - 40, BAR_Y + BAR_H + 40, {transform: 'translateX(-100%)', paddingRight: 30, textAlign: 'right'})}>
        {cut.map((p) => {
          const r = ROWS.find((o) => o.k === p.k);
          return (
            <div key={p.k} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, marginBottom: 18}}>
              <Icon k={p.k} size={30} color={MUTED} sw={3.6} />
              <div style={{...F, fontSize: 34, fontWeight: 400, color: MUTED, paddingTop: 4, whiteSpace: 'nowrap'}}>{r.label}</div>
              <div style={{...F, fontSize: 34, fontWeight: 500, paddingTop: 4, width: 110, textAlign: 'right'}}>−{r.v}</div>
            </div>
          );
        })}
      </div>
      <div style={abs(cut[0].x, BAR_Y + BAR_H + 40, {...F, fontSize: 40, fontWeight: 500})}>खर्च ₹200</div>
    </AbsoluteFill>
  );
};

const Root = () => (
  <>
    <Composition id="StyleA" component={StyleA} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="StyleB" component={StyleB} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="StyleC" component={StyleC} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
