/*
 * Outgrid "iso" reel style (2nd house style, first used by reels/clinic-website).
 * Same brand (Anek font, Outgrid mark, yellow), different look from lean.jsx:
 *  - paper background (#ECEBE5) with a fine halftone dot grid + slow flat clouds
 *  - isometric 3-tone vector scenes (Box / FaceL / FaceR / FaceT on an iso grid, halftone drop shadows)
 *  - UI = white cards with a 3px ink outline and a hard offset ink shadow; tags = outlined pills or dark-green sign plates
 *  - small "// 01 — google" section label top-left (uppercase, tracked), brand top-right
 *  - captions bottom-left: bold 700 ink, highlighted words green at weight 400 (the light accent replaces an italic serif)
 * No big headline at the top, ever (user feedback): the section label is the only text up there.
 */
import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, Easing} from 'remotion';
import {s, io, pop, abs, Y, Mark, BRAND} from './kit.jsx';

/* ---------- tokens ---------- */
const INK = '#141414', PAPER = '#ECEBE5', MUTE = 'rgba(20,20,20,0.55)', FAINT = 'rgba(20,20,20,0.20)';
const GRN = '#18A34A', GRN_D = '#125C3B', RED = '#E5484D', BLUE = '#3B82F6', SAND = '#E9DBB8', GRASS = '#D3E2B6';
const LAT = {letterSpacing: '-0.02em'};
const up = (F, t, d = 14, y = 30) => ({opacity: io(F, s(t), s(t) + d), transform: `translateY(${io(F, s(t), s(t) + d, y, 0)}px)`});
const popS = (F, t, d = 12) => ({transform: `scale(${F < s(t) ? 0 : pop(F, t, d)})`});
const vis = (F, t) => F >= s(t);

