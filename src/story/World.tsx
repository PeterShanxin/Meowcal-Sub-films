import React from 'react';
import {Cat} from './Cat';
import {CAST, FONT, smooth} from './cast';

export const Landscape: React.FC<{id: number; frame?: number}> = ({id, frame = 0}) => {
  const c = CAST[id];
  return <svg viewBox="0 0 1200 760" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="1200" height="760" fill={c.sky}/>
    <circle cx={870 + frame * .05} cy="170" r="95" fill="#ffe2b2" opacity=".75"/>
    <path d="M0 380Q180 80 380 350Q570 120 820 300Q1030 100 1200 310V760H0Z" fill={c.land} opacity=".4"/>
    <g transform={`translate(${Math.sin(frame/160)*12} 0)`} fill={c.land}>
      {id===0 && <><path d="M60 500V340H400V500ZM40 347L225 277L425 347ZM450 480V300H720V480ZM420 309L585 234L750 309Z"/><path d="M900 490V195l22 1v293m49 0V240h18v249" stroke={c.land} strokeWidth="15"/></>}
      {id===1 && <><path d="M50 465L230 130L421 465Z" opacity=".7"/><path d="M169 265L230 130L296 265L236 237Z" fill="#e4e3e5"/><path d="M710 490V329H1030V490ZM679 337L870 244L1060 337Z"/></>}
      {id===2 && <><path d="M0 490V400H120V320H270V450H380V290H510V490ZM735 489V352H1060V489ZM700 360Q880 335 1100 360L1030 318H770Z"/><path d="M620 455V190h15v265m-42-160h70" stroke={c.land} strokeWidth="12"/></>}
      {id===3 && <><path d="M80 500V280H410V500ZM65 282L170 198L285 282L390 198L450 282ZM750 500V310H1000V500Z"/><path d="M0 520Q450 440 1200 520V760H0Z" fill="#5e8074"/></>}
      {id===4 && <><path d="M120 500V260H355V500ZM90 270L150 195H325L385 270ZM600 500V290H1040V500ZM570 300L640 222H1000L1070 300Z"/><g fill="#bdacae">{[160,230,300,650,750,850,950].map(x=><rect key={x} x={x} y="330" width="29" height="60" rx="14"/>)}</g></>}
      {id===5 && <><path d="M50 500V275H350V500ZM30 282L195 130L370 282ZM640 500V282H950V500ZM620 290L795 160L977 290Z"/><path d="M90 300L290 470M290 300L90 470M690 300L900 470M900 300L690 470" stroke="#a9b4a1" strokeWidth="15"/></>}
    </g>
    <path d="M0 585Q250 505 550 570T1200 548V760H0Z" fill={c.land}/>
    <path d="M0 670Q430 605 1200 690V760H0Z" fill="#0f2939" opacity=".3"/>
  </svg>;
};

export const Prop: React.FC<{id: number}> = ({id}) => <svg viewBox="0 0 350 180" width="100%" height="100%">
  {(id===0 || id===3) && <><path d="M55 40L230 25L305 66L301 164L69 164Z" fill="#cb9970"/><path d="M55 40L19 75L70 100L109 62M230 25L335 37L305 66L220 72" fill="#e3b790"/><path d="M70 100L305 66M194 81V163" stroke="#966a4f" strokeWidth="4"/><text x="110" y="142" fontSize="28" fill="#81573f">BOX 01</text></>}
  {id===1 && <><path d="M42 49H298L330 145H15Z" fill="#253546"/>{[0,1,2,3].flatMap(r=>Array.from({length:10},(_,c)=><rect key={`${r}-${c}`} x={45+c*24-r*5} y={60+r*18} width="18" height="12" rx="3" fill="#b2bdc8"/>))}</>}
  {id===2 && <><ellipse cx="175" cy="140" rx="116" ry="25" fill="#173948" opacity=".35"/><path d="M62 54H288L263 138H86Z" fill="#eaa19a"/><ellipse cx="175" cy="56" rx="113" ry="30" fill="#f3c0b2"/><ellipse cx="175" cy="58" rx="87" ry="19" fill="#734d56"/></>}
  {id===4 && <ellipse cx="178" cy="100" rx="144" ry="58" fill="#ffdf9b" opacity=".55"/>}
  {id===5 && <path d="M44 50Q170 10 305 48L282 148Q170 119 53 150Z" fill="#c4a6af" stroke="#eed9d8" strokeWidth="8"/>}
