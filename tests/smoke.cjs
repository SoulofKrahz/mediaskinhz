// Prueba de humo de Mediaskinhz: abre la app en un navegador real (móvil y PC) con las imágenes de ejemplo
// y comprueba lo principal. Si algo falla, GitHub NO publica.
// Uso: node tests/smoke.cjs   (PW_EXE=/ruta/chromium opcional)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', 'site'), BASE = 'http://app.test/';
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', svg: 'image/svg+xml', png: 'image/png', txt: 'text/plain' };
const fails = []; let where = '';
const ok = (c, m) => { if (!c) { fails.push(where + m); if (process.env.GITHUB_ACTIONS) console.log(`::error title=Prueba de humo::${where}${m}`); } console.log((c ? '  ✓ ' : '  ✗ ') + m); };

async function run(browser, label, viewport, mobile) {
  console.log(`\n== ${label}`); where = label + ': ';
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, serviceWorkers: 'block', locale: 'es-ES', acceptDownloads: true });
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('dialog', d => { errs.push('diálogo del navegador: ' + d.message()); d.dismiss(); });
  await ctx.route('**/*', r => {
    const u = r.request().url();
    if (!u.startsWith(BASE)) return r.abort(); // sin red fuera de la app (fuentes): como sin conexión
    const rel = decodeURIComponent(new URL(u).pathname.slice(1));
    if (rel === 'version.txt') return r.fulfill({ status: 200, contentType: 'text/plain', body: '2099-01-01-0' });
    const f = path.join(SITE, rel || 'index.html');
    if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: 'no' });
    return r.fulfill({ status: 200, contentType: MIME[path.extname(f).slice(1)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  const tap = sel => mobile ? p.locator(sel).first().tap() : p.locator(sel).first().click();
  const stab = async t => { if (await p.locator('#s-tabs').count()) { await tap('#s-tabs [data-t="' + t + '"]'); await p.waitForTimeout(200); } };
  await p.goto(BASE); await p.waitForTimeout(1800);
  ok((await p.title()) === 'Mediaskinhz', 'el título es Mediaskinhz');
  ok(await p.locator('#view canvas').count() > 0, 'arranca con las imágenes de ejemplo y su vista previa');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'sin desplazamiento horizontal');
  await p.waitForTimeout(1500);
  ok(await p.locator('#upd:not([hidden])').count() === 1, 'avisa de una versión nueva publicada (version.txt)');
  await tap('#upd-x'); ok(await p.locator('#upd[hidden]').count() === 1, '«Ahora no» oculta el aviso');

  // Menú → Ajustes e historial
  await tap('#ab-more'); await p.waitForTimeout(300);
  ok(await p.locator('#bs [data-m="settings"]').count() === 1, 'el menú tiene «Ajustes e historial»');
  await tap('#bs [data-m="settings"]'); await p.waitForTimeout(700);
  ok(await p.evaluate(() => S.route.n) === 'settings', 'abre Ajustes e historial');
  for (const t of ['Historial de exportaciones', 'Mis diseños', 'Seguridad', 'Exportación por defecto', 'Instalar la app'])
    ok(await p.locator('#view h3', { hasText: t }).count() === 1, 'Ajustes muestra «' + t + '»');
  ok((await p.locator('.abt').innerText()).includes('Krahz'), 'créditos de autor en Ajustes');
  await stab('app'); await tap('#w-chg'); await p.waitForTimeout(300);
  ok((await p.locator('#bs h2').innerText()) === 'Novedades' && await p.locator('#bs .chgl section').count() >= 3, 'Novedades abre con sus versiones');
  await tap('#bs [data-x]'); await p.waitForTimeout(200);
  await tap('#w-cr'); await p.waitForTimeout(300);
  ok((await p.locator('#bs').innerText()).includes('GPL-3.0'), 'Créditos menciona la licencia GPL-3.0 y MediaNavMods');
  await tap('#bs [data-x]'); await p.waitForTimeout(200);
  // Color de la app: se aplica, se recuerda y deja el color del icono en la cookie
  const em0 = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim());
  await stab('pref'); await tap('#s-acs [data-i="2"]'); await p.waitForTimeout(300);
  const em1 = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim());
  ok(em1 && em1 !== em0, 'elegir Azul cambia el color de la app (' + em0 + ' → ' + em1 + ')');
  ok((await p.locator('#s-acn').innerText()) === 'Azul', 'muestra el nombre del color elegido');
  ok(/ms_ic=azul/.test(await p.evaluate(() => document.cookie)), 'el icono de la app tomará el color azul al instalar');
  await p.reload(); await p.waitForTimeout(2800); await p.evaluate(() => { const u = document.querySelector('#upd'); if (u) u.hidden = true; }); await p.waitForTimeout(600);
  // Chrome pide el manifest como al instalar (el navegador sin pantalla no lo pide solo)
  const manReq = p.waitForRequest(r => r.url().endsWith('/manifest.webmanifest'), { timeout: 8000 }).catch(() => null);
  const cdp = await ctx.newCDPSession(p); const am = await cdp.send('Page.getAppManifest').catch(() => ({}));
  const mr = await manReq; const mh = mr ? await mr.allHeaders() : {};
  ok(/ms_ic=azul/.test(mh.cookie || ''), 'Chrome pide el manifest con la cookie del color (si no, el icono al instalar sale verde)');
  await p.waitForTimeout(1200);
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim()) === em1, 'el color se recuerda al recargar');
  await p.evaluate(() => go({ n: 'settings' })); await p.waitForTimeout(700);
  await stab('pref'); await tap('#s-acs [data-i="0"]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim()) === em0, 'Esmeralda vuelve al color de partida');
  // Ajuste que se guarda
  await stab('pref'); await tap('#s-xm [data-v="lgu"]'); await p.reload(); await p.waitForTimeout(2800); await p.evaluate(() => { const u = document.querySelector('#upd'); if (u) u.hidden = true; }); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => SET.xmode) === 'lgu', 'el modo de exportación por defecto se recuerda al recargar');
  await p.evaluate(() => { SET.xmode = 'tc'; S.xmode = 'tc'; saveSet(); });

  // Confirmación: cancelar no toca nada
  await p.evaluate(() => { go({ n: 'home' }); S.ops.global = { ...defOps(), h: 120 }; bump(); }); await p.waitForTimeout(700);
  ok(await p.evaluate(() => updBadge()) > 0, 'cambiar el tono global marca imágenes cambiadas');
  await tap('#ab-more'); await p.waitForTimeout(300); await tap('#bs [data-m="reset"]'); await p.waitForTimeout(300);
  ok(await p.locator('#bs .cfm').count() === 1, '«Quitar todos los cambios» pide confirmación');
  await p.keyboard.press('Escape'); await p.mouse.click(5, 5); await p.waitForTimeout(300);
  ok(await p.locator('#bs[hidden]').count() === 1 && await p.evaluate(() => updBadge()) > 0, 'cancelar la confirmación no quita los cambios');
  await tap('#ab-more'); await p.waitForTimeout(300); await tap('#bs [data-m="reset"]'); await p.waitForTimeout(300);
  await tap('#bs .cfm .btn.dgf'); await p.waitForTimeout(700);
  ok(await p.evaluate(() => updBadge()) === 0, 'confirmar quita los cambios');
  await p.evaluate(() => undo()); await p.waitForTimeout(500);
  ok(await p.evaluate(() => updBadge()) > 0, 'deshacer los recupera');

  // Biblioteca de iconos: en el editor de un botón, buscar en español y poner un icono
  await p.evaluate(() => { const F = S.files.find(f => kindOf(f) === 'btn'); go({ n: 'edit', p: F.path }); S.eTab = 'img'; render(true); }); await p.waitForTimeout(500);
  ok(await p.locator('#ic-pick').count() === 1, 'el editor ofrece «Poner un icono de la biblioteca»');
  await tap('#ic-pick'); await p.waitForTimeout(1500);
  ok(await p.locator('#ip-g .icb').count() > 20, 'la biblioteca de iconos se descarga y muestra la selección para la radio');
  await p.fill('#ip-q', 'música'); await p.waitForTimeout(500);
  ok((await p.locator('#ip-g .icb span').first().innerText()) === 'Música', 'el buscador entiende español («música» → Música)');
  await tap('#ip-g .icb'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => { const F = S.curF; return !!F.rep && S.icx[F.path] && S.icx[F.path].k === 't:music' && outBytes(F).length === 1078 + (((F.w + 3) & ~3) * F.h); }), 'pone el icono y el BMP sale con el tamaño correcto');
  await p.evaluate(() => undo()); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !S.curF.rep), 'deshacer quita el icono');
  // Mis iconos: un PNG negro sobre blanco y un SVG de trazo
  const mine = await p.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 300; c.height = 200; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 300, 200); x.fillStyle = '#000'; x.beginPath(); x.arc(150, 100, 60, 0, 7); x.fill();
    const png = await new Promise(r => c.toBlob(r)); const a = await myAdd(new File([png], 'circulo.png', { type: 'image/png' }));
    const b = await myAdd(new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/></svg>'], 'trazo.svg', { type: 'image/svg+xml' }));
    await new Promise(r => setTimeout(r, 400));
    const m = MY.by.get(a.id), cv = document.createElement('canvas'); cv.width = cv.height = 64; drawIconKey(cv.getContext('2d'), 'my:' + a.id, 32, 32, 48, '#fff', 0);
    const d = cv.getContext('2d').getImageData(0, 0, 64, 64).data; let on = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) on++;
    return { png: a.kind, svg: b.kind, parts: b.p.length, fill: on / (64 * 64) };
  });
  ok(mine.png === 'png' && mine.fill > .1 && mine.fill < .5, 'un PNG negro sobre blanco se convierte en silueta (no en un cuadrado): ' + Math.round(mine.fill * 100) + ' % relleno');
  ok(mine.svg === 'vec' && mine.parts === 2, 'un SVG de trazo se guarda como vector y sigue el trazo común');
  ok(await p.evaluate(() => badName('1000045654') && badName('IMG_20261026_1') && badName('Screenshot_2026') && !badName('Navegación') && !badName('trazo')), 'reconoce los nombres de archivo sin sentido para pedir uno');
  await p.reload(); await p.waitForTimeout(2800); await p.evaluate(() => { const u = document.querySelector('#upd'); if (u) u.hidden = true; }); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => MY.list.length) === 2, 'mis iconos se conservan al recargar');
  await p.evaluate(() => { S.ops.global = { ...defOps(), h: 120 }; bump(); }); await p.waitForTimeout(500); // el ejemplo no guarda cambios al recargar
  // Generador con iconos de la biblioteca y propios: la pantalla abre y aplica sin errores
  await p.evaluate(() => { S.gen = defGen(); const fs = genTargets(); fs.forEach((F, i) => S.gen.per[F.path] = { icon: i % 2 ? 't:' + icSuggest(F)[0] : (MY.list[0] ? 'my:' + MY.list[0].id : 't:star') }); S.gen.ifx = 'emboss'; S.gen.ibox = 'circle'; go({ n: 'gen' }); }); await p.waitForTimeout(900);
  ok(await p.locator('#g-tabs').count() === 1 && await p.locator('[data-gb]').count() >= 6, 'el generador abre con iconos de la biblioteca y propios');
  ok(await p.evaluate(() => { scrollTo(0, 2000); const a = document.querySelector('#pv').getBoundingClientRect(), t = document.querySelector('#g-tabs').getBoundingClientRect(); scrollTo(0, 0); return t.top >= a.bottom - 1; }), 'al desplazarse, las pestañas no tapan la vista previa');
  await tap('#g-tabs [data-t="icons"]'); await p.waitForTimeout(300);
  ok(await p.locator('[data-pn="icons"]:not([hidden]) [data-is="fx"] .ocd').count() === 8 && await p.locator('[data-pn="icons"]:not([hidden]) [data-is="w"] button').count() === 5, 'la pestaña Iconos enseña a la vista el trazo, el acabado y el fondo');
  await tap('#g-tabs [data-t="btn"]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => { applyGen(); return genTargets().every(F => F.rep && outBytes(F).length === 1078 + (((F.w + 3) & ~3) * F.h)); }), 'aplica el estilo (relieve en círculo) y los BMP salen bien');
  await p.evaluate(() => { undo(); S.gen.ifx = 'none'; S.gen.ibox = 'none'; }); await p.waitForTimeout(300);
  const sty = await p.evaluate(() => { const F = genTargets()[0], bad = []; for (const [k] of GSTYLES) { try { const c = genTile(F, { ...S.gen, style: k }); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let v = 0; for (let i = 0; i < d.length; i += 4) v += d[i] + d[i + 1] + d[i + 2]; if (!v) bad.push(k); } catch (e) { bad.push(k + ': ' + e.message); } } return { n: GSTYLES.length, bad }; });
  ok(sty.n >= 22 && !sty.bad.length, `los ${sty.n} estilos de botón se dibujan` + (sty.bad.length ? ': fallan ' + sty.bad.join(', ') : ''));
  // Diálogo para poner nombre (lo usan «Mis diseños»)
  const nm = p.evaluate(() => promptBS({ title: 'Prueba', value: 'Mi diseño' })); await p.waitForTimeout(300);
  await p.fill('#pb-in', 'Neón azul'); await p.keyboard.press('Enter');
  ok(await nm === 'Neón azul', 'se puede poner nombre a un diseño');
  // Hoja única del botón: icono y color al momento, con el aspecto original
  await p.evaluate(() => { S.gen = defGen(); go({ n: 'home' }); }); await p.waitForTimeout(500);
  await p.evaluate(() => btnSheet(genTargets()[0])); await p.waitForTimeout(800);
  ok(await p.locator('#bt-ic').count() && await p.locator('#bt-fc').count() && await p.locator('#bt-icc').count() && await p.locator('#bt-lk').count(), 'al tocar un botón se abre su hoja con icono, color del marco, color del icono y estilo en una sola pantalla');
  await tap('#bt-ic .icb:nth-child(3)'); await p.waitForTimeout(600);
  ok(await p.evaluate(() => { const F = genTargets()[0]; return !!F.rep && F.rep.by === 'btn' && S.gen.look === 'orig'; }), 'cambiar el icono se aplica al momento, conservando el aspecto original');
  await tap('#bt-icc button[data-h="white"]'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => S.gen.per[genTargets()[0].path].ihue === 'white'), 'el color del icono se elige aparte');
  await tap('#bt-lk [data-v="flat"]'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => S.gen.look === 'flat' && genTargets().every(F => F.rep && F.rep.by === 'gen')), 'elegir un estilo redibuja los botones al momento');
  await tap('#bt-lk [data-v="orig"]'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => { const [a, ...r] = genTargets(); return a.rep && a.rep.by === 'btn' && r.every(F => !F.rep); }), 'volver al original conserva el icono elegido y deja el resto como estaba');
  await tap('#bs [data-done]'); await p.waitForTimeout(300);
  // La misma hoja vale para cualquier botón de otra pantalla
  ok(await p.evaluate(() => { const F = S.files.find(f => kindOf(f) === 'btn' && !genTargets().includes(f)); if (!F) return true; btnSheet(F); const ok = !!document.querySelector('#bt-icc') && !!document.querySelector('#bt-lk') === canStyle(F); closeBS(); return ok; }), 'la hoja sirve también para botones de otras pantallas');
  // Estilos y forma también fuera de Inicio
  const out = await p.evaluate(async () => { const F = S.files.find(f => kindOf(f) === 'btn' && canStyle(f) && !genTargets().includes(f)); if (!F) return 'sin botones'; before();
    (S.gen.per[F.path] || (S.gen.per[F.path] = {})).look = 'neon'; applyButtons([F]); const a = F.rep && F.rep.by === 'gen' && S.gen.look === 'orig';
    const L = secBtns(F); for (const G of L) (S.gen.per[G.path] || (S.gen.per[G.path] = {})).look = 'tile'; applyButtons(L); const b = L.every(G => G.rep && G.rep.by === 'gen');
    S.gen.shape = 'pill'; restyleAll(); const c = outBytes(F).length === 1078 + (((F.w + 3) & ~3) * F.h); undo(); return a && b && c ? 'ok' : [a, b, c].join(); });
  ok(out === 'ok' || out === 'sin botones', 'los botones de otras pantallas admiten estilo y forma, también todos a la vez (' + out + ')');
  // «Usar este estilo y colores en todos» copia también el color del marco y del icono
  const allP = await p.evaluate(() => { const F = S.files.find(f => kindOf(f) === 'btn' && canStyle(f) && !genTargets().includes(f) && secBtns(f).length > 1); if (!F) return null; const q = S.gen.per[F.path] || (S.gen.per[F.path] = {}); q.look = 'flat'; q.hue = 24; q.ihue = 'white'; btnSheet(F); return F.path; });
  if (allP) { await tap('#bs #bt-all'); await p.waitForTimeout(300); await tap('#bs [data-c="1"]').catch(() => {}); await p.waitForTimeout(1500);
    ok(await p.evaluate(P => secBtns(S.lc.get(P.toLowerCase()) || S.files.find(f => f.path === P)).every(G => { const q = S.gen.per[G.path] || {}; return q.look === 'flat' && q.hue === 24 && q.ihue === 'white'; }), allP), 'usar en todos copia el estilo y los colores');
    await p.evaluate(() => { closeBS(); undo(); }); }
  // Tamaño de los iconos de dentro: se guarda y redibuja los botones tocados sin romper el formato
  ok(await p.evaluate(async () => { const F = S.files.find(f => kindOf(f) === 'btn' && frames(f) >= 2 && !genTargets().includes(f) && extractIcon(f)); if (!F) return true;
    before(); await setIsIn(1.35, [F]); const a = S.gen.isIn === 1.35 && F.rep && outBytes(F).length === 1078 + (((F.w + 3) & ~3) * F.h); undo(); return a; }), 'el tamaño de los iconos de dentro se aplica');
  ok(await p.evaluate(() => typeof fgroups === 'function' && FWFR['phone/phone_dial_btn_call.bmp'] === 8), 'el botón de llamar se trata como dos iconos (llamar y colgar)');
  // Exportación automática que se instala sola al arrancar con el USB
  ok(await p.evaluate(() => { const F = S.files.find(f => f.sec === 'HOME'); const e = autoEntries([{ F, u: new Uint8Array(F.buf) }], false, { boot: true, name: 'Prueba' }).ents.map(x => x.name);
    const m = new TextDecoder('windows-1252').decode(autoEntries([{ F, u: new Uint8Array(F.buf) }], false, { boot: true, name: 'Prueba' }).ents.find(x => x.name === 'Medianav.mscr').data);
    return e.includes('Medianav.mscr') && e.includes('Mediaskinhz/Medianav-original.mscr') && /MicomManager/.test(m) && /RunWait/.test(m) && /ttcmd/.test(m) && !/[^\x00-\xff]/.test(m); }), 'el modo automático trae el arranque desde el USB (Medianav.mscr) y sigue abriendo Total Commander');
  // Ventana de cada pantalla y «Común»: abren y enseñan sus bloques
  for (const sc of ['radio', 'media', 'phone', 'eco', 'setting', 'common']) {
    await p.evaluate(s => go({ n: 'scr', s }), sc); await p.waitForTimeout(400);
    ok(await p.locator('#sc-tint').count() === 1 && (await p.evaluate(() => document.querySelector('#ab-t .t1').textContent)).length > 0, 'la ventana «' + sc + '» se abre con sus colores y piezas');
  }
  // Con la hoja de su botón metida en la ventana, la hoja que se abre encima sigue respondiendo (antes se cruzaban los controles)
  await p.evaluate(() => go({ n: 'scr', s: 'radio' })); await p.waitForTimeout(400);
  if (await p.locator('#sc-btn #bt-fc').count()) {
    const tp = await p.evaluate(() => { const F = S.files.find(f => isBtnLike(f) && f.sec === SCRSEC.radio) || genTargets().find(f => slotScr(f) !== 'radio'); btnSheet(F); return F.path; });
    await tap('#bs #bt-fc button[data-h="24"]'); await p.waitForTimeout(500);
    ok(await p.evaluate(P => (S.gen.per[P] || {}).hue === 24 && !!document.querySelector('#bs #bt-pv'), tp), 'la hoja de un botón abierta desde una ventana cambia ese botón');
    await p.evaluate(() => { closeBS(); undo(); });
  }
  // Vistas de dentro: se cargan, se eligen y tocar un botón de la vista abre su hoja
  await p.evaluate(() => go({ n: 'scr', s: 'radio' }));
  const hasVw = await p.waitForFunction(() => document.querySelector('#sc-vw .vwv') || !document.querySelector('#sc-vw'), null, { timeout: 10000 }).then(() => p.evaluate(() => !!document.querySelector('#sc-vw .vwv'))).catch(() => false);
  ok(await p.evaluate(() => loadVistas().then(() => VW.st === 2 && ['radio', 'media', 'phone'].every(s => vwCur(s)))), 'vistas.json se carga y hay vistas de Radio, Multimedia y Teléfono');
  if (await p.locator('#sc-vw').count()) {
    ok(hasVw, 'las vistas de dentro de Radio se cargan');
    await tap('#sc-vw [data-w="Presintonías"]'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => vwCur('radio').v === 'Presintonías' && S.vw.radio.v === 'Presintonías'), 'se puede elegir la vista (Presintonías)');
    await tap('#sc-vw [data-b="AM"]'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => vwCur('radio').band === 'AM'), 'se puede elegir la banda (AM)');
    const hit = await p.evaluate(() => { const V = vwCur('radio'); const i = V.c.findIndex(c => c[0] && byName(c[0]) && c[3] < 800); if (i < 0) return null; const c = V.c[i]; return [c[1] + c[3] / 2, c[2] + c[4] / 2]; });
    if (hit) { const bx = await p.locator('#pv').boundingBox(); await p.mouse.click(bx.x + hit[0] * bx.width / 800, bx.y + hit[1] * bx.height / 480); await p.waitForTimeout(500);
      ok(await p.evaluate(() => !document.querySelector('#bs').hidden || S.route.n === 'edit'), 'tocar un botón de la vista abre su hoja'); await p.evaluate(() => closeBS()); }
  }
  await p.evaluate(() => go({ n: 'home' })); await p.waitForTimeout(300);
  // Familia «Negros y fondo»
  ok(await p.evaluate(() => { const F = S.files.find(f => /HOME_BG/i.test(f.path)); return famsOfFiles([F]).some(f => f.k === 13); }), 'el fondo de Inicio ofrece la familia «Negros y fondo»');
  // Exportar (ejemplo) → descarga un ZIP
  await p.evaluate(() => go({ n: 'export' })); await p.waitForTimeout(600);
  const btn = p.locator('#view button', { hasText: /Descargar|Exportar/ }).last();
  if (await btn.count()) {
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }).catch(() => null), mobile ? btn.tap() : btn.click()]);
    ok(!!dl && /\.zip$/.test(dl.suggestedFilename()), 'exportar descarga un ZIP' + (dl ? ` (${dl.suggestedFilename()})` : ''));
  } else ok(false, 'no se encuentra el botón de exportar');
  ok(!errs.length, 'sin errores de la página' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await ctx.close();
}
(async () => {
  const b = await chromium.launch({ executablePath: process.env.PW_EXE || undefined });
  await run(b, 'Móvil', { width: 390, height: 844 }, true);
  await run(b, 'PC', { width: 1440, height: 900 }, false);
  await b.close();
  console.log(fails.length ? `\nFALLA (${fails.length})\n- ` + fails.join('\n- ') : '\nTodo bien');
  process.exit(fails.length ? 1 : 0);
})();
