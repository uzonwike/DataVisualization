// Select the h1 heading and change its text
d3.select('#heading').text('Getting Started with D3');

// Here we add a p tag to the body, then insert italicized text into the p tag
d3.select('body')
.append('p')
.attr('id', 'paragraph3')
.text('Here is the third paragraph. ')
.append('i')
.text('This paragraph contains some italicized text.');

/********** Part A **********/

// Problem 1
d3.select('#paragraph2')
.append('strong')
.text("This is some bold text.");

// Problem 2
d3.select('#paragraph1')
.text("Changed text for problem 2.");

// Problem 3
d3.selectAll('p')
.append('i')
.text(" Appended italicized text for problem 3.");

/********** Part B **********/

// Uncomment this example code when you are ready to start part B
var dataset = ['one', 'two', 'three', 'four'];
d3.select('body').selectAll('h2')
.data(dataset)
.enter()
.append('h2')
.text(function(d) {
  return d;
});

// Problem 1
/*
We get that three <h2> elements are created with the text
'two' 'three' and 'four'. This is because when we do selectAll
the function recognizes the first tag and then creates three more
that it needs for the remaining elements of the data set. We only see
the last three because the .text() function is only applied to the
last three.
*/

// Problem 2
// select() vs. selectAll() does some weird stuff

var food_list = ['apples','pizza','success','pineapple','money'];
var problem2_list = d3.select('#favorite_foods')
.selectAll('li')
.data(food_list)
.enter()
.append('li')
.text(function(d) {
  return d;
});


// Problem 3
var image_sizes = [200,400,600,800];
var images = d3.select('img')
.data(image_sizes)
.enter()
.insert('img')
.attr('src','kitten.jpg')
.attr('width',function(d) { return d; })
.attr('height',function(d) { return d; });

// Problem 4
var section_names = ["Introduction",
"Overview",
"Implementation",
"Evaluation",
"Related Work",
"Conclusion"];
var sections = d3.select('h4')
.data(section_names)
.enter()
.append('h4')
.text(function(d,i) {return (i+1) + " " + d;});


/********** Part C **********/

// Problem 1 

var svg = d3.select('body').append('svg')
.attr('width', 200)
.attr('height', 200);

var redcircle = svg.append('circle')
.attr('r', 50)
.attr('cx', 100)
.attr('cy', 75)
.attr('fill', 'red')
.attr('fill-opacity', '0.75');

var greencircle = svg.append('circle')
.attr('r', 50)
.attr('cx', 75)
.attr('cy', 125)
.attr('fill', 'green')
.attr('fill-opacity', '0.75');


var bluecircle = svg.append('circle')
.attr('r', 50)
.attr('cx', 125)
.attr('cy', 125)
.attr('fill', 'blue')
.attr('fill-opacity', '0.75');


// Problem 2 

var svg2 = d3.select('body').append('svg')
.attr('width', 1000)
.attr('height', 200);

var radii = [5, 10, 15, 20, 25, 30, 25, 20, 15, 10, 5];

var lineofcircles = svg2.selectAll('circle')
.data(radii)
.enter()
.append('circle')
.attr('cy', 50)
.attr('cx', function(d,i) {return (i*60)+25;})
.attr('fill', 'black')
.attr('r', function(d) {return d;});


// Problem 3 

var svg3 = d3.select('body').append('svg')
.attr('width', 1000)
.attr('height', 200);

var p3data = [
{ r: 5, color: 'rgb(255, 0, 0)' },
{ r: 10, color: 'rgb(0, 255, 0)' },
{ r: 15, color: 'rgb(0, 0, 255)' },
{ r: 5, color: 'rgb(128, 128, 128)' },
{ r: 25, color: 'rgb(255, 0, 255)' },
{ r: 10, color: 'rgb(192, 255, 0)' },
{ r: 5, color: 'rgb(0, 128, 128)' }];

var coloredcircles = svg3.selectAll('circle')
.data(p3data)
.enter()
.append('circle')
.attr('cy', 50)
.attr('fill', function(d) {return d.color;})
.attr('r', function(d) {return d.r})
.attr('cx', function (d,i) {return (i*60) + 25;}); 


// Problem 4 

var svg4 = d3.select('body').append('svg')
.attr('width', 400)
.attr('height', 200);

var redrect = svg4.append('rect')
.attr('fill', 'rgb(235, 50, 50)')
.attr('x', 0)
.attr('y', 0)
.attr('width', 400)
.attr('height', 100);

var greenrect = svg4.append('rect')
.attr('fill', 'rgb(50, 200, 50)')
.attr('x', 0)
.attr('y', 100)
.attr('width', 400)
.attr('height', 100);

var bluerect = svg4.append('rect')
.attr('fill', 'rgb(50, 50, 225)')
.attr('x', 400)
.attr('y', 0)
.attr('width', 100)
.attr('height', 200);


svg4.on('mousemove', function() {
  var coord = d3.mouse(this); // Get the mouse position relative to the SVG element
  redrect.attr ('width', coord[0])
  .attr ('height', coord[1]);

  greenrect.attr ('width', coord[0])
  .attr ('y', coord[1])
  .attr ('height', 200 - coord[1]);
  
  bluerect.attr ('x', coord[0])
  .attr ('width', 500-coord[0]);
  
  console.log('Mouse is at ' + coord[0] + ', ' + coord[1]);
});





