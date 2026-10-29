
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
  if(o.boot){e.push({name:'Medianav.mscr',data:ansi(mortBoot(items,id,when,o.name||'Mediaskinhz',o.undo))});e.push({name:'Mediaskinhz/Medianav-original.mscr',data:kitOrig(o.kit)})}
  for(const r of rs)e.push({name:`Mediaskinhz/archivos/${R}/${r.F.path}`,data:r.u});
  if(inc)for(const r of rs)e.push({name:`Mediaskinhz/originales/${R}/${r.F.path}`,data:new Uint8Array(r.F.buf)});
  return {ents:withKit(e,o.kit,o.boot),id};
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
  const kit=SET.xkit!==false?await usbKit():null;
  ents.unshift({name:'Medianav.mscr',data:ansi(mortMenu(skins,id,when))},{name:'Mediaskinhz/Medianav-original.mscr',data:kitOrig(kit)},{name:'Mediaskinhz/copia.mscr',data:ansi(mortCopia())},{name:'Mediaskinhz/informe.mscr',data:ansi(mortInforme())},{name:'Mediaskinhz/restaura.mscr',data:ansi(mortRestaura(R))},{name:'Mediaskinhz/prueba-aspecto.mscr',data:ansi(mortAspecto())});
  ents.push({name:'LEEME.txt',data:new TextEncoder().encode(['Mediaskinhz · USB completo: menú al arrancar','','Menú: Diseños · Copias de seguridad (hacer y restaurar) · Herramientas (informe, Total Commander, prueba de aspecto) · Reiniciar · Volver a la radio','',`Diseños: ${skins.map(s=>s.name).join(' · ')}`,`Archivos por diseño: ${U.length}`,'',
    '1. Descomprime este ZIP en la raíz de tu USB de siempre (el de ULC2_recovery, MortScript y Total Commander) y acepta sobrescribir.','   Tu Medianav.mscr de antes queda en Mediaskinhz\\Medianav-original.mscr.',
    '2. Arranca la radio con el USB como para entrar a Total Commander. A los 25 s sale el menú.','3. «Cambiar de diseño»: toca el que quieras y pulsa Aceptar. Se guarda una copia, se instala, se comprueba y, si falla, la radio vuelve a como estaba.',
    '4. Al terminar: primero ACEPTAR y, cuando la pantalla se apague, saca el USB.','','Para cambiar otro día de diseño, vuelve a arrancar con el USB y elige otro. «Original de Renault» deja todo como de fábrica.','','«Copia de seguridad» guarda en Mediaskinhz\\copias las imágenes de la radio (o todo System). «Informe del sistema» escribe Mediaskinhz\\informe.txt.'].join('\r\n'))});
  try{ents.push({name:'Mediaskinhz/logo.bmp',data:await logoBmp()})}catch(_){}
  return {zip:await makeZip(withKit(ents,kit,true)),n:U.length,skins}}
