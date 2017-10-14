const webpush = require('web-push');
const env = require('node-env-file');
const fs = require('fs');
env(__dirname + '/../.env');
const fetchMons = require('../lib/map');

async function init () {
	const mons = await fetchMons();

	webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
	webpush.setVapidDetails(
		process.env.EMAIL,
		process.env.PUBLIC_KEY,
		process.env.PRIVATE_KEY
	);

	// TODO rel path
	const data = fs.readFileSync('/Users/laura.carvajal/personal/mon-radar/data/subs.json', 'utf8');
	const dataJSON = JSON.parse(data);

	for (const uuid in dataJSON) {
		if (dataJSON.hasOwnProperty(uuid)) {
			const sub = dataJSON[uuid];
			const pushSubscription = sub.subscription;
			for (const key in mons) {
				if (mons.hasOwnProperty(key)) {
					const mon = mons[key];
					webpush.sendNotification(pushSubscription, `${mon.name} is ${mon.distance}m away for ${mon.despawn} more minutes`).catch(function (e) {
						console.log(e);
					});
				}
			}
		}
	}
	return mons;
}

module.exports = init;
