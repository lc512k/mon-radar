const SubscriptionModel = require('../models/sub');

module.exports = async function (req, res) {

	let sub;

	if (req.cookies && req.cookies.uuid) {
		sub = await SubscriptionModel.findOne({_id: req.cookies.uuid});
	}

	console.log('\n\n[MAIN] This sub');
	console.log(sub);

	const subscriptionMons = sub && sub.mons ? sub.mons : [];
	const subscriptionRadius = sub && sub.radius ? sub.radius : 500;

	const availableMons = process.env.MONS.split(',');

	const mons = availableMons.map((monNumber) => {
		return {
			number: monNumber,
			checked: subscriptionMons.includes(monNumber) ? 'checked' : ''
		};
	});

	req.app.locals.layout = 'main';
	res.render('subs', {
		mons: mons,
		radius: subscriptionRadius,
		location: JSON.stringify(sub.location)
	});
};