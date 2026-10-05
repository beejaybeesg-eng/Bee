/* ===== 唱腔与频段解构器 Vocal Anatomy & Frequency Visualizer ===== */
// 参考曲线是示意的典型频谱轮廓（相对峰值的 dB），不是测量结果。
// g: 声门示意参数  cq 闭合商 / gap 后部漏气缝 / amp 振幅 / thin 薄边振动 / vent 室带参与 / ae 杓会厌收窄 / lar 喉位 / ps 声门下压
const TECH = [
  {id:'holler',zh:'原始呼喊',en:'Field Holler / Shout',era:'种植园 → 硬福音',
   d:'一个人在田野里放开喉咙的长声呼喊：高声压、长距离传送、在胸声和假声之间猛地翻转。它是蓝调、福音“shout”和灵魂乐尖叫的共同祖先。',
   body:{glottis:'声带厚、闭合有力，声门下压很高。翻转时声带突然变薄，进入假声。',larynx:'喉位偏高，声道变短，元音更“亮”。',tract:'嘴张大，咽腔收紧，能量推向 600 Hz–3 kHz。',breath:'一口气冲出去，起音突然、音量落差大。'},
   watch:['音高轨迹里会出现大跨度的滑动和突然的跳变（胸声→假声的翻转）','动态范围很大：起音处电平急升','频谱能量集中在 500 Hz–3 kHz 的“穿透带”'],
   curve:[[60,-40],[100,-26],[180,-12],[350,-4],[650,0],[1200,-3],[2500,-6],[3500,-10],[6000,-22],[10000,-34],[16000,-50]],
   g:{cq:.55,gap:0,amp:1,lar:.82,ps:.95,ae:.4},
   refs:[{q:'Arwhoolie Cornfield Holler',t:'Thomas J. Marshall — Arwhoolie (Cornfield Holler)（1939，国会图书馆田野录音）',w:'整首都是无伴奏的田野呼喊，注意长音结尾的假声翻转'},{t:'The Five Blind Boys of Mississippi — Our Father（1950）',w:'Archie Brownlee 的尖叫段落'},{t:'Mahalia Jackson — Didn’t It Rain',w:'她在高潮处的呼喊式长音'}]},
  {id:'bend',zh:'布鲁斯滑音',en:'Blue-note Bend',era:'蓝调 → 福音 → 灵魂乐',
   d:'声音从一个音“弯”进另一个音，或者停在大调和小调之间。三音、七音常被唱成介于半音之间的“中性”音高，这就是蓝调音。',
   body:{glottis:'正常闭合，音色不是重点，重点是环甲肌对声带张力的连续、细微控制。',larynx:'中位、稳定，不能因为滑音乱动。',tract:'元音保持不变，只有音高在动。',breath:'稳定的气流支撑缓慢的滑动。'},
   watch:['音高轨迹里看从下往上“爬”进目标音的弧线','停在两条半音格线之间的音：那就是中性三度或七度','把同一句话唱成“直的”再对比'],
   curve:[[60,-36],[100,-20],[200,-6],[400,0],[800,-5],[1600,-10],[3000,-12],[5000,-24],[9000,-36],[16000,-52]],
   g:{cq:.45,gap:.1,amp:.6,lar:.5,ps:.55,ae:.2},
   refs:[{t:'Bessie Smith — St. Louis Blues（1925）',w:'1925 年发行，在美国已经进入公有领域。听她每句开头怎么滑进音'},{t:'Mahalia Jackson — Take My Hand, Precious Lord',w:'慢板中几乎每个长音都在弯'},{t:'Blind Willie Johnson — Dark Was the Night（1927）',w:'人声和滑棒吉他一起滑'}]},
  {id:'breathy',zh:'气声呢喃',en:'Breathy Croon',era:'灵魂乐 → 新灵魂乐',
   d:'声带没有完全合拢，气流从缝隙里漏出来，声音软、近、私密，像贴着耳朵说话。灵魂乐的情歌和新灵魂乐大量使用。',
   body:{glottis:'后部留有一道三角形缝隙，闭合商很低，大量气流变成噪声。',larynx:'中低位，放松。',tract:'嘴型小，能量集中在基频附近，高频是“嘶嘶”的气声。',breath:'气流大、压力小，音量很弱，常离麦克风很近。'},
   watch:['谐噪比 HNR 明显变低（通常低于 10 dB）','频谱图里谐波线之间有一层雾状噪声，尤其在 4 kHz 以上','均衡曲线高频不是陡降，而是有一片“空气”平台'],
   curve:[[60,-30],[120,-8],[220,0],[450,-8],[900,-18],[1800,-26],[3500,-30],[6000,-30],[9000,-33],[16000,-48]],
   g:{cq:.18,gap:.85,amp:.45,lar:.4,ps:.28,ae:0},
   refs:[{t:'Al Green — Let’s Stay Together（1971）',w:'主歌部分的轻声和气声'},{t:'D’Angelo — Untitled (How Does It Feel)（2000）',w:'几乎全程的气声假声'},{t:'Marvin Gaye — Let’s Get It On（1973）',w:'低声的呢喃段落'}]},
  {id:'moan',zh:'哼吟',en:'Hum / Moan',era:'种植园 → 教会长韵',
   d:'闭着嘴或半闭着嘴的低吟。声音从鼻腔出来，像祷告一样，没有歌词。教会的“长韵”赞美诗和蓝调都用它开场。',
   body:{glottis:'正常闭合，音量小。',larynx:'偏低，放松。',tract:'嘴唇闭合，软腭放下，声音走鼻腔：约 1 kHz 附近出现一个“凹陷”（反共振）。',breath:'慢、长、均匀。'},
   watch:['能量几乎都在 500 Hz 以下','均衡曲线在 1 kHz 左右有明显的凹陷','音高缓慢滑动，很少有跳跃'],
   curve:[[60,-22],[110,-4],[230,0],[400,-6],[700,-18],[1000,-30],[1500,-26],[2500,-34],[4000,-44],[8000,-56],[16000,-66]],
   g:{cq:.45,gap:.1,amp:.4,lar:.35,ps:.3,ae:.1},
   refs:[{t:'Blind Willie Johnson — Dark Was the Night, Cold Was the Ground（1927）',w:'整首几乎只有哼吟'},{t:'Aretha Franklin — Amazing Grace（1972 现场）',w:'同名曲的开头，艾瑞莎的长韵式低吟'},{t:'Mahalia Jackson — In the Upper Room',w:'开头的哼吟和缓慢进入',q:'Mahalia Jackson In the Upper Room'}]},
  {id:'growl',zh:'嘶吼 / 沙音',en:'Growl & Grit',era:'硬福音四重唱 → 灵魂乐',
   d:'在声音里加入粗糙的颗粒和咆哮。真声带之上的室带（假声带）和杓会厌结构被带着一起振动，产生不规则的次谐波和噪声。情绪被推到了极限。',
   body:{glottis:'真声带闭合有力，上方的室带也跟着振动（通常是真声带频率的一半或不规则）。',larynx:'偏高，收紧。',tract:'杓会厌区收窄，喉咙“挤”起来，高频变亮、变粗。',breath:'声门下压很高，必须靠强支撑，不然很伤嗓子。'},
   watch:['频谱图里在谐波之间出现额外的线（次谐波，常在基频的一半）','谐噪比 HNR 下降，次谐波指标升高','示波器里的波形不再整齐重复，周期忽大忽小'],
   curve:[[60,-20],[100,-10],[200,-3],[400,0],[800,-2],[1600,-4],[3000,-6],[5000,-14],[8000,-24],[16000,-40]],
   g:{cq:.5,gap:.1,amp:.9,lar:.72,ps:.88,ae:.65,vent:true},
   refs:[{t:'The Sensational Nightingales — Burying Ground',w:'Julius Cheeks 的沙哑领唱',q:'Sensational Nightingales Burying Ground'},{t:'Wilson Pickett — In the Midnight Hour（1965）',w:'灵魂乐对硬福音的直接继承'},{t:'James Brown — Please, Please, Please（1956）',w:'尖叫和嘶吼'}]},
  {id:'belt',zh:'胸声强混',en:'Gospel Belt',era:'福音合唱 → 灵魂乐 → 流行',
   d:'用胸声的力量唱到很高的音，声音明亮、厚、穿透力强。福音女声的招牌，后来成了流行天后的标配。',
   body:{glottis:'闭合商很高：声带在每个振动周期里有一半以上的时间是合拢的。',larynx:'偏高，但不卡死。',tract:'嘴张大，第一共振峰被“调”到第二谐波上，元音偏开（“啊”“诶”）。',breath:'声门下压很高，声压可以非常大。'},
   watch:['2–4 kHz 的“穿透带”能量很强','谐噪比很高，谐波线又直又多，一直延伸到 5 kHz 以上','基频通常很高（女声常在 G4–G5 一带）'],
   curve:[[60,-40],[100,-26],[200,-10],[400,-2],[700,0],[1200,-3],[2500,-5],[3500,-7],[5000,-18],[8000,-30],[16000,-46]],
   g:{cq:.64,gap:0,amp:.95,lar:.75,ps:.92,ae:.5},
   refs:[{t:'Mahalia Jackson — Move On Up a Little Higher（1948）',w:'高潮处的强混'},{t:'Aretha Franklin — Ain’t No Way（1968）',w:'副歌'},{t:'Whitney Houston — I Will Always Love You（1992）',w:'升调后的最后一段'}]},
  {id:'falsetto',zh:'假声',en:'Falsetto & Flip',era:'四重唱领唱 → 灵魂乐',
   d:'声带被拉长变薄，只有边缘振动，几乎不完全合拢。声音轻、高、透。福音四重唱的领唱用它制造飘起来的效果，灵魂乐男歌手继承了下来。',
   body:{glottis:'只有薄薄的声带边缘接触，闭合时间很短甚至不闭合。',larynx:'中位或略高。',tract:'高次谐波很弱，声音集中在基频和头两个谐波。',breath:'需要比想象中更多的气，不然会断。'},
   watch:['从胸声翻上来的瞬间：音高跳变，同时 2–4 kHz 能量突然减少','谐波线很少，只有下面几条清楚','均衡曲线高频陡降'],
   curve:[[60,-50],[150,-30],[300,-6],[500,0],[900,-8],[1800,-20],[3000,-28],[5000,-34],[8000,-40],[16000,-56]],
   g:{cq:.15,gap:.3,amp:.35,lar:.55,ps:.45,ae:.1,thin:true},
   refs:[{t:'The Swan Silvertones — Mary Don’t You Weep（1959）',w:'Claude Jeter 的假声领唱'},{t:'Al Green — Let’s Stay Together（1971）',w:'副歌里的假声上扬'},{t:'Curtis Mayfield — People Get Ready（1965）',w:'柔和的高位男声'}]},
  {id:'runs',zh:'转音',en:'Runs / Melisma',era:'福音 → R&B',
   d:'一个字上唱很多个音，快速上下走。是福音女声最炫的技术，克拉克姐妹把它推到极限，后来成了 R&B 的标志。',
   body:{glottis:'闭合中等，靠声带张力的快速变化完成，每个音都要“落地”。',larynx:'尽量稳定，喉位乱跳就会糊。',tract:'元音固定，不随音高改变。',breath:'稳定、持续，不能每个音都推一下气。'},
   watch:['音高轨迹里一串快速的台阶：数一数每秒几个音','“音符变化/秒”指标：快的转音可以超过每秒 8 个','好的转音每个台阶都是平的；糊的转音是一条波浪线'],
   curve:[[60,-38],[100,-24],[200,-8],[400,-1],[700,0],[1300,-4],[2500,-8],[3500,-11],[5000,-22],[9000,-34],[16000,-50]],
   g:{cq:.45,gap:.05,amp:.6,lar:.55,ps:.6,ae:.3},
   refs:[{t:'The Clark Sisters — You Brought the Sunshine（1981）',w:'整首都是教科书'},{t:'Aretha Franklin — Amazing Grace（1972 现场）',w:'每个长音结尾的装饰'},{t:'The Clara Ward Singers — Surely God Is Able（1949）',w:'艾瑞莎模仿过的转音来源'}]},
  {id:'vibrato',zh:'福音颤音',en:'Gospel Vibrato',era:'福音 → 灵魂乐',
   d:'音高有规律地上下摆动。福音歌手常先唱一段直音，再在长音后半段放出宽而慢的颤音，或者随情绪加宽加快。',
   body:{glottis:'正常闭合，声带张力有节奏地起伏（环甲肌和甲杓肌交替）。',larynx:'放松，不能用喉头去抖。',tract:'稳定。',breath:'稳定支撑，颤音是放出来的，不是压出来的。'},
   watch:['音高轨迹里的正弦波：频率（每秒几次）和宽度（上下多少音分）','“颤音”指标：通常 5–7 次/秒，宽度 ±50–150 音分','注意颤音是不是在长音中途才开始（延迟颤音）'],
   curve:[[60,-38],[100,-22],[200,-8],[400,-1],[650,0],[1200,-4],[2500,-6],[3500,-9],[5000,-20],[9000,-33],[16000,-48]],
   g:{cq:.5,gap:.05,amp:.7,lar:.5,ps:.7,ae:.3,vib:true},
   refs:[{t:'Mahalia Jackson — Move On Up a Little Higher（1948）',w:'宽而慢的颤音'},{t:'Marion Williams — Packin’ Up',w:'Ward Singers 出身，颤音与高音呼喊'},{t:'Sam Cooke（与灵魂激动者）— Touch the Hem of His Garment（1956）',w:'长音尾部的颤音'}]},
  {id:'twang',zh:'鼻腔金属音',en:'Twang / Ring',era:'布道“whoop” → 四重唱 → 灵魂乐',
   d:'把喉咙上方的杓会厌区收窄，声音变得尖、亮、有金属感，不用更大力气就能穿透整个教堂。黑人布道者结尾的吟唱式布道（whooping）大量使用。',
   body:{glottis:'正常闭合。',larynx:'偏高。',tract:'杓会厌括约肌收窄，形成一个小的共鸣管，把 2–4 kHz 大幅抬高。',breath:'不需要很大的压力，靠共鸣取得音量。'},
   watch:['均衡曲线在 2.5–3.5 kHz 有一个突出的峰','“穿透带”能量占比明显升高','频谱重心比其他唱法高'],
   curve:[[60,-44],[100,-26],[250,-14],[500,-8],[1000,-8],[2000,-2],[3000,0],[4000,-4],[6000,-18],[9000,-30],[16000,-46]],
   g:{cq:.5,gap:0,amp:.7,lar:.72,ps:.62,ae:.95},
   refs:[{q:'C.L. Franklin Eagle Stirreth Her Nest',t:'Rev. C.L. Franklin — The Eagle Stirreth Her Nest（布道录音）',w:'艾瑞莎父亲布道结尾的吟唱式“whoop”'},{t:'The Soul Stirrers — By and By（R.H. Harris 领唱时期）',w:'四重唱领唱的亮音',q:'Soul Stirrers By and By'},{t:'Aretha Franklin — Respect（1967）',w:'副歌里明亮的金属感'}]}
];
// 地图页“音乐与唱腔”里的旧编号 → 新唱腔
const LABMAP={call:'holler',shout:'holler',blue:'bend',moan:'moan',lining:'moan',melisma:'runs',growl:'growl',falsetto:'falsetto',vamp:'belt',mod:'belt'};
const BANDS=[
  {k:'body',zh:'胸腔 / 基频',lo:70,hi:250},
  {k:'warm',zh:'温暖',lo:250,hi:700},
  {k:'vowel',zh:'元音 / 鼻腔',lo:700,hi:2000},
  {k:'ring',zh:'穿透带',lo:2000,hi:4000},
  {k:'pres',zh:'临场 / 齿音',lo:4000,hi:7500},
  {k:'air',zh:'气息',lo:7500,hi:16000}
];

