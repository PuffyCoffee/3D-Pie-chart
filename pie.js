/**
 * 3D Pie chart
 * @author Peng Zhang 2012
 */
Raphael.fn.pie = function(args) {
	var values = args.values;	
	var colors = ["#51ff00", "#ff0011", "#faf600", "#0079fa", "#fa8500"];
	var tooltips = ["January - 87", "Feburary - 136", "March - 77", "April - 120",
					"May - 34"];
	var percentages = [];
	var sum = 0;
	for (var i = 0; i < values.length; i += 1)  {
		sum += values[i];		
	}
	for (var j = 0; j < values.length; j += 1) {
		percentages.push(((values[j]/sum)*100).toFixed(2)+"%");
	}
	var paper = this;	
	var r1 = 180, r2 = 150, 
		cx = paper.width/2, cy = paper.height/2,
		titleX = cx, titleY = paper.height/13;
	var title = paper.text(titleX, titleY, "First season GDP").attr({
		'font-size' : 20
	});
	var dsize = 20;
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
		var angles = [], tset = [], ttset = [];
		var tt = paper.text(50, 20, "init tooltip").attr({'font-size': 14}),		
			tbox = paper.rect(0, 0, 10, 10, 5).attr({'stroke-width': 2});
		function moveBox(tt) {
			tbox.attr({
				x : tt.getBBox().x - 10,
				y : tt.getBBox().y - 5,
				width : tt.getBBox().width + 20,
				height : tt.getBBox().height + 10
			});		
		}
		tt.hide(), tbox.hide();
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
			var coord = centerLine.getPointAtLength(15);		
			tset.push(coord);
			var ttx = cx + (r1+45)*Math.cos(angle/2+preAngle),
				tty = cy + (r2+45)*Math.sin(angle/2+preAngle);
			ttset.push({x: ttx, y: tty});		
			var side3 = paper.path("M"+startX+","+startY),
				side2 = paper.path("M"+cx+","+cy),
				side1 = paper.path("M"+cx+","+cy),
				topside = paper.path("M"+x+","+y);		
			var side3 = paper.path("M"+startX+","+startY+
				"A"+r1+","+r2+",0,"+largeArc+",1,"+x+","+y+
				"L"+x+","+(y+dsize)+
				"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+(startY+dsize)+"z");
			var side2 = paper.path("M"+cx+","+cy+
					   "L"+cx+","+(cy+dsize)+
					   "L"+x+","+(y+dsize)+
					   "L"+x+","+y);
			var side1 = paper.path("M"+cx+","+cy+
					   "L"+cx+","+(cy+dsize)+
					   "L"+startX+","+(startY+dsize)+
					   "L"+startX+","+startY);
			var topside = paper.path("M"+x+","+y+
				"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+startY+
				"L"+cx+","+cy+"z");
			slice.push(topside, side1, side2, side3);
			topSet.push(topside);
			topSet.toFront();
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
		function showTooltip(index) {				
			if (ttset[index].x < cx) {			
				tt.attr({
					text: tooltips[index] + " (" + percentages[index] + ")",
					x: ttset[index].x,
					y: ttset[index].y,
					'text-anchor': 'end'
				});
			} else {
				tt.attr({
					text: tooltips[index] + " (" + percentages[index] + ")",
					x: ttset[index].x,
					y: ttset[index].y,
					'text-anchor': 'start'
				});
			}
			moveBox(tt);
			tbox.attr({stroke: colors[index]});		
			tt.toFront(), tbox.toFront();
			tt.show(), tbox.show();
		}
		function hideTooltip() {
			tt.hide(), tbox.hide();
		}
		topSet.forEach(function(shape, i) {
			shape.hover(function() {
				shape.node.style.cursor = "pointer";
				showTooltip(i);
				var smx = (angles[i]>=Math.PI)?-(tset[i].x-cx):(tset[i].x-cx),
					smy = (angles[i]>=Math.PI)?-(tset[i].y-cy):(tset[i].y-cy);
				all_set[i].animate({
					transform: "t"+smx+","+smy
				}, 300);
				if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
					setTimeout(function() {
						all_set[i].animate({
							transform: "t0,0"
						});	
						hideTooltip();
					}, 2000);
				}
			}, function() {
				hideTooltip();
				all_set[i].animate({
					transform: "t0,0"
				}, 300);
			});		
		});	
	}
};