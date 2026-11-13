import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';

// Run from the repository root: node talking-about-you/scripts/stills.mjs [frame ...]
// Half-size frames for visual inspection.
const dir = 'talking-about-you/out/stills';
fs.mkdirSync(dir, {recursive: true});
const id = process.env.COMP ?? 'TalkingAboutYouSilent';
const args = process.argv.slice(2).map(Number);
const frames = args.length ? args : [40, 100, 150, 230, 340, 420, 520, 630, 720, 780, 900, 1020, 1060, 1250];
const serveUrl = await bundle({entryPoint: 'talking-about-you/src/index.ts', publicDir: 'talking-about-you/public', onProgress: () => {}});
const browserExecutable = process.env.BROWSER ?? null;
const chromiumOptions = {gl: 'swangle'};
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
try {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
  for (const frame of frames) {
    await renderStill({serveUrl, composition, frame, output: `${dir}/${id}-${String(frame).padStart(4, '0')}.png`, scale: 0.5, puppeteerInstance: browser, chromiumOptions, logLevel: 'error'});
    console.log(frame);
  }
} finally {
  await browser.close({silent: true});
}
