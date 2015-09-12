angular.module('Filters', [])
.filter('toHMS', function ($filter) {
  return function (input, fractionSize) {
    if (isNaN(input)) {
      return "Not a number!";
    } else {
      // We have a valid number, we round it:
      var val = Math.floor(input+0.5);
      var nh = Math.floor(val/3600.0);
      var nmin = Math.floor( (val-nh*3600)/60 );
      var nsec = val-nh*3600-nmin*60;

      if(nh>0) {
        return sprintf("%02d:%02d:%02d",nh,nmin,nsec);
      }
      else if (nmin>0) {
        return sprintf("%02d:%02d min",nmin,nsec);
      }
      else {
        return sprintf("%02d secs",nsec);
      }
    };    
  };
});