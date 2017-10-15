const randomUuid = uuidv4();
// const randomUuid = Math.random();

if (!document.cookie){
	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	window.fetch('/api/update-mons', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			// TODO send the thing
			mons: ['1', '123'] // unit test this is always an array, and always called mons
		}),
		credentials: 'same-origin',
		timeout: 2000
	});
});