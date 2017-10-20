const fetch = require('isomorphic-fetch');
const geo = require('./geo');
const time = require('./time');
const testData = require('../data/stub.json');
const dex = require('../data/lean-dex.json');
const env = require('node-env-file');
const ip = require('./ip');

if (!process.env.NODE_ENV) {
	env(__dirname + '/../../.env');
}

function find (data, radius, location) {

	const nearbyMons = [];
	for (const mon of data.pokemons) {
		const distance = geo.getDistance(location.lat, location.lng, mon.lat, mon.lng);
		if (distance < radius) {
			nearbyMons.push({
				name: dex[mon.pokemon_id],
				id: mon.pokemon_id,
				despawn: time(new Date(mon.despawn*1000) - new Date()),
				distance: Math.ceil(distance)
			});
		}
	}
	return nearbyMons;
}

async function fetchPogoMap (radius, wanted, location) {
	const url = process.env.URL + wanted.toString();
	const options = {
		headers: {
			token: process.env.TOKEN,
			referer: process.env.REFERER,
			pragma: 'no-cache'
		}
	};

	const response = await fetch(url,options);

	if (response.status === 200) {
		console.log('\n\n[MAP] lpm responded ok');
		const jsonResponse = await response.json();
		return find(jsonResponse, radius, location);
	}
	else {
		const textResponse = await response.text();
		console.log('\n\n[MAP] lpm fetch failed', response.status);
		console.log('[MAP] ip: ', ip.log());
		console.log(`${response.status} ${textResponse.indexOf('banned') ? 'IP Banned' : textResponse}`);
	}
}

function fetchTestData (data, radius, location) {
	return find(data, radius, location);
}

function init (radius, wanted, location) {
	return process.env.TEST ? fetchTestData(testData, radius, location) : fetchPogoMap(radius, wanted, location);
}

module.exports = init;