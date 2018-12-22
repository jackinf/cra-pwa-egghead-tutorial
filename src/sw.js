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

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
