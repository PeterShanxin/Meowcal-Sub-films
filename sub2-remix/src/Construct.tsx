import React from "react";
import { cue, glide, lin, mix, reveal } from "./clock";
import { TILE } from "./layout";

// cue.slot → cue.giveUp: the icon is grown from a single line by geometry.
//  1. A radius draws out from the centre, then sweeps once round like a compass.
//  2. The circle squares off into the tile (its corner radius eases 59.5 → 28).
//  3. A point grows into a circle, the circle stretches into the front card.
//  4. A copy of the card slides down-right and settles as the card behind.
//  5. Two sine waves draw across the card and flatten into its two lines.
//  6. A circle is traced round the card's corner and trimmed to the signal arc.
//  7. A small circle pinches into the four-point sparkle (superellipse 2 → 2/3).
// On giveUp the fills render (Rig's Mark) and the construction fades.
// Coordinates are the icon's own (docs/assets/icon.svg, 128 × 128).

const GOLD = "#EBC58B";
const GUIDE = "rgba(235,197,139,.2)";
const UNIT = TILE.w / 119;
const OX = TILE.x - 4.5 * UNIT;
const OY = TILE.y - 4.5 * UNIT;

const C0 = cue.slot;
const SPAN = cue.giveUp - cue.slot; // 3.5 s
const at = (u: number) => C0 + u * SPAN; // 0…1 of the build

/** A rounded rectangle path that starts at the middle of its right edge. */
const rrect = (cx: number, cy: number, w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  return `M${x1} ${cy}V${y1 - rr}A${rr} ${rr} 0 0 1 ${x1 - rr} ${y1}H${x0 + rr}A${rr} ${rr} 0 0 1 ${x0} ${y1 - rr}V${y0 + rr}A${rr} ${rr} 0 0 1 ${x0 + rr} ${y0}H${x1 - rr}A${rr} ${rr} 0 0 1 ${x1} ${y0 + rr}Z`;
};
const poly = (pts: [number, number][], close = false) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("") + (close ? "Z" : "");
const deg = Math.PI / 180;

