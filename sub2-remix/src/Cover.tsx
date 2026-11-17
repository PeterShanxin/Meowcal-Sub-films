import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { LINES } from "./clock";
import { IconArt } from "./Icon";
import { C, FontGate, SANS } from "./theme";

// Xiaohongshu cover, 1080 × 1440: designed for the feed tile, not a film frame.
// The frame is Sintel answering the shaman (film time 2:24.0); the line on the
// plate is the film's own Chinese subtitle for it.
const outline = "0 0 3px #000, 0 0 8px #000, 0 3px 10px rgba(0,0,0,.9)";
const FRAME = "frames/sintel/f0648.jpg";
const LINE = LINES[9];

export const MarkTile: React.FC<{ size: number }> = ({ size }) => <IconArt size={size} id="cover" />;

export const Cover: React.FC = () => {
  const rows = LINE.en.split("\n");
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, overflow: "hidden" }}>
      <FontGate>
        {/* The film's own light, blurred, around the window. */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 270, height: 360, overflow: "hidden", transformOrigin: "0 0", scale: 4, filter: "blur(14px) brightness(.42) saturate(1.4)" }}>
          <Img src={staticFile(FRAME)} style={{ position: "absolute", left: -(864 - 270) / 2, top: 0, width: 864, height: 360 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,7,.55) 0%, rgba(5,5,7,.1) 40%, rgba(5,5,7,.1) 70%, rgba(5,5,7,.7) 100%)" }} />

        <div style={{ position: "absolute", left: 64, top: 68, fontSize: 58, fontWeight: 800, color: "#e8e6e1", letterSpacing: -0.5, textShadow: "0 4px 20px #000" }}>想看的片，只有外语字幕？</div>
        <div style={{ position: "absolute", left: 52, top: 150, fontSize: 168, fontWeight: 900, letterSpacing: -8, lineHeight: 1.1, color: "#fffaf0", textShadow: "10px 10px 0 #b97a38, 0 0 60px rgba(0,0,0,.6)" }}>
          好字幕，<br />自动上屏！
        </div>
        <div style={{ position: "absolute", right: 54, top: 196, rotate: "7deg", background: "#ffd84a", color: "#17130a", fontSize: 58, fontWeight: 900, padding: "10px 28px", borderRadius: 16, boxShadow: "0 14px 34px rgba(0,0,0,.6)" }}>
          免费开源
        </div>

        {/* The film: a cinema window, its burned-in English line, and the second subtitle. */}
        <div style={{ position: "absolute", left: 0, top: 600, width: 1080, height: 450, overflow: "hidden", background: "#000", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
          <Img src={staticFile(FRAME)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 450 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,7,0) 55%, rgba(5,5,7,.5) 100%)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1020 - rows.length * 50, height: rows.length * 50 }}>
          {rows.map((text, row) => (
            <div key={row} style={{ position: "absolute", left: 0, width: 1080, top: row * 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 600, color: "#fff", textShadow: outline, whiteSpace: "nowrap" }}>
              {text}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1086, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", padding: "40px 54px 28px", borderRadius: 38, background: "rgba(0,0,0,.82)", boxShadow: "0 0 0 5px #f2c78f, 0 0 70px rgba(242,199,143,.45)" }}>
            <span style={{ display: "block", fontSize: 72, fontWeight: 700, lineHeight: 1.2, color: "#fff", whiteSpace: "nowrap" }}>{LINE.zh}</span>
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, width: 1080, top: 1290, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <MarkTile size={108} />
          <span style={{ fontSize: 68, fontWeight: 600, letterSpacing: -2, color: "#f2f0ec", whiteSpace: "nowrap" }}>
            Meowcal Sub <span style={{ color: "#ebc58b" }}>2</span>
            <span style={{ color: "#8d8a84", margin: "0 14px" }}>·</span>
            妙影<span style={{ color: "#ebc58b" }}>2</span>
          </span>
        </div>
      </FontGate>
    </AbsoluteFill>
  );
};
