window.onload = function () {
    // Initial setup
    var w = 550;
    var h = 350;
    var barPadding = 0.2;
    var maxValue = 25; // Max value for random data generation
    var padding = 40;  // For axis labels

    // Create SVG element
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", w + padding * 2)
        .attr("height", h + padding * 2)
        .append("g")
        .attr("transform", `translate(${padding},${padding})`);

    // Initial dataset
    var dataset = d3.range(10).map(() => Math.floor(Math.random() * maxValue));

    // X scale (ordinal scale with scaleBand)
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))  // Generate range based on the dataset length
        .rangeRound([0, w])  // Set the range based on the width of the svg
        .paddingInner(barPadding);  // Add padding

    // Y scale (linear scale for quantitative data)
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])  // Set domain based on the data
        .range([h, 0]);  // Invert range (higher values at the bottom)

    // Create bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))  // Use scaleBand for x positioning
        .attr("y", d => yScale(d))  // Use yScale for y positioning
        .attr("width", xScale.bandwidth())  // Set bar width based on the bandwidth
        .attr("height", d => h - yScale(d))  // Set bar height
        .attr("fill", "var(--bar-color)");  // Set color using CSS variable

    // Add x-axis
    var xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Add y-axis
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add x-axis label
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", h + padding / 1.25)  // Push label further down
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")  // Change font size
        .attr("fill", "var(--text-color)")    // Change label color using CSS variable
        .text("Categories");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", -padding / 1.5)  // Push label further left
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")  // Change font size
        .attr("fill", "var(--text-color)")    // Change label color using CSS variable
        .text("Values");

    // Add button event listener to update data
    d3.select("#updateButton").on("click", function () {
        // Generate a new random dataset
        dataset = d3.range(10).map(() => Math.floor(Math.random() * maxValue));

        // Update yScale domain
        yScale.domain([0, d3.max(dataset)]);

        // Select and update the bars
        svg.selectAll("rect")
            .data(dataset)
            .transition()
            .duration(500)
            .attr("y", d => yScale(d))
            .attr("height", d => h - yScale(d));

        // Update y-axis
        svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(yAxis);

        // Update x-axis (rebind the xScale domain)
        xScale.domain(d3.range(dataset.length));

        svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(xAxis);
    });
};
