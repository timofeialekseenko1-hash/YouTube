/**
 * Parametric stick figure rig — expressive "xkcd / Wait-But-Why" style.
 *
 * A pose is a plain object of joint angles (degrees) + a root position + a
 * `face` block (gaze, eyebrows, mouth). Because the whole character — body AND
 * expression — is derived from ~20 numbers, the SAME character is reproduced
 * exactly in every frame of every video. That consistency is the whole point
 * of code animation vs. generative video.
 *
 * Angle convention: 0deg = limb points straight DOWN, positive = swings toward
 * +x (screen right).
 */

import { PithHelmet, Tie, MagnifyingGlass } from './props.jsx';

const DEG = Math.PI / 180;

// Segment lengths (px). Big head + long legs = the reference silhouette.
export const RIG = {
  headR: 46,        // head radius (big + expressive)
  headSquash: 1.06, // >1 = slightly taller than wide (gives a chin-y oval)
  neck: 10,
  torso: 96,
  upperArm: 56,
  foreArm: 52,
  upperLeg: 82,
  lowerLeg: 78,
  stroke: 7,        // limbs are thin relative to the head
  color: '#141414',
};

// endpoint of a limb starting at (x,y), given angle (deg) and length.
function tip(x, y, angleDeg, len) {
  const a = angleDeg * DEG;
  return [x + Math.sin(a) * len, y + Math.cos(a) * len];
}

// Deterministic tiny "hand-drawn" offset from a seed — same every render.
function jitter(seed) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s) - 0.5; // -0.5..0.5
}

