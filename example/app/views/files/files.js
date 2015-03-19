'use strict';

angular.module('myApp.files', ['ngRoute'])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/files', {
            templateUrl: 'views/files/files.html',
            controller: 'filesCtrl'
        });
    }])


.controller('filesCtrl', ['$scope','BackandUtils',
    function ($scope, BackandUtils) {
        $scope.fileSelected = function ($files) {
            $scope.val = '';
            $scope.errorMessage = '';
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                BackandUtils.uploadFile(file, "Employees", "Attachments")
                    .then(function (result) {
                        if (result.success) {
                            $scope.val = result.url;
                        } else {
                            $scope.errorMessage = result.message;
                        }
                    });
            }
        }
    }]);