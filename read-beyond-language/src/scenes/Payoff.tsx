import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Corners, Reveal, move, useLayout } from "../motion";

export const Payoff = () => {
  const f = useCurrentFrame();
  const { w, h, compact, margin } = useLayout();
  const enter = move(f, 0, 34);
  const expand = move(f, 77, 119);
  const inset = (1 - expand) * (compact ? 30 : 80);
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${(1 - enter) * 100}% 0 0 0)`,
        background: "#07090f",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset,
          overflow: "hidden",
          transform: `perspective(2000px) rotateX(${move(f, 0, 95, 7, 0)}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <Img
          src={staticFile("ferry.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "65% 50%",
            transform: `scale(${move(f, 0, 260, 1.15, 1.025)})`,
            filter: `brightness(${move(f, 65, 135, 0.8, 1.08)})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg,#03070b88,transparent 78%),linear-gradient(0deg,#03070bee,transparent 52%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? 155 : 133,
          fontSize: compact ? 129 : 162,
          fontWeight: 700,
          letterSpacing: compact ? -7 : -9,
          lineHeight: 1.01,
        }}
      >
        <Reveal f={f} start={21}>
          Stay in
        </Reveal>
        <Reveal f={f} start={37}>
          the story.
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? h * 0.69 : 725,
          width: w - 2 * margin,
          opacity: move(f, 47, 74),
          transform: `translateY(${move(f, 47, 88, 50, 0)}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: compact ? 46 : 67,
            fontWeight: 500,
            textShadow: "0 2px 7px #000",
            padding: "10px 20px 25px",
          }}
        >
          {f < 108
            ? "The last ferry leaves before sunrise."
            : "This is only the beginning."}
        </div>
        <div
          style={{
            padding: "23px 25px",
            background: "#0b0b0b",
            borderRadius: 12,
            border: "1px solid #ffffff0a",
            fontSize: compact ? 49 : 70,
            fontFamily: "Noto Sans SC, sans-serif",
          }}
        >
          <span
            style={{
              opacity:
                f >= 108 && f < 124 ? 0 : f >= 124 ? move(f, 124, 135) : 1,
            }}
          >
            {f < 108 ? "最后一班渡船会在日出之前离开。" : "这才刚刚开始。"}
          </span>
        </div>
      </div>
      {f < 140 && (
        <div
          style={{
            position: "absolute",
            left: inset,
            top: inset,
            width: w - inset * 2,
            height: h - inset * 2,
            opacity: 1 - move(f, 94, 140),
          }}
        >
          <Corners width={w - inset * 2} height={h - inset * 2} size={42} />
        </div>
      )}
    </AbsoluteFill>
  );
};
