const CACHE = 'ce19-v2';
const BASE  = '/Codigoescondido19';
const ARCHIVOS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/ensenanzas.html',
  BASE + '/login.html',
  BASE + '/perfil.html',
  BASE + '/manifest.json',
  BASE + '/src/style.css',
  BASE + '/src/app.js',
  BASE + '/src/tools.js',
  BASE + '/src/auth.js',
  BASE + '/src/perfil.js',
  BASE + '/src/firebase.js',
  BASE + '/src/pwa.js',
  BASE + '/assets/icons/icon-192.png',
  BASE + '/assets/icons/icon-512.png',
  BASE + '/assets/ensenanzas/apocalipsis-tabla.jpg',
  BASE + '/assets/ensenanzas/los-11-testigos.jpg',
  BASE + '/assets/ensenanzas/mercaderias-01-palabras.jpg',
  BASE + '/assets/ensenanzas/mercaderias-02-lapalabra.jpg',
  BASE + '/assets/ensenanzas/mercaderias-03-lafe.jpg',
  BASE + '/assets/ensenanzas/mercaderias-04-no.jpg',
  BASE + '/assets/ensenanzas/mercaderias-05-no2.jpg',
  BASE + '/assets/ensenanzas/mercaderias-06-preguntas.jpg',
  BASE + '/assets/ensenanzas/mercaderias-07-preguntas2.jpg',
  BASE + '/assets/ensenanzas/bautismo.jpg',
  BASE + '/assets/ensenanzas/matrimonio-dios.jpg',
  BASE + '/assets/ensenanzas/oracion-padre-nuestro.jpg',
  BASE + '/assets/ensenanzas/numeros-significado.jpg',
  BASE + '/assets/ensenanzas/colores-arcoiris.jpg',
  BASE + '/assets/ensenanzas/pacto-noe.jpg',
  BASE + '/assets/ensenanzas/deidades-10-11-12.jpg'
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
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => {
        if (e.request.destination === 'document') {
          return caches.match(BASE + '/index.html');
        }
      });
    })
  );
});
