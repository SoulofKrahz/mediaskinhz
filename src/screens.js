
/* ============ ventana de cada pantalla de la radio ============
   Como solo se toca la skin, cada pantalla (Radio, Multimedia, Teléfono, Driving eco, Ajustes) es un conjunto cerrado de imágenes:
   aquí está todo lo suyo junto. «Común» reúne lo que comparten todas (barra superior, ventanas, teclados, cámara, ayudas, 4x4).
   Navegación no tiene pantalla propia en la skin (la dibuja el navegador): su botón abre solo la hoja del botón. */
const SLOTSCR={'home_radio_btn':'radio','home_media_btn':'media','home_phone_btn':'phone','home_driving eco_btn':'eco','home_setting_btn':'setting'};
const COMMON_SECS=['COMMON','ETC','POPUP','ADAS','RVC','4WD'];
const scrName=s=>s==='common'?'Común':SCRL.get(s)||s;
const slotScr=F=>F?SLOTSCR[F.name.toLowerCase().replace(/\.bmp$/,'')]:null;
const scrHomeBtn=s=>genTargets().find(F=>slotScr(F)===s);
const scrSecs=s=>s==='common'?COMMON_SECS:[SCRSEC[s]];
function scrFiles(s){const bgs=new Set(SCREENS.map(x=>x[2]));
  if(s==='common')return S.files.filter(F=>COMMON_SECS.includes(F.sec)&&!bgs.has(F.lc));return S.files.filter(F=>F.sec===SCRSEC[s])}
/* ---- vistas interiores (Radio, Multimedia, Teléfono) ----
   site/vistas.json trae, para cada vista del programa de la radio (principal, lista, presintonías, opciones…), qué imagen va en cada sitio
   y los textos fijos. Sale del análisis del programa de la radio (AppMain 7.0.5) del proyecto MediaNav-to-Evolution-Upgrade (GPL-3.0).
   Es una foto de cuando se construye la pantalla: faltan los datos que la radio pone en marcha (emisora, canción, listas) y la letra es aproximada. */
