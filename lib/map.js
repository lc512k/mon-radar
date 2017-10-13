const fetch = require('isomorphic-fetch');
const geo = require('../util/geo');
const time = require('../util/time');
const testData = require('../stub.json');
const dex = require('../data/lean-dex.json');
const env = require('node-env-file');
env(__dirname + '/../.env');

function find (data) {
	const nearbyMons = [];
	for (const mon of data.pokemons) {
		const distance = geo.getDistance(process.env.MY_LAT, process.env.MY_LNG, mon.lat, mon.lng);
		if (distance < process.env.ACCEPTABLE_RADIUS) {
			console.log(mon);
			nearbyMons.push({
				name: dex[mon.pokemon_id],
				despawn: time(new Date(mon.despawn*1000) - new Date()),
				distance: Math.ceil(distance)
			});
		}
	}
	return nearbyMons;
}

function fetchLondongPogoMap () {
	return fetch(process.env.URL, {
		headers: {
			token: process.env.TOKEN,
			referer: process.env.REFERER,
			pragma: 'no-cache'
		}
	})
	.then(response => response.json())
	.then((data) => {
		return find(data);
	})
	.catch((e) => {
		console.log(e);
	});
}

function fetchTestData () {
	return find(testData);
}

function init () {
	console.log('init');
	return process.env.TEST ? fetchTestData() : fetchLondongPogoMap();
}

module.exports = init;