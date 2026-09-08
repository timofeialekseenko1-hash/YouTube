import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlowLight } from "./GlowLight";
import { GlassLight } from "./GlassLight";
import { Eyebrow, Pill, useSpringIn } from "./bitsLight";
import { ANTON, INTER } from "../fonts";
import { ACCENT, glow } from "./theme";

// ---------- shared layout ----------
const Cutaway: React.FC<{
  accent: string;
  outAt: number;
  children: React.ReactNode;
}> = ({ accent, outAt, children }) => {
  const frame = useCurrentFrame();
  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [outAt, outAt + 8], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inOp, outOp) }}>
      <GlowLight accent={accent} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", padding: 80 }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TopOverlay: React.FC<{
  outAt: number;
  children: React.ReactNode;
  top?: number;
}> = ({ outAt, children, top = 200 }) => {
  const frame = useCurrentFrame();
  const outOp = interpolate(frame, [outAt, outAt + 8], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: top,
        opacity: outOp,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- 1. Opener hook (cutaway) ----------
export const OpenerAi: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSpringIn(4, { damping: 12, mass: 0.8, stiffness: 130 });
  const dateScale = interpolate(s, [0, 1], [0.5, 1]);
  return (
    <Cutaway accent={ACCENT.red} outAt={78}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 220,
            lineHeight: 0.9,
            color: ACCENT.red,
            transform: `scale(${dateScale})`,
            textShadow: `0 0 60px ${glow(ACCENT.red, 0.3)}`,
          }}
        >
          2028
        </div>
        <Eyebrow accent={ACCENT.ink}>The year the rules break</Eyebrow>
        <GlassLight
          accent={ACCENT.red}
          enter={20}
          padding="34px 50px"
          radius={34}
          style={{ marginTop: 30, display: "inline-block" }}
        >
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 96,
              lineHeight: 1.0,
              color: ACCENT.ink,
              textAlign: "center",
            }}
          >
            AI DESTROYS MOST
            <br />
            <span style={{ color: ACCENT.red }}>BUSINESS MODELS</span>
          </div>
        </GlassLight>
      </div>
    </Cutaway>
  );
};

// ---------- 2. Intelligence chips ----------
export const IntelChips: React.FC = () => {
  const chips = ["CHEAP", "UNLIMITED", "AVAILABLE"];
  return (
    <TopOverlay outAt={58} top={230}>
      <div style={{ textAlign: "center" }}>
        <GlassLight accent={ACCENT.blue} enter={2} padding="20px 30px" radius={30} style={{ display: "inline-block", marginBottom: 26 }}>
          <span style={{ fontFamily: ANTON, fontSize: 54, color: ACCENT.ink }}>
            INTELLIGENCE IS NOW
          </span>
        </GlassLight>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          {chips.map((c, i) => (
            <Pill key={c} accent={ACCENT.blue} enter={16 + i * 10}>
              {c}
            </Pill>
          ))}
        </div>
      </div>
    </TopOverlay>
  );
};

// ---------- 3. Jobs AI eats (2x2 grid) ----------
const jobs = [
  { label: "DESIGN", icon: "🎨" },
  { label: "LAW", icon: "⚖️" },
  { label: "ANALYSIS", icon: "📊" },
  { label: "CONTENT", icon: "✍️" },
];
export const JobsGrid: React.FC = () => (
  <TopOverlay outAt={66} top={210}>
    <div style={{ textAlign: "center" }}>
      <Eyebrow accent={ACCENT.ink}>AI already does it all</Eyebrow>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 22,
          width: 720,
        }}
      >
        {jobs.map((j, i) => (
          <GlassLight
            key={j.label}
            accent={ACCENT.blue}
            enter={10 + i * 8}
            padding="26px 20px"
            radius={28}
            style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}
          >
            <span style={{ fontSize: 56 }}>{j.icon}</span>
            <span style={{ fontFamily: ANTON, fontSize: 60, color: ACCENT.ink }}>
              {j.label}
            </span>
          </GlassLight>
        ))}
      </div>
    </div>
  </TopOverlay>
);

