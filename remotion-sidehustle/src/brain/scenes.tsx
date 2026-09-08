import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Aisle } from "./Aisle";
import { Chip, FloatImg, KenBurns, KineticLine } from "./bits";
import { ANTON, INTER } from "../fonts";
import { ACCENT, glow } from "../ai/theme";

// ---------- 1. Aisle hook ----------
export const AisleHook: React.FC<{ dur: number }> = ({ dur }) => (
  <AbsoluteFill>
    <Aisle dur={dur} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 150 }}>
      <Chip accent={ACCENT.ink} enter={0} solid>
        🧠 QUICK TEST
      </Chip>
    </AbsoluteFill>
    <KineticLine
      words={[
        { w: "REMEMBER", t: 0.78 },
        { w: "THE", t: 1.0 },
        { w: "LAST", t: 1.26 },
        { w: "STORE", t: 1.48, acc: ACCENT.blue },
        { w: "YOU", t: 1.72 },
        { w: "WENT", t: 1.88 },
        { w: "TO?", t: 2.04 },
      ]}
      size={96}
      bottom={360}
      maxWidth={820}
    />
  </AbsoluteFill>
);

// ---------- 2. You can't ----------
export const YouCant: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const gray = interpolate(f, [0, 10], [0.2, 1], { extrapolateRight: "clamp" });
  const s = spring({ frame: f - 2, fps: 30, config: { damping: 10, stiffness: 140 } });
  const sc = interpolate(s, [0, 1], [1.5, 1]);
  return (
    <AbsoluteFill>
      <Aisle dur={dur + 40} gray={gray} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 190,
            color: ACCENT.ink,
            transform: `scale(${sc})`,
            textShadow: "0 10px 30px rgba(20,30,60,0.25)",
          }}
        >
          YOU CAN'T.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 3. Gray shelves / same sections ----------
export const GrayShelves: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pan = (f * 5) % 300;
  return (
    <AbsoluteFill>
      <Aisle dur={dur + 60} gray={1} />
      {/* identical repeating labels sliding — monotony */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
        <div style={{ display: "flex", gap: 40, transform: `translateX(${-pan}px)` }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 150,
                height: 90,
                borderRadius: 14,
                background: "rgba(120,125,135,0.35)",
                border: "2px solid rgba(90,95,105,0.4)",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
      <KineticLine
        words={[
          { w: "GRAY", t: 0.05 },
          { w: "SHELVES.", t: 0.12 },
          { w: "SAME", t: 0.82 },
          { w: "SECTIONS.", t: 0.95 },
        ]}
        size={104}
        bottom={380}
        color="#4a4f5a"
      />
    </AbsoluteFill>
  );
};

// small gray box that flies toward the brain and vanishes
const SuckBox: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const period = 40;
  const local = (f + i * 7) % period;
  const p = local / period;
  const ang = (i / 8) * Math.PI * 2;
  const r = interpolate(p, [0, 1], [620, 40]);
  const x = Math.cos(ang) * r;
  const y = Math.sin(ang) * r * 0.7;
  const op = interpolate(p, [0, 0.15, 0.8, 1], [0, 0.9, 0.9, 0]);
  const sc = interpolate(p, [0, 1], [1, 0.2]);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "44%",
        width: 64,
        height: 44,
        marginLeft: -32,
        marginTop: -22,
        transform: `translate(${x}px, ${y}px) scale(${sc})`,
        borderRadius: 10,
        background: "rgba(150,155,165,0.7)",
        border: "2px solid rgba(110,115,125,0.7)",
        opacity: op,
      }}
    />
  );
};

// ---------- 4. Brain deletes boring stuff ----------
export const BrainDelete: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 10) * 0.02;
  const s = spring({ frame: f, fps: 30, config: { damping: 14, mass: 1, stiffness: 120 } });
  const rise = interpolate(s, [0, 1], [80, 0]);
  const op = interpolate(s, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", transform: `translateY(${rise}px) scale(${pulse})`, opacity: op }}>
        <Img
          src={staticFile("img/brain.webp")}
          style={{ width: 720, borderRadius: 24, filter: "drop-shadow(0 30px 60px rgba(20,30,60,0.3))" }}
        />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <SuckBox key={i} i={i} />
      ))}
      <KineticLine
        words={[
          { w: "YOUR", t: 0.33 },
          { w: "BRAIN", t: 0.45 },
          { w: "DELETES", t: 0.71, acc: ACCENT.red },
          { w: "BORING", t: 1.19 },
          { w: "STUFF", t: 1.41 },
        ]}
        size={92}
        bottom={300}
      />
    </AbsoluteFill>
  );
};

