/**
 * Step 3 — Assemble the still images into a narrated slideshow with ffmpeg.
 *
 * Each still is held for its scene's voiceover duration (from timing.json),
 * concatenated in order, then the continuous voiceover (+ optional ducked
 * music) is muxed on. A short crossfade-free cut between stills keeps it
 * simple and clean, like the reference videos.
 *
 *   stills/*.png (held to VO length)  +  voiceover  (+ music)  =  out/final.mp4
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FFMPEG, FPS } from './env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const STILLS = path.join(OUT, 'stills');
const CLIPS = path.join(OUT, 'clips');
mkdirSync(CLIPS, { recursive: true });

const script = JSON.parse(readFileSync(path.join(ROOT, 'script.json'), 'utf8'));
const timing = JSON.parse(readFileSync(path.join(ROOT, 'timing.json'), 'utf8'));

const finalFile = path.join(OUT, 'final.mp4');
const music = path.join(ROOT, 'assets', 'music.mp3');
const hasMusic = existsSync(music);

// 1. Turn each still into a video clip held for its scene duration.
const clipList = path.join(CLIPS, 'concat.txt');
const clipLines = [];
script.scenes.forEach((scene, i) => {
  const id = String(i).padStart(2, '0');
  const still = path.join(STILLS, `${id}-${scene.id}.png`);
  const dur = timing.seconds[i] ?? 4;
  const clip = path.join(CLIPS, `${id}.mp4`);
  execFileSync(FFMPEG, [
    '-loop', '1', '-i', still,
    '-t', dur.toFixed(3),
    '-r', String(FPS),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
    '-y', clip,
  ], { stdio: 'ignore' });
  clipLines.push(`file '${clip}'`);
  console.log(`  clip ${id}: ${dur.toFixed(2)}s`);
});
writeFileSync(clipList, clipLines.join('\n'));

// 2. Concat clips into the silent slideshow.
const slideshow = path.join(OUT, 'slideshow.mp4');
execFileSync(FFMPEG, ['-f', 'concat', '-safe', '0', '-i', clipList, '-c', 'copy', '-y', slideshow], { stdio: 'inherit' });

// 3. Concat the per-scene voiceover into one track.
const voList = path.join(OUT, 'audio', 'concat.txt');
writeFileSync(voList, timing.audio.map((a) => `file '${path.resolve(ROOT, a)}'`).join('\n'));
const voTrack = path.join(OUT, 'audio', 'voiceover.mp3');
execFileSync(FFMPEG, ['-f', 'concat', '-safe', '0', '-i', voList, '-c', 'copy', '-y', voTrack], { stdio: 'ignore' });

// 4. Mux slideshow + voiceover (+ ducked music).
const args = ['-i', slideshow, '-i', voTrack];
if (hasMusic) args.push('-stream_loop', '-1', '-i', music);
if (hasMusic) {
  args.push('-filter_complex',
    '[2:a]volume=0.16[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=2[a]',
    '-map', '0:v', '-map', '[a]');
} else {
  args.push('-map', '0:v', '-map', '1:a');
}
args.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', '-y', finalFile);

console.log(`🔊 Muxing narrated slideshow${hasMusic ? ' (with music)' : ''}...`);
execFileSync(FFMPEG, args, { stdio: 'inherit' });
console.log(`✅ Done -> ${path.relative(ROOT, finalFile)}`);
