import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand} from '../film/Brand';
import {Capture} from '../film/Capture';
import {layout} from '../film/layout';
import {ease} from '../story-tv/styles/motion';
import {PixelSurface} from './PixelSurface';
import {measure} from '../film/text';
import {FONT_DISPLAY} from '../film/theme';

export const FinalBrand: React.FC = () => {
  const {width:W,height:H}=useVideoConfig(),portrait=H>W;
  return <AbsoluteFill style={{background:'#07090f'}}>
    <Brand f={930} L={layout(W,H)} metaFontSize={portrait?40:32}/>
    <div style={{position:'absolute',left:50,right:50,bottom:portrait?264:126,textAlign:'center',font:`500 ${portrait?40:30}px "Segoe UI", "Microsoft YaHei", sans-serif`,color:'#c0c9dc'}}>公开测试版 · 仅主显示器 · 读取画面文字</div>
    <div style={{position:'absolute',left:50,right:50,bottom:portrait?178:72,textAlign:'center',font:`500 ${portrait?38:27}px "Segoe UI", "Microsoft YaHei", sans-serif`,lineHeight:1.6,color:'#8d9ab4'}}>简中 · 繁中 · 日 · 韩 · 英 · 西 · 法 · 德</div>
  </AbsoluteFill>;
};

export const BrandReveal: React.FC = () => {
  const f=useCurrentFrame(),{width:W,height:H}=useVideoConfig(),p=H>W;
  const L=layout(W,H),morph=746+Math.min(f,45)*34/45;
  const resolve=ease(f,72,169),cell=1+19*(1-resolve)**2;
  const shiftX=p?0:-(50*L.u+measure('Meowcal Sub',`600 ${132*L.u}px ${FONT_DISPLAY}`))/2;
  const shiftY=(p?-170:-44)*L.u;
  return <AbsoluteFill style={{background:'#07090f'}}>
    <div style={{position:'absolute',inset:0,opacity:1-ease(f,43,66),transform:`translate(${shiftX*ease(f,12,48)}px,${shiftY*ease(f,12,48)}px)`}}><Capture f={morph} L={L} opacity={1} scans={[]}/></div>
    <div style={{position:'absolute',inset:0,opacity:ease(f,44,70)}}>
      {f<180?<PixelSurface src={`pixel-film/brand-${p?'vertical':'landscape'}.png`} width={W} height={H} cell={cell}/>:<FinalBrand/>}
    </div>
  </AbsoluteFill>;
};
