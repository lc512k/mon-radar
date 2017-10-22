const lambda = require('./lambda-promise');

const fetchMons = async (pushSubscription) => {
	console.log('[LAMBDA] about to invoke');
	const mons = await lambda.invoke('serverless-dev-push', pushSubscription);
	console.log('[LAMBDA] mons', mons);
	return mons;
};

module.exports = { fetchMons };