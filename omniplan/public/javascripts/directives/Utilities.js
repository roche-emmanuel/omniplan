angular.module('Utilities', [])

.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          console.log("Executing enter directive.");
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
})

.directive("fillHeight", ['$window', function($window) {
  return {
    link: function(scope, elem, attrs) {
      var onResize = function() {
        var offset = elem.offset();
        var hh = $(window).height();
        console.log("Window height: "+hh+", offset.top: "+offset.top);

        var diff = hh - offset.top;
        elem.height(diff);
      };

      onResize();

      scope.$watch(function(scope) {
        return elem.offset().top;
      },onResize);

      angular.element($window).bind('resize', function() {
          onResize();
          scope.$apply();
      });
    }
  };
}])

.directive("scrollable", [function () {
  return {
    link: function (scope, elem) {
      elem.mCustomScrollbar({
        autoHideScrollbar: false,
        theme: 'dark',
        scrollInertia: 500,
        advanced:{
          updateOnContentResize: true
        }
      });
    }
  };
}]);
