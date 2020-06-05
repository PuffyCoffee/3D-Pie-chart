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
The bundle file includes raphael.js, there is no need to download it separately.


### Usage
#### run on test page
```
npm run start:dev
```
#### run on your own page
Build first, then use generated dist/3d-pie.bundle.js file in your html
```
<script src="your/path/3d-pie.bundle.js"></script>
```

### Example
```
pieChart({
	containerId: "wrapper",
	title: "Expenses",
	data: [
		{
			value: 45,
			color: "#00ff00",
			label: "January - 45"
		},
		{
			value: 49,
			color: "#ff0011",
			label: "February - 49"
		},
		{
			value: 40,
			color: "#0079fa",
			label: "March - 40"
		}
	]
});
```
