
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
function scrScreen(v,r){
  const s=r.s,secs=scrSecs(s),files=scrFiles(s),bg=s==='common'?null:byName(SCRBG.get(s)),hb=s==='common'?null:scrHomeBtn(s);
  setTitle(scrName(s),`${files.length+(bg?1:0)} imágenes de esta pantalla`);
  const btns=files.filter(isBtnLike),rest=files.filter(F=>!isBtnLike(F)),sty=btns.filter(F=>kindOf(F)==='btn'&&canStyle(F));
  const g=S.gen||(S.gen=defGen()),looks=new Set(sty.map(F=>(g.per[F.path]||{}).look||'orig')),curLook=looks.size===1?[...looks][0]:null;
  v.innerHTML=`<div class="two">
    ${bg?`<div class="stick sticky-pv">${pvBlock('pv')}<div class="e-bar"><div class="seg" id="sc-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="${S.hcmp!=='orig'}">Ahora</button><button data-v="orig" aria-pressed="${S.hcmp==='orig'}">Original</button></div><span class="sp"></span><span class="hint" style="padding:0">Fondo de ${esc(scrName(s))} con tus cambios</span></div></div>`:''}
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
  if(bg){const c=$('#pv');mountPreview(c,()=>({scr:s,orig:S.hcmp==='orig'}));$('#sc-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.hcmp=b.dataset.v;$$('#sc-cmp button').forEach(x=>x.setAttribute('aria-pressed',x===b));schedule()}}
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
