import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { cue, FPS } from "./clock";
import { Capture, Cursor, Flights, Headlines, Lockups, Plate, Scrubber } from "./Overlay";
import { Picture } from "./Picture";
import { Rig } from "./Rig";
import { Construct } from "./Construct";
import { C, FontGate } from "./theme";

/** 好字幕，自动上屏。 A cold open cut on Red's beats, a horror cut, then one
 * take over one scene of Sintel. */
export const Film: React.FC<{ silent?: boolean }> = ({ silent }) => {
  const t = useCurrentFrame() / FPS;
  // Only the cold open's cuts jolt the frame on the drum hit. From Sintel on
  // the UI moves for its own reasons; the frame no longer shakes to the beat.
  const kick = (at: number, length: number) => {
    const u = (t - at) / length;
    return u < 0 || u >= 1 ? 0 : Math.pow(1 - u, 3);
  };
  // The cut to the rider is a zoom-through (Picture), so it does not jolt.
  const cuts = [...Object.values(cue.cuts).filter((at) => at !== cue.cuts.rider), ...cue.punch, cue.sintel];
  const push = cuts.reduce((sum, at) => sum + 3.2 * kick(at, 0.3), 0);
  const flare = cuts.reduce((sum, at) => sum + kick(at, 0.18), 0);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <FontGate>
        <AbsoluteFill style={{ scale: 1 + 0.012 * push, filter: flare > 0.01 ? `brightness(${1 + 0.35 * flare})` : undefined }}>
          <Picture t={t} />
          <Capture t={t} />
          <Scrubber t={t} />
          <Plate t={t} />
          <Rig t={t} />
          <Construct t={t} />
          <Flights t={t} />
          <Headlines t={t} />
          <Lockups t={t} />
          <Cursor t={t} />
        </AbsoluteFill>
      </FontGate>
      {!silent && <Audio src={staticFile("audio/mix.wav")} />}
    </AbsoluteFill>
  );
};
