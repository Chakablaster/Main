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
    var bars = svg.selectAll("rect")
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

    // Add button event listener to add new data
    d3.select("#addDataButton").on("click", function () {
        // Step 1: Generate a new random number and add to the dataset
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);

        // Step 2: Update xScale domain
        xScale.domain(d3.range(dataset.length));

        // Bind data to bars
        var bars = svg.selectAll("rect")
            .data(dataset);

        // Step 3: Enter new bars, set initial position, and merge with existing bars
        bars.enter()
            .append("rect")
            .attr("x", w)  // Start off-screen to the right
            .attr("y", function(d) {
                return h - yScale(d);  // Set the y position
            })
            .attr("width", xScale.bandwidth())  // Set the width
            .attr("height", function(d) {
                return yScale(d);  // Set the height
            })
            .attr("fill", "var(--bar-color)")  // Set the same color as existing bars
            .merge(bars)  // Merge new and existing bars
            .transition()  // Smooth the transition
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);  // Move to final x position
            })
            .attr("y", function(d) {
                return h - yScale(d);  // Update y position
            });

        // Update the x-axis
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    });

    // Add button event listener to remove data
    d3.select("#removeDataButton").on("click", function () {
        // Step 4: Remove the first data point using shift()
        dataset.shift();

        // Update xScale domain
        xScale.domain(d3.range(dataset.length));

        // Bind data to bars
        var bars = svg.selectAll("rect")
            .data(dataset);

        // Step 5: Exit and remove old bars
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w)  // Slide out to the right
            .remove();  // Remove the element from the DOM

        // Update and merge existing bars
        bars.enter()
            .append("rect")
            .merge(bars)  // Merge new and existing bars
            .transition()
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return yScale(d);
            })
            .attr("fill", "var(--bar-color)");  // Ensure color consistency

        // Update the x-axis
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    });
};
