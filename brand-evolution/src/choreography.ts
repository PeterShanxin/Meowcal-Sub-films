import { cue } from "./cues";
import { glide, settle } from "./motion";

// Interface content is laid out at 850 units wide; the window grows around it.
export const interfaceWidth = 850;
export const interfaceHeight = (t: number) =>
  settle(t, cue.layout[4], 625, 530, 0.5);
// The old icon and the new mark share the 128-unit app-icon grid.
export const iconRadius = (size: number) => (size * 29.333) / 128;

const launchKeys = [
  cue.launch,
  cue.window - 0.2,
  cue.window,
  cue.window + 0.25,
];

// One surface carries the whole film: dot, pill, window, footage, icon, mark.
export function surface(t: number) {
  if (t < cue.launch) {
    const squash = glide(t, [cue.launch - 0.4, cue.launch], [0, 1]);
    const dot = glide(t, [0, 0.22, 0.32], [0, 78, 70]);
    // The pill keeps breathing while the line is read, then winds up.
    const w =
        settle(t, cue.pill, dot, 900, 0.45) +
        glide(t, [cue.pill + 0.45, cue.launch - 0.4], [0, 24]) * (1 - squash) -
        40 * squash,
      h = settle(t, cue.pill, dot, 155, 0.45) + 23 * squash;
    return { x: 960, y: 680, w, h, radius: h / 2 };
  }
  if (t < cue.click) {
    const w =
      glide(t, launchKeys, [860, 1160, 1120, 1130]) +
      glide(t, [cue.chinese, cue.chinese + 0.6], [0, 70]) +
      glide(t, [cue.brand, cue.click], [0, 16]);
    const h =
      t < launchKeys[3]
        ? glide(t, launchKeys, [178, 860, 820, 831])
        : (interfaceHeight(t) * w) / interfaceWidth;
    return {
      x: 960,
      y:
        glide(t, [cue.launch, cue.window], [680, 610]) +
        glide(t, [cue.chinese, cue.chinese + 0.6], [0, 12]),
      w,
      h,
      radius: glide(t, [cue.launch, cue.window - 0.2], [89, 16]),
    };
  }
  if (t < cue.toLogo) {
    // The window becomes the footage frame, then slowly leans in.
    const drift = glide(t, [cue.video, cue.toLogo], [0, 36]);
    return {
      x: 960,
      y: glide(t, [cue.click, cue.video], [622, 585]),
      w: glide(t, [cue.click + 0.25, cue.video], [1216, 1200]) + drift,
      h: glide(t, [cue.click + 0.25, cue.video], [758, 675]) + drift * 0.5625,
      radius: 16,
    };
  }
  const size =
    glide(
      t,
      [cue.toLogo, cue.cat - 0.2, cue.cat, cue.cat + 0.25],
      [0, 585, 606, 600],
    ) +
    glide(t, [cue.grow, cue.mark - 0.1], [0, 90]) -
    glide(t, [cue.mark + 0.15, cue.nameIntro], [0, 210]) -
    glide(t, [cue.lockup, cue.lockup + 0.75], [0, 40]);
  const footage = glide(t, [cue.toLogo, cue.cat - 0.2], [1, 0]);
  return {
    x: 960,
    y:
      glide(t, [cue.toLogo, cue.cat], [585, 600]) -
      glide(t, [cue.mark + 0.15, cue.nameIntro], [0, 210]) -
      glide(t, [cue.lockup, cue.lockup + 0.75], [0, 20]),
    w: footage ? 1236 * footage + size * (1 - footage) : size,
    h: footage ? 695 * footage + size * (1 - footage) : size,
    radius: glide(t, [cue.toLogo, cue.cat - 0.2], [16, iconRadius(600)]),
  };
}
