
/* ============ biblioteca de iconos (Tabler Icons, MIT) ============
   site/iconos.json se descarga la primera vez que hace falta (≈300 KB) y el service worker lo guarda aparte.
   Claves: 't:<nombre>' (biblioteca) · 'lib:<nombre>' (los 18 iconos propios de antes, siguen funcionando) · 'orig' · 'png'.
   El estilo del trazo (fino, normal, grueso o relleno) es común a todos los iconos: es lo que los hace coherentes. */
const IC={st:0,data:null,by:null,es:null,p:null};
function icLoad(){if(IC.st===2)return Promise.resolve(true);if(IC.p)return IC.p;IC.st=1;
  IC.p=fetch('iconos.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{IC.data=j;IC.by=new Map(j.i.map(x=>[x[0],x]));IC.es=new Map(j.radio);IC.st=2;
    if(S.gen&&S.route&&S.route.n==='gen')regen();S.ver++;schedule();if(S.icRedraw)S.icRedraw();return true})
  .catch(()=>{IC.st=3;IC.p=null;return false});return IC.p}
const ISTY=[['1.5','Fino'],['2','Normal'],['2.5','Grueso'],['3','Extra'],['fill','Relleno']];
function icStyle(){const g=S.gen||{};return {w:g.iw||2,fill:!!g.ifill}}
const IP2=new Map();
function drawTab(x,name,cx,cy,size,col,glow){
  if(IC.st!==2){icLoad();return false}const it=IC.by.get(name);if(!it)return false;const st=icStyle(),fd=st.fill&&IC.data.f[name];
  x.save();x.translate(cx-size/2,cy-size/2);x.scale(size/24,size/24);x.strokeStyle=col;x.fillStyle=col;x.lineWidth=st.w;x.lineCap='round';x.lineJoin='round';
  if(glow){x.shadowColor=col;x.shadowBlur=glow*24/size}
  const ps=(fd||it[3]).split('|').map(d=>{let p=IP2.get(d);if(!p){p=new Path2D(d);IP2.set(d,p)}return p});
  if(!fd&&icFx().fx==='duo'){x.save();x.globalAlpha*=.3;x.shadowBlur=0;for(const p of ps)x.fill(p);x.restore()}
  for(const p of ps){if(fd)x.fill(p);else x.stroke(p)}
  x.restore();return true}
function drawIconKey(x,k,cx,cy,size,col,glow){if(k.startsWith('my:'))return drawMy(x,k.slice(3),cx,cy,size,col,glow);if(k.startsWith('t:'))return drawTab(x,k.slice(2),cx,cy,size,col,glow);if(k.startsWith('lib:')){drawLib(x,k.slice(4),cx,cy,size,col,glow);return true}return false}
const icLabel=n=>(IC.es&&IC.es.get(n))||n.replace(/-/g,' ');
const keyLabel=k=>k.startsWith('my:')?((MY.by.get(k.slice(3))||{}).name||'Mi icono'):k.startsWith('t:')?icLabel(k.slice(2)):k;
// Iconos propuestos según el botón (por el nombre del archivo)
const ICSUG=[['navi',['navigation','map-2','map-pin','route','compass','gps']],['radio',['radio','antenna','broadcast','music','disc']],['media',['music','player-play','disc','headphones','playlist','usb']],
  ['phone',['phone','phone-call','address-book','message','bluetooth','device-mobile']],['eco',['leaf','plant-2','gauge','chart-line','trophy']],['setting',['settings','adjustments-horizontal','tool']],
  ['map',['map-2','map-pin','route','compass']],['smartphone',['device-mobile','layout-grid']],['vehicle',['car','steering-wheel','engine']],['dark',['moon','brightness']],['time',['clock','calendar']]];
