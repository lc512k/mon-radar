/* global uuidv4 */
const randomUuid = uuidv4();

if (!document.cookie){
	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');
const monsField = document.querySelector('#mons');
const radiusField = document.querySelector('#radius');

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	// TODO tell them if their mon is misspelled
	const mons = monsField.value;
	const radius = radiusField.value || '1000';

	window.fetch('/api/update-mons', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			mons: mons, // TODO unit test this is always space separated, and always called mons. Also, POST same-origin and app/json
			radius: radius
		}),
		credentials: 'same-origin',
		timeout: 5000
	});
});