import React from "react";
import { Img, staticFile } from "remotion";
import { bump, cue, FIRST, lin, LINES, pop, reveal, sfx } from "./clock";
import { LIST_Y, PAL, rigRect, ROW_H, START, TRACK, TRACK_TEXT_X, captureBox } from "./layout";
import { IconArt } from "./Icon";
import { at, C, MONO, SANS } from "./theme";

// One glass object carries the whole film: the empty slot where a second
// subtitle should be becomes the Meowcal mark, the mark opens into the studio's search, the search hands
// its gold button to the capture box, the box's toolbar grows into the subtitle
// file, the file folds down into the plate, and at the end the mark rises out
// of the plate.

const TYPE_END = sfx.typeStart + sfx.typeStep * (sfx.typeText.length - 1);

export const Rig: React.FC<{ t: number }> = ({ t }) => {
  const first = cue.giveUp - 0.03;
  if (t < first || (t >= sfx.dragPress && t < cue.release)) return null;
  const rect = rigRect(t);
  const arrive =
    bump(t, cue.giveUp + 0.4, 0.5) + bump(t, cue.palette + 0.4, 0.5) + bump(t, cue.lock, 0.5) + 1.6 * bump(t, cue.ears, 0.6);
  // Start pressed: the search steps back out of the way (as the app hides it)
  // before the capture box is drawn; it does not squeeze into the button.
  const dismiss = t >= cue.start && t < cue.release ? lin(t, [cue.start + 0.12, cue.start + 0.42], [1, 0]) : 1;
  if (dismiss <= 0) return null;
  const scale = (1 + 0.03 * arrive) * (0.94 + 0.06 * dismiss);

  const tile = Math.max(lin(t, [cue.giveUp - 0.03, cue.giveUp + 0.03, cue.palette, cue.palette + 0.3], [0, 1, 1, 0]), lin(t, [cue.brand + 0.1, cue.brand + 0.45], [0, 1]));
  // The file folds down into the empty plate and the next line lands in it; at
  // the brand the mark rises out of the plate, as it rose out of the empty slot.
  const away = t > cue.fold && t < cue.brand ? lin(t, [cue.line3 - 0.02, cue.line3 + 0.1], [1, 0]) : t >= cue.brand - 0.5 && t < cue.brand + 0.2 ? lin(t, [cue.brand - 0.08, cue.brand + 0.06], [0, 1]) : 1;
  if (away <= 0) return null;
  // On the downbeat the constructed icon renders: a flash of light as the fills land.
  const render = lin(t, [cue.giveUp - 0.03, cue.giveUp + 0.3], [0.55, 0]) * (t < cue.palette ? 1 : 0);

  return (
    <div style={{ ...at(rect), scale, opacity: lin(t, [first, first + 0.12], [0, 1]) * away * dismiss, overflow: "hidden", background: C.glass,
      backdropFilter: "blur(28px) saturate(1.15)", boxShadow: `0 0 0 2px ${C.glassLine}, 0 0 ${90 * render}px rgba(255,220,160,${render}), 0 40px 90px rgba(0,0,0,.55)` }}>
      <Mark t={t} tile={tile} size={rect.w} />
      {render > 0 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,244,220,.9), rgba(235,197,139,.2) 60%, transparent)", opacity: render, mixBlendMode: "screen" }} />}
      <Palette t={t} />
      <Toolbar t={t} />
      <Track t={t} />
    </div>
  );
};

