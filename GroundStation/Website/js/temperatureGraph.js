(function () {
    // Getting the current time as an object
    var nowTemperature = new Date();

    // The data variable that we will be using
    var temperatureData = [];
    var temperatureTimes = [];  // Store Date objects for times instead of strings
    var firstDataTimeTemperature = null; // To track the time of the first data point

    // The color of the outlines and stuff
    var temperatureColor = "black";

    // A function that checks the button to see if it has changed and changes the color if it needs to
    function temperatureChangeColorMaybe() {
        var button = document.getElementById('modeChange');
        if ((temperatureColor == "white" && button.textContent == "Light Mode") || (temperatureColor == "black" && button.textContent == "Dark Mode")) return;

        temperatureColor = (button.textContent == "Light Mode") ? "white" : "black";

        // Update axis colors
        temperatureXAxis.selectAll("path").attr("stroke", temperatureColor);
        temperatureXAxis.selectAll("line").attr("stroke", temperatureColor);
        temperatureXAxis.selectAll("text").attr("fill", temperatureColor);
        temperatureYAxis.selectAll("path").attr("stroke", temperatureColor);
        temperatureYAxis.selectAll("line").attr("stroke", temperatureColor);
        temperatureYAxis.selectAll("text").attr("fill", temperatureColor);

        // Update axis label colors
        svgTemperature.selectAll("text").attr("fill", temperatureColor);
    }

    // Getting the dimensions of the graph
    var temperatureContainer = document.getElementById("temperature-container");
    var widthTemperature = temperatureContainer.offsetWidth * 0.7;
    var heightTemperature = temperatureContainer.offsetHeight * 0.7;
    var marginTemperature = { top: 20, right: 0, bottom: 70, left: 55 };

    // Adjust width and height to account for margins
    var innerWidthTemperature = widthTemperature - marginTemperature.left - marginTemperature.right;
    var innerHeightTemperature = heightTemperature - marginTemperature.top - marginTemperature.bottom;

    // X scale using d3.scaleTime for time-based X-axis
    var xTemperature = d3.scaleTime()
        .domain([nowTemperature, nowTemperature])  // Initialize the domain with the current time
        .range([0, innerWidthTemperature]);

    // Y scale for temperature data
    var yTemperature = d3.scaleLinear()
        .domain([0, 1000])  // Example Y domain
        .range([innerHeightTemperature, 0]);

    // Create an SVG container with margins
    var svgTemperature = d3.select("#temperature-container")
        .append("svg")
        .attr("width", widthTemperature)
        .attr("height", heightTemperature)
        .append("g")
        .attr("transform", `translate(${marginTemperature.left}, ${marginTemperature.top})`);

    // Line generator
    var lineTemperature = d3.line()
        .x((d, i) => xTemperature(temperatureTimes[i]))  // Use time for the X value
        .y(d => yTemperature(d));  // Temperature for the Y value

    // Append the line to the SVG
    var pathTemperature = svgTemperature.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3.5);

    // Add X-axis with time labels
    var temperatureXAxis = svgTemperature.append("g")
        .attr("transform", `translate(0, ${innerHeightTemperature})`)
        .call(d3.axisBottom(xTemperature).ticks(5));

    // Add Y-axis with temperature values
    var temperatureYAxis = svgTemperature.append("g")
        .call(d3.axisLeft(yTemperature).ticks(4));

    // Rotate X-axis tick labels for better readability
    temperatureXAxis.selectAll("text")
        .attr("transform", "rotate(-45)")  // Rotate the tick labels
        .style("text-anchor", "end");      // Align the text to the end of the tick

    // Adding axis labels
    svgTemperature.append("text")
        .attr("x", innerWidthTemperature / 2)
        .attr("y", innerHeightTemperature + marginTemperature.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", temperatureColor)
        .text("Time");

    svgTemperature.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeightTemperature / 2)
        .attr("y", -marginTemperature.left + 20)
        .attr("text-anchor", "middle")
        .attr("fill", temperatureColor)
        .text("Temperature (degrees celsius)");

    // Update function for graph
    function updateTemperature(temperatureData) {
        // Update X domain with the time range
        xTemperature.domain([firstDataTimeTemperature, d3.max(temperatureTimes)]);  // Update the X domain with new time range
        yTemperature.domain([0, d3.max(temperatureData) + 10]);  // Update Y domain with new temperature data

        // Update the line
        pathTemperature.datum(temperatureData).attr("d", lineTemperature);

        // Update X-axis and rotate the labels again
        temperatureXAxis.call(d3.axisBottom(xTemperature)
            .ticks(5)
            .tickFormat(d => d.toLocaleTimeString([], { // Change the format of the x axis labels
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false  // Ensure 24-hour format
            }))
        );
        temperatureXAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Updating the color of the labels 
        temperatureXAxis.selectAll("text").attr("fill", temperatureColor);
        temperatureXAxis.selectAll("line").attr("stroke", temperatureColor);
    }

    // Add new data point with time and temperature when user clicks
    function graphTemperature(event) {
        nowTemperature = new Date();
        temperatureData.push(event.clientX);  // Add new temperature value
        temperatureTimes.push(nowTemperature);  // Push the new Date object

        // Set the time of the first data point
        if (!firstDataTimeTemperature) {
            firstDataTimeTemperature = nowTemperature;
            xTemperature.domain([firstDataTimeTemperature, firstDataTimeTemperature]); // Initialize the x domain with the first point
        }

        updateTemperature(temperatureData);  // Update graph with new data
    }

    document.addEventListener("click", graphTemperature);

    // Color change logic
    setInterval(temperatureChangeColorMaybe, 20);

    // Actually running the chart
    window.updateTemperatureInterval = setInterval(updateTemperature, 20, temperatureData);
})();
