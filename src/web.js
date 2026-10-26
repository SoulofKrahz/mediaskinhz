
/* ============ app web: instalación, versión, novedades y créditos (como Noticiahz y Caravanahz) ============
   - VER sale en Ajustes y la publicación la copia a version.txt; si hay una más nueva publicada, la app avisa.
   - En cada cambio: subir VER aquí y V en site/sw.js (formato AAAA-MM-DD-N y AAAA-MM-DD-N.M para cambios menores).
   - Solo se usa el service worker y la instalación cuando la página tiene manifest (la versión web, no la vista previa). */
const VER='2026-10-26-5';
const APP='Mediaskinhz';
const WEB=!!document.querySelector('link[rel=manifest]')&&/^https?:$/.test(location.protocol);
const SWOK=WEB&&'serviceWorker' in navigator&&window.isSecureContext;
const LOGO=`<span class="logo" role="img" aria-label="${APP}"><svg class="lgi" viewBox="0 0 64 64" aria-hidden="true"><use href="#logo-mark"/></svg><span class="lw" aria-hidden="true">mediaskin<em>hz</em></span><svg class="lp" viewBox="0 0 44 24" aria-hidden="true"><path d="M1 13H13L17 2L23 21L27 8L30 13H43"/></svg></span>`;

// Novedades: la primera es siempre la actual
const CHANGES=[
  [VER,['Biblioteca de iconos coherente (Tabler Icons): unos 3.800 iconos con el mismo estilo, buscador en español y una selección «Para la radio»',
    'Trazo común para todos los iconos (fino, normal, grueso o relleno): cambiarlo actualiza a la vez todos los botones e imágenes',
    'En «Rediseñar los botones», cada botón propone los iconos que encajan con él y «Ver todos» abre el buscador',
    'En cualquier imagen (Sustituir → Poner un icono de la biblioteca): quita el icono que tiene, rehace el fondo y pone el nuevo en su sitio con los colores de cada estado',
    'Nueva familia de color «Negros y fondo»: cambia el negro de los fondos a un tono oscuro de cualquier color conservando el degradado',
    'La página declara su codificación (los acentos ya no dependen del servidor)']],
  ['2026-10-26-4.1',['Corregido: el icono al instalar salía siempre verde; ahora toma el color elegido']],
  ['2026-10-26-4',['Color de la app, como en Noticiahz: 10 colores o cualquiera con el selector, en Ajustes e historial → Pantalla. El contraste se ajusta solo',
    'Al instalar la app, el icono toma el color que tengas en ese momento y ya no cambia (para cambiarlo, reinstálala)']],
  ['2026-10-26-3',['Exportación «Automático»: el ZIP trae un script de MortScript que, en la radio, guarda lo que hay, copia las imágenes, comprueba cada una y deja todo como estaba si algo falla. Ofrece reiniciar al terminar',
    'deshacer.mscr devuelve la radio a como estaba antes de instalar; «Deshacer en el coche» del historial también sale en modo automático']],
  ['2026-10-26-2',['Se llama Mediaskinhz y se puede instalar como app desde Chrome (Ajustes e historial → Instalar)',
    'Confirmación antes de todo lo que no tiene vuelta atrás: cargar otro backup, quitar todos los cambios, cerrar el backup, sustituir imágenes nuevas por el diseño generado, empezar de cero',
    'Puntos de restauración: copias del diseño que se guardan solas antes de cada cambio grande y en cada exportación, y que no se pierden al cerrar la página',
    'Historial de exportaciones: volver a descargar, deshacer en el coche (ZIP con los originales de esa exportación) y volver a ese diseño',
    'Ajustes: modo de exportación por defecto, confirmaciones, tamaño de la vista previa y tema',
    'Deshacer también recupera el diseño del rediseño de botones',
    'Aviso cuando hay una versión nueva, Novedades y Créditos']],
  ['2026-10-26-1',['Rediseño de botones más sencillo: tocas un botón en la vista previa y eliges icono y color en una hoja con su propia vista previa',
    'La vista previa de la pantalla acompaña en Imágenes y en el editor mientras cambias iconos',
    'Posiciones reales de la pantalla de inicio sacadas del sistema de la radio']],
  ['2026-10-26-0',['Instalar como actualización (upgrade.lgu), con avisos de sus riesgos; Total Commander sigue siendo el modo recomendado',
    'Kit de prueba para comprobar en el coche transparencias, estados y posiciones']],
  ['2026-10-25-2',['Exportar solo las imágenes que has tocado, con su estructura de carpetas',
    'El ZIP incluye los originales para poder deshacer en el coche']],
  ['2026-10-25-1',['Vista de app móvil: barra inferior con Pantalla, Tema, Imágenes y Exportar',
    'Colores por familias, más claros de ver y de cambiar, para toda la radio, por sección o por imagen']],
  ['2026-10-25-0',['Primera versión: cargar el backup M1, cambiar colores sin estropear el formato, sustituir imágenes y exportar un ZIP']],
];

const isApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
let IPR=null;
const reSettings=()=>{if(S.route&&S.route.n==='settings')render(true)};
addEventListener('beforeinstallprompt',e=>{if(isApp())return;e.preventDefault();IPR=e;reSettings()});
addEventListener('appinstalled',()=>{IPR=null;keepData();toast(`${APP} instalada: ábrela desde su icono`);reSettings()});
// Pide al navegador que no borre los datos por falta de espacio (el backup solo vive aquí)
async function keepData(){try{if(!navigator.storage||!navigator.storage.persist)return null;if(await navigator.storage.persisted())return true;return await navigator.storage.persist()}catch(_){return null}}
async function doInstall(){if(!IPR){if(isIOS())toast('Pulsa Compartir y luego «Añadir a pantalla de inicio»');return}
  IPR.prompt();let ok=false;try{ok=(await IPR.userChoice).outcome==='accepted'}catch(_){}IPR=null;if(ok)keepData();reSettings()}

function installHTML(){
  if(!WEB)return '<p class="note">Para instalarla, abre Mediaskinhz desde su dirección web en Chrome.</p>';
  if(isApp())return '<p class="note">Ya la estás usando instalada: se abre desde su icono, a pantalla completa y funciona sin conexión.</p>';
  if(IPR)return '<p class="note">Ábrela como una app más: desde su icono, a pantalla completa y sin conexión.</p><button class="btn wide" id="w-ins">Instalar Mediaskinhz</button>';
  if(isIOS())return '<ol class="steps"><li>Pulsa <b>Compartir</b> (el cuadrado con la flecha).</li><li>Elige <b>Añadir a pantalla de inicio</b>.</li><li>Abre Mediaskinhz desde el icono nuevo.</li></ol>';
  return '<p class="note">En Chrome: menú <b>⋮</b> → <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>. Si ya la instalaste, ábrela desde su icono.</p>';
}
async function aboutHTML(){
  let kept=null;try{kept=navigator.storage&&navigator.storage.persisted?await navigator.storage.persisted():null}catch(_){}
  return `<div class="card"><h3>Instalar la app</h3>${installHTML()}
      ${WEB&&kept===false?'<p class="note">Protección contra borrado automático: <b>no concedida</b>. Instalar la app suele conseguirla; mientras, exporta tus cambios.</p>':''}${kept?'<p class="note">Protección contra borrado automático: <b>activada</b>.</p>':''}</div>
    <div class="abt">${LOGO}<span>Diseñado y creado por <strong>Krahz</strong></span><p class="note">Versión ${VER}</p>
      <div class="abt-b"><button class="btn o sm" id="w-chg">Novedades</button><button class="btn o sm" id="w-cr">Créditos y licencia</button></div></div>`;
}
function bindAbout(){const i=$('#w-ins');if(i)i.onclick=doInstall;const c=$('#w-chg');if(c)c.onclick=openChanges;const r=$('#w-cr');if(r)r.onclick=openCredits}
function openChanges(){openBS(`<h2>Novedades</h2><div class="chgl">${CHANGES.map(([v,t],i)=>`<section><h4>${esc(v)}${i===0?' <small>· la que tienes</small>':''}</h4><ul>${t.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div><button class="btn wide" data-x>Cerrar</button>`);$('#bs [data-x]').onclick=closeBS}
function openCredits(){openBS(`<h2>Créditos y licencia</h2><div class="chgl">
  <section><h4>Mediaskinhz</h4><p class="note">Diseñado y creado por <b>Krahz</b>. Herramienta personal para cambiar la apariencia de la radio MediaNav del Renault Clio 4.</p></section>
  <section><h4>Formato de actualización</h4><p class="note">El archivo upgrade.lgu se genera siguiendo <b>dir2lgu</b>, del proyecto <a href="https://github.com/yosicovich/MediaNavMods" target="_blank" rel="noopener">MediaNavMods</a> de yosicovich (licencia GPL-3.0).</p></section>
  <section><h4>Licencia</h4><p class="note">Por usar ese trabajo, Mediaskinhz se publica con licencia <b>GPL-3.0</b>: puedes usarla, estudiarla y modificarla, y quien distribuya una versión modificada debe compartir también su código con la misma licencia.</p></section>
  <section><h4>Tipografías e iconos</h4><p class="note">Inter y Newsreader (SIL Open Font License), servidas por Google Fonts. La biblioteca de iconos es <a href="https://tabler.io/icons" target="_blank" rel="noopener">Tabler Icons</a>, de Paweł Kuna (licencia MIT, ver iconos-LICENCIA.txt).</p></section>
  <section><h4>Aviso</h4><p class="note">No tiene relación con Renault ni con LG. MediaNav es una marca de Renault. Modificar la radio es bajo tu responsabilidad: guarda siempre una copia de la carpeta original.</p></section>
  <section><h4>Privacidad</h4><p class="note">Tu backup, tus diseños y el historial se quedan en este navegador. La app no envía imágenes ni datos a ningún servidor.</p></section>
  </div><button class="btn wide" data-x>Cerrar</button>`);$('#bs [data-x]').onclick=closeBS}

// «2026-10-26-10» es más nueva que «2026-10-26-9» (número a número)
const newer=(a,b)=>{const x=a.split(/[-.]/).map(Number),y=b.split(/[-.]/).map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d>0}return false};
function webInit(){
  // Después de actualizar, un aviso confirma la versión nueva
  let prev=null;try{prev=localStorage.getItem('mediaskinhz-ver');localStorage.setItem('mediaskinhz-ver',VER)}catch(_){}
  if(prev&&prev!==VER)setTimeout(()=>toast(`${APP} actualizada (versión ${VER})`,{label:'Novedades',fn:openChanges,ms:6000}),1200);
  if(!WEB)return;
  if(SWOK)navigator.serviceWorker.register('sw.js').catch(()=>{});
  let last=0,shown='';
  const chk=f=>{if(f!==true&&(document.hidden||Date.now()-last<6e5))return;last=Date.now();
    fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(v=>{v=(v||'').trim();
      if(/^\d{4}-\d\d-\d\d-[\d.]+$/.test(v)&&newer(v,VER)&&shown!==v){shown=v;$('#upd-v').textContent=`Versión ${v} · tienes la ${VER}`;$('#upd').hidden=false}}).catch(()=>{})};
  setTimeout(chk,2500);document.addEventListener('visibilitychange',chk);setInterval(chk,18e5);
  $('#upd-x').onclick=()=>{$('#upd').hidden=true};
  $('#upd-go').onclick=async()=>{
    if(!$('#bs').hidden){toast('Primero cierra la ventana que tienes abierta');return}
    const b=$('#upd-go');b.disabled=true;b.textContent='Actualizando…';
    try{await saveState(true)}catch(_){}
    // Se espera a que la versión nueva esté guardada entera (como mucho 20 s); tu diseño ya está guardado
    const ok=!SWOK||await new Promise(async res=>{const t=setTimeout(()=>res(false),20000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(t);res(true)},{once:true});
      try{const r=await navigator.serviceWorker.getRegistration();if(!r){clearTimeout(t);res(true);return}await r.update();if(!r.installing&&!r.waiting){clearTimeout(t);res(true)}}catch(_){clearTimeout(t);res(true)}});
    if(ok)location.reload();else{b.disabled=false;b.textContent='Actualizar';toast('La conexión va lenta. Se actualizará sola la próxima vez que abras la app')}};
}
