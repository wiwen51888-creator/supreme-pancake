(()=>{
'use strict';
const D=()=>window.CHESS_BY_ID,R=()=>window.CHESS_RULES,copy=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
class Random{constructor(seed){this.state=(seed>>>0)||123456789;}next(){let x=this.state;x^=x<<13;x^=x>>>17;x^=x<<5;this.state=x>>>0;return this.state/4294967296;}pick(a){return a[Math.floor(this.next()*a.length)];}shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(this.next()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}}
function bonds(pieces){const counts={};for(const id of new Set(pieces.filter(Boolean).map(p=>p.id))){const c=D().get(id);for(const key of [c.role,...c.bonds])counts[key]=(counts[key]||0)+1;}return Object.entries(counts).map(([key,count])=>({key,count,level:R().traits[key].steps.filter(n=>count>=n).length,...R().traits[key]}));}
function bondLevel(list,key){return list.find(b=>b.key===key)?.level||0;}
// One shared model supplies actual battle attributes and arrangement estimates.
const popcount=n=>{n-=n>>>1&0x55555555;n=(n&0x33333333)+(n>>>2&0x33333333);return((n+(n>>>4)&0x0f0f0f0f)*0x01010101)>>>24;};
class LineupEvaluator{
 constructor(pieces){
  this.pieces=pieces.filter(Boolean).slice().sort((a,b)=>a.uid-b.uid);if(this.pieces.length>17)throw Error('持牌超过有效人口和候补上限');
  const ids=[...new Set(this.pieces.map(p=>p.id))];this.bits=new Map(ids.map((id,i)=>[id,1<<i]));
  this.items=this.pieces.map(p=>({p,c:D().get(p.id),bit:this.bits.get(p.id)}));
  this.groups=Object.entries(R().traits).map(([key,g])=>({key,...g,auraEntries:Object.entries(g.aura||{}),mask:ids.reduce((m,id)=>m|((g.relationship?D().get(id).bonds.includes(key):D().get(id).role===key)?this.bits.get(id):0),0)})).filter(g=>popcount(g.mask)>=g.steps[0]);
  for(const item of this.items){item.connections=this.groups.map((g,i)=>g.mask&item.bit?i:-1).filter(i=>i>=0);item.cache=new Map();}
 }
 evaluate(mask,details=false){
  let identities=0;const chosen=[],leaders=new Map();for(let i=0;i<this.items.length;i++)if(mask&(1<<i)){const item=this.items[i];chosen.push(item);identities|=item.bit;const old=leaders.get(item.p.id);if(!old||item.p.star>old.p.star)leaders.set(item.p.id,item);}
  const levels=this.groups.map(g=>{const n=popcount(g.mask&identities);let level=0;for(const step of g.steps)if(n>=step)level++;return level;});
  let score=0,front=0,damageRole=0;const profiles=[];
  for(const item of chosen){const {p,c,bit}=item,lead=leaders.get(p.id)===item,key=chosen.length+':'+Number(lead)+':'+item.connections.map(i=>levels[i]).join('');
   if(c.range<=1)front+=c.role==='先锋'?1.2:c.role==='强攻'?.7:.55;if(['强攻','游击','术士'].includes(c.role))damageRole++;
   const cached=item.cache.get(key);if(cached){score+=cached.scoreValue;if(details)profiles.push(cached);continue;}
   const named={hp:0,attack:0,haste:0,spell:0,healing:0},mods={hp:0,attack:0,armor:0,haste:0,spell:0,healing:0},relations={};let proc=0;
   for(const i of item.connections){const g=this.groups[i],level=levels[i];if(!level)continue;if(g.relationship){relations[g.id]=level;if(lead){for(const [key,values]of g.auraEntries)named[key]+=values[level-1]||0;if(g.category!=='signature')proc+=g.category==='team'?.03+.012*(level-1):g.category==='theme'?.022+.008*(level-1):.014;}}else mods[g.mod]+=g.values[level-1];}
   for(const key of Object.keys(named)){named[key]=Math.min(named[key],R().namedAuraLimits[key]);mods[key]+=named[key];}
   const star=R().stars[p.star-1],hp=Math.round(c.hp*star*(1+mods.hp)),attack=c.attack*star*(1+mods.attack),armor=c.armor+mods.armor,interval=c.interval/(1+mods.haste),spell=1+mods.spell,healing=1+mods.healing;
   const skill=c.skill,area=skill.area==='single'?1:skill.area==='row'?1.4:1.6,cycle=Math.max(3.5,(100-c.startMana)/(c.manaHit+6)*interval+1.1);
   const spellDamage=attack*(skill.mimic?3.2:skill.power||0)*spell*area;
   const support=attack*((skill.heal||0)+(skill.shield||0)*area+(skill.teamHealPower||0)+(skill.selfShield||0)+(skill.teamShield?.6*chosen.length:0))*healing+(skill.grantEnergy||0)*Math.min(2,chosen.length-1)*attack*.055;
   const output=attack/interval+spellDamage/cycle*.75+support/cycle*.58;
   const value=Math.sqrt(hp*(1+armor/100)*output)/250;
   const profile={piece:p,data:c,hp,attack,armor,interval,spell,healing,relations,relationLead:lead,namedAura:named,value,scoreValue:value*(1+Math.min(.11,proc))};item.cache.set(key,profile);score+=profile.scoreValue;if(details)profiles.push(profile);
  }
  // An uncovered team pays for losing cast uptime and protection. No reward is
  // granted for bonds held only on the bench or for merely owning many labels.
  if(chosen.length>=3){score*=1-.075*Math.max(0,Math.min(2.4,chosen.length*.36)-front);if(damageRole===0)score*=.94;}
  return details?{score,profiles,active:this.groups.flatMap((g,i)=>levels[i]?[{...g,level:levels[i]}]:[]),unique:popcount(identities)}:score;
 }
 best(count){count=Math.min(count,this.items.length);let bestMask=0,bestScore=-Infinity,bestUnique=-1,evaluated=0;const total=this.items.length;
  const visit=(start,left,mask)=>{if(!left){const score=this.evaluate(mask),ids=this.items.reduce((n,x,i)=>n|((mask&(1<<i))?x.bit:0),0),unique=popcount(ids);evaluated++;if(score>bestScore+1e-9||Math.abs(score-bestScore)<=1e-9&&unique>bestUnique){bestMask=mask;bestScore=score;bestUnique=unique;}return;}for(let i=start;i<=total-left;i++)visit(i+1,left-1,mask|(1<<i));};
  visit(0,count,0);return {...this.evaluate(bestMask,true),mask:bestMask,evaluated,chosen:this.pieces.filter((p,i)=>bestMask&(1<<i)),bench:this.pieces.filter((p,i)=>!(bestMask&(1<<i)))};
 }
}
function lineupProfiles(pieces){const model=new LineupEvaluator(pieces);return model.evaluate((1<<model.items.length)-1,true);}

class Tournament{
 constructor(seed=Date.now()){
  this.rng=new Random(seed);this.round=1;this.uid=1;this.phase='prep';this.result=null;this.pairs=null;this.history=[];
  this.poolCaps=Object.fromEntries(CHESS_ROSTER.map(c=>[c.id,R().pool[c.cost-1]]));this.pool={...this.poolCaps};
  const names=['你','夜市常客','脆鲨牌手','云海棋客','韭菜大师','黄瓜园长','菲球收藏家','开播棋圣'];
  this.players=names.map((name,id)=>({id,name,hp:60,gold:8,level:3,xp:0,board:Array(24).fill(null),bench:Array(9).fill(null),shop:Array(5).fill(null),locked:false,wins:0,streak:0,alive:true,profile:id%4,lastOpponent:-1,income:null}));
  for(const p of this.players)this.refresh(p.id,true);
 }
 player(id=0){return this.players[id];}all(p){return [...p.board,...p.bench].filter(Boolean);}field(p){return p.board.filter(Boolean);}
 state(){return copy({version:4,rng:this.rng.state,round:this.round,uid:this.uid,phase:this.phase,result:this.result,poolCaps:this.poolCaps,pool:this.pool,players:this.players,history:this.history,pairs:this.pairs});}
 static restore(raw){
  if(![1,2,3,4].includes(raw?.version))throw Error('存档版本不兼容');
  if(!Number.isInteger(raw.rng)||raw.rng<1||raw.rng>4294967295)throw Error('随机状态无效');
  const t=Object.create(Tournament.prototype);Object.assign(t,copy(raw));t.rng=new Random(raw.rng);
  if(raw.version<4){
   if(raw.version===1){if(!window.CHESS_LEGACY_POOL)throw Error('缺少旧版卡池映射');t.poolCaps={...window.CHESS_LEGACY_POOL};}
   // Validate the historical inventory before adapting capacity to the new costs.
   t.assert(t.poolCaps,'v'+raw.version);
   for(const c of CHESS_ROSTER){const used=t.poolCaps[c.id]-t.pool[c.id],cap=Math.max(R().pool[c.cost-1],used);t.poolCaps[c.id]=cap;t.pool[c.id]=cap-used;}
  }
  t.assert();if(!['prep','done'].includes(t.phase))throw Error('仅可恢复准备阶段');return t;
 }
 returnShop(p){for(const id of p.shop)if(id!=null)this.pool[id]++;p.shop=Array(5).fill(null);}
 draw(level){const odds=R().odds[level],tiers=[1,2,3,4,5].map(cost=>({cost,weight:odds[cost-1],cards:CHESS_ROSTER.filter(c=>c.cost===cost&&this.pool[c.id]>0)})).filter(t=>t.cards.length&&t.weight>0);if(!tiers.length)return null;let n=this.rng.next()*tiers.reduce((a,t)=>a+t.weight,0),tier=tiers.at(-1);for(const t of tiers){n-=t.weight;if(n<0){tier=t;break;}}n=this.rng.next()*tier.cards.reduce((a,c)=>a+this.pool[c.id],0);let chosen=tier.cards.at(-1);for(const c of tier.cards){n-=this.pool[c.id];if(n<0){chosen=c;break;}}this.pool[chosen.id]--;return chosen.id;}
 refresh(id=0,free=false){const p=this.player(id);if(this.phase!=='prep'||!p.alive||(!free&&p.gold<2))return false;if(!free)p.gold-=2;this.returnShop(p);p.shop=p.shop.map(()=>this.draw(p.level));return true;}
 lock(id=0){if(this.phase!=='prep')return false;const p=this.player(id);p.locked=!p.locked;return p.locked;}
 merge(p){let changed=true;while(changed){changed=false;for(const c of CHESS_ROSTER){for(let star=1;star<3;star++){const locations=[...p.board.map((u,i)=>({u,a:p.board,i})),...p.bench.map((u,i)=>({u,a:p.bench,i}))].filter(x=>x.u?.id===c.id&&x.u.star===star);if(locations.length<3)continue;const [keep,...consume]=locations.slice(0,3);keep.u.star++;for(const x of consume)x.a[x.i]=null;changed=true;}}}p.bench=p.bench.slice(0,9);}
 buy(index,id=0){const p=this.player(id),hero=p.shop[index],c=D().get(hero);if(this.phase!=='prep'||!p.alive||hero==null||!c||p.gold<c.cost)return false;const empty=p.bench.indexOf(null),willMerge=this.all(p).filter(u=>u.id===hero&&u.star===1).length>=2;if(empty<0&&!willMerge)return false;p.gold-=c.cost;p.shop[index]=null;p.bench[empty<0?9:empty]={uid:this.uid++,id:hero,star:1};this.merge(p);return true;}
 move(fromZone,from,toZone,to,id=0){const p=this.player(id);if(this.phase!=='prep'||!['board','bench'].includes(fromZone)||!['board','bench'].includes(toZone))return false;const a=p[fromZone],z=p[toZone];if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=a.length||to<0||to>=z.length||!a[from])return false;if(toZone==='board'&&fromZone==='bench'&&!z[to]&&this.field(p).length>=p.level)return false;[a[from],z[to]]=[z[to],a[from]];return true;}
 sellPrice(u){const cost=D().get(u.id).cost;return u.star===1?cost:u.star===2?cost*3-1:cost*9-3;}
 sell(zone,index,id=0){const p=this.player(id),u=p[zone]?.[index];if(this.phase!=='prep'||!['board','bench'].includes(zone)||!u)return false;p.gold+=this.sellPrice(u);this.pool[u.id]+=3**(u.star-1);p[zone][index]=null;return true;}
 addXP(p,n){p.xp+=n;while(p.level<8&&p.xp>=R().xp[p.level]){p.xp-=R().xp[p.level];p.level++;}if(p.level===8)p.xp=0;}
 xp(id=0){const p=this.player(id);if(this.phase!=='prep'||p.gold<4||p.level>=8)return false;p.gold-=4;this.addXP(p,4);return true;}
 strength(u){return this.lineupScore([u]);}
 lineupScore(pieces){const model=new LineupEvaluator(pieces);return model.evaluate((1<<model.items.length)-1);}
 arrange(p){
  const owned=this.all(p),key=p.level+'|'+owned.map(u=>u.uid+':'+u.id+':'+u.star).sort().join('|');if(!this.arrangeCache)this.arrangeCache=new Map();let choice=this.arrangeCache.get(p.id);
  if(!choice||choice.key!==key){choice={...new LineupEvaluator(owned).best(p.level),key};this.arrangeCache.set(p.id,choice);}
  const current=new Map(owned.map(u=>[u.uid,u])),selected=choice.chosen.map(u=>current.get(u.uid));
  p.board=Array(24).fill(null);const used=new Set(),frontScore=u=>{const c=D().get(u.id);return c.hp*(1+c.armor/100)*R().stars[u.star-1]*(c.role==='先锋'?1.6:c.role==='控场'?1.15:c.role==='支援'?.5:.75);};
  selected.sort((a,b)=>frontScore(b)-frontScore(a)||a.uid-b.uid);// Spread a screen across the front; leave firing lanes on both wings.
  const melee=selected.filter(u=>D().get(u.id).range<=1),ranged=selected.filter(u=>D().get(u.id).range>1);
  const place=(u,slots)=>{const cell=slots.find(i=>!used.has(i));if(cell==null)throw Error('No deployment cell');used.add(cell);p.board[cell]=u;};
  for(const u of melee){const flanker=D().get(u.id).role==='游击';place(u,flanker?[0,5,1,4,6,11,2,3,7,10,8,9]:[1,4,2,3,0,5,8,9,7,10,6,11]);}
  ranged.sort((a,b)=>D().get(b.id).range-D().get(a.id).range||frontScore(a)-frontScore(b)||a.uid-b.uid);
  for(const u of ranged)place(u,D().get(u.id).range>=2.7?[12,17,19,22,13,16,18,23]:[6,11,7,10,8,9,13,16,19,22]);
  p.bench=choice.bench.map(u=>current.get(u.uid));while(p.bench.length<9)p.bench.push(null);
  return {score:choice.score,evaluated:choice.evaluated,unique:choice.unique,relationships:choice.active.filter(g=>g.relationship&&g.category!=='signature').map(g=>g.key)};
 }
 purchaseGain(p,hero){
  const field=this.field(p),base=this.lineupScore(field),fresh={id:hero,star:1,uid:Math.max(0,...this.all(p).map(u=>u.uid))+1},matching=this.all(p).filter(u=>u.id===hero&&u.star===1);
  if(matching.length>=2){const pieces=this.all(p).map(u=>({...u}));pieces.push(fresh);for(let star=1;star<3;star++){const same=pieces.filter(u=>u.id===hero&&u.star===star);while(same.length>=3){const [keep,a,b]=same.splice(0,3);keep.star++;pieces.splice(pieces.indexOf(a),1);pieces.splice(pieces.indexOf(b),1);}}return new LineupEvaluator(pieces).best(p.level).score-base;}
  if(field.length<p.level)return this.lineupScore([...field,fresh])-base;
  return Math.max(...field.map((u,i)=>this.lineupScore(field.map((v,j)=>i===j?fresh:v))))-base;
 }
 bot(id){
  const p=this.player(id);if(!p.alive||this.phase!=='prep')return;this.arrange(p);
  const own=()=>this.all(p),copies=hero=>own().filter(u=>u.id===hero).reduce((n,u)=>n+3**(u.star-1),0),affinity=c=>{const field=new Set(this.field(p).filter(u=>u.id!==c.id).map(u=>D().get(u.id).name));return Math.min(2,CHESS_RELATIONSHIPS.filter(g=>g.category!=='signature'&&g.members.includes(c.name)).reduce((sum,g)=>{const n=g.members.filter(n=>field.has(n)).length;return sum+(g.steps.includes(n+1)?g.category==='team'?.55:.35:n>0?.08:0);},0));};
  const reroller=p.id===2||p.id===5;
  if(p.carry==null){const options=p.shop.filter(id=>id!=null).map(id=>D().get(id)).filter(c=>c.cost<=2).sort((a,b)=>affinity(b)-affinity(a)||a.cost-b.cost);p.carry=options[0]?.id??null;}
  const chasing=reroller&&p.carry!=null&&copies(p.carry)<9&&this.round<15;
  const desired=chasing?Math.min(5,3+Math.floor(this.round/2)):Math.min(8,3+Math.floor(this.round/(p.profile===3?2:2.4)));
  let guard=0;while(p.level<desired&&p.gold>=8&&guard++<16)this.xp(id);
  for(let pass=0;pass<8;pass++){
   const offers=p.shop.map((hero,index)=>({hero,index,c:D().get(hero)})).filter(x=>x.c).map(x=>{x.value=reroller&&x.hero===p.carry&&copies(x.hero)<9?25:copies(x.hero)?12+copies(x.hero):Math.max(0,this.purchaseGain(p,x.hero))*8+affinity(x.c);return x;}).sort((a,b)=>b.value-a.value);
   for(const o of offers){const have=copies(o.hero);if(have>=9||p.gold<o.c.cost)continue;
    const field=this.field(p),gain=this.purchaseGain(p,o.hero);
    const need=field.length<p.level||have>0||gain>Math.max(.03,this.lineupScore(field)*.004)||(affinity(o.c)>=.5&&p.bench.filter(Boolean).length<3);
    if(!need)continue;
    if(p.bench.every(Boolean)&&own().filter(u=>u.id===o.hero&&u.star===1).length<2){const spare=p.bench.map((u,i)=>({u,i})).filter(x=>x.u.id!==p.carry&&x.u.id!==o.hero).sort((a,b)=>(this.strength(a.u)+affinity(D().get(a.u.id))*.4)-(this.strength(b.u)+affinity(D().get(b.u.id))*.4))[0];if(spare&&(have||gain>.03))this.sell('bench',spare.i,id);}
    this.buy(o.index,id);this.arrange(p);
   }
   // Sell stranded single copies to fund a plan, retaining pairs and the chosen carry.
   if(p.bench.filter(Boolean).length>5){const spares=p.bench.map((u,i)=>({u,i})).filter(x=>x.u&&x.u.id!==p.carry&&x.u.star===1&&copies(x.u.id)===1).sort((a,b)=>(this.strength(a.u)+affinity(D().get(a.u.id))*.4)-(this.strength(b.u)+affinity(D().get(b.u.id))*.4));for(const x of spares.slice(0,2))this.sell('bench',x.i,id);}
   const reserve=p.hp<20?0:chasing&&p.level>=5?12:this.round<4?0:25;
   const wantsRoll=(chasing&&p.level>=5)||p.level>=desired||p.hp<20;
   if(wantsRoll&&p.gold>=reserve+4&&pass<(chasing?6:4))this.refresh(id);else break;
  }
  this.arrange(p);
 }
 preparePairs(){const alive=this.rng.shuffle(this.players.filter(p=>p.alive).map(p=>p.id)),pairs=[];while(alive.length>1){const a=alive.shift();let i=alive.findIndex(id=>id!==this.player(a).lastOpponent);if(i<0)i=0;const b=alive.splice(i,1)[0];pairs.push({a:b===0?b:a,b:b===0?a:b,ghost:false,seed:Math.floor(this.rng.next()*4294967295)});}if(alive.length){const a=alive[0],others=this.players.filter(p=>p.alive&&p.id!==a);pairs.push({a,b:this.rng.pick(others).id,ghost:true,seed:Math.floor(this.rng.next()*4294967295)});}this.pairs=pairs;return pairs;}
 start({botsPrepared=false}={}){if(this.phase!=='prep'||!this.field(this.player()).length||this.field(this.player()).length>this.player().level)return null;if(!botsPrepared)for(let id=1;id<8;id++)this.bot(id);for(const p of this.players)p.interestGold=p.gold;const pairs=this.preparePairs();this.phase='battle';return pairs;}
 battle(pair){return new Combat(this.player(pair.a),this.player(pair.b),pair.seed);}
 settle(results){if(this.phase!=='battle'||results.length!==this.pairs.length)throw Error('战斗结算状态错误');const outcome=new Map();for(let i=0;i<results.length;i++){const r=results[i],pair=this.pairs[i];if(!r||![-1,0,1].includes(r.winner)||!Array.isArray(r.survivors))throw Error('战斗结果无效');const set=(id,side,other)=>{const won=r.winner===side,draw=r.winner===-1,damage=won?0:draw?4:2+Math.floor(this.round/5)+Math.min(5,r.survivors.filter(u=>u.side!==side).length);outcome.set(id,{won,draw,damage,opponent:other});};set(pair.a,0,pair.b);if(!pair.ghost)set(pair.b,1,pair.a);}
  for(const [id,o] of outcome){const p=this.player(id);p.hp-=o.damage;p.lastOpponent=o.opponent;p.wins+=o.won?1:0;p.streak=o.draw?0:o.won?Math.max(0,p.streak)+1:Math.min(0,p.streak)-1;const interest=Math.min(3,Math.floor((p.interestGold||0)/10)),streak=Math.abs(p.streak)>=5?2:Math.abs(p.streak)>=3?1:0;p.income={base:5,win:o.won?1:0,interest,streak,total:5+(o.won?1:0)+interest+streak,...o};}
  const eliminated=this.players.filter(p=>p.alive&&p.hp<=0).sort((a,b)=>a.hp-b.hp||a.wins-b.wins||b.id-a.id);let remaining=this.players.filter(p=>p.alive).length;for(const p of eliminated){p.alive=false;p.rank=remaining--;this.returnShop(p);for(const u of this.all(p))this.pool[u.id]+=3**(u.star-1);p.board=Array(24).fill(null);p.bench=Array(9).fill(null);}
  this.history.push({round:this.round,results:copy([...outcome])});this.pairs=null;
  const alive=this.players.filter(p=>p.alive);if(!this.player().alive||alive.length<=1||this.round>=24){const ranking=[...alive].sort((a,b)=>b.hp-a.hp||b.wins-a.wins||a.id-b.id);ranking.forEach((p,i)=>p.rank=i+1);this.result={rank:this.player().rank,round:this.round};this.phase='done';return this.result;}
  this.phase='results';return null;
 }
 next(){if(this.phase!=='results')return false;this.round++;this.phase='prep';for(const p of this.players)if(p.alive){p.gold+=p.income.total;this.addXP(p,2);if(!p.locked)this.refresh(p.id,true);p.locked=false;}return true;}
 assert(expectedCaps=this.poolCaps,era='current'){
  if(!Number.isInteger(this.round)||this.round<1||this.round>24||!Array.isArray(this.players)||this.players.length!==8||!Number.isInteger(this.uid)||this.uid<1)throw Error('赛事数据损坏');
  const seen=new Set(),totals={...this.pool};
  if(!this.pool||Object.keys(this.pool).length!==CHESS_ROSTER.length||!expectedCaps||Object.keys(expectedCaps).length!==CHESS_ROSTER.length)throw Error('卡池映射无效');
  for(const c of CHESS_ROSTER){const cap=expectedCaps[c.id],current=R().pool[c.cost-1],legacy=window.CHESS_LEGACY_POOL?.[c.id]??current,previous=window.CHESS_PREVIOUS_POOL?.[c.id]??current,v3=window.CHESS_VERSION3_POOL?.[c.id]??current,standard=era==='v1'?legacy:era==='v2'?previous:era==='v3'?v3:current,ceiling=era==='v1'?legacy:Math.max(standard,legacy,era==='v3'||era==='current'?previous:0,era==='current'?v3:0);
   if(!Number.isInteger(totals[c.id])||totals[c.id]<0||!Number.isInteger(cap)||cap<standard||cap>ceiling)throw Error('卡池数量无效');
  }
  for(const [i,p] of this.players.entries()){
   if(!p||p.id!==i||!Array.isArray(p.board)||p.board.length!==24||!Array.isArray(p.bench)||p.bench.length!==9||!Array.isArray(p.shop)||p.shop.length!==5||!Number.isInteger(p.gold)||p.gold<0||!Number.isInteger(p.level)||p.level<3||p.level>8||!Number.isFinite(p.hp)||p.hp>60||typeof p.alive!=='boolean'||!Number.isInteger(p.xp)||p.xp<0||this.field(p).length>p.level)throw Error('棋手状态无效');
   for(const u of this.all(p)){if(!D().has(u.id)||!Number.isInteger(u.uid)||u.uid<1||u.uid>=this.uid||![1,2,3].includes(u.star)||seen.has(u.uid))throw Error('棋子状态无效');seen.add(u.uid);totals[u.id]+=3**(u.star-1);}
   for(const id of p.shop)if(id!=null){if(!D().has(id))throw Error('商店无效');totals[id]++;}
  }
  for(const c of CHESS_ROSTER)if(totals[c.id]!==expectedCaps[c.id])throw Error('卡池不守恒：'+c.name);return true;
 }
}
class Combat{
 constructor(left,right,seed=1){this.rng=new Random(seed);this.time=0;this.done=false;this.winner=null;this.events=[];this.serial=0;this.pending=[];this.bondOnce=new Set();this.bondCooldown=new Map();this.lastBondCaster=new Map();this.bounds={minX:0,maxX:5,minY:0,maxY:7};this.units=[];[left,right].forEach((p,side)=>{const profiles=lineupProfiles(p.board).profiles;for(const profile of profiles){const piece=profile.piece,c=profile.data,cell=p.board.findIndex(u=>u?.uid===piece.uid);this.units.push({...piece,uid:side+':'+piece.uid,side,data:c,x:side?5-cell%6:cell%6,y:side?3-Math.floor(cell/6):4+Math.floor(cell/6),relations:profile.relations,relationLead:profile.relationLead,namedAura:profile.namedAura,radius:.30,moveSpeed:c.range>1?1.65:2.05,vx:0,vy:0,pushX:0,pushY:0,moving:false,facing:side?-1:1,hp:profile.hp,maxHp:profile.hp,attack:profile.attack,armor:profile.armor,interval:profile.interval,range:c.range,spell:profile.spell,healing:profile.healing,mana:c.startMana,manaHit:c.manaHit,regen:0,cooldown:.2+this.rng.next()*.35,moveCD:0,shield:0,slow:0,burn:0,stun:0,buff:0,form:null,formTime:0,action:null,damage:0,healed:0});}});this.regenAt=6;for(const u of this.units){this.lightweightState(u);this.relationshipState(u);u.mana=u.data.startMana;u.manaHit=u.data.manaHit;if(u.relations.yumemita)this.bondEnergy(u,[10,18][u.relations.yumemita-1]);}
 }
 alive(side){return this.units.filter(u=>u.hp>0&&(side==null||u.side===side));}unit(uid){return this.units.find(u=>u.uid===uid);}distance(a,b){return Math.hypot((a.x-b.x)*1.2,(a.y-b.y)*.74);}
 meleeReach(a,b){return (a.radius??.3)+(b.radius??.3)+.10;}
 attackReach(a,b){return a.range>1?a.range:this.meleeReach(a,b);}
 hitReach(a,b){return this.meleeReach(a,b)+.24;}
 castReach(u,s,target){return s.target!=='enemy'?Infinity:s.melee?this.meleeReach(u,target):Math.max(2.6,this.attackReach(u,target)+.45);}
 emit(e){this.events.push({time:this.time,...e});if(this.events.length>180)this.events.splice(0,60);}
 damage(a,t,n,kind='hit',physical=kind==='hit'){if(t.hp<=0)return 0;const overtime=this.time>30?1+(this.time-30)*.15:1;let amount=Math.max(kind==='burn'?0:1,n*100/(100+t.armor)*overtime),absorbed=Math.min(t.shield,amount);t.shield-=absorbed;amount-=absorbed;const actual=Math.min(t.hp,amount);t.hp=Math.max(0,t.hp-amount);if(t.hp<=0&&t.deathAt==null)t.deathAt=this.time;if(kind!=='burn')t.mana=Math.min(100,t.mana+Math.min(10,4+actual/t.maxHp*30));a.damage+=actual;if(kind!=='burn')t.hurtAt=this.time;if(physical){const dx=(t.x-a.x)*1.2,dy=(t.y-a.y)*.74,d=Math.hypot(dx,dy)||1;t.pushX=(t.pushX||0)+dx/d*(kind==='hit'?.8:1.3);t.pushY=(t.pushY||0)+dy/d*(kind==='hit'?.8:1.3);}this.emit({type:kind,actor:a.uid,target:t.uid,amount:Math.round(actual)});if(t.hp>0)this.onBondHit(t,kind);return actual;}
 heal(a,t,n){const amount=Math.min(t.maxHp-t.hp,n*a.healing*(this.time>30?.4:1));t.hp+=amount;a.healed+=amount;this.emit({type:'heal',actor:a.uid,target:t.uid,amount:Math.round(amount)});}
 members(u,id){return this.alive(u.side).filter(v=>v.relations[id]);}
 lightweightState(u){
  const blank=()=>({energyGranted:0,healedGranted:0,shieldGranted:0,sustainFraction:0,pulseGranted:0,focusGranted:0,hasteGranted:0});
  if(!u.lightweightBudget)u.lightweightBudget=blank();
  if(!this.lightweightIdentityBudget)this.lightweightIdentityBudget=new Map();
  const key=u.side+':'+u.id;if(!this.lightweightIdentityBudget.has(key))this.lightweightIdentityBudget.set(key,blank());
  return [u.lightweightBudget,this.lightweightIdentityBudget.get(key)];
 }
 relationshipState(u){
  const blank=()=>({energyGranted:0,healedGranted:0,shieldGranted:0,sustainFraction:0});
  if(!u.relationshipBudget)u.relationshipBudget=blank();
  if(!this.relationshipIdentityBudget)this.relationshipIdentityBudget=new Map();
  const key=u.side+':'+u.id;if(!this.relationshipIdentityBudget.has(key))this.relationshipIdentityBudget.set(key,blank());
  return [u.relationshipBudget,this.relationshipIdentityBudget.get(key)];
 }
 bondGrant(a,t,kind,amount,light=false){
  if(t.hp<=0||!Number.isFinite(amount)||amount<=0)return 0;
  const core=this.relationshipState(t),small=light?this.lightweightState(t):[],limits=R().relationshipLimits,low=R().lightweightLimits;let actual=0;
  if(kind==='energy'){
   actual=Math.max(0,Math.min(amount,100-t.mana,...core.map(b=>limits.energy-b.energyGranted),...small.map(b=>low.energy-b.energyGranted)));
   t.mana+=actual;for(const b of [...core,...small])b.energyGranted+=actual;
  }else{
   const remaining=Math.max(0,Math.min(...core.map(b=>limits.sustain-b.sustainFraction),...small.map(b=>low.sustain-b.sustainFraction)))*t.maxHp;
   if(kind==='heal'){actual=Math.max(0,Math.min(t.maxHp-t.hp,amount*(this.time>30?.4:1),remaining));t.hp+=actual;a.healed+=actual;if(actual)this.emit({type:'heal',actor:a.uid,target:t.uid,amount:Math.round(actual),fromBond:true});}
   else{actual=Math.max(0,Math.min(t.maxHp*.4-t.shield,amount,remaining));t.shield+=actual;}
   for(const b of [...core,...small]){b[kind==='heal'?'healedGranted':'shieldGranted']+=actual;b.sustainFraction+=actual/t.maxHp;}
  }
  return actual;
 }
 bondEnergy(u,n){return this.bondGrant(u,u,'energy',n);}
 bondHeal(a,t,fraction){return this.bondGrant(a,t,'heal',t.maxHp*fraction);}
 onLightweightCast(u){
  if(u.hp<=0)return;
  for(const category of ['pair','theme']){
   const cooldown=category==='pair'?4:6,casterKey='light:caster:'+u.side+':'+u.id+':'+category;
   if(this.time<(this.bondCooldown.get(casterKey)??-1))continue;
   const groups=window.CHESS_RELATIONSHIPS.filter(g=>g.category===category&&!g.trigger&&u.relations[g.id]).filter(g=>{
    const key='light:group:'+u.side+':'+g.id;return this.time>=(this.bondCooldown.get(key)??-1)&&this.members(u,g.id).some(v=>v.id!==u.id);
   }).sort((a,b)=>(this.bondCooldown.get('light:group:'+u.side+':'+a.id)??-Infinity)-(this.bondCooldown.get('light:group:'+u.side+':'+b.id)??-Infinity)||a.id.localeCompare(b.id));
   const g=groups[0];if(!g)continue;
   const level=u.relations[g.id],value=g.values[Math.min(level-1,g.values.length-1)],partners=this.members(u,g.id).filter(v=>v.id!==u.id);
   const score=v=>g.effect==='tempo'?v.mana:g.effect==='care'||g.effect==='ward'?v.hp/v.maxHp:g.effect==='pulse'?(v.bondPunch||0):g.effect==='focus'?(v.bondFocus||0):(v.lightHaste||0);
   partners.sort((a,b)=>score(a)-score(b)||a.uid.localeCompare(b.uid));const v=partners[0],budgets=this.lightweightState(v);let actual=0;
   if(g.effect==='tempo')actual=this.bondGrant(u,v,'energy',value,true);
   else if(g.effect==='care'||g.effect==='ward')actual=this.bondGrant(u,v,g.effect==='care'?'heal':'shield',v.maxHp*value,true);
   else if(g.effect==='pulse'){
    const before=v.bondPunch||0;v.bondPunch=Math.max(before,value);actual=v.bondPunch-before;for(const b of budgets)b.pulseGranted+=actual;
   }else if(g.effect==='focus'){
    const before=v.bondFocus||0;v.bondFocus=Math.max(before,value);actual=v.bondFocus-before;for(const b of budgets)b.focusGranted+=actual;
   }else if(g.effect==='haste'){
    actual=Math.max(0,4-(v.lightHaste||0));v.lightHasteRate=Math.max(v.lightHaste>0?v.lightHasteRate||0:0,value);v.lightHaste=4;for(const b of budgets)b.hasteGranted+=actual;
   }
   this.bondCooldown.set(casterKey,this.time+cooldown);this.bondCooldown.set('light:group:'+u.side+':'+g.id,this.time+cooldown);
   this.emit({type:'bond',category,group:g.id,effect:g.effect,actor:u.uid,beneficiary:v.uid,target:v.uid,actualAmount:actual,amount:actual,budget:{...v.lightweightBudget}});
  }
 }
 once(key){if(this.bondOnce.has(key))return false;this.bondOnce.add(key);return true;}
 bondShield(u,n){return this.bondGrant(u,u,'shield',u.maxHp*n);}
 onBondHit(u,kind='hit'){const level=id=>u.relations[id]||0;
  if(u.hp<u.maxHp*.5){
   if(level('avemujica')&&this.once(u.side+':avemujica:'+u.id)){this.bondEnergy(u,[10,16][level('avemujica')-1]);this.bondShield(u,[.04,.06][level('avemujica')-1]);}
   if(level('crychic')&&this.once(u.side+':crychic'))for(const v of this.members(u,'crychic'))this.bondShield(v,[.04,.07][level('crychic')-1]);
   if(level('tang')&&this.once(u.side+':tang:'+u.id)){const g=window.CHESS_RELATIONSHIPS.find(g=>g.id==='tang');this.bondEnergy(u,g.energyValues[level('tang')-1]);this.bondShield(u,g.shieldValues[level('tang')-1]);}
  }
  if(level('niufamily')&&u.hp<u.maxHp*.4){const partner=this.members(u,'niufamily').find(v=>v.id!==u.id);if(partner&&this.once(u.side+':niufamily')){this.bondShield(u,.08);this.bondHeal(u,partner,.03);}}
  if(kind!=='burn'&&level('eoe')&&this.time>=(this.bondCooldown.get(u.side+':eoe')??-1)){const partner=this.members(u,'eoe').find(v=>v.id!==u.id);if(partner){this.bondEnergy(partner,3);this.bondCooldown.set(u.side+':eoe',this.time+4);}}
 }
 onBondCast(u){
  for(const [id,level] of Object.entries(u.relations)){
   const definition=window.CHESS_RELATIONSHIPS.find(g=>g.id===id);if(definition?.category&&definition.category!=='team')continue;
   const members=this.members(u,id),partner=members.filter(v=>v.id!==u.id).sort((a,b)=>a.mana-b.mana)[0],first=this.once(u.side+':first:'+id+':'+u.id);
   if(id==='yumemita'&&first)this.bondShield(u,[.04,.06][level-1]);
   if(id==='virtuareal'&&first&&partner)this.bondEnergy(partner,[6,10][level-1]);
   if(id==='vr28'&&first&&partner)this.bondGrant(u,partner,'shield',partner.maxHp*.05);
   if(id==='xiaohai'&&this.once(u.side+':xiaohai'))for(const v of members)this.bondHeal(u,v,.04);
   if(id==='asoul'&&this.time>=(this.bondCooldown.get(u.side+':asoul')??-1)){const weakest=members.filter(v=>v.id!==u.id).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(weakest){this.bondHeal(u,weakest,[.018,.026][level-1]);this.bondCooldown.set(u.side+':asoul',this.time+4);}}
   if(id==='whitealbum'&&partner&&this.time>=(this.bondCooldown.get(u.side+':whitealbum')??-1)){this.bondEnergy(partner,5);this.bondCooldown.set(u.side+':whitealbum',this.time+4);}
   if(id==='studio6324'&&partner&&this.time>=(this.bondCooldown.get(u.side+':studio6324')??-1)){partner.bondPunch=Math.max(partner.bondPunch||0,[.10,.16][level-1]);this.bondCooldown.set(u.side+':studio6324',this.time+5);}
   if(id==='starandtaffy'){const key=u.side+':starandtaffy',last=this.lastBondCaster.get(key);if(last!=null&&last!==u.id&&this.time>=(this.bondCooldown.get(key)??-1)){u.bondPunch=Math.max(u.bondPunch||0,[.10,.16][level-1]);this.bondCooldown.set(key,this.time+5);}this.lastBondCaster.set(key,u.id);}
  }
  this.onLightweightCast(u);
 }
 target(u){const enemies=this.alive(1-u.side),current=this.unit(u.targetId);if(current?.hp>0&&current.side!==u.side&&this.distance(u,current)<=this.attackReach(u,current)+.12)return current;const target=enemies.sort((a,b)=>this.distance(u,a)-this.distance(u,b)||a.hp/a.maxHp-b.hp/b.maxHp||a.uid.localeCompare(b.uid))[0];u.targetId=target?.uid;return target;}
 clampUnit(u){u.x=clamp(u.x,this.bounds.minX,this.bounds.maxX);u.y=clamp(u.y,this.bounds.minY,this.bounds.maxY);}
 approach(u,target,dt,reach=this.attackReach(u,target)){
  let dx=(target.x-u.x)*1.2,dy=(target.y-u.y)*.74,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
  // Tangential steering lets the rear line go around occupied contact points.
  for(const v of this.alive()){if(v===u||v===target)continue;const ox=(v.x-u.x)*1.2,oy=(v.y-u.y)*.74,od=Math.hypot(ox,oy);if(od<1.10&&od>.001&&(ox*nx+oy*ny)/od>.35){const cross=nx*oy-ny*ox,sign=Math.abs(cross)>.04?-Math.sign(cross):u.uid.localeCompare(v.uid)>0?1:-1,weight=(1.10-od)*1.25;dx=nx-ny*sign*weight;dy=ny+nx*sign*weight;const length=Math.hypot(dx,dy);nx=dx/length;ny=dy/length;}}
  const speed=u.moveSpeed*(u.slow>0?.73:1),travel=Math.min(speed*dt,Math.max(0,d-reach+.025));
  u.vx=nx*travel/dt;u.vy=ny*travel/dt;u.moving=travel>.001;if(Math.abs(nx)>.1)u.facing=nx>0?1:-1;u.x+=nx*travel/1.2;u.y+=ny*travel/.74;this.clampUnit(u);
 }
 collisions(){
  const units=this.alive();
  for(let pass=0;pass<8;pass++)for(let i=0;i<units.length;i++)for(let j=i+1;j<units.length;j++){
   const a=units[i],b=units[j];let dx=(b.x-a.x)*1.2,dy=(b.y-a.y)*.74,d=Math.hypot(dx,dy),min=a.radius+b.radius;if(d>=min-.0001)continue;
   if(d<.00001){const angle=((i+1)*2.399963+(j+1)*.78);dx=Math.cos(angle);dy=Math.sin(angle);d=1;}else{dx/=d;dy/=d;}
   const overlap=min-this.distance(a,b)+.0001,shift=Math.min(.3,overlap/2);a.x-=dx*shift/1.2;a.y-=dy*shift/.74;b.x+=dx*shift/1.2;b.y+=dy*shift/.74;this.clampUnit(a);this.clampUnit(b);
  }
 }
 prepareSkill(u){
  if(!u.data.skill.mimic)return {skill:u.data.skill,origin:u.data.id};
  if(!u.queuedSkill){const borrowed=this.rng.pick(CHESS_ROSTER.filter(c=>!c.skill.mimic&&c.id!==u.lastMimic));u.queuedSkill={skill:borrowed.skill,origin:borrowed.id};u.lastMimic=borrowed.id;}
  return u.queuedSkill;
 }
 cast(u,target,prepared=this.prepareSkill(u)){
  const {skill:s,origin}=prepared;if(this.distance(u,target)>this.castReach(u,s,target))return false;u.queuedSkill=null;
  const allies=this.alive(u.side),enemies=this.alive(1-u.side);let targets;
  if(s.target==='self')targets=[u];else if(s.target==='ally'){const eligible=s.grantEnergy&&allies.length>1?allies.filter(a=>a!==u):allies;targets=[...eligible].sort((a,b)=>s.grantEnergy?a.mana-b.mana:a.hp/a.maxHp-b.hp/b.maxHp).slice(0,s.area==='all'?eligible.length:s.area==='row'?2:1);}else{targets=[target];if(s.area!=='single')targets=[...enemies].sort((a,b)=>this.distance(a,target)-this.distance(b,target)).slice(0,s.area==='all'?enemies.length:3);}
  u.mana=0;u.cooldown=u.interval+.4;u.action={time:this.time,index:s.sourceIndex,source:s.source,origin,serial:++this.serial,targets:targets.map(t=>t.uid),skill:s,duration:.95,impact:.38,lead:s.melee?.1:0};u.lockUntil=this.time+.78;this.emit({type:'cast',actor:u.uid,name:s.name,origin,skill:s,targets:targets.map(t=>t.uid)});
  this.pending.push({at:this.time+.38,kind:'skill',actor:u.uid,skill:s,targets:targets.map(t=>t.uid),focus:u.bondFocus||0});u.bondFocus=0;
 }
 resolveSkill(u,s,ids,focus=0){
  const allies=this.alive(u.side),targets=ids.map(id=>this.unit(id)).filter(t=>t&&t.hp>0&&(!s.melee||t.side===u.side||this.distance(u,t)<=this.hitReach(u,t)));
  const split=targets.length>1?Math.min(1.75,Math.sqrt(targets.length))/targets.length:1;
  for(const t of targets){if(s.power&&t.side!==u.side&&(!s.melee||this.distance(u,t)<=this.hitReach(u,t))){const n=this.damage(u,t,u.attack*s.power*u.spell*split*(1+focus),'spell',!!(s.melee||s.source.physical));if(s.leech)this.heal(u,u,n*.35);if(s.status?.burn){t.burn=4;t.burnSource=u.uid;}if(s.status?.slow)t.slow=3;if(s.status?.weaken)t.weaken=3;if(s.push||s.break>=3)t.stun=Math.max(t.stun,.65);}
   if(s.heal)this.heal(u,t,u.attack*s.heal*split);if(s.shield)t.shield=Math.min(t.maxHp*.4,t.shield+u.attack*s.shield*u.healing*split);if(s.grantEnergy&&t!==u)t.mana=Math.min(100,t.mana+s.grantEnergy);if(s.status?.attack||s.status?.haste)t.buff=5;if(s.cleanse){t.burn=0;t.slow=0;t.weaken=0;}}
  if(s.selfHeal)this.heal(u,u,u.maxHp*Math.min(.18,s.selfHeal));if(s.selfShield)u.shield=Math.min(u.maxHp*.4,u.shield+u.attack*s.selfShield*u.healing);
  if(s.teamHeal)for(const a of allies)this.heal(u,a,a.maxHp*Math.min(.1,s.teamHeal));if(s.teamHealPower){const hurt=allies.filter(a=>a.hp<a.maxHp);for(const a of hurt)this.heal(u,a,u.attack*s.teamHealPower/hurt.length);}if(s.teamShield)for(const a of allies)a.shield=Math.min(a.maxHp*.4,a.shield+u.attack*.6*u.healing);
  if(s.form){u.form=s.form;u.formTime=5;u.buff=5;}this.onBondCast(u);
 }
 resolvePending(){
  const due=this.pending.filter(p=>p.at<=this.time+1e-9);this.pending=this.pending.filter(p=>p.at>this.time+1e-9);
  for(const p of due){const u=this.unit(p.actor);if(!u||u.hp<=0)continue;
   if(p.kind==='skill')this.resolveSkill(u,p.skill,p.targets,p.focus||0);
   else{const target=this.unit(p.target);if(!target||target.hp<=0||(!p.ranged&&this.distance(u,target)>this.hitReach(u,target)))continue;this.damage(u,target,p.amount,'hit',!p.ranged);u.mana=Math.min(100,u.mana+u.manaHit);if(u.relations.mygo)this.bondEnergy(u,[2,3][u.relations.mygo-1]);}
  }
 }
 step(dt=.05){if(this.done)return;dt=clamp(dt,.001,.1);
  for(const u of this.units){u.previous={x:u.x,y:u.y};u.moving=false;u.vx=0;u.vy=0;}
  this.time+=dt;this.resolvePending();
  if(this.time>=this.regenAt){for(const u of this.alive())if(u.regen)this.heal(u,u,u.maxHp*u.regen);this.regenAt+=6;}
  for(const u of this.rng.shuffle(this.alive())){if(u.hp<=0)continue;u.cooldown-=dt;for(const key of ['slow','stun','buff','weaken','formTime','lightHaste'])u[key]=Math.max(0,(u[key]||0)-dt);if(u.formTime<=0)u.form=null;if(u.burn>0){u.burn-=dt;const src=this.unit(u.burnSource);if(src)this.damage(src,u,u.maxHp*.012*dt,'burn');}
   u.x+=clamp(u.pushX,-2,2)*dt/1.2;u.y+=clamp(u.pushY,-2,2)*dt/.74;u.pushX*=Math.exp(-14*dt);u.pushY*=Math.exp(-14*dt);this.clampUnit(u);
   if(u.hp<=0||u.stun>0||this.time<(u.lockUntil||0)-1e-9)continue;const target=this.target(u);if(!target)break;
   const dx=target.x-u.x;if(Math.abs(dx)>.03)u.facing=Math.sign(dx);
   const prepared=u.mana>=100?this.prepareSkill(u):null,reach=this.attackReach(u,target);
   if(prepared&&u.cooldown<=0){const castReach=this.castReach(u,prepared.skill,target);if(this.distance(u,target)<=castReach){this.cast(u,target,prepared);continue;}this.approach(u,target,dt,castReach);continue;}
   if(this.distance(u,target)<=reach){if(u.cooldown<=0){u.cooldown=u.interval*(u.slow>0?1.35:1)/(u.buff>0?1.12:1)/(u.lightHaste>0?1+(u.lightHasteRate||0):1);const ranged=u.range>1,impact=.28+(ranged?Math.min(.3,this.distance(u,target)/11):0);u.action={time:this.time,index:u.data.skills[0].sourceIndex,source:u.data.skills[0].source,origin:u.data.id,serial:++this.serial,targets:[target.uid],normal:true,ranged,duration:Math.max(.68,impact+.18),impact,lead:.06};u.lockUntil=this.time+.58;this.pending.push({at:this.time+impact,kind:'normal',ranged,actor:u.uid,target:target.uid,amount:u.attack*(u.buff>0?1.15:1)*(u.weaken>0?.82:1)*(1+(u.bondPunch||0))});u.bondPunch=0;}}
   else this.approach(u,target,dt);
  }
  this.collisions();
  const a=this.alive(0),b=this.alive(1);if(!a.length||!b.length){this.done=true;this.winner=a.length?0:b.length?1:-1;}else if(this.time>=45){this.done=true;const hp=side=>this.alive(side).reduce((n,u)=>n+u.hp/u.maxHp,0);const diff=hp(0)-hp(1);this.winner=Math.abs(diff)<.02?-1:diff>0?0:1;}
 }
 run(){let guard=0;while(!this.done&&guard++<1000)this.step(.05);if(!this.done)throw Error('战斗未终止');return this.result();}
 result(){if(!this.done)throw Error('战斗未完成');return {winner:this.winner,time:this.time,survivors:this.alive().map(u=>({id:u.id,side:u.side,star:u.star,hp:u.hp})),stats:this.units.map(u=>({id:u.id,side:u.side,damage:Math.round(u.damage),healed:Math.round(u.healed)}))};}
}
window.AbstractChess={Tournament,Combat,Random,bonds,LineupEvaluator,lineupProfiles};
})();
