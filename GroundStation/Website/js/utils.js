// "use strict";

// window.chartColors = {
//   red: "rgb(255, 99, 132)",
//   orange: "rgb(255, 159, 64)",
//   yellow: "rgb(255, 205, 86)",
//   green: "rgb(75, 192, 192)",
//   blue: "rgb(54, 162, 235)",
//   purple: "rgb(153, 102, 255)",
//   grey: "rgb(201, 203, 207)"
// };

// // The data that we have 
// class Data {

//   // The default constructor
//   Data() {
//     this.time = [];
//     this.samples = [];
//   }

//   // Adding a sample to the list
//   addSample(time, sample) {

//     this.time.push(time);
//     this.samples.push(sample);

//   }

// }
// let data = new Data();


// (function (global) {
//   var Months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December"
//   ];

//   var COLORS = [
//     "#4dc9f6",
//     "#f67019",
//     "#f53794",
//     "#537bc4",
//     "#acc236",
//     "#166a8f",
//     "#00a950",
//     "#58595b",
//     "#8549ba"
//   ];

//   var Samples = global.Samples || (global.Samples = {});
//   var Color = global.Color;

//   Samples.utils = {

//     months: function (config) {
//       var cfg = config || {};
//       var count = cfg.count || 12;
//       var section = cfg.section;
//       var values = [];
//       var i, value;

//       for (i = 0; i < count; ++i) {
//         value = Months[Math.ceil(i) % 12];
//         values.push(value.substring(0, section));
//       }

//       return values;
//     },

//     color: function (index) {
//       return COLORS[index % COLORS.length];
//     },

//     transparentize: function (color, opacity) {
//       var alpha = opacity === undefined ? 0.5 : 1 - opacity;
//       return Color(color)
//         .alpha(alpha)
//         .rgbString();
//     }
//   };

//   // DEPRECATED
//   window.randomScalingFactor = function () {
//     return Math.round(Samples.utils.rand(-100, 100));
//   };



// })(this);


// // The config object
// var config = {
//   type: 'line',
//   data: {
//     labels: ["January", "February", "March", "April", "May", "June", "July"],
//     datasets: [{
//       label: 'My First dataset',
//       backgroundColor: window.chartColors.red,
//       borderColor: window.chartColors.red,
//       data: [0, 10, 5, 2, 20, 30, 45],
//       fill: false,
//     }]
//   },
//   options: {
//     responsive: true,
//     title: {
//       display: true,
//       text: 'Chart.js Line Chart'
//     },
//     tooltips: {
//       mode: 'index',
//       intersect: false,
//     },
//     hover: {
//       mode: 'nearest',
//       intersect: true
//     },
//     scales: {
//       x: {
//         display: true,
//         title: {
//           display: true,
//           text: 'Month'
//         }
//       },
//       y: {
//         display: true,
//         title: {
//           display: true,
//           text: 'Value'
//         }
//       }
//     }
//   }
// };

// // Just something to test out the graph
// function handler(event) {
//   // Access mouseX and mouseY
//   var mouseX = event.clientX;
//   var mouseY = event.clientY;
//   console.log("Mouse X: " + mouseX + ", Mouse Y: " + mouseY);

//   // Adding this in to the samples
// }

// if (document.attachEvent) {
//   document.attachEvent('onclick', handler);
// } else {
//   document.addEventListener('click', handler);
// }

// // The function that updates the chart
// function updateChart() {
//   config.data.datasets[0].data = data.samples;
//   window.myLine.update();
// }


// // Setting up the automatic updating of the chart
// setInterval(updateChart, 20);
"use strict";

window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)"
};

// The data that we have 
class Data {
  constructor() {
    this.time = [];
    this.samples = [];
  }

  // Adding a sample to the list
  addSample(time, sample) {
    this.time.push(time);
    this.samples.push(sample);
  }
}

let data = new Data();

(function (global) {
  var Months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  var COLORS = [
    "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
    "#166a8f", "#00a950", "#58595b", "#8549ba"
  ];

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
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      data: [0, 10, 5, 2, 20, 30, 45],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Chart.js Line Chart'
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
          text: 'Month'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
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
  config.data.labels = data.time;
  config.data.datasets[0].data = data.samples;
  window.myLine.update();
}

// Setting up the automatic updating of the chart
setInterval(updateChart, 20);

// Initialize the chart
window.onload = function () {
  var ctx = document.getElementById('lineChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
};
