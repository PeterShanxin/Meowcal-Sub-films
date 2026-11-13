import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grain } from "./Film";
import { SCENES } from "./scenes";

// Review only: frame 1000 * n + t shows scene n at time t.
export const SceneSheet: React.FC = () => {
  const f = useCurrentFrame();
  const Scene = SCENES[Math.min(SCENES.length - 1, Math.floor(f / 1000))];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Scene t={f % 1000} />
      <Grain f={f} />
    </AbsoluteFill>
  );
};
