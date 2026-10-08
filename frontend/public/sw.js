// Service Worker for Progressive Web App
// Handles offline caching and background sync

const CACHE_NAME = 'deepfold-v2';
const STATIC_CACHE = 'deepfold-static-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('deepfold-') && name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only public same-origin GET resources may enter a shared cache.
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      url.pathname.startsWith('/api/') || request.headers.has('Authorization')) {
    return;
  }
  const publicPages = new Set(['/', '/marketplace', '/m', '/m/marketplace', '/offline']);
  const path = url.pathname.replace(/\/$/, '') || '/';
  const staticAsset = url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/public/');
  if (!staticAsset && !publicPages.has(path)) return;

  // Static assets - cache first, network fallback
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/public/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            if (response.ok && !/no-store|private/i.test(response.headers.get('Cache-Control') || '')) cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Pages - network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (response.ok && !/no-store|private/i.test(response.headers.get('Cache-Control') || '')) cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/offline');
        });
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Sync queued data with backend
async function syncData() {
  // Open IndexedDB and process sync queue
  // This would be implemented to work with your IndexedDB sync queue
  console.log('Background sync triggered');
}

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'DeepFold', {
      body: data.body || 'You have a new notification',
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      data: data.url,
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
