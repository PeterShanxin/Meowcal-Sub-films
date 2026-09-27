import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Capture } from "./scenes/Capture";
import { Local } from "./scenes/Local";
import { Payoff } from "./scenes/Payoff";
import { Brand } from "./scenes/Brand";
import { ink, paper } from "./motion";
export const Film = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: ink,
        color: paper,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <Sequence durationInFrames={386} name="Capture and translate">
        <Capture />
      </Sequence>
      <Sequence from={348} durationInFrames={238} name="Your PC">
        <Local />
      </Sequence>
      <Sequence from={552} durationInFrames={266} name="Stay in the story">
        <Payoff />
      </Sequence>
      <Sequence from={780} durationInFrames={120} name="Meowcal Sub">
        <Brand />
      </Sequence>
      <Audio src={staticFile("soundtrack.wav")} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.023,
          backgroundImage: "url(" + staticFile("grain.svg") + ")",
          backgroundPosition: `${(frame % 7) * 71}px ${(frame % 5) * 93}px`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
