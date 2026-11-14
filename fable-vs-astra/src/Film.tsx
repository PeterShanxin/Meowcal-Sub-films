import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, mix, sp, tween } from "../../launch-15s/src/film/motion";
import { ChatSurface } from "./Chat";
import { C, CHAT_CARD, cardRise, cues, FILM, FONT, NOTES_Y, SLOT_H, SLOT_W, SLOT_X, SLOT_Y, SURFACE, type Thread, type TypedLine } from "./data";

const { chats, astraFilm, astraClip, shrink, swap, v3, pass, v4, outro, copy } = cues;
const fps = cues.fps;

type Rect = { x: number; y: number; w: number; h: number };
const FULL: Rect = FILM;
const FILM_ROUND = 24;
const SLOT = (k: "astra" | "fable"): Rect => ({ x: SLOT_X[k], y: SLOT_Y, w: SLOT_W, h: SLOT_H });
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) });

const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" };

const Frozen: React.FC<{ src: string; at: number; style?: React.CSSProperties }> = ({ src, at, style }) => (
  <Freeze frame={at}>
    <OffthreadVideo src={staticFile(src)} muted style={{ ...fill, ...style }} />
  </Freeze>
);

const Play: React.FC<{ src: string; from: number; frames: number; trim?: number }> = ({ src, from, frames, trim }) => (
  <Sequence from={from} durationInFrames={frames} layout="none">
    <OffthreadVideo src={staticFile(src)} trimBefore={trim} style={fill} pauseWhenBuffering />
  </Sequence>
);

// The video arrives as a card in the agent's "做好了。" message, is tapped, and opens to full screen.
const cardIn = (f: number, th: Thread): { r: Rect; round: number; chrome: number; scale: number; opacity: number } | null => {
  if (f < th.done) return null;
  const rise = cardRise(f, th.done);
  const open = tween(f, [th.open.start, th.open.end], [0, 1], ease.inOut);
  const inChat = { ...CHAT_CARD, y: CHAT_CARD.y + (1 - rise) * 60 };
  return {
    r: lerpRect(inChat, FULL, open),
    round: mix(28, FILM_ROUND, open),
    chrome: 1 - tween(f, [th.open.start, th.open.start + 12], [0, 1]),
    scale: f >= th.tap && f < th.tap + 8 ? 0.94 : 1,
    opacity: Math.min(1, rise * 2),
  };
};

