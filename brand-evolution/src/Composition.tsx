import {
  AbsoluteFill,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Html5Audio,
} from "remotion";
import { Atmosphere } from "./Atmosphere";
import { CardRig } from "./CardRig";
import { Copy } from "./Copy";
import { cue } from "./cues";
import { font, glide, impact, ivory } from "./motion";
import { BrandFont } from "./BrandFont";
export const Evolution = () => {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps;
  return (
    <AbsoluteFill
      style={{ fontFamily: font, color: ivory, overflow: "hidden" }}
    >
      <BrandFont />
      <Sequence name="Ink to violet field" premountFor={fps}>
        <Atmosphere time={time} />
      </Sequence>
      {/* The frame leans in on accented downbeats and during the end card. */}
      <AbsoluteFill
        style={{
          scale:
            1 + 0.008 * impact(time) + glide(time, [cue.final, 32], [0, 0.015]),
        }}
      >
        <Sequence
          name="Shape morph · old layout · Chinese interface · mark"
          premountFor={fps}
        >
          <CardRig time={time} />
        </Sequence>
        <Sequence name="Launch typography · 妙影 sparkle" premountFor={fps}>
          <Copy time={time} />
        </Sequence>
      </AbsoluteFill>
      <Sequence name="Small Wonder · soundtrack" premountFor={fps}>
        <Html5Audio
          name="Small Wonder · 120 BPM acoustic score"
          src={staticFile("evolution-groove.mp3")}
          volume={1}
          // If the player ever waits for media, the music waits too instead
          // of running ahead and being pulled back.
          pauseWhenBuffering
        />
      </Sequence>
    </AbsoluteFill>
  );
};
export const MyComposition = () => (
  <Composition
    id="MeowcalEvolution"
    component={Evolution}
    durationInFrames={1920}
    fps={60}
    width={1920}
    height={1080}
  />
);
