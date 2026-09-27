import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../timeline.json';
import {App, Confusion, End, Intro, Privacy, Product, Trio, Watch} from './Scenes';
import {Planet} from './World';
import {FONT} from './cast';

export type Shot = {id:string;from:number;duration:number;kind:string;label:string;sample:number;cat?:number;source?:number};

const Scene: React.FC<{shot:Shot}> = ({shot}) => {
  const f=useCurrentFrame(),{width:W,height:H}=useVideoConfig();
  const size={f,W,H};
  switch(shot.kind){
    case 'planet': return <Planet frame={f} width={W} height={H}/>;
    case 'intro': return <Intro {...size} id={shot.cat??0}/>;
    case 'trio': return <Trio {...size}/>;
    case 'watch': return <Watch {...size} viewer={shot.cat??0} source={shot.source??1}/>;
    case 'confusion': return <Confusion {...size}/>;
    case 'app': return <App {...size}/>;
    case 'start': return <App {...size} start/>;
    case 'select': return <Product {...size} mode="select"/>;
    case 'magic': return <Product {...size} mode="magic"/>;
    case 'pair': return <Product {...size} mode="pair" id={shot.cat??1}/>;
    case 'connect': return <Planet frame={f} width={W} height={H} connected/>;
    case 'privacy': return <Privacy {...size}/>;
    case 'happy': return <Watch {...size} viewer={0} source={3} happy/>;
    case 'end': return <End {...size}/>;
    default: throw new Error(`Unknown shot ${shot.kind}`);
  }
};

export const StoryFilm: React.FC = () => {
  const {width,height}=useVideoConfig(),portrait=height>width;
  const shots:Shot[]=portrait?timeline.catPlanet.vertical:timeline.catPlanet.landscape;
  return <AbsoluteFill style={{background:'#152333',fontFamily:FONT}}>
    {shots.map(shot=><Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration} name={`${shot.id} ${shot.label}`}><Scene shot={shot}/></Sequence>)}
    <div style={{position:'absolute',right:32,top:24,font:'500 22px '+FONT,color:'#fff',opacity:.5}}>分镜预演 · 非性能演示</div>
    <Audio src={staticFile(`audio/cat-planet-${portrait?'30':'60'}.wav`)}/>
  </AbsoluteFill>;
};
