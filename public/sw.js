const cacheName = self.location.pathname
const pages = [

  "/hugo-book/docs/about/",
  "/hugo-book/docs/shortcodes/",
  "/hugo-book/docs/shortcodes/buttons/",
  "/hugo-book/docs/shortcodes/columns/",
  "/hugo-book/docs/shortcodes/details/",
  "/hugo-book/docs/shortcodes/experimental/",
  "/hugo-book/docs/shortcodes/experimental/asciinema/",
  "/hugo-book/docs/shortcodes/experimental/badges/",
  "/hugo-book/docs/shortcodes/experimental/cards/",
  "/hugo-book/docs/shortcodes/experimental/images/",
  "/hugo-book/docs/shortcodes/hints/",
  "/hugo-book/docs/shortcodes/mermaid/",
  "/hugo-book/docs/shortcodes/section/",
  "/hugo-book/docs/shortcodes/section/first-page/",
  "/hugo-book/docs/shortcodes/section/second-page/",
  "/hugo-book/docs/shortcodes/steps/",
  "/hugo-book/docs/shortcodes/tabs/",
  "/hugo-book/categories/",
  "/hugo-book/zh/categories/",
  "/hugo-book/he/categories/",
  "/hugo-book/docs/",
  "/hugo-book/zh/",
  "/hugo-book/he/",
  "/hugo-book/docs/shortcodes/katex/",
  "/hugo-book/",
  "/hugo-book/tags/",
  "/hugo-book/zh/tags/",
  "/hugo-book/he/tags/",
  "/hugo-book/book.min.cc2c524ed250aac81b23d1f4af87344917b325208841feca0968fe450f570575.css",
  "/hugo-book/en.search-data.min.b476ef82854d7f4e2475d10cccbebd268946d081dae8121c5c77c33993e92b4a.json",
  "/hugo-book/en.search.min.2a73a3889061dbdb30cea61ce372a40422e5b45a71ac3589274818db9d275474.js",
  
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
