var CACHE = 'payback-v1.0.0';

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(function(keys) { return Promise.all(keys.map(function(k) { return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      var clone = r.clone();
      caches.open(CACHE).then(function(c) { if(e.request.url.startsWith(self.location.origin)) c.put(e.request, clone); });
      return r;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