(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const NOTE=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const hz2midi=f=>69+12*Math.log2(f/440);
const midiName=m=>{const r=Math.round(m);return NOTE[(r%12+12)%12]+(Math.floor(r/12)-1);};
const FMIN=50,FMAX=16000,NP=240;
const PF=Array.from({length:NP},(_,i)=>FMIN*Math.pow(FMAX/FMIN,i/(NP-1)));
const fx=(f,W)=>W*Math.log(f/FMIN)/Math.log(FMAX/FMIN);
const DBMIN=-66;
const TC={};TECH.forEach(t=>TC[t.id]=t);

/* ---------- state ---------- */
const L={tech:TECH[0].id,ref:null,refFrom:null,refTo:null,morph:1,loop:true,playing:false,src:null,t0:0,media:null,blocked:false};
const clip={buf:null,mono:null,sr:44100,name:'',a:0,b:0,origin:'',link:'',blob:null,preview:null};
let A=null; // analysis of current selection
let ctx=null,an=null,gainN=null,tdBuf=null,fqBuf=null,liveRanges=null;
function ac(){
  if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();
    an=ctx.createAnalyser();an.fftSize=8192;an.smoothingTimeConstant=.5;gainN=ctx.createGain();gainN.connect(an);an.connect(ctx.destination);
    tdBuf=new Float32Array(an.fftSize);fqBuf=new Float32Array(an.frequencyBinCount);
    const bw=ctx.sampleRate/an.fftSize;liveRanges=PF.map(f=>[Math.max(1,Math.floor(f*Math.pow(2,-1/12)/bw)),Math.max(1,Math.ceil(f*Math.pow(2,1/12)/bw))]);}
  if(ctx.state==='suspended')ctx.resume();return ctx;
}

