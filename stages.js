/* Each match chooses one arena; rounds retain it, random rematches draw again. */
(()=>{
 const definitions=[
  ['arcade','荒诞街区','原有场景','霓虹街机厅前的老街区','#d8ff62','assets/stage.png'],
  ['shanghai','上海霓虹外滩','世界 · 中国','江畔灯火与城市天际线','#69dbed'],
  ['paris','巴黎塞纳河桥','世界 · 法国','蓝调暮色中的河岸与铁塔','#ebb676'],
  ['rio','里约落日海湾','世界 · 巴西','面包山、海湾与落日步道','#f7b765'],
  ['cairo','开罗遗迹','世界 · 埃及','沙漠落日下的古老石台','#e7c277'],
  ['blocklands','方块晨曦草原','角色 · 闹吃 / 古振兴','方块树林与清晨冒险','#b4e57a'],
  ['sharkhall','脆鲨水族馆','角色 · 七海','鲨鱼与珊瑚后的蓝色水世界','#74e0ef'],
  ['livehouse','蓝蔷薇音乐厅','角色 · 乐队组','蓝蔷薇、乐器与舞台聚光灯','#98baff'],
  ['streamroof','抽象直播天台','角色 · 主播组','霓虹直播间与屋顶夜空','#eb91cb'],
  ['cybernightmarket','霓虹夜市擂台','','','#efb587'],
  ['snowtemple','雪山汤泉神社','','','#afd2f2'],
  ['skyboard','云海浮空棋庭','','','#c1c2ff'],
  ['blockgarden','方块温室竞技场','','','#b7d797']
 ];
 window.STAGES=definitions.map(([id,name,category,description,color,file])=>({id,name,category,description,color,file:file||'stages/'+id+'.webp',thumbnail:'stages/thumb/'+id+'.webp',music:({cybernightmarket:'streamroof',snowtemple:'cairo',skyboard:'paris',blockgarden:'blocklands'})[id]||id}));
 window.StagePicker=class StagePicker{
  constructor(stages=window.STAGES){if(!stages?.length)throw Error('没有可用场景');this.stages=stages;this.selected='random';this.last=null;}
  select(id){this.selected=this.stages.some(s=>s.id===id)?id:'random';return this.selected;}
  choose(random=Math.random){const fixed=this.stages.find(s=>s.id===this.selected);if(fixed)return fixed;const pool=this.stages.length>1?this.stages.filter(s=>s.id!==this.last):this.stages;const n=Number(random());return pool[Math.max(0,Math.min(pool.length-1,Math.floor((Number.isFinite(n)?n:0)*pool.length)))];}
  commit(stage){if(!this.stages.some(s=>s.id===stage?.id))throw Error('未知场景');this.last=stage.id;}
 };
})();
