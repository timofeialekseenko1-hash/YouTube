import { Composition } from 'remotion';
import { Scene } from './Scene.jsx';
import { WIDTH, HEIGHT, FPS } from './config.js';
import script from '../script.json';

// Renders ONE scene as a static still. `sceneIndex` comes from --props at
// render time (pipeline/2-render.mjs renders one still per scene).
function StillFrame({ sceneIndex = 0 }) {
  const scene = script.scenes[sceneIndex] ?? script.scenes[0];
  return <Scene scene={scene} fixedT={0.5} />;
}

export function RemotionRoot() {
  return (
    <Composition
      id="Still"
      component={StillFrame}
      durationInFrames={1}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ sceneIndex: 0 }}
    />
  );
}
