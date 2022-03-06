// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([51.0447,-114.0719], 17);

/* to change the location of the map change the lat and long, here 40.717192,-74.012042.
To change the default zoom level change 17 to another number. 0 is entire world twice over and 18 is the closest you can get
*/

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([51.0547,-114.0819]).addTo(map)
    .bindPopup('The Borough of Manhattan Community College.')
    .openPopup();