import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// A stylized supermarket aisle in one-point perspective. Two shelf walls +
// floor + ceiling converge on a vanishing point; a scrolling shelf texture and
// a slow scale give a continuous forward-dolly feel. `gray` drains all color and
// makes every shelf identical (the "same sections" beat).
export const Aisle: React.FC<{ gray?: number; dur: number }> = ({ gray = 0, dur }) => {
  const f = useCurrentFrame();
  const dolly = interpolate(f, [0, dur], [1.0, 1.16], { extrapolateRight: "clamp" });
  const scroll = (f * 6) % 240; // forward motion of shelf rows

  const wallBase = gray > 0 ? "#c9ccd3" : "#e8d9b8";
  const wallDark = gray > 0 ? "#b4b8c0" : "#d8c49a";
  const shelfLine = gray > 0 ? "rgba(90,95,105,0.55)" : "rgba(120,90,50,0.55)";

  const wallTexture = `repeating-linear-gradient(0deg, ${wallBase} 0px, ${wallBase} 40px, ${wallDark} 40px, ${wallDark} 44px, ${shelfLine} 44px, ${shelfLine} 48px)`;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${dolly})`, transformOrigin: "50% 46%" }}>
        {/* ceiling */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0, 100% 0, 66% 40%, 34% 40%)",
            background: gray > 0 ? "#eceef2" : "#f3ead6",
          }}
        />
        {/* floor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(34% 56%, 66% 56%, 100% 100%, 0 100%)",
            background: gray > 0
              ? "linear-gradient(180deg,#d7dae0,#c2c6cd)"
              : "linear-gradient(180deg,#e7dcc4,#cdbf9f)",
          }}
        />
        {/* floor guide lines toward vanishing point */}
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {[0, 180, 360, 720, 900, 1080].map((x) => (
            <line key={x} x1={x} y1={1920} x2={540} y2={1075} stroke={gray > 0 ? "rgba(120,125,135,0.35)" : "rgba(150,120,70,0.35)"} strokeWidth={3} />
          ))}
        </svg>
        {/* left wall */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0, 34% 40%, 34% 56%, 0 100%)",
            background: wallTexture,
            backgroundPositionY: `${scroll}px`,
            filter: "brightness(0.92)",
          }}
        />
        {/* right wall */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(100% 0, 66% 40%, 66% 56%, 100% 100%)",
            background: wallTexture,
            backgroundPositionY: `${scroll}px`,
            filter: "brightness(0.86)",
          }}
        />
        {/* far wall / vanishing glow */}
        <div
          style={{
            position: "absolute",
            left: "34%",
            top: "40%",
            width: "32%",
            height: "16%",
            background: gray > 0
              ? "radial-gradient(circle, #f4f5f8, #dfe2e8)"
              : "radial-gradient(circle, #fff6e4, #eaddc2)",
          }}
        />
      </div>
      {/* desaturation veil for the gray beat */}
      {gray > 0 && (
        <AbsoluteFill style={{ background: "rgba(210,213,220,0.35)", opacity: gray }} />
      )}
      {/* soft vignette to keep focus center */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 46%, rgba(0,0,0,0) 55%, rgba(20,26,40,0.18) 100%)" }} />
    </AbsoluteFill>
  );
};
