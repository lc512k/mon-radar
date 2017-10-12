const dex = require('../data/pokedex.json');

function cleanup () {
	const smallDex = {};
	for (const mon of dex) {
		smallDex[mon.id] = mon.ename;
	}
	console.log(smallDex);
}

cleanup();