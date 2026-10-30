
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
// Botones con dos iconos (p. ej. llamar y colgar: 8 estados = 2 grupos de 4)
const fgroups=F=>{const fr=frames(F);return fr>4&&fr%4===0?fr/4:1};
function extractIcon(F,grp){grp=grp||0;if(F.icoFr!==frames(F)){F.icoFr=frames(F);F.ico=undefined;F.icoG=[]}
  if(grp){if(F.icoG[grp]!==undefined)return F.icoG[grp];const sv=F.ico;F.ico=undefined;const r=extractIcon1(F,grp*4);F.icoG[grp]=r;F.ico=sv;return r}
  if(F.ico!==undefined)return F.ico;return extractIcon1(F,0)}
function extractIcon1(F,base){const fr=frames(F);if(fr<2){F.ico=null;return null}
  const fw=F.w/fr,h=F.h,pal=F.pal,idx=F.idx,B=4;
  // máscara del icono en un estado: lo que se aparta del color típico de su fila
  const det=ox=>{const m=new Float32Array(fw*h);
    for(let y=B;y<h-B;y++){const rs=[],gs=[],bs=[];for(let x=B;x<fw-B;x++){const p=idx[y*F.w+ox+x]*3;rs.push(pal[p]);gs.push(pal[p+1]);bs.push(pal[p+2])}
      const med=a=>{a.sort((u,v)=>u-v);return a[a.length>>1]},mr=med(rs.slice()),mg=med(gs.slice()),mb=med(bs.slice());
      for(let x=B;x<fw-B;x++){const p=idx[y*F.w+ox+x]*3,dr=pal[p]-mr,dg=pal[p+1]-mg,db=pal[p+2]-mb,d=Math.sqrt(dr*dr+dg*dg+db*db);m[y*fw+x]=cl((d-26)/64)}}
    const bl=new Float32Array(fw*h);for(let y=1;y<h-1;y++)for(let x=1;x<fw-1;x++){let a=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)a+=m[(y+j)*fw+x+i];bl[y*fw+x]=a/9}
    for(let i=0;i<fw*h;i++){const v=cl((bl[i]-.22)/.36);m[i]=v*v*(3-2*v)}
    let x0=fw,y0=h,x1=-1,y1=-1,sum=0;for(let y=0;y<h;y++)for(let x=0;x<fw;x++)if(m[y*fw+x]>.5){sum++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
    return {m,sum,x0,y0,x1,y1,ok:sum>=30&&x1-x0<=fw*.9&&y1-y0<=h*.9}};
  // se recorta de un estado donde salga limpio, pero solo si también hay icono en reposo: los botones de solo texto (p. ej. «Principal», «Lista»)
  // tienen una textura de rayas que en el pulsado parece un dibujo
  // se prueba primero el pulsado y luego reposo, apagado y pulsado-activo: en algunos (p. ej. el micro del teléfono) la textura del pulsado tapa el dibujo
  // hay icono si se ve en reposo y también en el estado apagado (los de solo texto tienen el apagado vacío)
  if(det(base*fw).sum<30||(base+2<fr&&det((base+2)*fw).sum<30)){F.ico=null;return null}let r=null;for(const k of [1,0,2,3]){if(base+k>=fr)continue;const t=det((base+k)*fw);if(t.ok){r=t;break}}if(!r){F.ico=null;return null}const {m,x0,y0,x1,y1}=r;
  const c=document.createElement('canvas');c.width=fw;c.height=h;const x=c.getContext('2d'),im=x.createImageData(fw,h);
  for(let i=0;i<fw*h;i++){im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=255;im.data[i*4+3]=Math.round(m[i]*255)}x.putImageData(im,0,0);
  F.ico={cv:c,bx:x0,by:y0,bw:x1-x0+1,bh:y1-y0+1};return F.ico}
// tono propio de un grupo (p. ej. el rojo de colgar), sacado de su estado pulsado
function grpHue(F,grp){const fr=frames(F),fw=F.w/fr,ox=(grp*4+1)*fw;let sx=0,sy=0;for(let y=0;y<F.h;y+=2)for(let x=0;x<fw;x+=2){const p=F.idx[y*F.w+ox+x]*3,r=F.pal[p],g=F.pal[p+1],b=F.pal[p+2];if(isKey(r,g,b))continue;const C=(Math.max(r,g,b)-Math.min(r,g,b))/255;if(C<.25)continue;const [h]=rgb2hsl(r,g,b);sx+=Math.cos(h*Math.PI/180)*C;sy+=Math.sin(h*Math.PI/180)*C}return sx||sy?(Math.atan2(sy,sx)*180/Math.PI+360)%360:0}
function drawMask(x,mk,cx,cy,k,col,glow){const t=document.createElement('canvas');t.width=mk.cv.width;t.height=mk.cv.height;const tx=t.getContext('2d');tx.fillStyle=col;tx.fillRect(0,0,t.width,t.height);tx.globalCompositeOperation='destination-in';tx.drawImage(mk.cv,0,0);
  x.save();if(glow){x.shadowColor=col;x.shadowBlur=glow}x.drawImage(t,mk.bx,mk.by,mk.bw,mk.bh,cx-mk.bw*k/2,cy-mk.bh*k/2,mk.bw*k,mk.bh*k);x.restore()}
function pngMask(bmp){const s=96,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d'),sc=Math.min(s/bmp.width,s/bmp.height);x.drawImage(bmp,(s-bmp.width*sc)/2,(s-bmp.height*sc)/2,bmp.width*sc,bmp.height*sc);
  const d=x.getImageData(0,0,s,s);let opaque=0;for(let i=0;i<s*s;i++)if(d.data[i*4+3]>200)opaque++;
  if(opaque>s*s*.9){for(let i=0;i<s*s;i++){const l=(d.data[i*4]*.3+d.data[i*4+1]*.59+d.data[i*4+2]*.11);d.data[i*4+3]=l>128?255-((255-l)*2):0}}
  for(let i=0;i<s*s;i++){d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=255}x.putImageData(d,0,0);return {cv:c,bx:0,by:0,bw:s,bh:s}}

/* ============ generador ============ */
const GSTYLES=[['glow','Brillo inferior'],['flat','Plano'],['outline','Contorno'],['glass','Cristal'],['neon','Neón'],['tile','Mosaico'],['minimal','Mínimo'],['metal','Aluminio'],['carbon','Carbono'],['aurora','Aurora'],['hud','Futurista'],['hudb','Futurista grande'],['hudf','Futurista marco'],['chamfer','Biselado'],['scan','Escáner'],['led','Luces LED'],['double','Doble línea'],['side','Barra lateral'],['beam','Haz central'],['emboss','Relieve'],['halo','Halo'],['sunset','Ocaso'],['grid','Rejilla'],['slash','Diagonal'],['notch','Muesca'],['stripes','Rayas'],['capsule','Cápsula brillante'],['ring','Anillo'],['tab','Pestaña'],['corner','Esquinas'],['pixel','Píxel retro'],['gborder','Borde degradado'],['inset','Hundido'],['dots','Puntos'],['wave','Onda'],['split','Dos tonos'],['circuit','Circuito'],['brushed','Metal de color'],['alu','Aluminio cepillado'],['smoke','Cristal ahumado'],['bevel3d','Botón 3D'],['duo','Neón dúo'],['hex','Octógono'],['ticket','Etiqueta'],['frost','Esmerilado'],['soft','Suave'],['vivid','Degradado vivo'],['brush','Pincelada'],['spray','Grafiti']];
const defGen=()=>({isIn:1.15,look:'orig',style:'glow',shape:'round',r:14,inset:4,corners:'bg',color:'orig',hue:156,is:56,iy:42,per:{}});
function origHue(F){if(F.oh!=null)return F.oh;const cnt=new Uint32Array(256);for(let i=0;i<F.idx.length;i++)cnt[F.idx[i]]++;let sx=0,sy=0;
  for(let i=0;i<F.n;i++){if(!cnt[i])continue;const r=F.pal[i*3],g=F.pal[i*3+1],b=F.pal[i*3+2];if(isKey(r,g,b))continue;const C=(Math.max(r,g,b)-Math.min(r,g,b))/255;if(C<.2)continue;const [h]=rgb2hsl(r,g,b),w=cnt[i]*C*C;sx+=Math.cos(h*Math.PI/180)*w;sy+=Math.sin(h*Math.PI/180)*w}
  F.oh=sx||sy?Math.round(((Math.atan2(sy,sx)*180/Math.PI)+360)%360):210;return F.oh}
