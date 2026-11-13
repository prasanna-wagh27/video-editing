/*
 * LEAN STYLE starter (dark, premium). Copy via: STYLE=lean scripts/new_reel.sh <name> vo.mp3 script.txt
 * Reference reel: reels/realestate-crm (v1 hook = this hook style).
 *
 * 1. SEGS from scripts/vo_pauses.sh (+ the aligner), *word* = yellow glow in subtitles.
 * 2. SCENES: [key, fromSec, toSec], each cut inside a VO pause. First scene = the text hook.
 * 3. One hero visual per scene; no sentence headings after the hook (subtitles carry the words).
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import {FPS, s, io, pop, abs, Y, buildChunks} from '../../shared/kit.jsx';
import {
  TXT, MUTED, LINE, C_GREEN, C_RED, LAT, up, Glass, Chip, Ini, Ico, I_BELL, Tick,
  Excel, TextHook, LeanOutro, LeanVideo,
} from '../../shared/lean.jsx';

/* ---------- timing (seconds) ---------- */
const SEGS = [
  [0.00, 3.00, 'Hook line one, hook line *two*?'],
  [3.30, 6.50, 'Problem or solution line with a *highlight* word.'],
  [6.80, 9.00, 'Comment *"DEMO"* लिहा.'],
];
const OUTRO_AT = 9.3;
const SCENES = [['hook', 0, 3.15], ['solution', 3.15, OUTRO_AT], ['outro', OUTRO_AT, OUTRO_AT + 2.4]];
const TOTAL = s(OUTRO_AT + 2.4);
const HOOK_END = SCENES[0][2];
const CHUNKS = buildChunks(SEGS).filter((c) => c.a >= s(HOOK_END)); // no subtitles over the text hook

/* ---------- 1. Hook: eyebrow + 3 big lines (one with a real logo) over one hero visual ---------- */
const Hook = ({F}) => (
  <TextHook F={F}
    eyebrow="Your Industry Business"
    lines={[
      {t: -0.3, node: <span>अजूनही <span style={{color: '#E9C9A6'}}>वही</span></span>},
      {t: 1.0, node: <><span>आणि</span><Excel size={124} style={{transform: `scale(${pop(F, 1.2, 10)}) rotate(-6deg)`}} /><span style={{color: '#33C481'}}>Excel</span></>},
      {t: 2.0, node: <span>वर?</span>},
    ]}
    visual={
      <Glass x={90} y={900} w={900} h={430} r={40} style={{padding: '34px 38px', transform: `rotate(-3deg) translateY(${io(F, 0, s(1), 80, 0)}px)`}}>
        {['Order #214 · pending', 'Payment · ?', 'Call back · ?'].map((t, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 0', borderBottom: i < 2 ? `1.5px solid ${LINE}` : 'none'}}>
            <Ini t={'ABC'[i]} size={64} />
            <div style={{flex: 1, fontSize: 32, fontWeight: 600, color: TXT, ...LAT}}>{t}</div>
          </div>
        ))}
      </Glass>
    }
    alert={{t: 2.3, text: 'Follow-up missed', x: 560, y: 840}}
  />
);

/* ---------- 2. Example glass scene (one hero visual, no heading) ---------- */
const Solution = ({F}) => (
  <AbsoluteFill>
    <Glass x={90} y={300} w={900} h={900} r={40} style={{padding: '36px 40px', ...up(F, 3.3, 18, 60)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontSize: 40, fontWeight: 700, color: TXT, ...LAT}}>Dashboard</div>
        <Chip color={Y} size={22}>{Math.round(io(F, s(3.6), s(5), 0, 128))} new</Chip>
        <div style={{flex: 1}} /><Ico d={I_BELL} size={36} />
      </div>
      {[['RP', 'Rahul Patil', C_GREEN, 'Done'], ['SK', 'Sneha K.', Y, 'Today'], ['AS', 'Amit S.', C_RED, 'Overdue']].map(([a, n, c, st], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 0', borderBottom: `1.5px solid ${LINE}`, ...up(F, 3.8 + i * 0.25, 12, 24)}}>
          <Ini t={a} size={76} /><div style={{flex: 1, fontSize: 32, fontWeight: 600, color: TXT, ...LAT}}>{n}</div><Chip color={c}>{st}</Chip>
        </div>
      ))}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, ...up(F, 5.0, 12, 20)}}><Tick size={40} /><span style={{fontSize: 30, color: MUTED, ...LAT}}>Synced</span></div>
    </Glass>
  </AbsoluteFill>
);

const Outro = ({F}) => <LeanOutro F={F} at={OUTRO_AT} cta="Comment “DEMO”" />;

/* ---------- main ---------- */
const COMPS = {hook: Hook, solution: Solution, outro: Outro};
const Video = () => <LeanVideo scenes={SCENES} comps={COMPS} chunks={CHUNKS} total={TOTAL} outroAt={OUTRO_AT} />;
const Root = () => <Composition id="Reel" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />;
registerRoot(Root);
