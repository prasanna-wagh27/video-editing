// Isometric props for the business-process-audit reel (iso units, see shared/iso.jsx).
// Bright office palette: orange, teal, sunny yellow on warm paper; ink-free fills like the ISO references.
import React from 'react';
import {P, pts, shade, Box, FaceL, FaceR, FaceT, Shadow, useHt, INK} from '../../shared/iso.jsx';

export const OR = '#FF6B1A', OR2 = '#FF9A1F', YEL = '#FFC52E', TEAL = '#14B8A6', TEAL_D = '#0F766E', PINK = '#FF5C8A', VIO = '#7C5CFF';
export const WOOD = '#D59A5E', GLASS = '#9FD3F0', GOLD = '#F5B700', WA = '#25D366', WA_D = '#008069', XL = '#1D6F42';

// office / plaza floor slab with faint tile seams
export const Floor = ({x = -6, y = -6, w = 12, d = 12, h = 0.5, top = '#F4EEE2', seams = 2}) => (
  <g>
    <Box x={x} y={y} z={-h} w={w} d={d} h={h} c="#C9B48E" top={top} left="#E0CDA8" right="#BBA47C" />
    {seams > 0 && Array.from({length: Math.floor(w / seams) - 1}, (_, i) => <FaceT key={'a' + i} x={x + (i + 1) * seams} y={y} z={0.001} w={0.025} d={d} fill="rgba(120,90,50,0.16)" />)}
    {seams > 0 && Array.from({length: Math.floor(d / seams) - 1}, (_, i) => <FaceT key={'b' + i} x={x} y={y + (i + 1) * seams} z={0.001} w={w} d={0.025} fill="rgba(120,90,50,0.16)" />)}
  </g>
);

// work desk (front = +y face) with optional laptop facing the viewer's left
export const Desk = ({x, y, w = 2, d = 1.1, laptop = true, screen = '#3B82F6', paper = 0}) => (
  <g>
    <Shadow x={x} y={y} w={w} d={d} off={0.5} />
    {[[0.08, 0.08], [w - 0.2, 0.08], [0.08, d - 0.2], [w - 0.2, d - 0.2]].map(([a, b], i) => <Box key={i} x={x + a} y={y + b} w={0.12} d={0.12} h={0.72} c="#6B5440" />)}
    <Box x={x} y={y} z={0.72} w={w} d={d} h={0.1} c={WOOD} />
    {laptop && <g>
      <Box x={x + w * 0.3} y={y + d * 0.35} z={0.82} w={0.8} d={0.5} h={0.03} c="#C9CED4" />
      <Box x={x + w * 0.3} y={y + d * 0.3} z={0.82} w={0.8} d={0.05} h={0.52} c="#2A2F38" />
      <FaceL x={x + w * 0.3 + 0.05} y={y + d * 0.3 + 0.051} z={0.86} w={0.7} h={0.44} fill={screen} />
    </g>}
    {Array.from({length: paper}, (_, i) => <Box key={i} x={x + 0.18 + i * 0.05} y={y + 0.22 - i * 0.03} z={0.82 + i * 0.02} w={0.5} d={0.68} h={0.02} c="#FFFFFF" top={i % 2 ? '#FFFFFF' : '#F6F3EC'} />)}
  </g>
);

