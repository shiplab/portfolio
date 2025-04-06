// adapted from https://bl.ocks.org/mbostock/3887118
LineChartClass = function ( id, data, yvalue, ylabel ) {

	// Function to create a chart line with d3.js
	// id: set id in the svg (string)
	// data: data object containing the {time: xvalue used (float), yvalue: value defined for yvalue key (value)}
	// yvalue: key to define yvalue key (string)
	// ylabel: yAxis title (string)
	d3.select( "#" + id ).remove();
	var fontSize = "20";

	var margin = { top: 10, right: 20, bottom: 30, left: 100 },
		width = 430 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range( [ 0, width ] );

	var y = d3.scale.linear()
		.range( [ height, 0 ] );

	var xAxis = d3.svg.axis()
		.scale( x )
		.orient( "bottom" );

	var yAxis = d3.svg.axis()
		.scale( y )
		.orient( "left" );

	var canvas = d3.select( "#lineChart" ).append( "canvas" )
		.attr( "id", id )
		.attr( "width", width + margin.left + margin.right )
		.attr( "height", height + margin.top + margin.bottom )
		.append( "g" )
		.attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

	var context = canvas.node().getContext( '2d' );


	x.domain( d3.extent( data, function ( d ) {

		return d.time;

	} ) ).nice();
	y.domain( [ 0, d3.max( data, function ( d ) {

		return d[ yvalue ];

	} ) ] ).nice();

	canvas.append( "g" )
		.attr( "class", "x axis" )
		.attr( "transform", "translate(0," + height + ")" )
		.call( xAxis )
		.attr( "font-size", fontSize )
		.append( "text" )
		.attr( "class", "label" )
		.attr( "x", width )
		.attr( "y", - 6 )
		.style( "text-anchor", "end" )
		.text( "Time (s)" );

	canvas.append( "g" )
		.attr( "class", "y axis" )
		.call( yAxis )
		.attr( "font-size", fontSize )
		.append( "text" )
		.attr( "class", "label" )
		.attr( "transform", "rotate(-90)" )
		.attr( "y", 6 )
		.attr( "dy", ".71em" )
		.style( "text-anchor", "end" )
		.text( ylabel );

	canvas.selectAll( ".dot" )
		.data( data )
		.enter().append( "circle" )
		.attr( "class", "dot" )
		.attr( "r", 1.5 )
		.attr( "cx", function ( d ) {

			return x( d.time );

		} )
		.attr( "cy", function ( d ) {

			return y( d[ yvalue ] );

		} );

	canvas.selectAll( ".dot" )
		.style( "fill", "steelblue" );

};
