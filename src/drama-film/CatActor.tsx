import React, {useId} from 'react';
import {cats} from '../pixel-film/cast';
import {ease, facePose, mix, type Performance} from './acting';

const INK = '#263748';

export const CatHead: React.FC<{
  id: number; lids?: number; eyeX?: number; eyeY?: number; ear?: number; jaw?: number; surprise?: number;
}> = ({id, lids = .88, eyeX = 2, eyeY = 0, ear = 0, jaw = 0, surprise = 0}) => {
  const uid = useId().replace(/:/g, '');
  const c = cats[id], calico = id === 1, tabby = id === 0, round = id === 3;
  const fur = calico ? '#e9e1c9' : c.fur;
  const shadow = calico ? '#a5ada7' : c.shadow;
  const eyes = calico ? '#b4b979' : c.eyes;
  const opening = Math.max(0, Math.min(1, lids));
  return <g shapeRendering="crispEdges">
    <g transform={`rotate(${-ear} 31 35)`}>
      <path d={round ? 'M18 39V24H22V19H28V21H34V27H40V39Z' : 'M17 40V10H21V13H26V17H31V22H36V28H41V40Z'} fill={fur}/>
      <path d={round ? 'M23 26H29V30H34V37H23Z' : 'M21 17H24V22H29V27H34V33H26V37H21Z'} fill={calico ? '#c59278' : '#baa89b'}/>
      <path d="M18 12V36M21 14V27" stroke="#d0d1be" fill="none"/>
    </g>
    <g transform={`rotate(${ear} 82 35)`}>
      <path d={round ? 'M72 39V27H78V22H84V19H90V24H94V40Z' : 'M70 40V28H76V22H81V17H87V12H92V40Z'} fill={calico ? '#414b54' : shadow}/>
      <path d="M85 22H89V36H80V30H83Z" fill="#a0a29d"/>
      <path d="M91 15V38H95" stroke="#c8d5d0" fill="none"/>
    </g>
    <path d={round ? 'M32 28H78V32H90V39H98V49H102V66H98V76H88V83H76V87H39V84H27V79H18V71H13V54H17V42H24V34H32Z' : 'M35 28H75V31H86V35H94V43H100V61H96V72H89V80H76V86H43V84H32V80H24V74H18V64H14V47H19V39H27V33H35Z'} fill={fur}/>
    <path d="M69 30H79V34H89V40H95V49H98V62H94V72H87V79H76V84H66V77H71V65H74V45H69Z" fill={shadow}/>
    {calico && <>
      <path d="M22 35H33V30H45V34H51V44H47V52H36V58H23V54H18V43H22Z" fill="#ac7652"/>
      <path d="M71 29H82V34H90V42H96V58H85V54H75V46H68V36H71Z" fill="#34424b"/>
      <path d="M29 35H34V39H29M25 43H29V46H25" fill="#c89464"/>
    </>}
    {tabby && <>
      <path d="M43 29H48V38H52V34H56V42H60V35H64V40H68V30H73V46H65V43H61V49H55V43H50V46H43Z" fill="#435163"/>
      <path d="M17 48H29V52H17M20 60H32V64H20M85 47H98V51H85M84 62H94V66H84" fill="#435163"/>
      <path d="M31 36h5v4h-5m45 0h5v4h-5" fill="#b7bbaa"/>
    </>}
    <path d="M36 66H47V64H64V66H77V70H81V77H74V82H66V85H46V82H35V78H31V71H36Z" fill={calico ? '#f0ead7' : id === 4 ? '#839dab' : '#cbd0ba'}/>
    {[0, 1].map(side => {
      const x = side ? 67 : 29, y = side ? 51 : 50;
      return <g key={side}>
        <defs><clipPath id={`${uid}-${side}`}>
          <rect x={x} y={y + 14 * (1 - opening)} width="20" height={14 * opening}/>
        </clipPath></defs>
        {opening > .09 ? <g clipPath={`url(#${uid}-${side})`}>
          <rect x={x} y={y} width="20" height="17" fill="#d8dfc5"/>
          <rect x={x + 3 + eyeX} y={y - 1 + eyeY} width="13" height="19" fill={eyes}/>
          <rect x={x + 7 + eyeX - surprise} y={y - 1 + eyeY} width={4 + surprise * 3} height="19" fill="#172934"/>
          <rect x={x + 6 + eyeX} y={y + 2} width="2" height="3" fill="#f0f5dc"/>
          <rect x={x + 2} y={y + 11} width="3" height="2" fill="#d0d9b4" opacity=".65"/>
        </g> : null}
        <path d={`M${x - 1} ${y + 13 * (1 - opening)}h14v2h6`} stroke={INK} fill="none" strokeWidth="1.6"/>
        <path d={`M${x + 2} ${y + 15}h12`} stroke={shadow} fill="none"/>
        <path d={`M${x + 1} ${y - 4 - surprise * 4}h5v-1h8`} stroke={shadow} strokeWidth="2" fill="none"/>
      </g>;
    })}
    <path d="M50 69H65V72H61V76H56V73H50Z" fill={id === 4 ? '#4e6374' : '#b59588'}/>
    <path d={`M59 76v${3 + jaw}h-6m6 0h6`} stroke="#667c80" fill="none"/>
    {jaw > 1 && <path d={`M56 78h7v${jaw + 1}h-2v1h-3v-1h-2Z`} fill="#334657"/>}
    <path d="M10 68H28V70H36M7 76H24V75H35M80 70H98V67H113M81 76H99V78H115" stroke="#d8ddcd" fill="none"/>
    <path d="M93 38h3v9h3v12h-3v10h-5v7h-7v4h-8" stroke="#d7e3d7" fill="none"/>
    <path d="M39 71h1v1h-1m4 4h1v1h-1m31-2h1v1h-1" fill="#8a9c94"/>
  </g>;
};

