# Meowcal Sub · 妙影 — 换上新意，继续入戏

32 秒 / 1920 × 1080 / 60 fps，另有 3:4 小红书封面。成片、封面与发布文案见 [brand-evolution-v1.0.0](https://github.com/PeterShanxin/Meowcal-Sub-films/releases/tag/brand-evolution-v1.0.0)。布局更新 → 中文界面 → 观看与本地翻译 → Logo 与中文名。深色画面以同一主体的尺寸变化、界面重排和轮廓形变连接段落，画面落点与配乐拍点共用一份时间表。

## 运行

本片有自己的 `package.json`，在本目录内运行：

```powershell
cd brand-evolution
npm ci
npm run dev
```

Studio：`http://localhost:3107/MeowcalEvolution`，空格播放；封面为 `Cover` 静帧。

`npm run assets` 复制素材、校验字体、生成过期或缺失的配乐，并下载和校验观看演示视频。`npm run score` 显式重新编曲和母带处理，并在落点与音符不对齐时报错；随后运行 `npm run assets` 更新预览 MP3。录音采样缓存位于 `~/.codex/assets/acoustic-score`（可用 `ACOUSTIC_SCORE_BANK` 改位置），文件按内容哈希命名，缺失时自动下载并校验。可通过 `ACOUSTIC_SCORE_FFMPEG` 指定 FFmpeg；Windows 默认使用项目自带的 Remotion FFmpeg。

```powershell
npm run lint
npm run build
npx remotion render MeowcalEvolution out/meowcal-evolution.mp4 --codec=h264 --crf=16
npx remotion still Cover out/cover-v1.png
```

## 脚本与动作

全片按 120 BPM 的拍点编排。画面落点（cue）记录在 `music/morph-score.json` 的 `cues` 中，画面与配乐共用这一份时间表。`scripts/score.mjs` 检查每个落点都有音符起音；任一落点没有对应音符时，渲染直接报错。

| 时间    | 内容                 | 动作与交接                                                                                                                                                                      |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–3 s   | Hello. 我们升级啦。  | 圆点随第一个和弦出现；1 s 展成紫色胶囊，文字逐字弹入；胶囊缓慢呼吸，3 s 前先收缩蓄力。                                                                                          |
| 3–4 s   | 起势                 | 胶囊沿镲片渐强长成旧版窗口，4 s 整拍落定并回弹，律动进入。                                                                                                                      |
| 4–8 s   | 界面焕新。           | 3-3-2 切分的五次钢琴重音各推动一处重排：状态提示弹出、标题移位、选区行缩成按钮、开始按钮归位，7.5 s 窗口收紧到新布局高度。                                                      |
| 8–13 s  | 中文界面，来了。     | 标题以融化形变换成新句。9–11.5 s 十个标签按八分音符逐个变成中文并轻弹；12 s 标题栏的「Meowcal Sub」保持不动，后面逐字长出「· 妙影」，图标换成新 Logo。                          |
| 13–16 s | 圈选字幕，继续入戏。 | 指针按下「选择字幕区域」，真实海浪画面从按钮里展开；鼓过门后 14 s 落定。指针拖出贴合原字幕的选区，「确认并开始」弹出。                                                          |
| 16–19 s | 简单易用，免费开源。 | 16 s 点击确认，中文译文落到原文下方；悬浮胶囊弹出，指针打开「字幕样式」，拖动文字大小，译文同步变大。                                                                           |
| 19–24 s | Logo，也焕新。       | 画面收成旧图标底板，猫形轮廓一笔画出并在 20 s 落定；乐队停顿。21 s 猫耳收平成字幕卡，两条短线依次长出，紫色后层渐出，24 s 回弹落定。                                            |
| 24–28 s | 中文新名字！妙影。   | Logo 让位上移；25.5 s 全体休止一拍；「妙」「影」在 26 s、26.25 s 落下；27 s 扫光，27.5 s 星芒、光晕与钟琴同时亮起。                                                             |
| 28–32 s | Meowcal Sub · 妙影   | 英文名从左侧展开，与中文名排成一行；29 s 标语出现；30 s 终止和弦，切换为原始 `mark.svg`；「现已登陆」与 Windows、GitHub、Microsoft Store 三个标志随和弦依次出现，画面缓慢推近。 |

运动方向依据[参考集 style 06](https://app.notion.com/p/Notebook-16-GIF-3eb50c70f254819fab99c689f5d9f07f?source=copy_link)的连续轮廓变化与对象交接。参考媒体不嵌入成片或重新分发。[活帧笔记](https://app.notion.com/p/Notebook-3f850c70f2548153beb7f487bb07d78b?source=copy_link)的进入、表达、交接原则用于安排动作：同一个主体从圆点贯穿到最终 Logo，段落之间不使用淡入淡出切换。

`cues.ts` 读取共享落点；`choreography.ts` 管理主体尺寸；`Interface.tsx` 与 `FluidLabel.tsx` 管理界面重排和文字形变；`CardRig.tsx` 管理按钮展开为视频的交接；`Viewing.tsx` 管理观看演示；`LogoMorph.tsx` 管理猫形到字幕卡的轮廓形变；`Copy.tsx` 管理标题、名称扫光与星芒；`Atmosphere.tsx` 与 `Composition.tsx` 在重拍处加入背景光晕和整体轻推。所有动作由帧时间计算。

## 音乐

《Small Wonder》为本片原创短曲，120 BPM、4/4 拍、D 大调，共 32 秒。`music/morph-score.json` 保存落点、段落、钢琴声部（旋律在和弦最高声部）、低音线、鼓组律动与单独击打。`scripts/arrange.mjs` 把曲谱转换为 612 个声部事件，`scripts/perform.mjs` 用采样演奏并加入混响，`scripts/score.mjs` 负责落点检查与母带。

- 段落随画面变化：开场只有踏板钢琴，镲片渐强把胶囊推进窗口；布局段是 3-3-2 切分律动；中文段转到 IV 级并加入铃鼓，标签接力由一条上行旋律承接，在品牌出现时解决到主和弦；观看段改为半速律动和长和弦；旧 Logo 出现后乐队停顿，军鼓滚奏推向新 Logo；名字前全体休止一拍，「妙」「影」两次重音，星芒处钟琴上行后亮起钟琴、铃树和高音和弦。
- 钢琴使用 Steinway B 踏板踩下录音，和弦按踏板换踏方式重叠衔接。低音为拨奏低音提琴，按约两个半音一个采样覆盖音域。采样起音前的静音会被裁掉，让可听起音落在谱面时间。
- 使用 65 个真实录音采样，程序编排而非现场演奏，没有物理踏板或共鸣模型。整体经过一个 Freeverb 结构的厅堂混响；钢琴、钟琴和镲片送入较多，底鼓和低音保持干声。
- 录音来自 [VSCO 2 Community Edition](https://github.com/sgossner/VSCO-2-CE/tree/440300901dfe9275fd84e0b7763af1f8443ae62e) 与 [VCSL](https://github.com/sgossner/VCSL/tree/c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e)，按固定版本和 Git blob SHA-1 验证，许可 CC0。录音：Sam Gossner、Simon Dalzell 及 VCSL 贡献者；VSCO 剪辑：Elan Hickler。VCSL 钟琴文件名比实际音高低一个八度，`scripts/instrument-bank.json` 记录实测音高。
- 母带为 48 kHz / 16-bit / stereo WAV，综合响度 −16.18 LUFS，真峰值 −1.50 dBTP，响度范围 3.7 LU。预览使用 256 kbps MP3 与 `Html5Audio`。此播放器避开了当前环境中 Web Audio 路径无声的问题；Studio 的 Audio Levels 面板不反映该播放器输出。
- 编曲、演奏与混响脚本已并入通用的 acoustic-score skill；本目录保留固定副本，保证可复现。

## 素材与产品边界

- 旧首页与猫形 Logo 来自 [v0.8.0 素材提交](https://github.com/PeterShanxin/Meowcal-Sub/commit/6bf25692ce75486235500d36126da15b9a529f10)，保存在 `assets/`。新首页截图和 Logo 来自 Meowcal-Sub `55ddf89` 的 [docs/assets](https://github.com/PeterShanxin/Meowcal-Sub/tree/55ddf89ef75d32c5d68e9eaf9105d45588b522db/docs/assets)，原样复制在 `assets/`。为连续重排，片中首页按这些截图重建为可动画元素；不是原生应用录屏。
- 中文界面与品牌依据 [PR #324](https://github.com/PeterShanxin/Meowcal-Sub/pull/324)。界面语言与字幕语言独立；布局变化也涉及此前的首页简化，不宣称全为 #324 新增功能。
- 实拍视频为 Lucius Crick 的 [Ocean waves aerial](https://www.pexels.com/video/ocean-waves-aerial-20279053/)，按 [Pexels License](https://www.pexels.com/license/) 使用。源地址、SHA-256 和 8–15 s 取段记录在 `scripts/video-source.json`；下载原件保留在忽略的 `out/`，预览片段为 1280×720、30 fps、无声。
- 英文「The ocean never stops moving.」及中文「海浪，从未停歇。」是为操作演示撰写的字幕，不是素材对白转录。圈选、翻译和浮层为操作动画，不是实时 OCR 或翻译性能证据。控件依据 Meowcal-Sub 的 `src/overlay.html`、`src/i18n/overlay-messages.ts` 和 `docs/USAGE.zh-CN.md`；片中悬浮胶囊为圆角药丸形，应用跟进见 [Meowcal-Sub#330](https://github.com/PeterShanxin/Meowcal-Sub/issues/330)。演示以本地引擎已准备好为前提。
- 片中界面为开发版本，不代表已发布的版本都已包含这些界面。片尾列出的获取渠道为 GitHub Releases 与 Microsoft Store（产品 `9NNK2X23VLWT`，2026-11-14 已上架）；两个标志为单色重绘，GitHub 标志取自 Octicons 的 `mark-github`。最终 Logo 使用仓库原始 `mark.svg`，命名遵守 [TRADEMARKS.md](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md)。
- Noto Sans SC 的固定版本与 SHA-256 在 `scripts/font-source.json`；SIL OFL 许可在 `licenses/NotoSansSC-OFL.txt`。渲染等待字体加载，界面与演示字幕使用同一字体家族。

## 验证

2026-11-14：ESLint、TypeScript、Prettier 与 Remotion bundle 通过。以半分辨率渲染全片，按每 0.25 s 一帧检查全部 128 帧，覆盖胶囊到窗口、布局重排、中文接力、按钮展开为视频、旧图标一笔画、Logo 形变、名字星芒与结尾排版。配乐按谱面检查全部 47 个落点：在母带上，每个落点附近 ±10 ms 内都有起音，与画面误差小于一帧；分轨电平按目标平衡，钢琴为主声部。Studio 在 1×、未静音状态播放，音频 readyState 为 4 且时间持续推进，加载的 MP3 与新母带哈希一致，无运行错误。观看演示的选区按实测字幕宽度计算，指针坐标由选区、按钮、齿轮、滑块和关闭按钮的位置推出，关键帧确认指针尖落在目标上。海浪视频从第一帧起挂载：若在 13 s 才加载，播放器会暂停等待，而音乐继续播放后被拉回，听起来像重复；配乐也设为随播放器缓冲暂停。以上检查无法代替试听：音色、气质与踩点是否合适，以用户试听为准。观看动画不代替原生应用验证。

Remotion 使用条款见 [Remotion license](https://www.remotion.dev/docs/license)。
