
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data) {
    console.log(data)

    createFeatures(data.features);

    let quakeMarkers = [];

    // REFERENCED https://leafletjs.com/examples/choropleth/
    function getColor(c) {
        return c > 90 ? "#7b3fff" :
               c > 70 ? "#686bdd" :
               c > 50 ? "#5b7fc0" :
               c > 30 ? "#21dabb" :
               c < 10 ? "#00f1b8" :
                        "#99f9e2" ;
    };

    for(i=0; i<data.features.length; i++) {
        let location = data.features[i].geometry;
        quakeMarkers.push(
            L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                stroke: true,
                weight: 0.5,
                fillOpacity: 0.9,
                color: "#000000",
                // REFERENCED https://leafletjs.com/examples/choropleth/
                fillColor: getColor(location.coordinates[2]),
                radius: (Math.sqrt(data.features[i].properties.mag)*5)
            })
        );
        /*if (location) {
            L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                color: "green",
                fillColor: "black",
                fillOpacity: 0.5,
                radius: 500
            }).addTo(myMap);
        }*/
    }
    //console.log(quakeMarkers)

    let markers = L.layerGroup(quakeMarkers);
    // ------------------------------ from bottom
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "street map": street,
        "topographic map": topo
    };

    let overlayMaps = {
        "earthquakes": markers
    };

    let myMap = L.map("map", {
        center: [48.3, -124.7],
        zoom: 4,
        layers: [street, markers]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
});



function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(feature.properties.place)
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

   // makeMap(earthquakes);
}

