const express = require('express');
const fetchMons = require('./lib/map');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = new express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', async function (req, res) {
	const mons = await fetchMons();
	res.index();
});

app.post('/api/update', function (req, res) {
	console.log(req.body, req.cookies);
	db.update(req);
	res.sendStatus(200);
});

app.post('/api/subscribe', function (req, res) {
	console.log(req.body, req.cookies);
	db.subscribe(req);
	res.sendStatus(200);
});

app.listen(process.env.PORT || 8888);
