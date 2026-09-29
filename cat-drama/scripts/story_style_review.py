"""Package the two silent style studies for the sidebar's WebM player."""
import io
import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out/story'
ENCODER = ROOT.parent / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
FONT = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 23)
CAPTION = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
STYLES = [('pixel', 'A · 像素绘本'), ('ceramic', 'B · 冷灰插画')]
SAMPLES = [(30, '客厅 / 看电视'), (430, '屏幕内 / 日本短尾猫'), (620, '观众 / 眼神与反应')]


def still(video: Path, frame: int) -> Image.Image:
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(frame / 60), '-i', str(video),
        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'
    ])
    return Image.open(io.BytesIO(data)).convert('RGB')


def main():
    contact = Image.new('RGB', (1920, 904), '#121927')
    draw = ImageDraw.Draw(contact)
    verification = {}
    for row, (style, label) in enumerate(STYLES):
        video = OUT / f'style-{style}-12.mp4'
        webm = video.with_suffix('.webm')
        subprocess.run([
            str(ENCODER), '-v', 'error', '-y', '-i', str(video), '-an',
            '-c:v', 'libvpx-vp9', '-threads', '2', '-deadline', 'realtime',
            '-cpu-used', '6', '-row-mt', '1', '-crf', '24', '-b:v', '0',
            '-pix_fmt', 'yuv420p', str(webm),
        ], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(webm), '-f', 'null', '-'], check=True)
        probe = json.loads(subprocess.check_output([
            'ffprobe', '-v', 'error', '-count_frames', '-show_streams',
            '-show_format', '-of', 'json', str(video)
        ]))
        stream = probe['streams'][0]
        assert len(probe['streams']) == 1, 'Style studies are silent.'
        assert stream['nb_read_frames'] == '720'
        assert stream['r_frame_rate'] == '60/1'
        assert (stream['width'], stream['height']) == (960, 540)
        y = row * 452
        draw.text((20, y + 9), label, font=FONT, fill='#e8eef7')
        for column, (frame, caption) in enumerate(SAMPLES):
            image = still(video, frame)
            image.save(OUT / f'style-{style}-{frame}.png')
            contact.paste(image.resize((640, 360), Image.Resampling.NEAREST if style == 'pixel' else Image.Resampling.LANCZOS), (column * 640, y + 50))
            draw.text((column * 640 + 20, y + 419), caption, font=CAPTION, fill='#c0c9dc')
        # The reaction camera is locked. This patch includes both planted paws.
        patch = (385, 456, 638, 519) if style == 'ceramic' else (410, 439, 625, 505)
        start, finish = still(video, 530), still(video, 650)
        before = np.array(start.crop(patch)).astype(float)
        after = np.array(finish.crop(patch)).astype(float)
        difference = float(np.abs(after - before).mean())
        assert difference < 2.0, f'{style}: unexpected contact movement ({difference:.3f})'
        face_patch = (390, 72, 678, 356)
        face_difference = float(np.abs(np.array(start.crop(face_patch)).astype(float) - np.array(finish.crop(face_patch)).astype(float)).mean())
        assert face_difference > .25, f'{style}: expected a visible reaction'
        verification[style] = {
            'duration_seconds': float(probe['format']['duration']),
            'frames': int(stream['nb_read_frames']), 'fps': stream['r_frame_rate'],
            'size': [stream['width'], stream['height']], 'audio': False,
            'webm_full_decode': 'pass', 'paw_patch_mean_rgb_difference': round(difference, 4),
            'paw_patch_frames': [530, 650], 'paw_patch_xyxy': patch,
            'face_patch_mean_rgb_difference': round(face_difference, 4),
        }
    contact.save(OUT / 'style-comparison.jpg', quality=97)
    (OUT / 'style-verification.json').write_text(json.dumps(verification, indent=2), encoding='utf-8')
    html = '''<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meowcal Sub · 两种画风</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#07090f;color:#f5f7ff;font:16px/1.6 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1500px;margin:auto;padding:34px 30px 60px}small{font-size:12px;letter-spacing:2px;color:#8d9ab4}h1{font-size:30px;line-height:1.3;font-weight:500;margin:11px 0}p{color:#c0c9dc;margin:12px 0 20px}nav{display:flex;gap:9px;flex-wrap:wrap;margin:22px 0}button{font:inherit;color:#e8eef7;background:#151b28;border:1px solid #465268;padding:9px 18px;border-radius:7px;cursor:pointer}button:first-child{background:#e8eef7;color:#10141d;border-color:#e8eef7}button:hover{filter:brightness(1.14)}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}h2{font-size:19px;font-weight:500;margin:0 0 10px}video{display:block;width:100%;background:#121927;border-radius:6px}article p{font-size:14px;margin:10px 0;color:#8d9ab4}a{color:#c0c9dc;text-underline-offset:4px}figure{margin:28px 0 0}img{width:100%;display:block}figcaption{color:#8d9ab4;font-size:13px;margin:8px 0}.focus{grid-template-columns:1fr;max-width:1060px;margin:auto}.focus article[hidden]{display:none}@media(max-width:520px){main{padding:24px 18px}.pair{grid-template-columns:1fr;gap:24px}h1{font-size:25px}}
</style>
<main><small>MEOWCAL SUB / STYLE STUDIES</small><h1>同一个客厅，两种画风。</h1>
<p>各 12 秒，无配乐。客厅 → 电视里的日本短尾猫 → 观众反应。</p>
<nav><button id="play">同时从头播放</button><button id="both">并排对比</button><button id="pixel">放大 A</button><button id="ceramic">放大 B</button></nav>
<section class="pair" id="pair">
<article data-style="pixel"><h2>A · 像素绘本</h2><video controls playsinline preload="auto" poster="style-pixel-30.png" src="style-pixel-12.webm"></video><p>逐格轮廓、有限色板、分层光影。<a href="style-pixel-12.mp4" download>下载 MP4</a></p></article>
<article data-style="ceramic"><h2>B · 冷灰插画</h2><video controls playsinline preload="auto" poster="style-ceramic-30.png" src="style-ceramic-12.webm"></video><p>沿用 App 的冷灰蓝与陶瓷质感，保留暖色电视内景。<a href="style-ceramic-12.mp4" download>下载 MP4</a></p></article>
</section>
<figure><a href="style-comparison.jpg"><img src="style-comparison.jpg" alt="像素版与冷灰插画版：客厅、电视内景、猫的反应，六帧联系表"></a><figcaption>动作重点：身体有支撑，脚爪固定；眼神先动，头颈随后，短暂眨眼后回到停顿。</figcaption></figure>
</main><script>
const videos=[...document.querySelectorAll('video')], articles=[...document.querySelectorAll('article')], pair=document.querySelector('#pair');
document.querySelector('#play').onclick=async()=>{for(const v of videos){v.pause();v.currentTime=0}await Promise.all(videos.map(v=>v.play()))};
for(const mode of ['both','pixel','ceramic'])document.getElementById(mode).onclick=()=>{pair.classList.toggle('focus',mode!=='both');for(const article of articles){article.hidden=mode!=='both'&&article.dataset.style!==mode;if(article.hidden)article.querySelector('video').pause()}};
</script></html>'''
    (OUT / 'style-review.html').write_text(html, encoding='utf-8')
    (OUT / 'review.html').write_text(html, encoding='utf-8')
    print(json.dumps(verification, indent=2))


if __name__ == '__main__':
    main()
