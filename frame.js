token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A"
var map = L.map('mapid').setView([55, -114.6], 6.2);
mapLayer = ['https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
            'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=' + token,
            'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token=' + token,
            'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=' + token,
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
]
L.tileLayer(mapLayer[6], {
    maxZoom: 18,
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    // 	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    // 	'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map)

function upd_treeTech() {
    var treeTech = arr2tree(spa.generator.features.map(v => v.properties),['type','technology'])
    // treeTech[1]['children'][2]["state"] = { "opened": true, "selected": true }
    treeTech[0]["state"] = { "opened": true, "selected": true }
    $('#treeTech').jstree({
        'core': {
            'data': treeTech
        },
        "themes" : {
            "theme" : "default",
            "dots" : true,
            "icons" : true
        },
        "types" : {
            "default" : {
                 },
            "type" : {
                   "icon" : "glyphicon glyphicon-globe"
                  },
             "technology": {
                   "icon" : "glyphicon glyphicon-cloud"
                  },
             "sub": {
                   "icon" : "glyphicon glyphicon-picture"
                  },
             "cmp": {
                   "icon" : "glyphicon glyphicon-cog"
                  }
       },
        "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        "search" : {
                   "case_insensitive" : true,
                   "show_only_matches": true         
     }            
    });    

    var treeOwner = arr2tree(spa.generator.features.map(v => v.properties),['owner'])
    treeOwner =[{text:"Onwer", type: "type", children: treeOwner}]
    // treeOwner[0]["state"] = { "selected": true , "opened": false}
    $('#treeOwner').jstree({
        'core': {
            'data': treeOwner
        },
        "themes" : {
            "theme" : "default",
            "dots" : true,
            "icons" : true
        },
        "types" : {
            "default" : {
                 },
            "type" : {
                   "icon" : "glyphicon glyphicon-globe"
                  },
             "owner": {
                   "icon" : "glyphicon glyphicon-cloud"
                  },
             "sub": {
                   "icon" : "glyphicon glyphicon-picture"
                  },
             "cmp": {
                   "icon" : "glyphicon glyphicon-cog"
                  }
       },
        "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        "search" : {
                   "case_insensitive" : true,
                   "show_only_matches": true         
     }            
    });      
}

$('#treeTech').on('changed.jstree', function (e, data) {
    var i, j, r;
    spa.listTech = [];
    for (i = 0, j = data.selected.length; i < j; i++) {
        if (data.instance.get_node(data.selected[i]).type == 'technology') {
            r = data.instance.get_node(data.selected[i]);
            spa.listTech.push(r.text);
        }
    }
    upd_map(spa.generator.features) 
    map.fitBounds(spa.markGroup.getBounds())
})  
$('#treeOwner').on('changed.jstree', function (e, data) {
    var i, j, r;
    spa.listOwner = [];
    for (i = 0, j = data.selected.length; i < j; i++) {
        if (data.instance.get_node(data.selected[i]).type == 'owner') {
            r = data.instance.get_node(data.selected[i]);
            spa.listOwner.push(r.text);
        }
    }
    upd_map(spa.generator.features) 
    map.fitBounds(spa.markGroup.getBounds())
})  

function arr2tree(arr,keyList) {
    var tree = [];
    var key = keyList[0]; //keys(arr[0]);
    var vList 
    var k = keyList[0];
    vList = [...new Set(arr.map(obj => obj[k]))];
    vList.forEach((v,i) => { 
        if (keyList.length > 1) {
            tree.push({ 'text': v, 'type':k, 'children': [] });
            // var arr1 = arr.filter((value, index, self) => self[index][k] == v);
            var arr1 = arr.filter((value) => value[k] == v);  // self[index][k] is same as value[k]
            tree[i].children = arr2tree(arr1,keyList.slice(1,));
        } else {
            tree.push({ 'text': v, 'type':k});
        } 
    })
    return tree; 
}
