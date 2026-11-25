// Isometric props for the crusher-dispatch reel (iso units, see shared/iso.jsx).
// Bright industrial palette: safety orange machines, yellow cabs, grey stone, sand-coloured quarry ground.
import React from 'react';
import {P, pts, shade, Box, FaceL, FaceR, FaceT, Shadow, useHt, INK} from '../../shared/iso.jsx';

export const OR = '#FF6B1A', OR2 = '#FF9A1F', YEL = '#FFC52E', STEEL = '#5B6470', STEEL_L = '#9AA4AF', TEAL = '#14B8A6';
export const GLASS = '#9FD3F0', NIGHT = '#27304B';
export const STONE10 = '#A7ADB3', STONE20 = '#7D858E', SANDC = '#E4B46F';

const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const poly = (a) => a.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(' ');

// circle in the plane y = const (truck wheels seen from the left side)
export const WheelL = ({x, y, z, r = 0.46, tire = '#22252B', hub = '#C9CED4'}) => {
  const ring = (rr, yy) => poly(Array.from({length: 20}, (_, i) => { const a = (i / 20) * Math.PI * 2; return P(x + rr * Math.cos(a), yy, z + rr * Math.sin(a)); }));
  return (
    <g>
      <polygon points={ring(r, y - 0.28)} fill="#111317" />
      <polygon points={ring(r, y)} fill={tire} />
      <polygon points={ring(r * 0.5, y + 0.001)} fill={hub} />
      <polygon points={ring(r * 0.18, y + 0.002)} fill="#6B7380" />
    </g>
  );
};
// circle in the plane x = const
export const WheelR = ({x, y, z, r = 0.46, fill = '#22252B', inner}) => {
  const ring = (rr, xx) => poly(Array.from({length: 20}, (_, i) => { const a = (i / 20) * Math.PI * 2; return P(xx, y + rr * Math.cos(a), z + rr * Math.sin(a)); }));
  return <g><polygon points={ring(r, x)} fill={fill} />{inner && <polygon points={ring(r * 0.55, x + 0.001)} fill={inner} />}</g>;
};

// quarry ground slab
export const Ground = ({x = -6, y = -6, w = 12, d = 12, h = 0.6, top = '#EAD9B4', night}) => (
  <Box x={x} y={y} z={-h} w={w} d={d} h={h} c={night ? NIGHT : '#B08A57'} top={night ? '#323C5E' : top} left={night ? '#232B44' : '#C79D62'} right={night ? '#1A2036' : '#9C7646'} />
);
export const Road = ({x, y, w, d, z = 0.002, dash = true, alongX = true}) => (
  <g>
    <FaceT x={x} y={y} z={z} w={w} d={d} fill="#4A4F57" />
    {dash && (alongX
      ? <FaceT x={x} y={y + d / 2 - 0.04} z={z + 0.001} w={w} d={0.08} fill="none" stroke="rgba(255,255,255,0.85)" dash="10 12" />
      : <FaceT x={x + w / 2 - 0.04} y={y} z={z + 0.001} w={0.08} d={d} fill="none" stroke="rgba(255,255,255,0.85)" dash="10 12" />)}
  </g>
);

// stone pile (cone) with a lit left half, shaded right half and a speckle of stones
export const Pile = ({x, y, r = 1.6, h = 2, c = STONE10, seed = 1, grow = 1, spk = true}) => {
  if (grow <= 0) return null;
  const R = r * (0.35 + 0.65 * grow), Hh = h * grow;
  const [cx, cy] = P(x, y, 0), rx = 1.2247 * R, ry = 0.7071 * R, ax = cx, ay = cy - Hh;
  const sp = useHt(true);
  const dots = spk ? Array.from({length: Math.round(26 * R)}, (_, i) => {
    const u = rnd(seed * 31 + i), v = rnd(seed * 17 + i * 3);
    const yy = ay + (cy + ry * 0.7 - ay) * Math.sqrt(v), half = (yy - ay) / (cy - ay) * rx * 0.85;
    return [cx + (u * 2 - 1) * half, yy, 0.05 + rnd(i + seed) * 0.07];
  }) : [];
  return (
    <g>
      <ellipse cx={cx + R * 0.7} cy={cy + 0.05} rx={rx * 1.05} ry={ry * 1.05} fill={sp} />
      <path d={`M${ax} ${ay} L${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx} ${cy + ry} Z`} fill={shade(c, 0.12)} />
      <path d={`M${ax} ${ay} L${cx} ${cy + ry} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} Z`} fill={shade(c, -0.18)} />
      {dots.map(([dx, dy, dr], i) => <circle key={i} cx={dx} cy={dy} r={dr} fill={shade(c, i % 2 ? -0.35 : 0.3)} />)}
    </g>
  );
};

