com_example_vaadintest_ColorMatrix = function() {

	var thisVaadinComponent = this;
	
	$.widget("custom.colorImageMatrix", {
		
		options: {
			title: 'the title',
			imageWidth: 0,
			imageHeight: 0,
			xRange: [],
			yRange: [],
			yAxisVisible: true,
			updateCallback: null,
		},
		
		imageChart: null,
		viewPort: null,
		
		_create: function() {
			var thisWidget = this;

			this.element.append("<div id='matrixtitle'>" + this.options.title + '</div>');
			
			this.imageChart = d3.select(this.element[0]).append("svg")
				.attr("width", 150)
				.attr("height", 420);
	
			// x-axis
			var imageXScale = d3.scale.linear()
				.range([0,75])
				.domain([0,10]);
			var imageXAxis = d3.svg.axis()
				.scale(imageXScale)
				.tickSize(5)
				.orient('bottom')
				.tickSubdivide(true);
			this.imageChart.append("g")
				.attr("class", "x axis")
				.attr("transform","translate(45," + 380 + ")")
				.call(imageXAxis)

			// y-axis
			var imageYScale = d3.scale.linear()
				.range([375,0])
				.domain([0,5*195]);
			var imageYAxis = d3.svg.axis()
				.scale(imageYScale)
				.tickSize(5)
				.orient('left')
				.tickSubdivide(true);
			var yAxisGroup = this.imageChart.append("g")
				.attr("class", "y axis " + this.options.title)
				.attr("transform","translate(40," + 0 + ")");
			if (!this.options.yAxisVisible) yAxisGroup.attr('style', 'visibility:hidden');				
			yAxisGroup.call(imageYAxis)
				
//			this.imageChart.selectAll("image").data(['data:image/png;base64,' + thisVaadinComponent.getState().imageData]).enter().append("svg:image")
			this.imageChart.selectAll("image").data([0]).enter().append("svg:image")
				.attr('id', 'image')
				.attr('width', 75)
				.attr('height', 375)
				.attr('x',45)
				.attr('y',0)
				.attr("xlink:href",function(d){return d;});
			
			this.viewport = d3.svg.brush()
			    .y(imageYScale)
			    .on("brush", function () {
			        thisWidget.element.trigger('myEvent',{title: thisWidget.options.title, extent: thisWidget.viewport.extent()});
			    });	
		
			this.imageChart.append("g")
			    .attr("class", "viewport")
			    .call(this.viewport)
			    .selectAll("rect")
				.attr('x',40)
			    .attr("width", 85);
		},
	
		setViewportExtent: function(ext) {
			this.viewport.extent(ext);
			this.imageChart.select('.viewport').call(this.viewport);
		},

		updateImage: function() {
			this.imageChart.selectAll("image").data(['data:image/png;base64,' + this.options.updateCallback(this.options.title)])
			.attr("xlink:href",function(d){return d;});
		}
	});

	var componentElement = $(this.getElement());
	var colorImageMatrix1 = $("<div id='cmi1'>").css('float', 'left').appendTo(componentElement);
	var colorImageMatrix2 = $("<div id='cmi2'>").css('float', 'left').appendTo(componentElement);
	var colorImageMatrix3 = $("<div id='cmi3'>").css('float', 'left').appendTo(componentElement);

	componentElement.on('myEvent',function(event, data){
		colorImageMatrix1.colorImageMatrix('setViewportExtent', data.extent);
		colorImageMatrix2.colorImageMatrix('setViewportExtent', data.extent);
		colorImageMatrix3.colorImageMatrix('setViewportExtent', data.extent);
		com_example_vaadintest_JsComponent_instance.setRange(data.extent, thisVaadinComponent.getState().allData.mapData);
	});
	
	var getNewImageData = function(title) {
		return thisVaadinComponent.getState().allData.matrixPngData[title];
	};
	
	colorImageMatrix1.colorImageMatrix({
		title: 'title1',
		yAxisVisible: true,
		updateCallback: getNewImageData
			});
	
	colorImageMatrix2.colorImageMatrix({
		title: 'title2',
		yAxisVisible: true,
		updateCallback: getNewImageData
			});

	colorImageMatrix3.colorImageMatrix({
		title: 'title3',
		yAxisVisible: true,
		updateCallback: getNewImageData
			});

	this.onStateChange = function() {

		if (typeof com_example_vaadintest_JsComponent_instance != 'undefined') {

			com_example_vaadintest_JsComponent_instance.setMapData(thisVaadinComponent.getState().allData.mapData)

			colorImageMatrix1.colorImageMatrix('updateImage');
			colorImageMatrix2.colorImageMatrix('updateImage');
			colorImageMatrix3.colorImageMatrix('updateImage');
		}
	}

//	function heatMapColorforValue(value){
//	  var h = value * 360;
//	  return "hsl(" + h + ", 100%, 50%)";
//	}
//
//var ndataX = 10;
//var ndataY = 5*195;
//var patchData = [];
//for (var idataX = 0; idataX < ndataX; idataX++) {
//	for (var idataY = 0; idataY < ndataY; idataY++) {
////		var patchCoord = {'x': idataX , 'y': idataY + 1, 'v': idataY/ndataY}; 
//		var patchCoord = {'x': idataX , 'y': idataY + 1, 'v': Math.random()}; 
//		patchData.push(patchCoord);
//	}
//}

//	var colorMatrixDiv1 = $("<div>").css('float', 'left').appendTo(componentElement);
//	var colorMatrixDiv2 = $("<div>").css('float', 'left').appendTo(componentElement);
//	var colorMatrixDiv3 = $("<div>").css('float', 'left').appendTo(componentElement);
//	colorMatrixDiv1.colorMatrix();
//	colorMatrixDiv2.colorMatrix();
//	colorMatrixDiv3.colorMatrix();

	com_example_vaadintest_ColorMatrix_instance = this;

}