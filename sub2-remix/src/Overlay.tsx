import React from "react";
import { bump, cue, FIRST, footageTime, glide, lin, LINES, mix, plateAt, playing, pop, reveal, sfx, W } from "./clock";
import { captureBox, EN, enLines, HEAD_Y, PLATE, PLATE_TEXT_Y, ROW_H, SCRUB, START, toolbar, TRACK, TRACK_TEXT_X, PAL, LIST_Y } from "./layout";
import { HELD, scrubShow, SEEKED } from "./Picture";
import { CONFIRM_X, HEAD_TOP, ROW_EN_LINE, ROW_EN_SIZE, ROW_EN_TOP, ROW_ZH_LINE, ROW_ZH_SIZE, ROW_ZH_TOP } from "./Rig";
import { C, GOLD_TEXT, measure, MONO, SANS } from "./theme";

const shadow = "0 4px 30px rgba(0,0,0,.75), 0 0 4px rgba(0,0,0,.6)";

// ── Headlines: one line at a time ──────────────────────────────────────────
type Head = { text: string; from: number; to: number; size: number; gold?: boolean; goldAt?: number };
const HEADS: Head[] = [
  { text: "字幕组翻好的，自动找来。", from: cue.palette, to: cue.circle, size: 76 },
  { text: "圈住画面里的字幕。", from: cue.circle, to: cue.read, size: 92 },
  { text: "认出这一句——", from: cue.read, to: cue.lock, size: 100 },
  { text: "时间轴，自动对上。", from: cue.lock, to: cue.swap - 0.2, size: 104, gold: true },
  { text: "第二份字幕，自动换上。", from: cue.swap, to: cue.swap + 2.3, size: 76, gold: true },
  { text: "暂停、倒回，它都跟着。", from: cue.pause + 0.48, to: cue.proof - 0.1, size: 80 },
  { text: "每一句，都对得上。", from: cue.proof, to: cue.brand, size: 96, goldAt: cue.proofHit },
];

export const Headlines: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Hook t={t} />
    <Value t={t} />
    {HEADS.map((head) => {
      const enter = reveal(t, head.from - 0.08, head.from + 0.3);
      const leave = lin(t, [head.to - 0.14, head.to + 0.1], [0, 1]);
      if (enter <= 0 || leave >= 1) return null;
      const hit = head.gold ? bump(t, head.from, 0.55) : head.goldAt ? bump(t, head.goldAt, 0.55) : 0;
      const turn = head.goldAt ? lin(t, [head.goldAt - 0.02, head.goldAt + 0.18], [0, 1]) : 0;
      return (
        <div key={head.text} style={{ position: "absolute", left: 0, width: W, top: HEAD_Y - head.size, height: head.size * 2, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SANS, fontSize: head.size, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: -1, opacity: enter * (1 - leave),
          filter: `blur(${(1 - enter) * 16 + leave * 14}px)`, scale: 0.94 + 0.06 * enter + 0.07 * hit, textShadow: head.gold || turn > 0 ? undefined : shadow }}>
          <span style={head.gold || turn >= 1 ? { background: GOLD_TEXT, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 4px 24px rgba(0,0,0,.7))" } : { color: `rgb(${mix(245, 242, turn)}, ${mix(242, 199, turn)}, ${mix(235, 143, turn)})` }}>
            {head.text.replace(/。$/, "")}
            {head.text.endsWith("。") && <span style={{ marginRight: "-0.58em" }}>。</span>}
          </span>
        </div>
      );
    })}
  </>
);

/** The pain, the hope, and the turn to the app: 「想看的片，只有外语字幕？」 is
 * on screen from the first frame (over the scream and the whole cold open),
 * then 「可字幕组大神，早就翻好了。」 under it on the beat, then both give way to
 * 「所以，我们做了个神仙 App」 while the empty slot appears under the picture. */
