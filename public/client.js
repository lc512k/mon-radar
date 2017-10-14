const randomUuid = uuidv4();
// const randomUuid = Math.random();

if (!document.cookie || document.cookie === ''){
	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	window.fetch('/api/update', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			// TODO send the thing
			some: 'thing'
		}),
		credentials: 'same-origin',
		timeout: 2000
	});
});