
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
const VW={st:0,data:null,p:null},VWS=new Set(['radio','media','phone']),VMAIN=/^(Principal|Reproductor|Marcador)$/;
function loadVistas(){if(VW.p)return VW.p;VW.st=1;VW.p=fetch('vistas.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{VW.data=j.views;VW.st=2}).catch(()=>{VW.st=3;VW.p=null});return VW.p}
// ancho de un estado: el del sitio que le da la radio si la tira es un múltiplo exacto; si no, el que se deduce de la imagen
const vwFw=(F,w,h)=>F.w>w&&w>0&&F.w%w===0&&F.h===h?w:F.w/frames(F);
const vwList=s=>(VW.data||[]).filter(o=>o.s===s);
const vwBand=s=>{const L=vwList(s),k=(S.vw||(S.vw={}))[s]||{};return k.band??(L[0]||{}).band??''};
function vwCur(s){const L=vwList(s);if(!L.length)return null;const k=(S.vw||(S.vw={}))[s]||{},b0=vwBand(s),inB=L.filter(o=>o.band===b0||!o.band);
  return inB.find(o=>o.v===k.v)||inB.find(o=>VMAIN.test(o.v))||inB[0]||L[0]}
function drawView(x,V,rc,press){
  for(let i=0;i<V.c.length;i++){const [f,cx,cy,w,h,,t,lr,col]=V.c[i],F=f&&byName(f);
    if(F){const fw=vwFw(F,w,h),fr=Math.round(F.w/fw),st=i===press&&fr>1?1:0;x.drawImage(rc(F),st*fw,0,fw,F.h,cx,cy,fw,F.h)}
    else if(!t&&w<800){x.save();x.setLineDash([5,5]);x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=1;x.strokeRect(cx+.5,cy+.5,w-1,h-1);x.restore()}
    if(t){const [lx,ly,lw,lh]=lr;x.save();x.font=`600 ${Math.round(Math.max(13,Math.min(24,lh*.6)))}px Tahoma,Inter,sans-serif`;x.textAlign='center';x.textBaseline='middle';
      x.fillStyle=i===press&&F&&frames(F)>1?'#000':col;x.fillText(t,lx+lw/2,ly+lh/2,Math.max(10,lw-8));x.restore()}}}
function vwHit(V,c,e){const r=c.getBoundingClientRect(),px=(e.clientX-r.left)*800/r.width,py=(e.clientY-r.top)*480/r.height;
  for(let i=V.c.length-1;i>=0;i--){const [f,cx,cy,w,h]=V.c[i],F=f&&byName(f);if(!F||w>=800)continue;const fw=vwFw(F,w,h);if(px>=cx&&px<cx+Math.max(w,fw)&&py>=cy&&py<cy+Math.max(h,F.h))return {i,F}}
  // las barras de arriba ocupan todo el ancho: solo si no hay nada encima
  for(let i=V.c.length-1;i>=0;i--){const [f,cx,cy,w,h]=V.c[i],F=f&&byName(f);if(F&&px>=cx&&px<cx+w&&py>=cy&&py<cy+h)return {i,F}}return {i:-1}}
function vwBar(s){const el=$('#sc-vw');if(!el)return;
  if(VW.st!==2){el.innerHTML=`<p class="hint" style="padding:0">${VW.st===3?'No se han podido cargar las vistas de dentro (hace falta conexión la primera vez). <button class="btn o sm" data-rt>Reintentar</button>':'Cargando las vistas de dentro…'}</p>`;
    const rt=el.querySelector('[data-rt]');if(rt)rt.onclick=()=>{loadVistas().then(()=>{vwBar(s);schedule()});vwBar(s)};return}
  const L=vwList(s),cur=vwCur(s);if(!cur){el.innerHTML='';return}
  const bands=[...new Set(L.map(o=>o.band))].filter(Boolean),b0=vwBand(s),inB=L.filter(o=>o.band===b0||!o.band);
  el.innerHTML=`${bands.length>1?`<div class="chips scroll vwb" role="group" aria-label="Fuente">${bands.map(b=>`<button class="chip" data-b="${esc(b)}" aria-pressed="${b===b0}">${esc(b)}</button>`).join('')}</div>`:''}
    <div class="chips scroll vwv" role="group" aria-label="Vista">${inB.map(o=>`<button class="chip" data-w="${esc(o.v)}" aria-pressed="${o===cur}">${esc(o.v)}</button>`).join('')}</div>`;
  el.onclick=e=>{const b=e.target.closest('[data-b],[data-w]');if(!b)return;const k=(S.vw||(S.vw={}))[s]||(S.vw[s]={});
    if(b.dataset.b!=null){k.band=b.dataset.b;delete k.v}else{k.v=b.dataset.w}vwBar(s);schedule()}}
function scrScreen(v,r){
  const s=r.s,secs=scrSecs(s),files=scrFiles(s),bg=s==='common'?null:byName(SCRBG.get(s)),hb=s==='common'?null:scrHomeBtn(s);
  setTitle(scrName(s),`${files.length+(bg?1:0)} imágenes de esta pantalla`);
  const btns=files.filter(isBtnLike),rest=files.filter(F=>!isBtnLike(F)),sty=btns.filter(F=>kindOf(F)==='btn'&&canStyle(F));
  const g=S.gen||(S.gen=defGen()),looks=new Set(sty.map(F=>(g.per[F.path]||{}).look||'orig')),curLook=looks.size===1?[...looks][0]:null;
  v.innerHTML=`<div class="two">
    ${bg?`<div class="stick sticky-pv">${VWS.has(s)?'<div id="sc-vw" class="vwbar"></div>':''}${pvBlock('pv')}<div class="e-bar"><div class="seg" id="sc-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="${S.hcmp!=='orig'}">Ahora</button><button data-v="orig" aria-pressed="${S.hcmp==='orig'}">Original</button></div><span class="sp"></span><span class="hint" style="padding:0">${VWS.has(s)?'Toca un botón de la pantalla para cambiarlo':'Fondo de '+esc(scrName(s))+' con tus cambios'}</span></div></div>`:''}
    <div class="stack">
    ${hb?`<div class="card"><h3>Su botón en Inicio</h3><div id="sc-btn"></div></div>`:''}
    <div class="card"><h3>Color de toda la pantalla</h3><p class="note">Tiñe todas las imágenes de ${esc(scrName(s))} a la vez. Lo que cambies después en una imagen concreta manda sobre esto.</p><div id="sc-tint"></div>
      <button class="btn o sm" id="sc-more">Más colores de esta pantalla</button></div>
    ${bg?`<div class="card"><h3>Fondo</h3><div class="list">${fileRow(bg,'Fondo · 800×480')}</div>
      <p class="lbl">Color del negro del fondo</p><div class="hsw" id="sc-bk">${swatches(((S.ops.file[bg.path]||{}).map||{})[13]?((S.ops.file[bg.path].map[13].to)):'none',{none:'Negro original',label:'Color del negro del fondo'})}</div>
      <p class="note">Conserva el degradado. Para un fondo claro o una foto: toca el fondo → Sustituir.</p></div>`:''}
    ${btns.length?`<div class="card"><h3>Botones e iconos <small class="cnt">${btns.length}</small></h3><p class="note">Toca uno para cambiar su icono, colores y estilo.</p>
      ${sty.length?`<p class="lbl">El mismo estilo para los ${sty.length} botones</p><div class="chips scroll" id="sc-lk">${LOOKS().map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${curLook===k}">${l}</button>`).join('')}</div>`:''}
      <div class="grid sc-grid">${btns.map(tile).join('')}</div></div>`:''}
    ${rest.length?`<div class="card"><h3>Otras piezas <small class="cnt">${rest.length}</small></h3><p class="note">Barras, listas, fondos de ventanas… Tócalas para cambiar sus colores o sustituirlas.</p><div class="list">${rest.map(F=>fileRow(F,KINDL.get(kindOf(F)))).join('')}</div></div>`:''}
    </div></div>`;
  if(bg){const c=$('#pv'),vw=VWS.has(s);let press=-1,down=-1;mountPreview(c,()=>({scr:s,orig:S.hcmp==='orig',view:vw?vwCur(s):null,press}));
    if(vw){vwBar(s);if(VW.st!==2)loadVistas().then(()=>{vwBar(s);schedule()});
      c.onpointerdown=e=>{const V=vwCur(s);if(!V)return;down=vwHit(V,c,e).i;press=down;schedule()};
      c.onpointermove=e=>{if(e.pointerType!=='mouse')return;const V=vwCur(s);if(!V)return;const h=vwHit(V,c,e);c.style.cursor=h.i>=0?'pointer':'default'};
      c.onpointerleave=c.onpointercancel=()=>{down=press=-1;schedule()};
      c.onpointerup=e=>{const V=vwCur(s),i=down;down=press=-1;schedule();if(!V||i<0)return;const h=vwHit(V,c,e);if(h.i!==i)return;
        if(isBtnLike(h.F))btnSheet(h.F,()=>{mountThumbs(v);schedule()});else go({n:'edit',p:h.F.path})}}$('#sc-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.hcmp=b.dataset.v;$$('#sc-cmp button').forEach(x=>x.setAttribute('aria-pressed',x===b));schedule()}}
  if(hb)btnSheet(hb,()=>mountThumbs(v),$('#sc-btn'));
  const sec0=secs[0],get=()=>S.ops.sec[sec0],set=o=>{for(const k of secs)setScopeOps(k,o?structuredClone(o):o)};
  tintUI($('#sc-tint'),'sc',get,set,()=>{schedule();mountThumbs(v)});
  $('#sc-more').onclick=()=>{S.scope=sec0;go({n:'theme'})};
  const bk=$('#sc-bk .swg');if(bk){const setBk=h=>{before();const o={...defOps(),...(S.ops.file[bg.path]||{})};o.map={...(o.map||{})};if(h==null)delete o.map[13];else o.map[13]={to:h,ts:.6,tl:.1};if(!Object.keys(o.map).length)delete o.map;setFileOps(bg,o);bump()};
    bk.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;bk.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));setBk(b.dataset.h==='none'?null:+b.dataset.h)};
    bk.querySelector('[data-pick]').onchange=e=>{const [h,,l]=hexHsl(e.target.value);before();const o={...defOps(),...(S.ops.file[bg.path]||{})};o.map={...(o.map||{}),13:{to:Math.round(h),ts:.6,tl:Math.min(.85,l)}};setFileOps(bg,o);bump()}}
  const lk=$('#sc-lk');if(lk)lk.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;const k=b.dataset.v,nm=(LOOKS().find(x=>x[0]===k)||['',''])[1];
    if(!await confirmBS({title:`«${nm}» en ${scrName(s)}`,text:`Se aplicará a los ${sty.length} botones de esta pantalla. El icono y el color de cada uno se mantienen. Podrás deshacerlo.`,ok:'Aplicar'}))return;
    before();for(const G of sty)(g.per[G.path]||(g.per[G.path]={})).look=k;toast('Aplicando…',{ms:20000});await new Promise(r=>setTimeout(r,30));applyButtons(sty);render(true);toast(`${sty.length} botones con «${nm}»`,{label:'Deshacer',fn:undo})};
  mountThumbs(v);
}
