import React from 'react';

export type CloudMood = 'curious' | 'grab' | 'hit' | 'sulk';

const BODY = 'M0 15H8V7H21V0H45V7H58V15H68V34H0Z';

/**
 * The cloud that wants everyone's subtitles. Drawn at 68 x 34 units; `reach` is the
 * hand position in the cloud's own units.
 */
export const Cloud: React.FC<{mood?: CloudMood; f?: number; reach?: [number, number]; look?: number}> = ({mood = 'curious', f = 0, reach, look = 0}) => {
  const squash = mood === 'hit' ? .78 : 1;
  const bob = mood === 'hit' ? 0 : Math.round(Math.sin(f / 11) * 1.5);
  const eye = Math.round(look * 2);
  const [hx, hy] = reach ? reach.map(Math.round) : [0, 0];
  return <g shapeRendering="crispEdges" transform={`translate(34 ${34 + bob}) scale(${1 / squash} ${squash}) translate(-34 -34)`}>
    {reach && <path d={`M58 26H${Math.round((58 + hx) / 2)}V${hy}H${hx}`} fill="none" stroke="#c9d6dc" strokeWidth="4"/>}
    {reach && <path d={`M${hx - 4} ${hy - 3}h8v7h-2v2h-2v-2h-2v2h-2Z`} fill="#c9d6dc"/>}
    <path d={BODY} fill="#c9d6dc"/>
    <path d="M0 27H68V34H0Z" fill="#9fb2bd"/>
    <path d="M21 1H45V4H21ZM9 8H21V11H9Z" fill="#eef3f2"/>
    {mood === 'hit' ? <path d="M19 16l6 6m0-6l-6 6M40 16l6 6m0-6l-6 6" stroke="#40576f" strokeWidth="2" fill="none"/>
      : mood === 'sulk' ? <>
        <path d={`M${20 + eye} 20h6M${40 + eye} 20h6`} stroke="#40576f" strokeWidth="2"/>
        <path d="M29 28h8" stroke="#40576f" strokeWidth="1"/>
        <path d={`M30 ${38 + (f % 40) / 2}h2v3h-2Z`} fill="#8fb4cf" opacity={1 - (f % 40) / 40}/>
      </>
      : <>
        <path d={`M${21 + eye} ${mood === 'grab' ? 19 : 17}h4v${mood === 'grab' ? 3 : 5}h-4ZM${41 + eye} ${mood === 'grab' ? 19 : 17}h4v${mood === 'grab' ? 3 : 5}h-4Z`} fill="#40576f"/>
        {mood === 'grab' && <path d="M30 27h6v2h-6Z" fill="#40576f"/>}
      </>}
  </g>;
};
