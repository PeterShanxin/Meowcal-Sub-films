import { copyFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import "./prepare-font.mjs";
const soundtrack = new URL("../public/evolution-groove.wav", import.meta.url);
if (
  !existsSync(soundtrack) ||
  [
    "./score.mjs",
    "./arrange.mjs",
    "./perform.mjs",
    "./sampler.mjs",
    "./instrument-bank.json",
    "../music/morph-score.json",
  ].some(
    (source) =>
      statSync(new URL(source, import.meta.url)).mtimeMs >
      statSync(soundtrack).mtimeMs,
  )
)
  await import("./score.mjs");
await import("./prepare-media.mjs");

const destination = new URL("../public/", import.meta.url);
mkdirSync(destination, { recursive: true });
copyFileSync(
  new URL("../assets/logo-v0.8.0.svg", import.meta.url),
  new URL("logo-old.svg", destination),
);
copyFileSync(
  new URL("../assets/home-v0.8.0.png", import.meta.url),
  new URL("home-old.png", destination),
);
for (const [source, target] of [
  ["screenshot-home.png", "home-en.png"],
  ["screenshot-home.zh-CN.png", "home-zh.png"],
  ["mark.svg", "mark.svg"],
]) {
  copyFileSync(
    new URL(`../assets/${source}`, import.meta.url),
    new URL(target, destination),
  );
}
