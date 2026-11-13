"""Render the film's sparse acoustic score from pinned CC0 recordings."""
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import quote
import hashlib
import json
import os
import shutil
import subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / 'audio/samples'
OUT = ROOT / 'public/audio'
REV = '440300901dfe9275fd84e0b7763af1f8443ae62e'
BASE = f'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{REV}/'
SOURCES = {
    'piano': ('Keys/Upright Piano/Player_dyn1_rr1_020.wav', 61),
    'cello': ('Strings/Cello Section/pizzT/pizzT_B1_v1_RR1.wav', 47),
    'clave': ('Percussion/Claves1_Hit_v1_rr1_Sum.wav', 60),
}
RATE = 48000
DURATION = 21.6


def download():
    SAMPLES.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for name, (path, midi) in SOURCES.items():
        dest = SAMPLES / f'{name}.wav'
        url = BASE + quote(path)
        if not dest.exists():
            dest.write_bytes(urlopen(Request(url, headers={'User-Agent':'Meowcal-film'}), timeout=60).read())
        manifest.append({'file':dest.name, 'url':url, 'root_midi':midi,
                         'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(), 'license':'CC0-1.0'})
    (SAMPLES / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    if not (SAMPLES / 'LICENSE.txt').exists():
        (SAMPLES / 'LICENSE.txt').write_bytes(urlopen(BASE+'LICENSE', timeout=60).read())


def read_sample(name):
    rate, data = wavfile.read(SAMPLES / f'{name}.wav')
    data = data.astype(float) / np.iinfo(data.dtype).max if data.dtype.kind == 'i' else data.astype(float)
    if data.ndim > 1:
        data = data.mean(axis=1)
    data = resample_poly(data, RATE, rate)
    # Align the recorded onset, rather than the file's leading silence.
    active = np.flatnonzero(np.abs(data) > max(.001, np.max(np.abs(data))*.012))
    if len(active):
        data = data[max(0, active[0]-96):]
    return data / max(.01, np.max(np.abs(data)))


def main():
    download()
    (ROOT / 'out').mkdir(parents=True, exist_ok=True)
    samples = {name:read_sample(name) for name in SOURCES}
    mix = np.zeros((round(DURATION*RATE), 2))
    events = []

    def note(name, at, midi, gain=.13, length=1.5, pan=0):
        ratio = 2**((midi-SOURCES[name][1])/12)
        data = samples[name]
        positions = np.arange(0, len(data)-1, ratio)
        shifted = np.interp(positions, np.arange(len(data)), data)[:round(length*RATE)]
        env = np.ones(len(shifted))
        fade = min(round(.08*RATE), len(shifted)//3)
        env[-fade:] = np.linspace(1,0,fade)
        env[:96] *= np.linspace(0,1,96)
        shifted *= env*gain
        start = round(at*RATE)
        length_out = min(len(shifted), len(mix)-start)
        if length_out <= 0:
            return
        stereo = np.array([np.cos((pan+1)*np.pi/4), np.sin((pan+1)*np.pi/4)])
        mix[start:start+length_out] += shifted[:length_out,None]*stereo
        events.append({'instrument':name,'seconds':at,'frame':round(at*60),'midi':midi})

    # An intimate, interrupted phrase; the paper test becomes dry pizzicato.
    note('cello',0,38,.26,2.0,-.14)
    for at,midi in [(0,57),(.10,62),(.20,65),(.85,64),(1.45,62)]:
        note('piano',at,midi,.14,2.1,.12)
    for at,midi in [(2.05,45),(2.82,47),(3.13,48),(3.45,45),(4.0,50),(4.65,49),(5.55,38)]:
        note('cello',at,midi,.26,.50,-.1)
    for at in [2.05,4.0,5.55,7.3,8.05]:
        note('clave',at,52,.11,.20,.12)
    # Leave the reveal unscored: a deliberate gap makes the line land.
    note('cello',9.1,38,.18,.9,-.1)
    note('piano',10.95,58,.13,.65,.1)
    note('piano',11.07,61,.11,.7,.1)
    # Warm, low-register piano and a walking cello after the misunderstanding.
    for at,midi in [(12.1,38),(12.85,45),(13.6,48),(14.4,41),(15.15,48),(15.9,45),
                    (16.65,43),(17.4,38),(18.15,45),(18.9,50)]:
        note('cello',at,midi,.21,1.1,-.15)
    for at,chord in [(12.1,[53,57,62]),(13.6,[52,55,60]),(14.4,[53,57,60]),
                     (15.9,[55,58,62]),(17.4,[50,57,62]),(18.9,[53,57,62])]:
        for i,midi in enumerate(chord):
            note('piano',at+i*.045,midi,.115,2.3,.12)
    # Close with an acoustic decay, no logo chime.
    tail = round(.7*RATE)
    mix[-tail:] *= np.linspace(1,0,tail)[:,None]
    wavfile.write(OUT/'unmastered.wav',RATE,mix.astype(np.float32))
    (ROOT/'audio/cues.json').write_text(json.dumps(events,indent=2)+'\n',encoding='utf-8')
    ffmpeg = shutil.which('ffmpeg') or os.environ.get('FFMPEG')
    if not ffmpeg:
        raise RuntimeError('FFmpeg must be on PATH, or set FFMPEG to its executable.')
    base=[ffmpeg,'-hide_banner','-y','-i',str(OUT/'unmastered.wav')]
    first=subprocess.run(base+['-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    stats,_=json.JSONDecoder().raw_decode(first.stderr[first.stderr.rfind('{'):])
    filt=(f"loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={stats['input_i']}:"
          f"measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:"
          f"measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true:print_format=json")
    second=subprocess.run(base+['-af',filt,'-ar','48000','-c:a','pcm_s24le',str(OUT/'master.wav')],capture_output=True,text=True,check=True)
    (ROOT/'out/audio-mastering.txt').write_text(second.stderr,encoding='utf-8')
    print('Mastered audio:',OUT/'master.wav')


if __name__ == '__main__':
    main()
