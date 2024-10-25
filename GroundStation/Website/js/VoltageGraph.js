// Getting the current time as an object
var nowVoltage = new Date();

// The data variables that we will be using
var voltageData = [];
var voltageTimes = [];  // Store seconds since start instead of Date objects
var firstDataTimeVoltage = null; // To track the time of the first data point

// Getting the dimensions of the graph
var voltageContainer = document.getElementById("voltage-container");
var widthVoltage = voltageContainer.offsetWidth * 0.7;
var heightVoltage = voltageContainer.offsetHeight * 0.7;
var marginVoltage = { top: 20, right: 0, bottom: 70, left: 55 };

// Adjust width and height to account for margins
var innerWidthVoltage = widthVoltage - marginVoltage.left - marginVoltage.right;
var innerHeightVoltage = heightVoltage - marginVoltage.top - marginVoltage.bottom;

// X scale using d3.scaleLinear for time-based X-axis in seconds
var xVoltage = d3.scaleLinear()
    .domain([0, 0])  // Initialize the domain with 0
    .range([0, innerWidthVoltage]);

(function () {

    // The color of the outlines and stuff
    var voltageColor = "black";

    // A function that checks the button to see if it has changed and changes the color if it needs to
    function voltageChangeColorMaybe() {
        var button = document.getElementById('modeChange');
        if ((voltageColor == "white" && button.textContent == "Light Mode") || (voltageColor == "black" && button.textContent == "Dark Mode")) return;

        voltageColor = (button.textContent == "Light Mode") ? "white" : "black";

        // Update axis colors
        voltageXAxis.selectAll("path").attr("stroke", voltageColor);
        voltageXAxis.selectAll("line").attr("stroke", voltageColor);
        voltageXAxis.selectAll("text").attr("fill", voltageColor);
        voltageYAxis.selectAll("path").attr("stroke", voltageColor);
        voltageYAxis.selectAll("line").attr("stroke", voltageColor);
        voltageYAxis.selectAll("text").attr("fill", voltageColor);

        // Update axis label colors
        svgVoltage.selectAll("text").attr("fill", voltageColor);
    }

    // Y scale for voltage data
    var yVoltage = d3.scaleLinear()
        .domain([0, 6.6])
        .range([innerHeightVoltage, 0]);

    // Create an SVG container with margins
    var svgVoltage = d3.select("#voltage-container")
        .append("svg")
        .attr("width", widthVoltage)
        .attr("height", heightVoltage)
        .append("g")
        .attr("transform", `translate(${marginVoltage.left}, ${marginVoltage.top})`);

    // Line generator
    var lineVoltage = d3.line()
        .x((d, i) => xVoltage(voltageTimes[i]))  // Use time for the X value
        .y(d => yVoltage(d));  // Voltage for the Y value

    // Append the line to the SVG
    var pathVoltage = svgVoltage.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3.5);

    // Add X-axis with time labels
    var voltageXAxis = svgVoltage.append("g")
        .attr("transform", `translate(0, ${innerHeightVoltage})`)
        .call(d3.axisBottom(xVoltage).ticks(5));

    // Add Y-axis with voltage values
    var voltageYAxis = svgVoltage.append("g")
        .call(d3.axisLeft(yVoltage).ticks(4));

    // Rotate X-axis tick labels for better readability
    voltageXAxis.selectAll("text")
        .attr("transform", "rotate(-45)")  // Rotate the tick labels
        .style("text-anchor", "end");      // Align the text to the end of the tick

    // Adding axis labels
    svgVoltage.append("text")
        .attr("x", innerWidthVoltage / 2)
        .attr("y", innerHeightVoltage + marginVoltage.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", voltageColor)
        .text("Time (hh:mm:ss.ss)");

    svgVoltage.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeightVoltage / 2)
        .attr("y", -marginVoltage.left + 20)
        .attr("text-anchor", "middle")
        .attr("fill", voltageColor)
        .text("Voltage (V)");

    // Update function for graph
    window.updateVoltage = function (voltageData) {
        // Update X domain with the time range
        xVoltage.domain([0, d3.max(voltageTimes)]);  // Update the X domain with new time range
        yVoltage.domain([0, d3.max(voltageData) + 10]);  // Update Y domain with new voltage data

        // Update the line
        pathVoltage.datum(voltageData).attr("d", lineVoltage);

        // Update X-axis and rotate the labels again
        voltageXAxis.call(d3.axisBottom(xVoltage)
            .ticks(5)
            .tickFormat(d => formatTime(d))  // Format as hh:mm:ss.ss
        );
        voltageXAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Updating the color of the labels 
        voltageXAxis.selectAll("text").attr("fill", voltageColor);
        voltageXAxis.selectAll("line").attr("stroke", voltageColor);
    }

    // Helper function to format seconds as hh:mm:ss.ss
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = (seconds % 60).toFixed(2);

        return `${hours.toString().padStart(1, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(5, '0')}`;
    }

    // Color change logic
    setInterval(voltageChangeColorMaybe, 20);

    // Actually running the chart
    window.updateVoltageInterval = setInterval(updateVoltage, 20, voltageData);
})();

// Add new data point with time (seconds) and voltage when user clicks
function graphVoltage(x, y) {
    voltageData.push(y);  // Add new voltage value
    voltageTimes.push(x);  // Push the new time in seconds

    // Set the time of the first data point
    if (!firstDataTimeVoltage) {
        firstDataTimeVoltage = x;
        xVoltage.domain([firstDataTimeVoltage, firstDataTimeVoltage]); // Initialize the x domain with the first point
    }

    window.updateVoltage(voltageData);  // Update graph with new data
}
