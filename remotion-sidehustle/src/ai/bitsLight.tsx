import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ANTON, INTER } from "../fonts";
import { ACCENT, glow } from "./theme";

export const useSpringIn = (
  enter: number,
  cfg?: Parameters<typeof spring>[0]["config"]
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - enter,
    fps,
    config: cfg ?? { damping: 15, mass: 0.8, stiffness: 130 },
  });
};

export const Eyebrow: React.FC<{ accent: string; children: React.ReactNode }> = ({
  accent,
  children,
}) => (
  <div
    style={{
      fontFamily: INTER,
      fontWeight: 800,
      fontSize: 30,
      letterSpacing: 6,
      textTransform: "uppercase",
      color: accent,
    }}
  >
    {children}
  </div>
);

// Solid accent pill with white text (reads on the light field).
export const Pill: React.FC<{
  accent: string;
  enter: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  solid?: boolean;
}> = ({ accent, enter, children, style, solid = true }) => {
  const s = useSpringIn(enter, { damping: 13, mass: 0.6, stiffness: 170 });
  const y = interpolate(s, [0, 1], [24, 0]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const sc = interpolate(s, [0, 1], [0.8, 1]);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 32px",
        borderRadius: 999,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: 36,
        color: solid ? "#fff" : ACCENT.ink,
        background: solid ? accent : "rgba(255,255,255,0.85)",
        border: `1.5px solid ${glow(accent, solid ? 0.9 : 0.5)}`,
        boxShadow: `0 12px 34px ${glow(accent, 0.35)}`,
        transform: `translateY(${y}px) scale(${sc})`,
        opacity: op,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const CountUp: React.FC<{
  from: number;
  to: number;
  enter: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  color: string;
  fontSize?: number;
}> = ({ from, to, enter, duration, prefix = "", suffix = "", color, fontSize = 150 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - enter, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - p, 3);
  const val = Math.round(from + (to - from) * eased);
  return (
    <div
      style={{
        fontFamily: ANTON,
        fontSize,
        lineHeight: 1,
        color,
        textShadow: `0 0 40px ${glow(color, 0.35)}`,
      }}
    >
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </div>
  );
};
