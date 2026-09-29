import { writeFileSync } from "node:fs";

// Original 120 BPM score. Cue times match the 60 fps picture timeline.
const sr = 48000,
  length = 15,
  n = sr * length;
const L = new Float64Array(n),
  R = new Float64Array(n);
let seed = 92726;
const noise = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
const add = (at, duration, fn, pan = 0, gain = 1) => {
  const start = Math.round(at * sr),
    count = Math.round(duration * sr);
  const gl = Math.sqrt((1 - pan) / 2) * gain,
    gr = Math.sqrt((1 + pan) / 2) * gain;
  for (let j = 0; j < count && start + j < n; j++) {
    if (start + j < 0) continue;
    const sample = fn(j / sr, j / count);
    L[start + j] += sample * gl;
    R[start + j] += sample * gr;
  }
};
const tau = Math.PI * 2;
const freq = (m) => 440 * 2 ** ((m - 69) / 12);
const pluck = (at, m, amp = 0.09, pan = 0) => {
  const hz = freq(m);
  const voice = (t) =>
    Math.sin(
      tau * hz * t + 0.5 * Math.sin(tau * hz * 2 * t) * Math.exp(-t * 12),
    ) *
    Math.exp(-t * 7) *
    Math.min(1, t * 700);
  add(at, 0.9, voice, pan, amp);
  add(at + 0.1875, 0.8, (t) => voice(t) * 0.24, -pan, amp);
  add(at + 0.375, 0.8, (t) => voice(t) * 0.1, pan, amp);
};
const kick = (at, amp = 0.5) =>
  add(
    at,
    0.5,
    (t) =>
      (Math.sin(tau * (47 * t + 7 * (1 - Math.exp(-t * 35)))) *
        Math.exp(-t * 12) +
        noise() * 0.09 * Math.exp(-t * 160)) *
      Math.min(1, t * 1500),
    0,
    amp,
  );
const snare = (at) =>
  add(
    at,
    0.17,
    (t) =>
      (noise() * 0.65 + Math.sin(tau * 185 * t) * 0.28) *
      Math.exp(-t * 28) *
      Math.min(1, t * 1000),
    0.06,
    0.12,
  );
const hat = (at, amp = 0.03) =>
  add(at, 0.08, (t) => noise() * Math.exp(-t * 80), 0.38, amp);
const whoosh = (at, duration, amp = 0.16) => {
  let prev = 0;
  add(
    at,
    duration,
    (t, p) => {
      const raw = noise();
      const hi = raw - prev;
      prev = raw;
      return hi * 0.5 * Math.sin(Math.PI * p) ** 2;
    },
    -0.2,
    amp,
  );
};
const impact = (at, amp = 0.5) => {
  kick(at, amp);
  add(
    at,
    1.6,
    (t) =>
      (Math.sin(tau * 55 * t) * 0.6 + Math.sin(tau * 110 * t) * 0.13) *
      Math.exp(-t * 4) *
      Math.min(1, t * 400),
    0,
    amp * 0.48,
  );
  add(at, 0.7, (t) => noise() * Math.exp(-t * 12), 0, amp * 0.08);
};

// Wide, restrained D-minor pad; all oscillators generated here, no samples.
for (const [i, m] of [50, 57, 62, 65, 69].entries()) {
  const hz = freq(m);
  add(
    0,
    15,
    (t) => {
      const gate = Math.min(1, t / 1.2) * Math.min(1, (15 - t) / 1.4);
      return (
        (Math.sin(tau * hz * t) + 0.26 * Math.sin(tau * hz * 2.001 * t)) *
        0.023 *
        gate *
        (0.8 + 0.2 * Math.sin(tau * 0.08 * t))
      );
    },
    (i - 2) * 0.32,
  );
}
for (let beat = 0; beat < 27; beat++) {
  const at = beat * 0.5;
  if (at < 5.5 || (at >= 6 && at < 9) || at >= 10.5) {
    kick(at, beat % 4 === 0 ? 0.3 : 0.22);
    if (beat % 2) snare(at);
  }
  if (at >= 2 && at < 13) {
    hat(at + 0.25);
    if (at >= 9.5) hat(at + 0.375, 0.016);
  }
  if (beat % 2 === 0) {
    const m = beat < 12 ? 38 : beat < 18 ? 41 : beat < 22 ? 43 : 38;
    const hz = freq(m);
    add(
      at,
      0.7,
      (t) =>
        (Math.sin(tau * hz * t) + 0.17 * Math.sin(tau * hz * 2 * t)) *
        Math.min(1, t * 100) *
        Math.exp(-t * 5),
      0,
      0.12,
    );
  }
}
const notes = [62, 69, 74, 77, 69, 65, 74, 69];
for (let j = 0; j < 48; j++) {
  const at = 1 + j * 0.25;
  if (at > 13) break;
  const amp = at < 3.5 ? 0.046 : at < 9 ? 0.061 : 0.075;
  pluck(at, notes[j % 8], amp, j % 2 ? 0.35 : -0.35);
}
impact(0, 0.32);
whoosh(1.24, 0.42, 0.1);
add(1.383, 0.035, (t) => noise() * Math.exp(-t * 160), -0.3, 0.12);
add(
  2.57,
  0.065,
  (t) => Math.sin(tau * 1700 * t) * Math.exp(-t * 100),
  0.2,
  0.17,
);
add(
  3.4,
  0.075,
  (t) => Math.sin(tau * 1200 * t) * Math.exp(-t * 95),
  0.12,
  0.18,
);
whoosh(3.48, 0.25, 0.13);
impact(3.7, 0.4);
for (const [i, m] of [74, 77, 81].entries())
  pluck(3.7 + i * 0.055, m, 0.115, (i - 1) * 0.4);
whoosh(5.53, 0.48, 0.2);
impact(5.8, 0.32);
whoosh(8.83, 0.6, 0.18);
impact(9.2, 0.32);
whoosh(10.6, 0.47, 0.18);
impact(11, 0.52);
for (const [i, m] of [62, 69, 74, 77, 81].entries())
  pluck(11 + i * 0.03, m, 0.1, (i - 2) * 0.3);
whoosh(12.85, 0.63, 0.15);
impact(13.5, 0.46);
for (const [i, m] of [62, 69, 76].entries())
  pluck(13.53 + i * 0.06, m, 0.13, (i - 1) * 0.45);

let peak = 0;
for (let i = 0; i < n; i++) {
  const fade = Math.min(1, (n - i) / (sr * 0.14));
  L[i] = Math.tanh(L[i] * 1.35) * fade;
  R[i] = Math.tanh(R[i] * 1.35) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const bytes = Buffer.alloc(44 + n * 4);
bytes.write("RIFF", 0);
bytes.writeUInt32LE(bytes.length - 8, 4);
bytes.write("WAVEfmt ", 8);
bytes.writeUInt32LE(16, 16);
bytes.writeUInt16LE(1, 20);
bytes.writeUInt16LE(2, 22);
bytes.writeUInt32LE(sr, 24);
bytes.writeUInt32LE(sr * 4, 28);
bytes.writeUInt16LE(4, 32);
bytes.writeUInt16LE(16, 34);
bytes.write("data", 36);
bytes.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) {
  bytes.writeInt16LE(Math.round((L[i] / peak) * 0.82 * 32767), 44 + i * 4);
  bytes.writeInt16LE(Math.round((R[i] / peak) * 0.82 * 32767), 46 + i * 4);
}
writeFileSync(new URL("../public/soundtrack-raw.wav", import.meta.url), bytes);
console.log("Original stereo score: 15 s, 48 kHz, 120 BPM.");
