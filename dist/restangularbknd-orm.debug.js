/*
 restangularbknd-orm v0.0.1 
 (coffee) Copyright 2014 Backand All rights reserved. https://backand.com 
 License: MIT
 */
(function() {
    'use strict';


    angular.module('restangularbknd-orm', ['restangular', 'ngCookies'])

    .factory('RestangularBknd', ['Restangular', 'CONSTS',
        function (Restangular, CONSTS) {
            return {
                config: function () {
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

                    Restangular.setBaseUrl(CONSTS.backandUrl + "/1/table/data");
                },
                setCredentials: function (token) {
                    Restangular.setDefaultHeaders({ Authorization: token });
                },
                clearCredentials: function () {
                    Restangular.setDefaultHeaders({ Authorization: '' });

                }
            }
        }


    ])
    .constant('CONSTS', { backandUrl: 'https://api.backand.com:8080' });
})();
;(function() {
  'use strict';

  function AuthService($http, CONSTS) {

    var self =this;

    self.signIn = function (userName, password, appName) {
      return $http({
        method: 'POST',
        url: CONSTS.backandUrl + '/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {
          grant_type : 'password',
          username : userName,
          password : password,
          appname: appName
        }
      }
      )};

    self.signUp = function (fullName, email, password) {
      return $http({
          method: 'POST',
          url: CONSTS.backandUrl + '/api/account/signUp',
          data: {
            fullName : fullName,
            email : email,
            password : password,
            confirmPassword : password
          }
        }
      )};

    self.forgot = function (email) {
      return $http({
          method: 'POST',
          url: CONSTS.backandUrl + '/api/account/SendChangePasswordLink',
          data: {
              username : email
          }
        }
      )};

    self.resetPassword = function (password, id) {
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

  }

    angular.module('restangularbknd-orm')
    .service('AuthService', ['$http', 'CONSTS', AuthService])

})();
;(function() {
  'use strict';

  function SessionService($rootScope, $cookieStore) {
    var self = this;

    this.currentUser = $cookieStore.get('globals') ? $cookieStore.get('globals').currentUser : undefined;

    this.getAuthHeader = function() {
      if (!self.currentUser) {
        return false
      }
      return 'bearer ' + self.currentUser.access_token;
    };

    this.getToken = function() {
      if (!self.currentUser) {
        return false
      }
      return self.currentUser.access_token;
    };


    this.setCredentials = function (serverData) {
      var user = {
        currentUser: {
          access_token : serverData.access_token
        }
      };

      self.currentUser = user.currentUser;

      $cookieStore.put('globals', user);
    };

    this.clearCredentials = function () {
      $cookieStore.remove('globals');
      self.currentUser = undefined;
    };
  }

    angular.module('restangularbknd-orm')
    .service('SessionService', ['$rootScope', '$cookieStore', SessionService])
})();
;(function () {
    'use strict';

    function AngularFileUploadBkndService($q, $upload, CONSTS) {
        var self = this;

        this.uploadFile = function (file, tableName, fieldName, token) {
            var response = $q.defer();
            $upload.upload({
                url: CONSTS.backandUrl + '/1/file/upload/'+tableName+'/'+fieldName,
                file: file,
                headers: {
                    'Authorization': token
                }
            }).success(function (data, status, headers, config) {
                var curr = {message : '' , url :'', success : false};

                if (data.files[0].success) {
                    curr.url = data.files[0].url;
                    curr.success = true;
                } else {
                    curr.message = data.files[0].error;
                    curr.success = false;
                }
                response.resolve(curr);
            }).error(function (data) {
                var curr = {message : '' , url :'', success : false};
                curr.message = data.Message;
                curr.success = false;
                response.resolve(curr);
            });

            return response.promise;
        };
    }

    angular.module('restangularbknd-orm')
        .service('AngularFileUploadBkndService', ['$q', '$upload', 'CONSTS', AngularFileUploadBkndService])
})();