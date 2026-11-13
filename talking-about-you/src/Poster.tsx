import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT_DISPLAY, fontFor } from "../../launch-15s/src/film/theme";
import { Grain } from "./Film";
import { SCENES } from "./scenes";
import { H, W } from "./timeline";

// 3:4 cover: a strip from each of the five films, side by side.
export const POSTER = { w: W, h: 1440 };
const ZH = fontFor("zh-CN", FONT_DISPLAY);
const STRIP = { top: 400, w: 204, h: 1040, gap: 15, scale: 0.62 };
// The part of each film that carries its subject, in film pixels.
const WINDOW = [
  { x: 300, y: 240 },
  { x: 340, y: 240 },
  { x: 200, y: 200 },
  { x: 190, y: 240 },
  { x: 410, y: 240 },
];

export const Poster: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 60, top: 70, color: C.text1, font: `700 132px ${ZH}`, letterSpacing: -3, lineHeight: 1.16, whiteSpace: "pre" }}>
      <div>Fable 5.2</div>
      <div style={{ fontSize: 100, letterSpacing: -1 }}>用代码拍了五部电影</div>
    </div>
    {SCENES.map((Scene, i) => (
      <div key={i} style={{ position: "absolute", left: i * (STRIP.w + STRIP.gap), top: STRIP.top, width: STRIP.w, height: STRIP.h, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -WINDOW[i].x * STRIP.scale, top: -WINDOW[i].y * STRIP.scale, width: W, height: H, transform: `scale(${STRIP.scale})`, transformOrigin: "0 0" }}>
          <Scene t={400} />
          <Grain f={0} />
        </div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, top: 1150, width: W, height: 290, background: "linear-gradient(180deg,rgba(7,9,15,0) 0%,rgba(7,9,15,0.94) 62%)" }} />
    <div style={{ position: "absolute", left: 60, top: 1284, display: "flex", alignItems: "center", gap: 26 }}>
      <svg width={104} height={104} viewBox="14 22 100 80">
        <rect x="42" y="46" width="64" height="48" rx="11" fill="#b6a7df" />
        <rect x="22" y="30" width="72" height="50" rx="11" fill="#20212a" stroke="#f6f5fa" strokeWidth="5" />
        <path d="M38.5 47.5h38M38.5 60.5h23" stroke="#f6f5fa" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span style={{ font: `600 60px ${ZH}`, letterSpacing: -1, color: "#f6f5fa", whiteSpace: "pre" }}>Meowcal Sub · 妙影</span>
    </div>
  </AbsoluteFill>
);
