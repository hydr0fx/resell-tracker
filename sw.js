const CACHE = 'reselltracker-v2';
const URLS = [
  '/resell-tracker/',
  '/resell-tracker/index.html',
  '/resell-tracker/manifest.json',
  '/resell-tracker/icon-192.png',
  '/resell-tracker/icon-512.png',
  '/resell-tracker/apple-icon.png',
  '/resell-tracker/sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
