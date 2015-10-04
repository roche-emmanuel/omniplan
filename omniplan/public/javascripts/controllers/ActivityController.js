angular.module('ActivityController', ['opAuthFactory','TaskFactory','TagFactory','Utils'])
.controller('ActivityCtrl', [
'$scope','tasks','auth','$interval','tags','utils',
function($scope,tasks,auth,$interval,tags,utils){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.days = [
    { 
      caption: "Today",
      groupByTask: false,
      sessions: ["session1","session2"],
    },
    { 
      caption: "Yesterday",
      groupByTask: true,
      sessions: ["session3","session4"],
      tasks: [
        {
          task: "The Task",
          sessions: ["session5","session6"],
        }
      ],
    },
  ];

  // $scope.tasks = tasks.tasks;
  // $scope.currentTime = Date.now();

  // var tick = function() {
  //   $scope.currentTime = Date.now();
  // };
  // $interval(tick, 1000);

  // $scope.addTask = function(){
  //   if(!$scope.title || $scope.title === '') { return; }
    
  //   tasks.create({
  //     title: $scope.title,
  //     description: $scope.description,
  //   });

  //   $scope.title = '';
  //   $scope.description = '';
  // };

  // $scope.deleteTask = function(task) {
  //   // console.log("Should delete task '"+task.title+"'");
  //   tasks.destroy(task);
  // };

  // $scope.closeTask = function(task) {
  //   // console.log("Should delete task '"+task.title+"'");
  //   tasks.setState(task,"closed");
  // };

  // $scope.startTask = function(task) {
  //   // console.log("Should delete task '"+task.title+"'");
  //   tasks.startTimer(task,1.0);
  // };   

  // $scope.stopTask = function(task) {
  //   // console.log("Should delete task '"+task.title+"'");
  //   tasks.stopTimer(task);
  // };

  // $scope.isRunning = function(task) {
  // 	return task.running;
  // };

  // $scope.addTag = function(task,tagName) {
  //   console.log("Should add tag "+tagName+" to task "+task.title);
  //   // Retrieve the tag object by its name from the
  //   // tags factory:
  //   var tag = utils.findByKey(tags.tags,'name',tagName);
  //   if(!tag) {
  //     console.warn("Undefined tag with name "+tagName)
  //   }
  //   else {
  //     tasks.addTag(task,tag);
  //   }
  // };

  // $scope.removeTag = function(task,tagName) {
  //   console.log("Should remove tag "+tagName+" from task "+task.title);
  //   // Retrieve the tag object by its name from the
  //   // tags factory:
  //   var tag = utils.findByKey(tags.tags,'name',tagName);
  //   if(!tag) {
  //     console.warn("Undefined tag with name "+tagName)
  //   }
  //   else {
  //     tasks.removeTag(task,tag);
  //   }
  // };

}]);
