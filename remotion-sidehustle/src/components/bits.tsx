import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ANTON, INTER } from "../fonts";
import { glow } from "../theme";

export const useSpringIn = (enter: number, cfg?: Parameters<typeof spring>[0]["config"]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - enter,
    fps,
    config: cfg ?? { damping: 15, mass: 0.8, stiffness: 130 },
  });
};

// Small uppercase label/eyebrow.
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
      textShadow: `0 0 24px ${glow(accent, 0.6)}`,
    }}
  >
    {children}
  </div>
);

// Rounded translucent pill.
export const Pill: React.FC<{
  accent: string;
  enter: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ accent, enter, children, style }) => {
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
        padding: "16px 30px",
        borderRadius: 999,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: 34,
        color: "#fff",
        background: glow(accent, 0.16),
        border: `1.5px solid ${glow(accent, 0.6)}`,
        boxShadow: `0 0 34px ${glow(accent, 0.35)}`,
        transform: `translateY(${y}px) scale(${sc})`,
        opacity: op,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Animated count-up number in Anton.
export const CountUp: React.FC<{
  from: number;
  to: number;
  enter: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  color: string;
  fontSize?: number;
  format?: (n: number) => string;
}> = ({ from, to, enter, duration, prefix = "", suffix = "", color, fontSize = 150, format }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - enter, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - p, 3);
  const val = Math.round(from + (to - from) * eased);
  const shown = format ? format(val) : val.toLocaleString("en-US");
  return (
    <div
      style={{
        fontFamily: ANTON,
        fontSize,
        lineHeight: 1,
        color,
        textShadow: `0 0 44px ${glow(color, 0.55)}, 0 10px 30px rgba(0,0,0,0.6)`,
      }}
    >
      {prefix}
      {shown}
      {suffix}
    </div>
  );
};