const goldSpan: React.CSSProperties = { background: GOLD_TEXT, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 4px 24px rgba(0,0,0,.7))" };
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const size = 72;
  const line = (key: string, top: number, from: number, to: number, child: React.ReactNode, hitAt?: number) => {
    const enter = from <= 0 ? 1 : reveal(t, from - 0.08, from + 0.35);
    const leave = lin(t, [to - 0.14, to + 0.1], [0, 1]);
    if (enter <= 0 || leave >= 1) return null;
    const hit = hitAt === undefined ? 0 : bump(t, hitAt, 0.55);
    return (
      <div key={key} style={{ position: "absolute", left: 0, width: W, top: top - size, height: size * 2, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SANS, fontSize: size, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: -1, color: C.heading, textShadow: shadow,
        opacity: enter * (1 - leave), filter: `blur(${(1 - enter) * 16 + leave * 14}px)`, scale: 0.94 + 0.06 * enter + 0.07 * hit }}>
        {child}
      </div>
    );
  };
  const stop = <span style={{ marginRight: "-0.58em" }}>。</span>;
  return (
    <>
      {line("pain", HEAD_Y - 62, cue.hook, cue.bridge, <span>想看的片，只有外语字幕？</span>, cue.cuts.rider)}
      {line("hope", HEAD_Y + 62, cue.fansub, cue.bridge,
        <span>可<span style={{ ...goldSpan, filter: undefined, textShadow: "none" }}>字幕组大神</span>，早就翻好了{stop}</span>, cue.fansub)}
      {line("turn", HEAD_Y, cue.bridge, cue.giveUp,
        <span>所以，我们做了个<span style={{ ...goldSpan, filter: undefined, textShadow: "none" }}>神仙 App</span></span>, cue.bridge)}
    </>
  );
};

/** 「自动」 stays; the verb after it rolls 找 → 对 → 换 like a reel, one per beat. */
const VERBS = ["找", "对", "换"];
const VERB_AT = [cue.value, cue.value2, cue.value3];
const backOut = (u: number) => {
  const c = 1.9;
  const v = Math.min(1, Math.max(0, u)) - 1;
  return 1 + (c + 1) * v * v * v + c * v * v;
};
const Value: React.FC<{ t: number }> = ({ t }) => {
  const enter = reveal(t, cue.value - 0.08, cue.value + 0.3);
  const leave = lin(t, [cue.palette - 0.2, cue.palette + 0.05], [0, 1]);
  if (enter <= 0 || leave >= 1) return null;
  const size = 128;
  const cell = size * 1.3;
  // Reel position: 0 is a blank above 找, 1 is 找, 2 is 对, 3 is 换.
  const roll = VERB_AT.reduce((pos, at) => pos + backOut((t - at + 0.04) / 0.34), 0);
  const speed = VERB_AT.reduce((v, at) => v + bump(t, at - 0.02, 0.26), 0);
  const hit = VERB_AT.reduce((v, at) => v + bump(t, at, 0.45), 0);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: HEAD_Y - cell / 2, height: cell, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: SANS, fontSize: size, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: -1, lineHeight: `${cell}px`,
      opacity: enter * (1 - leave), filter: `blur(${(1 - enter) * 16 + leave * 14}px) drop-shadow(0 4px 24px rgba(0,0,0,.7))`, scale: 0.92 + 0.08 * enter + 0.05 * hit }}>
      <span style={{ ...goldSpan, filter: undefined }}>自动</span>
      <span style={{ position: "relative", display: "inline-block", width: size, height: cell, overflow: "hidden",
        maskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)" }}>
        <span style={{ position: "absolute", left: 0, top: (1 - roll) * cell - cell, width: size, display: "flex", flexDirection: "column", filter: speed > 0.05 ? `blur(${speed * 5}px)` : undefined }}>
          <span style={{ height: cell }} />
          {VERBS.map((verb) => <span key={verb} style={{ ...goldSpan, filter: undefined, height: cell, textAlign: "center" }}>{verb}</span>)}
        </span>
      </span>
    </div>
  );
};

// ── Meowcal's subtitle plate (overlay.css, scaled) ─────────────────────────
export const Plate: React.FC<{ t: number }> = ({ t }) => {
  const now = plateAt(t);
  if (!now) return null;
  const { index, from, first } = now;
  const local = t - from;
  const leave = lin(t, [cue.brand - 0.1, cue.brand + 0.1], [1, 0]);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: PLATE.top, display: "flex", justifyContent: "center", opacity: leave }}>
      <div style={{ position: "relative", padding: `${PLATE.padTop}px ${PLATE.padX}px ${PLATE.padBottom}px`, borderRadius: PLATE.radius, background: "rgba(0,0,0,.75)",
        scale: first ? 0.86 + 0.14 * pop(t, from, 0.4) : 0.97 + 0.03 * pop(t, from, 0.3), opacity: lin(local, [0, 0.07], [first ? 0.4 : 0.55, 1]) }}>
        <span style={{ display: "block", fontFamily: SANS, fontSize: PLATE.size, fontWeight: PLATE.weight, lineHeight: 1.28, color: "#fff", whiteSpace: "nowrap", textShadow: "0 3px 16px rgba(0,0,0,.7)" }}>{LINES[index].zh}</span>
      </div>
    </div>
  );
};

