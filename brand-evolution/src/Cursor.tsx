import React from "react";

export const Cursor: React.FC<{
  x: number;
  y: number;
  scale: number;
  opacity: number;
  size: number;
}> = ({ x, y, scale, opacity, size }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 34 44"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      scale,
      transformOrigin: "0 0",
    }}
  >
    <path
      d="M2 2L29 27H17L11 40Z"
      fill="white"
      stroke="#10131b"
      strokeWidth="2"
    />
  </svg>
);
