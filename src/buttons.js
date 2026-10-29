
/* ============ botones de Inicio: un solo motor ============
   Cada botón = aspecto (S.gen.look: 'orig' = el de Renault, o un estilo del generador) + lo elegido para él (S.gen.per[ruta]: icono y color).
   Todo se aplica al momento (sin «Aplicar») y se puede deshacer.
   · Aspecto original: el color cambia la familia de color principal de la imagen y el icono se pone conservando el fondo de Renault.
   · Con un estilo: el botón se dibuja entero de nuevo con ese estilo, el icono y el color. */
function btnLook(){const g=S.gen||(S.gen=defGen());if(!g.look)g.look='orig';return g.look}
function mainFam(F){const st=stats(F);let best=-1,n=0;for(const f of st.fam.values())if(f.k<12&&f.n>n){n=f.n;best=f.k}return best}
function btnHueOps(F,hue){const o={...defOps(),...(S.ops.file[F.path]||{})};o.map={...(o.map||{})};
  if(o.bk!=null){delete o.map[o.bk];delete o.bk}
  if(hue!=null){const k=mainFam(F);if(k>=0){o.map[k]=hue==='white'?{white:true}:{to:hue,ts:.72,tl:.5};o.bk=k}}
  if(!Object.keys(o.map).length)delete o.map;setFileOps(F,o)}
// Iconos de una sola imagen: el color del icono tiñe toda la imagen (la transparencia no se toca)
function btnTintOps(F,ihue){const o={...defOps(),...(S.ops.file[F.path]||{})};o.map={...(o.map||{})};
  if(o.bm){for(const k of o.bm)delete o.map[k];delete o.bm}
  if(ihue!=null){const ks=[...stats(F).fam.keys()].filter(k=>k!==13);for(const k of ks)o.map[k]=ihue==='white'?{white:true}:{to:ihue,ts:.82,tl:.56};o.bm=ks}
  if(!Object.keys(o.map).length)delete o.map;setFileOps(F,o)}
function buildButton(F){const g=S.gen||(S.gen=defGen()),p=g.per[F.path]||{},look=genTargets().includes(F)?btnLook():noStyle(F)?'orig':(p.look||'orig');
  if(look==='orig'){
    const single=frames(F)<2&&!(p.icon&&p.icon!=='orig');btnTintOps(F,single?p.ihue:null);
    const k=p.icon&&p.icon!=='orig'&&p.icon!=='png'?p.icon:((p.ihue!=null||p.rs)&&!single&&extractIcon(F)?'orig':null);
    if(k){F.rep=null;F.icz=null;icApply(F,{k,col:p.ihue==null?'orig':p.ihue,keepOn:true},true);if(F.rep)F.rep.by='btn';if(S.icx)delete S.icx[F.path];delete S.ex[F.path]}
    else{if(F.rep&&(F.rep.by==='btn'||F.rep.by==='gen'))F.rep=null;if(S.icx)delete S.icx[F.path];if(S.ex[F.path]===true)delete S.ex[F.path]}
    btnHueOps(F,p.hue)}
  else{btnHueOps(F,null);const c=genTile(F,{...g,style:look}),d=c.getContext('2d').getImageData(0,0,F.w,F.h).data,key=new Uint8Array(F.w*F.h);
    // solo hay transparencia (amarillo) si el original ya la usaba: la radio no la aplica en todas las imágenes (la luna de Inicio salía amarilla)
    if(F.keyCount)for(let i=0;i<F.w*F.h;i++)if(d[i*4+3]<128)key[i]=1;const q=quantize(d,F.w,F.h,{key,dither:true});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'gen'};S.ex[F.path]=true;if(S.icx)delete S.icx[F.path]}
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

/* Hoja de un botón, en una sola pantalla: icono, color del marco, color del icono, estilo y más.
   Sirve para cualquier botón o icono de cualquier pantalla; el estilo solo existe para los botones de Inicio. */
const ICW={ff:'player-track-next',rew:'player-track-prev',play:'player-play',pause:'player-pause',nowplay:'player-play',stop:'player-stop',next:'player-skip-forward',prev:'player-skip-back',
  repeat:'repeat',shuffle:'arrows-shuffle',volume:'volume',sound:'volume',mute:'volume-off',carspeaker:'speakerphone',surround:'surround',phone:'phone',call:'phone-call',dial:'dialpad',phonebook:'address-book',
  missed:'phone-x',outgoing:'phone-outgoing',incoming:'phone-incoming',ring:'bell-ringing',bt:'bluetooth',usb:'usb',aux:'plug',search:'search',list:'list',folder:'folder',back:'arrow-back-up',home:'home',
  setting:'settings',set:'settings',timesetting:'clock-cog',time:'clock',timeset:'clock',clock:'clock',eco:'leaf',trip:'route',report:'report-analytics',coaching:'school',scoring:'trophy',navi:'navigation',
  map:'map-2',nearby:'map-pin',rvc:'camera',camera:'camera',mvc:'camera-rotate',smartphone:'device-mobile',mobile:'device-mobile',siri:'microphone',antenna:'antenna',fmradio:'radio',radio:'radio',ta:'alert-triangle',
  caution:'alert-triangle',help:'help',info:'info-circle',star:'star',up:'chevron-up',down:'chevron-down',left:'chevron-left',right:'chevron-right',arrow:'arrow-right',dark:'moon',temp:'temperature',blower:'car-fan',
  keyboard:'keyboard',space:'space',changekey:'language',direction:'direction',music:'music',media:'music',vehicle:'car',car:'car',presets:'list-numbers',preset:'list-numbers',contents:'layout-list',office:'building'};
function icSuggest2(F){const out=[],add=n=>{if(n&&!out.includes(n)&&(IC.st!==2||IC.by.has(n)))out.push(n)};
  // primero lo que hace el botón (ff, play, call…), luego la pantalla a la que pertenece
  const ws=F.name.toLowerCase().replace(/\.bmp$/,'').split(/[_\s\-.0-9]+/).filter(Boolean),SCR=['fmradio','media','phone','setting','eco','home','navi'];
  for(const w of ws)if(!SCR.includes(w))add(ICW[w]);if(genTargets().includes(F)||!out.length)icSuggest(F).forEach(add);for(const w of ws)add(ICW[w]);
  if(IC.st===2)for(const w of ws){if(out.length>=8)break;if(w.length<3||['btn','icon','img','bg','softkey','common','etc','line','indi','popup','control','res'].includes(w))continue;for(const n of icSearch(w,'').slice(0,2))add(n)}
  const fb=['star','circle','square','heart'];for(const n of fb){if(out.length>=6)break;add(n)}return out.slice(0,9)}
