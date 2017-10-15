const webpush = require('web-push');
const env = require('node-env-file');
const fs = require('fs');
const fetchMons = require('../lib/map');

if (!process.env.PRODUCTION) {
	env(__dirname + '/../.env');
}

async function init () {
	console.log('server-push init');

	webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
	webpush.setVapidDetails(
		process.env.EMAIL,
		process.env.PUBLIC_KEY,
		process.env.PRIVATE_KEY
	);

	const data = fs.readFileSync(process.env.DB_PATH, 'utf8');
	const dataJSON = JSON.parse(data);

	console.log('subs');
	console.log(dataJSON);

	for (const uuid in dataJSON) {
		if (dataJSON.hasOwnProperty(uuid)) {
			const sub = dataJSON[uuid];
			const pushSubscription = sub.subscription;

			// TODO if duplicate locations (or close enough) fire off a single request
			const mons = await fetchMons(sub.radius, sub.mons, sub.location);

			console.log('mons');
			console.log(mons);

			for (const key in mons) {
				if (mons.hasOwnProperty(key)) {
					console.log('key', key);
					const foundMon = mons[key];
					console.log('mons[key]',mons[key]);
					webpush.sendNotification(pushSubscription, `${foundMon.name} is ${foundMon.distance}m away for ${foundMon.despawn} more minutes`).catch(function (e) {
						console.log(e);
					});
				}
			}
		}
	}
}

module.exports = init;