export const Chip = () => <g>
  <path d="M0 3h4V0h7v3h4v8h-3v4H4v-3H0Z" fill="#d8ad67"/>
  <path d="M3 5h2v5H3m5-7h2v6H8m4-3h2v5h-2" fill="#efd19c"/>
</g>;

export const CatActor: React.FC<{id?: number; f: number; performance?: Performance; snack?: boolean}> = ({id = 0, f, performance = 'watch', snack = false}) => {
  const c = cats[id], pose = facePose(f, performance);
  const frozen = performance === 'lost' || performance === 'deadpan';
  const breath = frozen ? 0 : Math.sin(f / 60 * Math.PI * 2 / 4.8) * .002;
  const eat = performance === 'snack' ? ease(f, 0, 30) : 0;
  const swat = performance === 'swat' ? ease(f, 37, 48) - ease(f, 60, 82) : 0;
  const magic = performance === 'magic' ? ease(f, 12, 38) - ease(f, 84, 112) : 0;
  const handX = mix(82, 65, eat) + 25 * swat + 9 * magic;
  const handY = mix(snack ? 77 : 111, 78, eat) - 50 * swat - 20 * magic;
  return <g shapeRendering="crispEdges">
    <path d="M22 140H89V143H99V146H16V143H22Z" fill="#17263a"/>
    <path d="M30 118H18V122H13V132H18V139H31" fill="none" stroke={c.shadow} strokeWidth="9"/>
    <g transform={`translate(0 ${-120 * breath}) scale(1 ${1 + breath})`}>
      <path d="M35 78H79V85H85V99H91V126H94V138H24V126H27V100H31V88H35Z" fill={c.fur}/>
      <path d="M65 80H78V88H83V102H86V129H91V138H64Z" fill={c.shadow}/>
      <path d="M40 84H66V92H70V99H65V107H61V114H55V108H49V101H45V94H40Z" fill={id === 4 ? '#a2b4b8' : '#d0d3bb'}/>
      {id === 0 && <path d="M29 98H41V103H29M27 111H40V116H27M75 103H86V108H75" fill="#435163"/>}
    </g>
    <path d="M33 117H46V130H49V141H26V137H30V127H33Z" fill={c.fur}/>
    <path d="M68 125H81V134H87V141H62V136H67Z" fill={c.fur}/>
    <path d="M32 137v4m6-4v4m31-4v4m6-4v4" stroke={c.shadow}/>
    <g transform={`translate(59 ${66 + pose.headY}) scale(${performance === 'lost' ? 1.035 : 1}) translate(-59 -66)`}><CatHead id={id} {...pose}/></g>
    <path d={`M80 96L${handX + 4} ${handY + 8}`} stroke={c.fur} strokeWidth="13" fill="none"/>
    <g transform={`translate(${handX} ${handY})`}>
      <path d="M-5 0H5V3H9V12H4V16H-5V12H-8V4H-5Z" fill={c.fur}/>
      <path d="M-3 10v4m5-5v4" stroke={c.shadow}/>
      {(snack || performance === 'snack') && eat < .96 && <g transform="translate(-5 -11) scale(.8)"><Chip/></g>}
    </g>
  </g>;
};