/* ---------- reference curve ---------- */
function refCurve(id){const c=TC[id].curve;return PF.map(f=>{
  if(f<=c[0][0])return c[0][1];if(f>=c[c.length-1][0])return c[c.length-1][1];
  for(let i=1;i<c.length;i++)if(f<=c[i][0]){const [f0,d0]=c[i-1],[f1,d1]=c[i];const t=Math.log(f/f0)/Math.log(f1/f0);return d0+(d1-d0)*t;}});}
function bandShare(curve){const e=BANDS.map(()=>0);let tot=0;
  PF.forEach((f,i)=>{if(f<BANDS[0].lo)return;const p=Math.pow(10,curve[i]/10)*f;BANDS.forEach((b,k)=>{if(f>=b.lo&&f<b.hi){e[k]+=p;tot+=p;}});});
  return e.map(x=>tot?x/tot:0);}
function similarity(a,b){let n=0,sa=0,sb=0;const xs=[],ys=[];PF.forEach((f,i)=>{if(f>=90&&f<=10000){xs.push(a[i]);ys.push(b[i]);}});
  const ma=xs.reduce((s,x)=>s+x,0)/xs.length,mb=ys.reduce((s,x)=>s+x,0)/ys.length;let num=0,da=0,db=0;
  xs.forEach((x,i)=>{num+=(x-ma)*(ys[i]-mb);da+=(x-ma)**2;db+=(ys[i]-mb)**2;});const r=num/Math.sqrt(da*db||1);return Math.max(0,r);}

/* ---------- dsp ---------- */
const fftCache={};
function fft(re,im){const n=re.length;let T=fftCache[n];
  if(!T){T={cos:new Float64Array(n/2),sin:new Float64Array(n/2),rev:new Uint32Array(n)};for(let i=0;i<n/2;i++){T.cos[i]=Math.cos(2*Math.PI*i/n);T.sin[i]=-Math.sin(2*Math.PI*i/n);}
    const bits=Math.log2(n);for(let i=0;i<n;i++){let r=0,x=i;for(let b=0;b<bits;b++){r=(r<<1)|(x&1);x>>=1;}T.rev[i]=r;}fftCache[n]=T;}
  for(let i=0;i<n;i++){const j=T.rev[i];if(j>i){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t;}}
  for(let size=2;size<=n;size<<=1){const half=size>>1,step=n/size;
    for(let i=0;i<n;i+=size)for(let j=0,k=0;j<half;j++,k+=step){const a=i+j,b=a+half;const tr=re[b]*T.cos[k]-im[b]*T.sin[k],ti=re[b]*T.sin[k]+im[b]*T.cos[k];re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti;}}}
function yin(x,s,W,tmin,tmax,d){
  for(let t=1;t<=tmax;t++){let sum=0;for(let i=0;i<W;i++){const v=x[s+i]-x[s+i+t];sum+=v*v;}d[t]=sum;}
  let run=0;d[0]=1;for(let t=1;t<=tmax;t++){run+=d[t];d[t]=run?d[t]*t/run:1;}
  let best=-1;for(let t=tmin;t<=tmax;t++){if(d[t]<.15){while(t+1<=tmax&&d[t+1]<d[t])t++;best=t;break;}}
  if(best<0){let m=Infinity;for(let t=tmin;t<=tmax;t++)if(d[t]<m){m=d[t];best=t;}}
  let tt=best;if(best>tmin&&best<tmax){const a=d[best-1],b=d[best],c=d[best+1],den=a+c-2*b;if(den>0)tt=best+(a-c)/(2*den);}
  return [tt,Math.max(1e-4,Math.min(1,d[best]))];}
const pct=(arr,p)=>{if(!arr.length)return NaN;const s=[...arr].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.max(0,Math.round(p*(s.length-1))))];};

