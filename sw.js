const CACHE = 'ce19-v10';
const ARCHIVOS = [
  '/ensenanzas.html',
  '/login.html',
  '/perfil.html',
  '/manifest.json',
  '/src/style.css',
  '/src/tools.js',
  '/src/auth.js',
  '/src/perfil.js',
  '/src/firebase.js',
  '/src/pwa.js',
  '/assets/ensenanzas/Icons/icon-192.png',
  '/assets/ensenanzas/Icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // index.html y páginas HTML — siempre red primero, caché como fallback
  if (e.request.mode === 'navigate' ||
      url.pathname === '/' ||
      url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // JS y CSS — red primero también para reflejar cambios
  if (url.pathname.startsWith('/src/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets (imágenes, iconos) — caché primero
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => caches.match('/index.html'))
    )
  );
});