// dumper truck facing +x (moves to the bottom-right). load: 0 empty .. 1 heaped. tip: bed tilt 0..1
export const Dumper = ({x = 0, y = 0, z = 0, body = OR, cab = YEL, load = 1, lights = false, op = 1, ghost = false, tip = 0, stone = STONE10}) => {
  const L = 4.2, W = 1.7;
  const b = ghost ? '#C9C4BA' : body, cb = ghost ? '#D8D3C9' : cab;
  const bedH = 1.15, bz = z + 0.78;
  return (
    <g opacity={op}>
      <Shadow x={x + 0.2} y={y} w={L} d={W} off={0.9} />
      {/* chassis */}
      <Box x={x + 0.2} y={y + 0.25} z={z + 0.45} w={L - 0.3} d={W - 0.5} h={0.33} c="#3A3F47" />
      {/* rear wheels (far side hidden, near side drawn after the body) */}
      {/* dump bed */}
      <g transform={tip ? `rotate(${-tip * 28} ${P(x, y + W, bz)[0]} ${P(x, y + W, bz)[1]})` : undefined}>
        <Box x={x} y={y} z={bz} w={2.85} d={W} h={bedH} c={b} />
        {!ghost && [0.55, 1.25, 1.95].map((rx) => <FaceL key={rx} x={x + rx} y={y + W + 0.001} z={bz + 0.12} w={0.16} h={bedH - 0.24} fill={shade(b, -0.2)} />)}
        <FaceL x={x} y={y + W + 0.002} z={bz + bedH - 0.14} w={2.85} h={0.14} fill={shade(b, -0.25)} />
        {/* inside + load */}
        <FaceT x={x + 0.12} y={y + 0.12} z={bz + bedH - 0.001} w={2.61} d={W - 0.24} fill={shade(b, -0.42)} />
        {load > 0 && !ghost && <Heap x={x + 0.12} y={y + 0.12} z={bz + bedH - 0.3 + 0.3 * load} w={2.61} d={W - 0.24} hh={0.55 * load} c={stone} />}
        {/* canopy over the cab */}
        <Box x={x + 2.85} y={y} z={bz + bedH - 0.1} w={0.55} d={W} h={0.1} c={b} />
      </g>
      {/* cab */}
      <Box x={x + 3.0} y={y + 0.05} z={bz} w={1.2} d={W - 0.1} h={1.0} c={cb} />
      <FaceR x={x + 4.2 + 0.001} y={y + 0.2} z={bz + 0.48} d={W - 0.4} h={0.42} fill={ghost ? '#E6E2DA' : GLASS} />
      <FaceL x={x + 3.15} y={y + W - 0.05 + 0.001} z={bz + 0.48} w={0.75} h={0.42} fill={ghost ? '#E6E2DA' : GLASS} />
      {/* bumper + lights */}
      <Box x={x + 4.2} y={y + 0.1} z={z + 0.42} w={0.14} d={W - 0.2} h={0.26} c="#2D3138" />
      {[0.25, W - 0.5].map((yy) => <FaceR key={yy} x={x + 4.341} y={y + yy} z={bz + 0.1} d={0.25} h={0.16} fill={lights ? '#FFF6C9' : '#F4E7B5'} />)}
      {/* near-side wheels */}
      <WheelL x={x + 0.7} y={y + W} z={z + 0.46} />
      <WheelL x={x + 1.75} y={y + W} z={z + 0.46} />
      <WheelL x={x + 3.55} y={y + W} z={z + 0.46} />
    </g>
  );
};
// heaped load on a flat rectangle (mound = top plane + a raised ridge)
export const Heap = ({x, y, z, w, d, hh = 0.5, c = STONE10}) => {
  const ridge = [[x + w * 0.15, y + d * 0.5, z + hh], [x + w * 0.85, y + d * 0.5, z + hh]];
  const A = [x, y, z], B = [x + w, y, z], Cc = [x + w, y + d, z], D = [x, y + d, z];
  return (
    <g>
      <polygon points={pts([A, B, ridge[1], ridge[0]])} fill={shade(c, 0.2)} />
      <polygon points={pts([B, Cc, ridge[1]])} fill={shade(c, -0.2)} />
      <polygon points={pts([D, Cc, ridge[1], ridge[0]])} fill={shade(c, 0.02)} />
      <polygon points={pts([A, D, ridge[0]])} fill={shade(c, 0.1)} />
      {Array.from({length: 14}, (_, i) => { const [px, py] = P(x + w * (0.1 + 0.8 * rnd(i)), y + d * (0.2 + 0.6 * rnd(i + 9)), z + hh * 0.5); return <circle key={i} cx={px} cy={py} r={0.06} fill={shade(c, i % 2 ? -0.35 : 0.35)} />; })}
    </g>
  );
};

