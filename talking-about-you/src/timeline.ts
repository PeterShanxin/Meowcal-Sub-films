// Every cue in frames. audio/score.py reads the same timeline.json.
import cues from "./timeline.json";

export const FPS = cues.fps;
export const W = 1080;
export const H = 1920;
export const T = cues;

export interface Line {
  lang: string;
  source: string;
  translation: string;
  // When its translation lands in the plate, on the second pass.
  plate: number;
}

export const LINES: readonly Line[] = cues.lines.map((line, i) => ({ ...line, plate: cues.pass2.plates[i] }));

// The strip of five films slides under a fixed frame. `camera` is the film
// index in view: 0..4 once quickly, back to 0, then again with the box drawn.
const KEYS: [number, number][] = [[0, 0]];
for (let i = 1; i < LINES.length; i++) KEYS.push([cues.pass1.step * i - cues.slide, i - 1], [cues.pass1.step * i, i]);
KEYS.push([cues.rewind.start, LINES.length - 1], [cues.rewind.end, 0]);
for (let i = 1; i < LINES.length; i++) KEYS.push([cues.pass2.cuts[i] - cues.slide, i - 1], [cues.pass2.cuts[i], i]);

export function camera(f: number): number {
  for (let k = KEYS.length - 1; k >= 0; k--) {
    if (f < KEYS[k][0]) continue;
    const next = KEYS[k + 1];
    if (!next || next[1] === KEYS[k][1]) return KEYS[k][1];
    const p = (f - KEYS[k][0]) / (next[0] - KEYS[k][0]);
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    return KEYS[k][1] + (next[1] - KEYS[k][1]) * eased;
  }
  return 0;
}

// The capture box sits where a subtitle sits; the plate hangs directly below
// it at the same width, as the app places its overlay.
export const BOX = { x: 44, y: 990, w: 992, h: 156 };
export const PLATE = { x: BOX.x, y: BOX.y + BOX.h + 18, w: BOX.w, h: 164 };

// docs/assets/mark.svg in the app repository, in its 128-unit space: the
// source-subtitle card in front, the translation card behind it.
const MARK_SCALE = 4.2;
const MARK_ORIGIN = { x: W / 2 - 64 * MARK_SCALE, y: 740 - 62 * MARK_SCALE };
export const MARK = {
  scale: MARK_SCALE,
  front: { x: MARK_ORIGIN.x + 22 * MARK_SCALE, y: MARK_ORIGIN.y + 30 * MARK_SCALE, w: 72 * MARK_SCALE, h: 50 * MARK_SCALE },
  back: { x: MARK_ORIGIN.x + 42 * MARK_SCALE, y: MARK_ORIGIN.y + 46 * MARK_SCALE, w: 64 * MARK_SCALE, h: 48 * MARK_SCALE },
  bottom: MARK_ORIGIN.y + 94 * MARK_SCALE,
};
