# Stickman Explainer Pipeline (stills → narrated slideshow)

Code-driven stickman explainer videos — **no generative image/video AI**. Each
narration beat is a single hand-drawn **still image** (SVG, rendered via
Remotion). The stills are held to their voiceover durations and assembled into a
narrated slideshow with ffmpeg. No character motion, no lip-sync — just clean
composed frames, like the reference explainer style (marker titles, expressive
faces, hand-drawn props).

```
script.json ─▶ 1-tts ─▶ timing.json ─▶ 2-render ─▶ stills/*.png ─▶ 3-assemble ─▶ final.mp4
 (narration)  (ElevenLabs) (durations)   (Remotion still            (ffmpeg slideshow
                                          — one PNG per scene)        + VO + music)
```

Because every frame is derived from numbers (joint angles, prop coords), the
same character and props render identically every time — the consistency that
generative video can't give you.

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
npm run render     # one still per scene -> out/stills/*.png  (Remotion + Chromium)
npm run assemble   # hold each still to its VO + mux -> out/final.mp4  (ffmpeg)
npm run studio     # live preview / scrub a scene in the browser
```

## Voiceover (ElevenLabs)
Set a key and a voice id, then re-run `npm run tts`:

```bash
export ELEVENLABS_API_KEY=sk_...
# put your cloned voice id in script.json -> voice.voiceId
```

Without a key the pipeline still runs end-to-end: it estimates each scene's
length from word count and writes silent placeholders, so you can iterate on the
frames before committing to narration. `timing.json.real` tells you which mode
produced the current timings.

## The character rig — `src/StickFigure.jsx`
A pose is ~20 numbers: joint angles (`lShoulder`, `rHip`, …), a root position, a
`face` block, and optional `acc` (accessories). Angle convention: **0° = straight
down, + = screen-right**.

Face controls (`pose.face`):
- `gazeX`, `gazeY` — pupil direction (−1..1)
- `brow` — −1 furrowed (angry) … 0 neutral … 1 raised (surprised)
- `mouth` — `neutral | smile | frown | open`
- `blink` — 0 open … 1 closed

Accessories (`figure.acc`): `hat: "pith"`, `tie: true`, `holdRight`/`holdLeft:
"magnifier"`. Add more in `src/props.jsx` and wire them in `StickFigure`.

Global look knobs: `src/config.js` (`FIGURE_SCALE`) and `RIG` at the top of
`StickFigure.jsx` (segment lengths, stroke width, ink color, head size).

## Poses — `src/animations.js`
Since frames are static, each scene picks a **static pose** by name: `stand`,
`stride` (mid-walk freeze), `reachDown` (press a button), `carry` (hold a bag),
plus the expressive verbs (`point`, `wave`, `jump`, `shrug`) sampled at a fixed
instant. **Add new poses here** and every scene can use them.

## Props — `src/props.jsx`
Hand-drawn (wobbly) SVG objects: `Hut`, `Tree`, `Bill`, `MoneyPrinter`,
`LineChart`, `GroceryBag`, plus character accessories `PithHelmet`, `Tie`,
`MagnifyingGlass`. Add a new prop here and a `case` in `PropDispatch` (Scene.jsx).

## Titles & labels
Big marker titles use the bundled **Permanent Marker** font; small hand-print
labels use **Patrick Hand** (both in `public/fonts`, loaded offline). Set
`scene.title` for the top banner and `scene.labels[]` for free-floating text.

## Authoring a video — `script.json`
One entry per scene:

```json
{
  "id": "s3-printer",
  "narration": "If you need more money, you simply print it.",
  "bg": "#ffffff", "floor": "#8f8f8f", "floorAt": 0.78,
  "figures": [
    { "verb": "reachDown", "x": 620, "acc": { "tie": true },
      "face": { "gazeX": 0.4, "mouth": "neutral" } }
  ],
  "props": [
    { "type": "printer", "x": 1000, "y": 828, "w": 440 },
    { "type": "bill", "x": 1200, "y": 720, "rot": -15 }
  ]
}
```

Scene fields: `title`, `titleColor`, `bg`, `floor`, `floorAt` (0..1), `figures`,
`props`, `labels`. Figure fields: `verb`, `x`/`y`, `color`, `scale`, `seed`
(hand-drawn variation), `faceLeft` (mirror), `face`, `acc`. Prop fields vary by
`type`; set `front: true` on a prop to draw it **over** the figure (e.g. a bag
held in front). Labels: `{ text, x, y, size, marker (true = title font), anchor }`.

## This environment
- Render uses the pre-installed Chromium **headless_shell** (auto-detected in
  `pipeline/env.mjs`; override with `REMOTION_BROWSER_EXECUTABLE`).
- Audio/mux uses the `ffmpeg-static` / `ffprobe-static` npm binaries (the
  container's bundled Playwright ffmpeg is codec-stripped and can't encode
  mp3/aac). On a normal machine, system `ffmpeg` on PATH works too.

## Extending
- **New poses** → add a static pose to `animations.js`.
- **New props / accessories** → add a component to `src/props.jsx` and a `case`
  to `PropDispatch` in `src/Scene.jsx` (accessories: wire into `StickFigure`).
- **Multiple characters** → add more entries to a scene's `figures` array (each
  with its own `color`/`seed`/`x`), e.g. the 1971-vs-today comparison.
- **Background music** → drop `assets/music.mp3`; `3-assemble.mjs` ducks it under
  the voice automatically.
