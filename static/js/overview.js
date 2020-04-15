



var parseDate = d3.timeParse("%d/%m/%Y");


var chartTime = timeSeriesChart()
  .width(650)
  .height(250)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});


d3.json("/getNom",
  function (err, data) {
    console.log("error:",err)


  // This function is applied to each row of the dataset
    d.date = parseDate(d.date);
    d.day = d.date.getDay();
    d.month = d.date.getMonth();
    return d;
  },
  function (err, data) {
    if (err) throw err;


  var csData = crossfilter(data);

  // // We create dimensions for each attribute we want to filter by
  csData.dimDate = csData.dimension(function (d) { return d.date; });
  csData.dimDays = csData.dimension(function (d) { return d.day; });
  csData.dimMonths = csData.dimension(function (d) { return d.month; });

  // // We bin each dimension
  csData.Dates = csData.dimDate.group().reduceSum(function(d) {return d.hours});
  csData.Days = csData.dimDays.group();
  csData.Months = csData.dimMonths.group();
  var reducer = reductio().avg(function(d) { return +d.hours; });
  reducer(csData.Days);
  reducer(csData.Months);

  // console.log(data.map(function(d) {return d}))
  // console.log(csData.Months.all())

  chartTime.onBrushed(function (selected) {
      csData.dimDate.filter(selected);
      update();
    });


  function update() {
  d3.select("#overview")
      .datum(csData.Dates.all())
      .call(chartTime);

  barChartWeekDays.xAxesTicks(function(d,i){
    var week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    return week[d]
  })

  // d3.select("#weekDayChart")
  //       .datum(csData.Days.all())
  //       .call(barChartWeekDays);

  // barChartMonths.xAxesTicks(function(d,i){
  //   var month = ["Jan", "Feb"];
  //   return month[d]
  // })

  // d3.select("#monthsChart")
  //       .datum(csData.Months.all())
  //       .call(barChartMonths);
  // }

  update()

})





