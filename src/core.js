/* ============ núcleo: BMP, color, cuantización, ZIP (sin dependencias) ============ */
const KEYC=[255,255,0];
const isKey=(r,g,b)=>r===255&&g===255&&b===0;
function parseBMP(buf){
  const dv=new DataView(buf),u=new Uint8Array(buf);
  if(buf.byteLength<54||dv.getUint16(0,true)!==0x4D42) throw new Error('no es un BMP');
  const off=dv.getUint32(10,true),hs=dv.getUint32(14,true),w=dv.getInt32(18,true),hr=dv.getInt32(22,true);
  const bpp=dv.getUint16(28,true),comp=dv.getUint32(30,true),clr=hs>=40?dv.getUint32(46,true):0;
  if(bpp!==8||comp!==0) throw new Error('BMP de '+bpp+' bits, no compatible');
  const h=Math.abs(hr),top=hr<0,stride=(w+3)&~3,palOff=14+hs;
  let n=clr||256; n=Math.min(n,Math.floor((off-palOff)/4));
  if(off+stride*(h-1)+w>buf.byteLength) throw new Error('archivo incompleto');
  const pal=new Uint8Array(n*3);
  for(let i=0;i<n;i++){pal[i*3]=u[palOff+i*4+2];pal[i*3+1]=u[palOff+i*4+1];pal[i*3+2]=u[palOff+i*4]}
  const idx=new Uint8Array(w*h);
  for(let y=0;y<h;y++){const s=off+(top?y:h-1-y)*stride;idx.set(u.subarray(s,s+w),y*w)}
  return {w,h,top,n,palOff,pal,idx,xppm:dv.getInt32(38,true),yppm:dv.getInt32(42,true)};
}
function encodeBMP8(w,h,idx,pal,meta){
  const stride=(w+3)&~3,off=54+1024,size=off+stride*h,b=new ArrayBuffer(size),dv=new DataView(b),u=new Uint8Array(b);
  u[0]=66;u[1]=77;dv.setUint32(2,size,true);dv.setUint32(10,off,true);dv.setUint32(14,40,true);dv.setInt32(18,w,true);dv.setInt32(22,meta&&meta.top?-h:h,true);
  dv.setUint16(26,1,true);dv.setUint16(28,8,true);dv.setUint32(30,0,true);dv.setUint32(34,stride*h,true);
  dv.setInt32(38,(meta&&meta.xppm)||2835,true);dv.setInt32(42,(meta&&meta.yppm)||2835,true);dv.setUint32(46,0,true);dv.setUint32(50,0,true);
  for(let i=0;i<256;i++){u[54+i*4]=pal[i*3+2]|0;u[55+i*4]=pal[i*3+1]|0;u[56+i*4]=pal[i*3]|0}
  for(let y=0;y<h;y++)u.set(idx.subarray(y*w,y*w+w),off+(meta&&meta.top?y:h-1-y)*stride);
  return b;
}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
function hsl2rgb(h,s,l){h=(((h%360)+360)%360)/360;if(s<=0){const v=Math.round(l*255);return [v,v,v]}
  const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};
  return [f(h+1/3),f(h),f(h-1/3)].map(v=>Math.round(v*255))}
