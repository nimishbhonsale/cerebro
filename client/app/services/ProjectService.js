'use strict';

angular
    .module('myApp.services')
    .factory('ProjectService', ProjectService);

ProjectService.$inject = ['$http', 'ConfigService'];
function ProjectService($http, ConfigService) {

    var apiEndpoint = ConfigService.GetEndpoint();

    var service = {};
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByName = GetByName;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    return service;

    function GetAll() {
        return $http.get(apiEndpoint + 'projects').then(handleSuccess, handleError('Error getting all project'));
    }

    function GetById(id) {
        return $http.get(apiEndpoint + 'projects/' + id).then(handleSuccess, handleError('Error getting project by id'));
    }

    function GetByName(name) {
        return $http.get(apiEndpoint + 'projects?name=' + name).then(handleSuccess, handleError('Error getting project by name'));
    }

    function Create(project) {
        console.log(project);
        return $http.post(apiEndpoint + 'projects', project).then(handleSuccess, handleError('Error creating project'));
    }

    function Update(project) {
        return $http.put(apiEndpoint + 'projects/' + project._id, project).then(handleSuccess, handleError('Error updating project'));
    }

    function Delete(id) {
        return $http.delete(apiEndpoint + 'projects/' + id).then(handleSuccess, handleError('Error deleting project'));
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
}