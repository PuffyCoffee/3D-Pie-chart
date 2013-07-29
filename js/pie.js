/**
 * 3D Pie chart
 * @author Peng Zhang 2012
 */
Raphael.fn.pie = function(args) {
	var values = args.values;	
	var colors = args.colors;
	var tooltips = args.tooltip;
	var percentages = [], isDoughnut = args.doughnut, doughnutSize = 2.5;
	var sum = 0;
	for (var i = 0; i < values.length; i += 1)  {
		sum += values[i];		
	}
	for (var j = 0; j < values.length; j += 1) {
		percentages.push(((values[j]/sum)*100).toFixed(2)+"%");
	}
	var paper = this;
	var r1, r2, cx, cy, titleX, titleY;
	if (args.legend.display) { //show legend
		var pie_half_width = paper.width/2,
			pie_half_height = paper.height,
			pie_radius = (pie_half_width > pie_half_height) ? 1/3*pie_half_height : 1/3*pie_half_width;
		r1 = pie_radius; r2 = .8*r1;
		cx = pie_half_width/2; cy = pie_half_height/2;
		titleX = cx; titleY = paper.height/13;

		// Draw legend
		var legend_half_width = paper.width/2,
			legend_half_height = paper.height;
		
		var legend_items = args.legend.items,
			legend_items_length = legend_items.length,
			startX = 7/6*legend_half_width, 
			stepH = legend_half_height/(legend_items_length+2),
			startY = stepH;

		for (var i = 0; i < legend_items_length; i += 1) {
			paper.circle(startX, startY+stepH*i, 6).attr({
				fill: args.colors[i],
				stroke: "black"
			});
			paper.text(startX+20, startY+stepH*i, legend_items[i]).attr({
				"text-anchor": "start",
				"font-size": 14
			});
		}
		


	} else { // just a single pie chart
		var pie_half_width = paper.width/2,
			pie_half_height = paper.height,
			pie_radius = (pie_half_width > pie_half_height) ? 1/3*pie_half_height : 1/3*pie_half_width;
		r1 = pie_radius; r2 = .8*r1; 
		cx = paper.width/2; cy = paper.height/2;
		titleX = cx; titleY = paper.height/13;
	}

	
	var title = paper.text(titleX, titleY, args.chartTitle).attr({
		'font-size' : 20
	});
	var dsize = 20;
	var nos = values.length;
	if (nos == 1) {
		if (isDoughnut) {
			var e_ = paper.ellipse(cx, cy+17, r1, r2).attr({
				fill: colors[0],
				stroke: "#999"
			});
			var e = paper.ellipse(cx, cy, r1, r2).attr({
				fill: colors[0],
				stroke: "#999",
				opacity: .8
			});
			var c = paper.ellipse(cx, cy, r1/doughnutSize, r2/doughnutSize).attr({				
				stroke: "#999",
				fill: "#fff"
			});
			var arcTop = paper.path("M"+(cx+r1/doughnutSize)+","+(cy+17)+
						 "A"+r1/doughnutSize+","+r2/doughnutSize+",0,1,0,"+
						 (cx-r1/doughnutSize)+","+(cy+17)+
						 "L"+(cx-r1/doughnutSize)+","+cy+
						 "A"+r1/doughnutSize+","+r2/doughnutSize+",0,0,1,"+
						 (cx+r1/doughnutSize)+","+cy+"z").attr({stroke: "#111", fill: colors[0],opacity: 1});
			var arcBot = paper.path("M"+(cx+r1/doughnutSize)+","+(cy+17)+
						 "A"+r1/doughnutSize+","+r2/doughnutSize+",0,1,1,"+
						 (cx-r1/doughnutSize)+","+(cy+17)).attr({stroke: "#111", opacity:.2});
			
		} else {
			var e = paper.ellipse(cx, cy, r1, r2).attr({
				fill: colors[0],
				stroke: "#999",
				opacity: .8
			});
			var e_ = paper.ellipse(cx, cy+17, r1, r2).attr({
				fill: colors[0],
				stroke: "#999"
			}).toBack();
		}		
	} else {	
		var x = cx + r1, y = cy, preAngle = 0;
		var ix = cx + r1/doughnutSize, iy = cy;
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
			var iStartX = ix, iStartY = iy;
			var ratio = values[i]/sum;		
			var angle = 2*ratio*Math.PI, largeArc = 0;
			angles.push(angle);
			if (angle > Math.PI)	largeArc = 1;
			x = cx + r1*Math.cos(angle+preAngle);
			y = cy + r2*Math.sin(angle+preAngle);
			ix = cx + r1/doughnutSize*Math.cos(angle+preAngle);
			iy = cy + r2/doughnutSize*Math.sin(angle+preAngle);			
			var centerX = (startX+x)/2, centerY = (startY+y)/2;
			var centerLine = paper.path("M"+cx+","+cy+"L"+centerX+","+centerY).attr({
				stroke: "none"
			});
			var coord = centerLine.getPointAtLength(15);		
			tset.push(coord);
			var ttx = cx + (r1+45)*Math.cos(angle/2+preAngle),
				tty = cy + (r2+45)*Math.sin(angle/2+preAngle);
			ttset.push({x: ttx, y: tty});
			if (isDoughnut) {
				var side4 = paper.path("M"+iStartX+","+iStartY),
					side3 = paper.path("M"+startX+","+startY),
					side2 = paper.path("M"+cx+","+cy),
					side1 = paper.path("M"+cx+","+cy),
					topside = paper.path("M"+x+","+y);
				side4 = paper.path("M"+iStartX+","+iStartY+
						"A"+r1/doughnutSize+","+r2/doughnutSize+",0,"+largeArc+",1,"+ix+","+iy+
						"L"+ix+","+(iy+dsize)+
						"A"+r1/doughnutSize+","+r2/doughnutSize+",0,"+largeArc+",0,"+iStartX+","+(iStartY+dsize)+"z");
				side3 = paper.path("M"+startX+","+startY+
						"A"+r1+","+r2+",0,"+largeArc+",1,"+x+","+y+
						"L"+x+","+(y+dsize)+
						"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+(startY+dsize)+"z");
				side2 = paper.path("M"+ix+","+iy+
					   "L"+ix+","+(iy+dsize)+
					   "L"+x+","+(y+dsize)+
					   "L"+x+","+y+"z");
				side1 = paper.path("M"+iStartX+","+iStartY+
					   "L"+iStartX+","+(iStartY+dsize)+
					   "L"+startX+","+(startY+dsize)+
					   "L"+startX+","+startY+"z");
				topside = paper.path("M"+x+","+y+
						"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+startY+
						"L"+iStartX+","+iStartY+
						"A"+r1/doughnutSize+","+r2/doughnutSize+",0,"+largeArc+",1,"+ix+","+iy+
						"z");
				slice.push(side1, side2, side3, side4, topside);
			} else {
				var side3 = paper.path("M"+startX+","+startY),
					side2 = paper.path("M"+cx+","+cy),
					side1 = paper.path("M"+cx+","+cy),
					topside = paper.path("M"+x+","+y);		
				side3 = paper.path("M"+startX+","+startY+
						"A"+r1+","+r2+",0,"+largeArc+",1,"+x+","+y+
						"L"+x+","+(y+dsize)+
						"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+(startY+dsize)+"z");
				side2 = paper.path("M"+cx+","+cy+
					   "L"+cx+","+(cy+dsize)+
					   "L"+x+","+(y+dsize)+
					   "L"+x+","+y+"z");
				side1 = paper.path("M"+cx+","+cy+
					   "L"+cx+","+(cy+dsize)+
					   "L"+startX+","+(startY+dsize)+
					   "L"+startX+","+startY+"z");
				topside = paper.path("M"+x+","+y+
						"A"+r1+","+r2+",0,"+largeArc+",0,"+startX+","+startY+
						"L"+cx+","+cy+"z");
				slice.push(topside, side1, side2, side3);
				
			}	
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
			if (typeof tooltips !== 'undefined') {
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