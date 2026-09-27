import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PixelRoom, PixelBack, PixelReaction} from '../story-tv/styles/PixelScene';
import {CatSprite} from '../pixel-film/PixelCats';
import {Place} from '../pixel-film/Places';
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

export const RoomView: React.FC<{
  W: number; H: number; children: React.ReactNode; zoom?: number; viewer?: number; f?: number;
}> = ({W, H, children, zoom = 0, viewer = 0, f = 0}) => {
  const p = H > W;
  const scale = p ? mix(1, 1.4, zoom) : mix(1, 2.55, zoom);
  const centerX = p ? W / 2 : mix(W / 2, 1272, zoom);
  const centerY = p ? mix(H / 2, 533, zoom) : mix(H / 2, 450, zoom);
  const tx = W / 2 - centerX * scale;
  const ty = (p ? H / 2 - 120 * zoom : H / 2) - centerY * scale;
  return <AbsoluteFill style={{background: '#162436'}}>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: `translate(${tx}px,${ty}px) scale(${scale})`}}>
      {p ? <svg width="100%" height="100%" viewBox="0 0 270 480" shapeRendering="crispEdges">
        <rect width="270" height="480" fill="#24364c"/><path d="M0 314H270V480H0Z" fill="#354a61"/>
        <svg x="8" y="10" width="80" height="120" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
        <path d="M7 10H88V130H7ZM44 10V129" stroke="#8095a6" fill="none" strokeWidth="2"/>
        <path d="M1 7H24V122H0M78 7H99V138H82Z" fill="#53687b"/>
        <svg x="212" y="10" width="36" height="49"><Poster/></svg>
        <path d="M5 208H265V255H5Z" fill="#647d91"/><path d="M12 217H135V247H12M141 217H258V247H141" fill="#263d57"/>
        <path d="M17 255v12m237-12v12" stroke="#a4b4bb" strokeWidth="3"/>
        <path d="M49 286H172V297H186V393H46Z" fill="#71879c"/>
        <g transform="translate(72 237) scale(1.7)">{viewer === 0 ? <PixelBack/> : <CatSprite id={viewer} frame={f} back/>}</g>
        <path d="M39 354H186V364H205V480H32V369H39Z" fill="#536d8b"/><path d="M38 361H185V369H198" stroke="#91a4b1" fill="none" strokeWidth="2"/>
        <path d="M37 367H49V479H24V384H32V370M199 365H215V390H224V480H204Z" fill="#3b5370"/>
        <path d="M65 377H97V480H64Z" fill="#bcbaa7"/><path d="M64 390H97M64 404H97M64 418H97M64 432H97M64 446H97" stroke="#829394" strokeWidth="2"/>
        <path d="M209 294H270V303H209Z" fill="#a6a491"/><path d="M214 303v74m49-74v76" stroke="#627c8d" strokeWidth="5"/>
        <path d="M214 287H242V297H217Z" fill="#bda778"/><path d="M242 286H261V295H241Z" fill="#a9c0c0"/>
        <path d="M222 224H248V240H222Z" fill="#132334"/><rect x="242" y="228" width="2" height="2" fill="#72b59d"/>
      </svg> : <>
        <PixelRoom windowView={<Place id={viewer} night/>} viewer={viewer === 0 ? <PixelBack/> : <CatSprite id={viewer} frame={f} back/>}/>
        <svg viewBox="0 0 480 270" width="100%" height="100%" style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">
          <svg x="430" y="28" width="31" height="44"><Poster/></svg>
          <path d="M169 206H211V213H167Z" fill="#879993"/><path d="M174 213V247M204 213V246" stroke="#485d75" strokeWidth="4"/>
          <path d="M170 195H189V198H193V205H170Z" fill="#baa477"/><path d="M174 195v-3h5v3m4 0v-4h5v4" fill="#e0bd80"/>
          <path d="M199 198H206V204H196V201H199Z" fill="#b8c9c7"/><path d="M201 198v-7h15v-14" stroke="#152737" fill="none"/>
          <path d="M412 166h15v7h-15m7-7v-4h-9v-7" fill="none" stroke="#152737" strokeWidth="2"/>
        </svg>
      </>}
      <div style={{position: 'absolute', left: p ? 40 : 908, top: p ? 246 : 240, width: p ? 1000 : 728, height: p ? 574 : 422, background: '#071321', boxShadow: '0 4px 0 #8196a3,0 15px 35px #0b182555'}}/>
      <div style={{position: 'absolute', left: p ? 48 : 920, top: p ? 256 : 252, width: p ? 984 : 704, height: p ? 553.5 : 396, overflow: 'hidden'}}>
        <div style={{width: 1280, height: 720, transformOrigin: '0 0', transform: `scale(${p ? .76875 : .55})`}}>{children}</div>
      </div>
      <div style={{position: 'absolute', left: p ? 60 : 922, top: p ? 773 : 620, opacity: .72, transform: 'scale(.65)', transformOrigin: '0 0'}}><PixelLogo size={40}/></div>
    </div>
    <Atmosphere/>
  </AbsoluteFill>;
};