// floodlight mast (night): pole + lamp + soft light cone on the ground
export const Flood = ({x, y, h = 5, on = 1}) => {
  const [lx, ly] = P(x, y, h);
  const [gx, gy] = P(x + 1.6, y + 1.6, 0);
  return (
    <g>
      {on > 0 && <path d={`M${lx} ${ly} L${gx - 2.6} ${gy} A2.6 1.3 0 0 0 ${gx + 2.6} ${gy} Z`} fill="#FFE08A" opacity={0.28 * on} />}
      <Box x={x - 0.06} y={y - 0.06} w={0.12} d={0.12} h={h} c="#4A5060" />
      <Box x={x - 0.3} y={y - 0.2} z={h} w={0.6} d={0.4} h={0.28} c="#3A3F4C" />
      <FaceL x={x - 0.3} y={y + 0.201} z={h + 0.04} w={0.6} h={0.2} fill={on ? '#FFF3B0' : '#9AA0AA'} />
    </g>
  );
};

// the crusher plant: feed hopper on legs, jaw crusher with flywheels, inclined conveyor, vibrating screen
export const Plant = ({x = 0, y = 0, run = 0, F = 0, night = false}) => {
  const belt = (x1, z1, x2, z2, yy, wd = 0.7) => {
    const top = pts([[x1, yy, z1], [x2, yy, z2], [x2, yy + wd, z2], [x1, yy + wd, z1]]);
    const side = pts([[x1, yy + wd, z1], [x2, yy + wd, z2], [x2, yy + wd, z2 - 0.22], [x1, yy + wd, z1 - 0.22]]);
    const n = 7, ph = run ? ((F / 18) % 1) : 0;
    return (
      <g>
        <polygon points={side} fill="#3B414B" />
        <polygon points={top} fill="#2B3038" />
        {Array.from({length: n}, (_, i) => { const t = (i + ph) / n; const xx = x1 + (x2 - x1) * t, zz = z1 + (z2 - z1) * t; return <polygon key={i} points={pts([[xx, yy + 0.1, zz + 0.01], [xx + 0.32, yy + 0.1, zz + (z2 - z1) / (x2 - x1) * 0.32 + 0.01], [xx + 0.32, yy + wd - 0.1, zz + (z2 - z1) / (x2 - x1) * 0.32 + 0.01], [xx, yy + wd - 0.1, zz + 0.01]])} fill={STONE10} opacity={run ? 1 : 0.35} />; })}
        {[0.3, 0.65].map((t) => { const xx = x1 + (x2 - x1) * t, zz = z1 + (z2 - z1) * t; return <Box key={t} x={xx} y={yy + wd * 0.4} w={0.12} d={0.12} h={zz - 0.22} c="#4A5060" />; })}
      </g>
    );
  };
  return (
    <g>
      <Shadow x={x - 1.2} y={y - 1.2} w={3.8} d={3.2} off={2.2} />
      {/* hopper legs + bin */}
      {[[-1.2, -1.2], [0.6, -1.2], [-1.2, 0.4], [0.6, 0.4]].map(([a, b]) => <Box key={a + ',' + b} x={x + a} y={y + b} w={0.22} d={0.22} h={2.6} c="#4A5060" />)}
      <polygon points={pts([[x - 1.4, y - 1.4, 2.6], [x + 1.0, y - 1.4, 2.6], [x + 1.4, y - 1.8, 4.2], [x - 1.8, y - 1.8, 4.2]])} fill={shade(OR, -0.05)} />
      <polygon points={pts([[x + 1.0, y - 1.4, 2.6], [x + 1.0, y + 0.8, 2.6], [x + 1.4, y + 1.2, 4.2], [x + 1.4, y - 1.8, 4.2]])} fill={shade(OR, -0.25)} />
      <polygon points={pts([[x - 1.4, y + 0.8, 2.6], [x + 1.0, y + 0.8, 2.6], [x + 1.4, y + 1.2, 4.2], [x - 1.8, y + 1.2, 4.2]])} fill={shade(OR, -0.08)} />
      <polygon points={pts([[x - 1.8, y - 1.8, 4.2], [x + 1.4, y - 1.8, 4.2], [x + 1.4, y + 1.2, 4.2], [x - 1.8, y + 1.2, 4.2]])} fill="#3B3F46" />
      <Heap x={x - 1.6} y={y - 1.6} z={4.1} w={2.8} d={2.6} hh={0.35} c={STONE20} />
      {/* jaw crusher */}
      <Box x={x + 1.7} y={y - 1.0} w={2.0} d={1.9} h={2.0} c={YEL} />
      <Box x={x + 1.9} y={y - 0.8} z={2.0} w={1.6} d={1.5} h={0.35} c="#3B3F46" />
      <WheelL x={x + 2.7} y={y + 1.15} z={1.15} r={0.75} tire={OR} hub="#2F333A" />
      <FaceL x={x + 2.67} y={y + 1.152} z={0.45} w={0.06} h={1.4} fill="#2F333A" />
      {/* conveyor from the crusher to the pile */}
      {belt(x + 3.6, 0.9, x + 8.2, 3.2, y - 0.4)}
      {/* vibrating screen */}
      <Box x={x - 0.4} y={y + 2.4} w={2.6} d={1.6} h={0.4} c="#3B414B" />
      <polygon points={pts([[x - 0.3, y + 2.5, 1.4], [x + 2.1, y + 2.5, 0.9], [x + 2.1, y + 3.9, 0.9], [x - 0.3, y + 3.9, 1.4]])} fill={TEAL} />
      <polygon points={pts([[x - 0.3, y + 3.9, 1.4], [x + 2.1, y + 3.9, 0.9], [x + 2.1, y + 3.9, 0.4], [x - 0.3, y + 3.9, 0.4]])} fill={shade(TEAL, -0.25)} />
      {[0.4, 0.9, 1.4].map((t) => <polygon key={t} points={pts([[x - 0.3 + t, y + 2.6, 1.4 - t * 0.21], [x - 0.3 + t + 0.05, y + 2.6, 1.4 - t * 0.21], [x - 0.3 + t + 0.05, y + 3.8, 1.4 - t * 0.21], [x - 0.3 + t, y + 3.8, 1.4 - t * 0.21]])} fill="rgba(255,255,255,0.6)" />)}
      {night && <FaceL x={x + 1.9} y={y + 0.901} z={1.6} w={0.3} h={0.2} fill="#FFF3B0" />}
    </g>
  );
};

