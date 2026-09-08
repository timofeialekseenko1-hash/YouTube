import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "../captions";
import { ANTON } from "../fonts";
import { ACCENT, glow } from "../theme";

// Words that deserve a pop of color when they land.
const HILITE: Record<string, string> = {
  GURUS: ACCENT.red,
  GURU: ACCENT.red,
  THREE: ACCENT.blue,
  DROPSHIPPING: ACCENT.blue,
  "$200K": ACCENT.gold,
  "$1000": ACCENT.red,
  NOTHING: ACCENT.red,
  "$900": ACCENT.red,
  FREE: ACCENT.gold,
  QUARTERS: ACCENT.gold,
  MACHINE: ACCENT.gold,
  LINK: ACCENT.gold,
  KID: ACCENT.green,
  MONEY: ACCENT.gold,
};

const clean = (w: string) => w.replace(/[^A-Z0-9$]/gi, "").toUpperCase();

const Word: React.FC<{
  word: string;
  appearAt: number;
  active: boolean;
}> = ({ word, appearAt, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 160 },
  });
  const y = interpolate(s, [0, 1], [22, 0]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const hilite = HILITE[clean(word)];
  const color = hilite ?? "#FFFFFF";
  const pop = active ? 1.08 : 1;

  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 12px",
        transform: `translateY(${y}px) scale(${pop})`,
        opacity: op,
        color,
        transition: "transform 0.1s",
        textShadow: hilite
          ? `0 0 26px ${glow(hilite, 0.7)}, 0 6px 20px rgba(0,0,0,0.6)`
          : "0 6px 20px rgba(0,0,0,0.7)",
      }}
    >
      {word}
    </span>
  );
};

// Frame ranges owned by full-screen cutaways, where bottom captions are hidden.
const CUTAWAYS: [number, number][] = [
  [135, 231],
  [806, 938],
  [1188, 1360],
];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  if (CUTAWAYS.some(([a, b]) => frame >= a && frame < b)) return null;
  const active = CAPTIONS.find((c) => frame >= c.start && frame < c.end + 6);
  if (!active) return null;

  const words = active.text.split(" ");
  const span = Math.max(active.end - active.start, 1);
  // Distribute word appearance across ~70% of the line's duration.
  const perWord = (span * 0.7) / words.length;
  const activeIdx = Math.min(
    words.length - 1,
    Math.floor((frame - active.start) / Math.max(perWord, 1))
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 300,
        display: "flex",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 82,
          lineHeight: 1.05,
          textAlign: "center",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            appearAt={active.start + i * perWord}
            active={i === activeIdx}
          />
        ))}
      </div>
    </div>
  );
};
