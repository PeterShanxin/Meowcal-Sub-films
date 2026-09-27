"""Original animatic score; both edits take cut and action cues from timeline.json."""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
TL = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['catPlanet']
SR = 48000
RNG = np.random.default_rng(2726)


def pluck(midi, duration=.65):
    t = np.arange(round(SR * duration)) / SR
    freq = 440 * 2 ** ((midi - 69) / 12)
    tone = np.sin(2*np.pi*freq*t) + .26*np.sin(2*np.pi*freq*2*t) + .09*np.sin(2*np.pi*freq*3*t)
    return tone * np.exp(-t*6) * np.minimum(t/.004, 1)


def write(path, buf):
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes((np.clip(buf, -1, 1).T * 32767).astype('<i2').tobytes())


def score(edit, seconds):
    buf = np.zeros((2, seconds*SR))
    def add(frame, sound, gain=.1, pan=0):
        offset=round(frame / TL['fps'] * SR)
        end=min(offset+len(sound),buf.shape[1])
        if end<=offset:return
        angle=(pan+1)*np.pi/4
        buf[:,offset:end] += np.array([[np.cos(angle)],[np.sin(angle)]]) * sound[:end-offset] * gain

    shots=TL[edit]
    cues=TL['audio'][edit]
    beat=60/TL['bpm']*TL['fps']
    conflict=next(s['from'] for s in shots if s['kind']=='watch')
    magic=next(s['from'] for s in shots if s['kind']=='magic')
    brand=next(s['from'] for s in shots if s['kind']=='end')
    roots=[50,46,53,48]
    for step,frame in enumerate(np.arange(0,seconds*60,beat/2)):
        if frame>brand+50:continue
        root=roots[(step//16)%4]
        tension=conflict<=frame<magic
        note=root+[12,19,24,26,19,24,28,19][step%8]
        if tension and step%8==6:note+=1
        add(frame,pluck(note),.12 if tension else .17,(-.3,.3)[step%2])
        if step%2==0:
            t=np.arange(int(SR*.16))/SR
            drum=np.sin(2*np.pi*(60*t+3*(1-np.exp(-t*30))))*np.exp(-t*26)
            add(frame,drum,.1)
        if step%4==2:
            t=np.arange(int(SR*.05))/SR
            add(frame,RNG.normal(size=len(t))*np.exp(-t*100),.022,.2)
        if step%8==0:
            for n in [root,root+7,root+(15 if tension else 16)]:add(frame,pluck(n,2.2),.11)
    for shot in shots:
        add(shot['from'],pluck(81,.2),.065,(-.4,.4)[int(shot['from']/30)%2])
    for name,frame in cues.items():
        if name in ('press','release'):
            t=np.arange(int(SR*.035))/SR
            add(frame,RNG.normal(size=len(t))*np.exp(-t*180),.06,-.2 if name=='press' else .2)
        elif name=='scan':
            for i,n in enumerate([74,77,79,81]):add(frame+i*6,pluck(n,.13),.065,-.5+i*.33)
        elif name=='swat':
            t=np.arange(int(SR*.22))/SR
            add(frame,RNG.normal(size=len(t))*np.sin(np.pi*t/.22)**2*.2,.11,.35)
            add(frame+10,pluck(86,.25),.15,.6)
        elif name in ('drop','logo'):
            for i,n in enumerate([50,62,66,69,74,81]):add(frame+i*2,pluck(n,2.8),.21)
    # Short stereo delays give the plucks space without obscuring the action clicks.
    for delay,gain in [(int(SR*.12),.13),(int(SR*.23),.07)]:
        buf[0,delay:] += buf[1,:-delay]*gain
    buf[:,:int(SR*.03)] *= np.linspace(0,1,int(SR*.03))
    buf[:,-int(SR*.5):] *= np.linspace(1,0,int(SR*.5))
    buf*=.8/max(np.max(np.abs(buf)),.001)
    folder=ROOT/'public/audio'
    folder.mkdir(exist_ok=True)
    raw=folder/f'cat-planet-{seconds}-raw.wav'
    output=folder/f'cat-planet-{seconds}.wav'
    write(raw,buf)
    base=['ffmpeg','-hide_banner','-y','-i',str(raw)]
    stats=subprocess.run(base+['-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
    data=json.loads(stats[stats.rfind('{'):stats.rfind('}')+1])
    filt=f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={data['input_i']}:measured_TP={data['input_tp']}:measured_LRA={data['input_lra']}:measured_thresh={data['input_thresh']}:offset={data['target_offset']}:linear=true:print_format=json"
    report=subprocess.run(base+['-af',filt,'-ar','48000','-c:a','pcm_s24le',str(output)],capture_output=True,text=True,check=True).stderr
    (ROOT/'out/story'/f'audio-{seconds}.json').write_text(report[report.rfind('{'):report.rfind('}')+1],encoding='utf-8')
    raw.unlink()
    print(output)


if __name__=='__main__':
    (ROOT/'out/story').mkdir(parents=True,exist_ok=True)
    score('landscape',60)
    score('vertical',30)
