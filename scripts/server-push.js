const webpush = require('web-push');
const env = require('node-env-file');
const fs = require('fs');
env(__dirname + '/../.env');

webpush.setGCMAPIKey('AIzaSyAQQ8SwlBJAoxkw82Rw5lUtxFpzmK8nZ5s');
webpush.setVapidDetails(
	process.env.EMAIL,
	process.env.PUBLIC_KEY,
	process.env.PRIVATE_KEY
);

const data = fs.readFileSync('./data/subs.json', 'utf8');
const dataJSON = JSON.parse(data);

console.log('dataJSON');
console.log(dataJSON);

for (const uuid in dataJSON) {
	if (dataJSON.hasOwnProperty(uuid)) {
		console.log(uuid);

		const sub = dataJSON[uuid];

		const pushSubscription = sub.subscription;

		webpush.sendNotification(pushSubscription, `${sub.mons} nearby!`).catch(function (e) {
			console.log(e);
		});
	}
}


