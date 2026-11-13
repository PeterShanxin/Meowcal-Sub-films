import React from "react";
import { H, W } from "../timeline";
import { rand } from "./art";

// A Korean drama's night street: one lamp, one umbrella, rain on wet asphalt.
const GROUND = 1770;
const NEON = ["255,79,154", "79,216,235", "255,178,96", "150,120,255"];

const Streaks: React.FC<{ t: number; n: number; seed: number; alpha: number; width: number }> = ({ t, n, seed, alpha, width }) => (
  <g transform="rotate(7 540 960)">
    {Array.from({ length: n }, (_, i) => {
      const len = 70 + rand(i + seed) * 190;
      const speed = 38 + rand(i + seed + 9) * 34;
      const span = H + 700;
      const y = ((rand(i + seed + 13) * span + t * speed) % span) - 350;
      return <rect key={i} x={rand(i + seed + 21) * (W + 300) - 150} y={y} width={width} height={len} fill={`rgba(225,240,255,${alpha * (0.4 + rand(i + seed + 2) * 0.6)})`} />;
    })}
  </g>
);

export const Rain: React.FC<{ t: number }> = ({ t }) => {
  const flicker = 0.92 + 0.08 * Math.sin(t * 0.9) * Math.sin(t * 0.23);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="rn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070f" />
          <stop offset="0.55" stopColor="#0e1e30" />
          <stop offset="1" stopColor="#0a1520" />
        </linearGradient>
        <linearGradient id="rn-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.62" />
          <stop offset="0.5" stopColor="#ffc078" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffb060" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="rn-halo">
          <stop offset="0" stopColor="#fff3d6" stopOpacity="1" />
          <stop offset="0.12" stopColor="#ffd08a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffb060" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rn-pink">
          <stop offset="0" stopColor="#ff4f9a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff4f9a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rn-wet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13202c" />
          <stop offset="1" stopColor="#04070b" />
        </linearGradient>
        <linearGradient id="rn-reflect-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4f9a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ff4f9a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rn-reflect-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd08a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rn-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd9a0" />
          <stop offset="0.5" stopColor="#ffd9a0" stopOpacity="0" />
        </linearGradient>
        <clipPath id="rn-cone-clip">
          <path d={`M300 322 L420 322 L900 ${GROUND} L-120 ${GROUND}z`} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#rn-sky)" />

      {/* The city behind, out of focus. */}
      {Array.from({ length: 26 }, (_, i) => {
        const r = 26 + rand(i + 3) * 90;
        const c = NEON[i % NEON.length];
        const a = 0.12 + rand(i + 5) * 0.26;
        return <circle key={i} cx={rand(i + 7) * W} cy={150 + rand(i + 9) * 820} r={r} fill={`rgba(${c},${a})`} stroke={`rgba(${c},${a + 0.12})`} strokeWidth={3} />;
      })}

      {/* Shopfront neon. */}
      <circle cx={880} cy={520} r={420} fill="url(#rn-pink)" opacity={flicker} />
      <g opacity={flicker}>
        <rect x={800} y={260} width={160} height={520} rx={22} fill="#1a0a18" stroke="#ff5fa6" strokeWidth={9} />
        <rect x={800} y={260} width={160} height={520} rx={22} fill="none" stroke="#ffd0e6" strokeWidth={3} />
        {["커", "피", "숍"].map((ch, i) => (
          <text key={ch} x={880} y={400 + i * 150} textAnchor="middle" fontFamily='"Malgun Gothic", sans-serif' fontWeight={700} fontSize={112} fill="#ffe3f0" stroke="#ff5fa6" strokeWidth={3}>
            {ch}
          </text>
        ))}
      </g>
      <g>
        <rect x={60} y={560} width={200} height={84} rx={14} fill="#06161a" stroke="#4fd8eb" strokeWidth={6} />
        <text x={160} y={622} textAnchor="middle" fontFamily='"Malgun Gothic", sans-serif' fontWeight={700} fontSize={56} fill="#d6fbff">
          24시
        </text>
      </g>

      <Streaks t={t} n={70} seed={100} alpha={0.16} width={2} />

      {/* Street lamp and its cone of light. */}
      <path d={`M300 322 L420 322 L900 ${GROUND} L-120 ${GROUND}z`} fill="url(#rn-cone)" />
      <g clipPath="url(#rn-cone-clip)">
        <Streaks t={t} n={80} seed={400} alpha={0.75} width={3} />
      </g>
      <circle cx={360} cy={318} r={300} fill="url(#rn-halo)" />
      <g fill="#04060a">
        <rect x={148} y={250} width={20} height={GROUND - 250} />
        <path d="M150 262 C160 200 250 190 330 270 L420 300 L420 326 L296 326 C260 270 200 250 168 290z" />
        <rect x={132} y={GROUND - 70} width={52} height={70} />
      </g>
      <ellipse cx={360} cy={326} rx={64} ry={12} fill="#fff6dc" />

      {/* Wet street. */}
      <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="url(#rn-wet)" />
      <rect x={800} y={GROUND} width={160} height={150} fill="url(#rn-reflect-pink)" opacity={0.8 * flicker} />
      <path d={`M40 ${GROUND} L780 ${GROUND} L640 ${H} L180 ${H}z`} fill="url(#rn-reflect-warm)" opacity={0.42} />
      {Array.from({ length: 16 }, (_, i) => {
        const life = ((t + rand(i + 31) * 60) % 46) / 46;
        const cx = rand(i + 33 + Math.floor((t + rand(i + 31) * 60) / 46)) * W;
        const cy = GROUND + 20 + rand(i + 35) * 120;
        return <ellipse key={i} cx={cx} cy={cy} rx={10 + life * 46} ry={3 + life * 11} fill="none" stroke="rgba(230,240,255,0.7)" strokeWidth={2} opacity={1 - life} />;
      })}

      {/* Two people, one umbrella, walking away. */}
      <g transform={`translate(520 ${GROUND})`}>
        <ellipse cx={0} cy={6} rx={230} ry={20} fill="#020304" opacity={0.7} />
        {[-7, 0].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill={dx ? "url(#rn-rim)" : "#04060a"}>
            <path d="M-150 0 C-150 -120 -146 -200 -120 -262 C-128 -292 -112 -326 -78 -326 C-44 -326 -30 -292 -38 -262 C-10 -220 -6 -120 -8 0z" />
            <path d="M0 0 C-6 -110 6 -190 30 -236 C18 -262 30 -300 62 -300 C96 -300 108 -262 96 -236 C112 -226 118 -200 116 -176 C140 -110 150 -50 156 0z" />
            <path d="M-262 -372 C-200 -470 60 -476 150 -372 C120 -388 96 -388 82 -370 C60 -390 30 -390 12 -370 C-10 -390 -44 -390 -62 -370 C-84 -390 -118 -390 -136 -370 C-158 -390 -196 -390 -212 -370 C-230 -386 -248 -384 -262 -372z" />
            <rect x={-60} y={-470} width={7} height={300} />
          </g>
        ))}
        <path d="M-262 -372 C-200 -470 60 -476 150 -372" fill="none" stroke="#ffd9a0" strokeWidth={4} opacity={0.55} />
        {Array.from({ length: 12 }, (_, i) => {
          const life = ((t + i * 5) % 14) / 14;
          const x = -230 + rand(i + 71 + Math.floor((t + i * 5) / 14)) * 360;
          const y = -372 - Math.sin(((x + 262) / 412) * Math.PI) * 96;
          return <circle key={i} cx={x} cy={y - life * 26} r={3} fill="#fff1d0" opacity={1 - life} />;
        })}
      </g>

      <Streaks t={t} n={26} seed={700} alpha={0.34} width={4} />
    </svg>
  );
};
