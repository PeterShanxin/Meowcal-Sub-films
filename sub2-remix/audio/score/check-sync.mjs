// Measures where the audible attack actually lands at each picture cue.
// Works on the score render or on the final film (pass --ffmpeg to decode MP4).
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { readWave } from "./sampler.mjs";

const usage =
  "Usage: node check-sync.mjs audio.(wav|mp4) score.json [--ffmpeg path] [--offset s] [--tolerance ms] [--window ms]";
const [audio, scorePath, ...args] = process.argv.slice(2);
if (!audio || !scorePath) throw new Error(usage);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const offset = Number(option("--offset", 0)),
  tolerance = Number(option("--tolerance", 15)),
  window = Number(option("--window", 60));

const score = JSON.parse(readFileSync(scorePath, "utf8").replace(/^﻿/, ""));
if (!score.cues) throw new Error("The score has no cues to check");

let file = audio,
  scratch;
if (!/\.wav$/i.test(audio)) {
  const ffmpeg = option("--ffmpeg");
  if (!ffmpeg) throw new Error("Pass --ffmpeg to decode non-WAV media");
  scratch = mkdtempSync(join(tmpdir(), "check-sync-"));
  file = join(scratch, "audio.wav");
  execFileSync(ffmpeg, ["-v", "error", "-i", audio, "-vn", "-ac", "2", "-ar", "48000", "-y", file]);
}
const w = readWave(file);
if (scratch) rmSync(scratch, { recursive: true, force: true });

// 10 ms energy envelope every 5 ms; onset strength is the rise in dB.
const hop = Math.round(w.rate * 0.005),
  span = Math.round(w.rate * 0.01),
  env = [];
for (let s = 0; s + span < w.left.length; s += hop) {
  let e = 0;
  for (let i = s; i < s + span; i++) e += w.left[i] ** 2 + w.right[i] ** 2;
  env.push(10 * Math.log10(e / span + 1e-12));
}
const flux = env.map((v, i) => (i ? Math.max(0, v - env[i - 1]) : 0));
const reach = Math.round(window / 5);

const rows = [];
for (const [name, value] of Object.entries(score.cues))
  for (const t of [value].flat()) {
    const c = Math.round((t + offset) / 0.005);
    let best = c,
      strength = -1;
    for (let i = c - reach; i <= c + reach; i++)
      if (i >= 0 && i < flux.length && flux[i] > strength)
        [best, strength] = [i, flux[i]];
    const ms = (best - c) * 5;
    // Off-time cues fail. Soft cues (small broadband rise, e.g. a glockenspiel
    // tick inside a dense bar) are listed so you can confirm them by ear.
    const off = Math.abs(ms) > tolerance,
      soft = strength < 3;
    rows.push({ name, t, ms, strength, flag: off ? "OFF" : soft ? "soft" : "" });
  }

for (const r of rows)
  console.log(
    `${`${r.name}@${r.t}`.padEnd(18)} ${String(r.ms).padStart(4)} ms  +${r.strength.toFixed(1)} dB ${r.flag}`,
  );
const off = rows.filter((r) => r.flag === "OFF").length,
  soft = rows.filter((r) => r.flag === "soft").length;
console.log(
  `${rows.length - off} of ${rows.length} cues within ±${tolerance} ms` +
    (off ? `; ${off} OFF` : "") +
    (soft ? `; ${soft} soft (< 3 dB rise, check they are meant to be gentle)` : ""),
);
process.exitCode = off ? 1 : 0;
