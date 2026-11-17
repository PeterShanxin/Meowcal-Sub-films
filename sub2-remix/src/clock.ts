import { Easing, interpolate } from "remotion";
import table from "../audio/cues.json";

// One clock for picture and sound: every time below comes from the cue table,
// which is also the music edit (audio/build.py). Red runs at 125 BPM, so a
// beat is 0.48 s and every cue is a whole or half beat.
export const FPS = 60;
export const W = 1080;
export const H = 1920;
export const SECONDS = table.seconds;
export const cue = table.cues;
export const sfx = table.sfx;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.65, 0, 0.25, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

/** Eased, clamped keyframes; the shape-change curve of the whole film. */
export const glide = (t: number, keys: number[], values: number[]) => interpolate(t, keys, values, { ...clamp, easing: inOut });
/** Linear keyframes, for opacities and schedules. */
export const lin = (t: number, keys: number[], values: number[]) => interpolate(t, keys, values, clamp);
/** 0 → 1 with a fast start and a soft landing. */
export const reveal = (t: number, from: number, to: number) => interpolate(t, [from, to], [0, 1], { ...clamp, easing: out });
/** One-shot impulse 0 → 1 → 0 that peaks just after `at`. */
export const bump = (t: number, at: number, length = 0.4) => {
  const u = (t - at) / length;
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * Math.sqrt(u)) * (1 - u);
};
/** Arrives at `at` with a small overshoot: 0 → 1.06 → 1. */
export const pop = (t: number, at: number, length = 0.42) => {
  const u = (t - at) / length;
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return 1 - Math.pow(1 - u, 3) * Math.cos(u * Math.PI * 1.5);
};
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

// ── The films ────────────────────────────────────────────────────────────
// Every clip is a 24 fps frame sequence in public/frames/<clip>/ (see
// scripts/assets.json for where each one starts in its film). A shot shows a
// clip from `in` seconds (clip time) at film time `at`; cuts land on the beat.
export const SOURCE_FPS = 24;
export const CLIP_FRAMES: Record<string, number> = { rider: 96, drive: 96, cell: 72, blast: 60, paint: 60, sparks: 60, visor: 48, sprite: 108, sintel: 744 };
/** Wide clips whose action sits off centre: px to slide the 1440 px frame left. */
export const CLIP_SHIFT: Record<string, number> = { sprite: 120 };
export const TALL_CLIPS = new Set(["rider", "drive", "cell", "blast", "paint", "sparks", "visor"]);
type Shot = { at: number; clip: string; in: number };
const c = cue.cuts;
export const SHOTS: Shot[] = [
  { at: cue.sprite, clip: "sprite", in: 1.457 }, // Sprite Fright: "Aaaah! My eyes!", with the film's own sound
  { at: c.rider, clip: "rider", in: 0.5 }, // Mixkit: neon rider, on Red's entry
  { at: c.cell, clip: "cell", in: 1.0 }, // Charge: the energy cell
  { at: c.blast, clip: "blast", in: 1.0 }, // Charge: the blast
  { at: c.paint, clip: "paint", in: 1.6 }, // Charge: paint bursts on the robot
  { at: c.swing, clip: "visor", in: 1.0 }, // Charge: he swings at the robot
  { at: c.robot, clip: "sparks", in: 0.5 }, // Charge: the robot's visor in sparks
];

// Sprite Fright, 5:29.5 in the film (clip start 328.5 s).
const SPRITE_START = 328.5;
// The opening starts at 329.957 so the soundtrack's own beat (160 BPM) lands
// on Red's entry and the film's own cut (332.083) falls after ours. The line is
// shown from the opening frame, 0.3 s before the file's 330.25.
export const SPRITE_LINE = { en: "Aaaah! My eyes!", at: [329.95, 332.08] as [number, number] };

// ── The film being watched: Sintel (CC BY 3.0, Blender Foundation) ────────
// Lines are the film's own: the English subtitle stream of the 1080p release
// and sintel_chs.srt, with `at` in seconds of the film.
export const SINTEL_START = 117.0; // where the sintel clip begins in the film

