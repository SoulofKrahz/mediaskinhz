
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

// Barra de progreso en texto para la ventana de estado de MortScript (no tiene barra de verdad; sin «%», que MortScript podría interpretar)
const pbar=(i,n,w=20)=>{const k=Math.round(i/n*w);return '['+'#'.repeat(k)+'-'.repeat(w-k)+']  '+i+' de '+n};
const plural=(n,a,b)=>n===1?a:b;
// Reinicio: REINICIAR.exe se copia antes a la memoria de la radio (\Temp) para que no dependa de que el USB siga puesto
function mortReboot(w,ind){const I=ind||'';
  w(I+'rb2 = rb');
  w(I+'If ( DirExists( "\\Temp" ) )');
  w(I+'  Copy( rb, "\\Temp\\msz_reiniciar.exe", 1 )');
  w(I+'  If ( FileExists( "\\Temp\\msz_reiniciar.exe" ) )');
  w(I+'    rb2 = "\\Temp\\msz_reiniciar.exe"');
  w(I+'  EndIf');
  w(I+'EndIf')}
function mortInstall(R,items,id,when,o){o=o||{};
  const n=items.length,P=items.map(x=>winP(x.path)),D=dirsOf(items.map(x=>x.path)),nm=String(o.name||'Mediaskinhz').replace(/"/g,"'"),act=o.undo?'Restaurar las imágenes originales':`Instalar «${nm}»`;
  const L=[];const w=s=>L.push(s),step=Math.max(1,Math.round(n/40));
  const st=(t)=>w(`StatusMessage( ${qs(t)} )`);
  w(`# Mediaskinhz · instalador · paquete ${id} · ${act}`);
  w(`# Copia ${n} ${plural(n,'imagen','imágenes')} en \\Storage Card\\System\\Img\\${R}. Generado el ${when}.`);
  w('# Lo abre Medianav.mscr al arrancar con el USB, o tú desde Total Commander (toca antes una vez MortScript.exe).');
  w('ErrorLevel( "off" )');
  w('base = SystemPath( "ScriptPath" )');
  w('If ( not FileExists( base \\ "instalar.mscr" ) )');
  w('  base = "\\MD\\Mediaskinhz"');
  w('EndIf');
  w('# Lanzado por Medianav.mscr al arrancar: ya se ha preguntado y la radio ya está preparada');
  w('desde = FileExists( base \\ "desde-arranque.tmp" )');
  w('If ( desde )');
  if(o.sel)w('  selmz = ReadFile( base \\ "desde-arranque.tmp" )');
  w('  Delete( base \\ "desde-arranque.tmp" )');
  w('EndIf');
  w('rb = base \\ "REINICIAR.exe"');
  w('If ( not FileExists( rb ) )');
  w('  rb = "\\MD\\REINICIAR.exe"');
  w('EndIf');
  w(`dst = "\\Storage Card\\System\\Img\\${R}"`);
  w(`nuevo = base \\ "archivos\\${R}"`);
  w('antes = base \\ "antes-de-instalar"');
  w('reg = base \\ "registro.txt"');
  w(`marca = base \\ "instalado-${id}.txt"`);
  w('If ( not DirExists( dst ) )');
  w(`  Message( "No se ha encontrado la carpeta de imágenes de la radio:^NL^" & dst & "^NL^^NL^No se ha modificado nada.", "Mediaskinhz · ${act}" )`);
  w('  Exit');
  w('EndIf');
  w(`If ( not FileExists( nuevo \\ ${qs(P[0])} ) )`);
  w(`  Message( "Faltan las imágenes del diseño en el USB (carpeta Mediaskinhz\\archivos).^NL^^NL^Descomprime el ZIP completo en la raíz del USB.^NL^^NL^No se ha modificado nada.", "Mediaskinhz · ${act}" )`);
  w('  Exit');
  w('EndIf');
  w('repetido = FileExists( marca )');
  w('If ( not desde )');
  w('  If ( repetido )');
  w(`    If ( not Question( "Este paquete ya está instalado.^NL^^NL^¿Copiar otra vez las ${n} ${plural(n,'imagen','imágenes')}? La copia de seguridad anterior se conserva.", "Mediaskinhz · ${act}", "YesNo" ) )`);
  w('      Exit');
  w('    EndIf');
  w('  Else');
  w(`    If ( not Question( "${act}^NL^^NL^Imágenes: ${n}^NL^Paquete: ${when}^NL^^NL^Antes se guarda en el USB una copia de lo que hay en la radio. Si algo falla, la radio vuelve a su estado anterior.^NL^^NL^¿Continuar?", "Mediaskinhz", "YesNo" ) )`);
  w('      Exit');
  w('    EndIf');
  w('  EndIf');
  w('EndIf');
  w(`WriteFile( reg, "=== " & FormatTime( "d/m/Y H:i:s" ) & " · ${act} · paquete ${id} (${n} imágenes)^NL^", 1 )`);
  w('# Ventana de progreso');
  w('StatusType( ST_MESSAGE )');
  w(`StatusInfo( "Mediaskinhz", ${qs(act)} )`);
  w('# 1. Copia de seguridad de lo que hay ahora en la radio');
  w('If ( not repetido )');
  st('Paso 1 de 2 · Copia de seguridad en el USB^NL^^NL^'+pbar(0,n));
  w('  MkDir( antes )');
  w(`  MkDir( antes \\ "${R}" )`);
  for(const d of D)w(`  MkDir( antes \\ ${qs(R+'\\'+d)} )`);
  w('  fallos = 0');
  for(const [i,p] of P.entries()){w(`  If ( FileExists( dst \\ ${qs(p)} ) )`);w(`    Copy( dst \\ ${qs(p)}, antes \\ ${qs(R+'\\'+p)}, 1 )`);
    w(`    If ( FileSize( antes \\ ${qs(R+'\\'+p)} ) <> FileSize( dst \\ ${qs(p)} ) )`);w('      fallos = fallos + 1');w(`      WriteFile( reg, "No se pudo copiar a la copia de seguridad: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('    EndIf');w('  EndIf');
    if((i+1)%step===0||i===n-1)st('Paso 1 de 2 · Copia de seguridad en el USB^NL^^NL^'+pbar(i+1,n))}
  w('  If ( fallos > 0 )');
  w('    StatusType( ST_HIDDEN )');
  w('    WriteFile( reg, "Cancelado: la copia de seguridad falló. No se ha tocado la radio.^NL^", 1 )');
  w(`    Message( "No se ha podido guardar la copia de seguridad de " & fallos & " archivos (¿USB lleno o protegido contra escritura?).^NL^^NL^Por seguridad no se ha modificado la radio.", "Mediaskinhz · ${act}" )`);
  w('    Exit');
  w('  EndIf');
  w('EndIf');
  w('# 2. Copiar las imágenes nuevas y comprobar cada una');
  w('fallos = 0');
  st('Paso 2 de 2 · Instalando y comprobando^NL^^NL^'+pbar(0,n));
  for(const [i,p] of P.entries()){w(`Copy( nuevo \\ ${qs(p)}, dst \\ ${qs(p)}, 1 )`);w(`If ( FileSize( dst \\ ${qs(p)} ) <> ${items[i].size} )`);w('  fallos = fallos + 1');w(`  WriteFile( reg, "Falló: ${p.replace(/"/g,"'")}^NL^", 1 )`);w('EndIf');
    if((i+1)%step===0||i===n-1)st('Paso 2 de 2 · Instalando y comprobando^NL^^NL^'+pbar(i+1,n))}
  w('If ( fallos > 0 )');
  w('  # Algo ha fallado: la radio vuelve a como estaba');
  st('Ha habido un error · Restaurando el estado anterior…');
  for(const p of P){w(`  If ( FileExists( antes \\ ${qs(R+'\\'+p)} ) )`);w(`    Copy( antes \\ ${qs(R+'\\'+p)}, dst \\ ${qs(p)}, 1 )`);w('  EndIf')}
  w('  StatusType( ST_HIDDEN )');
  w('  WriteFile( reg, "Han fallado " & fallos & " archivos. Se ha vuelto a poner lo de antes.^NL^", 1 )');
  w(`  Message( "No se ha completado: han fallado " & fallos & " de ${n} imágenes.^NL^^NL^La radio se ha dejado como estaba. El detalle está en Mediaskinhz\\registro.txt, en el USB.", "Mediaskinhz · ${act}" )`);
  w('  Exit');
  w('EndIf');
  w(`WriteFile( marca, "Instalado el " & FormatTime( "d/m/Y H:i:s" ) & "^NL^" )`);
  w('WriteFile( base \\ "resultado-ok.txt", "ok" )');
  if(o.sel){w('If ( desde )');w(`  WriteFile( selmz \\ "actual.txt", ${qs(nm)} )`);w('EndIf')}
  w(`WriteFile( reg, "Correcto: ${n} imágenes copiadas y comprobadas.^NL^", 1 )`);
  w('StatusType( ST_HIDDEN )');
  w('# 3. Reiniciar. Orden: primero ACEPTAR, después (con la pantalla apagada) sacar el USB');
  w('If ( FileExists( rb ) )');
  mortReboot(w,'  ');
  w('  If ( desde )');
  w(`    BigMessage( "${o.undo?'Restauración completada':'Instalación completada'}^NL^^NL^${n} ${plural(n,'imagen instalada y comprobada','imágenes instaladas y comprobadas')}.^NL^^NL^1. Pulsa ACEPTAR: la radio se reiniciará.^NL^2. Cuando la pantalla se apague, saca el USB.^NL^^NL^No saques el USB antes de pulsar ACEPTAR.", "Mediaskinhz" )`);
  w('    Run( rb2 )');
  w('    Exit');
  w('  EndIf');
  w(`  If ( Question( "${o.undo?'Restauración completada':'Instalación completada'}: ${n} ${plural(n,'imagen instalada y comprobada','imágenes instaladas y comprobadas')}.^NL^^NL^¿Reiniciar ahora la radio para aplicar el diseño?^NL^^NL^Si dices que sí, saca el USB cuando la pantalla se apague, no antes.", "Mediaskinhz", "YesNo" ) )`);
  w('    Run( rb2 )');
  w('  EndIf');
  w('Else');
  w(`  Message( "${o.undo?'Restauración completada':'Instalación completada'}: ${n} ${plural(n,'imagen instalada y comprobada','imágenes instaladas y comprobadas')}.^NL^^NL^Reinicia la radio para aplicar el diseño (no se ha encontrado REINICIAR.exe en el USB).", "Mediaskinhz" )`);
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
  w('If ( not FileExists( base \\ "deshacer.mscr" ) )');
  w('  base = "\\MD\\Mediaskinhz"');
  w('EndIf');
  w('rb = base \\ "REINICIAR.exe"');
  w('If ( not FileExists( rb ) )');
  w('  rb = "\\MD\\REINICIAR.exe"');
  w('EndIf');
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
  w('  If ( FileExists( rb ) )');
  mortReboot(w,'    ');
  w(`    If ( Question( "Restauración completada: ${n} ${n===1?'imagen devuelta':'imágenes devueltas'} a como estaban.^NL^^NL^¿Reiniciar ahora la radio?^NL^^NL^Si dices que sí, saca el USB cuando la pantalla se apague, no antes.", "Mediaskinhz", "YesNo" ) )`);
  w('      Run( rb2 )');
  w('    EndIf');
  w('  Else');
  w(`    Message( "Listo: ${n} ${n===1?'imagen devuelta':'imágenes devueltas'} a como estaban. Reinicia la radio para verlo.", "Mediaskinhz" )`);
  w('  EndIf');
  w('EndIf');
  return L.join('\n')+'\n';
}
/* Arranque desde el USB. En la MediaNav del autor el USB lleva ULC2_recovery.exe (MortRunner renombrado), que ejecuta
   ULC2_recovery.mscr, que abre MortScript con \MD\Medianav.mscr (\MD es el USB). Ese Medianav.mscr arrancaba MicomManager,
   cerraba la ventana activa, paraba el navegador y AppMain y abría Total Commander. Este lo sustituye: hace lo mismo al principio,
   pregunta si instalar el diseño del USB y, si no, abre Total Commander como siempre. ULC2_recovery.* no se tocan. */
const MEDIANAV_ORIG='Run("\\Storage Card\\System\\MicomManager.exe")\nSleep(20000)\nClose(ActiveWindow())\nSleep(5000)\nRun("\\Windows\\explorer.exe")\nKill("nngnavi.exe")\nSleep(5000)\nKill("AppMain.exe")\nSleep(5000)\nRun("\\MD\\TTCMD\\ttcmd.exe")\n';
function mortBoot(items,id,when,name,undo){
  const n=items.length,L=[];const w=x=>L.push(x),nm=String(name||'Mediaskinhz').replace(/"/g,"'"),act=undo?'Restaurar las imágenes originales':`Instalar el diseño «${nm}»`;
  w(`# Mediaskinhz · arranque con el USB · paquete ${id} (${when})`);
  w('# Sustituye a Medianav.mscr (lo abre ULC2_recovery.mscr). El de antes está en Mediaskinhz\\Medianav-original.mscr.');
  w('ErrorLevel( "off" )');
  w('# 1. Como el original: la radio tiene que tener MicomManager en marcha');
  w('Run( "\\Storage Card\\System\\MicomManager.exe" )');
  w('Sleep( 20000 )');
  w('Close( ActiveWindow() )');
  w('Sleep( 2000 )');
  w('usb = SystemPath( "ScriptPath" )');
  w('If ( not FileExists( usb \\ "Medianav.mscr" ) )');
  w('  usb = "\\MD"');
  w('EndIf');
  w('mz = usb \\ "Mediaskinhz"');
  w('inst = mz \\ "instalar.mscr"');
  w('ms = usb \\ "MortScript.exe"');
  w('rb = usb \\ "REINICIAR.exe"');
  w('If ( FileExists( inst ) and FileExists( ms ) )');
  w(`  If ( FileExists( mz \\ "instalado-${id}.txt" ) )`);
  w('    # Ya instalado (p. ej. la radio ha arrancado otra vez con el USB puesto): no se vuelve a instalar');
  w(`    If ( Question( "${undo?'Las imágenes originales ya están restauradas.':`El diseño «${nm}» ya está instalado.`}^NL^^NL^Si no vas a usar Total Commander, pulsa NO: la radio se reiniciará. Saca el USB cuando la pantalla se apague.^NL^^NL^SÍ: abrir Total Commander^NL^NO: reiniciar la radio", "Mediaskinhz", "YesNo" ) )`);
  w('      tc = 1');
  w('    Else');
  w('      tc = 0');
  w('      If ( FileExists( rb ) )');
  mortReboot(w,'        ');
  w('        Run( rb2 )');
  w('        Exit');
  w('      EndIf');
  w('      tc = 1');
  w('    EndIf');
  w('  Else');
  w(`    If ( Question( "${act}^NL^^NL^Imágenes: ${n}^NL^Paquete: ${when}^NL^^NL^Antes de instalar se guarda en el USB una copia de lo que hay en la radio. Si algo falla, la radio vuelve a su estado anterior. Tarda unos segundos; no apagues la radio.^NL^^NL^SÍ: ${undo?'restaurar':'instalar'} ahora^NL^NO: abrir Total Commander", "Mediaskinhz", "YesNo" ) )`);
  w('      # 2. Como el original antes de Total Commander: parar el navegador y AppMain para que las imágenes no estén en uso');
  w('      Kill( "nngnavi.exe" )');
  w('      Sleep( 3000 )');
  w('      Kill( "AppMain.exe" )');
  w('      Sleep( 5000 )');
  w('      Delete( mz \\ "resultado-ok.txt" )');
  w('      WriteFile( mz \\ "desde-arranque.tmp", "1" )');
  w('      RunWait( ms, inst )');
  w('      # Si ha terminado bien, el instalador ya está reiniciando la radio. Si no, se sigue a Total Commander');
  w('      If ( FileExists( mz \\ "resultado-ok.txt" ) )');
  w('        Exit');
  w('      EndIf');
  w('      Message( "La instalación no se ha completado. La radio se ha dejado como estaba.^NL^^NL^El detalle está en Mediaskinhz\\registro.txt, en el USB. Ahora se abre Total Commander.", "Mediaskinhz" )');
  w('    EndIf');
  w('    tc = 1');
  w('  EndIf');
  w('Else');
  w('  tc = 1');
  w('EndIf');
  w('# 3. Como el original: abrir Total Commander');
  w('If ( tc = 1 )');
  w('  Run( "\\Windows\\explorer.exe" )');
  w('  Kill( "nngnavi.exe" )');
  w('  Sleep( 5000 )');
  w('  Kill( "AppMain.exe" )');
  w('  Sleep( 5000 )');
  w('  Run( usb \\ "TTCMD\\ttcmd.exe" )');
  w('EndIf');
  return L.join('\n')+'\n';
}
// Entradas del ZIP para el modo automático. rs: [{F,u}] (u = bytes nuevos)
function autoEntries(rs,inc,o){o=o||{};
  const R=S.root,d=new Date(),z=x=>String(x).padStart(2,'0');
  const id=`${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`;
  const when=`${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`;
  const items=rs.map(r=>({path:r.F.path,size:r.u.length}));
  const e=[{name:'Mediaskinhz/instalar.mscr',data:ansi(mortInstall(R,items,id,when,{name:o.name,undo:o.undo}))},{name:'Mediaskinhz/deshacer.mscr',data:ansi(mortUndo(R,items,id,when))}];
  if(o.boot){e.push({name:'Medianav.mscr',data:ansi(mortBoot(items,id,when,o.name||'Mediaskinhz',o.undo))});e.push({name:'Mediaskinhz/Medianav-original.mscr',data:ansi(MEDIANAV_ORIG)})}
  for(const r of rs)e.push({name:`Mediaskinhz/archivos/${R}/${r.F.path}`,data:r.u});
  if(inc)for(const r of rs)e.push({name:`Mediaskinhz/originales/${R}/${r.F.path}`,data:new Uint8Array(r.F.buf)});
  return {ents:e,id};
}

/* ============ selector de diseños en el USB ============
   Varios diseños en el mismo USB. Al arrancar con él, Medianav.mscr enseña una lista (Choice de MortScript) con los diseños,
   «Original de Renault», «Abrir Total Commander» y «Reiniciar sin cambiar nada». El elegido se instala con su instalar.mscr
   (copia de seguridad, comprobación y vuelta atrás si falla) y la radio se reinicia.
   Todos los diseños llevan el mismo juego de archivos (la suma de lo que cambia cualquiera de ellos; donde uno no cambia nada va el original),
   así pasar de uno a otro no deja restos del anterior. */
function mortSelect(skins,id,when){const L=[],w=x=>L.push(x),n=skins.length;
  w(`# Mediaskinhz · selector de diseños · paquete ${id} (${when})`);
  w('# Sustituye a Medianav.mscr (lo abre ULC2_recovery.mscr). El de antes está en Mediaskinhz\\Medianav-original.mscr.');
  w('ErrorLevel( "off" )');
  w('Run( "\\Storage Card\\System\\MicomManager.exe" )');
  w('Sleep( 20000 )');
  w('Close( ActiveWindow() )');
  w('Sleep( 2000 )');
  w('usb = SystemPath( "ScriptPath" )');
  w('If ( not FileExists( usb \\ "Medianav.mscr" ) )');
  w('  usb = "\\MD"');
  w('EndIf');
  w('mz = usb \\ "Mediaskinhz"');
  w('ms = usb \\ "MortScript.exe"');
  w('rb = usb \\ "REINICIAR.exe"');
  w('actual = "no instalado desde este USB"');
  w('If ( FileExists( mz \\ "actual.txt" ) )');
  w('  actual = ReadFile( mz \\ "actual.txt" )');
  w('EndIf');
  w(`sel = Choice( "Mediaskinhz · Elige el diseño", "Ahora en la radio: " & actual & "^NL^Toca uno y pulsa Aceptar. Se guarda una copia antes de instalar.", 0, 0, ${skins.map(s=>qs(s.name)).join(', ')}, "Abrir Total Commander", "Reiniciar sin cambiar nada" )`);
  w(`If ( sel = ${n+2} )`);
  w('  If ( FileExists( rb ) )');
  mortReboot(w,'    ');
  w('    Run( rb2 )');
  w('    Exit');
  w('  EndIf');
  w('EndIf');
  skins.forEach((k,i)=>{w(`If ( sel = ${i+1} )`);
    w(`  dir = mz \\ ${qs('disenos\\'+k.dir)}`);
    w('  If ( FileExists( dir \\ "instalar.mscr" ) and FileExists( ms ) )');
    w('    Kill( "nngnavi.exe" )');
    w('    Sleep( 3000 )');
    w('    Kill( "AppMain.exe" )');
    w('    Sleep( 5000 )');
    w('    Delete( dir \\ "resultado-ok.txt" )');
    w('    WriteFile( dir \\ "desde-arranque.tmp", mz )');
    w('    RunWait( ms, dir \\ "instalar.mscr" )');
    w('    If ( FileExists( dir \\ "resultado-ok.txt" ) )');
    w('      Exit');
    w('    EndIf');
    w(`    Message( "No se ha completado la instalación de ${String(k.name).replace(/"/g,"'")}. La radio se ha dejado como estaba.^NL^^NL^El detalle está en Mediaskinhz\\disenos\\${k.dir}\\registro.txt, en el USB. Ahora se abre Total Commander.", "Mediaskinhz" )`);
    w('  Else');
    w('    Message( "Falta la carpeta de este diseño en el USB. Descomprime el ZIP completo en la raíz del USB.", "Mediaskinhz" )');
    w('  EndIf');
    w('EndIf')});
  w('# Total Commander, como el original');
  w('Run( "\\Windows\\explorer.exe" )');
  w('Kill( "nngnavi.exe" )');
  w('Sleep( 5000 )');
  w('Kill( "AppMain.exe" )');
  w('Sleep( 5000 )');
  w('Run( usb \\ "TTCMD\\ttcmd.exe" )');
  return L.join('\n')+'\n'}
// Bytes de todo lo que cambia el estado cargado ahora (con las imágenes gemelas)
function curBytes(){S.ver++;for(const F of S.files)F.cv=null;const rs=withTwins(S.files.filter(changed).map(F=>({F,u:outBytes(F)})));return new Map(rs.map(r=>[r.F.path,r.u]))}
function blankState(){for(const F of S.files){F.rep=null;F.cv=null}S.src=new Map();S.ops={global:null,sec:{},file:{}};S.ex={};S.frames={};S.icx={};S.stby=null}
// list: [{name, cur:true} | {name, st} | {name, preset:P}]
async function selectorZip(list,onp){await loadVistas().catch(()=>{});
  const keep=snap(),src0=S.src,kd=[S.curDesign,S.curDesignName],maps=[];
  const back=()=>{Object.assign(S,{ops:structuredClone(keep.ops),ex:{...keep.ex},frames:{...keep.frames},layout:structuredClone(keep.layout),gen:genCopy(keep.gen),icx:structuredClone(keep.icx||{}),stby:keep.stby?{...keep.stby}:null});
    for(const F of S.files){F.rep=null;F.cv=null}for(const [F,r] of keep.reps)F.rep=r;S.src=src0;S.ver++};
  try{for(const [i,d] of list.entries()){onp&&onp(i,list.length);await new Promise(r=>setTimeout(r,20));
      if(d.cur){back();maps.push(curBytes());continue}
      if(d.preset){back();const {T,L}=presetSet(d.preset);for(const F of [...T,...L])buildButton(F);maps.push(curBytes());continue}
      blankState();const g0=S.gen;applyState(d.st);if(!d.st.gen)S.gen=null;else if(!S.gen.look)migrateLook(d.st);maps.push(curBytes())}}
  finally{back();S.curDesign=kd[0];S.curDesignName=kd[1];S.genCv=null;bump()}
  const U=[...new Set(maps.flatMap(m=>[...m.keys()]))],FF=new Map(U.map(p=>[p,S.files.find(F=>F.path===p)]));
  const R=S.root,d=new Date(),z=x=>String(x).padStart(2,'0'),id=`${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`,when=`${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`;
  const ents=[],skins=[];const add=(name,m,undo)=>{const k=skins.length+1,dir=z(k)+'-'+name.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24),items=[];
    for(const p of U){const F=FF.get(p);if(!F)continue;const u=(m&&m.get(p))||new Uint8Array(F.buf);items.push({path:p,size:u.length});ents.push({name:`Mediaskinhz/disenos/${dir}/archivos/${R}/${p}`,data:u})}
    ents.push({name:`Mediaskinhz/disenos/${dir}/instalar.mscr`,data:ansi(mortInstall(R,items,id+'-'+k,when,{name,undo,sel:true}))});skins.push({dir,name})};
  list.forEach((x,i)=>add(x.name,maps[i],false));add('Original de Renault',null,true);
  ents.unshift({name:'Medianav.mscr',data:ansi(mortSelect(skins,id,when))},{name:'Mediaskinhz/Medianav-original.mscr',data:ansi(MEDIANAV_ORIG)});
  ents.push({name:'LEEME.txt',data:new TextEncoder().encode(['Mediaskinhz · selector de diseños en el USB','',`Diseños: ${skins.map(s=>s.name).join(' · ')}`,`Archivos por diseño: ${U.length}`,'',
    '1. Descomprime este ZIP en la raíz de tu USB de siempre (el de ULC2_recovery, MortScript y Total Commander) y acepta sobrescribir.','   Tu Medianav.mscr de antes queda en Mediaskinhz\\Medianav-original.mscr.',
    '2. Arranca la radio con el USB como para entrar a Total Commander. A los 25 s sale la lista de diseños.','3. Toca el que quieras y pulsa Aceptar. Se guarda una copia, se instala, se comprueba y, si falla, la radio vuelve a como estaba.',
    '4. Al terminar: primero ACEPTAR y, cuando la pantalla se apague, saca el USB.','','Para cambiar otro día de diseño, vuelve a arrancar con el USB y elige otro. «Original de Renault» deja todo como de fábrica.'].join('\r\n'))});
  return {zip:await makeZip(ents),n:U.length,skins}}
async function selectorSheet(){if(S.demo){toast('Carga tu backup para preparar el selector');return}
  const ds=(await listPoints()).filter(p=>p.kind==='manual'),cur=S.files.some(changed);
  const row=(v,t,sub,on)=>`<label class="ck" style="display:flex;gap:10px;align-items:center;padding:8px 2px"><input type="checkbox" value="${esc(v)}"${on?' checked':''}><span><b>${esc(t)}</b>${sub?`<br><small class="note">${esc(sub)}</small>`:''}</span></label>`;
  openBS(`<h2>Selector de diseños en el USB</h2><p class="note">Elige hasta 8. Al arrancar con el USB, la radio te enseña la lista y eliges con el dedo cuál poner. Siempre se añade «Original de Renault».</p>
    <div id="sel-l" style="max-height:46vh;overflow:auto">${cur?row('cur','Lo que tienes ahora',S.curDesignName?'«'+S.curDesignName+'» con tus cambios':'Sin guardar',true):''}
    ${ds.length?'<p class="lbl">Mis diseños</p>'+ds.map(p=>row('d:'+p.id,p.label,p.n+' imágenes',false)).join(''):''}
    <p class="lbl">Diseños listos <small>· sobre lo que tienes ahora</small></p>${PRESETS.map(P=>row('p:'+P.id,P.name,'',false)).join('')}</div>
    <p class="note" id="sel-n"></p><div class="stack" style="gap:8px;margin-top:8px"><button class="btn wide" id="sel-go">Descargar el selector</button><button class="btn o wide" id="sel-x">Cancelar</button></div>`);
  const bs=$('#bs'),cnt=()=>{const n=bs.querySelectorAll('#sel-l input:checked').length;bs.querySelector('#sel-n').textContent=n?`${n} ${n===1?'diseño':'diseños'} + Original de Renault`+(n>8?' · demasiados: quita alguno':''):'Marca al menos uno';bs.querySelector('#sel-go').disabled=!n||n>8};cnt();
  bs.querySelector('#sel-l').onchange=cnt;bs.querySelector('#sel-x').onclick=()=>closeBS();
  bs.querySelector('#sel-go').onclick=async()=>{const vs=[...bs.querySelectorAll('#sel-l input:checked')].map(i=>i.value),list=[];
    for(const v of vs){if(v==='cur')list.push({name:S.curDesignName||'Mi diseño actual',cur:true});else if(v.startsWith('d:')){const p=await getPoint(v.slice(2));if(p)list.push({name:p.label,st:p.st})}else{const P=PRESETS.find(x=>x.id===v.slice(2));if(P)list.push({name:P.name,preset:P})}}
    closeBS();toast('Preparando el selector…',{ms:120000});
    try{const r=await selectorZip(list,(i,n)=>toast(`Preparando el selector… ${i+1} de ${n}`,{ms:120000}));const d=new Date();await saveBlob(r.zip,`mediaskinhz-selector-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.zip`);
      toast(`Selector listo: ${r.skins.length} opciones, ${r.n} imágenes cada una`)}catch(e){console.error(e);toast('No se ha podido preparar el selector')}}}
