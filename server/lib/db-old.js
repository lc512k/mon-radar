const fs = require('fs');
const env = require('node-env-file');
const path = require('path');

if (!process.env.PRODUCTION) {
	env(__dirname + '/../.env');
}

const STORAGE = process.env.DB_PATH;

const save = (file, contents) => {
	// TODO fix paths
	const subsPath = path.join(__dirname, '..', '/data/subs.json');
	console.log('*^*^* Save (write)', subsPath);
	fs.writeFileSync(subsPath, JSON.stringify(contents, null, 2));
};

const updateMons = (req) => {
	console.log('**** Update (read)', STORAGE);
	const data = fs.readFileSync(STORAGE, 'utf8');

	try {
		const currentSubs = JSON.parse(data);
		const sub = currentSubs[req.cookies.uuid];
		const userMons = req.body.mons;

		if (!sub) {
			return 412; // Precondition failed (sub/cookie missing). Refresh page
			// TODO subscribe to push on page load
		}
		else {
			sub.mons = (userMons.length > 0 && userMons[0] !== '') ? userMons : process.env.DEFAULT_MON_LIST;
			sub.radius = req.body.radius;
			sub.location = req.body.location;
			save(STORAGE, currentSubs);
			return 200; // Updated OK
		}

	}
	catch (e) {
		console.log(e);
		return 500;
	}
};

const subscribe = (req) => {
	console.log('**** Subscribing (read)', STORAGE);
	const data = fs.readFileSync(STORAGE, 'utf8');
	let status;

	try {
		const currentSubs = JSON.parse(data);
		const bodyStr = JSON.stringify(req.body, null, 2);

		if (!req.body || bodyStr === '{}') {
			console.log(`Unsubscribing ${req.cookies.uuid}`);
			delete currentSubs[req.cookies.uuid];
			status = 204; // Deleted
		}
		else if (!currentSubs[req.cookies.uuid]) {
			console.log(`Sub doesn\'t exist for ${req.cookies.uuid}. Creating one.`);
			currentSubs[req.cookies.uuid] = {
				mons: process.env.DEFAULT_MON_LIST,
				subscription: req.body
			};
			status = 201; // Created
		}
		else {
			console.log(`${req.cookies.uuid} already subscribed. Updating.`);
			currentSubs[req.cookies.uuid].subscription = req.body;
			status = 200; // Updated OK
		}
		save(STORAGE, currentSubs);
		return status;
	}
	catch (e) {
		console.log(e);
		return 500;
	}
};

const find = (req) => {
	console.log('*** FIND ***');
	console.log('will read from', STORAGE);
	const uuid = req.cookies && req.cookies.uuid ? req.cookies.uuid : null;

	if (uuid) {
		console.log('**** Finding (read)', STORAGE);
		const data = fs.readFileSync(STORAGE, 'utf8');
		const currentSubs = JSON.parse(data);
		return currentSubs[req.cookies.uuid];
	}
};

module.exports = { updateMons, subscribe, find };
