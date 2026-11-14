// Turns music/morph-score.json into timed sample events. Pure data: no audio.
export const voices = {
  piano: { gain: 0.1, attack: 0.004, release: 0.4, pan: -0.06, send: 0.32 },
  bass: { gain: 0.145, attack: 0.002, release: 0.12, pan: 0.02, send: 0.04 },
  kick: { gain: 0.26, release: 0.08 },
  boom: { gain: 0.16, release: 0.5, send: 0.12 },
  snare: { gain: 0.28, release: 0.08, pan: 0.08, send: 0.16 },
  clap: { gain: 0.5, release: 0.08, pan: -0.05, send: 0.22 },
  rim: { gain: 0.44, release: 0.06, pan: 0.12, send: 0.15 },
  hat: { gain: 0.29, release: 0.05, pan: -0.25, send: 0.05 },
  openhat: { gain: 0.13, release: 0.12, pan: -0.25, send: 0.08 },
  shaker: { gain: 0.5, release: 0.05, pan: 0.3, send: 0.05 },
  tamb: { gain: 0.21, release: 0.08, pan: 0.32, send: 0.1 },
  tom: { gain: 0.145, release: 0.15, send: 0.14 },
  crash: { gain: 0.11, release: 0.25, pan: 0.15, send: 0.25 },
  swell: { gain: 0.2, release: 0.05, pan: 0.15, send: 0.25 },
  roll: { gain: 0.54, release: 0.03, pan: 0.08, send: 0.15 },
  glock: { gain: 0.5, release: 1, pan: 0.18, send: 0.42 },
  belltree: { gain: 0.68, release: 0.6, pan: -0.15, send: 0.4 },
};

const drumHold = {
  kick: 0.3,
  boom: 1.2,
  snare: 0.25,
  clap: 0.25,
  rim: 0.15,
  hat: 0.08,
  openhat: 0.3,
  shaker: 0.07,
  tamb: 0.2,
  crash: 1.3,
};

export function arrange(score) {
  const beat = 60 / score.bpm,
    events = [];
  // `at` is the written time; `offset` is the performed deviation from it.
  const push = (group, at, fields) =>
    events.push({ group, at, offset: 0, ...fields });

  for (const [b, notes, length, velocity] of score.piano) {
    // Left-hand pairs land together; right-hand chords roll upward slightly.
    const spread = notes[0] < 55 ? 0.004 : 0.008;
    notes.forEach((midi, i) =>
      push("piano", b * beat, {
        offset: i * spread,
        midi,
        hold: length * beat + 0.06,
        velocity,
      }),
    );
  }
  score.bass.forEach(([b, midi, length, velocity], i) =>
    push("bass", b * beat, {
      midi,
      hold: Math.max(0.12, length * beat - 0.03),
      velocity,
      variation: i,
    }),
  );

  for (const groove of score.grooves) {
    const level = groove.level ?? 1;
    for (let bar = groove.from; bar < groove.to; bar += 4) {
      for (const group of ["kick", "snare", "clap", "rim", "openhat", "tamb"])
        for (const p of groove[group] ?? []) {
          const b = bar + p;
          if (b >= groove.to) continue;
          push(group, b * beat, {
            hold: drumHold[group],
            velocity: (p % 1 ? 0.62 : 0.8) * level,
            variation: Math.round(b * 2),
          });
        }
    }
    for (const [group, step, on, off] of [
      ["hat", groove.hat, 0.55, 0.36],
      ["shaker", groove.shaker, 0.42, 0.28],
    ]) {
      if (!step) continue;
      for (let b = groove.from, i = 0; b < groove.to - 1e-9; b += step, i++)
        push(group, b * beat, {
          // Offbeats sit a few milliseconds late for a relaxed pocket.
          offset: i % 2 ? 0.006 : 0,
          hold: drumHold[group],
          velocity: (i % 2 ? off : on) * level,
          variation: i,
        });
    }
  }

  const h = score.hits;
  for (const group of ["kick", "boom", "crash", "snare", "clap", "rim", "hat"])
    for (const [b, velocity] of h[group] ?? [])
      push(group, b * beat, {
        hold: drumHold[group],
        velocity,
        variation: Math.round(b * 4),
      });
  for (const [b, semitones, velocity] of h.tom)
    push("tom", b * beat, {
      midi: 60 + semitones,
      hold: 0.3,
      velocity,
      pan: -0.2 - semitones * 0.04,
      variation: Math.round(b * 4),
    });
  // A swell is placed so its loudest moment lands on the target downbeat.
  for (const [b, sample, velocity] of h.swell)
    push("swell", b * beat, { sample, peakAligned: true, velocity });
  for (const [b, length, velocity] of h.roll)
    push("roll", b * beat, {
      hold: length * beat,
      crescendo: 2.2,
      velocity,
    });
  for (const [b, midi, velocity] of h.glock)
    push("glock", b * beat, { midi, hold: 1.4, velocity });
  for (const [b, velocity] of h.belltree)
    push("belltree", b * beat, { hold: 2.6, velocity });

  return events.sort((a, b) => a.at - b.at);
}

// Every picture cue must land on a written musical onset.
export function unmatchedCues(score, events, tolerance = 0.002) {
  const times = Object.values(score.cues).flat();
  return times.filter(
    (t) => !events.some((e) => Math.abs(e.at - t) <= tolerance),
  );
}
