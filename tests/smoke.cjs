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
  for (const t of ['Historial de exportaciones', 'Puntos de restauración', 'Seguridad', 'Exportación por defecto', 'Instalar la app'])
    ok(await p.locator('#view h3', { hasText: t }).count() === 1, 'Ajustes muestra «' + t + '»');
  ok((await p.locator('.abt').innerText()).includes('Krahz'), 'créditos de autor en Ajustes');
  await tap('#w-chg'); await p.waitForTimeout(300);
  ok((await p.locator('#bs h2').innerText()) === 'Novedades' && await p.locator('#bs .chgl section').count() >= 3, 'Novedades abre con sus versiones');
  await tap('#bs [data-x]'); await p.waitForTimeout(200);
  await tap('#w-cr'); await p.waitForTimeout(300);
  ok((await p.locator('#bs').innerText()).includes('GPL-3.0'), 'Créditos menciona la licencia GPL-3.0 y MediaNavMods');
  await tap('#bs [data-x]'); await p.waitForTimeout(200);
  // Color de la app: se aplica, se recuerda y deja el color del icono en la cookie
  const em0 = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim());
  await tap('#s-acs [data-i="2"]'); await p.waitForTimeout(300);
  const em1 = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim());
  ok(em1 && em1 !== em0, 'elegir Azul cambia el color de la app (' + em0 + ' → ' + em1 + ')');
  ok((await p.locator('#s-acn').innerText()) === 'Azul', 'muestra el nombre del color elegido');
  ok(/ms_ic=azul/.test(await p.evaluate(() => document.cookie)), 'el icono de la app tomará el color azul al instalar');
  await p.reload(); await p.waitForTimeout(600);
  // Chrome pide el manifest como al instalar (el navegador sin pantalla no lo pide solo)
  const manReq = p.waitForRequest(r => r.url().endsWith('/manifest.webmanifest'), { timeout: 8000 }).catch(() => null);
  const cdp = await ctx.newCDPSession(p); const am = await cdp.send('Page.getAppManifest').catch(() => ({}));
  const mr = await manReq; const mh = mr ? await mr.allHeaders() : {};
  ok(/ms_ic=azul/.test(mh.cookie || ''), 'Chrome pide el manifest con la cookie del color (si no, el icono al instalar sale verde)');
  await p.waitForTimeout(1200);
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim()) === em1, 'el color se recuerda al recargar');
  await p.evaluate(() => go({ n: 'settings' })); await p.waitForTimeout(700);
  await tap('#s-acs [data-i="0"]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--em').trim()) === em0, 'Esmeralda vuelve al color de partida');
  // Ajuste que se guarda
  await tap('#s-xm [data-v="lgu"]'); await p.reload(); await p.waitForTimeout(1500);
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
  await p.reload(); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => MY.list.length) === 2, 'mis iconos se conservan al recargar');
  await p.evaluate(() => { S.ops.global = { ...defOps(), h: 120 }; bump(); }); await p.waitForTimeout(500); // el ejemplo no guarda cambios al recargar
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
