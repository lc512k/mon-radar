const webpush = require('../server/lib/webpush');
const send = async (sub, message, icon = 'default') => {

	if (sub._id === process.env.LAURA_MOBILE_UUID) {
		console.log(`[DEBUG PUSH] ${message} to`, sub._id);
		await webpush.send(sub.subscription, {
			icon: `img/${icon}.png`,
			title: 'Mon Radar',
			message: JSON.stringify({
				text: message
			})
		});
	}
};

module.exports = { send };
