const CACHE_NAME = "erasmus-survival-v2";
const ASSETS = [
  "/ErasmusSupervivience/", 
  "/ErasmusSupervivience/pantry", 
  "/ErasmusSupervivience/lists", 
  "/ErasmusSupervivience/schedule", 
  "/ErasmusSupervivience/settings",
  "/ErasmusSupervivience/mascot/pose_1.png",
  "/ErasmusSupervivience/mascot/pose_2.png",
  "/ErasmusSupervivience/mascot/pose_3.png",
  "/ErasmusSupervivience/mascot/pose_4.png",
  "/ErasmusSupervivience/mascot/pose_5.png",
  "/ErasmusSupervivience/mascot/pose_6.png",
  "/ErasmusSupervivience/mascot/mascot.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // For images and assets, try cache first, then network
  if (event.request.url.includes("/mascot/") || event.request.url.includes(".png") || event.request.url.includes(".webp")) {
     event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
