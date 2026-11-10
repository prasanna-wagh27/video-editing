/*
 * 13.5 s style demo for the v2 look: real photos + logos, colour-blocked backdrops (photo / paper / yellow),
 * keyword-only text, pointers, camera push, colour wipes, grain, and synthesised sound effects.
 * Not a real episode; content borrows the Turf topic.
 */
import React from 'react';
import {registerRoot, Composition, AbsoluteFill, Audio, staticFile} from 'remotion';
import {BRAND, INK, RED, FPS, fr, useT, Scenes} from '../../shared/kit.jsx';
import {Sfx, Grain, Backdrop, Photo, PhotoBg, Logo, Pointer, Word, Clip, Cam, Wipe, FL, INK2, CORAL} from '../../shared/vox.jsx';

const TOTAL = 13.5;

const S1 = () => (
  <AbsoluteFill>
    <Cam keys={[[0, 960, 540, 1.0], [4.6, 1060, 560, 1.12]]}>
      <PhotoBg src="img/turf-night.jpg" kb={[1, 1]} wash={0.35} />
      <Pointer at={1.9} from={[1475, 405]} to={[1300, 230]} text="लाईट बिल" />
      <Pointer at={2.6} from={[1080, 700]} to={[1250, 860]} text="भाडं" />
    </Cam>
    <Word at={0.45} x={470} y={250} size={190} color={BRAND}>₹20 लाख</Word>
    <Sfx at={0.2} n="boom" v={0.55} />
    <Sfx at={0.45} n="thud" v={0.6} />
    <Sfx at={1.9} n="pop" v={0.5} />
    <Sfx at={2.6} n="pop" v={0.5} rate={1.15} />
  </AbsoluteFill>
);

const S2 = () => (
  <AbsoluteFill>
    <Backdrop kind="paper" />
    <Photo src="img/futsal.jpg" at={4.75} x={620} y={560} w={960} h={620} rot={-3} pos="50% 60%" />
    <Clip at={5.35} x={1400} y={430} w={760} source="इंटरनेटवरचा दावा" hi="पैसे वसूल" hiAt={6.3}>18 महिन्यांत</Clip>
    <Word at={7.4} x={1430} y={780} size={150} color={CORAL} rot={-4} shadow={false}>खरंच?</Word>
    <Sfx at={4.75} n="shutter" v={0.6} />
    <Sfx at={5.35} n="paper" v={0.6} />
    <Sfx at={6.3} n="swish" v={0.35} />
    <Sfx at={7.4} n="stamp" v={0.55} />
  </AbsoluteFill>
);

const S3 = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Backdrop kind="yellow" />
      <Word at={9.3} y={290} size={170} color={INK2} shadow={false}>मार्केटिंग</Word>
      <Logo src="img/instagram.svg" at={9.9} x={760} y={640} size={250} rot={-4} />
      <Logo src="img/youtube.svg" at={10.3} x={1160} y={640} size={250} rot={3} />
      <Word at={11.4} x={1520} y={430} size={110} color={BRAND} rot={-8} shadow={false}>
        <span style={{background: INK, borderRadius: 18, padding: '6px 26px 0', display: 'inline-block'}}>₹0</span>
      </Word>
      <Sfx at={9.3} n="thud" v={0.5} />
      <Sfx at={9.9} n="pop" v={0.5} />
      <Sfx at={10.3} n="pop" v={0.5} rate={1.2} />
      <Sfx at={11.4} n="cash" v={0.45} />
    </AbsoluteFill>
  );
};

const Demo = ({withAudio = true}) => (
  <AbsoluteFill style={{background: INK}}>
    <Scenes total={TOTAL} scenes={[{key: 's1', at: 0, C: S1}, {key: 's2', at: 4.5, C: S2}, {key: 's3', at: 9.1, C: S3}]} />
    <Wipe at={4.5} color={BRAND} />
    <Wipe at={9.1} color={INK} dir={-1} />
    <Sfx at={4.2} n="whoosh" v={0.45} />
    <Sfx at={8.8} n="whoosh" v={0.45} />
    <Grain />
    {withAudio && <Audio src={staticFile('music.wav')} volume={0.3} />}
  </AbsoluteFill>
);

registerRoot(() => <Composition id="Demo" component={Demo} durationInFrames={fr(TOTAL)} fps={FPS} width={1920} height={1080} defaultProps={{withAudio: true}} />);
