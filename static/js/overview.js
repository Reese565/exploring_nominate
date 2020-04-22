

var width = 900,
    height = 450;

var allStates = "All"

var myChart = null;


d3.json("/getOv/" + allStates,
  function (err, data) {
    if (err) throw err;

    var xValue = function(d) { return d.year; };
    var yValue = function(d) { return d.party_mu; };

    myChart = buildChart("#overviewChart")

    myChart.data(data)
           .width(width)
           .height(height)
           .x(function(d) { return xValue(d) })
           .y(function(d) { return yValue(d) })
           .xDomain([1950,2020])
           .yDomain([-1,1])
           .build()


    var xScale = myChart.xScaler();
    var yScale = myChart.yScaler();

    var gTop = d3.select("#overviewChart")
                  .selectAll(".gTop")

    var gGeoms = gTop.selectAll(".geoms")

    gTop.append("g").attr("class", "zero")
            .append('line')
            .attr('x1',xScale(1950))
            .attr('y1',yScale(0))
            .attr('x2',xScale(2020))
            .attr('y2',yScale(0))
            .style('stroke','black')
            .style('opacity',0.6);


    var history = [{"year":1950,
                      "pres": "President Summin",
                      "text":"This is Text for 1950 <br/> Look I can do more studd here."},
                     {"year":1970,
                      "pres": "President Summin",
                      "text":"This is Text for 1970 <br/> Look I can do more studd here."},
                      {"year":1976,
                      "pres": "President Summin",
                      "text":"This is Text for 1976 <br/> Look I can do more studd here."},
                     {"year":1994,
                      "pres":"Another Pres",
                      "text":"The 1994 inflection point in this series coincides precisely with the Republican takeover of Congress led by Newt Gingrich, under a platform called the Contract with America. This election is widely considered a watershed moment in political marketing, with consultants such as Frank Luntz applying novel techniques to identify effective language and disseminate it to candidates"},
                     {"year":2008,
                     "text":"This is Text for 2008"},
                     {"year":2016,
                      "pres": "Pressi McPres",
                      "text":"This is Text for 2016"}];

      var clickHistory = function(d,i){
              var year = d.year
              var hist = d.text
              var pres = d.pres
              var info = d3.select('#info')
              info.select("#president")
                  .text(d.pres);
              info.select("#history")
                  .text(hist);
              info.select("#change")
                  .text('-19833');
            }

      gTop.selectAll('.markers')
            .attr('class','markers')
            .data(history)
            .enter()
            .append('circle')
            .attr("class", "markers")
            .attr('cx',function(d){return xScale(d.year)})
            .attr('cy',yScale(-1))
            .attr('r',5)
            .style('stroke','#FF8406')
            .style('fill','#EE8D2B')
            .style('opcaity',1)
            .on('click', clickHistory);

    d3.select('.xLab')
        .append('text')
        .attr('x',margin.left + width/4 + margin.right*2 + 15)
        .attr('y',height/2 + 155)
        .style('opacity',0.65)
        .text('Year');

      d3.select('.yLab')
        .append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', -(width)/4 - margin.top*2 - 15)
        .attr('y',15)
        .style('opacity',0.65)
        .text('<- Liberal | Conservative ->');

      d3.select('.chartTitle')
        .append('text')
        .attr('x', width/4)
        .attr('y',10)
        .text('Party NOMINATE Scores (1950-2019)')
        .style('opacity',0.5);

      


    function update(state){
      d3.json("/getOv/" + state,
        function (err, data) {
          if (err) throw err;
          // add Democratic points
          var points = gGeoms.selectAll('.point')
                .data(data);


          points.enter()
                .append('circle')
                .merge(points)
                .attr("class",function(d){
                  if (d.party_code == '100') return "point demGeo"
                    else return "point gopGeo"})
                .attr('opacity',1)
                .attr('r', 1)
                .attr('cx', function(d){ 
                  if (Math.random() > .5) return xScale(d.year + Math.random()/2)
                    else return xScale(d.year - Math.random()/2)})
                .attr('cy', function(d){ return yScale(d.nominate_dim1)})
                .style('fill','none')
                .style('stroke', function(d) { 
                  if (d.party_code == '200') return '#CF5656'
                    else return '#5B70A3'});

          points.exit()
                .transition()
                .duration(500)
                .attr('opacity',0)
                .remove()

          var nested_data = d3.nest()
                    .key(function(d){return d.party_code})
                    .entries(data);

          var line = d3.line().x(function(d){return xScale(xValue(d))}).y(function(d){return yScale(yValue(d))});

          var lines = gGeoms.selectAll(".line")
                  .data(nested_data);

          lines.enter()
                .append("path")
                .merge(lines)
                .attr("class", function(d){ return "line"})
                .attr("d", function(d) { return line(d.values)})
                .style('stroke', function(d){
                  if (d.key == '100') return '#5B70A3'
                    else return '#CF5656'});
      })
    }


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

    update(allStates)

    d3.select("#stateFilter")
      .on("change", function() {
        var state = d3.select(this).property("value")
        console.log("Selected", state)

        update(state)
      })

    d3.select("#showDems")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        console.log(state)
        if (state == true){
          d3.selectAll(".demGeo")
        .attr("opacity", 1)
        }
        else {
          d3.selectAll(".demGeo")
        .attr("opacity", 0)
        }
      })

    d3.select("#showGOP")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        console.log(state)
        if (state == true){
          d3.selectAll(".gopGeo")
        .attr("opacity", 1)
        }
        else {
          d3.selectAll(".gopGeo")
        .attr("opacity", 0)
        }
      })

})


