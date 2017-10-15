const received = (req) => {
	console.log('\n***** START Request received on /api/update ******');
	console.log('req.body');
	console.log(JSON.stringify(req.body, null, 2));
	console.log('\nreq.cookies');
	console.log(JSON.stringify(req.cookies, null, 2));
	console.log('***** END Request received on /api/update ******\n');
};


if (process.env.NO_LOGS) {
	const noop = () => {};
	module.exports = {
		received: noop
	};
}
else {
	module.exports = { received };
}
