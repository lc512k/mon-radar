const fetchMons = require('../server/lib/map');
const webpush = require('../server/lib/webpush');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');
const lambda = require('./lambda');
const debugPush = require('./debug-push');
const sleep = require('system-sleep');

const mons = async (dataJSON, time, isRaids) => {
	// Heroku
	let platform = '';

	for (let sub of dataJSON) {

		const pushSubscription = sub.subscription;

		let mons;

		if (isRaids) {
			mons = await fetchMons(sub.raidsRadius, sub.raids, sub.location, isRaids);
		}
		else {
			mons = await fetchMons(sub.radius, sub.mons, sub.location);
		}

		const blacklistedHerokuIP = !mons;

		if (blacklistedHerokuIP) {
			await debugPush.send(sub, 'Heroku IP banned 💀. Going Serverless ⚡');
			// Try to fetch them with the lambda
			mons = await lambda.fetchMons(sub, isRaids);
			platform = '⚡';
		}

		if (!mons) {
			await debugPush.send(sub, 'Still no mons. Giving up 💀💀', true);
		}

		console.log('[SERVER PUSH] uuid', sub._id);
		console.log('[SERVER PUSH] mons fetched:', mons);

		for (const key in mons) {
			if (mons.hasOwnProperty(key)) {
				const foundMon = mons[key];
				console.log(`[SERVER PUSH] notifying ${sub._id} about ${JSON.stringify(mons[key])}`);

				const shinies = [129,302,355];

				const isShiny = foundMon.shiny === '1';

				if (shinies.includes(parseInt(foundMon.id, 10))) {
					// We add magikarp and duskull for everyone
					// Ignore the ones that aren't shiny
					console.log('[SERVER PUSH] found potential shiny', foundMon)
					if (!isShiny) break;
				}

				const payload = {
					title: `${isShiny ? 'Shiny ' : ''}${foundMon.name} ${isRaids ? 'Raid ' : ''}${platform}`,
					icon: `img/${foundMon.id}@2x.webp`,
					message: JSON.stringify({
						location: foundMon.location,
						myLocation: sub.location,
						text: `(${time}) ${foundMon.distance}m away for ${foundMon.despawn} min`
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
};

async function init () {
	console.log('[SERVER PUSH]');

	const now = new Date();
	const hours = now.getUTCHours();
	// Timestamp
	let time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
	time = hours < 12 ? time + 'am' : time + 'pm';


	// Don't run when no one's looking (save dyno-hours)
	if (hours > 21 || hours < 5) {
		console.log('Not running at night', now);
		return;
	}

	await mongoClient;
	const dataJSON = await SubscriptionModel.find();

	await mons(dataJSON, time);
	await mons(dataJSON, time, true);
}

module.exports = init;
