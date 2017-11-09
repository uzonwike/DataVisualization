// Load the network of internet autonomous systems (routers)
// Data is from Standford SNAP: https://snap.stanford.edu/data/as.html
d3.tsv('as-733.tsv', function(data) {
    var svg_height = window.innerHeight;;
    var svg_width = window.innerWidth;;
    var circle_radius = 2;

    // Create SVG for Force-Directed graph
    var svg = d3.select('body').append('svg')
        .attr('width', svg_width)
        .attr('height', svg_height);
    
    var unique_nodes = [];
    var nonunique_nodes = [];
    var counts = [];
    var nodes = [];
    var links = data;
    for(var edge of data) {
	// Look for nodes that match this edge's source. If there aren't any, add one.
	if(!unique_nodes.find(node => node.id == edge.source)) {
	    unique_nodes.push({id: edge.source});
	}
	
	// Look for nodes that match this edge's target. If there aren't any, add one.
	if(!unique_nodes.find(node => node.id == edge.target)) {
	    unique_nodes.push({id: edge.target});
	}
    }

    for(var edge of data) {
    	nonunique_nodes.push({id: edge.source});
	nonunique_nodes.push({id: edge.target});
    }

    for(var node of unique_nodes) {
    	var count = 0;
    	for (var i = 0; i < nonunique_nodes.length; i++) {
    	    if (node.id == nonunique_nodes[i].id) {
    		count++;
    	    }
    	}
    	counts.push(count);
    }

    for(var i = 0; i < unique_nodes.length; i++) {
    	nodes.push({id: unique_nodes[i].id,
    		    connections: counts[i]});
    }

    function count_filter (d) {
    	return d.connections > 5;
    }

    nodes = nodes.filter(count_filter);

    function links_filter(d) {
    	var valid_source = false;
    	var valid_target = false;

    	for (var node of nodes) {
    	    if (d.source == node.id) {
    		valid_source = true;
    	    }
    	    if (d.target == node.id) {
    		valid_target = true
    	    }
    	}
    	return valid_source && valid_target;
    }

    links = links.filter(links_filter);
    console.log(links);

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    
    
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(svg_width / 2, svg_height / 2));

    var line_width = 5;
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line");
       // .attr("stroke-width", line_width);

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});