// ── Capture box (selector.css, scaled), the read, and the two hand-offs ────
export const Capture: React.FC<{ t: number }> = ({ t }) => {
  if (t < sfx.dragPress || t > cue.lock + 0.2) return null;
  const box = captureBox();
  const drag = glide(t, [sfx.dragPress, cue.release - 0.05], [0, 1]);
  const veil = lin(t, [sfx.dragPress, sfx.dragPress + 0.2, cue.confirm, cue.confirm + 0.35], [0, 0.5, 0.5, 0]);
  const fade = lin(t, [cue.read + 1, cue.read + 1.35], [1, 0]);
  const scan = lin(t, [cue.read + 0.1, cue.read + 0.95], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", left: box.x, top: box.y, width: Math.max(8, box.w * drag), height: Math.max(8, box.h * drag), borderRadius: Math.min(box.r, (box.h * drag) / 2 + 4),
        border: `4px solid ${C.select}`, boxSizing: "border-box", opacity: fade,
        background: "linear-gradient(180deg, rgba(255,183,67,.12), rgba(255,183,67,.04))",
        boxShadow: `0 0 0 9999px rgba(0,0,0,${veil}), 0 0 ${50 + 60 * bump(t, cue.confirm, 0.4)}px rgba(255,183,67,${0.26 + 0.4 * bump(t, cue.confirm, 0.4)})` }} />
      {/* The line is read: gold follows a light across it. */}
      {scan > 0 && scan < 1 && (
        <div style={{ position: "absolute", left: box.x + box.w * scan - 5, top: box.y + 8, width: 10, height: box.h - 16, borderRadius: 5, background: "#fff3d6",
          boxShadow: "0 0 40px 14px rgba(255,200,110,.55)", opacity: lin(scan, [0, 0.08, 0.92, 1], [0, 1, 1, 0]) }} />
      )}
    </>
  );
};

/** The recognised line leaves the picture for its row in the file; the row's
 * translation leaves the file for the plate. */
export const Flights: React.FC<{ t: number }> = ({ t }) => {
  if (t < cue.read || t > cue.plate + 0.05) return null;
  const box = captureBox();
  const line = LINES[FIRST];
  const rows = enLines(line.en);
  const blockH = rows.length * EN.lineH;
  const scan = lin(t, [cue.read + 0.1, cue.read + 0.95], [0, 1]);
  const up = glide(t, [cue.read + 1, cue.lock], [0, 1]);
  const rowWidth = Math.max(...rows.map((text) => measure(text, ROW_EN_SIZE, 500)));
  const enTo = { x: TRACK.x + TRACK_TEXT_X + rowWidth / 2, y: TRACK.y + HEAD_TOP + ROW_EN_TOP + (rows.length * ROW_EN_LINE) / 2 };
  const zhWidth = measure(line.zh, ROW_ZH_SIZE, 600);
  const zhFrom = { x: TRACK.x + TRACK_TEXT_X + zhWidth / 2, y: TRACK.y + HEAD_TOP + ROW_ZH_TOP + ROW_ZH_LINE / 2 };
  const down = glide(t, [cue.lock + 0.1, cue.plate], [0, 1]);
  const settle = 0.06 * ROW_H * bump(t, cue.lock, 0.3); // the reel's small bounce as it locks (see scroll)
  const textWidth = box.w - 92;
  return (
    <>
      {t < cue.lock + 0.12 && (
        <div style={{ position: "absolute", left: mix(540, enTo.x, up) - 600, top: mix(EN.bottom - blockH / 2, enTo.y + settle, up) - blockH / 2, width: 1200, height: blockH,
          scale: mix(1, ROW_EN_SIZE / EN.size, up), opacity: lin(t, [cue.lock, cue.lock + 0.12], [1, 0]) }}>
          {rows.map((text, row) => (
            <div key={row} style={{ position: "absolute", left: 0, width: 1200, top: row * EN.lineH, height: EN.lineH, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: SANS, fontSize: EN.size, fontWeight: EN.weight, whiteSpace: "nowrap", color: C.gold, textShadow: "0 0 26px rgba(242,199,143,.6)",
                clipPath: `inset(-20px ${(1 - scan) * textWidth}px -20px -20px)` }}>{text}</span>
            </div>
          ))}
        </div>
      )}
      {t >= cue.lock + 0.1 && t < cue.plate && (
        <div style={{ position: "absolute", left: mix(zhFrom.x, 540, down) - 500, top: mix(zhFrom.y + settle, PLATE_TEXT_Y, down) - 40, width: 1000, height: 80, display: "flex", alignItems: "center", justifyContent: "center",
          scale: mix(1, PLATE.size / ROW_ZH_SIZE, down) }}>
          <span style={{ fontFamily: SANS, fontSize: ROW_ZH_SIZE, lineHeight: `${ROW_ZH_LINE}px`, fontWeight: 600, whiteSpace: "nowrap", color: `rgb(${mix(242, 255, down)}, ${mix(199, 255, down)}, ${mix(143, 255, down)})`,
            textShadow: "0 0 26px rgba(242,199,143,.55)" }}>{line.zh}</span>
        </div>
      )}
    </>
  );
};

