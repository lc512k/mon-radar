const fs = require('fs');

const STORAGE = './data/subs.json';
const DEFAULT_MON_LIST = ['Snorlax'];

const save = (file, contents) => {
	fs.writeFileSync(file, JSON.stringify(contents, null, 2));
};

const updateMons = (req) => {
	const data = fs.readFileSync('./data/subs.json', 'utf8');

	try {
		const currentSubs = JSON.parse(data);
		const sub = currentSubs[req.cookies.uuid];
		const userMons = req.body.mons.split(' ');

		if (!sub) {
			return 412; // Precondition failed (sub/cookie missing). Refresh page
			// TODO subscribe to push on page load
		}
		else {
			sub.mons = (userMons.length > 0 && userMons[0] !== '') ? userMons : DEFAULT_MON_LIST;
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
	const data = fs.readFileSync('./data/subs.json', 'utf8');
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
				mons: DEFAULT_MON_LIST,
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

module.exports = { updateMons, subscribe };
