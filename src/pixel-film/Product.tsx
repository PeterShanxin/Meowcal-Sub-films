import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Capture} from '../film/Capture';
import {Plate} from '../film/Plate';
import {layout} from '../film/layout';
import {sourceFont,sourceSizeFor} from '../film/Footage';
import {ease} from '../story-tv/styles/motion';
import {PixelSurface} from './PixelSurface';
import {Vlog} from './Viewing';
import {cats,pairs} from './cast';

export const AppShot:React.FC<{f:number;W:number;H:number;start?:boolean}> = ({f,W,H,start=false}) => {
  const p=H>W,w=p?W-90:1320,h=w*626/850,x=(W-w)/2,y=(H-h)/2;
  const targetX=start ? .5 : .838,targetY=start ? .7 : .57,reach=ease(f,0,65);
  return <AbsoluteFill style={{background:'#142237'}}>
    <div style={{position:'absolute',left:x,top:y}}><PixelSurface src="story/app-home.png" width={w} height={h} cell={p?2:3}/></div>
    <svg width="52" height="64" viewBox="0 0 26 32" shapeRendering="crispEdges" style={{position:'absolute',left:x+w*targetX+(1-reach)*170,top:y+h*targetY+(1-reach)*180}}><path d="M1 1h3v3h3v3h3v3h3v3h3v3h3v3h-8v3h3v6H9v-6H6v-3H3v3H1Z" fill="#f1f5fc" stroke="#233148"/></svg>
    <div style={{position:'absolute',bottom:p?240:35,left:45,right:45,textAlign:'center',color:'#aebed0',font:'500 '+(p?32:28)+'px "Microsoft YaHei",sans-serif'}}>Windows 11 · 主显示器</div>
  </AbsoluteFill>;
};

export const Translation:React.FC<{f:number;W:number;H:number;pair?:number;select?:boolean}> = ({f,W,H,pair=0,select=false}) => {
  const p=H>W,c=pairs[pair],source=cats[c.source],L=layout(W,H),line={source:source.source,translation:c.text};
  L.box=p?{x:64,y:1120,w:W-128,h:110}:{x:180,y:836,w:W-360,h:84};
  L.plate={x:L.box.x,y:L.box.y+L.box.h+14,w:L.box.w,h:p?142:100};
  L.sourceSize=p?48:52;L.plateTextSize=p?45:50;
  const vf=select?30+ease(f,0,145)*61:pair===0?90+Math.min(f,165)*.46:116+Math.min(f,165)*.46;
  const size=sourceSizeFor(line,source.lang,L);
  return <AbsoluteFill style={{background:'#18283b'}}>
    <div style={{position:'absolute',left:p?-270:160,top:p?405:20,width:p?1620:1600,height:p?911:900}}><Vlog id={c.source} f={f} caption={false}/></div>
    {p&&<div style={{position:'absolute',left:0,right:0,top:1100,height:410,background:'#18283b'}}/>}
    <div lang={source.lang} style={{position:'absolute',left:L.box.x,top:L.box.y,width:L.box.w,height:L.box.h,display:'flex',alignItems:'center',justifyContent:'center',background:'#20313d',color:'#fff3da',font:sourceFont(source.lang,size),whiteSpace:'nowrap'}}>{line.source}</div>
    <Capture f={vf} L={L} opacity={1} scans={[{start:94,end:118,line,lang:source.lang}]}/>
    {!select&&<Plate f={vf} L={L} lines={[{start:124,clear:118,text:c.text,lang:c.target,light:false,stagger:1.2}]}/>}
    {select&&vf>87&&<div style={{position:'absolute',left:L.box.x+L.box.w-268,top:L.box.y+L.box.h+24,background:'#e8eef7',color:'#0a0e16',borderRadius:8,padding:'12px 20px',font:'600 28px "Segoe UI"'}}>✓ Use this area</div>}
    <div style={{position:'absolute',left:p?66:180,top:p?155:48,padding:'10px 16px',background:'#142236',color:'#c6d1da',font:'500 '+(p?35:28)+'px "Microsoft YaHei",sans-serif'}}>{select?'框住已有字幕':`${source.lang==='en-US'?'English':'한국어'} → ${c.target==='zh-CN'?'简体中文':c.target==='fr-FR'?'Français':'Deutsch'}`}</div>
    {!select&&vf<124&&<div style={{position:'absolute',left:L.box.x,top:p?1430:972,color:'#b8c9d8',font:'500 27px "Segoe UI","Microsoft YaHei",sans-serif'}}>{vf<118?'Windows OCR':'本机 AI 翻译'}</div>}
  </AbsoluteFill>;
};
