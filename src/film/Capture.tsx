import React from "react";
import type { Layout, Rect } from "./layout";
import { ease, mix, sp, tween } from "./motion";
import { HERO, MONTAGE, whipLength, type Line } from "./scenes";
import { layoutUnits } from "./text";
import { sourceFont, sourceSizeFor } from "./Footage";
import { C } from "./theme";
import { T } from "./timeline";

const ICE = "232, 238, 247";

export function logoRect(L: Layout): Rect {
  const size = 200 * L.u;
  return { x: L.W / 2 - size / 2, y: L.H / 2 - size / 2, w: size, h: size };
}

// The box the viewer drags: grows under the cursor, holds for the whole film,
// then becomes the icon's rounded square.
export function boxAt(f: number, L: Layout): Rect | null {
  const { press, dragEnd } = T.hook;
  if (f < press) return null;
  const p = tween(f, [press + 2, dragEnd], [0, 1], ease.drag);
  const py = tween(f, [press + 2, dragEnd - 6], [0, 1], ease.drag);
  let rect = { x: L.box.x, y: L.box.y, w: L.box.w * p, h: L.box.h * py };

  if (f >= T.payoff.flat) {
    const target = logoRect(L);
    const w = sp(f, T.payoff.flat, { damping: 17, stiffness: 110 });
    const h = sp(f, T.payoff.flat + 5, { damping: 13, stiffness: 120 });
    const c = sp(f, T.payoff.flat, { damping: 20, stiffness: 120 });
    const cx = mix(rect.x + rect.w / 2, target.x + target.w / 2, c);
    const cy = mix(rect.y + rect.h / 2, target.y + target.h / 2, c);
    const nw = mix(rect.w, target.w, w);
    const nh = mix(rect.h, target.h, h);
    rect = { x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh };
  }
  return rect;
}

function cursorAt(f: number, L: Layout): { x: number; y: number; opacity: number } {
  const { cursorIn, cursorArrive, press, dragEnd } = T.hook;
  const start = { x: L.box.x, y: L.box.y };
  if (f < press) {
    const p = tween(f, [cursorIn, cursorArrive], [0, 1], ease.out);
    return {
      x: mix(L.W * 0.9, start.x, p),
      y: mix(L.H * 1.1, start.y, p) - Math.sin(p * Math.PI) * 90 * L.u,
      opacity: f < cursorIn ? 0 : 1,
    };
  }
  const box = boxAt(Math.min(f, dragEnd), L)!;
  const leave = tween(f, [dragEnd + 10, dragEnd + 30], [0, 1], ease.in);
  return {
    x: box.x + box.w + leave * 140 * L.u,
    y: box.y + box.h + leave * 90 * L.u,
    opacity: 1 - tween(f, [dragEnd + 14, dragEnd + 28], [0, 1]),
  };
}

interface ScanEvent {
  start: number;
  end: number;
  line: Line;
  lang: string;
}

export const SCANS: readonly ScanEvent[] = [
  { start: T.magic.scanStart, end: T.magic.scanEnd, line: HERO.lines[0], lang: HERO.source },
  { start: T.magic.line2 + 2, end: T.magic.line2ScanEnd, line: HERO.lines[1], lang: HERO.source },
  // A montage cut hides the processing time: the line is read as it lands.
  ...T.montage.cuts.map((cut, i) => ({
    start: cut + whipLength(cut) - 4,
    end: cut + whipLength(cut) + 1,
    line: MONTAGE[i].lines[0],
    lang: MONTAGE[i].source,
  })),
];

export function glyphRects(line: Line, lang: string, L: Layout): { rects: Rect[]; left: number; right: number } {
  const size = sourceSizeFor(line, lang, L);
  const { units, width } = layoutUnits(line.source, lang, sourceFont(lang, size));
  const left = L.W / 2 - width / 2;
  const cy = L.box.y + L.box.h / 2;
  const pad = 5 * L.u;
  const rects = units
    .filter((unit) => !unit.blank)
    .map((unit) => ({ x: left + unit.x - pad, y: cy - size * 0.62, w: unit.w + 2 * pad, h: size * 1.24 }));
  return { rects, left, right: left + width };
}

