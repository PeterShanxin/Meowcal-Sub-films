import { Composition } from "remotion";
import { Film } from "./Film";
import "./index.css";
export const RemotionRoot = () => (
  <>
    <Composition
      id="MeowcalReveal"
      component={Film}
      durationInFrames={900}
      fps={60}
      width={1920}
      height={1080}
    />
    <Composition
      id="MeowcalPortrait"
      component={Film}
      durationInFrames={900}
      fps={60}
      width={1080}
      height={1920}
    />
    <Composition
      id="MeowcalSquare"
      component={Film}
      durationInFrames={900}
      fps={60}
      width={1080}
      height={1080}
    />
  </>
);
