import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Palette and type from Meowcal Sub 2's studio (overlay/ui/src/styles/theme.css)
// and its icon (docs/assets/icon.svg).
export const C = {
  bg: "#050507",
  glass: "rgba(18, 18, 24, 0.82)",
  glassLine: "rgba(255, 255, 255, 0.09)",
  heading: "#f5f2eb",
  body: "#e8e6e1",
  muted: "#8a8a96",
  label: "#6a6a76",
  dim: "#5a5a66",
  gold: "#f2c78f",
  goldDeep: "#b97a38",
  goldTint: "rgba(242, 199, 143, 0.12)",
  goldRing: "rgba(242, 199, 143, 0.2)",
  ok: "#4ade80",
  danger: "#ff8f8f",
  select: "rgba(255, 183, 67, 0.98)",
};
export const SANS = '"Inter", "Noto Sans SC", sans-serif';
export const MONO = '"JetBrains Mono", "Noto Sans SC", monospace';
export const GOLD_TEXT = "linear-gradient(160deg, #fff0cc 0%, #ebc58b 45%, #b89a72 100%)";

const FACES: [string, string, string][] = [
  ["Inter", "fonts/Inter.ttf", "100 900"],
  ["Noto Sans SC", "fonts/NotoSansSC.ttf", "100 900"],
  ["JetBrains Mono", "fonts/JetBrainsMono.ttf", "100 800"],
];

/** Children render only once the three faces are in, so text can be measured. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(
      FACES.map(([family, file, weight]) => new FontFace(family, `url(${staticFile(file)})`, { weight }).load()),
    )
      .then((faces) => {
        faces.forEach((face) => (document.fonts as unknown as { add(face: FontFace): void }).add(face));
        setReady(true);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
  return ready ? <>{children}</> : null;
};

let canvas: CanvasRenderingContext2D | null = null;
/** Width of `text` in px. Call only under FontGate. */
export const measure = (text: string, size: number, weight: number, family = SANS, tracking = 0) => {
  canvas ??= document.createElement("canvas").getContext("2d")!;
  canvas.font = `${weight} ${size}px ${family}`;
  return canvas.measureText(text).width + tracking * text.length;
};

export type Rect = { x: number; y: number; w: number; h: number; r: number };
export const at = (rect: Rect): React.CSSProperties => ({
  position: "absolute",
  left: rect.x,
  top: rect.y,
  width: rect.w,
  height: rect.h,
  borderRadius: rect.r,
});
