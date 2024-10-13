// Function to initialize both the pie chart and the donut chart
function init() {
    // Set up the dimensions for the SVG canvas for both charts
    var w = 350; // Width of each chart
    var h = 350; // Height of each chart

    // Create an SVG element for the Pie Chart and center the group element
    var svgPie = d3.select("#pie-chart")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    // Create an SVG element for the Donut Chart and center the group element
    var svgDonut = d3.select("#donut-chart")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    // Define the data set for both charts (array of values)
    var data = [10, 20, 30, 40, 50];

    // Define the radius settings for the arcs
    var outerRadius = w / 2; // Radius for the outer edge of the arcs
    var innerRadiusPie = 0;  // Inner radius for the pie chart (0 for a complete pie)
    var innerRadiusDonut = 100; // Inner radius for the donut chart (non-zero to create a hole)

    // Create an arc generator for the pie chart
    var arcPie = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadiusPie);

    // Create an arc generator for the donut chart
    var arcDonut = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadiusDonut);

    // Create a pie layout to calculate start and end angles for each segment
    var pie = d3.pie();

    // Generate the segments for the pie chart and bind data to the arcs
    var pieArcs = svgPie.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw paths for each pie chart segment and apply color
    pieArcs.append("path")
        .attr("d", arcPie) // Use the arc generator for the path's "d" attribute
        .attr("fill", function(d, i) {
            // Define a color array and use modulo to cycle through colors
            var colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
            return colors[i % colors.length];
        });

    // Add labels to the pie chart segments
    pieArcs.append("text")
        .attr("transform", function(d) {
            // Position the text at the centroid (center) of each arc
            return "translate(" + arcPie.centroid(d) + ")";
        })
        .attr("text-anchor", "middle") // Center the text within each segment
        .text(function(d) {
            return d.value; // Display the value of each segment
        })
        .style("fill", "#fff") // Set text color to white for better contrast
        .style("font-size", "12px"); // Set the font size of the labels

    // Generate the segments for the donut chart and bind data to the arcs
    var donutArcs = svgDonut.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw paths for each donut chart segment and apply color
    donutArcs.append("path")
        .attr("d", arcDonut) // Use the arc generator for the path's "d" attribute
        .attr("fill", function(d, i) {
            // Define a color array and use modulo to cycle through colors
            var colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
            return colors[i % colors.length];
        });

    // Add labels to the donut chart segments
    donutArcs.append("text")
        .attr("transform", function(d) {
            // Position the text at the centroid (center) of each arc
            return "translate(" + arcDonut.centroid(d) + ")";
        })
        .attr("text-anchor", "middle") // Center the text within each segment
        .text(function(d) {
            return d.value; // Display the value of each segment
        })
        .style("fill", "#fff") // Set text color to white for better contrast
        .style("font-size", "12px"); // Set the font size of the labels
}

// Run the init function to create the charts when the page loads
window.onload = init;
