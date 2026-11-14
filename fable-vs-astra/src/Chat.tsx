import React from "react";
import { Img, staticFile } from "remotion";
import { sp } from "../../launch-15s/src/film/motion";
import { C, CHAT, CHAT_CARD, cardRise, FONT, type Msg, type Thread } from "./data";

// A sent message: the task in plain words, or a complaint shown only as bars.
const Body: React.FC<{ m: Msg }> = ({ m }) =>
  m.bars ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0", width: 620 }}>
      {m.bars.map((w, i) => (
        <div key={i} style={{ height: 26, width: `${w * 100}%`, borderRadius: 13, background: "#ffffff26" }} />
      ))}
    </div>
  ) : (
    <>{m.text}</>
  );

const Avatar: React.FC<{ logo: string; size: number }> = ({ logo, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: C.raised,
      border: `2px solid ${C.edge}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
    }}
  >
    <Img src={staticFile(logo)} style={{ width: size * 0.56, height: size * 0.56 }} />
  </div>
);

const Dots: React.FC<{ f: number; color: string }> = ({ f, color }) => (
  <div style={{ display: "flex", gap: 12, height: 63, alignItems: "center", padding: "0 10px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: color,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f / 60) * Math.PI * 3 - i * 0.9)),
        }}
      />
    ))}
  </div>
);

// Work in progress: quick start, a stall in the middle, then a run to the end.
const progressAt = (t: number) => {
  const e = (x: number) => 1 - (1 - x) ** 3;
  if (t < 0.35) return 0.48 * e(t / 0.35);
  if (t < 0.62) return 0.48 + 0.1 * ((t - 0.35) / 0.27);
  return 0.58 + 0.42 * e((t - 0.62) / 0.38);
};

const Progress: React.FC<{ f: number; from: number; to: number; accent: string }> = ({ f, from, to, accent }) => {
  const p = progressAt(Math.min(1, Math.max(0, (f - from) / (to - from))));
  return (
    <div
      style={{
        width: 560,
        padding: "26px 32px 30px",
        borderRadius: "38px 38px 38px 10px",
        background: C.raised,
        border: `2px solid ${accent}55`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, color: C.text2, marginBottom: 20 }}>
        <span>正在写代码</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: C.text1, fontWeight: 700 }}>{Math.floor(p * 100)}%</span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: C.edge, overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: accent }} />
      </div>
    </div>
  );
};

const agentBubble = (accent: string): React.CSSProperties => ({
  background: C.raised,
  border: `2px solid ${accent}55`,
  color: C.text1,
  borderRadius: "38px 38px 38px 10px",
  padding: "22px 34px",
  fontSize: 44,
  fontWeight: 700,
  lineHeight: 1.5,
  alignSelf: "flex-start",
});

const Row: React.FC<{ logo: string; enter: number; children: React.ReactNode }> = ({ logo, enter, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: CHAT.avatarGap,
      opacity: Math.min(1, enter * 2),
      translate: `0 ${(1 - enter) * 60}px`,
    }}
  >
    <Avatar logo={logo} size={CHAT.avatar} />
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
  </div>
);

// One chat window, drawn at full 1080 x 1920.
export const ChatSurface: React.FC<{ name: string; accent: string; logo: string; th: Thread; f: number }> = ({ name, accent, logo, th, f }) => {
  const typing = th.msgs.find((m) => f < m.send && m.typeStart <= f);
  const press = th.msgs.some((m) => f >= m.send - 3 && f < m.send + 5);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.surface, fontFamily: FONT, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHAT.header, flexShrink: 0, position: "relative", borderBottom: `2px solid ${C.edge}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 56, top: 196, display: "flex", alignItems: "center", gap: 24 }}>
          <Img src={staticFile(logo)} style={{ width: 72, height: 72 }} />
          <div style={{ fontSize: 56, fontWeight: 700, color: C.text1, letterSpacing: -0.5 }}>{name}</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 22,
          padding: `0 ${CHAT.side}px ${CHAT.listGap}px`,
        }}
      >
        {th.msgs
          .filter((m) => f >= m.send)
          .map((m, i) => {
            const k = sp(f, m.send, { damping: 15, stiffness: 230 });
            return (
              <div
                key={i}
                style={{
                  alignSelf: "flex-end",
                  maxWidth: 900,
                  background: C.bubble,
                  color: C.text1,
                  borderRadius: "38px 38px 10px 38px",
                  padding: "22px 34px",
                  fontSize: 42,
                  lineHeight: 1.5,
                  flexShrink: 0,
                  translate: `0 ${(1 - k) * 50}px`,
                  opacity: Math.min(1, k * 2),
                }}
              >
                <Body m={m} />
              </div>
            );
          })}
        {f >= th.dots && (
          <div style={{ flexShrink: 0, marginTop: 12 }}>
            <Row logo={logo} enter={sp(f, th.dots, { damping: 16 })}>
              <div style={{ ...agentBubble(accent), padding: f >= th.reply ? "22px 34px" : "10px 22px" }}>
                {f >= th.reply ? th.text : <Dots f={f} color={accent} />}
              </div>
            </Row>
          </div>
        )}
        {f >= th.working && (
          <div style={{ flexShrink: 0 }}>
            <Row logo={logo} enter={f < th.done ? sp(f, th.working, { damping: 16 }) : cardRise(f, th.done)}>
              {f < th.done ? (
                <Progress f={f} from={th.working} to={th.done - 12} accent={accent} />
              ) : (
                <>
                  <div style={agentBubble(accent)}>做好了。</div>
                  <div style={{ width: CHAT_CARD.w, height: CHAT_CARD.h, borderRadius: 28 }} />
                </>
              )}
            </Row>
          </div>
        )}
      </div>

      <div
        style={{
          margin: `0 32px ${CHAT.composerBottom}px`,
          minHeight: CHAT.composerMin,
          flexShrink: 0,
          position: "relative",
          background: C.raised,
          border: `2px solid ${typing ? accent + "88" : C.edge}`,
          borderRadius: 44,
          padding: "32px 124px 32px 40px",
          boxSizing: "border-box",
          fontSize: 42,
          lineHeight: 1.5,
          color: C.text1,
        }}
      >
        {typing ? (
          <>
            {typing.label ? (
              <span style={{ color: C.text2 }}>{typing.label}</span>
            ) : (
              Array.from(typing.text ?? "").slice(0, typing.keys.filter((x) => x <= f).length).join("")
            )}
            <span style={{ display: "inline-block", width: 4, height: 48, marginLeft: 4, verticalAlign: -9, background: accent }} />
          </>
        ) : (
          <span style={{ color: C.text3 }}>发消息…</span>
        )}
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 20,
            width: 88,
            height: 88,
            borderRadius: 44,
            background: typing || press ? accent : C.edge,
            scale: press ? 0.86 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#11131a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
