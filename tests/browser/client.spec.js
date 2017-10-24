const sinon = require('sinon');

process.env.CHROME_BIN = '/tmp/headlessDataDir';

describe('The client script:', function () {

	describe('Submit', function () {
		const submitBtn = document.createElement('button');
		submitBtn.id = 'submit';
		document.body.appendChild(submitBtn);
		const mapDiv = document.createElement('div');
		mapDiv.id = 'map';
		document.body.appendChild(mapDiv);
		const radiusBtn = document.createElement('button');
		radiusBtn.id = 'radius';
		document.body.appendChild(radiusBtn);
		const metresSpan = document.createElement('span');
		metresSpan.id = 'metres';
		document.body.appendChild(metresSpan);
		const uuid = document.createElement('div');
		uuid.className = 'uuid';
		document.body.appendChild(uuid);
		const dialog = document.createElement('dialog');
		document.body.appendChild(dialog);
		const dialogTitle = document.createElement('div');
		dialogTitle.className = '.mdl-dialog__title';
		dialog.appendChild(dialogTitle);
		const dialogContent = document.createElement('div');
		dialogContent.className = '.mdl-dialog__content';
		dialog.appendChild(dialogContent);
		const closeBtn = document.createElement('button');
		closeBtn.className = 'close';
		dialog.appendChild(closeBtn);

		window.lat = 'foo';
		window.lng = 'foo';
		window.subscription = 'bar';

		let fetchStub = sinon.stub();
		window.fetch = fetchStub.returns(Promise.resolve('fetch resolve'));


		// let initDialogStub = sinon.stub();
		// initDialog = initDialogStub;
		// require('../../public/dialog');
		require('../../client/main');
		// FIX use webpack & bundle for karma tests

		// it('should call fetch once when clicking the submit button', function () {
		// 	const submitBtn = document.querySelector('#submit');
		// 	submitBtn.click();
		// 	console.log('[TEST] fetchStub');
		// 	console.log(fetchStub);
		// 	sinon.assert.calledOnce(fetchStub);
		// });
	});

	// TODO fix cookie deletion
	// describe('The Cookie', function () {
	// 	const button = document.createElement('button');
	// 	button.id = 'submit';
	// 	document.body.appendChild(button);

	// 	beforeEach(function () {
	// 		console.log('original cookie before each', document.cookie);
	// 		const uuid = Cookies.get('uuid');
	// 		// console.log('uuid', uuid);
	// 		document.cookie = `uuid=${uuid}; expires=Thu, 18 Dec 2001 12:00:00 UTC; path=/`;
	// 		console.log('deleted cookie before each', document.cookie);
	// 	});

	// 	it('Should not be set if one already exists', function () {
	// 		document.cookie = 'uuid=foo'
	// 		const oldCookie = document.cookie;
	// 		// console.log('oldCookie', oldCookie)
	// 		require('../../public/client');
	// 		// console.log('new', document.cookie)
	// 		assert(document.cookie === oldCookie);
	// 	});
	// 	it('Should be set if none exists', function () {
	// 		console.log('current cookie', document.cookie);

	// 		// const domain = domain || document.domain;
	// 		const client = require('../../public/client');
	// 		console.log('after client', document.cookie);
	// 		assert(document.cookie !== '');
	// 		// assert(typeof document.cookie, 'string');
	// 	});
	// });
});