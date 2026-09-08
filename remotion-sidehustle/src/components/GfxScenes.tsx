import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlassCard } from "./GlassCard";
import { GlowBackground } from "./GlowBackground";
import { CountUp, Eyebrow, Pill, useSpringIn } from "./bits";
import { ANTON, INTER } from "../fonts";
import { ACCENT, glow } from "../theme";

// ---------- shared layout helpers ----------

// A cutaway that covers the footage with the glow field, fading in/out.
const Cutaway: React.FC<{
  accent: string;
  outAt: number; // local frame to start fade-out
  children: React.ReactNode;
}> = ({ accent, outAt, children }) => {
  const frame = useCurrentFrame();
  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [outAt, outAt + 8], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inOp, outOp) }}>
      <GlowBackground accent={accent} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A top-anchored overlay card that rides over the footage, then leaves.
const TopOverlay: React.FC<{
  outAt: number;
  children: React.ReactNode;
  top?: number;
}> = ({ outAt, children, top = 210 }) => {
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

// ---------- 1. Opener tag ----------
export const OpenerTag: React.FC = () => (
  <TopOverlay outAt={40} top={230}>
    <Pill accent={ACCENT.red} enter={4}>
      <span style={{ fontSize: 40 }}>🙄</span> SIDE HUSTLE GURUS
    </Pill>
  </TopOverlay>
);

// ---------- 2. The same three things (full cutaway) ----------
const items = [
  { label: "DROPSHIPPING", icon: "📦" },
  { label: "AI DIGITAL PRODUCTS", icon: "🤖" },
  { label: "PASSIVE INCOME AUTOMATION", icon: "♻️" },
];
export const ThreeThings: React.FC = () => {
  const frame = useCurrentFrame();
  const bigS = useSpringIn(4, { damping: 12, mass: 0.7, stiffness: 150 });
  const bigScale = interpolate(bigS, [0, 1], [0.3, 1]);
  return (
    <Cutaway accent={ACCENT.blue} outAt={82}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Eyebrow accent={ACCENT.blue}>They all sell the same</Eyebrow>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 300,
            lineHeight: 0.9,
            color: "#fff",
            transform: `scale(${bigScale})`,
            textShadow: `0 0 70px ${glow(ACCENT.blue, 0.6)}`,
            margin: "6px 0 40px",
          }}
        >
          3
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {items.map((it, i) => {
            const enter = 22 + i * 12;
            return (
              <GlassCard
                key={i}
                accent={ACCENT.blue}
                enter={enter}
                padding="30px 40px"
                radius={30}
                style={{ display: "flex", alignItems: "center", gap: 28 }}
              >
                <span style={{ fontSize: 64 }}>{it.icon}</span>
                <span
                  style={{
                    fontFamily: ANTON,
                    fontSize: 62,
                    color: "#fff",
                    letterSpacing: 1,
                    textAlign: "left",
                    lineHeight: 1,
                  }}
                >
                  {it.label}
                </span>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </Cutaway>
  );
};

// ---------- 3. The $200K guru pitch ----------
export const PitchQuote: React.FC = () => (
  <TopOverlay outAt={50} top={250}>
    <GlassCard accent={ACCENT.gold} enter={2} padding="34px 54px" radius={36}>
      <div style={{ textAlign: "center" }}>
        <Eyebrow accent={ACCENT.gold}>The pitch</Eyebrow>
        <div style={{ marginTop: 6 }}>
          <CountUp
            from={0}
            to={200}
            enter={6}
            duration={26}
            prefix="$"
            suffix="K"
            color={ACCENT.gold}
            fontSize={170}
          />
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 34,
            color: "rgba(255,255,255,0.75)",
            marginTop: 4,
          }}
        >
          "…and I'll show you how" 🙄
        </div>
      </div>
    </GlassCard>
  </TopOverlay>
);

// ---------- 4. $1000 -> nothing ----------
export const LearnNothing: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <TopOverlay outAt={44} top={250}>
      <GlassCard accent={ACCENT.red} enter={2} padding="34px 50px" radius={36}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 120,
              color: "#fff",
              textShadow: "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            $1000
          </div>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 80,
              color: ACCENT.red,
              opacity: arrow,
              transform: `translateX(${interpolate(arrow, [0, 1], [-20, 0])}px)`,
            }}
          >
            →
          </div>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 120,
              color: ACCENT.red,
              textShadow: `0 0 40px ${glow(ACCENT.red, 0.6)}`,
            }}
          >
            NOTHING
          </div>
        </div>
      </GlassCard>
    </TopOverlay>
  );
};

