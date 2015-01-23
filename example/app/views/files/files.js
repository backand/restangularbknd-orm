'use strict';

angular.module('myApp.files', ['ngRoute'])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/files', {
            templateUrl: 'views/files/files.html',
            controller: 'filesCtrl'
        });
}])


.controller('filesCtrl', ['$scope', 'SessionService', 'AngularFileUploadBkndService',
    function ($scope, SessionService, $fileupload) {
        $scope.fileSelected = function ($files, $event) {
            $scope.val = '';
            $scope.errorMessage = '';
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $fileupload.uploadFile(file, "Employees", "Attachments", SessionService.getAuthHeader())
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