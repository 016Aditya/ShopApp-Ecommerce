/**
 * sw.js — Stage 1 Service Worker
 * Strategy: Cache-First for all static assets.
 *
 * CACHED (static assets only):
 *   - JS bundles / Vite chunks
 *   - CSS
 *   - Fonts
 *   - Images / SVG / favicon
 *
 * NEVER CACHED (dynamic / sensitive):
 *   - API responses  (/api/)
 *   - Auth endpoints (/auth/, /oauth2/)
 *   - Orders, Cart, Reviews, User profile
 *
 * Cache versioning: SW_VERSION is replaced at build time by vite.config.js
 * via the define plugin. Changing the version automatically invalidates the
 * old cache so stale assets are never served after a deployment.
 */

const SW_VERSION = self.__SW_VERSION__ || 'v1';
const CACHE_NAME = `ecom-static-${SW_VERSION}`;

// Asset types we want to cache
const CACHEABLE_EXTENSIONS = [
  '.js', '.mjs', '.css',
  '.woff', '.woff2', '.ttf', '.otf',
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.ico', '.gif',
];

// URL fragments that must NEVER be cached
const BYPASS_PATTERNS = [
  '/api/',
  '/auth/',
  '/oauth2/',
  '/orders',
  '/cart',
  '/reviews',
  '/profile',
  '/user',
  '/checkout',
];

function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  // Never cache cross-origin API / auth requests
  if (BYPASS_PATTERNS.some((p) => url.pathname.startsWith(p) || url.href.includes(p))) {
    return false;
  }
  // Only cache same-origin requests or font/static CDN assets
  const ext = url.pathname.slice(url.pathname.lastIndexOf('.'));
  return CACHEABLE_EXTENSIONS.includes(ext);
}

// ── Install: pre-cache nothing — assets are cached on first navigation ──────
self.addEventListener('install', (event) => {
  // Skip waiting so the new SW activates immediately on deployment
  self.skipWaiting();
});

// ── Activate: delete all caches from previous SW versions ───────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First for static assets; network-only for everything else ───
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return; // let the browser handle it normally

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached; // Cache hit — serve immediately

      // Cache miss — fetch from network, store, then return
      try {
        const response = await fetch(event.request);
        // Only cache valid 2xx responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        // Network failed and nothing cached — return nothing (browser shows error)
        return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
      }
    })
  );
});
