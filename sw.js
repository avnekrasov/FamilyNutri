// FamilyNutri Service Worker — offline cache
const CACHE = 'familynutri-v8';
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
  if (url.hostname.includes('firebaseapp.com')) return;
  if (url.hostname.includes('gstatic.com')) return;

  // Network first for everything — always try to get fresh version
  e.respondWith(
    fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return resp;
    }).catch(() =>
      caches.match(e.request).then(cached =>
        cached || new Response('Нет интернета', { status: 503 })
      )
    )
  );
});
