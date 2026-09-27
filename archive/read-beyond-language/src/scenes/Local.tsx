import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Corners, Reveal, move, useLayout, ink } from "../motion";

export const Local = () => {
  const f = useCurrentFrame();
  const { w, h, compact, margin } = useLayout();
  const enter = move(f, 0, 34);
  const exit = move(f, 205, 238);
  const appW = compact ? w - 144 : 1010;
  const appX = compact ? 72 : 838;
  const appY = compact ? h * 0.47 : 303;
  return (
    <AbsoluteFill
      style={{
        background: "#e8eef7",
        color: ink,
        clipPath: `inset(${(1 - enter) * 100}% 0 0 0)`,
        transform: `translateY(${-exit * h}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? 100 : 201,
          fontSize: compact ? 105 : 126,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: -6,
        }}
      >
        <Reveal f={f} start={22}>
          Big world.
        </Reveal>
        <Reveal f={f} start={34}>
          Local AI.
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? 365 : 566,
          fontSize: compact ? 37 : 42,
          lineHeight: 1.45,
          letterSpacing: -1,
          opacity: move(f, 67, 89),
        }}
      >
        Subtitle text stays
        <br />
        on your PC.
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          top: compact ? 480 : 757,
          display: "flex",
          alignItems: "center",
          gap: 17,
          fontSize: compact ? 29 : 30,
          opacity: move(f, 94, 120),
        }}
      >
        <svg width="36" height="38" viewBox="0 0 32 34" fill="none">
          <rect
            x="5"
            y="14"
            width="22"
            height="17"
            rx="4"
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M10 14V9a6 6 0 0112 0v5" stroke={ink} strokeWidth="2" />
          <circle cx="16" cy="22" r="2" fill={ink} />
        </svg>
        Local OCR + translation
      </div>
      <div
        style={{
          position: "absolute",
          left: appX,
          top: appY,
          width: appW,
          height: appW * 0.425,
          overflow: "hidden",
          background: "#080b10",
          borderRadius: 18,
          perspective: 1600,
          transform: `translateY(${move(f, 12, 66, 180, 0)}px) rotateY(${move(f, 12, 96, -10, 0)}deg)`,
          boxShadow: "-22px 45px 90px #13243b30",
        }}
      >
        <Img
          src={staticFile("home.png")}
          style={{
            position: "absolute",
            width: appW * 1.22,
            left: -appW * 0.11,
            top: -appW * 0.33,
            transform: `scale(${move(f, 105, 174, 1, 1.012)})`,
            transformOrigin: "50% 76%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: appW * 0.3,
            top: appW * 0.35,
            width: appW * 0.43,
            height: appW * 0.06,
            opacity: move(f, 105, 137),
          }}
        >
          <Corners
            width={appW * 0.43}
            height={appW * 0.06}
            size={13}
            weight={2}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: margin,
          fontSize: 24,
          letterSpacing: 3,
          color: "#586a81",
          opacity: move(f, 125, 146),
        }}
      >
        MEOWCAL SUB / ON-DEVICE BY DESIGN
      </div>
    </AbsoluteFill>
  );
};
