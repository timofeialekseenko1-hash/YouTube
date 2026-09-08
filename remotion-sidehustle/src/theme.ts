// Design tokens for the "Liquid Glass" GFX system.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Concatenation boundary: part 1 = 771 frames, part 2 = 589 frames.
export const PART1_FRAMES = 771;
export const PART2_FRAMES = 589;
export const TOTAL_FRAMES = PART1_FRAMES + PART2_FRAMES; // 1360

export const ACCENT = {
  white: "#F4F7FF",
  blue: "#4DA3FF",
  red: "#FF4D5E",
  gold: "#FFC24B",
  green: "#4BE38A",
} as const;

export type AccentKey = keyof typeof ACCENT;

// Glow-hex helper: turn an accent into a soft rgba glow.
export const glow = (hex: string, a: number) => {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const sec = (s: number) => Math.round(s * FPS);

export const FONT_STACK_BODY =
  '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
