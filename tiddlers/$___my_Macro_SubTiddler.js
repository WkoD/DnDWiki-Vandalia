/*\
title: subtiddler
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "subtiddler";

exports.params = [
   { name: "title"},
   { name: "sub" },
   { name: "text" }
];

/*
Run the macro
*/
exports.run = function(title, sub, text) {
   var tiddler = this.wiki.getTiddler(title + "#" + sub);
   var ret = "";
   
   if (tiddler) {
	   if (text) {
		   ret += "<h3>" + text + "</h3>";
	   } else {
		   ret += "<h3>" + sub + "</h3>";
	   }
	   
	   ret += "<$transclude tiddler=\"" + tiddler.fields.title + "\"/>";
   }
	
   return ret;
};

})();