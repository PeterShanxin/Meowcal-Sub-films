import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Brand } from "./film/Brand";
import { camera, project, worldTransform } from "./film/camera";
import { Capture } from "./film/Capture";
import { Footage, OVERSCAN } from "./film/Footage";
import { Pill } from "./film/Hud";
import { layout, type Layout } from "./film/layout";
import { ease, sp, tween } from "./film/motion";
import { LayerLabel, RecognizedText, Statement, payoffVisibility } from "./film/Payoff";
import { Plate } from "./film/Plate";
import { sceneAt, whipLength } from "./film/scenes";
import { C } from "./film/theme";
import { T } from "./film/timeline";

const Z_OCR = 360;
const Z_PLATE = 720;

const Plane: React.FC<{ z: number; children: React.ReactNode }> = ({ z, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
    {children}
  </div>
);

function whipProgress(f: number, start: number): number {
  const length = whipLength(start);
  return tween(f, [start, start + length], [0, 1], ease.inOut);
}

// The two pieces of footage on screen at frame f: the current scene whipping
// in from the right and, during a cut, the previous one leaving.
const Screen: React.FC<{ f: number; L: Layout }> = ({ f, L }) => {
  const at = sceneAt(f);
  const distance = L.W * (1 + OVERSCAN);
  const cutting = at.sceneStart > 0 && f < at.sceneStart + whipLength(at.sceneStart);
  const p = cutting ? whipProgress(f, at.sceneStart) : 1;
  const crop = tween(f, [T.payoff.start + 6, T.payoff.start + 40], [0, 1], ease.inOut);
  return (
    <>
      {cutting && at.previous ? (
        <Footage
          scene={at.previous.scene}
          line={at.previous.line}
          L={L}
          age={f - at.previous.start}
          offsetX={-distance * p}
          blurId="whip"
        />
      ) : null}
      <Footage
        scene={at.scene}
        line={at.line}
        L={L}
        age={f - at.sceneStart}
        offsetX={distance * (1 - p)}
        blurId={cutting ? "whip" : undefined}
        crop={crop}
      />
    </>
  );
};

export const LaunchFilm: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = useMemo(() => layout(width, height), [width, height]);
  const { u } = L;
  const cam = camera(f, L);

  const at = sceneAt(f);
  const cutting = at.sceneStart > 0 && f < at.sceneStart + whipLength(at.sceneStart);
  const whipVelocity = cutting
    ? (whipProgress(f + 0.5, at.sceneStart) - whipProgress(f - 0.5, at.sceneStart)) * L.W * (1 + OVERSCAN)
    : 0;
  const whipBlur = Math.min(70 * u, whipVelocity * 0.14);

  const separate = 1 - sp(f, T.payoff.collapse, { damping: 22, stiffness: 150 });
  const zOcr = sp(f, T.payoff.start + 10, { damping: 16, stiffness: 80 }) * separate * Z_OCR * u;
  const zPlate = sp(f, T.payoff.start + 18, { damping: 16, stiffness: 80 }) * separate * Z_PLATE * u;
  const payoff = payoffVisibility(f);
  const toObsidian = tween(f, [T.payoff.collapse + 2, T.payoff.flat], [0, 1], ease.inOut);
  const flash =
    0.22 * (1 - tween(f, [T.payoff.start, T.payoff.start + 12], [0, 1], ease.out)) * (f >= T.payoff.start ? 1 : 0) +
    0.035 * (1 - tween(f, [T.brand.hit, T.brand.hit + 10], [0, 1], ease.out)) * (f >= T.brand.hit ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="whip" x="-10%" y="0" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${whipBlur} 0`} />
        </filter>
      </svg>

      <AbsoluteFill style={{ filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: L.W,
            height: L.H,
            transformOrigin: "0 0",
            transform: worldTransform(cam, L),
            transformStyle: "preserve-3d",
          }}
        >
          <Plane z={0}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 22 * u,
                boxShadow: `0 ${50 * u}px ${140 * u}px rgba(0,0,0,${0.7 * payoff})`,
              }}
            />
            <Screen f={f} L={L} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 22 * u,
                border: `${2 * u}px solid rgba(255,255,255,${0.2 * payoff})`,
                boxSizing: "border-box",
              }}
            />
            <div style={{ position: "absolute", inset: -L.W, background: C.bg, opacity: toObsidian }} />
          </Plane>
          <Plane z={zOcr}>
            <RecognizedText f={f} L={L} />
            <Capture f={f} L={L} opacity={f < T.brand.hit ? 1 : 0} />
          </Plane>
          <Plane z={zPlate}>
            <Plate f={f} L={L} />
          </Plane>
        </div>
      </AbsoluteFill>

      <LayerLabel f={f} L={L} start={T.payoff.labels[0]} text="Your screen" at={project(cam, L, 0, 0, 0)} />
      <LayerLabel f={f} L={L} start={T.payoff.labels[1]} text="Windows OCR" at={project(cam, L, L.box.x, L.box.y - 60 * u, zOcr)} />
      <LayerLabel
        f={f}
        L={L}
        start={T.payoff.labels[2]}
        text="Local AI translation"
        at={project(cam, L, L.plate.x, L.plate.y - 10 * u, zPlate)}
      />
      <Pill f={f} L={L} />
      <Statement f={f} L={L} />
      <Brand f={f} L={L} />

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(`scenes/grain-${f % 6}.png`)})`,
          backgroundSize: `${512 * u}px ${512 * u}px`,
          mixBlendMode: "overlay",
          opacity: 0.09,
        }}
      />
      {flash > 0.002 ? <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} /> : null}
      <Audio src={staticFile("audio/soundtrack.wav")} />
    </AbsoluteFill>
  );
};
