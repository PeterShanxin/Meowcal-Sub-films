import React from "react";
import { H, W } from "../timeline";
import { rand } from "./art";

// A railway crossing at dusk, in the manner of a Japanese animated feature:
// saturated sky, towering cloud, silhouettes with a warm rim.
const HORIZON = 1335;
const INK = "#120c2c";

const CLOUD: readonly [number, number, number][] = [
  [0, 0, 130], [150, -50, 165], [320, -110, 190], [500, -40, 160], [650, 20, 120],
  [250, -250, 135], [390, -290, 110], [110, -140, 105], [520, -190, 95], [-110, 40, 90],
];

// One shaded mass: cool on top, warm underneath where the low sun reaches it.
const Cloud: React.FC<{ x: number; y: number; s: number; drift: number; id: string }> = ({ x, y, s, drift, id }) => (
  <g transform={`translate(${x + drift} ${y}) scale(${s})`}>
    <mask id={`${id}-base`} maskUnits="userSpaceOnUse" x={-500} y={-700} width={1600} height={900}>
      <rect x={-500} y={-700} width={1600} height={900} fill="url(#cloud-fade)" />
    </mask>
    <g mask={`url(#${id}-base)`}>
      {CLOUD.map(([cx, cy, r], i) => (
        <circle key={`s${i}`} cx={cx - 16} cy={cy - 18} r={r + 8} fill="url(#cloud-shade)" />
      ))}
      {CLOUD.map(([cx, cy, r], i) => (
        <circle key={`m${i}`} cx={cx} cy={cy} r={r} fill="url(#cloud-body)" />
      ))}
      {CLOUD.map(([cx, cy, r], i) => (
        <circle key={`l${i}`} cx={cx + r * 0.16} cy={cy + r * 0.2} r={r * 0.78} fill="url(#cloud-lit)" />
      ))}
    </g>
  </g>
);

const ROOFS = Array.from({ length: 30 }, (_, i) => ({ x: i * 40 - 20 + rand(i) * 18, w: 34 + rand(i + 50) * 70, h: 18 + rand(i + 90) * 78 }));

const Pole: React.FC<{ x: number; top: number; s: number }> = ({ x, top, s }) => (
  <g fill={INK}>
    <rect x={x - 7 * s} y={top} width={14 * s} height={HORIZON - top + 40} />
    <rect x={x - 90 * s} y={top + 46 * s} width={180 * s} height={9 * s} />
    <rect x={x - 62 * s} y={top + 96 * s} width={124 * s} height={8 * s} />
    {[-82, -30, 30, 82].map((dx) => (
      <rect key={dx} x={x + dx * s - 4 * s} y={top + 30 * s} width={8 * s} height={18 * s} />
    ))}
    <rect x={x + 16 * s} y={top + 150 * s} width={30 * s} height={46 * s} rx={5 * s} />
  </g>
);

function wire(ax: number, ay: number, bx: number, by: number, sag: number): string {
  return `M${ax} ${ay} Q${(ax + bx) / 2} ${(ay + by) / 2 + sag} ${bx} ${by}`;
}

