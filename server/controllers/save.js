const webpush = require('../lib/webpush');
const env = require('node-env-file');
const logger = require('../lib/logger');
const SubscriptionModel = require('../models/sub');

if (!process.env.NODE_ENV) {
	env(__dirname + '/../../.env');
}

const updateMons = async (req) => {
	const uuid = req.cookies && req.cookies.uuid ? req.cookies.uuid : null;
	console.log('\n\n[SAVE] uuid', uuid);

	if (!uuid) {
		return 412;
	}
	const userMons = req.body.mons;

	const body = {
		mons: (userMons.length > 0 && userMons[0] !== '') ? userMons : process.env.DEFAULT_MON_LIST,
		radius: req.body.radius,
		location: req.body.location,
		subscription: req.body.subscription
	};
	console.log(`[SAVE] ${body.mons.length} mons at ${body.radius}m. Subs? ${!!body.subscription}. Location? ${!!body.location}`);

	if (!req.body.subscription) {
		return 500;
	}

	const result = await SubscriptionModel.update({_id: uuid}, body, {upsert: true, setDefaultsOnInsert: true});
	console.log(`[SAVE] Subs Added/Modified: ${JSON.stringify(result)}`);

	await webpush.send(req.body.subscription, {
			title: 'Mon Radar 🤖',
			message: JSON.stringify({
				icon: 'img/logo.png',
				text:`Watching ${body.mons.length} pokémon in a ${body.radius}m radius`
			})
		});

	return 200;
};

module.exports = async function (req, res) {
	logger.received(req, req.path);
	const status = await updateMons(req);
	console.log(`[SAVE] ${req.path} responded with ${status}`);
	res.sendStatus(status);
};