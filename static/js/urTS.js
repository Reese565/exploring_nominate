


var width = 900,
    height = 450;

d3.json("/getPopDensity",
  function (err, data) {
    if (err) throw err;

    var xValue = function(d){ return d.year; }
    var yValue = function(d){ return d.nominate_dim1; }

    var myChart = buildChart("#urTSChart")

    myChart.data(data)
           .width(width)
           .height(height)
           .x(function(d) { return xValue(d) })
           .y(function(d) { return yValue(d) })
           .build()


    var xScale = myChart.xScaler();
    var yScale = myChart.yScaler()

    var gTop = d3.select("#urTSChart")
                  .selectAll(".gTop")

    var gGeoms = gTop.selectAll(".geoms")

    gTop.append("g").attr("class", "zero")
            .append('line')
            .attr('x1',xScale(1901))
            .attr('y1',yScale(0))
            .attr('x2',xScale(2012))
            .attr('y2',yScale(0))
            .style('stroke','black')
            .style('opacity',0.6);

    var nested_data = d3.nest()
                        .key(function(d){return d.group})
                        .entries(data);
    
    console.log(nested_data)


    function update(){

      var line = d3.line().x(function(d){return xScale(xValue(d))}).y(function(d){return yScale(yValue(d))});

      gGeoms.data(nested_data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", function(d){ return line(d.values)})
            .style('stroke', function(d){
                if (d.key == '1') return 'red'
                else if (d.key == '2') return 'orange'
                else if (d.key == '3') return 'yellow'
                else return 'blue'});


      // var q1Value = function(d){ return d.nom_quant_1};
      // var q2Value = function(d){ return d.nom_quant_2};
      // var q3Value = function(d){ return d.nom_quant_3};
      // var q4Value = function(d){ return d.nom_quant_4};

      // var q1_data = data.map(function(d, i) {return [xValue.call(data, d, i), q1Value.call(data, d, i)];});
      // var q2_data = data.map(function(d, i) {return [xValue.call(data, d, i), q2Value.call(data, d, i)];});
      // var q3_data = data.map(function(d, i) {return [xValue.call(data, d, i), q3Value.call(data, d, i)];});
      // var q4_data = data.map(function(d, i) {return [xValue.call(data, d, i), q4Value.call(data, d, i)];});

        
      // var q1_line = d3.line().x(function(d){ return xScale(d[0])}).y(function(d){return yScale(d[1])});
      // var q2_line = d3.line().x(function(d){ return xScale(d[0])}).y(function(d){return yScale(d[1])});
      // var q3_line = d3.line().x(function(d){ return xScale(d[0])}).y(function(d){return yScale(d[1])});
      // var q4_line = d3.line().x(function(d){ return xScale(d[0])}).y(function(d){return yScale(d[1])});
      // // console.log(q1_data)

      
      // gLines.append("path")
      //   .attr("class", "line")
      //   .attr("d", q1_line(q1_data))
      //   .style("stroke",'black');

      // gLines.append("path")
      //   .attr("class", "line")
      //   .attr("d", q2_line(q2_data))
      //   .style("stroke",'black');

      // gLines.append("path")
      //   .attr("class", "line")
      //   .attr("d", q3_line(q3_data))
      //   .style("stroke",'black');

      // gLines.append("path")
      //   .attr("class", "line")
      //   .attr("d", q4_line(q4_data))
      //   .style("stroke",'black');

  }

  update()

})


