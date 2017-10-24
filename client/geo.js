/* global google */

const updateBtn = require('./submit-logic.js');

if (navigator.geolocation) {
	window.geoPending = true;
	updateBtn();


	const mapContainer = document.getElementById('map');
	const subLocation = mapContainer.dataset.subLocation;
	const subLocData = JSON.parse(subLocation);

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

		let locations = [
			['You', window.lat, window.lng, 1],
			['Your notifications',parseFloat(subLocData.lat), parseFloat(subLocData.lng), 2],
		];

		console.log(locations);

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




	// make a toast. say gps or refresh // reduce timeout to see it
	}, () => {alert('Please enable your GPS');

  }, {maximumAge:600000, timeout:15000, enableHighAccuracy: true});

}
else {
	alert('Geolocation API is not supported in your browser.');
}