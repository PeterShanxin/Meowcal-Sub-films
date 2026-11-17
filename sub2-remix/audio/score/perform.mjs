import { manifest, samplePath } from "./download-instruments.mjs";
import { readWave, createMixer } from "./sampler.mjs";

// Per-instrument mix defaults, balanced by measuring solo stems (render-score
// --stems) against a full mix. Scores can override gain/pan per event.
export const voices = {
  piano: { gain: 0.279, attack: 0.004, release: 0.4, pan: -0.06, send: 0.32 },
  "piano-dry": { gain: 0.2, attack: 0.002, release: 0.3, pan: -0.06, send: 0.2 },
  bass: { gain: 0.503, attack: 0.002, release: 0.12, pan: 0.02, send: 0.04 },
  cello: { gain: 0.557, attack: 0.08, release: 0.2, pan: 0.12, send: 0.35 },
  viola: { gain: 0.588, attack: 0.08, release: 0.2, pan: -0.08, send: 0.35 },
  violin: { gain: 1.6, attack: 0.08, release: 0.2, pan: -0.2, send: 0.35 },
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
  crash: { gain: 0.475, release: 0.25, pan: 0.15, send: 0.25 },
  swell: { gain: 0.2, release: 0.05, pan: 0.15, send: 0.25 },
  roll: { gain: 0.54, release: 0.03, pan: 0.08, send: 0.15 },
  glock: { gain: 2.366, release: 1, pan: 0.18, send: 0.42 },
  belltree: { gain: 1.65, release: 0.6, pan: -0.15, send: 0.4 },
  // Light percussion and mallets from VCSL (CC0), added for the Sub 2 remix;
  // gains bring each recording's peak to about -10 dBFS at velocity 1.
  "marimba": { gain: 1.07, release: 0.35, pan: -0.1, send: 0.25, attack: 0.002 },
  "kalimba": { gain: 0.824, release: 0.7, pan: 0.25, send: 0.35, attack: 0.002 },
  "wood": { gain: 1.358, release: 0.08, pan: 0.2, send: 0.12 },
  "claves": { gain: 1.425, release: 0.06, pan: -0.25, send: 0.12 },
  "cajon-bass": { gain: 0.62, release: 0.12, pan: 0.0, send: 0.05 },
  "cajon-slap": { gain: 1.957, release: 0.08, pan: 0.05, send: 0.12 },
  "bongo-hi": { gain: 0.93, release: 0.1, pan: 0.3, send: 0.1 },
  "bongo-lo": { gain: 0.664, release: 0.12, pan: -0.3, send: 0.1 },
  "shk": { gain: 1.734, release: 0.04, pan: 0.35, send: 0.05 },
  "snap": { gain: 3.737, release: 0.08, pan: -0.1, send: 0.18 },
};
const pitched = new Set([
  "piano",
  "piano-dry",
  "bass",
  "cello",
  "viola",
  "violin",
  "glock",
  "tom",
  "marimba",
  "kalimba",
]);

const cache = new Map();
const load = (sample) => {
  if (!cache.has(sample.blob))
    cache.set(sample.blob, readWave(samplePath(sample)));
  return cache.get(sample.blob);
};

// Time of the loudest 10 ms block, used to land a swell on its downbeat.
const peakTime = (wave) => {
  const block = Math.round(wave.rate / 100);
  let best = 0,
    at = 0;
  for (let i = 0; i + block < wave.left.length; i += block) {
    let energy = 0;
    for (let j = i; j < i + block; j++) energy += wave.left[j] ** 2;
    if (energy > best) [best, at] = [energy, i];
  }
  return at / wave.rate;
};

// Start of the audible attack, so a hit lands on its written time rather than
// after the recording's leading silence.
const attackTime = (wave) => {
  const threshold = 0.1 * wave.peak;
  const i = wave.left.findIndex(
    (v, j) => Math.abs(v) >= threshold || Math.abs(wave.right[j]) >= threshold,
  );
  return Math.max(0, i / wave.rate - 0.002);
};

export const samplesFor = (events) => {
  const used = new Set(events.map((e) => e.sample ?? e.group));
  return manifest.samples.filter((s) => used.has(s.id) || used.has(s.group));
};

export function perform(seconds, events, { wet = 0.3 } = {}) {
  const mixer = createMixer(seconds);
  for (const e of events) {
    const voice = voices[e.group];
    if (!voice) throw new Error(`Unknown instrument group ${e.group}`);
    const candidates = manifest.samples.filter((s) =>
      e.sample ? s.id === e.sample : s.group === e.group,
    );
    if (!candidates.length)
      throw new Error(`No samples for ${e.sample ?? e.group}`);
    const midi = pitched.has(e.group) ? (e.midi ?? 60) : null,
      distance = midi === null
        ? 0
        : Math.min(...candidates.map((s) => Math.abs(s.root - midi))),
      nearest = midi === null
        ? candidates
        : candidates.filter((s) => Math.abs(s.root - midi) === distance),
      sample = nearest[(e.variation ?? 0) % nearest.length],
      wave = load(sample),
      lead = e.peakAligned ? peakTime(wave) : 0;
    mixer.add(wave, {
      at: e.at + (e.offset ?? 0) - lead,
      sampleOffset: e.sampleOffset ?? (e.peakAligned ? 0 : attackTime(wave)),
      midi: midi ?? e.midi ?? sample.root,
      root: midi === null ? (e.midi ? 60 : sample.root) : sample.root,
      gain: (e.gain ?? voice.gain) * (e.velocity ?? 0.65),
      // A swell is choked just before its downbeat so the hit stays clean.
      hold: e.hold ?? (e.peakAligned ? lead - 0.03 : 1),
      release: e.release ?? voice.release,
      attack: e.attack ?? voice.attack ?? 0.0015,
      pan: e.pan ?? voice.pan ?? 0,
      send: e.send ?? voice.send ?? 0,
      swell: e.swell ?? 0,
      crescendo: e.crescendo ?? 0,
    });
  }
  mixer.hall({ wet });
  return mixer;
}