const Card: React.FC<{ r: Rect; round: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ r, round, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: round,
      overflow: "hidden",
      background: "#000",
      boxShadow: round > 1 ? "0 24px 60px #000a" : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// Play button and length, only while the card sits in the chat.
const Chrome: React.FC<{ show: number; seconds: number }> = ({ show, seconds }) =>
  show > 0 ? (
    <div style={{ position: "absolute", inset: 0, opacity: show, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "#0004" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 120,
          height: 120,
          translate: "-50% -50%",
          borderRadius: 60,
          background: "#000a",
          border: "3px solid #fff8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" fill="#fff" />
        </svg>
      </div>
      <div style={{ position: "absolute", right: 18, bottom: 16, padding: "4px 14px", borderRadius: 18, background: "#000a", color: "#fff", fontSize: 30 }}>
        0:{String(Math.floor(seconds)).padStart(2, "0")}
      </div>
    </div>
  ) : null;

const Dim: React.FC<{ v: number }> = ({ v }) => (v > 0 ? <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: 0.94 * v }} /> : null);

// The user's own comments under the film: typed silently, like a typewriter;
// when a line is done the caret stays and blinks.
const Notes: React.FC<{ lines: TypedLine[]; f: number; until: number }> = ({ lines, f, until }) => {
  const out = tween(f, [until, until + 24], [1, 0]);
  const started = lines.filter((l) => l.frames[0] <= f).slice(-3);
  if (!started.length || out <= 0) return null;
  const last = started.length - 1;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: NOTES_Y, opacity: out, display: "flex", flexDirection: "column", gap: 12 }}>
      {started.map((l, i) => {
        const chars = Array.from(l.t);
        const n = l.frames.filter((x) => x <= f).length;
        const typing = n < chars.length;
        const on = typing || Math.floor(f / 30) % 2 === 0;
        return (
          <div key={l.t} style={{ fontSize: 36, lineHeight: 1.45, textAlign: "center", color: i === last ? C.text2 : C.text3, opacity: i === last ? 0.95 : 0.6 }}>
            {chars.slice(0, n).join("")}
            {i === last && (
              <span style={{ display: "inline-block", width: 3, height: 36, marginLeft: 4, verticalAlign: -6, background: C.text2, opacity: on ? 1 : 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const AstraScene: React.FC<{ f: number }> = ({ f }) => {
  const a = chats.astra;
  const c = cardIn(f, a.intro);
  let r = c?.r;
  let round = c?.round ?? 0;
  if (c && f >= shrink.start) {
    const t = tween(f, [shrink.start, shrink.end], [0, 1], ease.inOut);
    r = lerpRect(FULL, CHAT_CARD, t);
    round = mix(FILM_ROUND, 28, t);
  }
  return (
    <>
      <ChatSurface name={a.name} accent={a.accent} logo={a.logo} th={a.intro} f={f} />
      <Dim v={tween(f, [a.intro.open.start, a.intro.open.end], [0, 1]) * tween(f, [shrink.start, shrink.end], [1, 0])} />
      {c && r && (
        <Card r={r} round={round} style={{ scale: c.scale, opacity: c.opacity }}>
          {f < astraFilm.start ? (
            <Frozen src={astraClip.file} at={0} />
          ) : f < astraFilm.end ? (
            <Play src={astraClip.file} from={astraFilm.start} frames={astraFilm.end - astraFilm.start} />
          ) : (
            <Frozen src={astraClip.file} at={astraClip.frames - 2} />
          )}
          <Chrome show={f >= shrink.end ? tween(f, [shrink.end - 6, shrink.end + 6], [0, 1]) : c.chrome} seconds={astraClip.frames / fps} />
        </Card>
      )}
    </>
  );
};

const FableScene: React.FC<{ f: number }> = ({ f }) => {
  const b = chats.fable;
  const v3c = f < pass.flingEnd ? cardIn(f, b.intro) : null;
  const v4c = cardIn(f, b.rant);
  const grey = tween(f, [v3.cut, v3.cut + 20], [0, 1]);
  const noteIn = sp(f, pass.note, { damping: 15, stiffness: 200 });
  const stampIn = sp(f, pass.stamp, { damping: 11, stiffness: 260 });
  const fling = tween(f, [pass.fling, pass.flingEnd], [0, 1], ease.in);
  const toSlot = tween(f, [outro.start, outro.start + 40], [0, 1], ease.inOut);
  return (
    <>
      <ChatSurface name={b.name} accent={b.accent} logo={b.logo} th={f < pass.fling ? b.intro : b.rant} f={f} />
      <Dim
        v={Math.max(
          tween(f, [b.intro.open.start, b.intro.open.end], [0, 1]) * tween(f, [pass.fling, pass.flingEnd], [1, 0]),
          tween(f, [b.rant.open.start, b.rant.open.end], [0, 1]),
        )}
      />
      {v3c && (
        <Card r={v3c.r} round={v3c.round} style={{ scale: v3c.scale, opacity: v3c.opacity, translate: `${fling * 1400}px ${-fling * 900}px`, rotate: `${fling * 32}deg` }}>
          <div style={{ ...fill, filter: grey > 0 ? `grayscale(${grey}) brightness(${1 - 0.8 * grey}) blur(${grey * 6}px)` : undefined }}>
            {f < v3.start ? (
              <Frozen src={v3.file} at={v3.trim} />
            ) : f < v3.cut ? (
              <Play src={v3.file} from={v3.start} frames={v3.play} trim={v3.trim} />
            ) : (
              <Frozen src={v3.file} at={v3.trim + v3.play - 1} />
            )}
          </div>
          <Chrome show={v3c.chrome} seconds={v3.frames / fps} />
          <div style={{ position: "absolute", left: 0, top: 0, width: SURFACE.w, height: SURFACE.h, transformOrigin: "0 0", scale: v3c.r.w / SURFACE.w }}>
          {f >= pass.note && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 520,
                textAlign: "center",
                lineHeight: 1.45,
                fontFamily: FONT,
                fontSize: 60,
                fontWeight: 800,
                whiteSpace: "nowrap",
                color: C.text1,
                opacity: Math.min(1, noteIn * 1.5),
                translate: `0 ${(1 - noteIn) * 40}px`,
              }}
            >
              {copy.passNote.split(/(?<=好几次了，)/).map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          )}
          {f >= pass.stamp && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 1060,
                translate: "-50% -50%",
                rotate: "-12deg",
                scale: mix(2.6, 1, stampIn),
                opacity: Math.min(1, stampIn * 1.6),
                border: `16px solid ${C.pass}`,
                borderRadius: 40,
                padding: "10px 60px",
                color: C.pass,
                fontFamily: '"Segoe UI", sans-serif',
                fontSize: 250,
                fontWeight: 900,
                letterSpacing: 12,
                background: "#140809",
                boxShadow: "0 20px 60px #000c",
              }}
            >
              PASS
            </div>
          )}
          </div>
        </Card>
      )}
      {f >= outro.start && <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: toSlot }} />}
      {v4c && (
        <Card
          r={f < outro.start ? v4c.r : lerpRect(FULL, SLOT("fable"), toSlot)}
          round={f < outro.start ? v4c.round : mix(FILM_ROUND, 28, toSlot)}
          style={{ scale: v4c.scale, opacity: v4c.opacity * tween(f, [outro.brand - 30, outro.brand], [1, 0]) }}
        >
          {f < v4.start ? (
            <Frozen src={v4.file} at={0} />
          ) : f < v4.end ? (
            <Play src={v4.file} from={v4.start} frames={v4.end - v4.start} />
          ) : (
            <>
              <Frozen src={v4.file} at={v4.frames - 2} />
              <Frozen src={v4.file} at={v4.still} style={{ opacity: tween(f, [outro.start + 20, outro.start + 50], [0, 1]) }} />
            </>
          )}
          <Chrome show={v4c.chrome} seconds={v4.frames / fps} />
        </Card>
      )}
    </>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const sw = tween(f, [swap.start, swap.end], [0, 1], ease.inOut);
  const aDone = chats.astra.intro.done;
  const fDone = chats.fable.intro.done;
  const kicker =
    tween(f, [6, 30], [0, 1]) * tween(f, [aDone - 20, aDone], [1, 0]) + tween(f, [swap.start, swap.end], [0, 1]) * tween(f, [fDone - 20, fDone], [1, 0]);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, overflow: "hidden" }}>
      {f < swap.end && (
        <div style={{ position: "absolute", inset: 0, translate: `${-sw * 1120}px 0` }}>
          <AstraScene f={f} />
        </div>
      )}
      {f >= swap.start && (
        <div style={{ position: "absolute", inset: 0, translate: `${(1 - sw) * 1120}px 0` }}>
          <FableScene f={f} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 48, fontWeight: 600, color: C.text2, letterSpacing: -1, opacity: kicker }}>
        {copy.kicker}
      </div>
      <Notes lines={cues.notes.astra} f={f} until={astraFilm.end} />
      <Notes lines={cues.notes.v3} f={f} until={pass.note - 24} />
      <Notes lines={cues.notes.v4} f={f} until={v4.end} />
      {f >= outro.start && <Outro f={f} />}
      <Audio src={staticFile("audio/keys.wav")} />
      <Audio src={staticFile("audio/sfx.wav")} />
    </AbsoluteFill>
  );
};