function analyze(){
  if(!clip.mono)return;const sr=clip.sr;const i0=Math.floor(clip.a*sr),i1=Math.floor(clip.b*sr);const seg=clip.mono.subarray(i0,i1);const len=seg.length;
  // pitch on a decimated copy
  const D=Math.max(1,Math.round(sr/11025)),srp=sr/D,dl=Math.floor(len/D),ds=new Float32Array(dl);
  for(let i=0;i<dl;i++){let s=0;for(let j=0;j<D;j++)s+=seg[i*D+j];ds[i]=s/D;}
  const W=Math.round(srp*.025),tmin=Math.floor(srp/1300),tmax=Math.floor(srp/65),hopP=Math.round(srp*.01),dbuf=new Float32Array(tmax+2);
  const nP=Math.max(0,Math.floor((dl-W-tmax)/hopP));const f0=new Float32Array(nP),ap=new Float32Array(nP),rmsP=new Float32Array(nP);
  for(let k=0;k<nP;k++){const s=k*hopP;let e=0;for(let i=0;i<W;i++)e+=ds[s+i]*ds[s+i];rmsP[k]=10*Math.log10(e/W+1e-12);
    const [tt,a]=yin(ds,s,W,tmin,tmax,dbuf);f0[k]=srp/tt;ap[k]=a;}
  const rmax=Math.max(-120,...rmsP);const voiced=new Uint8Array(nP);for(let k=0;k<nP;k++)voiced[k]=(ap[k]<.25&&rmsP[k]>rmax-35)?1:0;
  // spectral pass
  const N=4096,hop=Math.round(sr*.02),nF=Math.max(1,Math.floor((len-N)/hop)+1),H=128,bw=sr/N;
  const win=new Float64Array(N);for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/(N-1));
  const re=new Float64Array(N),im=new Float64Array(N),ltas=new Float64Array(N/2);
  const SG0=60,SG1=12000;const rows=Array.from({length:H},(_,r)=>{const f=SG1*Math.pow(SG0/SG1,r/(H-1));return [Math.max(1,Math.floor(f*Math.pow(2,-1/40)/bw)),Math.max(1,Math.ceil(f*Math.pow(2,1/40)/bw))];});
  const sg=new Float32Array(nF*H),rmsF=new Float32Array(nF),peakAbs={v:0};let ltasN=0;const shr=[];
  const rmsAll=[];for(let f=0;f<nF;f++){const s=f*hop;let e=0;for(let i=0;i<N;i++){const v=seg[s+i]||0;e+=v*v;}rmsF[f]=10*Math.log10(e/N+1e-12);}
  const rfmax=Math.max(-120,...rmsF);
  for(let f=0;f<nF;f++){const s=f*hop;for(let i=0;i<N;i++){const v=seg[s+i]||0;if(Math.abs(v)>peakAbs.v)peakAbs.v=Math.abs(v);re[i]=v*win[i];im[i]=0;}
    fft(re,im);const pw=new Float64Array(N/2);for(let k=0;k<N/2;k++)pw[k]=re[k]*re[k]+im[k]*im[k];
    if(rmsF[f]>rfmax-30){for(let k=0;k<N/2;k++)ltas[k]+=pw[k];ltasN++;}
    for(let r=0;r<H;r++){const [b0,b1]=rows[r];let p=0;for(let k=b0;k<=b1&&k<N/2;k++)p+=pw[k];sg[f*H+r]=10*Math.log10(p/(b1-b0+1)+1e-14);}
    // subharmonic ratio at this time
    const kp=Math.round((s+N/2)/D/hopP);if(kp>=0&&kp<nP&&voiced[kp]){const F=f0[kp];const at=fr=>{const c=Math.round(fr/bw);let m=0;for(let k=c-1;k<=c+1;k++)if(k>0&&k<N/2)m=Math.max(m,pw[k]);return m;};
      const sub=at(F/2)+at(1.5*F),har=at(F)+at(2*F);if(har>0)shr.push(10*Math.log10((sub+1e-14)/har));}}
  const ltDb=PF.map(fq=>{const k0=Math.max(1,Math.floor(fq*Math.pow(2,-1/12)/bw)),k1=Math.max(k0,Math.ceil(fq*Math.pow(2,1/12)/bw));let p=0,n=0;for(let k=k0;k<=k1&&k<N/2;k++){p+=ltas[k];n++;}return 10*Math.log10(p/Math.max(1,n)/Math.max(1,ltasN)+1e-14);});
  const lmax=Math.max(...ltDb);const ltCurve=ltDb.map(v=>Math.max(DBMIN-6,v-lmax));
  let cn=0,cd=0;for(let k=1;k<N/2;k++){const fq=k*bw;if(fq<60||fq>12000)continue;cn+=fq*ltas[k];cd+=ltas[k];}
  // pitch stats
  const vf=[],vm=[];for(let k=0;k<nP;k++)if(voiced[k]){vf.push(f0[k]);vm.push(hz2midi(f0[k]));}
  const hnrs=[];for(let k=0;k<nP;k++)if(voiced[k])hnrs.push(10*Math.log10((1-ap[k])/ap[k]));
  // vibrato, note changes, glide
  const tP=hopP/srp;let vibW=0,vibR=0,vibE=0,changes=0,vSec=0,glide=0;
  let k=0;while(k<nP){if(!voiced[k]){k++;continue;}let e=k;while(e+1<nP&&voiced[e+1]&&Math.abs(hz2midi(f0[e+1])-hz2midi(f0[e]))<1.2)e++;
    const n=e-k+1;vSec+=n*tP;const m=[];for(let i=k;i<=e;i++)m.push(hz2midi(f0[i]));
    // note changes on a median-smoothed, quantised line
    let last=null;for(let i=0;i<n;i++){const w=[m[Math.max(0,i-2)],m[i],m[Math.min(n-1,i+2)]].sort((a,b)=>a-b)[1];const q=Math.round(w);if(last!==null&&q!==last)changes++;last=q;}
    const g30=Math.round(.3/tP);for(let i=0;i+g30<n;i+=2)glide=Math.max(glide,Math.abs(m[i+g30]-m[i]));
    if(n*tP>=.6){const hw=Math.round(.125/tP);const res=[];for(let i=hw;i<n-hw;i++){let s=0;for(let j=i-hw;j<=i+hw;j++)s+=m[j];res.push((m[i]-s/(2*hw+1))*100);}
      // 1 s windows, zero crossings counted with ±6 cent hysteresis so flat, noisy stretches don't count
      const win=Math.round(1/tP),st=Math.round(.5/tP);
      for(let w0=0;w0+win<=res.length;w0+=st){let sign=0,zc=0,ss=0;for(let i=w0;i<w0+win;i++){const v=res[i];ss+=v*v;if(v>6&&sign<=0){if(sign<0)zc++;sign=1;}else if(v<-6&&sign>=0){if(sign>0)zc++;sign=-1;}}
        const rate=zc/2/(win*tP),ext=Math.sqrt(ss/win)*Math.SQRT2;
        if(rate>=3.5&&rate<=9&&ext>=15){vibW+=1;vibR+=rate;vibE+=ext;}}}
    k=e+1;}
  const vr=rmsF.filter(v=>v>rfmax-45);
  A={f0,ap,voiced,tP,nP,sg,nF,H,SG0,SG1,ltCurve,bands:bandShare(ltCurve),centroid:cd?cn/cd:NaN,
    f0lo:pct(vm,.05),f0hi:pct(vm,.95),f0med:pct(vm,.5),hnr:pct(hnrs,.5),shr:pct(shr,.5),
    vib:vibW>=1?{rate:vibR/vibW,ext:vibE/vibW}:null,density:vSec>.3?changes/vSec:NaN,glide,
    dyn:vr.length?pct(vr,.95)-pct(vr,.1):NaN,crest:20*Math.log10(peakAbs.v+1e-9)-(vr.length?vr.reduce((s,x)=>s+x,0)/vr.length:0),voicedPct:nP?vf.length/nP:0};
  drawStatic();renderStats();
}

/* ---------- canvases ---------- */
function fit(c){const dpr=Math.min(2,window.devicePixelRatio||1);const w=c.clientWidth,h=c.clientHeight;if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);return [g,w,h];}
const CS=getComputedStyle(document.documentElement);const tok=n=>CS.getPropertyValue(n).trim();
const COL={ink:tok('--ink'),line:tok('--line'),cream:tok('--cream'),muted:tok('--muted'),gold:tok('--gold'),clay:tok('--clay'),blue:tok('--blue')};
const PAD={l:40,r:10,t:22,b:22};
function drawEQ(live){
  const c=$('#lab-eq');const [g,w,h]=fit(c);g.clearRect(0,0,w,h);const W=w-PAD.l-PAD.r,Hh=h-PAD.t-PAD.b;
  const X=f=>PAD.l+fx(f,W),Y=db=>PAD.t+Hh*(Math.min(0,Math.max(DBMIN,db))/DBMIN);
  g.font='11px '+tok('--f-mono');g.textBaseline='middle';
  BANDS.forEach((b,i)=>{g.fillStyle=i%2?'rgba(134,201,198,.035)':'rgba(232,173,71,.045)';g.fillRect(X(b.lo),PAD.t,X(b.hi)-X(b.lo),Hh);
    g.fillStyle=b.k===curRefPeakBand()?COL.gold:COL.muted;g.textAlign='center';g.fillText(b.zh,(X(b.lo)+X(b.hi))/2,PAD.t-11);});
  g.strokeStyle='rgba(120,128,180,.18)';g.lineWidth=1;g.fillStyle=COL.muted;
  [0,-12,-24,-36,-48,-60].forEach(d=>{g.beginPath();g.moveTo(PAD.l,Y(d));g.lineTo(w-PAD.r,Y(d));g.stroke();g.textAlign='right';g.fillText(d,PAD.l-6,Y(d));});
  [[100,'100'],[250,'250'],[500,'500'],[1000,'1k'],[2000,'2k'],[4000,'4k'],[8000,'8k'],[16000,'16k']].forEach(([f,t])=>{g.beginPath();g.moveTo(X(f),PAD.t);g.lineTo(X(f),PAD.t+Hh);g.stroke();g.textAlign='center';g.fillText(t,X(f),h-9);});
  g.textAlign='left';g.fillText('dB',4,PAD.t-11);g.textAlign='right';g.fillText('Hz',w-PAD.r,h-9);
  const path=(arr)=>{g.beginPath();PF.forEach((f,i)=>{const x=X(f),y=Y(arr[i]);i?g.lineTo(x,y):g.moveTo(x,y);});};
  if(A){path(A.ltCurve);g.lineTo(X(FMAX),PAD.t+Hh);g.lineTo(X(FMIN),PAD.t+Hh);g.closePath();
    const gr=g.createLinearGradient(0,PAD.t,0,PAD.t+Hh);gr.addColorStop(0,'rgba(232,173,71,.55)');gr.addColorStop(1,'rgba(232,173,71,.04)');g.fillStyle=gr;g.fill();
    path(A.ltCurve);g.strokeStyle=COL.gold;g.lineWidth=1.6;g.stroke();}
  if(L.ref){path(L.ref);g.setLineDash([6,5]);g.strokeStyle=COL.blue;g.lineWidth=2;g.stroke();g.setLineDash([]);}
  if(live){path(live);g.strokeStyle=COL.cream;g.lineWidth=1.4;g.stroke();}
}
function curRefPeakBand(){if(!L.ref)return '';let m=-1e9,fm=0;PF.forEach((f,i)=>{if(L.ref[i]>m){m=L.ref[i];fm=f;}});const b=BANDS.find(b=>fm>=b.lo&&fm<b.hi);return b?b.k:'';}
function cmap(v){const s=[[0,[20,22,40]],[.3,[48,52,112]],[.58,[214,105,76]],[.8,[232,173,71]],[1,[248,240,220]]];v=Math.max(0,Math.min(1,v));
  for(let i=1;i<s.length;i++)if(v<=s[i][0]){const [a,ca]=s[i-1],[b,cb]=s[i];const t=(v-a)/(b-a);return ca.map((x,k)=>Math.round(x+(cb[k]-x)*t));}return s[s.length-1][1];}
