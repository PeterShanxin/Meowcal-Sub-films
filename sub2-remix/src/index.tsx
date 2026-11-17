import React from "react";
import { Composition, registerRoot, Still } from "remotion";
import { FPS, H, SECONDS, W } from "./clock";
import { Cover } from "./Cover";
import { Film } from "./Film";

const Root: React.FC = () => (
  <>
    <Composition id="Sub2Remix" component={Film} width={W} height={H} fps={FPS} durationInFrames={SECONDS * FPS} />
    <Composition id="Sub2RemixSilent" component={Film} defaultProps={{ silent: true }} width={W} height={H} fps={FPS} durationInFrames={SECONDS * FPS} />
    <Still id="Sub2RemixCover" component={Cover} width={1080} height={1440} />
  </>
);

registerRoot(Root);
