const webpush = require('../server/lib/webpush');
const send = async (sub, message, override_verbose) => {

	if (sub._id === process.env.LAURA_MOBILE_UUID && (process.env.VERBOSE || override_verbose)) {
		console.log(`[DEBUG PUSH] ${message} to`, sub._id);
		await webpush.send(sub.subscription, {
			title: 'Mon Radar',
			message: JSON.stringify({
				text: message
			})
		});
	}
};

module.exports = { send };
