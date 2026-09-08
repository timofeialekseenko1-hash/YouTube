import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { glow } from "./theme";

// White radial-glow field — soft, never pure white; the accent glow breathes.
export const GlowLight: React.FC<{ accent?: string; intensity?: number }> = ({
  accent = "#2F7BFF",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin(frame / 40);
  const a = (0.14 + 0.06 * breathe) * intensity;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 32%, ${glow(
          accent,
          a
        )} 0%, rgba(255,255,255,0) 55%), radial-gradient(100% 100% at 50% 100%, #ffffff 0%, #f2f4f9 55%, #e9edf5 100%)`,
      }}
    />
  );
};
