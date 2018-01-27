angular.module('my.routes', ['ngRoute','my.controllers','my.services'])

.config(function($routeProvider,$locationProvider){
  $routeProvider
  .when("/", {
    templateUrl : "/templates/home.html",
    controller: "HomeCtrl"
  })
  .when("/login", {
    templateUrl : "/templates/login.html",
    controller: "LoginCtrl"
  })
  .when("/register", {
    templateUrl : "/templates/register.html",
    controller: "RegisterCtrl"
  })
  .when("/user", {
    templateUrl : "/templates/user.html",
    controller: "UserCtrl"
  })
  .otherwise('/');
})
