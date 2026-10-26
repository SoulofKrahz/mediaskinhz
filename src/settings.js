
/* ============ ajustes, confirmaciones, puntos de restauración e historial ============ */
const SETDEF={confirm:true,auto:true,xmode:'tc',xhw:2,xorig:true,pv:'m',theme:'auto'};
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
function packState(){const reps={};for(const F of S.files)if(F.rep)reps[F.path]={pal:F.rep.pal,idx:F.rep.idx,keyIdx:F.rep.keyIdx};
  let gen=null;if(S.gen){gen={...S.gen,per:{}};for(const [k,p] of Object.entries(S.gen.per||{}))gen.per[k]={icon:p.icon==='png'?undefined:p.icon,hue:p.hue}}
  return {ops:structuredClone(S.ops),ex:{...S.ex},frames:{...S.frames},layout:structuredClone(S.layout),gen,reps}}
async function addPoint(label,kind){
  if(S.demo)return null;if(kind==='auto'&&!SET.auto)return null;
  const n=S.files.filter(changed).length;if(kind==='auto'&&!n)return null;
  const pts=await getList('points'),p={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now(),label,kind:kind||'manual',sig:sig(),n,st:packState()};
  pts.unshift(p);let a=0;const keep=pts.filter(x=>x.kind!=='auto'||++a<=12).slice(0,40);
  try{await idb.set('points',keep)}catch(_){toast('No queda espacio en el navegador para guardar el punto de restauración',{ms:5000});return null}return p.id}
async function restorePoint(id){
  const p=(await getList('points')).find(x=>x.id===id);if(!p)return;
  if(!await confirmBS({title:'Volver a este diseño',text:`Se cargará «${esc(p.label)}» (${p.n} ${p.n===1?'imagen cambiada':'imágenes cambiadas'}). Antes se guarda lo que tienes ahora como punto de restauración, por si quieres volver.`,ok:'Volver a este diseño',always:true}))return;
  await addPoint('Antes de volver a «'+p.label+'»','auto');before();for(const F of S.files)F.rep=null;S.src=new Map();S.ops={global:null,sec:{},file:{}};S.ex={};S.frames={};
  applyState(p.st);if(!p.st.gen)S.gen=null;bump();render(true);toast('Diseño restaurado',{label:'Deshacer',fn:undo})}
async function recordExport(o){
  if(S.demo)return;const pid=await addPoint('Exportación · '+o.count+' '+(o.count===1?'imagen':'imágenes'),'export');
  const xs=await getList('exports');xs.unshift({id:Date.now().toString(36),t:Date.now(),sig:sig(),mode:o.mode,hw:o.hw,inc:o.inc,files:o.files,name:o.name,size:o.blob.size,pid,blob:o.blob.size<=25e6?o.blob:null});
  xs.forEach((x,i)=>{if(i>=5)x.blob=null});try{await idb.set('exports',xs.slice(0,30))}catch(_){xs.forEach(x=>x.blob=null);try{await idb.set('exports',xs.slice(0,30))}catch(_){}}}
async function undoZip(x){
  const fs=x.files.map(p=>S.lc.get(p.toLowerCase())).filter(Boolean);if(!fs.length){toast('Este backup no tiene esos archivos');return}
  const d=new Date(),stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,R=S.root;let ents;
  if(x.mode==='lgu')ents=[{name:'upgrade.lgu',data:await makeLGU(fs.map(F=>({name:'upgrade/Storage Card/System/Img/'+R+'/'+F.path,data:new Uint8Array(F.buf)})),x.hw!==1,'Mediaskinhz restaurar')}];
  else if(x.mode==='auto')ents=autoEntries(fs.map(F=>({F,u:new Uint8Array(F.buf)})),false).ents;
  else ents=fs.map(F=>({name:R+'/'+F.path,data:new Uint8Array(F.buf)}));
  ents.push({name:'LEEME.txt',data:new TextEncoder().encode([`Deshacer la exportación del ${new Date(x.t).toLocaleString('es-ES')}`,'',`Devuelve a su estado original ${fs.length} ${fs.length===1?'imagen':'imágenes'}:`,...fs.map(F=>'  '+R+'/'+F.path),'',
    x.mode==='auto'?'Descomprime el ZIP en la raíz del USB, abre Total Commander en la radio y toca Mediaskinhz\\instalar.mscr: instala estos originales igual que una exportación normal.':x.mode==='lgu'?'Copia upgrade.lgu a la raíz de un USB en FAT32, arranca el motor, mete el USB y acepta la actualización.':`Copia la carpeta ${R} encima de \\Storage Card\\System\\Img\\${R} con Total Commander y reinicia.`].join('\r\n'))});
  await saveBlob(await makeZip(ents),`skin-medianav-deshacer-${stamp}.zip`)}
