import {
  AbsoluteFill,
  Img,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Corners,
  Cursor,
  Reveal,
  linear,
  move,
  pop,
  useLayout,
  paper,
} from "../motion";

export const Capture = () => {
  const f = useCurrentFrame();
  const { w, h, compact, margin } = useLayout();
  const bw = w - margin * 2;
  const sy = compact ? h * 0.62 : 710;
  const bh = compact ? 155 : 118;
  const draw = move(f, 83, 135);
  const translated = pop(f, 222);
  const plateWidth = move(f, 222, 250, 540, bw);
  const exit = move(f, 350, 386);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1 - exit * 0.08})`,
        filter: `blur(${exit * 6}px)`,
      }}
    >
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("ferry.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "62% 50%",
            transform: `scale(${move(f, 0, 348, 1.12, 1.015)}) translateX(${move(f, 0, 348, -15, 0)}px)`,
            filter: `brightness(${move(f, 150, 235, 0.73, 0.94)})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg,rgba(3,8,14,.64),transparent 70%),linear-gradient(0deg,#03070dd9,transparent 53%)",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? 145 : 125,
          opacity: 1 - move(f, 91, 117),
          transform: `translateY(${-move(f, 91, 117, 0, 80)}px)`,
        }}
      >
        <Reveal
          f={f}
          start={-12}
          style={{
            fontSize: compact ? 112 : 146,
            lineHeight: 1.01,
            fontWeight: 700,
            letterSpacing: -7,
          }}
        >
          Great story.
        </Reveal>
        <Reveal
          f={f}
          start={5}
          style={{
            fontSize: compact ? 112 : 146,
            lineHeight: 1.01,
            fontWeight: 700,
            letterSpacing: -7,
            color: "#bac9da",
          }}
        >
          Wrong language.
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          top: compact ? 145 : 128,
          left: margin,
          fontSize: compact ? 90 : 106,
          letterSpacing: -5,
          lineHeight: 1.08,
          fontWeight: 600,
          opacity: 1 - move(f, 192, 213),
          transform: `translateY(${move(f, 97, 133, 90, 0)}px)`,
        }}
      >
        {f >= 97 && (
          <>
            Draw a box.
            <br />
            <span style={{ color: "#adbdcd" }}>Open the story.</span>
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: compact ? 145 : 128,
          left: margin,
          fontSize: compact ? 102 : 126,
          letterSpacing: -6,
          lineHeight: 1.03,
          fontWeight: 600,
        }}
      >
        <Reveal f={f} start={226}>
          Your subtitles.
        </Reveal>
        <Reveal f={f} start={237}>
          <span style={{ color: "#c1d7e8" }}>Your language.</span>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: sy,
          width: bw,
          height: bh,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: compact ? 46 : 69,
          fontWeight: 600,
          textShadow: "0 2px 8px #000",
          padding: "0 24px",
          lineHeight: 1.3,
          transform: `translateY(${move(f, 211, 245, 0, -24)}px)`,
        }}
      >
        The last ferry leaves before sunrise.
      </div>
      {f >= 83 && f < 231 && (
        <div
          style={{
            position: "absolute",
            left: margin,
            top: sy,
            width: bw * draw,
            height: bh * draw,
            border: "1px solid #e8eef777",
            background: "#e8eef706",
            opacity: 1 - move(f, 210, 231),
          }}
        >
          <Corners width={bw * draw} height={bh * draw} />
        </div>
      )}
      {f >= 136 && f < 164 && (
        <div
          style={{
            position: "absolute",
            left: w / 2 - 143,
            top: sy + bh + 22,
            background: paper,
            color: "#0a0e16",
            padding: "16px 28px",
            borderRadius: 8,
            fontSize: 28,
            fontWeight: 600,
            transform: `scale(${pop(f, 136)})`,
          }}
        >
          ✓ &nbsp; Use this area
        </div>
      )}
      {f >= 164 && f < 222 && (
        <div
          style={{
            position: "absolute",
            left: w / 2 - 270,
            top: sy + bh + 22,
            width: 540,
            height: 83,
            background: "linear-gradient(#f4f7fc,#d9e1ee)",
            color: "#0a0e16",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            fontSize: 34,
            fontWeight: 600,
            transform: `scale(${pop(f, 164) * (1 - 0.035 * Math.sin(linear(f, 198, 210) * Math.PI))})`,
            boxShadow: "0 10px 48px #e8eef71f",
          }}
        >
          ▶ &nbsp; Start translation
        </div>
      )}
      {f >= 76 && f < 222 && (
        <Cursor
          x={
            f < 136
              ? margin + draw * bw
              : f < 164
                ? move(f, 136, 159, margin + bw, w / 2 + 130)
                : move(f, 164, 196, w / 2 + 130, w / 2 + 170)
          }
          y={
            f < 136 ? sy + draw * bh : move(f, 136, 159, sy + bh, sy + bh + 57)
          }
          press={f >= 198 ? Math.sin(linear(f, 198, 210) * Math.PI) : 0}
          opacity={move(f, 76, 83) * (1 - move(f, 210, 222))}
        />
      )}
      {f >= 222 && (
        <div
          style={{
            position: "absolute",
            left: (w - plateWidth) / 2,
            top: sy + bh + 6,
            width: plateWidth,
            height: move(f, 222, 250, 83, 140),
            overflow: "hidden",
            background: interpolateColors(f, [222, 238], [paper, "#0b0b0b"]),
            border: "1px solid #ffffff0a",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Noto Sans SC, sans-serif",
            fontSize: compact ? 49 : 70,
            fontWeight: 500,
            textAlign: "center",
            transform: `translateY(${(1 - translated) * 16}px)`,
          }}
        >
          <span style={{ whiteSpace: "nowrap", opacity: linear(f, 232, 244) }}>
            最后一班渡船会在日出之前离开。
          </span>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: compact ? 75 : 45,
          left: margin,
          fontSize: compact ? 27 : 29,
          letterSpacing: 1.5,
          color: "#aab8c7",
          opacity: move(f, 252, 280),
        }}
      >
        ENGLISH → 中文
      </div>
    </AbsoluteFill>
  );
};
