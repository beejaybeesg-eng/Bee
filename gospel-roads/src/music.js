/* ===== 配乐与音效：全部在浏览器里实时合成 ===== */
(function(){
const mtof=m=>440*Math.pow(2,(m-69)/12);
const KEY='gospel-roads-music';
let pref={on:true,vol:.55};
try{Object.assign(pref,JSON.parse(localStorage.getItem(KEY))||{});}catch(e){}
const savePref=()=>{try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}};

/* ---------- engine (works on a live or an offline context) ---------- */
function Engine(ctx){
  const E={ctx};
  const sr=ctx.sampleRate;
  // shared noise
  const nb=ctx.createBuffer(1,sr*2,sr);{const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
  // buses
  E.out=ctx.createGain();
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.25;
  E.out.connect(comp);comp.connect(ctx.destination);
  E.music=ctx.createGain();E.music.connect(E.out);
  E.sfx=ctx.createGain();E.sfx.gain.value=.9;E.sfx.connect(E.out);
  // church-ish reverb
  const ir=ctx.createBuffer(2,Math.round(sr*2.8),sr);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3.2);}
  const conv=ctx.createConvolver();conv.buffer=ir;const revOut=ctx.createGain();revOut.gain.value=.55;conv.connect(revOut);revOut.connect(E.music);
  E.rev=conv;
  const sfxRev=ctx.createGain();sfxRev.gain.value=.25;sfxRev.connect(conv);
  E.sfxRev=sfxRev;

  /* ----- helpers ----- */
  const env=(g,t,a,peak,hold,rel)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(.0001,t+a+hold+rel);return t+a+hold+rel;};
  const noise=(t,dur,out)=>{const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;s.connect(out);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);return s;};
  E.noiseHit=(t,out,{type='bandpass',f=1000,q=1,vol=.3,a=.002,d=.1}={})=>{const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ctx.createGain();fl.connect(g);g.connect(out);noise(t,a+d+.02,fl);env(g,t,a,vol,0,d);};

  /* ----- plucked strings: Karplus-Strong, cached per note ----- */
  const ksCache={};
  const KS={kora:{decay:.9985,bright:.55,dur:2.6},banjo:{decay:.993,bright:.8,dur:1.2},guitar:{decay:.997,bright:.45,dur:2.4},mute:{decay:.97,bright:.5,dur:.35}};
  function ksBuf(m,kind){const k=kind+m;if(ksCache[k])return ksCache[k];const P=KS[kind],f=mtof(m),N=Math.max(2,Math.round(sr/f-.5)),len=Math.round(sr*P.dur);
    const b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0);let prev=0;for(let i=0;i<N;i++){prev+=P.bright*((Math.random()*2-1)-prev);d[i]=prev;}
    for(let i=N;i<len;i++)d[i]=P.decay*.5*(d[i-N]+(i-N-1>=0?d[i-N-1]:0));
    let pk=0;for(let i=0;i<len;i++)pk=Math.max(pk,Math.abs(d[i]));for(let i=0;i<len;i++)d[i]/=pk||1;
    return ksCache[k]={b,rate:f/(sr/(N+.5))};}
  E.pluck=(m,t,out,kind='guitar',{vol=.3,from=null,glide=.12,dur=null}={})=>{const {b,rate}=ksBuf(m,kind);const s=ctx.createBufferSource();s.buffer=b;
    if(from!=null){s.playbackRate.setValueAtTime(rate*mtof(from)/mtof(m),t);s.playbackRate.linearRampToValueAtTime(rate,t+glide);}else s.playbackRate.value=rate;
    const g=ctx.createGain();g.gain.value=vol;s.connect(g);g.connect(out);s.start(t);const D=dur||KS[kind].dur;if(dur){g.gain.setValueAtTime(vol,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.06);}s.stop(t+D+.1);};

  /* ----- organs ----- */
  E.organ=(notes,t,dur,out,{vol=.05,leslie=6.2,drawbars=[[.5,.7],[1,1],[1.5,.55],[2,.5],[4,.15]],atk=.02}={})=>{
    const g=ctx.createGain();const tr=ctx.createOscillator();tr.frequency.value=leslie;const tg=ctx.createGain();tg.gain.value=.22;tr.connect(tg);
    const am=ctx.createGain();am.gain.value=.78;tg.connect(am.gain);g.connect(am);am.connect(out);
    notes.forEach(m=>drawbars.forEach(([r,a])=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=mtof(m)*r;const og=ctx.createGain();og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+dur+.4);}));
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+atk);g.gain.setValueAtTime(vol,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.25);tr.start(t);tr.stop(t+dur+.4);};
  E.reed=(notes,t,dur,out,{vol=.04}={})=>{const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;lp.Q.value=.5;const g=ctx.createGain();lp.connect(g);g.connect(out);
    notes.forEach(m=>['sawtooth','square'].forEach((ty,k)=>{const o=ctx.createOscillator();o.type=ty;o.frequency.value=mtof(m);o.detune.value=k?6:-4;const og=ctx.createGain();og.gain.value=k?.35:.6;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.6);}));
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.12);g.gain.setValueAtTime(vol,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.45);};

  /* ----- voices ----- */
  function formantVoice(m,t,dur,out,{vol=.05,vowel='oo',atk=.25,rel=.5,from=null,glide=.2,vib=.012,det=0}={}){
    const F=vowel==='ah'?[[730,1],[1090,.6],[2440,.2]]:vowel==='mm'?[[260,1],[1000,.08],[2200,.05]]:[[330,1],[870,.5],[2250,.12]];
    const g=ctx.createGain();g.connect(out);const sum=ctx.createGain();
    F.forEach(([f,a])=>{const b=ctx.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=f<500?3:6;const bg=ctx.createGain();bg.gain.value=a*3;sum.connect(b);b.connect(bg);bg.connect(g);});
    const lfo=ctx.createOscillator();lfo.frequency.value=5.2;const lg=ctx.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(mtof(m)*vib,t+Math.min(.6,dur*.7));lfo.connect(lg);
    [-7,7].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.detune.value=d+det;if(from!=null){o.frequency.setValueAtTime(mtof(from),t);o.frequency.exponentialRampToValueAtTime(mtof(m),t+glide);}else o.frequency.value=mtof(m);lg.connect(o.frequency);o.connect(sum);o.start(t);o.stop(t+dur+rel+.1);});
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+atk);g.gain.setValueAtTime(vol,t+Math.max(atk,dur));g.gain.linearRampToValueAtTime(0,t+dur+rel);lfo.start(t);lfo.stop(t+dur+rel+.1);}
  E.choir=(notes,t,dur,out,o={})=>notes.forEach((m,i)=>formantVoice(m,t+i*.015,dur,out,Object.assign({det:i*3},o)));
  E.hum=(m,t,dur,out,o={})=>formantVoice(m,t,dur,out,Object.assign({vowel:'oo',atk:.08,rel:.25},o));

  /* ----- keys, bass, horns, harmonica ----- */
  E.ep=(notes,t,out,{vol=.07,dur=2.2}={})=>notes.forEach((m,i)=>{const f=mtof(m),c=ctx.createOscillator(),md=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain(),tt=t+i*.008;
    c.frequency.value=f;md.frequency.value=f;mg.gain.setValueAtTime(f*1.6,tt);mg.gain.exponentialRampToValueAtTime(f*.25,tt+.6);md.connect(mg);mg.connect(c.frequency);c.connect(g);g.connect(out);
    const bell=ctx.createOscillator();bell.frequency.value=f*7;const bg=ctx.createGain();bell.connect(bg);bg.connect(g);env(bg,tt,.002,.06,0,.15);
    env(g,tt,.004,vol,.05,dur);[c,md,bell].forEach(o=>{o.start(tt);o.stop(tt+dur+.2);});});
  E.bass=(m,t,dur,out,{vol=.28,type='upright',from=null}={})=>{const o=ctx.createOscillator(),o2=ctx.createOscillator(),lp=ctx.createBiquadFilter(),g=ctx.createGain();
    o.type='triangle';o2.type='sine';[o,o2].forEach(x=>{if(from!=null){x.frequency.setValueAtTime(mtof(from),t);x.frequency.exponentialRampToValueAtTime(mtof(m),t+.08);}else x.frequency.value=mtof(m);});
    lp.type='lowpass';lp.frequency.value=type==='upright'?700:450;o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(out);
    if(type==='upright')env(g,t,.008,vol,.02,Math.max(.25,dur));else{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.setValueAtTime(vol*.85,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.06);}
    o.start(t);o2.start(t);o.stop(t+dur+.7);o2.stop(t+dur+.7);};
  E.brass=(notes,t,dur,out,{vol=.05}={})=>{const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(400,t);lp.frequency.linearRampToValueAtTime(3200,t+.05);lp.frequency.exponentialRampToValueAtTime(1200,t+dur);
    const g=ctx.createGain();lp.connect(g);g.connect(out);notes.forEach(m=>[-9,0,9].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.2);}));
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.setValueAtTime(vol*.8,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.1);};
  E.harp=(m,t,dur,out,{vol=.07,from=null,glide=.15}={})=>{const o=ctx.createOscillator(),o2=ctx.createOscillator(),bp=ctx.createBiquadFilter(),g=ctx.createGain();o.type='square';o2.type='sawtooth';o2.detune.value=8;
    [o,o2].forEach(x=>{if(from!=null){x.frequency.setValueAtTime(mtof(from),t);x.frequency.exponentialRampToValueAtTime(mtof(m),t+glide);}else x.frequency.value=mtof(m);});
    const lfo=ctx.createOscillator();lfo.frequency.value=6;const lg=ctx.createGain();lg.gain.value=0;lg.gain.linearRampToValueAtTime(.3,t+.3);lfo.connect(lg);const am=ctx.createGain();am.gain.value=.7;lg.connect(am.gain);
    bp.type='bandpass';bp.frequency.value=1400;bp.Q.value=.8;o.connect(bp);o2.connect(bp);bp.connect(am);am.connect(g);g.connect(out);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.04);g.gain.setValueAtTime(vol,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.08);[o,o2,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.15);});};

  /* ----- percussion ----- */
  E.kick=(t,out,v=.7)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);o.connect(g);g.connect(out);env(g,t,.003,v,0,.32);o.start(t);o.stop(t+.4);};
  E.snare=(t,out,v=.3)=>{E.noiseHit(t,out,{type:'bandpass',f:1900,q:.7,vol:v,d:.16});const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=190;o.connect(g);g.connect(out);env(g,t,.002,v*.6,0,.09);o.start(t);o.stop(t+.15);};
  E.hat=(t,out,v=.08,open=false)=>E.noiseHit(t,out,{type:'highpass',f:7500,q:.5,vol:v,d:open?.25:.04});
  E.clap=(t,out,v=.25)=>[0,.011,.022].forEach((d,i)=>E.noiseHit(t+d,out,{type:'bandpass',f:1250,q:1.1,vol:v*(i===2?1:.7),d:i===2?.13:.02}));
  E.tamb=(t,out,v=.1)=>{E.noiseHit(t,out,{type:'highpass',f:6500,q:.4,vol:v,d:.09});E.noiseHit(t+.012,out,{type:'bandpass',f:9500,q:4,vol:v*.6,d:.12});};
  E.shaker=(t,out,v=.05)=>E.noiseHit(t,out,{type:'bandpass',f:5200,q:1.4,vol:v,a:.012,d:.05});
  E.stomp=(t,out,v=.5)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);o.connect(g);g.connect(out);env(g,t,.004,v,0,.22);o.start(t);o.stop(t+.3);E.noiseHit(t,out,{type:'lowpass',f:500,vol:v*.4,d:.07});};
  E.wood=(t,out,v=.18)=>{const o=ctx.createOscillator(),g=ctx.createGain(),b=ctx.createBiquadFilter();o.frequency.value=1250;b.type='bandpass';b.frequency.value=1250;b.Q.value=8;o.connect(b);b.connect(g);g.connect(out);env(g,t,.001,v,0,.05);o.start(t);o.stop(t+.08);};
  E.djembe=(t,out,kind='bass',v=.5)=>{const f=kind==='bass'?95:kind==='tone'?260:420;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(f*1.4,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);o.connect(g);g.connect(out);env(g,t,.002,v,0,kind==='bass'?.35:.16);o.start(t);o.stop(t+.4);
    if(kind==='slap')E.noiseHit(t,out,{type:'highpass',f:2500,vol:v*.5,d:.05});};
  E.bell=(t,out,v=.08,f=880)=>[[1,1],[2.76,.4],[5.4,.15]].forEach(([r,a])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f*r;o.connect(g);g.connect(out);env(g,t,.001,v*a,0,.35/r+.08);o.start(t);o.stop(t+.5);});
  E.brush=(t,out,v=.08,len=.12)=>E.noiseHit(t,out,{type:'bandpass',f:3200,q:.5,vol:v,a:.02,d:len});
  return E;
}

