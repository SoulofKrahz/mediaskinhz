/* ============ estado ============ */
const SECS=[['HOME','Inicio'],['COMMON','Fondos y barra'],['FM RADIO','Radio'],['MEDIA','Multimedia'],['PHONE','Teléfono'],['SETTING','Ajustes'],['ECO','Driving eco y clima'],['ETC','Teclados, reloj y volumen'],['POPUP','Ventanas'],['ADAS','Ayudas a la conducción'],['RVC','Cámara trasera'],['4WD','4x4']];
const SECL=new Map(SECS),SECO=new Map(SECS.map((s,i)=>[s[0],i]));
const CATS=[['inicio','Inicio y fondos',['HOME','COMMON'],'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  ['audio','Radio y multimedia',['FM RADIO','MEDIA'],'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
  ['tel','Teléfono',['PHONE'],'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'],
  ['veh','Vehículo',['ECO','ADAS','RVC','4WD'],'M5 17h14M6 17l1.5-6h9L18 17M7 17v2M17 17v2M8.5 11L10 7h4l1.5 4'],
  ['sis','Ajustes y sistema',['SETTING','ETC','POPUP'],'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z']];
const CATOF=new Map(CATS.flatMap(c=>c[2].map(s=>[s,c[0]]))),CATL=new Map(CATS.map(c=>[c[0],c[1]]));
const KINDS=[['all','Todo'],['bg','Fondos'],['btn','Botones'],['part','Barras y piezas'],['ico','Iconos']],KINDL=new Map(KINDS);
const SLOT_NAMES=['home_radio_btn','home_media_btn','home_phone_btn','home_driving eco_btn','home_navi_btn','home_setting_btn'];
const SLOT_POS=[[76,114],[295,114],[514,114],[76,262],[295,262],[514,262]];
const LABELS={home_radio_btn:'Radio',home_media_btn:'Multimedia',home_phone_btn:'Teléfono','home_driving eco_btn':'Driving eco',home_navi_btn:'Navegación',home_setting_btn:'Ajustes',home_map_btn:'Mapa',home_smartphone_btn:'Smartphone','home_phone_second line_btn':'Teléfono','home_smartphone_second line_btn':'Smartphone'};
const SCREENS=[['home','Inicio','common/home_bg.bmp'],['radio','Radio','common/fmradio_bg.bmp'],['media','Multimedia','common/media_bg.bmp'],['phone','Teléfono','common/phone_bg.bmp'],['eco','Driving eco','common/eco_bg.bmp'],['setting','Ajustes','common/setting_bg.bmp']];
const SCRBG=new Map(SCREENS.map(s=>[s[0],s[2]])),SCRL=new Map(SCREENS.map(s=>[s[0],s[1]]));
const SCRSEC={home:'HOME',media:'MEDIA',phone:'PHONE',radio:'FM RADIO',eco:'ECO',setting:'SETTING'};
const SECSCR={'HOME':'home','COMMON':'home','FM RADIO':'radio','MEDIA':'media','PHONE':'phone','SETTING':'setting','ECO':'eco'};
const HUES=[['Rojo',2],['Naranja',24],['Ámbar',44],['Lima',82],['Verde',130],['Esmeralda',156],['Turquesa',182],['Azul',210],['Índigo',236],['Violeta',266],['Magenta',298],['Rosa',330]];
const FAMN=['Rojos','Naranjas','Amarillos','Limas','Verdes','Verdes azulados','Cianes','Azules claros','Azules','Violetas','Magentas','Rosas','Blancos y grises','Negros y fondo'];
const PRETTY={home_navi_btn:'Navegación',home_radio_btn:'Radio',home_media_btn:'Multimedia',home_phone_btn:'Teléfono','home_driving eco_btn':'Driving eco',home_setting_btn:'Ajustes',home_map_btn:'Mapa',home_smartphone_btn:'Smartphone',home_vehicle_renault_btn:'Vehículo (Renault)',home_vehicle_dacia_btn:'Vehículo (Dacia)','home_phone_second line_btn':'Teléfono, 2.ª línea','home_smartphone_second line_btn':'Smartphone, 2.ª línea',home_dark_btn:'Apagar pantalla',home_dark_icon:'Icono de apagar pantalla','home_set time_btn':'Ajustar hora',home_bg:'Fondo de Inicio',media_bg:'Fondo de Multimedia',phone_bg:'Fondo de Teléfono',fmradio_bg:'Fondo de Radio',eco_bg:'Fondo de Driving eco',setting_bg:'Fondo de Ajustes',etc_bg:'Fondo de avisos',common_indi_line:'Barra superior'};
const WORDS={ff:'avance',rew:'retroceso',control:'control',dot:'punto',sound:'sonido',source:'fuente',info:'información',tp:'tráfico',ta:'tráfico',rds:'RDS',fm:'FM',am:'AM',dab:'DAB',usb:'USB',ipod:'iPod',aux:'auxiliar',bt:'Bluetooth',mute:'silencio',contact:'contactos',contacts:'contactos',dial:'marcar',keypad:'teclado',history:'historial',sms:'SMS',arrow:'flecha',left:'izquierda',right:'derecha',check:'casilla',on:'activado',off:'desactivado',select:'seleccionado',focus:'enfocado',tab:'pestaña',title:'título',bottom:'inferior',top:'superior',btn:'botón',icon:'icono',bg:'fondo',img:'imagen',indi:'indicador',softkey:'tecla',back:'atrás',list:'lista',press:'pulsado',scroll:'desplazamiento',scroll2:'desplazamiento 2',up:'arriba',down:'abajo',volume:'volumen',clock:'reloj',number:'número',antenna:'antena',battery:'batería',temp:'temperatura',line:'línea',dark:'oscuro',empty:'vacía',caution:'aviso',key:'tecla',authentication:'código',inputbox:'casilla',font:'cifras',colon:'dos puntos',ring:'timbre',call:'llamada',navi:'navegación',home:'inicio',popup:'ventana',confirm:'confirmar',update:'actualización',gage:'progreso',other:'otro',mobile:'móvil',office:'oficina',parting:'separador',bar:'barra',set:'ajustar',time:'hora',active:'activo',inactive:'inactivo',pull:'tirador',semicolon:'dos puntos',playing:'reproduciendo',play:'reproducir',pause:'pausa',next:'siguiente',prev:'anterior',repeat:'repetir',shuffle:'aleatorio',search:'buscar',menu:'menú',page:'página',pagenumber:'número de página',star:'estrella',scoring:'puntuación',coaching:'consejos',blower:'ventilador',statusbar:'barra de estado',loading:'cargando',connecting:'conectando',ani:'animación',device:'dispositivo',preset:'presintonía',nowplay:'sonando',keyboard:'teclado',missed:'perdidas',num:'número',fulldown:'desplegable',ine:'línea',changekey:'cambio de código',second:'segunda',smartphone:'smartphone',vehicle:'vehículo',map:'mapa',setting:'ajustes',media:'multimedia',phone:'teléfono',radio:'radio',eco:'eco',driving:'conducción'};
const S={files:[],lc:new Map(),root:'M1',demo:true,png:0,errs:[],ops:{global:null,sec:{},file:{}},ex:{},frames:{},ver:1,layout:null,src:new Map(),
  route:{n:'home'},stack:[],scr:'home',cat:'inicio',sec:'all',kind:'all',onlyCh:false,q:'',scope:'global',sel:0,gridOn:true,gridSize:20,snap:true,
  cmp:'now',eState:null,eTab:'color',guide:false,showKey:false,famOpen:null,press:-1,pvs:[],live:null,slow:null};
const DESK='(min-width:900px) and (hover:hover) and (pointer:fine)',isDesk=()=>matchMedia(DESK).matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rgbs=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
const pct=v=>(v<.01?'menos del 1':Math.round(v*100))+' %';
const ic=(d,c='i')=>`<svg class="${c}" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const CHEV=ic('M9 6l6 6-6 6','i ch');
let DL=null;try{if(window.claude&&window.claude.use)window.claude.use('downloads').then(d=>{DL=d}).catch(()=>{})}catch(_){}

/* Imágenes gemelas: en algunas versiones de la radio una pantalla usa la imagen de otra carpeta. La casa de Driving eco puede
   salir de 4WD (las dos son verde lima y miden lo mismo): al exportar la de Eco, la de 4WD se exporta igual. */
const TWINS={'eco/eco_softkey_home_btn.bmp':'4wd/4wd_softkey_home_btn.bmp'};
// La gemela se dibuja con la imagen final de la original, estado a estado, adaptada a su ancho (p. ej. 108 → 109 px por estado)
function twinBytes(F,T){const fr=frames(F),ft=frames(T),fw=F.w/fr,tw=T.w/ft,src=renderCanvas(F,false),c=document.createElement('canvas');c.width=T.w;c.height=T.h;const x=c.getContext('2d');x.imageSmoothingQuality='high';
  for(let s=0;s<ft;s++)x.drawImage(src,Math.min(s,fr-1)*fw,0,fw,F.h,s*tw,0,tw,T.h);
  const d=x.getImageData(0,0,T.w,T.h).data,key=new Uint8Array(T.w*T.h);for(let i=0;i<T.w*T.h;i++)if(d[i*4+3]<128)key[i]=1;
  const q=quantize(d,T.w,T.h,{key,dither:true});return new Uint8Array(encodeBMP8(T.w,T.h,q.idx,q.pal,T))}
function withTwins(L){const out=[...L],has=new Set(L.map(r=>r.F.lc));for(const r of L){const t=TWINS[r.F.lc],T=t&&byName(t);
  if(!T||has.has(T.lc)||T.h!==r.F.h||frames(T)!==frames(r.F))continue;let u=r.u;if(T.w!==r.F.w){try{u=twinBytes(r.F,T)}catch(_){continue}}
  out.push({...r,F:T,u,twin:r.F});has.add(T.lc)}return out}
/* ============ archivos ============ */
// Estados de las imágenes que no siguen la regla de «4 estados si es un botón»: los da el programa de la radio (ancho de la imagen / ancho con que la dibuja).
// p. ej. el botón de llamar tiene 8: llamar (4) y colgar (4). Sale de tools/vistas.py con el análisis de MediaNav-to-Evolution-Upgrade.
const FWFR={"fm radio/fmradio_contents_list_nowplay_icon.bmp": 5, "fm radio/fmradio_pagenumber_icon.bmp": 4, "fm radio/fmradio_parting_line.bmp": 4, "fm radio/fmradio_preset_nowplay_icon.bmp": 5, "media/media_pagenumber_icon.bmp": 4, "media/media_parting_line.bmp": 4, "media/media_parting_line_like.bmp": 4, "media/media_parting_line_w82.bmp": 4, "media/media_progress_bar_bg_1.bmp": 2, "phone/phone_dial_btn_call.bmp": 8, "phone/phone_keyboard_search_results_list_down_btn.bmp": 8, "phone/phone_list_home.bmp": 5, "phone/phone_list_mobile.bmp": 5, "phone/phone_list_office.bmp": 5, "phone/phone_list_other.bmp": 5, "phone/phone_parting_line.bmp": 4, "popup/popup_list_scroll2_down.bmp": 4, "popup/popup_list_scroll2_up.bmp": 4, "popup/popup_list_scroll_down.bmp": 4, "popup/popup_list_scroll_up.bmp": 4, "setting/setting_list_icon_smartphone.bmp": 5, "setting/setting_parting_line.bmp": 4};
function mkFile(rel,sec,buf,b){
  const segs=rel.split('/'),file=segs[segs.length-1],name=file.replace(/\.bmp$/i,'');
  let keyIdx=-1;for(let i=0;i<b.n;i++)if(isKey(b.pal[i*3],b.pal[i*3+1],b.pal[i*3+2])){keyIdx=i;break}
  let keyCount=0;if(keyIdx>=0)for(let i=0;i<b.idx.length;i++){const p=b.idx[i]*3;if(b.pal[p]===255&&b.pal[p+1]===255&&b.pal[p+2]===0)keyCount++}
  const fdef=FWFR[rel.toLowerCase().replace(/^.*?(?=[^/]+\/[^/]+$)/,'')]||(/(btn|press)/.test(name.toLowerCase())&&b.w%4===0&&b.w/4>=8?4:1);
  return Object.assign({path:rel,lc:rel.toLowerCase(),file,name,sec,sub:segs.slice(1,-1).join('/'),buf,keyIdx,keyCount,fdef,rep:null,epv:0,ep:null,cv:null,cvv:0,cvk:null,cvo:null,st:null,stB:null},b);
}
const frames=F=>S.frames[F.path]||F.fdef;
const baseOf=F=>F.rep?F.rep:F;
const catOf=F=>CATOF.get(F.sec)||'sis';
function kindOf(F){const fr=frames(F),fw=F.w/fr;if(fw>=700&&F.h>=400)return 'bg';if(fr>1)return 'btn';if(Math.max(fw,F.h)<=96)return 'ico';return 'part'}
const KINDW={btn:'Botón',icon:'Icono',bg:'Fondo',img:'Imagen',ani:'Animación',line:'Línea',press:'Fondo pulsado'};
// nombres de las piezas del teclado del teléfono y de las listas (los nombres de archivo no dicen nada)
const PRETTYRX=[[/^phone_keyboard(\d?)_(\d+)(?:_(\d+))?_btn$/,m=>`Tecla ${m[2]}${m[3]?'.'+m[3]:''} del teclado ${m[1]||1}`],[/^phone_keyboard_space(\d)_btn$/,m=>`Tecla de espacio ${m[1]}`],
  [/^phone_keyboard_softkey_1_btn$/,()=>'Barra de abajo del teclado'],[/_list_press$/,()=>'Barra de la fila pulsada (listas)'],[/^phone_keyboard_search_results_btn$/,()=>'Barra de resultados de búsqueda'],
  [/^phone_keyboard_search_back_btn$/,()=>'Borrar (búsqueda)'],[/^phone_keyboard_search_results_list_down_btn$/,()=>'Ver resultados (búsqueda)'],[/^phone_keyboard_search_type_bg$/,()=>'Fondo del cuadro de búsqueda']];
function pretty(F){const n=F.name.toLowerCase();if(PRETTY[n])return PRETTY[n];for(const [rx,f] of PRETTYRX){const m=n.match(rx);if(m)return f(m)}
  let w=n.replace(/^(home|media|phone|fmradio|setting|eco|etc|common|popup|adas|rvc|4wd)_/,'').split(/[_\s]+/).filter(Boolean);let head='';
  if(w.length>1&&KINDW[w[w.length-1]]){head=KINDW[w.pop()]}
  const t=w.map(x=>WORDS[x]||x).join(' ').replace(/\s+/g,' ').trim();const out=head?(head+(t?' de '+t:'')):t;
  return out?out.charAt(0).toUpperCase()+out.slice(1):F.name}
const byName=n=>S.lc.get(n);
function stateOf(F){if(F.rep)return {t:'Imagen nueva',c:'p-img'};if(changed(F))return {t:empty(S.ops.file[F.path])?'Con el tema':'Color propio',c:'p-col'};return {t:'Original',c:'p-orig'}}

/* ============ color: familias, temas y paleta efectiva ============ */
const hasMap=o=>!!(o&&o.map&&Object.keys(o.map).length);
const empty=o=>!o||(isId(o)&&!hasMap(o));
function stats(F){const B=baseOf(F);if(F.stB===B)return F.st;
  const n=B.pal.length/3,cnt=new Uint32Array(256);for(let i=0;i<B.idx.length;i++)cnt[B.idx[i]]++;
  const bk=new Int8Array(n),lmax=new Float32Array(14),fam=new Map();let tot=0;
  for(let i=0;i<n;i++){const r=B.pal[i*3],g=B.pal[i*3+1],b=B.pal[i*3+2];if(isKey(r,g,b)){bk[i]=-2;continue}
    const [h,s,l]=rgb2hsl(r,g,b),C=(Math.max(r,g,b)-Math.min(r,g,b))/255,k=l<.07?13:(s<.16||l>.95||C<.09)?12:Math.round(h/30)%12;bk[i]=k;tot+=cnt[i];
    if(k>=0&&cnt[i]){if(l>lmax[k])lmax[k]=l;const f=fam.get(k)||{k,n:0,top:0,ti:i};f.n+=cnt[i];const w=k===13?cnt[i]:k===12?cnt[i]*(.15+l*l):cnt[i]*C*C;if(w>f.top){f.top=w;f.ti=i}fam.set(k,f)}}
  F.st={bk,lmax,fam,tot};F.stB=B;return F.st}
function mapColor(c,m,k,st){const [h,s,l]=rgb2hsl(c[0],c[1],c[2]);
  if(m.white)return hsl2rgb(h,0,k===12?l:cl(l*1.08));
  if(k===12){const lm=st.lmax[12]||1;return hsl2rgb(m.to,m.ts,cl(l*(m.tl/lm)))}
  if(k===13){const lm=Math.max(st.lmax[13],.01),f=l/lm;return hsl2rgb(m.to,m.ts,cl(m.tl+f*Math.min(.07,1-m.tl)+f*m.tl*.35))}
  return hsl2rgb(m.to,cl(s*cl(m.ts/.72,.05,1.4)),l)}
function getEP(F){
  if(F.epv===S.ver)return F.ep;
  const B=baseOf(F),base=B.pal,ex=!!S.ex[F.path],Lv=[ex?null:S.ops.global,ex?null:S.ops.sec[F.sec],S.ops.file[F.path]];
  let out=base;
  if(Lv.some(o=>!empty(o))){const st=stats(F),n=base.length/3;out=new Uint8Array(base.length);
    for(let i=0;i<n;i++){let c=[base[i*3],base[i*3+1],base[i*3+2]];
      if(!isKey(c[0],c[1],c[2])){const k=st.bk[i];let own=-1;
        if(k>=0)for(let v=2;v>=0;v--){const o=Lv[v];if(o&&o.map&&o.map[k]){own=v;break}}
        if(own>=0)c=mapColor(c,Lv[own].map[k],k,st);
        for(let v=own+1;v<3;v++){const o=Lv[v];if(o&&!isId(o))c=applyOps(c,o)}
        if(isKey(c[0],c[1],c[2]))c=[254,255,0]}
      out[i*3]=c[0];out[i*3+1]=c[1];out[i*3+2]=c[2]}}
  F.ep=out;F.epv=S.ver;return out;
}
function changed(F){if(F.rep)return true;const ep=getEP(F);if(ep===F.pal)return false;for(let i=0;i<ep.length;i++)if(ep[i]!==F.pal[i])return true;return false}
function lutOf(pal,showKey){const lut=new Uint32Array(256);for(let i=0;i<pal.length/3&&i<256;i++){const r=pal[i*3],g=pal[i*3+1],b=pal[i*3+2];lut[i]=(!showKey&&isKey(r,g,b))?0:(0xFF000000|(b<<16)|(g<<8)|r)>>>0}return lut}
function paint(c,w,h,idx,lut){if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h),o=new Uint32Array(im.data.buffer);for(let i=0;i<idx.length;i++)o[i]=lut[idx[i]];x.putImageData(im,0,0);return c}
function renderCanvas(F,showKey){if(F.cv&&F.cvv===S.ver&&F.cvk===!!showKey)return F.cv;
  F.cv=paint(F.cv||document.createElement('canvas'),F.w,F.h,baseOf(F).idx,lutOf(getEP(F),showKey));F.cvv=S.ver;F.cvk=!!showKey;return F.cv}
function renderOrig(F,showKey){if(F.cvo&&F.cvoK===!!showKey)return F.cvo;F.cvo=paint(F.cvo||document.createElement('canvas'),F.w,F.h,F.idx,lutOf(F.pal,showKey));F.cvoK=!!showKey;return F.cvo}
function outBytes(F){if(typeof flushRebuild==='function')flushRebuild();
  const ep=getEP(F);
  if(!F.rep){const u=new Uint8Array(F.buf.slice(0));for(let i=0;i<F.n;i++){u[F.palOff+i*4]=ep[i*3+2];u[F.palOff+i*4+1]=ep[i*3+1];u[F.palOff+i*4+2]=ep[i*3]}return u}
  const pal=new Uint8Array(768);pal.set(ep.subarray(0,768));return new Uint8Array(encodeBMP8(F.w,F.h,F.rep.idx,pal,F));
}
function hueName(h){let best=HUES[0],bd=999;for(const x of HUES){const d=Math.min(Math.abs(x[1]-h),360-Math.abs(x[1]-h));if(d<bd){bd=d;best=x}}return best[0]}
function targetName(m){if(m.white)return 'Blanco';return hueName(m.to)}
function describe(o){if(empty(o))return '';const p=[];if(o.tA)p.push(`Tinte ${hueName(o.tH).toLowerCase()} al ${o.tA} %`);const n=hasMap(o)?Object.keys(o.map).length:0;if(n)p.push(`${n} ${n===1?'color cambiado':'colores cambiados'}`);if(o.h||o.s||o.l)p.push('ajustes finos');return p.join(' · ')}
function opsDot(o){if(empty(o))return '';if(o.tA)return `hsl(${o.tH} 72% 46%)`;if(hasMap(o)){const m=Object.values(o.map)[0];return m.white?'#fff':`hsl(${m.to} 72% 46%)`}return 'var(--em2)'}
function famsOfFiles(files){const agg=new Map();let tot=0;
  for(const F of files){const st=stats(F);tot+=st.tot;for(const f of st.fam.values()){const a=agg.get(f.k)||{k:f.k,n:0,top:0,F:null,ti:0};a.n+=f.n;if(f.top>a.top){a.top=f.top;a.F=F;a.ti=f.ti}agg.set(f.k,a)}}
  return [...agg.values()].filter(a=>tot&&a.n/tot>=.01).sort((a,b)=>b.n-a.n).slice(0,8).map(a=>{const B=baseOf(a.F),ep=getEP(a.F);return {k:a.k,share:a.n/tot,orig:[B.pal[a.ti*3],B.pal[a.ti*3+1],B.pal[a.ti*3+2]],now:[ep[a.ti*3],ep[a.ti*3+1],ep[a.ti*3+2]]}})}
const scopeFiles=sc=>sc==='global'?S.files.filter(F=>F.sec!=='4WD'):S.files.filter(F=>F.sec===sc);
const scopeOps=sc=>sc==='global'?S.ops.global:S.ops.sec[sc];
function setScopeOps(sc,v){if(sc==='global')S.ops.global=empty(v)&&!(v&&v.tG)?null:v;else{if(empty(v))delete S.ops.sec[sc];else S.ops.sec[sc]=v}}
function setFileOps(F,v){if(empty(v))delete S.ops.file[F.path];else S.ops.file[F.path]=v}

/* ============ deshacer ============ */
const H=[];
const genCopy=g=>g?{...g,per:Object.fromEntries(Object.entries(g.per||{}).map(([k,p])=>[k,{...p}]))}:null;
function snap(){return {ops:structuredClone(S.ops),ex:{...S.ex},frames:{...S.frames},layout:structuredClone(S.layout),gen:genCopy(S.gen),icx:structuredClone(S.icx||{}),stby:S.stby?{...S.stby}:null,reps:S.files.filter(F=>F.rep).map(F=>[F,F.rep])}}
function before(){S.curDesign=null;S.curDesignName=null;H.push(snap());if(H.length>80)H.shift();updUndo()}
function undo(){const s=H.pop();if(!s)return;Object.assign(S,{ops:s.ops,ex:s.ex,frames:s.frames,layout:s.layout,gen:s.gen,icx:s.icx||{},stby:s.stby||null});for(const F of S.files)F.rep=null;for(const [F,r] of s.reps)F.rep=r;
  S.ver++;render(true);toast('Cambio deshecho');saveState()}
function updUndo(){$('#ab-undo').disabled=!H.length}
function bump(){S.ver++;schedule()}
let rafT=0,slowT=0;
function schedule(){if(!rafT)rafT=requestAnimationFrame(()=>{rafT=0;for(const p of S.pvs)if(p.c.isConnected)drawPreview(p.c,p.o());pump();S.live&&S.live()});
  clearTimeout(slowT);slowT=setTimeout(()=>{updBadge();S.slow&&S.slow();saveState()},320)}

/* ============ carga y guardado ============ */
async function ingest(list,opts){
  opts=opts||{};const KNOWN=new Set(SECS.map(s=>s[0])),files=[],errs=[];let root=null,png=opts.png||0;
  for(const e of list){const segs=e.path.replace(/\\/g,'/').split('/').filter(Boolean);if(!segs.length)continue;
    const fn=segs[segs.length-1],ext=fn.split('.').pop().toLowerCase();if(ext==='png'){png++;continue}if(ext!=='bmp')continue;
    const i=segs.findIndex(s=>KNOWN.has(s.toUpperCase()));if(i<0||i===segs.length-1)continue;
    if(root===null)root=segs[i-1]||'M1';const rel=segs.slice(i).join('/');
    try{files.push(mkFile(rel,segs[i].toUpperCase(),e.buf,parseBMP(e.buf)))}catch(err){errs.push(rel+': '+err.message)}}
  if(!files.length){toast('No encuentro imágenes del MediaNav. Elige la carpeta M1 (la que contiene HOME, COMMON, MEDIA…) o un ZIP de ella.',{ms:7000});return false}
  files.sort((a,b)=>(SECO.get(a.sec)-SECO.get(b.sec))||a.lc.localeCompare(b.lc));
  Object.assign(S,{files,lc:new Map(files.map(f=>[f.lc,f])),root,demo:!!opts.demo,png,errs,bkName:opts.name||null,bkT:opts.t||Date.now(),ops:{global:null,sec:{},file:{}},ex:{},frames:{},layout:null,src:new Map(),scope:'global',sel:0,famOpen:null,gen:null,genCv:null});
  H.length=0;S.ver++;defaultLayout();
  if(!opts.demo&&!opts.restore){try{await idb.set('files',{list:list.filter(e=>/\.bmp$/i.test(e.path)),png,name:opts.name||null,t:Date.now()});await idb.del('state')}catch(_){}}
  return true;
}
async function fromFileList(fl){
  const arr=[...fl];if(!arr.length)return;
  if(arr.length===1&&/\.rar$/i.test(arr[0].name)){toast('El navegador no puede abrir .rar. Descomprímelo y elige la carpeta, o comprímelo como .zip.',{ms:7000});return}
  // un diseño (.mskz) o un ZIP exportado para la radio (lleva su diseño dentro): se importa el diseño, no se cambia de backup
  if(arr.length===1&&/\.mskz$/i.test(arr[0].name))return importDesign(arr[0],arr[0].name);
  if(arr.length===1&&/\.zip$/i.test(arr[0].name)){let m=[];try{m=await readZip(await arr[0].arrayBuffer(),n=>/(^|\/)diseno\.mskz$/i.test(n))}catch(_){}
    if(m.length)return importDesign(new Blob([m[0].buf]),arr[0].name)}
  if(!S.demo){const n=S.files.filter(changed).length;if(n){if(!await confirmBS({title:'Cargar otro backup',text:`Sustituirá el backup actual y su diseño (${n} ${n===1?'imagen cambiada':'imágenes cambiadas'}). Se guardará antes un copia automática, que volverá a aparecer si cargas este mismo backup.`,ok:'Cargar el nuevo',danger:true}))return;await addPoint('Antes de cargar otro backup','auto')}}
  const z=arr.find(f=>/\.zip$/i.test(f.name));closeBS();toast('Leyendo tu backup…',{ms:90000});
  try{let list,png=0;
    if(z&&arr.length===1){list=await readZip(await z.arrayBuffer(),n=>{if(/\.png$/i.test(n)){png++;return false}return /\.bmp$/i.test(n)})}
    else{list=[];for(const f of arr){const p=f._path||f.webkitRelativePath||f.name;if(/\.png$/i.test(p)){png++;continue}if(!/\.bmp$/i.test(p))continue;list.push({path:p,buf:await f.arrayBuffer()})}}
    const bkn=z&&arr.length===1?z.name:((arr[0]&&(arr[0]._path||arr[0].webkitRelativePath)||'').split('/').filter(Boolean)[0]||null);
    if(await ingest(list,{png,name:bkn})){if(SET.stIcons!==false)statusIcons(true);setBase(null);S.stack=[];S.route={n:'home'};render();toast(`Backup cargado: ${S.files.length} imágenes`)}
  }catch(err){toast(err.message||'No se pudo leer el backup',{ms:6000})}
}
async function walkEntry(en,out){
  if(en.isFile){await new Promise(r=>en.file(f=>{f._path=en.fullPath.replace(/^\//,'');out.push(f);r()},()=>r()))}
  else if(en.isDirectory){const rd=en.createReader();let batch;do{batch=await new Promise(r=>rd.readEntries(r,()=>r([])));for(const e of batch)await walkEntry(e,out)}while(batch.length)}
}
async function demo(){
  const mk=(w,h,draw,useKey)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const d=x.getImageData(0,0,w,h).data,key=new Uint8Array(w*h);
    if(useKey)for(let i=0;i<w*h;i++)if(d[i*4]>250&&d[i*4+1]>250&&d[i*4+2]<6)key[i]=1;const q=quantize(d,w,h,{key,dither:true});return encodeBMP8(w,h,q.idx,q.pal,{})};
  const bg=hue=>(x,w,h)=>{x.fillStyle='#000';x.fillRect(0,0,w,h);const g=x.createRadialGradient(w/2,h*1.05,10,w/2,h*1.05,w*.55);
    g.addColorStop(0,hue==null?'hsl(220 6% 30%)':`hsl(${hue} 85% 48%)`);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,h)};
  const glyph=(x,k,cx,cy,col)=>{x.fillStyle=col;x.strokeStyle=col;x.lineWidth=6;x.lineCap='round';x.beginPath();
    if(k==='navi'){x.moveTo(cx,cy-26);x.lineTo(cx+20,cy+22);x.lineTo(cx,cy+12);x.lineTo(cx-20,cy+22);x.closePath();x.fill()}
    else if(k==='radio'){[-24,-12,0,12,24].forEach((o,i)=>{const hh=[14,26,40,26,14][i];x.fillRect(cx+o-3,cy-hh/2,6,hh)})}
    else if(k==='media'){x.arc(cx,cy,24,0,7);x.stroke();x.beginPath();x.moveTo(cx-8,cy-12);x.lineTo(cx+13,cy);x.lineTo(cx-8,cy+12);x.closePath();x.fill()}
    else if(k==='phone'){x.lineWidth=10;x.arc(cx+14,cy-10,30,Math.PI*.55,Math.PI*1.05);x.stroke()}
    else if(k==='eco'){x.ellipse(cx,cy,26,15,-.6,0,7);x.fill()}
    else{for(let a=0;a<8;a++){x.save();x.translate(cx,cy);x.rotate(a*Math.PI/4);x.fillRect(-5,-28,10,12);x.restore()}x.beginPath();x.arc(cx,cy,19,0,7);x.fill();x.fillStyle='#000';x.beginPath();x.arc(cx,cy,8,0,7);x.fill()}};
  const tile=(hue,k)=>(x)=>{for(let f=0;f<4;f++){const ox=f*210,on=f%2===1,dim=f===2;
    if(on){const g=x.createLinearGradient(0,0,0,137);g.addColorStop(0,`hsl(${hue} 90% 62%)`);g.addColorStop(1,`hsl(${hue} 85% 50%)`);x.fillStyle=g;x.fillRect(ox,0,210,137);glyph(x,k,ox+105,58,`hsl(${hue} 70% 24%)`)}
    else{const g=x.createLinearGradient(0,0,0,137);g.addColorStop(0,'#15181d');g.addColorStop(.7,'#050608');g.addColorStop(1,`hsl(${hue} 85% ${dim?22:42}%)`);x.fillStyle=g;x.fillRect(ox,0,210,137);glyph(x,k,ox+105,58,`hsl(${hue} 85% ${dim?32:58}%)`)}
    x.strokeStyle=`hsl(${hue} 50% ${on?40:25}%)`;x.lineWidth=2;x.strokeRect(ox+1,1,208,135)}};
  const list=[
    ['M1/COMMON/HOME_BG.BMP',mk(800,480,bg(null))],['M1/COMMON/MEDIA_BG.BMP',mk(800,480,bg(300))],['M1/COMMON/PHONE_BG.BMP',mk(800,480,bg(205))],
    ['M1/HOME/common_indi_line.bmp',mk(800,78,(x,w)=>{x.fillStyle='#ff0';x.fillRect(0,0,w,78);x.fillStyle='#000';x.fillRect(0,0,w,54);x.fillStyle='#3a4252';x.fillRect(0,52,w,2)},true)],
    ['M1/HOME/home_navi_btn.bmp',mk(840,137,tile(4,'navi'))],['M1/HOME/home_radio_btn.bmp',mk(840,137,tile(182,'radio'))],['M1/HOME/home_media_btn.bmp',mk(840,137,tile(300,'media'))],
    ['M1/HOME/home_phone_btn.bmp',mk(840,137,tile(205,'phone'))],['M1/HOME/home_driving eco_btn.bmp',mk(840,137,tile(74,'eco'))],['M1/HOME/home_setting_btn.bmp',mk(840,137,tile(42,'set'))]
  ].map(([path,buf])=>({path,buf}));
  await ingest(list,{demo:true});
}
const idb={db:null,open(){if(this.db)return Promise.resolve(this.db);return new Promise((res,rej)=>{const r=indexedDB.open('skinhz',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{this.db=r.result;res(r.result)};r.onerror=()=>rej(r.error)})},
  async tx(mode,fn){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction('kv',mode),st=t.objectStore('kv'),q=fn(st);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('Escritura cancelada'))})},
  get(k){return this.tx('readonly',s=>s.get(k))},set(k,v){return this.tx('readwrite',s=>s.put(v,k))},del(k){return this.tx('readwrite',s=>s.delete(k))}};
let saveT=0;
// diseños guardados antes de recordar quién hizo cada imagen: si el botón tiene estilo, icono o color propios, la hizo el motor de botones
function repByGuess(st,F){const p=((st.gen||{}).per||{})[F.path];if(!p)return undefined;if(p.look&&p.look!=='orig')return 'gen';if(p.icon||p.ihue!=null||p.rs)return 'btn';return undefined}
function saveState(now){if(S.demo)return Promise.resolve();clearTimeout(saveT);const run=()=>{const reps={};for(const F of S.files)if(F.rep)reps[F.path]={pal:F.rep.pal,idx:F.rep.idx,keyIdx:F.rep.keyIdx,by:F.rep.by};
  const gen=packGen();
  return idb.set('state',{v:2,ops:S.ops,ex:S.ex,frames:S.frames,layout:S.layout,reps,gen,icx:S.icx||{},stby:S.stby||null}).catch(()=>{})};if(now)return run();saveT=setTimeout(run,600)}
function applyState(st){if(!st)return;S.ops=st.ops||S.ops;S.icx=st.icx||{};S.stby=st.stby||null;if(st.gen)S.gen=st.gen;S.ex=st.ex||{};S.frames=st.frames||{};if(st.layout&&!(st.layout.slots&&st.layout.slots[0]&&st.layout.slots[0].x===75&&st.layout.slots[0].y===134))S.layout=st.layout;
  for(const [p,r] of Object.entries(st.reps||{})){const F=S.lc.get(p.toLowerCase());if(F&&r.idx&&r.idx.length===F.w*F.h){F.rep={pal:r.pal,idx:r.idx,keyIdx:r.keyIdx,by:r.by||repByGuess(st,F)};if(r.exempt&&S.ex[F.path]===undefined)S.ex[F.path]=true}}migrateLook(st);if(typeof SET!=='undefined'&&SET.stIcons!==false&&!S.demo)statusIcons(true);if(S.gen&&S.gen.per)for(const F of S.files){const q=S.gen.per[F.path];if(q&&q.look&&q.look!=='orig'&&noStyle(F)){delete q.look;if(F.rep&&(F.rep.by==='gen'||!F.rep.by))F.rep=null;delete S.ex[F.path];F.cv=null}}S.ver++}
function remember(){try{localStorage.setItem('skinhz-ui',JSON.stringify({cat:S.cat,grid:S.gridOn,gs:S.gridSize,snap:S.snap,scr:S.scr}))}catch(_){}}
function recall(){let u={};try{u=JSON.parse(localStorage.getItem('skinhz-ui')||'{}')||{}}catch(_){}
  if(u.cat&&CATL.has(u.cat))S.cat=u.cat;if(typeof u.grid==='boolean')S.gridOn=u.grid;if(u.gs)S.gridSize=u.gs;if(u.snap===false)S.snap=false;if(u.scr&&SCRBG.has(u.scr))S.scr=u.scr}

/* ============ pantalla del coche ============ */
function defaultLayout(){S.layout={slots:SLOT_NAMES.map((n,i)=>{let F=byName('home/'+n+'.bmp');if(!F&&i===3)F=byName('home/home_map_btn.bmp');return {p:F?F.path:null,x:SLOT_POS[i][0],y:SLOT_POS[i][1]}})}}
const slotF=s=>s&&s.p?S.lc.get(s.p.toLowerCase()):null;
function drawPreview(c,o){
  o=o||{};const x=c.getContext('2d'),scr=o.scr||'home';x.fillStyle='#000';x.fillRect(0,0,800,480);
  const rc=F=>o.orig?renderOrig(F,false):renderCanvas(F,false);
  const bg=byName(SCRBG.get(scr));if(bg)x.drawImage(rc(bg),0,0,bg.w/frames(bg),bg.h,0,0,800,480);
  let pvV=null;if(o.view)drawView(x,o.view,rc,o.press,null,o.hov==null?-1:o.hov);
  // editor: si la imagen sale en una vista conocida, se dibuja en su sitio real dentro de esa vista
  const pv=o.place&&typeof vwFor==='function'?vwFor(o.place,scr):null;pvV=pv;if(pv){drawView(x,pv,rc,-1,{lc:o.place.lc,st:o.state||0},-1);o={...o,place:null,vlabel:(pv.band?pv.band+' · ':'')+pv.v}}
  if(scr==='home')S.layout.slots.forEach((s,i)=>{const F=slotF(s);if(!F)return;const fr=frames(F),fw=F.w/fr,f=(i===S.press&&fr>1)?1:Math.min(o.state||0,fr-1);
    const src=(o.gen&&S.genCv&&S.genCv.get(F.path))||rc(F);x.drawImage(src,f*fw,0,fw,F.h,s.x,s.y,fw,F.h);
    const lb=LABELS[F.name.toLowerCase()];if(lb&&!o.nolabels&&fw===210&&F.h===137){x.save();x.font='600 21px Tahoma,Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=f%2===1?'#000':'#fff';x.fillText(lb,s.x+105,s.y+88+17.5,176);x.restore()}});
  const line=byName(scr==='home'?'home/common_indi_line.bmp':'common/common_indi_line.bmp')||byName('common/common_indi_line.bmp');
  if(line&&!(o.view&&o.view.noline)&&!(pvV&&pvV.noline))x.drawImage(rc(line),0,0);
  if(o.place){const F=o.place,fr=frames(F),fw=F.w/fr,st=Math.min(o.state||0,fr-1),src=o.orig?renderOrig(F,false):renderCanvas(F,false),kp=KNOWNPOS[F.lc];
    let sc=kp?1:(fw<80&&F.h<80?3:Math.min(1,720/fw,360/F.h));const w=Math.max(1,fw*sc),h=Math.max(1,F.h*sc),px=kp?kp[0]:Math.round((800-w)/2),py=kp?kp[1]:Math.round(78+(370-h)/2);
    x.save();x.imageSmoothingEnabled=sc<2;x.drawImage(src,st*fw,0,fw,F.h,px,py,w,h);x.restore();x.save();x.setLineDash([8,6]);x.strokeStyle='#3ddc9a';x.lineWidth=2;x.strokeRect(px-4,py-4,w+8,h+8);x.restore();
    if(!kp){x.fillStyle='rgba(0,0,0,.65)';x.fillRect(0,448,800,32);x.fillStyle='#e8eef7';x.font='600 17px Inter,sans-serif';x.textAlign='center';x.fillText((sc>1?'Ampliado ×3 · ':'')+'posición aproximada: el MediaNav decide dónde se dibuja',400,470);x.textAlign='start'}}
  if(o.selP&&scr==='home')S.layout.slots.forEach(s=>{const F=slotF(s);if(!F||F.path!==o.selP)return;const fw=F.w/frames(F);x.save();x.strokeStyle='#3ddc9a';x.lineWidth=5;x.shadowColor='#3ddc9a';x.shadowBlur=12;x.strokeRect(s.x-3,s.y-3,fw+6,F.h+6);x.restore()});
  if(o.vlabel){x.save();x.font='600 16px Inter,sans-serif';const t='Posición real · vista '+o.vlabel,tw=x.measureText(t).width+18;x.fillStyle='rgba(5,20,14,.85)';x.fillRect(800-tw-8,6,tw,26);x.fillStyle='#3ddc9a';x.fillText(t,800-tw+1,24);x.restore()}
  if(!bg){x.fillStyle='#98a8bd';x.font='600 22px Inter,sans-serif';x.textAlign='center';x.fillText('Este backup no tiene el fondo de esta pantalla',400,250);x.textAlign='start'}
  if(o.grid&&S.gridOn){const g=S.gridSize;x.save();x.lineWidth=1;x.strokeStyle='rgba(61,220,154,.22)';x.beginPath();
    for(let gx=g;gx<800;gx+=g){x.moveTo(gx+.5,0);x.lineTo(gx+.5,480)}for(let gy=g;gy<480;gy+=g){x.moveTo(0,gy+.5);x.lineTo(800,gy+.5)}x.stroke();
    x.strokeStyle='rgba(61,220,154,.8)';x.setLineDash([10,6]);x.lineWidth=2;x.beginPath();x.moveTo(400,0);x.lineTo(400,480);x.moveTo(0,240);x.lineTo(800,240);x.stroke();
    x.strokeStyle='rgba(245,183,92,.9)';x.beginPath();x.moveTo(0,78);x.lineTo(800,78);x.stroke();x.restore()}
  if(o.boxes&&scr==='home')S.layout.slots.forEach((s,i)=>{const F=slotF(s);if(!F)return;const fw=F.w/frames(F),on=i===S.sel;
    x.save();x.strokeStyle=on?'#3ddc9a':'rgba(61,220,154,.6)';x.lineWidth=on?4:2;if(!on)x.setLineDash([8,5]);x.strokeRect(s.x+2,s.y+2,fw-4,F.h-4);x.restore();
    x.font='700 20px Inter,sans-serif';x.fillStyle=on?'#3ddc9a':'rgba(61,220,154,.85)';x.fillText(String(i+1),s.x+10,s.y+28);
    if(on){const t=`x ${s.x} · y ${s.y}`;x.font='600 18px Inter,sans-serif';const tw=x.measureText(t).width+16,ty=s.y>36?s.y-32:s.y+F.h+6;x.fillStyle='#3ddc9a';x.fillRect(s.x,ty,tw,26);x.fillStyle='#05140e';x.fillText(t,s.x+8,ty+19)}});
}
const KNOWNPOS={'home/home_set time_btn.bmp':[0,415],'home/home_dark_btn.bmp':[30,0]};
function scrOfFile(F){if(F.sec==='COMMON'){for(const [k,,b] of SCREENS)if(F.lc===b)return k;return 'home'}return SECSCR[F.sec]||'home'}
function pvFor(F,state,orig){const scr=scrOfFile(F),o={scr,state:state==='all'?0:(state||0),orig};
  if(scr==='home'&&S.layout.slots.some(s=>s.p===F.path))o.selP=F.path;else if(F.lc!==SCRBG.get(scr)&&!/indi_line/.test(F.lc))o.place=F;return o}
function pvBlock(id){return `<div class="screen"><canvas id="${id}" width="800" height="480" aria-label="Vista previa de la pantalla del coche"></canvas></div>`}
function slotAt(c,e){const r=c.getBoundingClientRect(),px=(e.clientX-r.left)*800/r.width,py=(e.clientY-r.top)*480/r.height;
  for(let i=S.layout.slots.length-1;i>=0;i--){const s=S.layout.slots[i],F=slotF(s);if(!F)continue;const fw=F.w/frames(F);if(px>=s.x&&px<s.x+fw&&py>=s.y&&py<s.y+F.h)return {i,px,py}}return {i:-1,px,py}}
function mountPreview(c,o){S.pvs.push({c,o});drawPreview(c,o())}

/* ============ miniaturas ============ */
let io=null;const vis=new Set();
function mountThumbs(root){if(io)io.disconnect();vis.clear();io=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting)vis.add(e.target);else vis.delete(e.target)}pump()},{rootMargin:'300px'});$$('canvas[data-th]',root||document).forEach(c=>io.observe(c))}
let pumping=false;
function pump(){if(pumping)return;pumping=true;requestAnimationFrame(function step(){let n=0;
  for(const c of vis){if(+c.dataset.v===S.ver)continue;if(!c.isConnected){vis.delete(c);continue}drawThumb(c);if(++n>=12)break}
  if(n>=12)requestAnimationFrame(step);else pumping=false})}
function drawThumb(c){const F=S.files[+c.dataset.th];if(!F)return;const full=renderCanvas(F,false),fr=frames(F),fw=F.w/fr,stv=c.dataset.st,all=stv==='all';
  const sx=all?0:(+stv||0)*fw,sw=all?F.w:fw,mw=+c.dataset.mw||150,mh=+c.dataset.mh||80,dpr=Math.min(2,window.devicePixelRatio||1),sc=Math.min(mw*dpr/sw,mh*dpr/F.h,4*dpr);
  const w=Math.max(1,Math.round(sw*sc)),h=Math.max(1,Math.round(F.h*sc));if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;c.style.width=w/dpr+'px';c.style.height=h/dpr+'px';
  const x=c.getContext('2d');x.clearRect(0,0,w,h);x.imageSmoothingEnabled=sc<1.6;x.imageSmoothingQuality='high';x.drawImage(full,sx,0,sw,F.h,0,0,w,h);c.dataset.v=S.ver;
  const card=c.closest('[data-f]');if(card){const p=card.querySelector('[data-stt]');if(p){const s=stateOf(F);p.className='pill '+s.c;p.textContent=s.t}}
  if(F.sec!==S.keepSec&&!isPreviewFile(F)&&F!==S.curF)F.cv=null}
function isPreviewFile(F){return F.sec==='HOME'||/_bg\.bmp$|indi_line/.test(F.lc)}
const th=(F,mw,mh,st)=>`<canvas data-th="${S.files.indexOf(F)}" data-mw="${mw}" data-mh="${mh}" data-st="${st==null?0:st}" width="1" height="1"></canvas>`;
function fileRow(F,sub){const s=stateOf(F),fr=frames(F);return `<button class="li" data-f="${S.files.indexOf(F)}" data-edit><span class="th">${th(F,72,42)}</span><span class="tx"><b>${esc(pretty(F))}</b><small><span class="pill ${s.c}" data-stt>${s.t}</span>${esc(sub||KINDL.get(kindOf(F))+(fr>1?' · '+fr+' estados':''))}</small></span>${CHEV}</button>`}
function tile(F){const s=stateOf(F),fr=frames(F);return `<button class="tile" data-f="${S.files.indexOf(F)}" data-edit><div class="tt">${th(F,150,76)}</div><div class="tm"><span class="nm">${esc(pretty(F))}</span><span class="dm">${F.w/fr}×${F.h}${fr>1?' · '+fr+' estados':''}</span><span class="pill ${s.c}" data-stt>${s.t}</span></div></button>`}

/* ============ navegación ============ */
const ROOTS=[['home','Pantalla','M3 5h18v12H3zM8 21h8M12 17v4'],['theme','Diseños','M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.4 3.4A1.6 1.6 0 0 1 12 22zM7.5 11.5h.01M10.5 7.5h.01M15.5 8.5h.01'],['lib','Imágenes','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],['export','Exportar','M12 3v12M7 10l5 5 5-5M5 21h14']];
const ROOTN=new Set(ROOTS.map(r=>r[0]));
function go(r){if(ROOTN.has(r.n))S.stack=[];else S.stack.push(S.route);S.route=r;render();scrollTo(0,0)}
function back(){S.route=S.stack.pop()||{n:'home'};render();}
function navHTML(){return ROOTS.map(([k,l,d])=>`<button data-r="${k}">${ic(d)}<span>${l}</span>${k==='export'?'<b class="badge" data-badge hidden>0</b>':''}</button>`).join('')}
function rootOf(){if(ROOTN.has(S.route.n))return S.route.n;for(let i=S.stack.length-1;i>=0;i--)if(ROOTN.has(S.stack[i].n))return S.stack[i].n;return 'home'}
// Qué diseño estás usando: su nombre y si tiene cambios sin guardar
function designLine(){const n=S.files.filter(changed).length;
  if(S.base)return `Diseño «${esc(S.base.name)}»${S.curDesign===S.base.id?'':' · <b>cambios sin guardar</b>'}`;
  return n?`Diseño sin guardar · ${n} ${n===1?'imagen cambiada':'imágenes cambiadas'}`:'Original de Renault · sin cambios'}
function setTitle(t1,t2,mono){$('#ab-t').innerHTML=`<span class="t1">${t1}</span>${t2?`<span class="t2${mono?' mono':''}">${t2}</span>`:''}`}
function render(keepScroll){
  const y=scrollY;S.pvs=[];S.live=null;S.slow=null;S.curF=null;closeBS();
  const r=S.route,v=$('#view');document.body.dataset.route=r.n;const root=rootOf();
  $$('#bnav [data-r],#tnav [data-r]').forEach(b=>{if(b.dataset.r===root)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  $('#ab-back').hidden=ROOTN.has(r.n);
  ({home:scrHome,theme:scrTheme,lib:scrLib,cat:scrCat,edit:scrEdit,layout:scrLayout,export:scrExport,gen:scrGen,settings:scrSettings,scr:scrScreen,stby:scrStandby})[r.n](v,r);
  mountThumbs(v);updUndo();updBadge();if(keepScroll)scrollTo(0,y);
}
function updBadge(){const n=S.files.filter(changed).length;$$('[data-badge]').forEach(b=>{b.textContent=n;b.hidden=!n});return n}

/* ============ Pantalla ============ */
function scrHome(v){
  setTitle('Pantalla',S.demo?`<span class="lw">Mediaskin<em>hz</em></span> · ejemplo`:`<button class="dsn-t" id="h-dsn" title="Mis diseños">${designLine()}</button>`);
  const hd=$('#h-dsn');if(hd)hd.onclick=()=>{S.ttab='mios';go({n:'theme'})};
  const scr=S.scr,have=SCREENS.filter(s=>byName(s[2]));if(!have.some(s=>s[0]===scr)&&have.length)S.scr=have[0][0];
  const rows=[];const bg=byName(SCRBG.get(S.scr));if(bg)rows.push(fileRow(bg,'Fondo · 800×480'));
  if(S.scr==='home')for(const s of S.layout.slots){const F=slotF(s);if(F)rows.push(fileRow(F,'Botón · 4 estados'))}
  const line=byName(S.scr==='home'?'home/common_indi_line.bmp':'common/common_indi_line.bmp');if(line)rows.push(fileRow(line,'Barra superior'));
  const sec=SCRSEC[S.scr],nSec=S.files.filter(F=>F.sec===sec).length;
  v.innerHTML=`<div class="two">
    <div class="stack stick">
      <div class="chips scroll" id="h-scr">${have.map(([k,l])=>`<button class="chip" data-s="${k}" aria-pressed="${k===S.scr}">${l}</button>`).join('')}${S.demo?'':'<button class="chip" data-s="common">Común</button>'}${!S.demo&&byName('common/etc_bg.bmp')?'<button class="chip" data-s="stby">Reposo</button>':''}</div>
      <div class="screen"><canvas id="pv" width="800" height="480" aria-label="Vista previa de la pantalla ${esc(SCRL.get(S.scr))}"></canvas></div>
      <div class="e-bar"><div class="seg" id="h-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="${S.hcmp!=='orig'}">Ahora</button><button data-v="orig" aria-pressed="${S.hcmp==='orig'}">Original</button></div><span class="sp"></span><span class="hint" style="padding:0">${S.scr==='home'?(S.demo?'Toca un botón para cambiarlo':'Toca un botón para abrir esa pantalla'):'Fondo con tu tema'}</span></div>
    </div>
    <div class="stack">
      ${S.demo?`<div class="card demo"><h2>Esto es un ejemplo</h2><p>Las imágenes son de muestra. Carga tu backup (la carpeta <b>M1</b> o un ZIP) para editar las de tu MediaNav. No sale de tu móvil.</p><button class="btn wide" data-act="load">${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}Cargar mi backup</button></div>`:''}
      ${S.scr==='home'&&!S.demo&&genTargets().length?`<div class="qa"><button class="qai" data-go="gen"><span class="ic">${ic('M12 3l1.9 5.8L20 10l-5 3.6L16.8 20 12 16.4 7.2 20 9 13.6 4 10l6.1-1.2z')}</span><b>Estilo de los botones</b><small>Los 6 a la vez: estilo, forma y trazo</small></button><button class="qai" data-act="listos"><span class="ic">${ic('M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.4 3.4A1.6 1.6 0 0 1 12 22zM7.5 11.5h.01M10.5 7.5h.01M15.5 8.5h.01')}</span><b>Diseños listos</b><small>${PRESETS.length} diseños completos, con vista previa</small></button></div>`:S.scr==='home'&&genTargets().length?`<div class="list"><button class="li" data-go="gen"><span class="ic">${ic('M12 3l1.9 5.8L20 10l-5 3.6L16.8 20 12 16.4 7.2 20 9 13.6 4 10l6.1-1.2z')}</span><span class="tx"><b>Rediseñar los botones</b><small>Estilo, forma, color e iconos nuevos</small></span>${CHEV}</button></div>`:''}
      <p class="sec-t">En esta pantalla</p>
      <div class="list">${rows.join('')||'<p class="empty">No hay imágenes de esta pantalla en el backup.</p>'}</div>
      ${S.scr==='home'?`<div class="list"><button class="li" data-go="layout"><span class="ic">${ic('M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20')}</span><span class="tx"><b>Distribución de los botones</b><small>Moverlos, cuadrícula y qué botón va en cada hueco</small></span>${CHEV}</button></div>`:''}
      ${nSec&&S.scr!=='home'?`<div class="list"><button class="li" data-cat="${catOf({sec})}" data-sec="${esc(sec)}"><span class="ic">${ic('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z')}</span><span class="tx"><b>Todas las imágenes de ${esc(SECL.get(sec))}</b><small>${nSec} imágenes</small></span>${CHEV}</button></div>`:''}
    </div></div>`;
  $('#h-scr').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;const k=b.dataset.s;if(k==='stby'){go({n:'stby'});return}if(k!=='home'&&!S.demo){go({n:'scr',s:k});return}S.scr=k;remember();render(true)};
  const c=$('#pv');mountPreview(c,()=>({scr:S.scr,orig:S.hcmp==='orig'}));
  $('#h-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.hcmp=b.dataset.v;$$('#h-cmp button').forEach(x=>x.setAttribute('aria-pressed',x===b));drawPreview(c,{scr:S.scr,orig:S.hcmp==='orig'})};
  if(S.scr==='home'){let down=-1;
    c.onpointerdown=e=>{const h=slotAt(c,e);down=h.i;if(h.i>=0){S.press=h.i;drawPreview(c,{scr:'home',orig:S.hcmp==='orig'})}};
    c.onpointermove=e=>{if(e.pointerType!=='mouse')return;const h=slotAt(c,e);c.style.cursor=h.i>=0?'pointer':'default';if(down<0&&S.press!==h.i){S.press=h.i;drawPreview(c,{scr:'home',orig:S.hcmp==='orig'})}};
    c.onpointerleave=c.onpointercancel=()=>{down=-1;S.press=-1;drawPreview(c,{scr:'home',orig:S.hcmp==='orig'})};
    const wasLong=longPress(c,e=>{const h=slotAt(c,e);down=-1;S.press=-1;drawPreview(c,{scr:'home',orig:S.hcmp==='orig'});const F=h.i>=0&&slotF(S.layout.slots[h.i]);if(F&&!S.demo)styleMenu(F,genTargets(),()=>drawPreview(c,{scr:'home',orig:S.hcmp==='orig'}))});
    c.onpointerup=e=>{const h=slotAt(c,e);const i=down;down=-1;S.press=-1;drawPreview(c,{scr:'home',orig:S.hcmp==='orig'});if(wasLong())return;
      if(S.pasteMode&&S.clip&&i>=0&&h.i===i){const F=slotF(S.layout.slots[i]);if(F){pasteStyle([F]);drawPreview(c,{scr:'home',orig:S.hcmp==='orig'})}return}
      if(i>=0&&h.i===i){const F=slotF(S.layout.slots[i]);if(F){const sc=slotScr(F);if(sc&&!S.demo)go({n:'scr',s:sc});else if(genTargets().includes(F))btnSheet(F);else go({n:'edit',p:F.path})}}}}
  S.slow=()=>{};
}

/* ============ Tema ============ */
function scopeList(){const secs=[...new Set(S.files.map(F=>F.sec))].filter(s=>s!=='4WD');return [['global','Toda la radio'],...secs.map(s=>[s,SECL.get(s)||s])]}
// Mis diseños en la pestaña Diseños: cargar con un toque; renombrar, borrar y archivos en Ajustes → Mis diseños
async function mineUI(el){if(!el)return;if(S.demo){el.innerHTML='<p class="note">Carga tu backup para guardar diseños.</p>';return}
  const D=(await listPoints()).filter(p=>p.kind==='manual'&&p.sig===sig());if(!el.isConnected)return;
  el.innerHTML=`<div class="stack" style="gap:8px"><button class="btn wide" id="tm-save">Guardar lo que tienes ahora</button><button class="btn o wide" id="tm-imp">Importar un diseño (.mskz o ZIP)</button></div>
    ${D.length?`<div class="dsg" style="margin-top:12px">${D.map(p=>`<div class="dsc${S.curDesign===p.id?' on':''}" data-d="${p.id}"><button class="dsi" data-a="load" aria-label="Cargar ${esc(p.label)}">${p.thumb?`<img src="${p.thumb}" alt="">`:'<span class="dsn">Sin vista previa</span>'}${S.curDesign===p.id?'<span class="pill p-col">Cargado</span>':''}</button>
      <div class="dst"><b>${esc(p.label)}</b><small>${fdt(p.t)}</small></div></div>`).join('')}</div>
      <button class="btn o sm" id="tm-man" style="margin-top:10px">Renombrar, borrar o guardar en archivo</button>`:'<p class="note" style="margin-top:10px">Aún no has guardado ninguno. Guarda los que te gusten para cambiar entre ellos o llevarlos juntos al USB.</p>'}`;
  $('#tm-save').onclick=async()=>{await saveDesign();render(true)};$('#tm-imp').onclick=pickDesignFile;
  const m=$('#tm-man');if(m)m.onclick=()=>{S.focus='s-des';S.stab='des';go({n:'settings'})};
  el.querySelectorAll('.dsc').forEach(c=>c.onclick=e=>{if(e.target.closest('[data-a]'))restorePoint(c.dataset.d)})}
function scrTheme(v){
  const tt=S.ttab||(S.ttab=S.demo?'crear':'listos');
  const sl=scopeList();if(!sl.some(s=>s[0]===S.scope))S.scope='global';const sc=S.scope,scl=sc==='global'?'toda la radio':SECL.get(sc);
  setTitle('Diseños',`<span class="lw">Mediaskin<em>hz</em></span> · ${tt==='listos'?'listos para usar':tt==='mios'?'los que has guardado':'crea el tuyo'}`);
  const strip=stripFiles(sc);
  const actives=[['global','Toda la radio',S.ops.global],...Object.entries(S.ops.sec).map(([k,o])=>[k,SECL.get(k)||k,o])].filter(a=>!empty(a[2]));
  // pestañas arriba y fijas en su sitio (no flotan); la vista previa solo en «Crear el tuyo»
  v.innerHTML=`<div class="seg gtabs" style="position:static;margin-bottom:12px" id="t-tabs" role="tablist">${[['listos','Listos'],['mios','Mis diseños'],['crear','Crear el tuyo']].map(([k,l])=>`<button data-t="${k}" aria-pressed="${tt===k}">${l}</button>`).join('')}</div>
  <div class="two">
${tt==='crear'?`    <div class="stick sticky-pv" id="t-pv">
      <div class="screen"><canvas id="pv" width="800" height="480" aria-label="Vista previa con el tema"></canvas></div>
      <div class="strip" aria-label="Muestras">${strip.map(F=>`<button data-f="${S.files.indexOf(F)}" data-edit title="${esc(pretty(F))}">${th(F,66,42)}</button>`).join('')}</div>
    </div>`:''}
    <div class="stack">
      ${tt==='listos'?(S.demo||!genTargets().length?'<p class="note">Carga tu backup para usar los diseños listos.</p>':presetsHTML('t-pre')+'<p class="note">Cada diseño listo cambia de una vez los botones, los fondos y los colores de toda la radio. Después puedes retocarlo en «Crear el tuyo» o pantalla a pantalla.</p>'):''}
      ${tt==='mios'?'<div id="t-mios"><p class="note">Cargando…</p></div>':''}
      ${tt==='crear'?`<div class="list"><button class="li" data-go="gen"><span class="ic">${ic('M12 3l1.9 5.8L20 10l-5 3.6L16.8 20 12 16.4 7.2 20 9 13.6 4 10l6.1-1.2z')}</span><span class="tx"><b>Estilo de los botones</b><small>Forma, estilo, iconos y su color</small></span>${CHEV}</button></div>
      <div class="field"><span class="lbl">Color · aplicar a</span><div class="chips scroll" id="t-sc">${sl.map(([k,l])=>`<button class="chip" data-sc="${esc(k)}" aria-pressed="${k===sc}">${!empty(scopeOps(k))?'<span class="dot"></span>':''}${esc(l)}</button>`).join('')}</div></div>
      <div class="card"><h3>Color de ${esc(scl)}</h3><div id="t-tint"></div></div>
      <div class="card"><h3>Cambiar un color concreto</h3><p class="note">Elige uno de los colores que hay en ${esc(scl)} y sustitúyelo solo a él. El resto se queda como está.</p><div id="t-fam"></div></div>
      <details class="card" id="t-fine"${(scopeOps(sc)||{}).h||(scopeOps(sc)||{}).s||(scopeOps(sc)||{}).l?' open':''}><summary>Ajustes finos</summary><div id="t-fn"></div></details>
      <div class="card"><h3>Temas activos</h3>${actives.length?`<div class="applies">${actives.map(([k,l,o])=>`<div class="ap"><span class="dt" style="background:${opsDot(o)}"></span><span class="tx"><b>${esc(l)}</b><small>${esc(describe(o))}</small></span><button class="lnk" data-rm="${esc(k)}">Quitar</button></div>`).join('')}</div>`:'<p class="note">Todavía no hay ningún tema. Elige un color arriba.</p>'}</div>`:''}
    </div></div>`;
  const c=$('#pv');if(c)mountPreview(c,()=>({scr:SECSCR[sc]||'home'}));
  $('#t-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.ttab=b.dataset.t;render(true)};
  if(tt==='listos'){mountPresets($('#t-pre'));return}
  if(tt==='mios'){mineUI($('#t-mios'));return}
  $('#t-sc').onclick=e=>{const b=e.target.closest('[data-sc]');if(!b)return;S.scope=b.dataset.sc;S.famOpen=null;render(true)};
  const get=()=>scopeOps(sc),set=o=>setScopeOps(sc,o);
  tintUI($('#t-tint'),'t',get,set,()=>render(true));
  fineUI($('#t-fn'),'tf',get,set);
  const fams=()=>famsOfFiles(scopeFiles(sc));famUI($('#t-fam'),'t:'+sc,fams,get,set);
  $$('[data-rm]',v).forEach(b=>b.onclick=()=>{before();setScopeOps(b.dataset.rm,null);bump();render(true);toast('Tema quitado',{label:'Deshacer',fn:undo})});
  S.live=()=>famUI($('#t-fam'),'t:'+sc,fams,get,set,true);
}
function stripFiles(sc){const fs=scopeFiles(sc);const pick=[];
  if(sc==='global'){for(const s of S.layout.slots){const F=slotF(s);if(F)pick.push(F)}for(const sec of ['FM RADIO','MEDIA','PHONE','SETTING','ECO','ETC']){pick.push(...S.files.filter(F=>F.sec===sec&&kindOf(F)!=='bg').slice(0,2))}}
  else{pick.push(...fs.filter(F=>kindOf(F)==='btn').slice(0,8),...fs.filter(F=>kindOf(F)==='ico').slice(0,6),...fs.filter(F=>kindOf(F)==='part').slice(0,4))}
  return [...new Set(pick)].slice(0,16)}

/* componentes de color */
function swatches(sel,opts){opts=opts||{};return `<div class="swg" role="group" aria-label="${opts.label||'Colores'}">
  ${opts.none?`<button class="swc none" data-h="none" aria-pressed="${sel==='none'}" title="${opts.none}" aria-label="${opts.none}"></button>`:''}
  ${HUES.map(([n,h])=>`<button class="swc" data-h="${h}" aria-pressed="${sel===h}" title="${n}" aria-label="${n}" style="--c:hsl(${h} 72% 46%)"></button>`).join('')}
  ${opts.white?`<button class="swc white" data-h="white" aria-pressed="${sel==='white'}" title="Blanco" aria-label="Blanco"></button>`:''}
  <label class="swc pick" title="Otro color" aria-pressed="${sel==='custom'}"><input type="color" data-pick aria-label="Elegir otro color"></label></div>`}
function paintRange(inp){const mn=+inp.min,mx=+inp.max,v=+inp.value;if(inp.classList.contains('hue'))return;
  if(mn<0){const z=(0-mn)/(mx-mn)*100,p=(v-mn)/(mx-mn)*100,a=Math.min(z,p),b=Math.max(z,p);inp.style.setProperty('--trk',`linear-gradient(90deg,var(--bd) ${a}%,var(--em2) ${a}%,var(--em2) ${b}%,var(--bd) ${b}%)`)}
  else{const p=(v-mn)/(mx-mn)*100;inp.style.setProperty('--trk',`linear-gradient(90deg,var(--em2) ${p}%,var(--bd) ${p}%)`)}}
function bindRange(inp,on,fmt){paintRange(inp);const out=inp.closest('.rg')&&inp.closest('.rg').querySelector('output');
  inp.oninput=()=>{if(!inp._g){before();inp._g=true}paintRange(inp);if(out)out.textContent=fmt(+inp.value);on(+inp.value)};inp.onchange=()=>{inp._g=false}}
const hexHsl=v=>rgb2hsl(parseInt(v.slice(1,3),16),parseInt(v.slice(3,5),16),parseInt(v.slice(5,7),16));
function tintUI(el,pre,get,set,after){
  const o=get()||defOps(),sel=o.tA?(HUES.some(h=>h[1]===o.tH)?o.tH:'custom'):'none';
  el.innerHTML=`${swatches(sel,{none:'Colores originales',label:'Color del tema'})}
    <label class="rg" for="${pre}-a"><span>Intensidad <output>${o.tA} %</output></span><input type="range" id="${pre}-a" min="0" max="100" value="${o.tA}"></label>
    <label class="swrow" for="${pre}-g"><span>Teñir también grises y blancos<small>Si no, solo cambian las partes de color</small></span><input class="sw" type="checkbox" id="${pre}-g"${o.tG?' checked':''}></label>`;
  const cur=()=>({...defOps(),...(get()||{})});
  el.querySelector('.swg').onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;before();const n=cur();if(b.dataset.h==='none')n.tA=0;else{n.tH=+b.dataset.h;if(!n.tA)n.tA=100}set(n);bump();tintUI(el,pre,get,set,after);after&&after()};
  el.querySelector('[data-pick]').onchange=e=>{before();const n=cur();n.tH=Math.round(hexHsl(e.target.value)[0]);if(!n.tA)n.tA=100;set(n);bump();tintUI(el,pre,get,set,after);after&&after()};
  bindRange($(`#${pre}-a`,el),v=>{const n=cur();n.tA=v;set(n);bump();el.querySelectorAll('.swc[data-h]').forEach(s=>s.setAttribute('aria-pressed',s.dataset.h==='none'?String(!v):String(!!v&&+s.dataset.h===n.tH)))},v=>v+' %');
  $(`#${pre}-a`,el).addEventListener('change',()=>after&&after());
  $(`#${pre}-g`,el).onchange=e=>{before();set({...cur(),tG:e.target.checked});bump();after&&after()};
}
function fineUI(el,pre,get,set){const o=get()||defOps();
  el.innerHTML=`<div class="stack" style="margin-top:10px">
    <label class="rg" for="${pre}-h"><span>Girar el tono <output>${o.h}°</output></span><input class="hue" type="range" id="${pre}-h" min="-180" max="180" value="${o.h}"></label>
    <label class="rg" for="${pre}-s"><span>Saturación <output>${o.s} %</output></span><input type="range" id="${pre}-s" min="-100" max="100" value="${o.s}"></label>
    <label class="rg" for="${pre}-l"><span>Brillo <output>${o.l} %</output></span><input type="range" id="${pre}-l" min="-100" max="100" value="${o.l}"></label>
    <button class="btn o sm" data-z>Poner a cero</button></div>`;
  const cur=()=>({...defOps(),...(get()||{})});
  for(const k of ['h','s','l'])bindRange($(`#${pre}-${k}`,el),v=>{set({...cur(),[k]:v});bump()},v=>v+(k==='h'?'°':' %'));
  el.querySelector('[data-z]').onclick=()=>{before();set({...cur(),h:0,s:0,l:0});bump();fineUI(el,pre,get,set)};
}
function famUI(el,ctx,famsFn,get,set,soft){
  const fams=famsFn(),map=(get()||{}).map||{};
  if(!fams.length){el.innerHTML='<p class="note">No hay colores que destaquen aquí.</p>';return}
  if(soft&&el.querySelector('.fams')&&el.dataset.sig===fams.map(f=>f.k).join(',')){fams.forEach(f=>{const d=el.querySelector(`.fam[data-k="${f.k}"] .dual`);if(d){d.style.setProperty('--a',rgbs(f.orig));d.style.setProperty('--b',rgbs(f.now))}});return}
  el.dataset.sig=fams.map(f=>f.k).join(',');
  el.innerHTML=`<div class="fams">${fams.map(f=>{const m=map[f.k],open=S.famOpen===ctx+':'+f.k,sel=m?(m.white?'white':HUES.some(h=>h[1]===m.to)?m.to:'custom'):null;
    return `<div class="fam${open?' open':''}" data-k="${f.k}"><button class="fam-h" aria-expanded="${open}"><span class="dual" style="--a:${rgbs(f.orig)};--b:${rgbs(f.now)}"></span><span class="fam-t"><b>${FAMN[f.k]}</b><small>${pct(f.share)}</small></span><span class="fam-s${m?' on':''}">${m?'→ '+targetName(m):'Sin cambiar'}</span>${CHEV}</button>
    ${open?`<div class="fam-p">${f.k===13?`<p class="note">El negro pasa a un tono oscuro del color que elijas y los casi negros se escalan con él, así se conserva el degradado.${ctx.startsWith('t:')?' <b>Ojo: aquí afecta a todos los fondos, recuadros y sombras de '+(ctx==='t:global'?'toda la radio':'esta sección')+'.</b>':''} Para un fondo claro o vivo, mejor sustituir la imagen.</p>`:''}<p class="note">Cambiar los ${FAMN[f.k].toLowerCase()} por:</p>${swatches(sel,{white:f.k!==13,label:'Nuevo color'})}${m?'<button class="btn o sm" data-keep>Dejar como estaba</button>':''}</div>`:''}</div>`}).join('')}</div>`;
  const cur=()=>({...defOps(),...(get()||{}),map:{...((get()||{}).map||{})}});
  el.querySelectorAll('.fam').forEach(fe=>{const k=+fe.dataset.k;
    fe.querySelector('.fam-h').onclick=()=>{S.famOpen=S.famOpen===ctx+':'+k?null:ctx+':'+k;famUI(el,ctx,famsFn,get,set)};
    const sw=fe.querySelector('.swg');if(sw){sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;before();const n=cur();n.map[k]=b.dataset.h==='white'?{white:true}:k===13?{to:+b.dataset.h,ts:.6,tl:.1}:{to:+b.dataset.h,ts:.72,tl:.5};set(n);bump();famUI(el,ctx,famsFn,get,set)};
      fe.querySelector('[data-pick]').onchange=e=>{before();const [h,s,l]=hexHsl(e.target.value),n=cur();n.map[k]={to:Math.round(h),ts:s,tl:k===13?Math.min(.85,l):Math.max(.15,l)};set(n);bump();famUI(el,ctx,famsFn,get,set)}}
    const kp=fe.querySelector('[data-keep]');if(kp)kp.onclick=()=>{before();const n=cur();delete n.map[k];set(n);bump();famUI(el,ctx,famsFn,get,set)}});
}

