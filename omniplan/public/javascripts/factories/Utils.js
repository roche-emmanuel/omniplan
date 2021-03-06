angular.module('Utils', [])
.factory('utils', [function(){
  var obj = {};

  // Implementation taken from: 
  // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  obj.getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  obj.colorToRGB = function(color) {
    var h = (color.charAt(0)=="#") ? color.substring(1,7):color;
    return { 
      r: parseInt(h.substring(0,2),16),
      g: parseInt(h.substring(2,4),16),
      b: parseInt(h.substring(4,6),16),
    };
  };

  // Compute the luminance of a color provided as hex string
  // eg. #FA6734 for instance.
  obj.getColorLuminance = function(color) {
    var rgb = obj.colorToRGB(color);
    // Perceived luminance is: L = R * 0.299 + G * 0.587 + B * 0.114
    var L = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114)/255.0;
    return L;
  };

  // Find an object in an array by key value
  obj.findByKey = function(array,key,val) {
    for(var i = 0; i < array.length; i++) {
      var obj = array[i];

      if(obj[key] == val) {
        return obj;
      }
    }
  };

  obj.removeById = function(array,id) {
    for(var i = 0; i < array.length; i++) {
      var obj = array[i];

      if(obj._id == id) {
        // console.log("Removing local task with id "+data._id);
        array.splice(i, 1);
        return;
      }
    }
  };

  // Method to ensure that a day date always contain the hours/mins/secs fields
  // set to zero.
  obj.normalizeDayDate = function(date) {
    return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
  };

  return obj;
}]);
