import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cat, Corners, move, useLayout, ink } from "../motion";

export const Brand = () => {
  const f = useCurrentFrame();
  const { w, h, compact } = useLayout();
  const close = move(f, 0, 32);
  const size = compact ? 180 : 158;
  const boxW = move(f, 0, 32, w, size);
  const boxH = move(f, 0, 32, h, size);
  const iconY = h * 0.32;
  const cy = move(f, 0, 32, h * 0.5, iconY + size / 2);
  return (
    <AbsoluteFill>
      <svg width={w} height={h} style={{ position: "absolute" }}>
        <defs>
          <mask id="closing">
            <rect width={w} height={h} fill="white" />
            <rect
              x={(w - boxW) / 2}
              y={cy - boxH / 2}
              width={boxW}
              height={boxH}
              fill="black"
            />
          </mask>
        </defs>
        <rect width={w} height={h} fill={ink} mask="url(#closing)" />
      </svg>
      <div
        style={{
          position: "absolute",
          width: boxW,
          height: boxH,
          left: (w - boxW) / 2,
          top: cy - boxH / 2,
          opacity: 1 - move(f, 24, 42),
        }}
      >
        <Corners
          width={boxW}
          height={boxH}
          size={move(f, 0, 32, 48, 28)}
          weight={3}
        />
      </div>
      <AbsoluteFill style={{ background: ink, opacity: move(f, 26, 40) }} />
      <div
        style={{
          position: "absolute",
          left: w / 2 - size / 2,
          top: iconY,
          transform: `scale(${move(f, 28, 57, 0.82, 1)})`,
        }}
      >
        <Cat size={size} progress={move(f, 26, 57)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: iconY + size + 35,
          textAlign: "center",
          fontSize: compact ? 100 : 113,
          fontWeight: 600,
          letterSpacing: -6,
          opacity: move(f, 37, 56),
          transform: `translateY(${move(f, 35, 64, 30, 0)}px)`,
        }}
      >
        Meowcal Sub
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: iconY + size + (compact ? 173 : 180),
          fontSize: compact ? 39 : 42,
          letterSpacing: -0.7,
          color: "#aebbd0",
          textAlign: "center",
          opacity: move(f, 49, 69),
        }}
      >
        Read beyond language.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: compact ? 120 : 82,
          textAlign: "center",
          fontSize: compact ? 26 : 27,
          letterSpacing: 2,
          color: "#899bb2",
          opacity: move(f, 57, 75),
        }}
      >
        FOR WINDOWS 11
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: (1 - close) * 0.08,
          background: "white",
        }}
      />
    </AbsoluteFill>
  );
};
