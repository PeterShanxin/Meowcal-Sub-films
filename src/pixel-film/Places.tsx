import React from 'react';
import {cats} from './cast';

export const Place: React.FC<{id:number;night?:boolean}> = ({id,night=false}) => {
  const r=cats[id].region,sky=night?'#334b68':'#a4b6b2',far=night?'#506379':'#7f9a9e',near=night?'#24394f':'#526f7d';
  return <g shapeRendering="crispEdges">
    <rect width="160" height="110" fill={sky}/><path d="M0 65H160V110H0Z" fill={far}/>
    <path d="M119 13h13v3h4v12h-4v4h-13v-4h-4V16h4Z" fill={night?'#bbcbd2':'#f0dfb8'}/>
    {(r==='china'||r==='korea'||r==='japan')&&<>
      <path d="M0 87V76H9V64H19V50H29V38H37V31H43V42H52V54H62V69H73V81H82V86H93V76H104V60H114V49H122V60H132V76H143V86H160V110H0Z" fill={far}/>
      {r==='japan'&&<path d="M30 40V35H37V29H43V35H49V41H41V38H36V41Z" fill="#dde0cf"/>}
      <path d="M5 82H66V110H5ZM90 84H153V110H90Z" fill={near}/>
      <path d="M0 79H8V76H19V73H31V69H41V73H53V76H65V79H71V84H0ZM82 82H92V77H105V73H116V70H126V74H140V78H153V82H160V87H82Z" fill="#344f62"/>
      {r==='korea'&&<path d="M5 75v4h10m137-5v8h-10" stroke="#c2c5ab" strokeWidth="2" fill="none"/>}
    </>}
    {r==='britain'&&<>
      <path d="M0 58H38V110H0M43 46H84V110H43M90 62H128V110H90M135 54H160V110H135" fill={near}/>
      <path d="M0 56H40M41 44H86M88 60H130M133 52H160" stroke="#334858" strokeWidth="5"/>
      <path d="M11 48h7v10m36-19h7v10m42 4h7v10m35-19h7v10" stroke={near} strokeWidth="6" fill="none"/>
      {Array.from({length:8},(_,i)=><path key={i} d={`M${8+i*20} 70h7v10h-7m0 8h7v10h-7`} fill={night?'#c9af82':'#bac5ba'}/>)}
    </>}
    {r==='france'&&<>
      <path d="M0 67H47V110H0M50 53H105V110H50M109 68H160V110H109" fill={near}/>
      <path d="M0 66v-9h5V43h36v14h6v9ZM50 52V40h6V24h43v16h6v12ZM109 67V55h6V43h39v12h6v12Z" fill="#3b556a"/>
      <path d="M12 49h8v10h-8m6 20h10v13H18m46-57h9v13h-9m19-13h9v13h-9m-19 20h9v13h-9m19-13h9v13h-9m-19 23h9v13h-9m19-13h9v13h-9m35-45h8v10h-8m7 20h10v13h-10" fill={night?'#d4b88d':'#bdc8c1'}/>
    </>}
    {r==='germany'&&<>
      <path d="M7 65H69V110H7M84 49H151V110H84" fill="#a7ada2"/>
      <path d="M0 65v-6h8v-8h9v-8h9v-8h12v-7h7v7h9v8h9v8h9v8h7v6ZM77 49v-7h8v-8h9v-8h9v-8h9v-7h9v7h9v8h9v8h9v8h9v7Z" fill={near}/>
      <path d="M12 68v42m52-42v42m-28-42v42m-29-23h62m21-35v58m55-58v58m-30-58v58m-31-34h67M13 69l23 18l28-18m26-16l26 23l28-23" stroke="#4e6570" strokeWidth="3" fill="none"/>
      <path d="M21 94h10v14H21m22-14h10v14H43m50-47h11v12H93m33-12h11v12h-11m-33 24h11v12H93m33-12h11v12h-11" fill={night?'#d6b482':'#465e6d'}/>
    </>}
  </g>;
};
