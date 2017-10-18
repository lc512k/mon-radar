const fetch = require('isomorphic-fetch');
const geo = require('../util/geo');
const time = require('../util/time');
const testData = require('../data/stub.json');
const dex = require('../data/lean-dex.json');
const env = require('node-env-file');

if (!process.env.PRODUCTION) {
	env(__dirname + '/../../.env');
}

function find (data, radius, location) {

	const nearbyMons = [];
	for (const mon of data.pokemons) {
		const distance = geo.getDistance(location.lat, location.lng, mon.lat, mon.lng);
		if (distance < radius) {
			// console.log('nearby mon', mon);
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

function fetchPogoMap (radius, wanted, location) {

	const url = process.env.URL + wanted.toString();
	// 83,113,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,179,181,191,192,196,201,214,222,225,235,236,237,242,243,244,245,246,247,248,249,250,251
	return fetch(url, {
		headers: {
			token: process.env.TOKEN,
			referer: process.env.REFERER,
			pragma: 'no-cache'
		}
	})
	.then(response => {
		console.log('lpm respnse', url, response.status, process.env.TOKEN, process.env.REFERER);
		const bodyJSON = response.json();
		if (response.status !== 200) {
			const oops = bodyJSON;
			console.log('oops, not 200');
			console.log(oops, response.text());
		}
		return bodyJSON;
	})
	.then((data) => {
		console.log('lpm data');
		return find(data, radius, location);
	})
	.catch((e) => {
		console.log(e);
	});
}

function fetchTestData (data) {
	return find(data);
}

function init (radius, wanted, location) {
	return process.env.TEST ? fetchTestData(testData) : fetchPogoMap(radius, wanted, location);
}

module.exports = init;