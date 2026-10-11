// Offline support.
// - Pages: network first; every page you open is saved, so it still opens with no internet.
//   (Page HTML is a generic shell. Account data is loaded by the app after it opens and is never stored here.)
// - Static files (JS, CSS, fonts, images): cache first.
// - Nothing cached and no network: /offline.html.
const VERSION = "v3";
const STATIC = `static-${VERSION}`;
const PAGES = `pages-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon.svg", "/", "/privacy-policy", "/terms-of-service"];
const MAX_PAGES = 60;
// On localhost (next dev) file names change constantly, so use the network first and keep the cache only as the offline fallback.
const DEV = self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC).then((c) => c.addAll([OFFLINE_URL, "/icon.svg"])),
      // best effort: a failing page must not block installing
      caches.open(PAGES).then((c) => Promise.all(PRECACHE.slice(2).map((u) => c.add(u).catch(() => {})))),
    ]).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC && k !== PAGES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_PAGES) await Promise.all(keys.slice(0, keys.length - MAX_PAGES).map((k) => cache.delete(k)));
}

// Only plain 200 responses: never save redirects (e.g. sign-in bounces) or errors.
const cacheable = (res) => res && res.ok && res.status === 200 && !res.redirected && res.type === "basic";

async function networkFirst(req, fallback) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(req);
    if (cacheable(res)) {
      cache.put(req, res.clone()).then(() => trim(cache));
    }
    return res;
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    return fallback ? fallback() : Response.error();
  }
}

// The app tells us which page is open so it is saved even when it was loaded before this worker took over.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "CACHE_URL" || typeof data.url !== "string") return;
  const url = new URL(data.url, self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil(
    caches.open(PAGES).then((cache) =>
      fetch(url.pathname + url.search, { credentials: "same-origin" })
        .then((res) => (cacheable(res) ? cache.put(url.pathname + url.search, res).then(() => trim(cache)) : undefined))
        .catch(() => {}),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase and other APIs are never intercepted
  if (url.pathname === "/sw.js" || url.pathname.startsWith("/api/")) return;

  // page loads
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, () => caches.match(OFFLINE_URL)));
    return;
  }

  // in-app navigation (Next.js fetches the next page as an RSC payload)
  if (req.headers.get("RSC") || url.searchParams.has("_rsc")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // static files
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/images/") || url.pathname === "/icon.svg" || url.pathname === "/manifest.webmanifest") {
    if (DEV) {
      event.respondWith(
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => caches.match(req).then((hit) => hit || Response.error())),
      );
      return;
    }
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
