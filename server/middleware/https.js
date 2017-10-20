module.exports = () => {
	return (req, res, next) => {
		if (process.env.NODE_ENV === 'production') {
			if (req.headers['x-forwarded-proto'] !== 'https') {
				res.redirect(302, 'https://' + req.hostname + req.originalUrl);
			}
			else {
				next();
			}
		}
		else {
			next();
		}
	};
};