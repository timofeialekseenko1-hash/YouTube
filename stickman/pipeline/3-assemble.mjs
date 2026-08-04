/**
 * Step 3 — Assemble the final video with ffmpeg.
 *
 *   silent animation  (out/silent.mp4)
 * + per-scene voiceover concatenated in order   (out/audio/*.mp3)
 * + optional background music bed                (assets/music.mp3, ducked)
 * = out/final.mp4
 *
 * Scene audio is concatenated in script order; because each scene's video
 * length was set from its audio length in step 1, the tracks line up exactly.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FFMPEG } from './env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const timing = JSON.parse(readFileSync(path.join(ROOT, 'timing.json'), 'utf8'));

const silent = path.join(OUT, 'silent.mp4');
const finalFile = path.join(OUT, 'final.mp4');
const music = path.join(ROOT, 'assets', 'music.mp3');
const hasMusic = existsSync(music);

// 1. Concat the per-scene voiceover into one continuous track.
const concatList = path.join(OUT, 'audio', 'concat.txt');
writeFileSync(
  concatList,
  timing.audio.map((a) => `file '${path.resolve(ROOT, a)}'`).join('\n'),
);
const voTrack = path.join(OUT, 'audio', 'voiceover.mp3');
execFileSync(FFMPEG, ['-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', '-y', voTrack], { stdio: 'inherit' });

// 2. Mux video + voiceover (+ music bed, ducked under the voice).
const args = ['-i', silent, '-i', voTrack];
if (hasMusic) args.push('-stream_loop', '-1', '-i', music);

if (hasMusic) {
  args.push(
    '-filter_complex',
    // lower music to 18%, mix with full voice, cut music at video end
    '[2:a]volume=0.18[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=2[a]',
    '-map', '0:v', '-map', '[a]',
  );
} else {
  args.push('-map', '0:v', '-map', '1:a');
}

args.push(
  '-c:v', 'copy',
  '-c:a', 'aac', '-b:a', '192k',
  '-shortest', '-movflags', '+faststart',
  '-y', finalFile,
);

console.log(`🔊 Muxing final video${hasMusic ? ' (with music bed)' : ''}...`);
execFileSync(FFMPEG, args, { stdio: 'inherit' });
console.log(`✅ Done -> ${path.relative(ROOT, finalFile)}`);
