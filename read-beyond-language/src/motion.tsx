import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import type { CSSProperties, ReactNode } from "react";
export const ink = "#07090f";
export const paper = "#e8eef7";
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const move = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
export const linear = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
export const pop = (f: number, start: number) =>
  spring({
    frame: f - start,
    fps: 60,
    config: { damping: 20, stiffness: 150, mass: 0.8 },
  });
export const useLayout = () => {
  const { width: w, height: h } = useVideoConfig();
  const compact = w < 1500;
  return { w, h, compact, margin: compact ? 72 : 112 };
};
export const Reveal = ({
  children,
  f,
  start,
  style = {},
}: {
  children: ReactNode;
  f: number;
  start: number;
  style?: CSSProperties;
}) => (
  <div style={{ overflow: "hidden", paddingBottom: 12, ...style }}>
    <div
      style={{
        transform: `translateY(${move(f, start, start + 36, 115, 0)}%)`,
      }}
    >
      {children}
    </div>
  </div>
);
export const Corners = ({
  width,
  height,
  weight = 3,
  size = 26,
}: {
  width: number;
  height: number;
  weight?: number;
  size?: number;
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: "absolute", inset: 0, overflow: "visible" }}
  >
    <path
      d={`M0 ${size}V0H${size} M${width - size} 0H${width}V${size} M${width} ${height - size}V${height}H${width - size} M${size} ${height}H0V${height - size}`}
      fill="none"
      stroke={paper}
      strokeWidth={weight}
    />
  </svg>
);
export const Cat = ({
  size = 100,
  progress = 1,
}: {
  size?: number;
  progress?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4.6 10V4.2l4.3 3.3c1-.33 2-.5 3.1-.5s2.1.17 3.1.5l4.3-3.3V10c.85 1.1 1.3 2.4 1.3 3.8 0 3.9-3.8 6.7-8.7 6.7s-8.7-2.8-8.7-6.7c0-1.4.45-2.7 1.3-3.8z"
      stroke={paper}
      strokeWidth="1.45"
      strokeLinejoin="round"
      pathLength="1"
      strokeDasharray="1"
      strokeDashoffset={1 - progress}
    />
  </svg>
);
export const Cursor = ({
  x,
  y,
  press = 0,
  opacity = 1,
}: {
  x: number;
  y: number;
  press?: number;
  opacity?: number;
}) => (
  <svg
    width="55"
    height="66"
    viewBox="0 0 32 40"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${1 - press * 0.17})`,
      filter: "drop-shadow(0 3px 7px #0008)",
    }}
  >
    <path
      d="M3 2L28 24L17 25L12 36Z"
      fill="white"
      stroke="#0b0b0b"
      strokeWidth="2"
    />
  </svg>
);
