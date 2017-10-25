const webpush = require('../lib/webpush');
const SubscriptionModel = require('../models/sub');

const updateMons = async (req) => {
	const uuid = req.cookies && req.cookies.uuid ? req.cookies.uuid : null;
	console.log('\n\n[SAVE] uuid', uuid);

	if (!uuid || !req.body.subscription) {
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

	try {
		const result = await SubscriptionModel.update({_id: uuid}, body, {upsert: true, setDefaultsOnInsert: true});
		console.log(`[SAVE] Subs Added/Modified: ${JSON.stringify(result)}`);

		await webpush.send(req.body.subscription, {
				title: 'Mon Radar 🤖',
				message: JSON.stringify({
					icon: 'img/logo.png',
					text:`Watching ${body.mons.length} pokémon in a ${body.radius}m radius`
				})
			});
	}
	catch(e) {
		console.log('[SAVE] error', e);
		return 500;
	}

	return 200;
};

module.exports = async function (req, res) {
	console.log(`\n***** START Request received on ${req.path} ******`);
	console.log('req.body');
	console.log(JSON.stringify(req.body, null, 2));
	console.log('req.cookies');
	console.log(JSON.stringify(req.cookies, null, 2));
	console.log(`***** END Request received on ${req.path} ******\n`);

	const status = await updateMons(req);
	console.log(`[SAVE] ${req.path} responded with ${status}`);
	res.status(status);
	res.send(req.body.location);
};