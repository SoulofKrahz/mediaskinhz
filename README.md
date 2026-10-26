# Mediaskinhz

Webapp personal creada por Krahz para cambiar la apariencia de la radio MediaNav (Evolution) del Renault Clio 4:
colores, botones e iconos de las imágenes BMP de la carpeta `M1`, pensada para usarla desde el móvil.
Sin servidor: el backup, los diseños y el historial viven en el navegador (IndexedDB). No se envía nada a ningún sitio.

La web está en `site/` y se publica sola en Cloudflare Pages al subir cambios a la rama `main`
(ver `.github/workflows/deploy.yml`): primero se prueba en un navegador real y solo se publica si todo pasa.

- El código está en `src/` y `python3 build.py` lo junta en `site/index.html` (un único archivo). Sube los dos.
- Versión visible en la app: menú ⋯ → Ajustes e historial. Si hay una más nueva publicada, la app avisa.
- En cada cambio: subir `VER` en `src/web.js`, `V` en `site/sw.js` (`msz-` + la misma versión) y añadir la entrada en `CHANGES`.
- Formato de `VER`: `AAAA-MM-DD-N` (N = 0, 1, 2… dentro del día) y `AAAA-MM-DD-N.M` para cambios menores.
- Iconos: `node tools/iconos.cjs` (con Playwright) regenera los PNG de `site/` a partir del dibujo.

## Estructura de `src/`
- `head.html` — estilos (los de Noticiahz) y el esqueleto de la página.
- `core.js` — lectura y escritura de BMP de 8 bits, colores, cuantizador, ZIP.
- `app.js` — estado, vista previa de la pantalla, pantallas (Pantalla, Tema, Imágenes, Editor, Exportar), deshacer.
- `gen.js` — rediseño de botones (estilos, formas, iconos) y kit de prueba.
- `lgu-data.js` — generación de `upgrade.lgu` (ver Créditos).
- `auto.js` — exportación «Automático»: genera instalar.mscr y deshacer.mscr (MortScript, en ANSI). `tools/mortsim.py` es un intérprete mínimo para probarlos sin la radio.
- `settings.js` — confirmaciones, puntos de restauración, historial de exportaciones y ajustes.
- `web.js` — versión, Novedades, Créditos, instalación como app y aviso de versión nueva.

## Pruebas
- `node tests/sw_check.mjs` — versión del service worker, archivos y que `site/index.html` esté al día.
- `node tests/smoke.cjs` — la prueba que ejecuta GitHub antes de publicar (móvil y PC, Playwright, imágenes de ejemplo).

## Créditos y licencia
El formato `upgrade.lgu` sigue `dir2lgu`, del proyecto [MediaNavMods](https://github.com/yosicovich/MediaNavMods)
de yosicovich (GPL-3.0). Por eso Mediaskinhz se publica con licencia GPL-3.0 (ver `LICENSE`).
Sin relación con Renault ni LG; MediaNav es una marca de Renault. Modificar la radio es bajo tu responsabilidad.

**Nunca subas tu backup (`M1`, `.bmp`, `.zip`) a este repositorio: es público.**
