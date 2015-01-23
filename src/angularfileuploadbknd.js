(function () {
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