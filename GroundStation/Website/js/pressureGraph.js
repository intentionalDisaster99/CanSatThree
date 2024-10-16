(function () {
    // Getting the current time as an object
    var nowPressure = new Date();

    // The data variable that we will be using
    var pressureData = [];
    var pressureTimes = [];  // Store Date objects for times instead of strings
    var firstDataTimePressure = null; // To track the time of the first data point

    // The color of the outlines and stuff
    var pressureColor = "black";

    // A function that checks the button to see if it has changed and changes the color if it needs to
    function pressureChangeColorMaybe() {
        var button = document.getElementById('modeChange');
        if ((pressureColor == "white" && button.textContent == "Light Mode") || (pressureColor == "black" && button.textContent == "Dark Mode")) return;

        pressureColor = (button.textContent == "Light Mode") ? "white" : "black";

        // Update axis colors
        pressureXAxis.selectAll("path").attr("stroke", pressureColor);
        pressureXAxis.selectAll("line").attr("stroke", pressureColor);
        pressureXAxis.selectAll("text").attr("fill", pressureColor);
        pressureYAxis.selectAll("path").attr("stroke", pressureColor);
        pressureYAxis.selectAll("line").attr("stroke", pressureColor);
        pressureYAxis.selectAll("text").attr("fill", pressureColor);

        // Update axis label colors
        svgPressure.selectAll("text").attr("fill", pressureColor);
    }

    // Getting the dimensions of the graph
    var pressureContainer = document.getElementById("pressure-container");
    var widthPressure = pressureContainer.offsetWidth * 0.7;
    var heightPressure = pressureContainer.offsetHeight * 0.8;
    var marginPressure = { top: 20, right: 0, bottom: 70, left: 50 };

    // Adjust width and height to account for margins
    var innerWidthPressure = widthPressure - marginPressure.left - marginPressure.right;
    var innerHeightPressure = heightPressure - marginPressure.top - marginPressure.bottom;

    // X scale using d3.scaleTime for time-based X-axis
    var xPressure = d3.scaleTime()
        .domain([nowPressure, nowPressure])  // Initialize the domain with the current time
        .range([0, innerWidthPressure]);

    // Y scale for pressure data
    var yPressure = d3.scaleLinear()
        .domain([0, 1000])  // Example Y domain
        .range([innerHeightPressure, 0]);

    // Create an SVG container with margins
    var svgPressure = d3.select("#pressure-container")
        .append("svg")
        .attr("width", widthPressure)
        .attr("height", heightPressure)
        .append("g")
        .attr("transform", `translate(${marginPressure.left}, ${marginPressure.top})`);

    // Line generator
    var linePressure = d3.line()
        .x((d, i) => xPressure(pressureTimes[i]))  // Use time for the X value
        .y(d => yPressure(d));  // Pressure for the Y value

    // Append the line to the SVG
    var pathPressure = svgPressure.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3.5);

    // Add X-axis with time labels
    var pressureXAxis = svgPressure.append("g")
        .attr("transform", `translate(0, ${innerHeightPressure})`)
        .call(d3.axisBottom(xPressure).ticks(5));

    // Add Y-axis with pressure values
    var pressureYAxis = svgPressure.append("g")
        .call(d3.axisLeft(yPressure).ticks(4));

    // Rotate X-axis tick labels for better readability
    pressureXAxis.selectAll("text")
        .attr("transform", "rotate(-45)")  // Rotate the tick labels
        .style("text-anchor", "end");      // Align the text to the end of the tick

    // Adding axis labels
    svgPressure.append("text")
        .attr("x", innerWidthPressure / 2)
        .attr("y", innerHeightPressure + marginPressure.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", pressureColor)
        .text("Time");

    svgPressure.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeightPressure / 2)
        .attr("y", -marginPressure.left + 20)
        .attr("text-anchor", "middle")
        .attr("fill", pressureColor)
        .text("Pressure (Pa)");

    // Update function for graph
    function updatePressure(pressureData) {
        // Update X domain with the time range
        xPressure.domain([firstDataTimePressure, d3.max(pressureTimes)]);  // Update the X domain with new time range
        yPressure.domain([0, d3.max(pressureData) + 10]);  // Update Y domain with new pressure data

        // Update the line
        pathPressure.datum(pressureData).attr("d", linePressure);

        // Update X-axis and rotate the labels again
        pressureXAxis.call(d3.axisBottom(xPressure)
            .ticks(5)
            .tickFormat(d => d.toLocaleTimeString([], { // Change the format of the x axis labels
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false  // Ensure 24-hour format
            }))
        );
        pressureXAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Updating the color of the labels 
        pressureXAxis.selectAll("text").attr("fill", pressureColor);
        pressureXAxis.selectAll("line").attr("stroke", pressureColor);
    }

    // Add new data point with time and pressure when user clicks
    function graphPressure(event) {
        nowPressure = new Date();
        pressureData.push(1000 - event.clientX);  // Add new pressure value
        pressureTimes.push(nowPressure);  // Push the new Date object

        // Set the time of the first data point
        if (!firstDataTimePressure) {
            firstDataTimePressure = nowPressure;
            xPressure.domain([firstDataTimePressure, firstDataTimePressure]); // Initialize the x domain with the first point
        }

        updatePressure(pressureData);  // Update graph with new data
    }

    document.addEventListener("click", graphPressure);

    // Color change logic
    setInterval(pressureChangeColorMaybe, 20);

    // Actually running the chart
    window.updatePressureInterval = setInterval(updatePressure, 20, pressureData);
})();
