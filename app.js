const express = require('express');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./util/logger');

const app = new express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', async function (req, res) {
	res.index();
});

app.post('/api/update-mons', function (req, res) {
	logger.received(req);
	db.updateMons(req);
	res.sendStatus(200);
});

app.post('/api/subscribe', function (req, res) {
	logger.received(req);
	db.subscribe(req);
	res.sendStatus(200);
});

app.listen(process.env.PORT || 8888);
