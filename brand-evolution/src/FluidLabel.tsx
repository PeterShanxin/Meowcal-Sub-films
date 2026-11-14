import React, { useId } from "react";
import { font } from "./motion";
export const FluidLabel: React.FC<{
  before: string;
  after: string;
  progress: number;
  width: number;
  height?: number;
  size: number;
  weight?: number;
  color?: string;
  align?: "start" | "middle";
  style?: React.CSSProperties;
}> = ({
  before,
  after,
  progress: p,
  width,
  height = 50,
  size,
  weight = 500,
  color = "#f6f5fa",
  align = "start",
  style,
}) => {
  const id = useId().replace(/:/g, "");
  const moving = p > 0 && p < 1;
  const x = align === "middle" ? width / 2 : 4;
  // Large headings need a proportionally wider blur to melt into each other.
  const blur = Math.max(5, size * 0.12);
  // The CJK font sets ’ full width; Latin-only labels use proportional forms.
  const variant = (text: string) =>
    /[\u3000-\u9fff\uff00-\uffef]/.test(text)
      ? undefined
      : { fontVariantEastAsian: "proportional-width" as const };
  const common = {
    x,
    y: height / 2,
    fontSize: size,
    fontWeight: weight,
    textAnchor: align,
    dominantBaseline: "central" as const,
  };
  return (
    <svg
      width={width}
      height={height}
      style={{
        overflow: "visible",
        fontFamily: font,
        ...style,
      }}
      aria-label={p < 0.5 ? before : after}
    >
      <defs>
        <filter id={`${id}-old`} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation={p * blur} />
        </filter>
        <filter id={`${id}-new`} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation={(1 - p) * blur} />
        </filter>
        <filter id={`${id}-join`} x="-30%" y="-80%" width="160%" height="260%">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
          />
        </filter>
      </defs>
      {moving ? (
        <g
          fill={color}
          filter={`url(#${id}-join)`}
          style={{
            transformOrigin: `${x}px ${height / 2}px`,
            transform: `scale(${1 + 0.04 * Math.sin(p * Math.PI)},${1 - 0.06 * Math.sin(p * Math.PI)})`,
          }}
        >
          <text
            {...common}
            opacity={Math.pow(1 - p, 0.45)}
            filter={`url(#${id}-old)`}
            style={variant(before)}
          >
            {before}
          </text>
          <text
            {...common}
            opacity={Math.pow(p, 0.45)}
            filter={`url(#${id}-new)`}
            style={variant(after)}
          >
            {after}
          </text>
        </g>
      ) : (
        <text
          {...common}
          fill={color}
          style={variant(p === 0 ? before : after)}
        >
          {p === 0 ? before : after}
        </text>
      )}
    </svg>
  );
};
