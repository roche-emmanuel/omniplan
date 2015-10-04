angular.module('ActivityFactory', [])
.factory('activity', ['$http','auth','tasks','utils',function($http,auth,tasks,utils){
  var o = {
    days: [],
  };

  // Method used to sort the days array:
  var sortDays = function() {
    o.days.sort(function(d1,d2) {
      // We need to sort from newest to oldest:
      return d2.date.getTime() - d1.date.getTime();
    });
  };

  // Simple helper methods to sort a session array:
  var sortSessions = function(sessions) {
    sessions.sort(function(s1,s2) {
      return s2.startTime - s1.startTime;
    });
  };

  // method to retrieve an existing day table or create one if missing:
  var getOrCreateDayTable = function(date) {
    // Check if that day exists in the day list:
    for(var i = 0; i < o.days.length; i++) {
      if(o.days[i].date == date) {
        console.debug("Found existing day table for date: "+date);
        return o.days[i];
      }
    }

    // Need to create a new day table:
    console.debug("Creating a new day table for date: "+date);
    var dayt = {
      date: date,
      groupByTask: true,
      caption: date.toDateString(),
      sessions: [],
      tasks: [],
      completeDuration: 0.0,

    };

    // We could directly insert that day at the proper location in
    // the day list, but it would be more robust to sort that list 
    // afterwards:
    o.days.push(dayt);

    sortDays();

    return dayt;
  };

  // Method used to create a new task array if not available yet for a 
  // given taskId
  var getOrCreateDayTask = function(dayt,taskId) {
    // Check if we already have a task description for this task ID:
    for(var i=0;i<dayt.tasks.length;++i) {
      if (dayt.tasks[i].task._id == taskId) {
        return dayt.tasks[i];
      }
    }

    // The task description doesn't exist yet, so we need to create a new one
    // and we simply push it at the end of the task desc list:
    var taskdesc = {
      task: {
        _id: taskId,
      },
      sessions: [],
      duration: 0.0,
    };

    //  We should query the task factory to populate this task object:
    tasks.retrieveTask(taskdesc.task);

    dayt.tasks.push(taskdesc);

    return taskdesc;
  };

  // Method used to add a task session into a task description list
  // if the session is not in there yet:
  var addTaskSession = function(taskdesc,session) {
    var id = session._id;
    for(var i=0;i<taskdesc.sessions.length;++i) {
      if(taskdesc.sessions[i]._id == id) {
        // This session is already in the list.
        // we simply update the data:
        angular.copy(session,taskdesc.sessions[i]);
        return;
      }
    }

    // The session was not found in the list so we need to add it here:
    taskdesc.sessions.push(session);

    // We sort the sessions:
    sortSessions(taskdesc.sessions);
  };

  // Method used to generate the list of tasks from a list of 
  // sessions. We assume here that the sessions are already sorted.
  var generateTaskList = function(dayt) {
    for(var i=0; i< dayt.sessions.length;++i) {
      // for each sessions we check what is the corresponding task:
      var tid = dayt.sessions[i].task;
      var taskdesc = getOrCreateDayTask(dayt,tid);
      var sid = dayt.sessions[i]._id;

      // then we check if we already have that session in the task description
      // for that day, and if not we add it:
      addTaskSession(taskdesc,dayt.sessions[i]);
    }

    // Once we have added all the tasks to the list for that day, we should sort
    // the tasks based on the most recent session time:
    dayt.tasks.sort(function(t1,t2) {
      // Sort from newest to oldest:
      return t2.sessions[0].startTime - t1.sessions[0].startTime;
    });
  };

  // Method used to compute the complete day work duration as well
  // as the duration per task
  var computeDayStats = function(dayt) {
    // for the complete day duration, we can simply iterate on all sessions in that day:
    var completeDur = 0.0;
    for(var i=0;i<dayt.sessions.length();++i) {
      // WARNING: we need to convert to number start/stop time for the following to
      // work:
      completeDur += (dayt.sessions[i].stopTime - dayt.sessions[i].startTime)/1000.0;
    }

    // Now compute the duration for each task:
    for(var i=0;i<dayt.tasks.length();++i) {
      var task = dayt.tasks[i];
      task.duration = 0.0;
      for(var j=0;j<task.sessions.length();++j) {
        task.duration += (task.sessions[j].stopTime - task.sessions[j].startTime)/1000.0;
      }
    }
  };

  // Method that we can use to retrieve all the sessions for a given day:
  o.getDay = function(date) {
    // Normalize the day date:
    date = utils.normalizeDayDate(date);

    var startTime = date.getTime();
    var endTime = startTime+86400000;

    return $http.post('/sessions/get', {startTime: startTime, endTime: endTime}, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      // Once we have received the list of sessions we populate the day table
      var dayt = getOrCreateDayTable(date);
      dayt.sessions = [];

      angular.copy(data, dayt.sessions);

      // Sort the sessions:
      sortSessions(dayt.sessions);

      // Generate the task list:
      generateTaskList(dayt);

      // Then we can update the day statistics:
      // We need to compute the complete day session duration.
      // as well as the duration per task.
      computeDayStats(dayt);
    });
  };

  o.getInitial = function() {
    // Get the content for some initial days:
    var d1 = normalizeDayDate(new Date());
    console.debug("Current date is: "+d1);
    getDay(d1);
    var d2 = normalizeDayDate(new Date(d1.getTime() - 8640000));
    console.debug("Yesterday was: "+d2);
    getDay(d2);
    var d3 = normalizeDayDate(new Date(d2.getTime() - 8640000));
    console.debug("Day before was: "+d3);
    getDay(d3);
  };

  return o;
}]);
