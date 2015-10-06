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

  var loadTaskContent = function(task) {
    task.startTime = Date.parse(task.startTime);
    (function(task) {
      $http.get('/tasks/'+task._id+'/tags',{
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
        angular.copy(data, task.tags);
        // console.log("Tags list for task "+task.title+": "+ JSON.stringify(task.tags));
      });
    }(task));
  };

  var populateTask = function(array) {
    for(var i = 0; i < array.length; i++) {
      var task = array[i];
      loadTaskContent(task);
     }
  };

  // Method used to populate the content of a task from cached data or
  // retrieve the data from the server if required:
  o.retrieveTask = function(task) {
    var id = task._id;

    // Check if the data is available in the cached tasks:
    for(var i=0;i<o.tasks.length;++i) {
      if(o.tasks[i]._id == id) {
        console.debug("Retrieving task "+id+" from cached list.");
        angular.copy(o.tasks[i], task);
        return;
      }
    }

    // Check if the data is available in the cached closed tasks:
    for(var i=0;i<o.closed_tasks.length;++i) {
      if(o.closed_tasks[i]._id == id) {
        console.debug("Retrieving closed task "+id+" from cached list.");
        angular.copy(o.closed_tasks[i], task);
        return;
      }
    }

    // Task was not found so far, should retrieve it from the server:
    return $http.get('/tasks/' + id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      // We retrieved the selected task, so we can populate the table:
      console.debug("Retrieving task "+id+" from server.");
      angular.copy(data,task);

      loadTaskContent(task);
    });

    // console.error("Could not retrieve task "+id+" from cached list: "+JSON.stringify(o.tasks));
    // console.error("Should retrieve task from server (not implemented yet)");
  };

  o.getAll = function() {
    return $http.get('/tasks/state/opened',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.tasks);
      populateTask(o.tasks);
    });
  };

  o.getAllClosed = function() {
    return $http.get('/tasks/state/closed',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.closed_tasks);
      populateTask(o.closed_tasks);
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

  o.hasTag = function(task, tag) {
    for(var i=0;i<task.tags.length;++i) {
      if(task.tags[i]._id == tag.id) {
        return true;
      }
    }
    return false;
  };

  o.removeTag = function(task, tag) {
    return $http.delete('/tasks/' + task._id + '/tag/' + tag._id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      // The data we receive should be the tag object itself.
      utils.removeById(task.tags,tag._id);
    });        
  };

  return o;
}]);
