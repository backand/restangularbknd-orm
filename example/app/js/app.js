'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'angularFileUpload',
  'myApp.authorization',
  'myApp.list',
  'myApp.item',
  'myApp.files',
  'restangularbknd-orm'
])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/authorization'});
}]);


myApp.run(function (RestangularBknd, SessionService) {
    RestangularBknd.config();
    RestangularBknd.setCredentials(SessionService.getAuthHeader());
});