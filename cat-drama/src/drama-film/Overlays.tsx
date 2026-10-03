import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ease, mix} from './acting';

const SANS = '"Segoe UI","Microsoft YaHei",sans-serif';
const INK = '#1c2735';
const PAPER = '#f4f0e3';

export type TypedLine = {text: string; at: number};

/** Start frames for lines typed one after another, `rate` frames per character. */
export const typeSchedule = (texts: readonly string[], first: number, rate: number, gap = 16): TypedLine[] => {
  let at = first;
  return texts.map(text => {
    const line = {text, at};
    at += text.length * rate + gap;
    return line;
  });
};

/**
 * Narration typed on screen a character at a time. The untyped rest of each line is laid out
 * but invisible, so centred lines do not slide while they grow.
 */
export const Typewriter: React.FC<{lines: TypedLine[]; f: number; rate: number; out: number; portrait: boolean; top?: boolean}> = ({lines, f, rate, out, portrait, top = false}) => {
  const fadeOut = 1 - ease(f, out, out + 16);
  const typing = lines.findIndex(l => f >= l.at && f < l.at + l.text.length * rate);
  const cursor = Math.floor(f / 16) % 2 === 0 || typing >= 0;
  return <AbsoluteFill style={{opacity: fadeOut, pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: top ? 'linear-gradient(180deg,rgba(7,13,24,.82),transparent 42%)' : 'linear-gradient(0deg,rgba(7,13,24,.85),transparent 45%)',
      opacity: ease(f, lines[0].at - 16, lines[0].at)}}/>
    <div style={{position: 'absolute', left: portrait ? 64 : 120, right: portrait ? 64 : 120, ...(top ? {top: portrait ? 210 : 70} : {bottom: portrait ? 400 : 84}),
      display: 'flex', flexDirection: 'column', gap: portrait ? 22 : 14, alignItems: 'center', textAlign: 'center',
      font: `600 ${portrait ? 50 : 54}px ${SANS}`, lineHeight: 1.3, color: '#eef3ee', textShadow: '0 3px 12px #050b14'}}>
      {lines.map((line, i) => {
        const shown = Math.max(0, Math.min(line.text.length, Math.floor((f - line.at) / rate) + 1));
        const last = i === (typing >= 0 ? typing : lines.filter(l => f >= l.at).length - 1);
        return <div key={i} style={{opacity: f >= line.at ? 1 : 0}}>
          {line.text.slice(0, shown)}
          {last && cursor && <span style={{display: 'inline-block', width: '.5em', height: '.9em', marginLeft: 4, verticalAlign: '-.1em', background: '#cfe0d6', opacity: .85}}/>}
          <span style={{opacity: 0}}>{line.text.slice(shown)}</span>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

/** The film's title over the darkened planet. */
export const Title: React.FC<{text: string; f: number; portrait: boolean}> = ({text, f, portrait}) => {
  const show = ease(f, 0, 14) * (1 - ease(f, 62, 78));
  return <AbsoluteFill style={{background: `rgba(6,11,20,${.6 * show})`, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{opacity: show, transform: `scale(${mix(.94, 1, ease(f, 0, 20))})`, color: '#f3efe0', font: `700 ${portrait ? 132 : 128}px ${SANS}`,
      letterSpacing: '.08em', textShadow: '0 6px 24px #03070e'}}>{text}</div>
  </AbsoluteFill>;
};

/**
 * Chestnut's lines, manga style: a speech bubble with a pointer for what it says out loud,
 * a thought bubble trailing small circles for what it only thinks.
 */
export const Bubble: React.FC<{text: string; mode: 'say' | 'think'; f: number; show: number; portrait: boolean}> = ({text, mode, f, show, portrait}) => {
  const pop = ease(f, 0, 7), gone = ease(f, show - 8, show);
  const scale = mix(.7, 1, pop) + .06 * Math.sin(Math.PI * Math.min(1, f / 9));
  const think = mode === 'think';
  return <div style={{position: 'absolute', left: portrait ? '56%' : '58%', top: portrait ? 420 : 34, transform: `translateX(-50%) scale(${scale})`,
    transformOrigin: '30% 120%', opacity: pop * (1 - gone), pointerEvents: 'none'}}>
    <div style={{position: 'relative', maxWidth: portrait ? 860 : 980, padding: portrait ? '20px 36px' : '16px 32px', background: PAPER, color: INK,
      border: `5px solid ${INK}`, borderRadius: think ? 46 : 16, font: `700 ${portrait ? 58 : 50}px ${SANS}`, lineHeight: 1.3, whiteSpace: 'nowrap',
      boxShadow: '0 6px 0 #0d1622aa'}}>
      {text}
      {think
        ? <>
          <span style={{position: 'absolute', left: '27%', bottom: -40, width: 30, height: 30, borderRadius: '50%', background: PAPER, border: `5px solid ${INK}`}}/>
          <span style={{position: 'absolute', left: '21%', bottom: -70, width: 18, height: 18, borderRadius: '50%', background: PAPER, border: `4px solid ${INK}`}}/>
        </>
        : <span style={{position: 'absolute', left: '24%', bottom: -30, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '22px solid transparent',
          borderTop: `30px solid ${INK}`}}>
          <span style={{position: 'absolute', left: -9, top: -37, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '13px solid transparent', borderTop: `20px solid ${PAPER}`}}/>
        </span>}
    </div>
  </div>;
};
