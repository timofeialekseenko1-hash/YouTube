import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { StickFigure } from './StickFigure.jsx';
import { VERBS, ease } from './animations.js';
import { WIDTH, HEIGHT, FIGURE_SCALE, FOOT_DROP } from './config.js';

/**
 * A single scene. Reads its config (verb, motion path, face, prop, caption) and
 * drives the rig from the current frame. Duration is set by the parent from
 * timing.json (measured VO length), so animation always matches the voiceover.
 */
export function Scene({ scene }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;

  const wall = scene.bg ?? '#f2e2a8';       // warm wall
  const floor = scene.floor ?? '#b9b9b9';   // gray floor
  const floorY = HEIGHT * 0.82;

  const figures = scene.figures ?? [{ verb: 'idle', x: WIDTH / 2 }];

  const capOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ width: WIDTH, height: HEIGHT, background: wall, position: 'relative' }}>
      <svg width={WIDTH} height={HEIGHT}>
        {/* floor */}
        <rect x={0} y={floorY} width={WIDTH} height={HEIGHT - floorY} fill={floor} />
        <line x1={0} y1={floorY} x2={WIDTH} y2={floorY} stroke="#00000018" strokeWidth={3} />

        {scene.prop && <Prop prop={scene.prop} t={t} />}

        {figures.map((f, i) => {
          const verbFn = VERBS[f.verb] ?? VERBS.idle;
          const cycles = f.cycles ?? 1;
          const localT = f.verb === 'walk' ? (t * cycles) % 1 : t;
          const pose = verbFn(localT);

          const s = f.scale ?? FIGURE_SCALE;
          const x = f.from != null && f.to != null
            ? interpolate(ease(t), [0, 1], [f.from, f.to])
            : (f.x ?? WIDTH / 2);
          const y = f.y ?? floorY - FOOT_DROP * s; // feet land on the floor

          // Face: static expression from config + optional talking mouth-sync.
          const talking = f.talk
            ? 0.5 + 0.5 * Math.sin(frame * 0.9) // lip flap
            : 0;
          const face = {
            ...(f.face || {}),
            mouthOpen: Math.max(f.face?.mouthOpen ?? 0, talking > 0.15 ? talking : 0),
          };

          return (
            <g key={i} transform={`translate(${x}, ${y}) scale(${s})`}>
              <StickFigure
                pose={{ ...pose, x: pose.x ?? 0, y: pose.y ?? 0, seed: f.seed ?? 3, scaleX: f.faceLeft ? -1 : 1, face }}
                color={f.color ?? '#141414'}
              />
            </g>
          );
        })}
      </svg>

      {scene.caption && scene.showCaption && (
        <div style={captionStyle(capOpacity)}>{scene.caption}</div>
      )}
    </div>
  );
}

function Prop({ prop, t }) {
  if (prop.type === 'chart') {
    const grow = ease(t);
    const bars = [0.4, 0.7, 1.0];
    const bx = prop.x ?? WIDTH * 0.66;
    const by = prop.y ?? HEIGHT * 0.82;
    return (
      <g>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={bx + i * 64}
            y={by - h * 240 * grow}
            width={46}
            height={h * 240 * grow}
            fill={prop.color ?? '#e0533d'}
            stroke="#141414" strokeWidth={4}
            rx={3}
          />
        ))}
      </g>
    );
  }
  if (prop.type === 'frame') {
    // hand-drawn wall picture frame, like the reference.
    const x = prop.x ?? WIDTH * 0.62;
    const y = prop.y ?? HEIGHT * 0.14;
    const w = prop.w ?? 300;
    const h = prop.h ?? 380;
    const t2 = 26; // frame thickness
    return (
      <g>
        <line x1={x + w / 2} y1={y - 34} x2={x + w / 2} y2={y} stroke="#141414" strokeWidth={4} />
        <circle cx={x + w / 2} cy={y - 36} r={5} fill="#141414" />
        <rect x={x} y={y} width={w} height={h} fill="#d79a3a" stroke="#141414" strokeWidth={5} rx={3} />
        <rect x={x + t2} y={y + t2} width={w - t2 * 2} height={h - t2 * 2} fill="#fff" stroke="#141414" strokeWidth={4} />
      </g>
    );
  }
  if (prop.type === 'box') {
    const bx = prop.x ?? WIDTH * 0.7;
    const by = prop.y ?? HEIGHT * 0.7;
    return <rect x={bx} y={by} width={78} height={64} fill="#c9a06a" stroke="#141414" strokeWidth={5} rx={4} />;
  }
  return null;
}

function captionStyle(opacity) {
  return {
    position: 'absolute',
    bottom: 70,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: WIDTH * 0.8,
    textAlign: 'center',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 46,
    lineHeight: 1.2,
    color: '#fff',
    background: 'rgba(20,20,20,0.82)',
    padding: '14px 28px',
    borderRadius: 14,
    opacity,
  };
}
