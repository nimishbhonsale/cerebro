'use strict';

angular
    .module('myApp.services')
    .factory('MediaService', MediaService);

MediaService.$inject = ['$http', 'ConfigService'];
function MediaService($http, ConfigService) {
    var apiEndpoint = ConfigService.GetEndpoint();
    function GetAll() {
        return $http.get(apiEndpoint + 'media').then(handleSuccess, handleError('Error getting all media'));
    }

    function GetById(id) {
        return $http.get(apiEndpoint + 'media/' + id).then(handleSuccess, handleError('Error getting media by id'));
    }

    function GetByName(name) {
        return $http.get(apiEndpoint + 'media?name=' + name).then(handleSuccess, handleError('Error getting media by name'));
    }

    function Create(media) {
        console.log(media);
        return $http.post(apiEndpoint + 'media', media).then(handleSuccess, handleError('Error creating media'));
    }

    function Update(media) {
        return $http.put(apiEndpoint + 'media/' + media._id, media).then(handleSuccess, handleError('Error updating media'));
    }

    function Delete(id) {
        return $http.delete(apiEndpoint + 'media/' + id).then(handleSuccess, handleError('Error deleting media'));
    }

    // private functions

    function handleSuccess(res) {
        console.log('API response:' + JSON.stringify(res.data));
        return { success: true, data: res.data };
    }

    function handleError(error) {
        console.log('Failed');
        console.log(error);
        return function () {
            return { success: false, message: error };
        };
    }

    var service = {};
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByName = GetByName;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    return service;
}