import React from "react";
import { staticFile, interpolateColors } from "remotion";
import { cue } from "./cues";
import { glide, reveal, ivory, lavender } from "./motion";

type Point = [number, number];
const lerp = (a: Point, b: Point, p: number): Point => [
  a[0] + (b[0] - a[0]) * p,
  a[1] + (b[1] - a[1]) * p,
];
function cubic(a: Point, b: Point, c: Point, d: Point) {
  return Array.from({ length: 24 }, (_, i) => {
    const t = (i + 1) / 24;
    return lerp(
      lerp(lerp(a, b, t), lerp(b, c, t), t),
      lerp(lerp(b, c, t), lerp(c, d, t), t),
      t,
    );
  });
}
function resample(points: Point[], count = 160) {
  const loop = [...points, points[0]],
    lengths = [0];
  for (let i = 1; i < loop.length; i++)
    lengths.push(
      lengths[i - 1] +
        Math.hypot(loop[i][0] - loop[i - 1][0], loop[i][1] - loop[i - 1][1]),
    );
  return Array.from({ length: count }, (_, i) => {
    const distance = (i / count) * lengths[lengths.length - 1];
    const end = lengths.findIndex((v) => v > distance);
    return lerp(
      loop[end - 1],
      loop[end],
      (distance - lengths[end - 1]) / (lengths[end] - lengths[end - 1]),
    );
  });
}
// Equal perimeter spacing keeps the original cat outline's ears attached while they fold into the card.
const cat = resample(
  (
    [
      [4.6, 10],
      [4.6, 4.2],
      [8.9, 7.5],
      ...cubic([8.9, 7.5], [9.9, 7.17], [10.9, 7], [12, 7]),
      ...cubic([12, 7], [13.1, 7], [14.1, 7.17], [15.1, 7.5]),
      [19.4, 4.2],
      [19.4, 10],
      ...cubic([19.4, 10], [20.25, 11.1], [20.7, 12.4], [20.7, 13.8]),
      ...cubic([20.7, 13.8], [20.7, 17.7], [16.9, 20.5], [12, 20.5]),
      ...cubic([12, 20.5], [7.1, 20.5], [3.3, 17.7], [3.3, 13.8]),
      ...cubic([3.3, 13.8], [3.3, 12.4], [3.75, 11.1], [4.6, 10]),
    ] as Point[]
  ).map(([x, y]) => [16 + 4 * x, 16 + 4 * y]),
);
const card = resample([
  [22, 50],
  [22, 41],
  ...cubic([22, 41], [22, 34.925], [26.925, 30], [33, 30]),
  [83, 30],
  ...cubic([83, 30], [89.075, 30], [94, 34.925], [94, 41]),
  [94, 69],
  ...cubic([94, 69], [94, 75.075], [89.075, 80], [83, 80]),
  [33, 80],
  ...cubic([33, 80], [26.925, 80], [22, 75.075], [22, 69]),
  [22, 50],
]);

// Old icon tile → one-stroke cat → subtitle card → lines → lavender back layer.
export const LogoMorph: React.FC<{ time: number }> = ({ time: t }) => {
  const fold = glide(t, [cue.fold, cue.card - 0.12, cue.card], [0, 1.03, 1]);
  const drawn = glide(t, [cue.toLogo + 0.35, cue.cat], [0, 1]);
  // The back layer edges out under the card, then lands on the downbeat.
  const back = glide(
    t,
    [cue.grow, cue.mark - 0.12, cue.mark, cue.mark + 0.2, cue.mark + 0.45],
    [0, 0.82, 1.14, 0.95, 1],
  );
  const line = (at: number) =>
    glide(t, [at, at + 0.18, at + 0.32], [0, 1.08, 1]);
  const final = reveal(t, cue.final - 0.3, cue.final);
  const path =
    cat
      .map((point, i) => {
        const [x, y] = lerp(point, card[i], fold);
        return `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`;
      })
      .join(" ") + "Z";
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 128 128"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="old-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef3fb" />
          <stop offset="1" stopColor="#9fb0c8" />
        </linearGradient>
        <radialGradient id="old-glow" cx="50%" cy="18%" r="80%">
          <stop offset="0" stopColor="#1b2330" />
          <stop offset="1" stopColor="#0a0d13" />
        </radialGradient>
      </defs>
      <g opacity={1 - final}>
        <rect
          x="2.667"
          y="2.667"
          width="122.666"
          height="122.666"
          rx="29.333"
          fill="url(#old-glow)"
          stroke="#27303d"
          strokeWidth="2.667"
          opacity={
            reveal(t, cue.toLogo + 0.2, cue.cat - 0.2) *
            (1 - reveal(t, cue.fold, cue.fold + 0.6))
          }
        />
        <rect
          x={22 + 20 * back}
          y={30 + 16 * back}
          width={64 + 8 * Math.max(0, 1 - back)}
          height="48"
          rx={glide(t, [cue.grow, cue.mark], [24, 11])}
          fill={lavender}
          opacity={reveal(t, cue.grow, cue.grow + 0.15)}
        />
        <path
          d={path}
          pathLength={1}
          strokeDasharray={drawn < 1 ? `${drawn} 1` : undefined}
          opacity={drawn > 0.01 ? 1 : 0}
          fill="#20212a"
          fillOpacity={reveal(t, cue.fold + 0.3, cue.card)}
          stroke={
            t < cue.fold
              ? "url(#old-mark)"
              : interpolateColors(t, [cue.fold, cue.card], ["#c4d0e0", ivory])
          }
          strokeWidth={glide(t, [cue.fold, cue.card], [7.2, 5])}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={`M38.5 47.5h${38 * line(cue.lines[0])} M38.5 60.5h${23 * line(cue.lines[1])}`}
          fill="none"
          stroke={ivory}
          strokeWidth="5"
          strokeLinecap="round"
          opacity={reveal(t, cue.lines[0], cue.lines[0] + 0.05)}
        />
      </g>
      <image
        href={staticFile("mark.svg")}
        width="128"
        height="128"
        opacity={final}
      />
    </svg>
  );
};