/* ---------- tracks ---------- */
// each: tempo-derived step length, steps per bar, bars per loop, bar(E, t, i, out) schedules one bar
const CH=(...n)=>n;
const TRACKS={
  africa:{name:'西非 · 科拉琴与铃',step:60/(96*3),steps:12,rev:.25,vol:1,
    bar(E,t,i,o,s){const B=[[41,[[0,65],[2,72],[3,69],[5,65],[6,72],[8,69],[9,67],[11,65]]],[48,[[0,64],[2,72],[3,67],[5,64],[6,72],[8,67],[9,65],[11,64]]],[46,[[0,62],[2,70],[3,65],[5,62],[6,70],[8,65],[9,67],[11,69]]],[48,[[0,64],[2,72],[3,67],[5,64],[6,72],[8,67],[9,69],[10,72],[11,74]]]][i%4];
      E.pluck(B[0],t,o,'kora',{vol:.32});B[1].forEach(([k,m])=>E.pluck(m,t+k*s,o,'kora',{vol:.2+(k%3===0?.06:0)}));
      if(i%8>=4)[1,4,7,10].forEach(k=>{if(Math.random()<.55)E.pluck([72,74,77,79,81][Math.floor(Math.random()*5)],t+k*s,o,'kora',{vol:.13});});
      if(i>=2)[0,2,4,5,7,9,11].forEach(k=>E.bell(t+k*s,o,.035,1320));
      [[0,'bass'],[6,'bass'],[3,'tone'],[9,'tone'],[10,'slap']].forEach(([k,ty],j)=>{if(i>=1&&(ty!=='slap'||i%2))E.djembe(t+k*s,o,ty,ty==='bass'?.38:.2);});
      for(let k=0;k<12;k++)E.shaker(t+k*s,o,k%3===0?.035:.02);}},
  passage:{name:'大西洋 · 潮声与哼吟',step:1,steps:4,rev:.6,vol:1.8,
    start(E,o){const ctx=E.ctx;const s=ctx.createBufferSource();const sr=ctx.sampleRate;const b=ctx.createBuffer(1,sr*4,sr);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;s.buffer=b;s.loop=true;
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;const l1=ctx.createOscillator();l1.frequency.value=.09;const l1g=ctx.createGain();l1g.gain.value=420;l1.connect(l1g);l1g.connect(lp.frequency);
      const g=ctx.createGain();g.gain.value=.05;const l2=ctx.createOscillator();l2.frequency.value=.11;const l2g=ctx.createGain();l2g.gain.value=.035;l2.connect(l2g);l2g.connect(g.gain);
      s.connect(lp);lp.connect(g);g.connect(o);const t=ctx.currentTime;[s,l1,l2].forEach(x=>x.start(t));return [s,l1,l2];},
    bar(E,t,i,o){E.choir([38,45],t,4,o,{vol:.035,vowel:'mm',atk:1.2,rel:1.2});E.stomp(t,o,.18);E.stomp(t+.45,o,.1);
      if(i%4===1)[[62,2],[65,1],[64,1]].reduce((x,[m,b])=>{E.hum(m,x,b*.95,o,{vol:.045,vowel:'mm',atk:.3,from:m-1,glide:.3});return x+b;},t);
      if(i%4===2)[[62,2.5],[60,1.5]].reduce((x,[m,b])=>{E.hum(m,x,b*.95,o,{vol:.04,vowel:'mm',atk:.3,from:m+2,glide:.4});return x+b;},t);}},
  roots:{name:'环形呼喊 · 拍手与跺脚',step:60/112/2,steps:8,rev:.3,vol:1.5,
    bar(E,t,i,o,s){[0,2,4,6].forEach(k=>E.stomp(t+k*s,o,k%4===0?.5:.32));[0,3,6].forEach(k=>E.clap(t+k*s,o,.16));if(i>=2)[2,6].forEach(k=>E.wood(t+k*s,o,.12));
      if(i%2===0)[[67,1],[70,.5,69],[67,.5],[65,1],[62,1]].reduce((x,[m,b,f])=>{E.hum(m,x,b*2*s*.92,o,{vol:.06,vowel:'ah',from:f!=null?f:null,glide:.08});return x+b*2*s;},t);
      else[[62,1],[65,1],[67,2]].reduce((x,[m,b])=>{E.choir([m,m-3,m-7],x,b*2*s*.9,o,{vol:.024,vowel:'ah',atk:.06,rel:.2});return x+b*2*s;},t);}},
  cotton:{name:'长韵赞美诗 · Amazing Grace',step:60/66,steps:3,rev:.55,vol:1.1,
    // New Britain (1829), public domain, in F
    mel:[[[null,2],[60,1]],[[65,2],[69,.5],[65,.5]],[[69,2],[67,1]],[[65,2],[62,1]],[[60,2],[60,1]],[[65,2],[69,.5],[65,.5]],[[69,2],[67,1]],[[72,3]],[[72,2],[69,1]],[[72,2],[69,.5],[72,.5]],[[69,2],[65,1]],[[60,2],[62,1]],[[65,2],[62,1]],[[60,2],[60,1]],[[65,2],[69,.5],[65,.5]],[[69,2],[67,1]],[[65,3]]],
    chords:[null,['F',41],['F',41],['Bb',46],['F',41],['F',41],['F',41],['C',48],['C',48],['F',41],['F',41],['Bb',46],['F',41],['F',41],['F',41],['C',48],['F',41]],
    bar(E,t,i,o,s){const k=i%17,T=TRACKS.cotton;const V={F:[57,60,65],Bb:[58,62,65],C:[55,60,64]};const c=T.chords[k];
      if(c){E.reed(V[c[0]],t,3*s*.97,o,{vol:.032});E.reed([c[1]],t,3*s*.97,o,{vol:.03});}
      T.mel[k].reduce((x,[m,b])=>{if(m!=null){E.hum(m,x,b*s*.97,o,{vol:.07,vowel:'oo',atk:.12,vib:.016});if(Math.floor(i/17)%2)E.hum(m-12,x+.05,b*s*.95,o,{vol:.03,vowel:'mm',atk:.2});}return x+b*s;},t);}},
  jubilee:{name:'三角洲 · 滑棒吉他蓝调',step:60/78/3,steps:12,rev:.3,vol:1.35,
    bar(E,t,i,o,s){const prog='EEEEAAEEBAEB'[i%12],R={E:40,A:45,B:47}[prog],top={E:64,A:69,B:71}[prog];
      [0,3,6,9].forEach(k=>{E.pluck(R,t+k*s,o,'guitar',{vol:.32,dur:.3});E.pluck(R+12,t+(k+2)*s,o,'guitar',{vol:.12,dur:.15});E.stomp(t+k*s,o,k%6===0?.3:.18);});
      if(i%2===0){E.pluck(top,t,o,'guitar',{vol:.26,from:top-2,glide:.14});E.pluck(top+3,t+2*s,o,'guitar',{vol:.2});E.pluck(top,t+3*s,o,'guitar',{vol:.2,from:top+1,glide:.08});}
      else{E.pluck(top+7,t+6*s,o,'guitar',{vol:.18,from:top+5,glide:.2});E.pluck(top+3,t+8*s,o,'guitar',{vol:.18,from:top+4,glide:.1});E.pluck(top,t+9*s,o,'guitar',{vol:.2});}}},
  migration:{name:'北上列车 · 口琴与铁轨',step:60/132/2,steps:8,rev:.25,vol:1,
    bar(E,t,i,o,s){const p='AADAEDAE'[i%8],R={A:45,D:50,E:52}[p];
      for(let k=0;k<8;k++)E.brush(t+k*s,o,k%2?.05:.09,.1);[1,3,5,7].forEach(k=>E.snare(t+k*s,o,.06));
      [0,2,4,6].forEach((k,j)=>E.bass(R+[0,4,7,9][j],t+k*s,s*1.8,o,{vol:.2}));
      const riff={A:[[0,64,1],[2,67,1,66],[4,69,2],[7,67,1]],D:[[0,69,1],[2,72,1],[4,74,2,73],[6,72,1]],E:[[0,71,1],[2,74,1],[4,76,2,75],[6,74,1]]}[p];
      if(i>=4)riff.forEach(([k,m,b,f])=>E.harp(m,t+k*s,b*s*.9,o,{vol:.045,from:f!=null?f:null,glide:.1}));
      if(i%16===0)TRACKS.migration.whistle(E,t+.2,o);},
    whistle(E,t,o){[69,72,76].forEach(m=>E.harp(m,t,.9,o,{vol:.03,from:m-.6,glide:.15}));}},
  golden:{name:'福音四重唱 · 12/8 慢板',step:60/58/3,steps:12,rev:.5,vol:1,
    bar(E,t,i,o,s){const P=[[[41,[57,60,65]],[45,[57,63,65]]],[[46,[58,62,65]],[47,[59,62,65]]],[[48,[57,60,65]],[50,[54,57,60]]],[[43,[58,62,65]],[48,[58,64,67]]]][i%4];
      P.forEach(([b,ch],h)=>{const tt=t+h*6*s;E.organ(ch,tt,6*s*.97,o,{vol:.03});E.bass(b,tt,2*s,o,{vol:.26});E.bass(b+7,tt+3*s,1.5*s,o,{vol:.14});
        for(let k=0;k<6;k++)E.ep(k%3===0?ch:ch.slice(1),tt+k*s,o,{vol:k%3===0?.026:.016,dur:.5});
        E.choir(ch.map(m=>m-12).concat([ch[2]]),tt,6*s,o,{vol:.014,vowel:'oo',atk:.5,rel:.6});});
      [3,9].forEach(k=>E.clap(t+k*s,o,.1));
      if(i%4===3)[72,70,69,67,65,64,65].forEach((m,k)=>E.organ([m],t+(6+k*.8)*s,.75*s,o,{vol:.03,drawbars:[[1,1],[2,.5],[3,.3]]}));}},
  soul:{name:'灵魂乐 · 底特律与孟菲斯律动',step:60/104/4,steps:16,rev:.18,vol:0.32,
    bar(E,t,i,o,s){const p=['C','F','C','G'][i%4],R={C:36,F:41,G:43}[p],ch={C:[60,64,67],F:[60,65,69],G:[59,62,67]}[p];
      [0,7,10].forEach(k=>E.kick(t+k*s,o,.55));[4,12].forEach(k=>E.snare(t+k*s,o,.26));for(let k=0;k<16;k+=2)E.hat(t+k*s,o,.04);[2,6,10,14].forEach(k=>E.tamb(t+k*s,o,.07));
      [[0,0],[3,0],[6,7],[8,12],[10,10],[14,7]].forEach(([k,d])=>E.bass(R+d,t+k*s,s*1.7,o,{vol:.26,type:'electric'}));
      [4,12].forEach(k=>{E.organ(ch,t+k*s,s*1.6,o,{vol:.035});ch.forEach(m=>E.pluck(m+12,t+k*s,o,'mute',{vol:.06}));});
      if(i%4===3)[[14,ch]].forEach(([k,c])=>E.brass(c.map(m=>m+12),t+k*s,s*1.5,o,{vol:.03}));
      if(i%4===0&&i>0)E.brass(ch.map(m=>m+12),t,s*3,o,{vol:.03});}},
  modern:{name:'当代福音 · 电钢琴与唱诗班',step:60/88/4,steps:16,rev:.35,vol:0.31,
    bar(E,t,i,o,s){const B=[[[0,41,[57,60,64,67]]],[[0,40,[55,59,62,64]],[8,45,[55,59,60,64]]],[[0,38,[53,57,60,64]]],[[0,43,[53,57,60,64]],[8,43,[53,59,64,69]]]][i%4];
      [0,7,10].forEach(k=>E.kick(t+k*s,o,.5));[4,12].forEach(k=>{E.snare(t+k*s,o,.14);E.clap(t+k*s,o,.14);});for(let k=0;k<16;k++)E.hat(t+(k+(k%2?.18:0))*s,o,k%4===2?.04:.022,k===14);
      B.forEach(([k,b,ch])=>{E.ep(ch,t+k*s,o,{vol:.05,dur:2});E.ep(ch.slice(1),t+(k+6)*s,o,{vol:.03,dur:.8});E.bass(b,t+k*s,s*6,o,{vol:.3,type:'electric'});E.bass(b+12,t+(k+7)*s,s,o,{vol:.12,type:'electric',from:b+10});});
      if(i%8>=4)B.forEach(([k,b,ch])=>E.choir(ch.slice(1).map(m=>m+12),t+k*s,(B.length>1?8:16)*s*.95,o,{vol:.016,vowel:'ah',atk:.3,rel:.5}));}},
  lab:{name:'解构器 · 正弦环境声',step:1,steps:4,rev:.7,vol:2,
    bar(E,t,i,o){const ctx=E.ctx;[36,43].forEach(m=>{const os=ctx.createOscillator(),g=ctx.createGain();os.frequency.value=mtof(m);os.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.03,t+1.5);g.gain.linearRampToValueAtTime(0,t+4.2);os.start(t);os.stop(t+4.3);});
      const sc=[72,74,78,79,83,86];for(let k=0;k<4;k++)if(Math.random()<.6)E.bell(t+k+Math.random()*.4,o,.025,mtof(sc[Math.floor(Math.random()*sc.length)]));
      if(i%4===2){const os=ctx.createOscillator(),g=ctx.createGain();os.frequency.setValueAtTime(220,t);os.frequency.exponentialRampToValueAtTime(1760,t+3);os.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.008,t+1);g.gain.linearRampToValueAtTime(0,t+3);os.start(t);os.stop(t+3.1);}}}
};

