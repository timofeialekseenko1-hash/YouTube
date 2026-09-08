import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { MainAi } from "./ai/MainAi";
import { AI_FRAMES } from "./ai/theme";
import { MainBrain, BRAIN_FRAMES } from "./brain/MainBrain";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";
import "./fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AiSuper"
        component={MainAi}
        durationInFrames={AI_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BrainSurprise"
        component={MainBrain}
        durationInFrames={BRAIN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
