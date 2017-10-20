const sleep = require('sleep');
const fetchMons = require('../server/lib/map');
const webpush = require('../server/lib/webpush');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');

async function init () {
	console.log('[SERVER PUSH]');

	await mongoClient;
	const dataJSON = await SubscriptionModel.find();

	for (let sub of dataJSON) {

		const pushSubscription = sub.subscription;

		// TODO if duplicate locations (or close enough) fire off a single request
		const mons = await fetchMons(sub.radius, sub.mons, sub.location);

		if (mons) {
			console.log('[SERVER PUSH] uuid', sub._id);
			console.log('[SERVER PUSH] mons fetched:', mons);

			for (const key in mons) {
				if (mons.hasOwnProperty(key)) {
					const foundMon = mons[key];
					console.log(`notifying ${sub._id} about ${JSON.stringify(mons[key])}`);

					const payload = {
						message: `${foundMon.distance}m away for ${foundMon.despawn} more minutes`,
						title: foundMon.name,
						icon: `img/${foundMon.id}.png`
					};

					await webpush.send(pushSubscription, payload);
				}
			}
		}
		else {
			console.log('[SERVER PUSH] sending blacklist push', sub._id);
			const lauraMobile = sub._id === process.env.LAURA_MOBILE_UUID;

			if (lauraMobile) {
				await webpush.send(pushSubscription, {
					title: 'Mon Radar',
					message: 'Heroku IP blacklisted. Stand by... 💀'
				});
			}
		}

		console.log('sleeping for 10s');
		sleep.sleep(10);
	}
}

module.exports = init;
