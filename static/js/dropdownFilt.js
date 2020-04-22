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


// function showDemsFn() {
//     var status = document.getElementById("showDems").checked;
//     if (status == "True") {
//       d3.selectAll(".demGeo")
//         .attr("opacity", 1)
//     }
//     else {
//       d3.selectAll(".demGeo")
//         .attr("opacity", 0)
//     }
// }


  d3.json("/getStates", 
    function (err, data) {
      if (err) throw err;

      // console.log(data)

      d3.select("#stateFilter")
        .selectAll("filts")
        .data(data)
        .enter()
        .append('option')
        .text(function(d){ return d.state})
        .attr("value", function(d) { return d.abbrev})


      d3.select("#comparison")
        .selectAll("filts")
        .data(data)
        .enter()
        .append('option')
        .text(function(d){ return d.state})
        .attr("value", function(d) { return d.abbrev})

    })




