import React from "react";
import { AbsoluteFill } from "remotion";

// Subtle vignette + a bottom scrim so captions stay legible over the footage.
export const Vignette: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.75) 100%)",
        pointerEvents: "none",
      }}
    />
  </>
);
