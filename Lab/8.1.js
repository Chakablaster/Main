// Main function to create the chart
function init() {

    // Define margins and dimensions for the chart area
    var width = 700;
    var height = 400;

    var projection = d3.geoMercator()
                       .center([145, -36.5])
                       .translate([width / 2, height / 2])
                       .scale(7000);

    // Path setup
    var path = d3.geoPath()
                 .projection(projection);

    var svg = d3.select("#chart-container8")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "grey");

    // Load the json file from the external URL
    d3.json("https://raw.githubusercontent.com/Chakablaster/Main/refs/heads/main/Lab/LGA_VIC.json").then(function(json) {

        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path);
    });
}

// Initialize the chart when the window loads
window.onload = init;
