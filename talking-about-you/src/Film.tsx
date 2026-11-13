import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ease, mix, sp, tween } from "../../launch-15s/src/film/motion";
import { C, FONT_DISPLAY, FONT_TEXT, fontFor } from "../../launch-15s/src/film/theme";
import { SCENES } from "./scenes";
import { BOX, H, LINES, MARK, PLATE, T, W, camera, type Line } from "./timeline";

// Brand colours from docs/assets/mark.svg in the app repository.
const INK = "#f6f5fa";
const LAVENDER = "#b6a7df";
const LAV = "182,167,223";
const ZH = fontFor("zh-CN", FONT_TEXT);

const SUBTITLE: Record<string, React.CSSProperties> = {
  "ja-JP": { font: `700 72px "Yu Gothic UI", "Yu Gothic", sans-serif`, letterSpacing: 1 },
  "ko-KR": { font: `700 82px "Malgun Gothic", sans-serif` },
  "en-US": { font: `600 62px ${FONT_TEXT}` },
  "fr-FR": { font: `600 62px ${FONT_TEXT}`, color: "#ffe36e" },
  "de-DE": { font: `600 74px ${FONT_TEXT}` },
};

const PLATE_FONT = `500 76px ${ZH}`;
const TYPE_RATE = 3;

function hex(a: string, b: string, t: number): string {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], t))).join(",")})`;
}

interface Saying {
  small: string;
  big: string;
  start: number;
  end: number;
  size: number;
  y?: number;
  sign?: string;
  signAt?: number;
}

// Fable speaks in typed lines, one thought at a time.
const Says: React.FC<{ f: number; say: Saying }> = ({ f, say }) => {
  if (f < say.start || f >= say.end) return null;
  const chars = [...say.big];
  const shown = Math.min(chars.length, Math.floor((f - say.start) / TYPE_RATE) + 1);
  const caret = shown < chars.length || Math.floor((f - say.start) / 30) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.text1, whiteSpace: "pre", transform: `translateY(${(say.y ?? H / 2) - H / 2}px)` }}>
      {say.small ? <div style={{ font: `500 64px ${ZH}`, color: C.text2, marginBottom: say.big ? 36 : 0 }}>{say.small}</div> : null}
      {say.big ? (
        <div style={{ position: "relative", font: `700 ${say.size}px ${fontFor("zh-CN", FONT_DISPLAY)}`, letterSpacing: -say.size * 0.02, lineHeight: 1.15 }}>
          <span style={{ visibility: "hidden" }}>{say.big}</span>
          <span style={{ position: "absolute", left: 0, top: 0 }}>
            {chars.slice(0, shown).join("")}
            <span style={{ display: "inline-block", width: say.size * 0.1, height: say.size, marginLeft: say.size * 0.1, verticalAlign: `${-say.size * 0.14}px`, background: LAVENDER, opacity: caret ? 1 : 0 }} />
          </span>
        </div>
      ) : null}
      {say.sign ? (
        <div style={{ marginTop: 90, font: `600 76px ${FONT_DISPLAY}`, color: LAVENDER, letterSpacing: -1, opacity: tween(f, [say.signAt ?? 0, (say.signAt ?? 0) + 20], [0, 1], ease.outSoft) }}>{say.sign}</div>
      ) : null}
    </div>
  );
};

export const Grain: React.FC<{ f: number }> = ({ f }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${staticFile(`grain-${Math.floor(f / 2) % 6}.png`)})`,
      backgroundSize: "512px 512px",
      mixBlendMode: "overlay",
      opacity: 0.22,
    }}
  />
);

export const Subtitle: React.FC<{ line: Line; opacity: number }> = ({ line, opacity }) => (
  <div
    lang={line.lang}
    style={{
      position: "absolute",
      left: BOX.x,
      top: BOX.y,
      width: BOX.w,
      height: BOX.h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "pre",
      color: "#ffffff",
      WebkitTextStroke: "8px rgba(0,0,0,0.85)",
      paintOrder: "stroke fill",
      textShadow: "0 4px 16px rgba(0,0,0,0.55)",
      opacity,
      ...SUBTITLE[line.lang],
    }}
  >
    {line.source}
  </div>
);

