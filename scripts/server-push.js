const webpush = require('web-push');
const sleep = require('sleep');
const env = require('node-env-file');
const fetchMons = require('../server/lib/map');
const mongoClient = require('../server/lib/mongo');
const SubscriptionModel = require('../server/models/sub');

if (!process.env.PRODUCTION) {
	env(__dirname + '/../.env');
}

function init () {
	console.log('[SERVER PUSH]');

	webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
	webpush.setVapidDetails(
		process.env.EMAIL,
		process.env.PUBLIC_KEY,
		process.env.PRIVATE_KEY
	);

	let dataJSON;

	mongoClient.then(() => {
		SubscriptionModel.find({}, async (err, result) => {

			dataJSON = result;

			for (let sub of dataJSON) {

				const pushSubscription = sub.subscription;

				// TODO if duplicate locations (or close enough) fire off a single request
				// const mons = await fetchMons(sub.radius, sub.mons, sub.location);
				const mons = await fetchMons(sub.radius, sub.mons, sub.location);

				if (mons) {
					console.log('[SERVER PUSH] uuid', sub._id);
					console.log('[SERVER PUSH] mons fetched:', mons.length);

					for (const key in mons) {
						if (mons.hasOwnProperty(key)) {
							const foundMon = mons[key];
							console.log(`notifying ${sub._id} about ${JSON.stringify(mons[key])}`);

							const payload = {
								message: `${foundMon.distance}m away for ${foundMon.despawn} more minutes`,
								title: foundMon.name,
								icon: `img/${foundMon.id}.png`
							};

							webpush.sendNotification(pushSubscription, JSON.stringify(payload)).catch(function (e) {
								console.log('[SERVER PUSH] sent for', sub._id);
								console.log(e);
							});
						}
					}
				}

				console.log('sleeping for 10s');
				sleep.sleep(10);
			}

		});
	});
}

module.exports = init;
