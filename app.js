const express = require('express');
const fetchMons = require('./lib/map');

const app = new express();

app.get('/', async function (req, res) {
	const mons = await fetchMons();
	res.send(mons);
});

app.listen(process.env.PORT || 8888);
