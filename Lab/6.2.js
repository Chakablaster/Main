window.onload = function () {
    // Initial setup
    var w = 550;
    var h = 350;
    var barPadding = 0.2;
    var maxValue = 30;
    var padding = 40;
    var sortAscending = true;  // To toggle between ascending and descending sort

    // Create SVG element
    var svg1 = d3.select("#chart-container")
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
        var bars = svg1.selectAll("rect")
            .data(dataset, (d, i) => i);

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => h - yScale(d))
            .attr("fill", "var(--bar-color)")
            .on("mouseover", function (event, d) {
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 15;

                svg1.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "16px")
                    .attr("font-family", "sans-serif")
                    .attr("fill", "black")
                    .attr("font-weight", "bold")
                    .text(d);
            })
            .on("mouseout", function () {
                d3.select("#tooltip").remove();
            })
            .merge(bars)
            .transition()
            .duration(500)
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => h - yScale(d));

        // Remove exiting bars
        bars.exit().transition().duration(500).remove();
    }

    // Initial bar creation
    updateBars();

    // Add x-axis
    var xAxis = d3.axisBottom(xScale);
    svg1.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Add y-axis
    var yAxis = d3.axisLeft(yScale);
    svg1.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Function to update both bars and axes
    function updateAll() {
        // Update the xScale domain
        xScale.domain(d3.range(dataset.length));

        // Update bars and axes
        updateBars();
        svg1.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    }

    // Event listener to add data (random value)
    d3.select("#addDataButton").on("click", function () {
        var newNumber = Math.floor(Math.random() * maxValue);  // Add random number
        dataset.push(newNumber);  // Append the new random number to the dataset

        // No sorting here, just add the new number
        updateAll();  // Update bars and axes after adding data
    });

    // Event listener to remove data
    d3.select("#removeDataButton").on("click", function () {
        dataset.shift();  // Remove the first element of the dataset

        updateAll();  // Update bars and axes after removing data
    });

    // Event listener for the sort button
    d3.select("#sortDataButton").on("click", function () {
        // Toggle between ascending and descending sort
        sortAscending = !sortAscending;

        // Sort the dataset based on the selected sort order
        dataset.sort(sortAscending ? d3.ascending : d3.descending);

        // Re-assign xScale domain
        xScale.domain(d3.range(dataset.length));

        // Update the position of the bars based on the sorted data
        svg1.selectAll("rect")
            .sort(function (a, b) {
                return sortAscending ? d3.ascending(a, b) : d3.descending(a, b);
            })
            .transition()
            .duration(1000)
            .attr("x", (d, i) => xScale(i));

        // Update the x-axis
        svg1.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    });
};
