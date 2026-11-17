import React from "react";
import { Img, staticFile } from "remotion";
import { CLIP_FRAMES, CLIP_SHIFT, cue, footageTime, HELD_AT, lin, sfx, shotAt, TALL_CLIPS, W } from "./clock";
import { EN, enLines, WINDOW, windowRect } from "./layout";
import { C, SANS } from "./theme";

// Every clip is cut to 1440 × 600 (2.4:1); the window shows its middle 1080.
const SRC_W = 1440;
const SRC_H = 600;
const outline = "0 0 3px #000, 0 0 7px #000, 0 3px 8px rgba(0,0,0,.9)";

/** The player's control bar is up while the viewer pauses and drags back. */
export const scrubShow = (t: number) => lin(t, [cue.pause - 0.75, cue.pause - 0.5, cue.play + 0.8, cue.play + 1.1], [0, 1, 1, 0]);

const frameUrl = (clip: string, i: number) => staticFile(`frames/${clip}/f${String(Math.min(CLIP_FRAMES[clip] - 1, Math.max(0, i))).padStart(4, "0")}.jpg`);

/** The film being watched: a cinema window carrying the footage and its
 * burned-in English line, in the light the film casts around it. */
export const Picture: React.FC<{ t: number }> = ({ t }) => {
  const shot = shotAt(t);
  const exact = shot.frame;
  // Normal speed shows the 24 fps frame on screen; slow motion blends
  // neighbours so the drift stays smooth.
  const blend = shot.slow ? exact - Math.floor(exact) : 0;
  const index = shot.slow ? Math.floor(exact) : Math.floor(exact + 1e-6);
  const blur = lin(t, [cue.slot - 0.1, cue.slot + 0.45, cue.start + 0.4, cue.circle + 0.25, cue.brand - 0.1, cue.brand + 0.5], [0, 12, 12, 0, 0, 10]);
  const dim = lin(
    t,
    [cue.slot - 0.1, cue.slot + 0.45, cue.start + 0.4, cue.circle + 0.3, cue.confirm, cue.read, cue.brand - 0.1, cue.brand + 0.6],
    [0.08, 0.56, 0.56, 0.3, 0.3, 0.1, 0.1, 0.68],
  );
  const burned = lin(t, [cue.brand - 0.05, cue.brand + 0.3], [1, 0]);
  const lines = shot.en ? enLines(shot.en) : [];
  const raise = 92 * scrubShow(t);

  // Cold-open clips are 4:5 (1080 × 1350) and fill the tall window; the rest
  // are 2.4:1 and the cinema window shows their middle 1080.
  const tall = TALL_CLIPS.has(shot.clip);
  const win = windowRect(t);
  // A wide clip covers the window when it grows taller than the clip.
  const cover = Math.max(1, win.h / SRC_H);
  const img = (i: number, opacity = 1) =>
    tall ? (
      <Img src={frameUrl(shot.clip, i)} style={{ position: "absolute", left: 0, top: (win.h - 1350) / 2, width: W, height: 1350, opacity }} />
    ) : (
      <Img src={frameUrl(shot.clip, i)} style={{ position: "absolute", left: -(SRC_W * cover - W) / 2 - (CLIP_SHIFT[shot.clip] ?? 0) * cover, top: (win.h - SRC_H * cover) / 2, width: SRC_W * cover, height: SRC_H * cover, opacity }} />
    );
  // Zoom-through from the scream to the rider: the scream pushes in and blurs
  // over its last beat, the rider arrives pushed in and settles as Red hits.
  const through = cue.cuts.rider;
  const zin = t >= cue.zoom && t < through ? Math.pow((t - cue.zoom) / (through - cue.zoom), 2) : 0;
  const zout = t >= through && t < through + 0.36 ? Math.pow(1 - (t - through) / 0.36, 3) : 0;
  const zoom = 1 + 0.32 * Math.max(zin, zout);
  const smear = 10 * Math.max(zin, zout);
  // The surround is the same frame, small, blurred and dark.
  const ambient = (i: number, opacity = 1) =>
    tall ? (
      <Img src={frameUrl(shot.clip, i)} style={{ position: "absolute", left: -(384 - 270) / 2, top: 0, width: 384, height: 480, opacity }} />
    ) : (
      <Img src={frameUrl(shot.clip, i)} style={{ position: "absolute", left: -(1152 - 270) / 2, top: 0, width: 1152, height: 480, opacity }} />
    );

  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, scale: 1 + blur * 0.004 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 270, height: 480, overflow: "hidden", transformOrigin: "0 0", scale: 4, filter: "blur(15px) brightness(.34) saturate(1.35)" }}>
          {ambient(index)}
          {blend > 0.02 && ambient(index + 1, blend)}
        </div>
        <div style={{ position: "absolute", left: 0, top: win.y, width: W, height: win.h, overflow: "hidden", background: "#000" }}>
          <div style={{ position: "absolute", inset: 0, scale: zoom, filter: smear > 0.2 ? `blur(${smear}px)` : undefined }}>
            {img(index)}
            {blend > 0.02 && img(index + 1, blend)}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,7,0) 62%, rgba(5,5,7,.5) 100%)" }} />
        </div>
        {lines.length > 0 && (
          <div style={{ position: "absolute", left: 0, width: W, top: EN.bottom - lines.length * EN.lineH - raise, height: lines.length * EN.lineH, opacity: burned }}>
            {lines.map((text, row) => (
              <div key={row} style={{ position: "absolute", left: 0, width: W, top: row * EN.lineH, height: EN.lineH, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SANS, fontSize: EN.size, fontWeight: EN.weight, color: "#fff", textShadow: outline, whiteSpace: "nowrap" }}>
                {text}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: dim }} />
      <Flash t={t} at={cue.pause} paused />
      <Flash t={t} at={cue.play} paused={false} />
    </div>
  );
};

/** The player's own pause / play mark, flashed over the picture. */
const Flash: React.FC<{ t: number; at: number; paused: boolean }> = ({ t, at, paused }) => {
  const u = (t - at) / 0.7;
  if (u <= 0 || u >= 1) return null;
  const centre = WINDOW.y + WINDOW.h / 2;
  return (
    <div style={{ position: "absolute", left: 540 - 90, top: centre - 90 - 40, width: 180, height: 180, borderRadius: 90, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - u, scale: 0.9 + 0.3 * u }}>
      <svg width="84" height="84" viewBox="0 0 24 24" fill="#fff">
        {paused ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
      </svg>
    </div>
  );
};

export const HELD = HELD_AT;
export const SEEKED = footageTime(sfx.drop + 0.01);