const LOOKS=()=>[['orig','Original de Renault'],...GSTYLES];
const isBtnLike=F=>{const k=kindOf(F);return k==='btn'||k==='ico'};
// Botones con estilo propio fuera de Inicio, y los que pueden llevarlo (se saltan barras muy alargadas)
const styledOut=()=>S.files.filter(F=>((S.gen&&S.gen.per[F.path])||{}).look&&S.gen.per[F.path].look!=='orig');
const canStyle=F=>{const fr=frames(F);if(fr<2||noStyle(F))return false;const r=F.w/fr/F.h;return r>.6&&r<4.6&&F.h>=40};
// Uno a uno se puede dar estilo a cualquier botón con estados (flechas altas, barras de lista…); «usar en todos» se salta esas formas raras
// Tamaño de los iconos de dentro (todas las pantallas menos Inicio). 1 = como el original
const ISIN=[[1,'Como el original'],[1.15,'Algo mayor'],[1.35,'Grande'],[1.6,'Muy grande']];
const isInHTML=id=>{const v=(S.gen&&S.gen.isIn)||1.15;return `<p class="lbl">Tamaño de los iconos <small>· en todas las pantallas de dentro</small></p><div class="chips" id="${id}">${ISIN.map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${Math.abs(v-k)<.01}">${l}</button>`).join('')}</div>`};
const touchedIn=()=>{const g=S.gen||{},T=genTargets();return S.files.filter(F=>{const p=(g.per||{})[F.path];return p&&!T.includes(F)&&(p.icon||p.ihue!=null||p.rs||(p.look&&p.look!=='orig'))})};
// marca para redibujar a la medida elegida los botones de estas imágenes que aún están como el original
function markResize(L){const g=S.gen||(S.gen=defGen());for(const F of L){if(genTargets().includes(F)||frames(F)<2||!extractIcon(F))continue;const p=g.per[F.path]||(g.per[F.path]={});
  if(Math.abs((g.isIn||1.15)-1)<.01){delete p.rs;if(!Object.keys(p).length)delete g.per[F.path]}else if(!p.icon&&p.ihue==null&&(!p.look||p.look==='orig'))p.rs=1}}
async function setIsIn(v,L){before();const g=S.gen||(S.gen=defGen());g.isIn=v;if(L)markResize(L);const A=touchedIn();toast('Aplicando…',{ms:20000});await new Promise(r=>setTimeout(r,30));
  // los que ya no tienen nada que redibujar vuelven al original
  for(const F of S.files)if(F.rep&&F.rep.by==='btn'&&!g.per[F.path]){F.rep=null;if(S.icx)delete S.icx[F.path]}
  applyButtons(A);toast(`Iconos ${(ISIN.find(x=>x[0]===v)||['',''])[1].toLowerCase()} en ${A.length} botones`,{label:'Deshacer',fn:undo});return A.length}
// piezas que nunca llevan estilo de botón: iconos pequeños con estados (los tipos de número de la agenda…) y las barras de fila elegida de las listas
const noStyle=F=>F.w/frames(F)<48||F.h<36||/list_press|list2_btn|parting_line/.test(F.lc);
const canStyleOne=F=>frames(F)>=2&&!noStyle(F);
const secBtns=F=>S.files.filter(G=>G.sec===F.sec&&kindOf(G)==='btn'&&canStyle(G)&&!genTargets().includes(G));
// Al cambiar la forma o el estilo del icono se redibujan todos los botones con estilo
function restyleAll(){applyButtons([...genTargets(),...styledOut()])}
function btnSheet(F,after,el){
  const g=S.gen||(S.gen=defGen()),T=genTargets(),home=T.includes(F),look=home?btnLook():((g.per[F.path]||{}).look||'orig'),list=home&&!el?T:null,idx=list?list.indexOf(F):-1;S.gsel=F.path;const pvH=home&&!el,again=()=>btnSheet(F,after,el);
  const p=()=>g.per[F.path]||(g.per[F.path]={}),ps=g.per[F.path]||{};const cur=ps.icon||'orig',sug=icSuggest2(F).map(n=>'t:'+n);
  const icons=['orig','mine',...(cur.startsWith('t:')||cur.startsWith('lib:')||cur.startsWith('my:'))&&!sug.includes(cur)?[cur]:[],...sug,'all'];
  if(IC.st!==2){icLoad();S.icRedraw=()=>{if($('#bt-ic'))again()}}
  const icT=k=>k==='orig'?'El original':k==='mine'?'Mis iconos':k==='all'?'Ver todos':k.startsWith('lib:')?ICONL[k.slice(4)]||k:keyLabel(k);
  const done=()=>{after&&after();for(const q of S.pvs)if(q.c.isConnected)drawPreview(q.c,q.o())};
  const change=fn=>{before();fn();applyButtons([F]);done();pv()};
  const fsel=ps.hue==null?'none':ps.hue==='white'?'white':ps.hue,isel=ps.ihue==null?'none':ps.ihue==='white'?'white':ps.ihue;
  const html=(`<div class="gsh bts${el?' inl':''}">${pvH?`<div class="screen"><canvas id="bt-pv" width="800" height="480" aria-label="Vista previa de Inicio con ${esc(pretty(F))} marcado"></canvas></div>`:`<div class="btstrip"><canvas id="bt-pv" aria-label="${esc(pretty(F))} con sus estados"></canvas></div>`}
      <div class="e-bar"><div><h2>${esc(pretty(F))}</h2></div><span class="sp"></span>${pvH?`<div class="seg" id="bt-st" role="group" aria-label="Estado"><button data-s="0" aria-pressed="${!S.gstate}">Reposo</button><button data-s="1" aria-pressed="${S.gstate===1}">Pulsado</button></div>`:''}</div></div>
    <p class="lbl">Icono</p><div class="hs" id="bt-ic">${icons.map(k=>`<button class="icb${k==='all'||k==='mine'?' all':''}" data-k="${k}" aria-pressed="${cur===k}" title="${esc(icT(k))}"><canvas width="88" height="88"></canvas><span>${esc(icT(k))}</span></button>`).join('')}</div>
    ${frames(F)>1||!F.keyCount?`<p class="lbl">Color del marco</p><div class="hsw" id="bt-fc">${swatches(fsel,{none:look==='orig'?'El original':'Como el resto',white:look==='orig',label:'Color del marco'})}</div>`:''}
    <p class="lbl">Color del icono</p><div class="hsw" id="bt-icc">${swatches(isel,{none:'Como el original',white:true,label:'Color del icono'})}</div>
    ${home||canStyleOne(F)?`<p class="lbl">Estilo <small>· ${home?'común a los '+T.length+' botones de Inicio':'de este botón'}</small></p><div class="hs" id="bt-lk">${LOOKS().map(([k,l])=>`<button class="ocd" data-v="${k}" aria-pressed="${look===k}"><canvas data-lk="${k}"></canvas><span>${l}</span></button>`).join('')}</div>
    ${home?'':`${canStyle(F)?'':'<p class="note">Este botón tiene una forma poco habitual: el estilo se le aplica solo a él.</p>'}<button class="btn o sm wide" id="bt-all">Usar este estilo y colores en los ${secBtns(F).length} botones de ${esc(SECL.get(F.sec)||F.sec)}</button>`}
    <p class="lbl">Forma <small>· común a todos los botones con estilo</small></p><div class="chips" id="bt-sh">${GSHAPES.map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${g.shape===k}">${l}</button>`).join('')}</div>`:''}
    ${home?'':isInHTML('bt-isz')}
    <div class="bt-more">${home?`<button class="btn o sm" data-mo="gen">Forma y trazo</button>`:''}<button class="btn o sm" data-mo="edit">Editar a fondo</button><button class="btn o sm" data-mo="reset">Volver al original</button></div>
    ${el?'':`<div class="gnav">${list?`<button class="btn o sm" data-mv="-1"${idx<=0?' disabled':''}>‹ Anterior</button>`:'<span></span>'}<button class="btn sm" data-done>Hecho</button>${list?`<button class="btn o sm" data-mv="1"${idx>=list.length-1?' disabled':''}>Siguiente ›</button>`:'<span></span>'}</div>`}`);
  if(el)el.innerHTML=html;else openBS(html);
  const bs=el||$('#bs'),q=s=>bs.querySelector(s),qq=s=>bs.querySelectorAll(s);if(!el)bs.onclick=null;const gcv=q('#bt-pv');
  const pv=pvH?()=>drawPreview(gcv,{scr:'home',state:S.gstate||0,selP:F.path}):()=>{const src=renderCanvas(F,true),k=Math.min(3,Math.max(1,Math.floor(340/F.w*2)/2||1));gcv.width=F.w;gcv.height=F.h;const x=gcv.getContext('2d');x.clearRect(0,0,F.w,F.h);x.drawImage(src,0,0);gcv.style.width=Math.min(F.w*k,window.innerWidth-56)+'px'};pv();
  const st=q('#bt-st');if(st)st.onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.gstate=+b.dataset.s;qq('#bt-st button').forEach(x=>x.setAttribute('aria-pressed',x===b));pv();done()};
  if(pvH){let gd=-1;gcv.onpointerdown=e=>{gd=slotAt(gcv,e).i};gcv.onpointerup=e=>{const h=slotAt(gcv,e),i=gd;gd=-1;if(i<0||h.i!==i)return;const n=slotF(S.layout.slots[i]);if(n&&n!==F&&T.includes(n))btnSheet(n,after)}}
  const col=getComputedStyle(document.body).color;
  qq('#bt-ic canvas').forEach(cv=>{const k=cv.parentNode.dataset.k,x=cv.getContext('2d');x.clearRect(0,0,88,88);
    if(k==='orig'){const mk=extractIcon(F);if(mk)drawMask(x,mk,44,44,Math.min(70/mk.bw,70/mk.bh),col,0);else{const src=renderOrig(F,false),fw=F.w/frames(F),sc=Math.min(80/fw,80/F.h);x.drawImage(src,0,0,fw,F.h,44-fw*sc/2,44-F.h*sc/2,fw*sc,F.h*sc)}}
    else if(k==='mine'){x.strokeStyle=col;x.lineWidth=4;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(44,62);x.lineTo(44,26);x.moveTo(30,40);x.lineTo(44,26);x.lineTo(58,40);x.moveTo(26,66);x.lineTo(62,66);x.stroke()}
    else if(k==='all'){x.fillStyle=col;for(let i=0;i<3;i++)for(let j=0;j<3;j++){x.globalAlpha=i===1&&j===1?1:.45;x.beginPath();x.arc(28+i*16,28+j*16,4.5,0,7);x.fill()}x.globalAlpha=1}
    else drawIconKey(x,k,44,44,52,col,0)});
  const openPicker=cat=>{S.ipk=S.ipk||{q:'',cat:'radio',n:96};if(cat){S.ipk.cat=cat;S.ipk.q=''}iconPicker({title:'Icono para '+pretty(F),cur,back:()=>el?closeBS():again(),onPick:nk=>{before();p().icon=nk;applyButtons([F]);done();if(el)closeBS();again()}})};
  q('#bt-ic').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
    if(k==='all')return openPicker(null);if(k==='mine')return openPicker('my');
    qq('#bt-ic .icb').forEach(x=>x.setAttribute('aria-pressed',x===b));change(()=>{p().icon=k==='orig'?undefined:k})};
  const swBind=(id,key)=>{const sw=q(id+' .swg');sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;sw.querySelectorAll('.swc').forEach(x=>x.setAttribute('aria-pressed',x===b));const h=b.dataset.h;change(()=>{p()[key]=h==='none'?null:h==='white'?'white':+h})};
    sw.querySelector('[data-pick]').onchange=e=>change(()=>{p()[key]=Math.round(hexHsl(e.target.value)[0])})};
  if(q('#bt-fc'))swBind('#bt-fc','hue');swBind('#bt-icc','ihue');
  const lk=q('#bt-lk');if(lk){qq('#bt-lk canvas').forEach(cv=>{const k=cv.dataset.lk;if(k==='orig'){const fr=frames(F),fw=F.w/fr,c=document.createElement('canvas');c.width=fw;c.height=F.h;c.getContext('2d').drawImage(renderOrig(F,false),0,0,fw,F.h,0,0,fw,F.h);putMini(cv,c)}else putMini(cv,miniTile(F,{...g,style:k},0))});
    lk.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;const v=b.dataset.v;
      if(home){if(await setLook(v)){qq('#bt-lk .ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));done();pv()}return}
      if(v!=='orig'&&handRep(F)&&!await confirmBS({title:'Cambiar el estilo',text:'Este botón tiene una imagen que pusiste tú. El estilo la sustituirá. Podrás deshacerlo.',ok:'Cambiar el estilo'}))return again();
      qq('#bt-lk .ocd').forEach(x=>x.setAttribute('aria-pressed',x===b));change(()=>{p().look=v});if(el||$('#bs').hidden||!q('#bt-lk'))again()}}
  const all=q('#bt-all');if(all)all.onclick=async()=>{const me=g.per[F.path]||{},v=me.look||'orig',L=secBtns(F);if(!L.length)return;
    const nm=(LOOKS().find(x=>x[0]===v)||['','Original'])[1];
    if(!await confirmBS({title:`«${nm}» en ${SECL.get(F.sec)||F.sec}`,text:`El estilo, el color del marco y el color del icono de este botón se aplicarán a los ${L.length} botones de esta pantalla (se saltan las barras alargadas). El icono de cada uno se mantiene. Podrás deshacerlo.`,ok:'Aplicar a todos'}))return again();
    before();for(const G of L){const q2=g.per[G.path]||(g.per[G.path]={});q2.look=v;for(const k of ['hue','ihue'])if(me[k]==null)delete q2[k];else q2[k]=me[k]}toast('Aplicando…',{ms:20000});await new Promise(r=>setTimeout(r,30));applyButtons(L);toast(`${L.length} botones con «${nm}»`,{label:'Deshacer',fn:undo});again()};
  const sh=q('#bt-sh');if(sh)sh.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;before();g.shape=b.dataset.v;sh.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));restyleAll();done();pv();qq('#bt-lk canvas').forEach(cv=>{const k=cv.dataset.lk;if(k!=='orig')putMini(cv,miniTile(F,{...g,style:k},0))})};
  const isz=q('#bt-isz');if(isz)isz.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;await setIsIn(+b.dataset.v,[F]);done();again()};
  qq('[data-mo]').forEach(b=>b.onclick=()=>{const m=b.dataset.mo;
    if(m==='gen'){closeBS();go({n:'gen'})}else if(m==='edit'){closeBS();go({n:'edit',p:F.path})}
    else{change(()=>{delete g.per[F.path]});toast(pretty(F)+' vuelve al original',{label:'Deshacer',fn:undo})}});
  bs.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const n=list[idx+ +b.dataset.mv];if(n)btnSheet(n,after)});
  const dn=bs.querySelector('[data-done]');if(dn)dn.onclick=()=>{S.icRedraw=null;closeBS();after&&after()};
}

