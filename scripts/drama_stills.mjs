import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const dir='out/drama';
fs.mkdirSync(dir,{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts',onProgress:()=>{}});
const browserExecutable='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const chromiumOptions={gl:'swangle'};
const browser=await openBrowser('chrome',{browserExecutable,chromiumOptions});
try {
 for(const [id,frames] of [['CatDrama60',[180,380,820,910,984,1380,1520,1710,1980,2240,2310,2342,2405,2490,2610,2922,3030,3230,3540]],['CatDrama30Vertical',[120,335,468,720,960,1290,1420,1740]]]){
  const composition=await selectComposition({serveUrl,id,inputProps:{sound:false},puppeteerInstance:browser,chromiumOptions});
  for(const frame of frames){
   await renderStill({serveUrl,composition,inputProps:{sound:false},frame,output:`${dir}/${id}-${frame}.png`,scale:.5,puppeteerInstance:browser,chromiumOptions,logLevel:'error'});
   console.log(id,frame);
  }
 }
} finally {await browser.close({silent:true});}