// ---------- 5. Habituation term ----------
export const Habituation: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 10) * 0.02;
  const s = spring({ frame: f - 12, fps: 30, config: { damping: 13, stiffness: 150 } });
  const sc = interpolate(s, [0, 1], [0.7, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Img
        src={staticFile("img/brain.webp")}
        style={{ position: "absolute", width: 640, opacity: 0.9, transform: `scale(${pulse})`, filter: "drop-shadow(0 30px 60px rgba(20,30,60,0.25))" }}
      />
      <div
        style={{
          transform: `translateY(120px) scale(${sc})`,
          opacity: op,
          background: "rgba(255,255,255,0.86)",
          border: `2px solid ${glow(ACCENT.blue, 0.5)}`,
          borderRadius: 30,
          padding: "26px 54px",
          textAlign: "center",
          boxShadow: `0 24px 60px rgba(20,30,60,0.18), 0 0 44px ${glow(ACCENT.blue, 0.2)}`,
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ fontFamily: INTER, fontWeight: 800, letterSpacing: 6, fontSize: 26, color: ACCENT.blue }}>
          IT'S CALLED
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 110, color: ACCENT.ink, lineHeight: 1 }}>
          HABITUATION
        </div>
      </div>
    </AbsoluteFill>
  );
};

// conveyor box stamped IRRELEVANT that slides right and drops into the bin
const ConveyorBox: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const f = useCurrentFrame();
  const gap = 34;
  const start = i * gap;
  const local = f - start;
  if (local < 0) return null;
  const travel = 70; // frames to reach bin
  const p = Math.min(local / travel, 1.3);
  const x = interpolate(p, [0, 1], [-560, 320], { extrapolateRight: "clamp" });
  const drop = p > 1 ? (p - 1) * 700 : 0;
  const op = p > 1.25 ? 0 : 1;
  const rot = p > 1 ? (p - 1) * 90 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "42%",
        transform: `translate(${x}px, ${drop}px) rotate(${rot}deg)`,
        opacity: op,
      }}
    >
      <div
        style={{
          width: 150,
          height: 100,
          borderRadius: 14,
          background: "rgba(150,155,165,0.85)",
          border: "2px solid rgba(110,115,125,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: ANTON, fontSize: 22, color: ACCENT.red, transform: "rotate(-8deg)", letterSpacing: 1 }}>
          IRRELEVANT
        </span>
      </div>
    </div>
  );
};

// ---------- 6. Irrelevant -> trash ----------
export const Irrelevant: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const lid = Math.abs(Math.sin(f / 8)) * 16;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* brain top-left, quietly present */}
      <Img
        src={staticFile("img/brain.webp")}
        style={{ position: "absolute", width: 360, left: 60, top: 190, opacity: 0.5, filter: "grayscale(0.2) drop-shadow(0 20px 40px rgba(20,30,60,0.2))" }}
      />
      {/* conveyor line */}
      <div style={{ position: "absolute", top: "48%", left: 0, right: 0, height: 6, background: "rgba(120,125,135,0.25)" }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <ConveyorBox key={i} i={i} dur={dur} />
      ))}
      {/* trash bin bottom-right */}
      <div style={{ position: "absolute", right: 120, top: "46%" }}>
        <div style={{ width: 150, height: 20, background: "#8a9099", borderRadius: 8, transform: `translateY(-${lid}px) rotate(-6deg)`, transformOrigin: "left" }} />
        <div style={{ width: 170, height: 190, marginTop: 6, borderRadius: "12px 12px 20px 20px", background: "linear-gradient(180deg,#9aa0a9,#7d838c)", border: "3px solid #6c727b" }} />
      </div>
      <KineticLine
        words={[
          { w: "NOTHING", t: 0.2 },
          { w: "NEW?", t: 0.7 },
          { w: "MARKED", t: 1.7 },
          { w: "IRRELEVANT", t: 2.18, acc: ACCENT.red },
          { w: "&", t: 3.0 },
          { w: "TRASHED.", t: 3.28, acc: ACCENT.red },
        ]}
        size={82}
        bottom={280}
        maxWidth={900}
      />
    </AbsoluteFill>
  );
};

