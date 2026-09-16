/* FighterMusic — ten new original combat compositions, revision 5. */
(function(global){
'use strict';
/* Revision 5 composition source: ten newly written combat themes.
   Each slash gives quarter-note beat duration; unspecified notes are eighths.
   Sixteen hand-written bars form A and B; the arranger creates A / A' / B / A''.
   These are original riffs, not tempo changes or transpositions of revision 4. */
const SCORES = {
  select: {
    title:'全员集结！战意点燃',bpm:164,beats:4,style:'select',key:'D minor / heroic major lift',lead:'anthem',
    identity:'集结号式短句、八度应答、强拍鼓组与五度和弦；B 段抬升成竞技场副歌。',
    chords:['D2:min','Bb2:maj','F2:maj','C3:maj','D2:min','G2:min','Bb2:maj','A2:dom','F2:maj','C3:maj','D2:min','Bb2:maj','G2:min','Bb2:maj','C3:maj','A2:dom'],
    melody:[
      'D5/0.25 D5/0.25 A5 F5 D5 A4 D5 F5 A5','Bb5/1 A5 F5 D5 F5 A5 Bb5','C6 A5 F5 A5 C6/0.75 A5/0.25 G5 F5','E5 G5 C6/1 G5/0.25 G5/0.25 E5 D5 C5',
      'D5 F5 A5 D6 A5/0.25 G5/0.25 F5 E5 D5','G5/0.75 A5/0.25 Bb5 A5 G5 D5 F5 G5','F5 Bb5 D6 C6 Bb5/1 A5 G5','E5/0.25 F5/0.25 E5 C#5 A4 C#5 E5 A5/1',
      'A5/1 C6 A5 G5 F5 G5 A5','G5 C6 E6 D6 C6 G5 E5 G5','A5 D6 F6 E6 D6 A5 F5 A5','Bb5/0.75 C6/0.25 D6 C6 Bb5 A5 F5 D5',
      'D6 Bb5 G5 Bb5 D6/1 C6 Bb5','F5 Bb5 D6 F6 D6/1 C6 Bb5','G5/0.25 A5/0.25 G5 E5 C5 E5 G5 C6/1','E6 C#6 A5 G5 E5 C#5 A4/1'
    ]
  },
  arcade: {
    title:'街机决胜回合',bpm:178,beats:4,style:'arcade',key:'F# minor',lead:'blade',
    identity:'紧凑十六分切分主奏、疾走八度低音、双底鼓和截断式强力和弦。',
    chords:['F#2:min','D2:maj','E2:maj','C#3:dom','F#2:min','A2:maj','D2:maj','C#3:dom','B2:min','D2:maj','A2:maj','E2:maj','F#2:min','D2:maj','E2:maj','C#3:dom'],
    melody:[
      'F#5/0.25 F#5/0.25 - F#5 A5 C#6 A5 G#5 F#5','A5 F#5 D5 F#5 A5/0.25 B5/0.25 A5 F#5 D5','E5 B5 G#5 E5 B4 E5 G#5 B5','C#6 G#5 E#5 C#5 E#5 G#5 B5/1',
      'F#5/0.25 G#5/0.25 A5 F#5 C#6 - A5 G#5 F#5','E6 C#6 A5 C#6 E6/0.25 D6/0.25 C#6 B5 A5','D6/0.75 C#6/0.25 A5 F#5 D5 F#5 A5 B5','G#5/0.25 A5/0.25 G#5 E#5 C#5 B4 C#5 E#5 G#5',
      'B5 D6 F#6 E6 D6 B5 A5 F#5','F#5 A5 D6/1 C#6 A5 F#5/1','A5 C#6 E6/0.75 D6/0.25 C#6 B5 A5 E5','G#5 B5 E6 D6 B5 G#5 F#5 E5',
      'C#6/0.25 D6/0.25 C#6 A5 F#5 A5 C#6 F#6/1','E6 D6 A5 F#5 A5 D6 C#6 A5','B5/0.75 C#6/0.25 B5 G#5 E5 B4 E5 G#5','E#5 G#5 C#6 B5 G#5 E#5 C#5/1'
    ]
  },
  shanghai: {
    title:'黄浦热血破阵',bpm:168,beats:4,style:'shanghai',key:'D minor pentatonic',lead:'steel',
    identity:'D 小调五声音阶战斗动机、金属拨弦、反拍强力和弦与滚动通鼓。',
    chords:['D2:min','C3:maj','Bb2:maj','D2:min','G2:min','D2:min','Bb2:maj','C3:maj','Bb2:maj','C3:maj','D2:min','F2:maj','G2:min','Bb2:maj','C3:maj','A2:power'],
    melody:[
      'D5 A5/0.25 C6/0.25 A5 G5 F5 D5 F5 A5','G5/0.25 A5/0.25 G5 F5 D5 C5 D5 F5 G5','F5 D5 F5 A5 C6/1 A5 F5','D6 C6 A5 G5 A5/0.25 C6/0.25 A5 F5 D5',
      'G5/0.75 A5/0.25 C6 A5 G5 F5 D5 G5','A5 D6 C6 A5 F5/0.25 G5/0.25 A5 F5 D5','F5 A5 C6 D6 C6 A5 G5 F5','G5 C6 A5 G5 F5 D5 C5/1',
      'D6/1 C6 A5 F5 A5 C6 D6','C6 G5 C6 D6 F6 D6 C6 A5','A5 D6 F6 D6 C6 A5 F5 A5','C6/0.75 D6/0.25 F6 D6 C6 A5 G5 F5',
      'G5 C6 D6 F6 D6 C6 A5 G5','F6 D6 C6 A5 F5 A5 C6 D6','C6 A5 G5 F5 G5/0.25 A5/0.25 C6 A5 G5','A5 G5 F5 D5 C5 D5 A4/1'
    ]
  },
  paris: {
    title:'塞纳铁桥决斗',bpm:160,beats:4,style:'paris',key:'G harmonic minor',lead:'duel',
    identity:'和声小调剑斗主题、疾驰附点伴奏、厚实四拍摇滚；保留少量簧片质感。',
    chords:['G2:min','Eb2:maj','C3:min','D3:dom','G2:min','Bb2:maj','Eb2:maj','D3:dom','C3:min','F2:maj','Bb2:maj','D3:dom','Eb2:maj','C3:min','D3:dom','D3:dom'],
    melody:[
      'G5 D5/0.25 G5/0.25 Bb5 A5 G5 F#5 G5 D5','Eb5 G5 Bb5 Eb6 D6 Bb5 G5 Eb5','C6 G5 Eb5 G5 C6 D6 Eb6 C6','A5 F#5 D5 F#5 A5 C6 D6/1',
      'Bb5/0.75 A5/0.25 G5 D5 G5 Bb5 D6 G6','F6 D6 Bb5 A5 Bb5 D6 F6 D6','Eb6 D6 Bb5 G5 Eb5 G5 Bb5 Eb6','D6 C6 A5 F#5 A5/0.25 Bb5/0.25 A5 F#5 D5',
      'Eb6/1 D6 C6 G5 Bb5 C6 Eb6','F6 Eb6 C6 A5 F5 A5 C6 F6','D6 F6 Bb6 F6 D6 Bb5 A5 G5','A5 C6 D6 F#6 D6 C6 A5 F#5',
      'G5 Bb5 Eb6 G6 F6 Eb6 D6 Bb5','G6 Eb6 C6 Bb5 G5 C6 Eb6/1','F#6/0.75 G6/0.25 F#6 D6 C6 A5 F#5 D5','A5 F#5 D5 C5 D5 F#5 G5/1'
    ]
  },
  rio: {
    title:'热浪连击嘉年华',bpm:172,beats:4,style:'rio',key:'A Dorian',lead:'anthem',
    identity:'切分拳击 riff、十六分沙锤、拉丁通鼓与重型反拍；高能量狂欢战。',
    chords:['A2:min','G2:maj','D3:maj','E3:min','A2:min','C3:maj','D3:maj','E3:power','C3:maj','D3:maj','A2:min','G2:maj','D3:maj','C3:maj','G2:maj','E3:power'],
    melody:[
      '-/0.25 A5/0.25 C6 A5 G5 E5 A5/0.75 B5/0.25 C6','B5/0.75 D6/0.25 B5 G5 D5 G5 A5 B5','A5 F#5 A5 D6 C6 A5/0.25 F#5/0.25 E5 D5','E5 G5 B5 D6 B5 A5 G5 E5',
      'C6 A5/0.25 G5/0.25 E5 A5 C6 E6 D6 C6','G5 C6 E6 G6 E6 C6 B5 G5','F#5 A5 D6 F#6 E6 D6 C6 A5','B5 G5 E5 -/0.25 E5/0.25 G5 A5 B5 E6',
      'E6/0.75 G6/0.25 E6 D6 C6 B5 G5 C6','D6 A5 D6 F#6 E6 D6 A5 F#5','E6 C6 A5 C6 E6/0.25 G6/0.25 E6 D6 C6','D6 B5 G5 A5 B5 D6 G6/1',
      'F#6 E6 D6 A5 F#5 A5 D6 F#6','E6 D6 C6 G5 C6 E6 D6 C6','B5/0.25 C6/0.25 D6 B5 G5 A5 B5 D6 B5','A5 G5 E5 B4 E5 G5 A5/1'
    ]
  },
  cairo: {
    title:'沙海钢拳风暴',bpm:170,beats:4,style:'cairo',key:'E Phrygian dominant',lead:'blade',
    identity:'半音与增二度形成沙海压迫感，低音踏板、双底鼓、错拍通鼓推动近身战。',
    chords:['E2:maj','F2:maj','E2:maj','D3:min','A2:min','F2:maj','D3:min','E2:maj','F2:maj','G2:maj','A2:min','E2:maj','D3:min','F2:maj','E2:maj','E2:maj'],
    melody:[
      'E5/0.25 E5/0.25 F5 G#5 B5 G#5 F5 E5 B4','F5 A5 C6 A5 F5/0.25 E5/0.25 F5 G#5 A5','B5 E6 D6 B5 G#5 F5 E5 F5','A5 F5 D5 F5 A5 C6 D6 C6',
      'A5 C6 E6 D6 C6 B5 A5 E5','F5/0.75 G#5/0.25 A5 C6 A5 G#5 F5 E5','D6 C6 A5 F5 A5 D6 C6 A5','G#5 B5 E6 F6 E6 B5 G#5 E5',
      'C6 A5 F5 A5 C6 F6 E6 C6','B5 D6 G6 F6 D6 B5 A5 G5','E6/0.75 F6/0.25 E6 C6 A5 B5 C6 E6','F6 E6 D6 B5 G#5 B5 E6/1',
      'F6 D6 A5 C6 D6 F6 E6 D6','C6 F6 E6 C6 A5 G#5 F5 A5','B5 G#5 F5 E5 F5/0.25 G#5/0.25 B5 G#5 F5','E6 B5 G#5 F5 E5 F5 E5/1'
    ]
  },
  blocklands: {
    title:'方块战线全速推进',bpm:162,beats:4,style:'blocklands',key:'C minor / relative-major bridge',lead:'anthem',
    identity:'阶梯形方波主题、锤击般和弦与跳八度低音；冒险感转为推进战线的战斗感。',
    chords:['C3:min','Ab2:maj','Eb2:maj','Bb2:maj','C3:min','F2:min','Ab2:maj','G2:dom','Eb2:maj','Bb2:maj','C3:min','Ab2:maj','F2:min','Ab2:maj','Bb2:maj','G2:dom'],
    melody:[
      'C5 C5 Eb5 G5 Bb5 G5 Eb5 C5','Ab5 Eb5 C5 Eb5 Ab5 Bb5 C6 Ab5','G5 Eb5 G5 Bb5 Eb6 Bb5 G5 Eb5','F5/0.25 G5/0.25 F5 D5 Bb4 D5 F5 Bb5/1',
      'C5 Eb5 G5 C6 Bb5 G5 Eb5 G5','Ab5 C6 F6 Eb6 C6 Ab5 G5 F5','Eb6 C6 Ab5 C6 Eb6/0.25 F6/0.25 Eb6 C6 Ab5','B5 G5 D5 G5 B5 D6 G6 D6',
      'Eb6/1 G6 F6 Eb6 Bb5 G5 Bb5','D6 F6 Bb6 F6 D6 Bb5 Ab5 F5','G5 C6 Eb6 G6 Eb6 D6 C6 G5','Ab5 C6 Eb6 F6 Eb6 C6 Bb5 Ab5',
      'F5 Ab5 C6 F6 Eb6 C6 Ab5 F5','C6 Eb6 Ab6 Eb6 C6 Bb5 Ab5 G5','F6 D6 Bb5 D6 F6 Eb6 D6 Bb5','B5 D6 G6 D6 B5 G5 C5/1'
    ]
  },
  sharkhall: {
    title:'深海鲨袭警报',bpm:176,beats:4,style:'sharkhall',key:'B minor',lead:'blade',
    identity:'潜猎双音 riff、疾速碎拍和锯齿低音，短暂水波琶音保留水族馆辨识度。',
    chords:['B2:min','G2:maj','A2:maj','F#2:dom','B2:min','D3:maj','E3:min','F#2:dom','G2:maj','A2:maj','B2:min','D3:maj','E3:min','G2:maj','F#2:dom','F#2:dom'],
    melody:[
      'B4/0.25 C#5/0.25 D5 B4 F#5 - D5 C#5 B4','G5 D5 B4 D5 G5 A5 B5 G5','A5 E5 C#5 E5 A5 B5 C#6 A5','A#5 F#5 C#5 F#5 A#5 B5 A#5 F#5',
      'B5 F#5 D5 F#5 B5 D6 C#6 B5','A5 F#5 D5 F#5 A5 D6 E6 F#6','E6 B5 G5 B5 E6 D6 B5 G5','F#5 A#5 C#6 E6 C#6 A#5 F#5 C#5',
      'B5 D6 G6 F#6 D6 B5 G5 B5','C#6 E6 A6 E6 C#6 B5 A5 E5','F#5 B5 D6 F#6 E6 D6 C#6 B5','D6 F#6 A6 F#6 D6 A5 F#5 A5',
      'G5 B5 E6 G6 F#6 E6 D6 B5','D6 B5 G5 B5 D6 G6 F#6 D6','E6 C#6 A#5 F#5 C#5 F#5 A#5 C#6','F#6 E6 C#6 A#5 F#5 C#5 B4/1'
    ]
  },
  livehouse: {
    title:'蓝蔷薇终场燃爆',bpm:180,beats:4,style:'livehouse',key:'E minor',lead:'blade',
    identity:'重型街机摇滚，掌闷式五度和弦、连续低音、双底鼓和副歌双声部。',
    chords:['E2:min','C3:maj','G2:maj','D3:maj','E2:min','A2:min','C3:maj','B2:dom','C3:maj','D3:maj','E2:min','G2:maj','A2:min','C3:maj','D3:maj','B2:dom'],
    melody:[
      'E5/0.25 E5/0.25 B5 G5 E5 D5 E5 G5 B5','C6 G5 E5 G5 C6 D6 E6 C6','B5 G5 D5 G5 B5 D6 G6 D6','A5 F#5 D5 F#5 A5 C6 D6 A5',
      'E5 G5 B5 E6 D6 B5 G5 E5','C6 A5 E5 A5 C6 D6 E6 A6','G6 E6 C6 G5 C6 E6 D6 C6','D#6 B5 F#5 B5 D#6 E6 D#6 B5',
      'E6 G6 E6 D6 C6 G5 E5 G5','F#6 A6 F#6 E6 D6 A5 F#5 A5','G6/1 F#6 E6 B5 D6 E6 G6','D6 G6 B6 G6 D6 B5 A5 G5',
      'E6 C6 A5 C6 E6 A6 G6 E6','G5 C6 E6 G6 E6 D6 C6 G5','A5 D6 F#6 A6 G6 F#6 E6 D6','F#6 D#6 B5 A5 F#5 D#5 E5/1'
    ]
  },
  streamroof: {
    title:'天台弹幕乱斗',bpm:174,beats:4,style:'streamroof',key:'D Dorian',lead:'steel',
    identity:'高速切分战斗放克，断奏主奏、十六分跳跃低音、重鼓和短促电子应答。',
    chords:['D3:min','G2:maj','C3:maj','A2:min','D3:min','F2:maj','G2:maj','A2:dom','G2:maj','A2:min','D3:min','C3:maj','F2:maj','G2:maj','C3:maj','A2:dom'],
    melody:[
      'D5/0.25 -/0.25 F5 A5 D6 C6 A5 F5 D5','B5 G5 D5/0.25 G5/0.25 B5 D6 B5 A5 G5','E5 G5 C6 -/0.25 C6/0.25 B5 G5 E5 C5','C6 A5 E5 A5 C6 D6 E6 C6',
      'A5 D6 C6 A5 F5/0.25 G5/0.25 A5 F5 D5','F5 A5 C6 E6 F6 E6 C6 A5','B5 D6 G6 D6 B5/0.25 A5/0.25 G5 D5 B4','C#6 E6 A6 E6 C#6 B5 A5 E5',
      'D6 B5 G5 B5 D6 G6 A6 G6','E6 C6 A5 C6 E6 G6 E6 C6','F6 E6 D6 A5 D6 F6 E6 D6','E6 G6 C7 G6 E6 D6 C6 G5',
      'C6 F6 A6 G6 F6 E6 C6 A5','D6 G6 B6 G6 D6 B5 A5 G5','E6 D6 C6 G5 E5 G5 C6 E6','C#6 A5 E5 C#5 E5 G5 A5/1'
    ]
  }
};

const CHORDS={maj:[0,4,7],min:[0,3,7],dom:[0,4,7,10],power:[0,7,12]};
const INSTRUMENTS={
  anthem:{wave:'square',gain:0.081,attack:0.006,release:0.033,sustain:0.7,pan:-0.1,cutoff:3800,role:'lead'},
  blade:{wave:'sawtooth',gain:0.106,attack:0.004,release:0.03,sustain:0.74,pan:-0.12,cutoff:3400,role:'lead'},
  steel:{wave:'square',gain:0.095,attack:0.003,release:0.038,sustain:0.46,pan:-0.17,cutoff:2900,role:'lead'},
  duel:{wave:'square',gain:0.079,attack:0.008,release:0.036,sustain:0.65,pan:-0.1,cutoff:3250,role:'lead'},
  bass:{wave:'triangle',gain:0.205,attack:0.004,release:0.023,sustain:0.79,pan:0,cutoff:1800,role:'bass'},
  grit:{wave:'sawtooth',gain:0.039,attack:0.004,release:0.019,sustain:0.6,pan:0.02,cutoff:750,role:'bass'},
  power:{wave:'sawtooth',gain:0.039,attack:0.004,release:0.021,sustain:0.73,pan:0.22,cutoff:2300,role:'rhythm'},
  answer:{wave:'triangle',gain:0.065,attack:0.004,release:0.045,sustain:0.45,pan:0.32,cutoff:3700,role:'counter'},
  arp:{wave:'square',gain:0.021,attack:0.003,release:0.031,sustain:0.27,pan:0.4,cutoff:3000,role:'arp'},
  water:{wave:'sine',gain:0.068,attack:0.005,release:0.065,sustain:0.23,pan:0.38,role:'arp'},
  bell:{wave:'triangle',gain:0.064,attack:0.002,release:0.055,sustain:0.15,pan:0.35,role:'arp'},
  kick:{wave:'sine',gain:0.315,attack:0.002,release:0.052,sustain:0.018,pan:0,role:'drum'},
  snare:{wave:'noise',gain:0.115,attack:0.001,release:0.039,sustain:0.045,pan:-0.05,role:'drum'},
  hat:{wave:'noise',gain:0.026,attack:0.001,release:0.014,sustain:0.016,pan:0.25,role:'drum'},
  shaker:{wave:'noise',gain:0.027,attack:0.003,release:0.021,sustain:0.018,pan:-0.35,role:'drum'},
  crash:{wave:'noise',gain:0.038,attack:0.002,release:0.1,sustain:0.055,pan:0.12,role:'drum'},
  tom:{wave:'sine',gain:0.15,attack:0.002,release:0.048,sustain:0.028,pan:0.15,role:'drum'}
};
function midi(name){
  const m=/^([A-G])([#b]?)([0-8])$/.exec(name);
  if(!m)throw new Error('Invalid music note: '+name);
  return (Number(m[3])+1)*12+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);
}
function parseBar(bar,beats){
  let time=0;
  const notes=bar.split(/\s+/).map(token=>{
    const [name,length]=token.split('/'),duration=length?Number(length):0.5;
    if(!(duration>0))throw new Error('Invalid duration '+token);
    const n={beat:time,duration,midi:name==='-'?null:midi(name)};time+=duration;return n;
  });
  if(Math.abs(time-beats)>1e-8)throw new Error('Bar is '+time+' beats, expected '+beats+': '+bar);
  return notes;
}
function compile(trackId){
  const s=SCORES[trackId];if(!s)throw new RangeError('Unknown FighterMusic track: '+trackId);
  const events=[],beatSeconds=60/s.bpm;
  const add=(bar,beat,length,note,instrument,velocity=1)=>events.push({time:(bar*s.beats+beat)*beatSeconds,duration:length*beatSeconds,midi:note,instrument,velocity,bar});
  const drum=(bar,beat,kind,velocity=1)=>add(bar,beat,kind==='crash'?0.6:kind==='kick'?0.25:kind==='tom'?0.3:kind==='snare'?0.25:0.1,kind==='tom'?48:36,kind,velocity);
  for(let bar=0;bar<32;bar++){
    const section=Math.floor(bar/8),bridge=section===2,reprise=section===3,k=(bridge?8:0)+bar%8;
    const [rootName,quality]=s.chords[k].split(':'),root=midi(rootName),tones=CHORDS[quality],notes=parseBar(s.melody[k],4);
    if(!tones)throw new Error('Invalid chord '+s.chords[k]);
    // The lead keeps a strong, lower arcade register. Rare climaxes above G6 are
    // written as octave answers, avoiding the old persistent piercing high register.
    for(let j=0;j<notes.length;j++){
      const n=notes[j];if(n.midi===null)continue;
      const pitch=n.midi>91?n.midi-12:n.midi;
      const tail=bar===31&&n.beat+n.duration>=4;
      add(bar,n.beat,n.duration*(tail?0.62:section===1?0.76:0.86),pitch,s.lead,bridge?1.02:0.96);
      // A' contains rhythmic low answers; final chorus gains octave support.
      if(section===1&&j%4===2&&n.beat+0.25<4)add(bar,n.beat+0.25,0.2,pitch-12,'answer',0.64);
      if(reprise&&(j%3===0||n.duration>=1))add(bar,n.beat,Math.min(n.duration*0.7,0.6),pitch-12,'answer',0.75);
      if(bridge&&bar%2===1&&n.duration>=1)add(bar,n.beat+0.5,0.25,pitch-12,'answer',0.8);
    }
    let bassPattern;
    switch(s.style){
      case 'arcade':bassPattern=[[0,0,.36],[.5,0,.17],[.75,12,.17],[1,0,.35],[1.5,7,.32],[2,0,.35],[2.5,0,.17],[2.75,12,.17],[3,7,.35],[3.5,12,.34]];break;
      case 'paris':bassPattern=[[0,0,.36],[.5,7,.17],[.75,12,.17],[1,0,.36],[1.5,7,.17],[1.75,12,.17],[2,0,.36],[2.5,7,.17],[2.75,12,.17],[3,0,.36],[3.5,7,.35]];break;
      case 'rio':bassPattern=[[0,0,.33],[.75,12,.2],[1,0,.25],[1.5,7,.33],[2,0,.33],[2.75,12,.2],[3,tones[1],.25],[3.5,7,.34]];break;
      case 'streamroof':bassPattern=[[0,0,.2],[.5,12,.18],[.75,0,.18],[1.25,7,.18],[1.5,12,.3],[2,0,.2],[2.5,tones[1],.18],[2.75,12,.18],[3.25,7,.18],[3.5,12,.32]];break;
      case 'cairo':bassPattern=[[0,0,.35],[.5,0,.17],[.75,0,.17],[1,7,.3],[1.5,0,.35],[2,0,.35],[2.5,0,.17],[2.75,0,.17],[3,12,.35],[3.5,7,.32]];break;
      case 'sharkhall':bassPattern=[[0,0,.45],[.75,0,.2],[1,12,.35],[1.75,7,.2],[2,0,.32],[2.5,0,.18],[2.75,12,.18],[3.25,7,.18],[3.5,0,.33]];break;
      case 'livehouse':bassPattern=[[0,0,.35],[.5,0,.16],[.75,0,.16],[1,0,.35],[1.5,7,.3],[2,0,.35],[2.5,0,.16],[2.75,0,.16],[3,0,.35],[3.5,12,.3]];break;
      case 'blocklands':bassPattern=[[0,0,.38],[.5,12,.35],[1,7,.38],[1.5,12,.35],[2,0,.38],[2.5,12,.35],[3,7,.35],[3.5,tones[1],.33]];break;
      case 'shanghai':bassPattern=[[0,0,.37],[.5,12,.3],[1,0,.35],[1.5,7,.32],[2,0,.35],[2.5,12,.3],[3,7,.32],[3.5,0,.33]];break;
      default:bassPattern=[[0,0,.36],[.5,0,.33],[1,7,.36],[1.5,12,.3],[2,0,.36],[2.5,0,.33],[3,7,.36],[3.5,12,.3]];
    }
    for(const [beat,interval,length] of bassPattern){
      add(bar,beat,length,root+interval,'bass',beat%1?0.87:1);
      if(['sharkhall','livehouse','arcade','cairo'].includes(s.style))add(bar,beat,length,root+interval,'grit',0.78);
    }
    const rhythm={select:[0,.5,1.5,2,2.5,3.5],arcade:[0,.75,1.5,2,2.75,3.5],shanghai:[0,1,1.5,2,3,3.5],paris:[0,.75,1.5,2,2.75,3.5],rio:[0,.75,1.5,2.5,3.25],cairo:[0,.75,1.5,2,2.75,3.5],blocklands:[0,.5,1.5,2,2.5,3.5],sharkhall:[0,1.75,2.5,3.5],livehouse:[0,.5,.75,1.5,2,2.5,2.75,3.5],streamroof:[0,.75,1.5,2.25,2.75,3.5]}[s.style];
    for(const t of rhythm){
      const duration=bridge&&t===0?.62:t%1===0?.34:.2;
      for(const interval of [0,7])add(bar,t,duration,root+12+interval,'power',t%1===0?.95:.72);
      if(reprise&&t===0)add(bar,t,.5,root+24,'power',.48);
    }
    // The map color is an accent behind the combat riff, never a soft ambient bed.
    const step=s.style==='sharkhall'?.25:.5;
    for(let j=0;j<4/step;j++){
      if(section===0&&j%2===1)continue;
      if(s.style==='livehouse'&&j%2===1)continue;
      const order=s.style==='shanghai'?[0,2,1,2,0,1,2,1]:s.style==='sharkhall'?[0,2,1,2,0,1,2,1]:[0,2,1,2,2,0,1,2];
      add(bar,j*step,.16,root+24+tones[order[(j+bar%2)%8]%tones.length],s.style==='sharkhall'?'water':s.style==='shanghai'?'bell':'arp',bridge?.82:.62);
    }
    const kicks={select:[0,.75,2,2.5],arcade:[0,.5,.75,2,2.5,2.75],shanghai:[0,.75,2,2.5,3.5],paris:[0,.5,1.75,2,2.5],rio:[0,.75,1.5,2,2.75,3.5],cairo:[0,.5,.75,2,2.5,2.75],blocklands:[0,.5,2,2.75],sharkhall:[0,1.75,2.5,3.5],livehouse:[0,.5,.75,2,2.5,2.75],streamroof:[0,.75,1.75,2.5,3.5]}[s.style];
    for(const b of kicks)drum(bar,b,'kick',b%1?.78:1);
    drum(bar,1,'snare',1);drum(bar,3,'snare',1.06);
    if(['rio','sharkhall','streamroof'].includes(s.style))drum(bar,2.75,'snare',.28);
    const sixteenths=['arcade','rio','sharkhall','livehouse','streamroof'].includes(s.style)||bridge;
    for(let j=0;j<(sixteenths?16:8);j++)drum(bar,j*(sixteenths?.25:.5),s.style==='rio'?'shaker':'hat',j%4===0?.84:j%2===0?.66:.36);
    if(s.style==='rio'||s.style==='cairo')for(const t of [.75,2.25,3.5])drum(bar,t,'tom',s.style==='cairo'?.58:.42);
    if(s.style==='shanghai'&&bar%4===2){drum(bar,2.75,'tom',.52);drum(bar,3.5,'tom',.64);}
    if(bar%8===0)drum(bar,0,'crash',.76);
    if(bar%4===3){
      for(let j=0;j<(bar%8===7?4:2);j++)drum(bar,(bar%8===7?3:3.5)+j*.25,j>1?'tom':'snare',.4+j*.12);
    }
    if(bar%8===7){drum(bar,3.5,'kick',.76);drum(bar,3.75,'kick',.7);}
  }
  events.sort((a,b)=>a.time-b.time);
  return {id:trackId,bpm:s.bpm,beatsPerBar:s.beats,bars:32,duration:32*4*beatSeconds,events};
}
const TRACKS=Object.freeze(Object.fromEntries(Object.entries(SCORES).map(([id,s])=>[id,Object.freeze({id,title:s.title,bpm:s.bpm,beatsPerBar:s.beats,bars:32,seconds:32*s.beats*60/s.bpm,key:s.key,identity:s.identity})])));

  const hz = n => 440*Math.pow(2,(n-69)/12);
  const clamp = x => Math.max(0,Math.min(1,Number.isFinite(Number(x))?Number(x):0));
  function envelope(p,t,d,peak,ins) {
    const a=Math.min(ins.attack,d*0.2), decay=Math.min(0.07,d*0.3), release=ins.release;
    p.setValueAtTime(0,t);
    p.linearRampToValueAtTime(peak,t+a);
    p.exponentialRampToValueAtTime(Math.max(0.00001,peak*ins.sustain),t+a+decay);
    p.setValueAtTime(Math.max(0.00001,peak*ins.sustain),t+d);
    p.linearRampToValueAtTime(0,t+d+release);
    return t+d+release+0.008;
  }
  function ramp(param,value,time,seconds) {
    if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(time);
    else {const previous=param.value;param.cancelScheduledValues(time);param.setValueAtTime(previous,time);}
    param.linearRampToValueAtTime(value,time+seconds);
  }
  class FighterMusic {
    constructor({getContext,volume=0.24}={}) {
      if(typeof getContext!=='function')throw new TypeError('FighterMusic requires getContext for the shared AudioContext');
      this.getContext=getContext;this.volume=clamp(volume);this.muted=false;this.paused=false;this.unlocked=false;
      this.currentTrack=null;this.tracks=TRACKS;this.context=null;this.master=null;this._timer=null;this._session=null;
      this._retired=[];this._cache=new Map();this._offset=0;this._destroyed=false;this._noise=null;this._graph=[];
      this._tickBound=()=>this._tick();
    }
    async unlock() {
      if(this._destroyed)return false;
      const ctx=this.getContext(); if(!ctx || ctx.state==='closed')return false;
      // resume is intentionally called only by this gesture-entry method.
      try {if(ctx.state!=='running')await ctx.resume();}catch(_){return false;}
      if(this._destroyed || ctx.state!=='running')return false;
      if(this.context!==ctx){this._dropContext();this._setup(ctx);}
      this.unlocked=true;
      if(this.currentTrack && !this.paused && !this._session)this._start(this.currentTrack,this._offset);
      return true;
    }
    _setup(ctx) {
      this.context=ctx;
      const high=ctx.createBiquadFilter(),low=ctx.createBiquadFilter(),master=ctx.createGain();
      high.type='highpass';high.frequency.value=28;high.Q.value=0.7;
      low.type='lowpass';low.frequency.value=6800;low.Q.value=0.55;
      master.gain.value=this.muted?0:this.volume;
      high.connect(low);low.connect(master);master.connect(ctx.destination);
      this.input=high;this.master=master;this._graph=[high,low,master];
      const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*0.45),ctx.sampleRate),data=buffer.getChannelData(0);
      let seed=0x1f2e3d4c,prior=0;
      for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;const v=(seed>>>0)/2147483648-1;data[i]=(v-prior)*0.5;prior=v;}
      this._noise=buffer;
    }
    _score(id) {
      if(this._cache.has(id)){const v=this._cache.get(id);this._cache.delete(id);this._cache.set(id,v);return v;}
      const score=compile(id);this._cache.set(id,score);if(this._cache.size>3)this._cache.delete(this._cache.keys().next().value);return score;
    }
    play(trackId) {
      if(this._destroyed)return this;
      if(!TRACKS[trackId])throw new RangeError('Unknown FighterMusic track: '+trackId);
      if(this.currentTrack===trackId){if(this.unlocked&&!this.paused&&!this._session)this._start(trackId,this._offset);return this;}
      this._retire(0.22);this.currentTrack=trackId;this._offset=0;
      if(this.unlocked&&!this.paused)this._start(trackId,0);
      return this;
    }
    _start(id,offset) {
      const ctx=this.context;if(!ctx || ctx.state!=='running' || this._destroyed)return;
      const score=this._score(id),position=((offset%score.duration)+score.duration)%score.duration;
      const bus=ctx.createGain();bus.gain.setValueAtTime(0,ctx.currentTime);bus.gain.linearRampToValueAtTime(1,ctx.currentTime+0.22);bus.connect(this.input);
      const origin=ctx.currentTime+0.025-position;
      let index=score.events.findIndex(e=>e.time>=position);if(index<0)index=score.events.length;
      this._session={id,score,bus,origin,index,loop:0,voices:new Set()};
      if(this._timer===null)this._timer=setInterval(this._tickBound,25);
      this._tick();
    }
    _voice(e,time,session) {
      if(session.voices.size>=96)return; // Hard cap also protects very rapid map changes.
      const ctx=this.context,ins=INSTRUMENTS[e.instrument],gain=ctx.createGain();
      let source=ins.wave==='noise'?ctx.createBufferSource():ctx.createOscillator();
      if(ins.wave==='noise')source.buffer=this._noise;
      else {
        source.type=ins.wave;
        source.frequency.setValueAtTime(e.instrument==='kick'?145:e.instrument==='tom'?190:hz(e.midi),time);
        if(e.instrument==='kick'||e.instrument==='tom')source.frequency.exponentialRampToValueAtTime(e.instrument==='kick'?42:85,time+e.duration);
      }
      const nodes=[source,gain];let output=gain;
      if(ins.wave==='noise'){
        const filter=ctx.createBiquadFilter();filter.type='highpass';filter.frequency.value=e.instrument==='snare'?900:e.instrument==='crash'?3100:e.instrument==='shaker'?3500:5800;
        source.connect(filter);filter.connect(gain);nodes.push(filter);
      }else if(ins.cutoff){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=ins.cutoff;filter.Q.value=0.55;source.connect(filter);filter.connect(gain);nodes.push(filter);}else source.connect(gain);
      if(typeof ctx.createStereoPanner==='function' && ins.pan){const pan=ctx.createStereoPanner();pan.pan.value=ins.pan;gain.connect(pan);output=pan;nodes.push(pan);}
      output.connect(session.bus);
      const end=envelope(gain.gain,time,e.duration,ins.gain*e.velocity,ins),voice={source,nodes,end};
      session.voices.add(voice);
      source.onended=()=>{session.voices.delete(voice);for(const n of nodes){try{n.disconnect();}catch(_){}}};
      source.start(time);source.stop(end);
    }
    _tick() {
      const ctx=this.context;if(!ctx)return;
      const now=ctx.currentTime;
      for(let i=this._retired.length-1;i>=0;i--){const s=this._retired[i];if(now>=s.disposeAt){this._dispose(s);this._retired.splice(i,1);}}
      const s=this._session;
      if(!s){if(this._retired.length===0)this._clearTimer();return;}
      if(ctx.state!=='running')return;
      const horizon=now+0.16,score=s.score;
      // A throttled/background tab seeks into musical time instead of bursting overdue notes.
      let time=s.origin+s.loop*score.duration+(score.events[s.index]?.time??score.duration);
      if(time<now-0.1){
        const elapsed=Math.max(0,now+0.015-s.origin);s.loop=Math.floor(elapsed/score.duration);
        const phase=elapsed-s.loop*score.duration;let lo=0,hi=score.events.length;
        while(lo<hi){const mid=(lo+hi)>>>1;if(score.events[mid].time<phase)lo=mid+1;else hi=mid;}
        s.index=lo;
      }
      let count=0;
      while(count++<256){
        if(s.index>=score.events.length){s.index=0;s.loop++;}
        const event=score.events[s.index],when=s.origin+s.loop*score.duration+event.time;
        if(when>=horizon)break;
        if(when>=now-0.006)this._voice(event,Math.max(now+0.002,when),s);
        s.index++;
      }
    }
    _retire(seconds=0.12) {
      const s=this._session;if(!s)return;
      this._session=null;
      const now=this.context.currentTime;s.disposeAt=now+seconds+0.025;
      ramp(s.bus.gain,0,now,seconds);
      for(const v of s.voices){try{v.source.stop(s.disposeAt);}catch(_){}}
      this._retired.push(s);
      // At most four previous fades, even when callers switch tracks every frame.
      if(this._retired.length>4)this._dispose(this._retired.shift());
    }
    _dispose(s) {for(const v of s.voices){try{v.source.stop();}catch(_){}for(const n of v.nodes){try{n.disconnect();}catch(_){}}}s.voices.clear();try{s.bus.disconnect();}catch(_){}}
    _clearTimer(){if(this._timer!==null){clearInterval(this._timer);this._timer=null;}}
    _dropContext(){this._clearTimer();if(this._session)this._dispose(this._session);for(const s of this._retired)this._dispose(s);this._session=null;this._retired=[];for(const n of this._graph){try{n.disconnect();}catch(_){}}this._graph=[];this.master=null;this.input=null;this._noise=null;this.context=null;this.unlocked=false;}
    setMuted(value){this.muted=!!value;if(this.master)ramp(this.master.gain,this.muted?0:this.volume,this.context.currentTime,0.045);return this;}
    setVolume(value){this.volume=clamp(value);if(this.master)ramp(this.master.gain,this.muted?0:this.volume,this.context.currentTime,0.065);return this;}
    setPaused(value){
      value=!!value;if(value===this.paused)return this;this.paused=value;
      if(value){if(this._session)this._offset=Math.max(0,this.context.currentTime-this._session.origin)%this._session.score.duration;this._retire(0.08);}
      else if(this.currentTrack && this.unlocked)this._start(this.currentTrack,this._offset);
      return this;
    }
    stop(){this._retire(0.12);this.currentTrack=null;this._offset=0;return this;}
    destroy(){if(this._destroyed)return;this.stop();this._dropContext();this._cache.clear();this._destroyed=true;}
    getState(){return {trackId:this.currentTrack,playing:!!this._session,unlocked:this.unlocked,paused:this.paused,muted:this.muted,volume:this.volume,seconds:this._session?Math.max(0,this.context.currentTime-this._session.origin)%this._session.score.duration:this._offset,activeVoices:(this._session?.voices.size||0)+this._retired.reduce((n,s)=>n+s.voices.size,0),cachedTracks:this._cache.size};}
    static compile(id){return compile(id);}
  }
  FighterMusic.tracks=TRACKS;
  FighterMusic.instruments=INSTRUMENTS;
  FighterMusic.version='2.0.0-combat-original';
  if(typeof module!=='undefined' && module.exports)module.exports=FighterMusic;
  global.FighterMusic=FighterMusic;
})(typeof window!=='undefined'?window:globalThis);
