/**
 * Step 2 — Render ONE still image per scene via Remotion + Chromium.
 *
 * No motion: each scene is a single composed frame. Uses the Chromium already
 * present in this environment (no download).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHROMIUM } from './env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STILLS = path.join(ROOT, 'out', 'stills');
mkdirSync(STILLS, { recursive: true });

const script = JSON.parse(readFileSync(path.join(ROOT, 'script.json'), 'utf8'));
const env = { ...process.env };
if (CHROMIUM) env.REMOTION_BROWSER_EXECUTABLE = CHROMIUM;

console.log(`🖼  Rendering ${script.scenes.length} stills with Chromium: ${CHROMIUM || '(auto)'}`);

script.scenes.forEach((scene, i) => {
  const out = path.join(STILLS, `${String(i).padStart(2, '0')}-${scene.id}.png`);
  execFileSync(
    'npx',
    [
      'remotion', 'still', 'src/index.js', 'Still', out,
      '--image-format', 'png',
      '--props', JSON.stringify({ sceneIndex: i }),
      '--gl', 'angle',
    ],
    { cwd: ROOT, stdio: 'inherit', env },
  );
  console.log(`  ✓ ${path.relative(ROOT, out)}`);
});

console.log('✅ Stills rendered -> out/stills/');
