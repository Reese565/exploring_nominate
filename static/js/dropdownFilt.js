// toggle between hiding and showing the dropdown content

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("states");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

  d3.json("/getStates", 
    function (err, data) {
      if (err) throw err;


      d3.select("#stateFilterPrime")
        .selectAll("filts")
        .data(data)
        .enter()
        .append('option')
        .text(function(d){ return d.state})
        .attr("value", function(d) { return d.state})


      d3.select("#stateFilterComp")
        .selectAll("filts")
        .data(data)
        .enter()
        .append('option')
        .text(function(d){ return d.state})
        .attr("value", function(d) { return d.state})

    })




