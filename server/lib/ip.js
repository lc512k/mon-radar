const dns = require('dns');
const os = require('os');

const log = () => {
	return dns.lookup(os.hostname(), function (err, add) {
		console.log('ip: ' + add);
	});
};


module.exports = log;
