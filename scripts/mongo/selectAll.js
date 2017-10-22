const mongoClient = require('../../server/lib/mongo');
const SubscriptionModel = require('../../server/models/sub');


console.log('selectAll')
mongoClient.then(() => {
	console.log('mongo client done')
	SubscriptionModel.find({}, (a, b) => {
		console.log(b[0]);
	});
});
