const assert = require('assert');
const geo = require('../../../server/lib/geo');

describe('The geo utility', () => {

	// Eiffel Tower
	const lat1 = 48.858093;
	const lon1 = 2.294694;

	// Big Ben
	const lat2 = 51.5007;
	const lon2 = 0.1246;

	it('should a N distance between two lat/long pairs', () => {
		const distance = geo.getDistance(lat1,lon1,lat2,lon2);
		assert(typeof distance, 'number');
	});

	it('should return >330KM as the straight distance between Big Ben and Eiffel Tower', () => {
		const distance = geo.getDistance(lat1,lon1,lat2,lon2);
		assert(distance * 1000 > 330);
	});
});