import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import {ButtonM, OysterM, MilkyM, Straw, SpawnPack, GrowBag, G, I} from './art.jsx';
import '../../shared/kit.jsx';
const V = () => (
  <AbsoluteFill style={{background: '#F7F3EA', padding: 40, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 30, alignItems: 'flex-end'}}>
    <ButtonM size={260} /><ButtonM size={200} tint={1} /><OysterM size={260} /><OysterM size={200} color="pink" /><MilkyM size={260} />
    <Straw /><SpawnPack size={200} /><GrowBag w={170} grow={1} /><GrowBag w={170} grow={0.5} /><GrowBag w={170} grow={1} kind="button" />
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, width: 900}}>{Object.keys(I).map((k) => <div key={k} style={{background: '#fff', borderRadius: 16, padding: 10}}><G size={56}>{I[k]}</G></div>)}</div>
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Reel" component={V} durationInFrames={1} fps={30} width={1920} height={1080} />);
