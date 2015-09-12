angular.module('TaskController', ['opAuthFactory','TaskFactory'])
.controller('TasksCtrl', [
'$scope','tasks','auth','$interval',
function($scope,tasks,auth,$interval){
  $scope.tasks = tasks.tasks;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentTime = Date.now();

  var tick = function() {
    $scope.currentTime = Date.now();
  };
  $interval(tick, 1000);

  $scope.addTask = function(){
    if(!$scope.title || $scope.title === '') { return; }
    
    tasks.create({
      title: $scope.title,
      description: $scope.description,
    });

    $scope.title = '';
    $scope.description = '';
  };

  $scope.deleteTask = function(task) {
    // console.log("Should delete task '"+task.title+"'");
    tasks.destroy(task);
  };

  $scope.closeTask = function(task) {
    // console.log("Should delete task '"+task.title+"'");
    tasks.setState(task,"closed");
  };

  $scope.startTask = function(task) {
    // console.log("Should delete task '"+task.title+"'");
    tasks.startTimer(task,1.0);
  };   

  $scope.stopTask = function(task) {
    // console.log("Should delete task '"+task.title+"'");
    tasks.stopTimer(task);
  };

  $scope.isRunning = function(task) {
  	return task.running;
  };

}]);
