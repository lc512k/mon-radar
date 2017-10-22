const webpush = require('web-push');
const env = require('node-env-file');

const PUBLIC_KEY = 'BOEwwTyknxDzuCzEEhZEj4Gu0P0ZnwBbhgaxRVIdwvhEhTpw68lAHXuNPqTvrIH6l2ONFbs4SVOP6SjswWB7bQ0';
const PRIVATE_KEY = 'DHV5jCiSxyBwCr7rfZYlzTsgT_3V507-dgDkiqoFH4U';
const EMAIL = 'mailto:laura.carvajal@gmail.com';
const NODE_ENV = 'lambda';

if (!NODE_ENV) {
	env(__dirname + '/../../.env');
}

webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
webpush.setVapidDetails(
	EMAIL,
	PUBLIC_KEY,
	PRIVATE_KEY
);

const send = (pushSubscription, payload) => {
	return webpush.sendNotification(pushSubscription, JSON.stringify(payload));
};

module.exports = {send};