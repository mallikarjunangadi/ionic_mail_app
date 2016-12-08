angular.module('starter.filter', [])

.filter('toDateFilter', function() {
   return function(dateString) {

     var date = "";
    var dateVar = dateString.substr(4,20);
     var now = new Date().toString().substr(4,11);

     if(now != dateVar.substr(0,11)) {
         date = dateVar.substr(0,6);
     } else { 
        var t = dateVar.substr(12);
        var arr = t.split(':');

        if(arr[0]>12) { 
            date = arr[0]-12+":"+arr[1]+"pm";
        } else {
            date = arr[0]+":"+arr[1]+"am";
        }
     }  
    return date; 
   } 
}) 
 