function icSuggest(F){const n=F.name.toLowerCase();for(const [w,l] of ICSUG)if(n.includes(w))return l;return ['star','heart','home','bolt']}
// Búsqueda en español: se traduce cada palabra a las etiquetas en inglés de Tabler
const ESW={navegacion:'navigation',navegar:'navigation',gps:'gps',mapa:'map',destino:'pin',ruta:'route',brujula:'compass',radio:'radio',antena:'antenna',emisora:'broadcast',musica:'music',cancion:'music',
  reproducir:'play',play:'play',pausa:'pause',parar:'stop',siguiente:'next',anterior:'prev',repetir:'repeat',aleatorio:'shuffle',disco:'disc',cd:'disc',auriculares:'headphones',lista:'playlist',microfono:'microphone',
  volumen:'volume',altavoz:'speaker',sonido:'volume',silencio:'mute',telefono:'phone',llamada:'call',llamar:'call',contactos:'address',agenda:'address',mensaje:'message',sms:'message',chat:'message',movil:'mobile',
  ajustes:'settings',configuracion:'settings',engranaje:'settings',herramienta:'tool',llave:'key',hoja:'leaf',planta:'plant',arbol:'tree',eco:'leaf',ecologico:'leaf',indicador:'gauge',velocidad:'gauge',velocimetro:'gauge',
  grafica:'chart',estadisticas:'chart',trofeo:'trophy',coche:'car',vehiculo:'car',volante:'steering',motor:'engine',gasolina:'gas',combustible:'gas',gasolinera:'gas',cargador:'charging',enchufe:'plug',bateria:'battery',
  cambio:'gearbox',marchas:'gearbox',clima:'fan',climatizacion:'fan',aire:'wind',ventilador:'fan',temperatura:'temperature',termometro:'temperature',frio:'snow',calor:'flame',sol:'sun',luna:'moon',noche:'moon',
  oscuro:'moon',brillo:'brightness',reloj:'clock',hora:'clock',alarma:'alarm',calendario:'calendar',fecha:'calendar',casa:'home',inicio:'home',estrella:'star',favorito:'star',corazon:'heart',rayo:'bolt',
  electrico:'bolt',energia:'bolt',encendido:'power',apagar:'power',informacion:'info',ayuda:'help',aviso:'alert',alerta:'alert',peligro:'alert',camara:'camera',video:'video',pelicula:'movie',foto:'photo',
  imagen:'photo',wifi:'wifi',red:'network',internet:'world',mundo:'world',menu:'menu',cuadricula:'grid',llama:'flame',fuego:'flame',montana:'mountain',carretera:'road',calle:'road',aparcar:'parking',
  aparcamiento:'parking',flecha:'arrow',arriba:'up',abajo:'down',izquierda:'left',derecha:'right',buscar:'search',lupa:'search',usuario:'user',persona:'user',puerta:'door',candado:'lock',seguridad:'shield',
  escudo:'shield',lluvia:'rain',nube:'cloud',nieve:'snow',viento:'wind',tiempo:'weather',agua:'droplet',gota:'droplet',luz:'bulb',bombilla:'bulb',bluetooth:'bluetooth',usb:'usb',tarjeta:'card',pantalla:'device',
  tablet:'tablet',ordenador:'computer',libro:'book',documento:'file',carpeta:'folder',archivo:'file',papelera:'trash',borrar:'trash',editar:'edit',lapiz:'pencil',mano:'hand',cara:'mood',sonrisa:'smile',
  perro:'dog',gato:'cat',pajaro:'bird',bici:'bike',bicicleta:'bike',moto:'motorbike',camion:'truck',autobus:'bus',tren:'train',avion:'plane',barco:'ship',caravana:'camper',taxi:'taxi',dinero:'cash',
  compra:'shopping',tienda:'shop',regalo:'gift',comida:'food',cafe:'coffee',restaurante:'tools-kitchen',hospital:'hospital',deporte:'ball',futbol:'soccer',juego:'game',bandera:'flag',ubicacion:'location',
  satelite:'satellite',senal:'signal',descarga:'download',subir:'upload',actualizar:'refresh',compartir:'share',enlace:'link',correo:'mail',email:'mail',notificacion:'bell',campana:'bell',voz:'microphone'};
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function icSearch(q,cat){if(IC.st!==2)return [];const it=IC.data.i;
  if(cat==='radio'&&!q)return IC.data.radio.map(x=>x[0]);
  let L=cat==null||cat===''||cat==='radio'?it:it.filter(x=>x[1]===+cat);const ws=fold(q).split(/\s+/).filter(Boolean);
  if(!ws.length)return L.map(x=>x[0]);
  const sc=[];for(const x of L){const lab=fold(icLabel(x[0])),hay=x[0]+' '+x[2];let s=0;
    for(const w of ws){const t=[w,ESW[w]].filter(Boolean);let b=0;for(const u of t){if(x[0]===u)b=Math.max(b,9);else if(x[0].startsWith(u))b=Math.max(b,6);else if(x[0].includes(u))b=Math.max(b,4);else if(hay.includes(u)||lab.includes(w))b=Math.max(b,2)}
      if(!b){s=0;break}s+=b}
    if(s)sc.push([s-x[0].length/100,x[0]])}
  return sc.sort((a,b)=>b[0]-a[0]).map(x=>x[1])}

