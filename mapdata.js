spa = {
}
geoJson_gen = './data/generator.json'
$.getJSON(geoJson_gen, function(obj) {
    spa.generator = obj
    upd_treeTech()
    upd_map(obj.features)
});
geoJson_gen = './data/area.json'
$.getJSON(geoJson_gen, function(obj) {
    spa.area = obj
    upd_map(obj.features)   
});

var myIcon = L.icon({
    iconUrl: './icon/coal.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

function upd_map(features) {
    var markers = []
    if (map.hasLayer(spa.markGroup)) map.removeLayer(spa.markGroup)
    features.forEach(f => {
        if (f.properties.type == 'generator') {
            // L.marker(f.geometry.coordinates.reverse(), { title: f.properties.name }).addTo(spa.markerGen)
            if (f.properties.type == 'generator' 
            & (spa.listTech == undefined ? true : spa.listTech.includes(f.properties.technology))  
            & (spa.listOwner == undefined ? true : spa.listOwner.includes(f.properties.owner))    
            ) {
                var marker = L.marker([f.geometry.coordinates[1],f.geometry.coordinates[0]], { title: f.properties.name })
                .bindPopup(JSON.stringify(f.properties).replace(/["\{]/g, '').replace(/:/g, ":<b>").replace(/,/g, "<\/b><br>").replace(/\}/g, "<\/b>"))
                .on('click', function(e) {
                    $("#infoBlock").html(JSON.stringify(f.properties).replace(/["\{]/g, '').replace(/:/g, ":<b>").replace(/,/g, "<\/b><br>").replace(/\}/g, "<\/b>"))
                })
            markers.push(marker)
            }
        } else if (f.properties.type == 'area') {
            L.polygon(f.geometry.coordinates[0].map(v => v.reverse()), 
            {title: f.properties.name}).addTo(map)
                .bindPopup(f.properties.name);
        }
    });
    spa.markGroup = L.featureGroup(markers).addTo(map)
}

// Haversine formula from https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};