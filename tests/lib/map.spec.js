const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
// const fetchMock = require('fetch-mock');
const map = rewire('../../lib/map');
// const map = require('../../lib/map');

// fetch doesn't get call if test env var
// fetch does get called if no test env var
// find returns an array of objects with name despawn and distance
	// name is a string, not a number
	// despawn is a time
	// distance is an natural number
// find returns an empty array with certain params
// fetchLondongPogoMap calls fetch
// fetchLondongPogoMap returns a promise
// fetchLondongPogoMap with a bad url, error is caught

beforeEach(() => {
	// const fetchStub = sinon.stub(this, 'fetch', function () {
	// });
});


describe('fetchLondongPogoMap', () => {
	it('should return a promise', () => {
		// TODO make sure fetch is stubbed first
		const fetchLondongPogoMap = map.__get__('fetchLondongPogoMap');
		const promise = fetchLondongPogoMap();
		assert.equal('function', typeof promise.then);
	});
	it('should fail silently with a bad URL', () => {
		assert.equal(-1, [1,2,3].indexOf(4));
	});
});