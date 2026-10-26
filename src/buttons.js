
/* ============ botones de Inicio: un solo motor ============
   Cada botón = aspecto (S.gen.look: 'orig' = el de Renault, o un estilo del generador) + lo elegido para él (S.gen.per[ruta]: icono y color).
   Todo se aplica al momento (sin «Aplicar») y se puede deshacer.
   · Aspecto original: el color cambia la familia de color principal de la imagen y el icono se pone conservando el fondo de Renault.
   · Con un estilo: el botón se dibuja entero de nuevo con ese estilo, el icono y el color. */
function btnLook(){const g=S.gen||(S.gen=defGen());if(!g.look)g.look='orig';return g.look}
function mainFam(F){const st=stats(F);let best=-1,n=0;for(const f of st.fam.values())if(f.k<12&&f.n>n){n=f.n;best=f.k}return best}
function btnHueOps(F,hue){const o={...defOps(),...(S.ops.file[F.path]||{})};o.map={...(o.map||{})};
  if(o.bk!=null){delete o.map[o.bk];delete o.bk}
  if(hue!=null){const k=mainFam(F);if(k>=0){o.map[k]={to:hue,ts:.72,tl:.5};o.bk=k}}
  if(!Object.keys(o.map).length)delete o.map;setFileOps(F,o)}
function buildButton(F){const g=S.gen,p=g.per[F.path]||{},look=btnLook();
  if(look==='orig'){
    const k=p.icon&&p.icon!=='orig'&&p.icon!=='png'?p.icon:null;
    if(k){F.rep=null;F.icz=null;icApply(F,{k},true);if(F.rep)F.rep.by='btn';if(S.icx)delete S.icx[F.path];delete S.ex[F.path]}
    else{if(F.rep&&(F.rep.by==='btn'||F.rep.by==='gen'))F.rep=null;if(S.icx)delete S.icx[F.path];if(S.ex[F.path]===true)delete S.ex[F.path]}
    btnHueOps(F,p.hue)}
  else{btnHueOps(F,null);const c=genTile(F,g),d=c.getContext('2d').getImageData(0,0,F.w,F.h).data,key=new Uint8Array(F.w*F.h);
    for(let i=0;i<F.w*F.h;i++)if(d[i*4+3]<128)key[i]=1;const q=quantize(d,F.w,F.h,{key,dither:true});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'gen'};S.ex[F.path]=true;if(S.icx)delete S.icx[F.path]}
  F.cv=null}
function applyButtons(list){if(!S.gen)return;for(const F of list||genTargets())buildButton(F);S.genCv=null;S.ver++;schedule();saveState()}
let btnT=0;function applyButtonsSoon(list){clearTimeout(btnT);btnT=setTimeout(()=>applyButtons(list),180)}
// ¿Hay en estos botones una imagen que pusiste tú a mano (no hecha por este motor)?
const handRep=F=>F.rep&&F.rep.by!=='btn'&&F.rep.by!=='gen';
async function setLook(v){const fs=genTargets(),mine=fs.filter(handRep);
  if(v!=='orig'&&mine.length&&!await confirmBS({title:'Cambiar el estilo de los botones',text:`${mine.map(F=>esc(pretty(F))).join(', ')} ${mine.length===1?'tiene':'tienen'} una imagen que pusiste tú. El estilo la sustituirá. Podrás deshacerlo.`,ok:'Cambiar el estilo'}))return false;
  before();btnLook();S.gen.look=v;if(v!=='orig')S.gen.style=v;applyButtons(fs);return true}
// Para estados guardados antes de este motor
function migrateLook(st){if(!S.gen||S.gen.look)return;const fs=genTargets(),icx=(st&&st.icx)||{};S.gen.look=fs.some(F=>F.rep&&!icx[F.path])?S.gen.style:'orig';for(const F of fs)if(F.rep&&!icx[F.path]&&S.gen.look!=='orig')F.rep.by='gen'}