// shop / office front: walls, striped awning on the +y face, shutter, sign board
export const Shop = ({x, y, w = 4.4, d = 3.4, h = 3, wall = '#FFFFFF', awn = OR}) => {
  const n = 8, sw = w / n;
  return (
    <g>
      <Shadow x={x} y={y} w={w} d={d} off={1.1} />
      <Box x={x} y={y} w={w} d={d} h={h} c={wall} top="#F3EFE6" left="#FFFFFF" right="#DCD6CA" />
      <Box x={x - 0.1} y={y - 0.1} z={h} w={w + 0.2} d={d + 0.2} h={0.18} c={TEAL} />
      {/* glass front + door */}
      <FaceL x={x + 0.35} y={y + d + 0.001} z={0.05} w={w * 0.55} h={1.6} fill={GLASS} />
      <FaceL x={x + 0.35 + w * 0.12} y={y + d + 0.002} z={0.05} w={0.04} h={1.6} fill="#FFFFFF" />
      <FaceL x={x + 0.35 + w * 0.32} y={y + d + 0.002} z={0.05} w={0.04} h={1.6} fill="#FFFFFF" />
      <FaceL x={x + w * 0.68} y={y + d + 0.001} z={0} w={w * 0.24} h={1.75} fill="#3B414B" />
      <FaceL x={x + w * 0.68 + 0.06} y={y + d + 0.002} z={0.85} w={0.05} h={0.2} fill={YEL} />
      {/* awning: tilted strip along x, sticking out in +y */}
      {Array.from({length: n}, (_, i) => <polygon key={i} points={pts([[x + i * sw, y + d, 2.25], [x + (i + 1) * sw, y + d, 2.25], [x + (i + 1) * sw, y + d + 0.75, 1.9], [x + i * sw, y + d + 0.75, 1.9]])} fill={i % 2 ? '#FFFFFF' : awn} />)}
      {Array.from({length: n}, (_, i) => <FaceL key={'v' + i} x={x + i * sw} y={y + d + 0.75} z={1.72} w={sw} h={0.18} fill={i % 2 ? shade('#FFFFFF', -0.08) : shade(awn, -0.12)} />)}
      {/* sign board above the awning */}
      <FaceL x={x + 0.3} y={y + d + 0.001} z={2.35} w={w - 0.6} h={0.5} fill={INK} />
      {/* side window */}
      <FaceR x={x + w + 0.001} y={y + 0.5} z={1.0} d={d * 0.5} h={0.9} fill="#7FB8D9" />
    </g>
  );
};

// गल्ला / cash box with an open drawer of coins on the +y side
export const CashBox = ({x, y, w = 3, d = 2.2, h = 1.6, c = TEAL_D, open = 1}) => {
  const dd = 0.9 * open;
  return (
    <g>
      <Shadow x={x} y={y} w={w} d={d + dd} off={0.6} />
      <Box x={x} y={y} w={w} d={d} h={h} c={c} top={shade(c, 0.25)} left={shade(c, 0.05)} right={shade(c, -0.25)} />
      <FaceL x={x + w * 0.38} y={y + d + 0.002} z={h * 0.62} w={w * 0.24} h={0.16} fill={YEL} />
      {/* drawer */}
      <Box x={x + 0.2} y={y + d - 0.1} z={0.12} w={w - 0.4} d={dd + 0.1} h={0.55} c="#E7E2D8" top="#F7F4EE" />
      <FaceT x={x + 0.32} y={y + d} z={0.671} w={w - 0.64} d={dd - 0.12} fill="#BDB4A3" />
      {open > 0.5 && [0.5, 1.1, 1.7, 2.2].map((cx, i) => <Coin key={i} x={x + cx * (w / 3)} y={y + d + dd * 0.45} z={0.68} r={0.2} />)}
      <FaceL x={x + w * 0.42} y={y + d + dd + 0.001} z={0.35} w={w * 0.16} h={0.1} fill="#6B7380" />
    </g>
  );
};

// one flat coin lying in the plane z = const
export const Coin = ({x, y, z = 0, r = 0.3, c = GOLD, th = 0.08}) => {
  const [cx, cy] = P(x, y, z), rx = 1.2247 * r, ry = 0.7071 * r;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={shade(c, -0.3)} />
      <rect x={cx - rx} y={cy - th} width={rx * 2} height={th} fill={shade(c, -0.3)} />
      <ellipse cx={cx} cy={cy - th} rx={rx} ry={ry} fill={c} />
      <ellipse cx={cx} cy={cy - th} rx={rx * 0.68} ry={ry * 0.68} fill="none" stroke={shade(c, 0.35)} strokeWidth={0.04} />
    </g>
  );
};
export const CoinStack = ({x, y, n = 6, r = 0.42, grow = 1}) => {
  const k = Math.round(n * Math.max(0, Math.min(1, grow)));
  return <g>{Array.from({length: k}, (_, i) => <Coin key={i} x={x} y={y} z={i * 0.13} r={r} th={0.13} />)}</g>;
};

