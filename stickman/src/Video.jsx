import { Series } from 'remotion';
import { Scene } from './Scene.jsx';
import script from '../script.json';
import timing from '../timing.json';

/**
 * Top-level video: one Series.Sequence per scene, each sized to the measured
 * voiceover duration from timing.json. Rendered SILENT here; the voiceover +
 * music are muxed on in pipeline/3-assemble.mjs so the ElevenLabs audio stays
 * in the ffmpeg step (as in the pipeline spec).
 */
export function Video() {
  return (
    <Series>
      {script.scenes.map((scene, i) => (
        <Series.Sequence
          key={i}
          durationInFrames={timing.frames[i] ?? 90}
        >
          <Scene scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  );
}

export const totalFrames = () =>
  script.scenes.reduce((sum, _s, i) => sum + (timing.frames[i] ?? 90), 0);
