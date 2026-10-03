import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';

// Run from the repository root. Representative frames for visual inspection: narration, Chestnut's lines,
// acting beats, each home, the cloud and the ending.
const dir = 'cat-drama/out/drama/stills';
fs.mkdirSync(dir, {recursive: true});
const plan = [
  ['CatDrama60', 'zh', [150, 260, 350, 560, 1000, 1080, 1150, 1260, 1350, 1470, 1740, 1900, 2290, 2440, 2620, 2850, 2990, 3010, 3130, 3250, 3340, 3560]],
  ['CatDrama60', 'en', [260, 350, 1150, 1260, 1470, 2620, 2990, 3250]],
  ['CatDrama60Vertical', 'zh', [150, 350, 1150, 1470, 2290, 2440, 2990, 3250, 3560]],
  ['CatDrama30Vertical', 'zh', [60, 360, 490, 1270, 1560, 1760]],
];
const serveUrl = await bundle({entryPoint: 'cat-drama/src/index.ts', publicDir: 'cat-drama/public', onProgress: () => {}});
const chromiumOptions = {gl: 'swangle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  for (const [id, locale, frames] of plan) {
    const inputProps = {sound: false, locale};
    const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, chromiumOptions});
    for (const frame of frames) {
      await renderStill({serveUrl, composition, inputProps, frame, output: `${dir}/${id}-${locale}-${frame}.png`, scale: .5, puppeteerInstance: browser, chromiumOptions, logLevel: 'error'});
      console.log(id, locale, frame);
    }
  }
} finally {
  await browser.close({silent: true});
}
