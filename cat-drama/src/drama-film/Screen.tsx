import React from 'react';
import {Capture} from '../../../launch-15s/src/film/Capture';
import {sourceFont} from '../../../launch-15s/src/film/Footage';
import {Plate} from '../../../launch-15s/src/film/Plate';
import {layout} from '../../../launch-15s/src/film/layout';
import {Episode} from './Episode';
import {ease, mix} from './acting';

// The decisive line is all kana: kanji such as 5分 and 寝 would let a Chinese reader guess it.
export const JP = ['ずっと、この時を待っていた。', 'もう、決めた。', 'あと ごふんだけ ねる。'];
export const CN = ['我一直在等这一刻。', '我已经决定了——', '我要再睡五分钟。'];
export const translations = [CN[2], 'I’m going to sleep for five more minutes.', 'Je vais dormir encore cinq minutes.'];
export const targetLanguages = ['zh-CN', 'en-US', 'fr-FR'];
const familiarLines = [CN, ['I’ve been waiting for this moment.', 'I’ve made up my mind—'], ['J’attendais ce moment.', 'J’ai pris ma décision—']];

export const Screen: React.FC<{
  episode: number; line?: number; familiar?: boolean; translated?: boolean;
  capture?: number; plateFrame?: number; target?: number; paused?: boolean; wide?: boolean; portrait?: boolean;
  talk?: number; tug?: number;
}> = ({episode, line = 2, familiar = false, translated = false, capture, plateFrame = 180, target = 0, paused = false, wide = false, portrait = false, talk = 0, tug = 0}) => {
  const L = layout(1280, 720);
  L.box = {x: portrait ? 260 : 104, y: 526, w: portrait ? 760 : 1072, h: 69};
  L.plate = {x: L.box.x, y: 604, w: L.box.w, h: 83};
  L.sourceSize = portrait ? (line === 0 ? 42 : 54) : 38;
  L.plateTextSize = target === 0 ? (portrait ? 48 : 41) : 34;
  const original = JP[line];
  return <div style={{position: 'relative', width: 1280, height: 720, overflow: 'hidden', background: '#132134'}}>
    <Episode f={episode} wide={wide} talk={talk}/>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(6,14,22,.9),transparent 33%)'}}/>
    {/* Same font the OCR glyph boxes are measured in, so they land on the characters. */}
    <div lang="ja" style={{position: 'absolute', left: L.box.x, top: L.box.y, width: L.box.w, height: L.box.h, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f5efd8', font: sourceFont('ja-JP', L.sourceSize), textShadow: '0 2px 3px #06121c'}}>{original}</div>
    {familiar && <div style={{position: 'absolute', left: L.plate.x, top: L.plate.y, width: L.plate.w, textAlign: 'center', color: '#fff6df', font: target === 0 ? '500 42px "Microsoft YaHei",sans-serif' : '500 36px "Segoe UI",sans-serif', textShadow: '0 2px 3px #06121c'}}>{familiarLines[target][line]}</div>}
    {capture !== undefined && <Capture f={capture} L={L} opacity={1} scans={[{start: 94, end: 116, line: {source: original, translation: translations[target]}, lang: 'ja-JP'}]}/>}
    {translated && <div style={{position: 'absolute', inset: 0, transformOrigin: `${L.plate.x + L.plate.w}px ${L.plate.y}px`, transform: `translate(${14 * tug}px,${-26 * tug}px) rotate(${-4 * tug}deg)`}}>
      <Plate f={plateFrame} L={L} lines={[{start: 124, clear: 118, text: translations[target], lang: targetLanguages[target], light: false, stagger: .65}]}/>
    </div>}
    {paused && <div style={{position: 'absolute', top: 28, right: 30, borderRadius: 6, padding: '9px 13px', color: '#e9f0ef', background: '#101d2dc9', font: '500 22px "Segoe UI"', display: 'flex', gap: 5}}><span style={{width: 5, height: 17, background: '#e9f0ef'}}/><span style={{width: 5, height: 17, background: '#e9f0ef'}}/></div>}
  </div>;
};

export const selectionFrame = (f: number, press: number, end: number, scan: number, local: number, plate: number) => {
  if (f < press) return mix(30, 59, ease(f, press - 45, press));
  if (f <= end) return mix(60, 88, ease(f, press, end));
  if (f < scan) return 90;
  if (f < local) return mix(94, 116, ease(f, scan, local));
  if (f < plate) return mix(116, 123, ease(f, local, plate));
  return Math.min(230, 124 + (f - plate) * .65);
};
