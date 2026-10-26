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
if (!html.includes('rel="manifest"')) fails.push('site/index.html no enlaza el manifest');
const before = html;
try { execFileSync('python3', [path.join(top, 'build.py')], { stdio: 'pipe' }); } catch (e) { fails.push('build.py falla: ' + e.message); }
if (fs.readFileSync(path.join(root, 'index.html'), 'utf8') !== before) fails.push('site/index.html no estaba al día: ejecuta python3 build.py y súbelo');
console.log(fails.length ? 'FALLA\n- ' + fails.join('\n- ') : `ok service worker msz-${V}: ${shell.length} archivos`);
process.exit(fails.length ? 1 : 0);
