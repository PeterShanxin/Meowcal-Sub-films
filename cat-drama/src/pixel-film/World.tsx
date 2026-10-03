import React from 'react';
import {CatSprite} from './PixelCats';
import {Place} from './Places';
import {ease} from '../story-tv/styles/motion';

const homes=[[141,91],[212,59],[283,93],[129,154],[214,174],[302,158]];
const land=(x:number,y:number)=>Math.sin(x*.22)+Math.cos(y*.18)+Math.sin((x+y)*.11)>.35;

/** `lightsOut` (0..1) switches the homes' lights off one after another. */
export const PixelPlanet:React.FC<{f:number;connected?:boolean;portrait?:boolean;lightsOut?:number;children?:React.ReactNode}> = ({f,connected=false,portrait=false,lightsOut=0,children}) => {
  const zoom=(connected?1.12:0.62+ease(f,0,285)*1.2)*(portrait?.62:1);
  return <svg viewBox={portrait?'164 0 152 270':'0 0 480 270'} width="100%" height="100%" shapeRendering="crispEdges">
    <rect width="480" height="270" fill="#111c30"/>
    {Array.from({length:67},(_,i)=><rect key={i} x={(i*73+21)%480} y={(i*47+13)%270} width={i%11===0?2:1} height={i%11===0?2:1} fill={i%3?'#66809b':'#bdc9d1'}/>)}
    <g transform={`translate(240 137) scale(${zoom}) translate(-240 -137)`}>
      <path d="M120 208H360V213H347V217H323V221H166V217H139V213H120Z" fill="#0b1526"/>
      <path d="M163 99V48H170V55H178V63H186V72H196V91ZM282 91V72H291V63H300V55H307V48H314V99Z" fill="#4e7990"/>
      {Array.from({length:38},(_,row)=>Array.from({length:56},(_,col)=>{
        const x=128+col*4,y=65+row*4,dx=(x-240)/112,dy=(y-140)/80;
        if(dx*dx+dy*dy>1)return null;
        const shade=dx*.55+dy*.45;
        return <rect key={`${row}-${col}`} x={x} y={y} width="4" height="4" fill={land(x,y)?(shade>.3?'#496b72':shade<-.2?'#a1b4a3':'#7e9e92'):(shade>.3?'#294a68':shade<-.3?'#5f8c9f':'#426c87')}/>;
      }))}
      {connected&&homes.slice(1).map(([x,y],i)=><path key={i} d={`M${homes[i][0]+23} ${homes[i][1]+28}H${x+23}V${y+28}`} fill="none" stroke="#cfddba" strokeWidth="1" opacity={ease(f,25+i*20,50+i*20)*.8}/>)}
      {homes.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
        <path d="M-4 4H12V0H38V4H51V10H-4Z" fill="#384e61"/>
        <rect width="48" height="35" y="10" fill="#748899"/>
        <svg x="3" y="13" width="42" height="27" viewBox="0 0 160 110"><Place id={i} night/></svg>
        <rect x="25" y="19" width="17" height="13" fill="#b7c6bb"/>
        <rect x="26" y="20" width="15" height="9" fill="#344e60"/>
        <rect x="26" y="30" width="15" height="2" fill="#e5dfb7" opacity={connected?ease(f,i*18,i*18+25):.1}/>
        <g transform="translate(4 20) scale(.15)"><CatSprite id={i} frame={0} back/></g>
        {lightsOut>0&&<rect y="10" width="48" height="35" fill="#060c18" opacity={.72*Math.max(0,Math.min(1,lightsOut*homes.length-i))}/>}
      </g>)}
      {children}
    </g>
  </svg>;
};

export const Privacy:React.FC<{f:number;W:number;H:number}> = ({f,W,H}) => {
  const hit=ease(f,95,114),returning=ease(f,128,155),flight=ease(f,114,185),reach=ease(f,15,95);
  const paw=hit-returning,handX=Math.round(343-36*paw),handY=Math.round(224-88*paw);
  return <svg viewBox="0 0 480 270" width={W} height={H} shapeRendering="crispEdges">
    <rect width="480" height="270" fill="#293b51"/><path d="M0 231H480V270H0Z" fill="#3c4f64"/>
    <path d="M22 30H319V209H22Z" fill="#101a2b" stroke="#91a6b7" strokeWidth="2"/>
    <svg x="27" y="35" width="287" height="157" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={3}/></svg>
    <path d="M106 109H238V158H106Z" fill="#a78c67"/><path d="M104 109H241V114H104Z" fill="#c6ad82"/>
    <g transform="translate(134 50) scale(.66)"><CatSprite id={3} frame={f}/></g>
    <path d="M106 129H238V158H106Z" fill="#a78c67"/><path d="M173 131V158" stroke="#796e5b" fill="none"/>
    <rect x="43" y="170" width="255" height="16" fill="#263944"/>
    <text x="170" y="181" textAnchor="middle" fontFamily="Segoe UI,sans-serif" fontSize="9" fill="#fff3da">The box was the actual gift.</text>
    <rect x="43" y="188" width="255" height="17" fill="#0b0b0b"/>
    <text x="170" y="200" textAnchor="middle" fontFamily="Microsoft YaHei,sans-serif" fontSize="9" fill="#f5f7ff">原来，纸箱才是真正的礼物。</text>
    <path d="M150 210v11h-9v4h64v-4h-9v-11" fill="#8495a7"/>
    <rect x="260" y="216" width="27" height="12" fill="#101b2b"/><rect x="282" y="219" width="2" height="2" fill="#55d699"/>
    <path d="M272 216v-9" stroke="#101b2b" strokeWidth="2"/>
    <g transform="translate(309 105) scale(.95)"><CatSprite id={0} frame={200}/></g>
    <g transform={`translate(${312+flight*180} ${40+reach*64-flight*155})`}>
      <path d="M0 15h8V7h13V0h25v7h14v8h10v19H0Z" fill="#c0ced7"/><path d="M22 21h5m16 0h5" stroke="#40576f" strokeWidth="2"/>
      <path d={`M8 34v${15+reach*12}h-15v17h-10v8h-11`} stroke="#c0ced7" strokeWidth="4" fill="none"/>
    </g>
    {paw>.05&&<>
      <path d="M333 218H358V239H333Z" fill="#3c4f64"/>
      <path d={`M342 191L${handX+5} ${handY+7}`} stroke="#a6ada7" strokeWidth="12" fill="none"/>
      <g transform={`translate(${handX} ${handY})`}><path d="M-8 1h4v-6h6v-3h6v3h5v6h4v10h-4v5H-5v-4h-5V5h2Z" fill="#c0c5b8"/><path d="M-2 5h4v5h-4m6-4h4v5H4" fill="#b7978b"/></g>
    </>}
    <text x="28" y="252" fill="#e8eef7" fontSize="11" fontFamily="Microsoft YaHei,sans-serif">字幕留在本机</text>
  </svg>;
};
