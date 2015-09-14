angular.module('EnterDirective', [])
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
});