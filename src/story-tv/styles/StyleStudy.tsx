import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CeramicReaction, CeramicRoom, CeramicVlog} from './CeramicScene';
import {PixelReaction, PixelRoom, PixelVlog} from './PixelScene';
import {cues, ease} from './motion';

export const StyleStudy: React.FC<{style:'pixel'|'ceramic'}> = ({style}) => {
  const f = useCurrentFrame();
  const pixel = style === 'pixel';
  const push = ease(f,cues.pushStart,cues.pushEnd);
  const scale = 1 + push * 1.64;
  const x = 960 - (960 + (1272-960) * push) * scale;
  const y = 540 - (540 + (450-540) * push) * scale;
  return <AbsoluteFill style={{background:'#121927',overflow:'hidden'}}>
    {f<cues.reaction?<>
      <div style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${pixel?Math.round(x):x}px,${pixel?Math.round(y):y}px) scale(${scale})`}}>
        {pixel?<PixelRoom/>:<CeramicRoom frame={f}/>}
        <div style={{position:'absolute',left:908,top:240,width:728,height:422,borderRadius:pixel?0:12,background:'#0c1422',boxShadow:pixel?'0 4px 0 #526681':'0 0 0 2px #748397,0 15px 30px #070e1b99'}}/>
        <div style={{position:'absolute',left:920,top:252,width:704,height:396,overflow:'hidden',borderRadius:pixel?0:3}}>
          {pixel?<PixelVlog frame={f}/>:<CeramicVlog frame={f}/>}
        </div>
      </div>
      {!pixel&&<svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',filter:'blur(6px)',transform:`translate(${-push*450}px,${push*150}px)`,pointerEvents:'none'}}>
        <path d="M-25 1080Q123 851 83 554M71 999Q243 911 264 693" stroke="#142638" strokeWidth="15" fill="none"/>
        <path d="M83 690Q-24 671 10 563Q107 554 83 690M110 861Q-2 839 15 745Q126 718 110 861M206 849Q153 733 267 661Q317 771 206 849M156 949Q249 820 324 853Q300 953 156 949" fill="#1a3040"/>
        <path d="M1198 1080L1560 982L1920 1031V1080Z" fill="#253244"/>
        <path d="M1547 969H1616L1608 1024Q1580 1038 1551 1024Z" fill="#9babae"/>
      </svg>}
    </>:pixel?<PixelReaction frame={f-cues.reaction}/>:<CeramicReaction frame={f-cues.reaction}/>}
    {!pixel&&<AbsoluteFill style={{pointerEvents:'none',background:'radial-gradient(ellipse at 58% 46%,transparent 44%,#050b182e 100%)'}}/>}
  </AbsoluteFill>;
};