// weighbridge platform (काटा) with hazard edges + operator cabin
export const Weighbridge = ({x, y, w = 5.6, d = 2.4}) => (
  <g>
    <Box x={x} y={y} z={-0.02} w={w} d={d} h={0.22} c="#B9C0C8" top="#D5DAE0" />
    {Array.from({length: Math.round(w / 0.4)}, (_, i) => <FaceL key={i} x={x + i * 0.4} y={y + d + 0.001} z={-0.02} w={0.2} h={0.22} fill={i % 2 ? INK : YEL} />)}
    {[0.25, 0.5, 0.75].map((t) => <FaceT key={t} x={x + w * t} y={y + 0.1} z={0.201} w={0.03} d={d - 0.2} fill="rgba(20,20,20,0.18)" />)}
  </g>
);
export const Cabin = ({x, y, c = '#FFFFFF', w = 1.8, d = 1.6, h = 1.9}) => (
  <g>
    <Shadow x={x} y={y} w={w} d={d} off={0.8} />
    <Box x={x} y={y} w={w} d={d} h={h} c={c} top="#F3F0E8" left="#FFFFFF" right="#D7D2C7" />
    <FaceL x={x + 0.25} y={y + d + 0.001} z={0.9} w={w - 0.5} h={0.65} fill={GLASS} />
    <FaceR x={x + w + 0.001} y={y + 0.3} z={0} d={0.6} h={1.3} fill="#3E7CA6" />
    <Box x={x - 0.15} y={y - 0.15} z={h} w={w + 0.3} d={d + 0.3} h={0.14} c={OR} />
  </g>
);

