function init() {
    // Set up the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 100},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([0, width]);

        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d.number; })])
          .range([height, 0]);

        // Add the x-axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(10));

        // Add the y-axis
        svg.append("g")
          .call(d3.axisLeft(y));

        // Define the line
        var line = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.number); });

        // Add the line path
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", line);

        // Add points to the chart
        svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return x(d.date); })
          .attr("cy", function(d) { return y(d.number); })
          .attr("r", 3)
          .attr("fill", "red");

    }).catch(function(error) {
        console.error("Error loading the data:", error);
    });
}

// Initialize the chart when the window loads
window.onload = init;
