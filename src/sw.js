// console.log('In sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

self.addEventListener('install', event => {
  const asyncInstall = new Promise(resolve => {
    console.log('Waiting to resolve...');
    setTimeout(resolve, 1500);
  });

  // console.log('install');
  event.waitUntil(asyncInstall);
});

self.addEventListener('activate', event => {
  console.log('activate');
});

workbox.routing.registerRoute(
  new RegExp('https:.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'cdn-cache'
  }) // alternatives are cacheFirst and networkFirst
);

workbox.routing.registerRoute(
  new RegExp('http://.*:4567.*\.json'),
  workbox.strategies.networkFirst() // good for API caching
);

self.addEventListener('fetch', event => {
  if (event.request.method === "POST" || event.request.method === "DELETE") {
    event.respondWith(
      fetch(event.request).catch(err => {
        return new Response(
          JSON.stringify({ error: "This action disabled while app is offline"}),
          { headers: { 'Content-Type': 'application/json' }}
        )
      })
    )
  }
});

self.addEventListener('push', event => {
  event.waitUntil(self.registrationn.showNotification('Todo List', {
    icon: 'icon-120.png',
    body: event.data.text()
  }))
});

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
