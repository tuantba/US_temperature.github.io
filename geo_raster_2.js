// initalize leaflet map
var map = L.map('map', {
	fullscreenControl: {
		pseudoFullscreen: false
	},
	minZoom: 3,
    maxZoom: 17,
}).setView([40, -120], 3);


//map.getPane('labels').style.pointerEvents = 'none';
// add OpenStreetMap basemap
//var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//});
//osm.addTo(map);

//var world_image = L.tileLayer('http://server.arcgisonline.com/ArcGIS/' 
//    + 'rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
//	,{ attribution: 'ESRI'
//});
//world_image.addTo(map);

// Satelite Layer


//var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//});
//Esri_WorldImagery.addTo(map);


var darkTile = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
    }).addTo(map);


//L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//	subdomains: 'abcd',
//	maxZoom: 20
//}).addTo(map);

// originally from https://globalwindatlas.info/downloads/gis-files
//var url_to_geotiff_file = "data/prate_test1.tif";


//var url_to_geotiff_file = 'https://georaster-layer-for-leaflet.s3.amazonaws.com/wind_speed_usa.tif'
var url_to_geotiff_file = 'data/less50.tif'

fetch(url_to_geotiff_file)
	.then(response => response.arrayBuffer())
	.then(arrayBuffer => {
		parseGeoraster(arrayBuffer).then(georaster => {
            console.log("georaster:", georaster);
			const min = 20
			const range = 350

			// available color scales can be found by running console.log(chroma.brewer);
			console.log(chroma.brewer);
			var scale = chroma.scale('YlGnBu');
			var tuanlayer = new GeoRasterLayer({
				georaster: georaster,
				opacity: 0.5,
				pixelValuesToColorFn: function(pixelValues) {
					var pixelValue = pixelValues[0]; // there's just one band in this raster

					// if there's zero wind, don't return a color
					if (pixelValue === 0) return null;

					// scale to 0 - 1 used by chroma
					var scaledPixelValue = (pixelValue - min) / range;

					var color = scale(scaledPixelValue).hex();

					return color;
				},
				resolution: 256
			});
			//console.log("layer:", layer);
			tuanlayer.addTo(map);

			map.on('click', function(evt) {
				var latlng = map.mouseEventToLatLng(evt.originalEvent);
				alert(geoblaze.identify(georaster, [latlng.lng, latlng.lat]));
			});
		});
	});
var Stamen_TonerHybrid = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png',
});
map.addLayer(Stamen_TonerHybrid,true);