/* ---- Diseños listos: un diseño completo de una vez ----
   Botones de Inicio y de dentro (estilo, color del marco y del icono) + color de toda la radio (fondos, barra de arriba, listas, barras…) + tono del negro de los fondos.
   Se ve antes de aplicarlo: una hoja con la vista previa de cada pantalla. look = estilo · hue = color · ihue = color del icono (null = el del estilo) · bk = tono de los fondos (null = el mismo color) */
const PRESETS=[
  ['neon-az','Neón azul','neon',210,null,215],['futuro-cian','Futurista cian','hud',185,null,195],['bisel-lima','Biselado lima','chamfer',75,null,null],
  ['carbono-rojo','Carbono rojo','carbon',0,null,null],['aurora','Aurora morada','aurora',275,null,270],['ahumado','Cristal ahumado','smoke',200,null,205],
  ['duo','Neón dúo','duo',190,null,200],['halo-verde','Halo verde','halo',140,null,150],['anillo-turq','Anillo turquesa','ring',176,null,180],
  ['octo-violeta','Octógono violeta','hex',266,null,262],['boton3d','Botón 3D azul','bevel3d',215,null,218],['circuito','Circuito verde','circuit',150,null,155],
  ['onda-azul','Onda azul','wave',215,'white',220],['arcoiris','Borde degradado','gborder',200,'white',250],['ocaso','Ocaso naranja','sunset',30,'white',25],
  ['capsula-rosa','Cápsula rosa','capsule',330,'white',330],['esquinas-oro','Esquinas doradas','corner',44,null,40],['muesca-roja','Muesca roja','notch',355,null,350],
  ['dos-tonos','Dos tonos índigo','split',236,'white',240],['relieve','Relieve acero','emboss',205,null,210],
  ['synth','Synthwave','duo',300,null,300,'synth'],['tron','Tron','hudf',190,null,190,'tron'],['cyber','Cyberpunk','chamfer',52,null,52,'cyber'],
  ['matrix','Matrix','neon',135,null,135,'matrix'],['ambiente','Luz ambiente','halo',30,null,28,'ambient'],['deportivo','Deportivo rojo','side',0,'white',0,'racing'],
  ['oled','Negro puro','outline',210,'white',210,'oled'],
  ['rs','R.S. amarillo','carbon',50,'white',48,'racing'],['alpine','Alpine azul','brushed',222,null,222,'racing'],
  ['cabina','Cabina digital','tab',356,'white',0,'oled'],['ejecutivo','Ejecutivo ámbar','side',30,'white',28,'ambient'],
  ['electrico','Eléctrico minimal','flat',205,'white',205,'oled'],
  ['aluminio','Aluminio','alu',210,null,210,'metal'],['titanio','Titanio azul','brushed',212,null,212,'metal'],['oro','Oro','brushed',42,null,40,'gold'],['bronce','Bronce','brushed',24,null,24,'gold']
].map(([id,name,look,hue,ihue,bk,bg])=>({id,name,look,hue,ihue,bk,bg,gs:look==='alu'?-92:0}));
// también las formas raras (las flechas altas de presintonías, Multimedia y Driving eco); solo se quedan fuera las barras larguísimas de las listas
const presetInside=()=>{const T=genTargets();return S.files.filter(F=>{if(kindOf(F)!=='btn'||T.includes(F)||!canStyleOne(F))return false;const r=F.w/frames(F)/F.h;return r>.18&&r<9&&F.h>=44&&F.w/frames(F)>=36&&!/list_press|list2_btn/.test(F.lc)})};
const presetOn=P=>{const g=S.gen||{},o=S.ops.global;return g.look===P.look&&g.color==='one'&&g.hue===P.hue&&!!o&&o.tA===100&&o.tH===P.hue};
function presetTile(P){const T=genTargets(),R=T.find(F=>extractIcon(F))||T[0];if(!R)return null;const g=S.gen||(S.gen=defGen()),me={...(g.per[R.path]||{})};delete me.hue;if(P.ihue!=null)me.ihue=P.ihue;else delete me.ihue;
  return miniTile(R,{...g,look:P.look,style:P.look,color:'one',hue:P.hue,corners:'key',per:{...g.per,[R.path]:me}},0)}
