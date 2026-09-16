const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {makeHarness,flush}=require('./ui-fixture.cjs');
let checks=0;const ok=(x,m)=>{assert(x,m);checks++;};
async function until(h,promise){let done=false,error;promise.then(()=>done=true,e=>{error=e;done=true;});for(let i=0;i<200&&!done;i++){for(const [id,fn]of [...h.raf]){h.raf.delete(id);fn(i*16);}for(const [id,fn]of [...h.timers]){h.timers.delete(id);fn();}await flush();}if(error)throw error;ok(done,'async action settled');}
(async()=>{const h=makeHarness(),{$,hook,ctx,saved}=h;await flush();
ok(!$('title-screen').hidden&&$('game-screen').hidden,'opens on title');ok($('title-continue').disabled,'fresh continue disabled');ok(saved.size===0,'viewing menu does not overwrite a save');ok($('board-options').children.length===6,'six boards');
$('board-options').children[4].onclick();ok(hook.state.stage.id==='ocean','menu selection updates actual board');ok(saved.size===0,'theme preview does not create new game');
$('title-new').onclick();await flush();ok(hook.state.inGame&&!$('game-screen').hidden&&$('title-screen').hidden,'start enters board');ok(saved.size===1,'new run saves');
const p=hook.state.game.player();for(let i=0;i<5;i++)if(p.shop[i]!=null)hook.state.game.buy(i);hook.refresh();await until(h,$('auto-place').onclick());ok(hook.state.game.field(p).length>0,'buy and auto-place');
hook.save();const old=JSON.stringify(hook.state.game.state());hook.showTitle();ok(!hook.state.inGame&&$('game-screen').hidden,'back to title');ok(!$('title-continue').disabled,'continue active match');$('title-continue').onclick();ok(JSON.stringify(hook.state.game.state())===old,'continue preserves full state');
await until(h,hook.start());ok(hook.state.game.phase==='battle'&&!!hook.state.battle,'battle assets load and combat begins');hook.setPaused(false);hook.showTitle();const t=hook.state.battle.time;hook.frame(1000);ok(hook.state.battle.time===t,'battle frozen behind title');$('title-continue').onclick();ok(!hook.state.paused,'explicit continue resumes battle');
hook.state.battle.run();hook.finish();ok(['results','done'].includes(hook.state.game.phase),'first battle settles');ok(!/异常|未能加载/.test(hook.state.lastStatus),'no settlement error');if(hook.state.game.phase==='results'){$('next-round').onclick();ok(hook.state.game.round===2&&hook.state.game.phase==='prep','next round remains playable');}
hook.showTitle();$('title-new').onclick();ok($('new-dialog').open,'overwrite confirmation for existing progress');$('new-cancel').onclick();ok(hook.state.game.round===2,'cancel preserves progress');
const restored=makeHarness(saved);await flush();ok(!restored.$('title-continue').disabled,'saved game shown on fresh page');restored.$('title-continue').onclick();ok(restored.hook.state.game.round===2&&restored.hook.state.inGame,'reload then continue');
restored.hook.showTitle();restored.$('title-new').onclick();restored.$('new-confirm').onclick();ok(restored.hook.state.game.round===1&&restored.hook.state.inGame,'confirmed new run enters fresh board');
for(const image of h.imageRequests)ok(fs.existsSync(path.join(__dirname,'..',image.url)),'image exists '+image.url);
const html=fs.readFileSync(path.join(__dirname,'../chess.html'),'utf8');ok(!html.includes('三黄需')&&!ctx.CHESS_RULES.lightweightText.includes('主要羁绊'),'requested text removed');ok(ctx.CHESS_RELATIONSHIPS.some(g=>g.name==='三黄'),'bond retained');
console.log('Start, save, first battle, next round, boards and assets passed:',checks);
})().catch(e=>{console.error(e);process.exitCode=1;});
