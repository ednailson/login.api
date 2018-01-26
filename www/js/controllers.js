angular.module('my.controllers', [])

.controller('LoginCtrl', function($scope, AuthService, $state){
  $scope.login = function(){

  };
})

.controller('RegisterCtrl', function($scope, AuthService, $state){
  $scope.signup = function(){

  };
})

.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state){
  $scope.destroySession = function(){

  };
  $scope.getInfo = function(){

  };
  $scope.logout = function(){

  };
})

.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS, $state){

})
