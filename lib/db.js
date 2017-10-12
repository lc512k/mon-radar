const fs = require('fs');

const update = req => {
	// const data = fs.readFileSync('./data/subs.json', 'utf8');

	// try {
	// 	const currentSubs = JSON.parse(data);
	// 	currentSubs[req.cookies.uuid] = req.body;

	// 	fs.writeFile('./data/subs.json', JSON.stringify(currentSubs, null, 2), (err) => {
	// 		console.log(err, 'wrote file');
	// 	});
	// }
	// catch (e) {
	// 	console.log(e);
	// }
};

const subscribe = (req) => {
	const data = fs.readFileSync('./data/subs.json', 'utf8');

	try {
		const currentSubs = JSON.parse(data);

		if (!currentSubs[req.cookies.uuid]) {
			currentSubs[req.cookies.uuid] = {
				mons: ['143'],
				subscription: req.body
			};

			fs.writeFile('./data/subs.json', JSON.stringify(currentSubs, null, 2), (err) => {
				console.log(err, 'wrote file');
			});
		}
	}
	catch (e) {
		console.log(e);
	}
};

module.exports = { update, subscribe };
