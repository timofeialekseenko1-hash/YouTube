# Side Hustle — Remotion edit

A dynamic, fast-paced Remotion edit of the two talking-head clips
(`gru11` + `gru21`, ~45s combined, 1080×1920 @ 30fps). Motion graphics
follow the "Liquid Glass" style: dark radial-glow backgrounds, translucent
cards with a specular highlight sweep, one accent color per card
(white/blue/red/gold/green), bold sans typography (Anton + Inter), and
spring-based easing on everything.

## Structure

- `src/Main.tsx` — assembles base footage (part1 then part2, carrying the
  VO audio) + vignette + GFX scenes + kinetic captions on the concatenated
  timeline.
- `src/components/GfxScenes.tsx` — the ten motion-graphics beats:
  opener tag, "the same **3** things", the `$200K` pitch, `$1000 → NOTHING`,
  the `0 visitors` Shopify mock, the struck-through `$900` course, the
  gumball-machine reveal, quarters + weekly pickup, the `FREE` stamp, and
  the "LINK IN BIO" end card.
- `src/components/Captions.tsx` — word-by-word kinetic captions with
  keyword highlighting, hidden during full-screen cutaways.
- `src/components/GlassCard.tsx`, `GlowBackground.tsx`, `bits.tsx` — the
  reusable style primitives.
- `src/captions.ts` — transcript + timings on the concatenated timeline.
- `src/theme.ts` — design tokens (colors, fps, frame math).

## Setup

Place the two source clips (not committed) at:

```
public/part1.mp4   # gru11 — 771 frames / 25.7s
public/part2.mp4   # gru21 — 589 frames / 19.6s
```

Fonts (Anton, Inter) are self-hosted under `public/fonts/` so no network
fetch is needed at render time.

## Render

```
npm install
npx remotion render Main out/video.mp4 --codec=h264 --crf=18
```

In sandboxed environments without Chrome download access, point Remotion at
a local headless shell (already wired in `remotion.config.ts`):

```
Config.setBrowserExecutable("/path/to/chrome-headless-shell");
```
