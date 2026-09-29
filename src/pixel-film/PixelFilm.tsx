import React from 'react';
import {AbsoluteFill,Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import timeline from '../timeline.json';
import {PixelShot} from './cast';
import {PixelPlanet,Privacy} from './World';
import {Watching,Reaction} from './Viewing';
import {AppShot,Translation} from './Product';
import {BrandReveal} from './BrandReveal';

const Shot:React.FC<{shot:PixelShot}> = ({shot}) => {
  const f=useCurrentFrame(),{width:W,height:H}=useVideoConfig();
  switch(shot.kind){
    case 'planet':return <PixelPlanet f={f}/>;
    case 'watch':return <Watching f={f} W={W} H={H} viewer={shot.viewer??0} source={shot.source??1} push={shot.duration>=240}/>;
    case 'reaction':return <Reaction f={f} W={W} H={H} viewer={shot.viewer??0}/>;
    case 'happy':return <Reaction f={f} W={W} H={H} viewer={shot.viewer??0} happy/>;
    case 'app':return <AppShot f={f} W={W} H={H}/>;
    case 'start':return <AppShot f={f} W={W} H={H} start/>;
    case 'select':return <Translation f={f} W={W} H={H} select/>;
    case 'translate':return <Translation f={f} W={W} H={H} pair={shot.pair??0}/>;
    case 'connect':return <PixelPlanet f={f} connected/>;
    case 'privacy':return <Privacy f={f} W={W} H={H}/>;
    case 'brand':return <BrandReveal/>;
    default:throw new Error(`Unknown pixel-film shot: ${shot.kind}`);
  }
};

export const PixelFilm:React.FC = () => {
  const {width,height}=useVideoConfig();
  const shots:PixelShot[]=height>width?timeline.pixelFilm.vertical:timeline.pixelFilm.landscape;
  return <AbsoluteFill style={{background:'#121927'}}>{shots.map(shot=><Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration} name={`${shot.id} ${shot.label}`}><Shot shot={shot}/></Sequence>)}</AbsoluteFill>;
};
