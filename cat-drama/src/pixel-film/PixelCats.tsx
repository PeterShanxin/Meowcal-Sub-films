import React from 'react';
import {PixelBack,PixelBobtail,PixelFace} from '../story-tv/styles/PixelScene';
import {acting} from '../story-tv/styles/motion';
import {cats} from './cast';

export const CatSprite: React.FC<{id:number;frame:number;back?:boolean;happy?:boolean}> = ({id,frame,back=false,happy=false}) => {
  if(id===0) return back?<PixelBack/>:<PixelFace frame={happy?200:frame} happy={happy}/>;
  const c=cats[id],a=acting(frame,true),round=id===3,slim=id===5;
  const headOffset=Math.round(a.head*(round?1:2));
  return <g transform={back?'scale(.62) translate(0 -4)':undefined}>
    <path d="M20 136H96V141H15V138H20Z" fill="#182638"/>
    <path d={slim?'M42 76H73V83H79V108H83V132H87V137H32V130H36V105H40Z':'M32 76H82V83H90V99H94V119H99V132H93V137H24V132H19V116H24V94H28V84H32Z'} fill={c.fur}/>
    <path d="M66 81H80V91H86V112H90V131H94V136H66Z" fill={c.shadow}/>
    {!back&&<path d="M45 84H70V95H65V103H61V111H55V104H50V98H45Z" fill={id===2?'#f6eed7':c.fur}/>}
    {id===2&&<path d="M29 88H39V98H33V112H24V105H27Z" fill={c.patch}/>}
    {slim&&Array.from({length:4},(_,i)=><path key={i} d={`M38 ${92+i*8}h8v3h6m25-3h-7v3h-5`} fill="none" stroke={c.patch} strokeWidth="2"/>)}
    <path d="M33 116H47V130H50V138H26V133H30ZM71 116H84V129H90V138H65V132H70Z" fill={c.fur}/>
    <path d="M32 134v4m6-4v4m35-4v4m6-4v4" fill="none" stroke={c.shadow}/>
    <g transform={`translate(${back?0:headOffset} 0)`}>
      <path d={round?'M22 39V22H26V18H32V23H39V27H75V23H81V18H87V22H91V39H97V47H102V63H98V72H91V79H82V85H31V81H22V75H16V65H12V48H17V40Z':slim?'M24 36V6H29V10H34V16H39V22H46V26H70V22H75V15H80V8H87V36H93V46H97V63H91V74H83V80H73V86H44V83H34V78H26V70H20V62H17V44H22Z':'M21 38V15H25V18H31V23H37V28H75V22H82V16H88V37H94V45H99V62H94V73H86V80H74V86H43V83H32V79H25V72H18V62H15V47H19Z'} fill={c.fur}/>
      <path d="M73 29H82V25H86V40H91V48H96V61H92V72H85V79H74V84H68V69H73Z" fill={c.shadow}/>
      {!round&&<path d={slim?'M27 13H30V19H35V25H37V31H27ZM82 15H85V32H76V28H79V21H82Z':'M24 21H27V26H33V31H36V36H25ZM82 24H86V37H77V32H80Z'} fill="#b6a8a4"/>}
      {round&&<path d="M25 25H32V33H25M81 25H87V33H81" fill={c.shadow}/>}
      {id===2&&<path d="M25 23H34V28H45V34H48V44H43V51H33V49H22V41H25Z" fill={c.patch}/>}
      {slim&&<path d="M46 29h7v3h6v-3h8M28 57h8v4h6m39-4h8v4h5" fill="none" stroke={c.patch} strokeWidth="2"/>}
      {!back&&<>
        <path d="M38 64H52V62H65V65H79V76H71V82H45V79H34V70H38Z" fill={id===2?'#fff3dc':c.fur}/>
        {(a.lids>.4&&!happy)?<>
          <path d="M29 49H45V52H48V60H43V63H33V60H29ZM68 49H83V52H88V60H83V63H73V60H68Z" fill={c.eyes}/>
          <path d={`M${38+Math.round(a.eye*2)} 50h3v13h-3ZM${78+Math.round(a.eye*2)} 50h3v13h-3Z`} fill="#182737"/><path d="M37 51h3v2h-3m40 0h3v2h-3" fill="#eef0d8"/>
        </>:<path d="M29 56h4v-3h10v3h5M68 56h5v-3h10v3h5" stroke="#273e50" strokeWidth="2" fill="none"/>}
        <path d="M52 68H66V71H62V75H57V72H52Z" fill={id===4?'#526878':'#b0938b'}/><path d="M60 75v4h-5m5 0h5" fill="none" stroke="#536b79"/>
        <path d="M9 68H36M8 75H35M82 69H112M83 75H116" fill="none" stroke="#cbd4ca"/>
      </>}
      {back&&<path d="M45 31h4v14h-4m16-14h4v14h-4" fill={id===2?c.patch:c.shadow}/>}
    </g>
  </g>;
};

export const VlogCat: React.FC<{id:number;frame:number}> = ({id,frame}) => {
  if(id===1) return <PixelBobtail frame={frame}/>;
  return <g>
    <g transform="translate(9 -16) scale(.66)"><CatSprite id={id} frame={frame} happy={id===4}/></g>
    {(id===0||id===3)&&<>
      <path d="M1 57H94V84H1Z" fill="#a38b69"/><path d="M1 57H94V61H1Z" fill="#d8bd8b"/>
      <path d="M1 58H43V49H3V45H-6V53H1ZM48 58H94V51H104V44H62V49H48Z" fill="#c1a174"/>
      <path d="M45 61v23M7 65h27" stroke="#7b715f" fill="none"/>
    </>}
    {id===2&&<><path d="M57 72H104V75H109V80H104V87H62V83H57Z" fill="#a4b7b6"/><path d="M61 74H102V78H62Z" fill="#445e67"/></>}
    {id===4&&<path d="M-7 75H95V81H-7Z" fill="#d9cda4"/>}
    {id===5&&<><path d="M-2 65H104V70H112V81H104V86H-4V81H-10V72H-2Z" fill="#a195b3"/><path d="M0 68H101V72H106V79H99V83H-1V79H-6V73H0Z" fill="#bcacc4"/></>}
  </g>;
};
