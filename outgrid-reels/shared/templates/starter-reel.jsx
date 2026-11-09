/*
 * <Project name> reel. Copied from shared/templates/starter-reel.jsx by scripts/new_reel.sh.
 * Steps: fill SEGS from scripts/vo_pauses.sh -> set CUTS on pauses -> write scenes -> QA stills -> render.
 * For more scene ideas see ../clinic-whatsapp-ai/reel.jsx (phone chat, notifications, reviews, journey ring)
 * and ../../shared/templates/food-app-reel.jsx (skyline, objection cards, growth bars).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  FPS, s, io, rise, pop, abs, Y, INK, CREAM, GOLD, GREY, CARD_SHADOW,
  H, Hi, Center, Sparks, Chat, Send, Lockup, Check,
  buildChunks, scenesFromCuts, ReelVideo, BrandOutro,
} from '../../shared/kit.jsx';

/* ---------- timing (seconds) ---------- */
// VO segments: [start, end, 'caption with *highlight* words'] — get start/end from scripts/vo_pauses.sh
const SEGS = [
  [0.0, 2.5, 'पहिलं वाक्य इथे *हायलाइट* सह'],
  [2.8, 5.5, 'दुसरं वाक्य इथे'],
  [5.8, 8.6, 'आम्हाला *DM* करा!'],
];
const VO_END = 8.6;                 // last spoken second
const OUTRO_AT = VO_END + 0.45;     // brand outro starts just after the VO
const KEYS = ['hook', 'point', 'cta', 'outro'];
const CUTS = [0, 2.65, 5.65, OUTRO_AT, OUTRO_AT + 2.4]; // each cut inside a VO pause
const TOTAL = s(CUTS[CUTS.length - 1]);
const SC = scenesFromCuts(KEYS, CUTS);
const CHUNKS = buildChunks(SEGS);

/* ---------- scenes: F is the absolute frame, so every cue is in VO seconds ---------- */
const Hook = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Center top={260}>
        <H size={84} style={rise(F, 0.1)}>मोठा प्रश्न इथे</H>
        <H size={104} style={{...rise(F, 0.7), marginTop: 6}}><Hi t={0.7}>हायलाइट</Hi></H>
      </Center>
      <Sparks x={800} y={300} o={io(F, s(1.0), s(1.2))} />
      <div style={{...abs(110, 700), width: 860, padding: '36px 50px 30px', boxSizing: 'border-box', borderRadius: 40, background: CREAM,
        boxShadow: CARD_SHADOW, transform: `rotate(-3deg) scale(${pop(F, 1.4)})`}}>
        <H size={60} color={GREY}>एक छोटी ओळ</H>
        <H size={92}><Hi rot={-1} t={1.6}>मुख्य मुद्दा!</Hi></H>
      </div>
    </AbsoluteFill>
  );
};

const POINTS = ['पहिला फायदा', 'दुसरा फायदा', 'तिसरा फायदा'];
const Point = ({from}) => {
  const F = useCurrentFrame() + from;
  return (
    <AbsoluteFill>
      <Center top={220}><H size={80} style={rise(F, 2.8)}>हे <Hi t={2.9}>महत्त्वाचं</Hi></H></Center>
      {POINTS.map((p, i) => {
        const a = io(F, s(3.4 + i * 0.6), s(3.4 + i * 0.6) + 10);
        return (
          <div key={p} style={{...abs(80, 420 + i * 230), width: 920, height: 190, borderRadius: 36, background: CREAM, boxShadow: CARD_SHADOW,
            display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box', opacity: a, transform: `translateX(${(1 - a) * -120}px)`}}>
            <Check size={100} bg={GOLD} />
            <H size={66}>{p}</H>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Cta = ({from}) => {
  const F = useCurrentFrame() + from;
  const p1 = pop(F, 5.8, 11), p2 = pop(F, 6.6, 11);
  return (
    <AbsoluteFill>
      <div style={{...abs(70, 520), width: 940, height: 250, borderRadius: 125, background: Y, display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p1}) rotate(-2deg)`}}>
        <Chat size={130} />
        <div><H size={50}>कमेंट करा</H><H size={92} style={{lineHeight: 1.05}}>"KEYWORD"</H></div>
      </div>
      <div style={{...abs(70, 830), width: 940, height: 220, borderRadius: 110, border: `5px solid ${Y}`, background: '#141414', display: 'flex', alignItems: 'center', gap: 30, padding: '0 60px', boxSizing: 'border-box',
        transform: `scale(${p2})`}}>
        <Send size={100} />
        <H size={80} color="#fff">आम्हाला <span style={{color: Y}}>DM करा!</span></H>
      </div>
      <Center top={1110}>
        <div style={{padding: '12px 34px 12px 22px', borderRadius: 50, border: `3px solid ${INK}`, background: '#fff', transform: `scale(${pop(F, 7.2, 11)})`}}>
          <Lockup size={52} text="@outgridlabs" weight={500} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

const Outro = ({from}) => <BrandOutro from={from} at={OUTRO_AT} />;

/* ---------- main ---------- */
const SCENES = {hook: Hook, point: Point, cta: Cta, outro: Outro};
const Video = ({font}) => <ReelVideo font={font} scenes={SCENES} keys={KEYS} SC={SC} chunks={CHUNKS} outroAt={s(OUTRO_AT)} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{font: 'anek'}} />;
registerRoot(Root);
