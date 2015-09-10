
angular.module('opRoutes', [])
  .config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('tasks', {
      url: '/tasks',
      templateUrl: '/partials/tasks.html',
      controller: 'TasksCtrl',
      resolve: {
        postPromise: ['tasks', function(tasks){
          return tasks.getAll();
        }]
      }
    })
    .state('done', {
      url: '/done',
      templateUrl: '/partials/done.html',
      controller: 'DoneCtrl',
      resolve: {
        postPromise: ['tasks', function(tasks){
          return tasks.getAllClosed();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/partials/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/partials/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

  $urlRouterProvider.otherwise('home');
}]);
