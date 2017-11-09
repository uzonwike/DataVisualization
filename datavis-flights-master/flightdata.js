var width = 960;
var height = 500;

// Use a fixed size for the selected airport
var selected_airport_size = 6;

// Set up a projection for the USA
var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);

// Add an SVG element
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
    
// Set up a default click handler, which is called at the end of any click action
window.onclick = blankClick;

// Use a scale for circle size
var scaleCircleSize = d3.scalePow().exponent(0.4).range([1, 10])

// Use a scale for line size
var scaleLineOpacity = d3.scalePow().exponent(0.4).range([0, 1]);

// Use a D3 map to track airport information, keyed by IATA code
var airports = d3.map();

// Use crossfilter to track flights
var flights = crossfilter();
var flightsByOrigin = flights.dimension(d => d.ORIGIN);
var flightsByDest = flights.dimension(d => d.DEST);

// Use a global to track the origin airport
var origin = undefined;

// This code sets up a handler for any time the carrier drop down is changed
d3.select('#carrier')
  .on('change', function() {
    console.log(d3.select(this).node().value);
  });

// This code sets up a handler for the #monday checkbox
d3.select('#monday')
  .on('change', function() {
    console.log(d3.select(this).node().checked);
  });

function updateView() {
  // Group flights by destination
  var dests = flightsByDest.group();
  
  // Find the maximum number of flights to any one destination
  var max_flights = d3.max(dests.all(), d => d.value);
  
  // Update the domains for line width and circle size
  scaleCircleSize.domain([0, max_flights]);
  scaleLineOpacity.domain([1, max_flights]);
  
  // Join circles with destination airports
  var svg_airports = svg.selectAll('circle.airport').data(dests.all());
  
  // Add a circle for each airport
  svg_airports.enter()
    .append('circle')
      .attr('class', 'airport')
      .attr('cx', d => airports.get(d.key).x)
      .attr('cy', d => airports.get(d.key).y)
      .attr('r', 1)
      .on('click', airportClick)
    .merge(svg_airports)
    .transition().duration(500)
      .attr('class', d => d.key == origin ? 'airport selected' : 'airport')
      .attr('r', d => d.key == origin ? selected_airport_size : scaleCircleSize(d.value));
  
  // Remove all old flight lines
  svg.selectAll('path.flight')
    .attr('class', '') // Drop the class from these lines so they aren't selected later
    .transition() // Fade out
    .attr('stroke-opacity', 0)
    .remove();
  
  // Get the origin airport, if any
  if(origin) {  
    origin_info = airports.get(origin);
    
    // Add new flight lines
    svg.selectAll('path.flight')
      .data(dests.all().filter(d => d.value > 0))
      .enter()
      .append('path')
      .attr('class', 'flight')
      // Instead of setting x1, y1, x2, and y2, we set the d attribute to draw a path
      .attr('d', generateFlightLine)
      .attr('stroke-opacity', d => scaleLineOpacity(d.value))
      .attr('fill', 'none')
      // The next two attributes animate the arc drawing code
      .attr('stroke-dasharray', function(d) {
        // This attribute sets the line up so it is dashed
        // Each dash is the *total length* of the line.
        var length = this.getTotalLength();
        return length + " " + length;
      })
      .attr('stroke-dashoffset', function(d) {
        // This attribute starts the line in the blank part of the dash.
        // We will transition this down to zero so the line draws outward
        return this.getTotalLength();
      })
      .transition()
        .duration(500)
        // Gradually move the dash offset so the line appears from the center point and expands outward
        .attr('stroke-dashoffset', 0);
  }
}

// Handle clicks outside of any airport circle
function blankClick() {
  origin = undefined;
  flightsByOrigin.filterAll();
  updateView();
}

// Handle clicks on an airport circle
function airportClick(datum) {
  origin = datum.key;
  flightsByOrigin.filter(origin);
  updateView();
  d3.event.stopPropagation();
}

// Generate a curved flight line
function generateFlightLine(d) {
  // Get information for the destionation
  var dest_info = airports.get(d.key);

  // Create the path
  var path = d3.path();

  // Start at the flight origin
  path.moveTo(origin_info.x, origin_info.y);

  // Compute the midpoint
  var mid_x = (origin_info.x + dest_info.x) / 2;
  var mid_y = (origin_info.y + dest_info.y) / 2;

  // Compute the difference between the points to make a normal vector
  var d_x = origin_info.x - dest_info.x;
  var d_y = origin_info.y - dest_info.y;

  // Flip reversed lines so all curves open downward
  if(d_x > 0) {
    d_x = -d_x;
    d_y = -d_y;
  }

  // Increase this value to make the lines more curved
  var norm_size = 0.15;

  // Make the curved connection to the destination
  path.quadraticCurveTo(mid_x - d_y * norm_size,
                        mid_y + d_x * norm_size,
                        dest_info.x,
                        dest_info.y);

  // Let D3 generate the path encoding for us
  return path;
}

// Queue a sequence of requests
d3.queue()
  .defer(d3.json, 'data/us.json')
  .defer(d3.csv, 'data/airports.csv')
  .defer(d3.csv, 'data/flights_1.csv')
  .defer(d3.csv, 'data/carriers.csv')
  .await(function(error, us, airport_data, flight_data, carriers) {
    // Once all three requests are complete, this function runs
	
    // Draw land
    svg.append('path')
      .datum(topojson.feature(us, us.objects.land))
      .attr('class', 'land')
      .attr('d', path);

    // Draw boundaries between states
    svg.append('path')
      .datum(topojson.mesh(us, us.objects.states))
      .attr('class', 'state-boundary')
      .attr('d', path);
    
    // Loop over all the airports to perform two tasks:
    //  1. Convert their latitude and longitude to screen coordinates
    //  2. Add only the large airports to our map of "real" airports
    for(var airport of airport_data) {
      // Is this a large airport?
      if(airport.type == "large_airport") {
        // Build the coordinates array in the format D3 wants
        var coordinates = [
          +airport.longitude_deg, +airport.latitude_deg];
          
        // Convert the coordinates to screen locations
        var screen_position = projection(coordinates);
        
        // If we get a valid screen position, add this to our airports map
        if(screen_position) {
          // Store the x and y position of the airport
          airport.x = screen_position[0];
          airport.y = screen_position[1];
          
          // Store our airport 
          airports.set(airport.iata_code, airport);
        }
      }
    }

	// Get filtered list of airlines
	var airline_carriers = [];
	for (var i = 0; i < 25; i++) {
		airline_carriers[i] = carriers[i].Description;
	}

	var options = d3.select('select')
		.selectAll('option')
		.data(airline_carriers).enter()
		.append('option')
			.text(function (d) { return d; });
		
    // Remove flights with unknown origin or destination airports
    flight_data = flight_data.filter(d => airports.has(d.ORIGIN) && airports.has(d.DEST));
    
    // Add our flights to crossfilter
    flights.add(flight_data);
    
    // Update our visualization
    updateView();
  });
