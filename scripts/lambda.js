const lambda = require('./lambda-promise');
const debugPush = require('./debug-push');

const fetchMons = async (sub) => {
	console.log('[LAMBDA] about to invoke');

	const regions = ['us-east-1'];

	let mons;

	for (let region of regions) {
		console.log('REGION', region);
		debugPush.send(sub, `Trying ${region} region`);

		lambda.init({
			accessKeyId: process.env.AWS_ID,
			secretAccessKey: process.env.AWS_SECRET,
			region: region
		});
		mons = await lambda.invoke('serverless-dev-push', sub);

		// If the lambda in this region didn't fail we're good to go
		if (mons) break;
	}

	console.log('[LAMBDA] mons', mons ? mons.length : mons);
	return mons;
};

module.exports = { fetchMons };