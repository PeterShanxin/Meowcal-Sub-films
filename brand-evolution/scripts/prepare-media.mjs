import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const ffmpeg =
  process.env.ACOUSTIC_SCORE_FFMPEG ||
  fileURLToPath(
    new URL(
      "../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
      import.meta.url,
    ),
  );
const run = (args) => {
  const p = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-nostdin", "-y", ...args],
    { encoding: "utf8", windowsHide: true },
  );
  if (p.error) throw p.error;
  if (p.status !== 0) throw new Error(p.stderr);
};
const wav = new URL("../public/evolution-groove.wav", import.meta.url),
  mp3 = new URL("../public/evolution-groove.mp3", import.meta.url);
if (!existsSync(mp3) || statSync(mp3).mtimeMs < statSync(wav).mtimeMs)
  run([
    "-i",
    fileURLToPath(wav),
    "-codec:a",
    "libmp3lame",
    "-b:a",
    "256k",
    fileURLToPath(mp3),
  ]);
const clip = new URL("../public/coast-demo.mp4", import.meta.url);
if (!existsSync(clip)) {
  const source = JSON.parse(
    readFileSync(
      new URL("./video-source.json", import.meta.url),
      "utf8",
    ).replace(/^\uFEFF/, ""),
  );
  const original = new URL("../out/coast-source.mp4", import.meta.url);
  const valid = () =>
    existsSync(original) &&
    createHash("sha256").update(readFileSync(original)).digest("hex") ===
      source.sha256;
  if (!valid()) {
    const response = await fetch(source.download);
    if (!response.ok) throw new Error(`Video HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (createHash("sha256").update(bytes).digest("hex") !== source.sha256)
      throw new Error("Video checksum mismatch");
    mkdirSync(new URL("../out/", import.meta.url), { recursive: true });
    writeFileSync(original, bytes);
  }
  run([
    "-ss",
    String(source.excerptSeconds[0]),
    "-i",
    fileURLToPath(original),
    "-t",
    String(source.excerptSeconds[1] - source.excerptSeconds[0]),
    "-an",
    "-vf",
    "scale=1280:720",
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    fileURLToPath(clip),
  ]);
}
