import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';

// Run from the repository root: node fable-vs-astra/scripts/stills.mjs [frame ...]
// Half-size frames for visual inspection, written to fable-vs-astra/out/stills/.
const dir = 'fable-vs-astra/out/stills';
fs.mkdirSync(dir, {recursive: true});
const id = process.env.COMP ?? 'FableVsAstra';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: 'fable-vs-astra/src/index.tsx', publicDir: 'fable-vs-astra/public', onProgress: () => {}});
const browser = await openBrowser('chrome');
try {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
  for (const frame of frames.length ? frames : [0]) {
    await renderStill({serveUrl, composition, frame, output: `${dir}/${id}-${String(frame).padStart(4, '0')}.png`, scale: 0.5, puppeteerInstance: browser, logLevel: 'error'});
    console.log(frame);
  }
} finally {
  await browser.close({silent: true});
}
