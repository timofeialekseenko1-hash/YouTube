# Stickman Explainer Pipeline

Code-driven stickman explainer videos — **no generative image/video AI**. The
character is a parametric rig drawn as SVG, so it looks *exactly* the same in
every frame of every video. Voiceover length drives scene length automatically.

```
script.json ──▶ 1-tts ──▶ timing.json ──▶ 2-render ──▶ silent.mp4 ──▶ 3-assemble ──▶ final.mp4
 (narration)   (ElevenLabs)  (durations)    (Remotion)                    (ffmpeg + VO + music)
```

## Why code instead of AI video
- **Perfect consistency** — same character, colors, and motion every time.
- **Zero per-second render cost** — no API credits per clip.
- **Full control** — timing, physics, gestures, expressions are all just numbers.
- **Reusable** — build the rig + verb library once; every later video is cheap.

## Quick start

```bash
npm install
npm run build      # tts -> render -> assemble  (writes out/final.mp4)
```

Or step by step:

```bash
npm run tts        # script.json -> out/audio/*.mp3 + timing.json
npm run render     # animation -> out/silent.mp4   (Remotion + Chromium)
npm run assemble   # + voiceover (+ music) -> out/final.mp4  (ffmpeg)
npm run studio     # live preview / scrub in the browser
```

## Voiceover (ElevenLabs)
Set a key and a voice id, then re-run `npm run tts`:

```bash
export ELEVENLABS_API_KEY=sk_...
# put your cloned voice id in script.json -> voice.voiceId
```

Without a key the pipeline still runs end-to-end: it estimates each scene's
length from word count and writes silent placeholders, so you can iterate on the
animation before committing to narration. `timing.json.real` tells you which
mode produced the current timings.

## The character rig — `src/StickFigure.jsx`
A pose is ~20 numbers: joint angles (`lShoulder`, `rHip`, …), a root position,
and a `face` block. Angle convention: **0° = straight down, + = screen-right**.

Face controls (`pose.face`):
- `gazeX`, `gazeY` — pupil direction (−1..1)
- `brow` — −1 furrowed (angry) … 0 neutral … 1 raised (surprised)
- `mouth` — `neutral | smile | frown | open`
- `mouthOpen` — 0..1 (auto-driven for lip-sync when a scene sets `talk: true`)
- `blink` — 0 open … 1 closed

Global look knobs live in `src/config.js` (`FIGURE_SCALE`) and `RIG` at the top
of `StickFigure.jsx` (segment lengths, stroke width, ink color, head size).

## The motion library — `src/animations.js`
Reusable verbs, each a function of normalized time `t` (0..1): `idle`, `walk`,
`point`, `wave`, `jump`, `shrug`, plus `blend()`. **Add new verbs here** (sit,
run, carry, throw, facepalm…) and every scene can use them immediately. This is
where the per-video cost goes down over time.

## Authoring a video — `script.json`
One entry per scene:

```json
{
  "id": "s3-growth",
  "narration": "For a while, the chart only goes up.",
  "bg": "#dfe6d8", "floor": "#b3b3b3",
  "figures": [
    { "verb": "point", "x": 620, "talk": true,
      "face": { "gazeX": 0.6, "brow": 0.8, "mouth": "smile" } }
  ],
  "prop": { "type": "chart", "x": 1080, "y": 886 }
}
```

Figure fields: `verb`, `x`/`y` or `from`+`to` (travel), `color`, `scale`,
`seed` (hand-drawn variation), `faceLeft` (mirror), `talk`, `face`, `cycles`
(walk step count). Props: `chart`, `frame` (wall picture), `box`.

Captions are **off** by default; set `showCaption: true` on a scene to burn one in.

## This environment
- Render uses the pre-installed Chromium **headless_shell** (auto-detected in
  `pipeline/env.mjs`; override with `REMOTION_BROWSER_EXECUTABLE`).
- Audio/mux uses the `ffmpeg-static` / `ffprobe-static` npm binaries (the
  container's bundled Playwright ffmpeg is codec-stripped and can't encode
  mp3/aac). On a normal machine, system `ffmpeg` on PATH works too.

## Extending
- **New gestures** → add a verb to `animations.js`.
- **New props** → add a branch to `Prop` in `src/Scene.jsx`.
- **Multiple characters** → add more entries to a scene's `figures` array (each
  with its own `color`/`seed`/`x`), e.g. a two-person conversation.
- **Background music** → drop `assets/music.mp3`; `3-assemble.mjs` ducks it under
  the voice automatically.