// ── The Meowcal Sub 2 icon, built part by part: the front card, its lines, the
// translation's card sliding out behind it, then the signal arc and the sparkle.
const Mark: React.FC<{ t: number; tile: number; size: number }> = ({ t, tile, size }) => {
  if (tile <= 0) return null;
  const end = t > cue.brand - 1;
  const at = end ? cue.brand : cue.giveUp;
  // At the start the construction has already drawn every part; at the end the
  // icon builds itself again out of the plate.
  const front = end ? reveal(t, at + 0.15, at + 0.5) : 1;
  const lines = end ? reveal(t, at + 0.3, at + 0.8) : 1;
  const back = end ? reveal(t, at + 0.4, at + 0.8) : 1;
  const arc = end ? reveal(t, cue.ears - 0.05, cue.ears + 0.3) : 1;
  const spark = end ? pop(t, cue.ears, 0.5) : 1;
  // The glass is the tile: draw the artwork so the icon's tile edge meets it.
  const art = (size * 128) / 119;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size, opacity: tile, background: "linear-gradient(150deg, #25272d 0%, #111216 50%, #090a0d 100%)",
      boxShadow: "inset 0 0 0 2px rgba(235,197,139,.5)", borderRadius: "inherit", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: (-4.5 * size) / 119, top: (-4.5 * size) / 119 }}>
        <IconArt size={art} id="rig" tile={0} front={front} lines={lines} back={back} arc={arc} spark={spark} />
      </div>
    </div>
  );
};

// ── The studio's search, as it lays out in a narrow window ─────────────────
const SOURCES = ["OpenSubtitles", "SubDL", "ASSRT"];
type Row = { name: string; sub: string; tag?: "RECOMMENDED" | "AUTO"; plain?: boolean };
const SOURCE_ROWS: Row[] = [
  { name: "Sintel.2010.1080p.en.srt", sub: "英语 · en.srt · OpenSubtitles", tag: "RECOMMENDED" },
  { name: "Sintel.2010.BluRay.en.srt", sub: "英语 · en.srt · SubDL" },
  { name: "Sintel.2010.720p.en.srt", sub: "英语 · en.srt · OpenSubtitles" },
];
const TARGET_ROWS: Row[] = [
  { name: "Sintel.2010.1080p.chs.zh.srt", sub: "简体中文 · zh.srt · ASSRT", tag: "RECOMMENDED" },
  { name: "Sintel.2010.BluRay.chs&eng.zh.srt", sub: "简体中文 · zh.srt · SubDL", tag: "RECOMMENDED" },
  { name: "本地翻译", sub: "本机模型 · 翻译原文字幕", tag: "AUTO", plain: true },
];

