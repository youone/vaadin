com_example_vaadintest_JsComponent = function() {

	//var theMap = null;
	var coordinates = null;
	
	this.aJsFunction = function(arg) {
		console.log(arg);
	};


	$.widget( "custom.scatter", {

		property: 'haj',
		theMap: null,
		scatterOverlay: null,
		
		_create: function() {

			this.element.addClass("scatter").attr("id","map").css("position","relative");

			var theCanvas = null;

			var canvasFunction = function(extent, resolution, pixelRatio, size, projection) {
//				console.log(extent);
				console.log("canvas function");

				var context = theCanvas[0].getContext('2d');
				context.clearRect(0, 0, theCanvas[0].width, theCanvas[0].height);
				
				for(ic in coordinates) {
					if (coordinates[ic].lon > extent[0] & 
						coordinates[ic].lon < extent[2] &
						coordinates[ic].lat > extent[1] & 
						coordinates[ic].lat < extent[3]) {
						canvasX = size[0] * (coordinates[ic].lon - extent[0])/(extent[2] - extent[0]);
						canvasY = size[1] * (extent[3] - coordinates[ic].lat)/(extent[3] - extent[1]);
						context.globalAlpha = 0.5;
						context.beginPath();
						context.arc(canvasX, canvasY, 5, 0, 2 * Math.PI, false);
						context.fillStyle = 'blue';
						context.fill();
					}
				}
				return theCanvas[0];
			}

			var mapLayer = new ol.layer.Tile({
				source : new ol.source.OSM()
			});

			var canvasLayer = new ol.layer.Image({
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
				layers : [mapLayer, canvasLayer],
				controls: ol.control.defaults({attribution: false, zoom: false, rotate: false}),
				target: 'map',
				view: new ol.View({
					center: [0, 0],
					zoom: 2
				})
			});

			theCanvas = $('<canvas id="scatterCanvas" width="' + this.theMap.getSize()[0] + '" height="' +  this.theMap.getSize()[1] + '">');

			setTimeout(function(){
				var context = theCanvas[0].getContext('2d');
				context.clearRect(0, 0, theCanvas[0].width, theCanvas[0].height);
				canvasLayer.getSource().changed();
				console.log("source changed");
			}, 2000);
			
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

			//			this.scatterOverlay.css("position","absolute", "top", 0);
		
		},
		
		method: function() {
			console.log(this.theMap.getSize());
		},
		
	});

	var e = $(this.getElement());
	var div = $("<div>");
	e.append(div);
	div.scatter();
	

	var minX = 602935.2791134701;
	var maxX = 2437423.9579577004;
	var minY = 6346719.332574755;
	var maxY = 7274970.604069935;
	coordinates = [];
	for (var iData=0; iData<100; iData++) {
		var longi = minX + Math.random()*(maxX-minX);
		var lati = minY + Math.random()*(maxY-minY);
		coordinates.push({lon: longi, lat: lati});
	}


	div.scatter('method');
	
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