const VW={st:0,data:null,p:null},VWS=new Set(['radio','media','phone','setting','eco','common']),VMAIN=/^(Principal|Reproductor|Marcador|Audio|Clasificación|Barra de arriba)$/;
function loadVistas(){if(VW.p)return VW.p;VW.st=1;VW.p=fetch('vistas.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{VW.data=j.views;VW.st=2}).catch(()=>{VW.st=3;VW.p=null});return VW.p}
// ancho de un estado: el del sitio que le da la radio si la tira es un múltiplo exacto; si no, el que se deduce de la imagen
const vwFw=(F,w,h)=>F.w>w&&w>0&&F.w%w===0&&F.h===h?w:F.w/frames(F);
const vwList=s=>(VW.data||[]).filter(o=>o.s===s);
const vwBand=s=>{const L=vwList(s),k=(S.vw||(S.vw={}))[s]||{};return k.band??(L[0]||{}).band??''};
function vwCur(s){const L=vwList(s);if(!L.length)return null;const k=(S.vw||(S.vw={}))[s]||{},b0=vwBand(s),inB=L.filter(o=>o.band===b0||!o.band);
  return inB.find(o=>o.v===k.v)||inB.find(o=>VMAIN.test(o.v))||inB[0]||L[0]}
// hl: {lc, st} resalta una imagen (editor) y la dibuja en ese estado; hov: índice bajo el ratón
function drawView(x,V,rc,press,hl,hov){const HL=[];
  for(let i=0;i<V.c.length;i++){const [f,cx,cy,w,h,,t,lr,col,opt,fi]=V.c[i],F=f&&byName(f),me=hl&&f===hl.lc;
    x.globalAlpha=opt&&!me?.3:1;
    if(F){const fw=vwFw(F,w,h),fr=Math.round(F.w/fw),st=me?Math.min(hl.st||0,fr-1):i===press&&fr>1?1:fi!=null?Math.min(fi,fr-1):0;x.drawImage(rc(F),st*fw,0,fw,F.h,cx,cy,fw,F.h);if(me)HL.push([cx,cy,fw,F.h])}
    else if(!t&&w<800){x.save();x.setLineDash([5,5]);x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=1;x.strokeRect(cx+.5,cy+.5,w-1,h-1);x.restore()}
    // los textos sueltos de la izquierda (nombres de opción, títulos, filas de lista) van alineados a la izquierda, como en la radio
    if(t){const [lx,ly,lw,lh]=lr,left=!F&&lx<130&&lw>150;x.save();x.font=`600 ${Math.round(Math.max(13,Math.min(24,lh*.6)))}px Tahoma,Inter,sans-serif`;x.textAlign=left?'left':'center';x.textBaseline='middle';
      x.fillStyle=i===press&&F&&frames(F)>1?'#000':col;x.fillText(t,left?lx+4:lx+lw/2,ly+lh/2,Math.max(10,lw-8));x.restore()}}
  x.globalAlpha=1;
  for(const [a,b,c,d] of HL){x.save();x.strokeStyle='#3ddc9a';x.lineWidth=4;x.shadowColor='#3ddc9a';x.shadowBlur=12;x.strokeRect(a-3,b-3,c+6,d+6);x.restore()}
  if(hov>=0&&V.c[hov]&&hov!==press){const [f,cx,cy,w,h]=V.c[hov],F=f&&byName(f);if(F){const fw=vwFw(F,w,h);x.save();x.setLineDash([7,5]);x.strokeStyle='#3ddc9a';x.lineWidth=2.5;x.strokeRect(cx+1,cy+1,fw-2,F.h-2);
    const nm=pretty(F);x.font='600 15px Inter,sans-serif';const tw=x.measureText(nm).width+14,ty=cy>30?cy-26:Math.min(454,cy+F.h+4),tx=Math.max(0,Math.min(800-tw,cx));x.setLineDash([]);x.fillStyle='rgba(5,20,14,.92)';x.fillRect(tx,ty,tw,22);x.fillStyle='#3ddc9a';x.fillText(nm,tx+7,ty+16);x.restore()}}}
function vwHit(V,c,e){const r=c.getBoundingClientRect(),px=(e.clientX-r.left)*800/r.width,py=(e.clientY-r.top)*480/r.height;let best=-1,ba=1e9,bF=null;
  // gana la pieza más pequeña bajo el dedo: así una tecla gana a la barra de la lista que tiene encima, y un botón a la barra de arriba
  for(let i=V.c.length-1;i>=0;i--){const [f,cx,cy,w,h,,,,,opt]=V.c[i],F=f&&byName(f);if(!F)continue;const fw=vwFw(F,w,h),W=Math.max(w,fw),H=Math.max(h,F.h);
    if(px>=cx&&px<cx+W&&py>=cy&&py<cy+H){const ar=W*H*(opt?4:1);if(ar<ba){ba=ar;best=i;bF=F}}}
  return best>=0?{i:best,F:bF}:{i:-1}}
function vwFor(F,scr){if(VW.st!==2){if(!VW.p)loadVistas().then(()=>schedule());return null}const L=(VW.data||[]).filter(o=>o.c.some(c=>c[0]===F.lc));if(!L.length)return null;
  const cur=VWS.has(scr)?vwCur(scr):null;return cur&&L.includes(cur)?cur:L.find(o=>o.s===scr&&VMAIN.test(o.v))||L.find(o=>o.s===scr)||L[0]}
function vwBar(s){const el=$('#sc-vw');if(!el)return;
  if(VW.st!==2){el.innerHTML=`<p class="hint" style="padding:0">${VW.st===3?'No se han podido cargar las vistas de dentro (hace falta conexión la primera vez). <button class="btn o sm" data-rt>Reintentar</button>':'Cargando las vistas de dentro…'}</p>`;
    const rt=el.querySelector('[data-rt]');if(rt)rt.onclick=()=>{loadVistas().then(()=>{vwBar(s);schedule()});vwBar(s)};return}
  const L=vwList(s),cur=vwCur(s);if(!cur){el.innerHTML='';return}
  const bands=[...new Set(L.map(o=>o.band))].filter(Boolean),b0=vwBand(s),inB=L.filter(o=>o.band===b0||!o.band);
  // la fila de vistas no vuelve al principio al cambiar de vista: se guarda dónde estaba y se asegura que la elegida se ve
  const mem=(S.vwSc||(S.vwSc={}))[s]||(S.vwSc[s]={b:0,v:0}),ob=el.querySelector('.vwb'),ov=el.querySelector('.vwv');if(ob)mem.b=ob.scrollLeft;if(ov)mem.v=ov.scrollLeft;
  el.innerHTML=`${bands.length>1?`<div class="chips scroll vwb" role="group" aria-label="Fuente">${bands.map(b=>`<button class="chip" data-b="${esc(b)}" aria-pressed="${b===b0}">${esc(b)}</button>`).join('')}</div>`:''}
    <div class="chips scroll vwv" role="group" aria-label="Vista">${inB.map(o=>`<button class="chip" data-w="${esc(o.v)}" aria-pressed="${o===cur}">${esc(o.v)}</button>`).join('')}</div>
    ${cur.aprox?'<p class="hint" style="padding:0">Vista dibujada a partir de fotos de la radio: las posiciones son aproximadas.</p>':''}`;
  for(const [cls,key] of [['.vwb','b'],['.vwv','v']]){const row=el.querySelector(cls);if(!row)continue;row.scrollLeft=mem[key];
    const on=row.querySelector('[aria-pressed="true"]');if(on){const l=on.offsetLeft-row.offsetLeft,r=l+on.offsetWidth;if(l<row.scrollLeft||r>row.scrollLeft+row.clientWidth)row.scrollLeft=Math.max(0,l-(row.clientWidth-on.offsetWidth)/2)}
    mem[key]=row.scrollLeft;row.addEventListener('scroll',()=>{mem[key]=row.scrollLeft},{passive:true})}
  el.onclick=e=>{const b=e.target.closest('[data-b],[data-w]');if(!b)return;const k=(S.vw||(S.vw={}))[s]||(S.vw[s]={});
    if(b.dataset.b!=null){k.band=b.dataset.b;delete k.v}else{k.v=b.dataset.w}vwBar(s);schedule()}}
const ACCENT=/(_dot|list_press|parting_line|list_line|fulldown_\d_l?ine|indi_line|scrollnumber_bg|progress_bar\w*)\.bmp$/;
// Color del marco de una pantalla: además de sus botones con estilo, todo lo demás que se ve en ella toma el color:
// barras largas, flechas, iconos de lista, líneas, cabeceras, ventanas emergentes… Las partes de color cambian de tono;
// en listas y ventanas también los grises y blancos. Los fondos de pantalla, el texto blanco y los iconos de estado no se tocan.
// las barras de arriba (indi_line, fulldown_line) no: sus grises son el tono del estilo y solo cambia la línea fina de color
const LISTGREY=/(list_line|list_press|list\d?_bg|list_btn|folder_name\d?_bg|_dot|parting_line|scrollnumber_bg|search_type_bg)\w*\.bmp$/;
const TOPBAR=/(fulldown_\d_l?ine|indi_l?ine)\.bmp$/;
function screenPieces(s,files){const set=new Set(files);if(VW.st===2)for(const o of VW.data)if(o.s===s||(s==='radio'&&o.s==='common'&&false))for(const c of o.c){const F=c[0]&&byName(c[0]);if(F)set.add(F)}
  const bgs=new Set(SCREENS.map(x=>x[2]));return [...set].filter(F=>!bgs.has(F.lc)&&!/common_indi_(?!line)/.test(F.lc)&&F.sec!=='COMMON'||/common_pull_|indi_line/.test(F.lc))}
function tintScreen(s,files,sty,h){const g=S.gen||(S.gen=defGen()),T=new Set([...sty,...genTargets()]),odd=[];
  for(const F of screenPieces(s,files)){if(T.has(F)||(F.rep&&F.rep.by&&F.rep.by!=='gen'&&F.rep.by!=='btn'&&F.rep.by!=='preset'))continue;
    if(isBtnLike(F)&&frames(F)>=2&&canStyleOne(F)&&F.w/frames(F)/F.h<=4.6){const q=g.per[F.path]||(g.per[F.path]={});if(h==null)delete q.hue;else q.hue=h;odd.push(F);continue}
    const st=stats(F);let col=0,tot=0;for(const f of st.fam.values()){tot+=f.n;if(f.k<12)col+=f.n}const grey=LISTGREY.test(F.lc)||(isBtnLike(F)&&frames(F)>=2&&F.w/frames(F)/F.h>4.6&&!noStyle(F));if(!grey&&col<tot*.03)continue;
    const o={...defOps(),...(S.ops.file[F.path]||{})};o.map={...(o.map||{})};
    if(h==null||h==='white'){o.tA=0;o.tG=false;delete o.map[12]}else{o.tH=h;o.tA=100;o.tG=false;if(grey)o.map[12]={to:h,ts:.85,tl:.62};else delete o.map[12]}
    if(!Object.keys(o.map).length)delete o.map;setFileOps(F,o)}
  // el resplandor de color del fondo de la pantalla, del mismo color (el negro no cambia; para teñirlo está «Color del negro del fondo»)
  const B=byName(SCRBG.get(s==='common'?'radio':s));if(B&&!B.rep&&s!=='common'){const o={...defOps(),...(S.ops.file[B.path]||{})};if(h==null||h==='white')o.tA=0;else{o.tH=h;o.tA=100;o.tG=false}setFileOps(B,o)}
  if(odd.length)applyButtons(odd)}
// Diseños hechos antes de que el color de la pantalla llegara a todo (listas grises, fondo…): si los botones de una pantalla
// comparten un color de marco y sus listas aún no lo tienen, se aplica al cargar. Devuelve cuántas pantallas ha puesto al día
const styOf=files=>files.filter(F=>isBtnLike(F)&&kindOf(F)==='btn'&&canStyleOne(F)&&F.w/frames(F)/F.h<=4.6);
function syncScreenTints(){if(S.demo)return 0;let n=0;
  // barras de arriba teñidas enteras por versiones anteriores: vuelven al tono del estilo
  for(const F of S.files){const o=S.ops.file[F.path];if(TOPBAR.test(F.lc)&&o&&o.map&&o.map[12]){const q={...o,map:{...o.map}};delete q.map[12];if(!Object.keys(q.map).length)delete q.map;setFileOps(F,q);n++}}
  const g=S.gen;if(!g||!g.per){if(n){S.ver++;saveState()}return n}
  for(const s of ['radio','media','phone','setting','eco']){const files=scrFiles(s),sty=styOf(files);const hs=new Set(sty.map(F=>(g.per[F.path]||{}).hue).filter(h=>h!=null));
    if(hs.size!==1)continue;const h=[...hs][0];if(typeof h!=='number')continue;if(sty.filter(F=>(g.per[F.path]||{}).hue===h).length<sty.length*.6)continue;
    const lines=files.filter(F=>LISTGREY.test(F.lc)&&!isBtnLike(F));if(!lines.length||lines.every(F=>{const o=S.ops.file[F.path];return o&&o.map&&o.map[12]&&o.map[12].to===h}))continue;
    tintScreen(s,files,sty,h);n++}
  if(n){S.ver++;saveState()}return n}
function scrScreen(v,r){
  const s=r.s,secs=scrSecs(s),files=scrFiles(s),pscr=s==='common'?'radio':s,bg=byName(SCRBG.get(pscr)),hb=s==='common'?null:scrHomeBtn(s);
  setTitle(scrName(s),`${files.length+(bg?1:0)} imágenes de esta pantalla`);
  const btns=files.filter(isBtnLike),rest=files.filter(F=>!isBtnLike(F)),sty=styOf(btns);
  const g=S.gen||(S.gen=defGen()),looks=new Set(sty.map(F=>(g.per[F.path]||{}).look||'orig')),curLook=looks.size===1?[...looks][0]:null;
  const same=k=>{const vs=new Set(sty.map(F=>{const h=(g.per[F.path]||{})[k];return h==null?'none':h}));return vs.size===1?[...vs][0]:''};
  v.innerHTML=`<div class="two">
    ${bg?`<div class="stick sticky-pv">${VWS.has(s)?'<div id="sc-vw" class="vwbar"></div>':''}${pvBlock('pv')}<div class="e-bar"><div class="seg" id="sc-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="${S.hcmp!=='orig'}">Ahora</button><button data-v="orig" aria-pressed="${S.hcmp==='orig'}">Original</button></div><span class="sp"></span><span class="hint" style="padding:0">${VWS.has(s)?(s==='common'?'Sobre el fondo de Radio. Toca una pieza para cambiarla':'Toca un botón de la pantalla para cambiarlo'):'Fondo de '+esc(scrName(s))+' con tus cambios'}</span></div></div>`:''}
    <div class="stack">
    ${sty.length?`<div class="card"><h3>Botones de esta pantalla <small class="cnt">${sty.length}</small></h3><p class="note">Todos a la vez. Para cambiar uno solo, tócalo en la pantalla de arriba.</p>
      <p class="lbl">Estilo <small>· se aplica al momento; Deshacer lo quita</small></p><div class="hs" id="sc-lk">${LOOKS().map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${curLook===k}"><canvas data-lk="${k}" width="1" height="1"></canvas><span>${l}</span></button>`).join('')}</div>
      <p class="lbl">Color del marco</p><div class="hsw" id="sc-fc">${swatches(same('hue'),{none:'El original',white:true,label:'Color del marco de todos'})}</div>
      <p class="lbl">Color del icono</p><div class="hsw" id="sc-icc">${swatches(same('ihue'),{none:'Como el original',white:true,label:'Color del icono de todos'})}</div>
      ${isInHTML('sc-isz')}</div>`:''}
    <div class="card"><h3>Color de toda la pantalla</h3><p class="note">Tiñe todas las imágenes de ${esc(scrName(s))} a la vez. Lo que cambies después en una imagen concreta manda sobre esto.</p><div id="sc-tint"></div>
      <button class="btn o sm" id="sc-more">Más colores de esta pantalla</button></div>
    ${bg&&s!=='common'?`<div class="card"><h3>Fondo</h3><div class="list">${fileRow(bg,'Fondo · 800×480')}</div>
      <p class="lbl">Color del negro del fondo</p><div class="hsw" id="sc-bk">${swatches(((S.ops.file[bg.path]||{}).map||{})[13]?((S.ops.file[bg.path].map[13].to)):'none',{none:'Negro original',label:'Color del negro del fondo'})}</div>
      <p class="note">Conserva el degradado. Para un fondo claro o una foto: toca el fondo → Sustituir.</p></div>`:''}
    ${hb?`<div class="list"><button class="li" id="sc-hb"><span class="th">${th(hb,72,42)}</span><span class="tx"><b>Su botón en Inicio</b><small>Icono, colores y estilo del botón «${esc(pretty(hb))}»</small></span>${CHEV}</button></div>`:''}
    ${s!=='common'?`<div class="list"><button class="li" id="sc-kit"><span class="ic">${ic('M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3')}</span><span class="tx"><b>¿Un botón no cambia en el coche?</b><small>Prueba con letras para saber qué imagen usa la radio en la casa de cada pantalla</small></span>${CHEV}</button></div>`:''}
    ${files.length?`<details class="isd card" id="sc-all"><summary><span>Todas las piezas<small>Una a una, también las que no salen en la vista</small></span><b>${files.length}</b></summary><div class="isb">
      ${btns.length?`<div class="grid sc-grid">${btns.map(tile).join('')}</div>`:''}
      ${rest.length?`<p class="lbl">Barras, listas y fondos de ventanas</p><div class="list">${rest.map(F=>fileRow(F,KINDL.get(kindOf(F)))).join('')}</div>`:''}</div></details>`:''}
    </div></div>`;
  if(bg){const c=$('#pv'),vw=VWS.has(s);let press=-1,down=-1,hov=-1;mountPreview(c,()=>({scr:pscr,orig:S.hcmp==='orig',view:vw?vwCur(s):null,press,hov}));
    if(vw){vwBar(s);if(VW.st!==2)loadVistas().then(()=>{vwBar(s);schedule()});
      c.onpointerdown=e=>{const V=vwCur(s);if(!V)return;down=vwHit(V,c,e).i;press=down;schedule()};
      c.onpointermove=e=>{if(e.pointerType!=='mouse')return;const V=vwCur(s);if(!V)return;const h=vwHit(V,c,e);c.style.cursor=h.i>=0?'pointer':'default';if(h.i!==hov){hov=h.i;schedule()}};
      c.onpointerleave=c.onpointercancel=()=>{down=press=hov=-1;schedule()};
      const sBtns=()=>{const V=vwCur(s);return V?[...new Set(V.c.map(q=>byName(q[0])).filter(F=>F&&(isBtnLike(F)||ACCENT.test(F.lc))))]:[]},redraw=()=>{mountThumbs(v);schedule()};
      const wasLong=longPress(c,e=>{const V=vwCur(s);if(!V)return;const h=vwHit(V,c,e);down=press=-1;schedule();if(h.i>=0&&h.F)styleMenu(h.F,sBtns(),redraw)});
      c.onpointerup=e=>{const V=vwCur(s),i=down;down=press=-1;schedule();if(wasLong())return;if(!V||i<0)return;const h=vwHit(V,c,e);if(h.i!==i)return;
        if(S.pasteMode&&S.clip&&h.F){pasteStyle([h.F]);redraw();return}
        if(isBtnLike(h.F))btnSheet(h.F,redraw);else go({n:'edit',p:h.F.path})}}$('#sc-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.hcmp=b.dataset.v;$$('#sc-cmp button').forEach(x=>x.setAttribute('aria-pressed',x===b));schedule()}}
  const kb=$('#sc-kit');if(kb)kb.onclick=homeKit;
  const hbb=$('#sc-hb');if(hbb)hbb.onclick=()=>btnSheet(hb,()=>{mountThumbs(v);schedule()});
  const all=$('#sc-all');if(all)all.ontoggle=()=>{if(all.open)mountThumbs(v)};
  const sec0=secs[0],get=()=>S.ops.sec[sec0],set=o=>{for(const k of secs)setScopeOps(k,o?structuredClone(o):o)};
  tintUI($('#sc-tint'),'sc',get,set,()=>{schedule();mountThumbs(v)});
  $('#sc-more').onclick=()=>{S.scope=sec0;go({n:'theme'})};
  const bk=$('#sc-bk .swg');if(bk){const setBk=h=>{before();const o={...defOps(),...(S.ops.file[bg.path]||{})};o.map={...(o.map||{})};if(h==null)delete o.map[13];else o.map[13]={to:h,ts:.6,tl:.1};if(!Object.keys(o.map).length)delete o.map;setFileOps(bg,o);bump()};
    bk.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;bk.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));setBk(b.dataset.h==='none'?null:+b.dataset.h)};
    bk.querySelector('[data-pick]').onchange=e=>{const [h,,l]=hexHsl(e.target.value);before();const o={...defOps(),...(S.ops.file[bg.path]||{})};o.map={...(o.map||{}),13:{to:Math.round(h),ts:.6,tl:Math.min(.85,l)}};setFileOps(bg,o);bump()}}
  const lk=$('#sc-lk');if(lk){
    // miniaturas: cada estilo dibujado sobre un botón de esta pantalla que tenga icono (si no, el primero)
    const R=sty.find(F=>extractIcon(F)&&F.w/frames(F)/F.h<2.2)||sty.find(F=>extractIcon(F))||sty[0];
    const cvs=[...lk.querySelectorAll('canvas[data-lk]')];let ci=0;const step=()=>{for(let n=0;n<4&&ci<cvs.length;n++,ci++){const cv=cvs[ci],k=cv.dataset.lk;if(!cv.isConnected)return;
        if(k==='orig'){const fw=R.w/frames(R),c=document.createElement('canvas');c.width=fw;c.height=R.h;c.getContext('2d').drawImage(renderOrig(R,false),0,0,fw,R.h,0,0,fw,R.h);putMini(cv,c)}else putMini(cv,miniTile(R,{...g,style:k},0))}
      if(ci<cvs.length)requestAnimationFrame(step)};if(R)requestAnimationFrame(step);
    lk.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;const k=b.dataset.v,nm=(LOOKS().find(x=>x[0]===k)||['',''])[1];
      const L=k==='orig'?[...new Set([...sty,...btns.filter(G=>((g.per[G.path]||{}).look||'orig')!=='orig')])]:sty;
      lk.querySelectorAll('.ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));before();for(const G of L)(g.per[G.path]||(g.per[G.path]={})).look=k;
      toast('Aplicando…',{ms:20000});await new Promise(r=>setTimeout(r,30));applyButtons(L);mountThumbs(v);schedule();toast(`«${nm}» en ${L.length} botones`,{label:'Deshacer',fn:undo})}}
  // colores de marco e icono para todos los botones de la pantalla a la vez
  const allCol=async(key,h)=>{before();for(const G of sty){const q=g.per[G.path]||(g.per[G.path]={});if(h==null)delete q[key];else q[key]=h}
    // el color del marco también tiñe los detalles de la pantalla: los puntos de las opciones, la barra de la fila elegida en las listas, las líneas separadoras…
    if(key==='hue')tintScreen(s,files,sty,h);
    toast('Aplicando…',{ms:20000});await new Promise(r=>setTimeout(r,30));applyButtons(sty);render(true);toast(key==='hue'?`Color cambiado en ${sty.length} botones y los detalles de la pantalla`:`Color cambiado en ${sty.length} botones`,{label:'Deshacer',fn:undo})};
  for(const [id,key] of [['#sc-fc','hue'],['#sc-icc','ihue']]){const sw=$(id+' .swg');if(!sw)continue;
    sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;const h=b.dataset.h;allCol(key,h==='none'?null:h==='white'?'white':+h)};
    sw.querySelector('[data-pick]').onchange=e=>allCol(key,Math.round(hexHsl(e.target.value)[0]))}
  const isz=$('#sc-isz');if(isz)isz.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;await setIsIn(+b.dataset.v,btns);render(true)};
  mountThumbs(v);
}

