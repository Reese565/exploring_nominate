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

    var margin = 7
    var width = 400
    var height = 350
    var chartWidth = width - margin * 2
    var chartHeight = height - margin * 2
    var scaleY = null
    var nomScale = null
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

        item.select('circle')
          .transition(t)
          .attr('r', 0)
          .attr('cx', function(d){
          return nomScale(d.pos)
        })
          .attr('cy',scaleY(1))

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

        item.select('circle')
          .transition(t)
          .attr('r', 15)

        item.select('text')
          .transition(t)
          .style('opacity', 0)
          .style('font-size', '40px')
      },

      function step2() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)
        
        // circles are positioned
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
          .transition(t)
          .style('opacity', 1)
          .style('font-size', '25px');
      },

      function step3() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
          .transition(t)
          .style('opacity', function(d,i) {
            if (((i%6 == 0)|| (i%6 == 2)) && (d.pos !== -1)) return 1
            else return .5;})
          .style('font-size', function(d,i) {
            if (((i%6 == 0)|| (i%6 == 2)) && (d.pos !== -1)) return '30px'
            else return '20px';});
      },
      function step4() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')

        item.select('text')
        .transition(t)
          .style('opacity', function(d,i) {
            if (((i%6 == 1)|| (i%6 == 3)) && (d.pos !== 1)) return 1
            else return .5;})
          .style('font-size', function(d,i) {
            if (((i%6 == 1)|| (i%6 == 3)) && (d.pos !== 1)) return '30px'
            else return '20px';});

      },
      function step5() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // select elements
        var item = graphicVisEl.selectAll('.item')
        var axis = graphicVisEl.selectAll('.x.axis')

        item.select('text')
        .transition(t)
          .style('opacity', function(d,i) {
            if ((i%6 == 4)|| (i%6 == 5)) return 1
            else return .5})
          .style('font-size', function(d,i) {
            if ((i%6 == 4)|| (i%6 == 5)) return '30px'
            else return '20px';});

        axis.transition(t)
            .style('stroke-opacity',0)

        axis.selectAll('.tick')
            .transition(t)
            .style('opacity',0)

      },
      function step6() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')
        var axis = graphicVisEl.selectAll('.x.axis')

        item.select('circle')
          .transition(t)
          .attr('r', 15)
          .attr('cx', function(d){
          return nomScale(d.pos)
        })
          .attr('cy',scaleY(1))

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

      function step7() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')
        // debugger;
        item.select('circle')
        .transition(t)
        .attr('r', 5)
        .attr('cx', function(d){return nomScale(d.nom)})
        .attr('cy', function(d){return scaleY(5)});
      },

      function step8() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        // circles are sized
        var item = graphicVisEl.selectAll('.item')
        var axis = graphicVisEl.selectAll('.x.axis')

        item.select('circle')
        .transition(t)
        .attr('r', 5)
        .attr('cx', function(d){ 
          if (Math.random() > 0.5) return nomScale(d.nom - Math.random()/2)
            else return nomScale(d.nom + Math.random()/2)})
        .attr('cy', function(d){return scaleY(5)});

        axis.transition(t)
            .style('stroke-opacity', 1);

        axis.selectAll('.tick')
            .transition(t)
            .style('opacity',1);

      },
      function step9() {
        var t = d3.transition()
          .duration(800)
          .ease(d3.easeQuadInOut)

        var axis = graphicVisEl.selectAll('.x.axis');

        item.select('text')
          .transition(t)
          .style('font-size', '25px');

        item.select('circle')
          .transition(t)
          .attr('r', 0)
          .attr('cx', function(d){
          return nomScale(d.pos)
        })
          .attr('cy',scaleY(1));

        var item = graphicVisEl.selectAll('.item');

        axis.transition(t)
            .style('stroke-opacity', 0);

        axis.selectAll('.tick')
            .transition(t)
            .style('opacity',0);

        
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
        .attr('width', width + 'px')
        .attr('height', height + 'px')
      
      var chart = svg.append('g')
        .classed('chart', true)
        // .attr('transform', 'translate(' + margin + ',' + margin + ')')


      nomScale = d3.scaleLinear()
                     .range([margin*4, chartWidth - margin*2])
                     .domain([-1,1])

      scaleY = d3.scaleLinear()
                 .range([margin, chartHeight])
                 .domain([0,10])

      


      var item = chart.selectAll('.item')
        .data(data)
        .enter().append('g')
          .classed('item', true)
          // .attr('transform', translate(chartSize / 2, chartSize / 2))
      
      item.append('circle')
        .attr('cx', function(d){
          return nomScale(d.pos)
        })
        .attr('cy', scaleY(1))
        .attr('r', 0)
        .style('fill', function(d){
            if (d.nom > 0) return '#CF5656'
            else return '#5B70A3'
          })

      item
        .append('text')
        .text(function(d) {
          return d.vote})
        .attr('x', function(d){
          return nomScale(d.pos)
        })
        .attr('y', function(d,i){
          return scaleY(i%6 + 2.25)
        })
        .style('font-size', 40)
        .style('opacity', 0)


      let nomAxis = d3.axisBottom(nomScale).ticks(7)

      chart.append("g")
         .attr('class','item x axis')
         .attr("transform", "translate(0," + scaleY(5) + ")")
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
