import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {PixelRoom, PixelReaction, type RoomPalette} from '../story-tv/styles/PixelScene';
import {CatSprite} from '../pixel-film/PixelCats';
import {Place} from '../pixel-film/Places';
import {cats} from '../pixel-film/cast';
import {CatActor, CatHead} from './CatActor';
import {ease, mix, type Performance} from './acting';

export const PixelLogo: React.FC<{size?: number}> = ({size = 56}) => <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
  <path d="M5 1H27V3H30V6H31V27H29V30H5V29H2V26H1V5H3V2H5Z" fill="#131e2e" stroke="#aebdce"/>
  <path d="M7 15V7H9V9H12V11H21V9H24V7H26V16H27V22H24V25H11V23H8V20H7V15Z" fill="none" stroke="#e1e9ed" strokeWidth="2"/>
</svg>;

const Poster = () => <svg viewBox="0 0 44 60" width="100%" height="100%" shapeRendering="crispEdges">
  <rect width="44" height="60" fill="#112538"/><path d="M26 0H41V49H26Z" fill="#537a86"/>
  <g transform="translate(0 3) scale(.37)"><CatHead id={1} lids={.65} eyeX={0}/></g>
  <path d="M5 42H38V44H5M11 47H33V49H11M16 53H28V54H16" fill="#c2ccb9"/>
</svg>;

export const Atmosphere: React.FC = () => <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 63% 39%, transparent 38%, rgba(5,12,24,.48) 100%)', boxShadow: 'inset 0 0 80px #07111c55'}}/>;

// Same show, three homes: each viewer's room keeps its own palette, wall and table.
type Home = {palette: RoomPalette; wall: 'plaster' | 'brick' | 'stone'};
const HOMES: Record<number, Home> = {
  0: {palette: {back: '#202a3e', wall: '#30394a', column: '#293347', floor: '#344059'}, wall: 'plaster'},
  3: {palette: {back: '#2b2228', wall: '#3c3036', column: '#33282e', floor: '#3f3945'}, wall: 'brick'},
  4: {palette: {back: '#1d2d32', wall: '#2c3e43', column: '#243439', floor: '#324649'}, wall: 'stone'},
};
const home = (viewer: number) => HOMES[viewer] ?? HOMES[0];

