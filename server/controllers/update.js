const webpush = require('web-push');
const logger = require('../util/logger');
const SubscriptionModel = require('../models/sub');

const updateMons = async (req) => {

	const uuid = req.cookies && req.cookies.uuid ? req.cookies.uuid : null;

	console.log('\nupdateMons()', uuid);

	if (!uuid) {
		// TODO subscribe to push on page load
		return 412; // Precondition failed (sub/cookie missing). Refresh page
	}

	const userMons = req.body.mons;

	const body = {
		mons: (userMons.length > 0 && userMons[0] !== '') ? userMons : process.env.DEFAULT_MON_LIST,
		radius: req.body.radius,
		location: req.body.location
	};

	// Find why sometimes subscription is null from the client here
	if (req.body.subscription) {
		body.subscription = req.body.subscription;

		SubscriptionModel.update({_id: uuid}, body, {upsert: true, setDefaultsOnInsert: true}, (err, result) => {
			console.log(`update.js Subs Added/Modified: ${JSON.stringify(result)}`);

			webpush.sendNotification(req.body.subscription, JSON.stringify({title: 'Push set up correctly'})).catch(function (e) {
				console.log(e);
			});
			return 200;
		});
	}
	else {
		console.log('****NO SUBS*****');
	}

	console.log('body', body);

	// TODO remove
	return 200;
};

module.exports = async function (req, res) {
	logger.received(req, req.path);
	const status = await updateMons(req);
	console.log(`${req.path} responded with ${status}`);
	res.sendStatus(status);
};