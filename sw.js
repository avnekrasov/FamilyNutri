// FamilyNutri Service Worker — offline cache
const CACHE = 'familynutri-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Don't cache API requests
  if (url.hostname.includes('googleapis.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Network first for navigation, cache first for assets
      if (e.request.mode === 'navigate') {
        return fetch(e.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        }).catch(() => cached || new Response('Нет интернета', { status: 503 }));
      }
      return cached || fetch(e.request);
    })
  );
});
