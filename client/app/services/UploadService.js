'use strict';

angular
    .module('myApp.services')
    .factory('UploadService', UploadService);

UploadService.$inject = ['$http', 'ConfigService'];
function UploadService($http, ConfigService) {

    var apiEndpoint = ConfigService.GetEndpoint();

    var service = {};
    service.Upload = Upload;
    service.Delete = Delete;
    service.Get = Get;
    return service;

    function Upload(file) {
        //return $http.post(apiEndpoint + 'fileupload', upload).then(handleSuccess, handleError('Error creating upload'));

        return $http({
            method: 'POST',
            url: apiEndpoint + 'fileupload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                avatar: file
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];
                return formData;
            }
        })
            .success(function (data) {
                handleSuccess(data);
            })
            .error(function (data, status) {
                handleError(data);
            });
    }
    function Delete(id) {
        return $http.delete(apiEndpoint + 'fileupload/' + id).then(handleSuccess, handleError('Error deleting upload'));
    }
    function Get(id) {
        return $http.get(apiEndpoint + 'fileupload/' + id).then(handleSuccess, handleError('Error deleting upload'));
    }
    // private functions

    function handleSuccess(res) {
        console.log('API response:' + JSON.stringify(res.data));
        return { success: true, data: res.data };
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }
}