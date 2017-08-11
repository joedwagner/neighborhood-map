function init(error) {

    var map = null;

    if (!error) {
        // Create the map
        map = initMap();

    } else {
        console.log($);
        alert('Error loading Google Map. Please reload the page and try again.');
    }
    // Create the ViewModel
    var vM = new ViewModel(placeList, map);
    ko.applyBindings(vM);

}

// Create the ViewModel class to go between models and views
// Code based on Knockout.js documentation
var ViewModel = function (placeList, map) {

    var self = this;

    self.menuState = ko.observable('menu');
    self.navHidden = ko.observable(true);

    self.toggleNav = function() {
        self.menuState(self.menuState() === 'menu' ? 'close menu' : 'menu');
        self.navHidden(!self.navHidden());
    };

    // Create observable placeList
    self.placeList = ko.observableArray();

    placeList.forEach(function (place) {
        self.placeList().push(new Place(place));
    });

    self.showInputBox = function () {
        self.filterClicked(!self.filterClicked());
    };

    self.placeList().forEach(function (place) {
        if (map !== null) {
            place.marker = new google.maps.Marker({
                position: place.location(),
                title: place.name()
            });
        }
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
            });
        });
    };

    if (map !== null) {
        self.placeMarkers(self.placeList());
        self.addEvents();
    }

    // All places start as visible
    self.visiblePlaceList = ko.observableArray(self.placeList());

    // Filter for list/map when text is entered
    // Code inspired by Knockout.js documentation on Computed observables
    self.placeListFilter = ko.pureComputed({
        read: function() {
            return "";
        },
        write: function(value) {

            self.visiblePlaceList([]);

            // Loop through places and figure out which match user input
            // Add the place / marker to the visible lists
            self.placeList().forEach(function (place) {
                place.marker.setVisible(false);
                if (place.name().toLowerCase().includes(value.toLowerCase())) {
                    self.visiblePlaceList.push(place);
                    place.marker.setVisible(true);
                }
            });
        },
        owner: self
    });

    self.highlightedPlace = ko.observable({name: ""});

    // To be displayed in placeInfo slide-in div
    self.highlightedPlaceName = ko.observable("");
    self.highlightedPlaceAddress = ko.observable();
    self.highlightedPlacePhone = ko.observable();
    self.highlightedPlaceCheckins = ko.observable();
    self.highlightedPlaceUsers = ko.observable();
    self.highlightedPlaceMenuLink = ko.observable();
    self.highlightedPlaceVenueLink = ko.observable();

    self.setHighlightedPlace = function (place) {

        // Stop marker bouncing
        if (self.highlightedPlace().marker) {
            self.highlightedPlace().marker.setAnimation(null);
        }

        // Only allow place information to display if map was loaded correctly
        if (document.getElementsByClassName('gm-err-container').length === 0) {

            // Switch the highlighted place and make its marker bounce
            self.highlightedPlace(place);
            self.highlightedPlace().marker.setAnimation(google.maps.Animation.BOUNCE);

            // Show the place details div
            document.getElementById('placeInfo').classList.remove('hidden');

            // Recenter map, then move up to make room for div sliding from bottom
            map.panTo(self.highlightedPlace().marker.getPosition());

            self.getPlaceInfo(place);

        }
    };

    self.apiSuccess = ko.observable(false);

    self.getPlaceInfo = function (place) {

        // Get the place information from Foursquare API
        // Source: https://developer.foursquare.com/docs/venues/venues
        var url = 'https://api.foursquare.com/v2/venues/search?' +
        'll=' + place.location().lat + ', ' + place.location().lng +
        '&client_id=ZJ5U0M0LNOD2FUM33OKNRXU4LXSXIFHPQM0OJEQAN2VFZXB2' +
        '&client_secret=WBVIJMBG5G5LBHIFJSUZILZNKMD0YVKCTRHWFYZN15DC4B1H' +
        '&v=20170731' +
        '&limit=1';

        $.ajax(url, {
            success: function (data) {
                if (data.response.venues.length > 0) {
                    self.apiSuccess(true);
                    var venue = data.response.venues[0];
                    self.highlightedPlaceName(venue.name ? venue.name : 'No address found');
                    self.highlightedPlaceAddress(venue.location.address ? venue.location.address : 'No address available');
                    self.highlightedPlacePhone(venue.contact.formattedPhone ? venue.contact.formattedPhone : 'No phone # available');
                    self.highlightedPlaceCheckins(venue.stats.checkinsCount ? venue.stats.checkinsCount : '0');
                    self.highlightedPlaceUsers(venue.stats.usersCount ? venue.stats.usersCount : '0');
                    self.highlightedPlaceMenuLink(venue.hasMenu ?  venue.menu.url : false);
                    self.highlightedPlaceVenueLink('https://foursquare.com/v/' + venue.id);
                } else {
                    self.apiSuccess(false);
                }
            },
            error: function () {
                self.apiSuccess(false);
            }
        });
    };

    self.removeHighlightedPlace = function () {
        self.highlightedPlace().marker.setAnimation(null);
        document.getElementById('placeInfo').classList.add('hidden');
        self.highlightedPlace("");

        map.panTo(getCenter(self.placeList()));

    };
};

