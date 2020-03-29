/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic = function(graphicSelector) {
	var graphicEL = d3.select('.graphic.')
	var graphicVisEl = graphicEL.select('.graphic__vis')
	var graphicProseEl = graphicEL.select('.graphic__prose')

	var margin = 20
	var size = 29*20
	var chartSize = size - margin * 2
	var scaleX = null
	var scaleR = null
	var scaleDist = null
	var data = [0.00229885, 0.0045977 , 0.00689655, 0.0091954 , 0.01149425,
       0.0137931 , 0.01609195, 0.0183908 , 0.02068966, 0.02298851,
       0.02528736, 0.02758621, 0.02988506, 0.03218391, 0.03448276,
       0.03678161, 0.03908046, 0.04137931, 0.04367816, 0.04597701,
       0.04827586, 0.05057471, 0.05287356, 0.05517241, 0.05747126,
       0.05977011, 0.06206897, 0.06436782, 0.06666667, 0.06896552,
       0.07126437, 0.07356322, 0.07586207, 0.07816092, 0.08045977,
       0.08275862, 0.08505747, 0.08735632, 0.08965517, 0.09195402,
       0.09425287, 0.09655172, 0.09885057, 0.10114943, 0.10344828,
       0.10574713, 0.10804598, 0.11034483, 0.11264368, 0.11494253,
       0.11724138, 0.11954023, 0.12183908, 0.12413793, 0.12643678,
       0.12873563, 0.13103448, 0.13333333, 0.13563218, 0.13793103,
       0.14022989, 0.14252874, 0.14482759, 0.14712644, 0.14942529,
       0.15172414, 0.15402299, 0.15632184, 0.15862069, 0.16091954,
       0.16321839, 0.16551724, 0.16781609, 0.17011494, 0.17241379,
       0.17471264, 0.17701149, 0.17931034, 0.1816092 , 0.18390805,
       0.1862069 , 0.18850575, 0.1908046 , 0.19310345, 0.1954023 ,
       0.19770115, 0.2       , 0.20229885, 0.2045977 , 0.20689655,
       0.2091954 , 0.21149425, 0.2137931 , 0.21609195, 0.2183908 ,
       0.22068966, 0.22298851, 0.22528736, 0.22758621, 0.22988506,
       0.23218391, 0.23448276, 0.23678161, 0.23908046, 0.24137931,
       0.24367816, 0.24597701, 0.24827586, 0.25057471, 0.25287356,
       0.25517241, 0.25747126, 0.25977011, 0.26206897, 0.26436782,
       0.26666667, 0.26896552, 0.27126437, 0.27356322, 0.27586207,
       0.27816092, 0.28045977, 0.28275862, 0.28505747, 0.28735632,
       0.28965517, 0.29195402, 0.29425287, 0.29655172, 0.29885057,
       0.30114943, 0.30344828, 0.30574713, 0.30804598, 0.31034483,
       0.31264368, 0.31494253, 0.31724138, 0.31954023, 0.32183908,
       0.32413793, 0.32643678, 0.32873563, 0.33103448, 0.33333333,
       0.33563218, 0.33793103, 0.34022989, 0.34252874, 0.34482759,
       0.34712644, 0.34942529, 0.35172414, 0.35402299, 0.35632184,
       0.35862069, 0.36091954, 0.36321839, 0.36551724, 0.36781609,
       0.37011494, 0.37241379, 0.37471264, 0.37701149, 0.37931034,
       0.3816092 , 0.38390805, 0.3862069 , 0.38850575, 0.3908046 ,
       0.39310345, 0.3954023 , 0.39770115, 0.4       , 0.40229885,
       0.4045977 , 0.40689655, 0.4091954 , 0.41149425, 0.4137931 ,
       0.41609195, 0.4183908 , 0.42068966, 0.42298851, 0.42528736,
       0.42758621, 0.42988506, 0.43218391, 0.43448276, 0.43678161,
       0.43908046, 0.44137931, 0.44367816, 0.44597701, 0.44827586,
       0.45057471, 0.45287356, 0.45517241, 0.45747126, 0.45977011,
       0.46206897, 0.46436782, 0.46666667, 0.46896552, 0.47126437,
       0.47356322, 0.47586207, 0.47816092, 0.48045977, 0.48275862,
       0.48505747, 0.48735632, 0.48965517, 0.49195402, 0.49425287,
       0.49655172, 0.49885057, 0.50114943, 0.50344828, 0.50574713,
       0.50804598, 0.51034483, 0.51264368, 0.51494253, 0.51724138,
       0.51954023, 0.52183908, 0.52413793, 0.52643678, 0.52873563,
       0.53103448, 0.53333333, 0.53563218, 0.53793103, 0.54022989,
       0.54252874, 0.54482759, 0.54712644, 0.54942529, 0.55172414,
       0.55402299, 0.55632184, 0.55862069, 0.56091954, 0.56321839,
       0.56551724, 0.56781609, 0.57011494, 0.57241379, 0.57471264,
       0.57701149, 0.57931034, 0.5816092 , 0.58390805, 0.5862069 ,
       0.58850575, 0.5908046 , 0.59310345, 0.5954023 , 0.59770115,
       0.6       , 0.60229885, 0.6045977 , 0.60689655, 0.6091954 ,
       0.61149425, 0.6137931 , 0.61609195, 0.6183908 , 0.62068966,
       0.62298851, 0.62528736, 0.62758621, 0.62988506, 0.63218391,
       0.63448276, 0.63678161, 0.63908046, 0.64137931, 0.64367816,
       0.64597701, 0.64827586, 0.65057471, 0.65287356, 0.65517241,
       0.65747126, 0.65977011, 0.66206897, 0.66436782, 0.66666667,
       0.66896552, 0.67126437, 0.67356322, 0.67586207, 0.67816092,
       0.68045977, 0.68275862, 0.68505747, 0.68735632, 0.68965517,
       0.69195402, 0.69425287, 0.69655172, 0.69885057, 0.70114943,
       0.70344828, 0.70574713, 0.70804598, 0.71034483, 0.71264368,
       0.71494253, 0.71724138, 0.71954023, 0.72183908, 0.72413793,
       0.72643678, 0.72873563, 0.73103448, 0.73333333, 0.73563218,
       0.73793103, 0.74022989, 0.74252874, 0.74482759, 0.74712644,
       0.74942529, 0.75172414, 0.75402299, 0.75632184, 0.75862069,
       0.76091954, 0.76321839, 0.76551724, 0.76781609, 0.77011494,
       0.77241379, 0.77471264, 0.77701149, 0.77931034, 0.7816092 ,
       0.78390805, 0.7862069 , 0.78850575, 0.7908046 , 0.79310345,
       0.7954023 , 0.79770115, 0.8       , 0.80229885, 0.8045977 ,
       0.80689655, 0.8091954 , 0.81149425, 0.8137931 , 0.81609195,
       0.8183908 , 0.82068966, 0.82298851, 0.82528736, 0.82758621,
       0.82988506, 0.83218391, 0.83448276, 0.83678161, 0.83908046,
       0.84137931, 0.84367816, 0.84597701, 0.84827586, 0.85057471,
       0.85287356, 0.85517241, 0.85747126, 0.85977011, 0.86206897,
       0.86436782, 0.86666667, 0.86896552, 0.87126437, 0.87356322,
       0.87586207, 0.87816092, 0.88045977, 0.88275862, 0.88505747,
       0.88735632, 0.88965517, 0.89195402, 0.89425287, 0.89655172,
       0.89885057, 0.90114943, 0.90344828, 0.90574713, 0.90804598,
       0.91034483, 0.91264368, 0.91494253, 0.91724138, 0.91954023,
       0.92183908, 0.92413793, 0.92643678, 0.92873563, 0.93103448,
       0.93333333, 0.93563218, 0.93793103, 0.94022989, 0.94252874,
       0.94482759, 0.94712644, 0.94942529, 0.95172414, 0.95402299,
       0.95632184, 0.95862069, 0.96091954, 0.96321839, 0.96551724,
       0.96781609, 0.97011494, 0.97241379, 0.97471264, 0.97701149,
       0.97931034, 0.9816092 , 0.98390805, 0.9862069 , 0.98850575,
       0.9908046 , 0.99310345, 0.9954023 , 0.99770115, 1.        ]
	var extent = d3.extent(data)
	var minR = 10
	var maxR = 24
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
			// circles are centered and small
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
			
			// circles are positioned
			var item = graphicVisEl.selectAll('.item')
			
			item.transition(t)
				.attr('transform', function(d, i) {
					// console.log(Math.ceil(i/15))
					return translate(scaleX(i%15), scaleY(i%29))
				})


			item.select('rect')
				.transition(t)
				.attr('width', 15)
				.attr('height',15)

			// item.select('circle')
			// 	.transition(t)
			// 	.attr('r', minR)

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
				.delay(function(d, i) { return i * 100 })
				.attr("fill", function(d,i) {
					return scaleDist(d)})
			
			// item.select('circle')
			// 	.transition(t)
			// 	.delay(function(d, i) { return i * 200 })
			// 	.attr('r', function(d, i) {
			// 		return scaleR(d)
			// 	})

			// item.select('text')
			// 	.transition(t)
			// 	.delay(function(d, i) { return i * 200 })
			// 	.style('opacity', 1)
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

		scaleR = d3.scaleLinear()
		scaleY = d3.scaleBand()
		scaleX = d3.scaleBand()



    var color_steps = 4
    var scaleDist = d3.scaleThreshold()
    	// .domain([0,.25,.5,.75,1]) //[-.6, -.2, .2, .6]
    	.range(d3.schemeYlGnBu[color_steps]); 
  
  
		// scaleDist = d3.scaleSequential(d3.interpolateYlGnBu)
  //   							.domain([0, 1]);

		var domainX = d3.range(15)
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
			// .attr("fill", function(d,i){
			// 	return scaleDist(d)
			// })
			.attr('fill', '#3B3F5B')

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