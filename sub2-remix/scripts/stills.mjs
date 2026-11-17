import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';

// Run from the repository root: node sub2-remix/scripts/stills.mjs <seconds> ...
// Half-size frames for inspection, written to sub2-remix/out/stills/.
// SCALE=1 for full size, COMP=<id> for another composition, DIR=<folder>.
const dir = process.env.DIR ?? 'sub2-remix/out/stills';
fs.mkdirSync(dir, {recursive: true});
const id = process.env.COMP ?? 'Sub2RemixSilent';
const scale = Number(process.env.SCALE ?? 0.5);
const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: 'sub2-remix/src/index.tsx', publicDir: 'sub2-remix/public', onProgress: () => {}});
const browser = await openBrowser('chrome');
try {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
  for (const seconds of times.length ? times : [0]) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(seconds * composition.fps));
    const name = `${id}-${seconds.toFixed(2).padStart(5, '0')}.png`;
    await renderStill({serveUrl, composition, frame, output: `${dir}/${name}`, scale, puppeteerInstance: browser, logLevel: 'error'});
    console.log(name);
  }
} finally {
  await browser.close({silent: true});
}
