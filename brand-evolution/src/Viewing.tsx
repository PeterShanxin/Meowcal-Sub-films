import React from "react";
import { Video } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import { cue } from "./cues";
import { Cursor } from "./Cursor";
import { bump, font, glide, ivory, lavender, reveal } from "./motion";

const Gear = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z" />
  </svg>
);

const [dragStart, dragEnd] = cue.drag;
const [resizeStart, resizeEnd] = cue.resize;

// Explicit geometry, so the cursor lands exactly on what it operates.
const source = "The ocean never stops moving.";
const sourceTop = 466;
const sourceSize = 38;
const confirmBox = { width: 170, height: 52 };
const capsule = { left: 930, top: 388, width: 150, height: 54 };
const gear = { x: capsule.left + 22 + 14, y: capsule.top + capsule.height / 2 };
const panel = { left: 740, top: 132, width: 360, height: 252, pad: 24 };
const track = { width: panel.width - 2 * panel.pad, top: 120 };
const close = {
  x: panel.left + panel.width - panel.pad - 8,
  y: panel.top + panel.pad + 16,
};
const sizeShare = (size: number) => 0.48 + ((size - 28) / 6) * 0.18;
// The arrow's tip sits 2 px inside the cursor graphic.
const tip = (x: number, y: number): [number, number] => [x - 2, y - 2];

let measure: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, cssFont: string) => {
  measure ??= document.createElement("canvas").getContext("2d");
  if (!measure) return 0;
  measure.font = cssFont;
  return measure.measureText(text).width;
};

