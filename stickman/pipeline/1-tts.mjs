/**
 * Step 1 — Script -> voiceover -> per-scene timing.
 *
 * For each scene:
 *   1. Send narration to ElevenLabs -> out/audio/<id>.mp3
 *   2. Measure the real audio duration with ffprobe/ffmpeg
 *   3. Convert to frames and write timing.json
 *
 * This is the "auto-calculate scene length from voiceover duration" step: the
 * animation is sized to the ACTUAL spoken length, so picture and audio never drift.
 *
 * No ELEVENLABS_API_KEY? The script still runs: it estimates each scene's
 * duration from word count (~165 wpm) and writes a SILENT placeholder, so the
 * rest of the pipeline (render + assemble) works end-to-end. Add a key later
 * and re-run to swap in real narration.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FFMPEG, FFPROBE, FPS } from './env.mjs';

const pexec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.join(ROOT, 'out', 'audio');

const WPM = 165;
const API_KEY = process.env.ELEVENLABS_API_KEY;

async function ffprobeDuration(file) {
  // ffprobe ships with ffmpeg; fall back to parsing `ffmpeg -i` if absent.
  try {
    const { stdout } = await pexec(FFPROBE, [
      '-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', file,
    ]);
    return parseFloat(stdout.trim());
  } catch {
    const { stderr } = await pexec(FFMPEG, ['-i', file]).catch((e) => e);
    const m = /Duration:\s*(\d+):(\d+):(\d+\.\d+)/.exec(stderr || '');
    if (!m) return null;
    return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
  }
}

async function elevenLabs(text, voice, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: voice.modelId || 'eleven_multilingual_v2',
      voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.2 },
    }),
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outFile, buf);
}

// Render N seconds of silence so downstream steps have a real file to work with.
async function silence(seconds, outFile) {
  await pexec(FFMPEG, [
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-t', seconds.toFixed(3), '-q:a', '9', '-y', outFile,
  ]);
}

async function main() {
  await mkdir(AUDIO_DIR, { recursive: true });
  const script = JSON.parse(await readFile(path.join(ROOT, 'script.json'), 'utf8'));

  const frames = [];
  const seconds = [];
  const audioFiles = [];
  const usingReal = Boolean(API_KEY) && script.voice?.voiceId && !script.voice.voiceId.startsWith('REPLACE');

  console.log(usingReal
    ? '🎙  ElevenLabs key found — generating real voiceover.'
    : '🔇 No usable ElevenLabs key — estimating durations + writing silent placeholders.');

  for (const scene of script.scenes) {
    const out = path.join(AUDIO_DIR, `${scene.id}.mp3`);
    let dur;
    if (usingReal) {
      await elevenLabs(scene.narration, script.voice, out);
      dur = await ffprobeDuration(out);
    } else {
      const words = scene.narration.trim().split(/\s+/).length;
      dur = Math.max(2.2, (words / WPM) * 60 + 0.6); // +0.6s breathing room
      await silence(dur, out);
    }
    const f = Math.round(dur * FPS);
    frames.push(f);
    seconds.push(+dur.toFixed(3));
    audioFiles.push(path.relative(ROOT, out));
    console.log(`  ${scene.id}: ${dur.toFixed(2)}s -> ${f} frames`);
  }

  await writeFile(
    path.join(ROOT, 'timing.json'),
    JSON.stringify({ fps: FPS, real: usingReal, frames, seconds, audio: audioFiles }, null, 2),
  );
  console.log(`✅ timing.json written — total ${(seconds.reduce((a, b) => a + b, 0)).toFixed(1)}s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
