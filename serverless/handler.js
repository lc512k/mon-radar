const fetchMons = require('./server/lib/map');

export const push = async (event, context, callback) => {
	console.log('event', event);
	const response = await fetchMons(event.radius, event.mons, event.location);
	console.log('response', response);
	callback(null, response);
};