// ---------- 5. Shopify store, 0 visitors ----------
export const ShopifyZero: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <TopOverlay outAt={70} top={230}>
      <GlassCard accent={ACCENT.red} enter={2} padding={0} radius={34} style={{ width: 760 }}>
        {/* fake browser chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 26px",
            borderBottom: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <span style={{ width: 16, height: 16, borderRadius: 8, background: "#ff5f57" }} />
          <span style={{ width: 16, height: 16, borderRadius: 8, background: "#febc2e" }} />
          <span style={{ width: 16, height: 16, borderRadius: 8, background: "#28c840" }} />
          <div
            style={{
              marginLeft: 14,
              flex: 1,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "10px 20px",
              fontFamily: INTER,
              fontSize: 26,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            🔒 your-store.myshopify.com
          </div>
        </div>
        <div style={{ padding: "36px 40px 44px", textAlign: "center" }}>
          <Eyebrow accent={ACCENT.red}>6 months of work · visitors</Eyebrow>
          <div style={{ marginTop: 8 }}>
            <CountUp
              from={0}
              to={0}
              enter={6}
              duration={2}
              color={ACCENT.red}
              fontSize={200}
            />
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 34,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 2,
            }}
          >
            NOBODY CAME
          </div>
        </div>
      </GlassCard>
    </TopOverlay>
  );
};

// ---------- 6. $900 course, struck through ----------
export const CourseStrike: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [26, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <TopOverlay outAt={82} top={250}>
      <GlassCard accent={ACCENT.red} enter={2} padding="36px 60px" radius={36}>
        <div style={{ textAlign: "center" }}>
          <Eyebrow accent={ACCENT.red}>What they'd charge</Eyebrow>
          <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
            <div style={{ fontFamily: ANTON, fontSize: 190, color: "#fff", lineHeight: 1 }}>
              $900
            </div>
            <div
              style={{
                position: "absolute",
                top: "52%",
                left: "-4%",
                width: `${strike * 108}%`,
                height: 14,
                borderRadius: 8,
                background: ACCENT.red,
                boxShadow: `0 0 26px ${glow(ACCENT.red, 0.8)}`,
                transform: "rotate(-8deg)",
              }}
            />
          </div>
          <div style={{ marginTop: 6 }}>
            <span
              style={{
                fontFamily: ANTON,
                fontSize: 60,
                color: ACCENT.red,
                letterSpacing: 1,
              }}
            >
              NOTHING TO LEARN
            </span>
          </div>
        </div>
      </GlassCard>
    </TopOverlay>
  );
};

// ---------- Vending machine illustration ----------
const VendingMachine: React.FC<{ enter: number }> = ({ enter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - enter, fps, config: { damping: 14, mass: 1, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const balls = [
    "#FF4D5E", "#4DA3FF", "#4BE38A", "#FFC24B", "#B98CFF",
    "#FF8A4D", "#4DE0FF", "#FF4D5E", "#4BE38A", "#FFC24B",
    "#4DA3FF", "#FF8A4D",
  ];
  return (
    <div style={{ transform: `scale(${scale})`, opacity: op }}>
      {/* glass globe of gumballs */}
      <div
        style={{
          width: 340,
          height: 340,
          borderRadius: "50%",
          margin: "0 auto",
          background:
            "radial-gradient(120% 120% at 35% 25%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.02))",
          border: "3px solid rgba(255,255,255,0.4)",
          boxShadow: `inset 0 0 60px rgba(255,255,255,0.15), 0 0 70px ${glow(ACCENT.gold, 0.4)}`,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-end",
          justifyContent: "center",
          padding: 26,
          gap: 8,
          overflow: "hidden",
        }}
      >
        {balls.map((c, i) => {
          const bs = spring({
            frame: frame - enter - 8 - i * 2,
            fps,
            config: { damping: 9, mass: 0.5, stiffness: 200 },
          });
          return (
            <span
              key={i}
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: `radial-gradient(circle at 32% 28%, #fff8, ${c})`,
                transform: `translateY(${interpolate(bs, [0, 1], [-260, 0])}px)`,
                boxShadow: `0 0 16px ${glow(c, 0.6)}`,
              }}
            />
          );
        })}
      </div>
      {/* machine body */}
      <div
        style={{
          width: 300,
          margin: "-20px auto 0",
          background: "linear-gradient(180deg, rgba(255,194,75,0.9), rgba(200,140,40,0.85))",
          borderRadius: "26px 26px 30px 30px",
          padding: "40px 0 34px",
          textAlign: "center",
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${glow(ACCENT.gold, 0.3)}`,
          position: "relative",
        }}
      >
        {/* coin slot */}
        <div
          style={{
            width: 70,
            height: 12,
            borderRadius: 6,
            background: "#2a1e08",
            margin: "0 auto 26px",
          }}
        />
        {/* chute */}
        <div
          style={{
            width: 130,
            height: 90,
            borderRadius: 16,
            background: "rgba(0,0,0,0.35)",
            margin: "0 auto",
            border: "3px solid rgba(255,255,255,0.25)",
          }}
        />
      </div>
    </div>
  );
};

// ---------- 7. The machine reveal (full cutaway) ----------
export const MachineReveal: React.FC = () => {
  return (
    <Cutaway accent={ACCENT.gold} outAt={122}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Eyebrow accent={ACCENT.gold}>The business no guru sells</Eyebrow>
        <div style={{ height: 18 }} />
        <VendingMachine enter={10} />
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            marginTop: 44,
            flexWrap: "wrap",
          }}
        >
          <Pill accent={ACCENT.gold} enter={54}>
            💵 A FEW HUNDRED BUCKS
          </Pill>
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 18 }}>
          <Pill accent={ACCENT.white} enter={66}>
            🏬 MALL
          </Pill>
          <Pill accent={ACCENT.white} enter={74}>
            🎳 BOWLING ALLEY
          </Pill>
        </div>
      </div>
    </Cutaway>
  );
};

// ---------- 8. Quarters + weekly pickup ----------
export const Quarters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coins = new Array(6).fill(0);
  return (
    <TopOverlay outAt={94} top={210}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 26 }}>
          {coins.map((_, i) => {
            const cs = spring({
              frame: frame - 6 - i * 4,
              fps,
              config: { damping: 8, mass: 0.5, stiffness: 190 },
            });
            const y = interpolate(cs, [0, 1], [-200, 0]);
            const op = interpolate(cs, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 34% 30%, #fff5cf, #d9a63a 60%, #a97b1e)",
                  border: "3px solid #ffe9a8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: ANTON,
                  fontSize: 42,
                  color: "#5a3c0a",
                  transform: `translateY(${y}px)`,
                  opacity: op,
                  boxShadow: `0 0 26px ${glow(ACCENT.gold, 0.5)}`,
                }}
              >
                25¢
              </div>
            );
          })}
        </div>
        <Pill accent={ACCENT.gold} enter={40} style={{ fontSize: 40 }}>
          🗓️ EMPTY IT ONCE A WEEK
        </Pill>
      </div>
    </TopOverlay>
  );
};

// ---------- 9. FREE stamp ----------
export const FreeStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 9, mass: 0.6, stiffness: 160 } });
  const rot = interpolate(s, [0, 1], [-24, -12]);
  const sc = interpolate(s, [0, 1], [1.8, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  return (
    <TopOverlay outAt={104} top={260}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            transform: `rotate(${rot}deg) scale(${sc})`,
            opacity: op,
            border: `8px solid ${ACCENT.gold}`,
            borderRadius: 24,
            padding: "18px 54px",
            color: ACCENT.gold,
            fontFamily: ANTON,
            fontSize: 160,
            letterSpacing: 6,
            textShadow: `0 0 40px ${glow(ACCENT.gold, 0.6)}`,
            boxShadow: `0 0 50px ${glow(ACCENT.gold, 0.4)}, inset 0 0 30px ${glow(ACCENT.gold, 0.25)}`,
          }}
        >
          FREE
        </div>
        <div style={{ marginTop: 26 }}>
          <Pill accent={ACCENT.white} enter={24} style={{ fontSize: 36 }}>
            LESS THAN ONE GURU COURSE
          </Pill>
        </div>
      </div>
    </TopOverlay>
  );
};

// ---------- 10. End CTA (full cutaway) ----------
export const EndCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounce = Math.sin(frame / 6) * 12;
  const arrowS = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  return (
    <Cutaway accent={ACCENT.gold} outAt={168}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Eyebrow accent={ACCENT.gold}>The side hustle they don't talk about</Eyebrow>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 150,
            color: "#fff",
            lineHeight: 0.95,
            margin: "24px 0 10px",
            textShadow: `0 0 60px ${glow(ACCENT.gold, 0.5)}`,
          }}
        >
          LINK IN BIO
        </div>
        <div
          style={{
            fontSize: 120,
            transform: `translateY(${bounce}px) scale(${interpolate(arrowS, [0, 1], [0, 1])})`,
            opacity: interpolate(arrowS, [0, 1], [0, 1]),
          }}
        >
          👆
        </div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
          <Pill accent={ACCENT.green} enter={40} style={{ fontSize: 40 }}>
            🧒 EVEN A KID GETS IT
          </Pill>
        </div>
        <GlassCard
          accent={ACCENT.gold}
          enter={54}
          padding="24px 44px"
          radius={28}
          style={{ marginTop: 30, display: "inline-block" }}
        >
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "#fff" }}>
            Buy machine · Place it · Collect 💰
          </span>
        </GlassCard>
      </div>
    </Cutaway>
  );
};
