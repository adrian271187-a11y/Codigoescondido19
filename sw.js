const CACHE = 'ce19-v4';
const ARCHIVOS = [
  './',
  './index.html',
  './ensenanzas.html',
  './login.html',
  './perfil.html',
  './manifest.json',
  './src/style.css',
  './src/app.js',
  './src/tools.js',
  './src/auth.js',
  './src/perfil.js',
  './src/firebase.js',
  './src/pwa.js',
  './assets/ensenanzas/Icons/icon-192.png',
  './assets/ensenanzas/Icons/icon-512.png',
  './assets/ensenanzas/apocalipsis-tabla.jpg',
  './assets/ensenanzas/los-11-testigos.jpg',
  './assets/ensenanzas/mercaderias-01-palabras.jpg',
  './assets/ensenanzas/mercaderias-02-lapalabra.jpg',
  './assets/ensenanzas/mercaderias-03-lafe.jpg',
  './assets/ensenanzas/mercaderias-04-no.jpg',
  './assets/ensenanzas/mercaderias-05-no2.jpg',
  './assets/ensenanzas/mercaderias-06-preguntas.jpg',
  './assets/ensenanzas/mercaderias-07-preguntas2.jpg',
  './assets/ensenanzas/bautismo.jpg',
  './assets/ensenanzas/matrimonio-dios.jpg',
  './assets/ensenanzas/oracion-padre-nuestro.jpg',
  './assets/ensenanzas/numeros-significado.jpg',
  './assets/ensenanzas/colores-arcoiris.jpg',
  './assets/ensenanzas/pacto-noe.jpg',
  './assets/ensenanzas/deidades-10-11-12.jpg',
  './assets/ensenanzas/apocalipsis-10-planetas.jpg'
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
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() =>
        caches.match('./index.html')
      )
    )
  );
});
