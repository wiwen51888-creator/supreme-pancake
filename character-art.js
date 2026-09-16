(()=>{
'use strict';
class Art{
 constructor(){this.animations=ANIMATIONS;this.animationSheets=new Map();this.images=new Map();this.pending=new Map();this.loadingCharacters=new Map();this.generation=0;}
 image(url){if(this.pending.has(url))return this.pending.get(url);const p=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('素材未载入，请重试'));im.src=window.EMBEDDED_IMAGES?.[url]||url;});this.pending.set(url,p);p.catch(()=>this.pending.delete(url));return p;}
 async character(c,full=false){
  const e=ANIMATIONS[c.id];if(!e)return;this.loadingCharacters.set(c.id,(this.loadingCharacters.get(c.id)||0)+1);let sheets=this.animationSheets.get(c.id);if(!sheets){sheets=new Map();this.animationSheets.set(c.id,sheets);}
  const states=full?['idle','run','hurt','down','block',...c.skills.map(s=>FighterAnimation.attackStates[s.sourceIndex??0])]:['idle'];
  const clips=[e.clips,...Object.values(e.directionalClips||{})];const need=new Set(clips.flatMap(cl=>states.flatMap(state=>(cl[state]||[]).map(r=>r.sheet))));
  try{await Promise.all([...need].map(async key=>{if(!sheets.has(key))sheets.set(key,await this.image(e.sheets[key]));}));}finally{const n=this.loadingCharacters.get(c.id)-1;if(n)this.loadingCharacters.set(c.id,n);else this.loadingCharacters.delete(c.id);}
 }
 trim(ids){for(const id of this.animationSheets.keys())if(!ids.has(id)&&!this.loadingCharacters.has(id)){const e=ANIMATIONS[id];for(const url of Object.values(e.sheets))this.pending.delete(url);this.animationSheets.delete(id);}}
 ready(c,state='idle',facing=1){const e=ANIMATIONS[c.id],map=this.animationSheets.get(c.id);return !!map&&(e.directionalClips?.[facing]?.[state]||e.clips[state]||[]).every(r=>map.has(r.sheet));}
 preview(canvas,c,time=0){if(!this.ready(c))return;const ctx=canvas.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;const scale=canvas.height/205;ctx.save();try{ctx.translate(canvas.width/2,canvas.height-5);ctx.scale(scale,scale);FighterAnimation.drawCharacter(ctx,{data:c.original||c,hp:1,y:443,facing:1,animTime:time},this,1,0,0);}finally{ctx.restore();}}
 cancelBattle(){this.generation++;}
 prune(units){
  const sources=units.flatMap(u=>u.data.skills.map(s=>s.source)),ids=new Set([...units.map(u=>u.data.id),...sources.map(s=>s.summonId).filter(id=>id!=null)]);this.trim(ids);
  const keys=new Set(),add=fx=>{for(const r of MEME_ART.clips[fx]||[])keys.add(r.sheet);},form=name=>{if(MEME_ART.forms?.[name])for(const clip of Object.values(MEME_ART.forms[name].clips))for(const r of clip)keys.add(r.sheet);else for(const key of Object.keys(MEME_ART.clips))if(key===name||key.startsWith(name+'-'))add(key);};
  for(const s of sources){[s.fx,s.openingFx,s.extraShot,...(s.sequence||[])].forEach(add);if(s.form)form(s.form);}for(const u of units)if(u.form)form(u.form);['crescent','wave','cannon','flame','rabbit_bite','pan'].forEach(add);
  for(const key of MemeVisuals.sheets.keys())if(!keys.has(key))MemeVisuals.sheets.delete(key);
  const urls=new Set([...this.animationSheets.keys()].flatMap(id=>Object.values(ANIMATIONS[id].sheets)));for(const key of keys)urls.add(MEME_ART.sheets[key]);for(const url of this.pending.keys())if(!urls.has(url))this.pending.delete(url);
 }
 async battle(units){
  const generation=++this.generation;
  await Promise.all(units.map(u=>this.character(u.data,true)));
  if(generation!==this.generation)return;
  const originals=units.map(u=>({skills:u.data.skills.map(s=>s.source)}));
  const summonIds=new Set(originals.flatMap(c=>c.skills.map(s=>s.summonId)).filter(id=>id!=null));
  await Promise.all([...summonIds].map(id=>this.character(TURN_BY_ID.get(id),true)));
  if(generation!==this.generation)return;await MemeVisuals.load(url=>this.image(url),originals,true);if(generation!==this.generation)return;this.prune(units);
 }
 async skill(s,origin){if(origin!=null)await this.character(TURN_BY_ID.get(origin),true);if(s?.source?.summonId!=null)await this.character(TURN_BY_ID.get(s.source.summonId),true);if(s)await MemeVisuals.load(url=>this.image(url),[{skills:[s.source]}],true);}
}
window.TurnArt=Art;
})();
