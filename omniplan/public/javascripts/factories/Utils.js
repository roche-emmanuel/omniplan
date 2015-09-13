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

  return obj;
}]);
