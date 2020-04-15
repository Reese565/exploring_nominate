/* 
  I've created a function here that is a simple d3 chart.
  This could be anthing that has discrete steps, as simple as changing
  the background color, or playing/pausing a video.
  The important part is that it exposes and update function that
  calls a new thing on a scroll trigger.
*/


d3.json("/getNom",
  function (err, data) {
    console.log("error:",err)


  window.createGraphic = function(analyst, graphicSelector) {

    var analystEL = d3.select(analyst)
    var graphicEl = analystEL.select(graphicSelector)
    var graphicVisEl = graphicEl.select(graphicSelector.concat('__vis'))
    var graphicProseEl = graphicVisEl.select(graphicSelector.concat('__prose'))

    var margin = 20
    var size = 29*20
    var chartSize = size - margin * 2
    var scaleX = null
    var nomScale = null;
    var scaleR = null
    var scaleDist = null
    var extent = d3.extent(data)
    var minR = 10
    var maxR = 24
    
    // actions to take on each step of our scroll-driven story
    var steps = [
      function step0() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)
            

        var item = graphicVisEl.selectAll('.item')
        
        item.transition(t)
          .attr('transform', translate(chartSize / 2, chartSize / 2))

        item.select('circle')
          .transition(t)
          .attr('r', 20)
          .attr('cx', function(d){
          return d.pos*150
        })
          .attr('cy',-50)

        item.select('text')
          .transition(t)
          .style('opacity', 0)
      },

      function step1() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)
        
        // circles are positioned
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
          .transition(t)
          .delay(function(d, i) { return i})
          .style('opacity', 1)
      },
      function step2() {
        var t = d3.transition()
          .duration(100)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
          .transition(t)
          .delay(function(d, i) { return i})
          .style('opacity', function(d,i) {
            if (((i%6 == 0)|| (i%6 == 2)) && (d.pos !== -1)) return 1
            else return .5
          })
      },
      function step3() {
        var t = d3.transition()
          .duration(100)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
        .transition(t)
          .delay(function(d, i) { return i})
          .style('opacity', function(d,i) {
            if (((i%6 == 1)|| (i%6 == 3)) && (d.pos !== 1)) return 1
            else return .5
          })

      },
      function step4() {
        var t = d3.transition()
          .duration(100)
          .ease(d3.easeQuadInOut)

        // select elements
        var item = graphicVisEl.selectAll('.item')
        var axis = graphicVisEl.selectAll('.x.axis')

        item.select('text')
        .transition(t)
          .delay(function(d, i) { return i})
          .style('opacity', function(d,i) {
            if ((i%6 == 4)|| (i%6 == 5)) return 1
            else return .5
          })

        axis.transition(t)
            .style('stroke-opacity',0)

        axis.selectAll('.tick')
            .transition(t)
            .style('opacity',0)

      },
      function step5() {
        var t = d3.transition()
          .duration(100)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')
        var axis = graphicVisEl.selectAll('.x.axis')

        item.select('circle')
          .transition(t)
          .attr('r', 20)
          .attr('cx', function(d){
          return d.pos*150
        })
          .attr('cy',-50)

        item.select('text')
            .transition(t)
            .delay(function(d, i) { return i})
            .style('opacity', 0)

        axis.transition(t)
            .style('stroke-opacity', 1)

        axis.selectAll('.tick')
            .transition(t)
            .style('opacity',1)
        

      },
      function step6() {
        var t = d3.transition()
          .duration(200)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')

        item.select('circle')
        .transition(t)
        .attr('cx', function(d){return nomScale(d.nom)})

        

      },
    ]

    // update our chart
    function update(step) {
      steps[step].call()
    }
    
    // little helper for string concat if using es5
    function translate(x, y) {
      return 'translate(' + x + ',' + y + ')'
    }

    function setupCharts() {
      var svg = graphicVisEl.append('svg')
        .attr('width', size + 'px')
        .attr('height', size + 'px')
      
      var chart = svg.append('g')
        .classed('chart', true)
        .attr('transform', 'translate(' + margin + ',' + margin + ')')

      // scaleR = d3.scaleLinear()
      // scaleY = d3.scaleBand()
      // scaleX = d3.scaleBand()


      // var color_steps = 4
      // scaleDist = d3.scaleThreshold()
      //                   .domain([.25,.5,.75]) //[-.6, -.2, .2, .6]
      //                   .range(d3.schemeGreys[color_steps]); 


    
    
      // scaleDist = d3.scaleSequential(d3.interpolateYlGnBu)
    //                .domain([0, 1]);

      // var domainX = d3.range(29)
      // var domainY = d3.range(29)

      // scaleX
      //   .domain(domainX)
      //   .range([0, chartSize])
      //   .padding(1)

      // scaleY
      //   .domain(domainY)
      //   .range([chartSize, 0])
      //   .padding(1) 

      // scaleR
      //   .domain(extent)
      //   .range([minR, maxR])

      var item = chart.selectAll('.item')
        .data(data)
        .enter().append('g')
          .classed('item', true)
          .attr('transform', translate(chartSize / 2, chartSize / 2))
      
      item.append('circle')
        .attr('cx', function(d){
          return d.pos*150
        })
        .attr('cy', -50)
        .attr('r', 20)
        .style('fill', function(d){
            if (d.nom > 0) return 'red'
            else return 'blue'
          })

      item
        .append('text')
        .text(function(d) {
          return d.vote})
        .attr('x', function(d){
          return d.pos*150
        })
        .attr('y', function(d,i){
          return (i%6)*25
        })
        .style('font-size', 25)
        .style('opacity', 0)


      nomScale = d3.scaleLinear()
                     .range([margin*4, size - margin*4])
                     .domain([-1,1])

      let nomAxis = d3.axisBottom(nomScale)

      chart.append("g")
         .attr('class','x axis')
         .attr("transform", "translate(0,300)")
         .style('stroke-opacity',0)
         .call(nomAxis);

      chart.selectAll('.tick')
           .style('opacity',0)

    }

    function setupProse() {
      var height = window.innerHeight * 0.5
      graphicProseEl.selectAll('.trigger')
        .style('height', height + 'px')
    }

    function init() {
      setupCharts()
      setupProse()
      update(0)
    }
    
    init()
    
    return {
      update: update,
    }
  }

  scrollstory('#nominate','.graphic')

})
