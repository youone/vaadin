com_example_vaadintest_ColorMatrix = function() {

	
//	$.widget("custom.colorMatrix", {
//
//		_create: function() {
//			
//			this.element.addClass("scatter").attr("id","map").css("position","relative");
//
//		}
//	});
	

	function heatMapColorforValue(value){
		  var h = (1.0 - value) * 240
		  return "hsl(" + h + ", 100%, 50%)";
		}

	var componentElement = $(this.getElement());
	var colorMatrixDiv = $("<div>").appendTo(componentElement);

	var lineData = [
	                {'x':10,  'y':10,  'v':0.1},
	                {'x':20, 'y':20, 'v':0.2},
	                {'x':30, 'y':30, 'v':0.3},
	                {'x':40, 'y':40, 'v':0.4},
	                {'x':50, 'y':50,  'v':0.5},
	                {'x':60, 'y':60,  'v':0.6},
	                {'x':70, 'y':70,  'v':0.7},
	                {'x':80, 'y':80,  'v':0.8},
	                {'x':90, 'y':90,  'v':0.9},
	                {'x':100,'y':100, 'v':1.0}
	                ];

	var vis = d3.select(colorMatrixDiv[0]).append("svg")
		.attr("width", 600)
		.attr("height", 300)

	var WIDTH = 600;
	var HEIGHT = 300;
	var MARGINS = {top : 20, right : 20, bottom : 20, left : 50};

	var xScale = d3.scale.linear()
		.range([MARGINS.left,
		         WIDTH - MARGINS.right])
		.domain([d3.min(lineData, function(d) {return d.x;}),
		         d3.max(lineData, function(d) {return d.x;})]);

	var yScale = d3.scale.linear()
		.range([HEIGHT - MARGINS.top,
		       MARGINS.bottom ])
		.domain([d3.min(lineData, function(d) {return d.y;}),
		         d3.max(lineData, function(d) {return d.y;})]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		//.tickSize(-HEIGHT + MARGINS.top)
		.tickSize(5)
		.tickSubdivide(true);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		//.tickSize(-WIDTH + MARGINS.right)
		.tickSize(5)
		.orient("left")
		.tickSubdivide(true);

	vis.append("g")
		.attr("class", "x axis")
		.attr("transform","translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		.call(xAxis)

	vis.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (MARGINS.left) + ",0)")
		.call(yAxis)

	vis.selectAll("rect").data(lineData).enter().append("rect")
		.attr('x', function(d) {return xScale(d.x);})
		.attr('y', function(d) {return yScale(d.y);})
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', function(d) {return heatMapColorforValue(d.v);})
//		.attr('style', 'fill:grey;stroke-width:1;stroke:rgb(0,0,0)')
		.attr("clip-path", "url(#clip)")
		.attr('class','datarect')
		
		
}