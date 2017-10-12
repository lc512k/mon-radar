if (!document.cookie){
	document.cookie = `uuid=${uuidv4()}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	fetch('/api/update', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			some: 'thing'
		}),
		credentials: 'same-origin',
		timeout: 2000
	});
});