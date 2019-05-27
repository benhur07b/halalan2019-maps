mapboxgl.accessToken = 'pk.eyJ1Ijoicm9yc2NoYWNoMDdiIiwiYSI6ImNqYjh1NDRwYjBiaGEzM251bWF0a3c1cnAifQ.FEHNJbpxcs_UxuRhKbGF6A';

document.getElementById('candidate').onchange = function() {updateMap()};
document.getElementById('data').onchange = function() {updateMap()};

function updateMap() {
    var candidate = document.getElementById('candidate').value
    var data = document.getElementById('data').value
    var field = candidate + ' - ' + data
    map.setPaintProperty('provinces+ncr',
        'fill-color',
            styleField(),
     );
}

function styleField() {
    var candidate = document.getElementById('candidate').value
    var data = document.getElementById('data').value
    var field = candidate + ' - ' + data

    if (data == 'PERCENTAGE') {
        return [
        'step',
        ['get', field],
            // '#e8e8e8', 1.5,
            // '#a1d8d8', 3.0,
            // '#5ac8c8', 4.5,
            // '#8c96ba', 6.0,
            // '#be64ac', 100,
            '#fff5f0', 1.5,
            '#fdbea5', 3.0,
            '#fc7050', 4.5,
            '#d42020', 6.0,
            '#67000d', 100,
            ['rgba', 255, 255, 255, 0]
        ]
    }
    else if (data == 'PERCENT TOTAL VOTES') {
        return [
        'step',
        ['get', field],
            '#fff5f0', 0.5,
            '#fdbea5', 1.0,
            '#fc7050', 1.5,
            '#d42020', 2.0,
            '#67000d', 100,
            ['rgba', 255, 255, 255, 0]
        ]
    }
    else if (data == 'VOTES') {
        return [
        'step',
        ['get', field],
            '#fff5f0', 50000,
            '#fdbea5', 100000,
            '#fc7050', 300000,
            '#d42020', 500000,
            '#67000d', 10000000,
            ['rgba', 255, 255, 255, 0]
        ]
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rorschach07b/cjvyxov7x0sxr1clhccf42amm',
    // style: 'mapbox://styles/rorschach07b/cjvyxgqqw0sre1co0ulwlnkf9',
    zoom: 4.75,
    center: [122.5, 12.5],
     maxBounds: [[95, -15], [150, 40]]
});

map.on('load', function () {
    var candidate = document.getElementById('candidate').value
    var data = document.getElementById('data').value
    var field = candidate + ' - ' + data

    map.addSource(
        'provinces+ncr_results', {
            type: 'geojson',
            data: 'static/data/elections2019-provinces+ncr.geojson'
        }
    );

    map.addLayer({
        'id': 'provinces+ncr',
        'type': 'fill',
        'source': 'provinces+ncr_results',
        'layout': {},
        'paint': {
            'fill-color': styleField(),
            'fill-outline-color': '#000000',
        },
    });
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.on('click', 'provinces+ncr', function (e) {
    var candidate = document.getElementById('candidate').value
    var coordinates = e.lngLat;
    var coc = e.features[0].properties['COC_2019'];
    var votes = e.features[0].properties[candidate + ' - VOTES'];
    var percentage = e.features[0].properties[candidate + ' - PERCENTAGE'];
    var percent_total_votes = e.features[0].properties[candidate + ' - PERCENT TOTAL VOTES'];

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var popup_html ='<h6>' + coc + '</h6>'
                 + '<strong><h6>' + candidate + '</h6></strong><hr style="margin: 0.5em 0em">'
                 + '<p style="font-size: 15px"><strong>VOTES: </strong>' + votes
                 + '<br><strong>PERCENTAGE: </strong>' + percentage
                 + '<br><strong>PERCENT OF TOTAL VOTES: </strong>' + percent_total_votes + '</p>'

    new mapboxgl.Popup({closeButton:''})
        .setLngLat(coordinates)
        .setHTML(popup_html)
        .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'provinces+ncr', function () {
map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'provinces+ncr', function () {
map.getCanvas().style.cursor = '';
});
