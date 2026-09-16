(()=>{
'use strict';
const resources={animations:ANIMATIONS,animationSheets:new Map(),images:new Map()},cards=[],holders=[...document.querySelectorAll('[data-cast]')];
let generation=0,previous=0,time=0;
function populate(){
 const serial=++generation,pool=ROSTER.filter(c=>ANIMATIONS[c.id]?.clips.idle?.length);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 cards.length=0;resources.animationSheets.clear();
 holders.forEach((holder,index)=>{
  holder.innerHTML='';const selected=pool.slice(index*3,index*3+3);holder.dataset.cast=selected.map(c=>c.name).join(',');
  for(const data of selected){
   const canvas=document.createElement('canvas');canvas.width=220;canvas.height=255;canvas.setAttribute('aria-label',data.name);holder.append(canvas);cards.push({data,canvas});
   const entry=ANIMATIONS[data.id],sheets=new Map();resources.animationSheets.set(data.id,sheets);
   for(const key of new Set(entry.clips.idle.map(r=>r.sheet))){const im=new Image();im.onload=()=>{if(serial===generation)sheets.set(key,im);};im.src=entry.sheets[key];}
  }
 });
}
function draw(now){
 time+=Math.min(.05,Math.max(0,(now-previous)/1000));previous=now;
 try{if(!document.hidden)for(const {canvas,data} of cards){
  const entry=ANIMATIONS[data.id],sheets=resources.animationSheets.get(data.id);if(!entry.clips.idle.every(r=>sheets?.has(r.sheet)))continue;
  const ctx=canvas.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,220,255);ctx.imageSmoothingEnabled=false;
  ctx.save();try{ctx.translate(110,248);ctx.scale(1.25,1.25);FighterAnimation.drawCharacter(ctx,{data,hp:1,y:443,facing:1,animTime:time},resources,1,0,0);}finally{ctx.restore();}
 }}finally{requestAnimationFrame(draw);}
}
populate();window.addEventListener('pageshow',e=>{if(e.persisted)populate();});requestAnimationFrame(draw);
})();
