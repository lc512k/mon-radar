const updateBtn = require('./submit-logic.js');

// FIX key
const applicationServerPublicKey = 'BOEwwTyknxDzuCzEEhZEj4Gu0P0ZnwBbhgaxRVIdwvhEhTpw68lAHXuNPqTvrIH6l2ONFbs4SVOP6SjswWB7bQ0';

let swRegistration = null;

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

function subscribeUser () {
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: applicationServerKey
	})
	.then(function (subscription) {
		console.log('User is subscribed.', subscription);
		updateBtn(true);
	})
	.catch(function (err) {
		console.log('Failed to subscribe the user: ', err);
		updateBtn();
	});
}

function initialiseUI () {
	// Set the initial subscription value
	swRegistration.pushManager.getSubscription()
	.then(function (subscription) {
		window.subscription = subscription;

		if (window.subscription) {
			console.log('User IS subscribed.');
		} else {
			console.log('User is NOT subscribed.');
			console.log('Subscribing.');
			subscribeUser();
		}
		updateBtn();
	});
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Service Worker and Push is supported');

	navigator.serviceWorker.register('sw.js')
	.then(function (swReg) {
		console.log('Service Worker is registered', swReg);

		swRegistration = swReg;
		initialiseUI();
	})
	.catch(function (error) {
		console.error('Service Worker Error', error);
	});
} else {
	console.warn('Push messaging is not supported');
}