// ── The player's transport, for the pause and the drag back ────────────────
const knob = (f: number) => SCRUB.bar0 + (SCRUB.bar1 - SCRUB.bar0) * Math.min(1, Math.max(0, (f - 120) / 30));
export const Scrubber: React.FC<{ t: number }> = ({ t }) => {
  const opacity = scrubShow(t);
  if (opacity <= 0) return null;
  const f = footageTime(t);
  const x = knob(f);
  const seconds = Math.floor(f);
  const held = t >= sfx.grab && t < sfx.drop;
  const press = bump(t, cue.pause, 0.25) + bump(t, cue.play, 0.25);
  return (
    <div style={{ position: "absolute", left: SCRUB.x, top: SCRUB.y, width: SCRUB.w, height: SCRUB.h, borderRadius: SCRUB.h / 2, background: "rgba(10,10,14,.72)", backdropFilter: "blur(20px)",
      boxShadow: `0 0 0 2px ${C.glassLine}`, opacity, scale: 0.96 + 0.04 * reveal(t, cue.pause - 0.75, cue.pause - 0.45) }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" style={{ position: "absolute", left: SCRUB.button - SCRUB.x - 20, top: 16, scale: 1 - 0.2 * press }}>
        {playing(t) ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
      </svg>
      <div style={{ position: "absolute", left: SCRUB.bar0 - SCRUB.x, top: 33, width: SCRUB.bar1 - SCRUB.bar0, height: 6, borderRadius: 3, background: "rgba(255,255,255,.22)" }} />
      <div style={{ position: "absolute", left: SCRUB.bar0 - SCRUB.x, top: 33, width: x - SCRUB.bar0, height: 6, borderRadius: 3, background: "#fff" }} />
      <div style={{ position: "absolute", left: x - SCRUB.x - 13, top: 23, width: 26, height: 26, borderRadius: 13, background: "#fff", scale: held ? 1.35 : 1, boxShadow: "0 2px 10px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", right: 34, top: 0, lineHeight: `${SCRUB.h}px`, fontFamily: MONO, fontSize: 27, fontWeight: 500, color: "#e8e6e1", fontVariantNumeric: "tabular-nums" }}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </div>
    </div>
  );
};

// ── Cursor: every stop is computed from the control it operates ────────────
type Stop = [number, number, number];
const path = (t: number, stops: Stop[]) => ({
  x: glide(t, stops.map((s) => s[0]), stops.map((s) => s[1])),
  y: glide(t, stops.map((s) => s[0]), stops.map((s) => s[2])),
});
export const Cursor: React.FC<{ t: number }> = ({ t }) => {
  const box = captureBox();
  const bar = toolbar();
  const rowX = PAL.x + 470;
  const setup: Stop[] = [
    [cue.chips[0], 800, 1500],
    [cue.pickTitle - 0.12, rowX, PAL.y + LIST_Y + 107],
    [cue.pickTitle + 0.1, rowX, PAL.y + LIST_Y + 107],
    [cue.pickSource - 0.08, rowX - 30, PAL.y + LIST_Y + 70],
    [cue.pickTarget + 0.1, rowX - 10, PAL.y + LIST_Y + 74],
    [cue.start - 0.15, START.x + 300, START.y + 56],
    [cue.start + 0.12, START.x + 300, START.y + 56],
    [sfx.dragPress - 0.03, box.x, box.y],
    [sfx.dragPress, box.x, box.y],
    [cue.release - 0.05, box.x + box.w, box.y + box.h],
    [cue.release + 0.1, box.x + box.w, box.y + box.h],
    [cue.confirm - 0.1, bar.x + CONFIRM_X, bar.y + 52],
    [cue.confirm + 0.15, bar.x + CONFIRM_X, bar.y + 52],
    [cue.confirm + 0.5, bar.x + CONFIRM_X + 120, bar.y + 190],
  ];
  const watch: Stop[] = [
    [cue.pause - 0.8, 820, 1560],
    [cue.pause - 0.15, SCRUB.button, SCRUB.cy + 4],
    [cue.pause + 0.2, SCRUB.button, SCRUB.cy + 4],
    [sfx.grab - 0.08, knob(HELD), SCRUB.cy + 2],
    [sfx.grab, knob(HELD), SCRUB.cy + 2],
    [sfx.drop, knob(SEEKED), SCRUB.cy + 2],
    [sfx.drop + 0.08, knob(SEEKED), SCRUB.cy + 2],
    [cue.play - 0.2, SCRUB.button, SCRUB.cy + 4],
    [cue.play + 0.2, SCRUB.button, SCRUB.cy + 4],
    [cue.play + 0.8, 320, 1520],
  ];
  const second = t > cue.lock;
  const stops = second ? watch : setup;
  const start = stops[0][0];
  const end = stops[stops.length - 1][0];
  const opacity = lin(t, [start, start + 0.2, end - 0.25, end], [0, 1, 1, 0]);
  if (opacity <= 0) return null;
  const { x, y } = path(t, stops);
  const clicks = [cue.pickTitle, cue.pickSource, cue.pickTarget, cue.start, sfx.dragPress, cue.confirm, cue.pause, sfx.grab, cue.play];
  const press = clicks.reduce((sum, time) => sum + bump(t, time, 0.24), 0);
  const size = 58;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 34 44" style={{ position: "absolute", left: x - (2 * size) / 34, top: y - (2 * size) / 34, opacity, scale: 1 - 0.16 * press,
      transformOrigin: "0 0", filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
      <path d="M2 2L29 27H17L11 40Z" fill="#fff" stroke="#10131b" strokeWidth="2" />
    </svg>
  );
};

// ── Where to get it: Windows, from GitHub Releases or the Microsoft Store. ──
const CHANNELS = [
  {
    name: "Windows",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="9.5" height="9.5" /><rect x="12.5" y="2" width="9.5" height="9.5" />
        <rect x="2" y="12.5" width="9.5" height="9.5" /><rect x="12.5" y="12.5" width="9.5" height="9.5" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg width="38" height="38" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    ),
  },
  {
    name: "Microsoft Store",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M8 8V6.5a4 4 0 0 1 8 0V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="3" y="8" width="18" height="13.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        {[[8.3, 11.3], [12.3, 11.3], [8.3, 15.3], [12.3, 15.3]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="3.4" height="3.4" fill="currentColor" />)}
      </svg>
    ),
  },
];