// Footage, selection, translation and the floating controls, in 1200 × 675 units.
export const Viewing: React.FC<{ time: number }> = ({ time: t }) => {
  const { fps } = useVideoConfig();
  const draw = glide(t, [dragStart, dragEnd], [0, 1]);
  const translated = reveal(t, cue.confirm, cue.confirm + 0.3);
  const popup =
    glide(t, [cue.style, cue.style + 0.3], [0, 1]) *
    (1 - glide(t, [cue.styleClose, cue.styleClose + 0.25], [0, 1]));
  const size = glide(t, [resizeStart, resizeEnd], [28, 34]);
  const overlays = 1 - reveal(t, cue.toLogo, cue.toLogo + 0.3);
  // The selection hugs the measured subtitle with even padding.
  const sourceWidth = textWidth(source, `650 ${sourceSize}px ${font}`);
  const selection = {
    left: 600 - sourceWidth / 2 - 26,
    top: sourceTop - 12,
    width: sourceWidth + 52,
    height: sourceSize * 1.2 + 24,
  };
  const confirm = {
    left: selection.left + selection.width - confirmBox.width,
    top: selection.top + selection.height + 14,
  };
  const confirmCentre = tip(
    confirm.left + confirmBox.width / 2,
    confirm.top + confirmBox.height / 2,
  );
  const thumb = (size: number) =>
    tip(
      panel.left + panel.pad + track.width * sizeShare(size),
      panel.top + track.top + 2.5,
    );
  const cursorPath: [number, [number, number]][] = [
    [cue.video + 0.2, tip(selection.left - 70, selection.top - 50)],
    [dragStart, tip(selection.left, selection.top)],
    [
      dragEnd,
      tip(selection.left + selection.width, selection.top + selection.height),
    ],
    [cue.confirm - 0.2, confirmCentre],
    [cue.confirm + 0.3, confirmCentre],
    [cue.style - 0.15, tip(gear.x, gear.y)],
    [cue.style + 0.15, tip(gear.x, gear.y)],
    [resizeStart - 0.05, thumb(28)],
    [resizeStart, thumb(28)],
    [resizeEnd, thumb(34)],
    [cue.styleClose - 0.1, tip(close.x, close.y)],
    [cue.toLogo, tip(close.x, close.y)],
  ];
  const keys = cursorPath.map(([at]) => at);
  return (
    <div
      style={{
        position: "absolute",
        width: 1200,
        height: 675,
        background: "#101725",
        color: ivory,
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("coast-demo.mp4")}
        from={cue.click * fps}
        durationInFrames={(cue.cat - cue.click) * fps}
        premountFor={cue.click * fps}
        muted
        style={{ position: "absolute", inset: 0, width: 1200, height: 675 }}
        objectFit="cover"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 40%,rgba(0,0,0,.65))",
        }}
      />
      <div style={{ opacity: overlays }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: sourceTop,
            width: 1200,
            textAlign: "center",
            fontSize: sourceSize,
            lineHeight: 1.2,
            fontWeight: 650,
            textShadow: "0 2px 5px #000",
          }}
        >
          {source}
        </div>
        <div
          style={{
            position: "absolute",
            left: selection.left,
            top: selection.top,
            width: selection.width * draw,
            height: selection.height * draw,
            border: `2px solid ${lavender}`,
            borderRadius: 8,
            background: `rgba(182,167,223,${0.12 * (1 - translated)})`,
            opacity:
              reveal(t, dragStart - 0.05, dragStart + 0.05) *
              (1 - reveal(t, cue.confirm + 0.1, cue.confirm + 0.4)),
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: i % 2 ? "100%" : 0,
                top: i > 1 ? "100%" : 0,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: ivory,
                translate: "-50% -50%",
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: confirm.left,
            top: confirm.top,
            width: confirmBox.width,
            height: confirmBox.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: confirmBox.height / 2,
            background: ivory,
            color: "#10131b",
            fontSize: 23,
            fontWeight: 600,
            transformOrigin: "50% 0",
            scale:
              glide(t, [dragEnd, dragEnd + 0.15, dragEnd + 0.3], [0, 1.1, 1]) *
              (1 - 0.08 * bump(t, cue.confirm, 0.25)) *
              (1 - glide(t, [cue.confirm + 0.1, cue.confirm + 0.3], [0, 1])),
          }}
        >
          确认并开始
        </div>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 566,
            width: 1020,
            height: 72,
            borderRadius: 16,
            background: "rgba(6,8,12,.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: (31 * size) / 28,
            fontWeight: 600,
            opacity: translated,
            transform: `translateY(${(1 - translated) * 24}px) scale(${1 + 0.05 * bump(t, cue.confirm, 0.45)})`,
          }}
        >
          海浪，从未停歇。
        </div>
        <div
          style={{
            position: "absolute",
            left: capsule.left,
            top: capsule.top,
            width: capsule.width,
            height: capsule.height,
            boxSizing: "border-box",
            display: "flex",
            gap: 22,
            alignItems: "center",
            border: "1px solid #454854",
            borderRadius: capsule.height / 2,
            padding: "0 21px",
            background: "#191b24",
            transformOrigin: "30% 50%",
            scale:
              glide(
                t,
                [cue.capsule, cue.capsule + 0.15, cue.capsule + 0.3],
                [0, 1.12, 1],
              ) *
              (1 - 0.06 * bump(t, cue.style, 0.25)),
          }}
        >
          <Gear />
          <div style={{ width: 1, height: 26, background: "#484852" }} />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m16 17 5-5-5-5M21 12H9M9 5H5v14h4" />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: panel.left,
            top: panel.top,
            width: panel.width,
            height: panel.height,
            boxSizing: "border-box",
            borderRadius: 22,
            background: "#151821",
            border: "1px solid #454854",
            opacity: Math.min(1, popup * 1.6),
            transform: `scale(${0.6 + 0.4 * popup})`,
            transformOrigin: `${gear.x - panel.left}px ${gear.y - panel.top}px`,
          }}
        >
          {(
            [
              [panel.pad, 25, 650, "字幕样式"],
              [74, 21, 400, "文字大小"],
              [150, 21, 400, "背景"],
            ] as const
          ).map(([top, fontSize, fontWeight, text]) => (
            <div
              key={text}
              style={{
                position: "absolute",
                left: panel.pad,
                top,
                fontSize,
                fontWeight,
                lineHeight: "32px",
              }}
            >
              {text}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: close.x - panel.left - 10,
              top: close.y - panel.top - 16,
              width: 20,
              lineHeight: "32px",
              textAlign: "center",
              fontSize: 25,
              scale: 1 - 0.2 * bump(t, cue.styleClose, 0.3),
            }}
          >
            ×
          </div>
          <div
            style={{
              position: "absolute",
              right: panel.pad,
              top: 74,
              fontSize: 21,
              lineHeight: "32px",
            }}
          >
            {Math.round(size)}
          </div>
          <div
            style={{
              position: "absolute",
              left: panel.pad,
              top: track.top,
              width: track.width,
              height: 5,
              borderRadius: 3,
              background: "#4d5061",
            }}
          >
            <div
              style={{
                width: track.width * sizeShare(size),
                height: 5,
                borderRadius: 3,
                background: lavender,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: track.width * sizeShare(size),
                top: 2.5,
                width: 16,
                height: 16,
                translate: "-50% -50%",
                borderRadius: 8,
                background: ivory,
                scale:
                  1 +
                  0.25 *
                    reveal(t, resizeStart - 0.1, resizeStart) *
                    (1 - reveal(t, resizeEnd, resizeEnd + 0.15)),
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: panel.pad,
              top: 186,
              display: "flex",
              gap: 12,
              fontSize: 21,
            }}
          >
            <span
              style={{
                padding: "8px 35px",
                background: "#dce1ee",
                color: "#11151e",
                borderRadius: 12,
              }}
            >
              深色
            </span>
            <span
              style={{
                padding: "8px 35px",
                border: "1px solid #454854",
                borderRadius: 12,
              }}
            >
              浅色
            </span>
          </div>
        </div>
        <Cursor
          x={glide(
            t,
            keys,
            cursorPath.map(([, [x]]) => x),
          )}
          y={glide(
            t,
            keys,
            cursorPath.map(([, [, y]]) => y),
          )}
          scale={
            1 -
            0.15 *
              (bump(t, cue.confirm, 0.3) +
                bump(t, cue.style, 0.3) +
                bump(t, cue.styleClose, 0.3))
          }
          opacity={reveal(t, cue.video + 0.1, cue.video + 0.35)}
          size={34}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 18%,#1b2330,#0a0d13 80%)",
          opacity: glide(t, [cue.toLogo + 0.15, cue.cat - 0.25], [0, 1]),
        }}
      />
    </div>
  );
};