// ---------- 4. Faster & free ----------
export const FasterFree: React.FC = () => (
  <TopOverlay outAt={40} top={250}>
    <div style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
      <Pill accent={ACCENT.blue} enter={2} style={{ fontSize: 46, padding: "22px 40px" }}>
        ⚡ FASTER
      </Pill>
      <Pill accent={ACCENT.green} enter={12} style={{ fontSize: 46, padding: "22px 40px" }}>
        $0 FREE
      </Pill>
    </div>
  </TopOverlay>
);

// ---------- 5. Crash graph (cutaway) ----------
export const CrashGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  // line progress 0->1
  const p = interpolate(frame, [16, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const W = 820;
  const H = 520;
  // points: gentle then cliff crash to zero
  const pts = [
    [0, 120],
    [220, 90],
    [380, 110],
    [520, 150],
    [640, 380],
    [820, 500],
  ];
  const total = pts.length - 1;
  const drawn = p * total;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  let headX = pts[0][0];
  let headY = pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.min(Math.max(drawn - (i - 1), 0), 1);
    if (seg <= 0) break;
    const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * seg;
    const y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * seg;
    d += ` L ${x} ${y}`;
    headX = x;
    headY = y;
  }
  return (
    <Cutaway accent={ACCENT.red} outAt={90}>
      <div style={{ textAlign: "center" }}>
        <GlassLight accent={ACCENT.red} enter={2} padding="18px 34px" radius={26} style={{ display: "inline-block", marginBottom: 26 }}>
          <span style={{ fontFamily: ANTON, fontSize: 58, color: ACCENT.ink }}>
            BUILT ON <span style={{ color: ACCENT.red }}>THINKING?</span>
          </span>
        </GlassLight>
        <div style={{ position: "relative", width: W, height: H, margin: "0 auto" }}>
          <svg width={W} height={H} style={{ overflow: "visible" }}>
            {[130, 250, 370].map((y) => (
              <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="rgba(11,14,23,0.08)" strokeWidth={2} />
            ))}
            <path
              d={d}
              fill="none"
              stroke={ACCENT.red}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 6px 20px ${glow(ACCENT.red, 0.4)})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: headX - 16,
              top: headY - 16,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: ACCENT.red,
              boxShadow: `0 0 24px ${glow(ACCENT.red, 0.9)}, 0 0 0 6px ${glow(ACCENT.red, 0.18)}`,
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontFamily: ANTON, fontSize: 74, color: ACCENT.red }}>
            COMPETED TO ZERO
          </span>
        </div>
      </div>
    </Cutaway>
  );
};

// ---------- 6. Pattern interrupt ----------
export const ButThing: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSpringIn(2, { damping: 10, mass: 0.6, stiffness: 150 });
  const sc = interpolate(s, [0, 1], [0.6, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${sc})`, opacity: op }}>
        <GlassLight accent={ACCENT.gold} enter={2} padding="26px 60px" radius={40}>
          <span style={{ fontFamily: ANTON, fontSize: 100, color: ACCENT.ink }}>
            BUT<span style={{ color: ACCENT.gold }}>…</span>
          </span>
        </GlassLight>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. Outsmart vs dopamine (cutaway) ----------
export const VsDopamine: React.FC = () => {
  return (
    <Cutaway accent={ACCENT.gold} outAt={92}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <GlassLight accent={ACCENT.blue} enter={4} padding="28px 40px" radius={30} style={{ display: "inline-block" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <span style={{ fontSize: 70 }}>🧠</span>
            <span style={{ fontFamily: ANTON, fontSize: 66, color: ACCENT.ink }}>
              OUTSMARTS ANY HUMAN
            </span>
          </div>
        </GlassLight>

        <div
          style={{
            fontFamily: ANTON,
            fontSize: 60,
            color: ACCENT.ink,
            opacity: 0.5,
            margin: "26px 0",
          }}
        >
          BUT IT CAN'T REPLACE
        </div>

        <GlassLight accent={ACCENT.gold} enter={26} padding="30px 50px" radius={36} style={{ display: "inline-block" }}>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 150,
              color: ACCENT.gold,
              lineHeight: 1,
              textShadow: `0 0 50px ${glow(ACCENT.gold, 0.35)}`,
            }}
          >
            DOPAMINE
          </div>
        </GlassLight>
      </div>
    </Cutaway>
  );
};

// ---------- Spiral vending machine ----------
const Coil: React.FC<{ candy: string[] }> = ({ candy }) => (
  <div style={{ display: "flex", alignItems: "center", height: 70, position: "relative" }}>
    <div
      style={{
        flex: 1,
        height: 22,
        borderRadius: 11,
        background:
          "repeating-linear-gradient(115deg, rgba(11,14,23,0.35) 0 6px, rgba(11,14,23,0.08) 6px 15px)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
      }}
    />
    <div style={{ display: "flex", gap: 10, marginLeft: 10 }}>
      {candy.map((c, i) => (
        <span
          key={i}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #fff, ${c})`,
            boxShadow: `0 0 14px ${glow(c, 0.5)}`,
          }}
        />
      ))}
    </div>
  </div>
);