/* ---------- sound effects ---------- */
const SFX={
  train(E,t,o){[69,72,76].forEach(m=>E.harp(m,t,.85,o,{vol:.035,from:m-.7,glide:.18}));E.noiseHit(t,o,{type:'bandpass',f:1600,q:.6,vol:.05,a:.05,d:.8});
    [0,.28,.5,.68,.83,.96].forEach((d,k)=>E.brush(t+.9+d,o,.08,.12));},
  ping(E,t,o){E.bell(t,o,.07,1568);},
  tick(E,t,o){E.noiseHit(t,o,{type:'highpass',f:5000,vol:.05,d:.02});},
  amen(E,t,o){E.organ([58,62,65,70],t,.7,o,{vol:.045});E.organ([57,60,65,69],t+.75,1.3,o,{vol:.05});E.choir([58,62,65],t,.7,o,{vol:.02,vowel:'ah',atk:.05,rel:.2});E.choir([57,60,65],t+.75,1.2,o,{vol:.022,vowel:'ah',atk:.05,rel:.5});
    [84,88,91,96].forEach((m,k)=>E.bell(t+1+k*.08,o,.05,mtof(m)));},
  wrong(E,t,o){E.organ([47,48],t,.35,o,{vol:.04});E.stomp(t,o,.25);},
  fanfare(E,t,o){[[[60,64,67],0],[[60,65,69],.35],[[59,62,67],.7],[[60,64,67,72],1.05]].forEach(([c,d])=>{E.brass(c.map(m=>m+12),t+d,d<1?.3:1.2,o,{vol:.04});E.organ(c,t+d,d<1?.32:1.5,o,{vol:.035});});
    for(let k=0;k<12;k++)E.tamb(t+1.05+k*.07,o,.06);},
  sweep(E,t,o){const c=E.ctx,os=c.createOscillator(),g=c.createGain();os.frequency.setValueAtTime(120,t);os.frequency.exponentialRampToValueAtTime(2600,t+.45);os.connect(g);g.connect(o);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.05);g.gain.linearRampToValueAtTime(0,t+.5);os.start(t);os.stop(t+.55);},
  star(E,t,o){[79,84,88].forEach((m,k)=>E.bell(t+k*.06,o,.05,mtof(m)));}
};

