// Light "Liquid Glass" theme for the AI clip.
export const AI_FRAMES = 645; // 21.5s @ 30fps

export const ACCENT = {
  ink: "#0B0E17", // primary dark text on light
  blue: "#2F7BFF",
  red: "#FF3B4E",
  gold: "#E0A020",
  green: "#12B76A",
} as const;

export const glow = (hex: string, a: number) => {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};
