const fetchMons = require('../server/lib/map');
const webpush = require('../server/lib/webpush');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');
const lambda = require('./lambda');
const debugPush = require('./debug-push');
const sleep = require('system-sleep');

async function init () {
	console.log('[SERVER PUSH]');

	const now = new Date();
	const hours = now.getUTCHours();

	// Don't run when no one's looking (reserve dyno-hours)
	if (hours > 22 || hours < 5) {
		console.log('Not running at night', now);
		return;
	}

	await mongoClient;
	const dataJSON = await SubscriptionModel.find();

	// Heroku
	let platform = '';

	for (let sub of dataJSON) {

		const pushSubscription = sub.subscription;

		let mons = await fetchMons(sub.radius, sub.mons, sub.location);

		const blacklistedHerokuIP = !mons;

		if (blacklistedHerokuIP) {
			await debugPush.send(sub, 'Heroku IP banned 💀. Going Serverless ⚡');
			// Try to fetch them with the lambda
			mons = await lambda.fetchMons(sub);
			platform = '⚡';
		}

		if (!mons) {
			await debugPush.send(sub, 'Still no mons. Giving up 💀💀');
		}

		console.log('[SERVER PUSH] uuid', sub._id);
		console.log('[SERVER PUSH] mons fetched:', mons);

		for (const key in mons) {
			if (mons.hasOwnProperty(key)) {
				const foundMon = mons[key];
				console.log(`[SERVER PUSH] notifying ${sub._id} about ${JSON.stringify(mons[key])}`);

				const shinies = [129,302,355];

				const isShiny = foundMon.shiny === '1';

				if (shinies.includes(foundMon.id)) {
					// We add magikarp and duskull for everyone
					// Ignore the ones that aren't shiny
					if (!isShiny) break;
				}

				const payload = {
					title: `${isShiny ? 'Shiny ' : ''}${foundMon.name} ${platform}`,
					icon: `img/${foundMon.id}.png`,
					message: JSON.stringify({
						location: foundMon.location,
						myLocation: sub.location,
						text: `${foundMon.distance}m away for ${foundMon.despawn} min`
					})
				};

				try {
					await webpush.send(pushSubscription, payload);
				}
				catch (e) {
					console.log(`[SERVER PUSH] SW not registered for ${sub._id}`);
				}
			}
		}

		console.log('[SERVER PUSH] sleeping for 10s');
		sleep(10000);
	}
}

module.exports = init;
