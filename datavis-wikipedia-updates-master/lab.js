// Define screen area generate new divs
var SCREEN_WIDTH = window.innerWidth - 500;
var SCREEN_HEIGHT = window.innerHeight;

// Subscribe to the PubNub wikipedia feed
PUBNUB.init({
  subscribe_key: 'sub-c-b0d14910-0601-11e4-b703-02ee2ddab7fe'
}).subscribe({
  channel: 'pubnub-wikipedia',
  message: function(msg) {
    // Uncomment this to log the message to the console
      //console.log(msg);
      new_random_div(msg);
  }
});

// Function to generate and scale a random number
function scaled_random(scale) {
	var rand = Math.random();
	return Math.floor(rand*scale) + 1;
}

// Function to generate a new div with msg as a link
function new_random_div (msg) {
    // Choose left and top padding
    var new_left = scaled_random(SCREEN_WIDTH);
    var new_top = scaled_random(SCREEN_HEIGHT) + 50; 

    // Append to container to avoid writing over title 
    d3.select("#container")
	.append("div")
	.attr("class", "linkbox")
	.attr("style", "left:" + new_left + "px; top: " + new_top + "px; float:none") // Generate a new randomly place div
        .append("a") // Link tag
        .attr("href", msg.link) // Make msg into url 
        .text(msg.item)
        // Add transition to fade away over 5 seconds
    	.transition()
    		.duration(5000)
    		.style("opacity", 0.1) // Stay at opacity 0.1 to make sure remove is successful
    	.remove(); // Remove element from DOM
}