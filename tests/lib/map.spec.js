const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const testData = require('../../data/stub.json');

let map;
let fetchStub;

beforeEach(() => {
 	fetchStub = sinon.stub();
	map = proxyquire('../../lib/map', {
		'isomorphic-fetch': fetchStub.returns(Promise.resolve({json: function () {return Promise.resolve(testData);}}))
	});
});

afterEach(() => {
	fetchStub.reset();
});

describe('The map library', () => {
	it('should call fetch if no TEST env is set', async () => {
		await map();
		sinon.assert.called(fetchStub);
	});
	it('should not call fetch if TEST env is set', () => {
		process.env.TEST = 'true';
		map();
		sinon.assert.notCalled(fetchStub);
		delete process.env.TEST;
	});
	it('should return a promise', () => {
		assert.equal('function', typeof map().then);
	});
	it('should return an array', async () => {
		const mons = await map();
		assert(mons.length > 0);
	});
	it('should return an array of objects with a name', async () => {
		const mons = await map();
		const firstMon = mons[0];
		assert(firstMon.name !== undefined);
		assert('string', typeof firstMon.name);
	});
	it('should return an array of objects with a despawn time', async () => {
		const mons = await map();
		const firstMon = mons[0];
		assert(firstMon.despawn !== undefined);
		assert('string', typeof firstMon.despawn);
	});
	it('should return an array of objects with a numeric distance', async () => {
		const mons = await map();
		const firstMon = mons[0];
		assert(firstMon.distance !== undefined);
		assert('number', typeof parseInt(firstMon.distance, 10));
	});
});