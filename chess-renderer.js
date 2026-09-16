(()=>{
'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const physicalTypes=new Set(['light','heavy','dash','upper','slam','grab']);
class Renderer{
 constructor(canvas,art){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.art=art;this.background=null;this.battle=null;this.prep=[];this.time=0;this.clock=0;this.selected=null;this.lastBattle=null;this.finishedAt=null;this.onMissing=null;}
 setPrep(p,scout){this.battle=null;this.lastBattle=null;this.finishedAt=null;this.prep=[];[p,scout].forEach((player,side)=>{if(!player)return;player.board.forEach((u,cell)=>{if(u)this.prep.push({...u,data:CHESS_BY_ID.get(u.id),side,x:side?5-cell%6:cell%6,y:side?3-Math.floor(cell/6):4+Math.floor(cell/6),hp:1,maxHp:1,mana:0});});});}
 home(u){return {x:300+u.x*100,y:151+u.y*62};}
 get combatTime(){return this.battle?.done?this.clock:(this.battle?.time??this.time);}
 ground(u){const now=this.home(u);if(!this.battle||!u.previous||this.battle.done)return now;const old=this.home(u.previous),t=this.alpha??1;return {x:old.x+(now.x-old.x)*t,y:old.y+(now.y-old.y)*t};}
 age(u){return this.combatTime-(u.action?.time??-20);}
 melee(u,a=u.action){return !!a&&((a.normal&&!a.ranged)||!a.normal&&!!a.skill?.power&&(a.skill.melee||a.source.physical||physicalTypes.has(a.source.type)));}
 direction(u){return u.facing??(u.side?-1:1);}
 pose(u){const p=this.ground(u),a=u.action,age=this.age(u);if(this.battle&&u.hp>0&&!u.moving&&a&&this.melee(u)&&age>=0&&age<(a.duration||.8)){const t=age/(a.duration||.8);p.x+=this.direction(u)*Math.sin(t*Math.PI)*7;}return p;}
 actor(u){const a=u.action,age=this.battle?this.age(u):20,duration=a?.duration||.8;let data=u.data;
  if(a&&age<duration&&CHESS_BY_ID.has(a.origin)&&this.art.ready(CHESS_BY_ID.get(a.origin)))data=CHESS_BY_ID.get(a.origin);
  const f={data:data.original,hp:u.hp,y:443,vy:0,x:0,facing:this.direction(u),animTime:this.battle?this.combatTime:this.time,walk:0,form:u.form?{name:u.form,age:this.combatTime}:null};
  if(u.hp<=0){f.animTime=Math.max(0,this.combatTime-(u.deathAt??this.combatTime-.4));return f;}
  const moving=this.battle&&u.moving;
  if(this.battle&&this.combatTime-(u.hurtAt??-20)<.12&&this.combatTime>=u.hurtAt){f.stun=1;f.hitFlash=.12;f.animTime=this.combatTime-u.hurtAt;return f;}
  if(moving){f.walk=1;return f;}
  if(a&&age>=0&&age<duration){const lead=a.lead||0;
   if(age<lead&&this.melee(u)){f.walk=1;return f;}
   const source=a.source,span=Math.max(.1,duration-lead),sourceDuration=source.duration||.7,elapsed=clamp((age-lead)/span)*sourceDuration;
   f.attack={index:a.index,serial:a.serial,t:elapsed,skill:{...source,duration:sourceDuration,start:clamp(((a.impact??duration*.42)-lead)/span,.08,.8)*sourceDuration}};f.animTime=Math.max(0,age-lead);
  }
  return f;
 }
 drawFighter(f,alpha,x,y,scale){
  const c=this.ctx;let ready=false;
  c.save();try{c.translate(x,y);c.scale(scale,scale);
   try{if(MemeVisuals.form({ctx:c,options:this.art},f,alpha,0,0))return true;}catch{f={...f,form:null,attack:f.attack?{...f.attack,skill:{...f.attack.skill,form:null}}:null};}
   const entry=this.art.animations[f.data.id],sheets=this.art.animationSheets.get(f.data.id);if(!entry||!sheets)return false;
   const frame=FighterAnimation.chooseFrame(f,entry);ready=sheets.has(frame.rect.sheet);if(!ready)return false;
   FighterAnimation.drawCharacter(c,f,this.art,alpha,0,0);return true;
  }catch{return false;}finally{c.restore();}
 }
 draw(time,alpha=1){
  this.alpha=clamp(alpha);
  this.time=time;const c=this.ctx,b=this.battle,units=b?b.units:this.prep;
  if(b!==this.lastBattle){this.lastBattle=b;this.finishedAt=null;}
  if(b?.done&&this.finishedAt==null)this.finishedAt=time;
  this.clock=b?b.time+(b.done?Math.max(0,time-this.finishedAt):0):time;
  // A frame always begins from a clean canvas transform, including after loading failures.
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.filter='none';c.shadowBlur=0;c.clearRect(0,0,1100,740);c.imageSmoothingEnabled=false;
  c.save();try{
   ChessBoards.draw(c,this.theme||ChessBoards.themes[0]);
   c.textAlign='left';c.font='bold 19px Microsoft YaHei';c.fillStyle=b?'#bdeed2':'#f2ced5';c.fillText(this.showcase?'':b?'我方 · '+b.alive(0).length+' 人':'侦察阵容',35,40);c.textAlign='right';c.fillStyle=b?'#f0b3c7':'#bfe8cc';c.fillText(this.showcase?'':b?'对手 · '+b.alive(1).length+' 人':'下半场 · 我方部署区',1065,b?40:704);
   if(b){c.textAlign='center';c.fillStyle='#fbebc4';c.font='bold 18px Microsoft YaHei';c.fillText(b.done?(b.winner===0?'胜利':b.winner===1?'本轮落败':'平局'):Math.max(0,Math.ceil(45-b.time))+' 秒',550,703);}
   const positions=new Map(units.map(u=>[u.uid,this.pose(u)]));
   for(const u of [...units].sort((a,z)=>positions.get(a.uid).y-positions.get(z.uid).y||a.side-z.side)){
    const p=positions.get(u.uid),f=this.actor(u),scale=(b?.60:.39)*(1+(u.star-1)*.07),alpha=u.hp>0?1:clamp(1-(this.clock-(u.deathAt??this.clock-.5))*.5,.22,1);
    c.fillStyle=u.side?'#e59ebd30':'#74ffd52a';c.beginPath();c.ellipse(p.x,p.y+2,b?35:40,b?14:12,0,0,Math.PI*2);c.fill();
    if(this.selected===u.uid){c.strokeStyle='#ffdf93';c.lineWidth=3;c.stroke();}
    const painted=this.drawFighter(f,alpha,p.x,p.y,scale);
    c.textAlign='center';c.shadowColor='#000';c.shadowBlur=4;c.font='bold '+(b?14:13)+'px Microsoft YaHei';c.fillStyle=u.hp>0?'#fff7df':'#899b9a';const head=b?117+(u.star-1)*8:88,labelY=Math.max(22,p.y-head);
    c.fillText(u.data.name,p.x,labelY);c.fillStyle='#ffe097';c.font='13px Microsoft YaHei';c.fillText('★'.repeat(u.star),p.x,labelY+17);c.shadowBlur=0;
    if(!painted){c.fillStyle='#d6e6da';c.font='12px Microsoft YaHei';c.fillText('载入中…',p.x,p.y-30);this.onMissing?.(u.data);}
    if(u.hp>0){const width=b?90:76;c.fillStyle='#12252c';c.fillRect(p.x-width/2,p.y+9,width,6);c.fillStyle=u.side?'#e495b4':'#9de9c6';c.fillRect(p.x-width/2,p.y+9,width*u.hp/u.maxHp,6);
     if(b){c.fillStyle='#263b4c';c.fillRect(p.x-width/2,p.y+17,width,3);c.fillStyle='#8dd4f9';c.fillRect(p.x-width/2,p.y+17,width*u.mana/100,3);if(u.shield){c.strokeStyle='#f3d798';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y-53,58,-2.8,-.3);c.stroke();}}
    }
   }
   if(b){for(const u of units){const a=u.action;if(!a)continue;const t=this.age(u)/(a.duration||.8);if(t<0||t>1)continue;try{this.effect(u,a,t);}catch{}}
    for(const e of b.events){const age=this.clock-e.time;if(age<0||age>.65||!e.amount||!['hit','spell','heal'].includes(e.type))continue;const u=b.unit(e.target);if(!u)continue;const p=this.pose(u);c.save();try{c.textAlign='center';c.font='bold 23px Microsoft YaHei';c.fillStyle=e.type==='heal'?'#b8ffbc':'#fff0c6';c.shadowColor='#182323';c.shadowBlur=4;c.globalAlpha=1-age/.7;c.fillText((e.type==='heal'?'+':'−')+e.amount,p.x+25,p.y-85-age*70);}finally{c.restore();}}
    if(b.time>30&&!b.done){c.textAlign='center';c.fillStyle='#ffd097';c.font='bold 17px Microsoft YaHei';c.fillText('加时 · 伤害提升 / 治疗削减',550,73);}
   }
  }finally{c.restore();}
 }
 effect(u,a,t){
  const c=this.ctx,s=a.source,start=this.pose(u),age=t*(a.duration||.8),impact=a.impact??.32,duration=a.duration||.8;
  if(u.deathAt!=null&&u.deathAt<a.time+impact)return;
  for(const id of a.targets){const v=this.battle.unit(id);if(!v)continue;const end=this.pose(v),dir=end.x>=start.x?1:-1,physical=this.melee(u,a);
   if(physical){const elapsed=age-impact;if(elapsed>=0&&elapsed<.23){c.save();try{c.translate(end.x,end.y-68);c.globalAlpha=1-elapsed/.25;c.strokeStyle='#fff1c6';c.lineWidth=a.normal?4:6;for(let i=0;i<7;i++){const angle=i*Math.PI*2/7+.3;c.beginPath();c.moveTo(Math.cos(angle)*9,Math.sin(angle)*8);c.lineTo(Math.cos(angle)*(40+elapsed*50),Math.sin(angle)*(32+elapsed*30));c.stroke();}}finally{c.restore();}}continue;}
   if(!a.normal&&a.skill?.target!=='enemy'){if(age<impact||age>impact+.4)continue;c.save();try{c.globalAlpha=clamp(1-(age-impact)/.45);c.strokeStyle=a.skill.heal?'#a5ffd2':'#b2d6ff';c.lineWidth=3;c.beginPath();c.ellipse(end.x,end.y-60,55,77,0,0,Math.PI*2);c.stroke();}finally{c.restore();}continue;}
   const launch=a.lead||.04,phase=clamp((age-launch)/Math.max(.1,impact-launch));if(age<launch||age>impact+.12)continue;
   const x=start.x+(end.x-start.x)*phase,y=start.y-75+(end.y-start.y)*phase-(s.type==='throw'?Math.sin(phase*Math.PI)*78:0);
   if(!a.normal&&s.summonId!=null){const summoned=CHESS_BY_ID.get(s.summonId);if(summoned){const f={data:summoned.original,hp:1,y:443,vy:0,walk:1,facing:dir,animTime:age*2};if(this.drawFighter(f,.95,x,y+65,.62))continue;}}
   const fx=s.sequence?.[Math.floor(t*8)%s.sequence.length]||s.fx;let painted=false;if(!a.normal&&!s.noIcons&&fx)painted=MemeVisuals.sprite(c,fx,x,y,104,age,dir,.98,false);
   if(a.ranged){c.save();c.strokeStyle='#ffe5a5';c.lineWidth=4;c.beginPath();c.moveTo(x-dir*19,y+4);c.lineTo(x,y);c.stroke();c.fillStyle='#fff5d0';c.fillRect(x-3,y-3,6,6);c.restore();continue;}
   if(!painted){c.strokeStyle=a.normal?'#eedca7':'#94eafa';c.lineWidth=a.normal?3:5;c.beginPath();c.arc(x,y,a.normal?8:23,dir>0?-1.1:Math.PI-1.1,dir>0?1.1:Math.PI+1.1);c.stroke();}
  }
 }
}
window.ChessRenderer=Renderer;
})();
