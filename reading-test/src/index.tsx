import {AbsoluteFill, Audio, Composition, Folder, registerRoot, Series, staticFile, Still, useVideoConfig} from 'remotion';
import {Exam} from './Exam';
import {Reveal} from './Reveal';
import {Brand,Cover,Payoff} from './Closing';

const Film=()=>{
  const {fps}=useVideoConfig();
  return <AbsoluteFill>
    <Series>
      <Series.Sequence name="看剧变成选择题" durationInFrames={6*fps} premountFor={fps}><Exam/></Series.Sequence>
      <Series.Sequence name="框选与揭晓" durationInFrames={8.4*fps} premountFor={fps}><Reveal/></Series.Sequence>
      <Series.Sequence name="不用做题" durationInFrames={3*fps} premountFor={fps}><Payoff/></Series.Sequence>
      <Series.Sequence name="Meowcal Sub" durationInFrames={4.2*fps} premountFor={fps}><Brand/></Series.Sequence>
    </Series>
    <Audio src={staticFile('audio/master.wav')}/>
  </AbsoluteFill>;
};
const Root=()=> <>
  <Composition id="ReadingTest" component={Film} width={1080} height={1920} fps={60} durationInFrames={1296}/>
  <Still id="ReadingTestCover" component={Cover} width={1080} height={1440}/>
  <Folder name="Scenes">
    <Composition id="Exam" component={Exam} width={1080} height={1920} fps={60} durationInFrames={360}/>
    <Composition id="Reveal" component={Reveal} width={1080} height={1920} fps={60} durationInFrames={504}/>
    <Composition id="Payoff" component={Payoff} width={1080} height={1920} fps={60} durationInFrames={180}/>
    <Composition id="Brand" component={Brand} width={1080} height={1920} fps={60} durationInFrames={252}/>
  </Folder>
</>;
registerRoot(Root);