export const Construct: React.FC<{ t: number }> = ({ t }) => {
  const show = lin(t, [C0 - 0.05, C0 + 0.1], [0, 1]) * lin(t, [cue.giveUp + 0.02, cue.giveUp + 0.3], [1, 0]);
  if (show <= 0) return null;
  const px = (w: number) => w / UNIT;
  const grid = reveal(t, at(0), at(0.2));

  // 1. Radius, then the compass sweep.
  const radius = glide(t, [at(0.02), at(0.12)], [0, 1]);
  const sweep = glide(t, [at(0.12), at(0.32)], [0, 1]);
  const tip: [number, number] = [64 + 59.5 * Math.cos(-sweep * 2 * Math.PI), 64 + 59.5 * Math.sin(-sweep * 2 * Math.PI)];
  const armFade = lin(t, [at(0.3), at(0.38)], [1, 0]);
  // 2. Circle → tile.
  const square = glide(t, [at(0.32), at(0.46)], [0, 1]);
  // 3. Point → circle → front card.
  const grow = glide(t, [at(0.4), at(0.52)], [0, 1]);
  const stretch = glide(t, [at(0.5), at(0.62)], [0, 1]);
  const frontW = mix(50 * grow, 72, stretch), frontH = 50 * grow, frontR = mix(25 * grow, 11, stretch);
  // 4. The card behind.
  const slide = glide(t, [at(0.6), at(0.72)], [0, 1]);
  // 5. Lines.
  const l1 = glide(t, [at(0.66), at(0.76)], [0, 1]), l2 = glide(t, [at(0.7), at(0.79)], [0, 1]);
  const flat = glide(t, [at(0.76), at(0.86)], [0, 1]);
  // 6. Arc: full circle, then trimmed to −159°…−111°.
  const trace = glide(t, [at(0.74), at(0.84)], [0, 1]);
  const trim = glide(t, [at(0.84), at(0.94)], [0, 1]);
  // 7. Sparkle.
  const sparkIn = glide(t, [at(0.8), at(0.86)], [0, 1]);
  const pinch = glide(t, [at(0.86), at(0.98)], [0, 1]);

  const wave = (y: number, len: number, k: number) => {
    const n = 40;
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const x = 37 + (len * k * i) / n;
      pts.push([x, y + 3.2 * (1 - flat) * Math.sin((x - 37) / 3.2)]);
    }
    return poly(pts);
  };
  const arcPts = () => {
    const span = mix(360, 48, trim) * trace;
    const mid = -135, from = mix(mid - 180, mid - 24, trim);
    const pts: [number, number][] = [];
    for (let i = 0; i <= 72; i++) {
      const a = (from + (span * i) / 72) * deg;
      pts.push([33 + 22 * Math.cos(a), 51 + 22 * Math.sin(a)]);
    }
    return poly(pts);
  };
  const sparkPts = () => {
    const n = mix(2, 0.66, pinch), r = 7.5 * sparkIn, rot = (1 - pinch) * 45 * deg;
    const pts: [number, number][] = [];
    for (let i = 0; i < 96; i++) {
      const th = (i / 96) * 2 * Math.PI;
      const c = Math.cos(th), s = Math.sin(th);
      const x = r * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), y = r * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
      pts.push([98.56 + x * Math.cos(rot) - y * Math.sin(rot), 35.44 + x * Math.sin(rot) + y * Math.cos(rot)]);
    }
    return poly(pts, true);
  };
  const dot = (x: number, y: number, o = 1) => (
    <g opacity={o}>
      <circle cx={x} cy={y} r={px(9)} fill="rgba(255,226,170,.25)" />
      <circle cx={x} cy={y} r={px(3.2)} fill="#fff4dc" />
    </g>
  );
  const line = (w = 2): React.SVGProps<SVGPathElement> => ({ stroke: GOLD, strokeWidth: px(w), strokeLinecap: "round", strokeLinejoin: "round", fill: "none" });

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, opacity: show, pointerEvents: "none" }}>
      <g transform={`translate(${OX} ${OY}) scale(${UNIT})`}>
        {/* A quiet 8-unit grid and dashed axes. */}
        <g opacity={grid * lin(t, [at(0.6), at(1)], [1, 0.5])}>
          {Array.from({ length: 17 }, (_, i) => i * 8).map((v) => (
            <React.Fragment key={v}>
              <path d={`M${v} 0V128`} stroke={GUIDE} strokeWidth={px(0.8)} />
              <path d={`M0 ${v}H128`} stroke={GUIDE} strokeWidth={px(0.8)} />
            </React.Fragment>
          ))}
          <path d="M64 -10V138M-10 64H138" stroke="rgba(235,197,139,.38)" strokeWidth={px(1)} strokeDasharray={`${px(4)} ${px(4)}`} />
        </g>

        {/* 1–2. Compass, then the circle squares off into the tile. */}
        {radius > 0 && armFade > 0 && <path d={`M64 64L${mix(64, tip[0], radius)} ${mix(64, tip[1], radius)}`} stroke="rgba(255,244,220,.7)" strokeWidth={px(1.4)} opacity={armFade} />}
        {sweep > 0 && square <= 0 && (
          <path d={rrect(64, 64, 119, 119, 59.5)} pathLength={1} strokeDasharray={`${sweep} 1`} transform="matrix(1 0 0 -1 0 128)" {...line(1.8)} />
        )}
        {square > 0 && <path d={rrect(64, 64, 119, 119, mix(59.5, 28, square))} {...line(1.8)} />}
        {radius > 0 && sweep < 1 && dot(mix(64, tip[0], radius), mix(64, tip[1], radius))}
        {radius > 0 && armFade > 0 && dot(64, 64, 0.6 * armFade)}

        {/* 4. The card behind (drawn first so the front card sits over it). */}
        {slide > 0 && (
          <>
            <path d="M58 65L74 80" stroke="rgba(255,244,220,.5)" strokeWidth={px(1)} strokeDasharray={`${px(3)} ${px(3)}`} opacity={lin(slide, [0, 0.2, 0.8, 1], [0, 1, 1, 0])} />
            <path d={rrect(mix(58, 74, slide), mix(65, 80, slide), mix(72, 60, slide), mix(50, 44, slide), mix(11, 9, slide))} {...line(1.8)} stroke="#B89A6E" />
          </>
        )}
        {/* 3. Point → circle → front card. */}
        {grow > 0 && (
          <>
            <path d={rrect(58, 65, frontW, frontH, frontR)} {...line(2)} fill={slide > 0 ? "rgba(13,14,18,.85)" : "none"} />
            {grow < 1 && dot(58, 65)}
            <path d="M55 65h6M58 62v6" stroke="rgba(255,244,220,.6)" strokeWidth={px(1)} opacity={lin(t, [at(0.4), at(0.45), at(0.6), at(0.66)], [0, 1, 1, 0])} />
          </>
        )}
        {/* 5. Waves flatten into the lines. */}
        {l1 > 0 && <path d={wave(56, 40, l1)} {...line(3)} />}
        {l2 > 0 && <path d={wave(70, 25, l2)} {...line(3)} />}
        {l1 > 0 && l1 < 1 && dot(37 + 40 * l1, 56 + 3.2 * (1 - flat) * Math.sin((40 * l1) / 3.2))}
        {l2 > 0 && l2 < 1 && dot(37 + 25 * l2, 70 + 3.2 * (1 - flat) * Math.sin((25 * l2) / 3.2))}
        {/* 6. Arc. */}
        {trace > 0 && (
          <>
            <path d="M30 51h6M33 48v6" stroke="rgba(255,244,220,.6)" strokeWidth={px(1)} opacity={lin(trim, [0.6, 1], [1, 0])} />
            <path d={arcPts()} {...line(2.4)} />
          </>
        )}
        {/* 7. Sparkle. */}
        {sparkIn > 0 && <path d={sparkPts()} {...line(1.6)} fill={`rgba(235,197,139,${0.9 * pinch})`} />}
      </g>
    </svg>
  );
};
