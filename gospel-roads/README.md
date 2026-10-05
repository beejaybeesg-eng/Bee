# 福音之路 Gospel Roads

一个可以点击的互动地图：从西非、中间航道，到美国的灵歌、蓝调、福音和灵魂乐。

- 打开 `index.html` 就能用（单文件，不需要服务器）。
- 内容在 `src/content.js`：九个站点的故事、法律年表、人物、聆听和电影清单、测验题。
- 唱腔与频段解构器在 `src/lab.js`：十种唱腔的发声机理、参考频谱曲线、推荐唱片，以及分析代码（FFT、YIN 音高、颤音、谐噪比、次谐波）。
- 页面不内置任何唱片音频。推荐唱片的 Apple Music 30 秒试听只有在本地用浏览器打开 `index.html` 时才能直接播放（claude.ai 的网页沙盒会拦截）；也可以把自己的音频文件拖进页面分析。
- 改完内容后重新生成：

```
cd src
npm install        # 只在需要重新生成地图数据时
node mapdata.mjs   # 生成 map.json（州界、大西洋地图、城市坐标）
node build.mjs     # 把 map.json + content.js + lab.js + template.html 合成 ../index.html
```
