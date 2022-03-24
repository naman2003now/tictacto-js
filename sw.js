// Storing cache
const cacheName = 'cache-v1';
const resourcesToPrecache = [
    '/',
    'index.html',
    'script.js',
    'assets/xo_icon.svg',
    'assets/stylesheet.css'
]

// Loading Cache
self.addEventListener('install', event => {
    console.log("install event!");
    event.waitUntil(
        caches.open(cacheName)
        .then(cache=> {
            return cache.addAll(resourcesToPrecache);
        })
    )
})

self.addEventListener('activate', event => {
    console.log("activate event!");
})

self.addEventListener('fetch', event => {
    event.respondsWith(caches.match(event.request))
    .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
    })
})
