import React from "react";
import { Img, staticFile, interpolateColors } from "remotion";
import { cue } from "./cues";
import { bump, glide, ivory, reveal, settle } from "./motion";
import { FluidLabel } from "./FluidLabel";
import { Cursor } from "./Cursor";

// Final rectangle of 选择字幕区域; the footage opens out of this button.
export const selectButton = { left: 80, top: 347, width: 339, height: 55 };

const [clear, retitle, area, start] = cue.layout;
const relay = cue.relay;

export const Interface: React.FC<{ time: number; height: number }> = ({
  time: t,
  height,
}) => {
  // Each label swaps on its own eighth note and lands with a small pop.
  const swap = (at: number) => glide(t, [at, at + 0.4], [0, 1]);
  const pop = (at: number) => `scale(${1 + 0.1 * bump(t, at, 0.45)})`;
  const title = swap(retitle),
    areaShape = glide(t, [area, area + 0.45], [0, 1]),
    startShape = glide(t, [start, start + 0.45], [0, 1]);
  const gone = (at: number) => 1 - reveal(t, at, at + 0.35);
  const press = 1 - 0.05 * bump(t, cue.click, 0.3);
  return (
    <div
      style={{
        position: "absolute",
        width: 850,
        height,
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 0%,#11151b,#080b10 66%)",
        color: ivory,
        fontSize: 16,
      }}
    >
      <div
        style={{
          height: 40,
          borderBottom: "1px solid #222832",
          background: "linear-gradient(#191c21,#12151a)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 20,
            height: 24,
            transform: pop(cue.brand),
          }}
        >
          <Img
            src={staticFile("logo-old.svg")}
            style={{
              position: "absolute",
              inset: 0,
              width: 22,
              opacity: 1 - swap(cue.brand),
            }}
          />
          <Img
            src={staticFile("mark.svg")}
            style={{
              position: "absolute",
              inset: 0,
              width: 24,
              opacity: swap(cue.brand),
            }}
          />
        </div>
        {/* The English name stays; only " · 妙影" grows in after it. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 15,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Meowcal Sub
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              overflow: "hidden",
              maxWidth: 52 * glide(t, [cue.brand, cue.brand + 0.3], [0, 1]),
            }}
          >
            {["dot", "妙", "影"].map((c, i) => {
              const at = cue.brand + i * 0.08;
              const p = reveal(t, at, at + 0.25);
              return (
                <span
                  key={c}
                  style={{
                    display: "inline-block",
                    opacity: p,
                    color: c === "dot" ? undefined : "#cfc4ee",
                    transform: `translateY(${(1 - p) * 8}px) scale(${1 + 0.25 * bump(t, at, 0.35)})`,
                  }}
                >
                  {c === "dot" ? (
                    <span
                      style={{
                        display: "block",
                        width: 3,
                        height: 3,
                        margin: "0 6px",
                        borderRadius: 2,
                        background: "#b6bfcc",
                      }}
                    />
                  ) : (
                    c
                  )}
                </span>
              );
            })}
          </span>
        </div>
        <svg
          width="165"
          height="24"
          viewBox="0 0 165 24"
          style={{ marginLeft: "auto" }}
          fill="none"
          stroke="#b6bfcc"
          strokeWidth="1.5"
        >
          <path d="M3 12h14 M145 5l14 14M159 5l-14 14" />
          <rect x="77" y="5" width="13" height="13" rx="1" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 382,
          top: 102,
          background: "#17302b",
          border: "1px solid #285549",
          color: "#47d6a5",
          borderRadius: 25,
          padding: "5px 14px",
          fontWeight: 600,
          fontSize: 14,
          scale: glide(t, [clear, clear + 0.12, clear + 0.35], [1, 1.15, 0]),
          opacity: gone(clear + 0.1),
        }}
      >
        ● Ready
      </div>
      <div
        style={{
          position: "absolute",
          left: settle(t, retitle, 298, 76),
          top: settle(t, retitle, 142, 134),
          transform: pop(relay[0]),
          transformOrigin: "0 50%",
        }}
      >
        <FluidLabel
          before={title < 1 ? "Ready for subtitles" : "Let’s watch"}
          after={title < 1 ? "Let’s watch" : "开始观看吧"}
          progress={title < 1 ? title : swap(relay[0])}
          width={650}
          height={65}
          size={30 + 12 * title}
          weight={700}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 191,
          width: 690,
          textAlign: "center",
          color: "#bdcce0",
          fontSize: 16,
          opacity: gone(clear),
          filter: `blur(${reveal(t, clear, clear + 0.35) * 6}px)`,
          scale: 1 - 0.12 * reveal(t, clear, clear + 0.35),
        }}
      >
        Start when your episode is playing. Everything stays on this PC.
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i ? 449 : 80,
            top: settle(t, retitle + i * 0.08, 239, 245),
            width: 321,
          }}
        >
          <div
            style={{ transform: pop(relay[1 + i]), transformOrigin: "0 50%" }}
          >
            <FluidLabel
              before={i ? "Translate into" : "Original subtitles"}
              after={i ? "翻译为" : "原字幕"}
              progress={swap(relay[1 + i])}
              width={320}
              height={25}
              size={14}
              color="#91a0b6"
            />
          </div>
          <div
            style={{
              position: "relative",
              height: 50,
              border: "1px solid #61646b",
              borderRadius: 10,
              background: "#14171d",
              marginTop: 4,
              paddingLeft: 12,
              transform: pop(relay[3 + i]),
            }}
          >
            <FluidLabel
              before={i ? "Chinese (Simplified)" : "English (US)"}
              after={i ? "简体中文" : "英语（美国）"}
              progress={swap(relay[3 + i])}
              width={277}
              height={50}
              size={18}
            />
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              style={{ position: "absolute", right: 15, top: 20 }}
            >
              <path
                d="m2 3 6 6 6-6"
                fill="none"
                stroke="#b3bfcc"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      ))}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        style={{
          position: "absolute",
          left: 411,
          top: 282,
          scale: glide(t, [start, start + 0.25, start + 0.45], [0, 1.2, 1]),
        }}
      >
        <path
          d="M3 14h21m-9-8 9 8-9 8"
          fill="none"
          stroke="#8c9bb3"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: settle(t, area, 327, selectButton.top),
          width: settle(t, area, 690, selectButton.width),
          height: settle(t, area, 60, selectButton.height),
          scale: press * (1 + 0.06 * bump(t, relay[5], 0.45)),
          borderRadius: glide(t, [area, area + 0.25, area + 0.6], [10, 28, 12]),
          background: interpolateColors(
            areaShape,
            [0, 1],
            ["#101319", "#e4eaf5"],
          ),
          border: `1px solid ${interpolateColors(areaShape, [0, 1], ["#292e36", "#f4f6fb"])}`,
          boxShadow: `0 ${areaShape * 12}px ${areaShape * 38}px rgba(192,205,237,${areaShape * 0.15})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: settle(t, area, 58, 66),
            top: 0,
          }}
        >
          <FluidLabel
            before={
              areaShape < 1 ? "Subtitle area selected" : "Select subtitle area"
            }
            after={areaShape < 1 ? "Select subtitle area" : "选择字幕区域"}
            progress={areaShape < 1 ? areaShape : swap(relay[5])}
            width={270}
            height={55}
            size={17}
            weight={600}
            color={interpolateColors(areaShape, [0, 1], [ivory, "#11151d"])}
          />
        </div>
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          style={{
            position: "absolute",
            left: settle(t, area, 20, 43),
            top: 18,
          }}
        >
          <rect
            x="2"
            y="3"
            width="16"
            height="12"
            rx="2"
            stroke={interpolateColors(areaShape, [0, 1], [ivory, "#11151d"])}
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
          />
        </svg>
        <span
          style={{
            position: "absolute",
            right: 22,
            top: 18,
            fontSize: 16,
            fontWeight: 600,
            opacity: gone(area),
            filter: `blur(${areaShape * 5}px)`,
          }}
        >
          Change ›
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: settle(t, start, 260, 431),
          top: settle(t, start, 411, 347),
          width: settle(t, start, 332, 339),
          height: 55,
          scale: 1 + 0.06 * bump(t, relay[6], 0.45),
          borderRadius: glide(
            t,
            [start, start + 0.25, start + 0.6],
            [10, 28, 12],
          ),
          background: "linear-gradient(#f0f3fa,#dce4f1)",
          boxShadow: "0 12px 38px rgba(192,205,237,.15)",
        }}
      >
        <div style={{ position: "absolute", left: 74, top: 0 }}>
          <FluidLabel
            before={
              startShape < 1 ? "Start translation" : "Start with saved area"
            }
            after={
              startShape < 1 ? "Start with saved area" : "使用已保存区域开始"
            }
            progress={startShape < 1 ? startShape : swap(relay[6])}
            width={260}
            height={55}
            size={17}
            weight={600}
            color="#11151d"
          />
        </div>
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          style={{ position: "absolute", left: 48, top: 19 }}
        >
          <path d="M2 1L13 9 2 17Z" fill="#11151d" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 483,
          fontSize: 15,
          color: "#8da5c6",
          opacity: gone(clear),
          scale: 1 - reveal(t, clear, clear + 0.35),
        }}
      >
        <span style={{ color: "#52d5aa" }}>●</span> Engine ready · Local
        processing
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 55,
          width: 850,
          borderTop: "1px solid #292d36",
          background: "#0c1016",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {["Home", "Subtitle style", "Settings"].map((s, i) => {
          const at = relay[7 + i];
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                height: 40,
                width: glide(
                  t,
                  [at, at + 0.4],
                  [i === 1 ? 148 : 108, i === 1 ? 122 : 90],
                ),
                borderRadius: 11,
                background: i === 0 ? "#272b33" : "transparent",
                paddingLeft: 12,
                transform: pop(at),
              }}
            >
              <span style={{ fontSize: 20, color: "#aab6ca", width: 26 }}>
                {["⌂", "▱", "⚙"][i]}
              </span>
              <FluidLabel
                before={s}
                after={["首页", "字幕样式", "设置"][i]}
                progress={swap(at)}
                width={i === 1 ? 122 : 78}
                height={40}
                size={16}
              />
            </div>
          );
        })}
      </div>
      <Cursor
        x={glide(t, [cue.brand + 0.3, cue.click - 0.15], [720, 262])}
        y={glide(t, [cue.brand + 0.3, cue.click - 0.15], [470, 380])}
        scale={1 - 0.15 * bump(t, cue.click, 0.3)}
        opacity={
          reveal(t, cue.brand + 0.3, cue.brand + 0.6) *
          (1 - reveal(t, cue.click + 0.1, cue.click + 0.35))
        }
        size={22}
      />
    </div>
  );
};
