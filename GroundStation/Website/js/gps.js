


var gpsLocation = [51.505, -0.09]; // Replace with your GPS coordinates

var map = L.map('map').setView(gpsLocation, 13);

// Load local tiles
L.tileLayer('tiles/{z}/{x}/{y}.png', { // Adjust the path to your tiles
    maxZoom: 19,
    minZoom: 1,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.marker(gpsLocation).addTo(map)
    .bindPopup('You are here!')
    .openPopup();