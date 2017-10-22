const dns = require('dns');
const os = require('os');

const print = () => {
	return dns.lookup(os.hostname(), function (err, add) {
		console.log('[IP]', add);
	});
};

module.exports = { print };
