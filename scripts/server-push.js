const webpush = require('web-push');
const env = require('node-env-file');
const fs = require('fs');
env(__dirname + '/../.env');
const fetchMons = require('../lib/map');

async function init () {
	console.log('server-push');
	const mons = await fetchMons();

	console.log('mons');
	console.log(mons);

	webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
	webpush.setVapidDetails(
		process.env.EMAIL,
		process.env.PUBLIC_KEY,
		process.env.PRIVATE_KEY
	);

	// FIX rel path
	const data = fs.readFileSync('/Users/laura.carvajal/personal/mon-radar/data/subs.json', 'utf8');
	const dataJSON = JSON.parse(data);

	console.log('subs');
	console.log(dataJSON);

	for (const uuid in dataJSON) {
		if (dataJSON.hasOwnProperty(uuid)) {
			const sub = dataJSON[uuid];
			const pushSubscription = sub.subscription;

			// FIX fetch mons here, per users location

			for (const key in mons) {
				if (mons.hasOwnProperty(key)) {
					const foundMon = mons[key];

					// FIX consider user location, not default
					const isNearUser = parseInt(foundMon.distance, 10) <= parseInt(sub.radius, 10);

					const userWantsIt = sub.mons.find((wantedMon) => {
						return wantedMon.toLowerCase() === foundMon.name.toLowerCase();
					});

					// console.log('sub.mons', sub.mons);
					// console.log('foundMon.name', foundMon.name);
					// console.log('userWantsIt', userWantsIt);

					const userCares = isNearUser && userWantsIt;

					if (userCares) {
						webpush.sendNotification(pushSubscription, `${foundMon.name} is ${foundMon.distance}m away for ${foundMon.despawn} more minutes`).catch(function (e) {
							console.log(e);
						});
					}
				}
			}
		}
	}
	return mons;
}

module.exports = init;