/* ============ Imágenes ============ */
function scrLib(v){
  setTitle('Imágenes',`<span class="lw">Mediaskin<em>hz</em></span> · ${S.files.length} imágenes`);
  const ch=S.files.filter(changed).length;
  v.innerHTML=`<div class="two"><div class="stick sticky-pv">${pvBlock('pv')}</div><div class="stack">
    <div class="search"><input id="q" type="search" placeholder="Buscar por nombre" aria-label="Buscar imágenes" value="${esc(S.q)}"></div>
    <div id="lib-b"></div></div></div>`;
  mountPreview($('#pv'),()=>({scr:'home'}));
  const body=()=>{const q=S.q.trim().toLowerCase();const b=$('#lib-b');
    if(q){const fs=S.files.filter(F=>F.lc.includes(q)||pretty(F).toLowerCase().includes(q));b.innerHTML=fs.length?`<div class="grid">${fs.slice(0,120).map(tile).join('')}</div>${fs.length>120?`<p class="note" style="padding-top:10px">Se muestran 120 de ${fs.length}. Afina la búsqueda.</p>`:''}`:`<p class="empty">Ninguna imagen coincide con «${esc(S.q)}».</p>`;mountThumbs($('#view'));return}
    b.innerHTML=`<div class="stack">${ch?`<div class="list"><button class="li" data-cat="*"><span class="ic">${ic('M20 6L9 17l-5-5')}</span><span class="tx"><b>Editadas</b><small>${ch} ${ch===1?'imagen':'imágenes'} con cambios</small></span>${CHEV}</button></div>`:''}
      <div class="list">${CATS.filter(c=>S.files.some(F=>catOf(F)===c[0])).map(([k,l,ss,d])=>{const fs=S.files.filter(F=>catOf(F)===k),n=fs.filter(changed).length;
        return `<button class="li" data-cat="${k}"><span class="ic">${ic(d)}</span><span class="tx"><b>${esc(l)}</b><small>${fs.length} imágenes${n?` · <span class="pill p-col">${n} editadas</span>`:''}</small></span>${CHEV}</button>`}).join('')}</div>
      ${S.png?`<p class="note">${S.png} PNG del indicador 4x4 no se muestran: el Clio no los usa.</p>`:''}</div>`};
  body();$('#q').oninput=e=>{S.q=e.target.value;body()};
}
function scrCat(v,r){
  const all=r.c==='*',fs0=all?S.files.filter(changed):S.files.filter(F=>catOf(F)===r.c);
  setTitle(all?'Editadas':esc(CATL.get(r.c)),`${fs0.length} imágenes`);S.keepSec=null;
  const secs=[...new Set(fs0.map(F=>F.sec))];if(S.sec!=='all'&&!secs.includes(S.sec))S.sec='all';
  const catScr=()=>{const sec=S.sec!=='all'?S.sec:(secs[0]||'HOME');return SECSCR[sec]||'home'};
  v.innerHTML=`<div class="two"><div class="stick sticky-pv">${pvBlock('pv')}<p class="hint" id="c-hint" style="padding:0"></p></div><div class="stack">
    ${secs.length>1?`<div class="chips scroll" id="c-sec"><button class="chip" data-s="all" aria-pressed="${S.sec==='all'}">Todas</button>${secs.map(s=>`<button class="chip" data-s="${esc(s)}" aria-pressed="${S.sec===s}">${esc(SECL.get(s))} <small>${fs0.filter(F=>F.sec===s).length}</small></button>`).join('')}</div>`:''}
    <div class="chips scroll" id="c-kind"></div><div id="c-grid"></div></div></div>`;
  const cpv=$('#pv');mountPreview(cpv,()=>({scr:catScr()}));const hint=()=>{$('#c-hint').textContent='Pantalla '+SCRL.get(catScr())+' · toca una imagen para editarla y verla aquí'};hint();
  const draw=()=>{const fs1=fs0.filter(F=>S.sec==='all'||F.sec===S.sec),cnt=k=>k==='all'?fs1.length:fs1.filter(F=>kindOf(F)===k).length;if(S.kind!=='all'&&!cnt(S.kind))S.kind='all';
    const nch=fs1.filter(changed).length;
    $('#c-kind').innerHTML=KINDS.filter(([k])=>cnt(k)).map(([k,l])=>`<button class="chip" data-k="${k}" aria-pressed="${S.kind===k}">${l} <small>${cnt(k)}</small></button>`).join('')+(all?'':`<button class="chip" data-only aria-pressed="${S.onlyCh}"><span class="dot"></span>Solo editadas <small>${nch}</small></button>`);
    const fs=fs1.filter(F=>(S.kind==='all'||kindOf(F)===S.kind)&&(!S.onlyCh||all||changed(F)));
    const groups=new Map(),order=['bg','btn','part','ico'];for(const F of fs){const k=F.sec+'|'+kindOf(F);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(F)}
    const keys=[...groups.keys()].sort((a,b)=>{const [sa,ka]=a.split('|'),[sb,kb]=b.split('|');return (SECO.get(sa)-SECO.get(sb))||(order.indexOf(ka)-order.indexOf(kb))});
    $('#c-grid').innerHTML=fs.length?`<div class="grid">${keys.map(k=>{const [sec,kd]=k.split('|'),arr=groups.get(k);return `<div class="gh"><h3>${esc(secs.length>1&&S.sec==='all'?SECL.get(sec)+' · ':'')}${KINDL.get(kd)}</h3><span>${arr.length}</span></div>${arr.map(tile).join('')}`}).join('')}</div>`:`<p class="empty">${S.onlyCh?'Aún no has editado nada en esta categoría.':'No hay imágenes.'}</p>`;
    for(const F of S.files)if(!fs0.includes(F)&&!isPreviewFile(F))F.cv=null;mountThumbs($('#view'))};
  draw();
  const cs=$('#c-sec');if(cs)cs.onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.sec=b.dataset.s;S.kind='all';cs.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw();drawPreview(cpv,{scr:catScr()});hint()};
  $('#c-kind').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;if(b.hasAttribute('data-only'))S.onlyCh=!S.onlyCh;else S.kind=b.dataset.k;draw()};
  S.slow=()=>{const p=$('#c-kind [data-only] small');if(p)p.textContent=fs0.filter(F=>(S.sec==='all'||F.sec===S.sec)&&changed(F)).length};
}

