import { Composition } from 'remotion';
import { Video, totalFrames } from './Video.jsx';
import { WIDTH, HEIGHT, FPS } from './config.js';

export function RemotionRoot() {
  return (
    <Composition
      id="Explainer"
      component={Video}
      durationInFrames={Math.max(1, totalFrames())}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
}
