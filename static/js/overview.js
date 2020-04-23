

var w = 650,
    h = 450
    m = {top: 40, right: 15, bottom: 60, left: 70, xlab: 20};

var allStates = "All"

var myChart = null;

var data = null;


d3.json("/getOv",
  function (err, data) {
    if (err) throw err;

    data = data

    var xValue = function(d) { return d.year; };
    var yValue = function(d) { return d.party_mu; };

    myChart = buildChart("#overviewChart")

    myChart.data(data)
           .width(width)
           .height(height)
           .margin(m)
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


    // var history = [{"year":1950,
    //                   "pres": "President Summin",
    //                   "text":"This is Text for 1950 <br/> Look I can do more studd here."},
    //                  {"year":1970,
    //                   "pres": "President Summin",
    //                   "text":"This is Text for 1970 <br/> Look I can do more studd here."},
    //                   {"year":1976,
    //                   "pres": "President Summin",
    //                   "text":"This is Text for 1976 <br/> Look I can do more studd here."},
    //                  {"year":1994,
    //                   "pres":"Another Pres",
    //                   "text":"The 1994 inflection point in this series coincides precisely with the Republican takeover of Congress led by Newt Gingrich, under a platform called the Contract with America. This election is widely considered a watershed moment in political marketing, with consultants such as Frank Luntz applying novel techniques to identify effective language and disseminate it to candidates"},
    //                  {"year":2008,
    //                  "text":"This is Text for 2008"},
    //                  {"year":2016,
    //                   "pres": "Pressi McPres",
    //                   "text":"This is Text for 2016"}];

    //   var clickHistory = function(d,i){
    //           var year = d.year
    //           var hist = d.text
    //           var pres = d.pres
    //           var info = d3.select('#info')
    //           info.select("#president")
    //               .text(d.pres);
    //           info.select("#history")
    //               .text(hist);
    //           info.select("#change")
    //               .text('-19833');
    //         }

    //   gTop.selectAll('.markers')
    //         .attr('class','markers')
    //         .data(history)
    //         .enter()
    //         .append('circle')
    //         .attr("class", "markers")
    //         .attr('cx',function(d){return xScale(d.year)})
    //         .attr('cy',yScale(-1))
    //         .attr('r',5)
    //         .style('stroke','#FF8406')
    //         .style('fill','#EE8D2B')
    //         .style('opcaity',1)
    //         .on('click', clickHistory);

    d3.select('.xLab')
        .append('text')
        .attr('x',margin.left + width/4 + margin.right*2 + 65)
        .attr('y',height/2 + 190)
        .style('opacity',0.65)
        .text('Year');

      d3.select('.yLab')
        .append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', -(width)/4 - margin.top*2 - 60)
        .attr('y',15)
        .style('opacity',0.65)
        .text('<- Liberal | Conservative ->');

      d3.select('.chartTitle')
        .append('text')
        .attr('x', width/4 + 40)
        .attr('y',10)
        .text('Party NOMINATE Scores (1950-2019)')
        .style('opacity',0.5);

      
    // console.log(data)

    function update(state, component){

      state_data = data[state]

      // console.log('.'.concat(component).concat('.point'))

      // add Democratic points
      var points = gGeoms.selectAll('.'.concat(component).concat('.point'))
            .data(state_data);


      points.enter()
            .append('circle')
            .merge(points)
            .attr("class",function(d){
              if (d.party_code == '100') return component.concat(" point demGeo")
                else return component.concat(" point gopGeo")})
            .attr('opacity',function(d){

            })
            .attr('r', 1)
            .attr('cx', function(d){ 
              if (Math.random() > .5) return xScale(d.year + Math.random()/2)
                else return xScale(d.year - Math.random()/2)})
            .attr('cy', function(d){ return yScale(d.nominate_dim1)})
            .attr('opacity', function(d){
              var state = d3.selectAll('#showPoints'.concat(component)).property("checked")
              if (state == true) return 1
                else return 0})
            .style('fill','none')
            .style('stroke', function(d) { 
              if (d.party_code == '200') return '#CF5656'
                else return '#5B70A3'});

      points.exit()
            .transition()
            .duration(800)
            .attr('opacity',0)
            .remove()

      var nested_data = d3.nest()
                .key(function(d){return d.party_code})
                .entries(state_data);

      var line = d3.line().x(function(d){return xScale(xValue(d))}).y(function(d){return yScale(yValue(d))});

      var lines = gGeoms.selectAll('.'.concat(component).concat(".line"))
              .data(nested_data);

      lines.enter()
            .append("path")
            .merge(lines)
            .attr("class", function(d){ 
              if (d.key == '100') return component.concat(' line demGeo')
               else return component.concat(" line gopGeo")})
            .attr("d", function(d) { return line(d.values)})
            .attr('opacity',1)
            .style('stroke', function(d){
              if (d.key == '100') return '#5B70A3'
                else return '#CF5656'})
            .style('stroke-dasharray', function(d){
              if (component == 'Prime') return 0
                else return 5
            })
    }


    // let markers = d3.selectAll(".markers")

    // pulse(markers);

    // function pulse(markers) {
    //     (function repeat() {
    //        markers
    //         .transition()
    //         .duration(500)
    //         .attr('stroke-opacity', 0)
    //         .attr("stroke-width", 0)
    //         .transition()
    //         .duration(250)
    //         .attr("stroke-width", 0)
    //         .attr('stroke-opacity', 0.30)
    //         .duration(500)
    //         .attr("stroke-width", 0)
    //         .attr('stroke-opacity', 0.25)
    //         .transition()
    //         .duration(1000)
    //         .attr("stroke-width", 70)
    //         .attr('stroke-opacity', 0.01)
    //         .transition()
    //         .duration(250)
    //         .attr('stroke-opacity', 0)
    //         .ease(d3.easeSin)
    //         .on("end", repeat);
    //     })();
    //   }

    update(allStates, 'Prime')

    d3.select("#stateFilterPrime")
      .on("change", function() {
        var state = d3.select(this).property("value")
        console.log("Selected", state)

        update(state, 'Prime')
      })

    d3.select("#stateFilterComp")
      .on("change", function() {
        var state = d3.select(this).property("value")

        if (state == 'None'){
          d3.selectAll('.Comp')
            .attr('opacity',0)
        }
        else {
        console.log("Selected", state)
        update(state, 'Comp')
        }
      })

    d3.select("#showDemsPrime")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var points = d3.select('#showPointsPrime').property("checked")
        if (state && points){
          d3.selectAll(".Prime.demGeo")
            .attr("opacity", 1)
        }

        else if (state == true && points == false){
          d3.selectAll(".Prime.line.demGeo")
            .attr("opacity", 1)
        }

        else {
          d3.selectAll(".Prime.demGeo")
        .attr("opacity", 0)
        }
      })

    d3.select("#showGOPPrime")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var points = d3.select('#showPointsPrime').property("checked")

        if (state && points){
          d3.selectAll(".Prime.gopGeo")
            .attr("opacity", 1)
        }

        else if (state == true && points == false){
          d3.selectAll(".Prime.line.gopGeo")
            .attr("opacity", 1)
        }
        else {
          d3.selectAll(".Prime.gopGeo")
        .attr("opacity", 0)
        }
      })

    d3.select("#showPointsPrime")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var dem = d3.select('#showDemsPrime').property("checked")
        var gop = d3.select('#showGOPPrime').property("checked")

        if (state && dem && gop){
          d3.selectAll(".Prime.point")
            .attr("opacity", 1)
        }

        else if (state && dem){
          d3.selectAll(".Prime.point.demGeo")
            .attr("opacity", 1)
        }
        else if (state && gop){
          d3.selectAll(".Prime.point.gopGeo")
            .attr("opacity", 1)
        }
        else {
          d3.selectAll(".Prime.point")
        .attr("opacity", 0)
        }
      })

    d3.select("#showDemsComp")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var points = d3.select('#showPointsComp').property("checked")
        if (state && points){
          d3.selectAll(".Comp.demGeo")
            .attr("opacity", 1)
        }

        else if (state == true && points == false){
          d3.selectAll(".Comp.line.demGeo")
            .attr("opacity", 1)
        }

        else {
          d3.selectAll(".Comp.demGeo")
        .attr("opacity", 0)
        }
      })

    d3.select("#showGOPComp")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var points = d3.select('#showPointsComp').property("checked")

        if (state && points){
          d3.selectAll(".Comp.gopGeo")
            .attr("opacity", 1)
        }

        else if (state == true && points == false){
          d3.selectAll(".Comp.line.gopGeo")
            .attr("opacity", 1)
        }
        else {
          d3.selectAll(".Comp.gopGeo")
        .attr("opacity", 0)
        }
      })

    d3.select("#showPointsComp")
      .on("change", function(){
        var state = d3.select(this).property("checked")
        var dem = d3.select('#showDemsComp').property("checked")
        var gop = d3.select('#showGOPComp').property("checked")

        if (state && dem && gop){
          d3.selectAll(".Comp.point")
            .attr("opacity", 1)
        }

        else if (state && dem){
          d3.selectAll(".Comp.point.demGeo")
            .attr("opacity", 1)
        }
        else if (state && gop){
          d3.selectAll(".Comp.point.gopGeo")
            .attr("opacity", 1)
        }
        else {
          d3.selectAll(".Comp.point")
        .attr("opacity", 0)
        }
      })

})


