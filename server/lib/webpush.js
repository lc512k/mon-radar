const webpush = require('web-push');

// FIX add GCM_API_KEY to heroku
webpush.setGCMAPIKey(process.env.GCM_API_KEY);
webpush.setVapidDetails(
	process.env.EMAIL,
	process.env.PUBLIC_KEY,
	process.env.PRIVATE_KEY
);

const send = (pushSubscription, payload) => {
	return webpush.sendNotification(pushSubscription, JSON.stringify(payload));
};

module.exports = {send};