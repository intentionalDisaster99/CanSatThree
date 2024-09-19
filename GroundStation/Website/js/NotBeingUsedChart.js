// import Chart from 'chart.js/auto'

// // Just adding in something to test out the line chart
// if (document.attachEvent) document.attachEvent('onclick', handler);
// else document.addEventListener('click', handler);

// function handler(event) {
//     // Access mouseX and mouseY
//     var mouseX = event.clientX;
//     var mouseY = event.clientY;
//     console.log("Mouse X: " + mouseX + ", Mouse Y: " + mouseY);
// }

// if (document.attachEvent) {
//     document.attachEvent('onclick', handler);
// } else {
//     document.addEventListener('click', handler);
// }

// console.log("It has been run");

// (async function () {


//     // data = [
//     //     { year: 201, count: 10 },
//     //     { year: 2011, count: 20 },
//     //     { year: 2012, count: 15 },
//     //     { year: 2013, count: 25 },
//     //     { year: 2014, count: 22 },
//     //     { year: 2015, count: 30 },
//     //     { year: 2016, count: 28 },
//     // ];

//     new Chart(
//         document.getElementById('altitude'),
//         {
//             type: 'line',
//             data: {
//                 labels: data.map(row => row.year),
//                 datasets: [
//                     {
//                         label: 'Altitude',
//                         data: data.map(row => row.count)
//                     }
//                 ]
//             }
//         }
//     );
// })();