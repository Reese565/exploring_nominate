

var width = 900,
    height = 450;

var chartTime = timeSeriesChart()
  .width(width)
  .height(height)
  .domain([-1,1])



d3.select("#selectButton")
  .on("change", function() {
    var state = d3.select(this).property("value")
    console.log("Selected", state)

    updateChart(state)
  })


function updateChart(state) {

  d3.select(".overviewSVG").remove()

  d3.json("/getOv/" + state,
    function (err, data) {
      if (err) throw err;

      // console.log(data)

      d3.select("#overviewChart")
          .datum(data)
          .call(chartTime);


      let markers = d3.selectAll(".markers")

      pulse(markers);

      function pulse(markers) {
          (function repeat() {
             markers
              .transition()
              .duration(500)
              .attr('stroke-opacity', 0)
              .attr("stroke-width", 0)
              .transition()
              .duration(250)
              .attr("stroke-width", 0)
              .attr('stroke-opacity', 0.30)
              .duration(500)
              .attr("stroke-width", 0)
              .attr('stroke-opacity', 0.25)
              .transition()
              .duration(1000)
              .attr("stroke-width", 70)
              .attr('stroke-opacity', 0.01)
              .transition()
              .duration(250)
              .attr('stroke-opacity', 0)
              .ease(d3.easeSin)
              .on("end", repeat);
          })();
       }

  })
}

updateChart("All")





