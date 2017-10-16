const fs = require('fs');
const path = require('path');
const SubscriptionModel = require('./models/sub');

const save = (file, contents) => {
	// TODO fix paths
	const subsPath = path.join(__dirname, '..', '/data/subs.json');
	console.log('*^*^* Save (write)', subsPath);
	fs.writeFileSync(subsPath, JSON.stringify(contents, null, 2));
};

const remove = (file, contents) => {
	// TODO fix paths
	const subsPath = path.join(__dirname, '..', '/data/subs.json');
	console.log('*^*^* Save (write)', subsPath);
	fs.writeFileSync(subsPath, JSON.stringify(contents, null, 2));
};


const find = async (uuid) => {
	return await SubscriptionModel.findOne({'_id': uuid});
};

module.exports = { save, remove, find };
