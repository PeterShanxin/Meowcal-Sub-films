import React from "react";
import { Composition } from "remotion";
import { LaunchFilm } from "./LaunchFilm";
import { T } from "./film/timeline";

export const Root: React.FC = () => (
  <>
    <Composition id="LaunchFilm" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="LaunchFilmVertical" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1920} />
    <Composition id="LaunchFilmSquare" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1080} />
  </>
);
