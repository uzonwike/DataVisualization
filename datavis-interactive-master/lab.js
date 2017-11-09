// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

var text_background_color = d3.rgb(250,235,215);

// Transition Time
var miliseconds = 5000;

// Text bubble dimensions
var text_width = 300;

// Generate an SVG element on the page
var svg = d3.select("body").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

d3.json('world-110m.json', function(error, world) {
    // Decode the topojson file
    var land = topojson.feature(world, world.objects.land);
    var countries = topojson.mesh(world, world.objects.countries);
    
    // Fit our projection so it fills the window
    projection.fitSize([svg_width, svg_height], land);
    
    // Create land area
    svg.append('path')
        .datum(land)
        .attr('class', 'land')
        .attr('d', path);

    // Create state boundaries
    svg.append('path')
        .datum(countries)
        .attr('class', 'state-boundary')
        .attr('d', path);
});

// Help from Larry
// Subscribe to the PubNub twitter feed
PUBNUB.init({
    subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
}).subscribe({
    channel: 'pubnub-twitter',
    message: function(msg) {
        if (msg.geo != null) {
            var coordinates = projection([msg.geo.coordinates[1], msg.geo.coordinates[0]]);     
            createTweetBubble(msg, coordinates);
        }
    }
});

// Help from Larry
function createTweetBubble(msg, coordinates) {
    
    svg.append('circle')
        .attr('r', 5)
        .attr('cx', coordinates[0])
        .attr('cy', coordinates[1])
        .attr('fill', 'blue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', createTweetTextBox) // Reilly helped here
        .transition()
	.duration(miliseconds)
	.ease(d3.easeLinear)
	.style("opacity", 1)
	.remove();

    function createTweetTextBox() {
        
        var tweetItem = d3.select('body')
            .append('div')

        tweetItem.style('width', text_width + 'px')
            .style('font-size', '8px')
            .style('background-color', text_background_color)
            .style('border', '1px solid black')
            .style('border-radius', '1px')
            .style('position', 'absolute')
            .style('left', (coordinates[0] - text_width) + 'px')
            .style('top', coordinates[1] + 'px')

        tweetItem.append('p')
            .text(msg.text);

        tweetItem.transition()
            .duration(miliseconds)	    
	    .style('opacity', 0)
            .remove();
        
    }
}
