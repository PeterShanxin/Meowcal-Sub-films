import score from "../music/morph-score.json";

// Picture and score share these times. scripts/score.mjs refuses to render
// when a cue has no musical onset, so moving one means rewriting the music too.
export const cue = score.cues;

// Downbeats that the whole frame answers with a short push and a glow.
export const accents: [number, number][] = [
  [cue.window, 1],
  [cue.chinese, 0.55],
  [cue.brand, 0.45],
  [cue.video, 0.7],
  [cue.cat, 0.9],
  [cue.mark, 1],
  [cue.name[0], 0.6],
  [cue.bling, 0.8],
  [cue.final, 0.7],
];
