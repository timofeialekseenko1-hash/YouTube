/**
 * Reusable motion library.
 *
 * Each function takes a normalized time t (0..1 across the move) and returns a
 * pose delta to merge over NEUTRAL. Build the library once; every future video
 * is assembled from these verbs. THIS is what makes video #2..#50 cheap.
 *
 * Add new verbs here (sit, run, shrug, facepalm, carry, throw) and they are
 * instantly available to every scene.
 */

const TAU = Math.PI * 2;
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t))); // easeInOut

// Idle breathing/sway — never let a character be perfectly static.
export function idle(t) {
  const s = Math.sin(t * TAU);
  return {
    lean: s * 1.5,
    headTilt: Math.sin(t * TAU * 0.5) * 2,
    lShoulder: -20 + s * 3,
    rShoulder: 20 - s * 3,
  };
}

// Walk cycle in place — Scene supplies horizontal translation.
// Legs swing fore/aft around vertical (0deg); arms counter-swing.
export function walk(t) {
  const ph = t * TAU;
  const swing = Math.sin(ph) * 24;      // hip fore/aft
  const armSwing = Math.sin(ph) * 20;   // arms opposite legs
  return {
    lHip: swing,
    rHip: -swing,
    lKnee: Math.max(0, -Math.sin(ph) * 22),  // trailing leg bends
    rKnee: Math.max(0, Math.sin(ph) * 22),
    lShoulder: -20 - armSwing,
    rShoulder: 20 + armSwing,
    lean: 5 + Math.sin(ph * 2) * 1.5,
    y: -Math.abs(Math.sin(ph)) * 5,       // slight bob
  };
}

// Raise the right arm to near-horizontal and point (e.g. at a chart/prop).
export function point(t) {
  const e = ease(t);
  return {
    rShoulder: lerp(20, 80, e),   // 80deg ~ arm out to the right
    rElbow: lerp(8, -2, e),       // straighten forearm
    headTilt: lerp(0, 8, e),      // glance toward the prop
    lean: lerp(0, 4, e),
  };
}

// Friendly wave (intro/outro): right arm up high, hand flaps.
export function wave(t) {
  const up = ease(Math.min(1, t * 2));
  const flap = Math.sin(t * TAU * 3) * 16;
  return {
    rShoulder: lerp(20, 150, up),   // arm raised up-and-out
    rElbow: lerp(8, 18 + flap, up), // forearm waves
    headTilt: 5,
  };
}

// Jump — crouch, launch, land. y negative = up the screen.
export function jump(t) {
  const arc = Math.sin(Math.PI * t); // 0..1..0
  const crouch = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 0;
  return {
    y: -arc * 130,
    lHip: -13 - arc * 6,
    rHip: 13 + arc * 6,
    lKnee: -4 - crouch * 34,   // tuck on crouch/land
    rKnee: 4 + crouch * 34,
    lShoulder: lerp(-20, -130, arc), // arms fly up
    rShoulder: lerp(20, 130, arc),
  };
}

// Shrug — arms out to the sides, forearms up ("nobody needed it").
export function shrug(t) {
  const e = ease(t);
  return {
    lShoulder: lerp(-20, -58, e),
    rShoulder: lerp(20, 58, e),
    lElbow: lerp(-8, -78, e),   // forearm swings up/out (palms-up feel)
    rElbow: lerp(8, 78, e),
    headTilt: Math.sin(t * TAU) * 3,
  };
}

/**
 * Blend two verbs (e.g. walk + wave) with a mix ratio.
 */
export function blend(a, b, mix = 0.5) {
  const out = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    out[k] = lerp(av, bv, mix);
  }
  return out;
}

// ---- Static poses (for still frames — no time dependence) ------------------

// Plain standing.
export function stand() { return {}; }

// Mid-stride walking freeze (like the reference walkers).
export function stride() {
  return {
    lHip: -26, lKnee: -2,
    rHip: 24, rKnee: 26,
    lShoulder: -30, lElbow: -4,
    rShoulder: 22, rElbow: 10,
    lean: 5,
  };
}

// Right arm reaching down-forward (e.g. pressing a button).
export function reachDown() {
  return {
    rShoulder: 60, rElbow: 18,
    lShoulder: -18,
    lHip: -22, rHip: 20, rKnee: 20,
    lean: 6,
  };
}

// Carrying something in front with both arms (grocery bag).
export function carry() {
  return {
    lShoulder: 34, lElbow: 60,
    rShoulder: -34, rElbow: -60,
    lHip: -24, rHip: 22, rKnee: 22,
    lean: 4,
  };
}

// Registry so scenes can reference a verb by name from script.json.
export const VERBS = { idle, walk, point, wave, jump, shrug, stand, stride, reachDown, carry };
