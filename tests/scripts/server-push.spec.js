const sinon = require('sinon');
const assert = require('assert');
const proxyquire = require('proxyquire');

describe('The server-push script', () => {

	let serverPush;
	let webPushStub;

	beforeEach(() => {
	 	webPushStub = sinon.stub();
		serverPush = proxyquire('../../scripts/server-push', {
			'web-push': webPushStub.returns({
				setGCMAPIKey: function () {},
				setVapidDetails: function () {},
				sendNotification: function () {}
			})
		});

		webPushStub.sendNotification = new sinon.stub().returns(Promise.resolve());

		process.env.TEST = 'true';
		process.env.ACCEPTABLE_RADIUS = 2000;
	});

	afterEach(() => {
		delete process.env.TEST;
		delete process.env.ACCEPTABLE_RADIUS;
		webPushStub.reset();
	});

	it('exports anonymous init function', () => {
		assert.equal(typeof serverPush, 'function');
	});

	it('anonymous init function exported retunrs an array', async () => {
		const mons = await serverPush();
		assert.equal(typeof mons.length, 'number');
	});

	it('calls web push', async () => {
		await serverPush();
		sinon.assert.called(webPushStub.sendNotification);
	});

	it('calls webpush once per pokemon found', async () => {
		const mons = await serverPush();
		sinon.assert.callCount(webPushStub.sendNotification, mons.length);
	});
});
