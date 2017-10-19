/* global uuidv4 initDialog Cookies */
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

	const radius = radiusField.value;

	// TODO tidy
	navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
	  // Do we already have a push message subscription?
		serviceWorkerRegistration.pushManager.getSubscription()
		.then(function (pushSubscription) {
			console.log('pushSubscription', pushSubscription);
			if (!pushSubscription) {

				// TODO tidy
				initDialog({
					status: 'Not subscribed',
					statusText: 'Please try again'
				});
			}
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
					},
					subscription: pushSubscription
				}),
				credentials: 'same-origin',
				timeout: 5000
			})
			.then((res) => {
				try {
					initDialog(res);
				}
				catch(e) {
					// FIX if thrown, called twice
					console.log(e);
				}
			});
		})
		.catch(e =>{console.log(e);});
	});
});

radiusField.addEventListener('input', () => {
	metresDisplay.innerText = `${radiusField.value}m`;
});


// UUID in the header
const uuidContainer = document.querySelector('.uuid');
uuidContainer.innerHTML = Cookies.get('uuid');
