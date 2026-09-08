import { continueRender, delayRender, staticFile } from "remotion";

// Self-hosted fonts (no network fetch at render time — the headless browser
// cannot verify the egress proxy's TLS cert for fonts.gstatic.com).
export const ANTON = "Anton";
export const INTER = "Inter";

let injected = false;

export const loadFonts = () => {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const css = `
    @font-face {
      font-family: "Anton";
      font-style: normal;
      font-weight: 400;
      font-display: block;
      src: url(${staticFile("fonts/Anton.woff2")}) format("woff2");
    }
    @font-face {
      font-family: "Inter";
      font-style: normal;
      font-weight: 100 900;
      font-display: block;
      src: url(${staticFile("fonts/Inter.woff2")}) format("woff2");
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const handle = delayRender("Loading self-hosted fonts");
  Promise.all([
    (document as unknown as { fonts: FontFaceSet }).fonts.load('400 40px "Anton"'),
    (document as unknown as { fonts: FontFaceSet }).fonts.load('800 40px "Inter"'),
  ])
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

loadFonts();
