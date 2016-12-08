angular.module('starter.service',[])

.factory("myFactory", function()  {
  var savedData = {}

  function set(data) {
    savedData.src = data; 
  }

  function get() {
    return savedData; 
  }

  return {
      set : set,
      get : get 
  }
})  