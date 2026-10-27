// Comprueba antes de publicar (un fallo aquí = la app no se actualizaría o no abriría sin conexión):
// - la versión del service worker coincide con la de la app
// - todo lo que guarda el service worker existe, y también los iconos del manifest
// - site/index.html está al día con src/ (se ha ejecutado build.py)
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const top = path.join(path.dirname(new URL(import.meta.url).pathname), '..'), root = path.join(top, 'site');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const fails = [];
const V = (sw.match(/const V = 'msz-([^']+)'/) || [])[1], VER = (html.match(/const VER='([^']+)'/) || [])[1];
if (!V || V !== VER) fails.push(`sw.js (${V}) y la app (${VER}) tienen versiones distintas`);
if (!/^\d{4}-\d\d-\d\d-[\d.]+$/.test(VER || '')) fails.push('VER no tiene el formato AAAA-MM-DD-N: ' + VER);
const shell = JSON.parse((sw.match(/const SHELL = (\[[\s\S]*?\]);/) || [])[1].replace(/'/g, '"'));
for (const f of shell) if (f !== './' && !fs.existsSync(path.join(root, f))) fails.push('el service worker guarda un archivo que no existe: ' + f);
const man = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
for (const ic of man.icons) if (!fs.existsSync(path.join(root, ic.src))) fails.push('falta el icono ' + ic.src);
if (!html.includes('<link rel="manifest" href="manifest.webmanifest" crossorigin="use-credentials">')) fails.push('el <link rel=manifest> necesita crossorigin="use-credentials" (si no, el manifest llega sin la cookie del color y el icono sale siempre verde)');
// _worker.js: con la cookie de cada color sirve el manifest de ese color (y el normal sin cookie o con una rara)
const W = (await import(path.join(root, '_worker.js'))).default;
const env = { ASSETS: { fetch: async r => { const f = path.join(root, new URL(r.url).pathname); return fs.existsSync(f) ? new Response(fs.readFileSync(f)) : new Response('no', { status: 404 }); } } };
const slugs = [...fs.readFileSync(path.join(top, 'src/settings.js'), 'utf8').match(/const PRE=(\[\[.*?\]\]);/)[1].matchAll(/\['([^']+)',\d+/g)].map(m => m[1].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
const wk = fs.readFileSync(path.join(root, '_worker.js'), 'utf8');
for (const k of slugs) { if (!wk.includes(`'${k}'`)) fails.push(`_worker.js (COLORS) no conoce el color ${k}`); if (!html.includes(`'${k}'`)) fails.push(`msIco no conoce el color ${k}`); }
for (const k of ['', 'xx', ...slugs]) {
  const r = await W.fetch(new Request('https://x.dev/manifest.webmanifest', { headers: k ? { Cookie: 'a=1; ms_ic=' + k } : {} }), env);
  const j = await r.json().catch(() => null), want = slugs.includes(k) ? `ic/${k}-192.png` : 'icon-192.png';
  if (!j || !j.icons || j.icons[0].src !== want) fails.push(`manifest con ms_ic=${k || '(nada)'}: esperaba ${want}`);
  else for (const ic of j.icons) if (!fs.existsSync(path.join(root, ic.src))) fails.push('falta el icono ' + ic.src);
  if (j && JSON.stringify({ ...j, icons: 0 }) !== JSON.stringify({ ...man, icons: 0 })) fails.push(`manifest-${k}: no coincide con manifest.webmanifest salvo los iconos (vuelve a ejecutar tools/iconos.cjs)`);
}
if (!fails.length) console.log(`ok manifest por color: ${slugs.length} colores + el de partida`);
// Biblioteca de iconos: existe, se lee y lleva su licencia
try { const vw = JSON.parse(fs.readFileSync(path.join(root, 'vistas.json'), 'utf8'));
  for (const g of ['radio', 'media', 'phone']) if (!vw.views.some(o => o.s === g)) fails.push('vistas.json sin vistas de ' + g);
} catch (e) { fails.push('vistas.json no se puede leer: ' + e.message); }
try { const ic = JSON.parse(fs.readFileSync(path.join(root, 'iconos.json'), 'utf8'));
  if (!ic.i || ic.i.length < 1000) fails.push('iconos.json tiene muy pocos iconos');
  if (!/MIT/.test(ic.lic || '') || !fs.existsSync(path.join(root, 'iconos-LICENCIA.txt'))) fails.push('falta la licencia de Tabler Icons');
  const names = new Set(ic.i.map(x => x[0])); for (const [n] of ic.radio) if (!names.has(n)) fails.push('la selección «Para la radio» usa un icono que no existe: ' + n);
  const sug = fs.readFileSync(path.join(top, 'src/icons.js'), 'utf8').match(/const ICSUG=(\[[\s\S]*?\]\]\]);/);
  if (sug) for (const n of eval(sug[1]).flatMap(x => x[1])) if (!names.has(n)) fails.push('ICSUG propone un icono que no existe: ' + n);
} catch (e) { fails.push('iconos.json no se puede leer: ' + e.message); }
if (!html.includes('<meta charset="utf-8">')) fails.push('falta <meta charset="utf-8">');
const before = html;
try { execFileSync('python3', [path.join(top, 'build.py')], { stdio: 'pipe' }); } catch (e) { fails.push('build.py falla: ' + e.message); }
if (fs.readFileSync(path.join(root, 'index.html'), 'utf8') !== before) fails.push('site/index.html no estaba al día: ejecuta python3 build.py y súbelo');
console.log(fails.length ? 'FALLA\n- ' + fails.join('\n- ') : `ok service worker msz-${V}: ${shell.length} archivos`);
process.exit(fails.length ? 1 : 0);
