
/* ============ estilo de los iconos: trazo + acabado + fondo ============
   Es común a todos los iconos (biblioteca, los tuyos y el original extraído): así quedan coherentes.
   drawIcon(x, paint, …) dibuja con el estilo; paint(ctx, cx, cy, tamaño, color) pinta el icono «en crudo». */
const IFX=[['none','Liso'],['duo','Dos tonos'],['grad','Degradado'],['emboss','Relieve'],['shadow','Sombra'],['outline','Contorno'],['glow','Brillo'],['chrome','Metal']];
const IBOX=[['none','Ninguno'],['circle','Círculo'],['square','Cuadrado'],['ring','Aro']];
function icFx(){const g=S.gen||{};return {fx:g.ifx||'none',box:g.ibox||'none'}}
const keyPainter=k=>(c,X,Y,sz,col,gl)=>drawIconKey(c,k,X,Y,sz,col,gl);
let CPX=null;function colRGB(col){if(!CPX)CPX=document.createElement('canvas').getContext('2d');CPX.fillStyle='#000';CPX.fillStyle=col;const v=CPX.fillStyle;
  if(v[0]==='#')return [parseInt(v.slice(1,3),16),parseInt(v.slice(3,5),16),parseInt(v.slice(5,7),16)];const m=v.match(/[\d.]+/g)||[0,0,0];return m.slice(0,3).map(Number)}
const mix=(c,t,a)=>`rgb(${c.map((v,i)=>Math.round(v+(t[i]-v)*a)).join(',')})`;
const lumOf=c=>(c[0]*.3+c[1]*.59+c[2]*.11)/255;
function tinted(m,fill){const t=document.createElement('canvas');t.width=m.width;t.height=m.height;const tx=t.getContext('2d');tx.fillStyle=fill;tx.fillRect(0,0,t.width,t.height);tx.globalCompositeOperation='destination-in';tx.drawImage(m,0,0);return t}
function drawIcon(x,paint,cx,cy,size,col,glow){const {fx,box}=icFx();
  if(fx==='none'&&box==='none'||fx==='duo'&&box==='none')return paint(x,cx,cy,size,col,glow);
  const c=colRGB(col),light=lumOf(c)>.55,ink=light?'rgb(14,17,22)':'#fff',o=Math.max(1,size/36);
  const pad=Math.ceil(size*.3+o*4),N=Math.ceil(size+pad*2),h=N/2,isz=box==='none'?size:box==='ring'?size*.58:size*.62;
  // máscara (blanco) del icono y, si hay, del fondo
  const m=document.createElement('canvas');m.width=m.height=N;const ok=paint(m.getContext('2d'),h,h,isz,'#fff',0);if(ok===false)return false;
  let shape=null;if(box!=='none'){shape=document.createElement('canvas');shape.width=shape.height=N;const sx=shape.getContext('2d');sx.fillStyle='#fff';sx.strokeStyle='#fff';
    if(box==='circle'){sx.beginPath();sx.arc(h,h,size/2,0,7);sx.fill()}else if(box==='square'){rrect(sx,h-size/2,h-size/2,size,size,size*.24);sx.fill()}else{sx.lineWidth=Math.max(1.5,size*.075);sx.beginPath();sx.arc(h,h,size/2-sx.lineWidth/2,0,7);sx.stroke()}}
  // lo que recibe el acabado: el fondo si lo hay (círculo/cuadrado) y si no el icono
  const base=shape&&box!=='ring'?shape:m,top=shape&&box!=='ring'?m:null;let both=null;
  if(box==='ring'){both=document.createElement('canvas');both.width=both.height=N;const bx=both.getContext('2d');bx.drawImage(shape,0,0);bx.drawImage(m,0,0)}
  const B=both||base,X0=cx-h,Y0=cy-h,lg=(stops)=>{const t=document.createElement('canvas').getContext('2d').createLinearGradient(0,h-size/2,0,h+size/2);for(const [p,cc] of stops)t.addColorStop(p,cc);return t};
  let fill=col;
  if(fx==='grad')fill=lg([[0,mix(c,[255,255,255],.35)],[1,mix(c,[0,0,0],.35)]]);
  if(fx==='chrome')fill=lg([[0,mix(c,[255,255,255],.6)],[.46,mix(c,[0,0,0],.35)],[.54,mix(c,[255,255,255],.15)],[1,mix(c,[0,0,0],.5)]]);
  x.save();
  if(fx==='shadow')x.drawImage(tinted(B,'rgba(0,0,0,.65)'),X0+o*.6,Y0+o*1.6);
  if(fx==='emboss'){x.drawImage(tinted(B,'rgba(0,0,0,.6)'),X0+o,Y0+o);x.drawImage(tinted(B,'rgba(255,255,255,.5)'),X0-o*.7,Y0-o*.7)}
  if(fx==='outline'){const oc=tinted(B,light?'rgba(0,0,0,.85)':'rgba(255,255,255,.9)'),r=o*1.3;for(let a=0;a<8;a++)x.drawImage(oc,X0+Math.cos(a*Math.PI/4)*r,Y0+Math.sin(a*Math.PI/4)*r)}
  if(fx==='glow'||glow){x.shadowColor=col;x.shadowBlur=fx==='glow'?Math.max(glow||0,size*.22):glow}
  x.drawImage(tinted(B,fill),X0,Y0);x.shadowBlur=0;
  if(top){// icono invertido dentro del círculo o el cuadrado (en «Dos tonos», con relleno suave)
    if(fx==='duo'){x.drawImage(tinted(m,ink),X0,Y0)}else x.drawImage(tinted(m,ink),X0,Y0)}
  x.restore();return true}