// A limb as a gently wavy hand-drawn stroke (quadratic bezier with an offset
// midpoint) instead of a ruler-straight line.
function wobblePath(a, b, seed) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const amp = Math.min(len * 0.05, 5.5);
  // perpendicular unit vector
  const px = -dy / len;
  const py = dx / len;
  const off = jitter(seed) * amp * 2;
  const mx = (a[0] + b[0]) / 2 + px * off;
  const my = (a[1] + b[1]) / 2 + py * off;
  return `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

export const NEUTRAL = {
  x: 0,
  y: 0,        // pelvis position (Scene translates it)
  lean: 0,     // torso tilt (0 = straight up)
  // arms hang down and slightly out
  lShoulder: -16, lElbow: -6,
  rShoulder: 16, rElbow: 6,
  // legs stand slightly apart with a soft knee bend
  lHip: -15, lKnee: -6,
  rHip: 15, rKnee: 6,
  headTilt: 0,
  scaleX: 1,   // flip horizontally with -1 to face the other way
  seed: 3,     // per-figure hand-drawn seed
};

// Face defaults: neutral, gazing slightly toward where the action is (right).
export const NEUTRAL_FACE = {
  gazeX: 0.25, gazeY: -0.1, // pupil offset, -1..1
  brow: 0,                  // -1 furrowed .. 0 neutral .. 1 raised/surprised
  mouth: 'neutral',         // neutral | smile | frown | open | flat
  mouthOpen: 0,             // 0..1 talking amount
  blink: 0,                 // 0 open .. 1 closed
};

export function StickFigure({ pose, color }) {
  const p = { ...NEUTRAL, ...pose };
  const face = { ...NEUTRAL_FACE, ...(pose.face || {}) };
  const c = color || RIG.color;
  const { headR, headSquash, neck, torso, upperArm, foreArm, upperLeg, lowerLeg, stroke } = RIG;

  const pelvis = [p.x, p.y];
  const shoulder = tip(pelvis[0], pelvis[1], 180 + p.lean, torso);
  const neckTop = tip(shoulder[0], shoulder[1], 180 + p.lean, neck);
  const headC = tip(neckTop[0], neckTop[1], 180 + p.lean + p.headTilt, headR * headSquash);

  const lElbow = tip(shoulder[0], shoulder[1], p.lShoulder, upperArm);
  const lHand = tip(lElbow[0], lElbow[1], p.lShoulder + p.lElbow, foreArm);
  const rElbow = tip(shoulder[0], shoulder[1], p.rShoulder, upperArm);
  const rHand = tip(rElbow[0], rElbow[1], p.rShoulder + p.rElbow, foreArm);

  const lKnee = tip(pelvis[0], pelvis[1], p.lHip, upperLeg);
  const lFoot = tip(lKnee[0], lKnee[1], p.lHip + p.lKnee, lowerLeg);
  const rKnee = tip(pelvis[0], pelvis[1], p.rHip, upperLeg);
  const rFoot = tip(rKnee[0], rKnee[1], p.rHip + p.rKnee, lowerLeg);

  const limb = (a, b, key, seed) => (
    <path
      key={key}
      d={wobblePath(a, b, p.seed * 10 + seed)}
      fill="none"
      stroke={c}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  );

  return (
    <g transform={`scale(${p.scaleX},1)`}>
      {/* legs */}
      {limb(pelvis, lKnee, 'lu', 1)}
      {limb(lKnee, lFoot, 'll', 2)}
      {limb(pelvis, rKnee, 'ru', 3)}
      {limb(rKnee, rFoot, 'rl', 4)}
      {/* torso + neck */}
      {limb(pelvis, shoulder, 't', 5)}
      {limb(shoulder, neckTop, 'n', 6)}
      {/* arms */}
      {limb(shoulder, lElbow, 'lua', 7)}
      {limb(lElbow, lHand, 'lfa', 8)}
      {limb(shoulder, rElbow, 'rua', 9)}
      {limb(rElbow, rHand, 'rfa', 10)}
      {/* tie (under the head, over the torso) */}
      {p.acc?.tie && <Tie x={shoulder[0]} y={shoulder[1] + 4} len={torso * 0.5} color={p.acc.tieColor || '#1c1c1c'} />}
      {/* head + face */}
      <Head cx={headC[0]} cy={headC[1]} r={headR} squash={headSquash} color={c} seed={p.seed} face={face} />
      {/* hat sits on the head */}
      {p.acc?.hat === 'pith' && <PithHelmet cx={headC[0]} cy={headC[1] - headR * 0.32} r={headR * 0.98} />}
      {/* held prop in a hand */}
      {p.acc?.holdRight === 'magnifier' && <MagnifyingGlass x={rHand[0] + 6} y={rHand[1]} r={headR * 0.62} angle={-24} />}
      {p.acc?.holdLeft === 'magnifier' && <MagnifyingGlass x={lHand[0] - 6} y={lHand[1]} r={headR * 0.62} angle={24} />}
    </g>
  );
}

function Head({ cx, cy, r, squash, color, seed, face }) {
  const rx = r;
  const ry = r * squash;
  const stroke = RIG.stroke;

  // eye geometry
  const eyeDX = r * 0.42;      // spacing from center
  const eyeY = cy - r * 0.12;  // vertical position
  const eyeRx = r * 0.19;
  const eyeRy = r * 0.26;      // tall ovals like the reference
  const pupilR = r * 0.1;
  const gx = face.gazeX * eyeRx * 0.7;
  const gy = face.gazeY * eyeRy * 0.7;
  const blink = Math.max(0, Math.min(1, face.blink));

  const eye = (side) => {
    const ex = cx + side * eyeDX;
    if (blink > 0.85) {
      return (
        <line
          key={`eye${side}`}
          x1={ex - eyeRx} y1={eyeY} x2={ex + eyeRx} y2={eyeY}
          stroke={color} strokeWidth={stroke * 0.7} strokeLinecap="round"
        />
      );
    }
    return (
      <g key={`eye${side}`}>
        <ellipse cx={ex} cy={eyeY} rx={eyeRx} ry={eyeRy * (1 - blink)} fill="#fff" stroke={color} strokeWidth={stroke * 0.7} />
        <circle cx={ex + gx} cy={eyeY + gy} r={pupilR} fill={color} />
      </g>
    );
  };

  // eyebrows: inner ends move with `brow`. + = raised (surprise), - = furrow.
  const browY = eyeY - eyeRy - r * 0.14;
  const browLen = eyeRx * 1.5;
  const browTilt = face.brow * r * 0.16; // inner-end vertical shift
  const brow = (side) => {
    const ex = cx + side * eyeDX;
    const inner = [ex - side * browLen * 0.5, browY + (side > 0 ? -browTilt : -browTilt)];
    const outer = [ex + side * browLen * 0.5, browY + (side > 0 ? browTilt : browTilt)];
    // For furrow (brow<0) inner ends dip down toward nose; raise lifts them.
    inner[1] = browY - browTilt;
    outer[1] = browY + browTilt * 0.4;
    return (
      <path
        key={`brow${side}`}
        d={wobblePathStatic(inner, outer, seed + side)}
        fill="none" stroke={color} strokeWidth={stroke * 0.8} strokeLinecap="round"
      />
    );
  };

  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={color} strokeWidth={stroke} />
      {brow(-1)}
      {brow(1)}
      {eye(-1)}
      {eye(1)}
      <Mouth cx={cx} cy={cy + r * 0.42} r={r} color={color} face={face} />
    </g>
  );
}

function Mouth({ cx, cy, r, color, face }) {
  const w = r * 0.42;
  const sw = RIG.stroke * 0.8;
  const open = Math.max(0, Math.min(1, face.mouthOpen));
  if (face.mouth === 'open' || open > 0.05) {
    const h = r * 0.14 + open * r * 0.28;
    return <ellipse cx={cx} cy={cy} rx={w * 0.7} ry={h} fill={color} />;
  }
  let d;
  if (face.mouth === 'smile') {
    d = `M ${cx - w} ${cy} Q ${cx} ${cy + r * 0.3} ${cx + w} ${cy}`;
  } else if (face.mouth === 'frown') {
    d = `M ${cx - w} ${cy + r * 0.12} Q ${cx} ${cy - r * 0.18} ${cx + w} ${cy + r * 0.12}`;
  } else {
    // neutral: slight downward-relaxed line
    d = `M ${cx - w * 0.8} ${cy} Q ${cx} ${cy + r * 0.06} ${cx + w * 0.8} ${cy}`;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
}

// straight-ish wobble for tiny features (no length-based amp blowups)
function wobblePathStatic(a, b, seed) {
  const mx = (a[0] + b[0]) / 2 + jitter(seed) * 1.5;
  const my = (a[1] + b[1]) / 2 + jitter(seed + 9) * 1.5;
  return `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

// Expose computed hand position so props can be "held".
export function handPositions(pose) {
  const p = { ...NEUTRAL, ...pose };
  const { torso, upperArm, foreArm } = RIG;
  const shoulder = tip(p.x, p.y, 180 + p.lean, torso);
  const rElbow = tip(shoulder[0], shoulder[1], p.rShoulder, upperArm);
  const rHand = tip(rElbow[0], rElbow[1], p.rShoulder + p.rElbow, foreArm);
  const lElbow = tip(shoulder[0], shoulder[1], p.lShoulder, upperArm);
  const lHand = tip(lElbow[0], lElbow[1], p.lShoulder + p.lElbow, foreArm);
  return { left: lHand, right: rHand };
}
