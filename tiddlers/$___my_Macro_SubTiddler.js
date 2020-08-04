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
   { name: "heading" },
   { name: "tags" }
];

/*
Run the macro
*/
exports.run = function(title, sub, heading, tags) {
   var tiddler = this.wiki.getTiddler(title + "#" + sub);
   var ret = "";
   
   if (tiddler) {
	   if (heading) {
		  ret += "<h3>" + heading + "</h3>";
	   }
	   
	   if (tags) {
	      ret += "<$list filter=\"[title[" + tiddler.fields.title + "]tags[]sort[title]]\" template=\"$:/core/ui/TagTemplate\" />";
	   }
	   
       ret += "<$transclude tiddler=\"" + tiddler.fields.title + "\" mode=\"block\"/>";
   }
    
   return ret;
};

})();