import { Easing, interpolate, spring, type SpringConfig } from "remotion";

export const FPS = 60;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.3),
  // A hand dragging a mouse: quick start, long settle.
  drag: Easing.bezier(0.45, 0.05, 0.2, 1),
  linear: (t: number) => t,
};

export function tween(
  frame: number,
  range: [number, number],
  output: [number, number],
  easing: (t: number) => number = ease.inOut,
): number {
  return interpolate(frame, range, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function sp(frame: number, start: number, config: Partial<SpringConfig> = {}): number {
  if (frame < start) return 0;
  return spring({
    frame: frame - start,
    fps: FPS,
    config: { damping: 14, stiffness: 170, mass: 0.9, ...config },
  });
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Decaying, deterministic shake for impacts.
export function shake(frame: number, start: number, amplitude: number, frames = 18): [number, number] {
  const t = frame - start;
  if (t < 0 || t > frames) return [0, 0];
  const decay = (1 - t / frames) ** 2;
  return [
    amplitude * decay * Math.sin(t * 2.9 + 1.3),
    amplitude * decay * Math.sin(t * 3.7 + 0.4),
  ];
}
