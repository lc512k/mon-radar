const received = (req, path) => {
	console.log(`\n***** START Request received on ${path} ******`);
	console.log('req.body');
	console.log(JSON.stringify(req.body, null, 2));
	console.log('\nreq.cookies');
	console.log(JSON.stringify(req.cookies, null, 2));
	console.log(`***** END Request received on ${path} ******\n`);
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
