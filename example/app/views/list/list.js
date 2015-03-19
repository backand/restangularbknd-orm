'use strict';

angular.module('myApp.list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/list/list.html',
    controller: 'listCtrl'
  });
}])

.controller('listCtrl', ['$scope', '$log', 'Restangular', function ($scope, $log, Restangular) {

    $scope.fetchList = function () {
        $scope.result = "Connecting...";
        Restangular.all('Employees').getList({ pageSize: 5, filter: JSON.stringify([{ fieldName: "First_Name", operator: "contains", value: "j" }]) })
        .then(function (Employees) {
            $scope.result = "\n" + JSON.stringify(Employees, null, "\t");
        }, function (response) {
            $scope.handleError(response);
        });
    }

    $scope.handleError = function (response) {
        if (response.status == 401) {
            $scope.result = "Please sign in first.";
        }
        else {
            $scope.result = "Error: " + response.status;
        }
    }
}]);