/*\
title: marklink
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "marklink";

exports.params = [
   { name: "title" },
   { name: "tag" }
];

/*
Run the macro
*/
exports.run = function(title, tag) {
   var tiddler = this.wiki.getTiddler(title);

   if (tiddler && tiddler.hasTag(tag)) {
      return "__[[" + title + "]]__";
   } else {
      return "[[" + title + "]]";
   }
};

})();