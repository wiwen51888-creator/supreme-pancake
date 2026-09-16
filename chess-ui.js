(()=>{
'use strict';
const $=id=>document.getElementById(id),h=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),key=document.body.dataset.standalone==='true'?'abstract-chess-standalone-run-v1':'abstract-autochess-run-v1';
const {Tournament,Combat,bonds}=AbstractChess,art=new TurnArt(),renderer=new ChessRenderer($('chess-board'),art),colors=['#abbec2','#91d4a4','#83b9f5','#c7a3f1','#f2cb78'];let audioContext=null;
const music=new ModeMusic({mode:'chess',volume:.25,getContext:()=>{try{return audioContext||(audioContext=new(window.AudioContext||window.webkitAudioContext)());}catch{return null;}}});
let game=new Tournament(),selected=null,inspected=null,scoutId=1,stage=null,stageTicket=0,battle=null,pair=null,busy=false,paused=false,speed=1,focused=true,muted=false,ticket=0,frameLast=0,visualTime=0,accumulator=0,casting=0,seenCasts=new Set(),previewJobs=0,previewQueue=[],previews=new Map(),lastStatus='',loadedSave=null;
let inGame=false,hasStarted=false;
const titleRenderer=new ChessRenderer($('title-board'),art);titleRenderer.showcase=true;
function titleSave(){const saved=hasStarted?{t:game}:loadedSave||stored();return saved&&saved.t.phase!=='done'?saved:null;}
function loadTitleArt(){const saved=titleSave(),p=saved?.t.player();titleRenderer.setPrep(p||{board:Array(24).fill(null)},null);if(p)for(const piece of saved.t.field(p))art.character(CHESS_BY_ID.get(piece.id)).catch(()=>{});}
function titleState(){const saved=titleSave();$('title-continue').disabled=!saved;$('save-hint').textContent=saved?'已保存 · 第 '+saved.t.round+' 轮 · 可继续赛事':'进度自动保存在当前浏览器';$('title-caption').textContent=saved?'你的存档阵容 · 第 '+saved.t.round+' 轮':'60 名角色 · 三合一升星';loadTitleArt();}
function showGame(){inGame=true;hasStarted=true;document.body.dataset.screen='game';$('title-screen').hidden=true;$('game-screen').hidden=false;$('game-screen').inert=false;if(paused)setPaused(false);refresh();window.scrollTo({top:0});}
function showTitle(){if(busy)return;placement.cancel();closeInfo();closeBondInfo();if(game.phase==='battle')setPaused(true);save();inGame=false;document.body.dataset.screen='title';$('game-screen').hidden=true;$('game-screen').inert=true;$('title-screen').hidden=false;loadTitleArt();titleState();syncMusic();window.scrollTo({top:0});}
$('back-title').onclick=showTitle;$('brand-home').onclick=showTitle;
$('title-new').onclick=()=>{if(hasStarted||loadedSave||stored())newDialog();else{hasStarted=true;reset();showGame();}};
$('title-continue').onclick=()=>{if(!hasStarted){$('resume').onclick();hasStarted=true;}showGame();};
const startButtons=[$('start-battle'),$('start-battle-top')];
const mobilePanels=window.matchMedia?.('(max-width:760px), (pointer:coarse)').matches??false;
for(const id of ['bonds-panel','standings-panel']){const panel=$(id);panel.open=!mobilePanels;const hint=()=>{panel.querySelector('.fold-hint').textContent=panel.open?'点击折叠':'点击展开';};panel.addEventListener('toggle',hint);hint();}
function closeBondInfo(){if($('bond-help').open)$('bond-help').close();}
function openBondInfo(key){
 const rule=CHESS_RULES.traits[key];if(!rule)return;placement.cancel();closeInfo();if(game.phase==='battle')setPaused(true);
 const p=game.player(),field=new Set(game.field(p).map(u=>u.id)),bench=new Set(p.bench.filter(Boolean).map(u=>u.id));
 const members=CHESS_ROSTER.filter(c=>rule.relationship?rule.members.includes(c.name):c.role===key),present=members.filter(c=>field.has(c.id)),missing=members.filter(c=>!field.has(c.id)),next=rule.steps.find(n=>n>present.length);
 const chips=(list,active)=>list.length?'<div class="bond-members">'+list.map(c=>'<span class="bond-member '+(active?'present':bench.has(c.id)?'benched':'missing')+'"><b>'+h(c.name)+'</b><small>'+(active?'已上阵':bench.has(c.id)?'候补席 · 未上阵':'未拥有')+'</small></span>').join('')+'</div>':'<p class="bond-empty">'+(active?'暂未上阵该羁绊的角色。':'全员已上阵。')+'</p>';
 $('bond-help-title').textContent=key;
 $('bond-help-body').innerHTML='<p class="bond-progress">已上阵 '+present.length+' 名不同角色 · '+(next?'还需 '+(next-present.length)+' 名激活'+(rule.steps.some(n=>n<=present.length)?'下一档':''):'已达到最高档')+'</p><p>'+h(rule.text)+'</p><h3>已上阵（'+present.length+'）</h3>'+chips(present,true)+'<h3>未上阵（'+missing.length+'）</h3>'+chips(missing,false)+'<p class="bond-note">候补席不计入羁绊，同名角色只计一次。'+(rule.category==='pair'||rule.category==='theme'?h(CHESS_RULES.lightweightText):'')+'</p>';
 $('bond-help').showModal();
}
$('bond-help-close').onclick=closeBondInfo;
function status(text){lastStatus=text;$('status').textContent=text;}
const afterPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
function stored(){try{const value=JSON.parse(localStorage.getItem(key));if(!value)return null;const t=Tournament.restore(value.state);return {t,stageChoice:value.stageChoice||'random'};}catch{return null;}}
function save(){if(!hasStarted)return;if(game.phase!=='prep'&&game.phase!=='done')return;try{game.assert();localStorage.setItem(key,JSON.stringify({state:game.state(),stageChoice:$('stage-select').value}));}catch{status('本次游戏可继续；浏览器暂时无法保存进度。');}}
function syncMusic(){music.setMuted(muted);music.setPaused(document.hidden||!focused||(inGame&&paused));const song=!inGame?'shop':game.phase==='battle'?(game.round>=10||game.players.filter(p=>p.alive).length<=3?'late':'battle'):game.phase==='done'&&game.result.rank<=3?'victory':'shop';music.play(song);$('track-title').textContent=ModeMusic.compile('chess',song).title;}
function unlock(){music.unlock().then(syncMusic).catch(()=>{});}document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
$('music-toggle').onclick=()=>{muted=!muted;$('music-toggle').textContent=muted?'音乐关':'音乐开';syncMusic();};$('music-volume').oninput=e=>music.setVolume(+e.target.value/100);
function setPaused(value){paused=!!value;$('pause').textContent=paused?'继续':'暂停';$('pause-cover').hidden=!paused||game.phase!=='battle';syncMusic();}
$('pause').onclick=()=>setPaused(!paused);$('resume-battle').onclick=()=>{if(game.phase==='battle'&&paused)setPaused(false);};$('speed').onclick=()=>{speed=speed%3+1;$('speed').textContent=speed+'×';};
window.addEventListener('blur',()=>{focused=false;if(game.phase==='battle')setPaused(true);else syncMusic();});window.addEventListener('focus',()=>{focused=true;syncMusic();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.phase==='battle')setPaused(true);else syncMusic();});window.addEventListener('pagehide',()=>{if(game.phase==='battle')setPaused(true);music.stop();});window.addEventListener('pageshow',()=>{focused=document.hasFocus?.()??true;syncMusic();});
function queuePreview(canvas,c,animate=false,firstFrame=false){
 const job={canvas,c,animate,firstFrame};previews.set(canvas,job);
 if(firstFrame&&art.ready(c)){art.preview(canvas,c,0);return;}
 previewQueue.push(job);pumpPreview();
}
function pumpPreview(){while(previewJobs<2&&previewQueue.length){const job=previewQueue.shift(),{canvas,c,firstFrame}=job;if(!canvas.isConnected){previews.delete(canvas);continue;}previewJobs++;art.character(c).then(()=>{if(canvas.isConnected&&previews.get(canvas)===job)art.preview(canvas,c,firstFrame?0:visualTime);}).catch(()=>{if(canvas.isConnected)canvas.setAttribute('aria-label',c.name+'，图片载入中');}).finally(()=>{previewJobs--;pumpPreview();});}}
function prepAssets(){if(game.phase!=='prep')return;const ids=new Set([...game.field(game.player()),...game.field(game.player(scoutId))].map(u=>u.id));for(const id of ids)art.character(CHESS_BY_ID.get(id)).catch(()=>{});for(const u of game.all(game.player()))ids.add(u.id);for(const id of game.player().shop)if(id!=null)ids.add(id);if(inspected)ids.add(inspected.id);art.trim(ids);}
async function chooseStage(){const serial=++stageTicket;const choice=$('stage-select').value,pool=ChessBoards.themes.filter(t=>t.id!==stage?.id);stage=ChessBoards.themes.find(t=>t.id===choice)||pool[Math.floor(Math.random()*pool.length)];renderer.theme=stage;titleRenderer.theme=stage;$('board-title').textContent=(choice==='random'?'随机 · ':'')+stage.name;for(const button of $('board-options').children)button.setAttribute('aria-pressed',String(button.dataset.board===choice));$('board-random').setAttribute('aria-pressed',String(choice==='random'));try{await ChessBoards.load(stage,url=>art.image(url));if(serial!==stageTicket)return;}catch{if(serial===stageTicket)status('棋盘背景未能载入，请重新选择棋盘重试。');}}
for(const theme of ChessBoards.themes){const option=document.createElement('option');option.value=theme.id;option.textContent=theme.name;$('stage-select').append(option);const button=document.createElement('button');button.dataset.board=theme.id;button.setAttribute('aria-pressed','false');button.innerHTML='<canvas width="220" height="148" aria-hidden="true"></canvas><span>'+theme.name+'</span>';ChessBoards.draw(button.querySelector('canvas').getContext('2d'),theme,220,148);ChessBoards.load(theme,url=>art.image(url)).then(()=>ChessBoards.draw(button.querySelector('canvas').getContext('2d'),theme,220,148)).catch(()=>{});button.onclick=()=>{$('stage-select').value=theme.id;chooseStage();save();};$('board-options').append(button);}
$('board-random').onclick=()=>{$('stage-select').value='random';chooseStage();save();};$('stage-select').onchange=()=>{chooseStage();save();};
function inspect(c,piece=null){inspected=c;$('inspect-name').textContent=c.name+(piece?' '+'★'.repeat(piece.star):'');$('inspect-cost').textContent=c.cost+' 金 · '+(piece?piece.star+' 星':'一星');$('inspect-traits').textContent=[...c.bonds,c.role].join(' · ');const mult=CHESS_RULES.stars[(piece?.star||1)-1];$('inspect-stats').innerHTML=[['生命',Math.round(c.hp*mult)],['攻击',Math.round(c.attack*mult)],['射程',c.range>=2.7?'远程':c.range>1?'中程':'近战']].map(([n,v])=>`<span>${n}<b>${v}</b></span>`).join('');$('inspect-skill').textContent=c.skill.name;$('inspect-desc').textContent=c.skill.desc;const held=game.players.filter(p=>p.id!==0).reduce((n,p)=>n+game.all(p).filter(u=>u.id===c.id).reduce((a,u)=>a+3**(u.star-1),0),0);$('inspect-pool').textContent='池中剩余 '+game.pool[c.id]+' 张 · 其他棋手持有 '+held+' 张。商店展示的卡已预留，不计入池中。';queuePreview($('inspect-art'),c,false,true);updateSelection();}
function closeInfo(){$('unit-popover').hidden=true;}
function openInfo(c,piece=null,point=null){
 inspect(c,piece);const pop=$('unit-popover');pop.hidden=false;
 if(piece?.maxHp){$('inspect-stats').innerHTML=[['生命',Math.ceil(piece.hp)+' / '+piece.maxHp],['能量',Math.round(piece.mana)+' / 100'],['攻击',Math.round(piece.attack)]].map(([n,v])=>`<span>${n}<b>${v}</b></span>`).join('');}
 const w=pop.getBoundingClientRect().width||280,height=pop.getBoundingClientRect().height||330,vw=window.innerWidth||390,vh=window.innerHeight||800,x=point?.x??vw/2,y=point?.y??vh/2;
 pop.style.left=Math.max(8,Math.min(vw-w-8,x-w/2))+'px';pop.style.top=Math.max(8,Math.min(vh-height-8,y-height-18))+'px';
}
$('inspect-close').onclick=closeInfo;
document.addEventListener('pointerdown',e=>{if(!$('unit-popover').hidden&&!$('unit-popover').contains(e.target))closeInfo();},{capture:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeInfo();});window.addEventListener('resize',closeInfo);
function sellPlacement(from){if(!from||game.phase!=='prep'||busy)return;const piece=game.player()[from.zone]?.[from.index];if(!piece)return;const amount=game.sellPrice(piece),name=CHESS_BY_ID.get(piece.id).name;if(game.sell(from.zone,from.index)){selected=null;closeInfo();refresh();save();status(name+' 已出售，获得 '+amount+' 金。');}}
function updateSelection(){const u=selected?game.player()[selected.zone][selected.index]:null;if(!u)selected=null;renderer.selected=u?.uid??null;$('sell').hidden=!u||game.phase!=='prep';$('deselect').hidden=!u;$('sell').textContent=u?'出售 · +'+game.sellPrice(u)+' 金':'';$('deploy-grid').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('selected',selected?.zone==='board'&&selected.index===i));$('bench').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',selected?.zone==='bench'&&selected.index===i));}
function pick(zone,index){if(game.phase!=='prep'||busy)return;const p=game.player(),u=p[zone][index];if(selected){if(selected.zone===zone&&selected.index===index){selected=null;updateSelection();return;}if(game.move(selected.zone,selected.index,zone,index)){selected=null;const moved=p[zone][index];refresh();inspect(CHESS_BY_ID.get(moved.id),moved);save();status('站位已调整。');}else status('人口已满：请先升级人口，或与场上棋子交换。');}else if(u){selected={zone,index};inspect(CHESS_BY_ID.get(u.id),u);updateSelection();}}
for(let i=0;i<24;i++){const b=document.createElement('button');b.setAttribute('aria-label','部署至第 '+(Math.floor(i/6)+1)+' 排第 '+(i%6+1)+' 列');b.dataset.index=i;b.onclick=e=>{if(!placement.suppressClick(e))pick('board',i);};$('deploy-grid').append(b);}
const placement=new ChessPlacement({
 board:$('deploy-grid'),bench:$('bench'),shop:$('shop'),arena:$('chess-board'),ghost:$('drag-piece'),canMove:()=>inGame&&game.phase==='prep'&&!busy&&!$('new-dialog').open&&!$('help').open&&!$('bond-help').open,
 canInspect:()=>!$('new-dialog').open&&!$('help').open&&!$('bond-help').open,
 getPiece:(zone,index)=>zone==='shop'?(game.player().shop[index]!=null?{id:game.player().shop[index],star:1,uid:'shop:'+index+':'+game.player().shop[index]}:null):zone==='arena'?(renderer.battle?.units||renderer.prep)[index]:game.player()[zone]?.[index],
 pickAt:e=>{const rect=$('chess-board').getBoundingClientRect(),x=(e.clientX-rect.left)*1100/rect.width,y=(e.clientY-rect.top)*740/rect.height,units=renderer.battle?.units||renderer.prep;return units.map((u,i)=>({u,i,p:renderer.pose(u)})).sort((a,b)=>b.p.y-a.p.y).find(({p})=>Math.abs(x-p.x)<60&&y>p.y-140&&y<p.y+30)?.i??null;},
 showInfo:(piece,point)=>openInfo(CHESS_BY_ID.get(piece.id),piece,point),hideInfo:closeInfo,sell:sellPlacement,
 onDrag:piece=>{$('sell-hint').hidden=false;$('sell-hint').textContent='松手出售 '+CHESS_BY_ID.get(piece.id).name+' · +'+game.sellPrice(piece)+' 金';},onDragEnd:()=>{$('sell-hint').hidden=true;},preview:(canvas,piece)=>art.preview(canvas,CHESS_BY_ID.get(piece.id),0),
 clearSelection:()=>{selected=null;updateSelection();},
 drop:(from,to)=>{const ok=game.move(from.zone,from.index,to.zone,to.index);selected=null;if(ok){const piece=game.player()[to.zone][to.index];refresh();inspect(CHESS_BY_ID.get(piece.id),piece);save();status('棋子已放下，可直接选择下一名角色。');}else status('人口已满，请先增加人口或放入候补席。');}
});
$('deselect').onclick=()=>{selected=null;updateSelection();};$('sell').onclick=()=>sellPlacement(selected);
function transact(fn,message){if(busy||game.phase!=='prep')return;const before=game.all(game.player()).map(u=>[u.uid,u.star]),ok=fn();if(ok){const upgrades=game.all(game.player()).filter(u=>u.star>1&&!before.some(([id,star])=>id===u.uid&&star===u.star));refresh();save();status(upgrades.length?upgrades.map(u=>CHESS_BY_ID.get(u.id).name+' 升至 '+'★'.repeat(u.star)).join('，')+'！':(typeof message==='function'?message():message));}else status('金币不足或候补席已满；可以出售棋子腾出空间。');}
$('buy-xp').onclick=()=>transact(()=>game.xp(),'经验 +4，达到升级要求会自动增加人口。');$('refresh-shop').onclick=()=>transact(()=>game.refresh(),'商店已刷新。');$('lock-shop').onclick=()=>{if(game.phase!=='prep'||busy)return;game.lock();refresh();save();status(game.player().locked?'已锁定，下一轮保留当前未购买的卡。':'已解锁，下一轮免费刷新。');};$('auto-place').onclick=async()=>{
 if(busy||game.phase!=='prep')return;const serial=ticket;busy=true;status('正在综合比较角色、羁绊与站位…');refresh();await afterPaint();if(serial!==ticket)return;
 try{const result=game.arrange(game.player()),main=result.relationships.slice(0,3);selected=null;busy=false;refresh();save();status('已综合角色强度、实际羁绊与承伤分工布阵'+(main.length?'：'+main.join('、'):'')+'。可继续手动调整站位。');}
 catch{busy=false;refresh();status('布阵未完成，请重试；持有棋子保持不变。');}
};
const shopIdentity=Array(5).fill(undefined);
function renderShop(p,prep){
 const root=$('shop');if(root.children.length!==5){root.innerHTML=Array.from({length:5},()=>'<article class="shop-card"></article>').join('');shopIdentity.fill(undefined);}
 [...root.children].forEach((card,index)=>{
  const id=p.shop[index],c=CHESS_BY_ID.get(id);
  if(shopIdentity[index]!==id){shopIdentity[index]=id;
   card.classList.toggle('shop-empty',id==null);card.classList.toggle('shop-card',id!=null);
   if(id==null){card.innerHTML='已购入<br>下轮换新';return;}
   card.setAttribute('style','--tier:'+colors[c.cost-1]);card.innerHTML=`<button class="buy" data-slot="${index}" data-index="${index}" aria-label="购买${h(c.name)}，${c.cost}金币"><span class="cost">${c.cost} 金</span><canvas width="150" height="150"></canvas><strong>${h(c.name)}</strong><span class="tag"></span><span class="copies"></span></button><button class="info" data-id="${id}">资料</button>`;
   const buy=card.querySelector('.buy');queuePreview(buy.querySelector('canvas'),c,false,true);buy.onclick=e=>{if(!placement.suppressClick(e))transact(()=>game.buy(index),c.name+' 已加入候补席。');};
   card.querySelector('.info').onclick=e=>{const r=e.currentTarget?.getBoundingClientRect?.()||card.getBoundingClientRect();openInfo(c,null,{x:r.left+r.width/2,y:r.top});};
  }
  if(c){card.querySelector('.buy').disabled=!prep||p.gold<c.cost;card.querySelector('.tag').textContent=(c.bonds[0]||c.role)+' · '+c.role;const copies=game.all(p).filter(u=>u.id===id).reduce((n,u)=>n+3**(u.star-1),0);card.querySelector('.copies').textContent=(copies?'已持 '+copies+' 张 · ':'')+'池余 '+game.pool[id];}
 });
}
function refresh(){if(game.phase!=='battle')$('battle-banner').textContent='';const p=game.player(),prep=game.phase==='prep'&&!busy;$('round-label').textContent='第 '+game.round+' / 24 轮';$('phase-label').textContent={prep:'准备阶段',battle:'自动交战',results:'战后结算',done:'赛事结束'}[game.phase];$('hp').textContent=Math.max(0,p.hp);$('gold').textContent=p.gold;$('gold-shop').textContent=p.gold;$('population').textContent=game.field(p).length+' / '+p.level;$('xp-bar').querySelector('i').style.width=(p.level===8?100:p.xp/CHESS_RULES.xp[p.level]*100)+'%';$('xp-label').textContent=p.level===8?'最高人口 8':'Lv.'+p.level+' · '+p.xp+' / '+CHESS_RULES.xp[p.level]+' 经验';$('buy-xp').disabled=!prep||p.gold<4||p.level===8;$('interest').textContent='当前利息 +'+Math.min(3,Math.floor(p.gold/10))+' 金 · 每 10 金 +1，最多 +3';
 const bs=bonds(p.board).sort((a,b)=>Number(b.level>0)-Number(a.level>0)||b.level-a.level||Number(!!b.relationship)-Number(!!a.relationship)||b.count-a.count);

 const card=b=>{const next=b.steps.find(n=>n>b.count);return '<button class="bond '+(b.level?'':'off')+'" data-bond="'+h(b.key)+'" aria-haspopup="dialog"><b>'+h(b.key)+' '+b.count+'/'+(next||b.steps.at(-1))+'</b><small>'+(b.relationship?(next?'距'+(b.level?'下一档':'激活')+'还差 '+(next-b.count)+' 名角色':'完整羁绊已成型'):h(b.text))+'</small></button>';};
 $('bonds').innerHTML=bs.length?bs.map(card).join(''):'<span class="bond off">先上阵，再激活羁绊。</span>';
 $('bonds').querySelectorAll('button[data-bond]').forEach(button=>button.onclick=()=>openBondInfo(button.dataset.bond));
 $('bonds-peek').textContent=bs.length?bs.slice(0,2).map(b=>b.key+' '+b.count+'/'+(b.steps.find(n=>n>b.count)||b.steps.at(-1))).join(' · '):'先上阵，再激活羁绊。';
 $('standings-peek').textContent='你 · '+Math.max(0,p.hp)+' 生命 · Lv.'+p.level+' · '+game.players.filter(x=>x.alive).length+' 人存活';
 $('standings').innerHTML=[...game.players].sort((a,b)=>Number(b.alive)-Number(a.alive)||b.hp-a.hp).map(x=>`<div class="standing ${x.id===0?'me':''} ${x.alive?'':'out'}"><span>${h(x.name)}${x.id===0?' · 你':''}<small>${x.alive?' · Lv.'+x.level:' · 第'+x.rank+'名'}</small></span><i>${Math.max(0,x.hp)} ♥</i></div>`).join('');
 $('scout').innerHTML=game.players.filter(x=>x.id!==0&&x.alive).map(x=>`<option value="${x.id}">${h(x.name)}</option>`).join('');if(!game.player(scoutId)?.alive)scoutId=game.players.find(x=>x.id!==0&&x.alive)?.id||1;$('scout').value=scoutId;$('scout').disabled=!prep;$('stage-select').disabled=game.phase==='battle'||busy;
 $('bench-count').textContent=p.bench.filter(Boolean).length+' / 9';$('bench').innerHTML=p.bench.map((u,i)=>u?`<button aria-label="${h(CHESS_BY_ID.get(u.id).name)} ${u.star} 星候补" data-index="${i}"><span class="stars">${'★'.repeat(u.star)}</span><canvas width="100" height="90"></canvas><b>${h(CHESS_BY_ID.get(u.id).name)}</b></button>`:`<button class="empty" aria-label="候补空位 ${i+1}" data-index="${i}">＋</button>`).join('');$('bench').querySelectorAll('button').forEach((b,i)=>{b.disabled=!prep;b.onclick=e=>{if(!placement.suppressClick(e))pick('bench',i);};if(p.bench[i])queuePreview(b.querySelector('canvas'),CHESS_BY_ID.get(p.bench[i].id),false,true);});
 $('odds').innerHTML=CHESS_RULES.odds[p.level].map((n,i)=>`<span style="color:${colors[i]}">${i+1} 费 ${n}%</span>`).join('');renderShop(p,prep);
 $('lock-shop').disabled=!prep;$('lock-shop').textContent=p.locked?'已锁定':'锁定';$('lock-shop').setAttribute('aria-pressed',String(p.locked));$('lock-shop').classList.toggle('active',p.locked);$('refresh-shop').disabled=!prep||p.gold<2;$('auto-place').disabled=!prep||!game.all(p).length;for(const button of startButtons){button.disabled=!prep||!game.field(p).length;button.hidden=!['prep','battle'].includes(game.phase);button.textContent=busy?'载入战斗素材…':game.phase==='battle'?'交战中…':'准备好了 · 开战 ↗';}$('pause').disabled=game.phase!=='battle';$('back-title').disabled=busy;$('brand-home').disabled=busy;$('deploy-grid').hidden=!prep;$('round-result').hidden=!['results','done'].includes(game.phase);if(game.phase==='prep')renderer.setPrep(p,game.player(scoutId));updateSelection();prepAssets();syncMusic();}
