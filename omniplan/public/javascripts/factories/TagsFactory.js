angular.module('TagFactory', [])
.factory('tags', ['$http','auth',function($http,auth){
  var o = {
    tags: [],
  };

  var removeById = function(array,id) {
    for(var i = 0; i < array.length; i++) {
      var obj = array[i];

      if(obj._id == id) {
        // console.log("Removing local tag with id "+data._id);
        array.splice(i, 1);
        return;
      }
    }
  };

  o.getAll = function() {
    return $http.get('/tags',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.tags);
    });
  };

  o.create = function(tag) {
    return $http.post('/tags', tag, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.tags.push(data);
    });
  };

  o.destroy = function(tag) {
    // console.log("Asking for delete of tag with id "+tag._id);
    // console.log("Using authorization token: "+auth.getToken());

    return $http.delete('/tags/' + tag._id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      removeById(o.tags,data._id);
    });
  };

  return o;
}]);
