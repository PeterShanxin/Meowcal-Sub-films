import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
process.chdir(root);
const composition = process.argv[2] ?? "MeowcalReveal";
if (
  !["MeowcalReveal", "MeowcalPortrait", "MeowcalSquare"].includes(composition)
)
  throw new Error("Unknown composition");
mkdirSync("out", { recursive: true });
const master = resolve("out", `${composition}-master.mp4`);
const output = resolve(
  "out",
  composition === "MeowcalReveal"
    ? "Meowcal-Sub-Launch-15s.mp4"
    : `${composition}-15s.mp4`,
);
const args = [
  "node_modules/@remotion/cli/remotion-cli.js",
  "render",
  "src/index.ts",
  composition,
  master,
  "--crf=16",
  "--concurrency=3",
  "--audio-bitrate=320k",
];
if (process.platform === "win32") {
  const browser =
    process.env.REMOTION_BROWSER ??
    [
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
    ].find(existsSync);
  if (browser) args.push(`--browser-executable=${browser}`);
  if (process.arch === "arm64")
    args.push(
      `--binaries-directory=${resolve("node_modules/@remotion/compositor-win32-x64-msvc")}`,
    );
}
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run(process.execPath, args);
// Trim AAC padding and put MP4 metadata first for immediate web playback.
run("ffmpeg", [
  "-y",
  "-hide_banner",
  "-i",
  master,
  "-t",
  "15",
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-b:a",
  "320k",
  "-ar",
  "48000",
  "-ac",
  "2",
  "-movflags",
  "+faststart",
  output,
]);
console.log(output);
