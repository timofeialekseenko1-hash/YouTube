/**
 * Hand-drawn prop & accessory library (still-frame style).
 * Every object is plain SVG with a slight organic wobble so it reads as
 * hand-drawn, matching the reference frames. Reuse and extend freely.
 */

const INK = '#141414';

function j(seed) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s) - 0.5;
}
// wavy line between two points
function wl(a, b, seed, amp = 3) {
  const mx = (a[0] + b[0]) / 2 + j(seed) * amp * 2;
  const my = (a[1] + b[1]) / 2 + j(seed + 5) * amp * 2;
  return `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
}
// wavy closed rectangle path
function wrect(x, y, w, h, seed, amp = 2.5) {
  const p = (px, py, s) => [px + j(s) * amp, py + j(s + 1) * amp];
  const a = p(x, y, seed), b = p(x + w, y, seed + 2), c = p(x + w, y + h, seed + 4), d = p(x, y + h, seed + 6);
  return `M${a}L${b}L${c}L${d}Z`;
}

// ---- Scenery ---------------------------------------------------------------

export function Hut({ x, y, w = 260, seed = 1, smoke = false }) {
  const bodyH = w * 0.42;
  const roofH = w * 0.4;
  const cx = x + w / 2;
  return (
    <g>
      {/* body */}
      <path d={`M${x},${y} L${x},${y - bodyH} L${x + w},${y - bodyH} L${x + w},${y} Z`}
        fill="#b98b5e" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* doorway */}
      <rect x={cx - w * 0.09} y={y - bodyH * 0.62} width={w * 0.18} height={bodyH * 0.62}
        fill="#2c211a" stroke={INK} strokeWidth={4} />
      {/* thatched roof dome */}
      <path d={`M${x - w * 0.06},${y - bodyH}
                Q${cx},${y - bodyH - roofH} ${x + w * 1.06},${y - bodyH} Z`}
        fill="#e9d27e" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* thatch lines */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((o, i) => (
        <path key={i} d={`M${cx + o * w},${y - bodyH - roofH * 0.5} L${cx + o * w * 1.15},${y - bodyH}`}
          stroke="#b89a4a" strokeWidth={2} fill="none" />
      ))}
      {/* fringe */}
      <path d={`M${x - w * 0.06},${y - bodyH} l10,10 l14,-8 l14,10 l14,-8 l14,10 l14,-8 l14,10 l14,-8 l14,10 l14,-8 l14,10 l14,-8 l14,10 l14,-8 l14,10`}
        stroke={INK} strokeWidth={4} fill="none" strokeLinejoin="round" />
      {smoke && <Smoke x={cx} y={y - bodyH - roofH * 0.55} />}
    </g>
  );
}

function Smoke({ x, y }) {
  return (
    <path
      d={`M${x},${y} C${x - 26},${y - 40} ${x + 26},${y - 70} ${x - 6},${y - 110}
          C${x - 30},${y - 140} ${x + 20},${y - 170} ${x},${y - 205}`}
      fill="none" stroke="#b9bcc0" strokeWidth={14} strokeLinecap="round" opacity={0.8} />
  );
}

export function Tree({ x, y, h = 300, seed = 2 }) {
  const trunkW = h * 0.12;
  const canopyR = h * 0.34;
  const cx = x;
  const topY = y - h;
  return (
    <g>
      <path d={`M${cx - trunkW / 2},${y} L${cx - trunkW * 0.35},${topY + canopyR}
                L${cx + trunkW * 0.35},${topY + canopyR} L${cx + trunkW / 2},${y} Z`}
        fill="#a9784a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${cx},${topY - canopyR}
        C${cx + canopyR * 1.4},${topY - canopyR} ${cx + canopyR * 1.5},${topY + canopyR * 0.9} ${cx + canopyR * 0.6},${topY + canopyR}
        C${cx + canopyR * 0.9},${topY + canopyR * 1.3} ${cx - canopyR * 0.9},${topY + canopyR * 1.3} ${cx - canopyR * 0.6},${topY + canopyR}
        C${cx - canopyR * 1.5},${topY + canopyR * 0.9} ${cx - canopyR * 1.4},${topY - canopyR} ${cx},${topY - canopyR} Z`}
        fill="#8fae86" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
}

// ---- Money -----------------------------------------------------------------

export function Bill({ x, y, w = 120, rot = 0, seed = 3 }) {
  const h = w * 0.5;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <path d={`M${-w / 2},${-h / 2} Q0,${-h / 2 - 8} ${w / 2},${-h / 2}
                L${w / 2},${h / 2} Q0,${h / 2 + 8} ${-w / 2},${h / 2} Z`}
        fill="#5bb85b" stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={0} r={h * 0.28} fill="none" stroke={INK} strokeWidth={3} />
      <text x={0} y={h * 0.12} textAnchor="middle" fontSize={h * 0.42} fontWeight="bold" fill={INK}>$</text>
    </g>
  );
}

