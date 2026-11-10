/*
 * Kit v2: explainer-style pieces (real photos, logos, paper/yellow colour blocks, grain, pointers,
 * camera push-ins, colour wipes) + sound effects. Use with kit.jsx; all times are VO seconds.
 *
 * On-screen text rule: keywords and numbers only (2-5 words). The voiceover carries the sentence;
 * the screen carries the picture, the number, or the one word that matters.
 */
import React, {useContext} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, Easing} from 'remotion';
import {BRAND, WHITE, INK, RED, F, abs, fr, useT, io, pop, OUT, INOUT, TCtx, draw} from './kit.jsx';

/* ---------- palette v2 ---------- */
export const PAPER = '#F2ECDF';     // warm paper for "document / history / context" scenes
export const PINK = '#FF7A9A';      // rare highlight (people, brands)
export const SKY2 = '#4DA8FF';      // info / tech / water
export const CORAL = '#FF6B57';     // loss, warnings
export const INK2 = '#16140F';      // text on paper / yellow
// Rule: each scene = one backdrop (dark / paper / yellow / photo) + at most ONE accent besides yellow.

/* ---------- sound ---------- */
// <Sfx at={4.2} n="pop" v={0.5} />  plays shared/sfx/<n>.wav at VO second `at` (works inside any scene).
// names: whoosh swish pop click tick ding coin cash thud boom riser type stamp buzz chime shutter paper glitch swipe notify
export const Sfx = ({at, n, v = 0.5, rate = 1}) => {
  const off = useContext(TCtx);
  return (
    <Sequence from={fr(at) - off} durationInFrames={fr(3)} layout="none" name={`sfx:${n}`}>
      <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} playbackRate={rate} />
    </Sequence>
  );
};

/* ---------- backdrops (colour blocking) ---------- */
export const Grain = ({o = 0.06, every = 3}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: o}}>
      <svg width="1920" height="1080">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / every) % 12} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="1920" height="1080" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Backdrop = ({kind = 'paper'}) => {
  if (kind === 'yellow') return (
    <AbsoluteFill style={{background: BRAND}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 2.4px, transparent 2.4px)', backgroundSize: '26px 26px'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1400px 900px at 50% 45%, transparent 55%, rgba(120,80,0,0.18) 100%)'}} />
    </AbsoluteFill>
  );
  return ( // paper
    <AbsoluteFill style={{background: PAPER}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.045) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,0,0,0.045) 1.5px, transparent 1.5px)', backgroundSize: '64px 64px'}} />
      <AbsoluteFill style={{background: 'radial-gradient(1500px 950px at 50% 45%, transparent 50%, rgba(90,60,20,0.16) 100%)'}} />
    </AbsoluteFill>
  );
};

// text style on light backdrops
export const FL = {...F, color: INK2};

