const lambda = require('./lambda-promise');
const debugPush = require('./debug-push');

const fetchMons = async (sub, isRaids) => {

	const regions = ['eu-west-1','eu-west-2', 'eu-central-1', 'us-east-1', 'us-west-2', 'ap-northeast-2', 'sa-east-1'];

	let mons;

	for (let region of regions) {
		console.log('[LAMBDA] trying', region);
		debugPush.send(sub, `Trying ${region} ⚡`);

		lambda.init({
			accessKeyId: process.env.AWS_ID,
			secretAccessKey: process.env.AWS_SECRET,
			region: region
		});
		mons = await lambda.invoke('serverless-dev-push', {sub, isRaids});

		console.log('[LAMBDA] mons', mons ? mons.length : mons);

		// If the lambda in this region didn't fail we're good to go
		if (mons) {
			break;
		}
		else {
			debugPush.send(sub, `${region} ⚡ IP Banned 💀`);
		}
	}

	return mons;
};

module.exports = { fetchMons };