/* ============ Editor ============ */
function scrEdit(v,r){
  const F=S.lc.get(r.p.toLowerCase());if(!F){back();return}S.curF=F;S.keepSec=F.sec;
  const fr=frames(F),fw=F.w/fr;if(S.eState==null||S.eFor!==F.path){S.eState=fr>1?(isDesk()?'all':0):'all';S.eFor=F.path;S.cmp='now';S.famOpen=null}
  if(fr===1)S.eState='all';
  setTitle(esc(pretty(F)),esc(F.path),true);
  v.innerHTML=`<div class="two">
    <div class="stick e-pv sticky-pv" id="e-pv">
      <div class="seg" id="e-view" role="group" aria-label="Qué ver"><button data-v="screen" aria-pressed="${S.eview!=='img'}">En pantalla</button><button data-v="img" aria-pressed="${S.eview==='img'}">Imagen</button></div>
      <div id="e-scr"${S.eview==='img'?' hidden':''}>${pvBlock('e-pv-cv')}</div>
      <div class="e-stage" id="e-stage"${S.eview!=='img'?' hidden':''}><span class="e-tag" id="e-tag"></span><canvas id="e-cv"></canvas></div>
      <div class="e-bar"><div class="seg" id="e-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="${S.cmp==='now'}">Ahora</button><button data-v="orig" aria-pressed="${S.cmp==='orig'}">Original</button></div><span class="sp"></span>
        <button class="ib bd" id="e-gd" aria-pressed="${S.guide}" aria-label="Guías" title="Guías">${ic('M3 3h18v18H3zM12 3v18M3 12h18')}</button>
        <button class="ib bd" id="e-key" aria-pressed="${S.showKey}" aria-label="Ver el amarillo de transparencia" title="Ver el amarillo de transparencia">${ic('M12 3l9 16H3z')}</button></div>
      ${fr>1?`<div class="chips scroll" id="e-st">${[...Array(fr).keys()].map(i=>`<button class="chip" data-s="${i}" aria-pressed="${S.eState===i}">${i===0?'Reposo':i===1?'Pulsado':'Estado '+(i+1)}</button>`).join('')}<button class="chip" data-s="all" aria-pressed="${S.eState==='all'}">Todos</button></div>`:''}
    </div>
    <div class="stack">
      <div class="seg tabs3" id="e-tabs" role="tablist"><button data-t="color" aria-pressed="${S.eTab==='color'}">Color</button><button data-t="img" aria-pressed="${S.eTab==='img'}">Sustituir</button><button data-t="info" aria-pressed="${S.eTab==='info'}">Detalles</button></div>
      <div id="e-pane" class="stack"></div>
    </div></div>`;
  const ecv=$('#e-pv-cv'),draw=()=>{if(S.eview==='img')drawEdit(F);else drawPreview(ecv,pvFor(F,S.eState,S.cmp==='orig'))};draw();
  $('#e-view').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.eview=b.dataset.v;$$('#e-view button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#e-scr').hidden=S.eview==='img';$('#e-stage').hidden=S.eview!=='img';
    $('#e-gd').hidden=$('#e-key').hidden=S.eview!=='img';draw()};
  if(S.eview!=='img'){$('#e-gd').hidden=true;$('#e-key').hidden=true}
  ecv.onclick=()=>{S.eview='img';$('#e-view [data-v="img"]').click()};
  $('#e-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.cmp=b.dataset.v;$$('#e-cmp button').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};
  $('#e-gd').onclick=e=>{S.guide=!S.guide;e.currentTarget.setAttribute('aria-pressed',S.guide);draw()};
  $('#e-key').onclick=e=>{S.showKey=!S.showKey;e.currentTarget.setAttribute('aria-pressed',S.showKey);draw()};
  const st=$('#e-st');if(st)st.onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.eState=b.dataset.s==='all'?'all':+b.dataset.s;st.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};
  $('#e-tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.eTab=b.dataset.t;$$('#e-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));pane()};
  const stg=$('#e-stage');stg.ondragover=e=>{e.preventDefault();e.stopPropagation();stg.classList.add('hot')};stg.ondragleave=()=>stg.classList.remove('hot');
  stg.ondrop=e=>{e.preventDefault();e.stopPropagation();stg.classList.remove('hot');const f=[...e.dataTransfer.files].find(f=>f.type.startsWith('image/'));if(f){S.eTab='img';useImage(F,f)}};
  const pane=()=>{const p=$('#e-pane');({color:paneColor,img:paneImg,info:paneInfo})[S.eTab](p,F);};pane();
  S.live=()=>{draw();if(S.eTab==='color'){const fm=$('#e-fam');if(fm)famUI(fm,'f:'+F.path,()=>famsOfFiles([F]),()=>S.ops.file[F.path],o=>setFileOps(F,o),true)}};
}
function drawEdit(F){const c=$('#e-cv');if(!c)return;const fr=frames(F),fw=F.w/fr,all=S.eState==='all',sx=all?0:S.eState*fw,sw=all?F.w:fw;
  const src=S.cmp==='orig'?renderOrig(F,S.showKey):renderCanvas(F,S.showKey);
  const stage=$('#e-stage'),W=Math.max(120,stage.clientWidth-28),Hm=Math.max(100,Math.min(isDesk()?420:180,innerHeight*(isDesk()?.45:.23))),sc=Math.min(W/sw,Hm/F.h,12);
  const dw=Math.max(1,Math.round(sw*sc)),dh=Math.max(1,Math.round(F.h*sc)),dpr=Math.min(2,devicePixelRatio||1);
  c.width=Math.round(dw*dpr);c.height=Math.round(dh*dpr);c.style.width=dw+'px';c.style.height=dh+'px';
  const x=c.getContext('2d');x.imageSmoothingEnabled=sc<2;x.imageSmoothingQuality='high';x.drawImage(src,sx,0,sw,F.h,0,0,c.width,c.height);
  if(S.guide){const k=c.width/sw,g=sw>=400?20:sw>=100?10:4;x.save();x.lineWidth=1;x.strokeStyle='rgba(61,220,154,.3)';x.beginPath();
    for(let gx=g;gx<sw;gx+=g){const X=Math.round(gx*k)+.5;x.moveTo(X,0);x.lineTo(X,c.height)}for(let gy=g;gy<F.h;gy+=g){const Y=Math.round(gy*k)+.5;x.moveTo(0,Y);x.lineTo(c.width,Y)}x.stroke();
    x.strokeStyle='rgba(61,220,154,.95)';x.setLineDash([6,4]);x.lineWidth=2;x.beginPath();const n=all?fr:1;for(let f=0;f<n;f++){const cx=(f*fw+fw/2)*k;x.moveTo(cx,0);x.lineTo(cx,c.height)}x.moveTo(0,c.height/2);x.lineTo(c.width,c.height/2);x.stroke();
    if(all&&fr>1){x.setLineDash([]);x.strokeStyle='rgba(245,183,92,.95)';x.lineWidth=3;x.beginPath();for(let f=1;f<fr;f++){x.moveTo(f*fw*k,0);x.lineTo(f*fw*k,c.height)}x.stroke()}x.restore()}
  $('#e-tag').textContent=S.cmp==='orig'?'Original':(changed(F)?'Ahora':'Sin cambios');
}
function paneColor(p,F){
  const ex=!!S.ex[F.path],G=S.ops.global,C=S.ops.sec[F.sec],P=S.ops.file[F.path];
  const row=(dot,t,d,off,lnk)=>`<div class="ap${off?' off':''}"><span class="dt" style="background:${dot||'var(--bd2)'}"></span><span class="tx"><b>${t}</b><small>${d}</small></span>${lnk||''}</div>`;
  p.innerHTML=`<div class="card"><h3>Qué colores recibe</h3><div class="applies">
      ${row(opsDot(G),'Tema de toda la radio',ex?'Ignorado en esta imagen':esc(describe(G)||'Ninguno'),ex||empty(G),`<button class="lnk" data-th="global">Cambiar</button>`)}
      ${row(opsDot(C),'Tema de '+esc(SECL.get(F.sec)),ex?'Ignorado en esta imagen':esc(describe(C)||'Ninguno'),ex||empty(C),`<button class="lnk" data-th="${esc(F.sec)}">Cambiar</button>`)}
      ${row(opsDot(P),'Solo esta imagen',esc(describe(P)||'Nada'),empty(P))}
    </div><label class="swrow" for="e-ex"><span>Seguir el tema general<small>${F.rep?'Al sustituir una imagen se desactiva para no teñir tu foto':'Desactívalo para que esta imagen tenga solo sus propios colores'}</small></span><input class="sw" type="checkbox" id="e-ex"${ex?'':' checked'}></label></div>
    <div class="card"><h3>Sus colores</h3><p class="note">Toca un color para cambiar solo ese. El círculo muestra el original a la izquierda y cómo queda a la derecha.</p><div id="e-fam"></div></div>
    <div class="card"><h3>Teñir toda la imagen</h3><div id="e-tint"></div></div>
    <details class="card"${P&&(P.h||P.s||P.l)?' open':''}><summary>Ajustes finos</summary><div id="e-fn"></div></details>
    <button class="btn dg wide" id="e-rs">Restaurar original</button>`;
  const get=()=>S.ops.file[F.path],set=o=>setFileOps(F,o),again=()=>paneColor(p,F);
  famUI($('#e-fam'),'f:'+F.path,()=>famsOfFiles([F]),get,set);tintUI($('#e-tint'),'e',get,set,null);fineUI($('#e-fn'),'ef',get,set);
  $('#e-ex').onchange=e=>{before();if(e.target.checked)delete S.ex[F.path];else S.ex[F.path]=true;bump();again()};
  $$('[data-th]',p).forEach(b=>b.onclick=()=>{S.scope=b.dataset.th;go({n:'theme'})});
  $('#e-rs').onclick=async()=>{if(F.rep&&!await confirmBS({title:'Restaurar el original',text:'Se quitará la imagen nueva y los colores propios de esta imagen. Podrás deshacerlo.',ok:'Restaurar',danger:true}))return;before();F.rep=null;delete S.ops.file[F.path];delete S.ex[F.path];delete S.frames[F.path];S.src.delete(F.path);if(S.icx)delete S.icx[F.path];S.eFor=null;bump();render(true);toast('Imagen restaurada',{label:'Deshacer',fn:undo})};
  let t=0;S.slow=()=>{clearTimeout(t);t=setTimeout(()=>{if(!p.isConnected||S.eTab!=='color')return;const aps=p.querySelectorAll('.ap small');const G2=S.ops.global,C2=S.ops.sec[F.sec],P2=S.ops.file[F.path],ex2=!!S.ex[F.path];
    if(aps[0])aps[0].textContent=ex2?'Ignorado en esta imagen':describe(G2)||'Ninguno';if(aps[1])aps[1].textContent=ex2?'Ignorado en esta imagen':describe(C2)||'Ninguno';if(aps[2])aps[2].textContent=describe(P2)||'Nada';
    const ds=p.querySelectorAll('.ap .dt');if(ds[2])ds[2].style.background=opsDot(P2)||'var(--bd2)';p.querySelectorAll('.ap')[2].classList.toggle('off',empty(P2))},50)};
}
function paneImg(p,F){
  const fr=frames(F),fw=F.w/fr,src=S.src.get(F.path)||{fit:'cover',target:'all',dither:true};S.src.set(F.path,src);
  p.innerHTML=`${kindOf(F)!=='bg'?icCard(F):''}<div class="card"><h3>Sustituir por otra imagen</h3>
    <button class="drop" id="i-pick"><span class="ic">${ic('M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16M14 14l1.6-1.6a2 2 0 0 1 2.8 0L20 14M14 8h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z')}</span><span><b>${src.bmp?'Elegir otra imagen':'Elegir una foto o un PNG'}</b><small>Se ajusta sola a ${fw} × ${F.h} px${fr>1?' por estado':''} y se guarda como BMP de 8 bits.</small></span></button>
    <div class="field"><span class="lbl">Cómo encajarla</span><div class="seg" id="i-fit">${[['cover','Rellenar'],['contain','Encajar'],['stretch','Estirar']].map(([v,l])=>`<button data-v="${v}" aria-pressed="${src.fit===v}">${l}</button>`).join('')}</div></div>
    ${fr>1?`<div class="field"><span class="lbl">Dónde ponerla</span><div class="chips" id="i-tg"><button class="chip" data-t="all" aria-pressed="${src.target==='all'}">Todos los estados</button>${[...Array(fr).keys()].map(i=>`<button class="chip" data-t="${i}" aria-pressed="${src.target===String(i)}">${i===0?'Reposo':i===1?'Pulsado':'Estado '+(i+1)}</button>`).join('')}</div></div>`:''}
    <label class="swrow" for="i-di"><span>Difuminar<small>Suaviza los degradados de las fotos</small></span><input class="sw" type="checkbox" id="i-di"${src.dither?' checked':''}></label>
    <p class="note">${F.keyCount?'Las zonas transparentes de tu PNG pasan a ser transparentes en el MediaNav.':'Esta imagen no usa transparencia: las zonas transparentes de tu PNG quedarán en negro.'}</p></div>
    ${S.layout.slots.some(sl=>sl.p===F.path)?`<div class="list"><button class="li" data-go="gen"><span class="ic">${ic('M12 3l1.9 5.8L20 10l-5 3.6L16.8 20 12 16.4 7.2 20 9 13.6 4 10l6.1-1.2z')}</span><span class="tx"><b>Estilo de los botones de Inicio</b><small>Crea los 4 estados con otro estilo, forma o icono</small></span>${CHEV}</button></div>`:''}
    ${F.rep?`<div class="card"><h3>Ya tiene una imagen nueva</h3><p class="note">Puedes cambiarle los colores en la pestaña Color o volver a la original.</p><button class="btn dg wide" id="i-rs">Quitar la imagen nueva</button></div>`:''}`;
  $('#in-img').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)useImage(F,f)};$('#i-pick').onclick=()=>$('#in-img').click();if($('#ic-pick'))icBind(F);
  $('#i-fit').onclick=e=>{const b=e.target.closest('button');if(!b)return;src.fit=b.dataset.v;$$('#i-fit button').forEach(x=>x.setAttribute('aria-pressed',x===b));if(src.bmp){before();reapply(F)}};
  const tg=$('#i-tg');if(tg)tg.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;src.target=b.dataset.t;tg.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));if(src.target!=='all'){S.eState=+src.target;render(true)}};
  $('#i-di').onchange=e=>{src.dither=e.target.checked;if(src.bmp){before();reapply(F)}};
  const rs=$('#i-rs');if(rs)rs.onclick=async()=>{if(!await confirmBS({title:'Quitar la imagen nueva',text:'Volverá la imagen original. Podrás deshacerlo.',ok:'Quitar',danger:true}))return;before();F.rep=null;S.src.delete(F.path);if(S.icx)delete S.icx[F.path];delete S.ex[F.path];bump();render(true);toast('Imagen nueva quitada',{label:'Deshacer',fn:undo})};
}
function paneInfo(p,F){const fr=frames(F),fw=F.w/fr,opts=[1,2,3,4,5,6,8].filter(n=>F.w%n===0&&F.w/n>=4);
  p.innerHTML=`<div class="card"><dl class="facts">
    <div><dt>Tamaño${fr>1?' por estado':''}</dt><dd>${fw} × ${F.h} px</dd></div>
    <div><dt>Archivo completo</dt><dd>${F.w} × ${F.h} px</dd></div>
    <div><dt>Formato</dt><dd>BMP 8 bits · ${F.n} colores</dd></div>
    <div><dt>Transparencia</dt><dd>${F.keyCount?`Sí, ${(F.keyCount*100/(F.w*F.h)).toFixed(1).replace('.',',')} %`:'No'}</dd></div>
    <div><dt>Sección</dt><dd>${esc(SECL.get(F.sec))}${F.sub?' / '+esc(F.sub):''}</dd></div>
    <div><dt>Tipo</dt><dd>${KINDL.get(kindOf(F))}</dd></div></dl>
    <p class="note">Ruta: <code>${esc(S.root)}/${esc(F.path)}</code></p></div>
    <div class="card"><h3>Estados en la tira</h3><p class="note">Los botones guardan varios estados uno al lado del otro. Si la vista no cuadra, cambia el número.</p>
    <div class="chips" id="n-fr">${opts.map(n=>`<button class="chip" data-n="${n}" aria-pressed="${n===fr}">${n}</button>`).join('')}</div></div>`;
  $('#n-fr').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;before();const n=+b.dataset.n;if(n===F.fdef)delete S.frames[F.path];else S.frames[F.path]=n;S.eFor=null;F.cv=null;bump();render(true)};
}
async function useImage(F,file){let bmp;try{bmp=await createImageBitmap(file)}catch(_){toast('No puedo abrir esa imagen. Prueba con PNG o JPG.');return}
  const src=S.src.get(F.path)||{fit:'cover',target:'all',dither:true};S.src.set(F.path,src);src.bmp=bmp;src.base=null;before();if(S.icx)delete S.icx[F.path];
  if(!F.rep&&S.ex[F.path]===undefined)S.ex[F.path]=true;await reapply(F,true);S.eTab='img';render(true);toast('Imagen sustituida',{label:'Deshacer',fn:undo})}