/* ---------- real images ---------- */
// Photo print: white border, shadow, slow Ken Burns push, optional tape and halftone "printed" look.
// src: file in public/ (e.g. 'img/turf.jpg'). kb = [scale at `at`, scale `dur` seconds later].
export const Photo = ({src, at, x, y, w, h, rot = -2, kb = [1.04, 1.16], dur = 7, pos = '50% 50%', border = 14,
  tape = true, print = false, mono = false, caption, out}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const p = pop(t, at, 14);
  const o = out === undefined ? 1 : io(t, out, out + 0.3, 1, 0, INOUT);
  const s = io(t, at, at + dur, kb[0], kb[1], Easing.linear);
  return (
    <div style={abs(x, y, {width: w, height: h, transform: `translate(-50%,-50%) rotate(${rot + (1 - p) * 6}deg) scale(${0.82 + 0.18 * p})`, opacity: Math.min(1, p * 1.6) * o})}>
      <div style={{position: 'absolute', inset: 0, background: WHITE, padding: border, paddingBottom: caption ? border + 56 : border, boxShadow: '0 30px 70px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.25)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#222'}}>
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${s})`,
            filter: mono ? 'grayscale(1) contrast(1.15)' : 'saturate(1.08) contrast(1.04)'}} />
          {print && <div style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.35, backgroundImage: 'radial-gradient(rgba(0,0,0,0.9) 1.1px, transparent 1.6px)', backgroundSize: '6px 6px'}} />}
        </div>
        {caption && <div style={{...FL, fontSize: 36, fontWeight: 600, marginTop: 14, textAlign: 'center'}}>{caption}</div>}
      </div>
      {tape && <div style={abs('50%', -22, {width: 170, height: 46, transform: 'translateX(-50%) rotate(-4deg)', background: 'rgba(255,224,110,0.82)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)'})} />}
    </div>
  );
};

// Full-bleed photo backdrop with slow push and a dark wash so white/yellow text sits on it.
export const PhotoBg = ({src, at = 0, dur = 10, kb = [1.05, 1.18], pos = '50% 50%', wash = 0.55, mono = false, tint}) => {
  const t = useT();
  const s = io(t, at, at + dur, kb[0], kb[1], Easing.linear);
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${s})`, filter: mono ? 'grayscale(1) contrast(1.1)' : 'none'}} />
      {tint && <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply', opacity: 0.55}} />}
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(10,10,10,${wash * 0.5}), rgba(10,10,10,${wash}))`}} />
    </AbsoluteFill>
  );
};

// Sticker cut-out: a transparent PNG/SVG with a thick white outline (logos, people, products).
export const Sticker = ({src, at, x, y, w, rot = -4, outline = 8, out}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const p = pop(t, at, 12);
  const o = out === undefined ? 1 : io(t, out, out + 0.3, 1, 0, INOUT);
  const k = outline;
  return (
    <div style={abs(x, y, {width: w, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, opacity: o})}>
      <Img src={staticFile(src)} style={{width: '100%', filter: `drop-shadow(${k}px 0 0 #fff) drop-shadow(-${k}px 0 0 #fff) drop-shadow(0 ${k}px 0 #fff) drop-shadow(0 -${k}px 0 #fff) drop-shadow(0 24px 30px rgba(0,0,0,0.35))`}} />
    </div>
  );
};

// Logo tile: brand logo on a white rounded square, optional short label under it.
export const Logo = ({src, at, x, y, size = 220, label, bg = WHITE, pad = 0.18, rot = 0, out}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const p = pop(t, at, 12);
  const o = out === undefined ? 1 : io(t, out, out + 0.3, 1, 0, INOUT);
  return (
    <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18})}>
      <div style={{width: size, height: size, borderRadius: size * 0.22, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.35)'}}>
        <Img src={staticFile(src)} style={{width: size * (1 - 2 * pad), height: size * (1 - 2 * pad), objectFit: 'contain'}} />
      </div>
      {label && <div style={{...F, fontSize: 40, fontWeight: 700, color: 'inherit', paddingTop: 4}}>{label}</div>}
    </div>
  );
};

/* ---------- annotation ---------- */
// Pointer: pulsing dot on the thing, a line draws out, then a short label pops (2-4 words).
export const Pointer = ({at, from: [x0, y0], to: [x1, y1], text, color = BRAND, ink = INK, size = 54}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const pl = io(t, at + 0.1, at + 0.45);
  const lp = pop(t, at + 0.4, 13);
  const pulse = 1 + 0.25 * Math.abs(Math.sin((t - at) * 3));
  const left = x1 < x0;
  return (
    <>
      <svg style={abs(0, 0)} width="1920" height="1080">
        <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" {...draw(pl)} />
        <circle cx={x0} cy={y0} r={14 * pulse} fill="none" stroke={color} strokeWidth="4" opacity={0.6} />
        <circle cx={x0} cy={y0} r={9} fill={color} />
      </svg>
      <div style={abs(x1, y1, {transform: `translate(${left ? '-100%' : '0'}, -50%) scale(${lp})`, transformOrigin: left ? 'right center' : 'left center'})}>
        <div style={{...F, fontSize: size, fontWeight: 700, color: ink, background: color, borderRadius: 14, padding: '14px 24px 8px', boxShadow: '0 14px 30px rgba(0,0,0,0.3)'}}>{text}</div>
      </div>
    </>
  );
};

