import React from 'react';
import {Img, staticFile} from 'remotion';
import {Capture} from '../../../launch-15s/src/film/Capture';
import {Plate} from '../../../launch-15s/src/film/Plate';
import {Brand} from '../../../launch-15s/src/film/Brand';
import {layout} from '../../../launch-15s/src/film/layout';
import {sourceFont, sourceSizeFor} from '../../../launch-15s/src/film/Footage';
import {Cat} from './Cat';
import {Landscape, Prop} from './World';
import {CAST, FONT, LANGUAGES, clamp, smooth} from './cast';

type Size = {W: number; H: number; f: number};
const titleStyle: React.CSSProperties = {position:'absolute',left:85,right:85,top:85,fontFamily:FONT,fontWeight:600,fontSize:62,lineHeight:1.24,color:'#f7eddb'};

export const Vlog: React.FC<{id:number; f:number; subtitle?:boolean; label?:boolean}> = ({id,f,subtitle=true,label=true}) => {
  const c=CAST[id];
  return <div style={{position:'absolute',inset:0,overflow:'hidden',background:c.sky}}>
    <div style={{position:'absolute',inset:-15,transform:`scale(${1+f*.00005})`}}><Landscape id={id} frame={f}/></div>
    <div style={{position:'absolute',left:'31%',top:'12%',width:'36%',height:'62%',transform:`translateY(${Math.sin(f/34)*3}px)`}}><Cat id={id} frame={f} mood={id===5?'sleep':'happy'}/></div>
    <div style={{position:'absolute',left:'30%',top:'61%',width:'38%',height:'25%'}}><Prop id={id}/></div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#122433ba,transparent 35%)'}}/>
    {label && <div style={{position:'absolute',top:'6%',left:'6%',font:'600 30px '+FONT,color:'#fff6e5',letterSpacing:2}}>● {c.name} / {c.label}</div>}
    {subtitle && <div lang={c.lang} style={{position:'absolute',left:'4%',right:'4%',bottom:'8%',textAlign:'center',color:'#fff',font:'600 38px '+FONT,textShadow:'0 3px 6px #000',lineHeight:1.25}}>{c.source}</div>}
  </div>;
};

export const Intro: React.FC<Size & {id:number}> = ({W,H,f,id}) => {
  const portrait=H>W;
  return <>
    <Vlog id={id} f={f} subtitle={false} label={false}/>
    <div style={{...titleStyle,top:65,fontSize:30,letterSpacing:5}}>CAT PLANET / DAILY VLOG</div>
    <div style={{...titleStyle,top:128,fontSize:portrait?75:72}}>{CAST[id].name}<span style={{fontSize:32,fontWeight:400,marginLeft:26}}>{CAST[id].label}</span></div>
    <div lang={CAST[id].lang} style={{position:'absolute',left:90,right:90,bottom:125,color:'#fff9ec',textShadow:'0 3px 8px #102334',font:'600 56px '+FONT,textAlign:'center'}}>{CAST[id].source}</div>
  </>;
};

export const Trio: React.FC<Size> = ({W,H,f}) => <>
  <div style={{...titleStyle,top:65,fontSize:48}}>各有各的日常。</div>
  {[3,4,5].map((id,i)=><div key={id} style={{position:'absolute',left:70+i*(W-110)/3,top:175,width:(W-170)/3,height:H-295,overflow:'hidden',borderRadius:28,transform:`translateY(${(1-smooth((f-i*12)/25))*60}px)`}}>
    <Vlog id={id} f={f+i*18} subtitle={false}/>
    <div lang={CAST[id].lang} style={{position:'absolute',bottom:52,left:24,right:24,textAlign:'center',font:'600 37px '+FONT,color:'#fff5e7',textShadow:'0 2px 5px #122334'}}>{CAST[id].source}</div>
  </div>)}
</>;

export const Watch: React.FC<Size & {viewer:number; source:number; happy?:boolean}> = ({W,H,f,viewer,source,happy=false}) => {
  const p=H>W;
  const mx=p?72:730,my=p?355:240,mw=p?W-144:W-800,mh=p?760:655;
  return <>
    <div style={{position:'absolute',inset:0,opacity:.48,filter:'blur(4px)'}}><Landscape id={viewer} frame={f*.25}/></div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#152332 3%,transparent 90%)'}}/>
    <div style={{...titleStyle,fontSize:p?69:62}}>{happy?'原来，你也这样。':'画面很熟悉。字幕却看不懂。'}</div>
    <div style={{position:'absolute',left:mx,top:my,width:mw,height:mh,border:'12px solid #202d3d',borderRadius:22,boxShadow:'0 32px 65px #09132288',overflow:'hidden',transform:`perspective(1800px) rotateY(${p?0:-3+smooth(f/150)*2}deg)`}}>
      <Vlog id={source} f={f}/>
      {happy && <div style={{position:'absolute',left:'5%',right:'5%',bottom:'0%',height:'9%',background:'#0b0b0b',color:'#fff',font:'500 32px '+FONT,textAlign:'center',paddingTop:7}}>{CAST[source].translation}</div>}
    </div>
    <div style={{position:'absolute',left:p?190:45,top:p?1190:362,width:p?670:660,height:p?610:650,transform:`rotate(${happy?0:Math.sin(f/45)*2}deg)`}}><Cat id={viewer} frame={f} mood={happy?'happy':'puzzled'} paw={happy?smooth(f/50):0}/></div>
    {!happy && <div style={{position:'absolute',left:p?720:555,top:p?1200:315,font:'600 138px '+FONT,color:'#f0dba5',transform:`rotate(${Math.sin(f/20)*8}deg)`}}>?</div>}
    <div style={{position:'absolute',left:mx,top:my-56,font:'500 28px '+FONT,color:'#d6e0de'}}>{CAST[source].label} → {CAST[viewer].name}</div>
  </>;
};

