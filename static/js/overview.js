

var width = 900,
    height = 450;

var chartTime = timeSeriesChart()
  .width(width)
  .height(height)
  .domain([-1,1])


d3.json("/getOv",
  function (err, data) {
    if (err) throw err;

    function update() {
      d3.select("#overviewChart")
          .datum(data)
          .call(chartTime);

    }

  update()

})





