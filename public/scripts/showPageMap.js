
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'showMap', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: plan.geometry.coordinates, // starting position [lng, lat]
    zoom: 6, // starting zoom
    interactive: false
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: '#AB353F' })
    .setLngLat(plan.geometry.coordinates)
    .addTo(map);