export const Anime: React.FC<{ t: number }> = ({ t }) => {
  const blink = Math.floor(t / 22) % 2 === 0;
  const front = W + 300 - (t + 16) * 92;
  const hair = Math.sin(t * 0.11);
  const poles = [
    { x: 965, top: 470, s: 1.5 },
    { x: 790, top: 840, s: 0.9 },
    { x: 690, top: 1050, s: 0.55 },
  ];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="an-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1647" />
          <stop offset="0.3" stopColor="#2a3a94" />
          <stop offset="0.54" stopColor="#7550b4" />
          <stop offset="0.74" stopColor="#ef6c93" />
          <stop offset="0.9" stopColor="#ffa468" />
          <stop offset="1" stopColor="#ffdca4" />
        </linearGradient>
        <linearGradient id="cloud-shade" gradientUnits="userSpaceOnUse" x1="0" y1="-420" x2="0" y2="120">
          <stop offset="0" stopColor="#3e3a96" />
          <stop offset="1" stopColor="#8d5fb4" />
        </linearGradient>
        <linearGradient id="cloud-body" gradientUnits="userSpaceOnUse" x1="-80" y1="-420" x2="120" y2="140">
          <stop offset="0" stopColor="#6f66c6" />
          <stop offset="0.5" stopColor="#b47cc6" />
          <stop offset="1" stopColor="#ff9f9a" />
        </linearGradient>
        <linearGradient id="cloud-lit" gradientUnits="userSpaceOnUse" x1="-60" y1="-380" x2="140" y2="150">
          <stop offset="0" stopColor="#a996e6" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#f0a8c4" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffe0b4" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cloud-fade" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="150">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id="an-sun">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="1" />
          <stop offset="0.1" stopColor="#ffe0a8" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#ff9d6e" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ff7f7f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="an-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.66" stopColor="#fff3d0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="an-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1a4d" />
          <stop offset="0.25" stopColor="#170f33" />
          <stop offset="1" stopColor="#07040f" />
        </linearGradient>
        <linearGradient id="an-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.45" stopColor="#ff9a5c" stopOpacity="0" />
          <stop offset="1" stopColor="#ffc98a" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width={W} height={HORIZON} fill="url(#an-sky)" />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={rand(i + 300) * W} cy={rand(i + 400) * 620} r={1 + rand(i + 500) * 2.2} fill="#fff" opacity={(0.35 + 0.65 * rand(i + 600)) * (0.6 + 0.4 * Math.sin(t * 0.08 + i))} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={260 + i * 240 + t * 0.12} cy={1090 + i * 44} rx={300 - i * 30} ry={9 + i * 2} fill="#ffb0a6" opacity={0.42} />
      ))}
      <Cloud id="c1" x={150} y={760} s={1.12} drift={t * 0.1} />
      <Cloud id="c2" x={-260} y={1120} s={0.55} drift={t * 0.16} />
      <Cloud id="c3" x={690} y={1010} s={0.38} drift={t * 0.07} />

      <circle cx={705} cy={1292} r={720} fill="url(#an-sun)" />
      <circle cx={705} cy={1292} r={58} fill="#fffbe9" />
      <rect x={0} y={1286} width={W} height={12} fill="url(#an-streak)" opacity={0.9} />
      <rect x={0} y={1270} width={W} height={44} fill="url(#an-streak)" opacity={0.22} />
      {[0.34, 0.56, 0.82].map((k, i) => (
        <circle key={i} cx={705 - 620 * k} cy={1292 - 900 * k} r={26 + i * 22} fill="#ffd9b0" opacity={0.13} />
      ))}

      <g fill="#4a2c72">
        {ROOFS.map((r, i) => (
          <rect key={i} x={r.x} y={HORIZON - r.h * 0.7 - 20} width={r.w} height={r.h} />
        ))}
      </g>
      <g fill="#2a1848">
        {ROOFS.map((r, i) => (
          <path key={i} d={`M${r.x + 14} ${HORIZON + 4} v${-r.h * 0.52} l${r.w * 0.5} ${-14} l${r.w * 0.5} 14 v${r.h * 0.52}z`} />
        ))}
      </g>

      <g stroke={INK} strokeWidth={2.4} fill="none">
        {[-82, -30, 30, 82].map((dx, i) => (
          <React.Fragment key={i}>
            <path d={wire(poles[0].x + dx * 1.5, poles[0].top + 34, poles[1].x + dx * 0.9, poles[1].top + 22, 70)} />
            <path d={wire(poles[1].x + dx * 0.9, poles[1].top + 22, poles[2].x + dx * 0.55, poles[2].top + 14, 34)} strokeWidth={1.6} />
            <path d={wire(poles[0].x + dx * 1.5, poles[0].top + 34, 1400, poles[0].top - 190 + i * 16, 110)} strokeWidth={3.2} />
          </React.Fragment>
        ))}
      </g>
      {poles.map((p, i) => (
        <Pole key={i} {...p} />
      ))}

      {/* The train: a dark body and a ribbon of lit windows, gone in under two seconds. */}
      <g transform={`translate(${front} 0)`}>
        <rect x={0} y={1168} width={6200} height={176} fill="#150d30" />
        {Array.from({ length: 62 }, (_, i) => (
          <rect key={i} x={40 + i * 100} y={1204} width={72} height={58} rx={6} fill="#ffe2a0" opacity={0.92} />
        ))}
        <rect x={0} y={1290} width={6200} height={6} fill="#ff9a5c" opacity={0.6} />
      </g>

      <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill="url(#an-ground)" />
      <rect x={0} y={1352} width={W} height={5} fill="#ffb27a" opacity={0.85} />
      <rect x={0} y={1378} width={W} height={7} fill="#ff9a5c" opacity={0.6} />

      {/* Crossing signal and lowered barrier. */}
      <g>
        <rect x={136} y={900} width={22} height={640} fill={INK} />
        <g transform="translate(147 968)" fill={INK} stroke="#ffb27a" strokeWidth={2}>
          <rect x={-120} y={-14} width={240} height={28} rx={4} transform="rotate(34)" />
          <rect x={-120} y={-14} width={240} height={28} rx={4} transform="rotate(-34)" />
        </g>
        <rect x={82} y={1076} width={130} height={62} rx={10} fill={INK} />
        {[0, 1].map((i) => {
          const on = blink === (i === 0);
          return (
            <g key={i}>
              <circle cx={112 + i * 70} cy={1107} r={on ? 70 : 0} fill="#ff3340" opacity={0.28} />
              <circle cx={112 + i * 70} cy={1107} r={20} fill={on ? "#ff4654" : "#4a1220"} />
            </g>
          );
        })}
        <g transform="rotate(-1.2 147 1452)">
          <rect x={147} y={1444} width={960} height={16} fill={INK} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={200 + i * 104} y={1444} width={52} height={16} fill="#f3b23a" opacity={0.85} />
          ))}
        </g>
      </g>

      {/* The girl waiting, seen from behind. */}
      <g transform="translate(470 1560) scale(1.08)">
        {[8, 0].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill={dx ? "url(#an-rim)" : "#0b0720"}>
            <path d={`M-78 -40 C-92 -150 -40 -196 6 -196 C58 -196 96 -150 84 -50 C${96 + hair * 14} ${-6 + hair * 6} ${118 + hair * 26} ${30 + hair * 10} ${140 + hair * 34} ${24 + hair * 16} C${112 + hair * 20} 62 76 70 60 60 L-66 60 C-80 30 -74 -8 -78 -40z`} />
            <path d="M-38 30 h76 v60 h-76z" />
            <path d="M-200 420 C-206 240 -176 112 -64 74 L0 122 L64 74 C176 112 206 240 200 420z" />
            <path d="M-100 86 L0 180 L100 86 L64 68 L0 122 L-64 68z" />
          </g>
        ))}
        <path d="M-100 86 L0 180 L100 86" fill="none" stroke="#3b2a6e" strokeWidth={5} />
      </g>

      {Array.from({ length: 26 }, (_, i) => {
        const life = ((t * (0.5 + rand(i) * 0.8) + rand(i + 20) * 900) % 900) / 900;
        return (
          <circle key={i} cx={rand(i + 40) * W + life * 160} cy={1500 - life * 900 + Math.sin(t * 0.03 + i) * 22} r={2 + rand(i + 60) * 4} fill="#ffd9a0" opacity={Math.sin(life * Math.PI) * 0.8} />
        );
      })}
    </svg>
  );
};
