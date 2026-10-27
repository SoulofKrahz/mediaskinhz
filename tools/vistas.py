# Genera site/vistas.json: las vistas interiores de Radio, Multimedia y Teléfono (posición de cada imagen y texto),
# a partir del análisis del programa de la radio (AppMain 7.0.5) del proyecto MediaNav-to-Evolution-Upgrade
# (m-a-x-s-e-e-l-i-g, GPL-3.0): analysis/firmware/av-layouts.json.
# Uso: python3 tools/vistas.py /ruta/a/MediaNav-to-Evolution-Upgrade
import json, os, sys, collections
src = json.load(open(os.path.join(sys.argv[1], 'analysis/firmware/av-layouts.json')))
SCR = {'radio': 'radio', 'media': 'media', 'phone': 'phone'}
SRCS = ['FM', 'AM', 'DAB', 'USB', 'iPod', 'BT', 'aha', 'AUX']
def name(group, files, texts):
    has = lambda *ws: any(any(w in f for w in ws) for f in files)
    if has('fulldown_top_btn'): return 'Selector de ' + ('banda' if group == 'radio' else 'fuente' if group == 'media' else 'modo')
    if group == 'phone':
        if has('dial_num'): return 'Marcador'
        if has('keyboard'): return 'Teclado'
        if has('popup_list'): return 'Ventana de lista'
        if has('spvr'): return 'Asistente de voz'
        if has('list_line'): return 'Agenda'
        return 'Otra'
    if 'Announcement Setup' in texts: return 'Avisos'
    if has('list_line') or has('contents_list'): return 'Lista'
    if has('setting_', '_dot.bmp'): return 'Opciones'
    if has('presets_arrow', 'arrow_left'): return 'Presintonías'
    if has('control_', 'thumbsup'): return 'Reproductor' if group == 'media' else 'Principal'
    return 'Otra'
out, seen, sets = [], collections.Counter(), set()
for sc in src['scenarios']:
    g = sc['group']; cs = sc['controls']
    files = [c['filename'].replace('\\', '/').lower() for c in cs if c.get('filename')]
    texts = [c.get('text') or '' for c in cs]
    band = next((t for t in texts if t in SRCS), '')
    nm = name(g, files, texts)
    fk = (g, band, frozenset(files))
    if nm == 'Otra' or fk in sets: continue   # misma vista con otros datos (p. ej. el teclado en otro idioma)
    sets.add(fk)
    key = (g, band, nm); seen[key] += 1
    if seen[key] > 1: nm = f'{nm} {seen[key]}'
    C = []
    for c in cs:
        f = c['filename'].replace('\\', '/').lower() if c.get('filename') else ''
        x, y, w, h = c['rect']
        t = c.get('text') or ''
        lr = c.get('label_rect') or [x, y, w, h]
        col = (c.get('colors') or [16777215])[0]
        rgb = '#%02x%02x%02x' % (col & 255, (col >> 8) & 255, (col >> 16) & 255)   # COLORREF 0x00BBGGRR
        C.append([f, x, y, w, h, {'button': 'b', 'image': 'i', 'list': 'l', 'progress': 'p'}[c['kind']], t, lr, rgb])
    out.append({'s': SCR[g], 'band': band, 'v': nm, 'c': C})
BO = {b: i for i, b in enumerate(['FM', 'AM', 'DAB', 'USB', 'BT', 'iPod', 'aha', 'AUX', ''])}
VO = ['Principal', 'Reproductor', 'Marcador', 'Lista', 'Agenda', 'Presintonías', 'Opciones', 'Avisos', 'Selector', 'Ventana', 'Asistente', 'Teclado']
vo = lambda v: next((i for i, k in enumerate(VO) if v.startswith(k)), 99)
out.sort(key=lambda o: (['radio', 'media', 'phone'].index(o['s']), BO.get(o['band'], 50), vo(o['v']), o['v']))
lic = 'Posiciones de las vistas: análisis del programa de la radio (AppMain 7.0.5) del proyecto MediaNav-to-Evolution-Upgrade (GPL-3.0).'
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'vistas.json')
json.dump({'v': 1, 'lic': lic, 'views': out}, open(dst, 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'vistas,', os.path.getsize(dst) // 1024, 'KB')
for o in out: print(' ', o['s'], o['band'] or '-', '·', o['v'], '·', len(o['c']), 'elementos')
