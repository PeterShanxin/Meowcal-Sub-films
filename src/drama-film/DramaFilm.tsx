import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../timeline.json';
import {PixelPlanet} from '../pixel-film/World';
import {BrandReveal} from '../pixel-film/BrandReveal';
import {CatActor} from './CatActor';
import {Episode} from './Episode';
import {RoomView, ReactionView} from './Room';
import {Screen, selectionFrame} from './Screen';
import {ease} from './acting';

type Shot = {id: string; kind: string; from: number; duration: number};

const Privacy: React.FC<{f: number}> = ({f}) => {
  const reach = ease(f, 4, 77), flight = ease(f, 90, 132);
  return <AbsoluteFill style={{background: '#25394e'}}>
    <div style={{position: 'absolute', left: 104, top: 120, width: 1100, height: 620, border: '12px solid #132234', boxShadow: '0 6px 0 #a0b2ba'}}><Episode f={900 + f} wide/></div>
    <svg viewBox="0 0 480 270" width="100%" height="100%" style={{position: 'absolute'}} shapeRendering="crispEdges">
      <path d="M0 225H480V270H0Z" fill="#34495e"/>
      <path d="M146 187v27h-17v5h68v-5h-17v-27" fill="#95a7b1"/>
      <path d="M265 203h29v13h-29Z" fill="#152638"/><rect x="288" y="207" width="2" height="2" fill="#83c3a6"/>
      <path d="M279 203v-11h-45v-6" fill="none" stroke="#152638" strokeWidth="2"/>
      <rect x="49" y="157" width="231" height="15" fill="#192938"/>
      <text x="164" y="168" textAnchor="middle" fontSize="9" fontFamily="Yu Gothic,sans-serif" fill="#f2e6c9">あと5分だけ寝る。</text>
      <rect x="49" y="174" width="231" height="18" fill="#0b0b0b"/>
      <text x="164" y="187" textAnchor="middle" fontSize="10" fontFamily="Microsoft YaHei,sans-serif" fill="#f7f7f7">我要再睡五分钟。</text>
      <g transform={`translate(${380 + flight * 160} ${60 + reach * 58 - flight * 162}) rotate(${flight * 34})`}>
        <path d="M0 15H8V7H21V0H45V7H58V15H68V34H0Z" fill="#bcced4"/>
        <path d="M22 20h5m15 0h5" stroke="#4d6677" strokeWidth="2"/>
        <path d={`M6 33H-42V${33 + reach * 32}H${-42 - reach * 58}`} stroke="#bcced4" strokeWidth="4" fill="none"/>
      </g>
      <g transform="translate(312 99) scale(.9)"><CatActor f={f - 42} performance="swat"/></g>
      {f >= 87 && f < 98 && <path d="M405 151l8-7m-11 2v-9m17 17h10" stroke="#f0dcc3" strokeWidth="2"/>}
      <text x="28" y="251" fill="#e8efed" fontSize="11" fontFamily="Microsoft YaHei,sans-serif">字幕留在本机 · 本机 AI 翻译</text>
    </svg>
  </AbsoluteFill>;
};

const FilmShot: React.FC<{shot: Shot}> = ({shot}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), p = H > W;
  const g = shot.from + f, C = timeline.dramaFilm.cues[p ? 'vertical' : 'landscape'];
  const select = selectionFrame(g, C.selectionPress, C.selectionEnd, C.ocr, C.local, C.plate);
  const room = (screen: React.ReactNode, zoom = 1, viewer = 0) => <RoomView W={W} H={H} zoom={zoom} viewer={viewer} f={f}>{screen}</RoomView>;
  const product = (episode = 600, target = 0, paused = true) => room(<Screen episode={episode} capture={select} translated={g >= C.plate} plateFrame={select} target={target} paused={paused} portrait={p}/>);
  switch (shot.kind) {
    case 'world': return <AbsoluteFill><PixelPlanet f={f}/><div style={{position: 'absolute', left: 96, bottom: 80, color: '#d9e1d6', font: '500 30px "Microsoft YaHei"', opacity: ease(f, 28, 55)}}>今晚，全星球都在追同一部剧。</div></AbsoluteFill>;
    case 'viewers': {
      const cut = Math.floor(f / 100), viewer = [0, 3, 4][Math.min(cut, 2)];
      return room(<Screen episode={80 + f} line={0} familiar target={Math.min(cut, 2)}/>, .04 * ease(f % 100, 0, 100), viewer);
    }
    case 'buildup': return room(<Screen episode={p ? 280 + f * 1.25 : 240 + f} line={f < shot.duration * .44 && !p ? 0 : 1} familiar portrait={p}/>, p ? .5 + .5 * ease(f, 0, 180) : .12 + .88 * ease(f, 0, 240));
    case 'loss': return g < C.reactionCut ? room(<Screen episode={600} portrait={p}/>) : <ReactionView W={W} H={H} f={g - C.reactionCut} performance="lost"/>;
    case 'pause': return room(<Screen episode={600} paused portrait={p}/>);
    case 'magic': return f < (p ? 100 : 120) ? <ReactionView W={W} H={H} f={f * (p ? 1.15 : 1)} performance="magic"/> : product();
    case 'scan': return <>{product()}<div style={{position: 'absolute', left: p ? 90 : 110, top: p ? 300 : 86, color: '#dce5e6', font: `500 ${p ? 36 : 28}px "Microsoft YaHei"`, opacity: .88}}>{g < C.local ? 'Windows OCR · 读取选框文字' : '本机 AI · 翻译'}</div></>;
    case 'reveal': return product();
    case 'punchline': return product(600 + f, 0, false);
    case 'deadpan': return <ReactionView W={W} H={H} f={p ? f * 1.4 : f} performance="deadpan"/>;
    case 'languages': {
      const second = f >= 180, local = f % 180, viewer = second ? 4 : 3;
      return local < 118 ? room(<Screen episode={850 + local} translated target={second ? 2 : 1}/>, 1, viewer) : <ReactionView W={W} H={H} f={90 + (local - 118)} performance="deadpan" viewer={viewer}/>;
    }
    case 'snack': return <ReactionView W={W} H={H} f={f} performance="snack"/>;
    case 'privacy': return <Privacy f={f}/>;
    case 'world_end': return <PixelPlanet f={f} connected/>;
    case 'brand': return <BrandReveal/>;
    default: throw new Error(`Unknown drama shot: ${shot.kind}`);
  }
};

export const DramaFilm: React.FC<{sound?: boolean}> = ({sound = true}) => {
  const {width, height} = useVideoConfig(), p = height > width;
  const shots = timeline.dramaFilm[p ? 'vertical' : 'landscape'];
  return <AbsoluteFill style={{background: '#111c30'}}>
    {shots.map(shot => <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration} name={`${shot.id} ${shot.kind}`}><FilmShot shot={shot}/></Sequence>)}
    {sound && <Audio src={staticFile(`audio/drama-${p ? 'vertical' : 'landscape'}.wav`)}/>}
  </AbsoluteFill>;
};