/* Selector de iconos (hoja): buscar, categorías y estilo del trazo */
function iconPicker(o){
  const st=S.ipk||(S.ipk={q:'',cat:'radio',n:96});
  const draw=()=>{const g=$('#ip-g');if(!g)return;
    if(IC.st!==2){g.innerHTML=`<p class="note">${IC.st===3?'No he podido descargar la biblioteca de iconos. Necesita conexión la primera vez.':'Cargando la biblioteca de iconos…'}</p>`;if(IC.st===3){const r=document.createElement('button');r.className='btn o sm';r.textContent='Reintentar';r.onclick=()=>{IC.st=0;icLoad();draw()};g.appendChild(r)}return}
    if(st.cat==='my'){const q=fold(st.q),L=MY.list.filter(m=>!q||fold(m.name).includes(q));
      g.innerHTML=`<button class="icb add" data-add><canvas width="72" height="72"></canvas><span>Añadir</span></button>`+L.map(m=>`<div class="icw"><button class="icb" data-k="my:${m.id}" aria-pressed="${o.cur==='my:'+m.id}" title="${esc(m.name)}"><canvas width="72" height="72"></canvas><span>${esc(m.name)}</span></button><button class="icx" data-del="${m.id}" aria-label="Borrar ${esc(m.name)}">×</button></div>`).join('');
      const col=getComputedStyle(document.body).color;g.querySelectorAll('canvas').forEach(cv=>{const x=cv.getContext('2d'),k=cv.parentNode.dataset.k;if(k)drawIconKey(x,k,36,36,46,col,0);else{x.strokeStyle=col;x.lineWidth=3.5;x.lineCap='round';x.beginPath();x.moveTo(36,22);x.lineTo(36,50);x.moveTo(22,36);x.lineTo(50,36);x.stroke()}});
      $('#ip-more').hidden=true;$('#ip-n').textContent=MY.list.length===1?'1 icono tuyo':MY.list.length+' iconos tuyos';return}
    const L=icSearch(st.q,st.cat),sh=L.slice(0,st.n);
    g.innerHTML=sh.length?sh.map(n=>`<button class="icb" data-k="t:${n}" aria-pressed="${o.cur==='t:'+n}" title="${esc(icLabel(n))}"><canvas width="72" height="72"></canvas><span>${esc(icLabel(n))}</span></button>`).join(''):'<p class="note">No hay iconos con esa palabra. Prueba con otra (también en inglés).</p>';
    const col=getComputedStyle(document.body).color;g.querySelectorAll('canvas').forEach(cv=>{const x=cv.getContext('2d');drawTab(x,cv.parentNode.dataset.k.slice(2),36,36,46,col,0)});
    $('#ip-more').hidden=L.length<=st.n;$('#ip-n').textContent=L.length===1?'1 icono':L.length.toLocaleString('es-ES')+' iconos'};
  const cats=IC.st===2?IC.data.cats:[];
  openBS(`<div class="ipk"><div class="ipk-h"><button class="ib" data-x aria-label="Volver">${ic('M15 6l-6 6 6 6')}</button><h2>${esc(o.title||'Elegir icono')}</h2></div>
    <input type="search" id="ip-q" class="ipq" placeholder="Buscar: radio, música, coche, hoja…" value="${esc(st.q)}" autocomplete="off" enterkeyhint="search">
    <div class="chips scroll" id="ip-c"><button class="chip" data-c="radio" aria-pressed="${st.cat==='radio'}">Para la radio</button><button class="chip" data-c="my" aria-pressed="${st.cat==='my'}">Mis iconos${MY.list.length?' · '+MY.list.length:''}</button><button class="chip" data-c="" aria-pressed="${st.cat===''}">Todos</button>${cats.map((c,i)=>`<button class="chip" data-c="${i}" aria-pressed="${st.cat===String(i)}">${esc(c)}</button>`).join('')}</div>
    <details class="isd" id="ip-st"${st.open?' open':''}><summary><span>Estilo de los iconos<small>Trazo, acabado y fondo</small></span><b id="ip-ss">${esc(icStyleSum())}</b></summary><div class="isb">${icStyleHTML()}</div></details>
    <p class="note" id="ip-nt"><span id="ip-n"></span> · ${st.cat==='my'?'Se guardan en este navegador y sirven para cualquier backup. Lo mejor: SVG de trazo (sigue el trazo común) o PNG de un color.':'Tabler Icons. «Relleno» usa la versión rellena cuando existe.'}</p>
    <div class="icg" id="ip-g"></div><button class="btn o wide" id="ip-more" hidden>Ver más</button></div>`);
  S.icRedraw=()=>{if($('#ip-g'))iconPicker(o)};
  $('#bs [data-x]').onclick=()=>{S.icRedraw=null;o.back?o.back():closeBS()};
  let t;$('#ip-q').oninput=e=>{st.q=e.target.value;st.n=96;if(st.q&&st.cat==='radio')st.cat='';clearTimeout(t);t=setTimeout(()=>{$$('#ip-c .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.c===st.cat));draw()},180)};
  $('#ip-c').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;const was=st.cat;st.cat=b.dataset.c;st.n=96;if((was==='my')!==(st.cat==='my'))return iconPicker(o);$$('#ip-c .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));draw()};
  $('#ip-more').onclick=()=>{st.n+=96;draw()};
  const ipst=$('#ip-st');ipst.ontoggle=()=>{st.open=ipst.open;if(ipst.open)icStyleDraw(ipst)};icStyleBind(ipst,()=>{$('#ip-ss').textContent=icStyleSum();draw()});
  $('#ip-g').onclick=async e=>{
    if(e.target.closest('[data-add]')){const inp=$('#in-ico');inp.onchange=async ev=>{const fs=[...ev.target.files];ev.target.value='';let last=null;for(const f of fs){const m=await myAdd(f);if(m)last=m}
        if(last){toast(fs.length>1?'Iconos añadidos':'Icono añadido');if(fs.length===1){S.icRedraw=null;o.onPick('my:'+last.id);return}}iconPicker(o)};inp.click();return}
    const dl=e.target.closest('[data-del]');if(dl){const m=MY.by.get(dl.dataset.del);if(!m)return;
      const used=Object.values((S.gen&&S.gen.per)||{}).some(p=>p.icon==='my:'+m.id)||Object.values(S.icx||{}).some(p=>p.k==='my:'+m.id);
      if(used){toast('Lo estás usando en tu diseño: cámbialo antes por otro icono');return}
      MY.list=MY.list.filter(x=>x!==m);myIndex();await mySave();draw();toast('Icono borrado');return}
    const b=e.target.closest('[data-k]');if(!b)return;S.icRedraw=null;o.onPick(b.dataset.k)};
  if(IC.st!==2)icLoad();draw()}
function setIconStyle(v){const patch=typeof v==='object'?v:v==='fill'?{ifill:true}:{ifill:false,iw:+v};before();if(!S.gen)S.gen=defGen();Object.assign(S.gen,patch);
  if(S.gen)for(const F of genTargets())buildButton(F);S.genCv=null;for(const p of Object.keys(S.icx||{})){const F=S.lc.get(p.toLowerCase());if(F)icApply(F,S.icx[p],true)}S.ver++;schedule();saveState()}

/* Poner un icono de la biblioteca en cualquier imagen: se quita el icono viejo rehaciendo el fondo fila a fila
   (con las franjas de los lados, así se conservan degradados y bordes) y se dibuja el nuevo en su sitio, con el color de cada estado. */
function icAnalyze(F){if(F.icz&&F.iczF===frames(F))return F.icz;const fr=frames(F),fw=F.w/fr,h=F.h,pal=F.pal,idx=F.idx,out=[];
  const isK=i=>isKey(pal[i*3],pal[i*3+1],pal[i*3+2]);
  for(let s=0;s<fr;s++){const ox=s*fw,bg=new Array(h);
    for(let y=0;y<h;y++){let k=0;const rs=[],gs=[],bs=[];for(let x=0;x<fw;x++){const i=idx[y*F.w+ox+x];if(isK(i)){k++;continue}rs.push(pal[i*3]);gs.push(pal[i*3+1]);bs.push(pal[i*3+2])}
      const med=a=>{a.sort((u,v)=>u-v);return a[a.length>>1]};bg[y]=k*2>fw||!rs.length?null:[med(rs),med(gs),med(bs)]}
    let x0=fw,y0=h,x1=-1,y1=-1;const cs=[];const B=Math.min(4,fw>>3);
    for(let y=B;y<h-B;y++)for(let x=B;x<fw-B;x++){const i=idx[y*F.w+ox+x];const kk=isK(i),b=bg[y];let on=false,c=null;
      if(b===null){on=!kk;c=[pal[i*3],pal[i*3+1],pal[i*3+2]]}else if(!kk){c=[pal[i*3],pal[i*3+1],pal[i*3+2]];const dr=c[0]-b[0],dg=c[1]-b[1],db=c[2]-b[2];on=Math.sqrt(dr*dr+dg*dg+db*db)>58}
      if(on){cs.push(c);if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}
    let ok=cs.length>=20&&x1-x0<fw*.92&&y1-y0<h*.92;if(!ok){const m=Math.min(fw,h)*.5;x0=(fw-m)/2;x1=x0+m;y0=(h-m)/2;y1=y0+m}
    const med=a=>{a.sort((u,v)=>u-v);return a[a.length>>1]};const col=cs.length?[med(cs.map(c=>c[0])),med(cs.map(c=>c[1])),med(cs.map(c=>c[2]))]:[255,255,255];
    out.push({bg,x0,y0,x1,y1,col,ok})}
  F.icz=out;F.iczF=fr;return out}
function icApply(F,spec,quiet){
  const fr=frames(F),fw=F.w/fr,h=F.h,A=icAnalyze(F),c=document.createElement('canvas');c.width=F.w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});
  const im=x.createImageData(F.w,h),o=new Uint32Array(im.data.buffer),lut=lutOf(F.pal,false);for(let i=0;i<F.idx.length;i++)o[i]=lut[F.idx[i]];
  const M=3,u=A[0],bw=Math.max(...A.map(a=>a.x1-a.x0+1)),bh=Math.max(...A.map(a=>a.y1-a.y0+1));
  for(let s=0;s<fr;s++){const a=A[s],ox=s*fw,X0=Math.max(0,Math.floor(a.x0-M)),X1=Math.min(fw-1,Math.ceil(a.x1+M)),Y0=Math.max(0,Math.floor(a.y0-M)),Y1=Math.min(h-1,Math.ceil(a.y1+M));
    const W=X1-X0+1;
    for(let y=Y0;y<=Y1;y++){// se rellena en espejo con lo que hay justo a los lados (conserva textura, rayas y degradados); si no cabe, color medio de los lados
      const side=[];for(const xx of [X0-1,X0-2,X0-3,X1+1,X1+2,X1+3])if(xx>=0&&xx<fw)side.push(o[y*F.w+ox+xx]);
      const keyc=side.filter(v=>!(v>>>24)).length,vals=side.filter(v=>v>>>24);let v=0;
      if(vals.length&&keyc*2<=side.length){const rs=vals.map(v=>v&255).sort((p,q)=>p-q),gs=vals.map(v=>(v>>8)&255).sort((p,q)=>p-q),bs=vals.map(v=>(v>>16)&255).sort((p,q)=>p-q),m=vals.length>>1;v=(0xFF000000|(bs[m]<<16)|(gs[m]<<8)|rs[m])>>>0}
      const row=new Uint32Array(W),half=W/2;
      for(let k=0;k<W;k++){const L=X0-1-k,Rr=X1+1+(W-1-k);let src=-1;
        if(k<half){if(L>=0)src=L;else if(Rr<fw)src=Rr}else{if(Rr<fw)src=Rr;else if(L>=0)src=L}
        row[k]=src>=0?o[y*F.w+ox+src]:v}
      for(let k=0;k<W;k++)o[y*F.w+ox+X0+k]=row[k]}}
  x.putImageData(im,0,0);
  const size=spec.size||Math.max(14,Math.min(Math.min(fw,h)*.9,Math.max(bw,bh)*24/18));
  for(let s=0;s<fr;s++){const a=A[s],cx=s*fw+(a.x0+a.x1)/2,cy=(a.y0+a.y1)/2+(spec.dy||0);
    const col=spec.col==null||spec.col==='orig'?`rgb(${a.col.join(',')})`:spec.col==='white'?'#fff':typeof spec.col==='number'?`hsl(${spec.col} 80% ${s%2?40:62}%)`:spec.col;
    x.save();x.beginPath();x.rect(s*fw,0,fw,h);x.clip();drawIcon(x,keyPainter(spec.k),cx,cy,size,col,0);x.restore()}
  const d=x.getImageData(0,0,F.w,h).data,useKey=F.keyCount>0,key=new Uint8Array(F.w*h);
  for(let i=0;i<F.w*h;i++){const al=d[i*4+3];if(al<128){if(useKey)key[i]=1;else{d[i*4]=d[i*4+1]=d[i*4+2]=0}}else if(al<255&&!useKey){d[i*4]=d[i*4]*al/255;d[i*4+1]=d[i*4+1]*al/255;d[i*4+2]=d[i*4+2]*al/255}}
  const q=quantize(d,F.w,h,{key,dither:false});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx};F.cv=null;
  if(!S.icx)S.icx={};S.icx[F.path]={...spec};if(S.ex[F.path]===undefined)S.ex[F.path]=true;if(!quiet){bump()}}
function icCard(F){const sp=(S.icx||{})[F.path];
  return `<div class="card"><h3>Poner un icono de la biblioteca</h3><p class="note">Quita el icono que tiene y pone uno de la biblioteca en el mismo sitio, con los colores de cada estado. Todos los iconos de la biblioteca comparten estilo, así quedan coherentes entre sí.</p>
    <div class="icrow"><canvas id="ic-cur" width="72" height="72"></canvas><button class="btn${sp?' o':''} sm" id="ic-pick">${sp?'Cambiar icono':'Elegir un icono'}</button></div>
    ${sp?`<div class="field"><span class="lbl">Color del icono</span>${swatches(sp.col==null||sp.col==='orig'?'none':typeof sp.col==='number'?sp.col:sp.col==='white'?'white':'custom',{none:'Como el original',white:true,label:'Color del icono'})}</div>
    <label class="rg" for="ic-sz"><span>Tamaño <output>${Math.round(sp.size||0)||'auto'}</output></span><input type="range" id="ic-sz" min="12" max="${Math.min(F.w/frames(F),F.h)}" value="${Math.round(sp.size||Math.min(F.w/frames(F),F.h)*.5)}"></label>`:''}</div>`}
function icBind(F){const sp=()=>(S.icx||{})[F.path];const cv=$('#ic-cur');
  const pv=()=>{if(!cv)return;const x=cv.getContext('2d');x.clearRect(0,0,72,72);const s=sp();if(s)drawIconKey(x,s.k,36,36,48,getComputedStyle(document.body).color,0);else{x.fillStyle=getComputedStyle(document.body).color;x.globalAlpha=.5;x.font='600 12px Inter,sans-serif';x.textAlign='center';x.fillText('Ninguno',36,40)}};pv();
  S.icRedraw=null;if(sp()&&IC.st!==2)icLoad().then(()=>{pv();if(sp()){icApply(F,sp());render(true)}});
  $('#ic-pick').onclick=()=>iconPicker({title:'Icono para '+pretty(F),cur:sp()&&sp().k,back:()=>closeBS(),onPick:async k=>{await icLoad();before();icApply(F,{...(sp()||{}),k});closeBS();render(true);toast('Icono puesto',{label:'Deshacer',fn:undo})}});
  const card=$('#ic-pick').closest('.card'),g=card.querySelector('.swg');
  if(g){g.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;before();const h=b.dataset.h;icApply(F,{...sp(),col:h==='none'?'orig':h==='white'?'white':+h});render(true)};
    const pk=g.querySelector('[data-pick]');if(pk)pk.onchange=e=>{before();icApply(F,{...sp(),col:e.target.value});render(true)}}
  const sz=$('#ic-sz');if(sz){let t;sz.oninput=e=>{sz.previousElementSibling.querySelector('output').textContent=e.target.value;clearTimeout(t);t=setTimeout(()=>{before();icApply(F,{...sp(),size:+e.target.value});schedule()},120)}}}

/* ---- Mis iconos: subidos por ti, guardados en este navegador (IndexedDB 'myicons'), valen para cualquier backup ----
   SVG de solo formas (path, circle, rect, line, polyline, polygon, ellipse) → vector: el trazo sigue el ajuste común.
   PNG / JPG / SVG complejos → silueta de un color: se detecta si el dibujo es oscuro sobre claro o al revés, se recorta y se centra
   al mismo tamaño visual que los de la biblioteca. */
const MY={list:[],by:new Map()};
async function myLoad(){try{MY.list=(await idb.get('myicons'))||[]}catch(_){MY.list=[]}myIndex()}
function myIndex(){MY.by=new Map(MY.list.map(m=>[m.id,m]));for(const m of MY.list)if(m.png&&!m.mk)myMask(m)}
function myMask(m){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;c.getContext('2d').drawImage(im,0,0,128,128);m.mk={cv:c,bx:0,by:0,bw:128,bh:128};if(S.genCv&&S.gen)regen();S.ver++;schedule();if(S.icRedraw)S.icRedraw()};im.src=m.png}
async function mySave(){try{await idb.set('myicons',MY.list.map(({mk,...r})=>r));return true}catch(_){toast('No he podido guardar tus iconos en este navegador');return false}}
function drawMy(x,id,cx,cy,size,col,glow){const m=MY.by.get(id);if(!m)return false;
  if(m.png){if(!m.mk)return false;drawMask(x,m.mk,cx,cy,size/128,col,glow);return true}
  const [vx,vy,vw,vh]=m.vb,s=size/Math.max(vw,vh),st=icStyle();
  x.save();x.translate(cx-vw*s/2,cy-vh*s/2);x.scale(s,s);x.translate(-vx,-vy);x.strokeStyle=col;x.fillStyle=col;x.lineCap='round';x.lineJoin='round';x.lineWidth=(m.sw||2)*st.w/2;
  if(glow){x.shadowColor=col;x.shadowBlur=glow/s}
  const ps=m.p.map(([d,k])=>{let p=IP2.get(d);if(!p){p=new Path2D(d);IP2.set(d,p)}return [p,k]});
  if(icFx().fx==='duo'&&ps.some(q=>q[1]==='s')){x.save();x.globalAlpha*=.3;x.shadowBlur=0;for(const [p,k] of ps)if(k==='s')x.fill(p);x.restore()}
  for(const [p,k] of ps){if(k==='f')x.fill(p);else x.stroke(p)}
  x.restore();return true}
function svgVector(txt){const doc=new DOMParser().parseFromString(txt,'image/svg+xml'),svg=doc.documentElement;if(!svg||svg.nodeName.toLowerCase()!=='svg')return null;
  if(svg.querySelector('[transform],use,text,image,mask,clipPath,pattern,linearGradient,radialGradient,filter,style'))return null;
  let vb=(svg.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);if(vb.length!==4||vb.some(isNaN)){const w=parseFloat(svg.getAttribute('width')),h=parseFloat(svg.getAttribute('height'));if(!(w>0&&h>0))return null;vb=[0,0,w,h]}
  const inh=(el,a)=>{for(let e=el;e&&e.getAttribute;e=e.parentNode){const v=e.getAttribute(a);if(v!=null)return v.trim()}return null};
  const num=(el,a)=>parseFloat(el.getAttribute(a)||0),P=[];let sw=null;
  for(const el of svg.querySelectorAll('path,circle,ellipse,rect,line,polyline,polygon')){const t=el.nodeName.toLowerCase();let d='';
    if(t==='path')d=el.getAttribute('d')||'';
    else if(t==='circle'){const cx=num(el,'cx'),cy=num(el,'cy'),r=num(el,'r');d=`M${cx-r} ${cy}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0z`}
    else if(t==='ellipse'){const cx=num(el,'cx'),cy=num(el,'cy'),rx=num(el,'rx'),ry=num(el,'ry');d=`M${cx-rx} ${cy}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0z`}
    else if(t==='rect'){const X=num(el,'x'),Y=num(el,'y'),W=num(el,'width'),H=num(el,'height');d=`M${X} ${Y}h${W}v${H}h${-W}z`}
    else if(t==='line')d=`M${num(el,'x1')} ${num(el,'y1')}L${num(el,'x2')} ${num(el,'y2')}`;
    else{const pts=(el.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number);if(pts.length<4)continue;d='M'+pts.slice(0,2).join(' ')+'L'+pts.slice(2).join(' ')+(t==='polygon'?'z':'')}
    if(!d||d.replace(/\s/g,'')==='M0 0h24v24H0z'.replace(/\s/g,''))continue;
    const stroke=inh(el,'stroke'),fill=inh(el,'fill'),stk=stroke&&stroke!=='none',fil=fill==null?!stk:fill!=='none';
    if(stk&&sw==null){const w=parseFloat(inh(el,'stroke-width'));if(w>0)sw=w}
    if(stk)P.push([d,'s']);if(fil)P.push([d,'f'])}
  if(!P.length)return null;return {vb,p:P,sw:sw||Math.max(vb[2],vb[3])/12}}
// Silueta de un color a partir de cualquier imagen
function rasterMask(img){const S0=256,c=document.createElement('canvas');c.width=c.height=S0;const x=c.getContext('2d',{willReadFrequently:true}),iw=img.width||img.naturalWidth,ih=img.height||img.naturalHeight,sc=Math.min(S0/iw,S0/ih);
  const dx=Math.round((S0-iw*sc)/2),dy=Math.round((S0-ih*sc)/2),dw=Math.max(1,Math.round(iw*sc)),dh=Math.max(1,Math.round(ih*sc));
  x.drawImage(img,dx,dy,dw,dh);const d=x.getImageData(0,0,S0,S0).data,a=new Float32Array(S0*S0);
  // ¿tiene transparencia propia? Solo se mira dentro de la imagen (las franjas que sobran al encajarla no cuentan)
  let op=0;for(let y=dy;y<dy+dh;y++)for(let X=dx;X<dx+dw;X++)if(d[(y*S0+X)*4+3]>200)op++;const L=i=>d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11;
  if(op<dw*dh*.85){for(let i=0;i<S0*S0;i++)a[i]=d[i*4+3]/255}
  else{// imagen opaca: el fondo es el color de su borde; el icono, lo que se aleja de él (sirve para negro sobre blanco y al revés)
    const b=[];for(let X=dx;X<dx+dw;X++){b.push(L(dy*S0+X),L((dy+dh-1)*S0+X))}for(let y=dy;y<dy+dh;y++){b.push(L(y*S0+dx),L(y*S0+dx+dw-1))}b.sort((p,q)=>p-q);const bg=b[b.length>>1];
    for(let y=dy;y<dy+dh;y++)for(let X=dx;X<dx+dw;X++){const i=y*S0+X;a[i]=cl((Math.abs(L(i)-bg)-24)/80)}}
  let x0=S0,y0=S0,x1=-1,y1=-1;for(let y=0;y<S0;y++)for(let X=0;X<S0;X++)if(a[y*S0+X]>.25){if(X<x0)x0=X;if(X>x1)x1=X;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return null;const m=document.createElement('canvas');m.width=S0;m.height=S0;const mx=m.getContext('2d'),mi=mx.createImageData(S0,S0);
  for(let i=0;i<S0*S0;i++){mi.data[i*4]=mi.data[i*4+1]=mi.data[i*4+2]=255;mi.data[i*4+3]=Math.round(a[i]*255)}mx.putImageData(mi,0,0);
  const o=document.createElement('canvas');o.width=o.height=128;const ox=o.getContext('2d'),bw=x1-x0+1,bh=y1-y0+1,k=96/Math.max(bw,bh);ox.imageSmoothingQuality='high';
  ox.drawImage(m,x0,y0,bw,bh,64-bw*k/2,64-bh*k/2,bw*k,bh*k);return o.toDataURL('image/png')}
async function myAdd(file){const name=file.name.replace(/\.[^.]+$/,'').slice(0,40)||'Mi icono',id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);let m=null;
  const isSvg=/svg/i.test(file.type)||/\.svg$/i.test(file.name);
  if(isSvg){const txt=await file.text();const v=svgVector(txt);if(v)m={id,name,...v,kind:'vec'};
    else{const url=URL.createObjectURL(new Blob([txt],{type:'image/svg+xml'}));try{const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});const png=rasterMask(im);if(png)m={id,name,png,kind:'png'}}catch(_){}URL.revokeObjectURL(url)}}
  else{try{const bmp=await createImageBitmap(file);const png=rasterMask(bmp);if(png)m={id,name,png,kind:'png'}}catch(_){}}
  if(!m){toast('No he podido sacar un icono de esa imagen');return null}
  MY.list.unshift(m);myIndex();await mySave();return m}
