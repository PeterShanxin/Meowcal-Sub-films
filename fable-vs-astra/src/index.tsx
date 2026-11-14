import React from "react";
import { AbsoluteFill, Composition, Freeze, Img, OffthreadVideo, registerRoot, staticFile, Still } from "remotion";
import { Film } from "./Film";
import { C, cues, FONT } from "./data";

const Card: React.FC<{ src: string; at: number; x: number; y: number; w: number; rot: number; name: string; logo: string; accent: string; tag: string; tagRot: number }> = ({
  src, at, x, y, w, rot, name, logo, accent, tag, tagRot,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, rotate: `${rot}deg` }}>
    <div style={{ width: w, height: (w * 16) / 9, borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 80px #000e", outline: `5px solid ${accent}` }}>
      <Freeze frame={at}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Freeze>
    </div>
    <div style={{ position: "absolute", left: "50%", top: -30, translate: "-50% 0", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap",
      background: C.raised, border: `3px solid ${accent}`, borderRadius: 40, padding: "10px 26px 10px 18px", boxShadow: "0 10px 30px #000a" }}>
      <Img src={staticFile(logo)} style={{ width: 48, height: 48 }} />
      <span style={{ fontSize: 44, fontWeight: 800, color: C.text1 }}>{name}</span>
    </div>
    <div style={{ position: "absolute", left: "50%", bottom: 40, translate: "-50% 0", rotate: `${tagRot}deg`, whiteSpace: "nowrap",
      background: "#fff", color: "#11131a", fontSize: 50, fontWeight: 900, padding: "8px 28px", borderRadius: 14, boxShadow: "0 12px 30px #000c" }}>
      {tag}
    </div>
  </div>
);

const outline = (shadow: string): React.CSSProperties => ({ color: C.text1, textShadow: `10px 10px 0 ${shadow}` });

const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(110% 60% at 50% 62%, #1a2132 0%, ${C.bg} 72%)`, fontFamily: FONT, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 64, top: 64, fontSize: 56, fontWeight: 800, color: C.text2, letterSpacing: -0.5 }}>同一条宣传片，交给两个 AI</div>
    <div style={{ position: "absolute", left: 56, top: 140, fontSize: 200, fontWeight: 900, letterSpacing: -6, lineHeight: 1.08, ...outline("#7d6fb8") }}>
      让它俩<br />打一架！
    </div>
    <Card src={cues.astraClip.file} at={cues.astraClip.still} x={84} y={650} w={360} rot={-4} name={cues.chats.astra.name} logo={cues.chats.astra.logo}
      accent={cues.chats.astra.accent} tag="一次过" tagRot={-6} />
    <Card src={cues.v4.file} at={cues.v4.still} x={636} y={668} w={360} rot={4} name={cues.chats.fable.name} logo={cues.chats.fable.logo}
      accent={cues.chats.fable.accent} tag="改了好几轮" tagRot={5} />
    <div style={{ position: "absolute", left: 540, top: 990, translate: "-50% -50%", fontSize: 110, fontWeight: 900, fontStyle: "italic", ...outline(C.pass) }}>VS</div>
    <div style={{ position: "absolute", right: 56, top: 250, rotate: "7deg", background: "#ffd84a", color: "#11131a", fontSize: 62, fontWeight: 900,
      padding: "14px 34px", borderRadius: 18, boxShadow: "0 14px 34px #000c" }}>你选哪边？</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <Img src={staticFile("mark.svg")} style={{ width: 60, height: 60 }} />
      <div style={{ fontSize: 40, fontWeight: 800, color: C.text1 }}>{cues.copy.brand}</div>
    </div>
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <>
    <Composition id="FableVsAstra" component={Film} width={1080} height={1920} fps={cues.fps} durationInFrames={cues.total} />
    <Still id="FableVsAstraCover" component={Cover} width={1080} height={1440} />
  </>
);

registerRoot(Root);
