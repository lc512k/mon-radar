const locationContainer = document.querySelector('#location');

if (navigator.geolocation) {
	console.log(navigator.geolocation);
	const submitButton = document.querySelector('#submit');
	submitButton.disabled = true;
	window.geoPending = true;
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    locationContainer.innerHTML = 'Geolocation is not supported by this browser.';
}

function showPosition (position) {
	window.lat = position.coords.latitude;
	window.lng = position.coords.longitude;

	const displayLat = window.lat;
	const displayLng = window.lng;

	const submitButton = document.querySelector('#submit');
	window.geoPending = false;
	submitButton.disabled = false;
    locationContainer.innerHTML = `<b>Lat</b>: ${displayLat}, <b>Long</b>: ${displayLng}<br>(Map soon)`;
}

// function initMap () {
// 	const uluru = {lat: -25.363, lng: 131.044};
// 	const map = new google.maps.Map(document.getElementById('map'), {
// 		zoom: 4,
// 		center: uluru
// 	});
// 	console.log('MAP****', map)
// 	const marker = new google.maps.Marker({
// 		position: uluru,
// 		map: map
// 	});
// }
