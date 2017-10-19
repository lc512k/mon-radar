const SubscriptionModel = require('../models/sub');
const env = require('node-env-file');

if (!process.env.PRODUCTION) {
	env(__dirname + './../../.env');
}

module.exports = async function (req, res) {

	let sub;

	if (req.cookies && req.cookies.uuid) {
		sub = await SubscriptionModel.findOne({_id: req.cookies.uuid});
	}

	const subMons = sub && sub.mons ? sub.mons : [];
	const subRadius = sub && sub.radius ? sub.radius : 500;
	const baseMons = process.env.MONS.split(',');

	console.log('\nThis sub');
	console.log(sub);

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