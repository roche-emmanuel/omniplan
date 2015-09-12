angular.module('TagController', ['opAuthFactory','TagFactory'])
.controller('TagsCtrl', [
'$scope','tags','auth',
function($scope,tags,auth){
  $scope.tags = tags.tags;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addTag = function(){
    if(!$scope.tagName || $scope.tagName === '') { return; }
    
    tags.create({
      name: $scope.tagName,
      color: $scope.tagColor,
    });

    $scope.tagName = '';
    $scope.tagColor = '';
  };

  $scope.deleteTag = function(tag) {
    // console.log("Should delete task '"+task.title+"'");
    tags.destroy(tag);
  };

}]);
