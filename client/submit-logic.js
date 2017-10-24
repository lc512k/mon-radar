const submitButton = document.querySelector('#submit');

module.exports = (update) => {
	console.log('updateBtn()');

	if (!window.geoPending && window.subscription) {
		submitButton.disabled = false;
	}
	else {
		submitButton.disabled = true;
	}

	submitButton.innerText = update ? 'Update' : 'Submit';
};
