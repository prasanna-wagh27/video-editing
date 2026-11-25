import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage, IsoBg, Person} from '../../../shared/iso.jsx';
import {Ground, Road, Pile, Dumper, Plant, Weighbridge, Cabin, Gate, Barricade, Beacon, Flood, Shed, STONE20, SANDC} from '../props.jsx';
const V = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: 'Anek'}}>
      <IsoBg f={f} />
      <Stage x={540} y={560} k={38}>
        <Ground x={-7} y={-6} w={14} d={12} night={f === 1} />
        <Road x={-7} y={3} w={14} d={2.4} />
        <Plant x={-3} y={-4} run={1} F={f} night={f === 1} />
        <Pile x={5.2} y={-3.8} r={1.6} h={2.1} />
        <Pile x={4.5} y={-0.3} r={1.3} h={1.6} c={STONE20} seed={4} />
        <Pile x={1.5} y={1.2} r={1.2} h={1.3} c={SANDC} seed={7} />
        {f === 1 && <Flood x={-5.5} y={2} />}
        <Dumper x={-4} y={3.35} lights={f === 1} />
        <Dumper x={2.5} y={3.35} ghost op={0.6} />
      </Stage>
      <Stage x={540} y={1300} k={44}>
        <Ground x={-6} y={-4} w={12} d={8} />
        <Weighbridge x={-3} y={-1.2} />
        <Cabin x={-2} y={-3.6} />
        <Gate x={3.4} y={-2} open={f === 1 ? 1 : 0} />
        <Barricade x={-5} y={2.6} />
        <Beacon x={-5.4} y={3.2} F={f} />
        <Shed x={2.5} y={1.2} />
        <Dumper x={-2.6} y={-1.05} tip={f === 1 ? 1 : 0} stone={SANDC} />
        <Person x={0} y={3} c="#3B82F6" />
      </Stage>
    </AbsoluteFill>
  );
};
registerRoot(() => <Composition id="Reel" component={V} durationInFrames={2} fps={30} width={1080} height={1920} />);
