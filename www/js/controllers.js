angular.module('my.controllers', ['ngRoute', 'my.routes','my.services'])

.controller('HomeCtrl', function($scope, $rootScope, $location){
  if (window.localStorage.getItem('token')) window.location = "#/user";
})

.controller('LoginCtrl', function($scope, $rootScope, AuthService, $location){
  if (window.localStorage.getItem('token')) window.location = "#/user";
  $rootScope.alertRegister = null;
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
  if (window.localStorage.getItem('token')) window.location = "#/user";
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
      $rootScope.alertRegister = false;
      location.replace('#/');
    })
  };
})

.controller('UserCtrl', function($scope, $rootScope, AuthService, API_ENDPOINT, $http, $location){

  //Verificando se há token no localStorage, se não, é redirecionado
  if (!window.localStorage.getItem('token')) window.location = "#/";
  $rootScope.alertRegister = null; //Controle para sumir alerta na home caso a view seja mudada


  $scope.getInfo = function(){
    $http.get(API_ENDPOINT.url + '/userinfo').then(function(result){
      $scope.userinfo = result.data.msg;
    })
  };

  //função para o logout
  $scope.logout = function(){
    AuthService.logout();
    location.replace('#/');
  };
  
})

.controller('EditCtrl', function($scope, $rootScope, AuthService, API_ENDPOINT, $http, $location){
  if (!window.localStorage.getItem('token')) window.location = "#/";

})

.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS){
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    window.location = "#/";
  })
})
