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
            lat: 40.192680,
            lng: -88.399888
        }
    },
    {
        name: 'Hen House',
        location: {
            lat: 40.196687,
            lng: -88.397949
        }
    },
    {
        name: 'Los Zarapes',
        location: {
            lat: 40.196801,
            lng: -88.396100
        }
    },
    {
        name: 'Arbys',
        location: {
            lat: 40.196544,
            lng: -88.399344
        }
    }
];

var Place = function (placeObj) {

    this.name = ko.observable(placeObj.name);
    this.location = ko.observable(placeObj.location);

}