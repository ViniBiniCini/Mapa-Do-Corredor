const urlsToCache = [
  //'/',                // página principal
  //'/index.html',
  //'/style.css',
 // '/script.js',
 // 'https://unpkg.com/leaflet/dist/leaflet.css',
 // 'https://unpkg.com/leaflet/dist/leaflet.js'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('v1').then(cache => {
        return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response =>{
            return response || fetch (e.request);

    })
);
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then( (keys)=> Promise.all(keys.filter(key => key !== 'v1').map
        (key => caches.delete(key))))
    );
});