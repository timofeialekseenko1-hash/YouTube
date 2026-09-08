import { sec } from "./theme";

export type Caption = {
  text: string;
  start: number; // frames
  end: number; // frames
  accent?: string;
};

// Timings are on the concatenated 45s timeline (part1 then part2), @30fps.
const raw: { t: string; a: number; b: number }[] = [
  { t: "I'm so tired of side hustle gurus.", a: 0.0, b: 1.58 },
  { t: "Every single one is selling the same three things.", a: 2.04, b: 4.4 },
  { t: "Dropshipping. AI products. Passive income automation.", a: 4.58, b: 7.58 },
  { t: "And it's always the same pitch.", a: 7.98, b: 9.4 },
  { t: "\"I made $200K — I'll show you how.\"", a: 9.6, b: 11.56 },
  { t: "You pay $1000 to learn nothing.", a: 11.9, b: 13.68 },
  { t: "Six months building a Shopify store nobody visits.", a: 14.02, b: 16.9 },
  { t: "The only person who made money was the guru.", a: 16.9, b: 19.5 },
  { t: "Meanwhile there's a business so old and simple", a: 19.8, b: 21.88 },
  { t: "no guru can sell you a $900 course about it —", a: 21.88, b: 25.14 },
  { t: "because there's nothing to learn.", a: 25.14, b: 26.7 },
  { t: "You buy a machine for a few hundred bucks.", a: 26.94, b: 28.74 },
  { t: "Put it in a corner of a mall, a bowling alley.", a: 28.74, b: 31.16 },
  { t: "Kids feed it quarters.", a: 31.52, b: 32.5 },
  { t: "Come back once a week to empty the money.", a: 32.58, b: 34.18 },
  { t: "And that's the whole course.", a: 34.18, b: 35.16 },
  { t: "I just gave it to you for free.", a: 35.54, b: 36.82 },
  { t: "Everything you need for less than one guru course.", a: 37.18, b: 39.24 },
  { t: "The bio has the link.", a: 39.8, b: 40.82 },
  { t: "Go start the side hustle they don't talk about", a: 41.22, b: 43.08 },
  { t: "because even a kid can understand it.", a: 43.08, b: 45.08 },
];

export const CAPTIONS: Caption[] = raw.map((r) => ({
  text: r.t,
  start: sec(r.a),
  end: sec(r.b),
}));
