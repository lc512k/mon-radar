/* global google */
require('./lib/material.min.js');
const updateBtn = require('./submit-logic.js');
const toast = require('./dialog.js');

const drawMarkersAndInfo = (map, subLocData, radius) => {

	const markerBounds = new google.maps.LatLngBounds();

	let locations = [
		['You', window.lat, window.lng, 1, null],
	];

	if (subLocData) {
		const icon = 'img/location-blue.png';
		locations.push(['Your notifications', parseFloat(subLocData.lat), parseFloat(subLocData.lng), 2, icon]);
	}

	console.log(locations, subLocData);

	let infowindow = new google.maps.InfoWindow();

	for (let i = 0; i < locations.length; i++) {
		const position = new google.maps.LatLng(locations[i][1], locations[i][2]);
		const markerData = {
			position: position,
			map: map
		};

		markerBounds.extend(position);

		// Your notifications location
		if (locations[i][4]) {
			markerData.icon = locations[i][4];

			new google.maps.Circle({
				strokeColor: '#3f51b5',
				strokeOpacity: 0.7,
				strokeWeight: 2,
				fillColor: '#3f51b5',
				fillOpacity: 0.3,
				map: map,
				center: position,
				radius: radius
			});
		}
		const marker = new google.maps.Marker(markerData);

		google.maps.event.addListener(marker, 'click', ((marker, i) => {
			return () => {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			};
		})(marker, i));
	}

	map.fitBounds(markerBounds);
	map.setZoom(map.getZoom() - 6);
	console.timeEnd('marker');
};

const update = (radius = 0, newLocation) => {

	if (navigator.geolocation) {
		window.geoPending = true;
		updateBtn();

		const mapContainer = document.getElementById('map');
		const subLocation = mapContainer.dataset.subLocation;

		let subLocData;

		try {
			console.log('[GEO] parsing your old location', subLocation, 'or using', newLocation);
			subLocData = newLocation || JSON.parse(subLocation);
		}
		catch(e) {
			subLocData = null;
		}
		console.time('position');
		navigator.geolocation.getCurrentPosition((position) => {
			console.timeEnd('position');

			window.lat = position.coords.latitude;
			window.lng = position.coords.longitude;

			window.geoPending = false;
			updateBtn(true);

			console.time('map');
			const mapOptions = {
				gestureHandling: 'cooperative',
				zoom: 9,
				center: new google.maps.LatLng(window.lat, window.lng),
				mapTypeControl: true,
				navigationControlOptions: {
					style: google.maps.NavigationControlStyle.SMALL
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			const map = new google.maps.Map(mapContainer, mapOptions);

			console.timeEnd('map');
			console.time('marker');
			drawMarkersAndInfo(map, subLocData, radius);

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