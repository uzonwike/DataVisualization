var display = document.querySelector('#display');
var cur = 0;
var prev = 0;
var operation = "";
var equals = false;


// Set an event handler for the clear button
document.querySelector('#clear').onclick = function() {
    cur = 0;
    prev = 0;
    display.innerText = cur;
};

document.querySelector('#equals').onclick = function() {
    performOp();
    equals = true;
};

document.querySelector('#plus').onclick = function() {
    performOp();
    prev = cur;
    cur = 0;
    operation = "plus";
};

document.querySelector('#minus').onclick = function() {
    performOp();
    prev = cur;
    cur = 0;
    operation = "minus";
};

document.querySelector('#multiply').onclick = function() {
    performOp();
    prev = cur;
    cur = 0;
    operation = "multiply";
};

document.querySelector('#divide').onclick = function() {
	performOp();
    prev = cur;
    cur = 0;
    operation = "divide";
};

function performOp() {
	if (operation == "plus") {
        /*learned about unary plus operator from 
          http://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers */
        cur = +cur + +prev;
    } else if (operation == "minus") {
    	cur = +prev - +cur;
    } else if (operation == "multiply") {
    	cur = +cur * +prev;
    } else if (operation == "divide") {
    	cur = Math.round(+prev / +cur);
    }
    operation = "";
    display.innerText = cur;
}

function writeOn(input) {
    if (cur == '0' || equals == true) {
        cur = input;
        equals = false;
    }
    else {
        cur += input;
    }
    display.innerText = cur;
}

// Set an event handler for the zero button
document.querySelector('#zero').onclick = function() {
    writeOn('0');
};
document.querySelector('#one').onclick = function() {
    writeOn('1');
};
document.querySelector('#two').onclick = function() {
    writeOn('2');
};
document.querySelector('#three').onclick = function() {
    writeOn('3');
};
document.querySelector('#four').onclick = function() {
    writeOn('4');
};
document.querySelector('#five').onclick = function() {
    writeOn('5');
};
document.querySelector('#six').onclick = function() {
    writeOn('6');
};
document.querySelector('#seven').onclick = function() {
    writeOn('7');
};
document.querySelector('#eight').onclick = function() {
    writeOn('8');
};
document.querySelector('#nine').onclick = function() {
    writeOn('9');
};






