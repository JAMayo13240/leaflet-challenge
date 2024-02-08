let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 7
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function chooseColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
  }

d3.json(url).then(function(response){
    features = response.features;

    for (let i = 0; i < features.length; i++) {
        let geometry = features[i].geometry.coordinates;
        let mag = features[i].properties.mag * 10000;
        let depth = chooseColor(geometry[2]);
        console.log(geometry[2]);
        L.circle([geometry[1], geometry[0]], {radius: mag, color: depth}).bindTooltip("<b>Magnitude: </b>" + mag/10000 + "<br><b>Longitude: </b> " + geometry[0] + "<br><b>Latitude: </b>" + geometry[1] + "<br><b>Depth: </b>" + geometry[2], {sticky: true}).addTo(myMap)
        
    }
    // Define legend control
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [10, 30, 50, 70, 90];
        let labels = [];

        // Loop through depth intervals and generate legend labels
        for (let i = 0; i < depths.length; i++) {
            labels.push(
                '<i style="background:' + chooseColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+'));
        }

        // Add legend labels to the div
        div.innerHTML = '<h4>Depth</h4>' + labels.join('');

        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);
});
 