</svg>;

export const Planet: React.FC<{frame: number; connected?: boolean; width: number; height: number}> = ({frame, connected = false, width: W, height: H}) => {
  const zoom = connected ? .94 + smooth(frame / 270) * .09 : .48 + smooth(frame / 280) * .54;
  const size = Math.min(W*.69,H*.83);
  return <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 55%, #244253, #0a1425 68%)'}}>
    {Array.from({length:45},(_,i)=><i key={i} style={{position:'absolute',left:`${(i*37.71)%100}%`,top:`${(i*23.61)%100}%`,width:i%5===0?4:2,height:i%5===0?4:2,background:'#d4e0e4',borderRadius:'50%',opacity:.2+(i%4)*.12}}/>)}
    <div style={{position:'absolute',left:(W-size)/2,top:(H-size)/2+90,width:size,height:size,transform:`scale(${zoom}) rotate(${Math.sin(frame/350)*2}deg)`}}>
      <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{overflow:'visible'}}>
        <defs><radialGradient id="ocean" cx="32%" cy="25%"><stop stopColor="#76b6b2"/><stop offset=".6" stopColor="#447d8b"/><stop offset="1" stopColor="#213e59"/></radialGradient><radialGradient id="atm"><stop offset=".86" stopColor="#b3eeee" stopOpacity="0"/><stop offset="1" stopColor="#a8dcdf" stopOpacity=".32"/></radialGradient></defs>
        <ellipse cx="500" cy="917" rx="328" ry="30" fill="#020717" opacity=".28"/>
        <path d="M285 186L260 16Q349 31 402 119M610 123L749 22L731 190" fill="#5b969d" stroke="#9ac1bb" strokeWidth="8"/>
        <circle cx="500" cy="500" r="414" fill="url(#ocean)"/>
        <path d="M173 276L279 202L410 230L433 306L331 401L377 482L291 572L195 531L123 379ZM525 180L668 166L789 298L753 423L645 410L582 511L479 403L510 314ZM534 582L660 516L841 568L789 740L669 827L534 770L498 669ZM283 699L409 687L422 814L344 853L235 789Z" fill="#a6b7a1" opacity=".95"/>
        <circle cx="500" cy="500" r="420" fill="url(#atm)"/>
        {connected && [0,1,2,3,4,5].map(i=><path key={i} d={`M${230+i%3*270} ${300+Math.floor(i/3)*300}Q500 480 ${230+(i+2)%3*270} ${300+Math.floor((i+2)%6/3)*300}`} fill="none" stroke="#f6dfa7" strokeWidth="4" strokeDasharray="9 12" opacity={smooth((frame-i*20)/30)*.7}/>)}
      </svg>
      {CAST.map((c,i)=>{
        const x=[.23,.5,.77,.25,.5,.75][i],y=[.25,.16,.29,.6,.64,.57][i];
        const lit=connected && frame>i*24;
        return <div key={c.name} style={{position:'absolute',left:`${x*100}%`,top:`${y*100}%`,width:size*.155,height:size*.2,transform:'translate(-50%,-50%)'}}>
          <div style={{position:'absolute',left:0,top:0,width:'90%',height:'70%'}}><Cat id={i} frame={frame+i*15}/></div>
          <div style={{position:'absolute',left:'8%',top:'56%',width:'84%',height:'36%',background:'#102633',border:'3px solid #a1b9ba',borderRadius:7,boxShadow:lit?'0 0 35px #fae0a188':undefined}}>
            <div style={{margin:'9% 10%',height:'35%',background:c.sky,borderRadius:2}}/>
            <div style={{margin:'6% 10%',height:'13%',background:lit?'#f4e2b7':'#526675',borderRadius:2}}/>
          </div>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',top:78,left:90,right:90,fontFamily:FONT,color:'#f5eddc',fontSize:connected?60:66,fontWeight:600,textAlign:'center'}}>{connected?'同一个世界，多一种看懂的方式。':'一颗小星球，六种猫日常。'}</div>
    {connected && <div style={{position:'absolute',bottom:78,left:0,right:0,textAlign:'center',fontFamily:FONT,color:'#c4d7d5',fontSize:30}}>故事中的连线代表彼此理解</div>}
  </div>;
};
