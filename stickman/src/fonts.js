import { staticFile } from 'remotion';

// Hand-drawn fonts, loaded from public/fonts at render time (fully offline).
export const MARKER = 'Permanent Marker';   // chunky title text
export const HAND = 'Patrick Hand';         // lighter hand-print labels

export const fontFaceCss = `
@font-face {
  font-family: '${MARKER}';
  src: url('${staticFile('fonts/PermanentMarker.ttf')}') format('truetype');
  font-weight: 400; font-style: normal;
}
@font-face {
  font-family: '${HAND}';
  src: url('${staticFile('fonts/PatrickHand.ttf')}') format('truetype');
  font-weight: 400; font-style: normal;
}
`;
