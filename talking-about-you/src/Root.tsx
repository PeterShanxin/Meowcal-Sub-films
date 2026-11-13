import React from "react";
import { Composition, Still } from "remotion";
import { Film, Silent } from "./Film";
import { POSTER, Poster } from "./Poster";
import { SceneSheet } from "./SceneSheet";
import { FPS, H, T, W } from "./timeline";

export const Root: React.FC = () => (
  <>
    <Composition id="TalkingAboutYou" component={Film} durationInFrames={T.duration} fps={FPS} width={W} height={H} />
    <Composition id="TalkingAboutYouSilent" component={Silent} durationInFrames={T.duration} fps={FPS} width={W} height={H} />
    <Still id="TalkingAboutYouPoster" component={Poster} width={POSTER.w} height={POSTER.h} />
    <Composition id="SceneSheet" component={SceneSheet} durationInFrames={5000} fps={FPS} width={W} height={H} />
  </>
);
