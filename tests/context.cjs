const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function load(from=root){const c={console};c.window=c;vm.createContext(c);for(const f of ['assets','roster','meme-roster','roster-revision3','turn-engine','turn-cast','turn-data','chess-data','chess-engine'])vm.runInContext(fs.readFileSync(path.join(from,f+'.js'),'utf8'),c);return c;}
function army(c,names,star=2){const ids=names.map(n=>typeof n==='number'?n:c.CHESS_ROSTER.find(x=>x.name===n)?.id);if(ids.some(id=>id==null))throw Error('Unknown character');return{board:Array.from({length:24},(_,i)=>{const n=[2,3,8,9,14,15,20,21].indexOf(i);return n>=0&&n<ids.length?{uid:n+1,id:ids[n],star}:null;})};}
module.exports={load,army,root};
if(require.main===module){const c=load();for(const x of c.CHESS_ROSTER)console.log([x.name,x.cost,x.role,x.bonds.length,x.skill.name,x.skill.target,x.skill.area,x.skill.power?'攻':x.skill.heal?'疗':x.skill.grantEnergy?'能':'盾',x.skill.form||'',x.skill.selfHeal||'',x.skill.teamHeal||''].join(' | '));}
