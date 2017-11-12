const fetchMons = require('./server/lib/map');

export const push = async (event, context, callback) => {
	console.log('event', event);
	const response = await fetchMons(event.sub.radius, event.sub.mons, event.sub.location, event.isRaids);
	console.log('response', response);
	callback(null, response);
};
