
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
function buildButton(F){const g=S.gen||(S.gen=defGen()),p=g.per[F.path]||{},look=genTargets().includes(F)?btnLook():(p.look||'orig');
  if(look==='orig'){
    const single=frames(F)<2&&!(p.icon&&p.icon!=='orig');btnTintOps(F,single?p.ihue:null);
    const k=p.icon&&p.icon!=='orig'&&p.icon!=='png'?p.icon:((p.ihue!=null||p.rs)&&!single&&extractIcon(F)?'orig':null);
    if(k){F.rep=null;F.icz=null;icApply(F,{k,col:p.ihue==null?'orig':p.ihue,keepOn:true},true);if(F.rep)F.rep.by='btn';if(S.icx)delete S.icx[F.path];delete S.ex[F.path]}
    else{if(F.rep&&(F.rep.by==='btn'||F.rep.by==='gen'))F.rep=null;if(S.icx)delete S.icx[F.path];if(S.ex[F.path]===true)delete S.ex[F.path]}
    btnHueOps(F,p.hue)}
  else{btnHueOps(F,null);const c=genTile(F,{...g,style:look}),d=c.getContext('2d').getImageData(0,0,F.w,F.h).data,key=new Uint8Array(F.w*F.h);
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
const canStyle=F=>{const fr=frames(F);if(fr<2)return false;const r=F.w/fr/F.h;return r>.6&&r<4.6&&F.h>=40};
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
const canStyleOne=F=>frames(F)>=2&&F.h>=24&&F.w/frames(F)>=24;
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
   Se ve antes de aplicarlo: una hoja con la vista previa de cada pantalla. look = estilo · hue = color · ihue = color del icono (null = el del estilo) · bk = tono del negro (null = negro) */
const PRESETS=[
  ['neon-az','Neón azul','neon',210,null,215],['bisel-lima','Biselado lima','chamfer',75,null,null],['futuro-cian','Futurista cian','hud',185,null,195],
  ['carbono-rojo','Carbono rojo','carbon',0,null,null],['aurora','Aurora morada','aurora',275,null,270],['cristal','Cristal azul','glass',205,'white',210],
  ['ocaso','Ocaso naranja','sunset',30,'white',25],['halo-verde','Halo verde','halo',140,null,150],['capsula-rosa','Cápsula rosa','capsule',330,'white',330],
  ['muesca-roja','Muesca roja','notch',355,null,null],['rejilla-ambar','Rejilla ámbar','grid',35,null,30],['relieve','Relieve acero','emboss',205,null,null],
  ['anillo-turq','Anillo turquesa','ring',176,null,180],['esquinas-oro','Esquinas doradas','corner',44,null,null],['retro','Píxel retro','pixel',120,null,null],
  ['arcoiris','Borde degradado','gborder',200,'white',250],['onda-azul','Onda azul','wave',215,'white',220],['circuito','Circuito verde','circuit',150,null,155],
  ['pestana-roja','Pestaña roja','tab',2,null,null],['dos-tonos','Dos tonos índigo','split',236,'white',240],['puntos-magenta','Puntos magenta','dots',298,null,300],
  ['aluminio','Aluminio','metal',210,null,null],['minimo-oro','Mínimo dorado','minimal',45,null,null]].map(([id,name,look,hue,ihue,bk])=>({id,name,look,hue,ihue,bk}));
const presetInside=()=>{const T=genTargets();return S.files.filter(F=>kindOf(F)==='btn'&&canStyle(F)&&!T.includes(F))};
const presetOn=P=>{const g=S.gen||{},o=S.ops.global;return g.look===P.look&&g.color==='one'&&g.hue===P.hue&&!!o&&o.tA===100&&o.tH===P.hue};
function presetTile(P){const T=genTargets(),R=T.find(F=>extractIcon(F))||T[0];if(!R)return null;const g=S.gen||(S.gen=defGen()),me={...(g.per[R.path]||{})};delete me.hue;if(P.ihue!=null)me.ihue=P.ihue;else delete me.ihue;
  return miniTile(R,{...g,look:P.look,style:P.look,color:'one',hue:P.hue,per:{...g.per,[R.path]:me}},0)}
// pone los datos del diseño (sin dibujar aún los botones)
function presetSet(P){const g=S.gen||(S.gen=defGen()),T=genTargets(),L=presetInside();g.look=P.look;g.style=P.look;g.color='one';g.hue=P.hue;
  const setI=p=>{if(P.ihue!=null)p.ihue=P.ihue;else delete p.ihue};
  for(const F of T){const p=g.per[F.path];if(p){delete p.hue;setI(p)}else if(P.ihue!=null)g.per[F.path]={ihue:P.ihue}}
  for(const F of L){const p=g.per[F.path]||(g.per[F.path]={});p.look=P.look;p.hue=P.hue;setI(p)}
  // color de toda la radio: fondos, barra de arriba, listas, barras, iconos sueltos… (solo las partes de color; grises y blancos se quedan)
  S.ops.global={...defOps(),tH:P.hue,tA:100,tG:false};S.ops.sec={};
  for(const n of new Set(SCRBG.values())){const B=byName(n);if(!B)continue;const o={...defOps(),...(S.ops.file[B.path]||{})};o.map={...(o.map||{})};
    if(P.bk==null)delete o.map[13];else o.map[13]={to:P.bk,ts:.6,tl:.1};if(!Object.keys(o.map).length)delete o.map;setFileOps(B,o)}
  return {T,L}}
const PSCR=[['home','Inicio'],['radio','Radio'],['media','Multimedia'],['phone','Teléfono'],['setting','Ajustes'],['eco','Driving eco']];
function presetSheet(P0){
  const keep=[S.curDesign,S.curDesignName],scrs=PSCR.filter(([k])=>byName(SCRBG.get(k)));let P=null,done=new Set(),scr='home',all={T:[],L:[]};
  const forScr=s=>{if(s==='home')return all.T;const fs=new Set(scrFiles(s));return all.L.filter(F=>fs.has(F))};
  openBS(`<h2>Diseños listos</h2><p class="note" id="ps-n"></p>${pvBlock('ps-pv')}
    <div class="chips scroll" id="ps-s" style="margin-top:8px">${scrs.map(([k,l])=>`<button class="chip" data-s="${k}" aria-pressed="${k===scr}">${l}</button>`).join('')}</div>
    <div class="hs" id="ps-l" style="margin-top:6px">${PRESETS.map(Q=>`<button class="ocd" data-v="${Q.id}"><canvas width="1" height="1"></canvas><span>${esc(Q.name)}</span></button>`).join('')}</div>
    <div class="row2" style="display:flex;gap:8px;margin-top:10px"><button class="btn o" style="flex:1" id="ps-x">Cancelar</button><button class="btn" style="flex:2" id="ps-ok">Aplicar este diseño</button></div>`);
  const bs=$('#bs'),c=bs.querySelector('#ps-pv'),lst=bs.querySelector('#ps-l');
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
  first();use(P0);requestAnimationFrame(step);if(VW.st!==2)loadVistas();
  const b0=lst.querySelector(`[data-v="${P0.id}"]`);if(b0)setTimeout(()=>b0.scrollIntoView({inline:'center',block:'nearest'}),50)}
function presetsHTML(id){return `<div class="card"><h3>Diseños listos <small class="cnt">${PRESETS.length}</small></h3><p class="note">Un diseño completo de una vez: botones de todas las pantallas, fondos, barra de arriba y colores. Lo ves antes de aplicarlo.</p>
  <div class="hs" id="${id}">${PRESETS.map(P=>`<button class="ocd" data-v="${P.id}" aria-pressed="${presetOn(P)}"><canvas width="1" height="1"></canvas><span>${esc(P.name)}</span></button>`).join('')}</div></div>`}
function mountPresets(el){if(!el)return;const cvs=[...el.querySelectorAll('canvas')];let i=0;const step=()=>{for(let n=0;n<3&&i<cvs.length;n++,i++){if(!cvs[i].isConnected)return;const t=presetTile(PRESETS[i]);if(t)putMini(cvs[i],t)}if(i<cvs.length)requestAnimationFrame(step)};requestAnimationFrame(step);
  el.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const P=PRESETS.find(p=>p.id===b.dataset.v);if(P)presetSheet(P)}}
