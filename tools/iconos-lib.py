# Genera site/iconos.json: la biblioteca de iconos de la app, a partir de Tabler Icons (MIT, https://tabler.io/icons).
# Uso: git clone --depth 1 --filter=blob:none --sparse https://github.com/tabler/tabler-icons /tmp/tabler
#      git -C /tmp/tabler sparse-checkout set icons/outline icons/filled
#      python3 tools/iconos-lib.py /tmp/tabler
# Todos los iconos comparten rejilla de 24 y trazo uniforme: por eso se ven coherentes entre sí. Sin marcas comerciales.
import os, re, sys, json
T = sys.argv[1]
CATS = [('Media', 'Multimedia'), ('Devices', 'Dispositivos'), ('Vehicles', 'Vehículos'), ('Map', 'Mapa y lugares'), ('Communication', 'Comunicación'),
        ('System', 'Sistema'), ('Arrows', 'Flechas'), ('Weather', 'Tiempo'), ('Electrical', 'Electricidad'), ('Photography', 'Fotografía'),
        ('Symbols', 'Símbolos'), ('Nature', 'Naturaleza'), ('Buildings', 'Edificios'), ('Computers', 'Ordenadores'), ('Shapes', 'Formas'),
        ('Mood', 'Caras'), ('Design', 'Diseño'), ('Charts', 'Gráficos'), ('Badges', 'Insignias'), ('Gestures', 'Gestos'), ('Animals', 'Animales'),
        ('Health', 'Salud'), ('Sport', 'Deporte'), ('Food', 'Comida'), ('E-commerce', 'Compras'), ('Document', 'Documentos')]
CI = {c: i for i, (c, _) in enumerate(CATS)}
# Selección para la radio: [nombre en Tabler, nombre en español]
RADIO = [('navigation', 'Navegación'), ('map-2', 'Mapa'), ('map-pin', 'Destino'), ('route', 'Ruta'), ('compass', 'Brújula'), ('gps', 'GPS'),
  ('radio', 'Radio'), ('antenna', 'Antena'), ('broadcast', 'Emisión'), ('music', 'Música'), ('player-play', 'Reproducir'), ('disc', 'Disco'),
  ('headphones', 'Auriculares'), ('playlist', 'Lista'), ('microphone', 'Micrófono'), ('volume', 'Volumen'), ('usb', 'USB'),
  ('phone', 'Teléfono'), ('phone-call', 'Llamada'), ('address-book', 'Contactos'), ('message', 'Mensajes'), ('bluetooth', 'Bluetooth'),
  ('device-mobile', 'Móvil'), ('settings', 'Ajustes'), ('adjustments-horizontal', 'Controles'), ('tool', 'Herramienta'),
  ('leaf', 'Hoja'), ('plant-2', 'Planta'), ('gauge', 'Indicador'), ('chart-line', 'Gráfica'), ('trophy', 'Trofeo'),
  ('car', 'Coche'), ('steering-wheel', 'Volante'), ('engine', 'Motor'), ('gas-station', 'Gasolinera'), ('charging-pile', 'Cargador'),
  ('battery-automotive', 'Batería'), ('manual-gearbox', 'Cambio'), ('car-fan', 'Climatización'), ('temperature', 'Temperatura'),
  ('snowflake', 'Frío'), ('sun', 'Sol'), ('moon', 'Luna'), ('brightness', 'Brillo'), ('clock', 'Reloj'), ('calendar', 'Calendario'),
  ('home', 'Casa'), ('star', 'Estrella'), ('heart', 'Corazón'), ('bolt', 'Rayo'), ('power', 'Encendido'), ('info-circle', 'Información'),
  ('alert-triangle', 'Aviso'), ('camera', 'Cámara'), ('video', 'Vídeo'), ('photo', 'Foto'), ('wifi', 'Wifi'), ('world', 'Mundo'),
  ('layout-grid', 'Menú'), ('flame', 'Llama'), ('mountain', 'Montaña'), ('road', 'Carretera'), ('parking', 'Aparcar')]
def read(p):
    t = open(p).read()
    ds = [d for d in re.findall(r' d="([^"]+)"', t) if d != 'M0 0h24v24H0z']
    m = re.search(r'category:\s*(.+)', t); tg = re.search(r'tags:\s*\[(.*?)\]', t)
    return ds, (m.group(1).strip() if m else ''), ([x.strip().strip('"\'') for x in tg.group(1).split(',')] if tg else [])
items, fill, miss = [], {}, []
for f in sorted(os.listdir(os.path.join(T, 'icons/outline'))):
    n = f[:-4]; ds, cat, tags = read(os.path.join(T, 'icons/outline', f))
    if cat not in CI or not ds: continue
    items.append([n, CI[cat], ' '.join(t for t in tags[:8] if t and t != n), '|'.join(ds)])
    fp = os.path.join(T, 'icons/filled', f)
    if os.path.exists(fp):
        fd, _, _ = read(fp)
        if fd: fill[n] = '|'.join(fd)
names = {i[0] for i in items}
for n, _ in RADIO:
    if n not in names: miss.append(n)
if miss: sys.exit('No existen en Tabler: ' + ', '.join(miss))
lic = 'Iconos: Tabler Icons (https://tabler.io/icons). MIT License, Copyright (c) 2020-2026 Paweł Kuna.'
out = {'v': 1, 'lic': lic, 'cats': [es for _, es in CATS], 'radio': RADIO, 'i': items, 'f': fill}
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'iconos.json')
open(dst, 'w').write(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
print(len(items), 'iconos,', len(fill), 'con versión rellena,', os.path.getsize(dst) // 1024, 'KB')
