const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const testData = require('../../../server/data/stub.json');
require('../../../server/lib/ip');

describe('The map library', () => {

	let map;
	let fetchStub;

	beforeEach(() => {
	 	fetchStub = sinon.stub();
		map = proxyquire('../../../server/lib/map', {
			'isomorphic-fetch': fetchStub.returns(Promise.resolve({
				json: function () {
					return Promise.resolve(testData);
				},
				text: function () {
					return Promise.resolve('text');
				}
			}))
		});
	});

	afterEach(() => {
		fetchStub.reset();
	});

	it('should call fetch if no TEST env is set', async () => {
		console.log('wat')
		await map(1000, ['143'], {lng: '0', lat: '0'});
		sinon.assert.called(fetchStub);
	});

	it('should not call fetch if TEST env is set', async () => {
		process.env.TEST = 'true';
		await map(1000, ['143'], {lng: '0', lat: '0'});
		sinon.assert.notCalled(fetchStub);
		delete process.env.TEST;
	});

	it('should return a promise', () => {
		assert.equal('function', typeof map().then);
	});

	// it('should return an array', async () => {
	// 	const mons = await map(1000, ['143'], {lng: '0', lat: '0'});
	// 	// assert(true);
	// 	assert(mons.length > 0);
	// });

	// it('should return an array of objects with a name', async () => {
	// 	const mons = await map();
	// 	const firstMon = mons[0];
	// 	assert(firstMon.name !== undefined);
	// 	assert('string', typeof firstMon.name);
	// });

	// it('should return an array of objects with a despawn time', async () => {
	// 	const mons = await map();
	// 	const firstMon = mons[0];
	// 	assert(firstMon.despawn !== undefined);
	// 	assert('string', typeof firstMon.despawn);
	// });

	// it('should return an array of objects with a numeric distance', async () => {
	// 	const mons = await map();
	// 	const firstMon = mons[0];
	// 	assert(firstMon.distance !== undefined);
	// 	assert('number', typeof parseInt(firstMon.distance, 10));
	// });
});