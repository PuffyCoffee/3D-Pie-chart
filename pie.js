/**
 * 3D Pie chart
 * @author Peng Zhang 2012
 */
var values = [87, 56, 77, 120, 34];
var colors = ["#51ff00", "#ff0011", "#faf600", "#0079fa", "#fa8500"];
var sum = 0;
for (var i = 0; i < values.length; i += 1) 
	sum += values[i];
var paper = Raphael("canvas", 400, 400);
var r1 = 100, r2 = 75, cx = 200, cy = 200;
var dsize = 17;
var nos = values.length;
if (nos == 1) {
	var e = paper.ellipse(cx, cy, r1, r2).attr({
		fill: "#51ff00",
		stroke: "#999",
		opacity: .8
	});
	var e_ = paper.ellipse(cx, cy+17, r1, r2).attr({
		fill: "#51ff00",
		stroke: "#999"
	}).toBack();
} else {	
	var x = cx + r1, y = cy, preAngle = 0;
	var all_set = [];
	var topSet = paper.set();
	var angles = [], tset = [];
	for (var i = 0; i < nos; i += 1) {		
		var slice = paper.set();			
		var startX = x, startY = y;
		var ratio = values[i]/sum;		
		var angle = 2*ratio*Math.PI, largeArc = 0;
		angles.push(angle);
		if (angle > Math.PI)	largeArc = 1;
		x = cx + r1*Math.cos(angle+preAngle);
		y = cy + r2*Math.sin(angle+preAngle);		
		var centerX = (startX+x)/2, centerY = (startY+y)/2;
		var centerLine = paper.path("M"+cx+","+cy+"L"+centerX+","+centerY).attr({
			stroke: "none"
		});
		var coord = centerLine.getPointAtLength(30);		
		tset.push(coord);
		var side3 = paper.path("M"+startX+","+startY),
			side2 = paper.path("M"+cx+","+cy),
			side1 = paper.path("M"+cx+","+cy),
			topside = paper.path("M"+x+","+y);		
		var side3 = paper.path("M"+startX+","+startY+
			"A"+r1+","+r2+",0,"+largeArc+",1,"+x+","+y+
			"L"+x+","+(y+dsize)+
			"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+(startY+dsize)+"z").toBack();
		var side2 = paper.path("M"+cx+","+cy+
				   "L"+cx+","+(cy+dsize)+
				   "L"+x+","+(y+dsize)+
				   "L"+x+","+y).toBack();
		var side1 = paper.path("M"+cx+","+cy+
				   "L"+cx+","+(cy+dsize)+
				   "L"+startX+","+(startY+dsize)+
				   "L"+startX+","+startY).toBack();
		var topside = paper.path("M"+x+","+y+
			"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+startY+
			"L"+cx+","+cy+"z");
		slice.push(topside, side1, side2, side3);
		topSet.push(topside);
		slice.attr({
			fill: colors[i],
			stroke: "#555",
			opacity: .8
		});
		all_set.push(slice);
		preAngle += angle;		
	}
	var mlist = [];
	for (var i = 0; i < values.length; i += 1) {
		mlist[i] = false;
	}
	topSet.forEach(function(shape, i) {
		shape.hover(function() {
			shape.node.style.cursor = "pointer";
			all_set[i].animate({
				transform: "t"+(tset[i].x-cx)+","+(tset[i].y-cy)
			}, 300);
			if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
				setTimeout(function() {
					all_set[i].animate({
						transform: "t0,0"
					});	
				}, 2000);
			}
		}, function() {
			all_set[i].animate({
				transform: "t0,0"
			}, 300);
		});		
	});		
	
	// var txtooltip = cx + r1*Math.cos(angle);
	// var tytooltip = cy + r2*Math.sin(angle);
}