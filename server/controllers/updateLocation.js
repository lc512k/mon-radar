const SubscriptionModel = require('../models/sub');

module.exports = async function (req, res) {
	const uuid = req.body.uuid;
	const newLat = req.body.location ? req.body.location.lat: null;
	const newLng = req.body.location ? req.body.location.lng: null;

	if (!uuid || !newLat || !newLng) {
		return res.status(400).end(`Oops, something's missing. Please POST a body like: {uuid: String, location: {lat: String, lng: String}}`);
	}

	try {
		const result = await SubscriptionModel.update({_id: uuid}, {$set: {'location.lat' : newLat, 'location.lng' : newLng}});
		console.log(`[UPDATE LOCATION] Result: ${JSON.stringify(result)}`);

		if (result.ok && result.n === 0) {
			return res.status(404).end(`uuid ${uuid} not found`);
		}
	}
	catch(e) {
		console.log('[UPDATE LOCATION] error', e);
		return res.status(500).end(e.toString());
	}

	return res.status(200).end(`${uuid} updated!`);
};