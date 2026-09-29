import React from "react";
import { Composition } from "remotion";
import { LaunchFilm } from "./LaunchFilm";
import { StoryFilm } from "./story/StoryFilm";
import { TVStoryStudy } from "./story-tv/TVStoryStudy";
import { StyleStudy } from "./story-tv/styles/StyleStudy";
import { PixelFilm } from "./pixel-film/PixelFilm";
import { FinalBrand } from "./pixel-film/BrandReveal";
import { T } from "./film/timeline";
import { DramaFilm } from "./drama-film/DramaFilm";

export const Root: React.FC = () => (
  <>
    <Composition id="CatDrama60" component={DramaFilm} defaultProps={{cut: 'full' as const, locale: 'zh' as const}} durationInFrames={3600} fps={60} width={1920} height={1080} />
    <Composition id="CatDrama60Vertical" component={DramaFilm} defaultProps={{cut: 'full' as const, locale: 'zh' as const}} durationInFrames={3600} fps={60} width={1080} height={1920} />
    <Composition id="CatDrama30Vertical" component={DramaFilm} defaultProps={{cut: 'short' as const, locale: 'zh' as const}} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="CatDrama30" component={DramaFilm} defaultProps={{cut: 'short' as const, locale: 'zh' as const}} durationInFrames={1800} fps={60} width={1920} height={1080} />
    <Composition id="DramaBrandLandscape" component={FinalBrand} defaultProps={{locale: 'zh' as const}} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="DramaBrandVertical" component={FinalBrand} defaultProps={{locale: 'zh' as const}} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="PixelStory60" component={PixelFilm} durationInFrames={3600} fps={60} width={1920} height={1080} />
    <Composition id="PixelStory30Vertical" component={PixelFilm} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="PixelBrandLandscape" component={FinalBrand} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="PixelBrandVertical" component={FinalBrand} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="TVStylePixel12" component={StyleStudy} defaultProps={{style:'pixel' as const}} durationInFrames={T.styleStudy.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="TVStyleCeramic12" component={StyleStudy} defaultProps={{style:'ceramic' as const}} durationInFrames={T.styleStudy.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="TVStoryStudy12" component={TVStoryStudy} durationInFrames={T.tvStudy.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="CatPlanetStory60" component={StoryFilm} durationInFrames={3600} fps={60} width={1920} height={1080} />
    <Composition id="CatPlanetStory30Vertical" component={StoryFilm} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="LaunchFilm" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1920} height={1080} />
    <Composition id="LaunchFilmVertical" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1920} />
    <Composition id="LaunchFilmSquare" component={LaunchFilm} durationInFrames={T.duration} fps={T.fps} width={1080} height={1080} />
  </>
);
