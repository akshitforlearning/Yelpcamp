mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgrounds.title}</h3><p>${campgrounds.location}</p>`
            )
    )
    .addTo(map)