$('scout').onchange=()=>{scoutId=+$('scout').value;renderer.setPrep(game.player(),game.player(scoutId));prepAssets();};
async function start(){placement.cancel();closeInfo();closeBondInfo();if(busy||game.phase!=='prep')return;$('battle-banner').textContent='';save();const before=game.state(),serial=++ticket;busy=true;selected=null;status('棋手正在准备阵容…');refresh();try{await afterPaint();if(serial!==ticket)return;for(let id=1;id<8;id++){game.bot(id);await afterPaint();if(serial!==ticket)return;}status('棋子与招牌技能载入中…');const pairs=game.start({botsPrepared:true});if(!pairs){busy=false;refresh();return;}pair=pairs.find(x=>x.a===0||(!x.ghost&&x.b===0));const candidate=game.battle(pair);await art.battle(candidate.units);if(serial!==ticket)return;battle=candidate;renderer.battle=battle;busy=false;casting=0;seenCasts.clear();accumulator=0;$('scout-note').textContent='本轮对手：'+game.player(pair.a===0?pair.b:pair.a).name+(pair.ghost?' · 镜像':'');status('自动交战中；可以调整速度或暂停。');refresh();setPaused(document.hidden||!focused);$('chess-board').scrollIntoView({block:'center',behavior:'smooth'});}catch{if(serial!==ticket)return;game=Tournament.restore(before);battle=null;renderer.battle=null;busy=false;art.cancelBattle();refresh();status('战斗素材未能加载，进度已恢复。请点击开战重试。');}}
for(const button of startButtons)button.onclick=start;
function finish(){if(!battle?.done||game.phase!=='battle')return;try{const result=battle.result(),results=game.pairs.map(x=>x===pair?result:game.battle(x).run());game.settle(results);busy=false;paused=false;$('pause-cover').hidden=true;refresh();const ownSide=pair.a===0?0:1,won=result.winner===ownSide,draw=result.winner===-1;const income=game.player().income;$('result-title').textContent=game.phase==='done'?'本次赛事 · 第 '+game.result.rank+' 名':draw?'势均力敌 · 平局':won?'这一轮，拿下！':'调整阵容，再战一轮。';$('result-income').textContent=(income.damage?'本轮损失 '+income.damage+' 生命。':'本轮没有损失生命。')+(game.phase==='done'?'赛事结束。':`下一轮领取 ${income.total} 金：基础 ${income.base} + 胜利 ${income.win} + 利息 ${income.interest} + 连胜败 ${income.streak}。`);const stars=result.stats.filter(s=>s.side===ownSide).sort((a,b)=>b.damage+b.healed-a.damage-a.healed).slice(0,3);$('damage-summary').textContent=stars.map(s=>CHESS_BY_ID.get(s.id).name+' · 伤害 '+s.damage+' / 治疗 '+s.healed).join('　');$('next-round').hidden=game.phase==='done';$('new-run-result').hidden=game.phase!=='done';status(game.phase==='done'?'最终名次已保存。':'点击领取收益，进入下一轮准备。');$('round-result').scrollIntoView({block:'nearest',behavior:'smooth'});if(game.phase==='done')save();else{const checkpoint=Tournament.restore({...game.state(),phase:'prep'});checkpoint.phase='results';checkpoint.next();try{localStorage.setItem(key,JSON.stringify({state:checkpoint.state(),stageChoice:$('stage-select').value}));}catch{}}}catch(e){setPaused(true);status('结算出现异常，请刷新从开战前继续。');}}
$('next-round').onclick=()=>{if(!game.next())return;battle=null;pair=null;renderer.battle=null;selected=null;casting=0;seenCasts.clear();art.cancelBattle();refresh();save();chooseStage();status('商店已准备，收益已到账。');};
function reset(){placement.cancel();closeInfo();closeBondInfo();ticket++;art.cancelBattle();battle=null;pair=null;renderer.battle=null;busy=false;casting=0;paused=false;selected=null;inspected=null;seenCasts.clear();game=new Tournament();scoutId=1;$('pause-cover').hidden=true;$('scout-note').textContent='开战时随机配对';$('resume').hidden=true;loadedSave=null;refresh();save();chooseStage();status('新赛事开始！购买棋子后点“一键布阵”，也可以手动点选位置。');}
function newDialog(){placement.cancel();closeInfo();closeBondInfo();$('new-dialog').showModal();if(game.phase==='battle')setPaused(true);}$('new-run').onclick=newDialog;$('new-run-result').onclick=newDialog;$('new-cancel').onclick=()=>$('new-dialog').close();$('new-confirm').onclick=()=>{$('new-dialog').close();hasStarted=true;reset();showGame();};
$('resume').onclick=()=>{placement.cancel();const saved=loadedSave||stored();if(!saved)return;ticket++;art.cancelBattle();game=saved.t;battle=null;pair=null;renderer.battle=null;busy=false;paused=false;selected=null;casting=0;seenCasts.clear();$('stage-select').value=ChessBoards.themes.some(t=>t.id===saved.stageChoice)?saved.stageChoice:'random';$('resume').hidden=true;loadedSave=null;refresh();chooseStage();if(game.phase==='done'){$('result-title').textContent='上次赛事 · 第 '+game.result.rank+' 名';$('result-income').textContent='完成于第 '+game.round+' 轮。';$('next-round').hidden=true;$('new-run-result').hidden=false;}status('已恢复保存的赛事。');};
$('help-open').onclick=()=>{placement.cancel();if(game.phase==='battle')setPaused(true);$('help').showModal();};$('help-close').onclick=()=>$('help').close();$('codex').innerHTML='<h3>棋子图鉴 · 点击查看招牌技能</h3>'+[1,2,3,4,5].map(cost=>`<section><h3 style="color:${colors[cost-1]}">${cost} 费 · 每人共享 ${CHESS_RULES.pool[cost-1]} 张</h3>${CHESS_ROSTER.filter(c=>c.cost===cost).map(c=>`<button data-id="${c.id}">${h(c.name)}</button>`).join('')}</section>`).join('');$('codex').innerHTML+='<h3>关系与主题羁绊</h3><p>'+h(CHESS_RULES.lightweightText)+'</p>'+CHESS_RELATIONSHIPS.map(g=>`<section><h3>${h(g.name)} · ${g.steps.join(' / ')} 人</h3><p>${h(g.members.join(' · '))}</p><p>${h(g.text)}</p></section>`).join('');$('codex').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=null;$('help').close();openInfo(CHESS_BY_ID.get(+b.dataset.id));});
let soundedBattle=null;const soundedImpacts=new Set();
function playImpacts(){
 if(battle!==soundedBattle){soundedBattle=battle;soundedImpacts.clear();}
 if(!battle)return;let count=0;
 for(const e of battle.events){
  if(!['hit','spell'].includes(e.type)||soundedImpacts.has(e))continue;soundedImpacts.add(e);
  if(muted||paused||!audioContext||audioContext.state!=='running'||battle.time-e.time>.1||count++>=3)continue;
  try{const t=audioContext.currentTime,o=audioContext.createOscillator(),gain=audioContext.createGain(),heavy=e.type==='spell';o.type=heavy?'sawtooth':'triangle';o.frequency.setValueAtTime(heavy?170:280,t);o.frequency.exponentialRampToValueAtTime(heavy?42:85,t+.10);gain.gain.setValueAtTime(heavy?.035:.025,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.13);o.connect(gain).connect(audioContext.destination);o.start(t);o.stop(t+.15);o.onended=()=>{o.disconnect();gain.disconnect();};}catch{}
 }
}
const missingLoads=new Map();
renderer.onMissing=c=>{
 const now=performance.now();if(now-(missingLoads.get(c.id)??-10000)<2500)return;missingLoads.set(c.id,now);
 art.character(c,game.phase==='battle').catch(()=>{});
};
function frame(now){
 const dt=Math.min(.06,Math.max(0,(now-frameLast)/1000));frameLast=now;
 try{
  if(document.hidden)return;
  if(!paused)visualTime+=dt;
  if(inGame&&battle&&game.phase==='battle'&&!paused&&!busy&&!casting){
   accumulator+=dt*speed;let n=0;
   while(accumulator>=.05&&n++<6&&!battle.done){
    battle.step(.05);accumulator-=.05;
    const casts=battle.events.filter(e=>e.type==='cast'&&!seenCasts.has(e));
    for(const event of casts){
     seenCasts.add(event);$('battle-banner').textContent=CHESS_BY_ID.get(battle.unit(event.actor).id).name+' · '+event.name;
     if(event.origin!==battle.unit(event.actor).id){const serial=ticket;casting++;
      art.skill(event.skill,event.origin).catch(()=>{if(serial===ticket)status('模仿素材载入失败，本次使用角色本体动画。');}).finally(()=>{if(serial===ticket)casting=Math.max(0,casting-1);});
     }
    }
    if(casting)break;
   }
   if(battle.done)finish();
  }
  if(battle&&game.phase==='battle'){const latest=battle.events.filter(e=>e.type==='cast').at(-1);if(!latest||battle.time-latest.time>1.2)$('battle-banner').textContent='';}
  if(inGame){playImpacts();renderer.draw(visualTime,battle?.done?1:accumulator/.05);}else titleRenderer.draw(now/1000);
  for(const [canvas,p] of previews){
   if(!canvas.isConnected){previews.delete(canvas);continue;}
   if(p.animate){try{art.preview(canvas,p.c,visualTime);}catch{}}
  }
 }catch{
  if(game.phase==='battle'){setPaused(true);status('战斗已暂停，请点击继续重试。');}
 }finally{requestAnimationFrame(frame);}
}
loadedSave=stored();$('resume').hidden=true;if(loadedSave&&ChessBoards.themes.some(t=>t.id===loadedSave.stageChoice))$('stage-select').value=loadedSave.stageChoice;chooseStage();loadTitleArt();titleState();syncMusic();requestAnimationFrame(frame);
})();
