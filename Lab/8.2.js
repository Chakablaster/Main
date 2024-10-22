function init() {
    var width = 800;
    var height = 500;

    // Create a SVG canvas
    var svg = d3.select("#chart-container82")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Define the color scale
    var color = d3.scaleQuantize()
                  .range(["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    // Define the map projection
    var projection = d3.geoMercator()
                       .center([145, -37]) // Set the center of the projection to be in Victoria
                       .translate([width / 2, height / 2])
                       .scale(5500); // Scale to adjust the map to fit the size of the SVG canvas

    // Define path generator
    var path = d3.geoPath()
                 .projection(projection);

    // Load both data sources
    Promise.all([
        d3.json("LGA_VIC.json"),
        d3.csv("VIC_LGA_unemployment.csv"),
        d3.csv("VIC_city.csv")
    ]).then(function([json, unemploymentData, cityData]) {
        // Map unemployment data to LGA names
        var unemploymentMap = {};
        unemploymentData.forEach(function(d) {
            unemploymentMap[d.LGA] = +d.unemployed;
        });

        // Set the color domain
        color.domain([
            d3.min(unemploymentData, d => d.unemployed),
            d3.max(unemploymentData, d => d.unemployed)
        ]);

        // Merge the unemployment data with the GeoJSON
        json.features.forEach(function(d) {
            d.properties.unemployed = unemploymentMap[d.properties.LGA_name] || 0;
        });

        // Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("fill", d => color(d.properties.unemployed));

        // Create a tooltip for hover interactions
        var tooltip = d3.select("body") // Append to body for flexibility
            .append("div")
            .attr("class", "tooltip") // Assign CSS class
            .style("position", "absolute") // Absolute positioning
            .style("visibility", "hidden") // Initially hidden
            .style("background", "#fff") // Set background color
            .style("border", "1px solid #ccc") // Set border style
            .style("padding", "5px") // Set padding
            .style("border-radius", "4px") // Rounded corners
            .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)"); // Shadow for aesthetics

        // Add city markers and tooltip interactions
        svg.selectAll("circle")
            .data(cityData)
            .enter()
            .append("circle")
            .attr("cx", d => projection([+d.lon, +d.lat])[0]) // Position circles based on longitude
            .attr("cy", d => projection([+d.lon, +d.lat])[1]) // Position circles based on latitude
            .attr("r", "5px") // Set the radius of the city markers
            .attr("fill", "red") // Set the color of the city markers
            .on("mouseover", function(event, d) { // Mouseover event to show tooltip
                tooltip.html(`City: ${d.place}`) // Use the correct field name from your data
                    .style("visibility", "visible");
            })
            .on("mousemove", function(event) { // Mousemove to position tooltip
                tooltip.style("top", (event.pageY - 10) + "px") // Adjust Y position
                    .style("left", (event.pageX + 10) + "px"); // Adjust X position
            })
            .on("mouseout", function() { // Mouseout event to hide tooltip
                tooltip.style("visibility", "hidden"); // Hide tooltip when mouse leaves
            });
    });
}

// Load the visualization once the window is ready
window.onload = init;
