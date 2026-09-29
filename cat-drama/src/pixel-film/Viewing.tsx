import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PixelRoom,PixelVlog,PixelReaction} from '../story-tv/styles/PixelScene';
import {CatSprite,VlogCat} from './PixelCats';
import {Place} from './Places';
import {cats} from './cast';
import {ease} from '../story-tv/styles/motion';

export const Vlog:React.FC<{id:number;f:number;caption?:boolean}> = ({id,f,caption=true}) => <PixelVlog frame={f} actor={<VlogCat id={id} frame={f}/>} windowView={<Place id={id}/>} caption={caption?cats[id].source:''}/>;

export const Watching:React.FC<{f:number;W:number;H:number;viewer:number;source:number;push?:boolean}> = ({f,W,H,viewer,source,push=true}) => {
  const p=H>W,t=push?ease(f,40,235):0,s=p?1+t*.15:1+t*1.64;
  if(p)return <AbsoluteFill style={{background:'#202a3e'}}>
    <svg viewBox="0 0 270 480" width="100%" height="100%" shapeRendering="crispEdges">
      <rect width="270" height="480" fill="#253247"/><path d="M0 330H270V480H0Z" fill="#34465e"/>
      <svg x="12" y="20" width="75" height="110" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
      <path d="M11 20H87V130H11ZM47 20V130" stroke="#8194ab" fill="none" strokeWidth="3"/>
      <path d="M0 15H20V130H0M77 15H97V134H80Z" fill="#52677e"/>
      <path d="M15 209H255V256H15Z" fill="#657b92"/><path d="M22 218H128V247H22M135 218H247V247H135" fill="#2b4059"/>
      <path d="M25 256V267M244 256V267" stroke="#9cabb9" strokeWidth="3"/>
      <path d="M174 248h20v-5h4v7h-24" fill="#b9c5cd"/>
      <path d="M65 284H180V293H192V395H54V301H65Z" fill="#6f839d"/>
      <g transform="translate(75 235) scale(1.65)"><CatSprite id={viewer} frame={f} back/></g>
      <path d="M48 357H191V366H204V473H42V368H48Z" fill="#536b8b"/><path d="M48 363H192" stroke="#96a7b6" strokeWidth="3"/>
      <path d="M35 366H49V475H29V383H35M198 365H213V391H221V475H202Z" fill="#3d5677"/>
      <path d="M63 377H98V479H64Z" fill="#b9b6a3"/><path d="M64 389H98M64 402H98M64 415H98M64 428H98M64 441H98" stroke="#7c898d" strokeWidth="2"/>
    </svg>
    <div style={{position:'absolute',left:W*.07,top:H*.164,width:W*.86,height:W*.86*9/16,transform:`scale(${s})`,transformOrigin:'50% 50%',border:'8px solid #101b2b',boxShadow:'0 4px 0 #7b90a7'}}><Vlog id={source} f={f}/></div>
  </AbsoluteFill>;
  const x=W/2-(W/2+(1272-W/2)*t)*s,y=H/2-(H/2+(450-H/2)*t)*s;
  return <AbsoluteFill style={{background:'#121927'}}>
    <div style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${Math.round(x)}px,${Math.round(y)}px) scale(${s})`}}>
      <PixelRoom viewer={<CatSprite id={viewer} frame={f} back/>} windowView={<Place id={viewer} night/>}/>
      <div style={{position:'absolute',left:908,top:240,width:728,height:422,background:'#0c1422',boxShadow:'0 4px 0 #526681'}}/>
      <div style={{position:'absolute',left:920,top:252,width:704,height:396}}><Vlog id={source} f={f}/></div>
    </div>
  </AbsoluteFill>;
};

export const Reaction:React.FC<{f:number;W:number;H:number;viewer:number;happy?:boolean}> = ({f,W,H,viewer,happy=false}) => H>W?<svg viewBox="0 0 270 480" width="100%" height="100%" shapeRendering="crispEdges">
  <rect width="270" height="480" fill="#25364c"/>
  <svg x="16" y="20" width="92" height="133" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
  <path d="M13 18H111V154H13ZM53 20V151" stroke="#7c91a6" fill="none" strokeWidth="3"/>
  <path d="M15 221H181V230H195V455H7V233H15Z" fill="#5c7694"/>
  <path d="M27 233H165V237H183" stroke="#90a1b1" fill="none"/>
  <path d="M40 397H214V480H32V413H40Z" fill="#788ba1"/>
  <g transform="translate(42 145) scale(1.8)"><CatSprite id={viewer} frame={f} happy={happy}/></g>
  <path d="M234 45H265V99H270V480H254V401H248V302H240V163H234Z" fill="#101b2c"/><path d="M234 45V163H240V302H248V401H254V480" stroke="#aebfd0" fill="none"/>
  {happy&&<path d="M13 411H93V417H104V480H4V423H13Z" fill="#a58d70"/>}
</svg>:<>
  <PixelReaction frame={f} actor={<CatSprite id={viewer} frame={f} happy={happy}/>}/>
  {happy&&<svg viewBox="0 0 480 270" width="100%" height="100%" style={{position:'absolute',inset:0}} shapeRendering="crispEdges"><path d="M52 235H145V243H158V270H42V247H52Z" fill="#a58d70"/><path d="M52 235H97V226H48V219H40V230H52ZM103 235H148V228H163V218H117V224H103Z" fill="#c3a983"/></svg>}
</>;
