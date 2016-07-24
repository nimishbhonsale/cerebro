'use strict';

angular
    .module('myApp.services')
    .factory('UserService', UserService);

UserService.$inject = ['$http', 'ConfigService'];
function UserService($http, ConfigService) {

    var apiEndpoint = ConfigService.GetEndpoint();

    var service = {};
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.GetByName = GetByName;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    return service;

    function GetAll() {
        return $http.get(apiEndpoint + 'users').then(handleSuccess, handleError('Error getting all users'));
    }

    function GetById(id) {
        return $http.get(apiEndpoint + 'users/' + id).then(handleSuccess, handleError('Error getting user by id'));
    }

    function GetByUsername(username) {
        return $http.get(apiEndpoint + 'users?username=' + username).then(handleSuccess, handleError('Error getting user by username'));
    }

    function GetByName(name) {
        return $http.get(apiEndpoint + 'users?name=' + name).then(handleSuccess, handleError('Error getting user by username'));
    }

    function Create(user) {
        return $http.post(apiEndpoint + 'users', user).then(handleSuccess, handleError('Error creating user'));
    }
    function Update(user) {
        return $http.put(apiEndpoint + 'users/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
    }

    function Delete(id) {
        return $http.delete(apiEndpoint + 'users/' + id).then(handleSuccess, handleError('Error deleting user'));
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