/* ============================================================
   BLD Lipa Youth Ministry — Emergence Digital Invitation
   Service Worker (FR-46, FR-47, FR-48)
   ============================================================ */

const CACHE_VERSION = 'emergence-v2';
const RUNTIME_CACHE = 'emergence-runtime-v2';

// Assets precached on install (FR-46)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './animation.js',
  './config.js',
  './manifest.json',
  './public/bldym-logo.jpg',
  // Anchor photos
  './public/penta-1.jpg',
  './public/penta-2.jpg',
  './public/penta-3.jpg',
  './public/penta-4.jpg',
  './public/penta-5.jpg',
];

// ── Install: precache core assets ────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for precached; cache-then-network for ambient ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  const isPrecached = PRECACHE_ASSETS.some(a => url.pathname.endsWith(a.replace('./', '/')));

  if (isPrecached) {
    // Cache-first
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Ambient pool photos: cache-then-network (FR-47)
  if (url.pathname.includes('/public/penta-')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch {
          // Offline and not cached — return empty 204 so the slideshow skips gracefully (AC-18)
          return new Response(null, { status: 204 });
        }
      })
    );
  }
});
