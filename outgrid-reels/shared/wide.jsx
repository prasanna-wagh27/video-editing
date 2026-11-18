/*
 * 16:9 YouTube layout (1920x1080) on top of the lean kit: same themes, cards, transitions; wide chrome.
 * First used by reels/mushroom-youtube.
 *  - Content zone y 140-880. Subtitles centred at y 930 (one line, <= 4 words per chunk from align_whisper).
 *  - Watermark top-left, chapter chip top-right (chapters: [[fromSec, 'label'], ...]), thin progress bar on top.
 *  - WideOutro: Outgrid mark + name + handle, centred for 16:9. For a client channel pass `watermark` and use your own outro.
 */
import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, Easing} from 'remotion';
import {s, io, pop, abs, Y, Mark, BRAND} from './kit.jsx';
import {THEMES, ThemeCtx, useTheme, TXT, MUTED, LINE, GOLD_T, LAT, up, LeanBg, SceneFade} from './lean.jsx';

const W = 1920, H = 1080;

const WideWatermark = () => {
  const t = useTheme();
  return (
    <div style={{...abs(56, 44), display: 'flex', alignItems: 'center', gap: 12, opacity: 0.85}}>
      <Mark size={38} color={t.ink} />
      <div style={{...BRAND, fontSize: 24, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em'}}>Outgrid Labs</div>
    </div>
  );
};
// chapter chip top-right: number + label, slides when the chapter changes
const ChapterChip = ({f, chapters}) => {
  let i = -1;
  chapters.forEach(([a], k) => { if (f >= s(a)) i = k; });
  if (i < 0) return null;
  const [a, label] = chapters[i];
  const p = io(f, s(a), s(a) + 12);
  return (
    <div style={{position: 'absolute', right: 56, top: 40, display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * -16}px)`,
      background: 'var(--l-glass)', border: `1.5px solid ${LINE}`, borderRadius: 999, padding: '10px 22px 6px 10px', boxShadow: 'var(--l-shadow)'}}>
      <div style={{width: 34, height: 34, borderRadius: 17, background: Y, color: '#0A0A0B', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 3, boxSizing: 'border-box', marginTop: -4}}>{String(i + 1).replace(/\d/g, (d) => '०१२३४५६७८९'[d])}</div>
      <div style={{fontSize: 27, fontWeight: 600, color: TXT, whiteSpace: 'nowrap', ...LAT}}>{label}</div>
    </div>
  );
};
const WideProgress = ({f, total}) => (
  <div style={{...abs(0, 0), width: W, height: 5, background: 'var(--l-line)'}}>
    <div style={{height: '100%', width: `${(f / total) * 100}%`, background: Y, boxShadow: `0 0 14px ${Y}`}} />
  </div>
);
// subtitles: one centred line on a soft pill so they stay readable over any visual
const WideCaptions = ({f, chunks, top = 936}) => {
  const light = useTheme() === THEMES.light;
  const c = chunks.find((k) => f >= k.a && f < k.b);
  if (!c) return null;
  const op = Math.min(io(f, c.a, c.a + 4), io(f, c.b - 4, c.b, 1, 0));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: op}}>
      <div style={{display: 'flex', gap: '0 16px', padding: '12px 34px 4px', borderRadius: 26, background: light ? 'rgba(255,255,255,0.82)' : 'rgba(10,10,11,0.6)',
        boxShadow: light ? '0 10px 30px rgba(60,45,10,0.10)' : 'none', backdropFilter: 'blur(10px)'}}>
        {c.words.map((w, i) => {
          const on = f >= w.t, p = io(f, w.t, w.t + 5);
          return (
            <span key={i} style={{fontSize: 52, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap', ...LAT, color: !on ? 'var(--l-faint)' : w.hi && !light ? Y : TXT,
              transform: `translateY(${(1 - p) * 6}px)`,
              ...(light && w.hi ? {background: `linear-gradient(transparent 58%, ${Y} 58%, ${Y} 90%, transparent 90%) no-repeat left / ${io(f, w.t, w.t + 6) * 100}% 100%`, padding: '0 4px'} : {})}}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

const WideOutro = ({F, at, cta}) => {
  const t = useTheme();
  const m = pop(F, at + 0.05, 11);
  const w = io(F, s(at + 0.3), s(at + 0.7));
  const bar = io(F, s(at + 0.6), s(at + 1.0), 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <div style={{...abs(660, 140), width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(closest-side, ${Y}40, transparent)`, filter: 'blur(30px)', opacity: m}} />
      <div style={{...abs(960 - 110, 230), transform: `scale(${m}) rotate(${(1 - m) * -90}deg)`, filter: `drop-shadow(0 0 40px ${Y}66)`}}><Mark size={220} color={t.ink} /></div>
      <div style={{...abs(0, 500), width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...BRAND, fontSize: 110, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', opacity: w, transform: `translateY(${(1 - w) * 40}px)`}}>Outgrid Labs</div>
        <div style={{width: 180 * bar, height: 10, borderRadius: 5, background: Y, marginTop: 26, boxShadow: `0 0 20px ${Y}`}} />
        <div style={{...BRAND, fontSize: 38, fontWeight: 500, color: MUTED, marginTop: 28, ...up(F, at + 0.9, 12, 20)}}>@outgridlabs</div>
        {cta && <div style={{marginTop: 40, ...up(F, at + 1.2, 12, 20)}}>{cta}</div>}
      </div>
    </AbsoluteFill>
  );
};

// scenes: [[key, fromSec, toSec], ...]; comps: {key: Component({F})}; chunks: subtitles (frames); chapters: [[sec, label], ...]
// bgExtra: optional node drawn over the background, under the scenes (ambient particles etc.)
const WideVideo = ({scenes, comps, chunks, total, chapters = [], outroAt = Infinity, vo = 'vo.mp3', theme = 'light', transition = 'push', bgExtra = null, watermark}) => {
  const f = useCurrentFrame();
  const t = THEMES[theme];
  return (
    <ThemeCtx.Provider value={t}>
    <AbsoluteFill style={{fontFamily: 'Anek, sans-serif', color: TXT, ...Object.fromEntries(Object.entries(t).map(([k, v]) => [`--l-${k}`, v]))}}>
      <LeanBg f={f} />
      {bgExtra}
      {vo && <Audio src={staticFile(vo)} />}
      {scenes.map(([k, a, b]) => {
        const Comp = comps[k];
        return (
          <Sequence key={k} from={s(a)} durationInFrames={s(b) - s(a)}>
            <SceneFade dur={s(b) - s(a)} first={a === 0} last={k === scenes[scenes.length - 1][0]} transition={transition}><Comp F={f} /></SceneFade>
          </Sequence>
        );
      })}
      {f < s(outroAt) && (watermark === undefined ? <WideWatermark /> : watermark)}
      {f < s(outroAt) && <ChapterChip f={f} chapters={chapters} />}
      <WideProgress f={f} total={total} />
      <WideCaptions f={f} chunks={chunks} />
    </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

export {W, H, WideWatermark, ChapterChip, WideProgress, WideCaptions, WideOutro, WideVideo};
