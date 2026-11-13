import React from "react";
import { H, W } from "../timeline";
import { rand } from "./art";

// Paris rooftops as a French picture-book film: flat gouache shapes, a pale
// sun, a cat on the ridge.
const RIDGE = 1700;

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
}

const Mansard: React.FC<{ b: Block; roof: string; wall: string; lit: number; seed: number }> = ({ b, roof, wall, lit, seed }) => {
  const dormers = Math.max(2, Math.floor(b.w / 96));
  const pots = 3 + Math.floor(rand(seed) * 3);
  const cx = b.x + b.w * (0.2 + rand(seed + 1) * 0.5);
  return (
    <g>
      <rect x={cx} y={b.y - 74} width={pots * 24 + 16} height={84} fill="#c9714d" />
      <rect x={cx - 6} y={b.y - 82} width={pots * 24 + 28} height={12} fill="#a85a3c" />
      {Array.from({ length: pots }, (_, i) => (
        <rect key={i} x={cx + 12 + i * 24} y={b.y - 116} width={14} height={36} rx={3} fill="#d98a5f" />
      ))}
      <path d={`M${b.x + 26} ${b.y} L${b.x + b.w - 26} ${b.y} L${b.x + b.w} ${b.y + 150} L${b.x} ${b.y + 150}z`} fill={roof} />
      <rect x={b.x + 18} y={b.y - 8} width={b.w - 36} height={12} fill={wall} opacity={0.5} />
      {Array.from({ length: dormers }, (_, i) => {
        const dx = b.x + 40 + (i + 0.5) * ((b.w - 80) / dormers) - 26;
        const on = rand(seed + 10 + i) < lit;
        return (
          <g key={i}>
            <path d={`M${dx - 8} ${b.y + 58} L${dx + 26} ${b.y + 30} L${dx + 60} ${b.y + 58} L${dx + 60} ${b.y + 132} L${dx - 8} ${b.y + 132}z`} fill={wall} />
            <rect x={dx + 6} y={b.y + 66} width={40} height={60} fill={on ? "#ffd772" : "#3d4a63"} />
            <rect x={dx + 24} y={b.y + 66} width={4} height={60} fill={wall} />
          </g>
        );
      })}
      <rect x={b.x} y={b.y + 150} width={b.w} height={b.h} fill={wall} />
      {Array.from({ length: dormers }, (_, i) => {
        const dx = b.x + 40 + (i + 0.5) * ((b.w - 80) / dormers) - 22;
        return <rect key={i} x={dx} y={b.y + 186} width={44} height={96} fill={rand(seed + 30 + i) < lit ? "#ffd772" : "#55627c"} />;
      })}
    </g>
  );
};

const FAR: Block[] = [
  { x: -40, y: 940, w: 330, h: 500 },
  { x: 300, y: 990, w: 260, h: 500 },
  { x: 570, y: 930, w: 300, h: 500 },
  { x: 880, y: 1000, w: 300, h: 500 },
];
const NEAR: Block[] = [
  { x: -90, y: 1250, w: 420, h: 600 },
  { x: 350, y: 1330, w: 360, h: 600 },
  { x: 730, y: 1230, w: 440, h: 600 },
];

export const Paris: React.FC<{ t: number }> = ({ t }) => {
  const tail = Math.sin(t * 0.07);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9db4cf" />
          <stop offset="0.42" stopColor="#f0c4ae" />
          <stop offset="0.7" stopColor="#f8dcb4" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#pa-sky)" />
      <circle cx={300} cy={560} r={230} fill="#fff2d2" opacity={0.35} />
      <circle cx={300} cy={560} r={150} fill="#fff6e0" />

      {/* Flat clouds. */}
      {[
        [620, 300, 1],
        [120, 200, 0.7],
        [860, 640, 0.6],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x + t * 0.14 * (i + 1)} ${y}) scale(${s})`} fill="#fbe8dc" opacity={0.9}>
          <rect x={-170} y={-30} width={340} height={60} rx={30} />
          <rect x={-90} y={-70} width={190} height={70} rx={35} />
          <rect x={-230} y={10} width={220} height={44} rx={22} />
        </g>
      ))}

      {/* The tower, hazy in the distance. */}
      <g fill="#c7959a">
        <path d="M770 430 L790 430 L802 640 L838 800 C858 880 880 930 906 980 L846 980 C830 930 806 890 780 890 C754 890 730 930 714 980 L654 980 C680 930 702 880 722 800 L758 640z" />
        <rect x={744} y={636} width={72} height={14} />
        <rect x={708} y={796} width={144} height={18} />
        <rect x={776} y={380} width={8} height={56} />
      </g>

      {/* Birds. */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((t * (1.6 + rand(i) * 0.9) + rand(i + 9) * 1400) % 1400) - 160;
        const y = 300 + rand(i + 4) * 380 + Math.sin(t * 0.05 + i) * 20;
        const flap = Math.sin(t * 0.5 + i * 2) * 10;
        return <path key={i} d={`M${x - 20} ${y - flap} Q${x - 8} ${y - 8} ${x} ${y} Q${x + 8} ${y - 8} ${x + 20} ${y - flap}`} fill="none" stroke="#5a5f7a" strokeWidth={4} strokeLinecap="round" />;
      })}

      {FAR.map((b, i) => (
        <Mansard key={i} b={b} roof="#8c9bb6" wall="#f0dcc6" lit={0.35} seed={i * 7 + 1} />
      ))}
      <rect x={0} y={1180} width={W} height={300} fill="#f6e2c8" opacity={0.25} />
      {NEAR.map((b, i) => (
        <Mansard key={i} b={b} roof="#62718f" wall="#e6cdb4" lit={0.55} seed={i * 11 + 40} />
      ))}

      {/* Chimney smoke from the near roofs. */}
      {Array.from({ length: 7 }, (_, i) => {
        const life = ((t * 0.9 + i * 34) % 240) / 240;
        return <circle key={i} cx={860 + life * 150 + Math.sin(life * 6 + i) * 16} cy={1110 - life * 330} r={16 + life * 44} fill="#fff4e6" opacity={(1 - life) * 0.6} />;
      })}

      {/* The foreground ridge and the cat. */}
      <path d={`M0 ${RIDGE + 30} L260 ${RIDGE} L1080 ${RIDGE + 70} L1080 ${H} L0 ${H}z`} fill="#2c3650" />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M${i * 108 + 20} ${RIDGE + 34} L${i * 108 - 40} ${H}`} stroke="#3b4764" strokeWidth={6} />
      ))}
      <path d={`M0 ${RIDGE + 30} L260 ${RIDGE} L1080 ${RIDGE + 70}`} fill="none" stroke="#7f8dab" strokeWidth={8} />
      <g transform={`translate(360 ${RIDGE + 6})`} fill="#16182a">
        <path d={`M92 -20 C${190 + tail * 30} ${-10 + tail * 10} ${230 + tail * 40} ${-110 - tail * 30} ${196 + tail * 70} ${-170 - tail * 20}`} fill="none" stroke="#16182a" strokeWidth={26} strokeLinecap="round" />
        <path d="M-96 6 C-118 -120 -74 -200 -32 -222 C-64 -252 -66 -300 -34 -322 L-48 -378 L-8 -340 C6 -344 22 -344 36 -340 L76 -378 L62 -322 C94 -300 92 -252 60 -222 C104 -200 136 -110 114 6z" />
      </g>
    </svg>
  );
};
