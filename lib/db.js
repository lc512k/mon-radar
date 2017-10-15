const fs = require('fs');

const STORAGE = './data/subs.json';
const DEFAULT_MON_LIST = ['Mew'];

const save = (file, contents) => {
	fs.writeFile(file, JSON.stringify(contents, null, 2), (err) => {
		if (!err) {
			console.log(`wrote file ${file}`);
		}
	});
};

const updateMons = req => {
	const data = fs.readFileSync('./data/subs.json', 'utf8');

	try {
		const currentSubs = JSON.parse(data);
		const sub = currentSubs[req.cookies.uuid];
		console.log(req.body.mons, 'req.body.mons')
		const userMons = req.body.mons.split(' '); // TODO unit test

		console.log('userMons',userMons)

		// TODO unit test
		sub.mons = (userMons.length > 0 && userMons[0] !== '') ? userMons : DEFAULT_MON_LIST;
		sub.radius = req.body.radius;

		save(STORAGE, currentSubs);
	}
	catch (e) {
		console.log(e);
	}
};

const subscribe = (req) => {
	const data = fs.readFileSync('./data/subs.json', 'utf8');

	try {
		const currentSubs = JSON.parse(data);
		const bodyStr = JSON.stringify(req.body, null, 2);

		if (!req.body || bodyStr === '{}') {
			console.log(`Unsubscribing ${req.cookies.uuid}`);
			delete currentSubs[req.cookies.uuid];
		}
		else if (!currentSubs[req.cookies.uuid]) {
			console.log(`Sub doesn\'t exist for ${req.cookies.uuid}. Creating one.`);
			currentSubs[req.cookies.uuid] = {
				mons: DEFAULT_MON_LIST,
				subscription: req.body
			};
		}
		else {
			console.log(`${req.cookies.uuid} already subscribed. Updating.`);
			currentSubs[req.cookies.uuid].subscription = req.body;
		}
		save(STORAGE, currentSubs);
	}
	catch (e) {
		console.log(e);
	}
};

module.exports = { updateMons, subscribe };
