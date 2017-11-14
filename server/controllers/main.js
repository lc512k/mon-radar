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
	const subscriptionRaids = sub && sub.raids ? sub.raids : [];
	const raidsRadius = sub && sub.raidsRadius ? sub.raidsRadius : 1500;

	const availableMons = process.env.MONS.split(',');
	const availableRaids = process.env.RAIDS.split(',');
	const disabledRaids = process.env.DISABLED_RAIDS.split(',');

	const mons = availableMons.map((monNumber) => {
		return {
			number: monNumber,
			checked: subscriptionMons.includes(monNumber) ? 'checked' : ''
		};
	});

	const raids = availableRaids.map((raidNumber) => {
		return {
			number: raidNumber,
			checked: subscriptionRaids.includes(raidNumber) ? 'checked' : '',
			disabled: disabledRaids.includes(raidNumber) ? 'disabled' : ''
		};
	});

	req.app.locals.layout = 'main';
	res.render('subs', {
		mons: mons,
		radius: subscriptionRadius,
		raids: raids,
		raidsRadius: raidsRadius,
		location: sub ? JSON.stringify(sub.location) : ''
	});
};