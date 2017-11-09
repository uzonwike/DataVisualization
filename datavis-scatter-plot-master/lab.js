// Load the txhousing.csv data file
d3.csv("txhousing.csv", function(txhousing) {

   // Set up the width and height of the entire SVG
   var svg_width = 1000;
   var svg_height = 600;

   // Set up margins for our plot area
   var margin = 75;

   var plot_width = svg_width - 2 * margin;
   var plot_height = svg_height - 2 * margin;
  

   var lists_max = d3.max(txhousing, d => parseInt(d.listings));
   var lists_min = d3.min(txhousing, d => parseInt(d.listings));

   //create a list consists of all of the values from column listings
   var listings = txhousing.map(d => parseInt(d.listings));

   var avgprice_max = d3.max(txhousing, d => parseInt(d.volume) / parseInt(d.sales));
   var avgprice_min = d3.min(txhousing, d => parseInt(d.volume) / parseInt(d.sales));

   //create the scales for x and y axises
   var xScale = d3.scaleLinear()
    .range([margin * 2, svg_width - margin])
    .domain([lists_min - 1000, lists_max +  1000]);

   var yScale = d3.scaleLinear()
    .range([svg_height - margin, margin])
    .domain([avgprice_min - 10000, avgprice_max + 10000]);

    // helper function to set the color of the dots on scatterplot by city names
   var colorHelper = function(d){
      if (d.city == 'Austin') return 'rgb(141,211,199)';
      else if(d.city == 'Dallas') return 'rgb(255,255,179)';
      else if(d.city == 'Houston') return 'rgb(190,186,218)';
      else if(d.city == 'San Antonio') return 'rgb(251,128,114)';
    };

    //create x and y axis by scales
    var xaxis = d3.axisBottom(xScale).ticks(6);
    var yaxis = d3.axisLeft(yScale).ticks(6);

    // add the tooltip area to the webpage
   var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

   //initiaize the svg
   var svg = d3.select('body').append('svg')
    .attr('width', svg_width)
  	.attr('height', svg_height);

   //add x and y axis onto the scatterplot
   svg.append('g')
    .attr("class", "grid")
    .attr('transform', 'translate(' + 0 + ',' + (svg_height - margin) + ')')
       //first number is the distance moved right
       //second number is the distance move down
    .call(xaxis);

   svg.append('g')
    .attr('transform', 'translate(' + margin * 2 + ',' +  0 + ')')
    .call(yaxis);


   //plot the data
   var plotcircles = svg.selectAll('circle')
    .data(txhousing)
    .enter()
    .append('circle');


   plotcircles.attr('cx', d =>  xScale(parseInt(d.listings)))
    .attr('cy', d =>  yScale(parseInt(d.volume) / parseInt(d.sales)))
    .attr('r', d => parseInt(d.inventory) / 2) //the size of the circle represents the inventory
    .attr('stroke', 'rgb(200,200,200)')
    .attr('stroke-width', 0.5)
    .style('fill', colorHelper)
    .on("mouseover", function(d) {
         tooltip.transition()
             .duration(200)
             .style("opacity", .9);
         tooltip.html("ID: " + d.id + "<br/>" + d.year  + ". " + d.month)
             .style("left", (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
         tooltip.transition()
             .duration(500)
             .style("opacity", 0);
      });
       


   //create an array of city names
   var cityNames = ["Austin", "Dallas", "Houston", "SanAntonio"];


   var legendCircle = svg.selectAll('legend-circle')
    .data(cityNames)
    .enter()
    .append('circle');

   legendCircle.attr('class', d => d)
    .attr('r', 10)
    .attr('cx', svg_width - 300)
    .attr('cy', function(d, i) {return 100 + i * 30 + 10 * 2;}); // 10 is the ratdius of the circle


   //add legend for the scatterplot
   svg.selectAll("legend-text")
    .data(cityNames)
    .enter()
    .append('text')
    .attr('class', 'legend-text')
    .attr('x', svg_width - 300 + 30)
    .attr('y', function(d, i) {return 105 + i * 30 + 10 * 2;})
    .text(d => d);

  
  svg.append("text")
    .attr('class', 'legend-header')
    .text("City Names")
    .attr('x', svg_width - 310)
    .attr('y', 100);
   
  //add x-axis title
  svg.append('text')
    .attr('class', 'x-axis')
    .text('Number of House Listings')
    .attr('x', plot_width / 2)
    .attr('y', svg_height - margin / 4);

  //add the rotated y-axis title
  svg.append('text')
    .attr('class', 'y-axis')
    .attr('text-anchor', 'middle')
    .attr('transform',
      // Translate and rotate the label into place. This rotates the label
      // around 0,0 in its original position, so the label rotates around its
      // center point
      'translate(' + margin + ', ' + (plot_height / 2 + margin) + ')' + 'rotate(-90)')
    .text('Average Price (dollars)');
});
