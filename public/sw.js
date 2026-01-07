const cacheName = self.location.pathname
const pages = [

  "/selin/docs/about/",
  "/selin/docs/writing/",
  "/selin/",
  "/selin/zh/",
  "/selin/he/",
  "/selin/categories/",
  "/selin/zh/categories/",
  "/selin/he/categories/",
  "/selin/docs/",
  "/selin/tags/",
  "/selin/zh/tags/",
  "/selin/he/tags/",
  "/selin/book.min.cc2c524ed250aac81b23d1f4af87344917b325208841feca0968fe450f570575.css",
  "/selin/en.search-data.min.58ba338dc1af5c29a15b97082775494763f6822460755490211876e7fbe68270.json",
  "/selin/en.search.min.6c2704c813dbdd0a478b4a497404a7daeece466439c290e2d9208e4d64054dc3.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
