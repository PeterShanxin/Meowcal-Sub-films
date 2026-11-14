import { Easing, interpolate } from "remotion";
import { accents } from "./cues";

export const ivory = "#f6f5fa";
export const lavender = "#b6a7df";
export const ink = "#090c13";
export const font = '"Meowcal Sans", sans-serif';
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Shape changes share one timing curve.
export const glide = (time: number, keys: number[], values: number[]) =>
  interpolate(time, keys, values, {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.25, 1),
  });
export const reveal = (time: number, from: number, to: number) =>
  interpolate(time, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
// Moves from a to b on a beat: a short wind-up, a 6 % overshoot, then rest.
export const settle = (
  time: number,
  at: number,
  a: number,
  b: number,
  length = 0.6,
) =>
  glide(
    time,
    [at - 0.08, at, at + length * 0.55, at + length],
    [a, a - (b - a) * 0.04, b + (b - a) * 0.06, b],
  );
// A squash-and-recover impulse that peaks just after the hit.
export const bump = (time: number, at: number, length = 0.4) => {
  const u = (time - at) / length;
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * Math.sqrt(u)) * (1 - u);
};
export const impact = (time: number) =>
  accents.reduce((sum, [at, weight]) => sum + weight * bump(time, at, 0.7), 0);
