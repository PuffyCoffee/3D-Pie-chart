export const pie = (config, instance) => {
	const {title, data} = config;
	const isDoughnut = true;
	let values = [], colors = [], labels = [];

	if (!data || !Array.isArray(data)) {
		console.error("data is required, see doc for more details");
	}

	for (const {value, label, color} of data) {
		if (!value) {
			console.error("value is require in data");
		}
		if (!color) {
			console.log("use default color");
		}

		values.push(value);
		colors.push(color);
		labels.push(label);
	}

	// var tooltips = args.tooltip;
	var percentages = [], doughnutSize = 1.5; //doughnut hole
	var sum = 0;
	for (var i = 0; i < values.length; i += 1)  {
		sum += values[i];
	}
	for (var j = 0; j < values.length; j += 1) {
		percentages.push(((values[j]/sum)*100).toFixed(2)+"%");
	}
	var paper = instance;
	var r1, r2, cx, cy;
	var pie_width = paper.width,
		pie_height = paper.height,
		pie_radius = (pie_width > pie_height) ? .4*pie_height : .4*pie_width;

	r1 = pie_radius; r2 = .9*r1;
	cx = paper.width/2; cy = paper.height/2;

	var dsize = 15 * ( pie_width / 1000 )	; //thickness
	var nos = values.length;

	var calculatedTitleYOffset = r2/3;
	var titleFontSize = 20 * (pie_width / 400);
	var titleBox = paper.text(10, 10, title).attr({
		x: cx,
		y: cy - calculatedTitleYOffset,
		'font-size': titleFontSize,
		'font-weight': 'bold',
		opacity: 0.8
	});

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

		var labelBox = paper.text(0, 0, '').attr({
			x: cx,
			y: cy,
			'font-size': titleFontSize * .8,
			'font-weight': 'normal',
			opacity: 0.8,
			stroke: 'blue',
		});

		function showLabel(index) {
			labelBox.attr({
				text: labels[index],
				fill: colors[index],
				stroke: colors[index]
			});
			labelBox.show();
		}

		topSet.forEach(function(shape, i) {
			shape.hover(function() {
				shape.node.style.cursor = "pointer";
				var smx = (angles[i]>=Math.PI)?-(tset[i].x-cx):(tset[i].x-cx),
					smy = (angles[i]>=Math.PI)?-(tset[i].y-cy):(tset[i].y-cy);

				smx *= shape.paper.width / 800;
				smy *= shape.paper.height / 800;

				showLabel(i);

				all_set[i].animate({
					transform: "t"+smx+","+smy
				}, 300);
				if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
					setTimeout(function() {
						all_set[i].animate({
							transform: "t0,0"
						});
					}, 2000);
				}
			}, function() {
				labelBox.hide();
				all_set[i].animate({
					transform: "t0,0"
				}, 300);
			});
		});
	}
};