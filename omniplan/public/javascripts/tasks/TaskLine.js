// Module used to handle the display of a TaskLine.

angular.module('TaskLine', [])

.directive('nvTaskLine', function () {
  return {
    scope: {
      task: '=opTask'
    },
    restrict: 'AE',
    replace: true,
    templateUrl: 'tasks/taskline.html',
    controller: 'TaskLineCtrl',
    // controllerAs: 'ctrl',
    // link: function(scope, elem, attrs) {
    //   // elem.bind('click', function() {
    //   //   elem.css('background-color', 'white');
    //   //   scope.$apply(function() {
    //   //     scope.color = "white";
    //   //   });
    //   // });
    //   // elem.bind('mouseover', function() {
    //   //   elem.css('cursor', 'pointer');
    //   // });
    // }
  };
})

.controller('TaskLineCtrl', [
'$scope','tasks','auth','$interval','tags','utils',
function($scope,tasks,auth,$interval,tags,utils){
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

  $scope.addTag = function(task,tagName) {
    console.log("Should add tag "+tagName+" to task "+task.title);
    // Retrieve the tag object by its name from the
    // tags factory:
    var tag = utils.findByKey(tags.tags,'name',tagName);
    if(!tag) {
      console.warn("Undefined tag with name "+tagName)
    }
    else {
      tasks.addTag(task,tag);
    }
  };

  $scope.removeTag = function(task,tagName) {
    console.log("Should remove tag "+tagName+" from task "+task.title);
    // Retrieve the tag object by its name from the
    // tags factory:
    var tag = utils.findByKey(tags.tags,'name',tagName);
    if(!tag) {
      console.warn("Undefined tag with name "+tagName)
    }
    else {
      tasks.removeTag(task,tag);
    }
  };

}]);
;