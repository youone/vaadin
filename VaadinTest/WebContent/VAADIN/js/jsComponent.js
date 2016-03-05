com_example_vaadintest_JsComponent = function() {

	function latlong2xy(latlong) {
		return ol.proj.transform(latlong, "EPSG:4326", "EPSG:3857");
		//return ol.proj.transform(latlong, "EPSG:4326", "EPSG:900913");
	}
		
	//var theMap = null;
	var coordinates = null;
	var offset = 0;

	var state = 'init';

	this.aJsFunction = function(arg) {
		console.log(arg);
	};


	$.widget( "custom.scatter", {

		property: 'haj',
		theMap: null,
		scatterOverlay: null,
		canvasLayer: null,
		
		_create: function() {

			var thisWidget = this;
			
			this.element.addClass("scatter").attr("id","map").css("position","relative");

			var theCanvas = null;

			var canvasFunction = function(extent, resolution, pixelRatio, size, projection) {
//				console.log(extent);
				console.log('canvas function');

				var context = theCanvas[0].getContext('2d');
				context.clearRect(0, 0, theCanvas[0].width, theCanvas[0].height);

				var fillStyle = '';
				if (state == 'init') {
					fillStyle = 'blue';
					state = 'state1';
					console.log('filling blue')
				}
				else {
					fillStyle = 'black';
				}

				for(ic in coordinates) {
					
					
					if (coordinates[ic][0] > extent[0] & 
						coordinates[ic][0] < extent[2] &
						coordinates[ic][1] > extent[1] & 
						coordinates[ic][1] < extent[3]) {
						canvasX = size[0] * (coordinates[ic][0] - extent[0])/(extent[2] - extent[0]);
						canvasY = size[1] * (extent[3] - coordinates[ic][1])/(extent[3] - extent[1]);
						context.globalAlpha = 0.5;
						context.beginPath();
						context.arc(canvasX, canvasY, 5, 0, 2 * Math.PI, false);
						context.fillStyle = fillStyle;
						context.fill();
						}
				}
				return theCanvas[0];
			}

			var vectorSource = new ol.source.Vector();
			var vectorLayer = new ol.layer.Vector({
				source : vectorSource
			});
			var initcoord = latlong2xy([17.976554, 59.339169]);
			circle = new ol.geom.Circle(initcoord, 1e5);
//		    vectorSource.addFeature(new ol.Feature(circle));

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
			var mapInteractions = [];
			mapInteractions.push(mwz);
			mapInteractions.push(dp);
			
			this.theMap = new ol.Map({
				interactions : mapInteractions,
				layers : [mapLayer, this.canvasLayer, vectorLayer],
				controls: ol.control.defaults({attribution: false, zoom: false, rotate: false}),
				target: 'map',
				view: new ol.View({
					center: [0, 0],
					zoom: 2
				})
			});

			theCanvas = $('<canvas id="scatterCanvas" width="' + this.theMap.getSize()[0] + '" height="' +  this.theMap.getSize()[1] + '">');

//			setTimeout(function(){
//				var context = theCanvas[0].getContext('2d');
//				context.clearRect(0, 0, theCanvas[0].width, theCanvas[0].height);
//				thisWidget.canvasLayer.getSource().changed();
//				console.log("source changed");
//			}, 5000);
			
			this.theMap.on("moveend", function() {
				  console.log('Dragging...');
			});
			
			var mapSize = this.theMap.getSize();
			this.scatterOverlay = $('<canvas id="scatterOverlay" width="' + mapSize[0] + '" height="' +  mapSize[1] + '" style="position:absolute; top:0; pointer-events:none;">');
			this.element.append(this.scatterOverlay);
			var ctx = this.scatterOverlay[0].getContext('2d');
			ctx.globalAlpha = 0.5;
			ctx.beginPath();
			ctx.arc(100, 100, 10, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'red';
			ctx.fill();

		},
		
		updateCanvas: function() {
			this.canvasLayer.getSource().changed();
		},
		
	});

	var e = $(this.getElement());
	var div = $("<div>");
	e.append(div);
	div.scatter();
	

//	var minX = 602935.2791134701;
//	var maxX = 2437423.9579577004;
//	var minY = 6346719.332574755;
//	var maxY = 7274970.604069935;
//	coordinates = [];
//	for (var iData=0; iData<100; iData++) {
//		var longi = minX + Math.random()*(maxX-minX);
//		var lati = minY + Math.random()*(maxY-minY);
//		coordinates.push({lon: longi, lat: lati});
//	}
	EARTH_RADIUS = 6371000;
	coordinates = [];
	coordinates.push(latlong2xy([17.976554, 59.339169]));
	coordinates.push(latlong2xy([18, 60]));
	
	var slider = $("<div>").slider({
		slide: function() {
			offset = offset + 1;
			div.scatter('updateCanvas');
		}
	});
	e.append(slider);
	
	var self = this;
	div.click(function(){
		self.onClick("{key: 'value'}");
	});

	this.onStateChange = function() {
//		div.scatter();
		//	  div.html(this.getState().theText);
//		console.log(this.getState().theText);
//		console.log(this.getState().SomeProperty);
	}

}