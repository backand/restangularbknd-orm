'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'angularFileUpload',
  'restangular',
  'myApp.authorization',
  'myApp.list',
  'myApp.files',
  'backand',
  'backand.utils',
  'backand.orm'
])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/authorization'});
}])
.run(function (Backand, BackandORM) {

});