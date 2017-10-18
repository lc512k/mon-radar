module.exports = function (req, res, next) {
	console.log('not redirecting to https');
 //    if (!req.secure && process.env.PRODUCTION) {
 //        return res.redirect('https://' + req.get('host') + req.url);
 //    }
 //    next();
};
