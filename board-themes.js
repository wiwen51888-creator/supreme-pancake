(()=>{
'use strict';
const themes=[
 {id:'snow',name:'雪山棋台',base:'#172a43',edge:'#b1d8ff',file:'chess-scenes/snow.webp'},
 {id:'forest',name:'森语棋庭',base:'#152c24',edge:'#b9d99b',file:'chess-scenes/forest.webp'},
 {id:'lava',name:'熔岩棋狱',base:'#281b22',edge:'#f3bc87',file:'chess-scenes/lava.webp'},
 {id:'fantasy',name:'云阙仙台',base:'#1b2936',edge:'#b9e6d3',file:'chess-scenes/fantasy.webp'},
 {id:'ocean',name:'深海棋宫',base:'#15283e',edge:'#96e4ed',file:'chess-scenes/ocean.webp'},
 {id:'cyber',name:'霓虹棋域',base:'#171d38',edge:'#bbd5ff',file:'chess-scenes/cyber.webp'}
];
const images=new Map(),pending=new Map();
async function load(theme,loader){if(images.has(theme.id))return images.get(theme.id);if(!pending.has(theme.id))pending.set(theme.id,loader(theme.file).then(image=>{images.set(theme.id,image);return image;}).finally(()=>pending.delete(theme.id)));return pending.get(theme.id);}
function draw(ctx,theme,width=1100,height=740){
 ctx.save();ctx.scale(width/1100,height/740);ctx.imageSmoothingEnabled=false;
 const image=images.get(theme.id);if(image)ctx.drawImage(image,0,0,1100,740);else{ctx.fillStyle=theme.base;ctx.fillRect(0,0,1100,740);}
 // Transparent deployment grid over the environment; never replace the floor with opaque tiles.
 for(let y=0;y<8;y++)for(let x=0;x<6;x++){
  const px=250+x*100,py=120+y*62;ctx.fillStyle=(x+y)%2?'#07131a0b':'#ffffff06';ctx.fillRect(px,py,100,62);
  ctx.strokeStyle='#eff9ff40';ctx.lineWidth=1;ctx.strokeRect(px,py,100,62);
 }
 ctx.strokeStyle='#ffe9b178';ctx.lineWidth=1.5;ctx.setLineDash([7,8]);ctx.beginPath();ctx.moveTo(250,368);ctx.lineTo(850,368);ctx.stroke();ctx.setLineDash([]);ctx.restore();
}
window.ChessBoards={themes,load,draw,images};
})();
