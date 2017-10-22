const fetchMons = require('../server/lib/map');
const webpush = require('../server/lib/webpush');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');
const lambda = require('./lambda');
const sleep = require('system-sleep');

async function init () {
	console.log('[SERVER PUSH]');

	await mongoClient;
	const dataJSON = await SubscriptionModel.find();

	for (let sub of dataJSON) {

		const pushSubscription = sub.subscription;

		let mons = await fetchMons(sub.radius, sub.mons, sub.location);

		const blacklistedHerokuIP = !mons;

		if (blacklistedHerokuIP) {
			// Let me know
			if (sub._id === process.env.LAURA_MOBILE_UUID) {
				console.log('[SERVER PUSH] sending blacklist push', sub._id);
				await webpush.send(pushSubscription, {
					icon: 'img/blacklist.png',
					title: 'Mon Radar',
					message: JSON.stringify({
						text: 'Heroku IP 💀. Going Serverless ⚡'
					})
				});
			}

			// Try to fetch them with the lambda
			mons = await lambda.fetchMons(sub);
		}

		if (!mons) {
			console.log(`[SERVER PUSH] Still no mons. Giving up on ${sub._id}`);
			break;
		}

		console.log('[SERVER PUSH] uuid', sub._id);
		console.log('[SERVER PUSH] mons fetched:', mons);

		for (const key in mons) {
			if (mons.hasOwnProperty(key)) {
				const foundMon = mons[key];
				console.log(`[SERVER PUSH] notifying ${sub._id} about ${JSON.stringify(mons[key])}`);

				const payload = {
					title: `${foundMon.name}`,
					icon: `img/${foundMon.id}.png`,
					message: JSON.stringify({
						location: foundMon.location,
						myLocation: sub.location,
						text: `${foundMon.distance}m away for ${foundMon.despawn} more minutes`
					})
				};

				await webpush.send(pushSubscription, payload);
			}
		}

		console.log('[SERVER PUSH] sleeping for 10s');
		sleep(10000);
	}
}

module.exports = init;
