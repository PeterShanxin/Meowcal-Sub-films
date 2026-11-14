import React from "react";
import { interpolateColors } from "remotion";
import { Interface, selectButton } from "./Interface";
import { Viewing } from "./Viewing";
import { LogoMorph } from "./LogoMorph";
import { cue } from "./cues";
import { interfaceHeight, interfaceWidth, surface } from "./choreography";
import { glide, ink, lavender, reveal } from "./motion";

export const CardRig: React.FC<{ time: number }> = ({ time: t }) => {
  const s = surface(t),
    k = s.w / interfaceWidth;
  // The footage opens out of 选择字幕区域 instead of cross-fading in.
  const open = glide(t, [cue.click + 0.05, cue.video - 0.2], [0, 1]);
  const portal = {
    left: selectButton.left * k * (1 - open),
    top: selectButton.top * k * (1 - open),
    width: selectButton.width * k + (s.w - selectButton.width * k) * open,
    height: selectButton.height * k + (s.h - selectButton.height * k) * open,
    radius: 12 * k + (s.radius - 12 * k) * open,
  };
  const cover = Math.max(s.w / 1200, s.h / 675);
  const footage = (
    <div
      style={{
        position: "absolute",
        left: (s.w - 1200 * cover) / 2,
        top: (s.h - 675 * cover) / 2,
        transform: `scale(${cover})`,
        transformOrigin: "0 0",
      }}
    >
      <Viewing time={t} />
    </div>
  );
  const iconTile = reveal(t, cue.cat - 0.35, cue.cat);
  return (
    <div
      style={{
        position: "absolute",
        left: s.x,
        top: s.y,
        width: s.w,
        height: s.h,
        translate: "-50% -50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: s.radius,
          background: interpolateColors(
            t,
            [cue.launch + 0.2, cue.window - 0.3],
            [lavender, ink],
          ),
          outline: `1.5px solid ${interpolateColors(t, [cue.launch + 0.2, cue.window - 0.3], ["rgba(65,70,84,0)", "#414654"])}`,
          outlineOffset: -0.75,
          overflow: "hidden",
          opacity: 1 - iconTile,
        }}
      >
        <div
          style={{
            opacity: reveal(t, cue.window - 0.45, cue.window),
            transform: `scale(${k})`,
            transformOrigin: "0 0",
          }}
        >
          <Interface time={t} height={interfaceHeight(t)} />
        </div>
        {/* Mounted from the first frame so the footage has loaded long before
            13 s; a mid-film load pauses the player and knocks the music back. */}
        <div
          style={{
            position: "absolute",
            left: portal.left,
            top: portal.top,
            width: portal.width,
            height: portal.height,
            borderRadius: portal.radius,
            overflow: "hidden",
            visibility: t >= cue.click ? "visible" : "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -portal.left,
              top: -portal.top,
              width: s.w,
              height: s.h,
            }}
          >
            {footage}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#e4eaf5",
              opacity: 1 - reveal(t, cue.click + 0.05, cue.click + 0.45),
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#10131b",
            fontSize: 95,
            fontWeight: 650,
            letterSpacing: -2,
            opacity: 1 - reveal(t, cue.launch - 0.1, cue.launch + 0.2),
          }}
        >
          {[..."我们升级啦。"].map((c, i) => {
            const at = cue.pill + 0.12 + i * 0.05;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  // The full-width 。 would otherwise pull the line off-centre.
                  marginRight: c === "。" ? "-0.45em" : 0,
                  opacity: reveal(t, at, at + 0.2),
                  transform: `translateY(${glide(t, [at, at + 0.3], [40, 0])}px) scale(${glide(t, [at, at + 0.2, at + 0.4], [0.6, 1.08, 1])})`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>
      {t >= cue.toLogo && (
        <div style={{ position: "absolute", inset: 0 }}>
          <LogoMorph time={t} />
        </div>
      )}
    </div>
  );
};
