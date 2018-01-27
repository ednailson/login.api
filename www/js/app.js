'use strict';
angular.module('starter', ['ngRoute','my.controllers', 'my.routes','my.services'])


// .run(function($rootScope, $state, AuthService, AUTH_EVENTS){
//   $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState){
//     if(!AuthService.isAuthenticated()){
//
//     }
//   })
// })

// .config(function($stateProvider, $urlRouterProvider) {
//   $stateProvider
//   .state('home', {
//     url: '/',
//     abstract: true,
//     templateUrl: 'templates/home.html'
//   })
//   .state('home.login', {
//     url: '/login',
//     templateUrl: 'templates/login.html',
//     controller: 'LoginCtrl'
//   })
//   .state('home.register', {
//     url: '/register',
//     templateUrl: 'templates/register.html',
//     controller: 'RegisterCtrl'
//   })
//
//   $urlRouterProvider.otherwise('/')
// })
