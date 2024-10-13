

// Main function to create the chart
function init() {
    // Data for the chart: Array of objects representing counts of fruits
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    // Define margins and dimensions for the chart area
    var margin = { top: 50, right: 100, bottom: 50, left: 100 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Create the SVG canvas and apply the margin
    var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create X-scale: Position bars evenly across the width
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length)) // Domain: Number of data points (days)
        .range([0, width])                // Range: Total width of the chart
        .padding(0.1);                    // Add space between bars

    // Create Y-scale: Scale based on the maximum stacked value
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d.apples + d.oranges + d.grapes; // Max sum of fruit counts
        })])
        .range([height, 0]); // Y-axis starts from the bottom

    // Stack the data: Group data for apples, oranges, and grapes
    var series = d3.stack()
        .keys(["apples", "oranges", "grapes"])(dataset); // Stack by fruit types

    // Define a color scale for the fruit categories
    var color = d3.scaleOrdinal()
        .domain(["apples", "oranges", "grapes"]) // Match keys to colors
        .range(["#4caf50", "#ff9800", "#2196f3"]); // Green, orange, blue

    // Create groups for each fruit type
    var groups = svg.selectAll(".group")
        .data(series) // Bind series data to the groups
        .enter().append("g")
        .attr("class", "group")
        .style("fill", function(d, i) { return color(i); }); // Assign colors

    // Draw the bars for each fruit type within the groups
    groups.selectAll("rect")
        .data(function(d) { return d; }) // Bind individual fruit data
        .enter().append("rect")
        .attr("x", function(d, i) { return xScale(i); }) // Position on X-axis
        .attr("y", function(d) { return yScale(d[1]); }) // Top of the bar
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); }) // Bar height
        .attr("width", xScale.bandwidth()) // Bar width
        .on("mouseover", function(event, d) { // Show tooltip on hover
            tooltip.style("visibility", "visible")
                .text("Value: " + (d[1] - d[0])); // Display segment value
        })
        .on("mousemove", function(event) { // Position the tooltip dynamically
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() { // Hide tooltip on mouse out
            tooltip.style("visibility", "hidden");
        });

    // Add X-axis with labels for days
    svg.append("g")
        .attr("transform", "translate(0," + height + ")") // Position at the bottom
        .call(d3.axisBottom(xScale).tickFormat(function(d, i) {
            return "Day " + (i + 1); // Format labels as "Day 1", "Day 2", etc.
        }));

    // Add Y-axis with numerical values
    svg.append("g")
        .call(d3.axisLeft(yScale)); // Align it on the left side

    // Add X-axis label
    svg.append("text")
        .attr("x", width / 2) // Center horizontally
        .attr("y", height + margin.bottom - 10) // Position below the X-axis
        .style("text-anchor", "middle") // Center text alignment
        .style("font-weight", "bold") // Make text bold
        .style("fill", "#f5f5f5") // Light text color
        .text("Days"); // Label text

    // Add Y-axis label
    svg.append("text")
        .attr("x", -height / 2) // Center vertically (after rotation)
        .attr("y", -margin.left + 50) // Position left of Y-axis
        .attr("transform", "rotate(-90)") // Rotate text to be vertical
        .style("text-anchor", "middle") // Center text alignment
        .style("font-weight", "bold") // Make text bold
        .style("fill", "#f5f5f5") // Light text color
        .text("Fruit Count"); // Label text

    // Add a legend for the fruit categories
    var legend = svg.selectAll(".legend")
        .data(["apples", "oranges", "grapes"]) // Directly bind fruit names
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + (i * 20) + ")";
        });

    // Draw colored rectangles for the legend
    legend.append("rect")
        .attr("x", width + 5) // Adjust to the right of the chart
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); }); // Apply correct color

    // Add text labels for the legend
    legend.append("text")
        .attr("x", width + 25) // Adjust position next to rectangle
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "start")
        .style("font-weight", "bold")
        .style("fill", "#f5f5f5") // Set the text color
        .text(function(d) { return d; }); // Display fruit name


    // Create a tooltip for hover interactions
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip") // Assign CSS class
        .style("position", "absolute") // Position it absolutely
        .style("visibility", "hidden") // Initially hide it
        .style("background", "#fff") // White background
        .style("border", "1px solid #ccc") // Light gray border
        .style("padding", "5px") // Padding inside the tooltip
        .style("border-radius", "4px") // Rounded corners
        .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)"); // Subtle shadow
}

// Initialize the chart when the window loads
window.onload = init;