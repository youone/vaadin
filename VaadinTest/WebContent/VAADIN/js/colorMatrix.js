com_example_vaadintest_ColorMatrix = function() {

	
	this.onStateChange = function() {
		console.log('checking image data');
		document.getElementById('image').src = 'data:image/png;base64,' + this.getState().imageData;
	}
	
	function heatMapColorforValue(value){
		  var h = value * 360;
		  return "hsl(" + h + ", 100%, 50%)";
		}

	var ndataX = 10;
	var ndataY = 5*195;
	var patchData = [];
	for (var idataX = 0; idataX < ndataX; idataX++) {
		for (var idataY = 0; idataY < ndataY; idataY++) {
//			var patchCoord = {'x': idataX , 'y': idataY + 1, 'v': idataY/ndataY}; 
			var patchCoord = {'x': idataX , 'y': idataY + 1, 'v': Math.random()}; 
			patchData.push(patchCoord);
		}
	}
	
	$.widget("custom.colorMatrix", {

		_create: function() {

			var WIDTH = 600/3;
			var HEIGHT = 500;
			var MARGINS = {top : 20, right : 20, bottom : 20, left : 30};

			this.element.addClass("colorMatrix");

			var colorChart = d3.select(this.element[0]).append("svg")
			.attr("width", WIDTH)
			.attr("height", HEIGHT)
		
			var deltaX = (d3.max(patchData, function(d) {return d.x;}) - d3.min(patchData, function(d) {return d.x;}))/(ndataX-1);
			var deltaY = (d3.max(patchData, function(d) {return d.y;}) - d3.min(patchData, function(d) {return d.y;}))/(ndataY-1);

			var colorXScale = d3.scale.linear()
				.range([MARGINS.left,
				         WIDTH - MARGINS.right])
				.domain([d3.min(patchData, function(d) {return d.x;}),
				         1 + d3.max(patchData, function(d) {return d.x;})]);
	
			var colorYScale = d3.scale.linear()
				.range([HEIGHT - MARGINS.top,
				       MARGINS.bottom ])
				.domain([-1 + d3.min(patchData, function(d) {return d.y;}),
				         1 + d3.max(patchData, function(d) {return d.y;})]);
	
			var colorXAxis = d3.svg.axis()
				.scale(colorXScale)
				//.tickSize(-HEIGHT + MARGINS.top)
				.tickSize(5)
				.tickSubdivide(true);
	
			var colorYAxis = d3.svg.axis()
				.scale(colorYScale)
				//.tickSize(-WIDTH + MARGINS.right)
				.tickSize(5)
				.orient("left")
				.tickSubdivide(true);
	
			colorChart.append("g")
				.attr("class", "x axis")
				.attr("transform","translate(0," + (HEIGHT - MARGINS.bottom) + ")")
				.call(colorXAxis)
	
			colorChart.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + (MARGINS.left) + ",0)")
				.call(colorYAxis)
	
			colorChart.selectAll("rect").data(patchData).enter().append("rect")
				.attr('x', function(d) {return colorXScale(d.x);})
				.attr('y', function(d) {return colorYScale(d.y);})
				.attr('width', function(d) {return colorXScale(deltaX)-colorXScale(0);})
				.attr('height', function(d) {return colorYScale(0)-colorYScale(deltaY);})
				.attr('fill', function(d) {return heatMapColorforValue(d.v);})
//				.attr("clip-path", "url(#clip)")
//				.attr('class','datarect')

//			colorChart.selectAll("selrect").data([0,1]).enter().append("selrect")
//				.attr('x', 0)
//				.attr('y', 10)
//				.attr('width', 100)
//				.attr('height', 100)
//				.attr('fill', 'black')
////				.attr("clip-path", "url(#clip)")
//				.attr('class','selectionrect')

			var viewport = d3.svg.brush()
			    .y(colorYScale)
			    .on("brush", function () {
	//		        yScale.domain(viewport.empty() ? colorYScale.domain() : viewport.extent());
	//		        console.log(viewport.extent());
	//		        redrawChart();
			    });	
			
			colorChart.append("g")
			    .attr("class", "viewport")
			    .call(viewport)
			    .selectAll("rect")
			    .attr("width", WIDTH);
	
			//	function redrawChart() {
	//		    dataSeries.call(series);
	//		    plotChart.select('.x.axis').call(xAxis);
	//		}
	
				
	//		var selectChart = d3.select(colorMatrixDiv[0]).append("svg")
	//			.attr("width", WIDTH)
	//			.attr("height", HEIGHT)
		//
	//		var selectYScale = d3.scale.linear()
	//			.range([HEIGHT - MARGINS.top,
	//			       MARGINS.bottom ])
	//			.domain([-1 + d3.min(patchData, function(d) {return d.y;}),
	//			         1 + d3.max(patchData, function(d) {return d.y;})]);
		//
	//		var selectYAxis = d3.svg.axis()
	//			.scale(selectYScale)
	//			//.tickSize(-WIDTH + MARGINS.right)
	//			.tickSize(5)
	//			.orient("left")
	//			.tickSubdivide(true);
		//
	//		selectChart.append("g")
	//			.attr("class", "y axis")
	//			.attr("transform", "translate(" + (MARGINS.left) + ",0)")
	//			.call(selectYAxis)

		}
	});
	

	var componentElement = $(this.getElement());
	var colorMatrixDiv1 = $("<div>").css('float', 'left').appendTo(componentElement);
	var colorMatrixDiv2 = $("<div>").css('float', 'left').appendTo(componentElement);
	var colorMatrixDiv3 = $("<div>").css('float', 'left').appendTo(componentElement);

	var image = $('<img id="image" width="75" height="375" />').appendTo(componentElement);

	colorMatrixDiv1.colorMatrix();
	colorMatrixDiv2.colorMatrix();
	colorMatrixDiv3.colorMatrix();

		
}