let sgImg=null;
function buildSG(){if(!A)return sgImg=null;const off=document.createElement('canvas');off.width=A.nF;off.height=A.H;const g=off.getContext('2d');const img=g.createImageData(A.nF,A.H);
  let mx=-1e9;for(const v of A.sg)if(v>mx)mx=v;const lo=mx-75;
  for(let f=0;f<A.nF;f++)for(let r=0;r<A.H;r++){const c=cmap((A.sg[f*A.H+r]-lo)/75);const o=(r*A.nF+f)*4;img.data[o]=c[0];img.data[o+1]=c[1];img.data[o+2]=c[2];img.data[o+3]=255;}
  g.putImageData(img,0,0);sgImg=off;}
function drawSG(pos){
  const c=$('#lab-sg');const [g,w,h]=fit(c);g.fillStyle=COL.ink;g.fillRect(0,0,w,h);const l=38;
  g.font='11px '+tok('--f-mono');g.textBaseline='middle';
  if(!sgImg){g.fillStyle=COL.muted;g.textAlign='center';g.fillText('载入一段声音，这里显示能量在每个频段里如何随时间流动',w/2,h/2);return;}
  g.imageSmoothingEnabled=true;g.drawImage(sgImg,l,0,w-l,h);
  const Yf=f=>h*Math.log(A.SG1/f)/Math.log(A.SG1/A.SG0);
  g.fillStyle=COL.muted;g.textAlign='right';g.strokeStyle='rgba(242,232,210,.25)';g.setLineDash([3,4]);
  [[100,'100'],[250,'250'],[700,'700'],[2000,'2k'],[4000,'4k'],[7500,'7.5k']].forEach(([f,t])=>{const y=Yf(f);g.fillText(t,l-5,y);if(f===2000||f===4000){g.beginPath();g.moveTo(l,y);g.lineTo(w,y);g.stroke();}});g.setLineDash([]);
  if(pos!=null){const x=l+(w-l)*(pos-clip.a)/(clip.b-clip.a);g.strokeStyle=COL.cream;g.lineWidth=1.5;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
}
function drawPitch(pos,liveMidi){
  const c=$('#lab-pt');const [g,w,h]=fit(c);g.fillStyle=COL.ink;g.fillRect(0,0,w,h);const l=38;
  g.font='11px '+tok('--f-mono');g.textBaseline='middle';
  if(!A||!isFinite(A.f0lo)){g.fillStyle=COL.muted;g.textAlign='center';g.fillText(A?'这段里没有找到清楚的人声音高':'音高轨迹：滑音、颤音、转音都会在这里现形',w/2,h/2);return;}
  let lo=Math.floor(A.f0lo)-3,hi=Math.ceil(A.f0hi)+3;if(hi-lo<14){const m=(hi+lo)/2;lo=Math.floor(m-7);hi=Math.ceil(m+7);}
  const Y=m=>h-6-(h-12)*(m-lo)/(hi-lo),X=k=>l+(w-l)*k/Math.max(1,A.nP-1);
  for(let m=lo;m<=hi;m++){const isC=(m%12+12)%12===0;g.strokeStyle=isC?'rgba(232,173,71,.28)':'rgba(120,128,180,.13)';g.beginPath();g.moveTo(l,Y(m));g.lineTo(w,Y(m));g.stroke();
    if(isC||(hi-lo<=20&&m%2===0)){g.fillStyle=isC?COL.gold:COL.muted;g.textAlign='right';g.fillText(midiName(m),l-5,Y(m));}}
  g.lineWidth=2;g.lineCap='round';
  for(let k=1;k<A.nP;k++){if(!A.voiced[k]||!A.voiced[k-1])continue;const m0=hz2midi(A.f0[k-1]),m1=hz2midi(A.f0[k]);if(Math.abs(m1-m0)>1.2)continue;
    const hn=10*Math.log10((1-A.ap[k])/A.ap[k]);g.strokeStyle=hn>15?COL.cream:hn>8?COL.gold:COL.clay;g.beginPath();g.moveTo(X(k-1),Y(m0));g.lineTo(X(k),Y(m1));g.stroke();}
  if(pos!=null){const x=l+(w-l)*(pos-clip.a)/(clip.b-clip.a);g.strokeStyle=COL.blue;g.lineWidth=1.5;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();
    if(liveMidi){g.fillStyle=COL.blue;g.beginPath();g.arc(x,Y(liveMidi),4.5,0,7);g.fill();}}
}
function drawOverview(){
  const c=$('#lab-ov');const [g,w,h]=fit(c);g.fillStyle=COL.ink;g.fillRect(0,0,w,h);
  if(!clip.mono){g.fillStyle=COL.muted;g.font='12px '+tok('--f-body');g.textAlign='center';g.textBaseline='middle';g.fillText('拖入音频文件，或点下面推荐唱片的「试听并解构」',w/2,h/2);return;}
  const d=clip.mono,dur=d.length/clip.sr,spp=d.length/w;
  const xa=w*clip.a/dur,xb=w*clip.b/dur;g.fillStyle='rgba(232,173,71,.13)';g.fillRect(xa,0,xb-xa,h);
  for(let x=0;x<w;x++){let mn=1,mx=-1;const s=Math.floor(x*spp),e=Math.min(d.length,Math.floor((x+1)*spp));for(let i=s;i<e;i+=Math.max(1,Math.floor((e-s)/64))){const v=d[i];if(v<mn)mn=v;if(v>mx)mx=v;}
    g.fillStyle=(x>=xa&&x<=xb)?COL.gold:'#4a5185';g.fillRect(x,h/2-mx*h/2*.95,1,Math.max(1,(mx-mn)*h/2*.95));}
  g.fillStyle=COL.gold;[xa,xb].forEach(x=>g.fillRect(x-1,0,2,h));
  if(L.playing){const p=pos();if(p!=null){g.fillStyle=COL.cream;g.fillRect(w*p/dur-1,0,2,h);}}
}
function drawStatic(){buildSG();drawEQ(null);drawSG(null);drawPitch(null);drawOverview();renderBands(null);}

/* ---------- glottis (schematic) ---------- */
const GS={phase:0,vphase:0,t:0,last:0};
function glottisFrame(ts){
  const t=TC[L.tech].g;const dt=Math.min(.05,(ts-(GS.last||ts))/1000);GS.last=ts;GS.t+=dt;
  let rate=1.3;if(t.vib)rate*=1+.35*Math.sin(GS.t*2*Math.PI*.55);if(L.tech==='runs')rate*=[1,1.6,.8,1.9,1.2][Math.floor(GS.t*3)%5];
  if(!reduced)GS.phase=(GS.phase+dt*rate)%1;GS.vphase=(GS.vphase+dt*rate*.5*(1+.3*Math.sin(GS.t*13)))%1;
  const p=GS.phase,open=p<1-t.cq?Math.sin(Math.PI*p/(1-t.cq)):0;
  const cx=110,top=34,bot=146;const amp=t.amp*26*open,gap=t.gap*14;const thick=t.thin?20:36;
  const edge=s=>{const mx=cx+s*(2+amp),px=cx+s*(gap+amp*.35+1);return `M${cx},${top} Q${mx},${(top+bot)/2} ${px},${bot}`;};
  $('#gl-L').setAttribute('d',edge(-1)+` L${cx-thick-34},${bot-6} Q${cx-thick-46},${(top+bot)/2} ${cx-10},${top-4} Z`);
  $('#gl-R').setAttribute('d',edge(1)+` L${cx+thick+34},${bot-6} Q${cx+thick+46},${(top+bot)/2} ${cx+10},${top-4} Z`);
  $('#gl-gap').setAttribute('d',edge(-1)+` L${cx+gap+amp*.35+1},${bot} Q${cx+2+amp},${(top+bot)/2} ${cx},${top} Z`);
  const vo=t.vent?Math.max(0,Math.sin(GS.vphase*2*Math.PI))*9:0;
  $('#gl-vL').setAttribute('transform',`translate(${-vo},0)`);$('#gl-vR').setAttribute('transform',`translate(${vo},0)`);
  $('#gl-vL').style.opacity=$('#gl-vR').style.opacity=t.vent?1:.35;
  const rx=96-t.ae*30,ry=78-t.ae*22;$('#gl-ae').setAttribute('rx',rx);$('#gl-ae').setAttribute('ry',ry);
  if(!$('#lab-app').hidden)requestAnimationFrame(glottisFrame);
}

/* ---------- live loop ---------- */
function pos(){if(L.media)return clip.a+L.media.currentTime;if(!L.playing||!ctx)return null;const span=clip.b-clip.a;const e=ctx.currentTime-L.t0;return clip.a+(L.loop?e%span:Math.min(e,span));}
let liveYin=null;
let looping=false;
function kick(){if(!looping){looping=true;requestAnimationFrame(liveFrame);}}
function liveFrame(){
  if(!L.playing&&L.morph>=1){looping=false;return;}
  if(L.morph<1){L.morph=Math.min(1,L.morph+.06);const e=1-Math.pow(1-L.morph,3);L.ref=L.refFrom.map((v,i)=>v+(L.refTo[i]-v)*e);}
  let live=null,liveMidi=null;
  if(L.playing&&an){an.getFloatFrequencyData(fqBuf);an.getFloatTimeDomainData(tdBuf);
    const pw=liveRanges.map(([a,b])=>{let s=0,n=0;for(let k=a;k<=b&&k<fqBuf.length;k++){s+=Math.pow(10,fqBuf[k]/10);n++;}return s/Math.max(1,n);});
    let rms=0,pk=0;for(let i=tdBuf.length-2048;i<tdBuf.length;i++){rms+=tdBuf[i]*tdBuf[i];pk=Math.max(pk,Math.abs(tdBuf[i]));}rms=10*Math.log10(rms/2048+1e-12);const pkdb=20*Math.log10(pk+1e-9);
    const db=pw.map(p=>10*Math.log10(p+1e-14));const mx=Math.max(...db);if(mx>-110)live=db.map(v=>v-mx);
    const sr=ctx.sampleRate,W=Math.round(sr*.025),tmax=Math.floor(sr/65),tmin=Math.floor(sr/1300);if(!liveYin||liveYin.length<tmax+2)liveYin=new Float32Array(tmax+2);
    let hnr=NaN;if(rms>-50){const [tt,a]=yin(tdBuf,tdBuf.length-W-tmax-1,W,tmin,tmax,liveYin);if(a<.3){liveMidi=hz2midi(sr/tt);hnr=10*Math.log10((1-a)/a);}}
    drawScope();drawMeter(rms,pkdb);
    $('#lv-f0').textContent=liveMidi?(midiName(liveMidi)+' '+fmtCents(liveMidi)):'—';
    $('#lv-hz').textContent=liveMidi?Math.round(440*Math.pow(2,(liveMidi-69)/12))+' Hz':'';
    $('#lv-hnr').textContent=isFinite(hnr)?hnr.toFixed(1)+' dB':'—';
    if(live)renderBands(bandShare(live));}
  const p=pos();drawEQ(live);if(L.playing){drawSG(p);drawPitch(p,liveMidi);drawOverview();$('#lab-time').textContent=fmtT(p-clip.a)+' / '+fmtT(clip.b-clip.a);}
  requestAnimationFrame(liveFrame);
}
const fmtCents=m=>{const c=Math.round((m-Math.round(m))*100);return (c>=0?'+':'')+c+'¢';};
const fmtT=s=>{s=Math.max(0,s||0);return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')+'.'+Math.floor(s*10%10);};
function drawScope(){const c=$('#lab-scope');const [g,w,h]=fit(c);g.fillStyle=COL.ink;g.fillRect(0,0,w,h);
  g.strokeStyle='rgba(120,128,180,.2)';g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();
  const n=1200;let s=tdBuf.length-n-800;for(let i=s;i<s+800;i++)if(tdBuf[i-1]<0&&tdBuf[i]>=0){s=i;break;}
  let mx=.02;for(let i=s;i<s+n;i++)mx=Math.max(mx,Math.abs(tdBuf[i]));
  g.strokeStyle=COL.gold;g.lineWidth=1.4;g.beginPath();for(let i=0;i<n;i++){const x=w*i/n,y=h/2-tdBuf[s+i]/mx*h*.44;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
const meterHold={v:-90,t:0};
function drawMeter(rms,pk){const c=$('#lab-meter');const [g,w,h]=fit(c);g.fillStyle=COL.ink;g.fillRect(0,0,w,h);
  const X=d=>w*(Math.max(-60,Math.min(0,d))+60)/60;g.fillStyle=COL.gold;g.fillRect(0,h*.15,X(rms),h*.3);g.fillStyle=COL.clay;g.fillRect(0,h*.55,X(pk),h*.3);
  if(pk>meterHold.v||performance.now()-meterHold.t>1200){meterHold.v=pk;meterHold.t=performance.now();}g.fillStyle=COL.cream;g.fillRect(X(meterHold.v)-1,h*.55,2,h*.3);
  $('#lv-rms').textContent=rms.toFixed(1);$('#lv-pk').textContent=pk.toFixed(1);}

/* ---------- ui ---------- */
function renderBands(live){
  const ref=L.ref?bandShare(L.ref):BANDS.map(()=>0);const cl=live||(A?A.bands:null);
  $('#lab-bands').innerHTML=BANDS.map((b,i)=>'<div class="bb"><div class="bb-n">'+b.zh+'<span>'+(b.lo>=1000?b.lo/1000+'k':b.lo)+'–'+(b.hi>=1000?b.hi/1000+'k':b.hi)+'</span></div><div class="bb-t"><i class="bb-c" style="width:'+(cl?Math.round(cl[i]*100):0)+'%"></i><i class="bb-r" style="left:'+Math.round(ref[i]*100)+'%"></i></div><div class="bb-v">'+(cl?Math.round(cl[i]*100)+'%':'—')+'</div></div>').join('');
}
function renderStats(){
  const s=A;const f=(v,d,u)=>isFinite(v)?v.toFixed(d)+(u||''):'—';
  const items=s?[
    ['与参考的相似度',f(similarity(s.ltCurve,refCurve(L.tech))*100,0,'%'),'本片段的平均频谱和“'+TC[L.tech].zh+'”参考曲线的形状相关度'],
    ['音域',isFinite(s.f0lo)?midiName(s.f0lo)+' – '+midiName(s.f0hi):'—','5%–95% 的人声音高范围；中位 '+(isFinite(s.f0med)?midiName(s.f0med):'—')],
    ['谐噪比 HNR',f(s.hnr,1,' dB'),'越低越“沙”、越多气声；干净的强混通常在 15 dB 以上'],
    ['次谐波',f(s.shr,1,' dB'),'基频一半处的能量相对谐波；嘶吼会明显升高'],
    ['颤音',s.vib?s.vib.rate.toFixed(1)+' Hz · ±'+Math.round(s.vib.ext)+'¢':'未检出','稳定长音里的颤音速度和宽度'],
    ['音符变化',f(s.density,1,' /秒'),'转音越密，这个数越大'],
    ['最大滑音',f(s.glide,1,' 半音'),'0.3 秒内音高移动的最大幅度'],
    ['动态范围',f(s.dyn,1,' dB'),'最响和较弱的人声段落之间的落差'],
    ['峰值因数',f(s.crest,1,' dB'),'瞬间峰值比平均电平高多少；起音越猛越大'],
    ['频谱重心',isFinite(s.centroid)?Math.round(s.centroid)+' Hz':'—','能量的“重心”位置，越高越亮']
  ]:[];
  $('#lab-stats').innerHTML=s?items.map(([k,v,d])=>'<div class="st"><div class="st-k">'+k+'</div><div class="st-v">'+v+'</div><div class="st-d">'+d+'</div></div>').join(''):'<p class="empty">载入一段声音后，这里会给出整段的测量结果。</p>';
}
function renderTech(){
  const t=TC[L.tech];
  $('#tlist').querySelectorAll('.tbtn').forEach(b=>{b.classList.toggle('active',b.dataset.id===L.tech);b.setAttribute('aria-pressed',b.dataset.id===L.tech);});
  $('#th-name').innerHTML=esc(t.zh)+'<span class="en">'+esc(t.en)+'</span>';$('#th-era').textContent=t.era;$('#th-d').textContent=t.d;
  $('#th-body').innerHTML=[['声门',t.body.glottis],['喉位',t.body.larynx],['声道',t.body.tract],['气息',t.body.breath]].map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+esc(v)+'</dd></div>').join('');
  $('#th-watch').innerHTML=t.watch.map(w=>'<li>'+esc(w)+'</li>').join('');
  [['m-cq',t.g.cq],['m-lar',t.g.lar],['m-ps',t.g.ps]].forEach(([id,v])=>$('#'+id).style.width=Math.round(v*100)+'%');
  $('#m-cqv').textContent=t.g.cq.toFixed(2);
  renderRefs();renderLib();
  const to=refCurve(L.tech);L.refFrom=L.ref||to;L.refTo=to;L.morph=reduced?1:0;if(reduced)L.ref=to;
  kick();
  renderBands(null);if(A)renderStats();
}
const amSearch=q=>'https://music.apple.com/us/search?term='+encodeURIComponent(q);
const refQ=r=>r.q||r.t.replace(/（.*?）/g,'').replace(/—/g,' ').replace(/\s+/g,' ').trim();
function renderRefs(){
  const t=TC[L.tech];
  $('#lab-refs').innerHTML=t.refs.map((r,i)=>'<li><div class="rt">'+esc(r.t)+'</div><div class="rw">'+esc(r.w)+'</div><div class="ra"><button class="mini" type="button" data-pv="'+i+'">▶ 试听并解构</button><a class="mini" href="'+amSearch(refQ(r))+'" target="_blank" rel="noopener">Apple Music ↗</a></div><div class="rs" id="rs-'+i+'"></div></li>').join('');
  $('#lab-refs').querySelectorAll('[data-pv]').forEach(b=>b.onclick=()=>playPreview(t.refs[+b.dataset.pv],+b.dataset.pv,0));
}

/* ---------- sources ---------- */
function setStatus(msg,kind){const s=$('#lab-status');s.textContent=msg||'';s.className='status'+(kind?' '+kind:'');}
async function loadArrayBuffer(ab,name,origin,extra){
  if(!ac()){setStatus('这个浏览器不支持网页音频分析。','err');return false;}
  stop();setStatus('解码中…');
  let buf;try{buf=await ctx.decodeAudioData(ab.slice(0));}catch(e){setStatus('读不了这个文件。试试 mp3、m4a、wav 或 aac。','err');return false;}
  const ch=buf.numberOfChannels,n=buf.length,mono=new Float32Array(n);for(let c=0;c<ch;c++){const d=buf.getChannelData(c);for(let i=0;i<n;i++)mono[i]+=d[i]/ch;}
  Object.assign(clip,{buf,mono,sr:buf.sampleRate,name,origin,link:'',blob:null,preview:null},extra||{});
  const dur=n/buf.sampleRate;clip.a=extra&&extra.a!=null?extra.a:0;clip.b=extra&&extra.b!=null?extra.b:Math.min(dur,30);
  $('#lab-name').textContent=name;$('#lab-src').innerHTML=clip.link?'<a href="'+clip.link+'" target="_blank" rel="noopener">在 Apple Music 打开 ↗</a>':'';
  $('#lab-play').disabled=false;$('#lab-save').disabled=false;
  setStatus('分析中…');await new Promise(r=>setTimeout(r,20));analyze();setStatus(origin==='preview'?'Apple Music 30 秒试听片段':'');
  $('#lab-time').textContent='0:00.0 / '+fmtT(clip.b-clip.a);return true;
}
async function loadFile(file){const ab=await file.arrayBuffer();const ok=await loadArrayBuffer(ab,file.name,'file');if(ok)clip.blob=file;}
// iTunes Search API via JSONP (works when the page is opened as a local file; the claude.ai sandbox blocks it)
let jsonpN=0;
function itunes(q){return new Promise((res,rej)=>{const cb='__itunes'+(++jsonpN);const s=document.createElement('script');
  const done=()=>{clearTimeout(tm);try{delete window[cb];}catch(e){window[cb]=undefined;}s.remove();};
  const tm=setTimeout(()=>{done();rej(new Error('timeout'));},8000);
  window[cb]=d=>{done();res((d&&d.results)||[]);};s.onerror=()=>{done();rej(new Error('blocked'));};
  s.src='https://itunes.apple.com/search?media=music&entity=song&limit=8&country=US&term='+encodeURIComponent(q)+'&callback='+cb;document.head.appendChild(s);});}
const pvCache={};
async function playPreview(ref,i,alt){
  const box=$('#rs-'+i);const q=refQ(ref);
  if(L.blocked){box.innerHTML=blockedMsg(q);return;}
  box.textContent='正在 Apple Music 里找…';
  let rs=pvCache[q];if(!rs){try{rs=pvCache[q]=(await itunes(q)).filter(r=>r.previewUrl);}catch(e){L.blocked=true;box.innerHTML=blockedMsg(q);return;}}
  if(!rs.length){box.innerHTML='Apple Music 里没找到这首的试听。<a href="'+amSearch(q)+'" target="_blank" rel="noopener">去官网搜 ↗</a>';return;}
  const r=rs[alt%rs.length];
  box.innerHTML='正在用：'+esc(r.artistName)+' — '+esc(r.trackName)+(r.collectionName?' <span class="dim">（'+esc(r.collectionName)+'）</span>':'')+(rs.length>1?' <button class="mini" type="button">换一个版本</button>':'');
  const sw=box.querySelector('button');if(sw)sw.onclick=()=>playPreview(ref,i,alt+1);
  let ab=null;try{const resp=await fetch(r.previewUrl,{mode:'cors'});if(!resp.ok)throw 0;ab=await resp.arrayBuffer();}catch(e){ab=null;}
  if(ab){const ok=await loadArrayBuffer(ab,r.artistName+' — '+r.trackName,'preview',{link:r.trackViewUrl,preview:{q,alt}});if(ok){clip.link=r.trackViewUrl;$('#lab-src').innerHTML='<a href="'+r.trackViewUrl+'" target="_blank" rel="noopener">在 Apple Music 打开 ↗</a>';play();}}
  else{ // fall back to plain playback without analysis
    stop();const m=new Audio(r.previewUrl);L.media=m;if(window.MUSIC)MUSIC.duck(true);m.play().catch(()=>{});m.onended=()=>{L.media=null;if(window.MUSIC)MUSIC.duck(false);};
    setStatus('浏览器不允许分析这段试听的频谱（跨域限制），现在只能直接播放。想看曲线，可以把自己的音频文件拖进来。','warn');}
}
function blockedMsg(q){return '在 claude.ai 网页里，安全设置不允许页面直接连 Apple Music。把 index.html 下载下来，用浏览器打开就能直接试听和解构。现在可以：<a href="'+amSearch(q)+'" target="_blank" rel="noopener">去 Apple Music 听 ↗</a>，或者把自己的音频拖进来。';}

/* ---------- transport ---------- */
function play(){
  if(L.media){L.media.pause();L.media=null;}
  if(!clip.buf||!ac())return;stop();const s=ctx.createBufferSource();s.buffer=clip.buf;s.loop=L.loop;s.loopStart=clip.a;s.loopEnd=clip.b;s.connect(gainN);
  if(L.loop)s.start(0,clip.a);else s.start(0,clip.a,clip.b-clip.a);
  L.src=s;L.t0=ctx.currentTime;L.playing=true;if(window.MUSIC)MUSIC.duck(true);s.onended=()=>{if(L.src===s){L.playing=false;L.src=null;if(window.MUSIC)MUSIC.duck(false);syncTransport();drawStatic();}};
  syncTransport();kick();
}
function stop(){if(L.src){const s=L.src;L.src=null;try{s.stop();}catch(e){}}if(L.media){L.media.pause();L.media=null;}L.playing=false;if(window.MUSIC)MUSIC.duck(false);syncTransport();}
function syncTransport(){$('#lab-play').textContent=L.playing?'■ 停止':'▶ 播放选区';$('#lab-loop').classList.toggle('on',L.loop);}
$('#lab-play').onclick=()=>{if(L.playing){stop();drawStatic();}else play();};
$('#lab-loop').onclick=()=>{L.loop=!L.loop;syncTransport();if(L.playing)play();};
$('#lab-file').onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)loadFile(f);e.target.value='';};
const app=$('#lab-app');
app.addEventListener('dragover',e=>{e.preventDefault();app.classList.add('drag');});
app.addEventListener('dragleave',e=>{if(e.target===app)app.classList.remove('drag');});
app.addEventListener('drop',e=>{e.preventDefault();app.classList.remove('drag');const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)loadFile(f);});
// selection on the overview
(function(){const c=$('#lab-ov');let drag=null;
  const tAt=e=>{const r=c.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*clip.mono.length/clip.sr;};
  c.addEventListener('pointerdown',e=>{if(!clip.mono)return;c.setPointerCapture(e.pointerId);const t=tAt(e),dur=clip.mono.length/clip.sr,tol=dur*.015;
    drag=Math.abs(t-clip.a)<tol?'a':Math.abs(t-clip.b)<tol?'b':'new';if(drag==='new'){clip.a=t;clip.b=Math.min(dur,t+.5);drag='b';}drawOverview();});
  c.addEventListener('pointermove',e=>{if(!drag)return;const t=tAt(e);if(drag==='a')clip.a=Math.min(t,clip.b-.3);else clip.b=Math.max(t,clip.a+.3);
    if(clip.b-clip.a>30){if(drag==='a')clip.b=clip.a+30;else clip.a=clip.b-30;}drawOverview();$('#lab-time').textContent='0:00.0 / '+fmtT(clip.b-clip.a);});
  const up=()=>{if(!drag)return;drag=null;const was=L.playing;stop();setStatus('分析中…');setTimeout(()=>{analyze();setStatus('');if(was)play();},20);};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);})();