async function reapply(F,fresh){
  const src=S.src.get(F.path);if(!src||!src.bmp)return;const fr=frames(F),fw=F.w/fr;
  const c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d',{willReadFrequently:true});
  if(fresh||!src.base){const B=baseOf(F),im=x.createImageData(F.w,F.h);
    const o=new Uint32Array(im.data.buffer),lut=lutOf(B.pal,false);for(let i=0;i<B.idx.length;i++)o[i]=lut[B.idx[i]];src.base=im}
  x.putImageData(src.base,0,0);x.imageSmoothingQuality='high';
  const tg=src.target==='all'?[...Array(fr).keys()]:[+src.target];
  for(const t of tg){const dx=t*fw,iw=src.bmp.width,ih=src.bmp.height;x.clearRect(dx,0,fw,F.h);
    if(src.fit==='stretch')x.drawImage(src.bmp,dx,0,fw,F.h);
    else if(src.fit==='contain'){const s=Math.min(fw/iw,F.h/ih),w=iw*s,h=ih*s;x.drawImage(src.bmp,dx+(fw-w)/2,(F.h-h)/2,w,h)}
    else{const s=Math.max(fw/iw,F.h/ih),sw=fw/s,sh=F.h/s;x.drawImage(src.bmp,(iw-sw)/2,(ih-sh)/2,sw,sh,dx,0,fw,F.h)}}
  const d=x.getImageData(0,0,F.w,F.h).data,useKey=F.keyCount>0,key=new Uint8Array(F.w*F.h);
  for(let i=0;i<F.w*F.h;i++){const a=d[i*4+3];if(a<128){if(useKey)key[i]=1;else{d[i*4]=d[i*4+1]=d[i*4+2]=0}}else if(a<255){d[i*4]=d[i*4]*a/255;d[i*4+1]=d[i*4+1]*a/255;d[i*4+2]=d[i*4+2]*a/255}}
  const q=quantize(d,F.w,F.h,{key,dither:src.dither});F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx};F.cv=null;bump();
}

