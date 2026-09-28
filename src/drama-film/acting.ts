export const ease = (f: number, a: number, b: number) => {
  const t = Math.max(0, Math.min(1, (f - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const blink = (f: number, at: number, close = 5, hold = 2, open = 9) =>
  1 - ease(f, at, at + close) + ease(f, at + close + hold, at + close + hold + open);

export type Performance = 'watch' | 'lost' | 'deadpan' | 'snack' | 'magic' | 'swat';

/**
 * Face and body channels for one performance.
 * pupil: 0 slit, ~.9 relaxed, 2 fully dilated. whisker: -1 drooped, 1 pushed forward.
 * ear: negative perks forward, positive rotates out into flattened "airplane" ears.
 * stretch: vertical head scale for squash and stretch. puff / flop: tail up and fluffed / dropped flat.
 */
export function facePose(f: number, performance: Performance) {
  let lids = .88, eyeX = 2, eyeY = 0, ear = 0, headY = 0, jaw = 0, surprise = 0;
  let pupil = .9, whisker = 0, stretch = 1, puff = 0, flop = 0;
  if (performance === 'lost') {
    // Anticipation squash, then the take: head stretches, eyes pop, pupils flood, ears and tail shoot up.
    stretch = 1 - .05 * ease(f, 0, 3) + .12 * ease(f, 3, 8) - .05 * ease(f, 8, 20);
    lids = (.88 + .12 * ease(f, 3, 8)) * Math.min(blink(f, 84, 4, 1, 7), blink(f, 103, 4, 1, 7));
    eyeY = 2 * ease(f, 12, 18) - 2 * ease(f, 42, 50);
    eyeX = 2 - 2 * ease(f, 22, 30) + 2 * ease(f, 48, 58);
    pupil = mix(.9, 2, ease(f, 3, 10)) - .6 * ease(f, 60, 100);
    ear = -1.5 - 3 * ease(f, 3, 8) + 2 * ease(f, 70, 110);
    whisker = ease(f, 3, 8) - .6 * ease(f, 60, 100);
    headY = -2 * ease(f, 3, 8) + ease(f, 10, 22);
    jaw = 2.5 * ease(f, 3, 8) - 2.5 * ease(f, 40, 52);
    surprise = ease(f, 3, 8);
    puff = ease(f, 3, 9) - .55 * ease(f, 70, 120);
  } else if (performance === 'deadpan') {
    // A wide blank stare while the pupils shrink to slits; then the slow blink, half lids,
    // airplane ears, drooping whiskers and, last, the tail giving up.
    lids = (1 - .5 * ease(f, 82, 114)) * blink(f, 48, 15, 8, 27);
    pupil = mix(1.6, .12, ease(f, 8, 40));
    eyeX = 2 - 1.5 * ease(f, 112, 137);
    ear = 14 * ease(f, 94, 125);
    whisker = -ease(f, 100, 140);
    headY = 3 * ease(f, 98, 150);
    stretch = 1 - .03 * ease(f, 98, 150);
    surprise = 1 - ease(f, 30, 90);
    flop = ease(f, 118, 126);
  } else if (performance === 'snack') {
    lids = .5 * blink(f, 21, 7, 2, 13);
    pupil = .12;
    ear = 14;
    whisker = -1;
    headY = 3;
    stretch = .97;
    eyeX = .5;
    flop = 1;
    jaw = f > 28 && f < 70 ? Math.max(0, Math.sin((f - 28) * .45)) * 1.6 : 0;
  } else if (performance === 'magic') {
    lids *= blink(f, 56);
    eyeX = mix(2, -1, ease(f, 0, 30)) + 3 * ease(f, 74, 102);
    eyeY = 2 * ease(f, 0, 30) - 2 * ease(f, 74, 102);
    pupil = mix(.9, 1.7, ease(f, 4, 20));
    ear = -2.5 * ease(f, 4, 18);
    whisker = .6 * ease(f, 4, 18);
    stretch = 1 + .03 * ease(f, 4, 14) - .03 * ease(f, 14, 30);
  } else if (performance === 'swat') {
    // Still unimpressed: the swat happens without the face bothering to change.
    lids = mix(.55, .32, ease(f, 34, 40) - ease(f, 52, 64));
    pupil = .2;
    ear = 10;
    whisker = -.5;
    headY = 2;
    flop = 1;
  } else {
    lids *= Math.min(blink(f, 110), blink(f, 287));
  }
  return {lids, eyeX, eyeY, ear, headY, jaw, surprise, pupil, whisker, stretch, puff, flop};
}

/** Mouth opening (0..1) for a line of meowed dialogue scheduled in timeline.json. */
export const talking = (g: number, lines: {at: number; len: number}[]) => {
  for (const {at, len} of lines) {
    if (g >= at && g < at + len) {
      const open = ease(g, at, at + 4) * (1 - ease(g, at + len - 7, at + len));
      return open * (.78 + .22 * Math.sin((g - at) * .7));
    }
  }
  return 0;
};
