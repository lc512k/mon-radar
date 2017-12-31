require('./lib/material.min.js');
require('./push.js');
const geo = require('./geo.js');
const uuidv4 = require('./lib/uuid-v4.js');
const Cookies = require('./lib/js.cookie.js');
const initDialog = require('./dialog.js');
const randomUuid = uuidv4();

if (!document.cookie){
	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
}

const submitBtn = document.querySelector('#submit');
const radiusField = document.querySelector('#radius');
const metresDisplay = document.querySelector('#metres');
const raidsRadiusField = document.querySelector('#raidsRadius');
const raidsMetresDisplay = document.querySelector('#raidsMetres');

geo.update(parseInt(radiusField.value, 10), parseInt(raidsRadiusField.value, 10));

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (!window.lat || !window.lng) {
		console.error('Waiting for location, please try again');
		return;
	}

	const mons = [].filter.call(document.querySelectorAll('input[type=checkbox][data-mons="true"]'), (c) => c.checked).map(c => c.value);
	const raids = [].filter.call(document.querySelectorAll('input[type=checkbox][data-raids="true"]'), (c) => c.checked).map(c => c.value);

	console.log('mons');
	console.log(mons);

	const radius = radiusField.value;
	const raidsRadius = raidsRadiusField.value;

	if (!window.subscription) {
		initDialog({
			status: 'Client error.',
			statusText: 'Try again.'
		});
		return;
	}

	window.fetch('/api/save', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			mons: mons,
			raids: raids,
			radius: radius,
			raidsRadius: raidsRadius,
			location: {
				lat: window.lat,
				lng: window.lng
			},
			subscription: window.subscription
		}),
		credentials: 'same-origin',
		timeout: 5000
	})
	.then((res) => {
		console.log('server responded: ', res);
		initDialog(res);
		return res.json();
	})
	.then((body) => {
		console.log('server responded (body): ', body);
		geo.update(parseInt(radius, 10),parseInt(raidsRadius, 10), body);
	})
	.catch(e => {
		console.log(e);
	});

});

radiusField.addEventListener('input', () => {
	metresDisplay.innerText = `${radiusField.value}m`;
});
raidsRadiusField.addEventListener('input', () => {
	raidsMetresDisplay.innerText = `${raidsRadiusField.value}m`;
});

// UUID in the header
const uuidContainer = document.querySelector('.uuid');
uuidContainer.innerHTML = Cookies.get('uuid');


// select/deselect all
document.querySelector('#all').addEventListener('change', (e) => {

	const checkboxes = document.querySelectorAll('input[type=checkbox][data-mons="true"]');

	if (e.target.checked) {
		for (let box of checkboxes) {
			box.checked = true;
		}
	}
	else {
		for (let box of checkboxes) {
			box.checked = false;
		}
	}
});
