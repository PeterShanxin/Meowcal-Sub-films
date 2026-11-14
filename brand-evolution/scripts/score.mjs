import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { masterAudio } from "./master.mjs";
import { arrange, unmatchedCues } from "./arrange.mjs";
import { perform, samplesUsed } from "./perform.mjs";

const score = JSON.parse(
  readFileSync(
    new URL("../music/morph-score.json", import.meta.url),
    "utf8",
  ).replace(/^﻿/, ""),
);
const events = arrange(score);
const missing = unmatchedCues(score, events);
if (missing.length)
  throw new Error(
    `Picture cues without a musical onset: ${missing.join(", ")}`,
  );

mkdirSync(new URL("../out/", import.meta.url), { recursive: true });
mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
const premaster = new URL("../out/groove-premaster.wav", import.meta.url),
  destination = new URL("../public/evolution-groove.wav", import.meta.url);
console.log(perform(score.seconds, events).save(premaster, 0.79));
const ffmpeg =
  process.env.ACOUSTIC_SCORE_FFMPEG ||
  fileURLToPath(
    new URL(
      "../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
      import.meta.url,
    ),
  );
const measured = masterAudio(
  ffmpeg,
  fileURLToPath(premaster),
  fileURLToPath(destination),
);
writeFileSync(
  new URL("../out/groove-verification.json", import.meta.url),
  JSON.stringify(
    {
      title: score.title,
      bpm: score.bpm,
      seconds: score.seconds,
      samples: samplesUsed(),
      measured,
      events,
    },
    null,
    2,
  ),
);
console.log({ events: events.length, samples: samplesUsed(), measured });