const shown = (l: TypedLine, f: number) => l.frames.filter((x) => x <= f).length - (l.del ? l.del.filter((x) => x <= f).length : 0);

const Typed: React.FC<{ l: TypedLine; f: number; caret: boolean; style: React.CSSProperties }> = ({ l, f, caret, style }) => {
  const n = shown(l, f);
  if (n <= 0 && !caret) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, textAlign: "center", color: C.text1, ...style }}>
      {Array.from(l.t).slice(0, Math.max(0, n)).join("")}
      {caret && (
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            height: "1em",
            marginLeft: "0.08em",
            verticalAlign: "-0.12em",
            background: C.text1,
            opacity: Math.floor(f / 20) % 2 === 0 ? 1 : 0.15,
          }}
        />
      )}
    </div>
  );
};

const Outro: React.FC<{ f: number }> = ({ f }) => {
  const slotIn = tween(f, [outro.start, outro.start + 40], [0, 1], ease.out);
  const away = tween(f, [outro.brand - 30, outro.brand], [1, 0], ease.inOut);
  const q = outro.question;
  const qDone = q.frames[q.frames.length - 1];
  const caretLine = f < outro.ask.frames[0] ? 0 : 1;
  const chips = sp(f, qDone + 20, { damping: 14 });
  const pulse = (k: number) => 1 + 0.03 * Math.max(0, Math.sin(((f - outro.start) / 60) * Math.PI * 2 - k * Math.PI));
  const brandIn = sp(f, outro.brand, { damping: 13 });
  const sub = tween(f, [outro.brand + 30, outro.brand + 60], [0, 1]);
  const credit = tween(f, [outro.brand + 70, outro.brand + 100], [0, 1]);
  const small = (l: TypedLine) => Array.from(l.t).slice(0, l.frames.filter((x) => x <= f).length).join("");
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: away }}>
        <div
          style={{
            position: "absolute",
            left: mix(-SLOT_W - 40, SLOT_X.astra, slotIn),
            top: SLOT_Y,
            width: SLOT_W,
            height: SLOT_H,
            borderRadius: 28,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <Frozen src={astraClip.file} at={astraClip.still} />
        </div>
        {(["astra", "fable"] as const).map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: SLOT_X[k],
              width: SLOT_W,
              top: SLOT_Y - 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: slotIn,
              fontSize: 42,
              fontWeight: 800,
              color: C.text1,
            }}
          >
            <Img src={staticFile(chats[k].logo)} style={{ width: 40, height: 40 }} />
            {chats[k].name}
          </div>
        ))}
        <Typed l={q} f={f} caret={caretLine === 0} style={{ top: 186, fontSize: 124, fontWeight: 800, letterSpacing: -2 }} />
        <Typed l={outro.ask} f={f} caret={caretLine === 1} style={{ top: 370, fontSize: 46, color: C.text2 }} />
        {(["astra", "fable"] as const).map((k, i) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: SLOT_X[k] + 40,
              width: SLOT_W - 80,
              top: SLOT_Y + SLOT_H + 34,
              height: 96,
              borderRadius: 48,
              border: `4px solid ${chats[k].accent}`,
              color: C.text1,
              fontSize: 38,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.min(1, chips * 1.4),
              scale: mix(0.8, 1, chips) * pulse(i),
            }}
          >
            {i === 0 ? `← ${chats[k].name}` : `${chats[k].name} →`}
          </div>
        ))}
        <div style={{ position: "absolute", left: 80, right: 80, top: 1660, textAlign: "center", fontSize: 32, lineHeight: 1.6, color: C.text3 }}>
          <div>{small(outro.thought[0])}</div>
          <div>{small(outro.thought[1])}</div>
        </div>
      </div>
      {f >= outro.brand && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ scale: mix(0.6, 1, brandIn), opacity: Math.min(1, brandIn * 1.5) }}>
            <Img src={staticFile("mark.svg")} style={{ width: 240, height: 240 }} />
          </div>
          <div style={{ marginTop: 24, fontSize: 76, fontWeight: 800, color: C.text1, letterSpacing: -1, opacity: Math.min(1, brandIn * 1.5) }}>{copy.brand}</div>
          <div style={{ marginTop: 28, fontSize: 46, color: C.text2, opacity: sub }}>{copy.tagline}</div>
          <div style={{ marginTop: 18, fontSize: 32, color: C.text3, opacity: sub }}>{copy.brandLine}</div>
        </div>
      )}
      {f >= outro.brand && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1760, textAlign: "center", fontSize: 28, color: C.text3, opacity: credit * 0.8, fontFamily: '"Segoe UI", sans-serif' }}>
          {copy.credit}
        </div>
      )}
    </>
  );
};