/* ---- Kit para averiguar qué imagen usa la radio para la casa de cada pantalla ----
   Pone una letra grande en todas las «casas» del backup. Se instala con Automático y en el coche se lee qué letra sale
   en la pantalla que no cambia. Un segundo ZIP devuelve esas imágenes a como estaban. */
const HOMEKIT=[['fm radio/fmradio_softkey_home_btn.bmp','R','Radio'],['media/media_softkey_home_btn.bmp','M','Multimedia'],['phone/phone_softkey_home_btn.bmp','T','Teléfono'],
  ['setting/setting_softkey_home_btn.bmp','A','Ajustes'],['eco/eco_softkey_home_btn.bmp','E','Driving eco'],['etc/etc_caution_softkey_home_btn.bmp','C','Avisos (precaución)'],['4wd/4wd_softkey_home_btn.bmp','W','4x4 (4WD)']];
function kitBytes(F,l){const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d');x.drawImage(renderOrig(F,false),0,0);
  for(let s=0;s<fr;s++){x.fillStyle=s%2?'#202020':'#e02020';x.fillRect(s*fw+2,2,fw-4,F.h-4);x.fillStyle='#ffffff';x.font=`900 ${Math.round(F.h*.72)}px Inter, Arial, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(l,s*fw+fw/2,F.h/2+2)}
  const q=quantize(x.getImageData(0,0,F.w,F.h).data,F.w,F.h,{key:new Uint8Array(F.w*F.h),dither:false});return new Uint8Array(encodeBMP8(F.w,F.h,q.idx,q.pal,F))}
async function homeKitZip(undo){const rs=[];for(const [n,l] of HOMEKIT){const F=byName(n);if(F)rs.push({F,u:undo?outBytes(F):kitBytes(F,l)})}
  const {ents}=autoEntries(rs,!undo,{boot:SET.xboot!==false,name:undo?'Quitar la prueba (vuelve tu diseño)':'Prueba: letras en las casas'});
  ents.push({name:'LEEME.txt',data:new TextEncoder().encode(undo?'Quita las letras: pone las casas como están en tu diseño actual de Mediaskinhz. Se instala igual que la prueba.':
    ['Prueba: cada «casa» lleva una letra para saber qué imagen usa la radio en cada pantalla.','',...HOMEKIT.map(([n,l,t])=>`${l} = ${t}  (${n})`),'','Instálalo como siempre (Automático). En la pantalla que no cambiaba, mira qué letra sale en la casa.','Después instala «quitar-prueba-casas.zip»: las casas vuelven a como están en tu diseño.'].join('\r\n'))});
  return makeZip(ents)}
async function homeKit(){openBS(`<h2>¿Qué imagen usa la casa?</h2><p class="note">Pon una letra en todas las casas de la radio, instálalo y mira qué letra sale en la pantalla que no cambiaba (por ejemplo, Driving eco).</p>
  <div class="list">${HOMEKIT.map(([n,l,t])=>`<div class="li"><span class="ic" style="font-weight:900">${l}</span><span class="tx"><b>${esc(t)}</b><small>${esc(n)}</small></span></div>`).join('')}</div>
  <div class="stack" style="gap:8px;margin-top:10px"><button class="btn wide" data-k="1">1. Descargar la prueba</button><button class="btn o wide" data-k="2">2. Descargar «quitar la prueba» (vuelve tu diseño)</button><button class="btn o wide" data-k="0">Cerrar</button></div>`);
  $('#bs').onclick=async e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;if(k==='0'){closeBS();return}
    toast('Preparando…',{ms:20000});try{const z=await homeKitZip(k==='2');await saveBlob(z,k==='2'?'quitar-prueba-casas.zip':'prueba-casas.zip')}catch(_){toast('No se ha podido preparar el ZIP')}}}