async function selectorSheet(){if(S.demo){toast('Carga tu backup para preparar el selector');return}
  const ds=(await listPoints()).filter(p=>p.kind==='manual'),cur=S.files.some(changed);
  const row=(v,t,sub,on)=>`<label class="ck" style="display:flex;gap:10px;align-items:center;padding:8px 2px"><input type="checkbox" value="${esc(v)}"${on?' checked':''}><span><b>${esc(t)}</b>${sub?`<br><small class="note">${esc(sub)}</small>`:''}</span></label>`;
  openBS(`<h2>Preparar el USB completo</h2><p class="note">Al arrancar con el USB sale un menú: cambiar de diseño, copia de seguridad de la radio, restaurar la última copia, informe del sistema, Total Commander o reiniciar. Elige hasta 8 diseños; siempre se añade «Original de Renault».</p>
    <div id="sel-l" style="max-height:46vh;overflow:auto">${cur?row('cur','Lo que tienes ahora',S.curDesignName?'«'+S.curDesignName+'» con tus cambios':'Sin guardar',true):''}
    ${ds.length?'<p class="lbl">Mis diseños</p>'+ds.map(p=>row('d:'+p.id,p.label,p.n+' imágenes',false)).join(''):''}
    <p class="lbl">Diseños listos <small>· sobre lo que tienes ahora</small></p>${PRESETS.map(P=>row('p:'+P.id,P.name,'',false)).join('')}</div>
    <p class="note" id="sel-n"></p><div class="stack" style="gap:8px;margin-top:8px"><p class="note" id="sel-kit"></p><button class="btn wide" id="sel-go">Descargar el USB completo</button><button class="btn o wide" id="sel-x">Cancelar</button></div>`);
  const bs=$('#bs'),cnt=()=>{const n=bs.querySelectorAll('#sel-l input:checked').length;bs.querySelector('#sel-n').textContent=n?`${n} ${n===1?'diseño':'diseños'} + Original de Renault`+(n>8?' · demasiados: quita alguno':''):'Marca al menos uno';bs.querySelector('#sel-go').disabled=!n||n>8};cnt();
  usbKit().then(k=>{const el=bs.querySelector('#sel-kit');if(el)el.innerHTML=k&&SET.xkit!==false?`Lleva también tu lanzador (${k.n} archivos): vale para un USB nuevo.`:k?'Sin el lanzador (desactivado en Exportar): descomprímelo encima de tu USB de siempre.':'Sin el lanzador: descomprímelo encima de tu USB de siempre. Para un USB nuevo, guarda antes tu USB en Exportar.'});
  bs.querySelector('#sel-l').onchange=cnt;bs.querySelector('#sel-x').onclick=()=>closeBS();
  bs.querySelector('#sel-go').onclick=async()=>{const vs=[...bs.querySelectorAll('#sel-l input:checked')].map(i=>i.value),list=[];
    for(const v of vs){if(v==='cur')list.push({name:S.curDesignName||'Mi diseño actual',cur:true});else if(v.startsWith('d:')){const p=await getPoint(v.slice(2));if(p)list.push({name:p.label,st:p.st})}else{const P=PRESETS.find(x=>x.id===v.slice(2));if(P)list.push({name:P.name,preset:P})}}
    closeBS();toast('Preparando el USB…',{ms:120000});
    try{const r=await selectorZip(list,(i,n)=>toast(`Preparando el USB… diseño ${i+1} de ${n}`,{ms:120000}));const d=new Date();await saveBlob(r.zip,`mediaskinhz-usb-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.zip`);
      toast(`USB listo: menú con ${r.skins.length} diseños, copia de seguridad e informe`)}catch(e){console.error(e);toast('No se ha podido preparar el USB')}}}

/* ============ lanzador del USB ============
   Para preparar un USB nuevo de una vez: guardas una vez el contenido de tu USB de siempre (ULC2_recovery, MortScript, Total Commander, REINICIAR…)
   y cada exportación automática lo lleva completo. Se guarda solo en este navegador (IndexedDB), nunca se sube a ningún sitio:
   el repositorio de la app es público y esos archivos (y la clave de tu equipo) no pueden ir en él. */
async function usbKit(){try{return await idb.get('usbkit')}catch(_){return null}}
function kitOrig(kit){return kit&&kit.orig?kit.orig:ansi(MEDIANAV_ORIG)}
// junta el lanzador con lo que genera Mediaskinhz; lo de Mediaskinhz manda si se repite un nombre
function withKit(ents,kit,boot){if(!kit||!kit.files)return ents;const have=new Set(ents.map(e=>e.name.toLowerCase()));
  const add=kit.files.filter(f=>!have.has(f.name.toLowerCase())&&!(boot&&f.name.toLowerCase()==='medianav.mscr')).map(f=>({name:f.name,data:f.data}));
  if(!boot&&kit.orig&&!have.has('medianav.mscr')&&!add.some(f=>f.name.toLowerCase()==='medianav.mscr'))add.push({name:'Medianav.mscr',data:kit.orig});return [...add,...ents]}
