import React from "react";
import { H, W } from "../timeline";
import { rand } from "./art";

// A German Expressionist silent film: painted crooked houses, a jagged path of
// light, one thin figure, iris and flicker.
const PAPER = "#e9dfba";
const MID = "#56685f";
const DARK = "#0d1513";

interface House {
  d: string;
  fill: string;
  windows: string[];
}

const HOUSES: House[] = [
  { d: "M-40 1500 L20 520 L250 380 L330 640 L300 1500z", fill: "#263530", windows: ["M70 700 L170 660 L180 800 L80 830z", "M90 960 L200 930 L200 1090 L96 1100z"] },
  { d: "M250 1500 L300 760 L470 620 L520 860 L470 1500z", fill: "#324740", windows: ["M340 880 L430 850 L436 980 L346 1000z"] },
  { d: "M1120 1500 L1050 470 L830 330 L740 610 L790 1500z", fill: "#22302b", windows: ["M860 610 L980 650 L970 800 L850 770z", "M840 930 L960 950 L950 1110 L836 1090z"] },
  { d: "M800 1500 L770 800 L620 700 L560 900 L600 1500z", fill: "#2d403a", windows: ["M640 900 L720 920 L716 1040 L640 1020z"] },
];

export const Caligari: React.FC<{ t: number }> = ({ t }) => {
  const tick = Math.floor(t / 2);
  const flicker = 0.86 + 0.14 * rand(tick);
  const jitter = (rand(tick + 5) - 0.5) * 6;
  const sway = Math.sin(t * 0.06) * 3;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="cg-iris" cx="0.5" cy="0.52" r="0.62">
          <stop offset="0.62" stopColor="#000" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.9" />
          <stop offset="1" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="cg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14201d" />
          <stop offset="1" stopColor="#3d5048" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${jitter})`} opacity={flicker}>
        <rect width={W} height={H} fill="url(#cg-sky)" />
        {/* Painted sky: rays and a sickle moon. */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M620 250 L${-200 + i * 190} -40 L${-110 + i * 190} -40z`} fill={PAPER} opacity={0.07 + (i % 2) * 0.05} />
        ))}
        <path d="M640 150 C540 190 520 330 620 390 C560 300 580 210 640 150z" fill={PAPER} />

        {HOUSES.map((h, i) => (
          <g key={i}>
            <path d={h.d} fill={h.fill} />
            <path d={h.d} fill="none" stroke={PAPER} strokeWidth={5} opacity={0.5} />
            {h.windows.map((w, j) => (
              <path key={j} d={w} fill={PAPER} opacity={0.75 + 0.25 * rand(tick + i * 3 + j)} />
            ))}
          </g>
        ))}
        {/* Hatching painted on the walls. */}
        {Array.from({ length: 22 }, (_, i) => {
          const left = i % 2 === 0;
          const x = left ? 30 + rand(i) * 220 : 820 + rand(i) * 220;
          const y = 560 + rand(i + 9) * 800;
          return <path key={i} d={`M${x} ${y} l${left ? 46 : -46} ${-70 - rand(i + 3) * 60}`} stroke={PAPER} strokeWidth={5} opacity={0.22} strokeLinecap="round" />;
        })}

        {/* Crooked doors, a leaning lamp, painted roof edges. */}
        <path d="M120 1500 L132 1250 L214 1220 L226 1500z" fill="#0d1513" stroke={PAPER} strokeWidth={4} />
        <path d="M900 1500 L880 1270 L960 1300 L972 1500z" fill="#0d1513" stroke={PAPER} strokeWidth={4} />
        <path d="M20 520 L250 380 L330 640 M300 760 L470 620 L520 860 M1050 470 L830 330 L740 610 M770 800 L620 700 L560 900" fill="none" stroke={PAPER} strokeWidth={9} strokeLinejoin="miter" opacity={0.85} />
        <g transform="rotate(-9 420 1500)">
          <rect x={412} y={1130} width={12} height={370} fill="#050807" />
          <path d="M388 1130 L448 1130 L436 1070 L400 1070z" fill={PAPER} />
          <path d="M418 1100 L260 1500 L560 1500z" fill={PAPER} opacity={0.14} />
        </g>
        {/* Ground and the jagged path of light. */}
        <path d={`M0 1500 L${W} 1500 L${W} ${H} L0 ${H}z`} fill={DARK} />
        <path d={`M520 1500 L640 1500 L700 1610 L600 1680 L820 1790 L690 1840 L900 ${H} L200 ${H} L420 1830 L330 1770 L520 1660 L450 1600z`} fill={PAPER} opacity={0.92} />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${60 + i * 140} ${H} L${440 + i * 26} 1520`} stroke={MID} strokeWidth={4} opacity={0.5} />
        ))}

        {/* The sleepwalker and his shadow. */}
        <path d={`M560 1770 L160 ${H} L300 ${H} L600 1790z`} fill="#000" opacity={0.7} />
        <g transform={`translate(${580 + sway} 1780)`} fill="#050807">
          <path d="M-38 0 L-30 -250 C-34 -300 -22 -330 0 -334 C22 -330 34 -300 30 -250 L40 0z" />
          <ellipse cx={0} cy={-366} rx={30} ry={36} />
          <path d="M-36 -386 C-44 -420 -10 -430 6 -410 C26 -420 44 -400 34 -376z" />
          <path d={`M22 -300 C80 -330 120 -400 ${150 + sway * 2} -470 L${166 + sway * 2} -462 C140 -380 100 -310 34 -270z`} />
          <path d="M-22 -300 C-50 -240 -56 -170 -52 -110 L-40 -110 C-40 -170 -30 -230 -14 -280z" />
        </g>
      </g>

      {/* Scratches on the print. */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={rand(tick * 3 + i) * W} y={0} width={2} height={H} fill={PAPER} opacity={rand(tick + i * 7) < 0.4 ? 0.35 : 0} />
      ))}
      <rect width={W} height={H} fill="#8a6a2a" opacity={0.14} />
      <rect width={W} height={H} fill="url(#cg-iris)" />
    </svg>
  );
};
