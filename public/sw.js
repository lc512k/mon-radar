/* global clients */

// FIX key
const applicationServerPublicKey = 'BMsYwcbTzJziGq_ZUWclTO1OtYqmhP0K6xN94616BinBNTfxJyiEhIMS7B4iFpIkY2h79d6aAb1rkUhPeC41Ii8';

function urlB64ToUint8Array (base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

self.addEventListener('push', function (event) {

	console.log(`[Service Worker] Push Received ${event.data}`);
	console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

	const payload = event.data.json();
	const title = payload.title;
	const options = {
		body: JSON.parse(payload.message).text,
		icon: payload.icon,
		data: {
			location: JSON.parse(payload.message).location,
			myLocation: JSON.parse(payload.message).myLocation
		}
	};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Notification click Received.', event.notification);
	let target = '/';
	const loc = event.notification.data.location;
	const myLoc = event.notification.data.myLocation;

	if (loc && myLoc) {
		// target = `https://www.google.com/maps/dir/?api=1&${myLoc.lat},${myLoc.lng}&destination=${loc.lat},${loc.lng}&travelmode=walking&amp;ll=`;
		target = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&travelmode=walking`;
		console.log('[Service Worker]', target);
		event.waitUntil(
			clients.openWindow(target)
		);
	}
	event.notification.close();
});

self.addEventListener('pushsubscriptionchange', function (event) {
	console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	event.waitUntil(
		self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		})
		.then(function (newSubscription) {
			console.log('[Service Worker] New subscription: ', newSubscription);
		})
	);
});

// OFFLINE
self.addEventListener('install', (e) => {
	self.skipWaiting();
	e.waitUntil(
		caches.open('monradar2.3-nogoogle').then((cache) => {
			//TODO make two bundles, one we can cache (with libs)
			return cache.addAll([
				'/img/location-blue.png',
				'/lib/material.min.css'
			]);
		})
		.catch(e => {
			console.log('ERROR', e);
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'same-origin') {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (!response){
					console.log('[SERVICE WORKER] cache MISS for ', event.request.url);
				}
				return response || fetch(event.request);
			})
		);
	}
});

self.addEventListener('activate', function (event) {
	console.log('[SERVICE WORKER] Activating new service worker...');
	// FIX update on server here too
	// if we don't and the user doesn't click Submit
	// push notifications will fail (server will have the old version)
	const cacheWhitelist = ['monradar2.3-nogoogle'];

	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
