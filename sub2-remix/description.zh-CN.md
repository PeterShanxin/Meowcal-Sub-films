标题：想看的片只有外语字幕？让它自己找、自己对、自己换上

好字幕，字幕组早就翻好了。麻烦的是找到它、对上时间、再放到屏幕上。

妙影2（Meowcal Sub 2）替你做这三步：

1. 自动找：一次搜三个字幕库（OpenSubtitles、SubDL、ASSRT），挑一份别人翻好的字幕；
2. 自动对：圈住画面里的原文字幕，它认出台词，就知道片子播到哪了，时间轴自己对上；
3. 自动换：中文字幕作为第二份字幕，放在你的屏幕上，暂停、倒回也跟着。

字幕文件里没有的句子，可以用本机翻译补上。识别和翻译都在自己电脑上跑。

Windows，免费开源。GitHub 或 Microsoft Store 搜 Meowcal Sub 2 或 妙影2。

#字幕 #看剧 #看电影 #生肉 #字幕组 #开源软件 #Windows软件 #独立开发 #赛博朋克

—— 说明 ——

· 片中画面均为开放授权素材，经截取、裁切、调暗和变速；除开头 1.9 秒保留《Sprite Fright》原声外，均去掉了原声：
  《Sintel》（2010），© copyright Blender Foundation | durian.blender.org，CC BY 3.0；
  《Charge》（2022），© Blender Foundation | studio.blender.org，CC BY 4.0；
  《Sprite Fright》（2021），(CC) Blender Foundation | studio.blender.org，CC BY 4.0；
  开场的骑手镜头来自 Mixkit（Mixkit Stock Video Free License）。
· 《Sintel》画面本身没有内嵌字幕：画面里的英文字幕按官方 1080p 版本自带的英文字幕重新绘制，中文字幕取自官方下载页的 sintel_chs.srt，原样使用。《Sprite Fright》的英文台词按原片对白重绘。
· 界面按真实界面（中文界面，开发版本）重绘成动画，不是实时录屏；搜索结果里的文件名和来源是示意，不代表这份字幕就在这三个字幕库里。
· 「每一句，都对得上」的依据：2026-11-10，一台 Windows ARM64 笔记本，开发版本（晚于已发布的 v0.2.2），播放一段 90 秒、标注了 40 句台词的中文字幕样本，Windows OCR 和 PP-OCRv6 各跑一次，40 句都正确显示。这是单机、单段样本的结果，不代表整部影片或所有播放器。数据见仓库 docs/OCR_BENCHMARK.md。
· 用它需要：画面上有原文字幕；至少一个字幕源的 API 密钥。片源版本和字幕版本不一致时可能有偏差，受保护的视频画面可能无法识别。
· 配乐为本片原创，用 CC0 采样录音演奏（小提琴、中提琴、大提琴、钢琴、低音提琴、卡洪鼓、沙锤等，来自 VCSL、VSCO 2 CE）。按键声为 CC0 录音（unicaegames / OpenGameArt）。字体：Noto Sans SC、Inter、JetBrains Mono（SIL OFL）。
