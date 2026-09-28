import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand} from '../film/Brand';
import {Capture} from '../film/Capture';
import {layout} from '../film/layout';
import {ease} from '../story-tv/styles/motion';
import {PixelSurface} from './PixelSurface';
import {measure} from '../film/text';
import {FONT_DISPLAY} from '../film/theme';

export type Locale = 'en' | 'zh';

const LANGUAGES = '简体中文 · 繁體中文 · 日本語 · 한국어\nEnglish · Español · Français · Deutsch';
// Tagline and privacy lines follow the app's README and README.zh-CN.
const COPY = {
  en: {tagline: undefined, meta: undefined, lang: 'en-US', note: 'Public beta · Primary display only\nYour subtitle text stays on your PC'},
  zh: {tagline: '把屏幕上已有的字幕，翻译成你想读的语言。', meta: 'Windows 11  ·  免费开源', lang: 'zh-CN', note: '公开测试版 · 仅主显示器\n字幕文字留在你的电脑上'},
} as const;
const LINK = 'github.com/PeterShanxin/Meowcal-Sub';
const SMALL = '"Segoe UI", "Microsoft YaHei", "Yu Gothic", "Malgun Gothic", sans-serif';

/** The resolved end card. Without a locale it keeps the pixel-story study's original lines. */
export const FinalBrand: React.FC<{locale?: Locale}> = ({locale}) => {
  const {width:W,height:H}=useVideoConfig(),portrait=H>W;
  if (!locale) return <AbsoluteFill style={{background:'#07090f'}}>
    <Brand f={930} L={layout(W,H)} metaFontSize={portrait?40:32}/>
    <div style={{position:'absolute',left:50,right:50,bottom:portrait?264:126,textAlign:'center',font:`500 ${portrait?40:30}px "Segoe UI", "Microsoft YaHei", sans-serif`,color:'#c0c9dc'}}>公开测试版 · 仅主显示器 · 读取画面文字</div>
    <div style={{position:'absolute',left:50,right:50,bottom:portrait?178:72,textAlign:'center',font:`500 ${portrait?38:27}px "Segoe UI", "Microsoft YaHei", sans-serif`,lineHeight:1.6,color:'#8d9ab4'}}>简中 · 繁中 · 日 · 韩 · 英 · 西 · 法 · 德</div>
  </AbsoluteFill>;
  const copy=COPY[locale];
  // Portrait lines sit above the bottom band that short-video apps cover with captions and buttons.
  // Landscape keeps each group on one line; portrait breaks it where the copy breaks.
  const line=(bottom:number,size:number,color:string,text:string,weight=500)=><div style={{position:'absolute',left:40,right:40,bottom,textAlign:'center',font:`${weight} ${size}px ${SMALL}`,lineHeight:1.45,whiteSpace:'pre-line',color}}>{portrait?text:text.replace('\n',' · ')}</div>;
  return <AbsoluteFill style={{background:'#07090f'}}>
    <Brand f={930} L={layout(W,H)} metaFontSize={portrait?40:32} tagline={copy.tagline} meta={copy.meta} lang={copy.lang}/>
    {line(portrait?478:196,portrait?44:34,'#e4ebf5',LINK,600)}
    {line(portrait?318:124,portrait?32:26,'#b3bdd0',copy.note)}
    {line(portrait?190:70,portrait?30:24,'#8390aa',LANGUAGES)}
  </AbsoluteFill>;
};

export const BrandReveal: React.FC<{locale?: Locale}> = ({locale}) => {
  const f=useCurrentFrame(),{width:W,height:H}=useVideoConfig(),p=H>W;
  const L=layout(W,H),morph=746+Math.min(f,45)*34/45;
  const resolve=ease(f,72,169),cell=1+19*(1-resolve)**2;
  const shiftX=p?0:-(50*L.u+measure('Meowcal Sub',`600 ${132*L.u}px ${FONT_DISPLAY}`))/2;
  const shiftY=(p?-170:-44)*L.u;
  const still=`pixel-film/brand-${p?'vertical':'landscape'}${locale?`-${locale}`:''}.png`;
  return <AbsoluteFill style={{background:'#07090f'}}>
    <div style={{position:'absolute',inset:0,opacity:1-ease(f,43,66),transform:`translate(${shiftX*ease(f,12,48)}px,${shiftY*ease(f,12,48)}px)`}}><Capture f={morph} L={L} opacity={1} scans={[]}/></div>
    <div style={{position:'absolute',inset:0,opacity:ease(f,44,70)}}>
      {f<180?<PixelSurface src={still} width={W} height={H} cell={cell}/>:<FinalBrand locale={locale}/>}
    </div>
  </AbsoluteFill>;
};
