(()=>{
'use strict';
class Formation{
 constructor(root,art,options){
  this.root=root;this.art=art;this.options=options;this.canvas=root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');this.selectedCell=null;this.drag=null;this.blockUntil=0;this.background=null;this.stamp='';
  this.layout=TurnRenderer.fieldLayout(1100,680,false);
  for(let cell=0;cell<4;cell++){const button=document.createElement('button');button.dataset.cell=cell;button.className='formation-hit';button.onclick=e=>{if(performance.now()<this.blockUntil){e.preventDefault();return;}this.tap(cell);};root.append(button);}
  root.addEventListener('pointerdown',e=>this.down(e));root.addEventListener('contextmenu',e=>e.preventDefault());
  window.addEventListener('pointermove',e=>this.move(e),{passive:false});window.addEventListener('pointerup',e=>this.up(e));window.addEventListener('pointercancel',e=>{if(this.drag?.pointer===e.pointerId)this.cancel();});
  root.addEventListener('lostpointercapture',e=>{if(e.target===root&&this.drag?.pointer===e.pointerId)this.cancel();});
  for(const event of ['blur','pagehide','orientationchange'])window.addEventListener(event,()=>this.cancel());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.cancel();});
 }
 team(){return this.options.getTeam()||[];}side(){return this.options.getSide?.()||0;}enabled(){return this.options.canEdit()&&!this.root.closest('[hidden]');}
 position(cell){const side=this.side(),p=TurnRenderer.prototype.position.call({layout:()=>this.layout},{side,cell});return {x:p.x-side*550,y:p.y};}
 bounds(cell){const p=this.position(cell);return {x:p.x-105,y:p.y-205*this.layout.scale-25,width:210,height:205*this.layout.scale+73};}
 point(e){const r=this.canvas.getBoundingClientRect();return r.width&&r.height?{x:(e.clientX-r.left)*550/r.width,y:(e.clientY-r.top)*680/r.height}:null;}
 cellAt(point){if(!point||point.x<0||point.x>550||point.y<0||point.y>680)return null;for(let cell=0;cell<4;cell++){const b=this.bounds(cell);if(point.x>=b.x&&point.x<=b.x+b.width&&point.y>=b.y&&point.y<=b.y+b.height)return cell;}return null;}
 select(cell){this.selectedCell=cell;const index=this.team().findIndex(s=>s.cell===cell);if(index>=0)this.options.onSelect?.(index);this.update();}
 tap(cell){if(!this.enabled())return;if(this.selectedCell==null)this.select(cell);else if(this.selectedCell===cell){this.selectedCell=null;this.update();}else{const from=this.selectedCell;this.selectedCell=null;this.swap(from,cell);}}
 swap(from,to){const team=this.team(),a=team.find(s=>s.cell===from),b=team.find(s=>s.cell===to);if(!this.enabled()||from===to||!a||!b)return false;if(a.id==null&&b.id==null){this.options.onSelect?.(team.indexOf(b));this.update();return false;}[a.cell,b.cell]=[b.cell,a.cell];this.options.onChange?.(team.indexOf(a.id==null?b:a));this.update();return true;}
 down(e){if(!this.enabled()||this.drag||e.isPrimary===false||(e.button!=null&&e.button!==0))return;const cell=this.cellAt(this.point(e));if(cell==null)return;const item=this.team().find(s=>s.cell===cell);if(!item||item.id==null)return;this.drag={pointer:e.pointerId,cell,id:item.id,team:this.team(),side:this.side(),x:e.clientX,y:e.clientY,active:false,point:this.point(e),target:null};}
 valid(d){return this.enabled()&&d.team===this.team()&&d.side===this.side()&&this.team().some(s=>s.cell===d.cell&&s.id===d.id);}
 move(e){const d=this.drag;if(!d||d.pointer!==e.pointerId)return;if(!this.valid(d)){this.cancel();return;}if(!d.active&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)return;if(!d.active){d.active=true;this.selectedCell=d.cell;try{this.root.setPointerCapture(e.pointerId);}catch{}}
  e.preventDefault();d.point=this.point(e);d.target=this.cellAt(d.point);this.updateHighlights();
 }
 up(e){const d=this.drag;if(!d||d.pointer!==e.pointerId)return;const active=d.active,target=this.cellAt(this.point(e)),valid=this.valid(d);if(active){e.preventDefault();this.blockUntil=performance.now()+650;}this.drag=null;try{if(this.root.hasPointerCapture(e.pointerId))this.root.releasePointerCapture(e.pointerId);}catch{}
  if(active){this.selectedCell=null;if(valid&&target!=null&&target!==d.cell)this.swap(d.cell,target);this.update();}
 }
 cancel(){const d=this.drag;this.drag=null;if(d?.active)this.blockUntil=performance.now()+650;try{if(d&&this.root.hasPointerCapture(d.pointer))this.root.releasePointerCapture(d.pointer);}catch{}this.selectedCell=null;this.updateHighlights();}
 update(){const team=this.team(),stamp=this.side()+'|'+team.map(s=>s.id+':'+s.cell).join('|');if(this.stamp&&this.stamp!==stamp){this.cancel();}this.stamp=stamp;
  this.root.querySelectorAll('.formation-hit').forEach(button=>{const cell=+button.dataset.cell,b=this.bounds(cell),item=team.find(s=>s.cell===cell),data=TURN_BY_ID.get(item?.id);button.style.left=b.x/550*100+'%';button.style.top=b.y/680*100+'%';button.style.width=b.width/550*100+'%';button.style.height=b.height/680*100+'%';button.disabled=!item||!this.options.canEdit();button.setAttribute('aria-label',(data?data.name:'空位')+'，位置 '+(cell+1)+(data?'，点按或拖动换位':'，点击后从下方选择角色'));});
  this.updateHighlights();for(const s of team)if(TURN_BY_ID.has(s.id))this.art.character(TURN_BY_ID.get(s.id)).catch(()=>{});
 }
 highlightCell(){const cell=this.drag?.active?this.drag.target:(this.selectedCell??this.options.getFocusCell?.());return Number.isInteger(cell)&&cell>=0&&cell<4?cell:null;}
 updateHighlights(){this.root.querySelectorAll('.formation-hit').forEach(button=>{const cell=+button.dataset.cell,active=cell===this.highlightCell(),dragging=!!this.drag?.active;button.classList.toggle('selected',active&&!dragging&&cell===this.selectedCell);button.classList.toggle('focused',active&&!dragging&&this.selectedCell==null);button.classList.toggle('drop-target',active&&dragging);button.setAttribute('aria-pressed',String(cell===this.selectedCell));});}
 draw(time=0){
  const c=this.ctx,l=this.layout,team=this.team(),side=this.side(),highlight=this.highlightCell(),dragging=!!this.drag?.active;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,550,680);c.imageSmoothingEnabled=false;
  if(this.background){const im=this.background,k=Math.max(1100/(im.naturalWidth||im.width),680/(im.naturalHeight||im.height));c.drawImage(im,(1100-(im.naturalWidth||im.width)*k)/2-side*550,(680-(im.naturalHeight||im.height)*k)/2,(im.naturalWidth||im.width)*k,(im.naturalHeight||im.height)*k);}
  c.fillStyle='#11151c65';c.fillRect(0,0,550,680);
  for(let cell=0;cell<4;cell++){const p=this.position(cell),active=cell===highlight;c.fillStyle=active?(dragging?'#96f4ca35':'#ffd27830'):(side?'#a8426b35':'#47b8c435');c.strokeStyle=active?(dragging?'#96f4ca':'#ffd278'):'#b1d7dc66';c.lineWidth=active?4:2;c.beginPath();c.ellipse(p.x,p.y+4,75,22,0,0,Math.PI*2);c.fill();c.stroke();}
  const paint=(s,p,alpha=1)=>{const data=TURN_BY_ID.get(s.id);if(this.art.ready(data,'idle',side?-1:1)){c.save();try{c.globalAlpha=alpha;c.translate(p.x,p.y);c.scale(l.scale,l.scale);FighterAnimation.drawCharacter(c,{data:data.original,hp:1,y:443,vy:0,facing:side?-1:1,animTime:time},this.art,1,0,0);}finally{c.restore();}}else{c.fillStyle='#d2dbde';c.textAlign='center';c.font='18px Microsoft YaHei';c.fillText('载入中…',p.x,p.y-70);}};
  for(const s of [...team].sort((a,b)=>a.cell%2-b.cell%2)){const p=this.position(s.cell);if(!TURN_BY_ID.has(s.id)){c.textAlign='center';c.fillStyle='#acc2cb';c.font='42px Microsoft YaHei';c.fillText('＋',p.x,p.y-65);c.font='20px Microsoft YaHei';c.fillText('选择角色',p.x,p.y-28);continue;}paint(s,p,this.drag?.active&&this.drag.cell===s.cell?.32:1);c.textAlign='center';c.font='bold 24px Microsoft YaHei';c.fillStyle=highlight===s.cell?(dragging?'#b3ffdf':'#ffdc9c'):'#fff6e8';c.shadowColor='#000';c.shadowBlur=5;c.fillText(TURN_BY_ID.get(s.id).name,p.x,p.y-173*l.scale-34);c.shadowBlur=0;if(s.hp!=null){c.fillStyle='#141b29';c.fillRect(p.x-63,p.y+20,126,8);c.fillStyle='#8fdfb1';c.fillRect(p.x-63,p.y+20,126*s.hp,8);c.font='18px Microsoft YaHei';c.fillStyle='#d6eedc';c.fillText(Math.round(s.hp*100)+'%',p.x,p.y+48);}}
  if(this.drag?.active&&this.drag.point){const s=team.find(s=>s.id===this.drag.id);if(s)paint(s,{x:this.drag.point.x,y:this.drag.point.y+80},.9);}
 }
}
window.TurnFormation=Formation;
})();
