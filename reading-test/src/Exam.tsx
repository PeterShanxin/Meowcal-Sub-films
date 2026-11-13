import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, ease, font, Paper, SourceLine} from './design';
import {Cinema} from './Cinema';

export const Exam = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  const fold=ease(t,2.05,2.55);
  const exit=ease(t,5.55,6);
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:font,overflow:'hidden'}}>
    <div style={{position:'absolute',left:90,top:190,opacity:1-fold,translate:`0 ${-70*fold}px`,fontSize:120,fontWeight:700,lineHeight:1.24,letterSpacing:-5}}>看个剧，<br/>还要<span style={{color:C.red}}>做题？</span></div>
    <div style={{position:'absolute',left:60,top:interpolate(fold,[0,1],[580,260]),width:960,height:interpolate(fold,[0,1],[850,520]),overflow:'hidden',transform:`rotate(${-1.5*fold}deg)`,boxShadow:'0 12px 0 #20252a'}}>
      <Cinema time={Math.min(t,2.05)}/>
      <SourceLine/>
      {t>=2.05&&<div style={{position:'absolute',left:48,top:45,display:'flex',gap:11}}><div style={{width:10,height:36,background:C.paper}}/><div style={{width:10,height:36,background:C.paper}}/></div>}
    </div>
    <div style={{position:'absolute',inset:0,opacity:fold,translate:`${exit*-1140}px ${exit*300}px`,rotate:`${exit*-16}deg`,transformOrigin:'5% 90%'}}>
      <div style={{position:'absolute',left:91,top:874,fontSize:70,fontWeight:700}}>这句，是在——</div>
      {['告白','告别','讨债'].map((word,i)=><div key={word} style={{position:'absolute',left:128,top:1030+i*155,fontSize:88,lineHeight:1.1,opacity:ease(t,2.65+i*.17,2.85+i*.17),translate:`${(1-ease(t,2.65+i*.17,2.85+i*.17))*65}px 0`}}><span style={{fontFamily:'Georgia',fontSize:78,marginRight:55}}>{String.fromCharCode(65+i)}.</span>{word}</div>)}
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{position:'absolute',inset:0}}>
        <path d="M113 1080C80 978 452 984 470 1060C490 1149 108 1169 104 1061" fill="none" stroke={C.red} strokeWidth="11" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ease(t,4,4.4)}/>
      </svg>
      <div style={{position:'absolute',left:560,top:990,color:C.red,fontFamily:'Georgia',fontSize:175,rotate:'13deg',opacity:ease(t,4.6,4.75)}}>?</div>
    </div>
    <Paper/>
  </AbsoluteFill>;
};
