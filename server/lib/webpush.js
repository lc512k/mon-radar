const webpush = require('web-push');

const env = require('node-env-file');

if (!process.env.NODE_ENV) {
	env(__dirname + '/../../.env');
}


console.log(process.env.NODE_ENV)
webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
webpush.setVapidDetails(
	process.env.EMAIL,
	process.env.PUBLIC_KEY,
	process.env.PRIVATE_KEY
);

const send = (pushSubscription, payload) => {
	return webpush.sendNotification(pushSubscription, JSON.stringify(payload));
};

module.exports = {send};