async function saveUsbKit(fl){const arr=[...fl];if(!arr.length)return false;let files=[];
  if(arr.length===1&&/\.rar$/i.test(arr[0].name)){toast('El navegador no puede abrir .rar: comprímelo como .zip o elige la carpeta del USB.',{ms:7000});return false}
  if(arr.length===1&&/\.zip$/i.test(arr[0].name)){try{files=(await readZip(await arr[0].arrayBuffer(),()=>true)).map(e=>({name:e.path.replace(/\\/g,'/'),data:new Uint8Array(e.buf)}))}catch(e){toast('No se ha podido leer el ZIP');return false}}
  else for(const f of arr)files.push({name:(f.webkitRelativePath||f.name).replace(/\\/g,'/'),data:new Uint8Array(await f.arrayBuffer())});
  files=files.filter(f=>f.name&&!f.name.endsWith('/'));
  // la raíz del USB es donde está MortScript.exe
  const ms=files.find(f=>/(^|\/)mortscript\.exe$/i.test(f.name));if(!ms){toast('No parece tu USB del lanzador: falta MortScript.exe',{ms:6000});return false}
  const pre=ms.name.slice(0,ms.name.length-'mortscript.exe'.length);
  files=files.filter(f=>f.name.toLowerCase().startsWith(pre.toLowerCase())).map(f=>({...f,name:f.name.slice(pre.length)}))
    .filter(f=>!/^(mediaskinhz|m1|m0|m1_inv|originales|restaurar)\//i.test(f.name)&&!/^(leeme\.txt|upgrade\.lgu)$/i.test(f.name)&&f.data.length<40e6);
  const mn=files.find(f=>f.name.toLowerCase()==='medianav.mscr');let orig=null;
  if(mn){const t=new TextDecoder('latin1').decode(mn.data);if(!/^#\s*Mediaskinhz/i.test(t))orig=mn.data}
  const size=files.reduce((a,f)=>a+f.data.length,0);
  try{await idb.set('usbkit',{t:Date.now(),files,orig,size,n:files.length})}catch(_){toast('No queda espacio en el navegador para guardar el USB');return false}
  toast(`Lanzador guardado: ${files.length} archivos (${fsz(size)})`);return true}
function pickUsbKit(after){openBS(`<h2>Guardar el contenido de tu USB</h2><p class="note">Elige tu USB de siempre (el que arranca Total Commander): un <b>ZIP</b> de todo su contenido o, en el ordenador, la <b>carpeta</b> del USB. Se guarda solo en este dispositivo; las imágenes y backups que haya en él no se guardan.</p>
  <div class="stack" style="gap:8px"><button class="btn wide" id="k-zip">Elegir un ZIP</button><button class="btn o wide" id="k-dir">Elegir la carpeta del USB</button><button class="btn o wide" id="k-x">Cancelar</button></div>`);
  const mk=dir=>{const i=document.createElement('input');i.type='file';if(dir){i.webkitdirectory=true;i.multiple=true}else i.accept='.zip,application/zip';
    i.onchange=async()=>{closeBS();toast('Leyendo tu USB…',{ms:30000});if(await saveUsbKit(i.files)&&after)after()};i.click()};
  $('#k-zip').onclick=()=>mk(false);$('#k-dir').onclick=()=>mk(true);$('#k-x').onclick=()=>closeBS()}
async function kitUI(el){if(!el)return;if(S.demo){el.innerHTML='<p class="note">Carga tu backup para usarlo.</p>';return}const kit=await usbKit();if(!el.isConnected)return;
  el.innerHTML=kit?`<p class="ok" style="margin:0 0 8px">✓ Guardado: ${kit.n} archivos (${fsz(kit.size)}) · ${new Date(kit.t).toLocaleDateString('es-ES')}</p>
      <label class="swrow" for="x-kitc"><span>Incluirlo en el USB<small>Lanzador completo (ULC2_recovery, MortScript, Total Commander…): el ZIP vale para un USB vacío</small></span><input class="sw" type="checkbox" id="x-kitc"${SET.xkit!==false?' checked':''}></label>
      <button class="btn o sm" id="x-kitr">Cambiar por otro</button>`
    :`<p class="note">Guarda una vez el contenido de tu USB de siempre (el que arranca Total Commander): un ZIP de todo el USB o, en el ordenador, su carpeta. Así el USB completo valdrá también para un USB nuevo y vacío.</p>
      <p class="note">Se queda solo en este dispositivo; nunca se sube a ningún sitio.</p><button class="btn o wide" id="x-kits">Guardar el contenido de mi USB</button>`;
  const c=el.querySelector('#x-kitc');if(c)c.onchange=e=>{SET.xkit=e.target.checked;saveSet()};
  const r=el.querySelector('#x-kitr');if(r)r.onclick=()=>pickUsbKit(()=>kitUI(el));
  const sv=el.querySelector('#x-kits');if(sv)sv.onclick=()=>pickUsbKit(()=>kitUI(el))}

/* ============ USB completo: menú al arrancar ============
   Medianav.mscr enseña un menú (Choice) que vuelve a salir tras cada herramienta:
     Cambiar de diseño (lista de diseños del USB) · Copia de seguridad de la radio · Informe del sistema · Abrir Total Commander · Reiniciar · Volver a la radio.
   El menú solo usa órdenes ya probadas en el coche (y Choice). Las herramientas van en scripts aparte (copia.mscr, informe.mscr):
   si alguna orden suya no existiera en este MortScript, falla esa herramienta, no el menú. */
function mortMenu(skins,id,when){const L=[],w=x=>L.push(x),T='Mediaskinhz · Clio IV';
  const reboot=(ind,msg)=>{w(ind+'If ( FileExists( rb ) )');mortReboot(w,ind+'  ');w(ind+`  BigMessage( "${msg}^NL^^NL^Pulsa ACEPTAR y, cuando la pantalla se apague, saca el USB.", "Mediaskinhz" )`);w(ind+'  Run( rb2 )');w(ind+'  Exit');w(ind+'EndIf')};
  w(`# Mediaskinhz · menú del USB · paquete ${id} (${when})`);
  w('# Sustituye a Medianav.mscr (lo abre ULC2_recovery.mscr). El de antes está en Mediaskinhz\\Medianav-original.mscr.');
  w('# Menú en tres niveles: Diseños · Copias de seguridad · Herramientas. Cancelar en el menú principal abre Total Commander, como siempre.');
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
  w('parado = 0');
  w('seguir = 1');
  w('While ( seguir = 1 )');
  w('  actual = "no instalado desde este USB"');
  w('  If ( FileExists( mz \\ "actual.txt" ) )');
  w('    actual = ReadFile( mz \\ "actual.txt" )');
  w('  EndIf');
  w(`  op = Choice( "${T}", "Diseño en la radio: " & actual & "^NL^Elige una opción.", 0, 0, "Diseños", "Copias de seguridad", "Herramientas", "Reiniciar la radio", "Volver a la radio" )`);
  // Diseños
  w('  If ( op = 1 )');
  w(`    sel = Choice( "${T} · Diseños", "Ahora en la radio: " & actual & "^NL^Se guarda una copia antes de instalar y, si algo falla, la radio vuelve a como estaba.", 0, 0, ${skins.map(k=>qs(k.name)).join(', ')}, "« Volver" )`);
  skins.forEach((k,i)=>{w(`    If ( sel = ${i+1} )`);
    w(`      dir = mz \\ ${qs('disenos\\'+k.dir)}`);
    w('      If ( FileExists( dir \\ "instalar.mscr" ) and FileExists( ms ) )');
    w('        Kill( "nngnavi.exe" )');
    w('        Sleep( 3000 )');
    w('        Kill( "AppMain.exe" )');
    w('        Sleep( 5000 )');
    w('        parado = 1');
    w('        Delete( dir \\ "resultado-ok.txt" )');
    w('        WriteFile( dir \\ "desde-arranque.tmp", mz )');
    w('        RunWait( ms, dir \\ "instalar.mscr" )');
    w('        If ( FileExists( dir \\ "resultado-ok.txt" ) )');
    w('          Exit');
    w('        EndIf');
    w(`        Message( "No se ha completado la instalación de ${String(k.name).replace(/"/g,"'")}. La radio se ha dejado como estaba.^NL^^NL^El detalle está en Mediaskinhz\\disenos\\${k.dir}\\registro.txt, en el USB.", "Mediaskinhz" )`);
    w('      Else');
    w('        Message( "Falta la carpeta de este diseño en el USB. Descomprime el ZIP completo en la raíz del USB.", "Mediaskinhz" )');
    w('      EndIf');
    w('    EndIf')});
  w('  EndIf');
  // Copias
  w('  If ( op = 2 )');
  w(`    c = Choice( "${T} · Copias de seguridad", "Las copias se guardan en el USB (Mediaskinhz\\copias). Hacer una copia no cambia nada en la radio.", 0, 0, "Hacer copia de las imágenes (rápida)", "Hacer copia de todo System (lenta)", "Restaurar la última copia", "« Volver" )`);
  w('    If ( c = 1 or c = 2 )');
  w('      WriteFile( mz \\ "copia-modo.tmp", c )');
  w('      RunWait( ms, mz \\ "copia.mscr" )');
  w('    EndIf');
  w('    If ( c = 3 )');
  w('      Delete( mz \\ "restaura-ok.txt" )');
  w('      RunWait( ms, mz \\ "restaura.mscr" )');
  w('      If ( FileExists( mz \\ "restaura-ok.txt" ) )');
  reboot('        ','Copia restaurada. La radio se va a reiniciar.');
  w('      EndIf');
  w('    EndIf');
  w('  EndIf');
  // Herramientas
  w('  If ( op = 3 )');
  w(`    h = Choice( "${T} · Herramientas", "Ninguna de estas opciones cambia nada en la radio.", 0, 0, "Informe del sistema", "Abrir Total Commander", "Probar el aspecto del menú", "« Volver" )`);
  w('    If ( h = 1 )');
  w('      RunWait( ms, mz \\ "informe.mscr" )');
  w('    EndIf');
  w('    If ( h = 2 )');
  w('      seguir = 0');
  w('    EndIf');
  w('    If ( h = 3 )');
  w('      RunWait( ms, mz \\ "prueba-aspecto.mscr" )');
  w('    EndIf');
  w('  EndIf');
  w('  If ( op = 0 )');
  w('    seguir = 0');
  w('  EndIf');
  w('  If ( op = 4 or ( op = 5 and parado = 1 ) )');
  reboot('    ','La radio se va a reiniciar.');
  w('    seguir = 0');
  w('  EndIf');
  w('  If ( op = 5 and parado = 0 )');
  w('    Exit');
  w('  EndIf');
  w('EndWhile');
  w('# Total Commander, como el original');
  w('Run( "\\Windows\\explorer.exe" )');
  w('Kill( "nngnavi.exe" )');
  w('Sleep( 5000 )');
  w('Kill( "AppMain.exe" )');
  w('Sleep( 5000 )');
  w('Run( usb \\ "TTCMD\\ttcmd.exe" )');
  return L.join('\n')+'\n'}
// Prueba de aspecto: MortScript no tiene órdenes para enseñar imágenes en sus ventanas. Esto prueba, una a una y sin tocar la radio,
// lo que podría dar un menú más vistoso (entradas más grandes, letra más grande, abrir el logo con el visor de imágenes de Windows CE, si lo hay)
// y apunta en Mediaskinhz\prueba-aspecto.txt qué ha funcionado.
function mortAspecto(){return ['# Mediaskinhz · prueba de aspecto del menú (no toca la radio)','ErrorLevel( "off" )',
  'base = SystemPath( "ScriptPath" )','If ( not FileExists( base \\ "prueba-aspecto.mscr" ) )','  base = "\\MD\\Mediaskinhz"','EndIf','f = base \\ "prueba-aspecto.txt"',
  'WriteFile( f, "Prueba de aspecto · " & FormatTime( "d/m/Y H:i:s" ) & "^NL^" )',
  'Message( "Prueba 1 de 3: entradas más grandes en la lista.^NL^^NL^Pulsa ACEPTAR y fíjate en el tamaño de la lista que sale.", "Mediaskinhz" )',
  'SetChoiceEntryFormat( 56, 24 )',
  'r = Choice( "Prueba 1 · lista", "¿Las opciones se ven más grandes que en el menú?", 0, 0, "Sí, más grandes", "No, igual", "No sale bien" )',
  'WriteFile( f, "1. SetChoiceEntryFormat( 56, 24 ): " & r & " (1 = más grandes)^NL^", 1 )',
  'SetMessageFont( 26 )',
  'Message( "Prueba 2 de 3: este texto debería verse más grande de lo normal.", "Mediaskinhz" )',
  'q = Question( "¿El texto de la ventana anterior se veía más grande?", "Mediaskinhz", "YesNo" )',
  'WriteFile( f, "2. SetMessageFont( 26 ): " & q & " (1 = sí)^NL^", 1 )',
  'Message( "Prueba 3 de 3: abrir el logo con el visor de imágenes de la radio.^NL^^NL^Si se abre, ciérralo con la X o la flecha y vuelve aquí. Si no pasa nada, espera unos segundos.", "Mediaskinhz" )',
  'Run( base \\ "logo.bmp" )','Sleep( 6000 )',
  'q = Question( "¿Se ha abierto el logo en un visor de imágenes?", "Mediaskinhz", "YesNo" )',
  'WriteFile( f, "3. Run( logo.bmp ): " & q & " (1 = sí)^NL^", 1 )',
  'Message( "Prueba terminada. El resultado está en el USB: Mediaskinhz\\prueba-aspecto.txt. Mándaselo a quien te ayuda con Mediaskinhz.", "Mediaskinhz" )'].join('\n')+'\n'}
// Logo de Mediaskinhz en BMP (para la prueba del visor de imágenes)
async function logoBmp(){const im=new Image();im.src='icon-192.png';await im.decode();const c=document.createElement('canvas');c.width=320;c.height=240;const x=c.getContext('2d');x.fillStyle='#0b0f14';x.fillRect(0,0,320,240);x.drawImage(im,64,24,192,192);
  const q=quantize(x.getImageData(0,0,320,240).data,320,240,{dither:true});return new Uint8Array(encodeBMP8(320,240,q.idx,q.pal,null))}
function mortCopia(){return ['# Mediaskinhz · copia de seguridad de la radio en el USB (no cambia nada en la radio)','ErrorLevel( "off" )',
  'base = SystemPath( "ScriptPath" )','If ( not FileExists( base \\ "copia.mscr" ) )','  base = "\\MD\\Mediaskinhz"','EndIf',
  'q = 0','If ( FileExists( base \\ "copia-modo.tmp" ) )','  q = ReadFile( base \\ "copia-modo.tmp" ) + 0','  Delete( base \\ "copia-modo.tmp" )','EndIf','If ( q = 0 )',
  '  q = Choice( "Mediaskinhz · Copia de seguridad", "Se copia al USB, en Mediaskinhz\\copias. En la radio no se cambia nada.", 0, 0, "Solo las imágenes (rápida; se puede cargar en Mediaskinhz)", "Todo System: imágenes, ajustes y programas (puede tardar minutos)", "Volver" )','EndIf',
  'If ( q = 1 or q = 2 )','  src = "\\Storage Card\\System\\Img"','  If ( q = 2 )','    src = "\\Storage Card\\System"','  EndIf',
  '  MkDir( base \\ "copias" )','  d = base \\ "copias\\" & FormatTime( "Ymd-His" )','  MkDir( d )',
  '  StatusType( ST_MESSAGE )','  StatusInfo( "Mediaskinhz", "Copia de seguridad" )','  StatusMessage( "Copiando " & src & "^NL^^NL^Puede tardar. No apagues la radio ni saques el USB." )',
  '  XCopy( src \\ "*.*", d, 1, 1 )','  StatusType( ST_HIDDEN )',
  '  WriteFile( d \\ "copia.txt", "Copia de " & src & " hecha el " & FormatTime( "d/m/Y H:i:s" ) & "^NL^" )',
  '  WriteFile( base \\ "copias\\ultima.txt", d )',
  '  ok = DirExists( d \\ "M1" ) or DirExists( d \\ "Img" )',
  '  If ( ok )','    Message( "Copia terminada.^NL^^NL^Está en el USB: Mediaskinhz\\copias\\" & FormatTime( "Ymd" ) & "-…^NL^^NL^Para cargarla en Mediaskinhz, elige su carpeta M1 (o un ZIP de ella) en «Cargar otro backup».", "Mediaskinhz" )',
  '  Else','    Message( "La copia no parece completa (¿USB lleno?). Revisa la carpeta Mediaskinhz\\copias en el USB.", "Mediaskinhz" )','  EndIf','EndIf'].join('\n')+'\n'}
function mortRestaura(R){return ['# Mediaskinhz · restaurar las imágenes desde la última copia de seguridad del USB','ErrorLevel( "off" )',
  'base = SystemPath( "ScriptPath" )','If ( not FileExists( base \\ "restaura.mscr" ) )','  base = "\\MD\\Mediaskinhz"','EndIf',
  'Delete( base \\ "restaura-ok.txt" )','u = ""','If ( FileExists( base \\ "copias\\ultima.txt" ) )','  u = ReadFile( base \\ "copias\\ultima.txt" )','EndIf',
  `src = ""`,`If ( u <> "" )`,`  If ( DirExists( u \\ "${R}" ) )`,`    src = u \\ "${R}"`,'  EndIf',`  If ( DirExists( u \\ "Img\\${R}" ) )`,`    src = u \\ "Img\\${R}"`,'  EndIf','EndIf',
  'If ( src = "" )','  Message( "No hay ninguna copia de seguridad en este USB.^NL^^NL^Haz antes una con «Copia de seguridad de la radio».", "Mediaskinhz" )','  Exit','EndIf',
  'cuando = ""','If ( FileExists( u \\ "copia.txt" ) )','  cuando = ReadFile( u \\ "copia.txt" )','EndIf',
  `If ( not Question( "Restaurar las imágenes de la radio desde la última copia del USB.^NL^^NL^" & cuando & "^NL^Se sustituyen las imágenes (${R}). Los ajustes y programas de la radio no se tocan. Después se reinicia.^NL^^NL^¿Continuar?", "Mediaskinhz", "YesNo" ) )`,'  Exit','EndIf',
  'Kill( "nngnavi.exe" )','Sleep( 3000 )','Kill( "AppMain.exe" )','Sleep( 5000 )',
  'StatusType( ST_MESSAGE )','StatusInfo( "Mediaskinhz", "Restaurar la copia" )','StatusMessage( "Copiando las imágenes de la copia a la radio…^NL^^NL^No apagues la radio ni saques el USB." )',
  `XCopy( src \\ "*.*", "\\Storage Card\\System\\Img\\${R}", 1, 1 )`,'StatusType( ST_HIDDEN )',
  `If ( DirExists( "\\Storage Card\\System\\Img\\${R}\\HOME" ) )`,'  WriteFile( base \\ "restaura-ok.txt", "ok" )','  WriteFile( base \\ "actual.txt", "Copia de seguridad restaurada" )','EndIf'].join('\n')+'\n'}
function mortInforme(){return ['# Mediaskinhz · informe del sistema (solo lee; escribe Mediaskinhz\\informe.txt en el USB)','ErrorLevel( "off" )',
  'base = SystemPath( "ScriptPath" )','If ( not FileExists( base \\ "informe.mscr" ) )','  base = "\\MD\\Mediaskinhz"','EndIf','f = base \\ "informe.txt"',
  'WriteFile( f, "Mediaskinhz · informe del sistema · " & FormatTime( "d/m/Y H:i:s" ) & "^NL^^NL^" )',
  'WriteFile( f, "Memoria libre: " & FreeMemory() & " de " & TotalMemory() & "^NL^", 1 )',
  'WriteFile( f, "Storage Card libre: " & FreeDiskSpace( "\\Storage Card" ) & " de " & TotalDiskSpace( "\\Storage Card" ) & "^NL^", 1 )',
  'WriteFile( f, "USB libre: " & FreeDiskSpace( base ) & "^NL^", 1 )',
  ...['\\Storage Card\\System\\Img\\M1','\\Storage Card\\System\\Img\\M0','\\Storage Card\\System\\Img\\M1_INV','\\Storage Card\\NaviFolder','\\Storage Card\\System\\Sound','\\Storage Card\\System\\Font','\\Temp']
    .map(d=>`WriteFile( f, ${qs(d)} & ": " & DirExists( ${qs(d)} ) & "^NL^", 1 )`),
  'WriteFile( f, "^NL^Versión de Windows CE: " & SystemVersion() & "^NL^", 1 )',
  'WriteFile( f, "Pantalla: " & ScreenWidth() & "^NL^", 1 )',
  'Message( "Informe guardado en el USB: Mediaskinhz\\informe.txt", "Mediaskinhz" )'].join('\n')+'\n'}