/* ============ Distribución ============ */
function scrLayout(v){
  setTitle('Distribución','Solo afecta a la vista previa');S.hint=1;
  const sl=S.layout.slots;if(S.sel>=sl.length)S.sel=0;const cands=S.files.filter(F=>F.sec==='HOME'&&frames(F)>1);
  v.innerHTML=`<div class="two">
    <div class="stick sticky-pv"><div class="screen drag"><canvas id="pv" width="800" height="480" aria-label="Distribución de los botones de Inicio"></canvas></div>
      <div class="chips scroll" id="l-sel">${sl.map((s,i)=>{const F=slotF(s);return `<button class="chip" data-i="${i}" aria-pressed="${i===S.sel}">${i+1} · ${F?esc(pretty(F)):'vacío'}</button>`}).join('')}</div></div>
    <div class="stack">
      <div class="card"><h3>Posición del botón ${S.sel+1}</h3><p class="note">Arrástralo en la pantalla o ajústalo aquí.</p>
        <div class="xy"><label for="l-x">X (px)<input class="num" type="number" inputmode="numeric" id="l-x" min="-200" max="800"></label><label for="l-y">Y (px)<input class="num" type="number" inputmode="numeric" id="l-y" min="-200" max="480"></label></div>
        <div class="pad" id="l-pad">${[['0,-1','M6 15l6-6 6 6','Arriba'],['-1,0','M15 6l-6 6 6 6','Izquierda'],['0,1','M6 9l6 6 6-6','Abajo'],['1,0','M9 6l6 6-6 6','Derecha']].map(([n,d,l])=>`<button data-n="${n}" aria-label="${l}">${ic(d)}</button>`).join('')}</div>
        <p class="note" id="l-step" style="text-align:center"></p>
        <div class="field"><span class="lbl">Imagen de este hueco</span><select id="l-file"><option value="">(vacío)</option>${cands.map(F=>`<option value="${esc(F.path)}"${sl[S.sel].p===F.path?' selected':''}>${esc(pretty(F))}</option>`).join('')}</select></div></div>
      <div class="card"><h3>Cuadrícula</h3>
        <label class="swrow" for="g-on"><span>Mostrar cuadrícula</span><input class="sw" type="checkbox" id="g-on"${S.gridOn?' checked':''}></label>
        <label class="swrow" for="g-sn"><span>Ajustar al mover<small>Los botones saltan de línea en línea</small></span><input class="sw" type="checkbox" id="g-sn"${S.snap?' checked':''}></label>
        <div class="field"><span class="lbl">Tamaño</span><div class="seg" id="g-sz">${[5,10,20,40].map(n=>`<button data-n="${n}" aria-pressed="${S.gridSize===n}">${n} px</button>`).join('')}</div></div>
        <p class="note">La línea naranja marca dónde termina la barra superior (78 px).</p></div>
      <div class="card"><h3>Colocar todos en cuadrícula</h3>
        <div class="gset"><label for="a-c">Columnas<input class="num" type="number" inputmode="numeric" id="a-c" min="1" max="6" value="3"></label><label for="a-t">Margen superior<input class="num" type="number" inputmode="numeric" id="a-t" min="0" max="400" value="114"></label>
        <label for="a-x">Separación horizontal<input class="num" type="number" inputmode="numeric" id="a-x" min="0" max="200" value="9"></label><label for="a-y">Separación vertical<input class="num" type="number" inputmode="numeric" id="a-y" min="0" max="200" value="11"></label></div>
        <button class="btn wide" id="a-go">Colocar y centrar</button></div>
      <button class="btn o wide" id="l-rs">Restablecer posiciones</button>
      <p class="note">El MediaNav coloca los botones por su cuenta: esto no cambia nada en el coche, solo sirve para que la vista previa se parezca a tu pantalla.</p>
    </div></div>`;
  const c=$('#pv'),o=()=>({scr:'home',grid:true,boxes:true});mountPreview(c,o);
  const upd=()=>{const s=sl[S.sel],ax=document.activeElement;if(ax!==$('#l-x'))$('#l-x').value=s.x;if(ax!==$('#l-y'))$('#l-y').value=s.y;$('#l-step').textContent=`Cada toque mueve ${S.gridOn&&S.snap?S.gridSize:1} px`;drawPreview(c,o())};upd();
  const setXY=(nx,ny)=>{const s=sl[S.sel];s.x=Math.round(nx);s.y=Math.round(ny);upd();saveState()};
  let drag=null;
  c.onpointerdown=e=>{const h=slotAt(c,e);if(h.i<0)return;if(h.i!==S.sel){S.sel=h.i;$$('#l-sel .chip').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.i===h.i));render(true);return}
    before();const s=sl[h.i];drag={px:h.px,py:h.py,ox:s.x,oy:s.y};c.setPointerCapture(e.pointerId);e.preventDefault()};
  c.onpointermove=e=>{if(!drag)return;const h=slotAt(c,e),g=S.gridOn&&S.snap?S.gridSize:1;const s=sl[S.sel];s.x=Math.round((drag.ox+h.px-drag.px)/g)*g;s.y=Math.round((drag.oy+h.py-drag.py)/g)*g;upd()};
  c.onpointerup=c.onpointercancel=()=>{if(drag){drag=null;saveState()}};
  $('#l-sel').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;S.sel=+b.dataset.i;render(true)};
  let gx=false;const ni=(inp,f)=>{inp.oninput=()=>{if(inp.value==='')return;if(!gx){before();gx=true}f(+inp.value)};inp.onchange=()=>{gx=false}};
  ni($('#l-x'),v=>setXY(v,sl[S.sel].y));ni($('#l-y'),v=>setXY(sl[S.sel].x,v));
  $('#l-pad').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;before();const [dx,dy]=b.dataset.n.split(',').map(Number),st=S.gridOn&&S.snap?S.gridSize:1,s=sl[S.sel];
    setXY(st>1?Math.round((s.x+dx*st)/st)*st:s.x+dx,st>1?Math.round((s.y+dy*st)/st)*st:s.y+dy)};
  $('#l-file').onchange=e=>{before();sl[S.sel].p=e.target.value||null;saveState();render(true)};
  $('#g-on').onchange=e=>{S.gridOn=e.target.checked;remember();upd()};$('#g-sn').onchange=e=>{S.snap=e.target.checked;remember();upd()};
  $('#g-sz').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;S.gridSize=+b.dataset.n;$$('#g-sz button').forEach(x=>x.setAttribute('aria-pressed',x===b));remember();upd()};
  $('#a-go').onclick=()=>{const cc=cl(+$('#a-c').value||3,1,6),ax=+$('#a-x').value||0,ay=+$('#a-y').value||0,t=+$('#a-t').value||0;const act=sl.filter(slotF);if(!act.length)return;before();
    const F0=slotF(act[0]),fw=F0.w/frames(F0),fh=F0.h,cols=Math.min(cc,act.length),x0=Math.round((800-(cols*fw+(cols-1)*ax))/2);
    act.forEach((s,k)=>{s.x=x0+(k%cc)*(fw+ax);s.y=t+Math.floor(k/cc)*(fh+ay)});upd();saveState();toast('Botones colocados',{label:'Deshacer',fn:undo})};
  $('#l-rs').onclick=()=>{before();const old=sl.map(s=>s.p);defaultLayout();S.layout.slots.forEach((s,i)=>s.p=old[i]);saveState();render(true);toast('Posiciones restablecidas',{label:'Deshacer',fn:undo})};
}