// pone los datos del diseño (sin dibujar aún los botones)
function presetSet(P){const g=S.gen||(S.gen=defGen()),T=genTargets(),L=presetInside();g.look=P.look;g.style=P.look;g.color='one';g.hue=P.hue;
  const setI=p=>{if(P.ihue!=null)p.ihue=P.ihue;else delete p.ihue};
  for(const F of T){const p=g.per[F.path];if(p){delete p.hue;setI(p)}else if(P.ihue!=null)g.per[F.path]={ihue:P.ihue}}
  for(const F of L){const p=g.per[F.path]||(g.per[F.path]={});p.look=P.look;p.hue=P.hue;setI(p)}
  // color de toda la radio: en lo de color (iconos, textos en imagen…) cambia solo el tono; en fondos, barras, líneas, listas y botones de forma rara
  // se tiñe todo (también grises y el negro) para que el diseño quede de una pieza. Lo que pusiste tú a mano (una foto, el reposo) no se toca
  S.ops.global={...defOps(),tH:P.hue,tA:100,tG:false,s:P.gs||0};S.ops.sec={};const TL=new Set([...T,...L]),bgs=new Set([...SCRBG.values()].map(byName).filter(Boolean)),bk=P.bk==null?P.hue:P.bk;
  for(const F of S.files){if(TL.has(F))continue;if(STARS.test(F.lc)){setFileOps(F,{...defOps(),tH:44,tA:100,tG:false});continue}const k=kindOf(F),odd=k==='btn';if(k==='ico'&&!/line|_dot|scrollnumber|nowplay|pagenumber|pull_(down|up)_icon/.test(F.lc)){// iconos sueltos: solo cambian sus partes de color (los blancos y la barra de estado se quedan)
      if(!F.rep&&!/common_indi_/.test(F.lc)){const st=stats(F);let col=0,tot=0;for(const f of st.fam.values()){tot+=f.n;if(f.k<12)col+=f.n}if(col>tot*.03)setFileOps(F,{...defOps(),tH:P.hue,tA:100,tG:false,s:P.gs||0})}continue}
    if(odd){delete g.per[F.path];if(F.rep&&F.rep.by!=='stby')F.rep=null;if(S.icx)delete S.icx[F.path];if(S.ex[F.path]===true&&!F.rep)delete S.ex[F.path];F.cv=null}
    if(bgs.has(F)&&(!F.rep||F.rep.by==='preset')){presetBg(F,P,bk);continue}
    if(F.rep&&F.rep.by==='preset'){F.rep=null;delete S.ex[F.path];F.cv=null}// lo calcado por un diseño listo anterior se rehace con el color nuevo
    if(F.rep)continue;const o={...defOps(),tH:k==='bg'?bk:P.hue,tA:k==='bg'?90:100,tG:!TOPBAR.test(F.lc),s:P.gs||0};o.map={13:bgs.has(F)?{to:bk,ts:.65,tl:.11}:{to:bk,ts:.55,tl:.07}};setFileOps(F,o)}
  // dibujos con su propio recuadro negro (la hoja de Driving eco, la carátula vacía…): el negro que toca el borde pasa a transparente
  // también el recuadro negro de las listas y del «1/2»: sobre un fondo de color quedaban como cajas negras
  // estilos con cuerpo (Oro, Carbono, Biselado…): la línea separadora de la barra de abajo se quita (deja ver el fondo); en los de solo líneas se queda, del color del diseño
  S.ver++;setSeps(null,sepHidden(P.look));
  S.ver++;for(const F of [...PCLEAR.map(byName),...S.files.filter(F=>/list_line|scrollnumber_bg/.test(F.lc))]){if(F&&(!F.rep||F.rep.by==='preset'))clearBlack(F)}
  return {T,L}}
