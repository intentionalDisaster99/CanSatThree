(function () {
  // Getting the current time as an object
  var nowAltitude = new Date();

  // The data variable that we will be using
  var altitudeData = [];
  var altitudeTimes = [];  // Store Date objects for times instead of strings
  var firstDataTimeAltitude = null; // To track the time of the first data point

  // The color of the outlines and stuff
  var altitudeColor = "black";

  // A function that checks the button to see if it has changed and changes the color if it needs to
  function altitudeChangeColorMaybe() {
    var button = document.getElementById('modeChange');
    if ((altitudeColor == "white" && button.textContent == "Light Mode") || (altitudeColor == "black" && button.textContent == "Dark Mode")) return;

    altitudeColor = (button.textContent == "Light Mode") ? "white" : "black";

    // Update axis colors
    altitudeXAxis.selectAll("path").attr("stroke", altitudeColor);
    altitudeXAxis.selectAll("line").attr("stroke", altitudeColor);
    altitudeXAxis.selectAll("text").attr("fill", altitudeColor);
    altitudeYAxis.selectAll("path").attr("stroke", altitudeColor);
    altitudeYAxis.selectAll("line").attr("stroke", altitudeColor);
    altitudeYAxis.selectAll("text").attr("fill", altitudeColor);

    // Update axis label colors
    svgAltitude.selectAll("text").attr("fill", altitudeColor);
  }

  // Getting the dimensions of the graph
  var altitudeContainer = document.getElementById("altitude-container");
  var widthAltitude = altitudeContainer.offsetWidth * 0.7;
  var heightAltitude = altitudeContainer.offsetHeight * 0.7;
  var marginAltitude = { top: 20, right: 0, bottom: 70, left: 55 };

  // Adjust width and height to account for margins
  var innerWidthAltitude = widthAltitude - marginAltitude.left - marginAltitude.right;
  var innerHeightAltitude = heightAltitude - marginAltitude.top - marginAltitude.bottom;

  // X scale using d3.scaleTime for time-based X-axis
  var xAltitude = d3.scaleTime()
    .domain([nowAltitude, nowAltitude])  // Initialize the domain with the current time
    .range([0, innerWidthAltitude]);

  // Y scale for altitude data
  var yAltitude = d3.scaleLinear()
    .domain([0, 1000])  // Example Y domain
    .range([innerHeightAltitude, 0]);

  // Create an SVG container with margins
  var svgAltitude = d3.select("#altitude-container")
    .append("svg")
    .attr("width", widthAltitude)
    .attr("height", heightAltitude)
    .append("g")
    .attr("transform", `translate(${marginAltitude.left}, ${marginAltitude.top})`);

  // Line generator
  var lineAltitude = d3.line()
    .x((d, i) => xAltitude(altitudeTimes[i]))  // Use time for the X value
    .y(d => yAltitude(d));  // Altitude for the Y value

  // Append the line to the SVG
  var pathAltitude = svgAltitude.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3.5);

  // Add X-axis with time labels
  var altitudeXAxis = svgAltitude.append("g")
    .attr("transform", `translate(0, ${innerHeightAltitude})`)
    .call(d3.axisBottom(xAltitude).ticks(5));

  // Add Y-axis with altitude values
  var altitudeYAxis = svgAltitude.append("g")
    .call(d3.axisLeft(yAltitude).ticks(4));

  // Rotate X-axis tick labels for better readability
  altitudeXAxis.selectAll("text")
    .attr("transform", "rotate(-45)")  // Rotate the tick labels
    .style("text-anchor", "end");      // Align the text to the end of the tick

  // Adding axis labels
  svgAltitude.append("text")
    .attr("x", innerWidthAltitude / 2)
    .attr("y", innerHeightAltitude + marginAltitude.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("fill", altitudeColor)
    .text("Time");

  svgAltitude.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeightAltitude / 2)
    .attr("y", -marginAltitude.left + 20)
    .attr("text-anchor", "middle")
    .attr("fill", altitudeColor)
    .text("Altitude (m)");

  // Update function for graph
  function updateAltitude(altitudeData) {
    // Update X domain with the time range
    xAltitude.domain([firstDataTimeAltitude, d3.max(altitudeTimes)]);  // Update the X domain with new time range
    yAltitude.domain([0, d3.max(altitudeData) + 10]);  // Update Y domain with new altitude data

    // Update the line
    pathAltitude.datum(altitudeData).attr("d", lineAltitude);

    // Update X-axis and rotate the labels again
    altitudeXAxis.call(d3.axisBottom(xAltitude)
      .ticks(5)
      .tickFormat(d => d.toLocaleTimeString([], { // Change the format of the x axis labels
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // Ensure 24-hour format
      }))
    );
    altitudeXAxis.selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Updating the color of the labels 
    altitudeXAxis.selectAll("text").attr("fill", altitudeColor);
    altitudeXAxis.selectAll("line").attr("stroke", altitudeColor);
  }

  // Add new data point with time and altitude when user clicks
  function graphAltitude(event) {
    nowAltitude = new Date();
    altitudeData.push(1000 - event.clientY);  // Add new altitude value
    altitudeTimes.push(nowAltitude);  // Push the new Date object

    // Set the time of the first data point
    if (!firstDataTimeAltitude) {
      firstDataTimeAltitude = nowAltitude;
      xAltitude.domain([firstDataTimeAltitude, firstDataTimeAltitude]); // Initialize the x domain with the first point
    }

    updateAltitude(altitudeData);  // Update graph with new data
  }

  document.addEventListener("click", graphAltitude);

  // Color change logic
  setInterval(altitudeChangeColorMaybe, 20);

  // Actually running the chart
  window.updateAltitudeInterval = setInterval(updateAltitude, 20, altitudeData);
})();
