import React from "react";
import type { Layout } from "./layout";
import { ease, mix, sp, tween } from "./motion";
import { SCANS, mixColor } from "./Capture";
import { payoffVisibility } from "./Payoff";
import { HERO, MONTAGE } from "./scenes";
import { fitSize, units } from "./text";
import { C, FONT_TEXT, fontFor } from "./theme";
import { T } from "./timeline";

interface PlateLine {
  start: number;
  // When the line before it leaves: montage cuts clear the plate as the new
  // footage arrives, so a translation is never shown against the wrong scene.
  clear: number;
  text: string;
  lang: string;
  light: boolean;
  stagger: number;
}

// A translation lands the moment its scan finishes reading the line.
const PLATE_LINES: readonly PlateLine[] = SCANS.map((scan, i) => {
  const scene = i < 2 ? HERO : MONTAGE[i - 2];
  return {
    start: i === 0 ? T.magic.drop + 4 : scan.end,
    clear: i < 2 ? scan.end - 2 : T.montage.cuts[i - 2] + 1,
    text: i < 2 ? HERO.lines[i].translation : scene.lines[0].translation,
    lang: scene.target,
    light: scene.plate === "light",
    stagger: i < 2 ? 2.2 : 1.1,
  };
});

function plateFont(lang: string, size: number): string {
  return `500 ${size}px ${fontFor(lang, FONT_TEXT)}`;
}

const Words: React.FC<{ line: PlateLine; f: number; L: Layout; exit: number }> = ({ line, f, L, exit }) => {
  const size = fitSize(line.text, (s) => plateFont(line.lang, s), L.plateTextSize, L.plate.w - 70 * L.u);
  const parts = units(line.text, line.lang);
  return (
    <div
      lang={line.lang}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "pre",
        font: plateFont(line.lang, size),
        opacity: 1 - exit,
        transform: `translateY(${-exit * 22 * L.u}px)`,
        filter: exit > 0.01 ? `blur(${exit * 6 * L.u}px)` : undefined,
      }}
    >
      {parts.map((part, i) => {
        const t = f - line.start - i * line.stagger;
        const rise = sp(f, line.start + i * line.stagger, { damping: 15, stiffness: 240 });
        const blur = Math.max(0, 5 - t) * L.u;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: tween(t, [0, 5], [0, 1], ease.linear),
              transform: `translateY(${(1 - rise) * 30 * L.u}px)`,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
            }}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
};

// The app's floating subtitle plate: opaque, same width as the capture box,
// directly below it (overlay-geometry.js: resolveSubtitlePlacement).
export const Plate: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  if (f < T.magic.drop) return null;
  const { u, plate, box } = L;
  const index = PLATE_LINES.reduce((acc, line, i) => (f >= line.clear ? i : acc), 0);
  const current = PLATE_LINES[index];
  const previous = index > 0 ? PLATE_LINES[index - 1] : null;
  const themeMix = previous && previous.light !== current.light
    ? tween(f, [current.start, current.start + 6], [0, 1])
    : 1;
  const light = mix(previous?.light ? 1 : 0, current.light ? 1 : 0, themeMix);
  const exit = previous ? tween(f, [current.clear, current.clear + 5], [0, 1], ease.in) : 1;

  const emerge = sp(f, T.magic.drop, { damping: 13, stiffness: 150 });
  const payoff = payoffVisibility(f);
  const collapse = tween(f, [T.payoff.collapse + 2, T.payoff.flat - 2], [0, 1], ease.in);
  const lift = collapse * (plate.y - box.y);

  return (
    <div
      style={{
        position: "absolute",
        left: plate.x,
        top: box.y + box.h,
        width: plate.w,
        height: plate.y + plate.h - (box.y + box.h) + 60 * u,
        overflow: "hidden",
        opacity: 1 - tween(collapse, [0.5, 1], [0, 1], ease.linear),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: plate.y - (box.y + box.h) - (1 - emerge) * (plate.h + 20 * u) - lift,
          width: plate.w,
          height: plate.h * (1 - collapse * 0.6),
          borderRadius: 14 * u,
          background: mixColor(C.plateDark, C.plateLight, light),
          // In the exploded view the plate floats over the dark stage, so its rim lights up.
          border: `${u + payoff * 1.5 * u}px solid ${mixColor(
            mixColor("rgba(255,255,255,0.09)", "rgba(0,0,0,0.08)", light),
            "rgba(232,238,247,0.45)",
            payoff,
          )}`,
          boxShadow: `inset 0 ${u}px 0 rgba(255,255,255,${0.07 * (1 - light)}), 0 0 ${60 * u}px rgba(190,210,255,${0.18 * payoff})`,
          color: mixColor("#ffffff", C.plateLightInk, light),
          overflow: "hidden",
        }}
      >
        {previous && exit < 1 ? <Words line={previous} f={f} L={L} exit={exit} /> : null}
        <Words line={current} f={f} L={L} exit={0} />
      </div>
    </div>
  );
};
