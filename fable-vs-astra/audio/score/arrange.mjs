// Turns a score (see references/score-format.md) into timed sample events.
// Pure data: no audio is read or written here.

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
const bowed = new Set(["cello", "viola", "violin"]);

export function arrange(score) {
  const beat = 60 / score.bpm,
    events = [];
  // `at` is the written time; `offset` is the performed deviation from it.
  const push = (group, at, fields) =>
    events.push({ group, at, offset: 0, ...fields });

  // Pedal-down piano: every chord rings into the next, like a pianist's
  // sustain pedal. Left-hand pairs land together; right-hand chords roll up.
  for (const [b, notes, length, velocity, group = "piano"] of score.piano ??
    []) {
    const spread = notes[0] < 55 ? 0.004 : 0.008;
    notes.forEach((midi, i) =>
      push(group, b * beat, {
        offset: i * spread,
        midi,
        hold: length * beat + 0.06,
        velocity,
      }),
    );
  }

  (score.bass ?? []).forEach(([b, midi, length, velocity], i) =>
    push("bass", b * beat, {
      midi,
      hold: Math.max(0.12, length * beat - 0.03),
      velocity,
      variation: i,
    }),
  );

  // Bowed lines: a note that starts as the previous one in the same section
  // ends is joined legato (tails overlap, the new note enters past its attack).
  const lastEnd = {};
  for (const [b, section, midi, length, velocity] of [
    ...(score.strings ?? []),
  ].sort((x, y) => x[0] - y[0])) {
    if (!bowed.has(section)) throw new Error(`Unknown string section ${section}`);
    const legato = Math.abs((lastEnd[section] ?? -1) - b) < 0.05;
    push(section, b * beat, {
      midi,
      hold: length * beat + 0.15,
      velocity,
      sampleOffset: legato ? 0.25 : undefined,
      attack: legato ? 0.12 : 0.08,
      swell: 0.12,
    });
    lastEnd[section] = b + length;
  }

  for (const groove of score.grooves ?? []) {
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

  const h = score.hits ?? {};
  for (const group of [
    "kick",
    "boom",
    "crash",
    "snare",
    "clap",
    "rim",
    "hat",
    "openhat",
    "tamb",
  ])
    for (const [b, velocity] of h[group] ?? [])
      push(group, b * beat, {
        hold: drumHold[group],
        velocity,
        variation: Math.round(b * 4),
      });
  for (const [b, semitones, velocity] of h.tom ?? [])
    push("tom", b * beat, {
      midi: 60 + semitones,
      hold: 0.3,
      velocity,
      pan: -0.2 - semitones * 0.04,
      variation: Math.round(b * 4),
    });
  // A swell is placed so its loudest moment lands on the target beat.
  for (const [b, sample, velocity] of h.swell ?? [])
    push("swell", b * beat, { sample, peakAligned: true, velocity });
  // A roll ends on its target beat and rises toward it.
  for (const [b, length, velocity] of h.roll ?? [])
    push("roll", b * beat, { hold: length * beat, crescendo: 2.2, velocity });
  for (const [b, midi, velocity] of h.glock ?? [])
    push("glock", b * beat, { midi, hold: 1.4, velocity });
  for (const [b, velocity] of h.belltree ?? [])
    push("belltree", b * beat, { hold: 2.6, velocity });

  // Low-level escape hatch: explicit events with a `beat`.
  for (const e of score.events ?? []) {
    const { beat: b, ...rest } = e;
    push(e.group, b * beat, rest);
  }

  return events.sort((a, b) => a.at - b.at);
}

// Every picture cue must land on a written musical onset.
export function unmatchedCues(score, events, tolerance = 0.002) {
  const times = Object.values(score.cues ?? {}).flat();
  return times.filter(
    (t) => !events.some((e) => Math.abs(e.at - t) <= tolerance),
  );
}
