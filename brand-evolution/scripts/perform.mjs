import {
  ensureInstruments,
  manifest,
  samplePath,
} from "./download-instruments.mjs";
import { readWave, createMixer } from "./sampler.mjs";
import { voices } from "./arrange.mjs";

const cache = new Map();
const load = (sample) => {
  if (!cache.has(sample.id)) cache.set(sample.id, readWave(samplePath(sample)));
  return cache.get(sample.id);
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

// Start of the audible attack, so a sample's hit lands on the written time
// rather than after the recording's leading silence.
const attackTime = (wave) => {
  const threshold = 0.1 * wave.peak;
  const i = wave.left.findIndex(
    (v, j) => Math.abs(v) >= threshold || Math.abs(wave.right[j]) >= threshold,
  );
  return Math.max(0, i / wave.rate - 0.002);
};

export const samplesUsed = () => cache.size;

// Fetch any samples missing from the shared cache before rendering.
await ensureInstruments();

export function perform(seconds, events) {
  const mixer = createMixer(seconds);
  for (const e of events) {
    const voice = voices[e.group],
      candidates = manifest.samples.filter((s) =>
        e.sample ? s.id === e.sample : s.group === e.group,
      ),
      midi = e.midi ?? candidates[0].root,
      distance = Math.min(...candidates.map((s) => Math.abs(s.root - midi))),
      nearest = candidates.filter((s) => Math.abs(s.root - midi) === distance),
      sample = nearest[(e.variation ?? 0) % nearest.length],
      wave = load(sample),
      lead = e.peakAligned ? peakTime(wave) : 0;
    mixer.add(wave, {
      at: e.at + e.offset - lead,
      sampleOffset: e.peakAligned ? 0 : attackTime(wave),
      midi,
      root: sample.root,
      gain: voice.gain * e.velocity,
      // A swell is choked just before its downbeat so the hit stays clean.
      hold: e.hold ?? lead - 0.03,
      release: voice.release,
      attack: voice.attack,
      pan: e.pan ?? voice.pan ?? 0,
      send: voice.send ?? 0,
      crescendo: e.crescendo ?? 0,
    });
  }
  mixer.hall({ wet: 0.3 });
  return mixer;
}