// One big word / number: the only text on screen. Scales in with a little overshoot.
export const Word = ({at, children, x = 960, y = 540, size = 220, color = WHITE, weight = 800, stretch = '80%', rot = 0, out, shadow = true}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const p = pop(t, at, 12);
  const o = out === undefined ? 1 : io(t, out, out + 0.25, 1, 0, INOUT);
  return (
    <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2) * o})}>
      <div style={{...F, fontSize: size, fontWeight: weight, fontStretch: stretch, color, letterSpacing: -size * 0.02, paddingTop: size * 0.1, textShadow: shadow ? '0 12px 40px rgba(0,0,0,0.35)' : 'none'}}>{children}</div>
    </div>
  );
};

// Torn paper clipping (news / document). Keep `children` short; `hi` = highlighted part drawn with a marker.
const tear = Array.from({length: 41}, (_, i) => `${100 - i * 2.5}% ${100 - (i % 2 ? 0 : 3.2) - ((i * 37) % 5) * 0.5}%`).join(', ');
export const Clip = ({at, x, y, w = 900, source, children, hi, hiAt, rot = -1.5, out}) => {
  const t = useT();
  if (t < at - 0.05) return null;
  const p = pop(t, at, 15);
  const o = out === undefined ? 1 : io(t, out, out + 0.3, 1, 0, INOUT);
  const hp = io(t, hiAt ?? at + 0.6, (hiAt ?? at + 0.6) + 0.45);
  return (
    <div style={abs(x, y, {width: w, transform: `translate(-50%,-50%) rotate(${rot + (1 - p) * -4}deg) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.6) * o, filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.35))'})}>
      <div style={{background: '#FBF8F1', padding: '34px 44px 60px', clipPath: `polygon(0 0, 100% 0, ${tear})`}}>
        {source && <div style={{...FL, fontSize: 26, fontWeight: 700, letterSpacing: 3, color: '#8A8170', paddingBottom: 18, borderBottom: '2px solid #DDD5C3', marginBottom: 22}}>{source}</div>}
        <div style={{...FL, fontSize: 64, fontWeight: 700, lineHeight: 1.18, whiteSpace: 'normal'}}>
          {children}
          {hi && <span style={{position: 'relative', display: 'inline-block', marginLeft: 12}}>
            <span style={{position: 'absolute', left: -6, right: -6, top: '18%', bottom: '4%', background: BRAND, transformOrigin: 'left', transform: `scaleX(${hp}) rotate(-1deg)`, borderRadius: 6}} />
            <span style={{position: 'relative'}}>{hi}</span>
          </span>}
        </div>
      </div>
    </div>
  );
};

/* ---------- camera + transitions ---------- */
// Camera: keys = [[time, x, y, scale], ...] (x,y = point of the 1920x1080 frame to centre on).
export const Cam = ({keys, children}) => {
  const t = useT();
  let k = keys[0];
  let s = k[3], x = k[1], y = k[2];
  for (let i = 1; i < keys.length; i++) {
    const [ta, xa, ya, sa] = keys[i - 1], [tb, xb, yb, sb] = keys[i];
    if (t >= ta) { x = io(t, ta, tb, xa, xb, INOUT); y = io(t, ta, tb, ya, yb, INOUT); s = io(t, ta, tb, sa, sb, INOUT); }
  }
  return <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})`}}>{children}</AbsoluteFill>;
};

// Colour wipe across the cut at `at` (place at top level, above scenes). Pair with <Sfx n="whoosh" at={at - 0.3} />.
export const Wipe = ({at, color = BRAND, d = 0.7, dir = 1}) => {
  const t = useT();
  if (t < at - d / 2 || t > at + d / 2) return null;
  const p = io(t, at - d / 2, at + d / 2, 0, 1, Easing.linear);
  const x1 = io(p, 0, 0.5, -10, 110, INOUT), x0 = io(p, 0.5, 1, -10, 110, INOUT);
  const L = dir > 0 ? x0 : 100 - x1, R = dir > 0 ? x1 : 100 - x0;
  return <AbsoluteFill style={{background: color, clipPath: `polygon(${L}% 0, ${R + 8}% 0, ${R}% 100%, ${L - 8}% 100%)`}} />;
};
