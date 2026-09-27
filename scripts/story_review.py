"""Extract one representative frame per shot, with an HTML review page."""
import io
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'out/story'
TL=json.loads((ROOT/'src/timeline.json').read_text(encoding='utf-8'))['catPlanet']
FONT=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',20)
SMALL=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',17)


def make_sheet(edit,filename):
    portrait=edit=='vertical'
    tw,th=(270,480) if portrait else (480,270)
    cols=3 if portrait else 4
    shots=TL[edit]
    sheet=Image.new('RGB',(cols*tw,88+((len(shots)+cols-1)//cols)*(th+66)), '#111d2c')
    draw=ImageDraw.Draw(sheet)
    draw.text((24,18), '猫猫地球 / 30 秒竖版分镜' if portrait else '猫猫地球 / 60 秒品牌故事分镜',font=FONT,fill='#f4e6c9')
    draw.text((24,51),'每镜一帧 · 预演版 · 构图与节奏待确认',font=SMALL,fill='#b0bfc8')
    for i,s in enumerate(shots):
        stamp=(s['from']+s['sample'])/60
        raw=subprocess.run(['ffmpeg','-v','error','-ss',str(stamp),'-i',str(OUT/filename),'-frames:v','1','-vf',f'scale={tw}:{th}','-f','image2pipe','-vcodec','png','-'],capture_output=True,check=True).stdout
        frame=Image.open(io.BytesIO(raw)).convert('RGB')
        frame.save(OUT/f"{s['id']}.png")
        x,y=(i%cols)*tw,88+(i//cols)*(th+66)
        sheet.paste(frame,(x,y))
        draw.text((x+12,y+th+9),f"{s['id']}  {s['from']/60:g}–{(s['from']+s['duration'])/60:g}s",font=SMALL,fill='#e6cf98')
        draw.text((x+12,y+th+34),s['label'],font=SMALL,fill='#d2dce3')
    path=OUT/f'contact-{edit}.jpg'
    sheet.save(path,quality=96)
    print(path)


make_sheet('landscape','cat-planet-60-animatic.mp4')
make_sheet('vertical','cat-planet-30-animatic.mp4')
(OUT/'review.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>猫猫地球 · 分镜审阅</title><style>body{margin:0;background:#101b29;color:#ecede7;font:18px/1.7 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1240px;margin:auto;padding:52px 28px}h1{font-size:42px;line-height:1.25;margin:8px 0 22px}h2{font-size:27px;margin-top:50px}p{max-width:840px;color:#bccbd5}small{color:#e4cb96;letter-spacing:3px}video{display:block;width:100%;border-radius:14px;background:#07090f}.portrait{max-width:380px}img{width:100%;border-radius:8px}a{color:#e7d2a5}section{margin-bottom:50px}.note{padding:22px 28px;border-left:3px solid #b6a275;background:#1b2c3c}</style><main><small>MEOWCAL SUB / STORYBOARD 01</small><h1>一颗小星球，六种语言。<br>原来，我们都爱同一个纸箱。</h1><p>六只猫互看日常 vlog，隔着字幕错过彼此的笑点；一个选框，让它们读懂熟悉的猫日常。</p><p class="note">当前是故事板与低清 animatic，供确认角色、叙事、字幕和节奏。确认后再做完整光影、景深、运动模糊与最终混音。片中产品动作是编辑示意，不是原生运行或速度测试。</p><section><h2>60 秒横版 · 完整故事</h2><video controls preload="metadata" src="cat-planet-60-animatic.mp4"></video><p>640 × 360 · 60 fps · 原创配乐与音效 · 无对白</p><a href="contact-landscape.jpg">打开横版联系表</a><img src="contact-landscape.jpg" alt="19 镜横版故事板"></section><section><h2>30 秒竖版 · 冲突 → 框选 → 看懂 → Logo</h2><video class="portrait" controls preload="metadata" src="cat-planet-30-animatic.mp4"></video><p>360 × 640 · 60 fps · 按竖版重排构图</p><a href="contact-vertical.jpg">打开竖版联系表</a><img style="max-width:810px" src="contact-vertical.jpg" alt="9 镜竖版故事板"></section><p>产品边界：Windows 11 公开测试版；主显示器；读取已有画面文字，不识别语音。字幕文本在本机处理；首次设置、修复与更新需要联网下载。角色与全部布景由代码绘制；无外部音频、无 AI 角色图。</p></main></html>''',encoding='utf-8')
