# Vistas de Ajustes y Driving eco: el análisis del programa no las trae, así que se dibujan a mano con el mismo esquema que las de Radio
# (filas de 67 px en y = 106, 178, 250, 322; textos en x = 72; botones desde x = 364) y las proporciones de las fotos del coche (27/10/2026).
W = '#ffffff'
def T(x, y, w, h, t): return ['', x, y, w, h, 'i', t, [x, y, w, h], W]
def B(f, x, y, w, h, t=''): return [f, x, y, w, h, 'b', t, [x, y, w, h], W]
def I(f, x, y, w, h, t=''): return [f, x, y, w, h, 'i', t, [x, y, w, h], W]
ROWS = [106, 178, 250, 322]
def base(pre, title, tabs, cur):
    c = [I(f'{pre}/{"setting_indi_line" if pre == "setting" else "eco_indi_ine"}.bmp', 0, 0, 800, 102), T(24, 14, 380, 40, title)]
    c.append(B(f'{pre}/{pre}_softkey_home_btn.bmp', 0, 419, 108, 61))
    n = len(tabs); w = 172 if n == 4 else 230
    for i, t in enumerate(tabs):
        x = 109 + i * (w + 1)
        c.append(B(f'{pre}/{pre}_softkey_{n}_{i + 1}_btn.bmp', x, 419, w, 61, t))
        c.append(I(f'{pre}/{pre}_parting_line.bmp', x - 1, 419, 1, 61))
    return c
def rowlabels(c, pre, labels):
    for y, t in zip(ROWS, labels):
        c.append(I(f'{pre}/{pre}_dot.bmp', 51, y + 31, 6, 6)); c.append(T(72, y, 280, 67, t))
def seg(c, pre, y, texts, kind):  # kind 1: 102 px (izquierda, centro, derecha) · 2: 70 px
    w = 102 if kind == 1 else 70
    for i, t in enumerate(texts):
        part = 'left' if i == 0 else 'right' if i == len(texts) - 1 else 'middle'
        c.append(B(f'{pre}/setting_{kind}_{part}_btn.bmp', 364 + i * (w - 1), y, w, 67, t))
def lst(c, pre, items, extra=None):
    c.append(I(f'{pre}/{pre}_list_line.bmp', 74, 106, 598, 282))
    for y, t in zip([107, 177, 247, 317], items): c.append(T(90, y, 560, 70, t))
    c.append(B(f'{pre}/{pre}_scroll_up_btn.bmp', 711, 103, 89, 117)); c.append(B(f'{pre}/{pre}_scroll_down_btn.bmp', 711, 274, 89, 117))
    c.append(I(f'{pre}/{pre}_scrollnumber_bg.bmp', 711, 220, 89, 54, '1/2'))
TABS = ['Audio', 'Pantalla', 'Bluetooth', 'Sistema']
def views():
    out = []
    c = base('setting', 'Ajustes de audio', TABS, 0); rowlabels(c, 'setting', ['Vol/Velocidad', 'Volumen', 'BAL/FAD', 'Sonido'])
    seg(c, 'setting', 106, ['Desc', '1', '2', '3', '4', '5'], 2); seg(c, 'setting', 178, ['Desc', 'Conex'], 1)
    c.append(B('setting/sound_setting_btn.bmp', 364, 250, 102, 67, '▶')); c.append(B('setting/sound_setting_btn.bmp', 364, 322, 102, 67, '▶'))
    out.append({'s': 'setting', 'band': '', 'v': 'Audio', 'c': c})
    c = base('setting', 'Ajustes de pantalla', TABS, 1); rowlabels(c, 'setting', ['Brillo', 'Modo mapa', 'Fondo'])
    seg(c, 'setting', 106, ['Bajo', 'Medio', 'Alto'], 1); seg(c, 'setting', 178, ['Auto', 'Día', 'Noche'], 1); seg(c, 'setting', 250, ['Osc.', 'Claro'], 1)
    out.append({'s': 'setting', 'band': '', 'v': 'Pantalla', 'c': c})
    c = base('setting', 'Ajustes de Bluetooth', TABS, 2); lst(c, 'setting', ['Ver lista de dispositivos Bluetooth', 'Buscar dispositivos Bluetooth', 'Autorización de dispositivo externo', 'Cambiar clave'])
    out.append({'s': 'setting', 'band': '', 'v': 'Bluetooth', 'c': c})
    c = base('setting', 'Ajustes del sistema', TABS, 3); lst(c, 'setting', ['Idioma', 'Reloj/Unidades', 'Ajustes de fábrica', 'Navegación'])
    c.append(B('setting/setting_1_left_btn.bmp', 440, 324, 102, 62, 'Desc')); c.append(B('setting/setting_1_right_btn.bmp', 541, 324, 102, 62, 'Conex'))
    out.append({'s': 'setting', 'band': '', 'v': 'Sistema', 'c': c})
    c = base('eco', 'Driving Eco²', ['Inf. recorrido', 'Clasific. Eco', 'Eco coaching'], 1)
    for y, t, n in zip([135, 185, 235], ['Aceleración', 'Cambio marcha', 'Anticipación'], [3, 2, 4]):
        c.append(I('eco/eco_dot.bmp', 51, y + 20, 6, 6)); c.append(T(72, y, 220, 46, t))
        for k in range(5): c.append(I('eco/eco_scoring_star_img.bmp', 300 + k * 34, y + 8, 30, 30) + [0, 3 if k < n else 0])
    c.append(I('eco/eco_scoring_img.bmp', 540, 100, 226, 184) + [0, 6]); c.append(T(540, 280, 226, 60, '62/100'))
    out.append({'s': 'eco', 'band': '', 'v': 'Clasificación', 'c': c, 'aprox': 1})
    for o in out: o['aprox'] = 1; o['noline'] = 1   # sin la pestaña de la barra de arriba (estas pantallas no la tienen)
    # Común · barra de arriba: señal, batería del móvil, temperatura y reloj (medidos en las fotos de Ajustes y de FM; coinciden en ±3 px)
    for dark, nm in ((False, 'Barra de arriba'), (True, 'Barra de arriba · fondo claro')):
        d = '_dark' if dark else ''
        c = [I('common/common_indi_line.bmp', 0, 0, 800, 78)]
        c.append(I(f'common/common_indi_antenna_icon{d}.bmp', 508, 26, 24, 24) + [0, 5])
        c.append(I(f'common/common_indi_battery_icon{d}.bmp', 547, 26, 28, 24) + [0, 3])
        for k, ch in enumerate('16'): c.append(I(f'common/common_indi_temp_number_img{d}.bmp', 600 + k * 13, 27, 13, 25) + [0, int(ch)])
        c.append(I(f'common/common_indi_temp_c_icon{d}.bmp', 627, 28, 17, 15))
        x = 688
        for ch in '21:52':
            if ch == ':': c.append(I(f'common/common_indi_semicolon_img{d}.bmp', x, 22, 10, 33)); x += 10
            else: c.append(I(f'common/common_indi_clock_number_img{d}.bmp', x, 22, 20, 33) + [0, int(ch)]); x += 20
        out.append({'s': 'common', 'band': '', 'v': nm, 'c': c, 'aprox': 1})
    return out
