/*NEED TO ADD the code below to main js file
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("sw.js")
    .then((register) => console.log("register object: ", register))
    .catch((err) => console.log("register error: ", err));
} */

const cacheVersion = "v10";
const assets = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./sw.js",
  "./manifest.json",
  "./images/icons/",
  "./assets/to-do.png",
];

/*self.addEventListener("install", (e) => {
  const preCache = async () => {
    const cache = await caches.open(cacheVersion);
    return cache.addAll(assets);
  };
  e.waitUntil(preCache);
});*/
self.addEventListener("install", (e) => {
  console.log("[Servicework] install");
  e.waitUntil(
    caches
      .open(cacheVersion)
      .then((cache) => {
        cache.addAll(assets);
        console.log("install cache: ", cache.keys());
      })
      //.then(() => self.skipWaiting())
      .catch((err) => console.log(`caching error: ${err}`))
  );
});

self.addEventListener("activate", (e) => {
  console.log("[Servicework] Activate");
  e.waitUntil(
    caches.keys().then((allCacheVersions) => {
      return Promise.all(
        allCacheVersions.map((cache) => {
          if (cache !== cacheVersion) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
