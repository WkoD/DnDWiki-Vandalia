/*\
title: datumlang
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "datumlang";

exports.params = [
   { name: "datum" },
   { name: "yearonly" }
];

/*
Run the macro
*/
exports.run = function(datum, yearonly) {
   var dates = datum.split(".");
   
   var dateStart = dates[0].split("-");
   var dateEnd = dates[dates.length - 1].split("-");
   var result;

   // Jahr setzen
   var ret = "//";

   if (!dateStart[0]) {
      ret += "????";
   } else {
      ret += dateStart[0];
   }
   
   if (dates.length > 1) { 
      if (!dateEnd[0]) {
         ret += " -  ????";
      } else if (dateStart[0] != dateEnd[0]) {
         ret += " - " + dateEnd[0];
      }
   }
   
   ret += " DR//<br>";
   
if (!yearonly) {
   // Monat und Tag setzen
   if (dateStart.length > 1) {
      ret += "//";
   
      result = require("$:/_my/Macro/Library").getMonatTag(dateStart[1], dateStart[2]);

      if (result[1]) {
         ret += result[1] + ". ";
      }

      ret += result[0];

      if (dates.length > 1) {
         ret += " - ";
         result = require("$:/_my/Macro/Library").getMonatTag(dateEnd[1], dateEnd[2]);

         if (result[1]) {
            ret += result[1] + ". ";
         }

         ret += result[0];
      }
      
      ret += "//";
   }
}

   return ret;
};

})();