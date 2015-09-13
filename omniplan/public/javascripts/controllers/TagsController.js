angular.module('TagController', ['opAuthFactory','TagFactory',"Utils"])
.controller('TagsCtrl', [
'$scope','tags','auth','utils',
function($scope,tags,auth,utils){
  $scope.tags = tags.tags;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addTag = function(){
    if(!$scope.tagName || $scope.tagName === '') { return; }
      
    // Create random color if needed:
    if(!$scope.tagBgColor || $scope.tagBgColor=='') {
      $scope.tagBgColor = utils.getRandomColor();
      // console.log("Generating random bg color: "+ $scope.tagBgColor);
    }
    if(!$scope.tagFgColor || $scope.tagFgColor=='') {
      // Auto computing the foreground based on the background color:
      // see: http://dennis.dieploegers.de/finding-the-right-foreground-color-for-a-random-background-color/
      // Perceived luminance is: L = R * 0.299 + G * 0.587 + B * 0.114
      var L = utils.getColorLuminance($scope.tagBgColor); 
      $scope.tagFgColor = L > 0.5 ? '#000000' : '#ffffff';
      // console.log("Generating random fg color: "+ $scope.tagFgColor);
    }

    // console.log("fgColor="+ $scope.tagFgColor+", bgColor="+ $scope.tagBgColor);

    tags.create({
      name: $scope.tagName,
      fgColor: $scope.tagFgColor,
      bgColor: $scope.tagBgColor,
    });

    $scope.tagName = '';
    $scope.tagFgColor = '';
    $scope.tagBgColor = '';
  };

  $scope.deleteTag = function(tag) {
    // console.log("Should delete task '"+task.title+"'");
    tags.destroy(tag);
  };

}]);
