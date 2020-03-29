/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/


d3.json("/getData",
  function (err, data) {
    console.log("error:",err)


  window.createGraphic = function(analyst,graphicSelector) {

    var analystEL = d3.select(analyst)
  	var graphicEl = analystEL.select(graphicSelector)
  	var graphicVisEl = graphicEl.select(graphicSelector.concat('__vis'))
  	var graphicProseEl = graphicVisEl.select(graphicSelector.concat('__prose'))

  	var margin = 20
  	var size = 29*20
  	var chartSize = size - margin * 2
  	var scaleX = null
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

  			item.select('rect')
  				.transition(t)
  				.attr('width', 50)
  				.attr('height',50)

  			item.select('text')
  				.transition(t)
  				.style('opacity', 0)
  		},

  		function step1() {
  			var t = d3.transition()
  				.duration(800)
  				.ease(d3.easeQuadInOut)
  			
  			// district representations are positioned
  			var item = graphicVisEl.selectAll('.item')
  			item.transition(t)
          .attr('transform', function(d, i) {
            return translate(scaleX(d.col), scaleY(d.row))
          })
  			


  			item.select('rect')
  				.transition(t)
  				.attr('width', 15)
  				.attr('height',15)
          .style('fill', '#586D9C')

  			item.select('text')
  				.transition(t)
  				.delay(function(d, i) { return i})
  				.style('opacity', 0)
  		},
  		function step2() {
  			var t = d3.transition()
  				.duration(100)
  				.ease(d3.easeQuadInOut)

  			// circles are sized
  			var item = graphicVisEl.selectAll('.item')

  			item.select('rect')
  				.transition(t)
          .style('opacity', 1)
          .delay(function(d, i) {
            if (d.q <= .25) return 75
            else if (d.q > .25 && d.q <= .5) return 50
            else if (d.q > .5 && d.q <= .75) return 25
            else return 0
          })
          .duration(2500)
          .style('fill', function(d,i) {
            if (d.q <= .25) return '#9AACD4'
            else if (d.q > .25 && d.q <= .5) return '#586D9C'
            else if (d.q > .5 && d.q <= .75) return '#0B1939'
            else return '#000001'
          })
          .attr('class', function(d,i) {
            if (d.q <= .25) return 'Q1'
            else if (d.q > .25 && d.q <= .5) return 'Q2'
            else if (d.q > .5 && d.q <= .75) return 'Q3'
            else return 'Q4'
          })
          .attr('transform', function(d, i) {
            if (d.q <= .25) return translate('0', '0')
            else if (d.q > .25 && d.q <= .5) return translate(scaleX(4), '0')
            else if (d.q > .5 && d.q <= .75) return translate(scaleX(9), '0')
            else return translate(scaleX(14), '0')
          })

  		},
      // function step3() {
      //   var t = d3.transition()
      //     .duration(100)
      //     .ease(d3.easeQuadInOut)

      //   // circles are sized
      //   var item = graphicVisEl.selectAll('.item')

      //   item.select('rect')
      //     .transition(t)
      //     // .delay(function(d, i) { return (i%15)*50 })
      //     // .style('opacity', 0)
      //     .delay(function(d, i) {
      //       if (d.q <= .25) return 75
      //       else if (d.q > .25 && d.q <= .5) return 50
      //       else if (d.q > .5 && d.q <= .75) return 25
      //       else return 0
      //     })
      //     .duration(5000)
      //     .attr('transform', function(d, i) {
      //       if (d.q <= .25) return translate('0', '0')
      //       else if (d.q > .25 && d.q <= .5) return translate(scaleX(4), '0')
      //       else if (d.q > .5 && d.q <= .75) return translate(scaleX(9), '0')
      //       else return translate(scaleX(14), '0')
      //     })
      // },
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

  		scaleR = d3.scaleLinear()
  		scaleY = d3.scaleBand()
  		scaleX = d3.scaleBand()


      var color_steps = 4
      scaleDist = d3.scaleThreshold()
      	                .domain([.25,.5,.75]) //[-.6, -.2, .2, .6]
      	                .range(d3.schemeGreys[color_steps]); 


    
    
  		// scaleDist = d3.scaleSequential(d3.interpolateYlGnBu)
    //   							.domain([0, 1]);

  		var domainX = d3.range(29)
      // var domainX = d3.range(15)
  		var domainY = d3.range(29)

  		scaleX
  			.domain(domainX)
  			.range([0, chartSize])
  			.padding(1)

  		scaleY
  			.domain(domainY)
  			.range([chartSize, 0])
  			.padding(1)	

  		scaleR
  			.domain(extent)
  			.range([minR, maxR])

  		var item = chart.selectAll('.item')
  			.data(data)
  			.enter().append('g')
  				.classed('item', true)
  				.attr('transform', translate(chartSize / 2, chartSize / 2))
  		
  		item.append('rect')
  			.attr('x', 0)
  			.attr('y', 0)
  			.attr('width', 100)
  			.attr('height', 100)
  			.style('fill', '#586D9C')

  		item.append('text')
  			.text(function(d, i) { return i })
  			.attr('y', .5)
  			.style('font-size', 5)
  			.style('opacity', 0)
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

  scrollstory('#topic','.graphic')

})


