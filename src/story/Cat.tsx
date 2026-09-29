import React from 'react';
import {CAST} from './cast';

/** Each cat keeps its silhouette and markings across every camera setup. */
export const Cat: React.FC<{id: number; frame?: number; mood?: 'happy' | 'puzzled' | 'sleep'; paw?: number; back?: boolean}> = ({id, frame = 0, mood = 'happy', paw = 0, back = false}) => {
  const c = CAST[id];
  const round = id === 3;
  const rex = id === 5;
  const tilt = mood === 'puzzled' ? Math.sin(frame / 30) * 9 : Math.sin(frame / 55) * 2;
  const blink = frame % 211 > 202;
  return <svg viewBox="0 0 300 360" width="100%" height="100%" style={{overflow: 'visible'}}>
    <ellipse cx="150" cy="333" rx="103" ry="15" fill="#091523" opacity=".25"/>
    {id === 1 ? <circle cx="233" cy="270" r="24" fill={c.dark}/> : <path d={`M223 299 Q${286 + Math.sin(frame / 28) * 8} 304 262 237 Q249 211 261 197`} fill="none" stroke={c.fur} strokeWidth={rex ? 24 : 34} strokeLinecap="round"/>}
    <ellipse cx="150" cy="263" rx={round ? 85 : rex ? 59 : 71} ry="77" fill={c.fur}/>
    <ellipse cx="145" cy="274" rx="42" ry="54" fill={c.light}/>
    {[108, 186].map(x => <ellipse key={x} cx={x} cy="326" rx="31" ry="15" fill={c.fur}/>)}
    <g transform={`rotate(${tilt} 150 180)`}>
      <path d={round ? 'M62 145L64 40Q93 30 112 78L195 75Q220 29 239 40L236 149Z' : rex ? 'M77 145L43 8Q89 5 118 83L189 76Q220 1 256 10L225 153Z' : 'M63 149L47 32Q82 22 112 78L193 76Q221 25 248 33L231 155Z'} fill={c.fur}/>
      <path d="M65 49L80 116L108 87ZM199 90L230 48L220 119Z" fill="#d69893" opacity=".72"/>
      <ellipse cx="150" cy="150" rx={round ? 109 : rex ? 86 : 99} ry={round ? 85 : 81} fill={c.fur}/>
      {id === 1 && <><path d="M54 112Q62 65 104 75L125 137L84 145Z" fill="#dd9254"/><path d="M168 76Q226 64 246 130L206 145Z" fill={c.dark}/></>}
      {(id === 0 || id === 2) && <g fill={c.dark} opacity=".8"><path d="M126 77L137 112L145 77ZM150 75L159 113L173 77Z"/><path d="M53 137L91 144L58 157ZM54 164L92 171L64 182ZM245 135L211 145L242 154ZM243 165L210 173L233 184Z"/></g>}
      {rex && <g fill="none" stroke={c.dark} strokeWidth="5" opacity=".7">{[98,125,152,179].map(x=><path key={x} d={`M${x} 89q-12 10 0 18q12 8 0 14`}/>)}</g>}
      {!back && <>
        <ellipse cx="150" cy="183" rx={round ? 64 : 51} ry="36" fill={c.light}/>
        {[112,188].map((x,i) => <g key={x}>
          {blink || mood === 'sleep' ? <path d={`M${x-16} 154q16 13 32 0`} fill="none" stroke="#263343" strokeWidth="6" strokeLinecap="round"/> : <><ellipse cx={x} cy="148" rx="20" ry={mood==='puzzled' ? 25 : 22} fill={c.eye}/><ellipse cx={x + (mood==='puzzled' ? 6 : 1)} cy="149" rx="7" ry="17" fill="#1b2937"/><circle cx={x+6} cy="140" r="5" fill="#fff"/></>}
          {mood === 'puzzled' && <path d={`M${x-16} ${i ? 114 : 108}l30 ${i ? -6 : 8}`} stroke={c.dark} strokeWidth="5" strokeLinecap="round"/>}
        </g>)}
        <path d="M140 177Q150 174 160 177L150 187Z" fill="#ab7272"/>
        <path d={mood==='puzzled' ? 'M142 201q10-5 18 0' : 'M150 185v8m0 0q-12 14-22 0m22 0q12 14 22 0'} fill="none" stroke="#493f43" strokeWidth="4" strokeLinecap="round"/>
        <g stroke={c.dark} strokeWidth="3" strokeLinecap="round" opacity=".6"><path d="M64 179L101 185M59 198L100 195M199 185L239 179M200 197L241 202"/></g>
      </>}
    </g>
    <g transform={`rotate(${-paw * 75} 204 262)`}><ellipse cx="209" cy="264" rx="23" ry="47" fill={c.fur}/><ellipse cx="210" cy="235" rx="17" ry="20" fill={c.light}/>{paw > .2 && <ellipse cx="210" cy="234" rx="8" ry="10" fill="#d69893"/>}</g>
  </svg>;
};
