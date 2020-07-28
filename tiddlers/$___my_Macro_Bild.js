/*\
title: bild
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "bild";

exports.params = [
   { name: "title" }
];

/*
Run the macro
*/
exports.run = function(title) {
   var tiddler = this.wiki.getTiddler(title);

   var ret = "";

   if (tiddler && tiddler.fields.bild) {
      var images = tiddler.fields.bild.split(",");

      for (var i = 0; i < images.length; ++i) {
         ret += buildPath(tiddler, images[i]);
      }
   }

   return ret;
};

function buildPath(tiddler, name) {

   var ret ="[img[";

   if (tiddler.hasTag("Ereignis")) {
      ret += "Ereignis/";
   } else if (tiddler.hasTag("Gegenstand") || tiddler.hasTag("Organisation")) {
      ret += "Gegenstand/";
   } else if (tiddler.hasTag("Person") || tiddler.hasTag("Gott")) {
      ret += "Person/";
   } else if (tiddler.hasTag("Spieler")) {
      ret += "Spieler/";
   } else if (tiddler.hasTag("Ort")) {
      ret += "Ort/";
   }

   return ret + name + "]]";
};

})();