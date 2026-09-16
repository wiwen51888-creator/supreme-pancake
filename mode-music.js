/* Eight original scores for Abstract Tactics / Auto Chess. No external media or libraries. */
(function(global){
'use strict';

/* A token is MIDI spelling / duration in quarter-note beats; default is an eighth.
   The melodies, chord progressions, orchestration and rhythm patterns below were
   written for this game. They do not quote another game's or performer's music. */
const SCORES={
 turn:{
  select:{title:'地图边缘的微风',bpm:102,beats:3,bars:32,key:'G major',style:'journey',lead:'flute',
   identity:'6/8 冒险风景：长呼吸木管、分解竖琴、拨弦低音与轻铃，四段渐进展开。',
   chords:['G2:maj9','E2:min7','C2:maj7','D2:sus','B2:min7','E2:min7','A2:min7','D2:dom'],
   melody:[
    'G5 B5 D6/1 C6 B5','A5/1 E5 G5 A5 B5','E6 D6 C6/1 G5 E5','F#5 A5/1 G5 E5 D5',
    'B5/1 F#5 A5 D6 B5','G5 B5 E6/1 D6 B5','A5 C6 B5 A5 G5 E5','F#5/1 A5 D6/1 -'
   ]},
  battle:{title:'四人踏破黎明',bpm:146,beats:4,bars:32,key:'E minor',style:'quest',lead:'reed',
   identity:'JRPG 乐队战斗：木管跳进主旋律、弦乐八分音符、低音鼓与军鼓，B段号角应答。',
   chords:['E2:min','C2:maj7','G2:maj','D2:dom','A2:min7','E2:min','C2:maj','B2:dom'],
   melody:[
    'B4 E5 G5 F#5 E5 B5 A5 G5','E5/1 G5 C6 B5 G5 E5 D5','D5 G5 B5/1 A5 G5 D6 B5','A5 F#5 E5 D5 F#5 A5 C6/1',
    'E6 C6 A5 C6 B5 A5 G5 E5','G5 B5 E6 D6 B5 G5 F#5 E5','E5 G5 C6 E6 D6 C6 G5 E5','F#5 D#5 B4/1 D#5 F#5 B5/1'
   ]},
  elite:{title:'七拍遗迹守门人',bpm:132,beats:3.5,bars:32,key:'C minor / harmonic dominant',style:'ruins',lead:'strings',
   identity:'7/8 遗迹精英战：低弦、管钟、定音鼓，2+2+3 不对称重音与半音属和弦。',
   chords:['C2:min','Ab2:maj7','F2:min','G2:dom','Eb2:maj','Bb2:dom','Ab2:maj','G2:dom'],
   melody:[
    'G5 Eb5 D5 C5 G4 C5 D5','Eb5 Ab5 C6 Bb5 Ab5 G5 Eb5','F5 C6 Ab5 G5 F5 Eb5 C5','D5 B4 G4 B4 D5 F5 Ab5',
    'G5 Bb5 Eb6 D6 Bb5 G5 F5','F5 D5 Bb4 F5 Ab5 D6 C6','Eb6 C6 Ab5 G5 Eb5 C5 Eb5','D5 F5 Ab5 G5 D5 B4 G4'
   ]},
  victory:{title:'把星光装进行囊',bpm:112,beats:4,bars:16,key:'D major',style:'fanfare',lead:'horn',
   identity:'温暖队伍凯旋：铜管宽跳、钟琴点缀、上行低音和慢速小军鼓，随后回落到营地氛围。',
   chords:['D2:maj','G2:maj7','B2:min7','A2:sus','F#2:min7','G2:maj','E2:min7','A2:dom'],
   melody:[
    'D5/1 A5 F#5 E5 D5 F#5 A5','B5/1 D6/1 B5 G5 A5 B5','F#5 B5 D6 F#6 E6 D6 B5/1','E6/1 D6 C#6 B5 A5 E5/1',
    'A5 C#6 E6/1 C#6 A5 F#5/1','G5 B5 D6/1 E6 D6 B5 G5','B5/1 G5 E5 F#5 G5 B5/1','A5/2 E5 C#5 D5/1'
   ]}
 },
 chess:{
  shop:{title:'小店长的算盘',bpm:98,beats:4,bars:32,key:'F major / jazz extensions',style:'market',lead:'marimba',swing:.16,
   identity:'轻快商店经营：摇摆八分音符、木琴短句、爵士七九和弦、行走低音与刷鼓。',
   chords:['F2:maj9','D2:min7','G2:min7','C2:dom9','A2:min7','D2:dom9','G2:min7','C2:dom9'],
   melody:[
    'A5 - C6 A5 G5 F5 - E5','F5 A5 D6 C6 - A5 F5 E5','D5 F5 A5 Bb5 A5 - G5 F5','E5 G5 Bb5 D6 C6/1 - G5',
    'E5 A5 C6 B5 - A5 G5 E5','F#5 A5 C6 E6 D6 C6 A5 -','Bb5 A5 G5 F5 D5/1 F5 A5','G5 E5 D5 C5 - E5 G5/1'
   ]},
  battle:{title:'齿间的连锁反应',bpm:118,beats:4,bars:32,key:'B dorian',style:'clockwork',lead:'pluck',
   identity:'策略自动战：干燥合成拨弦、错位重音、短管乐应答与鼓边敲击，留出观察局势的空间。',
   chords:['B2:min7','E2:dom','A2:maj7','F#2:min7','D2:maj7','E2:dom','G2:maj7','F#2:dom'],
   melody:[
    'B4 F#5 - A5 F#5 E5 - D5','G#5/1 B5 G#5 F#5 E5 B4 -','C#5 E5 A5 - G#5 E5 C#5 B4','C#6 A5 F#5 E5 C#5/1 - A4',
    'D5 - F#5 A5 C#6 A5 F#5 E5','B5 G#5 E5 - F#5 G#5 B5/1','D6 B5 A5 G5 F#5 D5 B4 -','A#4 C#5 F#5 E5 C#5/1 F#4/1'
   ]},
  late:{title:'第五格的决策',bpm:112,beats:5,bars:32,key:'D minor / suspended colors',style:'endgame',lead:'celeste',
   identity:'决赛圈：5/4 低音循环、玻璃音色与木质敲击，三拍悬念接两拍回应，不用加速冒充升级。',
   chords:['D2:min9','Bb2:maj7','G2:min7','A2:sus','F2:maj7','C2:dom9','Eb2:maj7','A2:dom'],
   melody:[
    'A5 D6 - C6 A5 F5 E5 D5 - A4','F5 Bb5 D6/1 C6 Bb5 A5 F5 D5 -','G5 A5 Bb5 D6 F6 D6 Bb5 A5 G5/1','E5 A5 B5 D6 E6/1 D6 B5 A5 E5',
    'C6 A5 F5 - E5 G5 A5 C6 E6 C6','D6 Bb5 G5 E5 D5 C5 E5 G5 Bb5/1','G5 Bb5 Eb6 D6 Bb5 G5 F5 Eb5 G5/1','C#6/1 A5 E5 G5 E5 C#5 A4/1 -'
   ]},
  victory:{title:'打烊后的金色奖杯',bpm:108,beats:4,bars:16,key:'Ab major / sixth chords',style:'afterhours',lead:'piano',swing:.06,
   identity:'轻松经营结算：柔和电钢琴、巴萨反拍和弦、短笛点缀与温柔沙锤，和格斗凯旋曲拉开距离。',
   chords:['Ab2:maj9','C2:min7','Db2:maj7','Eb2:dom9','F2:min7','Bb2:min7','Db2:maj7','Eb2:dom9'],
   melody:[
    'C6/1 Ab5 Bb5 C6 Eb6 G6 Eb6','D6 C6 G5 Eb5 G5 Bb5 C6/1','F5 Ab5 C6 Bb5 Ab5 F5 Eb5/1','G5 Bb5 Db6 F6 Eb6/1 - Bb5',
    'Ab5 C6 Eb6 D6 C6 Ab5 G5 F5','F5 Bb5 Db6 C6 Bb5 Ab5 F5/1','Ab5/1 F5 Db5 Eb5 F5 Ab5 C6','Bb5 G5 F5 Eb5 - G5 Ab5/1'
   ]}
 }
};

const INSTRUMENTS={
 flute:{wave:'sine',overtone:.15,ratio:2,gain:.115,attack:.025,release:.11,cutoff:3800,pan:-.1},
 reed:{wave:'triangle',overtone:.12,ratio:3,gain:.105,attack:.014,release:.065,cutoff:2700,pan:-.08},
 strings:{wave:'sawtooth',detune:7,gain:.032,attack:.055,release:.2,cutoff:1350,pan:.18},
 horn:{wave:'sawtooth',overtone:.22,ratio:1,gain:.052,attack:.036,release:.14,cutoff:1800,pan:-.08},
 harp:{wave:'sine',fm:2.02,index:1.3,gain:.084,attack:.003,release:.15,decay:.14,pan:-.27},
 marimba:{wave:'sine',fm:3.98,index:2.1,gain:.112,attack:.003,release:.08,decay:.105,pan:-.16},
 pluck:{wave:'triangle',fm:2,index:.45,gain:.09,attack:.004,release:.045,decay:.07,cutoff:3400,pan:-.12},
 celeste:{wave:'sine',fm:2.73,index:1.75,gain:.07,attack:.003,release:.2,decay:.24,pan:.16},
 piano:{wave:'sine',fm:2,index:1.25,gain:.105,attack:.006,release:.16,decay:.21,pan:-.08},
 bass:{wave:'triangle',gain:.10,attack:.008,release:.055,cutoff:650,pan:0},
 upright:{wave:'sine',overtone:.3,ratio:2,gain:.15,attack:.007,release:.06,decay:.19,pan:0},
 kick:{wave:'sine',pitch:[116,39],gain:.20,attack:.002,release:.055,decay:.10,pan:0},
 timpani:{wave:'sine',pitch:[143,72],gain:.15,attack:.003,release:.14,decay:.15,pan:-.08},
 snare:{noise:true,filter:'bandpass',cutoff:1650,gain:.14,attack:.002,release:.04,decay:.055,pan:.12},
 brush:{noise:true,filter:'highpass',cutoff:3500,gain:.057,attack:.013,release:.03,decay:.10,pan:.24},
 shaker:{noise:true,filter:'highpass',cutoff:6200,gain:.052,attack:.002,release:.015,decay:.022,pan:.3},
 rim:{wave:'triangle',pitch:[1580,900],gain:.062,attack:.001,release:.012,decay:.019,pan:.24},
 wood:{wave:'sine',fm:2.71,index:2.3,gain:.068,attack:.002,release:.016,decay:.025,pan:-.23}
};
const CHORDS={maj:[0,4,7],min:[0,3,7],dom:[0,4,7,10],sus:[0,5,7,10],maj7:[0,4,7,11],min7:[0,3,7,10],maj9:[0,4,7,11,14],min9:[0,3,7,10,14],dom9:[0,4,7,10,14]};
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(+x)?+x:0));
const hz=n=>440*Math.pow(2,(n-69)/12);
function midi(note){const m=/^([A-G])([#b]?)(\d)$/.exec(note);if(!m)throw Error('Invalid score note '+note);return (+m[3]+1)*12+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);}
function resolve(mode,id){if(mode!=='turn'&&mode!=='chess')throw new RangeError('ModeMusic mode must be turn or chess');if(mode==='chess'&&id==='select')id='shop';if(!SCORES[mode][id])throw new RangeError('Unknown ModeMusic track: '+mode+'/'+id);return id;}
function compile(mode,id){
 id=resolve(mode,id);const s=SCORES[mode][id],events=[],seconds=60/s.bpm;
 const add=(bar,beat,note,duration,instrument,velocity=.8,pan)=>{if(beat<0||beat>=s.beats)return;const eighth=Math.abs((beat%1)-.5)<.001,when=bar*s.beats+beat+(eighth?(s.swing||0):0);events.push({time:when*seconds,midi:note,duration:duration*seconds,instrument,velocity,pan});};
 const drum=(bar,beat,instrument,velocity=.7)=>add(bar,beat,48,.10,instrument,velocity);
 for(let bar=0;bar<s.bars;bar++){
  const phrase=bar%8,section=Math.floor(bar/8),[root,quality]=s.chords[phrase].split(':'),low=midi(root),tones=CHORDS[quality],calm=(s.style==='journey'||s.style==='market'||s.style==='afterhours'),bridge=section===2;
  const lead=section===1&&s.style==='fanfare'?'flute':bridge&&s.style==='quest'?'horn':bridge&&s.style==='market'?'reed':s.lead;
  let beat=0;const notes=s.melody[phrase].split(/\s+/);
  for(const token of notes){const [note,length]=token.split('/'),duration=length==null?.5:Number(length);if(!Number.isFinite(duration)||duration<=0)throw Error('Invalid note length');if(note!=='-'){
    const pitch=midi(note),v=beat===0?.92:.76;
    // A few breathing bars in the third section let the harmony answer the melody.
    if(!(bridge&&calm&&phrase%4===0))add(bar,beat,pitch,duration*.89,lead,v);
    if(section===3&&phrase%2===1&&beat>=s.beats-1)add(bar,beat,pitch-12,duration*.70,calm?'harp':'horn',.38,.25);
   }beat+=duration;
  }
  if(Math.abs(beat-s.beats)>.001)throw Error(`${mode}/${id} melody bar ${phrase+1}: ${beat}, expected ${s.beats}`);
  const chord=(at,dur,inst='strings',v=.4)=>tones.slice(0,quality.includes('9')?5:4).forEach((n,i)=>add(bar,at,low+24+n,dur,inst,v,-.3+i*.15));
  const bass=(at,n=0,dur=.40,inst='bass',v=.78)=>add(bar,at,low+n,dur,inst,v);
  if(s.style==='journey'){
   bass(0,0,.7,'upright',.62);bass(1.5,7,.6,'upright',.54);
   for(let n=0;n<6;n++)add(bar,n*.5,low+24+tones[(n+phrase)%tones.length],.40,'harp',n%3===0?.60:.38);
   if(section>0)chord(0,2.75,'strings',.26);
   drum(bar,0,'brush',.32);drum(bar,1.5,'brush',.24);if(phrase%4===3)add(bar,2.5,low+48+7,.45,'celeste',.36);
  }else if(s.style==='quest'){
   [0,.5,1.5,2,2.5,3.5].forEach((b,i)=>bass(b,i%3===2?7:0,.38));
   for(let n=0;n<8;n++)add(bar,n*.5,low+24+tones[n%3],.33,'strings',n%2?.47:.60);
   [0,2].forEach(b=>drum(bar,b,'kick',.84));[1,3].forEach(b=>drum(bar,b,'snare',.71));for(let n=0;n<8;n++)drum(bar,n*.5,'shaker',n%2?.38:.50);
   if(phrase%4===3)[2.5,3,3.5].forEach((b,i)=>drum(bar,b,'timpani',.45+i*.13));
   if(section===1||section===3)chord(0,1.7,'horn',.21);
  }else if(s.style==='ruins'){
   [0,1,2,2.5,3].forEach((b,i)=>bass(b,i===3?7:0,.36));chord(0,.7,'strings',.55);chord(2,1.2,'strings',.45);
   [0,1,2].forEach((b,i)=>drum(bar,b,'timpani',i===0?.95:.58));[.5,1.5,2.5,3].forEach(b=>drum(bar,b,'rim',.55));
   add(bar,2,low+36+tones[1],1.25,'celeste',.57);if(section>0)for(let n=0;n<7;n++)drum(bar,n*.5,'shaker',n%2?.27:.35);
  }else if(s.style==='fanfare'){
   bass(0,0,.8,'bass',.66);bass(2,7,.8,'bass',.61);chord(0,1.65,'strings',.39);chord(2,1.55,'strings',.34);
   [0,1.5,2.5].forEach((b,i)=>add(bar,b,low+36+tones[(i+1)%3],.7,'celeste',.47));
   drum(bar,0,'timpani',.70);drum(bar,2,'snare',.38);if(phrase%4===3)[3,3.5,3.75].forEach(b=>drum(bar,b,'snare',.40));
  }else if(s.style==='market'){
   [0,1,2,3].forEach((b,i)=>bass(b,[0,tones[1],7,phrase%2?9:10][i],.82,'upright',i===0?.76:.60));
   [.5,2,3.5].forEach(b=>chord(b,.38,'piano',.30));for(let n=0;n<8;n++)drum(bar,n*.5,'brush',n%2?.46:.28);[1,3].forEach(b=>drum(bar,b,'rim',.43));
   if(bridge||section===3)add(bar,1.5,low+36+tones[2],1,'reed',.34,.24);
  }else if(s.style==='clockwork'){
   [0,.75,1.75,2.5,3.5].forEach((b,i)=>bass(b,i===3?7:0,.28,'bass',.73));
   [.75,2.25,3.5].forEach(b=>chord(b,.24,'piano',.28));[0,1.75,2.5].forEach(b=>drum(bar,b,'kick',.63));[1,3].forEach(b=>drum(bar,b,'rim',.76));
   [0,.75,1.5,2.5,3.25].forEach((b,i)=>drum(bar,b,'wood',i%2?.48:.64));for(let n=0;n<8;n++)drum(bar,n*.5,'shaker',.30);
   if(section>0)add(bar,2,low+36+tones[2],.68,'reed',.38,.30);
  }else if(s.style==='endgame'){
   [0,.5,1.5,2,3,3.5,4.5].forEach((b,i)=>bass(b,[0,7,10,7,0,7,tones[1]][i],.34,'bass',.70));
   chord(0,2.45,'strings',.27);chord(3,1.6,'piano',.25);[0,1.5,3].forEach(b=>drum(bar,b,'kick',.65));[2,4].forEach(b=>drum(bar,b,'rim',.67));
   [0,1,2,3,3.5,4.5].forEach((b,i)=>add(bar,b,low+36+tones[i%tones.length],.18,'marimba',.40));for(let n=0;n<10;n++)drum(bar,n*.5,'shaker',n%3===0?.43:.22);
  }else if(s.style==='afterhours'){
   bass(0,0,.65,'upright',.70);bass(1.5,7,.30,'upright',.48);bass(2,0,.65,'upright',.64);bass(3.5,7,.30,'upright',.48);
   [.5,1.75,3].forEach(b=>chord(b,.48,'piano',.26));[0,1,2,3].forEach(b=>drum(bar,b,'brush',.24));[.5,1.5,2.5,3.5].forEach(b=>drum(bar,b,'shaker',.43));
   if(phrase%2===1)add(bar,2.5,low+36+tones[1],1.1,'flute',.32,.27);
  }
 }
 events.sort((a,b)=>a.time-b.time);return {id,mode,title:s.title,bpm:s.bpm,beats:s.beats,bars:s.bars,key:s.key,style:s.style,identity:s.identity,duration:s.bars*s.beats*seconds,events};
}

function ramp(param,value,time,seconds){if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(time);else{const current=param.value;param.cancelScheduledValues(time);param.setValueAtTime(current,time);}param.linearRampToValueAtTime(value,time+seconds);}
class ModeMusic{
 constructor({getContext,volume=.24,mode='turn'}={}){
  if(typeof getContext!=='function')throw new TypeError('ModeMusic requires getContext for a shared AudioContext');
  resolve(mode,'select');this.mode=mode;this.getContext=getContext;this.volume=clamp(volume);this.muted=false;this.paused=false;this.unlocked=false;this.currentTrack=null;
  this.tracks=SCORES[mode];this.context=null;this.master=null;this._input=null;this._session=null;this._retired=[];this._voices=new Set();this._cache=new Map();this._timer=null;this._offset=0;this._destroyed=false;this._unlockSerial=0;this._graph=[];this._noise=null;
 }
 async unlock(){
  if(this._destroyed)return false;const serial=++this._unlockSerial,c=this.getContext();if(!c||c.state==='closed')return false;
  try{if(c.state!=='running')await c.resume();}catch{return false;}
  if(this._destroyed||serial!==this._unlockSerial||c.state!=='running')return false;
  if(this.context!==c){this._dropContext();this._setup(c);}this.unlocked=true;
  if(this.currentTrack&&!this.paused&&!this._session)this._start(this.currentTrack,this._offset);return true;
 }
 _setup(c){
  this.context=c;const high=c.createBiquadFilter(),low=c.createBiquadFilter(),master=c.createGain();high.type='highpass';high.frequency.value=30;low.type='lowpass';low.frequency.value=7500;master.gain.value=this.muted?0:this.volume;high.connect(low);low.connect(master);master.connect(c.destination);this._input=high;this.master=master;this._graph=[high,low,master];
  const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*.6),c.sampleRate),data=buffer.getChannelData(0);let seed=0x42a617b3;for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=(seed>>>0)/2147483648-1;}this._noise=buffer;
 }
 _score(id){if(!this._cache.has(id))this._cache.set(id,compile(this.mode,id));return this._cache.get(id);}
 play(id='select'){
  if(this._destroyed)return this;id=resolve(this.mode,id);if(id===this.currentTrack){if(this.unlocked&&!this.paused&&!this._session)this._start(id,this._offset);return this;}
  this._retire(.16);this.currentTrack=id;this._offset=0;if(this.unlocked&&!this.paused)this._start(id,0);return this;
 }
 select(){return this.play('select');}
 _start(id,offset){
  const c=this.context;if(!c||c.state!=='running'||this._destroyed)return;const score=this._score(id),phase=((offset%score.duration)+score.duration)%score.duration,now=c.currentTime;
  const bus=c.createGain();bus.gain.setValueAtTime(0,now);bus.gain.linearRampToValueAtTime(.88,now+.12);bus.connect(this._input);
  const nodes=[bus];
  // Short, local room echo distinguishes the modes without retaining old-track tails.
  if(typeof c.createDelay==='function'){const delay=c.createDelay(1),wet=c.createGain(),feedback=c.createGain(),filter=c.createBiquadFilter();delay.delayTime.value=this.mode==='turn'?60/score.bpm*.75:.073;wet.gain.value=this.mode==='turn'?.13:.045;feedback.gain.value=.18;filter.type='lowpass';filter.frequency.value=2300;bus.connect(delay);delay.connect(filter);filter.connect(feedback);feedback.connect(delay);filter.connect(wet);wet.connect(this._input);nodes.push(delay,wet,feedback,filter);}
  let index=score.events.findIndex(e=>e.time>=phase);if(index<0)index=score.events.length;this._session={score,bus,nodes,origin:now+.022-phase,index,loop:0,voices:new Set()};
  if(this._timer===null)this._timer=setInterval(()=>this._tick(),25);this._tick();
 }
 _voice(e,time,session){
  if(this._voices.size>=64)return;const c=this.context,ins=INSTRUMENTS[e.instrument],amp=c.createGain(),nodes=[amp],sources=[];
  const source=ins.noise?c.createBufferSource():c.createOscillator();sources.push(source);nodes.push(source);const frequency=hz(e.midi),duration=Math.max(.035,e.duration),end=time+duration+ins.release;
  if(ins.noise)source.buffer=this._noise;else{source.type=ins.wave;source.frequency.setValueAtTime(ins.pitch?ins.pitch[0]:frequency,time);if(ins.pitch)source.frequency.exponentialRampToValueAtTime(ins.pitch[1],time+Math.min(duration,.15));}
  if(ins.fm){const mod=c.createOscillator(),depth=c.createGain();mod.type='sine';mod.frequency.value=frequency*ins.fm;depth.gain.setValueAtTime(frequency*ins.index,time);depth.gain.exponentialRampToValueAtTime(Math.max(.01,frequency*.025),time+(ins.decay||.15));mod.connect(depth);depth.connect(source.frequency);sources.push(mod);nodes.push(mod,depth);}
  let toneInput=amp;if(ins.cutoff){const filter=c.createBiquadFilter();filter.type=ins.filter||'lowpass';filter.frequency.value=ins.cutoff;filter.Q.value=ins.filter==='bandpass'?.8:.55;filter.connect(amp);toneInput=filter;nodes.push(filter);}source.connect(toneInput);
  if(ins.overtone||ins.detune){const extra=c.createOscillator(),mix=c.createGain();extra.type=ins.detune?'sawtooth':'sine';extra.frequency.value=frequency*(ins.ratio||1);if(ins.detune){source.detune.value=-ins.detune;extra.detune.value=ins.detune;}mix.gain.value=ins.detune?.32:ins.overtone;extra.connect(mix);mix.connect(toneInput);sources.push(extra);nodes.push(extra,mix);}
  let out=amp;const pan=e.pan??ins.pan;if(pan&&typeof c.createStereoPanner==='function'){const p=c.createStereoPanner();p.pan.value=pan;amp.connect(p);out=p;nodes.push(p);}out.connect(session.bus);
  const level=Math.max(.0002,ins.gain*e.velocity),attack=Math.min(ins.attack,duration*.28);amp.gain.setValueAtTime(.0001,time);amp.gain.linearRampToValueAtTime(level,time+attack);amp.gain.exponentialRampToValueAtTime(level*(ins.decay?.16:.72),time+Math.min(duration,ins.decay||duration*.50));amp.gain.setValueAtTime(level*(ins.decay?.16:.72),time+duration);amp.gain.exponentialRampToValueAtTime(.0001,end);
  const voice={sources,nodes,end,session};session.voices.add(voice);this._voices.add(voice);source.onended=()=>this._disposeVoice(voice);for(const s of sources){s.start(time);s.stop(end);}
 }
 _disposeVoice(v){if(!this._voices.has(v))return;this._voices.delete(v);v.session.voices.delete(v);for(const s of v.sources){s.onended=null;try{s.stop();}catch{}}for(const n of v.nodes){try{n.disconnect();}catch{}}}
 _tick(){
  const c=this.context;if(!c)return;const now=c.currentTime;
  for(const v of [...this._voices])if(v.end<=now)this._disposeVoice(v);
  for(let i=this._retired.length-1;i>=0;i--)if(now>=this._retired[i].disposeAt){this._dispose(this._retired[i]);this._retired.splice(i,1);}
  const s=this._session;if(!s){if(!this._retired.length)this._clearTimer();return;}if(c.state!=='running')return;
  const score=s.score,horizon=now+.13;
  let next=s.origin+s.loop*score.duration+(score.events[s.index]?.time??score.duration);
  if(next<now-.10){const elapsed=Math.max(0,now+.012-s.origin);s.loop=Math.floor(elapsed/score.duration);const phase=elapsed-s.loop*score.duration;let lo=0,hi=score.events.length;while(lo<hi){const mid=(lo+hi)>>>1;if(score.events[mid].time<phase)lo=mid+1;else hi=mid;}s.index=lo;}
  for(let count=0;count<160;count++){if(s.index>=score.events.length){s.index=0;s.loop++;}const e=score.events[s.index],when=s.origin+s.loop*score.duration+e.time;if(when>=horizon)break;if(when>=now-.006)this._voice(e,Math.max(now+.002,when),s);s.index++;}
 }
 _retire(seconds=.10){const s=this._session;if(!s)return;this._session=null;if(this.context.state!=='running'){this._dispose(s);return;}const now=this.context.currentTime;s.disposeAt=now+seconds+.02;ramp(s.bus.gain,0,now,seconds);for(const v of s.voices)for(const source of v.sources)try{source.stop(s.disposeAt);}catch{}this._retired.push(s);while(this._retired.length>2)this._dispose(this._retired.shift());}
 _dispose(s){for(const v of [...s.voices])this._disposeVoice(v);for(const n of s.nodes)try{n.disconnect();}catch{}}
 _clearTimer(){if(this._timer!==null){clearInterval(this._timer);this._timer=null;}}
 _dropContext(){this._clearTimer();if(this._session)this._dispose(this._session);for(const s of this._retired)this._dispose(s);this._session=null;this._retired=[];for(const n of this._graph)try{n.disconnect();}catch{}this._graph=[];this.context=null;this.master=null;this._input=null;this._noise=null;this.unlocked=false;}
 setPaused(value){value=!!value;if(value===this.paused)return this;this.paused=value;if(value){if(this._session)this._offset=Math.max(0,this.context.currentTime-this._session.origin)%this._session.score.duration;this._retire(.06);}else if(this.currentTrack&&this.unlocked&&!this._session)this._start(this.currentTrack,this._offset);return this;}
 setMuted(value){this.muted=!!value;if(this.master)ramp(this.master.gain,this.muted?0:this.volume,this.context.currentTime,.035);return this;}
 setVolume(value){this.volume=clamp(value);if(this.master)ramp(this.master.gain,this.muted?0:this.volume,this.context.currentTime,.05);return this;}
 stop(){this._retire(.10);this.currentTrack=null;this._offset=0;return this;}
 destroy(){if(this._destroyed)return;this._dropContext();this._cache.clear();this.currentTrack=null;this._offset=0;this._destroyed=true;}
 getState(){return {mode:this.mode,trackId:this.currentTrack,playing:!!this._session,unlocked:this.unlocked,paused:this.paused,muted:this.muted,volume:this.volume,seconds:this._session?Math.max(0,this.context.currentTime-this._session.origin)%this._session.score.duration:this._offset,activeVoices:this._voices.size,cachedTracks:this._cache.size,destroyed:this._destroyed};}
 static compile(mode,id){return compile(mode,id);}
}
ModeMusic.tracks=SCORES;ModeMusic.instruments=INSTRUMENTS;ModeMusic.version='1.0.0-original-mode-scores';
if(typeof module!=='undefined'&&module.exports)module.exports=ModeMusic;global.ModeMusic=ModeMusic;
})(typeof window!=='undefined'?window:globalThis);
