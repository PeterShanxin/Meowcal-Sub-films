import React from "react";
import { H, W } from "../timeline";

// A private eye's office in black and white: blind-slat light, a hat's shadow
// on the wall, smoke, a desk lamp.
const DESK = 1500;
const PROFILE =
  "M40 300 C120 282 180 276 200 268 C196 198 232 150 290 150 C318 150 324 168 338 166 C374 160 398 200 394 266 C432 276 470 286 482 300 C424 318 400 316 372 318 C378 346 398 374 422 402 C412 410 400 412 392 416 C398 426 394 434 386 440 C390 452 386 462 378 466 C380 492 368 508 340 512 C334 540 340 560 352 572 C430 600 520 664 560 800 L-60 800 C-30 664 70 592 188 560 C196 520 190 470 176 430 C150 400 140 350 148 318 C110 316 70 312 40 300z";

export const Noir: React.FC<{ t: number }> = ({ t }) => {
  const drift = t * 0.3;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="nr-wall" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a5a5a" />
          <stop offset="0.5" stopColor="#2b2b2b" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
        <radialGradient id="nr-falloff" cx="0.62" cy="0.36" r="0.62">
          <stop offset="0" stopColor="#0c0c0c" stopOpacity="0" />
          <stop offset="0.55" stopColor="#0c0c0c" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0c0c0c" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="nr-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nr-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262626" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#nr-wall)" />
      {/* Light through the blinds: bright slats with a soft edge, fading away from the window. */}
      <g transform="rotate(-16 540 960)">
        {Array.from({ length: 20 }, (_, i) => {
          const y = -420 + i * 150 + (drift % 150);
          return (
            <g key={i}>
              <rect x={-600} y={y} width={2400} height={78} fill="#f2f2f2" opacity={0.26} />
              <rect x={-600} y={y + 16} width={2400} height={46} fill="#f2f2f2" opacity={0.6} />
            </g>
          );
        })}
      </g>
      <rect width={W} height={H} fill="url(#nr-falloff)" />

      {/* Ceiling fan, seen only as a turning shadow. */}
      <g transform={`translate(830 250) rotate(${t * 2.4})`} opacity={0.5}>
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d="M20 -22 L330 -46 L330 46 L20 22z" fill="#000" transform={`rotate(${a})`} />
        ))}
        <circle r={40} fill="#000" />
      </g>

      {/* The detective, as a shadow thrown on the wall. */}
      <g transform="translate(90 300) scale(1.12)">
        <path d={PROFILE} fill="#000" opacity={0.86} />
      </g>

      {/* Cigarette smoke. */}
      {[0, 1, 2].map((i) => {
        const phase = t * 0.035 + i * 2.1;
        const x0 = 548;
        const y0 = 800;
        const d = `M${x0} ${y0} C${x0 + 40 * Math.sin(phase)} ${y0 - 130} ${x0 + 90 + 60 * Math.cos(phase * 1.3)} ${y0 - 260} ${x0 + 60 + 80 * Math.sin(phase * 0.7)} ${y0 - 420} S${x0 + 160 + 70 * Math.cos(phase)} ${y0 - 640} ${x0 + 120 + 90 * Math.sin(phase * 1.1)} ${y0 - 780}`;
        return <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={10 + i * 9} strokeLinecap="round" opacity={0.1 - i * 0.02} />;
      })}

      {/* Desk, lamp, telephone, glass. */}
      <rect x={0} y={DESK} width={W} height={H - DESK} fill="url(#nr-desk)" />
      <rect x={0} y={DESK} width={W} height={6} fill="#8a8a8a" opacity={0.6} />
      <path d={`M700 ${DESK - 250} L1100 ${DESK + 240} L340 ${DESK + 240}z`} fill="url(#nr-lamp)" />
      <g fill="#050505">
        <rect x={792} y={DESK - 226} width={14} height={226} />
        <ellipse cx={800} cy={DESK} rx={96} ry={18} />
        <path d={`M640 ${DESK - 250} C650 ${DESK - 330} 950 ${DESK - 330} 960 ${DESK - 250}z`} />
      </g>
      <ellipse cx={800} cy={DESK - 250} rx={160} ry={10} fill="#fff" opacity={0.9} />
      <g fill="#050505">
        <path d={`M120 ${DESK} L150 ${DESK - 96} C160 ${DESK - 128} 380 ${DESK - 128} 390 ${DESK - 96} L420 ${DESK}z`} />
        <path d={`M96 ${DESK - 150} C96 ${DESK - 196} 150 ${DESK - 196} 164 ${DESK - 160} L376 ${DESK - 160} C390 ${DESK - 196} 444 ${DESK - 196} 444 ${DESK - 150} C444 ${DESK - 116} 400 ${DESK - 118} 386 ${DESK - 136} L154 ${DESK - 136} C140 ${DESK - 118} 96 ${DESK - 116} 96 ${DESK - 150}z`} />
      </g>
      <circle cx={270} cy={DESK - 52} r={34} fill="none" stroke="#777" strokeWidth={5} />
      <g>
        <path d={`M520 ${DESK - 104} L604 ${DESK - 104} L594 ${DESK} L530 ${DESK}z`} fill="#fff" opacity={0.14} />
        <path d={`M526 ${DESK - 46} L598 ${DESK - 46} L594 ${DESK} L530 ${DESK}z`} fill="#fff" opacity={0.34} />
        <path d={`M520 ${DESK - 104} L604 ${DESK - 104}`} stroke="#fff" strokeWidth={4} opacity={0.8} />
        <path d={`M600 ${DESK - 100} L592 ${DESK - 6}`} stroke="#fff" strokeWidth={3} opacity={0.6} />
      </g>

      <rect width={W} height={H} fill="#000" opacity={0.1 + 0.03 * Math.sin(t * 1.7)} />
    </svg>
  );
};