/* ---------- player ---------- */
let ctx=null,E=null,cur=null,want=null,timer=null,ducked=false;
function ensure(){if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ctx=new C();E=Engine(ctx);E.music.gain.value=0;setVol();timer=setInterval(tick,40);}
  if(ctx.state==='suspended')ctx.resume();return true;}
function setVol(){if(!E)return;const v=pref.on&&!ducked?pref.vol:0;E.music.gain.cancelScheduledValues(ctx.currentTime);E.music.gain.setTargetAtTime(v*.9,ctx.currentTime,.25);E.sfx.gain.value=pref.vol>0?.6+pref.vol*.5:0;}
function startTrack(id){
  if(cur){const old=cur;old.g.gain.cancelScheduledValues(ctx.currentTime);old.g.gain.setTargetAtTime(0,ctx.currentTime,.5);setTimeout(()=>{try{old.g.disconnect();(old.amb||[]).forEach(x=>x.stop());}catch(e){}},3000);cur=null;}
  const T=TRACKS[id];if(!T)return;const g=ctx.createGain();g.gain.value=0;g.gain.setTargetAtTime(T.vol,ctx.currentTime+.1,.6);g.connect(E.music);
  const send=ctx.createGain();send.gain.value=T.rev;g.connect(send);send.connect(E.rev);
  cur={id,T,g,bar:0,next:ctx.currentTime+.15};cur.amb=T.start?T.start(E,g):null;
}
function tick(){if(!cur||!pref.on)return;const T=cur.T,bl=T.step*T.steps;if(cur.next<ctx.currentTime)cur.next=ctx.currentTime+.05;
  while(cur.next<ctx.currentTime+.35){try{T.bar(E,cur.next,cur.bar,cur.g,T.step);}catch(e){}cur.next+=bl;cur.bar++;}}