// gate posts + boom barrier (open 0..1), boom along +y from the post
export const Gate = ({x, y, open = 0, len = 3.6}) => {
  const a = open * Math.PI * 0.42;
  const [p0x, p0y] = P(x + 0.1, y + 0.1, 1.05);
  const [p1x, p1y] = P(x + 0.1, y + 0.1 + len * Math.cos(a), 1.05 + len * Math.sin(a));
  return (
    <g>
      <Box x={x - 0.25} y={y - 0.25} w={0.7} d={0.7} h={1.2} c={YEL} />
      <line x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke="#fff" strokeWidth={0.2} strokeLinecap="round" />
      <line x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke="#E5484D" strokeWidth={0.2} strokeDasharray="0.45 0.45" />
      <Box x={x - 0.05} y={y + len - 0.05} w={0.16} d={0.16} h={0.95} c="#4A5060" op={1} />
    </g>
  );
};

// police barricade: striped board on two legs, along x
export const Barricade = ({x, y, w = 2.6}) => (
  <g>
    {[0.2, w - 0.35].map((dx) => <Box key={dx} x={x + dx} y={y} w={0.15} d={0.15} h={1.1} c="#3A3F47" />)}
    <Box x={x} y={y - 0.05} z={0.7} w={w} d={0.12} h={0.4} c="#FFFFFF" />
    {Array.from({length: Math.round(w / 0.5)}, (_, i) => <polygon key={i} points={pts([[x + i * 0.5, y + 0.071, 0.7], [x + i * 0.5 + 0.25, y + 0.071, 0.7], [x + i * 0.5 + 0.45, y + 0.071, 1.1], [x + i * 0.5 + 0.2, y + 0.071, 1.1]])} fill="#E5484D" />)}
  </g>
);
export const Beacon = ({x, y, h = 1.8, F = 0}) => {
  const [bx, by] = P(x, y, h + 0.25), on = Math.floor(F / 7) % 2;
  return (
    <g>
      <Box x={x - 0.05} y={y - 0.05} w={0.1} d={0.1} h={h} c="#3A3F47" />
      <circle cx={bx} cy={by} r={0.95} fill={on ? '#E5484D' : '#3B82F6'} opacity={0.18} />
      <rect x={bx - 0.34} y={by - 0.2} width={0.34} height={0.36} rx={0.08} fill={on ? '#E5484D' : '#8C2B2E'} />
      <rect x={bx} y={by - 0.2} width={0.34} height={0.36} rx={0.08} fill={on ? '#1E3A8A' : '#3B82F6'} />
    </g>
  );
};

// small site building / plant shed for the "other plants" scene
export const Shed = ({x, y, w = 2.4, d = 2, h = 1.6, c = '#F5F2EA', roof = OR}) => (
  <g>
    <Shadow x={x} y={y} w={w} d={d} off={0.8} />
    <Box x={x} y={y} w={w} d={d} h={h} c={c} top="#FFFFFF" right="#D7D2C7" />
    <polygon points={pts([[x - 0.1, y - 0.1, h], [x + w + 0.1, y - 0.1, h], [x + w + 0.1, y + d / 2, h + 0.7], [x - 0.1, y + d / 2, h + 0.7]])} fill={shade(roof, 0.05)} />
    <polygon points={pts([[x - 0.1, y + d / 2, h + 0.7], [x + w + 0.1, y + d / 2, h + 0.7], [x + w + 0.1, y + d + 0.1, h], [x - 0.1, y + d + 0.1, h]])} fill={shade(roof, -0.1)} />
    <polygon points={pts([[x + w + 0.1, y - 0.1, h], [x + w + 0.1, y + d + 0.1, h], [x + w + 0.1, y + d / 2, h + 0.7]])} fill={shade(c, -0.2)} />
    <FaceL x={x + w * 0.35} y={y + d + 0.001} z={0} w={w * 0.3} h={h * 0.6} fill="#3B414B" />
  </g>
);
