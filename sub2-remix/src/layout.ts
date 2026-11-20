import { cue, FIRST, glide, LINES, plateAt, sfx } from "./clock";
import { measure, type Rect } from "./theme";

// Every position in the film, in 1080 × 1920 px. Xiaohongshu covers the top
// ~170 px and the bottom ~250 px, and its buttons sit at the lower right, so
// text stays inside x 80–1000 and y 190–1600.

export const HEAD_Y = 322; // centre of the headline

// The film is a cinema window in the middle of the frame: the source is 2.4:1,
// cropped to 1.8:1 so the faces stay big, and the portrait frame around it is
// the film's own light, blurred.
export const WINDOW = { y: 640, h: 600 };
// The scream plays in the cinema window; on Red's entry the window snaps open
// to a tall 4:5 for the cold open, and on its last beat folds back down onto Sintel.
export const TALL = { h: 1350 };
export const windowRect = (t: number) => {
  // Opens through the cut: it starts moving in the silence and is fastest on the hit.
  const h = t < cue.sintel - 0.48 ? glide(t, [cue.zoom, cue.cuts.rider + 0.3], [WINDOW.h, TALL.h]) : glide(t, [cue.sintel - 0.48, cue.sintel], [TALL.h, WINDOW.h]);
  return { y: WINDOW.y + WINDOW.h / 2 - h / 2, h };
};

// The film's burned-in subtitle (anchored at the window's foot; up to two
// lines, as in the file) and Meowcal's plate under the window.
export const EN = { bottom: 1196, size: 40, lineH: 50, weight: 600 };
export const enLines = (en: string) => en.split("\n");
export const PLATE = { top: 1262, size: 48, weight: 500, padX: 38, padTop: 34, padBottom: 24, radius: 30 };
export const PLATE_TEXT_Y = PLATE.top + PLATE.padTop + (PLATE.size * 1.28) / 2;
/** The empty slot for a second subtitle, which becomes the mark. */
export const SLOT: Rect = { x: 290, y: PLATE.top, w: 500, h: PLATE.padTop + PLATE.size * 1.28 + PLATE.padBottom, r: PLATE.radius };

/** The capture box hugs the burned-in lines with even padding. */
export const captureBox = (): Rect => {
  const lines = enLines(LINES[FIRST].en);
  const width = Math.max(...lines.map((line) => measure(line, EN.size, EN.weight)));
  const padX = 46;
  const padY = 26;
  const height = lines.length * EN.lineH;
  return { x: 540 - width / 2 - padX, y: EN.bottom - height - padY, w: width + padX * 2, h: height + padY * 2, r: 28 };
};

// ── The glass object that carries the film ────────────────────────────────
export const TILE: Rect = { x: 380, y: 560, w: 320, h: 320, r: 65 };

export const PAL = { x: 90, y: 520, w: 900, search: 132, tabs: 96, title: 214, row: 128, foot: 150, r: 36 };
const pal = (h: number): Rect => ({ x: PAL.x, y: PAL.y, w: PAL.w, h, r: PAL.r });
export const PAL_SEARCH = pal(PAL.search);
export const PAL_TITLES = pal(PAL.search + PAL.tabs + PAL.title);
export const PAL_SOURCE = pal(PAL.search + PAL.tabs + PAL.row * 3 + 20);
export const PAL_TARGET = pal(PAL.search + PAL.tabs + PAL.row * 3 + PAL.foot);
export const LIST_Y = PAL.search + PAL.tabs; // rows start here, inside the palette
export const START: Rect = { x: PAL.x + PAL.w - 40 - 480, y: PAL.y + LIST_Y + PAL.row * 3 + 29, w: 480, h: 92, r: 20 };

export const TOOLBAR_H = 96;
export const toolbar = (): Rect => {
  const box = captureBox();
  return { x: 540 - 320, y: box.y - 28 - TOOLBAR_H, w: 640, h: TOOLBAR_H, r: 28 };
};
export const TRACK: Rect = { x: 90, y: 430, w: 900, h: 640, r: 40 };
export const ROW_H = 140;
export const TRACK_TEXT_X = 200; // text column inside the track
/** The plate as drawn at time `t`: the file folds into it, and the mark rises out of it. */
export const plateRect = (t: number): Rect => {
  const now = plateAt(t);
  const text = now ? measure(LINES[now.index].zh, PLATE.size, PLATE.weight) : SLOT.w - PLATE.padX * 2;
  const w = text + PLATE.padX * 2;
  return { x: 540 - w / 2, y: PLATE.top, w, h: SLOT.h, r: PLATE.radius };
};
export const LOGO: Rect = { x: 350, y: 520, w: 380, h: 380, r: 77 };

const keyed = (t: number, keys: [number, Rect][]): Rect => {
  const times = keys.map(([time]) => time);
  const value = (pick: (rect: Rect) => number) => glide(t, times, keys.map(([, rect]) => pick(rect)));
  return { x: value((r) => r.x), y: value((r) => r.y), w: value((r) => r.w), h: value((r) => r.h), r: value((r) => r.r) };
};

/** Where the glass object is, and what it is turning into. */
export const rigRect = (t: number): Rect => {
  const box = captureBox();
  const bar = toolbar();
  const dot: Rect = { x: box.x - 10, y: box.y - 10, w: 20, h: 20, r: 10 };
  const seed: Rect = { x: 540 - 50, y: box.y - 20, w: 100, h: 16, r: 8 };
  return keyed(t, [
    [cue.giveUp, TILE],
    [cue.palette - 0.05, TILE],
    [cue.palette + 0.45, PAL_SEARCH],
    [cue.chips[0] - 0.15, PAL_SEARCH],
    [cue.chips[0] + 0.25, PAL_TITLES],
    [cue.pickTitle, PAL_TITLES],
    [cue.pickTitle + 0.35, PAL_SOURCE],
    [cue.pickSource, PAL_SOURCE],
    [cue.pickSource + 0.3, PAL_TARGET],
    [sfx.dragPress, PAL_TARGET],
    [cue.release - 0.01, dot],
    [cue.release, seed],
    [cue.release + 0.22, bar],
    [cue.confirm + 0.05, bar],
    [cue.read + 0.15, TRACK],
    [cue.fold - 0.05, TRACK],
    [cue.fold + 0.45, plateRect(cue.fold + 0.45)],
    [cue.line3, plateRect(cue.line3 + 0.01)],
    [cue.brand - 0.05, plateRect(cue.brand - 0.05)],
    [cue.brand + 0.5, LOGO],
  ]);
};

// The player's own transport, shown while the viewer pauses and drags back.
export const SCRUB = { x: 110, y: 1152, w: 860, h: 72, button: 160, bar0: 215, bar1: 815, cy: 1188 };
