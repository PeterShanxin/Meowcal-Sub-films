import timing from '../../timeline.json';

export const cues = timing.styleStudy;
export const ease = (frame: number, start: number, end: number) => {
  const t = Math.min(1, Math.max(0, (frame - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

export const blink = (frame: number, at: number) =>
  1 - ease(frame, at, at + 4) + ease(frame, at + 6, at + 13);

export const acting = (frame: number, viewer = false) => {
  const start = viewer ? cues.viewerLook : cues.vlogLook;
  return {
    eye: ease(frame, start, start + 9),
    head: ease(frame, start + 12, start + 44) - .12 * ease(frame, start + 44, start + 64),
    ear: ease(frame, start + 7, start + 15) - ease(frame, start + 20, start + 37),
    lids: Math.min(...(viewer ? cues.viewerBlinks : cues.vlogBlinks).map(at => blink(frame, at))),
    // Breathing deforms only the ribcage; paws, rump, and shadows retain contact.
    breath: Math.sin(frame / 60 * Math.PI * 2 / 3.8) * .007,
  };
};
