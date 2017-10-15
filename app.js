const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./util/logger');
const env = require('node-env-file');

if (!process.env.PRODUCTION) {
	env(__dirname + '/.env');
}

const app = new express();

let handlebars = exphbs.create({extname: '.html'});
app.engine('html', handlebars.engine);
app.set('view engine', '.html');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', async function (req, res) {

	const sub = db.find(req);
	const subMons = sub && sub.mons? sub.mons : [];
	const subRadius = sub && sub.radius? sub.radius : 1000;
	const baseMons = process.env.MONS.split(',');

	console.log('this sub', sub);

	const mons = baseMons.map((monNumber) => {
		return {
			number: monNumber,
			checked: subMons.includes(monNumber) ? 'checked' : ''
		};
	});

	req.app.locals.layout = 'main';
	res.render('subs', {
		mons: mons,
		radius: subRadius
	});
});

app.post('/api/subscribe', function (req, res) {
	logger.received(req, req.path);
	const status = db.subscribe(req);
	console.log(`${req.path} responded with ${status}`);
	res.sendStatus(status);
});

app.post('/api/update-mons', function (req, res) {
	logger.received(req, req.path);
	const status = db.updateMons(req);
	console.log(`${req.path} responded with ${status}`);
	res.sendStatus(status);
});


app.listen(process.env.PORT || 8888);
