import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AI_CAPS } from "./captionsAi";
import { ANTON } from "../fonts";
import { ACCENT, glow } from "./theme";

const HILITE: Record<string, string> = {
  "2028": ACCENT.red,
  DESTROY: ACCENT.red,
  FREE: ACCENT.green,
  THINKING: ACCENT.red,
  GROUND: ACCENT.red,
  DOPAMINE: ACCENT.gold,
  SWEET: ACCENT.gold,
  SURPRISES: ACCENT.gold,
  SPIRAL: ACCENT.gold,
  DISRUPTED: ACCENT.blue,
  INTELLIGENCE: ACCENT.blue,
  UNLIMITED: ACCENT.blue,
};

const clean = (w: string) => w.replace(/[^A-Z0-9]/gi, "").toUpperCase();
const sec = (s: number) => Math.round(s * 30);

// Frame ranges owned by full-screen cutaways (captions hidden there).
const CUTAWAYS: [number, number][] = [
  [0, sec(2.95)],
  [sec(9.5), sec(12.75)],
  [sec(13.55), sec(16.95)],
  [sec(16.98), 645],
];

const Word: React.FC<{ word: string; appearAt: number; active: boolean }> = ({
  word,
  appearAt,
  active,
}) => {
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
        margin: "0 10px",
        transform: `translateY(${y}px) scale(${pop})`,
        opacity: op,
        color,
        textShadow: hilite
          ? `0 0 24px ${glow(hilite, 0.6)}, 0 5px 18px rgba(0,0,0,0.55)`
          : "0 5px 18px rgba(0,0,0,0.75)",
      }}
    >
      {word}
    </span>
  );
};

export const CaptionsAi: React.FC = () => {
  const frame = useCurrentFrame();
  if (CUTAWAYS.some(([a, b]) => frame >= a && frame < b)) return null;

  const active = AI_CAPS.map((c) => ({
    ...c,
    start: sec(c.a),
    end: sec(c.b),
  })).find((c) => frame >= c.start && frame < c.end + 4);
  if (!active) return null;

  const words = active.text.split(" ");
  const span = Math.max(active.end - active.start, 1);
  const perWord = (span * 0.65) / words.length;
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
        bottom: 320,
        display: "flex",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 78,
          lineHeight: 1.05,
          textAlign: "center",
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
