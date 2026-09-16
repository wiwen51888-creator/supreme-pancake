/* A landscape match owns all touch gestures, including the black side gutters.
   Restore the menu viewport exactly when leaving the match or rotating upright. */
(()=>{
 const landscape=window.matchMedia('(orientation:landscape)');
 let locked=false,restore=[];
 function lockDocument(doc){
  let viewport=doc.querySelector('meta[name="viewport"]');
  const created=!viewport;
  if(created){viewport=doc.createElement('meta');viewport.name='viewport';doc.head.append(viewport);}
  const previous=viewport.getAttribute('content');
  restore.push(()=>{if(created)viewport.remove();else if(previous===null)viewport.removeAttribute('content');else viewport.setAttribute('content',previous);});
  viewport.setAttribute('content','width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');
  for(const node of [doc.documentElement,doc.body]){
   if(!node)continue;
   for(const property of ['touch-action','overscroll-behavior']){
    const value=node.style.getPropertyValue(property),priority=node.style.getPropertyPriority(property);
    restore.push(()=>{if(value)node.style.setProperty(property,value,priority);else node.style.removeProperty(property);});
    node.style.setProperty(property,'none','important');
   }
  }
 }
 function sync(){
  const active=landscape.matches&&document.body.classList.contains('mobile-device')&&document.body.classList.contains('in-battle');
  if(active===locked)return;
  locked=active;
  if(!locked){for(const undo of restore.reverse())undo();restore=[];return;}
  // Sites embeds the game in a same-origin iframe; its outer viewport also needs the lock.
  let host=window;
  try{while(true){lockDocument(host.document);if(host===host.parent)break;host=host.parent;}}catch{/* A third-party parent cannot be changed from this frame. */}
 }
 function preserveNativeClick(target){
  if(target.closest?.('[data-direction]'))return false;
  return !!target.closest?.('button:not([data-hold]),a,input,select,textarea,summary,[contenteditable="true"],[role="button"]:not([data-hold])');
 }
 // Pointer Events still deliver every move/attack and release. Do not synthesize
 // clicks or clear other fingers here. Native pause/back/rematch buttons keep their clicks.
 document.addEventListener('touchend',event=>{
  if(locked&&!preserveNativeClick(event.target)&&event.cancelable)event.preventDefault();
 },{capture:true,passive:false});
 for(const type of ['dblclick','gesturestart','gesturechange','gestureend']){
  document.addEventListener(type,event=>{if(locked&&event.cancelable)event.preventDefault();},{capture:true,passive:false});
 }
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 landscape.addEventListener('change',sync);
 window.addEventListener('pageshow',sync);
 window.addEventListener('pagehide',()=>{for(const undo of restore.reverse())undo();restore=[];locked=false;});
 sync();
})();
