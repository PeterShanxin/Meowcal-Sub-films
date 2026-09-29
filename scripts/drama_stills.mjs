import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';

// Representative frames for visual inspection: acting beats, each home, the cloud and the ending.
const dir = 'out/drama/stills';
fs.mkdirSync(dir, {recursive: true});
const plan = [
  ['CatDrama60', [120, 290, 390, 490, 760, 930, 956, 1000, 1070, 1380, 1500, 1900, 2250, 2360, 2400, 2470, 2660, 2840, 2910, 2980, 3015, 3040, 3060, 3200, 3560]],
  ['CatDrama60Vertical', [120, 290, 760, 956, 1500, 2470, 3015, 3045, 3200, 3560]],
  ['CatDrama30Vertical', [30, 300, 1350, 1460, 1760]],
];
const serveUrl = await bundle({entryPoint: 'src/index.ts', onProgress: () => {}});
const browserExecutable = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const chromiumOptions = {gl: 'swangle'};
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
try {
  for (const [id, frames] of plan) {
    const inputProps = {sound: false};
    const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, chromiumOptions});
    for (const frame of frames) {
      await renderStill({serveUrl, composition, inputProps, frame, output: `${dir}/${id}-${frame}.png`, scale: .5, puppeteerInstance: browser, chromiumOptions, logLevel: 'error'});
      console.log(id, frame);
    }
  }
} finally {
  await browser.close({silent: true});
}
