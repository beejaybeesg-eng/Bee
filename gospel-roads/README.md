# 福音之路 Gospel Roads

一个可以点击的互动地图：从西非、中间航道，到美国的灵歌、蓝调、福音和灵魂乐。

- 打开 `index.html` 就能用（单文件，不需要服务器）。
- 内容在 `src/content.js`：九个站点的故事、法律年表、人物、聆听和电影清单、测验题，以及唱腔实验室。
- 改完内容后重新生成：

```
cd src
npm install        # 只在需要重新生成地图数据时
node mapdata.mjs   # 生成 map.json（州界、大西洋地图、城市坐标）
node build.mjs     # 把 map.json + content.js + template.html 合成 ../index.html
```
