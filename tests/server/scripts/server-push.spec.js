const sinon = require('sinon');
const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();
const fakeMons = require('../../../server/data/stub-found.json');

let serverPush;

const twoSubsFixture = '[{"location":{"lng":"-0.14498865", "lat":"51.64362086"}, "mons": ["143"],"subscription": {"endpoint": "https://fcm.googleapis.com/fcm/send/ffjqfsC-Jak:APA91bG23YCnksD_TjRBHgjMtdVEprvVHmk8HTRqoUXDHjH-PFChplrsk692PoW871-pEdM_kAlPH1l0CLseqInyNXY9o7ApVlTUZzaIfiNRN3OaGOZuhivo_SZfxdX0vLYVAT5nUI0I","expirationTime": null,"keys": {"p256dh": "BEYHWryugz3l3PB5_qDCahaj7NNI2rD-dhv6bxUH62H8ysvduen7PIhKcikTc2exc5PdyyjPeJI4ZmjUgEYdb34=","auth": "HoGxY7ImFFc0gTPX22o0jg=="}}},{"mons": ["0"],"subscription": {"endpoint": "https://fcm.googleapis.com/fcm/send/ffjqfsC-Jak:APA91bG23YCnksD_TjRBHgjMtdVEprvVHmk8HTRqoUXDHjH-PFChplrsk692PoW871-pEdM_kAlPH1l0CLseqInyNXY9o7ApVlTUZzaIfiNRN3OaGOZuhivo_SZfxdX0vLYVAT5nUI0I","expirationTime": null,"keys": {"p256dh": "BEYHWryugz3l3PB5_qDCahaj7NNI2rD-dhv6bxUH62H8ysvduen7PIhKcikTc2exc5PdyyjPeJI4ZmjUgEYdb34=","auth": "HoGxY7ImFFc0gTPX22o0jg=="}}}]';

describe('The server-push script', () => {

	let webPushStub;
	let subModelStub;

	beforeEach(() => {
	 	webPushStub = sinon.stub();
	 	subModelStub = sinon.stub();
		serverPush = proxyquire('../../../scripts/server-push', {
			'system-sleep': new sinon.stub().returns(Promise.resolve()),
			'../server/lib/webpush': webPushStub.returns({
				send: function (){}
			}),
			'../server/lib/map': new sinon.stub().returns(Promise.resolve(fakeMons)),
			'../server/models/sub': subModelStub.returns({
				find: function (){}
			}),
			'../server/lib/mongo': new sinon.stub().returns(Promise.resolve())
		});

		webPushStub.send = new sinon.stub().returns(Promise.resolve());
		subModelStub.find = new sinon.stub().returns(Promise.resolve([]));
		subModelStub.find = new sinon.stub().returns(Promise.resolve(JSON.parse(twoSubsFixture)));

		process.env.TEST = 'true';
		process.env.MAX_RADIUS = 2000;
	});

	afterEach(() => {
		delete process.env.TEST;
		delete process.env.MAX_RADIUS;
		webPushStub.reset();
		subModelStub.reset();
	});

	it('exports anonymous init function', () => {
		assert.equal(typeof serverPush, 'function');
	});

	it('calls web push', async () => {
		await serverPush();
		sinon.assert.called(webPushStub.send);
	});

	// it('calls webpush once per pokemon found, per subscription', async () => {
	// 	await serverPush();
	// 	const numSubs = Object.keys(JSON.parse(twoSubsFixture)).length;
	// 	sinon.assert.callCount(webPushStub.send, fakeMons.length * numSubs);
	// 	// TODO get the fake map to return both mons and raids, depending on the call
	// });

	// TODO fetch gets called only once per sub
});
