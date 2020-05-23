## 3D Pie Chart
Adorable and highly customizable [Raphaël](https://www.npmjs.com/package/raphael) 3d pie/dounut chart.

### Installation
```
npm install 3d-pie-chart --save
```

### Build
```
npm run build
```


### Usage
#### run on test page
```
npm run start:dev
```
#### run on your own page
Build first, then use generated dist/3d-pie.js file in your html
```
<script src="your/path/3d-pie.js"></script>
```

### Config

* values, each value in array renders one slice of pie
* colors, color for each slice
* tooltip: tooltip for each slice
* doughnut: toggle pie and dounut, default false(pie)
* radius
* tile: adjust pie/doughnut chart viewing angle, options are __["x", "l", "m", "s"]__ (Extra, Large, Medium, Small), default is "l" large
* chartTitle
* legend: display true|false
		  legend items array


### Example
```
Raphael('wrapper', 700, 500).pie({
	values: [87, 134, 83, 23, 98],
	colors: ["#00ff00", "#ff0011", "#faf600", "#0079fa", "#fa8500"],
	tooltip: ["January - 87", "Feburary - 136", "March - 77", "April - 120","May - 34"],
	doughnut: true,
	radius: 200,
	tilt: "l",
	chartTitle: "Monthly Payment",
	legend: {
		display: true,
		items: ["January - 87", "Feburary - 136", "March - 77", "April - 120","May - 34"]
	}
});
```
