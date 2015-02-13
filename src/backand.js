/**
 * Angular SDK to use with backand
 * @version v1.5.1 - 2015-01-05
 * @link https://backand.com
 * @author Itay Herskovits
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function () {
    'use strict';

    angular.module('backand', [])
        .provider('Backand', function () {

            // Configuration
            var Configurator = {};

            Configurator.init = function (object, config) {

                object.configuration = config;
                /**
                 * This is the apiURL to be used with Backand
                 */
                config.apiUrl = config.apiUrl || "https://api.backand.com:8080";
                object.setApiUrl = function (newApiUrl) {
                    config.apiUrl = newApiUrl;
                    return this;
                };
                object.setTokenName = function (newTokenName) {
                    config.tokenName = newTokenName;
                    return this;
                };
                config.tokenName = 'backand_token';
                config.token = null;

            }

            var globalConfiguration = {};
            Configurator.init(this, globalConfiguration);

            this.$get = ['$http', '$cookieStore', '$q', function ($http, $cookieStore, $q) {

                function createServiceForConfiguration(config) {
                    // Service
                    var service = {};

                    function signin(userName, password, appName) {
                        var deferred = $q.defer();
                        $http({
                            method: 'POST',
                            url: config.apiUrl + '/token',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj) {
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                }
                                return str.join("&");
                            },
                            data: {
                                grant_type: 'password',
                                username: userName,
                                password: password,
                                appname: appName
                            }
                        })
                            .success(function (data) {
                                config.token = 'bearer ' + data.access_token
                                deferred.resolve(config.token);
                            })
                            .error(function (err) {
                                deferred.reject(err);
                            });

                        return deferred.promise;
                    }

                    function signout() {
                        $cookieStore.remove(config.tokenName);
                    }

                    function signup(fullName, email, password) {
                        return $http({
                                method: 'POST',
                                url: CONSTS.backandUrl + '/api/account/signUp',
                                data: {
                                    fullName: fullName,
                                    email: email,
                                    password: password,
                                    confirmPassword: password
                                }
                            }
                        )
                    };

                    function forgotPassword(email) {
                        return $http({
                                method: 'POST',
                                url: CONSTS.backandUrl + '/api/account/SendChangePasswordLink',
                                data: {
                                    username: email
                                }
                            }
                        )
                    };

                    function resetPassword(password, id) {
                        return $http({
                            method: 'POST',
                            url: CONSTS.backandUrl + '/api/account/changePassword',
                            data: {
                                confirmPassword: password,
                                password: password,
                                token: id
                            }
                        });
                    };

                    Configurator.init(service, config);
                    service.signin = signin;
                    service.signout = signout;
                    service.signup = signup;
                    service.forgotPassword = forgotPassword;
                    service.resetPassword = resetPassword;

                    return service;
                }

                return createServiceForConfiguration(globalConfiguration);

            }];
        });

    angular.module('backand.utils', [])
        .provider('BackandUtils', function () {

            this.$get = ['$http', '$cookieStore', '$q', '$upload','Backand', function ($http, $cookieStore, $q, $upload, Backand) {

                function createUtilsForConfiguration(config) {
                    //Utils of Backand
                    var utils = {};

                    function uploadFile(file, tableName, fieldName) {
                        var response = $q.defer();
                        $upload.upload({
                            url: config.apiUrl + '/1/file/upload/' + tableName + '/' + fieldName,
                            file: file,
                            headers: {
                                'Authorization': config.token
                            }
                        }).success(function (data, status, headers, config) {
                            var curr = {message: '', url: '', success: false};

                            if (data.files[0].success) {
                                curr.url = data.files[0].url;
                                curr.success = true;
                            } else {
                                curr.message = data.files[0].error;
                                curr.success = false;
                            }
                            response.resolve(curr);
                        }).error(function (data) {
                            var curr = {message: '', url: '', success: false};
                            curr.message = data.Message;
                            curr.success = false;
                            response.resolve(curr);
                        });

                        return response.promise;
                    };

                    utils.uploadFile = uploadFile;

                    return utils;
                }

                return createUtilsForConfiguration(Backand.configuration);
            }]
        });

    angular.module('backand.orm', [])
        .provider('BackandORM', function () {

            this.$get = ['Restangular', 'Backand', function (Restangular, Backand) {

                function createORMForConfiguration(backandConfig) {
                    //ORM of Backand
                    var orm = {};
                    function config() {
                        Restangular.setResponseExtractor(function (response, operation) {
                            if (operation === 'getList' && !angular.isArray(response)) {
                                var newResponse = response.data;
                                return newResponse;
                            }
                            return response;
                        });

                        Restangular.setRestangularFields({
                            id: "__metadata.id",
                            route: "restangularRoute",
                            selfLink: "self.href"
                        });

                        Restangular.setBaseUrl(backandConfig.apiUrl + "/1/table/data");
                    };

                    function setCredentials(token) {
                        Restangular.setDefaultHeaders({ Authorization: token });
                    };

                    function clearCredentials() {
                        Restangular.setDefaultHeaders({ Authorization: '' });

                    }

                    orm.config = config;
                    orm.setCredentials = setCredentials;
                    orm.clearCredentials = clearCredentials;

                    return orm;

                }

                return createORMForConfiguration(Backand.configuration);
            }]
        });

})();
