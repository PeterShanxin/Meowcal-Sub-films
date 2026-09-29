import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {LivingRoom, TVVlog} from './Room';
import {TabbyCloseup} from './Cats';
import timeline from '../timeline.json';

const smooth=(t:number)=>{const p=Math.min(1,Math.max(0,t));return p*p*(3-2*p);};

export const TVStoryStudy: React.FC = () => {
  const f=useCurrentFrame();
  const {reaction:cut,pushStart,pushEnd}=timeline.tvStudy;
  const push=smooth((f-pushStart)/(pushEnd-pushStart));
  const scale=1+push*1.7;
  const tx=960-(960+(1275-960)*push)*scale;
  const ty=540-(540+(454.7-540)*push)*scale;
  return <AbsoluteFill style={{background:'#142931'}}>
    {f<cut?<>
      <div style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${tx}px,${ty}px) scale(${scale})`}}>
        <LivingRoom frame={f}/>
        <div style={{position:'absolute',left:909,top:244,width:732,height:422,borderRadius:15,background:'#10282d',boxShadow:'0 0 0 3px #65746a, 0 20px 36px #06192288'}}/>
        <div style={{position:'absolute',left:920,top:255,width:710,height:399.4,overflow:'hidden',borderRadius:5,boxShadow:'0 0 100px 15px #cbdfb814'}}><TVVlog frame={f}/></div>
      </div>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,transform:`translate(${-push*940}px,${push*230}px) scale(${1+push*.8})`,transformOrigin:'25% 80%',filter:`blur(${4+push*7}px)`,pointerEvents:'none'}}>
        <path d="M-25 1080C102 919 144 689 83 406M75 971C273 875 312 716 300 523" stroke="#112d31" strokeWidth="21" fill="none"/>
        <path d="M75 517C-74 513-46 343 45 319C132 351 123 430 75 517M103 701C-100 677-55 522 5 535C91 537 139 604 103 701M231 731C173 533 280 464 326 484C371 592 327 687 231 731M167 902C147 740 317 678 355 733C348 869 242 900 167 902" fill="#102c30"/>
        <path d="M1080 1080L1492 913L1920 986V1080Z" fill="#233839"/>
        <ellipse cx="1489" cy="948" rx="56" ry="22" fill="#a98a60"/><path d="M1433 943L1443 1006Q1490 1034 1534 1006L1545 943Z" fill="#81684d"/>
      </svg>
    </>:<>
      <div style={{position:'absolute',inset:-40,transform:`scale(1.04) translateX(${-(f-cut)*.06}px)`,filter:'blur(13px)',opacity:.55}}><LivingRoom frame={f}/></div>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#102c3570,transparent 60%,#10283080)'}}/>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0}}>
        <defs><linearGradient id="tabby-fur"><stop stopColor="#d0ae7d"/><stop offset=".47" stopColor="#ad7f53"/><stop offset="1" stopColor="#815c43"/></linearGradient></defs>
        <path d="M0 922Q427 812 844 891L988 1080H0Z" fill="#72533f"/>
        <g transform={`translate(${624-(f-cut)*.05} 45) scale(1.61)`}><TabbyCloseup frame={f-cut}/></g>
        <path d="M0 0L209 20L289 1080H0Z" fill="#0b242d"/>
        <path d="M200 44L217 1080" stroke="#bdd4ba" strokeOpacity=".25" strokeWidth="6"/>
      </svg>
    </>}
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 57% 47%,transparent 36%,#061b2e66 100%)',pointerEvents:'none'}}/>
    <AbsoluteFill style={{backgroundImage:`url(${staticFile(`scenes/grain-${Math.floor(f/3)%6}.png`)})`,opacity:.055,mixBlendMode:'soft-light',pointerEvents:'none'}}/>
  </AbsoluteFill>;
};
