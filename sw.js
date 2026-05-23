var CACHE = 'flippybird-v3.0.0';

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(function(keys) { return Promise.all(keys.map(function(k) { return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(function(r) { return r; }).catch(function() {
      return caches.match(e.request);
    })
  );
});
