const cacheName = "repozen-cache-v1";
const assets = [
  "/",
  "/index.html",
  "/src/assets/screenshot.png",
  "/src/assets/logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/src/styles.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
