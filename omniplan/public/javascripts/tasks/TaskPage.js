// Module used to handle the display of a TaskLine.

angular.module('TaskPage', [])

.controller('TaskPageCtrl', [
'$log','$scope','tasks','auth','taskId',
function($log,$scope,tasks,auth,taskId){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.task = {_id: taskId};
  $log.debug("Retrieving task with id="+taskId);

  tasks.retrieveTask($scope.task);

  // Method used to add some note content to the current task.
  $scope.addNote = function(content) {
  	tasks.addNote($scope.task,content);
  };
}]);