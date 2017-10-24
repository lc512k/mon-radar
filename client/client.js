// /* global uuidv4 initDialog Cookies */

// const randomUuid = uuidv4();

// if (!document.cookie){
// 	document.cookie = `uuid=${randomUuid}; expires=Thu, 18 Dec 2021 12:00:00 UTC; path=/`;
// }

// const submitBtn = document.querySelector('#submit');
// const radiusField = document.querySelector('#radius');
// const metresDisplay = document.querySelector('#metres');

// submitBtn.addEventListener('click', (e) => {
// 	e.preventDefault();

// 	if (!window.lat || !window.lng) {
// 		console.error('Waiting for location, please try again');
// 		return;
// 	}

// 	const mons = [].filter.call(document.querySelectorAll('input[type=checkbox]'), (c) => c.checked).map(c => c.value);

// 	console.log('mons');
// 	console.log(mons);

// 	const radius = radiusField.value;

// 	if (!window.subscription) {
// 		initDialog({
// 			status: 'Client error.',
// 			statusText: 'Try again.'
// 		});
// 		return;
// 	}

// 	window.fetch('/api/save', {
// 		method: 'POST',
// 		headers: {
// 			'content-type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			mons: mons,
// 			radius: radius,
// 			location: {
// 				lat: window.lat,
// 				lng: window.lng
// 			},
// 			subscription: window.subscription
// 		}),
// 		credentials: 'same-origin',
// 		timeout: 5000
// 	})
// 	.then((res) => {
// 		console.log('server responded: ', res);
// 		initDialog(res);
// 	})
// 	.catch(e => {
// 		console.log(e);
// 	});

// });

// radiusField.addEventListener('input', () => {
// 	metresDisplay.innerText = `${radiusField.value}m`;
// });

// // UUID in the header
// const uuidContainer = document.querySelector('.uuid');
// uuidContainer.innerHTML = Cookies.get('uuid');