export const Confusion: React.FC<Size> = ({W,H,f}) => <>
  <div style={{...titleStyle,textAlign:'center',top:90}}>同一个纸箱梗，隔着不同的字幕。</div>
  {CAST.map((c,i)=><div key={c.name} style={{position:'absolute',left:100+i*(W-220)/6,top:H*.4+(i%2)*65,width:(W-170)/6,height:H*.47,transform:`translateY(${Math.sin(f/25+i)*12}px)`}}><Cat id={i} frame={f+i*13} mood="puzzled"/><div style={{position:'absolute',top:-85,left:'45%',font:'600 90px '+FONT,color:'#edcf94'}}>?</div></div>)}
</>;

export const App: React.FC<Size & {start?:boolean}> = ({W,H,f,start=false}) => {
  const p=H>W,w=p?W-140:990,h=w*626/850,x=p?70:820,y=p?360:205;
  const tx=x+w*(start?.51:.846),ty=y+h*(start?.7:.57);
  return <>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 70% 50%,#243c4d,#101b2b 75%)'}}/>
    <div style={{...titleStyle,fontSize:p?70:60}}>{start?'开始翻译。':'给字幕，画一个框。'}</div>
    <div style={{position:'absolute',left:p?200:100,top:p?1110:390,width:p?670:580,height:p?650:600}}><Cat id={0} frame={f} paw={smooth(f/60)*.5}/></div>
    <Img src={staticFile('story/app-home.png')} style={{position:'absolute',left:x,top:y,width:w,height:h,boxShadow:'0 30px 80px #0008',borderRadius:12}}/>
    <svg width="52" height="66" viewBox="0 0 30 40" style={{position:'absolute',left:tx+(1-smooth(f/85))*160,top:ty+(1-smooth(f/85))*160,filter:'drop-shadow(0 3px 4px #0008)'}}><path d="M2 2L27 23L16 25L12 37Z" fill="#f8f9ff" stroke="#172434" strokeWidth="2"/></svg>
    <div style={{position:'absolute',left:p?80:x,top:y+h+35,color:'#becdd6',font:'500 28px '+FONT}}>Windows 11 · 主显示器 · 已完成引擎与识别语言安装</div>
  </>;
};

export const Product: React.FC<Size & {mode:string; id?:number}> = ({W,H,f,mode,id=3}) => {
  const p=H>W;
  const c=CAST[id];
  const source=c.source;
  const target=id===1?'en-US':id===4?'zh-TW':'zh-CN';
  const translation=c.translation;
  const L=layout(W,H);
  L.box={x:p?85:220,y:p?1150:740,w:p?W-170:W-440,h:p?118:90};
  L.plate={x:L.box.x,y:L.box.y+L.box.h+14,w:L.box.w,h:p?148:100};
  L.sourceSize=p?48:54;L.plateTextSize=p?49:53;
  const vf=mode==='select'?30+clamp(f/105)*61:mode==='magic'?94+clamp(f/100)*100:94+clamp(f/55)*105;
  const line={source,translation};
  const sourceSize=sourceSizeFor(line,c.lang,L);
  const ready=vf>=124;
  return <>
    <Vlog id={id} f={f} subtitle={false} label={false}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#122335d0,transparent 45%,#10192588)'}}/>
    <div style={{...titleStyle,top:p?125:83,fontSize:p?72:61,whiteSpace:'pre-line'}}>{mode==='select'?'框住画面上已有的字幕。':ready?(id===3?(p?'看懂了。\n原来你也爱纸箱。':'看懂了。原来我们都爱纸箱。'):'看懂了。原来你也这样。'):'Windows OCR → 本机 AI 翻译'}</div>
    {mode!=='select' && <div style={{position:'absolute',left:85,top:p?305:176,color:'#e0e7e6',font:'500 32px '+FONT}}>{c.label} → {id===1?'English':id===4?'繁體中文':'简体中文'}</div>}
    <div lang={c.lang} style={{position:'absolute',left:L.box.x,top:L.box.y,width:L.box.w,height:L.box.h,display:'flex',alignItems:'center',justifyContent:'center',font:sourceFont(c.lang,sourceSize),whiteSpace:'nowrap',color:'white',textShadow:'0 3px 6px #000'}}>{source}</div>
    <Capture f={vf} L={L} opacity={1} scans={[{start:94,end:118,line,lang:c.lang}]}/>
    {mode!=='select' && <Plate f={vf} L={L} lines={[{start:124,clear:118,text:translation,lang:target,light:false,stagger:1.5}]}/>}
    {mode==='select' && vf>86 && <div style={{position:'absolute',left:L.box.x+L.box.w-235,top:L.box.y+L.box.h+24,background:'linear-gradient(#f4f7fc,#d9e1ee)',color:'#0a0e16',borderRadius:8,padding:'14px 22px',font:'600 26px "Segoe UI"'}}>✓ Use this area</div>}
    <div style={{position:'absolute',left:85,right:85,bottom:p?255:48,font:'500 '+(p?32:29)+'px '+FONT,color:'#e2e6e7'}}>{mode==='select'?'只读取框内文字 · 不识别语音':'译文显示在原字幕正下方，与选框等宽'}</div>
  </>;
};

