/* Generated raster props and form animation, shared with the combat renderer. */
(()=>{
const sheets=new Map(),pending=new Map();let battleSheets=null;
async function load(loadImage,characters,append=false){
 const art=window.MEME_ART||{},needed=new Set();
 const add=key=>{for(const r of art.clips?.[key]||[])needed.add(r.sheet);};
 if(!characters)Object.keys(art.sheets||{}).forEach(k=>needed.add(k));
 else for(const c of characters){
  for(const s of c.skills){
   add(s.fx);add(s.openingFx);add(s.extraShot);for(const fx of s.sequence||[])add(fx);
   if(s.form){
    if(art.forms?.[s.form])for(const clip of Object.values(art.forms[s.form].clips))for(const r of clip)needed.add(r.sheet);
    else for(const key of Object.keys(art.clips||{}))if(key===s.form||key.startsWith(s.form+'-'))add(key);
   }
  }
 }
 // Shared reaction art and Jayce's alternate normal attack.
 for(const key of ['crescent','wave','cannon','flame','rabbit_bite','pan'])add(key);
 await Promise.all([...needed].map(async name=>{
  if(sheets.has(name))return;
  if(!pending.has(name))pending.set(name,loadImage(art.sheets[name]).then(im=>sheets.set(name,FighterAnimation.prepareSheet(im,{key:art.keys?.[name]??null}))).finally(()=>pending.delete(name)));
  await pending.get(name);
 }));if(!append)battleSheets=needed;
}
function releaseUnused(g){
 if(!battleSheets)return;const keep=new Set(battleSheets),art=window.MEME_ART||{};
 const add=key=>{for(const r of art.clips?.[key]||[])keep.add(r.sheet);};
 const form=name=>{if(art.forms?.[name])for(const clip of Object.values(art.forms[name].clips))for(const r of clip)keep.add(r.sheet);else for(const key of Object.keys(art.clips||{}))if(key===name||key.startsWith(name+'-'))add(key);};
 const skill=s=>{if(!s)return;add(s.fx);add(s.openingFx);add(s.extraShot);for(const key of s.sequence||[])add(key);if(s.form)form(s.form);};
 for(const f of g?.fighters||[]){skill(f.attack?.skill);skill(f.castPending?.skill);if(f.form)form(f.form.name);add(f.buff?.fx);}
 for(const p of g?.projectiles||[]){add(p.fx);skill(p.skill);if(p.summonForm)form(p.summonForm);}
 for(const e of g?.effects||[]){add(e.fx);skill(e.attack?.skill);}
 for(const key of sheets.keys())if(!keep.has(key)&&!pending.has(key))sheets.delete(key);
}
function sprite(ctx,key,x,y,size=90,time=0,dir=1,alpha=1,ground=false,frameIndex){
 const clip=window.MEME_ART?.clips?.[key];if(!clip)return false;
 const r=clip[frameIndex==null?Math.floor(time*12)%clip.length:Math.min(frameIndex,clip.length-1)];
 const im=sheets.get(r.sheet);if(!im)return false;
 const scale=size/(ground?(r.referenceHeight||r.h):(r.referenceWidth||r.w));
 ctx.save();try{ctx.translate(Math.round(x),Math.round(y));ctx.scale(dir,1);ctx.globalAlpha*=alpha;
 ctx.drawImage(im,r.x,r.y,r.w,r.h,-(ground?(r.pivotX||r.w/2):r.w/2)*scale,ground?-r.h*scale:-r.h*scale/2,r.w*scale,r.h*scale);}finally{ctx.restore();}return true;
}
function form(g,f,alpha=1,x=f.x,y=f.y){
 const s=f.attack?.skill,kind=s?.form||f.form?.name;if(!kind)return false;
 const t=f.attack?.t||f.form?.age||0;
 if(s?.type==='transform'&&!['horse','wolf'].includes(kind)&&t<s.start)return false;
 if(kind==='wolf'&&s?.type==='transform'&&MEME_ART.clips['wolf-transform']){
  const index=Math.min(3,Math.floor(t/s.start*3)),r=MEME_ART.clips['wolf-transform'][index];
  return sprite(g.ctx,'wolf-transform',x,y,r.targetHeight,t,f.facing,alpha,true,index);
 }
 const state=FighterAnimation.stateFor(f);
 // New complete transformations have their own art for every combat state.
 if(MEME_ART.forms?.[kind]){
  return !!FighterAnimation.draw(g.ctx,f,MEME_ART.forms[kind],sheets,alpha,x,y);
 }
 if(kind==='rabbit')return sprite(g.ctx,'rabbit_bite',x,y,105,t,f.facing,alpha,true);
 if(['idle','run','jump','block','hurt','down','ko'].includes(state)&&window.MEME_ART?.clips?.[kind+'-idle']){
  const clips=Object.fromEntries(['idle','run','jump','block','hurt','down'].map(k=>[k,MEME_ART.clips[kind+'-'+k]]));
  return !!FighterAnimation.draw(g.ctx,f,{clips,koFrame:1,targetHeight:kind==='wolf'?105:kind==='horse'?177:184},sheets,alpha,x,y);
 }
 if(f.hp<=0||f.knocked>0)return false;
 if(f.attack?.index<2&&MEME_ART.clips[kind+'-light']){
  const clips={light:MEME_ART.clips[kind+'-light'],heavy:MEME_ART.clips[kind+'-heavy']};
  return !!FighterAnimation.draw(g.ctx,f,{clips,impact:{light:kind==='wolf'?1:2,heavy:2},targetHeight:kind==='wolf'?105:177},sheets,alpha,x,y);
 }
 if(kind==='wheelchair')return sprite(g.ctx,t<(s?.start||.4)?'wheelchair-mount':'wheelchair-rush',x,y,163,t, f.facing,alpha,true,t<(s?.start||.4)?Math.min(3,Math.floor(t/(s?.start||.4)*4)):undefined);
 if(kind==='horse'){
  const changing=f.attack?.skill.type==='transform',moving=f.walk>0||s?.type==='dash';
  return sprite(g.ctx,changing||!moving?'horse-transform':'horse-run',x,y,177,t,f.facing,alpha,true,changing?Math.min(3,Math.floor(t/.38*4)):!moving?3:undefined);
 }
 if(kind==='wolf')return sprite(g.ctx,'wolf',x,y,105,t,f.facing,alpha,true,!f.attack&&!f.walk?0:undefined);
 if(kind==='jayce'){
  const cannon=f.attack&&(s.type==='projectile'||s.type==='barrage');
  return sprite(g.ctx,cannon?'jayce-cannon':'jayce-hammer',x,y,184,t,f.facing,alpha,true,f.attack?undefined:0);
 }
 return false;
}
function projectile(g,p){
 const c=g.ctx,dir=Math.sign(p.vx)||1;
 if(p.skill.noIcons){
  c.save();c.translate(p.x,p.y);c.scale(dir,1);c.strokeStyle=p.color;c.lineWidth=5;c.globalAlpha=.85;
  for(let i=0;i<3;i++){c.beginPath();c.arc(-i*10,0,18+i*8,-1.15,1.15);c.stroke();}c.restore();return true;
 }
 if(p.summonId!=null){
  const data=ROSTER_BY_ID.get(p.summonId);
  if(!data)return false;
  const f={data,x:p.x,y:443,hp:1,facing:dir,walk:1,vy:0,animTime:p.age||0,hitFlash:0,invuln:0,form:p.summonForm?{name:p.summonForm,age:p.age||0}:null};
  c.save();c.translate(p.x,p.y+p.size*.46);c.scale(p.size/173,p.size/173);
  if(!form(g,f,.88,0,0))FighterAnimation.drawCharacter(c,f,g.options,.88,0,0);c.restore();return true;
 }
 return sprite(c,p.fx,p.x,p.y+(p.groundArt?p.size*.5:0),p.size,p.age||0,dir,1,!!p.groundArt);
}
function effect(g,e){
 if(e.type==='meme'){sprite(g.ctx,e.fx,e.x,e.y,e.size||100,e.max-e.life,e.dir||1,Math.min(1,e.life*6));return true;}
 if(e.type==='wall'){
  if(e.fx==='cucumber_wall')sprite(g.ctx,e.fx,e.x,e.y,155,g.age,1,1,true);else for(let i=0;i<3;i++)sprite(g.ctx,e.fx,e.x,e.y-5-i*47,66,g.age,1,1,true);
  const c=g.ctx;c.fillStyle='#13131b';c.fillRect(e.x-29,e.y-160,58,5);c.fillStyle=e.color;c.fillRect(e.x-29,e.y-160,58*Math.max(0,e.hp)/110,5);return true;
 }
 if(e.type==='warning'){
  const c=g.ctx;c.save();c.globalAlpha=.6;c.fillStyle=e.color;c.fillRect(e.x-34,438,68,5);c.strokeStyle=e.color;c.lineWidth=2;c.strokeRect(e.x-34,410,68,33);c.font='bold 21px monospace';c.textAlign='center';c.fillText('!',e.x,430);c.restore();return true;
 }
 if(e.type==='trap'&&e.attack?.skill.fx&&!e.attack.skill.noIcons){sprite(g.ctx,e.attack.skill.fx,e.x,e.y-18,e.attack.skill.fx==='prison_bars'?145:80,g.age,1,.85);return false;}
 if(e.type==='beam'&&e.fx){
  for(let i=0;i<Math.min(7,Math.ceil((e.length||880)/120));i++)sprite(g.ctx,e.fx,e.x+e.dir*(65+i*120),e.y,90,g.age,e.dir,Math.max(0,e.life/e.max));return false;
 }
 return false;
}
function status(g,f){
 const c=g.ctx,active=[f.buff&&{...f.buff,label:f.buff.name},f.form,f.burn&&{...f.burn,label:'燃烧'}].filter(Boolean);
 if(f.burn){sprite(c,'flame',f.x-25,f.y-30,72,g.age,1,.9);sprite(c,'flame',f.x+20,f.y-90,60,g.age+.2,-1,.85);}
 if(!active.length)return;c.save();c.font='bold 13px Microsoft YaHei';c.textAlign='center';
 active.forEach((b,i)=>{c.fillStyle='#171324d9';c.fillRect(f.x-70,f.y-213-i*22,140,20);c.fillStyle=f.data.color;c.fillText((b.label||b.name)+' '+b.time.toFixed(1)+'s',f.x,f.y-198-i*22);});c.restore();
 if(f.buff?.fx)sprite(c,f.buff.fx,f.x-f.facing*38,f.y-95,55,g.age,1,.6);
}
window.MemeVisuals={load,releaseUnused,sprite,form,projectile,effect,status,sheets};
})();
