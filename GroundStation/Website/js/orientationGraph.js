(function () {
    // Getting the current time as an object
    var now = new Date();

    // Data variables for yaw, roll, and pitch
    var yawData = [];
    var rollData = [];
    var pitchData = [];
    var times = [];  // Store Date objects for times instead of strings
    var firstDataTime = null; // To track the time of the first data point

    // Color variables for each dataset
    var yawColor = "red";
    var rollColor = "green";
    var pitchColor = "blue";

    // Getting the dimensions of the graph
    var container = document.getElementById("orientation-container");
    var width = container.offsetWidth * 0.7;
    var height = container.offsetHeight * 0.7;
    var margin = { top: 20, right: 80, bottom: 70, left: 55 }; // Added right margin for legend

    // Adjust width and height to account for margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // X scale using d3.scaleTime for time-based X-axis
    var x = d3.scaleTime()
        .domain([now, now])  // Initialize the domain with the current time
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

    // Add Y-axes for yaw, roll, and pitch
    var yawYAxis = svg.append("g").call(d3.axisLeft(y).ticks(4));
    var rollYAxis = svg.append("g").attr("transform", `translate(${innerWidth}, 0)`).call(d3.axisLeft(y).ticks(4));
    var pitchYAxis = svg.append("g").attr("transform", `translate(${innerWidth * 2}, 0)`).call(d3.axisLeft(y).ticks(4));

    // Rotate X-axis tick labels for better readability
    xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

    // Adding axis labels
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Time");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Angle (degrees)");

    // Adding a legend
    var legend = svg.append("g")
        .attr("transform", `translate(${innerWidth + 20}, 20)`);  // Adjust position as needed

    // Add colored rectangles and labels for yaw, roll, pitch
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

    // Update function for graph
    function updateOrientation() {
        // Update X domain with the time range
        x.domain([firstDataTime, d3.max(times)]);  // Update the X domain with new time range

        // Update the line paths
        pathYaw.datum(yawData).attr("d", lineYaw);
        pathRoll.datum(rollData).attr("d", lineRoll);
        pathPitch.datum(pitchData).attr("d", linePitch);

        // Update X-axis and rotate the labels again
        xAxis.call(d3.axisBottom(x).ticks(5).tickFormat(d => d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false  // Ensure 24-hour format
        })));

        xAxis.selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

        // Update the color of the labels 
        xAxis.selectAll("text").attr("fill", currentColor);
        xAxis.selectAll("line").attr("stroke", currentColor);
    }

    // Add new data point with time and orientation when user clicks
    function graphOrientation(event) {
        now = new Date();
        yawData.push(event.clientY / 1000 * 180);  // Simulate new yaw value
        rollData.push(event.clientX / 1000 * 180);  // Simulate new roll value
        pitchData.push((event.clientY - event.clientX) / 1000 * 180); // Simulate new pitch value
        times.push(now);  // Push the new Date object

        // Set the time of the first data point
        if (!firstDataTime) {
            firstDataTime = now;
            x.domain([firstDataTime, firstDataTime]); // Initialize the x domain with the first point
        }

        updateOrientation();  // Update graph with new data
    }

    document.addEventListener("click", graphOrientation);

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

        [yawYAxis, rollYAxis, pitchYAxis].forEach(axis => {
            axis.selectAll("path").attr("stroke", currentColor);
            axis.selectAll("line").attr("stroke", currentColor);
            axis.selectAll("text").attr("fill", currentColor);
        });

        // Update axis label colors
        svg.selectAll("text").attr("fill", currentColor);
    }
})();
