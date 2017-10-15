const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./util/logger');
const env = require('node-env-file');
env(__dirname + '/.env');

const app = new express();

let handlebars = exphbs.create({extname: '.html'});
app.engine('html', handlebars.engine);
app.set('view engine', '.html');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

console.log(process.env.MONS.split(','));

app.get('/', async function (req, res) {
	req.app.locals.layout = 'main';
	res.render('subs', {
		mons: process.env.MONS.split(',')
	});
	// TODO set values
});

app.post('/api/subscribe', function (req, res) {
	logger.received(req, req.path);
	const status = db.subscribe(req, res);
	res.sendStatus(status);
	// TODO res render / with status
});

app.post('/api/update-mons', function (req, res) {
	logger.received(req, req.path);
	const status = db.updateMons(req, res);
	res.sendStatus(status);
	// TODO res render / with status
});


app.listen(process.env.PORT || 8888);
