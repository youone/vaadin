com_example_vaadintest_jscomponents_JsComponent = function() {

	var thisVaadinComponent = this;
	
	this.extent = null;
	this.mapData = null;
	
	function latlong2xy(latlong) {
		return ol.proj.transform(latlong, "EPSG:4326", "EPSG:3857");
		//return ol.proj.transform(latlong, "EPSG:4326", "EPSG:900913");
	};
	
//	function generateScatterPoints(nPoints) {
//		var scatterPoints = [];
//		var offset = 10 * Math.random();
//		for(var iPoint=0; iPoint<nPoints; iPoint++){
//			var scatterPoint = {};
//			var lon = 3 * Math.random() + 10 + offset;
//			var lat = 5 * Math.random() + 50 + offset;
//			var size = Math.random();
//			
//			scatterPoint.coordinates = [lon, lat];
//			scatterPoint.size = size;
//			scatterPoints.push(scatterPoint);
//		}
//		return scatterPoints;
//	}
//	
//	function generateScatterData(nPoints) {
//		
//		var scatterData = [];
//
//		scatterData.push({
//			points: generateScatterPoints(nPoints),
//			fillStyle: 'blue'
//		});
//		scatterData.push({
//			points: generateScatterPoints(nPoints),
//			fillStyle: 'red'
//		});
//		scatterData.push({
//			points: generateScatterPoints(nPoints),
//			fillStyle: 'black'
//		});
//
//		return scatterData;
//	};
	
	$.widget("custom.scatterMap", {

		theMap: null,
		scatterCanvas: null,
		canvasLayer: null,
		scatterData: null,
		state: "init",

		_create: function() {
			var thisWidget = this;

			this.element.addClass("scatter").attr("id","map");//.css("position","relative");

			//should be called when the canvas needs to be redrawn
			var canvasFunction = function(extent, resolution, pixelRatio, canvasSize, projection) {

				var context = thisWidget.scatterCanvas[0].getContext('2d');
				
				context.clearRect(0, 0, thisWidget.scatterCanvas[0].width, thisWidget.scatterCanvas[0].height);

				for (iData in thisWidget.scatterData) {

					var points = thisWidget.scatterData[iData].points;
					var fillStyle = thisWidget.scatterData[iData].fillStyle;

					for(ip in points) {

//						var geoxy = ol.proj.transform(points[ip].coordinates, "EPSG:4326", "EPSG:3857");
						var geoxy = ol.proj.transform(points[ip].slice(0,2), "EPSG:4326", "EPSG:3857");
						var geox = geoxy[0];
						var geoy = geoxy[1];
//						var markerSize = points[ip].size;
						var markerSize = points[ip][2]/10000;
						
						if (geox > extent[0] & geox < extent[2] &
							geoy > extent[1] & geoy < extent[3]) {
							
							//transform from geo to canvas coordinates
							canvasX = canvasSize[0] * (geox - extent[0])/(extent[2] - extent[0]);
							canvasY = canvasSize[1] * (extent[3] - geoy)/(extent[3] - extent[1]);
							
							context.globalAlpha = 0.5;
							context.beginPath();
							context.arc(canvasX, canvasY, 5 * markerSize, 0, 2 * Math.PI, false);
							context.fillStyle = fillStyle;
							context.fill();
						}
					}
				}
				return thisWidget.scatterCanvas[0];
			};

			var vectorSource = new ol.source.Vector();
			var vectorLayer = new ol.layer.Vector({
				source : vectorSource
			});
//			var initcoord = latlong2xy([17.976554, 59.339169]);
//			circle = new ol.geom.Circle(initcoord, 1e5);
//			vectorSource.addFeature(new ol.Feature(circle));

			var mapLayer = new ol.layer.Tile({
				source : new ol.source.OSM()
			});

			this.canvasLayer = new ol.layer.Image({
				source: new ol.source.ImageCanvas({
					ratio: 1,
					canvasFunction: canvasFunction,
//					projection: 'EPSG:3857'
				})
			});

			var mwz = new ol.interaction.MouseWheelZoom();
			var dp = new ol.interaction.DragPan({"kinetic": undefined});
			var dp = new ol.interaction.DragPan();
			var mapInteractions = [];
			mapInteractions.push(mwz);
			mapInteractions.push(dp);

			this.theMap = new ol.Map({
				interactions : mapInteractions,
				layers : [mapLayer, this.canvasLayer, vectorLayer],
				controls: ol.control.defaults({attribution: false, zoom: false, rotate: false}),
				target: 'map',
				view: new ol.View({
					center: [1000000, 7000000],
					zoom: 3
				})
			});

			this.scatterCanvas = $('<canvas id="scatterCanvas" width="' + this.theMap.getSize()[0] + '" height="' +  this.theMap.getSize()[1] + '">');

//			this.theMap.on("moveend", function() {
//			console.log('Dragging...');
//			});

			var mapSize = this.theMap.getSize();
		},

		updateCanvas: function() {
			this.canvasLayer.getSource().changed();
		},

		setData: function(data) {
//			console.log(data);
			this.scatterData = data;
			this.canvasLayer.getSource().changed();
		}

	});

	var componentElement = $(this.getElement());
	var scatterMapDiv = $("<div>").css({'width':'600','height':'450'}).appendTo(componentElement).scatterMap();

//	scatterData = [];
//	for (var iData=0; iData<100; iData++) {
//		scatterData.push(generateScatterData(1000));
//	}
//	scatterMapDiv.scatterMap('setData', scatterData[0]);

//	var slider = $("<div>").slider({
//		min: 0,
//		max: 99,
//		step: 1,
//		slide: function(event, ui) {
//			scatterMapDiv.scatterMap('setData', scatterData[ui.value]);
//		}
//	});
//	componentElement.append(slider);

//	var self = this;
//	scatterMapDiv.click(function(){
//		self.onClick("{key: 'value'}");
//	});
	
	this.setRange = function(range){
		data12 = thisVaadinComponent.mapData['title1-title2'].slice(Math.floor(range[0]), Math.floor(range[1]));
		data13 = thisVaadinComponent.mapData['title1-title3'].slice(Math.floor(range[0]), Math.floor(range[1]));
		data23 = thisVaadinComponent.mapData['title2-title3'].slice(Math.floor(range[0]), Math.floor(range[1]));
		
		points12 = [];
		points13 = [];
		points23 = [];
		for (id in data12) {
			for (id2 in data12[id]) {
				if (data12[id][id2][2] > 9000) {
					points12.push(data12[id][id2]);
					points13.push(data13[id][id2]);
					points23.push(data23[id][id2]);
				}
			}
		}
		
		var scatterData = [];

		scatterData.push({
			points: points12,
			fillStyle: 'blue'
		});
		scatterData.push({
			points: points13,
			fillStyle: 'red'
		});
		scatterData.push({
			points: points23,
			fillStyle: 'black'
		});

		scatterMapDiv.scatterMap('setData', scatterData);
	};

	this.setMapData = function(mapData){
		console.log('setting mapData');
		thisVaadinComponent.mapData = mapData;
		console.log(mapData);
	};


	this.onStateChange = function() {
		console.log('state changed');
//		console.log(this.getState().scatterData);
	};

	com_example_vaadintest_jscomponents_JsComponent_instance = this;

}