/*\
title: karte
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "karte";

exports.params = [
   { name: "title" }
];

/*
Run the macro
*/
exports.run = function(title) {
   var tiddler = this.wiki.getTiddler(title);

   var ret = "";

   if (tiddler && tiddler.fields.karte) {
      var images = tiddler.fields.karte.split(",");

      for (var i = 0; i < images.length; ++i) {
		ret +="[img[images/";

		ret += "Karte/"

		ret += tiddler.fields.karte + "]]";
      }
   }

   return ret;
};

})();