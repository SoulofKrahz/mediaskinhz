// Genera los iconos PNG de site/ a partir del dibujo de abajo (el mismo que site/icon.svg y el logo de la app).
// Uso: node tools/iconos.cjs   (con playwright disponible; PW_EXE=/ruta/chromium opcional)
// El dibujo: la pantalla de inicio de la MediaNav (3 × 2 botones) con el botón central en blanco, el «retocado».
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', 'site');
const BG = '#059669', FG = '#06150f';
const tiles = `<g fill="${FG}"><rect x="9" y="17" width="13" height="13" rx="3"/><rect x="25.5" y="17" width="13" height="13" rx="3" fill="#fff"/><rect x="42" y="17" width="13" height="13" rx="3"/>` +
  `<rect x="9" y="34" width="13" height="13" rx="3"/><rect x="25.5" y="34" width="13" height="13" rx="3"/><rect x="42" y="34" width="13" height="13" rx="3"/></g>`;
const svg = mask => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + (mask
  ? `<rect width="64" height="64" fill="${BG}"/><g transform="translate(32 32) scale(.74) translate(-32 -32)">${tiles}</g>`
  : `<rect width="64" height="64" rx="15" fill="${BG}"/>${tiles}`) + `</svg>`;
(async () => {
  fs.writeFileSync(path.join(SITE, 'icon.svg'), svg(false) + '\n');
  const b = await chromium.launch({ executablePath: process.env.PW_EXE || undefined });
  const p = await b.newPage();
  const shot = async (s, n, file, bg) => {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<style>*{margin:0}body{background:${bg || 'transparent'}}svg{display:block;width:${n}px;height:${n}px}</style>${s}`);
    await p.screenshot({ path: path.join(SITE, file), omitBackground: !bg });
  };
  await shot(svg(false), 192, 'icon-192.png');
  await shot(svg(false), 512, 'icon-512.png');
  await shot(svg(true), 512, 'icon-maskable-512.png', BG);
  await shot(svg(true), 180, 'apple-touch-icon.png', BG); // iPhone redondea él solo: sin transparencia
  await b.close();
  console.log('iconos generados en site/');
})();
