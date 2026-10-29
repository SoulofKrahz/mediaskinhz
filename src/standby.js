
/* ============ pantalla de reposo (la negra con el reloj) ============
   La radio dibuja el reloj (etc/etc_clock_font.bmp) y la temperatura encima de common/etc_bg.bmp. Aquí se escribe en ese fondo
   un texto propio (tu nombre, el coche…), dejando libre el sitio del reloj. El texto se mezcla con la imagen original y el tema
   de la radio se sigue aplicando encima. Ese fondo también sale detrás del código de la radio y de algunos avisos. */
const STBF='common/etc_bg.bmp';
const STFONTS=[['Inter','600 {s}px Inter, sans-serif','Moderna'],['serif','600 {s}px Newsreader, Georgia, serif','Clásica'],['radio','bold {s}px Tahoma, Verdana, sans-serif','Como la radio'],['black','900 {s}px "Arial Black", Impact, sans-serif','Gruesa'],['mono','bold {s}px "Courier New", monospace','Máquina']];
const STCLK=['etc/etc_clock_font.bmp','etc/etc_clock_font_colon.bmp','etc/etc_clock_font_ampm.bmp'];
const STPOS=[['top','Arriba'],['above','Sobre el reloj'],['below','Bajo el reloj'],['bottom','Abajo']];
const stDef=()=>({l1:'',l2:'',font:'Inter',size:36,hue:'white',pos:'below',glow:true,caps:false,sp:2,logo:null,lsz:110,lcol:'orig'});
// Logo propio (PNG o JPG que subes tú): va encima del texto, en el mismo bloque. Se guarda reducido (máx. 420 px) dentro del diseño
const STIMG=new Map();function stImg(u,redo){if(!u)return null;let i=STIMG.get(u);if(!i){i=new Image();i.onload=()=>redo&&redo();i.src=u;STIMG.set(u,i)}return i.complete&&i.naturalWidth?i:null}
const stCol=h=>h==='white'?'#ffffff':`hsl(${h} 85% 62%)`;
// Escribe las dos líneas en un lienzo de 800×480. El reloj ocupa más o menos y = 197…282
function stDraw(x,st,redo){const l1=(st.caps?st.l1.toUpperCase():st.l1).trim(),l2=(st.caps?st.l2.toUpperCase():st.l2).trim(),im=stImg(st.logo,redo);if(!l1&&!l2&&!im)return;
  // el bloque (logo + texto) no pisa el reloj (y ≈ 197…282): si no cabe, el logo se hace más pequeño
  const tH=(l1?st.size:0)+(l2?Math.round(st.size*.6):0)+(l1&&l2?Math.round(st.size*.28):0),room=(st.pos==='top'||st.pos==='above'?128:178)-tH-(im&&(l1||l2)?Math.round((st.lsz||110)*.14):0);
  const lh=im?Math.round(Math.max(28,Math.min(st.lsz||110,room))):0,lw=im?Math.round(im.naturalWidth*lh/im.naturalHeight):0,lg=im&&(l1||l2)?Math.round((st.lsz||110)*.14):0;
  const f=(STFONTS.find(q=>q[0]===st.font)||STFONTS[0])[1],s1=st.size,s2=Math.round(st.size*.6),gap=Math.round(st.size*.28),H=(l1?s1:0)+(l2?s2:0)+(l1&&l2?gap:0)+lh+lg;
  const top=Math.max(64,Math.min(470-H,{top:Math.max(64,118-H/2),above:176-H,below:300,bottom:Math.min(458-H,412-H/2)}[st.pos]??300));
  x.save();x.textAlign='center';x.textBaseline='top';x.fillStyle=stCol(st.hue);if('letterSpacing' in x)x.letterSpacing=(st.sp||0)+'px';
  if(st.glow){x.shadowColor=stCol(st.hue);x.shadowBlur=Math.round(st.size*.45)}
  let y=top;if(im){x.save();x.shadowBlur=0;const w=Math.min(lw,760),h=Math.round(lh*w/lw);if(st.lcol==='orig')x.drawImage(im,400-w/2,y,w,h);else{const t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');tx.drawImage(im,0,0,w,h);tx.globalCompositeOperation='source-in';tx.fillStyle=stCol(st.hue);tx.fillRect(0,0,w,h);x.drawImage(t,400-w/2,y)}x.restore();y+=h+lg}
  if(l1){x.font=f.replace('{s}',s1);x.fillText(l1,400,y,760);y+=s1+gap}
  if(l2){x.font=f.replace('{s}',s2);x.globalAlpha=.85;x.fillText(l2,400,y,760)}x.restore()}
let stT=0;
function stApply(st,now){clearTimeout(stT);const run=()=>{const F=byName(STBF);if(!F)return;
  if(!st||!(st.l1.trim()||st.l2.trim()||st.logo)){S.stby=st&&{...st,clk:S.stby&&S.stby.clk};if(F.rep&&F.rep.by==='stby'){F.rep=null;if(S.ex[F.path]===false)delete S.ex[F.path]}F.cv=null;bump();return}
  S.stby={...st,clk:S.stby&&S.stby.clk};const c=document.createElement('canvas');c.width=F.w;c.height=F.h;const x=c.getContext('2d');x.drawImage(renderOrig(F,false),0,0);if(st.logo&&!stImg(st.logo,()=>stApply(st,true)))return;stDraw(x,st);
  const d=x.getImageData(0,0,F.w,F.h).data,q=quantize(d,F.w,F.h,{key:new Uint8Array(F.w*F.h),dither:true});
  F.rep={pal:q.pal,idx:q.idx,keyIdx:q.keyIdx,by:'stby'};S.ex[F.path]=false;F.cv=null;bump()};if(now)run();else stT=setTimeout(run,320)}
// Vista previa: el fondo como quedará y, encima, el reloj con la hora de ahora (la radio lo dibuja con su propia letra)
function drawStandby(c,orig){const x=c.getContext('2d'),F=byName(STBF);x.fillStyle='#000';x.fillRect(0,0,800,480);if(!F)return;
  x.drawImage(orig?renderOrig(F,false):renderCanvas(F,false),0,0,800,480);
  const fn=byName('etc/etc_clock_font.bmp'),co=byName('etc/etc_clock_font_colon.bmp'),d=new Date(),t=String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0');
  if(fn){const gw=fn.w/10,gh=fn.h,cw=co?co.w:25,W=gw*4+cw,x0=Math.round(400-W/2),y0=Math.round(240-gh/2),src=renderCanvas(fn,false);
    [...t].forEach((ch,i)=>x.drawImage(src,+ch*gw,0,gw,gh,x0+i*gw+(i>1?cw:0),y0,gw,gh));if(co)x.drawImage(renderCanvas(co,false),x0+gw*2,y0)}
  x.save();x.font='600 17px Tahoma, Inter, sans-serif';x.fillStyle='#fff';x.textAlign='center';x.fillText('16°C',740,48);x.restore()}
function scrStandby(v){const F=byName(STBF);setTitle('Pantalla de reposo','La negra con el reloj');
  if(!F){v.innerHTML='<p class="empty">Este backup no tiene el fondo de la pantalla de reposo (COMMON/ETC_BG.BMP).</p>';return}
  const st={...stDef(),...(S.stby||{})};delete st.clk;
  v.innerHTML=`<div class="two"><div class="stick sticky-pv">${pvBlock('pv')}<div class="e-bar"><div class="seg" id="st-cmp" role="group" aria-label="Comparar"><button data-v="now" aria-pressed="true">Ahora</button><button data-v="orig" aria-pressed="false">Original</button></div><span class="sp"></span><span class="hint" style="padding:0">El reloj y la temperatura los pone la radio</span></div></div>
    <div class="stack"><div class="card"><h3>Tu texto</h3>
      <label class="field"><span class="lbl">Línea principal</span><input class="ipq" id="st-l1" maxlength="28" placeholder="Tu nombre" value="${esc(st.l1)}" autocomplete="off"></label>
      <label class="field"><span class="lbl">Segunda línea</span><input class="ipq" id="st-l2" maxlength="40" placeholder="Renault Clio IV Limited" value="${esc(st.l2)}" autocomplete="off"></label>
      <p class="lbl">Dónde</p><div class="chips" id="st-pos">${STPOS.map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${st.pos===k}">${l}</button>`).join('')}</div>
      <p class="lbl">Letra</p><div class="chips" id="st-font">${STFONTS.map(([k,,l])=>`<button class="chip" data-v="${k}" aria-pressed="${st.font===k}">${l}</button>`).join('')}</div>
      <label class="field"><span class="lbl">Tamaño <b id="st-szv">${st.size}</b></span><input type="range" id="st-sz" min="20" max="64" step="1" value="${st.size}"></label>
      <p class="lbl">Color</p><div class="hsw" id="st-col">${swatches(st.hue,{white:true,label:'Color del texto'})}</div>
      <label class="swrow" for="st-glow"><span>Brillo alrededor</span><input class="sw" type="checkbox" id="st-glow"${st.glow?' checked':''}></label>
      <label class="swrow" for="st-caps"><span>En mayúsculas</span><input class="sw" type="checkbox" id="st-caps"${st.caps?' checked':''}></label>
      <button class="btn o wide" id="st-del">Quitar el texto</button></div>
      <div class="card"><h3>Tu logo</h3><p class="note">Una imagen tuya (PNG con fondo transparente, mejor), encima del texto. Por ejemplo el logo de tu marca o uno que hayas hecho tú.</p>
        <div class="stack" style="gap:8px"><button class="btn o wide" id="st-lup">${st.logo?'Cambiar el logo':'Subir un logo'}</button>${st.logo?'<button class="btn o wide" id="st-ldel">Quitar el logo</button>':''}</div>
        ${st.logo?`<label class="field"><span class="lbl">Tamaño <b id="st-lszv">${st.lsz||110}</b></span><input type="range" id="st-lsz" min="40" max="220" step="2" value="${st.lsz||110}"></label>
        <p class="lbl">Color del logo</p><div class="chips" id="st-lcol"><button class="chip" data-v="orig" aria-pressed="${st.lcol!=='text'}">Sus colores</button><button class="chip" data-v="text" aria-pressed="${st.lcol==='text'}">Del color del texto</button></div>`:''}</div>
      <div class="card"><h3>Color del reloj</h3><div class="hsw" id="st-clk">${swatches(S.stby&&S.stby.clk!=null?S.stby.clk:'none',{none:'Blanco (original)',label:'Color del reloj'})}</div>
      <p class="note">Tiñe los números, los dos puntos y el AM/PM del reloj de reposo (son imágenes de la radio: ETC/etc_clock_font…). El reloj pequeño de la barra de arriba está en Común → Barra de arriba.</p>
      <p class="note">Se guarda en la imagen del fondo de reposo y sale en la exportación como cualquier otra. Ese mismo fondo aparece detrás de la pantalla del código de la radio y de algunos avisos.</p></div>
      <div class="card"><h3>El fondo</h3><div class="list">${fileRow(F,'Fondo de reposo · 800×480')}</div><p class="note">Tócalo para cambiar sus colores o sustituirlo por una foto; el texto se mantiene encima.</p></div></div></div>`;
  const c=$('#pv');let orig=false;const draw=()=>drawStandby(c,orig);S.live=draw;draw();
  const cur=()=>({...st,l1:$('#st-l1').value,l2:$('#st-l2').value});let first=true;
  const upd=(now)=>{if(first){before();first=false}Object.assign(st,cur());stApply(st,now)};
  $('#st-l1').oninput=$('#st-l2').oninput=()=>upd();
  const chips=(id,key)=>{$(id).onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;st[key]=b.dataset.v;$$(id+' .chip').forEach(q=>q.setAttribute('aria-pressed',q===b));upd(true)}};chips('#st-pos','pos');chips('#st-font','font');
  $('#st-sz').oninput=e=>{st.size=+e.target.value;$('#st-szv').textContent=st.size;upd()};
  const sw=$('#st-col .swg');sw.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;sw.querySelectorAll('.swc').forEach(q=>q.setAttribute('aria-pressed',q===b));st.hue=b.dataset.h==='white'?'white':+b.dataset.h;upd(true)};
  sw.querySelector('[data-pick]').onchange=e=>{st.hue=Math.round(hexHsl(e.target.value)[0]);upd(true)};
  $('#st-glow').onchange=e=>{st.glow=e.target.checked;upd(true)};$('#st-caps').onchange=e=>{st.caps=e.target.checked;upd(true)};
  $('#st-lup').onclick=()=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=async()=>{const f=i.files[0];if(!f)return;try{const bm=await createImageBitmap(f),k=Math.min(1,420/Math.max(bm.width,bm.height)),c2=document.createElement('canvas');c2.width=Math.round(bm.width*k);c2.height=Math.round(bm.height*k);c2.getContext('2d').drawImage(bm,0,0,c2.width,c2.height);
    if(first){before();first=false}Object.assign(st,cur(),{logo:c2.toDataURL('image/png')});stApply(st,true);render(true)}catch(_){toast('No se ha podido abrir esa imagen')}};i.click()};
  const ld=$('#st-ldel');if(ld)ld.onclick=()=>{before();Object.assign(st,cur(),{logo:null});stApply(st,true);render(true);toast('Logo quitado',{label:'Deshacer',fn:undo})};
  const ls=$('#st-lsz');if(ls)ls.oninput=e=>{st.lsz=+e.target.value;$('#st-lszv').textContent=st.lsz;upd()};
  const lc=$('#st-lcol');if(lc)chips('#st-lcol','lcol');
  $('#st-del').onclick=()=>{before();$('#st-l1').value='';$('#st-l2').value='';st.l1='';st.l2='';stApply(st,true);toast('Texto quitado',{label:'Deshacer',fn:undo})};
  const setClk=h=>{before();for(const n of STCLK){const G=byName(n);if(G)btnTintOps(G,h)}S.stby={...(S.stby||stDef()),clk:h};bump();toast(h==null?'Reloj en blanco original':'Color del reloj cambiado',{label:'Deshacer',fn:undo})};
  const ck=$('#st-clk .swg');ck.onclick=e=>{const b=e.target.closest('button[data-h]');if(!b)return;ck.querySelectorAll('.swc').forEach(q=>q.setAttribute('aria-pressed',q===b));setClk(b.dataset.h==='none'?null:+b.dataset.h)};
  ck.querySelector('[data-pick]').onchange=e=>setClk(Math.round(hexHsl(e.target.value)[0]));
  $('#st-cmp').onclick=e=>{const b=e.target.closest('button');if(!b)return;orig=b.dataset.v==='orig';$$('#st-cmp button').forEach(q=>q.setAttribute('aria-pressed',q===b));draw()}}
