/**
 Comb.js 
 Created by: Dominic Charley-Roy
 ========================
	
 Copyright (C) 2011 by Dominic Charley-Roy

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

// Extend the trim functionality of strings if the browser is IE
if (!String.prototype.trim){
	String.prototype.trim = function(){
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
}

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
		if (tokens.length > 1){
			tokens.shift();
			total = elements.length;
			while (total-- > 0)
				// Must use slice to clone the array and pass it 'by value'
				elements = elements.concat(innerComb(elements.shift(), tokens.slice(0))) 
		}
		
		return elements;
	}

	// Check if an array of selectors was passed, or a single selector
	var elements = [];
	if (typeof selector == 'string')
		elements = innerComb(document, selector.split('>'));
	else if (selector instanceof Array)
		for (var i = 0; i < selector.length; i++)
			elements = elements.concat(innerComb(document, selector[i].split('>')));

	// Apply the function if there is any to each element, passing the element as an argument
	if (fn)
		for (var i = 0; i < elements.length; i++)
			fn(elements[i]);

	return elements;

}