const AWS = require('aws-sdk');

const fetchMons = (pushSubscription) => {

	AWS.config.update({
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
		region:'us-east-1'
	});

	const lambda = new AWS.Lambda();
	const params = {
		FunctionName: 'serverless-dev-push',
		Payload: JSON.stringify(pushSubscription)
	};

	lambda.invoke(params, (err, mons) => {
		if (err) {
			console.log('[LAMBDA]', err, err.stack);
		}
		else {
			return mons;
		}
	});
};

module.exports = { fetchMons };