function borderColor(F){if(F.bdc)return F.bdc;const fw=F.w/frames(F),rs=[],gs=[],bs=[];const add=(x,y)=>{const i=F.idx[y*F.w+x]*3;if(isKey(F.pal[i],F.pal[i+1],F.pal[i+2]))return;rs.push(F.pal[i]);gs.push(F.pal[i+1]);bs.push(F.pal[i+2])};
  for(let x=0;x<fw;x++){add(x,0);add(x,F.h-1)}for(let y=0;y<F.h;y++){add(0,y);add(fw-1,y)}const m=a=>{a.sort((u,v)=>u-v);return a[a.length>>1]||0},r=m(rs),G=m(gs),B=m(bs);
  // las pantallas del MediaNav son oscuras: un borde claro o de color es parte del botón, no del fondo
  F.bdc=(r*.3+G*.59+B*.11)<60?`rgb(${r},${G},${B})`:'#000';return F.bdc}
const NOBRITE=new Set(['metal','frost']);
// estilos que dibujan su cuerpo con rectángulos (no con el primer relleno): al pulsar se aclara encima para que se lea el texto negro de la radio
const LIFT=new Set(['split','bevel3d','pixel','frost','soft','carbon']);
const THRU=new Set(['spray','hud','hudb','hudf','outline','neon','halo','grid','ring','corner','gborder','wave','circuit','duo','notch','scan','led','double','beam','dots','slash','minimal']);
function bgAvg(B){if(B.avgv===S.ver&&B.avg)return B.avg;const d=renderCanvas(B,false).getContext('2d').getImageData(0,260,800,160).data;let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=16){r+=d[i];g+=d[i+1];b+=d[i+2];n++}B.avg=`rgb(${r/n|0},${g/n|0},${b/n|0})`;B.avgv=S.ver;return B.avg}
function vwPos(F){const kp=KNOWNPOS[F.lc];if(kp)return {x:kp[0],y:kp[1],s:'home'};if(typeof VW==='undefined'||!VW.data)return null;if(F.vpv===VW.data)return F.vp;let r=null;for(const o of VW.data){for(const c of o.c||[])if(c[0]===F.lc){r={x:c[1],y:c[2],w:c[3],h:c[4],s:o.s==='common'?'radio':o.s};break}if(r)break}F.vp=r;F.vpv=VW.data;return r}
const presetBgOn=()=>[...SCRBG.values()].some(n=>{const B=byName(n);return B&&B.rep&&B.rep.by==='preset'});
function cornerBase(F){const s=S.layout.slots.find(s=>s.p===F.path),bg=byName('common/home_bg.bmp'),fw=F.w/frames(F),c=document.createElement('canvas');c.width=fw;c.height=F.h;const x=c.getContext('2d');
  // fuera de Inicio: el color del borde original, teñido con el color de toda la radio (si lo hay) para que no quede un marco de otro color
  // con un fondo de diseño listo, las esquinas de dentro son transparentes (amarillo clave, como ya hacen muchos originales) para que no salgan cajas negras
  // con un fondo de diseño listo: si se sabe dónde va el botón (vistas del programa), debajo va ese trozo del fondo; si no, transparente
  if(!s&&presetBgOn()){const p=vwPos(F),B=p&&byName(SCRBG.get(p.s));if(B){x.drawImage(renderCanvas(B,false),p.x,p.y,fw,F.h,0,0,fw,F.h);c.full=true;return c}if(F.keyCount)return c;
    // sin posición conocida (teclados alternativos, botones de otras versiones…): el color medio del fondo de su pantalla, nunca negro
    const sc=SECSCR[F.sec]||'home',B2=byName(SCRBG.get(sc))||byName(SCRBG.get('home'));if(B2){x.fillStyle=bgAvg(B2);x.fillRect(0,0,fw,F.h);c.full=true}return c}
  if(!s){if(!F.keyCount){let col=borderColor(F);const ph=((S.gen&&S.gen.per[F.path])||{}).hue,o=typeof ph==='number'?{...defOps(),tH:ph,tA:100}:S.ops.global;if(o&&o.tA){const m=col.match(/\d+/g);if(m){const [r,g,b]=applyOps(m.slice(0,3).map(Number),{...o,tG:true});col=`rgb(${r},${g},${b})`}}x.fillStyle=col;x.fillRect(0,0,fw,F.h)}return c}x.fillStyle='#000';x.fillRect(0,0,fw,F.h);
  if(s&&bg)x.drawImage(renderCanvas(bg,false),s.x,s.y,fw,F.h,0,0,fw,F.h);return c}
