(()=>{
'use strict';
class Placement{
 constructor(options){
  Object.assign(this,options);this.drag=null;this.blockClickUntil=0;
  for(const [zone,element] of [['board',this.board],['bench',this.bench],['shop',this.shop],['arena',this.arena]]){
   if(!element)continue;element.addEventListener('pointerdown',e=>this.down(e,zone,element));
   element.addEventListener('lostpointercapture',e=>{if(e.target===element&&this.drag?.host===element&&this.drag?.id===e.pointerId)this.cancel();});
   element.addEventListener('contextmenu',e=>e.preventDefault());
  }
  document.addEventListener('pointermove',e=>this.movePointer(e),{passive:false});
  document.addEventListener('pointerup',e=>this.up(e));document.addEventListener('pointercancel',e=>{if(this.drag?.id===e.pointerId)this.cancel();});
  for(const event of ['blur','pagehide','orientationchange'])window.addEventListener(event,()=>{this.cancel();this.hideInfo?.();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.cancel();this.hideInfo?.();}});
 }
 inside(r,x,y){return r.width>0&&r.height>0&&x>=r.left&&x<r.right&&y>=r.top&&y<r.bottom;}
 locate(x,y){
  if(this.shop&&!this.shop.hidden&&this.inside(this.shop.getBoundingClientRect(),x,y))return {zone:'shop',index:0};
  const r=this.board.getBoundingClientRect();
  if(!this.board.hidden&&this.inside(r,x,y))return {zone:'board',index:Math.floor((y-r.top)/r.height*4)*6+Math.floor((x-r.left)/r.width*6)};
  const buttons=[...this.bench.querySelectorAll('button')],index=buttons.findIndex(b=>this.inside(b.getBoundingClientRect(),x,y));
  return index<0?null:{zone:'bench',index};
 }
 down(e,zone,host){
  if(this.drag||e.isPrimary===false||(e.button!=null&&e.button!==0)||this.canInspect?.()===false)return;
  let index;if(zone==='arena'){index=this.pickAt?.(e);if(index==null||index<0)return;}else{const button=e.target.closest?.('button[data-index]');if(!button||!host.contains(button))return;index=+button.dataset.index;}
  const piece=this.getPiece(zone,index);if(!piece)return;
  this.drag={id:e.pointerId,zone,index,uid:piece.uid,piece,host,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false,inspecting:false,moved:false};
  this.hold=setTimeout(()=>{const d=this.drag;if(!d||d.moved||this.getPiece(d.zone,d.index)?.uid!==d.uid)return;d.inspecting=true;this.showInfo?.(d.piece,{x:d.x,y:d.y});},350);
 }
 begin(){
  const d=this.drag;if(!d||d.active||!['board','bench'].includes(d.zone)||!this.canMove())return;
  d.active=true;clearTimeout(this.hold);this.hideInfo?.();try{d.host.setPointerCapture(d.id);}catch{}
  this.preview(this.ghost.querySelector('canvas'),d.piece);this.ghost.querySelector('b').textContent=CHESS_BY_ID.get(d.piece.id).name;this.ghost.hidden=false;this.onDrag?.(d.piece);this.paint();this.scrollLoop();
 }
 paint(){const d=this.drag;if(!d?.active)return;this.ghost.style.left=d.x+'px';this.ghost.style.top=d.y+'px';this.clearHover();const target=this.locate(d.x,d.y);if(target?.zone==='shop')this.shop.classList.add('sell-target');else if(target)(target.zone==='board'?this.board:this.bench).querySelectorAll('button')[target.index]?.classList.add('drop-target');}
 clearHover(){for(const root of [this.board,this.bench])root.querySelectorAll('.drop-target').forEach(b=>b.classList.remove('drop-target'));this.shop?.classList.remove('sell-target');}
 scrollLoop(){const d=this.drag;if(!d?.active)return;const h=window.innerHeight||800,delta=d.y<58?-12:d.y>h-58?12:0;if(delta){window.scrollBy?.(0,delta);this.paint();}this.scrollFrame=requestAnimationFrame(()=>this.scrollLoop());}
 movePointer(e){const d=this.drag;if(!d||d.id!==e.pointerId)return;d.x=e.clientX;d.y=e.clientY;if(Math.hypot(d.x-d.startX,d.y-d.startY)>8){d.moved=true;clearTimeout(this.hold);this.begin();}if(d.active){e.preventDefault();this.paint();}}
 up(e){
  const d=this.drag;if(!d||d.id!==e.pointerId)return;const dest=d.active?this.locate(e.clientX,e.clientY):null,active=d.active,inspecting=d.inspecting;this.release();
  if(!active&&!inspecting)return;this.blockClickUntil=Date.now()+650;e.preventDefault();
  if(active){if(this.canMove()&&this.getPiece(d.zone,d.index)?.uid===d.uid&&dest){if(dest.zone==='shop')this.sell({zone:d.zone,index:d.index});else this.drop({zone:d.zone,index:d.index},dest);}this.clearSelection();}
 }
 release(){const d=this.drag;this.drag=null;clearTimeout(this.hold);cancelAnimationFrame(this.scrollFrame);this.ghost.hidden=true;this.clearHover();this.onDragEnd?.();if(d?.active)try{d.host.releasePointerCapture(d.id);}catch{}}
 cancel(){if(!this.drag)return;const active=this.drag.active||this.drag.inspecting;this.release();if(active)this.blockClickUntil=Date.now()+650;this.clearSelection();}
 suppressClick(e){return e?.detail!==0&&Date.now()<this.blockClickUntil;}
}
window.ChessPlacement=Placement;
})();
