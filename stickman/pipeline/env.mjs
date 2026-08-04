/**
 * Shared environment paths. Points the pipeline at the ffmpeg + chromium that
 * already exist in this container, with sensible fallbacks for a local machine.
 */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
function tryResolve(fn) {
  try { return fn(); } catch { return null; }
}

function firstExisting(paths, fallback) {
  return paths.find((p) => p && existsSync(p)) || fallback;
}

export const FPS = 30;

// Prefer the full static ffmpeg/ffprobe from npm (the container's bundled
// Playwright ffmpeg is codec-stripped). Fall back to PATH.
const staticFfmpeg = tryResolve(() => require('ffmpeg-static'));
const staticFfprobe = tryResolve(() => require('ffprobe-static').path);

export const FFMPEG = firstExisting(
  [process.env.FFMPEG_PATH, staticFfmpeg],
  'ffmpeg',
);
export const FFPROBE = firstExisting(
  [process.env.FFPROBE_PATH, staticFfprobe],
  'ffprobe',
);

// Pre-installed Chromium; Remotion uses this instead of downloading one.
// Remotion needs an OLD-headless-mode binary: chrome-headless-shell fits;
// the full `chrome` binary rejects the legacy --headless flag.
export const CHROMIUM = firstExisting(
  [
    process.env.REMOTION_BROWSER_EXECUTABLE,
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  ],
  '',
);
