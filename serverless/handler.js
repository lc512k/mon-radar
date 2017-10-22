const fetchMons = require('../server/lib/map');

export const push = async (event, context, callback) => {
	console.log('event', event);
	context.callbackWaitsForEmptyEventLoop = false;
	const response = await fetchMons(event.radius, event.mons, event.location);;
	callback(null, response);
};
