const fetch = require('isomorphic-fetch');
const geo = require('./geo');
const time = require('./time');
const testData = require('../data/stub.json');
const dex = require('../data/lean-dex.json');
const ip = require('./ip');

function find (data, radius, location, wanted) {

	const nearby = [];
	const isRaid = !!data.raids;
	const mons = isRaid ? data.raids : data.pokemons;

	for (const mon of mons) {

		const distance = geo.getDistance(location.lat, location.lng, mon.lat, mon.lng);
		const endTime = isRaid ? mon.raid_end : mon.despawn;

		// Raids response is not filtered
		// filter them here
		if (wanted && isRaid) {
			console.log('[MAP] Wanted raids:');
			console.log(wanted);
			console.log('[MAP] this mon:');
			console.log(mon.pokemon_id);
			!wanted.includes(mon.pokemon_id);
			break;
		}

		if (distance < radius) {
			nearby.push({
				name: dex[mon.pokemon_id] || 'egg',
				id: mon.pokemon_id,
				despawn: time(new Date(endTime * 1000) - new Date()),
				distance: Math.ceil(distance),
				location: {
					lat: mon.lat,
					lng: mon.lng
				}
			});
		}
	}

	return nearby;
}

async function fetchPogoMap (radius, wanted, location, isRaids) {

	// Everobydy wants shinies!
	const shinies = ',129,302,355';

	const url = isRaids ? process.env.RAIDS_URL : process.env.URL + wanted.toString(); + shinies;
	const options = {
		headers: {
			token: process.env.TOKEN,
			referer: process.env.REFERER,
			pragma: 'no-cache',
			accept: '*/*',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9,es;q=0.8',
			'cookie': process.env.PROVIDER_COOKIE,
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3243.0 Safari/537.36 x-requested-with:XMLHttpRequest'
		}
	};

	console.log('[MAP] fetch going out 🚨🚨🚨🚨🚨🚨');
	const response = await fetch(url, options);

	if (response.status === 200) {
		console.log(`\n\n[MAP] ${isRaids ? 'raids map' : 'lpm' } responded ok`);
		const jsonResponse = await response.json();
		return find(jsonResponse, radius, location, wanted);
	}
	else {
		const textResponse = await response.text();
		console.log(`\n\n[MAP] ${isRaids ? 'raids map' : 'lpm' } fetch failed`, response.status);
		console.log(`${response.status} ${textResponse.indexOf('banned') ? 'IP Banned' : textResponse}`);
		ip.print();
	}
}

function fetchTestData (data, radius, wanted, location) {
	return find(data, radius, location, wanted);
}

function init (radius, wanted, location, isRaids) {
	return process.env.TEST ? fetchTestData(testData, radius, wanted, location) : fetchPogoMap(radius, wanted, location, isRaids);
}

module.exports = init;