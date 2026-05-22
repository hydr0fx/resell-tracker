var CACHE = 'flippybird-v2.2.0';
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
    caches.open(CACHE).then(cache => cache.addAll(URLS).catch(function(){})).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(function(keys) { return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
