angular.module('ActivityController', ['opAuthFactory','TaskFactory','ActivityFactory','Utils'])
.controller('ActivityCtrl', [
'$scope','tasks','auth','$interval','activity','utils',
function($scope,tasks,auth,$interval,activity,utils){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.days = activity.days;

}]);
