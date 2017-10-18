module.exports = function (req, res, next) {
    if (!req.secure && process.env.PRODUCTION) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