const WallTexture: React.FC<{kind: Home['wall']; x: number; y: number; w: number; h: number}> = ({kind, x, y, w, h}) => {
  const id = useId().replace(/:/g, '');
  if (kind === 'plaster') return null;
  const brick = kind === 'brick';
  return <>
    <defs><pattern id={id} width={brick ? 16 : 24} height={brick ? 16 : 14} patternUnits="userSpaceOnUse">
      {brick ? <path d="M0 7.5H16M0 15.5H16M.5 0V7M8.5 8V15" stroke="#58434a" strokeWidth="1" opacity=".55"/>
        : <path d="M0 13.5H24M.5 0V13M12 7.5H24M12.5 7V13" stroke="#48626a" strokeWidth="1" opacity=".5"/>}
    </pattern></defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`}/>
  </>;
};

/** Chestnut from behind, three-quarters turned toward the TV so a cheek and whiskers show. */
const ViewerBack: React.FC = () => {
  const c = cats[0];
  return <g shapeRendering="crispEdges">
    <path d="M8 80H-3V77H-7V84H8Z" fill={c.fur}/>
    <path d="M14 50H52V54H57V62H60V80H56V85H10V80H7V62H10V54H14Z" fill={c.fur}/>
    <path d="M10 58H22V85H10V80H7V62H10Z" fill={c.shadow}/>
    <path d="M12 57h11v3H12M41 63h14v3H41M9 68h12v3H9M43 73h13v3H43M13 79h10v3H13M30 52h2v30h-2Z" fill={c.patch}/>
    <path d="M18 46H50V51H18Z" fill={c.shadow}/>
    <path d="M14 22V10H17V8H20V11H23V14H26V22Z" fill={c.fur}/>
    <path d="M14 10h3v12h-3Z" fill={c.shadow}/>
    <path d="M42 20V13H45V9H48V6H51V8H53V22Z" fill={c.fur}/>
    <path d="M49 10h2v8h-2Z" fill="#baa89b"/>
    <path d="M16 18H52V21H55V26H57V38H55V43H51V47H17V43H13V38H11V26H13V21H16Z" fill={c.fur}/>
    <path d="M11 26H18V47H17V43H13V38H11Z" fill={c.shadow}/>
    <path d="M26 18h3v10h-3M32 18h3v12h-3M38 18h3v10h-3" fill={c.patch}/>
    <path d="M55 29h3v9h-3Z" fill="#cbd0ba"/>
    <path d="M57 33H68M57 37H67" stroke="#d8ddcd" fill="none"/>
    <path d="M56 26h1v12h-1M59 62h1v18h-1M52 8h1v12h-1" fill="#dfe9dd" opacity=".7"/>
  </g>;
};

/** Side-table props in reaction-shot coordinates: snacks, a tea mug, a small plant. */
const TableProps: React.FC<{viewer: number}> = ({viewer}) => viewer === 3
  ? <g><path d="M333 199H347V213H333ZM347 202H352V209H347" fill="#c9b9a5"/><path d="M336 199h8v2h-8Z" fill="#6d4a3a"/><path d="M337 195v-4m5 3v-5" stroke="#b8c4c6" opacity=".55"/></g>
  : viewer === 4
    ? <g><path d="M331 203H347V213H331Z" fill="#8e6f59"/><path d="M335 203V193H338V188H341V195H344V203" fill="#5f7d6a"/><path d="M329 193h6v3h-6M342 190h6v3h-6" fill="#6f8f78"/></g>
    : <g><path d="M322 202H349V212H325Z" fill="#bca274"/><path d="M357 204H370V213H353V209H357Z" fill="#c9d7d3"/></g>;

export const RoomView: React.FC<{
  W: number; H: number; children: React.ReactNode; zoom?: number; viewer?: number; f?: number; overlay?: React.ReactNode;
}> = ({W, H, children, zoom = 0, viewer = 0, f = 0, overlay}) => {
  const p = H > W, {palette, wall} = home(viewer);
  const scale = p ? mix(1, 1.4, zoom) : mix(1, 2.55, zoom);
  const centerX = p ? W / 2 : mix(W / 2, 1272, zoom);
  const centerY = p ? mix(H / 2, 533, zoom) : mix(H / 2, 450, zoom);
  const tx = W / 2 - centerX * scale;
  const ty = (p ? H / 2 - 120 * zoom : H / 2) - centerY * scale;
  const sitter = viewer === 0 ? <ViewerBack/> : <CatSprite id={viewer} frame={f} back/>;
  return <AbsoluteFill style={{background: '#162436'}}>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: `translate(${tx}px,${ty}px) scale(${scale})`}}>
      {p ? <svg width="100%" height="100%" viewBox="0 0 270 480" shapeRendering="crispEdges">
        <rect width="270" height="480" fill={palette.wall}/><WallTexture kind={wall} x={0} y={0} w={270} h={314}/>
        <path d="M0 314H270V480H0Z" fill={palette.floor}/>
        <svg x="8" y="10" width="80" height="120" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
        <path d="M7 10H88V130H7ZM44 10V129" stroke="#8095a6" fill="none" strokeWidth="2"/>
        <path d="M1 7H24V122H0M78 7H99V138H82Z" fill="#53687b"/>
        <svg x="212" y="10" width="36" height="49"><Poster/></svg>
        <path d="M5 208H265V255H5Z" fill="#647d91"/><path d="M12 217H135V247H12M141 217H258V247H141" fill="#263d57"/>
        <path d="M17 255v12m237-12v12" stroke="#a4b4bb" strokeWidth="3"/>
        <path d="M49 286H172V297H186V393H46Z" fill="#71879c"/>
        <g transform="translate(72 237) scale(1.7)">{sitter}</g>
        <path d="M39 354H186V364H205V480H32V369H39Z" fill="#536d8b"/><path d="M38 361H185V369H198" stroke="#91a4b1" fill="none" strokeWidth="2"/>
        <path d="M37 367H49V479H24V384H32V370M199 365H215V390H224V480H204Z" fill="#3b5370"/>
        <path d="M65 377H97V480H64Z" fill="#bcbaa7"/><path d="M64 390H97M64 404H97M64 418H97M64 432H97M64 446H97" stroke="#829394" strokeWidth="2"/>
        <path d="M209 294H270V303H209Z" fill="#a6a491"/><path d="M214 303v74m49-74v76" stroke="#627c8d" strokeWidth="5"/>
        <g transform="translate(-108 85)"><TableProps viewer={viewer}/></g>
        <path d="M222 224H248V240H222Z" fill="#132334"/><rect x="242" y="228" width="2" height="2" fill="#72b59d"/>
      </svg> : <>
        <PixelRoom windowView={<Place id={viewer} night/>} viewer={sitter} palette={palette} decor={<WallTexture kind={wall} x={0} y={0} w={206} h={182}/>}/>
        <svg viewBox="0 0 480 270" width="100%" height="100%" style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">
          <svg x="430" y="28" width="31" height="44"><Poster/></svg>
          <path d="M169 206H211V213H167Z" fill="#879993"/><path d="M174 213V247M204 213V246" stroke="#485d75" strokeWidth="4"/>
          <g transform="translate(-152 -7)"><TableProps viewer={viewer}/></g>
          <path d="M201 198v-7h15v-14" stroke="#152737" fill="none"/>
          <path d="M412 166h15v7h-15m7-7v-4h-9v-7" fill="none" stroke="#152737" strokeWidth="2"/>
        </svg>
      </>}
      <div style={{position: 'absolute', left: p ? 40 : 908, top: p ? 246 : 240, width: p ? 1000 : 728, height: p ? 574 : 422, background: '#071321', boxShadow: '0 4px 0 #8196a3,0 15px 35px #0b182555'}}/>
      <div style={{position: 'absolute', left: p ? 48 : 920, top: p ? 256 : 252, width: p ? 984 : 704, height: p ? 553.5 : 396, overflow: 'hidden'}}>
        <div style={{width: 1280, height: 720, transformOrigin: '0 0', transform: `scale(${p ? .76875 : .55})`}}>{children}</div>
      </div>
      <div style={{position: 'absolute', left: p ? 60 : 922, top: p ? 773 : 620, opacity: .72, transform: 'scale(.65)', transformOrigin: '0 0'}}><PixelLogo size={40}/></div>
      {overlay && <svg viewBox={p ? '0 0 270 480' : '0 0 480 270'} width="100%" height="100%" style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">{overlay}</svg>}
    </div>
    <Atmosphere/>
  </AbsoluteFill>;
};

export const ReactionView: React.FC<{
  W: number; H: number; f: number; performance: Performance; viewer?: number; overlay?: React.ReactNode; talk?: number;
}> = ({W, H, f, performance, viewer = 0, overlay, talk}) => {
  const p = H > W, {palette, wall} = home(viewer);
  const actor = <CatActor id={viewer} f={f} performance={performance} snack={performance === 'lost' || performance === 'watch'} talk={talk}/>;
  return <AbsoluteFill style={{background: palette.back}}>
    {p ? <svg width="100%" height="100%" viewBox="0 0 270 480" shapeRendering="crispEdges">
      <rect width="270" height="480" fill={palette.wall}/><WallTexture kind={wall} x={0} y={0} w={270} h={216}/>
      <svg x="12" y="18" width="91" height="128" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
      <path d="M11 17H104V147H11ZM55 18V146" fill="none" stroke="#8097a8" strokeWidth="2"/>
      <path d="M10 216H181V224H196V431H7V230H10Z" fill="#607e98"/><path d="M18 225H177V232H187" stroke="#a6b4bd" fill="none"/>
      <path d="M29 409H209V480H17V421H29Z" fill="#8497a9"/>
      <g transform="translate(30 148) scale(1.85)">{actor}</g>
      <path d="M239 40H270V480H251V393H247V298H243V160H239Z" fill="#102032"/><path d="M239 40V160H243V298H247V393H251V480" stroke="#c1d3dc" fill="none"/>
      <path d="M5 425H49V480H5Z" fill="#516f8b"/>
      <path d="M181 397H232V405H181Z" fill="#a5aa9d"/><path d="M186 405v72m41-72v72" stroke="#526c80" strokeWidth="4"/>
      <g transform="translate(-140 185)"><TableProps viewer={viewer}/></g>
      {overlay}
    </svg> : <>
      <PixelReaction frame={f} actor={actor} wall={palette.back} windowView={<Place id={viewer} night/>} decor={<WallTexture kind={wall} x={0} y={0} w={480} h={200}/>}/>
      <svg viewBox="0 0 480 270" width="100%" height="100%" style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">
        <path d="M320 211H382V219H316Z" fill="#a2a99b"/><path d="M325 219V270M374 219V270" stroke="#557084" strokeWidth="5"/>
        <TableProps viewer={viewer}/>
        <path d="M361 204v-8h17" stroke="#1b2d43" fill="none"/>
        {performance === 'magic' && f < 114 && <g transform={`translate(${mix(418, 309, ease(f, 5, 43)) + 49 * ease(f, 79, 112)} ${mix(120, 167, ease(f, 5, 43)) + 38 * ease(f, 79, 112)}) rotate(${mix(-14, 0, ease(f, 43, 76))})`} opacity={1 - ease(f, 93, 115)}>
          <rect x="-8" y="-8" width="37" height="37" rx="8" fill="#dbe9dd" opacity={.12 + .18 * ease(f, 30, 45)}/>
          <PixelLogo size={22}/>
        </g>}
        {overlay}
      </svg>
    </>}
    {p && performance === 'magic' && f < 114 && <div style={{position: 'absolute', left: mix(935, 733, ease(f, 5, 43)) + 95 * ease(f, 79, 112), top: mix(810, 1175, ease(f, 5, 43)) + 380 * ease(f, 79, 112), opacity: 1 - ease(f, 93, 115), transform: 'rotate(-9deg)'}}><PixelLogo size={110}/></div>}
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(105deg,rgba(7,18,32,.16),transparent 65%,rgba(162,193,204,.08))'}}/>
    <Atmosphere/>
  </AbsoluteFill>;
};

// Centre of the reaction close-up's head (ears to chin) in frame pixels, for cropping it into a panel.
const FACE = {landscape: [1032, 540], portrait: [540, 939]};
// Portrait rows keep this much room under the chin for the subtitle.
const PLATE_ROOM = 70;

/**
 * Three homes, one anticlimax: side by side (stacked when portrait), each viewer half-lidded
 * over the same line in its own language. `panels` are [viewer, performance frame, line].
 */
export const ReactionTriptych: React.FC<{W: number; H: number; panels: [number, number, string][]}> = ({W, H, panels}) => {
  const p = H > W, [cx, cy] = FACE[p ? 'portrait' : 'landscape'];
  const pw = p ? W : W / 3, ph = p ? H / 3 : H;
  return <AbsoluteFill style={{background: '#0a131f'}}>
    {panels.map(([viewer, f, line], i) => <div key={viewer} style={{position: 'absolute', overflow: 'hidden', left: p ? 0 : i * pw, top: p ? i * ph : 0,
      width: pw - (!p && i < 2 ? 6 : 0), height: ph - (p && i < 2 ? 6 : 0)}}>
      <div style={{position: 'absolute', width: W, height: H, left: pw / 2 - cx, top: p ? (ph - PLATE_ROOM) / 2 - cy : 0}}>
        <ReactionView W={W} H={H} f={f} performance="deadpan" viewer={viewer}/>
      </div>
      <div style={{position: 'absolute', left: 24, right: 24, bottom: p ? 14 : 90, padding: p ? '6px 16px' : '10px 16px', textAlign: 'center', background: '#0b0b0bd9',
        color: '#f6f3e8', font: `500 ${p ? 36 : 34}px "Segoe UI","Microsoft YaHei",sans-serif`, lineHeight: 1.3}}>{line}</div>
    </div>)}
  </AbsoluteFill>;
};
