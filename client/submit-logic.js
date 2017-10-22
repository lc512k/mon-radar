const submitButton = document.querySelector('#submit');

module.exports = () => {
	console.log('updateBtn()');
	if (!window.geoPending && window.subscription) {
		submitButton.disabled = false;
	}
	else {
		submitButton.disabled = true;
	}
};
