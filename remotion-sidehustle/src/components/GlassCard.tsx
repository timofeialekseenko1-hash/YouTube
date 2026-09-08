import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { glow } from "../theme";

// Translucent "Liquid Glass" card: rounded corners, frosted fill, soft accent
// border, and a specular highlight that sweeps across on entrance.
export const GlassCard: React.FC<{
  accent: string;
  enter?: number; // frame the entrance spring starts (relative to sequence)
  style?: React.CSSProperties;
  padding?: number | string;
  radius?: number;
  children?: React.ReactNode;
  sweep?: boolean;
}> = ({
  accent,
  enter = 0,
  style,
  padding = 40,
  radius = 40,
  children,
  sweep = true,
}) => {
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

  // Specular sweep: a bright diagonal band that crosses once.
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
          "linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 100%)",
        border: `1.5px solid ${glow(accent, 0.55)}`,
        boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 60px ${glow(
          accent,
          0.28
        )}, inset 0 1px 0 rgba(255,255,255,0.35)`,
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
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
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}
      {children}
    </div>
  );
};