const SpiralMachine: React.FC<{ enter: number }> = ({ enter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - enter, fps, config: { damping: 14, mass: 1, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const rows = [
    ["#FF3B4E", "#2F7BFF", "#12B76A"],
    ["#E0A020", "#B06CFF", "#FF7A3C"],
    ["#2F7BFF", "#FF3B4E", "#E0A020"],
  ];
  return (
    <div style={{ transform: `scale(${scale})`, opacity: op, width: 460, margin: "0 auto" }}>
      {/* glass cabinet */}
      <div
        style={{
          borderRadius: "34px 34px 12px 12px",
          padding: "30px 30px 20px",
          background: "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          border: `3px solid ${glow(ACCENT.gold, 0.6)}`,
          boxShadow: `0 30px 80px rgba(20,30,60,0.2), 0 0 60px ${glow(ACCENT.gold, 0.25)}, inset 0 0 40px rgba(255,255,255,0.7)`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {rows.map((r, i) => {
          const rs = spring({ frame: frame - enter - 8 - i * 6, fps, config: { damping: 12, stiffness: 140 } });
          return (
            <div key={i} style={{ opacity: interpolate(rs, [0, 1], [0, 1]), transform: `translateX(${interpolate(rs, [0, 1], [-40, 0])}px)` }}>
              <Coil candy={r} />
              {i < rows.length - 1 && <div style={{ height: 2, background: "rgba(11,14,23,0.08)", marginTop: 12 }} />}
            </div>
          );
        })}
      </div>
      {/* base + delivery tray */}
      <div
        style={{
          height: 90,
          borderRadius: "0 0 26px 26px",
          background: `linear-gradient(180deg, ${ACCENT.gold}, #c88a1a)`,
          marginTop: -4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 20px 50px rgba(0,0,0,0.2)`,
        }}
      >
        <div style={{ width: 150, height: 44, borderRadius: 12, background: "rgba(0,0,0,0.28)", border: "2px solid rgba(255,255,255,0.4)" }} />
      </div>
    </div>
  );
};

// ---------- 8. Spiral machine payoff (cutaway end card) ----------
export const SpiralPayoff: React.FC = () => {
  return (
    <Cutaway accent={ACCENT.gold} outAt={128}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Eyebrow accent={ACCENT.ink}>People will always want</Eyebrow>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 92,
            color: ACCENT.gold,
            lineHeight: 1,
            margin: "8px 0 26px",
            textShadow: `0 0 40px ${glow(ACCENT.gold, 0.3)}`,
          }}
        >
          SWEET SURPRISES
        </div>
        <SpiralMachine enter={14} />
        <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
          <Pill accent={ACCENT.green} enter={70} style={{ fontSize: 44, padding: "22px 44px" }}>
            ✅ WON'T BE DISRUPTED
          </Pill>
        </div>
      </div>
    </Cutaway>
  );
};
