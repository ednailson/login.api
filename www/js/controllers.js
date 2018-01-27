angular.module('my.controllers', ['ngRoute', 'my.routes','my.services'])

.controller('HomeCtrl', function($scope, $rootScope){

})

.controller('LoginCtrl', function($scope, $rootScope, AuthService, $location){
  $scope.user = {
    name: '',
    password: ''
  };
  $rootScope.alertLogin = null;

  $scope.login = function(){
    AuthService.login($scope.user).then(function(msg){
      console.log('Login realizado com sucesso');
      $rootScope.alertLogin = true;
      location.replace('#/user');
    }, function(errMessage){
      $rootScope.alertLogin = false;
      console.log("Erro no login");
      location.replace('#/');
    })
  };
})

.controller('RegisterCtrl', function($scope, $rootScope, AuthService, $location){
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.signup = function(){
    AuthService.register($scope.user).then(function(msg){
      console.log('Cadastro realizado com sucesso');
      $rootScope.alertRegister = true;
      location.replace('#/');
    }, function(errMessage){
      console.log("Erro no cadastro");
      $rootScope.alertRegister = false;
    })
  };
})

.controller('UserCtrl', function($scope, $rootScope, AuthService, API_ENDPOINT, $http, $location){
  $scope.destroySession = function(){
    AuthService.logout();
  };
  $scope.getInfo = function(){
    $http.get(API_ENDPOINT.url + '/userinfo').then(function(result){
      $scope.userinfo = result.data.msg;
    })
  };
  $scope.logout = function(){
    AuthService.logout();
    location.replace('#');
  };
})

.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS){
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    window.location = "#/";
  })
})
