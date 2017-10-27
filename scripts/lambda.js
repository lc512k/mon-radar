const lambda = require('./lambda-promise');

const fetchMons = async (pushSubscription) => {
	console.log('[LAMBDA] about to invoke');
	lambda.updateConfig({
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
		region:'us-east-1'
	});
	const mons = await lambda.invoke('serverless-dev-push', pushSubscription);
	console.log('[LAMBDA] mons', mons ? mons.length : mons);
	return mons;
};

module.exports = { fetchMons };