export function MoneyPrinter({ x, y, w = 380, seed = 4 }) {
  const h = w * 0.36;
  const depth = w * 0.18;
  return (
    <g>
      {/* top face */}
      <path d={`M${x},${y} l${w},0 l${-depth},${-depth} l${-w},0 Z`} fill="#c97b3f" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* front face */}
      <path d={wrect(x, y, w, h, seed)} fill="#b96a34" stroke={INK} strokeWidth={5} />
      {/* buttons on top */}
      {[0.16, 0.3, 0.44, 0.58].map((o, i) => (
        <rect key={i} x={x + w * o} y={y - depth * 0.6} width={w * 0.07} height={depth * 0.4} fill="#8a4f27" stroke={INK} strokeWidth={2} transform={`skewX(-38)`} />
      ))}
      {/* big red-ish button */}
      <rect x={x + w * 0.66} y={y - depth * 1.15} width={w * 0.16} height={depth * 0.8} rx={4} fill="#7a7a7a" stroke={INK} strokeWidth={4} />
    </g>
  );
}

// ---- Chart -----------------------------------------------------------------

export function LineChart({ x, y, w = 1200, h = 620, leftLabel = '1971', rightLabel = '2008', font = 'Patrick Hand' }) {
  // flat green line with slight wiggle, then a cliff drop at the end.
  const baseY = y - h * 0.55;
  const pts = [];
  const N = 40;
  const dropStart = 0.9;
  for (let i = 0; i <= N; i++) {
    const tt = i / N;
    const px = x + tt * w;
    let py = baseY + Math.sin(tt * 22) * 6;
    if (tt > dropStart) py = baseY + ((tt - dropStart) / (1 - dropStart)) * (h * 0.5);
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return (
    <g>
      {/* axes */}
      <path d={wl([x, y - h], [x, y], 10, 4)} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={wl([x, y], [x + w + 40, y], 11, 4)} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* ticks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={x + (i + 1) * (w / 9)} y1={y} x2={x + (i + 1) * (w / 9)} y2={y + 16} stroke={INK} strokeWidth={4} />
      ))}
      {/* the line */}
      <polyline points={pts.join(' ')} fill="none" stroke="#2e9e3f" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
      <text x={x} y={y + 70} fontFamily={font} fontSize={64} fill={INK}>{leftLabel}</text>
      <text x={x + w - 60} y={y + 70} fontFamily={font} fontSize={64} fill={INK} textAnchor="end">{rightLabel}</text>
    </g>
  );
}

// ---- Grocery bag -----------------------------------------------------------

export function GroceryBag({ x, y, w = 220, full = true, seed = 6 }) {
  const h = w * 1.0;
  return (
    <g>
      <path d={wrect(x, y, w, h, seed)} fill="#c79a63" stroke={INK} strokeWidth={5} />
      {/* fold line */}
      <path d={wl([x, y + h * 0.28], [x + w, y + h * 0.28], seed + 3, 3)} stroke={INK} strokeWidth={3} fill="none" />
      {full ? (
        <g>
          {/* baguette */}
          <path d={`M${x + w * 0.1},${y} l${w * 0.12},${-h * 0.42}`} stroke="#c98b3f" strokeWidth={16} strokeLinecap="round" />
          {/* milk carton */}
          <path d={`M${x + w * 0.6},${y - h * 0.02} l0,${-h * 0.34} l${w * 0.05},${-h * 0.08} l${w * 0.13},0 l${w * 0.05},${h * 0.08} l0,${h * 0.34} Z`}
            fill="#f2f2f2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {/* banana */}
          <path d={`M${x + w * 0.42},${y - h * 0.05} q${w * 0.2},${-h * 0.1} ${w * 0.3},${h * 0.06}`} stroke="#e8c33d" strokeWidth={14} fill="none" strokeLinecap="round" />
          {/* apple */}
          <circle cx={x + w * 0.3} cy={y - h * 0.06} r={w * 0.13} fill="#cf3b32" stroke={INK} strokeWidth={4} />
        </g>
      ) : (
        <circle cx={x + w * 0.5} cy={y - h * 0.02} r={w * 0.16} fill="#cf3b32" stroke={INK} strokeWidth={4} />
      )}
    </g>
  );
}

// ---- Character accessories (drawn by StickFigure at computed anchors) -------

export function PithHelmet({ cx, cy, r, color = '#e6d79a' }) {
  return (
    <g>
      <path d={`M${cx - r * 1.15},${cy} Q${cx},${cy + r * 0.35} ${cx + r * 1.15},${cy}`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${cx - r * 0.85},${cy} Q${cx},${cy - r * 1.15} ${cx + r * 0.85},${cy} Z`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={cx} cy={cy - r * 1.05} r={5} fill={color} stroke={INK} strokeWidth={4} />
    </g>
  );
}

export function Tie({ x, y, len = 120, color = '#1c1c1c' }) {
  // x,y at the neck/collar point
  return (
    <g>
      <path d={`M${x - 14},${y} L${x + 14},${y} L${x + 8},${y + 22} L${x - 8},${y + 22} Z`} fill={color} stroke={INK} strokeWidth={3} />
      <path d={`M${x - 8},${y + 22} L${x + 8},${y + 22} L${x + 16},${y + len} L${x},${y + len + 18} L${x - 16},${y + len} Z`} fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}

export function MagnifyingGlass({ x, y, r = 46, angle = -30 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <circle cx={0} cy={0} r={r} fill="#dff0f5" opacity={0.5} stroke={INK} strokeWidth={7} />
      <rect x={-9} y={r * 0.7} width={18} height={r * 1.1} rx={7} fill="#8a8a8a" stroke={INK} strokeWidth={5} />
    </g>
  );
}
