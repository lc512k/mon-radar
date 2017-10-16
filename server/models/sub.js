const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
		_id: String,
		mons: [],
		subscription: {
			endpoint: String,
			expirationTime: String,
			keys: {
				p256dh: String,
				auth: String
			}
		},
		radius: String,
		location: {
			lat: String,
			lng: String
		}
});

module.exports = mongoose.model('Sub', subscriptionSchema);