/*
 * "Marathi AI Institute" reel style (brand #2, separate from Outgrid). First used by reels/mai-chatgpt-marathi.
 * Look (from the user's reference screenshots):
 *  - warm paper (#EFEEEA) with a visible halftone dot screen, halftone drop shadows under every object
 *  - the spoken line is the headline at the top-left: Poppins 600 ink, accent words in a RED ITALIC SERIF
 *    (Tiro Devanagari Marathi italic for Marathi, Instrument Serif italic for Latin), words appear as they are spoken
 *  - small mono label top-left "// 01 · step one" (JetBrains Mono, grey)
 *  - cartoon line-art vectors: 5px ink outlines, white / flat fills, red + blue accents
 *  - black step badge (big white number + dot pager), blue label pills, cursor with a red click ring
 * Fonts: shared/fonts/mai/*.woff2 (OFL, from @fontsource), loaded here; reach them through the reel's public/fonts symlink.
 */
import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, Easing, delayRender, continueRender} from 'remotion';
import {s, io, pop, abs} from './kit.jsx';

/* ---------- fonts ---------- */
const DEV = 'U+0900-097F, U+1CD0-1CFF, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF';
const LATN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const FACES = [
  ...[500, 600, 700].flatMap((w) => [['MaiSans', `poppins-devanagari-${w}-normal`, {weight: String(w), unicodeRange: DEV}], ['MaiSans', `poppins-latin-${w}-normal`, {weight: String(w), unicodeRange: LATN}]]),
  ['MaiSerif', 'tiro-devanagari-marathi-devanagari-400-italic', {style: 'italic', unicodeRange: DEV}],
  ['MaiSerif', 'instrument-serif-latin-400-italic', {style: 'italic', unicodeRange: LATN}],
  ['MaiMono', 'jetbrains-mono-latin-400-normal', {weight: '400'}], ['MaiMono', 'jetbrains-mono-latin-600-normal', {weight: '600'}],
];
const fh = delayRender('mai-fonts', {timeoutInMilliseconds: 120000});
Promise.all(FACES.map(([fam, file, d]) => new FontFace(fam, `url(${staticFile(`fonts/mai/${file}.woff2`)})`, d).load().then((f) => document.fonts.add(f))))
  .catch(() => {}).finally(() => continueRender(fh));
setTimeout(() => continueRender(fh), 30000);

/* ---------- tokens (sampled from the references) ---------- */
const PAPER = '#EFEEEA', INK = '#111111', RED = '#E5352B', BLUE = '#2F62E8', SKY = '#7DB9EF', SKY_D = '#5A9FE2', MUTE = '#8C8A85', FAINT = 'rgba(17,17,17,0.18)', YEL = '#F4C430', GREEN = '#22A55A';
const SANS = 'MaiSans, sans-serif', SERIF = 'MaiSerif, serif', MONO = 'MaiMono, monospace';
const LW = 5; // outline width
const up = (F, t, d = 12, y = 30) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, y, 0)}px)`});
const popS = (F, t, d = 12) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const vis = (F, t) => F >= s(t);

/* ---------- surfaces ---------- */
// halftone shadow blob (put it behind an object, offset down-right)
const HShadow = ({x, y, w, h, r = 30, op = 1, style = {}}) => (
  <div style={{...abs(x, y), width: w, height: h, borderRadius: r, opacity: op,
    backgroundImage: `radial-gradient(${INK} 1.5px, transparent 1.9px)`, backgroundSize: '6px 6px',
    maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)', WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)', ...style}} />
);
// outlined card with a halftone offset shadow
const Panel = ({x, y, w, h, r = 26, bg = '#fff', children, style = {}, shadow = true, lw = LW}) => (
  <div style={{...abs(x, y), width: w, height: h, ...style}}>
    {shadow && <div style={{...abs(14, 16), width: w, height: h, borderRadius: r, backgroundImage: `radial-gradient(${INK} 1.4px, transparent 1.8px)`, backgroundSize: '6px 6px', opacity: 0.85}} />}
    <div style={{position: 'absolute', inset: 0, background: bg, border: `${lw}px solid ${INK}`, borderRadius: r, overflow: 'hidden', boxSizing: 'border-box'}}>{children}</div>
  </div>
);
const Pill = ({children, bg = BLUE, color = '#fff', size = 34, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color, borderRadius: 12, padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.12}px`, fontFamily: SANS, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
// black step badge: big number + dot pager
const StepBadge = ({n, of = 5, size = 100, style = {}}) => (
  <div style={{width: size * 0.9, height: size, borderRadius: size * 0.16, background: INK, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `6px 8px 0 rgba(17,17,17,0.25)`, ...style}}>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size * 0.62, lineHeight: 1, marginTop: size * 0.08}}>{n}</div>
    <div style={{display: 'flex', gap: size * 0.05, marginTop: size * 0.04}}>{Array.from({length: of}, (_, i) => <div key={i} style={{width: size * 0.07, height: size * 0.07, borderRadius: '50%', background: i + 1 === n ? RED : i + 1 < n ? '#fff' : 'transparent', border: `1.5px solid ${i + 1 === n ? RED : '#fff'}`}} />)}</div>
  </div>
);
// mouse cursor with a red click ring at time t
const Cursor = ({F, x, y, t, size = 80}) => {
  const k = F - s(t), ring = k >= 0 && k < 18 ? k / 18 : -1;
  const press = k >= -2 && k < 4 ? 0.88 : 1;
  return (
    <div style={{...abs(x, y)}}>
      {ring >= 0 && <div style={{...abs(-size * 0.7, -size * 0.7), width: size * 1.4, height: size * 1.4, borderRadius: '50%', border: `4px solid ${RED}`, opacity: 1 - ring, transform: `scale(${0.4 + ring})`}} />}
      <svg viewBox="0 0 24 24" width={size} height={size} style={{...abs(-size * 0.18, -size * 0.1), transform: `scale(${press})`}}><path d="M5 3l13 9-6 1.4 3.6 6.4-2.6 1.4-3.6-6.4L5 19z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /></svg>
    </div>
  );
};
const Logo = ({src, size, style = {}}) => <Img src={staticFile(`logos/${src}`)} style={{width: size, height: size, objectFit: 'contain', display: 'block', flexShrink: 0, ...style}} />;
const Ico = ({d, size = 40, color = INK, sw = 2.2}) => <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block', flexShrink: 0}}>{d}</svg>;

