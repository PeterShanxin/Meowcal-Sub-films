import React from "react";
import { Composition } from "remotion";
import { LaunchFilm } from "./LaunchFilm";
import { StoryFilm } from "./story/StoryFilm";
import { T } from "./film/timeline";

// One film, laid out from the frame size: add an aspect ratio by adding a
// Composition here, the geometry adapts in film/layout.ts.
export const Root: React.FC = () => (
  <>
    <Composition id="CatPlanetStory60" component={StoryFilm} durationInFrames={3600} fps={60} width={1920} height={1080} />
    <Composition id="CatPlanetStory30Vertical" component={StoryFilm} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="LaunchFilm" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="LaunchFilmVertical" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1920} />
    <Composition id="LaunchFilmSquare" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1080} />
  </>
);
