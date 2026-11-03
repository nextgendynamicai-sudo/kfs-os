const CACHE_NAME = 'kfs-os-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/kfs-logo.png',
  '/icon.png',
  '/apple-icon.png',
  '/offline_preload.html',
  '/pos'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Archivos binarios pesados (APK / PDF) siempre directo de red: nunca se cachean
  // para no ocupar decenas de MB ni servir instaladores obsoletos.
  const pathname = new URL(request.url).pathname;
  if (pathname.endsWith('.apk') || pathname.endsWith('.pdf')) {
    return;
  }

  // Network-first strategy for navigation/HTML, JS code chunks and API calls
  if (
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html') ||
    request.url.includes('/_next/') ||
    request.url.includes('/api/')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          // Chunks and dynamic scripts must not return HTML when offline
          const isJsChunk =
            request.url.includes('/_next/static/chunks/') ||
            request.url.includes('/_next/static/') ||
            request.url.endsWith('.js') ||
            request.url.includes('.js?') ||
            request.destination === 'script';

          if (isJsChunk) {
            return new Response('/* offline chunk unavailable */', {
              status: 404,
              statusText: 'Offline Chunk Not Found',
              headers: { 'Content-Type': 'application/javascript' }
            });
          }

          if (request.url.includes('/api/')) {
            return new Response(JSON.stringify({ error: 'offline', offline: true }), {
              status: 503,
              statusText: 'Service Unavailable Offline',
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Fallback universal a la SPA raíz únicamente para navegación/HTML si estamos 100% offline
          const fallbackHtml = (await caches.match('/')) || (await caches.match('/index.html')) || (await caches.match('/offline_preload.html'));
          if (fallbackHtml) return fallbackHtml;
          return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Cache-first strategy for static images and assets with background update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
