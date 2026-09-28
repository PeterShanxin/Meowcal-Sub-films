import React, {useId} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../timeline.json';
import {PixelPlanet} from '../pixel-film/World';
import {BrandReveal, type Locale} from '../pixel-film/BrandReveal';
import {Cloud, type CloudMood} from './Cloud';
import {RoomView, ReactionView} from './Room';
import {Screen, selectionFrame} from './Screen';
import {ease, mix, talking} from './acting';

export type Cut = keyof typeof timeline.dramaFilm.cuts;
type CutData = (typeof timeline.dramaFilm.cuts)[Cut];
type Shot = {id: string; kind: string; from: number; duration: number};
export type DramaProps = {cut: Cut; locale: Locale; sound?: boolean};

const COPY = {
  zh: {world: '今晚，全星球都在追同一部剧。', ocr: 'Windows OCR · 读取选框文字', local: '本机 AI · 翻译', privacy: '字幕文字留在你的电脑上。'},
  en: {world: 'Tonight, the whole planet is watching the same show.', ocr: 'Windows OCR · reading the selection', local: 'Local AI · translating', privacy: 'Your subtitle text stays on your PC.'},
};

const Super: React.FC<{text: string; portrait: boolean; opacity: number; high?: boolean}> = ({text, portrait, opacity, high = false}) =>
  <div style={{position: 'absolute', left: portrait ? 72 : 96, right: portrait ? 72 : undefined, ...(portrait && high ? {top: 230} : {bottom: portrait ? 470 : 80}), color: '#e3eae4',
    font: `500 ${portrait ? 46 : 40}px "Segoe UI","Microsoft YaHei",sans-serif`, textShadow: '0 2px 10px #07101c', opacity}}>{text}</div>;

const CloudAt: React.FC<{x: number; y: number; s: number; mood: CloudMood; f: number; reach?: [number, number]; look?: number; turn?: number}> = ({x, y, s, turn = 0, ...cloud}) =>
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) rotate(${turn}) scale(${s})`}><Cloud {...cloud}/></g>;

/** Clips its children to a window's glass, so what is outside stays behind it. */
const Glass: React.FC<{rect: number[]; children: React.ReactNode}> = ({rect: [x, y, w, h], children}) => {
  const id = useId().replace(/:/g, '');
  return <g><defs><clipPath id={id}><rect x={x} y={y} width={w} height={h}/></clipPath></defs><g clipPath={`url(#${id})`} opacity={.9}>{children}</g></g>;
};

// Visible glass of the reaction shot's window, between the curtains.
const REACTION_GLASS = {landscape: [49, 20, 64, 130], portrait: [13, 19, 89, 126]};

/** The cloud outside the viewer's window: squashed flat when it presses against the glass. */
const CloudOutside: React.FC<{p: boolean; x: number; y: number; s: number; f: number; press?: number; mood: CloudMood}> = ({p, press = 0, ...cloud}) =>
  <Glass rect={REACTION_GLASS[p ? 'portrait' : 'landscape']}>
    <g transform={`translate(${cloud.x} ${cloud.y}) scale(${1 + .22 * press} ${1 - .22 * press}) translate(${-cloud.x} ${-cloud.y})`}><CloudAt {...cloud}/></g>
  </Glass>;

/**
 * The cloud squeezes in through the window, tiptoes across the room and tugs at the
 * translation; the viewer's eyes slide over and one paw swats it away.
 */
