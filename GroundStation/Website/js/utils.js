"use strict";


window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
  black: "rgb(255, 255, 255)",
  white: "rgb(255, 255, 255)"

};

// The data that we have 
class Data {
  constructor() {

    // The raw data
    this.time = [];
    this.samples = [];

    // The data in a format that we can use to push to the csv format
    this.csv = [];

  }

  // Adding a sample to the list
  addSample(time, sample) {
    this.time.push(time);
    this.samples.push(sample);
    this.csv.push([time, sample]);
  }
}

let data = new Data();

(function (global) {

  var Samples = global.Samples || (global.Samples = {});
  var Color = global.Color;

  Samples.utils = {
    months: function (config) {
      var cfg = config || {};
      var count = cfg.count || 12;
      var section = cfg.section;
      var values = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = Months[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
      }

      return values;
    },

    color: function (index) {
      return COLORS[index % COLORS.length];
    },

    transparentize: function (color, opacity) {
      var alpha = opacity === undefined ? 0.5 : 1 - opacity;
      return Color(color)
        .alpha(alpha)
        .rgbString();
    }
  };

  // DEPRECATED
  window.randomScalingFactor = function () {
    return Math.round(Samples.utils.rand(-100, 100));
  };

})(this);

// The config object
var config = {
  type: 'line',
  data: {
    datasets: [{
      label: 'Altitude',
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      // data: [0, 10, 5, 2, 20, 30, 45],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title: {
      display: false,
      text: 'Altitude Line Chart'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          color: "white" // Change X-axis title color
        },
        ticks: {
          color: 'white' // Change X-axis label color
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Altitude (meters)',
          color: 'white' // Change Y-axis title color
        },
        ticks: {
          color: 'white' // Change Y-axis label color
        }
      }
    }
  }
};

// Just something to test out the graph
function handler(event) {
  // Access mouseX and mouseY
  var mouseX = event.clientX;
  var mouseY = -event.clientY;
  console.log("Mouse X: " + mouseX + ", Mouse Y: " + mouseY);

  // Adding this in to the samples
  var currentTime = new Date().toLocaleTimeString();
  data.addSample(currentTime, mouseY);

  // Update the chart
  updateChart();
}

if (document.attachEvent) {
  document.attachEvent('onclick', handler);
} else {
  document.addEventListener('click', handler);
}

// The function that updates the chart
function updateChart() {

  // Only updating it if the set has changed
  if (data != undefined) {
    if (config.data.labels == data.samples) {
      if (config.data.labels.length >= 2) return;

    }
  }

  config.data.labels = data.time;
  config.data.datasets[0].data = data.samples;
  // Making sure that the line graph is actually updated 
  if (window.myLine != undefined) {
    // Calling the function again and then returning
    // updateChart
    window.myLine.update();
  }

}

// Setting up the automatic updating of the chart
setInterval(updateChart, 20);

// Initialize the chart
window.onload = function () {
  var ctx = document.getElementById('lineChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
};


// Now to save this as a CSV file
function downloadCSV(data, filename) {
  var csv = 'Time,Data\n';
  data.forEach(function (row) {
    csv += row.join(',');
    csv += "\n";
  });

  var blob = new Blob([csv], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Now to read to the file
