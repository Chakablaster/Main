window.onload = function () {
    // Initial setup
    var w = 550;
    var h = 350;
    var barPadding = 0.2;
    var maxValue = 30; // Adjusted for better visibility
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

    // X scale
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(barPadding);

    // Y scale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h, 0]);

    // Function to update bars
    function updateBars() {
        // Bind data to the rect elements
        var bars = svg.selectAll("rect")
            .data(dataset, (d, i) => i);  // Use index as key for stable updates

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => h - yScale(d))
            // Remove any fill attribute, so the CSS can control the color
            .on("mouseover", function (event, d) {
                // Add text inside the bar at the top position
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 15;

                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "16px")
                    .attr("font-family", "sans-serif")
                    .attr("fill", "black")
                    .attr("font-weight", "bold")  // Make the text bold
                    .text(d);  // Show the data value inside the bar
            })
            .on("mouseout", function () {
                d3.select("#tooltip").remove();
            })
            .merge(bars) // Merge with the existing bars
            .transition()
            .duration(500)
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => h - yScale(d));

        // Remove exiting bars
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w)
            .remove();
    }

    // Initial bar creation
    updateBars();

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

    // Event listener to add data
    d3.select("#addDataButton").on("click", function () {
        // Generate a new random number and add to the dataset
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);

        // Update the xScale domain
        xScale.domain(d3.range(dataset.length));

        // Update bars and axes
        updateBars();
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    });

    // Event listener to remove data
    d3.select("#removeDataButton").on("click", function () {
        // Remove the first element of the dataset
        dataset.shift();

        // Update the xScale domain
        xScale.domain(d3.range(dataset.length));

        // Update bars and axes
        updateBars();
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    });
};