const Privacy: React.FC<{f: number; inAt: number; split: number; hit: number; W: number; H: number; locale: Locale}> = ({f, inAt, split, hit, W, H, locale}) => {
  const p = H > W;
  if (f < split) {
    const squeeze = ease(f, inAt, inAt + 18), pop = ease(f, inAt + 18, inAt + 26), inside = f >= inAt + 18;
    const cross = ease(f, inAt + 30, split - 50), tug = ease(f, split - 35, split - 10) - .3 * ease(f, split - 10, split - 2);
    const {glass, from, landed, to, s, reach} = p
      ? {glass: [24, 10, 54, 120], from: [38, 48], landed: [58, 58], to: [168, 118], s: .42, reach: [46, 116] as [number, number]}
      : {glass: [46, 24, 75, 126], from: [70, 56], landed: [100, 58], to: [342, 94], s: .55, reach: [52, 98] as [number, number]};
    const hop = cross > 0 && cross < 1 ? Math.abs(Math.sin(cross * Math.PI * 4)) * 7 : 0;
    const x = inside ? mix(mix(from[0], landed[0], pop), to[0], cross) : from[0];
    const y = (inside ? mix(mix(from[1], landed[1], pop), to[1], cross) : from[1]) - hop;
    const squash = inside ? 0 : squeeze;
    const look = f < inAt + 30 ? 1 : cross < 1 ? Math.sign(Math.sin(f / 9)) : 1;
    const cloud = <g transform={`translate(${x} ${y}) scale(${1 - .45 * squash} ${1 + .2 * squash}) translate(${-x} ${-y})`}>
      <CloudAt x={x} y={y} s={s} f={f} mood={tug > .2 ? 'grab' : 'curious'} look={look} reach={f > split - 45 ? reach : undefined}/>
    </g>;
    return <RoomView W={W} H={H} viewer={0} f={f} overlay={inside ? cloud : <Glass rect={glass}>{cloud}</Glass>}>
      <Screen episode={940 + f} translated plateFrame={230} portrait={p} tug={tug}/>
    </RoomView>;
  }
  const g = f - split, flight = ease(g, hit + 2, hit + 26);
  const [x0, y0, x1, y1, s] = p ? [290, 238, 212, 236, .8] : [450, 118, 340, 104, .9];
  const x = mix(x0, x1, ease(g, 0, hit - 2)) + (p ? 180 : 260) * flight, y = mix(y0, y1, ease(g, 0, hit - 2)) - (p ? 240 : 150) * flight;
  const mood: CloudMood = g >= hit ? 'hit' : 'grab';
  const poof = g >= hit && g < hit + 12;
  const overlay = <>
    <CloudAt x={x} y={y} s={s} f={f} mood={mood} turn={32 * flight} reach={g < hit ? [-18, 40] : undefined}/>
    {poof && <path d={p ? 'M205 228l-9-7m7 18h-11m17 8l-6 9' : 'M334 98l-9-7m7 18h-11m17 8l-6 9'} stroke="#f0dcc3" strokeWidth="2"/>}
  </>;
  return <>
    <ReactionView W={W} H={H} f={g - hit + 45} performance="swat" viewer={0} overlay={overlay}/>
    <Super text={COPY[locale].privacy} portrait={p} opacity={ease(g, hit + 8, hit + 24)}/>
  </>;
};