/* Fondo nuevo para un diseño listo: negro con el color del diseño (degradado, resplandor abajo y un dibujo suave que sigue al estilo).
   Sustituye al fondo de Renault (sus rayas grises teñidas quedaban sucias). Se deshace como todo lo demás */
const BGPAT={grid:'grid',circuit:'grid',pixel:'grid',hud:'grid',hudb:'grid',hudf:'grid',scan:'lines',led:'dots',dots:'dots',wave:'wave',sunset:'wave',aurora:'wave',capsule:'wave',neon:'lines',halo:'rings',ring:'rings',corner:'grid',notch:'lines',chamfer:'diag',slash:'diag',stripes:'diag',tab:'lines',split:'lines'};
function presetBgCanvas(P,bk,scr){const c=document.createElement('canvas');c.width=800;c.height=480;const x=c.getContext('2d'),h=bk;
  if(P.bg==='metal'||P.bg==='gold'){const sat=P.bg==='gold'?38:P.look==='alu'?3:10;let gr=x.createLinearGradient(0,0,0,480);gr.addColorStop(0,`hsl(${h} ${sat}% 9%)`);gr.addColorStop(.5,`hsl(${h} ${sat}% 15%)`);gr.addColorStop(1,`hsl(${h} ${sat}% 10%)`);x.fillStyle=gr;x.fillRect(0,0,800,480);
    let sd=97;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<900;i++){x.fillStyle=`rgba(${rnd()<.5?'255,255,255':'0,0,0'},${.02+rnd()*.05})`;x.fillRect(0,78+rnd()*402,800,1)}
    const v=x.createRadialGradient(400,260,120,400,260,520);v.addColorStop(0,`hsla(${h},${sat}%,70%,.08)`);v.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=v;x.fillRect(0,0,800,480);
    x.fillStyle=`hsla(${h},${sat+20}%,70%,.35)`;x.fillRect(0,477,800,2);return c}
  const vg=(a,b)=>{const g=x.createLinearGradient(0,0,0,480);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,800,480)};
  const rg=(cx,cy,r,col)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,800,480)};
  const floor=(hz,col,lw)=>{x.save();x.strokeStyle=col;x.lineWidth=lw||1;x.beginPath();for(let i=-12;i<=12;i++){x.moveTo(400+i*18,hz);x.lineTo(400+i*150,480)}for(let k=1;k<9;k++){const y=hz+(480-hz)*Math.pow(k/8,2.1);x.moveTo(0,y);x.lineTo(800,y)}x.stroke();x.restore()};
  if(P.bg==='synth'){vg('#0b0420','#2a0838');rg(400,330,300,'rgba(255,60,170,.35)');
    if(scr==='home'){const sg=x.createLinearGradient(0,170,0,330);sg.addColorStop(0,'#ffd45a');sg.addColorStop(1,'#ff2d8a');x.save();x.beginPath();x.arc(400,330,120,Math.PI,0);x.closePath();x.clip();x.fillStyle=sg;x.fillRect(260,200,280,140);
    x.fillStyle='#1a0530';for(let k=0;k<6;k++)x.fillRect(260,262+k*12,280,2+k*1.2);x.restore()}x.fillStyle='#14042a';x.fillRect(0,330,800,150);floor(330,'rgba(0,240,255,.55)',1.2);x.fillStyle='rgba(0,240,255,.8)';x.fillRect(0,329,800,2);return c}
  if(P.bg==='tron'){vg('#010509','#031520');rg(400,300,420,`hsla(${h},100%,50%,.18)`);floor(300,`hsla(${h},100%,60%,.35)`);x.fillStyle=`hsla(${h},100%,65%,.7)`;x.fillRect(0,299,800,1.5);return c}
  if(P.bg==='cyber'){vg('#0a0a06','#151405');rg(650,420,380,'rgba(255,220,0,.16)');rg(120,120,260,'rgba(0,220,255,.08)');
    x.save();x.beginPath();x.rect(0,474,800,6);x.clip();x.fillStyle='#f5d400';x.fillRect(0,474,800,6);x.fillStyle='#0a0a06';for(let i=-40;i<840;i+=22){x.beginPath();x.moveTo(i,480);x.lineTo(i+11,480);x.lineTo(i+17,474);x.lineTo(i+6,474);x.closePath();x.fill()}x.restore();
    x.strokeStyle='rgba(245,212,0,.25)';x.lineWidth=1;x.beginPath();x.moveTo(0,110);x.lineTo(60,110);x.lineTo(80,90);x.lineTo(800,90);x.stroke();return c}
  if(P.bg==='matrix'){vg('#000400','#001206');let sd=31;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<70;i++){const X=Math.floor(rnd()*80)*10,L=60+rnd()*220,Y0=78+rnd()*400;
      const g=x.createLinearGradient(0,Y0,0,Y0+L);g.addColorStop(0,'rgba(0,255,90,0)');g.addColorStop(1,`rgba(0,255,90,${.1+rnd()*.2})`);x.fillStyle=g;for(let y=Y0;y<Y0+L;y+=9)x.fillRect(X,y,5,6)}rg(400,520,420,'rgba(0,255,90,.18)');return c}
  if(P.bg==='ambient'){vg('#060505','#0d0907');x.save();x.lineCap='round';for(const [y,a,w] of [[420,.9,3],[436,.35,8],[404,.25,10]]){x.strokeStyle=`hsla(${h},100%,60%,${a})`;x.lineWidth=w;x.shadowColor=`hsl(${h} 100% 55%)`;x.shadowBlur=18;x.beginPath();x.moveTo(-20,y+40);x.bezierCurveTo(250,y-40,550,y+30,820,y-30);x.stroke()}x.restore();
    rg(400,470,380,`hsla(${h},100%,50%,.14)`);return c}
  if(P.bg==='racing'){vg('#0b0c0e','#121417');x.fillStyle=`hsla(${h},85%,48%,.45)`;x.save();x.transform(1,0,-.35,1,0,0);x.fillRect(880,78,30,402);x.fillRect(922,78,10,402);x.restore();
    let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;x.fillStyle='rgba(255,255,255,.025)';for(let i=0;i<2500;i++)x.fillRect(rnd()*800,78+rnd()*402,2,2);rg(200,480,380,`hsla(${h},85%,48%,.12)`);return c}
  if(P.bg==='oled'){x.fillStyle='#000';x.fillRect(0,0,800,480);x.fillStyle=`hsla(${h},20%,60%,.18)`;x.fillRect(0,477,800,1);return c}
  let gr=x.createLinearGradient(0,0,0,480);gr.addColorStop(0,`hsl(${h} 45% 5%)`);gr.addColorStop(.55,`hsl(${h} 55% 8%)`);gr.addColorStop(1,`hsl(${h} 65% 13%)`);x.fillStyle=gr;x.fillRect(0,0,800,480);
  const glow=(cx,cy,r,a)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`hsla(${h},90%,50%,${a})`);g.addColorStop(1,`hsla(${h},90%,50%,0)`);x.fillStyle=g;x.fillRect(0,0,800,480)};
  glow(400,560,460,.42);glow(400,300,420,scr==='home'?.12:.07);glow(0,80,260,.08);glow(800,80,260,.08);
  const pat=BGPAT[P.look]||'soft';x.save();x.strokeStyle=`hsla(${h},90%,60%,.07)`;x.fillStyle=`hsla(${h},90%,60%,.09)`;x.lineWidth=1;x.beginPath();
  if(pat==='grid'){for(let i=0;i<=800;i+=40){x.moveTo(i+.5,78);x.lineTo(i+.5,480)}for(let j=78;j<=480;j+=40){x.moveTo(0,j+.5);x.lineTo(800,j+.5)}x.stroke()}
  else if(pat==='lines'){for(let j=80;j<480;j+=6){x.moveTo(0,j+.5);x.lineTo(800,j+.5)}x.globalAlpha=.6;x.stroke()}
  else if(pat==='dots'){for(let j=90;j<480;j+=18)for(let i=9;i<800;i+=18){x.moveTo(i+1.3,j);x.arc(i,j,1.3,0,7)}x.fill()}
  else if(pat==='diag'){for(let i=-480;i<800;i+=22){x.moveTo(i,480);x.lineTo(i+480,0)}x.stroke()}
  else if(pat==='rings'){for(let r=60;r<700;r+=46){x.moveTo(400+r,420);x.arc(400,420,r,0,7)}x.stroke()}
  else if(pat==='wave'){x.lineWidth=2;for(let k=0;k<5;k++){x.moveTo(0,380+k*16);for(let i=0;i<=800;i+=10)x.lineTo(i,380+k*16+Math.sin(i/130+k*.8)*14)}x.strokeStyle=`hsla(${h},90%,60%,.12)`;x.stroke()}
  x.restore();
  // brillo fino bajo la barra de arriba y en el borde de abajo
  x.fillStyle=`hsla(${h},90%,60%,.25)`;x.fillRect(0,477,800,3);return c}
