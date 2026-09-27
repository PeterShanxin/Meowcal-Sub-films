import React from "react";
import { Img, staticFile } from "remotion";
import type { Layout } from "./layout";
import type { Line, Scene } from "./scenes";
import { fitSize } from "./text";
import { FONT_DISPLAY, fontFor } from "./theme";

// The footage extends past the frame so camera moves never reveal an edge;
// the payoff crops it back to exactly the frame to show it as a screen.
export const OVERSCAN = 0.35;

export function sourceFont(lang: string, size: number): string {
  return `600 ${size}px ${fontFor(lang, FONT_DISPLAY)}`;
}

export function sourceSizeFor(line: Line, lang: string, L: Layout): number {
  return fitSize(line.source, (s) => sourceFont(lang, s), L.sourceSize, L.box.w - 90 * L.u);
}

export const BurnedInSubtitle: React.FC<{
  line: Line;
  lang: string;
  L: Layout;
  color?: string;
  shadow?: boolean;
  opacity?: number;
}> = ({ line, lang, L, color = "#ffffff", shadow = true, opacity = 1 }) => {
  const size = sourceSizeFor(line, lang, L);
  return (
    <div
      lang={lang}
      style={{
        position: "absolute",
        left: 0,
        width: L.W,
        top: L.box.y + L.box.h / 2 - size * 0.7,
        height: size * 1.4,
        lineHeight: `${size * 1.4}px`,
        textAlign: "center",
        font: sourceFont(lang, size),
        color,
        opacity,
        whiteSpace: "nowrap",
        textShadow: shadow
          ? `0 0 ${3 * L.u}px rgba(0,0,0,0.95), 0 0 ${9 * L.u}px rgba(0,0,0,0.55), 0 ${2 * L.u}px ${12 * L.u}px rgba(0,0,0,0.75)`
          : "none",
      }}
    >
      {line.source}
    </div>
  );
};

export const Footage: React.FC<{
  scene: Scene;
  line: Line | null;
  L: Layout;
  age: number;
  offsetX?: number;
  blurId?: string;
  crop?: number;
}> = ({ scene, line, L, age, offsetX = 0, blurId, crop = 0 }) => {
  const ex = (OVERSCAN / 2) * L.W;
  const ey = (OVERSCAN / 2) * L.H;
  const push = 1.02 + age * 0.00022;
  const radius = crop * 22 * L.u;
  return (
    <div
      style={{
        position: "absolute",
        left: -ex,
        top: -ey,
        width: L.W + 2 * ex,
        height: L.H + 2 * ey,
        transform: `translateX(${offsetX}px)`,
        clipPath: `inset(${crop * ey}px ${crop * ex}px ${crop * ey}px ${crop * ex}px round ${radius}px)`,
        filter: blurId ? `url(#${blurId})` : undefined,
        overflow: "hidden",
        background: "#05070c",
      }}
    >
      <Img
        src={staticFile(`scenes/photo/${scene.backdrop}.jpg`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateX(${-age * 0.12 * L.u}px) scale(${push})`,
        }}
      />
      {line ? (
        <div style={{ position: "absolute", left: ex, top: ey, width: L.W, height: L.H }}>
          <BurnedInSubtitle line={line} lang={scene.source} L={L} />
        </div>
      ) : null}
    </div>
  );
};
