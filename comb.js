/**
 Comb.js 
 Created by: Dominic Charley-Roy
 ========================
 
 Comb.js is an incredibly simple DOM traversal utility which allows you to
 query the DOM for elements matching a given selector. The comb function 
 returns an array of all the elements matching the passed selector. 
 
 Building a selector is simple. Selector rules are separated by the '>' character.
 
 Comb allows you to find elements matching the following rules:
 
 '#elementId' - This will search for an element matching the ID 'elementId'
 '.elementClass' - This will search for all elements with the 'elementClass' class
 'tag' - This will search for all elements with the 'tag' tag, such as 'p' or 'div'
 '*' - This will match all children nodes of the previously matched elements.
 
 Examples :
 - To find the element with the ID 'right', you would do:
	comb('#right');
 
 - To find all elements with the class 'large', you would do:
	comb('.large');
	
 - To find all div elements, you would do:
	comb('div')
 
 - To find all paragraph elements within a div with ID 'blueSquare', you would do:
    comb('#blueSquare>p')
	
 - To find all elements with class 'red' which are in a DIV, you would do:
	comb('div>.red')
	
 - To find all the children elements of an element with ID 'header', you would do:
	comb('#header>*');
	
 You may also apply an OR rule using the '|' token. 
 
 Examples :
 
 - To find all img elements within a div with either ID 'left' or ID 'right', you would do:
	comb('#left|#right>div')
	
 - To find all elements which either have a H1 or H2 tag, you would do:
	comb('h1|h2')
	
 You can
 also pass a function to be applied to all elements found by the comb function.
 
 If a function is passed, comb will call it and pass the element as a parameter.
 It essentially traverses the array of elements and calls the function on each
 element.

 Examples:
 
 - To alert the inner HTML of all elements with class 'red', you would do:
	comb('.red', function(element){
		alert(element.innerHTML);
	});

*//

function comb(selector, fn){
	// Recursive function which will process the selection on an element
	function innerComb(element, tokens){
		var elements = [],
			temp = [],
			total;
		
		// Check if there are any OR symbols (|) in the token
		if (tokens[0].indexOf('|') !== -1){
			temp = tokens[0].split('|');
			tokens.shift();
			for (var i = 0; i < temp.length; i++) elements = elements.concat(innerComb(element, [temp[i]].concat(tokens)));
			return elements;
		}
		
		tokens[0] = tokens[0].trim();
		switch(tokens[0].charAt(0)){
			// ID Selector
			case '#':
				elements.push(document.getElementById(tokens[0].substr(1)));
				break;
			// Class Selector
			case '.':
				temp = element.getElementsByClassName(tokens[0].substr(1));
				for (var i = 0; i < temp.length; i++) elements.push(temp.item(i));
				break;
			// Recursive Selector
			case '*':
				for (var i = 0; i < element.childNodes.length ; i++) elements.push(element.childNodes[i]);
				break;
			// Tag selector:
			default:
				temp = element.getElementsByTagName(tokens[0]);
				for (var i = 0; i < temp.length; i++) elements.push(temp.item(i));
		}
		
		// If we still have tokens left, loop through every element
		// and recurse through the comb function
		if (tokens.length !== 1){
			tokens.shift();
			total = elements.length;
			while (total-- > 0)
				elements = elements.concat(innerComb(elements.shift(), tokens))
		}
		
		return elements;
	}

	var elements = innerComb(document, selector.split('>'));

	// Apply the function if there is any to each element, passing the element as an argument
	if (fn)
		for (var i = 0; i < elements.length; i++)
			fn(elements[i]);

	return elements;

}