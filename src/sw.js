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


workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
