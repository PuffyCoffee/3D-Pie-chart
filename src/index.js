import { createPlugin } from "./raphael-plugin";

const Raphael = require("raphael");
createPlugin();

export const pieChart = (config) => {
	const {containerId} = config;
	if (!containerId) {
		console.error("pie chart needs a square container div");
	}
	if (!document) {
		console.error("pie chart only runs on browser");
	}

	const container = document.getElementById(containerId);
	if (!container) {
		console.error("pie chart needs a square container div");
	}
	const {offsetWidth, offsetHeight} = container;
	let squareSideLength;
	if (offsetHeight !== offsetWidth || offsetWidth <= 0 || offsetHeight <= 0) {
		squareSideLength = (offsetWidth > offsetHeight) ? offsetWidth : offsetHeight;
		console.warn("pie chart needs a square container div");
	}
	Raphael(containerId, squareSideLength, squareSideLength).pie(config);
};