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

	const title = 'Mon Radar';
	const options = {
		body: event.data.text(),
		icon: 'images/icon.png',
		badge: 'images/badge.png'
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Notification click Received.');

	event.notification.close();

	event.waitUntil(
		clients.openWindow('https://londonpogomap.com')
	);
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

			// fetch('/api/subscribe', {
			// 	method: 'POST',
			// 	headers: {
			// 		'content-type': 'application/json'
			// 	},
			// 	credentials: 'same-origin',
			// 	timeout: 2000,
			// 	body: JSON.stringify(newSubscription)
			// })
			// .catch(e => {console.error(e);});
		})
	);
});
