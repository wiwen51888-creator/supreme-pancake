(()=>{
'use strict';
const schoolNames={力:'力击',术:'奇术',声:'声浪',巧:'机巧'};
const statusNames={burn:'灼烧',slow:'减速',weaken:'弱化',expose:'易伤',attack:'攻击提升',haste:'加速',regen:'持续回复',counter:'反击',defend:'减伤'};
const physical=new Set(['light','heavy','dash','upper','slam','grab']);
function school(c,s){
 if(physical.has(s.type)||s.physical)return '力';
 if(/音|声|唱|麦|琴|鼓|贝斯|哈气|咕|齁|通知|道理|笑/.test(s.name+' '+s.fx))return '声';
 if(/chip|keyboard|cannon|block|coin|feiqiu|gear|prison|phone|piano/.test(s.fx||'')||/方块|键盘|AI|八分钱|足球/.test(s.name))return '巧';
 return '术';
}
function adapt(c,index,slot){
 const src=c.skills[index],ult=slot===3,high=slot===2;
 const s={name:src.name,sourceIndex:index,source:src,slot,cost:slot===0?0:ult?100:high?42:28,school:school(c,src),target:'enemy',area:'single',power:slot===0?1:ult?3.2:high?1.8:1.45,break:1,melee:physical.has(src.type),status:{},mimic:!!src.mimic};
 if(slot===0){s.break=1;return s;}
 if(['barrage','beam','rain','burst','slam'].includes(src.type)){
  s.melee=false;s.area=ult?'all':src.type==='beam'?'column':'row';s.power=ult?1.65:high?1.0:.85;s.break=src.type==='burst'?2:1;
 }
 if(src.type==='throw'){s.melee=false;if(ult){s.area='row';s.power=2.05;}if(src.splash&&!ult){s.area='column';s.power=high?1.12:.95;}}
 if(src.type==='summon'){s.melee=false;s.power=ult?1.6:high?1.85:1.45;s.area=ult?'all':'single';s.break=2;}
 if(src.type==='trap'){s.melee=false;s.power=high?1.2:.95;s.status.slow=2;s.status.expose=2;}
 if(src.type==='grab'){s.power=high?1.6:1.35;s.push=true;s.break=2;}
 if(src.type==='counter'){s.target='self';s.power=0;s.melee=false;s.shield=high?2.4:1.8;s.status={counter:2,defend:2};}
 if(src.type==='wall'){s.target='ally';s.area='row';s.power=0;s.melee=false;s.shield=high?1.65:1.25;s.status={defend:2};}
 if(src.type==='buff'){
  s.target='ally';s.melee=false;s.power=0;
  if(src.heal||/补|美食|续盘|开饭|红茶|调饮|糖|创可贴|换气/.test(src.name)){s.heal=high?2.8:2.15;s.cleanse=true;}
  else{s.status={attack:2,haste:2};s.shield=.65;}
  if(c.role==='支援'&&high){s.area='row';if(s.heal)s.heal=1.3;else s.shield=.4;}
  if(c.role!=='支援'&&s.heal)s.target='self';
 }
 if(src.type==='transform'){s.form=src.form;s.melee=false;s.area=ult?'all':'single';s.power=ult?1.3:1.05;}
 if(src.form&&ult&&src.type!=='transform'){s.form=src.form;s.power*=.82;}
 if(src.burn){s.status.burn=2;s.power*=.85;}if(src.slow){s.status.slow=2;s.power*=.94;}
 if(src.type==='dash'&&!ult){s.status.expose=2;s.power*=.92;}
 if(ult)s.break=2;
 return s;
}
const special={
 '电棍':{1:{target:'self',area:'single',power:0,status:{attack:3,haste:2},selfHeal:0},2:{target:'self',area:'single',power:0,heal:3.1,cleanse:true,status:{}}},
 '七海':{0:{school:'声',melee:false,power:1},2:{power:1.75,area:'single',break:3,school:'力',melee:true}},
 '阿梓':{1:{school:'声',break:2},2:{school:'声',area:'row',power:1.05,status:{weaken:2}}},
 '小松绿':{1:{school:'术',status:{slow:2}},2:{school:'术',area:'column',power:1.12}},
 '山泥若':{1:{school:'术',status:{slow:3}},2:{school:'巧',break:2,status:{slow:2,expose:2}}},
 '藤都子':{0:{power:1.05},1:{power:1.3,break:2},3:{teamShield:.8}},
 '千石由乃':{1:{school:'巧',break:2},2:{target:'ally',area:'single',power:0,heal:0,shield:0,grantEnergy:32,cleanse:true,status:{haste:2}}},
 '峰月律':{1:{melee:true,area:'row',power:.94},2:{target:'self',power:0,heal:3.1,status:{attack:2}}},
 '宫永野乃花':{2:{form:'rabbit',melee:false,leech:true,power:1.5}},
 '若叶睦':{2:{target:'ally',power:0,area:'row',shield:1.7,status:{defend:2}}},
 '贝拉':{1:{shield:2.1,status:{counter:2,defend:2}},2:{area:'single',power:1.85,break:2}},
 '尼古喵喵':{2:{target:'self',power:0,status:{attack:3,haste:3},shield:1.1}},
 '牛来':{2:{power:1.65,selfShield:.5,break:2}},
 '牛妈妈':{2:{power:1.55,break:2,selfHeal:.13}},
 '露早':{1:{power:1.45,break:2},2:{power:1.3,status:{burn:3},school:'术'}},
 '永雏塔菲':{2:{energy:12,power:1.6}},
 '高松灯':{1:{target:'ally',power:0,heal:2.0,cleanse:true},3:{power:1.35,teamHeal:.1}},
 '高松灯企鹅':{2:{target:'ally',area:'single',power:0,heal:2.2,cleanse:true}},
 '灰泽满':{1:{status:{slow:2}},2:{target:'ally',area:'single',power:0,heal:2.2,cleanse:true}},
 '李老八':{1:{melee:false,school:'巧',power:1.5,break:2}},
 '奶龙':{1:{status:{burn:2}},2:{target:'self',power:0,heal:3,status:{}}},
 '乔希':{0:{mimic:true},1:{mimic:true},2:{mimic:true},3:{mimic:true}}
};
function describe(s){
 if(s.mimic)return s.slot===0?'随机模仿其他角色的普攻；回复 24 能量。':'随机模仿其他角色的同档技能；消耗和强度按本档计算。';
 const scope=s.target==='self'?'自身':s.target==='ally'?(s.area==='row'?'同排友军':s.area==='all'?'全体友军':'一名友军'):(s.area==='all'?'全体敌人':s.area==='row'?'一排敌人':s.area==='column'?'一列敌人':s.melee?'可接近的敌人':'一名敌人');
 const parts=[scope];if(s.power)parts.push(Math.round(s.power*100)+'% 攻击伤害 · '+schoolNames[s.school]+` · 弱点削 ${s.break} 格`);if(s.heal)parts.push(Math.round(s.heal*100)+'% 攻击治疗');if(s.shield)parts.push(Math.round(s.shield*100)+'% 攻击护盾');if(s.selfShield)parts.push('自身获得 '+Math.round(s.selfShield*100)+'% 攻击护盾');if(s.teamShield)parts.push('全队获得 '+Math.round(s.teamShield*100)+'% 攻击护盾');if(s.grantEnergy)parts.push('目标回复 '+s.grantEnergy+' 能量');if(s.cleanse)parts.push('净化负面状态');
 for(const [key,n] of Object.entries(s.status||{}))parts.push(statusNames[key]+' '+(n-1||1)+' 次行动');if(s.form)parts.push('变身，强化后续两次行动');if(s.push)parts.push('推至同列另一空位');if(s.leech)parts.push('伤害的 35% 回复自身');if(s.selfHeal)parts.push('自身回复 '+Math.round(s.selfHeal*100)+'% 生命');if(s.energy)parts.push('额外回复 '+s.energy+' 能量');if(s.teamHeal)parts.push('全队回复 10% 生命');if(s.slot===0)parts.push('回复 24 能量');return parts.join('；')+'。';
}
// The adapter reads source moves through the immutable fighter catalogue.
window.TURN_ROSTER=ROSTER.map(original=>{
 const d=TURN_CHOICES[original.id],base=AbstractTactics.ROLES[d.role];
 const c={...original,role:d.role,...base,feature:d.feature,original};
 c.skills=d.indices.map((index,slot)=>{const s=adapt(c,index,slot);Object.assign(s,special[c.name]?.[slot]||{});s.desc=describe(s);return s;});return c;
});
window.TURN_BY_ID=new Map(TURN_ROSTER.map(c=>[c.id,c]));window.TURN_SCHOOLS=schoolNames;
})();