const Palette: React.FC<{ t: number }> = ({ t }) => {
  const opacity = lin(t, [cue.palette + 0.2, cue.palette + 0.45, cue.start + 0.4, cue.start + 0.55], [0, 1, 1, 0]);
  if (opacity <= 0) return null;
  const typed = Math.max(0, Math.min(sfx.typeText.length, Math.floor((t - sfx.typeStart) / sfx.typeStep + 1e-6) + 1));
  const text = t < sfx.typeStart ? "" : sfx.typeText.slice(0, typed);
  const searching = lin(t, [sfx.typeStart, sfx.typeStart + 0.2, cue.chips[0] - 0.2, cue.chips[0]], [0, 1, 1, 0]);
  const step = t < cue.pickTitle + 0.12 ? 0 : t < cue.pickSource + 0.1 ? 1 : 2;
  const counts = [t >= cue.chips[0] - 0.1 ? 1 : 0, step >= 1 ? 3 : 0, step >= 2 ? 3 : 0];
  const ready = lin(t, [cue.pickTarget, cue.pickTarget + 0.15], [0.4, 1]);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PAL.w, opacity, fontFamily: SANS, color: C.body }}>
      {/* Search field */}
      <div style={{ position: "absolute", left: 0, top: 0, width: PAL.w, height: PAL.search, display: "flex", alignItems: "center" }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" style={{ marginLeft: 44 }}>
          <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />
        </svg>
        <span style={{ marginLeft: 26, fontSize: 44, fontWeight: 500, color: C.heading, whiteSpace: "pre" }}>{text}</span>
        {t < cue.chips[0] && <span style={{ width: 3, height: 52, marginLeft: 4, background: C.gold, opacity: t < sfx.typeStart || t > TYPE_END ? (Math.floor(t * 2) % 2 ? 0.2 : 1) : 1 }} />}
        {!text && <span style={{ marginLeft: 8, fontSize: 44, fontWeight: 500, color: C.label }}>搜索片名…</span>}
        <div style={{ position: "absolute", right: 40, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 26, fontWeight: 600 }}>
          <span style={{ padding: "8px 14px", borderRadius: 10, border: `2px solid ${C.glassLine}`, color: "#a8a8b2" }}>EN</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.label} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
          <span style={{ padding: "8px 14px", borderRadius: 10, border: `2px solid ${C.goldRing}`, background: C.goldTint, color: C.gold }}>zh</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: PAL.search - 2, width: PAL.w, height: 2, background: C.gold, opacity: 0.75, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, height: 2, width: 340, left: ((t * 1.4) % 1) * (PAL.w + 340) - 340, background: "linear-gradient(90deg, transparent, #fff, transparent)", opacity: searching }} />
      </div>

      {/* Tabs */}
      <div style={{ position: "absolute", left: 28, top: PAL.search, height: PAL.tabs, display: "flex", alignItems: "center", gap: 10 }}>
        {["影视", "原文", "译文"].map((name, i) => (
          <div key={name} style={{ padding: "12px 24px", borderRadius: 14, fontSize: 31, fontWeight: 500, background: step === i ? C.goldTint : "transparent", color: step === i ? C.gold : C.muted }}>
            {name}
            <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 24, color: step === i ? C.gold : C.dim }}>{counts[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: LIST_Y - 1, width: PAL.w, height: 2, background: "rgba(255,255,255,.06)" }} />

      {/* Titles */}
      {step === 0 && t >= cue.chips[0] - 0.12 && (
        <div style={{ position: "absolute", left: 20, top: LIST_Y + 14, width: PAL.w - 40, height: PAL.title - 28, borderRadius: 20,
          opacity: reveal(t, cue.chips[0] - 0.12, cue.chips[0] + 0.1), background: `rgba(242,199,143,${0.05 + 0.1 * bump(t, cue.pickTitle, 0.3)})`, boxShadow: `inset 0 0 0 2px ${C.goldRing}` }}>
          {/* The poster, as the app shows TMDB's (.work-poster: 60 x 88, radius 5, scaled). */}
          <div style={{ position: "absolute", left: 28, top: 20, width: 100, height: 146, borderRadius: 9, overflow: "hidden", background: "#111116", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.08)" }}>
            <Img src={staticFile("frames/poster.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: reveal(t, cue.chips[0] - 0.05, cue.chips[0] + 0.17) }} />
          </div>
          <div style={{ position: "absolute", left: 156, top: 16, fontSize: 42, fontWeight: 600, color: C.heading }}>Sintel</div>
          <div style={{ position: "absolute", left: 156, top: 74, fontSize: 27, color: C.muted }}>2010 · 电影</div>
          <div style={{ position: "absolute", left: 156, top: 122, display: "flex", gap: 12 }}>
            {SOURCES.map((source, i) => (
              <span key={source} style={{ padding: "6px 16px", borderRadius: 30, fontSize: 24, fontWeight: 600, color: C.gold, background: C.goldTint, border: `2px solid ${C.goldRing}`,
                opacity: lin(t, [cue.chips[i] - 0.03, cue.chips[i] + 0.05], [0, 1]), scale: 0.6 + 0.4 * pop(t, cue.chips[i] - 0.03, 0.3) }}>
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Source, then target */}
      {step >= 1 &&
        (step === 1 ? SOURCE_ROWS : TARGET_ROWS).map((row, i) => {
          const from = (step === 1 ? cue.pickTitle + 0.12 : cue.pickSource + 0.1) + i * 0.05;
          const picked = i === 0 && (step === 1 ? t >= cue.pickSource : t >= cue.pickTarget);
          const flash = i === 0 ? bump(t, step === 1 ? cue.pickSource : cue.pickTarget, 0.3) : 0;
          return (
            <div key={row.name} style={{ position: "absolute", left: 0, top: LIST_Y + i * PAL.row, width: PAL.w, height: PAL.row, opacity: reveal(t, from, from + 0.2),
              scale: 0.97 + 0.03 * reveal(t, from, from + 0.25) }}>
              <div style={{ position: "absolute", left: 16, top: 8, right: 16, bottom: 8, borderRadius: 18, background: `rgba(242,199,143,${(i === 0 ? 0.06 : 0) + 0.12 * flash})`,
                boxShadow: picked ? `inset 0 0 0 2px ${C.goldRing}` : undefined }} />
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={row.plain ? C.gold : C.muted} strokeWidth="1.8" strokeLinecap="round" style={{ position: "absolute", left: 44, top: 44 }}>
                {row.plain ? <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> : <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 10h8M8 14h5" /></>}
              </svg>
              <div style={{ position: "absolute", left: 112, top: 22, width: row.tag === "RECOMMENDED" ? 500 : 620, fontFamily: row.plain ? SANS : MONO, fontSize: row.plain ? 34 : 30, fontWeight: 500,
                color: C.heading, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</div>
              <div style={{ position: "absolute", left: 112, top: 72, fontSize: 25, color: C.muted, whiteSpace: "nowrap" }}>{row.sub}</div>
              {row.tag && (
                <div style={{ position: "absolute", right: 36, top: 24, padding: "6px 14px", borderRadius: 9, fontSize: 21, fontWeight: 700, letterSpacing: 1.6,
                  color: row.tag === "AUTO" ? "#1a1408" : C.gold, background: row.tag === "AUTO" ? C.gold : C.goldTint, border: `2px solid ${C.goldRing}` }}>{row.tag === "AUTO" ? "自动" : "推荐"}</div>
              )}
            </div>
          );
        })}

      {/* Start */}
      {step === 2 && (
        <div style={{ position: "absolute", left: START.x - PAL.x, top: START.y - PAL.y, width: START.w, height: START.h, borderRadius: START.r, opacity: ready * reveal(t, cue.pickSource + 0.2, cue.pickSource + 0.45),
          background: "linear-gradient(180deg, #f6d3a2, #dba564)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, scale: 1 - 0.05 * bump(t, cue.start, 0.25) + 0.04 * bump(t, cue.pickTarget, 0.35),
          boxShadow: "0 10px 30px rgba(242,199,143,.25)" }}>
          <span style={{ fontSize: 32, fontWeight: 650, color: "#1a1408" }}>开始识别并同步</span>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: "#3a2a12", padding: "5px 10px", borderRadius: 8, background: "rgba(0,0,0,.14)" }}>Ctrl ↵</span>
        </div>
      )}
    </div>
  );
};

// ── The capture selector's toolbar ─────────────────────────────────────────
export const CONFIRM_X = 345; // centre of Confirm inside the toolbar
const Toolbar: React.FC<{ t: number }> = ({ t }) => {
  const opacity = lin(t, [cue.release + 0.1, cue.release + 0.25, cue.confirm + 0.05, cue.confirm + 0.2], [0, 1, 1, 0]);
  if (opacity <= 0) return null;
  const box = captureBox();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 96, opacity, fontFamily: SANS }}>
      <span style={{ position: "absolute", left: 36, top: 0, lineHeight: "96px", fontSize: 25, fontWeight: 700, letterSpacing: 4, color: "rgba(244,239,230,.72)" }}>
        {Math.round(box.w)} × {Math.round(box.h)}
      </span>
      <div style={{ position: "absolute", left: CONFIRM_X - 95, top: 16, width: 190, height: 64, borderRadius: 32, background: "linear-gradient(180deg, #ffc756, #ffb11f)", color: "#21170a", fontSize: 29, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center", scale: 1 - 0.08 * bump(t, cue.confirm, 0.22) }}>确认</div>
      <div style={{ position: "absolute", left: 456, top: 16, width: 160, height: 64, borderRadius: 32, background: "rgba(255,255,255,.06)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.08)", color: "#f5f0e6",
        fontSize: 29, display: "flex", alignItems: "center", justifyContent: "center" }}>取消</div>
    </div>
  );
};

// ── The subtitle file, as a reel of cues that finds its place ──────────────
const SPIN_FROM = cue.read + 0.15;
export const scroll = (t: number) => {
  if (t < cue.lock) {
    const u = Math.min(1, Math.max(0, (t - SPIN_FROM) / (cue.lock - SPIN_FROM)));
    return FIRST + 14 * Math.pow(1 - u, 3);
  }
  return FIRST - 0.06 * bump(t, cue.lock, 0.3);
};
const HEAD_ROW = 2; // the reel reads at its third row
export const ROW_EN_TOP = 12;
export const ROW_EN_SIZE = 25;
export const ROW_EN_LINE = 31;
export const ROW_ZH_TOP = 80;
export const ROW_ZH_SIZE = 36;
export const ROW_ZH_LINE = 48;
export const HEAD_TOP = HEAD_ROW * ROW_H;

const Track: React.FC<{ t: number }> = ({ t }) => {
  const opacity = lin(t, [cue.confirm + 0.15, cue.read + 0.1, cue.fold - 0.05, cue.fold + 0.15], [0, 1, 1, 0]);
  if (opacity <= 0) return null;
  const s = scroll(t);
  const locked = lin(t, [cue.lock - 0.04, cue.lock + 0.06], [0, 1]);
  const speed = t < cue.lock ? Math.abs(scroll(t + 1 / 120) - scroll(t - 1 / 120)) * 60 : 0;
  const base = Math.floor(s);
  const rows = [-3, -2, -1, 0, 1, 2, 3, 4].map((k) => base + k);
  const n = LINES.length;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: TRACK.w, height: TRACK.h, opacity, fontFamily: SANS,
      maskImage: "linear-gradient(180deg, transparent 0, #000 16%, #000 84%, transparent 100%)" }}>
      {/* The read head */}
      <div style={{ position: "absolute", left: 18, top: HEAD_TOP + 6, width: TRACK.w - 36, height: ROW_H - 12, borderRadius: 24,
        background: `rgba(242,199,143,${0.05 + 0.09 * locked + 0.3 * bump(t, cue.lock, 0.45)})`,
        boxShadow: `inset 0 0 0 2px rgba(242,199,143,${locked ? 0.55 : 0.25 + 0.2 * Math.sin(t * 14)})` }} />
      <div style={{ position: "absolute", inset: 0, filter: speed > 0.6 ? `blur(${Math.min(7, speed * 0.55)}px)` : undefined }}>
        {rows.map((i) => {
          const line = LINES[((i % n) + n) % n];
          const near = Math.max(0, 1 - Math.abs(i - s) * 1.7) * locked;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: HEAD_TOP + (i - s) * ROW_H, width: TRACK.w, height: ROW_H }}>
              <div style={{ position: "absolute", left: 52, top: 0, lineHeight: `${ROW_H}px`, fontFamily: MONO, fontSize: 26, fontWeight: 500, color: near > 0.5 ? C.gold : C.dim }}>{line.tc}</div>
              <div style={{ position: "absolute", left: TRACK_TEXT_X, top: ROW_EN_TOP, fontSize: ROW_EN_SIZE, lineHeight: `${ROW_EN_LINE}px`, fontWeight: 500, whiteSpace: "pre", color: near > 0.5 ? C.body : C.dim }}>{line.en}</div>
              <div style={{ position: "absolute", left: TRACK_TEXT_X, top: ROW_ZH_TOP, fontSize: ROW_ZH_SIZE, lineHeight: `${ROW_ZH_LINE}px`, fontWeight: 600, whiteSpace: "nowrap", width: TRACK.w - TRACK_TEXT_X - 24, overflow: "hidden", textOverflow: "ellipsis", color: near > 0.5 ? C.heading : C.label,
                opacity: ((i % n) + n) % n === FIRST ? 1 - lin(t, [cue.lock + 0.09, cue.lock + 0.11], [0, 1]) + lin(t, [cue.plate + 0.1, cue.plate + 0.5], [0, 1]) : 1 }}>{line.zh}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


