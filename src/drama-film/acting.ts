export const ease = (f: number, a: number, b: number) => {
  const t = Math.max(0, Math.min(1, (f - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const blink = (f: number, at: number, close = 5, hold = 2, open = 9) =>
  1 - ease(f, at, at + close) + ease(f, at + close + hold, at + close + hold + open);

export type Performance = 'watch' | 'lost' | 'deadpan' | 'snack' | 'magic' | 'swat';

export function facePose(f: number, performance: Performance) {
  let lids = .88, eyeX = 2, eyeY = 0, ear = 0, headY = 0, jaw = 0, surprise = 0;
  if (performance === 'lost') {
    lids = .88 + .12 * ease(f, 0, 6);
    eyeY = 2 * ease(f, 8, 14) - 2 * ease(f, 42, 50);
    eyeX = 2 - 2 * ease(f, 22, 30) + 2 * ease(f, 48, 58);
    lids *= Math.min(blink(f, 84, 4, 1, 7), blink(f, 103, 4, 1, 7));
    ear = -1.5 * ease(f, 0, 9);
    headY = -ease(f, 10, 19);
    jaw = ease(f, 3, 8) * 3;
    surprise = ease(f, 0, 8);
  } else if (performance === 'deadpan') {
    // A full blank hold precedes the slow blink and the late ear drop.
    lids = (1 - .49 * ease(f, 82, 114)) * blink(f, 48, 15, 8, 27);
    eyeX = 2 - 1.5 * ease(f, 112, 137);
    ear = 7 * ease(f, 94, 130);
    headY = 2 * ease(f, 98, 150);
    jaw = 0;
    surprise = 1 - ease(f, 48, 110);
  } else if (performance === 'snack') {
    lids = .51 * blink(f, 21, 7, 2, 13);
    ear = 7;
    headY = 2;
    eyeX = .5;
    jaw = f > 28 && f < 60 ? Math.sin((f - 28) * .5) * .6 : 0;
  } else if (performance === 'magic') {
    lids *= blink(f, 56);
    eyeX = mix(2, -1, ease(f, 0, 30)) + 3 * ease(f, 74, 102);
    eyeY = 2 * ease(f, 0, 30) - 2 * ease(f, 74, 102);
  } else {
    lids *= Math.min(blink(f, 110), blink(f, 287));
  }
  return {lids, eyeX, eyeY, ear, headY, jaw, surprise};
}
