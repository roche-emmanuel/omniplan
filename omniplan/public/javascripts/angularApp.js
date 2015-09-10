var app = angular.module('omniPlan', ['ui.router','opRoutes','opAuth']);

app.controller('TasksCtrl', [
'$scope','tasks','auth',
function($scope,tasks,auth){
  $scope.tasks = tasks.tasks;
  $scope.isLoggedIn = auth.isLoggedIn;

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
}]);


app.factory('posts', ['$http','auth',function($http,auth){
  var o = {
    posts: []
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
    return $http.post('/posts', post, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        post.upvotes += 1;
      });
  };

  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote',null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        comment.upvotes += 1;
      });
  };

  return o;
}]);

app.factory('tasks', ['$http','auth',function($http,auth){
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

  o.getAll = function() {
    return $http.get('/tasks/state/opened',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.tasks);
    });
  };

  o.getAllClosed = function() {
    return $http.get('/tasks/state/closed',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.closed_tasks);
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

  return o;
}]);

app.controller('MainCtrl', [
'$scope','posts','auth',
function($scope,posts,auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.posts = posts.posts;
  // $scope.posts = [
  //   {title: 'post 1', upvotes: 5},
  //   {title: 'post 2', upvotes: 2},
  //   {title: 'post 3', upvotes: 15},
  //   {title: 'post 4', upvotes: 9},
  //   {title: 'post 5', upvotes: 4}
  // ];

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });

    // $scope.posts.push({
    //   title: $scope.title,
    //   link: $scope.link,
    //   upvotes: 0,
    //   comments: [
    //     {author: 'Joe', body: 'Cool post!', upvotes: 0},
    //     {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
    //   ]
    // });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
    // post.upvotes += 1;
  };
}]);

app.controller('DoneCtrl', [
'$scope','tasks','auth',
function($scope,tasks,auth){
  $scope.tasks = tasks.closed_tasks;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.deleteTask = function(task) {
    tasks.destroy(task);
  };

  $scope.reopenTask = function(task) {
    tasks.setState(task,"opened");
  };   
}]);

app.controller('PostsCtrl', [
'$scope','posts','post','auth',
function($scope,posts,post,auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  // $scope.post = posts.posts[$stateParams.id];
  $scope.post = post;

  $scope.addComment = function(){
  if($scope.body === '') { return; }
  posts.addComment(post._id, {
    body: $scope.body,
    author: 'user',
  }).success(function(comment) {
    $scope.post.comments.push(comment);
  });

  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };

  $scope.body = '';
};
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

