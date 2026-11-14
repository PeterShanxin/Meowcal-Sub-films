import React from "react";
import { AbsoluteFill, interpolateColors } from "remotion";
import { cue } from "./cues";
import { impact, ink } from "./motion";

// Ink ground with a soft lavender bloom that answers the musical accents.
export const Atmosphere: React.FC<{ time: number }> = ({ time: t }) => (
  <AbsoluteFill
    style={{
      background: interpolateColors(
        t,
        [cue.toLogo, cue.cat, cue.mark, cue.nameIntro],
        [ink, "#15121f", "#15121f", ink],
      ),
    }}
  >
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 50% 45% at 50% 55%,rgba(182,167,223,.16),transparent 70%)",
        opacity: 0.35 + 0.65 * Math.min(1, impact(t)),
      }}
    />
  </AbsoluteFill>
);
