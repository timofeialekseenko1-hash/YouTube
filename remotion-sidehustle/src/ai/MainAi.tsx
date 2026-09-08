import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CaptionsAi } from "./CaptionsAi";
import {
  ButThing,
  CrashGraph,
  FasterFree,
  IntelChips,
  JobsGrid,
  OpenerAi,
  SpiralPayoff,
  VsDopamine,
} from "./ScenesAi";

const sec = (s: number) => Math.round(s * 30);

// Bottom scrim so white captions stay legible over the footage.
const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 84%, rgba(0,0,0,0.72) 100%)",
      pointerEvents: "none",
    }}
  />
);

const gfx: { from: number; dur: number; el: React.ReactNode; name: string }[] = [
  { name: "opener", from: 0, dur: sec(2.95), el: <OpenerAi /> },
  { name: "intel", from: sec(3.3), dur: sec(2.5), el: <IntelChips /> },
  { name: "jobs", from: sec(5.8), dur: sec(2.3), el: <JobsGrid /> },
  { name: "fasterfree", from: sec(7.95), dur: sec(1.7), el: <FasterFree /> },
  { name: "crash", from: sec(9.5), dur: sec(3.25), el: <CrashGraph /> },
  { name: "but", from: sec(12.78), dur: sec(0.8), el: <ButThing /> },
  { name: "vs", from: sec(13.55), dur: sec(3.4), el: <VsDopamine /> },
  { name: "spiral", from: sec(16.98), dur: sec(21.5) - sec(16.98), el: <SpiralPayoff /> },
];

export const MainAi: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#eef1f7" }}>
      <OffthreadVideo src={staticFile("ai_super.mp4")} />
      <Scrim />
      {gfx.map((g) => (
        <Sequence key={g.name} from={g.from} durationInFrames={g.dur} name={g.name}>
          {g.el}
        </Sequence>
      ))}
      <CaptionsAi />
    </AbsoluteFill>
  );
};
