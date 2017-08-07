function init() {

    // Create the map
    var map = initMap();

    if (map === null) {
        document.getElementById('map').innerHTML = "No map could be display.";
    }

    // Create the ViewModel
    var vM = new ViewModel(placeList, map);
    ko.applyBindings(vM);

}

// Create the ViewModel class to go between models and views
var ViewModel = function (placeList, map) {

    var self = this;

    // Create observable placeList
    self.placeList = ko.observableArray();

    placeList.forEach(function (place) {
        self.placeList().push(new Place(place));
    });

    self.placeList().forEach(function (place) {
        place.marker = new google.maps.Marker({
            position: place.location(),
            title: place.name()
        });
    });

    // Place the markers on the map
    self.placeMarkers = function(placeList) {
        placeList.forEach(function (place) {
            place.marker.setMap(map);
        });
        if (placeList.length > 0) {
            map.setCenter(getCenter(placeList));
        }
    };

    self.addEvents = function() {
        self.placeList().forEach(function (place) {
            place.marker.addListener('click', function() {
                self.setHighlightedPlace(place);
            })
        });
    }

    self.placeMarkers(self.placeList());

    // All places start as visible
    self.visiblePlaceList = ko.observableArray(self.placeList());

    // Filter for list/map when text is entered
    self.placeListFilter = ko.pureComputed({
        read: function() {
            return "";
        },
        write: function(value) {

            self.visiblePlaceList([]);

            // Loop through places and figure out which match user input
            // Add the place / marker to the visible lists
            self.placeList().forEach(function (place) {
                place.marker.setMap(null);
                if (place.name().toLowerCase().includes(value.toLowerCase())) {
                    self.visiblePlaceList.push(place);
                    place.marker.setMap(map);
                    self.removeHighlightedPlace();
                }
            });
        },
        owner: self
    });

    self.highlightedPlace = ko.observable({name: ""});

    self.setHighlightedPlace = function (place) {
        if (self.highlightedPlace().marker) {
            self.highlightedPlace().marker.setAnimation(null);
        }
        self.highlightedPlace(place);
        self.highlightedPlace().marker.setAnimation(google.maps.Animation.BOUNCE);
        document.getElementById('placeInfo').classList.remove('hidden');
    };

    self.addEvents();

    self.removeHighlightedPlace = function () {
        document.getElementById('placeInfo').classList.add('hidden');
        self.highlightedPlace("");
    }
}

