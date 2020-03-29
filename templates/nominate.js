

d3.json('/getNom',
  function(err,data){

    window.createGraphic = function(graphicSelector) {

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 400,
            height = 400,
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom,
            xScale = d3.scaleLinear(),
            extent = d3.extent(data)
            onMouseOver = function () { },
            onMouseOut = function () { };
            xAxesTicks = function(d,i) { return d };

        var svg = d3.select('.nom_demo').selectAll("svg").data([data])
        var svgEnter = svg.enter().append("svg");
        var gEnter = svgEnter.append("g");
        gEnter.append("g").attr("class", "x axis");

        innerWidth = width - margin.left - margin.right,

        // Update the outer dimensions.
        svg.merge(svgEnter).attr("width", width)
          .attr("height", height);

        xScale.range([0,width])
              .domain(extent);

    }
  })