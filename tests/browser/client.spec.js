const sinon = require('sinon');

describe('The client script:', function () {

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

	describe('Submit', function () {
		const button = document.createElement('button');
		button.id = 'submit';
		document.body.appendChild(button);

		let fetchStub = sinon.stub();
		fetch = fetchStub;
		require('../../public/client');

		it('should call fetch once when clicking the submit button', function () {
			const submitBtn = document.querySelector('#submit');
			submitBtn.click();
			sinon.assert.calledOnce(fetchStub);
		});
	});
});