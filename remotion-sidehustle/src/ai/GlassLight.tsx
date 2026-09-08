import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { glow } from "./theme";

// Light "Liquid Glass" card: bright frosted fill, dark text, soft accent
// border, specular highlight sweeping across once on entrance.
export const GlassLight: React.FC<{
  accent: string;
  enter?: number;
  style?: React.CSSProperties;
  padding?: number | string;
  radius?: number;
  children?: React.ReactNode;
  sweep?: boolean;
}> = ({ accent, enter = 0, style, padding = 40, radius = 40, children, sweep = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - enter,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 120 },
  });
  const scale = interpolate(s, [0, 1], [0.86, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [26, 0]);

  const sweepPos = interpolate(frame - enter, [6, 34], [-140, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        padding,
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.66) 100%)",
        border: `1.5px solid ${glow(accent, 0.5)}`,
        boxShadow: `0 24px 70px rgba(20,30,60,0.18), 0 0 50px ${glow(
          accent,
          0.22
        )}, inset 0 1px 0 rgba(255,255,255,0.9)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        ...style,
      }}
    >
      {sweep && (
        <div
          style={{
            position: "absolute",
            top: -60,
            bottom: -60,
            width: 120,
            left: `${sweepPos}%`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
};
