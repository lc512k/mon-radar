const logger = require('../util/logger');
const SubscriptionModel = require('../models/sub');

const subscribe = async (req) => {
	console.log('subscribe');
	let status;

	try {
		const bodyStr = JSON.stringify(req.body, null, 2);
		const uuid = req.cookies.uuid;
		console.log('subscribing bodyStr', bodyStr);

		if (!req.body || bodyStr === '{}') {
			console.log(`Unsubscribing ${uuid}`);
			console.log('mongo client done');
			SubscriptionModel.remove({_id: uuid}, (err, result) => {
				console.log('removed', result);
				console.log('error', err);
			});
			// TODO don't remove the whole thing, just the subscription
			status = 204; // Deleted
		}
		else {

			console.log('subscribing');
			const sub = await SubscriptionModel.findOne({_id: uuid});

			console.log(sub);
			const body = {
				mons: sub ? sub.mons : process.env.DEFAULT_MON_LIST,
				radius: sub ? sub.radius : 0,
				location: sub ? sub.location : {},
				subscription: req.body
			};

			console.log('body', body);
			SubscriptionModel.update({_id: uuid}, body, {upsert: true, setDefaultsOnInsert: true}, (err, result) => {
				console.log(`subscribe.js Subs Added/Modified: ${JSON.stringify(result)}`);
				// TODO 201 if created
				status = 200; // OK
			});
		}
		return status;
	}
	catch (e) {
		console.log(e);
		return 500;
	}
};


module.exports = async function (req, res) {
	logger.received(req, req.path);
	const status = await subscribe(req);
	console.log(`${req.path} responded with ${status}`);
	res.sendStatus(200); // TODO get actual code
};
