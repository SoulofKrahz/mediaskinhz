
/* ============ ajustes, confirmaciones, puntos de restauración e historial ============ */
const SETDEF={confirm:true,auto:true,xboot:true,xmode:'auto',xhw:2,xorig:true,pv:'m',theme:'auto'};
let SET={...SETDEF};
function loadSet(){try{SET={...SETDEF,...JSON.parse(localStorage.getItem('skinhz-set')||'{}')}}catch(_){SET={...SETDEF}}
  if(S.xmode===undefined)S.xmode=SET.xmode;if(S.xhw===undefined)S.xhw=SET.xhw;applySetUI()}
function saveSet(){try{localStorage.setItem('skinhz-set',JSON.stringify(SET))}catch(_){}applySetUI()}
function applySetUI(){document.body.classList.toggle('pv-s',SET.pv==='s');document.body.classList.toggle('pv-l',SET.pv==='l')}
function confirmBS(o){return new Promise(res=>{
  if(!SET.confirm&&!o.always){res(true);return}
  openBS(`<h2>${o.title}</h2><p>${o.text}</p>${o.extra||''}<div class="cfm"><button class="btn o" data-c="0">${o.cancel||'Cancelar'}</button><button class="btn${o.danger?' dgf':''}" data-c="1">${o.ok}</button></div>`);
  S.bsCancel=()=>res(false);
  $('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;S.bsCancel=null;closeBS();res(x.dataset.c==='1')}})}
const sig=()=>S.root+':'+S.files.length;
async function getList(k){try{return (await idb.get(k))||[]}catch(_){return []}}
/* ---- Diseños y copias: un registro por diseño ('pt:<id>') y un índice pequeño ('ptidx') con lo que se enseña en la lista.
   Borrar quita primero el registro (libera espacio aunque el navegador esté lleno) y guardar no reescribe los demás.
   Se guardan todos los diseños con nombre y, como mucho, las 10 últimas copias automáticas y las 10 de exportación. */
const PT={idx:null},PTKEEP=10;
const ptMeta=p=>({id:p.id,t:p.t,label:p.label,kind:p.kind,sig:p.sig,n:p.n,thumb:p.thumb||null});
async function ptIndex(){if(PT.idx)return PT.idx;let ix=null;try{ix=await idb.get('ptidx')}catch(_){}
  if(!Array.isArray(ix)){ix=[];let old=null;try{old=await idb.get('points')}catch(_){}   // de la versión anterior: todos juntos en 'points'
    if(Array.isArray(old))for(const p of old){try{await idb.set('pt:'+p.id,p);ix.push(ptMeta(p))}catch(_){}}
    try{await idb.set('ptidx',ix);if(old)await idb.del('points')}catch(_){}}
  PT.idx=ix;return ix}
const listPoints=async()=>[...await ptIndex()];
async function getPoint(id){try{return await idb.get('pt:'+id)}catch(_){return null}}
async function putPoint(p){await ptIndex();await idb.set('pt:'+p.id,p);const m=ptMeta(p),i=PT.idx.findIndex(x=>x.id===p.id);if(i>=0)PT.idx[i]=m;else PT.idx.unshift(m);await idb.set('ptidx',PT.idx)}
async function delPoint(id){await ptIndex();try{await idb.del('pt:'+id)}catch(_){}PT.idx=PT.idx.filter(x=>x.id!==id);await idb.set('ptidx',PT.idx)}
async function prunePoints(){const ix=await ptIndex();for(const k of ['auto','export']){const L=ix.filter(x=>x.kind===k).sort((a,b)=>b.t-a.t).slice(PTKEEP);for(const x of L)await delPoint(x.id).catch(()=>{})}}
const noSpace=()=>toast('No queda espacio en el navegador. Borra copias automáticas o diseños que no uses (⋯ → Mis diseños).',{ms:7000});
// Datos de los botones para guardar: todo menos la imagen PNG en memoria (p.png)
function packGen(){if(!S.gen)return null;const gen={...S.gen,per:{}};for(const [k,p] of Object.entries(S.gen.per||{})){const {png,...r}=p;gen.per[k]={...r,icon:p.icon==='png'?undefined:p.icon}}return structuredClone(gen)}
function packState(){const reps={};for(const F of S.files)if(F.rep)reps[F.path]={pal:F.rep.pal,idx:F.rep.idx,keyIdx:F.rep.keyIdx,by:F.rep.by};
  const gen=packGen();
  return {ops:structuredClone(S.ops),ex:{...S.ex},frames:{...S.frames},layout:structuredClone(S.layout),gen,reps,icx:structuredClone(S.icx||{}),stby:S.stby?{...S.stby}:null}}
// Miniatura de la pantalla de Inicio para reconocer cada diseño
function designThumb(){try{const c=document.createElement('canvas');c.width=800;c.height=480;drawPreview(c,{scr:'home'});const t=document.createElement('canvas');t.width=240;t.height=144;const x=t.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,240,144);return t.toDataURL('image/jpeg',.8)}catch(_){return null}}
function promptBS(o){return new Promise(res=>{
  openBS(`<h2>${o.title}</h2>${o.text?`<p class="note">${o.text}</p>`:''}<input class="ipq" id="pb-in" maxlength="40" value="${esc(o.value||'')}" placeholder="${esc(o.ph||'')}" enterkeyhint="done" autocomplete="off"><div class="cfm"><button class="btn o" data-c="0">Cancelar</button><button class="btn" data-c="1">${o.ok||'Guardar'}</button></div>`);
  S.bsCancel=()=>res(null);const inp=$('#pb-in');setTimeout(()=>{inp.focus();inp.select()},60);
  const done=v=>{S.bsCancel=null;closeBS();res(v)};const val=()=>inp.value.trim()||o.value||'Mi diseño';
  $('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;done(x.dataset.c==='1'?val():null)};inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();done(val())}}})}
function designName(){const g=S.gen;if(g&&g.look&&g.look!=='orig'){const st=(GSTYLES.find(x=>x[0]===g.style)||GSTYLES[0])[1];return st+(g.color==='one'?' '+hueName(g.hue).toLowerCase():'')}return 'Mi diseño'}
// Nombres de diseño únicos (sin distinguir mayúsculas) entre los de este backup
const normN=n=>String(n||'').trim().toLowerCase();
async function takenBy(name,except){return (await listPoints()).find(x=>x.kind==='manual'&&x.sig===sig()&&x.id!==except&&normN(x.label)===normN(name))||null}
async function uniqueName(name){let n=String(name).trim()||'Mi diseño',k=2;const base=n;while(await takenBy(n))n=`${base} (${k++})`;return n}
// Pide un nombre que no esté repetido. Devuelve {name} o {over:id} si eliges sobrescribir el que ya tenía ese nombre, o null
async function askName(o){let value=o.value;for(;;){const nm=await promptBS({...o,value});if(!nm)return null;const t=await takenBy(nm,o.except);if(!t)return {name:nm};
  if(!o.allowOver){toast(`Ya hay un diseño llamado «${t.label}». Elige otro nombre.`,{ms:4000});value=nm;continue}
  const a=await new Promise(res=>{openBS(`<h2>«${esc(t.label)}» ya existe</h2><p class="note">Ya tienes un diseño con ese nombre. ¿Lo sustituyes por el actual o eliges otro nombre?</p>
    <div class="stack" style="gap:8px"><button class="btn wide" data-c="over">Sobrescribir «${esc(t.label)}»</button><button class="btn o wide" data-c="ren">Elegir otro nombre</button><button class="btn o wide" data-c="0">Cancelar</button></div>`);
    S.bsCancel=()=>res(null);$('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;S.bsCancel=null;closeBS();res(x.dataset.c==='0'?null:x.dataset.c)}});
  if(!a)return null;if(a==='over')return {over:t.id};value=nm}}
// Diseño del que vienes (guardado, cargado o importado): se recuerda aunque lo edites o recargues la página, para poder sobrescribirlo
function setBase(id,name){S.base=id?{id,name}:null;try{if(id)localStorage.setItem('mediaskinhz-base',JSON.stringify({id,name,sig:sig()}));else localStorage.removeItem('mediaskinhz-base')}catch(_){}}
async function recallBase(){try{const b=JSON.parse(localStorage.getItem('mediaskinhz-base')||'null');if(!b||b.sig!==sig())return;const p=(await listPoints()).find(x=>x.id===b.id&&x.kind==='manual');if(p)S.base={id:p.id,name:p.label}}catch(_){}}
function askSave(name,n){return new Promise(res=>{
  openBS(`<h2>Guardar el diseño</h2><p class="note">Vienes de «${esc(name)}». ¿Quieres guardar encima tus cambios (${n} ${n===1?'imagen cambiada':'imágenes cambiadas'}) o guardarlo como un diseño nuevo?</p>
    <div class="stack" style="gap:8px"><button class="btn wide" data-c="over">Sobrescribir «${esc(name)}»</button><button class="btn o wide" data-c="new">Guardar como diseño nuevo</button><button class="btn o wide" data-c="0">Cancelar</button></div>`);
  S.bsCancel=()=>res(null);$('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;S.bsCancel=null;closeBS();res(x.dataset.c==='0'?null:x.dataset.c)}})}
async function overwriteDesign(id){const p=await getPoint(id);if(!p)return false;
  Object.assign(p,{st:packState(),n:S.files.filter(changed).length,t:Date.now(),sig:sig(),thumb:designThumb()});
  try{await putPoint(p)}catch(_){noSpace();return false}
  S.curDesign=id;S.curDesignName=p.label;setBase(id,p.label);toast(`«${p.label}» actualizado`,{label:'Ver',fn:()=>go({n:'settings'})});return true}
async function saveDesign(){if(S.demo){toast('Carga tu backup para guardar diseños');return}const n=S.files.filter(changed).length;if(!n){toast('Todavía no hay cambios que guardar');return}
  if(S.base){const p=(await listPoints()).find(x=>x.id===S.base.id&&x.kind==='manual');
    if(!p)setBase(null);else{if(S.curDesign===p.id){toast(`«${p.label}» ya está guardado: no hay cambios nuevos`);return}
      const a=await askSave(p.label,n);if(!a)return;if(a==='over'){await overwriteDesign(p.id);return}}}
  const r=await askName({title:'Guardar el diseño',text:`Se guardan tus ${n} ${n===1?'imagen cambiada':'imágenes cambiadas'} con este nombre. Podrás volver a él cuando quieras.`,value:await uniqueName(designName()),ok:'Guardar',allowOver:true});if(!r)return;
  if(r.over){await overwriteDesign(r.over);return}const name=r.name;
  const id=await addPoint(name,'manual');if(id){S.curDesign=id;S.curDesignName=name;setBase(id,name);toast(`«${name}» guardado`,{label:'Ver',fn:()=>go({n:'settings'})})}}
async function addPoint(label,kind){
  if(S.demo)return null;if(kind==='auto'&&!SET.auto)return null;
  const n=S.files.filter(changed).length;if(kind==='auto'&&!n)return null;
  const p={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now(),label,kind:kind||'manual',sig:sig(),n,st:packState()};
  if(kind==='manual')p.thumb=designThumb();
  try{await putPoint(p)}catch(_){await prunePoints().catch(()=>{});if(kind==='manual')noSpace();return null}
  await prunePoints().catch(()=>{});return p.id}
async function restorePoint(id){
  const p=await getPoint(id);if(!p){toast('Ese diseño ya no está guardado');return}
  if(!await confirmBS({title:'Volver a este diseño',text:`Se cargará «${esc(p.label)}» (${p.n} ${p.n===1?'imagen cambiada':'imágenes cambiadas'}). Lo que tienes ahora se guarda antes como copia automática, por si quieres volver.`,ok:'Cargar',always:true}))return;
  await addPoint('Antes de volver a «'+p.label+'»','auto');before();for(const F of S.files)F.rep=null;S.src=new Map();S.ops={global:null,sec:{},file:{}};S.ex={};S.frames={};
  applyState(p.st);if(!p.st.gen)S.gen=null;else if(!S.gen.look)migrateLook(p.st);if(p.kind==='manual'){S.curDesign=p.id;S.curDesignName=p.label;setBase(p.id,p.label)}else setBase(null);bump();S.scr='home';go({n:'home'});toast(`«${p.label}» cargado`,{label:'Deshacer',fn:undo})}
async function recordExport(o){
  if(S.demo)return;const pid=await addPoint('Exportación · '+o.count+' '+(o.count===1?'imagen':'imágenes'),'export');
  const xs=await getList('exports');xs.unshift({id:Date.now().toString(36),t:Date.now(),sig:sig(),mode:o.mode,boot:!!o.boot,hw:o.hw,inc:o.inc,files:o.files,name:o.name,size:o.blob.size,pid,blob:o.blob.size<=25e6?o.blob:null});
  xs.forEach((x,i)=>{if(i>=3)x.blob=null});try{await idb.set('exports',xs.slice(0,30))}catch(_){xs.forEach(x=>x.blob=null);try{await idb.set('exports',xs.slice(0,30))}catch(_){}}}
async function undoZip(x){
  const fs=x.files.map(p=>S.lc.get(p.toLowerCase())).filter(Boolean);if(!fs.length){toast('Este backup no tiene esos archivos');return}
  const d=new Date(),stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,R=S.root;let ents;
  if(x.mode==='lgu')ents=[{name:'upgrade.lgu',data:await makeLGU(fs.map(F=>({name:'upgrade/Storage Card/System/Img/'+R+'/'+F.path,data:new Uint8Array(F.buf)})),x.hw!==1,'Mediaskinhz restaurar')}];
  else if(x.mode==='auto')ents=autoEntries(fs.map(F=>({F,u:new Uint8Array(F.buf)})),false,{boot:!!x.boot,undo:true}).ents;
  else ents=fs.map(F=>({name:R+'/'+F.path,data:new Uint8Array(F.buf)}));
  ents.push({name:'LEEME.txt',data:new TextEncoder().encode([`Deshacer la exportación del ${new Date(x.t).toLocaleString('es-ES')}`,'',`Devuelve a su estado original ${fs.length} ${fs.length===1?'imagen':'imágenes'}:`,...fs.map(F=>'  '+R+'/'+F.path),'',
    x.mode==='auto'?'Descomprime el ZIP en la raíz del USB, abre Total Commander en la radio y toca Mediaskinhz\\instalar.mscr: instala estos originales igual que una exportación normal.':x.mode==='lgu'?'Copia upgrade.lgu a la raíz de un USB en FAT32, arranca el motor, mete el USB y acepta la actualización.':`Copia la carpeta ${R} encima de \\Storage Card\\System\\Img\\${R} con Total Commander y reinicia.`].join('\r\n'))});
  await saveBlob(await makeZip(ents),`skin-medianav-deshacer-${stamp}.zip`)}
const fdt=t=>new Date(t).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const fsz=n=>n>1e6?(n/1e6).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(n/1e3))+' kB';
async function scrSettings(v){
  setTitle('Ajustes',`<span class="lw">Mediaskin<em>hz</em></span> · ${S.demo?'ejemplo':'backup '+esc(S.root)}`);
  v.innerHTML='<p class="note">Cargando…</p>';
  const [pts,xs]=await Promise.all([listPoints(),getList('exports')]),mine=p=>p.sig===sig(),P=pts.filter(mine),X=xs.filter(mine),D=P.filter(p=>p.kind==='manual'),A=P.filter(p=>p.kind!=='manual');
  let est=null;try{est=navigator.storage&&navigator.storage.estimate?await navigator.storage.estimate():null}catch(_){}
  const about=await aboutHTML();if(S.route.n!=='settings')return;
  const seg=(id,cur,opts)=>`<div class="seg" id="${id}">${opts.map(([k,l])=>`<button data-v="${k}" aria-pressed="${cur===k}">${l}</button>`).join('')}</div>`;
  v.innerHTML=`<div class="two"><div class="stack">
    <div class="card"><h3>Historial de exportaciones</h3>${S.demo?'<p class="note">Con las imágenes de ejemplo no se guarda historial. Carga tu backup.</p>':X.length?`<div class="hl">${X.map(x=>`<div class="hx" data-x="${x.id}">
        <div class="hx-h"><span class="tx"><b>${fdt(x.t)}</b><small>${x.files.length} ${x.files.length===1?'imagen':'imágenes'} · ${x.mode==='lgu'?'actualización':x.mode==='auto'?'automático':'Total Commander'} · ${fsz(x.size)}</small></span></div>
        <div class="hx-a"><button class="btn o sm" data-a="undo">Deshacer en el coche</button>${x.blob?'<button class="btn o sm" data-a="again">Descargar otra vez</button>':''}${x.pid&&P.some(p=>p.id===x.pid)?'<button class="btn o sm" data-a="back">Volver a este diseño</button>':''}</div>
        <details><summary>Ver archivos</summary><div class="hx-f">${x.files.map(f=>`<span>${esc(f)}</span>`).join('')}</div></details></div>`).join('')}</div>
      <p class="note">«Deshacer en el coche» baja un ZIP con solo los originales de esa exportación, listo para copiar igual que la exportación.</p>`:'<p class="note">Aún no has exportado nada. Cada exportación quedará aquí, con un botón para deshacerla en el coche.</p>'}</div>
    <div class="card" id="s-des"><h3>Mis diseños</h3>
      ${S.demo?'<p class="note">Carga tu backup para guardar diseños.</p>':`<button class="btn wide" id="s-pt">Guardar el diseño actual</button><button class="btn o wide" id="s-imp">Importar un diseño</button><p class="note">Vale un archivo <b>.mskz</b> («⋯» de cada diseño → Guardar en un archivo) o el <b>ZIP que exportaste para la radio</b>: lleva su diseño dentro. También puedes arrastrarlo a la ventana.</p>`}
      ${D.length?`<div class="dsg">${D.map(p=>`<div class="dsc${S.curDesign===p.id||(S.base&&S.base.id===p.id)?' on':''}" data-d="${p.id}"><button class="dsi" data-a="load" aria-label="Cargar ${esc(p.label)}">${p.thumb?`<img src="${p.thumb}" alt="">`:'<span class="dsn">Sin vista previa</span>'}${S.curDesign===p.id?'<span class="pill p-col">Cargado</span>':S.base&&S.base.id===p.id?'<span class="pill p-img">Con cambios sin guardar</span>':''}</button>
        <div class="dst"><b>${esc(p.label)}</b><small>${fdt(p.t)} · ${p.n} ${p.n===1?'imagen':'imágenes'}</small></div>
        <div class="dsa"><button class="btn o sm" data-a="load">Cargar</button><button class="ib" data-a="more" aria-label="Más opciones de ${esc(p.label)}" title="Más opciones">${ic('M5 12h.01M12 12h.01M19 12h.01')}</button></div></div>`).join('')}</div>`:'<p class="note">Guarda aquí los diseños que te gusten, con su nombre, para cambiar entre ellos o volver atrás.</p>'}
      ${A.length?`<details class="isd"><summary><span>Copias automáticas<small>Antes de cada cambio grande y en cada exportación</small></span><b>${A.length}</b></summary><div class="isb"><div class="hl">${A.map(p=>`<div class="hx"><div class="hx-h"><span class="tx"><b>${esc(p.label)}</b><small>${fdt(p.t)} · ${p.n} ${p.n===1?'imagen cambiada':'imágenes cambiadas'}</small></span></div>
        <div class="hx-a"><button class="btn o sm" data-p="${p.id}">Volver a este</button><button class="btn dg sm" data-pd="${p.id}">Borrar</button></div></div>`).join('')}</div></div></details><button class="btn o sm" id="s-cla">Borrar las ${A.length} copias automáticas</button>`:''}
      ${est&&est.usage?`<p class="note">Espacio usado en este navegador: <b>${fsz(est.usage)}</b>${est.quota?' de '+fsz(est.quota):''}. Las copias automáticas se borran solas a partir de 10; tus diseños, nunca.</p>`:''}</div>
  </div><div class="stack">
    <div class="card"><h3>Seguridad</h3>
      <label class="swrow" for="s-cf"><span>Pedir confirmación<small>Antes de cargar otro backup, quitar cambios, sustituir imágenes nuevas o cerrar el backup</small></span><input class="sw" type="checkbox" id="s-cf"${SET.confirm?' checked':''}></label>
      <label class="swrow" for="s-au"><span>Copias automáticas<small>Se guarda una copia del diseño antes de cada cambio grande</small></span><input class="sw" type="checkbox" id="s-au"${SET.auto?' checked':''}></label></div>
    <div class="card"><h3>Exportación por defecto</h3>
      <div class="field"><span class="lbl">Cómo instalar</span>${seg('s-xm',SET.xmode,[['tc','Total Commander'],['auto','Automático'],['lgu','Actualización']])}</div>
      <div class="field"><span class="lbl">Equipo (para la actualización)</span>${seg('s-hw',String(SET.xhw),[['2','Evolution'],['1','1.ª generación']])}</div>
      <label class="swrow" for="s-xo"><span>Incluir los originales<small>Para poder deshacer en el coche</small></span><input class="sw" type="checkbox" id="s-xo"${SET.xorig?' checked':''}></label></div>
    <div class="card"><h3>Pantalla</h3>
      <div class="field"><span class="lbl">Tamaño de la vista previa en el móvil</span>${seg('s-pv',SET.pv,[['s','Pequeña'],['m','Normal'],['l','Grande']])}</div>
      <div class="field"><span class="lbl">Tema de la app</span>${seg('s-th',SET.theme,[['auto','Automático'],['light','Claro'],['dark','Oscuro']])}</div>
      <div class="field"><span class="lbl">Color de la app</span><div class="acs" id="s-acs" role="radiogroup" aria-label="Color de la app"></div>
        <div class="acr"><span><b id="s-acn">Esmeralda</b><small>Color personalizado: la app ajusta el contraste sola. <span id="s-icn"></span></small></span><input type="color" id="s-acc" class="cpick" aria-label="Color personalizado"></div></div></div>
    <div class="card"><h3>Datos en este navegador</h3>
      <dl class="facts"><div><dt>Backup</dt><dd>${S.demo?'Ejemplo':esc(S.root)+' · '+S.files.length+' imágenes'}</dd></div><div><dt>Espacio usado</dt><dd>${est&&est.usage?fsz(est.usage):'No disponible'}</dd></div>
      <div><dt>Diseños</dt><dd>${D.length}</dd></div><div><dt>Copias automáticas</dt><dd>${A.length}</dd></div><div><dt>Exportaciones</dt><dd>${X.length}</dd></div></dl>
      ${P.length||X.length?'<button class="btn dg wide" id="s-clr">Borrar historial, diseños y copias</button>':''}
      <p class="note">Nada sale de tu dispositivo. Si borras los datos del sitio en el navegador, se pierden el backup, el historial y los puntos.</p></div>
    ${about}
  </div></div>`;
  bindAbout();accUi();
  settingsTabs(v);
  if(S.focus){const f=$('#'+S.focus);S.focus=null;if(f)setTimeout(()=>{f.scrollIntoView({block:'start'});scrollBy(0,-70)},30)}
  const segOn=(id,f)=>{const el=$(id);el.onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));f(b.dataset.v)}};
  segOn('#s-xm',x=>{SET.xmode=x;S.xmode=x;saveSet()});segOn('#s-hw',x=>{SET.xhw=+x;S.xhw=+x;saveSet()});segOn('#s-pv',x=>{SET.pv=x;saveSet()});
  segOn('#s-th',x=>{SET.theme=x;saveSet();try{if(x==='auto'){localStorage.removeItem('skinhz-theme');delete document.documentElement.dataset.theme}else{localStorage.setItem('skinhz-theme',x);document.documentElement.dataset.theme=x}}catch(_){}});
  $('#s-cf').onchange=e=>{SET.confirm=e.target.checked;saveSet()};$('#s-au').onchange=e=>{SET.auto=e.target.checked;saveSet()};$('#s-xo').onchange=e=>{SET.xorig=e.target.checked;saveSet()};
  const sp=$('#s-pt');if(sp)sp.onclick=async()=>{await saveDesign();render(true)};
  const si=$('#s-imp');if(si)si.onclick=pickDesignFile;
  $$('.dsc',v).forEach(el=>el.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const id=el.dataset.d,a=b.dataset.a,m=(await listPoints()).find(x=>x.id===id);if(!m)return render(true);
    if(a==='load')return restorePoint(id);
    if(a==='more'){const c=await new Promise(res=>{openBS(`<h2>${esc(m.label)}</h2><p class="note">${fdt(m.t)} · ${m.n} ${m.n===1?'imagen cambiada':'imágenes cambiadas'}</p>
      <div class="list"><button class="li" data-c="radio"><span class="ic">${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}</span><span class="tx"><b>Llevar a la radio</b><small>Lo carga y te lleva a Exportar para descargar el ZIP del USB</small></span>${CHEV}</button>
        <button class="li" data-c="file"><span class="ic">${ic('M14 3H6v18h12V7zM14 3v4h4')}</span><span class="tx"><b>Guardar en un archivo</b><small>Archivo .mskz para llevar el diseño a otro móvil u ordenador</small></span>${CHEV}</button>
        <button class="li" data-c="ren"><span class="ic">${ic('M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4')}</span><span class="tx"><b>Cambiar el nombre</b></span>${CHEV}</button>
        <button class="li" data-c="del"><span class="ic" style="color:var(--bad)">${ic('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3')}</span><span class="tx"><b style="color:var(--bad)">Borrar</b></span>${CHEV}</button></div>
      <button class="btn o wide" data-c="0">Cerrar</button>`);S.bsCancel=()=>res(null);$('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;S.bsCancel=null;closeBS();res(x.dataset.c==='0'?null:x.dataset.c)}});
      if(!c)return;
      if(c==='radio'){if(S.curDesign!==id){await restorePoint(id);if(S.curDesign!==id)return}go({n:'export'});return}
      if(c==='file'){const p=await getPoint(id);return p?exportDesign(p):toast('Ese diseño ya no está guardado')}
      if(c==='ren'){const r=await askName({title:'Cambiar el nombre',value:m.label,ok:'Guardar',except:id});if(!r)return;const p=await getPoint(id);if(!p)return;p.label=r.name;
        try{await putPoint(p)}catch(_){noSpace();return}if(S.base&&S.base.id===id)setBase(id,r.name);if(S.curDesign===id)S.curDesignName=r.name;render(true);toast('Nombre cambiado');return}
      if(c==='del'){if(!await confirmBS({title:'Borrar «'+esc(m.label)+'»',text:'El diseño guardado se borrará. Lo que tienes ahora en pantalla no cambia.',ok:'Borrar',danger:true}))return;
        try{await delPoint(id)}catch(_){toast('No se ha podido borrar. Cierra otras pestañas de Mediaskinhz y vuelve a probar.',{ms:6000});return}
        if(S.curDesign===id)S.curDesign=null;if(S.base&&S.base.id===id)setBase(null);render(true);toast('Diseño borrado')}}});
  $$('[data-p]',v).forEach(b=>b.onclick=()=>restorePoint(b.dataset.p));
  $$('[data-pd]',v).forEach(b=>b.onclick=async()=>{if(!await confirmBS({title:'Borrar la copia',text:'Esta copia automática se borrará y no se podrá recuperar.',ok:'Borrar',danger:true}))return;try{await delPoint(b.dataset.pd)}catch(_){toast('No se ha podido borrar');return}render(true)});
  const ca=$('#s-cla');if(ca)ca.onclick=async()=>{if(!await confirmBS({title:'Borrar las copias automáticas',text:`Se borrarán las ${A.length} copias automáticas de este backup. Tus diseños con nombre y lo que tienes en pantalla no cambian.`,ok:'Borrar copias',danger:true}))return;
    for(const p of A)await delPoint(p.id).catch(()=>{});render(true);toast('Copias automáticas borradas')};
  $$('.hx[data-x]',v).forEach(el=>el.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const x=X.find(y=>y.id===el.dataset.x);if(!x)return;
    if(b.dataset.a==='undo')undoZip(x);else if(b.dataset.a==='again')saveBlob(x.blob,x.name);else if(b.dataset.a==='back')restorePoint(x.pid)});
  const cl=$('#s-clr');if(cl)cl.onclick=async()=>{if(!await confirmBS({title:'Borrar historial, diseños y copias',text:'Se borrarán todas las exportaciones guardadas, tus diseños y las copias automáticas de este backup. Tu diseño actual no cambia.',ok:'Borrar todo',danger:true}))return;
    for(const p of P)await delPoint(p.id).catch(()=>{});try{await idb.set('exports',xs.filter(x=>!mine(x)))}catch(_){}render(true);toast('Historial borrado')};
}

/* ---- Color de la app (como Noticiahz) ---- */
const PRE=[['Esmeralda',null,null],['Turquesa',185,.85],['Azul',214,.9],['Índigo',243,.8],['Violeta',272,.7],['Rosa',328,.75],['Coral',6,.85],['Naranja',27,.95],['Ámbar',42,.95],['Grafito',215,.12]];
const hsOf=x=>{const r=parseInt(x.slice(1,3),16)/255,g=parseInt(x.slice(3,5),16)/255,b=parseInt(x.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2;let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=Math.round(h*60);if(h<0)h+=360}const s=d?d/(1-Math.abs(2*l-1)):0;return[h,Math.max(.1,Math.min(.95,s))]};
const hexHs=(h,s)=>{const a=s*Math.min(.4,.6),f=n=>{const k=(n+h/30)%12;return .4-a*Math.max(-1,Math.min(k-3,9-k,1))};return'#'+[f(0),f(8),f(4)].map(v=>('0'+Math.round(v*255).toString(16)).slice(-2)).join('')};
const accGet=()=>window.msPf?msPf():{};
function accSet(h,s){try{if(h==null)localStorage.removeItem('mediaskinhz-acc');else localStorage.setItem('mediaskinhz-acc',JSON.stringify({h,s}))}catch(_){}if(window.msLook)msLook()}
function icnUi(){const e=$('#s-icn');if(!e)return;if(!WEB){e.textContent='';return}const fz=window.msInApp&&(msInApp()||msLocked());
  e.innerHTML=fz?'El icono de la app instalada se quedó con el color que tenías al instalarla; para cambiarlo, reinstálala.'+(msInApp()?'':' <button class="lnk" id="s-icu">¿Ya la desinstalaste? Usar este color al instalar</button>'):'Al instalar la app, el icono tomará este color.';
  const u=$('#s-icu');if(u)u.onclick=()=>{msUnlock();icnUi();toast('Al instalar, el icono tomará este color')}}
function accUi(){const box=$('#s-acs');if(!box)return;icnUi();const {h,s}=accGet();const sel=h==null?0:PRE.findIndex((x,i)=>i&&x[1]===h&&Math.abs(x[2]-s)<.005);
  box.innerHTML=PRE.map(([n,ph,ps],i)=>`<button class="swc" data-i="${i}" style="--c:${ph==null?'#059669':hexHs(ph,ps*.8)}" role="radio" aria-pressed="${i===sel}" aria-checked="${i===sel}" aria-label="${n}" title="${n}"></button>`).join('');
  $('#s-acn').textContent=sel>=0?PRE[sel][0]:'Personalizado';const pk=$('#s-acc');if(document.activeElement!==pk)pk.value=h==null?'#059669':hexHs(h,s*.8);
  box.onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;const[,ph,ps]=PRE[+b.dataset.i];accSet(ph,ps);accUi()};
  let t;pk.oninput=e=>{const[ph,ps]=hsOf(e.target.value);if(window.msApply)msApply(ph,ps);clearTimeout(t);t=setTimeout(()=>{accSet(ph,+ps.toFixed(2));accUi()},250)}}

/* Ajustes en pestañas: cada tarjeta va a su categoría (Diseños · Historial · Preferencias · App) */
const STABS=[['des','Mis diseños'],['hist','Exportaciones'],['pref','Preferencias'],['app','App']];
const SCARD={'Mis diseños':'des','Historial de exportaciones':'hist','Seguridad':'pref','Exportación por defecto':'pref','Pantalla':'pref','Instalar la app':'app','Datos en este navegador':'app'};
function settingsTabs(v){if(S.focus==='s-des')S.stab='des';const cur=S.stab||(S.stab='des');
  const cards=[...v.querySelectorAll('.card')].filter(c=>!c.parentElement.closest('.card')),abt=v.querySelector('.abt'),box=document.createElement('div');box.className='stack stw';
  const bar=document.createElement('div');bar.className='seg gtabs';bar.id='s-tabs';bar.setAttribute('role','tablist');bar.innerHTML=STABS.map(([k,l])=>`<button data-t="${k}" aria-pressed="${cur===k}">${l}</button>`).join('');
  box.appendChild(bar);const ttl=c=>{const h=c.querySelector('h3');return h?h.textContent.trim():''},ord=Object.keys(SCARD);
  for(const [k] of STABS)for(const c of cards.filter(c=>SCARD[ttl(c)]===k).sort((a,b)=>ord.indexOf(ttl(a))-ord.indexOf(ttl(b)))){c.dataset.sp=k;box.appendChild(c)}
  if(abt){abt.dataset.sp='app';box.appendChild(abt)}
  for(const el of box.querySelectorAll('[data-sp]'))el.hidden=el.dataset.sp!==cur;
  v.innerHTML='';v.appendChild(box);
  bar.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.stab=b.dataset.t;bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));box.querySelectorAll('[data-sp]').forEach(el=>el.hidden=el.dataset.sp!==S.stab);scrollTo(0,0)}}

/* ============ diseños en archivo (.mskz) ============
   Para llevar un diseño de un aparato a otro (p. ej. del PC al móvil). Es un ZIP con diseno.json (colores, estilos, iconos, distribución,
   tus iconos usados) y reps/*.bin (las imágenes sustituidas, en índices de color). Cada exportación para la radio lleva el suyo dentro. */
const slugN=s=>String(s||'diseno').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'diseno';
async function designFile(p){const st=p.st,ents=[],reps={};let i=0;
  for(const [path,r] of Object.entries(st.reps||{})){if(!r||!r.idx)continue;const k='r'+(i++)+'.bin';reps[path]={pal:Array.from(r.pal),keyIdx:r.keyIdx,by:r.by,f:k};ents.push({name:'reps/'+k,data:r.idx instanceof Uint8Array?r.idx:new Uint8Array(r.idx)})}
  const used=new Set([...JSON.stringify([st.gen||{},st.icx||{}]).matchAll(/my:([A-Za-z0-9_-]+)/g)].map(m=>m[1]));
  const my=MY.list.filter(m=>used.has(m.id)).map(({mk,...r})=>r);
  const {reps:_r,...rest}=st;const meta={app:'Mediaskinhz',v:1,name:p.label,t:p.t||Date.now(),n:p.n,root:S.root,ver:VER,st:rest,reps,my,thumb:p.thumb||null};
  ents.unshift({name:'diseno.json',data:new TextEncoder().encode(JSON.stringify(meta))});return makeZip(ents)}
async function exportDesign(p){toast('Preparando el archivo…',{ms:20000});try{const b=await designFile(p);await saveBlob(b,slugN(p.label)+'.mskz')}catch(e){toast('No se ha podido crear el archivo del diseño')}}
async function importDesign(blob,fname){
  if(S.demo){toast('Carga primero tu backup (la carpeta M1): el diseño se aplica sobre sus imágenes',{ms:6000});return}
  let meta,files;
  try{const L=await readZip(await blob.arrayBuffer(),()=>true),j=L.find(x=>/(^|\/)diseno\.json$/.test(x.path));if(!j)throw 0;meta=JSON.parse(new TextDecoder().decode(j.buf));files=new Map(L.map(x=>[x.path,x.buf]))}catch(_){toast('Este archivo no es un diseño de Mediaskinhz');return}
  if(meta.app!=='Mediaskinhz'||!meta.st){toast('Este archivo no es un diseño de Mediaskinhz');return}
  const reps={};let miss=0;for(const [path,r] of Object.entries(meta.reps||{})){const b=files.get('reps/'+r.f),F=S.lc.get(path.toLowerCase());if(!b||!F||b.byteLength!==F.w*F.h){miss++;continue}reps[path]={pal:Uint8Array.from(r.pal),idx:new Uint8Array(b),keyIdx:r.keyIdx,by:r.by}}
  const nm=await uniqueName(String(meta.name||'Diseño importado'));
  if(!await confirmBS({title:`Importar «${esc(nm)}»`,text:`${meta.n||0} ${meta.n===1?'imagen cambiada':'imágenes cambiadas'}${meta.t?' · guardado el '+fdt(meta.t):''}.${miss?` ${miss} ${miss===1?'imagen no encaja':'imágenes no encajan'} con este backup y se ${miss===1?'salta':'saltan'}.`:''} Lo que tienes ahora se guarda antes como copia automática, y el diseño se añade a Mis diseños.`,ok:'Importar',always:true}))return;
  let addI=0;for(const m of meta.my||[])if(m&&m.id&&!MY.by.has(m.id)){MY.list.push(m);addI++}if(addI){myIndex();await mySave()}
  await addPoint('Antes de importar «'+nm+'»','auto');before();for(const F of S.files){F.rep=null;F.ico=undefined;F.icz=null}S.src=new Map();S.ops={global:null,sec:{},file:{}};S.ex={};S.frames={};S.gen=null;S.icx={};
  applyState({...meta.st,reps});if(S.gen&&!S.gen.look)migrateLook(meta.st);bump();
  const id=await addPoint(nm,'manual');if(id){S.curDesign=id;S.curDesignName=nm;setBase(id,nm)}S.scr='home';go({n:'home'});toast(`«${nm}» importado`+(addI?` con ${addI} ${addI===1?'icono tuyo':'iconos tuyos'}`:''),{label:'Deshacer',fn:undo})}
function pickDesignFile(){const i=document.createElement('input');i.type='file';i.accept='.mskz,.zip,application/zip';i.onchange=()=>{const f=i.files[0];if(f)importDesign(f,f.name)};i.click()}
