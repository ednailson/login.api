angular.module('starter')

.service('AuthService', function($q, $http, $API_ENDPOINT){
  return{

  };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS){
  return{

  };
})

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
