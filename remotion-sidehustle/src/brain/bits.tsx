import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER } from "../fonts";
import { ACCENT, glow } from "../ai/theme";

const sec = (s: number) => Math.round(s * 30);
export const S = sec;

export type WordT = { w: string; t: number; acc?: string };

// Big kinetic headline: words spring in at absolute times, the just-landed word
// gets an accent pop, and the whole line keeps a subtle float so it never sits
// perfectly still.
export const KineticLine: React.FC<{
  words: WordT[];
  size?: number;
  top?: number;
  bottom?: number;
  maxWidth?: number;
  color?: string;
}> = ({ words, size = 92, top, bottom, maxWidth = 900, color = ACCENT.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const floaty = Math.sin(frame / 22) * 4;
  const lastLanded = words.reduce((acc, w, i) => (frame >= sec(w.t) ? i : acc), -1);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        bottom,
        display: "flex",
        justifyContent: "center",
        padding: "0 70px",
        transform: `translateY(${floaty}px)`,
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 1.02,
          textAlign: "center",
          textTransform: "uppercase",
          maxWidth,
          letterSpacing: 0.5,
        }}
      >
        {words.map((wd, i) => {
          const s = spring({ frame: frame - sec(wd.t), fps, config: { damping: 14, mass: 0.5, stiffness: 170 } });
          const y = interpolate(s, [0, 1], [26, 0]);
          const op = interpolate(s, [0, 1], [0, 1]);
          const isActive = i === lastLanded;
          const c = wd.acc ?? color;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 10px",
                transform: `translateY(${y}px) scale(${isActive ? 1.06 : 1})`,
                opacity: op,
                color: c,
                textShadow: wd.acc
                  ? `0 0 26px ${glow(wd.acc, 0.45)}`
                  : "0 6px 18px rgba(20,30,60,0.14)",
              }}
            >
              {wd.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Ken-Burns image: continuous slow zoom + drift toward a focal point.
export const KenBurns: React.FC<{
  src: string;
  from?: number;
  to?: number;
  dur: number;
  focusX?: number; // 0..100
  focusY?: number;
  style?: React.CSSProperties;
  fit?: "cover" | "contain";
}> = ({ src, from = 1.05, to = 1.28, dur, focusX = 50, focusY = 50, style, fit = "cover" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [from, to]);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: `${focusX}% ${focusY}%`,
        transform: `scale(${scale})`,
        transformOrigin: `${focusX}% ${focusY}%`,
        ...style,
      }}
    />
  );
};

// Floating cut-out image (hero product) with a gentle bob + spring-in.
export const FloatImg: React.FC<{
  src: string;
  enter?: number;
  height: number;
  bob?: number;
  style?: React.CSSProperties;
}> = ({ src, enter = 0, height, bob = 10, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - enter, fps, config: { damping: 15, mass: 1, stiffness: 110 } });
  const sc = interpolate(s, [0, 1], [0.8, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const y = Math.sin(frame / 24) * bob;
  return (
    <Img
      src={staticFile(src)}
      style={{
        height,
        width: "auto",
        transform: `translateY(${y}px) scale(${sc})`,
        opacity: op,
        filter: "drop-shadow(0 30px 50px rgba(20,30,60,0.28))",
        ...style,
      }}
    />
  );
};

export const Chip: React.FC<{
  accent: string;
  enter: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  solid?: boolean;
}> = ({ accent, enter, children, style, solid = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - enter, fps, config: { damping: 13, mass: 0.6, stiffness: 170 } });
  const y = interpolate(s, [0, 1], [22, 0]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const sc = interpolate(s, [0, 1], [0.8, 1]);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 30px",
        borderRadius: 999,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: 34,
        color: solid ? "#fff" : ACCENT.ink,
        background: solid ? accent : "rgba(255,255,255,0.9)",
        border: `1.5px solid ${glow(accent, solid ? 0.9 : 0.5)}`,
        boxShadow: `0 12px 30px ${glow(accent, 0.32)}`,
        transform: `translateY(${y}px) scale(${sc})`,
        opacity: op,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
