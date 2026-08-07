# CHANNEL STYLE — "Cinematic Americana" (semi-realistic matte painting)

Replaces the Mixed-Media paper-collage style for new videos (going forward).
Locked from user reference frames + approved style tests
(faf4e245-200c-49cd-8edf-5830e17e2012 = pickup, d82d7f70-8baf-4508-8456-7a4e2090be00 = dustbowl farmhouse).
Consistency comes from the RECIPE PREFIX below — no style-reference image required (recipe alone reproduces the look).

## STYLE PREFIX (prepend to every still prompt, verbatim)
Cinematic semi-realistic digital matte painting, nostalgic Americana. Warm, muted, slightly desaturated palette — dusty earth tones, faded reds, soft washed blues. Soft diffused hazy natural daylight, gentle atmospheric haze and depth, fine film grain and a subtle painted-canvas texture. Painterly but detailed brushwork; the mood of a faded vintage photograph. Wide cinematic composition. Not glossy CGI, not sharp modern photography, not cartoon, not collage.
SCENE: <describe the shot>.

## CONTENT POLICY (per user 2026-08-02): FACES + PERIOD BRANDS ALLOWED
- People: realistic, era-appropriate, FICTIONAL. Never a real identifiable celebrity/public figure or their likeness. (Business-story protagonists → composite/"a founder-type figure", not a named real person's face.)
- Brands / signage / vehicles: period-accurate brands & logos allowed. Avoid fabricating a real living company's confidential/defamatory imagery.
- Still avoid: gibberish/artifact text, watermarks, oversaturation, plastic 3D-render look, heavy lens-flare gloss.

## NEGATIVE (append when needed)
no watermark, no gibberish text, no oversaturation, no plastic 3D render, no modern out-of-period elements, no real-celebrity likeness.

## PRODUCTION
- Stills: nano_banana_pro, 16:9, resolution 2k.
- Motion (UPDATED 2026-08-07 per user): push-ins alone are TOO STATIC. Every animated scene must have visible movement to hold the viewer. Push-in is a baseline to combine with, never the whole shot.
  MOTION PALETTE — pick 1 camera move + 1+ ambient/subject motion per animated shot:
   * Camera (beyond push-in): lateral dolly/truck (track past foreground), crane up/down, tilt, slow orbit/arc around a subject, pull-out reveal, parallax dolly (foreground vs background at different speeds), gentle handheld drift.
   * Ambient/environmental (SAFE, use liberally): drifting dust & haze, smoke/steam/exhaust, blowing fabric/flags/curtains, falling leaves/snow/rain, rippling water/reflections, flickering light, sun breaking through, passing cars, headlights, birds, embers, crowd shuffle.
   * Subject motion: people walking, hands working, turning to look, a figure crossing the foreground. Adds life + parallax.
  REALISM GUARDRAILS (still true — manage, don't avoid, motion): lean on camera + ambient motion for energy since they never morph faces. Reserve larger BODY motion for figures at mid/wide distance or seen from behind/side; avoid big motion on tight face close-ups (uncanny + moderation risk). Keep prompt tail "photographic, no morphing, no warping, faces preserved."
   * For a hero/high-energy shot that needs dynamic subject motion at quality, prefer seedance (1080p, handles motion better) over kling turbo.
  SYNERGY w/ hybrid style: since ~2/3 of scenes are held stills now, the animated 1/3 carry all the energy — make them the MOST kinetic shots (a real camera move + layered ambient motion), not gentle push-ins.
- Assembly: explainer_video 1920x1080. Voice: **Harrison (573e5163-59b3-4926-aab1-951ef2985f81)** at NORMAL rate (omit speech_rate) — locked as the Bozz Lab default. Segment narration into ~24-word blocks.
- SMOOTHNESS / no-gaps rule (important): each block is a fixed 10s window. A take much SHORTER than 10s gets silence-padded = the "long pause / gap" the user dislikes; a take up to ~12.5s only gets a gentle pitch-safe speed-up (fine). So after voicing, AUDIT every take's durationSec and normalize into ~8.7–12.7s:
  - Short takes (<~9s): re-voice with NEGATIVE speech_rate to fill the window (~-15 ≈ +1s, -20 ≈ +1.5s, -30 ≈ big stretch). Harrison reads fast, so short blocks are common — expect to fix several.
  - Very long takes (>~13s): re-voice with speech_rate 30 to avoid a rushed sped-up sound. Mildly long (11–12.5s) is fine, leave it.
  - TTS duration varies per re-roll (esp. number/date/em-dash lines) — verify after each re-voice.
- 62-item assembler quirk workaround: if a full assembly drops a block, render in two halves and join. (24-item assemblies have been reliable.)

## APPROVED STYLE-TEST FRAMES (references)
- Pickup / high-desert: faf4e245-200c-49cd-8edf-5830e17e2012
- Dust Bowl farmhouse: d82d7f70-8baf-4508-8456-7a4e2090be00