// ---------- 7. Store reveal ----------
export const StoreReveal: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ringP = interpolate(f, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringPulse = 1 + Math.sin(f / 8) * 0.05;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <KenBurns src="img/store.webp" dur={dur} from={1.02} to={1.35} focusX={52} focusY={58} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      {/* highlight ring around the machine */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          width: 360,
          height: 360,
          marginLeft: -180,
          marginTop: -180,
          borderRadius: "50%",
          border: `6px solid ${ACCENT.gold}`,
          boxShadow: `0 0 40px ${glow(ACCENT.gold, 0.7)}, inset 0 0 40px ${glow(ACCENT.gold, 0.4)}`,
          opacity: ringP * 0.9,
          transform: `scale(${ringPulse})`,
        }}
      />
      <KineticLine
        words={[
          { w: "WHERE", t: 0.7 },
          { w: "WAS", t: 1.1 },
          { w: "THE", t: 1.3 },
          { w: "GUMBALL", t: 1.5, acc: ACCENT.gold },
          { w: "MACHINE?", t: 1.9, acc: ACCENT.gold },
        ]}
        size={96}
        top={170}
        maxWidth={840}
        color="#fff"
      />
    </AbsoluteFill>
  );
};

// ---------- 8. Exact spot ----------
export const ExactSpot: React.FC = () => {
  const f = useCurrentFrame();
  const pinS = spring({ frame: f - 6, fps: 30, config: { damping: 9, stiffness: 160 } });
  const pinY = interpolate(pinS, [0, 1], [-620, -400]);
  const pinOp = interpolate(pinS, [0, 1], [0, 1]);
  const bob = Math.sin(f / 24) * 8;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* white ground so the product photo's white background reads as cut-out */}
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 42%, #ffffff 0%, #ffffff 55%, #f2f4f8 100%)" }} />
      <Img
        src={staticFile("img/machine_red.png")}
        style={{ height: 1020, width: "auto", transform: `translateY(${bob}px)`, filter: "drop-shadow(0 30px 55px rgba(20,30,60,0.3))" }}
      />
      {/* map pin dropping onto it */}
      <div style={{ position: "absolute", top: "50%", transform: `translateY(${pinY}px)`, opacity: pinOp, fontSize: 120 }}>📍</div>
      <div style={{ position: "absolute", bottom: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Chip accent={ACCENT.gold} enter={0} solid style={{ fontSize: 40 }}>
          THE EXACT SPOT
        </Chip>
        <div style={{ display: "flex", gap: 16 }}>
          <Chip accent={ACCENT.ink} enter={sec(1.4)} solid>
            INSTANTLY
          </Chip>
          <Chip accent={ACCENT.red} enter={sec(2.2)} solid>
            DECADES LATER
          </Chip>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9. Why ----------
export const Why: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: 30, config: { damping: 9, stiffness: 200 } });
  const sc = interpolate(s, [0, 1], [0.3, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: ANTON, fontSize: 340, color: ACCENT.ink, transform: `scale(${sc})`, textShadow: `0 0 50px ${glow(ACCENT.gold, 0.3)}` }}>
        WHY?
      </div>
    </AbsoluteFill>
  );
};

// heart that beats
const Heart: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const f = useCurrentFrame();
  const beat = 1 + Math.max(0, Math.sin(f / 6)) * 0.12;
  return (
    <div style={{ transform: `scale(${beat})`, filter: `drop-shadow(0 0 30px ${glow(color, 0.6)})` }}>
      <svg width={size} height={size} viewBox="0 0 32 29">
        <path
          d="M16 29S1 18.5 1 8.5C1 3.8 4.8 1 8.5 1 12 1 14.5 3 16 5.5 17.5 3 20 1 23.5 1 27.2 1 31 3.8 31 8.5 31 18.5 16 29 16 29z"
          fill={color}
        />
      </svg>
    </div>
  );
};

