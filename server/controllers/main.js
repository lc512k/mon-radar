const SubscriptionModel = require('../models/sub');
const env = require('node-env-file');

if (!process.env.PRODUCTION) {
	env(__dirname + './../../.env');
}

module.exports = async function (req, res) {

	let sub = {};

	if (req.cookies && req.cookies.uuid) {
		sub = await SubscriptionModel.findOne({_id: req.cookies.uuid});
	}

	const subMons = sub.mons || [];
	const subRadius = sub.radius || 1000;
	const baseMons = process.env.MONS.split(',');

	console.log('this sub', sub);

	const mons = baseMons.map((monNumber) => {
		return {
			number: monNumber,
			checked: subMons.includes(monNumber) ? 'checked' : ''
		};
	});

	req.app.locals.layout = 'main';
	res.render('subs', {
		mons: mons,
		radius: subRadius
	});
};