// ── Name and line under the mark ───────────────────────────────────────────
/** A gold 2 that, given a time, jumps out of its place with a bounce. */
const Two: React.FC<{ t?: number; at?: number }> = ({ t, at }) => {
  if (t === undefined || at === undefined) return <span style={{ color: "#ebc58b" }}>2</span>;
  const u = (t - at) / 0.42;
  const k = u <= 0 ? 0 : u >= 1 ? 1 : 1 + 3.2 * Math.pow(u - 1, 3) + 2.2 * Math.pow(u - 1, 2);
  const glow = bump(t, at + 0.05, 0.5);
  return (
    <span style={{ display: "inline-block", color: "#ebc58b", opacity: Math.min(1, k * 3), scale: Math.max(0, k), translate: `0 ${(1 - Math.min(1, k)) * 0.5}em`, transformOrigin: "50% 80%",
      textShadow: glow > 0 ? `0 0 ${30 * glow}px rgba(255,214,150,${0.9 * glow}), 0 4px 30px rgba(0,0,0,.75)` : undefined }}>2</span>
  );
};

/** Letters that tumble out one after another from the left: each starts tipped
 * back on its lower-right corner, a little to the left, and falls forward into
 * place with a small overshoot. */
const Tumble: React.FC<{ text: string; t?: number; at?: number; step?: number }> = ({ text, t, at, step = 0.032 }) => {
  if (t === undefined || at === undefined) return <>{text}</>;
  return (
    <>
      {Array.from(text).map((ch, i) => {
        const u = Math.min(1, Math.max(0, (t - at - i * step) / 0.36));
        const k = u >= 1 ? 1 : 1 + 2.6 * Math.pow(u - 1, 3) + 1.6 * Math.pow(u - 1, 2);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transformOrigin: "100% 92%", rotate: `${(1 - k) * -88}deg`, translate: `${(1 - k) * -0.45}em 0`,
            opacity: Math.min(1, u * 2.5), filter: u < 1 ? `blur(${(1 - u) * 4}px)` : undefined }}>{ch}</span>
        );
      })}
    </>
  );
};

