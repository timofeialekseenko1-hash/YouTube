import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { PART1_FRAMES, sec } from "./theme";
import { Captions } from "./components/Captions";
import { Vignette } from "./components/Overlays";
import {
  CourseStrike,
  EndCTA,
  FreeStamp,
  LearnNothing,
  MachineReveal,
  OpenerTag,
  PitchQuote,
  Quarters,
  ShopifyZero,
  ThreeThings,
} from "./components/GfxScenes";

// A GFX scene mounted on the concatenated timeline.
const gfx: { from: number; dur: number; el: React.ReactNode; name: string }[] = [
  { name: "opener", from: 0, dur: 52, el: <OpenerTag /> },
  { name: "three", from: sec(4.5), dur: 96, el: <ThreeThings /> },
  { name: "pitch", from: sec(9.4), dur: 64, el: <PitchQuote /> },
  { name: "nothing", from: sec(11.8), dur: 58, el: <LearnNothing /> },
  { name: "shopify", from: sec(13.95), dur: 96, el: <ShopifyZero /> },
  { name: "course", from: sec(21.8), dur: 100, el: <CourseStrike /> },
  { name: "machine", from: sec(26.85), dur: 132, el: <MachineReveal /> },
  { name: "quarters", from: sec(31.4), dur: 108, el: <Quarters /> },
  { name: "free", from: sec(35.4), dur: 120, el: <FreeStamp /> },
  { name: "cta", from: sec(39.6), dur: sec(45.34) - sec(39.6), el: <EndCTA /> },
];

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060a" }}>
      {/* Base footage: part 1 then part 2, carrying the voice-over audio. */}
      <Sequence from={0} durationInFrames={PART1_FRAMES}>
        <OffthreadVideo src={staticFile("part1.mp4")} />
      </Sequence>
      <Sequence from={PART1_FRAMES}>
        <OffthreadVideo src={staticFile("part2.mp4")} />
      </Sequence>

      <Vignette />

      {/* Motion-graphics scenes */}
      {gfx.map((g) => (
        <Sequence key={g.name} from={g.from} durationInFrames={g.dur} name={g.name}>
          {g.el}
        </Sequence>
      ))}

      {/* Kinetic captions ride on top of everything */}
      <Captions />
    </AbsoluteFill>
  );
};
