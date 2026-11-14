import React from "react";
import { cue } from "./cues";
import { FluidLabel } from "./FluidLabel";
import { bump, glide, ivory, lavender, reveal } from "./motion";

const Word: React.FC<{
  text: string;
  time: number;
  start: number;
  size: number;
  weight?: number;
}> = ({ text, time, start, size, weight = 700 }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: weight,
      lineHeight: 1.15,
      whiteSpace: "nowrap",
      letterSpacing: -size * 0.045,
    }}
  >
    {[...text].map((c, i) => {
      const p = reveal(time, start + i * 0.045, start + i * 0.045 + 0.4);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: p,
            transform: `translateY(${(1 - p) * size * 0.25}px) scaleY(${0.45 + 0.55 * p})`,
            transformOrigin: "50% 100%",
          }}
        >
          {c}
        </span>
      );
    })}
  </div>
);

const Spark: React.FC<{
  x: number;
  y: number;
  size: number;
  phase: number;
}> = ({ x, y, size, phase }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: Math.sin(Math.PI * phase),
      rotate: `${phase * 50}deg`,
      opacity: phase > 0 && phase < 1 ? 1 : 0,
    }}
  >
    <path
      d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0"
      fill="#fff4ce"
    />
  </svg>
);

// The platform plus where to get the app: GitHub releases and the live Store
// listing (product 9NNK2X23VLWT). Monochrome marks keep one palette.
const liveLabel = "现已登陆";
const channels = [
  {
    name: "Windows",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="9.5" height="9.5" />
        <rect x="12.5" y="2" width="9.5" height="9.5" />
        <rect x="2" y="12.5" width="9.5" height="9.5" />
        <rect x="12.5" y="12.5" width="9.5" height="9.5" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg width="36" height="36" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    ),
  },
  {
    name: "Microsoft Store",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 8V6.5a4 4 0 0 1 8 0V8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="8"
          width="18"
          height="13.5"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        {[
          [8.3, 11.3],
          [12.3, 11.3],
          [8.3, 15.3],
          [12.3, 15.3],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="3.4"
            height="3.4"
            fill="currentColor"
          />
        ))}
      </svg>
    ),
  },
];

// Each heading becomes the next one on its downbeat.
const headings = [
  { at: cue.window, text: "界面焕新。" },
  { at: cue.chinese, text: "中文界面，来了。" },
  { at: cue.video, text: "圈选字幕，继续入戏。" },
  { at: cue.confirm, text: "简单易用，免费开源。" },
  { at: cue.cat, text: "Logo，也焕新。" },
];

const Heading: React.FC<{ time: number }> = ({ time: t }) => {
  const i = headings.filter((h) => t >= h.at).length - 1;
  if (i < 0) return null;
  const { at, text } = headings[i];
  const exit = reveal(t, cue.mark, cue.mark + 0.4);
  return (
    <div
      style={{
        position: "absolute",
        top: 50 - 40 * exit,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        color: ivory,
        opacity: 1 - exit,
        transform: `scale(${1 + 0.05 * bump(t, at, 0.45)})`,
      }}
    >
      {i === 0 ? (
        <Word text={text} time={t} start={at} size={86} />
      ) : (
        <FluidLabel
          before={headings[i - 1].text}
          after={text}
          progress={glide(t, [at, at + 0.45], [0, 1])}
          width={1200}
          height={110}
          size={86}
          weight={700}
          align="middle"
        />
      )}
    </div>
  );
};