const cl=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const defOps=()=>({h:0,s:0,l:0,tH:155,tA:0,tG:false});
const isId=o=>!o||(!o.h&&!o.s&&!o.l&&!o.tA);
function applyOps(c,o){
  let [r,g,b]=c;
  if(o.tA){const [,s,l]=rgb2hsl(r,g,b),a=o.tA/100,t=hsl2rgb(o.tH,o.tG?Math.max(s,.5):s,l);
    r=Math.round(r+(t[0]-r)*a);g=Math.round(g+(t[1]-g)*a);b=Math.round(b+(t[2]-b)*a)}
  if(o.h||o.s||o.l){let [h,s,l]=rgb2hsl(r,g,b);h+=o.h;s=cl(s*(1+o.s/100));l=o.l>0?l+(1-l)*o.l/100:l*(1+o.l/100);[r,g,b]=hsl2rgb(h,s,cl(l))}
  return [r,g,b];
}
/* Cuantización: median cut sobre histograma de 15 bits; el amarillo clave se reserva en el índice 1 */
function quantize(d,w,h,opt){
  const N=w*h,key=opt.key,cnt=new Uint32Array(32768),sr=new Float64Array(32768),sg=new Float64Array(32768),sb=new Float64Array(32768);
  for(let i=0;i<N;i++){if(key&&key[i])continue;const r=d[i*4],g=d[i*4+1],b=d[i*4+2],k=(r>>3)<<10|(g>>3)<<5|(b>>3);cnt[k]++;sr[k]+=r;sg[k]+=g;sb[k]+=b}
  const cols=[];for(let k=0;k<32768;k++)if(cnt[k])cols.push(k);
  const ch=(k,c)=>c===0?k>>10:c===1?(k>>5)&31:k&31;
  const info=bx=>{let a0=31,a1=31,a2=31,b0=0,b1=0,b2=0,n=0;for(const k of bx){const x=k>>10,y=(k>>5)&31,z=k&31;if(x<a0)a0=x;if(x>b0)b0=x;if(y<a1)a1=y;if(y>b1)b1=y;if(z<a2)a2=z;if(z>b2)b2=z;n+=cnt[k]}
    const R=[b0-a0,b1-a1,b2-a2],c=R[0]>=R[1]&&R[0]>=R[2]?0:R[1]>=R[2]?1:2;return {c,r:R[c],n}};
  const MAX=255;let boxes;
  if(cols.length<=MAX)boxes=cols.map(k=>[k]);
  else{boxes=[cols];const inf=[info(cols)];
    while(boxes.length<MAX){let bi=-1,best=0;for(let j=0;j<boxes.length;j++){if(boxes[j].length<2)continue;const sc=inf[j].r*Math.sqrt(inf[j].n);if(sc>best){best=sc;bi=j}}
      if(bi<0)break;const bx=boxes[bi],c=inf[bi].c;bx.sort((x,y)=>ch(x,c)-ch(y,c));
      let half=inf[bi].n/2,acc=0,m=0;for(;m<bx.length-2;m++){acc+=cnt[bx[m]];if(acc>=half)break}
      const A=bx.slice(0,m+1),B=bx.slice(m+1);boxes.splice(bi,1,A,B);inf.splice(bi,1,info(A),info(B))}}
  const pal=new Uint8Array(768),keyIdx=1;pal[3]=255;pal[4]=255;pal[5]=0;
  const slots=[];for(let i=0;i<256;i++)if(i!==keyIdx)slots.push(i);
  const used=[];
  boxes.forEach((bx,j)=>{let n=0,r=0,g=0,b=0;for(const k of bx){n+=cnt[k];r+=sr[k];g+=sg[k];b+=sb[k]}
    let c=[Math.round(r/n),Math.round(g/n),Math.round(b/n)];if(isKey(...c))c=[254,255,0];const s=slots[j];pal.set(c,s*3);used.push(s)});
  if(!used.length){used.push(0)}
  const cache=new Int16Array(32768).fill(-1);
  const near=(r,g,b)=>{const k=(r>>3)<<10|(g>>3)<<5|(b>>3);let v=cache[k];if(v>=0)return v;let bd=1e9;
    for(const s of used){const dr=pal[s*3]-r,dg=pal[s*3+1]-g,db=pal[s*3+2]-b,dd=dr*dr*3+dg*dg*4+db*db*2;if(dd<bd){bd=dd;v=s}}cache[k]=v;return v};
  const idx=new Uint8Array(N);
  if(!opt.dither){for(let i=0;i<N;i++)idx[i]=key&&key[i]?keyIdx:near(d[i*4],d[i*4+1],d[i*4+2])}
  else{const e=new Float32Array(N*3);for(let i=0;i<N;i++){e[i*3]=d[i*4];e[i*3+1]=d[i*4+1];e[i*3+2]=d[i*4+2]}
    const add=(x,y,er,eg,eb,f)=>{if(x<0||x>=w||y>=h)return;const j=y*w+x;if(key&&key[j])return;e[j*3]+=er*f;e[j*3+1]+=eg*f;e[j*3+2]+=eb*f};
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(key&&key[i]){idx[i]=keyIdx;continue}
      const r=cl(Math.round(e[i*3]),0,255),g=cl(Math.round(e[i*3+1]),0,255),b=cl(Math.round(e[i*3+2]),0,255),p=near(r,g,b);idx[i]=p;
      const er=r-pal[p*3],eg=g-pal[p*3+1],eb=b-pal[p*3+2];add(x+1,y,er,eg,eb,7/16);add(x-1,y+1,er,eg,eb,3/16);add(x,y+1,er,eg,eb,5/16);add(x+1,y+1,er,eg,eb,1/16)}}
  return {pal,idx,keyIdx};
}
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
async function streamBytes(u,ts){return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(ts)).arrayBuffer())}
async function makeZip(entries){
  const enc=new TextEncoder(),parts=[],cd=[];let off=0,cds=0;const d=new Date();
  const tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  for(const e of entries){const nm=enc.encode(e.name),crc=crc32(e.data);let comp=null,m=8;
    if(typeof CompressionStream!=='undefined'){try{comp=await streamBytes(e.data,new CompressionStream('deflate-raw'))}catch(_){comp=null}}
    if(!comp||comp.length>=e.data.length){comp=e.data;m=0}
    const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x800,true);lh.setUint16(8,m,true);lh.setUint16(10,tm,true);lh.setUint16(12,dt,true);
    lh.setUint32(14,crc,true);lh.setUint32(18,comp.length,true);lh.setUint32(22,e.data.length,true);lh.setUint16(26,nm.length,true);
    parts.push(lh.buffer,nm,comp);
    const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(10,m,true);c.setUint16(12,tm,true);c.setUint16(14,dt,true);
    c.setUint32(16,crc,true);c.setUint32(20,comp.length,true);c.setUint32(24,e.data.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
    cd.push(c.buffer,nm);cds+=46+nm.length;off+=30+nm.length+comp.length}
  const eo=new DataView(new ArrayBuffer(22));eo.setUint32(0,0x06054b50,true);eo.setUint16(8,entries.length,true);eo.setUint16(10,entries.length,true);eo.setUint32(12,cds,true);eo.setUint32(16,off,true);
  return new Blob([...parts,...cd,eo.buffer],{type:'application/zip'});
}
async function readZip(buf,want){
  const dv=new DataView(buf),u=new Uint8Array(buf);let eo=-1;
  for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-65600);i--)if(dv.getUint32(i,true)===0x06054b50){eo=i;break}
  if(eo<0)throw new Error('El archivo no parece un ZIP válido');
  const n=dv.getUint16(eo+10,true);let p=dv.getUint32(eo+16,true);const out=[];const u8d=new TextDecoder('utf-8',{fatal:true}),l1=new TextDecoder('latin1');
  for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;
    const fl=dv.getUint16(p+8,true),m=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl2=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    const nb=u.subarray(p+46,p+46+nl);let name;try{name=(fl&0x800)?new TextDecoder().decode(nb):u8d.decode(nb)}catch(_){name=l1.decode(nb)}
    p+=46+nl+el+cl2;
    if(name.endsWith('/')||!want(name))continue;
    if(fl&1)throw new Error('El ZIP tiene contraseña: guárdalo sin cifrar');
    const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),raw=u.subarray(ds,ds+cs);let data;
    if(m===0)data=raw.slice();else if(m===8){if(typeof DecompressionStream==='undefined')throw new Error('Este navegador no descomprime ZIP: elige la carpeta');data=await streamBytes(raw,new DecompressionStream('deflate-raw'))}
    else throw new Error('Compresión de ZIP no compatible (usa la normal, «Deflate»)');
    out.push({path:name,buf:data.buffer.byteLength===data.length?data.buffer:data.slice().buffer})}
  return out;
}

