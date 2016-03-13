com_example_vaadintest_jscomponents_OlMap = function() {

	'use strict'

	var componentElement = $(this.getElement());
	componentElement.attr('id','map');

	componentElement.width($(window).width());
	componentElement.height($(window).height());

	var styles = {
			'test': new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 1
				})
			}),
			'test1': new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 1
				})
			}),
			'polygon': new ol.style.Style({
//				stroke: new ol.style.Stroke({
//					color: 'blue',
////					lineDash: [4],
//					width: 0
//				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 255, 0.2)'
				})
			})
	};

	triglib = new triglib();
	var endcoord = triglib.bearingPoints(51, 0, 90, 2000);
	var endcoord1 = triglib.bearingPoints(51, 0, 92, 2000);
	var endcoord2 = triglib.bearingPoints(51, 0, 88, 2000);
	
	var start = { x: 0, y: 51 };
//	var end = { x: 20, y: 60 };
	var end = { x: endcoord[0], y: endcoord[1] };
	var end1 = { x: endcoord1[0], y: endcoord1[1] };
	var end2 = { x: endcoord2[0], y: endcoord2[1] };
	var generator = new arc.GreatCircle(start, end, {'name': 'Seattle to DC'});
	var generator1 = new arc.GreatCircle(start, end1, {'name': 'Seattle to DC'});
	var generator2 = new arc.GreatCircle(start, end2, {'name': 'Seattle to DC'});
	var line = generator.Arc(10,{offset:10});
	var line1 = generator1.Arc(100,{offset:10});
	var line2 = generator2.Arc(100,{offset:10});

	var arcSource = new ol.source.Vector();

	var styleFunction = function(feature) {
		return styles[feature.getProperties().type];
	};

	var polygonJson = {
			'type': 'Feature',
			'geometry': {
				'type': 'Polygon',
//				'coordinates': [[[10, 10], [10, 20], [20, 10]]]
				'coordinates': [(line1.json().geometry.coordinates).concat((line2.json().geometry.coordinates).reverse())]
			}
	};


//	var lineFeature = (new ol.format.GeoJSON()).readFeature(line.json(), {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"});
	var lineFeature = new ol.Feature((new ol.format.GeoJSON()).readGeometry(line.json().geometry, {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"}));
	var line1Feature = (new ol.format.GeoJSON()).readFeature(line1.json(), {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"});
	var line2Feature = (new ol.format.GeoJSON()).readFeature(line2.json(), {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"});
	var polygonFeature2 = (new ol.format.GeoJSON()).readFeature(polygonJson, {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"});


	lineFeature.setProperties({type:'test'});
	line1Feature.setProperties({type:'test1'});
	line2Feature.setProperties({type:'test1'});
	polygonFeature2.setProperties({type:'polygon'});

//	arcSource.addFeature(line1Feature);
//	arcSource.addFeature(line2Feature);
	arcSource.addFeature(polygonFeature2);
	arcSource.addFeature(lineFeature);

//	setTimeout(function(){
//		lineFeature.setGeometry((new ol.format.GeoJSON()).readGeometry(line3.json().geometry, {dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"}));
//		lineFeature.changed();
//	},3000);

	var arcLayer = new ol.layer.Vector({
		source: arcSource,
		style: styleFunction
	});


	var map = new ol.Map({
		layers : [new ol.layer.Tile({source : new ol.source.OSM()}), arcLayer],
		controls: ol.control.defaults({attribution: false, zoom: false, rotate: false}),
		target: componentElement.attr('id'),
		view: new ol.View({
			center: ol.proj.transform([20, 60], "EPSG:4326", "EPSG:3857"),
			zoom: 4
		})
	});

	map.updateSize();

	$(window).on('resize', function()
			{
		componentElement.width($(window).width());
		componentElement.height($(window).height());
		map.updateSize();
//		setTimeout( function() { map.updateSize();}, 100);
			});

	this.someFunction = function(arg) {
		alert('hej from function');
		console.log(arg);
	}


	this.onStateChange = function() {
		console.log('state changed');
//		console.log(this.getState());
	};

}