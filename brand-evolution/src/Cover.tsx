import React from "react";
import { AbsoluteFill, Img, Still, staticFile } from "remotion";
import { BrandFont } from "./BrandFont";
import { font, ink, ivory, lavender } from "./motion";

// 3:4 Xiaohongshu cover. Same grammar as the account's best covers: a giant
// headline, one yellow sticker, the brand at the foot. The upgrade is shown,
// not told: the old English window sits behind, the new Chinese one in front.
const W = 1080,
  H = 1440;
const yellow = "#ffd84a";
const outline = (px: number, color = "#05060a") => ({
  WebkitTextStroke: `${px}px ${color}`,
  paintOrder: "stroke fill" as const,
});

const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={(size * 80) / 100} viewBox="14 22 100 80">
    <rect x="42" y="46" width="64" height="48" rx="11" fill={lavender} />
    <rect
      x="22"
      y="30"
      width="72"
      height="50"
      rx="11"
      fill="#20212a"
      stroke={ivory}
      strokeWidth="5"
    />
    <path
      d="M38.5 47.5h38M38.5 60.5h23"
      stroke={ivory}
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

const Spark: React.FC<{ x: number; y: number; size: number }> = ({
  x,
  y,
  size,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ position: "absolute", left: x, top: y, translate: "-50% -50%" }}
  >
    <path
      d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0"
      fill="#fff4ce"
    />
  </svg>
);

const Window: React.FC<{
  src: string;
  width: number;
  ratio: number;
  style: React.CSSProperties;
}> = ({ src, width, ratio, style }) => (
  <div
    style={{
      position: "absolute",
      width,
      height: width * ratio,
      borderRadius: 18,
      overflow: "hidden",
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  </div>
);

const CoverArt: React.FC = () => (
  <AbsoluteFill
    style={{ background: ink, fontFamily: font, overflow: "hidden" }}
  >
    <BrandFont />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 62% 62%, rgba(182,167,223,.32), transparent 52%)`,
      }}
    />

    {/* Old window: smaller, tilted back, dimmed. */}
    <Window
      src="home-old.png"
      width={560}
      ratio={626 / 850}
      style={{
        left: 52,
        top: 560,
        rotate: "-8deg",
        filter: "grayscale(1) brightness(.55)",
        border: "2px solid #2a2d38",
      }}
    />
    {/* New window: in front, lifted, with a lavender rim. */}
    <Window
      src="home-zh.png"
      width={660}
      ratio={1500 / 2040}
      style={{
        left: 372,
        top: 690,
        rotate: "4deg",
        border: `4px solid ${lavender}`,
        boxShadow: `0 30px 80px rgba(0,0,0,.7), 0 0 90px rgba(182,167,223,.45)`,
      }}
    />
    {/* Old → new. */}
    <svg
      width="190"
      height="150"
      viewBox="0 0 190 150"
      style={{ position: "absolute", left: 480, top: 560 }}
    >
      <path
        d="M14 30 C70 6 140 22 160 96"
        fill="none"
        stroke={yellow}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M128 86 L162 124 L182 76"
        fill="none"
        stroke={yellow}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <Spark x={1018} y={628} size={104} />
    <Spark x={372} y={1180} size={56} />

    {/* Headline. */}
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 60,
        color: ivory,
        fontWeight: 800,
        fontSize: 112,
        letterSpacing: -3,
        lineHeight: 1.1,
        ...outline(10),
        textShadow: "0 8px 0 #05060a",
      }}
    >
      Meowcal Sub
    </div>
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 178,
        color: ivory,
        fontWeight: 900,
        fontSize: 290,
        letterSpacing: -14,
        lineHeight: 1.15,
        whiteSpace: "nowrap",
        ...outline(18),
        textShadow: `14px 14px 0 ${lavender}`,
      }}
    >
      升级啦！
    </div>
    <div
      style={{
        position: "absolute",
        right: 60,
        bottom: 96,
        rotate: "-6deg",
        background: yellow,
        color: "#111",
        fontWeight: 900,
        fontSize: 64,
        padding: "8px 26px 12px",
        borderRadius: 14,
        border: "6px solid #05060a",
        boxShadow: "8px 8px 0 #05060a",
      }}
    >
      免费开源
    </div>

    {/* Brand at the foot. */}
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 64,
        display: "flex",
        alignItems: "center",
        gap: 26,
      }}
    >
      <Mark size={150} />
      <span
        style={{
          color: lavender,
          fontWeight: 900,
          fontSize: 132,
          letterSpacing: 4,
          ...outline(10),
        }}
      >
        妙影
      </span>
    </div>
  </AbsoluteFill>
);

export const CoverStill = () => (
  <Still id="Cover" component={CoverArt} width={W} height={H} />
);
