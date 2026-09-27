import React from "react";
import type { Layout } from "./layout";
import { ease, mix, sp, tween } from "./motion";
import { logoRect } from "./Capture";
import { measure, units } from "./text";
import { C, FONT_DISPLAY, FONT_TEXT } from "./theme";
import { T } from "./timeline";

// Path and proportions from docs/assets/logo.svg in the app repository.
const CAT_PATH =
  "M4.6 10V4.2l4.3 3.3c1-.33 2-.5 3.1-.5s2.1.17 3.1.5l4.3-3.3V10c.85 1.1 1.3 2.4 1.3 3.8 0 3.9-3.8 6.7-8.7 6.7s-8.7-2.8-8.7-6.7c0-1.4.45-2.7 1.3-3.8z";

const TAGLINE = "Translate the subtitles already on your screen.";
const META = "Windows 11  ·  Free and open source";

function wordmarkFont(L: Layout): string {
  return `600 ${(L.portrait ? 118 : 132) * L.u}px ${FONT_DISPLAY}`;
}

export const Brand: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  const { hit, wordmark, tagline, meta } = T.brand;
  if (f < hit) return null;
  const { u } = L;
  const home = logoRect(L);
  const size = home.w;
  const gap = 50 * u;
  const wordWidth = measure("Meowcal Sub", wordmarkFont(L));

  // Landscape: logo and wordmark side by side. Portrait: stacked.
  const settle = sp(f, wordmark, { damping: 20, stiffness: 120 });
  const lockupY = L.H / 2 - (L.portrait ? 170 : 44) * u;
  const final = L.portrait
    ? { x: L.W / 2 - size / 2, y: lockupY - size / 2 }
    : { x: L.W / 2 - (size + gap + wordWidth) / 2, y: lockupY - size / 2 };
  const logo = { x: mix(home.x, final.x, settle), y: mix(home.y, final.y, settle) };

  const draw = tween(f, [hit, hit + 26], [0, 1], ease.outSoft);
  const earPop = sp(f, hit + 14, { damping: 9, stiffness: 260 });
  const land = sp(f, hit, { damping: 10, stiffness: 320 });
  const sheen = tween(f, [hit + 16, hit + 56], [-0.6, 1.6], ease.inOut);
  const glow = tween(f, [hit, hit + 30], [0, 1], ease.outSoft);

  const wordReveal = tween(f, [wordmark + 4, wordmark + 30], [0, 1], ease.out);
  const wordX = L.portrait ? L.W / 2 - wordWidth / 2 : final.x + size + gap;
  const wordY = L.portrait ? lockupY + size / 2 + 40 * u : lockupY - 132 * u * 0.62;

  const taglineTop = L.portrait ? wordY + 190 * u : lockupY + size / 2 + 70 * u;
  const tagSize = (L.portrait ? 44 : 46) * u;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: L.W / 2 - 700 * u,
          top: lockupY - 700 * u,
          width: 1400 * u,
          height: 1400 * u,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(190,205,230,0.13) 0%, rgba(190,205,230,0) 60%)",
          opacity: glow,
          transform: `scale(${0.7 + 0.3 * glow})`,
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        style={{
          position: "absolute",
          left: logo.x,
          top: logo.y,
          overflow: "visible",
          transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, (f - hit) / 10) * Math.PI) * (1 - land * 0.2)})`,
        }}
      >
        <defs>
          <linearGradient id="brand-mark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef3fb" />
            <stop offset="1" stopColor="#9fb0c8" />
          </linearGradient>
          <radialGradient id="brand-fill" cx="50%" cy="18%" r="80%">
            <stop offset="0" stopColor="#1b2330" />
            <stop offset="1" stopColor="#0a0d13" />
          </radialGradient>
          <linearGradient id="brand-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset={Math.max(0, sheen - 0.25)} stopColor="#ffffff" stopOpacity="0" />
            <stop offset={Math.min(1, Math.max(0, sheen))} stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset={Math.min(1, sheen + 0.25)} stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="brand-clip">
            <rect x="2" y="2" width="92" height="92" rx="22" />
          </clipPath>
        </defs>
        <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#brand-fill)" stroke={C.logoStroke} strokeWidth="2" />
        <g transform="translate(12 12) scale(3)">
          <path
            d={CAT_PATH}
            fill="none"
            stroke="url(#brand-mark)"
            strokeWidth={1.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - draw}
            transform={`translate(12 14) scale(${1 + 0.06 * (1 - earPop)}) translate(-12 -14)`}
          />
        </g>
        <rect x="2" y="2" width="92" height="92" fill="url(#brand-sheen)" clipPath="url(#brand-clip)" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: wordX,
          top: wordY,
          font: wordmarkFont(L),
          letterSpacing: -2.5 * u,
          color: C.text1,
          whiteSpace: "nowrap",
          // Slides out from behind the icon: nothing left of its right edge shows.
          clipPath: L.portrait
            ? undefined
            : `inset(-20% ${(1 - wordReveal) * 100}% -20% ${Math.max(0, logo.x + size + 4 * u - (wordX - (1 - wordReveal) * 60 * u))}px)`,
          opacity: L.portrait ? wordReveal : 1,
          transform: `translateX(${(1 - wordReveal) * (L.portrait ? 0 : -60) * u}px) translateY(${L.portrait ? (1 - wordReveal) * 30 * u : 0}px)`,
        }}
      >
        Meowcal Sub
      </div>

      <div
        style={{
          position: "absolute",
          left: L.W * 0.06,
          right: L.W * 0.06,
          top: taglineTop,
          textAlign: "center",
          font: `500 ${tagSize}px ${FONT_TEXT}`,
          lineHeight: 1.3,
          color: C.text2,
        }}
      >
        {units(TAGLINE, "en-US").map((word, i) => {
          const rise = sp(f, tagline + i * 1.6, { damping: 18, stiffness: 200 });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: Math.min(1, rise * 1.5),
                transform: `translateY(${(1 - rise) * 24 * u}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: taglineTop + tagSize * (L.portrait ? 3.2 : 2.0),
          textAlign: "center",
          whiteSpace: "pre",
          font: `600 ${32 * u}px ${FONT_TEXT}`,
          letterSpacing: 0.5 * u,
          color: C.text3,
          opacity: tween(f, [meta, meta + 14], [0, 1], ease.outSoft),
          transform: `translateY(${tween(f, [meta, meta + 18], [16, 0], ease.out) * u}px)`,
        }}
      >
        {META}
      </div>
    </div>
  );
};
