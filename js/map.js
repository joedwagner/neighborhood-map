// var apiKey = 'AIzaSyAlBvvWTlQmn-wLFl0bM6JVS3SRp-gCwQg';

// Creates Google Map object, sets center, and returns it
// Code inspired by Google Maps API documentation
function initMap() {

    var map;

    var mahomet = new google.maps.LatLng(40.1953, -88.4042);

    // Create the map and zoom in
    // Positioning code from Google Maps Control Positioning documentation
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mahomet,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
    });

    // Re-center map when the div is resized
    map.addListener('resize', function () {
        map.setCenter(mahomet);
    })

    return map;
}

// Returns a LatLng that is the average of a list of markers
function getCenter(placeList) {

    var lat = 0;
    var lng = 0;

    var size = placeList.length;

    placeList.forEach(function (place) {
        lat += place.marker.position.lat();
        lng += place.marker.position.lng();
    });

    return new google.maps.LatLng(lat/size, lng/size);
}