export const Copy: React.FC<{ time: number }> = ({ time: t }) => {
  const lockup = glide(t, [cue.lockup, cue.lockup + 0.75], [0, 1]);
  const english = glide(t, [cue.lockup + 0.15, cue.lockup + 0.75], [0, 1]);
  const nameSize = 174 - 74 * lockup;
  const bling = glide(t, [cue.bling, cue.bling + 0.6], [0, 1]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top:
            300 -
            glide(t, [cue.pill, cue.launch], [0, 18]) -
            glide(t, [cue.launch, cue.launch + 0.4], [0, 90]),
          width: "100%",
          textAlign: "center",
          color: ivory,
          opacity: 1 - reveal(t, cue.launch, cue.launch + 0.35),
          filter: `blur(${reveal(t, cue.launch, cue.launch + 0.35) * 12}px)`,
        }}
      >
        <Word text="Hello." time={t} start={cue.hello} size={250} />
      </div>
      <Heading time={t} />
      <div
        style={{
          position: "absolute",
          top: 630,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          color: ivory,
          opacity: 1 - reveal(t, cue.lockup - 0.25, cue.lockup),
        }}
      >
        <Word
          text="中文新名字！"
          time={t}
          start={cue.nameIntro}
          size={50}
          weight={500}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          top: 800 - 100 * lockup,
          translate: "0 -50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            overflow: "hidden",
            maxWidth: 640 * english,
            opacity: english,
            color: ivory,
            fontSize: 100,
            fontWeight: 600,
            letterSpacing: -4,
          }}
        >
          Meowcal Sub
        </span>
        {/* Drawn, because the CJK font's middle dot is full width and off-centre. */}
        <span
          style={{
            display: "inline-flex",
            alignSelf: "center",
            justifyContent: "center",
            width: 76 * english,
            opacity: english,
          }}
        >
          <span
            style={{
              width: 15,
              height: 15,
              borderRadius: 8,
              background: lavender,
            }}
          />
        </span>
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontSize: nameSize,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: 14 * (1 - lockup),
            color: lavender,
            scale: 1 + 0.07 * bump(t, cue.bling, 0.55),
          }}
        >
          {[..."妙影"].map((c, i) => {
            const at = cue.name[i];
            return (
              <span
                key={c}
                style={{
                  display: "inline-block",
                  opacity: reveal(t, at - 0.08, at),
                  transform: `translateY(${glide(t, [at - 0.12, at], [-90, 0])}px) scale(${glide(t, [at, at + 0.1, at + 0.3], [1, 1.1, 1])},${glide(t, [at, at + 0.08, at + 0.3], [1, 0.84, 1])})`,
                  transformOrigin: "50% 100%",
                  textShadow: `0 0 ${40 * bump(t, cue.bling, 0.9)}px rgba(255,244,206,${0.9 * bump(t, cue.bling, 0.9)})`,
                }}
              >
                {c}
              </span>
            );
          })}
          <span
            style={{
              position: "absolute",
              inset: 0,
              letterSpacing: "inherit",
              color: "transparent",
              backgroundImage:
                "linear-gradient(105deg,transparent 36%,#fff8db 47%,white 50%,transparent 61%)",
              backgroundSize: "220% 100%",
              backgroundPosition: `${glide(t, [cue.shine, cue.bling], [170, -70])}% 0`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              opacity:
                reveal(t, cue.shine - 0.05, cue.shine) *
                (1 - reveal(t, cue.bling + 0.1, cue.bling + 0.4)),
            }}
          >
            妙影
          </span>
        </span>
      </div>
      {[
        [1150, 712, 120, 0],
        [790, 748, 64, 0.08],
        [1172, 888, 44, 0.15],
        [1012, 690, 30, 0.22],
      ].map(([x, y, size, delay]) => (
        <Spark
          key={x}
          x={x}
          y={y}
          size={size}
          phase={glide(
            t,
            [cue.bling + delay, cue.bling + delay + 0.55],
            [0, 1],
          )}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 800,
          width: 900,
          height: 420,
          translate: "-50% -50%",
          background:
            "radial-gradient(closest-side,rgba(182,167,223,.35),transparent)",
          opacity: Math.sin(Math.PI * bling),
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 790,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          color: lavender,
        }}
      >
        <Word
          text="换上新意，继续入戏。"
          time={t}
          start={cue.tagline}
          size={52}
          weight={500}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 912,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          color: "#c9c5d8",
          fontSize: 30,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            color: lavender,
            opacity: reveal(t, cue.final, cue.final + 0.35),
          }}
        >
          {liveLabel}
        </span>
        {channels.map(({ name, icon }, i) => {
          const at = cue.final + 0.1 + i * 0.1;
          const p = reveal(t, at, at + 0.35);
          return (
            <React.Fragment key={name}>
              {i > 0 && (
                <span
                  style={{
                    width: 1,
                    height: 30,
                    background: "#3d3a4c",
                    opacity: p,
                  }}
                />
              )}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px) scale(${1 + 0.08 * bump(t, at, 0.4)})`,
                }}
              >
                {icon}
                {name}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};