const M={
  scene(id){want=id;if(ctx&&pref.on&&(!cur||cur.id!==id))startTrack(id);ui();},
  unlock(){if(!pref.on&&!ctx)return;if(!ensure())return;if(pref.on&&want&&(!cur||cur.id!==want))startTrack(want);ui();},
  sfx(name){if(!pref.on||!ctx||!ensure())return;if(want&&!cur)startTrack(want);try{SFX[name](E,ctx.currentTime+.01,E.sfx);}catch(e){}},
  duck(on){ducked=!!on;setVol();},
  toggle(){pref.on=!pref.on;savePref();if(pref.on){ensure();if(want)startTrack(want);}else if(cur){cur.g.gain.setTargetAtTime(0,ctx.currentTime,.2);const old=cur;cur=null;setTimeout(()=>{try{old.g.disconnect();(old.amb||[]).forEach(x=>x.stop());}catch(e){}},1500);}
    setVol();ui();},
  volume(v){pref.vol=v;savePref();setVol();},
  get on(){return pref.on;},get vol(){return pref.vol;},
  name(id){return TRACKS[id]?TRACKS[id].name:'';},
  // offline render for testing loudness: returns {rms,peak}
  async test(id,secs){const oc=new OfflineAudioContext(2,44100*secs,44100);const e=Engine(oc);e.music.gain.value=.9*.55;const T=TRACKS[id];const g=oc.createGain();g.gain.value=T.vol;g.connect(e.music);const send=oc.createGain();send.gain.value=T.rev;g.connect(send);send.connect(e.rev);
    if(T.start)T.start(e,g);let t=.05,b=0;while(t<secs){T.bar(e,t,b++,g,T.step);t+=T.step*T.steps;}const buf=await oc.startRendering();const d=buf.getChannelData(0);let s=0,p=0;for(let i=0;i<d.length;i++){s+=d[i]*d[i];p=Math.max(p,Math.abs(d[i]));}
    return {rms:20*Math.log10(Math.sqrt(s/d.length)+1e-9),peak:20*Math.log10(p+1e-9)};},
  tracks:Object.keys(TRACKS)
};
let uiFn=()=>{};M.onUI=f=>{uiFn=f;};function ui(){uiFn(M,want);}
window.MUSIC=M;
document.addEventListener('pointerdown',()=>M.unlock(),true);
document.addEventListener('keydown',()=>M.unlock(),true);
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend();else if(pref.on)ctx.resume();});
})();
