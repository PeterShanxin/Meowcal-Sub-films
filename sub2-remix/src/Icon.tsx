import React from "react";

// The Meowcal Sub 2 icon (app repository, docs/assets/icon.svg, 128 × 128):
// a front subtitle card and the translation's card behind it, in gold line art
// on a dark tile, with a signal arc at the top left and a four-point sparkle at
// the top right. Each part has its own progress so the film can build it.
export type IconParts = { tile?: number; front?: number; back?: number; lines?: number; arc?: number; spark?: number };

export const IconArt: React.FC<{ size: number; id: string } & IconParts> = ({ size, id, tile = 1, front = 1, back = 1, lines = 1, arc = 1, spark = 1 }) => {
  const g = (name: string) => `url(#${id}-${name})`;
  const l1 = Math.min(1, lines * 1.25);
  const l2 = Math.max(0, lines * 1.25 - 0.25);
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`${id}-tile`} x1="16" y1="5" x2="105" y2="128" gradientUnits="userSpaceOnUse"><stop stopColor="#25272D" /><stop offset=".5" stopColor="#111216" /><stop offset="1" stopColor="#090A0D" /></linearGradient>
        <linearGradient id={`${id}-edge`} x1="8" y1="8" x2="118" y2="122" gradientUnits="userSpaceOnUse"><stop stopColor="#777B85" /><stop offset=".5" stopColor="#EBC58B" /><stop offset="1" stopColor="#34363E" /></linearGradient>
        <linearGradient id={`${id}-gold`} x1="30" y1="20" x2="100" y2="104" gradientUnits="userSpaceOnUse"><stop stopColor="#FFF0CC" /><stop offset=".4" stopColor="#EBC58B" /><stop offset="1" stopColor="#9A8468" /></linearGradient>
        <linearGradient id={`${id}-backline`} x1="42" y1="56" x2="106" y2="104" gradientUnits="userSpaceOnUse"><stop stopColor="#C9A876" /><stop offset="1" stopColor="#5E5244" /></linearGradient>
      </defs>
      <rect x="4.5" y="4.5" width="119" height="119" rx="28" fill={g("tile")} stroke={g("edge")} strokeWidth="1" opacity={tile} />
      {/* The translation's card slides out from behind the front card. */}
      <g opacity={back} transform={`translate(${(1 - back) * -22} ${(1 - back) * -18})`}>
        <rect x="44" y="58" width="60" height="44" rx="9" fill="#17181D" stroke={g("backline")} strokeWidth="4" />
      </g>
      <g opacity={front} style={{ transformOrigin: "58px 65px", transform: `scale(${0.88 + 0.12 * front})` }}>
        <rect x="22" y="40" width="72" height="50" rx="11" fill="#111216" stroke={g("gold")} strokeWidth="4" />
        {l1 > 0 && <path d={`M37 56h${40 * l1}`} stroke={g("gold")} strokeWidth="5" strokeLinecap="round" />}
        {l2 > 0 && <path d={`M37 70h${25 * l2}`} stroke={g("gold")} strokeWidth="5" strokeLinecap="round" />}
      </g>
      {arc > 0 && (
        <path d="M25.12 30.46A22 22 0 0 0 12.46 43.12" stroke={g("gold")} strokeWidth="4" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${arc} 1`} />
      )}
      {spark > 0 && (
        <g style={{ transformOrigin: "98.56px 35.44px", transform: `scale(${spark}) rotate(${(1 - Math.min(1, spark)) * -90}deg)` }}>
          <path d="M98.56 27.94Q99.91 34.09 106.06 35.44Q99.91 36.79 98.56 42.94Q97.21 36.79 91.06 35.44Q97.21 34.09 98.56 27.94Z" fill={g("gold")} />
        </g>
      )}
    </svg>
  );
};
