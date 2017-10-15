const sinon = require('sinon');
const assert = require('assert');
const proxyquire = require('proxyquire');

const twoSubsFixture = '{"1":{"mons": ["Snorlax"],"subscription": {"endpoint": "https://fcm.googleapis.com/fcm/send/ffjqfsC-Jak:APA91bG23YCnksD_TjRBHgjMtdVEprvVHmk8HTRqoUXDHjH-PFChplrsk692PoW871-pEdM_kAlPH1l0CLseqInyNXY9o7ApVlTUZzaIfiNRN3OaGOZuhivo_SZfxdX0vLYVAT5nUI0I","expirationTime": null,"keys": {"p256dh": "BEYHWryugz3l3PB5_qDCahaj7NNI2rD-dhv6bxUH62H8ysvduen7PIhKcikTc2exc5PdyyjPeJI4ZmjUgEYdb34=","auth": "HoGxY7ImFFc0gTPX22o0jg=="}}},"2":{"mons": ["Pikachu"],"subscription": {"endpoint": "https://fcm.googleapis.com/fcm/send/ffjqfsC-Jak:APA91bG23YCnksD_TjRBHgjMtdVEprvVHmk8HTRqoUXDHjH-PFChplrsk692PoW871-pEdM_kAlPH1l0CLseqInyNXY9o7ApVlTUZzaIfiNRN3OaGOZuhivo_SZfxdX0vLYVAT5nUI0I","expirationTime": null,"keys": {"p256dh": "BEYHWryugz3l3PB5_qDCahaj7NNI2rD-dhv6bxUH62H8ysvduen7PIhKcikTc2exc5PdyyjPeJI4ZmjUgEYdb34=","auth": "HoGxY7ImFFc0gTPX22o0jg=="}}}}';

describe('The server-push script', () => {

	let serverPush;
	let webPushStub;
	let fsStub;

	beforeEach(() => {
	 	webPushStub = sinon.stub();
	 	fsStub = sinon.stub();
		serverPush = proxyquire('../../../scripts/server-push', {
			'web-push': webPushStub.returns({
				setGCMAPIKey: function () {},
				setVapidDetails: function () {},
				sendNotification: function () {}
			}),
			'fs': fsStub.returns({
				readFileSync: function () {}
			})
		});

		webPushStub.sendNotification = new sinon.stub().returns(Promise.resolve());
		fsStub.readFileSync = new sinon.stub().returns(twoSubsFixture.toString());

		process.env.TEST = 'true';
		process.env.MAX_RADIUS = 2000;
	});

	afterEach(() => {
		delete process.env.TEST;
		delete process.env.MAX_RADIUS;
		webPushStub.reset();
		fsStub.reset();
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

	it('calls webpush once per pokemon found, per subscription', async () => {
		const mons = await serverPush();
		const numberOfSubs = Object.keys(JSON.parse(twoSubsFixture)).length;
		sinon.assert.calledOnce(fsStub.readFileSync);
		sinon.assert.callCount(webPushStub.sendNotification, mons.length * numberOfSubs);
	});
});