// register / ledger book lying flat (spine on the +y side)
export const Book = ({x, y, z = 0, w = 1.4, d = 1, h = 0.22, c = '#C2410C'}) => (
  <g>
    <Box x={x} y={y} z={z} w={w} d={d} h={h} c={c} />
    <FaceR x={x + w + 0.002} y={y + 0.06} z={z + 0.04} d={d - 0.12} h={h - 0.08} fill="#FBF7EE" />
    <FaceL x={x} y={y + d + 0.002} z={z} w={w} h={h} fill={shade(c, -0.18)} />
    <FaceT x={x + 0.2} y={y + 0.25} z={z + h + 0.001} w={w * 0.55} d={0.18} fill="rgba(255,255,255,0.85)" />
  </g>
);

// cardboard parcel (order)
export const Parcel = ({x, y, z = 0, s: sz = 0.9, c = '#D9A066', op = 1}) => (
  <g opacity={op}>
    <Box x={x} y={y} z={z} w={sz} d={sz} h={sz * 0.8} c={c} />
    <FaceT x={x + sz * 0.42} y={y} z={z + sz * 0.8 + 0.001} w={sz * 0.16} d={sz} fill="#F1D9A8" />
    <FaceL x={x + sz * 0.42} y={y + sz + 0.001} z={z + sz * 0.5} w={sz * 0.16} h={sz * 0.3} fill="#F1D9A8" />
  </g>
);

// thin vertical post (cage bars)
export const Post = ({x, y, z = 0, h = 2, c = '#4A5060'}) => <Box x={x - 0.04} y={y - 0.04} z={z} w={0.08} d={0.08} h={h} c={c} />;

// small square platform tile used as a node in flow diagrams
export const Pad = ({x, y, s: sz = 2.2, h = 0.35, c = '#FFFFFF', lift = 0}) => (
  <g>
    <Shadow x={x} y={y} w={sz} d={sz} off={0.4 + lift * 0.5} />
    <Box x={x} y={y} z={lift} w={sz} d={sz} h={h} c={c} top={c === '#FFFFFF' ? '#FFFFFF' : shade(c, 0.12)} left={c === '#FFFFFF' ? '#EDE8DD' : undefined} right={c === '#FFFFFF' ? '#D3CCBE' : undefined} />
  </g>
);

// iso keycap with a letter printed on its top face
const C30 = Math.cos(Math.PI / 6);
export const Key = ({x, y, sz = 1.5, press = 0, c = '#FFFFFF', label, lc = INK, hot}) => {
  const h = 0.55 - 0.3 * press;
  const [tx, ty] = P(x + sz / 2, y + sz / 2, h);
  return (
    <g>
      <Shadow x={x} y={y} w={sz} d={sz} off={0.35} />
      <Box x={x} y={y} w={sz} d={sz} h={h} c={hot ? OR : c} top={hot ? shade(OR, 0.12) : '#FFFFFF'} left={hot ? shade(OR, -0.05) : '#EEEAE1'} right={hot ? shade(OR, -0.25) : '#CFC8BA'} />
      <g transform={`translate(${tx} ${ty}) matrix(${C30} 0.5 ${-C30} 0.5 0 0)`}>
        <text x={0} y={0.33} textAnchor="middle" fontSize={0.95} fontWeight={800} fill={hot ? '#fff' : lc} fontFamily="Anek, sans-serif">{label}</text>
      </g>
    </g>
  );
};