type NameTiming = { en: number; two: number; zh: number; two2: number };
const Name: React.FC<{ size: number; t?: number; time?: NameTiming }> = ({ size, t, time }) => (
  <span style={{ fontFamily: SANS, fontSize: size, fontWeight: 600, letterSpacing: -size * 0.028, marginRight: size * 0.028 + 3, color: "#f2f0ec", whiteSpace: "nowrap" }}>
    <Tumble text="Meowcal Sub " t={t} at={time?.en} />
    <Two t={t} at={time?.two} />
    <span style={{ display: "inline-block", color: "#8d8a84", margin: `0 ${size * 0.22}px`, opacity: time && t !== undefined ? lin(t, [time.zh - 0.06, time.zh + 0.04], [0, 1]) : 1 }}>·</span>
    <Tumble text="妙影" t={t} at={time?.zh} step={0.06} />
    <Two t={t} at={time?.two2} />
  </span>
);
// Each 2 lands on the eighth note its tom plays on (audio/accents.json).
const FIRST_NAME: NameTiming = { en: cue.name - 0.04, two: cue.name + 0.48, zh: cue.name + 0.5, two2: cue.name + 0.72 };

export const Lockups: React.FC<{ t: number }> = ({ t }) => {
  // The letters bring themselves in; the row only fades out.
  const early = (t >= cue.name - 0.05 ? 1 : 0) * lin(t, [cue.palette - 0.25, cue.palette - 0.02], [1, 0]);
  const name = reveal(t, cue.ears - 0.02, cue.ears + 0.45);
  const line = reveal(t, cue.tagline - 0.05, cue.tagline + 0.45);
  const where = reveal(t, cue.where - 0.05, cue.where + 0.5);
  const row = (top: number, opacity: number, hit: number, child: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, width: W, top, height: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity, filter: opacity < 1 ? `blur(${(1 - opacity) * 14}px)` : undefined,
      scale: 0.95 + 0.05 * opacity + 0.04 * hit, textShadow: shadow }}>{child}</div>
  );
  return (
    <>
      {early > 0 && row(986, early, bump(t, cue.name, 0.4), <Name size={76} t={t} time={FIRST_NAME} />)}
      {name > 0 && row(1004, name, bump(t, cue.ears, 0.5), <Name size={80} />)}
      {line > 0 && row(1128, line, bump(t, cue.tagline, 0.5),
        <span style={{ fontFamily: SANS, fontSize: 70, fontWeight: 800, whiteSpace: "nowrap", background: GOLD_TEXT, WebkitBackgroundClip: "text", color: "transparent", textShadow: "none" }}>
          好字幕，自动上屏<span style={{ marginRight: "-0.58em" }}>。</span>
        </span>)}
      {where > 0 && (
        <>
          <div style={{ position: "absolute", left: 0, width: W, top: 1240, height: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SANS, fontSize: 34, fontWeight: 500, letterSpacing: 6, marginLeft: 3, color: "#ebc58b", whiteSpace: "nowrap", opacity: where, translate: `0 ${(1 - where) * 14}px` }}>
            现已登陆
          </div>
          <div style={{ position: "absolute", left: 0, width: W, top: 1318, height: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 28,
            fontFamily: SANS, fontSize: 34, fontWeight: 500, color: "#c9c5bd", whiteSpace: "nowrap" }}>
            {CHANNELS.map(({ name, icon }, i) => {
              const at = cue.where + 0.1 + i * 0.12;
              const p = reveal(t, at, at + 0.35);
              return (
                <React.Fragment key={name}>
                  {i > 0 && <span style={{ width: 2, height: 32, background: "#3a3833", opacity: p }} />}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, opacity: p, translate: `0 ${(1 - p) * 18}px`, scale: 1 + 0.08 * bump(t, at, 0.4) }}>
                    {icon}
                    {name}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