/* ---------- library (this browser only) ---------- */
let idb=null;
function openDB(){return new Promise(res=>{try{const r=indexedDB.open('vocal-anatomy',1);r.onupgradeneeded=()=>r.result.createObjectStore('clips',{keyPath:'id',autoIncrement:true});r.onsuccess=()=>res(idb=r.result);r.onerror=()=>res(null);}catch(e){res(null);}});}
function tx(mode){return idb.transaction('clips',mode).objectStore('clips');}
function allClips(){return new Promise(res=>{if(!idb)return res([]);try{const r=tx('readonly').getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>res([]);}catch(e){res([]);}});}
async function renderLib(){
  const box=$('#lab-lib');if(!idb){box.innerHTML='<p class="empty">这个浏览器不能保存片段（可能是隐私模式）。</p>';return;}
  const list=(await allClips()).filter(c=>c.tech===L.tech);
  box.innerHTML=list.length?list.map(c=>'<li><span class="rt">'+esc(c.name)+'</span><span class="dim">'+fmtT(c.a)+'–'+fmtT(c.b)+(c.preview?' · 试听':'')+'</span><span class="ra"><button class="mini" type="button" data-load="'+c.id+'">载入</button><button class="mini" type="button" data-del="'+c.id+'">删除</button></span></li>').join(''):'<p class="empty">还没有保存过“'+esc(TC[L.tech].zh)+'”的片段。载入声音、选好一段，点“保存到片段库”。</p>';
  box.querySelectorAll('[data-load]').forEach(b=>b.onclick=async()=>{const c=list.find(x=>x.id==b.dataset.load);if(!c)return;
    if(c.blob){const ok=await loadArrayBuffer(await c.blob.arrayBuffer(),c.name,'file',{a:c.a,b:c.b});if(ok){clip.blob=c.blob;play();}}
    else if(c.preview){const ref={t:c.name,q:c.preview.q,w:''};const tmp=document.createElement('div');tmp.id='rs-lib';box.appendChild(tmp);await playPreview(ref,'lib',c.preview.alt||0);if(clip.mono){clip.a=c.a;clip.b=c.b;analyze();if(L.playing)play();}}});
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{try{const r=tx('readwrite').delete(+b.dataset.del);r.onsuccess=()=>renderLib();}catch(e){}});
}
$('#lab-save').onclick=()=>{if(!idb||!clip.mono)return;const rec={tech:L.tech,name:clip.name,a:clip.a,b:clip.b,t:Date.now()};
  if(clip.origin==='preview')rec.preview=clip.preview;else if(clip.blob)rec.blob=clip.blob;else return;
  try{const r=tx('readwrite').add(rec);r.onsuccess=()=>{setStatus('已保存到“'+TC[L.tech].zh+'”的片段库（只存在这个浏览器里）。','ok');renderLib();};r.onerror=()=>setStatus('保存失败：浏览器存储空间可能不够。','err');}catch(e){setStatus('保存失败。','err');}};

