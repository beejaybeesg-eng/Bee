# 工具：重新生成分镜、PDF 和视频小样

这一套工具生成了 `pdf/`、`storyboards/`、每首的 `*_拍摄脚本.md`、`全部_分镜脚本.pdf` 和 `全部.md`。以后要改分镜或做小样时用。

## 需要什么
- **Node 18+** 和 **Playwright**（带 Chromium）：`npm i playwright && npx playwright install chromium`
- **Python 3**：`pip install librosa soundfile pillow pypdf`
- **ffmpeg**
- **字体**（都是 Google Fonts 上的开源字体）：Anton、Oswald、Big Shoulders Display、Noto Sans SC。装进系统字体目录（Linux 放 `~/.local/share/fonts/`，然后运行 `fc-cache -f`）。

## 分镜 / 脚本 / PDF
每首的分镜、机位、时间表、字、剪辑要点都写在 `storyboard/specs/NN.js` 里。改完重新生成：

```bash
cd tools/storyboard
node build.js specs/02.js --frames   # 生成：pdf/02_…_分镜脚本.pdf、storyboards/02_…_分镜N.jpg、02_…_拍摄脚本.md（--frames 同时导出 1080×1920 的干净画面，做小样用）
node overview.js                      # 合并：全部_分镜脚本.pdf（要先把九首都 build 一遍）
python3 mkall.py                      # 合并：全部.md
python3 count.py ../../0*.md          # 检查一页纸字数（≤ 800）
```

- 一页纸（`NN_….md`）手写维护；`build.js` 会把它放在每首 PDF 的第一页。
- 画图的部件（人物、脸、琴、MPC、镜子、斗笠、光、雨、字的各种效果、镜头标注）在 `storyboard/kit.js` 里。
- 中间文件默认写进系统临时目录下的 `vinavvave-build/`，可以用环境变量 `VV_BUILD` 改。

## 音乐剪辑和视频小样
```bash
cd tools/audio
python3 -I analyze.py "02.mp3" 02.json 02_map.png          # 测 BPM、找小节线、画结构图（黑 = 能量，蓝 = 低频）
# 写剪辑方案 plan.json：{"segments": [[起始小节, 小节数], ...], "fade_out": 0.6}
python3 -I cut.py "02.mp3" 02.json plan.json 02_cut.wav    # 按小节剪，接口 20ms 交叉淡化，响度 -14 LUFS
python3 -I make_demo.py 02 02.json 02_cut.wav 02_demo.mp4 "02 MỜI THÌ CHƠI · 小样"   # 分镜画面 + 剪好的音乐 + 闪白/抖动/推镜
```

- 每首小样的镜头顺序和每个镜头占几拍，写在 `audio/templates.json` 里（用的是 `导演稿与剪辑方案.md` 里编辑选的那一版）。
- 小节线是自动找的：先找拍子，再把能量变化最大的拍子当作小节的第一拍。剪之前看一眼结构图，确认小节号对不对。
