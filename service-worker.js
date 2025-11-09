// service-worker.js
const CACHE_NAME = 'auto-redirect-launcher-v1';
const ASSETS = [
'/',
'/index.html',
'/app.js',
'/manifest.webmanifest',
'/icons/icon-192.png',
'/icons/icon-512.png'
];


self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
);
});


self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
);
self.clients.claim();
});


self.addEventListener('fetch', (event) => {
const req = event.request;
// HTML は Network falling back to cache（オフライン時キャッシュ）
if (req.mode === 'navigate') {
event.respondWith(
fetch(req).catch(() => caches.match('/index.html'))
);
return;
}
// それ以外は Cache first
event.respondWith(
caches.match(req).then((res) => res || fetch(req))
);
});
