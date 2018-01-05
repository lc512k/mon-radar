const SubscriptionModel = require('../models/sub');

const getMon = function (number, subMons) {
	let foundMon;
	for (let subMon of subMons) {
		if (subMon.number === number) {
			foundMon = subMon;
		}
	}
	return foundMon;
};

module.exports = async function (req, res) {

	let sub;

	if (req.cookies && req.cookies.uuid) {
		sub = await SubscriptionModel.findOne({_id: req.cookies.uuid});
	}

	console.log('\n\n[MAIN] This sub');
	console.log(sub);

	const subscriptionMons = sub && sub.mons ? sub.mons : [];
	const subscriptionRadius = sub && sub.radius ? sub.radius : null;
	const subscriptionRaids = sub && sub.raids ? sub.raids : [];
	const raidsRadius = sub && sub.raidsRadius ? sub.raidsRadius : null;

	const availableMons = process.env.MONS.split(',');
	const availableRaids = process.env.RAIDS.split(',');
	const disabledRaids = process.env.DISABLED_RAIDS.split(',');

	const mons = availableMons.map((number) => {
		const thisMon = getMon(number, subscriptionMons);
		return {
			number: number,
			radius: thisMon ? thisMon.radius : 0,
			checked: thisMon ? 'checked' : ''
		};
	});

	const raids = availableRaids.map((number) => {
		const thisMon = getMon(number, subscriptionRaids);
		return {
			number: number,
			radius: thisMon ? thisMon.radius : 0,
			checked: thisMon ? 'checked' : '',
			disabled: disabledRaids.includes(number) ? 'disabled' : ''
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