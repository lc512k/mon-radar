const mongoClient = require('../../server/lib/mongo');
const SubscriptionModel = require('../../server/models/sub');


console.log('removeAll')
mongoClient.then(() => {
	console.log('mongo client done')
	SubscriptionModel.remove((a, b) => {
		console.log('removed')
		// console.log(a, b);
	});
});