export const ReactionView: React.FC<{
  W: number; H: number; f: number; performance: Performance; viewer?: number;
}> = ({W, H, f, performance, viewer = 0}) => {
  const p = H > W;
  const actor = <CatActor id={viewer} f={f} performance={performance} snack={performance === 'lost' || performance === 'watch'}/>;
  return <AbsoluteFill style={{background: '#203046'}}>
    {p ? <svg width="100%" height="100%" viewBox="0 0 270 480" shapeRendering="crispEdges">
      <rect width="270" height="480" fill="#293c51"/>
      <svg x="12" y="18" width="91" height="128" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice"><Place id={viewer} night/></svg>
      <path d="M11 17H104V147H11ZM55 18V146" fill="none" stroke="#8097a8" strokeWidth="2"/>
      <path d="M10 216H181V224H196V431H7V230H10Z" fill="#607e98"/><path d="M18 225H177V232H187" stroke="#a6b4bd" fill="none"/>
      <path d="M29 409H209V480H17V421H29Z" fill="#8497a9"/>
      <g transform="translate(30 148) scale(1.85)">{actor}</g>
      <path d="M239 40H270V480H251V393H247V298H243V160H239Z" fill="#102032"/><path d="M239 40V160H243V298H247V393H251V480" stroke="#c1d3dc" fill="none"/>
      <path d="M5 425H49V480H5Z" fill="#516f8b"/>
      <path d="M181 397H232V405H181Z" fill="#a5aa9d"/><path d="M186 405v72m41-72v72" stroke="#526c80" strokeWidth="4"/>
      <path d="M185 387H209V398H186Z" fill="#bca274"/><path d="M212 390H226V397H212Z" fill="#c5d2cb"/>
    </svg> : <>
      <PixelReaction frame={f} actor={actor}/>
      <svg viewBox="0 0 480 270" width="100%" height="100%" style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">
        <path d="M320 211H382V219H316Z" fill="#a2a99b"/><path d="M325 219V270M374 219V270" stroke="#557084" strokeWidth="5"/>
        <path d="M322 202H349V212H325Z" fill="#bca274"/><path d="M357 204H370V213H353V209H357Z" fill="#c9d7d3"/><path d="M361 204v-8h17" stroke="#1b2d43" fill="none"/>
        {performance === 'magic' && f < 114 && <g transform={`translate(${mix(418, 309, ease(f, 5, 43)) + 49 * ease(f, 79, 112)} ${mix(120, 167, ease(f, 5, 43)) + 38 * ease(f, 79, 112)}) rotate(${mix(-14, 0, ease(f, 43, 76))})`} opacity={1 - ease(f, 93, 115)}>
          <rect x="-8" y="-8" width="37" height="37" rx="8" fill="#dbe9dd" opacity=".12"/>
          <PixelLogo size={22}/>
        </g>}
      </svg>
    </>}
    {p && performance === 'magic' && f < 114 && <div style={{position: 'absolute', left: mix(935, 733, ease(f, 5, 43)) + 95 * ease(f, 79, 112), top: mix(810, 1175, ease(f, 5, 43)) + 380 * ease(f, 79, 112), opacity: 1 - ease(f, 93, 115), transform: 'rotate(-9deg)'}}><PixelLogo size={110}/></div>}
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(105deg,rgba(7,18,32,.16),transparent 65%,rgba(162,193,204,.08))'}}/>
    <Atmosphere/>
  </AbsoluteFill>;
};