/* ---------- iso engine (units: x right-down, y left-down, z up) ---------- */
const C30 = Math.cos(Math.PI / 6);
const P = (x, y, z = 0) => [(x - y) * C30, (x + y) * 0.5 - z];
const pts = (a) => a.map(([x, y, z]) => P(x, y, z).map((v) => v.toFixed(3)).join(',')).join(' ');
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16), t = k < 0 ? 0 : 255, p = Math.abs(k);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (t - v) * p));
  return `rgb(${c.join(',')})`;
};
// solid block: top lightest, left (y+d face) mid, right (x+w face) darkest; light from the left like the references
const Box = ({x = 0, y = 0, z = 0, w, d, h, c = '#DDDDDD', top, left, right, op = 1}) => (
  <g opacity={op}>
    <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={right || shade(c, -0.22)} />
    <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={left || shade(c, -0.07)} />
    <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top || shade(c, 0.14)} />
  </g>
);
const FaceL = ({x, y, z, w, h, fill}) => <polygon points={pts([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]])} fill={fill} />; // plane y = const
const FaceR = ({x, y, z, d, h, fill}) => <polygon points={pts([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]])} fill={fill} />; // plane x = const
const FaceT = ({x, y, z, w, d, fill, stroke, dash}) => <polygon points={pts([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} strokeDasharray={dash} vectorEffect="non-scaling-stroke" />;
// halftone footprint shadow, offset to the right (light from the left)
const KCtx = React.createContext(40);
const ht = (k, fine) => `url(#iso-ht${fine ? '2' : ''}-${Math.round(k * 100)})`;
const useHt = (fine) => ht(React.useContext(KCtx), fine);
const Shadow = ({x, y, w, d, off = 0.6, op = 1}) => <polygon points={pts([[x + off, y - off * 0.2, 0], [x + w + off, y - off * 0.2, 0], [x + w + off * 1.6, y + d, 0], [x + off * 1.6, y + d, 0]])} fill={useHt()} opacity={op} />;
// halftone patterns in screen px, whatever the stage scale k
const Defs = ({k = 1}) => (
  <defs>
    <pattern id={`iso-ht-${Math.round(k * 100)}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform={`scale(${1 / k})`}><circle cx="3.5" cy="3.5" r="1.7" fill={INK} opacity="0.5" /></pattern>
    <pattern id={`iso-ht2-${Math.round(k * 100)}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform={`scale(${1 / k})`}><circle cx="2.5" cy="2.5" r="1.1" fill={INK} opacity="0.4" /></pattern>
  </defs>
);
// an svg layer; children are in iso units, scaled by k and centred at (x, y) px
const Stage = ({x = 540, y = 900, k = 40, children, style = {}}) => (
  <svg width={1080} height={1920} style={{...abs(0, 0), overflow: 'visible', ...style}}>
    <Defs k={k} />
    <g transform={`translate(${x} ${y}) scale(${k})`}><KCtx.Provider value={k}>{children}</KCtx.Provider></g>
  </svg>
);
// screen position (px) of an iso point on a stage, for placing HTML tags on the scene
const at = (st, x, y, z = 0) => { const [a, b] = P(x, y, z); return [st.x + a * st.k, st.y + b * st.k]; };

/* ---------- iso props ---------- */
const Tile = ({x = -6, y = -6, w = 12, d = 12, h = 0.6, top = GRASS, pad = true}) => (
  <g>
    <Box x={x} y={y} z={-h} w={w} d={d} h={h} c="#A88B62" top={top} left="#B99A6D" right="#8E7350" />
    {pad && <FaceT x={x + 1} y={y + 1} z={0.001} w={w - 2} d={d - 2} fill={SAND} stroke="rgba(120,90,50,0.45)" dash="6 6" />}
  </g>
);
const Tree = ({x, y, s: sc = 1}) => {
  const [cx, cy] = P(x, y, 1.15 * sc);
  return (
    <g>
      <Box x={x - 0.07} y={y - 0.07} w={0.14} d={0.14} h={0.8 * sc} c="#8A6A45" />
      <circle cx={cx} cy={cy} r={0.5 * sc} fill="#5FAE5C" /><circle cx={cx - 0.15 * sc} cy={cy - 0.16 * sc} r={0.22 * sc} fill="#86C97E" />
    </g>
  );
};
const Person = ({x, y, z = 0, c = '#F08A3C', head = '#8D5A3B', hat, sc = 1.3}) => {
  const [px, py] = P(x, y, z);
  const f2 = useHt(true);
  return (
    <g transform={`translate(${px} ${py}) scale(${sc})`}>
      <ellipse cx="0.12" cy="0" rx="0.3" ry="0.12" fill={f2} />
      <rect x="-0.16" y="-0.82" width="0.32" height="0.82" rx="0.15" fill={c} />
      <circle cx="0" cy="-0.98" r="0.17" fill={head} />
      {hat && <path d="M-0.2 -1.04a0.2 0.2 0 0 1 0.4 0z" fill={hat} />}
    </g>
  );
};

/* ---------- 2D UI ---------- */
const Card = ({x, y, w, h, r = 24, children, style = {}, sh = 9}) => (
  <div style={{...abs(x, y), width: w, height: h, background: '#fff', border: `3px solid ${INK}`, borderRadius: r, boxShadow: `${sh}px ${sh + 2}px 0 ${INK}`, boxSizing: 'border-box', ...style}}>{children}</div>
);
const Tag = ({children, size = 34, style = {}}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: `3px solid ${INK}`, borderRadius: 999, padding: `${size * 0.36}px ${size * 0.7}px ${size * 0.2}px`,
    fontSize: size, fontWeight: 700, color: INK, whiteSpace: 'nowrap', boxShadow: `5px 6px 0 ${INK}`, ...LAT, ...style}}>{children}</div>
);
const Plate = ({children, size = 32, color = GRN_D, style = {}}) => ( // sign-post plate
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: color, color: '#fff', borderRadius: 10, padding: `${size * 0.34}px ${size * 0.6}px ${size * 0.18}px`,
    fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', ...LAT, ...style}}>{children}</div>
);
const Dot = ({n, size = 64, color = INK, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: color, color: '#fff', fontSize: size * 0.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: size * 0.08, boxSizing: 'border-box', flexShrink: 0, ...style}}>{n}</div>
);
const Logo = ({src, size, style = {}}) => <Img src={staticFile(`logos/${src}`)} style={{width: size, height: size, objectFit: 'contain', display: 'block', flexShrink: 0, ...style}} />;
const Ico = ({d, size = 30, color = INK, sw = 2.2}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display: 'block', flexShrink: 0}}>{d}</svg>
);

