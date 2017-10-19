const submitButton = document.querySelector('#submit');

function updateBtn () {
	console.log('updateBtn()');
	if (!window.geoPending && window.subscription) {
		submitButton.disabled = false;
	}
	else {
		submitButton.disabled = true;
	}
}