const Cursor: React.FC<{ f: number }> = ({ f }) => {
  const { enter, press, release, exit } = T.drag;
  if (f < enter || f > exit) return null;
  const a = { x: BOX.x, y: BOX.y };
  const b = { x: BOX.x + BOX.w, y: BOX.y + BOX.h };
  const inT = tween(f, [enter, press - 4], [0, 1], ease.out);
  const dragT = tween(f, [press + 2, release - 4], [0, 1], ease.drag);
  const outT = tween(f, [release + 8, exit], [0, 1], ease.in);
  const x = mix(mix(mix(820, a.x, inT), b.x, dragT), 1180, outT);
  const y = mix(mix(mix(1560, a.y, inT), b.y, dragT), 1420, outT);
  const down = f >= press && f < release ? 0.9 : 1;
  return (
    <svg width={56} height={56} viewBox="0 0 28 28" style={{ position: "absolute", left: x - 6, top: y - 4, transform: `scale(${down})`, transformOrigin: "6px 4px" }}>
      <path d="M3 2v19l5-4.6 3.4 7.6 3.2-1.4-3.4-7.5H18z" fill="#ffffff" stroke="#000000" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
};

function morphAt(f: number): number {
  return tween(f, [T.end.morph, T.end.mark], [0, 1], ease.inOut);
}

// The capture box is dragged out once, stays for the whole session, and
// closes into the front card of the mark.
const Box: React.FC<{ f: number }> = ({ f }) => {
  const { press, release } = T.drag;
  if (f < press) return null;
  const drawn = tween(f, [press + 2, release - 4], [0, 1], ease.drag);
  const running = tween(f, [release, release + 16], [0, 1], ease.out);
  const morph = morphAt(f);
  const dim = 0.42 * (1 - running);
  const to = MARK.front;
  const rule = tween(f, [T.end.mark - 8, T.end.mark + 22], [0, 1], ease.out);
  const s = MARK.scale;
  return (
    <div
      style={{
        position: "absolute",
        left: mix(BOX.x, to.x, morph),
        top: mix(BOX.y, to.y, morph),
        width: mix(BOX.w * drawn, to.w, morph),
        height: mix(BOX.h * drawn, to.h, morph),
        boxSizing: "border-box",
        borderRadius: mix(10, 11 * s, morph),
        border: `${mix(mix(4, 2.5, running), 5 * s, morph)}px solid rgba(246,245,250,${mix(mix(0.95, 0.6, running), 1, morph)})`,
        background: morph > 0 ? `rgba(32,33,42,${morph})` : `rgba(246,245,250,${0.1 * (1 - running)})`,
        boxShadow: `0 0 0 ${dim > 0 ? 4000 : 0}px rgba(0,0,0,${dim})`,
        opacity: 1 - tween(f, [T.end.out, T.end.out + 14], [0, 1], ease.linear),
      }}
    >
      {/* The two subtitle rules of the mark, at 38.5/47.5 and 38.5/60.5 in its 128-unit space. */}
      {[{ y: 47.5, w: 38 }, { y: 60.5, w: 23 }].map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (38.5 - 22 - 2.5) * s - 2.5 * s,
            top: (line.y - 30 - 2.5) * s - 2.5 * s,
            width: (line.w + 5) * s * tween(rule, [i * 0.25, 0.75 + i * 0.25], [0, 1], ease.linear),
            height: 5 * s,
            borderRadius: 2.5 * s,
            background: INK,
            opacity: rule > 0 ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

// OCR reads the box left to right just before each translation lands.
const Scan: React.FC<{ f: number }> = ({ f }) => {
  const line = LINES.find((l) => f >= l.plate - 26 && f < l.plate);
  if (!line) return null;
  const p = tween(f, [line.plate - 26, line.plate - 2], [0, 1], ease.inOut);
  const a = Math.sin(p * Math.PI);
  return (
    <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, overflow: "hidden", borderRadius: 10 }}>
      <div style={{ position: "absolute", left: p * BOX.w - 220, top: 0, width: 220, height: BOX.h, background: `linear-gradient(90deg, rgba(${LAV},0), rgba(${LAV},${0.34 * a}))` }} />
      <div style={{ position: "absolute", left: p * BOX.w, top: 0, width: 3, height: BOX.h, background: `rgba(255,255,255,${a})` }} />
    </div>
  );
};

const PlateText: React.FC<{ line: Line; f: number; exit: number; slow: boolean }> = ({ line, f, exit, slow }) => {
  const stagger = slow ? 5 : 1.4;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "pre",
        font: PLATE_FONT,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 26}px)`,
      }}
    >
      {[...line.translation].map((ch, i) => {
        const start = line.plate + i * stagger;
        const rise = sp(f, start, { damping: 16, stiffness: slow ? 150 : 240 });
        return (
          <span key={i} style={{ display: "inline-block", opacity: tween(f, [start, start + (slow ? 10 : 5)], [0, 1], ease.linear), transform: `translateY(${(1 - rise) * 30}px)` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// The translation plate hangs under the box, then becomes the back card of the mark.
const Plate: React.FC<{ f: number }> = ({ f }) => {
  const first = LINES[0].plate;
  if (f < first) return null;
  const index = LINES.reduce((acc, line, i) => (f >= line.plate ? i : acc), 0);
  const current = LINES[index];
  const previous = index > 0 ? LINES[index - 1] : null;
  const emerge = sp(f, first, { damping: 15, stiffness: 160 });
  const morph = morphAt(f);
  const to = MARK.back;
  const clear = tween(f, [T.end.start, T.end.morph], [0, 1], ease.in);
  return (
    <div
      style={{
        position: "absolute",
        left: mix(PLATE.x, to.x, morph),
        top: mix(PLATE.y, to.y, morph),
        width: mix(PLATE.w, to.w, morph),
        height: mix(PLATE.h, to.h, morph),
        boxSizing: "border-box",
        borderRadius: mix(16, 11 * MARK.scale, morph),
        background: hex(C.plateDark, LAVENDER, morph),
        border: `1px solid rgba(255,255,255,${0.09 * (1 - morph)})`,
        color: "#ffffff",
        overflow: "hidden",
        clipPath: `inset(${(1 - emerge) * 100}% 0 0 0)`,
        transform: `translateY(${-(1 - emerge) * 40}px)`,
        opacity: 1 - tween(f, [T.end.out, T.end.out + 14], [0, 1], ease.linear),
      }}
    >
      {previous ? <PlateText line={previous} f={f} exit={tween(f, [current.plate - 2, current.plate + 5], [0, 1], ease.in)} slow={false} /> : null}
      <PlateText line={current} f={f} exit={clear} slow={index === LINES.length - 1} />
    </div>
  );
};

const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const { wordmark, line, out } = T.end;
  if (f < wordmark) return null;
  const word = sp(f, wordmark, { damping: 20, stiffness: 140 });
  const meta = tween(f, [line, line + 18], [0, 1], ease.outSoft);
  const leave = 1 - tween(f, [out, out + 14], [0, 1], ease.linear);
  return (
    <div style={{ opacity: leave }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: MARK.bottom + 70,
          textAlign: "center",
          whiteSpace: "pre",
          font: `600 96px ${fontFor("zh-CN", FONT_DISPLAY)}`,
          letterSpacing: -2,
          color: INK,
          opacity: Math.min(1, word * 1.4),
          transform: `translateY(${(1 - word) * 30}px)`,
        }}
      >
        Meowcal Sub · 妙影
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: MARK.bottom + 236, textAlign: "center", font: `500 48px ${ZH}`, letterSpacing: 2, color: C.text2, opacity: meta, transform: `translateY(${(1 - meta) * 16}px)` }}>
        免费开源 · Windows 11
      </div>
    </div>
  );
};

// Which film this is in the count. Shown on the first pass only.
const Slate: React.FC<{ f: number; index: number }> = ({ f, index }) => {
  const on = tween(f, [4, 16], [0, 1], ease.outSoft) * (1 - tween(f, [T.twist.dim, T.twist.dim + 12], [0, 1], ease.linear));
  if (on <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 150, width: W, display: "flex", justifyContent: "center", opacity: on }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, padding: "18px 40px 22px", borderRadius: 999, background: "rgba(7,9,15,0.72)", color: INK, font: `600 50px ${ZH}`, whiteSpace: "pre" }}>
        <span style={{ font: `700 54px ${FONT_DISPLAY}` }}>Fable 5.2</span>
        <span>拍的第</span>
        <span style={{ font: `700 74px ${FONT_DISPLAY}`, color: LAVENDER, minWidth: 44, textAlign: "center" }}>{index + 1}</span>
        <span>部</span>
      </div>
    </div>
  );
};

const GAP = 70;

export const Picture: React.FC<{ f: number }> = ({ f }) => {
  const cam = camera(f);
  const gone = tween(f, [T.end.start, T.end.start + 36], [0, 1], ease.inOut);
  // The films dim while Fable speaks over them and come back for the rewind.
  const dim = tween(f, [T.twist.dim, T.twist.dim + 20], [0, 1], ease.inOut) * (1 - tween(f, [T.rewind.start, T.rewind.start + 16], [0, 1], ease.inOut));
  const light = mix(1, 0.3, dim) * (1 - gone);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {light > 0
        ? SCENES.map((Scene, i) => {
            const x = (i - cam) * (W + GAP);
            if (Math.abs(x) >= W + GAP) return null;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: 0, width: W, height: H, overflow: "hidden", opacity: light }}>
                <Scene t={f} />
                <Grain f={f} />
                <Subtitle line={LINES[i]} opacity={1 - tween(f, [T.end.start, T.end.start + 12], [0, 1], ease.linear)} />
              </div>
            );
          })
        : null}
      <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: gone }} />
      <Slate f={f} index={Math.round(cam)} />
      {[...T.twist.says, ...T.outro].map((say, i) => (
        <Says key={i} f={f} say={say} />
      ))}
      <Plate f={f} />
      <Box f={f} />
      <Scan f={f} />
      <EndCard f={f} />
      <Cursor f={f} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Picture f={f} />
      <Audio src={staticFile("audio/score.wav")} />
    </>
  );
};

export const Silent: React.FC = () => <Picture f={useCurrentFrame()} />;