const Scan: React.FC<{ f: number; L: Layout; box: Rect }> = ({ f, L, box }) => {
  const scan = SCANS.find((s) => f >= s.start && f < s.end + 26);
  if (!scan) return null;
  const { rects, left, right } = glyphRects(scan.line, scan.lang, L);
  const p = tween(f, [scan.start, scan.end], [0, 1], ease.linear);
  const beamX = mix(left - 30 * L.u, right + 30 * L.u, p);
  const beamOpacity = f < scan.end ? 1 : 1 - tween(f, [scan.end, scan.end + 4], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: beamX - box.x - 150 * L.u,
            top: 0,
            width: 150 * L.u,
            height: box.h,
            opacity: beamOpacity * 0.5,
            background: `linear-gradient(90deg, rgba(${ICE},0), rgba(${ICE},0.28))`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: beamX - box.x - 1.5 * L.u,
            top: 0,
            width: 3 * L.u,
            height: box.h,
            opacity: beamOpacity,
            background: "#ffffff",
            boxShadow: `0 0 ${16 * L.u}px ${4 * L.u}px rgba(190, 215, 255, 0.85)`,
          }}
        />
      </div>
      {rects.map((r, i) => {
        const hit = scan.start + ((r.x + r.w / 2 - (left - 30 * L.u)) / (right - left + 60 * L.u)) * (scan.end - scan.start);
        const t = f - hit;
        const opacity = t < 0 ? 0 : t < 2 ? t / 2 : 1 - tween(t, [8, 22], [0, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              opacity,
              border: `${1.6 * L.u}px solid rgba(170, 205, 255, 0.95)`,
              borderRadius: 4 * L.u,
              background: "rgba(170, 205, 255, 0.10)",
              transform: `scale(${1 + 0.12 * Math.max(0, 1 - t / 5)})`,
            }}
          />
        );
      })}
    </>
  );
};

const HANDLES: ReadonlyArray<[number, number]> = [
  [0, 0], [0.5, 0], [1, 0], [0, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1],
];

const Crosshair: React.FC<{ size: number; u: number }> = ({ size, u }) => (
  <svg width={size} height={size} viewBox="-24 -24 48 48" style={{ overflow: "visible" }}>
    <g strokeLinecap="round">
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <line x1="5" y1="0" x2="19" y2="0" stroke="rgba(0,0,0,0.75)" strokeWidth={5.5} />
          <line x1="5" y1="0" x2="19" y2="0" stroke="#ffffff" strokeWidth={2.4} />
        </g>
      ))}
      <circle r="1.6" fill="#ffffff" stroke="rgba(0,0,0,0.75)" strokeWidth={1.2 / u} />
    </g>
  </svg>
);

