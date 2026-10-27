# Genera site/vistas.json: las vistas interiores de Radio, Multimedia y Teléfono (posición de cada imagen y texto),
# a partir del análisis del programa de la radio (AppMain 7.0.5) del proyecto MediaNav-to-Evolution-Upgrade
# (m-a-x-s-e-e-l-i-g, GPL-3.0): analysis/firmware/av-layouts.json.
# Uso: python3 tools/vistas.py /ruta/a/MediaNav-to-Evolution-Upgrade
import json, os, sys, collections, re
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
# Textos fijos en español de España (la radio los trae en inglés en el análisis; los de tu radio pueden variar un poco)
ES = {'Main': 'Principal', 'List': 'Lista', 'Presets': 'Presintonía', 'Options': 'Opciones', 'Player': 'Reproductor', 'Dial': 'Marcar',
  'Phone Book': 'Agenda', 'Calling Lists': 'Lista de llamadas', 'Close': 'Cerrar', 'Search by Name': 'Buscar por nombre', 'Folder': 'Carpeta',
  'Track': 'Pista', 'Repeat': 'Repetir', 'Shuffle': 'Aleatorio', 'All': 'Todo', 'On': 'Conex', 'Off': 'Desc', 'Update List': 'Actualizar lista',
  'Announcement': 'Avisos', 'Announcement Setup': 'Ajustes de avisos', 'News': 'Noticias', 'Weather': 'Tiempo', 'Sport': 'Deportes',
  'Financial': 'Economía', 'Transport': 'Tráfico', 'Warning': 'Alerta', 'Event': 'Evento', 'Special Event': 'Evento especial',
  'Program Info': 'Información del programa', 'Region': 'Región', 'Nearby': 'Cercanas', 'Start': 'Iniciar',
  'TA': 'AT', 'Swallowed In The Sea': 'Título de la canción', 'COLDPLAY': 'ARTISTA'}
# Imágenes que la radio solo enseña a veces (la carátula vacía de Multimedia, la barra que ilumina la fila pulsada de una lista): se dibujan tenues
OPT = {'media/media_album_case_noalbum_img.bmp'}
out, seen, sets = [], collections.Counter(), set()
for sc in src['scenarios']:
    g = sc['group']; cs = sc['controls']
    files = [c['filename'].replace('\\', '/').lower() for c in cs if c.get('filename')]
    texts = [c.get('text') or '' for c in cs]
    band = next((t for t in texts if t in SRCS), '')
    nm = name(g, files, texts)
    fk = (g, band, frozenset(files))
    if nm == 'Teclado':   # mismo juego de teclas con otros textos: una vista por juego (1, 2, 3), letras o símbolos y con ALT
        fam = next((k for k in ('keyboard3_', 'keyboard2_', 'keyboard_') if any(k + d in f for f in files for d in '123456789')), '')
        kind = 'símbolos' if 'QWE' in texts else 'letras'
        nm = 'Teclado ' + {'keyboard_': '1', 'keyboard2_': '2', 'keyboard3_': '3'}.get(fam, '') + ' · ' + kind + (' · ALT' if 'ALT' in texts else '')
        fk = (g, nm)
    if nm == 'Otra' or fk in sets: continue   # misma vista con otros datos (p. ej. el teclado en otro idioma)
    sets.add(fk)
    key = (g, band, nm); seen[key] += 1
    if seen[key] > 1: nm = f'{nm} {seen[key]}'
    C, kept = [], []
    def iou(a, b):
        ix = max(0, min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])); iy = max(0, min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1]))
        i = ix * iy; u = a[2] * a[3] + b[2] * b[3] - i
        return i / u if u else 0
    for c in cs:
        # listas de varias páginas (p. ej. Opciones de Radio): el programa crea todas encima; se queda la primera
        r = c['rect']; hf = bool(c.get('filename'))
        if not nm.startswith('Teclado') and any(k[1] == hf and (k[0] == r or iou(k[0], r) > .35) for k in kept): continue
        kept.append((r, hf))
        f = c['filename'].replace('\\', '/').lower() if c.get('filename') else ''
        x, y, w, h = c['rect']
        t = ES.get(c.get('text') or '', c.get('text') or '')
        lr = c.get('label_rect') or [x, y, w, h]
        col = (c.get('colors') or [16777215])[0]
        rgb = '#%02x%02x%02x' % (col & 255, (col >> 8) & 255, (col >> 16) & 255)   # COLORREF 0x00BBGGRR
        C.append([f, x, y, w, h, {'button': 'b', 'image': 'i', 'list': 'l', 'progress': 'p'}[c['kind']], t, lr, rgb] + ([1] if f in OPT or 'list_press' in f else []))
    # título de arriba a la izquierda, como en la radio
    if g == 'phone' and C and C[1][0] == '' and not C[1][6] and nm in ('Marcador', 'Agenda'): C[1][6] = 'Marcar' if nm == 'Marcador' else 'Agenda'
    # el marcador sin llamada solo tiene el botón de inicio abajo: micro y altavoces salen durante la llamada (tenues)
    if nm == 'Marcador':
        for x in C:
            if re.search(r'softkey_(mic|phonespeaker|carspeaker)', x[0]) and len(x) == 9: x.append(1)
    out.append({'s': SCR[g], 'band': band, 'v': nm, 'c': C})
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vistas_manual
out += vistas_manual.views()
BO = {b: i for i, b in enumerate(['FM', 'AM', 'DAB', 'USB', 'BT', 'iPod', 'aha', 'AUX', ''])}
VO = ['Principal', 'Reproductor', 'Marcador', 'Audio', 'Pantalla', 'Bluetooth', 'Sistema', 'Clasificación', 'Lista', 'Agenda', 'Presintonías', 'Opciones', 'Avisos', 'Selector', 'Ventana', 'Asistente', 'Teclado']
vo = lambda v: next((i for i, k in enumerate(VO) if v.startswith(k)), 99)
out.sort(key=lambda o: (['radio', 'media', 'phone', 'setting', 'eco', 'common'].index(o['s']), BO.get(o['band'], 50), vo(o['v']), o['v']))
lic = 'Posiciones de las vistas: análisis del programa de la radio (AppMain 7.0.5) del proyecto MediaNav-to-Evolution-Upgrade (GPL-3.0).'
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'vistas.json')
json.dump({'v': 1, 'lic': lic, 'views': out}, open(dst, 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'vistas,', os.path.getsize(dst) // 1024, 'KB')
for o in out: print(' ', o['s'], o['band'] or '-', '·', o['v'], '·', len(o['c']), 'elementos')