const fdt=t=>new Date(t).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const fsz=n=>n>1e6?(n/1e6).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(n/1e3))+' kB';
async function scrSettings(v){
  setTitle('Ajustes e historial',`<span class="lw">Mediaskin<em>hz</em></span> · ${S.demo?'ejemplo':'backup '+esc(S.root)}`);
  v.innerHTML='<p class="note">Cargando…</p>';
  const [pts,xs]=await Promise.all([getList('points'),getList('exports')]),mine=p=>p.sig===sig(),P=pts.filter(mine),X=xs.filter(mine);
  let est=null;try{est=navigator.storage&&navigator.storage.estimate?await navigator.storage.estimate():null}catch(_){}
  const about=await aboutHTML();if(S.route.n!=='settings')return;
  const seg=(id,cur,opts)=>`<div class="seg" id="${id}">${opts.map(([k,l])=>`<button data-v="${k}" aria-pressed="${cur===k}">${l}</button>`).join('')}</div>`;
  v.innerHTML=`<div class="two"><div class="stack">
    <div class="card"><h3>Historial de exportaciones</h3>${S.demo?'<p class="note">Con las imágenes de ejemplo no se guarda historial. Carga tu backup.</p>':X.length?`<div class="hl">${X.map(x=>`<div class="hx" data-x="${x.id}">
        <div class="hx-h"><span class="tx"><b>${fdt(x.t)}</b><small>${x.files.length} ${x.files.length===1?'imagen':'imágenes'} · ${x.mode==='lgu'?'actualización':x.mode==='auto'?'automático':'Total Commander'} · ${fsz(x.size)}</small></span></div>
        <div class="hx-a"><button class="btn o sm" data-a="undo">Deshacer en el coche</button>${x.blob?'<button class="btn o sm" data-a="again">Descargar otra vez</button>':''}${x.pid&&P.some(p=>p.id===x.pid)?'<button class="btn o sm" data-a="back">Volver a este diseño</button>':''}</div>
        <details><summary>Ver archivos</summary><div class="hx-f">${x.files.map(f=>`<span>${esc(f)}</span>`).join('')}</div></details></div>`).join('')}</div>
      <p class="note">«Deshacer en el coche» baja un ZIP con solo los originales de esa exportación, listo para copiar igual que la exportación.</p>`:'<p class="note">Aún no has exportado nada. Cada exportación quedará aquí, con un botón para deshacerla en el coche.</p>'}</div>
    <div class="card"><h3>Puntos de restauración</h3><p class="note">Copias de tu diseño que se guardan solas antes de cada cambio grande y en cada exportación. Se conservan aunque cierres la página.</p>
      ${S.demo?'':`<button class="btn o wide" id="s-pt">Guardar el diseño actual</button>`}
      ${P.length?`<div class="hl">${P.map(p=>`<div class="hx"><div class="hx-h"><span class="tx"><b>${esc(p.label)}</b><small>${fdt(p.t)} · ${p.n} ${p.n===1?'imagen cambiada':'imágenes cambiadas'}${p.kind==='auto'?' · automático':''}</small></span></div>
        <div class="hx-a"><button class="btn o sm" data-p="${p.id}">Volver a este diseño</button><button class="btn dg sm" data-pd="${p.id}">Borrar</button></div></div>`).join('')}</div>`:'<p class="note">Todavía no hay ninguno.</p>'}</div>
  </div><div class="stack">
    <div class="card"><h3>Seguridad</h3>
      <label class="swrow" for="s-cf"><span>Pedir confirmación<small>Antes de cargar otro backup, quitar cambios, sustituir imágenes nuevas o cerrar el backup</small></span><input class="sw" type="checkbox" id="s-cf"${SET.confirm?' checked':''}></label>
      <label class="swrow" for="s-au"><span>Puntos de restauración automáticos<small>Se guarda una copia del diseño antes de cada cambio grande</small></span><input class="sw" type="checkbox" id="s-au"${SET.auto?' checked':''}></label></div>
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
      <div><dt>Puntos</dt><dd>${P.length}</dd></div><div><dt>Exportaciones</dt><dd>${X.length}</dd></div></dl>
      ${P.length||X.length?'<button class="btn dg wide" id="s-clr">Borrar historial y puntos</button>':''}
      <p class="note">Nada sale de tu dispositivo. Si borras los datos del sitio en el navegador, se pierden el backup, el historial y los puntos.</p></div>
    ${about}
  </div></div>`;
  bindAbout();accUi();
  const segOn=(id,f)=>{const el=$(id);el.onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));f(b.dataset.v)}};
  segOn('#s-xm',x=>{SET.xmode=x;S.xmode=x;saveSet()});segOn('#s-hw',x=>{SET.xhw=+x;S.xhw=+x;saveSet()});segOn('#s-pv',x=>{SET.pv=x;saveSet()});
  segOn('#s-th',x=>{SET.theme=x;saveSet();try{if(x==='auto'){localStorage.removeItem('skinhz-theme');delete document.documentElement.dataset.theme}else{localStorage.setItem('skinhz-theme',x);document.documentElement.dataset.theme=x}}catch(_){}});
  $('#s-cf').onchange=e=>{SET.confirm=e.target.checked;saveSet()};$('#s-au').onchange=e=>{SET.auto=e.target.checked;saveSet()};$('#s-xo').onchange=e=>{SET.xorig=e.target.checked;saveSet()};
  const sp=$('#s-pt');if(sp)sp.onclick=async()=>{const n=S.files.filter(changed).length;if(!n){toast('No hay cambios que guardar');return}await addPoint('Guardado a mano','manual');toast('Diseño guardado');render(true)};
  $$('[data-p]',v).forEach(b=>b.onclick=()=>restorePoint(b.dataset.p));
  $$('[data-pd]',v).forEach(b=>b.onclick=async()=>{if(!await confirmBS({title:'Borrar el punto',text:'Este punto de restauración se borrará y no se podrá recuperar.',ok:'Borrar',danger:true}))return;const l=(await getList('points')).filter(x=>x.id!==b.dataset.pd);try{await idb.set('points',l)}catch(_){}render(true)});
  $$('.hx[data-x]',v).forEach(el=>el.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const x=X.find(y=>y.id===el.dataset.x);if(!x)return;
    if(b.dataset.a==='undo')undoZip(x);else if(b.dataset.a==='again')saveBlob(x.blob,x.name);else if(b.dataset.a==='back')restorePoint(x.pid)});
  const cl=$('#s-clr');if(cl)cl.onclick=async()=>{if(!await confirmBS({title:'Borrar historial y puntos',text:'Se borrarán todas las exportaciones guardadas y los puntos de restauración de este backup. Tu diseño actual no cambia.',ok:'Borrar todo',danger:true}))return;
    try{await idb.set('points',pts.filter(p=>!mine(p)));await idb.set('exports',xs.filter(x=>!mine(x)))}catch(_){}render(true);toast('Historial borrado')};
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
