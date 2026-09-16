const assert=require('assert/strict'),fs=require('fs'),crypto=require('crypto');
const {load,army,root}=require('./context.cjs'),c=load(),{Combat,bonds}=c.AbstractChess;
let checks=0;function ok(test,msg){checks++;assert(test,msg);}function near(a,b,msg){ok(Math.abs(a-b)<1e-7,msg+`: ${a} / ${b}`);}
function battle(names,star=2){return new Combat(army(c,names,star),army(c,['说的道理'],star),53);}
function find(b,n){return b.units.find(u=>u.side===0&&u.data.name===n);}
function noBonds(b){for(const u of b.units)u.relations={};}
const names=c.CHESS_RELATIONSHIPS.map(g=>g.name);
ok(names.length===52&&new Set(names).size===52,'52 unique groups');
for(const n of ['猫素','梓鲨','叮咚鸡大狗叫','绿瞳','棍鲨','梓龙','海希','唐','薇藤','MyGO','Mujica','CRYCHIC','梦限大','A-SOUL','EOE','VirtuaReal','287','白色相簿','6324','S6第一个王者'])ok(names.includes(n),n);
ok(!c.CHESS_RELATIONSHIPS.some(g=>g.id.startsWith('pair_yume_')),'four internal Yume CPs removed');
for(const n of ['virtuareal','starandtaffy'])ok(c.CHESS_RELATIONSHIPS.find(g=>g.id===n).members.includes(n==='virtuareal'?'明前奶绿':'七海'),n+' added member');
ok(c.CHESS_ROSTER.length===60,'60 heroes');
ok(JSON.stringify([1,2,3,4,5].map(t=>c.CHESS_ROSTER.filter(x=>x.cost===t).length))==='[16,14,12,10,8]','fee distribution');
for(const r of c.CHESS_ROSTER){ok(r.bonds.every(n=>names.includes(n)),r.name+' no orphan bond');ok(r.hp>0&&r.attack>0&&r.skill?.name,r.name+' valid combat data');}
// Two cows get one rescue, while the third distinct cattle member unlocks offense.
let b=battle(['牛来','牛妈妈']);ok(!find(b,'牛来').relations.brave_cattle,'two cows no cattle buff');
let child=find(b,'牛来'),mother=find(b,'牛妈妈');child.hp=child.maxHp*.35;mother.hp=mother.maxHp*.6;b.onBondHit(child);
near(child.shield,child.maxHp*.08,'one rescue shield');near(mother.hp,mother.maxHp*.63,'partner rescue heal');
mother.hp=mother.maxHp*.35;child.shield=0;const hp=child.hp;b.onBondHit(mother);near(mother.shield,0,'mother cannot retrigger group rescue');near(child.hp,hp,'no second rescue heal');
b=battle(['牛来','牛妈妈','贝拉']);ok(b.alive(0).every(u=>u.relations.brave_cattle===1),'three cattle active');
child=find(b,'牛来');b.onLightweightCast(child);ok(b.alive(0).some(u=>u!==child&&u.bondPunch===.12),'cattle is offensive');
// Tang scales at 2/4/6; once-only is shared by duplicate copies, not reset by healing.
const tg=c.CHESS_RELATIONSHIPS.find(g=>g.id==='tang');
for(const n of [2,4,6]){b=battle(tg.members.slice(0,n));const u=b.alive(0)[0],i=n/2-1;u.hp=u.maxHp*.49;u.mana=0;b.onBondHit(u);near(u.mana,tg.energyValues[i],'Tang mana '+n);near(u.shield/u.maxHp,tg.shieldValues[i],'Tang shield '+n);const shield=u.shield;b.onBondHit(u);near(u.shield,shield,'Tang once '+n);}
b=battle(['奶龙','奶龙','高松灯企鹅']);const copies=b.alive(0).filter(u=>u.data.name==='奶龙');for(const u of copies){u.hp=u.maxHp*.4;u.mana=0;b.onBondHit(u);}near(copies[1].shield,0,'duplicate shares Tang once');near(copies[1].mana,0,'duplicate shares Tang energy');
// All cores and lightweight resource grants are counted at their recipient, with
// the same identity sharing a ceiling even if one copy is three-star.
b=battle(['明前奶绿','明前奶绿','星瞳','七海','阿梓','露早','电棍','灰泽满']);
const twins=b.alive(0).filter(u=>u.data.name==='明前奶绿');twins[1].maxHp*=2;
for(let i=0;i<40;i++)for(const u of twins){u.mana=0;u.hp=u.maxHp*.1;u.shield=0;b.bondGrant(u,u,'energy',5,i%2===0);b.bondGrant(u,u,i%2?'heal':'shield',u.maxHp*.05,i%3===0);}
const identity=b.relationshipState(twins[0])[1];near(identity.energyGranted,32,'global shared energy ceiling');near(identity.sustainFraction,.22,'global shared sustain ceiling');
for(const u of twins){ok(u.relationshipBudget.energyGranted<=32,'individual energy');ok(u.relationshipBudget.sustainFraction<=.22+1e-8,'individual sustain');ok(u.lightweightBudget.energyGranted<=18,'light energy');ok(u.lightweightBudget.sustainFraction<=.12+1e-8,'light sustain');}
b=battle(['星瞳','明前奶绿']);const star=find(b,'星瞳'),green=find(b,'明前奶绿');green.hp=green.maxHp*.2;green.mana=0;
for(let i=0;i<20;i++){b.time=i*6;b.onLightweightCast(star);green.hp=green.maxHp*.2;}
near(green.lightweightBudget.sustainFraction,.12,'pair healing sublimit');
// Test authored pair effects, cooldown, dead partner exclusion and highest-only stacking.
for(const [left,right,key,expected] of [['叮咚鸡','炫狗','lightHasteRate',.10],['炫神','阿梓','bondFocus',.08],['八幡海铃','椎名立希','mana',24]]){
 b=battle([left,right]);const u=find(b,left),v=find(b,right);b.onLightweightCast(u);near(v[key],expected,left+' pair effect');const previous=v[key];b.onLightweightCast(u);near(v[key],previous,'caster cooldown');
}
b=battle(['七海','电棍']);b.onLightweightCast(find(b,'七海'));near(find(b,'电棍').shield/find(b,'电棍').maxHp,.025,'otto shark shield');
b=battle(['薇欧拉','藤都子']);b.onLightweightCast(find(b,'薇欧拉'));near(find(b,'藤都子').bondFocus,.06,'WeiTeng retained and functional');
b=battle(['叮咚鸡','炫狗']);find(b,'炫狗').hp=0;b.onLightweightCast(find(b,'叮咚鸡'));ok(!b.events.some(e=>e.type==='bond'),'dead partner not beneficiary');
// Offensive support healing is a total attack-based budget; more allies split
// the budget rather than multiplying it. Real caster skill is used.
let totals=[];for(const n of [3,8]){
 const squad=['向晚','说的道理','汤圆','袋鼠','东雪莲','叮咚鸡','管理员企鹅','高松灯企鹅'].slice(0,n);b=battle(squad);noBonds(b);const u=find(b,'向晚');u.healing=1;for(const v of b.alive(0))v.hp=v.maxHp*.1;const before=b.alive(0).reduce((s,v)=>s+v.hp,0);b.resolveSkill(u,u.data.skill,[b.alive(1)[0].uid]);const after=b.alive(0).reduce((s,v)=>s+v.hp,0);near(after-before,u.attack*2.4*u.healing,'fixed support heal '+n);totals.push(after-before);
}near(totals[0],totals[1],'population independent heal budget');
// AI support chooses two other allies, even when the caster itself is low on mana.
b=battle(['千石由乃','说的道理','汤圆','袋鼠']);noBonds(b);const ai=find(b,'千石由乃'),mates=b.alive(0).filter(u=>u!==ai);ai.mana=100;mates.forEach((u,i)=>u.mana=[5,20,60][i]);b.cast(ai,b.alive(1)[0]);ok(!ai.action.targets.includes(ai.uid)&&ai.action.targets.length===2,'AI charges two others');b.time=.4;b.resolvePending();near(mates[0].mana,40,'first ally charge');near(mates[1].mana,55,'second ally charge');near(mates[2].mana,60,'third ally unchanged');near(ai.mana,0,'caster pays energy');
b=battle(['千石由乃']);noBonds(b);const alone=b.alive(0)[0];alone.mana=100;b.cast(alone,b.alive(1)[0]);b.time=.4;b.resolvePending();near(alone.mana,0,'solo AI cannot loop mana');ok(alone.shield>0,'solo AI retains self protection');
for(const n of [4,8]){const enemies=['袋鼠','汤圆','奶蛙','东雪莲','牛来','牛妈妈','叮咚鸡','管理员企鹅'].slice(0,n);b=new Combat(army(c,['七海']),army(c,enemies),7);noBonds(b);const u=b.alive(0)[0];for(const v of b.alive(1)){v.armor=0;v.hp=v.maxHp=100000;v.shield=0;}b.resolveSkill(u,u.data.skill,b.alive(1).map(v=>v.uid));near(u.damage,u.attack*u.data.skill.power*u.spell*1.75,'AoE cap '+n);}

