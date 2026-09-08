import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bg, Breathe } from "./Bg";
import {
  AisleHook,
  BrainDelete,
  ExactSpot,
  GrayShelves,
  Habituation,
  Irrelevant,
  PlacesEmotions,
  StoreReveal,
  Surprise,
  Why,
  YouCant,
} from "./scenes";

export const BRAIN_FRAMES = 785;

// Cross-fade wrapper: fades a scene in and out at its edges so adjacent
// sequences dissolve over the shared moving background — no hard cuts.
const Scene: React.FC<{ dur: number; children: React.ReactNode; breathe?: boolean }> = ({
  dur,
  children,
  breathe,
}) => {
  const f = useCurrentFrame();
  const fade = Math.max(1, Math.min(8, Math.floor(dur / 2) - 1));
  const op = interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {breathe ? <Breathe amt={0.02}>{children}</Breathe> : children}
    </AbsoluteFill>
  );
};

const scenes: { from: number; dur: number; el: React.ReactNode; breathe?: boolean }[] = [
  { from: 0, dur: 78, el: <AisleHook dur={78} /> },
  { from: 73, dur: 34, el: <YouCant dur={34} /> },
  { from: 95, dur: 58, el: <GrayShelves dur={58} /> },
  { from: 143, dur: 63, el: <BrainDelete />, breathe: true },
  { from: 201, dur: 52, el: <Habituation />, breathe: true },
  { from: 249, dur: 137, el: <Irrelevant dur={137} /> },
  { from: 381, dur: 127, el: <StoreReveal dur={127} /> },
  { from: 503, dur: 97, el: <ExactSpot />, breathe: true },
  { from: 596, dur: 16, el: <Why />, breathe: true },
  { from: 606, dur: 127, el: <PlacesEmotions />, breathe: true },
  { from: 729, dur: 56, el: <Surprise />, breathe: true },
];

export const MainBrain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4f6fa" }}>
      <Bg />
      {scenes.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <Scene dur={s.dur} breathe={s.breathe}>
            {s.el}
          </Scene>
        </Sequence>
      ))}
      <Audio src={staticFile("vo.mp3")} />
    </AbsoluteFill>
  );
};