// Selection dim, the box itself, the OCR scan, and the cursor (world space).
export const Capture: React.FC<{ f: number; L: Layout; opacity: number }> = ({ f, L, opacity }) => {
  const { u } = L;
  const box = boxAt(f, L);
  const dim =
    tween(f, [T.hook.dimIn, T.hook.dimIn + 12], [0, 0.55]) *
    (1 - tween(f, [T.magic.selectorOut, T.magic.drop + 10], [0, 1]));
  const running = tween(f, [T.magic.selectorOut, T.magic.drop + 12], [0, 1], ease.outSoft);
  const morph = tween(f, [T.payoff.flat, T.brand.hit - 4], [0, 1], ease.inOut);
  // The frame stays ice-bright while it shrinks and only darkens into the
  // icon's rim as the icon's fill arrives.
  const rim = tween(f, [T.brand.hit - 12, T.brand.hit], [0, 1], ease.inOut);
  const fill = tween(f, [T.brand.hit - 16, T.brand.hit], [0, 1], ease.inOut);
  const cursor = cursorAt(f, L);
  const press = T.hook.press;
  const squash = 1 - 0.2 * Math.sin(tween(f, [press - 1, press + 9], [0, 1], ease.linear) * Math.PI);
  // Brackets spring outward on release and settle, like the box locking in.
  const kickT = f - T.hook.release;
  const kick = kickT > 0 ? Math.exp(-kickT / 7) * Math.sin(kickT * 0.5) * 1.4 : 0;
  const logoRadius = (22 / 96) * 200 * u;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {dim > 0.001 ? (
        box && box.w > 1 ? (
          <div
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
              boxShadow: `0 0 0 ${4 * L.W}px rgba(0,0,0,${dim})`,
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: -2 * L.W, background: `rgba(0,0,0,${dim})` }} />
        )
      ) : null}

      {box && box.w > 1 ? (
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            boxSizing: "border-box",
            borderRadius: mix(12 * u * running, logoRadius, morph),
            border: `${mix(mix(1.5, 3, running) * u, 4 * u, morph)}px solid ${
              morph > 0 ? mixColor(`rgba(${ICE},${mix(0.6, 0.95, morph)})`, C.logoStroke, rim) : `rgba(${ICE},${mix(0.75, 0.6, running)})`
            }`,
            background:
              fill > 0
                ? `radial-gradient(circle at 50% 18%, rgba(27,35,48,${fill}) 0%, rgba(10,13,19,${fill}) 80%)`
                : undefined,
            boxShadow: `inset 0 0 0 ${u}px rgba(0,0,0,${0.35 * running * (1 - morph)}), 0 0 ${48 * u}px rgba(190,210,255,${0.35 * morph * (1 - rim)})`,
          }}
        >
          {[
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ].map(([cx, cy]) => (
            <span
              key={`${cx}${cy}`}
              style={{
                position: "absolute",
                left: cx ? undefined : -3 * u,
                right: cx ? -3 * u : undefined,
                top: cy ? undefined : -3 * u,
                bottom: cy ? -3 * u : undefined,
                width: 22 * u,
                height: 22 * u,
                opacity: 1 - running,
                borderColor: C.accent,
                borderStyle: "solid",
                borderWidth: 0,
                [cy ? "borderBottomWidth" : "borderTopWidth"]: 3.5 * u,
                [cx ? "borderRightWidth" : "borderLeftWidth"]: 3.5 * u,
                transform: `translate(${(cx ? 1 : -1) * kick * 12 * u}px, ${(cy ? 1 : -1) * kick * 12 * u}px)`,
              }}
            />
          ))}
          {HANDLES.map(([hx, hy], i) => {
            const pop = sp(f, T.hook.release + 1 + i * 1.2, { damping: 10, stiffness: 300 });
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${hx * 100}%`,
                  top: `${hy * 100}%`,
                  width: 12 * u,
                  height: 12 * u,
                  marginLeft: -6 * u,
                  marginTop: -6 * u,
                  borderRadius: 2.5 * u,
                  background: C.accent,
                  boxShadow: `0 0 0 ${1.5 * u}px rgba(0,0,0,0.55)`,
                  transform: `scale(${pop})`,
                  opacity: 1 - running,
                }}
              />
            );
          })}
        </div>
      ) : null}

      {box && f < T.payoff.start ? <Scan f={f} L={L} box={box} /> : null}

      {cursor.opacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: cursor.x - 24 * u,
            top: cursor.y - 24 * u,
            opacity: cursor.opacity,
            transform: `scale(${squash})`,
          }}
        >
          <Crosshair size={48 * u} u={u} />
        </div>
      ) : null}
    </div>
  );
};

function parseColor(value: string): number[] {
  const rgba = value.match(/rgba?\(([^)]+)\)/);
  if (rgba) {
    const [r, g, b, a = "1"] = rgba[1].split(",").map((s) => s.trim());
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  const hex = value.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(1);
}

export function mixColor(a: string, b: string, t: number): string {
  const x = parseColor(a);
  const y = parseColor(b);
  const [r, g, bl, al] = x.map((v, i) => mix(v, y[i], t));
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)}, ${al.toFixed(3)})`;
}
