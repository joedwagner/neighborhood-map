var placeList = [
    {
        name: 'Dairy Queen',
        location: {
            lat: 40.191609,
            lng: -88.401884
        }
    },
    {
        name: 'Monicals',
        location: {
            lat: 40.192528,
            lng: -88.399960
        }
    },
    {
        name: 'Arbys',
        location: {
            lat: 40.196382,
            lng: -88.399357
        }
    },
    {
        name: 'Charleys Philly Steak',
        location: {
            lat: 40.195606,
            lng: -88.399928
        }
    },
    {
        name: 'JT Walkers',
        location: {
            lat: 40.194967,
            lng: -88.403989
        }
    }
];

var Place = function (placeObj) {

    this.name = ko.observable(placeObj.name);
    this.location = ko.observable(placeObj.location);

}