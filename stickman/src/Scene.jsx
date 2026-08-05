import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { StickFigure } from './StickFigure.jsx';
import { VERBS } from './animations.js';
import { WIDTH, HEIGHT, FIGURE_SCALE, FOOT_DROP } from './config.js';
import { MARKER, HAND, fontFaceCss } from './fonts.js';
import { Hut, Tree, MoneyPrinter, Bill, LineChart, GroceryBag } from './props.jsx';

/**
 * A single still scene: character(s) + props + hand-drawn title text on a
 * flat two-tone (or plain) background. No motion — a fixed pose is sampled so
 * the same frame renders identically every time. Held for its voiceover
 * duration during assembly.
 */
export function Scene({ scene, fixedT = 0.5 }) {
  const wall = scene.bg ?? '#ffffff';
  const floor = scene.floor ?? null;
  const floorY = HEIGHT * (scene.floorAt ?? 0.82);

  const figures = scene.figures ?? [];
  const allProps = scene.props ?? (scene.prop ? [scene.prop] : []);
  const backProps = allProps.filter((p) => !p.front);
  const frontProps = allProps.filter((p) => p.front); // drawn OVER the figures

  return (
    <div style={{ width: WIDTH, height: HEIGHT, background: wall, position: 'relative' }}>
      <style>{fontFaceCss}</style>
      <svg width={WIDTH} height={HEIGHT}>
        {floor && (
          <>
            <rect x={0} y={floorY} width={WIDTH} height={HEIGHT - floorY} fill={floor} />
            <line x1={0} y1={floorY} x2={WIDTH} y2={floorY} stroke="#00000020" strokeWidth={3} />
          </>
        )}

        {/* background props (behind figures) */}
        {backProps.map((p, i) => <PropDispatch key={`bp${i}`} p={p} floorY={floorY} />)}

        {/* characters */}
        {figures.map((f, i) => {
          const verbFn = VERBS[f.verb] ?? VERBS.stand;
          const pose = verbFn(fixedT);
          const s = f.scale ?? FIGURE_SCALE;
          const x = f.x ?? WIDTH / 2;
          const y = f.y ?? floorY - FOOT_DROP * s;
          const face = { ...(f.face || {}) };
          return (
            <g key={`f${i}`} transform={`translate(${x}, ${y}) scale(${s})`}>
              <StickFigure
                pose={{ ...pose, x: pose.x ?? 0, y: pose.y ?? 0, seed: f.seed ?? 3,
                  scaleX: f.faceLeft ? -1 : 1, face, acc: f.acc }}
                color={f.color ?? '#141414'}
              />
            </g>
          );
        })}

        {/* foreground props (held in front of the figure, e.g. a grocery bag) */}
        {frontProps.map((p, i) => <PropDispatch key={`fp${i}`} p={p} floorY={floorY} />)}

        {/* free-floating hand-drawn labels ($1, 1971, TODAY, ...) */}
        {(scene.labels ?? []).map((l, i) => (
          <text key={`l${i}`} x={l.x} y={l.y}
            fontFamily={l.marker ? MARKER : HAND}
            fontSize={l.size ?? 60}
            fill={l.color ?? '#141414'}
            textAnchor={l.anchor ?? 'start'}>{l.text}</text>
        ))}
      </svg>

      {/* big marker title along the top, like the references */}
      {scene.title && (
        <div style={titleStyle(scene.titleColor)}>{scene.title}</div>
      )}
    </div>
  );
}

function PropDispatch({ p, floorY }) {
  const y = p.y ?? floorY;
  switch (p.type) {
    case 'hut': return <Hut x={p.x} y={y} w={p.w} seed={p.seed} smoke={p.smoke} />;
    case 'tree': return <Tree x={p.x} y={y} h={p.h} seed={p.seed} />;
    case 'printer': return <MoneyPrinter x={p.x} y={y} w={p.w} seed={p.seed} />;
    case 'bill': return <Bill x={p.x} y={p.y} w={p.w} rot={p.rot} seed={p.seed} />;
    case 'chart': return <LineChart x={p.x} y={y} w={p.w} h={p.h} leftLabel={p.left} rightLabel={p.right} font={HAND} />;
    case 'bag': return <GroceryBag x={p.x} y={p.y} w={p.w} full={p.full} seed={p.seed} />;
    default: return null;
  }
}

function titleStyle(color) {
  return {
    position: 'absolute',
    top: 40,
    left: 0,
    width: '100%',
    textAlign: 'center',
    fontFamily: `'${MARKER}', sans-serif`,
    fontSize: 132,
    lineHeight: 1,
    letterSpacing: 2,
    color: color ?? '#141414',
    textTransform: 'uppercase',
    padding: '0 60px',
  };
}