/* brand mark (placeholder until the real logo arrives): black squircle, white म + red italic AI */
const MaiMark = ({size = 80}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: size * 0.02, flexShrink: 0}}>
    <span style={{fontFamily: SANS, fontWeight: 700, color: '#fff', fontSize: size * 0.5, lineHeight: 1, marginTop: size * 0.1}}>म</span>
    <span style={{fontFamily: SERIF, fontStyle: 'italic', color: RED, fontSize: size * 0.46, lineHeight: 1, marginTop: size * 0.04}}>AI</span>
  </div>
);

/* ---------- chrome ---------- */
const MaiBg = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(17,17,17,0.13) 1.2px, transparent 1.7px)', backgroundSize: '8px 8px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 55% at 50% 48%, rgba(255,255,255,0.6), transparent 72%)'}} />
  </AbsoluteFill>
);
const MaiHeader = ({label, right}) => (
  <>
    <div style={{...abs(80, 118), fontFamily: MONO, fontSize: 27, color: MUTE, whiteSpace: 'nowrap'}}>{label}</div>
    {right && <div style={{...abs(0, 118), right: 80, left: 'auto', fontFamily: MONO, fontSize: 27, fontWeight: 600, color: MUTE, letterSpacing: '0.06em', whiteSpace: 'nowrap'}}>{right}</div>}
  </>
);
// headline captions (top-left): the spoken line, words appear as spoken; *hi* words = red italic serif
const MaiCaptions = ({f, chunks, top = 232}) => {
  const c = chunks.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const out = io(f, c.b - 4, c.b, 1, 0);
  return (
    <div style={{position: 'absolute', left: 80, right: 120, top, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 22px', opacity: out}}>
      {c.words.map((w, i) => {
        const p = io(f, w.t - 2, w.t + 5);
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
            ...(w.hi ? {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 92, color: RED, lineHeight: 1.18, letterSpacing: '-0.01em'}
              : {fontFamily: SANS, fontWeight: 600, fontSize: 76, color: INK, lineHeight: 1.18, letterSpacing: '-0.025em'})}}>{w.w}</span>
        );
      })}
    </div>
  );
};
const MaiProgress = ({f, total}) => <div style={{...abs(0, 1914), width: 1080, height: 6}}><div style={{height: '100%', width: `${(f / total) * 100}%`, background: RED}} /></div>;
const MaiScene = ({dur, first, children}) => {
  const f = useCurrentFrame();
  const inP = first ? 1 : io(f, 0, 8, 0, 1, Easing.out(Easing.cubic));
  const out = io(f, dur - 6, dur, 1, 0);
  return <AbsoluteFill style={{opacity: Math.min(inP, out), transform: `translateY(${(1 - inP) * 40}px) scale(${1 + 0.025 * io(f, 0, dur, 0, 1, Easing.linear)})`}}>{children}</AbsoluteFill>;
};
const MaiVideo = ({scenes, comps, labels = {}, right, chunks, total, outroAt = Infinity, vo = 'vo.mp3', overlay}) => {
  const f = useCurrentFrame();
  const cur = scenes.find(([, a, b]) => f >= s(a) && f < s(b));
  return (
    <AbsoluteFill style={{fontFamily: SANS, color: INK}}>
      <MaiBg />
      {vo && <Audio src={staticFile(vo)} />}
      {scenes.map(([k, a, b], i) => {
        const Comp = comps[k];
        return <Sequence key={k} from={s(a)} durationInFrames={s(b) - s(a)}><MaiScene dur={s(b) - s(a)} first={i === 0}><Comp F={f} /></MaiScene></Sequence>;
      })}
      {f < s(outroAt) && <MaiHeader label={(cur && labels[cur[0]]) || ''} right={right} />}
      <MaiCaptions f={f} chunks={chunks} />
      <MaiProgress f={f} total={total} />
      {overlay}
    </AbsoluteFill>
  );
};

export {
  PAPER, INK, RED, BLUE, SKY, SKY_D, MUTE, FAINT, YEL, GREEN, SANS, SERIF, MONO, LW, up, popS, vis,
  HShadow, Panel, Pill, StepBadge, Cursor, Logo, Ico, MaiMark, MaiBg, MaiHeader, MaiCaptions, MaiProgress, MaiScene, MaiVideo,
};
