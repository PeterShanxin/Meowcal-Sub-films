import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

// One machine-wide cache shared by every project and agent. Files are named by
// their Git blob hash, so two manifests that reuse an id for different
// recordings can never overwrite each other.
export const bankDirectory =
  process.env.ACOUSTIC_SCORE_BANK ??
  join(homedir(), ".codex", "assets", "acoustic-score");
export const manifest = JSON.parse(
  readFileSync(new URL("./instrument-bank.json", import.meta.url), "utf8"),
);
export const samplePath = (sample) => join(bankDirectory, `${sample.blob}.wav`);

const verify = (sample, bytes) =>
  createHash("sha1")
    .update(Buffer.from(`blob ${bytes.length}\0`))
    .update(bytes)
    .digest("hex") === sample.blob;

// Downloads anything missing from the cache and returns how many it fetched.
export async function ensureInstruments(samples = manifest.samples) {
  mkdirSync(bankDirectory, { recursive: true });
  const queue = [...samples];
  let fetched = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const sample = queue.shift();
        const target = samplePath(sample);
        if (existsSync(target)) continue;
        // Reuse an older id-named file when its content still matches.
        const legacy = join(bankDirectory, sample.id + ".wav");
        if (existsSync(legacy)) {
          const bytes = readFileSync(legacy);
          if (verify(sample, bytes)) {
            writeFileSync(target, bytes);
            continue;
          }
        }
        const response = await fetch(sample.url);
        if (!response.ok)
          throw new Error(`${sample.id}: HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!verify(sample, bytes))
          throw new Error(`${sample.id}: sample integrity check failed`);
        writeFileSync(target, bytes);
        fetched++;
      }
    }),
  );
  return fetched;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const fetched = await ensureInstruments();
  // Explicit runs re-hash everything; renders trust the content-addressed names.
  const bad = manifest.samples.filter(
    (s) => !verify(s, readFileSync(samplePath(s))),
  );
  if (bad.length)
    throw new Error(
      `Corrupt cache entries: ${bad.map((s) => s.id).join(", ")}`,
    );
  console.log(
    `Verified ${manifest.samples.length} recorded samples (${fetched} downloaded) in ${bankDirectory}`,
  );
}
