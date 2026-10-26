
/* ============ iconos propios (rejilla de 24) ============ */
const ICONS={
  nav:['M3 11l18-8-8 18-2-8z'],
  pin:['M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z','M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  radio:['M12 13v8','M8.5 9.5a5 5 0 0 1 7 0','M5.5 6.5a9 9 0 0 1 13 0','M12 12.2a.8.8 0 1 0 0 .01'],
  music:['M9 18V5l11-2v13','M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z','M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
  play:['M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z','M10 8l6 4-6 4z'],
  phone:['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'],
  leaf:['M5 19c0-9 6-14 15-14 0 9-5 15-14 15','M5 19l8-8'],
  gauge:['M4.9 19a9 9 0 1 1 14.2 0','M12 14l4-5'],
  gear:null,
  sliders:['M4 6h10','M18 6h2','M16 4v4','M4 12h4','M12 12h8','M10 10v4','M4 18h12','M18 16v4'],
  car:['M5 16h14','M6 16l1.5-5h9L18 16','M5 16v3h2v-3','M17 16v3h2v-3','M8.5 11L10 7h4l1.5 4'],
  smartphone:['M7 2.5h10a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1z','M11 18h2'],
  home:['M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  moon:['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  clock:['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z','M12 7v5l3 2'],
  star:['M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z'],
  bt:['M7 7l10 10-5 4V3l5 4L7 17'],
  power:['M12 3v9','M6.3 6.3a8 8 0 1 0 11.4 0']};
const ICONL={nav:'Navegación',pin:'Destino',radio:'Antena',music:'Música',play:'Reproducir',phone:'Teléfono',leaf:'Hoja',gauge:'Indicador',gear:'Engranaje',sliders:'Ajustes',car:'Coche',smartphone:'Móvil',home:'Casa',moon:'Luna',clock:'Reloj',star:'Estrella',bt:'Bluetooth',power:'Encendido'};
const ICONDEF=[['navi','nav'],['radio','radio'],['media','music'],['phone','phone'],['eco','leaf'],['setting','gear'],['map','pin'],['smartphone','smartphone'],['vehicle','car'],['dark','moon'],['time','clock']];
const P2D={};
function drawLib(x,k,cx,cy,size,col,glow){x.save();x.translate(cx-size/2,cy-size/2);x.scale(size/24,size/24);x.strokeStyle=col;x.fillStyle=col;x.lineWidth=2.1;x.lineCap='round';x.lineJoin='round';
  if(glow){x.shadowColor=col;x.shadowBlur=glow*24/size}
  if(k==='gear'){x.beginPath();x.arc(12,12,6.2,0,Math.PI*2);x.stroke();x.beginPath();x.arc(12,12,2.4,0,Math.PI*2);x.stroke();x.lineWidth=3;for(let a=0;a<8;a++){const t=a*Math.PI/4;x.beginPath();x.moveTo(12+Math.cos(t)*7.6,12+Math.sin(t)*7.6);x.lineTo(12+Math.cos(t)*10,12+Math.sin(t)*10);x.stroke()}}
  else for(const d of ICONS[k]){const p=P2D[d]||(P2D[d]=new Path2D(d));x.stroke(p)}
  x.restore()}
function defIcon(F){const n=F.name.toLowerCase();for(const [w,k] of ICONDEF)if(n.includes(w))return k;return 'star'}
/* Extrae la silueta del icono original a partir del estado pulsado (fondo claro casi uniforme por filas) */
function extractIcon(F){if(F.ico!==undefined)return F.ico;const fr=frames(F);if(fr<2){F.ico=null;return null}
  const fw=F.w/fr,h=F.h,ox=fw,m=new Float32Array(fw*h),pal=F.pal,idx=F.idx,B=4;
  for(let y=B;y<h-B;y++){const rs=[],gs=[],bs=[];for(let x=B;x<fw-B;x++){const p=idx[y*F.w+ox+x]*3;rs.push(pal[p]);gs.push(pal[p+1]);bs.push(pal[p+2])}
    const med=a=>{a.sort((u,v)=>u-v);return a[a.length>>1]},mr=med(rs.slice()),mg=med(gs.slice()),mb=med(bs.slice());
    for(let x=B;x<fw-B;x++){const p=idx[y*F.w+ox+x]*3,dr=pal[p]-mr,dg=pal[p+1]-mg,db=pal[p+2]-mb,d=Math.sqrt(dr*dr+dg*dg+db*db);m[y*fw+x]=cl((d-26)/64)}}
  const bl=new Float32Array(fw*h);for(let y=1;y<h-1;y++)for(let x=1;x<fw-1;x++){let a=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)a+=m[(y+j)*fw+x+i];bl[y*fw+x]=a/9}
  for(let i=0;i<fw*h;i++){const v=cl((bl[i]-.22)/.36);m[i]=v*v*(3-2*v)}
  let x0=fw,y0=h,x1=-1,y1=-1,sum=0;for(let y=0;y<h;y++)for(let x=0;x<fw;x++)if(m[y*fw+x]>.5){sum++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(sum<30||x1-x0>fw*.9||y1-y0>h*.9){F.ico=null;return null}
  const c=document.createElement('canvas');c.width=fw;c.height=h;const x=c.getContext('2d'),im=x.createImageData(fw,h);
  for(let i=0;i<fw*h;i++){im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=255;im.data[i*4+3]=Math.round(m[i]*255)}x.putImageData(im,0,0);
  F.ico={cv:c,bx:x0,by:y0,bw:x1-x0+1,bh:y1-y0+1};return F.ico}
function drawMask(x,mk,cx,cy,k,col,glow){const t=document.createElement('canvas');t.width=mk.cv.width;t.height=mk.cv.height;const tx=t.getContext('2d');tx.fillStyle=col;tx.fillRect(0,0,t.width,t.height);tx.globalCompositeOperation='destination-in';tx.drawImage(mk.cv,0,0);
  x.save();if(glow){x.shadowColor=col;x.shadowBlur=glow}x.drawImage(t,mk.bx,mk.by,mk.bw,mk.bh,cx-mk.bw*k/2,cy-mk.bh*k/2,mk.bw*k,mk.bh*k);x.restore()}
function pngMask(bmp){const s=96,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d'),sc=Math.min(s/bmp.width,s/bmp.height);x.drawImage(bmp,(s-bmp.width*sc)/2,(s-bmp.height*sc)/2,bmp.width*sc,bmp.height*sc);
  const d=x.getImageData(0,0,s,s);let opaque=0;for(let i=0;i<s*s;i++)if(d.data[i*4+3]>200)opaque++;
  if(opaque>s*s*.9){for(let i=0;i<s*s;i++){const l=(d.data[i*4]*.3+d.data[i*4+1]*.59+d.data[i*4+2]*.11);d.data[i*4+3]=l>128?255-((255-l)*2):0}}
  for(let i=0;i<s*s;i++){d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=255}x.putImageData(d,0,0);return {cv:c,bx:0,by:0,bw:s,bh:s}}

/* ============ generador ============ */
const GSTYLES=[['glow','Brillo inferior'],['flat','Plano'],['outline','Contorno'],['glass','Cristal'],['neon','Neón'],['tile','Mosaico'],['minimal','Mínimo'],['metal','Aluminio'],['carbon','Carbono'],['aurora','Aurora'],['hud','Futurista'],['frost','Esmerilado'],['soft','Suave'],['vivid','Degradado vivo']];
const defGen=()=>({look:'orig',style:'glow',shape:'round',r:14,inset:4,corners:'bg',color:'orig',hue:156,is:56,iy:42,per:{}});
function origHue(F){if(F.oh!=null)return F.oh;const cnt=new Uint32Array(256);for(let i=0;i<F.idx.length;i++)cnt[F.idx[i]]++;let sx=0,sy=0;
  for(let i=0;i<F.n;i++){if(!cnt[i])continue;const r=F.pal[i*3],g=F.pal[i*3+1],b=F.pal[i*3+2];if(isKey(r,g,b))continue;const C=(Math.max(r,g,b)-Math.min(r,g,b))/255;if(C<.2)continue;const [h]=rgb2hsl(r,g,b),w=cnt[i]*C*C;sx+=Math.cos(h*Math.PI/180)*w;sy+=Math.sin(h*Math.PI/180)*w}
  F.oh=sx||sy?Math.round(((Math.atan2(sy,sx)*180/Math.PI)+360)%360):210;return F.oh}
function cornerBase(F){const s=S.layout.slots.find(s=>s.p===F.path),bg=byName('common/home_bg.bmp'),fw=F.w/frames(F),c=document.createElement('canvas');c.width=fw;c.height=F.h;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,fw,F.h);
  if(s&&bg)x.drawImage(renderCanvas(bg,false),s.x,s.y,fw,F.h,0,0,fw,F.h);return c}
function rrect(x,X,Y,W,H,r){r=Math.max(0,Math.min(r,W/2,H/2));x.beginPath();x.moveTo(X+r,Y);x.lineTo(X+W-r,Y);x.arcTo(X+W,Y,X+W,Y+r,r);x.lineTo(X+W,Y+H-r);x.arcTo(X+W,Y+H,X+W-r,Y+H,r);x.lineTo(X+r,Y+H);x.arcTo(X,Y+H,X,Y+H-r,r);x.lineTo(X,Y+r);x.arcTo(X,Y,X+r,Y,r);x.closePath()}
const gRad=(g,h)=>g.shape==='rect'?0:g.shape==='pill'?(h-2*g.inset)/2:g.r;
function genIconSrc(F,g){const p=g.per[F.path]||{};const k=p.icon||(extractIcon(F)?'orig':'lib:'+defIcon(F));return k}
function drawState(x,F,w,h,s,H,g,bgc){
  const on=s%2===1,dim=s===2,ins=g.inset,X=ins,Y=ins,W=w-2*ins,Hh=h-2*ins,r=gRad(g,h);
  x.drawImage(bgc,0,0);
  const lin=(a,b,c)=>{const gr=x.createLinearGradient(0,Y,0,Y+Hh);gr.addColorStop(0,a);if(c){gr.addColorStop(.62,b);gr.addColorStop(1,c)}else gr.addColorStop(1,b);return gr};
  let ic,glow=0;rrect(x,X+1,Y+1,W-2,Hh-2,r);
  switch(g.style){
    case 'flat':x.fillStyle=on?`hsl(${H} 78% 50%)`:`hsl(${H} 22% ${dim?8:14}%)`;x.fill();ic=on?'#ffffff':`hsl(${H} 80% ${dim?36:62}%)`;break;
    case 'outline':x.fillStyle=on?`hsl(${H} 70% 15%)`:'#030405';x.fill();x.lineWidth=on?4:3;x.strokeStyle=`hsl(${H} 85% ${on?60:dim?28:52}%)`;rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke();ic=on?'#ffffff':`hsl(${H} 80% ${dim?30:58}%)`;break;
    case 'glass':x.fillStyle=on?lin(`hsl(${H} 75% 58%)`,`hsl(${H} 75% 32%)`):lin(`hsl(${H} 25% ${dim?12:24}%)`,`hsl(${H} 25% ${dim?4:7}%)`);x.fill();
      x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,'rgba(255,255,255,.22)');gl.addColorStop(1,'rgba(255,255,255,.02)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.5);x.restore();
      x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.3)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=on?'#ffffff':dim?'#7d838d':'#eef2f7';break;
    case 'neon':x.fillStyle=on?`hsl(${H} 90% 10%)`:'#020304';x.fill();x.save();x.shadowColor=`hsl(${H} 100% 55%)`;x.shadowBlur=on?18:10;x.lineWidth=2.5;x.strokeStyle=`hsl(${H} 100% ${dim?30:on?70:60}%)`;rrect(x,X+4,Y+4,W-8,Hh-8,Math.max(0,r-3));x.stroke();x.restore();ic=`hsl(${H} 100% ${dim?40:72}%)`;glow=dim?0:on?16:10;break;
    case 'tile':x.fillStyle=on?`hsl(${H} 85% 34%)`:`hsl(${H} 72% ${dim?20:44}%)`;x.fill();if(on){x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.55)';rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke()}ic=dim?`hsl(${H} 25% 62%)`:'#ffffff';break;
    case 'minimal':x.fillStyle=on?`hsla(${H},85%,50%,.26)`:'rgba(0,0,0,0)';x.fill();x.fillStyle=`hsl(${H} 85% ${on?62:dim?26:50}%)`;x.fillRect(X+W*.2,Y+Hh-(on?5:3),W*.6,on?4:2);ic=on?'#ffffff':`hsl(${H} 80% ${dim?32:64}%)`;break;
    case 'metal':{x.fillStyle=on?lin('#8d949c','#5c636b','#747b83'):lin(dim?'#5d6268':'#d9dde2',dim?'#3c4045':'#9aa1a9',dim?'#4a4f55':'#c2c8ce');x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
      let sd=w*7+h;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<Hh*1.6;i++){x.fillStyle=`rgba(${rnd()<.5?'255,255,255':'0,0,0'},${.03+rnd()*.06})`;x.fillRect(X,Y+rnd()*Hh,W,1)}x.restore();
      x.fillStyle=`hsl(${H} 85% ${on?58:dim?30:46}%)`;x.fillRect(X+r*.6,Y+Hh-4,W-r*1.2,3);x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.45)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();
      ic=on?`hsl(${H} 70% 85%)`:dim?'#2a2e33':'#1c2026';break}
    case 'carbon':{x.fillStyle=on?`hsl(${H} 40% 10%)`:'#0d0f12';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const q=4;
      for(let yy=Y;yy<Y+Hh;yy+=q)for(let xx=X;xx<X+W;xx+=q){const a=((xx-X)/q+(yy-Y)/q)%2===0;x.fillStyle=a?'rgba(255,255,255,.06)':'rgba(0,0,0,.25)';x.fillRect(xx,yy,q,q/2);x.fillStyle=a?'rgba(0,0,0,.25)':'rgba(255,255,255,.05)';x.fillRect(xx,yy+q/2,q,q/2)}
      const gl=x.createLinearGradient(0,Y,0,Y+Hh*.45);gl.addColorStop(0,'rgba(255,255,255,.12)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.45);
      const bl=x.createLinearGradient(0,Y+Hh*.6,0,Y+Hh);bl.addColorStop(0,`hsla(${H},90%,50%,0)`);bl.addColorStop(1,`hsla(${H},90%,${on?60:50}%,${on?.75:dim?.15:.45})`);x.fillStyle=bl;x.fillRect(X,Y+Hh*.6,W,Hh*.4);x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsl(${H} 60% ${on?55:dim?16:28}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 85% ${dim?34:64}%)`;break}
    case 'aurora':{x.fillStyle='#05070a';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const cx0=w/2,cy0=Y+Hh*(g.iy/100),rg=x.createRadialGradient(cx0,cy0,2,cx0,cy0,Math.max(W,Hh)*.62);
      rg.addColorStop(0,`hsla(${H},90%,${on?65:55}%,${on?.95:dim?.22:.6})`);rg.addColorStop(.55,`hsla(${(H+40)%360},85%,45%,${on?.35:dim?.06:.18})`);rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(X,Y,W,Hh);x.restore();
      x.lineWidth=1;x.strokeStyle=`hsla(${H},70%,60%,${on?.7:.25})`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':dim?`hsl(${H} 30% 45%)`:'#f4f7fb';glow=dim?0:on?10:5;break}
    case 'hud':{x.fillStyle=on?`hsla(${H},80%,40%,.3)`:'rgba(3,6,9,.88)';x.fill();const L=Math.min(W,Hh)*.2,c2=`hsl(${H} 95% ${on?70:dim?30:56}%)`;x.save();x.strokeStyle=c2;x.lineWidth=on?3:2.2;x.shadowColor=c2;x.shadowBlur=dim?0:6;x.lineCap='square';x.beginPath();
      const a=X+5,b=Y+5,c=X+W-5,d=Y+Hh-5;x.moveTo(a,b+L);x.lineTo(a,b);x.lineTo(a+L,b);x.moveTo(c-L,b);x.lineTo(c,b);x.lineTo(c,b+L);x.moveTo(c,d-L);x.lineTo(c,d);x.lineTo(c-L,d);x.moveTo(a+L,d);x.lineTo(a,d);x.lineTo(a,d-L);x.stroke();
      x.globalAlpha=.35;x.lineWidth=1;x.beginPath();x.moveTo(a+L+6,b);x.lineTo(c-L-6,b);x.stroke();x.restore();ic=on?'#ffffff':c2;glow=dim?0:on?8:4;break}
    case 'frost':{x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.filter='blur(7px)';x.drawImage(bgc,-10,-10,w+20,h+20);x.filter='none';
      x.fillStyle=on?`hsla(${H},85%,55%,.42)`:`rgba(255,255,255,${dim?.05:.13})`;x.fillRect(X,Y,W,Hh);const gl=x.createLinearGradient(0,Y,0,Y+Hh);gl.addColorStop(0,'rgba(255,255,255,.18)');gl.addColorStop(.5,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh);x.restore();
      x.lineWidth=1.5;x.strokeStyle=on?`hsla(${H},90%,75%,.8)`:'rgba(255,255,255,.38)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'soft':{const base=on?`hsl(${H} 45% 20%)`:`hsl(${H} 14% ${dim?8:13}%)`;x.save();x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=8;x.shadowOffsetX=on?1:3;x.shadowOffsetY=on?1:3;x.fillStyle=base;rrect(x,X+3,Y+3,W-6,Hh-6,r);x.fill();x.restore();
      x.save();rrect(x,X+3,Y+3,W-6,Hh-6,r);x.clip();const sg=x.createLinearGradient(X,Y,X+W,Y+Hh);if(on){sg.addColorStop(0,'rgba(0,0,0,.45)');sg.addColorStop(1,'rgba(255,255,255,.06)')}else{sg.addColorStop(0,'rgba(255,255,255,.09)');sg.addColorStop(1,'rgba(0,0,0,.3)')}x.fillStyle=sg;x.fillRect(X,Y,W,Hh);x.restore();
      if(on){x.lineWidth=2;x.strokeStyle=`hsla(${H},90%,60%,.7)`;rrect(x,X+3.5,Y+3.5,W-7,Hh-7,Math.max(0,r-1));x.stroke()}
      ic=on?'#ffffff':`hsl(${H} 80% ${dim?30:58}%)`;glow=on&&!dim?10:0;break}
    case 'vivid':{const gr=x.createLinearGradient(X,Y,X+W,Y+Hh);gr.addColorStop(0,`hsl(${H} ${dim?25:85}% ${on?62:dim?22:50}%)`);gr.addColorStop(1,`hsl(${(H+45)%360} ${dim?25:85}% ${on?48:dim?14:34}%)`);x.fillStyle=gr;x.fill();
      x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,'rgba(255,255,255,.25)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.5);x.restore();
      if(on){x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.75)';rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke()}ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    default:x.fillStyle=on?lin(`hsl(${H} 90% 62%)`,`hsl(${H} 85% 46%)`):lin('#16191e','#060708',`hsl(${H} 85% ${dim?20:44}%)`);x.fill();x.lineWidth=2;x.strokeStyle=on?`hsl(${H} 70% 40%)`:`hsl(${H} 55% ${dim?18:32}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?`hsl(${H} 70% 20%)`:`hsl(${H} 85% ${dim?32:60}%)`}
  const src=genIconSrc(F,g),p=g.per[F.path]||{},cx=w/2,cy=Y+Hh*(g.iy/100);
  if(p.ihue!=null&&!on)ic=p.ihue==='white'?(dim?'rgba(255,255,255,.5)':'#ffffff'):`hsl(${p.ihue} 85% ${dim?34:62}%)`;
  if(src==='orig'){const mk=extractIcon(F);if(mk)drawIcon(x,(c,X,Y,sz,col,gl)=>{drawMask(c,mk,X,Y,sz/56,col,gl);return true},cx,cy,g.is,ic,glow)}
  else if(src==='png'&&p.png){drawIcon(x,(c,X,Y,sz,col,gl)=>{drawMask(c,p.png,X,Y,sz/96*1.15,col,gl);return true},cx,cy,g.is,ic,glow)}
  else drawIcon(x,keyPainter(src),cx,cy,g.is,ic,glow);
}
function genHue(F,g){const p=g.per[F.path]||{};if(p.hue!=null)return p.hue;return g.color==='orig'?origHue(F):g.hue}
function genTile(F,g){const fr=frames(F),fw=F.w/fr,h=F.h,c=document.createElement('canvas');c.width=F.w;c.height=h;const x=c.getContext('2d');const H=genHue(F,g),bgc=cornerBase(F);
  for(let s=0;s<fr;s++){x.save();x.translate(s*fw,0);x.beginPath();x.rect(0,0,fw,h);x.clip();drawState(x,F,fw,h,s,H,g,bgc);x.restore()}
  if(g.corners==='key'){const m=document.createElement('canvas');m.width=F.w;m.height=h;const mx=m.getContext('2d');mx.fillStyle='#fff';const r=gRad(g,h);
    for(let s=0;s<fr;s++){rrect(mx,s*fw+g.inset,g.inset,fw-2*g.inset,h-2*g.inset,r);mx.fill()}
    const md=mx.getImageData(0,0,F.w,h).data,im=x.getImageData(0,0,F.w,h);for(let i=0;i<F.w*h;i++)if(md[i*4+3]<128)im.data[i*4+3]=0;x.putImageData(im,0,0)}
  return c}
function genTargets(){return S.layout.slots.map(slotF).filter(F=>F&&frames(F)>=2)}
function regen(){S.genCv=new Map();for(const F of genTargets())S.genCv.set(F.path,genTile(F,S.gen))}
function applyGen(){const fs=genTargets();if(!fs.length)return;before();S.gen.look=S.gen.style||'glow';applyButtons(fs);toast(`${fs.length} botones rediseñados`,{label:'Deshacer',fn:undo})}

const GSHAPES=[['rect','Rectángulo'],['round','Redondeado'],['pill','Píldora']];
function miniTile(F,g,state){const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=fw;c.height=F.h;const x=c.getContext('2d');drawState(x,F,fw,F.h,Math.min(state||0,fr-1),genHue(F,g),g,cornerBase(F));
  if(g.corners==='key'){const r=gRad(g,F.h),m=document.createElement('canvas');m.width=fw;m.height=F.h;const mx=m.getContext('2d');rrect(mx,g.inset,g.inset,fw-2*g.inset,F.h-2*g.inset,r);mx.fill();x.globalCompositeOperation='destination-in';x.drawImage(m,0,0);x.globalCompositeOperation='source-over'}
  const lb=LABELS[F.name.toLowerCase()];if(lb&&fw===210&&F.h===137){x.font='600 21px Tahoma,Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=state%2===1?'#000':'#fff';x.fillText(lb,105,105.5,176)}return c}
function putMini(cv,src){const x=cv.getContext('2d');cv.width=src.width;cv.height=src.height;x.drawImage(src,0,0)}
function genSum(g){return {style:(GSTYLES.find(s=>s[0]===g.style)||GSTYLES[0])[1],shape:(GSHAPES.find(s=>s[0]===g.shape)||GSHAPES[1])[1]+(g.shape==='round'?` ${g.r} px`:'')+` · margen ${g.inset} px · esquinas ${g.corners==='key'?'transparentes':'del fondo'}`,
  color:g.color==='orig'?'El de cada botón':'Uno para todos: '+hueName(g.hue).toLowerCase(),icons:`${icStyleSum()} · tamaño ${g.is} px · altura ${g.iy} %`}}
function scrGen(v){
  if(!S.gen)S.gen=defGen();const g=S.gen,fs=genTargets();if(!fs.length){v.innerHTML='<p class="empty">No hay botones de Inicio en el backup.</p>';return}
  setTitle('Rediseñar botones',`Inicio · ${fs.length} botones`);
  if(!S.gsel||!fs.some(F=>F.path===S.gsel))S.gsel=fs[0].path;if(!S.gtab)S.gtab='btn';
  const ref=()=>S.lc.get(S.gsel.toLowerCase())||fs[0],sm=genSum(g);
  const item=(k,icon,title,sum,body)=>`<div class="acc-i${S.gopen===k?' open':''}" data-k="${k}"><button class="acc-h" aria-expanded="${S.gopen===k}"><span class="ic">${ic(icon)}</span><span class="tx"><b>${title}</b><small data-sum="${k}">${esc(sum)}</small></span>${CHEV}</button>${S.gopen===k?`<div class="acc-b">${body}</div>`:''}</div>`;
  const look=btnLook(),styleBody=`<div class="ocg" id="g-lk">${LOOKS().map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${look===k}"><canvas data-ms="${k}"></canvas><span>${l}</span></button>`).join('')}</div>`;
  const shapeBody=`<div class="ocg">${GSHAPES.map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${g.shape===k}"><canvas data-mf="${k}"></canvas><span>${l}</span></button>`).join('')}</div>
    ${g.shape==='round'?`<label class="rg" for="g-r"><span>Redondeo <output>${g.r} px</output></span><input type="range" id="g-r" min="2" max="48" value="${g.r}"></label>`:''}
    <label class="rg" for="g-in"><span>Margen alrededor <output>${g.inset} px</output></span><input type="range" id="g-in" min="0" max="24" value="${g.inset}"></label>
    <div class="field"><span class="lbl">Esquinas y margen</span><div class="seg" id="g-co"><button data-v="bg" aria-pressed="${g.corners==='bg'}">Color del fondo</button><button data-v="key" aria-pressed="${g.corners==='key'}">Transparentes</button></div>
    <p class="note">${g.corners==='key'?'Usa el amarillo de transparencia. Los botones originales no lo usan: compruébalo antes con el kit de prueba o podrían salir esquinas amarillas.':'Opción segura: se pintan con el fondo de Inicio que hay detrás de cada botón.'}</p></div>`;
  const colorBody=`<div class="seg" id="g-cm"><button data-v="orig" aria-pressed="${g.color==='orig'}">El de cada botón</button><button data-v="one" aria-pressed="${g.color==='one'}">Uno para todos</button></div>
    ${g.color==='one'?swatches(g.hue,{label:'Color de los botones'}):'<p class="note">Cada botón conserva su color original. Puedes cambiar el de uno solo tocándolo en la pantalla.</p>'}`;
  const iconBody=`<p class="note">Cómo se dibujan <b>todos</b> los iconos. Qué icono lleva cada botón se elige en la pestaña <b>Botones</b>.</p>
    <div id="g-ist">${icStyleHTML()}</div>
    <label class="rg" for="g-is"><span>Tamaño <output>${g.is} px</output></span><input type="range" id="g-is" min="24" max="96" value="${g.is}"></label>
    <label class="rg" for="g-iy"><span>Altura <output>${g.iy} %</output></span><input type="range" id="g-iy" min="20" max="70" value="${g.iy}"></label>
    <p class="note">El MediaNav escribe el nombre debajo, por eso los iconos van por encima del centro.</p>`;
  v.innerHTML=`<div class="two">
    <div class="stick sticky-pv"><div class="screen"><canvas id="pv" width="800" height="480" aria-label="Vista previa de los botones rediseñados. Toca un botón para cambiar su icono y su color."></canvas></div>
      <div class="e-bar"><div class="seg" id="g-st" role="group" aria-label="Estado"><button data-s="0" aria-pressed="${!S.gstate}">Reposo</button><button data-s="1" aria-pressed="${S.gstate===1}">Pulsado</button></div><span class="sp"></span><span class="hint" style="padding:0">Toca un botón para cambiarlo</span></div></div>
    <div class="stack">
    <div class="seg gtabs" id="g-tabs" role="tablist"><button data-t="btn" role="tab" aria-pressed="${S.gtab==='btn'}">Botones</button><button data-t="style" role="tab" aria-pressed="${S.gtab==='style'}">Estilo</button><button data-t="icons" role="tab" aria-pressed="${S.gtab==='icons'}">Iconos</button><button data-t="color" role="tab" aria-pressed="${S.gtab==='color'}">Color</button><button data-t="shape" role="tab" aria-pressed="${S.gtab==='shape'}">Forma</button></div>
    <div data-pn="btn"${S.gtab==='btn'?'':' hidden'}><div class="card gbl"><p class="note">Toca un botón para elegir su icono (de la biblioteca o uno tuyo) y su color.</p><div class="list">${fs.map(F=>{const p=g.per[F.path]||{},ii=genIconSrc(F,g);return `<button class="li" data-gb="${esc(F.path)}"><span class="th"><canvas data-gt="${esc(F.path)}"></canvas></span><span class="tx"><b>${esc(pretty(F))}</b><small>Icono ${ii==='orig'?'original':ii==='png'?'propio':esc(String(ii.startsWith('lib:')?ICONL[ii.slice(4)]||'propio':keyLabel(ii)).toLowerCase())} · ${p.hue!=null?'color '+hueName(p.hue).toLowerCase():'color como el resto'}</small></span><span class="pill p-col">Cambiar</span></button>`}).join('')}</div><p class="note">También puedes tocarlo en la pantalla de arriba. Tu propio icono: «Cambiar» → «Mis iconos».</p></div></div>
    <div class="card" data-pn="style"${S.gtab==='style'?'':' hidden'}><p class="note">Cómo son los ${fs.length} botones: el fondo, el borde y cómo se iluminan al pulsar. «Original de Renault» los deja como vienen, con tus iconos y colores.</p>${styleBody}</div>
    <div class="card" data-pn="icons"${S.gtab==='icons'?'':' hidden'}>${iconBody}</div>
    <div class="card" data-pn="color"${S.gtab==='color'?'':' hidden'}>${colorBody}</div>
    <div class="card" data-pn="shape"${S.gtab==='shape'?'':' hidden'}>${shapeBody}</div>
    <p class="note">Solo cambia los botones de la pantalla de Inicio. Los cambios se aplican al momento y se pueden deshacer.</p></div></div>
    <div class="gbar"><button class="btn o" id="g-reset">Empezar de cero</button><button class="btn" id="g-ap">Listo</button></div>`;
  const c=$('#pv'),po=()=>({scr:'home',state:S.gstate||0});mountPreview(c,po);
  const minis=()=>{const F=ref();$$('[data-ms]',v).forEach(cv=>{const k=cv.dataset.ms;if(k==='orig'){const fr=frames(F),fw=F.w/fr,t=document.createElement('canvas');t.width=fw;t.height=F.h;t.getContext('2d').drawImage(renderOrig(F,false),0,0,fw,F.h,0,0,fw,F.h);putMini(cv,t)}else putMini(cv,miniTile(F,{...g,style:k},0))});$$('[data-mf]',v).forEach(cv=>putMini(cv,miniTile(F,{...g,shape:cv.dataset.mf},0)));
    $$('[data-gt]',v).forEach(cv=>{const G=S.lc.get(cv.dataset.gt.toLowerCase());if(G)putMini(cv,miniTile(G,g,0))});const s2=genSum(g);for(const k in s2){const e=$(`[data-sum="${k}"]`,v);if(e)e.textContent=s2[k]}};
  const upd=()=>{if(btnLook()!=='orig')applyButtonsSoon();minis();saveState()};minis();
  $('#g-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.gtab=b.dataset.t;$$('#g-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('[data-pn]',v).forEach(p=>p.hidden=p.dataset.pn!==S.gtab);if(S.gtab==='icons'){const ist=$('#g-ist');if(ist)icStyleDraw(ist)}};
  $$('.ocg',v).forEach(gr=>gr.onclick=e=>{const b=e.target.closest('.ocd');if(!b)return;if(b.querySelector('[data-ms]')){setLook(b.dataset.v).then(ok=>{if(ok){gr.querySelectorAll('.ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));minis()}})}else{g.shape=b.dataset.v;render(true)}});
  const seg=(id,key)=>{const el=$(id);if(el)el.onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;g[key]=b.dataset.v;render(true)}};seg('#g-co','corners');seg('#g-cm','color');
  $('#g-st').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.gstate=+b.dataset.s;$$('#g-st button').forEach(x=>x.setAttribute('aria-pressed',x===b));drawPreview(c,po())};
  const rng=(id,key,suf)=>{const i=$(id);if(!i)return;paintRange(i);const out=i.closest('.rg').querySelector('output');i.oninput=()=>{g[key]=+i.value;out.textContent=i.value+suf;paintRange(i);upd()}};
  const ist=$('#g-ist');if(ist)icStyleBind(ist,()=>minis());
  rng('#g-r','r',' px');rng('#g-in','inset',' px');rng('#g-is','is',' px');rng('#g-iy','iy',' %');
  const cs=$('[data-pn="color"] .swg',v);if(cs){cs.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;g.hue=+b.dataset.h;cs.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));upd()};const cp=cs.querySelector('[data-pick]');if(cp)cp.onchange=e=>{g.hue=Math.round(hexHsl(e.target.value)[0]);upd()}}
  let down=-1;c.onpointerdown=e=>{const h=slotAt(c,e);down=h.i;if(h.i>=0){S.press=h.i;drawPreview(c,po())}};
  c.onpointerleave=c.onpointercancel=()=>{down=-1;if(S.press!==-1){S.press=-1;drawPreview(c,po())}};
  c.onpointerup=e=>{const h=slotAt(c,e),i=down;down=-1;S.press=-1;drawPreview(c,po());if(i>=0&&h.i===i){const F=slotF(S.layout.slots[i]);if(F&&fs.includes(F))btnSheet(F,minis)}};
  $$('[data-gb]',v).forEach(b=>b.onclick=()=>{const F=S.lc.get(b.dataset.gb.toLowerCase());if(F)btnSheet(F,minis)});
  $('#g-ap').onclick=()=>{go({n:'home'});if(!S.demo&&S.files.some(changed))setTimeout(()=>toast('¿Te gusta? Guárdalo con un nombre',{label:'Guardar',fn:saveDesign,ms:7000}),600)};
  $('#g-reset').onclick=async()=>{if(!await confirmBS({title:'Empezar de cero',text:'Los 6 botones vuelven al original de Renault: se quitan el estilo, la forma, los colores y los iconos elegidos. Podrás deshacerlo.',ok:'Empezar de cero'}))return;before();S.gen=defGen();applyButtons();render(true);toast('Diseño reiniciado',{label:'Deshacer',fn:undo})};
}
function genSheet(F,upd){
  const g=S.gen,fs=genTargets(),idx=fs.indexOf(F);S.gsel=F.path;const p=()=>g.per[F.path]||(g.per[F.path]={});
  const cur=genIconSrc(F,g),ps=g.per[F.path]||{},sug=icSuggest(F).map(n=>'t:'+n),icons=['orig','png',...(cur.startsWith('t:')||cur.startsWith('lib:')||cur.startsWith('my:'))&&!sug.includes(cur)?[cur]:[],...sug,'all'];
  S.icRedraw=IC.st===2?null:()=>{if($('#gs-ic'))genSheet(F,upd)};if(IC.st!==2)icLoad();
  const icT=k=>k==='orig'?'Original':k==='png'?(ps.png?'Mi imagen':'Mis iconos'):k==='all'?'Ver todos':k.startsWith('lib:')?ICONL[k.slice(4)]||k:keyLabel(k);
  openBS(`<div class="gsh"><div class="screen"><canvas id="gs-pv" width="800" height="480" aria-label="Vista previa de Inicio con ${esc(pretty(F))} marcado"></canvas></div>
      <div class="e-bar"><div><h2>${esc(pretty(F))}</h2></div><span class="sp"></span><div class="seg" id="gs-st" role="group" aria-label="Estado"><button data-s="0" aria-pressed="${!S.gstate}">Reposo</button><button data-s="1" aria-pressed="${S.gstate===1}">Pulsado</button></div></div></div>
    <p class="lbl">Icono</p><p class="note" style="margin:-4px 0 2px">Toca uno. Para subir el tuyo (PNG o SVG): «Mis iconos». Para buscar entre 3.800: «Ver todos».</p>
    <div class="icg" id="gs-ic">${icons.map(k=>`<button class="icb${k==='all'?' all':''}" data-k="${k}" aria-pressed="${cur===k}" title="${esc(icT(k))}"><canvas width="88" height="88" data-ico="${k}"></canvas><span>${esc(icT(k))}</span></button>`).join('')}</div>
    <p class="lbl">Color de este botón</p>
    <div id="gs-col">${swatches(ps.hue!=null?ps.hue:'none',{none:'Como el resto',label:'Color de este botón'})}</div>
    <div class="gnav"><button class="btn o sm" data-mv="-1"${idx<=0?' disabled':''}>‹ Anterior</button><button class="btn sm" data-done>Hecho</button><button class="btn o sm" data-mv="1"${idx>=fs.length-1?' disabled':''}>Siguiente ›</button></div>`);
  const bs=$('#bs');bs.onclick=null;
  const gcv=$('#gs-pv'),pv=()=>drawPreview(gcv,{scr:'home',gen:true,state:S.gstate||0,selP:F.path});
  $('#gs-st').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.gstate=+b.dataset.s;$$('#gs-st button').forEach(x=>x.setAttribute('aria-pressed',x===b));pv();const m=$('#pv');if(m)drawPreview(m,{scr:'home',gen:true,state:S.gstate})};
  let gd=-1;gcv.onpointerdown=e=>{gd=slotAt(gcv,e).i};gcv.onpointerup=e=>{const h=slotAt(gcv,e),i=gd;gd=-1;if(i<0||h.i!==i)return;const n=slotF(S.layout.slots[i]);if(n&&n!==F&&fs.includes(n))genSheet(n,upd)};
  const col=getComputedStyle(document.body).color;
  $$('#gs-ic canvas').forEach(cv=>{const k=cv.dataset.ico,x=cv.getContext('2d');x.clearRect(0,0,88,88);
    if(k==='orig'){const mk=extractIcon(F);if(mk)drawMask(x,mk,44,44,Math.min(70/mk.bw,70/mk.bh),col,0);else{x.fillStyle=col;x.font='600 13px Inter,sans-serif';x.textAlign='center';x.fillText('No hay',44,48)}}
    else if(k==='png'){const q=g.per[F.path]||{};if(q.png)drawMask(x,q.png,44,44,.72,col,0);else{x.strokeStyle=col;x.lineWidth=4;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(44,62);x.lineTo(44,26);x.moveTo(30,40);x.lineTo(44,26);x.lineTo(58,40);x.moveTo(26,66);x.lineTo(62,66);x.stroke()}}
    else if(k==='all'){x.fillStyle=col;for(let i=0;i<3;i++)for(let j=0;j<3;j++){x.globalAlpha=i===1&&j===1?1:.45;x.beginPath();x.arc(28+i*16,28+j*16,4.5,0,7);x.fill()}x.globalAlpha=1}
    else drawIconKey(x,k,44,44,52,col,0)});
  pv();
  $('#gs-ic').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
    if(k==='png'&&!ps.png){S.ipk=S.ipk||{q:'',cat:'my',n:96};S.ipk.cat='my';S.ipk.q='';iconPicker({title:'Icono para '+pretty(F),cur,back:()=>genSheet(F,upd),onPick:nk=>{p().icon=nk;upd();genSheet(F,upd)}});return}
    if(k==='all'){iconPicker({title:'Icono para '+pretty(F),cur,back:()=>genSheet(F,upd),onPick:nk=>{p().icon=nk;upd();genSheet(F,upd)}});return}
    if(k==='orig'&&!extractIcon(F)){toast('No he podido separar el icono original de este botón');return}
    p().icon=k;$$('#gs-ic .icb').forEach(x=>x.setAttribute('aria-pressed',x===b));upd();pv()};
  const sw=$('#gs-col .swg');sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;p().hue=b.dataset.h==='none'?null:+b.dataset.h;sw.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));upd();pv()};
  sw.querySelector('[data-pick]').onchange=e=>{p().hue=Math.round(hexHsl(e.target.value)[0]);upd();pv()};
  bs.querySelector('[data-done]').onclick=()=>closeBS();
  $$('[data-mv]',bs).forEach(b=>b.onclick=()=>{const n=fs[idx+ +b.dataset.mv];if(n)genSheet(n,upd)});
}

/* ============ kit de prueba ============ */
async function makeKit(){
  if(S.demo){toast('Carga primero tu backup');openLoad();return}
  const navi=byName('home/home_navi_btn.bmp'),radio=byName('home/home_radio_btn.bmp'),bg=byName('common/home_bg.bmp');
  if(!navi||!radio||!bg){toast('Tu backup no tiene los archivos que usa la prueba',{ms:5000});return}
  toast('Preparando el kit…');
  const tileKit=(F,key)=>{const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d');const cols=['#1d4ed8','#15803d','#52525b','#c2410c'];
    for(let s=0;s<fr;s++){const ox=s*fw;x.fillStyle=cols[s%4];x.fillRect(ox,0,fw,F.h);x.strokeStyle='#ffffff';x.lineWidth=3;x.strokeRect(ox+6,6,fw-12,F.h-12);
      x.fillStyle='#ffffff';x.textAlign='center';x.textBaseline='middle';x.font='bold 70px sans-serif';x.fillText(String(s+1),ox+fw/2,F.h*.45);x.font='bold 15px sans-serif';x.fillText('ESTADO '+(s+1),ox+fw/2,F.h-24)}
    const im=x.getImageData(0,0,F.w,F.h),R=30,key8=new Uint8Array(F.w*F.h);
    if(key)for(let s=0;s<fr;s++)for(let y=0;y<F.h;y++)for(let xx=0;xx<fw;xx++){const dx=xx<R?R-xx:xx>fw-1-R?xx-(fw-1-R):0,dy=y<R?R-y:y>F.h-1-R?y-(F.h-1-R):0;if(dx&&dy&&dx*dx+dy*dy>R*R){const i=y*F.w+s*fw+xx;key8[i]=1}}
    const q=quantize(im.data,F.w,F.h,{key:key8,dither:false});return new Uint8Array(encodeBMP8(F.w,F.h,q.idx,q.pal,F))};
  const bgKit=F=>{const c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d');x.fillStyle='#05070b';x.fillRect(0,0,F.w,F.h);
    for(let v=0;v<=800;v+=20){x.fillStyle=v%100?'#1b2433':'#3e5274';x.fillRect(v,0,v%100?1:2,480)}for(let v=0;v<=480;v+=20){x.fillStyle=v%100?'#1b2433':'#3e5274';x.fillRect(0,v,800,v%100?1:2)}
    x.fillStyle='#e8eef7';x.font='bold 15px sans-serif';x.textBaseline='top';for(let v=100;v<800;v+=100)x.fillText(String(v),v+4,82);x.textBaseline='middle';for(let v=100;v<480;v+=100)x.fillText(String(v),6,v-9);
    x.strokeStyle='#f5b75c';x.lineWidth=2;x.beginPath();x.moveTo(400,0);x.lineTo(400,480);x.moveTo(0,240);x.lineTo(800,240);x.stroke();
    x.fillStyle='#f5b75c';x.textAlign='center';x.font='bold 16px sans-serif';x.fillText('PRUEBA SKINHZ · haz una foto de frente',400,462);
    const im=x.getImageData(0,0,F.w,F.h),q=quantize(im.data,F.w,F.h,{key:null,dither:false});return new Uint8Array(encodeBMP8(F.w,F.h,q.idx,q.pal,F))};
  const R=S.root,files=[[navi,tileKit(navi,true)],[radio,tileKit(radio,false)],[bg,bgKit(bg)]];
  for(const [F,u] of files){const b=parseBMP(u.buffer);if(b.w!==F.w||b.h!==F.h){toast('Error al preparar el kit');return}}
  const txt=[`Kit de prueba de Mediaskinhz · backup ${R}`,'','Cambia 3 imágenes para responder 4 preguntas con una sola prueba en el coche:','',
    `1. Navegación (${R}/${navi.path}): tiene las esquinas en amarillo de transparencia.`,'   ¿Las esquinas se ven transparentes (se ve el fondo) o amarillas?','',
    `2. Radio (${R}/${radio.path}): igual pero sin transparencia. Sirve de comparación.`,'   ¿Qué número se ve en reposo? ¿Y mientras lo mantienes pulsado?','',
    `3. Fondo de Inicio (${R}/${bg.path}): una regla con líneas cada 20 px y números cada 100 px.`,'   Haz una foto de la pantalla de Inicio de frente: con ella se calculan las posiciones reales de los botones.','',
    '4. Si la radio arranca y muestra las tres imágenes, acepta las paletas de 256 colores que usa Mediaskinhz al sustituir imágenes.','',
    'Instalación: descomprime en la raíz del USB, entra con Total Commander y copia la carpeta '+R+' encima de la del equipo (en muchos equipos \\Storage Card\\System\\Img\\'+R+'). Reinicia.',
    'Para dejarlo como estaba: copia igual ORIGINALES\\'+R+'.'].join('\r\n');
  const ents=[...files.map(([F,u])=>({name:R+'/'+F.path,data:u})),...files.map(([F])=>({name:'ORIGINALES/'+R+'/'+F.path,data:new Uint8Array(F.buf)})),{name:'LEEME_PRUEBA.txt',data:new TextEncoder().encode(txt)}];
  await saveBlob(await makeZip(ents),'mediaskinhz-kit-de-prueba.zip');
}
