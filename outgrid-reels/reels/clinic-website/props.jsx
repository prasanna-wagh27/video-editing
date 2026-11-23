// Isometric props for the clinic-website reel (iso units, see shared/iso.jsx)
import React from 'react';
import {P, pts, shade, Box, FaceL, FaceR, FaceT, Shadow, GRN, INK} from '../../shared/iso.jsx';

const GLASS = '#9CCBEA', GLASS_D = '#6FA7CF', WALL = '#F5F2EA';

// clinic: 2-storey white block, glass windows, door, green cross sign on the roof edge. h = built height 0..1
export const Clinic = ({x = 0, y = 0, w = 4.2, d = 3.2, H = 3.4, wall = WALL, accent = GRN, p = 1, sign = true}) => {
  const h = H * p;
  return (
    <g>
      <Shadow x={x} y={y} w={w} d={d} off={h * 0.35} op={p} />
      <Box x={x} y={y} w={w} d={d} h={h} c={wall} top="#FFFFFF" left={wall} right={shade('#F5F2EA', -0.16)} />
      {p > 0.98 && <g>
        {/* front-left face (y + d): windows top row, door + windows bottom row */}
        {[0, 1, 2].map((i) => <FaceL key={'t' + i} x={x + 0.35 + i * 1.3} y={y + d} z={2.05} w={0.95} h={0.85} fill={GLASS} />)}
        <FaceL x={x + 0.35} y={y + d} z={0.5} w={0.95} h={0.85} fill={GLASS} />
        <FaceL x={x + 2.95} y={y + d} z={0.5} w={0.95} h={0.85} fill={GLASS} />
        <FaceL x={x + 1.62} y={y + d} z={0} w={0.95} h={1.45} fill="#3E7CA6" />
        <FaceL x={x + 2.08} y={y + d} z={0} w={0.04} h={1.45} fill="#2C5F82" />
        <FaceL x={x} y={y + d} z={1.75} w={w} h={0.08} fill="rgba(0,0,0,0.06)" />
        {/* right face (x + w) */}
        {[0, 1].map((j) => [0.5, 2.05].map((z) => <FaceR key={j + '-' + z} x={x + w} y={y + 0.4 + j * 1.45} z={z} d={0.95} h={0.85} fill={GLASS_D} />))}
        {/* roof parapet */}
        <Box x={x} y={y} z={h} w={w} d={0.18} h={0.22} c="#E6E1D5" />
        <Box x={x} y={y} z={h} w={0.18} d={d} h={0.22} c="#E6E1D5" />
        {sign && <g>
          <Box x={x + 1.4} y={y + d - 0.3} z={h} w={1.4} d={0.24} h={1.1} c={accent} left={accent} right={shade('#18A34A', -0.25)} top={shade('#18A34A', 0.2)} />
          <FaceL x={x + 1.98} y={y + d - 0.06} z={h + 0.2} w={0.24} h={0.7} fill="#fff" />
          <FaceL x={x + 1.75} y={y + d - 0.06} z={h + 0.43} w={0.7} h={0.24} fill="#fff" />
        </g>}
      </g>}
    </g>
  );
};

// generic plain building (other clinics in the city), colour + floors
export const Bldg = ({x, y, w = 2.6, d = 2.6, h = 3, c = '#D9D4C8', win = '#B8C7D4'}) => (
  <g>
    <Shadow x={x} y={y} w={w} d={d} off={h * 0.3} />
    <Box x={x} y={y} w={w} d={d} h={h} c={c} />
    {Array.from({length: Math.floor(h / 0.9)}, (_, r) => [0, 1].map((i) => <FaceL key={r + '-' + i} x={x + 0.3 + i * (w / 2)} y={y + d} z={0.35 + r * 0.9} w={w / 2 - 0.6} h={0.5} fill={win} />))}
  </g>
);

// browser window standing upright on the left face plane (y = const): width w along x, height h along z
export const Browser = ({x, y, z = 0, w = 5, h = 3.6, children}) => (
  <g>
    <Box x={x} y={y - 0.18} z={z} w={w} d={0.18} h={h} c="#FFFFFF" left="#FFFFFF" right="#CFCAC0" top="#F2EEE6" />
    <FaceL x={x} y={y + 0.001} z={z + h - 0.5} w={w} h={0.5} fill="#EDEAE3" />
    {[0, 1, 2].map((i) => {
      const [cx, cy] = P(x + 0.3 + i * 0.3, y, z + h - 0.25);
      return <circle key={i} cx={cx} cy={cy} r="0.08" fill={['#FF6159', '#FFBD2E', '#28C941'][i]} />;
    })}
    {children}
  </g>
);

// pages lying flat on the ground, stacked (top plane)
export const Sheet = ({x, y, z = 0, w = 2.2, d = 2.8, c = '#FFFFFF'}) => (
  <g><Box x={x} y={y} z={z} w={w} d={d} h={0.08} c={c} top={c} /></g>
);
