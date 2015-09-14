angular.module('TaskFactory', [])
.factory('tasks', ['$http','auth','tags','utils',function($http,auth,tags,utils){
  var o = {
    tasks: [],
    closed_tasks: []
  };

  var removeById = function(array,id) {
    for(var i = 0; i < array.length; i++) {
      var obj = array[i];

      if(obj._id == id) {
        // console.log("Removing local task with id "+data._id);
        array.splice(i, 1);
        return;
      }
    }
  };

  var parseDates = function(array) {
    for(var i = 0; i < array.length; i++) {
      var task = array[i];
      task.startTime = Date.parse(task.startTime);
     }
  };

  o.getAll = function() {
    return $http.get('/tasks/state/opened',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.tasks);
      parseDates(o.tasks);
    });
  };

  o.getAllClosed = function() {
    return $http.get('/tasks/state/closed',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.closed_tasks);
      parseDates(o.closed_tasks);
    });
  };

  o.create = function(task) {
    return $http.post('/tasks', task, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.tasks.push(data);
    });
  };


  o.destroy = function(task) {
    // console.log("Asking for delete of task with id "+task._id);
    // console.log("Using authorization token: "+auth.getToken());

    return $http.delete('/tasks/' + task._id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      removeById(o.tasks,data._id);
      removeById(o.closed_tasks,data._id);
    });
  };

  o.setState = function(task,state) {
    return $http.put('/tasks/' + task._id + '/state/'+state, null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        if(task.state == state) {
          // Nothing to update.
          return;
        } 

        if(state=="opened") {
          // Open task:
          removeById(o.closed_tasks,data._id);
          o.tasks.push(data);
        }
        else {
          // closed task:
          removeById(o.tasks,data._id);
          o.closed_tasks.push(data);
        }
      });
  };

  o.startTimer = function(task,multiplier) {
    console.log("Should start the task here.");
    var body = {
      multiplier: multiplier,
    };

    return $http.put('/tasks/' + task._id + '/start', body, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      task.startTime = Date.parse(data.startTime);  // TODO: we might need an offset here ?
      task.running = data.running;
      console.log("Currenting running state: "+ task.running);
    });    
  };

  o.stopTimer = function(task) {
    console.log("Should stop the task here.");
    return $http.put('/tasks/' + task._id + '/stop', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      task.running = data.running;
      console.log("data.startTime: "+data.startTime)
      // task.startTime = Date.parse(data.startTime);
      task.totalTime = data.totalTime;
      console.log("Currenting running state: "+ task.running);
    });    
  };

  o.addTag = function(task, tag) {
    return $http.put('/tasks/' + task._id + '/tag/' + tag._id, null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      // The data we receive should be the tag object itself.
      task.tags.push(tag);
    });        
  };

  return o;
}]);
