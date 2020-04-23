


var w = 650,
    h = 450
    m = {top: 40, right: 50, bottom: 60, left: 70, xlab: 20};


d3.json("/getPopDensity",
  function (err, data) {
    if (err) throw err;

    var xValue = function(d){ return d.year; }
    var yValue = function(d){ return d.nominate_dim1; }

    var myChart = buildChart("#urTSChart")

    myChart.data(data)
           .width(w)
           .height(h)
           .margin(m)
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


    d3.select('.xLab')
        .append('text')
        .attr('x',margin.left + width/4 + margin.right*2)
        .attr('y',height/2 + 210)
        .style('opacity',0.65)
        .text('Year');

      d3.select('.yLab')
        .append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', -(width)/4 - margin.top*2 - 50)
        .attr('y',15)
        .style('opacity',0.65)
        .text('<- Liberal | Conservative ->');

      d3.select('.chartTitle')
        .append('text')
        .attr('x', width/4)
        .attr('y',10)
        .text('Congressional District NOMINATE Scores (1900-2012)')
        .style('opacity',0.5);

    var nested_data = d3.nest()
                        .key(function(d){return d.group})
                        .entries(data);

    var labels = [['Q1',0.25], ['Q2',0.3], ['Q3',0.05], ['Q4',-0.3]]

    gTop.selectAll('.labels')
        .data(labels)
        .enter()
        .append('text')
        .text(function(d){ return d[0]})
        .attr('x', function(d){return xScale(2012)})
        .attr('y', function(d){
          return yScale(d[1])})
        .attr('color', function(d){
          if (d[0] == 'Q2') return '#A63742'
            else if (d[0] == 'Q3') return '#BB0819'
            else if (d[0] == 'Q4') return '#646DA2'
            else return '#915A5F'
        });

    function update(){

      var line = d3.line().x(function(d){return xScale(xValue(d))}).y(function(d){return yScale(yValue(d))});

      var lines = gGeoms.selectAll(".line")
              .data(nested_data);

      lines.enter()
           .append("path")
           .attr("class", "line")
           .attr("d", function(d){ return line(d.values)})
           .style('stroke', function(d){
               if (d.key == '1') return '#A63742'
               else if (d.key == '2') return '#BB0819'
                else if (d.key == '3') return '#646DA2'
                else return '#915A5F'});

// 965E5D
// C20500
// B71F1B
// D80600
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


