"""Inspect the exported media and build a local viewing page and contact sheet."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'out'
VIDEO = OUT / 'meowcal-reading-test-v1.mp4'
FFMPEG = shutil.which('ffmpeg') or os.environ.get('FFMPEG')
FFPROBE = shutil.which('ffprobe') or os.environ.get('FFPROBE')
if not FFMPEG or not FFPROBE:
    raise SystemExit('Put FFmpeg and FFprobe on PATH or set FFMPEG and FFPROBE.')


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


probe = json.loads(run([FFPROBE,'-v','error','-show_format','-show_streams','-of','json',str(VIDEO)]).stdout)
video = next(s for s in probe['streams'] if s['codec_type']=='video')
audio = next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'],video['r_frame_rate']) == (1080,1920,'60/1'), video
assert video['codec_name']=='h264' and video['pix_fmt']=='yuv420p', video
assert video['color_space']=='bt709', video
assert audio['codec_name']=='aac' and audio['sample_rate']=='48000' and audio['channels']==2, audio
assert int(video['nb_frames']) == 1296 and abs(float(video['duration'])-21.6)<1/60, video
# AAC priming and final packet padding can extend the container beyond picture.
assert abs(float(probe['format']['duration'])-21.6)<.08, probe['format']
decoded = run([FFMPEG,'-v','error','-i',str(VIDEO),'-f','null','-'])
assert not decoded.stderr.strip(), decoded.stderr
measured = run([FFMPEG,'-hide_banner','-i',str(VIDEO),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'])
loudness,_=json.JSONDecoder().raw_decode(measured.stderr[measured.stderr.rfind('{'):])
assert -17 <= float(loudness['input_i']) <= -15, loudness
assert float(loudness['input_tp']) < -1, loudness
with Image.open(OUT/'cover-v1.png') as cover:
    assert cover.size == (1080,1440), cover.size

sheet=Image.new('RGB',(1080,1036),'#dad5c9')
draw=ImageDraw.Draw(sheet)
label_font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',20)
for i,at in enumerate([.6,2.7,4.8,7.6,9.6,12.8,15.3,19]):
    frame=OUT/f'frame-{i}.png'
    run([FFMPEG,'-v','error','-y','-ss',str(at),'-i',str(VIDEO),'-frames:v','1','-vf','scale=270:480',str(frame)])
    x,y=(i%4)*270,(i//4)*518
    with Image.open(frame) as im:
        sheet.paste(im,(x,y))
    draw.text((x+10,y+486),f'{at:04.1f}s',font=label_font,fill='#20252a')
sheet.save(OUT/'contact-sheet.jpg',quality=94)

report={'video':video,'audio':audio,'duration':video['duration'],'container_duration':probe['format']['duration'],
        'loudness_lufs':loudness['input_i'],'true_peak_dbtp':loudness['input_tp'],
        'decode':'passed','cover_dimensions':[1080,1440],
        'mix_auditioned':False,
        'sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [VIDEO,OUT/'cover-v1.png']}}
(OUT/'qc.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
(OUT/'review.html').write_text('''<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>看个剧，还要做题？ · Meowcal Sub</title>
<style>body{margin:0;background:#20252a;color:#f6f5fa;font:16px "Microsoft YaHei",sans-serif;display:flex;flex-direction:column;align-items:center;padding:24px;gap:15px}h1{font-size:22px;margin:0}video{max-height:76vh;max-width:94vw;border-radius:3px}a{color:#b6a7df}nav{display:flex;gap:24px}</style>
<h1>看个剧，还要做题？</h1>
<video controls playsinline preload="metadata" src="meowcal-reading-test-v1.mp4"></video>
<nav><a href="meowcal-reading-test-v1.mp4" download>下载成片</a><a href="cover-v1.png" target="_blank">封面</a><a href="description.html">发布文案</a></nav>
</html>''',encoding='utf-8')
print(json.dumps({'duration':report['duration'],'LUFS':report['loudness_lufs'],
                  'dBTP':report['true_peak_dbtp'],'decode':report['decode']},ensure_ascii=False))
