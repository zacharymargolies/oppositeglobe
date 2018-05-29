var locations = {
			selectLat: 0,
			selectLong: 0,
			oppLat: 0,
			oppLong: 0
		}
		
		document.querySelector(".add__btn").addEventListener("click", function() { 
			// Remove markers
			removeMarkers();
			// Get geocoded coordinates, populate lat/lng boxes
			codeAddress();
		});

		document.getElementById("opposite").addEventListener("click", function() {
			// Update current location data structure
			if (document.querySelector(".address").value !== "") {
			locations.selectLat = geolocation[0];
			locations.selectLong = geolocation[1];
			} else {
			locations.selectLat = parseFloat(document.querySelector(".latitude").value);
			locations.selectLong = parseFloat(document.querySelector(".longitude").value);
			}
			// Remove markers
			removeMarkers();
			// Add location marker
			(function() {
			var marker = new google.maps.Marker({
          		position: {lat: locations.selectLat , lng: locations.selectLong},
          		map: map
        	});
			markers.push(marker);
			bounds.extend({lat: locations.selectLat , lng: locations.selectLong});
			map.fitBounds(bounds);
			console.log("Ran.");
        })();
			// Calculate opposite location
			oppLocation(locations.selectLat, locations.selectLong);
			// Update UI
			updateLocation(locations.selectLat, locations.selectLong);
			updateOppositeLocation(locations.oppLat, locations.oppLong);
			// Draw opposite location marker
			addOppLocationMarker();
			// Clear input fields
			document.querySelector(".address").value = "";
			document.querySelector(".latitude").value = "";
			document.querySelector(".longitude").value = "";
		});
		
        /// --- GET USER INPUT --- ///
		 
        function getUserInput() {
			if (typeof document.querySelector(".latitude") !== "undefined" && typeof document.querySelector(".longitude") !== "undefined") {
				locations.selectLat = document.querySelector(".latitude").value;
				locations.selectLong = document.querySelector(".longitude").value;
            } 
            
		}
        
        /// --- UPDATE UI TEXT FIELDS --- ///
        function updateLocation(latText, longText) {
			document.querySelector(".latitude__title--value").textContent = latText.toFixed(5);
            document.querySelector(".longitude__title--value").textContent = longText.toFixed(5);
        }

        function updateOppositeLocation(latitude, longitude) {
            document.getElementById("opposite--latitude").textContent = locations.oppLat.toFixed(5);
            document.getElementById("opposite--longitude").textContent = locations.oppLong.toFixed(5);
        }
		
        /// --- CALCULATE OPPOSITE COORDINATES --- ///
		function oppLocation(latitude, longitude) {
			if (longitude > 0) {
				locations.oppLong = longitude - 180;
			} else if (longitude < 0) {
				locations.oppLong = longitude + 180; 
			}
			
			locations.oppLat = latitude*-1;
            
		}
		
		/// --- ADD OPPOSITE LOCATION MARKER --- ///
		function addOppLocationMarker() {
          var marker = new google.maps.Marker({
          position: {lat: locations.oppLat , lng: locations.oppLong},
          map: map,
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
			markers.push(marker);
			bounds.extend({lat: locations.oppLat , lng: locations.oppLong});
			map.fitBounds(bounds);
        }

        /// --- GET GEOCODED ADDRESS --- ///
        var geolocation = [];
		function codeAddress() {
        var address = document.querySelector('.address').value;
            
        geocoder.geocode( { 'address': address}, 
			function(results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
				geolocation[0] = results[0].geometry.location.lat();
				geolocation[1] = results[0].geometry.location.lng();
				document.querySelector(".latitude").value = results[0].geometry.location.lat();
				document.querySelector(".longitude").value = results[0].geometry.location.lng();
				var marker = new google.maps.Marker({
                	map: map,
                	position: results[0].geometry.location
				});
				markers.push(marker);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
    		});
  		}

		/// --- REMOVE MARKERS --- ///
		function removeMarkers () {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
		}

		
        /// --- MAP --- ///
      var map, infoWindow, pos;
	  var markers = [];
		function initMap() {
		//Create map
		map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -40.397, lng: 150.644},
          zoom: 6
        });
        
		bounds = new google.maps.LatLngBounds();
        infoWindow = new google.maps.InfoWindow;
        geocoder = new google.maps.Geocoder();
            
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          var marker = new google.maps.Marker({
              map: map,
              position: pos
          });
			  markers.push(marker);
			  bounds.extend(pos);
			  map.fitBounds(bounds);
              updateLocation(pos.lat, pos.lng);
              oppLocation(pos.lat, pos.lng);
              addOppLocationMarker();
              updateOppositeLocation();
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      
		
	  // Location Error
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
		
		}
	 
    
   