// V4 actual battle profiles, distinct identities and newly authored groups.
ok(names.includes('2992'),'2992 added');
for(const r of c.CHESS_ROSTER)ok(r.bonds.length>0,r.name+' has memorable identity');
for(const [key,g] of Object.entries(c.CHESS_RULES.traits).filter(([k,g])=>!g.relationship))ok(JSON.stringify(g.steps)==='[2,4]',key+' two modest role thresholds');
const profiles=ns=>c.AbstractChess.lineupProfiles(army(c,ns).board.filter(Boolean));
let p=profiles(['阿梓']);ok(!p.active.some(g=>g.id==='pair_2992'),'2992 needs both names');
p=profiles(['阿梓','嘉然']);ok(p.active.some(g=>g.id==='pair_2992'),'2992 pair active');
b=battle(['阿梓','嘉然']);b.onLightweightCast(find(b,'阿梓'));near(find(b,'嘉然').bondFocus,.08,'2992 next skill boost');
for(const [id,steps] of [['mygo',[3,5]],['tang',[2,4,6]],['alley_cats',[2,4]]]){
 const g=c.CHESS_RELATIONSHIPS.find(x=>x.id===id);
 for(let i=0;i<steps.length;i++){const z=profiles(g.members.slice(0,steps[i]));ok(z.active.find(x=>x.id===id)?.level===i+1,id+' threshold '+steps[i]);}
}
let pieces=army(c,['阿梓','阿梓','嘉然']).board.filter(Boolean);pieces[0].star=1;pieces[1].star=3;
p=c.AbstractChess.lineupProfiles(pieces);const same=p.profiles.filter(u=>u.data.name==='阿梓');
ok(!same[0].relationLead&&same[1].relationLead,'highest star alone receives constant named bonuses');
ok(Object.values(same[0].namedAura).every(x=>x===0),'secondary same-name copy no constant named stats');
ok(same[1].namedAura.attack>0,'highest star gets 2992 constant attack');
for(const team of [c.CHESS_RELATIONSHIPS.find(g=>g.id==='mygo').members,['向晚','嘉然','贝拉','乃琳','珈乐','阿梓','七海','露早'],['牛来','牛妈妈','贝拉','奶蛙','袋鼠']]){
 const z=profiles(team);for(const u of z.profiles)for(const [key,cap] of Object.entries(c.CHESS_RULES.namedAuraLimits))ok(u.namedAura[key]<=cap+1e-9,'constant cap '+u.data.name+' '+key);
 const q=battle(team);for(const u of q.alive(0)){const v=z.profiles.find(x=>x.piece.id===u.data.id);near(u.maxHp,v.hp,'combat shares evaluator HP');near(u.attack,v.attack,'combat shares evaluator attack');near(u.spell,v.spell,'combat shares evaluator spell');}
}
b=battle(['乔希']);let mimic=find(b,'乔希'),last=null;
for(let i=0;i<180;i++){mimic.queuedSkill=null;const choice=b.prepareSkill(mimic);ok(choice.origin!==last,'mimic does not repeat');ok(!choice.skill.mimic,'mimic cannot recurse');ok(b.prepareSkill(mimic)===choice,'queued choice stable');last=choice.origin;}
mimic.queuedSkill=null;mimic.lastMimic=null;b.rng.pick=list=>list.find(x=>x.id===0);ok(b.prepareSkill(mimic).origin===0,'borrowed hero ID zero preserved');

const result={date:new Date().toISOString(),checks,passed:true,hashes:Object.fromEntries(['chess-data.js','chess-engine.js'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(root+'/'+f)).digest('hex')]))};console.log('Combat rules passed:',result.checks);