const FilmShot: React.FC<{shot: Shot; cut: CutData; locale: Locale}> = ({shot, cut, locale}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), p = H > W;
  const short = cut.duration < 3000;
  const g = shot.from + f, C = cut.cues, copy = COPY[locale];
  const talk = talking(g, cut.voice.filter(v => v.who === 'momo'));
  const select = selectionFrame(g, C.selectionPress, C.selectionEnd, C.ocr, C.local, C.plate);
  const room = (screen: React.ReactNode, zoom = 1, viewer = 0) => <RoomView W={W} H={H} zoom={zoom} viewer={viewer} f={f}>{screen}</RoomView>;
  const product = (episode = 600, paused = true) => room(<Screen episode={episode} capture={select} translated={g >= C.plate} plateFrame={select} paused={paused} portrait={p} talk={talk}/>);
  switch (shot.kind) {
    case 'world': return <AbsoluteFill>
      <PixelPlanet f={f} portrait={p}>
        <CloudAt x={mix(360, 262, ease(f, 10, 150))} y={mix(46, 64, ease(f, 10, 150))} s={.45} f={f} mood={f > 165 ? 'grab' : 'curious'} look={-1}/>
      </PixelPlanet>
      <Super text={copy.world} portrait={p} opacity={ease(f, 28, 55)} high/>
    </AbsoluteFill>;
    case 'viewers': {
      const block = Math.floor(f / 100), viewer = [0, 3, 4][Math.min(block, 2)];
      return room(<Screen episode={80 + f} line={0} familiar target={Math.min(block, 2)} talk={talk}/>, .04 * ease(f % 100, 0, 100), viewer);
    }
    case 'buildup': return room(<Screen episode={short ? 280 + f * 300 / shot.duration : 240 + f} line={!short && f < shot.duration * .44 ? 0 : 1} familiar portrait={p} talk={talk}/>,
      short ? .5 + .5 * ease(f, 0, 180) : .12 + .88 * ease(f, 0, 240));
    case 'loss': return g < C.reactionCut ? room(<Screen episode={600} portrait={p} talk={talk}/>) : <ReactionView W={W} H={H} f={g - C.reactionCut} performance="lost"/>;
    case 'pause': return room(<Screen episode={600} paused portrait={p}/>);
    case 'magic': return f < (short ? 100 : 120) ? <ReactionView W={W} H={H} f={f * (short ? 1.15 : 1)} performance="magic"/> : product();
    case 'scan': return <>{product()}<div style={{position: 'absolute', left: p ? 90 : 110, top: p ? 300 : 86, color: '#dce5e6', font: `500 ${p ? 36 : 28}px "Segoe UI","Microsoft YaHei"`, opacity: .88}}>{g < C.local ? copy.ocr : `${copy.local}${'.'.repeat(1 + Math.floor((g - C.local) / 8) % 3)}`}</div></>;
    case 'reveal': return product();
    case 'punchline': return product(600 + f, false);
    case 'deadpan': return <ReactionView W={W} H={H} f={f} performance="deadpan" overlay={'cloudPeek' in C &&
      <CloudOutside p={p} x={p ? 30 : 62} y={mix(p ? 150 : 158, p ? 100 : 112, ease(g, C.cloudPeek, C.cloudPeek + 25))} s={p ? .45 : .5} f={f} mood="curious"/>}/>;
    case 'languages': {
      const second = f >= 180, local = f % 180, viewer = second ? 4 : 3;
      return local < 118 ? room(<Screen episode={850 + local} translated target={second ? 2 : 1} portrait={p}/>, 1, viewer) : <ReactionView W={W} H={H} f={90 + (local - 118)} performance="deadpan" viewer={viewer}/>;
    }
    case 'snack': return <ReactionView W={W} H={H} f={f} performance="snack" overlay={'cloudGlass' in C &&
      <CloudOutside p={p} x={mix(p ? -10 : 20, p ? 32 : 62, ease(g, C.cloudGlass, C.cloudGlass + 18))} y={p ? 60 : 70} s={p ? .5 : .55} f={f} mood="grab" press={ease(g, C.cloudGlass + 20, C.cloudGlass + 28)}/>}/>;
    case 'privacy': {
      if (!('privacyCut' in C)) throw new Error('The privacy shot needs privacyCut and swat cues');
      return <Privacy f={f} inAt={C.cloudIn - shot.from} split={C.privacyCut - shot.from} hit={C.swat - C.privacyCut} W={W} H={H} locale={locale}/>;
    }
    case 'world_end': return <PixelPlanet f={f} connected portrait={p}>
      <CloudAt x={mix(300, 430, ease(f, 20, 170))} y={mix(62, 40, ease(f, 20, 170))} s={.28} f={f} mood="sulk" look={1}/>
    </PixelPlanet>;
    case 'brand': return <BrandReveal locale={locale}/>;
    default: throw new Error(`Unknown drama shot: ${shot.kind}`);
  }
};

export const DramaFilm: React.FC<DramaProps> = ({cut: name, locale, sound = true}) => {
  const cut = timeline.dramaFilm.cuts[name];
  return <AbsoluteFill style={{background: '#111c30'}}>
    {cut.shots.map(shot => <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration} name={`${shot.id} ${shot.kind}`}><FilmShot shot={shot} cut={cut} locale={locale}/></Sequence>)}
    {sound && <Audio src={staticFile(`audio/drama-${name}.wav`)}/>}
  </AbsoluteFill>;
};
