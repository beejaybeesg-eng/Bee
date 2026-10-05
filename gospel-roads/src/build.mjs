// 把地图数据、内容和模板合成一个独立的 index.html
// 用法：cd gospel-roads/src && npm install && node mapdata.mjs && node build.mjs
import {readFileSync, writeFileSync} from 'fs';
const map = readFileSync('map.json', 'utf8');
const content = readFileSync('content.js', 'utf8');
const tpl = readFileSync('template.html', 'utf8');
const out = tpl.replace('/*__DATA__*/', () => 'const MAP=' + map + ';\n' + content);
writeFileSync('../index.html', out);
console.log('wrote ../index.html', (out.length / 1024).toFixed(0) + 'KB');
