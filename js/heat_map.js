var chartSvg,
  ratio = 700 / 735;

$( document ).ready(function() {
  var margin = { top: 45, right: 0, bottom: 45, left: 45 },
    viewBoxWidth= 700 - margin.left - margin.right,
    viewBoxHeight = 735 - margin.top - margin.bottom,
    chartWidth = $("#svg-container").width();
    chartHeight = chartWidth * ratio;
    gridSize = 30,
    colors = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    bins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  d3.csv('/d3_heat_map/data/heat_map.csv', function(data) {
    data.forEach(function(d){
      d.mlr_score = +d.mlr_score;
      d.logistic_score = +d.logistic_score;
      d.reading = +d.reading;
      return d;
    });

    var colorScale = d3.scale.quantile()
      .domain([0, colors.length - 1, d3.max(data, function (d) { return d.reading; })])
        .range(colors);
           
    chartSvg = d3.select("#svg-container").append("svg")
      .attr("viewBox", "0 0 " + (viewBoxWidth + margin.left + margin.right) + " " + (viewBoxHeight + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    var g = chartSvg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var yAxisLabel = chartSvg.append("text") 
        .attr("x", 350)
        .attr("y",  15)
        .style("text-anchor", "middle")
        .text("Logistic score (bin)")
        .attr("class", "axis-label");

    var yTicks = g.selectAll(".yLabel")
      .data(bins)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

    var xAxisLabel = chartSvg.append("text") 
        .attr("transform", "rotate(-90)")
        .attr("x", -415)
        .attr("y", 10)
        .text("MLR score (bin)")
        .attr("class", "axis-label")

    var xTicks = g.selectAll(".xLabel")
      .data(bins)
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)");

    var heatMap = g.selectAll(".reading")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) { return d.logistic_score * gridSize/5; })
      .attr("y", function(d) { return d.mlr_score * gridSize/5; })
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", colors[0]);

    heatMap.append("title")
      .text(function(d) { return d.reading; });
        
    heatMap.transition().duration(1000)
      .style("fill", function(d) { return colorScale(d.reading); });

    var legend = chartSvg.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), function(d) { return d; })
      .enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return gridSize * 2 * i + 85; })
      .attr("y", viewBoxHeight + 50)
      .attr("width", gridSize * 2)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return gridSize * 2 * i + 115; })
      .attr("y", viewBoxHeight + 80)
      .style("text-anchor", "middle");

  });

});

//resize function
$(window).resize(function() {
  var chartWidth = $("#svg-container").width();
  chartSvg.attr("width", chartWidth);
  chartSvg.attr("height", chartWidth * ratio);
});
