mapboxgl.accessToken = 'pk.eyJ1Ijoicm9yc2NoYWNoMDdiIiwiYSI6ImNqYjh1NDRwYjBiaGEzM251bWF0a3c1cnAifQ.FEHNJbpxcs_UxuRhKbGF6A';

document.getElementById('candidate1').onchange = function() {updateMap()};
document.getElementById('candidate2').onchange = function() {updateMap()};

function updateMap() {
    map.setPaintProperty('provinces+ncr',
        'fill-color',
            styleField(),
     );
}

function styleField() {
    var candidate1 = document.getElementById('candidate1').value
    var candidate2 = document.getElementById('candidate2').value

    return [
    'case',
        ['all', ['<=', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 1.0]], '#e8e8e8',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 1.0]], '#ace4e4',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 1.0]], '#5ac8c8',
        ['all', ['<=', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#dfb0d6',
        ['all', ['<=', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#be64ac',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#a5add3',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#8c62aa',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 1.0], ['<=', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#5698b9',
        ['all', ['>', ['get', candidate1 + ' - PERCENTAGE'], 5.0], ['>', ['get', candidate2 + ' - PERCENTAGE'], 5.0]], '#3b4994',
        '#ffffff'
    ]
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
    var candidate1 = document.getElementById('candidate1').value
    var candidate2 = document.getElementById('candidate2').value

    map.addSource(
        'provinces+ncr_results', {
            type: 'geojson',
            data: 'static/data/elections2019-partylists-provinces+ncr.geojson'
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
    var candidate1 = document.getElementById('candidate1').value
    var candidate2 = document.getElementById('candidate2').value
    var coordinates = e.lngLat;
    var coc = e.features[0].properties['COC_2019'];
    var votes1 = e.features[0].properties[candidate1 + ' - VOTES'];
    var percentage1 = e.features[0].properties[candidate1 + ' - PERCENTAGE'];
    var percent_total_votes1 = e.features[0].properties[candidate1 + ' - PERCENT TOTAL VOTES'];
    var votes2 = e.features[0].properties[candidate2 + ' - VOTES'];
    var percentage2 = e.features[0].properties[candidate2 + ' - PERCENTAGE'];
    var percent_total_votes2 = e.features[0].properties[candidate2 + ' - PERCENT TOTAL VOTES'];

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // var popup_html ='<h6>' + coc + '</h6>'
    //              + '<strong><h6>' + candidate + '</h6></strong><hr style="margin: 0.5em 0em">'
    //              + '<p style="font-size: 15px"><strong>VOTES: </strong>' + votes
    //              + '<br><strong>PERCENTAGE: </strong>' + percentage
    //              + '<br><strong>PERCENT OF TOTAL VOTES: </strong>' + percent_total_votes + '</p>'

    var popup_html = '<h6>' + coc + '</h6>' +
                     '<table>' + '<tr><th style="padding: 4px;">Candidate</th><th style="padding: 4px;">Votes</th><th style="padding: 4px;">%</th></tr>' +
                     '<tr><td style="padding: 4px;">' + candidate1 + '</td>' + '<td style="padding: 4px;">' + votes1 + '</td>' + '<td style="padding: 4px;">' + percentage1 + '</td></tr>' +
                     '<tr><td style="padding: 4px;">' + candidate2 + '</td>' + '<td style="padding: 4px;">' + votes2 + '</td>' + '<td style="padding: 4px;">' + percentage2 + '</td></tr>' + '</table>'

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
