/* global uuidv4 initDialog */
const randomUuid = uuidv4();

if (!document.cookie){
	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');
const radiusField = document.querySelector('#radius');
const metresDisplay = document.querySelector('#metres');

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (!window.lat || !window.lng) {
		console.error('Waiting for location, please try again');
		return;
	}

	const mons = [].filter.call(document.querySelectorAll('input[type=checkbox]'), (c) => c.checked).map(c => c.value);

	console.log('mons');
	console.log(mons);

	// TODO tell them if their mon is misspelled
	const radius = radiusField.value;

	window.fetch('/api/update-mons', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			mons: mons,
			radius: radius,
			location: {
				lat: window.lat,
				lng: window.lng
			}
		}),
		credentials: 'same-origin',
		timeout: 5000
	})
	.then((res) => {
		initDialog(res);
	});
});

radiusField.addEventListener('input', () => {
	metresDisplay.innerText = `${radiusField.value}m`;
});