/* ---------- chrome ---------- */
const Cloud = ({x, y, w}) => (
  <svg viewBox="0 0 200 80" width={w} height={w * 0.4} style={{...abs(x, y)}}>
    <path d="M20 70h160a22 22 0 0 0-6-43 34 34 0 0 0-62-14 26 26 0 0 0-44 14A24 24 0 0 0 20 70z" fill="#fff" />
  </svg>
);
const IsoBg = ({f}) => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(20,20,20,0.11) 1.1px, transparent 1.6px)', backgroundSize: '9px 9px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(255,255,255,0.55), transparent 70%)'}} />
    <Cloud x={-120 + ((f * 0.25) % 1400)} y={520} w={300} />
    <Cloud x={1080 - ((f * 0.18 + 500) % 1500)} y={1180} w={240} />
  </AbsoluteFill>
);
const Header = ({label}) => (
  <>
    <div style={{...abs(70, 96), fontSize: 26, fontWeight: 500, color: MUTE, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{label}</div>
    <div style={{...abs(0, 88), right: 70, left: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
      <Mark size={36} color={INK} /><div style={{...BRAND, fontSize: 24, fontWeight: 600, color: INK, letterSpacing: '0.1em'}}>OUTGRID LABS</div>
    </div>
  </>
);
const Progress = ({f, total}) => (
  <div style={{...abs(0, 0), width: 1080, height: 5}}><div style={{height: '100%', width: `${(f / total) * 100}%`, background: INK}} /></div>
);
// bottom-left karaoke captions; *highlight* words = green, light weight
const IsoCaptions = ({f, chunks}) => {
  const c = chunks.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const op = Math.min(io(f, c.a, c.a + 4), io(f, c.b - 4, c.b, 1, 0));
  return (
    <div style={{position: 'absolute', left: 76, right: 150, top: 1400, display: 'flex', flexWrap: 'wrap', gap: '0 16px', opacity: op}}>
      {c.words.map((w, i) => {
        const on = f >= w.t, p = io(f, w.t, w.t + 5);
        return <span key={i} style={{fontSize: 64, lineHeight: 1.28, ...LAT, fontWeight: w.hi ? 400 : 700, color: !on ? FAINT : w.hi ? GRN : INK, transform: `translateY(${(1 - p) * 10}px)`, display: 'inline-block'}}>{w.w}</span>;
      })}
    </div>
  );
};
// scene wrapper: quick scale-in, fade-out, slow camera push
const SceneT = ({dur, first, children}) => {
  const f = useCurrentFrame();
  const inP = first ? 1 : io(f, 0, 9, 0, 1, Easing.out(Easing.cubic));
  const out = io(f, dur - 7, dur, 1, 0);
  return <AbsoluteFill style={{opacity: Math.min(inP, out), transform: `scale(${(0.94 + 0.06 * inP) * (1 + 0.03 * io(f, 0, dur, 0, 1, Easing.linear))})`}}>{children}</AbsoluteFill>;
};
const IsoVideo = ({scenes, comps, labels = {}, chunks, total, outroAt = Infinity, vo = 'vo.mp3', overlay}) => {
  const f = useCurrentFrame();
  const cur = scenes.find(([, a, b]) => f >= s(a) && f < s(b));
  return (
    <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: INK}}>
      <IsoBg f={f} />
      {vo && <Audio src={staticFile(vo)} />}
      {scenes.map(([k, a, b], i) => {
        const Comp = comps[k];
        return <Sequence key={k} from={s(a)} durationInFrames={s(b) - s(a)}><SceneT dur={s(b) - s(a)} first={i === 0}><Comp F={f} /></SceneT></Sequence>;
      })}
      {f < s(outroAt) && <Header label={(cur && labels[cur[0]]) || ''} />}
      <Progress f={f} total={total} />
      <IsoCaptions f={f} chunks={chunks} />
      {overlay}
    </AbsoluteFill>
  );
};

export {
  INK, PAPER, MUTE, FAINT, GRN, GRN_D, RED, BLUE, SAND, GRASS, LAT, up, popS, vis,
  P, pts, shade, KCtx, useHt, Box, FaceL, FaceR, FaceT, Shadow, Defs, Stage, at, Tile, Tree, Person,
  Card, Tag, Plate, Dot, Logo, Ico, IsoBg, Header, Progress, IsoCaptions, SceneT, IsoVideo,
};
