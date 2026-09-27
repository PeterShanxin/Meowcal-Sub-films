import React from "react";
import type { Layout } from "./layout";
import { ease, sp, tween } from "./motion";
import { glyphRects } from "./Capture";
import { BurnedInSubtitle } from "./Footage";
import { MONTAGE } from "./scenes";
import { units } from "./text";
import { C, FONT_DISPLAY, FONT_TEXT } from "./theme";
import { T } from "./timeline";

const FINAL = MONTAGE[MONTAGE.length - 1];

export function payoffVisibility(f: number): number {
  return (
    tween(f, [T.payoff.start + 4, T.payoff.start + 18], [0, 1]) *
    (1 - tween(f, [T.payoff.collapse, T.payoff.collapse + 14], [0, 1]))
  );
}

// What OCR read, lifted off the footage onto its own layer.
export const RecognizedText: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  const visible = payoffVisibility(f);
  if (visible <= 0) return null;
  const { rects } = glyphRects(FINAL.lines[0], FINAL.source, L);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: visible }}>
      <BurnedInSubtitle line={FINAL.lines[0]} lang={FINAL.source} L={L} color="#dce8ff" shadow={false} />
      {rects.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            border: `${2 * L.u}px solid rgba(170, 205, 255, 0.9)`,
            borderRadius: 5 * L.u,
            background: "rgba(170, 205, 255, 0.08)",
            opacity: tween(f, [T.payoff.start + 16 + i * 2, T.payoff.start + 22 + i * 2], [0, 1]),
          }}
        />
      ))}
    </div>
  );
};

// A layer name in screen space, pinned to a projected point on its 3D layer
// so it stays upright and phone-legible while the layers swing.
export const LayerLabel: React.FC<{
  f: number;
  L: Layout;
  start: number;
  text: string;
  at: { x: number; y: number };
  below?: boolean;
}> = ({ f, L, start, text, at, below = false }) => {
  if (f < start) return null;
  const enter = sp(f, start, { damping: 15, stiffness: 220 });
  // Labels explain the layers, then clear the stage for the statement.
  const exit = tween(f, [T.payoff.statement - 8, T.payoff.statement + 2], [0, 1], ease.in);
  const height = 74 * L.u;
  return (
    <div
      style={{
        position: "absolute",
        left: at.x,
        top: below ? at.y + 16 * L.u : at.y - height - 16 * L.u,
        height,
        display: "flex",
        alignItems: "center",
        gap: 14 * L.u,
        padding: `0 ${26 * L.u}px 0 ${22 * L.u}px`,
        borderRadius: height / 2,
        background: "rgba(14, 17, 24, 0.92)",
        border: `${1.5 * L.u}px solid ${C.line}`,
        boxShadow: `0 ${14 * L.u}px ${40 * L.u}px -${14 * L.u}px rgba(0,0,0,0.8)`,
        opacity: Math.min(1, enter * 1.5) * (1 - exit),
        transform: `translateY(${(1 - enter) * (below ? -18 : 18) * L.u}px) scale(${0.9 + 0.1 * enter})`,
        transformOrigin: "left center",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 14 * L.u,
          height: 14 * L.u,
          borderRadius: 999,
          background: C.accent,
          boxShadow: `0 0 ${14 * L.u}px rgba(232,238,247,0.7)`,
        }}
      />
      <span style={{ font: `600 ${40 * L.u}px ${FONT_TEXT}`, color: C.text1 }}>{text}</span>
    </div>
  );
};

export const Statement: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  const start = T.payoff.statement;
  if (f < start - 2 || f > T.payoff.collapse + 20) return null;
  const words = units("Never leaves your PC.", "en-US");
  const size = (L.portrait ? 96 : 112) * L.u;
  const exit = tween(f, [T.payoff.collapse - 4, T.payoff.collapse + 6], [0, 1], ease.in);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: L.portrait ? L.H * 0.12 : L.H * 0.075,
        textAlign: "center",
        whiteSpace: "pre",
        font: `700 ${size}px ${FONT_DISPLAY}`,
        letterSpacing: -2 * L.u,
        color: C.text1,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 30 * L.u}px)`,
        textShadow: `0 ${10 * L.u}px ${50 * L.u}px rgba(0,0,0,0.6)`,
      }}
    >
      {words.map((word, i) => {
        const rise = sp(f, start + i * 3, { damping: 14, stiffness: 210 });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, rise * 1.6),
              transform: `translateY(${(1 - rise) * 60 * L.u}px) scale(${0.9 + 0.1 * rise})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
