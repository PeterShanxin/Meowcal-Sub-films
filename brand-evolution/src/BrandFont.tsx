import { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

export const BrandFont = () => {
  const [handle] = useState(() => delayRender("Loading Noto Sans SC"));
  useEffect(() => {
    const face = new FontFace(
      "Meowcal Sans",
      `url(${staticFile("fonts/NotoSansSC.ttf")})`,
      { weight: "100 900" },
    );
    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
  return null;
};
