const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {load,root}=require('./context.cjs'),c=load(),{Tournament,Combat,Random}=c.AbstractChess;
let checks=0;const ok=(x,m)=>{assert(x,m);checks++;},hero=n=>c.CHESS_ROSTER.find(x=>x.name===n);
function line(heroes,star=2,legacy=false){const t=new Tournament(4521),p=t.player();p.level=Math.max(3,heroes.length);p.board.fill(null);p.bench=heroes.map((h,i)=>({uid:i+1,id:h.id,star}));while(p.bench.length<9)p.bench.push(null);t.arrange(p);if(legacy){const units=t.field(p).sort((a,b)=>{const score=u=>{const h=c.CHESS_BY_ID.get(u.id);return h.hp*(1+h.armor/100)*(h.role==='先锋'?1.6:h.role==='控场'?1.15:h.role==='支援'?.5:.75)};return score(b)-score(a)||a.uid-b.uid;});p.board.fill(null);units.forEach((u,i)=>p.board[[2,3,8,9,14,15,20,21][i]]=u);}return p;}
const mixed=['奶蛙','牛来','贝拉','小松绿','长崎素世','嘉然'].map(hero),p=line(mixed);
for(const [i,u]of p.board.entries())if(u){const h=c.CHESS_BY_ID.get(u.id);ok(h.range>=2.7?i>=12:h.range>1?i>=6:i<6,'role-sensitive rows '+h.name);}
ok(new Set(p.board.flatMap((u,i)=>u?[i%6]:[])).size>=4,'not a central two-column stack');
const q=line(mixed);ok(JSON.stringify(q.board)===JSON.stringify(p.board),'same deterministic formation for either player');
const b=new Combat(line([hero('小松绿')]),line([hero('奶蛙')]),7),mage=b.units.find(u=>u.side===0),tank=b.units.find(u=>u.side===1);
mage.x=tank.x=2;mage.y=6;tank.y=3;mage.cooldown=0;mage.mana=0;tank.cooldown=10;tank.moveSpeed=0;
b.step(.05);ok(mage.action?.ranged,'ranged normal starts without melee contact');ok(b.distance(mage,tank)>b.meleeReach(mage,tank),'projectile launched from distance');const initialY=mage.y;
for(let i=0;i<14;i++)b.step(.05);ok(tank.hp<tank.maxHp,'ranged projectile actually deals damage');ok(Math.abs(mage.y-initialY)<.1,'shooter holds firing position');ok(tank.pushY===0,'ranged normal cannot permanently push melee out of range');
const meleeSkill={...mage.data.skill,target:'enemy',melee:true};ok(b.cast(mage,tank,{skill:meleeSkill,origin:mage.id})===false,'melee skills cannot hit remotely');
const nearest=new Combat(line(mixed),line(mixed),88);for(let i=0;i<400&&!nearest.done;i++){nearest.step(.05);for(const u of nearest.units){ok(Number.isFinite(u.hp+u.x+u.y),'finite unit');ok(u.x>=0&&u.x<=5&&u.y>=0&&u.y<=7,'within board');}}
console.log('Positioning and range passed:',checks);
module.exports={c,line};