function presetBg(F,P,bk){const scr=[...SCRBG.entries()].find(e=>e[1]===F.lc||byName(e[1])===F);const c=presetBgCanvas(P,bk,scr?scr[0]:'');
  const d=c.getContext('2d').getImageData(0,0,800,480).data,q=quantize(d,800,480,{dither:true});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'preset'};S.ex[F.path]=true;delete S.ops.file[F.path];F.cv=null}
// las estrellas de puntuación de Driving eco se quedan doradas, como unas estrellas de verdad
const STARS=/eco_scoring_star|_star_img/;
// Líneas separadoras entre botones (barras de abajo): Automático (se ocultan con los estilos de cuerpo), Ocultar o Mostrar. S.gen.sep
const SEPOPT=[['auto','Automático'],['hide','Ocultar'],['show','Mostrar']];
const sepHidden=look=>{const o=(S.gen&&S.gen.sep)||'auto';return o==='hide'||(o==='auto'&&!THRU.has(look))};
const sepFiles=s=>S.files.filter(F=>/parting_line\.bmp$/.test(F.lc)&&(!s||F.sec===SCRSEC[s]));
function setSeps(s,hide){for(const F of sepFiles(s)){if(F.rep&&F.rep.by!=='preset')continue;F.rep=null;F.cv=null;if(S.ex[F.path]===true)delete S.ex[F.path];if(hide)hideLine(F)}S.ver++}
const sepHTML=id=>`<p class="lbl">Líneas entre los botones de abajo</p><div class="chips" id="${id}">${SEPOPT.map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${((S.gen&&S.gen.sep)||'auto')===k}">${l}</button>`).join('')}</div>`;
function hideLine(F){const p=vwPos(F),B=p&&byName(SCRBG.get(p.s));const c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d');
  const fw=F.w/frames(F);for(let k=0;k<frames(F);k++){if(B)x.drawImage(renderCanvas(B,false),p.x,p.y,fw,F.h,k*fw,0,fw,F.h);else{x.fillStyle='#000';x.fillRect(k*fw,0,fw,F.h)}}
  const d=x.getImageData(0,0,F.w,F.h).data,q=quantize(d,F.w,F.h,{dither:false});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'preset'};S.ex[F.path]=true;delete S.ops.file[F.path];F.cv=null}
const PCLEAR=['eco/eco_scoring_img.bmp','eco/eco_coaching_elf_renault_img.bmp','eco/eco_coaching_elf_dacia_img.bmp','media/media_album_case_noalbum_img.bmp','media/media_device_icon.bmp','media/media_nearby_default_icon.bmp','setting/setting_direction_image.bmp','setting/setting_direction_center_image.bmp'];
function clearBlack(F){F.rep=null;F.cv=null;const od=renderOrig(F,false).getContext('2d').getImageData(0,0,F.w,F.h).data,c=renderCanvas(F,false),w=c.width,h=c.height,x=c.getContext('2d'),im=x.getImageData(0,0,w,h),d=im.data,key=new Uint8Array(w*h),st=[];
  const dark=i=>od[i*4+3]>=128&&Math.max(od[i*4],od[i*4+1],od[i*4+2])<34,push=i=>{if(!key[i]&&dark(i)){key[i]=1;st.push(i)}};
  for(let X=0;X<w;X++){push(X);push((h-1)*w+X)}for(let Y=0;Y<h;Y++){push(Y*w);push(Y*w+w-1)}
  while(st.length){const i=st.pop(),X=i%w,Y=(i/w)|0;if(X>0)push(i-1);if(X<w-1)push(i+1);if(Y>0)push(i-w);if(Y<h-1)push(i+w)}
  if(!F.keyCount){// esta imagen no admite transparencia: se calca el trozo de fondo que queda detrás (si se sabe dónde va); si no, se deja como está
    const p=vwPos(F),B=p&&byName(SCRBG.get(p.s));if(!B){F.cv=null;return}// tiras de varios estados (la hoja de Driving eco lleva 10): cada estado se dibuja en el mismo sitio
    const fw=p.w&&w%p.w===0?p.w:w,bc=document.createElement('canvas');bc.width=fw;bc.height=h;bc.getContext('2d').drawImage(renderCanvas(B,false),p.x,p.y,fw,h,0,0,fw,h);const bd=bc.getContext('2d').getImageData(0,0,fw,h).data;
    for(let i=0;i<w*h;i++)if(key[i]){const j=((i/w|0)*fw+(i%w)%fw)*4;d[i*4]=bd[j];d[i*4+1]=bd[j+1];d[i*4+2]=bd[j+2];d[i*4+3]=255;key[i]=0}}
  else for(let i=0;i<w*h;i++)if(d[i*4+3]<128)key[i]=1;const q=quantize(d,w,h,{key,dither:!F.keyCount});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'preset'};S.ex[F.path]=true;delete S.ops.file[F.path];F.cv=null}
const PSCR=[['home','Inicio'],['radio','Radio'],['media','Multimedia'],['phone','Teléfono'],['setting','Ajustes'],['eco','Driving eco']];
function presetSheet(P0){
  const keep=[S.curDesign,S.curDesignName],scrs=PSCR.filter(([k])=>byName(SCRBG.get(k)));let P=null,done=new Set(),scr='home',all={T:[],L:[]};
  const forScr=s=>{if(s==='home')return all.T;const fs=new Set(scrFiles(s));return all.L.filter(F=>fs.has(F))};
  openBS(`<h2>Diseños listos</h2><p class="note" id="ps-n"></p>${pvBlock('ps-pv')}
    <div class="chips scroll" id="ps-s" style="margin-top:8px">${scrs.map(([k,l])=>`<button class="chip" data-s="${k}" aria-pressed="${k===scr}">${l}</button>`).join('')}</div>
    ${sepHTML('ps-sep')}
    <div class="hs" id="ps-l" style="margin-top:6px">${PRESETS.map(Q=>`<button class="ocd" data-v="${Q.id}"><canvas width="1" height="1"></canvas><span>${esc(Q.name)}</span></button>`).join('')}</div>
    <div class="row2" style="display:flex;gap:8px;margin-top:10px"><button class="btn o" style="flex:1" id="ps-x">Cancelar</button><button class="btn" style="flex:2" id="ps-ok">Aplicar este diseño</button></div>`);
  const bs=$('#bs'),c=bs.querySelector('#ps-pv'),lst=bs.querySelector('#ps-l');
  bs.querySelector('#ps-sep').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;(S.gen||(S.gen=defGen())).sep=b.dataset.v;bs.querySelectorAll('#ps-sep .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));if(P){setSeps(null,sepHidden(P.look));draw()}};
  const draw=()=>{drawPreview(c,{scr,view:scr==='home'?null:vwCur(scr)})};
  const build=s=>{const A=forScr(s).filter(F=>!done.has(F));A.forEach(F=>done.add(F));applyButtons(A)};
  const use=Q=>{if(P)restoreSnap();P=Q;done=new Set();all=presetSet(Q);S.ver++;build(scr);draw();
    bs.querySelector('#ps-n').textContent=`«${Q.name}»: botones, fondos, barra de arriba y colores de toda la radio. Mira cada pantalla antes de aplicarlo.`;
    lst.querySelectorAll('.ocd').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===Q.id))};
  // la primera vez se guarda el estado para Deshacer; al probar otro se vuelve a ese estado sin tocar el historial
  let snap0=null;const restoreSnap=()=>{const s=snap0;Object.assign(S,{ops:structuredClone(s.ops),ex:{...s.ex},frames:{...s.frames},layout:structuredClone(s.layout),gen:genCopy(s.gen),icx:structuredClone(s.icx||{}),stby:s.stby?{...s.stby}:null});for(const F of S.files)F.rep=null;for(const [F,r] of s.reps)F.rep=r;S.ver++};
  const first=()=>{snap0=snap();H.push(snap());if(H.length>80)H.shift();updUndo()};
  const cancel=()=>{if(P){restoreSnap();H.pop();updUndo();S.curDesign=keep[0];S.curDesignName=keep[1];saveState();render(true)}};
  S.bsCancel=cancel;
  bs.querySelector('#ps-s').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;scr=b.dataset.s;bs.querySelectorAll('#ps-s .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));if(P)build(scr);draw();
    if(scr!=='home'&&VW.st!==2)loadVistas().then(draw)};
  lst.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const Q=PRESETS.find(p=>p.id===b.dataset.v);if(Q&&Q!==P){use(Q);b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}};
  bs.querySelector('#ps-x').onclick=()=>closeBS();
  bs.querySelector('#ps-ok').onclick=async()=>{if(!P){closeBS();return}S.bsCancel=null;
    const rest=[...all.T,...all.L].filter(F=>!done.has(F));toast(`Aplicando «${P.name}»…`,{ms:30000});closeBS();await new Promise(r=>setTimeout(r,30));
    S.curDesign=null;S.curDesignName=null;applyButtons(rest);render(true);toast(`«${P.name}» aplicado a toda la radio (${all.T.length+all.L.length} botones)`,{label:'Deshacer',fn:undo})};
  // miniaturas
  const cvs=[...lst.querySelectorAll('canvas')];let i=0;const step=()=>{for(let n=0;n<3&&i<cvs.length;n++,i++){if(!cvs[i].isConnected)return;const t=presetTile(PRESETS[i]);if(t)putMini(cvs[i],t)}if(i<cvs.length)requestAnimationFrame(step)};
  const go0=()=>{if(!bs.isConnected||bs.hidden)return;first();use(P0);requestAnimationFrame(step)};if(VW.st===2)go0();else loadVistas().then(go0,go0);
  const b0=lst.querySelector(`[data-v="${P0.id}"]`);if(b0)setTimeout(()=>b0.scrollIntoView({inline:'center',block:'nearest'}),50)}
function presetsHTML(id){return `<div class="card"><h3>Diseños listos <small class="cnt">${PRESETS.length}</small></h3><p class="note">Un diseño completo de una vez: botones de todas las pantallas, fondos, barra de arriba y colores. Lo ves antes de aplicarlo.</p>
  <div class="hs" id="${id}">${PRESETS.map(P=>`<button class="ocd" data-v="${P.id}" aria-pressed="${presetOn(P)}"><canvas width="1" height="1"></canvas><span>${esc(P.name)}</span></button>`).join('')}</div></div>`}
function mountPresets(el){if(!el)return;const cvs=[...el.querySelectorAll('canvas')];let i=0;const step=()=>{for(let n=0;n<3&&i<cvs.length;n++,i++){if(!cvs[i].isConnected)return;const t=presetTile(PRESETS[i]);if(t)putMini(cvs[i],t)}if(i<cvs.length)requestAnimationFrame(step)};requestAnimationFrame(step);
  el.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const P=PRESETS.find(p=>p.id===b.dataset.v);if(P)presetSheet(P)}}

/* ============ copiar y pegar estilo ============
   Mantén pulsado (o clic derecho en el PC) un botón en la vista de una pantalla o en Inicio: Copiar estilo / Pegar aquí / Pegar en toda la pantalla.
   Tras copiar se entra en «modo pegar»: cada toque en un botón le pone el estilo copiado, hasta pulsar «Hecho».
   Se copia el aspecto (estilo) y los colores del marco y del icono; el icono no, porque cada botón tiene su función. */
function styleOf(F){const g=S.gen||{},p=(g.per||{})[F.path]||{},home=genTargets().includes(F);return {look:home?btnLook():(p.look||'orig'),hue:p.hue,ihue:p.ihue,from:pretty(F)}}
// piezas que no son botones con estilo (barras de las listas, líneas, puntos, iconos sueltos): se les pega el color del marco como tinte
const pasteAsTint=F=>!isBtnLike(F)||frames(F)<2||!canStyleOne(F)||/list_press|list2_btn|parting_line|_dot\.bmp$/.test(F.lc);
function tintOne(F){const h=S.clip&&S.clip.hue;const o={...defOps(),...(S.ops.file[F.path]||{})};o.map={...(o.map||{})};if(h==null||h==='white'){o.tA=0;o.tG=false;delete o.map[12]}else{o.tH=h;o.tA=100;o.tG=false;o.map[12]={to:h,ts:.85,tl:.62}}if(!Object.keys(o.map).length)delete o.map;setFileOps(F,o);return true}  // los grises y blancos (filas y líneas de las listas, la barra blanca de la fila elegida) pasan al color con su brillo; los negros no
function pasteOne(F){const c=S.clip;if(!c)return false;if(pasteAsTint(F))return tintOne(F);const g=S.gen||(S.gen=defGen()),home=genTargets().includes(F),p=g.per[F.path]||(g.per[F.path]={});
  if(!home&&frames(F)>=2&&canStyleOne(F))p.look=c.look;
  if(c.hue==null)delete p.hue;else p.hue=c.hue;if(c.ihue==null)delete p.ihue;else p.ihue=c.ihue;return true}
function pasteStyle(L){const D=L.filter(Boolean);if(!D.length)return;before();let n=0;for(const F of D)if(pasteOne(F))n++;applyButtons(D.filter(F=>!pasteAsTint(F)));S.ver++;schedule();saveState();
  const homeDiff=D.some(F=>genTargets().includes(F))&&S.clip.look!==btnLook();
  toast(`Estilo pegado en ${n} ${n===1?'pieza':'piezas'}${homeDiff?' (en Inicio el estilo es común a los 6: se han pegado los colores)':''}`,{label:'Deshacer',fn:undo})}
// sin modo pegar ni barra: copiar es a propósito, y se pega también a propósito (mantener pulsado → Pegar aquí)
function copyStyle(F){S.clip=styleOf(F);toast(`Estilo de «${S.clip.from}» copiado. Mantén pulsado otro botón para pegarlo`,{ms:3000})}
function pasteBar(on){let b=$('#pastebar');if(!on){S.pasteMode=false;if(b)b.remove();return}S.pasteMode=true;
  if(!b){b=document.createElement('div');b.id='pastebar';b.className='pastebar';document.body.appendChild(b)}
  const nm=(LOOKS().find(x=>x[0]===S.clip.look)||['',''])[1];
  b.innerHTML=`<span class="tx"><b>Pegando el estilo</b><small>De «${esc(S.clip.from)}» · ${esc(nm)}. Toca los botones</small></span><button class="btn sm" id="pb-ok">Hecho</button>`;
  b.querySelector('#pb-ok').onclick=()=>pasteBar(false)}
// menú al mantener pulsado. L = los botones de la pantalla (para «pegar en toda la pantalla»)
function styleMenu(F,L,after){const tint=pasteAsTint(F);if(tint&&!S.clip){go({n:'edit',p:F.path});return}const c=S.clip,nm=c&&(LOOKS().find(x=>x[0]===c.look)||['',''])[1];
  openBS(`<h2>${esc(pretty(F))}</h2><div class="list">
    ${tint?'':`<button class="li" data-c="copy"><span class="ic">${ic('M8 8h12v12H8zM4 16V4h12')}</span><span class="tx"><b>Copiar estilo</b><small>Aspecto y colores de este botón, para pegarlos en otros</small></span>${CHEV}</button>`}
    ${c?`<button class="li" data-c="paste"><span class="ic">${ic('M9 4h6v3H9zM6 6h12v15H6z')}</span><span class="tx"><b>${tint?'Pegar el color aquí':'Pegar aquí'}</b><small>${tint?'El color del marco de':esc(nm)+' de'} «${esc(c.from)}»</small></span>${CHEV}</button>
    ${L&&L.length>1?`<button class="li" data-c="all"><span class="ic">${ic('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z')}</span><span class="tx"><b>Pegar en toda la pantalla</b><small>${L.length} botones</small></span>${CHEV}</button>`:''}`:''}
    <button class="li" data-c="edit"><span class="ic">${ic('M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4')}</span><span class="tx"><b>${tint?'Editar esta pieza':'Editar este botón'}</b></span>${CHEV}</button></div>
    <button class="btn o wide" data-c="0">Cerrar</button>`);
  $('#bs').onclick=e=>{const x=e.target.closest('[data-c]');if(!x)return;const k=x.dataset.c;closeBS();
    if(k==='copy')copyStyle(F);else if(k==='paste'){pasteStyle([F]);after&&after()}else if(k==='all'){pasteStyle(L);after&&after()}else if(k==='edit'){if(isBtnLike(F))btnSheet(F,after);else go({n:'edit',p:F.path})}}}
// mantener pulsado sobre un lienzo: llama a fn(e) a los 550 ms si el dedo no se ha movido. Devuelve true en el pointerup si ya se usó la pulsación larga
function longPress(c,fn){let t=0,x0=0,y0=0,used=false;c.dataset.lp='1';
  c.addEventListener('pointerdown',e=>{used=false;x0=e.clientX;y0=e.clientY;clearTimeout(t);t=setTimeout(()=>{used=true;S.lpT=Date.now();if(navigator.vibrate)try{navigator.vibrate(15)}catch(_){}fn(e)},550)});
  c.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-x0,e.clientY-y0)>10)clearTimeout(t)});
  ['pointerup','pointercancel','pointerleave'].forEach(k=>c.addEventListener(k,()=>clearTimeout(t)));
  c.addEventListener('contextmenu',e=>{e.preventDefault();clearTimeout(t);used=true;fn(e)});
  return ()=>{const u=used;used=false;return u}}

/* ---- Iconos de cobertura y batería de colores (los del usuario): rojo, ámbar y verde según el nivel ----
   Mismo dibujo que los de Renault; lo blanco de cada estado toma su color. Van por defecto en todos los diseños (Ajustes → Preferencias) */
const STICONS={'common/common_indi_antenna_icon.bmp':[null,[237,34,4],[255,208,8],[70,250,37],[70,250,37],[70,250,37],[70,250,37]],
  'common/common_indi_antenna_icon_dark.bmp':[null,[237,34,4],[255,208,8],[70,250,37],[70,250,37],[70,250,37],[70,250,37]],
  'common/common_indi_battery_icon.bmp':[[246,20,10],[252,211,5],[163,253,70],[163,253,70]],
  'common/common_indi_battery_icon_dark.bmp':[[246,20,10],[252,211,5],[163,253,70],[163,253,70]]};
function statusIcons(on){let n=0;for(const [p,cols] of Object.entries(STICONS)){const F=byName(p);if(!F)continue;
    if(!on){if(F.rep&&F.rep.by==='status'){F.rep=null;delete S.ex[F.path];F.cv=null;n++}continue}
    if(F.rep)continue;const c=renderOrig(F,false),w=F.w,h=F.h,d=c.getContext('2d').getImageData(0,0,w,h).data,fw=w/cols.length,key=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2];if(r>240&&g>240&&b<30){key[i]=1;continue}const col=cols[Math.min(cols.length-1,((i%w)/fw)|0)];if(col&&Math.min(r,g,b)>200){d[i*4]=col[0];d[i*4+1]=col[1];d[i*4+2]=col[2]}}
    const q=quantize(d,w,h,{key,dither:false});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'status'};S.ex[F.path]=true;F.cv=null;n++}
  if(n)S.ver++;return n}
