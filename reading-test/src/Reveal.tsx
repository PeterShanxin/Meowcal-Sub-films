import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, Cursor, ease, font, Mark, Paper, SourceLine} from './design';
import {Cinema} from './Cinema';

export const Reveal=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  const draw=ease(t,1.3,2.05); const result=ease(t,3,3.18);
  const travel=ease(t,.65,1.3);
  const x= t<1.3 ? interpolate(travel,[0,1],[920,94]) : interpolate(draw,[0,1],[94,986]);
  const y= t<1.3 ? interpolate(travel,[0,1],[1570,1260]) : interpolate(draw,[0,1],[1260,1370]);
  return <AbsoluteFill style={{background:C.ink,fontFamily:font,color:C.white}}>
    <div style={{position:'absolute',left:86,top:165,fontSize:118,fontWeight:700,letterSpacing:-5}}>不猜了。</div>
    <div style={{position:'absolute',left:66,top:332,display:'flex',alignItems:'center',gap:12}}><Mark size={90}/><div style={{fontSize:42}}>Meowcal Sub · 妙影</div></div>
    <div style={{position:'absolute',left:0,top:440,width:1080,height:960,overflow:'hidden'}}><Cinema time={t<5?2.05:t-5} payoff={t>=5}/><SourceLine/></div>
    <div style={{position:'absolute',left:94,top:1260,width:892*draw,height:110*draw,border:draw>0?`3px solid ${C.lavender}`:'none',borderRadius:8,boxSizing:'border-box',opacity:1-ease(t,4.8,5.2)}}>
      {draw>.98&&[[0,0],[100,0],[0,100],[100,100]].map(([a,b])=><div key={`${a}-${b}`} style={{position:'absolute',left:`${a}%`,top:`${b}%`,width:10,height:10,background:C.white,translate:'-50% -50%'}}/>)}
    </div>
    <div style={{position:'absolute',left:94,top:1430,width:892,height:124,display:'flex',alignItems:'center',justifyContent:'center',background:'#101113',borderRadius:14,opacity:result,fontSize:68,fontWeight:500}}>你还欠我钱。</div>
    <div style={{opacity:ease(t,.55,.7)*(1-ease(t,2.5,2.8))}}><Cursor x={x} y={y} down={t>=1.3&&t<2.1}/></div>
    <Paper/>
  </AbsoluteFill>;
};