export const Privacy: React.FC<Size> = ({W,H,f}) => {
  const p=H>W,swat=smooth((f-105)/18),flight=smooth((f-125)/50);
  return <>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 40% 60%,#365a63,#132434 75%)'}}/>
    <div style={{...titleStyle,fontSize:p?74:65}}>字幕留在这台电脑。</div>
    <div style={{position:'absolute',left:p?90:130,top:p?490:400,width:p?850:900,height:p?510:480,border:'14px solid #9cafbd',borderRadius:24,background:'#0d1928',boxShadow:'0 0 65px #bbd1c528'}}>
      <div style={{position:'absolute',inset:30}}><Vlog id={3} f={f} subtitle={false}/></div>
      <div style={{position:'absolute',left:'8%',right:'8%',bottom:32,padding:17,borderRadius:10,background:'#0b0b0b',color:'white',textAlign:'center',font:'500 40px '+FONT}}>新猫窝？我选纸箱。</div>
      <div style={{position:'absolute',left:160,right:160,bottom:-42,height:25,background:'#b0bec8',borderRadius:15}}/>
    </div>
    <div style={{position:'absolute',left:p?200:1120,top:p?1050:390,width:p?700:550,height:p?660:550}}><Cat id={0} frame={f} paw={swat}/></div>
    {!p && <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position:'absolute',inset:0,opacity:swat*(1-smooth((f-190)/25)),pointerEvents:'none'}}>
      <path d={`M1500 790Q1540 ${600-swat*60} ${1480-swat*120} ${680-swat*295}`} fill="none" stroke="#bc8150" strokeWidth="57" strokeLinecap="round"/>
      <g transform={`translate(${1480-swat*120} ${680-swat*295}) rotate(-25)`}><ellipse rx="37" ry="43" fill="#f3d8ae"/><ellipse cy="9" rx="17" ry="19" fill="#d59892"/>{[-20,0,20].map(x=><ellipse key={x} cx={x} cy="-20" rx="8" ry="11" fill="#d59892"/>)}</g>
    </svg>}
    <div style={{position:'absolute',left:(p?540:1280)+flight*500,top:(p?260:210)-flight*430,width:290,height:200,transform:`rotate(${flight*90}deg)`,opacity:1-flight}}>
      <svg viewBox="0 0 300 200" width="100%"><path d="M59 146C-20 124 2 56 64 60C73-12 174-11 197 50C279 17 328 116 264 148Z" fill="#bed0dc"/><path d="M111 117l24-13m35 0l24 13" stroke="#526378" strokeWidth="6" strokeLinecap="round"/><path d="M105 147Q88 212 32 181M217 144Q264 174 280 138" fill="none" stroke="#bed0dc" strokeWidth="13" strokeLinecap="round"/></svg>
    </div>
    <div style={{position:'absolute',left:90,right:90,bottom:p?260:108,font:'600 '+(p?42:40)+'px '+FONT,color:'#f3e5c9'}}>Windows OCR 与 AI 翻译在本机运行</div>
    <div style={{position:'absolute',left:90,right:90,bottom:p?170:52,font:'500 '+(p?31:29)+'px '+FONT,color:'#c0d0d4'}}>首次设置、修复和更新需要联网下载</div>
  </>;
};

export const End: React.FC<Size> = ({W,H,f}) => {
  const L=layout(W,H),vf=746+Math.min(f,180)*.75;
  return <>
    <div style={{position:'absolute',inset:0,background:'#07090f'}}/>
    <Capture f={vf} L={L} opacity={1-smooth((vf-780)/13)} scans={[]}/>
    <Brand f={vf} L={L}/>
    <div style={{position:'absolute',left:70,right:70,bottom:H>W?230:124,textAlign:'center',color:'#b9c5d7',font:'500 '+(H>W?33:30)+'px '+FONT,opacity:smooth((f-90)/25)}}>公开测试版 · 仅主显示器 · 读取画面文字</div>
    <div style={{position:'absolute',left:85,right:85,bottom:H>W?130:63,textAlign:'center',color:'#98a7be',font:'500 '+(H>W?29:28)+'px '+FONT,lineHeight:1.5,opacity:smooth((f-90)/25)}}>{LANGUAGES}</div>
  </>;
};
