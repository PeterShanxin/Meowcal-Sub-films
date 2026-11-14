import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const source = JSON.parse(
  readFileSync(new URL("./font-source.json", import.meta.url), "utf8").replace(
    /^\uFEFF/,
    "",
  ),
);
const directory = new URL("../public/fonts/", import.meta.url),
  target = new URL("NotoSansSC.ttf", directory);
const verify = (bytes) =>
  createHash("sha256").update(bytes).digest("hex") === source.sha256;
if (!existsSync(target) || !verify(readFileSync(target))) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`Font HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!verify(bytes)) throw new Error("Font checksum mismatch");
  mkdirSync(directory, { recursive: true });
  writeFileSync(target, bytes);
}