// ---------- 10. Places vs Emotions ----------
export const PlacesEmotions: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [sec(1.0), sec(1.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const placesOp = interpolate(f, [sec(1.6), sec(2.4)], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emoS = spring({ frame: f - sec(1.6), fps: 30, config: { damping: 12, stiffness: 130 } });
  const emoSc = interpolate(emoS, [0, 1], [0.6, 1]);
  const emoOp = interpolate(emoS, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* PLACES — grey pin, gets crossed out and fades */}
      <div style={{ position: "absolute", top: 520, textAlign: "center", opacity: placesOp }}>
        <div style={{ fontSize: 130 }}>📍</div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <span style={{ fontFamily: ANTON, fontSize: 90, color: "#8a9099" }}>PLACES</span>
          <div style={{ position: "absolute", top: "52%", left: "-6%", width: `${strike * 112}%`, height: 10, background: ACCENT.red, borderRadius: 6, transform: "rotate(-6deg)" }} />
        </div>
      </div>
      {/* EMOTIONS — gold heart, pulsing */}
      <div style={{ position: "absolute", top: 980, textAlign: "center", transform: `scale(${emoSc})`, opacity: emoOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Heart size={150} color={ACCENT.gold} />
        <span style={{ fontFamily: ANTON, fontSize: 120, color: ACCENT.gold, textShadow: `0 0 40px ${glow(ACCENT.gold, 0.35)}` }}>EMOTIONS</span>
      </div>
      <KineticLine
        words={[
          { w: "IT", t: 0.0 },
          { w: "DOESN'T", t: 0.5 },
          { w: "SAVE", t: 0.85 },
          { w: "PLACES", t: 1.02, acc: "#8a9099" },
          { w: "—", t: 1.5 },
          { w: "IT", t: 1.58 },
          { w: "SAVES", t: 1.72 },
          { w: "EMOTIONS", t: 2.02, acc: ACCENT.gold },
        ]}
        size={72}
        top={150}
        maxWidth={920}
      />
    </AbsoluteFill>
  );
};

// gumball that drops out of the machine into a pile
const DropBall: React.FC<{ i: number; color: string }> = ({ i, color }) => {
  const f = useCurrentFrame();
  const start = sec(0.4) + i * 8;
  const local = f - start;
  if (local < 0) return null;
  const p = Math.min(local / 26, 1);
  const y = interpolate(p, [0, 1], [-40, 250 + i * 4]);
  const x = (i - 1) * 44 + Math.sin(i) * 6;
  const squash = p > 0.9 ? 1.15 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "60%",
        width: 60,
        height: 60,
        marginLeft: -30,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, #fff, ${color})`,
        transform: `translate(${x}px, ${y}px) scaleY(${1 / squash}) scaleX(${squash})`,
        boxShadow: `0 6px 16px ${glow(color, 0.5)}`,
      }}
    />
  );
};

// ---------- 11. Surprise payoff ----------
export const Surprise: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 24) * 8;
  const burst = interpolate(f, [sec(0.6), sec(1.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const colors = ["#FF3B4E", "#2F7BFF", "#12B76A", "#E0A020"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* white ground so the product photo's white background reads as cut-out */}
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 46%, #ffffff 0%, #ffffff 55%, #f2f4f8 100%)" }} />
      <FloatImg src="img/machine_blue.png" enter={0} height={1040} bob={6} />
      {colors.map((c, i) => (
        <DropBall key={i} i={i} color={c} />
      ))}
      {/* sparkle burst */}
      <div style={{ position: "absolute", top: "26%", fontSize: 90, opacity: burst, transform: `scale(${0.6 + burst * 0.6})` }}>✨</div>
      {/* headline up top, clear of the machine */}
      <div style={{ position: "absolute", top: 150, textAlign: "center" }}>
        <div style={{ fontFamily: ANTON, fontSize: 72, color: ACCENT.ink, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
          NOTHING STICKS LIKE
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 210, display: "flex", justifyContent: "center" }}>
        <Chip accent={ACCENT.gold} enter={sec(0.7)} solid style={{ fontSize: 52, padding: "22px 46px" }}>
          THE MEMORY OF A SURPRISE
        </Chip>
      </div>
    </AbsoluteFill>
  );
};

// local seconds->frames helper (kept last so it hoists for the components above)
function sec(s: number) {
  return Math.round(s * 30);
}
