// Mediaskinhz — service worker: la app abre al instante y funciona sin conexión.
// - Al instalarse guarda TODOS los archivos de esta versión de golpe; si falla uno, sigue la anterior.
// - Se sirve siempre lo guardado. Cada publicación trae un sw.js distinto (V) y el navegador baja la nueva en segundo plano;
//   la app avisa y recarga solo cuando tú pulsas «Actualizar» (tu diseño se guarda antes).
// - Las fuentes de Google se guardan aparte (FONTS) para no perderlas en cada actualización.
// V = 'msz-' + la VER de src/web.js
const V = 'msz-2026-10-29-17';
const FONTS = 'msz-fonts', ICONS = 'msz-iconos-1';
// './' y no 'index.html': Cloudflare Pages redirige /index.html → / y una respuesta redirigida no vale para abrir la página
const SHELL = ['./', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'vistas.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== FONTS && k !== ICONS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    if (u.pathname.endsWith('/version.txt')) return; // siempre a la red: dice si hay versión nueva
    // Biblioteca de iconos (≈1 MB): se descarga la primera vez que se usa y se guarda aparte, para no bajarla en cada versión.
    // Si cambia la biblioteca, sube el número de ICONS.
    if (u.pathname.endsWith('/iconos.json')) {
      e.respondWith(caches.open(ICONS).then(async c => (await c.match(r, { ignoreSearch: true })) || fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; })));
      return;
    }
    // El manifest cambia según el color con el que se instala (lo decide _worker.js por la cookie): de la red y, sin conexión, la copia
    if (u.pathname.endsWith('/manifest.webmanifest')) {
      e.respondWith(fetch(r).then(x => { if (x.ok) { const y = x.clone(); caches.open(V).then(c => c.put('manifest.webmanifest', y)); } return x; })
        .catch(() => caches.open(V).then(c => c.match('manifest.webmanifest'))));
      return;
    }
    if (r.mode === 'navigate') return e.respondWith(caches.open(V).then(c => c.match('./')).then(x => x || fetch(r)));
    return e.respondWith(caches.open(V).then(c => c.match(r, { ignoreSearch: true })).then(x => x || fetch(r)));
  }
  if (/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(FONTS).then(async c => {
      const h = await c.match(r);
      const n = fetch(r).then(x => { if (x.ok || x.type === 'opaque') c.put(r, x.clone()); return x; }).catch(() => h);
      return h || n;
    }));
  }
});
