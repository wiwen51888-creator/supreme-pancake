const assert=require('assert/strict'),fs=require('fs'),{makeHarness,flush,deferred}=require('./ui-fixture.cjs');
const plain=v=>JSON.parse(JSON.stringify(v)),key='abstract-autochess-run-v1';
(async()=>{
const h=makeHarness();await flush();
assert.equal(h.hook.titleRenderer.prep.length,0,'fresh page has no random pieces');
assert(h.$('title-continue').disabled);assert.equal(h.saved.size,0);
assert.equal(h.ctx.ChessBoards.images.size,6,'all scenic backgrounds preloaded');
assert.equal(h.imageRequests.length,6,'fresh title loads scenery only');
for(const theme of h.ctx.ChessBoards.themes){h.$('stage-select').value=theme.id;await h.hook.chooseStage();assert.equal(h.hook.state.stage.id,theme.id);assert.equal(h.hook.titleRenderer.theme.id,theme.id);assert.equal(h.hook.renderer.theme.id,theme.id);assert(fs.existsSync(__dirname+'/../'+theme.file));}
const t=new h.ctx.AbstractChess.Tournament(712819);t.bot(0);const player=t.player();assert(t.field(player).length>0);
// Deliberately asymmetric positions verify that saved arrangement is preserved.
const units=player.board.filter(Boolean);player.board.fill(null);[0,5,12,23].slice(0,units.length).forEach((cell,i)=>player.board[cell]=units[i]);
const saved=new Map([[key,JSON.stringify({state:t.state(),stageChoice:'forest'})]]),before=saved.get(key),r=makeHarness(saved);await flush();
assert(!r.$('title-continue').disabled);assert.equal(saved.get(key),before,'preview never overwrites save');
const expected=player.board.flatMap((u,i)=>u?[{id:u.id,uid:u.uid,star:u.star,x:i%6,y:4+Math.floor(i/6)}]:[]);
const preview=()=>plain(r.hook.titleRenderer.prep.map(({id,uid,star,x,y})=>({id,uid,star,x,y})));
assert.deepEqual(preview(),plain(expected));assert.equal(r.hook.titleRenderer.prep.filter(u=>u.side!==0).length,0,'no random opponent on menu');
assert.equal(r.$('title-caption').textContent,'你的存档阵容 · 第 1 轮');
r.$('title-continue').onclick();await flush();assert.equal(JSON.stringify(r.hook.state.game.state()),JSON.stringify(t.state()),'continue restores exact tournament');
r.hook.showTitle();assert.deepEqual(preview(),plain(expected));
r.hook.state.game.phase='done';r.hook.state.game.result={rank:1};r.hook.showTitle();assert(r.$('title-continue').disabled);assert.equal(preview().length,0,'finished tournament has no resumable lineup');
const ended=makeHarness(saved);await flush();assert(ended.$('title-continue').disabled);assert.equal(ended.hook.titleRenderer.prep.length,0);
for(let i=0;i<24;i++){const p=h.hook.renderer.home({x:i%6,y:4+Math.floor(i/6)});assert.equal(p.x,250+(i%6+.5)*100);assert.equal(p.y,368+(Math.floor(i/6)+.5)*62);}
// A delayed old request must not replace the player's newer selection.
const a=deferred(),b=deferred(),original=h.ctx.ChessBoards.load;h.ctx.ChessBoards.load=theme=>theme.id==='snow'?a.promise:b.promise;
h.$('stage-select').value='snow';const old=h.hook.chooseStage();h.$('stage-select').value='cyber';const current=h.hook.chooseStage();b.resolve({});await current;a.reject(Error('old load failed'));await old;
assert.equal(h.hook.state.stage.id,'cyber');assert(!h.hook.state.lastStatus.includes('未能载入'));h.ctx.ChessBoards.load=original;
console.log('Empty/saved/completed title, exact lineup and positions, six images, 24 cell centers, and async selection passed');
})().catch(e=>{console.error(e);process.exitCode=1});
