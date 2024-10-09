function init() {
    // Set up the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 50, left: 100},
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // Load the CSV data
    d3.csv("Unemployment_78-95.csv").then(function(data) {
        console.log(data);  // For debugging: print the loaded data to the console

        // Format the data
        data.forEach(function(d) {
            d.date = parseTime(d.year + "-" + d.month);
            d.number = +d.number;
        });

        // Set up the x and y scales
        var xScale = d3.scaleTime()
            .domain([
                d3.min(data, function(d) { return d.date; }),
                d3.max(data, function(d) { return d.date; })
            ])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.number; })])
            .range([height, 0]);

        // Add the x-axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale).ticks(10));

        // Add the y-axis
        svg.append("g")
          .call(d3.axisLeft(yScale));

        // Define the line
        var line = d3.line()
          .x(function(d) { return xScale(d.date); })
          .y(function(d) { return yScale(d.number); });

        // Add the line path
        svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        // Define the area
        var area = d3.area()
          .x(function(d) { return xScale(d.date); })
          .y0(yScale(0))  // Base of the area (0 on y-axis)
          .y1(function(d) { return yScale(d.number); });

        // Add the area path
        svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

        // Add a horizontal line for half a million unemployed
        svg.append("line")
          .attr("class", "halfMilMark")
          .attr("x1", 0)
          .attr("y1", yScale(500000))
          .attr("x2", width)
          .attr("y2", yScale(500000));

        // Add a label for the horizontal line
        svg.append("text")
          .attr("class", "halfMilLabel")
          .attr("x", 10)
          .attr("y", yScale(500000) - 7)
          .text("Half a million unemployed");

    }).catch(function(error) {
        console.error("Error loading the data:", error);
    });
}

// Initialize the chart when the window loads
window.onload = init;
