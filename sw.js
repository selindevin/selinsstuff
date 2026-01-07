const cacheName = self.location.pathname
const pages = [

  "/selinsstuff/docs/about/",
  "/selinsstuff/docs/writing/",
  "/selinsstuff/categories/",
  "/selinsstuff/zh/categories/",
  "/selinsstuff/he/categories/",
  "/selinsstuff/docs/",
  "/selinsstuff/",
  "/selinsstuff/zh/",
  "/selinsstuff/he/",
  "/selinsstuff/tags/",
  "/selinsstuff/zh/tags/",
  "/selinsstuff/he/tags/",
  "/selinsstuff/book.min.cc2c524ed250aac81b23d1f4af87344917b325208841feca0968fe450f570575.css",
  "/selinsstuff/en.search-data.min.686cb7747ca7262b8df114ec3233b70eac08280c53cc5ce44cbaec06dd42bf63.json",
  "/selinsstuff/en.search.min.e85ec103a0d96716b346c9990c75396fba31e1076cc94f7abebd2ca80298c036.js",
  
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
