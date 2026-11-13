import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C,ease,font,Mark,Paper} from './design';
import {Cinema} from './Cinema';

export const Payoff=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:font,overflow:'hidden'}}>
    <div style={{position:'absolute',left:85,top:240,fontSize:142,lineHeight:1.22,fontWeight:700,letterSpacing:-7}}>看剧。<br/><span style={{display:'inline-block',translate:`${(1-ease(t,.18,.55))*110}px 0`,opacity:ease(t,.18,.55)}}>不用做题。</span></div>
    <div style={{position:'absolute',left:0,top:820,width:1080,height:1100,rotate:'-6deg',scale:1.12}}><Cinema time={t+3.4} payoff/></div>
    <Paper/>
  </AbsoluteFill>;
};

export const Brand=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  return <AbsoluteFill style={{background:C.ink,color:C.white,fontFamily:font,alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'absolute',top:460,scale:.9+.1*ease(t,0,.55)}}><Mark size={260}/></div>
    <div style={{position:'absolute',top:805,fontSize:68,fontWeight:600,letterSpacing:-2}}>Meowcal Sub · 妙影</div>
    <div style={{position:'absolute',top:949,fontSize:48,letterSpacing:1}}>框选屏幕字幕，本地 AI 翻译。</div>
    <div style={{position:'absolute',top:1270,fontSize:40,color:'#b9b7c0'}}>Windows · 免费开源</div>
    <Paper/>
  </AbsoluteFill>;
};

export const Cover=()=> <AbsoluteFill style={{background:C.paper,fontFamily:font,color:C.ink,overflow:'hidden'}}>
  <div style={{position:'absolute',left:80,top:125,fontSize:126,lineHeight:1.23,fontWeight:700,letterSpacing:-6}}>看个剧，<br/>还要<span style={{color:C.red}}>做题？</span></div>
  <div style={{position:'absolute',left:54,top:516,width:972,height:680,rotate:'-3deg',boxShadow:'12px 18px 0 #20252a'}}><Cinema time={0}/></div>
  <div style={{position:'absolute',left:140,top:1110,background:C.paper,padding:'22px 42px',fontSize:59,rotate:'4deg',boxShadow:'0 7px 20px #0003'}}>A 告白　B 告别　C 讨债</div>
  <div style={{position:'absolute',left:72,top:1320,display:'flex',alignItems:'center',gap:15}}><Mark size={90}/><div style={{fontSize:39,fontWeight:600}}>Meowcal Sub · 妙影</div></div>
  <Paper/>
</AbsoluteFill>;
