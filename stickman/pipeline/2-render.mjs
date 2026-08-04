/**
 * Step 2 — Render the animation to a SILENT video via Remotion + Chromium.
 *
 * Uses the Chromium already installed in this environment (no download). The
 * voiceover is intentionally NOT baked in here; step 3 muxes it with ffmpeg so
 * the ElevenLabs audio lives in the assembly stage (per the pipeline spec).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHROMIUM } from './env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
mkdirSync(OUT, { recursive: true });

const outFile = path.join(OUT, 'silent.mp4');

const env = { ...process.env };
if (CHROMIUM) env.REMOTION_BROWSER_EXECUTABLE = CHROMIUM;

console.log(`🎬 Rendering with Chromium: ${CHROMIUM || '(auto)'} `);

execFileSync(
  'npx',
  [
    'remotion', 'render', 'src/index.js', 'Explainer', outFile,
    '--codec', 'h264',
    // headless chrome in a container needs these:
    '--chromium-disable-web-security',
    '--gl', 'angle',
  ],
  { cwd: ROOT, stdio: 'inherit', env },
);

console.log(`✅ Silent animation rendered -> ${path.relative(ROOT, outFile)}`);
