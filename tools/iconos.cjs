// Genera los iconos de site/ (los de partida y uno por color: site/ic/*.png) y los manifests por color
// (site/manifest-<color>.webmanifest), como en Noticiahz. El color de cada uno sale del mismo cálculo que usa la app
// (msAcc en src/head.html), así el icono coincide con la cabecera.
// Uso: python3 build.py && node tools/iconos.cjs   (con playwright disponible; PW_EXE=/ruta/chromium opcional)
// Si cambias la lista de colores (PRE en src/settings.js), vuelve a ejecutarlo y actualiza msIco (src/head.html) y COLORS (site/_worker.js).
// El dibujo: la pantalla de inicio de la MediaNav (3 × 2 botones) con el botón central en blanco, el «retocado».
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SITE = path.join(ROOT, 'site');
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const tiles = lt => { const t = lt ? 'fill="#fff" fill-opacity=".42"' : 'fill="#06150f"', r = (x, y, o) => `<rect x="${x}" y="${y}" width="13" height="13" rx="3" ${o || t}/>`;
  return r(9, 17) + r(25.5, 17, 'fill="#fff"') + r(42, 17) + r(9, 34) + r(25.5, 34) + r(42, 34); };
const svg = (c, lt, mask) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + (mask
  ? `<rect width="64" height="64" fill="${c}"/><g transform="translate(32 32) scale(.74) translate(-32 -32)">${tiles(lt)}</g>`
  : `<rect width="64" height="64" rx="15" fill="${c}"/>${tiles(lt)}`) + `</svg>`;
(async () => {
  const head = fs.readFileSync(path.join(ROOT, 'src/head.html'), 'utf8'), set = fs.readFileSync(path.join(ROOT, 'src/settings.js'), 'utf8');
  const PRE = eval(set.match(/const PRE=(\[\[.*?\]\]);/)[1]);
  const acc = head.match(/(window\.msAcc=function[\s\S]*?\}\};)/)[1];
  const b = await chromium.launch({ executablePath: process.env.PW_EXE || undefined });
  const p = await b.newPage();
  await p.setContent('<script>' + acc + '</script>');
  const cols = await p.evaluate(pre => Object.fromEntries(pre.filter(x => x[1] != null).map(([n, h, s]) => { const a = msAcc(h, s); return [n, [a.fav, a.lt]]; })), PRE);
  const shot = async (s, n, file, bg) => {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<style>*{margin:0}svg{display:block;width:${n}px;height:${n}px}</style>${s}`);
    await p.screenshot({ path: file, omitBackground: true });
  };
  const all = [['', '#059669', false], ...PRE.filter(x => x[1] != null).map(([n]) => [slug(n), ...cols[n]])];
  fs.writeFileSync(path.join(SITE, 'icon.svg'), svg('#059669', false, false) + '\n');
  const base = JSON.parse(fs.readFileSync(path.join(SITE, 'manifest.webmanifest'), 'utf8'));
  fs.mkdirSync(path.join(SITE, 'ic'), { recursive: true });
  const out = {};
  for (const [k, c, lt] of all) {
    const f = k ? n => path.join(SITE, 'ic', `${k}-${n}.png`) : n => path.join(SITE, { 192: 'icon-192.png', 512: 'icon-512.png', mask: 'icon-maskable-512.png', apple: 'apple-touch-icon.png' }[n]);
    await shot(svg(c, lt, false), 192, f(192)); await shot(svg(c, lt, false), 512, f(512));
    await shot(svg(c, lt, true), 512, f('mask')); await shot(svg(c, lt, true), 180, f('apple')); // iPhone redondea él solo
    if (k) {
      const m = JSON.parse(JSON.stringify(base));
      m.icons = [{ src: `ic/${k}-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: `ic/${k}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: `ic/${k}-mask.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }];
      fs.writeFileSync(path.join(SITE, `manifest-${k}.webmanifest`), JSON.stringify(m, null, 2) + '\n');
    }
    out[k || 'esmeralda'] = c + (lt ? ' (botones blancos)' : '');
  }
  console.log(out);
  await b.close();
})();