/* Bloque de ajustes (generador y selector): trazo, acabado y fondo, con muestras dibujadas */
function icStyleHTML(){const s=icStyle(),f=icFx();
  return `<div class="field"><span class="lbl">Trazo</span><div class="seg seg5" data-is="w">${ISTY.map(([v,l])=>{const on=v==='fill'?s.fill:!s.fill&&+v===s.w;return `<button data-v="${v}" aria-pressed="${on}">${l}</button>`}).join('')}</div></div>
    <div class="field"><span class="lbl">Acabado</span><div class="ocg isg" data-is="fx">${IFX.map(([v,l])=>`<button class="ocd" data-v="${v}" aria-pressed="${f.fx===v}"><canvas width="96" height="72" data-fxp="${v}"></canvas><span>${l}</span></button>`).join('')}</div></div>
    <div class="field"><span class="lbl">Fondo del icono</span><div class="ocg isg" data-is="box">${IBOX.map(([v,l])=>`<button class="ocd" data-v="${v}" aria-pressed="${f.box===v}"><canvas width="96" height="72" data-bxp="${v}"></canvas><span>${l}</span></button>`).join('')}</div></div>`}
function icStyleDraw(root){const g=S.gen||(S.gen=defGen()),keep={ifx:g.ifx,ibox:g.ibox},k=IC.st===2?'t:music':'lib:music',dark=getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
  const tile=(cv,patch)=>{const x=cv.getContext('2d');x.clearRect(0,0,96,72);x.fillStyle='#0b0e13';rrect(x,2,2,92,68,12);x.fill();Object.assign(g,patch);drawIcon(x,keyPainter(k),48,36,40,'#fff',0);Object.assign(g,keep)};
  root.querySelectorAll('[data-fxp]').forEach(cv=>tile(cv,{ifx:cv.dataset.fxp}));root.querySelectorAll('[data-bxp]').forEach(cv=>tile(cv,{ibox:cv.dataset.bxp}))}
function icStyleBind(root,after){icStyleDraw(root);
  root.querySelectorAll('[data-is]').forEach(gp=>gp.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const t=gp.dataset.is,v=b.dataset.v;
    setIconStyle(t==='w'?(v==='fill'?{ifill:true}:{ifill:false,iw:+v}):t==='fx'?{ifx:v}:{ibox:v});
    gp.querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b));icStyleDraw(root);after&&after()})}
function icStyleSum(){const s=icStyle(),f=icFx(),w=s.fill?'relleno':(ISTY.find(x=>+x[0]===s.w)||[0,'normal'])[1].toLowerCase();
  return [w,f.fx!=='none'?IFX.find(x=>x[0]===f.fx)[1].toLowerCase():'',f.box!=='none'?'en '+IBOX.find(x=>x[0]===f.box)[1].toLowerCase():''].filter(Boolean).join(' · ')}
