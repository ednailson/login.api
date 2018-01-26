angular.module('my.routes', [])

.config(function($routeProvider,$locationProvider){
  $routeProvider
  .when("/", {
    templateUrl : "/templates/home.html"
  })
  .when("/login", {
    templateUrl : "/templates/login.html",
    controller: "LoginCtrl"
  })
  .when("/register", {
    templateUrl : "/templates/register.html",
    controller: "RegisterCtrl"
  })
  .otherwise('/');
})
