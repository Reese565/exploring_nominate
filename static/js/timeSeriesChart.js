/* global d3 */
function timeSeriesChart() {
  var margin = {top: 20, right: 10, bottom: 60, left: 70, xlab: 10},
    width = 650,
    height = 400,
    xValue = function(d) { return d.year; },
    yValues = null,
    yValue = function(d){return d.party_mu;},
    xScale = d3.scaleLinear().range([margin.left, width - margin.right]),
    yScale = d3.scaleLinear().range([height - margin.bottom,margin.top]),
    domain = [0,1];
    onBrushed = function () {};
    // gridlines in y axis function
    make_y_gridlines = function() {   
    return d3.axisLeft(yScale)
        .ticks(8)
  }
  var svg = null,
      svgEnter = null,
      gEnter = null,
      g = null;

  function chart(selection) {
    selection.each(function(data) {
      
      // Update the x-scale
      var extent = d3.extent(data, function(d) { return xValue(d); });

      xScale.domain([extent[0] - 1, extent[1] + 1]);

      // Update the y-scale
      yScale.domain(domain);

      // Select the svg element, if it exists.
      svg = d3.select(this).selectAll(".overviewSVG").data([data]);

      // Otherwise, create the skeletal chart.
      svgEnter = svg.enter().append("svg").attr('class','overviewSVG');
      gEnter = svgEnter.append("g");
      
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");
      gEnter.append("g").attr("class", "grid");
      gEnter.append("g").attr("class", "title");
      gEnter.append("g").attr("class", "xLab");
      gEnter.append("g").attr("class", "yLab");
      // gEnter.append("g").attr("class", "markers");
      // gEnter.append("g").attr("class", "points");


      gEnter.append("g").attr("class", "zero")
            .append('line')
            .attr('x1',xScale(1950))
            .attr('y1',yScale(0))
            .attr('x2',xScale(2020))
            .attr('y2',yScale(0))
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

      gEnter.selectAll('.markers')
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


      // Update the outer dimensions.
      svg.merge(svgEnter).attr("width", width)
          .attr("height", height);

      var nested_data = d3.nest()
                          .key(function(d){return d.party_code})
                          .entries(data);
      

      // Update the inner dimensions.
      g = svg.merge(svgEnter).select("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      gEnter.selectAll('.points')
            .enter()
            .data(data)
            .enter()
            .append('circle')
            .attr("class","point")
            .attr('r', 1)
            .attr('cx', function(d){ 
              if (Math.random() > .5) return xScale(d.year + Math.random()/2)
                else return xScale(d.year - Math.random()/2)})
            .attr('cy', function(d){ return yScale(d.nominate_dim1)})
            .style('fill','none')
            .style('stroke', function(d) { 
              if (d.party_code == '200') return '#CF5656'
                else return '#5B70A3'});

      var partyMu = function(d){return d.party_mu;};
      var line = d3.line().x(X).y(function(d){return yScale(partyMu(d))});


      gEnter.selectAll(".line")
            .data(nested_data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", function(d){ return line(d.values)})
            .style('stroke', function(d){
              if(d.key == '200') return '#CF5656'
                else return '#5B70A3'
            });

      let yAxis = d3.axisLeft(yScale);
      let xAxis = d3.axisBottom(xScale)
        .tickSize(6, 0)
        .tickFormat(d3.format("d"));


      // Update the x-axis.
      g.select(".y.axis")
       .attr("transform", "translate(" + (xScale.range()[0] - 1) + ",0)")
       .style('stroke-opacity',0.30)
       .call(yAxis);
      
      // Update the x-axis.
      g.select(".x.axis")
       .attr("transform", "translate(0," + (yScale.range()[0]) + ")")
       .style('stroke-opacity',0.30)
       .call(xAxis);

      g.selectAll('.tick')
       .style('opacity',0.65);


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

      d3.select('.title')
        .append('text')
        .attr('x', width/4)
        .attr('y',0)
        .text('Party NOMINATE Scores (1950-2019)')
        .style('opacity',0.5);
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.yGridLines = function(_) {
    // add the Y gridlines
      g.select(".grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
    return chart;
  };

  chart.domain = function(values){
    if (!arguments.length) return domain;
    domain = values;
    return chart;
  };


  return chart;
}