/* ============ Exportar ============ */
function check(F){
  const u=outBytes(F),msgs=[];let b;try{b=parseBMP(u.buffer)}catch(e){return {u,ok:false,msgs:['No se puede volver a leer: '+e.message]}}
  if(b.w!==F.w||b.h!==F.h)msgs.push(`Tamaño distinto: ${b.w}×${b.h} en vez de ${F.w}×${F.h}`);
  let k=0;for(let i=0;i<b.idx.length;i++){const p=b.idx[i]*3;if(b.pal[p]===255&&b.pal[p+1]===255&&b.pal[p+2]===0)k++}
  if(F.keyCount&&!k)msgs.push('Ya no tiene zonas transparentes; el original sí las tenía.');
  if(!F.keyCount&&k)msgs.push('Ahora tiene amarillo puro, que el MediaNav muestra transparente.');
  if(F.keyCount&&k&&Math.abs(k-F.keyCount)/F.keyCount>.25)msgs.push(`La zona transparente cambia mucho (${Math.round(k*100/(F.w*F.h))} % frente a ${Math.round(F.keyCount*100/(F.w*F.h))} %).`);
  return {u,ok:!msgs.length,msgs,kind:F.rep?'Imagen nueva':'Color'};
}
let exTok=0;
const byHand=F=>!!F.rep||!empty(S.ops.file[F.path]);
const bkLabel=()=>S.demo?'imágenes de ejemplo':`«${S.bkName||S.root}» · ${S.files.length} imágenes${S.bkT?' · cargado el '+new Date(S.bkT).toLocaleDateString('es-ES'):''}`;
function scrExport(v){
  setTitle('Exportar',`<span class="lw">Mediaskin<em>hz</em></span> · ${esc(bkLabel())}`);
  const fs=S.files.filter(changed),tok=++exTok;
  if(!fs.length){v.innerHTML=`<div class="stack" style="max-width:640px;margin:0 auto"><div class="card"><h2>Todavía no hay cambios</h2><p>Cuando cambies un color o una imagen, aquí verás la lista de archivos, comprobados uno a uno, y el botón para descargar el ZIP.</p><button class="btn wide" data-go="theme">Elegir un diseño</button>${S.demo?'':'<button class="btn o wide" id="x-sel0">Preparar el USB completo (copias de seguridad y diseños listos)</button>'}</div></div>`;{const b=$('#x-sel0');if(b)b.onclick=selectorSheet}return}
  if(!S.xoff)S.xoff=new Set();const paths=new Set(fs.map(F=>F.path));for(const p of [...S.xoff])if(!paths.has(p))S.xoff.delete(p);
  const nHand=fs.filter(byHand).length,nTheme=fs.length-nHand;
  const xt=S.xtab||(S.xtab=S.demo?'uno':'usb');
  v.innerHTML=`<div class="stack xwrap">
    ${S.demo?'<p class="warnbox">Estás con las imágenes de ejemplo: lo que exportes sirve para probar, no para el coche.</p>':''}
    <div class="seg gtabs" id="x-tabs" role="tablist">${[['usb','USB completo'],['uno','Solo este diseño'],['arch',`Archivos <small id="x-tn">${fs.length}</small>`]].map(([k,l])=>`<button data-t="${k}" aria-pressed="${xt===k}">${l}</button>`).join('')}</div>
    <div class="two">
    <div class="stack" data-xp="usb"${xt==='usb'?'':' hidden'}>
      <div class="card"><p class="eyebrow">Recomendado</p><h2 style="margin:2px 0 6px">Tu USB con menú</h2>
        <p class="note">Un solo USB para todo. Al arrancar la radio con él sale un menú que manejas con el dedo:</p>
        <ul class="xfeat">
          <li><b>Diseños</b><span>Los que elijas (hasta 8) y «Original de Renault». Antes de instalar guarda una copia y, si algo falla, deja la radio como estaba.</span></li>
          <li><b>Copias de seguridad</b><span>Hacer copia de las imágenes (rápida) o de todo System, y restaurar la última.</span></li>
          <li><b>Herramientas</b><span>Informe del sistema, Total Commander y prueba de aspecto del menú.</span></li>
          <li><b>Reiniciar o volver a la radio</b><span>Sin cambiar nada.</span></li></ul>
        ${S.demo?'':`<button class="btn wide" id="x-sel">${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}Preparar el USB completo</button>`}</div>
      <div class="card" id="x-kitc2"><h3>Contenido de tu USB</h3><div id="x-kit"></div></div>
    </div>
    <div class="stack" data-xp="usb"${xt==='usb'?'':' hidden'}><div class="card"><h3>Cómo se usa</h3><ol class="steps">
      <li>Pulsa «Preparar el USB completo», elige los diseños y descarga el ZIP.</li>
      <li>Descomprímelo en la raíz del USB (acepta sobrescribir). Si guardaste el contenido de tu USB, vale un USB vacío en FAT32.</li>
      <li>Arranca la radio con el USB. A los 25 s sale el menú.</li>
      <li>Para instalar: Diseños → el que quieras. Al terminar, <b>primero ACEPTAR</b> y, cuando la pantalla se apague, saca el USB.</li>
      <li>Cancelar en el menú abre Total Commander, como siempre.</li></ol>
      <p class="note">Las copias quedan en el USB, en <code>Mediaskinhz\\copias</code>. La de imágenes se puede cargar aquí como backup (su carpeta <code>${esc(S.root)}</code>). El informe queda en <code>Mediaskinhz\\informe.txt</code>.</p></div></div>
    <div class="stack" data-xp="uno"${xt==='uno'?'':' hidden'}>
      <div class="card"><p class="eyebrow">Qué se exporta</p><p class="big-n" id="x-cnt">0</p><p id="x-cntl"></p>
      <div class="chips" id="x-q"><button class="chip" data-q="all">Todas <small>${fs.length}</small></button>${nHand&&nTheme?`<button class="chip" data-q="hand">Solo editadas a mano <small>${nHand}</small></button>`:''}<button class="chip" data-q="none">Ninguna</button></div>
      <p class="warnbox" id="x-part" hidden>Las imágenes que no exportes se quedarán como están en el coche, aunque aquí las veas cambiadas.</p>
      <div class="chk" id="x-chk"><span>Comprobando los archivos… <b id="x-n">0</b> de ${fs.length}</span></div>
      <label class="swrow" for="x-boot" id="x-bootrow"${S.xmode==='auto'?'':' hidden'}><span>Que se instale solo al arrancar<small>Al arrancar pregunta si instalar (con el dedo). Si dices que no, abre Total Commander como siempre</small></span><input class="sw" type="checkbox" id="x-boot"${SET.xboot!==false?' checked':''}></label>
      <label class="swrow" for="x-orig"><span>Incluir los originales<small>Para deshacer</small></span><input class="sw" type="checkbox" id="x-orig"${SET.xorig?' checked':''}></label>
      <button class="btn wide" id="x-go" disabled>Descargar ZIP</button>
      <details class="isd" id="x-oth"${S.xmode!=='auto'?' open':''}><summary><span>${S.xmode==='auto'?'Instalación automática con tu USB':S.xmode==='lgu'?'Como actualización oficial':'A mano con Total Commander'}<small>${S.xmode==='auto'?'Toca para ver otros modos':'Toca para cambiar el modo'}</small></span></summary><div class="isb"><div class="field"><div class="seg seg3" id="x-mode"><button data-m="tc" aria-pressed="${S.xmode!=='lgu'&&S.xmode!=='auto'}">Total Commander</button><button data-m="auto" aria-pressed="${S.xmode==='auto'}">Automático</button><button data-m="lgu" aria-pressed="${S.xmode==='lgu'}">Actualización</button></div>
        <div class="chips" id="x-hw" ${S.xmode!=='lgu'?'hidden':''}><button class="chip" data-h="2" aria-pressed="${S.xhw!==1}">MediaNav Evolution</button><button class="chip" data-h="1" aria-pressed="${S.xhw===1}">MediaNav 1.ª generación</button></div>
        <p class="note" id="x-mnote"></p></div></div></details></div></div>
    <div class="stack" data-xp="uno"${xt==='uno'?'':' hidden'}><div class="card"><h3>Cómo instalarlo</h3><div id="x-steps"></div></div></div>
    <div class="stack" data-xp="arch"${xt==='arch'?'':' hidden'} style="grid-column:1/-1"><div class="card"><h3>Archivos cambiados</h3><p class="note">Marca o desmarca los que se exportan en «Solo este diseño». El USB completo siempre lleva todos.</p><div class="fl" id="x-list"><p class="note">Comprobando…</p></div></div></div>
    </div></div>`;
  $('#x-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;S.xtab=b.dataset.t;$$('#x-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('[data-xp]',v).forEach(el=>el.hidden=el.dataset.xp!==S.xtab);scrollTo(0,0)};
  {const xs=$('#x-sel');if(xs)xs.onclick=selectorSheet}
  const R0=esc(S.root);
  const stepsHTML=()=>S.xmode==='auto'&&SET.xboot!==false?`<ol class="steps">
      <li>Descomprime el ZIP en la raíz de tu USB de siempre (el de <code>ULC2_recovery</code>, MortScript y Total Commander) y acepta sobrescribir. Cambia <code>Medianav.mscr</code> y añade la carpeta <code>Mediaskinhz</code>. Tu <code>Medianav.mscr</code> de antes queda en <code>Mediaskinhz\\Medianav-original.mscr</code>.</li>
      <li>Mete el USB y arranca la radio como haces para entrar a Total Commander.</li>
      <li>Espera unos 25 s. Saldrá «¿Hacerlo ahora?» con el nombre del diseño: pulsa <b>Sí</b> con el dedo.</li>
      <li>El script guarda en el USB lo que hay ahora en la radio, copia las imágenes y comprueba cada una. Si algo falla, deja la radio como estaba y abre Total Commander.</li>
      <li>Una ventana enseña el progreso. Al terminar sale «Instalación completada»: <b>primero pulsa Aceptar</b> y, <b>cuando la pantalla se apague</b>, saca el USB. Si sacas el USB antes de Aceptar, la pantalla se queda en negro (vuelve a meterlo y reinicia).</li>
      <li>Si la radio arranca otra vez con el USB puesto, no se reinstala: te ofrece reiniciar o abrir Total Commander.</li>
      <li>Si pulsas <b>No</b>, se abre Total Commander como siempre. Para deshacer: ⋯ → Ajustes → Exportaciones → «Deshacer en el coche», y se instala igual.</li></ol>
      <p class="note">Probado en el coche. Antes de descomprimir, guarda una copia de tu USB. Si el arranque no sale como esperas, vuelve a poner tu <code>Medianav.mscr</code> (está en <code>Mediaskinhz</code>) y todo queda como antes.</p>`:S.xmode==='auto'?`<ol class="steps">
      <li><b>Solo la primera vez:</b> copia <code>REINICIAR.exe</code> de tu USB dentro de la carpeta <code>Mediaskinhz</code> (así el script puede reiniciar la radio al terminar).</li>
      <li>Descomprime el ZIP en la raíz del USB y acepta sobrescribir. Quedará la carpeta <code>Mediaskinhz</code> con el script y las imágenes.</li>
      <li>Arranca el MediaNav con el USB y abre Total Commander. Toca una vez <code>MortScript.exe</code> (prepara la radio para abrir scripts) y después <code>Mediaskinhz\\instalar.mscr</code>.</li>
      <li>Acepta. El script guarda en el USB lo que hay ahora en la radio, copia las imágenes, comprueba cada una y, si alguna falla, deja la radio como estaba. Al acabar ofrece reiniciar.</li>
      <li>Para deshacer, toca <code>Mediaskinhz\\deshacer.mscr</code>.</li></ol>
      <p class="warnbox">Modo nuevo, todavía sin probar en el coche. La primera vez, hazlo con un cambio pequeño y ten a mano tu USB de siempre para copiar a mano si algo no va.</p>`:S.xmode!=='lgu'?`<ol class="steps">
      <li>Descomprime el ZIP en la raíz del USB con el que entras al Windows CE. Quedará la carpeta <code>${R0}</code> solo con las imágenes exportadas.</li>
      <li>Arranca el MediaNav con ese USB y abre Total Commander.</li>
      <li>Copia <code>${R0}</code> del USB encima de <code>\\Storage Card\\System\\Img\\${R0}</code> y acepta sobrescribir. Solo se sustituyen esos archivos.</li>
      <li>Reinicia el equipo.</li>
      <li>Para deshacer, copia igual <code>ORIGINALES\\${R0}</code>.</li></ol>
      <p class="note">Prueba primero con un cambio pequeño y ten a mano el backup completo y el código de la radio.</p>`:`<ol class="steps">
      <li>Descomprime el ZIP y copia <code>upgrade.lgu</code> a la raíz de un USB en FAT32. Que no haya otro <code>upgrade.lgu</code> ni tus archivos de acceso al Windows CE.</li>
      <li>Arranca el motor (para que la radio no se apague a mitad) y espera a que el MediaNav termine de encenderse.</li>
      <li>Mete el USB. El MediaNav propondrá actualizar: acepta y no toques nada hasta que se reinicie solo.</li>
      <li>Quita el USB. Si al volver a meterlo te propone otra vez la actualización, cancélala con el botón de inicio.</li>
      <li>Para deshacer, haz lo mismo con <code>RESTAURAR\\upgrade.lgu</code>: devuelve solo esas imágenes a como estaban.</li></ol>
      <p class="warnbox">Úsalo con cautela. El paquete solo lleva tus imágenes, pero el instalador del MediaNav hace más cosas: respalda, formatea y restaura la partición de ajustes, y según un análisis del instalador de la versión 7.0.5 envía siempre una orden de actualización al microcontrolador de la radio, aunque el paquete no traiga firmware. Muchos paquetes solo de imágenes se han instalado así sin problemas conocidos, pero el riesgo no es cero y no está probado en tu coche. Con Total Commander solo se copia el archivo.</p>`;
  const modeUI=()=>{$('#x-steps').innerHTML=stepsHTML();$('#x-hw').hidden=S.xmode!=='lgu';$('#x-bootrow').hidden=S.xmode!=='auto';
    $('#x-mnote').textContent=S.xmode==='auto'?'El ZIP trae un script que hace la copia en la radio por ti: guarda lo de antes, copia, comprueba y deshace si falla. Usa el MortScript que ya tienes en el USB.':S.xmode!=='lgu'?'El ZIP trae las carpetas para copiarlas a mano. Es la opción más segura: solo se sustituyen esos archivos.':'El ZIP trae un upgrade.lgu que el MediaNav instala solo, sin entrar al Windows CE.'+(S.xhw===1?' Formato LGU0 (primera generación).':' Formato ULC2 (Evolution, versiones 5 a 9).');
    const o=$('#x-orig').closest('.swrow').querySelector('small');if(o)o.textContent=S.xmode==='auto'?'Carpeta originales por si falta la copia que hace el script':S.xmode!=='lgu'?'Carpeta ORIGINALES con solo estos archivos, para deshacer':'Un segundo upgrade.lgu en RESTAURAR para deshacer'};
  modeUI();
  $('#x-boot').onchange=e=>{SET.xboot=e.target.checked;saveSet();modeUI()};
  $('#x-mode').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;S.xmode=b.dataset.m;SET.xmode=S.xmode;saveSet();render(true)};
  kitUI($('#x-kit'));
  $('#x-hw').onclick=e=>{const b=e.target.closest('[data-h]');if(!b)return;S.xhw=+b.dataset.h;$$('#x-hw .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));modeUI()};
  const res=[];let i=0,done=false;
  const sel=()=>withTwins(res.filter(r=>!S.xoff.has(r.F.path)));
  const upd=()=>{const n=done?sel().length:fs.filter(F=>!S.xoff.has(F.path)).length;$('#x-cnt').textContent=n;$('#x-cntl').textContent=n===1?'imagen marcada':'imágenes marcadas';
    const nh=fs.filter(byHand),q=S.xoff.size===0?'all':S.xoff.size===fs.length?'none':(nh.every(F=>!S.xoff.has(F.path))&&fs.every(F=>byHand(F)||S.xoff.has(F.path)))?'hand':'';
    $$('#x-q .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.q===q));$('#x-part').hidden=!(S.xoff.size&&S.xoff.size<fs.length);
    const go=$('#x-go');go.disabled=!done||!n;go.innerHTML=`${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}${n?`Descargar ZIP · ${n} ${n===1?'imagen':'imágenes'}`:'Marca al menos una imagen'}`;
    $$('#x-list [data-g]').forEach(cb=>{const arr=fs.filter(F=>catOf(F)===cb.dataset.g),on=arr.filter(F=>!S.xoff.has(F.path)).length;cb.checked=on===arr.length;cb.indeterminate=on>0&&on<arr.length;const t=cb.closest('.xgh').querySelector('small');if(t)t.textContent=`${on} de ${arr.length}`});
    $$('#x-list [data-p]').forEach(cb=>{cb.checked=!S.xoff.has(cb.dataset.p)})};
  upd();
  $('#x-q').onclick=e=>{const b=e.target.closest('[data-q]');if(!b)return;const q=b.dataset.q;S.xoff=new Set(q==='none'?fs.map(F=>F.path):q==='hand'?fs.filter(F=>!byHand(F)).map(F=>F.path):[]);upd()};
  $('#x-list').addEventListener('change',e=>{const t=e.target;if(t.dataset.p){if(t.checked)S.xoff.delete(t.dataset.p);else S.xoff.add(t.dataset.p)}
    else if(t.dataset.g){for(const F of fs)if(catOf(F)===t.dataset.g){if(t.checked)S.xoff.delete(F.path);else S.xoff.add(F.path)}}upd()});
  const stepChk=()=>{if(tok!==exTok)return;const end=Math.min(fs.length,i+20);for(;i<end;i++)res.push({F:fs[i],...check(fs[i])});const n=$('#x-n');if(n)n.textContent=i;
    if(i<fs.length){setTimeout(stepChk,0);return}
    done=true;const bad=res.filter(r=>!r.ok);$('#x-chk').innerHTML=bad.length?`<span class="warnbox">${bad.length} ${bad.length===1?'archivo tiene':'archivos tienen'} un aviso. Revísalos en la lista antes de copiarlos.</span>`:`<span class="ok">✓ ${res.length===1?'El archivo tiene':'Los '+res.length+' archivos tienen'} el mismo nombre, tamaño y formato que el original</span>`;
    const g=new Map();for(const r of res){const k=catOf(r.F);if(!g.has(k))g.set(k,[]);g.get(k).push(r)}
    const order=[...CATS.map(c=>c[0])];
    $('#x-list').innerHTML=[...g].sort((a,b)=>order.indexOf(a[0])-order.indexOf(b[0])).map(([k,arr])=>{arr.sort((a,b)=>(byHand(b.F)-byHand(a.F))||a.F.lc.localeCompare(b.F.lc));
      return `<div class="xgh"><label class="ck"><input type="checkbox" data-g="${k}"><b>${esc(CATL.get(k))}</b></label><small></small></div>${arr.map(r=>`<label class="xr" data-f="${S.files.indexOf(r.F)}"><input type="checkbox" data-p="${esc(r.F.path)}"><span class="th">${th(r.F,56,34)}</span><span class="tx"><b>${esc(pretty(r.F))}</b><small><span class="pill ${byHand(r.F)?(r.F.rep?'p-img':'p-col'):'p-orig'}">${byHand(r.F)?(r.F.rep?'Imagen nueva':'A mano'):'Por el tema'}</span><span class="mono">${esc(r.F.path)}</span></small>${r.msgs.map(m=>`<span class="m">${esc(m)}</span>`).join('')}</span></label>`).join('')}`}).join('');
    mountThumbs($('#x-list'));upd()};
  setTimeout(stepChk,30);
  $('#x-go').onclick=async e=>{const btn=e.currentTarget,rs=sel();if(!rs.length)return;btn.disabled=true;btn.textContent='Preparando el ZIP…';
    try{const inc=$('#x-orig').checked,lgu=S.xmode==='lgu',ulc2=S.xhw!==1;let ents;
      if(lgu){ents=[{name:'upgrade.lgu',data:await makeLGU(lguEntries(rs,false),ulc2,'Mediaskinhz')}];if(inc)ents.push({name:'RESTAURAR/upgrade.lgu',data:await makeLGU(lguEntries(rs,true),ulc2,'Skinhz restaurar')})}
      else if(S.xmode==='auto'){const kit=SET.xkit!==false?await usbKit():null;ents=autoEntries(rs,inc,{boot:SET.xboot!==false,name:(S.base&&S.base.name)||designName(),kit}).ents}
      else{ents=rs.map(r=>({name:S.root+'/'+r.F.path,data:r.u}));if(inc)for(const r of rs)ents.push({name:'ORIGINALES/'+S.root+'/'+r.F.path,data:new Uint8Array(r.F.buf)})}
      const d=new Date(),stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if(!S.demo){try{const dn=(S.base&&S.base.name)||designName();ents.push({name:'Mediaskinhz/diseno.mskz',data:new Uint8Array(await (await designFile({label:dn,t:Date.now(),n:S.files.filter(changed).length,st:packState(),thumb:designThumb()})).arrayBuffer())})}catch(_){}}
      ents.push({name:'LEEME.txt',data:new TextEncoder().encode(readme(rs,inc,stamp,lgu?'lgu':S.xmode==='auto'?'auto':'tc'))});const zb=await makeZip(ents),zn=`skin-medianav-${stamp}${lgu?'-actualizacion':S.xmode==='auto'?'-automatico':''}${rs.length<fs.length?'-'+rs.length+'-imagenes':''}.zip`;
      if(await saveBlob(zb,zn)){await recordExport({mode:lgu?'lgu':S.xmode==='auto'?'auto':'tc',boot:S.xmode==='auto'&&SET.xboot!==false,hw:ulc2?2:1,inc,files:rs.map(r=>r.F.path),name:zn,blob:zb,count:rs.length});if(!S.demo)setTimeout(()=>toast('Exportación guardada en el historial',{label:'Ver',fn:()=>go({n:'settings'})}),2700)}}
    catch(err){toast(err.message||'No se pudo crear el ZIP',{ms:6000})}finally{upd()}};
}
function readme(res,inc,stamp,mode){const R=S.root,lgu=mode==='lgu';const head=[`Skin MediaNav · ${stamp}`,'',`Imágenes incluidas (${res.length}):`,...res.map(r=>`  ${R}/${r.F.path}  [${r.kind}${r.ok?'':' · REVISAR: '+r.msgs.join(' ')}]`),''];
  const tc=['Instalación con Total Commander:',`1. Descomprime este ZIP en la raíz del USB. Quedará la carpeta ${R}.`,'2. Arranca el MediaNav con el USB de acceso a Windows CE y abre Total Commander.',
    `3. Copia ${R} encima de \\Storage Card\\System\\Img\\${R} y acepta sobrescribir.`,'4. Reinicia el equipo.',inc?`5. Para deshacer, copia ORIGINALES\\${R} de la misma forma.`:'5. Para deshacer, vuelve a copiar los archivos de tu backup.'];
  const up=['Instalación como actualización:','1. Copia upgrade.lgu a la raíz de un USB en FAT32 (sin otros upgrade.lgu ni archivos de acceso a Windows CE).','2. Arranca el motor y espera a que el MediaNav termine de encenderse.',
    '3. Mete el USB y acepta la actualización. No toques nada hasta que se reinicie solo.','4. Quita el USB. Si vuelve a proponer la actualización, cancélala con el botón de inicio.',inc?'5. Para deshacer, haz lo mismo con RESTAURAR\\upgrade.lgu.':'5. Para deshacer, vuelve a copiar los archivos de tu backup.',
    '','El paquete copia las imágenes en \\Storage Card\\System\\Img\\'+R+'. Aún no se ha probado en este coche: empieza con una sola imagen.','Aviso: el instalador también respalda, formatea y restaura la partición de ajustes y envía una orden al microcontrolador aunque no haya firmware. No apagues durante la instalación.'];
  const ab=['Instalación automática al arrancar con el USB:','1. Descomprime este ZIP en la raíz de tu USB de siempre (el de ULC2_recovery, MortScript y Total Commander) y acepta sobrescribir.','   Cambia Medianav.mscr; el de antes queda en Mediaskinhz\\Medianav-original.mscr.',
    '2. Mete el USB y arranca la radio como para entrar a Total Commander. A los ~25 s pregunta si instalar: pulsa Sí.','3. Guarda lo que hay en Mediaskinhz\\antes-de-instalar, copia, comprueba cada imagen y, si algo falla, deja la radio como estaba y abre Total Commander.',
    '4. Al terminar sale «Instalación completada»: PRIMERO pulsa ACEPTAR y, cuando la pantalla se apague, saca el USB.','   (Si sacas el USB antes de Aceptar, la pantalla se queda en negro: vuelve a meterlo y reinicia.)','5. Si pulsas No, abre Total Commander como siempre. Lo que ha hecho queda en Mediaskinhz\\registro.txt.','','Sin probar todavía en el coche. Si el arranque no va como esperas, vuelve a poner tu Medianav.mscr de antes.'];
  const au=['Instalación automática (MortScript):','0. Solo la primera vez: copia REINICIAR.exe de tu USB dentro de la carpeta Mediaskinhz.','1. Descomprime este ZIP en la raíz del USB y acepta sobrescribir.',
    '2. Arranca el MediaNav con el USB y abre Total Commander.','3. Toca una vez MortScript.exe (prepara la radio para abrir scripts) y después Mediaskinhz\\instalar.mscr.',
    '4. Acepta. El script guarda en Mediaskinhz\\antes-de-instalar lo que hay ahora en la radio, copia las imágenes, comprueba el tamaño de cada una y, si alguna falla, deja la radio como estaba.','5. Al terminar ofrece reiniciar. Lo que ha hecho queda en Mediaskinhz\\registro.txt.',
    '6. Para deshacer: Mediaskinhz\\deshacer.mscr.','','Modo nuevo, sin probar todavía en el coche: la primera vez, con un cambio pequeño. Si el script no arranca, puedes copiar a mano Mediaskinhz\\archivos\\'+R+' como siempre.'];
  return [...head,...(lgu?up:mode==='auto'?(SET.xboot!==false?ab:au):tc),'','Este ZIP solo contiene las imágenes listadas arriba; el resto del equipo no se toca.','Mediaskinhz\\diseno.mskz es tu diseño: arrástralo (o este ZIP entero) a Mediaskinhz en otro aparato para seguir editándolo.','Todos los BMP mantienen el nombre, el tamaño en píxeles y el formato de 8 bits del original.'].join('\r\n')}
async function saveBlob(blob,name){
  if(DL){try{await DL.save({filename:name,data:blob});toast('ZIP guardado');return true}catch(e){if(e&&e.code==='declined'){toast('Descarga cancelada');return false}if(e&&e.code==='rate_limited'){toast('Ya hay una descarga pendiente de confirmar');return false}}}
  const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  if(!DL&&window.top!==window.self)toast('Si no empieza la descarga, abre la app desde el archivo HTML.',{ms:6000});
  return true;
}

/* ============ hojas, menú y avisos ============ */
function openBS(html){const b=$('#bs');$('#toast').hidden=true;b.innerHTML=html;b.hidden=false;$('#scrim').hidden=false;document.body.classList.add('lock');const f=b.querySelector('button');f&&f.focus({preventScroll:true})}
function closeBS(){const b=$('#bs');if(b.hidden)return;b.hidden=true;$('#scrim').hidden=true;document.body.classList.remove('lock');const f=S.bsCancel;S.bsCancel=null;if(f)f()}
function openMenu(){const G=t=>`<p class="lbl" style="margin:12px 6px 4px">${t}</p>`;
  openBS(`${S.demo?'':`${G('Tu diseño')}<button class="mi" data-m="save">${ic('M5 3h11l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7')}<span>Guardar el diseño<small>Con un nombre, para volver a él cuando quieras</small></span></button>
    <button class="mi" data-m="designs">${ic('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z')}<span>Mis diseños<small>Cargar, importar, llevar a la radio</small></span></button>`}
    ${G('Backup')}<button class="mi" data-m="load">${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}<span>${S.demo?'Cargar mi backup':'Cargar otro backup'}<small>${S.demo?'Carpeta M1 o un ZIP':'Ahora: '+esc(bkLabel())}</small></span></button>
    ${updBadge()?`<button class="mi dgr" data-m="reset">${ic('M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14')}<span>Quitar todos los cambios<small>Se puede deshacer</small></span></button>`:''}
    ${S.demo?'':`<button class="mi dgr" data-m="close">${ic('M18 6L6 18M6 6l12 12')}<span>Cerrar el backup<small>Borra tu backup y tus cambios de este navegador</small></span></button>`}
    ${G('Más')}${S.demo?'':`<button class="mi" data-m="kit">${ic('M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3')}<span>Kit de prueba para el coche<small>3 imágenes para resolver dudas en la radio</small></span></button>`}
    <button class="mi" data-m="settings">${ic('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4')}<span>Ajustes<small>Exportaciones anteriores, preferencias, tema claro u oscuro</small></span></button>`);
  $('#bs').onclick=async e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;
    if(m==='load')openLoad();
    else if(m==='kit'){closeBS();makeKit()}
    else if(m==='settings'){closeBS();if(S.stab==='des')S.stab='pref';go({n:'settings'})}
    else if(m==='designs'){closeBS();S.ttab='mios';go({n:'theme'})}
    else if(m==='save'){closeBS();saveDesign()}
    else if(m==='reset'){const n=updBadge();if(!await confirmBS({title:'Quitar todos los cambios',text:`Las ${n} imágenes cambiadas volverán a ser las originales. Se guardará antes una copia automática y también podrás deshacerlo.`,ok:'Quitar los cambios',danger:true}))return;
      await addPoint('Antes de quitar todos los cambios','auto');before();S.ops={global:null,sec:{},file:{}};S.ex={};for(const F of S.files)F.rep=null;S.src=new Map();if(SET.stIcons!==false)statusIcons(true);bump();render(true);toast('Cambios quitados',{label:'Deshacer',fn:undo})}
    else if(m==='close'){if(!await confirmBS({title:'Cerrar el backup',text:'Se borran de este navegador tu backup y el diseño actual. El historial y los puntos de restauración se conservan y volverán a aparecer si cargas el mismo backup. Esto no se puede deshacer.',ok:'Cerrar el backup',danger:true,always:true}))return;
      await addPoint('Al cerrar el backup','auto');try{await idb.del('files');await idb.del('state')}catch(_){}await demo();S.stack=[];S.route={n:'home'};render();toast('Backup cerrado')}}}
function openLoad(){openBS(`<h2>Cargar tu backup</h2><p>Elige la carpeta <b>M1</b> de tu backup (en Dacia es <b>M0</b>): la que contiene <code>HOME</code>, <code>COMMON</code>, <code>MEDIA</code>… En el móvil usa un <b>ZIP</b> de esa carpeta: el iPhone no deja elegir carpetas.</p>
  <button class="btn wide" id="l-zip">${ic('M12 3v12M7 10l5 5 5-5M5 21h14')}Elegir un ZIP</button><button class="btn o wide" id="l-dir">Elegir una carpeta</button>
  <p class="note">Las imágenes no salen de tu dispositivo: se leen en el navegador y se guardan solo aquí. Un .rar no se puede abrir: descomprímelo y vuelve a comprimirlo como .zip.</p>
  ${S.demo?'':'<p class="warnbox">Cargar otro backup sustituye el actual y sus cambios. Exporta antes si quieres conservarlos.</p>'}`);
  $('#bs').onclick=null;$('#l-dir').onclick=()=>$('#in-dir').click();$('#l-zip').onclick=()=>$('#in-zip').click()}
let toastT=0;
function toast(m,o){o=o||{};const t=$('#toast');t.innerHTML=`<span>${esc(m)}</span>${o.label?`<button>${esc(o.label)}</button>`:''}`;t.hidden=false;
  if(o.label)t.querySelector('button').onclick=()=>{t.hidden=true;o.fn&&o.fn()};clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,o.ms||(o.label?5000:2600))}

/* ============ inicio ============ */
function themePref(){let v=null;try{v=localStorage.getItem('skinhz-theme')}catch(_){}if(v)document.documentElement.dataset.theme=v}
function bind(){
  $('#bnav').innerHTML=navHTML();$('#tnav').innerHTML=navHTML();
  const nav=e=>{const b=e.target.closest('[data-r]');if(b)go({n:b.dataset.r})};$('#bnav').onclick=nav;$('#tnav').onclick=nav;
  $('#ab-back').onclick=back;$('#ab-undo').onclick=undo;$('#ab-more').onclick=openMenu;$('#scrim').onclick=()=>{if(Date.now()-(S.lpT||0)<800)return;closeBS()};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#bs').hidden)closeBS();else if(!ROOTN.has(S.route.n))back()}if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!/INPUT|SELECT/.test(document.activeElement.tagName)){e.preventDefault();undo()}
    // Ctrl+S: guardar el diseño con nombre (en vez de guardar la página)
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();if(!S.demo&&$('#bs').hidden)saveDesign()}});
  // Con ratón o panel táctil, la rueda mueve también las filas que se desplazan de lado
  document.addEventListener('wheel',e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const el=e.target.closest&&e.target.closest('.hs,.strip,.hsw .swg,.chips.scroll');
    if(!el||el.scrollWidth<=el.clientWidth+2)return;const before=el.scrollLeft;el.scrollLeft+=e.deltaY;if(el.scrollLeft!==before)e.preventDefault()},{passive:false});
  $('#view').addEventListener('click',e=>{const t=e.target;
    const ed=t.closest('[data-edit]');if(ed){const F=S.files[+ed.dataset.f];if(F){if(isBtnLike(F))btnSheet(F);else go({n:'edit',p:F.path})}return}
    const g=t.closest('[data-go]');if(g){go({n:g.dataset.go});return}
    const c=t.closest('[data-cat]');if(c){S.sec=c.dataset.sec||'all';S.kind='all';S.onlyCh=false;if(c.dataset.cat!=='*'){S.cat=c.dataset.cat;remember()}go({n:'cat',c:c.dataset.cat});return}
    const a=t.closest('[data-act]');if(a&&a.dataset.act==='load')openLoad();if(a&&a.dataset.act==='kit')makeKit();if(a&&a.dataset.act==='designs'){S.ttab='mios';go({n:'theme'})}if(a&&a.dataset.act==='listos'){S.ttab='listos';go({n:'theme'})}});
  $('#in-dir').onchange=e=>{fromFileList(e.target.files);e.target.value=''};$('#in-zip').onchange=e=>{fromFileList(e.target.files);e.target.value=''};
  let dc=0;const da=$('#dropall');
  addEventListener('dragenter',e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')&&S.route.n!=='edit'){dc++;da.hidden=false}});
  addEventListener('dragleave',()=>{if(--dc<=0){dc=0;da.hidden=true}});
  addEventListener('dragover',e=>e.preventDefault());
  addEventListener('drop',async e=>{e.preventDefault();dc=0;da.hidden=true;if(S.route.n==='edit')return;const dt=e.dataTransfer;if(!dt)return;
    const items=[...(dt.items||[])].map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean);
    if(items.some(en=>en.isDirectory)){const out=[];for(const en of items)await walkEntry(en,out);fromFileList(out)}else fromFileList(dt.files)});
  let rz=0;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(S.route.n==='edit'&&S.eview==='img')drawEdit(S.curF)},150)});
}
async function boot(){themePref();bind();recall();loadSet();webInit();await myLoad().catch(()=>{});let ok=false;
  try{const fl=await idb.get('files');if(fl&&fl.list&&fl.list.length&&await ingest(fl.list,{restore:true,png:fl.png,name:fl.name,t:fl.t})){applyState(await idb.get('state'));loadVistas().then(()=>{if(syncScreenTints()){bump();toast('Diseño puesto al día: el color de cada pantalla llega ya a sus listas y fondos')}}).catch(()=>{});await recallBase();ok=true}}catch(_){}
  if(!ok)await demo();render()}
boot();
