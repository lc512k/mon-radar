const webpush = require('web-push');
const env = require('node-env-file');
const fetchMons = require('../server/lib/map');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');

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

	let dataJSON;

	mongoClient.then(() => {
		console.log('mongo client done');
		SubscriptionModel.find({}, async (err, result) => {
			dataJSON = result;

			console.log(dataJSON);

			for (let sub of dataJSON) {

				const pushSubscription = sub.subscription;

				// TODO if duplicate locations (or close enough) fire off a single request
				const mons = await fetchMons(sub.radius, sub.mons, sub.location);

				console.log('mons');
				console.log(mons);

				for (const key in mons) {
					if (mons.hasOwnProperty(key)) {
						const foundMon = mons[key];
						console.log('pushing mons[key]',mons[key]);
						webpush.sendNotification(pushSubscription, `${foundMon.name} is ${foundMon.distance}m away for ${foundMon.despawn} more minutes`).catch(function (e) {
							console.log(e);
							//TODO delete broken subscription here
						});
					}
				}
			}

		});
	});
}

module.exports = init;
