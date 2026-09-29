import React from 'react';
import {CatHead} from './CatActor';
import {ease, mix} from './acting';

export const Episode: React.FC<{f: number; wide?: boolean; talk?: number}> = ({f, wide = false, talk = 0}) => {
  const lie = ease(f, 692, 812), raise = ease(f, 280, 570);
  const pat = ease(f, 621, 668) - .22 * ease(f, 668, 692);
  const shotZoom = wide ? 1 : mix(1.62, 1, ease(f, 674, 830));
  const breath = f > 825 ? Math.sin((f - 825) * Math.PI / 137) * .65 : 0;
  const headX = mix(12, 34, lie), headY = mix(0, 56, lie) + breath - 1.5 * talk;
  const pawX = mix(96, 107, pat), pawY = mix(111 - 51 * raise, 125, pat);
  return <svg viewBox="0 0 640 360" width="100%" height="100%" shapeRendering="crispEdges">
    <defs>
      <linearGradient id="episode-night" x2="0" y2="1"><stop stopColor="#17283c"/><stop offset="1" stopColor="#52626a"/></linearGradient>
      <linearGradient id="episode-window" x2="0" y2="1"><stop stopColor="#547b8b"/><stop offset="1" stopColor="#8d9a91"/></linearGradient>
      <radialGradient id="episode-vignette"><stop offset=".46" stopColor="#0a1220" stopOpacity="0"/><stop offset="1" stopColor="#07101c" stopOpacity=".7"/></radialGradient>
    </defs>
    <rect width="640" height="360" fill="url(#episode-night)"/>
    <g transform={`translate(320 158) scale(${shotZoom}) translate(-320 -158)`}>
      <path d="M0 0H169V240H0ZM477 0H640V240H477Z" fill="#263849"/>
      <path d="M174 0H478V232H174Z" fill="#a3b4ac"/><path d="M184 0H468V220H184Z" fill="url(#episode-window)"/>
      <path d="M185 186H212V179H226V156H244V137H259V116H277V126H291V146H309V158H323V177H335V192H366V183H382V162H400V142H415V164H431V181H468V220H184Z" fill="#547079"/>
      <path d="M193 198H227V181H249V177H285V196H316V182H348V199H380V181H411V175H449V198H468V220H184Z" fill="#334f5e"/>
      <path d="M312 0H319V222H312ZM182 102H469V109H182Z" fill="#c0c7b4"/>
      <path d="M181 218H470V228H179Z" fill="#768e91"/>
      {Array.from({length:27}, (_, i) => <path key={i} d={`M${190 + (i * 43) % 270} ${(i * 37 + f * .8) % 213}v${5 + i % 7}`} stroke="#c8dbd9" strokeWidth="1" opacity=".2"/>)}
      <g transform={`translate(${Math.round(Math.sin(f / 51) * 3)} 0)`}>
        <path d="M128 0H207V18H203V56H199V91H192V119H185V149H176V173H162V187H153V234H126Z" fill="#52687c"/>
        <path d="M138 0H148V159H145V214H136M162 0H173V111H168V153H157M187 0H195V53H190V90H181" fill="#78919c"/>
      </g>
      <g transform={`translate(${Math.round(Math.sin(f / 49 + .9) * 4)} 0)`}>
        <path d="M430 0H510V240H486V207H478V165H467V125H455V80H445V36H430Z" fill="#3e556a"/>
        <path d="M452 0H460V60H467V109H477V158H485V208H479V171H471V133H461V85H455M485 0H493V155H499V230H491V179H487Z" fill="#647e8e"/>
      </g>
      <path d="M0 246H640V360H0Z" fill="#35465a"/>
      <path d="M0 272H640M0 322H640M104 247L82 360M475 246L522 360" stroke="#4b5e6b" fill="none"/>
      <path d="M204 220H437V231H450V262H436V273H203V263H191V234H204Z" fill="#1d2d42"/>
      <path d="M209 215H430V224H442V251H429V259H205V251H197V228H209Z" fill="#768297"/>
      <path d="M214 223H423V229H434V245H424V251H211V245H206V230H214Z" fill="#a8a8a5"/>
      <path d="M211 252H428" stroke="#bdbbad" strokeWidth="2"/>
      <path d="M254 250H391V254H254Z" fill="#263648" opacity=".6"/>
      <g transform="translate(248 92) scale(1.05)">
        <path d={`M23 123H3V114H-4V101H0V94H11V104H17V115H30Z`} fill="#a67955"/>
        <path d={`M${mix(38, 27, lie)} ${mix(77, 103, lie)}H${mix(86, 103, lie)}V${mix(90, 116, lie)}H112V134H101V141H30V136H24V119H30V99H35Z`} fill="#dfd8c0"/>
        <path d="M36 106H51V125H42V136H26V124H31Z" fill="#ac7652"/>
        <path d="M79 112H107V135H96V141H70V133H80Z" fill="#a4afa7"/>
        <path d="M35 126H50V135H55V143H27V137H32ZM81 127H97V136H108V143H77V138H81Z" fill="#ede5cd"/>
        <path d="M34 139v4m7-4v4m46-4v4m7-4v4" stroke="#899d9b"/>
        <g transform={`translate(${headX} ${headY}) rotate(${mix(-3, 8, lie)} 59 72) scale(${mix(1, .86, lie)})`}>
          <CatHead id={1} lids={mix(.69, .02, ease(f, 736, 803))} eyeX={-1 + 2 * ease(f, 170, 270)} eyeY={0} ear={mix(-1, 3, lie)} jaw={talk * 6}/>
        </g>
        <path d={`M88 99L${pawX} ${pawY}`} stroke="#ede5cd" strokeWidth="14" fill="none"/>
        <g transform={`translate(${pawX} ${pawY})`}><path d="M-7-4H4V0H8V9H3V13H-8V8H-11V0H-7Z" fill="#ece4cd"/><path d="M-5 7v4m6-5v5" stroke="#99aaa3"/></g>
      </g>
      <path d="M189 31L401 230H469L271 20Z" fill="#d3e1c5" opacity=".06"/>
    </g>
    <rect width="640" height="360" fill="url(#episode-vignette)"/>
  </svg>;
};
