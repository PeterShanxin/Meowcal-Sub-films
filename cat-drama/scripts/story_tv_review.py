"""Build the silent living-room direction study and its review page."""
import io
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out/story'
VIDEO = OUT / 'tv-study-12.mp4'
FFMPEG = ROOT.parent / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'

subprocess.run([
    str(FFMPEG), '-v', 'error', '-y', '-i', str(VIDEO), '-an',
    '-c:v', 'libvpx-vp9', '-threads', '2', '-deadline', 'realtime',
    '-cpu-used', '6', '-row-mt', '1', '-crf', '28', '-b:v', '0',
    '-pix_fmt', 'yuv420p', str(OUT / 'tv-study-12.webm'),
], check=True)

font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 22)
sheet = Image.new('RGB', (1920, 340), '#162c32')
draw = ImageDraw.Draw(sheet)
shots = [(20, '01  客厅 · 看电视'), (250, '02  越过观众，靠近屏幕'),
         (500, '03  电视里的另一种日常'), (655, '04  切回一个小反应')]
for i, (frame, label) in enumerate(shots):
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(frame / 60), '-i', str(VIDEO),
        '-frames:v', '1', '-vf', 'scale=480:270', '-f', 'image2pipe', '-vcodec', 'png', '-'
    ])
    still = Image.open(io.BytesIO(data)).convert('RGB')
    still.save(OUT / f'tv-study-{i + 1:02}.png')
    sheet.paste(still, (i * 480, 0))
    draw.text((i * 480 + 18, 293), label, font=font, fill='#d4cbb3')
sheet.save(OUT / 'tv-study-contact.jpg', quality=96)

html = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>看电视 · 镜头方向试片</title><style>body{margin:0;background:#14292e;color:#e4ddcb;font:18px/1.7 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1152px;margin:auto;padding:38px 28px 70px}small{color:#a2b2a9;letter-spacing:3px}h1{font-size:34px;font-weight:500;margin:12px 0}p{color:#b5c1b7;max-width:900px}video{width:100%;display:block;background:#10272c}img{display:block;width:100%;margin-top:36px}a{color:#d8c49c}footer{margin-top:25px;font-size:15px}</style><main><small>MEOWCAL SUB / DIRECTION STUDY 02</small><h1>从猫的客厅，走进电视里的世界。</h1><p>12 秒，无配乐。先看空间、镜头和表演：客厅里的狸花猫 → 靠近电视 → 日本猫趴在键盘上 → 切回观众的小反应。</p><video controls playsinline preload="auto" poster="tv-study-01.png" src="tv-study-12.webm"></video><footer><a href="tv-study-12.mp4" download>下载镜头试片 MP4</a> · <a href="tv-study-contact.jpg">打开四帧联系表</a></footer><img src="tv-study-contact.jpg" alt="客厅、推进电视、屏幕内的日本猫、观众反应"><p>本段用于重定镜头方向，尚未展开整支 60 秒和 30 秒短片。电视里的日语字幕意为“这里最暖和”。</p></main></html>'''
(OUT / 'tv-study.html').write_text(html, encoding='utf-8')
(OUT / 'review.html').write_text(html, encoding='utf-8')
print(OUT / 'review.html')