/* ---------- technique list & mode ---------- */
$('#tlist').innerHTML=TECH.map(t=>'<button class="tbtn" type="button" data-id="'+t.id+'"><span class="tz">'+esc(t.zh)+'</span><span class="te">'+esc(t.en)+'</span><canvas class="tspark" width="96" height="26" aria-hidden="true"></canvas></button>').join('');
$('#tlist').querySelectorAll('.tbtn').forEach(b=>{b.onclick=()=>{L.tech=b.dataset.id;renderTech();try{history.replaceState(null,'','#lab-'+L.tech);}catch(e){}};
  const c=b.querySelector('canvas'),g=c.getContext('2d'),cv=refCurve(b.dataset.id);g.strokeStyle=COL.gold;g.lineWidth=1.5;g.beginPath();
  PF.forEach((f,i)=>{const x=96*i/(NP-1),y=2+22*(Math.max(DBMIN,cv[i])/DBMIN);i?g.lineTo(x,y):g.moveTo(x,y);});g.stroke();});

function show(id){L.tech=TC[id]?id:L.tech;renderTech();drawStatic();GS.last=0;requestAnimationFrame(glottisFrame);}
window.LAB_APP={show,stop};
window.addEventListener('resize',()=>{if(!$('#lab-app').hidden)drawStatic();});
openDB().then(()=>renderLib());
renderStats();
})();
