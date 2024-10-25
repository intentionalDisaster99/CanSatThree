// Declare global variables outside the IIFE so they can be accessed by the global graphOrientation function
var yawData = [];
var rollData = [];
var pitchData = [];
var times = [];  // Store the time in seconds
var firstDataTime = null; // To track the time of the first data point
var x, updateOrientation;  // Declare globally accessible 'x' scale and update function

document.addEventListener("DOMContentLoaded", function () {
    (function () {
        // Color variables for each dataset
        var yawColor = "red";
        var rollColor = "green";
        var pitchColor = "blue";

        // Getting the dimensions of the graph
        var container = document.getElementById("orientation-container");
        var width = container.offsetWidth * 0.7;
        var height = container.offsetHeight * 0.7;
        var margin = { top: 20, right: 120, bottom: 70, left: 55 }; // Adjust right margin for the legend

        // Adjust width and height to account for margins
        var innerWidth = width - margin.left - margin.right;
        var innerHeight = height - margin.top - margin.bottom;

        // X scale using d3.scaleLinear for time in seconds (adjustable)
        x = d3.scaleLinear()
            .domain([0, 1])  // Start domain at [0, 1] to ensure the graph starts on the left
            .range([0, innerWidth]);

        // Y scale for orientation data (assuming range is -180 to 180 for yaw/roll/pitch)
        var y = d3.scaleLinear()
            .domain([-180, 180])
            .range([innerHeight, 0]);

        // Create an SVG container with margins
        var svg = d3.select("#orientation-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Line generators for yaw, roll, and pitch
        var lineYaw = d3.line()
            .x((d, i) => x(times[i]))  // Use time for the X value
            .y(d => y(d));  // Yaw for the Y value

        var lineRoll = d3.line()
            .x((d, i) => x(times[i]))  // Use time for the X value
            .y(d => y(d));  // Roll for the Y value

        var linePitch = d3.line()
            .x((d, i) => x(times[i]))  // Use time for the X value
            .y(d => y(d));  // Pitch for the Y value

        // Append the lines to the SVG
        var pathYaw = svg.append("path").attr("fill", "none").attr("stroke", yawColor).attr("stroke-width", 3.5);
        var pathRoll = svg.append("path").attr("fill", "none").attr("stroke", rollColor).attr("stroke-width", 3.5);
        var pathPitch = svg.append("path").attr("fill", "none").attr("stroke", pitchColor).attr("stroke-width", 3.5);

        // Add a single X-axis with time labels
        var xAxis = svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x).ticks(5));

        // Add Y-axis for yaw, roll, and pitch
        var yAxis = svg.append("g").call(d3.axisLeft(y).ticks(4));

        // Rotate X-axis tick labels for better readability
        xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

        // Adding axis labels
        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("Time (hh:mm:ss.ss)");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("Angle (degrees)");

        // Update function for graph
        updateOrientation = function () {
            // Update X domain based on current time range; start from 0 and expand
            x.domain([0, d3.max(times)]);  // Fix the left edge at 0 and grow rightward

            // Update the line paths
            pathYaw.datum(yawData).attr("d", lineYaw);
            pathRoll.datum(rollData).attr("d", lineRoll);
            pathPitch.datum(pitchData).attr("d", linePitch);

            // Update X-axis and format the time in hh:mm:ss.ss
            xAxis.call(d3.axisBottom(x).ticks(5).tickFormat(d => formatTime(d)));

            xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

            // Update the color of the labels (if mode changes)
            xAxis.selectAll("text").attr("fill", currentColor);
            xAxis.selectAll("line").attr("stroke", currentColor);
        }

        // Add the legend back to the chart
        var legend = svg.append("g")
            .attr("transform", `translate(${innerWidth + 20}, 20)`);  // Adjust the position as needed

        // Yaw legend
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", yawColor);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text("Yaw")
            .attr("fill", "black");

        // Roll legend
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", rollColor);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 32)
            .text("Roll")
            .attr("fill", "black");

        // Pitch legend
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 40)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", pitchColor);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 52)
            .text("Pitch")
            .attr("fill", "black");

        // Color change logic
        setInterval(changeColorMaybe, 20);

        // Actually running the chart
        window.updateOrientationInterval = setInterval(updateOrientation, 20);

        // Color update function
        function changeColorMaybe() {
            var button = document.getElementById('modeChange');
            currentColor = (button.textContent === "Light Mode") ? "white" : "black";

            // Update axis colors
            xAxis.selectAll("path").attr("stroke", currentColor);
            xAxis.selectAll("line").attr("stroke", currentColor);
            xAxis.selectAll("text").attr("fill", currentColor);

            yAxis.selectAll("path").attr("stroke", currentColor);
            yAxis.selectAll("line").attr("stroke", currentColor);
            yAxis.selectAll("text").attr("fill", currentColor);
        }
    })();
});

// Global function to be called from other files
function graphOrientation(timeInSeconds, roll, pitch, yaw) {
    yawData.push(yaw);    // Add new yaw value
    rollData.push(roll);   // Add new roll value
    pitchData.push(pitch); // Add new pitch value
    times.push(timeInSeconds);  // Use the input time in seconds

    // Set the time of the first data point (if not already set)
    if (!firstDataTime) {
        firstDataTime = timeInSeconds;
    }

    updateOrientation();  // Update graph with new data
}

// Helper function to format seconds as hh:mm:ss.ss
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(2);

    return `${hours.toString().padStart(1, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(5, '0')}`;
}