function rrect(x,X,Y,W,H,r){r=Math.max(0,Math.min(r,W/2,H/2));x.beginPath();x.moveTo(X+r,Y);x.lineTo(X+W-r,Y);x.arcTo(X+W,Y,X+W,Y+r,r);x.lineTo(X+W,Y+H-r);x.arcTo(X+W,Y+H,X+W-r,Y+H,r);x.lineTo(X+r,Y+H);x.arcTo(X,Y+H,X,Y+H-r,r);x.lineTo(X,Y+r);x.arcTo(X,Y,X+r,Y,r);x.closePath()}
const gRad=(g,h)=>g.shape==='rect'?0:g.shape==='pill'?(h-2*g.inset)/2:g.r;
function genIconSrc(F,g){const p=g.per[F.path]||{};const k=p.icon||(extractIcon(F)?'orig':S.layout.slots.some(s=>s.p===F.path)?'lib:'+defIcon(F):'none');return k}  // fuera de Inicio, un botón sin dibujo (solo texto) sigue sin icono
function drawState(x,F,w,h,s,H,g,bgc){
  const grp=fgroups(F)>1?s>>2:0;s=s%4;if(grp&&/dial_btn_call/.test(F.lc))H=grpHue(F,grp);// el botón de llamar conserva su verde/rojo de colgar; el resto de tiras dobles van del color del diseño
  const on=s%2===1,dim=s===2,ins=g.inset,X=ins,Y=ins,W=w-2*ins,Hh=h-2*ins,r=gRad(g,h);
  x.drawImage(bgc,0,0);
  const lin=(a,b,c)=>{const gr=x.createLinearGradient(0,Y,0,Y+Hh);gr.addColorStop(0,a);if(c){gr.addColorStop(.62,b);gr.addColorStop(1,c)}else gr.addColorStop(1,b);return gr};
  let ic,glow=0;rrect(x,X+1,Y+1,W-2,Hh-2,r);
  // estilos de solo líneas sobre un fondo de diseño listo: el cuerpo en reposo deja ver el fondo (en Inicio, un velo suave; dentro, transparente)
  // en vez de una placa negra encima. Pulsado sigue relleno para que se note
  const thru=!on&&THRU.has(g.style)&&typeof presetBgOn==='function'&&presetBgOn(),hmT=S.layout.slots.some(q=>q.p===F.path)||!!bgc.full,of=x.fill;let firstF=true;
  // pulsado y seleccionado (estados 2 y 4): la radio escribe el texto en NEGRO encima, así que el cuerpo tiene que ser claro (como en los de Renault).
  // Se cambia solo el primer relleno de cada estilo (su cuerpo, con su forma); los adornos del estilo se dibujan encima
  const brite=on&&!NOBRITE.has(g.style);
  if(thru||brite)x.fill=function(...a){if(firstF){firstF=false;if(brite){x.save();const sa=g.style==='alu'?6:88;x.fillStyle=lin(`hsl(${H} ${sa}% 68%)`,`hsl(${H} ${sa}% 47%)`);of.apply(x,a);x.restore();return}if(hmT){x.save();x.fillStyle=dim?'rgba(0,0,0,.5)':'rgba(0,0,0,.32)';of.apply(x,a);x.restore()}return}return of.apply(x,a)};
  switch(g.style){
    case 'flat':x.fillStyle=on?`hsl(${H} 78% 50%)`:`hsl(${H} 42% ${dim?9:19}%)`;x.fill();ic=on?'#ffffff':`hsl(${H} 80% ${dim?36:62}%)`;break;
    case 'outline':x.fillStyle=on?`hsl(${H} 70% 15%)`:'#030405';x.fill();x.lineWidth=on?4:3;x.strokeStyle=`hsl(${H} 85% ${on?60:dim?28:52}%)`;rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke();ic=on?'#ffffff':`hsl(${H} 80% ${dim?30:58}%)`;break;
    case 'glass':x.fillStyle=on?lin(`hsl(${H} 75% 58%)`,`hsl(${H} 75% 32%)`):lin(`hsl(${H} 25% ${dim?12:24}%)`,`hsl(${H} 25% ${dim?4:7}%)`);x.fill();
      x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,'rgba(255,255,255,.22)');gl.addColorStop(1,'rgba(255,255,255,.02)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.5);x.restore();
      x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.3)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=on?'#ffffff':dim?'#7d838d':'#eef2f7';break;
    case 'neon':x.fillStyle=on?`hsl(${H} 90% 10%)`:'#020304';x.fill();x.save();x.shadowColor=`hsl(${H} 100% 55%)`;x.shadowBlur=on?18:10;x.lineWidth=2.5;x.strokeStyle=`hsl(${H} 100% ${dim?30:on?70:60}%)`;rrect(x,X+4,Y+4,W-8,Hh-8,Math.max(0,r-3));x.stroke();x.restore();ic=`hsl(${H} 100% ${dim?40:72}%)`;glow=dim?0:on?16:10;break;
    case 'tile':x.fillStyle=on?`hsl(${H} 85% 34%)`:`hsl(${H} 72% ${dim?20:44}%)`;x.fill();if(on){x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.55)';rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke()}ic=dim?`hsl(${H} 25% 62%)`:'#ffffff';break;
    case 'minimal':x.fillStyle=on?`hsla(${H},85%,50%,.26)`:'rgba(0,0,0,0)';x.fill();x.fillStyle=`hsl(${H} 85% ${on?62:dim?26:50}%)`;x.fillRect(X+W*.2,Y+Hh-(on?5:3),W*.6,on?4:2);ic=on?'#ffffff':`hsl(${H} 80% ${dim?32:64}%)`;break;
    case 'metal':{x.fillStyle=on?lin('#e6e9ec','#b3b9bf','#cdd2d7'):lin(dim?'#4a4f55':'#878e96',dim?'#2c3034':'#4b5158',dim?'#3a3e43':'#666d74');x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
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
    case 'hudb':case 'hudf':{const big=g.style==='hudb';x.fillStyle=on?`hsla(${H},80%,40%,.32)`:'rgba(3,6,9,.9)';x.fill();
      const L=Math.max(10,Math.min(W,Hh)*(big?.32:.22)),c2=`hsl(${H} 95% ${on?72:dim?30:58}%)`,a=X+4,b=Y+4,c=X+W-4,d=Y+Hh-4;
      x.save();if(!big){x.strokeStyle=`hsla(${H},90%,60%,${on?.55:dim?.12:.3})`;x.lineWidth=1;rrect(x,a+.5,b+.5,c-a-1,d-b-1,Math.max(0,r-4));x.stroke()}
      x.strokeStyle=c2;x.lineWidth=big?(on?3.6:3):(on?2.6:2);x.shadowColor=c2;x.shadowBlur=dim?0:big?9:6;x.lineCap='square';x.beginPath();
      x.moveTo(a,b+L);x.lineTo(a,b);x.lineTo(a+L,b);x.moveTo(c-L,b);x.lineTo(c,b);x.lineTo(c,b+L);x.moveTo(c,d-L);x.lineTo(c,d);x.lineTo(c-L,d);x.moveTo(a+L,d);x.lineTo(a,d);x.lineTo(a,d-L);x.stroke();
      if(!big){x.lineWidth=2;x.beginPath();x.moveTo(w/2-W*.08,d);x.lineTo(w/2+W*.08,d);x.stroke()}x.restore();ic=on?'#ffffff':c2;glow=dim?0:on?9:5;break}
    case 'chamfer':{const k=Math.max(6,Math.min(W,Hh)*.22),a=X+2,b=Y+2,c=X+W-2,d=Y+Hh-2;x.beginPath();x.moveTo(a+k,b);x.lineTo(c,b);x.lineTo(c,d-k);x.lineTo(c-k,d);x.lineTo(a,d);x.lineTo(a,b+k);x.closePath();
      const gr=x.createLinearGradient(0,b,0,d);gr.addColorStop(0,on?`hsl(${H} 70% 34%)`:`hsl(${H} 30% ${dim?6:12}%)`);gr.addColorStop(1,on?`hsl(${H} 75% 22%)`:'#050607');x.fillStyle=gr;x.fill();
      x.save();x.lineWidth=2;x.strokeStyle=`hsl(${H} 90% ${on?72:dim?26:55}%)`;x.shadowColor=x.strokeStyle;x.shadowBlur=dim?0:5;x.stroke();x.restore();
      x.fillStyle=`hsl(${H} 95% ${on?80:dim?30:60}%)`;x.beginPath();x.moveTo(c-k*.7,b);x.lineTo(c,b);x.lineTo(c,b+k*.7);x.closePath();x.fill();x.beginPath();x.moveTo(a,d);x.lineTo(a+k*.7,d);x.lineTo(a,d-k*.7);x.closePath();x.fill();
      ic=on?'#ffffff':`hsl(${H} 85% ${dim?32:66}%)`;glow=on&&!dim?8:0;break}
    case 'scan':{x.fillStyle=on?`hsl(${H} 55% 14%)`:'#040607';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
      for(let yy=Y;yy<Y+Hh;yy+=3){x.fillStyle=`hsla(${H},80%,60%,${on?.1:dim?.02:.05})`;x.fillRect(X,yy,W,1)}
      const gl=x.createLinearGradient(0,Y+Hh*.55,0,Y+Hh);gl.addColorStop(0,`hsla(${H},90%,55%,0)`);gl.addColorStop(1,`hsla(${H},90%,55%,${on?.55:dim?.08:.28})`);x.fillStyle=gl;x.fillRect(X,Y+Hh*.55,W,Hh*.45);x.restore();
      x.save();x.fillStyle=`hsl(${H} 95% ${on?75:dim?30:60}%)`;x.shadowColor=x.fillStyle;x.shadowBlur=dim?0:8;x.fillRect(X+W*.1,Y+Hh-4,W*.8,2);x.restore();
      x.lineWidth=1;x.strokeStyle=`hsla(${H},70%,60%,${on?.6:.22})`;rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 85% ${dim?30:68}%)`;glow=dim?0:5;break}
    case 'led':{x.fillStyle=on?`hsl(${H} 60% 13%)`:'#050607';x.fill();const st=7,c2=`hsl(${H} 100% ${on?72:dim?28:58}%)`;x.save();x.fillStyle=c2;x.shadowColor=c2;x.shadowBlur=dim?0:on?6:3;
      const dot=(px,py)=>{x.beginPath();x.arc(px,py,on?1.8:1.5,0,7);x.fill()},a=X+5,b=Y+5,c=X+W-5,d=Y+Hh-5;
      for(let px=a;px<=c+.1;px+=(c-a)/Math.max(1,Math.round((c-a)/st))){dot(px,b);dot(px,d)}for(let py=b;py<=d+.1;py+=(d-b)/Math.max(1,Math.round((d-b)/st))){dot(a,py);dot(c,py)}x.restore();
      ic=on?'#ffffff':c2;glow=dim?0:on?10:5;break}
    case 'double':{x.fillStyle=on?`hsl(${H} 60% 20%)`:'#060708';x.fill();x.lineWidth=2;x.strokeStyle=`hsl(${H} 85% ${on?68:dim?24:52}%)`;rrect(x,X+2,Y+2,W-4,Hh-4,r);x.stroke();
      x.lineWidth=1;x.strokeStyle=`hsla(${H},85%,${on?80:60}%,${dim?.2:.55})`;rrect(x,X+6.5,Y+6.5,W-13,Hh-13,Math.max(0,r-5));x.stroke();ic=on?'#ffffff':`hsl(${H} 80% ${dim?30:64}%)`;break}
    case 'side':{x.fillStyle=on?`hsl(${H} 50% 18%)`:lin('#15181c','#07080a');x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const bw=Math.max(4,W*.035);
      x.fillStyle=`hsl(${H} 90% ${on?66:dim?26:52}%)`;x.shadowColor=x.fillStyle;x.shadowBlur=dim?0:8;x.fillRect(X+1,Y+1,bw,Hh-2);x.restore();
      x.lineWidth=1;x.strokeStyle=`hsla(${H},40%,60%,${on?.5:.18})`;rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=on?'#ffffff':dim?'#6b7178':'#e9eef4';break}
    case 'beam':{x.fillStyle='#040506';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gr=x.createLinearGradient(X,0,X+W,0);
      gr.addColorStop(0,`hsla(${H},90%,50%,0)`);gr.addColorStop(.5,`hsla(${H},90%,55%,${on?.7:dim?.08:.32})`);gr.addColorStop(1,`hsla(${H},90%,50%,0)`);x.fillStyle=gr;x.fillRect(X,Y,W,Hh);
      x.fillStyle=`hsla(${H},100%,80%,${on?.9:dim?.15:.55})`;x.fillRect(X+W*.25,Y+1,W*.5,1.5);x.fillRect(X+W*.25,Y+Hh-2.5,W*.5,1.5);x.restore();
      ic=on?'#ffffff':dim?`hsl(${H} 30% 40%)`:'#f2f6fa';glow=dim?0:on?10:6;break}
    case 'emboss':{x.fillStyle=on?`hsl(${H} 45% 22%)`:`hsl(${H} 25% ${dim?9:16}%)`;x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
      x.lineWidth=4;x.strokeStyle=on?'rgba(0,0,0,.55)':'rgba(255,255,255,.22)';x.beginPath();x.moveTo(X+2,Y+Hh-2);x.lineTo(X+2,Y+2);x.lineTo(X+W-2,Y+2);x.stroke();
      x.strokeStyle=on?'rgba(255,255,255,.18)':'rgba(0,0,0,.6)';x.beginPath();x.moveTo(X+W-2,Y+2);x.lineTo(X+W-2,Y+Hh-2);x.lineTo(X+2,Y+Hh-2);x.stroke();x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsl(${H} 70% ${on?60:dim?22:40}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 75% ${dim?32:66}%)`;break}
    case 'halo':{x.fillStyle='#05070a';x.fill();x.save();x.shadowColor=`hsl(${H} 100% 55%)`;x.shadowBlur=on?22:dim?0:12;x.lineWidth=on?3:2;x.strokeStyle=`hsla(${H},100%,${on?72:62}%,${dim?.35:.95})`;
      rrect(x,X+7,Y+7,W-14,Hh-14,Math.max(0,r-4));x.stroke();if(on){x.fillStyle=`hsla(${H},90%,55%,.18)`;x.fill()}x.restore();ic=on?'#ffffff':`hsl(${H} 100% ${dim?40:74}%)`;glow=dim?0:on?14:7;break}
    case 'sunset':{const gr=x.createLinearGradient(0,Y,0,Y+Hh);gr.addColorStop(0,`hsl(${(H+330)%360} ${dim?20:80}% ${on?52:dim?14:30}%)`);gr.addColorStop(.55,`hsl(${H} ${dim?20:85}% ${on?46:dim?12:24}%)`);gr.addColorStop(1,`hsl(${(H+30)%360} ${dim?20:90}% ${on?40:dim?8:14}%)`);
      x.fillStyle=gr;x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.fillStyle=`hsla(${H},100%,64%,${on?.4:dim?.06:.2})`;x.beginPath();x.ellipse(w/2,Y+Hh*1.05,W*.42,Hh*.42,0,0,Math.PI*2);x.fill();x.restore();
      if(on){x.lineWidth=2.5;x.strokeStyle='rgba(255,255,255,.7)';rrect(x,X+2,Y+2,W-4,Hh-4,Math.max(0,r-1));x.stroke()}ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    case 'grid':{x.fillStyle=on?`hsl(${H} 55% 14%)`:'#050709';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.strokeStyle=`hsla(${H},90%,60%,${on?.32:dim?.06:.16})`;x.lineWidth=1;const q=Math.max(8,Math.round(Hh/7));
      x.beginPath();for(let xx=X+q/2;xx<X+W;xx+=q){x.moveTo(xx+.5,Y);x.lineTo(xx+.5,Y+Hh)}for(let yy=Y+q/2;yy<Y+Hh;yy+=q){x.moveTo(X,yy+.5);x.lineTo(X+W,yy+.5)}x.stroke();x.restore();
      x.lineWidth=2;x.strokeStyle=`hsl(${H} 90% ${on?68:dim?26:52}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 90% ${dim?32:70}%)`;glow=dim?0:4;break}
    case 'slash':{x.fillStyle='#07090c';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.fillStyle=`hsl(${H} ${dim?25:85}% ${on?55:dim?18:40}%)`;x.beginPath();
      x.moveTo(X,Y);x.lineTo(X+W*(on?.36:.24),Y);x.lineTo(X+W*(on?.26:.14),Y+Hh);x.lineTo(X,Y+Hh);x.closePath();x.fill();x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsla(${H},80%,60%,${on?.8:.35})`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'notch':{const n=Math.min(W*.3,90),d=Math.max(4,Hh*.09),a=X+2,b=Y+2,c=X+W-2,e=Y+Hh-2;x.beginPath();x.moveTo(a,b);x.lineTo(w/2-n/2,b);x.lineTo(w/2-n/2+d,b+d);x.lineTo(w/2+n/2-d,b+d);x.lineTo(w/2+n/2,b);x.lineTo(c,b);x.lineTo(c,e);x.lineTo(a,e);x.closePath();
      x.fillStyle=on?`hsl(${H} 55% 18%)`:'#06080b';x.fill();x.save();x.lineWidth=2;x.strokeStyle=`hsl(${H} 95% ${on?70:dim?26:56}%)`;x.shadowColor=x.strokeStyle;x.shadowBlur=dim?0:6;x.stroke();x.restore();
      x.fillStyle=`hsl(${H} 100% ${on?80:dim?30:62}%)`;for(const k of [-1,0,1]){x.beginPath();x.arc(w/2+k*Math.min(10,n/6),e-6,1.8,0,7);x.fill()}ic=on?'#ffffff':`hsl(${H} 90% ${dim?30:68}%)`;glow=dim?0:4;break}
    case 'stripes':{x.fillStyle=on?`hsl(${H} 60% 22%)`:'#0a0c10';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.strokeStyle=`hsla(${H},85%,60%,${on?.22:dim?.05:.12})`;x.lineWidth=5;x.beginPath();
      for(let k=-Hh;k<W+Hh;k+=14){x.moveTo(X+k,Y+Hh);x.lineTo(X+k+Hh,Y)}x.stroke();x.restore();x.lineWidth=2;x.strokeStyle=`hsl(${H} 80% ${on?62:dim?24:46}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();
      ic=on?'#ffffff':`hsl(${H} 85% ${dim?32:70}%)`;break}
    case 'capsule':{const R=Math.min(Hh/2-1,W/2-1);rrect(x,X+1,Y+1,W-2,Hh-2,R);const gr=x.createLinearGradient(0,Y,0,Y+Hh);gr.addColorStop(0,`hsl(${H} ${dim?25:80}% ${on?66:dim?24:52}%)`);gr.addColorStop(1,`hsl(${H} ${dim?25:85}% ${on?38:dim?10:26}%)`);x.fillStyle=gr;x.fill();
      x.save();rrect(x,X+1,Y+1,W-2,Hh-2,R);x.clip();const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,`rgba(255,255,255,${on?.5:.38})`);gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;rrect(x,X+W*.06,Y+3,W*.88,Hh*.46,R*.8);x.fill();x.restore();
      x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.35)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,R);x.stroke();ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    case 'ring':{x.fillStyle=on?`hsl(${H} 45% 14%)`:'#06080b';x.fill();x.lineWidth=1.5;x.strokeStyle=`hsla(${H},70%,55%,${dim?.2:.45})`;x.stroke();
      const hm=S.layout.slots.some(q=>q.p===F.path),cy=hm?Y+Hh*(g.iy/100):Hh>100?Y+Hh*.4:h/2,R=hm?Math.max(14,Math.min(g.is*.7,Y+Hh*.66-cy-2,W*.42)):Math.min(W*.42,Hh>100?Hh*.34:Hh*.44);const hasI=(S.layout.slots.some(q=>q.p===F.path)||!!extractIcon(F,grp))&&W/Hh>=.6;x.save();x.beginPath();if(W/Hh>2.2||!hasI)rrect(x,X+5,Y+5,W-10,Hh-10,Math.max(0,r-3));else x.arc(w/2,cy,R,0,7);x.fillStyle=`hsla(${H},85%,50%,${on?.35:dim?.04:.14})`;x.fill();
      x.lineWidth=on?3.5:2.5;x.strokeStyle=`hsl(${H} 95% ${on?70:dim?26:56}%)`;x.shadowColor=x.strokeStyle;x.shadowBlur=dim?0:on?14:6;x.stroke();x.restore();ic=on?'#ffffff':`hsl(${H} 95% ${dim?32:72}%)`;glow=dim?0:4;break}
    case 'tab':{x.fillStyle=on?`hsl(${H} 40% 18%)`:'#0b0e13';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const th=Math.max(4,Math.round(Hh*.07));
      x.fillStyle=`hsl(${H} ${dim?30:90}% ${on?66:dim?24:52}%)`;x.fillRect(X,Y,W,th);if(on){const gr=x.createLinearGradient(0,Y,0,Y+Hh*.6);gr.addColorStop(0,`hsla(${H},90%,60%,.35)`);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X,Y+th,W,Hh*.6)}x.restore();
      x.lineWidth=1;x.strokeStyle='rgba(255,255,255,.1)';rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 80% ${dim?32:74}%)`;break}
    case 'corner':{x.fillStyle=on?`hsl(${H} 50% 15%)`:'#05070a';x.fill();const L=Math.min(W,Hh)*.26,a=X+3,b=Y+3,c=X+W-3,e=Y+Hh-3;x.save();x.lineWidth=on?4:3;x.lineCap='square';
      x.strokeStyle=`hsl(${H} 95% ${on?72:dim?26:58}%)`;x.shadowColor=x.strokeStyle;x.shadowBlur=dim?0:8;x.beginPath();
      x.moveTo(a,b+L);x.lineTo(a,b);x.lineTo(a+L,b);x.moveTo(c-L,b);x.lineTo(c,b);x.lineTo(c,b+L);x.moveTo(c,e-L);x.lineTo(c,e);x.lineTo(c-L,e);x.moveTo(a+L,e);x.lineTo(a,e);x.lineTo(a,e-L);x.stroke();x.restore();
      ic=on?'#ffffff':`hsl(${H} 90% ${dim?30:70}%)`;glow=dim?0:5;break}
    case 'pixel':{const q=Math.max(4,Math.round(Hh/22));x.fillStyle='#000';x.fillRect(X,Y,W,Hh);x.fillStyle=on?`hsl(${H} 70% 42%)`:`hsl(${H} ${dim?20:60}% ${dim?10:18}%)`;x.fillRect(X+q,Y+q,W-2*q,Hh-2*q);
      x.fillStyle=`hsl(${H} 90% ${on?78:dim?30:56}%)`;x.fillRect(X+q,Y,W-2*q,q);x.fillRect(X,Y+q,q,Hh-2*q);x.fillStyle=`hsl(${H} 80% ${on?30:dim?6:12}%)`;x.fillRect(X+q,Y+Hh-q,W-2*q,q);x.fillRect(X+W-q,Y+q,q,Hh-2*q);
      if(!dim){x.fillStyle='rgba(255,255,255,.25)';x.fillRect(X+2*q,Y+2*q,q*2,q)}ic=on?'#ffffff':`hsl(${H} 90% ${dim?34:80}%)`;break}
    case 'gborder':{x.fillStyle=on?'#12161d':'#07090c';x.fill();const gr=x.createLinearGradient(X,Y,X+W,Y+Hh);gr.addColorStop(0,`hsl(${H} 95% ${dim?26:60}%)`);gr.addColorStop(.5,`hsl(${(H+60)%360} 95% ${dim?24:58}%)`);gr.addColorStop(1,`hsl(${(H+120)%360} 95% ${dim?22:56}%)`);
      x.lineWidth=on?4:2.5;x.strokeStyle=gr;rrect(x,X+2,Y+2,W-4,Hh-4,Math.max(0,r-1));x.stroke();if(on){x.save();x.globalAlpha=.18;x.fillStyle=gr;x.fill();x.restore()}ic=dim?'rgba(255,255,255,.45)':'#ffffff';glow=dim?0:3;break}
    case 'inset':{x.fillStyle=on?`hsl(${H} 40% 10%)`:`hsl(${H} 18% ${dim?10:15}%)`;x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=on?18:12;x.shadowOffsetY=on?5:3;x.lineWidth=10;x.strokeStyle='#000';rrect(x,X-4,Y-4,W+8,Hh+8,r+4);x.stroke();x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsla(${H},70%,${on?62:46}%,${dim?.25:.7})`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?`hsl(${H} 100% 72%)`:`hsl(${H} 40% ${dim?34:78}%)`;glow=on?10:0;break}
    case 'dots':{x.fillStyle=on?`hsl(${H} 55% 16%)`:'#07090c';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.fillStyle=`hsla(${H},90%,62%,${on?.4:dim?.07:.2})`;const q=Math.max(9,Math.round(Hh/9));
      for(let yy=Y+q/2;yy<Y+Hh;yy+=q)for(let xx=X+q/2;xx<X+W;xx+=q){x.beginPath();x.arc(xx,yy,q*.16,0,7);x.fill()}x.restore();x.lineWidth=2;x.strokeStyle=`hsl(${H} 85% ${on?66:dim?24:48}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();
      ic=on?'#ffffff':`hsl(${H} 90% ${dim?32:72}%)`;break}
    case 'wave':{x.fillStyle='#06080c';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();for(const [k,a] of [[.72,on?.75:dim?.12:.45],[.82,on?.5:dim?.08:.3]]){x.beginPath();x.moveTo(X,Y+Hh);
      for(let xx=0;xx<=W;xx+=4)x.lineTo(X+xx,Y+Hh*k+Math.sin(xx/W*Math.PI*2+k*6)*Hh*.07);x.lineTo(X+W,Y+Hh);x.closePath();x.fillStyle=`hsla(${H},90%,${on?58:48}%,${a})`;x.fill()}x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsla(${H},80%,60%,${on?.85:.35})`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'split':{x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.fillStyle=`hsl(${H} ${dim?20:70}% ${on?44:dim?14:28}%)`;x.fillRect(X,Y,W,Hh/2);x.fillStyle=`hsl(${H} ${dim?20:60}% ${on?30:dim?8:14}%)`;x.fillRect(X,Y+Hh/2,W,Hh/2);
      x.fillStyle=`hsla(${H},100%,${on?80:65}%,${dim?.2:.6})`;x.fillRect(X,Y+Hh/2-1,W,2);x.restore();x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.18)';rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    case 'circuit':{x.fillStyle=on?`hsl(${H} 50% 13%)`:'#05080a';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.strokeStyle=`hsla(${H},90%,58%,${on?.55:dim?.1:.3})`;x.fillStyle=x.strokeStyle;x.lineWidth=1.5;
      const P=[[.06,.3,.18,.3,.24,.18],[.06,.72,.2,.72,.26,.86],[.94,.26,.8,.26,.74,.12],[.94,.7,.82,.7,.76,.84]];for(const [a,b,c,d,e,f] of P){x.beginPath();x.moveTo(X+W*a,Y+Hh*b);x.lineTo(X+W*c,Y+Hh*d);x.lineTo(X+W*e,Y+Hh*f);x.stroke();x.beginPath();x.arc(X+W*e,Y+Hh*f,2.6,0,7);x.fill()}x.restore();
      x.lineWidth=2;x.strokeStyle=`hsl(${H} 90% ${on?66:dim?24:50}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?'#ffffff':`hsl(${H} 95% ${dim?32:70}%)`;glow=dim?0:4;break}
    case 'alu':case 'brushed':{const sa=g.style==='alu'?5:48;x.fillStyle=on?lin(`hsl(${H} ${sa}% 30%)`,`hsl(${H} ${sa}% 16%)`,`hsl(${H} ${sa}% 22%)`):lin(`hsl(${H} ${dim?sa/3:sa}% ${dim?24:52}%)`,`hsl(${H} ${dim?sa/3:sa}% ${dim?12:26}%)`,`hsl(${H} ${dim?sa/3:sa}% ${dim?16:36}%)`);x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
      let sd=w*5+h*3;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<Hh*1.6;i++){x.fillStyle=`rgba(${rnd()<.5?'255,255,255':'0,0,0'},${.03+rnd()*.06})`;x.fillRect(X,Y+rnd()*Hh,W,1)}
      const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,'rgba(255,255,255,.28)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.5);x.restore();
      x.lineWidth=1.5;x.strokeStyle=`hsla(${H},${sa}%,85%,.6)`;rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=dim?'rgba(255,255,255,.45)':on?`hsl(${H} ${sa}% 92%)`:'#ffffff';break}
    case 'smoke':{x.fillStyle=on?`hsla(${H},40%,30%,.92)`:'rgba(14,16,20,.86)';x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gl=x.createLinearGradient(X,Y,X+W*.7,Y+Hh);gl.addColorStop(0,'rgba(255,255,255,.16)');gl.addColorStop(.45,'rgba(255,255,255,.04)');gl.addColorStop(.46,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh);
      const bt=x.createLinearGradient(0,Y+Hh*.7,0,Y+Hh);bt.addColorStop(0,`hsla(${H},90%,55%,0)`);bt.addColorStop(1,`hsla(${H},90%,55%,${on?.45:dim?.05:.22})`);x.fillStyle=bt;x.fillRect(X,Y,W,Hh);x.restore();
      x.lineWidth=1.2;x.strokeStyle=`rgba(255,255,255,${dim?.1:.28})`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=dim?'rgba(255,255,255,.4)':'#ffffff';break}
    case 'bevel3d':{const b=Math.max(4,Math.round(Math.min(W,Hh)*.07));x.fillStyle=`hsl(${H} ${dim?20:60}% ${on?22:dim?10:16}%)`;x.fill();x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();
      x.fillStyle=on?'rgba(0,0,0,.45)':`hsla(${H},70%,${dim?40:75}%,.55)`;x.beginPath();x.moveTo(X,Y);x.lineTo(X+W,Y);x.lineTo(X+W-b,Y+b);x.lineTo(X+b,Y+b);x.lineTo(X+b,Y+Hh-b);x.lineTo(X,Y+Hh);x.closePath();x.fill();
      x.fillStyle=on?`hsla(${H},70%,75%,.4)`:'rgba(0,0,0,.55)';x.beginPath();x.moveTo(X+W,Y+Hh);x.lineTo(X,Y+Hh);x.lineTo(X+b,Y+Hh-b);x.lineTo(X+W-b,Y+Hh-b);x.lineTo(X+W-b,Y+b);x.lineTo(X+W,Y);x.closePath();x.fill();
      const fc=x.createLinearGradient(0,Y+b,0,Y+Hh-b);fc.addColorStop(0,`hsl(${H} ${dim?20:65}% ${on?30:dim?14:40}%)`);fc.addColorStop(1,`hsl(${H} ${dim?20:65}% ${on?38:dim?10:26}%)`);x.fillStyle=fc;x.fillRect(X+b,Y+b,W-2*b,Hh-2*b);x.restore();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'duo':{const H2=(H+150)%360;x.fillStyle=on?`hsl(${H} 40% 14%)`:'#05060a';x.fill();x.save();x.lineWidth=2.5;x.shadowBlur=dim?0:10;
      x.strokeStyle=`hsla(${H},100%,${on?70:60}%,${dim?.3:.95})`;x.shadowColor=x.strokeStyle;rrect(x,X+3,Y+3,W-6,Hh-6,Math.max(0,r-2));x.stroke();
      x.strokeStyle=`hsla(${H2},100%,${on?72:62}%,${dim?.25:.85})`;x.shadowColor=x.strokeStyle;x.lineWidth=1.5;rrect(x,X+8,Y+8,W-16,Hh-16,Math.max(0,r-6));x.stroke();x.restore();
      ic=on?'#ffffff':`hsl(${H2} 100% ${dim?36:76}%)`;glow=dim?0:8;break}
    case 'hex':{const c=Math.min(W,Hh)*.22,a=X+2,b=Y+2,e=X+W-2,f=Y+Hh-2;x.beginPath();x.moveTo(a+c,b);x.lineTo(e-c,b);x.lineTo(e,b+c);x.lineTo(e,f-c);x.lineTo(e-c,f);x.lineTo(a+c,f);x.lineTo(a,f-c);x.lineTo(a,b+c);x.closePath();
      const gr=x.createLinearGradient(0,Y,0,Y+Hh);gr.addColorStop(0,`hsl(${H} ${dim?20:70}% ${on?42:dim?14:24}%)`);gr.addColorStop(1,`hsl(${H} ${dim?20:70}% ${on?28:dim?7:11}%)`);x.fillStyle=gr;x.fill();
      x.lineWidth=2;x.strokeStyle=`hsl(${H} 90% ${on?75:dim?28:58}%)`;x.stroke();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'ticket':{const n=Math.min(Hh*.16,12),a=X+2,b=Y+2,e=X+W-2,f=Y+Hh-2,m=(b+f)/2;x.beginPath();x.moveTo(a,b);x.lineTo(e,b);x.lineTo(e,m-n);x.arc(e,m,n,-Math.PI/2,Math.PI/2,true);x.lineTo(e,f);x.lineTo(a,f);x.lineTo(a,m+n);x.arc(a,m,n,Math.PI/2,-Math.PI/2,true);x.closePath();
      x.fillStyle=on?`hsl(${H} 70% 40%)`:`hsl(${H} ${dim?20:55}% ${dim?10:17}%)`;x.fill();x.save();x.setLineDash([5,4]);x.lineWidth=1.5;x.strokeStyle=`hsla(${H},90%,70%,${on?.8:dim?.2:.5})`;x.beginPath();x.moveTo(a+n*1.6,b+5);x.lineTo(e-n*1.6,b+5);x.moveTo(a+n*1.6,f-5);x.lineTo(e-n*1.6,f-5);x.stroke();x.restore();
      ic=on?'#ffffff':`hsl(${H} 90% ${dim?34:76}%)`;break}
    case 'frost':{x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.filter='blur(7px)';x.drawImage(bgc,-10,-10,w+20,h+20);x.filter='none';
      x.fillStyle=on?`hsla(${H},85%,55%,.42)`:`rgba(255,255,255,${dim?.05:.13})`;x.fillRect(X,Y,W,Hh);const gl=x.createLinearGradient(0,Y,0,Y+Hh);gl.addColorStop(0,'rgba(255,255,255,.18)');gl.addColorStop(.5,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh);x.restore();
      x.lineWidth=1.5;x.strokeStyle=on?`hsla(${H},90%,75%,.8)`:'rgba(255,255,255,.38)';rrect(x,X+1.5,Y+1.5,W-3,Hh-3,r);x.stroke();ic=dim?'rgba(255,255,255,.45)':'#ffffff';break}
    case 'brush':{// trazo de pincel: borde irregular, cerdas y unas gotas salpicadas. Siempre el mismo dibujo para el mismo botón
      let sd=(w*131+h*17+(grp||0)*7)%2147483646+1;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
      const a=X+2,b=Y+3,c=X+W-2,e=Y+Hh-3,j=Math.max(2,Math.min(7,Hh*.09)),n=Math.max(8,Math.round(W/12)),m=Math.max(4,Math.round(Hh/12)),pt=[];
      for(let i=0;i<=n;i++)pt.push([a+(c-a)*i/n,b+rnd()*j]);for(let k=1;k<m;k++)pt.push([c-rnd()*j*1.6,b+(e-b)*k/m]);
      for(let i=n;i>=0;i--)pt.push([a+(c-a)*i/n,e-rnd()*j]);for(let k=m-1;k>0;k--)pt.push([a+rnd()*j*1.6,b+(e-b)*k/m]);
      const P2=new Path2D();P2.moveTo(pt[0][0],pt[0][1]);for(let i=1;i<pt.length;i++){const [px,py]=pt[i-1],[qx,qy]=pt[i];P2.quadraticCurveTo(px,py,(px+qx)/2,(py+qy)/2)}P2.closePath();
      x.fillStyle=lin(`hsl(${H} ${dim?25:78}% ${dim?12:36}%)`,`hsl(${H} ${dim?25:82}% ${dim?7:22}%)`);x.fill(P2);
      x.save();x.clip(P2);for(let i=0;i<Hh*.9;i++){const yy=b+rnd()*(e-b),x0=a+rnd()*W*.4,L=W*(.25+rnd()*.6);x.fillStyle=rnd()<.5?`rgba(255,255,255,${.02+rnd()*.05})`:`rgba(0,0,0,${.04+rnd()*.08})`;x.fillRect(x0,yy,L,1)}
      const gl=x.createLinearGradient(0,b,0,b+(e-b)*.4);gl.addColorStop(0,'rgba(255,255,255,.16)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(a,b,W,(e-b)*.4);x.restore();
      if(!dim){x.fillStyle=`hsl(${H} 80% ${on?70:44}%)`;for(let i=0;i<5;i++){const sx=rnd()<.5?a+rnd()*W*.18:c-rnd()*W*.18,sy=rnd()<.5?b+1+rnd()*3:e-1-rnd()*3;x.beginPath();x.arc(sx,sy,.8+rnd()*1.6,0,7);x.fill()}}
      ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    case 'spray':{// grafiti: contorno de espray con niebla, motas y chorretones que caen del trazo de arriba
      let sd=(w*97+h*29+(grp||0)*11)%2147483646+1;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
      x.fillStyle=on?`hsl(${H} 50% 14%)`:'#060709';x.fill();const c2=`hsl(${H} 95% ${on?72:dim?28:58}%)`,a=X+4,b=Y+4,c=X+W-4,e=Y+Hh-4,rr=Math.max(0,r-3);
      x.save();x.strokeStyle=`hsla(${H},95%,55%,${dim?.08:.22})`;x.lineWidth=8;rrect(x,a,b,c-a,e-b,rr);x.stroke();x.strokeStyle=c2;x.lineWidth=on?3.4:2.6;x.shadowColor=c2;x.shadowBlur=dim?0:7;x.stroke();x.restore();
      if(!dim){x.fillStyle=c2;const per=2*(c-a+e-b);for(let i=0;i<per/3;i++){let t=rnd()*per,px,py;if(t<c-a){px=a+t;py=b}else if((t-=c-a)<e-b){px=c;py=b+t}else if((t-=e-b)<c-a){px=c-t;py=e}else{t-=c-a;px=a;py=e-t}
        const d=(rnd()-.5)*9;px+=py===b||py===e?0:d;py+=py===b||py===e?d:0;x.globalAlpha=.25+rnd()*.5;x.fillRect(px,py,1.2,1.2)}x.globalAlpha=1;
        x.save();x.fillStyle=c2;x.strokeStyle=c2;x.lineCap='round';const nd=W>140?3:2;for(let i=0;i<nd;i++){const dx=i%2?c-W*(.08+rnd()*.16):a+W*(.08+rnd()*.16),L=Math.min(Hh*.32,6+rnd()*Hh*.28);
          x.lineWidth=1.6+rnd()*.9;x.beginPath();x.moveTo(dx,b);x.lineTo(dx,b+L);x.stroke();x.beginPath();x.ellipse(dx,b+L+1.2,1.8,2.4,0,0,7);x.fill()}x.restore()}
      ic=on?'#ffffff':`hsl(${H} 100% ${dim?36:72}%)`;glow=dim?0:on?10:6;break}
    case 'soft':{const base=on?`hsl(${H} 45% 20%)`:`hsl(${H} 14% ${dim?8:13}%)`;x.save();x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=8;x.shadowOffsetX=on?1:3;x.shadowOffsetY=on?1:3;x.fillStyle=base;rrect(x,X+3,Y+3,W-6,Hh-6,r);x.fill();x.restore();
      x.save();rrect(x,X+3,Y+3,W-6,Hh-6,r);x.clip();const sg=x.createLinearGradient(X,Y,X+W,Y+Hh);if(on){sg.addColorStop(0,'rgba(0,0,0,.45)');sg.addColorStop(1,'rgba(255,255,255,.06)')}else{sg.addColorStop(0,'rgba(255,255,255,.09)');sg.addColorStop(1,'rgba(0,0,0,.3)')}x.fillStyle=sg;x.fillRect(X,Y,W,Hh);x.restore();
      if(on){x.lineWidth=2;x.strokeStyle=`hsla(${H},90%,60%,.7)`;rrect(x,X+3.5,Y+3.5,W-7,Hh-7,Math.max(0,r-1));x.stroke()}
      ic=on?'#ffffff':`hsl(${H} 80% ${dim?30:58}%)`;glow=on&&!dim?10:0;break}
    case 'vivid':{const gr=x.createLinearGradient(X,Y,X+W,Y+Hh);gr.addColorStop(0,`hsl(${H} ${dim?25:85}% ${on?62:dim?22:50}%)`);gr.addColorStop(1,`hsl(${(H+45)%360} ${dim?25:85}% ${on?48:dim?14:34}%)`);x.fillStyle=gr;x.fill();
      x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();const gl=x.createLinearGradient(0,Y,0,Y+Hh*.5);gl.addColorStop(0,'rgba(255,255,255,.25)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(X,Y,W,Hh*.5);x.restore();
      if(on){x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.75)';rrect(x,X+2.5,Y+2.5,W-5,Hh-5,Math.max(0,r-1.5));x.stroke()}ic=dim?'rgba(255,255,255,.5)':'#ffffff';break}
    default:x.fillStyle=on?lin(`hsl(${H} 90% 62%)`,`hsl(${H} 85% 46%)`):lin('#16191e','#060708',`hsl(${H} 85% ${dim?20:44}%)`);x.fill();x.lineWidth=2;x.strokeStyle=on?`hsl(${H} 70% 40%)`:`hsl(${H} 55% ${dim?18:32}%)`;rrect(x,X+1,Y+1,W-2,Hh-2,r);x.stroke();ic=on?`hsl(${H} 70% 20%)`:`hsl(${H} 85% ${dim?32:60}%)`}
  if(thru||brite)x.fill=of;
  if(on&&LIFT.has(g.style)){x.save();rrect(x,X+1,Y+1,W-2,Hh-2,r);x.clip();x.globalAlpha=.72;x.fillStyle=lin(`hsl(${H} 90% 68%)`,`hsl(${H} 88% 50%)`);x.fillRect(X,Y,W,Hh);x.restore()}
  if(brite){ic=`hsl(${H} 80% 9%)`;glow=0}
  const home=S.layout.slots.some(s=>s.p===F.path),isIn=g.isIn||1.15,isz=home?g.is:Math.max(14,Math.min(h*.44*isIn,Math.min(w,h)*.8)),src=grp?'orig':(!home&&w/h>4.6&&!(g.per[F.path]||{}).icon)?'none':genIconSrc(F,g),p=grp?{}:g.per[F.path]||{},cx=w/2,cy=home?Y+Hh*(g.iy/100):h/2;
  if(p.ihue!=null&&!on)ic=p.ihue==='white'?(dim?'rgba(255,255,255,.5)':'#ffffff'):`hsl(${p.ihue} 85% ${dim?34:62}%)`;
  // el icono original: en Inicio a la medida elegida; dentro, a su tamaño de siempre (× el tamaño elegido) sin salirse del botón
  if(src==='orig'){const mk=extractIcon(F,grp);if(mk){const k=home?isz/56:Math.min(isIn,W*.8/mk.bw,Hh*.8/mk.bh);drawIcon(x,(c,X,Y,sz,col,gl)=>{drawMask(c,mk,X,Y,k*sz/isz,col,gl);return true},cx,cy,isz,ic,glow)}}
  else if(src==='png'&&p.png){drawIcon(x,(c,X,Y,sz,col,gl)=>{drawMask(c,p.png,X,Y,sz/96*1.15,col,gl);return true},cx,cy,isz,ic,glow)}
  else if(src!=='none')drawIcon(x,keyPainter(src),cx,cy,isz,ic,glow);
}
function genHue(F,g){const p=g.per[F.path]||{};if(p.hue!=null)return p.hue;return g.color==='orig'?origHue(F):g.hue}
function genTile(F,g){const fr=frames(F),fw=F.w/fr,h=F.h,c=document.createElement('canvas');c.width=F.w;c.height=h;const x=c.getContext('2d');const H=genHue(F,g),bgc=cornerBase(F);
  for(let s=0;s<fr;s++){x.save();x.translate(s*fw,0);x.beginPath();x.rect(0,0,fw,h);x.clip();drawState(x,F,fw,h,s,H,g,bgc);x.restore()}
  // la radio solo dibuja transparente (amarillo) en las imágenes que ya lo usaban: en las demás, esquinas y margen llevan el fondo de detrás
  if(g.corners==='key'&&F.keyCount){const m=document.createElement('canvas');m.width=F.w;m.height=h;const mx=m.getContext('2d');mx.fillStyle='#fff';const r=gRad(g,h);
    for(let s=0;s<fr;s++){rrect(mx,s*fw+g.inset,g.inset,fw-2*g.inset,h-2*g.inset,r);mx.fill()}
    const md=mx.getImageData(0,0,F.w,h).data,im=x.getImageData(0,0,F.w,h);for(let i=0;i<F.w*h;i++)if(md[i*4+3]<128)im.data[i*4+3]=0;x.putImageData(im,0,0)}
  return c}
function genTargets(){return S.layout.slots.map(slotF).filter(F=>F&&frames(F)>=2)}
function regen(){S.genCv=new Map();for(const F of genTargets())S.genCv.set(F.path,genTile(F,S.gen))}
function applyGen(){const fs=genTargets();if(!fs.length)return;before();S.gen.look=S.gen.style||'glow';applyButtons(fs);toast(`${fs.length} botones rediseñados`,{label:'Deshacer',fn:undo})}

const GSHAPES=[['rect','Rectángulo'],['round','Redondeado'],['pill','Píldora']];
function miniTile(F,g,state){const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=fw;c.height=F.h;const x=c.getContext('2d');drawState(x,F,fw,F.h,Math.min(state||0,fr-1),genHue(F,g),g,cornerBase(F));
  if(g.corners==='key'&&F.keyCount){const r=gRad(g,F.h),m=document.createElement('canvas');m.width=fw;m.height=F.h;const mx=m.getContext('2d');rrect(mx,g.inset,g.inset,fw-2*g.inset,F.h-2*g.inset,r);mx.fill();x.globalCompositeOperation='destination-in';x.drawImage(m,0,0);x.globalCompositeOperation='source-over'}
  const lb=LABELS[F.name.toLowerCase()];if(lb&&fw===210&&F.h===137){x.font='600 21px Tahoma,Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=state%2===1?'#000':'#fff';x.fillText(lb,105,105.5,176)}return c}
function putMini(cv,src){const x=cv.getContext('2d');cv.width=src.width;cv.height=src.height;x.drawImage(src,0,0)}
function genSum(g){return {style:(GSTYLES.find(s=>s[0]===g.style)||GSTYLES[0])[1],shape:(GSHAPES.find(s=>s[0]===g.shape)||GSHAPES[1])[1]+(g.shape==='round'?` ${g.r} px`:'')+` · margen ${g.inset} px · esquinas ${g.corners==='key'?'transparentes':'del fondo'}`,
  color:g.color==='orig'?'El de cada botón':'Uno para todos: '+hueName(g.hue).toLowerCase(),icons:`${icStyleSum()} · tamaño ${g.is} px · altura ${g.iy} %`}}
function scrGen(v){
  if(!S.gen)S.gen=defGen();const g=S.gen,fs=genTargets();if(!fs.length){v.innerHTML='<p class="empty">No hay botones de Inicio en el backup.</p>';return}
  setTitle('Estilo de los botones',`Inicio · ${fs.length} botones`);
  if(!S.gsel||!fs.some(F=>F.path===S.gsel))S.gsel=fs[0].path;if(!S.gtab)S.gtab='btn';
  const ref=()=>S.lc.get(S.gsel.toLowerCase())||fs[0],sm=genSum(g);
  const item=(k,icon,title,sum,body)=>`<div class="acc-i${S.gopen===k?' open':''}" data-k="${k}"><button class="acc-h" aria-expanded="${S.gopen===k}"><span class="ic">${ic(icon)}</span><span class="tx"><b>${title}</b><small data-sum="${k}">${esc(sum)}</small></span>${CHEV}</button>${S.gopen===k?`<div class="acc-b">${body}</div>`:''}</div>`;
  const look=btnLook(),styleBody=`<div class="ocg" id="g-lk">${LOOKS().map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${look===k}"><canvas data-ms="${k}"></canvas><span>${l}</span></button>`).join('')}</div>`;
  const OWNSHAPE={brush:1,chamfer:1,hex:1,notch:1,ticket:1,capsule:1,pixel:1},own=OWNSHAPE[btnLook()];
  const shapeBody=`${own?`<p class="warnbox">El estilo «${esc((LOOKS().find(x=>x[0]===btnLook())||['',''])[1])}» tiene su propia forma: la forma y el redondeo no le cambian. El margen sí.</p>`:''}<div class="ocg">${GSHAPES.map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${g.shape===k}"><canvas data-mf="${k}"></canvas><span>${l}</span></button>`).join('')}</div>
    ${g.shape==='round'?`<label class="rg" for="g-r"><span>Redondeo <output>${g.r} px</output></span><input type="range" id="g-r" min="2" max="48" value="${g.r}"></label>`:''}
    <label class="rg" for="g-in"><span>Margen alrededor <output>${g.inset} px</output></span><input type="range" id="g-in" min="0" max="24" value="${g.inset}"></label>
    <p class="note">Las esquinas y el margen se rellenan con el trozo de fondo que hay detrás de cada botón, así se ven como transparentes. La radio no aplica la transparencia de verdad (amarillo) en estos botones: probado en el coche.</p>`;
  const colorBody=`<div class="seg" id="g-cm"><button data-v="orig" aria-pressed="${g.color==='orig'}">El de cada botón</button><button data-v="one" aria-pressed="${g.color==='one'}">Uno para todos</button></div>
    ${g.color==='one'?swatches(g.hue,{label:'Color de los botones'}):'<p class="note">Cada botón conserva su color original. Puedes cambiar el de uno solo tocándolo en la pantalla.</p>'}`;
  const iconBody=`<p class="note">Cómo se dibujan <b>todos</b> los iconos. Qué icono lleva cada botón se elige en la pestaña <b>Botones</b>.</p>
    <div id="g-ist">${icStyleHTML()}</div>
    <label class="rg" for="g-is"><span>Tamaño <output>${g.is} px</output></span><input type="range" id="g-is" min="24" max="96" value="${g.is}"></label>
    <label class="rg" for="g-iy"><span>Altura <output>${g.iy} %</output></span><input type="range" id="g-iy" min="20" max="70" value="${g.iy}"></label>
    <p class="note">El MediaNav escribe el nombre debajo, por eso los iconos van por encima del centro.</p>`;
  v.innerHTML=`<div class="two">
    <div class="stick sticky-pv"><div class="screen"><canvas id="pv" width="800" height="480" aria-label="Vista previa de los botones rediseñados. Toca un botón para cambiar su icono y su color."></canvas></div>
      <div class="e-bar"><div class="seg" id="g-st" role="group" aria-label="Estado"><button data-s="0" aria-pressed="${!S.gstate}">Reposo</button><button data-s="1" aria-pressed="${S.gstate===1}">Pulsado</button></div><span class="sp"></span><span class="hint" style="padding:0">Toca un botón para cambiarlo</span></div>
      <div class="seg gtabs" id="g-tabs" role="tablist"><button data-t="btn" role="tab" aria-pressed="${S.gtab==='btn'}">Botones</button><button data-t="style" role="tab" aria-pressed="${S.gtab==='style'}">Estilo</button><button data-t="icons" role="tab" aria-pressed="${S.gtab==='icons'}">Iconos</button><button data-t="color" role="tab" aria-pressed="${S.gtab==='color'}">Color</button><button data-t="shape" role="tab" aria-pressed="${S.gtab==='shape'}">Forma</button></div></div>
    <div class="stack">
    <div data-pn="btn"${S.gtab==='btn'?'':' hidden'}><div class="card gbl"><p class="note">Toca un botón para elegir su icono (de la biblioteca o uno tuyo) y su color.</p><div class="list">${fs.map(F=>{const p=g.per[F.path]||{},ii=genIconSrc(F,g);return `<button class="li" data-gb="${esc(F.path)}"><span class="th"><canvas data-gt="${esc(F.path)}"></canvas></span><span class="tx"><b>${esc(pretty(F))}</b><small>Icono ${ii==='orig'?'original':ii==='png'?'propio':esc(String(ii.startsWith('lib:')?ICONL[ii.slice(4)]||'propio':keyLabel(ii)).toLowerCase())} · ${p.hue!=null?'color '+hueName(p.hue).toLowerCase():'color como el resto'}</small></span><span class="pill p-col">Cambiar</span></button>`}).join('')}</div><p class="note">También puedes tocarlo en la pantalla de arriba. Tu propio icono: «Cambiar» → «Mis iconos».</p></div></div>
    <div class="card" data-pn="style"${S.gtab==='style'?'':' hidden'}><p class="note">Cómo son los ${fs.length} botones: el fondo, el borde y cómo se iluminan al pulsar. «Original de Renault» los deja como vienen, con tus iconos y colores.</p>${styleBody}</div>
    <div class="card" data-pn="icons"${S.gtab==='icons'?'':' hidden'}>${iconBody}</div>
    <div class="card" data-pn="color"${S.gtab==='color'?'':' hidden'}>${colorBody}</div>
    <div class="card" data-pn="shape"${S.gtab==='shape'?'':' hidden'}>${shapeBody}</div>
    <p class="note">Solo cambia los botones de la pantalla de Inicio. Los cambios se aplican al momento y se pueden deshacer.</p></div></div>
    <div class="gbar"><button class="btn o" id="g-reset">Empezar de cero</button><button class="btn" id="g-ap">Listo</button></div>`;
  const c=$('#pv'),po=()=>({scr:'home',state:S.gstate||0});mountPreview(c,po);
  // miniaturas: se dibujan poco a poco (unas pocas por fotograma) y solo las de la pestaña abierta; si llega otro cambio, se cancela lo pendiente
  let mTok=0;const minis=()=>{const tok=++mTok,F=ref(),jobs=[];
    if(S.gtab==='style')$$('[data-ms]',v).forEach(cv=>jobs.push(()=>{const k=cv.dataset.ms;if(k==='orig'){const fr=frames(F),fw=F.w/fr,t=document.createElement('canvas');t.width=fw;t.height=F.h;t.getContext('2d').drawImage(renderOrig(F,false),0,0,fw,F.h,0,0,fw,F.h);putMini(cv,t)}else putMini(cv,miniTile(F,{...g,style:k},0))}));
    if(S.gtab==='shape')$$('[data-mf]',v).forEach(cv=>jobs.push(()=>putMini(cv,miniTile(F,{...g,style:btnLook()==='orig'?(g.style||'glow'):btnLook(),shape:cv.dataset.mf},0))));
    if(S.gtab==='btn')$$('[data-gt]',v).forEach(cv=>jobs.push(()=>{const G=S.lc.get(cv.dataset.gt.toLowerCase());if(G)putMini(cv,miniTile(G,g,0))}));
    const s2=genSum(g);for(const k in s2){const e=$(`[data-sum="${k}"]`,v);if(e)e.textContent=s2[k]}
    const step=()=>{if(tok!==mTok||!v.isConnected)return;const t0=performance.now();while(jobs.length&&performance.now()-t0<12)jobs.shift()();if(jobs.length)requestAnimationFrame(step)};requestAnimationFrame(step)};
  let mT=0,rT=0;const upd=()=>{if(btnLook()!=='orig')applyButtonsSoon();clearTimeout(rT);rT=setTimeout(()=>rebuildLater(styledOut()),400);clearTimeout(mT);mT=setTimeout(minis,220);saveState()};minis();
  $('#g-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.gtab=b.dataset.t;$$('#g-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('[data-pn]',v).forEach(p=>p.hidden=p.dataset.pn!==S.gtab);minis();if(S.gtab==='icons'){const ist=$('#g-ist');if(ist)icStyleDraw(ist)}};
  $$('.ocg',v).forEach(gr=>gr.onclick=e=>{const b=e.target.closest('.ocd');if(!b)return;if(b.querySelector('[data-ms]')){setLook(b.dataset.v).then(ok=>{if(ok){gr.querySelectorAll('.ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));minis()}})}else{before();g.shape=b.dataset.v;if(btnLook()!=='orig')applyButtons();rebuildLater(styledOut());render(true)}});
  const seg=(id,key)=>{const el=$(id);if(el)el.onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;before();g[key]=b.dataset.v;if(btnLook()!=='orig')applyButtons();render(true)}};seg('#g-co','corners');seg('#g-cm','color');
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
