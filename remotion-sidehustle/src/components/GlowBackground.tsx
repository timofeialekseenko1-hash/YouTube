import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { glow } from "../theme";

// Dark radial-glow field. Never pure black; the glow breathes very slowly.
export const GlowBackground: React.FC<{
  accent?: string;
  intensity?: number;
}> = ({ accent = "#4DA3FF", intensity = 1 }) => {
  const frame = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin(frame / 40);
  const a = (0.16 + 0.06 * breathe) * intensity;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 34%, ${glow(
          accent,
          a
        )} 0%, rgba(10,12,18,0) 55%), radial-gradient(100% 100% at 50% 100%, rgba(6,8,13,1) 0%, #0a0c12 60%, #070810 100%)`,
      }}
    />
  );
};
