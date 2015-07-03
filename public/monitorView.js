var monitorView = {};
monitorView.first = true;

monitorView.use = function(socket, data) {
	monitorView.socket = socket;
	console.log('UI: Show Monitor panel');
	// UI: Show Monitor Panel
	if (monitorView.first) {
		// Set listeners
	}


	monitorView.first = false;
	monitorView.show();
};


monitorView.show = function() {
	clientSelectionPanel.style.display = "none";
	monitorPanel.style.display = "block";
	console.log('monitorView.show');

	showGraph();
}


var chart;
loadTheme();

Highcharts.setOptions({
	global: {
		useUTC: false
	}
});

function showGraph() {
	console.log('SHOW GRAPH');
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'graphContainer',
			title: 'Drink Prices',
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 70,
			maxPadding: 1,
			max: 120
		},
      scrollbar: {
         enabled: true
      },
		yAxis: {
			min: 1,
			max: 10
		},
		title: {
			text: 'Drink Prices'
		},
		plotOptions: {
			line: {
				marker: {
					enabled: false
				},
				animation: false
			}
		},
	});
	startGraphAnimation();
}

function startGraphAnimation() {
	console.log('startGraphAnimation');

   chart.addSeries({
      name: "Bier"
   });
   chart.addSeries({
      name: "Wodka"
   });
   chart.addSeries({
      name: "Radler"
   });
	for (var i = -1; i < 10000; ++i) {
		setTimeout('addPoint()', i * 500);
	}
};

function addPoint() {
	for (var i = 0; i < chart.series.length; ++i) {
		chart.series[i].addPoint(Math.random() + 2 + (1.5 * i) + Math.random() * 2 + Math.random() * Math.random() * Math.random() * 2);
	}
}