const locationContainer = document.querySelector('#location');

if (navigator.geolocation) {
	console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    locationContainer.innerHTML = 'Geolocation is not supported by this browser.';
}

function showPosition (position) {
    locationContainer.innerHTML = 'Latitude: ' + position.coords.latitude +
    '<br>Longitude: ' + position.coords.longitude;
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
