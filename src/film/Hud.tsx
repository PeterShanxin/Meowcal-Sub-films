import React from "react";
import type { Layout } from "./layout";
import { ease, mix, sp, tween } from "./motion";
import { MONTAGE } from "./scenes";
import { measure } from "./text";
import { C, FONT_TEXT, LANGUAGE_LABEL } from "./theme";
import { T } from "./timeline";

interface Segment {
  text: string;
  color: string;
}

interface PillState {
  start: number;
  icon: "area" | "live" | null;
  segments: Segment[];
}

// The selector's hint bar, then the app's own status copy, then the language
// pair for each montage cut; one pill morphs between them.
const STATES: readonly PillState[] = [
  {
    start: T.hook.hintIn,
    icon: "area",
    segments: [{ text: "Drag across one line of subtitles", color: C.text1 }],
  },
  {
    start: T.magic.drop + 6,
    icon: "live",
    segments: [
      { text: "Running", color: C.success },
      { text: "  ·  Local processing", color: C.text3 },
    ],
  },
  ...T.montage.cuts.map((cut, i) => ({
    start: cut + 2,
    icon: null,
    segments: [
      { text: LANGUAGE_LABEL[MONTAGE[i].source], color: C.text1 },
      { text: "  →  ", color: C.text3 },
      { text: LANGUAGE_LABEL[MONTAGE[i].target], color: C.text1 },
    ],
  })),
];

function metrics(L: Layout) {
  const size = 40 * L.u;
  return { size, height: 88 * L.u, pad: 38 * L.u, icon: 34 * L.u, gap: 18 * L.u, font: `600 ${size}px ${FONT_TEXT}` };
}

function widthOf(state: PillState, L: Layout): number {
  const m = metrics(L);
  const text = state.segments.reduce((w, s) => w + measure(s.text, m.font), 0);
  return m.pad * 2 + text + (state.icon ? m.icon + m.gap : 0);
}

const Icon: React.FC<{ kind: "area" | "live"; size: number; f: number }> = ({ kind, size, f }) =>
  kind === "area" ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={1.9} strokeLinecap="round">
      <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" strokeDasharray="3 2.4" strokeDashoffset={-f * 0.15} />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r={7 + 3 * ((f % 60) / 60)} fill={C.success} opacity={0.35 * (1 - (f % 60) / 60)} />
      <circle cx="12" cy="12" r="5" fill={C.success} />
    </svg>
  );

const Content: React.FC<{ state: PillState; f: number; L: Layout; opacity: number; dy: number }> = ({ state, f, L, opacity, dy }) => {
  const m = metrics(L);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: m.gap,
        opacity,
        transform: `translateY(${dy}px)`,
        whiteSpace: "pre",
        font: m.font,
      }}
    >
      {state.icon ? <Icon kind={state.icon} size={m.icon} f={f} /> : null}
      <span>
        {state.segments.map((s, i) => (
          <span key={i} style={{ color: s.color }}>
            {s.text}
          </span>
        ))}
      </span>
    </div>
  );
};

export const Pill: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  if (f < T.hook.hintIn || f > T.payoff.start + 12) return null;
  const m = metrics(L);
  const index = STATES.reduce((acc, s, i) => (f >= s.start ? i : acc), 0);
  const current = STATES[index];
  const previous = index > 0 ? STATES[index - 1] : null;
  const morph = previous ? sp(f, current.start, { damping: 19, stiffness: 260 }) : 1;
  const width = previous ? mix(widthOf(previous, L), widthOf(current, L), morph) : widthOf(current, L);
  const swap = previous ? tween(f, [current.start, current.start + 5], [0, 1], ease.outSoft) : 1;

  const enter = sp(f, T.hook.hintIn, { damping: 15, stiffness: 200 });
  const exit = tween(f, [T.payoff.start, T.payoff.start + 10], [0, 1], ease.in);
  const top = (L.portrait ? 130 : 52) * L.u;

  return (
    <div
      style={{
        position: "absolute",
        left: L.W / 2 - width / 2,
        top,
        width,
        height: m.height,
        borderRadius: m.height / 2,
        background: "rgba(14, 17, 24, 0.94)",
        border: `${1.5 * L.u}px solid ${C.line}`,
        boxShadow: `0 ${16 * L.u}px ${44 * L.u}px -${16 * L.u}px rgba(0,0,0,0.8), inset 0 ${L.u}px 0 rgba(255,255,255,0.06)`,
        overflow: "hidden",
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * -36 * L.u - exit * 24 * L.u}px) scale(${mix(0.86, 1, enter) - exit * 0.1})`,
      }}
    >
      {previous && swap < 1 ? (
        <Content state={previous} f={f} L={L} opacity={1 - swap} dy={-swap * 16 * L.u} />
      ) : null}
      <Content state={current} f={f} L={L} opacity={swap} dy={(1 - swap) * 16 * L.u} />
    </div>
  );
};
