
/* ============ instalación automática con MortScript ============
   El ZIP lleva la carpeta Mediaskinhz/ para la raíz del USB:
     instalar.mscr · deshacer.mscr · archivos/<M1>/… (las imágenes nuevas) · originales/<M1>/… (las del backup)
   instalar.mscr: comprueba la carpeta de la radio, copia lo que hay ahora en la radio a antes-de-instalar/,
   copia las imágenes, comprueba el tamaño de cada una y, si alguna falla, devuelve la radio a como estaba.
   deshacer.mscr: vuelve a poner antes-de-instalar/ (o, si falta, originales/).
   MortScript solo lee scripts en ANSI (manual: «plain text, no Unicode!»), así que se escriben en Windows-1252.
   Sin probar todavía en el coche: sintaxis según el manual de MortScript 4. */
const ansi=s=>{s=s.replace(/\r?\n/g,'\r\n').replace(/…/g,'...').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
  const o=new Uint8Array(s.length);for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);o[i]=c<256?c:63}return o};
const winP=p=>p.replace(/\//g,'\\');
function dirsOf(paths){const out=[],seen=new Set();for(const p of paths){const parts=p.split('/');parts.pop();let acc='';for(const x of parts){acc=acc?acc+'\\'+x:x;if(!seen.has(acc)){seen.add(acc);out.push(acc)}}}return out}
// Una cadena de MortScript no puede llevar comillas dobles
const qs=s=>'"'+String(s).replace(/"/g,"'")+'"';

function mortInstall(R,items,id,when){
  const n=items.length,P=items.map(x=>winP(x.path)),D=dirsOf(items.map(x=>x.path));
  const L=[];const w=s=>L.push(s);
  w(`# Mediaskinhz · instalador automático · paquete ${id}`);
  w(`# Copia ${n} ${n===1?'imagen':'imágenes'} en \\Storage Card\\System\\Img\\${R}. Generado el ${when}.`);
  w('# Ábrelo desde Total Commander en la radio (antes, toca una vez MortScript.exe para que los .mscr se abran con él).');
  w('ErrorLevel( "off" )');
  w('base = SystemPath( "ScriptPath" )');
  w(`dst = "\\Storage Card\\System\\Img\\${R}"`);
  w(`nuevo = base \\ "archivos\\${R}"`);
  w('antes = base \\ "antes-de-instalar"');
  w('reg = base \\ "registro.txt"');
  w(`marca = base \\ "instalado-${id}.txt"`);
  w('If ( not DirExists( dst ) )');
  w('  Message( "No encuentro la carpeta de imágenes de la radio:^NL^" & dst & "^NL^^NL^No se ha tocado nada.", "Mediaskinhz" )');
  w('  Exit');
  w('EndIf');
  w(`If ( not FileExists( nuevo \\ ${qs(P[0])} ) )`);
  w('  Message( "Faltan las imágenes nuevas junto al script (carpeta archivos). Descomprime el ZIP entero en el USB.^NL^^NL^No se ha tocado nada.", "Mediaskinhz" )');
  w('  Exit');
  w('EndIf');
  w('repetido = FileExists( marca )');
  w('If ( repetido )');
  w(`  If ( not Question( "Este paquete ya se instaló.^NL^^NL^¿Copiar otra vez las ${n} imágenes? La copia de seguridad de antes no se toca.", "Mediaskinhz", "YesNo" ) )`);
  w('    Exit');
  w('  EndIf');
  w('Else');
  w(`  If ( not Question( "Se van a copiar ${n} ${n===1?'imagen':'imágenes'} de Mediaskinhz en la radio.^NL^^NL^Antes se guarda en el USB lo que hay ahora, y si algo falla se deja todo como estaba.^NL^^NL^¿Seguir?", "Mediaskinhz", "YesNo" ) )`);
  w('    Exit');
  w('  EndIf');
  w('EndIf');
  w(`WriteFile( reg, "=== " & FormatTime( "d/m/Y H:i:s" ) & " · instalar paquete ${id} (${n} imágenes)^NL^", 1 )`);
  w('# 1. Copia de seguridad de lo que hay ahora en la radio');
  w('If ( not repetido )');
  w('  MkDir( antes )');
  w(`  MkDir( antes \\ "${R}" )`);
  for(const d of D)w(`  MkDir( antes \\ ${qs(R+'\\'+d)} )`);
  w('  fallos = 0');
  for(const p of P){w(`  If ( FileExists( dst \\ ${qs(p)} ) )`);w(`    Copy( dst \\ ${qs(p)}, antes \\ ${qs(R+'\\'+p)}, 1 )`);
    w(`    If ( FileSize( antes \\ ${qs(R+'\\'+p)} ) <> FileSize( dst \\ ${qs(p)} ) )`);w('      fallos = fallos + 1');w(`      WriteFile( reg, "No se pudo copiar a la copia de seguridad: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('    EndIf');w('  EndIf')}
  w('  If ( fallos > 0 )');
  w('    WriteFile( reg, "Cancelado: la copia de seguridad falló. No se ha tocado la radio.^NL^", 1 )');
  w('    Message( "No he podido guardar la copia de seguridad de " & fallos & " archivos (¿USB lleno o protegido?).^NL^^NL^No se ha tocado la radio.", "Mediaskinhz" )');
  w('    Exit');
  w('  EndIf');
  w('EndIf');
  w('# 2. Copiar las imágenes nuevas y comprobar cada una');
  w('fallos = 0');
  for(const [i,p] of P.entries()){w(`Copy( nuevo \\ ${qs(p)}, dst \\ ${qs(p)}, 1 )`);w(`If ( FileSize( dst \\ ${qs(p)} ) <> ${items[i].size} )`);w('  fallos = fallos + 1');w(`  WriteFile( reg, "Falló: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('EndIf')}
  w('If ( fallos > 0 )');
  w('  # 3. Algo ha fallado: la radio vuelve a como estaba');
  for(const p of P){w(`  If ( FileExists( antes \\ ${qs(R+'\\'+p)} ) )`);w(`    Copy( antes \\ ${qs(R+'\\'+p)}, dst \\ ${qs(p)}, 1 )`);w('  EndIf')}
  w('  WriteFile( reg, "Han fallado " & fallos & " archivos. Se ha vuelto a poner lo de antes.^NL^", 1 )');
  w('  Message( "Han fallado " & fallos & " de las ' + n + ' imágenes, así que he vuelto a dejar la radio como estaba.^NL^^NL^El detalle está en registro.txt, en el USB.", "Mediaskinhz" )');
  w('  Exit');
  w('EndIf');
  w(`WriteFile( marca, "Instalado el " & FormatTime( "d/m/Y H:i:s" ) & "^NL^" )`);
  w(`WriteFile( reg, "Correcto: ${n} imágenes copiadas y comprobadas.^NL^", 1 )`);
  w('# 4. Reiniciar para ver los cambios');
  w('If ( FileExists( base \\ "REINICIAR.exe" ) )');
  w(`  If ( Question( "Listo: ${n} ${n===1?'imagen copiada y comprobada':'imágenes copiadas y comprobadas'}.^NL^^NL^¿Reiniciar la radio ahora para verlas?", "Mediaskinhz", "YesNo" ) )`);
  w('    Run( base \\ "REINICIAR.exe" )');
  w('  EndIf');
  w('Else');
  w(`  Message( "Listo: ${n} ${n===1?'imagen copiada y comprobada':'imágenes copiadas y comprobadas'}.^NL^^NL^Reinicia la radio para verlas (o copia REINICIAR.exe en la carpeta Mediaskinhz del USB para hacerlo desde aquí).", "Mediaskinhz" )`);
  w('EndIf');
  return L.join('\n')+'\n';
}
function mortUndo(R,items,id,when){
  const n=items.length,P=items.map(x=>winP(x.path));
  const L=[];const w=s=>L.push(s);
  w(`# Mediaskinhz · deshacer el paquete ${id} (${when})`);
  w('# Vuelve a poner las imágenes que había en la radio antes de instalar (carpeta antes-de-instalar) o, si faltan, las del backup (carpeta originales).');
  w('ErrorLevel( "off" )');
  w('base = SystemPath( "ScriptPath" )');
  w(`dst = "\\Storage Card\\System\\Img\\${R}"`);
  w(`antes = base \\ "antes-de-instalar\\${R}"`);
  w(`orig = base \\ "originales\\${R}"`);
  w('reg = base \\ "registro.txt"');
  w('If ( not DirExists( dst ) )');
  w('  Message( "No encuentro la carpeta de imágenes de la radio:^NL^" & dst & "^NL^^NL^No se ha tocado nada.", "Mediaskinhz" )');
  w('  Exit');
  w('EndIf');
  w(`If ( not Question( "Se van a devolver ${n} ${n===1?'imagen':'imágenes'} a como estaban antes de instalar.^NL^^NL^¿Seguir?", "Mediaskinhz", "YesNo" ) )`);
  w('  Exit');
  w('EndIf');
  w(`WriteFile( reg, "=== " & FormatTime( "d/m/Y H:i:s" ) & " · deshacer paquete ${id}^NL^", 1 )`);
  w('fallos = 0');
  w('faltan = 0');
  for(const p of P){w(`If ( FileExists( antes \\ ${qs(p)} ) )`);w(`  src = antes \\ ${qs(p)}`);w('Else');w(`  src = orig \\ ${qs(p)}`);w('EndIf');
    w('If ( FileExists( src ) )');w(`  Copy( src, dst \\ ${qs(p)}, 1 )`);w(`  If ( FileSize( dst \\ ${qs(p)} ) <> FileSize( src ) )`);w('    fallos = fallos + 1');w(`    WriteFile( reg, "Falló: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('  EndIf');
    w('Else');w('  faltan = faltan + 1');w(`  WriteFile( reg, "Sin copia para: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('EndIf')}
  w(`Delete( base \\ "instalado-${id}.txt" )`);
  w('If ( fallos + faltan > 0 )');
  w('  Message( "Hecho, con avisos: " & fallos & " fallos y " & faltan & " sin copia.^NL^^NL^El detalle está en registro.txt, en el USB. Reinicia la radio.", "Mediaskinhz" )');
  w('Else');
  w(`  WriteFile( reg, "Correcto: ${n} imágenes devueltas.^NL^", 1 )`);
  w('  If ( FileExists( base \\ "REINICIAR.exe" ) )');
  w(`    If ( Question( "Listo: ${n} ${n===1?'imagen devuelta':'imágenes devueltas'} a como estaban.^NL^^NL^¿Reiniciar la radio ahora?", "Mediaskinhz", "YesNo" ) )`);
  w('      Run( base \\ "REINICIAR.exe" )');
  w('    EndIf');
  w('  Else');
  w(`    Message( "Listo: ${n} ${n===1?'imagen devuelta':'imágenes devueltas'} a como estaban. Reinicia la radio para verlo.", "Mediaskinhz" )`);
  w('  EndIf');
  w('EndIf');
  return L.join('\n')+'\n';
}
// Entradas del ZIP para el modo automático. rs: [{F,u}] (u = bytes nuevos)
function autoEntries(rs,inc){
  const R=S.root,d=new Date(),z=x=>String(x).padStart(2,'0');
  const id=`${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`;
  const when=`${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`;
  const items=rs.map(r=>({path:r.F.path,size:r.u.length}));
  const e=[{name:'Mediaskinhz/instalar.mscr',data:ansi(mortInstall(R,items,id,when))},{name:'Mediaskinhz/deshacer.mscr',data:ansi(mortUndo(R,items,id,when))}];
  for(const r of rs)e.push({name:`Mediaskinhz/archivos/${R}/${r.F.path}`,data:r.u});
  if(inc)for(const r of rs)e.push({name:`Mediaskinhz/originales/${R}/${r.F.path}`,data:new Uint8Array(r.F.buf)});
  return {ents:e,id};
}
