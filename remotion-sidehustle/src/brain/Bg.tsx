import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// White field with a soft gray gradient and a slow-drifting highlight so the
// background is never fully static.
export const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 90) * 12;
  const y = 34 + Math.cos(f / 110) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 45% at ${x}% ${y}%, rgba(255,255,255,1) 0%, rgba(246,247,250,1) 45%, rgba(232,235,242,1) 100%)`,
      }}
    />
  );
};

// A gentle continuous "camera breathing" applied to a whole scene.
export const Breathe: React.FC<{ children: React.ReactNode; amt?: number; speed?: number }> = ({
  children,
  amt = 0.02,
  speed = 70,
}) => {
  const f = useCurrentFrame();
  const s = 1 + amt * (0.5 + 0.5 * Math.sin(f / speed));
  const ty = Math.sin(f / (speed * 1.3)) * 6;
  return (
    <AbsoluteFill style={{ transform: `scale(${s}) translateY(${ty}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
