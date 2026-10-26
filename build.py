# Junta src/ en un único index.html.
#   site/index.html  → la versión web (Cloudflare Pages): con manifest, iconos y service worker
#   index.html       → la vista previa (sin manifest: no instala ni registra el service worker)
# Uso: python3 build.py
import os, re
D = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(D, p), encoding='utf-8').read()
core = rd('src/core.js'); h = rd('src/head.html'); a = rd('src/app.js')
g = rd('src/lgu-data.js') + rd('src/gen.js') + rd('src/settings.js') + rd('src/auto.js') + rd('src/icons.js') + rd('src/icostyle.js') + rd('src/web.js')
assert a.count("boot();\n") == 1 and h.count('<!--WEBHEAD-->') == 1
js = "'use strict';\n" + core + a.replace("boot();\n", g + "\nboot();\n")
# crossorigin="use-credentials": sin esto Chrome pide el manifest SIN cookies y _worker.js no ve el color (icono siempre verde)
WEBHEAD = '''<link rel="manifest" href="manifest.webmanifest" crossorigin="use-credentials">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Mediaskinhz">
<meta name="apple-mobile-web-app-status-bar-style" content="default">'''
page = lambda head: h.replace('<!--WEBHEAD-->', head) + "\n<script>\n" + js + "</script>\n"
open(os.path.join(D, 'site/index.html'), 'w', encoding='utf-8').write(page(WEBHEAD))
open(os.path.join(D, 'index.html'), 'w', encoding='utf-8').write(page(''))
sw = rd('site/sw.js'); ver = re.search(r"const VER='([^']+)'", js).group(1)
v = re.search(r"const V = 'msz-([^']+)'", sw)
print('versión', ver, '' if v and v.group(1) == ver else '· AVISO: sube V en site/sw.js a msz-' + ver)
os.makedirs('/tmp/claude-0/-home-claude/7535285a-a6ef-58d3-9007-8ea192dc6cdf/scratchpad', exist_ok=True) if os.path.isdir('/tmp/claude-0') else None
if os.path.isdir('/tmp/claude-0'): open('/tmp/claude-0/-home-claude/7535285a-a6ef-58d3-9007-8ea192dc6cdf/scratchpad/chk.js', 'w').write(js)