/* Hoja de un botón: todo lo de ese botón en un sitio (Icono · Color · Estilo · Más), al momento */
const LOOKS=()=>[['orig','Original de Renault'],...GSTYLES];
function btnSheet(F,after){
  const g=S.gen||(S.gen=defGen()),fs=genTargets(),idx=fs.indexOf(F),look=btnLook();S.gsel=F.path;const p=()=>g.per[F.path]||(g.per[F.path]={});const ps=g.per[F.path]||{};
  const tab=S.btab||(S.btab='icon');const cur=ps.icon||'orig',sug=icSuggest(F).map(n=>'t:'+n);
  const icons=['orig','mine',...(cur.startsWith('t:')||cur.startsWith('lib:')||cur.startsWith('my:'))&&!sug.includes(cur)?[cur]:[],...sug,'all'];
  if(IC.st!==2){icLoad();S.icRedraw=()=>{if($('#bt-ic'))btnSheet(F,after)}}
  const icT=k=>k==='orig'?'El original':k==='mine'?'Mis iconos':k==='all'?'Ver todos':k.startsWith('lib:')?ICONL[k.slice(4)]||k:keyLabel(k);
  const done=()=>{after&&after();const m=$('#pv');if(m)drawPreview(m,{scr:'home',state:S.gstate||0})};
  const change=fn=>{before();fn();applyButtons([F]);done();pv()};
  openBS(`<div class="gsh"><div class="screen"><canvas id="bt-pv" width="800" height="480" aria-label="Vista previa de Inicio con ${esc(pretty(F))} marcado"></canvas></div>
      <div class="e-bar"><div><h2>${esc(pretty(F))}</h2></div><span class="sp"></span><div class="seg" id="bt-st" role="group" aria-label="Estado"><button data-s="0" aria-pressed="${!S.gstate}">Reposo</button><button data-s="1" aria-pressed="${S.gstate===1}">Pulsado</button></div></div></div>
    <div class="seg gtabs bt-tabs" id="bt-tabs" role="tablist">${[['icon','Icono'],['color','Color'],['look','Estilo'],['more','Más']].map(([k,l])=>`<button data-t="${k}" aria-pressed="${tab===k}">${l}</button>`).join('')}</div>
    <div data-bp="icon"${tab==='icon'?'':' hidden'}><p class="note">Solo para este botón. Para subir el tuyo: «Mis iconos».</p><div class="icg" id="bt-ic">${icons.map(k=>`<button class="icb${k==='all'||k==='mine'?' all':''}" data-k="${k}" aria-pressed="${cur===k}" title="${esc(icT(k))}"><canvas width="88" height="88"></canvas><span>${esc(icT(k))}</span></button>`).join('')}</div></div>
    <div data-bp="color"${tab==='color'?'':' hidden'}><p class="note">${look==='orig'?'Cambia el color principal de este botón y conserva su dibujo original.':'El color de este botón con el estilo elegido.'}</p><div id="bt-col">${swatches(ps.hue!=null?ps.hue:'none',{none:look==='orig'?'El original':'Como el resto',label:'Color de este botón'})}</div></div>
    <div data-bp="look"${tab==='look'?'':' hidden'}><p class="note">El estilo es <b>común a los ${fs.length} botones</b> de Inicio, para que combinen. El icono y el color de cada uno se mantienen.</p><div class="ocg" id="bt-lk">${LOOKS().map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${look===k}"><canvas data-lk="${k}"></canvas><span>${l}</span></button>`).join('')}</div></div>
    <div data-bp="more"${tab==='more'?'':' hidden'}><div class="list">
      <button class="li" data-mo="gen"><span class="ic">${ic('M4 6h10M18 6h2M16 4v4M4 12h4M12 12h8M10 10v4M4 18h12M18 16v4')}</span><span class="tx"><b>Forma, tamaño del icono y trazo</b><small>Ajustes finos del estilo, para todos los botones</small></span>${CHEV}</button>
      <button class="li" data-mo="edit"><span class="ic">${ic('M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4')}</span><span class="tx"><b>Editar esta imagen a fondo</b><small>Todos sus colores, sustituirla por una foto, estados</small></span>${CHEV}</button>
      <button class="li" data-mo="reset"><span class="ic">${ic('M3 12a9 9 0 1 0 3-6.7M3 4v5h5')}</span><span class="tx"><b>Volver al original este botón</b><small>Quita su icono y su color propios</small></span>${CHEV}</button></div></div>
    <div class="gnav"><button class="btn o sm" data-mv="-1"${idx<=0?' disabled':''}>‹ Anterior</button><button class="btn sm" data-done>Hecho</button><button class="btn o sm" data-mv="1"${idx>=fs.length-1?' disabled':''}>Siguiente ›</button></div>`);
  const bs=$('#bs');bs.onclick=null;
  const gcv=$('#bt-pv'),pv=()=>drawPreview(gcv,{scr:'home',state:S.gstate||0,selP:F.path});pv();
  $('#bt-st').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.gstate=+b.dataset.s;$$('#bt-st button').forEach(x=>x.setAttribute('aria-pressed',x===b));pv();done()};
  let gd=-1;gcv.onpointerdown=e=>{gd=slotAt(gcv,e).i};gcv.onpointerup=e=>{const h=slotAt(gcv,e),i=gd;gd=-1;if(i<0||h.i!==i)return;const n=slotF(S.layout.slots[i]);if(n&&n!==F&&fs.includes(n))btnSheet(n,after)};
  $('#bt-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.btab=b.dataset.t;$$('#bt-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('[data-bp]').forEach(x=>x.hidden=x.dataset.bp!==S.btab);if(S.btab==='look')drawLooks()};
  const col=getComputedStyle(document.body).color;
  $$('#bt-ic canvas').forEach(cv=>{const k=cv.parentNode.dataset.k,x=cv.getContext('2d');x.clearRect(0,0,88,88);
    if(k==='orig'){const mk=extractIcon(F);if(mk)drawMask(x,mk,44,44,Math.min(70/mk.bw,70/mk.bh),col,0);else{x.fillStyle=col;x.font='600 13px Inter,sans-serif';x.textAlign='center';x.fillText('Original',44,48)}}
    else if(k==='mine'){x.strokeStyle=col;x.lineWidth=4;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(44,62);x.lineTo(44,26);x.moveTo(30,40);x.lineTo(44,26);x.lineTo(58,40);x.moveTo(26,66);x.lineTo(62,66);x.stroke()}
    else if(k==='all'){x.fillStyle=col;for(let i=0;i<3;i++)for(let j=0;j<3;j++){x.globalAlpha=i===1&&j===1?1:.45;x.beginPath();x.arc(28+i*16,28+j*16,4.5,0,7);x.fill()}x.globalAlpha=1}
    else drawIconKey(x,k,44,44,52,col,0)});
  const pick=k=>change(()=>{p().icon=k==='orig'?undefined:k});
  const openPicker=cat=>{S.ipk=S.ipk||{q:'',cat:'radio',n:96};if(cat){S.ipk.cat=cat;S.ipk.q=''}iconPicker({title:'Icono para '+pretty(F),cur,back:()=>btnSheet(F,after),onPick:nk=>{before();p().icon=nk;applyButtons([F]);done();btnSheet(F,after)}})};
  $('#bt-ic').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
    if(k==='all')return openPicker(null);if(k==='mine')return openPicker('my');
    if(k==='orig'&&btnLook()!=='orig'&&!extractIcon(F)){toast('No he podido separar el icono original de este botón');return}
    $$('#bt-ic .icb').forEach(x=>x.setAttribute('aria-pressed',x===b));pick(k)};
  const sw=$('#bt-col .swg');sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;sw.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));change(()=>{p().hue=b.dataset.h==='none'?null:+b.dataset.h})};
  sw.querySelector('[data-pick]').onchange=e=>change(()=>{p().hue=Math.round(hexHsl(e.target.value)[0])});
  const drawLooks=()=>$$('#bt-lk canvas').forEach(cv=>{const k=cv.dataset.lk;if(k==='orig'){const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=fw;c.height=F.h;c.getContext('2d').drawImage(renderOrig(F,false),0,0,fw,F.h,0,0,fw,F.h);putMini(cv,c)}else putMini(cv,miniTile(F,{...g,style:k},0))});
  if(tab==='look')drawLooks();
  $('#bt-lk').onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;if(await setLook(b.dataset.v)){$$('#bt-lk .ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));done();pv();const n=$('[data-bp="color"] .note');if(n)n.textContent=btnLook()==='orig'?'Cambia el color principal de este botón y conserva su dibujo original.':'El color de este botón con el estilo elegido.'}};
  $$('[data-mo]').forEach(b=>b.onclick=async()=>{const m=b.dataset.mo;
    if(m==='gen'){closeBS();go({n:'gen'})}else if(m==='edit'){closeBS();go({n:'edit',p:F.path})}
    else{change(()=>{delete g.per[F.path]});toast(pretty(F)+' vuelve al original',{label:'Deshacer',fn:undo})}});
  bs.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const n=fs[idx+ +b.dataset.mv];if(n)btnSheet(n,after)});
  bs.querySelector('[data-done]').onclick=()=>{S.icRedraw=null;closeBS();after&&after()};
}
