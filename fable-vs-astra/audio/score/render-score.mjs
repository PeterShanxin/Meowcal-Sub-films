import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { ensureInstruments } from "./download-instruments.mjs";
import { arrange, unmatchedCues } from "./arrange.mjs";
import { perform, samplesFor } from "./perform.mjs";
import { readWave } from "./sampler.mjs";
import { masterAudio } from "./master.mjs";

const usage =
  "Usage: node render-score.mjs score.json output.wav [--ffmpeg path] [--stems dir] [--allow-unmatched]";
const [scorePath, output, ...args] = process.argv.slice(2);
if (!scorePath || !output) throw new Error(usage);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const score = JSON.parse(
  readFileSync(scorePath, "utf8").replace(/^﻿/, ""),
);
if (
  !(
    score.seconds > 0 &&
    score.seconds <= 600 &&
    score.bpm > 0 &&
    score.bpm <= 300
  )
)
  throw new Error("Score needs bpm (0–300) and seconds (0–600)");

const events = arrange(score);
if (!events.length) throw new Error("The score has no notes");
const late = events.filter((e) => e.at >= score.seconds);
if (late.length)
  throw new Error(`${late.length} events start after ${score.seconds}s`);

// Picture and music share one cue table; a cue with no onset is a sync bug.
const missing = unmatchedCues(score, events);
if (missing.length && !args.includes("--allow-unmatched"))
  throw new Error(
    `Cues with no musical onset: ${missing.join(", ")}s. Write a note on each, or pass --allow-unmatched.`,
  );

const fetched = await ensureInstruments(samplesFor(events));
if (fetched) console.log(`Downloaded ${fetched} samples`);

// Loudest 0.5 s RMS of a file, in the mix's raw dBFS.
const loudest = (file, offsetDb) => {
  const w = readWave(file),
    n = Math.round(w.rate * 0.5);
  let best = -Infinity;
  for (let s = 0; s + n <= w.left.length; s += n) {
    let e = 0;
    for (let i = s; i < s + n; i++) e += (w.left[i] ** 2 + w.right[i] ** 2) / 2;
    best = Math.max(best, 10 * Math.log10(e / n + 1e-12));
  }
  return best + offsetDb;
};

const stems = option("--stems");
if (stems) {
  mkdirSync(stems, { recursive: true });
  const rows = [];
  for (const group of [...new Set(events.map((e) => e.group))]) {
    const file = join(stems, `${group}.wav`);
    const r = perform(
      score.seconds,
      events.filter((e) => e.group === group),
    ).save(file, 1);
    rows.push(`${group} ${loudest(file, r.mixPeakDb).toFixed(1)}`);
  }
  const file = join(stems, "full.wav");
  const r = perform(score.seconds, events).save(file, 1);
  rows.push(`FULL ${loudest(file, r.mixPeakDb).toFixed(1)}`);
  console.log(`Loudest 0.5 s RMS per stem (raw dB):\n${rows.join("\n")}`);
}

const dest = resolve(output);
mkdirSync(dirname(dest), { recursive: true });
const ffmpeg = option("--ffmpeg");
const premaster = ffmpeg
  ? dest.replace(/\.wav$/i, "") + ".premaster.wav"
  : dest;
const result = perform(score.seconds, events).save(premaster, 0.79);
console.log(
  `${events.length} events, ${new Set(events.map((e) => e.group)).size} instruments, ${Object.values(score.cues ?? {}).flat().length} cues matched`,
);
console.log(result);
if (ffmpeg) console.log(masterAudio(ffmpeg, premaster, dest));
console.log(`Saved ${dest}`);
