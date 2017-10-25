/* global google */
require('./lib/material.min.js');
const updateBtn = require('./submit-logic.js');
const toast = require('./dialog.js');

const drawInfoWindows = (map, subLocData) => {
	let locations = [
		['You', window.lat, window.lng, 1],
	];

	if (subLocData) {
		locations.push(['Your notifications', parseFloat(subLocData.lat), parseFloat(subLocData.lng), 2]);
	}

	console.log(locations, subLocData);

	let infowindow = new google.maps.InfoWindow();

	for (let i = 0; i < locations.length; i++) {

		const marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});

		google.maps.event.addListener(marker, 'click', ((marker, i) => {
			return () => {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			};
		})(marker, i));
	}
};

const update = (newLocation) => {
	if (navigator.geolocation) {
		window.geoPending = true;
		updateBtn();

		const mapContainer = document.getElementById('map');
		const subLocation = mapContainer.dataset.subLocation;

		let subLocData;

		// You either just updated (newLocation) or had one set in the server earlier (subLocation)
		subLocData = newLocation || subLocation;

		try {
			console.log('[GEO] parsing your old location', subLocData);
			subLocData = JSON.parse(subLocation);
		}
		catch(e) {
			// If neither, you're brand new
			subLocData = null;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			window.lat = position.coords.latitude;
			window.lng = position.coords.longitude;

			window.geoPending = false;
			updateBtn(true);

			const mapOptions = {
				zoom: 9,
				center: new google.maps.LatLng(window.lat, window.lng),
				mapTypeControl: true,
				navigationControlOptions: {
					style: google.maps.NavigationControlStyle.SMALL
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};


			const map = new google.maps.Map(mapContainer, mapOptions);

			drawInfoWindows(map, subLocData);

		}, () => {
			toast({status: 'Oops, can\'t locate you. Is your GPS on?'});
		},
		{
			maximumAge: 600000,
			timeout: 15000,
			enableHighAccuracy: true
		});
	}
	else {
		console.error('Geolocation API is not supported in your browser.');
	}
};

module.exports = {update};