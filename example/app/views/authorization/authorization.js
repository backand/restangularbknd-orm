'use strict';

angular.module('myApp.authorization', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/authorization', {
    templateUrl: 'views/authorization/authorization.html',
    controller: 'authorizationCtrl'
  });
}])

.controller('authorizationCtrl', ['$scope', 'Backand','BackandORM', '$log','$cookieStore', function ($scope, Backand, BackandORM, $log, $cookieStore) {

    $scope.user = "guest@backand.com";
    $scope.password = "guest1234";
    $scope.appName = "restdemo";

    $scope.signIn = function () {
        console.log("authentication");

        $scope.result = "connecting...";
        Backand.signin($scope.user, $scope.password, $scope.appName)
        .then(
            function (token) {
                $cookieStore.put(Backand.configuration.tokenName, token);
                BackandORM.setCredentials(token);
                BackandORM.config();
                $scope.result = "authenticated";
            },
            function (data, status, headers, config) {
                $log.debug("authentication error", data, status, headers, config);
                $scope.result = "failed to authenticate";

            }
        );

    };

    $scope.signOut = function () {
        $scope.result = null;
    };

    $scope.result = null;

}]);