export type Line = { tc: string; en: string; zh: string; at: [number, number] };
export const LINES: Line[] = [
  { tc: "01:47.2", en: "This blade has a dark past.", zh: "这把刀有段黑暗的过去", at: [107.25, 109.22] },
  { tc: "01:51.8", en: "It has shed much innocent blood.", zh: "它沾染了太多无辜者的鲜血", at: [111.8, 115.8] },
  { tc: "01:58.0", en: "You're a fool for traveling alone,\nso completely unprepared.", zh: "你竟然愚蠢到独自旅行，并且毫无准备", at: [118.0, 121.45] },
  { tc: "02:01.7", en: "You're lucky your blood's still flowing.", zh: "你应该对自己还活着感到幸运", at: [121.75, 124.8] },
  { tc: "02:05.2", en: "Thank you.", zh: "谢谢", at: [125.25, 126.3] },
  { tc: "02:07.5", en: "So...", zh: "那么...", at: [127.5, 129.0] },
  { tc: "02:09.4", en: "What brings you to\nthe land of the gatekeepers?", zh: "你为何要来到守门人的领地？", at: [129.4, 133.8] },
  { tc: "02:15.0", en: "I'm searching for someone.", zh: "我在寻找一个人", at: [135.0, 137.5] },
  // Starts on the film's own shot cut, 0.125 s after the file's 138.0, so cut, line and plate change together on the beat.
  { tc: "02:18.0", en: "Someone very dear?\nA kindred spirit?", zh: "某人，一个很亲的人吗？很好的人？", at: [138.125, 142.2] },
  { tc: "02:23.4", en: "A dragon.", zh: "一只龙", at: [143.4, 145.0] },
];
export const FIRST = 6; // the line on screen when the file is matched

// Footage time for film time, as keyframes: Sintel plays from its line 3 under
// the hook, slows while the app is set up, holds for the capture box, slows
// while the line is read, then plays at about 1x with each next line landing
// on a beat; it is paused, dragged back to "I'm searching for someone." and
// plays again. Rates between keys stay within 0.5x-1.05x.
export const READ_AT = 129.62; // just inside the matched line
export const HELD_AT = 138.48;
export const SEEK_TO = LINES[FIRST + 1].at[0];
const PLAY: [number, number][] = [
  [cue.sintel, 117.4],
  [cue.giveUp, 123.28],
  [cue.circle, READ_AT],
  [cue.read, READ_AT],
  [cue.lock, READ_AT + 0.96],
  [cue.fold, LINES[FIRST].at[1]], // the matched line ends as the file folds
  [cue.line3, LINES[FIRST + 1].at[0]], // the next line lands in the empty plate
  [cue.line4, LINES[FIRST + 2].at[0]],
  [cue.pause, HELD_AT],
];
const AFTER: [number, number][] = [
  [cue.play, SEEK_TO],
  [cue.line3b, LINES[FIRST + 2].at[0]],
  [cue.line3b + 10, LINES[FIRST + 2].at[0] + 10],
];
const keyed = (t: number, keys: [number, number][]) => lin(t, keys.map((k) => k[0]), keys.map((k) => k[1]));

export const footageTime = (t: number) => {
  if (t < cue.pause) return keyed(t, PLAY);
  if (t < sfx.grab) return HELD_AT;
  if (t < sfx.drop) return glide(t, [sfx.grab, sfx.drop], [HELD_AT, SEEK_TO]);
  if (t < cue.play) return SEEK_TO;
  return keyed(t, AFTER);
};
export const slowed = (t: number) => (t >= cue.sintel && t < cue.circle) || (t >= cue.read && t < cue.lock);
export const playing = (t: number) => t < cue.circle || (t >= cue.read && t < cue.pause) || t >= cue.play;

/** Index of the burned-in line at a footage time, or -1. */
export const burnedLine = (f: number) => LINES.findIndex((l) => f >= l.at[0] && f < l.at[1]);

/** What the window shows at film time `t`: a clip, a fractional frame in it,
 * and the burned-in English line, if any. */
export const shotAt = (t: number): { clip: string; frame: number; slow: boolean; en?: string } => {
  if (t >= cue.sintel) {
    const f = footageTime(t);
    const line = burnedLine(f);
    return { clip: "sintel", frame: (f - SINTEL_START) * SOURCE_FPS, slow: slowed(t), en: line >= 0 ? LINES[line].en : undefined };
  }
  let shot = SHOTS[0];
  for (const s of SHOTS) if (t >= s.at) shot = s;
  // The picture keeps playing through the moment of silence, so it never looks stuck.
  const clipTime = shot.in + (t - shot.at);
  const filmTime = SPRITE_START + clipTime;
  const en = shot.clip === "sprite" && filmTime >= SPRITE_LINE.at[0] && filmTime < SPRITE_LINE.at[1] ? SPRITE_LINE.en : undefined;
  return { clip: shot.clip, frame: clipTime * SOURCE_FPS, slow: false, en };
};

/** The plate follows the picture: it shows the matched file's line for
 * whatever line the picture is showing, from the drop to the brand. It is away
 * while the playhead is being dragged. */
export const plateAt = (t: number): { index: number; from: number; first: boolean } | undefined => {
  if (t < cue.plate || t >= cue.brand + 0.1 || (t >= sfx.grab + 0.08 && t < cue.relock)) return undefined;
  const index = burnedLine(footageTime(t));
  if (index < FIRST) return undefined;
  let from = t;
  for (let back = t - 1 / FPS; back > cue.plate - 1 / FPS && burnedLine(footageTime(back)) === index && !(back >= sfx.grab + 0.08 && back < cue.relock); back -= 1 / FPS) from = back;
  return { index, from: Math.max(from, cue.plate), first: from <= cue.plate + 1e-6 };
};
